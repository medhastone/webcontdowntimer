import { NextRequest, NextResponse } from 'next/server';

export interface RemoteStageRoomState {
  roomId: string;
  eventName: string;
  sessionId: string;
  sessionTitle: string;
  remainingSeconds: number;
  totalSeconds: number;
  isRunning: boolean;
  warningMinutes: number;
  displayTheme: 'Normal' | 'High Contrast' | 'Light';
  cueMessage?: string;
  updatedAtMs: number;
}

interface StoredRoomRecord {
  controllerSecretHash: string;
  state: RemoteStageRoomState;
}

// Server-side in-memory real-time room store (persisted across hot reloads via globalThis)
const globalForStageSync = globalThis as unknown as {
  stageSyncRooms?: Map<string, StoredRoomRecord>;
};

const roomStore: Map<string, StoredRoomRecord> =
  globalForStageSync.stageSyncRooms ?? new Map<string, StoredRoomRecord>();

if (!globalForStageSync.stageSyncRooms) {
  globalForStageSync.stageSyncRooms = roomStore;
}

function sanitizeRoomId(raw: string | null): string {
  if (!raw) return 'global-product-summit';
  return raw.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64) || 'global-product-summit';
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const roomId = sanitizeRoomId(searchParams.get('room'));

  const record = roomStore.get(roomId);
  if (!record) {
    return NextResponse.json({
      synced: true,
      roomId,
      state: null,
      serverTimeMs: Date.now(),
    });
  }

  // Compute drift-compensated remainingSeconds if timer is actively running
  let compensatedRemaining = record.state.remainingSeconds;
  if (record.state.isRunning) {
    const elapsedSinceUpdateSec = Math.floor((Date.now() - record.state.updatedAtMs) / 1000);
    compensatedRemaining = record.state.remainingSeconds - elapsedSinceUpdateSec;
  }

  // Never expose controllerSecretHash to public audience viewers
  return NextResponse.json({
    synced: true,
    roomId,
    state: {
      ...record.state,
      remainingSeconds: compensatedRemaining,
    },
    serverTimeMs: Date.now(),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const roomId = sanitizeRoomId(body.roomId);
    const controllerToken = typeof body.controllerToken === 'string' ? body.controllerToken.trim() : '';

    if (!controllerToken || controllerToken.length < 6) {
      return NextResponse.json(
        { error: 'Valid controller session token required to update stage timer state.' },
        { status: 401 }
      );
    }

    const existing = roomStore.get(roomId);
    if (existing && existing.controllerSecretHash !== controllerToken) {
      return NextResponse.json(
        { error: 'Unauthorized: Room is controlled by another active stage manager session.' },
        { status: 403 }
      );
    }

    const nextState: RemoteStageRoomState = {
      roomId,
      eventName: String(body.eventName || 'Global Product Summit').slice(0, 100),
      sessionId: String(body.sessionId || 'session-1').slice(0, 64),
      sessionTitle: String(body.sessionTitle || 'Opening Keynote').slice(0, 120),
      remainingSeconds: Number.isFinite(Number(body.remainingSeconds))
        ? Math.floor(Number(body.remainingSeconds))
        : 765,
      totalSeconds: Number.isFinite(Number(body.totalSeconds))
        ? Math.max(1, Math.floor(Number(body.totalSeconds)))
        : 1800,
      isRunning: Boolean(body.isRunning),
      warningMinutes: Number.isFinite(Number(body.warningMinutes))
        ? Math.max(0, Number(body.warningMinutes))
        : 2,
      displayTheme:
        body.displayTheme === 'High Contrast' || body.displayTheme === 'Light'
          ? body.displayTheme
          : 'Normal',
      cueMessage: body.cueMessage ? String(body.cueMessage).slice(0, 160) : '',
      updatedAtMs: Date.now(),
    };

    roomStore.set(roomId, {
      controllerSecretHash: controllerToken,
      state: nextState,
    });

    return NextResponse.json({
      synced: true,
      roomId,
      updatedAtMs: nextState.updatedAtMs,
    });
  } catch {
    return NextResponse.json({ error: 'Invalid synchronization payload.' }, { status: 400 });
  }
}

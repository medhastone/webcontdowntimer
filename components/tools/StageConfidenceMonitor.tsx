'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Maximize2, Minimize2, Radio, ArrowLeft, Volume2, VolumeX, AlertCircle } from 'lucide-react';
import { requestWakeLock, releaseWakeLock } from '@/lib/wakelock';
import { playTimerSound } from '@/lib/sound';

interface StageConfidenceMonitorProps {
  roomId: string;
}

interface SyncPayload {
  roomId: string;
  eventName?: string;
  sessionId?: string;
  sessionTitle?: string;
  speakerName?: string;
  remainingSeconds: number;
  totalSeconds: number;
  isRunning: boolean;
  isCompleted?: boolean;
  overtimeSeconds?: number;
  cueMessage?: string;
  messageVisible?: boolean;
  theme?: 'Normal' | 'High Contrast' | 'Light';
  nextSessionTitle?: string;
}

export default function StageConfidenceMonitor({ roomId }: StageConfidenceMonitorProps) {
  const [remainingSec, setRemainingSec] = useState<number>(765); // default 12:45
  const [totalSec, setTotalSec] = useState<number>(1800); // 30:00
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [sessionTitle, setSessionTitle] = useState<string>('Opening Keynote');
  const [speakerName, setSpeakerName] = useState<string>('Dr. Elena Rostova');
  const [nextSession, setNextSession] = useState<string>('Product Demonstration');
  const [cueMessage, setCueMessage] = useState<string>('');
  const [cueVisible, setCueVisible] = useState<boolean>(false);
  const [connected, setConnected] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement>(null);

  // Sync listener using BroadcastChannel and localStorage
  const handleIncomingState = useCallback((data: Partial<SyncPayload>) => {
    if (data.remainingSeconds !== undefined) setRemainingSec(data.remainingSeconds);
    if (data.totalSeconds !== undefined) setTotalSec(data.totalSeconds);
    if (data.isRunning !== undefined) setIsRunning(data.isRunning);
    if (data.sessionTitle) setSessionTitle(data.sessionTitle);
    if (data.speakerName) setSpeakerName(data.speakerName);
    if (data.nextSessionTitle) setNextSession(data.nextSessionTitle);
    if (data.cueMessage !== undefined) setCueMessage(data.cueMessage);
    if (data.messageVisible !== undefined) setCueVisible(data.messageVisible);
    setConnected(true);
  }, []);

  useEffect(() => {
    // Acquire wake lock on mount
    requestWakeLock();

    let channel: BroadcastChannel | null = null;
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        channel = new BroadcastChannel(`ttg_stage_${roomId}`);
        channel.onmessage = (event) => {
          if (event.data && typeof event.data === 'object') {
            handleIncomingState(event.data);
          }
        };

        // Send handshake request to controller if active
        channel.postMessage({ type: 'VIEWER_HELLO', roomId });
      }
    } catch (e) {
      console.warn('BroadcastChannel error', e);
    }

    // Check localStorage snapshot asynchronously to avoid cascading render warnings
    const storageKey = `chronos_stage_sync_${roomId}`;
    const legacyKey = `ttg_stage_state_${roomId}`;
    if (typeof window !== 'undefined') {
      const timer = setTimeout(() => {
        try {
          const stored = localStorage.getItem(storageKey) || localStorage.getItem(legacyKey);
          if (stored) {
            handleIncomingState(JSON.parse(stored));
          }
        } catch {
          // ignore
        }
      }, 0);

      const handleStorage = (e: StorageEvent) => {
        if ((e.key === storageKey || e.key === legacyKey) && e.newValue) {
          try {
            handleIncomingState(JSON.parse(e.newValue));
          } catch {
            // ignore
          }
        }
      };
      window.addEventListener('storage', handleStorage);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('storage', handleStorage);
        if (channel) channel.close();
        releaseWakeLock();
      };
    }

    return () => {
      if (channel) channel.close();
      releaseWakeLock();
    };
  }, [roomId, handleIncomingState]);

  // Local tick countdown if running
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setRemainingSec((prev) => {
        const next = prev - 1;
        if (next === 120 && soundEnabled) {
          playTimerSound('warning', 0.5);
        }
        if (next === 0 && soundEnabled) {
          playTimerSound('bell', 0.8);
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, soundEnabled]);

  // Fullscreen toggle
  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        const orientation = (screen as unknown as { orientation?: { lock?: (mode: string) => Promise<void> } }).orientation;
        orientation?.lock?.('landscape')?.catch(() => {});
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        const orientation = (screen as unknown as { orientation?: { unlock?: () => void } }).orientation;
        orientation?.unlock?.();
        setIsFullscreen(false);
      }
    } catch {
      setIsFullscreen((prev) => !prev);
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        setSoundEnabled((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const isOvertime = remainingSec < 0;
  const absSeconds = Math.abs(remainingSec);
  const mins = Math.floor(absSeconds / 60);
  const secs = absSeconds % 60;
  const formattedDigits = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const warningThresholdSec = 120; // 2 minutes
  const isWarning = !isOvertime && remainingSec <= warningThresholdSec && remainingSec > 0;
  const isZero = remainingSec === 0;

  // Colors according to Stage Timer specifications
  const digitColorClass = isOvertime || isZero
    ? 'text-red-500 animate-pulse'
    : isWarning
    ? 'text-amber-400'
    : 'text-emerald-400';

  const progressFraction = totalSec > 0 ? Math.max(0, Math.min(1, remainingSec / totalSec)) : 0;

  return (
    <div
      ref={containerRef}
      className={`${
        isFullscreen ? 'timer-fullscreen-stage flex flex-col items-center justify-center' : 'min-h-screen w-full flex flex-col justify-between p-4 sm:p-8'
      } bg-[#05070B] text-white select-none overflow-hidden relative`}
    >
      {/* Fullscreen Exit Button in Corner */}
      {isFullscreen && (
        <button
          type="button"
          onClick={toggleFullscreen}
          className="absolute top-4 right-4 z-50 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-black/55 hover:bg-black/75 text-white border border-white/20 backdrop-blur-md text-xs font-semibold shadow-lg transition-all cursor-pointer"
          aria-label="Exit Fullscreen"
        >
          <Minimize2 className="w-4 h-4" />
          <span>Exit Fullscreen</span>
        </button>
      )}

      {/* Top Header Bar: Session Details & Status */}
      {!isFullscreen && (
        <div className="flex items-center justify-between gap-4 z-10 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <Link prefetch={false}
              href={`/stage-timer?room=${encodeURIComponent(roomId)}`}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Return to Stage Controller"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-500 font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-ping" />
                <span>Room: {roomId}</span>
                <span className="text-slate-600">•</span>
                <span className={connected ? 'text-emerald-400' : 'text-slate-500'}>
                  {connected ? 'LIVE SYNC ACTIVE' : 'LOCAL CACHE READY'}
                </span>
              </div>
              <h1 className="text-lg sm:text-2xl font-black tracking-tight text-white mt-0.5">
                {sessionTitle} {speakerName && <span className="text-slate-400 font-normal sm:text-xl">— {speakerName}</span>}
              </h1>
            </div>
          </div>

          {/* Right utility buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSoundEnabled((p) => !p)}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold flex items-center gap-1.5"
              title="Toggle Sound Alert (M)"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">{soundEnabled ? 'Chime On' : 'Muted'}</span>
            </button>

            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold flex items-center gap-1.5"
              title="Fullscreen Mode (F)"
            >
              <Maximize2 className="w-4 h-4" />
              <span className="hidden sm:inline">Fullscreen</span>
            </button>
          </div>
        </div>
      )}

      {/* Operator Live Message / Cue Banner (if visible or message set) */}
      {(cueVisible && cueMessage) && !isFullscreen && (
        <div className="my-2 z-20 w-full animate-bounce">
          <div className="bg-amber-500 text-slate-950 font-black text-center text-xl sm:text-3xl py-3 px-6 rounded-2xl shadow-2xl uppercase tracking-wider flex items-center justify-center gap-3">
            <AlertCircle className="w-8 h-8 shrink-0" />
            <span>{cueMessage}</span>
          </div>
        </div>
      )}

      {/* Main Massive Time Readout Center */}
      <div className="flex-1 w-full px-6 flex flex-col items-center justify-center text-center my-auto py-4">
        {/* Overtime or State Tag */}
        {!isFullscreen && (
          <div className="mb-2">
            {isOvertime ? (
              <span className="px-5 py-2 rounded-xl bg-red-600 text-white font-mono font-black text-base sm:text-xl uppercase tracking-widest animate-pulse">
                OVERTIME (+{formattedDigits})
              </span>
            ) : isZero ? (
              <span className="px-5 py-2 rounded-xl bg-red-600 text-white font-mono font-black text-base sm:text-xl uppercase tracking-widest">
                TIME COMPLETED
              </span>
            ) : isWarning ? (
              <span className="px-5 py-2 rounded-xl bg-amber-400 text-slate-950 font-mono font-black text-base sm:text-xl uppercase tracking-widest">
                WRAP UP — FINAL 2 MINUTES
              </span>
            ) : (
              <span className="px-4 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 font-mono text-sm uppercase tracking-wider">
                {isRunning ? 'COUNTDOWN IN PROGRESS' : 'TIMER PAUSED'}
              </span>
            )}
          </div>
        )}

        {/* Giant Number Display (Responsive across mobile, tablet, 4K monitors) */}
        <div
          className={`font-mono font-black tabular-nums tracking-tighter leading-none select-none transition-colors duration-200 ${
            isFullscreen ? 'text-[clamp(4.5rem,22vmin,16rem)]' : 'text-[18vw] sm:text-[22vw] lg:text-[20vw] xl:text-[240px]'
          } ${digitColorClass}`}
        >
          {isOvertime ? `+${formattedDigits}` : formattedDigits}
        </div>

        {/* Progress Bar Strip */}
        <div className="w-full max-w-4xl h-4 sm:h-6 rounded-full bg-slate-900 border border-slate-800 p-0.5 overflow-hidden mt-6 relative shadow-inner">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isOvertime || isZero
                ? 'bg-red-500'
                : isWarning
                ? 'bg-amber-400'
                : 'bg-emerald-500'
            }`}
            style={{ width: `${isOvertime ? 100 : progressFraction * 100}%` }}
          />
        </div>
      </div>

      {/* Footer Info: Next Session & Keyboard Hints */}
      {!isFullscreen && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 z-10 border-t border-slate-800/80 pt-4 text-xs font-mono text-slate-500">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-bold uppercase tracking-wider">NEXT UP:</span>
            <span className="text-slate-300 font-semibold">{nextSession || 'End of Track'}</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">F</kbd> for Fullscreen</span>
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">M</kbd> to Mute</span>
          </div>
        </div>
      )}
    </div>
  );
}

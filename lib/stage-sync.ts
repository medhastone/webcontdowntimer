// Real-time synchronization engine for Stage Timers (Operator Controller <-> Stage/Audience Display)
// Uses BroadcastChannel API with localStorage event fallback for cross-window/cross-monitor zero-latency sync.

export interface StageTimerState {
  roomId: string;
  title: string;
  speakerName: string;
  totalDurationSeconds: number; // e.g. 1200 for 20m
  remainingSeconds: number;
  isRunning: boolean;
  isPaused: boolean;
  overtimeSeconds: number;
  lastUpdatedTimestamp: number; // Date.now()
  cueMessage: string; // custom message sent by operator to speaker screen
  messageVisible: boolean;
  theme: 'dark' | 'blackout' | 'high-contrast';
  showOvertime: boolean;
  flashOnZero: boolean;
  isCompleted: boolean;
}

export const DEFAULT_STAGE_STATE: StageTimerState = {
  roomId: 'main-stage',
  title: 'Keynote Session',
  speakerName: 'Main Speaker',
  totalDurationSeconds: 1200, // 20m
  remainingSeconds: 1200,
  isRunning: false,
  isPaused: false,
  overtimeSeconds: 0,
  lastUpdatedTimestamp: Date.now(),
  cueMessage: '',
  messageVisible: false,
  theme: 'blackout',
  showOvertime: true,
  flashOnZero: true,
  isCompleted: false,
};

export class StageSyncChannel {
  private channel: BroadcastChannel | null = null;
  private storageKey: string;
  private onStateChange: (state: StageTimerState) => void;

  constructor(roomId: string, onStateChange: (state: StageTimerState) => void) {
    this.storageKey = `chronos_stage_sync_${roomId}`;
    this.onStateChange = onStateChange;

    if (typeof window !== 'undefined') {
      try {
        if ('BroadcastChannel' in window) {
          this.channel = new BroadcastChannel(`chronos_stage_${roomId}`);
          this.channel.onmessage = (event) => {
            if (event.data && typeof event.data === 'object') {
              this.onStateChange(event.data as StageTimerState);
            }
          };
        }
      } catch (e) {
        console.warn('BroadcastChannel unavailable, falling back to storage events', e);
      }

      window.addEventListener('storage', this.handleStorageEvent);
    }
  }

  private handleStorageEvent = (event: StorageEvent) => {
    if (event.key === this.storageKey && event.newValue) {
      try {
        const parsed = JSON.parse(event.newValue);
        this.onStateChange(parsed);
      } catch {
        // ignore parse errors
      }
    }
  };

  public broadcast(state: StageTimerState) {
    const updated = {
      ...state,
      lastUpdatedTimestamp: Date.now(),
    };

    if (this.channel) {
      try {
        this.channel.postMessage(updated);
      } catch (err) {
        console.warn('BroadcastChannel error', err);
      }
    }

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(updated));
      } catch {
        // storage quota exceeded or disabled
      }
    }
  }

  public getInitialState(): StageTimerState {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          return { ...DEFAULT_STAGE_STATE, ...parsed };
        }
      } catch {
        // ignore
      }
    }
    return DEFAULT_STAGE_STATE;
  }

  public destroy() {
    if (this.channel) {
      this.channel.close();
      this.channel = null;
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', this.handleStorageEvent);
    }
  }
}

/**
 * Production Countdown Engine
 * Target-timestamp reference based timing. Prevents clock drift and handles tab suspension.
 */

import { CountdownConfig, CountdownState, TimerStatus } from './types';
import { ClockSource, defaultClock, msToTimeUnits } from './monotonic-clock';

export class CountdownEngine {
  private clock: ClockSource;
  private config: CountdownConfig;

  private status: TimerStatus = 'idle';
  private initialDurationMs: number = 0;
  private remainingMs: number = 0;
  private overtimeMs: number = 0;
  private targetTimestamp: number = 0; // clock.now() + remainingMs
  private overtimeStartTimestamp: number = 0;

  private completionFired: boolean = false;
  private warningFired: boolean = false;

  private tickInterval: NodeJS.Timeout | null = null;
  private listeners: Set<(state: CountdownState) => void> = new Set();
  private visibilityListenerAttached: boolean = false;

  constructor(config: CountdownConfig, clock: ClockSource = defaultClock) {
    this.clock = clock;
    this.config = { ...config };
    this.initDuration(config.initialDurationMs);

    // Auto-sync on visibilitychange in browser environments
    if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
      this.attachVisibilityListener();
    }
  }

  private initDuration(durationMs: number): void {
    const validMs = isFinite(durationMs) && durationMs > 0 ? Math.floor(durationMs) : 0;
    this.initialDurationMs = validMs;
    this.remainingMs = validMs;
    this.overtimeMs = 0;
    this.status = 'idle';
    this.completionFired = false;
    this.warningFired = false;
  }

  private attachVisibilityListener(): void {
    if (this.visibilityListenerAttached) return;
    this.visibilityListenerAttached = true;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && this.status === 'running') {
        this.syncWithRealTime();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
  }

  /**
   * Recalculates remaining or overtime milliseconds using recorded target timestamps.
   * Eliminates drift during background tab throttling or device sleep.
   */
  public syncWithRealTime(): CountdownState {
    if (this.status !== 'running' && this.status !== 'overtime') {
      return this.getState();
    }

    const now = this.clock.now();

    if (this.status === 'running') {
      const remaining = this.targetTimestamp - now;

      if (remaining > 0) {
        this.remainingMs = remaining;

        // Check warning threshold
        const warningMs = this.config.warningThresholdMs ?? 0;
        if (warningMs > 0 && remaining <= warningMs && !this.warningFired) {
          this.warningFired = true;
          this.config.onWarning?.();
        }
      } else {
        // Reached zero
        this.remainingMs = 0;

        if (!this.completionFired) {
          this.completionFired = true;
          this.config.onComplete?.();
        }

        if (this.config.allowOvertime) {
          this.status = 'overtime';
          this.overtimeStartTimestamp = this.targetTimestamp;
          this.overtimeMs = Math.max(0, now - this.overtimeStartTimestamp);
        } else {
          this.status = 'completed';
          this.stopTicking();
        }
      }
    } else if (this.status === 'overtime') {
      this.overtimeMs = Math.max(0, now - this.overtimeStartTimestamp);
    }

    this.notify();
    return this.getState();
  }

  /**
   * Start timer. Idempotent: safe against repeated clicks.
   */
  public start(): boolean {
    if (this.status === 'running' || this.status === 'overtime') {
      return false; // Already running
    }

    if (this.remainingMs <= 0 && !this.config.allowOvertime) {
      return false; // Invalid or completed
    }

    const now = this.clock.now();

    if (this.status === 'idle' || this.status === 'paused') {
      this.targetTimestamp = now + this.remainingMs;
      this.status = 'running';
      this.startTicking();
      this.notify();
      return true;
    }

    return false;
  }

  /**
   * Pause timer. Freezes remaining duration.
   */
  public pause(): boolean {
    if (this.status !== 'running' && this.status !== 'overtime') {
      return false;
    }

    this.syncWithRealTime();
    this.stopTicking();
    this.status = 'paused';
    this.notify();
    return true;
  }

  /**
   * Resume timer from paused state.
   */
  public resume(): boolean {
    if (this.status !== 'paused') {
      return false;
    }
    return this.start();
  }

  /**
   * Toggle between start/resume and pause.
   */
  public toggle(): void {
    if (this.status === 'running' || this.status === 'overtime') {
      this.pause();
    } else {
      this.start();
    }
  }

  /**
   * Reset timer back to its initial configured duration.
   */
  public reset(): void {
    this.stopTicking();
    this.remainingMs = this.initialDurationMs;
    this.overtimeMs = 0;
    this.status = 'idle';
    this.completionFired = false;
    this.warningFired = false;
    this.notify();
  }

  /**
   * Set a new initial duration and reset timer.
   */
  public setDuration(newDurationMs: number): void {
    this.stopTicking();
    this.initDuration(newDurationMs);
    this.notify();
  }

  /**
   * Adjust remaining time by delta milliseconds (can be positive or negative)
   */
  public adjustTime(deltaMs: number): void {
    if (!isFinite(deltaMs) || deltaMs === 0) return;

    if (this.status === 'overtime') {
      // In overtime, adjusting backwards can bring it back into normal countdown
      const newOvertime = this.overtimeMs - deltaMs;
      if (newOvertime <= 0) {
        this.status = 'running';
        this.remainingMs = Math.abs(newOvertime);
        this.targetTimestamp = this.clock.now() + this.remainingMs;
        this.overtimeMs = 0;
        this.completionFired = false;
      } else {
        this.overtimeMs = newOvertime;
        this.overtimeStartTimestamp = this.clock.now() - newOvertime;
      }
    } else {
      const newRemaining = Math.max(0, this.remainingMs + deltaMs);
      this.remainingMs = newRemaining;

      if (this.status === 'running') {
        this.targetTimestamp = this.clock.now() + newRemaining;
      }

      if (newRemaining > (this.config.warningThresholdMs ?? 0)) {
        this.warningFired = false;
      }
    }

    this.notify();
  }

  /**
   * Update configuration options dynamically
   */
  public updateConfig(newConfig: Partial<CountdownConfig>): void {
    this.config = { ...this.config, ...newConfig };
    if (newConfig.initialDurationMs !== undefined && this.status === 'idle') {
      this.initDuration(newConfig.initialDurationMs);
    }
    this.notify();
  }

  /**
   * Internal tick scheduling with 100ms interval for smooth, responsive UI
   */
  private startTicking(): void {
    this.stopTicking();
    this.tickInterval = setInterval(() => {
      this.syncWithRealTime();
    }, 100);
  }

  private stopTicking(): void {
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
  }

  /**
   * Get immutable snapshot of current state
   */
  public getState(): CountdownState {
    const warningMs = this.config.warningThresholdMs ?? 0;
    const isWarning =
      (this.status === 'running' || this.status === 'paused') &&
      warningMs > 0 &&
      this.remainingMs > 0 &&
      this.remainingMs <= warningMs;

    const progressPercent =
      this.initialDurationMs > 0
        ? Math.max(0, Math.min(100, ((this.initialDurationMs - this.remainingMs) / this.initialDurationMs) * 100))
        : 0;

    return {
      status: this.status,
      initialDurationMs: this.initialDurationMs,
      remainingMs: this.remainingMs,
      overtimeMs: this.overtimeMs,
      isWarning,
      progressPercent,
      timeUnits: msToTimeUnits(this.status === 'overtime' ? this.overtimeMs : this.remainingMs),
    };
  }

  /**
   * Subscribe to state updates. Returns cleanup function.
   */
  public subscribe(listener: (state: CountdownState) => void): () => void {
    this.listeners.add(listener);
    listener(this.getState());

    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    const state = this.getState();
    this.config.onTick?.(state);
    this.listeners.forEach((listener) => {
      try {
        listener(state);
      } catch (err) {
        console.error('Error in CountdownEngine listener:', err);
      }
    });
  }

  /**
   * Tear down and clean up timers
   */
  public destroy(): void {
    this.stopTicking();
    this.listeners.clear();
  }
}

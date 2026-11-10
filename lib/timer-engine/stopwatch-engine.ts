/**
 * Monotonic High-Precision Stopwatch Engine
 */

import { StopwatchLap, StopwatchState } from './types';
import { ClockSource, defaultClock } from './monotonic-clock';

export class StopwatchEngine {
  private clock: ClockSource;
  private status: 'idle' | 'running' | 'paused' = 'idle';

  private startAnchorTime: number = 0;
  private accumulatedElapsedMs: number = 0;
  private lastLapAnchorTime: number = 0;

  private laps: StopwatchLap[] = [];
  private tickInterval: NodeJS.Timeout | null = null;
  private listeners: Set<(state: StopwatchState) => void> = new Set();

  constructor(clock: ClockSource = defaultClock) {
    this.clock = clock;
  }

  public start(): boolean {
    if (this.status === 'running') return false;

    const now = this.clock.now();
    if (this.status === 'idle') {
      this.startAnchorTime = now;
      this.lastLapAnchorTime = now;
      this.accumulatedElapsedMs = 0;
      this.laps = [];
    } else if (this.status === 'paused') {
      this.startAnchorTime = now;
      this.lastLapAnchorTime = now;
    }

    this.status = 'running';
    this.startTicking();
    this.notify();
    return true;
  }

  public pause(): boolean {
    if (this.status !== 'running') return false;

    const now = this.clock.now();
    this.accumulatedElapsedMs += now - this.startAnchorTime;
    this.stopTicking();
    this.status = 'paused';
    this.notify();
    return true;
  }

  public resume(): boolean {
    if (this.status !== 'paused') return false;
    return this.start();
  }

  public toggle(): void {
    if (this.status === 'running') {
      this.pause();
    } else {
      this.start();
    }
  }

  public reset(): void {
    this.stopTicking();
    this.status = 'idle';
    this.accumulatedElapsedMs = 0;
    this.startAnchorTime = 0;
    this.lastLapAnchorTime = 0;
    this.laps = [];
    this.notify();
  }

  public lap(): StopwatchLap | null {
    if (this.status === 'idle') return null;

    const currentTotal = this.getElapsedMs();
    const previousTotal = this.laps.length > 0 ? this.laps[0].overallTimeMs : 0;
    const lapTimeMs = Math.max(0, currentTotal - previousTotal);

    const newLap: StopwatchLap = {
      lapIndex: this.laps.length + 1,
      lapTimeMs,
      overallTimeMs: currentTotal,
    };

    // Store newest lap first for easy display
    this.laps = [newLap, ...this.laps];
    this.lastLapAnchorTime = this.clock.now();
    this.notify();
    return newLap;
  }

  public getElapsedMs(): number {
    if (this.status === 'running') {
      return this.accumulatedElapsedMs + (this.clock.now() - this.startAnchorTime);
    }
    return this.accumulatedElapsedMs;
  }

  public getCurrentLapTimeMs(): number {
    if (this.status === 'idle') return 0;
    const total = this.getElapsedMs();
    const previousTotal = this.laps.length > 0 ? this.laps[0].overallTimeMs : 0;
    return Math.max(0, total - previousTotal);
  }

  public getState(): StopwatchState {
    return {
      status: this.status,
      elapsedMs: this.getElapsedMs(),
      laps: [...this.laps],
      currentLapTimeMs: this.getCurrentLapTimeMs(),
    };
  }

  private startTicking(): void {
    this.stopTicking();
    // 33ms (~30fps) for smooth centisecond display
    this.tickInterval = setInterval(() => {
      this.notify();
    }, 33);
  }

  private stopTicking(): void {
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
  }

  public subscribe(listener: (state: StopwatchState) => void): () => void {
    this.listeners.add(listener);
    listener(this.getState());

    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    const state = this.getState();
    this.listeners.forEach((l) => {
      try {
        l(state);
      } catch (err) {
        console.error('Error in StopwatchEngine listener:', err);
      }
    });
  }

  public destroy(): void {
    this.stopTicking();
    this.listeners.clear();
  }
}

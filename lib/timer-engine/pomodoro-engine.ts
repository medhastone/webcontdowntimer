/**
 * Flexible Pomodoro Engine
 */

import { PomodoroConfig, PomodoroMode, PomodoroState, TimerStatus } from './types';
import { ClockSource, defaultClock } from './monotonic-clock';

export interface PomodoroCallbacks {
  onSessionComplete?: (mode: PomodoroMode, sessionNumber: number) => void;
  onModeChange?: (newMode: PomodoroMode) => void;
}

export class PomodoroEngine {
  private clock: ClockSource;
  private config: PomodoroConfig;
  private callbacks: PomodoroCallbacks;

  private mode: PomodoroMode = 'work';
  private status: TimerStatus = 'idle';
  private remainingMs: number = 0;
  private targetTimestamp: number = 0;
  private completedPomodoros: number = 0;
  private taskTitle: string = '';

  private tickInterval: NodeJS.Timeout | null = null;
  private listeners: Set<(state: PomodoroState) => void> = new Set();

  constructor(
    config?: Partial<PomodoroConfig>,
    callbacks: PomodoroCallbacks = {},
    clock: ClockSource = defaultClock
  ) {
    this.clock = clock;
    this.callbacks = callbacks;
    this.config = {
      workDurationMs: config?.workDurationMs ?? 25 * 60 * 1000,
      shortBreakDurationMs: config?.shortBreakDurationMs ?? 5 * 60 * 1000,
      longBreakDurationMs: config?.longBreakDurationMs ?? 15 * 60 * 1000,
      longBreakInterval: config?.longBreakInterval ?? 4,
    };
    this.remainingMs = this.config.workDurationMs;
  }

  public setMode(mode: PomodoroMode): void {
    this.stopTicking();
    this.mode = mode;
    this.status = 'idle';
    this.remainingMs = this.getDurationForMode(mode);
    this.callbacks.onModeChange?.(mode);
    this.notify();
  }

  public setTaskTitle(title: string): void {
    this.taskTitle = title;
    this.notify();
  }

  public setCallbacks(callbacks: PomodoroCallbacks): void {
    this.callbacks = callbacks;
  }

  private getDurationForMode(mode: PomodoroMode): number {
    switch (mode) {
      case 'work':
        return this.config.workDurationMs;
      case 'shortBreak':
        return this.config.shortBreakDurationMs;
      case 'longBreak':
        return this.config.longBreakDurationMs;
    }
  }

  public start(): boolean {
    if (this.status === 'running') return false;

    if (this.status === 'completed' || this.remainingMs <= 0) {
      this.remainingMs = this.getDurationForMode(this.mode);
    }

    const now = this.clock.now();
    this.targetTimestamp = now + this.remainingMs;
    this.status = 'running';
    this.startTicking();
    this.notify();
    return true;
  }

  public pause(): boolean {
    if (this.status !== 'running') return false;

    this.sync();
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
    this.remainingMs = this.getDurationForMode(this.mode);
    this.notify();
  }

  public sync(): PomodoroState {
    if (this.status !== 'running') return this.getState();

    const now = this.clock.now();
    const remaining = this.targetTimestamp - now;

    if (remaining > 0) {
      this.remainingMs = remaining;
    } else {
      this.remainingMs = 0;
      this.status = 'completed';
      this.stopTicking();

      if (this.mode === 'work') {
        this.completedPomodoros += 1;
      }

      this.callbacks.onSessionComplete?.(this.mode, this.completedPomodoros);

      // Auto suggest next mode
      if (this.mode === 'work') {
        if (this.completedPomodoros % this.config.longBreakInterval === 0) {
          this.setMode('longBreak');
        } else {
          this.setMode('shortBreak');
        }
      } else {
        this.setMode('work');
      }
    }

    this.notify();
    return this.getState();
  }

  private startTicking(): void {
    this.stopTicking();
    this.tickInterval = setInterval(() => {
      this.sync();
    }, 100);
  }

  private stopTicking(): void {
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
  }

  public getState(): PomodoroState {
    return {
      mode: this.mode,
      status: this.status,
      remainingMs: this.remainingMs,
      totalMs: this.getDurationForMode(this.mode),
      completedPomodoros: this.completedPomodoros,
      taskTitle: this.taskTitle,
    };
  }

  public subscribe(listener: (state: PomodoroState) => void): () => void {
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
        console.error('Error in PomodoroEngine listener:', err);
      }
    });
  }

  public destroy(): void {
    this.stopTicking();
    this.listeners.clear();
  }
}

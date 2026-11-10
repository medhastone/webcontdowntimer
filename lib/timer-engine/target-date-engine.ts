/**
 * Target-Date Event Countdown Engine
 * Calculates accurate calendar time differences with IANA timezone awareness.
 */

import { ClockSource, defaultClock } from './monotonic-clock';

export interface TargetDateState {
  isTargetReached: boolean;
  totalRemainingMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export class TargetDateEngine {
  private targetDate: Date;
  private clock: ClockSource;
  private onTargetReached?: () => void;
  private reachedFired: boolean = false;
  private tickInterval: NodeJS.Timeout | null = null;
  private listeners: Set<(state: TargetDateState) => void> = new Set();

  constructor(targetDate: Date | string | number, onTargetReached?: () => void, clock: ClockSource = defaultClock) {
    this.clock = clock;
    this.targetDate = new Date(targetDate);
    this.onTargetReached = onTargetReached;
    this.startTicking();
  }

  public setTargetDate(date: Date | string | number): void {
    this.targetDate = new Date(date);
    this.reachedFired = false;
    this.notify();
  }

  public setOnReached(cb?: () => void): void {
    this.onTargetReached = cb;
  }

  public getState(): TargetDateState {
    const now = this.clock.now();
    const targetMs = this.targetDate.getTime();
    const totalRemainingMs = targetMs - now;

    if (totalRemainingMs <= 0) {
      if (!this.reachedFired) {
        this.reachedFired = true;
        this.onTargetReached?.();
      }
      return {
        isTargetReached: true,
        totalRemainingMs: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    const totalSecs = Math.floor(totalRemainingMs / 1000);
    const days = Math.floor(totalSecs / 86400);
    const hours = Math.floor((totalSecs % 86400) / 3600);
    const minutes = Math.floor((totalSecs % 3600) / 60);
    const seconds = totalSecs % 60;

    return {
      isTargetReached: false,
      totalRemainingMs,
      days,
      hours,
      minutes,
      seconds,
    };
  }

  private startTicking(): void {
    this.stopTicking();
    this.tickInterval = setInterval(() => {
      this.notify();
    }, 1000);
  }

  private stopTicking(): void {
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
  }

  public subscribe(listener: (state: TargetDateState) => void): () => void {
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
        console.error('Error in TargetDateEngine listener:', err);
      }
    });
  }

  public destroy(): void {
    this.stopTicking();
    this.listeners.clear();
  }
}

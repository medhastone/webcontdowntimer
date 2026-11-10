/**
 * Monotonic Clock and Time Utilities
 * Supports real performance timing and mock clock injection for unit testing.
 */

import { TimeUnits } from './types';

export interface ClockSource {
  now(): number;
}

/**
 * Standard system clock combining performance.now() and Date.now()
 */
export class SystemClock implements ClockSource {
  private baseDateNow: number;
  private basePerfNow: number;

  constructor() {
    this.baseDateNow = Date.now();
    this.basePerfNow = typeof performance !== 'undefined' ? performance.now() : 0;
  }

  now(): number {
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
      return this.baseDateNow + (performance.now() - this.basePerfNow);
    }
    return Date.now();
  }
}

/**
 * Controllable Mock Clock for deterministic automated tests
 */
export class MockClock implements ClockSource {
  private currentTime: number;

  constructor(initialTime: number = 1000000) {
    this.currentTime = initialTime;
  }

  now(): number {
    return this.currentTime;
  }

  advance(ms: number): void {
    if (ms < 0) throw new Error('Cannot advance clock backwards in mock');
    this.currentTime += ms;
  }

  setTime(timeMs: number): void {
    this.currentTime = timeMs;
  }
}

export const defaultClock: ClockSource = new SystemClock();

/**
 * Convert milliseconds into decomposed hours, minutes, seconds, milliseconds.
 */
export function msToTimeUnits(totalMs: number): TimeUnits {
  const safeMs = Math.max(0, Math.floor(totalMs));
  const totalSeconds = Math.floor(safeMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = safeMs % 1000;

  return {
    hours,
    minutes,
    seconds,
    milliseconds,
  };
}

/**
 * Format milliseconds into HH:MM:SS or MM:SS string
 */
export function formatDuration(totalMs: number, options?: { showHoursAlways?: boolean; showCenti?: boolean }): string {
  const { hours, minutes, seconds, milliseconds = 0 } = msToTimeUnits(totalMs);
  const sStr = String(seconds).padStart(2, '0');
  const mStr = String(minutes).padStart(2, '0');
  const hStr = String(hours).padStart(2, '0');

  let base = '';
  if (hours > 0 || options?.showHoursAlways) {
    base = `${hStr}:${mStr}:${sStr}`;
  } else {
    base = `${mStr}:${sStr}`;
  }

  if (options?.showCenti) {
    const centi = String(Math.floor(milliseconds / 10)).padStart(2, '0');
    return `${base}.${centi}`;
  }

  return base;
}

/**
 * Parse input string or units into safe milliseconds
 */
export function parseToMilliseconds(input: { hours?: number; minutes?: number; seconds?: number } | string | number): number {
  if (typeof input === 'number') {
    return isFinite(input) && input > 0 ? Math.floor(input) : 0;
  }

  if (typeof input === 'string') {
    const trimmed = input.trim();
    // Parse "15m", "1h 30m", "45s"
    const hourMatch = trimmed.match(/(\d+)\s*h/i);
    const minMatch = trimmed.match(/(\d+)\s*m/i);
    const secMatch = trimmed.match(/(\d+)\s*s/i);

    if (hourMatch || minMatch || secMatch) {
      const h = hourMatch ? parseInt(hourMatch[1], 10) : 0;
      const m = minMatch ? parseInt(minMatch[1], 10) : 0;
      const s = secMatch ? parseInt(secMatch[1], 10) : 0;
      return ((h * 3600) + (m * 60) + s) * 1000;
    }

    // Parse "HH:MM:SS" or "MM:SS"
    const parts = trimmed.split(':').map((p) => parseInt(p, 10));
    if (parts.some(isNaN)) return 0;
    if (parts.length === 3) {
      return ((parts[0] * 3600) + (parts[1] * 60) + parts[2]) * 1000;
    } else if (parts.length === 2) {
      return ((parts[0] * 60) + parts[1]) * 1000;
    } else if (parts.length === 1) {
      return parts[0] * 1000;
    }
    return 0;
  }

  const h = input.hours && isFinite(input.hours) ? Math.max(0, input.hours) : 0;
  const m = input.minutes && isFinite(input.minutes) ? Math.max(0, input.minutes) : 0;
  const s = input.seconds && isFinite(input.seconds) ? Math.max(0, input.seconds) : 0;
  return ((h * 3600) + (m * 60) + s) * 1000;
}

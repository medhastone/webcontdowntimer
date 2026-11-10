/**
 * Core type definitions for Chronos Timing Engine
 * Standardized across all timers, tools, and pages.
 */

export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed' | 'overtime';

export interface TimeUnits {
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds?: number;
  days?: number;
  centiseconds?: number;
  totalMs?: number;
}

import type { SoundType } from '../sound';

export interface CountdownConfig {
  /** Initial duration in milliseconds */
  initialDurationMs: number;
  /** Warning threshold in milliseconds (e.g. 60,000 for 1 min warning) */
  warningThresholdMs?: number;
  /** Whether timer enters overtime counter after reaching zero */
  allowOvertime?: boolean;
  /** Audio tone or cue to trigger upon completion */
  soundType?: SoundType;
  /** Sound volume (0.0 to 1.0) */
  soundVolume?: number;
  /** Whether to trigger system browser notifications */
  browserNotification?: boolean;
  /** Label/title of the timer */
  title?: string;
  /** Callback fired once when timer reaches zero */
  onComplete?: () => void;
  /** Callback fired once when warning threshold is crossed */
  onWarning?: () => void;
  /** Callback on every state change */
  onTick?: (state: CountdownState) => void;
}

export interface CountdownState {
  status: TimerStatus;
  initialDurationMs: number;
  remainingMs: number;
  overtimeMs: number;
  isWarning: boolean;
  progressPercent: number; // 0 to 100
  timeUnits: TimeUnits;
}

export interface StopwatchLap {
  lapIndex: number;
  lapTimeMs: number;
  overallTimeMs: number;
}

export interface StopwatchState {
  status: 'idle' | 'running' | 'paused';
  elapsedMs: number;
  laps: StopwatchLap[];
  currentLapTimeMs: number;
}

export type IntervalPhaseType = 'prep' | 'work' | 'rest' | 'cooldown' | 'complete';

export interface IntervalSegmentConfig {
  prepDurationMs?: number;
  workDurationMs: number;
  restDurationMs: number;
  cooldownDurationMs?: number;
  totalSets: number;
}

export interface IntervalState {
  status: TimerStatus;
  currentPhase: IntervalPhaseType;
  currentSet: number;
  totalSets: number;
  phaseRemainingMs: number;
  phaseTotalMs: number;
  totalElapsedMs: number;
  totalWorkoutMs: number;
  progressPercent: number;
  nextPhaseName: string;
}

export type PomodoroMode = 'work' | 'shortBreak' | 'longBreak';

export interface PomodoroConfig {
  workDurationMs: number;
  shortBreakDurationMs: number;
  longBreakDurationMs: number;
  longBreakInterval: number; // default: 4 sessions
}

export interface PomodoroState {
  mode: PomodoroMode;
  status: TimerStatus;
  remainingMs: number;
  totalMs: number;
  completedPomodoros: number;
  taskTitle: string;
}

export interface ShareableTimerParams {
  d?: number; // duration in seconds
  w?: number; // warning threshold in seconds
  ot?: boolean; // allow overtime
  title?: string;
}

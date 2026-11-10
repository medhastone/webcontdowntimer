/**
 * Production Interval Engine
 * Validates against infinite/zero loops and drives Tabata, HIIT, boxing rounds.
 */

import { IntervalPhaseType, IntervalSegmentConfig, IntervalState, TimerStatus } from './types';
import { ClockSource, defaultClock } from './monotonic-clock';

export interface IntervalEngineCallbacks {
  onPhaseChange?: (phase: IntervalPhaseType, set: number) => void;
  onCue?: (cueType: 'prep' | 'work' | 'rest' | 'countdown' | 'complete') => void;
  onComplete?: () => void;
}

export class IntervalEngine {
  private clock: ClockSource;
  private config: IntervalSegmentConfig;
  private callbacks: IntervalEngineCallbacks;

  private status: TimerStatus = 'idle';
  private currentPhase: IntervalPhaseType = 'prep';
  private currentSet: number = 1;
  private phaseRemainingMs: number = 0;
  private phaseTargetTimestamp: number = 0;

  private totalWorkoutMs: number = 0;
  private totalElapsedMs: number = 0;
  private workoutStartTimestamp: number = 0;
  private accumulatedElapsedMs: number = 0;

  private tickInterval: NodeJS.Timeout | null = null;
  private listeners: Set<(state: IntervalState) => void> = new Set();

  constructor(config: IntervalSegmentConfig, callbacks: IntervalEngineCallbacks = {}, clock: ClockSource = defaultClock) {
    this.clock = clock;
    this.callbacks = callbacks;
    this.config = this.validateConfig(config);
    this.reset();
  }

  private validateConfig(cfg: IntervalSegmentConfig): IntervalSegmentConfig {
    const sets = Math.max(1, Math.floor(cfg.totalSets || 1));
    const work = Math.max(1000, Math.floor(cfg.workDurationMs || 20000)); // Minimum 1 second work
    const rest = Math.max(1000, Math.floor(cfg.restDurationMs || 10000)); // Minimum 1 second rest
    const prep = Math.max(0, Math.floor(cfg.prepDurationMs || 0));
    const cooldown = Math.max(0, Math.floor(cfg.cooldownDurationMs || 0));

    return {
      totalSets: sets,
      workDurationMs: work,
      restDurationMs: rest,
      prepDurationMs: prep,
      cooldownDurationMs: cooldown,
    };
  }

  public setConfig(newConfig: Partial<IntervalSegmentConfig>): void {
    this.stopTicking();
    this.config = this.validateConfig({ ...this.config, ...newConfig });
    this.reset();
  }

  public setCallbacks(callbacks: IntervalEngineCallbacks): void {
    this.callbacks = callbacks;
  }

  public reset(): void {
    this.stopTicking();
    this.status = 'idle';
    this.currentSet = 1;
    this.accumulatedElapsedMs = 0;
    this.totalElapsedMs = 0;

    const prep = this.config.prepDurationMs ?? 0;
    if (prep > 0) {
      this.currentPhase = 'prep';
      this.phaseRemainingMs = prep;
    } else {
      this.currentPhase = 'work';
      this.phaseRemainingMs = this.config.workDurationMs;
    }

    // Calculate total duration
    const sets = this.config.totalSets;
    const workTotal = sets * this.config.workDurationMs;
    const restTotal = (sets - 1) * this.config.restDurationMs;
    const prepTotal = prep;
    const cooldownTotal = this.config.cooldownDurationMs ?? 0;
    this.totalWorkoutMs = prepTotal + workTotal + restTotal + cooldownTotal;

    this.notify();
  }

  public start(): boolean {
    if (this.status === 'running') return false;

    if (this.status === 'completed') {
      this.reset();
    }

    const now = this.clock.now();
    this.phaseTargetTimestamp = now + this.phaseRemainingMs;
    this.workoutStartTimestamp = now;
    this.status = 'running';

    this.startTicking();
    this.callbacks.onCue?.(this.currentPhase === 'prep' ? 'prep' : 'work');
    this.notify();
    return true;
  }

  public pause(): boolean {
    if (this.status !== 'running') return false;

    this.sync();
    this.stopTicking();
    this.status = 'paused';
    this.accumulatedElapsedMs = this.totalElapsedMs;
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

  public sync(): IntervalState {
    if (this.status !== 'running') return this.getState();

    const now = this.clock.now();
    const remaining = this.phaseTargetTimestamp - now;

    this.totalElapsedMs = this.accumulatedElapsedMs + (now - this.workoutStartTimestamp);

    if (remaining > 0) {
      this.phaseRemainingMs = remaining;
    } else {
      // Phase completed! Advance to next phase
      this.advancePhase();
    }

    this.notify();
    return this.getState();
  }

  private advancePhase(): void {
    const now = this.clock.now();

    if (this.currentPhase === 'prep') {
      this.currentPhase = 'work';
      this.phaseRemainingMs = this.config.workDurationMs;
      this.phaseTargetTimestamp = now + this.phaseRemainingMs;
      this.callbacks.onPhaseChange?.('work', this.currentSet);
      this.callbacks.onCue?.('work');
    } else if (this.currentPhase === 'work') {
      if (this.currentSet < this.config.totalSets) {
        // Move to rest
        this.currentPhase = 'rest';
        this.phaseRemainingMs = this.config.restDurationMs;
        this.phaseTargetTimestamp = now + this.phaseRemainingMs;
        this.callbacks.onPhaseChange?.('rest', this.currentSet);
        this.callbacks.onCue?.('rest');
      } else {
        // Last set completed! Check cooldown
        const cooldown = this.config.cooldownDurationMs ?? 0;
        if (cooldown > 0) {
          this.currentPhase = 'cooldown';
          this.phaseRemainingMs = cooldown;
          this.phaseTargetTimestamp = now + this.phaseRemainingMs;
          this.callbacks.onPhaseChange?.('cooldown', this.currentSet);
        } else {
          this.completeWorkout();
        }
      }
    } else if (this.currentPhase === 'rest') {
      // Move to next set
      this.currentSet += 1;
      this.currentPhase = 'work';
      this.phaseRemainingMs = this.config.workDurationMs;
      this.phaseTargetTimestamp = now + this.phaseRemainingMs;
      this.callbacks.onPhaseChange?.('work', this.currentSet);
      this.callbacks.onCue?.('work');
    } else if (this.currentPhase === 'cooldown') {
      this.completeWorkout();
    }
  }

  private completeWorkout(): void {
    this.currentPhase = 'complete';
    this.phaseRemainingMs = 0;
    this.status = 'completed';
    this.stopTicking();
    this.callbacks.onComplete?.();
    this.callbacks.onCue?.('complete');
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

  private getNextPhaseName(): string {
    if (this.currentPhase === 'prep') return `Set 1 Work (${Math.round(this.config.workDurationMs / 1000)}s)`;
    if (this.currentPhase === 'work') {
      if (this.currentSet < this.config.totalSets) {
        return `Rest (${Math.round(this.config.restDurationMs / 1000)}s)`;
      }
      return 'Workout Complete';
    }
    if (this.currentPhase === 'rest') {
      return `Set ${this.currentSet + 1} Work (${Math.round(this.config.workDurationMs / 1000)}s)`;
    }
    return 'Done';
  }

  public getState(): IntervalState {
    const currentPhaseTotal =
      this.currentPhase === 'prep'
        ? (this.config.prepDurationMs ?? 0)
        : this.currentPhase === 'work'
        ? this.config.workDurationMs
        : this.currentPhase === 'rest'
        ? this.config.restDurationMs
        : this.currentPhase === 'cooldown'
        ? (this.config.cooldownDurationMs ?? 0)
        : 0;

    const progress = this.totalWorkoutMs > 0 ? Math.min(100, (this.totalElapsedMs / this.totalWorkoutMs) * 100) : 0;

    return {
      status: this.status,
      currentPhase: this.currentPhase,
      currentSet: this.currentSet,
      totalSets: this.config.totalSets,
      phaseRemainingMs: this.phaseRemainingMs,
      phaseTotalMs: currentPhaseTotal,
      totalElapsedMs: this.totalElapsedMs,
      totalWorkoutMs: this.totalWorkoutMs,
      progressPercent: progress,
      nextPhaseName: this.getNextPhaseName(),
    };
  }

  public subscribe(listener: (state: IntervalState) => void): () => void {
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
        console.error('Error in IntervalEngine listener:', err);
      }
    });
  }

  public destroy(): void {
    this.stopTicking();
    this.listeners.clear();
  }
}

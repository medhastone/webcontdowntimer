'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  CountdownEngine,
  CountdownConfig,
  CountdownState,
  StopwatchEngine,
  StopwatchState,
  IntervalEngine,
  IntervalSegmentConfig,
  IntervalState,
  IntervalEngineCallbacks,
  PomodoroEngine,
  PomodoroConfig,
  PomodoroState,
  PomodoroCallbacks,
  TargetDateEngine,
  TargetDateState,
} from '@/lib/timer-engine';

/**
 * React hook for high-precision, drift-free Countdown Timers
 */
export function useCountdown(initialConfig: CountdownConfig) {
  const [engine] = useState(() => new CountdownEngine(initialConfig));
  const [state, setState] = useState<CountdownState>(() => engine.getState());

  useEffect(() => {
    const unsubscribe = engine.subscribe((newState) => {
      setState(newState);
    });

    return () => {
      unsubscribe();
      engine.destroy();
    };
  }, [engine]);

  const start = useCallback(() => engine.start(), [engine]);
  const pause = useCallback(() => engine.pause(), [engine]);
  const resume = useCallback(() => engine.resume(), [engine]);
  const toggle = useCallback(() => engine.toggle(), [engine]);
  const reset = useCallback(() => engine.reset(), [engine]);
  const adjustTime = useCallback((deltaMs: number) => engine.adjustTime(deltaMs), [engine]);
  const setDuration = useCallback((durationMs: number) => engine.setDuration(durationMs), [engine]);

  return {
    ...state,
    start,
    pause,
    resume,
    toggle,
    reset,
    adjustTime,
    setDuration,
  };
}

/**
 * React hook for high-precision Stopwatch with laps
 */
export function useStopwatch() {
  const [engine] = useState(() => new StopwatchEngine());
  const [state, setState] = useState<StopwatchState>(() => engine.getState());

  useEffect(() => {
    const unsubscribe = engine.subscribe((newState) => {
      setState(newState);
    });

    return () => {
      unsubscribe();
      engine.destroy();
    };
  }, [engine]);

  const start = useCallback(() => engine.start(), [engine]);
  const pause = useCallback(() => engine.pause(), [engine]);
  const resume = useCallback(() => engine.resume(), [engine]);
  const toggle = useCallback(() => engine.toggle(), [engine]);
  const reset = useCallback(() => engine.reset(), [engine]);
  const lap = useCallback(() => engine.lap(), [engine]);

  return {
    ...state,
    start,
    pause,
    resume,
    toggle,
    reset,
    lap,
  };
}

/**
 * React hook for Interval workout timer (Tabata / HIIT / Rounds)
 */
export function useInterval(config: IntervalSegmentConfig, callbacks?: IntervalEngineCallbacks) {
  const [engine] = useState(() => new IntervalEngine(config));
  const [state, setState] = useState<IntervalState>(() => engine.getState());

  useEffect(() => {
    if (callbacks) {
      engine.setCallbacks(callbacks);
    }
  }, [engine, callbacks]);

  useEffect(() => {
    const unsubscribe = engine.subscribe((newState) => {
      setState(newState);
    });

    return () => {
      unsubscribe();
      engine.destroy();
    };
  }, [engine]);

  const start = useCallback(() => engine.start(), [engine]);
  const pause = useCallback(() => engine.pause(), [engine]);
  const resume = useCallback(() => engine.resume(), [engine]);
  const toggle = useCallback(() => engine.toggle(), [engine]);
  const reset = useCallback(() => engine.reset(), [engine]);
  const setConfig = useCallback((newCfg: Partial<IntervalSegmentConfig>) => engine.setConfig(newCfg), [engine]);

  return {
    ...state,
    start,
    pause,
    resume,
    toggle,
    reset,
    setConfig,
  };
}

/**
 * React hook for Pomodoro technique
 */
export function usePomodoro(config?: Partial<PomodoroConfig>, callbacks?: PomodoroCallbacks) {
  const [engine] = useState(() => new PomodoroEngine(config));
  const [state, setState] = useState<PomodoroState>(() => engine.getState());

  useEffect(() => {
    if (callbacks) {
      engine.setCallbacks(callbacks);
    }
  }, [engine, callbacks]);

  useEffect(() => {
    const unsubscribe = engine.subscribe((newState) => {
      setState(newState);
    });

    return () => {
      unsubscribe();
      engine.destroy();
    };
  }, [engine]);

  const start = useCallback(() => engine.start(), [engine]);
  const pause = useCallback(() => engine.pause(), [engine]);
  const resume = useCallback(() => engine.resume(), [engine]);
  const toggle = useCallback(() => engine.toggle(), [engine]);
  const reset = useCallback(() => engine.reset(), [engine]);
  const setMode = useCallback((mode: any) => engine.setMode(mode), [engine]);
  const setTaskTitle = useCallback((title: string) => engine.setTaskTitle(title), [engine]);

  return {
    ...state,
    start,
    pause,
    resume,
    toggle,
    reset,
    setMode,
    setTaskTitle,
  };
}

/**
 * React hook for Target Date Countdown
 */
export function useTargetDate(targetDate: Date | string | number, onReached?: () => void) {
  const [engine] = useState(() => new TargetDateEngine(targetDate));
  const [state, setState] = useState<TargetDateState>(() => engine.getState());

  useEffect(() => {
    engine.setOnReached(onReached);
  }, [engine, onReached]);

  useEffect(() => {
    const unsubscribe = engine.subscribe((newState) => {
      setState(newState);
    });

    return () => {
      unsubscribe();
      engine.destroy();
    };
  }, [engine]);

  const setTargetDate = useCallback(
    (newDate: Date | string | number) => {
      engine.setTargetDate(newDate);
    },
    [engine]
  );

  return {
    ...state,
    setTargetDate,
  };
}

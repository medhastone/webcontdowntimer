import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  CountdownEngine,
  MockClock,
  StopwatchEngine,
  IntervalEngine,
  PomodoroEngine,
  TargetDateEngine,
  parseToMilliseconds,
  formatDuration,
  encodeTimerParams,
  decodeTimerParams,
  saveToStorage,
  loadFromStorage,
} from '../lib/timer-engine';

describe('CountdownEngine Core Logic', () => {
  it('initializes correctly with valid duration', () => {
    const clock = new MockClock(10000);
    const engine = new CountdownEngine({ initialDurationMs: 60000 }, clock);

    const state = engine.getState();
    assert.equal(state.status, 'idle');
    assert.equal(state.remainingMs, 60000);
    assert.equal(state.isWarning, false);
    assert.equal(state.progressPercent, 0);
    assert.equal(state.timeUnits.minutes, 1);
    assert.equal(state.timeUnits.seconds, 0);

    engine.destroy();
  });

  it('handles invalid/negative/zero durations safely', () => {
    const clock = new MockClock(10000);
    const engine1 = new CountdownEngine({ initialDurationMs: -5000 }, clock);
    assert.equal(engine1.getState().remainingMs, 0);
    assert.equal(engine1.start(), false); // cannot start zero timer without overtime

    const engine2 = new CountdownEngine({ initialDurationMs: NaN }, clock);
    assert.equal(engine2.getState().remainingMs, 0);

    engine1.destroy();
    engine2.destroy();
  });

  it('starts, ticks, and calculates accurate remaining time using mock clock', () => {
    const clock = new MockClock(10000);
    const engine = new CountdownEngine({ initialDurationMs: 30000 }, clock);

    assert.equal(engine.start(), true);
    assert.equal(engine.getState().status, 'running');

    // Advance clock by 10 seconds
    clock.advance(10000);
    engine.syncWithRealTime();

    assert.equal(engine.getState().remainingMs, 20000);
    assert.equal(Math.round(engine.getState().progressPercent), 33);

    engine.destroy();
  });

  it('pauses and resumes repeatedly without time loss or drift', () => {
    const clock = new MockClock(10000);
    const engine = new CountdownEngine({ initialDurationMs: 60000 }, clock);

    engine.start();
    clock.advance(5000);
    engine.syncWithRealTime();
    assert.equal(engine.getState().remainingMs, 55000);

    // Pause
    assert.equal(engine.pause(), true);
    assert.equal(engine.getState().status, 'paused');
    assert.equal(engine.getState().remainingMs, 55000);

    // Clock advances while paused
    clock.advance(120000); // 2 minutes pass while paused
    engine.syncWithRealTime();
    assert.equal(engine.getState().remainingMs, 55000); // Remains frozen

    // Resume
    assert.equal(engine.resume(), true);
    assert.equal(engine.getState().status, 'running');

    clock.advance(5000);
    engine.syncWithRealTime();
    assert.equal(engine.getState().remainingMs, 50000);

    engine.destroy();
  });

  it('handles repeated clicks (idempotent start) without duplicate intervals or race conditions', () => {
    const clock = new MockClock(10000);
    const engine = new CountdownEngine({ initialDurationMs: 60000 }, clock);

    assert.equal(engine.start(), true);
    // Clicking start again while running returns false and does not alter timing
    assert.equal(engine.start(), false);
    assert.equal(engine.start(), false);

    clock.advance(10000);
    engine.syncWithRealTime();
    assert.equal(engine.getState().remainingMs, 50000);

    engine.destroy();
  });

  it('triggers warning threshold callback exactly once', () => {
    const clock = new MockClock(10000);
    let warningCount = 0;

    const engine = new CountdownEngine(
      {
        initialDurationMs: 60000,
        warningThresholdMs: 15000,
        onWarning: () => {
          warningCount++;
        },
      },
      clock
    );

    engine.start();

    // Advance to 20 seconds remaining (not in warning yet)
    clock.advance(40000);
    engine.syncWithRealTime();
    assert.equal(warningCount, 0);
    assert.equal(engine.getState().isWarning, false);

    // Advance into warning zone (10 seconds remaining)
    clock.advance(10000);
    engine.syncWithRealTime();
    assert.equal(warningCount, 1);
    assert.equal(engine.getState().isWarning, true);

    // Multiple ticks inside warning zone should not fire warning again
    clock.advance(2000);
    engine.syncWithRealTime();
    clock.advance(2000);
    engine.syncWithRealTime();
    assert.equal(warningCount, 1);

    engine.destroy();
  });

  it('executes completion callback exactly once when reaching zero', () => {
    const clock = new MockClock(10000);
    let completeCount = 0;

    const engine = new CountdownEngine(
      {
        initialDurationMs: 10000,
        allowOvertime: false,
        onComplete: () => {
          completeCount++;
        },
      },
      clock
    );

    engine.start();
    clock.advance(10000);
    engine.syncWithRealTime();

    assert.equal(completeCount, 1);
    assert.equal(engine.getState().status, 'completed');
    assert.equal(engine.getState().remainingMs, 0);

    // Advance further; completion callback must not fire again
    clock.advance(5000);
    engine.syncWithRealTime();
    assert.equal(completeCount, 1);

    engine.destroy();
  });

  it('transitions cleanly to overtime when allowOvertime is enabled', () => {
    const clock = new MockClock(10000);
    let completeCount = 0;

    const engine = new CountdownEngine(
      {
        initialDurationMs: 10000,
        allowOvertime: true,
        onComplete: () => {
          completeCount++;
        },
      },
      clock
    );

    engine.start();
    clock.advance(15000); // 5 seconds past zero
    engine.syncWithRealTime();

    assert.equal(completeCount, 1);
    assert.equal(engine.getState().status, 'overtime');
    assert.equal(engine.getState().remainingMs, 0);
    assert.equal(engine.getState().overtimeMs, 5000);
    assert.equal(engine.getState().timeUnits.seconds, 5);

    engine.destroy();
  });

  it('resets while running and while paused', () => {
    const clock = new MockClock(10000);
    const engine = new CountdownEngine({ initialDurationMs: 30000 }, clock);

    // Running reset
    engine.start();
    clock.advance(10000);
    engine.syncWithRealTime();
    assert.equal(engine.getState().remainingMs, 20000);
    engine.reset();
    assert.equal(engine.getState().status, 'idle');
    assert.equal(engine.getState().remainingMs, 30000);

    // Paused reset
    engine.start();
    clock.advance(5000);
    engine.pause();
    assert.equal(engine.getState().status, 'paused');
    engine.reset();
    assert.equal(engine.getState().status, 'idle');
    assert.equal(engine.getState().remainingMs, 30000);

    engine.destroy();
  });

  it('simulates background tab suspension and restoration without drift', () => {
    const clock = new MockClock(10000);
    const engine = new CountdownEngine({ initialDurationMs: 120000 }, clock);

    engine.start();
    clock.advance(1000);
    engine.syncWithRealTime();

    // Tab gets hidden, 45 seconds pass with timer throttled or suspended
    clock.advance(45000);
    // Browser wakes up and syncs
    engine.syncWithRealTime();

    assert.equal(engine.getState().remainingMs, 74000);
    assert.equal(engine.getState().status, 'running');

    engine.destroy();
  });

  it('supports time adjustments (+/- deltaMs)', () => {
    const clock = new MockClock(10000);
    const engine = new CountdownEngine({ initialDurationMs: 60000 }, clock);

    engine.start();
    clock.advance(10000);
    engine.syncWithRealTime();
    assert.equal(engine.getState().remainingMs, 50000);

    // Add 1 minute
    engine.adjustTime(60000);
    assert.equal(engine.getState().remainingMs, 110000);

    // Subtract 30 seconds
    engine.adjustTime(-30000);
    assert.equal(engine.getState().remainingMs, 80000);

    engine.destroy();
  });
});

describe('StopwatchEngine Core Logic', () => {
  it('starts, tracks elapsed time, and pauses with high precision', () => {
    const clock = new MockClock(5000);
    const stopwatch = new StopwatchEngine(clock);

    assert.equal(stopwatch.getState().status, 'idle');
    assert.equal(stopwatch.getState().elapsedMs, 0);

    stopwatch.start();
    clock.advance(2540);
    assert.equal(stopwatch.getState().elapsedMs, 2540);

    stopwatch.pause();
    assert.equal(stopwatch.getState().status, 'paused');

    // Time passes while paused
    clock.advance(10000);
    assert.equal(stopwatch.getState().elapsedMs, 2540);

    // Resume
    stopwatch.resume();
    clock.advance(1000);
    assert.equal(stopwatch.getState().elapsedMs, 3540);

    stopwatch.reset();
    assert.equal(stopwatch.getState().status, 'idle');
    assert.equal(stopwatch.getState().elapsedMs, 0);

    stopwatch.destroy();
  });

  it('records lap and split times correctly', () => {
    const clock = new MockClock(1000);
    const stopwatch = new StopwatchEngine(clock);

    stopwatch.start();

    // Lap 1 at 3 seconds
    clock.advance(3000);
    const lap1 = stopwatch.lap();
    assert.equal(lap1?.lapIndex, 1);
    assert.equal(lap1?.lapTimeMs, 3000);
    assert.equal(lap1?.overallTimeMs, 3000);

    // Lap 2 at 7 seconds total (4 seconds since lap 1)
    clock.advance(4000);
    const lap2 = stopwatch.lap();
    assert.equal(lap2?.lapIndex, 2);
    assert.equal(lap2?.lapTimeMs, 4000);
    assert.equal(lap2?.overallTimeMs, 7000);

    assert.equal(stopwatch.getState().laps.length, 2);

    stopwatch.destroy();
  });
});

describe('IntervalEngine Core Logic', () => {
  it('validates against zero-length infinite loops', () => {
    const clock = new MockClock(1000);
    const engine = new IntervalEngine(
      {
        totalSets: 0, // Should be normalized to >= 1
        workDurationMs: -500, // Should be normalized to >= 1000ms
        restDurationMs: 0, // Should be normalized to >= 1000ms
      },
      {},
      clock
    );

    const state = engine.getState();
    assert.equal(state.totalSets, 1);
    assert.equal(state.phaseTotalMs >= 1000, true);

    engine.destroy();
  });

  it('progresses through prep, work, and rest phases seamlessly', () => {
    const clock = new MockClock(1000);
    const phasesRecorded: string[] = [];

    const engine = new IntervalEngine(
      {
        prepDurationMs: 3000,
        workDurationMs: 5000,
        restDurationMs: 2000,
        totalSets: 2,
      },
      {
        onPhaseChange: (phase, set) => {
          phasesRecorded.push(`${phase}-${set}`);
        },
      },
      clock
    );

    assert.equal(engine.getState().currentPhase, 'prep');
    engine.start();

    // Advance 3s -> completes prep, moves to work set 1
    clock.advance(3000);
    engine.sync();
    assert.equal(engine.getState().currentPhase, 'work');
    assert.equal(engine.getState().currentSet, 1);

    // Advance 5s -> completes work set 1, moves to rest set 1
    clock.advance(5000);
    engine.sync();
    assert.equal(engine.getState().currentPhase, 'rest');

    // Advance 2s -> completes rest, moves to work set 2
    clock.advance(2000);
    engine.sync();
    assert.equal(engine.getState().currentPhase, 'work');
    assert.equal(engine.getState().currentSet, 2);

    // Advance 5s -> completes work set 2 (last set), completes workout
    clock.advance(5000);
    engine.sync();
    assert.equal(engine.getState().currentPhase, 'complete');
    assert.equal(engine.getState().status, 'completed');

    engine.destroy();
  });
});

describe('PomodoroEngine Core Logic', () => {
  it('cycles through work sessions and short break transitions', () => {
    const clock = new MockClock(1000);
    const completedSessions: string[] = [];

    const engine = new PomodoroEngine(
      {
        workDurationMs: 10000,
        shortBreakDurationMs: 3000,
        longBreakDurationMs: 5000,
        longBreakInterval: 2,
      },
      {
        onSessionComplete: (mode, count) => {
          completedSessions.push(`${mode}:${count}`);
        },
      },
      clock
    );

    assert.equal(engine.getState().mode, 'work');
    engine.start();

    // Complete work session 1
    clock.advance(10000);
    engine.sync();
    assert.equal(completedSessions[0], 'work:1');
    assert.equal(engine.getState().mode, 'shortBreak');

    // Start & complete short break
    engine.start();
    clock.advance(3000);
    engine.sync();
    assert.equal(engine.getState().mode, 'work');

    // Complete work session 2 (reaches longBreakInterval 2)
    engine.start();
    clock.advance(10000);
    engine.sync();
    assert.equal(completedSessions[2], 'work:2');
    assert.equal(engine.getState().mode, 'longBreak');

    engine.destroy();
  });
});

describe('TargetDateEngine & Clock Formatting', () => {
  it('correctly calculates days, hours, minutes to future target', () => {
    const clock = new MockClock(1000000000); // base timestamp
    const futureDate = new Date(1000000000 + (2 * 86400 * 1000) + (5 * 3600 * 1000) + (30 * 60 * 1000) + (15 * 1000));

    const targetEngine = new TargetDateEngine(futureDate, undefined, clock);
    const state = targetEngine.getState();

    assert.equal(state.isTargetReached, false);
    assert.equal(state.days, 2);
    assert.equal(state.hours, 5);
    assert.equal(state.minutes, 30);
    assert.equal(state.seconds, 15);

    targetEngine.destroy();
  });

  it('parses duration strings accurately', () => {
    assert.equal(parseToMilliseconds('15m'), 15 * 60 * 1000);
    assert.equal(parseToMilliseconds('1h 30m'), 90 * 60 * 1000);
    assert.equal(parseToMilliseconds('45s'), 45 * 1000);
    assert.equal(parseToMilliseconds('05:30'), 330 * 1000);
    assert.equal(parseToMilliseconds('01:15:30'), 4530 * 1000);
    assert.equal(parseToMilliseconds('invalid'), 0);
  });

  it('formats durations consistently', () => {
    assert.equal(formatDuration(90000), '01:30');
    assert.equal(formatDuration(3665000), '01:01:05');
    assert.equal(formatDuration(12500, { showCenti: true }), '00:12.50');
  });
});

describe('URL Serialization & Safe Storage', () => {
  it('encodes and decodes timer parameters with strict validation', () => {
    const query = encodeTimerParams({
      d: 900,
      w: 120,
      ot: true,
      title: 'Keynote Speech',
    });

    assert.equal(query.includes('d=900'), true);
    assert.equal(query.includes('w=120'), true);
    assert.equal(query.includes('ot=1'), true);

    const decoded = decodeTimerParams(query);
    assert.equal(decoded.d, 900);
    assert.equal(decoded.w, 120);
    assert.equal(decoded.ot, true);
    assert.equal(decoded.title, 'Keynote Speech');
  });

  it('rejects malicious or out-of-bounds parameters in URL decoding', () => {
    const maliciousQuery = '?d=-99999&w=999999999&ot=hack&title=<script>alert(1)</script>';
    const decoded = decodeTimerParams(maliciousQuery);

    assert.equal(decoded.d, undefined); // Negative duration rejected
    assert.equal(decoded.ot, undefined); // Non-boolean rejected
    assert.equal(typeof decoded.title, 'string');
  });

  it('handles safe storage fallback when corrupted or in SSR', () => {
    // Should safely return default value in node environment
    const loaded = loadFromStorage('test_key', { sample: 123 });
    assert.deepEqual(loaded, { sample: 123 });
  });
});

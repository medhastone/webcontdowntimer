import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateTimeDuration,
  calculateTimeAddition,
  calculateTimeCard,
  calculateOvertime,
  calculateSpeechTime,
  parseParticipantLines,
  shuffleArray,
  generateBalancedGroups,
} from '../lib/calculators/time-calculators';
import {
  ParticipantStopwatch,
  startStopwatchItem,
  pauseStopwatchItem,
  resetStopwatchItem,
  recordStopwatchLap,
  validateParticipantName,
  exportMultiStopwatchCsv,
} from '../lib/timer-engine';
import { TOOLS_REGISTRY, getRelatedTools } from '../lib/tools-registry';

describe('Time Duration Calculator Logic', () => {
  it('calculates same-day duration accurately', () => {
    const res = calculateTimeDuration({
      startTime: '09:00:00',
      endTime: '17:30:00',
    });
    assert.equal(res.valid, true);
    assert.equal(res.hours, 8);
    assert.equal(res.minutes, 30);
    assert.equal(res.seconds, 0);
    assert.equal(res.totalHoursDecimal, 8.5);
    assert.equal(res.isCrossMidnight, false);
  });

  it('handles overnight cross-midnight shifts when no dates are provided', () => {
    const res = calculateTimeDuration({
      startTime: '22:15:00',
      endTime: '06:45:00',
    });
    assert.equal(res.valid, true);
    assert.equal(res.isCrossMidnight, true);
    assert.equal(res.hours, 8);
    assert.equal(res.minutes, 30);
    assert.equal(res.totalHoursDecimal, 8.5);
  });

  it('calculates multi-day duration with explicit calendar dates', () => {
    const res = calculateTimeDuration({
      startDate: '2026-10-25',
      startTime: '10:00:00',
      endDate: '2026-10-27',
      endTime: '14:15:00',
    });
    assert.equal(res.valid, true);
    assert.equal(res.days, 2);
    assert.equal(res.hours, 4);
    assert.equal(res.minutes, 15);
    assert.equal(res.totalHoursDecimal, 52.25);
  });
});

describe('Time Addition & Subtraction Calculator Logic', () => {
  it('adds and subtracts multiple HMS rows accurately', () => {
    const res = calculateTimeAddition([
      { id: '1', operation: 'add', hours: 2, minutes: 45, seconds: 30 },
      { id: '2', operation: 'add', hours: 1, minutes: 30, seconds: 45 },
      { id: '3', operation: 'subtract', hours: 0, minutes: 16, seconds: 15 },
    ]);
    // 2h45m30s + 1h30m45s = 4h16m15s; minus 16m15s = 4h00m00s
    assert.equal(res.hours, 4);
    assert.equal(res.minutes, 0);
    assert.equal(res.seconds, 0);
    assert.equal(res.decimalHours, 4);
    assert.equal(res.formattedHMS, '4h 00m 00s');
  });
});

describe('Time Card & Overtime Calculator Logic', () => {
  it('computes weekly net hours with unpaid break deductions and overnight shift support', () => {
    const summary = calculateTimeCard([
      {
        id: 'mon',
        dayName: 'Monday',
        enabled: true,
        startTime: '09:00',
        endTime: '17:30',
        breakMinutes: 30,
      },
      {
        id: 'tue',
        dayName: 'Tuesday (Night Shift)',
        enabled: true,
        startTime: '22:00',
        endTime: '06:30',
        breakMinutes: 30,
      },
      {
        id: 'wed',
        dayName: 'Wednesday',
        enabled: false,
        startTime: '09:00',
        endTime: '17:00',
        breakMinutes: 30,
      },
    ]);

    assert.equal(summary.totalNetMinutes, 960); // 8h + 8h = 16h = 960m
    assert.equal(summary.totalNetHoursDecimal, 16);
    assert.equal(summary.formattedTotalNet, '16h 00m');
  });

  it('splits regular and overtime hours and estimates gross pay accurately', () => {
    const ot = calculateOvertime({
      totalHoursWorked: 46.5,
      regularThresholdHours: 40,
      overtimeMultiplier: 1.5,
      hourlyRate: 20,
    });

    assert.equal(ot.regularHours, 40);
    assert.equal(ot.overtimeHours, 6.5);
    assert.equal(ot.regularPay, 800);
    assert.equal(ot.overtimePay, 195); // 6.5 * 20 * 1.5
    assert.equal(ot.totalEstimatedPay, 995);
  });
});

describe('Speech Time & Randomizer Logic', () => {
  it('estimates speaking duration from script text and pause overhead', () => {
    // 130 words at 130 WPM = 60 seconds + 6s extra pause = 66 seconds (1m 06s)
    const words = Array.from({ length: 130 }, (_, i) => `word${i + 1}`).join(' ') + '.';
    const res = calculateSpeechTime(words, 130, 6);
    assert.equal(res.wordCount, 130);
    assert.equal(res.estimatedSeconds, 66);
    assert.equal(res.formattedEstimate, '1m 06s');
  });

  it('generates balanced groups with uneven remainders distributed fairly', () => {
    const roster = ['A', 'B', 'C', 'D', 'E', 'F', 'G']; // 7 items
    const groups = generateBalancedGroups(roster, 'byGroupCount', 3);
    assert.equal(groups.length, 3);
    // Sizes should be 3, 2, 2
    assert.equal(groups[0].length, 3);
    assert.equal(groups[1].length, 2);
    assert.equal(groups[2].length, 2);

    const parsed = parseParticipantLines(' Alice \nBob\nAlice\n\nCharlie ', true);
    assert.deepEqual(parsed, ['Alice', 'Bob', 'Charlie']);

    const shuffled = shuffleArray([1, 2, 3, 4, 5]);
    assert.equal(shuffled.length, 5);
  });
});

describe('MultiStopwatch Engine & Tools Registry Verification', () => {
  it('manages independent participant stopwatches, laps, name validation, and CSV export', () => {
    const items: ParticipantStopwatch[] = [
      {
        id: 'p1',
        name: 'Runner 1',
        laneOrGroup: 'Lane 1',
        isRunning: false,
        accumulatedMs: 0,
        startedAtPerfMs: null,
        laps: [],
      },
    ];

    const v1 = validateParticipantName('Runner 1', items.map((i) => i.name));
    assert.equal(v1.valid, false); // Duplicate name rejected

    const v2 = validateParticipantName('Runner 2', items.map((i) => i.name));
    assert.equal(v2.valid, true);

    let p = startStopwatchItem(items[0], 1000);
    assert.equal(p.isRunning, true);

    p = recordStopwatchLap(p, 3500);
    assert.equal(p.laps.length, 1);
    assert.equal(p.laps[0].lapDurationMs, 2500);

    p = pauseStopwatchItem(p, 5000);
    assert.equal(p.isRunning, false);
    assert.equal(p.accumulatedMs, 4000);

    const csv = exportMultiStopwatchCsv([p], 5000);
    assert.equal(csv.includes('Runner 1'), true);

    p = resetStopwatchItem(p);
    assert.equal(p.accumulatedMs, 0);
    assert.equal(p.laps.length, 0);
  });

  it('registers all 55 tools with unique slugs and contextual related tools', () => {
    assert.equal(TOOLS_REGISTRY.length, 55);
    const slugs = new Set(TOOLS_REGISTRY.map((t) => t.slug));
    assert.equal(slugs.size, 55);

    for (const tool of TOOLS_REGISTRY) {
      assert.equal(tool.instructions.length >= 2, true, `${tool.slug} missing instructions`);
      assert.equal(tool.faq.length >= 1, true, `${tool.slug} missing FAQs`);
      const related = getRelatedTools(tool.slug, 3);
      assert.equal(related.length, 3, `${tool.slug} should return 3 related tools`);
    }
  });
});

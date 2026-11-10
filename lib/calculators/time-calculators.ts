/**
 * Shared Time Calculators & Community Utility Engine
 * Pure, deterministic, unit-tested calculations for:
 * - Time Duration Calculator (including cross-midnight and multi-day date spans)
 * - Time Addition / Subtraction Calculator
 * - Time Card & Work Hours Calculator
 * - Overtime & Pay Estimate Calculator
 * - Speech Time & Pacing Calculator
 * - Unbiased Random Name Picker & Group Generator
 */

// ============================================================================
// 1. TIME DURATION CALCULATOR
// ============================================================================

export interface TimeDurationInput {
  startTime: string; // "HH:MM" or "HH:MM:SS"
  endTime: string;   // "HH:MM" or "HH:MM:SS"
  startDate?: string; // Optional "YYYY-MM-DD"
  endDate?: string;   // Optional "YYYY-MM-DD"
}

export interface TimeDurationResult {
  valid: boolean;
  error?: string;
  totalSeconds: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalHoursDecimal: number;
  totalMinutes: number;
  isCrossMidnight: boolean;
  formattedSummary: string;
}

export function parseTimeToSeconds(timeStr: string): number | null {
  const trimmed = timeStr.trim();
  const match = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(trimmed);
  if (!match) return null;
  const h = Number(match[1]);
  const m = Number(match[2]);
  const s = match[3] ? Number(match[3]) : 0;
  if (h < 0 || h > 23 || m < 0 || m > 59 || s < 0 || s > 59) return null;
  return h * 3600 + m * 60 + s;
}

export function calculateTimeDuration(input: TimeDurationInput): TimeDurationResult {
  const startSec = parseTimeToSeconds(input.startTime);
  const endSec = parseTimeToSeconds(input.endTime);

  if (startSec === null || endSec === null) {
    return {
      valid: false,
      error: 'Please enter valid start and end times in 24-hour HH:MM or HH:MM:SS format.',
      totalSeconds: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalHoursDecimal: 0,
      totalMinutes: 0,
      isCrossMidnight: false,
      formattedSummary: '0h 0m 0s',
    };
  }

  let totalSeconds = 0;
  let isCrossMidnight = false;

  if (input.startDate && input.endDate) {
    const startD = new Date(`${input.startDate}T00:00:00Z`);
    const endD = new Date(`${input.endDate}T00:00:00Z`);
    if (Number.isNaN(startD.getTime()) || Number.isNaN(endD.getTime())) {
      return {
        valid: false,
        error: 'Invalid calendar date format.',
        totalSeconds: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        totalHoursDecimal: 0,
        totalMinutes: 0,
        isCrossMidnight: false,
        formattedSummary: '0h 0m 0s',
      };
    }
    const dayDiffSeconds = Math.round((endD.getTime() - startD.getTime()) / 1000);
    totalSeconds = dayDiffSeconds + (endSec - startSec);
    if (totalSeconds < 0) {
      return {
        valid: false,
        error: 'End date and time cannot be earlier than start date and time.',
        totalSeconds: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        totalHoursDecimal: 0,
        totalMinutes: 0,
        isCrossMidnight: false,
        formattedSummary: '0h 0m 0s',
      };
    }
    isCrossMidnight = dayDiffSeconds > 0;
  } else {
    // Same day or overnight cross-midnight shift
    if (endSec >= startSec) {
      totalSeconds = endSec - startSec;
      isCrossMidnight = false;
    } else {
      totalSeconds = 86400 - startSec + endSec;
      isCrossMidnight = true;
    }
  }

  const days = Math.floor(totalSeconds / 86400);
  const remAfterDays = totalSeconds % 86400;
  const hours = Math.floor(remAfterDays / 3600);
  const remAfterHours = remAfterDays % 3600;
  const minutes = Math.floor(remAfterHours / 60);
  const seconds = remAfterHours % 60;

  const totalHoursDecimal = Number((totalSeconds / 3600).toFixed(2));
  const totalMinutes = Number((totalSeconds / 60).toFixed(2));

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  parts.push(`${hours}h`);
  parts.push(`${minutes}m`);
  if (seconds > 0) parts.push(`${seconds}s`);

  return {
    valid: true,
    totalSeconds,
    days,
    hours,
    minutes,
    seconds,
    totalHoursDecimal,
    totalMinutes,
    isCrossMidnight,
    formattedSummary: parts.join(' '),
  };
}

// ============================================================================
// 2. TIME ADDITION / SUBTRACTION CALCULATOR
// ============================================================================

export interface TimeEntryRow {
  id: string;
  label?: string;
  operation: 'add' | 'subtract';
  hours: number;
  minutes: number;
  seconds: number;
}

export interface TimeAdditionResult {
  valid: boolean;
  error?: string;
  totalSeconds: number;
  isNegative: boolean;
  hours: number;
  minutes: number;
  seconds: number;
  decimalHours: number;
  formattedHMS: string;
}

export function calculateTimeAddition(rows: TimeEntryRow[]): TimeAdditionResult {
  let totalSeconds = 0;

  for (const row of rows) {
    const h = Number.isFinite(row.hours) ? Math.max(0, Math.floor(row.hours)) : 0;
    const m = Number.isFinite(row.minutes) ? Math.max(0, Math.floor(row.minutes)) : 0;
    const s = Number.isFinite(row.seconds) ? Math.max(0, Math.floor(row.seconds)) : 0;
    const rowSeconds = h * 3600 + m * 60 + s;
    totalSeconds += row.operation === 'subtract' ? -rowSeconds : rowSeconds;
  }

  const isNegative = totalSeconds < 0;
  const abs = Math.abs(totalSeconds);
  const hours = Math.floor(abs / 3600);
  const minutes = Math.floor((abs % 3600) / 60);
  const seconds = abs % 60;
  const decimalHours = Number((totalSeconds / 3600).toFixed(2));

  const formattedHMS = `${isNegative ? '-' : ''}${hours}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;

  return {
    valid: true,
    totalSeconds,
    isNegative,
    hours,
    minutes,
    seconds,
    decimalHours,
    formattedHMS,
  };
}

// ============================================================================
// 3. TIME CARD CALCULATOR
// ============================================================================

export interface TimeCardShift {
  id: string;
  dayName: string;
  enabled: boolean;
  startTime: string; // "HH:MM"
  endTime: string;   // "HH:MM"
  breakMinutes: number;
  notes?: string;
}

export interface TimeCardDaySummary {
  id: string;
  dayName: string;
  grossMinutes: number;
  breakMinutes: number;
  netMinutes: number;
  netHoursDecimal: number;
  formattedNet: string;
}

export interface TimeCardSummary {
  days: TimeCardDaySummary[];
  totalNetMinutes: number;
  totalBreakMinutes: number;
  totalNetHoursDecimal: number;
  formattedTotalNet: string;
}

export function calculateTimeCard(shifts: TimeCardShift[]): TimeCardSummary {
  const days: TimeCardDaySummary[] = [];
  let totalNetMinutes = 0;
  let totalBreakMinutes = 0;

  for (const shift of shifts) {
    if (!shift.enabled) {
      days.push({
        id: shift.id,
        dayName: shift.dayName,
        grossMinutes: 0,
        breakMinutes: 0,
        netMinutes: 0,
        netHoursDecimal: 0,
        formattedNet: '0h 00m',
      });
      continue;
    }

    const dur = calculateTimeDuration({
      startTime: shift.startTime,
      endTime: shift.endTime,
    });

    const grossMinutes = dur.valid ? Math.round(dur.totalSeconds / 60) : 0;
    const safeBreak = Math.max(0, Math.min(grossMinutes, Math.floor(shift.breakMinutes || 0)));
    const netMinutes = Math.max(0, grossMinutes - safeBreak);
    const netHoursDecimal = Number((netMinutes / 60).toFixed(2));
    const h = Math.floor(netMinutes / 60);
    const m = netMinutes % 60;

    totalNetMinutes += netMinutes;
    totalBreakMinutes += safeBreak;

    days.push({
      id: shift.id,
      dayName: shift.dayName,
      grossMinutes,
      breakMinutes: safeBreak,
      netMinutes,
      netHoursDecimal,
      formattedNet: `${h}h ${String(m).padStart(2, '0')}m`,
    });
  }

  const totalH = Math.floor(totalNetMinutes / 60);
  const totalM = totalNetMinutes % 60;

  return {
    days,
    totalNetMinutes,
    totalBreakMinutes,
    totalNetHoursDecimal: Number((totalNetMinutes / 60).toFixed(2)),
    formattedTotalNet: `${totalH}h ${String(totalM).padStart(2, '0')}m`,
  };
}

// ============================================================================
// 4. OVERTIME CALCULATOR
// ============================================================================

export interface OvertimeInput {
  totalHoursWorked: number;
  regularThresholdHours: number; // e.g., 40 hours/week or 8 hours/day
  overtimeMultiplier: number;    // e.g., 1.5
  doubleTimeThresholdHours?: number; // optional e.g. 50 hours
  doubleTimeMultiplier?: number;     // optional e.g. 2.0
  hourlyRate?: number;
}

export interface OvertimeResult {
  regularHours: number;
  overtimeHours: number;
  doubleTimeHours: number;
  totalHours: number;
  regularPay: number;
  overtimePay: number;
  doubleTimePay: number;
  totalEstimatedPay: number;
  effectiveHourlyRate: number;
}

export function calculateOvertime(input: OvertimeInput): OvertimeResult {
  const total = Math.max(0, Number(input.totalHoursWorked) || 0);
  const threshold = Math.max(0, Number(input.regularThresholdHours) || 40);
  const multiplier = Math.max(1, Number(input.overtimeMultiplier) || 1.5);
  const dtThreshold =
    input.doubleTimeThresholdHours && input.doubleTimeThresholdHours > threshold
      ? Number(input.doubleTimeThresholdHours)
      : null;
  const dtMultiplier = Math.max(1, Number(input.doubleTimeMultiplier) || 2.0);
  const rate = Math.max(0, Number(input.hourlyRate) || 0);

  const regularHours = Math.min(total, threshold);
  let overtimeHours = 0;
  let doubleTimeHours = 0;

  if (total > threshold) {
    if (dtThreshold !== null && total > dtThreshold) {
      overtimeHours = dtThreshold - threshold;
      doubleTimeHours = total - dtThreshold;
    } else {
      overtimeHours = total - threshold;
    }
  }

  const regularPay = Number((regularHours * rate).toFixed(2));
  const overtimePay = Number((overtimeHours * rate * multiplier).toFixed(2));
  const doubleTimePay = Number((doubleTimeHours * rate * dtMultiplier).toFixed(2));
  const totalEstimatedPay = Number((regularPay + overtimePay + doubleTimePay).toFixed(2));
  const effectiveHourlyRate = total > 0 ? Number((totalEstimatedPay / total).toFixed(2)) : rate;

  return {
    regularHours: Number(regularHours.toFixed(2)),
    overtimeHours: Number(overtimeHours.toFixed(2)),
    doubleTimeHours: Number(doubleTimeHours.toFixed(2)),
    totalHours: Number(total.toFixed(2)),
    regularPay,
    overtimePay,
    doubleTimePay,
    totalEstimatedPay,
    effectiveHourlyRate,
  };
}

// ============================================================================
// 5. SPEECH TIME CALCULATOR
// ============================================================================

export interface SpeechEstimateResult {
  wordCount: number;
  characterCount: number;
  sentenceCount: number;
  paragraphCount: number;
  estimatedSeconds: number;
  minRangeSeconds: number;
  maxRangeSeconds: number;
  formattedEstimate: string;
  formattedRange: string;
}

export function calculateSpeechTime(
  text: string,
  wordsPerMinute = 130,
  extraPauseSeconds = 0
): SpeechEstimateResult {
  const trimmed = text.trim();
  if (!trimmed) {
    return {
      wordCount: 0,
      characterCount: 0,
      sentenceCount: 0,
      paragraphCount: 0,
      estimatedSeconds: 0,
      minRangeSeconds: 0,
      maxRangeSeconds: 0,
      formattedEstimate: '0m 00s',
      formattedRange: '0m 00s – 0m 00s',
    };
  }

  const words = trimmed.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const characterCount = trimmed.length;
  const sentenceCount = trimmed.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
  const paragraphCount = trimmed.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;

  const safeWpm = Math.max(40, Math.min(350, wordsPerMinute));
  const baseSeconds = Math.round((wordCount / safeWpm) * 60);
  const estimatedSeconds = baseSeconds + Math.max(0, Math.round(extraPauseSeconds));

  // +/- 12% pacing range for natural speech cadence variation
  const minRangeSeconds = Math.max(0, Math.round(estimatedSeconds * 0.88));
  const maxRangeSeconds = Math.round(estimatedSeconds * 1.12);

  const fmt = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${String(s).padStart(2, '0')}s`;
  };

  return {
    wordCount,
    characterCount,
    sentenceCount,
    paragraphCount,
    estimatedSeconds,
    minRangeSeconds,
    maxRangeSeconds,
    formattedEstimate: fmt(estimatedSeconds),
    formattedRange: `${fmt(minRangeSeconds)} – ${fmt(maxRangeSeconds)}`,
  };
}

// ============================================================================
// 6. RANDOM NAME PICKER & GROUP GENERATOR
// ============================================================================

export function parseParticipantLines(rawText: string, deduplicate = false): string[] {
  const lines = rawText
    .split(/\r?\n|,/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (!deduplicate) return lines;

  const seen = new Set<string>();
  const unique: string[] = [];
  for (const item of lines) {
    const lower = item.toLowerCase();
    if (!seen.has(lower)) {
      seen.add(lower);
      unique.push(item);
    }
  }
  return unique;
}

export function shuffleArray<T>(items: readonly T[], randomFn: () => number = Math.random): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(randomFn() * (i + 1));
    const temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }
  return copy;
}

export function generateBalancedGroups(
  names: readonly string[],
  mode: 'byGroupCount' | 'byGroupSize',
  value: number,
  randomFn: () => number = Math.random
): string[][] {
  if (names.length === 0) return [];
  const shuffled = shuffleArray(names, randomFn);

  let groupCount = 1;
  if (mode === 'byGroupCount') {
    groupCount = Math.max(1, Math.min(shuffled.length, Math.floor(value)));
  } else {
    const maxPerGroup = Math.max(1, Math.floor(value));
    groupCount = Math.max(1, Math.ceil(shuffled.length / maxPerGroup));
  }

  const groups: string[][] = Array.from({ length: groupCount }, () => []);
  shuffled.forEach((participant, idx) => {
    groups[idx % groupCount].push(participant);
  });

  return groups;
}

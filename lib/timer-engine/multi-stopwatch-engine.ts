/**
 * Multi-Stopwatch Engine
 * Manages multiple independent stopwatches with high-resolution monotonic timing,
 * individual and batch start/stop/reset, lap tracking, relay mode, and CSV export.
 */

export interface MultiStopwatchLap {
  lapNumber: number;
  lapDurationMs: number;
  totalElapsedMs: number;
}

export interface ParticipantStopwatch {
  id: string;
  name: string;
  laneOrGroup: string;
  isRunning: boolean;
  accumulatedMs: number;
  startedAtPerfMs: number | null;
  laps: MultiStopwatchLap[];
}

export function computeElapsedMs(sw: ParticipantStopwatch, nowPerfMs: number): number {
  if (!sw.isRunning || sw.startedAtPerfMs === null) {
    return sw.accumulatedMs;
  }
  return sw.accumulatedMs + Math.max(0, nowPerfMs - sw.startedAtPerfMs);
}

export function startStopwatchItem(
  sw: ParticipantStopwatch,
  nowPerfMs: number
): ParticipantStopwatch {
  if (sw.isRunning) return sw;
  return {
    ...sw,
    isRunning: true,
    startedAtPerfMs: nowPerfMs,
  };
}

export function pauseStopwatchItem(
  sw: ParticipantStopwatch,
  nowPerfMs: number
): ParticipantStopwatch {
  if (!sw.isRunning || sw.startedAtPerfMs === null) return sw;
  const elapsed = sw.accumulatedMs + Math.max(0, nowPerfMs - sw.startedAtPerfMs);
  return {
    ...sw,
    isRunning: false,
    accumulatedMs: elapsed,
    startedAtPerfMs: null,
  };
}

export function resetStopwatchItem(sw: ParticipantStopwatch): ParticipantStopwatch {
  return {
    ...sw,
    isRunning: false,
    accumulatedMs: 0,
    startedAtPerfMs: null,
    laps: [],
  };
}

export function recordStopwatchLap(
  sw: ParticipantStopwatch,
  nowPerfMs: number
): ParticipantStopwatch {
  const totalElapsedMs = computeElapsedMs(sw, nowPerfMs);
  if (totalElapsedMs <= 0) return sw;
  const prevTotal = sw.laps.length > 0 ? sw.laps[0].totalElapsedMs : 0;
  const lapDurationMs = Math.max(0, totalElapsedMs - prevTotal);
  const nextLap: MultiStopwatchLap = {
    lapNumber: sw.laps.length + 1,
    lapDurationMs,
    totalElapsedMs,
  };
  return {
    ...sw,
    laps: [nextLap, ...sw.laps],
  };
}

export function validateParticipantName(
  rawName: string,
  existingNames: string[]
): { valid: boolean; sanitized: string; error?: string } {
  const trimmed = rawName.trim().replace(/\s+/g, ' ');
  if (!trimmed) {
    return { valid: false, sanitized: '', error: 'Participant name cannot be empty.' };
  }
  if (trimmed.length > 48) {
    return { valid: false, sanitized: trimmed.slice(0, 48), error: 'Name must be 48 characters or fewer.' };
  }
  const duplicate = existingNames.some((n) => n.toLowerCase() === trimmed.toLowerCase());
  if (duplicate) {
    return { valid: false, sanitized: trimmed, error: 'A stopwatch with this participant name already exists.' };
  }
  return { valid: true, sanitized: trimmed };
}

export function formatStopwatchMs(ms: number): {
  main: string;
  centiseconds: string;
  full: string;
} {
  const safeMs = Math.max(0, Math.floor(ms));
  const totalSeconds = Math.floor(safeMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const centis = Math.floor((safeMs % 1000) / 10);

  const main =
    hours > 0
      ? `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      : `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const centiseconds = String(centis).padStart(2, '0');
  return {
    main,
    centiseconds,
    full: `${main}.${centiseconds}`,
  };
}

export function exportMultiStopwatchCsv(
  items: ParticipantStopwatch[],
  nowPerfMs: number
): string {
  const rows: string[] = [
    ['Rank', 'Participant', 'Lane/Group', 'Status', 'Total Time', 'Laps Count', 'Best Lap', 'Last Lap'].join(','),
  ];

  // Sort by elapsed time (active/completed first)
  const withElapsed = items.map((item) => ({
    item,
    elapsed: computeElapsedMs(item, nowPerfMs),
  }));

  withElapsed.forEach(({ item, elapsed }, index) => {
    const formattedTotal = formatStopwatchMs(elapsed).full;
    const bestLapMs =
      item.laps.length > 0
        ? Math.min(...item.laps.map((l) => l.lapDurationMs))
        : 0;
    const lastLapMs = item.laps.length > 0 ? item.laps[0].lapDurationMs : 0;

    const safeName = `"${item.name.replace(/"/g, '""')}"`;
    const safeLane = `"${item.laneOrGroup.replace(/"/g, '""')}"`;
    const status = item.isRunning ? 'Running' : elapsed > 0 ? 'Stopped' : 'Ready';

    rows.push(
      [
        index + 1,
        safeName,
        safeLane,
        status,
        formattedTotal,
        item.laps.length,
        bestLapMs > 0 ? formatStopwatchMs(bestLapMs).full : '-',
        lastLapMs > 0 ? formatStopwatchMs(lastLapMs).full : '-',
      ].join(',')
    );
  });

  return rows.join('\n');
}

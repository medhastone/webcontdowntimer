'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Flag, Download, Copy, Check, Maximize, Minimize } from 'lucide-react';

interface LapRecord {
  lapIndex: number;
  lapTimeMs: number;
  overallTimeMs: number;
}

export default function StopwatchComponent() {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [laps, setLaps] = useState<LapRecord[]>([]);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number>(0);
  const accumulatedMsRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);

  const startAnimation = useCallback(() => {
    const step = () => {
      if (startTimeRef.current !== 0) {
        const now = performance.now();
        const current = accumulatedMsRef.current + (now - startTimeRef.current);
        setElapsedMs(current);
        animFrameRef.current = requestAnimationFrame(step);
      }
    };
    animFrameRef.current = requestAnimationFrame(step);
  }, []);

  const handleStartPause = useCallback(() => {
    if (isRunning) {
      // Pause
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      accumulatedMsRef.current = elapsedMs;
      startTimeRef.current = 0;
      setIsRunning(false);
    } else {
      // Start
      startTimeRef.current = performance.now();
      setIsRunning(true);
      startAnimation();
    }
  }, [isRunning, elapsedMs, startAnimation]);

  const handleReset = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    startTimeRef.current = 0;
    accumulatedMsRef.current = 0;
    setElapsedMs(0);
    setLaps([]);
    setIsRunning(false);
  }, []);

  const handleRecordLap = () => {
    const previousTotal = laps.length > 0 ? laps[0].overallTimeMs : 0;
    const currentLapTime = elapsedMs - previousTotal;

    const newRecord: LapRecord = {
      lapIndex: laps.length + 1,
      lapTimeMs: currentLapTime,
      overallTimeMs: elapsedMs,
    };

    setLaps([newRecord, ...laps]);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      const orientation = (screen as unknown as { orientation?: { lock?: (mode: string) => Promise<void> } }).orientation;
      orientation?.lock?.('landscape')?.catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      const orientation = (screen as unknown as { orientation?: { unlock?: () => void } }).orientation;
      orientation?.unlock?.();
      setIsFullscreen(false);
    }
  };

  const formatTimeParts = (totalMs: number) => {
    const totalSec = Math.floor(totalMs / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    const ms = Math.floor((totalMs % 1000) / 10); // Centiseconds
    return {
      minutes: String(m).padStart(2, '0'),
      seconds: String(s).padStart(2, '0'),
      centi: String(ms).padStart(2, '0'),
    };
  };

  // Identify fastest and slowest laps if at least 2 laps exist
  let minLapIdx = -1;
  let maxLapIdx = -1;
  if (laps.length >= 2) {
    let minTime = Infinity;
    let maxTime = -Infinity;
    laps.forEach((l) => {
      if (l.lapTimeMs < minTime) {
        minTime = l.lapTimeMs;
        minLapIdx = l.lapIndex;
      }
      if (l.lapTimeMs > maxTime) {
        maxTime = l.lapTimeMs;
        maxLapIdx = l.lapIndex;
      }
    });
  }

  const exportCsv = () => {
    if (laps.length === 0) return;
    const rows = ['Lap,Lap Time,Split Time'];
    laps.forEach((l) => {
      const lapParts = formatTimeParts(l.lapTimeMs);
      const splitParts = formatTimeParts(l.overallTimeMs);
      rows.push(
        `${l.lapIndex},${lapParts.minutes}:${lapParts.seconds}.${lapParts.centi},${splitParts.minutes}:${splitParts.seconds}.${splitParts.centi}`
      );
    });
    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `webcountdowntimer_stopwatch_laps_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyLaps = () => {
    if (laps.length === 0) return;
    const text = laps
      .map((l) => {
        const lapParts = formatTimeParts(l.lapTimeMs);
        const splitParts = formatTimeParts(l.overallTimeMs);
        return `Lap ${l.lapIndex}: ${lapParts.minutes}:${lapParts.seconds}.${lapParts.centi} (Split: ${splitParts.minutes}:${splitParts.seconds}.${splitParts.centi})`;
      })
      .join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const parts = formatTimeParts(elapsedMs);

  return (
    <div
      ref={containerRef}
      className={`rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-sm relative ${
        isFullscreen ? 'timer-fullscreen-stage flex flex-col items-center justify-center bg-[#06080B] text-white border-none' : ''
      }`}
    >
      {/* Fullscreen Exit Button in Corner */}
      {isFullscreen && (
        <button
          type="button"
          onClick={toggleFullscreen}
          className="absolute top-4 right-4 z-50 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-black/55 hover:bg-black/75 text-white border border-white/20 backdrop-blur-md text-xs font-semibold shadow-lg transition-all cursor-pointer"
          aria-label="Exit Fullscreen"
        >
          <Minimize className="w-4 h-4" />
          <span>Exit Fullscreen</span>
        </button>
      )}

      {/* Top Bar */}
      {!isFullscreen && (
        <div className="flex items-center justify-between pb-6 border-b border-neutral-100 dark:border-neutral-800">
          <span className="text-xs font-mono uppercase text-neutral-500">Millisecond Stopwatch</span>
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
            aria-label="Toggle Fullscreen"
          >
            <Maximize className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Big Digits */}
      <div className={`${isFullscreen ? 'flex items-baseline justify-center select-none' : 'my-10 text-center flex items-baseline justify-center select-none'}`}>
        <span
          className={`font-mono font-black tabular-nums tracking-tight ${
            isFullscreen ? 'text-[clamp(4rem,17vmin,14rem)] leading-none text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)]' : 'text-6xl sm:text-8xl md:text-9xl text-neutral-950 dark:text-white'
          }`}
        >
          {parts.minutes}:{parts.seconds}
        </span>
        <span
          className={`font-mono font-semibold tabular-nums ml-2 ${
            isFullscreen ? 'text-[clamp(2rem,7vmin,5rem)] text-white/60' : 'text-3xl sm:text-4xl md:text-5xl text-neutral-400 dark:text-neutral-500'
          }`}
        >
          .{parts.centi}
        </span>
      </div>

      {/* Status indicator & Controls (Hidden in Fullscreen) */}
      {!isFullscreen && (
        <>
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
              <span
                className={`w-2 h-2 rounded-full ${
                  isRunning ? 'bg-emerald-500 animate-pulse' : elapsedMs > 0 ? 'bg-amber-400' : 'bg-neutral-400'
                }`}
              />
              {isRunning ? 'Timing' : elapsedMs > 0 ? 'Paused' : 'Ready'}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
            <button
              onClick={handleStartPause}
              className={`min-h-[52px] py-3.5 px-8 rounded-xl font-bold text-sm sm:text-base text-white shadow-sm flex items-center justify-center gap-2 transition-transform active:scale-95 ${
                isRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:opacity-90'
              }`}
            >
              {isRunning ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
              <span>{isRunning ? 'Pause' : elapsedMs > 0 ? 'Resume' : 'Start'}</span>
            </button>

            <button
              onClick={handleRecordLap}
              disabled={!isRunning && elapsedMs === 0}
              className="min-h-[52px] py-3.5 px-6 rounded-xl font-semibold text-sm bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 disabled:opacity-40 flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <Flag className="w-4 h-4" />
              <span>Lap</span>
            </button>

            <button
              onClick={handleReset}
              className="min-h-[52px] py-3.5 px-6 rounded-xl font-semibold text-sm bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 flex items-center justify-center gap-2 active:scale-95 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>
        </>
      )}

      {/* Laps Table */}
      {!isFullscreen && laps.length > 0 && (
        <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Recorded Laps ({laps.length})
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={copyLaps}
                className="px-2.5 py-1 text-xs font-medium rounded-md bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 flex items-center gap-1"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={exportCsv}
                className="px-2.5 py-1 text-xs font-medium rounded-md bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 flex items-center gap-1"
              >
                <Download className="w-3 h-3" />
                <span>CSV</span>
              </button>
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800 border border-neutral-200 dark:border-neutral-800 rounded-xl">
            {laps.map((lap) => {
              const lapParts = formatTimeParts(lap.lapTimeMs);
              const splitParts = formatTimeParts(lap.overallTimeMs);
              const isFastest = lap.lapIndex === minLapIdx;
              const isSlowest = lap.lapIndex === maxLapIdx;

              return (
                <div
                  key={lap.lapIndex}
                  className={`px-4 py-2.5 flex items-center justify-between text-xs font-mono tabular-nums ${
                    isFastest
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 font-semibold'
                      : isSlowest
                      ? 'bg-amber-50/50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400'
                      : 'text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>Lap {String(lap.lapIndex).padStart(2, '0')}</span>
                    {isFastest && <span className="text-[10px] font-sans px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">Fastest</span>}
                    {isSlowest && <span className="text-[10px] font-sans px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">Slowest</span>}
                  </div>
                  <div>+{lapParts.minutes}:{lapParts.seconds}.{lapParts.centi}</div>
                  <div className="text-neutral-400 dark:text-neutral-500">{splitParts.minutes}:{splitParts.seconds}.{splitParts.centi}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

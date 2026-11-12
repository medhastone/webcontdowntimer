'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { formatDuration } from '@/lib/timer-engine';

function EmbedWidgetInner() {
  const searchParams = useSearchParams();
  const rawType = searchParams.get('type');
  const widgetType: 'countdown' | 'visual' | 'stopwatch' =
    rawType === 'visual' || rawType === 'stopwatch' ? rawType : 'countdown';

  const rawDuration = Number(searchParams.get('d') || '900');
  const safeDurationSec = Number.isFinite(rawDuration)
    ? Math.max(5, Math.min(86400, Math.round(rawDuration)))
    : 900;

  const theme = searchParams.get('theme') === 'light' ? 'light' : 'midnight';
  const rawTitle = (searchParams.get('title') || 'Session Timer').slice(0, 60);

  const [running, setRunning] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    if (!running) return;
    let last = performance.now();
    const id = setInterval(() => {
      const now = performance.now();
      const delta = now - last;
      last = now;
      setElapsedMs((prev) => {
        const next = prev + delta;
        if (widgetType !== 'stopwatch' && next >= safeDurationSec * 1000) {
          setRunning(false);
          return safeDurationSec * 1000;
        }
        return next;
      });
    }, 100);
    return () => clearInterval(id);
  }, [running, safeDurationSec, widgetType]);

  const remainingMs = Math.max(0, safeDurationSec * 1000 - elapsedMs);
  const displayMs = widgetType === 'stopwatch' ? elapsedMs : remainingMs;
  const formatted = formatDuration(displayMs, { showCenti: widgetType === 'stopwatch' });
  const progressRatio =
    widgetType === 'stopwatch'
      ? Math.min(1, (elapsedMs % 60000) / 60000)
      : Math.max(0, Math.min(1, remainingMs / (safeDurationSec * 1000)));

  const isLight = theme === 'light';

  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center justify-between p-4 select-none ${
        isLight ? 'bg-white text-slate-900' : 'bg-[#111827] text-white'
      }`}
    >
      <div className="w-full flex items-center justify-between text-[11px] font-bold uppercase tracking-wider opacity-75">
        <span className="truncate">{rawTitle}</span>
        <span className="font-mono text-[#2563EB]">WebCountDownTimer</span>
      </div>

      <div className="my-auto flex flex-col items-center justify-center gap-3 w-full">
        {widgetType === 'visual' && (
          <div className="w-full max-w-xs h-3 rounded-full bg-slate-500/20 overflow-hidden">
            <div
              className="h-full bg-[#2563EB] transition-all duration-150"
              style={{ width: `${progressRatio * 100}%` }}
            />
          </div>
        )}

        <div className="font-mono font-black text-4xl sm:text-5xl tracking-tight tabular-nums">
          {formatted}
        </div>
      </div>

      <div className="w-full flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setRunning((r) => !r)}
          className="px-4 py-1.5 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
        >
          {running ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{running ? 'Pause' : 'Start'}</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setRunning(false);
            setElapsedMs(0);
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer border ${
            isLight
              ? 'border-slate-200 text-slate-700 hover:bg-slate-100'
              : 'border-slate-700 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
}

export default function EmbedWidgetPage() {
  return (
    <Suspense fallback={<div className="p-4 text-xs font-mono">Loading widget...</div>}>
      <EmbedWidgetInner />
    </Suspense>
  );
}

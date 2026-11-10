'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { playTimerSound } from '@/lib/sound';
import { requestWakeLock, releaseWakeLock } from '@/lib/wakelock';
import { Play, Pause, RotateCcw, SkipForward, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';

interface WebinarSegment {
  id: string;
  title: string;
  durationSec: number;
}

const DEFAULT_WEBINAR_AGENDA: WebinarSegment[] = [
  { id: '1', title: 'Welcome & Tech Check', durationSec: 300 }, // 5 min
  { id: '2', title: 'Keynote & Presentation', durationSec: 1500 }, // 25 min
  { id: '3', title: 'Panel Discussion', durationSec: 900 }, // 15 min
  { id: '4', title: 'Live Audience Q&A', durationSec: 900 }, // 15 min
];

export default function WebinarTimerComponent() {
  const [segments, setSegments] = useState<WebinarSegment[]>(DEFAULT_WEBINAR_AGENDA);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [remainingInSegment, setRemainingInSegment] = useState(DEFAULT_WEBINAR_AGENDA[0].durationSec);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const lastTickTimeRef = useRef<number>(0);

  const currentSegment = segments[currentIdx] || segments[0];

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      requestWakeLock();
      interval = setInterval(() => {
        const now = Date.now();
        const delta = Math.floor((now - lastTickTimeRef.current) / 1000);
        if (delta >= 1) {
          lastTickTimeRef.current = now;
          setRemainingInSegment((prev) => {
            if (prev > 1) {
              if (prev === 120 && soundEnabled) playTimerSound('warning', 0.5); // 2 min warning
              return prev - 1;
            } else if (prev === 1) {
              if (soundEnabled) playTimerSound('bell', 0.7);
              if (currentIdx < segments.length - 1) {
                setCurrentIdx((i) => {
                  const next = i + 1;
                  setRemainingInSegment(segments[next].durationSec);
                  return next;
                });
              } else {
                setIsRunning(false);
              }
              return 0;
            }
            return 0;
          });
        }
      }, 500);
    } else {
      releaseWakeLock();
    }

    return () => clearInterval(interval);
  }, [isRunning, currentIdx, segments, soundEnabled]);

  const handleStartPause = useCallback(() => {
    lastTickTimeRef.current = Date.now();
    setIsRunning((prev) => !prev);
  }, []);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setCurrentIdx(0);
    setRemainingInSegment(segments[0].durationSec);
  }, [segments]);

  const handleNextSegment = () => {
    if (currentIdx < segments.length - 1) {
      const next = currentIdx + 1;
      setCurrentIdx(next);
      setRemainingInSegment(segments[next].durationSec);
      if (soundEnabled) playTimerSound('chime', 0.5);
    }
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

  const formatMinSec = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div
      ref={containerRef}
      className={`rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-sm relative ${
        isFullscreen ? 'timer-fullscreen-stage flex flex-col items-center justify-center bg-[#06090F] text-white border-none' : ''
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

      {/* Top Header */}
      {!isFullscreen && (
        <div className="flex items-center justify-between pb-6 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <span className="text-xs font-mono uppercase text-neutral-500">Live Webinar Agenda Segment</span>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">{currentSegment.title}</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
              aria-label="Toggle Sound"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-500" /> : <VolumeX className="w-4 h-4 text-neutral-400" />}
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
              aria-label="Toggle Fullscreen"
            >
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Segment Digits */}
      <div className={`${isFullscreen ? 'flex flex-col items-center justify-center' : 'my-8 text-center flex flex-col items-center'}`}>
        {!isFullscreen && (
          <div className="text-xs font-mono uppercase tracking-widest text-neutral-500 mb-1">
            Remaining in Current Session
          </div>
        )}
        <div
          className={`font-mono font-black tabular-nums tracking-tight ${
            isFullscreen ? 'text-[clamp(4.5rem,20vmin,15rem)] leading-none text-white' : 'text-7xl sm:text-8xl md:text-9xl text-neutral-950 dark:text-white'
          }`}
        >
          {formatMinSec(remainingInSegment)}
        </div>
      </div>

      {/* Agenda Track */}
      <div className={`grid grid-cols-2 sm:grid-cols-4 gap-2 ${isFullscreen ? 'w-full max-w-4xl px-6 mt-8' : 'mb-8'}`}>
        {segments.map((seg, idx) => {
          const isCurrent = idx === currentIdx;
          const isPast = idx < currentIdx;
          return (
            <div
              key={seg.id}
              className={`p-3 rounded-xl border text-left transition-colors ${
                isCurrent
                  ? 'border-emerald-500 bg-emerald-600 text-white font-bold'
                  : isPast
                  ? 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 opacity-50'
                  : 'border-neutral-200 dark:border-neutral-800 bg-white/5 text-neutral-400 dark:text-neutral-300'
              }`}
            >
              <div className="text-[11px] font-mono opacity-70">
                Segment 0{idx + 1} · {Math.round(seg.durationSec / 60)}m
              </div>
              <div className="text-xs font-semibold truncate mt-1">{seg.title}</div>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      {!isFullscreen && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleStartPause}
            className={`py-3.5 px-8 rounded-xl font-bold text-sm text-white shadow-sm flex items-center gap-2 transition-transform active:scale-95 ${
              isRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {isRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isRunning ? 'Pause' : 'Start Segment'}</span>
          </button>

          <button
            onClick={handleNextSegment}
            disabled={currentIdx >= segments.length - 1}
            className="py-3.5 px-6 rounded-xl font-semibold text-sm bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 disabled:opacity-40 flex items-center gap-2"
          >
            <SkipForward className="w-4 h-4" />
            <span>Next Agenda Item</span>
          </button>

          <button
            onClick={handleReset}
            className="py-3.5 px-6 rounded-xl font-semibold text-sm bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>
      )}
    </div>
  );
}

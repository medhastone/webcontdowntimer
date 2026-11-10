'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { playTimerSound } from '@/lib/sound';
import { requestWakeLock, releaseWakeLock } from '@/lib/wakelock';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Maximize, Minimize, Sparkles } from 'lucide-react';

const CLASSROOM_PRESETS = [
  { label: '2 min (Quick Turn & Talk)', sec: 120 },
  { label: '5 min (Pop Quiz / Warm-Up)', sec: 300 },
  { label: '10 min (Group Exercise)', sec: 600 },
  { label: '15 min (Silent Reading)', sec: 900 },
  { label: '20 min (Lab Activity)', sec: 1200 },
];

export default function ClassroomTimerComponent() {
  const [totalSeconds, setTotalSeconds] = useState(600); // 10 min
  const [remainingSeconds, setRemainingSeconds] = useState(600);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const lastTickTimeRef = useRef<number>(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      requestWakeLock();
      interval = setInterval(() => {
        const now = Date.now();
        const delta = Math.floor((now - lastTickTimeRef.current) / 1000);
        if (delta >= 1) {
          lastTickTimeRef.current = now;
          setRemainingSeconds((prev) => {
            if (prev > 1) {
              if (prev === 4 && soundEnabled) playTimerSound('count321', 0.5);
              if (prev === 3 && soundEnabled) playTimerSound('count321', 0.5);
              if (prev === 2 && soundEnabled) playTimerSound('count321', 0.5);
              return prev - 1;
            } else if (prev === 1) {
              if (soundEnabled) playTimerSound('bell', 0.8);
              setIsRunning(false);
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
  }, [isRunning, soundEnabled]);

  const handleStartPause = useCallback(() => {
    lastTickTimeRef.current = Date.now();
    setIsRunning((prev) => !prev);
  }, []);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setRemainingSeconds(totalSeconds);
  }, [totalSeconds]);

  const handleSelectPreset = (sec: number) => {
    setIsRunning(false);
    setTotalSeconds(sec);
    setRemainingSeconds(sec);
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

  const progressRatio = totalSeconds > 0 ? remainingSeconds / totalSeconds : 0;
  const strokeDashoffset = 283 - 283 * progressRatio;

  return (
    <div
      ref={containerRef}
      className={`rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-sm relative ${
        isFullscreen ? 'timer-fullscreen-stage flex flex-col items-center justify-center bg-[#060911] text-white border-none' : ''
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
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-bold text-neutral-900 dark:text-white">Classroom Visual Activity Timer</h2>
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

      {/* Circular Progress & Big Digits */}
      <div className={`${isFullscreen ? 'w-full h-full flex items-center justify-center' : 'my-8 flex flex-col items-center justify-center'}`}>
        <div className={`relative ${isFullscreen ? 'w-[75vmin] h-[75vmin]' : 'w-64 h-64 sm:w-80 sm:h-80'} flex items-center justify-center`}>
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100" shapeRendering="geometricPrecision">
            {/* Background track circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="6"
              className={isFullscreen ? 'text-white/15' : 'text-neutral-100 dark:text-neutral-800'}
            />
            {/* Active countdown circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="6"
              strokeDasharray="283"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={`transition-all duration-500 ${
                remainingSeconds <= 60
                  ? 'text-red-500'
                  : remainingSeconds <= 180
                  ? 'text-amber-500'
                  : 'text-indigo-500 dark:text-indigo-400'
              }`}
            />
          </svg>

          {/* Central Digits inside circle */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <div className={`font-mono font-black tabular-nums tracking-tight ${isFullscreen ? 'text-[clamp(2.5rem,14vmin,8rem)] text-white' : 'text-5xl sm:text-6xl text-neutral-950 dark:text-white'}`}>
              {formatMinSec(remainingSeconds)}
            </div>
            {!isFullscreen && (
              <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mt-1">
                {remainingSeconds === 0 ? 'Pencils Down!' : isRunning ? 'In Progress' : 'Paused'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      {!isFullscreen && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleStartPause}
            className={`py-3.5 px-8 rounded-xl font-bold text-sm text-white shadow-sm flex items-center gap-2 transition-transform active:scale-95 ${
              isRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isRunning ? 'Pause' : remainingSeconds < totalSeconds ? 'Resume' : 'Start Task'}</span>
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

      {/* Activity Presets */}
      {!isFullscreen && (
        <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-neutral-800">
          <span className="text-xs font-semibold uppercase text-neutral-500 block mb-2.5">
            Classroom Activity Presets
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {CLASSROOM_PRESETS.map((p) => (
              <button
                key={p.sec}
                onClick={() => handleSelectPreset(p.sec)}
                className={`py-2 px-3 text-xs rounded-lg border text-left transition-colors ${
                  totalSeconds === p.sec
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-bold'
                    : 'border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { playTimerSound } from '@/lib/sound';
import { requestWakeLock, releaseWakeLock } from '@/lib/wakelock';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Maximize, Minimize, Flame } from 'lucide-react';

type IntervalPhase = 'prepare' | 'work' | 'rest' | 'complete';

export default function IntervalTimerComponent() {
  const [prepSec, setPrepSec] = useState(5);
  const [workSec, setWorkSec] = useState(20);
  const [restSec, setRestSec] = useState(10);
  const [totalSets, setTotalSets] = useState(8); // Tabata standard

  const [currentSet, setCurrentSet] = useState(1);
  const [phase, setPhase] = useState<IntervalPhase>('prepare');
  const [remainingInPhase, setRemainingInPhase] = useState(5);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const lastTickTimeRef = useRef<number>(0);

  // Timer loop
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      requestWakeLock();
      interval = setInterval(() => {
        const now = Date.now();
        const delta = Math.floor((now - lastTickTimeRef.current) / 1000);
        if (delta >= 1) {
          lastTickTimeRef.current = now;
          setRemainingInPhase((prev) => {
            // Count-in ticks on 3, 2, 1
            if (prev <= 4 && prev > 1 && soundEnabled) {
              playTimerSound('count321', 0.5);
            }

            if (prev > 1) {
              return prev - 1;
            } else if (prev === 1) {
              // Transition phase
              if (phase === 'prepare') {
                if (soundEnabled) playTimerSound('chime', 0.8);
                setPhase('work');
                return workSec;
              } else if (phase === 'work') {
                if (currentSet >= totalSets) {
                  if (soundEnabled) playTimerSound('bell', 0.9);
                  setPhase('complete');
                  setIsRunning(false);
                  return 0;
                } else {
                  if (soundEnabled) playTimerSound('warning', 0.6);
                  setPhase('rest');
                  return restSec;
                }
              } else if (phase === 'rest') {
                if (soundEnabled) playTimerSound('chime', 0.8);
                setCurrentSet((s) => s + 1);
                setPhase('work');
                return workSec;
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
  }, [isRunning, phase, currentSet, totalSets, workSec, restSec, soundEnabled]);

  const handleStartPause = useCallback(() => {
    lastTickTimeRef.current = Date.now();
    setIsRunning((prev) => !prev);
  }, []);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setCurrentSet(1);
    setPhase('prepare');
    setRemainingInPhase(prepSec);
  }, [prepSec]);

  const loadPreset = (prep: number, work: number, rest: number, sets: number) => {
    setIsRunning(false);
    setPrepSec(prep);
    setWorkSec(work);
    setRestSec(rest);
    setTotalSets(sets);
    setCurrentSet(1);
    setPhase('prepare');
    setRemainingInPhase(prep);
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

  // Phase color theme
  let phaseBgClass = 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800';
  let phaseText = 'text-neutral-900 dark:text-white';
  let phaseTitle = 'Prepare';

  if (phase === 'work') {
    phaseBgClass = 'bg-emerald-600 border-emerald-500 text-white';
    phaseText = 'text-white';
    phaseTitle = 'WORK!';
  } else if (phase === 'rest') {
    phaseBgClass = 'bg-amber-500 border-amber-400 text-neutral-950';
    phaseText = 'text-neutral-950';
    phaseTitle = 'REST';
  } else if (phase === 'complete') {
    phaseBgClass = 'bg-blue-600 border-blue-500 text-white';
    phaseText = 'text-white';
    phaseTitle = 'WORKOUT COMPLETE';
  }

  return (
    <div
      ref={containerRef}
      className={`rounded-2xl border transition-all duration-300 relative ${phaseBgClass} ${
        isFullscreen ? 'timer-fullscreen-stage flex flex-col items-center justify-center border-none' : 'p-6 sm:p-8 shadow-sm'
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
        <div className="flex items-center justify-between pb-6 border-b border-black/10 dark:border-white/10">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5" />
            <h2 className="text-base font-bold">Set {currentSet} of {totalSets}</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-lg bg-black/10 dark:bg-white/10 hover:bg-black/20"
              aria-label="Toggle Sound"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 opacity-50" />}
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg bg-black/10 dark:bg-white/10 hover:bg-black/20"
              aria-label="Toggle Fullscreen"
            >
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Digits & Phase Display */}
      <div className={`${isFullscreen ? 'flex flex-col items-center justify-center select-none' : 'my-10 text-center flex flex-col items-center select-none'}`}>
        <div className="text-2xl sm:text-4xl font-black uppercase tracking-widest mb-2">
          {phaseTitle}
        </div>
        <div
          className={`font-mono font-black tabular-nums tracking-tight ${phaseText} ${
            isFullscreen ? 'text-[clamp(4.5rem,20vmin,15rem)] leading-none' : 'text-7xl sm:text-8xl md:text-9xl'
          }`}
        >
          {formatMinSec(remainingInPhase)}
        </div>
      </div>

      {/* Action Controls */}
      {!isFullscreen && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
          <button
            onClick={handleStartPause}
            className="min-h-[52px] py-3.5 px-8 rounded-xl font-bold text-sm sm:text-base bg-black dark:bg-white text-white dark:text-neutral-900 shadow-md hover:opacity-90 flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            {isRunning ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            <span>{isRunning ? 'Pause Workout' : 'Start Workout'}</span>
          </button>

          <button
            onClick={handleReset}
            className="min-h-[52px] py-3.5 px-6 rounded-xl font-semibold text-sm bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 flex items-center justify-center gap-2 transition-colors active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>
      )}

      {/* Presets & Config */}
      {!isFullscreen && (
        <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10 space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider block opacity-80">
            Training Formats
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { label: 'Tabata (20s Work / 10s Rest × 8)', prep: 5, work: 20, rest: 10, sets: 8 },
              { label: 'HIIT (30s Work / 15s Rest × 10)', prep: 10, work: 30, rest: 15, sets: 10 },
              { label: 'Boxing Rounds (3m Work / 1m Rest × 5)', prep: 10, work: 180, rest: 60, sets: 5 },
              { label: 'EMOM (45s Work / 15s Rest × 12)', prep: 10, work: 45, rest: 15, sets: 12 },
            ].map((p, idx) => (
              <button
                key={idx}
                onClick={() => loadPreset(p.prep, p.work, p.rest, p.sets)}
                className="p-3 text-xs rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 text-left transition-colors"
              >
                <div className="font-bold truncate">{p.label.split(' (')[0]}</div>
                <div className="text-[11px] opacity-75 mt-0.5">{p.work}s on / {p.rest}s off · {p.sets} sets</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

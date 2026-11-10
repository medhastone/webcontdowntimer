'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, BookOpen, Eye, Coffee, GraduationCap, Maximize2, Minimize2 } from 'lucide-react';
import { playTimerSound } from '@/lib/sound';

export type StudyBreakVariant = 'study' | 'reading' | 'break' | 'eye-break';

const VARIANT_CONFIG: Record<
  StudyBreakVariant,
  {
    defaultWorkSec: number;
    defaultBreakSec: number;
    heading: string;
    subtitle: string;
    presets: Array<{ label: string; workSec: number; breakSec: number }>;
  }
> = {
  study: {
    defaultWorkSec: 2700, // 45m
    defaultBreakSec: 600, // 10m
    heading: 'Deep Study Session',
    subtitle: '45-minute concentrated study block followed by a 10-minute consolidation break',
    presets: [
      { label: '25m / 5m Sprint', workSec: 1500, breakSec: 300 },
      { label: '45m / 10m Academic', workSec: 2700, breakSec: 600 },
      { label: '50m / 10m Exam Prep', workSec: 3000, breakSec: 600 },
      { label: '90m / 20m Ultradian', workSec: 5400, breakSec: 1200 },
    ],
  },
  reading: {
    defaultWorkSec: 1800, // 30m
    defaultBreakSec: 300, // 5m
    heading: 'Focused Reading Block',
    subtitle: 'Sustained distraction-free reading with pages-read tracking',
    presets: [
      { label: '15m Daily Habit', workSec: 900, breakSec: 180 },
      { label: '30m Chapter Block', workSec: 1800, breakSec: 300 },
      { label: '45m Literature Review', workSec: 2700, breakSec: 420 },
      { label: '60m Deep Reading', workSec: 3600, breakSec: 600 },
    ],
  },
  break: {
    defaultWorkSec: 600, // 10m break countdown
    defaultBreakSec: 300,
    heading: 'Restorative Break Timer',
    subtitle: 'Step away from your desk, hydrate, and stretch before returning to work',
    presets: [
      { label: '5m Micro-Break', workSec: 300, breakSec: 60 },
      { label: '10m Stretch & Walk', workSec: 600, breakSec: 120 },
      { label: '15m Coffee Break', workSec: 900, breakSec: 180 },
      { label: '30m Lunch Recharge', workSec: 1800, breakSec: 300 },
    ],
  },
  'eye-break': {
    defaultWorkSec: 1200, // 20 minutes screen interval
    defaultBreakSec: 20,  // 20 seconds look 20 feet away
    heading: '20-20-20 Eye Care Reminder',
    subtitle: 'Every 20 minutes of screen work, look 20 feet (6 meters) away for 20 seconds',
    presets: [
      { label: '20m Screen / 20s Rest (Standard)', workSec: 1200, breakSec: 20 },
      { label: '15m Intensive / 30s Rest', workSec: 900, breakSec: 30 },
      { label: '30m Screen / 30s Rest', workSec: 1800, breakSec: 30 },
    ],
  },
};

export default function StudyBreakTimerComponent({
  variant = 'study',
}: {
  variant?: StudyBreakVariant;
}) {
  const cfg = VARIANT_CONFIG[variant];
  const [phase, setPhase] = useState<'work' | 'break'>('work');
  const [workDurationSec, setWorkDurationSec] = useState<number>(cfg.defaultWorkSec);
  const [breakDurationSec, setBreakDurationSec] = useState<number>(cfg.defaultBreakSec);
  const [remainingSec, setRemainingSec] = useState<number>(cfg.defaultWorkSec);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completedCycles, setCompletedCycles] = useState<number>(0);
  const [pagesRead, setPagesRead] = useState<number>(12);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

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

  useEffect(() => {
    const onFs = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(() => {
      setRemainingSec((prev) => {
        if (prev <= 1) {
          playTimerSound('chime');
          if (phase === 'work') {
            setPhase('break');
            setCompletedCycles((c) => c + 1);
            return breakDurationSec;
          } else {
            setPhase('work');
            return workDurationSec;
          }
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isRunning, phase, workDurationSec, breakDurationSec]);

  const formatMMSS = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div
        className={`${
          isFullscreen
            ? 'timer-fullscreen-stage flex flex-col items-center justify-center bg-[#0F172A] text-white'
            : 'lg:col-span-7 bg-[#0F172A] text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-lg space-y-6 text-center relative'
        }`}
      >
        {isFullscreen ? (
          <button
            type="button"
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 z-50 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-black/55 hover:bg-black/75 text-white border border-white/20 backdrop-blur-md text-xs font-semibold shadow-lg transition-all cursor-pointer"
            aria-label="Exit Fullscreen"
          >
            <Minimize2 className="w-4 h-4" />
            <span>Exit Fullscreen</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Fullscreen"
            aria-label="Enter Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        )}

        {!isFullscreen && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-950 border border-blue-800 text-blue-300 text-xs font-bold">
            {variant === 'eye-break' ? (
              <Eye className="w-3.5 h-3.5" />
            ) : variant === 'reading' ? (
              <BookOpen className="w-3.5 h-3.5" />
            ) : variant === 'break' ? (
              <Coffee className="w-3.5 h-3.5" />
            ) : (
              <GraduationCap className="w-3.5 h-3.5" />
            )}
            <span>
              {phase === 'work' ? cfg.heading : 'Rest & Recovery Interval'}
            </span>
          </div>
        )}

        <div className={`font-black font-mono tabular-nums tracking-tight ${isFullscreen ? 'text-[clamp(4.5rem,20vmin,15rem)] leading-none text-white' : 'text-6xl sm:text-7xl'}`}>
          {formatMMSS(remainingSec)}
        </div>

        {!isFullscreen && (
          <>
            <p className="text-xs text-slate-300 max-w-md mx-auto">{cfg.subtitle}</p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsRunning((prev) => !prev)}
                className="h-12 px-8 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white font-bold text-sm sm:text-base flex items-center gap-2 cursor-pointer"
              >
                {isRunning ? (
                  <>
                    <Pause className="w-5 h-5 fill-current" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" />
                    <span>Start Session</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsRunning(false);
                  setPhase('work');
                  setRemainingSec(workDurationSec);
                }}
                className="h-12 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-around text-xs font-mono text-slate-400">
              <span>Completed Cycles: {completedCycles}</span>
              <span>Break Length: {formatMMSS(breakDurationSec)}</span>
            </div>
          </>
        )}
      </div>

      <div className="lg:col-span-5 bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Select Schedule Preset
        </h3>
        <div className="space-y-2">
          {cfg.presets.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => {
                setIsRunning(false);
                setPhase('work');
                setWorkDurationSec(p.workSec);
                setBreakDurationSec(p.breakSec);
                setRemainingSec(p.workSec);
              }}
              className={`w-full p-3 rounded-xl border text-left flex items-center justify-between cursor-pointer ${
                workDurationSec === p.workSec
                  ? 'bg-blue-50 dark:bg-blue-950/60 border-[#2563EB] text-[#2563EB] font-bold'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <span className="text-xs">{p.label}</span>
              <span className="text-xs font-mono">{formatMMSS(p.workSec)}</span>
            </button>
          ))}
        </div>

        {variant === 'reading' && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Pages Read Tracker
            </label>
            <div className="flex items-center justify-between gap-3">
              <input
                type="number"
                min={0}
                max={1000}
                value={pagesRead}
                onChange={(e) => setPagesRead(Math.max(0, Number(e.target.value) || 0))}
                className="w-28 h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-mono font-bold"
              />
              <span className="text-xs text-slate-500">
                Est. pace:{' '}
                {workDurationSec > 0
                  ? ((pagesRead / (workDurationSec / 60)) * 60).toFixed(1)
                  : 0}{' '}
                pages/hour
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

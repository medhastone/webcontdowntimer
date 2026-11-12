'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useCountdown } from '@/hooks/use-timer-engine';
import { playTimerSound } from '@/lib/sound';
import { requestWakeLock, releaseWakeLock } from '@/lib/wakelock';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Maximize, Minimize, Repeat, Clock } from 'lucide-react';

interface CountdownTimerComponentProps {
  initialSeconds?: number;
  durationLabel?: string;
}

export default function CountdownTimerComponent({
  initialSeconds = 600,
  durationLabel,
}: CountdownTimerComponentProps) {
  const [totalSeconds, setTotalSeconds] = useState(initialSeconds);
  const [isLooping, setIsLooping] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const loopingRef = useRef(isLooping);
  const soundEnabledRef = useRef(soundEnabled);
  const totalSecondsRef = useRef(totalSeconds);

  useEffect(() => {
    loopingRef.current = isLooping;
    soundEnabledRef.current = soundEnabled;
    totalSecondsRef.current = totalSeconds;
  }, [isLooping, soundEnabled, totalSeconds]);

  const timer = useCountdown({
    initialDurationMs: initialSeconds * 1000,
    allowOvertime: false,
    onComplete: () => {
      if (soundEnabledRef.current) {
        playTimerSound('bell', 0.8);
      }
      if (loopingRef.current) {
        setTimeout(() => {
          timer.setDuration(totalSecondsRef.current * 1000);
          timer.start();
        }, 100);
      }
    },
  });

  // Manage wake lock
  useEffect(() => {
    if (timer.status === 'running') {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }
    return () => {
      releaseWakeLock();
    };
  }, [timer.status]);

  // Quick Presets
  const presets = [
    { label: '1 min', sec: 60 },
    { label: '2 min', sec: 120 },
    { label: '3 min', sec: 180 },
    { label: '4 min', sec: 240 },
    { label: '5 min', sec: 300 },
    { label: '8 min', sec: 480 },
    { label: '10 min', sec: 600 },
    { label: '15 min', sec: 900 },
    { label: '30 min', sec: 1800 },
  ];

  // Sync ?m=N from URL query string on client mount if present
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const mParam = params.get('m');
    if (mParam) {
      const m = Number(mParam);
      if (Number.isFinite(m) && m > 0 && m <= 1440) {
        const sec = Math.round(m * 60);
        setTotalSeconds(sec);
        timer.setDuration(sec * 1000);
      }
    }
  }, [timer.setDuration]);

  // Popular Duration Page Links for internal linking (only the 6 kept /N-minute-timer pages + 3 sprint second timers)
  const durationLinks = [
    { label: '30 Sec', slug: '30-second-timer', sec: 30 },
    { label: '45 Sec', slug: '45-second-timer', sec: 45 },
    { label: '90 Sec', slug: '90-second-timer', sec: 90 },
    { label: '1 Min', slug: '1-minute-timer', sec: 60 },
    { label: '5 Min', slug: '5-minute-timer', sec: 300 },
    { label: '10 Min', slug: '10-minute-timer', sec: 600 },
    { label: '15 Min', slug: '15-minute-timer', sec: 900 },
    { label: '30 Min', slug: '30-minute-timer', sec: 1800 },
    { label: '60 Min', slug: '60-minute-timer', sec: 3600 },
  ];

  const handleStartPause = useCallback(() => {
    if (timer.status === 'running') {
      timer.pause();
    } else if (timer.status === 'paused') {
      timer.resume();
    } else {
      timer.start();
    }
  }, [timer]);

  const handleReset = useCallback(() => {
    timer.reset();
  }, [timer]);

  const handleApplyCustomTime = (h: number, m: number, s: number) => {
    const total = h * 3600 + m * 60 + s;
    if (total <= 0) return;
    setTotalSeconds(total);
    timer.setDuration(total * 1000);
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

  const remainingSeconds = Math.ceil(timer.remainingMs / 1000);
  const { hours, minutes, seconds } = timer.timeUnits;

  const formattedDisplay =
    hours > 0
      ? `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      : `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const isExpired = timer.status === 'completed' || (timer.status !== 'running' && remainingSeconds === 0);
  const isRunning = timer.status === 'running';
  const isPaused = timer.status === 'paused';
  const progressPercent = totalSeconds > 0 ? Math.max(0, Math.min(100, (timer.remainingMs / (totalSeconds * 1000)) * 100)) : 0;

  return (
    <div
      ref={containerRef}
      className={`rounded-2xl border border-[#E4E1D9] dark:border-[#2D352F] bg-white dark:bg-[#1A201C] p-6 sm:p-8 shadow-2xs relative ${
        isFullscreen ? 'timer-fullscreen-stage flex flex-col items-center justify-center bg-[#080B09] text-white border-none' : ''
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

      {/* Top Bar with Semantic Status */}
      {!isFullscreen && (
        <div className="flex items-center justify-between pb-5 border-b border-[#E4E1D9] dark:border-[#2D352F]">
          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-[#365C4B] dark:text-[#5E917A]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#252B27]/70 dark:text-slate-300">
              {durationLabel ? `${durationLabel} — ` : ''}
              {isExpired ? 'TIME EXPIRED' : isRunning ? 'COUNTING DOWN' : isPaused ? 'PAUSED' : 'READY TO START'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsLooping(!isLooping)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                isLooping
                  ? 'bg-[#365C4B] text-white'
                  : 'text-[#252B27]/70 dark:text-slate-300 hover:bg-[#F7F6F2] dark:hover:bg-[#252E28]'
              }`}
              title="Loop Countdown Automatically"
              aria-label="Toggle Loop Mode"
            >
              <Repeat className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Loop</span>
            </button>
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#252B27]/70 dark:text-slate-300 hover:bg-[#F7F6F2] dark:hover:bg-[#252E28] flex items-center gap-1.5 cursor-pointer"
              aria-label="Toggle Sound"
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-4 h-4 text-[#365C4B] dark:text-[#5E917A]" />
                  <span className="hidden sm:inline">Sound On</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-[#252B27]/40" />
                  <span className="hidden sm:inline">Muted</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-2 rounded-lg text-[#252B27]/70 dark:text-slate-300 hover:bg-[#F7F6F2] dark:hover:bg-[#252E28] cursor-pointer"
              aria-label="Toggle Fullscreen"
            >
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Digits & Progress Track */}
      <div className={`${isFullscreen ? 'w-full px-8 flex flex-col items-center justify-center' : 'my-10 text-center flex flex-col items-center'}`}>
        <div
          className={`font-mono font-bold tabular-nums tracking-tight ${
            isFullscreen ? 'text-[clamp(4rem,18vmin,14rem)] leading-none text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)]' : 'text-7xl sm:text-8xl md:text-9xl text-[#252B27] dark:text-white'
          }`}
        >
          {formattedDisplay}
        </div>
        {!isFullscreen && (
          <div className="text-xs sm:text-sm text-[#252B27]/60 dark:text-slate-400 mt-3 font-medium">
            {totalSeconds} total seconds ({Math.round((totalSeconds / 60) * 100) / 100} minutes)
          </div>
        )}

        {/* Clean Progress Bar */}
        <div className={`w-full ${isFullscreen ? 'max-w-3xl h-3.5 bg-white/15 mt-8' : 'max-w-xl h-2.5 bg-[#E7EDE7] dark:bg-[#252E28] mt-6'} rounded-full overflow-hidden`}>
          <div
            className="h-full bg-[#365C4B] dark:bg-[#5E917A] transition-all duration-150"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Primary Action Controls */}
      {!isFullscreen && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleStartPause}
            className={`w-full sm:w-48 py-3.5 px-8 min-h-[48px] rounded-xl font-bold text-base text-white shadow-2xs flex items-center justify-center gap-2 cursor-pointer transition-colors ${
              isRunning ? 'bg-[#B7804C] hover:bg-[#a16e3e]' : 'bg-[#365C4B] hover:bg-[#2b4c3d]'
            }`}
            aria-label={isRunning ? 'Pause Timer' : remainingSeconds < totalSeconds ? 'Resume Timer' : 'Start Timer'}
          >
            {isRunning ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            <span>{isRunning ? 'Pause' : remainingSeconds < totalSeconds ? 'Resume' : 'Start'}</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="w-full sm:w-36 py-3.5 px-6 min-h-[48px] rounded-xl font-semibold text-sm bg-[#F7F6F2] dark:bg-[#252E28] hover:bg-[#E7EDE7] dark:hover:bg-[#2F3A33] text-[#252B27] dark:text-slate-200 border border-[#E4E1D9] dark:border-[#344038] flex items-center justify-center gap-2 transition-colors cursor-pointer"
            aria-label="Reset Timer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>
      )}

      {/* Presets Grid & Custom Duration */}
      {!isFullscreen && (
        <div className="mt-8 pt-6 border-t border-[#E4E1D9] dark:border-[#2D352F] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs font-bold text-[#252B27]/70 dark:text-slate-400 uppercase tracking-wider">
              Quick Presets
            </span>
            <div className="flex items-center gap-2 text-xs font-medium text-[#252B27] dark:text-slate-300">
              <span className="text-[#252B27]/60 dark:text-slate-400">Custom Duration:</span>
              <input
                type="number"
                min="0"
                max="99"
                aria-label="Hours"
                value={Math.floor(totalSeconds / 3600)}
                onChange={(e) =>
                  handleApplyCustomTime(
                    parseInt(e.target.value) || 0,
                    Math.floor((totalSeconds % 3600) / 60),
                    totalSeconds % 60
                  )
                }
                className="w-14 text-center py-1.5 px-2 rounded-lg border border-[#E4E1D9] dark:border-[#2D352F] bg-[#F7F6F2] dark:bg-[#151A17] font-mono font-bold"
                placeholder="HH"
              />
              <span>h</span>
              <input
                type="number"
                min="0"
                max="59"
                aria-label="Minutes"
                value={Math.floor((totalSeconds % 3600) / 60)}
                onChange={(e) =>
                  handleApplyCustomTime(
                    Math.floor(totalSeconds / 3600),
                    parseInt(e.target.value) || 0,
                    totalSeconds % 60
                  )
                }
                className="w-14 text-center py-1.5 px-2 rounded-lg border border-[#E4E1D9] dark:border-[#2D352F] bg-[#F7F6F2] dark:bg-[#151A17] font-mono font-bold"
                placeholder="MM"
              />
              <span>m</span>
              <input
                type="number"
                min="0"
                max="59"
                aria-label="Seconds"
                value={totalSeconds % 60}
                onChange={(e) =>
                  handleApplyCustomTime(
                    Math.floor(totalSeconds / 3600),
                    Math.floor((totalSeconds % 3600) / 60),
                    parseInt(e.target.value) || 0
                  )
                }
                className="w-14 text-center py-1.5 px-2 rounded-lg border border-[#E4E1D9] dark:border-[#2D352F] bg-[#F7F6F2] dark:bg-[#151A17] font-mono font-bold"
                placeholder="SS"
              />
              <span>s</span>
            </div>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
            {presets.map((p) => (
              <button
                key={p.sec}
                type="button"
                onClick={() => handleApplyCustomTime(0, Math.floor(p.sec / 60), p.sec % 60)}
                className={`py-2 text-xs rounded-lg border text-center transition-colors cursor-pointer ${
                  totalSeconds === p.sec
                    ? 'border-[#365C4B] bg-[#365C4B] text-white font-bold'
                    : 'border-[#E4E1D9] dark:border-[#2D352F] text-[#252B27] dark:text-slate-300 hover:bg-[#F7F6F2] dark:hover:bg-[#252E28]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Dedicated Duration Timer Page Links */}
          <div className="pt-3 border-t border-[#E4E1D9]/60 dark:border-[#2D352F]/60">
            <span className="text-[11px] font-bold text-[#252B27]/55 dark:text-slate-400 uppercase tracking-wider block mb-2.5">
              Popular Minute Timers:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {durationLinks.map((d) => (
                <Link
                  key={d.slug}
                  href={`/${d.slug}`}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    totalSeconds === d.sec
                      ? 'bg-[#E7EDE7] dark:bg-[#252E28] text-[#365C4B] dark:text-[#5E917A] font-bold border border-[#365C4B]/30'
                      : 'bg-[#F7F6F2] dark:bg-[#151A17] text-[#252B27]/75 dark:text-slate-400 hover:text-[#365C4B] border border-[#E4E1D9] dark:border-[#2D352F]'
                  }`}
                >
                  {d.label} Timer
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Bell,
  Sun,
  Moon,
  Monitor,
  ChevronUp,
  ChevronDown,
  Check,
} from 'lucide-react';
import { playTimerSound } from '@/lib/sound';
import { requestWakeLock, releaseWakeLock } from '@/lib/wakelock';

export type VisualStyleId =
  | 'circular'
  | 'progress-bar'
  | 'hourglass'
  | 'traffic-light'
  | 'rainbow'
  | 'minimal-digital';

export type BackgroundMode = 'light' | 'dark' | 'auto';

interface ColorOption {
  id: string;
  label: string;
  hex: string;
}

const COLOR_SWATCHES: ColorOption[] = [
  { id: 'forest-green', label: 'Forest Green', hex: '#365C4B' },
  { id: 'warm-orange', label: 'Warm Orange', hex: '#E06A3B' },
  { id: 'coral-red', label: 'Coral Red', hex: '#D94343' },
  { id: 'royal-blue', label: 'Royal Blue', hex: '#2E6FD9' },
  { id: 'sky-blue', label: 'Sky Blue', hex: '#3BA8E0' },
  { id: 'pink', label: 'Pink', hex: '#D93B8A' },
];

const PRESETS = [
  { label: '1 min', seconds: 60 },
  { label: '5 min', seconds: 300 },
  { label: '10 min', seconds: 600 },
  { label: '15 min', seconds: 900 },
  { label: '30 min', seconds: 1800 },
];

export default function VisualTimerComponent() {
  // Timer mode: duration vs end time
  const [timerMode, setTimerMode] = useState<'duration' | 'endTime'>('duration');

  // Time values (defaults to 15:00 minutes)
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(15);
  const [seconds, setSeconds] = useState<number>(0);

  // Target end time for 'endTime' mode (e.g. "17:30")
  const [targetEndTimeStr, setTargetEndTimeStr] = useState<string>(() => {
    const d = new Date(Date.now() + 15 * 60 * 1000);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  });

  // Active duration in seconds & countdown state
  const [totalDurationSec, setTotalDurationSec] = useState<number>(900);
  const [remainingMs, setRemainingMs] = useState<number>(900 * 1000);
  const [status, setStatus] = useState<'idle' | 'running' | 'paused' | 'completed'>('idle');

  // Visual style & customization
  const [visualStyle, setVisualStyle] = useState<VisualStyleId>('circular');
  const [timerColor, setTimerColor] = useState<string>('#365C4B');
  const [bgMode, setBgMode] = useState<BackgroundMode>('auto');

  // Toggle settings
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [alarmAtEnd, setAlarmAtEnd] = useState<boolean>(true);
  const [showElapsedTime, setShowElapsedTime] = useState<boolean>(false);
  const [showTimeText, setShowTimeText] = useState<boolean>(true);
  const [keepScreenAwake, setKeepScreenAwake] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Active preset highlight (defaults to 15 min)
  const [selectedPreset, setSelectedPreset] = useState<string>('15 min');

  // Refs for high-precision timestamp math
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const endTimeTimestampRef = useRef<number>(0);
  const pausedRemainingMsRef = useRef<number>(900 * 1000);
  const lastStateRef = useRef<'idle' | 'running' | 'paused' | 'completed'>('idle');

  // Keep last state updated
  useEffect(() => {
    lastStateRef.current = status;
  }, [status]);

  // Compute total duration whenever inputs change in duration mode
  const syncDurationFromInputs = useCallback((h: number, m: number, s: number) => {
    const total = Math.max(1, h * 3600 + m * 60 + s);
    setTotalDurationSec(total);
    setRemainingMs(total * 1000);
    pausedRemainingMsRef.current = total * 1000;
    setStatus('idle');
  }, []);

  // Set preset
  const handleSelectPreset = (presetLabel: string, sec: number) => {
    setSelectedPreset(presetLabel);
    setHours(Math.floor(sec / 3600));
    setMinutes(Math.floor((sec % 3600) / 60));
    setSeconds(sec % 60);
    setTotalDurationSec(sec);
    setRemainingMs(sec * 1000);
    pausedRemainingMsRef.current = sec * 1000;
    setStatus('idle');
  };

  const handleCustomPresetClick = () => {
    setSelectedPreset('Custom');
  };

  // Adjust time inputs via steppers
  const adjustValue = (type: 'h' | 'm' | 's', delta: number) => {
    setSelectedPreset('Custom');
    if (type === 'h') {
      const nextH = Math.max(0, Math.min(23, hours + delta));
      setHours(nextH);
      syncDurationFromInputs(nextH, minutes, seconds);
    } else if (type === 'm') {
      const nextM = Math.max(0, Math.min(59, minutes + delta));
      setMinutes(nextM);
      syncDurationFromInputs(hours, nextM, seconds);
    } else if (type === 's') {
      const nextS = Math.max(0, Math.min(59, seconds + delta));
      setSeconds(nextS);
      syncDurationFromInputs(hours, minutes, nextS);
    }
  };

  // Switch to End Time mode & calculate difference
  const handleEndTimeChange = (timeStr: string) => {
    setTargetEndTimeStr(timeStr);
    const [th, tm] = timeStr.split(':').map(Number);
    if (Number.isFinite(th) && Number.isFinite(tm)) {
      const now = new Date();
      const target = new Date();
      target.setHours(th, tm, 0, 0);
      if (target.getTime() <= now.getTime()) {
        // Assume next day if target is in the past
        target.setDate(target.getDate() + 1);
      }
      const diffSec = Math.max(1, Math.round((target.getTime() - now.getTime()) / 1000));
      setTotalDurationSec(diffSec);
      setHours(Math.floor(diffSec / 3600));
      setMinutes(Math.floor((diffSec % 3600) / 60));
      setSeconds(diffSec % 60);
      setRemainingMs(diffSec * 1000);
      pausedRemainingMsRef.current = diffSec * 1000;
      setStatus('idle');
    }
  };

  // Start timer
  const handleStart = () => {
    if (status === 'running') return;

    let durationToRunMs = pausedRemainingMsRef.current;
    if (status === 'completed' || durationToRunMs <= 0) {
      durationToRunMs = totalDurationSec * 1000;
      setRemainingMs(durationToRunMs);
    }

    endTimeTimestampRef.current = performance.now() + durationToRunMs;
    setStatus('running');

    if (keepScreenAwake) {
      requestWakeLock();
    }
  };

  // Pause timer
  const handlePause = () => {
    if (status !== 'running') return;
    const now = performance.now();
    const remaining = Math.max(0, endTimeTimestampRef.current - now);
    pausedRemainingMsRef.current = remaining;
    setRemainingMs(remaining);
    setStatus('paused');
    releaseWakeLock();
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
  };

  // Reset timer
  const handleReset = () => {
    setStatus('idle');
    releaseWakeLock();
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    const resetMs = totalDurationSec * 1000;
    pausedRemainingMsRef.current = resetMs;
    setRemainingMs(resetMs);
  };

  // Precision animation frame loop
  useEffect(() => {
    if (status !== 'running') return;

    const tick = () => {
      const now = performance.now();
      const left = endTimeTimestampRef.current - now;

      if (left <= 0) {
        setRemainingMs(0);
        pausedRemainingMsRef.current = 0;
        setStatus('completed');
        releaseWakeLock();
        if (soundEnabled && alarmAtEnd) {
          playTimerSound('bell');
        }
      } else {
        setRemainingMs(left);
        animFrameRef.current = requestAnimationFrame(tick);
      }
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [status, soundEnabled, alarmAtEnd]);

  // Fullscreen handler
  const handleToggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement && !isFullscreen) {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
        try {
          const orientation = screen.orientation as unknown as { lock?: (mode: string) => Promise<void> };
          if (orientation?.lock) await orientation.lock('landscape');
        } catch {
          // ignore orientation lock errors
        }
        setIsFullscreen(true);
      } else {
        if (document.fullscreenElement && document.exitFullscreen) {
          await document.exitFullscreen();
        }
        try {
          const orientation = screen.orientation as unknown as { unlock?: () => void };
          if (orientation?.unlock) orientation.unlock();
        } catch {
          // ignore
        }
        setIsFullscreen(false);
      }
    } catch {
      setIsFullscreen((prev) => !prev);
    }
  };

  // Listen to fullscreen exit via Esc
  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // Keyboard shortcuts (Space: Start/Pause, R: Reset, F: Fullscreen)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if (e.code === 'Space') {
        e.preventDefault();
        if (status === 'running') {
          handlePause();
        } else {
          handleStart();
        }
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleReset();
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        handleToggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Calculate fractions
  const totalMs = totalDurationSec * 1000;
  const remainingFraction = totalMs > 0 ? Math.max(0, Math.min(1, remainingMs / totalMs)) : 0;
  const elapsedMs = Math.max(0, totalMs - remainingMs);

  // Time formatters
  const remSecTotal = Math.ceil(remainingMs / 1000);
  const remH = Math.floor(remSecTotal / 3600);
  const remM = Math.floor((remSecTotal % 3600) / 60);
  const remS = remSecTotal % 60;

  const displayTime =
    remH > 0
      ? `${String(remH).padStart(2, '0')}:${String(remM).padStart(2, '0')}:${String(remS).padStart(2, '0')}`
      : `${String(remM).padStart(2, '0')}:${String(remS).padStart(2, '0')}`;

  const elapSecTotal = Math.floor(elapsedMs / 1000);
  const elapM = Math.floor(elapSecTotal / 60);
  const elapS = elapSecTotal % 60;
  const displayElapsed = `${String(elapM).padStart(2, '0')}:${String(elapS).padStart(2, '0')}`;

  // Theme styling based on bgMode
  const surfaceClasses =
    bgMode === 'dark'
      ? 'bg-[#181F1B] text-white border-[#2A342D]'
      : bgMode === 'auto'
      ? 'bg-white dark:bg-[#181F1B] text-[#252B27] dark:text-white border-[#E4E1D9] dark:border-[#2A342D]'
      : 'bg-white text-[#252B27] border-[#E4E1D9]';

  const secondaryBoxBg =
    bgMode === 'dark'
      ? 'bg-[#212A25]'
      : bgMode === 'auto'
      ? 'bg-[#F7F6F2] dark:bg-[#212A25]'
      : 'bg-[#F7F6F2]';

  return (
    <div
      className={`w-full rounded-2xl border shadow-sm transition-colors relative overflow-hidden p-6 sm:p-10 ${surfaceClasses}`}
    >
      {/* =================================================================== */}
      {/* TOP SECTION: 2-COLUMN MAIN TIMER & CONTROLS                        */}
      {/* =================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* LEFT COLUMN: VISUAL COUNTDOWN DISPLAY & 3 TRANSPORT BUTTONS */}
        <div
          ref={containerRef}
          className={`lg:col-span-6 flex flex-col items-center justify-center relative ${
            isFullscreen ? `timer-fullscreen-stage p-8 ${surfaceClasses} border-0` : ''
          }`}
        >
          {isFullscreen && (
            <button
              type="button"
              onClick={handleToggleFullscreen}
              className="fixed top-4 right-4 z-50 inline-flex items-center gap-1.5 rounded-full bg-black/55 hover:bg-black/75 backdrop-blur-md border border-white/20 px-4 py-2 text-xs font-bold text-white shadow-lg transition cursor-pointer"
              aria-label="Exit Fullscreen"
            >
              <Minimize2 className="h-4 w-4" />
              <span>Exit Fullscreen</span>
            </button>
          )}
          {/* Main Visual Display Area */}
          <div className={`${isFullscreen ? 'w-[80vmin] h-[80vmin] max-w-[520px] max-h-[520px]' : 'w-full max-w-[340px] aspect-square'} flex items-center justify-center relative select-none`}>
            {/* 1. CIRCULAR STYLE (Default) */}
            {visualStyle === 'circular' && (
              <div className="relative w-full h-full flex items-center justify-center">
                <svg viewBox="0 0 240 240" shapeRendering="geometricPrecision" className="w-full h-full">
                  {/* Subtle Background Track */}
                  <circle
                    cx="120"
                    cy="120"
                    r="92"
                    fill="none"
                    stroke={bgMode === 'dark' ? '#2A342D' : '#E7EDE7'}
                    strokeWidth="18"
                  />
                  {/* Active Remaining Ring Arc */}
                  <circle
                    cx="120"
                    cy="120"
                    r="92"
                    fill="none"
                    stroke={timerColor}
                    strokeWidth="18"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 92}
                    strokeDashoffset={2 * Math.PI * 92 * (1 - remainingFraction)}
                    transform="rotate(-90 120 120)"
                    className="transition-all duration-75"
                  />
                </svg>

                {/* Digital Readout Center */}
                {showTimeText && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                    <span className="text-4xl sm:text-5xl font-bold font-mono tracking-tight tabular-nums">
                      {displayTime}
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-[#252B27]/60 dark:text-slate-400 mt-1">
                      Time Left
                    </span>
                    {showElapsedTime && (
                      <span className="text-[11px] font-mono text-[#252B27]/40 dark:text-slate-500 mt-1">
                        Elapsed: {displayElapsed}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 2. PROGRESS BAR STYLE */}
            {visualStyle === 'progress-bar' && (
              <div className="w-full flex flex-col items-center justify-center space-y-6 px-2">
                {showTimeText && (
                  <div className="text-center">
                    <span className="text-5xl sm:text-6xl font-bold font-mono tracking-tight tabular-nums block">
                      {displayTime}
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-[#252B27]/60 dark:text-slate-400 mt-1 block">
                      Time Left
                    </span>
                  </div>
                )}
                <div
                  className={`w-full h-14 rounded-2xl p-1.5 overflow-hidden ${
                    bgMode === 'dark'
                      ? 'bg-[#2A342D]'
                      : bgMode === 'auto'
                      ? 'bg-[#E7EDE7] dark:bg-[#2A342D]'
                      : 'bg-[#E7EDE7]'
                  }`}
                >
                  <div
                    className="h-full rounded-xl transition-all duration-150"
                    style={{
                      width: `${remainingFraction * 100}%`,
                      backgroundColor: timerColor,
                    }}
                  />
                </div>
                <div className="w-full flex justify-between text-xs font-mono text-[#252B27]/50 dark:text-slate-400 px-1">
                  <span>0%</span>
                  <span>{Math.round(remainingFraction * 100)}% remaining</span>
                  <span>100%</span>
                </div>
              </div>
            )}

            {/* 3. HOURGLASS STYLE */}
            {visualStyle === 'hourglass' && (
              <div className="w-full flex flex-col items-center justify-center space-y-4">
                <div className="w-32 h-44 relative">
                  <svg viewBox="0 0 120 180" className="w-full h-full">
                    {/* Top & bottom wooden frames */}
                    <rect x="15" y="6" width="90" height="8" rx="4" fill="#365C4B" />
                    <rect x="15" y="166" width="90" height="8" rx="4" fill="#365C4B" />
                    {/* Glass contour */}
                    <path
                      d="M25 14 L95 14 L66 88 L95 166 L25 166 L54 88 Z"
                      fill="none"
                      stroke={bgMode === 'dark' ? '#4A5850' : '#B8C2B8'}
                      strokeWidth="3"
                    />
                    {/* Upper chamber sand */}
                    <clipPath id="topGlassClip">
                      <polygon points="28,16 92,16 62,86 58,86" />
                    </clipPath>
                    <g clipPath="url(#topGlassClip)">
                      <rect
                        x="25"
                        y={16 + (1 - remainingFraction) * 70}
                        width="70"
                        height={remainingFraction * 70}
                        fill={timerColor}
                      />
                    </g>
                    {/* Trickling sand stream */}
                    {status === 'running' && remainingFraction > 0 && (
                      <line
                        x1="60"
                        y1="86"
                        x2="60"
                        y2="164"
                        stroke={timerColor}
                        strokeWidth="2.5"
                        strokeDasharray="4 3"
                      />
                    )}
                    {/* Lower chamber accumulating sand */}
                    <clipPath id="bottomGlassClip">
                      <polygon points="58,90 62,90 92,164 28,164" />
                    </clipPath>
                    <g clipPath="url(#bottomGlassClip)">
                      <rect
                        x="25"
                        y={164 - (1 - remainingFraction) * 74}
                        width="70"
                        height={(1 - remainingFraction) * 74}
                        fill={timerColor}
                      />
                    </g>
                  </svg>
                </div>
                {showTimeText && (
                  <div className="text-center">
                    <span className="text-3xl sm:text-4xl font-bold font-mono tracking-tight tabular-nums block">
                      {displayTime}
                    </span>
                    <span className="text-xs font-medium text-[#252B27]/60 dark:text-slate-400 mt-0.5 block">
                      Time Left
                    </span>
                  </div>
                )}
                <Link
                  href="/timers/sand-timer"
                  className="text-xs font-semibold text-[#365C4B] dark:text-[#5E917A] hover:underline flex items-center gap-1"
                >
                  <span>Open Full 3D Sand Timer →</span>
                </Link>
              </div>
            )}

            {/* 4. TRAFFIC LIGHT STYLE */}
            {visualStyle === 'traffic-light' && (
              <div className="w-full flex items-center justify-center gap-6">
                <div
                  className={`p-3.5 rounded-3xl border-2 flex flex-col gap-3 shadow-md ${
                    bgMode === 'dark' ? 'bg-[#121614] border-[#2A342D]' : 'bg-[#252B27] border-[#181D1A]'
                  }`}
                >
                  {/* Red light (top) */}
                  <div
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      status === 'completed' || remainingFraction === 0
                        ? 'bg-[#D94343] border-[#FF8585] shadow-lg shadow-red-500/50 scale-105'
                        : 'bg-[#401818] border-[#2B1010] opacity-40'
                    }`}
                  />
                  {/* Amber light (middle) */}
                  <div
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      remainingFraction > 0 && remainingFraction <= 0.2
                        ? 'bg-[#E06A3B] border-[#FFB28E] shadow-lg shadow-amber-500/50 scale-105'
                        : 'bg-[#3A2215] border-[#2B180D] opacity-40'
                    }`}
                  />
                  {/* Green light (bottom) */}
                  <div
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      remainingFraction > 0.2
                        ? 'bg-[#365C4B] border-[#70B393] shadow-lg shadow-emerald-600/50 scale-105'
                        : 'bg-[#16271F] border-[#0E1B15] opacity-40'
                    }`}
                  />
                </div>
                {showTimeText && (
                  <div className="text-left">
                    <span className="text-4xl sm:text-5xl font-bold font-mono tracking-tight tabular-nums block">
                      {displayTime}
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-[#252B27]/60 dark:text-slate-400 mt-1 block">
                      {status === 'completed'
                        ? 'Time is Up'
                        : remainingFraction <= 0.2
                        ? 'Wrapping Up'
                        : 'Time Left'}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* 5. RAINBOW STYLE */}
            {visualStyle === 'rainbow' && (
              <div className="w-full flex flex-col items-center justify-center space-y-4">
                <div className="relative w-56 h-32 flex items-center justify-center overflow-hidden">
                  <svg viewBox="0 0 200 110" className="w-full h-full">
                    {/* Rainbow Arcs */}
                    {[
                      { r: 90, color: '#D94343' },
                      { r: 76, color: '#E06A3B' },
                      { r: 62, color: '#E5A93C' },
                      { r: 48, color: '#365C4B' },
                      { r: 34, color: '#2E6FD9' },
                      { r: 20, color: '#884DFF' },
                    ].map((band, idx) => {
                      const circ = Math.PI * band.r;
                      const offset = circ * (1 - remainingFraction);
                      return (
                        <path
                          key={idx}
                          d={`M ${100 - band.r} 105 A ${band.r} ${band.r} 0 0 1 ${100 + band.r} 105`}
                          fill="none"
                          stroke={band.color}
                          strokeWidth="10"
                          strokeLinecap="round"
                          strokeDasharray={circ}
                          strokeDashoffset={offset}
                          className="transition-all duration-100"
                        />
                      );
                    })}
                  </svg>
                </div>
                {showTimeText && (
                  <div className="text-center">
                    <span className="text-4xl sm:text-5xl font-bold font-mono tracking-tight tabular-nums block">
                      {displayTime}
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-[#252B27]/60 dark:text-slate-400 mt-1 block">
                      Time Left
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* 6. MINIMAL DIGITAL STYLE */}
            {visualStyle === 'minimal-digital' && (
              <div className="w-full flex flex-col items-center justify-center">
                <div
                  className={`w-full py-8 px-6 rounded-2xl border-2 text-center transition-all ${
                    status === 'running'
                      ? 'border-[#365C4B] shadow-lg shadow-[#365C4B]/10'
                      : 'border-[#E4E1D9] dark:border-[#2A342D]'
                  }`}
                  style={{ backgroundColor: secondaryBoxBg }}
                >
                  <span className="text-5xl sm:text-6xl font-bold font-mono tracking-tight tabular-nums block">
                    {displayTime}
                  </span>
                  {showTimeText && (
                    <span className="text-xs sm:text-sm font-medium text-[#252B27]/60 dark:text-slate-400 mt-2 block uppercase tracking-wider">
                      {status === 'completed'
                        ? 'Session Finished'
                        : status === 'running'
                        ? 'Counting Down'
                        : 'Time Left'}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 3 Dedicated Transport Buttons side by side matching the screenshot */}
          {!isFullscreen && (
          <div className="flex items-center gap-3 mt-6">
            {/* Start Button */}
            <button
              type="button"
              onClick={handleStart}
              className="px-6 py-2.5 rounded-xl text-white font-medium text-sm flex items-center gap-2 shadow-xs transition-transform active:scale-95 cursor-pointer hover:opacity-95"
              style={{ backgroundColor: timerColor }}
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start</span>
            </button>

            {/* Pause Button */}
            <button
              type="button"
              onClick={handlePause}
              className={`px-6 py-2.5 rounded-xl border text-sm font-medium flex items-center gap-2 transition-all active:scale-95 cursor-pointer ${
                bgMode === 'dark'
                  ? 'border-[#2A342D] bg-[#212A25] hover:bg-[#28332D] text-white'
                  : bgMode === 'auto'
                  ? 'border-[#E4E1D9] dark:border-[#2A342D] bg-white dark:bg-[#212A25] hover:bg-[#F7F6F2] dark:hover:bg-[#28332D] text-[#252B27] dark:text-white'
                  : 'border-[#E4E1D9] bg-white hover:bg-[#F7F6F2] text-[#252B27]'
              }`}
            >
              <Pause className="w-4 h-4 fill-current" />
              <span>Pause</span>
            </button>

            {/* Reset Button */}
            <button
              type="button"
              onClick={handleReset}
              className={`px-6 py-2.5 rounded-xl border text-sm font-medium flex items-center gap-2 transition-all active:scale-95 cursor-pointer ${
                bgMode === 'dark'
                  ? 'border-[#2A342D] bg-[#212A25] hover:bg-[#28332D] text-white'
                  : bgMode === 'auto'
                  ? 'border-[#E4E1D9] dark:border-[#2A342D] bg-white dark:bg-[#212A25] hover:bg-[#F7F6F2] dark:hover:bg-[#28332D] text-[#252B27] dark:text-white'
                  : 'border-[#E4E1D9] bg-white hover:bg-[#F7F6F2] text-[#252B27]'
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>
          )}
        </div>

        {/* RIGHT COLUMN: MODE TABS, STEPPERS, PRESETS & SETTINGS GRID */}
        <div className="lg:col-span-6 space-y-6">
          {/* Duration vs End Time Tabs */}
          <div className="flex items-center justify-start">
            <div
              className={`p-1 rounded-xl flex items-center gap-1 ${
                bgMode === 'dark'
                  ? 'bg-[#212A25]'
                  : bgMode === 'auto'
                  ? 'bg-[#E7EDE7] dark:bg-[#212A25]'
                  : 'bg-[#E7EDE7]'
              }`}
            >
              <button
                type="button"
                onClick={() => setTimerMode('duration')}
                className={`px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  timerMode === 'duration'
                    ? 'text-white shadow-xs'
                    : 'text-[#252B27]/70 dark:text-slate-300 hover:text-[#252B27] dark:hover:text-white'
                }`}
                style={{
                  backgroundColor: timerMode === 'duration' ? timerColor : 'transparent',
                }}
              >
                Duration
              </button>
              <button
                type="button"
                onClick={() => setTimerMode('endTime')}
                className={`px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  timerMode === 'endTime'
                    ? 'text-white shadow-xs'
                    : 'text-[#252B27]/70 dark:text-slate-300 hover:text-[#252B27] dark:hover:text-white'
                }`}
                style={{
                  backgroundColor: timerMode === 'endTime' ? timerColor : 'transparent',
                }}
              >
                End Time
              </button>
            </div>
          </div>

          {/* Stepper Inputs: [15] [00] [00] minutes (or End Time clock input) */}
          {timerMode === 'duration' ? (
            <div className="flex items-center gap-3">
              {/* Minutes box */}
              <div
                className={`flex items-center rounded-xl border px-3 py-1.5 ${
                  bgMode === 'dark'
                    ? 'bg-[#212A25] border-[#2A342D]'
                    : bgMode === 'auto'
                    ? 'bg-[#F7F6F2] dark:bg-[#212A25] border-[#E4E1D9] dark:border-[#2A342D]'
                    : 'bg-[#F7F6F2] border-[#E4E1D9]'
                }`}
              >
                <input
                  type="text"
                  inputMode="numeric"
                  value={String(minutes).padStart(2, '0')}
                  onChange={(e) => {
                    const val = Math.max(0, Math.min(59, parseInt(e.target.value, 10) || 0));
                    setMinutes(val);
                    syncDurationFromInputs(hours, val, seconds);
                  }}
                  className="w-10 text-center font-mono text-base font-bold bg-transparent outline-hidden"
                  aria-label="Minutes"
                />
                <div className="flex flex-col ml-1">
                  <button
                    type="button"
                    onClick={() => adjustValue('m', 1)}
                    className="text-[#252B27]/60 dark:text-slate-400 hover:text-[#365C4B] cursor-pointer"
                    aria-label="Increase minutes"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustValue('m', -1)}
                    className="text-[#252B27]/60 dark:text-slate-400 hover:text-[#365C4B] cursor-pointer"
                    aria-label="Decrease minutes"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Seconds box */}
              <div
                className={`flex items-center rounded-xl border px-3 py-1.5 ${
                  bgMode === 'dark'
                    ? 'bg-[#212A25] border-[#2A342D]'
                    : bgMode === 'auto'
                    ? 'bg-[#F7F6F2] dark:bg-[#212A25] border-[#E4E1D9] dark:border-[#2A342D]'
                    : 'bg-[#F7F6F2] border-[#E4E1D9]'
                }`}
              >
                <input
                  type="text"
                  inputMode="numeric"
                  value={String(seconds).padStart(2, '0')}
                  onChange={(e) => {
                    const val = Math.max(0, Math.min(59, parseInt(e.target.value, 10) || 0));
                    setSeconds(val);
                    syncDurationFromInputs(hours, minutes, val);
                  }}
                  className="w-10 text-center font-mono text-base font-bold bg-transparent outline-hidden"
                  aria-label="Seconds"
                />
                <div className="flex flex-col ml-1">
                  <button
                    type="button"
                    onClick={() => adjustValue('s', 5)}
                    className="text-[#252B27]/60 dark:text-slate-400 hover:text-[#365C4B] cursor-pointer"
                    aria-label="Increase seconds"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustValue('s', -5)}
                    className="text-[#252B27]/60 dark:text-slate-400 hover:text-[#365C4B] cursor-pointer"
                    aria-label="Decrease seconds"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Optional Hours box */}
              <div
                className={`flex items-center rounded-xl border px-3 py-1.5 ${
                  bgMode === 'dark'
                    ? 'bg-[#212A25] border-[#2A342D]'
                    : bgMode === 'auto'
                    ? 'bg-[#F7F6F2] dark:bg-[#212A25] border-[#E4E1D9] dark:border-[#2A342D]'
                    : 'bg-[#F7F6F2] border-[#E4E1D9]'
                }`}
              >
                <input
                  type="text"
                  inputMode="numeric"
                  value={String(hours).padStart(2, '0')}
                  onChange={(e) => {
                    const val = Math.max(0, Math.min(23, parseInt(e.target.value, 10) || 0));
                    setHours(val);
                    syncDurationFromInputs(val, minutes, seconds);
                  }}
                  className="w-10 text-center font-mono text-base font-bold bg-transparent outline-hidden"
                  aria-label="Hours"
                />
                <div className="flex flex-col ml-1">
                  <button
                    type="button"
                    onClick={() => adjustValue('h', 1)}
                    className="text-[#252B27]/60 dark:text-slate-400 hover:text-[#365C4B] cursor-pointer"
                    aria-label="Increase hours"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustValue('h', -1)}
                    className="text-[#252B27]/60 dark:text-slate-400 hover:text-[#365C4B] cursor-pointer"
                    aria-label="Decrease hours"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <span className="text-xs sm:text-sm font-medium text-[#252B27]/70 dark:text-slate-300">
                minutes
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <input
                type="time"
                value={targetEndTimeStr}
                onChange={(e) => handleEndTimeChange(e.target.value)}
                className={`px-4 py-2 rounded-xl border font-mono text-base font-bold ${
                  bgMode === 'dark'
                    ? 'bg-[#212A25] border-[#2A342D] text-white'
                    : bgMode === 'auto'
                    ? 'bg-[#F7F6F2] dark:bg-[#212A25] border-[#E4E1D9] dark:border-[#2A342D] text-[#252B27] dark:text-white'
                    : 'bg-[#F7F6F2] border-[#E4E1D9] text-[#252B27]'
                }`}
              />
              <span className="text-xs sm:text-sm text-[#252B27]/70 dark:text-slate-300">
                Count down to target time
              </span>
            </div>
          )}

          {/* Quick Presets: 1 min, 5 min, 10 min, 15 min [active], 30 min, Custom */}
          <div className="flex flex-wrap items-center gap-2">
            {PRESETS.map((p) => {
              const isSelected = selectedPreset === p.label;
              return (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => handleSelectPreset(p.label, p.seconds)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'text-white shadow-xs'
                      : bgMode === 'dark'
                      ? 'bg-[#212A25] text-slate-300 hover:bg-[#2B352F]'
                      : bgMode === 'auto'
                      ? 'bg-[#F7F6F2] dark:bg-[#212A25] text-[#252B27] dark:text-slate-300 hover:bg-[#ECE8DF] dark:hover:bg-[#2B352F]'
                      : 'bg-[#F7F6F2] text-[#252B27] hover:bg-[#ECE8DF]'
                  }`}
                  style={{
                    backgroundColor: isSelected ? timerColor : undefined,
                  }}
                >
                  {p.label}
                </button>
              );
            })}
            <button
              type="button"
              onClick={handleCustomPresetClick}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                selectedPreset === 'Custom'
                  ? 'text-white shadow-xs'
                  : bgMode === 'dark'
                  ? 'bg-[#212A25] text-slate-300 hover:bg-[#2B352F]'
                  : bgMode === 'auto'
                  ? 'bg-[#F7F6F2] dark:bg-[#212A25] text-[#252B27] dark:text-slate-300 hover:bg-[#ECE8DF] dark:hover:bg-[#2B352F]'
                  : 'bg-[#F7F6F2] text-[#252B27] hover:bg-[#ECE8DF]'
              }`}
              style={{
                backgroundColor: selectedPreset === 'Custom' ? timerColor : undefined,
              }}
            >
              Custom
            </button>
          </div>

          {/* 2-Column Settings Grid with Toggles matching the screenshot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5 pt-2">
            {/* Left Column Controls */}
            {/* 1. Sound */}
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-medium flex items-center gap-2">
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-[#365C4B] dark:text-[#5E917A]" />
                ) : (
                  <VolumeX className="w-4 h-4 text-slate-400" />
                )}
                <span>Sound</span>
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={soundEnabled}
                onClick={() => setSoundEnabled((prev) => !prev)}
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                  soundEnabled ? 'bg-[#365C4B]' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    soundEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* 4. Fullscreen */}
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-medium flex items-center gap-2">
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4 text-[#365C4B] dark:text-[#5E917A]" />
                ) : (
                  <Maximize2 className="w-4 h-4 text-[#365C4B] dark:text-[#5E917A]" />
                )}
                <span>Fullscreen</span>
              </span>
              <button
                type="button"
                onClick={handleToggleFullscreen}
                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                  bgMode === 'dark'
                    ? 'border-[#2A342D] hover:bg-[#212A25]'
                    : bgMode === 'auto'
                    ? 'border-[#E4E1D9] dark:border-[#2A342D] hover:bg-[#F7F6F2] dark:hover:bg-[#212A25]'
                    : 'border-[#E4E1D9] hover:bg-[#F7F6F2]'
                }`}
                title="Toggle Fullscreen (F)"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 2. Alarm at end */}
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-medium flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#365C4B]" />
                <span>Alarm at end</span>
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={alarmAtEnd}
                onClick={() => setAlarmAtEnd((prev) => !prev)}
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                  alarmAtEnd ? 'bg-[#365C4B]' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    alarmAtEnd ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* 5. Show time text */}
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-medium flex items-center gap-2">
                <span className="w-4 h-4 font-mono font-bold text-xs flex items-center justify-center text-[#365C4B]">
                  00
                </span>
                <span>Show time text</span>
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={showTimeText}
                onClick={() => setShowTimeText((prev) => !prev)}
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                  showTimeText ? 'bg-[#365C4B]' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    showTimeText ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* 3. Elapsed time */}
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-medium flex items-center gap-2">
                <span className="w-4 h-4 rounded-full border border-current text-[9px] flex items-center justify-center text-[#365C4B]">
                  +
                </span>
                <span>Elapsed time</span>
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={showElapsedTime}
                onClick={() => setShowElapsedTime((prev) => !prev)}
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                  showElapsedTime ? 'bg-[#365C4B]' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    showElapsedTime ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* 6. Keep screen awake */}
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-medium flex items-center gap-2">
                <Sun className="w-4 h-4 text-[#365C4B]" />
                <span>Keep screen awake</span>
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={keepScreenAwake}
                onClick={() => setKeepScreenAwake((prev) => !prev)}
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                  keepScreenAwake ? 'bg-[#365C4B]' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    keepScreenAwake ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* SECTION 2: CHOOSE VISUAL STYLE (6 CARDS WITH MINI PREVIEWS)         */}
      {/* =================================================================== */}
      <div className="mt-10 pt-8 border-t border-[#E4E1D9] dark:border-[#2A342D]">
        <h3 className="text-sm sm:text-base font-bold text-[#252B27] dark:text-white mb-4">
          Choose Visual Style
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {/* 1. Circular */}
          <button
            type="button"
            onClick={() => setVisualStyle('circular')}
            className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-between transition-all cursor-pointer ${
              visualStyle === 'circular'
                ? 'border-[#365C4B] bg-[#E7EDE7]/40 dark:bg-[#252E28] ring-1 ring-[#365C4B]'
                : bgMode === 'dark'
                ? 'border-[#2A342D] bg-[#212A25] hover:border-slate-600'
                : bgMode === 'auto'
                ? 'border-[#E4E1D9] dark:border-[#2A342D] bg-white dark:bg-[#212A25] hover:border-[#365C4B]/50 dark:hover:border-slate-600'
                : 'border-[#E4E1D9] bg-white hover:border-[#365C4B]/50'
            }`}
          >
            <div className="w-12 h-12 relative flex items-center justify-center my-1">
              <svg viewBox="0 0 40 40" className="w-full h-full">
                <circle cx="20" cy="20" r="14" fill="none" stroke="#E7EDE7" strokeWidth="4" />
                <circle
                  cx="20"
                  cy="20"
                  r="14"
                  fill="none"
                  stroke={timerColor}
                  strokeWidth="4"
                  strokeDasharray={2 * Math.PI * 14}
                  strokeDashoffset={2 * Math.PI * 14 * 0.25}
                  transform="rotate(-90 20 20)"
                />
              </svg>
            </div>
            <span className="text-xs font-semibold text-[#252B27] dark:text-white mt-1">
              Circular
            </span>
          </button>

          {/* 2. Progress Bar */}
          <button
            type="button"
            onClick={() => setVisualStyle('progress-bar')}
            className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-between transition-all cursor-pointer ${
              visualStyle === 'progress-bar'
                ? 'border-[#365C4B] bg-[#E7EDE7]/40 dark:bg-[#252E28] ring-1 ring-[#365C4B]'
                : bgMode === 'dark'
                ? 'border-[#2A342D] bg-[#212A25] hover:border-slate-600'
                : bgMode === 'auto'
                ? 'border-[#E4E1D9] dark:border-[#2A342D] bg-white dark:bg-[#212A25] hover:border-[#365C4B]/50 dark:hover:border-slate-600'
                : 'border-[#E4E1D9] bg-white hover:border-[#365C4B]/50'
            }`}
          >
            <div className="w-16 h-12 flex items-center justify-center my-1">
              <div className="w-full h-3 rounded-full bg-[#E7EDE7] p-0.5">
                <div
                  className="h-full w-2/3 rounded-full"
                  style={{ backgroundColor: timerColor }}
                />
              </div>
            </div>
            <span className="text-xs font-semibold text-[#252B27] dark:text-white mt-1">
              Progress Bar
            </span>
          </button>

          {/* 3. Hourglass */}
          <button
            type="button"
            onClick={() => setVisualStyle('hourglass')}
            className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-between transition-all cursor-pointer ${
              visualStyle === 'hourglass'
                ? 'border-[#365C4B] bg-[#E7EDE7]/40 dark:bg-[#252E28] ring-1 ring-[#365C4B]'
                : bgMode === 'dark'
                ? 'border-[#2A342D] bg-[#212A25] hover:border-slate-600'
                : bgMode === 'auto'
                ? 'border-[#E4E1D9] dark:border-[#2A342D] bg-white dark:bg-[#212A25] hover:border-[#365C4B]/50 dark:hover:border-slate-600'
                : 'border-[#E4E1D9] bg-white hover:border-[#365C4B]/50'
            }`}
          >
            <div className="w-12 h-12 relative flex items-center justify-center my-1">
              <svg viewBox="0 0 30 40" className="w-6 h-8">
                <rect x="2" y="2" width="26" height="3" rx="1.5" fill="#365C4B" />
                <rect x="2" y="35" width="26" height="3" rx="1.5" fill="#365C4B" />
                <path d="M5 5 L25 5 L17 20 L25 35 L5 35 L13 20 Z" fill="none" stroke="#8A9A8A" strokeWidth="1.5" />
                <polygon points="7,8 23,8 15,19" fill="#D94343" />
                <polygon points="15,21 21,32 9,32" fill="#D94343" />
              </svg>
            </div>
            <span className="text-xs font-semibold text-[#252B27] dark:text-white mt-1">
              Hourglass
            </span>
          </button>

          {/* 4. Traffic Light */}
          <button
            type="button"
            onClick={() => setVisualStyle('traffic-light')}
            className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-between transition-all cursor-pointer ${
              visualStyle === 'traffic-light'
                ? 'border-[#365C4B] bg-[#E7EDE7]/40 dark:bg-[#252E28] ring-1 ring-[#365C4B]'
                : bgMode === 'dark'
                ? 'border-[#2A342D] bg-[#212A25] hover:border-slate-600'
                : bgMode === 'auto'
                ? 'border-[#E4E1D9] dark:border-[#2A342D] bg-white dark:bg-[#212A25] hover:border-[#365C4B]/50 dark:hover:border-slate-600'
                : 'border-[#E4E1D9] bg-white hover:border-[#365C4B]/50'
            }`}
          >
            <div className="w-12 h-12 flex flex-col items-center justify-center gap-1 my-1">
              <div className="w-2.5 h-2.5 rounded-full bg-[#D94343]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#E06A3B]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#365C4B]" />
            </div>
            <span className="text-xs font-semibold text-[#252B27] dark:text-white mt-1">
              Traffic Light
            </span>
          </button>

          {/* 5. Rainbow */}
          <button
            type="button"
            onClick={() => setVisualStyle('rainbow')}
            className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-between transition-all cursor-pointer ${
              visualStyle === 'rainbow'
                ? 'border-[#365C4B] bg-[#E7EDE7]/40 dark:bg-[#252E28] ring-1 ring-[#365C4B]'
                : bgMode === 'dark'
                ? 'border-[#2A342D] bg-[#212A25] hover:border-slate-600'
                : bgMode === 'auto'
                ? 'border-[#E4E1D9] dark:border-[#2A342D] bg-white dark:bg-[#212A25] hover:border-[#365C4B]/50 dark:hover:border-slate-600'
                : 'border-[#E4E1D9] bg-white hover:border-[#365C4B]/50'
            }`}
          >
            <div className="w-12 h-12 flex items-center justify-center my-1">
              <svg viewBox="0 0 40 24" className="w-10 h-6">
                <path d="M 4 22 A 16 16 0 0 1 36 22" fill="none" stroke="#D94343" strokeWidth="2.5" />
                <path d="M 7 22 A 13 13 0 0 1 33 22" fill="none" stroke="#E06A3B" strokeWidth="2.5" />
                <path d="M 10 22 A 10 10 0 0 1 30 22" fill="none" stroke="#365C4B" strokeWidth="2.5" />
                <path d="M 13 22 A 7 7 0 0 1 27 22" fill="none" stroke="#2E6FD9" strokeWidth="2.5" />
              </svg>
            </div>
            <span className="text-xs font-semibold text-[#252B27] dark:text-white mt-1">
              Rainbow
            </span>
          </button>

          {/* 6. Minimal Digital */}
          <button
            type="button"
            onClick={() => setVisualStyle('minimal-digital')}
            className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-between transition-all cursor-pointer ${
              visualStyle === 'minimal-digital'
                ? 'border-[#365C4B] bg-[#E7EDE7]/40 dark:bg-[#252E28] ring-1 ring-[#365C4B]'
                : bgMode === 'dark'
                ? 'border-[#2A342D] bg-[#212A25] hover:border-slate-600'
                : bgMode === 'auto'
                ? 'border-[#E4E1D9] dark:border-[#2A342D] bg-white dark:bg-[#212A25] hover:border-[#365C4B]/50 dark:hover:border-slate-600'
                : 'border-[#E4E1D9] bg-white hover:border-[#365C4B]/50'
            }`}
          >
            <div className="w-14 h-12 flex items-center justify-center my-1">
              <div className="px-2 py-1 rounded-md border border-[#E4E1D9] dark:border-slate-600 font-mono text-[11px] font-bold">
                15:00
              </div>
            </div>
            <span className="text-xs font-semibold text-[#252B27] dark:text-white mt-1">
              Minimal Digital
            </span>
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* SECTION 3: APPEARANCE (COLOR SWATCHES & LIGHT/DARK/AUTO MODE)       */}
      {/* =================================================================== */}
      <div className="mt-8 pt-6 border-t border-[#E4E1D9] dark:border-[#2A342D] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        {/* Timer Color Swatches */}
        <div className="flex items-center gap-3">
          <span className="text-xs sm:text-sm font-medium text-[#252B27]/80 dark:text-slate-300">
            Timer Color
          </span>
          <div className="flex items-center gap-2">
            {COLOR_SWATCHES.map((col) => (
              <button
                key={col.id}
                type="button"
                onClick={() => setTimerColor(col.hex)}
                className={`w-6 h-6 rounded-full transition-transform cursor-pointer flex items-center justify-center ${
                  timerColor === col.hex ? 'ring-2 ring-offset-2 ring-[#252B27] dark:ring-white scale-110' : 'hover:scale-105'
                }`}
                style={{ backgroundColor: col.hex }}
                title={col.label}
                aria-label={col.label}
              >
                {timerColor === col.hex && <Check className="w-3 h-3 text-white stroke-[3]" />}
              </button>
            ))}
          </div>
        </div>

        {/* Background Mode: Light / Dark / Auto */}
        <div className="flex items-center gap-3">
          <span className="text-xs sm:text-sm font-medium text-[#252B27]/80 dark:text-slate-300">
            Background Mode
          </span>
          <div
            className={`p-1 rounded-xl flex items-center gap-1 border ${
              bgMode === 'dark'
                ? 'bg-[#212A25] border-[#2A342D]'
                : bgMode === 'auto'
                ? 'bg-[#F7F6F2] dark:bg-[#212A25] border-[#E4E1D9] dark:border-[#2A342D]'
                : 'bg-[#F7F6F2] border-[#E4E1D9]'
            }`}
          >
            <button
              type="button"
              onClick={() => setBgMode('light')}
              className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                bgMode === 'light'
                  ? 'bg-white text-[#252B27] shadow-xs font-semibold'
                  : 'text-[#252B27]/70 dark:text-slate-400'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Light</span>
            </button>
            <button
              type="button"
              onClick={() => setBgMode('dark')}
              className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                bgMode === 'dark'
                  ? 'bg-[#2A342D] text-white shadow-xs font-semibold'
                  : 'text-[#252B27]/70 dark:text-slate-400'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Dark</span>
            </button>
            <button
              type="button"
              onClick={() => setBgMode('auto')}
              className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                bgMode === 'auto'
                  ? 'bg-white dark:bg-[#2A342D] text-[#252B27] dark:text-white shadow-xs font-semibold'
                  : 'text-[#252B27]/70 dark:text-slate-400'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Auto</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

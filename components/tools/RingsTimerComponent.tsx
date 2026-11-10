'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Bell,
  Maximize2,
  Minimize2,
  Eye,
  Clock,
  Settings,
  Brain,
  BookOpen,
  Users,
  Coffee,
  BarChart3,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { playTimerSound } from '@/lib/sound';
import { requestWakeLock, releaseWakeLock } from '@/lib/wakelock';

type RingStyle = 'classic' | 'gradient' | 'minimal' | 'dashed';
type InputMode = 'duration' | 'endtime';

interface RingColorOption {
  id: string;
  name: string;
  hex: string;
  gradEnd: string;
}

const RING_COLOR_OPTIONS: RingColorOption[] = [
  { id: 'green', name: 'Emerald Green', hex: '#22C55E', gradEnd: '#10B981' },
  { id: 'blue', name: 'Ocean Blue', hex: '#1D8CF8', gradEnd: '#6366F1' },
  { id: 'orange', name: 'Sunset Orange', hex: '#F97316', gradEnd: '#FACC15' },
  { id: 'coral', name: 'Coral Red', hex: '#EF4444', gradEnd: '#EC4899' },
  { id: 'purple', name: 'Royal Purple', hex: '#8B5CF6', gradEnd: '#EC4899' },
  { id: 'teal', name: 'Teal Cyan', hex: '#06B6D4', gradEnd: '#3B82F6' },
  { id: 'amber', name: 'Amber Gold', hex: '#F59E0B', gradEnd: '#EF4444' },
  { id: 'slate', name: 'Charcoal Slate', hex: '#334155', gradEnd: '#64748B' },
];

const PRESET_MINUTES = [1, 3, 5, 10, 15];

const QUICK_PRESETS = [
  { mins: 1, title: '1 Minute', sub: 'Quick tasks', isCustom: false },
  { mins: 3, title: '3 Minutes', sub: 'Short activities', isCustom: false },
  { mins: 5, title: '5 Minutes', sub: 'Focus time', isCustom: false },
  { mins: 10, title: '10 Minutes', sub: 'Work breaks', isCustom: false },
  { mins: 15, title: '15 Minutes', sub: 'Longer sessions', isCustom: false },
  { mins: 0, title: 'Custom', sub: 'Set your own time', isCustom: true },
];

const POPULAR_USES = [
  {
    title: 'Focus and Productivity',
    desc: 'Stay on track and manage your time.',
    icon: Brain,
  },
  {
    title: 'Study Sessions',
    desc: 'Keep study time focused and effective.',
    icon: BookOpen,
  },
  {
    title: 'Classroom Activities',
    desc: 'Manage transitions and group tasks.',
    icon: Users,
  },
  {
    title: 'Work Breaks',
    desc: 'Take regular breaks for better productivity.',
    icon: Coffee,
  },
  {
    title: 'Multi-Stage Tasks',
    desc: 'Track different phases of your activities.',
    icon: BarChart3,
  },
];

function polarToCartesian(cx: number, cy: number, r: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(angleInRadians),
    y: cy + r * Math.sin(angleInRadians),
  };
}

function describeRingArc(cx: number, cy: number, r: number, fraction: number): string {
  const clamped = Math.max(0, Math.min(0.9999, fraction));
  if (clamped <= 0.001) return '';
  const startAngle = 0;
  const endAngle = clamped * 360;
  const start = polarToCartesian(cx, cy, r, startAngle);
  const end = polarToCartesian(cx, cy, r, endAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
}

export default function RingsTimerComponent() {
  const [inputMode, setInputMode] = useState<InputMode>('duration');
  const [durationMinutes, setDurationMinutes] = useState<number>(5);
  const [endTimeStr, setEndTimeStr] = useState<string>('12:30');
  const [totalMs, setTotalMs] = useState<number>(5 * 60 * 1000);
  const [remainingMs, setRemainingMs] = useState<number>(5 * 60 * 1000);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);

  // Appearance & Ring Settings
  const [ringStyle, setRingStyle] = useState<RingStyle>('classic');
  const [outerColorId, setOuterColorId] = useState<string>('green');
  const [middleColorId, setMiddleColorId] = useState<string>('blue');
  const [innerColorId, setInnerColorId] = useState<string>('orange');
  const [openColorMenu, setOpenColorMenu] = useState<'outer' | 'middle' | 'inner' | null>(null);

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showTime, setShowTime] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const customInputRef = useRef<HTMLInputElement>(null);
  const endTimestampRef = useRef<number | null>(null);
  const remainingMsRef = useRef<number>(5 * 60 * 1000);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    remainingMsRef.current = remainingMs;
  }, [remainingMs]);

  const applyDurationMinutes = useCallback((mins: number) => {
    const safeMins = Math.max(1, Math.min(999, Math.round(mins || 1)));
    setDurationMinutes(safeMins);
    const ms = safeMins * 60 * 1000;
    setTotalMs(ms);
    setRemainingMs(ms);
    remainingMsRef.current = ms;
    setIsRunning(false);
    setIsCompleted(false);
    setHasStarted(false);
    endTimestampRef.current = null;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  const applyEndTime = useCallback((timeVal: string) => {
    setEndTimeStr(timeVal);
    const parts = timeVal.split(':');
    if (parts.length !== 2) return;
    const targetHours = parseInt(parts[0], 10);
    const targetMinutes = parseInt(parts[1], 10);
    if (isNaN(targetHours) || isNaN(targetMinutes)) return;

    const now = new Date();
    const target = new Date();
    target.setHours(targetHours, targetMinutes, 0, 0);
    if (target.getTime() <= now.getTime()) {
      target.setDate(target.getDate() + 1);
    }
    const diffMs = Math.max(60 * 1000, target.getTime() - now.getTime());
    setTotalMs(diffMs);
    setRemainingMs(diffMs);
    remainingMsRef.current = diffMs;
    setDurationMinutes(Math.max(1, Math.round(diffMs / 60000)));
    setIsRunning(false);
    setIsCompleted(false);
    setHasStarted(false);
    endTimestampRef.current = null;
  }, []);

  useEffect(() => {
    if (!isRunning) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      releaseWakeLock();
      return;
    }

    requestWakeLock();
    endTimestampRef.current = performance.now() + remainingMsRef.current;

    const tick = (now: number) => {
      if (!endTimestampRef.current) return;
      const left = Math.max(0, endTimestampRef.current - now);
      setRemainingMs(left);
      remainingMsRef.current = left;

      if (left <= 0) {
        setIsRunning(false);
        setIsCompleted(true);
        endTimestampRef.current = null;
        if (soundEnabled) {
          playTimerSound('chime');
        }
        releaseWakeLock();
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isRunning, soundEnabled]);

  const handleStart = () => {
    if (remainingMs <= 0) {
      setRemainingMs(totalMs);
      remainingMsRef.current = totalMs;
      setIsCompleted(false);
    }
    setHasStarted(true);
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsCompleted(false);
    setHasStarted(false);
    setRemainingMs(totalMs);
    remainingMsRef.current = totalMs;
    endTimestampRef.current = null;
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement && !isFullscreen) {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
        try {
          const orientation = screen.orientation as unknown as { lock?: (mode: string) => Promise<void> };
          if (orientation?.lock) await orientation.lock('landscape');
        } catch {
          // ignore
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

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // Format MM:SS or HH:MM:SS
  const totalSecondsRemaining = Math.ceil(remainingMs / 1000);
  const hours = Math.floor(totalSecondsRemaining / 3600);
  const minutes = Math.floor((totalSecondsRemaining % 3600) / 60);
  const seconds = totalSecondsRemaining % 60;

  const formattedTime =
    hours > 0
      ? `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      : `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Calculate the 3 concentric ring fractions
  const rawFraction = totalMs > 0 ? Math.max(0, Math.min(1, remainingMs / totalMs)) : 0;

  // Before starting, show the 3 staggered concentric ring arcs matching the mockup so the user sees all 3 rings clearly;
  // Once started, each ring represents a distinct mathematical proportion/stage of the countdown:
  // - Outer Ring: Overall total duration remaining (100% -> 0%)
  // - Middle Ring: 3-phase stage progress (or proportional stage curve)
  // - Inner Ring: Current minute / sub-phase progress
  let outerFraction = 0.72;
  let middleFraction = 0.65;
  let innerFraction = 0.8;

  if (hasStarted || isCompleted || remainingMs < totalMs) {
    if (remainingMs <= 0) {
      outerFraction = 0;
      middleFraction = 0;
      innerFraction = 0;
    } else {
      outerFraction = rawFraction;
      // Middle ring represents current third / stage progress blended smoothly with overall progress
      const stageRemainder = (rawFraction * 3) % 1;
      middleFraction = stageRemainder === 0 && rawFraction > 0 ? 1 : stageRemainder;
      // Inner ring represents current minute cycle (or faster pacing stage for 1-minute timers)
      if (totalMs > 60000) {
        const minRem = (remainingMs % 60000) / 60000;
        innerFraction = minRem === 0 && remainingMs > 0 ? 1 : minRem;
      } else {
        const quarterRem = (rawFraction * 4) % 1;
        innerFraction = quarterRem === 0 && rawFraction > 0 ? 1 : quarterRem;
      }
    }
  }

  const outerColorObj =
    RING_COLOR_OPTIONS.find((c) => c.id === outerColorId) || RING_COLOR_OPTIONS[0];
  const middleColorObj =
    RING_COLOR_OPTIONS.find((c) => c.id === middleColorId) || RING_COLOR_OPTIONS[1];
  const innerColorObj =
    RING_COLOR_OPTIONS.find((c) => c.id === innerColorId) || RING_COLOR_OPTIONS[2];

  const renderConcentricRingsSvg = (size: number = 340) => {
    const cx = size / 2;
    const cy = size / 2;
    const outerR = size * 0.415; // ~141
    const middleR = size * 0.335; // ~114
    const innerR = size * 0.255; // ~86.7

    const strokeW = ringStyle === 'minimal' ? 9 : 16.5;
    const trackColor = '#E2E4E1';
    const dashArray = ringStyle === 'dashed' ? '14 9' : undefined;

    const rings = [
      {
        id: 'outer',
        r: outerR,
        fraction: outerFraction,
        color: ringStyle === 'minimal' && outerColorId === 'green' ? '#334155' : outerColorObj.hex,
        gradId: 'ring-grad-outer',
        gradStart: outerColorObj.hex,
        gradEnd: outerColorObj.gradEnd,
      },
      {
        id: 'middle',
        r: middleR,
        fraction: middleFraction,
        color:
          ringStyle === 'minimal' && middleColorId === 'blue' ? '#EF4444' : middleColorObj.hex,
        gradId: 'ring-grad-middle',
        gradStart: middleColorObj.hex,
        gradEnd: middleColorObj.gradEnd,
      },
      {
        id: 'inner',
        r: innerR,
        fraction: innerFraction,
        color:
          ringStyle === 'minimal' && innerColorId === 'orange' ? '#64748B' : innerColorObj.hex,
        gradId: 'ring-grad-inner',
        gradStart: innerColorObj.hex,
        gradEnd: innerColorObj.gradEnd,
      },
    ];

    return (
      <svg
        viewBox={`0 0 ${size} ${size}`}
        shapeRendering="geometricPrecision"
        className={`w-full h-full ${isFullscreen ? 'w-[80vmin] h-[80vmin] max-w-[540px] max-h-[540px]' : 'max-w-[330px] max-h-[330px]'} select-none`}
        aria-label={`Concentric rings timer showing ${formattedTime} remaining`}
      >
        <defs>
          {rings.map((ring) => (
            <linearGradient key={ring.gradId} id={ring.gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={ring.gradStart} />
              <stop offset="100%" stopColor={ring.gradEnd} />
            </linearGradient>
          ))}
        </defs>

        {rings.map((ring) => {
          const arcPath = describeRingArc(cx, cy, ring.r, ring.fraction);
          const strokePaint = ringStyle === 'gradient' ? `url(#${ring.gradId})` : ring.color;

          return (
            <g key={ring.id}>
              {/* Background Track Circle */}
              <circle
                cx={cx}
                cy={cy}
                r={ring.r}
                fill="none"
                stroke={trackColor}
                strokeWidth={strokeW}
              />

              {/* Active Remaining Ring Arc */}
              {ring.fraction >= 0.999 ? (
                <circle
                  cx={cx}
                  cy={cy}
                  r={ring.r}
                  fill="none"
                  stroke={strokePaint}
                  strokeWidth={strokeW}
                  strokeLinecap={ringStyle === 'dashed' ? 'butt' : 'round'}
                  strokeDasharray={dashArray}
                  transform={`rotate(-90 ${cx} ${cy})`}
                />
              ) : (
                arcPath && (
                  <path
                    d={arcPath}
                    fill="none"
                    stroke={strokePaint}
                    strokeWidth={strokeW}
                    strokeLinecap={ringStyle === 'dashed' ? 'butt' : 'round'}
                    strokeDasharray={dashArray}
                  />
                )
              )}
            </g>
          );
        })}
      </svg>
    );
  };

  // Render mini SVG preview for the 2x2 Ring Style selector
  const renderStyleMiniPreview = (style: RingStyle) => {
    const cx = 28;
    const cy = 28;
    const radii = [21, 16, 11];
    const fractions = [0.76, 0.68, 0.82];
    const sw = style === 'minimal' ? 2.2 : 3.4;

    const colors =
      style === 'minimal'
        ? ['#334155', '#EF4444', '#94A3B8']
        : style === 'gradient'
          ? ['#EC4899', '#8B5CF6', '#06B6D4']
          : ['#22C55E', '#1D8CF8', '#F97316'];

    return (
      <svg viewBox="0 0 56 56" className="w-12 h-12 mx-auto">
        {radii.map((r, idx) => {
          const d = describeRingArc(cx, cy, r, fractions[idx]);
          return (
            <g key={r}>
              <circle cx={cx} cy={cy} r={r} fill="none" stroke="#E2E8F0" strokeWidth={sw} />
              <path
                d={d}
                fill="none"
                stroke={colors[idx]}
                strokeWidth={sw}
                strokeLinecap={style === 'dashed' ? 'butt' : 'round'}
                strokeDasharray={style === 'dashed' ? '3.5 2.5' : undefined}
              />
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="space-y-8">
      {/* MAIN 3-COLUMN INTERACTIVE TOOL CARD */}
      <div className="bg-white dark:bg-[#171C19] rounded-2xl border border-[#E5E0D8] dark:border-[#2A302C] shadow-sm p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch w-full">
          {/* LEFT COLUMN: CONCENTRIC RINGS STAGE (5 cols) */}
          <div className="lg:col-span-5 flex flex-col">
            <div
              ref={stageRef}
              className={`relative flex-1 min-h-[340px] sm:min-h-[380px] rounded-2xl bg-[#F4F4F2] dark:bg-[#1E2521] flex items-center justify-center p-6 overflow-hidden ${
                isFullscreen ? 'timer-fullscreen-stage p-8' : ''
              }`}
            >
              {renderConcentricRingsSvg(340)}

              {/* Center Numeric Time Readout */}
              {(showTime || isFullscreen) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className={`font-mono ${isFullscreen ? 'text-[clamp(2rem,10vmin,4.25rem)]' : 'text-3xl sm:text-[38px]'} font-bold tracking-tight text-[#1A241E] dark:text-white leading-none tabular-nums`}>
                    {formattedTime}
                  </span>
                  {!isFullscreen && (
                    <span className="mt-1.5 text-xs sm:text-sm font-medium text-[#526058] dark:text-[#9BA8A0]">
                      {isCompleted ? 'Completed!' : 'Time Left'}
                    </span>
                  )}
                </div>
              )}

              {isFullscreen && (
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="fixed top-4 right-4 z-50 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-black/55 hover:bg-black/75 backdrop-blur-md border border-white/20 text-xs font-bold text-white shadow-lg transition cursor-pointer"
                  aria-label="Exit Fullscreen"
                >
                  <Minimize2 className="w-4 h-4" />
                  <span>Exit Fullscreen</span>
                </button>
              )}
            </div>
          </div>

          {/* MIDDLE COLUMN: DURATION & PLAYBACK CONTROLS (4 cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-5 py-1">
            <div className="space-y-4">
              {/* Duration / End Time Tabs */}
              <div className="grid grid-cols-2 bg-[#EFECE6] dark:bg-[#222925] p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setInputMode('duration')}
                  className={`py-2.5 text-sm font-semibold rounded-lg transition-all ${
                    inputMode === 'duration'
                      ? 'bg-[#1F4E3B] text-white shadow-xs'
                      : 'text-[#4A5550] dark:text-[#9CA8A1] hover:text-[#1A241E]'
                  }`}
                >
                  Duration
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode('endtime')}
                  className={`py-2.5 text-sm font-semibold rounded-lg transition-all ${
                    inputMode === 'endtime'
                      ? 'bg-[#1F4E3B] text-white shadow-xs'
                      : 'text-[#4A5550] dark:text-[#9CA8A1] hover:text-[#1A241E]'
                  }`}
                >
                  End Time
                </button>
              </div>

              {inputMode === 'duration' ? (
                <>
                  {/* Preset Pill Buttons: 1, 3, 5, 10, 15 min */}
                  <div className="grid grid-cols-5 gap-2">
                    {PRESET_MINUTES.map((mins) => {
                      const active = durationMinutes === mins && totalMs === mins * 60 * 1000;
                      return (
                        <button
                          key={mins}
                          type="button"
                          onClick={() => applyDurationMinutes(mins)}
                          className={`py-2 px-1 rounded-lg text-xs sm:text-sm font-semibold border transition-all ${
                            active
                              ? 'bg-[#1F4E3B] text-white border-[#1F4E3B]'
                              : 'bg-[#F8F7F4] dark:bg-[#222925] text-[#2C3631] dark:text-gray-200 border-[#E5E0D8] dark:border-[#2E3832] hover:border-[#1F4E3B]/40'
                          }`}
                        >
                          {mins} min
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Minutes Stepper Input */}
                  <div className="flex items-center gap-3 pt-1">
                    <div className="relative flex items-center w-28 bg-[#F8F7F4] dark:bg-[#222925] border border-[#E2DDD5] dark:border-[#2E3832] rounded-xl px-3 py-2">
                      <input
                        ref={customInputRef}
                        type="number"
                        min={1}
                        max={999}
                        value={durationMinutes}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          if (!isNaN(val)) {
                            applyDurationMinutes(val);
                          } else {
                            setDurationMinutes(1);
                          }
                        }}
                        className="w-full bg-transparent text-base font-semibold text-[#1A241E] dark:text-white focus:outline-none appearance-none"
                        aria-label="Duration in minutes"
                      />
                      <div className="flex flex-col -my-1 ml-1">
                        <button
                          type="button"
                          onClick={() => applyDurationMinutes(durationMinutes + 1)}
                          className="text-gray-500 hover:text-gray-800 dark:hover:text-white p-0.5"
                          aria-label="Increase minutes"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => applyDurationMinutes(Math.max(1, durationMinutes - 1))}
                          className="text-gray-500 hover:text-gray-800 dark:hover:text-white p-0.5"
                          aria-label="Decrease minutes"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-[#4A5550] dark:text-[#9CA8A1]">
                      minutes
                    </span>
                  </div>
                </>
              ) : (
                <div className="space-y-2 pt-1">
                  <label className="block text-xs font-medium text-[#526058] dark:text-gray-400">
                    Count down until clock reaches:
                  </label>
                  <input
                    type="time"
                    value={endTimeStr}
                    onChange={(e) => applyEndTime(e.target.value)}
                    className="w-full rounded-xl border border-[#E2DDD5] dark:border-[#2E3832] bg-[#F8F7F4] dark:bg-[#222925] px-3.5 py-2.5 text-base font-semibold text-[#1A241E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1F4E3B]"
                  />
                </div>
              )}

              {/* Primary Start Button */}
              <button
                type="button"
                onClick={isRunning ? handlePause : handleStart}
                className="w-full py-3.5 px-6 rounded-xl bg-[#1F4E3B] hover:bg-[#183E2F] text-white font-semibold text-base shadow-xs flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
              >
                {isRunning ? (
                  <>
                    <Pause className="w-5 h-5 fill-current" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" />
                    {remainingMs < totalMs && remainingMs > 0 ? 'Resume' : 'Start'}
                  </>
                )}
              </button>

              {/* Secondary Pause + Reset Row */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={isRunning ? handlePause : handleStart}
                  className="py-2.5 px-4 rounded-xl bg-[#EFECE6] dark:bg-[#222925] hover:bg-[#E5E0D8] dark:hover:bg-[#2B332E] text-[#1A241E] dark:text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Pause className="w-4 h-4" />
                  Pause
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="py-2.5 px-4 rounded-xl bg-[#EFECE6] dark:bg-[#222925] hover:bg-[#E5E0D8] dark:hover:bg-[#2B332E] text-[#1A241E] dark:text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
              </div>
            </div>

            {/* Bottom Utility Toggles: Sound Alert | Fullscreen | Show Time */}
            <div className="pt-3 border-t border-[#EFECE6] dark:border-[#262E29] flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-[#4A5550] dark:text-[#9CA8A1]">
              {/* Sound Alert */}
              <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
                <Bell className="w-3.5 h-3.5 text-[#4A5550] dark:text-gray-400" />
                <span>Sound Alert</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={soundEnabled}
                  onClick={() => setSoundEnabled((prev) => !prev)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    soundEnabled ? 'bg-[#1F4E3B]' : 'bg-gray-300 dark:bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                      soundEnabled ? 'translate-x-4.5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </label>

              {/* Fullscreen */}
              <button
                type="button"
                onClick={toggleFullscreen}
                className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-[#F4F1EA] dark:hover:bg-[#222925] transition-colors cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Fullscreen</span>
              </button>

              {/* Show Time */}
              <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
                <Eye className="w-3.5 h-3.5 text-[#4A5550] dark:text-gray-400" />
                <span>Show Time</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={showTime}
                  onClick={() => setShowTime((prev) => !prev)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    showTime ? 'bg-[#1F4E3B]' : 'bg-gray-300 dark:bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                      showTime ? 'translate-x-4.5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </label>
            </div>
          </div>

          {/* RIGHT COLUMN: RING STYLE & RING COLORS (3 cols) */}
          <div className="lg:col-span-3 flex flex-col justify-between rounded-2xl bg-[#FAF9F6] dark:bg-[#1C221F] border border-[#ECE8E0] dark:border-[#28312C] p-4 space-y-4">
            {/* Ring Style (2x2 Grid) */}
            <div>
              <h3 className="text-xs font-bold text-[#1A241E] dark:text-white mb-2.5">
                Ring Style
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
                {(
                  [
                    { id: 'classic', label: 'Classic Rings' },
                    { id: 'gradient', label: 'Gradient Rings' },
                    { id: 'minimal', label: 'Minimal Rings' },
                    { id: 'dashed', label: 'Dashed Rings' },
                  ] as { id: RingStyle; label: string }[]
                ).map((item) => {
                  const selected = ringStyle === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setRingStyle(item.id)}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        selected
                          ? 'bg-[#EEF6F1] dark:bg-[#1F352B] border-[#1E7A4C] ring-1 ring-[#1E7A4C]'
                          : 'bg-white dark:bg-[#222925] border-[#E5E0D8] dark:border-[#2E3832] hover:border-[#1E7A4C]/50'
                      }`}
                    >
                      {renderStyleMiniPreview(item.id)}
                      <span className="mt-1.5 text-xs font-semibold text-[#1A241E] dark:text-gray-200">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ring Colors (Outer Ring, Middle Ring, Inner Ring Dropdowns matching mockup) */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#1A241E] dark:text-white">
                Ring Colors
              </h4>

              {(
                [
                  {
                    key: 'outer' as const,
                    label: 'Outer Ring',
                    value: outerColorId,
                    setter: setOuterColorId,
                    colorObj: outerColorObj,
                  },
                  {
                    key: 'middle' as const,
                    label: 'Middle Ring',
                    value: middleColorId,
                    setter: setMiddleColorId,
                    colorObj: middleColorObj,
                  },
                  {
                    key: 'inner' as const,
                    label: 'Inner Ring',
                    value: innerColorId,
                    setter: setInnerColorId,
                    colorObj: innerColorObj,
                  },
                ]
              ).map((ringItem) => {
                const isOpen = openColorMenu === ringItem.key;
                return (
                  <div key={ringItem.key} className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenColorMenu(isOpen ? null : ringItem.key)
                      }
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white dark:bg-[#222925] border border-[#E5E0D8] dark:border-[#2E3832] hover:border-[#1E7A4C]/50 text-xs font-medium text-[#1A241E] dark:text-gray-200 transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2.5">
                        <span
                          className="w-4 h-4 rounded-full shrink-0 shadow-2xs"
                          style={{ backgroundColor: ringItem.colorObj.hex }}
                        />
                        <span>{ringItem.label}</span>
                      </span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-gray-400 transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="absolute left-0 right-0 mt-1 p-1.5 rounded-xl bg-white dark:bg-[#1E2521] border border-[#E5E0D8] dark:border-[#2E3832] shadow-lg z-20 grid grid-cols-2 gap-1">
                        {RING_COLOR_OPTIONS.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => {
                              ringItem.setter(opt.id);
                              setOpenColorMenu(null);
                            }}
                            className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-[11px] font-medium text-left transition-colors cursor-pointer ${
                              ringItem.value === opt.id
                                ? 'bg-[#EEF6F1] dark:bg-[#26392F] text-[#1F4E3B] dark:text-white font-semibold'
                                : 'text-[#252B27] dark:text-gray-300 hover:bg-[#F7F6F2] dark:hover:bg-[#252E28]'
                            }`}
                          >
                            <span
                              className="w-3 h-3 rounded-full shrink-0"
                              style={{ backgroundColor: opt.hex }}
                            />
                            <span className="truncate">{opt.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* QUICK PRESETS SECTION */}
      <section aria-labelledby="quick-presets-heading" className="space-y-3">
        <div>
          <h2
            id="quick-presets-heading"
            className="text-xl font-bold font-serif text-[#1A241E] dark:text-white"
          >
            Quick Presets
          </h2>
          <p className="text-sm text-[#526058] dark:text-gray-400">
            Start with a common time or set a custom duration.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {QUICK_PRESETS.map((item) => {
            const isSelected =
              !item.isCustom &&
              durationMinutes === item.mins &&
              totalMs === item.mins * 60 * 1000;
            return (
              <button
                key={item.title}
                type="button"
                onClick={() => {
                  if (item.isCustom) {
                    setInputMode('duration');
                    customInputRef.current?.focus();
                    customInputRef.current?.select();
                  } else {
                    setInputMode('duration');
                    applyDurationMinutes(item.mins);
                  }
                }}
                className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#EEF6F1] dark:bg-[#1F352B] border-[#1E7A4C] shadow-2xs'
                    : 'bg-white dark:bg-[#171C19] border-[#E5E0D8] dark:border-[#2A302C] hover:border-[#1E7A4C]/50'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                    item.isCustom
                      ? 'bg-[#EAF3EE] text-[#1F4E3B] dark:bg-[#25352C] dark:text-[#6EE7B7]'
                      : 'bg-[#FFF3E6] text-[#D97706] dark:bg-[#2F261B] dark:text-[#FBBF24]'
                  }`}
                >
                  {item.isCustom ? (
                    <Settings className="w-4 h-4" />
                  ) : (
                    <Clock className="w-4 h-4" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-[#1A241E] dark:text-white truncate">
                    {item.title}
                  </div>
                  <div
                    className={`text-xs truncate ${
                      isSelected
                        ? 'text-[#1E7A4C] dark:text-[#6EE7B7] font-medium'
                        : 'text-[#526058] dark:text-gray-400'
                    }`}
                  >
                    {item.sub}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* POPULAR USES SECTION */}
      <section
        aria-labelledby="popular-uses-heading"
        className="rounded-2xl bg-[#EEF3EE] dark:bg-[#19211C] border border-[#DCE5DD] dark:border-[#26322B] p-5 sm:p-6 space-y-4"
      >
        <div>
          <h2
            id="popular-uses-heading"
            className="text-xl font-bold font-serif text-[#1A241E] dark:text-white"
          >
            Popular Uses
          </h2>
          <p className="text-sm text-[#526058] dark:text-gray-400">
            A rings timer is useful for many everyday situations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {POPULAR_USES.map((use) => {
            const IconComponent = use.icon;
            return (
              <div
                key={use.title}
                className="bg-white dark:bg-[#1F2723] rounded-xl p-4 border border-[#E4EAE4] dark:border-[#2C3831] flex items-start gap-3 shadow-2xs"
              >
                <div className="w-10 h-10 rounded-xl bg-[#EAF3EE] dark:bg-[#26382E] text-[#1F4E3B] dark:text-[#6EE7B7] flex items-center justify-center shrink-0">
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1A241E] dark:text-white">
                    {use.title}
                  </h3>
                  <p className="text-xs text-[#526058] dark:text-gray-400 mt-0.5 leading-relaxed">
                    {use.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

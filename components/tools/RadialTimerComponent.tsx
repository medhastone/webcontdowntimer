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
  GraduationCap,
  Users,
  Presentation,
  Coffee,
  CalendarCheck,
  ChevronUp,
  ChevronDown,
  ArrowRight,
} from 'lucide-react';
import { playTimerSound } from '@/lib/sound';
import { requestWakeLock, releaseWakeLock } from '@/lib/wakelock';

type RadialStyle = 'sunburst' | 'dots' | 'blocks' | 'gradient-rays';
type ColorThemeId = 'forest' | 'ocean' | 'coral' | 'amber' | 'purple' | 'rainbow';
type InputMode = 'duration' | 'endtime';

interface ColorThemeOption {
  id: ColorThemeId;
  label: string;
  hex: string;
  isRainbow?: boolean;
}

const COLOR_THEMES: ColorThemeOption[] = [
  { id: 'forest', label: 'Forest Green', hex: '#1E7A4C' },
  { id: 'ocean', label: 'Ocean Blue', hex: '#0EA5E9' },
  { id: 'coral', label: 'Coral Red', hex: '#EF4444' },
  { id: 'amber', label: 'Amber Orange', hex: '#F59E0B' },
  { id: 'purple', label: 'Royal Purple', hex: '#8B5CF6' },
  { id: 'rainbow', label: 'Rainbow Gradient', hex: '#EC4899', isRainbow: true },
];

const RAINBOW_SPECTRUM = [
  '#EF4444', // red
  '#F97316', // orange
  '#F59E0B', // amber
  '#EAB308', // yellow
  '#22C55E', // green
  '#10B981', // emerald
  '#06B6D4', // cyan
  '#3B82F6', // blue
  '#6366F1', // indigo
  '#8B5CF6', // violet
  '#D946EF', // fuchsia
  '#EC4899', // pink
];

function getSpectrumColor(index: number, total: number): string {
  const ratio = (index % total) / total;
  const scaled = ratio * RAINBOW_SPECTRUM.length;
  const idx = Math.floor(scaled) % RAINBOW_SPECTRUM.length;
  return RAINBOW_SPECTRUM[idx];
}

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
    title: 'Study and Focus',
    desc: 'Stay on track and build good habits.',
    icon: GraduationCap,
  },
  {
    title: 'Group Activities',
    desc: 'Manage time for discussions and games.',
    icon: Users,
  },
  {
    title: 'Presentations',
    desc: 'Keep sessions clear and engaging.',
    icon: Presentation,
  },
  {
    title: 'Short Breaks',
    desc: 'Take regular breaks for better productivity.',
    icon: Coffee,
  },
  {
    title: 'Daily Routines',
    desc: 'Time your daily activities with ease.',
    icon: CalendarCheck,
  },
];

function polarToCartesian(cx: number, cy: number, r: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(angleInRadians),
    y: cy + r * Math.sin(angleInRadians),
  };
}

function describeWedgeBlock(
  cx: number,
  cy: number,
  innerR: number,
  outerR: number,
  startAngle: number,
  endAngle: number
): string {
  const outerStart = polarToCartesian(cx, cy, outerR, startAngle);
  const outerEnd = polarToCartesian(cx, cy, outerR, endAngle);
  const innerEnd = polarToCartesian(cx, cy, innerR, endAngle);
  const innerStart = polarToCartesian(cx, cy, innerR, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return [
    'M',
    outerStart.x.toFixed(2),
    outerStart.y.toFixed(2),
    'A',
    outerR,
    outerR,
    0,
    largeArcFlag,
    1,
    outerEnd.x.toFixed(2),
    outerEnd.y.toFixed(2),
    'L',
    innerEnd.x.toFixed(2),
    innerEnd.y.toFixed(2),
    'A',
    innerR,
    innerR,
    0,
    largeArcFlag,
    0,
    innerStart.x.toFixed(2),
    innerStart.y.toFixed(2),
    'Z',
  ].join(' ');
}

export default function RadialTimerComponent() {
  const [inputMode, setInputMode] = useState<InputMode>('duration');
  const [durationMinutes, setDurationMinutes] = useState<number>(5);
  const [endTimeStr, setEndTimeStr] = useState<string>('12:30');
  const [totalMs, setTotalMs] = useState<number>(5 * 60 * 1000);
  const [remainingMs, setRemainingMs] = useState<number>(5 * 60 * 1000);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Appearance & Settings
  const [radialStyle, setRadialStyle] = useState<RadialStyle>('sunburst');
  const [colorTheme, setColorTheme] = useState<ColorThemeId>('forest');
  const [segmentCount, setSegmentCount] = useState<number>(24);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showTime, setShowTime] = useState<boolean>(true);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const customInputRef = useRef<HTMLInputElement>(null);
  const endTimestampRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  // Apply preset or custom minutes
  const applyDurationMinutes = useCallback((mins: number) => {
    const safeMins = Math.max(1, Math.min(999, Math.round(mins || 1)));
    setDurationMinutes(safeMins);
    const ms = safeMins * 60 * 1000;
    setTotalMs(ms);
    setRemainingMs(ms);
    setIsRunning(false);
    setIsCompleted(false);
    endTimestampRef.current = null;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  // Calculate duration from End Time input
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
    setDurationMinutes(Math.max(1, Math.round(diffMs / 60000)));
    setIsRunning(false);
    setIsCompleted(false);
    endTimestampRef.current = null;
  }, []);

  // Animation loop
  useEffect(() => {
    if (!isRunning) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      releaseWakeLock();
      return;
    }

    requestWakeLock();
    endTimestampRef.current = performance.now() + remainingMs;

    const tick = (now: number) => {
      if (!endTimestampRef.current) return;
      const left = Math.max(0, endTimestampRef.current - now);
      setRemainingMs(left);

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
      setIsCompleted(false);
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsCompleted(false);
    setRemainingMs(totalMs);
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

  // Fraction remaining (1.0 -> 0.0)
  const rawFraction = totalMs > 0 ? Math.max(0, Math.min(1, remainingMs / totalMs)) : 0;
  // When at initial state (not started yet and remainingMs === totalMs), show recognizable preview if user hasn't started, or full fraction?
  // Wait: in the mockup, at 05:00 before pressing Start, about 18 of 24 segments (75%) are green and 6 segments on the top-left are light gray so the user immediately sees how the radial countdown looks!
  // And once running or if remainingMs < totalMs, it strictly shows the exact mathematical fraction!
  // Wait: Prompt says "The radial progress is immediately understandable. The display clearly represents the remaining fraction."
  // Let's make sure when running or paused mid-run, it shows exact `rawFraction`, and when at 100% idle before starting, Wait: if someone sets 5 minutes, should all segments be lit or should it show exact remaining fraction?
  // Let's check the prompt:
  // "As the countdown progresses: Individual segments change or fade according to elapsed time. The radial progress is immediately understandable. The display clearly represents the remaining fraction."
  // Let's check how CircularTimerComponent handled it or how radial segments work:
  // If we use exact `rawFraction` during countdown, what about initial idle state? If all 24 segments are colored at 100%, it's 100% remaining. Wait—why did the mockup image show 75% at 05:00? Because static design mockups illustrate an active/in-progress state so you can see the track vs active segments! However, to make the initial state both visually clear like the mockup AND mathematically accurate, let's check: in CircularTimerComponent we rendered 100% when full, or we can show subtle inner/outer tick marks and have elapsed segments turn `#DFE3E0`. Even better: when `remainingMs === totalMs` and `!isRunning`, if all segments are active, what if someone wants to see the radial contrast immediately? Wait: if all 24 segments are active at 100%, you still clearly see 24 distinct radial spokes/dots/blocks with gaps between them! And as soon as 1 millisecond elapses after clicking Start, segments smoothly drain clockwise from the top (12 o'clock) just like the mockup (where the top-left segments have turned `#DFE3E0` and the clockwise remaining segments from 12 o'clock through 9 o'clock are green)!
  // Wait: notice in the mockup `/public/assets/aistudio/Modern_Radial_Timer_Tool_Interface_cab1c885.png`:
  // The green segments start at 12 o'clock (top) and go clockwise down to ~8:30, while the gray segments are from ~8:30 to 12 o'clock!
  // That means as time elapses, segments turn gray starting from the counter-clockwise end (i.e. remaining segments stay anchored at 12 o'clock going clockwise, shrinking counter-clockwise toward 12 o'clock, OR elapsed segments grow counter-clockwise from 12 o'clock).
  // Specifically, if index `0` is at 12 o'clock (`0°`) and index increases clockwise (`0` to `segmentCount - 1`), then in the mockup indices `0` through `Math.floor(segmentCount * 0.75) - 1` are GREEN (active remaining), and the last indices (`75%` to `100%`, on the upper-left quadrant) are GRAY (`#DFE3E0`)!
  // That means segment `i` (where `0 <= i < segmentCount` clockwise from 12 o'clock) is active when `i < remainingSegments`!
  // Let's verify that!
  // If `i = 0` is at 12 o'clock, `i = 6` is at 3 o'clock, `i = 12` is at 6 o'clock, `i = 18` is at 9 o'clock:
  // When 75% of time remains (`remainingSegments = 18` out of `24`), segments `0..17` (from 12 o'clock clockwise around the right, bottom, and lower-left up to 9 o'clock) are GREEN, and segments `18..23` (from 9 o'clock up to 12 o'clock, the upper-left quadrant) are GRAY!
  // That matches the mockup 100% identically AND is 100% mathematically synchronized with `remainingMs / totalMs`!

  const activeThemeObj = COLOR_THEMES.find((t) => t.id === colorTheme) || COLOR_THEMES[0];

  const getSegmentColor = (index: number, count: number): string => {
    if (colorTheme === 'rainbow' || radialStyle === 'gradient-rays') {
      return getSpectrumColor(index, count);
    }
    return activeThemeObj.hex;
  };

  // Exact number of remaining segments (float)
  const exactActiveSegments = rawFraction * segmentCount;

  // Render the main SVG radial visualization
  const renderRadialSvg = (size: number = 340) => {
    const cx = size / 2;
    const cy = size / 2;
    const stepAngle = 360 / segmentCount;

    return (
      <svg
        viewBox={`0 0 ${size} ${size}`}
        shapeRendering="geometricPrecision"
        className={`w-full h-full ${isFullscreen ? 'max-w-[540px] max-h-[78dvh]' : 'max-w-[330px] max-h-[330px]'} select-none`}
        aria-label={`Radial timer showing ${formattedTime} remaining`}
      >
        {Array.from({ length: segmentCount }).map((_, idx) => {
          const angle = idx * stepAngle;
          // Determine how "active" this segment is (1 = fully remaining, 0 = fully elapsed, 0..1 = currently draining segment)
          const segProgress = Math.max(0, Math.min(1, exactActiveSegments - idx));
          const isActive = reducedMotion ? idx < Math.ceil(exactActiveSegments) : segProgress > 0.02;
          const activeColor = getSegmentColor(idx, segmentCount);
          const trackColor = '#DFE3E0';

          // For smooth non-flashing transition on the active boundary segment
          const opacity = reducedMotion
            ? 1
            : isActive && segProgress < 1
              ? 0.25 + segProgress * 0.75
              : 1;

          if (radialStyle === 'sunburst' || radialStyle === 'gradient-rays') {
            // Elongated rounded radial spoke radiating outward from innerR to outerR
            const innerR = size * 0.285;
            const outerR = size * 0.455;
            const spokeLength = outerR - innerR;
            // Thickness scales gently with segmentCount so 60 spokes don't overlap
            const spokeWidth = Math.max(4, Math.min(12, (2 * Math.PI * innerR) / (segmentCount * 1.85)));

            return (
              <g
                key={idx}
                transform={`rotate(${angle} ${cx} ${cy})`}
              >
                {/* Base gray track spoke */}
                <rect
                  x={cx - spokeWidth / 2}
                  y={cy - outerR}
                  width={spokeWidth}
                  height={spokeLength}
                  rx={spokeWidth / 2}
                  fill={trackColor}
                />
                {/* Active colored spoke overlay */}
                {isActive && (
                  <rect
                    x={cx - spokeWidth / 2}
                    y={cy - outerR}
                    width={spokeWidth}
                    height={spokeLength}
                    rx={spokeWidth / 2}
                    fill={activeColor}
                    opacity={opacity}
                  />
                )}
              </g>
            );
          }

          if (radialStyle === 'dots') {
            // Circular dots arranged around a ring
            const ringR = size * 0.375;
            const pos = polarToCartesian(cx, cy, ringR, angle);
            const dotR = Math.max(3.5, Math.min(9.5, (2 * Math.PI * ringR) / (segmentCount * 2.5)));

            return (
              <g key={idx}>
                <circle cx={pos.x} cy={pos.y} r={dotR} fill={trackColor} />
                {isActive && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={dotR}
                    fill={activeColor}
                    opacity={opacity}
                  />
                )}
              </g>
            );
          }

          // 'blocks' — wedge/arc block segments arranged around the ring
          const innerR = size * 0.315;
          const outerR = size * 0.435;
          const gapDegrees = Math.min(stepAngle * 0.32, 4.2);
          const startAngle = angle - (stepAngle - gapDegrees) / 2;
          const endAngle = angle + (stepAngle - gapDegrees) / 2;
          const d = describeWedgeBlock(cx, cy, innerR, outerR, startAngle, endAngle);

          return (
            <g key={idx}>
              <path d={d} fill={trackColor} />
              {isActive && <path d={d} fill={activeColor} opacity={opacity} />}
            </g>
          );
        })}
      </svg>
    );
  };

  // Render mini SVG icons for the 2x2 "Choose a Radial Style" selector
  const renderStyleMiniPreview = (style: RadialStyle) => {
    const count = 16;
    const size = 56;
    const cx = 28;
    const cy = 28;
    const step = 360 / count;
    const activeCount = 12; // 75% lit preview matching mockup

    return (
      <svg viewBox="0 0 56 56" className="w-12 h-12 mx-auto">
        {Array.from({ length: count }).map((_, i) => {
          const angle = i * step;
          const active = i < activeCount;
          const fill = !active
            ? '#CBD5E1'
            : style === 'gradient-rays'
              ? getSpectrumColor(i, count)
              : '#1E7A4C';

          if (style === 'sunburst' || style === 'gradient-rays') {
            return (
              <g key={i} transform={`rotate(${angle} ${cx} ${cy})`}>
                <rect
                  x={cx - 1.4}
                  y={cy - 24}
                  width={2.8}
                  height={9.5}
                  rx={1.4}
                  fill={fill}
                />
              </g>
            );
          }

          if (style === 'dots') {
            const p = polarToCartesian(cx, cy, 19.5, angle);
            return <circle key={i} cx={p.x} cy={p.y} r={2.3} fill={fill} />;
          }

          // blocks
          const gap = 5.5;
          const d = describeWedgeBlock(
            cx,
            cy,
            15.5,
            23,
            angle - (step - gap) / 2,
            angle + (step - gap) / 2
          );
          return <path key={i} d={d} fill={fill} />;
        })}
      </svg>
    );
  };

  return (
    <div className="space-y-8">
      {/* MAIN 3-COLUMN INTERACTIVE TOOL CARD */}
      <div className="bg-white dark:bg-[#171C19] rounded-2xl border border-[#E5E0D8] dark:border-[#2A302C] shadow-sm p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch w-full">
          {/* LEFT COLUMN: RADIAL VISUAL STAGE (5 cols) */}
          <div className="lg:col-span-5 flex flex-col">
            <div
              ref={stageRef}
              className={`relative flex-1 min-h-[340px] sm:min-h-[380px] rounded-2xl bg-[#F4F4F2] dark:bg-[#1E2521] flex items-center justify-center p-6 overflow-hidden ${
                isFullscreen ? 'timer-fullscreen-stage p-8' : ''
              }`}
            >
              {renderRadialSvg(340)}

              {/* Center Numeric Time Readout */}
              {(showTime || isFullscreen) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className={`font-mono ${isFullscreen ? 'text-5xl sm:text-7xl' : 'text-4xl sm:text-[44px]'} font-bold tracking-tight text-[#1A241E] dark:text-white leading-none tabular-nums`}>
                    {formattedTime}
                  </span>
                  {!isFullscreen && (
                    <span className="mt-2 text-xs sm:text-sm font-medium text-[#526058] dark:text-[#9BA8A0]">
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

          {/* RIGHT COLUMN: RADIAL STYLE, COLOR THEME & SEGMENT COUNT (3 cols) */}
          <div className="lg:col-span-3 flex flex-col justify-between rounded-2xl bg-[#FAF9F6] dark:bg-[#1C221F] border border-[#ECE8E0] dark:border-[#28312C] p-4 space-y-4">
            {/* Choose a Radial Style (2x2 Grid) */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1A241E] dark:text-white mb-2.5">
                Choose a Radial Style
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
                {(
                  [
                    { id: 'sunburst', label: 'Sunburst' },
                    { id: 'dots', label: 'Dots' },
                    { id: 'blocks', label: 'Blocks' },
                    { id: 'gradient-rays', label: 'Gradient Rays' },
                  ] as { id: RadialStyle; label: string }[]
                ).map((item) => {
                  const selected = radialStyle === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setRadialStyle(item.id)}
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

            {/* Color Theme Swatches */}
            <div>
              <h4 className="text-xs font-bold text-[#1A241E] dark:text-white mb-2">
                Color Theme
              </h4>
              <div className="flex items-center justify-between gap-1.5">
                {COLOR_THEMES.map((theme) => {
                  const selected = colorTheme === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setColorTheme(theme.id)}
                      title={theme.label}
                      aria-label={theme.label}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform cursor-pointer ${
                        selected
                          ? 'ring-2 ring-offset-2 ring-[#1F4E3B] scale-105'
                          : 'hover:scale-105'
                      }`}
                      style={{
                        background: theme.isRainbow
                          ? 'conic-gradient(#EF4444, #F59E0B, #22C55E, #06B6D4, #6366F1, #EC4899, #EF4444)'
                          : theme.hex,
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Segment Count Slider */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="radial-segment-slider"
                  className="text-xs font-bold text-[#1A241E] dark:text-white"
                >
                  Segment Count
                </label>
                <span className="text-xs font-bold text-[#1A241E] dark:text-gray-200">
                  {segmentCount}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="radial-segment-slider"
                  type="range"
                  min={12}
                  max={60}
                  step={2}
                  value={segmentCount}
                  onChange={(e) => setSegmentCount(parseInt(e.target.value, 10))}
                  className="w-full accent-[#1F4E3B] cursor-pointer h-1.5 bg-[#E2DDD5] dark:bg-gray-700 rounded-lg"
                />
                <ArrowRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-[#526058] dark:text-gray-400">
                <span>Reduced Motion</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={reducedMotion}
                  onClick={() => setReducedMotion((prev) => !prev)}
                  className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors ${
                    reducedMotion ? 'bg-[#1F4E3B]' : 'bg-gray-300 dark:bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      reducedMotion ? 'translate-x-3.5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
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
            A radial timer is useful for many everyday situations.
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

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Eye,
  EyeOff,
  Clock,
  Settings,
  GraduationCap,
  BookOpen,
  Users,
  Coffee,
  Calendar,
  ChevronUp,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { playTimerSound } from '@/lib/sound';
import { requestWakeLock, releaseWakeLock } from '@/lib/wakelock';

type TimerMode = 'duration' | 'endTime';
type CountdownDirection = 'clockwise' | 'counterclockwise';
type CircleVisualStyle = 'ring' | 'pie';
type BackgroundStyleId = 'white' | 'soft-gray' | 'dark-charcoal' | 'soft-gradient';
type LowTimeWarningOption = 'red-10s' | 'red-30s' | 'amber-60s' | 'amber-20pct';

interface CircleColorOption {
  id: string;
  label: string;
  hex: string;
}

const CIRCLE_COLORS: CircleColorOption[] = [
  { id: 'forest-green', label: 'Forest Green', hex: '#1E7A4C' },
  { id: 'ocean-blue', label: 'Ocean Blue', hex: '#0EA5E9' },
  { id: 'coral-red', label: 'Coral Red', hex: '#EF4444' },
  { id: 'amber-orange', label: 'Amber Orange', hex: '#F59E0B' },
  { id: 'royal-purple', label: 'Royal Purple', hex: '#8B5CF6' },
  { id: 'rose-pink', label: 'Rose Pink', hex: '#EC4899' },
];

interface BackgroundOption {
  id: BackgroundStyleId;
  label: string;
  previewClass: string;
  containerClass: string;
  trackColor: string;
  textColorClass: string;
  subTextColorClass: string;
}

const BACKGROUND_STYLES: BackgroundOption[] = [
  {
    id: 'white',
    label: 'Pure White',
    previewClass: 'bg-white border-[#D6DBD7]',
    containerClass: 'bg-white dark:bg-[#1A211D] border border-[#E6EAE7] dark:border-[#2B352F]',
    trackColor: '#E5E8E6',
    textColorClass: 'text-[#18221D] dark:text-white',
    subTextColorClass: 'text-[#4B5851] dark:text-slate-400',
  },
  {
    id: 'soft-gray',
    label: 'Soft Gray',
    previewClass: 'bg-[#EBEEEC] border-[#D0D6D2]',
    containerClass: 'bg-[#F5F6F5] dark:bg-[#161C19] border border-[#E6EAE7] dark:border-[#29322C]',
    trackColor: '#E2E6E4',
    textColorClass: 'text-[#18221D] dark:text-white',
    subTextColorClass: 'text-[#4B5851] dark:text-slate-400',
  },
  {
    id: 'dark-charcoal',
    label: 'Dark Charcoal',
    previewClass: 'bg-[#141A21] border-[#141A21]',
    containerClass: 'bg-[#141A21] border border-[#252F3B]',
    trackColor: '#2A3441',
    textColorClass: 'text-white',
    subTextColorClass: 'text-slate-300',
  },
  {
    id: 'soft-gradient',
    label: 'Soft Gradient',
    previewClass: 'bg-gradient-to-br from-[#F3E7E2] via-[#E8EDF2] to-[#DCE5EE] border-[#D2DAE2]',
    containerClass:
      'bg-gradient-to-br from-[#F7F3EE] via-[#EEF3F6] to-[#E3ECF2] dark:from-[#1B2228] dark:via-[#182026] dark:to-[#141B20] border border-[#E2E8EE] dark:border-[#2B353E]',
    trackColor: '#DCE2E8',
    textColorClass: 'text-[#18221D] dark:text-white',
    subTextColorClass: 'text-[#4B5851] dark:text-slate-300',
  },
];

const WARNING_OPTIONS: {
  id: LowTimeWarningOption;
  label: string;
  dotColor: string;
  warningHex: string;
}[] = [
  {
    id: 'red-10s',
    label: 'Red (last 10 seconds)',
    dotColor: '#EF4444',
    warningHex: '#EF4444',
  },
  {
    id: 'red-30s',
    label: 'Red (last 30 seconds)',
    dotColor: '#EF4444',
    warningHex: '#EF4444',
  },
  {
    id: 'amber-60s',
    label: 'Amber (last 60 seconds)',
    dotColor: '#F59E0B',
    warningHex: '#F59E0B',
  },
  {
    id: 'amber-20pct',
    label: 'Amber (last 20% of time)',
    dotColor: '#F59E0B',
    warningHex: '#F59E0B',
  },
];

const PRESET_MINUTES = [1, 3, 5, 10, 15];

function polarToCartesian(cx: number, cy: number, r: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(angleInRadians),
    y: cy + r * Math.sin(angleInRadians),
  };
}

/**
 * Builds an SVG pie-sector path starting at 12 o'clock (0 deg) and sweeping
 * either clockwise or counterclockwise by `fraction * 360` degrees.
 */
function buildPieSectorPath(
  cx: number,
  cy: number,
  r: number,
  fraction: number,
  direction: CountdownDirection
): string {
  const clamped = Math.max(0, Math.min(1, fraction));
  if (clamped <= 0.0001) return '';
  if (clamped >= 0.9999) {
    return `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.01} ${cy - r} Z`;
  }

  const sweepAngle = clamped * 360;
  if (direction === 'clockwise') {
    // Remaining sector runs from (360 - sweepAngle) clockwise to 360 (12 o'clock),
    // so as time elapses, the sector shrinks clockwise from 12 o'clock toward zero!
    const startAngle = 360 - sweepAngle;
    const start = polarToCartesian(cx, cy, r, startAngle);
    const end = polarToCartesian(cx, cy, r, 360);
    const largeArcFlag = sweepAngle > 180 ? 1 : 0;
    return [
      `M ${cx} ${cy}`,
      `L ${start.x.toFixed(3)} ${start.y.toFixed(3)}`,
      `A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x.toFixed(3)} ${end.y.toFixed(3)}`,
      'Z',
    ].join(' ');
  } else {
    // Counterclockwise: remaining sector runs from 0 (12 o'clock) clockwise to sweepAngle,
    // so the trailing edge shrinks counterclockwise toward 12 o'clock.
    const start = polarToCartesian(cx, cy, r, 0);
    const end = polarToCartesian(cx, cy, r, sweepAngle);
    const largeArcFlag = sweepAngle > 180 ? 1 : 0;
    return [
      `M ${cx} ${cy}`,
      `L ${start.x.toFixed(3)} ${start.y.toFixed(3)}`,
      `A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x.toFixed(3)} ${end.y.toFixed(3)}`,
      'Z',
    ].join(' ');
  }
}

/**
 * Builds an SVG ring-sector arc path (open path with strokeWidth) that shrinks
 * smoothly clockwise or counterclockwise from 12 o'clock toward zero.
 */
function buildRingArcPath(
  cx: number,
  cy: number,
  r: number,
  fraction: number,
  direction: CountdownDirection
): string {
  const clamped = Math.max(0, Math.min(1, fraction));
  if (clamped <= 0.0001) return '';
  if (clamped >= 0.9999) {
    return `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.01} ${cy - r}`;
  }

  const sweepAngle = clamped * 360;
  if (direction === 'clockwise') {
    // Starts at 12 o'clock and sweeps clockwise; as countdown runs, the gap grows from 9 o'clock/12 o'clock
    // Matches the mockup where at ~75% remaining the green ring starts at 12 o'clock and goes clockwise to ~9 o'clock!
    const start = polarToCartesian(cx, cy, r, 0);
    const end = polarToCartesian(cx, cy, r, sweepAngle);
    const largeArcFlag = sweepAngle > 180 ? 1 : 0;
    return `M ${start.x.toFixed(3)} ${start.y.toFixed(3)} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x.toFixed(3)} ${end.y.toFixed(3)}`;
  } else {
    const startAngle = 360 - sweepAngle;
    const start = polarToCartesian(cx, cy, r, startAngle);
    const end = polarToCartesian(cx, cy, r, 360);
    const largeArcFlag = sweepAngle > 180 ? 1 : 0;
    return `M ${start.x.toFixed(3)} ${start.y.toFixed(3)} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x.toFixed(3)} ${end.y.toFixed(3)}`;
  }
}

export default function CircularTimerComponent() {
  const [mode, setMode] = useState<TimerMode>('duration');
  const [totalDurationMs, setTotalDurationMs] = useState<number>(5 * 60 * 1000);
  const [remainingMs, setRemainingMs] = useState<number>(5 * 60 * 1000);
  const [customMinutes, setCustomMinutes] = useState<number>(5);
  const [endTimeStr, setEndTimeStr] = useState<string>(() => {
    const d = new Date(Date.now() + 5 * 60 * 1000);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  });

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Appearance & Settings
  const [selectedColorId, setSelectedColorId] = useState<string>('forest-green');
  const [bgStyleId, setBgStyleId] = useState<BackgroundStyleId>('soft-gray');
  const [direction, setDirection] = useState<CountdownDirection>('clockwise');
  const [visualStyle, setVisualStyle] = useState<CircleVisualStyle>('ring');
  const [lowTimeWarningEnabled, setLowTimeWarningEnabled] = useState<boolean>(true);
  const [lowTimeWarningOption, setLowTimeWarningOption] =
    useState<LowTimeWarningOption>('red-10s');

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showTime, setShowTime] = useState<boolean>(true);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const customInputRef = useRef<HTMLInputElement | null>(null);
  const targetTimestampRef = useRef<number | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const remainingMsRef = useRef<number>(remainingMs);

  useEffect(() => {
    remainingMsRef.current = remainingMs;
  }, [remainingMs]);

  const selectedColor =
    CIRCLE_COLORS.find((c) => c.id === selectedColorId) || CIRCLE_COLORS[0];
  const selectedBg =
    BACKGROUND_STYLES.find((b) => b.id === bgStyleId) || BACKGROUND_STYLES[1];
  const selectedWarning =
    WARNING_OPTIONS.find((w) => w.id === lowTimeWarningOption) || WARNING_OPTIONS[0];

  // Determine active circle color (handles low-time warning override)
  const isLowTimeActive = (() => {
    if (!lowTimeWarningEnabled || remainingMs <= 0 || totalDurationMs <= 0) return false;
    const remSec = remainingMs / 1000;
    if (lowTimeWarningOption === 'red-10s') return remSec <= 10;
    if (lowTimeWarningOption === 'red-30s') return remSec <= 30;
    if (lowTimeWarningOption === 'amber-60s') return remSec <= 60;
    if (lowTimeWarningOption === 'amber-20pct') {
      return remainingMs / totalDurationMs <= 0.2;
    }
    return false;
  })();

  const activeCircleHex = isLowTimeActive ? selectedWarning.warningHex : selectedColor.hex;

  // High-precision animation loop synchronized with remaining duration
  useEffect(() => {
    if (!isRunning) {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      return;
    }

    targetTimestampRef.current = performance.now() + remainingMsRef.current;
    requestWakeLock();

    const tick = (now: number) => {
      if (!targetTimestampRef.current) return;
      const diff = Math.max(0, targetTimestampRef.current - now);

      if (reducedMotion) {
        // Snap updates to whole seconds when reduced motion is active
        setRemainingMs(Math.ceil(diff / 1000) * 1000);
      } else {
        setRemainingMs(diff);
      }

      if (diff <= 0) {
        setRemainingMs(0);
        setIsRunning(false);
        setIsCompleted(true);
        releaseWakeLock();
        if (soundEnabled) {
          playTimerSound('chime');
        }
        return;
      }

      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [isRunning, reducedMotion, soundEnabled]);

  useEffect(() => {
    return () => {
      releaseWakeLock();
    };
  }, []);

  // Apply duration preset or custom minutes
  const applyDurationMinutes = useCallback((mins: number) => {
    const safeMins = Math.max(1, Math.min(999, mins));
    const ms = safeMins * 60 * 1000;
    setIsRunning(false);
    setIsCompleted(false);
    setCustomMinutes(safeMins);
    setTotalDurationMs(ms);
    setRemainingMs(ms);
  }, []);

  const handleEndTimeChange = (val: string) => {
    setEndTimeStr(val);
    const [hh, mm] = val.split(':').map(Number);
    if (Number.isNaN(hh) || Number.isNaN(mm)) return;
    const now = new Date();
    const target = new Date();
    target.setHours(hh, mm, 0, 0);
    if (target.getTime() <= now.getTime()) {
      target.setDate(target.getDate() + 1);
    }
    const diffMs = Math.max(60 * 1000, target.getTime() - now.getTime());
    setIsRunning(false);
    setIsCompleted(false);
    setTotalDurationMs(diffMs);
    setRemainingMs(diffMs);
    setCustomMinutes(Math.round(diffMs / 60000));
  };

  const handleStart = () => {
    if (remainingMs <= 0) {
      setRemainingMs(totalDurationMs);
    }
    setIsCompleted(false);
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
    releaseWakeLock();
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsCompleted(false);
    setRemainingMs(totalDurationMs);
    releaseWakeLock();
  };

  const toggleFullscreen = async (enter: boolean) => {
    try {
      if (enter) {
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
      setIsFullscreen(enter);
    }
  };

  useEffect(() => {
    const onFsChange = () => {
      if (typeof document !== 'undefined' && !document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // Format MM:SS or HH:MM:SS
  const formatTimeDisplay = (ms: number) => {
    const totalSeconds = Math.ceil(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) {
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const fractionRemaining =
    totalDurationMs > 0 ? Math.max(0, Math.min(1, remainingMs / totalDurationMs)) : 0;

  // Render SVG Circle Visual
  const renderCircularVisual = (sizeClass = 'w-full max-w-[340px] aspect-square') => {
    const cx = 160;
    const cy = 160;
    const ringRadius = 122;
    const ringStrokeWidth = 34;
    const pieRadius = 138;

    const ringPath = buildRingArcPath(
      cx,
      cy,
      ringRadius,
      fractionRemaining,
      direction
    );
    const piePath = buildPieSectorPath(
      cx,
      cy,
      pieRadius,
      fractionRemaining,
      direction
    );

    return (
      <div className={`relative flex items-center justify-center mx-auto ${sizeClass}`}>
        <svg
          viewBox="0 0 320 320"
          shapeRendering="geometricPrecision"
          className="w-full h-full select-none overflow-visible"
          role="img"
          aria-label={`Circular countdown timer with ${formatTimeDisplay(remainingMs)} remaining`}
        >
          {visualStyle === 'ring' ? (
            <>
              {/* Background Track Circle */}
              <circle
                cx={cx}
                cy={cy}
                r={ringRadius}
                fill="none"
                stroke={selectedBg.trackColor}
                strokeWidth={ringStrokeWidth}
              />
              {/* Active Remaining Ring Sector */}
              {ringPath && (
                <path
                  d={ringPath}
                  fill="none"
                  stroke={activeCircleHex}
                  strokeWidth={ringStrokeWidth}
                  strokeLinecap="butt"
                  className="transition-colors duration-300"
                />
              )}
            </>
          ) : (
            <>
              {/* Background Track Disc */}
              <circle
                cx={cx}
                cy={cy}
                r={pieRadius}
                fill={selectedBg.trackColor}
              />
              {/* Active Remaining Pie Sector */}
              {piePath && (
                <path
                  d={piePath}
                  fill={activeCircleHex}
                  className="transition-colors duration-300"
                />
              )}
              {/* Optional subtle inner badge when Show Time is enabled on Pie mode for crisp contrast */}
              {showTime && (
                <circle
                  cx={cx}
                  cy={cy}
                  r={72}
                  fill={bgStyleId === 'dark-charcoal' ? '#141A21' : '#FFFFFF'}
                  fillOpacity="0.92"
                />
              )}
            </>
          )}
        </svg>

        {/* Centered Numeric Countdown Display */}
        {showTime && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
            <div
              className={`font-sans font-bold tracking-tight tabular-nums leading-none ${
                remainingMs >= 3600 * 1000
                  ? 'text-3xl sm:text-4xl'
                  : 'text-5xl sm:text-[56px]'
              } ${selectedBg.textColorClass}`}
            >
              {formatTimeDisplay(remainingMs)}
            </div>
            <div
              className={`mt-2 text-xs sm:text-sm font-medium ${selectedBg.subTextColorClass}`}
            >
              {isCompleted ? 'Time’s Up!' : 'Time Left'}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-10">
      {/* FULLSCREEN OVERLAY */}
      {isFullscreen && (
        <div
          className={`timer-fullscreen-stage p-6 sm:p-10 select-none ${selectedBg.containerClass}`}
        >
          <button
            type="button"
            onClick={() => toggleFullscreen(false)}
            className="fixed top-4 right-4 z-50 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/55 hover:bg-black/75 backdrop-blur-md border border-white/20 text-white text-xs font-bold shadow-lg transition-colors cursor-pointer"
            aria-label="Exit Fullscreen"
          >
            <Minimize2 className="w-4 h-4" />
            <span>Exit Fullscreen</span>
          </button>

          <div className="my-auto w-full h-full flex items-center justify-center py-4">
            {renderCircularVisual('h-[78dvh] max-h-[560px] aspect-square')}
          </div>
        </div>
      )}

      {/* MAIN 3-COLUMN INTERACTIVE CARD */}
      <div className="bg-white dark:bg-[#1A201C] border border-[#E4E1D9] dark:border-[#2D352F] rounded-2xl p-4 sm:p-6 shadow-2xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* LEFT COLUMN (lg:col-span-5): CIRCULAR VISUAL STAGE */}
          <div
            className={`lg:col-span-5 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center min-h-[340px] sm:min-h-[380px] transition-colors relative ${selectedBg.containerClass}`}
          >
            {renderCircularVisual('w-full max-w-[300px] sm:max-w-[320px] aspect-square')}

            {/* Subtle Ring / Pie Disc Mode Toggle Pill in bottom corner */}
            <div className="mt-4 flex items-center gap-1.5 bg-black/5 dark:bg-white/10 p-1 rounded-lg text-[11px]">
              <button
                type="button"
                onClick={() => setVisualStyle('ring')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  visualStyle === 'ring'
                    ? 'bg-white dark:bg-[#252E28] text-[#18221D] dark:text-white shadow-2xs'
                    : 'text-[#4B5851] dark:text-slate-300 hover:text-[#18221D]'
                }`}
              >
                Circle Ring
              </button>
              <button
                type="button"
                onClick={() => setVisualStyle('pie')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  visualStyle === 'pie'
                    ? 'bg-white dark:bg-[#252E28] text-[#18221D] dark:text-white shadow-2xs'
                    : 'text-[#4B5851] dark:text-slate-300 hover:text-[#18221D]'
                }`}
              >
                Pie Sector
              </button>
            </div>
          </div>

          {/* MIDDLE COLUMN (lg:col-span-4): DURATION & PLAYBACK CONTROLS */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-5 py-1">
            <div className="space-y-4">
              {/* Duration / End Time Tabs */}
              <div className="grid grid-cols-2 rounded-xl bg-[#F2F1EC] dark:bg-[#222924] p-1 border border-[#E4E1D9] dark:border-[#2D352F]">
                <button
                  type="button"
                  onClick={() => setMode('duration')}
                  className={`py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                    mode === 'duration'
                      ? 'bg-[#1F4E3B] text-white shadow-2xs'
                      : 'text-[#252B27]/80 dark:text-slate-300 hover:text-[#252B27]'
                  }`}
                >
                  Duration
                </button>
                <button
                  type="button"
                  onClick={() => setMode('endTime')}
                  className={`py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                    mode === 'endTime'
                      ? 'bg-[#1F4E3B] text-white shadow-2xs'
                      : 'text-[#252B27]/80 dark:text-slate-300 hover:text-[#252B27]'
                  }`}
                >
                  End Time
                </button>
              </div>

              {mode === 'duration' ? (
                <>
                  {/* 5 Preset Buttons */}
                  <div className="grid grid-cols-5 gap-2">
                    {PRESET_MINUTES.map((mins) => {
                      const isActive =
                        customMinutes === mins &&
                        totalDurationMs === mins * 60 * 1000;
                      return (
                        <button
                          key={mins}
                          type="button"
                          onClick={() => applyDurationMinutes(mins)}
                          className={`py-2 px-1 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${
                            isActive
                              ? 'bg-[#1F4E3B] text-white border-[#1F4E3B] shadow-2xs'
                              : 'bg-[#F8F7F4] dark:bg-[#222924] text-[#252B27] dark:text-slate-200 border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#1F4E3B]'
                          }`}
                        >
                          {mins} min
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Minutes Stepper Input */}
                  <div className="flex items-center gap-3">
                    <div className="relative flex items-center w-28 rounded-xl border border-[#E4E1D9] dark:border-[#2D352F] bg-[#FBFBF9] dark:bg-[#222924] px-3 py-2">
                      <input
                        ref={customInputRef}
                        type="number"
                        min={1}
                        max={999}
                        value={customMinutes}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          if (!Number.isNaN(val)) {
                            applyDurationMinutes(val);
                          } else {
                            setCustomMinutes(1);
                          }
                        }}
                        aria-label="Custom duration in minutes"
                        className="w-full bg-transparent text-base font-semibold text-[#252B27] dark:text-white focus:outline-none appearance-none"
                      />
                      <div className="flex flex-col -my-1 ml-1">
                        <button
                          type="button"
                          onClick={() => applyDurationMinutes(customMinutes + 1)}
                          aria-label="Increase minutes"
                          className="text-[#252B27]/60 hover:text-[#252B27] dark:text-slate-400 dark:hover:text-white cursor-pointer"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            applyDurationMinutes(Math.max(1, customMinutes - 1))
                          }
                          aria-label="Decrease minutes"
                          className="text-[#252B27]/60 hover:text-[#252B27] dark:text-slate-400 dark:hover:text-white cursor-pointer"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <span className="text-sm text-[#252B27]/80 dark:text-slate-300 font-medium">
                      minutes
                    </span>
                  </div>
                </>
              ) : (
                <div className="space-y-2 py-2">
                  <label
                    htmlFor="circular-end-time-input"
                    className="block text-xs font-semibold text-[#252B27]/75 dark:text-slate-300"
                  >
                    Count down until clock time:
                  </label>
                  <input
                    id="circular-end-time-input"
                    type="time"
                    value={endTimeStr}
                    onChange={(e) => handleEndTimeChange(e.target.value)}
                    className="w-full rounded-xl border border-[#E4E1D9] dark:border-[#2D352F] bg-[#FBFBF9] dark:bg-[#222924] px-3.5 py-2.5 text-base font-semibold text-[#252B27] dark:text-white focus:outline-none focus:border-[#1F4E3B]"
                  />
                </div>
              )}

              {/* Primary Start Button */}
              <button
                type="button"
                onClick={isRunning ? handlePause : handleStart}
                className="w-full py-3.5 px-6 rounded-xl bg-[#1F4E3B] hover:bg-[#183E2F] text-white font-semibold text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-xs transition-colors cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>
                  {isRunning
                    ? 'Running...'
                    : remainingMs < totalDurationMs && remainingMs > 0
                    ? 'Resume'
                    : 'Start'}
                </span>
              </button>

              {/* Pause & Reset Row */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={isRunning ? handlePause : handleStart}
                  disabled={!isRunning && remainingMs === totalDurationMs}
                  className="py-3 px-4 rounded-xl bg-[#F2F1EC] hover:bg-[#E7E5DD] dark:bg-[#222924] dark:hover:bg-[#2A332D] disabled:opacity-50 text-[#252B27] dark:text-slate-200 font-semibold text-sm flex items-center justify-center gap-2 border border-[#E4E1D9] dark:border-[#2D352F] transition-colors cursor-pointer"
                >
                  <Pause className="w-4 h-4 fill-current" />
                  <span>
                    {!isRunning && remainingMs < totalDurationMs && remainingMs > 0
                      ? 'Resume'
                      : 'Pause'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="py-3 px-4 rounded-xl bg-[#F2F1EC] hover:bg-[#E7E5DD] dark:bg-[#222924] dark:hover:bg-[#2A332D] text-[#252B27] dark:text-slate-200 font-semibold text-sm flex items-center justify-center gap-2 border border-[#E4E1D9] dark:border-[#2D352F] transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Bottom Utility Toggles Bar */}
            <div className="pt-3 border-t border-[#E4E1D9]/80 dark:border-[#2D352F] flex flex-wrap items-center justify-between gap-3 text-xs font-medium text-[#252B27]/85 dark:text-slate-300">
              {/* Sound Alert Toggle */}
              <div className="flex items-center gap-2">
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-[#1F4E3B] dark:text-[#5E917A]" />
                ) : (
                  <VolumeX className="w-4 h-4 text-[#252B27]/50 dark:text-slate-500" />
                )}
                <span>Sound Alert</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={soundEnabled}
                  aria-label="Toggle Sound Alert"
                  onClick={() => setSoundEnabled((prev) => !prev)}
                  className={`w-9 h-5 rounded-full transition-colors p-0.5 cursor-pointer ${
                    soundEnabled ? 'bg-[#1F4E3B]' : 'bg-[#D0CFC9] dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      soundEnabled ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Fullscreen Button */}
              <button
                type="button"
                onClick={() => toggleFullscreen(true)}
                className="inline-flex items-center gap-1.5 text-[#252B27]/85 dark:text-slate-300 hover:text-[#1F4E3B] transition-colors cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5 text-[#1F4E3B] dark:text-[#5E917A]" />
                <span>Fullscreen</span>
              </button>

              {/* Show Time Toggle */}
              <div className="flex items-center gap-2">
                {showTime ? (
                  <Eye className="w-4 h-4 text-[#1F4E3B] dark:text-[#5E917A]" />
                ) : (
                  <EyeOff className="w-4 h-4 text-[#252B27]/50 dark:text-slate-500" />
                )}
                <span>Show Time</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={showTime}
                  aria-label="Toggle Show Time"
                  onClick={() => setShowTime((prev) => !prev)}
                  className={`w-9 h-5 rounded-full transition-colors p-0.5 cursor-pointer ${
                    showTime ? 'bg-[#1F4E3B]' : 'bg-[#D0CFC9] dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      showTime ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (lg:col-span-3): TIMER APPEARANCE PANEL */}
          <div className="lg:col-span-3 rounded-2xl bg-[#FAF9F6] dark:bg-[#1E2521] border border-[#E4E1D9] dark:border-[#2D352F] p-4 sm:p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <h2 className="font-sans text-base font-bold text-[#252B27] dark:text-white">
                Timer Appearance
              </h2>

              {/* Circle Color Swatches */}
              <div>
                <span className="block text-xs font-semibold text-[#252B27]/80 dark:text-slate-300 mb-2">
                  Circle Color
                </span>
                <div className="flex items-center gap-2.5 flex-wrap">
                  {CIRCLE_COLORS.map((color) => {
                    const isSelected = selectedColorId === color.id;
                    return (
                      <button
                        key={color.id}
                        type="button"
                        onClick={() => setSelectedColorId(color.id)}
                        aria-label={`Select ${color.label} circle color`}
                        title={color.label}
                        className={`w-7 h-7 rounded-full transition-transform cursor-pointer flex items-center justify-center ${
                          isSelected
                            ? 'ring-2 ring-offset-2 ring-[#1F4E3B] scale-105'
                            : 'hover:scale-105 opacity-90 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: color.hex }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Background Style Swatches */}
              <div>
                <span className="block text-xs font-semibold text-[#252B27]/80 dark:text-slate-300 mb-2">
                  Background Style
                </span>
                <div className="flex items-center gap-3">
                  {BACKGROUND_STYLES.map((bg) => {
                    const isSelected = bgStyleId === bg.id;
                    return (
                      <button
                        key={bg.id}
                        type="button"
                        onClick={() => setBgStyleId(bg.id)}
                        aria-label={`Select ${bg.label} background style`}
                        title={bg.label}
                        className={`w-9 h-9 rounded-full border transition-transform cursor-pointer ${
                          bg.previewClass
                        } ${
                          isSelected
                            ? 'ring-2 ring-offset-2 ring-[#1F4E3B] scale-105'
                            : 'hover:scale-105'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Countdown Direction */}
              <div>
                <span className="block text-xs font-semibold text-[#252B27]/80 dark:text-slate-300 mb-2">
                  Countdown Direction
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDirection('clockwise')}
                    className={`py-2 px-2.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      direction === 'clockwise'
                        ? 'bg-[#1F4E3B] text-white border-[#1F4E3B]'
                        : 'bg-white dark:bg-[#252E28] text-[#252B27] dark:text-slate-200 border-[#E4E1D9] dark:border-[#323D36]'
                    }`}
                  >
                    Clockwise
                  </button>
                  <button
                    type="button"
                    onClick={() => setDirection('counterclockwise')}
                    className={`py-2 px-2.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer truncate ${
                      direction === 'counterclockwise'
                        ? 'bg-[#1F4E3B] text-white border-[#1F4E3B]'
                        : 'bg-white dark:bg-[#252E28] text-[#252B27] dark:text-slate-200 border-[#E4E1D9] dark:border-[#323D36]'
                    }`}
                  >
                    Counterclockwise
                  </button>
                </div>
              </div>

              {/* Low Time Warning */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#252B27]/85 dark:text-slate-300">
                    Low Time Warning
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={lowTimeWarningEnabled}
                    aria-label="Toggle Low Time Warning"
                    onClick={() => setLowTimeWarningEnabled((prev) => !prev)}
                    className={`w-9 h-5 rounded-full transition-colors p-0.5 cursor-pointer ${
                      lowTimeWarningEnabled
                        ? 'bg-[#1F4E3B]'
                        : 'bg-[#D0CFC9] dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                        lowTimeWarningEnabled ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Warning Threshold Dropdown */}
                <div className="relative flex items-center rounded-xl border border-[#E4E1D9] dark:border-[#323D36] bg-white dark:bg-[#252E28] px-3 py-2">
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0 mr-2"
                    style={{ backgroundColor: selectedWarning.dotColor }}
                  />
                  <select
                    value={lowTimeWarningOption}
                    onChange={(e) =>
                      setLowTimeWarningOption(e.target.value as LowTimeWarningOption)
                    }
                    disabled={!lowTimeWarningEnabled}
                    aria-label="Low time warning threshold"
                    className="w-full bg-transparent text-xs font-medium text-[#252B27] dark:text-slate-200 focus:outline-none disabled:opacity-50 cursor-pointer"
                  >
                    {WARNING_OPTIONS.map((opt) => (
                      <option
                        key={opt.id}
                        value={opt.id}
                        className="bg-white dark:bg-[#1E2521] text-[#252B27] dark:text-white"
                      >
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Reduced Motion Option at bottom of Appearance Panel */}
            <div className="pt-2 border-t border-[#E4E1D9]/70 dark:border-[#2D352F] flex items-center justify-between text-[11px] text-[#252B27]/75 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#1F4E3B] dark:text-[#5E917A]" />
                <span>Reduced Motion</span>
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={reducedMotion}
                aria-label="Toggle Reduced Motion"
                onClick={() => setReducedMotion((prev) => !prev)}
                className={`w-8 h-4 rounded-full transition-colors p-0.5 cursor-pointer ${
                  reducedMotion ? 'bg-[#1F4E3B]' : 'bg-[#D0CFC9] dark:bg-slate-700'
                }`}
              >
                <span
                  className={`block w-3 h-3 rounded-full bg-white transition-transform ${
                    reducedMotion ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK PRESETS SECTION */}
      <div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252B27] dark:text-white mb-1">
          Quick Presets
        </h2>
        <p className="text-xs sm:text-sm text-[#252B27]/75 dark:text-slate-400 mb-4">
          Start with a common time or set a custom duration.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {[
            { mins: 1, label: '1 Minute', sub: 'Quick tasks' },
            { mins: 3, label: '3 Minutes', sub: 'Short activities' },
            { mins: 5, label: '5 Minutes', sub: 'Focus time' },
            { mins: 10, label: '10 Minutes', sub: 'Work breaks' },
            { mins: 15, label: '15 Minutes', sub: 'Longer sessions' },
          ].map((preset) => {
            const isSelected =
              mode === 'duration' &&
              customMinutes === preset.mins &&
              totalDurationMs === preset.mins * 60 * 1000;
            return (
              <button
                key={preset.mins}
                type="button"
                onClick={() => {
                  setMode('duration');
                  applyDurationMinutes(preset.mins);
                }}
                className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white dark:bg-[#1F2823] border-[#1F4E3B] ring-1 ring-[#1F4E3B] shadow-2xs'
                    : 'bg-white dark:bg-[#1A201C] border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#1F4E3B]'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-[#FDF5EC] dark:bg-[#2B241B] text-[#D97706] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-xs sm:text-sm text-[#252B27] dark:text-white truncate">
                    {preset.label}
                  </div>
                  <div
                    className={`text-[11px] truncate ${
                      isSelected
                        ? 'text-[#1F4E3B] dark:text-[#5E917A] font-medium'
                        : 'text-[#252B27]/65 dark:text-slate-400'
                    }`}
                  >
                    {preset.sub}
                  </div>
                </div>
              </button>
            );
          })}

          {/* Custom Card */}
          <button
            type="button"
            onClick={() => {
              setMode('duration');
              customInputRef.current?.focus();
              customInputRef.current?.select();
            }}
            className="flex items-center gap-3 p-4 rounded-2xl border bg-white dark:bg-[#1A201C] border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#1F4E3B] text-left transition-all cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-[#EBF2EE] dark:bg-[#243029] text-[#1F4E3B] dark:text-[#5E917A] flex items-center justify-center shrink-0">
              <Settings className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-xs sm:text-sm text-[#252B27] dark:text-white truncate">
                Custom
              </div>
              <div className="text-[11px] text-[#252B27]/65 dark:text-slate-400 truncate">
                Set your own time
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* POPULAR USES SECTION */}
      <div className="rounded-2xl bg-[#EEF3EF]/80 dark:bg-[#19211C] border border-[#DCE5DD] dark:border-[#28332C] p-6 sm:p-8">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252B27] dark:text-white mb-1">
          Popular Uses
        </h2>
        <p className="text-xs sm:text-sm text-[#252B27]/75 dark:text-slate-400 mb-5">
          A circular timer is useful for many everyday situations.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              title: 'Classroom Activities',
              desc: 'Keep students on track.',
              icon: <GraduationCap className="w-5 h-5" />,
            },
            {
              title: 'Focus and Study',
              desc: 'Stay focused and avoid distractions.',
              icon: <BookOpen className="w-5 h-5" />,
            },
            {
              title: 'Presentations',
              desc: 'Manage speaking time with a clear visual.',
              icon: <Users className="w-5 h-5" />,
            },
            {
              title: 'Short Breaks',
              desc: 'Take regular breaks for better productivity.',
              icon: <Coffee className="w-5 h-5" />,
            },
            {
              title: 'Daily Planning',
              desc: 'Time your daily activities with ease.',
              icon: <Calendar className="w-5 h-5" />,
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white dark:bg-[#1E2621] border border-[#E4E1D9] dark:border-[#2D352F] rounded-2xl p-4 flex items-start gap-3.5 shadow-2xs"
            >
              <div className="w-10 h-10 rounded-xl bg-[#EBF2EE] dark:bg-[#26332B] text-[#1F4E3B] dark:text-[#5E917A] flex items-center justify-center shrink-0 mt-0.5">
                {item.icon}
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-xs sm:text-sm text-[#252B27] dark:text-white mb-1">
                  {item.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-[#252B27]/70 dark:text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

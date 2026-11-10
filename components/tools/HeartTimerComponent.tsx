'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Eye,
  Heart,
  ChevronUp,
  ChevronDown,
  Settings,
  Bookmark,
  Check,
  BookOpen,
  Clock,
  User,
  GraduationCap,
} from 'lucide-react';
import { playTimerSound } from '@/lib/sound';

type TimerMode = 'duration' | 'endtime';
type HeartStyleId = 'rose' | 'berry' | 'ivory' | 'soft-red';

interface HeartStyleConfig {
  id: HeartStyleId;
  label: string;
  stageBg: string;
  outerStroke: string;
  innerShellFill: string;
  fillTop: string;
  fillBottom: string;
  waveCrest: string;
  textColor: string;
  subTextColor: string;
  quoteColor: string;
}

const HEART_STYLES: Record<HeartStyleId, HeartStyleConfig> = {
  rose: {
    id: 'rose',
    label: 'Rose',
    stageBg: 'linear-gradient(180deg, #FDF1F2 0%, #FBE8EA 100%)',
    outerStroke: '#F2A3B3',
    innerShellFill: '#FFF9FA',
    fillTop: '#F46B8A',
    fillBottom: '#C82349',
    waveCrest: '#F99BB0',
    textColor: '#131E29',
    subTextColor: '#4A5568',
    quoteColor: '#C83755',
  },
  berry: {
    id: 'berry',
    label: 'Berry',
    stageBg: 'linear-gradient(180deg, #FBF0F5 0%, #F5E3EC 100%)',
    outerStroke: '#D88BB2',
    innerShellFill: '#FFF9FC',
    fillTop: '#C23878',
    fillBottom: '#7A1242',
    waveCrest: '#E07AA8',
    textColor: '#1A1423',
    subTextColor: '#52475B',
    quoteColor: '#9E1F5A',
  },
  ivory: {
    id: 'ivory',
    label: 'Ivory',
    stageBg: 'linear-gradient(180deg, #FAF6F0 0%, #F3ECE1 100%)',
    outerStroke: '#DBC8B6',
    innerShellFill: '#FFFCF8',
    fillTop: '#E5CFC0',
    fillBottom: '#C2A38B',
    waveCrest: '#EFE0D4',
    textColor: '#2C2520',
    subTextColor: '#6E6259',
    quoteColor: '#9C7A63',
  },
  'soft-red': {
    id: 'soft-red',
    label: 'Soft Red',
    stageBg: 'linear-gradient(180deg, #FDF1F0 0%, #FBE6E4 100%)',
    outerStroke: '#F09C98',
    innerShellFill: '#FFF9F8',
    fillTop: '#EB524D',
    fillBottom: '#B8231E',
    waveCrest: '#F58A86',
    textColor: '#1E1616',
    subTextColor: '#5A4646',
    quoteColor: '#C92E29',
  },
};

interface ColorSwatch {
  id: string;
  label: string;
  hex: string;
  fillTop: string;
  fillBottom: string;
  waveCrest: string;
  outerStroke: string;
  isGradient?: boolean;
}

const COLOR_SWATCHES: ColorSwatch[] = [
  {
    id: 'rose-pink',
    label: 'Rose Pink',
    hex: '#E65C7B',
    fillTop: '#F46B8A',
    fillBottom: '#C82349',
    waveCrest: '#F99BB0',
    outerStroke: '#F2A3B3',
  },
  {
    id: 'coral-red',
    label: 'Coral Red',
    hex: '#F25C69',
    fillTop: '#F76C77',
    fillBottom: '#C92A3A',
    waveCrest: '#FCA0A7',
    outerStroke: '#F5A3AA',
  },
  {
    id: 'soft-blush',
    label: 'Soft Blush',
    hex: '#F49097',
    fillTop: '#F7A1A8',
    fillBottom: '#D95F69',
    waveCrest: '#FBC2C6',
    outerStroke: '#F6B8BC',
  },
  {
    id: 'lavender-mist',
    label: 'Lavender Mist',
    hex: '#C8C6D7',
    fillTop: '#B5B1D1',
    fillBottom: '#7E78A8',
    waveCrest: '#D4D2E6',
    outerStroke: '#C5C2DC',
  },
  {
    id: 'sky-blue',
    label: 'Sky Blue',
    hex: '#90C2E7',
    fillTop: '#7EB8E3',
    fillBottom: '#3D82B8',
    waveCrest: '#AED5F2',
    outerStroke: '#A3CBE8',
  },
  {
    id: 'spectrum',
    label: 'Vibrant Berry',
    hex: '#D946EF',
    fillTop: '#EC4899',
    fillBottom: '#8B5CF6',
    waveCrest: '#F472B6',
    outerStroke: '#E879F9',
    isGradient: true,
  },
];

const STORAGE_KEY = 'timetools_heart_timer_defaults_v1';

// Balanced, symmetrical heart path inside a 320x300 viewBox
// Top cleft at (160, 68), top lobes peaking at y=28, bottom tip at (160, 274)
const HEART_PATH =
  'M 160 274 C 148 263, 28 182, 28 98 C 28 52, 64 26, 104 26 C 132 26, 150 42, 160 64 C 170 42, 188 26, 216 26 C 256 26, 292 52, 292 98 C 292 182, 172 263, 160 274 Z';

export default function HeartTimerComponent() {
  const [mode, setMode] = useState<TimerMode>('duration');
  const [durationMinutes, setDurationMinutes] = useState<number>(5);
  const [endTimeStr, setEndTimeStr] = useState<string>('17:00');
  const [totalSeconds, setTotalSeconds] = useState<number>(300);
  const [remainingMs, setRemainingMs] = useState<number>(300 * 1000);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [wavePhase, setWavePhase] = useState<number>(0);

  // Customization
  const [heartStyle, setHeartStyle] = useState<HeartStyleId>('rose');
  const [selectedSwatchId, setSelectedSwatchId] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [savedFeedback, setSavedFeedback] = useState<boolean>(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const customInputRef = useRef<HTMLInputElement>(null);
  const endTimeRef = useRef<number | null>(null);
  const remainingMsRef = useRef<number>(300 * 1000);
  const soundEnabledRef = useRef<boolean>(true);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  // Restore saved user preferences from localStorage safely
  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (parsed.heartStyle && HEART_STYLES[parsed.heartStyle as HeartStyleId]) {
          setHeartStyle(parsed.heartStyle as HeartStyleId);
        }
        if (typeof parsed.selectedSwatchId === 'string' || parsed.selectedSwatchId === null) {
          setSelectedSwatchId(parsed.selectedSwatchId);
        }
        if (typeof parsed.durationMinutes === 'number' && parsed.durationMinutes >= 1 && parsed.durationMinutes <= 180) {
          const initialMs = parsed.durationMinutes * 60 * 1000;
          setDurationMinutes(parsed.durationMinutes);
          setTotalSeconds(parsed.durationMinutes * 60);
          setRemainingMs(initialMs);
          remainingMsRef.current = initialMs;
        }
        if (typeof parsed.soundEnabled === 'boolean') {
          setSoundEnabled(parsed.soundEnabled);
          soundEnabledRef.current = parsed.soundEnabled;
        }
        if (typeof parsed.reducedMotion === 'boolean') {
          setReducedMotion(parsed.reducedMotion);
        }
      } catch {
        // Ignore storage errors
      }
    });
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Fullscreen listener
  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // High-precision countdown loop strictly synchronized with remainingMsRef
  useEffect(() => {
    if (!isRunning) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    endTimeRef.current = performance.now() + remainingMsRef.current;

    const tick = (now: number) => {
      if (endTimeRef.current === null) return;
      const left = Math.max(0, endTimeRef.current - now);
      remainingMsRef.current = left;
      setRemainingMs(left);
      setWavePhase(now * 0.0045);

      if (left <= 0) {
        remainingMsRef.current = 0;
        setIsRunning(false);
        setIsCompleted(true);
        if (soundEnabledRef.current) {
          playTimerSound('chime');
        }
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isRunning]);

  const applyPresetMinutes = (mins: number) => {
    const clamped = Math.max(1, Math.min(180, mins));
    const nextMs = clamped * 60 * 1000;
    setIsRunning(false);
    setIsCompleted(false);
    setMode('duration');
    setDurationMinutes(clamped);
    setTotalSeconds(clamped * 60);
    setRemainingMs(nextMs);
    remainingMsRef.current = nextMs;
  };

  const handleEndTimeChange = (value: string) => {
    setEndTimeStr(value);
    const [hh, mm] = value.split(':').map(Number);
    if (Number.isNaN(hh) || Number.isNaN(mm)) return;
    const now = new Date();
    const target = new Date();
    target.setHours(hh, mm, 0, 0);
    if (target.getTime() <= now.getTime()) {
      target.setDate(target.getDate() + 1);
    }
    const diffSec = Math.max(10, Math.round((target.getTime() - now.getTime()) / 1000));
    const nextMs = diffSec * 1000;
    setIsRunning(false);
    setIsCompleted(false);
    setTotalSeconds(diffSec);
    setRemainingMs(nextMs);
    remainingMsRef.current = nextMs;
  };

  const handleStartPause = () => {
    if (isCompleted || remainingMsRef.current <= 0) {
      const resetMs = totalSeconds * 1000;
      remainingMsRef.current = resetMs;
      setRemainingMs(resetMs);
      setIsCompleted(false);
      setIsRunning(true);
      return;
    }
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    const resetMs = totalSeconds * 1000;
    setIsRunning(false);
    setIsCompleted(false);
    remainingMsRef.current = resetMs;
    setRemainingMs(resetMs);
    setWavePhase(0);
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

  const handleSaveDefault = () => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          heartStyle,
          selectedSwatchId,
          durationMinutes,
          soundEnabled,
          reducedMotion,
        })
      );
      setSavedFeedback(true);
      setTimeout(() => setSavedFeedback(false), 2200);
    } catch {
      // Ignore storage errors
    }
  };

  // Active theme & optional swatch override
  const baseStyle = HEART_STYLES[heartStyle];
  const activeSwatch = COLOR_SWATCHES.find((s) => s.id === selectedSwatchId) || null;

  const fillTop = activeSwatch ? activeSwatch.fillTop : baseStyle.fillTop;
  const fillBottom = activeSwatch ? activeSwatch.fillBottom : baseStyle.fillBottom;
  const waveCrest = activeSwatch ? activeSwatch.waveCrest : baseStyle.waveCrest;
  const outerStroke = activeSwatch ? activeSwatch.outerStroke : baseStyle.outerStroke;

  // Exact remaining fraction strictly synchronized with timer (1.0 = 100% full, 0.0 = empty)
  const totalMs = Math.max(1000, totalSeconds * 1000);
  const visualFraction = isCompleted
    ? 0
    : Math.min(1, Math.max(0, remainingMs / totalMs));

  // Heart vertical range in SVG viewBox is y=26 (top of lobes) to y=274 (bottom tip), height = 248
  const heartTopY = 26;
  const heartBottomY = 274;
  const heartHeight = heartBottomY - heartTopY;
  const fillLevelY = heartBottomY - visualFraction * heartHeight;

  // Taper wave amplitude smoothly to 0 at 100% full (so top lobes are 100% filled)
  // and to 0 at 0% empty (so liquid drains cleanly out the bottom tip at y=274 with no jump)
  const edgeDamping = Math.min(1, visualFraction * 10, (1 - visualFraction) * 12);
  const waveAmp = (reducedMotion ? 3 : 8) * edgeDamping;
  const activePhase = reducedMotion ? 0.6 : wavePhase;

  // Build smooth, zero-lag SVG wave paths centered accurately at fillLevelY
  const buildWavePath = (phaseOffset: number, ampScale: number, yShift: number) => {
    const step = 16;
    const points: string[] = [];
    for (let x = -16; x <= 336; x += step) {
      const normX = x / 320;
      const y =
        fillLevelY +
        yShift * edgeDamping +
        Math.sin(normX * Math.PI * 2 + activePhase + phaseOffset) * (waveAmp * ampScale);
      points.push(`${x === -16 ? 'M' : 'L'} ${x} ${y.toFixed(2)}`);
    }
    points.push('L 336 300 L -16 300 Z');
    return points.join(' ');
  };

  const backWavePath = buildWavePath(1.9, 0.85, -3.5);
  const frontWavePath = buildWavePath(0, 1.0, 0);

  // Format MM:SS readout
  const totalSecondsLeft = Math.ceil(remainingMs / 1000);
  const displayMins = Math.floor(totalSecondsLeft / 60);
  const displaySecs = totalSecondsLeft % 60;
  const formattedTime = `${String(displayMins).padStart(2, '0')}:${String(displaySecs).padStart(2, '0')}`;

  return (
    <div className="space-y-10">
      {/* Main 3-Column Interactive Card */}
      <div className="rounded-3xl border border-[#F0D9DC] dark:border-[#36282C] bg-[#FFFDFD] dark:bg-[#191517] p-4 sm:p-6 lg:p-7 shadow-xs transition-colors">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-7 items-stretch">
          {/* LEFT COLUMN (5 cols): Heart Countdown Visualization */}
          <div className="lg:col-span-5 flex">
            <div
              ref={stageRef}
              style={{ background: baseStyle.stageBg }}
              className={`relative w-full min-h-[380px] sm:min-h-[420px] rounded-2xl border border-[#F5DCE0] dark:border-[#3F2E33] p-6 flex flex-col items-center justify-between overflow-hidden select-none ${
                isFullscreen ? 'timer-fullscreen-stage p-8' : ''
              }`}
            >
              {isFullscreen && (
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="fixed top-4 right-4 z-50 inline-flex items-center gap-1.5 rounded-full bg-black/55 hover:bg-black/75 backdrop-blur-md border border-white/20 px-4 py-2 text-xs font-bold text-white shadow-lg transition cursor-pointer"
                  aria-label="Exit Fullscreen"
                >
                  <Minimize2 className="h-4 w-4" />
                  <span>Exit Fullscreen</span>
                </button>
              )}
              {/* Soft radial glow behind the heart */}
              <div
                className="pointer-events-none absolute inset-0 opacity-65"
                style={{
                  background: `radial-gradient(circle at 50% 46%, rgba(255,255,255,0.9) 0%, transparent 68%)`,
                }}
              />

              {/* Centered Heart SVG Container */}
              <div className={`relative z-10 my-auto flex flex-col items-center justify-center w-full ${isFullscreen ? 'max-w-[500px] max-h-[78dvh]' : 'max-w-[310px]'}`}>
                <svg
                  viewBox="0 0 320 300"
                  shapeRendering="geometricPrecision"
                  className={`w-full h-auto drop-shadow-[0_12px_24px_rgba(200,45,75,0.14)] ${
                    isRunning && !reducedMotion ? 'animate-[pulse_3.2s_ease-in-out_infinite]' : ''
                  }`}
                  aria-label={`Heart countdown timer showing ${formattedTime} remaining`}
                >
                  <defs>
                    <clipPath id="heartClipPath">
                      <path d={HEART_PATH} />
                    </clipPath>

                    <linearGradient id="heartFillGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={fillTop} />
                      <stop offset="100%" stopColor={fillBottom} />
                    </linearGradient>

                    <linearGradient id="heartRimHighlight" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
                      <stop offset="50%" stopColor={outerStroke} stopOpacity="0.55" />
                      <stop offset="100%" stopColor={fillBottom} stopOpacity="0.35" />
                    </linearGradient>
                  </defs>

                  {/* Outer soft halo contour */}
                  <path
                    d={HEART_PATH}
                    fill={baseStyle.innerShellFill}
                    stroke={outerStroke}
                    strokeWidth="9"
                    strokeLinejoin="round"
                  />

                  {/* Inner white bevel contour */}
                  <path
                    d={HEART_PATH}
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="4"
                    strokeLinejoin="round"
                    transform="scale(0.955) translate(7.5, 7)"
                  />

                  {/* Clipped Liquid / Curved Fill Inside Heart — strictly synchronized with remainingMs */}
                  <g clipPath="url(#heartClipPath)">
                    {visualFraction > 0 && (
                      <>
                        {/* Secondary lighter wave crest in back */}
                        <path
                          d={backWavePath}
                          fill={waveCrest}
                          opacity="0.68"
                        />

                        {/* Primary smooth curved fill */}
                        <path
                          d={frontWavePath}
                          fill="url(#heartFillGrad)"
                        />

                        {/* Subtle glossy inner reflection along lower curve */}
                        <path
                          d="M 56 175 C 82 220, 132 250, 156 263"
                          fill="none"
                          stroke="#FFFFFF"
                          strokeWidth="4"
                          strokeLinecap="round"
                          opacity={Math.min(0.32, visualFraction * 0.8)}
                        />
                      </>
                    )}
                  </g>

                  {/* Crisp inner heart contour line on top */}
                  <path
                    d={HEART_PATH}
                    fill="none"
                    stroke={outerStroke}
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />
                </svg>

                {/* Central Numerical Readout Overlay */}
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center -mt-5 text-center">
                  <div className="px-4 py-2 rounded-2xl bg-white/75 backdrop-blur-[2px] shadow-[0_2px_12px_rgba(255,255,255,0.65)] flex flex-col items-center">
                    <div
                      style={{ color: baseStyle.textColor }}
                      className="font-sans text-4xl sm:text-[46px] font-extrabold tracking-tight tabular-nums leading-none"
                    >
                      {formattedTime}
                    </div>
                    <div
                      style={{ color: baseStyle.subTextColor }}
                      className="text-xs sm:text-sm font-medium mt-1"
                    >
                      {isCompleted ? 'Completed!' : 'Time Left'}
                    </div>
                    <Heart
                      className="w-3.5 h-3.5 mt-1 fill-current"
                      style={{ color: fillBottom }}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Cursive Quote & Mini Heart Ornament matching mockup */}
              {!isFullscreen && (
                <div className="relative z-10 text-center pt-2">
                  <div className="flex items-center justify-center gap-2.5">
                    <span className="h-px w-6 bg-[#E5B8C0]" />
                    <p
                      style={{ color: baseStyle.quoteColor }}
                      className="font-serif italic text-base sm:text-lg font-medium tracking-wide"
                    >
                      Good things take time
                    </p>
                    <span className="h-px w-6 bg-[#E5B8C0]" />
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <span className="h-px w-7 bg-[#EFCED4]" />
                    <Heart
                      className="w-3 h-3 fill-current"
                      style={{ color: baseStyle.quoteColor }}
                    />
                    <span className="h-px w-7 bg-[#EFCED4]" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* MIDDLE COLUMN (4 cols): Duration / End Time, Presets & Primary Controls */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-5 py-1">
            <div className="space-y-4">
              {/* Duration / End Time Segmented Toggle */}
              <div className="grid grid-cols-2 rounded-xl bg-[#F9EFEF] dark:bg-[#261E21] p-1 border border-[#F1DCDF] dark:border-[#3A2B30]">
                <button
                  type="button"
                  onClick={() => setMode('duration')}
                  className={`py-2 rounded-lg text-xs sm:text-sm font-bold transition cursor-pointer ${
                    mode === 'duration'
                      ? 'bg-[#D43753] text-white shadow-xs'
                      : 'text-[#5A464C] dark:text-slate-300 hover:text-[#1E1417] dark:hover:text-white'
                  }`}
                >
                  Duration
                </button>
                <button
                  type="button"
                  onClick={() => setMode('endtime')}
                  className={`py-2 rounded-lg text-xs sm:text-sm font-bold transition cursor-pointer ${
                    mode === 'endtime'
                      ? 'bg-[#D43753] text-white shadow-xs'
                      : 'text-[#5A464C] dark:text-slate-300 hover:text-[#1E1417] dark:hover:text-white'
                  }`}
                >
                  End Time
                </button>
              </div>

              {/* Preset Minute Buttons */}
              <div className="grid grid-cols-5 gap-2">
                {[1, 3, 5, 10, 15].map((m) => {
                  const isActive = mode === 'duration' && durationMinutes === m;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => applyPresetMinutes(m)}
                      className={`py-2 px-1 rounded-xl text-xs font-bold border transition cursor-pointer ${
                        isActive
                          ? 'bg-[#D43753] text-white border-[#D43753] shadow-xs'
                          : 'bg-white dark:bg-[#221A1D] text-[#2B2124] dark:text-slate-200 border-[#EFE2E4] dark:border-[#382A2E] hover:border-[#D43753]/50'
                      }`}
                    >
                      {m} min
                    </button>
                  );
                })}
              </div>

              {/* Custom Minutes Input or End Time Input */}
              {mode === 'duration' ? (
                <div className="flex items-center gap-3 pt-1">
                  <div className="relative flex items-center w-28 rounded-xl border border-[#EAD8DC] dark:border-[#382A2E] bg-white dark:bg-[#221A1D] px-3.5 py-2 shadow-2xs">
                    <input
                      ref={customInputRef}
                      type="number"
                      min={1}
                      max={180}
                      value={durationMinutes}
                      onChange={(e) => applyPresetMinutes(parseInt(e.target.value, 10) || 1)}
                      aria-label="Duration in minutes"
                      className="w-full bg-transparent text-base font-bold text-[#1E1417] dark:text-white focus:outline-none tabular-nums"
                    />
                    <div className="flex flex-col -mr-1">
                      <button
                        type="button"
                        onClick={() => applyPresetMinutes(durationMinutes + 1)}
                        aria-label="Increase minutes"
                        className="text-stone-500 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white cursor-pointer"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => applyPresetMinutes(Math.max(1, durationMinutes - 1))}
                        aria-label="Decrease minutes"
                        className="text-stone-500 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white cursor-pointer"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-[#5A4A4E] dark:text-slate-300">minutes</span>
                </div>
              ) : (
                <div className="flex items-center gap-3 pt-1">
                  <input
                    type="time"
                    value={endTimeStr}
                    onChange={(e) => handleEndTimeChange(e.target.value)}
                    aria-label="Target end time"
                    className="rounded-xl border border-[#EAD8DC] dark:border-[#382A2E] bg-white dark:bg-[#221A1D] px-3.5 py-2 text-sm font-bold text-[#1E1417] dark:text-white focus:outline-none"
                  />
                  <span className="text-xs text-[#6E5A5F] dark:text-slate-400">Counts down to clock time</span>
                </div>
              )}
            </div>

            {/* Start / Pause / Reset Action Buttons */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleStartPause}
                className="w-full py-3.5 rounded-xl bg-[#D43753] hover:bg-[#BC2B46] text-white font-bold text-base shadow-sm flex items-center justify-center gap-2 transition cursor-pointer"
              >
                {isRunning ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    {remainingMs < totalSeconds * 1000 && !isCompleted ? 'Resume' : 'Start'}
                  </>
                )}
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsRunning(false)}
                  disabled={!isRunning}
                  className="py-3 rounded-xl bg-[#F9EFEF] dark:bg-[#261E21] hover:bg-[#F2E1E3] dark:hover:bg-[#32262A] disabled:opacity-50 text-[#2B2124] dark:text-slate-200 font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Pause className="w-4 h-4" />
                  Pause
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="py-3 rounded-xl bg-[#F9EFEF] dark:bg-[#261E21] hover:bg-[#F2E1E3] dark:hover:bg-[#32262A] text-[#2B2124] dark:text-slate-200 font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
              </div>
            </div>

            {/* Utility Switches: Sound Alert | Fullscreen | Reduced Motion */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#F4E6E8] dark:border-[#34262B] text-[11px] sm:text-xs font-semibold text-[#4A3B3F] dark:text-slate-300">
              {/* Sound Alert */}
              <div className="flex items-center gap-1.5">
                {soundEnabled ? (
                  <Volume2 className="w-3.5 h-3.5 text-[#D43753] dark:text-rose-400" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5 text-stone-400" />
                )}
                <span>Sound Alert</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={soundEnabled}
                  onClick={() => setSoundEnabled((prev) => !prev)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    soundEnabled ? 'bg-[#D43753]' : 'bg-stone-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
                      soundEnabled ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Fullscreen */}
              <div className="flex items-center gap-1.5">
                {isFullscreen ? (
                  <Minimize2 className="w-3.5 h-3.5 text-[#D43753] dark:text-rose-400" />
                ) : (
                  <Maximize2 className="w-3.5 h-3.5 text-[#D43753] dark:text-rose-400" />
                )}
                <span>Fullscreen</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={isFullscreen}
                  onClick={toggleFullscreen}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    isFullscreen ? 'bg-[#D43753]' : 'bg-stone-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
                      isFullscreen ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Reduced Motion */}
              <div className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-[#D43753] dark:text-rose-400" />
                <span>Reduced Motion</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={reducedMotion}
                  onClick={() => setReducedMotion((prev) => !prev)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    reducedMotion ? 'bg-[#D43753]' : 'bg-stone-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
                      reducedMotion ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (3 cols): Heart Style, Color Theme & Save as Default */}
          <div className="lg:col-span-3 rounded-2xl border border-[#F1DFDF] dark:border-[#34262B] bg-[#FFFBFB] dark:bg-[#20191C] p-4 flex flex-col justify-between space-y-5">
            {/* Heart Style 2x2 Grid */}
            <div>
              <h2 className="text-xs font-bold text-[#1E1417] dark:text-white mb-2.5">Heart Style</h2>
              <div className="grid grid-cols-2 gap-2.5">
                {(
                  [
                    {
                      id: 'rose',
                      label: 'Rose',
                      top: '#F6839C',
                      bottom: '#D43753',
                      stroke: '#F2A3B3',
                    },
                    {
                      id: 'berry',
                      label: 'Berry',
                      top: '#B8326A',
                      bottom: '#7A1242',
                      stroke: '#D88BB2',
                    },
                    {
                      id: 'ivory',
                      label: 'Ivory',
                      top: '#F3EAE0',
                      bottom: '#DFCBB8',
                      stroke: '#D2BBA6',
                    },
                    {
                      id: 'soft-red',
                      label: 'Soft Red',
                      top: '#EC534E',
                      bottom: '#B8231E',
                      stroke: '#F09C98',
                    },
                  ] as const
                ).map((item) => {
                  const isSelected = heartStyle === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setHeartStyle(item.id);
                        setSelectedSwatchId(null);
                      }}
                      className={`flex flex-col items-center justify-center rounded-xl border p-2.5 transition cursor-pointer ${
                        isSelected
                          ? 'border-[#D43753] dark:border-rose-400 bg-[#FDF2F4] dark:bg-[#2F1E24] shadow-2xs'
                          : 'border-[#EFE2E4] dark:border-[#36282C] bg-white dark:bg-[#191517] hover:border-[#D43753]/40'
                      }`}
                    >
                      <svg viewBox="0 0 64 60" className="w-11 h-10 mb-1">
                        <defs>
                          <linearGradient id={`miniHeart-${item.id}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={item.top} />
                            <stop offset="100%" stopColor={item.bottom} />
                          </linearGradient>
                        </defs>
                        <path
                          d="M 32 54 C 29 51, 6 36, 6 20 C 6 10, 13 5, 21 5 C 26 5, 30 8, 32 13 C 34 8, 38 5, 43 5 C 51 5, 58 10, 58 20 C 58 36, 35 51, 32 54 Z"
                          fill={`url(#miniHeart-${item.id})`}
                          stroke={item.stroke}
                          strokeWidth="2"
                        />
                      </svg>
                      <span className="text-[11px] font-bold text-[#2B2124] dark:text-slate-200">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color Theme Swatches */}
            <div>
              <h2 className="text-xs font-bold text-[#1E1417] dark:text-white mb-2.5">Color Theme</h2>
              <div className="flex items-center justify-between gap-1.5">
                {COLOR_SWATCHES.map((swatch) => {
                  const isSelected =
                    selectedSwatchId === swatch.id ||
                    (!selectedSwatchId && swatch.id === 'rose-pink' && heartStyle === 'rose');
                  return (
                    <button
                      key={swatch.id}
                      type="button"
                      onClick={() => setSelectedSwatchId(swatch.id)}
                      title={swatch.label}
                      aria-label={swatch.label}
                      className={`w-7 h-7 rounded-full transition cursor-pointer flex items-center justify-center ${
                        isSelected
                          ? 'ring-2 ring-offset-2 dark:ring-offset-[#20191C] ring-[#D43753] dark:ring-rose-400 scale-105'
                          : 'hover:scale-105 opacity-90'
                      }`}
                      style={{
                        background: swatch.isGradient
                          ? 'conic-gradient(from 0deg, #EF4444, #F59E0B, #10B981, #3B82F6, #8B5CF6, #EC4899, #EF4444)'
                          : swatch.hex,
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Save as Default Button */}
            <button
              type="button"
              onClick={handleSaveDefault}
              className="w-full py-2.5 px-3 rounded-xl border border-[#DFECE6] dark:border-[#344A3F] bg-white dark:bg-[#1E2B24] hover:bg-[#F4FAF7] dark:hover:bg-[#25362D] text-xs font-bold text-[#1F4E3B] dark:text-[#6EE7B7] flex items-center justify-center gap-1.5 transition cursor-pointer shadow-2xs"
            >
              {savedFeedback ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#1F4E3B] dark:text-[#6EE7B7]" />
                  <span>Saved as Default!</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-3.5 h-3.5 text-[#1F4E3B] dark:text-[#6EE7B7]" />
                  <span>Save as Default</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Presets Section */}
      <section aria-labelledby="heart-quick-presets-heading" className="space-y-3">
        <div>
          <h2
            id="heart-quick-presets-heading"
            className="text-xl font-bold font-serif text-[#1E1417] dark:text-white"
          >
            Quick Presets
          </h2>
          <p className="text-xs text-[#6E5A5F] dark:text-slate-400">
            Start with a common time or set a custom duration.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { title: '1 Minute', sub: 'Quick break', mins: 1 },
            { title: '3 Minutes', sub: 'Short focus', mins: 3 },
            { title: '5 Minutes', sub: 'Focus time', mins: 5 },
            { title: '10 Minutes', sub: 'Study session', mins: 10 },
            { title: '15 Minutes', sub: 'Longer session', mins: 15 },
            { title: 'Custom', sub: 'Set your own time', mins: null },
          ].map((preset) => {
            const isSelected = mode === 'duration' && preset.mins === durationMinutes;
            return (
              <button
                key={preset.title}
                type="button"
                onClick={() => {
                  if (preset.mins === null) {
                    setMode('duration');
                    customInputRef.current?.focus();
                  } else {
                    applyPresetMinutes(preset.mins);
                  }
                }}
                className={`flex items-center gap-3 rounded-2xl border p-3.5 text-left transition cursor-pointer ${
                  isSelected
                    ? 'border-[#365C4B] dark:border-rose-400 bg-[#F6FBF8] dark:bg-[#281E22] shadow-xs'
                    : 'border-[#EFE2E4] dark:border-[#34262B] bg-white dark:bg-[#191517] hover:border-[#D43753]/40'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-[#FDF2F4] dark:bg-rose-950/60 flex items-center justify-center shrink-0">
                  {preset.mins === null ? (
                    <Settings className="w-4 h-4 text-[#D43753] dark:text-rose-400" />
                  ) : (
                    <Heart className="w-4 h-4 text-[#D43753] dark:text-rose-400" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#1E1417] dark:text-white truncate">
                    {preset.title}
                  </div>
                  <div
                    className={`text-[11px] truncate ${
                      isSelected ? 'text-[#365C4B] dark:text-rose-300 font-semibold' : 'text-[#6E5A5F] dark:text-slate-400'
                    }`}
                  >
                    {preset.sub}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Popular Uses Section */}
      <section
        aria-labelledby="heart-popular-uses-heading"
        className="rounded-3xl bg-[#FDF6F6] dark:bg-[#1E181B] border border-[#F3E1E3] dark:border-[#34262B] p-5 sm:p-6 space-y-4"
      >
        <div>
          <h2
            id="heart-popular-uses-heading"
            className="text-xl font-bold font-serif text-[#1E1417] dark:text-white"
          >
            Popular Uses
          </h2>
          <p className="text-xs text-[#6E5A5F] dark:text-slate-400">
            A heart timer is perfect for many everyday activities.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {[
            {
              title: 'Reading Breaks',
              desc: 'Enjoy a short break with a calm timer.',
              icon: BookOpen,
            },
            {
              title: 'Timed Activities',
              desc: 'Keep track of your daily tasks.',
              icon: Clock,
            },
            {
              title: 'Personal Routines',
              desc: 'Build healthy habits and routines.',
              icon: User,
            },
            {
              title: "Valentine's Day Games",
              desc: 'Make special moments more fun.',
              icon: Heart,
            },
            {
              title: 'Classroom Challenges',
              desc: 'Engage students with a visual timer.',
              icon: GraduationCap,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex items-start gap-3 rounded-2xl border border-[#F3E2E4] dark:border-[#34262B] bg-white dark:bg-[#161214] p-4 shadow-2xs"
              >
                <div className="w-9 h-9 rounded-xl bg-[#FDF2F4] dark:bg-rose-950/60 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-[#D43753] dark:text-rose-400" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs font-bold text-[#1E1417] dark:text-white leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-[#6E5A5F] dark:text-slate-400 leading-snug mt-0.5">
                    {item.desc}
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

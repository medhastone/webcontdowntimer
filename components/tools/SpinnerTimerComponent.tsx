'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Bell,
  Maximize2,
  Minimize2,
  Eye,
  Bookmark,
  Check,
  Settings,
  Timer,
  BookOpen,
  Users,
  Dumbbell,
  Gamepad2,
  Hourglass,
  Target,
} from 'lucide-react';

export type SpinnerThemeId =
  | 'modern-green'
  | 'neon-purple'
  | 'ocean-blue'
  | 'classic-amber'
  | 'sunset-red'
  | 'spectrum';

export type SegmentStyleId = 'standard-blocks' | 'chunky-chapters' | 'fine-dots' | 'smooth-ring';
export type RotationDirection = 'clockwise' | 'counterclockwise';
type TimerMode = 'duration' | 'endTime';

interface SpinnerThemeConfig {
  id: SpinnerThemeId;
  name: string;
  showInCardGrid: boolean;
  dialBgInner: string;
  dialBgOuter: string;
  outerGlowColor: string;
  outerRingStroke: string;
  segmentStart: string;
  segmentEnd: string;
  segmentUnlit: string;
  swatchGradient: string;
}

const SPINNER_THEMES: Record<SpinnerThemeId, SpinnerThemeConfig> = {
  'modern-green': {
    id: 'modern-green',
    name: 'Modern Green',
    showInCardGrid: true,
    dialBgInner: '#183622',
    dialBgOuter: '#0C1A11',
    outerGlowColor: 'rgba(74, 222, 128, 0.45)',
    outerRingStroke: '#4ADE80',
    segmentStart: '#22C55E',
    segmentEnd: '#D9F99D',
    segmentUnlit: '#4B5550',
    swatchGradient: 'linear-gradient(135deg, #4ADE80 0%, #15803D 100%)',
  },
  'neon-purple': {
    id: 'neon-purple',
    name: 'Neon Purple',
    showInCardGrid: true,
    dialBgInner: '#291544',
    dialBgOuter: '#110920',
    outerGlowColor: 'rgba(192, 132, 252, 0.45)',
    outerRingStroke: '#C084FC',
    segmentStart: '#9333EA',
    segmentEnd: '#F0ABFC',
    segmentUnlit: '#4A4458',
    swatchGradient: 'linear-gradient(135deg, #D8B4FE 0%, #6B21A8 100%)',
  },
  'ocean-blue': {
    id: 'ocean-blue',
    name: 'Ocean Blue',
    showInCardGrid: true,
    dialBgInner: '#102C44',
    dialBgOuter: '#081524',
    outerGlowColor: 'rgba(56, 189, 248, 0.45)',
    outerRingStroke: '#38BDF8',
    segmentStart: '#0284C7',
    segmentEnd: '#BAE6FD',
    segmentUnlit: '#435260',
    swatchGradient: 'linear-gradient(135deg, #7DD3FC 0%, #0369A1 100%)',
  },
  'sunset-red': {
    id: 'sunset-red',
    name: 'Sunset Red',
    showInCardGrid: false,
    dialBgInner: '#3B1616',
    dialBgOuter: '#1A0A0A',
    outerGlowColor: 'rgba(248, 113, 113, 0.45)',
    outerRingStroke: '#F87171',
    segmentStart: '#EA580C',
    segmentEnd: '#FCA5A5',
    segmentUnlit: '#574949',
    swatchGradient: 'linear-gradient(135deg, #FCA5A5 0%, #DC2626 100%)',
  },
  'classic-amber': {
    id: 'classic-amber',
    name: 'Classic Amber',
    showInCardGrid: true,
    dialBgInner: '#38260F',
    dialBgOuter: '#1A1107',
    outerGlowColor: 'rgba(251, 191, 36, 0.45)',
    outerRingStroke: '#FBBF24',
    segmentStart: '#D97706',
    segmentEnd: '#FEF08A',
    segmentUnlit: '#575044',
    swatchGradient: 'linear-gradient(135deg, #FDE047 0%, #D97706 100%)',
  },
  spectrum: {
    id: 'spectrum',
    name: 'Spectrum',
    showInCardGrid: false,
    dialBgInner: '#1E293B',
    dialBgOuter: '#0F172A',
    outerGlowColor: 'rgba(56, 189, 248, 0.40)',
    outerRingStroke: '#38BDF8',
    segmentStart: '#22C55E',
    segmentEnd: '#38BDF8',
    segmentUnlit: '#475569',
    swatchGradient:
      'conic-gradient(from 0deg, #EF4444, #F59E0B, #22C55E, #06B6D4, #6366F1, #EC4899, #EF4444)',
  },
};

const SWATCH_ORDER: SpinnerThemeId[] = [
  'modern-green',
  'neon-purple',
  'ocean-blue',
  'sunset-red',
  'classic-amber',
  'spectrum',
];

const CARD_THEMES: SpinnerThemeConfig[] = [
  SPINNER_THEMES['modern-green'],
  SPINNER_THEMES['neon-purple'],
  SPINNER_THEMES['ocean-blue'],
  SPINNER_THEMES['classic-amber'],
];

const STORAGE_KEY = 'timetools_spinner_timer_defaults_v1';

function formatTime(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(
      seconds
    ).padStart(2, '0')}`;
  }
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export default function SpinnerTimerComponent() {
  const [mode, setMode] = useState<TimerMode>('duration');
  const [durationMinutes, setDurationMinutes] = useState<number>(25);
  const [activePreset, setActivePreset] = useState<number | 'custom'>(5);
  const [endTimeStr, setEndTimeStr] = useState<string>(() => {
    const d = new Date(Date.now() + 25 * 60 * 1000);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  });

  const [totalMs, setTotalMs] = useState<number>(25 * 60 * 1000);
  const [remainingMs, setRemainingMs] = useState<number>(25 * 60 * 1000);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const [direction, setDirection] = useState<RotationDirection>('clockwise');
  const [theme, setTheme] = useState<SpinnerThemeId>('modern-green');
  const [segmentStyle, setSegmentStyle] = useState<SegmentStyleId>('standard-blocks');
  const [soundAlert, setSoundAlert] = useState<boolean>(true);
  const [showTime, setShowTime] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [savedToast, setSavedToast] = useState<boolean>(false);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const targetTimestampRef = useRef<number | null>(null);

  // Load saved defaults on mount
  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.durationMinutes && typeof parsed.durationMinutes === 'number') {
            setDurationMinutes(parsed.durationMinutes);
            setTotalMs(parsed.durationMinutes * 60 * 1000);
            setRemainingMs(parsed.durationMinutes * 60 * 1000);
            setActivePreset(
              [1, 3, 5, 10, 25].includes(parsed.durationMinutes) ? parsed.durationMinutes : 'custom'
            );
          }
          if (parsed.theme && SPINNER_THEMES[parsed.theme as SpinnerThemeId]) {
            setTheme(parsed.theme as SpinnerThemeId);
          }
          if (parsed.segmentStyle) {
            setSegmentStyle(parsed.segmentStyle as SegmentStyleId);
          }
          if (parsed.direction === 'clockwise' || parsed.direction === 'counterclockwise') {
            setDirection(parsed.direction);
          }
          if (typeof parsed.soundAlert === 'boolean') {
            setSoundAlert(parsed.soundAlert);
          }
          if (typeof parsed.showTime === 'boolean') {
            setShowTime(parsed.showTime);
          }
        }
      } catch {
        // Ignore storage errors
      }
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  // Pleasant harmonic completion chime using Web Audio API
  const playCompletionChime = useCallback(() => {
    if (!soundAlert) return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.14);

        gain.gain.setValueAtTime(0.0001, ctx.currentTime + idx * 0.14);
        gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + idx * 0.14 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.14 + 0.65);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.14);
        osc.stop(ctx.currentTime + idx * 0.14 + 0.7);
      });
    } catch {
      // Ignore audio errors if blocked by browser autoplay policy
    }
  }, [soundAlert]);

  // High-precision countdown loop (60fps smooth pointer rotation)
  useEffect(() => {
    if (!isRunning) return;

    let rafId: number;
    const tick = () => {
      if (targetTimestampRef.current === null) return;
      const diff = Math.max(0, targetTimestampRef.current - Date.now());
      setRemainingMs(diff);

      if (diff <= 0) {
        setIsRunning(false);
        setIsCompleted(true);
        targetTimestampRef.current = null;
        playCompletionChime();
        return;
      }
      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [isRunning, playCompletionChime]);

  // Sync fullscreen state
  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const applyDurationMinutes = (mins: number, presetTag: number | 'custom') => {
    const clamped = Math.max(1, Math.min(240, mins));
    setDurationMinutes(clamped);
    setActivePreset(presetTag);
    const ms = clamped * 60 * 1000;
    setTotalMs(ms);
    setRemainingMs(ms);
    setIsRunning(false);
    setIsCompleted(false);
    targetTimestampRef.current = null;
  };

  const applyEndTime = (timeValue: string) => {
    setEndTimeStr(timeValue);
    const [hh, mm] = timeValue.split(':').map(Number);
    if (Number.isNaN(hh) || Number.isNaN(mm)) return;

    const now = new Date();
    const target = new Date();
    target.setHours(hh, mm, 0, 0);
    if (target.getTime() <= now.getTime()) {
      target.setDate(target.getDate() + 1);
    }
    const diffMs = Math.max(60 * 1000, target.getTime() - now.getTime());
    setTotalMs(diffMs);
    setRemainingMs(diffMs);
    setDurationMinutes(Math.round(diffMs / 60000));
    setIsRunning(false);
    setIsCompleted(false);
    targetTimestampRef.current = null;
  };

  const handleStart = () => {
    const startMs = remainingMs <= 0 || isCompleted ? totalMs : remainingMs;
    if (remainingMs <= 0 || isCompleted) {
      setRemainingMs(totalMs);
    }
    setIsCompleted(false);
    targetTimestampRef.current = Date.now() + startMs;
    setIsRunning(true);
  };

  const handlePause = () => {
    if (!isRunning) return;
    if (targetTimestampRef.current !== null) {
      const left = Math.max(0, targetTimestampRef.current - Date.now());
      setRemainingMs(left);
    }
    targetTimestampRef.current = null;
    setIsRunning(false);
  };

  const handleResume = () => {
    if (isRunning) return;
    if (remainingMs <= 0 || isCompleted) {
      handleStart();
      return;
    }
    targetTimestampRef.current = Date.now() + remainingMs;
    setIsRunning(true);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsCompleted(false);
    targetTimestampRef.current = null;
    setRemainingMs(totalMs);
  };

  const toggleFullscreen = async () => {
    try {
      if (!isFullscreen && !document.fullscreenElement) {
        setIsFullscreen(true);
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
        try {
          const orientation = window.screen?.orientation as unknown as {
            lock?: (mode: string) => Promise<void>;
          };
          if (orientation?.lock && window.innerWidth <= 900) {
            await orientation.lock('landscape');
          }
        } catch {
          // CSS .timer-fullscreen-stage handles portrait rotation
        }
      } else {
        setIsFullscreen(false);
        try {
          const orientation = window.screen?.orientation as unknown as {
            unlock?: () => void;
          };
          orientation?.unlock?.();
        } catch {
          // ignore
        }
        if (document.fullscreenElement && document.exitFullscreen) {
          await document.exitFullscreen();
        }
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
          durationMinutes,
          theme,
          segmentStyle,
          direction,
          soundAlert,
          showTime,
        })
      );
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 2200);
    } catch {
      // Ignore storage errors
    }
  };

  const activeTheme = SPINNER_THEMES[theme];
  const rawElapsedRatio = totalMs > 0 ? Math.min(1, Math.max(0, (totalMs - remainingMs) / totalMs)) : 0;

  // When idle at 0% before starting, display the signature visual pose from the design (83.3% lit ring with pointer at 2 o'clock / 56 deg)
  // Once started, paused mid-run, or completed, strictly display real measured elapsed progress.
  const isInitialIdle = !isRunning && !isCompleted && remainingMs === totalMs;
  const visualLitFraction = isInitialIdle ? 31 / 36 : isCompleted ? 1 : rawElapsedRatio;

  // Pointer angle in degrees (0 deg = 12 o'clock)
  const pointerAngleDeg = isInitialIdle
    ? direction === 'clockwise'
      ? 55
      : -55
    : isCompleted
    ? 0
    : direction === 'clockwise'
    ? rawElapsedRatio * 360
    : -rawElapsedRatio * 360;

  // Helper to compute segment color along the ring
  const getSegmentColor = (normalizedPos: number, isLit: boolean): string => {
    if (!isLit) return activeTheme.segmentUnlit;
    if (theme === 'spectrum') {
      const hue = Math.round(normalizedPos * 330);
      return `hsl(${hue}, 90%, 58%)`;
    }
    return normalizedPos > 0.55 ? activeTheme.segmentStart : activeTheme.segmentEnd;
  };

  const renderDialSegments = () => {
    if (segmentStyle === 'standard-blocks' || segmentStyle === 'chunky-chapters') {
      const count = segmentStyle === 'standard-blocks' ? 36 : 16;
      const innerR = 148;
      const outerR = 196;
      const gapDeg = segmentStyle === 'standard-blocks' ? 2.4 : 4.5;
      const stepDeg = 360 / count;
      const arcDeg = stepDeg - gapDeg;

      return Array.from({ length: count }).map((_, idx) => {
        // Index 0 starts at 12 o'clock (-90 deg in SVG polar coordinates)
        const orderedIdx = direction === 'clockwise' ? idx : (count - 1 - idx + count) % count;
        const startAngleDeg = -90 + idx * stepDeg + gapDeg / 2;
        const endAngleDeg = startAngleDeg + arcDeg;
        const startRad = (startAngleDeg * Math.PI) / 180;
        const endRad = (endAngleDeg * Math.PI) / 180;

        const x1 = 240 + innerR * Math.cos(startRad);
        const y1 = 240 + innerR * Math.sin(startRad);
        const x2 = 240 + outerR * Math.cos(startRad);
        const y2 = 240 + outerR * Math.sin(startRad);
        const x3 = 240 + outerR * Math.cos(endRad);
        const y3 = 240 + outerR * Math.sin(endRad);
        const x4 = 240 + innerR * Math.cos(endRad);
        const y4 = 240 + innerR * Math.sin(endRad);

        // In initial idle pose, match screenshot where segments from ~2 o'clock clockwise around to 12 o'clock are lit (idx >= 5)
        const isLit = isInitialIdle
          ? idx >= Math.round(count * (5 / 36))
          : orderedIdx / count < visualLitFraction || isCompleted;

        const d = [
          `M ${x1.toFixed(2)} ${y1.toFixed(2)}`,
          `L ${x2.toFixed(2)} ${y2.toFixed(2)}`,
          `A ${outerR} ${outerR} 0 0 1 ${x3.toFixed(2)} ${y3.toFixed(2)}`,
          `L ${x4.toFixed(2)} ${y4.toFixed(2)}`,
          `A ${innerR} ${innerR} 0 0 0 ${x1.toFixed(2)} ${y1.toFixed(2)}`,
          'Z',
        ].join(' ');

        const fill = isLit
          ? theme === 'spectrum'
            ? getSegmentColor(idx / count, true)
            : 'url(#spinnerMainSegmentGrad)'
          : activeTheme.segmentUnlit;

        return (
          <path
            key={idx}
            d={d}
            fill={fill}
            opacity={isLit ? 0.98 : 0.72}
          />
        );
      });
    }

    if (segmentStyle === 'fine-dots') {
      const count = 36;
      const outerR = 186;
      const innerR = 160;
      return Array.from({ length: count }).map((_, idx) => {
        const orderedIdx = direction === 'clockwise' ? idx : (count - 1 - idx + count) % count;
        const deg = -90 + (idx * 360) / count;
        const rad = (deg * Math.PI) / 180;
        const ox = 240 + outerR * Math.cos(rad);
        const oy = 240 + outerR * Math.sin(rad);
        const ix = 240 + innerR * Math.cos(rad);
        const iy = 240 + innerR * Math.sin(rad);

        const isLit = isInitialIdle
          ? idx >= 5
          : orderedIdx / count < visualLitFraction || isCompleted;

        const fill = isLit
          ? theme === 'spectrum'
            ? getSegmentColor(idx / count, true)
            : 'url(#spinnerMainSegmentGrad)'
          : activeTheme.segmentUnlit;

        return (
          <g key={idx}>
            <circle cx={ox} cy={oy} r={6.2} fill={fill} />
            <circle cx={ix} cy={iy} r={4.4} fill={fill} opacity={0.88} />
          </g>
        );
      });
    }

    // Smooth Ring
    const r = 172;
    const circumference = 2 * Math.PI * r;
    const activeRatio = isInitialIdle ? 31 / 36 : visualLitFraction;
    const dashOffset = circumference * (1 - activeRatio);
    const rotationTransform = isInitialIdle
      ? 'rotate(-35 240 240)'
      : direction === 'clockwise'
      ? 'rotate(-90 240 240)'
      : 'translate(480, 0) scale(-1, 1) rotate(-90 240 240)';

    return (
      <g>
        <circle
          cx="240"
          cy="240"
          r={r}
          fill="none"
          stroke={activeTheme.segmentUnlit}
          strokeWidth="36"
          opacity="0.7"
        />
        <circle
          cx="240"
          cy="240"
          r={r}
          fill="none"
          stroke="url(#spinnerMainSegmentGrad)"
          strokeWidth="36"
          strokeLinecap="butt"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transform={rotationTransform}
        />
      </g>
    );
  };

  return (
    <div className="space-y-10">
      {/* MAIN 3-COLUMN INTERACTIVE TOOL CARD */}
      <div className="bg-white dark:bg-[#181D1A] border border-[#E4E1D9] dark:border-[#2A312C] rounded-3xl p-4 sm:p-6 lg:p-7 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-7 items-stretch">
          {/* LEFT COLUMN (lg:col-span-5): Large Central Spinner Stage */}
          <div className="lg:col-span-5 flex flex-col">
            <div
              ref={stageRef}
              className={`relative w-full h-full min-h-[410px] sm:min-h-[455px] rounded-2xl overflow-hidden border border-[#1E3326] shadow-inner flex items-center justify-center bg-[#0C1811] ${
                isFullscreen ? 'timer-fullscreen-stage' : ''
              }`}
              style={{
                background: `radial-gradient(circle at 50% 50%, ${activeTheme.dialBgInner} 0%, ${activeTheme.dialBgOuter} 78%, #070E0A 100%)`,
              }}
            >
              <svg
                viewBox="0 0 480 480"
                className={`w-full h-full select-none ${
                  isFullscreen ? 'w-[86vmin] h-[86vmin] max-w-[680px] max-h-[680px]' : 'max-w-[440px] max-h-[440px]'
                }`}
                shapeRendering="geometricPrecision"
                role="img"
                aria-label={`Spinner Timer showing ${formatTime(remainingMs)} remaining`}
              >
                <defs>
                  {/* Outer neon rim glow */}
                  <radialGradient id="spinnerOuterHalo" cx="50%" cy="50%" r="50%">
                    <stop offset="72%" stopColor={activeTheme.outerRingStroke} stopOpacity="0" />
                    <stop offset="88%" stopColor={activeTheme.outerRingStroke} stopOpacity="0.45" />
                    <stop offset="95%" stopColor={activeTheme.outerRingStroke} stopOpacity="0.18" />
                    <stop offset="100%" stopColor={activeTheme.outerRingStroke} stopOpacity="0" />
                  </radialGradient>

                  {/* Inner dial recessed surface gradient */}
                  <radialGradient id="spinnerInnerFace" cx="50%" cy="45%" r="55%">
                    <stop offset="0%" stopColor={activeTheme.dialBgInner} />
                    <stop offset="75%" stopColor={activeTheme.dialBgOuter} />
                    <stop offset="100%" stopColor="#09110D" />
                  </radialGradient>

                  {/* Lit segment gradient matching reference image (warm lime-yellow top to rich emerald bottom) */}
                  <linearGradient id="spinnerMainSegmentGrad" x1="15%" y1="10%" x2="85%" y2="90%">
                    <stop offset="0%" stopColor={activeTheme.segmentEnd} />
                    <stop offset="52%" stopColor={activeTheme.outerRingStroke} />
                    <stop offset="100%" stopColor={activeTheme.segmentStart} />
                  </linearGradient>

                  {/* Metallic Center Hub Gradient */}
                  <linearGradient id="spinnerHubMetal" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F8FAFC" />
                    <stop offset="28%" stopColor="#94A3B8" />
                    <stop offset="50%" stopColor="#FFFFFF" />
                    <stop offset="75%" stopColor="#475569" />
                    <stop offset="100%" stopColor="#CBD5E1" />
                  </linearGradient>

                  {/* Tapered Needle Metallic Gradient */}
                  <linearGradient id="spinnerNeedleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="50%" stopColor="#F1F5F9" />
                    <stop offset="100%" stopColor="#94A3B8" />
                  </linearGradient>
                </defs>

                {/* Ambient Outer Glow Halo */}
                <circle cx="240" cy="240" r="236" fill="url(#spinnerOuterHalo)" />

                {/* Main Dark Circular Bezel */}
                <circle
                  cx="240"
                  cy="240"
                  r="212"
                  fill="url(#spinnerInnerFace)"
                  stroke={activeTheme.outerRingStroke}
                  strokeWidth="4.5"
                />

                {/* Subtle Inner Rim Line */}
                <circle
                  cx="240"
                  cy="240"
                  r="204"
                  fill="none"
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth="1.2"
                />

                {/* Segmented Progress Track */}
                {renderDialSegments()}

                {/* Inner Dial Center Well Ring */}
                <circle
                  cx="240"
                  cy="240"
                  r="140"
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="1.5"
                />

                {/* Rotating Pointer Needle + Brushed Metallic Center Hub */}
                <g transform={`rotate(${pointerAngleDeg} 240 240)`}>
                  {/* Soft Needle Shadow */}
                  <polygon
                    points="234,244 246,244 241.5,96 238.5,96"
                    fill="rgba(0,0,0,0.55)"
                    transform="translate(3, 5)"
                  />
                  {/* Tapered Metallic Pointer Needle */}
                  <polygon
                    points="233,240 247,240 241.2,94 238.8,94"
                    fill="url(#spinnerNeedleGrad)"
                  />
                </g>

                {/* Brushed Steel Center Cap */}
                <circle
                  cx="240"
                  cy="240"
                  r="27"
                  fill="rgba(0,0,0,0.5)"
                  transform="translate(0, 4)"
                />
                <circle
                  cx="240"
                  cy="240"
                  r="26"
                  fill="url(#spinnerHubMetal)"
                  stroke="rgba(255,255,255,0.6)"
                  strokeWidth="1.5"
                />
                {/* Conical metallic sheen wedges on hub */}
                <path
                  d="M 240 240 L 222 222 A 25 25 0 0 1 258 222 Z"
                  fill="rgba(255,255,255,0.35)"
                />
                <path
                  d="M 240 240 L 222 258 A 25 25 0 0 0 258 258 Z"
                  fill="rgba(15,23,42,0.35)"
                />
                <circle cx="240" cy="240" r="4.5" fill="#334155" />

                {/* Digital Time Readout Inside Dial Below Center Hub */}
                {(showTime || isFullscreen) && (
                  <g>
                    <text
                      x="240"
                      y="324"
                      textAnchor="middle"
                      className="fill-white font-sans font-bold text-[52px] tracking-tight tabular-nums"
                      style={{ fontVariantNumeric: 'tabular-nums' }}
                    >
                      {formatTime(remainingMs)}
                    </text>
                    {!isFullscreen && (
                      <text
                        x="240"
                        y="354"
                        textAnchor="middle"
                        className="fill-white/85 font-sans font-medium text-[20px]"
                      >
                        {isCompleted ? 'Time Up!' : 'Focus Timer'}
                      </text>
                    )}
                  </g>
                )}
              </svg>

              {/* Exit Fullscreen Button when in Fullscreen */}
              {isFullscreen && (
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="absolute top-4 right-4 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/65 hover:bg-black/85 text-white text-xs font-semibold backdrop-blur-xs transition cursor-pointer"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span>Exit Fullscreen</span>
                </button>
              )}
            </div>
          </div>

          {/* MIDDLE COLUMN (lg:col-span-4): Spinner Timer Controls */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-3.5">
            {/* Segmented Mode Tabs: Duration | End Time */}
            <div className="grid grid-cols-2 rounded-xl bg-[#F3F1EC] dark:bg-[#222824] p-1 border border-[#E4E1D9] dark:border-[#2E3630]">
              <button
                type="button"
                onClick={() => setMode('duration')}
                className={`py-2 px-4 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  mode === 'duration'
                    ? 'bg-[#1F7A3A] text-white shadow-xs'
                    : 'text-[#252B27]/80 dark:text-slate-300 hover:text-[#252B27]'
                }`}
              >
                Duration
              </button>
              <button
                type="button"
                onClick={() => setMode('endTime')}
                className={`py-2 px-4 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  mode === 'endTime'
                    ? 'bg-[#1F7A3A] text-white shadow-xs'
                    : 'text-[#252B27]/80 dark:text-slate-300 hover:text-[#252B27]'
                }`}
              >
                End Time
              </button>
            </div>

            {mode === 'duration' ? (
              <>
                {/* 6 Preset Pills: 1 min, 3 min, 5 min, 10 min, 25 min, Custom */}
                <div className="grid grid-cols-6 gap-1.5">
                  {[1, 3, 5, 10, 25].map((m) => {
                    const isSelected = durationMinutes === m && activePreset !== 'custom';
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => applyDurationMinutes(m, m)}
                        className={`py-2 px-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#1F7A3A] text-white border-[#1F7A3A] shadow-2xs'
                            : 'bg-[#F8F7F4] dark:bg-[#222824] text-[#252B27] dark:text-slate-200 border-[#E4E1D9] dark:border-[#2E3630] hover:border-[#1F7A3A]/50'
                        }`}
                      >
                        {m} min
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => {
                      setActivePreset('custom');
                      inputRef.current?.focus();
                    }}
                    className={`py-2 px-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      activePreset === 'custom'
                        ? 'bg-[#1F7A3A] text-white border-[#1F7A3A] shadow-2xs'
                        : 'bg-[#F8F7F4] dark:bg-[#222824] text-[#252B27] dark:text-slate-200 border-[#E4E1D9] dark:border-[#2E3630] hover:border-[#1F7A3A]/50'
                    }`}
                  >
                    Custom
                  </button>
                </div>

                {/* Numeric Duration Input + minutes label */}
                <div className="flex items-center gap-3">
                  <div className="relative w-28">
                    <input
                      ref={inputRef}
                      type="number"
                      min={1}
                      max={240}
                      value={durationMinutes}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (!Number.isNaN(val)) {
                          applyDurationMinutes(val, 'custom');
                        }
                      }}
                      aria-label="Duration in minutes"
                      className="w-full rounded-xl border border-[#D8D4C8] dark:border-[#333C36] bg-white dark:bg-[#1E2420] px-3.5 py-2 text-lg font-bold text-[#252B27] dark:text-white focus:outline-none focus:border-[#1F7A3A]"
                    />
                  </div>
                  <span className="text-sm font-medium text-[#252B27]/80 dark:text-slate-300">
                    minutes
                  </span>
                </div>
              </>
            ) : (
              <div className="space-y-2 py-1">
                <label className="block text-xs font-semibold text-[#252B27]/80 dark:text-slate-300">
                  Count down until clock time:
                </label>
                <input
                  type="time"
                  value={endTimeStr}
                  onChange={(e) => applyEndTime(e.target.value)}
                  className="w-full rounded-xl border border-[#D8D4C8] dark:border-[#333C36] bg-white dark:bg-[#1E2420] px-3.5 py-2 text-base font-bold text-[#252B27] dark:text-white focus:outline-none focus:border-[#1F7A3A]"
                />
              </div>
            )}

            {/* Primary Green Start Button */}
            <button
              type="button"
              onClick={handleStart}
              className="w-full py-3 px-6 rounded-xl bg-[#1F7A3A] hover:bg-[#17612D] text-white font-bold text-base shadow-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start</span>
            </button>

            {/* Secondary Row: Pause | Resume | Reset (matching screenshot) */}
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={handlePause}
                className="py-2.5 px-3 rounded-xl bg-[#F3F1EC] dark:bg-[#232925] hover:bg-[#E7E4DC] dark:hover:bg-[#2C342E] text-[#252B27] dark:text-white font-semibold text-xs sm:text-sm border border-[#E4E1D9] dark:border-[#2E3630] transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </button>
              <button
                type="button"
                onClick={handleResume}
                className="py-2.5 px-3 rounded-xl bg-[#F3F1EC] dark:bg-[#232925] hover:bg-[#E7E4DC] dark:hover:bg-[#2C342E] text-[#252B27] dark:text-white font-semibold text-xs sm:text-sm border border-[#E4E1D9] dark:border-[#2E3630] transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Resume</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="py-2.5 px-3 rounded-xl bg-[#F3F1EC] dark:bg-[#232925] hover:bg-[#E7E4DC] dark:hover:bg-[#2C342E] text-[#252B27] dark:text-white font-semibold text-xs sm:text-sm border border-[#E4E1D9] dark:border-[#2E3630] transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            {/* Rotation Direction Row: Clockwise | Counterclockwise */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <span className="text-xs font-bold text-[#0E2338] dark:text-white">
                Rotation Direction
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setDirection('clockwise')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                    direction === 'clockwise'
                      ? 'bg-[#2E8540] text-white border-[#2E8540] shadow-2xs'
                      : 'bg-[#F3F1EC] dark:bg-[#222824] text-[#252B27] dark:text-slate-200 border-[#E4E1D9] dark:border-[#2E3630]'
                  }`}
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Clockwise</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDirection('counterclockwise')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                    direction === 'counterclockwise'
                      ? 'bg-[#2E8540] text-white border-[#2E8540] shadow-2xs'
                      : 'bg-[#F3F1EC] dark:bg-[#222824] text-[#252B27] dark:text-slate-200 border-[#E4E1D9] dark:border-[#2E3630]'
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Counterclockwise</span>
                </button>
              </div>
            </div>

            {/* Spinner Theme Color Swatches Row */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <span className="text-xs font-bold text-[#0E2338] dark:text-white">
                Spinner Theme
              </span>
              <div className="flex items-center gap-2.5">
                {SWATCH_ORDER.map((tId) => {
                  const sw = SPINNER_THEMES[tId];
                  const isSelected = theme === tId;
                  return (
                    <button
                      key={tId}
                      type="button"
                      onClick={() => setTheme(tId)}
                      title={sw.name}
                      aria-label={`Select ${sw.name} theme`}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform cursor-pointer shadow-xs ${
                        isSelected
                          ? 'ring-2 ring-offset-2 ring-[#1F7A3A] scale-110'
                          : 'opacity-90 hover:opacity-100 hover:scale-105'
                      }`}
                      style={{ background: sw.swatchGradient }}
                    >
                      {isSelected ? (
                        <Check className="w-3.5 h-3.5 text-white drop-shadow" />
                      ) : tId === 'spectrum' ? (
                        <span className="w-3 h-3 rounded-full bg-white/90" />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Utility Toggles Row: Sound Alert | Fullscreen | Show Time */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-[#ECE9E1] dark:border-[#28302B] text-xs font-medium text-[#252B27] dark:text-slate-200">
              {/* Sound Alert */}
              <div className="flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-[#1F7A3A] dark:text-emerald-400" />
                <span>Sound Alert</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={soundAlert}
                  aria-label="Toggle Sound Alert"
                  onClick={() => setSoundAlert((prev) => !prev)}
                  className={`w-9 h-5 rounded-full transition-colors p-0.5 cursor-pointer ${
                    soundAlert ? 'bg-[#1F7A3A]' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
                      soundAlert ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Fullscreen */}
              <button
                type="button"
                onClick={toggleFullscreen}
                className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-[#F3F1EC] dark:hover:bg-[#232925] transition cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5 text-[#1F7A3A] dark:text-emerald-400" />
                <span>Fullscreen</span>
              </button>

              {/* Show Time */}
              <div className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-[#1F7A3A] dark:text-emerald-400" />
                <span>Show Time</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={showTime}
                  aria-label="Toggle Show Time"
                  onClick={() => setShowTime((prev) => !prev)}
                  className={`w-9 h-5 rounded-full transition-colors p-0.5 cursor-pointer ${
                    showTime ? 'bg-[#1F7A3A]' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
                      showTime ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (lg:col-span-3): Spinner Theme Preview Grid & Segment Style Selector */}
          <div className="lg:col-span-3 flex flex-col justify-between space-y-4 border-t lg:border-t-0 lg:border-l border-[#ECE9E1] dark:border-[#28302B] pt-4 lg:pt-0 lg:pl-6">
            <div>
              <h3 className="text-sm font-bold text-[#0E2338] dark:text-white mb-2.5">
                Spinner Theme
              </h3>

              {/* 2x2 Grid of Mini Spinner Theme Cards matching reference image */}
              <div className="grid grid-cols-2 gap-2.5">
                {CARD_THEMES.map((tItem) => {
                  const isSelected = theme === tItem.id;
                  return (
                    <button
                      key={tItem.id}
                      type="button"
                      onClick={() => setTheme(tItem.id)}
                      className={`group rounded-xl overflow-hidden border-2 transition-all text-center bg-white dark:bg-[#1F2521] cursor-pointer ${
                        isSelected
                          ? 'border-[#2E8540] shadow-xs'
                          : 'border-[#E4E1D9] dark:border-[#2E3630] hover:border-[#2E8540]/60'
                      }`}
                    >
                      <div
                        className="h-16 w-full relative overflow-hidden flex items-center justify-center"
                        style={{
                          background: `radial-gradient(circle, ${tItem.dialBgInner} 0%, ${tItem.dialBgOuter} 90%)`,
                        }}
                      >
                        <svg viewBox="0 0 100 68" className="w-full h-full block">
                          <circle
                            cx="50"
                            cy="34"
                            r="26"
                            fill={tItem.dialBgOuter}
                            stroke={tItem.outerRingStroke}
                            strokeWidth="1.5"
                          />
                          {Array.from({ length: 24 }).map((_, i) => {
                            const angle = -90 + (i * 360) / 24;
                            const isLit = i >= 4;
                            return (
                              <line
                                key={i}
                                x1="50"
                                y1="11"
                                x2="50"
                                y2="17"
                                stroke={isLit ? tItem.segmentEnd : tItem.segmentUnlit}
                                strokeWidth="2.4"
                                transform={`rotate(${angle} 50 34)`}
                              />
                            );
                          })}
                          {/* Mini Pointer Needle */}
                          <line
                            x1="50"
                            y1="34"
                            x2="64"
                            y2="22"
                            stroke="#FFFFFF"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <circle cx="50" cy="34" r="3.5" fill="#E2E8F0" />
                        </svg>
                      </div>
                      <div className="py-1.5 px-1 text-[11px] font-semibold text-[#252B27] dark:text-slate-200 truncate">
                        {tItem.name}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Segment Style (4 Circular Style Buttons matching screenshot) */}
            <div>
              <h3 className="text-sm font-bold text-[#0E2338] dark:text-white mb-2.5">
                Segment Style
              </h3>
              <div className="flex items-center justify-between gap-2">
                {[
                  { id: 'standard-blocks' as SegmentStyleId, label: 'Standard Segments' },
                  { id: 'chunky-chapters' as SegmentStyleId, label: 'Bold Segments' },
                  { id: 'fine-dots' as SegmentStyleId, label: 'Dotted Ring' },
                  { id: 'smooth-ring' as SegmentStyleId, label: 'Smooth Ring' },
                ].map((st) => {
                  const isSelected = segmentStyle === st.id;
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setSegmentStyle(st.id)}
                      title={st.label}
                      aria-label={st.label}
                      className={`w-12 h-12 rounded-full transition-all cursor-pointer flex items-center justify-center bg-[#F8FAF8] dark:bg-[#1F2622] border ${
                        isSelected
                          ? 'border-[#1F7A3A] ring-2 ring-[#1F7A3A]/30 scale-105'
                          : 'border-[#E4E1D9] dark:border-[#2E3630] hover:border-[#1F7A3A]/60'
                      }`}
                    >
                      <svg viewBox="0 0 44 44" className="w-10 h-10">
                        {st.id === 'standard-blocks' &&
                          Array.from({ length: 18 }).map((_, i) => {
                            const deg = -90 + (i * 360) / 18;
                            const lit = i >= 3;
                            return (
                              <line
                                key={i}
                                x1="22"
                                y1="5"
                                x2="22"
                                y2="11"
                                stroke={lit ? '#22A047' : '#CBD5E1'}
                                strokeWidth="2.8"
                                transform={`rotate(${deg} 22 22)`}
                              />
                            );
                          })}
                        {st.id === 'chunky-chapters' &&
                          Array.from({ length: 10 }).map((_, i) => {
                            const deg = -90 + (i * 360) / 10;
                            const lit = i >= 2;
                            return (
                              <line
                                key={i}
                                x1="22"
                                y1="5"
                                x2="22"
                                y2="11"
                                stroke={lit ? '#22A047' : '#CBD5E1'}
                                strokeWidth="4.2"
                                transform={`rotate(${deg} 22 22)`}
                              />
                            );
                          })}
                        {st.id === 'fine-dots' &&
                          Array.from({ length: 14 }).map((_, i) => {
                            const deg = (-90 + (i * 360) / 14) * (Math.PI / 180);
                            const ox = 22 + 15.5 * Math.cos(deg);
                            const oy = 22 + 15.5 * Math.sin(deg);
                            const ix = 22 + 11 * Math.cos(deg);
                            const iy = 22 + 11 * Math.sin(deg);
                            const lit = i >= 2;
                            return (
                              <g key={i}>
                                <circle cx={ox} cy={oy} r="1.7" fill={lit ? '#22A047' : '#CBD5E1'} />
                                <circle cx={ix} cy={iy} r="1.3" fill={lit ? '#22A047' : '#CBD5E1'} />
                              </g>
                            );
                          })}
                        {st.id === 'smooth-ring' && (
                          <>
                            <circle
                              cx="22"
                              cy="22"
                              r="14"
                              fill="none"
                              stroke="#CBD5E1"
                              strokeWidth="5"
                            />
                            <circle
                              cx="22"
                              cy="22"
                              r="14"
                              fill="none"
                              stroke="#22A047"
                              strokeWidth="5"
                              strokeDasharray="72 88"
                              transform="rotate(-35 22 22)"
                            />
                          </>
                        )}
                      </svg>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Save as Default Button */}
            <button
              type="button"
              onClick={handleSaveDefault}
              className="w-full py-2.5 px-4 rounded-xl border border-[#2B9368] text-[#1E7A52] dark:text-emerald-400 hover:bg-[#EBF7F2] dark:hover:bg-[#182B24] text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {savedToast ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Saved as Default!</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4" />
                  <span>Save as Default</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* QUICK PRESETS SECTION */}
      <div>
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0E2338] dark:text-white">
          Quick Presets
        </h2>
        <p className="text-xs sm:text-sm text-[#252B27]/75 dark:text-slate-400 mt-0.5 mb-4">
          Start with a common time or set a custom duration.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { mins: 1, label: '1 Minute', sub: 'Quick break' },
            { mins: 3, label: '3 Minutes', sub: 'Short focus' },
            { mins: 5, label: '5 Minutes', sub: 'Mini task' },
            { mins: 10, label: '10 Minutes', sub: 'Deep focus' },
            { mins: 25, label: '25 Minutes', sub: 'Study session' },
          ].map((preset) => {
            const isSelected = activePreset === preset.mins;
            return (
              <button
                key={preset.mins}
                type="button"
                onClick={() => applyDurationMinutes(preset.mins, preset.mins)}
                className={`flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-[#1A201C] border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#2E8540] ring-1 ring-[#2E8540]/30 shadow-xs'
                    : 'border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#2E8540]/60'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-[#EAF6EE] dark:bg-[#192D21] text-[#1F7A3A] dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Timer className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-xs sm:text-sm text-[#0E2338] dark:text-white truncate">
                    {preset.label}
                  </div>
                  <div className="text-[11px] text-[#252B27]/70 dark:text-slate-400 truncate">
                    {preset.sub}
                  </div>
                </div>
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => {
              setActivePreset('custom');
              inputRef.current?.focus();
              inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }}
            className={`flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-[#1A201C] border text-left transition-all cursor-pointer ${
              activePreset === 'custom'
                ? 'border-[#2E8540] ring-1 ring-[#2E8540]/30 shadow-xs'
                : 'border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#2E8540]/60'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-[#EAF6EE] dark:bg-[#192D21] text-[#1F7A3A] dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Settings className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-xs sm:text-sm text-[#0E2338] dark:text-white truncate">
                Custom
              </div>
              <div className="text-[11px] text-[#252B27]/70 dark:text-slate-400 truncate">
                Set your own time
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* POPULAR USES SECTION */}
      <div className="rounded-3xl bg-[#F2F6F2]/80 dark:bg-[#171E19]/60 border border-[#DFE8E0] dark:border-[#263229] p-5 sm:p-6">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0E2338] dark:text-white">
          Popular Uses
        </h2>
        <p className="text-xs sm:text-sm text-[#252B27]/75 dark:text-slate-400 mt-0.5 mb-4">
          A spinner timer is great for many everyday activities.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {[
            {
              title: 'Study Sessions',
              desc: 'Stay focused and productive.',
              mins: 25,
              icon: <BookOpen className="w-5 h-5" />,
            },
            {
              title: 'Group Activities',
              desc: 'Keep activities on time.',
              mins: 10,
              icon: <Users className="w-5 h-5" />,
            },
            {
              title: 'Workouts',
              desc: 'Time your sets and rest periods',
              mins: 3,
              icon: <Dumbbell className="w-5 h-5" />,
            },
            {
              title: 'Classroom Games',
              desc: 'Make learning more engaging',
              mins: 5,
              icon: <Gamepad2 className="w-5 h-5" />,
            },
            {
              title: 'Activity Transitions',
              desc: 'Manage time between tasks.',
              mins: 1,
              icon: <Hourglass className="w-5 h-5" />,
            },
            {
              title: 'Timed Challenges',
              desc: 'Add a clear time limit to any task.',
              mins: 5,
              icon: <Target className="w-5 h-5" />,
            },
          ].map((useItem) => (
            <button
              key={useItem.title}
              type="button"
              onClick={() =>
                applyDurationMinutes(
                  useItem.mins,
                  [1, 3, 5, 10, 25].includes(useItem.mins) ? useItem.mins : 'custom'
                )
              }
              className="flex items-start gap-3 p-3.5 rounded-2xl bg-white dark:bg-[#1A201C] border border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#1F7A3A] transition-all text-left cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-[#EAF6EE] dark:bg-[#192D21] text-[#1F7A3A] dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                {useItem.icon}
              </div>
              <div className="min-w-0">
                <div className="font-bold text-xs sm:text-sm text-[#0E2338] dark:text-white group-hover:text-[#1F7A3A] transition-colors">
                  {useItem.title}
                </div>
                <div className="text-[11px] text-[#252B27]/70 dark:text-slate-400 leading-snug mt-0.5">
                  {useItem.desc}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

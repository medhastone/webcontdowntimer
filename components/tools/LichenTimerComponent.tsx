'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Bell,
  Maximize2,
  Minimize2,
  Eye,
  Bookmark,
  Settings,
  BookOpen,
  GraduationCap,
  Palette,
  Sprout,
  Users,
  Check,
  Sparkles,
} from 'lucide-react';

type LichenThemeId = 'forest-rock' | 'tree-bark' | 'coastal-stone' | 'autumn-lichen';
type StoneBgStyleId = 'granite-crevice' | 'weathered-limestone' | 'woodland-slate' | 'ancient-bark';

interface LichenThemeConfig {
  id: LichenThemeId;
  label: string;
  mossDeep: string;
  mossMid: string;
  mossBright: string;
  thallusBase: string;
  thallusLobe: string;
  thallusRim: string;
  cupOuter: string;
  cupInner: string;
  sporeHighlight: string;
}

interface StoneBgConfig {
  id: StoneBgStyleId;
  label: string;
  stoneBase: string;
  stoneDark: string;
  stoneLight: string;
  creviceColor: string;
  grainColor: string;
}

const LICHEN_THEMES: Record<LichenThemeId, LichenThemeConfig> = {
  'forest-rock': {
    id: 'forest-rock',
    label: 'Forest Rock',
    mossDeep: '#1E3F20',
    mossMid: '#3B6E38',
    mossBright: '#6B9E58',
    thallusBase: '#5A7D6A',
    thallusLobe: '#8EB39C',
    thallusRim: '#C4DEC9',
    cupOuter: '#A47551',
    cupInner: '#D49B4B',
    sporeHighlight: '#DCEFE0',
  },
  'tree-bark': {
    id: 'tree-bark',
    label: 'Tree Bark',
    mossDeep: '#2A4226',
    mossMid: '#4E703F',
    mossBright: '#82A665',
    thallusBase: '#6E8276',
    thallusLobe: '#A3B8AA',
    thallusRim: '#DAE5DD',
    cupOuter: '#8C583A',
    cupInner: '#C87D4B',
    sporeHighlight: '#EEF5F0',
  },
  'coastal-stone': {
    id: 'coastal-stone',
    label: 'Coastal Stone',
    mossDeep: '#244240',
    mossMid: '#3D6E65',
    mossBright: '#72A38F',
    thallusBase: '#5C7680',
    thallusLobe: '#8FAAB3',
    thallusRim: '#C9DCE0',
    cupOuter: '#B58938',
    cupInner: '#E5B84B',
    sporeHighlight: '#F0F7F4',
  },
  'autumn-lichen': {
    id: 'autumn-lichen',
    label: 'Autumn Lichen',
    mossDeep: '#3A3820',
    mossMid: '#5E6132',
    mossBright: '#8C8E4B',
    thallusBase: '#6E755F',
    thallusLobe: '#9EA88D',
    thallusRim: '#CFD6C1',
    cupOuter: '#9C4427',
    cupInner: '#DF7A3E',
    sporeHighlight: '#F5E6D3',
  },
};

const STONE_BACKGROUNDS: Record<StoneBgStyleId, StoneBgConfig> = {
  'granite-crevice': {
    id: 'granite-crevice',
    label: 'Granite Crevice',
    stoneBase: '#4A4944',
    stoneDark: '#2F2E2A',
    stoneLight: '#66645E',
    creviceColor: '#1E1D1A',
    grainColor: '#7A7770',
  },
  'weathered-limestone': {
    id: 'weathered-limestone',
    label: 'Weathered Limestone',
    stoneBase: '#636058',
    stoneDark: '#42403A',
    stoneLight: '#807C72',
    creviceColor: '#292723',
    grainColor: '#969186',
  },
  'woodland-slate': {
    id: 'woodland-slate',
    label: 'Woodland Slate',
    stoneBase: '#3D4441',
    stoneDark: '#262B29',
    stoneLight: '#545E59',
    creviceColor: '#171A19',
    grainColor: '#6D7A74',
  },
  'ancient-bark': {
    id: 'ancient-bark',
    label: 'Ancient Bark',
    stoneBase: '#4E4035',
    stoneDark: '#332921',
    stoneLight: '#6B5849',
    creviceColor: '#211A14',
    grainColor: '#856E5C',
  },
};

const STORAGE_KEY = 'timetools_lichen_timer_prefs_v1';

// Deterministic Lichen Colony Patches (x, y, baseRadius, threshold, rotation, type)
interface LichenColonyNode {
  id: number;
  cx: number;
  cy: number;
  radius: number;
  threshold: number; // 0.0 (edge starter patches) -> 0.85 (center stone completion)
  rotation: number;
  kind: 'foliose' | 'moss' | 'rosette';
  hasCups: boolean;
}

const LICHEN_COLONIES: LichenColonyNode[] = [
  // Outer perimeter starter colonies (visible right from the start and in idle preview)
  { id: 1, cx: 430, cy: 55, radius: 68, threshold: 0.0, rotation: 15, kind: 'moss', hasCups: false },
  { id: 2, cx: 455, cy: 135, radius: 64, threshold: 0.0, rotation: 42, kind: 'foliose', hasCups: true },
  { id: 3, cx: 365, cy: 48, radius: 58, threshold: 0.02, rotation: -20, kind: 'rosette', hasCups: true },
  { id: 4, cx: 445, cy: 235, radius: 72, threshold: 0.04, rotation: 68, kind: 'foliose', hasCups: true },
  { id: 5, cx: 448, cy: 335, radius: 76, threshold: 0.06, rotation: 112, kind: 'moss', hasCups: false },
  { id: 6, cx: 380, cy: 375, radius: 66, threshold: 0.08, rotation: -45, kind: 'foliose', hasCups: true },
  { id: 7, cx: 295, cy: 382, radius: 64, threshold: 0.10, rotation: 28, kind: 'rosette', hasCups: true },
  { id: 8, cx: 195, cy: 388, radius: 60, threshold: 0.13, rotation: 85, kind: 'moss', hasCups: false },
  { id: 9, cx: 95, cy: 378, radius: 68, threshold: 0.16, rotation: -60, kind: 'foliose', hasCups: true },
  { id: 10, cx: 38, cy: 320, radius: 58, threshold: 0.19, rotation: 18, kind: 'rosette', hasCups: false },
  { id: 11, cx: 45, cy: 70, radius: 52, threshold: 0.22, rotation: -35, kind: 'moss', hasCups: false },

  // Mid-ring spreading colonies (grow across crevices from 25% to 65% elapsed)
  { id: 12, cx: 375, cy: 145, radius: 62, threshold: 0.25, rotation: 50, kind: 'rosette', hasCups: true },
  { id: 13, cx: 378, cy: 265, radius: 65, threshold: 0.29, rotation: -15, kind: 'foliose', hasCups: true },
  { id: 14, cx: 295, cy: 315, radius: 60, threshold: 0.33, rotation: 125, kind: 'moss', hasCups: false },
  { id: 15, cx: 175, cy: 325, radius: 64, threshold: 0.37, rotation: -75, kind: 'rosette', hasCups: true },
  { id: 16, cx: 285, cy: 88, radius: 56, threshold: 0.41, rotation: 32, kind: 'foliose', hasCups: true },
  { id: 17, cx: 105, cy: 265, radius: 58, threshold: 0.45, rotation: -42, kind: 'moss', hasCups: false },
  { id: 18, cx: 92, cy: 160, radius: 56, threshold: 0.49, rotation: 94, kind: 'foliose', hasCups: true },
  { id: 19, cx: 175, cy: 82, radius: 58, threshold: 0.53, rotation: -12, kind: 'rosette', hasCups: false },
  { id: 20, cx: 320, cy: 205, radius: 62, threshold: 0.57, rotation: 64, kind: 'foliose', hasCups: true },

  // Inner stone heart colonies (complete the full organic coverage from 60% to 100% elapsed)
  { id: 21, cx: 245, cy: 265, radius: 64, threshold: 0.62, rotation: -28, kind: 'rosette', hasCups: true },
  { id: 22, cx: 168, cy: 235, radius: 60, threshold: 0.67, rotation: 45, kind: 'moss', hasCups: false },
  { id: 23, cx: 255, cy: 148, radius: 62, threshold: 0.72, rotation: -55, kind: 'foliose', hasCups: true },
  { id: 24, cx: 178, cy: 155, radius: 60, threshold: 0.77, rotation: 110, kind: 'rosette', hasCups: true },
  { id: 25, cx: 238, cy: 205, radius: 68, threshold: 0.82, rotation: 15, kind: 'foliose', hasCups: true },
];

// Botanical Lichen Rosette Icon for Quick Presets
function LichenRosetteIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none">
      <circle cx="16" cy="16" r="13" fill="#4A6B49" opacity="0.22" />
      <path
        d="M16 4 C19 4, 21 7, 20 9 C23 8, 26 10, 25 13 C28 14, 28 18, 25 19 C26 22, 23 25, 20 24 C21 26, 18 28, 16 28 C14 28, 11 26, 12 24 C9 25, 6 22, 7 19 C4 18, 4 14, 7 13 C6 10, 9 8, 12 9 C11 7, 13 4, 16 4 Z"
        fill="#4E7349"
        stroke="#2E4E2B"
        strokeWidth="1.2"
      />
      <path
        d="M16 8 C18 8, 19 10, 18.5 11.5 C20.5 11, 22 12.5, 21.5 14.5 C23 15.5, 23 17.5, 21 18.5 C21.5 20.5, 19.5 22, 18 21 C17.5 22.5, 16.5 23.5, 16 23.5 C15.5 23.5, 14.5 22.5, 14 21 C12.5 22, 10.5 20.5, 11 18.5 C9 17.5, 9 15.5, 10.5 14.5 C10 12.5, 11.5 11, 13.5 11.5 C13 10, 14 8, 16 8 Z"
        fill="#88AD84"
      />
      <circle cx="15" cy="15" r="2" fill="#C88A4B" />
      <circle cx="18" cy="17.5" r="1.5" fill="#C88A4B" />
      <circle cx="13.5" cy="18" r="1.4" fill="#A3C49F" />
    </svg>
  );
}

export default function LichenTimerComponent() {
  // Mode & Duration State (Default 25 minutes matching 25:00 in reference screenshot)
  const [mode, setMode] = useState<'duration' | 'endTime'>('duration');
  const [selectedPreset, setSelectedPreset] = useState<number | 'custom'>(25);
  const [customMinutes, setCustomMinutes] = useState<number>(25);
  const [endTimeStr, setEndTimeStr] = useState<string>('17:00');

  const [totalMs, setTotalMs] = useState<number>(25 * 60 * 1000);
  const [remainingMs, setRemainingMs] = useState<number>(25 * 60 * 1000);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [hasStartedOnce, setHasStartedOnce] = useState<boolean>(false);

  // Customization & Toggles State
  const [lichenTheme, setLichenTheme] = useState<LichenThemeId>('forest-rock');
  const [stoneBg, setStoneBg] = useState<StoneBgStyleId>('granite-crevice');
  const [soundAlert, setSoundAlert] = useState<boolean>(true);
  const [showTime, setShowTime] = useState<boolean>(true);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [savedToast, setSavedToast] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const customInputRef = useRef<HTMLInputElement>(null);
  const endTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  // Load saved preferences from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setTimeout(() => {
          if (parsed.lichenTheme && LICHEN_THEMES[parsed.lichenTheme as LichenThemeId]) {
            setLichenTheme(parsed.lichenTheme);
          }
          if (parsed.stoneBg && STONE_BACKGROUNDS[parsed.stoneBg as StoneBgStyleId]) {
            setStoneBg(parsed.stoneBg);
          }
          if (typeof parsed.soundAlert === 'boolean') setSoundAlert(parsed.soundAlert);
          if (typeof parsed.showTime === 'boolean') setShowTime(parsed.showTime);
          if (typeof parsed.reducedMotion === 'boolean') setReducedMotion(parsed.reducedMotion);
          if (typeof parsed.customMinutes === 'number' && parsed.customMinutes >= 1) {
            setCustomMinutes(parsed.customMinutes);
            setTotalMs(parsed.customMinutes * 60 * 1000);
            setRemainingMs(parsed.customMinutes * 60 * 1000);
          }
        }, 0);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const handleSaveDefault = () => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          lichenTheme,
          stoneBg,
          soundAlert,
          showTime,
          reducedMotion,
          customMinutes,
        })
      );
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 2200);
    } catch {
      // Ignore storage errors
    }
  };

  // Earthy Woodland Chime on Completion
  const playCompletionSound = useCallback(() => {
    if (!soundAlert) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const notes = [329.63, 392.0, 493.88, 659.25]; // E4, G4, B4, E5 warm acoustic forest chord
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.18);
        gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.18);
        gain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + idx * 0.18 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.18 + 1.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.18);
        osc.stop(ctx.currentTime + idx * 0.18 + 1.3);
      });
    } catch {
      // Ignore audio block
    }
  }, [soundAlert]);

  // High-precision RAF Countdown Loop
  useEffect(() => {
    if (!isRunning) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    const tick = () => {
      if (!endTimeRef.current) return;
      const now = performance.now();
      const left = Math.max(0, endTimeRef.current - now);
      setRemainingMs(left);

      if (left <= 0) {
        setIsRunning(false);
        setIsCompleted(true);
        endTimeRef.current = null;
        playCompletionSound();
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isRunning, playCompletionSound]);

  // Fullscreen listener
  useEffect(() => {
    const onFsChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

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

  // Controls
  const handleStart = () => {
    if (remainingMs <= 0) {
      endTimeRef.current = performance.now() + totalMs;
      setRemainingMs(totalMs);
      setIsCompleted(false);
    } else {
      endTimeRef.current = performance.now() + remainingMs;
    }
    setHasStartedOnce(true);
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
    endTimeRef.current = null;
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsCompleted(false);
    setHasStartedOnce(false);
    endTimeRef.current = null;
    setRemainingMs(totalMs);
  };

  const applyDurationMinutes = (mins: number, presetTag: number | 'custom') => {
    const clamped = Math.max(1, Math.min(999, mins));
    setSelectedPreset(presetTag);
    setCustomMinutes(clamped);
    const ms = clamped * 60 * 1000;
    setIsRunning(false);
    setIsCompleted(false);
    setHasStartedOnce(false);
    endTimeRef.current = null;
    setTotalMs(ms);
    setRemainingMs(ms);
  };

  const handleEndTimeChange = (val: string) => {
    setEndTimeStr(val);
    const [hh, mm] = val.split(':').map(Number);
    if (isNaN(hh) || isNaN(mm)) return;
    const now = new Date();
    const target = new Date();
    target.setHours(hh, mm, 0, 0);
    if (target.getTime() <= now.getTime()) {
      target.setDate(target.getDate() + 1);
    }
    const diffMs = Math.max(60 * 1000, target.getTime() - now.getTime());
    setIsRunning(false);
    setIsCompleted(false);
    setHasStartedOnce(false);
    endTimeRef.current = null;
    setTotalMs(diffMs);
    setRemainingMs(diffMs);
  };

  // Elapsed & Remaining ratios
  const remainingRatio = totalMs > 0 ? Math.max(0, Math.min(1, remainingMs / totalMs)) : 0;
  const elapsedRatio = 1 - remainingRatio;

  // In idle state before clicking Start, show ~0.48 growth (matching the diagonal right-and-bottom lichen spread in the reference screenshot).
  // Once started, growthProgress moves smoothly from 0 -> 1 in lockstep with elapsedRatio!
  const growthProgress = hasStartedOnce ? (isCompleted ? 1 : elapsedRatio) : 0.48;

  // Format MM:SS or HH:MM:SS
  const formattedTime = useMemo(() => {
    const totalSecs = Math.ceil(remainingMs / 1000);
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    if (hrs > 0) {
      return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }, [remainingMs]);

  const activeTheme = LICHEN_THEMES[lichenTheme];
  const activeStone = STONE_BACKGROUNDS[stoneBg];

  return (
    <div className="space-y-8">
      {/* ===================================================================== */}
      {/* MAIN INTERACTIVE 3-COLUMN LICHEN TIMER CARD                           */}
      {/* ===================================================================== */}
      <div
        ref={containerRef}
        className="rounded-3xl bg-white/95 dark:bg-[#171C18] border border-[#E2DFD7] dark:border-slate-800 shadow-[0_14px_40px_rgba(30,45,32,0.08)] p-4 sm:p-6 transition-all"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch w-full">
          {/* ----------------------------------------------------------------- */}
          {/* LEFT COLUMN: NATURAL STONE & SPREADING LICHEN SCENE (5 cols)      */}
          {/* ----------------------------------------------------------------- */}
          <div className="lg:col-span-5 flex flex-col">
            <div
              className={`relative w-full aspect-square sm:aspect-[4/3.85] lg:aspect-auto lg:flex-1 min-h-[370px] rounded-2xl overflow-hidden select-none shadow-inner border border-stone-300/80 dark:border-stone-800 ${
                isFullscreen ? 'timer-fullscreen-stage' : ''
              }`}
              style={{
                backgroundColor: activeStone.stoneBase,
              }}
            >
              {/* Fullscreen quick toggle / exit button in top-right corner */}
              <button
                type="button"
                onClick={toggleFullscreen}
                title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                className={`absolute top-4 right-4 z-30 transition-colors cursor-pointer ${
                  isFullscreen
                    ? 'inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-black/65 hover:bg-black/85 text-white text-xs font-semibold backdrop-blur-xs'
                    : 'p-2 rounded-xl bg-black/25 hover:bg-black/40 text-white backdrop-blur-md'
                }`}
              >
                {isFullscreen ? (
                  <>
                    <Minimize2 className="w-4 h-4" />
                    <span>Exit Fullscreen</span>
                  </>
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </button>

              {/* =============================================================== */}
              {/* SVG NATURAL STONE/BARK SURFACE & SPREADING LICHEN COLONIES       */}
              {/* =============================================================== */}
              <svg
                viewBox="0 0 480 420"
                className="absolute inset-0 w-full h-full pointer-events-none"
                preserveAspectRatio="xMidYMid slice"
              >
                <defs>
                  {/* Stone Base Radial Shading */}
                  <radialGradient id="stoneLighting" cx="35%" cy="35%" r="75%">
                    <stop offset="0%" stopColor={activeStone.stoneLight} />
                    <stop offset="55%" stopColor={activeStone.stoneBase} />
                    <stop offset="100%" stopColor={activeStone.stoneDark} />
                  </radialGradient>

                  {/* Organic Shadow Filter for Lichen Thallus */}
                  <filter id="lichenDepthShadow" x="-15%" y="-15%" width="130%" height="130%">
                    <feDropShadow dx="0" dy="2.5" stdDeviation="3" floodColor="rgba(0,0,0,0.42)" />
                  </filter>
                </defs>

                {/* Base Natural Stone / Bark Surface */}
                <rect x="0" y="0" width="480" height="420" fill="url(#stoneLighting)" />

                {/* Tactile Stone Facets & Mineral Patches */}
                <polygon points="0,0 210,0 165,135 0,185" fill={activeStone.stoneLight} opacity="0.28" />
                <polygon points="210,0 480,0 480,190 295,165 165,135" fill={activeStone.stoneDark} opacity="0.24" />
                <polygon points="0,185 165,135 245,275 110,420 0,420" fill={activeStone.stoneBase} opacity="0.35" />
                <polygon points="165,135 295,165 360,310 245,275" fill={activeStone.stoneLight} opacity="0.18" />

                {/* Natural Stone Crevices & Cracks (like reference photo) */}
                <g stroke={activeStone.creviceColor} strokeLinecap="round" fill="none">
                  <path
                    d="M 185 0 L 168 62 L 122 115 L 62 148 L 0 182"
                    strokeWidth="4.5"
                    opacity="0.7"
                  />
                  <path
                    d="M 168 62 L 228 118 L 255 195 L 222 285 L 155 365 L 118 420"
                    strokeWidth="3.5"
                    opacity="0.65"
                  />
                  <path
                    d="M 228 118 L 325 98 L 415 125 L 480 110"
                    strokeWidth="3"
                    opacity="0.55"
                  />
                  <path
                    d="M 255 195 L 348 232 L 435 215"
                    strokeWidth="2.8"
                    opacity="0.5"
                  />
                  <path
                    d="M 122 115 L 145 215 L 65 295 L 0 318"
                    strokeWidth="2.5"
                    opacity="0.5"
                  />
                </g>

                {/* Subtle Mineral Speckles on Uncovered Stone */}
                {[
                  [45, 42, 3],
                  [88, 68, 2.2],
                  [132, 38, 3.5],
                  [62, 118, 2.5],
                  [118, 168, 3],
                  [48, 232, 2.8],
                  [95, 215, 2],
                  [195, 165, 2.6],
                  [148, 265, 3.2],
                  [215, 72, 2.4],
                  [275, 145, 2.8],
                ].map(([sx, sy, sr], idx) => (
                  <circle
                    key={idx}
                    cx={sx}
                    cy={sy}
                    r={sr}
                    fill={activeStone.grainColor}
                    opacity="0.45"
                  />
                ))}

                {/* ============================================================= */}
                {/* SPREADING ORGANIC LICHEN & MOSS COLONIES                      */}
                {/* ============================================================= */}
                <g filter="url(#lichenDepthShadow)">
                  {LICHEN_COLONIES.map((colony) => {
                    // Each colony begins emerging at its threshold and reaches full size over a 0.26 span
                    const localRaw = (growthProgress - colony.threshold) / 0.26;
                    const colonyScale = Math.max(0, Math.min(1, localRaw));
                    if (colonyScale <= 0.01) return null;

                    const r = colony.radius * (0.28 + 0.72 * colonyScale);

                    return (
                      <g
                        key={colony.id}
                        transform={`translate(${colony.cx}, ${colony.cy}) rotate(${colony.rotation}) scale(${colonyScale.toFixed(3)})`}
                        opacity={Math.min(1, colonyScale * 1.35)}
                      >
                        {colony.kind === 'moss' ? (
                          /* Velvety Forest Moss Cushion Cluster */
                          <g>
                            <circle cx="0" cy="0" r={r * 0.92} fill={activeTheme.mossDeep} />
                            <circle cx={-r * 0.25} cy={-r * 0.18} r={r * 0.68} fill={activeTheme.mossMid} />
                            <circle cx={r * 0.28} cy={r * 0.2} r={r * 0.62} fill={activeTheme.mossMid} />
                            <circle cx={r * 0.15} cy={-r * 0.28} r={r * 0.52} fill={activeTheme.mossBright} />
                            <circle cx={-r * 0.2} cy={r * 0.26} r={r * 0.48} fill={activeTheme.mossBright} />
                            {/* Fine mossy tufts */}
                            <circle cx={-r * 0.08} cy={-r * 0.05} r={r * 0.35} fill={activeTheme.thallusLobe} opacity="0.6" />
                          </g>
                        ) : colony.kind === 'foliose' ? (
                          /* Ruffled Foliose Lichen Thallus with Lobed Margins & Apothecia Cups */
                          <g>
                            {/* Outer Dark Moss Shadow Base */}
                            <circle cx="0" cy="0" r={r * 0.96} fill={activeTheme.mossDeep} opacity="0.85" />
                            {/* 8 Ruffled Foliose Lobes */}
                            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                              <g key={deg} transform={`rotate(${deg})`}>
                                <ellipse
                                  cx={r * 0.46}
                                  cy="0"
                                  rx={r * 0.48}
                                  ry={r * 0.34}
                                  fill={activeTheme.thallusBase}
                                  stroke={activeTheme.thallusRim}
                                  strokeWidth="2.2"
                                />
                                <ellipse
                                  cx={r * 0.36}
                                  cy={-r * 0.05}
                                  rx={r * 0.34}
                                  ry={r * 0.22}
                                  fill={activeTheme.thallusLobe}
                                />
                              </g>
                            ))}
                            {/* Inner Crinkled Thallus Core */}
                            <circle
                              cx="0"
                              cy="0"
                              r={r * 0.45}
                              fill={activeTheme.thallusLobe}
                              stroke={activeTheme.thallusRim}
                              strokeWidth="1.8"
                            />
                            {/* Warm Amber/Terracotta Lichen Apothecia Cups */}
                            {colony.hasCups && (
                              <g>
                                <circle
                                  cx={-r * 0.14}
                                  cy={-r * 0.1}
                                  r={r * 0.14}
                                  fill={activeTheme.cupInner}
                                  stroke={activeTheme.thallusRim}
                                  strokeWidth="2"
                                />
                                <circle
                                  cx={r * 0.18}
                                  cy={r * 0.12}
                                  r={r * 0.11}
                                  fill={activeTheme.cupOuter}
                                  stroke={activeTheme.thallusRim}
                                  strokeWidth="1.6"
                                />
                                <circle
                                  cx={r * 0.05}
                                  cy={-r * 0.22}
                                  r={r * 0.09}
                                  fill={activeTheme.cupInner}
                                  stroke={activeTheme.thallusRim}
                                  strokeWidth="1.4"
                                />
                              </g>
                            )}
                          </g>
                        ) : (
                          /* Crustose / Rosette Lichen Medallion */
                          <g>
                            <circle cx="0" cy="0" r={r * 0.9} fill={activeTheme.thallusBase} />
                            {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((deg) => (
                              <g key={deg} transform={`rotate(${deg})`}>
                                <circle
                                  cx={r * 0.56}
                                  cy="0"
                                  r={r * 0.28}
                                  fill={activeTheme.thallusLobe}
                                  stroke={activeTheme.sporeHighlight}
                                  strokeWidth="1.6"
                                />
                              </g>
                            ))}
                            <circle cx="0" cy="0" r={r * 0.5} fill={activeTheme.mossMid} />
                            <circle cx={-r * 0.12} cy={r * 0.08} r={r * 0.26} fill={activeTheme.thallusRim} />
                            {colony.hasCups && (
                              <>
                                <circle
                                  cx={r * 0.1}
                                  cy={-r * 0.08}
                                  r={r * 0.13}
                                  fill={activeTheme.cupInner}
                                  stroke={activeTheme.sporeHighlight}
                                  strokeWidth="1.8"
                                />
                                <circle
                                  cx={-r * 0.16}
                                  cy={-r * 0.14}
                                  r={r * 0.09}
                                  fill={activeTheme.cupOuter}
                                  stroke={activeTheme.sporeHighlight}
                                  strokeWidth="1.4"
                                />
                              </>
                            )}
                          </g>
                        )}
                      </g>
                    );
                  })}
                </g>

                {/* Subtle Dappled Forest Sunlight Overlay */}
                <radialGradient id="dappledSunlight" cx="75%" cy="20%" r="70%">
                  <stop offset="0%" stopColor="rgba(255, 250, 220, 0.18)" />
                  <stop offset="60%" stopColor="rgba(255, 250, 220, 0.04)" />
                  <stop offset="100%" stopColor="rgba(0, 0, 0, 0.22)" />
                </radialGradient>
                <rect x="0" y="0" width="480" height="420" fill="url(#dappledSunlight)" />
              </svg>

              {/* Center Digital Countdown Readout */}
              {(showTime || isFullscreen) && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center pointer-events-none px-4">
                  <div
                    className={`font-extrabold tracking-tight text-white tabular-nums ${
                      isFullscreen
                        ? 'text-6xl sm:text-7xl md:text-8xl lg:text-9xl'
                        : 'text-5xl sm:text-6xl'
                    }`}
                    style={{
                      textShadow: '0 4px 20px rgba(0, 0, 0, 0.65), 0 1px 4px rgba(0, 0, 0, 0.75)',
                    }}
                  >
                    {formattedTime}
                  </div>
                  {!isFullscreen && (
                    <div
                      className="text-sm sm:text-base font-medium text-white/95 mt-1.5 tracking-wide"
                      style={{
                        textShadow: '0 2px 10px rgba(0, 0, 0, 0.75)',
                      }}
                    >
                      {isCompleted ? 'Surface Fully Covered' : 'Focus Time'}
                    </div>
                  )}
                </div>
              )}

              {/* Live Lichen Growth Progress Pill when active (normal mode only) */}
              {hasStartedOnce && !isFullscreen && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full bg-black/45 backdrop-blur-xs text-white text-[11px] font-semibold tracking-wide flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Lichen Coverage: {Math.round(growthProgress * 100)}%</span>
                </div>
              )}
            </div>
          </div>

          {/* ----------------------------------------------------------------- */}
          {/* MIDDLE COLUMN: DURATION / END TIME & CONTROLS (4 cols)            */}
          {/* ----------------------------------------------------------------- */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              {/* Duration / End Time Tabs */}
              <div className="grid grid-cols-2 rounded-xl bg-[#ECECE7] dark:bg-slate-800/90 p-1 border border-[#DFDFD8] dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setMode('duration')}
                  className={`py-2.5 text-sm font-bold rounded-lg transition-all cursor-pointer ${
                    mode === 'duration'
                      ? 'bg-[#2E5A36] text-white shadow-xs'
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  Duration
                </button>
                <button
                  type="button"
                  onClick={() => setMode('endTime')}
                  className={`py-2.5 text-sm font-bold rounded-lg transition-all cursor-pointer ${
                    mode === 'endTime'
                      ? 'bg-[#2E5A36] text-white shadow-xs'
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  End Time
                </button>
              </div>

              {mode === 'duration' ? (
                <>
                  {/* 6 Duration Preset Pills: 1 min, 3 min, 5 min, 10 min, 25 min, Custom */}
                  <div className="grid grid-cols-6 gap-1.5">
                    {[1, 3, 5, 10, 25].map((m) => {
                      const isSelected = selectedPreset === m;
                      return (
                        <button
                          key={m}
                          type="button"
                          onClick={() => applyDurationMinutes(m, m)}
                          className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#2E5A36] text-white border-[#2E5A36] shadow-xs'
                              : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-[#2E5A36]/60'
                          }`}
                        >
                          {m} min
                        </button>
                      );
                    })}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPreset('custom');
                        customInputRef.current?.focus();
                      }}
                      className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        selectedPreset === 'custom'
                          ? 'bg-[#2E5A36] text-white border-[#2E5A36] shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-[#2E5A36]/60'
                      }`}
                    >
                      Custom
                    </button>
                  </div>

                  {/* Custom Minutes Input Row */}
                  <div className="flex items-center gap-3 pt-1">
                    <div className="relative w-32">
                      <input
                        ref={customInputRef}
                        type="number"
                        min={1}
                        max={999}
                        value={customMinutes}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          if (!isNaN(val)) {
                            applyDurationMinutes(val, 'custom');
                          }
                        }}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-lg font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2E5A36]"
                      />
                    </div>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      minutes
                    </span>
                  </div>
                </>
              ) : (
                <div className="space-y-2 py-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Count down until clock time:
                  </label>
                  <input
                    type="time"
                    value={endTimeStr}
                    onChange={(e) => handleEndTimeChange(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-lg font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2E5A36]"
                  />
                </div>
              )}

              {/* Primary Start Button */}
              <button
                type="button"
                onClick={isRunning ? handlePause : handleStart}
                className="w-full py-3.5 px-6 rounded-xl bg-[#2E5A36] hover:bg-[#24482B] active:scale-[0.99] text-white font-bold text-base shadow-md shadow-[#2E5A36]/25 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                {isRunning ? (
                  <>
                    <Pause className="w-5 h-5 fill-current" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" />
                    <span>Start</span>
                  </>
                )}
              </button>

              {/* Secondary Pause & Reset Row */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={isRunning ? handlePause : handleStart}
                  className="py-2.5 px-4 rounded-xl bg-[#ECECE7] dark:bg-slate-800 hover:bg-[#E2E2DA] dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm transition-colors flex items-center justify-center gap-2 border border-[#DFDFD8] dark:border-slate-700 cursor-pointer"
                >
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pause</span>
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="py-2.5 px-4 rounded-xl bg-[#ECECE7] dark:bg-slate-800 hover:bg-[#E2E2DA] dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm transition-colors flex items-center justify-center gap-2 border border-[#DFDFD8] dark:border-slate-700 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Bottom Controls Row: Sound Alert | Fullscreen | Show Time | Reduced Motion */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <div className="flex flex-wrap items-center justify-between gap-2">
                {/* Sound Alert */}
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <Bell className="w-4 h-4 text-[#2E5A36] dark:text-emerald-400" />
                  <span>Sound Alert</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={soundAlert}
                    onClick={() => setSoundAlert(!soundAlert)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                      soundAlert ? 'bg-[#2E5A36]' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition-transform ${
                        soundAlert ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </label>

                {/* Fullscreen */}
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-[#2E5A36] dark:text-emerald-400" />
                  <span>Fullscreen</span>
                </button>

                {/* Show Time */}
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <Eye className="w-4 h-4 text-[#2E5A36] dark:text-emerald-400" />
                  <span>Show Time</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={showTime}
                    onClick={() => setShowTime(!showTime)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                      showTime ? 'bg-[#2E5A36]' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition-transform ${
                        showTime ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </label>
              </div>

              {/* Reduced Motion Option */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-100/80 dark:border-slate-800/60">
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Reduced Motion
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={reducedMotion}
                  onClick={() => setReducedMotion(!reducedMotion)}
                  className={`relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    reducedMotion ? 'bg-[#2E5A36]' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-xs transition-transform ${
                      reducedMotion ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* ----------------------------------------------------------------- */}
          {/* RIGHT COLUMN: LICHEN THEME & BACKGROUND STYLE (3 cols)            */}
          {/* ----------------------------------------------------------------- */}
          <div className="lg:col-span-3 flex flex-col justify-between rounded-2xl bg-[#F8F8F5] dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 p-4 space-y-4">
            {/* Lichen Theme 2x2 Selector */}
            <div>
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2.5">
                Lichen Theme
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
                {(Object.values(LICHEN_THEMES) as LichenThemeConfig[]).map((theme) => {
                  const isSelected = lichenTheme === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setLichenTheme(theme.id)}
                      className={`group rounded-xl overflow-hidden border-2 transition-all text-center bg-white dark:bg-slate-800 p-1 cursor-pointer ${
                        isSelected
                          ? 'border-[#2E5A36] shadow-xs'
                          : 'border-transparent hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      {/* Mini Illustrated Lichen on Stone Thumbnail */}
                      <div
                        className="w-full h-14 rounded-lg relative overflow-hidden"
                        style={{
                          background:
                            theme.id === 'forest-rock'
                              ? 'linear-gradient(135deg, #4A4944 0%, #2F2E2A 100%)'
                              : theme.id === 'tree-bark'
                              ? 'linear-gradient(135deg, #5C4738 0%, #382B21 100%)'
                              : theme.id === 'coastal-stone'
                              ? 'linear-gradient(135deg, #525B60 0%, #32383C 100%)'
                              : 'linear-gradient(135deg, #4F453B 0%, #2E2722 100%)',
                        }}
                      >
                        <svg viewBox="0 0 80 50" className="w-full h-full">
                          <path d="M12 0 L34 26 L8 50" stroke="rgba(0,0,0,0.35)" strokeWidth="1.5" fill="none" />
                          <circle cx="58" cy="14" r="14" fill={theme.mossMid} />
                          <circle cx="52" cy="28" r="15" fill={theme.thallusLobe} stroke={theme.thallusRim} strokeWidth="1.5" />
                          <circle cx="65" cy="36" r="12" fill={theme.mossBright} />
                          <circle cx="34" cy="38" r="11" fill={theme.thallusBase} stroke={theme.thallusRim} strokeWidth="1.2" />
                          <circle cx="54" cy="27" r="3" fill={theme.cupInner} />
                          <circle cx="48" cy="31" r="2.2" fill={theme.cupOuter} />
                        </svg>
                      </div>
                      <span className="block text-[11px] font-semibold text-slate-800 dark:text-slate-200 mt-1 pb-0.5 truncate">
                        {theme.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Background Style Circular Stone Swatches */}
            <div>
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2.5">
                Background Style
              </h3>
              <div className="flex items-center justify-between gap-2 px-1">
                {(Object.values(STONE_BACKGROUNDS) as StoneBgConfig[]).map((bg) => {
                  const isSelected = stoneBg === bg.id;
                  return (
                    <button
                      key={bg.id}
                      type="button"
                      onClick={() => setStoneBg(bg.id)}
                      title={bg.label}
                      className={`w-11 h-11 rounded-full p-0.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'ring-2 ring-[#2E5A36] ring-offset-2 dark:ring-offset-slate-900 scale-105'
                          : 'opacity-85 hover:opacity-100'
                      }`}
                    >
                      <span
                        className="block w-full h-full rounded-full shadow-inner relative overflow-hidden"
                        style={{
                          background: `radial-gradient(circle at 35% 35%, ${bg.stoneLight} 0%, ${bg.stoneBase} 60%, ${bg.stoneDark} 100%)`,
                        }}
                      >
                        <span
                          className="absolute bottom-0 right-0 w-5 h-5 rounded-full opacity-85"
                          style={{ backgroundColor: activeTheme.mossMid }}
                        />
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Save as Default Button */}
            <button
              type="button"
              onClick={handleSaveDefault}
              className="w-full py-2.5 px-3 rounded-xl border border-[#2E5A36]/40 dark:border-emerald-500/40 bg-white dark:bg-slate-800 hover:bg-emerald-50/50 dark:hover:bg-slate-700 text-[#2E5A36] dark:text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {savedToast ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Saved as Default!</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4 text-[#2E5A36] dark:text-emerald-400" />
                  <span>Save as Default</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* QUICK PRESETS SECTION                                                 */}
      {/* ===================================================================== */}
      <div>
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          Quick Presets
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5 mb-4">
          Start with a common time or set a custom duration.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { mins: 1, title: '1 Minute', sub: 'Quick break', tag: 1 as const },
            { mins: 3, title: '3 Minutes', sub: 'Short focus', tag: 3 as const },
            { mins: 5, title: '5 Minutes', sub: 'Study session', tag: 5 as const },
            { mins: 10, title: '10 Minutes', sub: 'Deep work', tag: 10 as const },
            { mins: 25, title: '25 Minutes', sub: 'Longer session', tag: 25 as const },
          ].map((preset) => {
            const active = selectedPreset === preset.tag;
            return (
              <button
                key={preset.mins}
                type="button"
                onClick={() => applyDurationMinutes(preset.mins, preset.tag)}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                  active
                    ? 'bg-white dark:bg-slate-800 border-[#2E5A36] shadow-xs ring-1 ring-[#2E5A36]/30'
                    : 'bg-white/90 dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800 hover:border-[#2E5A36]/50'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-[#F0F4F0] dark:bg-emerald-950/50 flex items-center justify-center shrink-0">
                  <LichenRosetteIcon className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                    {preset.title}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {preset.sub}
                  </div>
                </div>
              </button>
            );
          })}

          {/* Custom Preset Card */}
          <button
            type="button"
            onClick={() => {
              setSelectedPreset('custom');
              setMode('duration');
              customInputRef.current?.focus();
            }}
            className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
              selectedPreset === 'custom'
                ? 'bg-white dark:bg-slate-800 border-[#2E5A36] shadow-xs ring-1 ring-[#2E5A36]/30'
                : 'bg-white/90 dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800 hover:border-[#2E5A36]/50'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-[#F0F4F0] dark:bg-emerald-950/50 text-[#2E5A36] dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Settings className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                Custom
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                Set your own time
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* POPULAR USES SECTION                                                  */}
      {/* ===================================================================== */}
      <div>
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          Popular Uses
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5 mb-4">
          A lichen timer is great for many everyday activities.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {[
            {
              title: 'Reading Time',
              desc: 'Enjoy a calm and focused reading session.',
              icon: BookOpen,
              mins: 20,
            },
            {
              title: 'Study Sessions',
              desc: 'Stay on track with your study goals.',
              icon: GraduationCap,
              mins: 25,
            },
            {
              title: 'Creative Work',
              desc: 'A peaceful timer for creative tasks.',
              icon: Palette,
              mins: 30,
            },
            {
              title: 'Mindful Moments',
              desc: 'Relax, breathe and stay present.',
              icon: Sprout,
              mins: 5,
            },
            {
              title: 'Classroom Activities',
              desc: 'Help with smooth transitions.',
              icon: Users,
              mins: 10,
            },
            {
              title: 'Personal Routines',
              desc: 'Build better habits with a nature timer.',
              icon: Sprout,
              mins: 15,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.title}
                type="button"
                onClick={() =>
                  applyDurationMinutes(
                    item.mins,
                    [1, 3, 5, 10, 25].includes(item.mins) ? item.mins : 'custom'
                  )
                }
                className="p-3.5 rounded-2xl bg-white/95 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 hover:border-[#2E5A36]/50 text-left transition-all flex items-start gap-3 cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-[#F0F4F0] dark:bg-emerald-950/50 text-[#2E5A36] dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5">
                    {item.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

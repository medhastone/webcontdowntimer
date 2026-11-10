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
  Users,
  Palette,
  Flower2,
  RefreshCw,
  Check,
  Sparkles,
} from 'lucide-react';

type CoralThemeId = 'tropical' | 'deep-ocean' | 'colorful-reef' | 'minimal';
type BackgroundStyleId = 'sunlit-reef' | 'emerald-lagoon' | 'sunset-glow' | 'twilight-reef';

interface CoralThemeConfig {
  id: CoralThemeId;
  label: string;
  coralBase: string;
  coralMid: string;
  coralTip: string;
  coralHighlight: string;
  secondaryCoralLeft: string;
  secondaryCoralRight: string;
  anemoneColor: string;
  accentHex: string;
}

interface BackgroundStyleConfig {
  id: BackgroundStyleId;
  label: string;
  skyTop: string;
  waterUpper: string;
  waterMid: string;
  waterDeep: string;
  rayColor: string;
  sandLight: string;
  sandDark: string;
}

const CORAL_THEMES: Record<CoralThemeId, CoralThemeConfig> = {
  tropical: {
    id: 'tropical',
    label: 'Tropical Coral',
    coralBase: '#C83B3B',
    coralMid: '#F35B4F',
    coralTip: '#FF9E80',
    coralHighlight: '#FFC4B0',
    secondaryCoralLeft: '#E06377',
    secondaryCoralRight: '#9B4DCA',
    anemoneColor: '#FF8A65',
    accentHex: '#F35B4F',
  },
  'deep-ocean': {
    id: 'deep-ocean',
    label: 'Deep Ocean',
    coralBase: '#0E5E6F',
    coralMid: '#22A699',
    coralTip: '#64DFDF',
    coralHighlight: '#A6F6F1',
    secondaryCoralLeft: '#5E60CE',
    secondaryCoralRight: '#7400B8',
    anemoneColor: '#48BFE3',
    accentHex: '#188FA7',
  },
  'colorful-reef': {
    id: 'colorful-reef',
    label: 'Colorful Reef',
    coralBase: '#9D174D',
    coralMid: '#EC4899',
    coralTip: '#F472B6',
    coralHighlight: '#FBCFE8',
    secondaryCoralLeft: '#F59E0B',
    secondaryCoralRight: '#8B5CF6',
    anemoneColor: '#F43F5E',
    accentHex: '#DB2777',
  },
  minimal: {
    id: 'minimal',
    label: 'Minimal Coral',
    coralBase: '#D96B52',
    coralMid: '#F28F79',
    coralTip: '#F9B9A8',
    coralHighlight: '#FDE2DC',
    secondaryCoralLeft: '#E5989B',
    secondaryCoralRight: '#B5838D',
    anemoneColor: '#F4A261',
    accentHex: '#E07A5F',
  },
};

const BACKGROUND_STYLES: Record<BackgroundStyleId, BackgroundStyleConfig> = {
  'sunlit-reef': {
    id: 'sunlit-reef',
    label: 'Sunlit Reef',
    skyTop: '#24B4DF',
    waterUpper: '#0E8AC8',
    waterMid: '#0A67A3',
    waterDeep: '#094375',
    rayColor: 'rgba(186, 244, 255, 0.24)',
    sandLight: '#E9CFA8',
    sandDark: '#C6A375',
  },
  'emerald-lagoon': {
    id: 'emerald-lagoon',
    label: 'Emerald Lagoon',
    skyTop: '#2DD4BF',
    waterUpper: '#0D9488',
    waterMid: '#0F766E',
    waterDeep: '#115E59',
    rayColor: 'rgba(167, 243, 208, 0.22)',
    sandLight: '#E6D5B8',
    sandDark: '#BEA57D',
  },
  'sunset-glow': {
    id: 'sunset-glow',
    label: 'Sunset Glow',
    skyTop: '#FB923C',
    waterUpper: '#E15B64',
    waterMid: '#843B72',
    waterDeep: '#3B2854',
    rayColor: 'rgba(254, 215, 170, 0.25)',
    sandLight: '#E8C5A5',
    sandDark: '#B88B68',
  },
  'twilight-reef': {
    id: 'twilight-reef',
    label: 'Twilight Reef',
    skyTop: '#6366F1',
    waterUpper: '#4338CA',
    waterMid: '#312E81',
    waterDeep: '#1E1B4B',
    rayColor: 'rgba(199, 210, 254, 0.20)',
    sandLight: '#C7B8CE',
    sandDark: '#8E7C99',
  },
};

const STORAGE_KEY = 'timetools_coral_timer_prefs_v1';

// Small Coral Branch Icon SVG for Quick Presets
function CoralBranchIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21V10" />
      <path d="M12 15C9 15 7 13 7 9.5C7 8 7.5 7 7.5 7" />
      <path d="M12 13C15 13 17 11 17 7.5C17 6 16.5 5 16.5 5" />
      <path d="M12 10C12 7 10.5 5 9.5 4" />
      <path d="M12 10C12 7.5 13.5 6 14.5 4.5" />
      <path d="M7 11C5.5 11 4.5 9.8 4.5 8.2" />
      <path d="M17 9.5C18.5 9.5 19.5 8.2 19.5 6.8" />
      <path d="M8 21H16" />
    </svg>
  );
}

export default function CoralTimerComponent() {
  // Mode & Time State (Default 25 minutes as shown in reference screenshot 25:00)
  const [mode, setMode] = useState<'duration' | 'endTime'>('duration');
  const [selectedPreset, setSelectedPreset] = useState<number | 'custom'>(5);
  const [customMinutes, setCustomMinutes] = useState<number>(25);
  const [endTimeStr, setEndTimeStr] = useState<string>('17:00');

  const [totalMs, setTotalMs] = useState<number>(25 * 60 * 1000);
  const [remainingMs, setRemainingMs] = useState<number>(25 * 60 * 1000);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [hasStartedOnce, setHasStartedOnce] = useState<boolean>(false);

  // Customization & Options State
  const [coralTheme, setCoralTheme] = useState<CoralThemeId>('tropical');
  const [bgStyle, setBgStyle] = useState<BackgroundStyleId>('sunlit-reef');
  const [soundAlert, setSoundAlert] = useState<boolean>(true);
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
          if (parsed.coralTheme && CORAL_THEMES[parsed.coralTheme as CoralThemeId]) {
            setCoralTheme(parsed.coralTheme);
          }
          if (parsed.bgStyle && BACKGROUND_STYLES[parsed.bgStyle as BackgroundStyleId]) {
            setBgStyle(parsed.bgStyle);
          }
          if (typeof parsed.soundAlert === 'boolean') setSoundAlert(parsed.soundAlert);
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

  // Save preferences
  const handleSaveDefault = () => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          coralTheme,
          bgStyle,
          soundAlert,
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

  // Gentle Underwater Chime on Completion
  const playCompletionSound = useCallback(() => {
    if (!soundAlert) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const notes = [392.0, 493.88, 587.33, 783.99]; // G4, B4, D5, G5 peaceful ocean harp chord
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.16);
        gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.16);
        gain.gain.exponentialRampToValueAtTime(0.16, ctx.currentTime + idx * 0.16 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.16 + 1.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.16);
        osc.stop(ctx.currentTime + idx * 0.16 + 1.2);
      });
    } catch {
      // Ignore audio block
    }
  }, [soundAlert]);

  // Accurate RAF Countdown Loop
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

  // Fullscreen sync
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

  // Before starting (idle preview), show the full coral (1.0) so the page matches the reference screenshot.
  // Once started (isRunning or paused mid-countdown), growthProgress reflects exact elapsedRatio (0 -> 1).
  const growthProgress = hasStartedOnce ? (isCompleted ? 1 : elapsedRatio) : 1;

  // Visual scale & branch reveal factor:
  // Starts from a young 0.22 coral sprout at 0% elapsed and grows smoothly to 1.00 full coral at 100% elapsed.
  const coralScale = 0.22 + 0.78 * growthProgress;

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

  const activeTheme = CORAL_THEMES[coralTheme];
  const activeBg = BACKGROUND_STYLES[bgStyle];

  // Helper to compute individual branch scale as growthProgress increases
  const getBranchScale = (threshold: number, span = 0.22) => {
    if (!hasStartedOnce) return 1;
    const raw = (growthProgress - threshold) / span;
    return Math.max(0, Math.min(1, raw));
  };

  return (
    <div className="space-y-8">
      {/* ===================================================================== */}
      {/* MAIN INTERACTIVE 3-COLUMN CORAL TIMER CARD                            */}
      {/* ===================================================================== */}
      <div
        ref={containerRef}
        className="rounded-3xl bg-white/95 dark:bg-[#151D26] border border-[#E5DFD7] dark:border-slate-800 shadow-[0_14px_40px_rgba(12,55,90,0.08)] p-4 sm:p-6 transition-all"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch w-full">
          {/* ----------------------------------------------------------------- */}
          {/* LEFT COLUMN: UNDERWATER CORAL GROWTH VISUALIZATION (5 cols)       */}
          {/* ----------------------------------------------------------------- */}
          <div className="lg:col-span-5 flex flex-col">
            <div
              className={`relative w-full aspect-square sm:aspect-[4/3.85] lg:aspect-auto lg:flex-1 min-h-[370px] rounded-2xl overflow-hidden select-none shadow-inner border border-sky-200/60 dark:border-sky-900/40 ${
                isFullscreen ? 'timer-fullscreen-stage' : ''
              }`}
              style={{
                background: `linear-gradient(180deg, ${activeBg.skyTop} 0%, ${activeBg.waterUpper} 32%, ${activeBg.waterMid} 68%, ${activeBg.waterDeep} 86%, ${activeBg.sandLight} 100%)`,
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
                    : 'p-2 rounded-xl bg-white/20 hover:bg-white/35 text-white backdrop-blur-md'
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

              {/* Sunbeams from top center */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `
                    conic-gradient(
                      from 142deg at 50% -12%,
                      transparent 0deg,
                      ${activeBg.rayColor} 10deg,
                      transparent 20deg,
                      ${activeBg.rayColor} 32deg,
                      transparent 44deg,
                      ${activeBg.rayColor} 58deg,
                      transparent 74deg
                    )
                  `,
                }}
              />

              {/* Top surface water shimmer */}
              <div
                className="absolute top-0 inset-x-0 h-16 pointer-events-none opacity-65"
                style={{
                  background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.65) 0%, transparent 72%)',
                }}
              />

              {/* Gentle rising water bubbles */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[
                  { left: '14%', bottom: '28%', size: 8, dur: '6.5s', delay: '0s' },
                  { left: '22%', bottom: '45%', size: 12, dur: '8s', delay: '1.2s' },
                  { left: '34%', bottom: '62%', size: 6, dur: '7s', delay: '2.1s' },
                  { left: '68%', bottom: '52%', size: 10, dur: '7.5s', delay: '0.7s' },
                  { left: '78%', bottom: '35%', size: 14, dur: '9s', delay: '1.8s' },
                  { left: '84%', bottom: '68%', size: 7, dur: '6.8s', delay: '2.6s' },
                  { left: '48%', bottom: '74%', size: 9, dur: '8.2s', delay: '0.4s' },
                ].map((b, i) => (
                  <span
                    key={i}
                    className="absolute rounded-full border border-white/50 bg-white/20"
                    style={{
                      left: b.left,
                      bottom: b.bottom,
                      width: b.size,
                      height: b.size,
                      boxShadow: 'inset 1px 1px 3px rgba(255,255,255,0.8)',
                      animation:
                        isRunning && !reducedMotion
                          ? `coralBubbleFloat ${b.dur} ease-in-out ${b.delay} infinite`
                          : 'none',
                    }}
                  />
                ))}
              </div>

              {/* Digital Countdown Display in Upper-Center */}
              <div className="relative z-20 pt-10 sm:pt-12 flex flex-col items-center text-center pointer-events-none">
                <div
                  className={`font-extrabold tracking-tight text-white tabular-nums ${
                    isFullscreen
                      ? 'text-[clamp(3.25rem,14vmin,9rem)] leading-none'
                      : 'text-5xl sm:text-6xl'
                  }`}
                  style={{
                    textShadow: '0 4px 18px rgba(6, 40, 75, 0.38)',
                  }}
                >
                  {formattedTime}
                </div>
                {!isFullscreen && (
                  <div
                    className="text-sm sm:text-base font-medium text-white/95 mt-1 tracking-wide"
                    style={{
                      textShadow: '0 2px 8px rgba(6, 40, 75, 0.4)',
                    }}
                  >
                    {isCompleted
                      ? 'Coral Fully Grown!'
                      : isRunning
                      ? 'Growing Coral...'
                      : 'Focus Time'}
                  </div>
                )}
              </div>

              {/* =============================================================== */}
              {/* SVG UNDERWATER REEF, SWIMMING FISH & GROWING CORAL STRUCTURE    */}
              {/* =============================================================== */}
              <svg
                viewBox="0 0 500 420"
                className="absolute inset-0 w-full h-full pointer-events-none"
                preserveAspectRatio="xMidYMax slice"
              >
                <defs>
                  {/* Main Coral Gradient */}
                  <linearGradient id="mainCoralGrad" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor={activeTheme.coralBase} />
                    <stop offset="52%" stopColor={activeTheme.coralMid} />
                    <stop offset="90%" stopColor={activeTheme.coralTip} />
                    <stop offset="100%" stopColor={activeTheme.coralHighlight} />
                  </linearGradient>

                  {/* Left Secondary Reef Coral */}
                  <linearGradient id="leftCoralGrad" x1="0" y1="1" x2="1" y2="0">
                    <stop offset="0%" stopColor={activeTheme.coralBase} />
                    <stop offset="100%" stopColor={activeTheme.secondaryCoralLeft} />
                  </linearGradient>

                  {/* Right Secondary Reef Coral */}
                  <linearGradient id="rightCoralGrad" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor="#4A2574" />
                    <stop offset="100%" stopColor={activeTheme.secondaryCoralRight} />
                  </linearGradient>

                  {/* Sandy Seabed Gradient */}
                  <linearGradient id="seabedSandGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={activeBg.sandLight} />
                    <stop offset="100%" stopColor={activeBg.sandDark} />
                  </linearGradient>

                  {/* Soft Glow Filter for Coral Tips */}
                  <filter id="coralSoftGlow" x="-15%" y="-15%" width="130%" height="130%">
                    <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="rgba(0,0,0,0.22)" />
                  </filter>
                </defs>

                {/* Distant Underwater Reef Silhouettes */}
                <path
                  d="M0 355 Q65 320 135 348 Q220 330 310 350 Q405 318 500 345 L500 420 L0 420 Z"
                  fill={activeBg.waterDeep}
                  opacity="0.55"
                />

                {/* Left Background Seaweed & Reef */}
                <g opacity={0.45 + 0.55 * getBranchScale(0.05, 0.35)}>
                  <path
                    d="M28 375 Q14 330 30 292 Q42 260 24 228"
                    stroke="#1D8A72"
                    strokeWidth="9"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M48 380 Q35 340 52 308 Q64 282 48 255"
                    stroke="#28A98B"
                    strokeWidth="7"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* Left Purple/Pink Tube Coral */}
                  <path
                    d="M15 382 C10 345, 22 315, 16 298 C24 295, 32 320, 35 352 C42 325, 55 304, 62 308 C68 314, 54 352, 50 382 Z"
                    fill="url(#leftCoralGrad)"
                  />
                  {/* Left Pink Anemone Bush */}
                  <ellipse cx="78" cy="368" rx="34" ry="18" fill={activeTheme.secondaryCoralLeft} opacity="0.88" />
                  <ellipse cx="68" cy="362" rx="22" ry="12" fill={activeTheme.coralTip} opacity="0.75" />
                </g>

                {/* Right Background Seaweed & Reef */}
                <g opacity={0.45 + 0.55 * getBranchScale(0.1, 0.35)}>
                  <path
                    d="M472 378 Q486 334 468 295 Q454 265 474 232"
                    stroke="#1D8A72"
                    strokeWidth="9"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M448 382 Q462 345 446 314 Q435 288 452 264"
                    stroke="#28A98B"
                    strokeWidth="7"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* Right Purple Reef Cluster */}
                  <path
                    d="M485 385 C490 348, 476 315, 482 296 C472 294, 464 322, 460 350 C454 322, 440 302, 432 308 C425 315, 440 352, 446 385 Z"
                    fill="url(#rightCoralGrad)"
                  />
                  <ellipse cx="422" cy="370" rx="32" ry="16" fill={activeTheme.secondaryCoralRight} opacity="0.85" />
                </g>

                {/* Sandy Ocean Floor */}
                <path
                  d="M0 372 Q125 356 250 366 Q380 376 500 362 L500 420 L0 420 Z"
                  fill="url(#seabedSandGrad)"
                />
                {/* Sand Ripples & Pebbles */}
                <ellipse cx="115" cy="396" rx="38" ry="4.5" fill={activeBg.sandDark} opacity="0.45" />
                <ellipse cx="375" cy="398" rx="45" ry="5" fill={activeBg.sandDark} opacity="0.45" />
                <ellipse cx="250" cy="406" rx="64" ry="5.5" fill={activeBg.sandDark} opacity="0.4" />
                <circle cx="88" cy="388" r="5" fill="#A0825A" opacity="0.6" />
                <circle cx="408" cy="390" r="6" fill="#A0825A" opacity="0.6" />
                <circle cx="152" cy="402" r="4" fill="#94764E" opacity="0.55" />

                {/* ============================================================= */}
                {/* CENTRAL GROWING CORAL STRUCTURE (Proportional to Elapsed Time) */}
                {/* ============================================================= */}
                <g
                  transform={`translate(250, 378) scale(${coralScale.toFixed(4)}) translate(-250, -378)`}
                  filter="url(#coralSoftGlow)"
                >
                  {/* Stage 1 (Always visible base & core trunk) */}
                  <g>
                    {/* Main central trunk & primary fork */}
                    <path
                      d="M238 380 C238 352, 242 328, 240 298 C238 272, 224 248, 214 222 C210 212, 219 207, 225 216 C235 234, 245 256, 250 278 C255 252, 268 228, 280 206 C285 196, 295 202, 290 213 C278 238, 265 264, 262 296 C260 326, 263 352, 264 380 Z"
                      fill="url(#mainCoralGrad)"
                    />
                    {/* Center-top antlers */}
                    <path
                      d="M246 286 C244 252, 238 218, 236 192 C235 182, 245 180, 247 190 C250 212, 252 242, 254 275 Z"
                      fill="url(#mainCoralGrad)"
                    />
                    <path
                      d="M250 264 C254 234, 262 204, 266 184 C268 175, 278 178, 275 188 C270 212, 260 240, 256 270 Z"
                      fill="url(#mainCoralGrad)"
                    />
                  </g>

                  {/* Stage 2 Branches (Unfurl between 10% -> 45% elapsed) */}
                  <g
                    opacity={getBranchScale(0.08, 0.28)}
                    transform={`translate(250, 340) scale(${getBranchScale(0.08, 0.28).toFixed(3)}) translate(-250, -340)`}
                  >
                    {/* Left sweeping major limb */}
                    <path
                      d="M244 344 C218 330, 188 304, 168 272 C156 252, 146 228, 144 210 C143 200, 154 198, 157 208 C162 228, 174 252, 192 274 C208 294, 228 312, 246 326 Z"
                      fill="url(#mainCoralGrad)"
                    />
                    {/* Left-mid upward sub-branch */}
                    <path
                      d="M196 288 C188 262, 184 234, 186 208 C187 198, 197 199, 197 209 C196 232, 200 258, 208 282 Z"
                      fill="url(#mainCoralGrad)"
                    />
                    {/* Right sweeping major limb */}
                    <path
                      d="M256 344 C282 330, 312 304, 332 272 C344 252, 354 228, 356 210 C357 200, 346 198, 343 208 C338 228, 326 252, 308 274 C292 294, 272 312, 254 326 Z"
                      fill="url(#mainCoralGrad)"
                    />
                    {/* Right-mid upward sub-branch */}
                    <path
                      d="M304 288 C312 262, 316 234, 314 208 C313 198, 303 199, 303 209 C304 232, 300 258, 292 282 Z"
                      fill="url(#mainCoralGrad)"
                    />
                  </g>

                  {/* Stage 3 Branches (Unfurl between 32% -> 68% elapsed) */}
                  <g
                    opacity={getBranchScale(0.30, 0.30)}
                    transform={`translate(250, 320) scale(${getBranchScale(0.30, 0.30).toFixed(3)}) translate(-250, -320)`}
                  >
                    {/* Outer Left Lower Fan */}
                    <path
                      d="M238 358 C202 350, 162 332, 134 302 C120 288, 110 268, 106 250 C104 240, 114 237, 118 247 C125 268, 140 288, 162 306 C186 325, 214 338, 242 346 Z"
                      fill="url(#mainCoralGrad)"
                    />
                    <path
                      d="M154 308 C142 288, 135 264, 135 242 C135 233, 145 233, 146 242 C147 262, 154 284, 166 302 Z"
                      fill="url(#mainCoralGrad)"
                    />
                    {/* Outer Right Lower Fan */}
                    <path
                      d="M262 358 C298 350, 338 332, 366 302 C380 288, 390 268, 394 250 C396 240, 386 237, 382 247 C375 268, 360 288, 338 306 C314 325, 286 338, 258 346 Z"
                      fill="url(#mainCoralGrad)"
                    />
                    <path
                      d="M346 308 C358 288, 365 264, 365 242 C365 233, 355 233, 354 242 C353 262, 346 284, 334 302 Z"
                      fill="url(#mainCoralGrad)"
                    />
                    {/* Upper Crown Forks */}
                    <path
                      d="M222 232 C210 214, 202 195, 202 178 C202 170, 211 169, 212 177 C214 192, 220 208, 230 224 Z"
                      fill="url(#mainCoralGrad)"
                    />
                    <path
                      d="M282 226 C294 208, 302 190, 302 174 C302 166, 293 165, 292 173 C290 188, 284 204, 274 220 Z"
                      fill="url(#mainCoralGrad)"
                    />
                  </g>

                  {/* Stage 4 Crown Tips & Glowing Coral Polyps (Unfurl between 58% -> 95% elapsed) */}
                  <g
                    opacity={getBranchScale(0.55, 0.38)}
                    transform={`translate(250, 280) scale(${getBranchScale(0.55, 0.38).toFixed(3)}) translate(-250, -280)`}
                  >
                    {/* Fine secondary twigs */}
                    <path
                      d="M172 256 C162 242, 158 225, 160 208 C161 201, 169 202, 169 209 C168 222, 172 236, 180 248 Z"
                      fill="url(#mainCoralGrad)"
                    />
                    <path
                      d="M328 256 C338 242, 342 225, 340 208 C339 201, 331 202, 331 209 C332 222, 328 236, 320 248 Z"
                      fill="url(#mainCoralGrad)"
                    />
                    <path
                      d="M132 288 C118 282, 104 274, 95 262 C90 256, 97 250, 102 256 C110 266, 122 274, 136 280 Z"
                      fill="url(#mainCoralGrad)"
                    />
                    <path
                      d="M368 288 C382 282, 396 274, 405 262 C410 256, 403 250, 398 256 C390 266, 378 274, 364 280 Z"
                      fill="url(#mainCoralGrad)"
                    />
                    {/* Glowing rounded coral tips */}
                    {[
                      [241, 185],
                      [272, 182],
                      [206, 174],
                      [297, 170],
                      [192, 203],
                      [308, 203],
                      [150, 203],
                      [350, 203],
                      [140, 237],
                      [360, 237],
                      [112, 244],
                      [388, 244],
                    ].map(([cx, cy], idx) => (
                      <circle key={idx} cx={cx} cy={cy} r="5.5" fill={activeTheme.coralHighlight} opacity="0.9" />
                    ))}
                  </g>
                </g>

                {/* Central Rocky Reef Base (Anchors the Coral on the Seabed) */}
                <g>
                  <ellipse cx="250" cy="382" rx="74" ry="16" fill="#5A4A42" />
                  <path
                    d="M182 382 Q196 362 224 368 Q250 356 278 366 Q306 362 318 382 Q250 392 182 382 Z"
                    fill="#786458"
                  />
                  <ellipse cx="222" cy="378" rx="22" ry="9" fill="#8D776A" />
                  <ellipse cx="276" cy="379" rx="25" ry="10" fill="#6B584D" />
                  <ellipse cx="250" cy="382" rx="20" ry="8" fill="#54443B" />
                  {/* Small Starfish on Base Rock */}
                  <path
                    d="M170 388 L174 382 L181 382 L176 387 L178 393 L171 390 L165 393 L167 387 L162 382 L168 382 Z"
                    fill="#F26A4B"
                  />
                </g>

                {/* ============================================================= */}
                {/* SWIMMING REEF FISH (Clownfish & Golden Tangs)                 */}
                {/* ============================================================= */}
                {/* Left Clownfish */}
                <g
                  style={{
                    animation:
                      !reducedMotion ? 'coralFishSwimLeft 7.5s ease-in-out infinite' : 'none',
                  }}
                >
                  <g transform="translate(88, 248)">
                    {/* Tail */}
                    <path d="M-22 0 L-32 -8 L-32 8 Z" fill="#FF6D00" stroke="#1E1E1E" strokeWidth="1" />
                    {/* Body */}
                    <ellipse cx="-6" cy="0" rx="18" ry="10" fill="#FF6D00" />
                    {/* White Stripes */}
                    <path d="M-14 -9 Q-11 0 -14 9" stroke="#FFFFFF" strokeWidth="3.5" fill="none" />
                    <path d="M-2 -10 Q1 0 -2 10" stroke="#FFFFFF" strokeWidth="3.5" fill="none" />
                    {/* Eye */}
                    <circle cx="6" cy="-2" r="2" fill="#111827" />
                    <circle cx="6.6" cy="-2.6" r="0.7" fill="#FFFFFF" />
                  </g>
                </g>

                {/* Right Clownfish */}
                <g
                  style={{
                    animation:
                      !reducedMotion ? 'coralFishSwimRight 8.2s ease-in-out infinite' : 'none',
                  }}
                >
                  <g transform="translate(415, 255) scale(-1, 1)">
                    <path d="M-22 0 L-32 -8 L-32 8 Z" fill="#FF6D00" stroke="#1E1E1E" strokeWidth="1" />
                    <ellipse cx="-6" cy="0" rx="18" ry="10" fill="#FF6D00" />
                    <path d="M-14 -9 Q-11 0 -14 9" stroke="#FFFFFF" strokeWidth="3.5" fill="none" />
                    <path d="M-2 -10 Q1 0 -2 10" stroke="#FFFFFF" strokeWidth="3.5" fill="none" />
                    <circle cx="6" cy="-2" r="2" fill="#111827" />
                    <circle cx="6.6" cy="-2.6" r="0.7" fill="#FFFFFF" />
                  </g>
                </g>

                {/* Upper Left Yellow Reef Fish */}
                <g
                  style={{
                    animation:
                      !reducedMotion ? 'coralFishSwimRight 9.5s ease-in-out infinite' : 'none',
                  }}
                >
                  <g transform="translate(105, 195)">
                    <path d="M-14 0 L-21 -6 L-21 6 Z" fill="#FACC15" />
                    <ellipse cx="-4" cy="0" rx="11" ry="7.5" fill="#FDE047" />
                    <circle cx="3" cy="-1.5" r="1.5" fill="#1E293B" />
                  </g>
                </g>

                {/* Lower Right Yellow Reef Fish */}
                <g
                  style={{
                    animation:
                      !reducedMotion ? 'coralFishSwimLeft 8.8s ease-in-out infinite' : 'none',
                  }}
                >
                  <g transform="translate(405, 312) scale(-1, 1)">
                    <path d="M-15 0 L-23 -7 L-23 7 Z" fill="#F59E0B" />
                    <ellipse cx="-4" cy="0" rx="12" ry="8" fill="#FACC15" />
                    <circle cx="3.5" cy="-1.5" r="1.6" fill="#1E293B" />
                  </g>
                </g>
              </svg>

              {/* Live Coral Growth Progress Pill when active */}
              {hasStartedOnce && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full bg-black/35 backdrop-blur-xs text-white text-[11px] font-semibold tracking-wide flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Coral Growth: {Math.round(growthProgress * 100)}%</span>
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
              <div className="grid grid-cols-2 rounded-xl bg-[#FDF4F0] dark:bg-slate-800/90 p-1 border border-[#F5E1DA] dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setMode('duration')}
                  className={`py-2.5 text-sm font-bold rounded-lg transition-all ${
                    mode === 'duration'
                      ? 'bg-[#F35B4F] text-white shadow-xs'
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  Duration
                </button>
                <button
                  type="button"
                  onClick={() => setMode('endTime')}
                  className={`py-2.5 text-sm font-bold rounded-lg transition-all ${
                    mode === 'endTime'
                      ? 'bg-[#F35B4F] text-white shadow-xs'
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  End Time
                </button>
              </div>

              {mode === 'duration' ? (
                <>
                  {/* 5 Duration Preset Pills: 1 min, 3 min, 5 min, 10 min, 25 min */}
                  <div className="grid grid-cols-5 gap-2">
                    {[1, 3, 5, 10, 25].map((m) => {
                      const isSelected = selectedPreset === m;
                      return (
                        <button
                          key={m}
                          type="button"
                          onClick={() => applyDurationMinutes(m, m)}
                          className={`py-2 px-1 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                            isSelected
                              ? 'bg-[#F35B4F] text-white border-[#F35B4F] shadow-xs'
                              : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-[#F35B4F]/60'
                          }`}
                        >
                          {m} min
                        </button>
                      );
                    })}
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
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-lg font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#F35B4F]"
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
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-lg font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#F35B4F]"
                  />
                </div>
              )}

              {/* Primary Start Button */}
              <button
                type="button"
                onClick={isRunning ? handlePause : handleStart}
                className="w-full py-3.5 px-6 rounded-xl bg-[#F35B4F] hover:bg-[#E0483C] active:scale-[0.99] text-white font-bold text-base shadow-md shadow-[#F35B4F]/25 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
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
                  className="py-2.5 px-4 rounded-xl bg-[#FDF4F0] dark:bg-slate-800 hover:bg-[#F9E6DF] dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm transition-colors flex items-center justify-center gap-2 border border-[#F5E1DA] dark:border-slate-700 cursor-pointer"
                >
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pause</span>
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="py-2.5 px-4 rounded-xl bg-[#FDF4F0] dark:bg-slate-800 hover:bg-[#F9E6DF] dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm transition-colors flex items-center justify-center gap-2 border border-[#F5E1DA] dark:border-slate-700 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Bottom Controls Row: Sound Alert | Fullscreen | Reduced Motion */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
              {/* Sound Alert */}
              <label className="flex items-center gap-2 cursor-pointer">
                <Bell className="w-4 h-4 text-[#F35B4F]" />
                <span>Sound Alert</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={soundAlert}
                  onClick={() => setSoundAlert(!soundAlert)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    soundAlert ? 'bg-[#F35B4F]' : 'bg-slate-300 dark:bg-slate-700'
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
                <Maximize2 className="w-3.5 h-3.5 text-[#F35B4F]" />
                <span>Fullscreen</span>
              </button>

              {/* Reduced Motion */}
              <label className="flex items-center gap-1.5 cursor-pointer">
                <Eye className="w-4 h-4 text-[#F35B4F]" />
                <span>Reduced Motion</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={reducedMotion}
                  onClick={() => setReducedMotion(!reducedMotion)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    reducedMotion ? 'bg-[#F35B4F]' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition-transform ${
                      reducedMotion ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </label>
            </div>
          </div>

          {/* ----------------------------------------------------------------- */}
          {/* RIGHT COLUMN: CORAL THEME & BACKGROUND STYLE (3 cols)             */}
          {/* ----------------------------------------------------------------- */}
          <div className="lg:col-span-3 flex flex-col justify-between rounded-2xl bg-[#FAF8F6] dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 p-4 space-y-4">
            {/* Coral Theme 2x2 Selector */}
            <div>
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2.5">
                Coral Theme
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
                {(Object.values(CORAL_THEMES) as CoralThemeConfig[]).map((theme) => {
                  const isSelected = coralTheme === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setCoralTheme(theme.id)}
                      className={`group rounded-xl overflow-hidden border-2 transition-all text-center bg-white dark:bg-slate-800 p-1 cursor-pointer ${
                        isSelected
                          ? 'border-[#F35B4F] shadow-xs'
                          : 'border-transparent hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      {/* Mini Illustrated Coral Preview */}
                      <div
                        className="w-full h-14 rounded-lg relative overflow-hidden flex items-end justify-center"
                        style={{
                          background:
                            theme.id === 'tropical'
                              ? 'linear-gradient(180deg, #22B5E0 0%, #0A67A3 75%, #E7CDA6 100%)'
                              : theme.id === 'deep-ocean'
                              ? 'linear-gradient(180deg, #0D5C75 0%, #072A47 75%, #5C6B73 100%)'
                              : theme.id === 'colorful-reef'
                              ? 'linear-gradient(180deg, #1E88E5 0%, #311B92 75%, #D7B39E 100%)'
                              : 'linear-gradient(180deg, #B2EBF2 0%, #80DEEA 75%, #F5E6D3 100%)',
                        }}
                      >
                        <svg viewBox="0 0 80 50" className="w-full h-full">
                          <path
                            d="M38 46 L38 26 M38 34 Q26 28 24 16 M38 32 Q50 26 52 15 M38 26 Q33 18 31 11 M38 26 Q43 18 45 11"
                            stroke={theme.coralMid}
                            strokeWidth="4"
                            strokeLinecap="round"
                            fill="none"
                          />
                          <ellipse cx="40" cy="46" rx="18" ry="4" fill="rgba(0,0,0,0.25)" />
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

            {/* Background Style Circular Swatches */}
            <div>
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2.5">
                Background Style
              </h3>
              <div className="flex items-center justify-between gap-2 px-1">
                {(Object.values(BACKGROUND_STYLES) as BackgroundStyleConfig[]).map((bg) => {
                  const isSelected = bgStyle === bg.id;
                  return (
                    <button
                      key={bg.id}
                      type="button"
                      onClick={() => setBgStyle(bg.id)}
                      title={bg.label}
                      className={`w-11 h-11 rounded-full p-0.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'ring-2 ring-[#F35B4F] ring-offset-2 dark:ring-offset-slate-900 scale-105'
                          : 'opacity-85 hover:opacity-100'
                      }`}
                    >
                      <span
                        className="block w-full h-full rounded-full shadow-inner relative overflow-hidden"
                        style={{
                          background: `linear-gradient(180deg, ${bg.skyTop} 0%, ${bg.waterMid} 65%, ${bg.sandLight} 100%)`,
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Save as Default Button */}
            <button
              type="button"
              onClick={handleSaveDefault}
              className="w-full py-2.5 px-3 rounded-xl border border-emerald-600/40 dark:border-emerald-500/40 bg-white dark:bg-slate-800 hover:bg-emerald-50/50 dark:hover:bg-slate-700 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {savedToast ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Saved as Default!</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
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
                    ? 'bg-white dark:bg-slate-800 border-[#F35B4F] shadow-xs ring-1 ring-[#F35B4F]/30'
                    : 'bg-white/90 dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800 hover:border-[#F35B4F]/50'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-[#FFF2F0] dark:bg-rose-950/50 text-[#F35B4F] flex items-center justify-center shrink-0">
                  <CoralBranchIcon className="w-5 h-5" />
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
                ? 'bg-white dark:bg-slate-800 border-[#F35B4F] shadow-xs ring-1 ring-[#F35B4F]/30'
                : 'bg-white/90 dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800 hover:border-[#F35B4F]/50'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-[#FFF2F0] dark:bg-rose-950/50 text-[#F35B4F] flex items-center justify-center shrink-0">
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
          A coral timer is perfect for many everyday activities.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {[
            {
              title: 'Reading Breaks',
              desc: 'Take a calm break with a visual timer.',
              icon: BookOpen,
              mins: 15,
            },
            {
              title: 'Study Sessions',
              desc: 'Stay focused and productive.',
              icon: GraduationCap,
              mins: 25,
            },
            {
              title: 'Classroom Activities',
              desc: 'Engage students with a relaxing timer.',
              icon: Users,
              mins: 10,
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
              icon: Flower2,
              mins: 5,
            },
            {
              title: 'Activity Transitions',
              desc: 'Help with smooth transitions.',
              icon: RefreshCw,
              mins: 3,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.title}
                type="button"
                onClick={() => applyDurationMinutes(item.mins, [1, 3, 5, 10, 25].includes(item.mins) ? item.mins : 'custom')}
                className="p-3.5 rounded-2xl bg-white/95 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 hover:border-[#F35B4F]/50 text-left transition-all flex items-start gap-3 cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-[#FFF2F0] dark:bg-rose-950/50 text-[#F35B4F] flex items-center justify-center shrink-0 mt-0.5">
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

      {/* Keyframe animations for gentle fish swimming and rising bubbles */}
      <style jsx>{`
        @keyframes coralFishSwimLeft {
          0%, 100% {
            transform: translate(0px, 0px);
          }
          50% {
            transform: translate(12px, -6px);
          }
        }
        @keyframes coralFishSwimRight {
          0%, 100% {
            transform: translate(0px, 0px);
          }
          50% {
            transform: translate(-12px, 6px);
          }
        }
        @keyframes coralBubbleFloat {
          0% {
            transform: translateY(0px) scale(0.95);
            opacity: 0.25;
          }
          50% {
            transform: translateY(-28px) scale(1.05);
            opacity: 0.7;
          }
          100% {
            transform: translateY(-56px) scale(0.9);
            opacity: 0.1;
          }
        }
      `}</style>
    </div>
  );
}

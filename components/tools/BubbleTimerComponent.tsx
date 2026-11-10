'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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
  Settings,
  BookOpen,
  GraduationCap,
  Palette,
  Sparkles,
  RefreshCw,
  Clock,
  ChevronUp,
  ChevronDown,
  Bookmark,
  Check,
} from 'lucide-react';
import { playTimerSound } from '@/lib/sound';

type BubbleThemeId = 'ocean-blue' | 'seafoam-green' | 'pastel-dreams' | 'clear-glass';
type BackgroundStyleId = 'deep-ocean' | 'emerald-lagoon' | 'coral-sunset' | 'lavender-reef';
type TimerMode = 'duration' | 'endTime';

interface BubbleThemeConfig {
  id: BubbleThemeId;
  label: string;
  accentHex: string;
  bubbleStroke: string;
  bubbleHighlight: string;
  bubbleInnerTop: string;
  bubbleInnerBottom: string;
  bubbleRimGlow: string;
  textColor: string;
  subTextColor: string;
}

const BUBBLE_THEMES: BubbleThemeConfig[] = [
  {
    id: 'ocean-blue',
    label: 'Ocean Blue',
    accentHex: '#0277CC',
    bubbleStroke: '#B8ECFF',
    bubbleHighlight: '#FFFFFF',
    bubbleInnerTop: '#8BE0FF',
    bubbleInnerBottom: '#1B75BC',
    bubbleRimGlow: '#67D4FF',
    textColor: '#05223B',
    subTextColor: '#133C5E',
  },
  {
    id: 'seafoam-green',
    label: 'Seafoam Green',
    accentHex: '#0E947A',
    bubbleStroke: '#C2F9E9',
    bubbleHighlight: '#FFFFFF',
    bubbleInnerTop: '#8CF4D8',
    bubbleInnerBottom: '#158A73',
    bubbleRimGlow: '#5EEAD4',
    textColor: '#062C24',
    subTextColor: '#134A3E',
  },
  {
    id: 'pastel-dreams',
    label: 'Pastel Dreams',
    accentHex: '#9D5CE5',
    bubbleStroke: '#F9D8FF',
    bubbleHighlight: '#FFFFFF',
    bubbleInnerTop: '#F5B8FF',
    bubbleInnerBottom: '#8B5CF6',
    bubbleRimGlow: '#E879F9',
    textColor: '#2B1248',
    subTextColor: '#482370',
  },
  {
    id: 'clear-glass',
    label: 'Clear Glass',
    accentHex: '#3B769E',
    bubbleStroke: '#FFFFFF',
    bubbleHighlight: '#FFFFFF',
    bubbleInnerTop: '#E2F2FC',
    bubbleInnerBottom: '#7FA8C4',
    bubbleRimGlow: '#D8EEFA',
    textColor: '#102636',
    subTextColor: '#264459',
  },
];

interface BackgroundStyleConfig {
  id: BackgroundStyleId;
  label: string;
  waterTop: string;
  waterMid: string;
  waterBottom: string;
  rayColor: string;
  sandTop: string;
  sandBottom: string;
  foliageLeft: string;
  foliageRight: string;
  coralAccent: string;
}

const BACKGROUND_STYLES: BackgroundStyleConfig[] = [
  {
    id: 'deep-ocean',
    label: 'Deep Ocean',
    waterTop: '#38B6E8',
    waterMid: '#1575B8',
    waterBottom: '#0B4378',
    rayColor: '#B5F2FF',
    sandTop: '#E9D2A6',
    sandBottom: '#C7A670',
    foliageLeft: '#247558',
    foliageRight: '#1F6850',
    coralAccent: '#E07A86',
  },
  {
    id: 'emerald-lagoon',
    label: 'Emerald Lagoon',
    waterTop: '#4AD6C3',
    waterMid: '#138B82',
    waterBottom: '#094E52',
    rayColor: '#C9FFF5',
    sandTop: '#E8D8B0',
    sandBottom: '#C4AD7C',
    foliageLeft: '#1E6F4D',
    foliageRight: '#17593E',
    coralAccent: '#F29479',
  },
  {
    id: 'coral-sunset',
    label: 'Warm Coral Glow',
    waterTop: '#F7B28B',
    waterMid: '#D96B84',
    waterBottom: '#5D356B',
    rayColor: '#FFF0D6',
    sandTop: '#F3CFA8',
    sandBottom: '#C9966E',
    foliageLeft: '#4C3B6E',
    foliageRight: '#3E2F5C',
    coralAccent: '#FF8FA3',
  },
  {
    id: 'lavender-reef',
    label: 'Lavender Twilight',
    waterTop: '#8FA8F8',
    waterMid: '#6C69D8',
    waterBottom: '#352F82',
    rayColor: '#E3EAFF',
    sandTop: '#DFC7E8',
    sandBottom: '#B092C2',
    foliageLeft: '#35488A',
    foliageRight: '#2B3B75',
    coralAccent: '#F492C8',
  },
];

interface FloatingBubbleSpec {
  id: number;
  baseX: number;
  baseY: number;
  r: number;
  speed: number;
  swayAmp: number;
  swayFreq: number;
  phase: number;
  thresholdOrder: number; // 0..1 determines when this bubble fades out as timeFraction decreases
}

// Deterministic set of 36 gentle floating bubbles across the underwater scene
const FLOATING_BUBBLES: FloatingBubbleSpec[] = Array.from({ length: 36 }, (_, idx) => {
  const seed1 = ((idx * 73 + 19) % 100) / 100;
  const seed2 = ((idx * 41 + 37) % 100) / 100;
  const seed3 = ((idx * 29 + 61) % 100) / 100;
  // Spread bubbles preferentially along left and right sides so center readout stays clear
  const side = idx % 3 === 0 ? 'left' : idx % 3 === 1 ? 'right' : 'all';
  const baseX =
    side === 'left'
      ? 28 + seed1 * 105
      : side === 'right'
      ? 285 + seed1 * 105
      : 45 + seed1 * 330;
  const baseY = 45 + seed2 * 335;
  const r = 6 + Math.pow(seed3, 1.4) * 22;
  return {
    id: idx,
    baseX,
    baseY,
    r,
    speed: 14 + (1 - seed3) * 18,
    swayAmp: 4 + seed1 * 8,
    swayFreq: 0.7 + seed2 * 0.9,
    phase: idx * 1.15,
    thresholdOrder: (idx + 0.5) / 36,
  };
});

const QUICK_PRESETS = [
  { minutes: 1, label: '1 Minute', sub: 'Quick break' },
  { minutes: 3, label: '3 Minutes', sub: 'Short focus' },
  { minutes: 5, label: '5 Minutes', sub: 'Study session' },
  { minutes: 10, label: '10 Minutes', sub: 'Deep work' },
  { minutes: 15, label: '15 Minutes', sub: 'Longer session' },
];

const STORAGE_KEY = 'timetools_bubble_timer_defaults_v1';

// Helper icon showing a playful cluster of 3 bubbles matching Quick Presets cards
function BubbleClusterIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="9.5" cy="13.5" r="5.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M 7.5 11 A 2.5 2.5 0 0 1 10 9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="17.5" cy="8.5" r="3" fill="currentColor" opacity="0.85" />
      <circle cx="16.5" cy="17" r="2" fill="currentColor" opacity="0.7" />
      <circle cx="6" cy="6" r="1.5" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

export default function BubbleTimerComponent() {
  // Mode & duration state (default 5 minutes matching screenshot "05:00")
  const [mode, setMode] = useState<TimerMode>('duration');
  const [durationMinutes, setDurationMinutes] = useState<number>(5);
  const [totalMs, setTotalMs] = useState<number>(5 * 60 * 1000);
  const [remainingMs, setRemainingMs] = useState<number>(5 * 60 * 1000);
  const [endTimeStr, setEndTimeStr] = useState<string>(() => {
    const d = new Date(Date.now() + 5 * 60 * 1000);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  });
  const [isCustomPreset, setIsCustomPreset] = useState<boolean>(false);

  // Running state
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Customization & Options
  const [bubbleThemeId, setBubbleThemeId] = useState<BubbleThemeId>('ocean-blue');
  const [bgStyleId, setBgStyleId] = useState<BackgroundStyleId>('deep-ocean');
  const [bubbleDensity, setBubbleDensity] = useState<number>(50); // 10% to 100%
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [soundAlert, setSoundAlert] = useState<boolean>(true);
  const [showTime, setShowTime] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [savedFeedback, setSavedFeedback] = useState<boolean>(false);

  // Continuous elapsed animation time (in seconds) for gentle rising bubble motion
  const [animTimeSec, setAnimTimeSec] = useState<number>(0);

  const stageRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const targetEndTimestampRef = useRef<number | null>(null);
  const customInputRef = useRef<HTMLInputElement>(null);

  const currentTheme = BUBBLE_THEMES.find((t) => t.id === bubbleThemeId) || BUBBLE_THEMES[0];
  const currentBg = BACKGROUND_STYLES.find((b) => b.id === bgStyleId) || BACKGROUND_STYLES[0];

  // Hydrate saved defaults on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.bubbleThemeId && BUBBLE_THEMES.some((t) => t.id === parsed.bubbleThemeId)) {
            setBubbleThemeId(parsed.bubbleThemeId);
          }
          if (parsed.bgStyleId && BACKGROUND_STYLES.some((b) => b.id === parsed.bgStyleId)) {
            setBgStyleId(parsed.bgStyleId);
          }
          if (typeof parsed.bubbleDensity === 'number') {
            setBubbleDensity(Math.max(10, Math.min(100, parsed.bubbleDensity)));
          }
          if (typeof parsed.reducedMotion === 'boolean') {
            setReducedMotion(parsed.reducedMotion);
          }
          if (typeof parsed.durationMinutes === 'number' && parsed.durationMinutes >= 1 && parsed.durationMinutes <= 720) {
            setDurationMinutes(parsed.durationMinutes);
            const ms = parsed.durationMinutes * 60 * 1000;
            setTotalMs(ms);
            setRemainingMs(ms);
          }
          if (typeof parsed.soundAlert === 'boolean') {
            setSoundAlert(parsed.soundAlert);
          }
          if (typeof parsed.showTime === 'boolean') {
            setShowTime(parsed.showTime);
          }
        }
      } catch {
        // ignore storage errors
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleSaveAsDefault = () => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          bubbleThemeId,
          bgStyleId,
          bubbleDensity,
          reducedMotion,
          durationMinutes,
          soundAlert,
          showTime,
        })
      );
      setSavedFeedback(true);
      setTimeout(() => setSavedFeedback(false), 2200);
    } catch {
      // ignore storage errors
    }
  };

  // High-precision animation loop for smooth countdown & gentle rising bubbles
  useEffect(() => {
    if (!isRunning) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    const startPerf = performance.now();
    const initialAnimSec = animTimeSec;

    const tick = (nowPerf: number) => {
      if (!targetEndTimestampRef.current) return;
      const now = Date.now();
      const left = Math.max(0, targetEndTimestampRef.current - now);
      setRemainingMs(left);

      if (!reducedMotion) {
        setAnimTimeSec(initialAnimSec + (nowPerf - startPerf) / 1000);
      }

      if (left <= 0) {
        setIsRunning(false);
        setIsCompleted(true);
        targetEndTimestampRef.current = null;
        if (soundAlert) {
          playTimerSound('bell', 0.85);
        }
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, soundAlert, reducedMotion]);

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

  const toggleFullscreen = useCallback(async () => {
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
  }, [isFullscreen]);

  const applyDurationMinutes = (mins: number, custom = false) => {
    const clamped = Math.max(1, Math.min(720, Math.round(mins)));
    setIsRunning(false);
    setIsCompleted(false);
    targetEndTimestampRef.current = null;
    setDurationMinutes(clamped);
    setIsCustomPreset(custom);
    const ms = clamped * 60 * 1000;
    setTotalMs(ms);
    setRemainingMs(ms);
  };

  const applyEndTime = (timeVal: string) => {
    setEndTimeStr(timeVal);
    setIsRunning(false);
    setIsCompleted(false);
    targetEndTimestampRef.current = null;

    const [hh, mm] = timeVal.split(':').map(Number);
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
  };

  const handleStart = () => {
    let startFromMs = remainingMs;
    if (startFromMs <= 0 || isCompleted) {
      startFromMs = totalMs;
      setRemainingMs(totalMs);
      setIsCompleted(false);
    }
    targetEndTimestampRef.current = Date.now() + startFromMs;
    setIsRunning(true);
  };

  const handlePause = () => {
    if (!isRunning) return;
    if (targetEndTimestampRef.current) {
      const left = Math.max(0, targetEndTimestampRef.current - Date.now());
      setRemainingMs(left);
    }
    targetEndTimestampRef.current = null;
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsCompleted(false);
    targetEndTimestampRef.current = null;
    setAnimTimeSec(0);
    if (mode === 'endTime') {
      applyEndTime(endTimeStr);
    } else {
      const ms = durationMinutes * 60 * 1000;
      setTotalMs(ms);
      setRemainingMs(ms);
    }
  };

  // Format MM:SS or HH:MM:SS
  const totalSecondsRemaining = Math.ceil(remainingMs / 1000);
  const hours = Math.floor(totalSecondsRemaining / 3600);
  const mins = Math.floor((totalSecondsRemaining % 3600) / 60);
  const secs = totalSecondsRemaining % 60;
  const formattedTime =
    hours > 0
      ? `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
      : `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  // Strict 1:1 synchronization with timer:
  // timeFraction = 1.0 at full duration (100% remaining), 0.0 at 00:00 (0% remaining)
  const timeFraction = totalMs > 0 ? Math.max(0, Math.min(1, remainingMs / totalMs)) : 0;

  // Determine how many bubbles are in the active pool based on Bubble Density slider (10%..100%)
  const activePoolBubbles = useMemo(() => {
    const maxCount = Math.max(4, Math.round((bubbleDensity / 100) * FLOATING_BUBBLES.length));
    return FLOATING_BUBBLES.slice(0, maxCount).map((b, i) => ({
      ...b,
      poolThreshold: i / maxCount, // 0 .. (maxCount-1)/maxCount
    }));
  }, [bubbleDensity]);

  // Central Master Bubble liquid fill level & progress ring circumference
  // Center at (210, 206), radius = 98
  const centerR = 98;
  const centerCircumference = 2 * Math.PI * centerR;
  const centerDashOffset = centerCircumference * (1 - timeFraction);
  // Internal liquid fill inside the central glass bubble (drains from top y=108 down to bottom y=304)
  const bubbleFillY = 108 + (1 - timeFraction) * (centerR * 2);

  return (
    <div className="space-y-10">
      {/* MAIN 3-COLUMN INTERACTIVE TOOL CARD */}
      <div className="bg-white dark:bg-[#181D1A] border border-[#E4E7EC] dark:border-[#2A312C] rounded-3xl p-4 sm:p-6 lg:p-7 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-7 items-stretch">
          {/* LEFT STAGE: CALMING UNDERWATER BUBBLE SCENE (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col">
            <div
              ref={stageRef}
              className={`relative w-full aspect-square rounded-2xl overflow-hidden border border-[#CFE2F0] dark:border-[#2C3530] shadow-inner select-none flex items-center justify-center ${
                isFullscreen ? 'timer-fullscreen-stage' : ''
              }`}
            >
              <svg
                viewBox="0 0 420 420"
                preserveAspectRatio="xMidYMid slice"
                shapeRendering="geometricPrecision"
                className="w-full h-full object-cover"
                role="img"
                aria-label={`Bubble countdown timer showing ${formattedTime} remaining`}
              >
                <defs>
                  {/* Underwater Depth Gradient */}
                  <linearGradient id="bubbleStageWaterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={currentBg.waterTop} />
                    <stop offset="48%" stopColor={currentBg.waterMid} />
                    <stop offset="100%" stopColor={currentBg.waterBottom} />
                  </linearGradient>

                  {/* Sunbeam Ray Gradient */}
                  <linearGradient id="bubbleSunRayGrad" x1="0%" y1="0%" x2="20%" y2="100%">
                    <stop offset="0%" stopColor={currentBg.rayColor} stopOpacity="0.48" />
                    <stop offset="60%" stopColor={currentBg.rayColor} stopOpacity="0.14" />
                    <stop offset="100%" stopColor={currentBg.rayColor} stopOpacity="0" />
                  </linearGradient>

                  {/* Sandy Seabed Gradient */}
                  <linearGradient id="bubbleSandGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={currentBg.sandTop} />
                    <stop offset="100%" stopColor={currentBg.sandBottom} />
                  </linearGradient>

                  {/* Translucent 3D Bubble Sphere Gradient */}
                  <radialGradient id="bubbleSphereGrad" cx="34%" cy="30%" r="70%">
                    <stop offset="0%" stopColor={currentTheme.bubbleHighlight} stopOpacity="0.72" />
                    <stop offset="32%" stopColor={currentTheme.bubbleInnerTop} stopOpacity="0.32" />
                    <stop offset="78%" stopColor={currentTheme.bubbleInnerBottom} stopOpacity="0.28" />
                    <stop offset="100%" stopColor={currentTheme.bubbleStroke} stopOpacity="0.68" />
                  </radialGradient>

                  {/* Central Master Bubble Fill Clip */}
                  <clipPath id="masterBubbleClip">
                    <circle cx="210" cy="206" r={centerR - 2} />
                  </clipPath>

                  {/* Master Bubble Internal Remaining Fill Gradient */}
                  <linearGradient id="masterBubbleLiquidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={currentTheme.bubbleInnerTop} stopOpacity="0.48" />
                    <stop offset="100%" stopColor={currentTheme.bubbleInnerBottom} stopOpacity="0.58" />
                  </linearGradient>
                </defs>

                {/* 1. Underwater Background */}
                <rect x="0" y="0" width="420" height="420" fill="url(#bubbleStageWaterGrad)" />

                {/* 2. Shimmering Water Surface Waves at Top */}
                <path
                  d="M 0 0 L 420 0 L 420 26 Q 350 34 280 24 T 140 28 T 0 22 Z"
                  fill={currentBg.rayColor}
                  opacity="0.35"
                />
                <path
                  d="M 0 12 Q 70 22 140 14 T 280 18 T 420 12"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeOpacity="0.45"
                  strokeWidth="1.5"
                />

                {/* 3. Diagonal Sunlight Rays Filtering Through Water */}
                <polygon points="75,0 145,0 235,380 115,380" fill="url(#bubbleSunRayGrad)" />
                <polygon points="175,0 265,0 365,380 225,380" fill="url(#bubbleSunRayGrad)" />
                <polygon points="290,0 355,0 420,310 345,380" fill="url(#bubbleSunRayGrad)" />

                {/* 4. Distant Underwater Reef Silhouettes */}
                <path
                  d="M 0 348 Q 65 322 135 352 L 135 390 L 0 390 Z"
                  fill={currentBg.waterBottom}
                  opacity="0.55"
                />
                <path
                  d="M 285 352 Q 355 320 420 346 L 420 390 L 285 390 Z"
                  fill={currentBg.waterBottom}
                  opacity="0.55"
                />

                {/* 5. Seaweed, Kelp & Coral along Left and Right Reefs */}
                {/* Left kelp fronds & coral */}
                <g>
                  <path
                    d="M 24 382 Q 8 330 28 282 Q 44 240 22 198 Q 38 242 42 286 Q 32 332 42 382 Z"
                    fill={currentBg.foliageLeft}
                  />
                  <path
                    d="M 52 386 Q 38 342 56 304 Q 70 272 54 238 Q 68 272 68 308 Q 58 346 66 386 Z"
                    fill={currentBg.foliageRight}
                  />
                  <path
                    d="M 82 390 Q 72 356 88 326 Q 98 302 86 278 Q 98 304 98 332 Q 90 360 96 390 Z"
                    fill={currentBg.foliageLeft}
                  />
                  {/* Coral cluster left */}
                  <circle cx="38" cy="368" r="14" fill={currentBg.coralAccent} opacity="0.82" />
                  <circle cx="52" cy="374" r="11" fill={currentBg.coralAccent} opacity="0.7" />
                </g>

                {/* Right kelp fronds & coral */}
                <g>
                  <path
                    d="M 396 382 Q 412 328 392 278 Q 376 236 396 192 Q 380 236 378 282 Q 388 330 378 382 Z"
                    fill={currentBg.foliageRight}
                  />
                  <path
                    d="M 366 386 Q 380 340 362 300 Q 348 268 364 234 Q 350 268 350 304 Q 360 344 352 386 Z"
                    fill={currentBg.foliageLeft}
                  />
                  <path
                    d="M 336 390 Q 348 354 332 324 Q 322 300 334 276 Q 322 302 322 330 Q 330 358 324 390 Z"
                    fill={currentBg.foliageRight}
                  />
                  {/* Coral cluster right */}
                  <circle cx="382" cy="368" r="15" fill={currentBg.coralAccent} opacity="0.82" />
                  <circle cx="364" cy="374" r="11" fill={currentBg.coralAccent} opacity="0.7" />
                </g>

                {/* 6. Sandy Seabed & Smooth Pebbles at Bottom */}
                <path
                  d="M 0 374 Q 105 360 210 368 T 420 372 L 420 420 L 0 420 Z"
                  fill="url(#bubbleSandGrad)"
                />
                {/* Smooth ocean pebbles */}
                <ellipse cx="56" cy="386" rx="18" ry="7" fill="#5A6B7C" opacity="0.75" />
                <ellipse cx="84" cy="394" rx="13" ry="5.5" fill="#738496" opacity="0.75" />
                <ellipse cx="348" cy="388" rx="20" ry="7.5" fill="#5A6B7C" opacity="0.75" />
                <ellipse cx="316" cy="395" rx="14" ry="5.5" fill="#738496" opacity="0.75" />
                <ellipse cx="145" cy="402" rx="11" ry="4" fill="#8B99A8" opacity="0.6" />
                <ellipse cx="275" cy="404" rx="12" ry="4.5" fill="#8B99A8" opacity="0.6" />

                {/* 7. Synchronized Floating Translucent Bubbles */}
                {activePoolBubbles.map((b) => {
                  // Each bubble's visibility is tied directly to timeFraction:
                  // As timeFraction decreases from 1.0 -> 0.0, bubbles whose poolThreshold > timeFraction smoothly fade out!
                  const fadeWindow = 1 / Math.max(4, activePoolBubbles.length);
                  const bubbleVisibility = Math.max(
                    0,
                    Math.min(1, (timeFraction - b.poolThreshold) / fadeWindow)
                  );
                  if (bubbleVisibility <= 0.01) return null;

                  // Gentle upward rise when running and not reducedMotion
                  const travelY = reducedMotion
                    ? b.baseY
                    : 390 - (((390 - b.baseY + animTimeSec * b.speed) % 360));
                  const swayX = reducedMotion
                    ? b.baseX
                    : b.baseX + Math.sin(animTimeSec * b.swayFreq + b.phase) * b.swayAmp;

                  const scaledR = b.r * (0.65 + 0.35 * bubbleVisibility);

                  return (
                    <g key={b.id} opacity={bubbleVisibility * 0.92}>
                      {/* Translucent bubble body */}
                      <circle
                        cx={swayX}
                        cy={travelY}
                        r={scaledR}
                        fill="url(#bubbleSphereGrad)"
                        stroke={currentTheme.bubbleStroke}
                        strokeWidth="1.2"
                        strokeOpacity="0.85"
                      />
                      {/* Glossy specular arc highlight on top-left */}
                      <ellipse
                        cx={swayX - scaledR * 0.34}
                        cy={travelY - scaledR * 0.34}
                        rx={scaledR * 0.26}
                        ry={scaledR * 0.15}
                        transform={`rotate(-35 ${swayX - scaledR * 0.34} ${travelY - scaledR * 0.34})`}
                        fill="#FFFFFF"
                        opacity="0.82"
                      />
                      {/* Secondary bottom-right rim reflection */}
                      <circle
                        cx={swayX + scaledR * 0.36}
                        cy={travelY + scaledR * 0.36}
                        r={scaledR * 0.09}
                        fill="#FFFFFF"
                        opacity="0.55"
                      />
                    </g>
                  );
                })}

                {/* 8. Central Master Countdown Bubble Sphere (cx=210, cy=206, r=98) */}
                <g>
                  {/* Soft outer aquatic glow */}
                  <circle
                    cx="210"
                    cy="206"
                    r={centerR + 10}
                    fill={currentTheme.bubbleRimGlow}
                    opacity={0.18 + 0.14 * timeFraction}
                  />

                  {/* Synchronized internal translucent fill that drains 1:1 with remainingMs / totalMs */}
                  <g clipPath="url(#masterBubbleClip)">
                    <rect
                      x="110"
                      y={bubbleFillY}
                      width="200"
                      height={centerR * 2 + 4}
                      fill="url(#masterBubbleLiquidGrad)"
                    />
                    {timeFraction > 0.01 && timeFraction < 0.99 && (
                      <ellipse
                        cx="210"
                        cy={bubbleFillY}
                        rx={Math.sqrt(
                          Math.max(0, centerR * centerR - Math.pow(bubbleFillY - 206, 2))
                        )}
                        ry="4.5"
                        fill={currentTheme.bubbleStroke}
                        opacity="0.55"
                      />
                    )}
                  </g>

                  {/* Main glossy 3D glass sphere body */}
                  <circle
                    cx="210"
                    cy="206"
                    r={centerR}
                    fill="url(#bubbleSphereGrad)"
                    stroke="#FFFFFF"
                    strokeOpacity="0.65"
                    strokeWidth="2.5"
                  />

                  {/* Synchronized Circular Progress Rim around Master Bubble */}
                  <circle
                    cx="210"
                    cy="206"
                    r={centerR}
                    fill="none"
                    stroke={currentTheme.bubbleStroke}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeDasharray={centerCircumference}
                    strokeDashoffset={centerDashOffset}
                    transform="rotate(-90 210 206)"
                  />

                  {/* Top-left curved specular highlight on Master Bubble */}
                  <path
                    d="M 142 158 A 78 78 0 0 1 202 124"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="6"
                    strokeLinecap="round"
                    opacity="0.72"
                  />
                  {/* Bottom-right soft reflection arc */}
                  <path
                    d="M 272 254 A 78 78 0 0 1 224 286"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    opacity="0.45"
                  />
                </g>
              </svg>

              {/* Centered Digital Time Readout & Focus Time Subtitle */}
              {(showTime || isFullscreen) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-4 text-center">
                  <div
                    className={`font-sans font-bold tracking-tight drop-shadow-xs tabular-nums ${
                      isFullscreen
                        ? 'text-6xl sm:text-7xl md:text-8xl'
                        : 'text-5xl sm:text-6xl'
                    }`}
                    style={{ color: currentTheme.textColor }}
                  >
                    {formattedTime}
                  </div>
                  {!isFullscreen && (
                    <div
                      className="mt-1 text-sm sm:text-base font-medium tracking-wide"
                      style={{ color: currentTheme.subTextColor }}
                    >
                      {isCompleted ? 'Time Completed!' : 'Focus Time'}
                    </div>
                  )}
                </div>
              )}

              {/* Fullscreen Exit Button */}
              {isFullscreen && (
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="absolute top-5 right-5 z-20 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black/65 text-white text-xs font-semibold backdrop-blur-xs hover:bg-black/85 transition-colors cursor-pointer"
                  aria-label="Exit Fullscreen"
                >
                  <Minimize2 className="w-4 h-4" />
                  <span>Exit Fullscreen</span>
                </button>
              )}
            </div>
          </div>

          {/* CENTER CONTROLS COLUMN (lg:col-span-4) */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              {/* Mode Tabs: Duration | End Time */}
              <div className="grid grid-cols-2 rounded-xl bg-[#F1F4F8] dark:bg-[#222824] p-1 border border-[#E2E8F0] dark:border-[#2E3630]">
                <button
                  type="button"
                  onClick={() => setMode('duration')}
                  className={`py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    mode === 'duration'
                      ? 'bg-[#0277CC] text-white shadow-xs'
                      : 'text-[#252B27]/75 dark:text-slate-300 hover:text-[#252B27]'
                  }`}
                >
                  Duration
                </button>
                <button
                  type="button"
                  onClick={() => setMode('endTime')}
                  className={`py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    mode === 'endTime'
                      ? 'bg-[#0277CC] text-white shadow-xs'
                      : 'text-[#252B27]/75 dark:text-slate-300 hover:text-[#252B27]'
                  }`}
                >
                  End Time
                </button>
              </div>

              {mode === 'duration' ? (
                <>
                  {/* Preset Pill Buttons: 1 min, 3 min, 5 min, 10 min, 15 min */}
                  <div className="grid grid-cols-5 gap-1.5">
                    {[1, 3, 5, 10, 15].map((m) => {
                      const isActive = !isCustomPreset && durationMinutes === m;
                      return (
                        <button
                          key={m}
                          type="button"
                          onClick={() => applyDurationMinutes(m, false)}
                          className={`py-2 px-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                            isActive
                              ? 'bg-[#0277CC] text-white border-[#0277CC] shadow-2xs'
                              : 'bg-white dark:bg-[#1E2420] text-[#252B27] dark:text-slate-200 border-[#E2E8F0] dark:border-[#303832] hover:border-[#94A3B8]'
                          }`}
                        >
                          {m} min
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Minutes Stepper Input */}
                  <div className="flex items-center gap-3">
                    <div className="relative flex items-center w-28 bg-white dark:bg-[#1E2420] border border-[#E2E8F0] dark:border-[#303832] rounded-xl px-3 py-2">
                      <input
                        ref={customInputRef}
                        type="number"
                        min={1}
                        max={720}
                        value={durationMinutes}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          if (!Number.isNaN(val)) {
                            applyDurationMinutes(val, true);
                          }
                        }}
                        aria-label="Duration in minutes"
                        className="w-full bg-transparent text-base font-semibold text-[#252B27] dark:text-white focus:outline-none tabular-nums pr-5"
                      />
                      <div className="absolute right-2 flex flex-col">
                        <button
                          type="button"
                          aria-label="Increase minutes"
                          onClick={() => applyDurationMinutes(durationMinutes + 1, true)}
                          className="text-[#252B27]/60 hover:text-[#252B27] dark:text-slate-400 dark:hover:text-white cursor-pointer"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          aria-label="Decrease minutes"
                          onClick={() => applyDurationMinutes(Math.max(1, durationMinutes - 1), true)}
                          className="text-[#252B27]/60 hover:text-[#252B27] dark:text-slate-400 dark:hover:text-white cursor-pointer"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <span className="text-xs sm:text-sm text-[#252B27]/75 dark:text-slate-300 font-medium">
                      minutes
                    </span>
                  </div>
                </>
              ) : (
                /* End Time Mode Picker */
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-[#252B27]/75 dark:text-slate-300">
                    Select target clock time:
                  </label>
                  <input
                    type="time"
                    value={endTimeStr}
                    onChange={(e) => applyEndTime(e.target.value)}
                    className="w-full rounded-xl border border-[#E2E8F0] dark:border-[#303832] bg-white dark:bg-[#1E2420] px-3.5 py-2.5 text-sm font-semibold text-[#252B27] dark:text-white focus:outline-none"
                  />
                </div>
              )}

              {/* Primary Start / Pause Button */}
              <button
                type="button"
                onClick={isRunning ? handlePause : handleStart}
                className="w-full py-3.5 px-5 rounded-xl bg-[#0277CC] hover:bg-[#0263AB] text-white font-semibold text-sm sm:text-base shadow-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                {isRunning ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>{remainingMs < totalMs && remainingMs > 0 ? 'Resume' : 'Start'}</span>
                  </>
                )}
              </button>

              {/* Secondary Pause & Reset Row */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={isRunning ? handlePause : handleStart}
                  className="py-2.5 px-4 rounded-xl bg-[#F2F4F7] dark:bg-[#222824] hover:bg-[#E5E9F0] dark:hover:bg-[#2A322D] text-[#252B27] dark:text-slate-200 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Pause</span>
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="py-2.5 px-4 rounded-xl bg-[#F2F4F7] dark:bg-[#222824] hover:bg-[#E5E9F0] dark:hover:bg-[#2A322D] text-[#252B27] dark:text-slate-200 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Utility Controls: Sound Alert, Fullscreen, Show Time + Bubble Density + Reduced Motion */}
            <div className="pt-3 border-t border-[#E6EBF2] dark:border-[#2A312C] space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#252B27]/80 dark:text-slate-300">
                {/* Sound Alert Toggle */}
                <div className="inline-flex items-center gap-1.5">
                  {soundAlert ? (
                    <Volume2 className="w-3.5 h-3.5 text-[#0277CC]" />
                  ) : (
                    <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <span>Sound Alert</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={soundAlert}
                    aria-label="Toggle sound alert"
                    onClick={() => setSoundAlert((prev) => !prev)}
                    className={`w-8 h-4.5 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                      soundAlert ? 'bg-[#0277CC]' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`w-3.5 h-3.5 rounded-full bg-white shadow-2xs transition-transform ${
                        soundAlert ? 'translate-x-3.5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Fullscreen Button */}
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="inline-flex items-center gap-1.5 hover:text-[#0277CC] transition-colors cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-[#0277CC]" />
                  <span>Fullscreen</span>
                </button>

                {/* Show Time Toggle */}
                <div className="inline-flex items-center gap-1.5">
                  {showTime ? (
                    <Eye className="w-3.5 h-3.5 text-[#0277CC]" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <span>Show Time</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={showTime}
                    aria-label="Toggle time display"
                    onClick={() => setShowTime((prev) => !prev)}
                    className={`w-8 h-4.5 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                      showTime ? 'bg-[#0277CC]' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`w-3.5 h-3.5 rounded-full bg-white shadow-2xs transition-transform ${
                        showTime ? 'translate-x-3.5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Bubble Density Slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#252B27] dark:text-white">
                    Bubble Density
                  </span>
                  <span className="font-semibold text-[#252B27]/75 dark:text-slate-300 tabular-nums">
                    {bubbleDensity}%
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={100}
                  step={5}
                  value={bubbleDensity}
                  onChange={(e) => setBubbleDensity(Number(e.target.value))}
                  aria-label="Bubble density percentage"
                  className="w-full h-1.5 bg-[#E2E8F0] dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#0277CC]"
                />
              </div>

              {/* Reduced Motion Switch */}
              <div className="flex items-center justify-between pt-0.5">
                <button
                  type="button"
                  role="switch"
                  aria-checked={reducedMotion}
                  aria-label="Toggle reduced motion"
                  onClick={() => setReducedMotion((prev) => !prev)}
                  className={`w-9 h-5 rounded-full p-0.5 border transition-colors cursor-pointer flex items-center ${
                    reducedMotion
                      ? 'bg-[#0277CC] border-[#0277CC]'
                      : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600'
                  }`}
                >
                  <span
                    className={`w-3.5 h-3.5 rounded-full shadow-2xs transition-transform ${
                      reducedMotion
                        ? 'translate-x-4 bg-white'
                        : 'translate-x-0 bg-slate-500 dark:bg-slate-300'
                    }`}
                  />
                </button>
                <span className="text-[11px] font-medium text-[#252B27]/70 dark:text-slate-400">
                  Reduced Motion
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT CUSTOMIZATION PANEL: BUBBLE THEME & BACKGROUND STYLE (lg:col-span-3) */}
          <div className="lg:col-span-3 bg-[#F8FAFC] dark:bg-[#1E2420] border border-[#E2E8F0] dark:border-[#2C342E] rounded-2xl p-4 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              {/* Bubble Theme 2x2 Grid */}
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-[#252B27] dark:text-white mb-2.5">
                  Bubble Theme
                </h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {BUBBLE_THEMES.map((theme) => {
                    const isSelected = theme.id === bubbleThemeId;
                    return (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => setBubbleThemeId(theme.id)}
                        className={`group rounded-xl overflow-hidden border-2 transition-all text-center bg-white dark:bg-[#181D1A] cursor-pointer ${
                          isSelected
                            ? 'border-[#0277CC] bg-[#EDF6FF] dark:bg-[#162738] shadow-xs'
                            : 'border-[#E2E8F0] dark:border-[#2E3630] hover:border-[#94A3B8]'
                        }`}
                      >
                        {/* Mini Bubble Theme Thumbnail SVG */}
                        <div className="w-full h-15 relative overflow-hidden">
                          <svg viewBox="0 0 120 68" className="w-full h-full object-cover">
                            <defs>
                              <linearGradient id={`thumbBubbleBg_${theme.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor={theme.bubbleInnerTop} />
                                <stop offset="100%" stopColor={theme.bubbleInnerBottom} />
                              </linearGradient>
                            </defs>
                            <rect x="0" y="0" width="120" height="68" fill={`url(#thumbBubbleBg_${theme.id})`} opacity="0.85" />
                            {/* Mini main bubble */}
                            <circle
                              cx="60"
                              cy="34"
                              r="18"
                              fill="#FFFFFF"
                              fillOpacity="0.28"
                              stroke={theme.bubbleStroke}
                              strokeWidth="1.5"
                            />
                            <ellipse cx="53" cy="27" rx="4.5" ry="2.5" transform="rotate(-30 53 27)" fill="#FFFFFF" opacity="0.85" />
                            {/* Surrounding mini bubbles */}
                            <circle cx="24" cy="22" r="5" fill="#FFFFFF" fillOpacity="0.35" stroke="#FFFFFF" strokeWidth="0.8" />
                            <circle cx="94" cy="20" r="6" fill="#FFFFFF" fillOpacity="0.35" stroke="#FFFFFF" strokeWidth="0.8" />
                            <circle cx="30" cy="48" r="4" fill="#FFFFFF" fillOpacity="0.35" />
                            <circle cx="92" cy="46" r="4.5" fill="#FFFFFF" fillOpacity="0.35" />
                          </svg>
                        </div>
                        <div className="py-1.5 text-[11px] font-semibold text-[#252B27] dark:text-slate-200">
                          {theme.label}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Background Style Row (4 Circular Scenic Thumbnails) */}
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-[#252B27] dark:text-white mb-2.5">
                  Background Style
                </h3>
                <div className="flex items-center justify-between gap-2">
                  {BACKGROUND_STYLES.map((bg) => {
                    const isSelected = bg.id === bgStyleId;
                    return (
                      <button
                        key={bg.id}
                        type="button"
                        aria-label={`Select ${bg.label} background style`}
                        onClick={() => setBgStyleId(bg.id)}
                        className={`w-11 h-11 rounded-full overflow-hidden border-2 transition-transform cursor-pointer p-0.5 ${
                          isSelected
                            ? 'border-[#0277CC] scale-105 shadow-xs'
                            : 'border-transparent hover:scale-105'
                        }`}
                      >
                        <svg viewBox="0 0 44 44" className="w-full h-full rounded-full">
                          <defs>
                            <linearGradient id={`bgCircle_${bg.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor={bg.waterTop} />
                              <stop offset="60%" stopColor={bg.waterMid} />
                              <stop offset="100%" stopColor={bg.waterBottom} />
                            </linearGradient>
                          </defs>
                          <circle cx="22" cy="22" r="22" fill={`url(#bgCircle_${bg.id})`} />
                          <polygon points="14,0 24,0 32,44 16,44" fill={bg.rayColor} opacity="0.28" />
                          <path d="M 0 36 Q 22 32 44 36 L 44 44 L 0 44 Z" fill={bg.sandTop} />
                          <circle cx="22" cy="20" r="6" fill="#FFFFFF" fillOpacity="0.3" stroke="#FFFFFF" strokeWidth="0.8" />
                        </svg>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Save as Default Button */}
            <button
              type="button"
              onClick={handleSaveAsDefault}
              className="w-full py-2.5 px-4 rounded-xl border border-[#2B7A5B] text-[#2B7A5B] dark:border-[#5E917A] dark:text-[#5E917A] bg-white dark:bg-[#181D1A] hover:bg-[#EFF7F3] dark:hover:bg-[#232D27] text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {savedFeedback ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved as Default</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Save as Default</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* QUICK PRESETS SECTION */}
      <div>
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#252B27] dark:text-white">
          Quick Presets
        </h2>
        <p className="text-xs sm:text-sm text-[#252B27]/70 dark:text-slate-400 mt-0.5 mb-4">
          Start with a common time or set a custom duration.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {QUICK_PRESETS.map((preset) => {
            const isActive = !isCustomPreset && durationMinutes === preset.minutes && mode === 'duration';
            return (
              <button
                key={preset.minutes}
                type="button"
                onClick={() => {
                  setMode('duration');
                  applyDurationMinutes(preset.minutes, false);
                }}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  isActive
                    ? 'border-[#38BDF8] bg-[#F0F9FF] dark:bg-[#162736] shadow-2xs'
                    : 'bg-white dark:bg-[#1A201C] border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#94A3B8]'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-[#E8F4FE] dark:bg-[#1B2E40] text-[#0277CC] dark:text-[#38BDF8] flex items-center justify-center shrink-0">
                  <BubbleClusterIcon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-xs sm:text-sm text-[#252B27] dark:text-white truncate">
                    {preset.label}
                  </div>
                  <div
                    className={`text-[11px] truncate ${
                      isActive
                        ? 'text-[#0277CC] dark:text-[#38BDF8] font-medium'
                        : 'text-[#252B27]/65 dark:text-slate-400'
                    }`}
                  >
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
              setMode('duration');
              setIsCustomPreset(true);
              customInputRef.current?.focus();
            }}
            className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
              isCustomPreset
                ? 'border-[#38BDF8] bg-[#F0F9FF] dark:bg-[#162736] shadow-2xs'
                : 'bg-white dark:bg-[#1A201C] border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#94A3B8]'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-[#E8F4FE] dark:bg-[#1B2E40] text-[#0277CC] dark:text-[#38BDF8] flex items-center justify-center shrink-0">
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
      <div className="rounded-3xl bg-[#F0F5F9]/80 dark:bg-[#191F1B] border border-[#DCE6F0] dark:border-[#272F2A] p-5 sm:p-6">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#252B27] dark:text-white">
          Popular Uses
        </h2>
        <p className="text-xs sm:text-sm text-[#252B27]/70 dark:text-slate-400 mt-0.5 mb-4">
          A bubble timer is perfect for many everyday activities.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5">
          {[
            {
              title: 'Study Breaks',
              desc: 'Take a relaxing break between lessons.',
              minutes: 5,
              theme: 'ocean-blue' as BubbleThemeId,
              icon: <BookOpen className="w-5 h-5 text-[#0277CC]" />,
            },
            {
              title: 'Classroom Activities',
              desc: 'Keep students engaged and focused.',
              minutes: 10,
              theme: 'seafoam-green' as BubbleThemeId,
              icon: <GraduationCap className="w-5 h-5 text-[#0277CC]" />,
            },
            {
              title: 'Creative Tasks',
              desc: 'A calm timer for creative work.',
              minutes: 15,
              theme: 'pastel-dreams' as BubbleThemeId,
              icon: <Palette className="w-5 h-5 text-[#0277CC]" />,
            },
            {
              title: 'Mindful Moments',
              desc: 'Relax, breathe and stay in the present.',
              minutes: 3,
              theme: 'clear-glass' as BubbleThemeId,
              icon: <Sparkles className="w-5 h-5 text-[#0277CC]" />,
            },
            {
              title: 'Activity Transitions',
              desc: 'Help with smooth transitions.',
              minutes: 1,
              theme: 'ocean-blue' as BubbleThemeId,
              icon: <RefreshCw className="w-5 h-5 text-[#0277CC]" />,
            },
            {
              title: 'Everyday Routines',
              desc: 'Build better habits with a visual timer.',
              minutes: 10,
              theme: 'seafoam-green' as BubbleThemeId,
              icon: <Clock className="w-5 h-5 text-[#0277CC]" />,
            },
          ].map((useCase) => (
            <button
              key={useCase.title}
              type="button"
              onClick={() => {
                setMode('duration');
                setBubbleThemeId(useCase.theme);
                applyDurationMinutes(useCase.minutes, false);
              }}
              className="flex items-start gap-3 p-3.5 rounded-2xl bg-white dark:bg-[#1E2420] border border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#0277CC] transition-all text-left cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-[#E8F4FE] dark:bg-[#1B2E40] flex items-center justify-center shrink-0 mt-0.5">
                {useCase.icon}
              </div>
              <div className="min-w-0">
                <div className="font-bold text-xs sm:text-sm text-[#252B27] dark:text-white group-hover:text-[#0277CC] transition-colors">
                  {useCase.title}
                </div>
                <p className="text-[11px] text-[#252B27]/70 dark:text-slate-400 leading-snug mt-0.5">
                  {useCase.desc}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

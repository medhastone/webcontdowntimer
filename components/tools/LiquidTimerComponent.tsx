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
  ChefHat,
  Heart,
  Dices,
  Lightbulb,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { playTimerSound } from '@/lib/sound';
import { requestWakeLock, releaseWakeLock } from '@/lib/wakelock';

export type LiquidStyleId =
  | 'ocean-blue'
  | 'amber'
  | 'clear-water'
  | 'sage-green'
  | 'purple'
  | 'rose-pink';

interface LiquidTheme {
  id: LiquidStyleId;
  name: string;
  appearance: string;
  bestFor: string;
  // Main liquid body gradient stops (top -> mid -> deep bottom)
  topColor: string;
  midColor: string;
  bottomColor: string;
  // Meniscus top surface ellipse colors
  surfaceInner: string;
  surfaceOuter: string;
  surfaceRim: string;
  // Bubble stroke/fill tint
  bubbleFill: string;
  bubbleStroke: string;
  // Subtle glow/refraction at glass base
  baseGlow: string;
}

export const LIQUID_THEMES: LiquidTheme[] = [
  {
    id: 'ocean-blue',
    name: 'Ocean Blue',
    appearance: 'Calm and clear',
    bestFor: 'Study, focus, everyday use',
    topColor: 'rgba(38, 160, 246, 0.88)',
    midColor: 'rgba(11, 118, 212, 0.93)',
    bottomColor: 'rgba(6, 74, 158, 0.97)',
    surfaceInner: 'rgba(115, 206, 255, 0.95)',
    surfaceOuter: 'rgba(25, 138, 230, 0.95)',
    surfaceRim: 'rgba(205, 240, 255, 0.9)',
    bubbleFill: 'rgba(210, 242, 255, 0.32)',
    bubbleStroke: 'rgba(235, 250, 255, 0.78)',
    baseGlow: 'rgba(14, 116, 210, 0.35)',
  },
  {
    id: 'amber',
    name: 'Amber',
    appearance: 'Warm and vibrant',
    bestFor: 'Kitchen, games',
    topColor: 'rgba(245, 166, 35, 0.88)',
    midColor: 'rgba(217, 119, 6, 0.93)',
    bottomColor: 'rgba(161, 74, 4, 0.97)',
    surfaceInner: 'rgba(253, 214, 115, 0.95)',
    surfaceOuter: 'rgba(230, 140, 18, 0.95)',
    surfaceRim: 'rgba(255, 243, 201, 0.9)',
    bubbleFill: 'rgba(255, 238, 190, 0.32)',
    bubbleStroke: 'rgba(255, 248, 220, 0.8)',
    baseGlow: 'rgba(217, 119, 6, 0.35)',
  },
  {
    id: 'clear-water',
    name: 'Clear Water',
    appearance: 'Minimal and clean',
    bestFor: 'Any environment',
    topColor: 'rgba(186, 222, 240, 0.58)',
    midColor: 'rgba(142, 196, 224, 0.68)',
    bottomColor: 'rgba(98, 162, 198, 0.78)',
    surfaceInner: 'rgba(232, 247, 255, 0.88)',
    surfaceOuter: 'rgba(162, 210, 234, 0.85)',
    surfaceRim: 'rgba(255, 255, 255, 0.95)',
    bubbleFill: 'rgba(255, 255, 255, 0.42)',
    bubbleStroke: 'rgba(255, 255, 255, 0.88)',
    baseGlow: 'rgba(135, 190, 218, 0.28)',
  },
  {
    id: 'sage-green',
    name: 'Sage Green',
    appearance: 'Natural and calming',
    bestFor: 'Mindfulness, relaxation',
    topColor: 'rgba(56, 178, 96, 0.86)',
    midColor: 'rgba(34, 139, 70, 0.92)',
    bottomColor: 'rgba(19, 94, 44, 0.97)',
    surfaceInner: 'rgba(134, 226, 162, 0.94)',
    surfaceOuter: 'rgba(42, 158, 80, 0.95)',
    surfaceRim: 'rgba(215, 250, 225, 0.9)',
    bubbleFill: 'rgba(215, 250, 225, 0.3)',
    bubbleStroke: 'rgba(235, 255, 240, 0.78)',
    baseGlow: 'rgba(34, 139, 70, 0.35)',
  },
  {
    id: 'purple',
    name: 'Purple',
    appearance: 'Soothing and smooth',
    bestFor: 'Classrooms, kids',
    topColor: 'rgba(155, 114, 235, 0.85)',
    midColor: 'rgba(124, 77, 212, 0.92)',
    bottomColor: 'rgba(86, 43, 168, 0.96)',
    surfaceInner: 'rgba(206, 180, 255, 0.94)',
    surfaceOuter: 'rgba(138, 92, 224, 0.94)',
    surfaceRim: 'rgba(238, 228, 255, 0.9)',
    bubbleFill: 'rgba(235, 220, 255, 0.32)',
    bubbleStroke: 'rgba(248, 240, 255, 0.8)',
    baseGlow: 'rgba(124, 77, 212, 0.33)',
  },
  {
    id: 'rose-pink',
    name: 'Rose Pink',
    appearance: 'Bright and playful',
    bestFor: 'Kids, fun activities',
    topColor: 'rgba(240, 102, 148, 0.86)',
    midColor: 'rgba(214, 64, 114, 0.92)',
    bottomColor: 'rgba(163, 34, 78, 0.97)',
    surfaceInner: 'rgba(255, 172, 200, 0.94)',
    surfaceOuter: 'rgba(228, 82, 132, 0.95)',
    surfaceRim: 'rgba(255, 228, 238, 0.9)',
    bubbleFill: 'rgba(255, 225, 236, 0.32)',
    bubbleStroke: 'rgba(255, 242, 247, 0.82)',
    baseGlow: 'rgba(214, 64, 114, 0.34)',
  },
];

interface BubbleParticle {
  x: number; // relative offset from center (-1 to 1)
  yRatio: number; // 0 (bottom of liquid) to 1 (meniscus surface)
  radius: number;
  speed: number; // upward speed in yRatio per second
  wobblePhase: number;
  wobbleAmp: number;
  alpha: number;
}

const PRESET_BUTTONS = [
  { label: '1 min', minutes: 1, seconds: 60 },
  { label: '3 min', minutes: 3, seconds: 180 },
  { label: '5 min', minutes: 5, seconds: 300 },
  { label: '10 min', minutes: 10, seconds: 600 },
  { label: '15 min', minutes: 15, seconds: 900 },
];

const QUICK_PRESET_CARDS = [
  { label: '1 Minute', sublabel: 'Quick tasks', minutes: 1, isCustom: false },
  { label: '3 Minutes', sublabel: 'Short activities', minutes: 3, isCustom: false },
  { label: '5 Minutes', sublabel: 'Focus time', minutes: 5, isCustom: false },
  { label: '10 Minutes', sublabel: 'Work breaks', minutes: 10, isCustom: false },
  { label: '15 Minutes', sublabel: 'Longer sessions', minutes: 15, isCustom: false },
  { label: 'Custom', sublabel: 'Set your own time', minutes: 5, isCustom: true },
];

const POPULAR_USES = [
  {
    title: 'Study & Focus',
    description: 'Stay on task and avoid distractions.',
    icon: GraduationCap,
    minutes: 15,
  },
  {
    title: 'Classroom Activities',
    description: 'Manage transitions and group work.',
    icon: Users,
    minutes: 5,
  },
  {
    title: 'Cooking',
    description: 'Time recipes and kitchen tasks.',
    icon: ChefHat,
    minutes: 10,
  },
  {
    title: 'Relaxation',
    description: 'Set a calming timer for mindfulness.',
    icon: Heart,
    minutes: 10,
  },
  {
    title: 'Games',
    description: 'Keep turns fair and fun for everyone.',
    icon: Dices,
    minutes: 3,
  },
];

// Miniature Glass Preview SVG for the "Choose a Liquid Style" cards
function MiniLiquidGlassThumb({ theme }: { theme: LiquidTheme }) {
  return (
    <svg
      viewBox="0 0 84 64"
      className="w-20 h-14 mx-auto overflow-visible select-none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`mini-liq-${theme.id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={theme.topColor} />
          <stop offset="55%" stopColor={theme.midColor} />
          <stop offset="100%" stopColor={theme.bottomColor} />
        </linearGradient>
        <radialGradient id={`mini-top-${theme.id}`} cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor={theme.surfaceInner} />
          <stop offset="100%" stopColor={theme.surfaceOuter} />
        </radialGradient>
      </defs>

      {/* Soft base shadow */}
      <ellipse cx="42" cy="57" rx="28" ry="4" fill="rgba(37,43,39,0.16)" />

      {/* Outer glass wall */}
      <path
        d="M16 12 L19 50 C19 54 29 56 42 56 C55 56 65 54 65 50 L68 12"
        fill="rgba(255,255,255,0.55)"
        stroke="rgba(145,152,148,0.65)"
        strokeWidth="1.5"
      />

      {/* Liquid body inside */}
      <path
        d="M18.2 27 L20.2 48.5 C20.2 52 29.5 53.8 42 53.8 C54.5 53.8 63.8 52 63.8 48.5 L65.8 27 Z"
        fill={`url(#mini-liq-${theme.id})`}
      />

      {/* Liquid top meniscus ellipse */}
      <ellipse
        cx="42"
        cy="27"
        rx="23.8"
        ry="4.2"
        fill={`url(#mini-top-${theme.id})`}
        stroke={theme.surfaceRim}
        strokeWidth="0.9"
      />

      {/* Miniature rising bubbles */}
      <circle cx="35" cy="45" r="1.8" fill={theme.bubbleFill} stroke={theme.bubbleStroke} strokeWidth="0.7" />
      <circle cx="44" cy="39" r="2.4" fill={theme.bubbleFill} stroke={theme.bubbleStroke} strokeWidth="0.7" />
      <circle cx="49" cy="47" r="1.4" fill={theme.bubbleFill} stroke={theme.bubbleStroke} strokeWidth="0.7" />
      <circle cx="39" cy="33" r="1.5" fill={theme.bubbleFill} stroke={theme.bubbleStroke} strokeWidth="0.7" />

      {/* Glass top rim ellipse */}
      <ellipse
        cx="42"
        cy="12"
        rx="26"
        ry="4.2"
        fill="rgba(255,255,255,0.22)"
        stroke="rgba(145,152,148,0.75)"
        strokeWidth="1.4"
      />

      {/* Left glass specular highlight */}
      <path
        d="M21 16 L22.5 47"
        stroke="rgba(255,255,255,0.75)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Thick glass base line */}
      <ellipse
        cx="42"
        cy="52.5"
        rx="22"
        ry="2.5"
        fill="none"
        stroke="rgba(255,255,255,0.65)"
        strokeWidth="1.2"
      />
    </svg>
  );
}

export default function LiquidTimerComponent() {
  // Mode: duration vs endTime
  const [timerMode, setTimerMode] = useState<'duration' | 'endTime'>('duration');

  // Duration state (default 5 minutes matching screenshot)
  const [customMinutes, setCustomMinutes] = useState<number>(5);
  const [selectedPresetLabel, setSelectedPresetLabel] = useState<string>('5 min');
  const [totalDurationMs, setTotalDurationMs] = useState<number>(5 * 60 * 1000);
  const [remainingMs, setRemainingMs] = useState<number>(5 * 60 * 1000);
  const [status, setStatus] = useState<'idle' | 'running' | 'paused' | 'completed'>('idle');

  // Liquid color theme
  const [selectedThemeId, setSelectedThemeId] = useState<LiquidStyleId>('ocean-blue');
  const activeTheme =
    LIQUID_THEMES.find((t) => t.id === selectedThemeId) || LIQUID_THEMES[0];

  // End time input string ("HH:MM")
  const [endTimeStr, setEndTimeStr] = useState<string>(() => {
    const target = new Date(Date.now() + 5 * 60 * 1000);
    return `${String(target.getHours()).padStart(2, '0')}:${String(target.getMinutes()).padStart(2, '0')}`;
  });

  // Toggles & Accessibility settings
  const [soundAlert, setSoundAlert] = useState<boolean>(true);
  const [showTime, setShowTime] = useState<boolean>(true);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Refs for timer loop and canvas rendering
  const toolCardRef = useRef<HTMLDivElement>(null);
  const customInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const endTimeTimestampRef = useRef<number>(0);
  const pausedRemainingMsRef = useRef<number>(5 * 60 * 1000);
  const bubblesRef = useRef<BubbleParticle[]>([]);
  const lastFrameTimeRef = useRef<number>(0);
  const wavePhaseRef = useRef<number>(0);

  // Initialize deterministic natural bubble pool
  useEffect(() => {
    if (bubblesRef.current.length === 0) {
      bubblesRef.current = Array.from({ length: 28 }, (_, i) => {
        const spread = ((i % 7) - 3) / 3.5; // concentrated slightly more near center stream
        return {
          x: spread * 0.65 + (Math.sin(i * 19.3) * 0.18),
          yRatio: (i / 28) * 0.95,
          radius: 1.6 + (i % 5) * 1.15 + (i === 4 || i === 15 ? 2.2 : 0),
          speed: 0.14 + (i % 4) * 0.055,
          wobblePhase: i * 1.1,
          wobbleAmp: 2.5 + (i % 3) * 1.8,
          alpha: 0.45 + (i % 4) * 0.14,
        };
      });
    }
  }, []);

  // Manage Screen Wake Lock when running
  useEffect(() => {
    if (status === 'running') {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }
    return () => {
      releaseWakeLock();
    };
  }, [status]);

  // Apply duration in minutes
  const applyDurationMinutes = useCallback((mins: number, presetLabel: string) => {
    const clampedMins = Math.max(1, Math.min(240, Math.round(mins)));
    const ms = clampedMins * 60 * 1000;
    setCustomMinutes(clampedMins);
    setSelectedPresetLabel(presetLabel);
    setTotalDurationMs(ms);
    setRemainingMs(ms);
    pausedRemainingMsRef.current = ms;
    setStatus('idle');
  }, []);

  // Handle End Time change
  const handleEndTimeChange = (val: string) => {
    setEndTimeStr(val);
    const parts = val.split(':').map(Number);
    if (parts.length === 2 && !Number.isNaN(parts[0]) && !Number.isNaN(parts[1])) {
      const now = new Date();
      const target = new Date();
      target.setHours(parts[0], parts[1], 0, 0);
      if (target.getTime() <= now.getTime()) {
        target.setDate(target.getDate() + 1);
      }
      const diffMs = Math.max(60 * 1000, target.getTime() - now.getTime());
      setTotalDurationMs(diffMs);
      setRemainingMs(diffMs);
      pausedRemainingMsRef.current = diffMs;
      setCustomMinutes(Math.round(diffMs / 60000));
      setSelectedPresetLabel('Custom');
      setStatus('idle');
    }
  };

  // Start / Resume timer
  const handleStart = useCallback(() => {
    if (status === 'running') return;
    let startFromMs = remainingMs;
    if (status === 'completed' || startFromMs <= 0) {
      startFromMs = totalDurationMs;
      setRemainingMs(totalDurationMs);
    }
    pausedRemainingMsRef.current = startFromMs;
    endTimeTimestampRef.current = performance.now() + startFromMs;
    setStatus('running');
  }, [status, remainingMs, totalDurationMs]);

  // Pause timer
  const handlePause = useCallback(() => {
    if (status !== 'running') return;
    const left = Math.max(0, endTimeTimestampRef.current - performance.now());
    pausedRemainingMsRef.current = left;
    setRemainingMs(left);
    setStatus('paused');
  }, [status]);

  // Reset timer
  const handleReset = useCallback(() => {
    setStatus('idle');
    setRemainingMs(totalDurationMs);
    pausedRemainingMsRef.current = totalDurationMs;
  }, [totalDurationMs]);

  // Exit Fullscreen helper
  const handleExitFullscreen = useCallback(async () => {
    setIsFullscreen(false);
    try {
      const orientation = window.screen?.orientation as unknown as {
        unlock?: () => void;
      };
      orientation?.unlock?.();
    } catch {
      // ignore
    }
    if (typeof document !== 'undefined' && document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch {
        // ignore
      }
    }
  }, []);

  // Toggle Fullscreen (supports both native browser fullscreen & mobile horizontal landscape)
  const handleToggleFullscreen = useCallback(async () => {
    if (isFullscreen) {
      await handleExitFullscreen();
    } else {
      setIsFullscreen(true);
      if (typeof document !== 'undefined' && document.documentElement.requestFullscreen) {
        try {
          await document.documentElement.requestFullscreen();
          const orientation = window.screen?.orientation as unknown as {
            lock?: (mode: string) => Promise<void>;
          };
          if (orientation?.lock && window.innerWidth <= 900) {
            await orientation.lock('landscape');
          }
        } catch {
          // Fallback to .timer-fullscreen-stage CSS full-viewport & portrait rotation
        }
      }
    }
  }, [isFullscreen, handleExitFullscreen]);

  // Sync native fullscreen change listener
  useEffect(() => {
    const onFullscreenChange = () => {
      if (typeof document !== 'undefined' && !document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  // High-precision countdown tick loop
  useEffect(() => {
    if (status !== 'running') return;

    let rafId: number;
    const tick = () => {
      const now = performance.now();
      const left = Math.max(0, endTimeTimestampRef.current - now);
      setRemainingMs(left);

      if (left <= 0) {
        setStatus('completed');
        if (soundAlert) {
          playTimerSound('chime', 0.85);
        }
        return;
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [status, soundAlert]);

  // Keyboard shortcuts (Space = Start/Pause, R = Reset, F = Fullscreen, Esc = Exit Fullscreen)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
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
      } else if (e.key === 'Escape' && isFullscreen) {
        e.preventDefault();
        handleExitFullscreen();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [status, isFullscreen, handleStart, handlePause, handleReset, handleToggleFullscreen, handleExitFullscreen]);

  // Main Canvas Animation & Realistic Glass Beaker + Liquid Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const renderFrame = (timestamp: number) => {
      const dt = lastFrameTimeRef.current
        ? Math.min(0.05, (timestamp - lastFrameTimeRef.current) / 1000)
        : 0.016;
      lastFrameTimeRef.current = timestamp;

      if (!reducedMotion && (status === 'running' || status === 'idle')) {
        wavePhaseRef.current += dt * (status === 'running' ? 2.6 : 1.4);
      }

      const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 2, 3) : 2;
      const scaleFactor = isFullscreen ? 1.6 : 1.0;
      const baseWidth = 390;
      const baseHeight = 430;
      const cssWidth = baseWidth * scaleFactor;
      const cssHeight = baseHeight * scaleFactor;

      if (
        canvas.width !== Math.round(cssWidth * dpr) ||
        canvas.height !== Math.round(cssHeight * dpr)
      ) {
        canvas.width = Math.round(cssWidth * dpr);
        canvas.height = Math.round(cssHeight * dpr);
      }

      ctx.save();
      ctx.scale(dpr * scaleFactor, dpr * scaleFactor);
      ctx.clearRect(0, 0, baseWidth, baseHeight);

      // Geometry of the slightly tapered glass tumbler + right-side scale
      const cx = 166; // Shifted slightly left so the 100%..0% ruler fits cleanly on the right
      const rimTopY = 38;
      const scaleTopY = 66; // 100% mark
      const scaleBottomY = 362; // 0% mark (inner floor of liquid chamber)
      const baseBottomY = 388; // Outer thick glass bottom
      const topOuterHalfW = 112;
      const bottomOuterHalfW = 98;
      const wallThickness = 6;

      // Helper to get glass outer & inner half-width at any Y between rimTopY and baseBottomY
      const getOuterHalfW = (y: number) => {
        const t = Math.max(0, Math.min(1, (y - rimTopY) / (baseBottomY - rimTopY)));
        return topOuterHalfW - t * (topOuterHalfW - bottomOuterHalfW);
      };
      const getInnerHalfW = (y: number) => getOuterHalfW(y) - wallThickness;

      const rawRemainingRatio =
        totalDurationMs > 0 ? Math.max(0, Math.min(1, remainingMs / totalDurationMs)) : 0;

      // 1. Soft Table Drop Shadow underneath the glass base
      const shadowGrad = ctx.createRadialGradient(
        cx,
        baseBottomY + 8,
        18,
        cx,
        baseBottomY + 8,
        bottomOuterHalfW * 1.22
      );
      shadowGrad.addColorStop(0, 'rgba(30, 38, 34, 0.34)');
      shadowGrad.addColorStop(0.55, 'rgba(30, 38, 34, 0.14)');
      shadowGrad.addColorStop(1, 'rgba(30, 38, 34, 0)');
      ctx.fillStyle = shadowGrad;
      ctx.beginPath();
      ctx.ellipse(cx, baseBottomY + 8, bottomOuterHalfW * 1.18, 17, 0, 0, Math.PI * 2);
      ctx.fill();

      // 2. Glass Back Wall Fill (translucent crystal body)
      const traceOuterGlassBody = () => {
        ctx.beginPath();
        ctx.moveTo(cx - topOuterHalfW, rimTopY);
        ctx.lineTo(cx - bottomOuterHalfW, baseBottomY - 12);
        ctx.quadraticCurveTo(
          cx - bottomOuterHalfW,
          baseBottomY + 10,
          cx,
          baseBottomY + 10
        );
        ctx.quadraticCurveTo(
          cx + bottomOuterHalfW,
          baseBottomY + 10,
          cx + bottomOuterHalfW,
          baseBottomY - 12
        );
        ctx.lineTo(cx + topOuterHalfW, rimTopY);
        ctx.closePath();
      };

      traceOuterGlassBody();
      const glassBodyGrad = ctx.createLinearGradient(
        cx - topOuterHalfW,
        rimTopY,
        cx + topOuterHalfW,
        rimTopY
      );
      glassBodyGrad.addColorStop(0, 'rgba(255, 255, 255, 0.68)');
      glassBodyGrad.addColorStop(0.18, 'rgba(245, 247, 248, 0.32)');
      glassBodyGrad.addColorStop(0.5, 'rgba(232, 236, 238, 0.22)');
      glassBodyGrad.addColorStop(0.82, 'rgba(245, 247, 248, 0.35)');
      glassBodyGrad.addColorStop(1, 'rgba(255, 255, 255, 0.72)');
      ctx.fillStyle = glassBodyGrad;
      ctx.fill();

      // 3. Thick Crystal Glass Base Refraction Rings (between scaleBottomY and baseBottomY)
      const baseGlowGrad = ctx.createRadialGradient(
        cx,
        baseBottomY - 4,
        8,
        cx,
        baseBottomY - 4,
        bottomOuterHalfW
      );
      baseGlowGrad.addColorStop(0, activeTheme.baseGlow);
      baseGlowGrad.addColorStop(0.7, 'rgba(210, 220, 225, 0.38)');
      baseGlowGrad.addColorStop(1, 'rgba(150, 165, 175, 0.55)');
      ctx.fillStyle = baseGlowGrad;
      ctx.beginPath();
      ctx.ellipse(cx, baseBottomY - 6, bottomOuterHalfW - 2, 13, 0, 0, Math.PI * 2);
      ctx.fill();

      // Inner glass floor ellipse at scaleBottomY (0% line)
      ctx.strokeStyle = 'rgba(160, 172, 180, 0.55)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.ellipse(cx, scaleBottomY, getInnerHalfW(scaleBottomY), 10.5, 0, 0, Math.PI * 2);
      ctx.stroke();

      // 4. Clip to Inner Chamber for Liquid & Rising Bubbles
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx - getInnerHalfW(rimTopY), rimTopY);
      ctx.lineTo(cx - getInnerHalfW(scaleBottomY), scaleBottomY);
      ctx.ellipse(
        cx,
        scaleBottomY,
        getInnerHalfW(scaleBottomY),
        10.5,
        0,
        Math.PI,
        0,
        true
      );
      ctx.lineTo(cx + getInnerHalfW(rimTopY), rimTopY);
      ctx.closePath();
      ctx.clip();

      const maxLiquidHeight = scaleBottomY - scaleTopY;
      const currentLiquidHeight = rawRemainingRatio * maxLiquidHeight;
      const surfaceY = scaleBottomY - currentLiquidHeight;
      const surfaceHalfW = getInnerHalfW(surfaceY);

      if (rawRemainingRatio > 0.002) {
        const waveAmp =
          reducedMotion || status === 'paused'
            ? 0
            : status === 'running'
            ? 2.6
            : 1.2;

        // --- 4A. MAIN LIQUID BODY ---
        const liqGrad = ctx.createLinearGradient(cx, surfaceY, cx, scaleBottomY + 12);
        liqGrad.addColorStop(0, activeTheme.topColor);
        liqGrad.addColorStop(0.48, activeTheme.midColor);
        liqGrad.addColorStop(1, activeTheme.bottomColor);

        ctx.fillStyle = liqGrad;
        ctx.beginPath();
        const leftX = cx - surfaceHalfW - 4;
        const rightX = cx + surfaceHalfW + 4;
        ctx.moveTo(leftX, surfaceY);

        // Smooth wave curve across the top of the liquid body
        const segments = 24;
        for (let i = 0; i <= segments; i++) {
          const frac = i / segments;
          const x = leftX + frac * (rightX - leftX);
          const waveY =
            surfaceY +
            Math.sin(frac * Math.PI * 2.5 + wavePhaseRef.current) * waveAmp +
            Math.cos(frac * Math.PI * 1.5 - wavePhaseRef.current * 0.7) * (waveAmp * 0.5);
          ctx.lineTo(x, waveY);
        }

        ctx.lineTo(cx + getInnerHalfW(scaleBottomY) + 6, scaleBottomY + 14);
        ctx.lineTo(cx - getInnerHalfW(scaleBottomY) - 6, scaleBottomY + 14);
        ctx.closePath();
        ctx.fill();

        // Subtle internal side lighting inside the liquid
        const sideLightGrad = ctx.createLinearGradient(
          cx - surfaceHalfW,
          surfaceY,
          cx + surfaceHalfW,
          surfaceY
        );
        sideLightGrad.addColorStop(0, 'rgba(255, 255, 255, 0.22)');
        sideLightGrad.addColorStop(0.25, 'rgba(255, 255, 255, 0.04)');
        sideLightGrad.addColorStop(0.75, 'rgba(0, 0, 0, 0.06)');
        sideLightGrad.addColorStop(1, 'rgba(255, 255, 255, 0.18)');
        ctx.fillStyle = sideLightGrad;
        ctx.fillRect(
          cx - surfaceHalfW - 4,
          surfaceY - 4,
          surfaceHalfW * 2 + 8,
          currentLiquidHeight + 18
        );

        // --- 4B. RISING BUBBLES ---
        if (currentLiquidHeight > 14) {
          const isAnimatingBubbles =
            !reducedMotion && (status === 'running' || status === 'idle');

          for (let i = 0; i < bubblesRef.current.length; i++) {
            const b = bubblesRef.current[i];
            if (isAnimatingBubbles) {
              const speedMultiplier = status === 'running' ? 1.0 : 0.45;
              b.yRatio += b.speed * speedMultiplier * dt;
              if (b.yRatio >= 0.98) {
                b.yRatio = 0.02 + Math.random() * 0.08;
              }
            }

            const by = scaleBottomY - 6 - b.yRatio * (currentLiquidHeight - 10);
            if (by > surfaceY + 4 && by < scaleBottomY - 3) {
              const localHalfW = getInnerHalfW(by) * 0.82;
              const wobbleX = reducedMotion
                ? 0
                : Math.sin(wavePhaseRef.current * 1.4 + b.wobblePhase + b.yRatio * 5) *
                  b.wobbleAmp;
              const bx = cx + b.x * localHalfW + wobbleX;

              ctx.save();
              ctx.globalAlpha = b.alpha;
              ctx.fillStyle = activeTheme.bubbleFill;
              ctx.strokeStyle = activeTheme.bubbleStroke;
              ctx.lineWidth = 1.1;
              ctx.beginPath();
              ctx.arc(bx, by, b.radius, 0, Math.PI * 2);
              ctx.fill();
              ctx.stroke();

              // Tiny specular reflection dot on top-left of each bubble
              if (b.radius >= 2.2) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                ctx.beginPath();
                ctx.arc(
                  bx - b.radius * 0.32,
                  by - b.radius * 0.32,
                  Math.max(0.8, b.radius * 0.26),
                  0,
                  Math.PI * 2
                );
                ctx.fill();
              }
              ctx.restore();
            }
          }
        }

        // --- 4C. 3D MENISCUS TOP SURFACE ELLIPSE ---
        const meniscusRy = Math.max(7, Math.min(13.5, surfaceHalfW * 0.12));
        const meniscusWaveOffset =
          reducedMotion || status === 'paused'
            ? 0
            : Math.sin(wavePhaseRef.current) * (waveAmp * 0.45);

        const meniscusGrad = ctx.createRadialGradient(
          cx - surfaceHalfW * 0.18,
          surfaceY + meniscusWaveOffset - 2,
          4,
          cx,
          surfaceY + meniscusWaveOffset,
          surfaceHalfW
        );
        meniscusGrad.addColorStop(0, activeTheme.surfaceInner);
        meniscusGrad.addColorStop(0.7, activeTheme.surfaceOuter);
        meniscusGrad.addColorStop(1, activeTheme.topColor);

        ctx.fillStyle = meniscusGrad;
        ctx.beginPath();
        ctx.ellipse(
          cx,
          surfaceY + meniscusWaveOffset,
          Math.max(4, surfaceHalfW),
          meniscusRy,
          0,
          0,
          Math.PI * 2
        );
        ctx.fill();

        // Meniscus bright liquid rim highlight
        ctx.strokeStyle = activeTheme.surfaceRim;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.ellipse(
          cx,
          surfaceY + meniscusWaveOffset,
          Math.max(4, surfaceHalfW - 0.5),
          meniscusRy,
          0,
          0,
          Math.PI * 2
        );
        ctx.stroke();

        // Subtle surface ripple rings on the meniscus
        if (!reducedMotion && (status === 'running' || status === 'idle')) {
          const rippleFrac = (wavePhaseRef.current * 0.35) % 1;
          ctx.strokeStyle = `rgba(255, 255, 255, ${(1 - rippleFrac) * 0.45})`;
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          ctx.ellipse(
            cx,
            surfaceY + meniscusWaveOffset,
            surfaceHalfW * (0.2 + rippleFrac * 0.55),
            meniscusRy * (0.2 + rippleFrac * 0.55),
            0,
            0,
            Math.PI * 2
          );
          ctx.stroke();
        }
      }

      ctx.restore(); // End inner liquid clip

      // 5. Glass Rim, Outer Walls & Specular Reflections
      traceOuterGlassBody();
      ctx.strokeStyle = 'rgba(130, 142, 148, 0.72)';
      ctx.lineWidth = 2.2;
      ctx.stroke();

      // Top Glass Rim 3D Ellipse
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.strokeStyle = 'rgba(120, 132, 138, 0.85)';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.ellipse(cx, rimTopY, topOuterHalfW, 13, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Inner rim highlight line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(cx, rimTopY, topOuterHalfW - 2.5, 11.5, 0, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.stroke();

      // Left vertical glass specular highlight ribbon
      ctx.save();
      const leftHighlightGrad = ctx.createLinearGradient(0, rimTopY + 18, 0, scaleBottomY - 10);
      leftHighlightGrad.addColorStop(0, 'rgba(255, 255, 255, 0.82)');
      leftHighlightGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.55)');
      leftHighlightGrad.addColorStop(1, 'rgba(255, 255, 255, 0.75)');
      ctx.strokeStyle = leftHighlightGrad;
      ctx.lineWidth = 6.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(cx - topOuterHalfW + 15, rimTopY + 22);
      ctx.lineTo(cx - bottomOuterHalfW + 15, scaleBottomY - 12);
      ctx.stroke();

      // Secondary thin left highlight
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(cx - topOuterHalfW + 25, rimTopY + 26);
      ctx.lineTo(cx - bottomOuterHalfW + 25, scaleBottomY - 16);
      ctx.stroke();

      // Right vertical glass specular reflection
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.52)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(cx + topOuterHalfW - 14, rimTopY + 22);
      ctx.lineTo(cx + bottomOuterHalfW - 14, scaleBottomY - 12);
      ctx.stroke();
      ctx.restore();

      // Thick Glass Base Internal Highlights
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.ellipse(
        cx,
        baseBottomY - 3,
        bottomOuterHalfW - 6,
        9,
        0,
        0.1 * Math.PI,
        0.9 * Math.PI
      );
      ctx.stroke();

      // 6. Right-Side Graduated Percentage Scale (100%, 75%, 50%, 25%, 0%)
      const scaleX = cx + topOuterHalfW + 16;
      ctx.save();
      ctx.strokeStyle = 'rgba(65, 75, 70, 0.55)';
      ctx.fillStyle = 'rgba(45, 54, 49, 0.82)';
      ctx.lineWidth = 1.3;
      ctx.font = '600 11px Inter, system-ui, sans-serif';
      ctx.textBaseline = 'middle';

      // Vertical spine line of the scale
      ctx.beginPath();
      ctx.moveTo(scaleX, scaleTopY);
      ctx.lineTo(scaleX, scaleBottomY);
      ctx.stroke();

      const totalTicks = 20; // Every 5%
      for (let i = 0; i <= totalTicks; i++) {
        const frac = i / totalTicks; // 0 at top (100%), 1 at bottom (0%)
        const ty = scaleTopY + frac * (scaleBottomY - scaleTopY);
        const isMajor = i % 5 === 0; // 100%, 75%, 50%, 25%, 0%
        const tickLen = isMajor ? 10 : 5.5;

        ctx.beginPath();
        ctx.moveTo(scaleX, ty);
        ctx.lineTo(scaleX + tickLen, ty);
        ctx.stroke();

        if (isMajor) {
          const pctLabel = `${100 - i * 5}%`;
          ctx.fillText(pctLabel, scaleX + tickLen + 6, ty);
        }
      }
      ctx.restore();

      ctx.restore();

      if ((status === 'running' || status === 'idle') && !reducedMotion) {
        animId = requestAnimationFrame(renderFrame);
      }
    };

    animId = requestAnimationFrame(renderFrame);
    return () => cancelAnimationFrame(animId);
  }, [
    remainingMs,
    totalDurationMs,
    status,
    activeTheme,
    reducedMotion,
    isFullscreen,
  ]);

  // Format MM:SS
  const totalRemSeconds = Math.ceil(remainingMs / 1000);
  const displayMins = Math.floor(totalRemSeconds / 60);
  const displaySecs = totalRemSeconds % 60;
  const formattedMins = String(displayMins).padStart(2, '0');
  const formattedSecs = String(displaySecs).padStart(2, '0');

  return (
    <div className="space-y-12">
      {/* MAIN LIQUID TIMER CARD */}
      <div
        ref={toolCardRef}
        className={`rounded-2xl border border-[#E4E1D9] dark:border-[#2D352F] bg-white dark:bg-[#1A201C] p-5 sm:p-8 shadow-xs transition-all ${
          isFullscreen
            ? 'timer-fullscreen-stage p-4 sm:p-8 flex flex-col items-center justify-center bg-[#F7F6F2] dark:bg-[#141816] select-none'
            : ''
        }`}
      >
        {isFullscreen ? (
          /* =================================================================== */
          /* FULL SCREEN DISPLAY — ONLY VISUAL, TIME, AND EXIT IN CORNER         */
          /* =================================================================== */
          <div className="relative w-full h-full flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-10 md:gap-16 px-4 py-2">
            {/* Exit Fullscreen in Top-Right Corner */}
            <button
              type="button"
              onClick={handleExitFullscreen}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2 px-4 py-2 rounded-xl bg-black/65 hover:bg-black/85 text-white text-xs sm:text-sm font-semibold shadow-md transition-all cursor-pointer z-50"
              aria-label="Exit fullscreen"
            >
              <Minimize2 className="w-4 h-4" />
              <span>Exit Fullscreen</span>
            </button>

            {/* High-Resolution Liquid Beaker Visual */}
            <div className="flex items-center justify-center h-[52dvh] sm:h-[78dvh] max-h-[340px] sm:max-h-[82dvh] max-w-[78vw] sm:max-w-[46vw] aspect-[390/430] shrink-0">
              <canvas
                ref={canvasRef}
                width={624}
                height={688}
                aria-label={`Interactive liquid countdown timer (${activeTheme.name}) showing ${formattedMins} minutes and ${formattedSecs} seconds remaining`}
                className="h-full w-auto max-w-full object-contain select-none"
              />
            </div>

            {/* Clean Tabular Time Readout */}
            <div className="flex flex-col items-center justify-center text-center">
              <div className="text-[clamp(2.5rem,11vmin,7.5rem)] font-extrabold tracking-tight tabular-nums text-[#1D2420] dark:text-white leading-none font-mono">
                {formattedMins}:{formattedSecs}
              </div>
            </div>
          </div>
        ) : (
          /* =================================================================== */
          /* NORMAL 3-COLUMN DISPLAY + CHOOSE A LIQUID STYLE SELECTOR            */
          /* =================================================================== */
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* LEFT COLUMN (lg:col-span-5): Realistic Glass Container with Liquid & Scale */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center rounded-2xl bg-[#F4F2EC] dark:bg-[#1E2420] border border-[#E8E4DA] dark:border-[#2B332E] p-4 sm:p-6 min-h-[420px] relative">
                <canvas
                  ref={canvasRef}
                  width={390}
                  height={430}
                  aria-label={`Interactive liquid countdown timer (${activeTheme.name}) showing ${formattedMins} minutes and ${formattedSecs} seconds remaining`}
                  className="w-full max-w-[370px] h-auto select-none"
                />
                {status === 'completed' && (
                  <div className="mt-2 px-4 py-1.5 rounded-full bg-[#365C4B] text-white text-xs font-bold tracking-wide uppercase animate-pulse">
                    Time&apos;s Up! Container Empty
                  </div>
                )}
              </div>

              {/* CENTER COLUMN (lg:col-span-4): Timer Controls */}
              <div className="lg:col-span-4 space-y-5">
                {/* Duration / End Time Tabs */}
                <div className="grid grid-cols-2 rounded-xl bg-[#EFECE6] dark:bg-[#252C27] p-1 border border-[#E4E1D9] dark:border-[#2D352F]">
                  <button
                    type="button"
                    onClick={() => setTimerMode('duration')}
                    className={`py-2.5 px-4 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      timerMode === 'duration'
                        ? 'bg-[#265641] text-white shadow-2xs'
                        : 'text-[#252B27]/75 dark:text-slate-300 hover:text-[#252B27]'
                    }`}
                  >
                    Duration
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimerMode('endTime')}
                    className={`py-2.5 px-4 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      timerMode === 'endTime'
                        ? 'bg-[#265641] text-white shadow-2xs'
                        : 'text-[#252B27]/75 dark:text-slate-300 hover:text-[#252B27]'
                    }`}
                  >
                    End Time
                  </button>
                </div>

                {timerMode === 'duration' ? (
                  <>
                    {/* 1, 3, 5, 10, 15 min Preset Buttons */}
                    <div className="grid grid-cols-5 gap-2">
                      {PRESET_BUTTONS.map((preset) => {
                        const isSelected = selectedPresetLabel === preset.label;
                        return (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => applyDurationMinutes(preset.minutes, preset.label)}
                            className={`py-2 px-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer whitespace-nowrap ${
                              isSelected
                                ? 'bg-[#265641] text-white border-[#265641] shadow-2xs'
                                : 'bg-[#F9F8F5] dark:bg-[#222924] text-[#252B27] dark:text-slate-200 border-[#E4E1D9] dark:border-[#323B35] hover:border-[#365C4B]'
                            }`}
                          >
                            {preset.label}
                          </button>
                        );
                      })}
                    </div>

                    {/* Custom Minutes Stepper Input */}
                    <div className="flex items-center gap-3">
                      <div className="inline-flex items-center rounded-xl border border-[#E4E1D9] dark:border-[#323B35] bg-[#F9F8F5] dark:bg-[#222924] overflow-hidden">
                        <input
                          ref={customInputRef}
                          type="number"
                          min={1}
                          max={240}
                          aria-label="Duration in minutes"
                          value={customMinutes}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            if (!Number.isNaN(val)) {
                              applyDurationMinutes(val, 'Custom');
                            }
                          }}
                          className="w-16 py-2.5 pl-3.5 pr-1 text-base font-bold text-[#252B27] dark:text-white bg-transparent focus:outline-none tabular-nums"
                        />
                        <div className="flex flex-col border-l border-[#E4E1D9] dark:border-[#323B35] px-1.5 py-0.5">
                          <button
                            type="button"
                            aria-label="Increase minutes"
                            onClick={() => applyDurationMinutes(customMinutes + 1, 'Custom')}
                            className="text-[#252B27]/70 dark:text-slate-300 hover:text-[#365C4B] cursor-pointer"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            aria-label="Decrease minutes"
                            onClick={() =>
                              applyDurationMinutes(Math.max(1, customMinutes - 1), 'Custom')
                            }
                            className="text-[#252B27]/70 dark:text-slate-300 hover:text-[#365C4B] cursor-pointer"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-[#252B27]/75 dark:text-slate-300">
                        minutes
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <label
                      htmlFor="liquid-end-time"
                      className="block text-xs font-semibold text-[#252B27]/75 dark:text-slate-300"
                    >
                      Select Target End Time
                    </label>
                    <input
                      id="liquid-end-time"
                      type="time"
                      value={endTimeStr}
                      onChange={(e) => handleEndTimeChange(e.target.value)}
                      className="w-full rounded-xl border border-[#E4E1D9] dark:border-[#323B35] bg-[#F9F8F5] dark:bg-[#222924] px-4 py-2.5 text-sm font-bold text-[#252B27] dark:text-white focus:outline-none focus:border-[#365C4B]"
                    />
                  </div>
                )}

                {/* Primary Start Button */}
                <button
                  type="button"
                  onClick={status === 'running' ? handlePause : handleStart}
                  className="w-full py-3.5 px-6 rounded-xl bg-[#265641] hover:bg-[#1E4634] text-white font-bold text-base flex items-center justify-center gap-2.5 shadow-xs transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>
                    {status === 'running'
                      ? 'Running...'
                      : status === 'paused'
                      ? 'Resume'
                      : 'Start'}
                  </span>
                </button>

                {/* Secondary Pause & Reset Row */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handlePause}
                    disabled={status !== 'running'}
                    className="py-2.5 px-4 rounded-xl bg-[#EFECE6] dark:bg-[#252C27] hover:bg-[#E4E0D8] dark:hover:bg-[#2E3731] disabled:opacity-50 text-[#252B27] dark:text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Pause className="w-4 h-4 fill-current" />
                    <span>Pause</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="py-2.5 px-4 rounded-xl bg-[#EFECE6] dark:bg-[#252C27] hover:bg-[#E4E0D8] dark:hover:bg-[#2E3731] text-[#252B27] dark:text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset</span>
                  </button>
                </div>

                {/* Sound Alert / Fullscreen / Show Time Controls Row */}
                <div className="pt-2 border-t border-[#E4E1D9] dark:border-[#2D352F] flex flex-wrap items-center justify-between gap-3 text-xs font-medium text-[#252B27] dark:text-slate-200">
                  {/* Sound Alert Toggle */}
                  <div className="flex items-center gap-2">
                    <Bell className="w-3.5 h-3.5 text-[#365C4B] dark:text-[#5E917A]" />
                    <span>Sound Alert</span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={soundAlert}
                      aria-label="Toggle sound alert"
                      onClick={() => setSoundAlert((prev) => !prev)}
                      className={`w-9 h-5 rounded-full transition-colors p-0.5 cursor-pointer ${
                        soundAlert ? 'bg-[#365C4B]' : 'bg-[#D2CEC4] dark:bg-slate-600'
                      }`}
                    >
                      <span
                        className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                          soundAlert ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Fullscreen Button */}
                  <button
                    type="button"
                    onClick={handleToggleFullscreen}
                    className="inline-flex items-center gap-1.5 text-[#252B27] dark:text-slate-200 hover:text-[#365C4B] transition-colors cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-[#365C4B]" />
                    <span>Fullscreen</span>
                  </button>

                  {/* Show Time Toggle */}
                  <div className="flex items-center gap-2">
                    <Eye className="w-3.5 h-3.5 text-[#365C4B] dark:text-[#5E917A]" />
                    <span>Show Time</span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={showTime}
                      aria-label="Toggle digital time display"
                      onClick={() => setShowTime((prev) => !prev)}
                      className={`w-9 h-5 rounded-full transition-colors p-0.5 cursor-pointer ${
                        showTime ? 'bg-[#365C4B]' : 'bg-[#D2CEC4] dark:bg-slate-600'
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

                {/* Reduced Motion Toggle */}
                <div className="flex items-start gap-3 pt-1">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={reducedMotion}
                    aria-label="Toggle reduced motion"
                    onClick={() => setReducedMotion((prev) => !prev)}
                    className={`mt-0.5 w-9 h-5 rounded-full transition-colors p-0.5 shrink-0 cursor-pointer ${
                      reducedMotion ? 'bg-[#365C4B]' : 'bg-[#D2CEC4] dark:bg-slate-600'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                        reducedMotion ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                  <div>
                    <div className="text-xs font-bold text-[#252B27] dark:text-white">
                      Reduced Motion
                    </div>
                    <p className="text-[11px] text-[#252B27]/65 dark:text-slate-400 leading-snug">
                      Smooth level transition without rising bubbles or surface waves.
                    </p>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN (lg:col-span-3): Digital Time Readout + Tip Box */}
              <div className="lg:col-span-3 space-y-5">
                {/* Time Left Card */}
                <div className="rounded-2xl bg-[#EBF0EC] dark:bg-[#1E2722] border border-[#DCE5DD] dark:border-[#2C3931] p-6 text-center flex flex-col items-center justify-center min-h-[215px]">
                  <span className="text-xs font-semibold text-[#252B27]/80 dark:text-slate-300 mb-3">
                    Time Left
                  </span>
                  {showTime ? (
                    <>
                      <div className="text-5xl sm:text-6xl font-bold tracking-tight tabular-nums text-[#1D2420] dark:text-white leading-none mb-2">
                        {formattedMins}:{formattedSecs}
                      </div>
                      <div className="flex items-center justify-center gap-8 text-xs text-[#252B27]/65 dark:text-slate-400 font-medium">
                        <span>minutes</span>
                        <span>seconds</span>
                      </div>
                    </>
                  ) : (
                    <div className="py-4 space-y-2">
                      <p className="text-xs text-[#252B27]/70 dark:text-slate-300 leading-relaxed">
                        Digital countdown hidden so you can focus purely on the liquid level.
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowTime(true)}
                        className="text-xs font-semibold text-[#365C4B] dark:text-[#5E917A] underline cursor-pointer"
                      >
                        Show digital time
                      </button>
                    </div>
                  )}
                </div>

                {/* Warm Amber Tip Box */}
                <div className="rounded-2xl bg-[#FAF3E8] dark:bg-[#24201A] border border-[#EEDEC5] dark:border-[#3A3227] p-5">
                  <div className="flex items-center gap-2 mb-2 text-[#B7804C]">
                    <Lightbulb className="w-4 h-4 fill-current shrink-0" />
                    <span className="font-serif italic font-bold text-sm text-[#252B27] dark:text-white">
                      Tip
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                    Use a liquid timer for study sessions, classroom transitions, cooking tasks and short breaks.
                  </p>
                </div>
              </div>
            </div>

            {/* CHOOSE A LIQUID STYLE ROW (Inside Main Card, matching reference screenshot) */}
            <div className="pt-4 border-t border-[#E4E1D9] dark:border-[#2D352F]">
              <h2 className="text-sm sm:text-base font-bold text-[#252B27] dark:text-white mb-3.5">
                Choose a Liquid Style
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
                {LIQUID_THEMES.map((theme) => {
                  const isSelected = selectedThemeId === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setSelectedThemeId(theme.id)}
                      className={`rounded-xl p-3 border text-center transition-all cursor-pointer flex flex-col items-center justify-between ${
                        isSelected
                          ? 'bg-[#EEF4F0] dark:bg-[#1E2923] border-[#365C4B] ring-1 ring-[#365C4B]/30 shadow-2xs'
                          : 'bg-[#FAF9F6] dark:bg-[#1E2420] border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#365C4B]'
                      }`}
                    >
                      <MiniLiquidGlassThumb theme={theme} />
                      <span className="mt-1.5 text-xs font-semibold text-[#252B27] dark:text-white">
                        {theme.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* QUICK PRESETS SECTION */}
      <div>
        <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#252B27] dark:text-white mb-1">
          Quick Presets
        </h2>
        <p className="text-xs sm:text-sm text-[#252B27]/70 dark:text-slate-400 mb-5">
          Start with a common time or set a custom duration.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {QUICK_PRESET_CARDS.map((card) => {
            const isSelected =
              (!card.isCustom && selectedPresetLabel === `${card.minutes} min`) ||
              (card.isCustom && selectedPresetLabel === 'Custom');
            return (
              <button
                key={card.label}
                type="button"
                onClick={() => {
                  if (card.isCustom) {
                    setTimerMode('duration');
                    setSelectedPresetLabel('Custom');
                    customInputRef.current?.focus();
                  } else {
                    setTimerMode('duration');
                    applyDurationMinutes(card.minutes, `${card.minutes} min`);
                  }
                }}
                className={`text-left rounded-2xl p-4 border transition-all flex items-center gap-3.5 cursor-pointer ${
                  isSelected
                    ? 'bg-white dark:bg-[#1E2722] border-[#365C4B] shadow-xs ring-1 ring-[#365C4B]/20'
                    : 'bg-white dark:bg-[#1A201C] border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#365C4B]'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-[#FAF3E8] dark:bg-[#26231D] text-[#B7804C] flex items-center justify-center shrink-0">
                  {card.isCustom ? (
                    <Settings className="w-4 h-4 text-[#365C4B]" />
                  ) : (
                    <Clock className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-[#252B27] dark:text-white">
                    {card.label}
                  </div>
                  <div className="text-[11px] text-[#252B27]/65 dark:text-slate-400">
                    {card.sublabel}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* POPULAR USES SECTION */}
      <div className="rounded-2xl bg-[#E7EDE7]/65 dark:bg-[#1C231F] border border-[#D8E2D8] dark:border-[#29332D] p-6 sm:p-8">
        <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#252B27] dark:text-white mb-1">
          Popular Uses
        </h2>
        <p className="text-xs sm:text-sm text-[#252B27]/70 dark:text-slate-400 mb-6">
          A liquid timer is useful in many everyday situations.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {POPULAR_USES.map((useItem) => {
            const IconComp = useItem.icon;
            return (
              <button
                key={useItem.title}
                type="button"
                onClick={() => {
                  setTimerMode('duration');
                  applyDurationMinutes(useItem.minutes, `${useItem.minutes} min`);
                  toolCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                className="text-left rounded-2xl bg-white dark:bg-[#1A201C] border border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#365C4B] p-4 sm:p-5 flex items-start gap-3.5 shadow-2xs transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#E7EDE7] dark:bg-[#252E28] text-[#365C4B] dark:text-[#5E917A] flex items-center justify-center shrink-0 group-hover:bg-[#365C4B] group-hover:text-white transition-colors">
                  <IconComp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-[#252B27] dark:text-white mb-1 group-hover:text-[#365C4B] transition-colors">
                    {useItem.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#252B27]/70 dark:text-slate-400 leading-relaxed">
                    {useItem.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

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
  Hourglass,
  Settings,
  Dices,
  GraduationCap,
  ChefHat,
  Leaf,
  Laptop,
  Lightbulb,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { playTimerSound } from '@/lib/sound';
import { requestWakeLock, releaseWakeLock } from '@/lib/wakelock';

export type AnimationSpeed = 'slow' | 'normal' | 'fast';

interface SandParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
}

interface GrainSpeck {
  rx: number; // normalized -1 to 1 across bulb width at ry
  ry: number; // normalized 0 to 1 height
  size: number;
  shade: string;
}

const PRESET_BUTTONS = [
  { label: '1 min', minutes: 1, seconds: 60 },
  { label: '3 min', minutes: 3, seconds: 180 },
  { label: '5 min', minutes: 5, seconds: 300 },
  { label: '10 min', minutes: 10, seconds: 600 },
  { label: '15 min', minutes: 15, seconds: 900 },
];

const QUICK_PRESET_CARDS = [
  { label: '1 Minute', sublabel: 'Quick tasks', minutes: 1, seconds: 60, isCustom: false },
  { label: '3 Minutes', sublabel: 'Short activities', minutes: 3, seconds: 180, isCustom: false },
  { label: '5 Minutes', sublabel: 'Game turns', minutes: 5, seconds: 300, isCustom: false },
  { label: '10 Minutes', sublabel: 'Focused work', minutes: 10, seconds: 600, isCustom: false },
  { label: '15 Minutes', sublabel: 'Longer breaks', minutes: 15, seconds: 900, isCustom: false },
  { label: 'Custom', sublabel: 'Set your own time', minutes: 5, seconds: 300, isCustom: true },
];

const POPULAR_USES = [
  {
    title: 'Board Games',
    description: 'Keep game turns fair and fun.',
    icon: Dices,
    minutes: 3,
  },
  {
    title: 'Classroom Activities',
    description: 'Manage activities and transitions.',
    icon: GraduationCap,
    minutes: 5,
  },
  {
    title: 'Cooking',
    description: 'Time recipes and kitchen tasks.',
    icon: ChefHat,
    minutes: 10,
  },
  {
    title: 'Meditation',
    description: 'Set a calm and focused timer.',
    icon: Leaf,
    minutes: 15,
  },
  {
    title: 'Work Breaks',
    description: 'Use for Pomodoro and short breaks.',
    icon: Laptop,
    minutes: 5,
  },
];

// Deterministic grain texture specks so the sand volumes look genuinely granular
const STATIC_SPECKS: GrainSpeck[] = Array.from({ length: 220 }, (_, i) => {
  const seed1 = Math.sin(i * 12.9898) * 43758.5453;
  const seed2 = Math.cos(i * 78.233) * 29432.1234;
  const r1 = seed1 - Math.floor(seed1);
  const r2 = seed2 - Math.floor(seed2);
  const shades = ['#FFF3D1', '#F7D794', '#C48329', '#9E6314', '#E6B25A'];
  return {
    rx: (r1 - 0.5) * 1.85,
    ry: r2,
    size: 1 + (i % 3) * 0.55,
    shade: shades[i % shades.length],
  };
});

export default function SandTimerComponent() {
  // Mode: duration vs end time
  const [timerMode, setTimerMode] = useState<'duration' | 'endTime'>('duration');

  // Duration state (default 5 minutes to match reference screenshot)
  const [customMinutes, setCustomMinutes] = useState<number>(5);
  const [selectedPresetLabel, setSelectedPresetLabel] = useState<string>('5 min');
  const [totalDurationMs, setTotalDurationMs] = useState<number>(5 * 60 * 1000);
  const [remainingMs, setRemainingMs] = useState<number>(5 * 60 * 1000);
  const [status, setStatus] = useState<'idle' | 'running' | 'paused' | 'completed'>('idle');

  // End time input string ("HH:MM")
  const [endTimeStr, setEndTimeStr] = useState<string>(() => {
    const target = new Date(Date.now() + 5 * 60 * 1000);
    return `${String(target.getHours()).padStart(2, '0')}:${String(target.getMinutes()).padStart(2, '0')}`;
  });

  // Toggles & Accessibility settings
  const [soundAlert, setSoundAlert] = useState<boolean>(true);
  const [showTime, setShowTime] = useState<boolean>(true);
  const [animationSpeed, setAnimationSpeed] = useState<AnimationSpeed>('normal');
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Refs for timer loop and canvas rendering
  const toolCardRef = useRef<HTMLDivElement>(null);
  const customInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const endTimeTimestampRef = useRef<number>(0);
  const pausedRemainingMsRef = useRef<number>(5 * 60 * 1000);
  const particlesRef = useRef<SandParticle[]>([]);
  const lastFrameTimeRef = useRef<number>(0);

  // Sync fullscreen change listener
  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
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
    particlesRef.current = [];
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

  // Helper: compute horizontal half-width of the glass bulb at any vertical y
  const getGlassHalfWidth = (y: number, topY: number, neckY: number, bottomY: number, maxR: number, neckR: number) => {
    if (y <= neckY) {
      // Upper bulb: normalized t from 0 (neck) to 1 (topY)
      const t = Math.max(0, Math.min(1, (neckY - y) / (neckY - topY)));
      // Smooth bell curve profile matching blown glass
      const profile = Math.sin(t * Math.PI * 0.58);
      return neckR + (maxR - neckR) * Math.pow(profile, 0.82);
    } else {
      // Lower bulb: normalized t from 0 (neck) to 1 (bottomY)
      const t = Math.max(0, Math.min(1, (y - neckY) / (bottomY - neckY)));
      const profile = Math.sin(t * Math.PI * 0.58);
      return neckR + (maxR - neckR) * Math.pow(profile, 0.82);
    }
  };

  // Main Canvas Animation & Hourglass Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const renderFrame = (timestamp: number) => {
      const dt = lastFrameTimeRef.current ? Math.min(0.05, (timestamp - lastFrameTimeRef.current) / 1000) : 0.016;
      lastFrameTimeRef.current = timestamp;

      const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 2, 3) : 2;
      const scaleFactor = isFullscreen ? 1.65 : 1.0;
      const baseWidth = 360;
      const baseHeight = 460;
      const cssWidth = baseWidth * scaleFactor;
      const cssHeight = baseHeight * scaleFactor;

      if (canvas.width !== Math.round(cssWidth * dpr) || canvas.height !== Math.round(cssHeight * dpr)) {
        canvas.width = Math.round(cssWidth * dpr);
        canvas.height = Math.round(cssHeight * dpr);
      }

      ctx.save();
      ctx.scale(dpr * scaleFactor, dpr * scaleFactor);
      ctx.clearRect(0, 0, baseWidth, baseHeight);

      const cx = baseWidth / 2;
      const topCapY = 32;
      const glassTopY = 58;
      const neckY = 230;
      const glassBottomY = 402;
      const bottomCapY = 428;
      const maxBulbR = 94;
      const neckR = 8.5;

      const rawRemainingRatio = totalDurationMs > 0 ? Math.max(0, Math.min(1, remainingMs / totalDurationMs)) : 0;
      // When idle at 100% before starting, display the classic hourglass state (74% upper, 26% lower mound) matching the reference design;
      // while running, paused, or completed, follow the exact countdown ratio so the upper chamber empties completely at 00:00.
      const remainingRatio = status === 'idle' && rawRemainingRatio > 0.999 ? 0.74 : rawRemainingRatio;
      const elapsedRatio = 1 - remainingRatio;

      // 1. Soft Floor Shadow under the bottom wooden base
      const shadowGrad = ctx.createRadialGradient(cx, bottomCapY + 6, 15, cx, bottomCapY + 6, 132);
      shadowGrad.addColorStop(0, 'rgba(37, 43, 39, 0.34)');
      shadowGrad.addColorStop(0.65, 'rgba(37, 43, 39, 0.12)');
      shadowGrad.addColorStop(1, 'rgba(37, 43, 39, 0)');
      ctx.fillStyle = shadowGrad;
      ctx.beginPath();
      ctx.ellipse(cx, bottomCapY + 6, 130, 16, 0, 0, Math.PI * 2);
      ctx.fill();

      // Helper to build the inner glass path
      const traceGlassPath = (inset = 0) => {
        const rMax = maxBulbR - inset;
        const rNeck = Math.max(3, neckR - inset * 0.45);
        ctx.beginPath();
        ctx.moveTo(cx - rMax * 0.92, glassTopY);
        // Left upper bulb curve down to neck
        ctx.bezierCurveTo(
          cx - rMax * 1.12,
          glassTopY + 58,
          cx - rMax * 0.85,
          neckY - 46,
          cx - rNeck,
          neckY
        );
        // Left lower bulb curve from neck to bottom
        ctx.bezierCurveTo(
          cx - rMax * 0.85,
          neckY + 46,
          cx - rMax * 1.12,
          glassBottomY - 58,
          cx - rMax * 0.92,
          glassBottomY
        );
        // Bottom glass floor
        ctx.lineTo(cx + rMax * 0.92, glassBottomY);
        // Right lower bulb curve up to neck
        ctx.bezierCurveTo(
          cx + rMax * 1.12,
          glassBottomY - 58,
          cx + rMax * 0.85,
          neckY + 46,
          cx + rNeck,
          neckY
        );
        // Right upper bulb curve from neck to top
        ctx.bezierCurveTo(
          cx + rMax * 0.85,
          neckY - 46,
          cx + rMax * 1.12,
          glassTopY + 58,
          cx + rMax * 0.92,
          glassTopY
        );
        ctx.closePath();
      };

      // 2. Draw Glass Vessel Background Fill
      traceGlassPath(0);
      const glassBgGrad = ctx.createLinearGradient(cx - maxBulbR, glassTopY, cx + maxBulbR, glassBottomY);
      glassBgGrad.addColorStop(0, 'rgba(255, 255, 255, 0.55)');
      glassBgGrad.addColorStop(0.35, 'rgba(243, 240, 232, 0.28)');
      glassBgGrad.addColorStop(0.7, 'rgba(225, 220, 210, 0.35)');
      glassBgGrad.addColorStop(1, 'rgba(255, 255, 255, 0.6)');
      ctx.fillStyle = glassBgGrad;
      ctx.fill();

      // 3. Clip to Inner Glass Chamber for Sand & Particles
      ctx.save();
      traceGlassPath(4);
      ctx.clip();

      // --- 3A. UPPER SAND CHAMBER ---
      if (remainingRatio > 0.001) {
        // Nonlinear height mapping so curved chamber looks accurate and empties cleanly at 0
        const visualFillRatio = Math.pow(remainingRatio, 0.76);
        const maxUpperSandHeight = (neckY - glassTopY) * 0.82;
        const sandSurfaceY = neckY - visualFillRatio * maxUpperSandHeight;
        const surfaceHalfW = getGlassHalfWidth(sandSurfaceY, glassTopY, neckY, glassBottomY, maxBulbR - 4, neckR - 2);

        // Funnel indentation depth when draining
        const indentDepth =
          status === 'running' || (remainingRatio < 0.98 && remainingRatio > 0.05)
            ? Math.min(18, (neckY - sandSurfaceY) * 0.24)
            : 2;

        // Upper sand body gradient
        const upperSandGrad = ctx.createLinearGradient(cx - maxBulbR, sandSurfaceY, cx + maxBulbR, neckY);
        upperSandGrad.addColorStop(0, '#F1C57B');
        upperSandGrad.addColorStop(0.45, '#DFA44E');
        upperSandGrad.addColorStop(0.8, '#C88932');
        upperSandGrad.addColorStop(1, '#A96E1E');

        ctx.fillStyle = upperSandGrad;
        ctx.beginPath();
        ctx.moveTo(cx - surfaceHalfW - 6, sandSurfaceY);
        // Funnel dip across top surface
        ctx.quadraticCurveTo(cx, sandSurfaceY + indentDepth, cx + surfaceHalfW + 6, sandSurfaceY);
        ctx.lineTo(cx + maxBulbR, neckY + 2);
        ctx.lineTo(cx - maxBulbR, neckY + 2);
        ctx.closePath();
        ctx.fill();

        // Upper sand top surface ellipse / rim highlight
        const topSurfaceGrad = ctx.createRadialGradient(
          cx - surfaceHalfW * 0.2,
          sandSurfaceY + indentDepth * 0.3,
          2,
          cx,
          sandSurfaceY + indentDepth * 0.35,
          Math.max(10, surfaceHalfW)
        );
        topSurfaceGrad.addColorStop(0, '#BC7D27');
        topSurfaceGrad.addColorStop(0.55, '#E2AA56');
        topSurfaceGrad.addColorStop(1, '#F5CE8B');

        ctx.fillStyle = topSurfaceGrad;
        ctx.beginPath();
        ctx.ellipse(
          cx,
          sandSurfaceY + indentDepth * 0.22,
          Math.max(4, surfaceHalfW),
          Math.max(3, surfaceHalfW * 0.16),
          0,
          0,
          Math.PI * 2
        );
        ctx.fill();

        // Granular sand specks in upper chamber
        const upperHeight = neckY - sandSurfaceY;
        if (upperHeight > 6) {
          for (let i = 0; i < STATIC_SPECKS.length; i++) {
            const sp = STATIC_SPECKS[i];
            const sy = sandSurfaceY + indentDepth * 0.3 + sp.ry * (upperHeight - indentDepth * 0.3);
            if (sy >= sandSurfaceY + 2 && sy <= neckY - 2) {
              const hw = getGlassHalfWidth(sy, glassTopY, neckY, glassBottomY, maxBulbR - 6, neckR - 2);
              const sx = cx + sp.rx * hw * 0.48;
              ctx.fillStyle = sp.shade;
              ctx.fillRect(sx, sy, sp.size, sp.size);
            }
          }
        }
      }

      // --- 3B. LOWER SAND MOUND ---
      const maxLowerPileHeight = (glassBottomY - neckY) * 0.86;
      const pilePeakHeight = Math.pow(elapsedRatio, 0.82) * maxLowerPileHeight;
      const pilePeakY = glassBottomY - pilePeakHeight;

      if (elapsedRatio > 0.001) {
        const baseShoulderHeight = Math.pow(elapsedRatio, 1.05) * (maxLowerPileHeight * 0.52);
        const shoulderY = glassBottomY - baseShoulderHeight;

        const lowerSandGrad = ctx.createLinearGradient(cx - maxBulbR, pilePeakY, cx + maxBulbR, glassBottomY);
        lowerSandGrad.addColorStop(0, '#F6D18E');
        lowerSandGrad.addColorStop(0.38, '#E4AB55');
        lowerSandGrad.addColorStop(0.75, '#C88930');
        lowerSandGrad.addColorStop(1, '#A4691A');

        ctx.fillStyle = lowerSandGrad;
        ctx.beginPath();
        ctx.moveTo(cx - maxBulbR - 10, glassBottomY + 4);
        ctx.lineTo(cx - maxBulbR - 10, shoulderY);
        // Natural conical left slope up to the peak under the neck
        ctx.quadraticCurveTo(cx - maxBulbR * 0.34, pilePeakY + pilePeakHeight * 0.14, cx, pilePeakY);
        // Natural conical right slope down to right glass wall
        ctx.quadraticCurveTo(
          cx + maxBulbR * 0.34,
          pilePeakY + pilePeakHeight * 0.14,
          cx + maxBulbR + 10,
          shoulderY
        );
        ctx.lineTo(cx + maxBulbR + 10, glassBottomY + 4);
        ctx.closePath();
        ctx.fill();

        // Warm shadow on right side of the sand cone for 3D depth
        const coneShadowGrad = ctx.createLinearGradient(cx, pilePeakY, cx + maxBulbR, glassBottomY);
        coneShadowGrad.addColorStop(0, 'rgba(130, 78, 14, 0.05)');
        coneShadowGrad.addColorStop(1, 'rgba(110, 64, 10, 0.28)');
        ctx.fillStyle = coneShadowGrad;
        ctx.beginPath();
        ctx.moveTo(cx, pilePeakY);
        ctx.quadraticCurveTo(
          cx + maxBulbR * 0.34,
          pilePeakY + pilePeakHeight * 0.14,
          cx + maxBulbR + 10,
          shoulderY
        );
        ctx.lineTo(cx + maxBulbR + 10, glassBottomY + 4);
        ctx.lineTo(cx, glassBottomY + 4);
        ctx.closePath();
        ctx.fill();

        // Granular sand specks on the lower sand mound
        for (let i = 0; i < STATIC_SPECKS.length; i++) {
          const sp = STATIC_SPECKS[i];
          const sy = pilePeakY + 4 + sp.ry * (glassBottomY - pilePeakY - 4);
          if (sy > pilePeakY + 3 && sy < glassBottomY - 2) {
            const progressDownCone = (sy - pilePeakY) / Math.max(1, glassBottomY - pilePeakY);
            const coneHalfW = Math.min(
              maxBulbR - 6,
              8 + progressDownCone * maxBulbR * 0.95
            );
            const sx = cx + sp.rx * coneHalfW * 0.5;
            ctx.fillStyle = sp.shade;
            ctx.fillRect(sx, sy, sp.size, sp.size);
          }
        }
      }

      // --- 3C. FALLING SAND STREAM & PARTICLES ---
      const isFlowing = (status === 'running' || status === 'idle') && remainingRatio > 0;
      const speedMult = animationSpeed === 'slow' ? 0.55 : animationSpeed === 'fast' ? 1.75 : 1.0;

      if (isFlowing) {
        // Core golden stream thread from neck to lower cone peak
        const streamGrad = ctx.createLinearGradient(cx, neckY - 3, cx, pilePeakY + 4);
        streamGrad.addColorStop(0, 'rgba(235, 180, 92, 0.95)');
        streamGrad.addColorStop(0.5, 'rgba(244, 198, 118, 0.85)');
        streamGrad.addColorStop(1, 'rgba(224, 165, 76, 0.45)');

        ctx.strokeStyle = streamGrad;
        ctx.lineWidth = reducedMotion ? 2.8 : 2.2;
        ctx.beginPath();
        ctx.moveTo(cx, neckY - 2);
        ctx.lineTo(cx, Math.min(glassBottomY - 2, pilePeakY + 3));
        ctx.stroke();

        if (!reducedMotion) {
          // Spawn & update falling sand particles
          const targetCount = animationSpeed === 'fast' ? 95 : animationSpeed === 'slow' ? 55 : 75;
          const colors = ['#FCE2A6', '#F2C16B', '#DDA042', '#C98929', '#FFF1CE'];

          while (particlesRef.current.length < targetCount) {
            particlesRef.current.push({
              x: cx + (Math.random() - 0.5) * 4.2,
              y: neckY + Math.random() * Math.max(10, pilePeakY - neckY),
              vx: (Math.random() - 0.5) * 16,
              vy: (95 + Math.random() * 110) * speedMult,
              size: 1.3 + Math.random() * 1.4,
              color: colors[Math.floor(Math.random() * colors.length)],
              alpha: 0.75 + Math.random() * 0.25,
            });
          }

          for (let i = 0; i < particlesRef.current.length; i++) {
            const p = particlesRef.current[i];
            p.vy += 260 * speedMult * dt;
            p.x += p.vx * dt;
            p.y += p.vy * dt;

            // If particle reaches the lower sand cone peak, either bounce slightly down the slope or respawn at neck
            if (p.y >= pilePeakY + Math.abs(p.x - cx) * 0.45) {
              if (Math.random() < 0.32 && p.y < glassBottomY - 6 && Math.abs(p.x - cx) < 38) {
                // Roll/scatter along the cone slope
                const dir = p.x >= cx ? 1 : -1;
                p.vx = dir * (28 + Math.random() * 35) * speedMult;
                p.vy = (18 + Math.random() * 25) * speedMult;
              } else {
                // Respawn at the neck
                p.x = cx + (Math.random() - 0.5) * 4.0;
                p.y = neckY + Math.random() * 6;
                p.vx = (Math.random() - 0.5) * 14;
                p.vy = (85 + Math.random() * 85) * speedMult;
              }
            }

            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 0.65, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.globalAlpha = 1;
        }
      }

      ctx.restore(); // End inner glass clip

      // 4. Draw Glass Outer Contour & Realistic Specular Reflections
      traceGlassPath(0);
      ctx.strokeStyle = 'rgba(165, 156, 140, 0.65)';
      ctx.lineWidth = 2.2;
      ctx.stroke();

      // Left curved specular reflection ribbon (upper & lower bulbs)
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.72)';
      ctx.lineWidth = 5.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(cx - maxBulbR * 0.78, glassTopY + 18);
      ctx.bezierCurveTo(
        cx - maxBulbR * 0.94,
        glassTopY + 62,
        cx - maxBulbR * 0.68,
        neckY - 48,
        cx - neckR - 6,
        neckY - 14
      );
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx - neckR - 6, neckY + 14);
      ctx.bezierCurveTo(
        cx - maxBulbR * 0.68,
        neckY + 48,
        cx - maxBulbR * 0.94,
        glassBottomY - 62,
        cx - maxBulbR * 0.78,
        glassBottomY - 18
      );
      ctx.stroke();

      // Subtle right glass rim reflection
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.38)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx + maxBulbR * 0.76, glassTopY + 22);
      ctx.bezierCurveTo(
        cx + maxBulbR * 0.9,
        glassTopY + 64,
        cx + maxBulbR * 0.65,
        neckY - 46,
        cx + neckR + 5,
        neckY - 16
      );
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx + neckR + 5, neckY + 16);
      ctx.bezierCurveTo(
        cx + maxBulbR * 0.65,
        neckY + 46,
        cx + maxBulbR * 0.9,
        glassBottomY - 64,
        cx + maxBulbR * 0.76,
        glassBottomY - 22
      );
      ctx.stroke();
      ctx.restore();

      // 5. Draw Turned Wooden Top & Bottom Caps (Rich Walnut/Oak finish)
      const drawWoodenCap = (isTop: boolean) => {
        const yMain = isTop ? topCapY : glassBottomY;
        const capH = 26;
        const capW = maxBulbR * 2.18;
        const xLeft = cx - capW / 2;

        // Main wood cylinder gradient
        const woodGrad = ctx.createLinearGradient(xLeft, yMain, xLeft + capW, yMain);
        woodGrad.addColorStop(0, '#3D2210');
        woodGrad.addColorStop(0.18, '#6E411F');
        woodGrad.addColorStop(0.38, '#9C6334');
        woodGrad.addColorStop(0.55, '#855027');
        woodGrad.addColorStop(0.82, '#593316');
        woodGrad.addColorStop(1, '#311A0B');

        // Outer wider wooden tier
        ctx.fillStyle = woodGrad;
        ctx.beginPath();
        ctx.roundRect(xLeft, yMain, capW, capH, isTop ? [12, 12, 5, 5] : [5, 5, 12, 12]);
        ctx.fill();

        // Inner stepped wooden collar next to glass
        const collarW = maxBulbR * 1.96;
        const collarH = 8;
        const collarY = isTop ? yMain + capH - 3 : yMain - collarH + 3;
        ctx.fillStyle = woodGrad;
        ctx.beginPath();
        ctx.roundRect(cx - collarW / 2, collarY, collarW, collarH, 4);
        ctx.fill();

        // Top specular bevel line on wooden cap
        ctx.strokeStyle = 'rgba(255, 224, 185, 0.35)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(xLeft + 10, yMain + 3);
        ctx.lineTo(xLeft + capW - 10, yMain + 3);
        ctx.stroke();

        // Subtle dark wood grain groove
        ctx.strokeStyle = 'rgba(30, 14, 4, 0.45)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(xLeft + 4, yMain + capH * 0.55);
        ctx.lineTo(xLeft + capW - 4, yMain + capH * 0.55);
        ctx.stroke();
      };

      drawWoodenCap(true);
      drawWoodenCap(false);

      ctx.restore();

      if (status === 'running' && !reducedMotion) {
        animId = requestAnimationFrame(renderFrame);
      }
    };

    animId = requestAnimationFrame(renderFrame);
    return () => cancelAnimationFrame(animId);
  }, [remainingMs, totalDurationMs, status, animationSpeed, reducedMotion, isFullscreen]);

  // Format MM:SS (or HH:MM:SS if >= 60 minutes)
  const totalRemSeconds = Math.ceil(remainingMs / 1000);
  const displayMins = Math.floor(totalRemSeconds / 60);
  const displaySecs = totalRemSeconds % 60;
  const formattedMins = String(displayMins).padStart(2, '0');
  const formattedSecs = String(displaySecs).padStart(2, '0');

  return (
    <div className="space-y-12">
      {/* MAIN SAND TIMER CARD */}
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

            {/* High-Resolution Hourglass Visual */}
            <div className="flex items-center justify-center h-[52dvh] sm:h-[78dvh] max-h-[340px] sm:max-h-[82dvh] max-w-[78vw] sm:max-w-[46vw] aspect-[360/460] shrink-0">
              <canvas
                ref={canvasRef}
                width={594}
                height={759}
                aria-label={`Interactive digital sand timer showing ${formattedMins} minutes and ${formattedSecs} seconds remaining`}
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
          /* NORMAL 3-COLUMN DISPLAY WITH CONTROLS & PRESETS                     */
          /* =================================================================== */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN (lg:col-span-5): Realistic Digital Hourglass Canvas */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center rounded-2xl bg-[#F4F2EC] dark:bg-[#1E2420] border border-[#E8E4DA] dark:border-[#2B332E] p-4 sm:p-6 min-h-[450px] relative">
              <canvas
                ref={canvasRef}
                width={360}
                height={460}
                aria-label={`Interactive digital sand timer showing ${formattedMins} minutes and ${formattedSecs} seconds remaining`}
                className="w-full max-w-[340px] h-auto select-none"
              />
              {status === 'completed' && (
                <div className="mt-2 px-4 py-1.5 rounded-full bg-[#365C4B] text-white text-xs font-bold tracking-wide uppercase animate-pulse">
                  Time&apos;s Up! Sand Emptied
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
                      ? 'bg-[#365C4B] text-white shadow-2xs'
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
                      ? 'bg-[#365C4B] text-white shadow-2xs'
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
                              ? 'bg-[#365C4B] text-white border-[#365C4B] shadow-2xs'
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
                          onClick={() => applyDurationMinutes(Math.max(1, customMinutes - 1), 'Custom')}
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
                    htmlFor="sand-end-time"
                    className="block text-xs font-semibold text-[#252B27]/75 dark:text-slate-300"
                  >
                    Select Target End Time
                  </label>
                  <input
                    id="sand-end-time"
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

              {/* Animation Speed Selector */}
              <div className="space-y-2 pt-1">
                <span className="block text-xs font-bold text-[#252B27] dark:text-white">
                  Animation Speed
                </span>
                <div className="grid grid-cols-3 rounded-xl bg-[#EFECE6] dark:bg-[#252C27] p-1 border border-[#E4E1D9] dark:border-[#2D352F]">
                  {(['slow', 'normal', 'fast'] as AnimationSpeed[]).map((spd) => {
                    const isActive = animationSpeed === spd;
                    return (
                      <button
                        key={spd}
                        type="button"
                        onClick={() => setAnimationSpeed(spd)}
                        className={`py-2 px-3 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#365C4B] text-white shadow-2xs'
                            : 'text-[#252B27]/75 dark:text-slate-300 hover:text-[#252B27]'
                        }`}
                      >
                        {spd}
                      </button>
                    );
                  })}
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
                    Use a simpler animation for better accessibility.
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
                      Digital countdown hidden so you can focus purely on the visual sand flow.
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
                  Use the sand timer for games, classroom activities, cooking, meditation and short work breaks.
                </p>
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
          Choose a common time or set a custom duration.
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
                    <Hourglass className="w-4 h-4" />
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
          A digital sand timer is useful in many everyday situations.
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

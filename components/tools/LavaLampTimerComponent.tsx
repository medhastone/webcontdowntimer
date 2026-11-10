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
  Bookmark,
  Check,
  Settings,
  Hourglass,
  BookOpen,
  GraduationCap,
  Monitor,
  Sparkles,
  Gamepad2,
  Headphones,
} from 'lucide-react';

type LavaThemeId = 'retro-amber' | 'deep-blue' | 'neon-pink' | 'aqua-glow';
type LampStyleId = 'amber-orb' | 'magenta-orb' | 'blue-orb' | 'aqua-orb';
type TimerMode = 'duration' | 'endTime';

interface LavaThemeConfig {
  id: LavaThemeId;
  name: string;
  roomBgTop: string;
  roomBgBottom: string;
  roomGlow: string;
  liquidTop: string;
  liquidMid: string;
  liquidBottom: string;
  waxCore: string;
  waxMid: string;
  waxEdge: string;
  heatGlow: string;
  accentHex: string;
}

const LAVA_THEMES: Record<LavaThemeId, LavaThemeConfig> = {
  'retro-amber': {
    id: 'retro-amber',
    name: 'Retro Amber',
    roomBgTop: '#241023',
    roomBgBottom: '#3E1B24',
    roomGlow: 'rgba(255, 122, 45, 0.34)',
    liquidTop: '#7B114B',
    liquidMid: '#B91653',
    liquidBottom: '#E03B24',
    waxCore: '#FFF3B0',
    waxMid: '#FF9E1B',
    waxEdge: '#E83845',
    heatGlow: '#FFAE34',
    accentHex: '#FF9E1B',
  },
  'deep-blue': {
    id: 'deep-blue',
    name: 'Deep Blue',
    roomBgTop: '#0B132B',
    roomBgBottom: '#1C2541',
    roomGlow: 'rgba(56, 189, 248, 0.28)',
    liquidTop: '#0F172A',
    liquidMid: '#1D4ED8',
    liquidBottom: '#0284C7',
    waxCore: '#E0F2FE',
    waxMid: '#38BDF8',
    waxEdge: '#2563EB',
    heatGlow: '#60A5FA',
    accentHex: '#38BDF8',
  },
  'neon-pink': {
    id: 'neon-pink',
    name: 'Neon Pink',
    roomBgTop: '#1F0D2E',
    roomBgBottom: '#361246',
    roomGlow: 'rgba(236, 72, 153, 0.34)',
    liquidTop: '#3B0764',
    liquidMid: '#86198F',
    liquidBottom: '#DB2777',
    waxCore: '#FCE7F3',
    waxMid: '#F472B6',
    waxEdge: '#C026D3',
    heatGlow: '#F472B6',
    accentHex: '#EC4899',
  },
  'aqua-glow': {
    id: 'aqua-glow',
    name: 'Aqua Glow',
    roomBgTop: '#092226',
    roomBgBottom: '#11383D',
    roomGlow: 'rgba(45, 212, 191, 0.30)',
    liquidTop: '#064E3B',
    liquidMid: '#0D9488',
    liquidBottom: '#10B981',
    waxCore: '#CCFBF1',
    waxMid: '#34D399',
    waxEdge: '#059669',
    heatGlow: '#6EE7B7',
    accentHex: '#2DD4BF',
  },
};

const LAMP_STYLES: {
  id: LampStyleId;
  label: string;
  gradient: string;
  coreColor: string;
  blobScale: number;
  mergeStretch: number;
}[] = [
  {
    id: 'amber-orb',
    label: 'Warm Classic Wax',
    gradient: 'radial-gradient(circle at 42% 38%, #FFF7C2 0%, #F59E0B 48%, #B45309 85%, #451A03 100%)',
    coreColor: '#FDE68A',
    blobScale: 1.0,
    mergeStretch: 1.0,
  },
  {
    id: 'magenta-orb',
    label: 'Retro Magenta Wax',
    gradient: 'radial-gradient(circle at 42% 38%, #FBCFE8 0%, #EC4899 48%, #9D174D 85%, #3B0724 100%)',
    coreColor: '#F9A8D4',
    blobScale: 1.08,
    mergeStretch: 1.15,
  },
  {
    id: 'blue-orb',
    label: 'Cosmic Cobalt Wax',
    gradient: 'radial-gradient(circle at 42% 38%, #E0F2FE 0%, #3B82F6 48%, #1E40AF 85%, #0F172A 100%)',
    coreColor: '#93C5FD',
    blobScale: 0.94,
    mergeStretch: 0.92,
  },
  {
    id: 'aqua-orb',
    label: 'Emerald Aqua Wax',
    gradient: 'radial-gradient(circle at 42% 38%, #CCFBF1 0%, #14B8A6 48%, #065F46 85%, #042F2E 100%)',
    coreColor: '#6EE7B7',
    blobScale: 1.04,
    mergeStretch: 1.08,
  },
];

interface LavaBlobSeed {
  id: number;
  baseX: number; // -0.75 to 0.75 relative to lamp width at that height
  baseRadius: number;
  freqY: number;
  phaseY: number;
  freqX: number;
  phaseX: number;
  unlockThreshold: number; // 0 to 0.85 progress
}

const BLOB_SEEDS: LavaBlobSeed[] = [
  { id: 0, baseX: 0.0, baseRadius: 34, freqY: 0.55, phaseY: 0.2, freqX: 0.4, phaseX: 0.0, unlockThreshold: 0.0 },
  { id: 1, baseX: -0.18, baseRadius: 24, freqY: 0.72, phaseY: 2.1, freqX: 0.6, phaseX: 1.4, unlockThreshold: 0.0 },
  { id: 2, baseX: 0.24, baseRadius: 19, freqY: 0.88, phaseY: 4.0, freqX: 0.52, phaseX: 2.8, unlockThreshold: 0.08 },
  { id: 3, baseX: -0.28, baseRadius: 15, freqY: 1.05, phaseY: 1.1, freqX: 0.75, phaseX: 3.9, unlockThreshold: 0.22 },
  { id: 4, baseX: 0.12, baseRadius: 27, freqY: 0.64, phaseY: 3.3, freqX: 0.48, phaseX: 5.1, unlockThreshold: 0.38 },
  { id: 5, baseX: -0.08, baseRadius: 16, freqY: 0.94, phaseY: 5.2, freqX: 0.68, phaseX: 0.7, unlockThreshold: 0.55 },
  { id: 6, baseX: 0.30, baseRadius: 13, freqY: 1.15, phaseY: 2.7, freqX: 0.82, phaseX: 2.2, unlockThreshold: 0.72 },
];

const STORAGE_KEY = 'timetools_lava_lamp_timer_defaults_v1';

export default function LavaLampTimerComponent() {
  const [mode, setMode] = useState<TimerMode>('duration');
  const [durationMinutes, setDurationMinutes] = useState<number>(25);
  const [activePreset, setActivePreset] = useState<number | 'custom'>(25);
  const [endTimeStr, setEndTimeStr] = useState<string>('17:00');

  const [totalMs, setTotalMs] = useState<number>(25 * 60 * 1000);
  const [remainingMs, setRemainingMs] = useState<number>(25 * 60 * 1000);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const [soundAlert, setSoundAlert] = useState<boolean>(true);
  const [showTime, setShowTime] = useState<boolean>(true);
  const [animationSpeed, setAnimationSpeed] = useState<number>(50); // 0=Slow, 50=Normal, 100=Fast
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  const [theme, setTheme] = useState<LavaThemeId>('retro-amber');
  const [lampStyle, setLampStyle] = useState<LampStyleId>('amber-orb');
  const [savedToast, setSavedToast] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const targetTimestampRef = useRef<number | null>(null);
  const animTimeRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number | null>(null);

  // Load saved defaults & OS reduced-motion preference
  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      try {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (mq.matches) {
          setReducedMotion(true);
        }
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.durationMinutes && typeof parsed.durationMinutes === 'number') {
            setDurationMinutes(parsed.durationMinutes);
            setTotalMs(parsed.durationMinutes * 60 * 1000);
            setRemainingMs(parsed.durationMinutes * 60 * 1000);
            setActivePreset(
              [1, 3, 5, 10, 25].includes(parsed.durationMinutes)
                ? parsed.durationMinutes
                : 'custom'
            );
          }
          if (parsed.theme && LAVA_THEMES[parsed.theme as LavaThemeId]) {
            setTheme(parsed.theme);
          }
          if (parsed.lampStyle) {
            setLampStyle(parsed.lampStyle);
          }
          if (typeof parsed.soundAlert === 'boolean') setSoundAlert(parsed.soundAlert);
          if (typeof parsed.showTime === 'boolean') setShowTime(parsed.showTime);
          if (typeof parsed.animationSpeed === 'number') setAnimationSpeed(parsed.animationSpeed);
        }
      } catch {
        // ignore storage errors
      }
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  // Pleasant retro warm synth chime using Web Audio API
  const playCompletionChime = useCallback(() => {
    if (!soundAlert) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const notes = [329.63, 440.0, 554.37, 659.25]; // E4, A4, C#5, E5 warm retro chord
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.16);
        gain.gain.setValueAtTime(0.0001, ctx.currentTime + idx * 0.16);
        gain.gain.exponentialRampToValueAtTime(0.16, ctx.currentTime + idx * 0.16 + 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.16 + 1.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.16);
        osc.stop(ctx.currentTime + idx * 0.16 + 1.5);
      });
    } catch {
      // ignore audio errors
    }
  }, [soundAlert]);

  // Accurate countdown tick loop
  useEffect(() => {
    if (!isRunning) return;
    targetTimestampRef.current = performance.now() + remainingMs;

    const interval = window.setInterval(() => {
      if (!targetTimestampRef.current) return;
      const now = performance.now();
      const left = Math.max(0, targetTimestampRef.current - now);
      setRemainingMs(left);
      if (left <= 0) {
        targetTimestampRef.current = null;
        setIsRunning(false);
        setIsCompleted(true);
        playCompletionChime();
      }
    }, 80);

    return () => window.clearInterval(interval);
  }, [isRunning, playCompletionChime]);

  // Handle preset selection
  const applyDurationMinutes = (mins: number, presetTag: number | 'custom') => {
    const clamped = Math.max(1, Math.min(240, Math.round(mins)));
    setIsRunning(false);
    setIsCompleted(false);
    setMode('duration');
    setDurationMinutes(clamped);
    setActivePreset(presetTag);
    const ms = clamped * 60 * 1000;
    setTotalMs(ms);
    setRemainingMs(ms);
  };

  // Compute duration from End Time
  const applyEndTime = (timeVal: string) => {
    setEndTimeStr(timeVal);
    const [hh, mm] = timeVal.split(':').map(Number);
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
    setTotalMs(diffMs);
    setRemainingMs(diffMs);
  };

  const handleStart = () => {
    if (remainingMs <= 0) {
      setRemainingMs(totalMs);
      setIsCompleted(false);
    }
    setIsCompleted(false);
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsCompleted(false);
    if (mode === 'duration') {
      const ms = durationMinutes * 60 * 1000;
      setTotalMs(ms);
      setRemainingMs(ms);
    } else {
      applyEndTime(endTimeStr);
    }
  };

  const handleSaveDefault = () => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          durationMinutes,
          theme,
          lampStyle,
          soundAlert,
          showTime,
          animationSpeed,
        })
      );
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 2200);
    } catch {
      // ignore storage errors
    }
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
          // CSS .timer-fullscreen-stage handles portrait-to-landscape rotation
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

  useEffect(() => {
    const onFsChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // Format MM:SS or HH:MM:SS
  const formatTime = (ms: number) => {
    const totalSec = Math.ceil(ms / 1000);
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    if (hrs > 0) {
      return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Calculate measurable countdown progress (0 = start, 1 = finished)
  const progress = totalMs > 0 ? Math.min(1, Math.max(0, 1 - remainingMs / totalMs)) : 0;

  const speedLabel =
    animationSpeed < 34 ? 'Slow' : animationSpeed < 68 ? 'Normal' : 'Fast';

  // Canvas animation for the retro lava lamp chamber & room ambiance
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId: number;
    const activeTheme = LAVA_THEMES[theme];
    const activeStyle = LAMP_STYLES.find((s) => s.id === lampStyle) || LAMP_STYLES[0];

    const render = (now: number) => {
      if (lastFrameTimeRef.current === null) {
        lastFrameTimeRef.current = now;
      }
      const dt = Math.min(0.05, (now - lastFrameTimeRef.current) / 1000);
      lastFrameTimeRef.current = now;

      // Speed multiplier
      const speedMult = reducedMotion
        ? 0
        : (0.4 + (animationSpeed / 100) * 1.25) * (isRunning ? 1.0 : 0.35);
      animTimeRef.current += dt * speedMult;
      const t = animTimeRef.current;

      const dpr = Math.min(window.devicePixelRatio || 2, 3);
      const cssW = Math.max(320, canvas.clientWidth || 520);
      const cssH = Math.max(360, canvas.clientHeight || 560);
      const targetW = Math.round(cssW * dpr);
      const targetH = Math.round(cssH * dpr);
      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }

      const W = cssW;
      const H = cssH;
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, W, H);

      // 1. Cozy Dark-Lit Room Background
      const roomGrad = ctx.createLinearGradient(0, 0, 0, H);
      roomGrad.addColorStop(0, activeTheme.roomBgTop);
      roomGrad.addColorStop(0.76, activeTheme.roomBgBottom);
      roomGrad.addColorStop(1, '#1A0B12');
      ctx.fillStyle = roomGrad;
      ctx.fillRect(0, 0, W, H);

      // Soft ambient room wall glow behind the lamp
      const ambientGlow = ctx.createRadialGradient(
        W * 0.5,
        H * 0.48,
        20,
        W * 0.5,
        H * 0.48,
        W * 0.58
      );
      ambientGlow.addColorStop(0, activeTheme.roomGlow);
      ambientGlow.addColorStop(0.55, 'rgba(255, 90, 54, 0.10)');
      ambientGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = ambientGlow;
      ctx.fillRect(0, 0, W, H);

      // Subtle out-of-focus background room decor (framed wall poster on right, warm lamp bokeh on left, potted plant silhouette)
      ctx.save();
      // Framed retro wall art on right
      ctx.fillStyle = 'rgba(255, 255, 255, 0.035)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(W * 0.73, H * 0.1, W * 0.2, H * 0.34, 6);
      ctx.fill();
      ctx.stroke();

      // Warm ambient desk lamp glow on left edge
      const leftBokeh = ctx.createRadialGradient(
        W * 0.08,
        H * 0.58,
        8,
        W * 0.08,
        H * 0.58,
        W * 0.28
      );
      leftBokeh.addColorStop(0, 'rgba(255, 168, 76, 0.38)');
      leftBokeh.addColorStop(1, 'rgba(255, 168, 76, 0)');
      ctx.fillStyle = leftBokeh;
      ctx.fillRect(0, 0, W, H);

      // Soft foliage leaves on left
      ctx.fillStyle = 'rgba(20, 40, 28, 0.55)';
      const leaves = [
        { cx: W * 0.14, cy: H * 0.26, rx: 36, ry: 15, rot: -0.4 },
        { cx: W * 0.18, cy: H * 0.34, rx: 42, ry: 16, rot: -0.2 },
        { cx: W * 0.12, cy: H * 0.42, rx: 38, ry: 14, rot: 0.15 },
      ];
      leaves.forEach((lf) => {
        ctx.save();
        ctx.translate(lf.cx, lf.cy);
        ctx.rotate(lf.rot);
        ctx.beginPath();
        ctx.ellipse(0, 0, lf.rx, lf.ry, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Warm wooden desk surface at bottom
      const deskY = H * 0.805;
      const deskGrad = ctx.createLinearGradient(0, deskY, 0, H);
      deskGrad.addColorStop(0, '#5A2B1D');
      deskGrad.addColorStop(0.3, '#3D1B12');
      deskGrad.addColorStop(1, '#1E0C08');
      ctx.fillStyle = deskGrad;
      ctx.fillRect(0, deskY, W, H - deskY);

      // Warm reflection pool on desk under the lamp
      const deskReflect = ctx.createRadialGradient(
        W * 0.5,
        deskY + 18,
        12,
        W * 0.5,
        deskY + 18,
        W * 0.38
      );
      deskReflect.addColorStop(0, activeTheme.roomGlow);
      deskReflect.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = deskReflect;
      ctx.fillRect(0, deskY - 8, W, H - deskY + 8);
      ctx.restore();

      // 2. Lava Lamp Geometry Coordinates (proportional to lampRefSize so wide fullscreen never distorts or crops the lamp)
      const lampRefSize = Math.min(W, H * 0.92);
      const centerX = W * 0.5;
      const capTopY = H * 0.035;
      const capBottomY = H * 0.145;
      const glassTopY = capBottomY;
      const glassBottomY = H * 0.675;
      const glassMidY = H * 0.565; // widest hip of the classic conical bottle
      const baseBottomY = H * 0.945;

      const capTopHalfW = lampRefSize * 0.056;
      const capBotHalfW = lampRefSize * 0.088;
      const glassHipHalfW = lampRefSize * 0.195;
      const glassBotHalfW = lampRefSize * 0.145;
      const baseBottomHalfW = lampRefSize * 0.21;

      // Helper function to get half-width of glass chamber at any y in [glassTopY, glassBottomY]
      const getGlassHalfW = (y: number) => {
        if (y <= glassMidY) {
          const u = Math.max(0, Math.min(1, (y - glassTopY) / (glassMidY - glassTopY)));
          return capBotHalfW + (glassHipHalfW - capBotHalfW) * u;
        } else {
          const u = Math.max(0, Math.min(1, (y - glassMidY) / (glassBottomY - glassMidY)));
          return glassHipHalfW + (glassBotHalfW - glassHipHalfW) * u;
        }
      };

      // Helper path for the glass chamber
      const traceGlassPath = () => {
        ctx.beginPath();
        ctx.moveTo(centerX - capBotHalfW, glassTopY);
        ctx.lineTo(centerX + capBotHalfW, glassTopY);
        ctx.lineTo(centerX + glassHipHalfW, glassMidY);
        ctx.quadraticCurveTo(
          centerX + glassHipHalfW * 0.98,
          (glassMidY + glassBottomY) * 0.5,
          centerX + glassBotHalfW,
          glassBottomY
        );
        ctx.quadraticCurveTo(
          centerX,
          glassBottomY + 10,
          centerX - glassBotHalfW,
          glassBottomY
        );
        ctx.quadraticCurveTo(
          centerX - glassHipHalfW * 0.98,
          (glassMidY + glassBottomY) * 0.5,
          centerX - glassHipHalfW,
          glassMidY
        );
        ctx.closePath();
      };

      // 3. Draw Inside the Glass Chamber (Liquid + Measurable Progress + Rising/Merging Wax Blobs)
      ctx.save();
      traceGlassPath();
      ctx.clip();

      // Liquid gradient inside the lamp
      const liqGrad = ctx.createLinearGradient(0, glassTopY, 0, glassBottomY);
      liqGrad.addColorStop(0, activeTheme.liquidTop);
      liqGrad.addColorStop(0.55, activeTheme.liquidMid);
      liqGrad.addColorStop(1, activeTheme.liquidBottom);
      ctx.fillStyle = liqGrad;
      ctx.fillRect(centerX - glassHipHalfW - 10, glassTopY, glassHipHalfW * 2 + 20, glassBottomY - glassTopY + 20);

      // Bottom heat-coil glow radiating upward
      const coilGlow = ctx.createRadialGradient(
        centerX,
        glassBottomY + 4,
        6,
        centerX,
        glassBottomY - 20,
        glassHipHalfW * 1.25
      );
      coilGlow.addColorStop(0, '#FFFBEB');
      coilGlow.addColorStop(0.28, activeTheme.heatGlow);
      coilGlow.addColorStop(0.68, activeTheme.waxEdge);
      coilGlow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = coilGlow;
      ctx.fillRect(centerX - glassHipHalfW, glassTopY, glassHipHalfW * 2, glassBottomY - glassTopY + 15);

      // Bottom molten wax reservoir dome (shrinks slightly as blobs rise during progress)
      const reservoirHeight = 28 - progress * 8 + Math.sin(t * 1.4) * 3;
      const resGrad = ctx.createRadialGradient(
        centerX,
        glassBottomY + 6,
        4,
        centerX,
        glassBottomY - 12,
        glassBotHalfW * 1.05
      );
      resGrad.addColorStop(0, activeTheme.waxCore);
      resGrad.addColorStop(0.45, activeTheme.waxMid);
      resGrad.addColorStop(1, activeTheme.waxEdge);
      ctx.fillStyle = resGrad;
      ctx.beginPath();
      ctx.ellipse(
        centerX,
        glassBottomY + 4,
        glassBotHalfW * 0.92,
        reservoirHeight,
        0,
        Math.PI,
        Math.PI * 2
      );
      ctx.fill();

      // Central hourglass/pear-shaped rising wax column (characteristic of classic lava lamps in screenshot)
      const chamberH = glassBottomY - glassTopY;
      const pinchPhase = Math.sin(t * 0.9) * 0.5 + 0.5; // 0..1 smooth breathing
      const columnTopY =
        glassBottomY -
        chamberH * (0.34 + progress * 0.34 + (reducedMotion ? 0 : Math.sin(t * 0.65) * 0.06));
      const bulbRadius = (31 + progress * 8) * activeStyle.blobScale;
      const neckHalfW = (11 + pinchPhase * 7) * activeStyle.mergeStretch;

      const colGrad = ctx.createRadialGradient(
        centerX - bulbRadius * 0.22,
        columnTopY + bulbRadius * 0.15,
        4,
        centerX,
        (columnTopY + glassBottomY) * 0.5,
        glassBottomY - columnTopY
      );
      colGrad.addColorStop(0, activeTheme.waxCore);
      colGrad.addColorStop(0.35, activeStyle.coreColor);
      colGrad.addColorStop(0.7, activeTheme.waxMid);
      colGrad.addColorStop(1, activeTheme.waxEdge);

      ctx.fillStyle = colGrad;
      ctx.beginPath();
      // Start at bottom left of stem
      ctx.moveTo(centerX - glassBotHalfW * 0.52, glassBottomY);
      // Curve inward to narrow neck, then flare out into upper bulb
      ctx.bezierCurveTo(
        centerX - neckHalfW * 0.85,
        glassBottomY - (glassBottomY - columnTopY) * 0.38,
        centerX - bulbRadius * 1.25,
        columnTopY + bulbRadius * 0.85,
        centerX - bulbRadius * 0.88,
        columnTopY
      );
      // Rounded crown of upper bulb
      ctx.bezierCurveTo(
        centerX - bulbRadius * 0.5,
        columnTopY - bulbRadius * 0.95,
        centerX + bulbRadius * 0.5,
        columnTopY - bulbRadius * 0.95,
        centerX + bulbRadius * 0.88,
        columnTopY
      );
      // Right side down through narrow neck to base
      ctx.bezierCurveTo(
        centerX + bulbRadius * 1.25,
        columnTopY + bulbRadius * 0.85,
        centerX + neckHalfW * 0.85,
        glassBottomY - (glassBottomY - columnTopY) * 0.38,
        centerX + glassBotHalfW * 0.52,
        glassBottomY
      );
      ctx.closePath();
      ctx.fill();

      // Specular inner highlight on the main rising pear blob
      const mainHighlight = ctx.createRadialGradient(
        centerX - bulbRadius * 0.28,
        columnTopY - bulbRadius * 0.18,
        2,
        centerX - bulbRadius * 0.2,
        columnTopY,
        bulbRadius * 0.85
      );
      mainHighlight.addColorStop(0, 'rgba(255, 255, 255, 0.65)');
      mainHighlight.addColorStop(0.5, 'rgba(255, 243, 176, 0.25)');
      mainHighlight.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = mainHighlight;
      ctx.beginPath();
      ctx.arc(centerX - bulbRadius * 0.15, columnTopY - bulbRadius * 0.08, bulbRadius * 0.72, 0, Math.PI * 2);
      ctx.fill();

      // Floating individual wax blobs that rise, expand, and merge proportionally to elapsed progress
      BLOB_SEEDS.forEach((seed, idx) => {
        // Blobs unlock or grow fuller as countdown progresses
        const progressBoost =
          progress >= seed.unlockThreshold
            ? Math.min(1, 0.55 + ((progress - seed.unlockThreshold) / (1 - seed.unlockThreshold + 0.01)) * 0.55)
            : 0.35;

        // Vertical cycle biased upward by progress so remaining duration is visually clear
        const waveY = Math.sin(t * seed.freqY + seed.phaseY); // -1..1
        const normalizedY =
          0.16 +
          ((waveY + 1) * 0.5) * 0.68 -
          progress * 0.12 * (idx % 2 === 0 ? 1 : -0.5);
        const clampedNormY = Math.max(0.11, Math.min(0.86, normalizedY));
        const blobY = glassTopY + clampedNormY * chamberH;

        const localHalfW = getGlassHalfW(blobY) * 0.62;
        const swayX = Math.sin(t * seed.freqX + seed.phaseX) * 0.22;
        const blobX = centerX + (seed.baseX + swayX) * localHalfW;

        const r =
          seed.baseRadius *
          activeStyle.blobScale *
          progressBoost *
          (0.88 + Math.sin(t * 1.1 + seed.phaseY) * 0.12);

        // Organic vertical stretch as blob rises through middle thermal zone
        const stretchY =
          1.0 + Math.abs(Math.cos(t * seed.freqY + seed.phaseY)) * 0.18 * activeStyle.mergeStretch;
        const stretchX = 1.0 / Math.sqrt(stretchY);

        ctx.save();
        ctx.translate(blobX, blobY);
        ctx.scale(stretchX, stretchY);

        const bGrad = ctx.createRadialGradient(-r * 0.28, -r * 0.28, r * 0.08, 0, 0, r * 1.08);
        bGrad.addColorStop(0, activeTheme.waxCore);
        bGrad.addColorStop(0.32, activeStyle.coreColor);
        bGrad.addColorStop(0.72, activeTheme.waxMid);
        bGrad.addColorStop(1, activeTheme.waxEdge);

        ctx.fillStyle = bGrad;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();

        // Soft glossy highlight on each wax sphere
        ctx.fillStyle = 'rgba(255, 255, 255, 0.38)';
        ctx.beginPath();
        ctx.ellipse(-r * 0.28, -r * 0.3, r * 0.26, r * 0.15, -0.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });

      // Tiny micro-bubbles suspended in the heated liquid
      const microSpots = [
        { x: -0.35, y: 0.28, r: 3.2 },
        { x: 0.42, y: 0.36, r: 2.6 },
        { x: -0.46, y: 0.54, r: 3.8 },
        { x: 0.38, y: 0.66, r: 4.2 },
        { x: 0.18, y: 0.22, r: 2.8 },
      ];
      microSpots.forEach((sp, i) => {
        const sy =
          glassTopY +
          (((sp.y + (reducedMotion ? 0 : t * 0.04 * (i + 1))) % 0.82) + 0.08) * chamberH;
        const sx = centerX + sp.x * getGlassHalfW(sy);
        ctx.fillStyle = activeTheme.waxCore;
        ctx.globalAlpha = 0.65;
        ctx.beginPath();
        ctx.arc(sx, sy, sp.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // Subtle measurable vertical time-remaining gauge ticks on right inner glass edge
      const gaugeTop = glassTopY + 26;
      const gaugeBottom = glassBottomY - 24;
      const gaugeH = gaugeBottom - gaugeTop;
      const remainingRatio = 1 - progress;
      const fillTopY = gaugeBottom - gaugeH * remainingRatio;

      for (let step = 0; step <= 10; step++) {
        const ty = gaugeTop + (step / 10) * gaugeH;
        const rightEdgeX = centerX + getGlassHalfW(ty) - 10;
        const isLit = ty >= fillTopY;
        ctx.strokeStyle = isLit ? 'rgba(255, 248, 220, 0.65)' : 'rgba(255, 255, 255, 0.18)';
        ctx.lineWidth = step % 5 === 0 ? 2 : 1.2;
        ctx.beginPath();
        ctx.moveTo(rightEdgeX - (step % 5 === 0 ? 8 : 5), ty);
        ctx.lineTo(rightEdgeX, ty);
        ctx.stroke();
      }

      // Left & right glass specular reflection streaks
      const leftGlassStreak = ctx.createLinearGradient(
        centerX - glassHipHalfW,
        glassTopY,
        centerX - glassHipHalfW + 36,
        glassBottomY
      );
      leftGlassStreak.addColorStop(0, 'rgba(255,255,255,0.34)');
      leftGlassStreak.addColorStop(0.5, 'rgba(255,255,255,0.08)');
      leftGlassStreak.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = leftGlassStreak;
      ctx.beginPath();
      ctx.moveTo(centerX - capBotHalfW + 5, glassTopY + 6);
      ctx.lineTo(centerX - capBotHalfW + 16, glassTopY + 6);
      ctx.lineTo(centerX - glassHipHalfW + 22, glassMidY);
      ctx.lineTo(centerX - glassBotHalfW + 16, glassBottomY - 8);
      ctx.lineTo(centerX - glassBotHalfW + 5, glassBottomY - 8);
      ctx.lineTo(centerX - glassHipHalfW + 8, glassMidY);
      ctx.closePath();
      ctx.fill();

      ctx.restore();

      // Glass outer rim stroke
      ctx.save();
      traceGlassPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // 4. Brushed Silver Metallic Cap (Top Cone)
      ctx.save();
      const capGrad = ctx.createLinearGradient(
        centerX - capBotHalfW,
        capTopY,
        centerX + capBotHalfW,
        capBottomY
      );
      capGrad.addColorStop(0, '#64748B');
      capGrad.addColorStop(0.24, '#E2E8F0');
      capGrad.addColorStop(0.45, '#FFFFFF');
      capGrad.addColorStop(0.7, '#94A3B8');
      capGrad.addColorStop(1, '#334155');

      ctx.fillStyle = capGrad;
      ctx.beginPath();
      ctx.moveTo(centerX - capTopHalfW, capTopY);
      ctx.quadraticCurveTo(centerX, capTopY - 6, centerX + capTopHalfW, capTopY);
      ctx.lineTo(centerX + capBotHalfW, capBottomY);
      ctx.quadraticCurveTo(centerX, capBottomY + 5, centerX - capBotHalfW, capBottomY);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.45)';
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.restore();

      // 5. Brushed Silver Metallic Base (Bottom Pedestal)
      ctx.save();
      const baseGrad = ctx.createLinearGradient(
        centerX - baseBottomHalfW,
        glassBottomY,
        centerX + baseBottomHalfW,
        baseBottomY
      );
      baseGrad.addColorStop(0, '#475569');
      baseGrad.addColorStop(0.22, '#CBD5E1');
      baseGrad.addColorStop(0.48, '#F8FAFC');
      baseGrad.addColorStop(0.75, '#64748B');
      baseGrad.addColorStop(1, '#1E293B');

      // Warm upward light reflection on the neck of the silver base
      ctx.fillStyle = baseGrad;
      ctx.beginPath();
      ctx.moveTo(centerX - glassBotHalfW, glassBottomY);
      ctx.quadraticCurveTo(centerX, glassBottomY + 10, centerX + glassBotHalfW, glassBottomY);
      ctx.lineTo(centerX + baseBottomHalfW, baseBottomY - 12);
      ctx.quadraticCurveTo(
        centerX,
        baseBottomY + 14,
        centerX - baseBottomHalfW,
        baseBottomY - 12
      );
      ctx.closePath();
      ctx.fill();

      // Warm orange/theme glow collar where glass meets silver base
      const collarGlow = ctx.createLinearGradient(
        centerX - glassBotHalfW,
        glassBottomY,
        centerX + glassBotHalfW,
        glassBottomY
      );
      collarGlow.addColorStop(0, 'rgba(255,255,255,0.15)');
      collarGlow.addColorStop(0.5, activeTheme.heatGlow);
      collarGlow.addColorStop(1, 'rgba(255,255,255,0.15)');
      ctx.strokeStyle = collarGlow;
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(centerX - glassBotHalfW + 2, glassBottomY + 1);
      ctx.quadraticCurveTo(centerX, glassBottomY + 11, centerX + glassBotHalfW - 2, glassBottomY + 1);
      ctx.stroke();

      // Dark rubberized foot rim at bottom of base
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(centerX - baseBottomHalfW + 3, baseBottomY - 11);
      ctx.quadraticCurveTo(
        centerX,
        baseBottomY + 13,
        centerX + baseBottomHalfW - 3,
        baseBottomY - 11
      );
      ctx.stroke();
      ctx.restore();
      ctx.restore();

      rafId = window.requestAnimationFrame(render);
    };

    rafId = window.requestAnimationFrame(render);
    return () => window.cancelAnimationFrame(rafId);
  }, [theme, lampStyle, animationSpeed, reducedMotion, isRunning, progress, isFullscreen]);

  return (
    <div className="space-y-10">
      {/* MAIN 3-COLUMN INTERACTIVE TOOL CARD */}
      <div className="bg-white dark:bg-[#181D1A] border border-[#E4E1D9] dark:border-[#2A312C] rounded-3xl p-4 sm:p-6 lg:p-7 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-7 items-stretch">
          {/* LEFT COLUMN (lg:col-span-5): Retro Lava Lamp Stage */}
          <div className="lg:col-span-5 flex flex-col">
            <div
              ref={stageRef}
              className={`relative w-full h-full min-h-[430px] sm:min-h-[470px] rounded-2xl overflow-hidden border border-[#3E1F30] shadow-inner flex items-center justify-center bg-[#230E1E] ${
                isFullscreen ? 'timer-fullscreen-stage' : ''
              }`}
            >
              <canvas
                ref={canvasRef}
                width={520}
                height={560}
                className="w-full h-full block"
              />

              {/* Digital Clock Screen Embedded in the Metallic Lamp Base */}
              {(showTime || isFullscreen) && (
                <div
                  className="absolute bottom-[7.5%] left-1/2 -translate-x-1/2 z-10 px-5 py-2 rounded-2xl bg-[#161418]/95 border-2 border-[#64748B]/70 shadow-[0_6px_20px_rgba(0,0,0,0.65)] text-center min-w-[148px] sm:min-w-[162px] pointer-events-none"
                  aria-live="polite"
                >
                  <div className="font-sans font-bold text-2xl sm:text-[32px] leading-none tracking-tight text-white tabular-nums">
                    {formatTime(remainingMs)}
                  </div>
                  {!isFullscreen && (
                    <div className="text-[11px] sm:text-xs font-medium text-white/80 mt-1">
                      {isCompleted ? 'Countdown Complete!' : 'Focus Time'}
                    </div>
                  )}
                </div>
              )}

              {/* Exit Fullscreen Button in Top-Right Corner */}
              {isFullscreen && (
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="absolute top-4 right-4 z-20 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-black/65 hover:bg-black/85 text-white text-xs font-semibold backdrop-blur-xs transition cursor-pointer"
                  aria-label="Exit Fullscreen"
                >
                  <Minimize2 className="w-4 h-4" />
                  <span>Exit Fullscreen</span>
                </button>
              )}
            </div>
          </div>

          {/* MIDDLE COLUMN (lg:col-span-4): Timer Controls */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
            {/* Segmented Mode Tabs: Duration | End Time */}
            <div className="grid grid-cols-2 rounded-xl bg-[#F3F1EC] dark:bg-[#222824] p-1 border border-[#E4E1D9] dark:border-[#2E3630]">
              <button
                type="button"
                onClick={() => setMode('duration')}
                className={`py-2.5 px-4 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  mode === 'duration'
                    ? 'bg-[#6E1848] text-white shadow-xs'
                    : 'text-[#252B27]/80 dark:text-slate-300 hover:text-[#252B27]'
                }`}
              >
                Duration
              </button>
              <button
                type="button"
                onClick={() => setMode('endTime')}
                className={`py-2.5 px-4 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  mode === 'endTime'
                    ? 'bg-[#6E1848] text-white shadow-xs'
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
                    const isSelected = activePreset === m;
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => applyDurationMinutes(m, m)}
                        className={`py-2 px-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#6E1848] text-white border-[#6E1848] shadow-2xs'
                            : 'bg-[#F8F7F4] dark:bg-[#222824] text-[#252B27] dark:text-slate-200 border-[#E4E1D9] dark:border-[#2E3630] hover:border-[#6E1848]/50'
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
                        ? 'bg-[#6E1848] text-white border-[#6E1848] shadow-2xs'
                        : 'bg-[#F8F7F4] dark:bg-[#222824] text-[#252B27] dark:text-slate-200 border-[#E4E1D9] dark:border-[#2E3630] hover:border-[#6E1848]/50'
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
                      className="w-full rounded-xl border border-[#D8D4C8] dark:border-[#333C36] bg-white dark:bg-[#1E2420] px-3.5 py-2.5 text-lg font-bold text-[#252B27] dark:text-white focus:outline-none focus:border-[#6E1848]"
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
                  className="w-full rounded-xl border border-[#D8D4C8] dark:border-[#333C36] bg-white dark:bg-[#1E2420] px-3.5 py-2.5 text-base font-bold text-[#252B27] dark:text-white focus:outline-none focus:border-[#6E1848]"
                />
              </div>
            )}

            {/* Start Button */}
            <button
              type="button"
              onClick={handleStart}
              className="w-full py-3.5 px-6 rounded-xl bg-[#6E1848] hover:bg-[#581239] text-white font-bold text-base shadow-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start</span>
            </button>

            {/* Pause & Reset Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handlePause}
                className="py-2.5 px-4 rounded-xl bg-[#F3F1EC] dark:bg-[#232925] hover:bg-[#E7E4DC] dark:hover:bg-[#2C342E] text-[#252B27] dark:text-white font-semibold text-sm border border-[#E4E1D9] dark:border-[#2E3630] transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="py-2.5 px-4 rounded-xl bg-[#F3F1EC] dark:bg-[#232925] hover:bg-[#E7E4DC] dark:hover:bg-[#2C342E] text-[#252B27] dark:text-white font-semibold text-sm border border-[#E4E1D9] dark:border-[#2E3630] transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>

            {/* Toggles Row: Sound Alert | Fullscreen | Show Time */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#ECE9E1] dark:border-[#28302B] text-xs font-medium text-[#252B27] dark:text-slate-200">
              {/* Sound Alert */}
              <div className="flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-[#6E1848] dark:text-pink-400" />
                <span>Sound Alert</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={soundAlert}
                  aria-label="Toggle Sound Alert"
                  onClick={() => setSoundAlert((prev) => !prev)}
                  className={`w-9 h-5 rounded-full transition-colors p-0.5 cursor-pointer ${
                    soundAlert ? 'bg-[#6E1848]' : 'bg-slate-300 dark:bg-slate-600'
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
                <Maximize2 className="w-3.5 h-3.5 text-[#252B27]/70 dark:text-slate-300" />
                <span>Fullscreen</span>
              </button>

              {/* Show Time */}
              <div className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-[#6E1848] dark:text-pink-400" />
                <span>Show Time</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={showTime}
                  aria-label="Toggle Show Time"
                  onClick={() => setShowTime((prev) => !prev)}
                  className={`w-9 h-5 rounded-full transition-colors p-0.5 cursor-pointer ${
                    showTime ? 'bg-[#6E1848]' : 'bg-slate-300 dark:bg-slate-600'
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

            {/* Animation Speed Slider + Reduced Motion Option */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#252B27] dark:text-white">
                  Animation Speed
                </span>
                <button
                  type="button"
                  onClick={() => setReducedMotion((prev) => !prev)}
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border transition cursor-pointer ${
                    reducedMotion
                      ? 'bg-[#6E1848] text-white border-[#6E1848]'
                      : 'bg-[#F8F7F4] dark:bg-[#222824] text-[#252B27]/75 dark:text-slate-300 border-[#E4E1D9] dark:border-[#2E3630]'
                  }`}
                >
                  {reducedMotion ? 'Reduced Motion: On' : 'Reduced Motion'}
                </button>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={animationSpeed}
                  disabled={reducedMotion}
                  onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                  aria-label="Animation Speed"
                  className="w-full accent-[#8A225A] h-1.5 bg-[#E6D6DF] dark:bg-[#33242D] rounded-lg cursor-pointer disabled:opacity-40"
                />
                <span className="text-xs font-medium text-[#252B27]/80 dark:text-slate-300 min-w-[44px] text-right">
                  {reducedMotion ? 'Static' : speedLabel}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (lg:col-span-3): Lava Lamp Theme & Lamp Style Selector */}
          <div className="lg:col-span-3 flex flex-col justify-between space-y-4 border-t lg:border-t-0 lg:border-l border-[#ECE9E1] dark:border-[#28302B] pt-4 lg:pt-0 lg:pl-6">
            <div>
              <h3 className="text-sm font-bold text-[#252B27] dark:text-white mb-2.5">
                Lava Lamp Theme
              </h3>

              {/* 2x2 Grid of Mini Lava Lamp Theme Cards */}
              <div className="grid grid-cols-2 gap-2.5">
                {(Object.values(LAVA_THEMES) as LavaThemeConfig[]).map((tItem) => {
                  const isSelected = theme === tItem.id;
                  return (
                    <button
                      key={tItem.id}
                      type="button"
                      onClick={() => setTheme(tItem.id)}
                      className={`group rounded-xl overflow-hidden border-2 transition-all text-center bg-white dark:bg-[#1F2521] cursor-pointer ${
                        isSelected
                          ? 'border-[#9B2C6B] shadow-xs'
                          : 'border-[#E4E1D9] dark:border-[#2E3630] hover:border-[#9B2C6B]/50'
                      }`}
                    >
                      <div className="h-16 w-full relative overflow-hidden">
                        <svg viewBox="0 0 120 74" className="w-full h-full block">
                          <rect width="120" height="74" fill={tItem.roomBgTop} />
                          <circle cx="60" cy="38" r="34" fill={tItem.roomGlow} />
                          {/* Mini wooden table */}
                          <rect x="0" y="62" width="120" height="12" fill="#3B1A12" />
                          {/* Mini silver cap */}
                          <polygon points="53,6 67,6 70,15 50,15" fill="#CBD5E1" />
                          {/* Mini glass body */}
                          <polygon
                            points="50,15 70,15 79,45 74,56 46,56 41,45"
                            fill={tItem.liquidMid}
                            stroke="rgba(255,255,255,0.35)"
                            strokeWidth="1"
                          />
                          {/* Mini glowing wax blobs */}
                          <circle cx="60" cy="43" r="9.5" fill={tItem.waxMid} />
                          <circle cx="58" cy="41" r="5.5" fill={tItem.waxCore} />
                          <circle cx="62" cy="25" r="5" fill={tItem.waxMid} />
                          <circle cx="54" cy="31" r="3" fill={tItem.waxCore} />
                          {/* Mini silver base */}
                          <polygon points="46,56 74,56 78,68 42,68" fill="#94A3B8" />
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

            {/* Lamp Style (4 circular glowing gradient spheres) */}
            <div>
              <h3 className="text-sm font-bold text-[#252B27] dark:text-white mb-2.5">
                Lamp Style
              </h3>
              <div className="flex items-center justify-between gap-2">
                {LAMP_STYLES.map((st) => {
                  const isSelected = lampStyle === st.id;
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setLampStyle(st.id)}
                      title={st.label}
                      aria-label={st.label}
                      className={`w-12 h-12 rounded-full transition-transform cursor-pointer relative flex items-center justify-center ${
                        isSelected
                          ? 'ring-2 ring-offset-2 ring-[#8A225A] scale-105'
                          : 'opacity-90 hover:opacity-100 hover:scale-105'
                      }`}
                      style={{ background: st.gradient }}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full blur-[1px]"
                        style={{ backgroundColor: st.coreColor }}
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
            { mins: 5, label: '5 Minutes', sub: 'Study session' },
            { mins: 10, label: '10 Minutes', sub: 'Deep work' },
            { mins: 25, label: '25 Minutes', sub: 'Longer session' },
          ].map((preset) => {
            const isSelected = activePreset === preset.mins;
            return (
              <button
                key={preset.mins}
                type="button"
                onClick={() => applyDurationMinutes(preset.mins, preset.mins)}
                className={`flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-[#1A201C] border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#9B2C6B] ring-1 ring-[#9B2C6B]/30 shadow-xs'
                    : 'border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#9B2C6B]/60'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-[#F9EEF4] dark:bg-[#2D1926] text-[#881D58] dark:text-pink-400 flex items-center justify-center shrink-0">
                  <Hourglass className="w-5 h-5" />
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
                ? 'border-[#9B2C6B] ring-1 ring-[#9B2C6B]/30 shadow-xs'
                : 'border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#9B2C6B]/60'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-[#F9EEF4] dark:bg-[#2D1926] text-[#881D58] dark:text-pink-400 flex items-center justify-center shrink-0">
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
      <div className="rounded-3xl bg-[#F6EFEF]/60 dark:bg-[#1B191C]/50 border border-[#EAE0E3] dark:border-[#2B262D] p-5 sm:p-6">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0E2338] dark:text-white">
          Popular Uses
        </h2>
        <p className="text-xs sm:text-sm text-[#252B27]/75 dark:text-slate-400 mt-0.5 mb-4">
          A lava lamp timer is great for many everyday activities.
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
              title: 'Reading Time',
              desc: 'Enjoy a calm reading session.',
              mins: 20,
              icon: <GraduationCap className="w-5 h-5" />,
            },
            {
              title: 'Work Breaks',
              desc: 'Take a short and relaxing break.',
              mins: 5,
              icon: <Monitor className="w-5 h-5" />,
            },
            {
              title: 'Mindful Moments',
              desc: 'Relax, unwind and reset.',
              mins: 10,
              icon: <Sparkles className="w-5 h-5" />,
            },
            {
              title: 'Creative Work',
              desc: 'Create with a calm visual timer.',
              mins: 25,
              icon: <Gamepad2 className="w-5 h-5" />,
            },
            {
              title: 'Relaxation',
              desc: 'A soothing timer for quiet time.',
              mins: 15,
              icon: <Headphones className="w-5 h-5" />,
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
              className="flex items-start gap-3 p-3.5 rounded-2xl bg-white dark:bg-[#1A201C] border border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#881D58] transition-all text-left cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-[#F9EEF4] dark:bg-[#2D1926] text-[#881D58] dark:text-pink-400 flex items-center justify-center shrink-0 mt-0.5">
                {useItem.icon}
              </div>
              <div className="min-w-0">
                <div className="font-bold text-xs sm:text-sm text-[#0E2338] dark:text-white group-hover:text-[#881D58] transition-colors">
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

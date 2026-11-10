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
  Monitor,
  Heart,
  Check,
  Snowflake,
  Activity,
  Calendar,
} from 'lucide-react';

type SnowThemeId = 'winter-cabin' | 'snowy-forest' | 'mountain-snow' | 'calm-snowfall';
type SnowStyleId = 'crystalline' | 'star-flake' | 'soft-powder' | 'gentle-flurries';

interface SnowThemeConfig {
  id: SnowThemeId;
  label: string;
  skyTop: string;
  skyMid: string;
  skyHorizon: string;
  skyBottom: string;
  horizonGlow: string;
  mountainFar: string;
  mountainNear: string;
  treeDark: string;
  treeMid: string;
  treeSnow: string;
  driftBack: string;
  driftMid: string;
  driftFront: string;
  driftShadow: string;
  showCabin: boolean;
  showSunbeams: boolean;
}

const SNOW_THEMES: Record<SnowThemeId, SnowThemeConfig> = {
  'winter-cabin': {
    id: 'winter-cabin',
    label: 'Winter Cabin',
    skyTop: '#163156',
    skyMid: '#365A85',
    skyHorizon: '#EDA982',
    skyBottom: '#29466B',
    horizonGlow: '#F8C697',
    mountainFar: '#3B587E',
    mountainNear: '#2B4568',
    treeDark: '#122640',
    treeMid: '#1C3658',
    treeSnow: '#E4F0FB',
    driftBack: '#BFD5EC',
    driftMid: '#D6E6F7',
    driftFront: '#F0F7FF',
    driftShadow: '#9CB9D9',
    showCabin: true,
    showSunbeams: false,
  },
  'snowy-forest': {
    id: 'snowy-forest',
    label: 'Snowy Forest',
    skyTop: '#1A3963',
    skyMid: '#3E6796',
    skyHorizon: '#C9DEF4',
    skyBottom: '#244166',
    horizonGlow: '#FFF2D6',
    mountainFar: '#385B85',
    mountainNear: '#28466B',
    treeDark: '#10243D',
    treeMid: '#193556',
    treeSnow: '#EAF4FC',
    driftBack: '#C5DCF2',
    driftMid: '#DCEBFA',
    driftFront: '#F4F9FF',
    driftShadow: '#9EBDE0',
    showCabin: false,
    showSunbeams: true,
  },
  'mountain-snow': {
    id: 'mountain-snow',
    label: 'Mountain Snow',
    skyTop: '#243B61',
    skyMid: '#586E96',
    skyHorizon: '#F4B687',
    skyBottom: '#314B70',
    horizonGlow: '#FFE3B3',
    mountainFar: '#465F87',
    mountainNear: '#324A70',
    treeDark: '#162944',
    treeMid: '#213B5E',
    treeSnow: '#EBF3FA',
    driftBack: '#C9DDF0',
    driftMid: '#E0EEFA',
    driftFront: '#F6FAFF',
    driftShadow: '#A5C1DF',
    showCabin: false,
    showSunbeams: true,
  },
  'calm-snowfall': {
    id: 'calm-snowfall',
    label: 'Calm Snowfall',
    skyTop: '#112746',
    skyMid: '#274B75',
    skyHorizon: '#7DA6D4',
    skyBottom: '#1B3659',
    horizonGlow: '#B8D8F8',
    mountainFar: '#27466E',
    mountainNear: '#1C3657',
    treeDark: '#0D1E36',
    treeMid: '#162D4C',
    treeSnow: '#DCEBFA',
    driftBack: '#B3CDE8',
    driftMid: '#CCE0F5',
    driftFront: '#EBF4FC',
    driftShadow: '#8CAFD4',
    showCabin: false,
    showSunbeams: false,
  },
};

const SNOW_STYLES: Array<{ id: SnowStyleId; label: string }> = [
  { id: 'crystalline', label: 'Crystal Flakes' },
  { id: 'star-flake', label: 'Star Dendrites' },
  { id: 'soft-powder', label: 'Diamond Powder' },
  { id: 'gentle-flurries', label: 'Gentle Flurries' },
];

const STORAGE_KEY = 'timetools_snow_timer_prefs_v1';

const CANVAS_W = 800;
const CANVAS_H = 680;
const MAX_FLAKES = 140;

interface SnowflakeParticle {
  x: number;
  y: number;
  radius: number;
  speedY: number;
  driftX: number;
  phase: number;
  spin: number;
  spinSpeed: number;
  opacity: number;
  layer: 0 | 1 | 2; // 0 = distant small, 1 = mid, 2 = foreground detailed crystal
}

function createInitialFlakes(): SnowflakeParticle[] {
  const flakes: SnowflakeParticle[] = [];
  for (let i = 0; i < MAX_FLAKES; i++) {
    const layerRand = (i * 17) % 10;
    const layer: 0 | 1 | 2 = layerRand < 4 ? 0 : layerRand < 8 ? 1 : 2;
    const radius =
      layer === 2
        ? 6.5 + ((i * 13) % 5) * 1.15
        : layer === 1
        ? 3.2 + ((i * 7) % 4) * 0.7
        : 1.6 + ((i * 5) % 3) * 0.5;
    flakes.push({
      x: ((i * 73) % 1000) * 0.001 * CANVAS_W,
      y: ((i * 97) % 1000) * 0.001 * CANVAS_H,
      radius,
      speedY: layer === 2 ? 42 + (i % 15) : layer === 1 ? 28 + (i % 12) : 17 + (i % 9),
      driftX: 10 + (i % 14),
      phase: (i * 1.37) % (Math.PI * 2),
      spin: (i * 0.75) % (Math.PI * 2),
      spinSpeed: ((i % 2 === 0 ? 1 : -1) * (0.25 + (i % 5) * 0.08)),
      opacity: layer === 2 ? 0.92 : layer === 1 ? 0.75 : 0.52,
      layer,
    });
  }
  return flakes;
}

// Crisp Snowflake SVG Icon for Presets & Slider
function SnowflakeCrispIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 28 28"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="14" y1="2.5" x2="14" y2="25.5" />
      <line x1="4.04" y1="8.25" x2="23.96" y2="19.75" />
      <line x1="23.96" y1="8.25" x2="4.04" y2="19.75" />
      <polyline points="11.5,5.5 14,8 16.5,5.5" />
      <polyline points="11.5,22.5 14,20 16.5,22.5" />
      <polyline points="5.5,11.5 8.5,10.8 7.8,7.8" />
      <polyline points="22.5,16.5 19.5,17.2 20.2,20.2" />
      <polyline points="20.2,7.8 19.5,10.8 22.5,11.5" />
      <polyline points="7.8,20.2 8.5,17.2 5.5,16.5" />
    </svg>
  );
}

export default function SnowTimerComponent() {
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
  const [snowTheme, setSnowTheme] = useState<SnowThemeId>('winter-cabin');
  const [snowStyle, setSnowStyle] = useState<SnowStyleId>('crystalline');
  const [soundAlert, setSoundAlert] = useState<boolean>(true);
  const [showTime, setShowTime] = useState<boolean>(true);
  const [snowfallIntensity, setSnowfallIntensity] = useState<number>(55);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [savedToast, setSavedToast] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const snowCanvasRef = useRef<HTMLCanvasElement>(null);
  const customInputRef = useRef<HTMLInputElement>(null);
  const endTimeRef = useRef<number | null>(null);
  const timerRafRef = useRef<number | null>(null);
  const animRafRef = useRef<number | null>(null);
  const flakesRef = useRef<SnowflakeParticle[]>(createInitialFlakes());
  const lastFrameTimeRef = useRef<number>(0);

  // Load saved preferences & check prefers-reduced-motion
  useEffect(() => {
    try {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mediaQuery.matches) {
        setTimeout(() => setReducedMotion(true), 0);
      }
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setTimeout(() => {
          if (parsed.snowTheme && SNOW_THEMES[parsed.snowTheme as SnowThemeId]) {
            setSnowTheme(parsed.snowTheme);
          }
          if (
            parsed.snowStyle &&
            ['crystalline', 'star-flake', 'soft-powder', 'gentle-flurries'].includes(
              parsed.snowStyle
            )
          ) {
            setSnowStyle(parsed.snowStyle);
          }
          if (typeof parsed.soundAlert === 'boolean') setSoundAlert(parsed.soundAlert);
          if (typeof parsed.showTime === 'boolean') setShowTime(parsed.showTime);
          if (typeof parsed.snowfallIntensity === 'number') {
            setSnowfallIntensity(parsed.snowfallIntensity);
          }
          if (typeof parsed.reducedMotion === 'boolean') setReducedMotion(parsed.reducedMotion);
        }, 0);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  // Gentle Winter Chime via Web Audio API
  const playWinterChime = useCallback(() => {
    if (!soundAlert) return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const notes = [783.99, 987.77, 1174.66, 1567.98]; // G5, B5, D6, G6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.18);
        gain.gain.setValueAtTime(0.0001, ctx.currentTime + idx * 0.18);
        gain.gain.exponentialRampToValueAtTime(0.14, ctx.currentTime + idx * 0.18 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.18 + 1.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.18);
        osc.stop(ctx.currentTime + idx * 0.18 + 1.55);
      });
    } catch {
      // ignore audio restrictions
    }
  }, [soundAlert]);

  // High-precision countdown loop
  useEffect(() => {
    if (!isRunning) {
      if (timerRafRef.current) cancelAnimationFrame(timerRafRef.current);
      return;
    }

    if (!endTimeRef.current) {
      endTimeRef.current = performance.now() + remainingMs;
    }

    const tick = (now: number) => {
      if (!endTimeRef.current) return;
      const left = Math.max(0, endTimeRef.current - now);
      setRemainingMs(left);

      if (left <= 0) {
        setIsRunning(false);
        setIsCompleted(true);
        endTimeRef.current = null;
        playWinterChime();
        return;
      }
      timerRafRef.current = requestAnimationFrame(tick);
    };

    timerRafRef.current = requestAnimationFrame(tick);
    return () => {
      if (timerRafRef.current) cancelAnimationFrame(timerRafRef.current);
    };
  }, [isRunning, remainingMs, playWinterChime]);

  // Sync fullscreen state
  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const applyDurationMinutes = (mins: number, presetType: number | 'custom') => {
    const validMins = Math.max(1, Math.min(240, mins));
    const ms = validMins * 60 * 1000;
    setIsRunning(false);
    setIsCompleted(false);
    setHasStartedOnce(false);
    endTimeRef.current = null;
    setSelectedPreset(presetType);
    setCustomMinutes(validMins);
    setTotalMs(ms);
    setRemainingMs(ms);
  };

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
    setHasStartedOnce(false);
    endTimeRef.current = null;
    setTotalMs(diffMs);
    setRemainingMs(diffMs);
  };

  const handleStart = () => {
    if (remainingMs <= 0) {
      setRemainingMs(totalMs);
      setIsCompleted(false);
      endTimeRef.current = performance.now() + totalMs;
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

  const handleToggleFullscreen = async () => {
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
          snowTheme,
          snowStyle,
          soundAlert,
          showTime,
          snowfallIntensity,
          reducedMotion,
        })
      );
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 2200);
    } catch {
      // ignore storage errors
    }
  };

  // Format MM:SS or HH:MM:SS
  const formattedTime = useMemo(() => {
    const totalSeconds = Math.ceil(remainingMs / 1000);
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    if (hrs > 0) {
      return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }, [remainingMs]);

  // Proportional elapsed progress (0.0 at start -> 1.0 at completion)
  const elapsedProgress = useMemo(() => {
    if (totalMs <= 0) return 0;
    return Math.min(1, Math.max(0, 1 - remainingMs / totalMs));
  }, [remainingMs, totalMs]);

  // Visual snow accumulation level along bottom (0.0 -> 1.0)
  const snowAccumulationProgress = useMemo(() => {
    if (isCompleted) return 1;
    if (!hasStartedOnce && !isRunning) return 0.12; // Natural initial snowbank before start
    return 0.08 + elapsedProgress * 0.92;
  }, [elapsedProgress, hasStartedOnce, isRunning, isCompleted]);

  const activeTheme = SNOW_THEMES[snowTheme];

  // High-DPI Falling Snow & Proportional Bottom Snowbank Accumulation Canvas Loop
  useEffect(() => {
    const canvas = snowCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 2, 3);
    const targetW = Math.round(CANVAS_W * dpr);
    const targetH = Math.round(CANVAS_H * dpr);
    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    const activeCount = Math.max(
      14,
      Math.min(MAX_FLAKES, Math.round((snowfallIntensity / 100) * MAX_FLAKES))
    );
    const speedFactor = reducedMotion
      ? 0
      : isCompleted
      ? 0.25
      : 0.45 + (snowfallIntensity / 100) * 0.95;

    const drawSnowflakeShape = (
      c: CanvasRenderingContext2D,
      flake: SnowflakeParticle,
      style: SnowStyleId
    ) => {
      const r = flake.radius;
      c.save();
      c.translate(flake.x, flake.y);
      c.globalAlpha = flake.opacity;

      // Distant tiny flakes render as crisp snow circles for performance & depth
      if (flake.layer === 0 || style === 'gentle-flurries') {
        c.fillStyle = '#FFFFFF';
        c.beginPath();
        c.arc(0, 0, r * (style === 'gentle-flurries' ? 0.72 : 1), 0, Math.PI * 2);
        c.fill();
        c.restore();
        return;
      }

      if (style === 'soft-powder') {
        if (flake.layer === 2) {
          // 4-point sparkling diamond star + soft snow core
          c.rotate(flake.spin * 0.4);
          c.strokeStyle = '#FFFFFF';
          c.lineWidth = 1.4;
          c.lineCap = 'round';
          c.beginPath();
          c.moveTo(0, -r);
          c.lineTo(0, r);
          c.moveTo(-r, 0);
          c.lineTo(r, 0);
          c.moveTo(-r * 0.48, -r * 0.48);
          c.lineTo(r * 0.48, r * 0.48);
          c.moveTo(r * 0.48, -r * 0.48);
          c.lineTo(-r * 0.48, r * 0.48);
          c.stroke();
          c.fillStyle = '#FFFFFF';
          c.beginPath();
          c.arc(0, 0, r * 0.28, 0, Math.PI * 2);
          c.fill();
        } else {
          c.fillStyle = '#FFFFFF';
          c.beginPath();
          c.arc(0, 0, r * 0.85, 0, Math.PI * 2);
          c.fill();
        }
        c.restore();
        return;
      }

      // Detailed 6-point crystal ('crystalline' or 'star-flake')
      c.rotate(flake.spin);
      c.strokeStyle = '#FFFFFF';
      c.lineWidth = flake.layer === 2 ? 1.55 : 1.15;
      c.lineCap = 'round';
      c.beginPath();
      for (let k = 0; k < 6; k++) {
        const angle = (k * Math.PI) / 3;
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);
        c.moveTo(0, 0);
        c.lineTo(cosA * r, sinA * r);

        if (flake.layer === 2 || style === 'crystalline') {
          const bPos = r * 0.56;
          const bLen = r * 0.36;
          const leftA = angle - Math.PI / 3;
          const rightA = angle + Math.PI / 3;
          c.moveTo(cosA * bPos, sinA * bPos);
          c.lineTo(cosA * bPos + Math.cos(leftA) * bLen, sinA * bPos + Math.sin(leftA) * bLen);
          c.moveTo(cosA * bPos, sinA * bPos);
          c.lineTo(cosA * bPos + Math.cos(rightA) * bLen, sinA * bPos + Math.sin(rightA) * bLen);
        }
      }
      c.stroke();
      c.restore();
    };

    const renderFrame = (now: number) => {
      const dt = lastFrameTimeRef.current
        ? Math.min(0.05, (now - lastFrameTimeRef.current) / 1000)
        : 0.016;
      lastFrameTimeRef.current = now;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

      const accum = snowAccumulationProgress;
      // Maximum rising snowbank height at 100% completion is 185px along bottom
      const risePx = accum * 172;
      const baseSnowTopY = CANVAS_H - 36 - risePx;

      // 1. Update & Draw Falling Snowflakes
      const flakes = flakesRef.current;
      for (let i = 0; i < activeCount; i++) {
        const f = flakes[i];
        if (speedFactor > 0) {
          f.y += f.speedY * speedFactor * dt;
          f.x += Math.sin(now * 0.0012 + f.phase) * f.driftX * dt;
          f.spin += f.spinSpeed * dt;

          // Wrap around when reaching the accumulating snow layer or canvas edges
          const localFloorY = baseSnowTopY + 28;
          if (f.y > localFloorY) {
            f.y = -12;
            f.x = ((f.x + 137) % CANVAS_W + CANVAS_W) % CANVAS_W;
          }
          if (f.x < -15) f.x = CANVAS_W + 12;
          if (f.x > CANVAS_W + 15) f.x = -12;
        }
        drawSnowflakeShape(ctx, f, snowStyle);
      }

      // 2. Draw Proportionally Accumulating Multi-Layer Snowbanks Along the Bottom
      // Back Snowdrift Wave
      ctx.beginPath();
      ctx.moveTo(0, CANVAS_H);
      ctx.lineTo(0, baseSnowTopY + 18);
      ctx.bezierCurveTo(
        CANVAS_W * 0.25,
        baseSnowTopY - 14,
        CANVAS_W * 0.55,
        baseSnowTopY + 26,
        CANVAS_W,
        baseSnowTopY - 6
      );
      ctx.lineTo(CANVAS_W, CANVAS_H);
      ctx.closePath();
      ctx.fillStyle = activeTheme.driftBack;
      ctx.fill();

      // Mid Snowdrift Wave
      ctx.beginPath();
      ctx.moveTo(0, CANVAS_H);
      ctx.lineTo(0, baseSnowTopY + 24);
      ctx.bezierCurveTo(
        CANVAS_W * 0.32,
        baseSnowTopY + 42,
        CANVAS_W * 0.68,
        baseSnowTopY - 8,
        CANVAS_W,
        baseSnowTopY + 18
      );
      ctx.lineTo(CANVAS_W, CANVAS_H);
      ctx.closePath();
      ctx.fillStyle = activeTheme.driftMid;
      ctx.fill();

      // Foreground Fresh Accumulated Snow Layer (rises smoothly with elapsedProgress)
      const frontGrad = ctx.createLinearGradient(0, baseSnowTopY + 10, 0, CANVAS_H);
      frontGrad.addColorStop(0, '#FFFFFF');
      frontGrad.addColorStop(0.45, activeTheme.driftFront);
      frontGrad.addColorStop(1, activeTheme.driftBack);

      ctx.beginPath();
      ctx.moveTo(0, CANVAS_H);
      ctx.lineTo(0, baseSnowTopY + 34);
      ctx.bezierCurveTo(
        CANVAS_W * 0.22,
        baseSnowTopY + 12,
        CANVAS_W * 0.48,
        baseSnowTopY + 44,
        CANVAS_W * 0.76,
        baseSnowTopY + 22
      );
      ctx.quadraticCurveTo(CANVAS_W * 0.9, baseSnowTopY + 12, CANVAS_W, baseSnowTopY + 28);
      ctx.lineTo(CANVAS_W, CANVAS_H);
      ctx.closePath();
      ctx.fillStyle = frontGrad;
      ctx.fill();

      // Crisp Crest Highlight along the rising snowdrift ridge
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(0, baseSnowTopY + 34);
      ctx.bezierCurveTo(
        CANVAS_W * 0.22,
        baseSnowTopY + 12,
        CANVAS_W * 0.48,
        baseSnowTopY + 44,
        CANVAS_W * 0.76,
        baseSnowTopY + 22
      );
      ctx.quadraticCurveTo(CANVAS_W * 0.9, baseSnowTopY + 12, CANVAS_W, baseSnowTopY + 28);
      ctx.stroke();

      // Subtle Blue Snowbank Contour Shadow Lines for 3D Depth
      ctx.strokeStyle = activeTheme.driftShadow;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.45;
      ctx.beginPath();
      ctx.moveTo(35, baseSnowTopY + 62);
      ctx.quadraticCurveTo(CANVAS_W * 0.3, baseSnowTopY + 44, CANVAS_W * 0.56, baseSnowTopY + 68);
      ctx.moveTo(CANVAS_W * 0.48, baseSnowTopY + 95);
      ctx.quadraticCurveTo(CANVAS_W * 0.74, baseSnowTopY + 72, CANVAS_W - 24, baseSnowTopY + 88);
      ctx.stroke();

      // Sparkling Snow Glints on the Accumulated Snowbank
      ctx.globalAlpha = 0.85;
      ctx.fillStyle = '#FFFFFF';
      const glintSeeds = [0.12, 0.24, 0.37, 0.51, 0.64, 0.78, 0.89];
      glintSeeds.forEach((gx, idx) => {
        const px = gx * CANVAS_W;
        const py = baseSnowTopY + 38 + ((idx * 23) % 55);
        if (py < CANVAS_H - 8) {
          ctx.beginPath();
          ctx.arc(px, py, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      ctx.restore();

      if (!reducedMotion) {
        animRafRef.current = requestAnimationFrame(renderFrame);
      }
    };

    animRafRef.current = requestAnimationFrame(renderFrame);
    return () => {
      if (animRafRef.current) cancelAnimationFrame(animRafRef.current);
    };
  }, [
    snowAccumulationProgress,
    snowfallIntensity,
    snowStyle,
    activeTheme,
    reducedMotion,
    isCompleted,
  ]);

  return (
    <div className="space-y-10">
      {/* MAIN 3-COLUMN INTERACTIVE SNOW TIMER CARD */}
      <div
        ref={containerRef}
        className="rounded-3xl bg-white dark:bg-[#171C19] border border-[#E2E6EC] dark:border-[#2B333B] shadow-sm p-4 sm:p-6 lg:p-7 transition-all"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-7 items-stretch">
          {/* LEFT COLUMN (lg:col-span-5): WINTER SCENE + FALLING & ACCUMULATING SNOW DISPLAY */}
          <div className="lg:col-span-5 flex flex-col">
            <div
              className={`relative w-full aspect-[1.06/1] rounded-2xl overflow-hidden border border-[#C6D8EB] dark:border-[#2C4057] shadow-inner select-none bg-[#17345C] ${
                isFullscreen ? 'timer-fullscreen-stage' : ''
              }`}
            >
              {/* Layer 1: Crisp Illustrated Winter Scene SVG */}
              <svg
                viewBox="0 0 500 440"
                className="w-full h-full block"
                preserveAspectRatio="xMidYMid slice"
                shapeRendering="geometricPrecision"
                role="img"
                aria-label={`Snow timer winter scene showing ${formattedTime} remaining`}
              >
                <defs>
                  <linearGradient id="snowSkyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={activeTheme.skyTop} />
                    <stop offset="48%" stopColor={activeTheme.skyMid} />
                    <stop offset="76%" stopColor={activeTheme.skyHorizon} />
                    <stop offset="100%" stopColor={activeTheme.skyBottom} />
                  </linearGradient>

                  <radialGradient id="snowHorizonGlow" cx="56%" cy="68%" r="48%">
                    <stop offset="0%" stopColor={activeTheme.horizonGlow} stopOpacity="0.88" />
                    <stop offset="50%" stopColor={activeTheme.skyHorizon} stopOpacity="0.42" />
                    <stop offset="100%" stopColor={activeTheme.skyMid} stopOpacity="0" />
                  </radialGradient>

                  <linearGradient id="cabinWindowGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FFF7D6" />
                    <stop offset="55%" stopColor="#FBBF24" />
                    <stop offset="100%" stopColor="#D97706" />
                  </linearGradient>

                  <radialGradient id="cabinSnowLight" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.55" />
                    <stop offset="60%" stopColor="#F59E0B" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Winter Sky & Warm Twilight/Sunrise Glow */}
                <rect x="0" y="0" width="500" height="440" fill="url(#snowSkyGrad)" />
                <rect x="0" y="0" width="500" height="440" fill="url(#snowHorizonGlow)" />

                {/* Optional Soft Sunbeams for Forest & Mountain Themes */}
                {activeTheme.showSunbeams && (
                  <g opacity="0.16">
                    <polygon points="275,265 95,440 165,440" fill={activeTheme.horizonGlow} />
                    <polygon points="275,265 225,440 305,440" fill={activeTheme.horizonGlow} />
                    <polygon points="275,265 345,440 425,440" fill={activeTheme.horizonGlow} />
                  </g>
                )}

                {/* Distant Snow-Capped Alpine Mountain Range */}
                <polygon
                  points="0,315 70,255 135,288 210,236 285,278 355,244 430,275 500,248 500,360 0,360"
                  fill={activeTheme.mountainFar}
                />
                {/* sunlit snow ridges on distant peaks */}
                <polygon points="70,255 96,275 76,278" fill="#E6F2FF" opacity="0.48" />
                <polygon points="210,236 244,264 218,268" fill="#FFE6CC" opacity="0.52" />
                <polygon points="355,244 388,268 364,272" fill="#E6F2FF" opacity="0.45" />

                {/* Midground Snowy Hills */}
                <path
                  d="M 0 322 Q 130 292 260 315 T 500 304 L 500 440 L 0 440 Z"
                  fill={activeTheme.mountainNear}
                />
                <path
                  d="M 0 355 Q 150 328 310 346 T 500 335 L 500 440 L 0 440 Z"
                  fill={activeTheme.driftBack}
                />

                {/* Background Pine Forest Treeline */}
                {[125, 152, 180, 212, 245, 275, 442, 468].map((tx, idx) => {
                  const th = 48 + (idx % 3) * 14;
                  const by = 348 - (idx % 2) * 6;
                  return (
                    <polygon
                      key={tx}
                      points={`${tx},${by - th} ${tx - 14},${by} ${tx + 14},${by}`}
                      fill={activeTheme.treeMid}
                      opacity="0.85"
                    />
                  );
                })}

                {/* COZY WINTER LOG CABIN (When Winter Cabin theme is active) */}
                {activeTheme.showCabin && (
                  <g transform="translate(296, 286)">
                    {/* Warm Golden Light Spilling onto Snow Outside Cabin */}
                    <ellipse cx="64" cy="84" rx="72" ry="18" fill="url(#cabinSnowLight)" />

                    {/* Stone Chimney */}
                    <rect x="92" y="-12" width="14" height="36" rx="2" fill="#3B4A5E" />
                    <ellipse cx="99" cy="-12" rx="8" ry="3" fill="#F0F7FF" />
                    {/* Gentle Chimney Smoke */}
                    <path
                      d="M 99 -18 Q 105 -30 97 -40 Q 90 -50 101 -62"
                      fill="none"
                      stroke="#DCEBFA"
                      strokeWidth="3"
                      strokeLinecap="round"
                      opacity="0.35"
                    />

                    {/* Cabin Timber Walls */}
                    <polygon
                      points="14,32 62,4 110,32 110,74 14,74"
                      fill="#5A3825"
                      stroke="#3E2517"
                      strokeWidth="1.5"
                    />
                    {/* Horizontal Log Lines */}
                    <line x1="16" y1="42" x2="108" y2="42" stroke="#422718" strokeWidth="1.4" />
                    <line x1="16" y1="52" x2="108" y2="52" stroke="#422718" strokeWidth="1.4" />
                    <line x1="16" y1="62" x2="108" y2="62" stroke="#422718" strokeWidth="1.4" />

                    {/* Side Annex / Porch */}
                    <rect x="106" y="40" width="28" height="34" fill="#4A2E1E" />
                    <path
                      d="M 104 40 L 120 26 L 138 40 Z"
                      fill="#E8F2FC"
                      stroke="#BFD6EE"
                      strokeWidth="1.5"
                    />

                    {/* Glowing Warm Cabin Windows */}
                    {/* Upper gable window */}
                    <rect
                      x="54"
                      y="16"
                      width="16"
                      height="13"
                      rx="1.5"
                      fill="url(#cabinWindowGlow)"
                    />
                    <line x1="62" y1="16" x2="62" y2="29" stroke="#5A3825" strokeWidth="1.5" />
                    <line x1="54" y1="22.5" x2="70" y2="22.5" stroke="#5A3825" strokeWidth="1.5" />

                    {/* Left front multipane window */}
                    <rect
                      x="26"
                      y="43"
                      width="24"
                      height="18"
                      rx="2"
                      fill="url(#cabinWindowGlow)"
                    />
                    <line x1="38" y1="43" x2="38" y2="61" stroke="#5A3825" strokeWidth="1.6" />
                    <line x1="26" y1="52" x2="50" y2="52" stroke="#5A3825" strokeWidth="1.6" />

                    {/* Warm glowing cabin door */}
                    <rect
                      x="58"
                      y="44"
                      width="15"
                      height="30"
                      rx="2"
                      fill="#7C4728"
                      stroke="#3E2517"
                      strokeWidth="1.2"
                    />
                    <rect
                      x="61"
                      y="47"
                      width="9"
                      height="11"
                      rx="1"
                      fill="url(#cabinWindowGlow)"
                    />

                    {/* Right front multipane window */}
                    <rect
                      x="80"
                      y="43"
                      width="20"
                      height="18"
                      rx="2"
                      fill="url(#cabinWindowGlow)"
                    />
                    <line x1="90" y1="43" x2="90" y2="61" stroke="#5A3825" strokeWidth="1.6" />
                    <line x1="80" y1="52" x2="100" y2="52" stroke="#5A3825" strokeWidth="1.6" />

                    {/* Annex small glowing window */}
                    <rect
                      x="114"
                      y="47"
                      width="13"
                      height="13"
                      rx="1.5"
                      fill="url(#cabinWindowGlow)"
                    />

                    {/* Thick Snow-Blanketed Pitched Roof (thickens subtly as snow accumulates) */}
                    <path
                      d={`M 4 36 L 62 -2 L 120 36 Q 114 ${42 + snowAccumulationProgress * 5} 106 37 L 62 8 L 18 37 Q 10 ${
                        42 + snowAccumulationProgress * 5
                      } 4 36 Z`}
                      fill="#F4F9FF"
                      stroke="#C6DCF2"
                      strokeWidth="1.5"
                    />
                    {/* Snowbank piled against cabin base */}
                    <path
                      d="M 6 74 Q 38 66 72 72 T 140 73 L 140 80 L 6 80 Z"
                      fill="#EBF4FC"
                    />
                  </g>
                )}

                {/* Tall Snow-Covered Evergreen Pine Trees Framing the Left & Right */}
                {[
                  { x: -12, y: 105, w: 125, h: 285 },
                  { x: 52, y: 158, w: 96, h: 230 },
                  { x: 104, y: 215, w: 72, h: 168 },
                  { x: 422, y: 165, w: 92, h: 225 },
                ].map((tree, idx) => (
                  <g key={idx} transform={`translate(${tree.x}, ${tree.y})`}>
                    {/* Tree Trunk */}
                    <rect
                      x={tree.w * 0.44}
                      y={tree.h * 0.82}
                      width={tree.w * 0.12}
                      height={tree.h * 0.22}
                      fill="#1B1918"
                    />
                    {/* 5 Layered Evergreen Tiers with Thick White Snow Pillows */}
                    {[0, 1, 2, 3, 4].map((tier) => {
                      const topY = tree.h * (tier * 0.155);
                      const botY = tree.h * (0.28 + tier * 0.165);
                      const spread = tree.w * (0.26 + tier * 0.11);
                      const cx = tree.w / 2;
                      const snowThickness = 5 + snowAccumulationProgress * 4.5;
                      return (
                        <g key={tier}>
                          {/* Dark evergreen foliage */}
                          <polygon
                            points={`${cx},${topY} ${cx - spread},${botY} ${cx + spread},${botY}`}
                            fill={activeTheme.treeDark}
                          />
                          {/* Soft snow layer resting on boughs */}
                          <path
                            d={`M ${cx} ${topY} L ${cx - spread * 0.88} ${botY - 3} Q ${
                              cx - spread * 0.45
                            } ${botY - 3 - snowThickness} ${cx} ${botY - 5} Q ${
                              cx + spread * 0.45
                            } ${botY - 3 - snowThickness} ${cx + spread * 0.88} ${botY - 3} Z`}
                            fill={activeTheme.treeSnow}
                            opacity="0.92"
                          />
                        </g>
                      );
                    })}
                  </g>
                ))}
              </svg>

              {/* Layer 2: HiDPI Falling Snowflakes & Rising Bottom Snow Layer Canvas */}
              <canvas
                ref={snowCanvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
              />

              {/* Layer 3: CENTER DIGITAL COUNTDOWN OVERLAY */}
              {(showTime || isFullscreen) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-4 text-center z-10 -mt-6">
                  <div
                    className={`font-sans font-bold text-white tracking-tight leading-none tabular-nums ${
                      isFullscreen
                        ? 'text-6xl sm:text-7xl md:text-8xl lg:text-9xl'
                        : 'text-5xl sm:text-6xl lg:text-[64px]'
                    }`}
                    style={{
                      textShadow:
                        '0 3px 16px rgba(10, 26, 48, 0.78), 0 1px 3px rgba(0, 0, 0, 0.55)',
                    }}
                  >
                    {formattedTime}
                  </div>
                  {!isFullscreen && (
                    <div
                      className="mt-2 text-sm sm:text-base font-medium text-white/95 tracking-wide"
                      style={{
                        textShadow: '0 2px 8px rgba(10, 26, 48, 0.85)',
                      }}
                    >
                      {isCompleted ? 'Snowfall Complete' : 'Focus Time'}
                    </div>
                  )}
                </div>
              )}

              {/* Subtle snow accumulation percentage badge when running (normal mode only) */}
              {isRunning && !isFullscreen && (
                <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-md bg-[#0E243D]/75 text-[11px] font-medium text-sky-100 border border-white/25">
                  {Math.round(elapsedProgress * 100)}% Snow Layer
                </div>
              )}

              {/* Exit Fullscreen Button in Top-Right Corner */}
              {isFullscreen && (
                <button
                  type="button"
                  onClick={handleToggleFullscreen}
                  className="absolute top-4 right-4 z-30 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-black/65 hover:bg-black/85 text-white text-xs font-semibold backdrop-blur-xs transition cursor-pointer"
                  aria-label="Exit Fullscreen"
                >
                  <Minimize2 className="w-4 h-4" />
                  <span>Exit Fullscreen</span>
                </button>
              )}
            </div>
          </div>

          {/* MIDDLE COLUMN (lg:col-span-4): DURATION & SESSION CONTROLS */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              {/* Duration / End Time Segmented Tabs */}
              <div className="grid grid-cols-2 bg-[#EEF2F6] dark:bg-[#212830] p-1 rounded-xl border border-[#DCE3EC] dark:border-[#2E3843]">
                <button
                  type="button"
                  onClick={() => setMode('duration')}
                  className={`py-2.5 px-4 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    mode === 'duration'
                      ? 'bg-[#184E82] text-white shadow-xs'
                      : 'text-[#252B27]/80 dark:text-slate-300 hover:text-[#184E82]'
                  }`}
                >
                  Duration
                </button>
                <button
                  type="button"
                  onClick={() => setMode('endTime')}
                  className={`py-2.5 px-4 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    mode === 'endTime'
                      ? 'bg-[#184E82] text-white shadow-xs'
                      : 'text-[#252B27]/80 dark:text-slate-300 hover:text-[#184E82]'
                  }`}
                >
                  End Time
                </button>
              </div>

              {mode === 'duration' ? (
                <>
                  {/* Preset Pill Buttons: 1 min | 3 min | 5 min | 10 min | 25 min | Custom */}
                  <div className="grid grid-cols-6 gap-1.5">
                    {[
                      { label: '1 min', val: 1 },
                      { label: '3 min', val: 3 },
                      { label: '5 min', val: 5 },
                      { label: '10 min', val: 10 },
                      { label: '25 min', val: 25 },
                    ].map((item) => {
                      const active = selectedPreset === item.val;
                      return (
                        <button
                          key={item.val}
                          type="button"
                          onClick={() => applyDurationMinutes(item.val, item.val)}
                          className={`py-2 px-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                            active
                              ? 'bg-[#184E82] text-white border-[#184E82] shadow-2xs'
                              : 'bg-[#F6F8FB] dark:bg-[#1E252C] text-[#252B27] dark:text-slate-200 border-[#DCE3EC] dark:border-[#2E3843] hover:border-[#184E82]'
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPreset('custom');
                        customInputRef.current?.focus();
                      }}
                      className={`py-2 px-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        selectedPreset === 'custom'
                          ? 'bg-[#184E82] text-white border-[#184E82] shadow-2xs'
                          : 'bg-[#F6F8FB] dark:bg-[#1E252C] text-[#252B27] dark:text-slate-200 border-[#DCE3EC] dark:border-[#2E3843] hover:border-[#184E82]'
                      }`}
                    >
                      Custom
                    </button>
                  </div>

                  {/* Custom Minutes Numeric Input */}
                  <div className="flex items-center gap-3">
                    <div className="relative flex items-center w-32 bg-[#F6F8FB] dark:bg-[#1E252C] border border-[#DCE3EC] dark:border-[#2E3843] rounded-xl px-3.5 py-2">
                      <input
                        ref={customInputRef}
                        type="number"
                        min={1}
                        max={240}
                        value={customMinutes}
                        onChange={(e) => {
                          const v = parseInt(e.target.value, 10);
                          if (!Number.isNaN(v)) {
                            applyDurationMinutes(v, 'custom');
                          } else {
                            setCustomMinutes(1);
                          }
                        }}
                        aria-label="Duration in minutes"
                        className="w-full bg-transparent text-lg font-bold text-[#142334] dark:text-white focus:outline-none"
                      />
                    </div>
                    <span className="text-sm font-medium text-[#252B27]/80 dark:text-slate-300">
                      minutes
                    </span>
                  </div>
                </>
              ) : (
                /* End Time Picker */
                <div className="flex items-center gap-3 py-2">
                  <label className="text-xs sm:text-sm font-medium text-[#252B27]/80 dark:text-slate-300">
                    Count down until:
                  </label>
                  <input
                    type="time"
                    value={endTimeStr}
                    onChange={(e) => handleEndTimeChange(e.target.value)}
                    className="bg-[#F6F8FB] dark:bg-[#1E252C] border border-[#DCE3EC] dark:border-[#2E3843] rounded-xl px-3.5 py-2 text-base font-bold text-[#142334] dark:text-white focus:outline-none focus:border-[#184E82]"
                  />
                </div>
              )}

              {/* Primary Start Button */}
              <button
                type="button"
                onClick={isRunning ? handlePause : handleStart}
                className="w-full py-3.5 px-6 rounded-xl bg-[#184E82] hover:bg-[#123D68] active:bg-[#0E3154] text-white font-semibold text-base shadow-xs flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{isRunning ? 'Running...' : 'Start'}</span>
              </button>

              {/* Secondary Pause & Reset Row */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={isRunning ? handlePause : handleStart}
                  className="py-2.5 px-4 rounded-xl bg-[#EFF3F7] dark:bg-[#222930] hover:bg-[#E2E8F0] dark:hover:bg-[#2B343D] text-[#1A2B3C] dark:text-slate-200 font-semibold text-sm flex items-center justify-center gap-2 border border-[#DCE3EC] dark:border-[#2E3843] transition-colors cursor-pointer"
                >
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pause</span>
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="py-2.5 px-4 rounded-xl bg-[#EFF3F7] dark:bg-[#222930] hover:bg-[#E2E8F0] dark:hover:bg-[#2B343D] text-[#1A2B3C] dark:text-slate-200 font-semibold text-sm flex items-center justify-center gap-2 border border-[#DCE3EC] dark:border-[#2E3843] transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Bottom Controls: Sound Alert, Fullscreen, Show Time, Snowfall Intensity */}
            <div className="space-y-3.5 pt-3 border-t border-[#E6ECF2] dark:border-[#28313A]">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-[#252B27]/85 dark:text-slate-300">
                {/* Sound Alert Toggle */}
                <div className="flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-[#184E82] dark:text-sky-400" />
                  <span>Sound Alert</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={soundAlert}
                    aria-label="Sound Alert"
                    onClick={() => setSoundAlert(!soundAlert)}
                    className={`w-9 h-5 rounded-full transition-colors p-0.5 cursor-pointer ${
                      soundAlert ? 'bg-[#184E82]' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-white shadow-2xs transition-transform ${
                        soundAlert ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Fullscreen Button */}
                <button
                  type="button"
                  onClick={handleToggleFullscreen}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-[#EFF3F7] dark:hover:bg-[#222930] transition-colors cursor-pointer"
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-3.5 h-3.5 text-[#184E82] dark:text-sky-400" />
                  ) : (
                    <Maximize2 className="w-3.5 h-3.5 text-[#184E82] dark:text-sky-400" />
                  )}
                  <span>Fullscreen</span>
                </button>

                {/* Show Time Toggle */}
                <div className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-[#184E82] dark:text-sky-400" />
                  <span>Show Time</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={showTime}
                    aria-label="Show Time"
                    onClick={() => setShowTime(!showTime)}
                    className={`w-9 h-5 rounded-full transition-colors p-0.5 cursor-pointer ${
                      showTime ? 'bg-[#184E82]' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-white shadow-2xs transition-transform ${
                        showTime ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Snowfall Intensity Slider matching reference image */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-[#142334] dark:text-slate-200">
                  <span>Snowfall Intensity</span>
                  <button
                    type="button"
                    onClick={() => setReducedMotion(!reducedMotion)}
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-md border transition-colors cursor-pointer ${
                      reducedMotion
                        ? 'bg-[#EBF5FF] dark:bg-[#1E3148] text-[#184E82] dark:text-sky-300 border-[#184E82]/40'
                        : 'text-[#252B27]/60 dark:text-slate-400 border-transparent hover:border-slate-300'
                    }`}
                    title="Pause falling particles while keeping smooth snow accumulation"
                  >
                    {reducedMotion ? 'Reduced Motion: On' : 'Reduced Motion'}
                  </button>
                </div>
                <div className="flex items-center gap-2.5">
                  <Snowflake className="w-3.5 h-3.5 text-[#184E82] dark:text-sky-400 shrink-0" />
                  <input
                    type="range"
                    min={15}
                    max={100}
                    value={snowfallIntensity}
                    onChange={(e) => setSnowfallIntensity(Number(e.target.value))}
                    aria-label="Snowfall intensity"
                    className="w-full h-1.5 bg-[#DCE5F0] dark:bg-[#2A3440] rounded-lg appearance-none cursor-pointer accent-[#0968B8]"
                  />
                  <SnowflakeCrispIcon className="w-4 h-4 text-[#184E82] dark:text-sky-400 shrink-0" />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (lg:col-span-3): SNOW THEME & SNOW STYLE SELECTOR */}
          <div className="lg:col-span-3 flex flex-col justify-between bg-[#F8FAFC] dark:bg-[#1B2127] rounded-2xl p-4 border border-[#E2E8F0] dark:border-[#2A333D] space-y-4">
            <div className="space-y-4">
              {/* Snow Theme 2x2 Grid */}
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-[#142334] dark:text-white mb-2.5">
                  Snow Theme
                </h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {(Object.values(SNOW_THEMES) as SnowThemeConfig[]).map((theme) => {
                    const isSelected = snowTheme === theme.id;
                    return (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => setSnowTheme(theme.id)}
                        className={`group rounded-xl overflow-hidden border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#0968B8] ring-2 ring-[#0968B8]/25 bg-[#EBF5FF] dark:bg-[#1C2E42]'
                            : 'border-[#DCE3EC] dark:border-[#2E3843] bg-white dark:bg-[#222930] hover:border-[#0968B8]/60'
                        }`}
                      >
                        {/* Crisp Illustrated Mini Winter Scene Thumbnail */}
                        <div className="h-14 w-full relative overflow-hidden">
                          <svg
                            viewBox="0 0 120 70"
                            className="w-full h-full block"
                            shapeRendering="geometricPrecision"
                          >
                            <rect x="0" y="0" width="120" height="70" fill={theme.skyTop} />
                            {/* Horizon Glow */}
                            <ellipse
                              cx="64"
                              cy="42"
                              rx="55"
                              ry="24"
                              fill={theme.skyHorizon}
                              opacity="0.7"
                            />
                            {/* Mountains */}
                            <polygon
                              points="0,50 28,32 56,46 86,28 120,44 120,70 0,70"
                              fill={theme.mountainFar}
                            />
                            {/* Bottom Snowbank */}
                            <path
                              d="M 0 54 Q 40 46 80 53 T 120 50 L 120 70 L 0 70 Z"
                              fill={theme.driftFront}
                            />
                            {/* Mini Cabin for Winter Cabin Thumbnail */}
                            {theme.showCabin && (
                              <g transform="translate(56, 36)">
                                <polygon points="4,10 18,1 32,10 32,22 4,22" fill="#5A3825" />
                                <path
                                  d="M 1 11 L 18 0 L 35 11 Z"
                                  fill="#F4F9FF"
                                />
                                <rect x="9" y="12" width="6" height="5" fill="#FBBF24" />
                                <rect x="20" y="12" width="6" height="5" fill="#FBBF24" />
                              </g>
                            )}
                            {/* Mini Snow-Covered Pines */}
                            <polygon points="8,58 18,24 28,58" fill={theme.treeDark} />
                            <polygon points="10,44 18,24 26,44" fill={theme.treeSnow} opacity="0.85" />
                            <polygon points="24,58 32,32 40,58" fill={theme.treeDark} />
                            <polygon points="94,58 104,26 114,58" fill={theme.treeDark} />
                            {/* Tiny falling snow dots */}
                            <circle cx="42" cy="14" r="1.3" fill="#FFFFFF" opacity="0.9" />
                            <circle cx="76" cy="18" r="1.5" fill="#FFFFFF" opacity="0.85" />
                            <circle cx="58" cy="26" r="1.1" fill="#FFFFFF" opacity="0.8" />
                          </svg>
                        </div>
                        <div
                          className={`py-1.5 px-1 text-[11px] font-semibold truncate ${
                            isSelected
                              ? 'text-[#0968B8] dark:text-sky-300'
                              : 'text-[#252B27]/85 dark:text-slate-200'
                          }`}
                        >
                          {theme.label}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Snow Style 4 Circular Swatches matching screenshot */}
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-[#142334] dark:text-white mb-2.5">
                  Snow Style
                </h3>
                <div className="flex items-center justify-between gap-2">
                  {SNOW_STYLES.map((st, idx) => {
                    const isSelected = snowStyle === st.id;
                    return (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setSnowStyle(st.id)}
                        title={st.label}
                        aria-label={`Snow style: ${st.label}`}
                        className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all cursor-pointer p-0.5 ${
                          isSelected
                            ? 'border-[#184E82] scale-105 shadow-xs'
                            : 'border-transparent hover:border-[#94A3B8]'
                        }`}
                      >
                        <svg
                          viewBox="0 0 48 48"
                          className="w-full h-full rounded-full"
                          shapeRendering="geometricPrecision"
                        >
                          <circle
                            cx="24"
                            cy="24"
                            r="24"
                            fill={idx === 0 ? '#184775' : '#6A92BD'}
                          />
                          {st.id === 'crystalline' && (
                            <g
                              stroke="#FFFFFF"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              transform="translate(24, 24)"
                            >
                              {[0, 60, 120].map((deg) => (
                                <g key={deg} transform={`rotate(${deg})`}>
                                  <line x1="0" y1="-13" x2="0" y2="13" />
                                  <polyline points="-3.5,-8.5 0,-5.5 3.5,-8.5" fill="none" />
                                  <polyline points="-3.5,8.5 0,5.5 3.5,8.5" fill="none" />
                                </g>
                              ))}
                            </g>
                          )}
                          {st.id === 'star-flake' && (
                            <g
                              stroke="#FFFFFF"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              transform="translate(24, 24)"
                            >
                              {[0, 60, 120].map((deg) => (
                                <g key={deg} transform={`rotate(${deg})`}>
                                  <line x1="0" y1="-11" x2="0" y2="11" />
                                  <line x1="-2.5" y1="-6.5" x2="2.5" y2="-6.5" />
                                  <line x1="-2.5" y1="6.5" x2="2.5" y2="6.5" />
                                </g>
                              ))}
                            </g>
                          )}
                          {st.id === 'soft-powder' && (
                            <g fill="#FFFFFF" stroke="#FFFFFF" strokeLinecap="round">
                              {/* Center 4-point diamond star */}
                              <line x1="24" y1="16" x2="24" y2="32" strokeWidth="1.8" />
                              <line x1="16" y1="24" x2="32" y2="24" strokeWidth="1.8" />
                              <circle cx="24" cy="24" r="2.5" />
                              <circle cx="14" cy="14" r="1.5" opacity="0.85" />
                              <circle cx="34" cy="15" r="1.3" opacity="0.85" />
                              <circle cx="15" cy="34" r="1.4" opacity="0.85" />
                              <circle cx="34" cy="33" r="1.6" opacity="0.85" />
                            </g>
                          )}
                          {st.id === 'gentle-flurries' && (
                            <g fill="#FFFFFF">
                              <circle cx="24" cy="24" r="2.8" />
                              <circle cx="15" cy="16" r="1.8" opacity="0.85" />
                              <circle cx="33" cy="17" r="2.1" opacity="0.9" />
                              <circle cx="16" cy="32" r="2.0" opacity="0.85" />
                              <circle cx="32" cy="31" r="1.7" opacity="0.8" />
                              <circle cx="24" cy="12" r="1.3" opacity="0.75" />
                              <circle cx="24" cy="36" r="1.4" opacity="0.75" />
                            </g>
                          )}
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
              onClick={handleSaveDefault}
              className="w-full py-2.5 px-4 rounded-xl bg-white dark:bg-[#222930] border border-[#2A845C] text-[#1E6F4C] dark:text-emerald-300 hover:bg-[#F0F9F4] dark:hover:bg-[#1E2F28] text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {savedToast ? (
                <>
                  <Check className="w-4 h-4 text-[#1E6F4C]" />
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

      {/* QUICK PRESETS SECTION MATCHING SCREENSHOT */}
      <div>
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#142334] dark:text-white">
          Quick Presets
        </h2>
        <p className="text-xs sm:text-sm text-[#252B27]/70 dark:text-slate-400 mt-0.5 mb-4">
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
            const isSelected = selectedPreset === preset.mins && mode === 'duration';
            return (
              <button
                key={preset.mins}
                type="button"
                onClick={() => applyDurationMinutes(preset.mins, preset.mins)}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#F0F7FF] dark:bg-[#1A2836] border-[#0968B8] shadow-2xs'
                    : 'bg-white dark:bg-[#1A201C] border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#0968B8]/60'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-[#EBF5FF] dark:bg-[#1E3148] text-[#0968B8] dark:text-sky-400 flex items-center justify-center shrink-0">
                  <SnowflakeCrispIcon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-xs sm:text-sm text-[#142334] dark:text-white truncate">
                    {preset.label}
                  </div>
                  <div
                    className={`text-[11px] truncate ${
                      isSelected
                        ? 'text-[#0968B8] dark:text-sky-300 font-medium'
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
              setSelectedPreset('custom');
              customInputRef.current?.focus();
            }}
            className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
              selectedPreset === 'custom'
                ? 'bg-[#F0F7FF] dark:bg-[#1A2836] border-[#0968B8] shadow-2xs'
                : 'bg-white dark:bg-[#1A201C] border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#0968B8]/60'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-[#EBF5FF] dark:bg-[#1E3148] text-[#0968B8] dark:text-sky-400 flex items-center justify-center shrink-0">
              <Settings className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-xs sm:text-sm text-[#142334] dark:text-white truncate">
                Custom
              </div>
              <div className="text-[11px] text-[#252B27]/65 dark:text-slate-400 truncate">
                Set your own time
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* POPULAR USES SECTION MATCHING SCREENSHOT */}
      <div>
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#142334] dark:text-white">
          Popular Uses
        </h2>
        <p className="text-xs sm:text-sm text-[#252B27]/70 dark:text-slate-400 mt-0.5 mb-4">
          A snow timer is great for many everyday activities.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {[
            {
              title: 'Study Sessions',
              desc: 'Stay focused and get more done.',
              mins: 25,
              icon: <BookOpen className="w-5 h-5 text-[#0968B8]" />,
            },
            {
              title: 'Classroom Activities',
              desc: 'Manage transitions and group tasks.',
              mins: 10,
              icon: <GraduationCap className="w-5 h-5 text-[#0968B8]" />,
            },
            {
              title: 'Work Breaks',
              desc: 'Take a calm and refreshing break.',
              mins: 5,
              icon: <Monitor className="w-5 h-5 text-[#0968B8]" />,
            },
            {
              title: 'Mindful Moments',
              desc: 'Relax, breathe and reset your mind.',
              mins: 3,
              icon: <Heart className="w-5 h-5 text-[#0968B8]" />,
            },
            {
              title: 'Activity Transitions',
              desc: 'Keep activities smooth and on time.',
              mins: 1,
              icon: <Activity className="w-5 h-5 text-[#0968B8]" />,
            },
            {
              title: 'Seasonal Games',
              desc: 'Add a winter theme to quizzes and games.',
              mins: 5,
              icon: <Calendar className="w-5 h-5 text-[#0968B8]" />,
            },
          ].map((useCase) => (
            <button
              key={useCase.title}
              type="button"
              onClick={() =>
                applyDurationMinutes(
                  useCase.mins,
                  [1, 3, 5, 10, 25].includes(useCase.mins) ? useCase.mins : 'custom'
                )
              }
              className="flex items-start gap-3 p-3.5 rounded-2xl bg-white dark:bg-[#1A201C] border border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#0968B8] transition-all text-left cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-[#EBF5FF] dark:bg-[#1E3148] flex items-center justify-center shrink-0 mt-0.5">
                {useCase.icon}
              </div>
              <div className="min-w-0">
                <div className="font-bold text-xs sm:text-sm text-[#142334] dark:text-white">
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

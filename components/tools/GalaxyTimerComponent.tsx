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
  Gamepad2,
  Rocket,
} from 'lucide-react';

type GalaxyThemeId = 'spiral-galaxy' | 'nebula-cloud' | 'starfield' | 'andromeda-style';
type BackgroundStyleId = 'deep-space' | 'violet-nebula' | 'cosmic-teal' | 'amber-cosmos';

interface GalaxyThemeConfig {
  id: GalaxyThemeId;
  label: string;
  coreInner: string;
  coreMid: string;
  coreOuter: string;
  armPrimary: string;
  armSecondary: string;
  nebulaGlow1: string;
  nebulaGlow2: string;
  starTint: string;
  tiltX: number;
  tiltAngle: number;
}

const GALAXY_THEMES: Record<GalaxyThemeId, GalaxyThemeConfig> = {
  'spiral-galaxy': {
    id: 'spiral-galaxy',
    label: 'Spiral Galaxy',
    coreInner: '#FFFDF5',
    coreMid: '#FBBF24',
    coreOuter: '#EC4899',
    armPrimary: '#818CF8',
    armSecondary: '#C084FC',
    nebulaGlow1: 'rgba(139, 92, 246, 0.34)',
    nebulaGlow2: 'rgba(59, 130, 246, 0.28)',
    starTint: '#E0E7FF',
    tiltX: 0.56,
    tiltAngle: -0.46,
  },
  'nebula-cloud': {
    id: 'nebula-cloud',
    label: 'Nebula Cloud',
    coreInner: '#FFF5FF',
    coreMid: '#E879F9',
    coreOuter: '#9333EA',
    armPrimary: '#C084FC',
    armSecondary: '#F472B6',
    nebulaGlow1: 'rgba(192, 38, 211, 0.42)',
    nebulaGlow2: 'rgba(124, 58, 237, 0.35)',
    starTint: '#FAE8FF',
    tiltX: 0.68,
    tiltAngle: -0.35,
  },
  starfield: {
    id: 'starfield',
    label: 'Starfield',
    coreInner: '#F0F9FF',
    coreMid: '#93C5FD',
    coreOuter: '#6366F1',
    armPrimary: '#60A5FA',
    armSecondary: '#A78BFA',
    nebulaGlow1: 'rgba(56, 189, 248, 0.25)',
    nebulaGlow2: 'rgba(139, 92, 246, 0.25)',
    starTint: '#F0F9FF',
    tiltX: 0.62,
    tiltAngle: -0.4,
  },
  'andromeda-style': {
    id: 'andromeda-style',
    label: 'Andromeda Style',
    coreInner: '#FFFBEB',
    coreMid: '#F59E0B',
    coreOuter: '#D97706',
    armPrimary: '#FCD34D',
    armSecondary: '#FB923C',
    nebulaGlow1: 'rgba(245, 158, 11, 0.34)',
    nebulaGlow2: 'rgba(168, 85, 247, 0.24)',
    starTint: '#FEF3C7',
    tiltX: 0.44,
    tiltAngle: -0.52,
  },
};

interface BackgroundStyleConfig {
  id: BackgroundStyleId;
  label: string;
  bgTop: string;
  bgMid: string;
  bgBottom: string;
  accentNebula: string;
}

const BACKGROUND_STYLES: Record<BackgroundStyleId, BackgroundStyleConfig> = {
  'deep-space': {
    id: 'deep-space',
    label: 'Deep Sapphire',
    bgTop: '#040714',
    bgMid: '#0A122C',
    bgBottom: '#130D2E',
    accentNebula: 'rgba(99, 102, 241, 0.24)',
  },
  'violet-nebula': {
    id: 'violet-nebula',
    label: 'Cosmic Violet',
    bgTop: '#0B0418',
    bgMid: '#1C0B36',
    bgBottom: '#2A0F4D',
    accentNebula: 'rgba(192, 38, 211, 0.28)',
  },
  'cosmic-teal': {
    id: 'cosmic-teal',
    label: 'Aurora Teal',
    bgTop: '#030B17',
    bgMid: '#071F36',
    bgBottom: '#0C2B45',
    accentNebula: 'rgba(45, 212, 191, 0.22)',
  },
  'amber-cosmos': {
    id: 'amber-cosmos',
    label: 'Supernova Amber',
    bgTop: '#120509',
    bgMid: '#240B14',
    bgBottom: '#1D0D26',
    accentNebula: 'rgba(249, 115, 22, 0.26)',
  },
};

const STORAGE_KEY = 'timetools_galaxy_timer_prefs_v1';

const CANVAS_W = 800;
const CANVAS_H = 680;

interface BackgroundStar {
  x: number;
  y: number;
  size: number;
  threshold: number; // 0..1 progress threshold when star reveals
  baseAlpha: number;
  phase: number;
  color: string;
  isFourPoint: boolean;
}

interface SpiralStar {
  armIndex: number;
  t: number; // 0..1 radial distance along spiral arm
  angleOffset: number;
  radialSpread: number;
  size: number;
  color: string;
  alpha: number;
  threshold: number;
}

const STAR_COLORS = ['#FFFFFF', '#E0E7FF', '#FDE68A', '#F5D0FE', '#BAE6FD', '#FCA5A5'];

function createBackgroundStars(): BackgroundStar[] {
  const stars: BackgroundStar[] = [];
  const count = 210;
  for (let i = 0; i < count; i++) {
    const px = ((i * 137.5) % 1000) / 1000;
    const py = ((i * 293.7) % 1000) / 1000;
    const isFourPoint = i % 19 === 0;
    const size = isFourPoint ? 2.4 + (i % 3) * 0.7 : 0.8 + ((i * 7) % 10) * 0.16;
    stars.push({
      x: px * CANVAS_W,
      y: py * CANVAS_H,
      size,
      threshold: (i / count) * 0.92,
      baseAlpha: 0.45 + ((i * 13) % 55) * 0.01,
      phase: (i * 0.83) % (Math.PI * 2),
      color: STAR_COLORS[i % STAR_COLORS.length],
      isFourPoint,
    });
  }
  return stars;
}

function createSpiralGalaxyStars(): SpiralStar[] {
  const particles: SpiralStar[] = [];
  const arms = 4;
  const perArm = 135;
  for (let arm = 0; arm < arms; arm++) {
    for (let i = 0; i < perArm; i++) {
      const t = Math.pow(i / perArm, 0.86); // 0 = center, 1 = outer tip
      const pseudoRand1 = ((i * 73 + arm * 31) % 100) / 100 - 0.5;
      const pseudoRand2 = ((i * 41 + arm * 19) % 100) / 100 - 0.5;
      const angleOffset = pseudoRand1 * (0.35 + t * 0.45);
      const radialSpread = pseudoRand2 * (12 + t * 38);
      const size = t < 0.25 ? 2.2 + (i % 3) * 0.7 : 1.0 + ((i * 5) % 7) * 0.26;
      const color =
        t < 0.22
          ? '#FFFBEB'
          : t < 0.45
          ? '#FDE68A'
          : t < 0.68
          ? '#F472B6'
          : i % 2 === 0
          ? '#93C5FD'
          : '#C4B5FD';
      particles.push({
        armIndex: arm,
        t,
        angleOffset,
        radialSpread,
        size,
        color,
        alpha: (1 - t * 0.55) * (0.55 + ((i * 11) % 45) * 0.01),
        threshold: Math.min(0.98, t * 0.95),
      });
    }
  }
  return particles;
}

// Constellation nodes in upper/outer sky that progressively link as countdown runs
const CONSTELLATION_NODES: Array<{ x: number; y: number; threshold: number }> = [
  { x: 118, y: 122, threshold: 0.15 },
  { x: 168, y: 96, threshold: 0.25 },
  { x: 224, y: 118, threshold: 0.35 },
  { x: 266, y: 88, threshold: 0.45 },
  { x: 565, y: 108, threshold: 0.55 },
  { x: 622, y: 86, threshold: 0.68 },
  { x: 678, y: 116, threshold: 0.8 },
  { x: 716, y: 162, threshold: 0.92 },
];

// Crisp Spiral Galaxy SVG Icon for Presets & Pills
function SpiralGalaxyIcon({ className = 'w-6 h-6' }: { className?: string }) {
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
      <ellipse cx="14" cy="14" rx="3.2" ry="2.2" fill="currentColor" stroke="none" />
      <path d="M11 13.5C9.5 11.2 11.8 8.2 15.8 8.4C20.4 8.6 23.5 12.2 22.2 16.2C21.1 19.6 16.5 21.6 11.5 20.6" />
      <path d="M17 14.5C18.5 16.8 16.2 19.8 12.2 19.6C7.6 19.4 4.5 15.8 5.8 11.8C6.9 8.4 11.5 6.4 16.5 7.4" />
      <circle cx="6.5" cy="7.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="21.5" cy="20.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function GalaxyTimerComponent() {
  // Mode & Duration State (Default 25 minutes matching 25:00 in reference screenshot)
  const [mode, setMode] = useState<'duration' | 'endTime'>('duration');
  const [selectedPreset, setSelectedPreset] = useState<number | 'custom'>(25);
  const [customMinutes, setCustomMinutes] = useState<number>(25);
  const [endTimeStr, setEndTimeStr] = useState<string>('21:00');

  const [totalMs, setTotalMs] = useState<number>(25 * 60 * 1000);
  const [remainingMs, setRemainingMs] = useState<number>(25 * 60 * 1000);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [hasStartedOnce, setHasStartedOnce] = useState<boolean>(false);

  // Customization & Toggles State
  const [galaxyTheme, setGalaxyTheme] = useState<GalaxyThemeId>('spiral-galaxy');
  const [bgStyle, setBgStyle] = useState<BackgroundStyleId>('deep-space');
  const [soundAlert, setSoundAlert] = useState<boolean>(true);
  const [showTime, setShowTime] = useState<boolean>(true);
  const [animationSpeed, setAnimationSpeed] = useState<number>(50);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [savedToast, setSavedToast] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const galaxyCanvasRef = useRef<HTMLCanvasElement>(null);
  const customInputRef = useRef<HTMLInputElement>(null);
  const endTimeRef = useRef<number | null>(null);
  const timerRafRef = useRef<number | null>(null);
  const animRafRef = useRef<number | null>(null);
  const bgStarsRef = useRef<BackgroundStar[]>(createBackgroundStars());
  const spiralStarsRef = useRef<SpiralStar[]>(createSpiralGalaxyStars());
  const rotationRef = useRef<number>(0);
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
          if (parsed.galaxyTheme && GALAXY_THEMES[parsed.galaxyTheme as GalaxyThemeId]) {
            setGalaxyTheme(parsed.galaxyTheme);
          }
          if (parsed.bgStyle && BACKGROUND_STYLES[parsed.bgStyle as BackgroundStyleId]) {
            setBgStyle(parsed.bgStyle);
          }
          if (typeof parsed.soundAlert === 'boolean') setSoundAlert(parsed.soundAlert);
          if (typeof parsed.showTime === 'boolean') setShowTime(parsed.showTime);
          if (typeof parsed.animationSpeed === 'number') {
            setAnimationSpeed(Math.max(10, Math.min(100, parsed.animationSpeed)));
          }
          if (typeof parsed.reducedMotion === 'boolean') setReducedMotion(parsed.reducedMotion);
          if (typeof parsed.customMinutes === 'number' && parsed.customMinutes > 0) {
            setCustomMinutes(parsed.customMinutes);
            setSelectedPreset(parsed.selectedPreset ?? 25);
            setTotalMs(parsed.customMinutes * 60 * 1000);
            setRemainingMs(parsed.customMinutes * 60 * 1000);
          }
        }, 0);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  // Gentle Cosmic Chime using Web Audio API
  const playCosmicChime = useCallback(() => {
    if (!soundAlert) return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      // Ambient space harmonic chord (D4, A4, F#5, D6)
      const notes = [293.66, 440.0, 739.99, 1174.66];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.22);

        gain.gain.setValueAtTime(0.0001, ctx.currentTime + idx * 0.22);
        gain.gain.exponentialRampToValueAtTime(0.11, ctx.currentTime + idx * 0.22 + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.22 + 2.4);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.22);
        osc.stop(ctx.currentTime + idx * 0.22 + 2.5);
      });
    } catch {
      // ignore audio restrictions
    }
  }, [soundAlert]);

  // Accurate Drift-Free Countdown Loop
  useEffect(() => {
    if (!isRunning) {
      if (timerRafRef.current) cancelAnimationFrame(timerRafRef.current);
      return;
    }

    const tick = () => {
      if (!endTimeRef.current) return;
      const now = Date.now();
      const left = Math.max(0, endTimeRef.current - now);
      setRemainingMs(left);

      if (left <= 0) {
        setIsRunning(false);
        setIsCompleted(true);
        endTimeRef.current = null;
        playCosmicChime();
        return;
      }
      timerRafRef.current = requestAnimationFrame(tick);
    };

    timerRafRef.current = requestAnimationFrame(tick);
    return () => {
      if (timerRafRef.current) cancelAnimationFrame(timerRafRef.current);
    };
  }, [isRunning, playCosmicChime]);

  // Fullscreen listener
  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // Apply duration helper
  const applyDurationMinutes = useCallback((mins: number, presetId: number | 'custom') => {
    const clamped = Math.max(1, Math.min(240, mins));
    const ms = clamped * 60 * 1000;
    setIsRunning(false);
    setIsCompleted(false);
    setHasStartedOnce(false);
    endTimeRef.current = null;
    setSelectedPreset(presetId);
    setCustomMinutes(clamped);
    setTotalMs(ms);
    setRemainingMs(ms);
  }, []);

  // Compute target duration when switching to End Time mode
  const applyEndTime = useCallback((timeStr: string) => {
    setEndTimeStr(timeStr);
    const [hh, mm] = timeStr.split(':').map(Number);
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
  }, []);

  const handleStart = () => {
    let currentLeft = remainingMs;
    if (currentLeft <= 0 || isCompleted) {
      currentLeft = totalMs;
      setRemainingMs(totalMs);
      setIsCompleted(false);
    }
    setHasStartedOnce(true);
    endTimeRef.current = Date.now() + currentLeft;
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
          galaxyTheme,
          bgStyle,
          soundAlert,
          showTime,
          animationSpeed,
          reducedMotion,
          customMinutes,
          selectedPreset,
        })
      );
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 2200);
    } catch {
      // ignore storage errors
    }
  };

  // Formatted clock string
  const formattedTime = useMemo(() => {
    const totalSeconds = Math.ceil(remainingMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) {
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(
        seconds
      ).padStart(2, '0')}`;
    }
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }, [remainingMs]);

  // Elapsed fraction (0.0 -> 1.0)
  const elapsedProgress = useMemo(() => {
    if (totalMs <= 0) return 0;
    if (isCompleted) return 1;
    return Math.max(0, Math.min(1, 1 - remainingMs / totalMs));
  }, [remainingMs, totalMs, isCompleted]);

  // Visual reveal progress:
  // Before user clicks Start (`!hasStartedOnce && !isRunning`), show the full galaxy showcase (0.94)
  // matching the initial screenshot. Once started, reveal from 0.16 (partial galaxy/core starfield)
  // proportionally up to 1.0 at completion.
  const visualRevealProgress = useMemo(() => {
    if (isCompleted) return 1;
    if (!hasStartedOnce && !isRunning && elapsedProgress === 0) {
      return 0.94;
    }
    return Math.max(0.16, Math.min(1, 0.16 + elapsedProgress * 0.84));
  }, [hasStartedOnce, isRunning, elapsedProgress, isCompleted]);

  // Speed label
  const speedLabel = useMemo(() => {
    if (reducedMotion) return 'Low Motion';
    if (animationSpeed < 35) return 'Slow';
    if (animationSpeed > 70) return 'Fast';
    return 'Normal';
  }, [animationSpeed, reducedMotion]);

  // High-DPI Galaxy, Nebula & Starfield Canvas Renderer
  useEffect(() => {
    const canvas = galaxyCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 2, 3);
    const targetW = CANVAS_W * dpr;
    const targetH = CANVAS_H * dpr;
    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    const themeCfg = GALAXY_THEMES[galaxyTheme];
    const bgCfg = BACKGROUND_STYLES[bgStyle];

    const renderFrame = (timestamp: number) => {
      const dt = lastFrameTimeRef.current
        ? Math.min(0.05, (timestamp - lastFrameTimeRef.current) / 1000)
        : 0.016;
      lastFrameTimeRef.current = timestamp;

      const speedFactor = reducedMotion ? 0 : (animationSpeed / 50) * (isRunning ? 1 : 0.35);
      rotationRef.current += dt * 0.11 * speedFactor;

      ctx.save();
      ctx.scale(dpr, dpr);

      // 1. Deep Space Gradient Background
      const skyGrad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
      skyGrad.addColorStop(0, bgCfg.bgTop);
      skyGrad.addColorStop(0.55, bgCfg.bgMid);
      skyGrad.addColorStop(1, bgCfg.bgBottom);
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      // Galaxy Center coordinates (positioned slightly lower-center so 25:00 at top is crystal clear)
      const cx = CANVAS_W * 0.5;
      const cy = CANVAS_H * 0.61;

      // 2. Soft Ambient Nebula Clouds (scales with visualRevealProgress)
      const nebulaRadius = 220 + visualRevealProgress * 150;
      const neb1 = ctx.createRadialGradient(
        cx - 75,
        cy - 30,
        15,
        cx - 40,
        cy - 20,
        nebulaRadius
      );
      neb1.addColorStop(0, themeCfg.nebulaGlow1);
      neb1.addColorStop(0.55, bgCfg.accentNebula);
      neb1.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = neb1;
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      const neb2 = ctx.createRadialGradient(
        cx + 85,
        cy + 25,
        10,
        cx + 60,
        cy + 15,
        nebulaRadius * 0.9
      );
      neb2.addColorStop(0, themeCfg.nebulaGlow2);
      neb2.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = neb2;
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      // 3. Background Starfield (stars reveal proportionally with visualRevealProgress)
      const bgStars = bgStarsRef.current;
      for (let i = 0; i < bgStars.length; i++) {
        const st = bgStars[i];
        if (st.threshold > visualRevealProgress) continue;

        const revealFade = Math.min(1, (visualRevealProgress - st.threshold) * 6);
        const gentleShimmer = reducedMotion
          ? 1
          : 0.84 + 0.16 * Math.sin(timestamp * 0.0012 * (animationSpeed / 50) + st.phase);
        const alpha = st.baseAlpha * revealFade * gentleShimmer;

        ctx.fillStyle = st.color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.size, 0, Math.PI * 2);
        ctx.fill();

        if (st.isFourPoint) {
          ctx.strokeStyle = st.color;
          ctx.lineWidth = 0.9;
          ctx.beginPath();
          ctx.moveTo(st.x - st.size * 2.8, st.y);
          ctx.lineTo(st.x + st.size * 2.8, st.y);
          ctx.moveTo(st.x, st.y - st.size * 2.8);
          ctx.lineTo(st.x, st.y + st.size * 2.8);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;

      // 4. Progressive Constellation Lines in Upper Sky
      ctx.save();
      ctx.strokeStyle = 'rgba(199, 210, 254, 0.28)';
      ctx.lineWidth = 1.1;
      for (let i = 0; i < CONSTELLATION_NODES.length - 1; i++) {
        if ( i === 3 ) continue; // break between left and right constellations
        const n1 = CONSTELLATION_NODES[i];
        const n2 = CONSTELLATION_NODES[i + 1];
        if (visualRevealProgress >= n2.threshold) {
          const lineFade = Math.min(1, (visualRevealProgress - n2.threshold) * 5);
          ctx.globalAlpha = lineFade * 0.45;
          ctx.beginPath();
          ctx.moveTo(n1.x, n1.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.stroke();
        }
      }
      for (let i = 0; i < CONSTELLATION_NODES.length; i++) {
        const node = CONSTELLATION_NODES[i];
        if (visualRevealProgress >= node.threshold) {
          ctx.globalAlpha = 0.75;
          ctx.fillStyle = '#E0E7FF';
          ctx.beginPath();
          ctx.arc(node.x, node.y, 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();

      // 5. Tilted 3D Spiral Galaxy & Luminous Galactic Core
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(themeCfg.tiltAngle);
      ctx.scale(1, themeCfg.tiltX);

      // Continuous ribbons of spiral arms
      const maxArmRadius = 290 * (0.35 + visualRevealProgress * 0.65);
      const numArms = 2;
      for (let arm = 0; arm < numArms; arm++) {
        const armBaseAngle = arm * Math.PI + rotationRef.current;
        ctx.save();
        ctx.beginPath();
        for (let step = 0; step <= 70; step++) {
          const frac = step / 70;
          if (frac > visualRevealProgress) break;
          const r = frac * maxArmRadius;
          const theta = armBaseAngle + frac * 4.4;
          const px = Math.cos(theta) * r;
          const py = Math.sin(theta) * r;
          if (step === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = arm === 0 ? themeCfg.armPrimary : themeCfg.armSecondary;
        ctx.globalAlpha = 0.22;
        ctx.lineWidth = 42;
        ctx.lineCap = 'round';
        ctx.stroke();

        ctx.globalAlpha = 0.34;
        ctx.lineWidth = 18;
        ctx.strokeStyle = themeCfg.coreOuter;
        ctx.stroke();
        ctx.restore();
      }

      // Spiral Galaxy Star Clusters along the 4 arms
      const spiralStars = spiralStarsRef.current;
      const maxGalaxyR = 305;
      for (let i = 0; i < spiralStars.length; i++) {
        const sp = spiralStars[i];
        if (sp.threshold > visualRevealProgress) continue;

        const revealAlpha = Math.min(1, (visualRevealProgress - sp.threshold) * 5);
        const r = sp.t * maxGalaxyR + sp.radialSpread;
        const baseArmAngle = (sp.armIndex * Math.PI) / 2;
        const spiralTwist = sp.t * 4.2;
        const theta = baseArmAngle + spiralTwist + sp.angleOffset + rotationRef.current;

        const x = Math.cos(theta) * r;
        const y = Math.sin(theta) * r;

        ctx.globalAlpha = sp.alpha * revealAlpha;
        ctx.fillStyle = sp.color;
        ctx.beginPath();
        ctx.arc(x, y, sp.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Glowing Galactic Core (bright golden-white center)
      const coreScale = 0.65 + visualRevealProgress * 0.35;
      const coreOuterGrad = ctx.createRadialGradient(0, 0, 4, 0, 0, 145 * coreScale);
      coreOuterGrad.addColorStop(0, themeCfg.coreInner);
      coreOuterGrad.addColorStop(0.22, themeCfg.coreMid);
      coreOuterGrad.addColorStop(0.55, themeCfg.coreOuter);
      coreOuterGrad.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.globalAlpha = 0.95;
      ctx.fillStyle = coreOuterGrad;
      ctx.beginPath();
      ctx.arc(0, 0, 145 * coreScale, 0, Math.PI * 2);
      ctx.fill();

      // Brilliant inner nucleus
      const coreInnerGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 46 * coreScale);
      coreInnerGrad.addColorStop(0, '#FFFFFF');
      coreInnerGrad.addColorStop(0.5, themeCfg.coreInner);
      coreInnerGrad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = coreInnerGrad;
      ctx.beginPath();
      ctx.arc(0, 0, 46 * coreScale, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // 6. Subtle Completion Cosmic Halo when timer finishes
      if (isCompleted) {
        ctx.save();
        ctx.strokeStyle = 'rgba(253, 230, 138, 0.55)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, 240, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      ctx.restore();

      if ((isRunning || !reducedMotion) && !document.hidden) {
        animRafRef.current = requestAnimationFrame(renderFrame);
      }
    };

    animRafRef.current = requestAnimationFrame(renderFrame);
    return () => {
      if (animRafRef.current) cancelAnimationFrame(animRafRef.current);
    };
  }, [galaxyTheme, bgStyle, animationSpeed, reducedMotion, isRunning, visualRevealProgress, isCompleted]);

  const presetButtons: Array<{ label: string; value: number | 'custom' }> = [
    { label: '1 min', value: 1 },
    { label: '3 min', value: 3 },
    { label: '5 min', value: 5 },
    { label: '10 min', value: 10 },
    { label: '25 min', value: 25 },
    { label: 'Custom', value: 'custom' },
  ];

  const quickPresetsList = [
    { mins: 1, title: '1 Minute', sub: 'Quick break' },
    { mins: 3, title: '3 Minutes', sub: 'Short focus' },
    { mins: 5, title: '5 Minutes', sub: 'Study session', highlighted: true },
    { mins: 10, title: '10 Minutes', sub: 'Deep work' },
    { mins: 25, title: '25 Minutes', sub: 'Longer session' },
  ];

  const popularUses = [
    {
      title: 'Study Sessions',
      desc: 'Stay focused and productive.',
      icon: <BookOpen className="w-5 h-5 text-[#5B21B6]" />,
    },
    {
      title: 'Classroom Activities',
      desc: 'Manage transitions and group tasks.',
      icon: <GraduationCap className="w-5 h-5 text-[#5B21B6]" />,
    },
    {
      title: 'Creative Work',
      desc: 'Find a calm and inspiring flow.',
      icon: <Monitor className="w-5 h-5 text-[#5B21B6]" />,
    },
    {
      title: 'Mindful Moments',
      desc: 'Relax, breathe and reset your mind.',
      icon: <Heart className="w-5 h-5 text-[#5B21B6]" />,
    },
    {
      title: 'Gaming Breaks',
      desc: 'Use a visual timer for healthy breaks.',
      icon: <Gamepad2 className="w-5 h-5 text-[#5B21B6]" />,
    },
    {
      title: 'Productivity Routines',
      desc: 'Keep your daily activities on track.',
      icon: <Rocket className="w-5 h-5 text-[#5B21B6]" />,
    },
  ];

  return (
    <div className="space-y-10">
      {/* MAIN 3-COLUMN INTERACTIVE TOOL CARD */}
      <div
        ref={containerRef}
        className="rounded-3xl bg-white dark:bg-[#171C19] border border-[#E4E1D9] dark:border-[#2A332D] shadow-sm p-4 sm:p-6 lg:p-7"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-7 items-stretch">
          {/* LEFT COLUMN: GALAXY & STARFIELD VISUAL DISPLAY (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col">
            <div
              className={`relative w-full aspect-[4/3.65] sm:aspect-[4/3.55] rounded-2xl overflow-hidden border border-[#241B4B] shadow-inner select-none bg-[#050816] ${
                isFullscreen ? 'timer-fullscreen-stage' : ''
              }`}
            >
              {/* High-DPI Galaxy & Starfield Canvas */}
              <canvas
                ref={galaxyCanvasRef}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />

              {/* Subtle Top Vignette for crisp white numeric legibility */}
              <div
                className="absolute inset-x-0 top-0 h-36 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(4, 7, 20, 0.62) 0%, rgba(4, 7, 20, 0) 100%)',
                }}
              />

              {/* Digital Countdown Display Positioned in Upper Sky */}
              {(showTime || isFullscreen) && (
                <div className={`absolute inset-x-0 ${isFullscreen ? 'top-4 sm:top-7' : 'top-7 sm:top-9'} flex flex-col items-center justify-start pointer-events-none z-20 px-4`}>
                  <div
                    className={`font-sans font-bold tracking-tight text-white leading-none tabular-nums ${
                      isFullscreen
                        ? 'text-[clamp(2.5rem,12vmin,6rem)]'
                        : 'text-5xl sm:text-6xl lg:text-[64px]'
                    }`}
                    style={{
                      textShadow:
                        '0 4px 20px rgba(8, 10, 32, 0.85), 0 1px 4px rgba(0, 0, 0, 0.7)',
                    }}
                  >
                    {formattedTime}
                  </div>
                  {!isFullscreen && (
                    <div
                      className="mt-2 text-sm sm:text-base font-medium text-indigo-100/95 tracking-wide"
                      style={{
                        textShadow: '0 2px 10px rgba(8, 10, 32, 0.9)',
                      }}
                    >
                      {isCompleted ? 'Galaxy Complete' : 'Focus Time'}
                    </div>
                  )}
                </div>
              )}

              {/* Subtle Starfield Progress Pill at Bottom-Left when running (normal mode only) */}
              {!isFullscreen && (isRunning || hasStartedOnce || isCompleted) && (
                <div className="absolute bottom-3 left-3 z-20 bg-[#0D1026]/80 backdrop-blur-xs border border-indigo-400/25 rounded-full px-3 py-1 text-[11px] font-medium text-indigo-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                  <span>Galaxy Reveal: {Math.round(elapsedProgress * 100)}%</span>
                </div>
              )}

              {/* Fullscreen Exit Button in Top-Right Corner */}
              {isFullscreen && (
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="absolute top-4 right-4 z-30 bg-black/65 hover:bg-black/85 text-white rounded-xl px-3.5 py-2 text-xs font-semibold flex items-center gap-1.5 backdrop-blur-xs transition-colors cursor-pointer"
                  aria-label="Exit Fullscreen"
                >
                  <Minimize2 className="w-4 h-4" />
                  <span>Exit Fullscreen</span>
                </button>
              )}
            </div>
          </div>

          {/* MIDDLE COLUMN: CONTROLS (lg:col-span-4) */}
          {!isFullscreen && (
            <div className="lg:col-span-4 flex flex-col justify-between space-y-4 py-0.5">
              {/* Duration / End Time Segmented Tabs */}
              <div className="grid grid-cols-2 bg-[#F1F2F6] dark:bg-[#222824] p-1 rounded-xl border border-[#E2E4EC] dark:border-[#2E3631]">
                <button
                  type="button"
                  onClick={() => setMode('duration')}
                  className={`py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                    mode === 'duration'
                      ? 'bg-[#4C1D95] text-white shadow-xs'
                      : 'text-[#252B27]/75 dark:text-slate-300 hover:text-[#252B27]'
                  }`}
                >
                  Duration
                </button>
                <button
                  type="button"
                  onClick={() => setMode('endTime')}
                  className={`py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                    mode === 'endTime'
                      ? 'bg-[#4C1D95] text-white shadow-xs'
                      : 'text-[#252B27]/75 dark:text-slate-300 hover:text-[#252B27]'
                  }`}
                >
                  End Time
                </button>
              </div>

              {mode === 'duration' ? (
                <>
                  {/* 6 Preset Pills Row */}
                  <div className="grid grid-cols-6 gap-1.5">
                    {presetButtons.map((btn) => {
                      const active = selectedPreset === btn.value;
                      return (
                        <button
                          key={String(btn.value)}
                          type="button"
                          onClick={() => {
                            if (btn.value === 'custom') {
                              setSelectedPreset('custom');
                              customInputRef.current?.focus();
                            } else {
                              applyDurationMinutes(btn.value, btn.value);
                            }
                          }}
                          className={`py-2 px-1 text-[11px] sm:text-xs font-bold rounded-lg border transition-all ${
                            active
                              ? 'bg-[#4C1D95] border-[#4C1D95] text-white shadow-2xs'
                              : 'bg-[#F8F9FB] dark:bg-[#1E2420] border-[#E4E7EE] dark:border-[#2E3631] text-[#0E2338] dark:text-slate-200 hover:border-[#4C1D95]/50'
                          }`}
                        >
                          {btn.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Numeric Input + "minutes" label */}
                  <div className="flex items-center gap-3">
                    <div className="relative w-28">
                      <input
                        ref={customInputRef}
                        type="number"
                        min={1}
                        max={240}
                        value={customMinutes}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          if (!isNaN(val)) {
                            applyDurationMinutes(val, 'custom');
                          }
                        }}
                        aria-label="Duration in minutes"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F9FB] dark:bg-[#1E2420] border border-[#DCE1EA] dark:border-[#2E3631] text-lg font-bold text-[#0E2338] dark:text-white focus:outline-none focus:border-[#4C1D95]"
                      />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-[#252B27]/75 dark:text-slate-300">
                      minutes
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-3 py-2">
                  <input
                    type="time"
                    value={endTimeStr}
                    onChange={(e) => applyEndTime(e.target.value)}
                    aria-label="Target end time"
                    className="px-3.5 py-2.5 rounded-xl bg-[#F8F9FB] dark:bg-[#1E2420] border border-[#DCE1EA] dark:border-[#2E3631] text-base font-bold text-[#0E2338] dark:text-white focus:outline-none focus:border-[#4C1D95]"
                  />
                  <span className="text-xs text-[#252B27]/70 dark:text-slate-400">
                    Counts down to target time
                  </span>
                </div>
              )}

              {/* Primary Start Button in Deep Cosmic Purple */}
              <button
                type="button"
                onClick={isRunning ? handlePause : handleStart}
                className="w-full py-3.5 rounded-xl bg-[#4A148C] hover:bg-[#3B0F70] active:scale-[0.99] text-white font-bold text-sm sm:text-base shadow-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer"
              >
                {isRunning ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>Running...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Start</span>
                  </>
                )}
              </button>

              {/* Pause & Reset Secondary Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={isRunning ? handlePause : handleStart}
                  className="py-2.5 px-4 rounded-xl bg-[#F1F2F6] dark:bg-[#222824] hover:bg-[#E5E8EF] dark:hover:bg-[#2B332E] border border-[#E2E5ED] dark:border-[#2E3631] text-[#0E2338] dark:text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause</span>
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="py-2.5 px-4 rounded-xl bg-[#F1F2F6] dark:bg-[#222824] hover:bg-[#E5E8EF] dark:hover:bg-[#2B332E] border border-[#E2E5ED] dark:border-[#2E3631] text-[#0E2338] dark:text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Toggles Row: Sound Alert | Fullscreen | Show Time */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#ECEAE4] dark:border-[#28302B]">
                {/* Sound Alert Toggle */}
                <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
                  <Bell className="w-3.5 h-3.5 text-[#4A148C] dark:text-purple-400" />
                  <span className="text-[11px] sm:text-xs font-medium text-[#252B27] dark:text-slate-300">
                    Sound Alert
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={soundAlert}
                    onClick={() => setSoundAlert((v) => !v)}
                    className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
                      soundAlert ? 'bg-[#4C1D95]' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-white shadow-2xs transition-transform ${
                        soundAlert ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </label>

                {/* Fullscreen Action */}
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-medium text-[#252B27]/80 dark:text-slate-300 hover:text-[#4C1D95] dark:hover:text-purple-400 transition-colors cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Fullscreen</span>
                </button>

                {/* Show Time Toggle */}
                <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
                  <Eye className="w-3.5 h-3.5 text-[#4A148C] dark:text-purple-400" />
                  <span className="text-[11px] sm:text-xs font-medium text-[#252B27] dark:text-slate-300">
                    Show Time
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={showTime}
                    onClick={() => setShowTime((v) => !v)}
                    className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
                      showTime ? 'bg-[#4C1D95]' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-white shadow-2xs transition-transform ${
                        showTime ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </label>
              </div>

              {/* Animation Speed Slider + Low-Motion Toggle */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0E2338] dark:text-white">
                    Animation Speed
                  </span>
                  <button
                    type="button"
                    onClick={() => setReducedMotion((v) => !v)}
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-md border transition-colors ${
                      reducedMotion
                        ? 'bg-[#F3EEFF] border-[#8B5CF6] text-[#4C1D95] dark:bg-[#2A1B4E] dark:text-purple-200'
                        : 'border-transparent text-[#252B27]/60 dark:text-slate-400 hover:text-[#252B27]'
                    }`}
                  >
                    {reducedMotion ? 'Low Motion: On' : 'Low Motion'}
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={10}
                    max={100}
                    value={animationSpeed}
                    onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                    aria-label="Animation Speed"
                    className="w-full h-1.5 bg-[#E2E4EC] dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#5B21B6]"
                  />
                  <span className="text-xs font-medium text-[#252B27]/75 dark:text-slate-300 w-14 text-right shrink-0">
                    {speedLabel}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* RIGHT COLUMN: GALAXY THEME & BACKGROUND STYLE SELECTOR (lg:col-span-3) */}
          {!isFullscreen && (
            <div className="lg:col-span-3 flex flex-col justify-between rounded-2xl bg-[#FBFBFD] dark:bg-[#1C221F] border border-[#E8E6DF] dark:border-[#2C3530] p-4 space-y-4">
              {/* Galaxy Theme 2x2 Grid */}
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-[#0E2338] dark:text-white mb-2.5">
                  Galaxy Theme
                </h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {(
                    [
                      { id: 'spiral-galaxy', label: 'Spiral Galaxy' },
                      { id: 'nebula-cloud', label: 'Nebula Cloud' },
                      { id: 'starfield', label: 'Starfield' },
                      { id: 'andromeda-style', label: 'Andromeda Style' },
                    ] as Array<{ id: GalaxyThemeId; label: string }>
                  ).map((item) => {
                    const active = galaxyTheme === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setGalaxyTheme(item.id)}
                        className={`group rounded-xl overflow-hidden border text-center transition-all cursor-pointer p-1 ${
                          active
                            ? 'border-[#6D28D9] ring-2 ring-[#6D28D9]/25 bg-[#F5F3FF] dark:bg-[#23193E]'
                            : 'border-[#E2E4EC] dark:border-[#2D3530] bg-white dark:bg-[#222824] hover:border-[#6D28D9]/50'
                        }`}
                      >
                        <div className="w-full aspect-[1.45/1] rounded-lg overflow-hidden relative bg-[#070B1E]">
                          {item.id === 'spiral-galaxy' && (
                            <svg viewBox="0 0 120 82" className="w-full h-full">
                              <rect width="120" height="82" fill="#070B1E" />
                              <ellipse cx="60" cy="41" rx="44" ry="22" transform="rotate(-24 60 41)" fill="#4338CA" opacity="0.55" />
                              <ellipse cx="60" cy="41" rx="30" ry="14" transform="rotate(-24 60 41)" fill="#A855F7" opacity="0.7" />
                              <ellipse cx="60" cy="41" rx="14" ry="8" transform="rotate(-24 60 41)" fill="#FBBF24" />
                              <circle cx="60" cy="41" r="5" fill="#FFFBEB" />
                              <circle cx="24" cy="18" r="1.2" fill="#FFF" />
                              <circle cx="96" cy="22" r="1" fill="#FFF" />
                              <circle cx="88" cy="64" r="1.2" fill="#FFF" />
                            </svg>
                          )}
                          {item.id === 'nebula-cloud' && (
                            <svg viewBox="0 0 120 82" className="w-full h-full">
                              <rect width="120" height="82" fill="#120524" />
                              <circle cx="44" cy="42" r="32" fill="#9333EA" opacity="0.55" />
                              <circle cx="76" cy="36" r="28" fill="#DB2777" opacity="0.5" />
                              <circle cx="60" cy="40" r="16" fill="#F0ABFC" opacity="0.75" />
                              <circle cx="58" cy="39" r="5" fill="#FFFFFF" />
                              <circle cx="28" cy="22" r="1.4" fill="#FFF" />
                              <circle cx="92" cy="58" r="1.3" fill="#FFF" />
                            </svg>
                          )}
                          {item.id === 'starfield' && (
                            <svg viewBox="0 0 120 82" className="w-full h-full">
                              <rect width="120" height="82" fill="#050B1C" />
                              <path d="M 0 62 Q 60 46 120 64 L 120 82 L 0 82 Z" fill="#312E81" opacity="0.7" />
                              <circle cx="30" cy="24" r="1.6" fill="#FFF" />
                              <circle cx="54" cy="18" r="2.2" fill="#E0F2FE" />
                              <circle cx="84" cy="28" r="1.8" fill="#FFF" />
                              <circle cx="66" cy="44" r="2.4" fill="#FDE68A" />
                              <circle cx="40" cy="48" r="1.4" fill="#DDD6FE" />
                              <line x1="30" y1="24" x2="54" y2="18" stroke="#93C5FD" strokeWidth="0.7" opacity="0.6" />
                              <line x1="54" y1="18" x2="84" y2="28" stroke="#93C5FD" strokeWidth="0.7" opacity="0.6" />
                            </svg>
                          )}
                          {item.id === 'andromeda-style' && (
                            <svg viewBox="0 0 120 82" className="w-full h-full">
                              <rect width="120" height="82" fill="#120A07" />
                              <ellipse cx="60" cy="41" rx="46" ry="16" transform="rotate(-28 60 41)" fill="#9A3412" opacity="0.65" />
                              <ellipse cx="60" cy="41" rx="30" ry="10" transform="rotate(-28 60 41)" fill="#F59E0B" opacity="0.8" />
                              <ellipse cx="60" cy="41" rx="12" ry="6" transform="rotate(-28 60 41)" fill="#FEF3C7" />
                              <circle cx="24" cy="24" r="1.3" fill="#FDE68A" />
                              <circle cx="94" cy="56" r="1.3" fill="#FDE68A" />
                            </svg>
                          )}
                        </div>
                        <div className="text-[11px] font-semibold text-[#0E2338] dark:text-slate-200 mt-1.5 mb-0.5 truncate">
                          {item.label}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Background Style 4 Circular Cosmic Swatches */}
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-[#0E2338] dark:text-white mb-2.5">
                  Background Style
                </h3>
                <div className="flex items-center justify-between gap-2 px-1">
                  {(
                    [
                      {
                        id: 'deep-space',
                        label: 'Deep Sapphire',
                        colors: ['#060B22', '#1E3A8A', '#60A5FA'],
                      },
                      {
                        id: 'violet-nebula',
                        label: 'Cosmic Violet',
                        colors: ['#16062B', '#6B21A8', '#E879F9'],
                      },
                      {
                        id: 'cosmic-teal',
                        label: 'Aurora Teal',
                        colors: ['#041322', '#0F4C5C', '#38BDF8'],
                      },
                      {
                        id: 'amber-cosmos',
                        label: 'Supernova Amber',
                        colors: ['#1A060A', '#7C2D12', '#F97316'],
                      },
                    ] as Array<{ id: BackgroundStyleId; label: string; colors: string[] }>
                  ).map((sw) => {
                    const active = bgStyle === sw.id;
                    return (
                      <button
                        key={sw.id}
                        type="button"
                        title={sw.label}
                        aria-label={sw.label}
                        onClick={() => setBgStyle(sw.id)}
                        className={`w-11 h-11 rounded-full p-0.5 transition-all cursor-pointer ${
                          active
                            ? 'ring-2 ring-[#6D28D9] scale-105'
                            : 'ring-1 ring-slate-300 dark:ring-slate-700 opacity-85 hover:opacity-100'
                        }`}
                      >
                        <div
                          className="w-full h-full rounded-full relative overflow-hidden"
                          style={{
                            background: `radial-gradient(circle at 45% 45%, ${sw.colors[2]} 0%, ${sw.colors[1]} 45%, ${sw.colors[0]} 100%)`,
                          }}
                        >
                          <span className="absolute top-2 left-2.5 w-1 h-1 rounded-full bg-white/90" />
                          <span className="absolute bottom-2.5 right-2.5 w-1 h-1 rounded-full bg-white/80" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Save as Default Button */}
              <button
                type="button"
                onClick={handleSaveDefault}
                className="w-full py-2.5 px-3 rounded-xl border border-[#2E7D67] text-[#1E6B56] dark:text-emerald-300 bg-white dark:bg-[#1E2723] hover:bg-[#F1F9F6] text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {savedToast ? (
                  <>
                    <Check className="w-4 h-4 text-[#1E6B56]" />
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
          )}
        </div>
      </div>

      {/* QUICK PRESETS ROW */}
      <div>
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0E2338] dark:text-white">
          Quick Presets
        </h2>
        <p className="text-xs sm:text-sm text-[#252B27]/75 dark:text-slate-400 mt-0.5 mb-4">
          Start with a common time or set a custom duration.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickPresetsList.map((qp) => {
            const isActive = mode === 'duration' && selectedPreset === qp.mins;
            return (
              <button
                key={qp.mins}
                type="button"
                onClick={() => {
                  setMode('duration');
                  applyDurationMinutes(qp.mins, qp.mins);
                }}
                className={`rounded-2xl p-3.5 text-left border transition-all flex items-center gap-3 cursor-pointer ${
                  isActive || qp.highlighted
                    ? 'bg-[#F5F3FF] dark:bg-[#221A3A] border-[#7C3AED] shadow-2xs'
                    : 'bg-white dark:bg-[#1A201C] border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#7C3AED]/60'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] dark:bg-[#2E2152] text-[#6D28D9] dark:text-purple-300 flex items-center justify-center shrink-0">
                  <SpiralGalaxyIcon className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-xs sm:text-sm text-[#0E2338] dark:text-white truncate">
                    {qp.title}
                  </div>
                  <div
                    className={`text-[11px] truncate ${
                      isActive || qp.highlighted
                        ? 'text-[#5B21B6] dark:text-purple-300 font-medium'
                        : 'text-[#252B27]/65 dark:text-slate-400'
                    }`}
                  >
                    {qp.sub}
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
              setSelectedPreset('custom');
              customInputRef.current?.focus();
            }}
            className={`rounded-2xl p-3.5 text-left border transition-all flex items-center gap-3 cursor-pointer ${
              selectedPreset === 'custom'
                ? 'bg-[#F5F3FF] dark:bg-[#221A3A] border-[#7C3AED] shadow-2xs'
                : 'bg-white dark:bg-[#1A201C] border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#7C3AED]/60'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] dark:bg-[#2E2152] text-[#6D28D9] dark:text-purple-300 flex items-center justify-center shrink-0">
              <Settings className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-xs sm:text-sm text-[#0E2338] dark:text-white truncate">
                Custom
              </div>
              <div className="text-[11px] text-[#252B27]/65 dark:text-slate-400 truncate">
                Set your own time
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* POPULAR USES ROW */}
      <div>
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0E2338] dark:text-white">
          Popular Uses
        </h2>
        <p className="text-xs sm:text-sm text-[#252B27]/75 dark:text-slate-400 mt-0.5 mb-4">
          A galaxy timer is great for many everyday activities.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {popularUses.map((useItem) => (
            <div
              key={useItem.title}
              className="rounded-2xl bg-white dark:bg-[#1A201C] border border-[#E4E1D9] dark:border-[#2D352F] p-3.5 flex items-start gap-3 shadow-2xs"
            >
              <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] dark:bg-[#2E2152] flex items-center justify-center shrink-0 mt-0.5">
                {useItem.icon}
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-xs sm:text-sm text-[#0E2338] dark:text-white leading-snug">
                  {useItem.title}
                </h3>
                <p className="text-[11px] text-[#252B27]/70 dark:text-slate-400 leading-relaxed mt-0.5">
                  {useItem.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

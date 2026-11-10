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
  Settings,
  Timer,
  BookOpen,
  Laptop,
  Users,
  Dumbbell,
  Gamepad2,
  Coffee,
} from 'lucide-react';

export type FlipDisplayThemeId = 'classic-black' | 'retro-cream' | 'industrial' | 'modern-dark';
export type FlipDigitStyleId = 'classic' | 'rounded' | 'light-flap';
type TimerMode = 'duration' | 'endTime';

interface FlipThemeConfig {
  id: FlipDisplayThemeId;
  name: string;
  stageBg: string;
  deskSurface: string;
  housingOuter: string;
  housingBorder: string;
  housingInner: string;
  flapTopBg: string;
  flapBottomBg: string;
  flapBorder: string;
  digitColor: string;
  digitShadow: string;
  plaqueBg: string;
  plaqueBorder: string;
  plaqueText: string;
  colonColor: string;
  ambientGlow: string;
  isIndustrial?: boolean;
  isModern?: boolean;
}

const FLIP_THEMES: Record<FlipDisplayThemeId, FlipThemeConfig> = {
  'classic-black': {
    id: 'classic-black',
    name: 'Classic Black',
    stageBg: 'radial-gradient(circle at 50% 35%, #4A2C18 0%, #241309 58%, #120904 100%)',
    deskSurface: 'linear-gradient(180deg, #3A1F0D 0%, #261306 45%, #160A03 100%)',
    housingOuter: 'linear-gradient(180deg, #2B2927 0%, #1A1817 50%, #11100F 100%)',
    housingBorder: '#47423E',
    housingInner: '#0B0A09',
    flapTopBg: 'linear-gradient(180deg, #2A2927 0%, #1D1C1A 100%)',
    flapBottomBg: 'linear-gradient(180deg, #171614 0%, #242220 100%)',
    flapBorder: '#3E3A36',
    digitColor: '#F7F4EE',
    digitShadow: '0 2px 4px rgba(0, 0, 0, 0.65)',
    plaqueBg: 'linear-gradient(180deg, #2C2217 0%, #1B140D 100%)',
    plaqueBorder: '#8C6D3F',
    plaqueText: '#E7C888',
    colonColor: '#D6D1C7',
    ambientGlow: 'rgba(255, 168, 76, 0.28)',
  },
  'retro-cream': {
    id: 'retro-cream',
    name: 'Retro Cream',
    stageBg: 'radial-gradient(circle at 50% 35%, #5C3A21 0%, #2F1B0E 60%, #180D06 100%)',
    deskSurface: 'linear-gradient(180deg, #4A2A14 0%, #311A0B 50%, #1C0E05 100%)',
    housingOuter: 'linear-gradient(180deg, #6E4726 0%, #4E3016 55%, #38210E 100%)',
    housingBorder: '#9A6B3E',
    housingInner: '#241509',
    flapTopBg: 'linear-gradient(180deg, #F6EFE2 0%, #E8DEC9 100%)',
    flapBottomBg: 'linear-gradient(180deg, #DFD3BC 0%, #EFE6D5 100%)',
    flapBorder: '#C7B79C',
    digitColor: '#231D18',
    digitShadow: '0 1px 2px rgba(255, 255, 255, 0.5)',
    plaqueBg: 'linear-gradient(180deg, #3A2412 0%, #25160A 100%)',
    plaqueBorder: '#B5894C',
    plaqueText: '#F3D99B',
    colonColor: '#F3EAD8',
    ambientGlow: 'rgba(255, 190, 105, 0.32)',
  },
  industrial: {
    id: 'industrial',
    name: 'Industrial',
    stageBg: 'radial-gradient(circle at 50% 35%, #373B40 0%, #1C1F24 62%, #0F1114 100%)',
    deskSurface: 'linear-gradient(180deg, #2B2E33 0%, #1B1D20 50%, #111315 100%)',
    housingOuter: 'linear-gradient(180deg, #4A4E54 0%, #2E3237 50%, #1F2226 100%)',
    housingBorder: '#6C727A',
    housingInner: '#101214',
    flapTopBg: 'linear-gradient(180deg, #282B30 0%, #1D2024 100%)',
    flapBottomBg: 'linear-gradient(180deg, #181B1F 0%, #24272C 100%)',
    flapBorder: '#454A52',
    digitColor: '#F1F5F9',
    digitShadow: '0 2px 5px rgba(0, 0, 0, 0.75)',
    plaqueBg: 'linear-gradient(180deg, #272A2E 0%, #181A1D 100%)',
    plaqueBorder: '#646B73',
    plaqueText: '#CBD5E1',
    colonColor: '#94A3B8',
    ambientGlow: 'rgba(148, 163, 184, 0.2)',
    isIndustrial: true,
  },
  'modern-dark': {
    id: 'modern-dark',
    name: 'Modern Dark',
    stageBg: 'radial-gradient(circle at 50% 35%, #0F293A 0%, #07131D 62%, #03090E 100%)',
    deskSurface: 'linear-gradient(180deg, #0D1F2D 0%, #07121A 50%, #040A0F 100%)',
    housingOuter: 'linear-gradient(180deg, #1E252D 0%, #12171D 55%, #0B0E12 100%)',
    housingBorder: '#2E3D4B',
    housingInner: '#06080B',
    flapTopBg: 'linear-gradient(180deg, #161D24 0%, #0F141A 100%)',
    flapBottomBg: 'linear-gradient(180deg, #0D1217 0%, #141B22 100%)',
    flapBorder: '#243240',
    digitColor: '#22D3EE',
    digitShadow: '0 0 14px rgba(34, 211, 238, 0.55)',
    plaqueBg: 'linear-gradient(180deg, #0F1922 0%, #091017 100%)',
    plaqueBorder: '#1E4E68',
    plaqueText: '#38BDF8',
    colonColor: '#22D3EE',
    ambientGlow: 'rgba(34, 211, 238, 0.25)',
    isModern: true,
  },
};

interface SplitFlapDigitProps {
  digit: string;
  themeConfig: FlipThemeConfig;
  digitStyle: FlipDigitStyleId;
  size?: 'normal' | 'compact' | 'fullscreen';
}

interface FlipRenderState {
  current: string;
  previous: string;
  flipping: boolean;
  seq: number;
}

function SplitFlapDigit({
  digit,
  themeConfig,
  digitStyle,
  size = 'normal',
}: SplitFlapDigitProps) {
  const [renderState, setRenderState] = useState<FlipRenderState>({
    current: '0',
    previous: '0',
    flipping: false,
    seq: 0,
  });

  const flapTopRef = useRef<HTMLDivElement | null>(null);
  const flapBottomRef = useRef<HTMLDivElement | null>(null);

  // Synchronously detect digit prop changes during render so there is never a 1-frame flash
  if (digit !== renderState.current) {
    setRenderState({
      current: digit,
      previous: renderState.current,
      flipping: true,
      seq: renderState.seq + 1,
    });
  }

  // Trigger hardware-accelerated 3D Web Animations API flip whenever seq increments
  useEffect(() => {
    if (renderState.seq === 0) return;

    const topEl = flapTopRef.current;
    const bottomEl = flapBottomRef.current;

    let topAnim: Animation | null = null;
    let bottomAnim: Animation | null = null;

    if (topEl && typeof topEl.animate === 'function') {
      topAnim = topEl.animate(
        [
          { transform: 'rotateX(0deg)', filter: 'brightness(1)' },
          { transform: 'rotateX(-90deg)', filter: 'brightness(0.45)' },
        ],
        {
          duration: 210,
          easing: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
          fill: 'forwards',
        }
      );
    }

    if (bottomEl && typeof bottomEl.animate === 'function') {
      bottomAnim = bottomEl.animate(
        [
          { transform: 'rotateX(90deg)', filter: 'brightness(0.45)', offset: 0 },
          { transform: 'rotateX(90deg)', filter: 'brightness(0.45)', offset: 0.48 },
          { transform: 'rotateX(-5deg)', filter: 'brightness(1.06)', offset: 0.88 },
          { transform: 'rotateX(0deg)', filter: 'brightness(1)', offset: 1 },
        ],
        {
          duration: 430,
          easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
          fill: 'forwards',
        }
      );
    }

    const doneTimer = setTimeout(() => {
      setRenderState((prev) =>
        prev.seq === renderState.seq
          ? { ...prev, previous: prev.current, flipping: false }
          : prev
      );
    }, 440);

    return () => {
      clearTimeout(doneTimer);
      topAnim?.cancel();
      bottomAnim?.cancel();
    };
  }, [renderState.seq]);

  // Resolve overrides if Digit Style is 'light-flap'
  const isLightOverride = digitStyle === 'light-flap' && themeConfig.id !== 'retro-cream';
  const topBackground = isLightOverride
    ? 'linear-gradient(180deg, #F5F2EB 0%, #E6E1D6 100%)'
    : themeConfig.flapTopBg;
  const bottomBackground = isLightOverride
    ? 'linear-gradient(180deg, #DDD7CA 0%, #EFECE4 100%)'
    : themeConfig.flapBottomBg;
  const cardBorder = isLightOverride ? '#C5BEB0' : themeConfig.flapBorder;
  const numeralColor = isLightOverride ? '#1E1B18' : themeConfig.digitColor;
  const numeralShadow = isLightOverride
    ? '0 1px 1px rgba(255,255,255,0.6)'
    : themeConfig.digitShadow;

  // Typography style per digitStyle
  const fontClass =
    digitStyle === 'rounded'
      ? 'font-sans font-extrabold tracking-normal tabular-nums'
      : digitStyle === 'light-flap'
      ? 'font-sans font-black tracking-tight tabular-nums'
      : 'font-mono font-bold tracking-tight tabular-nums';

  // Explicit pixel-backed responsive dimensions so the card never collapses
  const sizeClasses =
    size === 'fullscreen'
      ? 'w-[92px] h-[136px] sm:w-[132px] sm:h-[192px] md:w-[164px] md:h-[236px] rounded-2xl'
      : size === 'compact'
      ? 'w-[42px] h-[64px] sm:w-[50px] sm:h-[76px] rounded-lg'
      : 'w-[58px] h-[88px] sm:w-[68px] sm:h-[104px] md:w-[74px] md:h-[112px] rounded-xl';

  const textClasses =
    size === 'fullscreen'
      ? 'text-[80px] sm:text-[116px] md:text-[144px]'
      : size === 'compact'
      ? 'text-[36px] sm:text-[44px]'
      : 'text-[52px] sm:text-[62px] md:text-[68px]';

  const staticTopDigit = renderState.current;
  const staticBottomDigit = renderState.flipping
    ? renderState.previous
    : renderState.current;

  return (
    <div
      className={`relative select-none shrink-0 ${sizeClasses} shadow-[0_10px_20px_rgba(0,0,0,0.68),inset_0_1px_0_rgba(255,255,255,0.14)]`}
      style={{
        perspective: '750px',
        border: `1.5px solid ${cardBorder}`,
        background: '#090909',
      }}
    >
      {/* Side Mechanical Hinge Pins */}
      <span
        aria-hidden="true"
        className="absolute -left-[4px] top-1/2 -translate-y-1/2 w-[5px] h-3.5 rounded-xs bg-gradient-to-b from-zinc-300 via-zinc-500 to-zinc-800 z-30 shadow-xs"
      />
      <span
        aria-hidden="true"
        className="absolute -right-[4px] top-1/2 -translate-y-1/2 w-[5px] h-3.5 rounded-xs bg-gradient-to-b from-zinc-300 via-zinc-500 to-zinc-800 z-30 shadow-xs"
      />

      {/* 1. STATIC TOP HALF (reveals currentDigit underneath as top flap folds down) */}
      <div
        className="absolute inset-x-0 top-0 h-1/2 overflow-hidden rounded-t-[inherit]"
        style={{ background: topBackground }}
      >
        <div
          className={`
            absolute inset-x-0 top-0 h-[200%] flex items-center justify-center leading-none
            ${fontClass} ${textClasses}
          `}
          style={{
            color: numeralColor,
            textShadow: numeralShadow,
          }}
        >
          {staticTopDigit}
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-white/10 to-black/10 pointer-events-none"
        />
      </div>

      {/* 2. STATIC BOTTOM HALF (shows previousDigit until bottom flap lands) */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/2 overflow-hidden rounded-b-[inherit]"
        style={{ background: bottomBackground }}
      >
        <div
          className={`
            absolute inset-x-0 bottom-0 h-[200%] flex items-center justify-center leading-none
            ${fontClass} ${textClasses}
          `}
          style={{
            color: numeralColor,
            textShadow: numeralShadow,
          }}
        >
          {staticBottomDigit}
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/20 pointer-events-none"
        />
      </div>

      {/* 3. ANIMATED TOP FLAP (pivots along bottom edge 0deg -> -90deg showing previousDigit) */}
      <div
        ref={flapTopRef}
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1/2 overflow-hidden rounded-t-[inherit] z-20"
        style={{
          background: topBackground,
          transformOrigin: '50% 100%',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          visibility: renderState.flipping ? 'visible' : 'hidden',
          pointerEvents: 'none',
        }}
      >
        <div
          className={`
            absolute inset-x-0 top-0 h-[200%] flex items-center justify-center leading-none
            ${fontClass} ${textClasses}
          `}
          style={{
            color: numeralColor,
            textShadow: numeralShadow,
          }}
        >
          {renderState.previous}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-black/15 pointer-events-none" />
      </div>

      {/* 4. ANIMATED BOTTOM FLAP (pivots along top edge 90deg -> 0deg showing currentDigit) */}
      <div
        ref={flapBottomRef}
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1/2 overflow-hidden rounded-b-[inherit] z-20"
        style={{
          background: bottomBackground,
          transformOrigin: '50% 0%',
          transform: 'rotateX(90deg)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          visibility: renderState.flipping ? 'visible' : 'hidden',
          pointerEvents: 'none',
        }}
      >
        <div
          className={`
            absolute inset-x-0 bottom-0 h-[200%] flex items-center justify-center leading-none
            ${fontClass} ${textClasses}
          `}
          style={{
            color: numeralColor,
            textShadow: numeralShadow,
          }}
        >
          {renderState.current}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/15 pointer-events-none" />
      </div>

      {/* HORIZONTAL SPLIT-FLAP PIVOT SEAM */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2.5px] bg-black/95 z-30 shadow-[0_1px_1px_rgba(255,255,255,0.18)]"
      />
    </div>
  );
}

export default function FlipTimerComponent() {
  // Mode & Time state
  const [mode, setMode] = useState<TimerMode>('duration');
  const [durationMinutes, setDurationMinutes] = useState<number>(25);
  const [customSeconds, setCustomSeconds] = useState<number>(0);
  const [activePreset, setActivePreset] = useState<number | 'custom'>(25);
  const [endTimeStr, setEndTimeStr] = useState<string>(() => {
    const d = new Date(Date.now() + 25 * 60 * 1000);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  });

  const [totalMs, setTotalMs] = useState<number>(25 * 60 * 1000);
  const [remainingMs, setRemainingMs] = useState<number>(25 * 60 * 1000);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Display customization state
  const [displayTheme, setDisplayTheme] = useState<FlipDisplayThemeId>('classic-black');
  const [digitStyle, setDigitStyle] = useState<FlipDigitStyleId>('classic');
  const [soundAlert, setSoundAlert] = useState<boolean>(true);
  const [showTime, setShowTime] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const targetTimestampRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastDisplayedSecondRef = useRef<number>(25 * 60);

  const themeConfig = FLIP_THEMES[displayTheme];

  // Subtle mechanical split-flap click sound on each second transition
  const playMechanicalFlipClick = useCallback(() => {
    if (!soundAlert) return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(52, ctx.currentTime + 0.03);

      gain.gain.setValueAtTime(0.045, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.032);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.034);
    } catch {
      // Ignore audio errors when autoplay is blocked
    }
  }, [soundAlert]);

  // Classic mechanical desk bell chime on completion
  const playCompletionChime = useCallback(() => {
    if (!soundAlert) return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const notes = [587.33, 880, 1174.66]; // D5, A5, D6 resonant chime
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        const startTime = ctx.currentTime + idx * 0.16;
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.exponentialRampToValueAtTime(0.18, startTime + 0.025);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.95);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 1.0);
      });
    } catch {
      // Ignore audio errors
    }
  }, [soundAlert]);

  // High-precision countdown loop
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      if (!targetTimestampRef.current) return;
      const now = Date.now();
      const diff = Math.max(0, targetTimestampRef.current - now);
      setRemainingMs(diff);

      const displayedSecs = diff <= 0 ? 0 : Math.floor(diff / 1000);
      if (displayedSecs !== lastDisplayedSecondRef.current) {
        lastDisplayedSecondRef.current = displayedSecs;
        if (displayedSecs > 0) {
          playMechanicalFlipClick();
        }
      }

      if (diff <= 0) {
        setIsRunning(false);
        setIsCompleted(true);
        targetTimestampRef.current = null;
        playCompletionChime();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isRunning, playMechanicalFlipClick, playCompletionChime]);

  // Apply preset or custom minutes
  const applyDuration = useCallback(
    (mins: number, secs: number, presetTag: number | 'custom') => {
      const safeMins = Math.max(0, Math.min(999, mins));
      const safeSecs = Math.max(0, Math.min(59, secs));
      const ms = Math.max(1000, (safeMins * 60 + safeSecs) * 1000);
      setMode('duration');
      setDurationMinutes(safeMins);
      setCustomSeconds(safeSecs);
      setActivePreset(presetTag);
      setIsRunning(false);
      setIsCompleted(false);
      targetTimestampRef.current = null;
      setTotalMs(ms);
      setRemainingMs(ms);
      lastDisplayedSecondRef.current = Math.floor(ms / 1000);
    },
    []
  );

  // Apply target clock end time
  const applyEndTime = useCallback((timeValue: string) => {
    setEndTimeStr(timeValue);
    const parts = timeValue.split(':');
    if (parts.length !== 2) return;
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return;

    const now = new Date();
    const target = new Date();
    target.setHours(hours, minutes, 0, 0);
    if (target.getTime() <= now.getTime()) {
      target.setDate(target.getDate() + 1);
    }
    const diffMs = Math.max(1000, target.getTime() - now.getTime());
    setIsRunning(false);
    setIsCompleted(false);
    targetTimestampRef.current = null;
    setTotalMs(diffMs);
    setRemainingMs(diffMs);
    lastDisplayedSecondRef.current = Math.floor(diffMs / 1000);
  }, []);

  const handleStart = useCallback(() => {
    if (isRunning) return;
    let startFromMs = remainingMs;
    if (startFromMs <= 0 || isCompleted) {
      startFromMs = totalMs > 0 ? totalMs : 25 * 60 * 1000;
      setIsCompleted(false);
    }
    // Subtract 50ms when starting from a whole second so the split-flap immediately flips on Start click
    const initialTickMs =
      startFromMs % 1000 === 0 ? Math.max(0, startFromMs - 50) : startFromMs;
    targetTimestampRef.current = Date.now() + initialTickMs;
    setRemainingMs(initialTickMs);
    lastDisplayedSecondRef.current = Math.floor(initialTickMs / 1000);
    setIsRunning(true);
    playMechanicalFlipClick();
  }, [isRunning, remainingMs, isCompleted, totalMs, playMechanicalFlipClick]);

  const handlePause = useCallback(() => {
    if (!isRunning) return;
    if (targetTimestampRef.current) {
      const left = Math.max(0, targetTimestampRef.current - Date.now());
      setRemainingMs(left);
    }
    targetTimestampRef.current = null;
    setIsRunning(false);
  }, [isRunning]);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setIsCompleted(false);
    targetTimestampRef.current = null;
    if (mode === 'duration') {
      const ms = Math.max(1000, (durationMinutes * 60 + customSeconds) * 1000);
      setTotalMs(ms);
      setRemainingMs(ms);
      lastDisplayedSecondRef.current = Math.floor(ms / 1000);
    } else {
      applyEndTime(endTimeStr);
    }
  }, [mode, durationMinutes, customSeconds, endTimeStr, applyEndTime]);

  const toggleFullscreen = useCallback(async () => {
    const nextState = !isFullscreen;
    setIsFullscreen(nextState);

    if (nextState) {
      try {
        if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
      } catch {
        // Keep CSS .timer-fullscreen-stage active
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
      try {
        const orientation = window.screen?.orientation as unknown as {
          unlock?: () => void;
        };
        orientation?.unlock?.();
      } catch {
        // ignore
      }
      try {
        if (document.fullscreenElement && document.exitFullscreen) {
          await document.exitFullscreen();
        }
      } catch {
        // ignore
      }
    }
  }, [isFullscreen]);

  useEffect(() => {
    const onFsChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // Compute displayed hours, minutes, seconds
  // While running, use Math.floor so 25:00 immediately flips to 24:59 on Start and reaches 00:00 cleanly
  const totalSecondsLeft =
    remainingMs <= 0
      ? 0
      : isRunning
      ? Math.floor(remainingMs / 1000)
      : Math.ceil(remainingMs / 1000);

  const hours = Math.floor(totalSecondsLeft / 3600);
  const minutes = Math.floor((totalSecondsLeft % 3600) / 60);
  const seconds = totalSecondsLeft % 60;

  const showHours = hours > 0;
  const h1 = String(Math.floor(hours / 10));
  const h2 = String(hours % 10);
  const m1 = String(Math.floor(minutes / 10));
  const m2 = String(minutes % 10);
  const s1 = String(Math.floor(seconds / 10));
  const s2 = String(seconds % 10);

  const progressRatio =
    totalMs > 0 ? Math.min(1, Math.max(0, (totalMs - remainingMs) / totalMs)) : 0;

  return (
    <div className="space-y-8">
      {/* MAIN 3-COLUMN INTERACTIVE WORKSPACE CARD */}
      <div className="rounded-3xl bg-white/95 dark:bg-[#181514] border border-[#E6DFD5] dark:border-[#2E2725] shadow-[0_14px_40px_rgba(36,20,12,0.07)] p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* LEFT COLUMN (lg:col-span-5): Realistic 3D Mechanical Split-Flap Stage */}
          <div className="lg:col-span-5 flex flex-col">
            <div
              ref={stageRef}
              className={`relative w-full flex-1 min-h-[340px] sm:min-h-[380px] rounded-2xl overflow-hidden flex flex-col items-center justify-center p-3 sm:p-5 select-none shadow-inner transition-colors duration-500 ${
                isFullscreen ? 'timer-fullscreen-stage p-6 sm:p-10' : ''
              }`}
              style={{
                background: themeConfig.stageBg,
              }}
            >
              {/* Warm Ambient Bokeh Lights in Background */}
              <div
                aria-hidden="true"
                className="absolute -top-12 -left-10 w-44 h-44 rounded-full blur-2xl pointer-events-none"
                style={{ background: themeConfig.ambientGlow }}
              />
              <div
                aria-hidden="true"
                className="absolute -top-8 -right-8 w-40 h-40 rounded-full blur-2xl pointer-events-none"
                style={{ background: themeConfig.ambientGlow }}
              />

              {/* Wooden / Industrial Desk Surface at Bottom */}
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-24 pointer-events-none border-t border-white/10"
                style={{
                  background: themeConfig.deskSurface,
                  boxShadow: 'inset 0 8px 20px rgba(0,0,0,0.55)',
                }}
              />

              {/* Small Warm Desk Filament Bulbs Left & Right */}
              <div
                aria-hidden="true"
                className="absolute bottom-7 left-4 sm:left-6 flex flex-col items-center pointer-events-none"
              >
                <div
                  className="w-5 h-7 rounded-t-full border border-amber-200/50 flex items-center justify-center shadow-[0_0_18px_rgba(255,180,70,0.85)]"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(255,230,150,0.95) 0%, rgba(255,150,40,0.45) 65%, transparent 100%)',
                  }}
                >
                  <div className="w-1.5 h-3 border-t-2 border-x border-amber-100 rounded-t-full" />
                </div>
                <div className="w-7 h-2.5 rounded-xs bg-gradient-to-b from-amber-700 to-stone-900 border border-amber-500/40" />
              </div>

              <div
                aria-hidden="true"
                className="absolute bottom-7 right-4 sm:right-6 flex flex-col items-center pointer-events-none"
              >
                <div
                  className="w-5 h-7 rounded-t-full border border-amber-200/50 flex items-center justify-center shadow-[0_0_18px_rgba(255,180,70,0.85)]"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(255,230,150,0.95) 0%, rgba(255,150,40,0.45) 65%, transparent 100%)',
                  }}
                >
                  <div className="w-1.5 h-3 border-t-2 border-x border-amber-100 rounded-t-full" />
                </div>
                <div className="w-7 h-2.5 rounded-xs bg-gradient-to-b from-amber-700 to-stone-900 border border-amber-500/40" />
              </div>

              {/* Fullscreen Exit Button when in Fullscreen */}
              {isFullscreen && (
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="absolute top-6 right-6 z-30 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-black/60 hover:bg-black/80 text-white text-xs font-semibold border border-white/15 backdrop-blur-xs cursor-pointer"
                >
                  <Minimize2 className="w-4 h-4" />
                  <span>Exit Fullscreen</span>
                </button>
              )}

              {/* 3D VINTAGE MECHANICAL SPLIT-FLAP CLOCK HOUSING */}
              <div className="relative z-10 flex flex-col items-center max-w-full">
                {/* Top Metal/Brass Snooze/Mode Button Accents on Housing */}
                <div className="flex items-center gap-8 mb-[-3px] z-10">
                  <div className="w-8 h-2 rounded-t-md bg-gradient-to-r from-stone-600 via-stone-400 to-stone-600 border-t border-x border-white/25" />
                  <div className="w-12 h-2.5 rounded-t-md bg-gradient-to-r from-amber-700 via-amber-400 to-amber-700 border-t border-x border-amber-200/40" />
                  <div className="w-8 h-2 rounded-t-md bg-gradient-to-r from-stone-600 via-stone-400 to-stone-600 border-t border-x border-white/25" />
                </div>

                {/* Outer Casing */}
                <div
                  className="relative rounded-3xl p-2.5 sm:p-3.5 md:p-4 shadow-[0_24px_48px_rgba(0,0,0,0.85),inset_0_2px_2px_rgba(255,255,255,0.2)] transition-all duration-300"
                  style={{
                    background: themeConfig.housingOuter,
                    border: `2px solid ${themeConfig.housingBorder}`,
                  }}
                >
                  {/* Optional Industrial Corner Rivets */}
                  {themeConfig.isIndustrial && (
                    <>
                      <span className="absolute top-2 left-2 w-2 h-2 rounded-full bg-slate-400 shadow-inner" />
                      <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-slate-400 shadow-inner" />
                      <span className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-slate-400 shadow-inner" />
                      <span className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-slate-400 shadow-inner" />
                    </>
                  )}

                  {/* Recessed Inner Mechanical Cavity */}
                  <div
                    className="rounded-2xl px-3 py-3.5 sm:px-4 sm:py-4 shadow-[inset_0_8px_18px_rgba(0,0,0,0.95)] border border-black/80 flex items-center justify-center gap-1.5 sm:gap-2"
                    style={{
                      background: themeConfig.housingInner,
                    }}
                  >
                    {showTime ? (
                      <>
                        {showHours && (
                          <>
                            <SplitFlapDigit
                              digit={h1}
                              themeConfig={themeConfig}
                              digitStyle={digitStyle}
                              size={isFullscreen ? 'fullscreen' : 'compact'}
                            />
                            <SplitFlapDigit
                              digit={h2}
                              themeConfig={themeConfig}
                              digitStyle={digitStyle}
                              size={isFullscreen ? 'fullscreen' : 'compact'}
                            />
                            <div className="flex flex-col items-center justify-center gap-2.5 px-0.5">
                              <span
                                className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full shadow-xs"
                                style={{ background: themeConfig.colonColor }}
                              />
                              <span
                                className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full shadow-xs"
                                style={{ background: themeConfig.colonColor }}
                              />
                            </div>
                          </>
                        )}

                        {/* Minutes Flip Cards */}
                        <SplitFlapDigit
                          digit={m1}
                          themeConfig={themeConfig}
                          digitStyle={digitStyle}
                          size={
                            isFullscreen ? 'fullscreen' : showHours ? 'compact' : 'normal'
                          }
                        />
                        <SplitFlapDigit
                          digit={m2}
                          themeConfig={themeConfig}
                          digitStyle={digitStyle}
                          size={
                            isFullscreen ? 'fullscreen' : showHours ? 'compact' : 'normal'
                          }
                        />

                        {/* Mechanical Colon Separator */}
                        <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 px-0.5 sm:px-1">
                          <span
                            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full shadow-md transition-opacity duration-300 ${
                              isRunning && seconds % 2 === 1 ? 'opacity-40' : 'opacity-100'
                            }`}
                            style={{ background: themeConfig.colonColor }}
                          />
                          <span
                            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full shadow-md transition-opacity duration-300 ${
                              isRunning && seconds % 2 === 1 ? 'opacity-40' : 'opacity-100'
                            }`}
                            style={{ background: themeConfig.colonColor }}
                          />
                        </div>

                        {/* Seconds Flip Cards */}
                        <SplitFlapDigit
                          digit={s1}
                          themeConfig={themeConfig}
                          digitStyle={digitStyle}
                          size={
                            isFullscreen ? 'fullscreen' : showHours ? 'compact' : 'normal'
                          }
                        />
                        <SplitFlapDigit
                          digit={s2}
                          themeConfig={themeConfig}
                          digitStyle={digitStyle}
                          size={
                            isFullscreen ? 'fullscreen' : showHours ? 'compact' : 'normal'
                          }
                        />
                      </>
                    ) : (
                      /* Minimal Non-Numeric Split-Flap Progress View when Show Time is OFF */
                      <div className="py-6 px-8 flex flex-col items-center justify-center text-center min-w-[240px] sm:min-w-[290px]">
                        <div
                          className="text-xs uppercase tracking-[0.22em] font-semibold mb-3"
                          style={{ color: themeConfig.plaqueText }}
                        >
                          {isCompleted
                            ? 'Completed'
                            : isRunning
                            ? 'Mechanical Countdown Active'
                            : 'Ready to Start'}
                        </div>
                        <div className="w-full h-4 rounded-full bg-black/70 border border-white/15 overflow-hidden p-0.5">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${Math.round((1 - progressRatio) * 100)}%`,
                              background:
                                displayTheme === 'modern-dark'
                                  ? '#22D3EE'
                                  : '#D97706',
                            }}
                          />
                        </div>
                        <div className="mt-2.5 text-[11px] text-white/60">
                          {Math.round((1 - progressRatio) * 100)}% time remaining
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Vintage Brass / Engraved Desk Nameplate ("COUNTDOWN TIMER") */}
                <div
                  className="mt-[-6px] z-20 px-5 py-1.5 sm:px-7 sm:py-2 rounded-lg shadow-[0_8px_16px_rgba(0,0,0,0.75)] flex flex-col items-center"
                  style={{
                    background: themeConfig.plaqueBg,
                    border: `1.5px solid ${themeConfig.plaqueBorder}`,
                  }}
                >
                  <span
                    className="font-serif text-[11px] sm:text-xs md:text-sm font-bold tracking-[0.18em] uppercase"
                    style={{ color: themeConfig.plaqueText }}
                  >
                    {isCompleted ? 'TIME IS UP!' : 'COUNTDOWN TIMER'}
                  </span>
                  {/* Subtle progress bar integrated along bottom edge of plaque */}
                  <div className="w-full h-1 rounded-full bg-black/50 mt-1 overflow-hidden">
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        width: `${Math.max(0, Math.min(100, (1 - progressRatio) * 100))}%`,
                        background: isCompleted
                          ? '#EF4444'
                          : displayTheme === 'modern-dark'
                          ? '#22D3EE'
                          : '#E7C888',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CENTER COLUMN (lg:col-span-4): Timer Controls */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
            {/* Mode Switcher Tabs: Duration | End Time */}
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#F3EFEA] dark:bg-[#241E1C]">
              <button
                type="button"
                onClick={() => setMode('duration')}
                className={`py-2 px-4 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  mode === 'duration'
                    ? 'bg-[#A91D22] text-white shadow-xs'
                    : 'text-[#332927] dark:text-slate-300 hover:text-[#0E2338] dark:hover:text-white'
                }`}
              >
                Duration
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('endTime');
                  applyEndTime(endTimeStr);
                }}
                className={`py-2 px-4 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  mode === 'endTime'
                    ? 'bg-[#A91D22] text-white shadow-xs'
                    : 'text-[#332927] dark:text-slate-300 hover:text-[#0E2338] dark:hover:text-white'
                }`}
              >
                End Time
              </button>
            </div>

            {mode === 'duration' ? (
              <>
                {/* Preset Pill Buttons Row */}
                <div className="grid grid-cols-6 gap-1.5">
                  {[1, 3, 5, 10, 25].map((m) => {
                    const isSelected = activePreset === m;
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => applyDuration(m, 0, m)}
                        className={`py-2 px-1 rounded-lg text-xs font-bold border transition cursor-pointer ${
                          isSelected
                            ? 'bg-[#A91D22] text-white border-[#A91D22] shadow-2xs'
                            : 'bg-[#F8F5F1] dark:bg-[#221C1A] text-[#2B2220] dark:text-slate-200 border-[#E6DFD5] dark:border-[#342B28] hover:border-[#A91D22]/60'
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
                    className={`py-2 px-1 rounded-lg text-xs font-bold border transition cursor-pointer ${
                      activePreset === 'custom'
                        ? 'bg-[#A91D22] text-white border-[#A91D22] shadow-2xs'
                        : 'bg-[#F8F5F1] dark:bg-[#221C1A] text-[#2B2220] dark:text-slate-200 border-[#E6DFD5] dark:border-[#342B28] hover:border-[#A91D22]/60'
                    }`}
                  >
                    Custom
                  </button>
                </div>

                {/* Numeric Stepper Input Row */}
                <div className="flex items-center gap-3">
                  <div className="relative w-28">
                    <input
                      ref={inputRef}
                      type="number"
                      min={0}
                      max={999}
                      value={durationMinutes}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (!Number.isNaN(val)) {
                          applyDuration(val, customSeconds, 'custom');
                        }
                      }}
                      aria-label="Duration in minutes"
                      className="w-full rounded-xl border border-[#DED6CA] dark:border-[#362D2A] bg-white dark:bg-[#221C1A] px-3.5 py-2 text-lg font-bold text-[#1F1917] dark:text-white focus:outline-none focus:border-[#A91D22]"
                    />
                  </div>
                  <span className="text-sm font-medium text-[#3B312E] dark:text-slate-300">
                    minutes
                  </span>

                  {activePreset === 'custom' && (
                    <>
                      <div className="relative w-20">
                        <input
                          type="number"
                          min={0}
                          max={59}
                          value={customSeconds}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            if (!Number.isNaN(val)) {
                              applyDuration(durationMinutes, val, 'custom');
                            }
                          }}
                          aria-label="Duration seconds"
                          className="w-full rounded-xl border border-[#DED6CA] dark:border-[#362D2A] bg-white dark:bg-[#221C1A] px-3 py-2 text-lg font-bold text-[#1F1917] dark:text-white focus:outline-none focus:border-[#A91D22]"
                        />
                      </div>
                      <span className="text-sm font-medium text-[#3B312E] dark:text-slate-300">
                        sec
                      </span>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="space-y-2 py-1">
                <label className="block text-xs font-semibold text-[#3B312E] dark:text-slate-300">
                  Count down until clock time:
                </label>
                <input
                  type="time"
                  value={endTimeStr}
                  onChange={(e) => applyEndTime(e.target.value)}
                  className="w-full rounded-xl border border-[#DED6CA] dark:border-[#362D2A] bg-white dark:bg-[#221C1A] px-3.5 py-2 text-base font-bold text-[#1F1917] dark:text-white focus:outline-none focus:border-[#A91D22]"
                />
              </div>
            )}

            {/* Primary Crimson Start Button */}
            <button
              type="button"
              onClick={handleStart}
              className="w-full py-3.5 px-6 rounded-xl bg-[#A91D22] hover:bg-[#8E161A] text-white font-bold text-base shadow-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>
                {isRunning
                  ? 'Running...'
                  : remainingMs < totalMs && remainingMs > 0
                  ? 'Resume'
                  : 'Start'}
              </span>
            </button>

            {/* Secondary Row: Pause | Reset */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={isRunning ? handlePause : handleStart}
                className="py-2.5 px-4 rounded-xl bg-[#F4F0EB] dark:bg-[#251E1C] hover:bg-[#EAE3DC] dark:hover:bg-[#302724] text-[#241D1B] dark:text-white font-semibold text-sm border border-[#E5DDD3] dark:border-[#362D2A] transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="py-2.5 px-4 rounded-xl bg-[#F4F0EB] dark:bg-[#251E1C] hover:bg-[#EAE3DC] dark:hover:bg-[#302724] text-[#241D1B] dark:text-white font-semibold text-sm border border-[#E5DDD3] dark:border-[#362D2A] transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>

            {/* Bottom Utility Toggles Row: Sound Alert | Fullscreen | Show Time */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#EDE6DD] dark:border-[#2E2623] text-xs font-medium text-[#2B2220] dark:text-slate-200">
              {/* Sound Alert */}
              <div className="flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-[#A91D22] dark:text-rose-400" />
                <span>Sound Alert</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={soundAlert}
                  aria-label="Toggle Sound Alert"
                  onClick={() => setSoundAlert((prev) => !prev)}
                  className={`w-9 h-5 rounded-full transition-colors p-0.5 cursor-pointer ${
                    soundAlert ? 'bg-[#A91D22]' : 'bg-slate-300 dark:bg-slate-600'
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
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-[#F4F0EB] dark:hover:bg-[#251E1C] transition cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5 text-[#5A4E4A] dark:text-slate-300" />
                <span>Fullscreen</span>
              </button>

              {/* Show Time */}
              <div className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-[#A91D22] dark:text-rose-400" />
                <span>Show Time</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={showTime}
                  aria-label="Toggle Show Time"
                  onClick={() => setShowTime((prev) => !prev)}
                  className={`w-9 h-5 rounded-full transition-colors p-0.5 cursor-pointer ${
                    showTime ? 'bg-[#A91D22]' : 'bg-slate-300 dark:bg-slate-600'
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

          {/* RIGHT COLUMN (lg:col-span-3): Display Theme & Digit Style Selector */}
          <div className="lg:col-span-3 flex flex-col justify-between space-y-4 border-t lg:border-t-0 lg:border-l border-[#EDE6DD] dark:border-[#2E2623] pt-4 lg:pt-0 lg:pl-6">
            <div>
              <h3 className="text-sm font-bold text-[#0E2338] dark:text-white mb-2.5">
                Display Theme
              </h3>

              {/* 2x2 Grid of Visual Split-Flap Theme Cards */}
              <div className="grid grid-cols-2 gap-2.5">
                {(
                  ['classic-black', 'retro-cream', 'industrial', 'modern-dark'] as FlipDisplayThemeId[]
                ).map((tId) => {
                  const tc = FLIP_THEMES[tId];
                  const isSelected = displayTheme === tId;
                  return (
                    <button
                      key={tId}
                      type="button"
                      onClick={() => setDisplayTheme(tId)}
                      className={`group rounded-xl overflow-hidden border-2 transition-all text-center bg-white dark:bg-[#221C1A] cursor-pointer ${
                        isSelected
                          ? 'border-[#A91D22] shadow-xs'
                          : 'border-[#E6DFD5] dark:border-[#342B28] hover:border-[#A91D22]/60'
                      }`}
                    >
                      {/* Mini Split-Flap Preview Box */}
                      <div
                        className="h-16 w-full relative overflow-hidden flex items-center justify-center p-1.5"
                        style={{ background: tc.stageBg }}
                      >
                        <div
                          className="rounded-lg px-2 py-1 border shadow-md flex items-center gap-0.5"
                          style={{
                            background: tc.housingOuter,
                            borderColor: tc.housingBorder,
                          }}
                        >
                          {['2', '5', ':', '0', '0'].map((ch, idx) =>
                            ch === ':' ? (
                              <span
                                key={idx}
                                className="text-[11px] font-bold px-0.5 leading-none"
                                style={{ color: tc.colonColor }}
                              >
                                :
                              </span>
                            ) : (
                              <span
                                key={idx}
                                className="relative w-3.5 h-5 rounded-xs flex items-center justify-center font-mono text-xs font-bold leading-none overflow-hidden"
                                style={{
                                  background: tc.flapTopBg,
                                  color: tc.digitColor,
                                  border: `1px solid ${tc.flapBorder}`,
                                }}
                              >
                                {ch}
                                <span className="absolute inset-x-0 top-1/2 h-[1px] bg-black/60" />
                              </span>
                            )
                          )}
                        </div>
                      </div>
                      <div className="py-1.5 px-1 text-[11px] font-semibold text-[#2B2220] dark:text-slate-200 truncate">
                        {tc.name}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Digit Style Selector (3 Visual Mini Cards showing 25:00) */}
            <div>
              <h3 className="text-sm font-bold text-[#0E2338] dark:text-white mb-2.5">
                Digit Style
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {[
                  {
                    id: 'classic' as FlipDigitStyleId,
                    label: 'Classic Split-Flap',
                    bg: 'bg-[#1D1B1A] text-white',
                    font: 'font-mono font-bold tracking-tighter',
                  },
                  {
                    id: 'rounded' as FlipDigitStyleId,
                    label: 'Bold Rounded',
                    bg: 'bg-[#2C2A29] text-white',
                    font: 'font-sans font-extrabold tracking-normal',
                  },
                  {
                    id: 'light-flap' as FlipDigitStyleId,
                    label: 'Light Flap',
                    bg: 'bg-[#EAE4D8] text-[#1E1A17]',
                    font: 'font-sans font-black tracking-tight',
                  },
                ].map((st) => {
                  const isSelected = digitStyle === st.id;
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setDigitStyle(st.id)}
                      title={st.label}
                      aria-label={st.label}
                      className={`relative h-11 rounded-xl border-2 transition-all flex items-center justify-center cursor-pointer overflow-hidden ${
                        st.bg
                      } ${
                        isSelected
                          ? 'border-[#A91D22] ring-2 ring-[#A91D22]/25'
                          : 'border-[#DED6CA] dark:border-[#362D2A] hover:border-[#A91D22]/60'
                      }`}
                    >
                      <span className={`text-sm sm:text-base leading-none ${st.font}`}>
                        25:00
                      </span>
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-1 top-1/2 h-[1px] bg-black/35 pointer-events-none"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK PRESETS SECTION */}
      <div>
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0E2338] dark:text-white">
          Quick Presets
        </h2>
        <p className="text-xs sm:text-sm text-[#3B312E]/80 dark:text-slate-400 mt-0.5 mb-4">
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
                onClick={() => applyDuration(preset.mins, 0, preset.mins)}
                className={`flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-[#1C1715] border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#A91D22] ring-1 ring-[#A91D22]/30 shadow-xs'
                    : 'border-[#E6DFD5] dark:border-[#302724] hover:border-[#A91D22]/60'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-[#FDF2F2] dark:bg-[#2E1819] text-[#A91D22] dark:text-rose-400 flex items-center justify-center shrink-0">
                  <Timer className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-xs sm:text-sm text-[#0E2338] dark:text-white truncate">
                    {preset.label}
                  </div>
                  <div className="text-[11px] text-[#3B312E]/70 dark:text-slate-400 truncate">
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
            className={`flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-[#1C1715] border text-left transition-all cursor-pointer ${
              activePreset === 'custom'
                ? 'border-[#A91D22] ring-1 ring-[#A91D22]/30 shadow-xs'
                : 'border-[#E6DFD5] dark:border-[#302724] hover:border-[#A91D22]/60'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-[#FDF2F2] dark:bg-[#2E1819] text-[#A91D22] dark:text-rose-400 flex items-center justify-center shrink-0">
              <Settings className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-xs sm:text-sm text-[#0E2338] dark:text-white truncate">
                Custom
              </div>
              <div className="text-[11px] text-[#3B312E]/70 dark:text-slate-400 truncate">
                Set your own time
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* POPULAR USES SECTION */}
      <div className="rounded-3xl bg-[#F8F4EF]/90 dark:bg-[#1A1514]/80 border border-[#EAE1D7] dark:border-[#2E2523] p-5 sm:p-6">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0E2338] dark:text-white">
          Popular Uses
        </h2>
        <p className="text-xs sm:text-sm text-[#3B312E]/80 dark:text-slate-400 mt-0.5 mb-4">
          A flip timer is great for many everyday activities.
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
              title: 'Presentations',
              desc: 'Keep your talk on schedule.',
              mins: 10,
              icon: <Laptop className="w-5 h-5" />,
            },
            {
              title: 'Group Activities',
              desc: 'Manage time for team tasks.',
              mins: 10,
              icon: <Users className="w-5 h-5" />,
            },
            {
              title: 'Workouts',
              desc: 'Time your sets and rests.',
              mins: 3,
              icon: <Dumbbell className="w-5 h-5" />,
            },
            {
              title: 'Games and Challenges',
              desc: 'Add a clear time limit.',
              mins: 5,
              icon: <Gamepad2 className="w-5 h-5" />,
            },
            {
              title: 'Focus Breaks',
              desc: 'Use short timers for better rest.',
              mins: 5,
              icon: <Coffee className="w-5 h-5" />,
            },
          ].map((useItem) => (
            <button
              key={useItem.title}
              type="button"
              onClick={() =>
                applyDuration(
                  useItem.mins,
                  0,
                  [1, 3, 5, 10, 25].includes(useItem.mins) ? useItem.mins : 'custom'
                )
              }
              className="flex items-start gap-3 p-3.5 rounded-2xl bg-white dark:bg-[#1E1816] border border-[#E6DFD5] dark:border-[#322926] hover:border-[#A91D22] transition-all text-left cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-[#FDF2F2] dark:bg-[#2E1819] text-[#A91D22] dark:text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                {useItem.icon}
              </div>
              <div className="min-w-0">
                <div className="font-bold text-xs sm:text-sm text-[#0E2338] dark:text-white group-hover:text-[#A91D22] transition-colors">
                  {useItem.title}
                </div>
                <div className="text-[11px] text-[#3B312E]/70 dark:text-slate-400 leading-snug mt-0.5">
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

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
  BookOpen,
  GraduationCap,
  Flower2,
  Moon,
  Palette,
  Leaf,
  Coffee,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { playTimerSound } from '@/lib/sound';
import { requestWakeLock, releaseWakeLock } from '@/lib/wakelock';

type CandleStyle = 'ivory' | 'amber' | 'forest' | 'charcoal';
type FlameStyle = 'soft' | 'steady' | 'flicker' | 'bright';
type ModeTab = 'duration' | 'endTime';

interface CandlePalette {
  name: string;
  bodyLeft: string;
  bodyMid: string;
  bodyRight: string;
  topOuter: string;
  topPool: string;
  dripColor: string;
  glowColor: string;
}

const CANDLE_PALETTES: Record<CandleStyle, CandlePalette> = {
  ivory: {
    name: 'Ivory',
    bodyLeft: '#FDF7EA',
    bodyMid: '#F3E3C6',
    bodyRight: '#DEC59B',
    topOuter: '#FBF1DC',
    topPool: '#FFFDF7',
    dripColor: '#F6E8CC',
    glowColor: 'rgba(255, 200, 102, 0.55)',
  },
  amber: {
    name: 'Amber',
    bodyLeft: '#F29A3E',
    bodyMid: '#DA7721',
    bodyRight: '#A94F0D',
    topOuter: '#F7AF59',
    topPool: '#FDE0AE',
    dripColor: '#E5862B',
    glowColor: 'rgba(255, 165, 64, 0.58)',
  },
  forest: {
    name: 'Forest Green',
    bodyLeft: '#6D8564',
    bodyMid: '#4E6747',
    bodyRight: '#33462E',
    topOuter: '#8CA381',
    topPool: '#C8D6BC',
    dripColor: '#5D7655',
    glowColor: 'rgba(255, 198, 105, 0.48)',
  },
  charcoal: {
    name: 'Charcoal',
    bodyLeft: '#4E504E',
    bodyMid: '#343634',
    bodyRight: '#1F201F',
    topOuter: '#686A68',
    topPool: '#9C988E',
    dripColor: '#3F413F',
    glowColor: 'rgba(255, 184, 84, 0.52)',
  },
};

export default function CandleTimerComponent() {
  const [modeTab, setModeTab] = useState<ModeTab>('duration');
  const [durationMinutes, setDurationMinutes] = useState<number>(5);
  const [endTimeStr, setEndTimeStr] = useState<string>('17:00');
  const [totalMs, setTotalMs] = useState<number>(5 * 60 * 1000);
  const [remainingMs, setRemainingMs] = useState<number>(5 * 60 * 1000);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isTimelapse, setIsTimelapse] = useState<boolean>(false);

  // Visual & utility settings matching mockup
  const [candleStyle, setCandleStyle] = useState<CandleStyle>('ivory');
  const [flameStyle, setFlameStyle] = useState<FlameStyle>('soft');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showTime, setShowTime] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const customInputRef = useRef<HTMLInputElement>(null);
  const endTimeRef = useRef<number | null>(null);
  const remainingMsRef = useRef<number>(5 * 60 * 1000);
  const rafRef = useRef<number | null>(null);
  const timelapseStartRef = useRef<number | null>(null);
  const timelapseDurationMs = 8000;

  useEffect(() => {
    remainingMsRef.current = remainingMs;
  }, [remainingMs]);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Timelapse preview animation loop
  useEffect(() => {
    if (!isTimelapse) return;

    requestWakeLock();
    timelapseStartRef.current = performance.now();
    const startRemain = totalMs;

    const tickTimelapse = (now: number) => {
      if (!timelapseStartRef.current) return;
      const elapsed = now - timelapseStartRef.current;
      const progress = Math.min(1, elapsed / timelapseDurationMs);
      const left = Math.max(0, startRemain * (1 - progress));
      setRemainingMs(left);
      remainingMsRef.current = left;

      if (progress >= 1) {
        setIsTimelapse(false);
        setIsCompleted(true);
        if (soundEnabled) {
          playTimerSound('chime');
        }
        releaseWakeLock();
        return;
      }
      rafRef.current = requestAnimationFrame(tickTimelapse);
    };

    rafRef.current = requestAnimationFrame(tickTimelapse);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isTimelapse, totalMs, soundEnabled]);

  // Standard timer countdown loop
  useEffect(() => {
    if (isTimelapse) return;
    if (!isRunning) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      releaseWakeLock();
      return;
    }

    requestWakeLock();
    endTimeRef.current = performance.now() + remainingMsRef.current;

    const tick = (now: number) => {
      if (!endTimeRef.current) return;
      const left = Math.max(0, endTimeRef.current - now);
      setRemainingMs(left);
      remainingMsRef.current = left;

      if (left <= 0) {
        setIsRunning(false);
        setIsCompleted(true);
        if (soundEnabled) {
          playTimerSound('chime');
        }
        releaseWakeLock();
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isRunning, isTimelapse, soundEnabled]);

  const handleToggleTimelapse = () => {
    if (isTimelapse) {
      setIsTimelapse(false);
      return;
    }
    setIsRunning(false);
    setIsCompleted(false);
    setRemainingMs(totalMs);
    remainingMsRef.current = totalMs;
    setIsTimelapse(true);
  };

  const applyMinutes = useCallback((mins: number) => {
    const clamped = Math.max(1, Math.min(999, mins));
    setDurationMinutes(clamped);
    const ms = clamped * 60 * 1000;
    setTotalMs(ms);
    setRemainingMs(ms);
    remainingMsRef.current = ms;
    setIsRunning(false);
    setIsTimelapse(false);
    setIsCompleted(false);
  }, []);

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
    setTotalMs(diffMs);
    setRemainingMs(diffMs);
    remainingMsRef.current = diffMs;
    setDurationMinutes(Math.round(diffMs / 60000));
    setIsRunning(false);
    setIsCompleted(false);
  };

  const handleStart = () => {
    if (remainingMs <= 0) {
      setRemainingMs(totalMs);
      remainingMsRef.current = totalMs;
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
    setRemainingMs(totalMs);
    remainingMsRef.current = totalMs;
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement && !isFullscreen) {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
        try {
          const orientation = screen.orientation as unknown as { lock?: (mode: string) => Promise<void> };
          if (orientation?.lock) await orientation.lock('landscape');
        } catch {
          // ignore
        }
        setIsFullscreen(true);
      } else {
        if (document.fullscreenElement && document.exitFullscreen) {
          await document.exitFullscreen();
        }
        try {
          const orientation = screen.orientation as unknown as { unlock?: () => void };
          if (orientation?.unlock) orientation.unlock();
        } catch {
          // ignore
        }
        setIsFullscreen(false);
      }
    } catch {
      setIsFullscreen((prev) => !prev);
    }
  };

  // Format MM:SS
  const totalSeconds = Math.ceil(remainingMs / 1000);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  // Remaining fraction & candle height geometry
  const rawFraction = totalMs > 0 ? Math.max(0, Math.min(1, remainingMs / totalMs)) : 0;
  const elapsedFraction = 1 - rawFraction; // 0 = tall fresh candle, 1 = melted down
  const palette = CANDLE_PALETTES[candleStyle];

  // Candle SVG coordinates:
  // Base sits on wooden coaster at y = 266
  // Max wax height = 148px, min wax height when burnt down = 18px
  const baseY = 266;
  const minWaxHeight = 18;
  const maxWaxHeight = 148;
  const currentWaxHeight = minWaxHeight + rawFraction * (maxWaxHeight - minWaxHeight);
  const topY = baseY - currentWaxHeight;
  const candleCenterX = 110;
  const candleRadiusX = 44;
  const candleLeftX = candleCenterX - candleRadiusX;
  const candleRightX = candleCenterX + candleRadiusX;

  // Dynamic melted top rim dip (as candle burns, the center dips slightly forming a melted wax cup)
  const rimCenterDip = elapsedFraction * 4;
  const rimLeftDip = Math.sin(elapsedFraction * Math.PI) * 2;
  const rimRightDip = Math.cos(elapsedFraction * Math.PI) * 1.5;

  // Dynamic Drip Lengths (pixels from topY downwards)
  const drip1Len =
    elapsedFraction > 0.05
      ? Math.max(6, Math.min(currentWaxHeight - 6, ((elapsedFraction - 0.05) / 0.5) * (currentWaxHeight * 0.78)))
      : 0;
  const drip2Len =
    elapsedFraction > 0.16
      ? Math.max(5, Math.min(currentWaxHeight - 10, ((elapsedFraction - 0.16) / 0.55) * (currentWaxHeight * 0.62)))
      : 0;
  const drip3Len =
    elapsedFraction > 0.25
      ? Math.max(6, Math.min(currentWaxHeight - 2, ((elapsedFraction - 0.25) / 0.6) * (currentWaxHeight * 0.94)))
      : 0;
  const drip4Len =
    elapsedFraction > 0.38
      ? Math.max(4, Math.min(currentWaxHeight - 12, ((elapsedFraction - 0.38) / 0.45) * (currentWaxHeight * 0.44)))
      : 0;
  const drip5Len =
    elapsedFraction > 0.48
      ? Math.max(5, Math.min(currentWaxHeight - 3, ((elapsedFraction - 0.48) / 0.48) * (currentWaxHeight * 0.82)))
      : 0;

  // Dynamic Molten Wax Accumulation on the Coaster Plate
  const leftPoolScale = Math.max(0, Math.min(1, (elapsedFraction - 0.12) / 0.75));
  const rightPoolScale = Math.max(0, Math.min(1, (elapsedFraction - 0.25) / 0.65));
  const frontPoolScale = Math.max(0, Math.min(1, (elapsedFraction - 0.4) / 0.55));

  // Molten pool widens as candle burns down
  const moltenPoolRatio = 0.64 + elapsedFraction * 0.22;
  const isFlameLit = remainingMs > 0 && !isCompleted;

  // Flame animation classes & scale based on Flame Style
  const flameScale =
    flameStyle === 'bright'
      ? 1.15
      : flameStyle === 'steady'
      ? 0.96
      : flameStyle === 'flicker'
      ? 1.06
      : 1.0;

  return (
    <div className="space-y-8">
      {/* Main Interactive 3-Column Card */}
      <div className="rounded-2xl border border-[#E5E0D5] dark:border-[#2A332D] bg-white dark:bg-[#181D1A] p-4 shadow-sm sm:p-6 transition-colors">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch">
          {/* LEFT COLUMN: Realistic Digital Candle on Cozy Wooden Desk + Digital Readout */}
          <div
            ref={stageRef}
            className={`relative flex min-h-[370px] flex-col justify-between overflow-hidden rounded-xl border border-[#DFD4C3] dark:border-[#2D352F] sm:flex-row sm:items-center lg:col-span-5 ${
              isFullscreen ? 'timer-fullscreen-stage sm:flex-row items-center justify-center' : ''
            }`}
            style={{
              background:
                'linear-gradient(135deg, #BDA488 0%, #D4C1AA 38%, #E6DAC8 75%, #EFE6D8 100%)',
            }}
          >
            {isFullscreen && (
              <button
                type="button"
                onClick={toggleFullscreen}
                className="fixed top-4 right-4 z-50 inline-flex items-center gap-1.5 rounded-full bg-black/55 hover:bg-black/75 backdrop-blur-md border border-white/20 px-4 py-2 text-xs font-bold text-white shadow-lg transition cursor-pointer"
                aria-label="Exit Fullscreen"
              >
                <Minimize2 className="h-4 w-4" />
                <span>Exit Fullscreen</span>
              </button>
            )}
            {/* Cozy out-of-focus background books & greenery on the left */}
            <div className="pointer-events-none absolute bottom-[64px] left-0 z-0 flex flex-col items-start opacity-75 blur-[1.5px]">
              {/* Soft green plant leaves */}
              <div className="ml-2 mb-1 flex gap-1">
                <span className="h-9 w-5 -rotate-12 rounded-full bg-[#3E5C38]" />
                <span className="h-11 w-6 rotate-6 rounded-full bg-[#4F7046]" />
                <span className="h-8 w-5 rotate-25 rounded-full bg-[#354E30]" />
              </div>
              {/* Terracotta pot */}
              <div className="ml-3 mb-1 h-8 w-11 rounded-b-md bg-[#8E6245]" />
              {/* Stacked vintage books */}
              <div className="h-4 w-24 rounded-r bg-[#D8C3A5] border-b border-[#A68966]" />
              <div className="h-5 w-28 rounded-r bg-[#B98B62] border-b border-[#8C623E]" />
              <div className="h-5 w-26 rounded-r bg-[#9E6B43] border-b border-[#6E4726]" />
              <div className="h-6 w-30 rounded-r bg-[#7A5233]" />
            </div>

            {/* Warm Wooden Desk Surface at Bottom */}
            <div
              className="pointer-events-none absolute bottom-0 left-0 right-0 h-[66px] border-t border-[#9B734B]"
              style={{
                background:
                  'linear-gradient(180deg, #B9926B 0%, #A47B53 45%, #8B633C 85%, #734F2C 100%)',
              }}
            >
              {/* Warm light reflection on tabletop under candle */}
              {isFlameLit && (
                <div
                  className="mx-auto h-full w-64 opacity-55 blur-md transition-opacity duration-500"
                  style={{
                    background:
                      'radial-gradient(ellipse at center, rgba(255,212,128,0.65) 0%, rgba(255,170,70,0) 75%)',
                  }}
                />
              )}
            </div>

            {/* Left Half: Animated Pillar Candle SVG */}
            <div className="relative z-10 flex flex-1 items-end justify-center pt-2 sm:pl-2">
              <svg
                viewBox="0 0 220 310"
                shapeRendering="geometricPrecision"
                className={`${isFullscreen ? 'h-[78dvh] max-h-[520px] w-auto' : 'h-[300px] w-[215px]'} select-none`}
                role="img"
                aria-label={`Digital ${palette.name} candle timer with ${Math.round(
                  rawFraction * 100
                )}% wax remaining`}
              >
                <defs>
                  {/* 3D Cylindrical Wax Body Gradient */}
                  <linearGradient id={`candleBody-${candleStyle}`} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={palette.bodyLeft} />
                    <stop offset="35%" stopColor={palette.bodyLeft} />
                    <stop offset="70%" stopColor={palette.bodyMid} />
                    <stop offset="100%" stopColor={palette.bodyRight} />
                  </linearGradient>

                  {/* Warm Top Subsurface Illumination Gradient */}
                  <linearGradient id="subsurfaceGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(255, 224, 150, 0.72)" />
                    <stop offset="45%" stopColor="rgba(255, 195, 100, 0.22)" />
                    <stop offset="100%" stopColor="rgba(255, 195, 100, 0)" />
                  </linearGradient>

                  {/* Molten Liquid Wax Shimmer Gradient */}
                  <radialGradient id="moltenLiquidGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFFBEB" stopOpacity="0.95" />
                    <stop offset="45%" stopColor={palette.topPool} stopOpacity="0.9" />
                    <stop offset="100%" stopColor={palette.topOuter} stopOpacity="0.8" />
                  </radialGradient>

                  {/* Radial Flame Halo Glow */}
                  <radialGradient id="flameHalo" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(255, 238, 170, 0.9)" />
                    <stop offset="38%" stopColor={palette.glowColor} />
                    <stop offset="100%" stopColor="rgba(255, 180, 70, 0)" />
                  </radialGradient>

                  {/* Outer Flame Gradient */}
                  <linearGradient id="flameOuterGrad" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor="#EA580C" />
                    <stop offset="45%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#FDE047" />
                  </linearGradient>

                  {/* Wooden Coaster Gradient */}
                  <linearGradient id="woodCoasterGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#8C6239" />
                    <stop offset="50%" stopColor="#6E4927" />
                    <stop offset="100%" stopColor="#4A2F16" />
                  </linearGradient>
                </defs>

                {/* Desk Shadow beneath Wooden Coaster */}
                <ellipse
                  cx={candleCenterX}
                  cy={baseY + 18}
                  rx="68"
                  ry="11"
                  fill="rgba(38, 22, 8, 0.42)"
                />

                {/* Carved Wooden Coaster / Plate */}
                <ellipse
                  cx={candleCenterX}
                  cy={baseY + 11}
                  rx="62"
                  ry="11"
                  fill="url(#woodCoasterGrad)"
                />
                <ellipse
                  cx={candleCenterX}
                  cy={baseY + 7}
                  rx="62"
                  ry="10"
                  fill="#9B6E43"
                  stroke="#6E4927"
                  strokeWidth="1"
                />
                {/* Inner recessed rim of wooden coaster */}
                <ellipse
                  cx={candleCenterX}
                  cy={baseY + 6}
                  rx="52"
                  ry="7.5"
                  fill="#7A522E"
                />

                {/* ACCUMULATED MELTED WAX PUDDLES ON COASTER BASE */}
                {leftPoolScale > 0 && (
                  <ellipse
                    cx={candleLeftX + 4}
                    cy={baseY + 4}
                    rx={14 * leftPoolScale}
                    ry={4.5 * leftPoolScale}
                    fill={palette.dripColor}
                    opacity="0.88"
                  />
                )}
                {rightPoolScale > 0 && (
                  <ellipse
                    cx={candleRightX - 6}
                    cy={baseY + 5}
                    rx={13 * rightPoolScale}
                    ry={4 * rightPoolScale}
                    fill={palette.dripColor}
                    opacity="0.85"
                  />
                )}
                {frontPoolScale > 0 && (
                  <path
                    d={`M ${candleCenterX - 18 * frontPoolScale} ${baseY + 5} Q ${candleCenterX} ${
                      baseY + 9 * frontPoolScale
                    } ${candleCenterX + 18 * frontPoolScale} ${baseY + 5} Q ${candleCenterX} ${
                      baseY + 1
                    } ${candleCenterX - 18 * frontPoolScale} ${baseY + 5} Z`}
                    fill={palette.dripColor}
                    opacity="0.9"
                  />
                )}

                {/* Ambient Halo Glow around the Flame */}
                {isFlameLit && (
                  <circle
                    cx={candleCenterX}
                    cy={topY - 22}
                    r={flameStyle === 'bright' ? 68 : 58}
                    fill="url(#flameHalo)"
                    className={
                      flameStyle === 'steady' ? 'opacity-90' : 'animate-pulse opacity-95'
                    }
                  />
                )}

                {/* Cylindrical Candle Wax Body with Organic Top Rim Contour */}
                <path
                  d={`M ${candleLeftX} ${topY + rimLeftDip} Q ${candleCenterX} ${
                    topY + rimCenterDip
                  } ${candleRightX} ${topY + rimRightDip} L ${candleRightX} ${baseY} A ${candleRadiusX} 9 0 0 1 ${candleLeftX} ${baseY} Z`}
                  fill={`url(#candleBody-${candleStyle})`}
                />

                {/* Warm Subsurface Scattering Glow near top of wax when lit */}
                {isFlameLit && (
                  <path
                    d={`M ${candleLeftX} ${topY + rimLeftDip} Q ${candleCenterX} ${
                      topY + rimCenterDip
                    } ${candleRightX} ${topY + rimRightDip} L ${candleRightX} ${Math.min(
                      baseY,
                      topY + 46
                    )} L ${candleLeftX} ${Math.min(baseY, topY + 46)} Z`}
                    fill="url(#subsurfaceGlow)"
                  />
                )}

                {/* Top Wax Rim Ellipse with organic melted dip */}
                <ellipse
                  cx={candleCenterX}
                  cy={topY + rimCenterDip * 0.5}
                  rx={candleRadiusX}
                  ry={8.5}
                  fill={palette.topOuter}
                />

                {/* Pool of Molten Liquid Wax in the Crater */}
                <ellipse
                  cx={candleCenterX}
                  cy={topY + rimCenterDip * 0.7 + 0.5}
                  rx={candleRadiusX * moltenPoolRatio}
                  ry={5.5}
                  fill="url(#moltenLiquidGlow)"
                  opacity={isFlameLit ? 0.96 : 0.65}
                />

                {/* DYNAMIC RUNNING WAX DRIPS (GROW WITH MELTING PROGRESS) */}
                {/* Drip 1: Front-Left Main Flow */}
                {drip1Len > 0 && (
                  <path
                    d={`M ${candleCenterX - 22} ${topY + 3} Q ${candleCenterX - 25} ${
                      topY + drip1Len * 0.6
                    } ${candleCenterX - 23} ${topY + drip1Len} A 2.6 2.6 0 0 0 ${
                      candleCenterX - 18
                    } ${topY + drip1Len} Q ${candleCenterX - 19} ${
                      topY + drip1Len * 0.4
                    } ${candleCenterX - 18} ${topY + 3} Z`}
                    fill={palette.dripColor}
                    opacity="0.9"
                  />
                )}

                {/* Drip 2: Front-Right Curving Flow */}
                {drip2Len > 0 && (
                  <path
                    d={`M ${candleCenterX + 13} ${topY + 4} Q ${candleCenterX + 11} ${
                      topY + drip2Len * 0.5
                    } ${candleCenterX + 13} ${topY + drip2Len} A 2.2 2.2 0 0 0 ${
                      candleCenterX + 17
                    } ${topY + drip2Len} Q ${candleCenterX + 16} ${
                      topY + drip2Len * 0.4
                    } ${candleCenterX + 17} ${topY + 4} Z`}
                    fill={palette.dripColor}
                    opacity="0.82"
                  />
                )}

                {/* Drip 3: Left Outer Edge Cascade */}
                {drip3Len > 0 && (
                  <path
                    d={`M ${candleLeftX} ${topY + 2} Q ${candleLeftX - 1.5} ${
                      topY + drip3Len * 0.7
                    } ${candleLeftX + 0.5} ${topY + drip3Len} A 2.4 2.4 0 0 0 ${
                      candleLeftX + 4.5
                    } ${topY + drip3Len} Q ${candleLeftX + 3.5} ${
                      topY + drip3Len * 0.4
                    } ${candleLeftX + 4} ${topY + 3} Z`}
                    fill={palette.dripColor}
                    opacity="0.86"
                  />
                )}

                {/* Drip 4: Center-Right Small Beaded Drip */}
                {drip4Len > 0 && (
                  <path
                    d={`M ${candleCenterX + 1} ${topY + 5} Q ${candleCenterX} ${
                      topY + drip4Len * 0.6
                    } ${candleCenterX + 1} ${topY + drip4Len} A 1.8 1.8 0 0 0 ${
                      candleCenterX + 4.5
                    } ${topY + drip4Len} Q ${candleCenterX + 3.5} ${
                      topY + drip4Len * 0.3
                    } ${candleCenterX + 4} ${topY + 5} Z`}
                    fill={palette.dripColor}
                    opacity="0.75"
                  />
                )}

                {/* Drip 5: Right Outer Edge Trickle */}
                {drip5Len > 0 && (
                  <path
                    d={`M ${candleRightX - 4} ${topY + 3} Q ${candleRightX - 2.5} ${
                      topY + drip5Len * 0.6
                    } ${candleRightX - 3.5} ${topY + drip5Len} A 2.2 2.2 0 0 0 ${
                      candleRightX - 0.5
                    } ${topY + drip5Len} Q ${candleRightX - 1} ${
                      topY + drip5Len * 0.4
                    } ${candleRightX} ${topY + 2} Z`}
                    fill={palette.dripColor}
                    opacity="0.8"
                  />
                )}

                {/* Candle Wick (curls slightly as wax burns down) */}
                <path
                  d={`M ${candleCenterX} ${topY + rimCenterDip * 0.7 + 1} Q ${
                    candleCenterX + (elapsedFraction > 0.4 ? 2.5 : 0.8)
                  } ${topY - 5} ${candleCenterX - (elapsedFraction > 0.3 ? 1.5 : 0)} ${topY - 11}`}
                  stroke="#2B1E16"
                  strokeWidth="2.3"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Glowing ember tip on wick when lit */}
                {isFlameLit && (
                  <circle
                    cx={candleCenterX - (elapsedFraction > 0.3 ? 1.5 : 0)}
                    cy={topY - 10}
                    r="1.6"
                    fill="#FB923C"
                  />
                )}

                {/* Subtle Animated Flame or Completed Smoke Wisp */}
                {isFlameLit ? (
                  <g
                    transform={`translate(${candleCenterX - (elapsedFraction > 0.3 ? 1.5 : 0)}, ${
                      topY - 10
                    }) scale(${flameScale})`}
                    style={{
                      transformOrigin: `${candleCenterX - (elapsedFraction > 0.3 ? 1.5 : 0)}px ${
                        topY - 10
                      }px`,
                    }}
                  >
                    {/* Outer Soft Amber Teardrop */}
                    <path
                      d="M 0 -44 C 11 -28, 13 -11, 0 0 C -13 -11, -11 -28, 0 -44 Z"
                      fill="url(#flameOuterGrad)"
                      opacity="0.92"
                    >
                      {flameStyle !== 'steady' && (
                        <animateTransform
                          attributeName="transform"
                          type="scale"
                          values={
                            flameStyle === 'flicker'
                              ? '1 1; 0.94 1.06; 1.04 0.97; 0.97 1.03; 1 1'
                              : '1 1; 0.98 1.03; 1.02 0.99; 1 1'
                          }
                          dur={flameStyle === 'flicker' ? '1.8s' : '2.8s'}
                          repeatCount="indefinite"
                        />
                      )}
                    </path>

                    {/* Middle Golden Flame Core */}
                    <path
                      d="M 0 -34 C 7.5 -22, 8.5 -9, 0 -1 C -8.5 -9, -7.5 -22, 0 -34 Z"
                      fill="#FDE047"
                    />

                    {/* Inner White-Hot Flame Center */}
                    <path
                      d="M 0 -23 C 4.2 -15, 4.5 -6, 0 -2 C -4.5 -6, -4.2 -15, 0 -23 Z"
                      fill="#FFFBEB"
                    />
                  </g>
                ) : (
                  /* Gentle wisp of smoke when countdown reaches 00:00 */
                  <path
                    d={`M ${candleCenterX} ${topY - 12} C ${candleCenterX - 8} ${
                      topY - 26
                    }, ${candleCenterX + 10} ${topY - 42}, ${candleCenterX - 4} ${topY - 58}`}
                    stroke="rgba(255,255,255,0.55)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                  />
                )}
              </svg>
            </div>

            {/* Right Half: Digital Countdown, Melting Status & Inspirational Quote */}
            <div className="relative z-10 flex flex-col items-center justify-center px-4 pb-16 pt-2 text-center sm:w-[50%] sm:pb-12 sm:pr-5">
              {(showTime || isFullscreen) ? (
                <>
                  <div className={`font-mono ${isFullscreen ? 'text-6xl sm:text-8xl' : 'text-4xl sm:text-[44px]'} font-extrabold tracking-tight text-[#14201B] leading-none tabular-nums`}>
                    {formattedTime}
                  </div>
                  {!isFullscreen && (
                    <div className="mt-2 text-sm font-medium text-[#2B3530]">
                      {isCompleted ? 'Candle Completed' : 'Time Left'}
                    </div>
                  )}
                </>
              ) : (
                <div className="py-3 text-sm font-semibold text-[#2B3530]">
                  {isCompleted ? 'Candle Completed' : 'Quiet Session in Progress'}
                </div>
              )}

              {/* Dynamic Wax Melting Indicator & Interactive Preview Button */}
              {!isFullscreen && (
              <>
              <div className="mt-4 flex flex-col items-center gap-2">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-[#D5C7B3] bg-[#EFE7D8]/90 px-3 py-1 text-xs font-semibold text-[#384136] shadow-2xs">
                  <span className="h-2 w-2 rounded-full bg-[#E5862B] animate-pulse" />
                  <span>
                    Wax: {Math.round(elapsedFraction * 100)}% Melted
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleToggleTimelapse}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#C5B49D] bg-[#FAF5EC] px-3.5 py-1.5 text-xs font-semibold text-[#5A3816] shadow-xs transition hover:bg-[#F2E5D0] active:scale-95 cursor-pointer"
                  title="Watch the candle melt from full to burnt out in an 8-second preview"
                >
                  <Play className="h-3.5 w-3.5 fill-current text-[#D97706]" />
                  <span>{isTimelapse ? 'Pause Melt Preview' : 'Watch Candle Melt (8s)'}</span>
                </button>
              </div>

              {/* Quote & Decorative Flourish matching mockup */}
              <div className="mt-5 max-w-[195px]">
                <p className="font-serif italic text-base leading-snug text-[#1F2421] sm:text-[17px]">
                  <span className="font-bold text-[#C86D2D]">“</span>A little time
                  <br />
                  for a calmer you.<span className="font-bold text-[#C86D2D]">”</span>
                </p>
                {/* Botanical Divider */}
                <div className="mt-2 flex items-center justify-center gap-1.5 text-[#A68966]">
                  <span className="h-[1px] w-7 bg-[#B89F80]" />
                  <svg viewBox="0 0 36 12" className="h-3 w-8 fill-current">
                    <path d="M18 6 C14 2, 10 2, 8 6 C10 10, 14 10, 18 6 Z" />
                    <path d="M18 6 C22 2, 26 2, 28 6 C26 10, 22 10, 18 6 Z" />
                    <circle cx="18" cy="6" r="1.8" />
                  </svg>
                  <span className="h-[1px] w-7 bg-[#B89F80]" />
                </div>
              </div>
              </>
              )}
            </div>
          </div>

          {/* MIDDLE COLUMN: Timer Controls */}
          <div className="flex flex-col justify-between lg:col-span-4">
            <div className="space-y-4">
              {/* Duration / End Time Tabs */}
              <div className="grid grid-cols-2 rounded-lg bg-[#F2EFE9] dark:bg-[#222824] p-1">
                <button
                  type="button"
                  onClick={() => setModeTab('duration')}
                  className={`rounded-md py-2 text-sm font-semibold transition cursor-pointer ${
                    modeTab === 'duration'
                      ? 'bg-[#1F4E3B] text-white shadow-xs'
                      : 'text-[#4B5563] dark:text-slate-300 hover:text-[#111827] dark:hover:text-white'
                  }`}
                >
                  Duration
                </button>
                <button
                  type="button"
                  onClick={() => setModeTab('endTime')}
                  className={`rounded-md py-2 text-sm font-semibold transition cursor-pointer ${
                    modeTab === 'endTime'
                      ? 'bg-[#1F4E3B] text-white shadow-xs'
                      : 'text-[#4B5563] dark:text-slate-300 hover:text-[#111827] dark:hover:text-white'
                  }`}
                >
                  End Time
                </button>
              </div>

              {modeTab === 'duration' ? (
                <>
                  {/* 5 Preset Pills */}
                  <div className="grid grid-cols-5 gap-1.5">
                    {[1, 3, 5, 10, 15].map((preset) => {
                      const active = durationMinutes === preset && totalMs === preset * 60 * 1000;
                      return (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => applyMinutes(preset)}
                          className={`rounded-lg border py-2 text-xs font-semibold transition sm:text-sm cursor-pointer ${
                            active
                              ? 'border-[#1F4E3B] bg-[#1F4E3B] text-white shadow-xs'
                              : 'border-[#E5E0D5] dark:border-[#303933] bg-[#FAF8F5] dark:bg-[#222824] text-[#1F2937] dark:text-slate-200 hover:border-[#1F4E3B]/40'
                          }`}
                        >
                          {preset} min
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Minutes Stepper Input */}
                  <div className="flex items-center gap-3">
                    <div className="relative flex w-28 items-center rounded-lg border border-[#D8D2C5] dark:border-[#333C36] bg-white dark:bg-[#1E2420] px-3 py-2">
                      <input
                        ref={customInputRef}
                        type="number"
                        min={1}
                        max={999}
                        value={durationMinutes}
                        onChange={(e) => applyMinutes(parseInt(e.target.value || '1', 10))}
                        className="w-full bg-transparent text-base font-semibold text-[#111827] dark:text-white focus:outline-none"
                        aria-label="Custom duration in minutes"
                      />
                      <div className="flex flex-col">
                        <button
                          type="button"
                          onClick={() => applyMinutes(durationMinutes + 1)}
                          className="text-[#4B5563] dark:text-slate-400 hover:text-[#111827] dark:hover:text-white cursor-pointer"
                          aria-label="Increase minutes"
                        >
                          <ChevronUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => applyMinutes(Math.max(1, durationMinutes - 1))}
                          className="text-[#4B5563] dark:text-slate-400 hover:text-[#111827] dark:hover:text-white cursor-pointer"
                          aria-label="Decrease minutes"
                        >
                          <ChevronDown className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-[#4B5563] dark:text-slate-300">minutes</span>
                  </div>
                </>
              ) : (
                <div className="space-y-2 py-2">
                  <label className="block text-xs font-semibold text-[#4B5563] dark:text-slate-300">
                    Select Target End Time
                  </label>
                  <input
                    type="time"
                    value={endTimeStr}
                    onChange={(e) => handleEndTimeChange(e.target.value)}
                    className="w-full rounded-lg border border-[#D8D2C5] dark:border-[#333C36] bg-white dark:bg-[#1E2420] px-3.5 py-2.5 text-base font-semibold text-[#111827] dark:text-white focus:border-[#1F4E3B] focus:outline-none"
                  />
                </div>
              )}

              {/* Primary Start Button */}
              <button
                type="button"
                onClick={isRunning ? handlePause : handleStart}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1F4E3B] py-3 text-base font-semibold text-white shadow-xs transition hover:bg-[#183E2F] cursor-pointer"
              >
                <Play className="h-4 w-4 fill-current" />
                <span>{isRunning ? 'Running...' : 'Start'}</span>
              </button>

              {/* Pause & Reset Row */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={isRunning ? handlePause : handleStart}
                  className="flex items-center justify-center gap-2 rounded-lg border border-[#E5E0D5] dark:border-[#303933] bg-[#F5F2EC] dark:bg-[#222824] py-2.5 text-sm font-semibold text-[#1F2937] dark:text-slate-200 transition hover:bg-[#EAE5DC] dark:hover:bg-[#2A322C] cursor-pointer"
                >
                  <Pause className="h-4 w-4" />
                  <span>
                    {isRunning
                      ? 'Pause'
                      : remainingMs < totalMs && remainingMs > 0
                      ? 'Resume'
                      : 'Pause'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center justify-center gap-2 rounded-lg border border-[#E5E0D5] dark:border-[#303933] bg-[#F5F2EC] dark:bg-[#222824] py-2.5 text-sm font-semibold text-[#1F2937] dark:text-slate-200 transition hover:bg-[#EAE5DC] dark:hover:bg-[#2A322C] cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Utility Bar: Sound Alert, Fullscreen, Show Time */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-[#EFECE6] dark:border-[#2A332D] pt-3.5 text-xs font-medium text-[#4B5563] dark:text-slate-300">
              <div className="flex items-center gap-1.5">
                <Bell className="h-3.5 w-3.5 text-[#1F4E3B] dark:text-[#5CE1A6]" />
                <span>Sound Alert</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={soundEnabled}
                  onClick={() => setSoundEnabled((prev) => !prev)}
                  className={`relative ml-1 inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    soundEnabled ? 'bg-[#1F4E3B]' : 'bg-[#D1CEC7] dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition ${
                      soundEnabled ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <button
                type="button"
                onClick={toggleFullscreen}
                className="flex items-center gap-1 text-[#4B5563] dark:text-slate-300 hover:text-[#111827] dark:hover:text-white cursor-pointer"
              >
                {isFullscreen ? (
                  <Minimize2 className="h-3.5 w-3.5 text-[#1F4E3B] dark:text-[#5CE1A6]" />
                ) : (
                  <Maximize2 className="h-3.5 w-3.5 text-[#1F4E3B] dark:text-[#5CE1A6]" />
                )}
                <span>Fullscreen</span>
              </button>

              <div className="flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5 text-[#1F4E3B] dark:text-[#5CE1A6]" />
                <span>Show Time</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={showTime}
                  onClick={() => setShowTime((prev) => !prev)}
                  className={`relative ml-1 inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    showTime ? 'bg-[#1F4E3B]' : 'bg-[#D1CEC7] dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition ${
                      showTime ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Candle Style & Flame Style */}
          <div className="flex flex-col justify-between border-t border-[#EFECE6] dark:border-[#2A332D] pt-4 lg:col-span-3 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
            <div>
              <h3 className="mb-2.5 text-xs font-bold text-[#1F2937] dark:text-white">Candle Style</h3>

              {/* 2x2 Candle Style Selector Grid matching mockup */}
              <div className="grid grid-cols-2 gap-2.5">
                {(
                  [
                    {
                      id: 'ivory',
                      label: 'Ivory',
                      bg: 'linear-gradient(180deg, #E5D4BC 0%, #C6AF92 100%)',
                      waxLeft: '#FDF7EA',
                      waxRight: '#DEC59B',
                      topRim: '#FFFDF7',
                    },
                    {
                      id: 'amber',
                      label: 'Amber',
                      bg: 'linear-gradient(180deg, #C9BCA8 0%, #9E8E79 100%)',
                      waxLeft: '#F29A3E',
                      waxRight: '#A94F0D',
                      topRim: '#FDE0AE',
                    },
                    {
                      id: 'forest',
                      label: 'Forest Green',
                      bg: 'linear-gradient(180deg, #B5AA9A 0%, #867B6B 100%)',
                      waxLeft: '#6D8564',
                      waxRight: '#33462E',
                      topRim: '#C8D6BC',
                    },
                    {
                      id: 'charcoal',
                      label: 'Charcoal',
                      bg: 'linear-gradient(180deg, #BFB5A6 0%, #8E8374 100%)',
                      waxLeft: '#4E504E',
                      waxRight: '#1F201F',
                      topRim: '#9C988E',
                    },
                  ] as const
                ).map((item) => {
                  const active = candleStyle === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setCandleStyle(item.id)}
                      className={`flex flex-col items-center rounded-xl border p-1.5 text-center transition cursor-pointer ${
                        active
                          ? 'border-[#1F4E3B] dark:border-[#4BA37A] bg-[#EEF4F0] dark:bg-[#233229] ring-1 ring-[#1F4E3B] dark:ring-[#4BA37A]'
                          : 'border-[#E5E0D5] dark:border-[#303933] bg-[#FAF8F5] dark:bg-[#202622] hover:border-[#C7C0B3] dark:hover:border-slate-500'
                      }`}
                    >
                      <div
                        className="relative mb-1.5 flex h-16 w-full items-end justify-center overflow-hidden rounded-lg"
                        style={{ background: item.bg }}
                      >
                        {/* Mini glowing candle thumbnail */}
                        <svg viewBox="0 0 60 64" className="h-15 w-14">
                          <defs>
                            <linearGradient id={`thumb-${item.id}`} x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor={item.waxLeft} />
                              <stop offset="100%" stopColor={item.waxRight} />
                            </linearGradient>
                          </defs>
                          {/* Mini wooden base */}
                          <ellipse cx="30" cy="58" rx="18" ry="3.5" fill="#5A3B1E" />
                          {/* Mini candle cylinder */}
                          <path
                            d="M17 24 L43 24 L43 56 C43 58, 17 58, 17 56 Z"
                            fill={`url(#thumb-${item.id})`}
                          />
                          <ellipse cx="30" cy="24" rx="13" ry="3" fill={item.topRim} />
                          {/* Wick */}
                          <line x1="30" y1="20" x2="30" y2="24" stroke="#2B1E16" strokeWidth="1.2" />
                          {/* Flame */}
                          <path
                            d="M30 7 C34 12, 34 17, 30 21 C26 17, 26 12, 30 7 Z"
                            fill="#F59E0B"
                          />
                          <path
                            d="M30 11 C32 14, 32 17, 30 20 C28 17, 28 14, 30 11 Z"
                            fill="#FEF08A"
                          />
                        </svg>
                      </div>
                      <span className="text-[11px] font-semibold text-[#1F2937] dark:text-slate-200">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Flame Style Selector Row */}
            <div className="mt-4">
              <div className="mb-2 text-xs font-bold text-[#1F2937] dark:text-white">Flame Style</div>
              <div className="grid grid-cols-4 gap-2">
                {(
                  [
                    { id: 'soft', label: 'Soft Glow', outer: '#F59E0B', inner: '#FEF08A', scale: 1 },
                    { id: 'steady', label: 'Steady', outer: '#EA580C', inner: '#FDE047', scale: 0.9 },
                    { id: 'flicker', label: 'Warm Flicker', outer: '#F97316', inner: '#FEF08A', scale: 1.05 },
                    { id: 'bright', label: 'Bright Flame', outer: '#D97706', inner: '#FFFBEB', scale: 1.12 },
                  ] as const
                ).map((fl) => {
                  const active = flameStyle === fl.id;
                  return (
                    <button
                      key={fl.id}
                      type="button"
                      onClick={() => setFlameStyle(fl.id)}
                      aria-label={fl.label}
                      title={fl.label}
                      className={`flex h-11 items-center justify-center rounded-xl border transition cursor-pointer ${
                        active
                          ? 'border-[#1F4E3B] dark:border-[#4BA37A] bg-[#EEF4F0] dark:bg-[#233229] ring-1 ring-[#1F4E3B] dark:ring-[#4BA37A]'
                          : 'border-[#E5E0D5] dark:border-[#303933] bg-[#FAF8F5] dark:bg-[#202622] hover:border-[#C7C0B3] dark:hover:border-slate-500'
                      }`}
                    >
                      <svg viewBox="0 0 28 32" className="h-6 w-6">
                        <g transform={`translate(14, 27) scale(${fl.scale})`}>
                          <path
                            d="M 0 -22 C 6.5 -14, 7.5 -5, 0 0 C -7.5 -5, -6.5 -14, 0 -22 Z"
                            fill={fl.outer}
                          />
                          <path
                            d="M 0 -14 C 3.5 -9, 4 -3, 0 -1 C -4 -3, -3.5 -9, 0 -14 Z"
                            fill={fl.inner}
                          />
                        </g>
                      </svg>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Presets Section */}
      <div>
        <h2 className="font-serif text-xl font-bold text-[#14201B] dark:text-white">Quick Presets</h2>
        <p className="mt-0.5 text-sm text-[#4B5563] dark:text-slate-400">
          Start with a common time or set a custom duration.
        </p>

        <div className="mt-3.5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { mins: 1, title: '1 Minute', sub: 'Quick focus', icon: Leaf },
            { mins: 3, title: '3 Minutes', sub: 'Short break', icon: Coffee },
            { mins: 5, title: '5 Minutes', sub: 'Reading time', icon: BookOpen },
            { mins: 10, title: '10 Minutes', sub: 'Meditation', icon: Flower2 },
            { mins: 15, title: '15 Minutes', sub: 'Deep focus', icon: Moon },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = durationMinutes === item.mins && totalMs === item.mins * 60 * 1000;
            return (
              <button
                key={item.mins}
                type="button"
                onClick={() => applyMinutes(item.mins)}
                className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition cursor-pointer ${
                  isSelected
                    ? 'border-[#1F4E3B] dark:border-[#4BA37A] bg-[#F4F8F5] dark:bg-[#233229] shadow-2xs'
                    : 'border-[#E5E0D5] dark:border-[#2A332D] bg-white dark:bg-[#181D1A] hover:border-[#C5BEB0] dark:hover:border-slate-600'
                }`}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFF3E6] dark:bg-amber-950/60 text-[#EA580C] dark:text-amber-400">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#14201B] dark:text-white">{item.title}</div>
                  <div
                    className={`text-xs ${
                      isSelected ? 'font-medium text-[#1F4E3B] dark:text-[#6EE7B7]' : 'text-[#6B7280] dark:text-slate-400'
                    }`}
                  >
                    {item.sub}
                  </div>
                </div>
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => {
              setModeTab('duration');
              customInputRef.current?.focus();
              customInputRef.current?.select();
            }}
            className="flex items-center gap-3 rounded-xl border border-[#E5E0D5] dark:border-[#2A332D] bg-white dark:bg-[#181D1A] p-3.5 text-left transition hover:border-[#1F4E3B] dark:hover:border-[#4BA37A] cursor-pointer"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EEF4F0] dark:bg-[#233229] text-[#1F4E3B] dark:text-[#6EE7B7]">
              <Settings className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#14201B] dark:text-white">Custom</div>
              <div className="text-xs text-[#6B7280] dark:text-slate-400">Set your own time</div>
            </div>
          </button>
        </div>
      </div>

      {/* Popular Uses Section */}
      <div className="rounded-2xl bg-[#EEF3EE] dark:bg-[#1A221D] border border-transparent dark:border-[#2A352E] p-5 sm:p-6">
        <h2 className="font-serif text-xl font-bold text-[#14201B] dark:text-white">Popular Uses</h2>
        <p className="mt-0.5 text-sm text-[#4B5563] dark:text-slate-400">
          A candle timer is useful for many everyday situations.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[
            {
              icon: BookOpen,
              title: 'Reading and Journaling',
              desc: 'Create a calm and focused reading time.',
            },
            {
              icon: GraduationCap,
              title: 'Study Sessions',
              desc: 'Stay focused and avoid distractions.',
            },
            {
              icon: Flower2,
              title: 'Meditation and Mindfulness',
              desc: 'Take quiet breaks and breathe.',
            },
            {
              icon: Moon,
              title: 'Evening Routines',
              desc: 'Unwind and reduce screen time.',
            },
            {
              icon: Palette,
              title: 'Creative Work',
              desc: 'Perfect for writing, drawing and planning.',
            },
          ].map((useCase) => {
            const Icon = useCase.icon;
            return (
              <div
                key={useCase.title}
                className="flex items-start gap-3 rounded-xl border border-[#E0E7E0] dark:border-[#2B362E] bg-white dark:bg-[#151A17] p-3.5 shadow-2xs"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EAF2EC] dark:bg-[#233229] text-[#1F4E3B] dark:text-[#6EE7B7]">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#14201B] dark:text-white">{useCase.title}</div>
                  <div className="mt-0.5 text-[11px] leading-snug text-[#6B7280] dark:text-slate-400">
                    {useCase.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

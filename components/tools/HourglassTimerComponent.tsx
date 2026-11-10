'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Hourglass,
  Bell,
  Maximize2,
  Minimize2,
  Eye,
  Lightbulb,
  Settings,
  Gamepad2,
  GraduationCap,
  Coffee,
  Users,
  BookOpen,
  ChevronUp,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { playTimerSound } from '@/lib/sound';
import { requestWakeLock, releaseWakeLock } from '@/lib/wakelock';

const PRESET_MINUTES = [1, 3, 5, 10, 15];

interface FallingGrain {
  id: number;
  offsetX: number;
  speed: number;
  delay: number;
  size: number;
}

const FALLING_GRAINS: FallingGrain[] = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  offsetX: ((i % 5) - 2) * 1.1,
  speed: 0.55 + (i % 4) * 0.14,
  delay: (i * 0.09) % 1,
  size: 1.5 + (i % 3) * 0.55,
}));

export default function HourglassTimerComponent() {
  // Mode: 'duration' | 'endTime'
  const [mode, setMode] = useState<'duration' | 'endTime'>('duration');
  const [durationMinutes, setDurationMinutes] = useState<number>(5);
  const [totalSeconds, setTotalSeconds] = useState<number>(300);
  const [remainingMs, setRemainingMs] = useState<number>(300 * 1000);
  const [endTimeInput, setEndTimeInput] = useState<string>(() => {
    const d = new Date(Date.now() + 5 * 60 * 1000);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  });

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showTime, setShowTime] = useState<boolean>(true);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Flip state for the 180-degree wooden hourglass turnover animation
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [flipCount, setFlipCount] = useState<number>(0);
  const [grainPhase, setGrainPhase] = useState<number>(0);

  const customInputRef = useRef<HTMLInputElement>(null);
  const lastFrameTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const flipTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync WakeLock with running state
  useEffect(() => {
    if (isRunning) {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }
    return () => {
      releaseWakeLock();
    };
  }, [isRunning]);

  // Escape key closes fullscreen overlay
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Clean up flip timeout
  useEffect(() => {
    return () => {
      if (flipTimeoutRef.current) {
        clearTimeout(flipTimeoutRef.current);
      }
    };
  }, []);

  // High-precision animation loop
  useEffect(() => {
    if (!isRunning) {
      lastFrameTimeRef.current = null;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    const tick = (now: number) => {
      if (lastFrameTimeRef.current === null) {
        lastFrameTimeRef.current = now;
      }
      const delta = now - lastFrameTimeRef.current;
      lastFrameTimeRef.current = now;

      if (!reducedMotion) {
        setGrainPhase((prev) => (prev + delta * 0.0032) % 100);
      }

      setRemainingMs((prev) => {
        const next = Math.max(0, prev - delta);
        if (next === 0 && prev > 0) {
          setIsRunning(false);
          setIsCompleted(true);
          if (soundEnabled) {
            playTimerSound('chime', 0.85);
          }
        }
        return next;
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isRunning, reducedMotion, soundEnabled]);

  const applyMinutes = useCallback((mins: number) => {
    const clamped = Math.max(1, Math.min(180, mins));
    setIsRunning(false);
    setIsCompleted(false);
    setDurationMinutes(clamped);
    setTotalSeconds(clamped * 60);
    setRemainingMs(clamped * 60 * 1000);
  }, []);

  const handleEndTimeChange = (val: string) => {
    setEndTimeInput(val);
    const [hh, mm] = val.split(':').map(Number);
    if (!Number.isNaN(hh) && !Number.isNaN(mm)) {
      const now = new Date();
      const target = new Date();
      target.setHours(hh, mm, 0, 0);
      if (target <= now) {
        target.setDate(target.getDate() + 1);
      }
      const diffSec = Math.max(60, Math.round((target.getTime() - now.getTime()) / 1000));
      setIsRunning(false);
      setIsCompleted(false);
      setTotalSeconds(diffSec);
      setRemainingMs(diffSec * 1000);
      setDurationMinutes(Math.round(diffSec / 60));
    }
  };

  const triggerHourglassFlip = useCallback(
    (autoStartAfterFlip: boolean) => {
      setIsRunning(false);
      setIsCompleted(false);

      if (reducedMotion) {
        setRemainingMs(totalSeconds * 1000);
        if (autoStartAfterFlip) {
          setIsRunning(true);
        }
        return;
      }

      setIsFlipping(true);
      setFlipCount((c) => c + 1);

      if (flipTimeoutRef.current) {
        clearTimeout(flipTimeoutRef.current);
      }

      flipTimeoutRef.current = setTimeout(() => {
        setRemainingMs(totalSeconds * 1000);
        setIsFlipping(false);
        if (autoStartAfterFlip) {
          setIsRunning(true);
        }
      }, 620);
    },
    [reducedMotion, totalSeconds]
  );

  const handleStartOrResume = () => {
    if (isFlipping) return;
    if (remainingMs <= 0 || isCompleted) {
      setRemainingMs(totalSeconds * 1000);
      setIsCompleted(false);
    }
    setIsRunning(true);
  };

  const handlePauseToggle = () => {
    if (isFlipping) return;
    if (isRunning) {
      setIsRunning(false);
    } else if (remainingMs > 0 && remainingMs < totalSeconds * 1000) {
      setIsRunning(true);
    } else {
      handleStartOrResume();
    }
  };

  const handleReset = () => {
    triggerHourglassFlip(false);
  };

  const handleFlip = () => {
    triggerHourglassFlip(true);
  };

  const toggleFullscreen = async (enter: boolean) => {
    try {
      if (enter) {
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
      setIsFullscreen(enter);
    }
  };

  // Computed time and sand fractions
  const totalMs = Math.max(1000, totalSeconds * 1000);
  const remainingFraction = Math.max(0, Math.min(1, remainingMs / totalMs));
  const elapsedFraction = 1 - remainingFraction;

  const displayTotalSeconds = Math.ceil(remainingMs / 1000);
  const displayMinutes = Math.floor(displayTotalSeconds / 60);
  const displaySeconds = displayTotalSeconds % 60;
  const formattedMinutes = String(displayMinutes).padStart(2, '0');
  const formattedSeconds = String(displaySeconds).padStart(2, '0');

  // Render the Wooden-Framed Hourglass SVG
  const renderWoodenHourglassSVG = (sizeClass = 'w-full max-w-[310px] h-auto') => {
    // Upper bulb: y from 58 (top of bulb) to 180 (neck)
    // Lower bulb: y from 180 (neck) to 302 (bottom of bulb)
    const upperMaxHeight = 114;
    const upperSandHeight = upperMaxHeight * Math.pow(remainingFraction, 0.85);
    const upperSandTopY = 180 - upperSandHeight;

    // Funnel dip depth in center of upper sand when running
    const funnelDip =
      isRunning && remainingFraction > 0.04 && remainingFraction < 0.98
        ? Math.min(14, upperSandHeight * 0.25)
        : 0;

    // Lower bulb: sand accumulates from y = 302 upward toward y = 186
    const lowerMaxHeight = 114;
    const lowerSandHeight = lowerMaxHeight * Math.pow(elapsedFraction, 0.88);
    const lowerPeakY = 302 - lowerSandHeight;
    const lowerSideY = Math.min(302, lowerPeakY + Math.min(28, lowerSandHeight * 0.42));

    const isStreaming = isRunning && remainingFraction > 0 && !isFlipping;

    return (
      <div
        className={`relative flex items-center justify-center select-none ${
          isFlipping
            ? 'transition-transform duration-600 ease-in-out rotate-180 scale-95'
            : 'transition-transform duration-300 rotate-0 scale-100'
        }`}
        data-flip-count={flipCount}
      >
        <svg
          viewBox="0 0 280 360"
          shapeRendering="geometricPrecision"
          className={`${sizeClass} drop-shadow-[0_20px_28px_rgba(35,22,10,0.42)]`}
          role="img"
          aria-label={`Online wooden hourglass timer showing ${formattedMinutes} minutes and ${formattedSeconds} seconds left`}
        >
          <defs>
            {/* Rich Turned Wood Gradients */}
            <linearGradient id="hgWoodBase" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#5C3418" />
              <stop offset="22%" stopColor="#8B542B" />
              <stop offset="48%" stopColor="#B87642" />
              <stop offset="76%" stopColor="#7C4822" />
              <stop offset="100%" stopColor="#4A2810" />
            </linearGradient>

            <linearGradient id="hgWoodRim" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#46250F" />
              <stop offset="30%" stopColor="#9E6334" />
              <stop offset="55%" stopColor="#C98852" />
              <stop offset="85%" stopColor="#6D3D1B" />
              <stop offset="100%" stopColor="#3B1E0B" />
            </linearGradient>

            <linearGradient id="hgWoodPillar" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4E2B13" />
              <stop offset="35%" stopColor="#9C6234" />
              <stop offset="60%" stopColor="#BA7B48" />
              <stop offset="100%" stopColor="#46250E" />
            </linearGradient>

            {/* Golden Sand Gradients */}
            <linearGradient id="hgSandUpper" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5C77E" />
              <stop offset="45%" stopColor="#DE9E48" />
              <stop offset="85%" stopColor="#BA7624" />
              <stop offset="100%" stopColor="#945914" />
            </linearGradient>

            <linearGradient id="hgSandLower" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F8D291" />
              <stop offset="38%" stopColor="#E2A44E" />
              <stop offset="78%" stopColor="#C17D28" />
              <stop offset="100%" stopColor="#8F5512" />
            </linearGradient>

            <linearGradient id="hgSandSurface" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D6943E" />
              <stop offset="50%" stopColor="#FCE0A6" />
              <stop offset="100%" stopColor="#C5822E" />
            </linearGradient>

            {/* Transparent Hand-Blown Glass Gradient */}
            <linearGradient id="hgGlassShell" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.42" />
              <stop offset="18%" stopColor="#FFFDF9" stopOpacity="0.16" />
              <stop offset="50%" stopColor="#F5EFE6" stopOpacity="0.06" />
              <stop offset="84%" stopColor="#FFFFFF" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.46" />
            </linearGradient>

            {/* Clip Path for Upper Glass Chamber */}
            <clipPath id="hgUpperChamberClip">
              <path d="M 76 54 C 76 116, 128 156, 136 179 L 144 179 C 152 156, 204 116, 204 54 Z" />
            </clipPath>

            {/* Clip Path for Lower Glass Chamber */}
            <clipPath id="hgLowerChamberClip">
              <path d="M 136 181 C 128 204, 76 244, 76 306 L 204 306 C 204 244, 152 204, 144 181 Z" />
            </clipPath>
          </defs>

          {/* Soft Contact Shadow on Wooden Table */}
          <ellipse cx="140" cy="340" rx="96" ry="11" fill="rgba(25, 14, 5, 0.42)" />

          {/* LEFT & RIGHT TURNED WOODEN PILLARS */}
          {/* Left Pillar */}
          <rect x="54" y="48" width="14" height="264" rx="5" fill="url(#hgWoodPillar)" />
          <rect x="52" y="54" width="18" height="7" rx="3" fill="url(#hgWoodRim)" />
          <rect x="52" y="299" width="18" height="7" rx="3" fill="url(#hgWoodRim)" />

          {/* Right Pillar */}
          <rect x="212" y="48" width="14" height="264" rx="5" fill="url(#hgWoodPillar)" />
          <rect x="210" y="54" width="18" height="7" rx="3" fill="url(#hgWoodRim)" />
          <rect x="210" y="299" width="18" height="7" rx="3" fill="url(#hgWoodRim)" />

          {/* GLASS CHAMBERS BACKDROP */}
          <path
            d="M 76 54
               C 76 116, 128 156, 136 180
               C 128 204, 76 244, 76 306
               L 204 306
               C 204 244, 152 204, 144 180
               C 152 156, 204 116, 204 54
               Z"
            fill="url(#hgGlassShell)"
            stroke="rgba(255, 250, 240, 0.65)"
            strokeWidth="2.2"
          />

          {/* UPPER CHAMBER SAND */}
          <g clipPath="url(#hgUpperChamberClip)">
            {remainingFraction > 0.003 && (
              <>
                <path
                  d={`M 68 ${upperSandTopY}
                      Q 140 ${upperSandTopY + funnelDip * 1.7} 212 ${upperSandTopY}
                      L 212 182
                      L 68 182
                      Z`}
                  fill="url(#hgSandUpper)"
                />
                {/* Top sand surface rim highlight */}
                <ellipse
                  cx="140"
                  cy={upperSandTopY + funnelDip * 0.45}
                  rx={Math.max(8, 62 * Math.pow(remainingFraction, 0.42))}
                  ry={Math.max(2.5, 6.5 * Math.pow(remainingFraction, 0.45))}
                  fill="url(#hgSandSurface)"
                  opacity="0.92"
                />
              </>
            )}
          </g>

          {/* FALLING SAND STREAM & GRAINS THROUGH NECK */}
          {isStreaming && (
            <g>
              {/* Core golden sand stream from neck (y=178) down to lower sand peak */}
              <line
                x1="140"
                y1="177"
                x2="140"
                y2={Math.max(185, lowerPeakY + 4)}
                stroke="#F6CC84"
                strokeWidth="2.6"
                strokeLinecap="round"
                opacity="0.95"
              />
              <line
                x1="140"
                y1="178"
                x2="140"
                y2={Math.max(185, lowerPeakY + 4)}
                stroke="#FFF3D1"
                strokeWidth="1.1"
                strokeDasharray="3 4"
                strokeDashoffset={-grainPhase * 12}
              />

              {/* Animated falling sand particles */}
              {!reducedMotion &&
                FALLING_GRAINS.map((grain) => {
                  const streamLength = Math.max(14, lowerPeakY - 180);
                  const progress = ((grainPhase * grain.speed + grain.delay) % 1);
                  const cy = 180 + progress * streamLength;
                  const cx = 140 + grain.offsetX * (0.4 + progress * 1.4);
                  return (
                    <circle
                      key={grain.id}
                      cx={cx}
                      cy={cy}
                      r={grain.size}
                      fill="#FAD693"
                      opacity={0.85 - progress * 0.25}
                    />
                  );
                })}
            </g>
          )}

          {/* LOWER CHAMBER ACCUMULATING SAND MOUND */}
          <g clipPath="url(#hgLowerChamberClip)">
            {elapsedFraction > 0.002 && (
              <>
                <path
                  d={`M 68 308
                      L 68 ${lowerSideY}
                      Q 108 ${lowerSideY - (lowerSideY - lowerPeakY) * 0.45} 140 ${lowerPeakY}
                      Q 172 ${lowerSideY - (lowerSideY - lowerPeakY) * 0.45} 212 ${lowerSideY}
                      L 212 308
                      Z`}
                  fill="url(#hgSandLower)"
                />
                {/* Highlight on the conical sand peak */}
                <path
                  d={`M 140 ${lowerPeakY}
                      Q 125 ${lowerPeakY + (304 - lowerPeakY) * 0.45} 96 306
                      L 140 306
                      Z`}
                  fill="rgba(255, 238, 198, 0.24)"
                />
              </>
            )}
          </g>

          {/* SPECULAR GLASS HIGHLIGHTS & REFLECTIONS */}
          {/* Upper Left Curved Highlight */}
          <path
            d="M 86 64 C 86 110, 124 146, 133 172"
            fill="none"
            stroke="rgba(255, 255, 255, 0.62)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Lower Left Curved Highlight */}
          <path
            d="M 133 188 C 124 214, 86 250, 86 296"
            fill="none"
            stroke="rgba(255, 255, 255, 0.52)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Right Subtle Rim Reflection */}
          <path
            d="M 194 66 C 194 110, 156 146, 147 172"
            fill="none"
            stroke="rgba(255, 255, 255, 0.28)"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M 147 188 C 156 214, 194 250, 194 294"
            fill="none"
            stroke="rgba(255, 255, 255, 0.28)"
            strokeWidth="2.2"
            strokeLinecap="round"
          />

          {/* TOP TURNED WOODEN CAP (Two-tier classic hourglass frame) */}
          <rect
            x="46"
            y="38"
            width="188"
            height="16"
            rx="7"
            fill="url(#hgWoodRim)"
            stroke="#3A1D0A"
            strokeWidth="1"
          />
          <rect
            x="36"
            y="22"
            width="208"
            height="18"
            rx="8"
            fill="url(#hgWoodBase)"
            stroke="#3A1D0A"
            strokeWidth="1"
          />
          {/* Top Wood Highlight */}
          <line
            x1="48"
            y1="26"
            x2="232"
            y2="26"
            stroke="rgba(255, 224, 185, 0.35)"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* BOTTOM TURNED WOODEN BASE (Two-tier classic hourglass frame) */}
          <rect
            x="46"
            y="306"
            width="188"
            height="16"
            rx="7"
            fill="url(#hgWoodRim)"
            stroke="#3A1D0A"
            strokeWidth="1"
          />
          <rect
            x="36"
            y="320"
            width="208"
            height="20"
            rx="9"
            fill="url(#hgWoodBase)"
            stroke="#3A1D0A"
            strokeWidth="1"
          />
          {/* Bottom Wood Highlight */}
          <line
            x1="48"
            y1="324"
            x2="232"
            y2="324"
            stroke="rgba(255, 224, 185, 0.35)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  };

  return (
    <div className="space-y-12">
      {/* FULLSCREEN OVERLAY */}
      {isFullscreen && (
        <div className="timer-fullscreen-stage bg-gradient-to-b from-[#2A1D12] via-[#1B1610] to-[#120E0A] text-white p-6 sm:p-10 select-none">
          {/* Exit Fullscreen in Top-Right Corner */}
          <button
            type="button"
            onClick={() => toggleFullscreen(false)}
            className="fixed top-4 right-4 z-50 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/55 hover:bg-black/75 backdrop-blur-md border border-white/20 text-white text-xs font-bold shadow-lg transition-colors cursor-pointer"
            aria-label="Exit Fullscreen"
          >
            <Minimize2 className="w-4 h-4" />
            <span>Exit Fullscreen</span>
          </button>

          {/* Center Hourglass + Giant Readout */}
          <div className="my-auto flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-12 lg:gap-20 py-2 w-full h-full">
            <div className="h-[50dvh] sm:h-[76dvh] max-h-[320px] sm:max-h-[500px] max-w-[78vw] sm:max-w-[45vw] aspect-[280/360] flex items-center justify-center shrink-0">
              {renderWoodenHourglassSVG('w-full h-full max-w-none')}
            </div>

            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="font-mono text-[clamp(2.5rem,11vmin,7.5rem)] font-bold tracking-tight tabular-nums text-white leading-none drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
                {formattedMinutes}:{formattedSeconds}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MAIN INTERACTIVE HOURGLASS CARD */}
      <div className="bg-white dark:bg-[#1A201C] border border-[#E4E1D9] dark:border-[#2D352F] rounded-3xl p-5 sm:p-7 lg:p-8 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-8 items-stretch">
          {/* LEFT COLUMN (lg:col-span-5): Realistic Sunlit Wooden Desk + Hourglass */}
          <div className="lg:col-span-5">
            <div className="relative h-full min-h-[390px] sm:min-h-[430px] rounded-2xl overflow-hidden border border-[#DECBB1] dark:border-[#362C20] flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#DFC59E] via-[#C8A173] to-[#9E6E3E] shadow-inner">
              {/* Warm Bokeh Sunlight Glow Effects */}
              <div className="pointer-events-none absolute -top-12 -left-10 w-56 h-56 rounded-full bg-[#FFF6E0]/55 blur-2xl" />
              <div className="pointer-events-none absolute top-16 right-4 w-40 h-40 rounded-full bg-[#FFE7BA]/45 blur-xl" />
              <div className="pointer-events-none absolute bottom-20 left-8 w-36 h-36 rounded-full bg-[#FFEAC4]/35 blur-xl" />

              {/* Wooden Table Surface at Bottom */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-[#A67341] via-[#8C5A2B] to-[#6B421B] border-t border-[#C49664]/60" />

              {/* Hourglass Vessel */}
              <div className="relative z-10 flex items-center justify-center w-full">
                {renderWoodenHourglassSVG('w-full max-w-[270px] sm:max-w-[295px] h-auto')}
              </div>

              {/* Completion or Flip Status Pill */}
              {isCompleted && (
                <div className="relative z-20 mt-2 px-4 py-1.5 rounded-full bg-[#265641] text-white text-xs font-semibold shadow-md flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Time&apos;s Up! Click Flip to turn over &amp; restart.</span>
                </div>
              )}
            </div>
          </div>

          {/* MIDDLE COLUMN (lg:col-span-4): Duration/End Time, Presets, Start, Pause/Reset/Flip, Toggles */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-5">
            <div className="space-y-5">
              {/* Duration / End Time Tabs */}
              <div className="grid grid-cols-2 rounded-xl bg-[#F0EFEA] dark:bg-[#222924] p-1 border border-[#E4E1D9] dark:border-[#2D352F]">
                <button
                  type="button"
                  onClick={() => setMode('duration')}
                  className={`py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                    mode === 'duration'
                      ? 'bg-[#1F4E3B] text-white shadow-2xs'
                      : 'text-[#252B27]/75 dark:text-slate-300 hover:text-[#252B27]'
                  }`}
                >
                  Duration
                </button>
                <button
                  type="button"
                  onClick={() => setMode('endTime')}
                  className={`py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                    mode === 'endTime'
                      ? 'bg-[#1F4E3B] text-white shadow-2xs'
                      : 'text-[#252B27]/75 dark:text-slate-300 hover:text-[#252B27]'
                  }`}
                >
                  End Time
                </button>
              </div>

              {mode === 'duration' ? (
                <>
                  {/* Preset Pill Buttons: 1 min, 3 min, 5 min, 10 min, 15 min */}
                  <div className="grid grid-cols-5 gap-2">
                    {PRESET_MINUTES.map((preset) => {
                      const isActive = durationMinutes === preset && totalSeconds === preset * 60;
                      return (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => applyMinutes(preset)}
                          className={`py-2 px-1 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${
                            isActive
                              ? 'bg-[#1F4E3B] text-white border-[#1F4E3B] shadow-2xs'
                              : 'bg-[#F7F6F2] dark:bg-[#222924] text-[#252B27] dark:text-slate-200 border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#1F4E3B]'
                          }`}
                        >
                          {preset} min
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Minutes Input with Up/Down Stepper */}
                  <div className="flex items-center gap-3">
                    <div className="relative flex items-center w-28 sm:w-32 bg-[#F7F6F2] dark:bg-[#222924] border border-[#E4E1D9] dark:border-[#2D352F] rounded-xl px-3.5 py-2 focus-within:border-[#1F4E3B]">
                      <input
                        ref={customInputRef}
                        type="number"
                        min={1}
                        max={180}
                        value={durationMinutes}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          if (!Number.isNaN(val)) {
                            applyMinutes(val);
                          }
                        }}
                        className="w-full bg-transparent text-base sm:text-lg font-semibold text-[#252B27] dark:text-white focus:outline-hidden appearance-none"
                        aria-label="Custom duration in minutes"
                      />
                      <div className="flex flex-col -mr-1">
                        <button
                          type="button"
                          onClick={() => applyMinutes(durationMinutes + 1)}
                          className="text-[#252B27]/60 hover:text-[#252B27] dark:text-slate-400 dark:hover:text-white cursor-pointer"
                          aria-label="Increase minutes"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => applyMinutes(Math.max(1, durationMinutes - 1))}
                          className="text-[#252B27]/60 hover:text-[#252B27] dark:text-slate-400 dark:hover:text-white cursor-pointer"
                          aria-label="Decrease minutes"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <span className="text-sm text-[#252B27]/80 dark:text-slate-300 font-medium">
                      minutes
                    </span>
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-[#252B27]/75 dark:text-slate-300">
                    Select target end time:
                  </label>
                  <input
                    type="time"
                    value={endTimeInput}
                    onChange={(e) => handleEndTimeChange(e.target.value)}
                    className="w-full rounded-xl bg-[#F7F6F2] dark:bg-[#222924] border border-[#E4E1D9] dark:border-[#2D352F] px-4 py-2.5 text-base font-semibold text-[#252B27] dark:text-white focus:outline-hidden focus:border-[#1F4E3B]"
                  />
                </div>
              )}

              {/* Primary Start Button */}
              <button
                type="button"
                onClick={isRunning ? handlePauseToggle : handleStartOrResume}
                className="w-full py-3.5 px-6 rounded-xl bg-[#1F4E3B] hover:bg-[#183E2E] text-white font-bold text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-xs transition-all cursor-pointer"
              >
                {isRunning ? (
                  <>
                    <Pause className="w-5 h-5 fill-current" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" />
                    <span>
                      {remainingMs < totalSeconds * 1000 && remainingMs > 0 ? 'Resume' : 'Start'}
                    </span>
                  </>
                )}
              </button>

              {/* Secondary 3-Button Row: Pause | Reset | Flip */}
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={handlePauseToggle}
                  className="py-3 px-3 rounded-xl bg-[#F2EFE9] dark:bg-[#222924] hover:bg-[#E6E2DA] dark:hover:bg-[#2A332D] border border-[#E4E1D9] dark:border-[#2D352F] text-[#252B27] dark:text-slate-200 font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Pause className="w-4 h-4 fill-current" />
                  <span>{!isRunning && remainingMs < totalSeconds * 1000 && remainingMs > 0 ? 'Resume' : 'Pause'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="py-3 px-3 rounded-xl bg-[#F2EFE9] dark:bg-[#222924] hover:bg-[#E6E2DA] dark:hover:bg-[#2A332D] border border-[#E4E1D9] dark:border-[#2D352F] text-[#252B27] dark:text-slate-200 font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </button>

                <button
                  type="button"
                  onClick={handleFlip}
                  className="py-3 px-3 rounded-xl bg-[#F2EFE9] dark:bg-[#222924] hover:bg-[#E6E2DA] dark:hover:bg-[#2A332D] border border-[#E4E1D9] dark:border-[#2D352F] text-[#252B27] dark:text-slate-200 font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  title="Turn the hourglass over 180° and start again"
                >
                  <Hourglass className="w-4 h-4 text-[#8B542B] dark:text-[#D99B52]" />
                  <span>Flip</span>
                </button>
              </div>
            </div>

            {/* Bottom Controls Bar: Sound Alert, Fullscreen, Show Time, Reduced Motion */}
            <div className="pt-3 border-t border-[#E4E1D9]/70 dark:border-[#2D352F] flex flex-wrap items-center justify-between gap-y-2.5 gap-x-3 text-xs text-[#252B27]/85 dark:text-slate-300">
              {/* Sound Alert Toggle */}
              <div className="flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-[#1F4E3B] dark:text-[#5E917A]" />
                <span className="font-medium">Sound Alert</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={soundEnabled}
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`w-9 h-5 rounded-full transition-colors p-0.5 cursor-pointer ${
                    soundEnabled ? 'bg-[#1F4E3B]' : 'bg-[#CBD2CE] dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      soundEnabled ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Fullscreen Button */}
              <button
                type="button"
                onClick={() => toggleFullscreen(true)}
                className="flex items-center gap-1.5 font-medium hover:text-[#1F4E3B] dark:hover:text-[#5E917A] transition-colors cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5 text-[#1F4E3B] dark:text-[#5E917A]" />
                <span>Fullscreen</span>
              </button>

              {/* Show Time Toggle */}
              <div className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-[#1F4E3B] dark:text-[#5E917A]" />
                <span className="font-medium">Show Time</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={showTime}
                  onClick={() => setShowTime(!showTime)}
                  className={`w-9 h-5 rounded-full transition-colors p-0.5 cursor-pointer ${
                    showTime ? 'bg-[#1F4E3B]' : 'bg-[#CBD2CE] dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      showTime ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Reduced Motion Toggle */}
              <div className="flex items-center gap-1.5">
                <span className="font-medium text-[11px] text-[#252B27]/70 dark:text-slate-400">
                  Reduced Motion
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={reducedMotion}
                  onClick={() => setReducedMotion(!reducedMotion)}
                  className={`w-8 h-4.5 rounded-full transition-colors p-0.5 cursor-pointer ${
                    reducedMotion ? 'bg-[#1F4E3B]' : 'bg-[#CBD2CE] dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`block w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                      reducedMotion ? 'translate-x-3.5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (lg:col-span-3): Time Left Card + Tip Card */}
          <div className="lg:col-span-3 flex flex-col justify-between gap-4">
            {/* Time Left Card */}
            <div className="flex-1 rounded-2xl bg-[#EEF3EF] dark:bg-[#1E2722] border border-[#DCE5DD] dark:border-[#2C3931] p-6 flex flex-col items-center justify-center text-center">
              <span className="text-xs sm:text-sm font-semibold text-[#252B27]/80 dark:text-slate-300 mb-2">
                Time Left
              </span>
              {showTime ? (
                <>
                  <div className="font-mono text-5xl sm:text-6xl font-bold tracking-tight text-[#18201C] dark:text-white tabular-nums leading-none my-1">
                    {formattedMinutes}:{formattedSeconds}
                  </div>
                  <div className="grid grid-cols-2 gap-8 text-xs text-[#252B27]/70 dark:text-slate-400 mt-2">
                    <span>minutes</span>
                    <span>seconds</span>
                  </div>
                </>
              ) : (
                <div className="py-6 text-xs sm:text-sm text-[#252B27]/70 dark:text-slate-400 italic">
                  Numeric time hidden — watch the hourglass sand flow
                </div>
              )}
            </div>

            {/* Warm Tip Card */}
            <div className="rounded-2xl bg-[#FAF3E8] dark:bg-[#24201A] border border-[#EFE2CD] dark:border-[#3A3227] p-5">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-[#D97706] fill-current shrink-0" />
                <span className="font-serif italic font-bold text-sm sm:text-base text-[#252B27] dark:text-white">
                  Tip
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                Click <strong className="font-semibold text-[#252B27] dark:text-white">Flip</strong> to turn the hourglass over and start again, just like a traditional sand clock.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK PRESETS SECTION */}
      <div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252B27] dark:text-white mb-1">
          Quick Presets
        </h2>
        <p className="text-xs sm:text-sm text-[#252B27]/75 dark:text-slate-400 mb-5">
          Choose a common time or set a custom duration.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {[
            { mins: 1, label: '1 Minute', sub: 'Quick tasks' },
            { mins: 3, label: '3 Minutes', sub: 'Short activities' },
            { mins: 5, label: '5 Minutes', sub: 'Focus time' },
            { mins: 10, label: '10 Minutes', sub: 'Work breaks' },
            { mins: 15, label: '15 Minutes', sub: 'Longer sessions' },
          ].map((item) => {
            const isSelected = durationMinutes === item.mins && mode === 'duration';
            return (
              <button
                key={item.mins}
                type="button"
                onClick={() => {
                  setMode('duration');
                  applyMinutes(item.mins);
                }}
                className={`p-4 rounded-2xl text-left transition-all flex items-center gap-3.5 cursor-pointer border ${
                  isSelected
                    ? 'bg-white dark:bg-[#1E2722] border-2 border-[#265641] shadow-xs'
                    : 'bg-white dark:bg-[#1A201C] border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#265641]'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-[#FAF3E8] dark:bg-[#2A241C] text-[#B86B23] flex items-center justify-center shrink-0">
                  <Hourglass className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-xs sm:text-sm text-[#252B27] dark:text-white truncate">
                    {item.label}
                  </div>
                  <div
                    className={`text-[11px] truncate ${
                      isSelected
                        ? 'text-[#265641] dark:text-[#5E917A] font-medium'
                        : 'text-[#252B27]/65 dark:text-slate-400'
                    }`}
                  >
                    {item.sub}
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
              customInputRef.current?.focus();
              customInputRef.current?.select();
            }}
            className="p-4 rounded-2xl text-left bg-white dark:bg-[#1A201C] border border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#265641] transition-all flex items-center gap-3.5 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#EBF1ED] dark:bg-[#222B25] text-[#265641] dark:text-[#5E917A] flex items-center justify-center shrink-0">
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
      <div className="rounded-3xl bg-[#EEF3EF]/80 dark:bg-[#19211C] border border-[#DCE5DD] dark:border-[#26322B] p-6 sm:p-8">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252B27] dark:text-white mb-1">
          Popular Uses
        </h2>
        <p className="text-xs sm:text-sm text-[#252B27]/75 dark:text-slate-400 mb-6">
          An hourglass timer is useful for many everyday situations.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              title: 'Board Games',
              desc: 'Keep turns fair and fun.',
              icon: <Gamepad2 className="w-5 h-5 text-[#265641] dark:text-[#5E917A]" />,
              iconBg: 'bg-[#E7EDE7] dark:bg-[#243028]',
            },
            {
              title: 'Learning',
              desc: 'Manage study time.',
              icon: <GraduationCap className="w-5 h-5 text-[#265641] dark:text-[#5E917A]" />,
              iconBg: 'bg-[#E7EDE7] dark:bg-[#243028]',
            },
            {
              title: 'Focus Sessions',
              desc: 'Stay on track with short breaks.',
              icon: <Coffee className="w-5 h-5 text-[#C87A28]" />,
              iconBg: 'bg-[#FAF3E8] dark:bg-[#2C241B]',
            },
            {
              title: 'Classroom Activities',
              desc: 'Handle transitions and group work.',
              icon: <Users className="w-5 h-5 text-[#265641] dark:text-[#5E917A]" />,
              iconBg: 'bg-[#E7EDE7] dark:bg-[#243028]',
            },
            {
              title: 'Daily Routines',
              desc: 'Make daily tasks more visual.',
              icon: <BookOpen className="w-5 h-5 text-[#265641] dark:text-[#5E917A]" />,
              iconBg: 'bg-[#E7EDE7] dark:bg-[#243028]',
            },
          ].map((useCase) => (
            <div
              key={useCase.title}
              className="bg-white dark:bg-[#1E2520] border border-[#E4E1D9] dark:border-[#2D352F] rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs"
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${useCase.iconBg}`}
              >
                {useCase.icon}
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-xs sm:text-sm text-[#252B27] dark:text-white">
                  {useCase.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-[#252B27]/70 dark:text-slate-400 leading-snug mt-0.5">
                  {useCase.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

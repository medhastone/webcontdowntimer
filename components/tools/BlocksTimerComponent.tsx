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
  BookOpen,
  Smile,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { playTimerSound } from '@/lib/sound';
import { requestWakeLock, releaseWakeLock } from '@/lib/wakelock';

type BlockStyle = 'wooden' | 'colored' | 'stone' | 'minimal';
type ColorTheme = 'natural' | 'red' | 'orange' | 'green' | 'blue' | 'purple';
type ModeTab = 'duration' | 'endTime';

interface BlockColorPalette {
  front: string;
  top: string;
  side: string;
  border: string;
}

const COLORED_STACK_PALETTE: BlockColorPalette[] = [
  { front: '#E53935', top: '#FF6F60', side: '#B71C1C', border: '#9A1111' }, // Red (top in 6-block stack)
  { front: '#FB8C00', top: '#FFB74D', side: '#E65100', border: '#BF360C' }, // Orange
  { front: '#FDD835', top: '#FFF176', side: '#F57F17', border: '#C66900' }, // Yellow
  { front: '#43A047', top: '#81C784', side: '#1B5E20', border: '#0D3B12' }, // Green
  { front: '#1E88E5', top: '#64B5F6', side: '#0D47A1', border: '#072A60' }, // Blue
  { front: '#8E24AA', top: '#BA68C8', side: '#4A148C', border: '#2A0854' }, // Purple (bottom in 6-block stack)
];

const WOOD_PALETTE: BlockColorPalette[] = [
  { front: '#D79A5B', top: '#E8B57E', side: '#B37436', border: '#8D5620' },
  { front: '#CE8E4E', top: '#E2AC72', side: '#A86A2E', border: '#834E1A' },
  { front: '#C68545', top: '#DCA268', side: '#9E6026', border: '#794615' },
];

const STONE_PALETTE: BlockColorPalette[] = [
  { front: '#8D9499', top: '#AEB5BA', side: '#666D72', border: '#4C5257' },
  { front: '#7B8287', top: '#9DA4A9', side: '#585E63', border: '#40454A' },
  { front: '#6C7378', top: '#8E959A', side: '#4B5156', border: '#363B40' },
];

const MINIMAL_PALETTE: BlockColorPalette[] = [
  { front: '#ECE8E1', top: '#F7F5F0', side: '#CFC9BF', border: '#B8B1A6' },
  { front: '#E2DCD3', top: '#EFECE6', side: '#C2BBB0', border: '#ABA398' },
  { front: '#E6CDD0', top: '#F3DFE1', side: '#C4A8AB', border: '#AD8F93' },
  { front: '#C8CFD4', top: '#DDE3E7', side: '#A6AFB5', border: '#8F989E' },
];

const SINGLE_COLOR_THEMES: Record<Exclude<ColorTheme, 'natural'>, BlockColorPalette[]> = {
  red: [
    { front: '#EF4444', top: '#F87171', side: '#B91C1C', border: '#991B1B' },
    { front: '#DC2626', top: '#EF4444', side: '#991B1B', border: '#7F1D1D' },
  ],
  orange: [
    { front: '#F97316', top: '#FB923C', side: '#C2410C', border: '#9A3412' },
    { front: '#EA580C', top: '#F97316', side: '#9A3412', border: '#7C2D12' },
  ],
  green: [
    { front: '#22C55E', top: '#4ADE80', side: '#15803D', border: '#166534' },
    { front: '#16A34A', top: '#22C55E', side: '#166534', border: '#14532D' },
  ],
  blue: [
    { front: '#2563EB', top: '#60A5FA', side: '#1D4ED8', border: '#1E3A8A' },
    { front: '#1D4ED8', top: '#3B82F6', side: '#1E40AF', border: '#172554' },
  ],
  purple: [
    { front: '#8B5CF6', top: '#A78BFA', side: '#6D28D9', border: '#4C1D95' },
    { front: '#7C3AED', top: '#8B5CF6', side: '#5B21B6', border: '#3B0764' },
  ],
};

function getBlockPalette(
  indexFromTop: number,
  totalBlocks: number,
  blockStyle: BlockStyle,
  colorTheme: ColorTheme
): BlockColorPalette {
  // When user picks a specific solid Color Theme (other than 'natural'), tint the blocks with that theme
  if (colorTheme !== 'natural') {
    const list = SINGLE_COLOR_THEMES[colorTheme];
    return list[indexFromTop % list.length];
  }

  // When 'natural' swatch is active, color depends on blockStyle
  // Note: in the reference dashboard mockup, the stage displays the iconic 6 rainbow-colored wooden blocks
  // when 'colored' is chosen OR when 'natural' rainbow wood blocks are rendered on the stage.
  if (blockStyle === 'colored') {
    return COLORED_STACK_PALETTE[indexFromTop % COLORED_STACK_PALETTE.length];
  }
  if (blockStyle === 'stone') {
    return STONE_PALETTE[indexFromTop % STONE_PALETTE.length];
  }
  if (blockStyle === 'minimal') {
    return MINIMAL_PALETTE[indexFromTop % MINIMAL_PALETTE.length];
  }
  // For 'wooden' with 'natural' theme, use the colorful painted wooden blocks look from the hero mockup
  return COLORED_STACK_PALETTE[indexFromTop % COLORED_STACK_PALETTE.length];
}

export default function BlocksTimerComponent() {
  const [modeTab, setModeTab] = useState<ModeTab>('duration');
  const [durationMinutes, setDurationMinutes] = useState<number>(5);
  const [endTimeStr, setEndTimeStr] = useState<string>('17:00');
  const [totalMs, setTotalMs] = useState<number>(5 * 60 * 1000);
  const [remainingMs, setRemainingMs] = useState<number>(5 * 60 * 1000);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Visual & utility settings matching mockup
  const [blockStyle, setBlockStyle] = useState<BlockStyle>('wooden');
  const [blockCount, setBlockCount] = useState<number>(10);
  const [colorTheme, setColorTheme] = useState<ColorTheme>('natural');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showTime, setShowTime] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const customInputRef = useRef<HTMLInputElement>(null);
  const endTimeRef = useRef<number | null>(null);
  const remainingMsRef = useRef<number>(5 * 60 * 1000);
  const rafRef = useRef<number | null>(null);

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

  useEffect(() => {
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
  }, [isRunning, soundEnabled]);

  const applyMinutes = useCallback((mins: number) => {
    const clamped = Math.max(1, Math.min(999, mins));
    setDurationMinutes(clamped);
    const ms = clamped * 60 * 1000;
    setTotalMs(ms);
    setRemainingMs(ms);
    remainingMsRef.current = ms;
    setIsRunning(false);
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

  // Calculate remaining fraction and visible blocks
  const rawFraction = totalMs > 0 ? Math.max(0, Math.min(1, remainingMs / totalMs)) : 0;
  // Display visual stack: when blockCount <= 6 we show exact blockCount; for visual clarity on the desk tower
  // we render `blockCount` stacked blocks and remove them one by one from the top as time passes.
  const activeBlockCount = remainingMs <= 0 ? 0 : Math.max(1, Math.ceil(rawFraction * blockCount));

  // Compute geometry for the 3D block stack SVG so it fits cleanly on the desk stage
  const svgWidth = 210;
  const svgHeight = 310;
  const deskY = 276;
  const maxStackHeight = 236;
  const blockGap = blockCount > 12 ? 1.5 : 2.5;
  const blockH = Math.min(36, Math.max(10, (maxStackHeight - blockGap * (blockCount - 1)) / blockCount));
  const blockW = 104;
  const depthX = 16;
  const depthY = Math.min(10, Math.max(5, blockH * 0.3));
  const startX = 44;

  return (
    <div className="space-y-8">
      {/* Main Interactive 3-Column Card */}
      <div className="rounded-2xl border border-[#E5E0D5] dark:border-[#2A332D] bg-white dark:bg-[#181D1A] p-4 shadow-sm sm:p-6 transition-colors">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch">
          {/* LEFT COLUMN: Realistic 3D Stacked Blocks on Warm Wooden Desk + Digital Readout */}
          <div
            ref={stageRef}
            className={`relative flex min-h-[370px] flex-col justify-between overflow-hidden rounded-xl border border-[#E6E1D6] dark:border-[#2D352F] bg-gradient-to-b from-[#EAE6DF] via-[#E5E0D6] to-[#DFD9CE] sm:flex-row sm:items-center lg:col-span-5 ${
              isFullscreen ? 'timer-fullscreen-stage sm:flex-row items-center justify-center' : ''
            }`}
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
            {/* Soft warm sunlight window glow & out-of-focus greenery in upper-left corner */}
            <div
              className="pointer-events-none absolute -left-10 -top-10 h-44 w-44 rounded-full opacity-50 blur-2xl"
              style={{
                background: 'radial-gradient(circle, rgba(122,168,96,0.45) 0%, rgba(255,250,235,0) 70%)',
              }}
            />
            <div
              className="pointer-events-none absolute right-0 top-0 h-full w-2/3 opacity-60"
              style={{
                background: 'linear-gradient(135deg, rgba(255,253,249,0.75) 0%, rgba(246,243,236,0.35) 100%)',
              }}
            />

            {/* Wooden Desk Surface at Bottom */}
            <div
              className="pointer-events-none absolute bottom-0 left-0 right-0 h-[62px] border-t border-[#C8A27A]"
              style={{
                background:
                  'linear-gradient(180deg, #D9B68C 0%, #CCA170 38%, #BC8E5B 85%, #A77947 100%)',
              }}
            >
              {/* Subtle wood grain lines on desk */}
              <div className="h-full w-full opacity-20 [background-image:repeating-linear-gradient(0deg,transparent,transparent_6px,#6E4720_7px)]" />
            </div>

            {/* Blurred notebook edge on left of desk like the reference photo */}
            <div className="pointer-events-none absolute bottom-5 left-0 hidden h-10 w-12 -skew-x-12 rounded-r border border-[#B89F80] bg-[#F5EFE4] shadow-md sm:block">
              <div className="mt-2 h-1.5 w-full bg-[#7A9A76]/60" />
            </div>

            {/* Left Half: 3D Stacked Blocks Tower */}
            <div className="relative z-10 flex flex-1 items-end justify-center pt-4 sm:pl-3">
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                shapeRendering="geometricPrecision"
                className={`${isFullscreen ? 'h-[48dvh] sm:h-[75dvh] max-h-[300px] sm:max-h-[480px] w-auto' : 'h-[295px] w-[205px]'} select-none drop-shadow-sm`}
                role="img"
                aria-label={`Stacked blocks countdown showing ${activeBlockCount} of ${blockCount} blocks remaining`}
              >
                <defs>
                  <filter id="deskShadow" x="-20%" y="-20%" width="140%" height="150%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
                    <feOffset dx="2" dy="4" result="offsetblur" />
                    <feComponentTransfer>
                      <feFuncA type="linear" slope="0.28" />
                    </feComponentTransfer>
                    <feMerge>
                      <feMergeNode />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Cast shadow on wooden desk */}
                <ellipse
                  cx={startX + blockW / 2 + depthX / 2}
                  cy={deskY + 4}
                  rx={blockW * 0.62}
                  ry={8}
                  fill="rgba(68, 42, 18, 0.32)"
                />

                {/* Render blocks from bottom (index = blockCount - 1) to top (index = 0) so upper blocks sit naturally on lower ones */}
                {Array.from({ length: blockCount }).map((_, idx) => {
                  // idx = 0 is bottom-most block, idx = blockCount - 1 is top-most block
                  const indexFromBottom = idx;
                  const indexFromTop = blockCount - 1 - idx;
                  const isVisible = indexFromBottom < activeBlockCount;

                  if (!isVisible) return null;

                  // For 6 or fewer blocks, map directly to rainbow top-to-bottom order; otherwise cycle smoothly
                  const paletteIndex =
                    blockCount <= 6
                      ? indexFromTop
                      : Math.floor((indexFromTop / Math.max(1, blockCount - 1)) * 5.99);

                  const palette = getBlockPalette(
                    blockStyle === 'colored' || (blockStyle === 'wooden' && colorTheme === 'natural')
                      ? paletteIndex
                      : indexFromTop,
                    blockCount,
                    blockStyle,
                    colorTheme
                  );

                  const yBottom = deskY - indexFromBottom * (blockH + blockGap);
                  const yTop = yBottom - blockH;
                  // Slight natural handcrafted micro-offset for wooden/stone blocks
                  const jitterX =
                    blockStyle === 'minimal'
                      ? 0
                      : ((indexFromBottom * 7) % 3 - 1) * 0.8;
                  const xLeft = startX + jitterX;
                  const xRight = xLeft + blockW;

                  // 3D Isometric/Oblique coordinates for top face and right side face
                  const topFacePoints = `${xLeft},${yTop} ${xLeft + depthX},${yTop - depthY} ${
                    xRight + depthX
                  },${yTop - depthY} ${xRight},${yTop}`;

                  const rightFacePoints = `${xRight},${yTop} ${xRight + depthX},${yTop - depthY} ${
                    xRight + depthX
                  },${yBottom - depthY} ${xRight},${yBottom}`;

                  // Determine if this is the top-most currently active block (next to be removed)
                  const isTopActiveBlock = indexFromBottom === activeBlockCount - 1;
                  // Subtle progress within the current top block
                  const blockSpan = 1 / blockCount;
                  const currentBlockProgress = Math.max(
                    0,
                    Math.min(1, (rawFraction - indexFromBottom * blockSpan) / blockSpan)
                  );

                  return (
                    <g
                      key={indexFromBottom}
                      filter="url(#deskShadow)"
                      style={{
                        opacity: isRunning && isTopActiveBlock ? 0.65 + 0.35 * currentBlockProgress : 1,
                        transition: 'opacity 250ms ease, transform 300ms ease',
                      }}
                    >
                      {/* Top 3D Face */}
                      <polygon
                        points={topFacePoints}
                        fill={palette.top}
                        stroke={palette.border}
                        strokeWidth="0.6"
                        strokeLinejoin="round"
                      />

                      {/* Right 3D Side Face */}
                      <polygon
                        points={rightFacePoints}
                        fill={palette.side}
                        stroke={palette.border}
                        strokeWidth="0.6"
                        strokeLinejoin="round"
                      />

                      {/* Front Face */}
                      <rect
                        x={xLeft}
                        y={yTop}
                        width={blockW}
                        height={blockH}
                        rx={blockStyle === 'minimal' ? 2.5 : 1.5}
                        fill={palette.front}
                        stroke={palette.border}
                        strokeWidth="0.7"
                      />

                      {/* Top edge highlight on front face for realistic bevel */}
                      <line
                        x1={xLeft + 1}
                        y1={yTop + 1}
                        x2={xRight - 1}
                        y2={yTop + 1}
                        stroke="rgba(255,255,255,0.45)"
                        strokeWidth="1"
                      />

                      {/* Subtle texture details based on Block Style */}
                      {(blockStyle === 'wooden' || blockStyle === 'colored') && blockH >= 14 && (
                        <>
                          <path
                            d={`M ${xLeft + 8} ${yTop + blockH * 0.38} Q ${xLeft + blockW * 0.5} ${
                              yTop + blockH * 0.28
                            } ${xRight - 10} ${yTop + blockH * 0.42}`}
                            stroke="rgba(255,255,255,0.16)"
                            strokeWidth="1"
                            fill="none"
                          />
                          <path
                            d={`M ${xLeft + 14} ${yTop + blockH * 0.72} Q ${xLeft + blockW * 0.45} ${
                              yTop + blockH * 0.82
                            } ${xRight - 8} ${yTop + blockH * 0.68}`}
                            stroke="rgba(0,0,0,0.12)"
                            strokeWidth="0.9"
                            fill="none"
                          />
                        </>
                      )}

                      {blockStyle === 'stone' && blockH >= 14 && (
                        <>
                          <circle
                            cx={xLeft + 22}
                            cy={yTop + blockH * 0.45}
                            r="1.3"
                            fill="rgba(255,255,255,0.25)"
                          />
                          <circle
                            cx={xLeft + 68}
                            cy={yTop + blockH * 0.65}
                            r="1.6"
                            fill="rgba(0,0,0,0.2)"
                          />
                          <line
                            x1={xLeft + 40}
                            y1={yTop + blockH * 0.3}
                            x2={xLeft + 54}
                            y2={yTop + blockH * 0.55}
                            stroke="rgba(0,0,0,0.18)"
                            strokeWidth="0.8"
                          />
                        </>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Right Half: Digital Countdown & Sage Info Box */}
            <div className={`relative z-10 flex flex-col items-center justify-center px-4 text-center sm:w-[50%] sm:pr-5 ${isFullscreen ? 'pb-6 pt-1 sm:pb-8' : 'pb-16 pt-2 sm:pb-12'}`}>
              {(showTime || isFullscreen) ? (
                <>
                  <div className={`font-mono ${isFullscreen ? 'text-[clamp(2.5rem,11vmin,6.5rem)]' : 'text-4xl sm:text-[44px]'} font-extrabold tracking-tight text-[#14201B] leading-none tabular-nums`}>
                    {formattedTime}
                  </div>
                  {!isFullscreen && (
                    <div className="mt-2 text-sm font-medium text-[#37413E]">
                      {isCompleted ? 'Time is up!' : 'Time Left'}
                    </div>
                  )}
                </>
              ) : (
                <div className="py-4 text-sm font-semibold text-[#4B5550]">
                  {activeBlockCount} of {blockCount} blocks left
                </div>
              )}

              {!isFullscreen && (
                <div className="mt-5 rounded-xl border border-[#D5DEC8] bg-[#E2EAD7]/90 px-3.5 py-2.5 text-xs leading-relaxed text-[#2B3B2B] shadow-2xs">
                  {isCompleted
                    ? 'All blocks have been removed!'
                    : isRunning
                    ? `${activeBlockCount} of ${blockCount} blocks remaining.`
                    : 'Blocks will be removed gradually as time passes.'}
                </div>
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
                  <span>{isRunning ? 'Pause' : remainingMs < totalMs && remainingMs > 0 ? 'Resume' : 'Pause'}</span>
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

          {/* RIGHT COLUMN: Block Style, Block Count, Color Theme */}
          <div className="flex flex-col justify-between border-t border-[#EFECE6] dark:border-[#2A332D] pt-4 lg:col-span-3 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
            <div>
              <h3 className="mb-2.5 text-xs font-bold uppercase tracking-wider text-[#1F2937] dark:text-white">
                Block Style
              </h3>

              {/* 2x2 Block Style Selector Grid */}
              <div className="grid grid-cols-2 gap-2">
                {/* Wooden Blocks */}
                <button
                  type="button"
                  onClick={() => setBlockStyle('wooden')}
                  className={`flex flex-col items-center justify-center rounded-xl border p-2.5 text-center transition cursor-pointer ${
                    blockStyle === 'wooden'
                      ? 'border-[#1F4E3B] dark:border-[#4BA37A] bg-[#EEF4F0] dark:bg-[#233229] ring-1 ring-[#1F4E3B] dark:ring-[#4BA37A]'
                      : 'border-[#E5E0D5] dark:border-[#303933] bg-[#FAF8F5] dark:bg-[#202622] hover:border-[#C7C0B3] dark:hover:border-slate-500'
                  }`}
                >
                  <div className="mb-1.5 flex flex-col items-center">
                    {['#E2A463', '#D4914D', '#C5803B', '#B6712D'].map((c, i) => (
                      <div
                        key={i}
                        className="-mt-0.5 h-2.5 w-9 rounded-[2px] border border-[#8E561E]"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] font-semibold text-[#1F2937] dark:text-slate-200">Wooden Blocks</span>
                </button>

                {/* Colored Blocks */}
                <button
                  type="button"
                  onClick={() => setBlockStyle('colored')}
                  className={`flex flex-col items-center justify-center rounded-xl border p-2.5 text-center transition cursor-pointer ${
                    blockStyle === 'colored'
                      ? 'border-[#1F4E3B] dark:border-[#4BA37A] bg-[#EEF4F0] dark:bg-[#233229] ring-1 ring-[#1F4E3B] dark:ring-[#4BA37A]'
                      : 'border-[#E5E0D5] dark:border-[#303933] bg-[#FAF8F5] dark:bg-[#202622] hover:border-[#C7C0B3] dark:hover:border-slate-500'
                  }`}
                >
                  <div className="mb-1.5 flex flex-col items-center">
                    {['#8E24AA', '#1E88E5', '#43A047', '#FDD835', '#E53935'].map((c, i) => (
                      <div
                        key={i}
                        className="-mt-0.5 h-2 w-9 rounded-[2px] border border-black/15"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] font-semibold text-[#1F2937] dark:text-slate-200">Colored Blocks</span>
                </button>

                {/* Stone Blocks */}
                <button
                  type="button"
                  onClick={() => setBlockStyle('stone')}
                  className={`flex flex-col items-center justify-center rounded-xl border p-2.5 text-center transition cursor-pointer ${
                    blockStyle === 'stone'
                      ? 'border-[#1F4E3B] dark:border-[#4BA37A] bg-[#EEF4F0] dark:bg-[#233229] ring-1 ring-[#1F4E3B] dark:ring-[#4BA37A]'
                      : 'border-[#E5E0D5] dark:border-[#303933] bg-[#FAF8F5] dark:bg-[#202622] hover:border-[#C7C0B3] dark:hover:border-slate-500'
                  }`}
                >
                  <div className="mb-1.5 flex flex-col items-center">
                    {['#9CA3AF', '#6B7280', '#4B5563', '#374151'].map((c, i) => (
                      <div
                        key={i}
                        className="-mt-0.5 h-2.5 w-9 rounded-[2px] border border-[#374151]"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] font-semibold text-[#1F2937] dark:text-slate-200">Stone Blocks</span>
                </button>

                {/* Minimal Blocks */}
                <button
                  type="button"
                  onClick={() => setBlockStyle('minimal')}
                  className={`flex flex-col items-center justify-center rounded-xl border p-2.5 text-center transition cursor-pointer ${
                    blockStyle === 'minimal'
                      ? 'border-[#1F4E3B] dark:border-[#4BA37A] bg-[#EEF4F0] dark:bg-[#233229] ring-1 ring-[#1F4E3B] dark:ring-[#4BA37A]'
                      : 'border-[#E5E0D5] dark:border-[#303933] bg-[#FAF8F5] dark:bg-[#202622] hover:border-[#C7C0B3] dark:hover:border-slate-500'
                  }`}
                >
                  <div className="mb-1.5 flex flex-col items-center">
                    {['#F3EFEA', '#E5DFD5', '#E6CDD0', '#C9CFD4'].map((c, i) => (
                      <div
                        key={i}
                        className="-mt-0.5 h-2.5 w-9 rounded-[2px] border border-[#B8B1A6]"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] font-semibold text-[#1F2937] dark:text-slate-200">Minimal Blocks</span>
                </button>
              </div>
            </div>

            {/* Block Count Slider */}
            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="block-count-slider"
                  className="text-xs font-bold text-[#1F2937] dark:text-white"
                >
                  Block Count
                </label>
                <span className="text-xs font-bold text-[#1F4E3B] dark:text-[#5CE1A6]">{blockCount}</span>
              </div>
              <input
                id="block-count-slider"
                type="range"
                min={5}
                max={20}
                step={1}
                value={blockCount}
                onChange={(e) => setBlockCount(Number(e.target.value))}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-[#E5E0D5] dark:bg-[#303933] accent-[#1F4E3B]"
              />
            </div>

            {/* Color Theme Swatches */}
            <div className="mt-4">
              <div className="mb-2 text-xs font-bold text-[#1F2937] dark:text-white">Color Theme</div>
              <div className="flex items-center gap-2">
                {/* 1st swatch: 3D Wooden / Multi Natural Cube Icon */}
                <button
                  type="button"
                  onClick={() => setColorTheme('natural')}
                  aria-label="Natural multi-block theme"
                  className={`flex h-7 w-7 items-center justify-center rounded-full border transition cursor-pointer ${
                    colorTheme === 'natural'
                      ? 'border-[#1F4E3B] dark:border-white ring-2 ring-[#1F4E3B]/40 dark:ring-white/40'
                      : 'border-[#D5CFC2] dark:border-slate-600'
                  }`}
                  style={{
                    background: 'linear-gradient(135deg, #E2A463 0%, #C6833E 55%, #9B5F22 100%)',
                  }}
                >
                  <span className="block h-3.5 w-3.5 rounded-[2px] border border-[#7A4714] bg-[#D6924C]" />
                </button>

                {(
                  [
                    { id: 'red', hex: '#EF4444', label: 'Red theme' },
                    { id: 'orange', hex: '#F97316', label: 'Orange theme' },
                    { id: 'green', hex: '#22C55E', label: 'Green theme' },
                    { id: 'blue', hex: '#2563EB', label: 'Blue theme' },
                    { id: 'purple', hex: '#8B5CF6', label: 'Purple theme' },
                  ] as const
                ).map((swatch) => (
                  <button
                    key={swatch.id}
                    type="button"
                    onClick={() => setColorTheme(swatch.id)}
                    aria-label={swatch.label}
                    className={`h-7 w-7 rounded-full transition cursor-pointer ${
                      colorTheme === swatch.id
                        ? 'ring-2 ring-[#1F4E3B] dark:ring-white ring-offset-2 dark:ring-offset-[#181D1A]'
                        : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: swatch.hex }}
                  />
                ))}
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
            { mins: 1, title: '1 Minute', sub: 'Quick tasks' },
            { mins: 3, title: '3 Minutes', sub: 'Short activities' },
            { mins: 5, title: '5 Minutes', sub: 'Focus time' },
            { mins: 10, title: '10 Minutes', sub: 'Work breaks' },
            { mins: 15, title: '15 Minutes', sub: 'Longer sessions' },
          ].map((item) => {
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
                  <Clock className="h-4 w-4" />
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
          A blocks timer is useful for many everyday situations.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[
            {
              icon: GraduationCap,
              title: 'Classroom Activities',
              desc: 'Keep students engaged and on track.',
            },
            {
              icon: Users,
              title: 'Game Turns',
              desc: 'Manage turns and timed challenges.',
            },
            {
              icon: BookOpen,
              title: 'Study Sessions',
              desc: 'Stay focused and build good habits.',
            },
            {
              icon: Smile,
              title: "Children's Routines",
              desc: 'Make daily tasks fun and visual.',
            },
            {
              icon: Users,
              title: 'Group Activities',
              desc: 'Perfect for workshops, events and team games.',
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

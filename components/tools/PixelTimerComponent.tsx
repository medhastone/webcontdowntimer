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
  Settings,
  Gamepad2,
  Coffee,
  BookOpen,
  Users,
  Dumbbell,
  CalendarCheck,
  Flame,
  ChevronUp,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { playTimerSound } from '@/lib/sound';
import { requestWakeLock, releaseWakeLock } from '@/lib/wakelock';

type PixelStyle = 'retro-arcade' | '8bit-color' | 'monochrome' | 'minimal-grid';
type ColorThemeId = 'arcade-green' | 'ocean-blue' | 'magenta-pink' | 'coral-red' | 'amber-gold' | 'rainbow-8bit';
type InputMode = 'duration' | 'endtime';

interface ColorThemeOption {
  id: ColorThemeId;
  label: string;
  hex: string;
  isRainbow?: boolean;
}

const COLOR_THEMES: ColorThemeOption[] = [
  { id: 'arcade-green', label: 'Arcade Green', hex: '#22C55E' },
  { id: 'ocean-blue', label: 'Ocean Blue', hex: '#0EA5E9' },
  { id: 'magenta-pink', label: 'Magenta Pink', hex: '#DB2777' },
  { id: 'coral-red', label: 'Coral Red', hex: '#EF4444' },
  { id: 'amber-gold', label: 'Amber Gold', hex: '#F59E0B' },
  { id: 'rainbow-8bit', label: 'Rainbow 8-bit', hex: '#EC4899', isRainbow: true },
];

const EIGHT_BIT_SPECTRUM = [
  '#EF4444', // Red
  '#F97316', // Orange
  '#FACC15', // Yellow
  '#22C55E', // Green
  '#06B6D4', // Cyan
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#EC4899', // Magenta
];

const DENSITY_STEPS = [10, 12, 16, 20, 24, 30];

const PRESET_MINUTES = [1, 3, 5, 10, 15];

const QUICK_PRESETS = [
  { mins: 1, title: '1 Minute', sub: 'Quick tasks', icon: Gamepad2, isCustom: false },
  { mins: 3, title: '3 Minutes', sub: 'Short breaks', icon: Coffee, isCustom: false },
  { mins: 5, title: '5 Minutes', sub: 'Focus time', icon: Gamepad2, isCustom: false },
  { mins: 10, title: '10 Minutes', sub: 'Study sessions', icon: BookOpen, isCustom: false },
  { mins: 15, title: '15 Minutes', sub: 'Longer sessions', icon: Flame, isCustom: false },
  { mins: 0, title: 'Custom', sub: 'Set your own time', icon: Settings, isCustom: true },
];

const POPULAR_USES = [
  {
    title: 'Gaming Breaks',
    desc: 'Take regular breaks while gaming.',
    icon: Gamepad2,
  },
  {
    title: 'Study Sessions',
    desc: 'Stay focused and avoid distractions.',
    icon: BookOpen,
  },
  {
    title: 'Classroom Activities',
    desc: 'Great for teachers and group tasks.',
    icon: Users,
  },
  {
    title: 'Challenges',
    desc: 'Set timed challenges and build good habits.',
    icon: Dumbbell,
  },
  {
    title: 'Daily Routines',
    desc: 'Make daily tasks more fun and visual.',
    icon: CalendarCheck,
  },
];

// Authentic 4x7 blocky 8-bit pixel bitmap font for digits 0-9 and colon
const PIXEL_FONT_4X7: Record<string, string[]> = {
  '0': ['1111', '1001', '1001', '1001', '1001', '1001', '1111'],
  '1': ['0010', '0110', '0010', '0010', '0010', '0010', '0111'],
  '2': ['1111', '0001', '0001', '1111', '1000', '1000', '1111'],
  '3': ['1111', '0001', '0001', '1111', '0001', '0001', '1111'],
  '4': ['1001', '1001', '1001', '1111', '0001', '0001', '0001'],
  '5': ['1111', '1000', '1000', '1111', '0001', '0001', '1111'],
  '6': ['1111', '1000', '1000', '1111', '1001', '1001', '1111'],
  '7': ['1111', '0001', '0001', '0001', '0001', '0001', '0001'],
  '8': ['1111', '1001', '1001', '1111', '1001', '1001', '1111'],
  '9': ['1111', '1001', '1001', '1111', '0001', '0001', '1111'],
  ':': ['00', '00', '11', '00', '11', '00', '00'],
};

function PixelDigitReadout({
  text,
  pixelColor = '#FFFFFF',
  sizeClass = 'h-10 sm:h-12',
}: {
  text: string;
  pixelColor?: string;
  sizeClass?: string;
}) {
  const chars = text.split('');
  // Calculate total columns (4 cols per digit, 2 cols per colon, 1 col gap between chars)
  const columns: number[][] = [];
  chars.forEach((ch, idx) => {
    const bitmap = PIXEL_FONT_4X7[ch] || PIXEL_FONT_4X7['0'];
    const width = bitmap[0].length;
    for (let c = 0; c < width; c++) {
      const colBits: number[] = [];
      for (let r = 0; r < 7; r++) {
        colBits.push(bitmap[r][c] === '1' ? 1 : 0);
      }
      columns.push(colBits);
    }
    if (idx < chars.length - 1) {
      columns.push([0, 0, 0, 0, 0, 0, 0]);
    }
  });

  const totalCols = columns.length;
  const totalRows = 7;

  return (
    <svg
      viewBox={`0 0 ${totalCols} ${totalRows}`}
      className={`${sizeClass} w-auto block`}
      shapeRendering="crispEdges"
      aria-label={text}
    >
      {columns.map((col, cIdx) =>
        col.map((bit, rIdx) =>
          bit === 1 ? (
            <rect
              key={`${cIdx}-${rIdx}`}
              x={cIdx}
              y={rIdx}
              width={1}
              height={1}
              fill={pixelColor}
            />
          ) : null
        )
      )}
    </svg>
  );
}

export default function PixelTimerComponent() {
  const [inputMode, setInputMode] = useState<InputMode>('duration');
  const [durationMinutes, setDurationMinutes] = useState<number>(5);
  const [endTimeStr, setEndTimeStr] = useState<string>('12:30');
  // Initial preview state shows 05:00 with ~58% diagonal pixels lit matching mockup;
  // Selecting any preset or clicking Reset sets totalMs = remainingMs for 100% grid.
  const [totalMs, setTotalMs] = useState<number>(Math.round((5 * 60 * 1000) / 0.58));
  const [remainingMs, setRemainingMs] = useState<number>(5 * 60 * 1000);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Pixel Style & Appearance settings
  const [pixelStyle, setPixelStyle] = useState<PixelStyle>('retro-arcade');
  const [pixelDensity, setPixelDensity] = useState<number>(20);
  const [colorTheme, setColorTheme] = useState<ColorThemeId>('arcade-green');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showTime, setShowTime] = useState<boolean>(true);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const customInputRef = useRef<HTMLInputElement>(null);
  const endTimestampRef = useRef<number | null>(null);
  const remainingMsRef = useRef<number>(5 * 60 * 1000);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    remainingMsRef.current = remainingMs;
  }, [remainingMs]);

  const applyDurationMinutes = useCallback((mins: number) => {
    const safeMins = Math.max(1, Math.min(999, Math.round(mins || 1)));
    setDurationMinutes(safeMins);
    const ms = safeMins * 60 * 1000;
    setTotalMs(ms);
    setRemainingMs(ms);
    remainingMsRef.current = ms;
    setIsRunning(false);
    setIsCompleted(false);
    endTimestampRef.current = null;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  const applyEndTime = useCallback((timeVal: string) => {
    setEndTimeStr(timeVal);
    const parts = timeVal.split(':');
    if (parts.length !== 2) return;
    const targetHours = parseInt(parts[0], 10);
    const targetMinutes = parseInt(parts[1], 10);
    if (isNaN(targetHours) || isNaN(targetMinutes)) return;

    const now = new Date();
    const target = new Date();
    target.setHours(targetHours, targetMinutes, 0, 0);
    if (target.getTime() <= now.getTime()) {
      target.setDate(target.getDate() + 1);
    }
    const diffMs = Math.max(60 * 1000, target.getTime() - now.getTime());
    setTotalMs(diffMs);
    setRemainingMs(diffMs);
    remainingMsRef.current = diffMs;
    setDurationMinutes(Math.max(1, Math.round(diffMs / 60000)));
    setIsRunning(false);
    setIsCompleted(false);
    endTimestampRef.current = null;
  }, []);

  useEffect(() => {
    if (!isRunning) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      releaseWakeLock();
      return;
    }

    requestWakeLock();
    endTimestampRef.current = performance.now() + remainingMsRef.current;

    const tick = (now: number) => {
      if (!endTimestampRef.current) return;
      const left = Math.max(0, endTimestampRef.current - now);
      setRemainingMs(left);
      remainingMsRef.current = left;

      if (left <= 0) {
        setIsRunning(false);
        setIsCompleted(true);
        endTimestampRef.current = null;
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

  const handleStart = () => {
    if (remainingMs <= 0) {
      const fullMs = durationMinutes * 60 * 1000;
      setTotalMs(fullMs);
      setRemainingMs(fullMs);
      remainingMsRef.current = fullMs;
      setIsCompleted(false);
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsCompleted(false);
    const fullMs = durationMinutes * 60 * 1000;
    setTotalMs(fullMs);
    setRemainingMs(fullMs);
    remainingMsRef.current = fullMs;
    endTimestampRef.current = null;
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

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // Format MM:SS or HH:MM:SS
  const totalSecondsRemaining = Math.ceil(remainingMs / 1000);
  const hours = Math.floor(totalSecondsRemaining / 3600);
  const minutes = Math.floor((totalSecondsRemaining % 3600) / 60);
  const seconds = totalSecondsRemaining % 60;

  const formattedTime =
    hours > 0
      ? `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      : `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Synchronized fraction remaining (1.0 -> 0.0)
  const rawFraction = totalMs > 0 ? Math.max(0, Math.min(1, remainingMs / totalMs)) : 0;

  // Precompute diagonal ranking for every cell in the N x N matrix so pixels disappear progressively
  // from bottom-right toward top-left (matching the diagonal staircase wave in the mockup)
  const cellDiagonalOrder = useMemo(() => {
    const n = pixelDensity;
    const coords: { r: number; c: number; idx: number; diag: number }[] = [];
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        coords.push({ r, c, idx: r * n + c, diag: r + c });
      }
    }
    coords.sort((a, b) => {
      if (a.diag !== b.diag) return a.diag - b.diag;
      return a.r - b.r;
    });
    const rankMap = new Array<number>(n * n);
    coords.forEach((item, rank) => {
      rankMap[item.idx] = rank;
    });
    return rankMap;
  }, [pixelDensity]);

  const totalPixels = pixelDensity * pixelDensity;
  const activePixelCount = Math.ceil(rawFraction * totalPixels);

  const activeThemeObj = COLOR_THEMES.find((t) => t.id === colorTheme) || COLOR_THEMES[0];

  // Determine individual pixel fill color based on style, theme, and lit state
  const getPixelCellColor = (row: number, col: number, isLit: boolean): string => {
    const maxDiag = Math.max(1, (pixelDensity - 1) * 2);
    const diagRatio = (row + col) / maxDiag;

    if (pixelStyle === 'monochrome') {
      return isLit ? '#1E2421' : '#E2E6E3';
    }

    if (pixelStyle === 'minimal-grid') {
      if (!isLit) return '#E5E7EB';
      if (activeThemeObj.isRainbow) {
        const specIdx = Math.min(
          EIGHT_BIT_SPECTRUM.length - 1,
          Math.floor(diagRatio * EIGHT_BIT_SPECTRUM.length)
        );
        return EIGHT_BIT_SPECTRUM[specIdx];
      }
      return '#222825';
    }

    if (pixelStyle === '8bit-color' || activeThemeObj.isRainbow) {
      if (!isLit) return '#2B332F';
      const specIdx = Math.min(
        EIGHT_BIT_SPECTRUM.length - 1,
        Math.floor(diagRatio * EIGHT_BIT_SPECTRUM.length)
      );
      return EIGHT_BIT_SPECTRUM[specIdx];
    }

    // Default: 'retro-arcade'
    return isLit ? activeThemeObj.hex : '#2B332F';
  };

  // Render mini 6x6 pixel preview icons for the 2x2 Pixel Style selector cards
  const renderStyleMiniPreview = (style: PixelStyle) => {
    const miniSize = 7;
    if (style === 'retro-arcade') {
      return (
        <div className="w-14 h-14 mx-auto rounded-md bg-[#1C211E] p-1 border-2 border-[#2A312D] grid grid-cols-7 gap-[1.5px]">
          {Array.from({ length: miniSize * miniSize }).map((_, idx) => {
            const r = Math.floor(idx / miniSize);
            const c = idx % miniSize;
            const isLit = r + c < 7;
            return (
              <div
                key={idx}
                className="rounded-[1px]"
                style={{ backgroundColor: isLit ? '#22C55E' : '#2E3733' }}
              />
            );
          })}
        </div>
      );
    }

    if (style === '8bit-color') {
      return (
        <div className="w-14 h-14 mx-auto rounded-md bg-[#1C211E] p-1 border-2 border-[#2A312D] grid grid-cols-7 gap-[1.5px]">
          {Array.from({ length: miniSize * miniSize }).map((_, idx) => {
            const r = Math.floor(idx / miniSize);
            const c = idx % miniSize;
            const specIdx = Math.min(
              EIGHT_BIT_SPECTRUM.length - 1,
              Math.floor(((r + c) / 12) * EIGHT_BIT_SPECTRUM.length)
            );
            return (
              <div
                key={idx}
                className="rounded-[1px]"
                style={{ backgroundColor: EIGHT_BIT_SPECTRUM[specIdx] }}
              />
            );
          })}
        </div>
      );
    }

    if (style === 'monochrome') {
      return (
        <div className="w-14 h-14 mx-auto rounded-md bg-[#1C211E] p-1 border-2 border-[#2A312D] grid grid-cols-7 gap-[1.5px]">
          {Array.from({ length: miniSize * miniSize }).map((_, idx) => (
            <div key={idx} className="rounded-[1px] bg-white" />
          ))}
        </div>
      );
    }

    // minimal-grid
    return (
      <div className="w-14 h-14 mx-auto rounded-md bg-[#F4F5F4] p-1.5 border border-[#D5D9D6] grid grid-cols-5 gap-1">
        {Array.from({ length: 25 }).map((_, idx) => (
          <div key={idx} className="rounded-[1px] bg-[#252B27]" />
        ))}
      </div>
    );
  };

  const isLightMatrix = pixelStyle === 'monochrome' || pixelStyle === 'minimal-grid';

  return (
    <div className="space-y-10">
      {/* MAIN INTERACTIVE 3-COLUMN CARD */}
      <div className="bg-white dark:bg-[#1A201C] border border-[#E4E1D9] dark:border-[#2D352F] rounded-3xl p-5 sm:p-7 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-7 items-stretch">
          {/* LEFT COLUMN: Retro Pixel Matrix Stage (lg:col-span-5) */}
          <div
            ref={stageRef}
            className={`lg:col-span-5 rounded-2xl bg-[#F4F3EF] dark:bg-[#141916] border border-[#E8E5DD] dark:border-[#262E29] p-4 sm:p-6 flex flex-col items-center justify-center relative min-h-[360px] sm:min-h-[410px] ${
              isFullscreen ? 'timer-fullscreen-stage p-6 sm:p-12 bg-[#141816]' : ''
            }`}
          >
            {isFullscreen && (
              <button
                type="button"
                onClick={toggleFullscreen}
                className="fixed top-4 right-4 z-50 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/55 hover:bg-black/75 backdrop-blur-md border border-white/20 text-xs font-bold text-white shadow-lg cursor-pointer"
                aria-label="Exit Fullscreen"
              >
                <Minimize2 className="w-4 h-4" />
                <span>Exit Fullscreen</span>
              </button>
            )}

            {/* Outer Square Bezel Frame */}
            <div
              className={`w-full max-w-[330px] ${
                isFullscreen ? 'h-[78dvh] max-h-[580px] max-w-[580px]' : ''
              } aspect-square rounded-2xl p-3 sm:p-3.5 shadow-lg relative flex items-center justify-center ${
                isLightMatrix
                  ? 'bg-[#ECEEEB] dark:bg-[#242A27] border-[6px] border-[#CBD2CE] dark:border-[#37403B]'
                  : 'bg-[#222624] border-[8px] border-[#2C312E]'
              }`}
            >
              {/* Inner Pixel Grid Container */}
              <div
                className={`w-full h-full rounded-lg p-1.5 grid relative ${
                  isLightMatrix ? 'bg-[#F7F8F7]' : 'bg-[#151817]'
                }`}
                style={{
                  gridTemplateColumns: `repeat(${pixelDensity}, minmax(0, 1fr))`,
                  gap:
                    pixelStyle === 'minimal-grid'
                      ? pixelDensity >= 24
                        ? '3px'
                        : '4px'
                      : pixelDensity >= 24
                      ? '1.5px'
                      : '2px',
                }}
              >
                {Array.from({ length: totalPixels }).map((_, idx) => {
                  const r = Math.floor(idx / pixelDensity);
                  const c = idx % pixelDensity;
                  const rank = cellDiagonalOrder[idx];
                  const isLit = rank < activePixelCount;
                  const bgColor = getPixelCellColor(r, c, isLit);

                  return (
                    <div
                      key={idx}
                      className={`w-full h-full rounded-[1.5px] ${
                        reducedMotion ? '' : 'transition-colors duration-150'
                      }`}
                      style={{ backgroundColor: bgColor }}
                    />
                  );
                })}

                {/* Centered 8-Bit Digital Time Readout Box matching mockup */}
                {showTime && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div
                      className={`px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-md shadow-md flex flex-col items-center justify-center ${
                        isLightMatrix
                          ? 'bg-white/95 border-2 border-[#1E2421]'
                          : 'bg-[#1B201E]/95 border-2 border-[#151817]'
                      }`}
                    >
                      <PixelDigitReadout
                        text={formattedTime}
                        pixelColor={isLightMatrix ? '#1E2421' : '#FFFFFF'}
                        sizeClass={
                          isFullscreen
                            ? 'h-14 sm:h-20'
                            : hours > 0
                            ? 'h-7 sm:h-8'
                            : 'h-9 sm:h-11'
                        }
                      />
                      {isCompleted && (
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#22C55E] mt-1">
                          TIME UP!
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* MIDDLE COLUMN: Controls (lg:col-span-4) */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              {/* Segmented Tabs: Duration | End Time */}
              <div className="grid grid-cols-2 rounded-xl bg-[#F2F1EC] dark:bg-[#141916] p-1 border border-[#E4E1D9] dark:border-[#2A322C]">
                <button
                  type="button"
                  onClick={() => setInputMode('duration')}
                  className={`py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                    inputMode === 'duration'
                      ? 'bg-[#1F4E3B] text-white shadow-xs'
                      : 'text-[#252B27]/75 dark:text-slate-300 hover:text-[#252B27]'
                  }`}
                >
                  Duration
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInputMode('endtime');
                    applyEndTime(endTimeStr);
                  }}
                  className={`py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                    inputMode === 'endtime'
                      ? 'bg-[#1F4E3B] text-white shadow-xs'
                      : 'text-[#252B27]/75 dark:text-slate-300 hover:text-[#252B27]'
                  }`}
                >
                  End Time
                </button>
              </div>

              {inputMode === 'duration' ? (
                <>
                  {/* Preset Buttons: 1 min, 3 min, 5 min, 10 min, 15 min */}
                  <div className="grid grid-cols-5 gap-2">
                    {PRESET_MINUTES.map((mins) => {
                      const isActive = durationMinutes === mins;
                      return (
                        <button
                          key={mins}
                          type="button"
                          onClick={() => applyDurationMinutes(mins)}
                          className={`py-2 px-1 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                            isActive
                              ? 'bg-[#1F4E3B] text-white border-[#1F4E3B] shadow-2xs'
                              : 'bg-white dark:bg-[#222924] text-[#252B27] dark:text-slate-200 border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#365C4B]'
                          }`}
                        >
                          {mins} min
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Minutes Input with Up/Down Stepper */}
                  <div className="flex items-center gap-3">
                    <div className="relative flex items-center w-28 rounded-xl border border-[#E4E1D9] dark:border-[#2D352F] bg-white dark:bg-[#222924] px-3 py-2">
                      <input
                        ref={customInputRef}
                        type="number"
                        min={1}
                        max={999}
                        value={durationMinutes}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          if (!isNaN(val)) {
                            applyDurationMinutes(val);
                          }
                        }}
                        aria-label="Duration in minutes"
                        className="w-full text-sm font-semibold text-[#252B27] dark:text-white bg-transparent focus:outline-none appearance-none"
                      />
                      <div className="flex flex-col -my-1 ml-1">
                        <button
                          type="button"
                          aria-label="Increase minutes"
                          onClick={() => applyDurationMinutes(durationMinutes + 1)}
                          className="text-[#252B27]/60 hover:text-[#252B27] dark:text-slate-400 dark:hover:text-white cursor-pointer"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          aria-label="Decrease minutes"
                          onClick={() => applyDurationMinutes(Math.max(1, durationMinutes - 1))}
                          className="text-[#252B27]/60 hover:text-[#252B27] dark:text-slate-400 dark:hover:text-white cursor-pointer"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <span className="text-xs sm:text-sm text-[#252B27]/80 dark:text-slate-300">
                      minutes
                    </span>
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-[#252B27]/75 dark:text-slate-300">
                    Count down until clock time:
                  </label>
                  <input
                    type="time"
                    value={endTimeStr}
                    onChange={(e) => applyEndTime(e.target.value)}
                    className="w-full rounded-xl border border-[#E4E1D9] dark:border-[#2D352F] bg-white dark:bg-[#222924] px-3.5 py-2.5 text-sm font-semibold text-[#252B27] dark:text-white focus:outline-none focus:border-[#1F4E3B]"
                  />
                </div>
              )}

              {/* Primary Start Button */}
              <button
                type="button"
                onClick={isRunning ? handlePause : handleStart}
                className="w-full py-3.5 px-6 rounded-xl bg-[#1F4E3B] hover:bg-[#183F30] text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xs transition-all cursor-pointer"
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
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={isRunning ? handlePause : handleStart}
                  className="py-2.5 px-4 rounded-xl bg-[#F4F3EF] dark:bg-[#222924] hover:bg-[#EAE8E1] dark:hover:bg-[#2A332D] border border-[#E4E1D9] dark:border-[#2D352F] text-xs sm:text-sm font-semibold text-[#252B27] dark:text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause</span>
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="py-2.5 px-4 rounded-xl bg-[#F4F3EF] dark:bg-[#222924] hover:bg-[#EAE8E1] dark:hover:bg-[#2A332D] border border-[#E4E1D9] dark:border-[#2D352F] text-xs sm:text-sm font-semibold text-[#252B27] dark:text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Bottom Utility Toggles: Sound Alert, Fullscreen, Show Time */}
            <div className="pt-3 border-t border-[#E4E1D9] dark:border-[#2D352F] flex flex-wrap items-center justify-between gap-2 text-xs text-[#252B27]/85 dark:text-slate-300">
              {/* Sound Alert Toggle */}
              <div className="flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-[#1F4E3B] dark:text-[#5E917A]" />
                <span>Sound Alert</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={soundEnabled}
                  aria-label="Toggle sound alert"
                  onClick={() => setSoundEnabled((prev) => !prev)}
                  className={`w-8 h-4.5 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                    soundEnabled ? 'bg-[#1F4E3B]' : 'bg-gray-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                      soundEnabled ? 'translate-x-3.5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Fullscreen Button */}
              <button
                type="button"
                onClick={toggleFullscreen}
                className="inline-flex items-center gap-1.5 hover:text-[#1F4E3B] dark:hover:text-white transition-colors cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5 text-[#1F4E3B] dark:text-[#5E917A]" />
                <span>Fullscreen</span>
              </button>

              {/* Show Time Toggle */}
              <div className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-[#1F4E3B] dark:text-[#5E917A]" />
                <span>Show Time</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={showTime}
                  aria-label="Toggle show time"
                  onClick={() => setShowTime((prev) => !prev)}
                  className={`w-8 h-4.5 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                    showTime ? 'bg-[#1F4E3B]' : 'bg-gray-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                      showTime ? 'translate-x-3.5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Pixel Style, Pixel Density & Color Theme (lg:col-span-3) */}
          <div className="lg:col-span-3 lg:border-l border-[#E4E1D9] dark:border-[#2D352F] lg:pl-6 flex flex-col justify-between space-y-5">
            {/* Pixel Style 2x2 Grid */}
            <div>
              <span className="block text-xs font-bold text-[#252B27] dark:text-white mb-2.5">
                Pixel Style
              </span>
              <div className="grid grid-cols-2 gap-2.5">
                {(
                  [
                    { id: 'retro-arcade', label: 'Retro Arcade' },
                    { id: '8bit-color', label: '8-bit Color' },
                    { id: 'monochrome', label: 'Monochrome' },
                    { id: 'minimal-grid', label: 'Minimal Grid' },
                  ] as { id: PixelStyle; label: string }[]
                ).map((st) => {
                  const isSelected = pixelStyle === st.id;
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setPixelStyle(st.id)}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                        isSelected
                          ? 'bg-[#EEF5F1] dark:bg-[#213028] border-[#1F4E3B] ring-1 ring-[#1F4E3B]'
                          : 'bg-[#F9F8F6] dark:bg-[#222924] border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#365C4B]'
                      }`}
                    >
                      {renderStyleMiniPreview(st.id)}
                      <span className="text-[11px] font-semibold text-[#252B27] dark:text-slate-200">
                        {st.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pixel Density Slider (10x10 to 30x30) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-[#252B27] dark:text-white">
                  Pixel Density
                </span>
                <span className="text-xs font-semibold text-[#252B27] dark:text-slate-200 font-mono">
                  {pixelDensity} × {pixelDensity}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={DENSITY_STEPS.length - 1}
                step={1}
                value={Math.max(0, DENSITY_STEPS.indexOf(pixelDensity))}
                onChange={(e) => {
                  const idx = parseInt(e.target.value, 10);
                  setPixelDensity(DENSITY_STEPS[idx] || 20);
                }}
                aria-label="Pixel density"
                className="w-full accent-[#1F4E3B] cursor-pointer h-1.5 bg-[#E4E1D9] dark:bg-[#2D352F] rounded-lg"
              />
            </div>

            {/* Color Theme Swatches */}
            <div>
              <span className="block text-xs font-bold text-[#252B27] dark:text-white mb-2">
                Color Theme
              </span>
              <div className="flex items-center gap-2.5 flex-wrap">
                {COLOR_THEMES.map((c) => {
                  const isSelected = colorTheme === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      aria-label={`Select ${c.label}`}
                      onClick={() => setColorTheme(c.id)}
                      className={`w-7 h-7 rounded-full transition-transform cursor-pointer flex items-center justify-center ${
                        isSelected
                          ? 'ring-2 ring-offset-2 ring-[#1F4E3B] scale-105'
                          : 'hover:scale-105'
                      }`}
                      style={
                        c.isRainbow
                          ? {
                              background:
                                'conic-gradient(#EF4444, #F59E0B, #22C55E, #0EA5E9, #8B5CF6, #EC4899, #EF4444)',
                            }
                          : { backgroundColor: c.hex }
                      }
                    />
                  );
                })}
              </div>
            </div>

            {/* Reduced Motion Accessibility Toggle */}
            <div className="pt-2 border-t border-[#E4E1D9]/60 dark:border-[#2D352F] flex items-center justify-between text-xs text-[#252B27]/80 dark:text-slate-300">
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#1F4E3B] dark:text-[#5E917A]" />
                <span>Reduced Motion</span>
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={reducedMotion}
                aria-label="Toggle reduced motion"
                onClick={() => setReducedMotion((prev) => !prev)}
                className={`w-8 h-4.5 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                  reducedMotion ? 'bg-[#1F4E3B]' : 'bg-gray-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                    reducedMotion ? 'translate-x-3.5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK PRESETS ROW */}
      <div>
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#252B27] dark:text-white">
          Quick Presets
        </h2>
        <p className="text-xs sm:text-sm text-[#252B27]/70 dark:text-slate-400 mt-0.5 mb-4">
          Start with a common time or set a custom duration.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {QUICK_PRESETS.map((item) => {
            const isSelected = !item.isCustom && durationMinutes === item.mins && inputMode === 'duration';
            const IconComp = item.icon;
            return (
              <button
                key={item.title}
                type="button"
                onClick={() => {
                  setInputMode('duration');
                  if (item.isCustom) {
                    customInputRef.current?.focus();
                    customInputRef.current?.select();
                  } else {
                    applyDurationMinutes(item.mins);
                  }
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                  isSelected
                    ? 'bg-white dark:bg-[#1E2822] border-[#1F4E3B] ring-1 ring-[#1F4E3B] shadow-2xs'
                    : 'bg-white dark:bg-[#1A201C] border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#365C4B]'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    item.isCustom
                      ? 'bg-[#E7EDE7] dark:bg-[#252E28] text-[#1F4E3B] dark:text-[#5E917A]'
                      : 'bg-[#FEF3E6] dark:bg-[#2C241B] text-[#D97706]'
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-xs sm:text-sm text-[#252B27] dark:text-white truncate">
                    {item.title}
                  </div>
                  <div
                    className={`text-[11px] truncate ${
                      isSelected
                        ? 'text-[#1F4E3B] dark:text-[#5E917A] font-medium'
                        : 'text-[#252B27]/65 dark:text-slate-400'
                    }`}
                  >
                    {item.sub}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* POPULAR USES ROW */}
      <div className="rounded-3xl bg-[#EEF3EE]/70 dark:bg-[#18201B] border border-[#DCE5DC] dark:border-[#26312A] p-5 sm:p-6">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#252B27] dark:text-white">
          Popular Uses
        </h2>
        <p className="text-xs sm:text-sm text-[#252B27]/70 dark:text-slate-400 mt-0.5 mb-4">
          A pixel timer is useful for many everyday situations.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {POPULAR_USES.map((use) => {
            const IconComp = use.icon;
            return (
              <div
                key={use.title}
                className="bg-white dark:bg-[#1A201C] border border-[#E4E1D9] dark:border-[#2D352F] rounded-2xl p-4 flex items-start gap-3 shadow-2xs"
              >
                <div className="w-9 h-9 rounded-xl bg-[#E7EDE7] dark:bg-[#252E28] text-[#1F4E3B] dark:text-[#5E917A] flex items-center justify-center shrink-0 mt-0.5">
                  <IconComp className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-xs sm:text-sm text-[#252B27] dark:text-white mb-0.5">
                    {use.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#252B27]/70 dark:text-slate-400 leading-snug">
                    {use.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

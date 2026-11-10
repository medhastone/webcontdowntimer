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
  Briefcase,
  BookOpen,
  Users,
  GraduationCap,
  CalendarCheck,
  ChevronUp,
  ChevronDown,
  X,
} from 'lucide-react';
import { playTimerSound } from '@/lib/sound';
import { requestWakeLock, releaseWakeLock } from '@/lib/wakelock';

type DisplayStyle = 'horizontal' | 'vertical' | 'segmented' | 'thin-line';
type BarColorId = 'green' | 'blue' | 'coral' | 'amber' | 'purple' | 'rainbow';
type InputMode = 'duration' | 'endtime';

interface BarColorOption {
  id: BarColorId;
  label: string;
  hex: string;
  isRainbow?: boolean;
}

const BAR_COLORS: BarColorOption[] = [
  { id: 'green', label: 'Emerald Green', hex: '#22B567' },
  { id: 'blue', label: 'Ocean Blue', hex: '#0EA5E9' },
  { id: 'coral', label: 'Coral Red', hex: '#EF4444' },
  { id: 'amber', label: 'Amber Orange', hex: '#F59E0B' },
  { id: 'purple', label: 'Royal Purple', hex: '#8B5CF6' },
  { id: 'rainbow', label: 'Rainbow Gradient', hex: '#EC4899', isRainbow: true },
];

const PRESET_MINUTES = [1, 3, 5, 10, 15];

const QUICK_PRESETS = [
  { mins: 1, title: '1 Minute', sub: 'Quick tasks', isCustom: false },
  { mins: 3, title: '3 Minutes', sub: 'Short activities', isCustom: false },
  { mins: 5, title: '5 Minutes', sub: 'Focus time', isCustom: false },
  { mins: 10, title: '10 Minutes', sub: 'Work breaks', isCustom: false },
  { mins: 15, title: '15 Minutes', sub: 'Longer sessions', isCustom: false },
  { mins: 0, title: 'Custom', sub: 'Set your own time', isCustom: true },
];

const POPULAR_USES = [
  {
    title: 'Work and Productivity',
    desc: 'Stay focused and get more done.',
    icon: Briefcase,
  },
  {
    title: 'Study Sessions',
    desc: 'Manage study time effectively.',
    icon: BookOpen,
  },
  {
    title: 'Meetings and Presentations',
    desc: 'Keep sessions on track.',
    icon: Users,
  },
  {
    title: 'Classroom Activities',
    desc: 'Great for teachers and students.',
    icon: GraduationCap,
  },
  {
    title: 'Daily Routines',
    desc: 'Time your tasks with a clear visual.',
    icon: CalendarCheck,
  },
];

function formatCompactDuration(ms: number): string {
  const totalSec = Math.max(0, Math.round(ms / 1000));
  const hrs = Math.floor(totalSec / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;
  if (hrs > 0) {
    return `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

export default function ProgressTimerComponent() {
  const [inputMode, setInputMode] = useState<InputMode>('duration');
  const [durationMinutes, setDurationMinutes] = useState<number>(5);
  const [endTimeStr, setEndTimeStr] = useState<string>('12:30');
  const [totalMs, setTotalMs] = useState<number>(5 * 60 * 1000);
  const [remainingMs, setRemainingMs] = useState<number>(5 * 60 * 1000);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Task / Event label & Appearance settings
  const [taskLabel, setTaskLabel] = useState<string>('Study Session');
  const [displayStyle, setDisplayStyle] = useState<DisplayStyle>('horizontal');
  const [barColor, setBarColor] = useState<BarColorId>('green');
  const [warningPercent, setWarningPercent] = useState<number>(10);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showTime, setShowTime] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const customInputRef = useRef<HTMLInputElement>(null);
  const endTimestampRef = useRef<number | null>(null);
  const remainingMsRef = useRef<number>(5 * 60 * 1000);
  const warningFiredRef = useRef<boolean>(false);
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
    warningFiredRef.current = false;
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
    warningFiredRef.current = false;
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

      // Check warning threshold
      if (
        totalMs > 0 &&
        warningPercent > 0 &&
        !warningFiredRef.current &&
        left > 0 &&
        (left / totalMs) * 100 <= warningPercent
      ) {
        warningFiredRef.current = true;
        if (soundEnabled) {
          playTimerSound('beep', 0.55);
        }
      }

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
  }, [isRunning, soundEnabled, totalMs, warningPercent]);

  const handleStart = () => {
    if (remainingMs <= 0) {
      setRemainingMs(totalMs);
      remainingMsRef.current = totalMs;
      warningFiredRef.current = false;
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
    warningFiredRef.current = false;
    setRemainingMs(totalMs);
    remainingMsRef.current = totalMs;
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

  // Synchronized progress fraction (1.0 -> 0.0)
  const rawFraction = totalMs > 0 ? Math.max(0, Math.min(1, remainingMs / totalMs)) : 0;
  const remainingPercent = Math.round(rawFraction * 100);
  const elapsedMs = Math.max(0, totalMs - remainingMs);

  const activeColorObj = BAR_COLORS.find((c) => c.id === barColor) || BAR_COLORS[0];
  const isInWarningZone =
    warningPercent > 0 && remainingMs > 0 && rawFraction * 100 <= warningPercent;

  const fillStyle: React.CSSProperties = activeColorObj.isRainbow
    ? {
        background:
          'linear-gradient(90deg, #EF4444 0%, #F59E0B 22%, #22C55E 45%, #0EA5E9 68%, #8B5CF6 85%, #EC4899 100%)',
      }
    : {
        backgroundColor: isInWarningZone ? '#EF4444' : activeColorObj.hex,
      };

  // Render mini preview icons for Display Style 2x2 cards
  const renderStyleMiniPreview = (style: DisplayStyle) => {
    if (style === 'horizontal') {
      return (
        <div className="w-16 h-6 flex items-center justify-center mx-auto">
          <div className="w-14 h-3.5 rounded-full border border-[#1E7A4C] bg-white dark:bg-[#1A201C] overflow-hidden p-0.5">
            <div className="h-full w-[72%] rounded-full bg-[#1E7A4C]" />
          </div>
        </div>
      );
    }
    if (style === 'vertical') {
      return (
        <div className="w-16 h-6 flex items-center justify-center mx-auto">
          <div className="w-3.5 h-6 rounded-sm border border-[#334155] bg-white dark:bg-[#1A201C] overflow-hidden flex flex-col justify-end p-0.5">
            <div className="w-full h-[70%] rounded-xs bg-[#334155] dark:bg-gray-300" />
          </div>
        </div>
      );
    }
    if (style === 'segmented') {
      return (
        <div className="w-16 h-6 flex items-center justify-center gap-0.5 mx-auto">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className={`w-2.5 h-3 rounded-[2px] ${
                i < 4 ? 'bg-[#1F4E3B]' : 'bg-[#334155]'
              }`}
            />
          ))}
        </div>
      );
    }
    // thin-line
    return (
      <div className="w-16 h-6 flex items-center justify-center mx-auto">
        <div className="w-14 h-1 rounded-full bg-[#334155] dark:bg-gray-300" />
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* MAIN 3-COLUMN INTERACTIVE TOOL CARD */}
      <div className="bg-white dark:bg-[#171C19] rounded-2xl border border-[#E5E0D8] dark:border-[#2A302C] shadow-sm p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch w-full">
          {/* LEFT COLUMN: TASK INPUT + DIGITAL TIME + PROGRESS BAR STAGE (5 cols) */}
          <div className="lg:col-span-5 flex flex-col">
            <div
              ref={stageRef}
              className={`relative flex-1 min-h-[340px] sm:min-h-[380px] rounded-2xl bg-[#F8F8F6] dark:bg-[#1E2521] border border-[#ECEAE4] dark:border-[#2A332E] flex flex-col justify-between p-5 sm:p-6 overflow-hidden ${
                isFullscreen ? 'timer-fullscreen-stage p-8 sm:p-16 justify-center items-center' : ''
              }`}
            >
              {/* Top: Task / Event (optional) Input */}
              {!isFullscreen && (
              <div>
                <label
                  htmlFor="progress-task-input"
                  className="block text-xs font-medium text-[#4A5550] dark:text-[#9CA8A1] mb-1.5"
                >
                  Task / Event (optional)
                </label>
                <div className="relative flex items-center">
                  <input
                    id="progress-task-input"
                    type="text"
                    value={taskLabel}
                    onChange={(e) => setTaskLabel(e.target.value)}
                    placeholder="Enter task or event name..."
                    className="w-full rounded-xl bg-white dark:bg-[#171C19] border border-[#E2DDD5] dark:border-[#2E3832] px-3.5 py-2.5 pr-9 text-sm font-medium text-[#1A241E] dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#1F4E3B]"
                  />
                  {taskLabel && (
                    <button
                      type="button"
                      onClick={() => setTaskLabel('')}
                      aria-label="Clear task label"
                      className="absolute right-2.5 p-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              )}

              {/* Center & Bottom: Digital Countdown + Synchronized Progress Indicator */}
              {displayStyle === 'vertical' ? (
                <div className="flex items-center justify-center gap-8 my-4 py-2">
                  {/* Vertical Progress Bar */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative w-12 h-44 rounded-2xl bg-[#EAEAE6] dark:bg-[#2A332E] overflow-hidden flex flex-col justify-end border border-[#DFDDD6] dark:border-[#344039]">
                      <div
                        className="w-full transition-all duration-100 rounded-b-xl"
                        style={{
                          height: `${rawFraction * 100}%`,
                          ...fillStyle,
                        }}
                      />
                      <span className="absolute top-2 inset-x-0 text-center text-xs font-bold text-[#1A241E] dark:text-white drop-shadow-2xs">
                        {remainingPercent}%
                      </span>
                    </div>
                  </div>

                  {/* Digital Readout beside Vertical Bar */}
                  <div className="text-center">
                    {showTime && (
                      <>
                        <div className="font-mono text-5xl sm:text-[54px] font-bold tracking-tight text-[#1A241E] dark:text-white leading-none">
                          {formattedTime}
                        </div>
                        <div className="mt-2 text-xs sm:text-sm font-medium text-[#526058] dark:text-[#9BA8A0]">
                          {isCompleted ? 'Completed!' : 'Time Left'}
                        </div>
                      </>
                    )}
                    <div className="mt-4 space-y-1 text-xs text-[#4A5550] dark:text-[#9CA8A1]">
                      <div>
                        Elapsed:{' '}
                        <strong className="font-bold text-[#1A241E] dark:text-white">
                          {formatCompactDuration(elapsedMs)}
                        </strong>
                      </div>
                      <div>
                        Total:{' '}
                        <strong className="font-bold text-[#1A241E] dark:text-white">
                          {formatCompactDuration(totalMs)}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Center Digital Readout */}
                  <div className="my-4 text-center">
                    {showTime ? (
                      <>
                        <div className="font-mono text-5xl sm:text-[60px] font-bold tracking-tight text-[#1A241E] dark:text-white leading-none">
                          {formattedTime}
                        </div>
                        <div className="mt-2 text-xs sm:text-sm font-medium text-[#526058] dark:text-[#9BA8A0]">
                          {isCompleted ? 'Completed!' : 'Time Left'}
                        </div>
                      </>
                    ) : (
                      <div className="py-6 text-sm font-medium text-[#526058] dark:text-[#9BA8A0]">
                        {taskLabel || 'Countdown in progress'}
                      </div>
                    )}
                  </div>

                  {/* Bottom Progress Bar Area */}
                  <div className={`space-y-2.5 w-full ${isFullscreen ? 'max-w-4xl' : ''}`}>
                    {displayStyle === 'horizontal' && (
                      <div className="relative w-full h-11 rounded-full bg-[#EAEAE6] dark:bg-[#2A332E] overflow-hidden flex items-center">
                        <div
                          className="h-full transition-all duration-75 rounded-l-full"
                          style={{
                            width: `${rawFraction * 100}%`,
                            ...fillStyle,
                          }}
                        />
                        <span
                          className={`absolute right-4 text-sm font-bold tabular-nums ${
                            rawFraction > 0.88
                              ? 'text-white drop-shadow-2xs'
                              : 'text-[#1A241E] dark:text-white'
                          }`}
                        >
                          {remainingPercent}%
                        </span>
                      </div>
                    )}

                    {displayStyle === 'segmented' && (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-bold text-[#1A241E] dark:text-white">
                          <span>Remaining Progress</span>
                          <span>{remainingPercent}%</span>
                        </div>
                        <div className="grid grid-cols-10 gap-1.5 h-9">
                          {Array.from({ length: 10 }).map((_, idx) => {
                            const segThreshold = idx / 10;
                            const segFill = Math.max(
                              0,
                              Math.min(1, (rawFraction - segThreshold) * 10)
                            );
                            return (
                              <div
                                key={idx}
                                className="h-full rounded-lg bg-[#EAEAE6] dark:bg-[#2A332E] overflow-hidden"
                              >
                                <div
                                  className="h-full transition-all duration-75"
                                  style={{
                                    width: `${segFill * 100}%`,
                                    ...fillStyle,
                                  }}
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {displayStyle === 'thin-line' && (
                      <div className="space-y-2 py-1">
                        <div className="flex items-center justify-between text-xs font-bold text-[#1A241E] dark:text-white">
                          <span>Progress</span>
                          <span>{remainingPercent}%</span>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-[#EAEAE6] dark:bg-[#2A332E] overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-75"
                            style={{
                              width: `${rawFraction * 100}%`,
                              ...fillStyle,
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Elapsed & Total Readout Row */}
                    {!isFullscreen && (
                    <div className="flex items-center justify-between text-xs sm:text-sm text-[#4A5550] dark:text-[#9CA8A1] pt-0.5">
                      <span>
                        Elapsed:{' '}
                        <strong className="font-bold text-[#1A241E] dark:text-white tabular-nums">
                          {formatCompactDuration(elapsedMs)}
                        </strong>
                      </span>
                      <span>
                        Total:{' '}
                        <strong className="font-bold text-[#1A241E] dark:text-white tabular-nums">
                          {formatCompactDuration(totalMs)}
                        </strong>
                      </span>
                    </div>
                    )}
                  </div>
                </>
              )}

              {isFullscreen && (
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="fixed top-4 right-4 z-50 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-black/55 hover:bg-black/75 backdrop-blur-md border border-white/20 text-xs font-bold text-white shadow-lg transition cursor-pointer"
                  aria-label="Exit Fullscreen"
                >
                  <Minimize2 className="w-4 h-4" />
                  <span>Exit Fullscreen</span>
                </button>
              )}
            </div>
          </div>

          {/* MIDDLE COLUMN: DURATION & PLAYBACK CONTROLS (4 cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-5 py-1">
            <div className="space-y-4">
              {/* Duration / End Time Tabs */}
              <div className="grid grid-cols-2 bg-[#EFECE6] dark:bg-[#222925] p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setInputMode('duration')}
                  className={`py-2.5 text-sm font-semibold rounded-lg transition-all ${
                    inputMode === 'duration'
                      ? 'bg-[#1F4E3B] text-white shadow-xs'
                      : 'text-[#4A5550] dark:text-[#9CA8A1] hover:text-[#1A241E]'
                  }`}
                >
                  Duration
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode('endtime')}
                  className={`py-2.5 text-sm font-semibold rounded-lg transition-all ${
                    inputMode === 'endtime'
                      ? 'bg-[#1F4E3B] text-white shadow-xs'
                      : 'text-[#4A5550] dark:text-[#9CA8A1] hover:text-[#1A241E]'
                  }`}
                >
                  End Time
                </button>
              </div>

              {inputMode === 'duration' ? (
                <>
                  {/* Preset Pill Buttons: 1, 3, 5, 10, 15 min */}
                  <div className="grid grid-cols-5 gap-2">
                    {PRESET_MINUTES.map((mins) => {
                      const active = durationMinutes === mins && totalMs === mins * 60 * 1000;
                      return (
                        <button
                          key={mins}
                          type="button"
                          onClick={() => applyDurationMinutes(mins)}
                          className={`py-2 px-1 rounded-lg text-xs sm:text-sm font-semibold border transition-all ${
                            active
                              ? 'bg-[#1F4E3B] text-white border-[#1F4E3B]'
                              : 'bg-[#F8F7F4] dark:bg-[#222925] text-[#2C3631] dark:text-gray-200 border-[#E5E0D8] dark:border-[#2E3832] hover:border-[#1F4E3B]/40'
                          }`}
                        >
                          {mins} min
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Minutes Stepper Input */}
                  <div className="flex items-center gap-3 pt-1">
                    <div className="relative flex items-center w-28 bg-[#F8F7F4] dark:bg-[#222925] border border-[#E2DDD5] dark:border-[#2E3832] rounded-xl px-3 py-2">
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
                          } else {
                            setDurationMinutes(1);
                          }
                        }}
                        className="w-full bg-transparent text-base font-semibold text-[#1A241E] dark:text-white focus:outline-none appearance-none"
                        aria-label="Duration in minutes"
                      />
                      <div className="flex flex-col -my-1 ml-1">
                        <button
                          type="button"
                          onClick={() => applyDurationMinutes(durationMinutes + 1)}
                          className="text-gray-500 hover:text-gray-800 dark:hover:text-white p-0.5"
                          aria-label="Increase minutes"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => applyDurationMinutes(Math.max(1, durationMinutes - 1))}
                          className="text-gray-500 hover:text-gray-800 dark:hover:text-white p-0.5"
                          aria-label="Decrease minutes"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-[#4A5550] dark:text-[#9CA8A1]">
                      minutes
                    </span>
                  </div>
                </>
              ) : (
                <div className="space-y-2 pt-1">
                  <label className="block text-xs font-medium text-[#526058] dark:text-gray-400">
                    Count down until clock reaches:
                  </label>
                  <input
                    type="time"
                    value={endTimeStr}
                    onChange={(e) => applyEndTime(e.target.value)}
                    className="w-full rounded-xl border border-[#E2DDD5] dark:border-[#2E3832] bg-[#F8F7F4] dark:bg-[#222925] px-3.5 py-2.5 text-base font-semibold text-[#1A241E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1F4E3B]"
                  />
                </div>
              )}

              {/* Primary Start Button */}
              <button
                type="button"
                onClick={isRunning ? handlePause : handleStart}
                className="w-full py-3.5 px-6 rounded-xl bg-[#1F4E3B] hover:bg-[#183E2F] text-white font-semibold text-base shadow-xs flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
              >
                {isRunning ? (
                  <>
                    <Pause className="w-5 h-5 fill-current" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" />
                    {remainingMs < totalMs && remainingMs > 0 ? 'Resume' : 'Start'}
                  </>
                )}
              </button>

              {/* Secondary Pause + Reset Row */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={isRunning ? handlePause : handleStart}
                  className="py-2.5 px-4 rounded-xl bg-[#EFECE6] dark:bg-[#222925] hover:bg-[#E5E0D8] dark:hover:bg-[#2B332E] text-[#1A241E] dark:text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Pause className="w-4 h-4" />
                  Pause
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="py-2.5 px-4 rounded-xl bg-[#EFECE6] dark:bg-[#222925] hover:bg-[#E5E0D8] dark:hover:bg-[#2B332E] text-[#1A241E] dark:text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
              </div>
            </div>

            {/* Bottom Utility Toggles: Sound Alert | Fullscreen | Show Time */}
            <div className="pt-3 border-t border-[#EFECE6] dark:border-[#262E29] flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-[#4A5550] dark:text-[#9CA8A1]">
              {/* Sound Alert */}
              <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
                <Bell className="w-3.5 h-3.5 text-[#4A5550] dark:text-gray-400" />
                <span>Sound Alert</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={soundEnabled}
                  onClick={() => setSoundEnabled((prev) => !prev)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    soundEnabled ? 'bg-[#1F4E3B]' : 'bg-gray-300 dark:bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                      soundEnabled ? 'translate-x-4.5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </label>

              {/* Fullscreen */}
              <button
                type="button"
                onClick={toggleFullscreen}
                className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-[#F4F1EA] dark:hover:bg-[#222925] transition-colors cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Fullscreen</span>
              </button>

              {/* Show Time */}
              <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
                <Eye className="w-3.5 h-3.5 text-[#4A5550] dark:text-gray-400" />
                <span>Show Time</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={showTime}
                  onClick={() => setShowTime((prev) => !prev)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    showTime ? 'bg-[#1F4E3B]' : 'bg-gray-300 dark:bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                      showTime ? 'translate-x-4.5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </label>
            </div>
          </div>

          {/* RIGHT COLUMN: DISPLAY STYLE, BAR COLOR & WARNING ALERT (3 cols) */}
          <div className="lg:col-span-3 flex flex-col justify-between rounded-2xl bg-[#FAF9F6] dark:bg-[#1C221F] border border-[#ECE8E0] dark:border-[#28312C] p-4 space-y-4">
            {/* Display Style (2x2 Grid) */}
            <div>
              <h3 className="text-xs font-bold text-[#1A241E] dark:text-white mb-2.5">
                Display Style
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
                {(
                  [
                    { id: 'horizontal', label: 'Horizontal Bar' },
                    { id: 'vertical', label: 'Vertical Bar' },
                    { id: 'segmented', label: 'Segmented Bar' },
                    { id: 'thin-line', label: 'Thin Line' },
                  ] as { id: DisplayStyle; label: string }[]
                ).map((item) => {
                  const selected = displayStyle === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setDisplayStyle(item.id)}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        selected
                          ? 'bg-[#EEF6F1] dark:bg-[#1F352B] border-[#1E7A4C] ring-1 ring-[#1E7A4C]'
                          : 'bg-white dark:bg-[#222925] border-[#E5E0D8] dark:border-[#2E3832] hover:border-[#1E7A4C]/50'
                      }`}
                    >
                      {renderStyleMiniPreview(item.id)}
                      <span className="mt-1.5 text-xs font-semibold text-[#1A241E] dark:text-gray-200">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bar Color Swatches */}
            <div>
              <h4 className="text-xs font-bold text-[#1A241E] dark:text-white mb-2">
                Bar Color
              </h4>
              <div className="flex items-center justify-between gap-1.5">
                {BAR_COLORS.map((color) => {
                  const selected = barColor === color.id;
                  return (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => setBarColor(color.id)}
                      title={color.label}
                      aria-label={color.label}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform cursor-pointer ${
                        selected
                          ? 'ring-2 ring-offset-2 ring-[#1F4E3B] scale-105'
                          : 'hover:scale-105'
                      }`}
                      style={{
                        background: color.isRainbow
                          ? 'conic-gradient(#EF4444, #F59E0B, #22C55E, #06B6D4, #6366F1, #EC4899, #EF4444)'
                          : color.hex,
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Warning Alert Percentage */}
            <div>
              <label
                htmlFor="warning-alert-percent"
                className="block text-xs font-bold text-[#1A241E] dark:text-white mb-1.5"
              >
                Warning Alert
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="warning-alert-percent"
                  type="number"
                  min={0}
                  max={90}
                  value={warningPercent}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setWarningPercent(isNaN(val) ? 0 : Math.max(0, Math.min(90, val)));
                  }}
                  className="w-16 rounded-lg bg-white dark:bg-[#222925] border border-[#E2DDD5] dark:border-[#2E3832] px-2.5 py-1.5 text-xs font-semibold text-[#1A241E] dark:text-white focus:outline-none focus:border-[#1F4E3B]"
                />
                <span className="text-xs font-semibold text-[#4A5550] dark:text-gray-300">
                  %
                </span>
              </div>
              <p className="mt-1.5 text-[11px] text-[#526058] dark:text-gray-400 leading-snug">
                Play a sound when remaining time reaches this percentage.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK PRESETS SECTION */}
      <section aria-labelledby="quick-presets-heading" className="space-y-3">
        <div>
          <h2
            id="quick-presets-heading"
            className="text-xl font-bold font-serif text-[#1A241E] dark:text-white"
          >
            Quick Presets
          </h2>
          <p className="text-sm text-[#526058] dark:text-gray-400">
            Start with a common time or set a custom duration.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {QUICK_PRESETS.map((item) => {
            const isSelected =
              !item.isCustom &&
              durationMinutes === item.mins &&
              totalMs === item.mins * 60 * 1000;
            return (
              <button
                key={item.title}
                type="button"
                onClick={() => {
                  if (item.isCustom) {
                    setInputMode('duration');
                    customInputRef.current?.focus();
                    customInputRef.current?.select();
                  } else {
                    setInputMode('duration');
                    applyDurationMinutes(item.mins);
                  }
                }}
                className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#EEF6F1] dark:bg-[#1F352B] border-[#1E7A4C] shadow-2xs'
                    : 'bg-white dark:bg-[#171C19] border-[#E5E0D8] dark:border-[#2A302C] hover:border-[#1E7A4C]/50'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                    item.isCustom
                      ? 'bg-[#EAF3EE] text-[#1F4E3B] dark:bg-[#25352C] dark:text-[#6EE7B7]'
                      : 'bg-[#FFF3E6] text-[#D97706] dark:bg-[#2F261B] dark:text-[#FBBF24]'
                  }`}
                >
                  {item.isCustom ? (
                    <Settings className="w-4 h-4" />
                  ) : (
                    <Clock className="w-4 h-4" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-[#1A241E] dark:text-white truncate">
                    {item.title}
                  </div>
                  <div
                    className={`text-xs truncate ${
                      isSelected
                        ? 'text-[#1E7A4C] dark:text-[#6EE7B7] font-medium'
                        : 'text-[#526058] dark:text-gray-400'
                    }`}
                  >
                    {item.sub}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* POPULAR USES SECTION */}
      <section
        aria-labelledby="popular-uses-heading"
        className="rounded-2xl bg-[#EEF3EE] dark:bg-[#19211C] border border-[#DCE5DD] dark:border-[#26322B] p-5 sm:p-6 space-y-4"
      >
        <div>
          <h2
            id="popular-uses-heading"
            className="text-xl font-bold font-serif text-[#1A241E] dark:text-white"
          >
            Popular Uses
          </h2>
          <p className="text-sm text-[#526058] dark:text-gray-400">
            A progress timer is useful for many everyday situations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {POPULAR_USES.map((use) => {
            const IconComponent = use.icon;
            return (
              <div
                key={use.title}
                className="bg-white dark:bg-[#1F2723] rounded-xl p-4 border border-[#E4EAE4] dark:border-[#2C3831] flex items-start gap-3 shadow-2xs"
              >
                <div className="w-10 h-10 rounded-xl bg-[#EAF3EE] dark:bg-[#26382E] text-[#1F4E3B] dark:text-[#6EE7B7] flex items-center justify-center shrink-0">
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1A241E] dark:text-white">
                    {use.title}
                  </h3>
                  <p className="text-xs text-[#526058] dark:text-gray-400 mt-0.5 leading-relaxed">
                    {use.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

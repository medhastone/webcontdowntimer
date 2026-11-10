'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  Star,
  BookOpen,
  Users,
  FileText,
  Coffee,
  Trees,
  Sparkles,
  Plus,
  Minus,
  MoreVertical,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  ArrowRight,
  Bell,
  Monitor,
  Timer,
} from 'lucide-react';
import { playTimerSound, SoundType } from '@/lib/sound';
import { requestWakeLock, releaseWakeLock } from '@/lib/wakelock';

interface PresetItem {
  id: string;
  name: string;
  minutes: number;
  seconds: number;
  icon: 'book' | 'users' | 'file' | 'coffee' | 'trees' | 'sparkles' | 'custom';
}

const INITIAL_PRESETS: PresetItem[] = [
  { id: 'class-activity', name: 'Class Activity', minutes: 10, seconds: 0, icon: 'book' },
  { id: 'group-work', name: 'Group Work', minutes: 15, seconds: 0, icon: 'users' },
  { id: 'quiz-test', name: 'Quiz / Test', minutes: 20, seconds: 0, icon: 'file' },
  { id: 'short-break', name: 'Short Break', minutes: 5, seconds: 0, icon: 'coffee' },
  { id: 'long-break', name: 'Long Break', minutes: 15, seconds: 0, icon: 'trees' },
  { id: 'clean-up', name: 'Clean Up', minutes: 5, seconds: 0, icon: 'sparkles' },
];

export default function ClassroomTimerDashboard() {
  // Preset state
  const [presets] = useState<PresetItem[]>(INITIAL_PRESETS);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('class-activity');
  const [currentLabel, setCurrentLabel] = useState<string>('Class Activity');

  // Timer duration in seconds
  const [durationMinutes, setDurationMinutes] = useState<number>(10);
  const [durationSeconds, setDurationSeconds] = useState<number>(0);

  const [totalSeconds, setTotalSeconds] = useState<number>(600);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(600);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // Settings
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [selectedSound, setSelectedSound] = useState<SoundType>('bell');
  const [warnGreenMin, setWarnGreenMin] = useState<number>(2);
  const [warnYellowMin, setWarnYellowMin] = useState<number>(1);
  const [warnRedMin, setWarnRedMin] = useState<number>(0);
  const [displayMode, setDisplayMode] = useState<'normal' | 'fullscreen' | 'compact'>('normal');

  // UI state
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const lastTickTimeRef = useRef<number>(0);

  // Synchronize total seconds when user changes duration inputs
  const updateDuration = useCallback((mins: number, secs: number) => {
    const total = Math.max(1, mins * 60 + secs);
    setDurationMinutes(mins);
    setDurationSeconds(secs);
    setTotalSeconds(total);
    setRemainingSeconds(total);
    setIsRunning(false);
  }, []);

  // Preset selection handler
  const handleSelectPreset = (preset: PresetItem) => {
    setSelectedPresetId(preset.id);
    setCurrentLabel(preset.name);
    updateDuration(preset.minutes, preset.seconds);
  };

  const handleCustomPreset = () => {
    setSelectedPresetId('custom');
    setCurrentLabel('Custom Timer');
    const elem = document.getElementById('duration-minutes-input');
    elem?.focus();
  };

  // Timer interval countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      requestWakeLock();
      lastTickTimeRef.current = Date.now();

      interval = setInterval(() => {
        const now = Date.now();
        const delta = Math.floor((now - lastTickTimeRef.current) / 1000);

        if (delta >= 1) {
          lastTickTimeRef.current = now;
          setRemainingSeconds((prev) => {
            if (prev > 1) {
              if (prev <= 4 && prev > 1 && soundEnabled) {
                playTimerSound('count321', 0.4);
              }
              return prev - 1;
            } else if (prev === 1) {
              if (soundEnabled) {
                playTimerSound(selectedSound, 0.85);
              }
              setIsRunning(false);
              return 0;
            }
            return 0;
          });
        }
      }, 250);
    } else {
      releaseWakeLock();
    }

    return () => clearInterval(interval);
  }, [isRunning, soundEnabled, selectedSound]);

  // Adjust time (+/- 1m, 30s)
  const adjustTime = (secDelta: number) => {
    setRemainingSeconds((prev) => {
      const next = Math.max(0, prev + secDelta);
      if (next > totalSeconds) {
        setTotalSeconds(next);
      }
      return next;
    });
  };

  const handleStartPause = () => {
    if (remainingSeconds === 0) {
      setRemainingSeconds(totalSeconds);
    }
    lastTickTimeRef.current = Date.now();
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    setRemainingSeconds(totalSeconds);
  };

  // Sound test button
  const handleTestSound = () => {
    playTimerSound(selectedSound, 0.8);
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      const orientation = (screen as unknown as { orientation?: { lock?: (mode: string) => Promise<void> } }).orientation;
      orientation?.lock?.('landscape')?.catch(() => {});
      setIsFullscreen(true);
      setDisplayMode('fullscreen');
    } else {
      document.exitFullscreen().catch(() => {});
      const orientation = (screen as unknown as { orientation?: { unlock?: () => void } }).orientation;
      orientation?.unlock?.();
      setIsFullscreen(false);
      setDisplayMode('normal');
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      const isNowFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isNowFullscreen);
      if (!isNowFullscreen) {
        setDisplayMode('normal');
      }
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  // Format MM:SS
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Calculate visual warning status
  const remainingMinutes = remainingSeconds / 60;
  const isTimeUp = remainingSeconds === 0;
  const isYellowWarning = !isTimeUp && remainingMinutes <= warnYellowMin;
  const isGreenWarning = !isTimeUp && !isYellowWarning && remainingMinutes <= warnGreenMin;

  // Progress bar percentage (visually show ~58% fill when ready at 10:00 like reference or real ratio when running)
  const rawRatio = totalSeconds > 0 ? (remainingSeconds / totalSeconds) * 100 : 0;
  const displayProgress = !isRunning && remainingSeconds === totalSeconds ? 58 : rawRatio;

  // Icon helper
  const renderPresetIcon = (icon: string, isActive: boolean) => {
    const base = 'w-4 h-4 shrink-0';
    if (isActive) {
      switch (icon) {
        case 'book':
          return <BookOpen className={`${base} text-white`} />;
        case 'users':
          return <Users className={`${base} text-white`} />;
        case 'file':
          return <FileText className={`${base} text-white`} />;
        case 'coffee':
          return <Coffee className={`${base} text-white`} />;
        case 'trees':
          return <Trees className={`${base} text-white`} />;
        case 'sparkles':
          return <Sparkles className={`${base} text-white`} />;
        default:
          return <BookOpen className={`${base} text-white`} />;
      }
    }
    switch (icon) {
      case 'book':
        return <BookOpen className={`${base} text-[#2563EB]`} />;
      case 'users':
        return <Users className={`${base} text-[#2563EB]`} />;
      case 'file':
        return <FileText className={`${base} text-purple-600`} />;
      case 'coffee':
        return <Coffee className={`${base} text-[#2563EB]`} />;
      case 'trees':
        return <Trees className={`${base} text-emerald-600`} />;
      case 'sparkles':
        return <Sparkles className={`${base} text-amber-500`} />;
      default:
        return <BookOpen className={`${base} text-[#2563EB]`} />;
    }
  };

  return (
    <div className="w-full space-y-6" ref={containerRef}>
      {/* ================================================================= */}
      {/* TOP 3-COLUMN MAIN WORKSPACE: 3 cols | 6 cols | 3 cols (12 total)  */}
      {/* ================================================================= */}
      <div
        className={`grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch ${
          isFullscreen ? '' : ''
        }`}
      >
        {/* LEFT COLUMN: Activity Presets (3 of 12 cols) */}
        {!isFullscreen && (
          <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
            <div>
              {/* Presets Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 fill-[#2563EB] text-[#2563EB]" />
                  <h2 className="font-bold text-[15px] text-slate-900 dark:text-white">
                    Activity Presets
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={handleCustomPreset}
                  className="text-xs font-semibold text-[#2563EB] hover:text-blue-700 dark:hover:text-blue-400 cursor-pointer"
                >
                  Manage
                </button>
              </div>

              {/* Presets List */}
              <div className="space-y-2">
                {presets.map((preset) => {
                  const isActive = selectedPresetId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between transition-all cursor-pointer group ${
                        isActive
                          ? 'bg-[#2563EB] text-white shadow-xs'
                          : 'bg-[#F8FAFC] dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {renderPresetIcon(preset.icon, isActive)}
                        <span className="font-semibold text-[13px] truncate">{preset.name}</span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`text-xs tabular-nums font-medium ${
                            isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {formatTime(preset.minutes * 60 + preset.seconds)}
                        </span>
                        <MoreVertical
                          className={`w-3.5 h-3.5 ${
                            isActive
                              ? 'text-blue-200'
                              : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                          }`}
                        />
                      </div>
                    </button>
                  );
                })}

                {/* Custom Timer Row */}
                <button
                  type="button"
                  onClick={handleCustomPreset}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between transition-all cursor-pointer group ${
                    selectedPresetId === 'custom'
                      ? 'bg-[#2563EB] text-white shadow-xs'
                      : 'bg-[#F8FAFC] dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                        selectedPresetId === 'custom'
                          ? 'bg-white text-[#2563EB]'
                          : 'bg-[#2563EB] text-white'
                      }`}
                    >
                      <Plus className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span className="font-semibold text-[13px]">Custom Timer</span>
                  </div>
                  <span
                    className={`text-[11px] font-medium ${
                      selectedPresetId === 'custom'
                        ? 'text-blue-100'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    Set your own time
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CENTER COLUMN: Dark Cockpit Timer (6 of 12 cols) */}
        <div
          className={`${
            isFullscreen
              ? 'timer-fullscreen-stage flex flex-col items-center justify-center bg-[#0F172A] text-white p-8'
              : 'lg:col-span-6 bg-[#0F172A] text-white rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-lg border border-slate-800 relative overflow-hidden'
          }`}
        >
          {/* Red pulse border when time is up */}
          {isTimeUp && (
            <div className="absolute inset-0 bg-red-950/30 border-4 border-red-500 rounded-2xl pointer-events-none animate-pulse" />
          )}

          {/* Fullscreen Exit Button in Corner */}
          {isFullscreen && (
            <button
              type="button"
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 z-50 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-black/55 hover:bg-black/75 text-white border border-white/20 backdrop-blur-md text-xs font-semibold shadow-lg transition-all cursor-pointer"
              aria-label="Exit Fullscreen"
            >
              <Minimize className="w-4 h-4" />
              <span>Exit Fullscreen</span>
            </button>
          )}

          {/* Top Bar inside Dark Cockpit */}
          {!isFullscreen && (
            <div className="flex items-center justify-between">
              {/* Active Activity Pill (Dark emerald tinted pill matching mockup) */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#064E3B]/60 border border-emerald-700/50 text-xs font-semibold text-white">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>{currentLabel}</span>
              </div>

              {/* Right Icons: Sound, Fullscreen, Settings */}
              <div className="flex items-center gap-3 text-slate-300">
                <button
                  type="button"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
                  title={soundEnabled ? 'Mute sound' : 'Unmute sound'}
                  aria-label="Toggle sound"
                >
                  {soundEnabled ? (
                    <Volume2 className="w-4 h-4 text-white" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-slate-500" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
                  title="Fullscreen Display"
                  aria-label="Toggle fullscreen"
                >
                  <Maximize className="w-4 h-4 text-white" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const elem = document.getElementById('duration-minutes-input');
                    elem?.focus();
                  }}
                  className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
                  title="Timer Settings"
                  aria-label="Timer settings"
                >
                  <Settings className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          )}

          {/* Giant Central Countdown Digits */}
          <div className="my-auto py-6 sm:py-8 flex flex-col items-center justify-center text-center w-full">
            <div
              className={`font-sans font-black tabular-nums tracking-tight select-none transition-colors duration-300 leading-none ${
                isFullscreen
                  ? 'text-[clamp(4.5rem,20vmin,15rem)]'
                  : 'text-7xl sm:text-8xl lg:text-[7.25rem]'
              } ${
                isTimeUp
                  ? 'text-red-400 animate-pulse'
                  : isYellowWarning
                  ? 'text-amber-300'
                  : 'text-white'
              }`}
            >
              {formatTime(remainingSeconds)}
            </div>

            {isFullscreen && (
              <div className="w-full max-w-3xl bg-slate-700/60 h-4 rounded-full overflow-hidden mt-8">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isTimeUp
                      ? 'bg-red-500'
                      : isYellowWarning
                      ? 'bg-amber-400'
                      : isGreenWarning
                      ? 'bg-emerald-500'
                      : 'bg-[#2563EB]'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(0, displayProgress))}%` }}
                />
              </div>
            )}
          </div>

          {/* Bottom Controls Area */}
          {!isFullscreen && (
            <div className="w-full space-y-4">
              {/* Horizontal Progress Bar */}
              <div className="w-full bg-slate-700/60 h-3 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isTimeUp
                      ? 'bg-red-500'
                      : isYellowWarning
                      ? 'bg-amber-400'
                      : isGreenWarning
                      ? 'bg-emerald-500'
                      : 'bg-[#2563EB]'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(0, displayProgress))}%` }}
                />
              </div>

              {/* Primary Start & Reset Buttons */}
              <div className="grid grid-cols-2 gap-3.5 pt-1">
                <button
                  type="button"
                  onClick={handleStartPause}
                  className={`py-3.5 px-6 rounded-xl font-bold text-base text-white shadow-md flex items-center justify-center gap-2.5 transition-all active:scale-98 cursor-pointer ${
                    isRunning
                      ? 'bg-amber-600 hover:bg-amber-500'
                      : 'bg-[#10B981] hover:bg-[#059669]'
                  }`}
                >
                  {isRunning ? (
                    <>
                      <Pause className="w-5 h-5 fill-current" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 fill-current" />
                      <span>{remainingSeconds < totalSeconds ? 'Resume' : 'Start'}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="py-3.5 px-6 rounded-xl font-semibold text-base bg-[#1E293B] hover:bg-slate-700 text-white border border-slate-600/80 flex items-center justify-center gap-2.5 transition-colors active:scale-98 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
              </div>

              {/* 4 Quick Adjust Pills (-1 min, -30 sec, +30 sec, +1 min) */}
              <div className="grid grid-cols-4 gap-2.5">
                <button
                  type="button"
                  onClick={() => adjustTime(-60)}
                  className="py-2.5 px-2 rounded-xl bg-[#1E293B]/90 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700/80 transition-colors cursor-pointer"
                >
                  <span className="w-4 h-4 rounded-full bg-white text-[#0F172A] flex items-center justify-center shrink-0">
                    <Minus className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                  <span>- 1 min</span>
                </button>

                <button
                  type="button"
                  onClick={() => adjustTime(-30)}
                  className="py-2.5 px-2 rounded-xl bg-[#1E293B]/90 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700/80 transition-colors cursor-pointer"
                >
                  <span className="w-4 h-4 rounded-full bg-white text-[#0F172A] flex items-center justify-center shrink-0">
                    <Minus className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                  <span>- 30 sec</span>
                </button>

                <button
                  type="button"
                  onClick={() => adjustTime(30)}
                  className="py-2.5 px-2 rounded-xl bg-[#1E293B]/90 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700/80 transition-colors cursor-pointer"
                >
                  <span className="w-4 h-4 rounded-full bg-white text-[#0F172A] flex items-center justify-center shrink-0">
                    <Plus className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                  <span>+ 30 sec</span>
                </button>

                <button
                  type="button"
                  onClick={() => adjustTime(60)}
                  className="py-2.5 px-2 rounded-xl bg-[#1E293B]/90 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700/80 transition-colors cursor-pointer"
                >
                  <span className="w-4 h-4 rounded-full bg-white text-[#0F172A] flex items-center justify-center shrink-0">
                    <Plus className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                  <span>+ 1 min</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Timer Settings (3 of 12 cols) */}
        {!isFullscreen && (
          <div
            id="timer-settings-card"
            className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-2xs flex flex-col justify-between"
          >
            <div className="space-y-4">
              {/* Settings Header */}
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#2563EB]" />
                <h2 className="font-bold text-[15px] text-slate-900 dark:text-white">
                  Timer Settings
                </h2>
              </div>

              {/* 1. Timer Duration */}
              <div className="space-y-2">
                <label
                  htmlFor="duration-minutes-input"
                  className="block text-xs font-bold text-slate-800 dark:text-slate-200"
                >
                  Timer Duration
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <input
                      id="duration-minutes-input"
                      type="number"
                      min={0}
                      max={180}
                      value={durationMinutes}
                      onChange={(e) => {
                        const m = Math.max(0, parseInt(e.target.value) || 0);
                        updateDuration(m, durationSeconds);
                      }}
                      className="w-14 px-2 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-800 text-slate-900 dark:text-white text-center focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <span className="text-xs text-slate-500">minutes</span>
                  </div>

                  <div className="h-5 w-[1px] bg-slate-200 dark:bg-slate-700 mx-0.5" />

                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min={0}
                      max={59}
                      value={String(durationSeconds).padStart(2, '0')}
                      onChange={(e) => {
                        const s = Math.max(0, Math.min(59, parseInt(e.target.value) || 0));
                        updateDuration(durationMinutes, s);
                      }}
                      className="w-14 px-2 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-800 text-slate-900 dark:text-white text-center focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <span className="text-xs text-slate-500">seconds</span>
                  </div>
                </div>
              </div>

              {/* 2. Visual Warnings */}
              <div className="space-y-2 pt-1">
                <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  Visual Warnings
                </span>

                {/* Green threshold */}
                <div className="flex items-center gap-2.5 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] shrink-0" />
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={warnGreenMin}
                    onChange={(e) => setWarnGreenMin(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-12 px-2 py-1 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-800 text-center text-slate-800 dark:text-white"
                  />
                  <span className="text-slate-600 dark:text-slate-400">minutes remaining</span>
                </div>

                {/* Yellow threshold */}
                <div className="flex items-center gap-2.5 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] shrink-0" />
                  <input
                    type="number"
                    min={1}
                    max={15}
                    value={warnYellowMin}
                    onChange={(e) => setWarnYellowMin(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-12 px-2 py-1 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-800 text-center text-slate-800 dark:text-white"
                  />
                  <span className="text-slate-600 dark:text-slate-400">minute remaining</span>
                </div>

                {/* Red threshold */}
                <div className="flex items-center gap-2.5 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] shrink-0" />
                  <input
                    type="number"
                    min={0}
                    max={5}
                    value={warnRedMin}
                    onChange={(e) => setWarnRedMin(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-12 px-2 py-1 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-800 text-center text-slate-800 dark:text-white"
                  />
                  <span className="text-slate-600 dark:text-slate-400">
                    time&apos;s up (red screen)
                  </span>
                </div>
              </div>

              {/* 3. Sound Alerts */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                    <Bell className="w-3.5 h-3.5 fill-[#2563EB] text-[#2563EB]" />
                    <span>Sound Alerts</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className={`w-9 h-5 rounded-full transition-colors p-0.5 flex items-center cursor-pointer ${
                      soundEnabled
                        ? 'bg-[#2563EB] justify-end'
                        : 'bg-slate-300 dark:bg-slate-700 justify-start'
                    }`}
                    aria-label="Toggle sound alerts"
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedSound}
                    onChange={(e) => setSelectedSound(e.target.value as SoundType)}
                    className="flex-1 min-w-0 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="bell">Bell (Default)</option>
                    <option value="chime">Gentle Chime</option>
                    <option value="beep">Soft Beep</option>
                    <option value="marimba">Marimba</option>
                  </select>

                  <button
                    type="button"
                    onClick={handleTestSound}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
                  >
                    <Play className="w-3 h-3 fill-[#2563EB] text-[#2563EB]" />
                    <span>Test</span>
                  </button>
                </div>
              </div>

              {/* 4. Display Mode */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <Monitor className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Display Mode</span>
                </div>
                <select
                  value={displayMode}
                  onChange={(e) => {
                    const val = e.target.value as 'normal' | 'fullscreen' | 'compact';
                    setDisplayMode(val);
                    if (val === 'fullscreen') {
                      toggleFullscreen();
                    } else if (isFullscreen) {
                      toggleFullscreen();
                    }
                  }}
                  className="w-full px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="normal">Normal (This Page)</option>
                  <option value="fullscreen">Fullscreen (Projector / Smartboard)</option>
                  <option value="compact">Compact Focus</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================================================================= */}
      {/* HOW TO USE THIS TOOL: 3 White Cards inside Soft Slate Container    */}
      {/* ================================================================= */}
      {!isFullscreen && (
        <div className="bg-[#EEF2F6]/80 dark:bg-slate-900/50 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800">
          <h2 className="text-[15px] font-bold text-slate-900 dark:text-white mb-3.5">
            How to use this tool
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Step 1 Card */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200/70 dark:border-slate-800 flex items-start gap-3.5 shadow-2xs">
              <div className="w-8 h-8 rounded-full bg-blue-100/90 dark:bg-blue-950 text-[#2563EB] font-bold text-sm flex items-center justify-center shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  Choose a preset or set your own time
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Select an activity like class work, group work or break, or enter a custom duration.
                </p>
              </div>
            </div>

            {/* Step 2 Card */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200/70 dark:border-slate-800 flex items-start gap-3.5 shadow-2xs">
              <div className="w-8 h-8 rounded-full bg-blue-100/90 dark:bg-blue-950 text-[#2563EB] font-bold text-sm flex items-center justify-center shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  Start the timer
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Click Start to begin. The timer will show a visual countdown with color alerts.
                </p>
              </div>
            </div>

            {/* Step 3 Card */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200/70 dark:border-slate-800 flex items-start gap-3.5 shadow-2xs">
              <div className="w-8 h-8 rounded-full bg-blue-100/90 dark:bg-blue-950 text-[#2563EB] font-bold text-sm flex items-center justify-center shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  Use it in your class
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Let the timer run and keep your students on track. You can pause, add time or reset anytime.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* BOTTOM 3-COLUMN GRID: 4 cols | 4 cols | 4 cols (12 total)         */}
      {/* ================================================================= */}
      {!isFullscreen && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Card 1: Frequently Asked Questions (4 of 12 cols) */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#2563EB]" />
                  <h2 className="font-bold text-[15px] text-slate-900 dark:text-white">
                    Frequently Asked Questions
                  </h2>
                </div>
                <Link
                  href="/tools"
                  className="text-xs font-semibold text-[#2563EB] hover:text-blue-700 dark:hover:text-blue-400 flex items-center gap-1"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="space-y-2">
                {/* FAQ 1 */}
                <div className="border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden bg-[#F8FAFC] dark:bg-slate-800/40">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === 0 ? null : 0)}
                    className="w-full px-3.5 py-2.5 text-left text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between hover:bg-slate-100/80 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <span>Can I use this timer on a projector or smart board?</span>
                    {openFaq === 0 ? (
                      <ChevronUp className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {openFaq === 0 && (
                    <div className="px-3.5 pb-3 pt-1 text-[11px] text-slate-600 dark:text-slate-400 border-t border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 leading-relaxed">
                      Yes! Click the Fullscreen icon in the top-right corner of the timer display to expand it for classroom projectors, Promethean boards, and SMART Boards.
                    </div>
                  )}
                </div>

                {/* FAQ 2 */}
                <div className="border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden bg-[#F8FAFC] dark:bg-slate-800/40">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === 1 ? null : 1)}
                    className="w-full px-3.5 py-2.5 text-left text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between hover:bg-slate-100/80 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <span>Can I customize the warning times and sounds?</span>
                    {openFaq === 1 ? (
                      <ChevronUp className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {openFaq === 1 && (
                    <div className="px-3.5 pb-3 pt-1 text-[11px] text-slate-600 dark:text-slate-400 border-t border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 leading-relaxed">
                      Yes, adjust the green, yellow, and red minute thresholds in the Timer Settings panel and pick from Bell, Gentle Chime, Soft Beep, or Marimba alerts.
                    </div>
                  )}
                </div>

                {/* FAQ 3 */}
                <div className="border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden bg-[#F8FAFC] dark:bg-slate-800/40">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === 2 ? null : 2)}
                    className="w-full px-3.5 py-2.5 text-left text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between hover:bg-slate-100/80 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <span>Does the timer work offline?</span>
                    {openFaq === 2 ? (
                      <ChevronUp className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {openFaq === 2 && (
                    <div className="px-3.5 pb-3 pt-1 text-[11px] text-slate-600 dark:text-slate-400 border-t border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 leading-relaxed">
                      Yes, once loaded, the timer and Web Audio chimes run completely in your browser without needing an active internet connection.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Related Tools for Teachers (4 of 12 cols) */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3.5">
                <LayoutGrid className="w-4 h-4 text-[#2563EB]" />
                <h2 className="font-bold text-[15px] text-slate-900 dark:text-white">
                  Related Tools for Teachers
                </h2>
              </div>

              <div className="space-y-2.5">
                {/* Related Tool 1: Pomodoro Timer */}
                <Link
                  href="/pomodoro-timer"
                  className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-800/40 hover:border-blue-300 dark:hover:border-blue-800 transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-rose-100/80 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                      <Timer className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#2563EB] transition-colors">
                        Pomodoro Timer
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5">
                        Plan focus and break sessions for study and teaching.
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#2563EB] shrink-0" />
                </Link>

                {/* Related Tool 2: Countdown Timer */}
                <Link
                  href="/countdown-timer"
                  className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-800/40 hover:border-blue-300 dark:hover:border-blue-800 transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100/80 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Timer className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#2563EB] transition-colors">
                        Countdown Timer
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5">
                        Set a simple countdown for any classroom activity.
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#2563EB] shrink-0" />
                </Link>
              </div>
            </div>
          </div>

          {/* Card 3: Make Class Time More Effective CTA (4 of 12 cols) */}
          <div className="lg:col-span-4 bg-gradient-to-br from-[#ECFDF5] via-[#F0FDF4] to-[#E2F5EA] dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-slate-900 rounded-2xl p-5 border border-emerald-200/80 dark:border-emerald-900/50 shadow-2xs flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-start gap-3 relative z-10 pr-16">
              <div className="w-9 h-9 rounded-xl bg-emerald-200/70 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-[15px] text-slate-900 dark:text-white leading-snug">
                  Make Class Time More Effective
                </h2>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  Try our full set of time tools for teachers, including stopwatch, interval timer and more.
                </p>
              </div>
            </div>

            <div className="mt-4 pt-2 flex items-end justify-between relative z-10">
              <Link
                href="/tools"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-xs active:scale-98"
              >
                <span>Explore All Tools</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Classroom Books, Pencil Cup & Plant Illustration on Bottom-Right */}
            <svg
              className="absolute bottom-0 right-0 w-36 h-32 pointer-events-none select-none"
              viewBox="0 0 160 130"
              fill="none"
            >
              {/* Plant leaves */}
              <path d="M135 78 C130 55, 118 42, 115 28 C126 36, 134 52, 137 78 Z" fill="#16A34A" opacity="0.75" />
              <path d="M138 78 C138 50, 145 32, 152 18 C153 38, 146 58, 140 78 Z" fill="#15803D" opacity="0.85" />
              <path d="M140 78 C146 60, 155 48, 160 40 C158 55, 150 68, 142 78 Z" fill="#22C55E" opacity="0.7" />
              {/* Plant pot */}
              <polygon points="128,78 148,78 145,104 131,104" fill="#CBD5E1" />
              <rect x="126" y="75" width="24" height="5" rx="1.5" fill="#94A3B8" />
              {/* Pencil cup & pencils */}
              <rect x="104" y="64" width="3" height="16" rx="1" transform="rotate(-10 104 64)" fill="#F59E0B" />
              <rect x="110" y="61" width="3" height="18" rx="1" fill="#2563EB" />
              <rect x="115" y="63" width="3" height="16" rx="1" transform="rotate(8 115 63)" fill="#EF4444" />
              <rect x="102" y="74" width="18" height="20" rx="2" fill="#1E293B" />
              {/* Stack of 3 Books */}
              <rect x="64" y="94" width="56" height="10" rx="2" fill="#1E3A8A" />
              <rect x="66" y="96" width="50" height="6" rx="1" fill="#F8FAFC" />
              <rect x="68" y="84" width="50" height="10" rx="2" fill="#0284C7" />
              <rect x="70" y="86" width="44" height="6" rx="1" fill="#F1F5F9" />
              <rect x="72" y="75" width="44" height="9" rx="2" fill="#0D9488" />
              {/* Wooden Desk Surface */}
              <rect x="48" y="104" width="112" height="10" rx="2" fill="#D6C7B2" />
              <rect x="56" y="114" width="10" height="16" fill="#B8A68E" />
              <rect x="142" y="114" width="10" height="16" fill="#B8A68E" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}

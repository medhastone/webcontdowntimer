'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { playTimerSound } from '@/lib/sound';
import { requestWakeLock, releaseWakeLock } from '@/lib/wakelock';
import {
  Play,
  Pause,
  RotateCcw,
  Coffee,
  Umbrella,
  Settings,
  Clock,
  Minus,
  Plus,
  Maximize2,
  Minimize2,
} from 'lucide-react';

export type PomodoroMode = 'pomodoro' | 'shortBreak' | 'longBreak' | 'custom';

export default function PomodoroTimerComponent() {
  // Mode & configuration state
  const [activeMode, setActiveMode] = useState<PomodoroMode>('pomodoro');
  const [workDurationMin, setWorkDurationMin] = useState<number>(25);
  const [shortBreakMin, setShortBreakMin] = useState<number>(5);
  const [longBreakMin, setLongBreakMin] = useState<number>(15);
  const [sessionsUntilLongBreak, setSessionsUntilLongBreak] = useState<number>(4);

  // Toggle settings
  const [autoStartBreaks, setAutoStartBreaks] = useState<boolean>(false);
  const [tickingSound, setTickingSound] = useState<boolean>(true);
  const [notificationAlert, setNotificationAlert] = useState<boolean>(true);

  // Runtime timer state
  const [remainingSeconds, setRemainingSeconds] = useState<number>(25 * 60);
  const [totalSeconds, setTotalSeconds] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completedSessions, setCompletedSessions] = useState<number>(0);

  // Active quick preset index (0 for 25/5 Classic Pomodoro)
  const [activePresetIndex, setActivePresetIndex] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      const orientation = (screen as unknown as { orientation?: { lock?: (mode: string) => Promise<void> } }).orientation;
      orientation?.lock?.('landscape')?.catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      const orientation = (screen as unknown as { orientation?: { unlock?: () => void } }).orientation;
      orientation?.unlock?.();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const onFs = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  // Ticking audio synthesizer using Web Audio API
  const tickAudioCtxRef = useRef<AudioContext | null>(null);
  const lastTickSecRef = useRef<number>(0);

  const playSoftTick = useCallback(() => {
    if (!tickingSound || typeof window === 'undefined') return;
    try {
      if (!tickAudioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        tickAudioCtxRef.current = new AudioCtx();
      }
      const ctx = tickAudioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1000, ctx.currentTime);
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // Audio fallback silent
    }
  }, [tickingSound]);

  const getDurationForMode = useCallback(
    (mode: PomodoroMode) => {
      switch (mode) {
        case 'pomodoro':
          return workDurationMin * 60;
        case 'shortBreak':
          return shortBreakMin * 60;
        case 'longBreak':
          return longBreakMin * 60;
        case 'custom':
        default:
          return workDurationMin * 60;
      }
    },
    [workDurationMin, shortBreakMin, longBreakMin]
  );

  // Switch mode handler
  const handleSelectMode = (mode: PomodoroMode) => {
    setIsRunning(false);
    setActiveMode(mode);
    const sec = getDurationForMode(mode);
    setRemainingSeconds(sec);
    setTotalSeconds(sec);
  };

  // Timer interval handling with delta calculation
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      requestWakeLock();
      lastTickSecRef.current = Date.now();

      interval = setInterval(() => {
        const now = Date.now();
        const deltaSec = Math.floor((now - lastTickSecRef.current) / 1000);

        if (deltaSec >= 1) {
          lastTickSecRef.current = now;
          playSoftTick();

          setRemainingSeconds((prev) => {
            if (prev > 1) {
              return prev - 1;
            } else if (prev === 1) {
              // Completed
              if (notificationAlert) {
                playTimerSound('bell', 0.8);
              }

              if (activeMode === 'pomodoro') {
                const nextCount = completedSessions + 1;
                setCompletedSessions(nextCount);

                const nextMode = nextCount % sessionsUntilLongBreak === 0 ? 'longBreak' : 'shortBreak';
                setActiveMode(nextMode);
                const nextSec = nextMode === 'longBreak' ? longBreakMin * 60 : shortBreakMin * 60;
                setTotalSeconds(nextSec);

                if (!autoStartBreaks) {
                  setIsRunning(false);
                }
                return nextSec;
              } else {
                // Break ended -> Back to Pomodoro
                setActiveMode('pomodoro');
                const workSec = workDurationMin * 60;
                setTotalSeconds(workSec);
                if (!autoStartBreaks) {
                  setIsRunning(false);
                }
                return workSec;
              }
            }
            return 0;
          });
        }
      }, 500);
    } else {
      releaseWakeLock();
    }

    return () => clearInterval(interval);
  }, [
    isRunning,
    activeMode,
    workDurationMin,
    shortBreakMin,
    longBreakMin,
    sessionsUntilLongBreak,
    autoStartBreaks,
    tickingSound,
    notificationAlert,
    completedSessions,
    playSoftTick,
  ]);

  const handleStartPause = () => {
    if (remainingSeconds <= 0) {
      const sec = getDurationForMode(activeMode);
      setRemainingSeconds(sec);
      setTotalSeconds(sec);
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    const sec = getDurationForMode(activeMode);
    setRemainingSeconds(sec);
    setTotalSeconds(sec);
  };

  // Quick Preset Selector
  const presets = [
    { icon: '🍅', label: '25 / 5', sublabel: 'Classic Pomodoro', work: 25, short: 5 },
    { icon: '📦', label: '50 / 10', sublabel: 'Deep Work', work: 50, short: 10 },
    { icon: '🎓', label: '15 / 5', sublabel: 'Study Session', work: 15, short: 5 },
    { icon: '💼', label: '30 / 10', sublabel: 'Balanced', work: 30, short: 10 },
    { icon: '⚙', label: 'Custom', sublabel: 'Set your own time', work: workDurationMin, short: shortBreakMin },
  ];

  const handleSelectPreset = (index: number) => {
    setActivePresetIndex(index);
    const p = presets[index];
    if (p.label !== 'Custom') {
      setWorkDurationMin(p.work);
      setShortBreakMin(p.short);
      setIsRunning(false);
      setActiveMode('pomodoro');
      setRemainingSeconds(p.work * 60);
      setTotalSeconds(p.work * 60);
    } else {
      setActiveMode('custom');
    }
  };

  // Stepper handlers
  const updateWorkMin = (delta: number) => {
    const val = Math.max(1, Math.min(120, workDurationMin + delta));
    setWorkDurationMin(val);
    if (activeMode === 'pomodoro' || activeMode === 'custom') {
      setIsRunning(false);
      setRemainingSeconds(val * 60);
      setTotalSeconds(val * 60);
    }
  };

  const updateShortBreakMin = (delta: number) => {
    const val = Math.max(1, Math.min(60, shortBreakMin + delta));
    setShortBreakMin(val);
    if (activeMode === 'shortBreak') {
      setIsRunning(false);
      setRemainingSeconds(val * 60);
      setTotalSeconds(val * 60);
    }
  };

  const updateLongBreakMin = (delta: number) => {
    const val = Math.max(1, Math.min(90, longBreakMin + delta));
    setLongBreakMin(val);
    if (activeMode === 'longBreak') {
      setIsRunning(false);
      setRemainingSeconds(val * 60);
      setTotalSeconds(val * 60);
    }
  };

  const updateSessionsCount = (delta: number) => {
    const val = Math.max(1, Math.min(12, sessionsUntilLongBreak + delta));
    setSessionsUntilLongBreak(val);
  };

  // Formatted MM:SS
  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;
  const formattedMinutes = String(mins).padStart(2, '0');
  const formattedSeconds = String(secs).padStart(2, '0');

  // Ring geometry
  const radius = 95;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = totalSeconds > 0 ? Math.min(1, Math.max(0, remainingSeconds / totalSeconds)) : 1;
  const strokeDashoffset = circumference - progressRatio * circumference;

  return (
    <div className="space-y-8">
      {/* 1. Main 3-Panel Tool Card matching screenshot */}
      <div className="bg-white dark:bg-[#1A201C] rounded-3xl border border-[#E4E1D9] dark:border-[#2D352F] p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Mode Selector Tabs (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-2">
            {/* Pomodoro */}
            <button
              type="button"
              onClick={() => handleSelectMode('pomodoro')}
              className={`w-full p-3.5 rounded-2xl flex items-center gap-3 font-semibold text-sm transition-all text-left cursor-pointer ${
                activeMode === 'pomodoro'
                  ? 'bg-[#365C4B] text-white shadow-xs'
                  : 'bg-transparent text-[#252B27] dark:text-slate-200 hover:bg-[#E7EDE7]/60 dark:hover:bg-[#252E28]'
              }`}
            >
              <span className="text-lg">🍅</span>
              <span>Pomodoro</span>
            </button>

            {/* Short Break */}
            <button
              type="button"
              onClick={() => handleSelectMode('shortBreak')}
              className={`w-full p-3.5 rounded-2xl flex items-center gap-3 font-semibold text-sm transition-all text-left cursor-pointer ${
                activeMode === 'shortBreak'
                  ? 'bg-[#365C4B] text-white shadow-xs'
                  : 'bg-transparent text-[#252B27] dark:text-slate-200 hover:bg-[#E7EDE7]/60 dark:hover:bg-[#252E28]'
              }`}
            >
              <Coffee className="w-5 h-5 text-current" />
              <span>Short Break</span>
            </button>

            {/* Long Break */}
            <button
              type="button"
              onClick={() => handleSelectMode('longBreak')}
              className={`w-full p-3.5 rounded-2xl flex items-center gap-3 font-semibold text-sm transition-all text-left cursor-pointer ${
                activeMode === 'longBreak'
                  ? 'bg-[#365C4B] text-white shadow-xs'
                  : 'bg-transparent text-[#252B27] dark:text-slate-200 hover:bg-[#E7EDE7]/60 dark:hover:bg-[#252E28]'
              }`}
            >
              <Umbrella className="w-5 h-5 text-current" />
              <span>Long Break</span>
            </button>

            {/* Custom */}
            <button
              type="button"
              onClick={() => handleSelectMode('custom')}
              className={`w-full p-3.5 rounded-2xl flex items-center gap-3 font-semibold text-sm transition-all text-left cursor-pointer ${
                activeMode === 'custom'
                  ? 'bg-[#365C4B] text-white shadow-xs'
                  : 'bg-transparent text-[#252B27] dark:text-slate-200 hover:bg-[#E7EDE7]/60 dark:hover:bg-[#252E28]'
              }`}
            >
              <Settings className="w-5 h-5 text-current" />
              <span>Custom</span>
            </button>
          </div>

          {/* Center Column: The Circular Dial & Primary Controls (5 cols) */}
          <div
            className={`${
              isFullscreen
                ? 'timer-fullscreen-stage flex flex-col items-center justify-center bg-[#0D1310] text-white'
                : 'lg:col-span-5 flex flex-col items-center justify-center border-y lg:border-y-0 lg:border-x border-[#E4E1D9] dark:border-[#2D352F] py-6 lg:py-2 lg:px-6 relative'
            }`}
          >
            {isFullscreen ? (
              <button
                type="button"
                onClick={toggleFullscreen}
                className="absolute top-4 right-4 z-50 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-black/55 hover:bg-black/75 text-white border border-white/20 backdrop-blur-md text-xs font-semibold shadow-lg transition-all cursor-pointer"
                aria-label="Exit Fullscreen"
              >
                <Minimize2 className="w-4 h-4" />
                <span>Exit Fullscreen</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={toggleFullscreen}
                className="absolute top-2 right-2 p-2 rounded-xl text-[#252B27]/60 dark:text-slate-400 hover:bg-[#F7F6F2] dark:hover:bg-[#252E28] transition-colors cursor-pointer"
                title="Fullscreen"
                aria-label="Enter Fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            )}

            <div className={`relative ${isFullscreen ? 'w-[75vmin] h-[75vmin]' : 'w-64 h-64'} flex items-center justify-center`}>
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 240 240" shapeRendering="geometricPrecision">
                {/* Background track circle */}
                <circle
                  cx="120"
                  cy="120"
                  r={radius}
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="12"
                  className={isFullscreen ? 'text-white/15' : 'text-[#E7EDE7] dark:text-[#26312B]'}
                />
                {/* Progress arc */}
                <circle
                  cx="120"
                  cy="120"
                  r={radius}
                  fill="transparent"
                  stroke={activeMode === 'pomodoro' ? '#5E917A' : '#B7804C'}
                  strokeWidth="12"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-300 ease-out"
                />
              </svg>

              {/* Inside circle content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                {!isFullscreen && (
                  <div className="text-2xl mb-1">
                    {activeMode === 'pomodoro' ? '🍅' : activeMode === 'shortBreak' ? '☕' : '🏖'}
                  </div>
                )}
                <div className={`font-mono font-bold tracking-tight tabular-nums ${isFullscreen ? 'text-[clamp(2.5rem,14vmin,8rem)] text-white' : 'text-5xl sm:text-6xl text-[#252B27] dark:text-white'}`}>
                  {formattedMinutes}:{formattedSeconds}
                </div>
                {!isFullscreen && (
                  <div className="text-xs font-medium text-[#252B27]/70 dark:text-slate-400 mt-1 uppercase tracking-wider">
                    {activeMode === 'pomodoro'
                      ? 'Focus Time'
                      : activeMode === 'shortBreak'
                      ? 'Short Break'
                      : 'Long Break'}
                  </div>
                )}
              </div>
            </div>

            {/* Buttons row matching reference screenshot */}
            {!isFullscreen && (
              <div className="flex items-center gap-3 mt-6 w-full max-w-xs justify-center">
                <button
                  type="button"
                  onClick={handleStartPause}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-[#365C4B] hover:bg-[#2b4a3c] text-white font-medium text-sm sm:text-base shadow-sm transition-all cursor-pointer"
                >
                  {isRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                  <span>{isRunning ? 'Pause' : 'Start'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl border border-[#E4E1D9] dark:border-[#2D352F] bg-white dark:bg-[#1A201C] hover:bg-[#F7F6F2] dark:hover:bg-[#252D28] text-[#252B27] dark:text-slate-200 text-sm font-medium transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Duration Inputs & Toggle Settings (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Top segmented tab indicator */}
            <div className="flex items-center p-1 bg-[#F7F6F2] dark:bg-[#252D28] rounded-xl text-xs font-medium text-center">
              <button
                type="button"
                onClick={() => handleSelectMode('pomodoro')}
                className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeMode === 'pomodoro'
                    ? 'bg-[#365C4B] text-white font-semibold shadow-xs'
                    : 'text-[#252B27]/70 dark:text-slate-300'
                }`}
              >
                Pomodoro
              </button>
              <button
                type="button"
                onClick={() => handleSelectMode('shortBreak')}
                className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeMode === 'shortBreak'
                    ? 'bg-[#365C4B] text-white font-semibold shadow-xs'
                    : 'text-[#252B27]/70 dark:text-slate-300'
                }`}
              >
                Short Break
              </button>
              <button
                type="button"
                onClick={() => handleSelectMode('longBreak')}
                className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeMode === 'longBreak'
                    ? 'bg-[#365C4B] text-white font-semibold shadow-xs'
                    : 'text-[#252B27]/70 dark:text-slate-300'
                }`}
              >
                Long Break
              </button>
            </div>

            {/* Steppers */}
            <div className="space-y-2.5 text-xs">
              {/* Work Duration */}
              <div className="flex items-center justify-between py-1">
                <span className="flex items-center gap-2 text-[#252B27] dark:text-slate-200 font-medium">
                  <Clock className="w-3.5 h-3.5 text-[#365C4B]" />
                  Work Duration
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateWorkMin(-1)}
                    className="w-6 h-6 rounded-md border border-[#E4E1D9] dark:border-[#2D352F] flex items-center justify-center hover:bg-[#E7EDE7] cursor-pointer"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center font-bold text-sm tabular-nums text-[#252B27] dark:text-white">
                    {workDurationMin}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateWorkMin(1)}
                    className="w-6 h-6 rounded-md border border-[#E4E1D9] dark:border-[#2D352F] flex items-center justify-center hover:bg-[#E7EDE7] cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <span className="text-[11px] text-[#252B27]/60 dark:text-slate-400 w-12 text-right">minutes</span>
                </div>
              </div>

              {/* Short Break */}
              <div className="flex items-center justify-between py-1">
                <span className="flex items-center gap-2 text-[#252B27] dark:text-slate-200 font-medium">
                  <Coffee className="w-3.5 h-3.5 text-[#365C4B]" />
                  Short Break
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateShortBreakMin(-1)}
                    className="w-6 h-6 rounded-md border border-[#E4E1D9] dark:border-[#2D352F] flex items-center justify-center hover:bg-[#E7EDE7] cursor-pointer"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center font-bold text-sm tabular-nums text-[#252B27] dark:text-white">
                    {shortBreakMin}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateShortBreakMin(1)}
                    className="w-6 h-6 rounded-md border border-[#E4E1D9] dark:border-[#2D352F] flex items-center justify-center hover:bg-[#E7EDE7] cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <span className="text-[11px] text-[#252B27]/60 dark:text-slate-400 w-12 text-right">minutes</span>
                </div>
              </div>

              {/* Long Break */}
              <div className="flex items-center justify-between py-1">
                <span className="flex items-center gap-2 text-[#252B27] dark:text-slate-200 font-medium">
                  <Umbrella className="w-3.5 h-3.5 text-[#365C4B]" />
                  Long Break
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateLongBreakMin(-1)}
                    className="w-6 h-6 rounded-md border border-[#E4E1D9] dark:border-[#2D352F] flex items-center justify-center hover:bg-[#E7EDE7] cursor-pointer"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center font-bold text-sm tabular-nums text-[#252B27] dark:text-white">
                    {longBreakMin}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateLongBreakMin(1)}
                    className="w-6 h-6 rounded-md border border-[#E4E1D9] dark:border-[#2D352F] flex items-center justify-center hover:bg-[#E7EDE7] cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <span className="text-[11px] text-[#252B27]/60 dark:text-slate-400 w-12 text-right">minutes</span>
                </div>
              </div>

              {/* Sessions Until Long Break */}
              <div className="flex items-center justify-between py-1">
                <span className="flex items-center gap-2 text-[#252B27] dark:text-slate-200 font-medium">
                  <Clock className="w-3.5 h-3.5 text-[#365C4B]" />
                  Sessions Until Long Break
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateSessionsCount(-1)}
                    className="w-6 h-6 rounded-md border border-[#E4E1D9] dark:border-[#2D352F] flex items-center justify-center hover:bg-[#E7EDE7] cursor-pointer"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center font-bold text-sm tabular-nums text-[#252B27] dark:text-white">
                    {sessionsUntilLongBreak}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateSessionsCount(1)}
                    className="w-6 h-6 rounded-md border border-[#E4E1D9] dark:border-[#2D352F] flex items-center justify-center hover:bg-[#E7EDE7] cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <span className="text-[11px] text-[#252B27]/60 dark:text-slate-400 w-12 text-right">sessions</span>
                </div>
              </div>
            </div>

            <div className="border-t border-[#E4E1D9] dark:border-[#2D352F] pt-3 space-y-2 text-xs">
              {/* Auto start breaks toggle */}
              <label className="flex items-center justify-between cursor-pointer py-1">
                <span className="text-[#252B27] dark:text-slate-200 font-medium">Auto start breaks</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={autoStartBreaks}
                  onClick={() => setAutoStartBreaks(!autoStartBreaks)}
                  className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                    autoStartBreaks ? 'bg-[#365C4B]' : 'bg-[#E4E1D9] dark:bg-[#2D352F]'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      autoStartBreaks ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </label>

              {/* Ticking sound toggle */}
              <label className="flex items-center justify-between cursor-pointer py-1">
                <span className="text-[#252B27] dark:text-slate-200 font-medium">Ticking sound</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={tickingSound}
                  onClick={() => setTickingSound(!tickingSound)}
                  className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                    tickingSound ? 'bg-[#365C4B]' : 'bg-[#E4E1D9] dark:bg-[#2D352F]'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      tickingSound ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </label>

              {/* Notification alert toggle */}
              <label className="flex items-center justify-between cursor-pointer py-1">
                <span className="text-[#252B27] dark:text-slate-200 font-medium">Notification alert</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={notificationAlert}
                  onClick={() => setNotificationAlert(!notificationAlert)}
                  className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                    notificationAlert ? 'bg-[#365C4B]' : 'bg-[#E4E1D9] dark:bg-[#2D352F]'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      notificationAlert ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Quick Presets Row matching reference screenshot */}
      <div>
        <h3 className="font-bold text-sm text-[#252B27] dark:text-white mb-3">
          Quick Presets
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {presets.map((preset, idx) => {
            const isSelected = activePresetIndex === idx;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => handleSelectPreset(idx)}
                className={`p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                  isSelected
                    ? 'border-[#365C4B] bg-[#365C4B]/5 dark:bg-[#365C4B]/20 shadow-xs'
                    : 'border-[#E4E1D9] dark:border-[#2D352F] bg-white dark:bg-[#1A201C] hover:border-[#365C4B]'
                }`}
              >
                <div className="flex items-center gap-1.5 text-sm sm:text-base font-bold text-[#252B27] dark:text-white">
                  <span>{preset.icon}</span>
                  <span>{preset.label}</span>
                </div>
                <div className="text-[11px] text-[#252B27]/70 dark:text-slate-400 mt-1">
                  {preset.sublabel}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

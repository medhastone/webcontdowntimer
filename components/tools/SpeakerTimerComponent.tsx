'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { playTimerSound } from '@/lib/sound';
import { requestWakeLock, releaseWakeLock } from '@/lib/wakelock';
import { Play, Pause, RotateCcw, Maximize, Minimize, Volume2, VolumeX, AlertTriangle } from 'lucide-react';

interface SpeakerTimerProps {
  initialSeconds?: number;
}

export default function SpeakerTimerComponent({ initialSeconds = 900 }: SpeakerTimerProps) {
  const [totalSeconds, setTotalSeconds] = useState(initialSeconds);
  const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [overtimeSeconds, setOvertimeSeconds] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [wakeLockEnabled, setWakeLockEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [warningThreshold, setWarningThreshold] = useState(120); // 2 min amber warning
  const [themeMode, setThemeMode] = useState<'standard' | 'blackout' | 'high-contrast'>('standard');

  const containerRef = useRef<HTMLDivElement>(null);
  const lastTickTimeRef = useRef<number>(0);

  // Presets
  const presets = [
    { label: '5 min (Lightning)', sec: 300 },
    { label: '10 min (Briefing)', sec: 600 },
    { label: '15 min (TED-Style)', sec: 900 },
    { label: '20 min (Keynote)', sec: 1200 },
    { label: '30 min (Lecture)', sec: 1800 },
    { label: '45 min (Masterclass)', sec: 2700 },
  ];

  // Tick loop
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      if (wakeLockEnabled) {
        requestWakeLock();
      }

      interval = setInterval(() => {
        const now = Date.now();
        const delta = Math.floor((now - lastTickTimeRef.current) / 1000);
        if (delta >= 1) {
          lastTickTimeRef.current = now;
          setRemainingSeconds((prev) => {
            if (prev > 1) {
              if (prev === warningThreshold + 1 && soundEnabled) {
                playTimerSound('warning', 0.6);
              }
              return prev - 1;
            } else if (prev === 1) {
              if (soundEnabled) {
                playTimerSound('bell', 0.8);
              }
              return 0;
            } else {
              setOvertimeSeconds((ot) => ot + 1);
              return 0;
            }
          });
        }
      }, 500);
    } else {
      releaseWakeLock();
    }

    return () => {
      clearInterval(interval);
    };
  }, [isRunning, warningThreshold, soundEnabled, wakeLockEnabled]);

  const handleStartPause = useCallback(() => {
    lastTickTimeRef.current = Date.now();
    setIsRunning((prev) => !prev);
  }, []);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setRemainingSeconds(totalSeconds);
    setOvertimeSeconds(0);
  }, [totalSeconds]);

  const handlePresetSelect = (sec: number) => {
    setIsRunning(false);
    setTotalSeconds(sec);
    setRemainingSeconds(sec);
    setOvertimeSeconds(0);
    // Dynamic warning: 20% of duration or max 2 mins
    setWarningThreshold(Math.min(120, Math.floor(sec * 0.2)));
  };

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

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === 'Space') {
        e.preventDefault();
        handleStartPause();
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        handleReset();
      } else if (e.code === 'KeyF') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        setSoundEnabled((s) => !s);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleStartPause, handleReset]);

  // Determine stage visual state
  const isOvertime = remainingSeconds === 0;
  const isWarning = isRunning && remainingSeconds > 0 && remainingSeconds <= warningThreshold;
  const isPaused = !isRunning && remainingSeconds < totalSeconds && !isOvertime;
  const isReady = !isRunning && remainingSeconds === totalSeconds;

  const [advancedOpen, setAdvancedOpen] = useState(false);

  const formatTime = (totalSecs: number) => {
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Progress percentage
  const progressPercent = totalSeconds > 0 ? Math.max(0, Math.min(100, (remainingSeconds / totalSeconds) * 100)) : 0;

  return (
    <div
      ref={containerRef}
      className={`rounded-2xl border transition-colors relative ${
        themeMode === 'blackout'
          ? 'bg-black text-white border-neutral-900'
          : themeMode === 'high-contrast'
          ? 'bg-neutral-950 text-yellow-400 border-yellow-500/40'
          : 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white border-neutral-200 dark:border-neutral-800 shadow-sm'
      } ${isFullscreen ? 'timer-fullscreen-stage flex flex-col items-center justify-center bg-black text-white border-none' : 'p-6 sm:p-8'}`}
    >
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

      {/* Top Status & Mode Bar */}
      {!isFullscreen && (
        <div className="flex items-center justify-between pb-6 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full transition-colors ${
                isOvertime
                  ? 'bg-red-500 animate-pulse'
                  : isWarning
                  ? 'bg-amber-500 animate-pulse'
                  : isRunning
                  ? 'bg-emerald-500'
                  : isPaused
                  ? 'bg-amber-400'
                  : 'bg-neutral-400'
              }`}
              aria-hidden="true"
            />
            <span className="text-xs font-semibold tracking-wide uppercase text-neutral-500 dark:text-neutral-400">
              {isOvertime
                ? 'OVERTIME ALERT'
                : isWarning
                ? 'WRAP-UP WARNING'
                : isRunning
                ? 'RUNNING'
                : isPaused
                ? 'PAUSED'
                : 'READY'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              title={soundEnabled ? 'Mute Sound (M)' : 'Enable Sound (M)'}
              aria-label={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-500" /> : <VolumeX className="w-4 h-4 text-neutral-400" />}
            </button>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              title="Enter Fullscreen (F)"
              aria-label="Enter Fullscreen"
            >
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Large Display Area */}
      <div className={`${isFullscreen ? 'w-full px-8 flex flex-col items-center justify-center select-none' : 'my-8 sm:my-12 text-center select-none flex flex-col items-center justify-center'}`}>
        {/* Giant Digits */}
        <div
          className={`font-mono font-bold tracking-tight transition-colors tabular-nums ${
            isOvertime
              ? 'text-red-500'
              : isWarning
              ? 'text-amber-500'
              : isFullscreen
              ? 'text-white'
              : isRunning
              ? 'text-neutral-950 dark:text-white'
              : 'text-neutral-800 dark:text-neutral-200'
          } ${
            isFullscreen ? 'text-[clamp(4.5rem,20vmin,15rem)] leading-none' : 'text-6xl sm:text-8xl md:text-9xl'
          }`}
          aria-live="polite"
          aria-atomic="true"
        >
          {isOvertime ? `+${formatTime(overtimeSeconds)}` : formatTime(remainingSeconds)}
        </div>

        {/* Overtime or Subtext Notice */}
        {isOvertime && !isFullscreen && (
          <div className="mt-4 flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-sm sm:text-base animate-bounce">
            <AlertTriangle className="w-5 h-5" />
            <span>Time Expired — Please Conclude Immediately</span>
          </div>
        )}

        {/* Thin Progress Bar */}
        {!isOvertime && (
          <div className={`w-full ${isFullscreen ? 'max-w-3xl h-3.5 bg-white/15 mt-8' : 'max-w-xl mx-auto mt-6 sm:mt-8 h-2 bg-neutral-100 dark:bg-neutral-800'} rounded-full overflow-hidden`}>
            <div
              className={`h-full transition-all duration-500 ${
                isWarning ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </div>

      {/* Primary Action Controls */}
      {!isFullscreen && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={handleStartPause}
            className={`w-full sm:w-48 py-4 px-6 min-h-[52px] rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-md ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
            aria-label={isRunning ? 'Pause Speaker Timer' : 'Start Speaker Timer'}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>{remainingSeconds < totalSeconds ? 'Resume' : 'Start Speech'}</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="w-full sm:w-36 py-4 px-6 min-h-[52px] rounded-xl font-semibold text-sm bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 flex items-center justify-center gap-2 transition-colors"
            aria-label="Reset Speaker Timer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>
      )}

      {/* Presets and Custom Duration */}
      {!isFullscreen && (
        <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-neutral-800 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Quick Talk Presets
              </span>
              <span className="text-xs text-neutral-400 hidden sm:inline">
                Space = Start/Pause · R = Reset · F = Fullscreen
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {presets.map((p) => (
                <button
                  key={p.sec}
                  onClick={() => handlePresetSelect(p.sec)}
                  className={`py-2.5 px-3 min-h-[44px] text-xs font-medium rounded-xl border text-center transition-all ${
                    totalSeconds === p.sec && !isOvertime
                      ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-950 font-semibold shadow-xs'
                      : 'border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Expandable Advanced Settings */}
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
            <button
              onClick={() => setAdvancedOpen(!advancedOpen)}
              className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950/60 flex items-center justify-between text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
              aria-expanded={advancedOpen}
            >
              <span>Advanced Timer Preferences</span>
              <span className="font-mono text-neutral-400">{advancedOpen ? 'Hide −' : 'Show +'}</span>
            </button>

            {advancedOpen && (
              <div className="p-4 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="text-neutral-500 block mb-1 font-medium">Stage Theme</label>
                  <select
                    value={themeMode}
                    onChange={(e) => setThemeMode(e.target.value as typeof themeMode)}
                    className="w-full p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                  >
                    <option value="standard">Standard Light/Dark</option>
                    <option value="blackout">Pure Blackout (Sanctuary / Stage)</option>
                    <option value="high-contrast">High Contrast (Yellow / Black)</option>
                  </select>
                </div>

                <div>
                  <label className="text-neutral-500 block mb-1 font-medium">Warning Alert Threshold</label>
                  <select
                    value={warningThreshold}
                    onChange={(e) => setWarningThreshold(parseInt(e.target.value, 10))}
                    className="w-full p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                  >
                    <option value={60}>1 Minute Before End</option>
                    <option value={120}>2 Minutes Before End</option>
                    <option value={300}>5 Minutes Before End</option>
                  </select>
                </div>

                <div>
                  <label className="text-neutral-500 block mb-1 font-medium">Screen Wake Lock</label>
                  <button
                    onClick={() => setWakeLockEnabled(!wakeLockEnabled)}
                    className={`w-full p-2 rounded-lg border text-center font-medium transition-colors ${
                      wakeLockEnabled
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                        : 'border-neutral-300 dark:border-neutral-700 text-neutral-500'
                    }`}
                  >
                    {wakeLockEnabled ? 'Active (Screen Stays Awake)' : 'Disabled'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

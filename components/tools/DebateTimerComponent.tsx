'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { playTimerSound } from '@/lib/sound';
import { requestWakeLock, releaseWakeLock } from '@/lib/wakelock';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Maximize, Minimize, Bell, Shield, BellRing } from 'lucide-react';

interface DebateFormat {
  id: string;
  name: string;
  speechDurationSec: number;
  protectedStartSec: number; // e.g. 60s (0-1 min protected)
  protectedEndSec: number; // e.g. 60s before end (6-7 min protected)
  rebuttalDurationSec: number;
}

const DEBATE_FORMATS: DebateFormat[] = [
  { id: 'bp', name: 'British Parliamentary (7m)', speechDurationSec: 420, protectedStartSec: 60, protectedEndSec: 60, rebuttalDurationSec: 0 },
  { id: 'wsdc', name: 'World Schools (8m & 4m Reply)', speechDurationSec: 480, protectedStartSec: 60, protectedEndSec: 60, rebuttalDurationSec: 240 },
  { id: 'oxford', name: 'Oxford Union Style (5m)', speechDurationSec: 300, protectedStartSec: 60, protectedEndSec: 60, rebuttalDurationSec: 180 },
  { id: 'ld', name: 'Lincoln-Douglas (6m Constructive)', speechDurationSec: 360, protectedStartSec: 0, protectedEndSec: 0, rebuttalDurationSec: 240 },
];

export default function DebateTimerComponent() {
  const [selectedFormat, setSelectedFormat] = useState<DebateFormat>(DEBATE_FORMATS[0]);
  const [mode, setMode] = useState<'constructive' | 'rebuttal'>('constructive');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const lastTickTimeRef = useRef<number>(0);

  const currentDuration = mode === 'constructive' ? selectedFormat.speechDurationSec : selectedFormat.rebuttalDurationSec;

  // Protected time logic (first and last minute of British Parliamentary & World Schools)
  const isProtectedStart = elapsedSeconds < selectedFormat.protectedStartSec;
  const isProtectedEnd = elapsedSeconds >= currentDuration - selectedFormat.protectedEndSec && elapsedSeconds <= currentDuration;
  const isPOIAllowed = !isProtectedStart && !isProtectedEnd && elapsedSeconds < currentDuration;
  const isOvertime = elapsedSeconds > currentDuration;

  // Sound triggers at exact points:
  // 1. At protectedStartSec: Single bell (POIs now open)
  // 2. At currentDuration - protectedEndSec: Single bell (POIs now closed)
  // 3. At currentDuration: Double bell (Time expired)
  // 4. At currentDuration + 15s: Continuous bell
  useEffect(() => {
    if (!isRunning || !soundEnabled) return;

    if (elapsedSeconds === selectedFormat.protectedStartSec && selectedFormat.protectedStartSec > 0) {
      playTimerSound('bell', 0.8);
    } else if (elapsedSeconds === currentDuration - selectedFormat.protectedEndSec && selectedFormat.protectedEndSec > 0) {
      playTimerSound('bell', 0.8);
    } else if (elapsedSeconds === currentDuration) {
      playTimerSound('toastmaster-red', 0.9);
    } else if (elapsedSeconds === currentDuration + 15) {
      playTimerSound('warning', 1.0);
    }
  }, [elapsedSeconds, isRunning, soundEnabled, selectedFormat, currentDuration]);

  // Tick loop
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      requestWakeLock();
      interval = setInterval(() => {
        const now = Date.now();
        const delta = Math.floor((now - lastTickTimeRef.current) / 1000);
        if (delta >= 1) {
          lastTickTimeRef.current = now;
          setElapsedSeconds((prev) => prev + 1);
        }
      }, 500);
    } else {
      releaseWakeLock();
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStartPause = useCallback(() => {
    lastTickTimeRef.current = Date.now();
    setIsRunning((prev) => !prev);
  }, []);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setElapsedSeconds(0);
  }, []);

  const handleManualBell = () => {
    if (soundEnabled) {
      playTimerSound('bell', 0.8);
    }
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

  const formatMinSec = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div
      ref={containerRef}
      className={`rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-sm relative ${
        isFullscreen ? 'timer-fullscreen-stage flex flex-col items-center justify-center bg-[#06090F] text-white border-none' : ''
      }`}
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

      {/* Top Header */}
      {!isFullscreen && (
        <div className="flex items-center justify-between pb-6 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">
              Adjudication & Debating
            </span>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">{selectedFormat.name}</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleManualBell}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5 transition-colors"
              title="Ring Adjudicator Bell"
            >
              <BellRing className="w-3.5 h-3.5 text-amber-500" />
              <span>Ring Bell</span>
            </button>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
              aria-label="Toggle Sound"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-500" /> : <VolumeX className="w-4 h-4 text-neutral-400" />}
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
              aria-label="Toggle Fullscreen"
            >
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Status Banner */}
      {!isFullscreen && (
        <div className="mt-4 flex items-center justify-center">
          {isOvertime ? (
            <div className="px-4 py-1 rounded-full bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5" />
              <span>Overtime — Continuous Bell Active</span>
            </div>
          ) : isProtectedStart || isProtectedEnd ? (
            <div className="px-4 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-blue-500" />
              <span>Protected Time — No POIs Allowed</span>
            </div>
          ) : (
            <div className="px-4 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span>Points of Information (POI) Permitted</span>
            </div>
          )}
        </div>
      )}

      {/* Main Digits */}
      <div className={`${isFullscreen ? 'flex flex-col items-center justify-center' : 'my-8 text-center flex flex-col items-center'}`}>
        <div
          className={`font-mono font-black tracking-tight tabular-nums ${
            isOvertime
              ? 'text-red-500'
              : isPOIAllowed
              ? 'text-emerald-400'
              : isFullscreen
              ? 'text-white'
              : 'text-neutral-900 dark:text-white'
          } ${isFullscreen ? 'text-[clamp(4.5rem,20vmin,15rem)] leading-none' : 'text-7xl sm:text-8xl md:text-9xl'}`}
        >
          {formatMinSec(elapsedSeconds)}
        </div>

        {!isFullscreen && (
          <div className="mt-3 text-xs font-mono text-neutral-500">
            Target: {formatMinSec(currentDuration)} · Mode: {mode === 'constructive' ? 'Main Speech' : 'Reply / Rebuttal'}
          </div>
        )}
      </div>

      {/* Action Controls */}
      {!isFullscreen && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleStartPause}
            className={`py-3.5 px-8 rounded-xl font-bold text-sm flex items-center gap-2 text-white shadow-sm transition-transform active:scale-95 ${
              isRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:opacity-90'
            }`}
          >
            {isRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isRunning ? 'Pause Speech' : elapsedSeconds > 0 ? 'Resume' : 'Start Speech'}</span>
          </button>

          <button
            onClick={handleReset}
            className="py-3.5 px-6 rounded-xl font-semibold text-sm bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>
      )}

      {/* Formats Selector */}
      {!isFullscreen && (
        <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Debate Formats & Speech Type
            </span>
            <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg text-xs">
              <button
                onClick={() => { setMode('constructive'); handleReset(); }}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  mode === 'constructive' ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs' : 'text-neutral-500'
                }`}
              >
                Main Speech
              </button>
              <button
                onClick={() => { setMode('rebuttal'); handleReset(); }}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  mode === 'rebuttal' ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs' : 'text-neutral-500'
                }`}
              >
                Reply / Rebuttal
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {DEBATE_FORMATS.map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  setSelectedFormat(f);
                  handleReset();
                }}
                className={`p-3 rounded-xl border text-left text-xs transition-colors ${
                  selectedFormat.id === f.id
                    ? 'border-neutral-900 dark:border-white bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold'
                    : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                }`}
              >
                <div className="font-semibold">{f.name}</div>
                <div className="opacity-75 text-[11px] mt-1">POIs: 1m to {Math.floor((f.speechDurationSec - f.protectedEndSec) / 60)}m</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

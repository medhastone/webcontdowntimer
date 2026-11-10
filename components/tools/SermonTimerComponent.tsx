'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { playTimerSound } from '@/lib/sound';
import { requestWakeLock, releaseWakeLock } from '@/lib/wakelock';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Maximize, Minimize, Moon } from 'lucide-react';

export default function SermonTimerComponent() {
  const [totalMinutes, setTotalMinutes] = useState(30);
  const [remainingSeconds, setRemainingSeconds] = useState(30 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false); // Default silent for sermons
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [wrapUpPromptTime, setWrapUpPromptTime] = useState(300); // 5 mins wrap up

  const containerRef = useRef<HTMLDivElement>(null);
  const lastTickTimeRef = useRef<number>(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      requestWakeLock();
      interval = setInterval(() => {
        const now = Date.now();
        const delta = Math.floor((now - lastTickTimeRef.current) / 1000);
        if (delta >= 1) {
          lastTickTimeRef.current = now;
          setRemainingSeconds((prev) => {
            if (prev > 1) {
              if (prev === wrapUpPromptTime + 1 && soundEnabled) {
                playTimerSound('chime', 0.4);
              }
              return prev - 1;
            } else if (prev === 1) {
              if (soundEnabled) playTimerSound('bell', 0.5);
              return 0;
            }
            return 0;
          });
        }
      }, 500);
    } else {
      releaseWakeLock();
    }

    return () => clearInterval(interval);
  }, [isRunning, wrapUpPromptTime, soundEnabled]);

  const handleStartPause = useCallback(() => {
    lastTickTimeRef.current = Date.now();
    setIsRunning((prev) => !prev);
  }, []);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setRemainingSeconds(totalMinutes * 60);
  }, [totalMinutes]);

  const handleSelectMinutes = (mins: number) => {
    setIsRunning(false);
    setTotalMinutes(mins);
    setRemainingSeconds(mins * 60);
    setWrapUpPromptTime(Math.min(300, Math.floor(mins * 60 * 0.15)));
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

  const isWrapUp = remainingSeconds > 0 && remainingSeconds <= wrapUpPromptTime;
  const isFinished = remainingSeconds === 0;

  return (
    <div
      ref={containerRef}
      className={`rounded-2xl border bg-black text-neutral-100 border-neutral-900 select-none relative ${
        isFullscreen ? 'timer-fullscreen-stage flex flex-col items-center justify-center border-none' : 'p-6 sm:p-8 shadow-sm'
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

      {/* Top Sanctuary Bar */}
      {!isFullscreen && (
        <div className="flex items-center justify-between pb-6 border-b border-neutral-900">
          <div className="flex items-center gap-2 text-neutral-400">
            <Moon className="w-4 h-4 text-amber-500/70" />
            <span className="text-xs font-mono tracking-widest uppercase">Pulpit Sanctuary Confidence Display</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-lg text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900"
              aria-label="Toggle Sound"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-neutral-500" />}
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900"
              aria-label="Toggle Fullscreen"
            >
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Sanctuary Digits */}
      <div className={`${isFullscreen ? 'flex flex-col items-center justify-center' : 'my-10 text-center flex flex-col items-center'}`}>
        <div
          className={`font-mono font-bold tracking-tight tabular-nums transition-colors ${
            isFinished
              ? 'text-red-500 animate-pulse'
              : isWrapUp
              ? 'text-amber-400'
              : 'text-neutral-200'
          } ${isFullscreen ? 'text-[clamp(4.5rem,20vmin,15rem)] leading-none' : 'text-7xl sm:text-8xl md:text-9xl'}`}
        >
          {formatMinSec(remainingSeconds)}
        </div>

        {isWrapUp && !isFullscreen && (
          <div className="mt-3 text-xs sm:text-sm font-semibold tracking-wider uppercase text-amber-400/90">
            Wrap Up & Benediction
          </div>
        )}
      </div>

      {/* Transport Controls */}
      {!isFullscreen && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleStartPause}
            className={`py-3 px-6 rounded-xl font-bold text-sm flex items-center gap-2 transition-transform active:scale-95 ${
              isRunning ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-neutral-100 hover:bg-white text-black'
            }`}
          >
            {isRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isRunning ? 'Pause' : remainingSeconds < totalMinutes * 60 ? 'Resume' : 'Begin Service'}</span>
          </button>

          <button
            onClick={handleReset}
            className="py-3 px-5 rounded-xl font-medium text-sm bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>
      )}

      {/* Duration Presets */}
      {!isFullscreen && (
        <div className="mt-8 pt-6 border-t border-neutral-900">
          <span className="text-xs font-mono uppercase text-neutral-500 block mb-2.5">
            Ministry Timing Presets
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { label: '20 min (Brief)', mins: 20 },
              { label: '30 min (Standard)', mins: 30 },
              { label: '40 min (Expository)', mins: 40 },
              { label: '50 min (Extended)', mins: 50 },
            ].map((p) => (
              <button
                key={p.mins}
                onClick={() => handleSelectMinutes(p.mins)}
                className={`py-2 text-xs rounded-lg border text-center transition-colors ${
                  totalMinutes === p.mins
                    ? 'border-neutral-500 bg-neutral-800 text-white font-bold'
                    : 'border-neutral-900 text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

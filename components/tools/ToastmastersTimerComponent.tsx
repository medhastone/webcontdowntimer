'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { playTimerSound } from '@/lib/sound';
import { requestWakeLock, releaseWakeLock } from '@/lib/wakelock';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Maximize, Minimize, CheckCircle, AlertTriangle } from 'lucide-react';

interface ToastmastersPreset {
  id: string;
  name: string;
  minSec: number; // Green signal
  midSec: number; // Amber signal
  maxSec: number; // Red signal
  graceSec: number; // Disqualification threshold
}

const TOASTMASTERS_PRESETS: ToastmastersPreset[] = [
  { id: 'table-topics', name: 'Table Topics (1–2 min)', minSec: 60, midSec: 90, maxSec: 120, graceSec: 30 },
  { id: 'icebreaker', name: 'Icebreaker Speech (4–6 min)', minSec: 240, midSec: 300, maxSec: 360, graceSec: 30 },
  { id: 'prepared', name: 'Prepared Speech (5–7 min)', minSec: 300, midSec: 360, maxSec: 420, graceSec: 30 },
  { id: 'evaluation', name: 'Speech Evaluation (2–3 min)', minSec: 120, midSec: 150, maxSec: 180, graceSec: 30 },
  { id: 'extended', name: 'Advanced Speech (8–10 min)', minSec: 480, midSec: 540, maxSec: 600, graceSec: 30 },
];

export default function ToastmastersTimerComponent() {
  const [selectedPreset, setSelectedPreset] = useState<ToastmastersPreset>(TOASTMASTERS_PRESETS[2]); // 5-7m default
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cardModeOnly, setCardModeOnly] = useState(false); // Tablet flag mode

  const containerRef = useRef<HTMLDivElement>(null);
  const lastTickTimeRef = useRef<number>(0);

  // Determine current card status
  const isGreen = elapsedSeconds >= selectedPreset.minSec && elapsedSeconds < selectedPreset.midSec;
  const isAmber = elapsedSeconds >= selectedPreset.midSec && elapsedSeconds < selectedPreset.maxSec;
  const isRed = elapsedSeconds >= selectedPreset.maxSec;
  const isDisqualified = elapsedSeconds > selectedPreset.maxSec + selectedPreset.graceSec;
  const isUnderQualified = elapsedSeconds < selectedPreset.minSec;

  // Sound triggers on state changes
  const prevStatusRef = useRef<'none' | 'green' | 'amber' | 'red' | 'disqualified'>('none');

  useEffect(() => {
    let currentStatus: 'none' | 'green' | 'amber' | 'red' | 'disqualified' = 'none';
    if (isDisqualified) currentStatus = 'disqualified';
    else if (isRed) currentStatus = 'red';
    else if (isAmber) currentStatus = 'amber';
    else if (isGreen) currentStatus = 'green';

    if (isRunning && currentStatus !== prevStatusRef.current && prevStatusRef.current !== 'none') {
      if (currentStatus === 'green' && soundEnabled) playTimerSound('toastmaster-green', 0.6);
      if (currentStatus === 'amber' && soundEnabled) playTimerSound('toastmaster-amber', 0.6);
      if (currentStatus === 'red' && soundEnabled) playTimerSound('toastmaster-red', 0.8);
      if (currentStatus === 'disqualified' && soundEnabled) playTimerSound('warning', 0.8);
    }
    prevStatusRef.current = currentStatus;
  }, [isGreen, isAmber, isRed, isDisqualified, isRunning, soundEnabled]);

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
    prevStatusRef.current = 'none';
  }, []);

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

  // Card background styling
  let cardBgClass = 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800';
  let cardTextColor = 'text-neutral-900 dark:text-white';
  let badgeLabel = 'White / Neutral (Speech Started)';

  if (isDisqualified) {
    cardBgClass = 'bg-red-950 border-red-600';
    cardTextColor = 'text-red-400';
    badgeLabel = 'DISQUALIFIED (+30s Grace Window Exceeded)';
  } else if (isRed) {
    cardBgClass = 'bg-red-600 border-red-500';
    cardTextColor = 'text-white';
    badgeLabel = 'RED CARD (Maximum Time Reached)';
  } else if (isAmber) {
    cardBgClass = 'bg-amber-500 border-amber-400';
    cardTextColor = 'text-neutral-950';
    badgeLabel = 'AMBER / YELLOW CARD (Target Halfway Warning)';
  } else if (isGreen) {
    cardBgClass = 'bg-emerald-600 border-emerald-500';
    cardTextColor = 'text-white';
    badgeLabel = 'GREEN CARD (Minimum Qualifying Time Reached)';
  }

  return (
    <div
      ref={containerRef}
      className={`rounded-2xl border transition-all duration-300 relative ${cardBgClass} ${
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

      {/* Top Bar */}
      {!isFullscreen && (
        <div className="flex items-center justify-between pb-6 border-b border-black/10 dark:border-white/10">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider opacity-80">
              Toastmasters Official Rules
            </span>
            <h2 className="text-lg font-bold">{selectedPreset.name}</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCardModeOnly(!cardModeOnly)}
              className="px-2.5 py-1 text-xs font-medium rounded-lg bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 transition-colors"
            >
              {cardModeOnly ? 'Show Digits' : 'Card Flag Mode'}
            </button>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-lg bg-black/10 dark:bg-white/10 hover:bg-black/20"
              aria-label="Toggle Sound"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 opacity-50" />}
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg bg-black/10 dark:bg-white/10 hover:bg-black/20"
              aria-label="Toggle Fullscreen"
            >
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Signal Display */}
      <div className={`${isFullscreen ? 'flex flex-col items-center justify-center text-center' : 'my-8 sm:my-12 text-center flex flex-col items-center justify-center'}`}>
        {/* Card Status Indicator */}
        {!isFullscreen && (
          <div className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-black/15 dark:bg-white/15">
            {badgeLabel}
          </div>
        )}

        {/* Large Digits (hidden if cardModeOnly is enabled for holding up tablet) */}
        {!cardModeOnly ? (
          <div
            className={`font-mono font-black tracking-tight tabular-nums ${cardTextColor} ${
              isFullscreen ? 'text-[clamp(4.5rem,20vmin,15rem)] leading-none' : 'text-7xl sm:text-8xl md:text-9xl'
            }`}
          >
            {formatMinSec(elapsedSeconds)}
          </div>
        ) : (
          <div className="py-16 text-2xl sm:text-4xl font-extrabold uppercase tracking-widest">
            {badgeLabel}
          </div>
        )}

        {/* Speech Qualifications Details */}
        {!isFullscreen && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs font-mono opacity-90">
            <span>Green at {formatMinSec(selectedPreset.minSec)}</span>
            <span>·</span>
            <span>Amber at {formatMinSec(selectedPreset.midSec)}</span>
            <span>·</span>
            <span>Red at {formatMinSec(selectedPreset.maxSec)}</span>
            <span>·</span>
            <span>Disqualify at {formatMinSec(selectedPreset.maxSec + selectedPreset.graceSec)}</span>
          </div>
        )}
      </div>

      {/* Primary Action Controls */}
      {!isFullscreen && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
          <button
            onClick={handleStartPause}
            className="min-h-[52px] py-3.5 px-8 rounded-xl font-bold text-sm sm:text-base bg-black dark:bg-white text-white dark:text-neutral-900 shadow-md hover:opacity-90 flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            {isRunning ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            <span>{isRunning ? 'Pause Timer' : elapsedSeconds > 0 ? 'Resume' : 'Start Speech'}</span>
          </button>

          <button
            onClick={handleReset}
            className="min-h-[52px] py-3.5 px-6 rounded-xl font-semibold text-sm bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 flex items-center justify-center gap-2 transition-colors active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>
      )}

      {/* Role Preset Selector */}
      {!isFullscreen && (
        <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10">
          <span className="text-xs font-semibold uppercase tracking-wider opacity-80 block mb-3">
            Select Speech Role Presets
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {TOASTMASTERS_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => {
                  setSelectedPreset(preset);
                  handleReset();
                }}
                className={`py-2 px-3 text-xs rounded-lg text-left transition-all ${
                  selectedPreset.id === preset.id
                    ? 'ring-2 ring-neutral-900 dark:ring-white font-bold bg-black/10 dark:bg-white/10'
                    : 'bg-black/5 dark:bg-white/5 hover:bg-black/10 opacity-80'
                }`}
              >
                <div className="truncate font-medium">{preset.name.split(' (')[0]}</div>
                <div className="text-[11px] opacity-70">
                  {formatMinSec(preset.minSec)} – {formatMinSec(preset.maxSec)}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

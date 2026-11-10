'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { playTimerSound } from '@/lib/sound';
import { requestWakeLock, releaseWakeLock } from '@/lib/wakelock';
import { Play, Pause, RotateCcw, SkipForward, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';

interface Segment {
  id: string;
  name: string;
  durationSec: number;
}

const DEFAULT_SEGMENTS: Segment[] = [
  { id: '1', name: 'Hook & Problem', durationSec: 180 }, // 3 min
  { id: '2', name: 'Solution & Demo', durationSec: 420 }, // 7 min
  { id: '3', name: 'Business Model & Market', durationSec: 300 }, // 5 min
  { id: '4', name: 'Ask & Live Q&A', durationSec: 300 }, // 5 min
];

export default function PresentationTimerComponent() {
  const [segments, setSegments] = useState<Segment[]>(DEFAULT_SEGMENTS);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [remainingInSegment, setRemainingInSegment] = useState(DEFAULT_SEGMENTS[0].durationSec);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const lastTickTimeRef = useRef<number>(0);

  const currentSegment = segments[currentSegmentIndex] || segments[0];

  // Total presentation time calculation
  const totalPresentationSec = segments.reduce((acc, s) => acc + s.durationSec, 0);
  const elapsedBeforeCurrent = segments
    .slice(0, currentSegmentIndex)
    .reduce((acc, s) => acc + s.durationSec, 0);
  const totalElapsed = elapsedBeforeCurrent + (currentSegment.durationSec - remainingInSegment);
  const totalRemaining = Math.max(0, totalPresentationSec - totalElapsed);

  // Timer tick
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      requestWakeLock();
      interval = setInterval(() => {
        const now = Date.now();
        const delta = Math.floor((now - lastTickTimeRef.current) / 1000);
        if (delta >= 1) {
          lastTickTimeRef.current = now;
          setRemainingInSegment((prev) => {
            if (prev > 1) {
              if (prev === 31 && soundEnabled) {
                playTimerSound('warning', 0.5); // 30 sec segment heads-up
              }
              return prev - 1;
            } else if (prev === 1) {
              // Transition to next segment
              if (soundEnabled) {
                playTimerSound('bell', 0.7);
              }
              if (currentSegmentIndex < segments.length - 1) {
                setCurrentSegmentIndex((idx) => {
                  const nextIdx = idx + 1;
                  setRemainingInSegment(segments[nextIdx].durationSec);
                  return nextIdx;
                });
              } else {
                setIsRunning(false);
              }
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
  }, [isRunning, currentSegmentIndex, segments, soundEnabled]);

  const handleStartPause = useCallback(() => {
    lastTickTimeRef.current = Date.now();
    setIsRunning((prev) => !prev);
  }, []);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setCurrentSegmentIndex(0);
    setRemainingInSegment(segments[0].durationSec);
  }, [segments]);

  const handleNextSegment = () => {
    if (currentSegmentIndex < segments.length - 1) {
      const nextIdx = currentSegmentIndex + 1;
      setCurrentSegmentIndex(nextIdx);
      setRemainingInSegment(segments[nextIdx].durationSec);
      if (soundEnabled) playTimerSound('chime', 0.5);
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

      {/* Top Bar */}
      {!isFullscreen && (
        <div className="flex items-center justify-between pb-6 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <span className="text-xs font-mono uppercase text-neutral-500">Section {currentSegmentIndex + 1} of {segments.length}</span>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">{currentSegment.name}</h2>
          </div>

          <div className="flex items-center gap-2">
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

      {/* Main Segment Timer */}
      <div className={`${isFullscreen ? 'flex flex-col items-center justify-center' : 'my-8 text-center flex flex-col items-center'}`}>
        {!isFullscreen && (
          <div className="text-xs font-mono uppercase tracking-widest text-neutral-500 mb-2">
            Time Remaining in Section
          </div>
        )}
        <div className={`font-mono font-extrabold tracking-tight tabular-nums ${isFullscreen ? 'text-[clamp(4.5rem,20vmin,15rem)] leading-none text-white' : 'text-7xl sm:text-8xl md:text-9xl text-neutral-950 dark:text-white'}`}>
          {formatMinSec(remainingInSegment)}
        </div>

        {/* Total Overall Presentation Time tracker */}
        {!isFullscreen && (
          <div className="mt-4 flex items-center gap-4 text-xs font-mono text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-4 py-1.5 rounded-full">
            <span>Overall: {formatMinSec(totalRemaining)} remaining</span>
            <span>·</span>
            <span>Total: {formatMinSec(totalPresentationSec)}</span>
          </div>
        )}
      </div>

      {/* Segments Visual Step Progress */}
      <div className={`${isFullscreen ? 'w-full max-w-4xl px-6 mt-8' : 'space-y-2 mb-8'}`}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {segments.map((seg, idx) => {
            const isPast = idx < currentSegmentIndex;
            const isCurrent = idx === currentSegmentIndex;
            return (
              <div
                key={seg.id}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isCurrent
                    ? 'border-emerald-500 bg-emerald-600 text-white'
                    : isPast
                    ? 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 text-neutral-400 opacity-50'
                    : 'border-neutral-200 dark:border-neutral-800 bg-white/5 text-neutral-500 dark:text-neutral-300'
                }`}
              >
                <div className="text-xs font-mono opacity-80">0{idx + 1}. {Math.round(seg.durationSec / 60)}m</div>
                <div className="text-xs font-bold truncate mt-0.5">{seg.name}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      {!isFullscreen && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleStartPause}
            className={`py-3.5 px-6 rounded-xl font-bold text-sm flex items-center gap-2 text-white shadow-sm transition-transform active:scale-95 ${
              isRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {isRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isRunning ? 'Pause' : 'Start Deck'}</span>
          </button>

          <button
            onClick={handleNextSegment}
            disabled={currentSegmentIndex >= segments.length - 1}
            className="py-3.5 px-5 rounded-xl font-semibold text-sm bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 disabled:opacity-40 flex items-center gap-2"
          >
            <SkipForward className="w-4 h-4" />
            <span>Next Slide / Section</span>
          </button>

          <button
            onClick={handleReset}
            className="py-3.5 px-5 rounded-xl font-semibold text-sm bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>
      )}
    </div>
  );
}

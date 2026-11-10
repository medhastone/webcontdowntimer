'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Play, Pause, RotateCcw, Wind, Dumbbell, Sparkles, Maximize2, Minimize2 } from 'lucide-react';
import { playTimerSound } from '@/lib/sound';

export type WellnessVariant = 'tabata' | 'boxing' | 'meditation' | 'breathing';

export default function WellnessTimerComponent({
  variant = 'tabata',
}: {
  variant?: WellnessVariant;
}) {
  // Initial protocol defaults based on variant
  const initialWork =
    variant === 'tabata'
      ? 20
      : variant === 'boxing'
      ? 180
      : variant === 'meditation'
      ? 600
      : 4;
  const initialRest =
    variant === 'tabata' ? 10 : variant === 'boxing' ? 60 : 0;
  const initialRounds =
    variant === 'tabata' ? 8 : variant === 'boxing' ? 12 : 1;

  const [workSec, setWorkSec] = useState<number>(initialWork);
  const [restSec, setRestSec] = useState<number>(initialRest);
  const [totalRounds, setTotalRounds] = useState<number>(initialRounds);
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [phase, setPhase] = useState<'work' | 'rest'>('work');
  const [remainingSec, setRemainingSec] = useState<number>(initialWork);
  const [isRunning, setIsRunning] = useState<boolean>(false);
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

  // Breathing pacer specific state (Inhale -> Hold -> Exhale -> Hold)
  const [breathPattern, setBreathPattern] = useState<'box' | '478' | 'coherent'>('box');
  const [breathStageIndex, setBreathStageIndex] = useState<number>(0);

  const breathStages = useMemo(
    () =>
      breathPattern === 'box'
        ? [
            { name: 'Inhale Slowly', sec: 4 },
            { name: 'Hold Breath', sec: 4 },
            { name: 'Exhale Gently', sec: 4 },
            { name: 'Hold Empty', sec: 4 },
          ]
        : breathPattern === '478'
        ? [
            { name: 'Inhale Quietly', sec: 4 },
            { name: 'Hold Deeply', sec: 7 },
            { name: 'Exhale Completely', sec: 8 },
          ]
        : [
            { name: 'Coherent Inhale', sec: 5 },
            { name: 'Coherent Exhale', sec: 5 },
          ],
    [breathPattern]
  );

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setRemainingSec((prev) => {
        if (prev <= 1) {
          if (variant === 'breathing') {
            const nextIdx = (breathStageIndex + 1) % breathStages.length;
            setBreathStageIndex(nextIdx);
            return breathStages[nextIdx].sec;
          }

          playTimerSound('bell');
          if (phase === 'work' && restSec > 0) {
            setPhase('rest');
            return restSec;
          }
          if (currentRound < totalRounds) {
            setCurrentRound((r) => r + 1);
            setPhase('work');
            return workSec;
          }
          setIsRunning(false);
          return 0;
        }
        // Boxing 30-second end-of-round clapper warning
        if (variant === 'boxing' && phase === 'work' && prev === 31) {
          playTimerSound('warning');
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [
    isRunning,
    variant,
    phase,
    restSec,
    workSec,
    currentRound,
    totalRounds,
    breathStageIndex,
    breathStages,
  ]);

  const formatMMSS = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div
        className={`${
          isFullscreen
            ? 'timer-fullscreen-stage flex flex-col items-center justify-center bg-[#0F172A] text-white'
            : 'lg:col-span-7 bg-[#0F172A] text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-lg text-center space-y-6 relative'
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
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Fullscreen"
            aria-label="Enter Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        )}

        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-800 text-emerald-400 text-xs font-bold mb-2">
          {variant === 'breathing' ? (
            <Wind className="w-3.5 h-3.5" />
          ) : variant === 'meditation' ? (
            <Sparkles className="w-3.5 h-3.5" />
          ) : (
            <Dumbbell className="w-3.5 h-3.5" />
          )}
          <span>
            {variant === 'breathing'
              ? breathStages[breathStageIndex]?.name
              : phase === 'work'
              ? `ROUND ${currentRound} OF ${totalRounds} · ACTIVE`
              : `ROUND ${currentRound} OF ${totalRounds} · REST`}
          </span>
        </div>

        <div className={`font-black font-mono tabular-nums tracking-tight ${isFullscreen ? 'text-[clamp(4.5rem,20vmin,15rem)] leading-none text-white' : 'text-6xl sm:text-7xl'}`}>
          {formatMMSS(remainingSec)}
        </div>

        {!isFullscreen && (
          <>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsRunning((prev) => !prev)}
                className="h-12 px-8 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white font-bold text-sm sm:text-base flex items-center gap-2 cursor-pointer"
              >
                {isRunning ? (
                  <>
                    <Pause className="w-5 h-5 fill-current" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" />
                    <span>Start</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsRunning(false);
                  setCurrentRound(1);
                  setPhase('work');
                  setBreathStageIndex(0);
                  setRemainingSec(
                    variant === 'breathing' ? breathStages[0].sec : workSec
                  );
                }}
                className="h-12 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
              Wellness &amp; Fitness Notice: This timing tool is for general pacing, mindfulness, and workout organization only and does not constitute medical advice or clinical treatment.
            </p>
          </>
        )}
      </div>

      <div className="lg:col-span-5 bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          {variant === 'breathing'
            ? 'Breathing Cadence Pattern'
            : 'Configure Rounds & Durations'}
        </h3>

        {variant === 'breathing' ? (
          <div className="space-y-2">
            {[
              { id: 'box', label: 'Box Breathing (4s-4s-4s-4s)', startSec: 4 },
              { id: '478', label: '4-7-8 Relaxing Breath', startSec: 4 },
              { id: 'coherent', label: 'Coherent Breathing (5s-5s)', startSec: 5 },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setIsRunning(false);
                  setBreathPattern(p.id as 'box' | '478' | 'coherent');
                  setBreathStageIndex(0);
                  setRemainingSec(p.startSec);
                }}
                className={`w-full p-3 rounded-xl border text-left text-xs font-bold cursor-pointer ${
                  breathPattern === p.id
                    ? 'bg-blue-50 dark:bg-blue-950/60 border-[#2563EB] text-[#2563EB]'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Active Work / Meditation Duration (Seconds)
              </label>
              <input
                type="number"
                min={5}
                max={7200}
                value={workSec}
                onChange={(e) => {
                  const v = Math.max(5, Number(e.target.value) || 20);
                  setWorkSec(v);
                  if (!isRunning) setRemainingSec(v);
                }}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-mono font-bold"
              />
            </div>

            {variant !== 'meditation' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Rest Duration (Seconds)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={1800}
                    value={restSec}
                    onChange={(e) => setRestSec(Math.max(0, Number(e.target.value) || 0))}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Total Rounds
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={totalRounds}
                    onChange={(e) => setTotalRounds(Math.max(1, Number(e.target.value) || 1))}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-mono font-bold"
                  />
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

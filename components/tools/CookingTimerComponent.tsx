'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Plus, Trash2, Flame, Coffee, Utensils } from 'lucide-react';
import { playTimerSound } from '@/lib/sound';

export type CookingVariant = 'kitchen' | 'egg' | 'tea' | 'coffee';


const VARIANT_PRESETS: Record<CookingVariant, Array<{ label: string; seconds: number; note: string }>> = {
  kitchen: [
    { label: 'Al Dente Pasta (9m)', seconds: 540, note: 'Rolling boil, salted water' },
    { label: 'Roast Vegetables (25m)', seconds: 1500, note: '200°C / 400°F convection' },
    { label: 'Simmer Sauce (15m)', seconds: 900, note: 'Low heat, stir occasionally' },
    { label: 'Rest Steak (8m)', seconds: 480, note: 'Tent loosely with foil' },
  ],
  egg: [
    { label: 'Soft & Runny Yolk (4m 30s)', seconds: 270, note: 'Large egg, simmering water' },
    { label: 'Jammy Ramen Egg (6m 30s)', seconds: 390, note: 'Transfer to ice bath immediately' },
    { label: 'Medium Firm (8m 00s)', seconds: 480, note: 'Creamy set center' },
    { label: 'Hard Boiled (10m 30s)', seconds: 630, note: 'Fully set yolk for slicing' },
  ],
  tea: [
    { label: 'Green Tea (2m 00s)', seconds: 120, note: 'Water temp: 75–80°C (170°F)' },
    { label: 'White Tea (3m 00s)', seconds: 180, note: 'Water temp: 80–85°C (180°F)' },
    { label: 'Oolong Tea (3m 30s)', seconds: 210, note: 'Water temp: 85–90°C (190°F)' },
    { label: 'Black / Earl Grey (4m 00s)', seconds: 240, note: 'Water temp: 95–100°C (205°F)' },
    { label: 'Herbal / Chamomile (5m 00s)', seconds: 300, note: 'Water temp: 100°C (212°F)' },
  ],
  coffee: [
    { label: 'Pour-Over Bloom (45s)', seconds: 45, note: '2x water weight to degas grounds' },
    { label: 'V60 / Pour-Over Total (3m 00s)', seconds: 180, note: 'Medium-fine grind, 93°C water' },
    { label: 'French Press Steep (4m 00s)', seconds: 240, note: 'Coarse grind, plunge gently' },
    { label: 'AeroPress Immersion (1m 45s)', seconds: 105, note: 'Swirl at 1:15, press 30s' },
    { label: 'Espresso Extraction (28s)', seconds: 28, note: '9 bar pressure, 1:2 yield ratio' },
  ],
};

interface BurnerTimer {
  id: string;
  label: string;
  note: string;
  totalSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
}

export default function CookingTimerComponent({
  variant = 'kitchen',
}: {
  variant?: CookingVariant;
}) {
  const presets = VARIANT_PRESETS[variant];
  const [timers, setTimers] = useState<BurnerTimer[]>([
    {
      id: 'burner-1',
      label: presets[0].label,
      note: presets[0].note,
      totalSeconds: presets[0].seconds,
      remainingSeconds: presets[0].seconds,
      isRunning: false,
    },
    {
      id: 'burner-2',
      label: presets[1].label,
      note: presets[1].note,
      totalSeconds: presets[1].seconds,
      remainingSeconds: presets[1].seconds,
      isRunning: false,
    },
  ]);

  const [customTitle, setCustomTitle] = useState<string>('');
  const [customMinutes, setCustomMinutes] = useState<number>(5);
  const [customSeconds, setCustomSeconds] = useState<number>(0);

  const anyRunning = timers.some((t) => t.isRunning);

  useEffect(() => {
    if (!anyRunning) return;
    const interval = setInterval(() => {
      setTimers((prev) =>
        prev.map((t) => {
          if (!t.isRunning) return t;
          const next = t.remainingSeconds - 1;
          if (next <= 0) {
            playTimerSound('bell');
            return { ...t, remainingSeconds: 0, isRunning: false };
          }
          return { ...t, remainingSeconds: next };
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [anyRunning]);

  const handleLoadPreset = (preset: { label: string; seconds: number; note: string }) => {
    setTimers((prev) => [
      {
        id: `burner-${Date.now()}`,
        label: preset.label,
        note: preset.note,
        totalSeconds: preset.seconds,
        remainingSeconds: preset.seconds,
        isRunning: true,
      },
      ...prev,
    ]);
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const total = Math.max(5, customMinutes * 60 + customSeconds);
    setTimers((prev) => [
      ...prev,
      {
        id: `burner-${Date.now()}`,
        label: customTitle.trim() || `Station #${prev.length + 1}`,
        note: 'Custom cooking timer',
        totalSeconds: total,
        remainingSeconds: total,
        isRunning: false,
      },
    ]);
    setCustomTitle('');
  };

  const formatMMSS = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* One-Click Culinary Presets */}
      <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-3 shadow-2xs">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
          {variant === 'coffee' || variant === 'tea' ? (
            <Coffee className="w-4 h-4 text-[#2563EB]" />
          ) : (
            <Utensils className="w-4 h-4 text-[#2563EB]" />
          )}
          <span>One-Click Presets (Starts a new simultaneous timer)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {presets.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => handleLoadPreset(p)}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:border-[#2563EB] border border-slate-200 dark:border-slate-700 text-left transition-all cursor-pointer"
            >
              <div className="text-xs font-bold text-slate-900 dark:text-white">{p.label}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{p.note}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Simultaneous Active Cooking Timers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {timers.map((t) => {
          const pct =
            t.totalSeconds > 0
              ? Math.max(0, Math.min(100, ((t.totalSeconds - t.remainingSeconds) / t.totalSeconds) * 100))
              : 0;
          const isDone = t.remainingSeconds === 0;

          return (
            <div
              key={t.id}
              className={`rounded-2xl bg-white dark:bg-[#0F172A] border p-5 space-y-4 ${
                isDone
                  ? 'border-red-500 bg-red-50/20'
                  : t.isRunning
                  ? 'border-[#2563EB]'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>{t.label}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{t.note}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setTimers((prev) => prev.filter((item) => item.id !== t.id))}
                  className="p-1.5 text-slate-400 hover:text-red-600 cursor-pointer"
                  aria-label="Remove timer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="text-4xl sm:text-5xl font-black font-mono tabular-nums text-slate-900 dark:text-white">
                {formatMMSS(t.remainingSeconds)}
              </div>

              <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#2563EB] transition-all duration-300"
                  style={{ width: `${pct}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() =>
                    setTimers((prev) =>
                      prev.map((item) =>
                        item.id === t.id
                          ? {
                              ...item,
                              remainingSeconds:
                                item.remainingSeconds === 0
                                  ? item.totalSeconds
                                  : item.remainingSeconds,
                              isRunning: !item.isRunning,
                            }
                          : item
                      )
                    )
                  }
                  className="h-10 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {t.isRunning ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-current" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isDone ? 'Restart' : 'Start'}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setTimers((prev) =>
                      prev.map((item) =>
                        item.id === t.id
                          ? { ...item, remainingSeconds: item.totalSeconds, isRunning: false }
                          : item
                      )
                    )
                  }
                  className="h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Custom Burner / Brew Timer */}
      <form
        onSubmit={handleAddCustom}
        className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
      >
        <input
          type="text"
          value={customTitle}
          onChange={(e) => setCustomTitle(e.target.value)}
          placeholder="Dish or stage name (e.g., Garlic Bread)"
          className="flex-1 h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
        />
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            max={300}
            value={customMinutes}
            onChange={(e) => setCustomMinutes(Math.max(0, Number(e.target.value) || 0))}
            className="w-20 h-10 px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold"
            aria-label="Minutes"
          />
          <span className="text-xs text-slate-500">min</span>
          <input
            type="number"
            min={0}
            max={59}
            value={customSeconds}
            onChange={(e) => setCustomSeconds(Math.max(0, Number(e.target.value) || 0))}
            className="w-20 h-10 px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold"
            aria-label="Seconds"
          />
          <span className="text-xs text-slate-500">sec</span>
        </div>
        <button
          type="submit"
          className="h-10 px-4 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Station</span>
        </button>
      </form>
    </div>
  );
}

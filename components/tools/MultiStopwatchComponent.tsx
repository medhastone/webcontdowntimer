'use client';

import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Flag,
  Plus,
  Trash2,
  Download,
  Users,
  ArrowRightLeft,
  Sparkles,
} from 'lucide-react';
import {
  ParticipantStopwatch,
  computeElapsedMs,
  startStopwatchItem,
  pauseStopwatchItem,
  resetStopwatchItem,
  recordStopwatchLap,
  validateParticipantName,
  formatStopwatchMs,
  exportMultiStopwatchCsv,
} from '@/lib/timer-engine';
import { playTimerSound } from '@/lib/sound';
import { requestWakeLock, releaseWakeLock } from '@/lib/wakelock';

const TEMPLATES: Array<{ label: string; participants: Array<{ name: string; group: string }> }> = [
  {
    label: '4x100m Relay (4 Lanes)',
    participants: [
      { name: 'Lane 1 – Team Red', group: 'Finals' },
      { name: 'Lane 2 – Team Blue', group: 'Finals' },
      { name: 'Lane 3 – Team Gold', group: 'Finals' },
      { name: 'Lane 4 – Team Green', group: 'Finals' },
    ],
  },
  {
    label: 'Swim Sprint (6 Lanes)',
    participants: [
      { name: 'Lane 1 – A. Rivera', group: 'Heat 1' },
      { name: 'Lane 2 – S. Patel', group: 'Heat 1' },
      { name: 'Lane 3 – L. O’Connor', group: 'Heat 1' },
      { name: 'Lane 4 – M. Lin', group: 'Heat 1' },
      { name: 'Lane 5 – D. Kim', group: 'Heat 1' },
      { name: 'Lane 6 – E. Taylor', group: 'Heat 1' },
    ],
  },
  {
    label: 'Agile Demo (4 Teams)',
    participants: [
      { name: 'Platform Squad Demo', group: 'Sprint Review' },
      { name: 'Mobile Team Demo', group: 'Sprint Review' },
      { name: 'Data Pipeline Demo', group: 'Sprint Review' },
      { name: 'Growth Experiments Demo', group: 'Sprint Review' },
    ],
  },
  {
    label: 'Classroom Stations (5 Groups)',
    participants: [
      { name: 'Station 1 – Reading Nook', group: 'Period 3' },
      { name: 'Station 2 – Math Lab', group: 'Period 3' },
      { name: 'Station 3 – Science Discovery', group: 'Period 3' },
      { name: 'Station 4 – Art Studio', group: 'Period 3' },
      { name: 'Station 5 – Writing Workshop', group: 'Period 3' },
    ],
  },
];

const INITIAL_PARTICIPANTS: ParticipantStopwatch[] = [
  {
    id: 'sw-1',
    name: 'Lane 1 – Alex Rivera',
    laneOrGroup: 'Heat A',
    isRunning: false,
    accumulatedMs: 0,
    startedAtPerfMs: null,
    laps: [],
  },
  {
    id: 'sw-2',
    name: 'Lane 2 – Samira Patel',
    laneOrGroup: 'Heat A',
    isRunning: false,
    accumulatedMs: 0,
    startedAtPerfMs: null,
    laps: [],
  },
  {
    id: 'sw-3',
    name: 'Lane 3 – Liam O’Connor',
    laneOrGroup: 'Heat A',
    isRunning: false,
    accumulatedMs: 0,
    startedAtPerfMs: null,
    laps: [],
  },
  {
    id: 'sw-4',
    name: 'Lane 4 – Mei Lin',
    laneOrGroup: 'Heat A',
    isRunning: false,
    accumulatedMs: 0,
    startedAtPerfMs: null,
    laps: [],
  },
];

function getMonotonicMs(): number {
  return typeof performance !== 'undefined' ? performance.now() : Date.now();
}

export default function MultiStopwatchComponent() {
  const [items, setItems] = useState<ParticipantStopwatch[]>(INITIAL_PARTICIPANTS);
  const [nowPerfMs, setNowPerfMs] = useState<number>(0);
  const [newName, setNewName] = useState<string>('');
  const [newGroup, setNewGroup] = useState<string>('Heat A');
  const [nameError, setNameError] = useState<string>('');
  const [relayMode, setRelayMode] = useState<boolean>(false);

  const anyRunning = items.some((i) => i.isRunning);

  // Manage wake lock according to running state
  useEffect(() => {
    if (anyRunning) {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }
    return () => {
      releaseWakeLock();
    };
  }, [anyRunning]);

  useEffect(() => {
    if (!anyRunning) return;
    let rafId: number;
    const update = () => {
      setNowPerfMs(getMonotonicMs());
      rafId = requestAnimationFrame(update);
    };
    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, [anyRunning]);

  const handleStartOne = (id: string) => {
    const now = getMonotonicMs();
    setNowPerfMs(now);
    setItems((prev) =>
      prev.map((item) => (item.id === id ? startStopwatchItem(item, now) : item))
    );
  };

  const handlePauseOne = (id: string, index: number) => {
    const now = getMonotonicMs();
    setNowPerfMs(now);
    setItems((prev) => {
      const next = prev.map((item) =>
        item.id === id ? pauseStopwatchItem(item, now) : item
      );
      // If Relay Mode is enabled, stopping participant N automatically starts participant N+1
      if (relayMode && index + 1 < next.length) {
        next[index + 1] = startStopwatchItem(next[index + 1], now);
      }
      return next;
    });
  };

  const handleResetOne = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? resetStopwatchItem(item) : item))
    );
  };

  const handleLapOne = (id: string) => {
    const now = getMonotonicMs();
    setNowPerfMs(now);
    playTimerSound('beep', 0.4);
    setItems((prev) =>
      prev.map((item) => (item.id === id ? recordStopwatchLap(item, now) : item))
    );
  };

  const handleStartAll = () => {
    const now = getMonotonicMs();
    setNowPerfMs(now);
    setItems((prev) => prev.map((item) => startStopwatchItem(item, now)));
  };

  const handleStopAll = () => {
    const now = getMonotonicMs();
    setNowPerfMs(now);
    setItems((prev) => prev.map((item) => pauseStopwatchItem(item, now)));
  };

  const handleResetAll = () => {
    setItems((prev) => prev.map((item) => resetStopwatchItem(item)));
  };

  const handleApplyTemplate = (tpl: typeof TEMPLATES[0]) => {
    const newItems: ParticipantStopwatch[] = tpl.participants.map((p, i) => ({
      id: `sw-${Date.now()}-${i}`,
      name: p.name,
      laneOrGroup: p.group,
      isRunning: false,
      accumulatedMs: 0,
      startedAtPerfMs: null,
      laps: [],
    }));
    setItems(newItems);
  };

  const handleAddParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateParticipantName(
      newName,
      items.map((i) => i.name)
    );
    if (!validation.valid) {
      setNameError(validation.error || 'Invalid participant name.');
      return;
    }
    setNameError('');
    const nextItem: ParticipantStopwatch = {
      id: `sw-${getMonotonicMs()}`,
      name: validation.sanitized,
      laneOrGroup: newGroup.trim() || 'General',
      isRunning: false,
      accumulatedMs: 0,
      startedAtPerfMs: null,
      laps: [],
    };
    setItems((prev) => [...prev, nextItem]);
    setNewName('');
  };

  const handleRemoveParticipant = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleExportCsv = () => {
    const csv = exportMultiStopwatchCsv(items, getMonotonicMs());
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `webcountdowntimer-multi-stopwatch-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Master Batch Action Bar */}
      <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleStartAll}
            className="h-11 px-5 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white font-bold text-sm flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Start All ({items.length})</span>
          </button>

          <button
            type="button"
            onClick={handleStopAll}
            className="h-11 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Pause className="w-4 h-4 fill-current" />
            <span>Stop All</span>
          </button>

          <button
            type="button"
            onClick={handleResetAll}
            className="h-11 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset All</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Relay Handoff Toggle */}
          <button
            type="button"
            onClick={() => setRelayMode((prev) => !prev)}
            className={`h-10 px-3.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer ${
              relayMode
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300'
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
            }`}
            title="When enabled, stopping one stopwatch automatically starts the next participant in sequence"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Relay Mode: {relayMode ? 'ON' : 'OFF'}</span>
          </button>

          {/* Export CSV */}
          <button
            type="button"
            onClick={handleExportCsv}
            className="h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Quick Setup Templates Bar */}
      <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
          <Sparkles className="w-4 h-4 text-[#2563EB]" />
          <span>Quick Setup Templates:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {TEMPLATES.map((tpl) => (
            <button
              key={tpl.label}
              type="button"
              onClick={() => handleApplyTemplate(tpl)}
              className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-400 text-slate-700 dark:text-slate-200 font-semibold cursor-pointer transition-colors"
            >
              {tpl.label}
            </button>
          ))}
        </div>
      </div>

      {/* Add New Participant Form */}
      <form
        onSubmit={handleAddParticipant}
        className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
      >
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 shrink-0">
          <Users className="w-4 h-4 text-[#2563EB]" />
          <span>Add Stopwatch:</span>
        </div>
        <input
          type="text"
          value={newName}
          onChange={(e) => {
            setNewName(e.target.value);
            if (nameError) setNameError('');
          }}
          placeholder="Participant or lane name (e.g., Lane 5 – Jordan)"
          className="flex-1 h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white"
        />
        <input
          type="text"
          value={newGroup}
          onChange={(e) => setNewGroup(e.target.value)}
          placeholder="Group / Heat"
          className="w-full sm:w-36 h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
        />
        <button
          type="submit"
          className="h-10 px-4 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Timer</span>
        </button>
        {nameError && (
          <p className="text-xs font-semibold text-red-600 dark:text-red-400 sm:ml-2">
            {nameError}
          </p>
        )}
      </form>

      {/* Responsive Grid of Independent Stopwatches */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item, idx) => {
          const elapsedMs = computeElapsedMs(item, nowPerfMs);
          const formatted = formatStopwatchMs(elapsedMs);

          // Calculate fastest and slowest laps for badges
          let minLapMs = Infinity;
          let maxLapMs = -Infinity;
          if (item.laps.length >= 2) {
            item.laps.forEach((l) => {
              if (l.lapDurationMs < minLapMs) minLapMs = l.lapDurationMs;
              if (l.lapDurationMs > maxLapMs) maxLapMs = l.lapDurationMs;
            });
          }

          return (
            <div
              key={item.id}
              className={`rounded-2xl bg-white dark:bg-[#0F172A] border p-5 transition-all flex flex-col justify-between ${
                item.isRunning
                  ? 'border-[#2563EB] ring-1 ring-[#2563EB]/20 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    #{idx + 1} · {item.laneOrGroup}
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                    {item.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveParticipant(item.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  aria-label={`Remove ${item.name}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Elapsed Time Readout */}
              <div className="my-4 py-3 px-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 flex items-baseline justify-between">
                <div className="text-3xl sm:text-4xl font-black font-mono tabular-nums text-slate-900 dark:text-white tracking-tight">
                  {formatted.main}
                  <span className="text-xl text-[#2563EB] ml-0.5">.{formatted.centiseconds}</span>
                </div>
                <span className="text-xs font-semibold text-slate-500">
                  {item.laps.length} {item.laps.length === 1 ? 'lap' : 'laps'}
                </span>
              </div>

              {/* Individual Controls */}
              <div className="grid grid-cols-3 gap-2">
                {item.isRunning ? (
                  <button
                    type="button"
                    onClick={() => handlePauseOne(item.id, idx)}
                    className="h-10 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>{relayMode && idx + 1 < items.length ? 'Stop & Handoff' : 'Stop'}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleStartOne(item.id)}
                    className="h-10 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Start</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleLapOne(item.id)}
                  disabled={elapsedMs <= 0}
                  className="h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 disabled:opacity-40 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Flag className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Lap</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleResetOne(item.id)}
                  className="h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Recent Laps List with Fastest / Slowest Highlights */}
              {item.laps.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 max-h-36 overflow-y-auto space-y-1.5 text-xs font-mono">
                  {item.laps.slice(0, 6).map((lap) => {
                    const isFastest = item.laps.length >= 2 && lap.lapDurationMs === minLapMs;
                    const isSlowest = item.laps.length >= 2 && lap.lapDurationMs === maxLapMs;

                    return (
                      <div
                        key={lap.lapNumber}
                        className={`flex items-center justify-between p-1 rounded-md ${
                          isFastest
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                            : isSlowest
                            ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300'
                            : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <span className="flex items-center gap-1">
                          <span>Lap #{lap.lapNumber}</span>
                          {isFastest && (
                            <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-600 text-white font-bold uppercase">
                              Fastest
                            </span>
                          )}
                          {isSlowest && (
                            <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500 text-slate-950 font-bold uppercase">
                              Slowest
                            </span>
                          )}
                        </span>
                        <span>+{formatStopwatchMs(lap.lapDurationMs).full}</span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {formatStopwatchMs(lap.totalElapsedMs).full}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

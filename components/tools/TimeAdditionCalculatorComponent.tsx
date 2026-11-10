'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Copy, Check, RotateCcw } from 'lucide-react';
import {
  TimeEntryRow,
  calculateTimeAddition,
} from '@/lib/calculators/time-calculators';

const INITIAL_ROWS: TimeEntryRow[] = [
  { id: 'r1', label: 'Segment 1', operation: 'add', hours: 1, minutes: 45, seconds: 30 },
  { id: 'r2', label: 'Segment 2', operation: 'add', hours: 2, minutes: 20, seconds: 15 },
  { id: 'r3', label: 'Segment 3', operation: 'add', hours: 0, minutes: 35, seconds: 45 },
];

export default function TimeAdditionCalculatorComponent() {
  const [rows, setRows] = useState<TimeEntryRow[]>(INITIAL_ROWS);
  const [copied, setCopied] = useState<boolean>(false);

  const result = calculateTimeAddition(rows);

  const handleUpdateRow = (id: string, patch: Partial<TimeEntryRow>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const handleAddRow = () => {
    setRows((prev) => [
      ...prev,
      {
        id: `row-${Date.now()}`,
        label: `Segment ${prev.length + 1}`,
        operation: 'add',
        hours: 0,
        minutes: 0,
        seconds: 0,
      },
    ]);
  };

  const handleRemoveRow = (id: string) => {
    if (rows.length <= 1) return;
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const handleCopy = () => {
    navigator.clipboard
      ?.writeText(`Total Time: ${result.formattedHMS} (${result.decimalHours} decimal hours)`)
      .catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left 7 Cols: Duration Rows */}
      <div className="lg:col-span-7 bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
            Time Duration Entries ({rows.length})
          </h2>
          <button
            type="button"
            onClick={() => setRows(INITIAL_ROWS)}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        <div className="space-y-3">
          {rows.map((row, idx) => (
            <div
              key={row.id}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 grid grid-cols-12 gap-2 items-center"
            >
              {/* Operation (+ / -) */}
              <div className="col-span-3 sm:col-span-2">
                <select
                  value={row.operation}
                  onChange={(e) =>
                    handleUpdateRow(row.id, {
                      operation: e.target.value as 'add' | 'subtract',
                    })
                  }
                  aria-label={`Operation for row ${idx + 1}`}
                  className={`w-full h-10 px-2 rounded-lg text-xs font-bold border ${
                    row.operation === 'add'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                      : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                  }`}
                >
                  <option value="add">+ Add</option>
                  <option value="subtract">− Sub</option>
                </select>
              </div>

              {/* Hours */}
              <div className="col-span-3">
                <label className="block text-[10px] text-slate-500 mb-0.5">Hours</label>
                <input
                  type="number"
                  min={0}
                  max={9999}
                  value={row.hours}
                  onChange={(e) =>
                    handleUpdateRow(row.id, { hours: Math.max(0, Number(e.target.value) || 0) })
                  }
                  className="w-full h-9 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono font-bold"
                />
              </div>

              {/* Minutes */}
              <div className="col-span-3">
                <label className="block text-[10px] text-slate-500 mb-0.5">Minutes</label>
                <input
                  type="number"
                  min={0}
                  max={999}
                  value={row.minutes}
                  onChange={(e) =>
                    handleUpdateRow(row.id, { minutes: Math.max(0, Number(e.target.value) || 0) })
                  }
                  className="w-full h-9 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono font-bold"
                />
              </div>

              {/* Seconds */}
              <div className="col-span-2 sm:col-span-3">
                <label className="block text-[10px] text-slate-500 mb-0.5">Seconds</label>
                <input
                  type="number"
                  min={0}
                  max={999}
                  value={row.seconds}
                  onChange={(e) =>
                    handleUpdateRow(row.id, { seconds: Math.max(0, Number(e.target.value) || 0) })
                  }
                  className="w-full h-9 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono font-bold"
                />
              </div>

              {/* Remove */}
              <div className="col-span-1 flex justify-end pt-3">
                <button
                  type="button"
                  onClick={() => handleRemoveRow(row.id)}
                  disabled={rows.length <= 1}
                  className="p-1.5 text-slate-400 hover:text-red-600 disabled:opacity-30 cursor-pointer"
                  aria-label={`Remove row ${idx + 1}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleAddRow}
          className="w-full h-11 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-[#2563EB] text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#2563EB]" />
          <span>Add Duration Row</span>
        </button>
      </div>

      {/* Right 5 Cols: Running Total Card */}
      <div className="lg:col-span-5 bg-[#0F172A] text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-lg space-y-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-blue-400">
          Cumulative Time Total
        </div>

        <div className="text-4xl sm:text-5xl font-black font-mono tabular-nums tracking-tight">
          {result.formattedHMS}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-xs text-slate-400">Decimal Hours</div>
            <div className="text-xl font-extrabold font-mono tabular-nums mt-0.5">
              {result.decimalHours}h
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-xs text-slate-400">Total Seconds</div>
            <div className="text-xl font-extrabold font-mono tabular-nums mt-0.5">
              {result.totalSeconds.toLocaleString()}s
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="w-full h-11 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span>Total Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy Total Result</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

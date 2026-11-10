'use client';

import React, { useState } from 'react';
import { Calendar, ArrowLeftRight, RotateCcw } from 'lucide-react';

export default function DateCalculatorComponent() {
  const [startDate, setStartDate] = useState<string>('2026-10-26');
  const [endDate, setEndDate] = useState<string>('2026-12-31');
  const [includeEndDay, setIncludeEndDay] = useState<boolean>(false);

  const sDate = new Date(`${startDate}T00:00:00Z`);
  const eDate = new Date(`${endDate}T00:00:00Z`);

  const valid = !Number.isNaN(sDate.getTime()) && !Number.isNaN(eDate.getTime());
  const rawDiffDays = valid ? Math.round((eDate.getTime() - sDate.getTime()) / 86400000) : 0;
  const absDays = Math.abs(rawDiffDays) + (includeEndDay ? 1 : 0);

  const weeks = Math.floor(absDays / 7);
  const remDays = absDays % 7;
  const approxMonths = Number((absDays / 30.4375).toFixed(1));
  const totalHours = absDays * 24;

  // Compute business weekdays (Mon-Fri)
  let weekdays = 0;
  let weekendDays = 0;
  if (valid && absDays <= 3660) {
    const startMs = Math.min(sDate.getTime(), eDate.getTime());
    for (let i = 0; i < absDays; i++) {
      const cur = new Date(startMs + i * 86400000);
      const dayOfWeek = cur.getUTCDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        weekendDays++;
      } else {
        weekdays++;
      }
    }
  } else {
    weekdays = Math.round(absDays * (5 / 7));
    weekendDays = absDays - weekdays;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      {/* Left Card */}
      <div className="lg:col-span-6 bg-white dark:bg-[#1A201C] rounded-2xl border border-[#E4E1D9] dark:border-[#2D352F] p-6 sm:p-7 shadow-2xs flex flex-col justify-between">
        <div className="space-y-5">
          <h2 className="text-base sm:text-lg font-bold text-[#252B27] dark:text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#365C4B]" />
            <span>Select Start and End Dates</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#252B27]/80 dark:text-slate-300 mb-1.5">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-[#E4E1D9] dark:border-[#2D352F] bg-white dark:bg-[#151A17] text-sm font-mono font-bold text-[#252B27] dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#252B27]/80 dark:text-slate-300 mb-1.5">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-[#E4E1D9] dark:border-[#2D352F] bg-white dark:bg-[#151A17] text-sm font-mono font-bold text-[#252B27] dark:text-white"
              />
            </div>
          </div>

          <label className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-[#252B27]/80 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={includeEndDay}
              onChange={(e) => setIncludeEndDay(e.target.checked)}
              className="rounded border-[#E4E1D9] text-[#365C4B]"
            />
            <span>Include end date in calculation (+1 day)</span>
          </label>
        </div>

        <div className="flex items-center gap-3 pt-5 mt-5 border-t border-[#E4E1D9] dark:border-[#2D352F]">
          <button
            type="button"
            onClick={() => {
              setStartDate(endDate);
              setEndDate(startDate);
            }}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#E4E1D9] dark:border-[#2D352F] text-xs font-semibold text-[#252B27] dark:text-slate-200 hover:bg-[#F7F6F2] cursor-pointer"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-[#365C4B]" />
            <span>Swap Dates</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setStartDate('2026-10-26');
              setEndDate('2026-12-31');
              setIncludeEndDay(false);
            }}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#E4E1D9] dark:border-[#2D352F] text-xs font-semibold text-[#252B27] dark:text-slate-200 hover:bg-[#F7F6F2] cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#365C4B]" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Right Card */}
      <div className="lg:col-span-6 bg-white dark:bg-[#1A201C] rounded-2xl border border-[#E4E1D9] dark:border-[#2D352F] p-6 sm:p-7 shadow-2xs flex flex-col justify-between">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#252B27]/60 dark:text-slate-400 font-semibold block mb-1">
            Calendar Duration
          </span>
          <div className="font-serif text-4xl sm:text-5xl leading-tight font-normal text-[#252B27] dark:text-white mb-2">
            {absDays.toLocaleString()} {absDays === 1 ? 'day' : 'days'}
          </div>
          <p className="text-xs sm:text-sm text-[#365C4B] dark:text-[#5E917A] font-medium mb-6">
            {weeks} weeks and {remDays} days · Approx. {approxMonths} months
          </p>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="p-3.5 rounded-xl bg-[#F7F6F2] dark:bg-[#202722] border border-[#E4E1D9]/80 dark:border-[#2D352F]">
              <div className="text-lg sm:text-xl font-bold font-mono text-[#252B27] dark:text-white">
                {weekdays.toLocaleString()}
              </div>
              <div className="text-[11px] sm:text-xs text-[#252B27]/65 dark:text-slate-400 mt-0.5">
                Weekdays
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#F7F6F2] dark:bg-[#202722] border border-[#E4E1D9]/80 dark:border-[#2D352F]">
              <div className="text-lg sm:text-xl font-bold font-mono text-[#252B27] dark:text-white">
                {weekendDays.toLocaleString()}
              </div>
              <div className="text-[11px] sm:text-xs text-[#252B27]/65 dark:text-slate-400 mt-0.5">
                Weekend Days
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#F7F6F2] dark:bg-[#202722] border border-[#E4E1D9]/80 dark:border-[#2D352F]">
              <div className="text-lg sm:text-xl font-bold font-mono text-[#252B27] dark:text-white">
                {totalHours.toLocaleString()}
              </div>
              <div className="text-[11px] sm:text-xs text-[#252B27]/65 dark:text-slate-400 mt-0.5">
                Total Hours
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#E4E1D9] dark:border-[#2D352F] pt-4 text-xs sm:text-sm text-[#252B27]/80 dark:text-slate-300">
          Total minutes: <strong className="font-mono">{(totalHours * 60).toLocaleString()}</strong> · Total seconds:{' '}
          <strong className="font-mono">{(totalHours * 3600).toLocaleString()}</strong>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { Clock, Calendar, ArrowRight, ArrowLeftRight, RotateCcw, FileText, Check } from 'lucide-react';

interface CalculationState {
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  days: number;
  hours: number;
  minutes: number;
  totalMinutes: number;
  decimalHours: number;
  formattedDuration: string;
  startDateDisplay: string;
  endDateDisplay: string;
  isOvernight: boolean;
}

const COMMON_TIMES = [
  '6:00 AM', '6:30 AM', '7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM',
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
  '6:00 PM', '6:15 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM',
  '9:00 PM', '10:00 PM', '11:00 PM', '11:30 PM', '12:00 AM'
];

function parseTimeString(str: string): { h: number; m: number; s: number } | null {
  if (!str) return null;
  const trimmed = str.trim();
  const match = /^(\d{1,2})(?::(\d{2}))?(?::(\d{2}))?\s*(AM|PM)?$/i.exec(trimmed);
  if (!match) return null;

  let h = parseInt(match[1], 10);
  const m = match[2] ? parseInt(match[2], 10) : 0;
  const s = match[3] ? parseInt(match[3], 10) : 0;
  const period = match[4] ? match[4].toUpperCase() : null;

  if (period === 'PM' && h < 12) h += 12;
  if (period === 'AM' && h === 12) h = 0;

  if (h < 0 || h > 23 || m < 0 || m > 59 || s < 0 || s > 59) return null;
  return { h, m, s };
}

function parseDateInput(str: string): Date | null {
  if (!str) return null;
  const trimmed = str.trim();
  const d = new Date(trimmed);
  if (!Number.isNaN(d.getTime())) return d;
  return null;
}

function formatDateToStandard(date: Date): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

export default function TimeDurationCalculatorComponent() {
  const [startDateInput, setStartDateInput] = useState<string>('Oct 26, 2026');
  const [startTimeInput, setStartTimeInput] = useState<string>('9:00 AM');
  const [endDateInput, setEndDateInput] = useState<string>('Oct 26, 2026');
  const [endTimeInput, setEndTimeInput] = useState<string>('5:30 PM');

  const [calculation, setCalculation] = useState<CalculationState>({
    startDate: 'Oct 26, 2026',
    startTime: '9:00 AM',
    endDate: 'Oct 26, 2026',
    endTime: '5:30 PM',
    days: 0,
    hours: 8,
    minutes: 30,
    totalMinutes: 510,
    decimalHours: 8.5,
    formattedDuration: '8 hours 30 minutes',
    startDateDisplay: 'Oct 26, 2026, 9:00 AM',
    endDateDisplay: 'Oct 26, 2026, 5:30 PM',
    isOvernight: false,
  });

  const compute = (
    sDateStr: string,
    sTimeStr: string,
    eDateStr: string,
    eTimeStr: string
  ) => {
    const sTime = parseTimeString(sTimeStr);
    const eTime = parseTimeString(eTimeStr);

    if (!sTime || !eTime) return;

    const sDate = parseDateInput(sDateStr) || new Date('2026-10-26T00:00:00');
    const eDate = parseDateInput(eDateStr) || new Date('2026-10-26T00:00:00');

    const startSec = sTime.h * 3600 + sTime.m * 60 + sTime.s;
    const endSec = eTime.h * 3600 + eTime.m * 60 + eTime.s;

    // Calendar day delta in seconds (ignoring timezone drift)
    const startMidnightUtc = Date.UTC(sDate.getFullYear(), sDate.getMonth(), sDate.getDate());
    const endMidnightUtc = Date.UTC(eDate.getFullYear(), eDate.getMonth(), eDate.getDate());
    let dayDiffSec = Math.round((endMidnightUtc - startMidnightUtc) / 1000);

    let isOvernight = false;
    let totalSec = 0;

    if (dayDiffSec === 0 && endSec < startSec) {
      // Automatic cross-midnight handling when same date is kept
      totalSec = (86400 - startSec) + endSec;
      isOvernight = true;
    } else {
      totalSec = dayDiffSec + (endSec - startSec);
      if (totalSec < 0) {
        // If end was before start on calendar, default to overnight rollover
        totalSec = (86400 - startSec) + endSec;
        isOvernight = true;
      } else if (dayDiffSec > 0) {
        isOvernight = true;
      }
    }

    const days = Math.floor(totalSec / 86400);
    const remAfterDays = totalSec % 86400;
    const hours = Math.floor(remAfterDays / 3600);
    const minutes = Math.floor((remAfterDays % 3600) / 60);

    const totalMinutes = Math.round(totalSec / 60);
    const decimalHours = Number((totalSec / 3600).toFixed(2));

    let formattedDuration = '';
    if (days > 0) {
      formattedDuration = `${days} day${days > 1 ? 's' : ''} ${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
    } else {
      formattedDuration = `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }

    const sDateFormatted = formatDateToStandard(sDate);
    const eDateFormatted = formatDateToStandard(eDate);

    setCalculation({
      startDate: sDateFormatted,
      startTime: sTimeStr,
      endDate: eDateFormatted,
      endTime: eTimeStr,
      days,
      hours,
      minutes,
      totalMinutes,
      decimalHours,
      formattedDuration,
      startDateDisplay: `${sDateFormatted}, ${sTimeStr}`,
      endDateDisplay: `${eDateFormatted}, ${eTimeStr}`,
      isOvernight,
    });
  };

  const handleCalculate = () => {
    compute(startDateInput, startTimeInput, endDateInput, endTimeInput);
  };

  const handleSwap = () => {
    const nextStartD = endDateInput;
    const nextStartT = endTimeInput;
    const nextEndD = startDateInput;
    const nextEndT = startTimeInput;

    setStartDateInput(nextStartD);
    setStartTimeInput(nextStartT);
    setEndDateInput(nextEndD);
    setEndTimeInput(nextEndT);
    compute(nextStartD, nextStartT, nextEndD, nextEndT);
  };

  const handleReset = () => {
    setStartDateInput('Oct 26, 2026');
    setStartTimeInput('9:00 AM');
    setEndDateInput('Oct 26, 2026');
    setEndTimeInput('5:30 PM');
    compute('Oct 26, 2026', '9:00 AM', 'Oct 26, 2026', '5:30 PM');
  };

  const applyExample = (
    sTime: string,
    eTime: string,
    sDate = 'Oct 26, 2026',
    eDate = 'Oct 26, 2026'
  ) => {
    setStartDateInput(sDate);
    setStartTimeInput(sTime);
    setEndDateInput(eDate);
    setEndTimeInput(eTime);
    compute(sDate, sTime, eDate, eTime);
  };

  return (
    <div className="space-y-12">
      {/* Main Two-Column Calculator Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Column: Enter Your Times */}
        <div className="lg:col-span-6 bg-white dark:bg-[#1A201C] rounded-2xl border border-[#E4E1D9] dark:border-[#2D352F] p-6 sm:p-7 shadow-2xs flex flex-col justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#252B27] dark:text-white mb-6">
              Enter Your Times
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {/* Start Date */}
              <div>
                <label className="block text-xs font-semibold text-[#252B27]/80 dark:text-slate-300 mb-1.5">
                  Start Date (Optional)
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-[#252B27]/40 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={startDateInput}
                    onChange={(e) => setStartDateInput(e.target.value)}
                    placeholder="Oct 26, 2026"
                    className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-[#E4E1D9] dark:border-[#2D352F] bg-white dark:bg-[#151A17] text-sm font-medium text-[#252B27] dark:text-white focus:outline-hidden focus:border-[#365C4B] transition-colors"
                  />
                </div>
              </div>

              {/* Start Time */}
              <div>
                <label className="block text-xs font-semibold text-[#252B27]/80 dark:text-slate-300 mb-1.5">
                  Start Time
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-[#252B27]/40 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={startTimeInput}
                    onChange={(e) => setStartTimeInput(e.target.value)}
                    className="w-full h-11 pl-10 pr-8 rounded-xl border border-[#E4E1D9] dark:border-[#2D352F] bg-white dark:bg-[#151A17] text-sm font-medium text-[#252B27] dark:text-white focus:outline-hidden focus:border-[#365C4B] transition-colors appearance-none cursor-pointer"
                  >
                    {COMMON_TIMES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                    {!COMMON_TIMES.includes(startTimeInput) && (
                      <option value={startTimeInput}>{startTimeInput}</option>
                    )}
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#252B27]/40 dark:text-slate-500 text-xs">
                    ▼
                  </div>
                </div>
              </div>

              {/* End Date */}
              <div>
                <label className="block text-xs font-semibold text-[#252B27]/80 dark:text-slate-300 mb-1.5">
                  End Date (Optional)
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-[#252B27]/40 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={endDateInput}
                    onChange={(e) => setEndDateInput(e.target.value)}
                    placeholder="Oct 26, 2026"
                    className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-[#E4E1D9] dark:border-[#2D352F] bg-white dark:bg-[#151A17] text-sm font-medium text-[#252B27] dark:text-white focus:outline-hidden focus:border-[#365C4B] transition-colors"
                  />
                </div>
              </div>

              {/* End Time */}
              <div>
                <label className="block text-xs font-semibold text-[#252B27]/80 dark:text-slate-300 mb-1.5">
                  End Time
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-[#252B27]/40 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={endTimeInput}
                    onChange={(e) => setEndTimeInput(e.target.value)}
                    className="w-full h-11 pl-10 pr-8 rounded-xl border border-[#E4E1D9] dark:border-[#2D352F] bg-white dark:bg-[#151A17] text-sm font-medium text-[#252B27] dark:text-white focus:outline-hidden focus:border-[#365C4B] transition-colors appearance-none cursor-pointer"
                  >
                    {COMMON_TIMES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                    {!COMMON_TIMES.includes(endTimeInput) && (
                      <option value={endTimeInput}>{endTimeInput}</option>
                    )}
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#252B27]/40 dark:text-slate-500 text-xs">
                    ▼
                  </div>
                </div>
              </div>
            </div>

            {/* Calculate Duration Button */}
            <button
              type="button"
              onClick={handleCalculate}
              className="w-full h-12 rounded-xl bg-[#365C4B] hover:bg-[#2c4c3e] text-white font-medium text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-2xs mb-4"
            >
              <span>Calculate Duration</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Secondary Actions: Swap Times & Reset */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleSwap}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#E4E1D9] dark:border-[#2D352F] hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-[#252B27] dark:text-slate-200 transition-colors cursor-pointer"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-[#365C4B]" />
              <span>Swap Times</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#E4E1D9] dark:border-[#2D352F] hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-[#252B27] dark:text-slate-200 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#365C4B]" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Right Column: Time Duration Output */}
        <div className="lg:col-span-6 bg-white dark:bg-[#1A201C] rounded-2xl border border-[#E4E1D9] dark:border-[#2D352F] p-6 sm:p-7 shadow-2xs flex flex-col justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-[#252B27]/60 dark:text-slate-400 font-semibold block mb-1">
              Time Duration
            </span>
            <div className="font-serif text-3xl sm:text-4xl lg:text-[42px] leading-tight font-normal text-[#252B27] dark:text-white mb-6">
              {calculation.formattedDuration}
            </div>

            {/* 3 Metric Badges */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="p-3.5 rounded-xl bg-[#F7F6F2] dark:bg-[#202722] border border-[#E4E1D9]/80 dark:border-[#2D352F] text-center sm:text-left">
                <div className="text-xl sm:text-2xl font-bold font-mono text-[#252B27] dark:text-white">
                  {calculation.totalMinutes}
                </div>
                <div className="text-[11px] sm:text-xs text-[#252B27]/65 dark:text-slate-400 mt-0.5">
                  Total Minutes
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F7F6F2] dark:bg-[#202722] border border-[#E4E1D9]/80 dark:border-[#2D352F] text-center sm:text-left">
                <div className="text-xl sm:text-2xl font-bold font-mono text-[#252B27] dark:text-white">
                  {calculation.decimalHours}
                </div>
                <div className="text-[11px] sm:text-xs text-[#252B27]/65 dark:text-slate-400 mt-0.5">
                  Decimal Hours
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F7F6F2] dark:bg-[#202722] border border-[#E4E1D9]/80 dark:border-[#2D352F] text-center sm:text-left">
                <div className="text-xl sm:text-2xl font-bold font-mono text-[#252B27] dark:text-white">
                  {calculation.days} days
                </div>
                <div className="text-[11px] sm:text-xs text-[#252B27]/65 dark:text-slate-400 mt-0.5">
                  Total Days
                </div>
              </div>
            </div>
          </div>

          {/* Calculation Details */}
          <div className="border-t border-[#E4E1D9] dark:border-[#2D352F] pt-5">
            <h3 className="font-semibold text-sm text-[#252B27] dark:text-white mb-3">
              Calculation Details
            </h3>
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex items-center justify-between text-[#252B27]/80 dark:text-slate-300">
                <span>Start time:</span>
                <span className="font-medium text-[#252B27] dark:text-white font-mono">
                  {calculation.startDateDisplay}
                </span>
              </div>
              <div className="flex items-center justify-between text-[#252B27]/80 dark:text-slate-300">
                <span>End time:</span>
                <span className="font-medium text-[#252B27] dark:text-white font-mono">
                  {calculation.endDateDisplay}
                </span>
              </div>
              <div className="flex items-center justify-between text-[#252B27] dark:text-white">
                <span className="font-medium">Total duration:</span>
                <span className="font-bold text-[#252B27] dark:text-white">
                  {calculation.formattedDuration}
                </span>
              </div>
              <div className="flex items-center justify-between text-[#252B27]/80 dark:text-slate-300">
                <span>In minutes:</span>
                <span className="font-medium text-[#252B27] dark:text-white font-mono">
                  {calculation.totalMinutes} minutes
                </span>
              </div>
              <div className="flex items-center justify-between text-[#252B27]/80 dark:text-slate-300">
                <span>In decimal hours:</span>
                <span className="font-medium text-[#252B27] dark:text-white font-mono">
                  {calculation.decimalHours} hours
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Try These Examples Section */}
      <div>
        <div className="mb-4">
          <h2 className="font-serif text-2xl font-normal text-[#252B27] dark:text-white">
            Try These Examples
          </h2>
          <p className="text-xs sm:text-sm text-[#252B27]/70 dark:text-slate-400 mt-1">
            Click an example to load the times:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {[
            { label: '9 AM to 5 PM', duration: '8 hours 0 minutes', start: '9:00 AM', end: '5:00 PM', sDate: 'Oct 26, 2026', eDate: 'Oct 26, 2026' },
            { label: '10 PM to 6 AM', duration: '8 hours 0 minutes', start: '10:00 PM', end: '6:00 AM', sDate: 'Oct 26, 2026', eDate: 'Oct 27, 2026' },
            { label: '9:30 AM to 6:15 PM', duration: '8 hours 45 minutes', start: '9:30 AM', end: '6:15 PM', sDate: 'Oct 26, 2026', eDate: 'Oct 26, 2026' },
            { label: '11 PM to 7 AM', duration: '8 hours 0 minutes', start: '11:00 PM', end: '7:00 AM', sDate: 'Oct 26, 2026', eDate: 'Oct 27, 2026' },
            { label: '8 AM to 12:30 PM', duration: '4 hours 30 minutes', start: '8:00 AM', end: '12:30 PM', sDate: 'Oct 26, 2026', eDate: 'Oct 26, 2026' },
          ].map((ex, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyExample(ex.start, ex.end, ex.sDate, ex.eDate)}
              className="bg-white dark:bg-[#1A201C] border border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#365C4B] rounded-xl p-3.5 text-left flex items-start gap-3 transition-all cursor-pointer group shadow-2xs"
            >
              <FileText className="w-4 h-4 text-[#365C4B] dark:text-[#5E917A] mt-0.5 shrink-0" />
              <div>
                <div className="font-bold text-xs sm:text-sm text-[#252B27] dark:text-white group-hover:text-[#365C4B] dark:group-hover:text-[#5E917A] transition-colors">
                  {ex.label}
                </div>
                <div className="text-xs text-[#252B27]/60 dark:text-slate-400 mt-0.5">
                  {ex.duration}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

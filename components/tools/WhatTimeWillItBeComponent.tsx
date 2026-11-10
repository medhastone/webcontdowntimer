'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Plus, Minus, RotateCcw, Calendar } from 'lucide-react';

export default function WhatTimeWillItBeComponent() {
  const [useLiveNow, setUseLiveNow] = useState<boolean>(true);
  const [baseDate, setBaseDate] = useState<Date>(() => new Date());
  const [customTimeStr, setCustomTimeStr] = useState<string>('10:00');
  const [operation, setOperation] = useState<'add' | 'subtract'>('add');
  const [addHours, setAddHours] = useState<number>(0);
  const [addMinutes, setAddMinutes] = useState<number>(30);
  const [addSeconds, setAddSeconds] = useState<number>(0);

  useEffect(() => {
    if (!useLiveNow) return;
    const interval = setInterval(() => {
      setBaseDate(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, [useLiveNow]);

  // Calculate starting timestamp
  const getStartTimestamp = (): Date => {
    if (useLiveNow) return baseDate;
    const [hStr, mStr] = customTimeStr.split(':');
    const d = new Date();
    d.setHours(parseInt(hStr || '10', 10), parseInt(mStr || '0', 10), 0, 0);
    return d;
  };

  const startDateObj = getStartTimestamp();
  const deltaMs = (addHours * 3600 + addMinutes * 60 + addSeconds) * 1000;
  const targetDateObj = new Date(
    startDateObj.getTime() + (operation === 'add' ? deltaMs : -deltaMs)
  );

  const format12Hour = (d: Date) =>
    d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: addSeconds > 0 ? '2-digit' : undefined,
      hour12: true,
    });

  const format24Hour = (d: Date) =>
    d.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: addSeconds > 0 ? '2-digit' : undefined,
      hour12: false,
    });

  const formatDateFull = (d: Date) =>
    d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  const quickMinuteChips = [
    { label: 'In 10 minutes', h: 0, m: 10 },
    { label: 'In 15 minutes', h: 0, m: 15 },
    { label: 'In 20 minutes', h: 0, m: 20 },
    { label: 'In 25 minutes', h: 0, m: 25 },
    { label: 'In 30 minutes', h: 0, m: 30 },
    { label: 'In 45 minutes', h: 0, m: 45 },
    { label: 'In 60 minutes', h: 1, m: 0 },
    { label: 'In 90 minutes', h: 1, m: 30 },
    { label: 'In 2 hours', h: 2, m: 0 },
    { label: 'In 4 hours', h: 4, m: 0 },
    { label: 'In 8 hours', h: 8, m: 0 },
    { label: 'In 24 hours', h: 24, m: 0 },
  ];

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Card: Inputs */}
        <div className="lg:col-span-6 bg-white dark:bg-[#1A201C] rounded-2xl border border-[#E4E1D9] dark:border-[#2D352F] p-6 sm:p-7 shadow-2xs flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold text-[#252B27] dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#365C4B]" />
                <span>Configure Starting Time &amp; Offset</span>
              </h2>
            </div>

            {/* Start Time Mode Toggle */}
            <div>
              <label className="block text-xs font-semibold text-[#252B27]/80 dark:text-slate-300 mb-2">
                Starting Point
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setUseLiveNow(true)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    useLiveNow
                      ? 'bg-[#365C4B] text-white border-[#365C4B]'
                      : 'bg-[#F7F6F2] dark:bg-[#151A17] text-[#252B27] dark:text-slate-300 border-[#E4E1D9] dark:border-[#2D352F]'
                  }`}
                >
                  Current Time (Live)
                </button>
                <button
                  type="button"
                  onClick={() => setUseLiveNow(false)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    !useLiveNow
                      ? 'bg-[#365C4B] text-white border-[#365C4B]'
                      : 'bg-[#F7F6F2] dark:bg-[#151A17] text-[#252B27] dark:text-slate-300 border-[#E4E1D9] dark:border-[#2D352F]'
                  }`}
                >
                  Custom Start Time
                </button>
              </div>
            </div>

            {!useLiveNow && (
              <div>
                <label className="block text-xs font-semibold text-[#252B27]/80 dark:text-slate-300 mb-1.5">
                  Select Custom Starting Time
                </label>
                <input
                  type="time"
                  value={customTimeStr}
                  onChange={(e) => setCustomTimeStr(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#E4E1D9] dark:border-[#2D352F] bg-white dark:bg-[#151A17] text-sm font-mono font-bold text-[#252B27] dark:text-white"
                />
              </div>
            )}

            {/* Add or Subtract */}
            <div>
              <label className="block text-xs font-semibold text-[#252B27]/80 dark:text-slate-300 mb-2">
                Direction
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setOperation('add')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    operation === 'add'
                      ? 'bg-[#E7EDE7] dark:bg-[#252E28] text-[#365C4B] dark:text-[#5E917A] border-[#365C4B]'
                      : 'bg-white dark:bg-[#151A17] text-[#252B27]/70 dark:text-slate-400 border-[#E4E1D9] dark:border-[#2D352F]'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>In the Future (+ Add)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOperation('subtract')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    operation === 'subtract'
                      ? 'bg-[#E7EDE7] dark:bg-[#252E28] text-[#365C4B] dark:text-[#5E917A] border-[#365C4B]'
                      : 'bg-white dark:bg-[#151A17] text-[#252B27]/70 dark:text-slate-400 border-[#E4E1D9] dark:border-[#2D352F]'
                  }`}
                >
                  <Minus className="w-3.5 h-3.5" />
                  <span>In the Past (− Ago)</span>
                </button>
              </div>
            </div>

            {/* Hours / Minutes / Seconds Inputs */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#252B27]/80 dark:text-slate-300 mb-1.5">
                  Hours
                </label>
                <input
                  type="number"
                  min="0"
                  max="999"
                  value={addHours}
                  onChange={(e) => setAddHours(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className="w-full h-11 px-3 rounded-xl border border-[#E4E1D9] dark:border-[#2D352F] bg-white dark:bg-[#151A17] text-base font-mono font-bold text-[#252B27] dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#252B27]/80 dark:text-slate-300 mb-1.5">
                  Minutes
                </label>
                <input
                  type="number"
                  min="0"
                  max="9999"
                  value={addMinutes}
                  onChange={(e) => setAddMinutes(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className="w-full h-11 px-3 rounded-xl border border-[#E4E1D9] dark:border-[#2D352F] bg-white dark:bg-[#151A17] text-base font-mono font-bold text-[#252B27] dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#252B27]/80 dark:text-slate-300 mb-1.5">
                  Seconds
                </label>
                <input
                  type="number"
                  min="0"
                  max="9999"
                  value={addSeconds}
                  onChange={(e) => setAddSeconds(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className="w-full h-11 px-3 rounded-xl border border-[#E4E1D9] dark:border-[#2D352F] bg-white dark:bg-[#151A17] text-base font-mono font-bold text-[#252B27] dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="pt-5 mt-5 border-t border-[#E4E1D9] dark:border-[#2D352F] flex justify-end">
            <button
              type="button"
              onClick={() => {
                setUseLiveNow(true);
                setOperation('add');
                setAddHours(0);
                setAddMinutes(30);
                setAddSeconds(0);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#E4E1D9] dark:border-[#2D352F] text-xs font-semibold text-[#252B27] dark:text-slate-300 hover:bg-[#F7F6F2] cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#365C4B]" />
              <span>Reset to 30 Minutes</span>
            </button>
          </div>
        </div>

        {/* Right Card: Result */}
        <div className="lg:col-span-6 bg-white dark:bg-[#1A201C] rounded-2xl border border-[#E4E1D9] dark:border-[#2D352F] p-6 sm:p-7 shadow-2xs flex flex-col justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-[#252B27]/60 dark:text-slate-400 font-semibold block mb-1">
              {operation === 'add' ? 'Future Time Result' : 'Past Time Result'}
            </span>
            <div className="font-serif text-4xl sm:text-5xl leading-tight font-normal text-[#252B27] dark:text-white mb-2 tabular-nums">
              {format12Hour(targetDateObj)}
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-[#365C4B] dark:text-[#5E917A] font-medium mb-6">
              <Calendar className="w-4 h-4" />
              <span>{formatDateFull(targetDateObj)}</span>
              <span>·</span>
              <span className="font-mono">{format24Hour(targetDateObj)} (24-hr)</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-3.5 rounded-xl bg-[#F7F6F2] dark:bg-[#202722] border border-[#E4E1D9]/80 dark:border-[#2D352F]">
                <div className="text-xs text-[#252B27]/60 dark:text-slate-400">Starting Time</div>
                <div className="text-base sm:text-lg font-bold font-mono text-[#252B27] dark:text-white mt-0.5">
                  {format12Hour(startDateObj)}
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#F7F6F2] dark:bg-[#202722] border border-[#E4E1D9]/80 dark:border-[#2D352F]">
                <div className="text-xs text-[#252B27]/60 dark:text-slate-400">Time Offset</div>
                <div className="text-base sm:text-lg font-bold font-mono text-[#252B27] dark:text-white mt-0.5">
                  {operation === 'add' ? '+' : '−'}
                  {addHours > 0 ? `${addHours}h ` : ''}
                  {addMinutes}m {addSeconds > 0 ? `${addSeconds}s` : ''}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[#E4E1D9] dark:border-[#2D352F] pt-4 text-xs sm:text-sm text-[#252B27]/80 dark:text-slate-300 leading-relaxed">
            <strong>Summary:</strong>{' '}
            {operation === 'add' ? 'In ' : ''}
            {addHours > 0 ? `${addHours} hour${addHours !== 1 ? 's' : ''} and ` : ''}
            {addMinutes} minute{addMinutes !== 1 ? 's' : ''}{' '}
            {operation === 'add' ? 'from ' : 'before '}
            <span className="font-mono font-semibold text-[#252B27] dark:text-white">
              {format12Hour(startDateObj)}
            </span>
            , the exact clock time will be{' '}
            <span className="font-mono font-bold text-[#365C4B] dark:text-[#5E917A]">
              {format12Hour(targetDateObj)}
            </span>
            .
          </div>
        </div>
      </div>

      {/* Quick Question Chips */}
      <div>
        <h3 className="font-serif text-2xl font-normal text-[#252B27] dark:text-white mb-1">
          Popular Time Questions
        </h3>
        <p className="text-xs sm:text-sm text-[#252B27]/70 dark:text-slate-400 mb-4">
          Click any interval below to see what time it will be from right now:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {quickMinuteChips.map((chip, idx) => {
            const previewDate = new Date(
              startDateObj.getTime() + (chip.h * 3600 + chip.m * 60) * 1000
            );
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setOperation('add');
                  setAddHours(chip.h);
                  setAddMinutes(chip.m);
                  setAddSeconds(0);
                }}
                className="bg-white dark:bg-[#1A201C] border border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#365C4B] rounded-xl p-3 text-left transition-all cursor-pointer group shadow-2xs"
              >
                <div className="text-xs font-bold text-[#252B27] dark:text-white group-hover:text-[#365C4B]">
                  {chip.label}
                </div>
                <div className="text-sm font-mono font-bold text-[#365C4B] dark:text-[#5E917A] mt-1">
                  {format12Hour(previewDate)}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

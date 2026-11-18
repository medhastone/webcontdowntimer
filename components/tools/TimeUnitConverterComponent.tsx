'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeftRight, RotateCcw, Calculator, ArrowRight } from 'lucide-react';

export type TimeUnitKey = 'milliseconds' | 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks';

interface TimeUnitConverterProps {
  defaultFrom?: TimeUnitKey;
  defaultTo?: TimeUnitKey;
  defaultValue?: number;
  mode?: 'general' | 'minutes-to-hours' | 'seconds-to-minutes' | 'hours-to-minutes';
}

const UNIT_FACTORS_IN_SECONDS: Record<TimeUnitKey, number> = {
  milliseconds: 0.001,
  seconds: 1,
  minutes: 60,
  hours: 3600,
  days: 86400,
  weeks: 604800,
};

const UNIT_LABELS: Record<TimeUnitKey, string> = {
  milliseconds: 'Milliseconds (ms)',
  seconds: 'Seconds (sec)',
  minutes: 'Minutes (min)',
  hours: 'Hours (hr)',
  days: 'Days (d)',
  weeks: 'Weeks (wk)',
};

export default function TimeUnitConverterComponent({
  defaultFrom = 'minutes',
  defaultTo = 'hours',
  defaultValue = 90,
  mode = 'general',
}: TimeUnitConverterProps) {
  const [inputValue, setInputValue] = useState<string>(String(defaultValue));
  const [fromUnit, setFromUnit] = useState<TimeUnitKey>(defaultFrom);
  const [toUnit, setToUnit] = useState<TimeUnitKey>(defaultTo);

  const numValue = Math.max(0, parseFloat(inputValue) || 0);
  const totalSeconds = numValue * UNIT_FACTORS_IN_SECONDS[fromUnit];
  const convertedValue = totalSeconds / UNIT_FACTORS_IN_SECONDS[toUnit];

  // Format clean decimal
  const formattedConverted = Number(convertedValue.toFixed(4)).toString();

  // Also compute Hours + Minutes + Seconds breakdown from totalSeconds
  const wholeHours = Math.floor(totalSeconds / 3600);
  const remAfterHours = totalSeconds % 3600;
  const wholeMinutes = Math.floor(remAfterHours / 60);
  const wholeSeconds = Math.round(remAfterHours % 60);
  const totalWholeMinutes = Math.floor(totalSeconds / 60);

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const handleReset = () => {
    setInputValue(String(defaultValue));
    setFromUnit(defaultFrom);
    setToUnit(defaultTo);
  };

  const presets =
    mode === 'minutes-to-hours'
      ? [
          { label: '30 mins', val: 30, from: 'minutes' as TimeUnitKey, to: 'hours' as TimeUnitKey },
          { label: '45 mins', val: 45, from: 'minutes' as TimeUnitKey, to: 'hours' as TimeUnitKey },
          { label: '90 mins', val: 90, from: 'minutes' as TimeUnitKey, to: 'hours' as TimeUnitKey },
          { label: '120 mins', val: 120, from: 'minutes' as TimeUnitKey, to: 'hours' as TimeUnitKey },
          { label: '150 mins', val: 150, from: 'minutes' as TimeUnitKey, to: 'hours' as TimeUnitKey },
          { label: '510 mins', val: 510, from: 'minutes' as TimeUnitKey, to: 'hours' as TimeUnitKey },
        ]
      : mode === 'seconds-to-minutes'
      ? [
          { label: '60 sec', val: 60, from: 'seconds' as TimeUnitKey, to: 'minutes' as TimeUnitKey },
          { label: '90 sec', val: 90, from: 'seconds' as TimeUnitKey, to: 'minutes' as TimeUnitKey },
          { label: '120 sec', val: 120, from: 'seconds' as TimeUnitKey, to: 'minutes' as TimeUnitKey },
          { label: '180 sec', val: 180, from: 'seconds' as TimeUnitKey, to: 'minutes' as TimeUnitKey },
          { label: '240 sec', val: 240, from: 'seconds' as TimeUnitKey, to: 'minutes' as TimeUnitKey },
          { label: '300 sec', val: 300, from: 'seconds' as TimeUnitKey, to: 'minutes' as TimeUnitKey },
        ]
      : mode === 'hours-to-minutes'
      ? [
          { label: '0.5 hrs', val: 0.5, from: 'hours' as TimeUnitKey, to: 'minutes' as TimeUnitKey },
          { label: '1.5 hrs', val: 1.5, from: 'hours' as TimeUnitKey, to: 'minutes' as TimeUnitKey },
          { label: '2.25 hrs', val: 2.25, from: 'hours' as TimeUnitKey, to: 'minutes' as TimeUnitKey },
          { label: '4.5 hrs', val: 4.5, from: 'hours' as TimeUnitKey, to: 'minutes' as TimeUnitKey },
          { label: '8 hrs', val: 8, from: 'hours' as TimeUnitKey, to: 'minutes' as TimeUnitKey },
          { label: '8.5 hrs', val: 8.5, from: 'hours' as TimeUnitKey, to: 'minutes' as TimeUnitKey },
        ]
      : [
          { label: '90 min → hrs', val: 90, from: 'minutes' as TimeUnitKey, to: 'hours' as TimeUnitKey },
          { label: '240 sec → min', val: 240, from: 'seconds' as TimeUnitKey, to: 'minutes' as TimeUnitKey },
          { label: '8.5 hrs → min', val: 8.5, from: 'hours' as TimeUnitKey, to: 'minutes' as TimeUnitKey },
          { label: '48 hrs → days', val: 48, from: 'hours' as TimeUnitKey, to: 'days' as TimeUnitKey },
          { label: '7 days → hrs', val: 7, from: 'days' as TimeUnitKey, to: 'hours' as TimeUnitKey },
        ];

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Card: Inputs */}
        <div className="lg:col-span-6 bg-white dark:bg-[#1A201C] rounded-2xl border border-[#E4E1D9] dark:border-[#2D352F] p-6 sm:p-7 shadow-2xs flex flex-col justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#252B27] dark:text-white mb-6 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-[#365C4B]" />
              <span>Enter Value to Convert</span>
            </h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-[#252B27]/80 dark:text-slate-300 mb-1.5">
                  Amount
                </label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-[#E4E1D9] dark:border-[#2D352F] bg-white dark:bg-[#151A17] text-lg font-mono font-bold text-[#252B27] dark:text-white focus:outline-hidden focus:border-[#365C4B]"
                  placeholder="Enter value..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#252B27]/80 dark:text-slate-300 mb-1.5">
                    From Unit
                  </label>
                  <select
                    value={fromUnit}
                    onChange={(e) => setFromUnit(e.target.value as TimeUnitKey)}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#E4E1D9] dark:border-[#2D352F] bg-white dark:bg-[#151A17] text-sm font-medium text-[#252B27] dark:text-white cursor-pointer"
                  >
                    {(Object.keys(UNIT_LABELS) as TimeUnitKey[]).map((u) => (
                      <option key={u} value={u}>
                        {UNIT_LABELS[u]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#252B27]/80 dark:text-slate-300 mb-1.5">
                    To Unit
                  </label>
                  <select
                    value={toUnit}
                    onChange={(e) => setToUnit(e.target.value as TimeUnitKey)}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#E4E1D9] dark:border-[#2D352F] bg-white dark:bg-[#151A17] text-sm font-medium text-[#252B27] dark:text-white cursor-pointer"
                  >
                    {(Object.keys(UNIT_LABELS) as TimeUnitKey[]).map((u) => (
                      <option key={u} value={u}>
                        {UNIT_LABELS[u]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="mb-6">
              <span className="text-xs font-semibold text-[#252B27]/60 dark:text-slate-400 block mb-2">
                Quick Examples:
              </span>
              <div className="flex flex-wrap gap-2">
                {presets.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setInputValue(String(p.val));
                      setFromUnit(p.from);
                      setToUnit(p.to);
                    }}
                    className="px-3 py-1.5 rounded-lg border border-[#E4E1D9] dark:border-[#2D352F] bg-[#F7F6F2] dark:bg-[#151A17] hover:border-[#365C4B] text-xs font-semibold text-[#252B27] dark:text-slate-200 transition-colors cursor-pointer"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 border-t border-[#E4E1D9] dark:border-[#2D352F]">
            <button
              type="button"
              onClick={handleSwap}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#E4E1D9] dark:border-[#2D352F] hover:bg-[#F7F6F2] dark:hover:bg-slate-800 text-xs font-semibold text-[#252B27] dark:text-slate-200 transition-colors cursor-pointer"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-[#365C4B]" />
              <span>Swap Units</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#E4E1D9] dark:border-[#2D352F] hover:bg-[#F7F6F2] dark:hover:bg-slate-800 text-xs font-semibold text-[#252B27] dark:text-slate-200 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#365C4B]" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Right Card: Output */}
        <div className="lg:col-span-6 bg-white dark:bg-[#1A201C] rounded-2xl border border-[#E4E1D9] dark:border-[#2D352F] p-6 sm:p-7 shadow-2xs flex flex-col justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-[#252B27]/60 dark:text-slate-400 font-semibold block mb-1">
              Converted Result
            </span>
            <div className="font-serif text-3xl sm:text-4xl lg:text-[42px] leading-tight font-normal text-[#252B27] dark:text-white mb-2">
              {formattedConverted} {toUnit}
            </div>
            <p className="text-xs sm:text-sm text-[#365C4B] dark:text-[#5E917A] font-medium mb-6">
              {numValue} {fromUnit} ={' '}
              {wholeHours > 0
                ? `${wholeHours} hr ${wholeMinutes} min ${wholeSeconds > 0 ? `${wholeSeconds} sec` : ''}`
                : `${totalWholeMinutes} min ${wholeSeconds} sec`}
            </p>

            {/* 3 Summary Cards */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="p-3.5 rounded-xl bg-[#F7F6F2] dark:bg-[#202722] border border-[#E4E1D9]/80 dark:border-[#2D352F]">
                <div className="text-lg sm:text-xl font-bold font-mono text-[#252B27] dark:text-white">
                  {Number((totalSeconds / 3600).toFixed(2))}
                </div>
                <div className="text-[11px] sm:text-xs text-[#252B27]/65 dark:text-slate-400 mt-0.5">
                  Decimal Hours
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#F7F6F2] dark:bg-[#202722] border border-[#E4E1D9]/80 dark:border-[#2D352F]">
                <div className="text-lg sm:text-xl font-bold font-mono text-[#252B27] dark:text-white">
                  {Number((totalSeconds / 60).toFixed(2))}
                </div>
                <div className="text-[11px] sm:text-xs text-[#252B27]/65 dark:text-slate-400 mt-0.5">
                  Total Minutes
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#F7F6F2] dark:bg-[#202722] border border-[#E4E1D9]/80 dark:border-[#2D352F]">
                <div className="text-lg sm:text-xl font-bold font-mono text-[#252B27] dark:text-white">
                  {Math.round(totalSeconds).toLocaleString()}
                </div>
                <div className="text-[11px] sm:text-xs text-[#252B27]/65 dark:text-slate-400 mt-0.5">
                  Total Seconds
                </div>
              </div>
            </div>
          </div>

          {/* All Equivalent Units Breakdown */}
          <div className="border-t border-[#E4E1D9] dark:border-[#2D352F] pt-5">
            <h3 className="font-semibold text-sm text-[#252B27] dark:text-white mb-3">
              Equivalent Time Units
            </h3>
            <div className="space-y-1.5 text-xs sm:text-sm">
              <div className="flex justify-between text-[#252B27]/80 dark:text-slate-300">
                <span>Hours &amp; Minutes:</span>
                <span className="font-bold font-mono text-[#252B27] dark:text-white">
                  {wholeHours}h {wholeMinutes}m {wholeSeconds}s
                </span>
              </div>
              <div className="flex justify-between text-[#252B27]/80 dark:text-slate-300">
                <span>Decimal Hours:</span>
                <span className="font-medium font-mono text-[#252B27] dark:text-white">
                  {Number((totalSeconds / 3600).toFixed(4))} hours
                </span>
              </div>
              <div className="flex justify-between text-[#252B27]/80 dark:text-slate-300">
                <span>Total Minutes:</span>
                <span className="font-medium font-mono text-[#252B27] dark:text-white">
                  {Number((totalSeconds / 60).toFixed(2))} minutes
                </span>
              </div>
              <div className="flex justify-between text-[#252B27]/80 dark:text-slate-300">
                <span>Total Days:</span>
                <span className="font-medium font-mono text-[#252B27] dark:text-white">
                  {Number((totalSeconds / 86400).toFixed(4))} days
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Specialized Unit Conversion Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {[
          { href: '/minutes-to-hours', title: 'Minutes to Hours', sub: 'Convert min to hrs & decimal hours' },
          { href: '/seconds-to-minutes', title: 'Seconds to Minutes', sub: 'Convert sec into exact minutes' },
          { href: '/hours-to-minutes', title: 'Hours to Minutes', sub: 'Multiply hours × 60 into minutes' },
          { href: '/time-duration-calculator', title: 'Time Duration Calculator', sub: 'Hours between two clock times' },
        ].map((item) => (
          <Link prefetch={false}
            key={item.href}
            href={item.href}
            className="bg-white dark:bg-[#1A201C] border border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#365C4B] rounded-xl p-4 flex items-center justify-between transition-all group shadow-2xs"
          >
            <div>
              <div className="font-bold text-xs sm:text-sm text-[#252B27] dark:text-white group-hover:text-[#365C4B] transition-colors">
                {item.title}
              </div>
              <div className="text-xs text-[#252B27]/60 dark:text-slate-400 mt-0.5">
                {item.sub}
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#365C4B] shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}

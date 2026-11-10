'use client';

import React, { useState } from 'react';
import { POPULAR_CITIES, getTimeDifferenceBetween, getTimeZoneData, isDaylightSavingTime } from '@/lib/time-zones';
import { ArrowRight, Clock, Calendar, Check, AlertCircle } from 'lucide-react';

export default function TimeDifferenceComponent() {
  const [cityAId, setCityAId] = useState('new-york');
  const [cityBId, setCityBId] = useState('london');
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const cityA = POPULAR_CITIES.find((c) => c.id === cityAId) || POPULAR_CITIES[0];
  const cityB = POPULAR_CITIES.find((c) => c.id === cityBId) || POPULAR_CITIES[1];

  const diff = getTimeDifferenceBetween(selectedDate, cityA.iana, cityB.iana);
  const dataA = getTimeZoneData(selectedDate, cityA.iana);
  const dataB = getTimeZoneData(selectedDate, cityB.iana);

  const hasDstA = isDaylightSavingTime(selectedDate, cityA.iana);
  const hasDstB = isDaylightSavingTime(selectedDate, cityB.iana);

  // Compute mutual 9:00 AM - 5:00 PM business hour overlap
  // Check hours 0..23 in city A, see how many fall between 9..17 in city B
  let overlapHours = 0;
  for (let hA = 9; hA < 17; hA++) {
    const hB = (hA + Math.round(diff.hours) + 24) % 24;
    if (hB >= 9 && hB < 17) {
      overlapHours++;
    }
  }

  const isAhead = diff.hours > 0;
  const isBehind = diff.hours < 0;
  const absHours = Math.abs(diff.hours);

  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-sm space-y-8">
      {/* City Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* City A */}
        <div className="space-y-3 p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
          <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">
            Origin Location (City A)
          </label>
          <select
            value={cityAId}
            onChange={(e) => setCityAId(e.target.value)}
            className="w-full text-sm font-semibold p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
          >
            {POPULAR_CITIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.flag} {c.name} ({c.country})
              </option>
            ))}
          </select>

          <div className="pt-2 flex items-baseline justify-between">
            <div>
              <div className="font-mono text-3xl font-bold text-neutral-900 dark:text-white">
                {dataA.formattedShortTime}
              </div>
              <div className="text-xs text-neutral-500 font-mono mt-0.5">
                {dataA.weekday}, {dataA.month} {dataA.day} · {dataA.offsetString}
              </div>
            </div>
            {hasDstA && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                DST
              </span>
            )}
          </div>
        </div>

        {/* City B */}
        <div className="space-y-3 p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
          <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">
            Target Location (City B)
          </label>
          <select
            value={cityBId}
            onChange={(e) => setCityBId(e.target.value)}
            className="w-full text-sm font-semibold p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
          >
            {POPULAR_CITIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.flag} {c.name} ({c.country})
              </option>
            ))}
          </select>

          <div className="pt-2 flex items-baseline justify-between">
            <div>
              <div className="font-mono text-3xl font-bold text-neutral-900 dark:text-white">
                {dataB.formattedShortTime}
              </div>
              <div className="text-xs text-neutral-500 font-mono mt-0.5">
                {dataB.weekday}, {dataB.month} {dataB.day} · {dataB.offsetString}
              </div>
            </div>
            {hasDstB && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                DST
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Difference Statement Box */}
      <div className="text-center py-8 px-6 rounded-2xl bg-neutral-950 text-white border border-neutral-800 space-y-3">
        <div className="text-xs font-mono uppercase tracking-widest text-neutral-400">
          Exact Time Delta
        </div>
        <div className="text-3xl sm:text-5xl font-black tracking-tight text-white">
          {cityB.name} is{' '}
          <span className="text-amber-400 font-mono">
            {diff.hours === 0 ? 'in the exact same time zone' : `${absHours} hour${absHours !== 1 ? 's' : ''} ${isAhead ? 'ahead of' : 'behind'}`}
          </span>{' '}
          {cityA.name}
        </div>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto">
          When it is {dataA.formattedShortTime} in {cityA.name}, it is {dataB.formattedShortTime} in {cityB.name}.
        </p>
      </div>

      {/* Overlap & Business Analysis Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-center">
          <div className="text-xs text-neutral-500 font-medium">Mutual Working Overlap</div>
          <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-white mt-1">
            {overlapHours} Hours
          </div>
          <div className="text-[11px] text-neutral-500 mt-0.5">9:00 AM – 5:00 PM mutual business day</div>
        </div>

        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-center">
          <div className="text-xs text-neutral-500 font-medium">{cityA.name} UTC Offset</div>
          <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-white mt-1">
            {dataA.offsetString}
          </div>
          <div className="text-[11px] text-neutral-500 mt-0.5">IANA: {cityA.iana}</div>
        </div>

        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-center">
          <div className="text-xs text-neutral-500 font-medium">{cityB.name} UTC Offset</div>
          <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-white mt-1">
            {dataB.offsetString}
          </div>
          <div className="text-[11px] text-neutral-500 mt-0.5">IANA: {cityB.iana}</div>
        </div>
      </div>
    </div>
  );
}

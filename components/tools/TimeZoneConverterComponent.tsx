'use client';

import React, { useState } from 'react';
import { POPULAR_CITIES, getTimeZoneData, CityTimeZone } from '@/lib/time-zones';
import { Search, Plus, Trash2, Copy, Check, Clock } from 'lucide-react';

export default function TimeZoneConverterComponent() {
  const [selectedCities, setSelectedCities] = useState<CityTimeZone[]>([
    POPULAR_CITIES.find((c) => c.id === 'san-francisco')!,
    POPULAR_CITIES.find((c) => c.id === 'new-york')!,
    POPULAR_CITIES.find((c) => c.id === 'london')!,
    POPULAR_CITIES.find((c) => c.id === 'tokyo')!,
  ]);

  // Selected base hour (0 to 23)
  const [selectedHour, setSelectedHour] = useState<number>(14); // 2:00 PM base
  const [selectedDateStr, setSelectedDateStr] = useState<string>(() => {
    return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  });
  const [copied, setCopied] = useState(false);

  // Convert for each city
  const baseCity = selectedCities[0];

  // Construct a base Date object in the base city's time zone
  // We compute UTC equivalent
  const getCityTimes = (targetHour: number) => {
    // We treat targetHour as occurring on selectedDateStr in baseCity
    // Create reference date string e.g. "2026-10-24T14:00:00"
    const refDate = new Date(`${selectedDateStr}T${String(targetHour).padStart(2, '0')}:00:00`);

    return selectedCities.map((city) => {
      // Calculate local hour for this city
      const data = getTimeZoneData(refDate, city.iana);
      return {
        city,
        data,
      };
    });
  };

  const currentCityTimes = getCityTimes(selectedHour);

  const handleCopySummary = () => {
    const lines = currentCityTimes.map(
      (item) => `${item.city.flag} ${item.city.name} (${item.city.country}): ${item.data.formattedShortTime} (${item.data.weekday}, ${item.data.month} ${item.data.day})`
    );
    const summary = `Proposed Meeting Time:\n${lines.join('\n')}\n\nCoordinated via WebCountDownTimer (WebCountDownTimer.com)`;

    navigator.clipboard.writeText(summary).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleAddCity = (cityId: string) => {
    const city = POPULAR_CITIES.find((c) => c.id === cityId);
    if (city && !selectedCities.some((c) => c.id === city.id)) {
      setSelectedCities([...selectedCities, city]);
    }
  };

  const handleRemoveCity = (cityId: string) => {
    if (selectedCities.length > 1) {
      setSelectedCities(selectedCities.filter((c) => c.id !== cityId));
    }
  };

  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-sm space-y-8">
      {/* Top Configuration & Scrubber */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-100 dark:border-neutral-800">
        <div>
          <span className="text-xs font-mono uppercase text-neutral-500">Interactive Time Zone Scrubber</span>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
            Comparing across {selectedCities.length} Global Cities
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDateStr}
            onChange={(e) => setSelectedDateStr(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 font-mono"
          />

          <button
            onClick={handleCopySummary}
            className="px-3.5 py-1.5 text-xs font-semibold bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg hover:opacity-90 flex items-center gap-1.5 shadow-xs transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Meeting Time' : 'Copy All Times'}</span>
          </button>
        </div>
      </div>

      {/* 24-Hour Slider */}
      <div className="space-y-3 bg-neutral-50 dark:bg-neutral-950 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-neutral-700 dark:text-neutral-300">
            Selected Anchor Time: <span className="font-mono text-base font-bold text-blue-600 dark:text-blue-400">{String(selectedHour).padStart(2, '0')}:00</span> ({baseCity.name})
          </span>
          <span className="text-neutral-400">Drag scrubber across 24 hours</span>
        </div>

        <input
          type="range"
          min="0"
          max="23"
          value={selectedHour}
          onChange={(e) => setSelectedHour(parseInt(e.target.value, 10))}
          className="w-full h-3 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />

        {/* 24h markers */}
        <div className="flex justify-between text-[10px] font-mono text-neutral-400 select-none">
          <span>00:00</span>
          <span>04:00</span>
          <span>08:00</span>
          <span>12:00</span>
          <span>16:00</span>
          <span>20:00</span>
          <span>23:00</span>
        </div>
      </div>

      {/* Converted City Cards */}
      <div className="space-y-3">
        {currentCityTimes.map(({ city, data }, idx) => {
          const isWorkingHour = data.hour >= 9 && data.hour < 18;
          const isEarlyOrLate = (data.hour >= 7 && data.hour < 9) || (data.hour >= 18 && data.hour < 22);

          return (
            <div
              key={city.id}
              className="p-4 sm:p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl" aria-hidden="true">{city.flag}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-neutral-900 dark:text-white">{city.name}</h3>
                    {idx === 0 && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-semibold">
                        Anchor
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-neutral-500 font-mono">
                    {city.country} · {data.offsetString} ({data.timeZoneCode})
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6">
                {/* Working hours indicator */}
                <div className="text-right">
                  <div
                    className={`text-xs font-semibold ${
                      isWorkingHour
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : isEarlyOrLate
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-neutral-400'
                    }`}
                  >
                    {isWorkingHour ? 'Working Hours' : isEarlyOrLate ? 'Early / Late' : 'Sleeping Hours'}
                  </div>
                  <div className="text-[11px] text-neutral-500 font-mono">
                    {data.weekday}, {data.month} {data.day}
                  </div>
                </div>

                {/* Big Time Display */}
                <div className="font-mono text-3xl sm:text-4xl font-extrabold tabular-nums tracking-tight text-neutral-950 dark:text-white">
                  {data.formattedShortTime}
                </div>

                {/* Remove button */}
                {selectedCities.length > 1 && (
                  <button
                    onClick={() => handleRemoveCity(city.id)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    title="Remove City"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add City Row */}
      <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center gap-2">
        <span className="text-xs font-semibold text-neutral-500">Add City:</span>
        <select
          onChange={(e) => {
            if (e.target.value) handleAddCity(e.target.value);
            e.target.value = '';
          }}
          defaultValue=""
          className="text-xs px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
        >
          <option value="" disabled>
            Select a city to add...
          </option>
          {POPULAR_CITIES.filter((c) => !selectedCities.some((s) => s.id === c.id)).map((c) => (
            <option key={c.id} value={c.id}>
              {c.flag} {c.name} ({c.country}) - {c.iana}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

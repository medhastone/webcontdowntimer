'use client';

import React, { useState, useEffect } from 'react';
import { POPULAR_CITIES, getTimeZoneData, isDaylightSavingTime, CityTimeZone } from '@/lib/time-zones';
import { Search, Sun, Moon, Clock, Plus, Trash2, Pin } from 'lucide-react';

export default function WorldClockComponent() {
  const [pinnedCityIds, setPinnedCityIds] = useState<string[]>([
    'london',
    'new-york',
    'tokyo',
    'san-francisco',
    'mumbai',
    'sydney',
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());
  const [displayMode, setDisplayMode] = useState<'digital' | 'analog'>('digital');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pinnedCities = pinnedCityIds
    .map((id) => POPULAR_CITIES.find((c) => c.id === id))
    .filter(Boolean) as CityTimeZone[];

  const searchResults = searchQuery.trim()
    ? POPULAR_CITIES.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.iana.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleTogglePin = (cityId: string) => {
    if (pinnedCityIds.includes(cityId)) {
      setPinnedCityIds(pinnedCityIds.filter((id) => id !== cityId));
    } else {
      setPinnedCityIds([...pinnedCityIds, cityId]);
      setSearchQuery('');
    }
  };

  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-sm space-y-8">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-100 dark:border-neutral-800">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search world city, country, or time zone (e.g. Tokyo, India, UTC)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-neutral-400"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-xs">
          <button
            onClick={() => setDisplayMode('digital')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              displayMode === 'digital'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-500'
            }`}
          >
            Digital Clocks
          </button>
          <button
            onClick={() => setDisplayMode('analog')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              displayMode === 'analog'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-500'
            }`}
          >
            Analog Dials
          </button>
        </div>
      </div>

      {/* Search Dropdown / Live Results */}
      {searchQuery.trim() && (
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-3 bg-neutral-50 dark:bg-neutral-950 max-h-60 overflow-y-auto divide-y divide-neutral-200 dark:divide-neutral-800">
          {searchResults.length === 0 ? (
            <div className="p-4 text-xs text-neutral-500 text-center">No matching global cities found.</div>
          ) : (
            searchResults.map((city) => {
              const isPinned = pinnedCityIds.includes(city.id);
              const data = getTimeZoneData(currentDate, city.iana);
              return (
                <div key={city.id} className="py-2.5 px-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{city.flag}</span>
                    <span className="font-semibold text-neutral-900 dark:text-white">{city.name}</span>
                    <span className="text-neutral-500">({city.country})</span>
                    <span className="text-neutral-400 font-mono">{data.offsetString}</span>
                  </div>
                  <button
                    onClick={() => handleTogglePin(city.id)}
                    className="px-2.5 py-1 rounded bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 font-medium"
                  >
                    {isPinned ? 'Remove' : 'Pin to Board'}
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Grid of Pinned Clocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pinnedCities.map((city) => {
          const data = getTimeZoneData(currentDate, city.iana);
          const hasDst = isDaylightSavingTime(currentDate, city.iana);

          // Calculate analog hand angles
          const secondAngle = data.second * 6; // 360 / 60
          const minuteAngle = data.minute * 6 + data.second * 0.1;
          const hourAngle = (data.hour % 12) * 30 + data.minute * 0.5;

          return (
            <div
              key={city.id}
              className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 relative group"
            >
              {/* Unpin button */}
              <button
                onClick={() => handleTogglePin(city.id)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-neutral-200 dark:hover:bg-neutral-800 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove City"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl" aria-hidden="true">{city.flag}</span>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white">{city.name}</h3>
                  <div className="text-[11px] text-neutral-500 flex items-center gap-1.5">
                    <span>{city.country}</span>
                    <span>·</span>
                    <span className="font-mono">{data.offsetString}</span>
                  </div>
                </div>
              </div>

              {displayMode === 'digital' ? (
                /* Digital Clock */
                <div className="my-4 text-center py-2">
                  <div className="font-mono text-4xl sm:text-5xl font-black tabular-nums tracking-tight text-neutral-950 dark:text-white">
                    {data.formattedTime}
                  </div>
                  <div className="text-xs font-mono text-neutral-500 mt-1">
                    {data.weekday}, {data.month} {data.day}
                  </div>
                </div>
              ) : (
                /* Analog Dial Clock */
                <div className="my-4 flex flex-col items-center">
                  <div className="relative w-32 h-32 rounded-full border-2 border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-inner flex items-center justify-center">
                    {/* Hour Hand */}
                    <div
                      className="absolute w-1 h-8 bg-neutral-900 dark:bg-white rounded-full origin-bottom"
                      style={{
                        transform: `rotate(${hourAngle}deg) translateY(-50%)`,
                        bottom: '50%',
                      }}
                    />
                    {/* Minute Hand */}
                    <div
                      className="absolute w-0.5 h-12 bg-neutral-700 dark:bg-neutral-300 rounded-full origin-bottom"
                      style={{
                        transform: `rotate(${minuteAngle}deg) translateY(-50%)`,
                        bottom: '50%',
                      }}
                    />
                    {/* Second Hand */}
                    <div
                      className="absolute w-0.5 h-14 bg-red-500 rounded-full origin-bottom"
                      style={{
                        transform: `rotate(${secondAngle}deg) translateY(-50%)`,
                        bottom: '50%',
                      }}
                    />
                    {/* Center Pin */}
                    <div className="absolute w-2 h-2 rounded-full bg-neutral-900 dark:bg-white" />
                  </div>
                  <div className="font-mono text-xs text-neutral-600 dark:text-neutral-400 mt-2">
                    {data.formattedTime}
                  </div>
                </div>
              )}

              {/* Badges: Day/Night + DST */}
              <div className="flex items-center justify-between pt-3 border-t border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-500">
                <div className="flex items-center gap-1">
                  {data.isDaylight ? (
                    <>
                      <Sun className="w-3.5 h-3.5 text-amber-500" />
                      <span>Daytime</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Night</span>
                    </>
                  )}
                </div>

                {hasDst && (
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-medium">
                    DST Active
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

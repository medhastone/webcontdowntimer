'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { POPULAR_CITIES, getTimeZoneData, CityTimeZone } from '@/lib/time-zones';
import {
  Trash2,
  Check,
  Copy,
  Globe,
  Search,
  RefreshCw,
  ExternalLink,
  CalendarClock,
} from 'lucide-react';
import type { SearchGroundingResponse } from '@/app/api/search-grounding/route';

const MEETING_GROUNDING_TOPICS = [
  {
    id: 'global-trends',
    label: 'Global Event & Scheduling Trends',
    query: 'Global enterprise meeting scheduling trends, major tech event windows, and cross-regional overlap',
  },
  {
    id: 'dst-shifts',
    label: 'DST Offset Transitions',
    query: 'Upcoming Daylight Saving Time (DST) transitions and offset shifts between US, Europe, and APAC',
  },
  {
    id: 'holidays',
    label: 'Regional Public Holidays',
    query: 'Upcoming public holidays, bank closures, and regional observance periods across global hubs',
  },
  {
    id: 'etiquette',
    label: 'Cross-Cultural & Async Etiquette',
    query: 'Best practices and cross-cultural etiquette for distributed global team meetings across time zones',
  },
];

export default function MeetingPlannerComponent() {
  const [attendees, setAttendees] = useState<CityTimeZone[]>([
    POPULAR_CITIES.find((c) => c.id === 'san-francisco')!,
    POPULAR_CITIES.find((c) => c.id === 'london')!,
    POPULAR_CITIES.find((c) => c.id === 'berlin')!,
    POPULAR_CITIES.find((c) => c.id === 'singapore')!,
  ]);
  const [selectedUtcHour, setSelectedUtcHour] = useState<number>(14); // 14:00 UTC
  const [copied, setCopied] = useState(false);

  // Search Grounding State
  const [searchQuery, setSearchQuery] = useState<string>(MEETING_GROUNDING_TOPICS[0].query);
  const [activeTopicId, setActiveTopicId] = useState<string>(MEETING_GROUNDING_TOPICS[0].id);
  const [groundingData, setGroundingData] = useState<SearchGroundingResponse | null>(null);
  const [isLoadingGrounding, setIsLoadingGrounding] = useState<boolean>(false);

  // Hours 0..23 in UTC
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const fetchGroundedMeetingContext = useCallback(
    async (queryToRun: string, cityNames: string[], utcH: number) => {
      setIsLoadingGrounding(true);
      try {
        const res = await fetch('/api/search-grounding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tool: 'meeting-planner',
            query: queryToRun,
            cities: cityNames,
            utcHour: utcH,
          }),
        });
        if (res.ok) {
          const data: SearchGroundingResponse = await res.json();
          setGroundingData(data);
        }
      } catch {
        // Keep previous grounded data if offline
      } finally {
        setIsLoadingGrounding(false);
      }
    },
    []
  );

  // Initial search-grounded context fetch on mount
  useEffect(() => {
    fetchGroundedMeetingContext(
      MEETING_GROUNDING_TOPICS[0].query,
      ['San Francisco', 'London', 'Berlin', 'Singapore'],
      14
    );
  }, [fetchGroundedMeetingContext]);

  const getHourScore = (utcH: number) => {
    const testDate = new Date();
    testDate.setUTCHours(utcH, 0, 0, 0);

    let greenCount = 0;
    let redCount = 0;

    attendees.forEach((att) => {
      const data = getTimeZoneData(testDate, att.iana);
      if (data.hour >= 8 && data.hour <= 18) {
        greenCount++;
      } else if (data.hour >= 23 || data.hour <= 6) {
        redCount++;
      }
    });

    if (redCount === 0 && greenCount === attendees.length) return 'optimal';
    if (redCount === 0) return 'acceptable';
    return 'inconvenient';
  };

  const handleAddAttendee = (cityId: string) => {
    const city = POPULAR_CITIES.find((c) => c.id === cityId);
    if (city && !attendees.some((a) => a.id === city.id)) {
      const updated = [...attendees, city];
      setAttendees(updated);
      fetchGroundedMeetingContext(
        searchQuery,
        updated.map((a) => a.name),
        selectedUtcHour
      );
    }
  };

  const handleRemoveAttendee = (cityId: string) => {
    if (attendees.length > 1) {
      const updated = attendees.filter((a) => a.id !== cityId);
      setAttendees(updated);
      fetchGroundedMeetingContext(
        searchQuery,
        updated.map((a) => a.name),
        selectedUtcHour
      );
    }
  };

  const handleTopicSelect = (topic: (typeof MEETING_GROUNDING_TOPICS)[number]) => {
    setActiveTopicId(topic.id);
    setSearchQuery(topic.query);
    fetchGroundedMeetingContext(
      topic.query,
      attendees.map((a) => a.name),
      selectedUtcHour
    );
  };

  const handleCustomSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setActiveTopicId('custom');
    fetchGroundedMeetingContext(
      searchQuery.trim(),
      attendees.map((a) => a.name),
      selectedUtcHour
    );
  };

  const handleCopyMeetingTimes = () => {
    const testDate = new Date();
    testDate.setUTCHours(selectedUtcHour, 0, 0, 0);

    const lines = attendees.map((att) => {
      const data = getTimeZoneData(testDate, att.iana);
      return `${att.flag} ${att.name}: ${data.formattedShortTime} (${data.offsetString})`;
    });

    const summary = `Scheduled Global Meeting Time (${selectedUtcHour}:00 UTC):\n${lines.join('\n')}\n\nGenerated with WebCountDownTimer World Meeting Planner (WebCountDownTimer.com)`;

    navigator.clipboard.writeText(summary).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-sm space-y-8">
        {/* Header & Copy Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <span className="text-xs font-mono uppercase text-neutral-500">Distributed Team Availability</span>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
              World Meeting Slot Finder
            </h2>
          </div>

          <button
            onClick={handleCopyMeetingTimes}
            className="px-4 py-2 text-xs font-semibold bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg hover:opacity-90 flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Meeting Slots' : 'Copy Selected Slots'}</span>
          </button>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-neutral-700 dark:text-neutral-300 font-medium">Optimal Work Hours (8am – 6pm)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-400" />
            <span className="text-neutral-700 dark:text-neutral-300 font-medium">Early / Evening (7am, 6pm – 10pm)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-neutral-300 dark:bg-neutral-700" />
            <span className="text-neutral-500">Sleeping / Inconvenient (11pm – 6am)</span>
          </div>
        </div>

        {/* Mobile-Friendly Slot Selector */}
        <div className="block md:hidden space-y-4 bg-neutral-50 dark:bg-neutral-950 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Selected Time: <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{String(selectedUtcHour).padStart(2, '0')}:00 UTC</span>
            </span>
            <span className="text-[11px] text-neutral-500">Tap hour to test</span>
          </div>

          <input
            type="range"
            min="0"
            max="23"
            value={selectedUtcHour}
            onChange={(e) => setSelectedUtcHour(parseInt(e.target.value, 10))}
            className="w-full h-3 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
            aria-label="Select UTC Meeting Hour"
          />

          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500">
            <span>00:00</span>
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>23:00</span>
          </div>

          <div className="space-y-2 pt-2">
            {attendees.map((att) => {
              const testDate = new Date();
              testDate.setUTCHours(selectedUtcHour, 0, 0, 0);
              const data = getTimeZoneData(testDate, att.iana);
              const isOptimal = data.hour >= 8 && data.hour <= 18;
              const isAcceptable = (data.hour >= 7 && data.hour < 8) || (data.hour > 18 && data.hour <= 22);

              return (
                <div
                  key={att.id}
                  className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{att.flag}</span>
                    <div>
                      <div className="font-bold text-xs text-neutral-900 dark:text-white">{att.name}</div>
                      <div className="text-[10px] text-neutral-500">{data.offsetString}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono text-sm font-bold text-neutral-900 dark:text-white">
                      {data.formattedShortTime}
                    </div>
                    <div className="text-[10px] font-medium">
                      {isOptimal ? (
                        <span className="text-emerald-600 dark:text-emerald-400">Working Hours</span>
                      ) : isAcceptable ? (
                        <span className="text-amber-600 dark:text-amber-400">Early / Late</span>
                      ) : (
                        <span className="text-neutral-400">Sleeping</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Desktop 24-Hour Visual Matrix */}
        <div className="hidden md:block overflow-x-auto pb-4 border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-neutral-50 dark:bg-neutral-950">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900">
                <th className="p-3 text-left font-bold text-neutral-700 dark:text-neutral-300 w-48">
                  Location &amp; City
                </th>
                {hours.map((h) => {
                  const score = getHourScore(h);
                  const isSelected = h === selectedUtcHour;
                  return (
                    <th
                      key={h}
                      onClick={() => setSelectedUtcHour(h)}
                      className={`p-2 text-center font-mono cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-blue-600 text-white font-bold'
                          : score === 'optimal'
                          ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                          : 'text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-800'
                      }`}
                    >
                      {String(h).padStart(2, '0')}:00
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 font-mono">
              {attendees.map((att) => (
                <tr key={att.id} className="hover:bg-white/50 dark:hover:bg-neutral-900/50">
                  <td className="p-3 font-sans font-semibold text-neutral-900 dark:text-white flex items-center justify-between">
                    <div className="flex items-center gap-1.5 truncate">
                      <span>{att.flag}</span>
                      <span className="truncate">{att.name}</span>
                    </div>
                    {attendees.length > 1 && (
                      <button
                        onClick={() => handleRemoveAttendee(att.id)}
                        className="text-neutral-400 hover:text-red-500 p-1 cursor-pointer"
                        title="Remove Attendee"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </td>

                  {hours.map((utcH) => {
                    const testDate = new Date();
                    testDate.setUTCHours(utcH, 0, 0, 0);
                    const data = getTimeZoneData(testDate, att.iana);
                    const isSelected = utcH === selectedUtcHour;

                    const isOptimal = data.hour >= 8 && data.hour <= 18;
                    const isAcceptable = (data.hour >= 7 && data.hour < 8) || (data.hour > 18 && data.hour <= 22);

                    return (
                      <td
                        key={utcH}
                        onClick={() => setSelectedUtcHour(utcH)}
                        className={`p-2 text-center cursor-pointer transition-all ${
                          isSelected
                            ? 'ring-2 ring-blue-600 bg-blue-50 dark:bg-blue-950 font-bold'
                            : isOptimal
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                            : isAcceptable
                            ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                            : 'text-neutral-400 opacity-60'
                        }`}
                      >
                        {String(data.hour).padStart(2, '0')}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Selected Slot Summary */}
        <div className="p-5 rounded-2xl bg-neutral-950 text-white border border-neutral-800">
          <div className="text-xs font-mono text-neutral-400 uppercase tracking-widest mb-2">
            Selected Slot: {selectedUtcHour}:00 UTC
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {attendees.map((att) => {
              const testDate = new Date();
              testDate.setUTCHours(selectedUtcHour, 0, 0, 0);
              const data = getTimeZoneData(testDate, att.iana);
              return (
                <div key={att.id} className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                  <div className="text-xs text-neutral-400">{att.flag} {att.name}</div>
                  <div className="font-mono text-2xl font-bold text-white mt-1">
                    {data.formattedShortTime}
                  </div>
                  <div className="text-[11px] text-neutral-500 font-mono mt-0.5">
                    {data.weekday}, {data.month} {data.day}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Add Attendee Dropdown */}
        <div className="pt-2 flex items-center gap-2">
          <span className="text-xs font-semibold text-neutral-500">Add Location:</span>
          <select
            onChange={(e) => {
              if (e.target.value) handleAddAttendee(e.target.value);
              e.target.value = '';
            }}
            defaultValue=""
            className="text-xs px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
          >
            <option value="" disabled>Select participant location...</option>
            {POPULAR_CITIES.filter((c) => !attendees.some((a) => a.id === c.id)).map((c) => (
              <option key={c.id} value={c.id}>
                {c.flag} {c.name} ({c.country})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Live Search-Grounded Global Event Trends & Regional Scheduling Context Panel */}
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-100 dark:border-neutral-800 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400">
              <Globe className="w-3.5 h-3.5" />
              <span>Live Search-Grounded Global Context</span>
            </div>
            <h3 className="text-lg font-extrabold text-neutral-900 dark:text-white mt-1 flex items-center gap-2">
              <CalendarClock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>Global Event Trends, DST Shifts &amp; Regional Etiquette</span>
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Search-grounded scheduling intelligence for{' '}
              <span className="font-semibold text-neutral-700 dark:text-neutral-200">
                {attendees.map((a) => a.name).join(', ')}
              </span>{' '}
              at {String(selectedUtcHour).padStart(2, '0')}:00 UTC.
            </p>
          </div>

          {/* Search Grounding Query Input */}
          <form onSubmit={handleCustomSearchSubmit} className="flex items-center gap-2 w-full md:w-96">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search holidays, DST dates, or regional events..."
                className="w-full h-10 pl-9 pr-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 text-xs font-medium text-neutral-900 dark:text-white"
              />
            </div>
            <button
              type="submit"
              disabled={isLoadingGrounding}
              className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingGrounding ? 'animate-spin' : ''}`} />
              <span>Search</span>
            </button>
          </form>
        </div>

        {/* Topic Quick-Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-neutral-500 mr-1">Explore Context:</span>
          {MEETING_GROUNDING_TOPICS.map((topic) => (
            <button
              key={topic.id}
              type="button"
              onClick={() => handleTopicSelect(topic)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                activeTopicId === topic.id
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-neutral-50 dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 hover:border-blue-400'
              }`}
            >
              {topic.label}
            </button>
          ))}
        </div>

        {/* Grounded Results Body */}
        {isLoadingGrounding && !groundingData ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-32 rounded-xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 p-4"
              />
            ))}
          </div>
        ) : groundingData ? (
          <div className="space-y-5">
            <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-neutral-950 border border-blue-200/70 dark:border-neutral-800 text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed">
              {groundingData.summary}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {groundingData.highlights.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-800 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1.5">
                    <span className="inline-block text-[10px] font-mono uppercase tracking-wider font-bold text-blue-600 dark:text-blue-400">
                      {item.tag}
                    </span>
                    <h4 className="text-sm font-extrabold text-neutral-900 dark:text-white">
                      {item.title}
                    </h4>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {item.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Verified Grounding Sources */}
            {groundingData.sources && groundingData.sources.length > 0 && (
              <div className="pt-3 border-t border-neutral-200/70 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-neutral-500">
                    Grounded Web Sources:
                  </span>
                  {groundingData.sources.map((src, i) => (
                    <a
                      key={i}
                      href={src.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-blue-50 dark:hover:bg-neutral-700 text-xs font-medium text-neutral-700 dark:text-neutral-300 border border-neutral-200/80 dark:border-neutral-700 transition-colors"
                    >
                      <span className="truncate max-w-[220px]">{src.title}</span>
                      <ExternalLink className="w-3 h-3 text-neutral-400 shrink-0" />
                    </a>
                  ))}
                </div>

                <span className="text-[11px] font-mono text-neutral-400">
                  {groundingData.groundedWith}
                </span>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  Users,
  Calendar,
  Clock,
  ArrowRight,
  ArrowLeftRight,
  Sun,
  Moon,
  ChevronRight,
} from 'lucide-react';
import {
  POPULAR_CITIES,
  CityTimeZone,
  getTimeZoneData,
  convertTimeBetweenZones,
  getTimeDifferenceBetween,
} from '@/lib/time-zones';

interface PrimaryCityConfig {
  id: string;
  name: string;
  country: string;
  iana: string;
  flag: string;
  defaultOffset: string;
  landmarkSvgType: 'new-york' | 'london' | 'mumbai' | 'tokyo';
}

const PRIMARY_CITIES: PrimaryCityConfig[] = [
  {
    id: 'new-york',
    name: 'New York',
    country: 'United States',
    iana: 'America/New_York',
    flag: '🇺🇸',
    defaultOffset: 'EDT (UTC -4)',
    landmarkSvgType: 'new-york',
  },
  {
    id: 'london',
    name: 'London',
    country: 'United Kingdom',
    iana: 'Europe/London',
    flag: '🇬🇧',
    defaultOffset: 'GMT (UTC +0)',
    landmarkSvgType: 'london',
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    country: 'India',
    iana: 'Asia/Kolkata',
    flag: '🇮🇳',
    defaultOffset: 'IST (UTC +5:30)',
    landmarkSvgType: 'mumbai',
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    iana: 'Asia/Tokyo',
    flag: '🇯🇵',
    defaultOffset: 'JST (UTC +9)',
    landmarkSvgType: 'tokyo',
  },
];

const POPULAR_QUICK_CITIES = [
  { id: 'new-york', name: 'New York', flag: '🇺🇸' },
  { id: 'london', name: 'London', flag: '🇬🇧' },
  { id: 'mumbai', name: 'Mumbai', flag: '🇮🇳' },
  { id: 'tokyo', name: 'Tokyo', flag: '🇯🇵' },
  { id: 'sydney', name: 'Sydney', flag: '🇦🇺' },
  { id: 'dubai', name: 'Dubai', flag: '🇦🇪' },
  { id: 'singapore', name: 'Singapore', flag: '🇸🇬' },
  { id: 'toronto', name: 'Toronto', flag: '🇨🇦' },
];

/**
 * Realistic Analog Clock SVG Component
 * Displays authentic face with 12 numerals, ticks, and hour/minute/second hands.
 */
function RealisticAnalogClock({
  hour,
  minute,
  second,
}: {
  hour: number;
  minute: number;
  second: number;
}) {
  const hourAngle = ((hour % 12) + minute / 60) * 30;
  const minuteAngle = (minute + second / 60) * 6;
  const secondAngle = second * 6;

  const clockNumerals = [
    { num: 12, angle: 0 },
    { num: 1, angle: 30 },
    { num: 2, angle: 60 },
    { num: 3, angle: 90 },
    { num: 4, angle: 120 },
    { num: 5, angle: 150 },
    { num: 6, angle: 180 },
    { num: 7, angle: 210 },
    { num: 8, angle: 240 },
    { num: 9, angle: 270 },
    { num: 10, angle: 300 },
    { num: 11, angle: 330 },
  ];

  return (
    <div className="relative w-28 h-28 sm:w-32 sm:h-32 select-none">
      <svg viewBox="0 0 140 140" className="w-full h-full drop-shadow-xs">
        {/* Dial Background */}
        <circle
          cx="70"
          cy="70"
          r="66"
          fill="#FAF8F5"
          stroke="#E4E1D9"
          strokeWidth="2.5"
        />
        <circle
          cx="70"
          cy="70"
          r="63"
          fill="none"
          stroke="#F0ECE1"
          strokeWidth="1"
        />

        {/* 60 Minute Tick Marks */}
        {Array.from({ length: 60 }).map((_, i) => {
          const isHour = i % 5 === 0;
          const tickAngle = i * 6;
          return (
            <line
              key={i}
              x1="70"
              y1={isHour ? '9' : '11'}
              x2="70"
              y2={isHour ? '14' : '13'}
              stroke={isHour ? '#4B554E' : '#B8B4AA'}
              strokeWidth={isHour ? '1.5' : '0.8'}
              transform={`rotate(${tickAngle} 70 70)`}
            />
          );
        })}

        {/* 12 Hour Numerals */}
        {clockNumerals.map(({ num, angle }) => {
          const rad = (angle * Math.PI) / 180;
          const x = 70 + 47 * Math.sin(rad);
          const y = 70 - 47 * Math.cos(rad) + 3.5;
          return (
            <text
              key={num}
              x={x}
              y={y}
              textAnchor="middle"
              className="text-[10px] sm:text-[11px] font-sans font-semibold fill-[#3B443F]"
            >
              {num}
            </text>
          );
        })}

        {/* Hour Hand */}
        <line
          x1="70"
          y1="70"
          x2="70"
          y2="38"
          stroke="#252B27"
          strokeWidth="3.2"
          strokeLinecap="round"
          transform={`rotate(${hourAngle} 70 70)`}
        />

        {/* Minute Hand */}
        <line
          x1="70"
          y1="70"
          x2="70"
          y2="24"
          stroke="#252B27"
          strokeWidth="2.2"
          strokeLinecap="round"
          transform={`rotate(${minuteAngle} 70 70)`}
        />

        {/* Second Hand */}
        <line
          x1="70"
          y1="82"
          x2="70"
          y2="18"
          stroke="#D94343"
          strokeWidth="1.2"
          strokeLinecap="round"
          transform={`rotate(${secondAngle} 70 70)`}
        />

        {/* Center Pivot Pin */}
        <circle cx="70" cy="70" r="3.5" fill="#252B27" />
        <circle cx="70" cy="70" r="1.5" fill="#D94343" />
      </svg>
    </div>
  );
}

/**
 * City Landmark Silhouettes (Statue of Liberty, Big Ben, Gateway of India, Tokyo Tower)
 */
function CityLandmarkSilhouette({ type }: { type: PrimaryCityConfig['landmarkSvgType'] }) {
  if (type === 'new-york') {
    return (
      <svg
        viewBox="0 0 200 120"
        className="w-full h-24 object-cover opacity-25 dark:opacity-15 pointer-events-none"
        fill="currentColor"
      >
        {/* NYC Skyline & Statue of Liberty */}
        <path d="M10 120 L10 70 L25 70 L25 50 L35 50 L35 40 L40 40 L40 120 Z" />
        <path d="M45 120 L45 30 L55 30 L55 15 L58 15 L58 120 Z" />
        <path d="M65 120 L65 55 L80 55 L80 120 Z" />
        {/* Lady Liberty silhouette */}
        <path d="M140 120 L145 75 L148 60 L145 45 L150 45 L152 35 L155 35 L154 45 L160 50 L160 58 L155 60 L158 85 L165 120 Z" />
        <path d="M152 35 L150 20 L154 20 Z" />
        <path d="M165 120 L165 65 L180 65 L180 45 L185 45 L185 120 Z" />
      </svg>
    );
  }

  if (type === 'london') {
    return (
      <svg
        viewBox="0 0 200 120"
        className="w-full h-24 object-cover opacity-25 dark:opacity-15 pointer-events-none"
        fill="currentColor"
      >
        {/* Big Ben & Parliament */}
        <path d="M20 120 L20 75 L45 75 L45 120 Z" />
        <path d="M50 120 L50 40 L55 25 L65 10 L75 25 L80 40 L80 120 Z" />
        <circle cx="65" cy="35" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M85 120 L85 60 L140 60 L140 120 Z" />
        {/* London Eye wheel subtle */}
        <circle cx="165" cy="65" r="30" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
        <line x1="165" y1="65" x2="165" y2="120" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }

  if (type === 'mumbai') {
    return (
      <svg
        viewBox="0 0 200 120"
        className="w-full h-24 object-cover opacity-25 dark:opacity-15 pointer-events-none"
        fill="currentColor"
      >
        {/* Gateway of India monument */}
        <path d="M30 120 L30 50 L45 50 L45 35 L55 35 L55 50 L70 50 L70 120 Z" />
        {/* Main Arch */}
        <path d="M70 120 L70 70 Q100 35 130 70 L130 120 Z" />
        <path d="M70 50 L130 50 L130 35 L120 35 L120 25 L100 20 L80 25 L80 35 L70 35 Z" />
        <path d="M130 120 L130 50 L145 50 L145 35 L155 35 L155 50 L170 50 L170 120 Z" />
      </svg>
    );
  }

  // Tokyo
  return (
    <svg
      viewBox="0 0 200 120"
      className="w-full h-24 object-cover opacity-25 dark:opacity-15 pointer-events-none"
      fill="currentColor"
    >
      {/* Tokyo Tower & Mount Fuji contour */}
      <path d="M10 120 Q60 85 100 85 Q140 85 190 120 Z" opacity="0.5" />
      <path d="M85 120 L98 40 L95 40 L97 20 L100 5 L103 20 L105 40 L102 40 L115 120 Z" />
      <line x1="93" y1="65" x2="107" y2="65" stroke="currentColor" strokeWidth="2" />
      <line x1="90" y1="85" x2="110" y2="85" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export default function WorldClockDashboardComponent() {
  const [now, setNow] = useState<Date>(() => new Date());

  // Converter State
  const [fromCityId, setFromCityId] = useState<string>('new-york');
  const [toCityId, setToCityId] = useState<string>('mumbai');
  const [converterDate, setConverterDate] = useState<string>(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });
  const [converterTime, setConverterTime] = useState<string>('10:00');
  const converterCardRef = useRef<HTMLDivElement>(null);

  // Live timer tick every second
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Resolve cities
  const fromCity = POPULAR_CITIES.find((c) => c.id === fromCityId) || POPULAR_CITIES[1];
  const toCity = POPULAR_CITIES.find((c) => c.id === toCityId) || POPULAR_CITIES[9]; // Mumbai

  // Execute time conversion calculation
  const conversionResult = useMemo(() => {
    const res = convertTimeBetweenZones(converterDate, converterTime, fromCity.iana, toCity.iana);
    const diff = getTimeDifferenceBetween(now, fromCity.iana, toCity.iana);

    const diffHours = Math.abs(diff.hours);
    const wholeHours = Math.floor(diffHours);
    const minsRemainder = Math.round((diffHours - wholeHours) * 60);

    let diffText = '';
    if (wholeHours === 0 && minsRemainder === 0) {
      diffText = 'are in the same time zone.';
    } else {
      const parts = [];
      if (wholeHours > 0) parts.push(`${wholeHours} hour${wholeHours > 1 ? 's' : ''}`);
      if (minsRemainder > 0) parts.push(`${minsRemainder} minutes`);
      const relation = diff.hours >= 0 ? 'ahead of' : 'behind';
      diffText = `is ${parts.join(' ')} ${relation} ${fromCity.name}.`;
    }

    return {
      convertedTime: res.formatted12h,
      convertedDate: `${res.toData.weekday}, ${res.toData.month} ${res.toData.day}, ${res.toData.year}`,
      targetZone: `${toCity.name} (${res.toData.timeZoneCode})`,
      diffSummary: `${toCity.name} ${diffText}`,
    };
  }, [converterDate, converterTime, fromCity, toCity, now]);

  // Swap From and To locations
  const handleSwapCities = () => {
    const temp = fromCityId;
    setFromCityId(toCityId);
    setToCityId(temp);
  };

  // Quick select destination from popular cities bar
  const handleSelectQuickCity = (cityId: string) => {
    if (cityId === fromCityId) {
      // If clicking same as origin, pick another origin
      setFromCityId('london');
    }
    setToCityId(cityId);
    converterCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  return (
    <div className="w-full space-y-8">
      {/* =================================================================== */}
      {/* 1. FOUR REALISTIC CLOCK PANELS                                      */}
      {/* =================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {PRIMARY_CITIES.map((city) => {
          const tzData = getTimeZoneData(now, city.iana);
          const isDay = tzData.isDaylight;

          // Format readable local date e.g. "Mon, Oct 26, 2026"
          const localDateStr = `${tzData.weekday}, ${tzData.month} ${tzData.day}, ${tzData.year}`;

          // Format 12-hour digital readout e.g. "10:24 AM"
          const h12 = tzData.hour % 12 || 12;
          const ampm = tzData.hour >= 12 ? 'PM' : 'AM';
          const digitalTimeStr = `${h12}:${String(tzData.minute).padStart(2, '0')} ${ampm}`;

          return (
            <div
              key={city.id}
              className="bg-white dark:bg-[#1A201C] rounded-2xl border border-[#E4E1D9] dark:border-[#2D352F] p-5 sm:p-6 shadow-xs flex flex-col items-center justify-between relative overflow-hidden group hover:border-[#365C4B]/60 transition-all"
            >
              {/* City landmark silhouette in background */}
              <div className="absolute inset-x-0 bottom-16 text-[#365C4B]/10 dark:text-[#5E917A]/15 pointer-events-none flex justify-center">
                <CityLandmarkSilhouette type={city.landmarkSvgType} />
              </div>

              {/* Top Header: Flag, City Name & Offset */}
              <div className="w-full flex items-start gap-2.5 z-10">
                <span className="text-xl shrink-0 mt-0.5">{city.flag}</span>
                <div className="flex-1">
                  <h3 className="font-bold text-base text-[#252B27] dark:text-white leading-tight">
                    {city.name}
                  </h3>
                  <span className="text-xs font-semibold text-[#252B27]/60 dark:text-slate-400 block mt-0.5">
                    {tzData.timeZoneCode} ({tzData.offsetString.replace(':00', '').replace(':30', ':30')})
                  </span>
                </div>
              </div>

              {/* Middle: Realistic Analog Clock */}
              <div className="my-5 z-10 flex flex-col items-center">
                <RealisticAnalogClock
                  hour={tzData.hour}
                  minute={tzData.minute}
                  second={tzData.second}
                />

                {/* Day / Night pill badge */}
                <div
                  className={`mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shadow-2xs border ${
                    isDay
                      ? 'bg-[#FAF6EE] text-[#B7804C] border-[#F2E8D2] dark:bg-[#252E28] dark:text-[#E5B67C] dark:border-[#38423B]'
                      : 'bg-[#EEF1F6] text-[#3B5A8A] border-[#D9E1ED] dark:bg-[#1F2633] dark:text-[#88A6D9] dark:border-[#2D394C]'
                  }`}
                >
                  {isDay ? (
                    <>
                      <Sun className="w-3.5 h-3.5 fill-current" />
                      <span>Day</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-3.5 h-3.5 fill-current" />
                      <span>Night</span>
                    </>
                  )}
                </div>
              </div>

              {/* Bottom: Digital Time & Local Date */}
              <div className="w-full text-center z-10 pt-1">
                <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-[#252B27] dark:text-white tabular-nums">
                  {digitalTimeStr}
                </div>
                <div className="text-xs font-medium text-[#252B27]/70 dark:text-slate-400 mt-1">
                  {localDateStr}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* =================================================================== */}
      {/* 2. TIME-ZONE CONVERTER CARD                                         */}
      {/* =================================================================== */}
      <div
        ref={converterCardRef}
        className="bg-white dark:bg-[#1A201C] rounded-2xl border border-[#E4E1D9] dark:border-[#2D352F] p-6 sm:p-8 shadow-xs"
      >
        <div>
          <h2 className="font-serif text-2xl font-normal text-[#252B27] dark:text-white">
            Time-Zone Converter
          </h2>
          <p className="text-xs sm:text-sm text-[#252B27]/70 dark:text-slate-400 mt-1">
            Convert time between any two locations in the world.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch mt-6">
          {/* Left 8 Cols: From, Swap, To, Date, Time Inputs */}
          <div className="lg:col-span-8 space-y-5">
            {/* From vs To Row */}
            <div className="grid grid-cols-1 sm:grid-cols-11 gap-3 items-center">
              {/* From Selector (5 cols) */}
              <div className="sm:col-span-5 space-y-1.5">
                <label className="block text-xs font-bold text-[#252B27] dark:text-white">
                  From <span className="font-normal text-[#252B27]/60 dark:text-slate-400">(Your time zone)</span>
                </label>
                <div className="relative">
                  <select
                    value={fromCityId}
                    onChange={(e) => setFromCityId(e.target.value)}
                    className="w-full h-11 pl-3 pr-8 rounded-xl border border-[#E4E1D9] dark:border-[#2D352F] bg-[#FAF8F5] dark:bg-[#212A25] text-xs sm:text-sm font-semibold text-[#252B27] dark:text-white appearance-none cursor-pointer focus:outline-hidden focus:border-[#365C4B]"
                    aria-label="From time zone"
                  >
                    {POPULAR_CITIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.flag} {c.name} ({getTimeZoneData(now, c.iana).timeZoneCode})
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-3 top-3.5 pointer-events-none text-[#252B27]/50 dark:text-slate-400 text-xs">
                    ▼
                  </span>
                </div>
                <span className="text-[11px] text-[#252B27]/60 dark:text-slate-400 block px-1 truncate">
                  {getTimeZoneData(now, fromCity.iana).offsetString} ({fromCity.country})
                </span>
              </div>

              {/* Swap Button (1 col) */}
              <div className="sm:col-span-1 flex justify-center pt-2 sm:pt-4">
                <button
                  type="button"
                  onClick={handleSwapCities}
                  className="w-10 h-10 rounded-xl border border-[#E4E1D9] dark:border-[#2D352F] bg-white dark:bg-[#212A25] hover:bg-[#FAF8F5] dark:hover:bg-[#2A352F] text-[#365C4B] dark:text-[#5E917A] flex items-center justify-center shadow-2xs transition-transform active:scale-95 cursor-pointer"
                  title="Swap From and To locations"
                  aria-label="Swap locations"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                </button>
              </div>

              {/* To Selector (5 cols) */}
              <div className="sm:col-span-5 space-y-1.5">
                <label className="block text-xs font-bold text-[#252B27] dark:text-white">
                  To <span className="font-normal text-[#252B27]/60 dark:text-slate-400">(Convert to)</span>
                </label>
                <div className="relative">
                  <select
                    value={toCityId}
                    onChange={(e) => setToCityId(e.target.value)}
                    className="w-full h-11 pl-3 pr-8 rounded-xl border border-[#E4E1D9] dark:border-[#2D352F] bg-[#FAF8F5] dark:bg-[#212A25] text-xs sm:text-sm font-semibold text-[#252B27] dark:text-white appearance-none cursor-pointer focus:outline-hidden focus:border-[#365C4B]"
                    aria-label="To time zone"
                  >
                    {POPULAR_CITIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.flag} {c.name} ({getTimeZoneData(now, c.iana).timeZoneCode})
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-3 top-3.5 pointer-events-none text-[#252B27]/50 dark:text-slate-400 text-xs">
                    ▼
                  </span>
                </div>
                <span className="text-[11px] text-[#252B27]/60 dark:text-slate-400 block px-1 truncate">
                  {getTimeZoneData(now, toCity.iana).offsetString} ({toCity.country})
                </span>
              </div>
            </div>

            {/* Date, Time & Convert Button Row */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end pt-1">
              {/* Date Input */}
              <div className="sm:col-span-4 space-y-1.5">
                <label className="block text-xs font-bold text-[#252B27] dark:text-white">
                  Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-[#252B27]/50 dark:text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
                  <input
                    type="date"
                    value={converterDate}
                    onChange={(e) => setConverterDate(e.target.value)}
                    className="w-full h-11 pl-9 pr-3 rounded-xl border border-[#E4E1D9] dark:border-[#2D352F] bg-[#FAF8F5] dark:bg-[#212A25] text-xs sm:text-sm font-semibold text-[#252B27] dark:text-white focus:outline-hidden focus:border-[#365C4B]"
                    aria-label="Select date"
                  />
                </div>
              </div>

              {/* Time Input */}
              <div className="sm:col-span-4 space-y-1.5">
                <label className="block text-xs font-bold text-[#252B27] dark:text-white">
                  Time
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-[#252B27]/50 dark:text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
                  <input
                    type="time"
                    value={converterTime}
                    onChange={(e) => setConverterTime(e.target.value)}
                    className="w-full h-11 pl-9 pr-3 rounded-xl border border-[#E4E1D9] dark:border-[#2D352F] bg-[#FAF8F5] dark:bg-[#212A25] text-xs sm:text-sm font-semibold text-[#252B27] dark:text-white focus:outline-hidden focus:border-[#365C4B]"
                    aria-label="Select time"
                  />
                </div>
              </div>

              {/* Convert Time Action Button */}
              <div className="sm:col-span-4">
                <button
                  type="button"
                  className="w-full h-11 rounded-xl bg-[#365C4B] hover:bg-[#2C4B3D] text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95 cursor-pointer"
                >
                  <span>Convert Time</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right 4 Cols: Converted Time Display Box */}
          <div className="lg:col-span-4">
            <div className="h-full bg-[#E7EDE7]/60 dark:bg-[#252E28] border border-[#D5DDD5] dark:border-[#2D352F] rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#252B27]/60 dark:text-slate-400 block mb-1">
                  Converted Time
                </span>
                <div className="text-3xl sm:text-4xl font-bold font-mono text-[#252B27] dark:text-white tabular-nums my-1">
                  {conversionResult.convertedTime}
                </div>
                <div className="text-xs sm:text-sm font-medium text-[#252B27]/85 dark:text-slate-300">
                  {conversionResult.convertedDate} in {conversionResult.targetZone}
                </div>
              </div>

              <div className="pt-4 border-t border-[#D5DDD5]/80 dark:border-[#2D352F] mt-4 flex items-center gap-2 text-xs text-[#252B27]/75 dark:text-slate-400">
                <Clock className="w-4 h-4 text-[#365C4B] dark:text-[#5E917A] shrink-0" />
                <span>{conversionResult.diffSummary}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 3. MEETING PLANNER ENTRY BANNER                                     */}
      {/* =================================================================== */}
      <div className="bg-white dark:bg-[#1A201C] rounded-2xl border border-[#E4E1D9] dark:border-[#2D352F] p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#E7EDE7] dark:bg-[#252E28] text-[#365C4B] dark:text-[#5E917A] flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg text-[#252B27] dark:text-white">
              Meeting Planner
            </h3>
            <p className="text-xs sm:text-sm text-[#252B27]/70 dark:text-slate-400 mt-0.5">
              Find the best time for everyone across different time zones.
            </p>
          </div>
        </div>

        <Link prefetch={false}
          href="/meeting-planner"
          className="self-start sm:self-auto px-5 py-2.5 rounded-xl bg-[#365C4B] hover:bg-[#2C4B3D] text-white font-medium text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-transform active:scale-95 cursor-pointer shrink-0"
        >
          <span>Open Meeting Planner</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* =================================================================== */}
      {/* 4. POPULAR CITIES QUICK BAR                                         */}
      {/* =================================================================== */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-baseline gap-2">
          <h3 className="text-sm sm:text-base font-bold text-[#252B27] dark:text-white">
            Popular Cities
          </h3>
          <span className="text-xs text-[#252B27]/60 dark:text-slate-400 hidden sm:inline">
            Quickly check the current time in popular locations.
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {POPULAR_QUICK_CITIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => handleSelectQuickCity(c.id)}
              className={`px-3.5 py-1.5 rounded-full border text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                toCityId === c.id
                  ? 'bg-[#365C4B] text-white border-[#365C4B]'
                  : 'bg-white dark:bg-[#1A201C] text-[#252B27] dark:text-slate-300 border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#365C4B]'
              }`}
            >
              <span>{c.flag}</span>
              <span>{c.name}</span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => handleSelectQuickCity('sydney')}
            className="p-1.5 rounded-full border border-[#E4E1D9] dark:border-[#2D352F] bg-white dark:bg-[#1A201C] text-[#252B27]/70 hover:text-[#365C4B] shrink-0"
            aria-label="More cities"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

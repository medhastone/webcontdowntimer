'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { motion } from 'motion/react';
import {
  Calendar,
  Clock,
  Maximize2,
  Minimize2,
  ArrowRight,
  Calculator,
  Globe,
  CheckCircle2,
  PartyPopper,
  Layers,
  Hash,
  Sparkles,
} from 'lucide-react';
import SharePageButton from '@/components/common/SharePageButton';
import HolidayCelebrationScene from '@/components/holidays/HolidayCelebrationScene';
import HolidayFlipClock from '@/components/holidays/HolidayFlipClock';
import { HolidayIconGlyph } from '@/components/holidays/HolidayVisualIcon';
import { getHolidayVisualTheme } from '@/lib/holiday-visuals';
import {
  countBusinessDaysBetween,
  formatWeeksRemaining,
  type ResolvedHolidayOccurrence,
} from '@/lib/holidays-data';

interface HolidayCountdownClientProps {
  initialData: ResolvedHolidayOccurrence;
}

interface LiveCountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  daysRemaining: number;
  weeksRemainingLabel: string;
  businessDaysRemaining: number;
  isToday: boolean;
  isPast: boolean;
  localTz: string;
}

function computeLocalCountdown(data: ResolvedHolidayOccurrence, nowMs: number): LiveCountdownState {
  const now = new Date(nowMs);
  const nowYear = now.getFullYear();
  const nowMonth = now.getMonth() + 1;
  const nowDay = now.getDate();

  const targetStartMs = new Date(
    data.targetYear,
    data.targetMonth - 1,
    data.targetDay,
    0,
    0,
    0,
    0
  ).getTime();

  const diffMs = targetStartMs - nowMs;
  const isSameDay =
    nowYear === data.targetYear &&
    nowMonth === data.targetMonth &&
    nowDay === data.targetDay;

  const isPast = diffMs <= 0 && !isSameDay;

  let days = 0;
  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  if (diffMs > 0) {
    const totalSec = Math.floor(diffMs / 1000);
    days = Math.floor(totalSec / 86400);
    hours = Math.floor((totalSec % 86400) / 3600);
    minutes = Math.floor((totalSec % 3600) / 60);
    seconds = totalSec % 60;
  }

  const todayUtc = Date.UTC(nowYear, nowMonth - 1, nowDay);
  const targetUtc = Date.UTC(data.targetYear, data.targetMonth - 1, data.targetDay);
  const daysRemaining = Math.max(0, Math.round((targetUtc - todayUtc) / 86400000));

  const businessDaysRemaining = countBusinessDaysBetween(
    nowYear,
    nowMonth,
    nowDay,
    data.targetYear,
    data.targetMonth,
    data.targetDay
  );

  let localTz = 'Local Time';
  try {
    localTz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local Time';
  } catch {
    localTz = 'Local Time';
  }

  return {
    days,
    hours,
    minutes,
    seconds,
    daysRemaining,
    weeksRemainingLabel: formatWeeksRemaining(daysRemaining),
    businessDaysRemaining,
    isToday: isSameDay,
    isPast,
    localTz,
  };
}

export default function HolidayCountdownClient({ initialData }: HolidayCountdownClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const celebratedTodayRef = useRef(false);
  const celebrateTimerRef = useRef<number | null>(null);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [displayMode, setDisplayMode] = useState<'flip' | 'digital'>('flip');
  const [isCelebrating, setIsCelebrating] = useState(false);

  const theme = getHolidayVisualTheme(initialData.slug, initialData.baseSlug);

  const [live, setLive] = useState<LiveCountdownState>(() => ({
    days: initialData.daysRemaining,
    hours: 0,
    minutes: 0,
    seconds: 0,
    daysRemaining: initialData.daysRemaining,
    weeksRemainingLabel: initialData.weeksRemainingLabel,
    businessDaysRemaining: initialData.businessDaysRemaining,
    isToday: initialData.isToday,
    isPast: initialData.isPastPinned,
    localTz: 'Local Browser Time',
  }));

  const launchCelebrationBurst = useCallback(() => {
    setIsCelebrating(true);
    if (celebrateTimerRef.current !== null) {
      window.clearTimeout(celebrateTimerRef.current);
    }
    celebrateTimerRef.current = window.setTimeout(() => {
      setIsCelebrating(false);
    }, 1100);

    try {
      confetti({
        particleCount: 95,
        spread: 75,
        origin: { y: 0.62 },
        colors: theme.confettiColors,
        disableForReducedMotion: true,
      });
    } catch {
      // Ignore canvas-confetti errors in unsupported contexts
    }
  }, [theme.confettiColors]);

  useEffect(() => {
    const update = () => {
      setLive(computeLocalCountdown(initialData, Date.now()));
    };
    const rafId = window.requestAnimationFrame(update);
    const timer = window.setInterval(update, 1000);
    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearInterval(timer);
    };
  }, [initialData]);

  useEffect(() => {
    if (live.isToday && !celebratedTodayRef.current) {
      celebratedTodayRef.current = true;
      const rafId = window.requestAnimationFrame(() => {
        launchCelebrationBurst();
      });
      return () => window.cancelAnimationFrame(rafId);
    }
    return undefined;
  }, [live.isToday, launchCelebrationBurst]);

  useEffect(() => {
    return () => {
      if (celebrateTimerRef.current !== null) {
        window.clearTimeout(celebrateTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const onFsChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      } else if (document.fullscreenElement === containerRef.current) {
        setIsFullscreen(true);
      }
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  useEffect(() => {
    if (!isFullscreen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }
        setIsFullscreen(false);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isFullscreen]);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      setIsFullscreen(true);
      const el = containerRef.current;
      if (el && typeof el.requestFullscreen === 'function') {
        el.requestFullscreen().catch(() => {
          // Fallback to fixed viewport fullscreen when native Fullscreen API is unavailable (e.g. iOS Safari)
        });
      }
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  const dayWord = live.daysRemaining === 1 ? 'day' : 'days';
  const bizDayWord = live.businessDaysRemaining === 1 ? 'business day' : 'business days';

  const eventTimerTitle = initialData.isPureYear
    ? `Countdown to ${initialData.holidayName}`
    : `${initialData.holidayName} ${initialData.year}`;

  const timerCtaHref = `/event-countdown-timer?title=${encodeURIComponent(
    eventTimerTitle
  )}&date=${encodeURIComponent(initialData.isoLocalMidnight)}&tz=${encodeURIComponent(
    live.localTz === 'Local Browser Time' ? 'America/New_York' : live.localTz
  )}`;

  const digitalUnits = [
    { label: 'Days', value: String(live.days).padStart(2, '0') },
    { label: 'Hours', value: String(live.hours).padStart(2, '0') },
    { label: 'Minutes', value: String(live.minutes).padStart(2, '0') },
    { label: 'Seconds', value: String(live.seconds).padStart(2, '0') },
  ];

  return (
    <div className="space-y-6">
      {/* Above-the-Fold Summary Sentence + Secondary Weeks/Business-Days Line */}
      <div className="space-y-2">
        <p className="text-lg sm:text-xl font-medium text-[#252B27] dark:text-slate-100 leading-relaxed">
          {live.isPast ? (
            <>
              <strong>{initialData.holidayName} {initialData.year}</strong> occurred on{' '}
              <strong>
                {initialData.dayOfWeek}, {initialData.nextDate}
              </strong>
              . There are <strong>0 days</strong> remaining until this past date.
            </>
          ) : live.isToday ? (
            <>
              Today is <strong>{initialData.holidayName}</strong> ({initialData.dayOfWeek},{' '}
              {initialData.nextDate}). There are <strong>0 days</strong> until{' '}
              {initialData.holidayName}!
            </>
          ) : (
            <>
              There {live.daysRemaining === 1 ? 'is' : 'are'}{' '}
              <strong className="font-mono tabular-nums text-[#365C4B] dark:text-[#70B393]">
                {live.daysRemaining}
              </strong>{' '}
              {dayWord} until <strong>{initialData.holidayName}</strong> on{' '}
              <strong>
                {initialData.dayOfWeek}, {initialData.nextDate}
              </strong>
              .
            </>
          )}
        </p>

        <p className="text-sm sm:text-base text-[#252B27]/75 dark:text-slate-400">
          {live.isPast ? (
            <>
              0 weeks and 0 business days remaining —{' '}
              <Link
                prefetch={false}
                href={`/days-until/${initialData.baseSlug}`}
                className="font-semibold text-[#365C4B] dark:text-[#70B393] underline"
              >
                Track the next upcoming {initialData.holidayName} instead
              </Link>
              .
            </>
          ) : (
            <>
              That is{' '}
              <span className="font-semibold text-[#252B27] dark:text-slate-200 tabular-nums">
                {live.weeksRemainingLabel}
              </span>{' '}
              and{' '}
              <span className="font-semibold text-[#252B27] dark:text-slate-200 tabular-nums">
                {live.businessDaysRemaining} {bizDayWord}
              </span>{' '}
              (Monday–Friday) remaining.
            </>
          )}
        </p>
      </div>

      {/* Live Celebration & 3D Flip Countdown Stage Card */}
      <div
        ref={containerRef}
        className={`relative overflow-hidden border border-white/15 text-white shadow-xl transition-all ${
          isFullscreen
            ? 'fixed inset-0 z-50 h-dvh w-screen rounded-none border-none flex flex-col items-center justify-center overflow-y-auto'
            : 'rounded-3xl'
        }`}
        style={{
          background: isFullscreen ? theme.fullscreenGradient : theme.stageGradient,
        }}
      >
        {/* Continuous Animated Holiday Visual Particles & Ambient Glow */}
        <HolidayCelebrationScene
          theme={theme}
          isToday={live.isToday || isCelebrating}
          isFullscreen={isFullscreen}
        />

        {/* Foreground Interactive Layer */}
        {isFullscreen ? (
          <div className="relative z-10 w-full min-h-full flex flex-col items-center justify-center px-4 sm:px-8 py-14 sm:py-10">
            {/* Fullscreen Mode: ONLY Exit Fullscreen Button across Mobile & Desktop */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="fixed top-4 right-4 sm:top-6 sm:right-6 z-30 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-black/45 hover:bg-black/65 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-semibold shadow-lg transition-colors cursor-pointer"
              aria-label="Exit Fullscreen"
              title="Exit Fullscreen"
            >
              <Minimize2 className="w-4 h-4 shrink-0" />
              <span>Exit Fullscreen</span>
            </button>

            {live.isToday ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center gap-6 text-center"
              >
                <div className="rounded-2xl bg-black/30 backdrop-blur-md border border-white/20 py-6 px-6 space-y-2 shadow-lg">
                  <div
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
                    style={{ color: theme.accentHex }}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Live Celebration Active</span>
                  </div>
                  <div className="font-serif text-3xl sm:text-5xl font-bold text-white">
                    Happy {initialData.holidayName}!
                  </div>
                </div>

                {displayMode === 'flip' ? (
                  <HolidayFlipClock
                    days={0}
                    hours={0}
                    minutes={0}
                    seconds={0}
                    theme={theme}
                    isFullscreen
                  />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-5 w-full max-w-[260px] sm:max-w-5xl mx-auto">
                    {digitalUnits.map((unit) => (
                      <div
                        key={unit.label}
                        className="rounded-2xl bg-black/30 backdrop-blur-md py-3.5 px-5 sm:p-7 text-center shadow-lg"
                        style={{ border: `1px solid ${theme.flapBorder}` }}
                      >
                        <div
                          className="font-mono text-4xl sm:text-6xl font-bold tracking-tight tabular-nums"
                          style={{ color: theme.digitColor, textShadow: theme.digitShadow }}
                        >
                          00
                        </div>
                        <div
                          className="text-[11px] font-bold uppercase tracking-widest mt-1.5 sm:mt-2"
                          style={{ color: theme.accentHex }}
                        >
                          {unit.label}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : displayMode === 'flip' ? (
              <HolidayFlipClock
                days={live.days}
                hours={live.hours}
                minutes={live.minutes}
                seconds={live.seconds}
                theme={theme}
                isFullscreen
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-5 w-full max-w-[260px] sm:max-w-5xl mx-auto">
                {digitalUnits.map((unit) => (
                  <div
                    key={unit.label}
                    className="rounded-2xl bg-black/30 backdrop-blur-md py-3.5 px-5 sm:p-7 text-center shadow-lg"
                    style={{ border: `1px solid ${theme.flapBorder}` }}
                  >
                    <div
                      className="font-mono text-4xl sm:text-6xl font-bold tracking-tight tabular-nums"
                      style={{ color: theme.digitColor, textShadow: theme.digitShadow }}
                    >
                      {unit.value}
                    </div>
                    <div
                      className="text-[11px] font-bold uppercase tracking-widest mt-1.5 sm:mt-2"
                      style={{ color: theme.accentHex }}
                    >
                      {unit.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="relative z-10 flex flex-col justify-between h-full">
            {/* Top Control & Celebration Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 sm:px-8 py-3.5 bg-black/25 backdrop-blur-md border-b border-white/10">
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-white/90">
                <span
                  className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 font-semibold"
                  style={{ color: theme.accentHex }}
                >
                  <motion.span
                    animate={{ scale: [1, 1.35, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: theme.accentHex }}
                  />
                  <HolidayIconGlyph name={theme.primaryIcon} className="w-3.5 h-3.5 shrink-0" />
                  <span>{theme.vibeLabel}</span>
                </span>

                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 border border-white/10 text-white/85">
                  <Globe className="w-3.5 h-3.5 opacity-80" />
                  <span>{live.localTz}</span>
                </span>

                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 border border-white/10 text-white/85">
                  <Calendar className="w-3.5 h-3.5 opacity-80" />
                  <span>
                    {initialData.dayOfWeek}, {initialData.nextDate}
                  </span>
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 ml-auto">
                {/* Display Mode Switch: 3D Flip Timer (Default) vs Digital */}
                <div
                  className="inline-flex items-center p-0.5 rounded-lg bg-black/35 border border-white/15"
                  role="group"
                  aria-label="Countdown display style"
                >
                  <button
                    type="button"
                    onClick={() => setDisplayMode('flip')}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                      displayMode === 'flip'
                        ? 'bg-white text-[#141816] shadow-xs'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Flip Timer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDisplayMode('digital')}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                      displayMode === 'digital'
                        ? 'bg-white text-[#141816] shadow-xs'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    <Hash className="w-3.5 h-3.5" />
                    <span>Digital</span>
                  </button>
                </div>

                {/* Interactive Celebrate Confetti Trigger */}
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.94 }}
                  onClick={launchCelebrationBurst}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border border-white/25 shadow-xs"
                  style={{
                    backgroundColor: isCelebrating ? theme.accentHex : 'rgba(255, 255, 255, 0.14)',
                    color: isCelebrating ? '#141816' : '#FFFFFF',
                  }}
                  title="Trigger celebration confetti"
                >
                  <PartyPopper className="w-3.5 h-3.5 shrink-0" />
                  <span>Celebrate</span>
                </motion.button>

                {/* Share Button inside Tools Section */}
                <SharePageButton variant="toolbar" />

                {/* Fullscreen Toggle */}
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/12 hover:bg-white/22 border border-white/15 text-white text-xs font-semibold transition-colors cursor-pointer"
                  aria-label="Enter Fullscreen"
                  title="Enter Fullscreen"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Fullscreen</span>
                </button>
              </div>
            </div>

            {/* Center Celebration Motif Header + Flip/Digital Countdown */}
            <div className="px-5 sm:px-8 py-8 sm:py-11 space-y-6">
              {/* Related Holiday Visuals Strip */}
              <div className="flex flex-col items-center text-center gap-3">
                <div className="flex items-center justify-center gap-2">
                  <motion.div
                    animate={{ y: [0, -4, 0], rotate: [0, -4, 4, 0] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-10 h-10 rounded-2xl flex items-center justify-center border border-white/20 bg-white/10 backdrop-blur-sm shadow-md"
                    style={{ color: theme.accentHex }}
                  >
                    <HolidayIconGlyph name={theme.primaryIcon} className="w-5 h-5" />
                  </motion.div>

                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/25 border border-white/10 backdrop-blur-sm">
                    {theme.motifs.map((motifKey, idx) => (
                      <motion.span
                        key={`${motifKey}-${idx}`}
                        animate={{ opacity: [0.65, 1, 0.65], scale: [0.95, 1.08, 0.95] }}
                        transition={{
                          duration: 2.8,
                          delay: idx * 0.45,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                        className="inline-flex items-center justify-center"
                        style={{
                          color: idx % 2 === 0 ? theme.accentHex : theme.secondaryHex,
                        }}
                      >
                        <HolidayIconGlyph name={motifKey} className="w-4 h-4" />
                      </motion.span>
                    ))}
                    <span className="text-xs font-semibold tracking-wide text-white/90 pl-1.5">
                      {theme.celebrationTitle}
                    </span>
                  </div>
                </div>
              </div>

              {live.isToday ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="max-w-3xl mx-auto space-y-6 text-center"
                >
                  <div className="rounded-2xl bg-black/30 backdrop-blur-md border border-white/20 py-7 px-6 space-y-3 shadow-lg">
                    <div
                      className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
                      style={{ color: theme.accentHex }}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Live Celebration Active</span>
                    </div>
                    <div className="font-serif text-3xl sm:text-5xl font-bold text-white">
                      Happy {initialData.holidayName}!
                    </div>
                    <p className="text-sm text-white/80">
                      Today is {initialData.dayOfWeek}, {initialData.nextDate}.
                    </p>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={launchCelebrationBurst}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#141816] hover:bg-white/90 text-xs font-bold shadow-md transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Launch Celebration Confetti</span>
                      </button>
                    </div>
                  </div>

                  {displayMode === 'flip' && (
                    <HolidayFlipClock
                      days={0}
                      hours={0}
                      minutes={0}
                      seconds={0}
                      theme={theme}
                      isFullscreen={false}
                    />
                  )}
                </motion.div>
              ) : displayMode === 'flip' ? (
                <HolidayFlipClock
                  days={live.days}
                  hours={live.hours}
                  minutes={live.minutes}
                  seconds={live.seconds}
                  theme={theme}
                  isFullscreen={false}
                />
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 max-w-4xl mx-auto">
                  {digitalUnits.map((unit) => (
                    <div
                      key={unit.label}
                      className="rounded-2xl bg-black/30 backdrop-blur-md p-4 sm:p-6 text-center shadow-lg"
                      style={{ border: `1px solid ${theme.flapBorder}` }}
                    >
                      <div
                        className="font-mono text-4xl sm:text-6xl font-bold tracking-tight tabular-nums"
                        style={{ color: theme.digitColor, textShadow: theme.digitShadow }}
                      >
                        {unit.value}
                      </div>
                      <div
                        className="text-[11px] font-bold uppercase tracking-widest mt-2"
                        style={{ color: theme.accentHex }}
                      >
                        {unit.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom CTA Bar: "Use this countdown as a timer" + Date Calculator Link */}
            <div className="px-5 sm:px-8 py-4 bg-black/25 backdrop-blur-md border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  prefetch={false}
                  href={timerCtaHref}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-white/90 text-[#141816] text-sm font-bold shadow-xs transition-colors"
                >
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>Use this countdown as a timer</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </Link>

                <Link
                  prefetch={false}
                  href="/countdown-timer"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-white transition-colors"
                >
                  <span>Open General Countdown Timer</span>
                </Link>
              </div>

              <Link
                prefetch={false}
                href="/date-calculator"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/85 hover:text-white hover:underline self-start sm:self-center"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Calculate custom dates</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { playTimerSound } from '@/lib/sound';
import { POPULAR_CITIES } from '@/lib/time-zones';
import { Calendar, Clock, Share2, Maximize, Minimize, Check, ArrowRight } from 'lucide-react';

export default function EventCountdownComponent() {
  // Default to a future event (e.g. 7 days from now at 12:00 PM)
  const [targetDateStr, setTargetDateStr] = useState(() => {
    const d = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    return d.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
  });
  const [eventTitle, setEventTitle] = useState('Product Launch & Livestream');
  const [selectedTz, setSelectedTz] = useState('America/New_York');
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalSeconds: 0,
    isExpired: false,
  });

  const celebrationTriggeredRef = useRef(false);

  // Hydrate initial values when linked from /days-until/[slug] ("Use this countdown as a timer")
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const rafId = window.requestAnimationFrame(() => {
      const params = new URLSearchParams(window.location.search);
      const paramTitle = params.get('title');
      const paramDate = params.get('date');
      const paramTz = params.get('tz');

      if (paramTitle && paramTitle.trim().length > 0) {
        setEventTitle(paramTitle.trim());
      }
      if (paramDate && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(paramDate)) {
        celebrationTriggeredRef.current = false;
        setTargetDateStr(paramDate.slice(0, 16));
      }
      if (paramTz && POPULAR_CITIES.some((c) => c.iana === paramTz)) {
        setSelectedTz(paramTz);
      }
    });
    return () => window.cancelAnimationFrame(rafId);
  }, []);

  useEffect(() => {
    const updateCountdown = () => {
      try {
        const targetMs = new Date(targetDateStr).getTime();
        const nowMs = Date.now();
        const diffSec = Math.floor((targetMs - nowMs) / 1000);

        if (diffSec <= 0) {
          setTimeRemaining({
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            totalSeconds: 0,
            isExpired: true,
          });

          if (!celebrationTriggeredRef.current && diffSec >= -5) {
            celebrationTriggeredRef.current = true;
            playTimerSound('bell', 0.8);
            confetti({
              particleCount: 120,
              spread: 70,
              origin: { y: 0.6 },
            });
          }
        } else {
          const days = Math.floor(diffSec / (3600 * 24));
          const hours = Math.floor((diffSec % (3600 * 24)) / 3600);
          const minutes = Math.floor((diffSec % 3600) / 60);
          const seconds = diffSec % 60;

          setTimeRemaining({
            days,
            hours,
            minutes,
            seconds,
            totalSeconds: diffSec,
            isExpired: false,
          });
        }
      } catch {
        // ignore date parse
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDateStr]);

  const handleCopyShareLink = () => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/event-countdown-timer?title=${encodeURIComponent(
        eventTitle
      )}&date=${encodeURIComponent(targetDateStr)}&tz=${encodeURIComponent(selectedTz)}`;
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      const orientation = (screen as unknown as { orientation?: { lock?: (mode: string) => Promise<void> } }).orientation;
      orientation?.lock?.('landscape')?.catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      const orientation = (screen as unknown as { orientation?: { unlock?: () => void } }).orientation;
      orientation?.unlock?.();
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-sm relative ${
        isFullscreen ? 'timer-fullscreen-stage flex flex-col items-center justify-center bg-[#06090F] text-white border-none' : ''
      }`}
    >
      {/* Fullscreen Exit Button in Corner */}
      {isFullscreen && (
        <button
          type="button"
          onClick={toggleFullscreen}
          className="absolute top-4 right-4 z-50 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-black/55 hover:bg-black/75 text-white border border-white/20 backdrop-blur-md text-xs font-semibold shadow-lg transition-all cursor-pointer"
          aria-label="Exit Fullscreen"
        >
          <Minimize className="w-4 h-4" />
          <span>Exit Fullscreen</span>
        </button>
      )}

      {/* Top Header */}
      {!isFullscreen && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-100 dark:border-neutral-800">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">Target Event</span>
            <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white">{eventTitle}</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyShareLink}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Copied!' : 'Share Event'}</span>
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
              aria-label="Toggle Fullscreen"
            >
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Countdown Display */}
      <div className={isFullscreen ? 'w-full px-6' : 'my-8 sm:my-12'}>
        {timeRemaining.isExpired ? (
          <div className="text-center py-8 space-y-2">
            <div className="text-4xl sm:text-6xl font-black text-emerald-600 dark:text-emerald-400">
              The Event is Live!
            </div>
            <p className="text-sm text-neutral-500">The countdown reached zero.</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4 max-w-5xl mx-auto">
            {[
              { label: 'Days', val: timeRemaining.days },
              { label: 'Hours', val: timeRemaining.hours },
              { label: 'Minutes', val: timeRemaining.minutes },
              { label: 'Seconds', val: timeRemaining.seconds },
            ].map((unit) => (
              <div
                key={unit.label}
                className={`${
                  isFullscreen
                    ? 'bg-white/5 border border-white/15 rounded-2xl p-6 text-center backdrop-blur-md'
                    : 'bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 sm:p-6 text-center'
                }`}
              >
                <div className={`font-mono font-black tabular-nums tracking-tight ${isFullscreen ? 'text-[clamp(2.5rem,9vmin,7rem)] text-white' : 'text-5xl sm:text-6xl lg:text-7xl text-neutral-900 dark:text-white'}`}>
                  {String(unit.val).padStart(2, '0')}
                </div>
                <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mt-2">
                  {unit.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Configuration Inputs */}
      {!isFullscreen && (
        <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="text-neutral-500 block mb-1 font-medium">Event Title</label>
            <input
              type="text"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-medium"
            />
          </div>

          <div>
            <label className="text-neutral-500 block mb-1 font-medium">Target Date & Time</label>
            <input
              type="datetime-local"
              value={targetDateStr}
              onChange={(e) => {
                celebrationTriggeredRef.current = false;
                setTargetDateStr(e.target.value);
              }}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono"
            />
          </div>

          <div>
            <label className="text-neutral-500 block mb-1 font-medium">Target Time Zone</label>
            <select
              value={selectedTz}
              onChange={(e) => setSelectedTz(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
            >
              {POPULAR_CITIES.map((c) => (
                <option key={c.id} value={c.iana}>
                  {c.name} ({c.iana})
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {!isFullscreen && (
        <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 font-semibold text-neutral-600 dark:text-neutral-300">
              <Calendar className="w-3.5 h-3.5 text-[#365C4B] dark:text-[#70B393]" />
              <span>Quick Holiday Countdowns:</span>
            </span>
            {[
              { label: 'Christmas Eve', href: '/days-until/christmas-eve' },
              { label: 'New Year 2027', href: '/days-until/2027' },
              { label: "Valentine's Day", href: '/days-until/valentines-day' },
              { label: 'Thanksgiving', href: '/days-until/thanksgiving' },
            ].map((item) => (
              <Link
                key={item.href}
                prefetch={false}
                href={item.href}
                className="px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-[#E7EDE7] dark:hover:bg-[#223029] text-neutral-700 dark:text-neutral-200 font-medium transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <Link
            prefetch={false}
            href="/days-until"
            className="inline-flex items-center gap-1 font-semibold text-[#365C4B] dark:text-[#70B393] hover:underline"
          >
            <span>All 28 Holiday Countdowns</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}

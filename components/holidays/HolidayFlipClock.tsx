'use client';

import React, { useState, useEffect, useRef } from 'react';
import type { HolidayVisualTheme } from '@/lib/holiday-visuals';

interface FlipCardState {
  current: string;
  previous: string;
  flipping: boolean;
  seq: number;
}

interface HolidaySplitFlapDigitProps {
  digit: string;
  theme: HolidayVisualTheme;
  compact?: boolean;
  isFullscreen?: boolean;
}

function HolidaySplitFlapDigit({
  digit,
  theme,
  compact = false,
  isFullscreen = false,
}: HolidaySplitFlapDigitProps) {
  const [flipState, setFlipState] = useState<FlipCardState>({
    current: digit,
    previous: digit,
    flipping: false,
    seq: 0,
  });

  const currentValRef = useRef(digit);
  const topFlapRef = useRef<HTMLDivElement | null>(null);
  const bottomFlapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (digit === currentValRef.current) return;
    const prevDigit = currentValRef.current;
    currentValRef.current = digit;

    const rafId = window.requestAnimationFrame(() => {
      setFlipState((prev) => ({
        current: digit,
        previous: prevDigit,
        flipping: true,
        seq: prev.seq + 1,
      }));
    });

    return () => window.cancelAnimationFrame(rafId);
  }, [digit]);

  useEffect(() => {
    if (flipState.seq === 0) return;

    const topEl = topFlapRef.current;
    const bottomEl = bottomFlapRef.current;

    let topAnim: Animation | null = null;
    let bottomAnim: Animation | null = null;

    if (topEl && typeof topEl.animate === 'function') {
      topAnim = topEl.animate(
        [
          { transform: 'rotateX(0deg)', filter: 'brightness(1)' },
          { transform: 'rotateX(-90deg)', filter: 'brightness(0.45)' },
        ],
        {
          duration: 190,
          easing: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
          fill: 'forwards',
        }
      );
    }

    if (bottomEl && typeof bottomEl.animate === 'function') {
      bottomAnim = bottomEl.animate(
        [
          { transform: 'rotateX(90deg)', filter: 'brightness(0.45)', offset: 0 },
          { transform: 'rotateX(90deg)', filter: 'brightness(0.45)', offset: 0.46 },
          { transform: 'rotateX(-5deg)', filter: 'brightness(1.08)', offset: 0.88 },
          { transform: 'rotateX(0deg)', filter: 'brightness(1)', offset: 1 },
        ],
        {
          duration: 400,
          easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
          fill: 'forwards',
        }
      );
    }

    const doneTimer = window.setTimeout(() => {
      setFlipState((prev) =>
        prev.seq === flipState.seq
          ? { ...prev, previous: prev.current, flipping: false }
          : prev
      );
    }, 410);

    return () => {
      window.clearTimeout(doneTimer);
      topAnim?.cancel();
      bottomAnim?.cancel();
    };
  }, [flipState.seq]);

  const cardSizeClass = isFullscreen
    ? 'w-[clamp(44px,9vw,108px)] h-[clamp(66px,14vmin,160px)] rounded-xl sm:rounded-2xl'
    : compact
    ? 'w-[34px] h-[52px] sm:w-[44px] sm:h-[68px] rounded-lg sm:rounded-xl'
    : 'w-[42px] h-[64px] sm:w-[56px] sm:h-[86px] md:w-[64px] md:h-[98px] rounded-lg sm:rounded-xl';

  const digitTextClass = isFullscreen
    ? 'text-[clamp(36px,7.5vw,92px)]'
    : compact
    ? 'text-[28px] sm:text-[38px]'
    : 'text-[36px] sm:text-[48px] md:text-[56px]';

  const staticTopDigit = flipState.current;
  const staticBottomDigit = flipState.flipping ? flipState.previous : flipState.current;

  return (
    <div
      className={`relative select-none shrink-0 ${cardSizeClass} shadow-[0_10px_24px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.14)]`}
      style={{
        perspective: '700px',
        border: `1.5px solid ${theme.flapBorder}`,
        background: '#0A0D0B',
      }}
    >
      {/* Left & Right Mechanical Hinge Pins */}
      <span
        aria-hidden="true"
        className="absolute -left-[3px] top-1/2 -translate-y-1/2 w-[4px] h-3 rounded-xs bg-gradient-to-b from-zinc-300 via-zinc-500 to-zinc-800 z-30 shadow-xs"
      />
      <span
        aria-hidden="true"
        className="absolute -right-[3px] top-1/2 -translate-y-1/2 w-[4px] h-3 rounded-xs bg-gradient-to-b from-zinc-300 via-zinc-500 to-zinc-800 z-30 shadow-xs"
      />

      {/* 1. Static Top Half */}
      <div
        className="absolute inset-x-0 top-0 h-1/2 overflow-hidden rounded-t-[inherit]"
        style={{ background: theme.flapTopBg }}
      >
        <div
          className={`absolute inset-x-0 top-0 h-[200%] flex items-center justify-center leading-none font-mono font-bold tracking-tight tabular-nums ${digitTextClass}`}
          style={{ color: theme.digitColor, textShadow: theme.digitShadow }}
        >
          {staticTopDigit}
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-white/10 to-black/15 pointer-events-none"
        />
      </div>

      {/* 2. Static Bottom Half */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/2 overflow-hidden rounded-b-[inherit]"
        style={{ background: theme.flapBottomBg }}
      >
        <div
          className={`absolute inset-x-0 bottom-0 h-[200%] flex items-center justify-center leading-none font-mono font-bold tracking-tight tabular-nums ${digitTextClass}`}
          style={{ color: theme.digitColor, textShadow: theme.digitShadow }}
        >
          {staticBottomDigit}
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/20 pointer-events-none"
        />
      </div>

      {/* 3. Animated Top Flap (folds down) */}
      <div
        ref={topFlapRef}
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1/2 overflow-hidden rounded-t-[inherit] z-20"
        style={{
          background: theme.flapTopBg,
          transformOrigin: '50% 100%',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          visibility: flipState.flipping ? 'visible' : 'hidden',
          pointerEvents: 'none',
        }}
      >
        <div
          className={`absolute inset-x-0 top-0 h-[200%] flex items-center justify-center leading-none font-mono font-bold tracking-tight tabular-nums ${digitTextClass}`}
          style={{ color: theme.digitColor, textShadow: theme.digitShadow }}
        >
          {flipState.previous}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-black/20 pointer-events-none" />
      </div>

      {/* 4. Animated Bottom Flap (unfolds into place) */}
      <div
        ref={bottomFlapRef}
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1/2 overflow-hidden rounded-b-[inherit] z-20"
        style={{
          background: theme.flapBottomBg,
          transformOrigin: '50% 0%',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          visibility: flipState.flipping ? 'visible' : 'hidden',
          pointerEvents: 'none',
        }}
      >
        <div
          className={`absolute inset-x-0 bottom-0 h-[200%] flex items-center justify-center leading-none font-mono font-bold tracking-tight tabular-nums ${digitTextClass}`}
          style={{ color: theme.digitColor, textShadow: theme.digitShadow }}
        >
          {flipState.current}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-white/10 pointer-events-none" />
      </div>

      {/* Center Split Seam Line */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] bg-black/75 z-30 pointer-events-none"
      />
    </div>
  );
}

interface HolidayFlipClockProps {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  theme: HolidayVisualTheme;
  isFullscreen?: boolean;
}

export default function HolidayFlipClock({
  days,
  hours,
  minutes,
  seconds,
  theme,
  isFullscreen = false,
}: HolidayFlipClockProps) {
  const daysStr = String(days).padStart(2, '0');
  const hoursStr = String(hours).padStart(2, '0');
  const minutesStr = String(minutes).padStart(2, '0');
  const secondsStr = String(seconds).padStart(2, '0');

  const compactDigits = daysStr.length >= 4;

  const units = [
    { key: 'days', label: 'Days', chars: daysStr.split('') },
    { key: 'hours', label: 'Hours', chars: hoursStr.split('') },
    { key: 'minutes', label: 'Minutes', chars: minutesStr.split('') },
    { key: 'seconds', label: 'Seconds', chars: secondsStr.split('') },
  ];

  return (
    <div
      className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-5 py-2"
      role="timer"
      aria-live="off"
    >
      {units.map((unit, idx) => (
        <React.Fragment key={unit.key}>
          <div className="flex flex-col items-center gap-2.5">
            <div className="flex items-center gap-1 sm:gap-1.5">
              {unit.chars.map((ch, charIdx) => (
                <HolidaySplitFlapDigit
                  key={`${unit.key}-${charIdx}-${unit.chars.length}`}
                  digit={ch}
                  theme={theme}
                  compact={compactDigits}
                  isFullscreen={isFullscreen}
                />
              ))}
            </div>
            <span
              className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.18em]"
              style={{ color: theme.accentHex }}
            >
              {unit.label}
            </span>
          </div>

          {idx < units.length - 1 && (
            <div
              aria-hidden="true"
              className="hidden sm:flex flex-col items-center justify-center gap-2.5 pb-6 px-0.5"
            >
              <span
                className="w-2 h-2 rounded-full opacity-80"
                style={{ backgroundColor: theme.colonColor }}
              />
              <span
                className="w-2 h-2 rounded-full opacity-80"
                style={{ backgroundColor: theme.colonColor }}
              />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

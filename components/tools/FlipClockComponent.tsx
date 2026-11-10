'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Clock,
  Hourglass,
  Timer,
  Globe,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  RotateCcw,
  Settings,
  ChevronDown,
} from 'lucide-react';

export type FlipClockMode = 'live' | 'countdown' | 'stopwatch';
export type FlipClockTheme = 'dark' | 'light';

interface TimeZoneOption {
  id: string;
  label: string;
  timeZone: string;
}

const TIME_ZONE_OPTIONS: TimeZoneOption[] = [
  { id: 'local', label: 'Local Browser Time (Auto)', timeZone: 'local' },
  { id: 'Asia/Kolkata', label: '(GMT+05:30) India – New Delhi', timeZone: 'Asia/Kolkata' },
  { id: 'UTC', label: '(GMT+00:00) UTC – Coordinated Universal Time', timeZone: 'UTC' },
  { id: 'America/New_York', label: '(GMT-05:00) US – New York (ET)', timeZone: 'America/New_York' },
  { id: 'America/Chicago', label: '(GMT-06:00) US – Chicago (CT)', timeZone: 'America/Chicago' },
  { id: 'America/Los_Angeles', label: '(GMT-08:00) US – Los Angeles (PT)', timeZone: 'America/Los_Angeles' },
  { id: 'Europe/London', label: '(GMT+00:00) UK – London', timeZone: 'Europe/London' },
  { id: 'Europe/Paris', label: '(GMT+01:00) Europe – Paris / Berlin', timeZone: 'Europe/Paris' },
  { id: 'Asia/Dubai', label: '(GMT+04:00) UAE – Dubai', timeZone: 'Asia/Dubai' },
  { id: 'Asia/Singapore', label: '(GMT+08:00) Singapore', timeZone: 'Asia/Singapore' },
  { id: 'Asia/Tokyo', label: '(GMT+09:00) Japan – Tokyo', timeZone: 'Asia/Tokyo' },
  { id: 'Australia/Sydney', label: '(GMT+10:00) Australia – Sydney', timeZone: 'Australia/Sydney' },
];

const QUICK_PRESETS = [
  { label: '1 Minute', minutes: 1 },
  { label: '5 Minutes', minutes: 5 },
  { label: '10 Minutes', minutes: 10 },
  { label: '15 Minutes', minutes: 15 },
  { label: '25 Minutes', minutes: 25 },
  { label: '30 Minutes', minutes: 30 },
];

interface SplitFlapPairProps {
  value: string; // 2-digit string e.g. "10", "24", "36"
  theme: FlipClockTheme;
  badgeText?: string; // e.g. "AM" or "PM" on the hours card
  isFullscreen?: boolean;
}

/**
 * Renders a 2-digit mechanical split-flap bay (like "10", "24", "36")
 * with upper/lower halves, center hinge line, side notches, and smooth 3D flip transition.
 */
function SplitFlapPair({
  value,
  theme,
  badgeText,
  isFullscreen = false,
}: SplitFlapPairProps) {
  const [currentVal, setCurrentVal] = useState(value);
  const [prevVal, setPrevVal] = useState(value);
  const [flipKey, setFlipKey] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (value !== currentVal) {
      const startTimer = setTimeout(() => {
        setPrevVal(currentVal);
        setCurrentVal(value);
        setFlipKey((k) => k + 1);
        setIsFlipping(true);
      }, 0);
      const endTimer = setTimeout(() => {
        setIsFlipping(false);
      }, 420);
      return () => {
        clearTimeout(startTimer);
        clearTimeout(endTimer);
      };
    }
  }, [value, currentVal]);

  const isDark = theme === 'dark';

  const cardTopBg = isDark
    ? 'linear-gradient(180deg, #2B2B2E 0%, #1E1E21 100%)'
    : 'linear-gradient(180deg, #FAF6EE 0%, #E8DFCD 100%)';

  const cardBottomBg = isDark
    ? 'linear-gradient(180deg, #1A1A1D 0%, #242427 100%)'
    : 'linear-gradient(180deg, #DFD4BF 0%, #F4EDE0 100%)';

  const textColor = isDark ? '#F3F1EC' : '#18181A';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(62,42,20,0.22)';
  const hingeColor = isDark ? '#0B0B0D' : '#B5A892';

  const sizeClasses = isFullscreen
    ? 'w-[22vw] max-w-[230px] h-[26vw] max-h-[270px] min-w-[110px] min-h-[136px]'
    : 'w-[76px] h-[98px] sm:w-[104px] sm:h-[132px] md:w-[114px] md:h-[144px]';

  const fontSizeClasses = isFullscreen
    ? 'text-[11vw] sm:text-[108px] md:text-[142px]'
    : 'text-[44px] sm:text-[64px] md:text-[72px]';

  return (
    <div
      className={`relative select-none rounded-xl p-1 sm:p-1.5 ${
        isDark
          ? 'bg-[#0E0E10] shadow-[inset_0_3px_8px_rgba(0,0,0,0.9),0_2px_4px_rgba(255,255,255,0.05)]'
          : 'bg-[#C8BDA7] shadow-[inset_0_3px_7px_rgba(0,0,0,0.32),0_2px_4px_rgba(255,255,255,0.65)]'
      }`}
    >
      <div
        className={`relative ${sizeClasses} rounded-lg overflow-hidden`}
        style={{ perspective: '900px' }}
      >
        {/* STATIC TOP HALF (shows new currentVal) */}
        <div
          className="absolute inset-0 rounded-lg flex items-center justify-center"
          style={{
            background: cardTopBg,
            clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)',
            border: `1px solid ${borderColor}`,
          }}
        >
          <span
            className={`${fontSizeClasses} font-bold tracking-tight leading-none font-mono tabular-nums`}
            style={{ color: textColor }}
          >
            {currentVal}
          </span>
        </div>

        {/* STATIC BOTTOM HALF (shows prevVal while flipping, else currentVal) */}
        <div
          className="absolute inset-0 rounded-lg flex items-center justify-center"
          style={{
            background: cardBottomBg,
            clipPath: 'polygon(0 50%, 100% 50%, 100% 100%, 0 100%)',
            border: `1px solid ${borderColor}`,
          }}
        >
          <span
            className={`${fontSizeClasses} font-bold tracking-tight leading-none font-mono tabular-nums`}
            style={{ color: textColor }}
          >
            {isFlipping ? prevVal : currentVal}
          </span>
        </div>

        {/* ANIMATING TOP FLAP (flips down from 0deg to -90deg showing prevVal) */}
        {isFlipping && (
          <div
            key={`top-${flipKey}`}
            className="absolute inset-0 rounded-lg flex items-center justify-center z-20"
            style={{
              background: cardTopBg,
              clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)',
              border: `1px solid ${borderColor}`,
              transformOrigin: '50% 50%',
              animation: 'flipClockTopDown 0.21s ease-in forwards',
              backfaceVisibility: 'hidden',
            }}
          >
            <span
              className={`${fontSizeClasses} font-bold tracking-tight leading-none font-mono tabular-nums`}
              style={{ color: textColor }}
            >
              {prevVal}
            </span>
          </div>
        )}

        {/* ANIMATING BOTTOM FLAP (flips down from 90deg to 0deg showing currentVal) */}
        {isFlipping && (
          <div
            key={`bot-${flipKey}`}
            className="absolute inset-0 rounded-lg flex items-center justify-center z-20"
            style={{
              background: cardBottomBg,
              clipPath: 'polygon(0 50%, 100% 50%, 100% 100%, 0 100%)',
              border: `1px solid ${borderColor}`,
              transformOrigin: '50% 50%',
              transform: 'rotateX(90deg)',
              animation: 'flipClockBottomDown 0.21s 0.20s ease-out forwards',
              backfaceVisibility: 'hidden',
            }}
          >
            <span
              className={`${fontSizeClasses} font-bold tracking-tight leading-none font-mono tabular-nums`}
              style={{ color: textColor }}
            >
              {currentVal}
            </span>
          </div>
        )}

        {/* CENTER SPLIT-FLAP HINGE LINE & MECHANICAL SIDE PINS */}
        <div
          className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[3px] z-30 flex items-center justify-between"
          style={{
            backgroundColor: hingeColor,
            boxShadow: '0 1px 3px rgba(0,0,0,0.65)',
          }}
        >
          <span
            className={`w-1.5 h-3 rounded-r-xs ${
              isDark ? 'bg-[#09090B]' : 'bg-[#8E826E]'
            }`}
          />
          <span
            className={`w-1.5 h-3 rounded-l-xs ${
              isDark ? 'bg-[#09090B]' : 'bg-[#8E826E]'
            }`}
          />
        </div>

        {/* Center vertical subtle split line between the two digits inside the bay */}
        <div
          className="pointer-events-none absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] z-10"
          style={{
            backgroundColor: isDark
              ? 'rgba(0,0,0,0.45)'
              : 'rgba(0,0,0,0.12)',
          }}
        />

        {/* Optional AM / PM badge in bottom-left corner of Hours card */}
        {badgeText && (
          <div
            className={`absolute bottom-1.5 left-2 z-30 font-sans font-bold tracking-wider uppercase ${
              isFullscreen
                ? 'text-xs sm:text-sm md:text-base'
                : 'text-[10px] sm:text-xs'
            } ${isDark ? 'text-[#E5E2DC]' : 'text-[#2C2C2E]'}`}
          >
            {badgeText}
          </div>
        )}
      </div>
    </div>
  );
}

export default function FlipClockComponent() {
  const [mode, setMode] = useState<FlipClockMode>('live');
  const [use24Hour, setUse24Hour] = useState<boolean>(false); // 12-hour (AM/PM) default as in mockup
  const [selectedTimeZone, setSelectedTimeZone] = useState<string>('Asia/Kolkata');
  const [theme, setTheme] = useState<FlipClockTheme>('dark');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Live clock state
  const [liveTimeParts, setLiveTimeParts] = useState<{
    hh: string;
    mm: string;
    ss: string;
    ampm: string;
  }>({
    hh: '10',
    mm: '24',
    ss: '36',
    ampm: 'AM',
  });

  // Countdown state (default 25 minutes)
  const [countdownInputMin, setCountdownInputMin] = useState<number>(25);
  const [countdownInputSec, setCountdownInputSec] = useState<number>(0);
  const [countdownRemainingMs, setCountdownRemainingMs] = useState<number>(
    25 * 60 * 1000
  );
  const [isCountdownRunning, setIsCountdownRunning] = useState<boolean>(false);
  const [isCountdownCompleted, setIsCountdownCompleted] =
    useState<boolean>(false);
  const [showCustomCountdownInput, setShowCustomCountdownInput] =
    useState<boolean>(false);

  // Stopwatch state
  const [stopwatchElapsedMs, setStopwatchElapsedMs] = useState<number>(0);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState<boolean>(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const countdownTargetRef = useRef<number | null>(null);
  const stopwatchStartRef = useRef<number | null>(null);

  // Sound synthesis (subtle mechanical click or completion chime)
  const playTickSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioContextClass) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(55, ctx.currentTime + 0.025);
      gain.gain.setValueAtTime(0.035, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.025);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    } catch {
      // Ignore audio autoplay blocks before user interaction
    }
  }, [soundEnabled]);

  const playCompletionChime = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioContextClass) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        const startTime = ctx.currentTime + idx * 0.14;
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.12, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.55);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.6);
      });
    } catch {
      // Ignore audio errors
    }
  }, [soundEnabled]);

  // Live Clock accurate browser/timezone ticker
  useEffect(() => {
    const updateLiveClock = () => {
      const now = new Date();
      try {
        const tz =
          selectedTimeZone === 'local'
            ? Intl.DateTimeFormat().resolvedOptions().timeZone
            : selectedTimeZone;

        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: tz,
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });

        const parts = formatter.formatToParts(now);
        const rawHourStr =
          parts.find((p) => p.type === 'hour')?.value || '00';
        const mm = parts.find((p) => p.type === 'minute')?.value || '00';
        const ss = parts.find((p) => p.type === 'second')?.value || '00';

        let hourNum = parseInt(rawHourStr, 10);
        if (hourNum === 24) hourNum = 0;

        const ampm = hourNum >= 12 ? 'PM' : 'AM';
        let displayHour = hourNum;
        if (!use24Hour) {
          displayHour = hourNum % 12;
          if (displayHour === 0) displayHour = 12;
        }

        const hh = String(displayHour).padStart(2, '0');
        setLiveTimeParts((prev) => {
          if (prev.ss !== ss && mode === 'live') {
            // Optional soft mechanical tick when live clock second changes
          }
          return { hh, mm, ss, ampm };
        });
      } catch {
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayH = use24Hour ? hours : hours % 12 || 12;
        setLiveTimeParts({
          hh: String(displayH).padStart(2, '0'),
          mm: String(minutes).padStart(2, '0'),
          ss: String(seconds).padStart(2, '0'),
          ampm,
        });
      }
    };

    updateLiveClock();
    const interval = setInterval(updateLiveClock, 250);
    return () => clearInterval(interval);
  }, [selectedTimeZone, use24Hour, mode]);

  // Countdown accurate elapsed-time loop
  useEffect(() => {
    if (!isCountdownRunning) return;
    countdownTargetRef.current = Date.now() + countdownRemainingMs;

    const interval = setInterval(() => {
      if (!countdownTargetRef.current) return;
      const remaining = Math.max(0, countdownTargetRef.current - Date.now());
      setCountdownRemainingMs(remaining);
      if (remaining <= 0) {
        setIsCountdownRunning(false);
        setIsCountdownCompleted(true);
        playCompletionChime();
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isCountdownRunning, playCompletionChime]);

  // Stopwatch accurate elapsed-time loop
  useEffect(() => {
    if (!isStopwatchRunning) return;
    stopwatchStartRef.current = Date.now() - stopwatchElapsedMs;

    const interval = setInterval(() => {
      if (stopwatchStartRef.current === null) return;
      setStopwatchElapsedMs(Date.now() - stopwatchStartRef.current);
    }, 100);

    return () => clearInterval(interval);
  }, [isStopwatchRunning]);

  // Fullscreen listener + 'F' / 'Escape' keyboard shortcuts
  const toggleFullscreen = useCallback(async () => {
    const nextState = !isFullscreen;
    setIsFullscreen(nextState);

    if (nextState) {
      try {
        if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
      } catch {
        // Keep CSS .timer-fullscreen-stage active even if Fullscreen API is blocked or already active
      }
      try {
        const orientation = window.screen?.orientation as unknown as {
          lock?: (mode: string) => Promise<void>;
        };
        if (orientation?.lock && window.innerWidth <= 900) {
          await orientation.lock('landscape');
        }
      } catch {
        // CSS .timer-fullscreen-stage handles portrait rotation
      }
    } else {
      try {
        const orientation = window.screen?.orientation as unknown as {
          unlock?: () => void;
        };
        orientation?.unlock?.();
      } catch {
        // ignore
      }
      try {
        if (document.fullscreenElement && document.exitFullscreen) {
          await document.exitFullscreen();
        }
      } catch {
        // ignore
      }
    }
  }, [isFullscreen]);

  useEffect(() => {
    const onFsChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener('fullscreenchange', onFsChange);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('fullscreenchange', onFsChange);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [toggleFullscreen, isFullscreen]);

  // Compute displayed HH : MM : SS and nameplate label based on active mode
  const getDisplayDigits = () => {
    if (mode === 'live') {
      return {
        hh: liveTimeParts.hh,
        mm: liveTimeParts.mm,
        ss: liveTimeParts.ss,
        badge: !use24Hour ? liveTimeParts.ampm : undefined,
        label: 'LIVE CLOCK',
      };
    }

    if (mode === 'countdown') {
      const totalSeconds = Math.ceil(countdownRemainingMs / 1000);
      const hrs = Math.floor(totalSeconds / 3600);
      const mins = Math.floor((totalSeconds % 3600) / 60);
      const secs = totalSeconds % 60;
      return {
        hh: String(hrs).padStart(2, '0'),
        mm: String(mins).padStart(2, '0'),
        ss: String(secs).padStart(2, '0'),
        badge: undefined,
        label: isCountdownCompleted ? 'TIME IS UP!' : 'COUNTDOWN',
      };
    }

    // Stopwatch mode
    const totalSeconds = Math.floor(stopwatchElapsedMs / 1000);
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return {
      hh: String(hrs).padStart(2, '0'),
      mm: String(mins).padStart(2, '0'),
      ss: String(secs).padStart(2, '0'),
      badge: undefined,
      label: 'STOPWATCH',
    };
  };

  const display = getDisplayDigits();

  // Trigger subtle tick when second changes in active countdown/stopwatch
  const prevSecondRef = useRef(display.ss);
  useEffect(() => {
    if (prevSecondRef.current !== display.ss) {
      prevSecondRef.current = display.ss;
      if (
        (mode === 'countdown' && isCountdownRunning) ||
        (mode === 'stopwatch' && isStopwatchRunning)
      ) {
        playTickSound();
      }
    }
  }, [
    display.ss,
    mode,
    isCountdownRunning,
    isStopwatchRunning,
    playTickSound,
  ]);

  // Preset handler
  const handleSelectPreset = (minutes: number) => {
    setMode('countdown');
    setIsCountdownRunning(false);
    setIsCountdownCompleted(false);
    setCountdownInputMin(minutes);
    setCountdownInputSec(0);
    setCountdownRemainingMs(minutes * 60 * 1000);
    setIsCountdownRunning(true);
  };

  const handleApplyCustomCountdown = (mins: number, secs: number) => {
    const safeM = Math.max(0, Math.min(599, mins));
    const safeS = Math.max(0, Math.min(59, secs));
    setCountdownInputMin(safeM);
    setCountdownInputSec(safeS);
    setIsCountdownRunning(false);
    setIsCountdownCompleted(false);
    setCountdownRemainingMs((safeM * 60 + safeS) * 1000);
  };

  const isDark = theme === 'dark';

  return (
    <div className="space-y-7">
      <style>{`
        @keyframes flipClockTopDown {
          0% { transform: rotateX(0deg); }
          100% { transform: rotateX(-90deg); }
        }
        @keyframes flipClockBottomDown {
          0% { transform: rotateX(90deg); }
          100% { transform: rotateX(0deg); }
        }
      `}</style>

      {/* MAIN INTERACTIVE TOOL CARD */}
      <div className="bg-white dark:bg-[#161C19] rounded-3xl border border-[#EAE4D9] dark:border-[#28322C] shadow-sm p-4 sm:p-6 transition-colors">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* LEFT VISUAL STAGE: Realistic Retro Mechanical Split-Flap Clock */}
          <div
            ref={stageRef}
            className={`lg:col-span-7 relative rounded-2xl overflow-hidden flex flex-col items-center justify-center p-3 sm:p-6 min-h-[320px] sm:min-h-[370px] border select-none transition-colors ${
              isFullscreen ? 'timer-fullscreen-stage' : ''
            } ${
              isDark
                ? 'bg-[#17120E] dark:bg-[#111513] border-[#2E261E] dark:border-[#28322C]'
                : 'bg-[#E6DAC6] dark:bg-[#1A211D] border-[#CBBBA0] dark:border-[#2E3A33]'
            }`}
          >
            {/* Subtle ambient studio vignette & desk shelf */}
            {!isFullscreen && (
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div
                  className="absolute inset-x-0 bottom-0 h-20 opacity-90 dark:opacity-55"
                  style={{
                    background: isDark
                      ? 'linear-gradient(180deg, rgba(45,28,14,0) 0%, rgba(58,34,16,0.75) 45%, #2B180A 100%)'
                      : 'linear-gradient(180deg, rgba(132,94,56,0) 0%, rgba(120,84,48,0.45) 45%, #7C5530 100%)',
                  }}
                />
              </div>
            )}

            {/* Fullscreen quick exit button */}
            {isFullscreen && (
              <button
                type="button"
                onClick={toggleFullscreen}
                className="absolute top-6 right-6 z-40 flex items-center gap-2 px-4 py-2 rounded-xl bg-black/75 text-white text-xs font-semibold hover:bg-black/90 border border-white/15 shadow-lg transition-colors cursor-pointer"
              >
                <Minimize2 className="w-4 h-4" />
                <span>Exit Fullscreen (F)</span>
              </button>
            )}

            {/* 3D RETRO SPLIT-FLAP DESK CLOCK ASSEMBLY */}
            <div className="relative z-10 flex flex-col items-center max-w-full">
              {/* Main Clock Casing */}
              <div className="relative flex items-center max-w-full">
                {/* Left mechanical rotary side knob */}
                <div
                  className={`w-2 sm:w-3 h-9 sm:h-12 rounded-l-md border-y border-l shrink-0 ${
                    isDark
                      ? 'bg-gradient-to-b from-[#52473D] via-[#9E8C7A] to-[#2C2520] border-[#6E6053]'
                      : 'bg-gradient-to-b from-[#B8A68A] via-[#E5D9C3] to-[#7D6D56] border-[#9E8D74]'
                  } shadow-md`}
                />

                {/* Outer metallic/bakelite clock frame */}
                <div
                  className={`relative rounded-[22px] sm:rounded-[28px] p-2.5 sm:p-4 border-2 transition-colors ${
                    isDark
                      ? 'bg-gradient-to-b from-[#2A2A2D] via-[#1B1B1E] to-[#111113] border-[#3B3B40] shadow-[0_20px_42px_rgba(0,0,0,0.75),inset_0_2px_3px_rgba(255,255,255,0.14)]'
                      : 'bg-gradient-to-b from-[#F4EFE4] via-[#E5DAC5] to-[#CFC0A6] border-[#B2A287] shadow-[0_20px_40px_rgba(30,20,10,0.42),inset_0_2px_4px_rgba(255,255,255,0.85)]'
                  }`}
                >
                  {/* Inner recessed bevel frame */}
                  <div
                    className={`rounded-[16px] sm:rounded-[20px] p-2 sm:p-3 flex items-center gap-1.5 sm:gap-2.5 border ${
                      isDark
                        ? 'bg-[#141416] border-[#29292D] shadow-[inset_0_4px_12px_rgba(0,0,0,0.85)]'
                        : 'bg-[#D6C9B1] border-[#B3A388] shadow-[inset_0_4px_10px_rgba(0,0,0,0.22)]'
                    }`}
                  >
                    {/* HOURS FLAP PAIR */}
                    <SplitFlapPair
                      value={display.hh}
                      theme={theme}
                      badgeText={display.badge}
                      isFullscreen={isFullscreen}
                    />

                    {/* COLON SEPARATOR 1 */}
                    <div className="flex flex-col items-center justify-center gap-2.5 sm:gap-3.5 px-0.5">
                      <span
                        className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                          isDark
                            ? 'bg-[#DCD8D0] shadow-[0_0_6px_rgba(255,255,255,0.35)]'
                            : 'bg-[#2E2A25]'
                        }`}
                      />
                      <span
                        className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                          isDark
                            ? 'bg-[#DCD8D0] shadow-[0_0_6px_rgba(255,255,255,0.35)]'
                            : 'bg-[#2E2A25]'
                        }`}
                      />
                    </div>

                    {/* MINUTES FLAP PAIR */}
                    <SplitFlapPair
                      value={display.mm}
                      theme={theme}
                      isFullscreen={isFullscreen}
                    />

                    {/* COLON SEPARATOR 2 */}
                    <div className="flex flex-col items-center justify-center gap-2.5 sm:gap-3.5 px-0.5">
                      <span
                        className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                          isDark
                            ? 'bg-[#DCD8D0] shadow-[0_0_6px_rgba(255,255,255,0.35)]'
                            : 'bg-[#2E2A25]'
                        }`}
                      />
                      <span
                        className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                          isDark
                            ? 'bg-[#DCD8D0] shadow-[0_0_6px_rgba(255,255,255,0.35)]'
                            : 'bg-[#2E2A25]'
                        }`}
                      />
                    </div>

                    {/* SECONDS FLAP PAIR */}
                    <SplitFlapPair
                      value={display.ss}
                      theme={theme}
                      isFullscreen={isFullscreen}
                    />
                  </div>
                </div>

                {/* Right mechanical rotary side knob */}
                <div
                  className={`w-2 sm:w-3 h-9 sm:h-12 rounded-r-md border-y border-r shrink-0 ${
                    isDark
                      ? 'bg-gradient-to-b from-[#52473D] via-[#9E8C7A] to-[#2C2520] border-[#6E6053]'
                      : 'bg-gradient-to-b from-[#B8A68A] via-[#E5D9C3] to-[#7D6D56] border-[#9E8D74]'
                  } shadow-md`}
                />
              </div>

              {/* Clock Pedestal Feet & Brass Nameplate ("LIVE CLOCK" / "COUNTDOWN" / "STOPWATCH") */}
              <div className="relative w-full flex flex-col items-center -mt-0.5">
                {/* Left & Right metallic support legs */}
                <div className="w-[74%] flex items-center justify-between px-6">
                  <div className="w-3.5 h-4 bg-gradient-to-b from-[#3A322B] to-[#1C1814] rounded-b-sm shadow-md" />
                  <div className="w-3.5 h-4 bg-gradient-to-b from-[#3A322B] to-[#1C1814] rounded-b-sm shadow-md" />
                </div>

                {/* Brass-trimmed Mode Nameplate */}
                <div className="-mt-2 px-7 py-1.5 rounded-md bg-gradient-to-b from-[#2B241D] to-[#17130F] border-2 border-[#9A7B4F] shadow-[0_8px_18px_rgba(0,0,0,0.65)]">
                  <span className="text-xs sm:text-sm font-bold tracking-[0.18em] uppercase text-[#F4EFE6] font-sans">
                    {display.label}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT CONTROLS PANEL */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-5 py-1">
            <div className="space-y-5">
              {/* 1. Primary Mode Tabs: Live Clock | Countdown | Stopwatch */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setMode('live')}
                  className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer border ${
                    mode === 'live'
                      ? 'bg-[#156B2C] text-white border-[#156B2C] shadow-xs'
                      : 'bg-[#F5F3EE] dark:bg-[#1F2823] text-[#1F2937] dark:text-slate-200 border-[#E5E0D5] dark:border-[#2E3B33] hover:bg-[#EBE7DF] dark:hover:bg-[#27332C]'
                  }`}
                >
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>Live Clock</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMode('countdown')}
                  className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer border ${
                    mode === 'countdown'
                      ? 'bg-[#156B2C] text-white border-[#156B2C] shadow-xs'
                      : 'bg-[#F5F3EE] dark:bg-[#1F2823] text-[#1F2937] dark:text-slate-200 border-[#E5E0D5] dark:border-[#2E3B33] hover:bg-[#EBE7DF] dark:hover:bg-[#27332C]'
                  }`}
                >
                  <Hourglass className="w-4 h-4 shrink-0" />
                  <span>Countdown</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMode('stopwatch')}
                  className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer border ${
                    mode === 'stopwatch'
                      ? 'bg-[#156B2C] text-white border-[#156B2C] shadow-xs'
                      : 'bg-[#F5F3EE] dark:bg-[#1F2823] text-[#1F2937] dark:text-slate-200 border-[#E5E0D5] dark:border-[#2E3B33] hover:bg-[#EBE7DF] dark:hover:bg-[#27332C]'
                  }`}
                >
                  <Timer className="w-4 h-4 shrink-0" />
                  <span>Stopwatch</span>
                </button>
              </div>

              {/* 2. Time Format & Time Zone Row */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                {/* Time Format */}
                <div className="sm:col-span-6">
                  <label className="block text-xs font-bold text-[#1F2937] dark:text-slate-200 mb-2">
                    Time Format
                  </label>
                  <div className="grid grid-cols-2 bg-[#F5F3EE] dark:bg-[#1F2823] p-1 rounded-xl border border-[#E5E0D5] dark:border-[#2E3B33]">
                    <button
                      type="button"
                      onClick={() => setUse24Hour(false)}
                      className={`py-2 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        !use24Hour
                          ? 'bg-[#156B2C] text-white shadow-xs'
                          : 'text-[#374151] dark:text-slate-300 hover:text-[#111827] dark:hover:text-white'
                      }`}
                    >
                      12-hour (AM/PM)
                    </button>
                    <button
                      type="button"
                      onClick={() => setUse24Hour(true)}
                      className={`py-2 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        use24Hour
                          ? 'bg-[#156B2C] text-white shadow-xs'
                          : 'text-[#374151] dark:text-slate-300 hover:text-[#111827] dark:hover:text-white'
                      }`}
                    >
                      24-hour
                    </button>
                  </div>
                </div>

                {/* Time Zone */}
                <div className="sm:col-span-6">
                  <label
                    htmlFor="flip-clock-tz"
                    className="block text-xs font-bold text-[#1F2937] dark:text-slate-200 mb-2"
                  >
                    Time Zone
                  </label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-[#1F2937] dark:text-slate-300 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      id="flip-clock-tz"
                      value={selectedTimeZone}
                      onChange={(e) => {
                        setSelectedTimeZone(e.target.value);
                        if (mode !== 'live') setMode('live');
                      }}
                      className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-white dark:bg-[#1F2823] border border-[#DCD6C8] dark:border-[#2E3B33] text-xs font-semibold text-[#1F2937] dark:text-slate-100 appearance-none focus:outline-none focus:border-[#156B2C] dark:focus:border-[#6CC49B] cursor-pointer truncate"
                    >
                      {TIME_ZONE_OPTIONS.map((tz) => (
                        <option key={tz.id} value={tz.timeZone}>
                          {tz.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-500 dark:text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* 3. Interactive Countdown / Stopwatch Controls Bar */}
              {(mode === 'countdown' ||
                mode === 'stopwatch' ||
                showCustomCountdownInput) && (
                <div className="bg-[#F8F6F1] dark:bg-[#1C2420] rounded-2xl p-3.5 border border-[#E5DEC9] dark:border-[#2E3B33] space-y-3">
                  {mode === 'countdown' || showCustomCountdownInput ? (
                    <>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-bold text-[#0D2137] dark:text-slate-100">
                          Countdown Controls
                        </span>
                        <div className="flex items-center gap-2">
                          <label className="text-[11px] font-semibold text-gray-600 dark:text-slate-300">
                            Min:
                          </label>
                          <input
                            type="number"
                            min={0}
                            max={599}
                            value={countdownInputMin}
                            onChange={(e) =>
                              handleApplyCustomCountdown(
                                Number(e.target.value),
                                countdownInputSec
                              )
                            }
                            className="w-16 px-2 py-1 rounded-lg bg-white dark:bg-[#121815] border border-[#D5CEBE] dark:border-[#334239] text-xs font-bold text-center text-[#0D2137] dark:text-white"
                          />
                          <label className="text-[11px] font-semibold text-gray-600 dark:text-slate-300">
                            Sec:
                          </label>
                          <input
                            type="number"
                            min={0}
                            max={59}
                            value={countdownInputSec}
                            onChange={(e) =>
                              handleApplyCustomCountdown(
                                countdownInputMin,
                                Number(e.target.value)
                              )
                            }
                            className="w-14 px-2 py-1 rounded-lg bg-white dark:bg-[#121815] border border-[#D5CEBE] dark:border-[#334239] text-xs font-bold text-center text-[#0D2137] dark:text-white"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setMode('countdown');
                            if (countdownRemainingMs <= 0) {
                              const freshMs =
                                (countdownInputMin * 60 + countdownInputSec) *
                                1000;
                              setCountdownRemainingMs(freshMs);
                              countdownTargetRef.current = Date.now() + freshMs;
                            } else {
                              countdownTargetRef.current =
                                Date.now() + countdownRemainingMs;
                            }
                            setIsCountdownCompleted(false);
                            setIsCountdownRunning(true);
                          }}
                          disabled={isCountdownRunning}
                          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#156B2C] text-white text-xs font-bold hover:bg-[#115723] disabled:opacity-50 cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Start</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsCountdownRunning(false)}
                          disabled={!isCountdownRunning}
                          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white dark:bg-[#242F29] border border-[#D5CEBE] dark:border-[#35443C] text-[#1F2937] dark:text-slate-100 text-xs font-bold hover:bg-gray-50 dark:hover:bg-[#2C3932] disabled:opacity-50 cursor-pointer"
                        >
                          <Pause className="w-3.5 h-3.5" />
                          <span>Pause</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsCountdownRunning(false);
                            setIsCountdownCompleted(false);
                            setCountdownRemainingMs(
                              (countdownInputMin * 60 + countdownInputSec) *
                                1000
                            );
                          }}
                          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white dark:bg-[#242F29] border border-[#D5CEBE] dark:border-[#35443C] text-[#1F2937] dark:text-slate-100 text-xs font-bold hover:bg-gray-50 dark:hover:bg-[#2C3932] cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Reset</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#0D2137] dark:text-slate-100">
                          Stopwatch Controls
                        </span>
                        <span className="text-[11px] font-medium text-gray-500 dark:text-slate-400">
                          Elapsed Split-Flap Timer
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setIsStopwatchRunning(true)}
                          disabled={isStopwatchRunning}
                          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#156B2C] text-white text-xs font-bold hover:bg-[#115723] disabled:opacity-50 cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Start</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsStopwatchRunning(false)}
                          disabled={!isStopwatchRunning}
                          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white dark:bg-[#242F29] border border-[#D5CEBE] dark:border-[#35443C] text-[#1F2937] dark:text-slate-100 text-xs font-bold hover:bg-gray-50 dark:hover:bg-[#2C3932] disabled:opacity-50 cursor-pointer"
                        >
                          <Pause className="w-3.5 h-3.5" />
                          <span>Pause</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsStopwatchRunning(false);
                            setStopwatchElapsedMs(0);
                          }}
                          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white dark:bg-[#242F29] border border-[#D5CEBE] dark:border-[#35443C] text-[#1F2937] dark:text-slate-100 text-xs font-bold hover:bg-gray-50 dark:hover:bg-[#2C3932] cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Reset</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* 4. Display Theme Cards & Sound/Fullscreen Toggles */}
              <div>
                <label className="block text-xs font-bold text-[#1F2937] dark:text-slate-200 mb-2.5">
                  Display Theme
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  {/* 2 Theme Preview Cards */}
                  <div className="sm:col-span-8 grid grid-cols-2 gap-3">
                    {/* Dark (Classic) Card */}
                    <button
                      type="button"
                      onClick={() => setTheme('dark')}
                      className={`group rounded-2xl p-2.5 border-2 transition-all text-center cursor-pointer ${
                        theme === 'dark'
                          ? 'bg-[#EEF6F0] dark:bg-[#1D3125] border-[#156B2C] dark:border-[#4ADE80] shadow-xs'
                          : 'bg-[#FAF8F4] dark:bg-[#1F2823] border-[#E5E0D5] dark:border-[#2E3B33] hover:border-[#C7BFA8] dark:hover:border-[#45574C]'
                      }`}
                    >
                      <div className="h-14 rounded-xl bg-[#18181B] border border-[#323236] flex items-center justify-center gap-1 px-2 mb-2 shadow-inner">
                        <span className="px-2 py-1 rounded bg-[#27272A] text-white font-mono font-bold text-lg tracking-wider border border-white/10">
                          10
                        </span>
                        <span className="text-white/70 font-bold">:</span>
                        <span className="px-2 py-1 rounded bg-[#27272A] text-white font-mono font-bold text-lg tracking-wider border border-white/10">
                          24
                        </span>
                      </div>
                      <span className="text-xs font-bold text-[#1F2937] dark:text-slate-100">
                        Dark (Classic)
                      </span>
                    </button>

                    {/* Light (Retro) Card */}
                    <button
                      type="button"
                      onClick={() => setTheme('light')}
                      className={`group rounded-2xl p-2.5 border-2 transition-all text-center cursor-pointer ${
                        theme === 'light'
                          ? 'bg-[#EEF6F0] dark:bg-[#1D3125] border-[#156B2C] dark:border-[#4ADE80] shadow-xs'
                          : 'bg-[#FAF8F4] dark:bg-[#1F2823] border-[#E5E0D5] dark:border-[#2E3B33] hover:border-[#C7BFA8] dark:hover:border-[#45574C]'
                      }`}
                    >
                      <div className="h-14 rounded-xl bg-[#EDE6D6] border border-[#D4C9B0] flex items-center justify-center gap-1 px-2 mb-2 shadow-inner">
                        <span className="px-2 py-1 rounded bg-[#FAF6EE] text-[#1E1E20] font-mono font-bold text-lg tracking-wider border border-black/15">
                          10
                        </span>
                        <span className="text-[#1E1E20]/70 font-bold">:</span>
                        <span className="px-2 py-1 rounded bg-[#FAF6EE] text-[#1E1E20] font-mono font-bold text-lg tracking-wider border border-black/15">
                          24
                        </span>
                      </div>
                      <span className="text-xs font-bold text-[#1F2937] dark:text-slate-100">
                        Light (Retro)
                      </span>
                    </button>
                  </div>

                  {/* Sound & Fullscreen Toggles */}
                  <div className="sm:col-span-4 space-y-3.5 pl-0 sm:pl-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#1F2937] dark:text-slate-200">
                        Sound
                      </span>
                      <div className="flex items-center gap-2">
                        {soundEnabled ? (
                          <Volume2 className="w-4 h-4 text-[#156B2C] dark:text-[#6CC49B]" />
                        ) : (
                          <VolumeX className="w-4 h-4 text-gray-400 dark:text-slate-500" />
                        )}
                        <button
                          type="button"
                          role="switch"
                          aria-checked={soundEnabled}
                          onClick={() => setSoundEnabled((prev) => !prev)}
                          className={`w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer ${
                            soundEnabled ? 'bg-[#156B2C]' : 'bg-gray-300 dark:bg-[#334139]'
                          }`}
                        >
                          <span
                            className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                              soundEnabled ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={toggleFullscreen}
                        className="flex items-center gap-1.5 text-xs font-bold text-[#1F2937] dark:text-slate-200 hover:text-[#156B2C] dark:hover:text-[#6CC49B] cursor-pointer"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>Fullscreen</span>
                      </button>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={isFullscreen}
                        onClick={toggleFullscreen}
                        className={`w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer ${
                          isFullscreen ? 'bg-[#156B2C]' : 'bg-gray-300 dark:bg-[#334139]'
                        }`}
                      >
                        <span
                          className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                            isFullscreen ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODE OVERVIEW SECTION */}
      <section>
        <h2 className="text-xl font-bold font-serif text-[#0D2137] dark:text-[#F3F5F4] mb-0.5">
          Mode Overview
        </h2>
        <p className="text-xs text-gray-600 dark:text-slate-400 mb-3.5">
          Choose a mode and use the flip clock your way.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => setMode('live')}
            className={`text-left rounded-2xl p-4 border transition-all flex items-start gap-3.5 cursor-pointer ${
              mode === 'live'
                ? 'bg-[#E6F3E8] dark:bg-[#1C3024] border-[#7FB88B] dark:border-[#458B59] shadow-xs'
                : 'bg-white dark:bg-[#161C19] border-[#EAE4D9] dark:border-[#28322C] hover:border-[#C8C0B0] dark:hover:border-[#3D4D43]'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-[#F2F7F3] dark:bg-[#213529] text-[#156B2C] dark:text-[#6CC49B] flex items-center justify-center shrink-0 mt-0.5 border border-[#C6E2CC] dark:border-[#31523E]">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#0D2137] dark:text-[#F3F5F4] mb-0.5">
                Live Clock
              </div>
              <div className="text-xs text-[#374151] dark:text-slate-300 leading-relaxed">
                Show the current time in a real split-flap display.
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setMode('countdown')}
            className={`text-left rounded-2xl p-4 border transition-all flex items-start gap-3.5 cursor-pointer ${
              mode === 'countdown'
                ? 'bg-[#E6F3E8] dark:bg-[#1C3024] border-[#7FB88B] dark:border-[#458B59] shadow-xs'
                : 'bg-white dark:bg-[#161C19] border-[#EAE4D9] dark:border-[#28322C] hover:border-[#C8C0B0] dark:hover:border-[#3D4D43]'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-[#F2F7F3] dark:bg-[#213529] text-[#156B2C] dark:text-[#6CC49B] flex items-center justify-center shrink-0 mt-0.5 border border-[#D8E8DC] dark:border-[#31523E]">
              <Hourglass className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#0D2137] dark:text-[#F3F5F4] mb-0.5">
                Countdown Mode
              </div>
              <div className="text-xs text-[#374151] dark:text-slate-300 leading-relaxed">
                Count down from a set time with a flipping display.
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setMode('stopwatch')}
            className={`text-left rounded-2xl p-4 border transition-all flex items-start gap-3.5 cursor-pointer ${
              mode === 'stopwatch'
                ? 'bg-[#E6F3E8] dark:bg-[#1C3024] border-[#7FB88B] dark:border-[#458B59] shadow-xs'
                : 'bg-white dark:bg-[#161C19] border-[#EAE4D9] dark:border-[#28322C] hover:border-[#C8C0B0] dark:hover:border-[#3D4D43]'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-[#F2F7F3] dark:bg-[#213529] text-[#156B2C] dark:text-[#6CC49B] flex items-center justify-center shrink-0 mt-0.5 border border-[#D8E8DC] dark:border-[#31523E]">
              <Timer className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#0D2137] dark:text-[#F3F5F4] mb-0.5">
                Stopwatch Mode
              </div>
              <div className="text-xs text-[#374151] dark:text-slate-300 leading-relaxed">
                Measure elapsed time with a retro flip clock.
              </div>
            </div>
          </button>
        </div>
      </section>

      {/* QUICK TIMER PRESETS (COUNTDOWN MODE) */}
      <section>
        <h2 className="text-lg font-bold font-serif text-[#0D2137] dark:text-[#F3F5F4] mb-0.5">
          Quick Timer Presets (Countdown Mode)
        </h2>
        <p className="text-xs text-gray-600 dark:text-slate-400 mb-3.5">
          Start a <strong className="font-semibold text-[#0D2137] dark:text-white">countdown</strong> with a single click.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {QUICK_PRESETS.map((preset) => {
            const isSelected =
              mode === 'countdown' &&
              countdownInputMin === preset.minutes &&
              countdownInputSec === 0 &&
              !showCustomCountdownInput;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  setShowCustomCountdownInput(false);
                  handleSelectPreset(preset.minutes);
                }}
                className={`py-3 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#E6F3E8] dark:bg-[#1D3326] border-[#156B2C] dark:border-[#52B778] text-[#156B2C] dark:text-[#6CC49B] shadow-xs'
                    : 'bg-white dark:bg-[#161C19] border-[#EAE4D9] dark:border-[#28322C] text-[#0D2137] dark:text-slate-200 hover:border-[#156B2C]/50 dark:hover:border-[#6CC49B]/50'
                }`}
              >
                {preset.label}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => {
              setMode('countdown');
              setShowCustomCountdownInput(true);
            }}
            className="py-3 px-3 rounded-xl text-xs font-bold border bg-[#E6F3E8] dark:bg-[#1C3024] border-[#7FB88B] dark:border-[#3D6B4B] text-[#0D2137] dark:text-[#F3F5F4] hover:bg-[#D8EDE0] dark:hover:bg-[#243D2E] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Settings className="w-4 h-4 text-[#156B2C] dark:text-[#6CC49B]" />
            <span>Custom Time</span>
          </button>
        </div>
      </section>
    </div>
  );
}

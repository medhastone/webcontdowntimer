'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Bell,
  Maximize2,
  Minimize2,
  Eye,
  Settings,
  BookOpen,
  GraduationCap,
  Laptop,
  Coffee,
  PenTool,
  Sprout,
  Bookmark,
  Check,
  X,
  ChevronUp,
  ChevronDown,
  Timer,
} from 'lucide-react';
import { playTimerSound } from '@/lib/sound';
import { requestWakeLock, releaseWakeLock } from '@/lib/wakelock';

type ThemeStyleId =
  | 'minimal-ivory'
  | 'warm-sunset'
  | 'forest-green'
  | 'soft-pastel'
  | 'dark-academia'
  | 'monochrome'
  | 'paper-texture'
  | 'coastal-blue';

type AccentId = 'forest' | 'sunset' | 'rose' | 'lavender' | 'ocean' | 'slate' | 'taupe';
type ModeTab = 'duration' | 'endTime';

interface ThemeConfig {
  id: ThemeStyleId;
  label: string;
  defaultAccent: AccentId;
  dialFill: string;
  trackColor: string;
  textColor: string;
  subTextColor: string;
  quoteColor: string;
  quoteText: string;
  isAnalog?: boolean;
}

const THEME_CONFIGS: Record<ThemeStyleId, ThemeConfig> = {
  'minimal-ivory': {
    id: 'minimal-ivory',
    label: 'Minimal Ivory',
    defaultAccent: 'sunset',
    dialFill: 'rgba(251, 247, 239, 0.94)',
    trackColor: '#EFE6D5',
    textColor: '#1B221E',
    subTextColor: '#4A524D',
    quoteColor: '#3A322B',
    quoteText: '“Simplicity brings clarity to every quiet hour.”',
  },
  'warm-sunset': {
    id: 'warm-sunset',
    label: 'Warm Sunset',
    defaultAccent: 'sunset',
    dialFill: 'rgba(250, 243, 232, 0.92)',
    trackColor: '#EFE3D1',
    textColor: '#181E1B',
    subTextColor: '#37403B',
    quoteColor: '#FAF3E8',
    quoteText: '“A calm mind creates a focused day.”',
  },
  'forest-green': {
    id: 'forest-green',
    label: 'Forest Green',
    defaultAccent: 'forest',
    dialFill: 'rgba(244, 247, 242, 0.93)',
    trackColor: '#DCE5D8',
    textColor: '#16241C',
    subTextColor: '#384B3F',
    quoteColor: '#ECF2EA',
    quoteText: '“Steady growth happens one quiet session at a time.”',
  },
  'soft-pastel': {
    id: 'soft-pastel',
    label: 'Soft Pastel',
    defaultAccent: 'rose',
    dialFill: 'rgba(254, 248, 249, 0.93)',
    trackColor: '#F5E1E5',
    textColor: '#2B1E23',
    subTextColor: '#5C474E',
    quoteColor: '#4A333B',
    quoteText: '“Gentle focus makes learning feel effortless.”',
  },
  'dark-academia': {
    id: 'dark-academia',
    label: 'Dark Academia',
    defaultAccent: 'taupe',
    dialFill: 'rgba(34, 28, 22, 0.94)',
    trackColor: '#3D3226',
    textColor: '#F5E8D3',
    subTextColor: '#CBB596',
    quoteColor: '#E8D5B9',
    quoteText: '“Deep study turns fleeting minutes into lasting wisdom.”',
    isAnalog: true,
  },
  monochrome: {
    id: 'monochrome',
    label: 'Monochrome',
    defaultAccent: 'slate',
    dialFill: 'rgba(250, 250, 250, 0.95)',
    trackColor: '#E2E4E7',
    textColor: '#14171A',
    subTextColor: '#4B5563',
    quoteColor: '#272B30',
    quoteText: '“Remove the noise and keep only what matters.”',
  },
  'paper-texture': {
    id: 'paper-texture',
    label: 'Paper Texture',
    defaultAccent: 'taupe',
    dialFill: 'rgba(248, 241, 229, 0.93)',
    trackColor: '#E5D6BE',
    textColor: '#2C2219',
    subTextColor: '#594838',
    quoteColor: '#3A2C20',
    quoteText: '“Every blank page begins with a single focused moment.”',
  },
  'coastal-blue': {
    id: 'coastal-blue',
    label: 'Coastal Blue',
    defaultAccent: 'ocean',
    dialFill: 'rgba(246, 250, 253, 0.92)',
    trackColor: '#DCE8F2',
    textColor: '#162533',
    subTextColor: '#3D556B',
    quoteColor: '#F4F9FC',
    quoteText: '“Breathe in the calm horizon and work at your own tide.”',
  },
};

const ACCENT_SWATCHES: { id: AccentId; label: string; hex: string }[] = [
  { id: 'forest', label: 'Forest Green', hex: '#1F4E3B' },
  { id: 'sunset', label: 'Warm Sunset Peach', hex: '#F39C6B' },
  { id: 'rose', label: 'Soft Pastel Rose', hex: '#F28E9B' },
  { id: 'lavender', label: 'Muted Lavender', hex: '#9D6BFF' },
  { id: 'ocean', label: 'Coastal Blue', hex: '#4B8FE2' },
  { id: 'slate', label: 'Slate Navy', hex: '#5D6D87' },
  { id: 'taupe', label: 'Warm Taupe', hex: '#7C6A5B' },
];

const STORAGE_KEY = 'timetools_aesthetic_timer_style_v1';

export default function AestheticTimerComponent() {
  const [modeTab, setModeTab] = useState<ModeTab>('duration');
  const [durationMinutes, setDurationMinutes] = useState<number>(25);
  const [endTimeStr, setEndTimeStr] = useState<string>('17:00');
  const [totalMs, setTotalMs] = useState<number>(25 * 60 * 1000);
  const [remainingMs, setRemainingMs] = useState<number>(25 * 60 * 1000);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Aesthetic customization states matching reference image
  const [themeStyle, setThemeStyle] = useState<ThemeStyleId>('warm-sunset');
  const [accentId, setAccentId] = useState<AccentId>('sunset');
  const [sessionLabel, setSessionLabel] = useState<string>('Study Session');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showTime, setShowTime] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [savedNotice, setSavedNotice] = useState<boolean>(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const customInputRef = useRef<HTMLInputElement>(null);
  const endTimeRef = useRef<number | null>(null);
  const remainingMsRef = useRef<number>(25 * 60 * 1000);
  const rafRef = useRef<number | null>(null);

  // Load saved style from localStorage on client mount
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (parsed.themeStyle && THEME_CONFIGS[parsed.themeStyle as ThemeStyleId]) {
          setThemeStyle(parsed.themeStyle);
        }
        if (parsed.accentId && ACCENT_SWATCHES.some((a) => a.id === parsed.accentId)) {
          setAccentId(parsed.accentId);
        }
        if (typeof parsed.durationMinutes === 'number' && parsed.durationMinutes >= 1) {
          const mins = Math.min(999, parsed.durationMinutes);
          setDurationMinutes(mins);
          setTotalMs(mins * 60 * 1000);
          setRemainingMs(mins * 60 * 1000);
          remainingMsRef.current = mins * 60 * 1000;
        }
        if (typeof parsed.sessionLabel === 'string') {
          setSessionLabel(parsed.sessionLabel);
        }
        if (typeof parsed.soundEnabled === 'boolean') {
          setSoundEnabled(parsed.soundEnabled);
        }
        if (typeof parsed.showTime === 'boolean') {
          setShowTime(parsed.showTime);
        }
      } catch {
        // ignore storage errors
      }
    });
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    remainingMsRef.current = remainingMs;
  }, [remainingMs]);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // High-precision countdown loop
  useEffect(() => {
    if (!isRunning) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      releaseWakeLock();
      return;
    }

    requestWakeLock();
    endTimeRef.current = performance.now() + remainingMsRef.current;

    const tick = (now: number) => {
      if (!endTimeRef.current) return;
      const left = Math.max(0, endTimeRef.current - now);
      setRemainingMs(left);
      remainingMsRef.current = left;

      if (left <= 0) {
        setIsRunning(false);
        setIsCompleted(true);
        if (soundEnabled) {
          playTimerSound('chime');
        }
        releaseWakeLock();
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isRunning, soundEnabled]);

  const applyMinutes = useCallback((mins: number) => {
    const clamped = Math.max(1, Math.min(999, mins));
    setDurationMinutes(clamped);
    const ms = clamped * 60 * 1000;
    setTotalMs(ms);
    setRemainingMs(ms);
    remainingMsRef.current = ms;
    setIsRunning(false);
    setIsCompleted(false);
  }, []);

  const handleEndTimeChange = (val: string) => {
    setEndTimeStr(val);
    const [hh, mm] = val.split(':').map(Number);
    if (isNaN(hh) || isNaN(mm)) return;
    const now = new Date();
    const target = new Date();
    target.setHours(hh, mm, 0, 0);
    if (target.getTime() <= now.getTime()) {
      target.setDate(target.getDate() + 1);
    }
    const diffMs = Math.max(60 * 1000, target.getTime() - now.getTime());
    setTotalMs(diffMs);
    setRemainingMs(diffMs);
    remainingMsRef.current = diffMs;
    setDurationMinutes(Math.round(diffMs / 60000));
    setIsRunning(false);
    setIsCompleted(false);
  };

  const handleStart = () => {
    if (remainingMs <= 0) {
      setRemainingMs(totalMs);
      remainingMsRef.current = totalMs;
    }
    setIsCompleted(false);
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsCompleted(false);
    setRemainingMs(totalMs);
    remainingMsRef.current = totalMs;
  };

  const handleSelectTheme = (id: ThemeStyleId) => {
    setThemeStyle(id);
    setAccentId(THEME_CONFIGS[id].defaultAccent);
  };

  const handleSaveAsDefault = () => {
    try {
      const payload = {
        themeStyle,
        accentId,
        durationMinutes,
        sessionLabel,
        soundEnabled,
        showTime,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 2500);
    } catch {
      // ignore storage errors
    }
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement && !isFullscreen) {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
        try {
          const orientation = screen.orientation as unknown as { lock?: (mode: string) => Promise<void> };
          if (orientation?.lock) await orientation.lock('landscape');
        } catch {
          // ignore
        }
        setIsFullscreen(true);
      } else {
        if (document.fullscreenElement && document.exitFullscreen) {
          await document.exitFullscreen();
        }
        try {
          const orientation = screen.orientation as unknown as { unlock?: () => void };
          if (orientation?.unlock) orientation.unlock();
        } catch {
          // ignore
        }
        setIsFullscreen(false);
      }
    } catch {
      setIsFullscreen((prev) => !prev);
    }
  };

  // Format MM:SS
  const totalSeconds = Math.ceil(remainingMs / 1000);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  // Progress fraction (1.0 at start -> 0.0 at completion; or arc length matching mockup)
  const rawFraction = totalMs > 0 ? Math.max(0, Math.min(1, remainingMs / totalMs)) : 0;
  const elapsedFraction = 1 - rawFraction;
  // When idle at full 100%, show a graceful ~42% arc like the mockup so the two-tone ring is immediately visible;
  // as soon as the timer starts or progresses, synchronize 100% mathematically with rawFraction.
  const isAtInitialFull = !isRunning && !isCompleted && Math.abs(rawFraction - 1) < 0.0001;
  const visualArcFraction = isAtInitialFull ? 0.42 : rawFraction;

  const activeTheme = THEME_CONFIGS[themeStyle];
  const activeAccentHex =
    ACCENT_SWATCHES.find((a) => a.id === accentId)?.hex || '#F39C6B';

  const circleRadius = 96;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circleCircumference * (1 - visualArcFraction);

  const displayLabel =
    sessionLabel.trim() === 'Study Session' || sessionLabel.trim() === ''
      ? 'Focus Time'
      : sessionLabel.trim();

  return (
    <div className="space-y-8">
      {/* Main Interactive 3-Column Card */}
      <div className="rounded-2xl border border-[#E5E0D5] dark:border-[#2A332D] bg-white dark:bg-[#181D1A] p-4 shadow-sm sm:p-6 transition-colors">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch">
          {/* LEFT COLUMN: Curated Aesthetic Visual Stage */}
          <div
            ref={stageRef}
            className={`relative flex min-h-[390px] flex-col items-center justify-between overflow-hidden rounded-xl border border-[#DFD5C6] dark:border-[#2D352F] p-5 lg:col-span-5 ${
              isFullscreen ? 'timer-fullscreen-stage p-8' : ''
            }`}
          >
            {isFullscreen && (
              <button
                type="button"
                onClick={toggleFullscreen}
                className="fixed top-4 right-4 z-50 inline-flex items-center gap-1.5 rounded-full bg-black/55 hover:bg-black/75 backdrop-blur-md border border-white/20 px-4 py-2 text-xs font-bold text-white shadow-lg transition cursor-pointer"
                aria-label="Exit Fullscreen"
              >
                <Minimize2 className="h-4 w-4" />
                <span>Exit Fullscreen</span>
              </button>
            )}
            {/* Dynamic Curated Background Artwork per Theme */}
            <svg
              viewBox="0 0 400 420"
              preserveAspectRatio="xMidYMid slice"
              shapeRendering="geometricPrecision"
              className="pointer-events-none absolute inset-0 h-full w-full"
              aria-hidden="true"
            >
              <defs>
                {/* Warm Sunset Sky Gradient */}
                <linearGradient id="bg-warm-sunset" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#B89B96" />
                  <stop offset="32%" stopColor="#DFB499" />
                  <stop offset="62%" stopColor="#F3C99E" />
                  <stop offset="100%" stopColor="#C88D6C" />
                </linearGradient>

                {/* Minimal Ivory Gradient */}
                <linearGradient id="bg-minimal-ivory" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FBF8F1" />
                  <stop offset="55%" stopColor="#F4EDE0" />
                  <stop offset="100%" stopColor="#EAE0CE" />
                </linearGradient>

                {/* Forest Green Gradient */}
                <linearGradient id="bg-forest-green" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4B6652" />
                  <stop offset="55%" stopColor="#354D3C" />
                  <stop offset="100%" stopColor="#203125" />
                </linearGradient>

                {/* Soft Pastel Gradient */}
                <linearGradient id="bg-soft-pastel" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FDECEF" />
                  <stop offset="50%" stopColor="#FADCE2" />
                  <stop offset="100%" stopColor="#F3C8D1" />
                </linearGradient>

                {/* Dark Academia Gradient */}
                <linearGradient id="bg-dark-academia" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2C221A" />
                  <stop offset="60%" stopColor="#1E1711" />
                  <stop offset="100%" stopColor="#140F0B" />
                </linearGradient>

                {/* Monochrome Gradient */}
                <linearGradient id="bg-monochrome" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#F3F4F6" />
                  <stop offset="60%" stopColor="#E5E7EB" />
                  <stop offset="100%" stopColor="#D1D5DB" />
                </linearGradient>

                {/* Paper Texture Gradient */}
                <linearGradient id="bg-paper-texture" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#EFE3CE" />
                  <stop offset="50%" stopColor="#E3D2B7" />
                  <stop offset="100%" stopColor="#D4BEA0" />
                </linearGradient>

                {/* Coastal Blue Gradient */}
                <linearGradient id="bg-coastal-blue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#A9CCE3" />
                  <stop offset="50%" stopColor="#C9E2EE" />
                  <stop offset="78%" stopColor="#7FB3CD" />
                  <stop offset="100%" stopColor="#4A7E9B" />
                </linearGradient>
              </defs>

              {/* Base Backdrop Fill */}
              <rect width="400" height="420" fill={`url(#bg-${themeStyle})`} />

              {/* Theme-specific Atmospheric Landscape & Botanical Details */}
              {themeStyle === 'warm-sunset' && (
                <>
                  {/* Soft glowing sun halo */}
                  <circle cx="200" cy="185" r="135" fill="#FDE6C4" opacity="0.35" />
                  {/* Distant misty mountain ranges */}
                  <path
                    d="M 0 285 Q 75 235 160 265 T 320 245 L 400 265 L 400 420 L 0 420 Z"
                    fill="#9D7566"
                    opacity="0.55"
                  />
                  <path
                    d="M 0 320 Q 110 275 220 308 T 400 285 L 400 420 L 0 420 Z"
                    fill="#6E4E44"
                    opacity="0.72"
                  />
                  <path
                    d="M 0 360 Q 140 335 270 355 T 400 340 L 400 420 L 0 420 Z"
                    fill="#3B2B28"
                    opacity="0.88"
                  />
                  {/* Delicate corner botanical branch silhouettes matching mockup */}
                  <g fill="#261E1B" opacity="0.85">
                    {/* Top-left fern twigs */}
                    <path d="M 0 20 Q 35 45 65 95" stroke="#261E1B" strokeWidth="2" fill="none" />
                    <ellipse cx="22" cy="32" rx="10" ry="3.5" transform="rotate(-25 22 32)" />
                    <ellipse cx="36" cy="48" rx="11" ry="3.5" transform="rotate(-30 36 48)" />
                    <ellipse cx="48" cy="66" rx="9" ry="3" transform="rotate(-20 48 66)" />
                    <ellipse cx="14" cy="46" rx="9" ry="3" transform="rotate(20 14 46)" />
                    <ellipse cx="28" cy="64" rx="10" ry="3" transform="rotate(15 28 64)" />
                    {/* Bottom-left botanical silhouettes */}
                    <path d="M 0 420 Q 35 370 55 315" stroke="#1F1917" strokeWidth="2.2" fill="none" />
                    <ellipse cx="22" cy="382" rx="11" ry="4" transform="rotate(-35 22 382)" />
                    <ellipse cx="36" cy="358" rx="11" ry="3.8" transform="rotate(-28 36 358)" />
                    <ellipse cx="46" cy="335" rx="9" ry="3.2" transform="rotate(-20 46 335)" />
                    <ellipse cx="16" cy="355" rx="10" ry="3.5" transform="rotate(25 16 355)" />
                    {/* Bottom-right botanical silhouettes */}
                    <path d="M 400 420 Q 360 368 338 315" stroke="#1F1917" strokeWidth="2.2" fill="none" />
                    <ellipse cx="372" cy="380" rx="11" ry="4" transform="rotate(35 372 380)" />
                    <ellipse cx="358" cy="355" rx="11" ry="3.8" transform="rotate(25 358 355)" />
                    <ellipse cx="345" cy="332" rx="9" ry="3.2" transform="rotate(18 345 332)" />
                  </g>
                </>
              )}

              {themeStyle === 'forest-green' && (
                <>
                  <path
                    d="M 0 290 Q 95 245 200 275 T 400 255 L 400 420 L 0 420 Z"
                    fill="#273B2C"
                    opacity="0.7"
                  />
                  <path
                    d="M 0 345 Q 130 310 260 338 T 400 320 L 400 420 L 0 420 Z"
                    fill="#18261C"
                    opacity="0.9"
                  />
                </>
              )}

              {themeStyle === 'soft-pastel' && (
                <>
                  <circle cx="80" cy="85" r="70" fill="#FFF5F7" opacity="0.45" />
                  <circle cx="330" cy="340" r="85" fill="#F8BBD0" opacity="0.3" />
                </>
              )}

              {themeStyle === 'dark-academia' && (
                <>
                  {/* Subtle vintage gold corner frame lines */}
                  <rect
                    x="16"
                    y="16"
                    width="368"
                    height="388"
                    rx="10"
                    fill="none"
                    stroke="#8C6D46"
                    strokeWidth="1"
                    opacity="0.45"
                  />
                  <circle cx="200" cy="185" r="128" fill="none" stroke="#8C6D46" strokeWidth="0.75" opacity="0.35" />
                </>
              )}

              {themeStyle === 'paper-texture' && (
                <>
                  {/* Subtle warm paper organic arcs */}
                  <path
                    d="M 0 330 Q 120 295 250 325 T 400 310 L 400 420 L 0 420 Z"
                    fill="#C8B08E"
                    opacity="0.45"
                  />
                </>
              )}

              {themeStyle === 'coastal-blue' && (
                <>
                  <circle cx="200" cy="145" r="95" fill="#FFFDF9" opacity="0.4" />
                  <path
                    d="M 0 285 Q 100 265 200 285 T 400 275 L 400 420 L 0 420 Z"
                    fill="#5B92B0"
                    opacity="0.55"
                  />
                  <path
                    d="M 0 335 Q 110 315 220 335 T 400 325 L 400 420 L 0 420 Z"
                    fill="#34637D"
                    opacity="0.75"
                  />
                </>
              )}
            </svg>

            {/* Top Spacer */}
            <div className="relative z-10 h-1" />

            {/* Center Circular / Analog Countdown Dial */}
            <div className="relative z-10 my-auto flex items-center justify-center">
              <svg
                viewBox="0 0 240 240"
                shapeRendering="geometricPrecision"
                className={`${isFullscreen ? 'h-[78vmin] w-[78vmin] max-h-[480px] max-w-[480px]' : 'h-[250px] w-[250px] sm:h-[268px] sm:w-[268px]'} select-none drop-shadow-md`}
                role="img"
                aria-label={`${activeTheme.label} aesthetic countdown timer showing ${formattedTime}`}
              >
                {/* Frosted Inner Circle Plate */}
                <circle
                  cx="120"
                  cy="120"
                  r={circleRadius}
                  fill={activeTheme.dialFill}
                />

                {/* Background Progress Track Ring */}
                <circle
                  cx="120"
                  cy="120"
                  r={circleRadius}
                  fill="none"
                  stroke={activeTheme.trackColor}
                  strokeWidth="12"
                />

                {/* Active Smooth Progress Ring */}
                <circle
                  cx="120"
                  cy="120"
                  r={circleRadius}
                  fill="none"
                  stroke={activeAccentHex}
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={circleCircumference}
                  strokeDashoffset={strokeDashoffset}
                  transform="rotate(-90 120 120)"
                />

                {/* Optional Analog Clock Tick Marks for Dark Academia */}
                {activeTheme.isAnalog && (
                  <g stroke="#C8A97E" opacity="0.7">
                    {Array.from({ length: 12 }).map((_, i) => {
                      const angle = i * 30;
                      return (
                        <line
                          key={i}
                          x1="120"
                          y1="32"
                          x2="120"
                          y2={i % 3 === 0 ? '42' : '37'}
                          strokeWidth={i % 3 === 0 ? '2' : '1.2'}
                          transform={`rotate(${angle} 120 120)`}
                        />
                      );
                    })}
                    {/* Subtle analog progress hand */}
                    <line
                      x1="120"
                      y1="120"
                      x2="120"
                      y2="56"
                      stroke="#D4AF37"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      transform={`rotate(${elapsedFraction * 360} 120 120)`}
                      opacity="0.45"
                    />
                  </g>
                )}

                {/* Digital Time, Session Label & Botanical Emblem inside Dial */}
                {showTime ? (
                  <>
                    <text
                      x="120"
                      y="108"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={activeTheme.textColor}
                      className="font-sans text-[42px] font-bold tracking-tight"
                    >
                      {formattedTime}
                    </text>
                    <text
                      x="120"
                      y="138"
                      textAnchor="middle"
                      fill={activeTheme.subTextColor}
                      className="font-sans text-[13px] font-medium"
                    >
                      {isCompleted ? 'Session Complete' : displayLabel}
                    </text>
                  </>
                ) : (
                  <text
                    x="120"
                    y="118"
                    textAnchor="middle"
                    fill={activeTheme.textColor}
                    className="font-serif text-[16px] font-semibold"
                  >
                    {isCompleted ? 'Session Complete' : displayLabel}
                  </text>
                )}

                {/* Delicate Botanical Leaf Emblem underneath Focus Time matching mockup */}
                <g
                  transform="translate(120, 166)"
                  stroke={activeTheme.isAnalog ? '#D4AF37' : '#A67B5B'}
                  fill="none"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M -5 9 C -2 2, 3 -4, 8 -9" />
                  <path d="M -2 5 C -8 2, -8 -4, -1 -6 C 2 -4, 1 2, -2 5 Z" />
                  <path d="M 2 0 C 8 2, 10 -3, 6 -7 C 3 -6, 2 -2, 2 0 Z" />
                </g>
              </svg>
            </div>

            {/* Bottom Inspirational Quote */}
            {!isFullscreen && (
              <div className="relative z-10 mt-3 text-center">
                <p
                  className="font-serif italic text-sm sm:text-[15px] tracking-wide drop-shadow-2xs"
                  style={{ color: activeTheme.quoteColor }}
                >
                  {activeTheme.quoteText}
                </p>
              </div>
            )}
          </div>

          {/* MIDDLE COLUMN: Timer Controls */}
          <div className="flex flex-col justify-between lg:col-span-4">
            <div className="space-y-4">
              {/* Duration / End Time Tabs */}
              <div className="grid grid-cols-2 rounded-lg bg-[#F2EFE9] dark:bg-[#222824] p-1">
                <button
                  type="button"
                  onClick={() => setModeTab('duration')}
                  className={`rounded-md py-2 text-sm font-semibold transition cursor-pointer ${
                    modeTab === 'duration'
                      ? 'bg-[#1F4E3B] text-white shadow-xs'
                      : 'text-[#4B5563] dark:text-slate-300 hover:text-[#111827] dark:hover:text-white'
                  }`}
                >
                  Duration
                </button>
                <button
                  type="button"
                  onClick={() => setModeTab('endTime')}
                  className={`rounded-md py-2 text-sm font-semibold transition cursor-pointer ${
                    modeTab === 'endTime'
                      ? 'bg-[#1F4E3B] text-white shadow-xs'
                      : 'text-[#4B5563] dark:text-slate-300 hover:text-[#111827] dark:hover:text-white'
                  }`}
                >
                  End Time
                </button>
              </div>

              {modeTab === 'duration' ? (
                <>
                  {/* 5 Preset Buttons: 5 min, 10 min, 25 min, 50 min, Custom */}
                  <div className="grid grid-cols-5 gap-1.5">
                    {[5, 10, 25, 50].map((preset) => {
                      const active = durationMinutes === preset && totalMs === preset * 60 * 1000;
                      return (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => applyMinutes(preset)}
                          className={`rounded-lg border py-2 text-xs font-semibold transition cursor-pointer ${
                            active
                              ? 'border-[#1F4E3B] bg-[#1F4E3B] text-white shadow-xs'
                              : 'border-[#E5E0D5] dark:border-[#303933] bg-[#FAF8F5] dark:bg-[#222824] text-[#1F2937] dark:text-slate-200 hover:border-[#1F4E3B]/40'
                          }`}
                        >
                          {preset} min
                        </button>
                      );
                    })}
                    <button
                      type="button"
                      onClick={() => {
                        customInputRef.current?.focus();
                        customInputRef.current?.select();
                      }}
                      className={`rounded-lg border py-2 text-xs font-semibold transition cursor-pointer ${
                        ![5, 10, 25, 50].includes(durationMinutes)
                          ? 'border-[#1F4E3B] bg-[#1F4E3B] text-white shadow-xs'
                          : 'border-[#E5E0D5] dark:border-[#303933] bg-[#FAF8F5] dark:bg-[#222824] text-[#1F2937] dark:text-slate-200 hover:border-[#1F4E3B]/40'
                      }`}
                    >
                      Custom
                    </button>
                  </div>

                  {/* Custom Minutes Stepper Input */}
                  <div className="flex items-center gap-3">
                    <div className="relative flex w-28 items-center rounded-lg border border-[#D8D2C5] dark:border-[#333C36] bg-white dark:bg-[#1E2420] px-3 py-2">
                      <input
                        ref={customInputRef}
                        type="number"
                        min={1}
                        max={999}
                        value={durationMinutes}
                        onChange={(e) => applyMinutes(parseInt(e.target.value || '1', 10))}
                        className="w-full bg-transparent text-base font-semibold text-[#111827] dark:text-white focus:outline-none"
                        aria-label="Custom duration in minutes"
                      />
                      <div className="flex flex-col">
                        <button
                          type="button"
                          onClick={() => applyMinutes(durationMinutes + 1)}
                          className="text-[#4B5563] dark:text-slate-400 hover:text-[#111827] dark:hover:text-white cursor-pointer"
                          aria-label="Increase minutes"
                        >
                          <ChevronUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => applyMinutes(Math.max(1, durationMinutes - 1))}
                          className="text-[#4B5563] dark:text-slate-400 hover:text-[#111827] dark:hover:text-white cursor-pointer"
                          aria-label="Decrease minutes"
                        >
                          <ChevronDown className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-[#4B5563] dark:text-slate-300">minutes</span>
                  </div>
                </>
              ) : (
                <div className="space-y-2 py-2">
                  <label className="block text-xs font-semibold text-[#4B5563] dark:text-slate-300">
                    Select Target End Time
                  </label>
                  <input
                    type="time"
                    value={endTimeStr}
                    onChange={(e) => handleEndTimeChange(e.target.value)}
                    className="w-full rounded-lg border border-[#D8D2C5] dark:border-[#333C36] bg-white dark:bg-[#1E2420] px-3.5 py-2.5 text-base font-semibold text-[#111827] dark:text-white focus:border-[#1F4E3B] focus:outline-none"
                  />
                </div>
              )}

              {/* Session Label (optional) Input matching mockup */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#4B5563] dark:text-slate-300">
                  Session Label (optional)
                </label>
                <div className="relative flex items-center rounded-lg border border-[#D8D2C5] dark:border-[#333C36] bg-white dark:bg-[#1E2420] px-3 py-2 focus-within:border-[#1F4E3B]">
                  <input
                    type="text"
                    value={sessionLabel}
                    onChange={(e) => setSessionLabel(e.target.value)}
                    placeholder="e.g. Study Session, Focus Time"
                    maxLength={40}
                    className="w-full bg-transparent text-sm font-medium text-[#111827] dark:text-white placeholder-[#9CA3AF] dark:placeholder-slate-500 focus:outline-none"
                    aria-label="Session Label"
                  />
                  {sessionLabel && (
                    <button
                      type="button"
                      onClick={() => setSessionLabel('')}
                      className="ml-2 text-[#6B7280] dark:text-slate-400 hover:text-[#111827] dark:hover:text-white cursor-pointer"
                      aria-label="Clear session label"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Primary Start Button */}
              <button
                type="button"
                onClick={isRunning ? handlePause : handleStart}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1F4E3B] py-3 text-base font-semibold text-white shadow-xs transition hover:bg-[#183E2F] cursor-pointer"
              >
                <Play className="h-4 w-4 fill-current" />
                <span>{isRunning ? 'Running...' : 'Start'}</span>
              </button>

              {/* Pause & Reset Row */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={isRunning ? handlePause : handleStart}
                  className="flex items-center justify-center gap-2 rounded-lg border border-[#E5E0D5] dark:border-[#303933] bg-[#F5F2EC] dark:bg-[#222824] py-2.5 text-sm font-semibold text-[#1F2937] dark:text-slate-200 transition hover:bg-[#EAE5DC] dark:hover:bg-[#2A322C] cursor-pointer"
                >
                  <Pause className="h-4 w-4" />
                  <span>
                    {isRunning
                      ? 'Pause'
                      : remainingMs < totalMs && remainingMs > 0
                      ? 'Resume'
                      : 'Pause'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center justify-center gap-2 rounded-lg border border-[#E5E0D5] dark:border-[#303933] bg-[#F5F2EC] dark:bg-[#222824] py-2.5 text-sm font-semibold text-[#1F2937] dark:text-slate-200 transition hover:bg-[#EAE5DC] dark:hover:bg-[#2A322C] cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Utility Bar: Sound Alert, Fullscreen, Show Time */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-[#EFECE6] dark:border-[#2A332D] pt-3.5 text-xs font-medium text-[#4B5563] dark:text-slate-300">
              <div className="flex items-center gap-1.5">
                <Bell className="h-3.5 w-3.5 text-[#1F4E3B] dark:text-[#5CE1A6]" />
                <span>Sound Alert</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={soundEnabled}
                  onClick={() => setSoundEnabled((prev) => !prev)}
                  className={`relative ml-1 inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    soundEnabled ? 'bg-[#1F4E3B]' : 'bg-[#D1CEC7] dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition ${
                      soundEnabled ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <button
                type="button"
                onClick={toggleFullscreen}
                className="flex items-center gap-1 text-[#4B5563] dark:text-slate-300 hover:text-[#111827] dark:hover:text-white cursor-pointer"
              >
                {isFullscreen ? (
                  <Minimize2 className="h-3.5 w-3.5 text-[#1F4E3B] dark:text-[#5CE1A6]" />
                ) : (
                  <Maximize2 className="h-3.5 w-3.5 text-[#1F4E3B] dark:text-[#5CE1A6]" />
                )}
                <span>Fullscreen</span>
              </button>

              <div className="flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5 text-[#1F4E3B] dark:text-[#5CE1A6]" />
                <span>Show Time</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={showTime}
                  onClick={() => setShowTime((prev) => !prev)}
                  className={`relative ml-1 inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    showTime ? 'bg-[#1F4E3B]' : 'bg-[#D1CEC7] dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition ${
                      showTime ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Theme Style Grid (2x4), Accent Color Swatches, Save My Style */}
          <div className="flex flex-col justify-between border-t border-[#EFECE6] dark:border-[#2A332D] pt-4 lg:col-span-3 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
            <div>
              <h3 className="mb-2 text-xs font-bold text-[#1F2937] dark:text-white">Theme Style</h3>

              {/* 2x4 Curated Theme Selector Grid matching reference image */}
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    { id: 'minimal-ivory', label: 'Minimal Ivory' },
                    { id: 'warm-sunset', label: 'Warm Sunset' },
                    { id: 'forest-green', label: 'Forest Green' },
                    { id: 'soft-pastel', label: 'Soft Pastel' },
                    { id: 'dark-academia', label: 'Dark Academia' },
                    { id: 'monochrome', label: 'Monochrome' },
                    { id: 'paper-texture', label: 'Paper Texture' },
                    { id: 'coastal-blue', label: 'Coastal Blue' },
                  ] as const
                ).map((item) => {
                  const active = themeStyle === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectTheme(item.id)}
                      className={`flex flex-col items-center rounded-xl border p-1.5 text-center transition cursor-pointer ${
                        active
                          ? 'border-[#1F4E3B] dark:border-[#4BA37A] bg-[#EEF4F0] dark:bg-[#233229] ring-1 ring-[#1F4E3B] dark:ring-[#4BA37A]'
                          : 'border-[#E5E0D5] dark:border-[#303933] bg-[#FAF8F5] dark:bg-[#202622] hover:border-[#C7C0B3] dark:hover:border-slate-500'
                      }`}
                    >
                      {/* Thumbnail Illustration */}
                      <div className="relative mb-1 flex h-11 w-full items-center justify-center overflow-hidden rounded-lg">
                        {item.id === 'minimal-ivory' && (
                          <svg viewBox="0 0 80 48" className="h-full w-full">
                            <rect width="80" height="48" fill="#F6EFE2" />
                            <circle cx="40" cy="24" r="14" fill="#FFFDF9" stroke="#E8DEC8" strokeWidth="3" />
                            <path
                              d="M 40 10 A 14 14 0 0 1 54 24"
                              fill="none"
                              stroke="#F39C6B"
                              strokeWidth="3"
                              strokeLinecap="round"
                            />
                          </svg>
                        )}
                        {item.id === 'warm-sunset' && (
                          <svg viewBox="0 0 80 48" className="h-full w-full">
                            <rect width="80" height="48" fill="#F2C89B" />
                            <circle cx="40" cy="23" r="14" fill="#EB9656" />
                            <path d="M 0 36 Q 25 27 50 35 T 80 31 L 80 48 L 0 48 Z" fill="#634338" />
                          </svg>
                        )}
                        {item.id === 'forest-green' && (
                          <svg viewBox="0 0 80 48" className="h-full w-full">
                            <rect width="80" height="48" fill="#B7C6B5" />
                            <circle cx="40" cy="24" r="14" fill="#2E4A36" />
                            <path
                              d="M 36 30 Q 40 22 44 17 M 40 25 L 36 22 M 41 21 L 45 19"
                              stroke="#A3BFA8"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                          </svg>
                        )}
                        {item.id === 'soft-pastel' && (
                          <svg viewBox="0 0 80 48" className="h-full w-full">
                            <rect width="80" height="48" fill="#FADCE2" />
                            <circle cx="40" cy="24" r="14" fill="#F6B8C6" />
                            <circle cx="40" cy="21" r="3.5" fill="#E87A90" />
                            <circle cx="35" cy="24" r="3.5" fill="#E87A90" />
                            <circle cx="45" cy="24" r="3.5" fill="#E87A90" />
                            <circle cx="37" cy="29" r="3.5" fill="#E87A90" />
                            <circle cx="43" cy="29" r="3.5" fill="#E87A90" />
                            <circle cx="40" cy="25" r="2" fill="#FFF3B0" />
                          </svg>
                        )}
                        {item.id === 'dark-academia' && (
                          <svg viewBox="0 0 80 48" className="h-full w-full">
                            <rect width="80" height="48" fill="#221A13" />
                            <circle cx="40" cy="24" r="14" fill="#18120C" stroke="#C59B6D" strokeWidth="1.5" />
                            <line x1="40" y1="24" x2="40" y2="15" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" />
                            <line x1="40" y1="24" x2="47" y2="24" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                        )}
                        {item.id === 'monochrome' && (
                          <svg viewBox="0 0 80 48" className="h-full w-full">
                            <rect width="80" height="48" fill="#EAECEF" />
                            <circle cx="40" cy="24" r="14" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="3" />
                            <path
                              d="M 40 10 A 14 14 0 1 1 28 31"
                              fill="none"
                              stroke="#374151"
                              strokeWidth="3"
                              strokeLinecap="round"
                            />
                          </svg>
                        )}
                        {item.id === 'paper-texture' && (
                          <svg viewBox="0 0 80 48" className="h-full w-full">
                            <rect width="80" height="48" fill="#E5D3B8" />
                            <path d="M 30 34 Q 40 24 50 14" stroke="#7D5A3C" strokeWidth="1.6" fill="none" />
                            <ellipse cx="36" cy="26" rx="4" ry="2" transform="rotate(-30 36 26)" fill="#7D5A3C" />
                            <ellipse cx="44" cy="24" rx="4" ry="2" transform="rotate(25 44 24)" fill="#7D5A3C" />
                            <ellipse cx="41" cy="18" rx="4" ry="2" transform="rotate(-25 41 18)" fill="#7D5A3C" />
                          </svg>
                        )}
                        {item.id === 'coastal-blue' && (
                          <svg viewBox="0 0 80 48" className="h-full w-full">
                            <rect width="80" height="48" fill="#B5D6E8" />
                            <circle cx="40" cy="22" r="13" fill="#E6F3F8" opacity="0.85" />
                            <path d="M 0 33 Q 25 28 50 34 T 80 31 L 80 48 L 0 48 Z" fill="#467C99" />
                          </svg>
                        )}
                      </div>
                      <span className="text-[10px] font-semibold text-[#1F2937] dark:text-slate-200 leading-tight">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Accent Color Swatches */}
            <div className="mt-3">
              <div className="mb-1.5 text-xs font-bold text-[#1F2937] dark:text-white">Accent Color</div>
              <div className="flex items-center justify-between gap-1.5">
                {ACCENT_SWATCHES.map((swatch) => {
                  const active = accentId === swatch.id;
                  return (
                    <button
                      key={swatch.id}
                      type="button"
                      onClick={() => setAccentId(swatch.id)}
                      aria-label={swatch.label}
                      title={swatch.label}
                      className={`h-6 w-6 rounded-full transition cursor-pointer ${
                        active ? 'ring-2 ring-[#1F4E3B] dark:ring-white ring-offset-2 dark:ring-offset-[#181D1A] scale-105' : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: swatch.hex }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Save My Style Row matching mockup */}
            <div className="mt-3.5 flex items-center justify-between gap-2 border-t border-[#EFECE6] dark:border-[#2A332D] pt-3">
              <span className="text-xs font-bold text-[#1F2937] dark:text-white">Save My Style</span>
              <button
                type="button"
                onClick={handleSaveAsDefault}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#1F4E3B]/40 dark:border-[#4BA37A]/50 bg-[#F4F8F5] dark:bg-[#233229] px-3 py-1.5 text-xs font-semibold text-[#1F4E3B] dark:text-[#6EE7B7] transition hover:bg-[#E6F0EA] dark:hover:bg-[#2C3E33] cursor-pointer"
              >
                {savedNotice ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Saved Default</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="h-3.5 w-3.5" />
                    <span>Save as Default</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Presets Section */}
      <div>
        <h2 className="font-serif text-xl font-bold text-[#14201B] dark:text-white">Quick Presets</h2>
        <p className="mt-0.5 text-sm text-[#4B5563] dark:text-slate-400">
          Start with a popular time or set a custom duration.
        </p>

        <div className="mt-3.5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { mins: 5, title: '5 Minutes', sub: 'Quick break', label: 'Short Break', icon: Coffee },
            { mins: 10, title: '10 Minutes', sub: 'Short focus', label: 'Focus Time', icon: BookOpen },
            { mins: 25, title: '25 Minutes', sub: 'Study session', label: 'Study Session', icon: GraduationCap },
            { mins: 50, title: '50 Minutes', sub: 'Deep work', label: 'Deep Work', icon: Laptop },
            { mins: 25, title: 'Pomodoro', sub: '25 + 5 min', label: 'Pomodoro 25+5', icon: Timer, isPomodoro: true },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected =
              durationMinutes === item.mins &&
              totalMs === item.mins * 60 * 1000 &&
              (item.isPomodoro ? sessionLabel === 'Pomodoro 25+5' : sessionLabel !== 'Pomodoro 25+5');
            return (
              <button
                key={item.title}
                type="button"
                onClick={() => {
                  applyMinutes(item.mins);
                  setSessionLabel(item.label);
                }}
                className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition cursor-pointer ${
                  isSelected
                    ? 'border-[#1F4E3B] dark:border-[#4BA37A] bg-[#F4F8F5] dark:bg-[#233229] shadow-2xs'
                    : 'border-[#E5E0D5] dark:border-[#2A332D] bg-white dark:bg-[#181D1A] hover:border-[#C5BEB0] dark:hover:border-slate-600'
                }`}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFF3E6] dark:bg-amber-950/60 text-[#EA580C] dark:text-amber-400">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#14201B] dark:text-white">{item.title}</div>
                  <div
                    className={`text-xs ${
                      isSelected ? 'font-medium text-[#1F4E3B] dark:text-[#6EE7B7]' : 'text-[#6B7280] dark:text-slate-400'
                    }`}
                  >
                    {item.sub}
                  </div>
                </div>
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => {
              setModeTab('duration');
              customInputRef.current?.focus();
              customInputRef.current?.select();
            }}
            className="flex items-center gap-3 rounded-xl border border-[#E5E0D5] dark:border-[#2A332D] bg-white dark:bg-[#181D1A] p-3.5 text-left transition hover:border-[#1F4E3B] dark:hover:border-[#4BA37A] cursor-pointer"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EEF4F0] dark:bg-[#233229] text-[#1F4E3B] dark:text-[#6EE7B7]">
              <Settings className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#14201B] dark:text-white">Custom</div>
              <div className="text-xs text-[#6B7280] dark:text-slate-400">Set your own time</div>
            </div>
          </button>
        </div>
      </div>

      {/* Popular Uses Section */}
      <div className="rounded-2xl bg-[#EEF3EE] dark:bg-[#1A221D] border border-transparent dark:border-[#2A352E] p-5 sm:p-6">
        <h2 className="font-serif text-xl font-bold text-[#14201B] dark:text-white">Popular Uses</h2>
        <p className="mt-0.5 text-sm text-[#4B5563] dark:text-slate-400">
          An aesthetic timer is useful for many everyday situations.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {[
            {
              icon: BookOpen,
              title: 'Studying',
              desc: 'Stay focused and avoid distractions.',
            },
            {
              icon: BookOpen,
              title: 'Reading',
              desc: 'Enjoy a calm and distraction-free time.',
            },
            {
              icon: PenTool,
              title: 'Writing',
              desc: 'Make time for your creative work.',
            },
            {
              icon: Laptop,
              title: 'Work Sessions',
              desc: 'Stay productive and organized.',
            },
            {
              icon: Coffee,
              title: 'Breaks',
              desc: 'Take regular breaks and refresh.',
            },
            {
              icon: Sprout,
              title: 'Personal Routines',
              desc: 'Build better habits every day.',
            },
          ].map((useCase) => {
            const Icon = useCase.icon;
            return (
              <div
                key={useCase.title}
                className="flex items-start gap-3 rounded-xl border border-[#E0E7E0] dark:border-[#2B362E] bg-white dark:bg-[#151A17] p-3.5 shadow-2xs"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EAF2EC] dark:bg-[#233229] text-[#1F4E3B] dark:text-[#6EE7B7]">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#14201B] dark:text-white">{useCase.title}</div>
                  <div className="mt-0.5 text-[11px] leading-snug text-[#6B7280] dark:text-slate-400">
                    {useCase.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

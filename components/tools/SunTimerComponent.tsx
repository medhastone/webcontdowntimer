'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Eye,
  EyeOff,
  Sun,
  Sunrise,
  Settings,
  BookOpen,
  GraduationCap,
  Laptop,
  Coffee,
  Activity,
  Sparkles,
  ChevronUp,
  ChevronDown,
  X,
  Bookmark,
  Check,
} from 'lucide-react';
import { playTimerSound } from '@/lib/sound';

type SkyThemeId = 'morning' | 'midday' | 'sunset' | 'warm-neutral';
type TimerMode = 'duration' | 'endTime';

interface SkyThemeConfig {
  id: SkyThemeId;
  label: string;
  skyTopStart: string;
  skyMidStart: string;
  skyBottomStart: string;
  skyTopEnd: string;
  skyMidEnd: string;
  skyBottomEnd: string;
  sunCore: string;
  sunMid: string;
  sunGlow: string;
  cloudColor: string;
  cloudOpacity: number;
  farMountain: string;
  midMountain: string;
  nearMountain: string;
  waterTop: string;
  waterBottom: string;
  shimmerColor: string;
  treeColor: string;
  textColor: string;
  subTextColor: string;
}

const SKY_THEMES: SkyThemeConfig[] = [
  {
    id: 'morning',
    label: 'Morning',
    skyTopStart: '#3B82C4',
    skyMidStart: '#8EC5E8',
    skyBottomStart: '#FCE19C',
    skyTopEnd: '#2B5B8C',
    skyMidEnd: '#D99B66',
    skyBottomEnd: '#F5B062',
    sunCore: '#FFFDF5',
    sunMid: '#FFE484',
    sunGlow: '#FDBA4D',
    cloudColor: '#FFF6E0',
    cloudOpacity: 0.55,
    farMountain: '#9B897A',
    midMountain: '#6C6460',
    nearMountain: '#3F4744',
    waterTop: '#F7C97E',
    waterBottom: '#2B587A',
    shimmerColor: '#FFF3B8',
    treeColor: '#172E24',
    textColor: '#13253A',
    subTextColor: '#293B4E',
  },
  {
    id: 'midday',
    label: 'Midday',
    skyTopStart: '#1D74C6',
    skyMidStart: '#5AB2F2',
    skyBottomStart: '#BBE6FF',
    skyTopEnd: '#155799',
    skyMidEnd: '#4695D6',
    skyBottomEnd: '#9ED2F5',
    sunCore: '#FFFFFF',
    sunMid: '#FFF099',
    sunGlow: '#FCD34D',
    cloudColor: '#FFFFFF',
    cloudOpacity: 0.72,
    farMountain: '#6789A8',
    midMountain: '#4A6E8A',
    nearMountain: '#2F5266',
    waterTop: '#8BD1FA',
    waterBottom: '#1C5D8C',
    shimmerColor: '#FFFBE0',
    treeColor: '#143328',
    textColor: '#0E243B',
    subTextColor: '#21405E',
  },
  {
    id: 'sunset',
    label: 'Sunset',
    skyTopStart: '#2D295E',
    skyMidStart: '#A84255',
    skyBottomStart: '#F99D48',
    skyTopEnd: '#191638',
    skyMidEnd: '#6E2846',
    skyBottomEnd: '#D95B38',
    sunCore: '#FFF9E6',
    sunMid: '#FDBA4D',
    sunGlow: '#F97316',
    cloudColor: '#F7A072',
    cloudOpacity: 0.45,
    farMountain: '#5E2B42',
    midMountain: '#3F1D32',
    nearMountain: '#241122',
    waterTop: '#F38B4A',
    waterBottom: '#231736',
    shimmerColor: '#FFD285',
    treeColor: '#120B18',
    textColor: '#FFFFFF',
    subTextColor: '#FDE6D2',
  },
  {
    id: 'warm-neutral',
    label: 'Warm Neutral',
    skyTopStart: '#DFC5A5',
    skyMidStart: '#EED9BE',
    skyBottomStart: '#FAF0DF',
    skyTopEnd: '#C4A684',
    skyMidEnd: '#DFC2A0',
    skyBottomEnd: '#F0DEC3',
    sunCore: '#FFFDF9',
    sunMid: '#F7DDA8',
    sunGlow: '#E3B678',
    cloudColor: '#FFFDF9',
    cloudOpacity: 0.6,
    farMountain: '#B8987A',
    midMountain: '#997A5E',
    nearMountain: '#735842',
    waterTop: '#F2DFC2',
    waterBottom: '#8C6E54',
    shimmerColor: '#FFFDF7',
    treeColor: '#4A3728',
    textColor: '#2C221A',
    subTextColor: '#4A3A2C',
  },
];

interface AccentColorOption {
  id: string;
  label: string;
  hex: string;
  hoverHex: string;
  softBg: string;
  softBorder: string;
}

const ACCENT_COLORS: AccentColorOption[] = [
  {
    id: 'orange',
    label: 'Sunset Orange',
    hex: '#E65F16',
    hoverHex: '#CC500E',
    softBg: '#FDF3EC',
    softBorder: '#F4CEB5',
  },
  {
    id: 'gold',
    label: 'Golden Yellow',
    hex: '#E5A01D',
    hoverHex: '#C98A12',
    softBg: '#FEF9EC',
    softBorder: '#F7E2B0',
  },
  {
    id: 'coral',
    label: 'Coral Peach',
    hex: '#EA6350',
    hoverHex: '#D14F3D',
    softBg: '#FDF1EF',
    softBorder: '#F6C8C1',
  },
  {
    id: 'orchid',
    label: 'Orchid Pink',
    hex: '#D665BC',
    hoverHex: '#BC4FA3',
    softBg: '#FCF2FA',
    softBorder: '#EFC6E5',
  },
  {
    id: 'indigo',
    label: 'Periwinkle Blue',
    hex: '#5773E8',
    hoverHex: '#435FD1',
    softBg: '#F1F4FD',
    softBorder: '#C5D0F7',
  },
  {
    id: 'sky',
    label: 'Sky Cyan',
    hex: '#2295E6',
    hoverHex: '#187DC7',
    softBg: '#EFF7FD',
    softBorder: '#BCE0FA',
  },
  {
    id: 'emerald',
    label: 'Meadow Green',
    hex: '#28AD78',
    hoverHex: '#1E9263',
    softBg: '#EFFAF5',
    softBorder: '#BCE8D5',
  },
];

const QUICK_PRESETS = [
  { minutes: 5, label: '5 Minutes', sub: 'Quick break', icon: 'sun' },
  { minutes: 10, label: '10 Minutes', sub: 'Short focus', icon: 'sun' },
  { minutes: 25, label: '25 Minutes', sub: 'Study session', icon: 'sun' },
  { minutes: 50, label: '50 Minutes', sub: 'Deep work', icon: 'sun' },
  { minutes: 90, label: '90 Minutes', sub: 'Long session', icon: 'sunrise' },
];

const STORAGE_KEY = 'timetools_sun_timer_defaults_v1';

// Helper to interpolate between two hex colors
function lerpHexColor(hexA: string, hexB: string, t: number): string {
  const clamped = Math.max(0, Math.min(1, t));
  const parse = (h: string) => {
    const clean = h.replace('#', '');
    return [
      parseInt(clean.substring(0, 2), 16),
      parseInt(clean.substring(2, 4), 16),
      parseInt(clean.substring(4, 6), 16),
    ];
  };
  const [r1, g1, b1] = parse(hexA);
  const [r2, g2, b2] = parse(hexB);
  const r = Math.round(r1 + (r2 - r1) * clamped);
  const g = Math.round(g1 + (g2 - g1) * clamped);
  const b = Math.round(b1 + (b2 - b1) * clamped);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export default function SunTimerComponent() {
  // Mode & duration state (default 25 minutes matching screenshot)
  const [mode, setMode] = useState<TimerMode>('duration');
  const [durationMinutes, setDurationMinutes] = useState<number>(25);
  const [totalMs, setTotalMs] = useState<number>(25 * 60 * 1000);
  const [remainingMs, setRemainingMs] = useState<number>(25 * 60 * 1000);
  const [endTimeStr, setEndTimeStr] = useState<string>(() => {
    const d = new Date(Date.now() + 25 * 60 * 1000);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  });
  const [isCustomPreset, setIsCustomPreset] = useState<boolean>(false);

  // Running state
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Customization & Options
  const [sessionLabel, setSessionLabel] = useState<string>('Study Session');
  const [skyThemeId, setSkyThemeId] = useState<SkyThemeId>('morning');
  const [accentId, setAccentId] = useState<string>('orange');
  const [soundAlert, setSoundAlert] = useState<boolean>(true);
  const [showTime, setShowTime] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [savedFeedback, setSavedFeedback] = useState<boolean>(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const targetEndTimestampRef = useRef<number | null>(null);
  const customInputRef = useRef<HTMLInputElement>(null);

  const currentTheme = SKY_THEMES.find((t) => t.id === skyThemeId) || SKY_THEMES[0];
  const currentAccent = ACCENT_COLORS.find((a) => a.id === accentId) || ACCENT_COLORS[0];

  // Load saved defaults on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.skyThemeId && SKY_THEMES.some((t) => t.id === parsed.skyThemeId)) {
            setSkyThemeId(parsed.skyThemeId);
          }
          if (parsed.accentId && ACCENT_COLORS.some((a) => a.id === parsed.accentId)) {
            setAccentId(parsed.accentId);
          }
          if (typeof parsed.durationMinutes === 'number' && parsed.durationMinutes >= 1 && parsed.durationMinutes <= 720) {
            setDurationMinutes(parsed.durationMinutes);
            const ms = parsed.durationMinutes * 60 * 1000;
            setTotalMs(ms);
            setRemainingMs(ms);
          }
          if (typeof parsed.sessionLabel === 'string') {
            setSessionLabel(parsed.sessionLabel);
          }
          if (typeof parsed.soundAlert === 'boolean') {
            setSoundAlert(parsed.soundAlert);
          }
          if (typeof parsed.showTime === 'boolean') {
            setShowTime(parsed.showTime);
          }
        }
      } catch {
        // ignore storage errors
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleSaveAsDefault = () => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          skyThemeId,
          accentId,
          durationMinutes,
          sessionLabel,
          soundAlert,
          showTime,
        })
      );
      setSavedFeedback(true);
      setTimeout(() => setSavedFeedback(false), 2200);
    } catch {
      // ignore storage errors
    }
  };

  // High-precision animation loop for smooth 60fps sun arc & timer sync
  useEffect(() => {
    if (!isRunning) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    const tick = () => {
      if (!targetEndTimestampRef.current) return;
      const now = Date.now();
      const left = Math.max(0, targetEndTimestampRef.current - now);
      setRemainingMs(left);

      if (left <= 0) {
        setIsRunning(false);
        setIsCompleted(true);
        targetEndTimestampRef.current = null;
        if (soundAlert) {
          playTimerSound('bell', 0.85);
        }
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isRunning, soundAlert]);

  // Fullscreen listener
  useEffect(() => {
    const onFsChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!isFullscreen && !document.fullscreenElement) {
        setIsFullscreen(true);
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
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
        setIsFullscreen(false);
        try {
          const orientation = window.screen?.orientation as unknown as {
            unlock?: () => void;
          };
          orientation?.unlock?.();
        } catch {
          // ignore
        }
        if (document.fullscreenElement && document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch {
      setIsFullscreen((prev) => !prev);
    }
  }, [isFullscreen]);

  const applyDurationMinutes = (mins: number, custom = false) => {
    const clamped = Math.max(1, Math.min(720, Math.round(mins)));
    setIsRunning(false);
    setIsCompleted(false);
    targetEndTimestampRef.current = null;
    setDurationMinutes(clamped);
    setIsCustomPreset(custom);
    const ms = clamped * 60 * 1000;
    setTotalMs(ms);
    setRemainingMs(ms);
  };

  const applyEndTime = (timeVal: string) => {
    setEndTimeStr(timeVal);
    setIsRunning(false);
    setIsCompleted(false);
    targetEndTimestampRef.current = null;

    const [hh, mm] = timeVal.split(':').map(Number);
    if (Number.isNaN(hh) || Number.isNaN(mm)) return;
    const now = new Date();
    const target = new Date();
    target.setHours(hh, mm, 0, 0);
    if (target.getTime() <= now.getTime()) {
      target.setDate(target.getDate() + 1);
    }
    const diffMs = Math.max(60 * 1000, target.getTime() - now.getTime());
    setTotalMs(diffMs);
    setRemainingMs(diffMs);
    setDurationMinutes(Math.round(diffMs / 60000));
  };

  const handleStart = () => {
    let startFromMs = remainingMs;
    if (startFromMs <= 0 || isCompleted) {
      startFromMs = totalMs;
      setRemainingMs(totalMs);
      setIsCompleted(false);
    }
    targetEndTimestampRef.current = Date.now() + startFromMs;
    setIsRunning(true);
  };

  const handlePause = () => {
    if (!isRunning) return;
    if (targetEndTimestampRef.current) {
      const left = Math.max(0, targetEndTimestampRef.current - Date.now());
      setRemainingMs(left);
    }
    targetEndTimestampRef.current = null;
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsCompleted(false);
    targetEndTimestampRef.current = null;
    if (mode === 'endTime') {
      applyEndTime(endTimeStr);
    } else {
      const ms = durationMinutes * 60 * 1000;
      setTotalMs(ms);
      setRemainingMs(ms);
    }
  };

  // Format MM:SS or HH:MM:SS
  const totalSecondsRemaining = Math.ceil(remainingMs / 1000);
  const hours = Math.floor(totalSecondsRemaining / 3600);
  const mins = Math.floor((totalSecondsRemaining % 3600) / 60);
  const secs = totalSecondsRemaining % 60;
  const formattedTime =
    hours > 0
      ? `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
      : `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  // Strict 1:1 synchronization with timer:
  // timeFraction = 1.0 at full duration (100% remaining), 0.0 at 00:00 (0% remaining)
  const timeFraction = totalMs > 0 ? Math.max(0, Math.min(1, remainingMs / totalMs)) : 0;
  const elapsedFraction = 1 - timeFraction;

  // Sky color interpolation based on elapsedFraction (0 -> 1)
  const skyTop = lerpHexColor(currentTheme.skyTopStart, currentTheme.skyTopEnd, elapsedFraction);
  const skyMid = lerpHexColor(currentTheme.skyMidStart, currentTheme.skyMidEnd, elapsedFraction);
  const skyBottom = lerpHexColor(currentTheme.skyBottomStart, currentTheme.skyBottomEnd, elapsedFraction);

  // Sun Arc Geometry in 420x420 SVG coordinate space:
  // Circle center at (210, 292) with radius R = 204.
  // Full visible sky arc spans from angle -80° (left horizon) through 0° (zenith) to +80° (right horizon).
  // At 100% remaining (timeFraction = 1.0), the sun sits high at angle +8° (matching the reference screenshot at 25:00)
  // and travels smoothly along the arc down to +80° (setting at the right horizon at 00:00),
  // while the illuminated arc from the left horizon (-80°) to the sun's current position represents the remaining duration!
  const arcCenterX = 210;
  const arcCenterY = 292;
  const arcRadius = 204;

  const degToRad = (deg: number) => (deg * Math.PI) / 180;
  const pointOnArc = (angleDeg: number) => {
    const rad = degToRad(angleDeg - 90);
    return {
      x: arcCenterX + arcRadius * Math.cos(rad),
      y: arcCenterY + arcRadius * Math.sin(rad),
    };
  };

  // Start angle on left horizon = -78°, end angle on right horizon = +78°.
  // At timeFraction = 1 (100% remaining), sun is at +8° (high in the sky, matching reference image).
  // Wait: to make the sun position AND remaining arc 100% linear across the countdown:
  // As timeFraction goes from 1.0 -> 0.0, sunAngle moves linearly from +8° (high zenith) down to +78° (right sunset horizon),
  // AND the bright active dashed arc spans from the left horizon (-78°) up to the sun, shrinking as the sun sets!
  const leftHorizonAngle = -78;
  const rightHorizonAngle = 78;
  const sunStartAngle = 8; // Top-right zenith matching screenshot at 25:00
  const sunEndAngle = 78;  // Right horizon at 00:00
  const currentSunAngle = sunEndAngle - timeFraction * (sunEndAngle - sunStartAngle);
  const sunPos = pointOnArc(currentSunAngle);

  const buildArcPath = (fromAngle: number, toAngle: number) => {
    const start = pointOnArc(fromAngle);
    const end = pointOnArc(toAngle);
    const largeArc = Math.abs(toAngle - fromAngle) > 180 ? 1 : 0;
    const sweep = toAngle >= fromAngle ? 1 : 0;
    return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${arcRadius} ${arcRadius} 0 ${largeArc} ${sweep} ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
  };

  const fullArcPath = buildArcPath(leftHorizonAngle, rightHorizonAngle);
  const activeArcPath = buildArcPath(leftHorizonAngle, currentSunAngle);

  return (
    <div className="space-y-10">
      {/* MAIN 3-COLUMN INTERACTIVE TOOL CARD */}
      <div className="bg-white dark:bg-[#181D1A] border border-[#E6E1D6] dark:border-[#2A312C] rounded-3xl p-4 sm:p-6 lg:p-7 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-7 items-stretch">
          {/* LEFT STAGE: SUN & SKY SCENE (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col">
            <div
              ref={stageRef}
              className={`relative w-full aspect-square rounded-2xl overflow-hidden border border-[#E4DEC9] dark:border-[#2C3530] shadow-inner select-none flex items-center justify-center ${
                isFullscreen ? 'timer-fullscreen-stage' : ''
              }`}
            >
              <svg
                viewBox="0 0 420 420"
                preserveAspectRatio="xMidYMid slice"
                shapeRendering="geometricPrecision"
                className="w-full h-full object-cover"
                role="img"
                aria-label={`Sun countdown timer showing ${formattedTime} remaining`}
              >
                <defs>
                  {/* Dynamic Sky Gradient */}
                  <linearGradient id="sunStageSkyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={skyTop} />
                    <stop offset="52%" stopColor={skyMid} />
                    <stop offset="82%" stopColor={skyBottom} />
                    <stop offset="100%" stopColor={skyBottom} />
                  </linearGradient>

                  {/* Sun Multi-Layer Radial Glow */}
                  <radialGradient id="sunOuterCorona" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor={currentTheme.sunCore} stopOpacity="0.95" />
                    <stop offset="30%" stopColor={currentTheme.sunMid} stopOpacity="0.65" />
                    <stop offset="65%" stopColor={currentTheme.sunGlow} stopOpacity="0.22" />
                    <stop offset="100%" stopColor={currentTheme.sunGlow} stopOpacity="0" />
                  </radialGradient>

                  <radialGradient id="sunDiscGrad" cx="40%" cy="38%" r="60%">
                    <stop offset="0%" stopColor={currentTheme.sunCore} />
                    <stop offset="65%" stopColor={currentTheme.sunMid} />
                    <stop offset="100%" stopColor={currentTheme.sunGlow} />
                  </radialGradient>

                  {/* Lake Water Reflection Gradient */}
                  <linearGradient id="sunLakeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={currentTheme.waterTop} />
                    <stop offset="45%" stopColor={skyMid} />
                    <stop offset="100%" stopColor={currentTheme.waterBottom} />
                  </linearGradient>
                </defs>

                {/* 1. Sky Background */}
                <rect x="0" y="0" width="420" height="335" fill="url(#sunStageSkyGrad)" />

                {/* 2. Soft Illustrated Clouds */}
                <g fill={currentTheme.cloudColor} opacity={currentTheme.cloudOpacity}>
                  {/* Upper left cloud cluster */}
                  <ellipse cx="78" cy="105" rx="46" ry="12" />
                  <ellipse cx="96" cy="98" rx="32" ry="14" />
                  <ellipse cx="58" cy="108" rx="28" ry="9" />
                  {/* Upper right cloud wisps */}
                  <ellipse cx="348" cy="128" rx="52" ry="13" />
                  <ellipse cx="328" cy="120" rx="34" ry="15" />
                  {/* Lower horizon warm cloud bands */}
                  <ellipse cx="105" cy="242" rx="68" ry="11" opacity="0.65" />
                  <ellipse cx="325" cy="236" rx="74" ry="12" opacity="0.65" />
                </g>

                {/* 3. Full Subtle Dashed Sun Arc Path */}
                <path
                  d={fullArcPath}
                  fill="none"
                  stroke="#FFFFFF"
                  strokeOpacity="0.38"
                  strokeWidth="2.2"
                  strokeDasharray="6 6"
                  strokeLinecap="round"
                />

                {/* 4. Active Bright Dashed Arc from Left Horizon to Current Sun Position */}
                {timeFraction > 0.01 && (
                  <path
                    d={activeArcPath}
                    fill="none"
                    stroke="#FFFFFF"
                    strokeOpacity="0.92"
                    strokeWidth="2.8"
                    strokeDasharray="6 6"
                    strokeLinecap="round"
                  />
                )}

                {/* 5. Prominent Animated Sun along the Arc */}
                <g>
                  {/* Large warm atmospheric halo */}
                  <circle
                    cx={sunPos.x}
                    cy={sunPos.y}
                    r={68}
                    fill="url(#sunOuterCorona)"
                  />
                  {/* Soft middle glow ring */}
                  <circle
                    cx={sunPos.x}
                    cy={sunPos.y}
                    r={35}
                    fill={currentTheme.sunMid}
                    opacity="0.38"
                  />
                  {/* Crisp luminous sun disc */}
                  <circle
                    cx={sunPos.x}
                    cy={sunPos.y}
                    r={25}
                    fill="url(#sunDiscGrad)"
                  />
                </g>

                {/* 6. Layered Mountain Ranges on Horizon */}
                {/* Far mountain range */}
                <path
                  d="M 0 315 L 48 282 L 96 302 L 154 276 L 210 308 L 268 278 L 328 296 L 378 272 L 420 294 L 420 335 L 0 335 Z"
                  fill={currentTheme.farMountain}
                  opacity="0.85"
                />
                {/* Mid mountain range */}
                <path
                  d="M 0 322 L 68 292 L 136 318 L 198 304 L 254 318 L 318 288 L 382 312 L 420 298 L 420 335 L 0 335 Z"
                  fill={currentTheme.midMountain}
                />
                {/* Near mountain foothills */}
                <path
                  d="M 0 330 L 88 306 L 168 328 L 246 326 L 336 304 L 420 324 L 420 336 L 0 336 Z"
                  fill={currentTheme.nearMountain}
                />

                {/* 7. Calm Reflective Lake (y = 332 to 420) */}
                <rect x="0" y="332" width="420" height="88" fill="url(#sunLakeGrad)" />

                {/* Shimmering Golden Sun Reflection on Water (tracks sun X softly) */}
                <g opacity={Math.max(0.25, timeFraction)}>
                  {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
                    const ry = 338 + i * 9.5;
                    const rx = Math.max(8, 34 - i * 3.2);
                    const refX = 210 + (sunPos.x - 210) * 0.35;
                    return (
                      <ellipse
                        key={i}
                        cx={refX}
                        cy={ry}
                        rx={rx}
                        ry={1.9}
                        fill={currentTheme.shimmerColor}
                        opacity={0.78 - i * 0.08}
                      />
                    );
                  })}
                </g>

                {/* 8. Evergreen Pine Tree Silhouettes on Left & Right Shores */}
                {/* Left shore pine trees */}
                <g fill={currentTheme.treeColor}>
                  {/* Leftmost tall pine */}
                  <polygon points="18,242 2,285 34,285" />
                  <polygon points="18,266 -2,315 38,315" />
                  <polygon points="18,292 -6,348 42,348" />
                  {/* Second left pine */}
                  <polygon points="48,268 34,304 62,304" />
                  <polygon points="48,290 30,332 66,332" />
                  <polygon points="48,312 26,356 70,356" />
                  {/* Third small left pine */}
                  <polygon points="76,296 64,326 88,326" />
                  <polygon points="76,314 60,352 92,352" />
                  {/* Left shore bank */}
                  <path d="M 0 335 Q 55 338 112 362 L 0 375 Z" />
                </g>

                {/* Right shore pine trees */}
                <g fill={currentTheme.treeColor}>
                  {/* Rightmost tall pine */}
                  <polygon points="402,236 384,282 420,282" />
                  <polygon points="402,262 380,314 424,314" />
                  <polygon points="402,290 376,350 428,350" />
                  {/* Second right pine */}
                  <polygon points="370,264 354,302 386,302" />
                  <polygon points="370,286 350,330 390,330" />
                  <polygon points="370,308 346,356 394,356" />
                  {/* Third small right pine */}
                  <polygon points="342,294 330,324 354,324" />
                  <polygon points="342,312 326,350 358,350" />
                  {/* Right shore bank */}
                  <path d="M 420 335 Q 365 338 308 362 L 420 375 Z" />
                </g>
              </svg>

              {/* Centered Digital Time Readout & Session Label Overlay */}
              {(showTime || isFullscreen) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-4 text-center pt-4">
                  <div
                    className={`font-sans font-bold tracking-tight drop-shadow-xs tabular-nums ${
                      isFullscreen
                        ? 'text-6xl sm:text-7xl md:text-8xl lg:text-9xl'
                        : 'text-5xl sm:text-6xl'
                    }`}
                    style={{ color: currentTheme.textColor }}
                  >
                    {formattedTime}
                  </div>
                  {!isFullscreen && (
                    <div
                      className="mt-1.5 text-sm sm:text-base font-medium tracking-wide drop-shadow-2xs"
                      style={{ color: currentTheme.subTextColor }}
                    >
                      {isCompleted
                        ? 'Time Completed!'
                        : sessionLabel.trim() || 'Focus Time'}
                    </div>
                  )}
                </div>
              )}

              {/* Fullscreen Exit Button in corner when fullscreen */}
              {isFullscreen && (
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="absolute top-5 right-5 z-20 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black/65 text-white text-xs font-semibold backdrop-blur-xs hover:bg-black/85 transition-colors cursor-pointer"
                  aria-label="Exit Fullscreen"
                >
                  <Minimize2 className="w-4 h-4" />
                  <span>Exit Fullscreen</span>
                </button>
              )}
            </div>
          </div>

          {/* CENTER CONTROLS COLUMN (lg:col-span-4) */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              {/* Mode Tabs: Duration | End Time */}
              <div className="grid grid-cols-2 rounded-xl bg-[#F9F1EA] dark:bg-[#222824] p-1 border border-[#EFE4D8] dark:border-[#2E3630]">
                <button
                  type="button"
                  onClick={() => setMode('duration')}
                  style={
                    mode === 'duration'
                      ? { backgroundColor: currentAccent.hex, color: '#FFFFFF' }
                      : undefined
                  }
                  className={`py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    mode === 'duration'
                      ? 'shadow-xs'
                      : 'text-[#252B27]/75 dark:text-slate-300 hover:text-[#252B27]'
                  }`}
                >
                  Duration
                </button>
                <button
                  type="button"
                  onClick={() => setMode('endTime')}
                  style={
                    mode === 'endTime'
                      ? { backgroundColor: currentAccent.hex, color: '#FFFFFF' }
                      : undefined
                  }
                  className={`py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    mode === 'endTime'
                      ? 'shadow-xs'
                      : 'text-[#252B27]/75 dark:text-slate-300 hover:text-[#252B27]'
                  }`}
                >
                  End Time
                </button>
              </div>

              {mode === 'duration' ? (
                <>
                  {/* Preset Pill Buttons: 5 min, 10 min, 25 min, 50 min, Custom */}
                  <div className="grid grid-cols-5 gap-1.5">
                    {[5, 10, 25, 50].map((m) => {
                      const isActive = !isCustomPreset && durationMinutes === m;
                      return (
                        <button
                          key={m}
                          type="button"
                          onClick={() => applyDurationMinutes(m, false)}
                          style={
                            isActive
                              ? { backgroundColor: currentAccent.hex, color: '#FFFFFF', borderColor: currentAccent.hex }
                              : undefined
                          }
                          className={`py-2 px-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                            isActive
                              ? 'shadow-2xs'
                              : 'bg-white dark:bg-[#1E2420] text-[#252B27] dark:text-slate-200 border-[#E6E1D6] dark:border-[#303832] hover:border-[#C5BEB0]'
                          }`}
                        >
                          {m} min
                        </button>
                      );
                    })}
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomPreset(true);
                        customInputRef.current?.focus();
                      }}
                      style={
                        isCustomPreset
                          ? { backgroundColor: currentAccent.hex, color: '#FFFFFF', borderColor: currentAccent.hex }
                          : undefined
                      }
                      className={`py-2 px-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        isCustomPreset
                          ? 'shadow-2xs'
                          : 'bg-white dark:bg-[#1E2420] text-[#252B27] dark:text-slate-200 border-[#E6E1D6] dark:border-[#303832] hover:border-[#C5BEB0]'
                      }`}
                    >
                      Custom
                    </button>
                  </div>

                  {/* Custom Minutes Stepper Input */}
                  <div className="flex items-center gap-3">
                    <div className="relative flex items-center w-28 bg-white dark:bg-[#1E2420] border border-[#E6E1D6] dark:border-[#303832] rounded-xl px-3 py-2">
                      <input
                        ref={customInputRef}
                        type="number"
                        min={1}
                        max={720}
                        value={durationMinutes}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          if (!Number.isNaN(val)) {
                            applyDurationMinutes(val, true);
                          }
                        }}
                        aria-label="Duration in minutes"
                        className="w-full bg-transparent text-base font-semibold text-[#252B27] dark:text-white focus:outline-none tabular-nums pr-5"
                      />
                      <div className="absolute right-2 flex flex-col">
                        <button
                          type="button"
                          aria-label="Increase minutes"
                          onClick={() => applyDurationMinutes(durationMinutes + 1, true)}
                          className="text-[#252B27]/60 hover:text-[#252B27] dark:text-slate-400 dark:hover:text-white cursor-pointer"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          aria-label="Decrease minutes"
                          onClick={() => applyDurationMinutes(Math.max(1, durationMinutes - 1), true)}
                          className="text-[#252B27]/60 hover:text-[#252B27] dark:text-slate-400 dark:hover:text-white cursor-pointer"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <span className="text-xs sm:text-sm text-[#252B27]/75 dark:text-slate-300 font-medium">
                      minutes
                    </span>
                  </div>
                </>
              ) : (
                /* End Time Mode Picker */
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-[#252B27]/75 dark:text-slate-300">
                    Select target clock time:
                  </label>
                  <input
                    type="time"
                    value={endTimeStr}
                    onChange={(e) => applyEndTime(e.target.value)}
                    className="w-full rounded-xl border border-[#E6E1D6] dark:border-[#303832] bg-white dark:bg-[#1E2420] px-3.5 py-2.5 text-sm font-semibold text-[#252B27] dark:text-white focus:outline-none"
                  />
                </div>
              )}

              {/* Session Label (optional) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[#252B27]/75 dark:text-slate-300">
                  Session Label (optional)
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={sessionLabel}
                    onChange={(e) => setSessionLabel(e.target.value)}
                    placeholder="e.g., Study Session, Morning Routine..."
                    maxLength={40}
                    className="w-full rounded-xl border border-[#E6E1D6] dark:border-[#303832] bg-white dark:bg-[#1E2420] pl-3.5 pr-9 py-2.5 text-xs sm:text-sm text-[#252B27] dark:text-white focus:outline-none focus:border-[#E65F16]"
                  />
                  {sessionLabel && (
                    <button
                      type="button"
                      aria-label="Clear session label"
                      onClick={() => setSessionLabel('')}
                      className="absolute right-2.5 text-[#252B27]/45 hover:text-[#252B27] dark:text-slate-400 dark:hover:text-white cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Primary Start / Pause Button */}
              <button
                type="button"
                onClick={isRunning ? handlePause : handleStart}
                style={{ backgroundColor: currentAccent.hex }}
                className="w-full py-3.5 px-5 rounded-xl text-white font-semibold text-sm sm:text-base shadow-sm hover:opacity-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                {isRunning ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>{remainingMs < totalMs && remainingMs > 0 ? 'Resume' : 'Start'}</span>
                  </>
                )}
              </button>

              {/* Secondary Pause & Reset Row */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={isRunning ? handlePause : handleStart}
                  className="py-2.5 px-4 rounded-xl bg-[#F9F1EA] dark:bg-[#222824] hover:bg-[#F3E5D8] dark:hover:bg-[#2A322D] text-[#252B27] dark:text-slate-200 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Pause</span>
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="py-2.5 px-4 rounded-xl bg-[#F9F1EA] dark:bg-[#222824] hover:bg-[#F3E5D8] dark:hover:bg-[#2A322D] text-[#252B27] dark:text-slate-200 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Bottom Toggles Bar: Sound Alert | Fullscreen | Show Time */}
            <div className="pt-3 border-t border-[#EFEAE0] dark:border-[#2A312C] flex flex-wrap items-center justify-between gap-2 text-xs text-[#252B27]/80 dark:text-slate-300">
              {/* Sound Alert Toggle */}
              <div className="inline-flex items-center gap-1.5">
                {soundAlert ? (
                  <Volume2 className="w-3.5 h-3.5" style={{ color: currentAccent.hex }} />
                ) : (
                  <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span>Sound Alert</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={soundAlert}
                  aria-label="Toggle sound alert"
                  onClick={() => setSoundAlert((prev) => !prev)}
                  style={{ backgroundColor: soundAlert ? currentAccent.hex : undefined }}
                  className={`w-8 h-4.5 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                    soundAlert ? '' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`w-3.5 h-3.5 rounded-full bg-white shadow-2xs transition-transform ${
                      soundAlert ? 'translate-x-3.5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Fullscreen Toggle */}
              <div className="inline-flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5 text-[#252B27]/70 dark:text-slate-300" />
                <span>Fullscreen</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={isFullscreen}
                  aria-label="Toggle fullscreen"
                  onClick={toggleFullscreen}
                  style={{ backgroundColor: isFullscreen ? currentAccent.hex : undefined }}
                  className={`w-8 h-4.5 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                    isFullscreen ? '' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`w-3.5 h-3.5 rounded-full bg-white shadow-2xs transition-transform ${
                      isFullscreen ? 'translate-x-3.5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Show Time Toggle */}
              <div className="inline-flex items-center gap-1.5">
                {showTime ? (
                  <Eye className="w-3.5 h-3.5" style={{ color: currentAccent.hex }} />
                ) : (
                  <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span>Show Time</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={showTime}
                  aria-label="Toggle time display"
                  onClick={() => setShowTime((prev) => !prev)}
                  style={{ backgroundColor: showTime ? currentAccent.hex : undefined }}
                  className={`w-8 h-4.5 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                    showTime ? '' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`w-3.5 h-3.5 rounded-full bg-white shadow-2xs transition-transform ${
                      showTime ? 'translate-x-3.5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT CUSTOMIZATION PANEL: SKY THEME & ACCENT COLOR (lg:col-span-3) */}
          <div className="lg:col-span-3 bg-[#FAF8F4] dark:bg-[#1E2420] border border-[#EAE4D7] dark:border-[#2C342E] rounded-2xl p-4 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              {/* Sky Theme 2x2 Grid */}
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-[#252B27] dark:text-white mb-2.5">
                  Sky Theme
                </h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {SKY_THEMES.map((theme) => {
                    const isSelected = theme.id === skyThemeId;
                    return (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => setSkyThemeId(theme.id)}
                        style={
                          isSelected
                            ? { borderColor: currentAccent.hex }
                            : undefined
                        }
                        className={`group rounded-xl overflow-hidden border-2 transition-all text-center bg-white dark:bg-[#181D1A] cursor-pointer ${
                          isSelected
                            ? 'shadow-xs'
                            : 'border-[#E5DFD3] dark:border-[#2E3630] hover:border-[#C9C1B2]'
                        }`}
                      >
                        {/* Mini Sky Thumbnail SVG */}
                        <div className="w-full h-15 relative overflow-hidden">
                          <svg viewBox="0 0 120 68" className="w-full h-full object-cover">
                            <defs>
                              <linearGradient id={`thumbSky_${theme.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor={theme.skyTopStart} />
                                <stop offset="55%" stopColor={theme.skyMidStart} />
                                <stop offset="100%" stopColor={theme.skyBottomStart} />
                              </linearGradient>
                            </defs>
                            <rect x="0" y="0" width="120" height="68" fill={`url(#thumbSky_${theme.id})`} />
                            {/* Mini dashed arc */}
                            <path
                              d="M 14 54 A 50 50 0 0 1 106 54"
                              fill="none"
                              stroke="#FFFFFF"
                              strokeOpacity="0.6"
                              strokeWidth="1.2"
                              strokeDasharray="3 3"
                            />
                            {/* Mini sun */}
                            <circle cx="60" cy="26" r="14" fill={theme.sunMid} opacity="0.35" />
                            <circle cx="60" cy="26" r="8.5" fill={theme.sunCore} />
                            {/* Mini mountains */}
                            <path
                              d="M 0 54 L 28 42 L 56 50 L 88 40 L 120 50 L 120 68 L 0 68 Z"
                              fill={theme.midMountain}
                            />
                            {/* Mini water */}
                            <rect x="0" y="54" width="120" height="14" fill={theme.waterBottom} opacity="0.85" />
                            <ellipse cx="60" cy="58" rx="12" ry="1.8" fill={theme.shimmerColor} opacity="0.7" />
                          </svg>
                        </div>
                        <div className="py-1.5 text-[11px] font-semibold text-[#252B27] dark:text-slate-200">
                          {theme.label}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Accent Color Row */}
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-[#252B27] dark:text-white mb-2.5">
                  Accent Color
                </h3>
                <div className="flex items-center justify-between gap-1.5">
                  {ACCENT_COLORS.map((color) => {
                    const isSelected = color.id === accentId;
                    return (
                      <button
                        key={color.id}
                        type="button"
                        aria-label={`Select ${color.label} accent color`}
                        onClick={() => setAccentId(color.id)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform cursor-pointer ${
                          isSelected ? 'scale-110 ring-2 ring-offset-2 ring-[#E65F16]' : 'hover:scale-105'
                        }`}
                        style={{
                          backgroundColor: color.hex,
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Save as Default Button */}
            <button
              type="button"
              onClick={handleSaveAsDefault}
              className="w-full py-2.5 px-4 rounded-xl border border-[#2B7A5B] text-[#2B7A5B] dark:border-[#5E917A] dark:text-[#5E917A] bg-white dark:bg-[#181D1A] hover:bg-[#EFF7F3] dark:hover:bg-[#232D27] text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {savedFeedback ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved as Default</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Save as Default</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* QUICK PRESETS SECTION */}
      <div>
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#252B27] dark:text-white">
          Quick Presets
        </h2>
        <p className="text-xs sm:text-sm text-[#252B27]/70 dark:text-slate-400 mt-0.5 mb-4">
          Start with a common time or set a custom duration.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {QUICK_PRESETS.map((preset) => {
            const isActive = !isCustomPreset && durationMinutes === preset.minutes && mode === 'duration';
            return (
              <button
                key={preset.minutes}
                type="button"
                onClick={() => {
                  setMode('duration');
                  applyDurationMinutes(preset.minutes, false);
                }}
                style={
                  isActive
                    ? {
                        borderColor: currentAccent.hex,
                        backgroundColor: currentAccent.softBg,
                      }
                    : undefined
                }
                className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  isActive
                    ? 'shadow-2xs dark:bg-[#26201B]'
                    : 'bg-white dark:bg-[#1A201C] border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#D4C5B4]'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-[#FEF6EB] dark:bg-[#2A231B] text-[#F59E0B] flex items-center justify-center shrink-0">
                  {preset.icon === 'sunrise' ? (
                    <Sunrise className="w-5 h-5" />
                  ) : (
                    <Sun className="w-5 h-5" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-xs sm:text-sm text-[#252B27] dark:text-white truncate">
                    {preset.label}
                  </div>
                  <div className="text-[11px] text-[#252B27]/65 dark:text-slate-400 truncate">
                    {preset.sub}
                  </div>
                </div>
              </button>
            );
          })}

          {/* Custom Preset Card */}
          <button
            type="button"
            onClick={() => {
              setMode('duration');
              setIsCustomPreset(true);
              customInputRef.current?.focus();
            }}
            style={
              isCustomPreset
                ? {
                    borderColor: currentAccent.hex,
                    backgroundColor: currentAccent.softBg,
                  }
                : undefined
            }
            className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
              isCustomPreset
                ? 'shadow-2xs dark:bg-[#26201B]'
                : 'bg-white dark:bg-[#1A201C] border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#D4C5B4]'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-[#FDF2E9] dark:bg-[#2A211B] text-[#E65F16] flex items-center justify-center shrink-0">
              <Settings className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-xs sm:text-sm text-[#252B27] dark:text-white truncate">
                Custom
              </div>
              <div className="text-[11px] text-[#252B27]/65 dark:text-slate-400 truncate">
                Set your own time
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* POPULAR USES SECTION */}
      <div className="rounded-3xl bg-[#F4F2EC]/80 dark:bg-[#191F1B] border border-[#E6E2D8] dark:border-[#272F2A] p-5 sm:p-6">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#252B27] dark:text-white">
          Popular Uses
        </h2>
        <p className="text-xs sm:text-sm text-[#252B27]/70 dark:text-slate-400 mt-0.5 mb-4">
          A sun timer is useful for many everyday activities.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5">
          {[
            {
              title: 'Morning Routines',
              desc: 'Start your day with focus and positivity.',
              minutes: 15,
              theme: 'morning' as SkyThemeId,
              label: 'Morning Routine',
              icon: <BookOpen className="w-5 h-5 text-[#E65F16]" />,
            },
            {
              title: 'Study Sessions',
              desc: 'Stay focused and productive.',
              minutes: 25,
              theme: 'morning' as SkyThemeId,
              label: 'Study Session',
              icon: <GraduationCap className="w-5 h-5 text-[#E65F16]" />,
            },
            {
              title: 'Work Sessions',
              desc: 'Manage time for deeper work.',
              minutes: 50,
              theme: 'midday' as SkyThemeId,
              label: 'Deep Work Session',
              icon: <Laptop className="w-5 h-5 text-[#E65F16]" />,
            },
            {
              title: 'Reading Time',
              desc: 'Enjoy a calm and distraction-free session.',
              minutes: 20,
              theme: 'warm-neutral' as SkyThemeId,
              label: 'Reading Time',
              icon: <Coffee className="w-5 h-5 text-[#E65F16]" />,
            },
            {
              title: 'Activity Transitions',
              desc: 'Great for timed activities and breaks.',
              minutes: 5,
              theme: 'midday' as SkyThemeId,
              label: 'Activity Transition',
              icon: <Activity className="w-5 h-5 text-[#E65F16]" />,
            },
            {
              title: 'Relaxation',
              desc: 'Create a peaceful environment.',
              minutes: 10,
              theme: 'sunset' as SkyThemeId,
              label: 'Relaxation Break',
              icon: <Sparkles className="w-5 h-5 text-[#E65F16]" />,
            },
          ].map((useCase) => (
            <button
              key={useCase.title}
              type="button"
              onClick={() => {
                setMode('duration');
                setSkyThemeId(useCase.theme);
                setSessionLabel(useCase.label);
                applyDurationMinutes(useCase.minutes, false);
              }}
              className="flex items-start gap-3 p-3.5 rounded-2xl bg-white dark:bg-[#1E2420] border border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#E65F16] transition-all text-left cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-[#FDF3EC] dark:bg-[#2B211A] flex items-center justify-center shrink-0 mt-0.5">
                {useCase.icon}
              </div>
              <div className="min-w-0">
                <div className="font-bold text-xs sm:text-sm text-[#252B27] dark:text-white group-hover:text-[#E65F16] transition-colors">
                  {useCase.title}
                </div>
                <p className="text-[11px] text-[#252B27]/70 dark:text-slate-400 leading-snug mt-0.5">
                  {useCase.desc}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

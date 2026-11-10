'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  Moon,
  Sun,
  ChevronUp,
  ChevronDown,
  Settings,
  BookOpen,
  GraduationCap,
  PenTool,
  Laptop,
  Sparkles,
} from 'lucide-react';
import { playTimerSound } from '@/lib/sound';

type TimerMode = 'duration' | 'endtime';
type MoonStyleId = 'classic' | 'crescent' | 'blue' | 'warm';
type BgThemeId = 'night-sky' | 'forest' | 'mountains' | 'lakeside';

interface MoonStyleConfig {
  id: MoonStyleId;
  label: string;
  litLight: string;
  litMid: string;
  litDeep: string;
  craterTint: string;
  glowColor: string;
  rimHighlight: string;
}

const MOON_STYLES: Record<MoonStyleId, MoonStyleConfig> = {
  classic: {
    id: 'classic',
    label: 'Classic Moon',
    litLight: '#FFF8E2',
    litMid: '#EAD2A2',
    litDeep: '#C29D64',
    craterTint: '#A9844F',
    glowColor: 'rgba(255, 232, 175, 0.36)',
    rimHighlight: '#FFFDF4',
  },
  crescent: {
    id: 'crescent',
    label: 'Crescent Moon',
    litLight: '#FFF9E8',
    litMid: '#DFC799',
    litDeep: '#B0905A',
    craterTint: '#947646',
    glowColor: 'rgba(245, 222, 170, 0.32)',
    rimHighlight: '#FFFFFF',
  },
  blue: {
    id: 'blue',
    label: 'Blue Moon',
    litLight: '#F0F8FF',
    litMid: '#A5CEFA',
    litDeep: '#5689C7',
    craterTint: '#3E6DA8',
    glowColor: 'rgba(135, 195, 255, 0.38)',
    rimHighlight: '#F5FAFF',
  },
  warm: {
    id: 'warm',
    label: 'Warm Moon',
    litLight: '#FFEAC2',
    litMid: '#F2AE52',
    litDeep: '#C46D1F',
    craterTint: '#9E5010',
    glowColor: 'rgba(255, 180, 85, 0.4)',
    rimHighlight: '#FFF3D6',
  },
};

interface BgThemeConfig {
  id: BgThemeId;
  label: string;
  skyGradient: string;
  horizonGlow: string;
}

const BG_THEMES: Record<BgThemeId, BgThemeConfig> = {
  'night-sky': {
    id: 'night-sky',
    label: 'Night Sky',
    skyGradient: 'linear-gradient(180deg, #060D1A 0%, #0D1B30 58%, #162B47 100%)',
    horizonGlow: 'rgba(72, 126, 196, 0.18)',
  },
  forest: {
    id: 'forest',
    label: 'Forest',
    skyGradient: 'linear-gradient(180deg, #050C14 0%, #0B1D28 60%, #132F38 100%)',
    horizonGlow: 'rgba(64, 150, 140, 0.2)',
  },
  mountains: {
    id: 'mountains',
    label: 'Mountains',
    skyGradient: 'linear-gradient(180deg, #090F20 0%, #152342 58%, #283B63 100%)',
    horizonGlow: 'rgba(130, 160, 220, 0.22)',
  },
  lakeside: {
    id: 'lakeside',
    label: 'Lakeside',
    skyGradient: 'linear-gradient(180deg, #070E1E 0%, #14223D 54%, #2D3252 82%, #111D35 100%)',
    horizonGlow: 'rgba(235, 175, 120, 0.22)',
  },
};

// Fixed starfield coordinates inside 360x360 stage
const STARS = [
  { x: 34, y: 38, r: 1.1, delay: '0s' },
  { x: 78, y: 24, r: 1.5, delay: '0.6s' },
  { x: 132, y: 18, r: 0.9, delay: '1.3s' },
  { x: 246, y: 22, r: 1.2, delay: '0.4s' },
  { x: 308, y: 36, r: 1.6, delay: '1.1s' },
  { x: 334, y: 78, r: 1.0, delay: '0.2s' },
  { x: 24, y: 108, r: 1.3, delay: '1.7s' },
  { x: 52, y: 174, r: 0.9, delay: '0.9s' },
  { x: 318, y: 146, r: 1.2, delay: '1.5s' },
  { x: 338, y: 212, r: 1.4, delay: '0.3s' },
  { x: 28, y: 238, r: 1.1, delay: '1.2s' },
  { x: 64, y: 274, r: 1.3, delay: '0.7s' },
  { x: 298, y: 266, r: 1.1, delay: '1.8s' },
  { x: 194, y: 14, r: 1.0, delay: '0.5s' },
];

/**
 * Computes an SVG path for the illuminated portion of a moon disc centered at (cx, cy) with radius r.
 * `fraction` in [0, 1] is the exact remaining illuminated proportion:
 * - fraction = 1.0 -> full circle illuminated
 * - fraction = 0.5 -> right half illuminated (vertical terminator)
 * - fraction = 0.25 -> waxing-style right crescent illuminated
 * - fraction = 0.0 -> completely dark (empty path)
 */
function buildIlluminatedMoonPath(cx: number, cy: number, r: number, fraction: number): string {
  const clamped = Math.max(0, Math.min(1, fraction));
  if (clamped <= 0.001) return '';
  if (clamped >= 0.999) {
    return `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx} ${cy + r} A ${r} ${r} 0 1 1 ${cx} ${cy - r} Z`;
  }

  // Right outer semi-circle from top (cx, cy - r) to bottom (cx, cy + r)
  // Terminator ellipse horizontal semi-axis rx varies smoothly with fraction:
  // At fraction = 0.5, rx = 0 (straight vertical line).
  // For fraction > 0.5 (gibbous), terminator bulges left (sweepFlag = 1 from bottom to top).
  // For fraction < 0.5 (crescent), terminator bulges right (sweepFlag = 0 from bottom to top).
  const k = (clamped - 0.5) * 2; // in [-1, 1]
  const rx = Math.max(0.01, Math.abs(k) * r);
  const terminatorSweep = k >= 0 ? 1 : 0;

  return [
    `M ${cx} ${cy - r}`,
    `A ${r} ${r} 0 0 1 ${cx} ${cy + r}`,
    `A ${rx.toFixed(2)} ${r} 0 0 ${terminatorSweep} ${cx} ${cy - r}`,
    'Z',
  ].join(' ');
}

export default function MoonTimerComponent() {
  const [mode, setMode] = useState<TimerMode>('duration');
  const [durationMinutes, setDurationMinutes] = useState<number>(25);
  const [endTimeStr, setEndTimeStr] = useState<string>('21:00');
  const [totalSeconds, setTotalSeconds] = useState<number>(25 * 60);
  const [remainingMs, setRemainingMs] = useState<number>(25 * 60 * 1000);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Customization
  const [moonStyle, setMoonStyle] = useState<MoonStyleId>('classic');
  const [bgTheme, setBgTheme] = useState<BgThemeId>('night-sky');
  const [brightness, setBrightness] = useState<number>(85);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showTime, setShowTime] = useState<boolean>(true);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const customInputRef = useRef<HTMLInputElement>(null);
  const endTimeRef = useRef<number | null>(null);
  const remainingMsRef = useRef<number>(25 * 60 * 1000);
  const soundEnabledRef = useRef<boolean>(true);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  // Fullscreen listener
  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // High-precision countdown loop strictly synchronized with remainingMsRef
  useEffect(() => {
    if (!isRunning) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    endTimeRef.current = performance.now() + remainingMsRef.current;

    const tick = (now: number) => {
      if (endTimeRef.current === null) return;
      const left = Math.max(0, endTimeRef.current - now);
      remainingMsRef.current = left;
      setRemainingMs(left);

      if (left <= 0) {
        remainingMsRef.current = 0;
        setIsRunning(false);
        setIsCompleted(true);
        if (soundEnabledRef.current) {
          playTimerSound('chime');
        }
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isRunning]);

  const applyPresetMinutes = (mins: number) => {
    const clamped = Math.max(1, Math.min(240, mins));
    const nextMs = clamped * 60 * 1000;
    setIsRunning(false);
    setIsCompleted(false);
    setMode('duration');
    setDurationMinutes(clamped);
    setTotalSeconds(clamped * 60);
    setRemainingMs(nextMs);
    remainingMsRef.current = nextMs;
  };

  const handleEndTimeChange = (value: string) => {
    setEndTimeStr(value);
    const [hh, mm] = value.split(':').map(Number);
    if (Number.isNaN(hh) || Number.isNaN(mm)) return;
    const now = new Date();
    const target = new Date();
    target.setHours(hh, mm, 0, 0);
    if (target.getTime() <= now.getTime()) {
      target.setDate(target.getDate() + 1);
    }
    const diffSec = Math.max(10, Math.round((target.getTime() - now.getTime()) / 1000));
    const nextMs = diffSec * 1000;
    setIsRunning(false);
    setIsCompleted(false);
    setTotalSeconds(diffSec);
    setRemainingMs(nextMs);
    remainingMsRef.current = nextMs;
  };

  const handleStartPause = () => {
    if (isCompleted || remainingMsRef.current <= 0) {
      const resetMs = totalSeconds * 1000;
      remainingMsRef.current = resetMs;
      setRemainingMs(resetMs);
      setIsCompleted(false);
      setIsRunning(true);
      return;
    }
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    const resetMs = totalSeconds * 1000;
    setIsRunning(false);
    setIsCompleted(false);
    remainingMsRef.current = resetMs;
    setRemainingMs(resetMs);
  };

  const toggleFullscreen = async () => {
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
  };

  // Active style & background
  const activeMoon = MOON_STYLES[moonStyle];
  const activeBg = BG_THEMES[bgTheme];

  // Remaining fraction strictly synchronized with timer (1.0 = start, 0.0 = completed)
  const totalMs = Math.max(1000, totalSeconds * 1000);
  const timeFraction = isCompleted
    ? 0
    : Math.min(1, Math.max(0, remainingMs / totalMs));

  // For Crescent Moon style, max illumination starts at 0.42 (a luminous crescent) and scales to 0
  // For Classic, Blue, and Warm Moon styles, illumination spans the full moon phase (or crescent-to-dark)
  // Wait: let's make sure at 100% remaining it shows a gorgeous illuminated moon (or crescent in Crescent style)
  // and smoothly sweeps the lunar shadow across in 1:1 lockstep with timeFraction down to 0!
  const maxPhase = moonStyle === 'crescent' ? 0.42 : 0.98;
  const illuminatedFraction = timeFraction * maxPhase;

  const moonCx = 180;
  const moonCy = 166;
  const moonR = 114;
  const litMoonPath = buildIlluminatedMoonPath(moonCx, moonCy, moonR, illuminatedFraction);

  // Brightness filter scale (50% to 130% around 85 default)
  const brightnessFilter = 0.65 + (brightness / 100) * 0.55;

  // Format MM:SS readout
  const totalSecondsLeft = Math.ceil(remainingMs / 1000);
  const displayMins = Math.floor(totalSecondsLeft / 60);
  const displaySecs = totalSecondsLeft % 60;
  const formattedTime = `${String(displayMins).padStart(2, '0')}:${String(displaySecs).padStart(2, '0')}`;

  return (
    <div className="space-y-10">
      {/* Main 3-Column Interactive Moon Timer Card */}
      <div className="rounded-3xl border border-[#DCE3EC] dark:border-slate-800 bg-white/95 dark:bg-[#161B18] p-4 sm:p-6 lg:p-7 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-7 items-stretch">
          {/* LEFT COLUMN (5 cols): Night Sky & Moon Visual Stage */}
          <div className="lg:col-span-5 flex">
            <div
              ref={stageRef}
              style={{
                background: activeBg.skyGradient,
                filter: `brightness(${brightnessFilter.toFixed(2)})`,
              }}
              className={`relative w-full min-h-[380px] sm:min-h-[430px] rounded-2xl border border-[#1E2E48] p-4 flex flex-col items-center justify-center overflow-hidden select-none shadow-inner ${
                isFullscreen ? 'timer-fullscreen-stage' : ''
              }`}
            >
              {/* Stage SVG: Stars, Atmospheric Glow, Moon Disc with Terminator Shadow & Horizon Scenery */}
              <svg
                viewBox="0 0 360 360"
                className={`w-full h-full ${
                  isFullscreen ? 'max-w-[85vh] max-h-[85vh]' : 'max-w-[360px] max-h-[360px]'
                }`}
                shapeRendering="geometricPrecision"
                aria-label={`Moon countdown timer showing ${formattedTime} remaining`}
              >
                <defs>
                  {/* Clip path for the circular moon disc */}
                  <clipPath id="moonDiscClip">
                    <circle cx={moonCx} cy={moonCy} r={moonR} />
                  </clipPath>

                  {/* Soft feathered filter for the lunar terminator shadow edge */}
                  <filter id="terminatorBlur" x="-15%" y="-15%" width="130%" height="130%">
                    <feGaussianBlur stdDeviation="3.2" />
                  </filter>

                  {/* Outer atmospheric halo glow */}
                  <radialGradient id="moonOuterHalo" cx="55%" cy="48%" r="55%">
                    <stop offset="0%" stopColor={activeMoon.litLight} stopOpacity="0.45" />
                    <stop offset="55%" stopColor={activeMoon.litMid} stopOpacity="0.16" />
                    <stop offset="100%" stopColor={activeMoon.litDeep} stopOpacity="0" />
                  </radialGradient>

                  {/* Lit lunar surface gradient */}
                  <radialGradient id="litMoonSurface" cx="68%" cy="42%" r="72%">
                    <stop offset="0%" stopColor={activeMoon.litLight} />
                    <stop offset="55%" stopColor={activeMoon.litMid} />
                    <stop offset="100%" stopColor={activeMoon.litDeep} />
                  </radialGradient>

                  {/* Dark earthshine lunar surface gradient */}
                  <radialGradient id="darkMoonSurface" cx="35%" cy="38%" r="75%">
                    <stop offset="0%" stopColor="#283548" />
                    <stop offset="65%" stopColor="#1B2536" />
                    <stop offset="100%" stopColor="#121A28" />
                  </radialGradient>
                </defs>

                {/* Twinkling Stars */}
                {STARS.map((st, idx) => (
                  <circle
                    key={idx}
                    cx={st.x}
                    cy={st.y}
                    r={st.r}
                    fill="#FFFFFF"
                    opacity={reducedMotion ? 0.65 : 0.8}
                    className={reducedMotion ? '' : 'animate-pulse'}
                    style={reducedMotion ? undefined : { animationDelay: st.delay, animationDuration: '3.4s' }}
                  />
                ))}

                {/* Subtle Horizon Mist Glow */}
                <ellipse
                  cx="180"
                  cy="325"
                  rx="190"
                  ry="55"
                  fill={activeBg.horizonGlow}
                />

                {/* Outer Moon Corona Glow (scales with remaining illuminated fraction) */}
                <circle
                  cx={moonCx + (1 - illuminatedFraction) * 18}
                  cy={moonCy}
                  r={moonR + 28}
                  fill="url(#moonOuterHalo)"
                  opacity={Math.max(0.15, 0.35 + illuminatedFraction * 0.65)}
                />

                {/* MOON DISC BASE (Dark Earthshine Side + Detailed Lunar Maria & Craters) */}
                <g clipPath="url(#moonDiscClip)">
                  {/* Dark side base */}
                  <circle
                    cx={moonCx}
                    cy={moonCy}
                    r={moonR}
                    fill="url(#darkMoonSurface)"
                  />

                  {/* Subtle lunar maria (seas) & craters on dark earthshine side */}
                  <g opacity="0.28" fill="#0E1522">
                    <ellipse cx="132" cy="118" rx="34" ry="24" transform="rotate(-18 132 118)" />
                    <ellipse cx="112" cy="168" rx="28" ry="36" transform="rotate(12 112 168)" />
                    <ellipse cx="158" cy="196" rx="32" ry="22" transform="rotate(-8 158 196)" />
                    <ellipse cx="205" cy="122" rx="26" ry="20" transform="rotate(22 205 122)" />
                    <ellipse cx="222" cy="168" rx="30" ry="25" transform="rotate(-14 222 168)" />
                    <circle cx="145" cy="86" r="11" />
                    <circle cx="96" cy="132" r="9" />
                    <circle cx="138" cy="236" r="14" />
                    <circle cx="196" cy="228" r="12" />
                    <circle cx="244" cy="208" r="10" />
                  </g>

                  {/* ILLUMINATED MOON PORTION (Strictly synchronized with countdown timer) */}
                  {litMoonPath && (
                    <g>
                      <path
                        d={litMoonPath}
                        fill="url(#litMoonSurface)"
                        filter="url(#terminatorBlur)"
                      />
                      <path
                        d={litMoonPath}
                        fill="url(#litMoonSurface)"
                        opacity="0.92"
                      />

                      {/* Clip craters to the illuminated portion for realistic lunar texture */}
                      <clipPath id="litPortionClip">
                        <path d={litMoonPath} />
                      </clipPath>
                      <g clipPath="url(#litPortionClip)">
                        {/* Lunar Maria on lit side */}
                        <ellipse
                          cx="132"
                          cy="118"
                          rx="34"
                          ry="24"
                          transform="rotate(-18 132 118)"
                          fill={activeMoon.craterTint}
                          opacity="0.24"
                        />
                        <ellipse
                          cx="158"
                          cy="196"
                          rx="32"
                          ry="22"
                          transform="rotate(-8 158 196)"
                          fill={activeMoon.craterTint}
                          opacity="0.22"
                        />
                        <ellipse
                          cx="205"
                          cy="122"
                          rx="26"
                          ry="20"
                          transform="rotate(22 205 122)"
                          fill={activeMoon.craterTint}
                          opacity="0.26"
                        />
                        <ellipse
                          cx="228"
                          cy="170"
                          rx="32"
                          ry="26"
                          transform="rotate(-14 228 170)"
                          fill={activeMoon.craterTint}
                          opacity="0.24"
                        />
                        {/* Crisp Crater Rings on lit side */}
                        <circle
                          cx="244"
                          cy="134"
                          r="13"
                          fill={activeMoon.craterTint}
                          fillOpacity="0.18"
                          stroke={activeMoon.litLight}
                          strokeWidth="1"
                          strokeOpacity="0.45"
                        />
                        <circle
                          cx="216"
                          cy="218"
                          r="16"
                          fill={activeMoon.craterTint}
                          fillOpacity="0.2"
                          stroke={activeMoon.litLight}
                          strokeWidth="1"
                          strokeOpacity="0.4"
                        />
                        <circle
                          cx="258"
                          cy="192"
                          r="9"
                          fill={activeMoon.craterTint}
                          fillOpacity="0.22"
                          stroke={activeMoon.litLight}
                          strokeWidth="0.8"
                          strokeOpacity="0.45"
                        />
                        <circle
                          cx="186"
                          cy="92"
                          r="10"
                          fill={activeMoon.craterTint}
                          fillOpacity="0.18"
                        />
                        <circle
                          cx="142"
                          cy="236"
                          r="12"
                          fill={activeMoon.craterTint}
                          fillOpacity="0.18"
                        />
                      </g>
                    </g>
                  )}

                  {/* Inner 3D Spherical Rim Shading */}
                  <circle
                    cx={moonCx}
                    cy={moonCy}
                    r={moonR}
                    fill="none"
                    stroke="#0A101D"
                    strokeWidth="3"
                    opacity="0.45"
                  />
                </g>

                {/* Bright Right-Limb Rim Highlight when illuminated */}
                {illuminatedFraction > 0.02 && (
                  <path
                    d={`M ${moonCx} ${moonCy - moonR} A ${moonR} ${moonR} 0 0 1 ${moonCx} ${moonCy + moonR}`}
                    fill="none"
                    stroke={activeMoon.rimHighlight}
                    strokeWidth="2"
                    opacity={Math.min(0.75, illuminatedFraction * 1.2)}
                  />
                )}

                {/* Scenic Bottom Horizon Foreground based on Background Theme */}
                {bgTheme === 'mountains' && (
                  <g>
                    <path
                      d="M -10 360 L -10 308 L 55 268 L 118 304 L 188 256 L 265 302 L 322 272 L 370 304 L 370 360 Z"
                      fill="#121E36"
                    />
                    <path
                      d="M -10 360 L 32 306 L 96 330 L 162 288 L 236 326 L 302 292 L 370 324 L 370 360 Z"
                      fill="#091122"
                    />
                  </g>
                )}

                {bgTheme === 'lakeside' && (
                  <g>
                    {/* Distant shore hills */}
                    <path
                      d="M -10 312 Q 70 286, 150 306 T 370 298 L 370 360 L -10 360 Z"
                      fill="#0B1426"
                    />
                    {/* Calm water surface with moon reflection */}
                    <rect x="0" y="310" width="360" height="50" fill="#081020" />
                    {illuminatedFraction > 0.02 && (
                      <g opacity={Math.min(0.65, 0.2 + illuminatedFraction * 0.6)}>
                        <ellipse cx="195" cy="320" rx="28" ry="2.2" fill={activeMoon.litLight} />
                        <ellipse cx="192" cy="327" rx="22" ry="1.8" fill={activeMoon.litMid} />
                        <ellipse cx="196" cy="334" rx="16" ry="1.5" fill={activeMoon.litMid} />
                        <ellipse cx="193" cy="341" rx="11" ry="1.2" fill={activeMoon.litDeep} />
                      </g>
                    )}
                  </g>
                )}

                {/* Evergreen Pine Tree Silhouettes on Left & Right Corners */}
                <g fill="#050A14">
                  {/* Left Pine Trees */}
                  <polygon points="18,286 4,322 32,322" />
                  <polygon points="18,300 0,342 36,342" />
                  <polygon points="18,316 -4,360 40,360" />

                  <polygon points="48,304 36,334 60,334" />
                  <polygon points="48,318 32,360 64,360" />

                  {/* Right Pine Trees */}
                  <polygon points="338,278 322,318 354,318" />
                  <polygon points="338,294 318,340 358,340" />
                  <polygon points="338,312 314,360 362,360" />

                  <polygon points="306,298 294,330 318,330" />
                  <polygon points="306,314 290,360 322,360" />

                  {bgTheme === 'forest' && (
                    <>
                      <polygon points="82,310 68,360 96,360" />
                      <polygon points="116,320 104,360 128,360" />
                      <polygon points="248,318 236,360 260,360" />
                      <polygon points="276,306 262,360 290,360" />
                    </>
                  )}

                  {/* Bottom ground silhouette bar */}
                  <path d="M 0 344 Q 180 330, 360 344 L 360 360 L 0 360 Z" />
                </g>
              </svg>

              {/* Central Digital Time & Label Overlay on Moon */}
              {(showTime || isFullscreen) && (
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center -mt-3 text-center">
                  <div
                    className={`font-sans font-bold tracking-tight text-white tabular-nums leading-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.65)] ${
                      isFullscreen
                        ? 'text-6xl sm:text-7xl md:text-8xl'
                        : 'text-4xl sm:text-[52px]'
                    }`}
                  >
                    {formattedTime}
                  </div>
                  {!isFullscreen && (
                    <div className="text-xs sm:text-base font-medium text-white/90 mt-2 drop-shadow-[0_1px_6px_rgba(0,0,0,0.75)]">
                      {isCompleted ? 'Completed' : 'Focus Time'}
                    </div>
                  )}
                </div>
              )}

              {/* Fullscreen Exit Button in Top-Right Corner */}
              {isFullscreen && (
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="absolute top-4 right-4 z-30 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-black/65 hover:bg-black/85 text-white text-xs font-semibold backdrop-blur-xs transition cursor-pointer"
                  aria-label="Exit Fullscreen"
                >
                  <Minimize2 className="w-4 h-4" />
                  <span>Exit Fullscreen</span>
                </button>
              )}
            </div>
          </div>

          {/* MIDDLE COLUMN (4 cols): Duration / End Time, Presets & Primary Controls */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-5 py-1">
            <div className="space-y-4">
              {/* Duration / End Time Segmented Toggle */}
              <div className="grid grid-cols-2 rounded-xl bg-[#EEF2F6] dark:bg-slate-800 p-1 border border-[#DCE3EC] dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setMode('duration')}
                  className={`py-2 rounded-lg text-xs sm:text-sm font-bold transition cursor-pointer ${
                    mode === 'duration'
                      ? 'bg-[#174578] text-white shadow-xs'
                      : 'text-[#4A5568] dark:text-slate-300 hover:text-[#1A202C] dark:hover:text-white'
                  }`}
                >
                  Duration
                </button>
                <button
                  type="button"
                  onClick={() => setMode('endtime')}
                  className={`py-2 rounded-lg text-xs sm:text-sm font-bold transition cursor-pointer ${
                    mode === 'endtime'
                      ? 'bg-[#174578] text-white shadow-xs'
                      : 'text-[#4A5568] dark:text-slate-300 hover:text-[#1A202C] dark:hover:text-white'
                  }`}
                >
                  End Time
                </button>
              </div>

              {/* Preset Minute Buttons: 5 min, 10 min, 25 min, 50 min, Custom */}
              <div className="grid grid-cols-5 gap-2">
                {[5, 10, 25, 50].map((m) => {
                  const isActive = mode === 'duration' && durationMinutes === m;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => applyPresetMinutes(m)}
                      className={`py-2 px-1 rounded-xl text-xs font-bold border transition cursor-pointer ${
                        isActive
                          ? 'bg-[#174578] text-white border-[#174578] shadow-xs'
                          : 'bg-white dark:bg-slate-900 text-[#1E293B] dark:text-slate-200 border-[#E2E8F0] dark:border-slate-700 hover:border-[#174578]/50'
                      }`}
                    >
                      {m} min
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => {
                    setMode('duration');
                    customInputRef.current?.focus();
                  }}
                  className={`py-2 px-1 rounded-xl text-xs font-bold border transition cursor-pointer ${
                    mode === 'duration' && ![5, 10, 25, 50].includes(durationMinutes)
                      ? 'bg-[#174578] text-white border-[#174578] shadow-xs'
                      : 'bg-white dark:bg-slate-900 text-[#1E293B] dark:text-slate-200 border-[#E2E8F0] dark:border-slate-700 hover:border-[#174578]/50'
                  }`}
                >
                  Custom
                </button>
              </div>

              {/* Custom Minutes Stepper Input or End Time Input */}
              {mode === 'duration' ? (
                <div className="flex items-center gap-3 pt-1">
                  <div className="relative flex items-center w-28 rounded-xl border border-[#CBD5E1] dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 shadow-2xs">
                    <input
                      ref={customInputRef}
                      type="number"
                      min={1}
                      max={240}
                      value={durationMinutes}
                      onChange={(e) => applyPresetMinutes(parseInt(e.target.value, 10) || 1)}
                      aria-label="Duration in minutes"
                      className="w-full bg-transparent text-base font-bold text-[#0F172A] dark:text-white focus:outline-none tabular-nums"
                    />
                    <div className="flex flex-col -mr-1">
                      <button
                        type="button"
                        onClick={() => applyPresetMinutes(durationMinutes + 1)}
                        aria-label="Increase minutes"
                        className="text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => applyPresetMinutes(Math.max(1, durationMinutes - 1))}
                        aria-label="Decrease minutes"
                        className="text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-[#475569] dark:text-slate-300">minutes</span>
                </div>
              ) : (
                <div className="flex items-center gap-3 pt-1">
                  <input
                    type="time"
                    value={endTimeStr}
                    onChange={(e) => handleEndTimeChange(e.target.value)}
                    aria-label="Target end time"
                    className="rounded-xl border border-[#CBD5E1] dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm font-bold text-[#0F172A] dark:text-white focus:outline-none"
                  />
                  <span className="text-xs text-[#64748B] dark:text-slate-400">Counts down to clock time</span>
                </div>
              )}
            </div>

            {/* Start / Pause / Reset Action Buttons */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleStartPause}
                className="w-full py-3.5 rounded-xl bg-[#174578] hover:bg-[#11355E] text-white font-bold text-base shadow-sm flex items-center justify-center gap-2 transition cursor-pointer"
              >
                {isRunning ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    {remainingMs < totalSeconds * 1000 && !isCompleted ? 'Resume' : 'Start'}
                  </>
                )}
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsRunning(false)}
                  disabled={!isRunning}
                  className="py-3 rounded-xl bg-[#EEF2F6] dark:bg-slate-800 hover:bg-[#E2E8F0] dark:hover:bg-slate-700 disabled:opacity-50 text-[#1E293B] dark:text-slate-200 font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Pause className="w-4 h-4" />
                  Pause
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="py-3 rounded-xl bg-[#EEF2F6] dark:bg-slate-800 hover:bg-[#E2E8F0] dark:hover:bg-slate-700 text-[#1E293B] dark:text-slate-200 font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
              </div>
            </div>

            {/* Utility Switches: Sound Alert | Fullscreen | Show Time */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#E2E8F0] dark:border-slate-800 text-[11px] sm:text-xs font-semibold text-[#334155] dark:text-slate-300">
              {/* Sound Alert */}
              <div className="flex items-center gap-1.5">
                {soundEnabled ? (
                  <Volume2 className="w-3.5 h-3.5 text-[#174578] dark:text-sky-400" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span>Sound Alert</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={soundEnabled}
                  onClick={() => setSoundEnabled((prev) => !prev)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    soundEnabled ? 'bg-[#174578]' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
                      soundEnabled ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Fullscreen */}
              <button
                type="button"
                onClick={toggleFullscreen}
                className="flex items-center gap-1.5 text-[#334155] dark:text-slate-300 hover:text-[#174578] dark:hover:text-sky-400 cursor-pointer"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-3.5 h-3.5 text-[#174578] dark:text-sky-400" />
                ) : (
                  <Maximize2 className="w-3.5 h-3.5 text-[#174578] dark:text-sky-400" />
                )}
                <span>Fullscreen</span>
              </button>

              {/* Show Time */}
              <div className="flex items-center gap-1.5">
                {showTime ? (
                  <Eye className="w-3.5 h-3.5 text-[#174578] dark:text-sky-400" />
                ) : (
                  <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span>Show Time</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={showTime}
                  onClick={() => setShowTime((prev) => !prev)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    showTime ? 'bg-[#174578]' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
                      showTime ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (3 cols): Moon Style, Background Theme, Brightness & Reduced Motion */}
          <div className="lg:col-span-3 rounded-2xl border border-[#E2E8F0] dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-900/50 p-4 flex flex-col justify-between space-y-4">
            {/* Moon Style 2x2 Grid */}
            <div>
              <h2 className="text-xs font-bold text-[#0F172A] dark:text-white mb-2">Moon Style</h2>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    { id: 'classic', label: 'Classic Moon', c1: '#FFF5D6', c2: '#C89D5C', isCrescent: false },
                    { id: 'crescent', label: 'Crescent Moon', c1: '#FFF8E5', c2: '#B89458', isCrescent: true },
                    { id: 'blue', label: 'Blue Moon', c1: '#E6F4FF', c2: '#4A82C2', isCrescent: false },
                    { id: 'warm', label: 'Warm Moon', c1: '#FFE2AD', c2: '#C76A1A', isCrescent: false },
                  ] as const
                ).map((item) => {
                  const selected = moonStyle === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setMoonStyle(item.id)}
                      className={`rounded-xl p-1.5 border text-center transition cursor-pointer ${
                        selected
                          ? 'border-[#2563EB] bg-[#EFF6FF] dark:bg-blue-950/30 ring-1 ring-[#2563EB]/30 shadow-2xs'
                          : 'border-[#E2E8F0] dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-[#94A3B8]'
                      }`}
                    >
                      <div className="h-11 w-full rounded-lg bg-[#091224] flex items-center justify-center relative overflow-hidden">
                        <svg viewBox="0 0 48 48" className="w-9 h-9">
                          <defs>
                            <radialGradient id={`thumb-${item.id}`} cx="65%" cy="38%" r="70%">
                              <stop offset="0%" stopColor={item.c1} />
                              <stop offset="100%" stopColor={item.c2} />
                            </radialGradient>
                          </defs>
                          {item.isCrescent ? (
                            <>
                              <circle cx="24" cy="24" r="15" fill="#182235" />
                              <path
                                d="M 24 9 A 15 15 0 0 1 24 39 A 9 15 0 0 0 24 9 Z"
                                fill={`url(#thumb-${item.id})`}
                              />
                            </>
                          ) : (
                            <circle cx="24" cy="24" r="15" fill={`url(#thumb-${item.id})`} />
                          )}
                        </svg>
                      </div>
                      <div className="text-[11px] font-semibold text-[#1E293B] dark:text-slate-200 mt-1">
                        {item.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Background Theme 4-Column Row */}
            <div>
              <h2 className="text-xs font-bold text-[#0F172A] dark:text-white mb-2">Background Theme</h2>
              <div className="grid grid-cols-4 gap-1.5">
                {(
                  [
                    { id: 'night-sky', label: 'Night Sky', bg: 'from-[#071022] to-[#1B355A]' },
                    { id: 'forest', label: 'Forest', bg: 'from-[#07121C] to-[#16383E]' },
                    { id: 'mountains', label: 'Mountains', bg: 'from-[#0B1329] to-[#2B4270]' },
                    { id: 'lakeside', label: 'Lakeside', bg: 'from-[#091124] via-[#2B2D4F] to-[#13223E]' },
                  ] as const
                ).map((t) => {
                  const selected = bgTheme === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setBgTheme(t.id)}
                      className={`rounded-lg p-1 border text-center transition cursor-pointer ${
                        selected
                          ? 'border-[#2563EB] bg-[#EFF6FF] dark:bg-blue-950/30 ring-1 ring-[#2563EB]/30'
                          : 'border-[#E2E8F0] dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-[#94A3B8]'
                      }`}
                    >
                      <div className={`h-8 w-full rounded bg-gradient-to-b ${t.bg} relative overflow-hidden flex items-center justify-center`}>
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FFF2C6] shadow-[0_0_6px_#FFF2C6]" />
                      </div>
                      <div className="text-[10px] font-semibold text-[#1E293B] dark:text-slate-200 mt-1 truncate">
                        {t.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Brightness Slider */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-[#0F172A] dark:text-white">Brightness</span>
              </div>
              <div className="flex items-center gap-2">
                <Sun className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <input
                  type="range"
                  min={30}
                  max={130}
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  aria-label="Moon display brightness"
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#174578]"
                />
                <Sun className="w-4 h-4 text-[#174578] dark:text-sky-400 shrink-0" />
              </div>
            </div>

            {/* Reduced Motion Switch */}
            <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0] dark:border-slate-800">
              <span className="text-xs font-bold text-[#0F172A] dark:text-white">Reduced Motion</span>
              <button
                type="button"
                role="switch"
                aria-checked={reducedMotion}
                onClick={() => setReducedMotion((prev) => !prev)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                  reducedMotion ? 'bg-[#174578]' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
                    reducedMotion ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK PRESETS SECTION */}
      <section aria-labelledby="moon-quick-presets-heading" className="space-y-4">
        <div>
          <h2
            id="moon-quick-presets-heading"
            className="font-serif text-xl sm:text-2xl font-bold text-[#1E242B] dark:text-white"
          >
            Quick Presets
          </h2>
          <p className="text-xs sm:text-sm text-[#5A6572] dark:text-slate-400 mt-0.5">
            Start with a common time or set a custom duration.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { mins: 5, title: '5 Minutes', sub: 'Short break' },
            { mins: 10, title: '10 Minutes', sub: 'Small task' },
            { mins: 25, title: '25 Minutes', sub: 'Focus time' },
            { mins: 50, title: '50 Minutes', sub: 'Deep work' },
            { mins: 90, title: '90 Minutes', sub: 'Long session' },
          ].map((preset) => {
            const active = mode === 'duration' && durationMinutes === preset.mins;
            return (
              <button
                key={preset.mins}
                type="button"
                onClick={() => applyPresetMinutes(preset.mins)}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                  active
                    ? 'border-[#2B6CB0] bg-[#F0F7FF] dark:bg-blue-950/30 shadow-2xs'
                    : 'border-[#E2E8F0] dark:border-slate-800 bg-white dark:bg-[#161B18] hover:border-[#94A3B8]'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-[#EBF3FC] dark:bg-blue-950/50 text-[#174578] dark:text-sky-400 flex items-center justify-center shrink-0">
                  <Moon className="w-4 h-4 fill-current" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-white truncate">
                    {preset.title}
                  </div>
                  <div
                    className={`text-[11px] truncate ${
                      active ? 'text-[#174578] dark:text-sky-400 font-semibold' : 'text-[#64748B] dark:text-slate-400'
                    }`}
                  >
                    {preset.sub}
                  </div>
                </div>
              </button>
            );
          })}

          {/* Custom Card */}
          <button
            type="button"
            onClick={() => {
              setMode('duration');
              customInputRef.current?.focus();
              customInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }}
            className="flex items-center gap-3 p-3.5 rounded-2xl border border-[#E2E8F0] dark:border-slate-800 bg-white dark:bg-[#161B18] hover:border-[#94A3B8] text-left transition cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-[#EBF3FC] dark:bg-blue-950/50 text-[#174578] dark:text-sky-400 flex items-center justify-center shrink-0">
              <Settings className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-white truncate">
                Custom
              </div>
              <div className="text-[11px] text-[#64748B] dark:text-slate-400 truncate">
                Set your own time
              </div>
            </div>
          </button>
        </div>
      </section>

      {/* POPULAR USES SECTION */}
      <section
        aria-labelledby="moon-popular-uses-heading"
        className="rounded-3xl bg-[#EDF2F7]/80 dark:bg-slate-900/40 border border-[#E2E8F0] dark:border-slate-800 p-5 sm:p-6 space-y-4"
      >
        <div>
          <h2
            id="moon-popular-uses-heading"
            className="font-serif text-xl sm:text-2xl font-bold text-[#1E242B] dark:text-white"
          >
            Popular Uses
          </h2>
          <p className="text-xs sm:text-sm text-[#5A6572] dark:text-slate-400 mt-0.5">
            A moon timer is great for many everyday activities.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {[
            {
              title: 'Evening Reading',
              desc: 'Enjoy a calm and focused reading time.',
              icon: <BookOpen className="w-4 h-4" />,
              mins: 25,
            },
            {
              title: 'Study Sessions',
              desc: 'Stay focused and reduce distractions.',
              icon: <GraduationCap className="w-4 h-4" />,
              mins: 50,
            },
            {
              title: 'Journaling',
              desc: 'Create a peaceful writing routine.',
              icon: <PenTool className="w-4 h-4" />,
              mins: 15,
            },
            {
              title: 'Nighttime Work',
              desc: 'Work in a calm and relaxed environment.',
              icon: <Laptop className="w-4 h-4" />,
              mins: 45,
            },
            {
              title: 'Meditation',
              desc: 'Take a mindful break and breathe.',
              icon: <Sparkles className="w-4 h-4" />,
              mins: 10,
            },
            {
              title: 'Personal Routines',
              desc: 'Build better habits every day.',
              icon: <Moon className="w-4 h-4" />,
              mins: 20,
            },
          ].map((useCase) => (
            <button
              key={useCase.title}
              type="button"
              onClick={() => applyPresetMinutes(useCase.mins)}
              className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-white dark:bg-[#161B18] border border-[#E2E8F0] dark:border-slate-800 hover:border-[#2B6CB0] text-left transition cursor-pointer shadow-2xs"
            >
              <div className="w-8 h-8 rounded-xl bg-[#EBF3FC] dark:bg-blue-950/50 text-[#174578] dark:text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                {useCase.icon}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-[#0F172A] dark:text-white leading-snug">
                  {useCase.title}
                </div>
                <p className="text-[11px] text-[#64748B] dark:text-slate-400 mt-1 leading-relaxed">
                  {useCase.desc}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  Bell,
  Eye,
  Clock,
  Settings,
  GraduationCap,
  Users,
  ChefHat,
  Coffee,
  Monitor,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { playTimerSound } from '@/lib/sound';
import { requestWakeLock, releaseWakeLock } from '@/lib/wakelock';

export type RainbowStyleId =
  | 'classic-arc'
  | 'full-circle'
  | 'filling-arc'
  | 'segmented';

export type RainbowThemeId =
  | 'classic-rainbow'
  | 'pastel'
  | 'bright'
  | 'sunset'
  | 'forest'
  | 'candy';

interface RainbowThemeConfig {
  id: RainbowThemeId;
  name: string;
  // 6 bands from outer (index 0) to inner (index 5)
  bands: [string, string, string, string, string, string];
}

const RAINBOW_THEMES: RainbowThemeConfig[] = [
  {
    id: 'classic-rainbow',
    name: 'Classic Rainbow',
    bands: ['#EE2B2B', '#F97316', '#FACC15', '#22C55E', '#1D70EB', '#7C3AED'],
  },
  {
    id: 'pastel',
    name: 'Pastel',
    bands: ['#F9A8B8', '#FDBA94', '#FDE68A', '#A7F3D0', '#BAE6FD', '#DDD6FE'],
  },
  {
    id: 'bright',
    name: 'Bright',
    bands: ['#FF004D', '#FF6B00', '#FFD600', '#00D65B', '#0084FF', '#8F00FF'],
  },
  {
    id: 'sunset',
    name: 'Sunset',
    bands: ['#B91C1C', '#DC2626', '#EA580C', '#F59E0B', '#FBBF24', '#FDE68A'],
  },
  {
    id: 'forest',
    name: 'Forest',
    bands: ['#064E3B', '#047857', '#10B981', '#65A30D', '#CA8A04', '#FACC15'],
  },
  {
    id: 'candy',
    name: 'Candy',
    bands: ['#BE185D', '#EC4899', '#F472B6', '#C084FC', '#818CF8', '#60A5FA'],
  },
];

const RAINBOW_STYLES: Array<{
  id: RainbowStyleId;
  name: string;
}> = [
  { id: 'classic-arc', name: 'Classic Arc' },
  { id: 'full-circle', name: 'Full Circle' },
  { id: 'filling-arc', name: 'Filling Arc' },
  { id: 'segmented', name: 'Segmented' },
];

const PRESET_BUTTONS = [
  { label: '1 min', minutes: 1 },
  { label: '3 min', minutes: 3 },
  { label: '5 min', minutes: 5 },
  { label: '10 min', minutes: 10 },
  { label: '15 min', minutes: 15 },
];

const QUICK_PRESET_CARDS = [
  { label: '1 Minute', sublabel: 'Quick tasks', minutes: 1, isCustom: false },
  { label: '3 Minutes', sublabel: 'Short activities', minutes: 3, isCustom: false },
  { label: '5 Minutes', sublabel: 'Focus time', minutes: 5, isCustom: false },
  { label: '10 Minutes', sublabel: 'Work breaks', minutes: 10, isCustom: false },
  { label: '15 Minutes', sublabel: 'Longer sessions', minutes: 15, isCustom: false },
  { label: 'Custom', sublabel: 'Set your own time', minutes: 20, isCustom: true },
];

const POPULAR_USES = [
  {
    title: 'Classroom Activities',
    description: 'Manage transitions and group work.',
    icon: GraduationCap,
    minutes: 5,
  },
  {
    title: 'Kids Routines',
    description: 'Make daily tasks fun and engaging.',
    icon: Users,
    minutes: 3,
  },
  {
    title: 'Focus and Study',
    description: 'Stay on task with visual time.',
    icon: ChefHat,
    minutes: 15,
  },
  {
    title: 'Breaks and Relaxation',
    description: 'Take short, mindful breaks.',
    icon: Coffee,
    minutes: 5,
  },
  {
    title: 'Presentations',
    description: 'Keep sessions on time.',
    icon: Monitor,
    minutes: 10,
  },
];

// Helper to convert polar coordinates (in degrees, where 180 is left, 90 is top, 0 is right) to SVG cartesian
function polarToCartesian(cx: number, cy: number, r: number, angleInDegrees: number) {
  const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(angleInRadians),
    y: cy - r * Math.sin(angleInRadians),
  };
}

// Builds an upper-half semicircular SVG arc path from left (180 deg) to endAngleDeg (180 -> 0)
function describeUpperArc(cx: number, cy: number, r: number, fraction: number): string {
  const clamped = Math.max(0, Math.min(1, fraction));
  if (clamped <= 0.0005) return '';
  const start = polarToCartesian(cx, cy, r, 180);
  const endAngle = 180 - clamped * 180;
  const end = polarToCartesian(cx, cy, r, endAngle);
  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${r} ${r} 0 0 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
}

// Builds a segment arc on the upper semicircle between two fractions (0 = left 180°, 1 = right 0°)
function describeUpperSegmentArc(
  cx: number,
  cy: number,
  r: number,
  startFrac: number,
  endFrac: number
): string {
  const f1 = Math.max(0, Math.min(1, startFrac));
  const f2 = Math.max(0, Math.min(1, endFrac));
  if (f2 <= f1) return '';
  const a1 = 180 - f1 * 180;
  const a2 = 180 - f2 * 180;
  const p1 = polarToCartesian(cx, cy, r, a1);
  const p2 = polarToCartesian(cx, cy, r, a2);
  return `M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} A ${r} ${r} 0 0 1 ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
}

// Miniature SVG thumbnail for the 4 Rainbow Styles in the right panel
function StyleThumbnailSVG({
  styleId,
  bands,
}: {
  styleId: RainbowStyleId;
  bands: [string, string, string, string, string, string];
}) {
  if (styleId === 'full-circle') {
    const cx = 50;
    const cy = 36;
    const radii = [27, 23.5, 20, 16.5, 13, 9.5];
    return (
      <svg viewBox="0 0 100 72" className="w-20 h-14 mx-auto select-none" aria-hidden="true">
        {radii.map((r, idx) => (
          <circle
            key={idx}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={bands[idx]}
            strokeWidth="3.6"
          />
        ))}
      </svg>
    );
  }

  if (styleId === 'filling-arc') {
    const cx = 50;
    const cy = 56;
    const radii = [38, 33.5, 29, 24.5, 20, 15.5];
    return (
      <svg viewBox="0 0 100 66" className="w-20 h-14 mx-auto select-none" aria-hidden="true">
        {radii.map((r, idx) => (
          <path
            key={`bg-${idx}`}
            d={describeUpperArc(cx, cy, r, 1)}
            fill="none"
            stroke="#E5E1D8"
            strokeWidth="4.4"
          />
        ))}
        {radii.map((r, idx) => (
          <path
            key={`fg-${idx}`}
            d={describeUpperArc(cx, cy, r, 0.72)}
            fill="none"
            stroke={bands[idx]}
            strokeWidth="4.4"
          />
        ))}
      </svg>
    );
  }

  if (styleId === 'segmented') {
    const cx = 50;
    const cy = 56;
    const radii = [38, 33.5, 29, 24.5, 20, 15.5];
    const segCount = 6;
    const gap = 0.025;
    return (
      <svg viewBox="0 0 100 66" className="w-20 h-14 mx-auto select-none" aria-hidden="true">
        {Array.from({ length: segCount }).map((_, sIdx) => {
          const sStart = sIdx / segCount + (sIdx === 0 ? 0 : gap / 2);
          const sEnd = (sIdx + 1) / segCount - (sIdx === segCount - 1 ? 0 : gap / 2);
          const isFilled = sIdx < 5;
          return radii.map((r, bIdx) => (
            <path
              key={`${sIdx}-${bIdx}`}
              d={describeUpperSegmentArc(cx, cy, r, sStart, sEnd)}
              fill="none"
              stroke={isFilled ? bands[bIdx] : '#E5E1D8'}
              strokeWidth="4.2"
            />
          ));
        })}
      </svg>
    );
  }

  // Default: Classic Arc
  const cx = 50;
  const cy = 56;
  const radii = [38, 33.5, 29, 24.5, 20, 15.5];
  return (
    <svg viewBox="0 0 100 66" className="w-20 h-14 mx-auto select-none" aria-hidden="true">
      {radii.map((r, idx) => (
        <path
          key={idx}
          d={describeUpperArc(cx, cy, r, 1)}
          fill="none"
          stroke={bands[idx]}
          strokeWidth="4.4"
        />
      ))}
    </svg>
  );
}

// Miniature SVG thumbnail for the 6 Quick Color Themes
function ThemeThumbnailSVG({
  bands,
}: {
  bands: [string, string, string, string, string, string];
}) {
  const cx = 60;
  const cy = 54;
  const radii = [42, 37, 32, 27, 22, 17];
  return (
    <svg viewBox="0 0 120 62" className="w-24 h-12 mx-auto select-none" aria-hidden="true">
      {radii.map((r, idx) => (
        <path
          key={idx}
          d={describeUpperArc(cx, cy, r, 1)}
          fill="none"
          stroke={bands[idx]}
          strokeWidth="5"
        />
      ))}
    </svg>
  );
}

// Main Interactive Rainbow Visualization SVG
function MainRainbowStageSVG({
  styleId,
  bands,
  remainingRatio,
  status,
  formattedMins,
  formattedSecs,
  showTime,
  isFullscreen,
  reducedMotion,
}: {
  styleId: RainbowStyleId;
  bands: [string, string, string, string, string, string];
  remainingRatio: number;
  status: 'idle' | 'running' | 'paused' | 'completed';
  formattedMins: string;
  formattedSecs: string;
  showTime: boolean;
  isFullscreen: boolean;
  reducedMotion: boolean;
}) {
  // For Filling Arc, progress fills from 0 to 1 as time elapses (or shows 0.78 when idle so the rainbow preview is visible)
  const displayRatio =
    styleId === 'filling-arc'
      ? status === 'idle'
        ? 0.78
        : status === 'completed'
        ? 1
        : Math.max(0, Math.min(1, 1 - remainingRatio))
      : status === 'idle'
      ? 0.78 // Matches reference mockup showing the grey track on the right and active rainbow on the left when idle, and exact 100%->0% once running
      : Math.max(0, Math.min(1, remainingRatio));

  // When running or paused, always use exact remainingRatio (or 1 - remainingRatio for filling-arc)
  const effectiveRatio =
    status === 'running' || status === 'paused' || status === 'completed'
      ? styleId === 'filling-arc'
        ? 1 - remainingRatio
        : remainingRatio
      : displayRatio;

  if (styleId === 'full-circle') {
    const cx = 220;
    const cy = 195;
    const radii = [156, 141, 126, 111, 96, 81];
    const bandWidth = 15.2;

    return (
      <svg
        viewBox="0 0 440 390"
        className={`w-full ${
          isFullscreen ? 'max-w-[84vmin] max-h-[78vmin]' : 'max-w-[420px]'
        } h-auto select-none`}
        role="img"
        aria-label={`Rainbow countdown timer showing ${formattedMins} minutes and ${formattedSecs} seconds left`}
      >
        {/* Unfilled neutral background track rings */}
        {radii.map((r, idx) => (
          <circle
            key={`track-${idx}`}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={idx % 2 === 0 ? '#EAE6DF' : '#E3DFD7'}
            strokeWidth={bandWidth}
          />
        ))}

        {/* Active 6-band rainbow rings */}
        {effectiveRatio > 0.001 &&
          radii.map((r, idx) => {
            const circumference = 2 * Math.PI * r;
            const dashOffset = circumference * (1 - effectiveRatio);
            return (
              <circle
                key={`band-${idx}`}
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke={bands[idx]}
                strokeWidth={bandWidth}
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                transform={`rotate(-90 ${cx} ${cy})`}
                className={reducedMotion ? '' : 'transition-[stroke-dashoffset] duration-150 ease-linear'}
              />
            );
          })}

        {/* Digital Readout Centered in Full Circle */}
        {showTime && (
          <g>
            <text
              x={cx}
              y={cy + 6}
              textAnchor="middle"
              className="fill-[#1D2420] dark:fill-white font-bold tabular-nums"
              style={{ fontSize: '46px', fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 700 }}
            >
              {formattedMins}:{formattedSecs}
            </text>
            <text
              x={cx}
              y={cy + 34}
              textAnchor="middle"
              className="fill-[#252B27]/75 dark:fill-slate-300 font-medium"
              style={{ fontSize: '15px', fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              Time Left
            </text>
          </g>
        )}
      </svg>
    );
  }

  if (styleId === 'segmented') {
    const cx = 220;
    const cy = 262;
    const radii = [188, 171, 154, 137, 120, 103];
    const bandWidth = 17.2;
    const segments = 12;
    const gap = 0.014;
    const activeFloat = effectiveRatio * segments;

    return (
      <svg
        viewBox="0 0 440 315"
        className={`w-full ${
          isFullscreen ? 'max-w-[86vmin] max-h-[78vmin]' : 'max-w-[440px]'
        } h-auto select-none`}
        role="img"
        aria-label={`Segmented rainbow countdown timer showing ${formattedMins} minutes and ${formattedSecs} seconds left`}
      >
        {Array.from({ length: segments }).map((_, sIdx) => {
          const sStart = sIdx / segments + (sIdx === 0 ? 0 : gap / 2);
          const sEnd = (sIdx + 1) / segments - (sIdx === segments - 1 ? 0 : gap / 2);
          const segProgress = Math.max(0, Math.min(1, activeFloat - sIdx));

          return (
            <g key={`seg-${sIdx}`}>
              {radii.map((r, bIdx) => (
                <path
                  key={`bg-${sIdx}-${bIdx}`}
                  d={describeUpperSegmentArc(cx, cy, r, sStart, sEnd)}
                  fill="none"
                  stroke={bIdx % 2 === 0 ? '#EAE6DF' : '#E3DFD7'}
                  strokeWidth={bandWidth}
                />
              ))}
              {segProgress > 0.01 &&
                radii.map((r, bIdx) => (
                  <path
                    key={`fg-${sIdx}-${bIdx}`}
                    d={describeUpperSegmentArc(
                      cx,
                      cy,
                      r,
                      sStart,
                      sStart + (sEnd - sStart) * segProgress
                    )}
                    fill="none"
                    stroke={bands[bIdx]}
                    strokeWidth={bandWidth}
                  />
                ))}
            </g>
          );
        })}

        {/* Digital Readout Under the Rainbow Arch */}
        {showTime && (
          <g>
            <text
              x={cx}
              y={cy - 14}
              textAnchor="middle"
              className="fill-[#1D2420] dark:fill-white font-bold tabular-nums"
              style={{ fontSize: '60px', fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 700 }}
            >
              {formattedMins}:{formattedSecs}
            </text>
            <text
              x={cx}
              y={cy + 20}
              textAnchor="middle"
              className="fill-[#252B27]/80 dark:fill-slate-300 font-medium"
              style={{ fontSize: '16px', fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              Time Left
            </text>
          </g>
        )}
      </svg>
    );
  }

  // Classic Arc & Filling Arc (Semicircular 6-band Rainbow Arch matching the reference mockup)
  const cx = 220;
  const cy = 262;
  const radii = [188, 171, 154, 137, 120, 103];
  const bandWidth = 17.4;

  return (
    <svg
      viewBox="0 0 440 315"
      className={`w-full ${
        isFullscreen ? 'max-w-[86vmin] max-h-[78vmin]' : 'max-w-[440px]'
      } h-auto select-none`}
      role="img"
      aria-label={`Rainbow countdown timer showing ${formattedMins} minutes and ${formattedSecs} seconds left`}
    >
      {/* Background Unfilled Rainbow Track (soft warm grey bands matching reference image) */}
      {radii.map((r, idx) => (
        <path
          key={`track-${idx}`}
          d={describeUpperArc(cx, cy, r, 1)}
          fill="none"
          stroke={idx % 2 === 0 ? '#EAE6DF' : '#E3DFD7'}
          strokeWidth={bandWidth}
        />
      ))}

      {/* Active Multicolor 6-Band Rainbow Arc */}
      {effectiveRatio > 0.001 &&
        radii.map((r, idx) => (
          <path
            key={`rainbow-${idx}`}
            d={describeUpperArc(cx, cy, r, effectiveRatio)}
            fill="none"
            stroke={bands[idx]}
            strokeWidth={bandWidth}
          />
        ))}

      {/* Digital Readout Nestled Inside the Rainbow Arch */}
      {showTime && (
        <g>
          <text
            x={cx}
            y={cy - 14}
            textAnchor="middle"
            className="fill-[#1D2420] dark:fill-white font-bold tabular-nums"
            style={{ fontSize: '60px', fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 700 }}
          >
            {formattedMins}:{formattedSecs}
          </text>
          <text
            x={cx}
            y={cy + 20}
            textAnchor="middle"
            className="fill-[#252B27]/80 dark:fill-slate-300 font-medium"
            style={{ fontSize: '16px', fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            Time Left
          </text>
        </g>
      )}
    </svg>
  );
}

export default function RainbowTimerComponent() {
  // Mode: duration vs endTime
  const [timerMode, setTimerMode] = useState<'duration' | 'endTime'>('duration');

  // Duration state (default 5 minutes matching screenshot)
  const [customMinutes, setCustomMinutes] = useState<number>(5);
  const [selectedPresetLabel, setSelectedPresetLabel] = useState<string>('5 min');
  const [totalDurationMs, setTotalDurationMs] = useState<number>(5 * 60 * 1000);
  const [remainingMs, setRemainingMs] = useState<number>(5 * 60 * 1000);
  const [status, setStatus] = useState<'idle' | 'running' | 'paused' | 'completed'>('idle');

  // Rainbow style & color theme
  const [selectedStyleId, setSelectedStyleId] = useState<RainbowStyleId>('classic-arc');
  const [selectedThemeId, setSelectedThemeId] = useState<RainbowThemeId>('classic-rainbow');

  const activeTheme =
    RAINBOW_THEMES.find((t) => t.id === selectedThemeId) || RAINBOW_THEMES[0];

  // End time input string ("HH:MM")
  const [endTimeStr, setEndTimeStr] = useState<string>(() => {
    const target = new Date(Date.now() + 5 * 60 * 1000);
    return `${String(target.getHours()).padStart(2, '0')}:${String(target.getMinutes()).padStart(2, '0')}`;
  });

  // Toggles & Accessibility settings
  const [soundAlert, setSoundAlert] = useState<boolean>(true);
  const [showTime, setShowTime] = useState<boolean>(true);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Refs for timer loop
  const toolCardRef = useRef<HTMLDivElement>(null);
  const customInputRef = useRef<HTMLInputElement>(null);
  const endTimeTimestampRef = useRef<number>(0);
  const pausedRemainingMsRef = useRef<number>(5 * 60 * 1000);

  // Manage Screen Wake Lock when running
  useEffect(() => {
    if (status === 'running') {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }
    return () => {
      releaseWakeLock();
    };
  }, [status]);

  // Apply duration in minutes
  const applyDurationMinutes = useCallback((mins: number, presetLabel: string) => {
    const clampedMins = Math.max(1, Math.min(240, Math.round(mins)));
    const ms = clampedMins * 60 * 1000;
    setCustomMinutes(clampedMins);
    setSelectedPresetLabel(presetLabel);
    setTotalDurationMs(ms);
    setRemainingMs(ms);
    pausedRemainingMsRef.current = ms;
    setStatus('idle');
  }, []);

  // Handle End Time change
  const handleEndTimeChange = (val: string) => {
    setEndTimeStr(val);
    const parts = val.split(':').map(Number);
    if (parts.length === 2 && !Number.isNaN(parts[0]) && !Number.isNaN(parts[1])) {
      const now = new Date();
      const target = new Date();
      target.setHours(parts[0], parts[1], 0, 0);
      if (target.getTime() <= now.getTime()) {
        target.setDate(target.getDate() + 1);
      }
      const diffMs = Math.max(60 * 1000, target.getTime() - now.getTime());
      setTotalDurationMs(diffMs);
      setRemainingMs(diffMs);
      pausedRemainingMsRef.current = diffMs;
      setCustomMinutes(Math.round(diffMs / 60000));
      setSelectedPresetLabel('Custom');
      setStatus('idle');
    }
  };

  // Start / Resume timer
  const handleStart = useCallback(() => {
    if (status === 'running') return;
    let startFromMs = remainingMs;
    if (status === 'completed' || startFromMs <= 0) {
      startFromMs = totalDurationMs;
      setRemainingMs(totalDurationMs);
    }
    pausedRemainingMsRef.current = startFromMs;
    endTimeTimestampRef.current = performance.now() + startFromMs;
    setStatus('running');
  }, [status, remainingMs, totalDurationMs]);

  // Pause timer
  const handlePause = useCallback(() => {
    if (status !== 'running') return;
    const left = Math.max(0, endTimeTimestampRef.current - performance.now());
    pausedRemainingMsRef.current = left;
    setRemainingMs(left);
    setStatus('paused');
  }, [status]);

  // Reset timer
  const handleReset = useCallback(() => {
    setStatus('idle');
    setRemainingMs(totalDurationMs);
    pausedRemainingMsRef.current = totalDurationMs;
  }, [totalDurationMs]);

  // Exit Fullscreen helper
  const handleExitFullscreen = useCallback(async () => {
    if (typeof document !== 'undefined' && document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch {
        // ignore
      }
    }
    try {
      const orientation = screen.orientation as unknown as { unlock?: () => void };
      if (orientation?.unlock) orientation.unlock();
    } catch {
      // ignore
    }
    setIsFullscreen(false);
  }, []);

  // Toggle Fullscreen (supports both native browser fullscreen & full-viewport overlay)
  const handleToggleFullscreen = useCallback(async () => {
    if (isFullscreen) {
      await handleExitFullscreen();
    } else {
      setIsFullscreen(true);
      if (typeof document !== 'undefined' && document.documentElement.requestFullscreen) {
        try {
          await document.documentElement.requestFullscreen();
        } catch {
          // Fallback to full-viewport overlay when iframe blocks native fullscreen
        }
      }
      try {
        const orientation = screen.orientation as unknown as { lock?: (mode: string) => Promise<void> };
        if (orientation?.lock) await orientation.lock('landscape');
      } catch {
        // ignore
      }
    }
  }, [isFullscreen, handleExitFullscreen]);

  // Sync native fullscreen change listener
  useEffect(() => {
    const onFullscreenChange = () => {
      if (typeof document !== 'undefined') {
        setIsFullscreen(Boolean(document.fullscreenElement));
      }
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  // High-precision countdown tick loop
  useEffect(() => {
    if (status !== 'running') return;

    let rafId: number;
    const tick = () => {
      const now = performance.now();
      const left = Math.max(0, endTimeTimestampRef.current - now);
      setRemainingMs(left);

      if (left <= 0) {
        setStatus('completed');
        if (soundAlert) {
          playTimerSound('chime', 0.85);
        }
        return;
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [status, soundAlert]);

  // Keyboard shortcuts (Space = Start/Pause, R = Reset, F = Fullscreen, Esc = Exit Fullscreen)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.code === 'Space') {
        e.preventDefault();
        if (status === 'running') {
          handlePause();
        } else {
          handleStart();
        }
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleReset();
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        handleToggleFullscreen();
      } else if (e.key === 'Escape' && isFullscreen) {
        e.preventDefault();
        handleExitFullscreen();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [status, isFullscreen, handleStart, handlePause, handleReset, handleToggleFullscreen, handleExitFullscreen]);

  // Format MM:SS
  const totalRemSeconds = Math.ceil(remainingMs / 1000);
  const displayMins = Math.floor(totalRemSeconds / 60);
  const displaySecs = totalRemSeconds % 60;
  const formattedMins = String(displayMins).padStart(2, '0');
  const formattedSecs = String(displaySecs).padStart(2, '0');

  const rawRemainingRatio =
    totalDurationMs > 0 ? Math.max(0, Math.min(1, remainingMs / totalDurationMs)) : 0;

  return (
    <div className="space-y-12">
      {/* MAIN RAINBOW TIMER CARD + QUICK COLOR THEMES */}
      <div
        ref={toolCardRef}
        className={`rounded-2xl border border-[#E4E1D9] dark:border-[#2D352F] bg-white dark:bg-[#1A201C] p-5 sm:p-8 shadow-xs transition-all ${
          isFullscreen
            ? 'timer-fullscreen-stage p-4 sm:p-8 bg-[#F7F6F2] dark:bg-[#141816] select-none'
            : ''
        }`}
      >
        {isFullscreen ? (
          /* =================================================================== */
          /* FULL SCREEN DISPLAY — ONLY VISUAL, TIME & EXIT IN CORNER            */
          /* =================================================================== */
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            {/* Close Fullscreen in Top-Right Corner */}
            <button
              type="button"
              onClick={handleExitFullscreen}
              className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-black/55 hover:bg-black/75 backdrop-blur-md border border-white/20 shadow-lg text-xs font-bold text-white transition-all cursor-pointer"
              aria-label="Exit Fullscreen"
            >
              <Minimize2 className="w-4 h-4" />
              <span>Exit Fullscreen</span>
            </button>

            <div className="w-full h-full max-w-6xl flex flex-col items-center justify-center my-auto px-4">
              <MainRainbowStageSVG
                styleId={selectedStyleId}
                bands={activeTheme.bands}
                remainingRatio={rawRemainingRatio}
                status={status}
                formattedMins={formattedMins}
                formattedSecs={formattedSecs}
                showTime={true}
                isFullscreen={true}
                reducedMotion={reducedMotion}
              />
            </div>
          </div>
        ) : (
          /* =================================================================== */
          /* NORMAL 3-COLUMN DISPLAY + QUICK COLOR THEMES                        */
          /* =================================================================== */
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* LEFT COLUMN (lg:col-span-5): Multicolor Rainbow Arc Stage */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center rounded-2xl bg-[#F8F7F4] dark:bg-[#1E2420] border border-[#EAE6DF] dark:border-[#2B332E] p-4 sm:p-6 min-h-[360px] relative">
                <MainRainbowStageSVG
                  styleId={selectedStyleId}
                  bands={activeTheme.bands}
                  remainingRatio={rawRemainingRatio}
                  status={status}
                  formattedMins={formattedMins}
                  formattedSecs={formattedSecs}
                  showTime={showTime}
                  isFullscreen={false}
                  reducedMotion={reducedMotion}
                />

                {!showTime && (
                  <button
                    type="button"
                    onClick={() => setShowTime(true)}
                    className="mt-2 text-xs font-semibold text-[#265641] dark:text-[#5E917A] underline cursor-pointer"
                  >
                    Show digital time
                  </button>
                )}

                {status === 'completed' && (
                  <div className="mt-2 px-4 py-1.5 rounded-full bg-[#265641] text-white text-xs font-bold tracking-wide uppercase animate-pulse">
                    Time&apos;s Up! Rainbow Complete
                  </div>
                )}
              </div>

              {/* CENTER COLUMN (lg:col-span-4): Timer Controls */}
              <div className="lg:col-span-4 space-y-5">
                {/* Duration / End Time Tabs */}
                <div className="grid grid-cols-2 rounded-xl bg-[#EFECE6] dark:bg-[#252C27] p-1 border border-[#E4E1D9] dark:border-[#2D352F]">
                  <button
                    type="button"
                    onClick={() => setTimerMode('duration')}
                    className={`py-2.5 px-4 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      timerMode === 'duration'
                        ? 'bg-[#265641] text-white shadow-2xs'
                        : 'text-[#252B27]/75 dark:text-slate-300 hover:text-[#252B27]'
                    }`}
                  >
                    Duration
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimerMode('endTime')}
                    className={`py-2.5 px-4 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      timerMode === 'endTime'
                        ? 'bg-[#265641] text-white shadow-2xs'
                        : 'text-[#252B27]/75 dark:text-slate-300 hover:text-[#252B27]'
                    }`}
                  >
                    End Time
                  </button>
                </div>

                {timerMode === 'duration' ? (
                  <>
                    {/* 1, 3, 5, 10, 15 min Preset Buttons */}
                    <div className="grid grid-cols-5 gap-2">
                      {PRESET_BUTTONS.map((preset) => {
                        const isSelected = selectedPresetLabel === preset.label;
                        return (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => applyDurationMinutes(preset.minutes, preset.label)}
                            className={`py-2 px-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer whitespace-nowrap ${
                              isSelected
                                ? 'bg-[#265641] text-white border-[#265641] shadow-2xs'
                                : 'bg-[#F9F8F5] dark:bg-[#222924] text-[#252B27] dark:text-slate-200 border-[#E4E1D9] dark:border-[#323B35] hover:border-[#365C4B]'
                            }`}
                          >
                            {preset.label}
                          </button>
                        );
                      })}
                    </div>

                    {/* Custom Minutes Stepper Input */}
                    <div className="flex items-center gap-3">
                      <div className="inline-flex items-center rounded-xl border border-[#E4E1D9] dark:border-[#323B35] bg-[#F9F8F5] dark:bg-[#222924] overflow-hidden">
                        <input
                          ref={customInputRef}
                          type="number"
                          min={1}
                          max={240}
                          aria-label="Duration in minutes"
                          value={customMinutes}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            if (!Number.isNaN(val)) {
                              applyDurationMinutes(val, 'Custom');
                            }
                          }}
                          className="w-16 py-2.5 pl-3.5 pr-1 text-base font-bold text-[#252B27] dark:text-white bg-transparent focus:outline-none tabular-nums"
                        />
                        <div className="flex flex-col border-l border-[#E4E1D9] dark:border-[#323B35] px-1.5 py-0.5">
                          <button
                            type="button"
                            aria-label="Increase minutes"
                            onClick={() => applyDurationMinutes(customMinutes + 1, 'Custom')}
                            className="text-[#252B27]/70 dark:text-slate-300 hover:text-[#365C4B] cursor-pointer"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            aria-label="Decrease minutes"
                            onClick={() =>
                              applyDurationMinutes(Math.max(1, customMinutes - 1), 'Custom')
                            }
                            className="text-[#252B27]/70 dark:text-slate-300 hover:text-[#365C4B] cursor-pointer"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-[#252B27]/75 dark:text-slate-300">
                        minutes
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <label
                      htmlFor="rainbow-end-time"
                      className="block text-xs font-semibold text-[#252B27]/75 dark:text-slate-300"
                    >
                      Select Target End Time
                    </label>
                    <input
                      id="rainbow-end-time"
                      type="time"
                      value={endTimeStr}
                      onChange={(e) => handleEndTimeChange(e.target.value)}
                      className="w-full rounded-xl border border-[#E4E1D9] dark:border-[#323B35] bg-[#F9F8F5] dark:bg-[#222924] px-4 py-2.5 text-sm font-bold text-[#252B27] dark:text-white focus:outline-none focus:border-[#365C4B]"
                    />
                  </div>
                )}

                {/* Primary Start Button */}
                <button
                  type="button"
                  onClick={status === 'running' ? handlePause : handleStart}
                  className="w-full py-3.5 px-6 rounded-xl bg-[#265641] hover:bg-[#1E4634] text-white font-bold text-base flex items-center justify-center gap-2.5 shadow-xs transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>
                    {status === 'running'
                      ? 'Running...'
                      : status === 'paused'
                      ? 'Resume'
                      : 'Start'}
                  </span>
                </button>

                {/* Secondary Pause & Reset Row */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handlePause}
                    disabled={status !== 'running'}
                    className="py-2.5 px-4 rounded-xl bg-[#EFECE6] dark:bg-[#252C27] hover:bg-[#E4E0D8] dark:hover:bg-[#2E3731] disabled:opacity-50 text-[#252B27] dark:text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Pause className="w-4 h-4 fill-current" />
                    <span>Pause</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="py-2.5 px-4 rounded-xl bg-[#EFECE6] dark:bg-[#252C27] hover:bg-[#E4E0D8] dark:hover:bg-[#2E3731] text-[#252B27] dark:text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset</span>
                  </button>
                </div>

                {/* Sound Alert / Fullscreen / Show Time Controls Row */}
                <div className="pt-2 border-t border-[#E4E1D9] dark:border-[#2D352F] flex flex-wrap items-center justify-between gap-3 text-xs font-medium text-[#252B27] dark:text-slate-200">
                  {/* Sound Alert Toggle */}
                  <div className="flex items-center gap-2">
                    <Bell className="w-3.5 h-3.5 text-[#365C4B] dark:text-[#5E917A]" />
                    <span>Sound Alert</span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={soundAlert}
                      aria-label="Toggle sound alert"
                      onClick={() => setSoundAlert((prev) => !prev)}
                      className={`w-9 h-5 rounded-full transition-colors p-0.5 cursor-pointer ${
                        soundAlert ? 'bg-[#365C4B]' : 'bg-[#D2CEC4] dark:bg-slate-600'
                      }`}
                    >
                      <span
                        className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                          soundAlert ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Fullscreen Button */}
                  <button
                    type="button"
                    onClick={handleToggleFullscreen}
                    className="inline-flex items-center gap-1.5 text-[#252B27] dark:text-slate-200 hover:text-[#365C4B] transition-colors cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-[#365C4B]" />
                    <span>Fullscreen</span>
                  </button>

                  {/* Show Time Toggle */}
                  <div className="flex items-center gap-2">
                    <Eye className="w-3.5 h-3.5 text-[#365C4B] dark:text-[#5E917A]" />
                    <span>Show Time</span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={showTime}
                      aria-label="Toggle digital time display"
                      onClick={() => setShowTime((prev) => !prev)}
                      className={`w-9 h-5 rounded-full transition-colors p-0.5 cursor-pointer ${
                        showTime ? 'bg-[#365C4B]' : 'bg-[#D2CEC4] dark:bg-slate-600'
                      }`}
                    >
                      <span
                        className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                          showTime ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Reduced Motion Toggle */}
                <div className="flex items-start gap-3 pt-1">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={reducedMotion}
                    aria-label="Toggle reduced motion"
                    onClick={() => setReducedMotion((prev) => !prev)}
                    className={`mt-0.5 w-9 h-5 rounded-full transition-colors p-0.5 shrink-0 cursor-pointer ${
                      reducedMotion ? 'bg-[#365C4B]' : 'bg-[#D2CEC4] dark:bg-slate-600'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                        reducedMotion ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                  <div>
                    <div className="text-xs font-bold text-[#252B27] dark:text-white">
                      Reduced Motion
                    </div>
                    <p className="text-[11px] text-[#252B27]/65 dark:text-slate-400 leading-snug">
                      Calm, simplified visual transitions without animated effects.
                    </p>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN (lg:col-span-3): Choose a Rainbow Style (2x2 Grid matching mockup) */}
              <div className="lg:col-span-3 rounded-2xl bg-[#F8F7F4] dark:bg-[#1E2420] border border-[#EAE6DF] dark:border-[#2B332E] p-4 sm:p-5">
                <h2 className="text-sm sm:text-base font-bold text-[#252B27] dark:text-white mb-3.5">
                  Choose a Rainbow Style
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {RAINBOW_STYLES.map((st) => {
                    const isSelected = selectedStyleId === st.id;
                    return (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setSelectedStyleId(st.id)}
                        className={`rounded-xl p-3 border text-center transition-all cursor-pointer flex flex-col items-center justify-between min-h-[112px] ${
                          isSelected
                            ? 'bg-[#EEF4F0] dark:bg-[#1E2923] border-[#365C4B] ring-1 ring-[#365C4B]/30 shadow-2xs'
                            : 'bg-white dark:bg-[#1A201C] border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#365C4B]'
                        }`}
                      >
                        <StyleThumbnailSVG styleId={st.id} bands={activeTheme.bands} />
                        <span className="mt-1.5 text-xs font-semibold text-[#252B27] dark:text-white">
                          {st.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* QUICK COLOR THEMES ROW (Matching reference screenshot) */}
            <div className="pt-4 border-t border-[#E4E1D9] dark:border-[#2D352F]">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#252B27] dark:text-white mb-0.5">
                Quick Color Themes
              </h2>
              <p className="text-xs sm:text-sm text-[#252B27]/70 dark:text-slate-400 mb-4">
                Choose a rainbow color theme that you like.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
                {RAINBOW_THEMES.map((theme) => {
                  const isSelected = selectedThemeId === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setSelectedThemeId(theme.id)}
                      className={`rounded-xl p-3.5 border text-center transition-all cursor-pointer flex flex-col items-center justify-between ${
                        isSelected
                          ? 'bg-[#EEF4F0] dark:bg-[#1E2923] border-[#365C4B] ring-1 ring-[#365C4B]/30 shadow-2xs'
                          : 'bg-[#FAF9F6] dark:bg-[#1E2420] border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#365C4B]'
                      }`}
                    >
                      <ThemeThumbnailSVG bands={theme.bands} />
                      <span className="mt-2 text-xs font-semibold text-[#252B27] dark:text-white">
                        {theme.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* QUICK PRESETS SECTION */}
      <div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252B27] dark:text-white mb-1">
          Quick Presets
        </h2>
        <p className="text-xs sm:text-sm text-[#252B27]/70 dark:text-slate-400 mb-5">
          Start with a common time or set a custom duration.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {QUICK_PRESET_CARDS.map((card) => {
            const isSelected =
              (!card.isCustom && selectedPresetLabel === `${card.minutes} min`) ||
              (card.isCustom && selectedPresetLabel === 'Custom');
            return (
              <button
                key={card.label}
                type="button"
                onClick={() => {
                  if (card.isCustom) {
                    setTimerMode('duration');
                    setSelectedPresetLabel('Custom');
                    customInputRef.current?.focus();
                  } else {
                    setTimerMode('duration');
                    applyDurationMinutes(card.minutes, `${card.minutes} min`);
                  }
                }}
                className={`text-left rounded-2xl p-4 border transition-all flex items-center gap-3.5 cursor-pointer ${
                  isSelected
                    ? 'bg-white dark:bg-[#1E2722] border-[#365C4B] shadow-xs ring-1 ring-[#365C4B]/20'
                    : 'bg-white dark:bg-[#1A201C] border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#365C4B]'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-[#FAF3E8] dark:bg-[#26231D] text-[#D97706] flex items-center justify-center shrink-0">
                  {card.isCustom ? (
                    <Settings className="w-4 h-4 text-[#365C4B]" />
                  ) : (
                    <Clock className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-[#252B27] dark:text-white">
                    {card.label}
                  </div>
                  <div className="text-[11px] text-[#252B27]/65 dark:text-slate-400">
                    {card.sublabel}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* POPULAR USES SECTION */}
      <div className="rounded-2xl bg-[#E7EDE7]/65 dark:bg-[#1C231F] border border-[#D8E2D8] dark:border-[#29332D] p-6 sm:p-8">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252B27] dark:text-white mb-1">
          Popular Uses
        </h2>
        <p className="text-xs sm:text-sm text-[#252B27]/70 dark:text-slate-400 mb-6">
          A rainbow timer is great for many everyday situations.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {POPULAR_USES.map((useItem) => {
            const IconComp = useItem.icon;
            return (
              <button
                key={useItem.title}
                type="button"
                onClick={() => {
                  setTimerMode('duration');
                  applyDurationMinutes(useItem.minutes, `${useItem.minutes} min`);
                  toolCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                className="text-left rounded-2xl bg-white dark:bg-[#1A201C] border border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#365C4B] p-4 sm:p-5 flex items-start gap-3.5 shadow-2xs transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#E7EDE7] dark:bg-[#252E28] text-[#365C4B] dark:text-[#5E917A] flex items-center justify-center shrink-0 group-hover:bg-[#365C4B] group-hover:text-white transition-colors">
                  <IconComp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-[#252B27] dark:text-white mb-1 group-hover:text-[#365C4B] transition-colors">
                    {useItem.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#252B27]/70 dark:text-slate-400 leading-relaxed">
                    {useItem.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

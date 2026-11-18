'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Coffee,
  Dumbbell,
  Brain,
  Sparkles,
  Gamepad2,
  Utensils,
  Music,
  Heart,
  Flame,
  Rocket,
  GraduationCap,
  Smile,
  Timer,
  Plus,
  Trash2,
  Share2,
  Check,
  Volume2,
  BellRing,
  Repeat,
  Wand2,
  BookmarkCheck,
  ExternalLink,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import type { VisualStyleId, BackgroundMode } from './VisualTimerComponent';
import {
  buildCustomTimerHref,
  restoreDefaultSavedTimers,
  DEFAULT_CUSTOM_TIMERS,
  PRE_SAVED_IDS,
  type CustomIconId,
  type AmbientSoundId,
  type CustomTimerItem,
} from '@/lib/custom-timers-store';

export type { CustomIconId, AmbientSoundId, CustomTimerItem };
import {
  CUSTOM_ICONS,
  AMBIENT_SOUNDS,
  CustomTimerIcon,
} from '@/components/ui/CustomTimerIcon';

export { CUSTOM_ICONS, AMBIENT_SOUNDS, CustomTimerIcon };

// ============================================================================
// 4 NEW ANIMATED VISUAL TIMER RENDERERS
// ============================================================================

interface AnimatedVisualProps {
  isFullscreen: boolean;
  remainingFraction: number;
  displayTime: string;
  displayElapsed: string;
  statusLabel: string;
  statusColorClass: string;
  showTimeText: boolean;
  showElapsedTime: boolean;
  timerColor: string;
  bgMode: BackgroundMode;
  status: 'idle' | 'running' | 'paused' | 'completed';
  remainingMs: number;
}

/**
 * 7. LIQUID WAVE VISUAL
 * Animated dual-wave vessel with rising/draining liquid and rising bubbles when running
 */
export function LiquidWaveVisual({
  isFullscreen,
  remainingFraction,
  displayTime,
  displayElapsed,
  statusLabel,
  statusColorClass,
  showTimeText,
  showElapsedTime,
  timerColor,
  bgMode,
  status,
  remainingMs,
}: AnimatedVisualProps) {
  // Phase shift for smooth wave animation while running
  const wavePhase = status === 'running' ? (remainingMs / 40) % 120 : 0;
  const fillLevelY = 20 + (1 - remainingFraction) * 175; // 20 (full) -> 195 (empty)
  const pct = Math.round(remainingFraction * 100);

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-center ${
        isFullscreen ? 'gap-6 sm:gap-14 w-full' : 'gap-6 sm:gap-10'
      }`}
    >
      <div
        className={`relative flex items-center justify-center shrink-0 ${
          isFullscreen
            ? 'w-[min(46vw,44dvh)] h-[min(56vw,54dvh)] max-w-[380px] max-h-[440px]'
            : 'w-44 h-52 sm:w-52 sm:h-64'
        }`}
      >
        <svg viewBox="0 0 200 230" className="w-full h-full drop-shadow-xs">
          <defs>
            <clipPath id="liquidVesselClip">
              <rect x="24" y="18" width="152" height="184" rx="36" />
            </clipPath>
          </defs>

          {/* Outer Glass Vessel */}
          <rect
            x="22"
            y="16"
            width="156"
            height="188"
            rx="38"
            fill={bgMode === 'dark' ? '#212A25' : '#F3F5F2'}
            stroke={bgMode === 'dark' ? '#36443B' : '#D5DDD5'}
            strokeWidth="4"
          />

          {/* Clipped Liquid & Waves */}
          <g clipPath="url(#liquidVesselClip)">
            {/* Back Wave */}
            <path
              d={`M ${-120 + wavePhase} ${fillLevelY}
                  Q ${-90 + wavePhase} ${fillLevelY - 8}, ${-60 + wavePhase} ${fillLevelY}
                  T ${0 + wavePhase} ${fillLevelY}
                  T ${60 + wavePhase} ${fillLevelY}
                  T ${120 + wavePhase} ${fillLevelY}
                  T ${180 + wavePhase} ${fillLevelY}
                  T ${240 + wavePhase} ${fillLevelY}
                  L 240 220 L -120 220 Z`}
              fill={timerColor}
              opacity="0.45"
            />
            {/* Front Wave */}
            <path
              d={`M ${-120 - wavePhase * 0.8} ${fillLevelY + 3}
                  Q ${-90 - wavePhase * 0.8} ${fillLevelY + 11}, ${-60 - wavePhase * 0.8} ${fillLevelY + 3}
                  T ${0 - wavePhase * 0.8} ${fillLevelY + 3}
                  T ${60 - wavePhase * 0.8} ${fillLevelY + 3}
                  T ${120 - wavePhase * 0.8} ${fillLevelY + 3}
                  T ${180 - wavePhase * 0.8} ${fillLevelY + 3}
                  T ${240 - wavePhase * 0.8} ${fillLevelY + 3}
                  L 240 220 L -120 220 Z`}
              fill={timerColor}
              opacity="0.9"
            />

            {/* Animated Rising Bubbles when running */}
            {status === 'running' && remainingFraction > 0.08 && (
              <g fill="#FFFFFF" opacity="0.55">
                <circle
                  cx="65"
                  cy={190 - ((wavePhase * 1.4) % Math.max(25, 185 - fillLevelY))}
                  r="4"
                />
                <circle
                  cx="105"
                  cy={195 - ((wavePhase * 1.9 + 30) % Math.max(25, 185 - fillLevelY))}
                  r="5.5"
                />
                <circle
                  cx="138"
                  cy={188 - ((wavePhase * 1.1 + 60) % Math.max(25, 185 - fillLevelY))}
                  r="3.5"
                />
              </g>
            )}
          </g>

          {/* Measurement Graduations on Glass */}
          {[0.75, 0.5, 0.25].map((mark, i) => {
            const y = 20 + (1 - mark) * 175;
            return (
              <g key={i} opacity="0.5">
                <line
                  x1="150"
                  y1={y}
                  x2="168"
                  y2={y}
                  stroke={bgMode === 'dark' ? '#FFFFFF' : '#252B27'}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </g>
            );
          })}

          {/* Percentage Pill Inside Vessel */}
          <text
            x="100"
            y="115"
            textAnchor="middle"
            className="font-mono font-bold text-lg"
            fill={remainingFraction > 0.52 ? '#FFFFFF' : bgMode === 'dark' ? '#FFFFFF' : '#252B27'}
          >
            {pct}%
          </text>
        </svg>
      </div>

      {showTimeText && (
        <div className="text-center sm:text-left">
          <span
            className={`font-bold font-mono tracking-tight tabular-nums block leading-none ${
              isFullscreen
                ? 'text-[clamp(3.25rem,16vmin,10.5rem)]'
                : 'text-5xl sm:text-6xl lg:text-7xl'
            }`}
          >
            {displayTime}
          </span>
          <span
            className={`${statusColorClass} block ${
              isFullscreen
                ? 'text-[clamp(1.05rem,2.8vmin,2rem)] mt-2.5 sm:mt-4'
                : 'text-sm sm:text-base mt-2'
            }`}
          >
            {statusLabel}
          </span>
          {showElapsedTime && (
            <span
              className={`font-mono text-[#252B27]/50 dark:text-slate-400 block ${
                isFullscreen ? 'text-[clamp(0.8rem,2vmin,1.25rem)] mt-1.5' : 'text-xs mt-1'
              }`}
            >
              Elapsed: {displayElapsed}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * 8. GROWING BLOOM VISUAL (Reverse-Anxiety Botanical Growth)
 * Grows from a seed -> sprout -> leafy stem -> full blooming flower as focus time progresses!
 */
export function PlantGrowthVisual({
  isFullscreen,
  remainingFraction,
  displayTime,
  displayElapsed,
  statusLabel,
  statusColorClass,
  showTimeText,
  showElapsedTime,
  timerColor,
  bgMode,
}: AnimatedVisualProps) {
  // Growth progress goes from 0.0 (start) -> 1.0 (completed)
  const growth = Math.max(0, Math.min(1, 1 - remainingFraction));
  const stemHeight = 20 + growth * 95; // 20px to 115px tall
  const stemTopY = 165 - stemHeight;
  const leaf1Scale = Math.max(0, Math.min(1, (growth - 0.15) * 2.5));
  const leaf2Scale = Math.max(0, Math.min(1, (growth - 0.4) * 2.5));
  const bloomScale = Math.max(0, Math.min(1, (growth - 0.65) * 2.85));

  const stageName =
    growth >= 0.98
      ? 'Full Bloom Reached!'
      : growth >= 0.65
      ? 'Flower Blooming'
      : growth >= 0.3
      ? 'Growing Leaves'
      : 'Sprouting Seed';

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-center ${
        isFullscreen ? 'gap-6 sm:gap-14 w-full' : 'gap-6 sm:gap-10'
      }`}
    >
      <div
        className={`relative flex items-center justify-center shrink-0 ${
          isFullscreen
            ? 'w-[min(48vw,46dvh)] h-[min(54vw,52dvh)] max-w-[380px] max-h-[420px]'
            : 'w-44 h-52 sm:w-52 sm:h-60'
        }`}
      >
        <svg viewBox="0 0 200 220" className="w-full h-full">
          {/* Subtle Sun Aura behind plant */}
          <circle
            cx="100"
            cy="95"
            r={38 + growth * 36}
            fill={timerColor}
            opacity={0.08 + growth * 0.1}
          />

          {/* Terracotta Pot / Soil Base */}
          <path
            d="M 64 165 L 136 165 L 126 204 C 125 207 122 209 118 209 L 82 209 C 78 209 75 207 74 204 Z"
            fill="#C86D51"
          />
          <rect x="58" y="157" width="84" height="10" rx="5" fill="#D97B5E" />
          <ellipse cx="100" cy="165" rx="34" ry="5" fill="#4A3525" />

          {/* Growing Main Stem */}
          <path
            d={`M 100 165 Q ${100 - growth * 6} ${165 - stemHeight * 0.5} 100 ${stemTopY}`}
            fill="none"
            stroke={timerColor}
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* Left Leaf */}
          {leaf1Scale > 0 && (
            <g
              transform={`translate(98, ${165 - stemHeight * 0.38}) scale(${leaf1Scale})`}
            >
              <path
                d="M 0 0 C -22 -14 -34 -4 -26 10 C -18 20 -4 10 0 0 Z"
                fill={timerColor}
              />
            </g>
          )}

          {/* Right Leaf */}
          {leaf2Scale > 0 && (
            <g
              transform={`translate(102, ${165 - stemHeight * 0.65}) scale(${leaf2Scale})`}
            >
              <path
                d="M 0 0 C 22 -14 34 -4 26 10 C 18 20 4 10 0 0 Z"
                fill={timerColor}
              />
            </g>
          )}

          {/* Top Flower Bloom */}
          {bloomScale > 0 && (
            <g transform={`translate(100, ${stemTopY}) scale(${bloomScale})`}>
              {[0, 60, 120, 180, 240, 300].map((deg) => (
                <ellipse
                  key={deg}
                  cx="0"
                  cy="-16"
                  rx="9"
                  ry="15"
                  fill="#F28B82"
                  transform={`rotate(${deg})`}
                />
              ))}
              <circle cx="0" cy="0" r="10" fill="#F6AD55" />
            </g>
          )}

          {/* Growth Stage Caption */}
          <text
            x="100"
            y="24"
            textAnchor="middle"
            className="text-[11px] font-semibold uppercase tracking-wider"
            fill={bgMode === 'dark' ? '#A3B8AC' : '#365C4B'}
          >
            {stageName} ({Math.round(growth * 100)}%)
          </text>
        </svg>
      </div>

      {showTimeText && (
        <div className="text-center sm:text-left">
          <span
            className={`font-bold font-mono tracking-tight tabular-nums block leading-none ${
              isFullscreen
                ? 'text-[clamp(3.25rem,16vmin,10.5rem)]'
                : 'text-5xl sm:text-6xl lg:text-7xl'
            }`}
          >
            {displayTime}
          </span>
          <span
            className={`${statusColorClass} block ${
              isFullscreen
                ? 'text-[clamp(1.05rem,2.8vmin,2rem)] mt-2.5 sm:mt-4'
                : 'text-sm sm:text-base mt-2'
            }`}
          >
            {statusLabel}
          </span>
          {showElapsedTime && (
            <span
              className={`font-mono text-[#252B27]/50 dark:text-slate-400 block ${
                isFullscreen ? 'text-[clamp(0.8rem,2vmin,1.25rem)] mt-1.5' : 'text-xs mt-1'
              }`}
            >
              Elapsed: {displayElapsed}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * 9. ENERGY BATTERY CELLS VISUAL
 * 10 segmented high-contrast power bars with dynamic color shift & percentage
 */
export function BatteryChargeVisual({
  isFullscreen,
  remainingFraction,
  displayTime,
  displayElapsed,
  statusLabel,
  statusColorClass,
  showTimeText,
  showElapsedTime,
  timerColor,
  bgMode,
  status,
}: AnimatedVisualProps) {
  const totalCells = 10;
  const activeCells = Math.ceil(remainingFraction * totalCells);
  const pct = Math.round(remainingFraction * 100);
  const cellColor =
    remainingFraction <= 0.15
      ? '#D94343'
      : remainingFraction <= 0.35
      ? '#E06A3B'
      : timerColor;

  return (
    <div
      className={`w-full flex flex-col items-center justify-center px-2 sm:px-6 ${
        isFullscreen ? 'max-w-[min(92vw,1120px)] space-y-6 sm:space-y-8' : 'max-w-[460px] space-y-5'
      }`}
    >
      {showTimeText && (
        <div className="text-center">
          <span
            className={`font-bold font-mono tracking-tight tabular-nums block leading-none ${
              isFullscreen
                ? 'text-[clamp(3.5rem,18vmin,12rem)]'
                : 'text-6xl sm:text-7xl lg:text-8xl'
            }`}
          >
            {displayTime}
          </span>
          <span
            className={`${statusColorClass} block ${
              isFullscreen
                ? 'text-[clamp(1.05rem,2.8vmin,2rem)] mt-2.5 sm:mt-4'
                : 'text-sm sm:text-base mt-2'
            }`}
          >
            {statusLabel} · {pct}% Energy
          </span>
          {showElapsedTime && (
            <span
              className={`font-mono text-[#252B27]/50 dark:text-slate-400 block ${
                isFullscreen ? 'text-[clamp(0.8rem,2vmin,1.25rem)] mt-1.5' : 'text-xs mt-1'
              }`}
            >
              Elapsed: {displayElapsed}
            </span>
          )}
        </div>
      )}

      {/* Battery Chassis + Terminal Cap */}
      <div className="w-full flex items-center justify-center gap-1.5 sm:gap-2">
        <div
          className={`flex-1 grid grid-cols-10 gap-1.5 sm:gap-2.5 p-2.5 sm:p-4 rounded-2xl sm:rounded-3xl border-2 ${
            bgMode === 'dark'
              ? 'bg-[#212A25] border-[#36443B]'
              : 'bg-[#F3F5F2] border-[#D5DDD5]'
          }`}
        >
          {Array.from({ length: totalCells }).map((_, idx) => {
            const isLit = idx < activeCells && remainingFraction > 0;
            const isTopActiveCell = idx === activeCells - 1 && status === 'running';
            return (
              <div
                key={idx}
                className={` rounded-lg sm:rounded-xl transition-all duration-300 ${
                  isFullscreen ? 'h-[clamp(3.25rem,11dvh,6.5rem)]' : 'h-12 sm:h-16'
                } ${isTopActiveCell ? 'animate-pulse' : ''}`}
                style={{
                  backgroundColor: isLit
                    ? cellColor
                    : bgMode === 'dark'
                    ? '#181F1B'
                    : '#E4EAE4',
                  boxShadow: isLit ? `0 0 12px ${cellColor}44` : 'none',
                }}
              />
            );
          })}
        </div>
        {/* Positive Battery Terminal Nub */}
        <div
          className={`rounded-r-lg ${
            isFullscreen ? 'w-3 sm:w-4 h-10 sm:h-14' : 'w-2.5 h-8'
          } ${bgMode === 'dark' ? 'bg-[#36443B]' : 'bg-[#D5DDD5]'}`}
        />
      </div>
    </div>
  );
}

/**
 * 10. ZEN BREATHING ORB VISUAL
 * Concentric harmonic rings that gently expand (4s Inhale) and contract (4s Exhale)
 */
export function BreathingOrbVisual({
  isFullscreen,
  remainingFraction,
  displayTime,
  displayElapsed,
  statusLabel,
  statusColorClass,
  showTimeText,
  showElapsedTime,
  timerColor,
  status,
  remainingMs,
}: AnimatedVisualProps) {
  // 8-second full breath cycle (4000ms inhale, 4000ms exhale)
  const cycleMs = remainingMs % 8000;
  const isInhaling = cycleMs >= 4000; // Since remainingMs counts down
  const breathProgress = isInhaling
    ? (8000 - cycleMs) / 4000 // 0 -> 1 expanding
    : cycleMs / 4000; // 1 -> 0 contracting
  const orbScale = status === 'running' ? 0.78 + breathProgress * 0.28 : 0.9;
  const breathLabel =
    status === 'running' ? (isInhaling ? 'Breathe In...' : 'Breathe Out...') : statusLabel;

  return (
    <div
      className={`relative flex items-center justify-center ${
        isFullscreen
          ? 'w-[min(86vw,70dvh)] h-[min(86vw,70dvh)] max-w-[780px] max-h-[780px]'
          : 'w-full max-w-[300px] sm:max-w-[360px] lg:max-w-[400px] aspect-square'
      }`}
    >
      <svg viewBox="0 0 240 240" className="w-full h-full">
        {/* Outer Breathing Aura Ring */}
        <circle
          cx="120"
          cy="120"
          r={96 * orbScale}
          fill={timerColor}
          opacity="0.12"
        />
        {/* Middle Harmonic Ring */}
        <circle
          cx="120"
          cy="120"
          r={78 * orbScale}
          fill={timerColor}
          opacity="0.22"
        />
        {/* Inner Core Orb */}
        <circle
          cx="120"
          cy="120"
          r={58 * orbScale}
          fill={timerColor}
          opacity="0.35"
        />
        {/* Countdown Progress Perimeter Ring */}
        <circle
          cx="120"
          cy="120"
          r="106"
          fill="none"
          stroke={timerColor}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={2 * Math.PI * 106}
          strokeDashoffset={2 * Math.PI * 106 * (1 - remainingFraction)}
          transform="rotate(-90 120 120)"
          opacity="0.85"
        />
      </svg>

      {showTimeText && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-6">
          <span
            className={`font-bold font-mono tracking-tight tabular-nums leading-none ${
              isFullscreen
                ? 'text-[clamp(2.75rem,14vmin,9rem)]'
                : 'text-5xl sm:text-6xl lg:text-7xl'
            }`}
          >
            {displayTime}
          </span>
          <span
            className={`${statusColorClass} ${
              isFullscreen
                ? 'text-[clamp(1rem,2.8vmin,2rem)] mt-2.5 sm:mt-4'
                : 'text-sm sm:text-base mt-2'
            }`}
          >
            {breathLabel}
          </span>
          {showElapsedTime && (
            <span
              className={`font-mono text-[#252B27]/50 dark:text-slate-400 ${
                isFullscreen ? 'text-[clamp(0.8rem,2vmin,1.25rem)] mt-1.5' : 'text-xs mt-1'
              }`}
            >
              Elapsed: {displayElapsed}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// CUSTOM & LIKED TIMERS STUDIO COMPONENT
// ============================================================================

interface VisualTimerCustomStudioProps {
  customTimers: CustomTimerItem[];
  activeCustomId: string | null;
  onSelectCustomTimer: (item: CustomTimerItem) => void;
  onToggleLikeTimer: (id: string) => void;
  onDeleteCustomTimer: (id: string) => void;
  onCreateCustomTimer: (newItem: CustomTimerItem) => void;
  onSaveCurrentAsCustom: (title: string, icon: CustomIconId) => void;
  onShareActiveTimer: () => void;
  shareCopied: boolean;
  // Active smart power-ups state & setters
  halfwayChime: boolean;
  setHalfwayChime: React.Dispatch<React.SetStateAction<boolean>>;
  oneMinWarning: boolean;
  setOneMinWarning: React.Dispatch<React.SetStateAction<boolean>>;
  countdown321: boolean;
  setCountdown321: React.Dispatch<React.SetStateAction<boolean>>;
  autoBreakSec: number;
  setAutoBreakSec: React.Dispatch<React.SetStateAction<number>>;
  ambientSound: AmbientSoundId;
  setAmbientSound: React.Dispatch<React.SetStateAction<AmbientSoundId>>;
  timerColor: string;
  bgMode: BackgroundMode;
  currentVisualStyle: VisualStyleId;
  currentDurationSec: number;
}

export default function VisualTimerCustomStudio({
  customTimers,
  activeCustomId,
  onSelectCustomTimer,
  onToggleLikeTimer,
  onDeleteCustomTimer,
  onCreateCustomTimer,
  onShareActiveTimer,
  shareCopied,
  halfwayChime,
  setHalfwayChime,
  oneMinWarning,
  setOneMinWarning,
  countdown321,
  setCountdown321,
  autoBreakSec,
  setAutoBreakSec,
  ambientSound,
  setAmbientSound,
  timerColor,
  bgMode,
  currentVisualStyle,
  currentDurationSec,
}: VisualTimerCustomStudioProps) {
  const [filterTab, setFilterTab] = useState<'all' | 'liked'>('all');
  const [showBuilder, setShowBuilder] = useState<boolean>(false);

  // Builder form state
  const [draftTitle, setDraftTitle] = useState<string>('');
  const [draftSubtitle, setDraftSubtitle] = useState<string>('');
  const [draftIcon, setDraftIcon] = useState<CustomIconId>('brain');
  const [draftMinutes, setDraftMinutes] = useState<number>(Math.max(1, Math.round(currentDurationSec / 60)));
  const [draftSeconds, setDraftSeconds] = useState<number>(currentDurationSec % 60);
  const [draftStyle, setDraftStyle] = useState<VisualStyleId>(currentVisualStyle);
  const [draftColor, setDraftColor] = useState<string>(timerColor);
  const [draftBreakMin, setDraftBreakMin] = useState<number>(0);

  const likedCount = customTimers.filter((t) => t.liked).length;
  const displayedTimers =
    filterTab === 'liked' ? customTimers.filter((t) => t.liked) : customTimers;

  const openBuilderWithCurrent = () => {
    setDraftMinutes(Math.floor(currentDurationSec / 60));
    setDraftSeconds(currentDurationSec % 60);
    setDraftStyle(currentVisualStyle);
    setDraftColor(timerColor);
    setDraftBreakMin(Math.round(autoBreakSec / 60));
    setShowBuilder((prev) => !prev);
  };

  const handleSaveNewTimer = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = draftTitle.trim() || 'My Custom Focus Timer';
    const totalSec = Math.max(5, draftMinutes * 60 + draftSeconds);
    const newItem: CustomTimerItem = {
      id: `custom-${Date.now()}`,
      title: cleanTitle,
      subtitle:
        draftSubtitle.trim() ||
        `Custom ${Math.floor(totalSec / 60)}m ${totalSec % 60 > 0 ? `${totalSec % 60}s ` : ''}visual timer`,
      icon: draftIcon,
      durationSec: totalSec,
      visualStyle: draftStyle,
      color: draftColor,
      liked: true,
      halfwayChime,
      oneMinWarning,
      countdown321,
      autoBreakSec: draftBreakMin * 60,
      ambientSound,
    };
    onCreateCustomTimer(newItem);
    setDraftTitle('');
    setDraftSubtitle('');
    setShowBuilder(false);
  };

  const cardSurface =
    bgMode === 'dark'
      ? 'border-[#2A342D] bg-[#212A25]'
      : bgMode === 'auto'
      ? 'border-[#E4E1D9] dark:border-[#2A342D] bg-[#F7F6F2] dark:bg-[#212A25]'
      : 'border-[#E4E1D9] bg-[#F7F6F2]';

  return (
    <div className="mt-10 pt-8 border-t border-[#E4E1D9] dark:border-[#2A342D] space-y-8">
      {/* ================================================================= */}
      {/* PART A: SMART TIMER POWER-UPS (FEATURES OTHER SITES LACK)         */}
      {/* ================================================================= */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#252B27] dark:text-white flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-[#365C4B] dark:text-[#70B393]" />
              <span>Smart Focus & Sensory Power-Ups</span>
            </h3>
            <p className="text-xs text-[#252B27]/65 dark:text-slate-400 mt-0.5">
              Solve time-blindness with milestone chimes, auto-break chaining, and Web Audio focus soundscapes.
            </p>
          </div>

          <button
            type="button"
            onClick={onShareActiveTimer}
            className={`px-3.5 py-2 rounded-xl border text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shrink-0 ${cardSurface} hover:border-[#365C4B]`}
          >
            {shareCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#365C4B]" />
                <span>Share Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 opacity-80" />
                <span>Share Custom Timer Link</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* 1. Milestone Chimes Card */}
          <div className={`p-3.5 rounded-2xl border ${cardSurface} flex flex-col justify-between gap-2.5`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold flex items-center gap-1.5">
                <BellRing className="w-3.5 h-3.5 text-[#365C4B] dark:text-[#70B393]" />
                <span>50% Halfway Chime</span>
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={halfwayChime}
                onClick={() => setHalfwayChime((prev) => !prev)}
                className={`w-9 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors ${
                  halfwayChime ? 'bg-[#365C4B]' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-xs transform transition-transform ${
                    halfwayChime ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            <p className="text-[11px] text-[#252B27]/65 dark:text-slate-400">
              Soft chime at the halfway point so you never lose track of time.
            </p>
          </div>

          {/* 2. 1-Minute Warning & 3-2-1 Tick */}
          <div className={`p-3.5 rounded-2xl border ${cardSurface} flex flex-col justify-between gap-2`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold">Last 60s Warning</span>
              <button
                type="button"
                role="switch"
                aria-checked={oneMinWarning}
                onClick={() => setOneMinWarning((prev) => !prev)}
                className={`w-9 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors ${
                  oneMinWarning ? 'bg-[#365C4B]' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-xs transform transition-transform ${
                    oneMinWarning ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-black/5 dark:border-white/5">
              <span className="text-xs font-bold">Final 3-2-1 Pips</span>
              <button
                type="button"
                role="switch"
                aria-checked={countdown321}
                onClick={() => setCountdown321((prev) => !prev)}
                className={`w-9 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors ${
                  countdown321 ? 'bg-[#365C4B]' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-xs transform transition-transform ${
                    countdown321 ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* 3. Auto-Chain Follow-up Break Timer */}
          <div className={`p-3.5 rounded-2xl border ${cardSurface} flex flex-col justify-between gap-2`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold flex items-center gap-1.5">
                <Repeat className="w-3.5 h-3.5 text-[#365C4B] dark:text-[#70B393]" />
                <span>Auto-Break Chain</span>
              </span>
              <span className="text-[11px] font-mono font-bold text-[#365C4B] dark:text-[#70B393]">
                {autoBreakSec > 0 ? `${Math.round(autoBreakSec / 60)}m Rest` : 'Off'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 pt-1">
              {[0, 120, 300, 600].map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => setAutoBreakSec(sec)}
                  className={`flex-1 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                    autoBreakSec === sec
                      ? 'text-white shadow-2xs'
                      : 'bg-black/5 dark:bg-white/5 text-[#252B27]/75 dark:text-slate-300 hover:bg-black/10'
                  }`}
                  style={{
                    backgroundColor: autoBreakSec === sec ? timerColor : undefined,
                  }}
                >
                  {sec === 0 ? 'Off' : `${sec / 60}m`}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Ambient Focus Soundscape */}
          <div className={`p-3.5 rounded-2xl border ${cardSurface} flex flex-col justify-between gap-2`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-[#365C4B] dark:text-[#70B393]" />
                <span>Focus Soundscape</span>
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 pt-0.5">
              {AMBIENT_SOUNDS.map((snd) => (
                <button
                  key={snd.id}
                  type="button"
                  onClick={() => setAmbientSound(snd.id)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-semibold truncate transition-all cursor-pointer ${
                    ambientSound === snd.id
                      ? 'text-white shadow-2xs'
                      : 'bg-black/5 dark:bg-white/5 text-[#252B27]/75 dark:text-slate-300 hover:bg-black/10'
                  }`}
                  style={{
                    backgroundColor: ambientSound === snd.id ? timerColor : undefined,
                  }}
                  title={snd.desc}
                >
                  {snd.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* PART B: MY CUSTOM & LIKED TIMERS GALLERY + BUILDER                */}
      {/* ================================================================= */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm sm:text-base font-bold text-[#252B27] dark:text-white">
              My Interest & Liked Timers
            </h3>
            <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-[#365C4B]/10 text-[#365C4B] dark:bg-[#365C4B]/30 dark:text-[#8CD4B2]">
              {customTimers.length} Saved
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Restore Pre-Saved Timers if any defaults were deleted */}
            {DEFAULT_CUSTOM_TIMERS.some((d) => !customTimers.some((c) => c.id === d.id)) && (
              <button
                type="button"
                onClick={() => restoreDefaultSavedTimers()}
                className={`px-3 py-2 rounded-xl border text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shrink-0 ${cardSurface} hover:border-[#365C4B]`}
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#365C4B] dark:text-[#70B393]" />
                <span>Restore Pre-Saved</span>
              </button>
            )}

            {/* Filter Tabs: All vs Liked */}
            <div className={`p-1 rounded-xl flex items-center gap-1 border ${cardSurface}`}>
              <button
                type="button"
                onClick={() => setFilterTab('all')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filterTab === 'all'
                    ? 'bg-white dark:bg-[#181F1B] text-[#252B27] dark:text-white shadow-2xs'
                    : 'text-[#252B27]/65 dark:text-slate-400'
                }`}
              >
                All ({customTimers.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterTab('liked')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition-all cursor-pointer ${
                  filterTab === 'liked'
                    ? 'bg-white dark:bg-[#181F1B] text-[#D93B8A] shadow-2xs'
                    : 'text-[#252B27]/65 dark:text-slate-400'
                }`}
              >
                <Heart className="w-3 h-3 fill-current text-[#D93B8A]" />
                <span>Liked ({likedCount})</span>
              </button>
            </div>

            {/* + Create Custom Timer Button */}
            <button
              type="button"
              onClick={openBuilderWithCurrent}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-white inline-flex items-center gap-1.5 shadow-2xs transition-opacity hover:opacity-95 cursor-pointer whitespace-nowrap shrink-0"
              style={{ backgroundColor: timerColor }}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showBuilder ? 'Close Builder' : 'Create Custom Timer'}</span>
            </button>
          </div>
        </div>

        {/* INLINE CUSTOM TIMER BUILDER */}
        {showBuilder && (
          <form
            onSubmit={handleSaveNewTimer}
            className={`mb-6 p-4 sm:p-6 rounded-2xl border-2 border-[#365C4B]/40 space-y-4 ${cardSurface}`}
          >
            <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <BookmarkCheck className="w-4 h-4 text-[#365C4B] dark:text-[#70B393]" />
                <h4 className="text-sm font-bold">Build Your Own Custom Visual Timer</h4>
              </div>
              <span className="text-[11px] text-[#252B27]/60 dark:text-slate-400">
                Saves automatically to your browser & Liked list
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Title & Note */}
              <div className="md:col-span-5 space-y-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Timer Title / Interest Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Pomodoro Study, Tea Steep, Plank Hold..."
                    value={draftTitle}
                    onChange={(e) => setDraftTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E4E1D9] dark:border-[#2A342D] bg-white dark:bg-[#181F1B] text-xs sm:text-sm font-medium outline-hidden focus:border-[#365C4B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Goal or Motivation Note (shown on stage)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Stay focused until the flower blooms!"
                    value={draftSubtitle}
                    onChange={(e) => setDraftSubtitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E4E1D9] dark:border-[#2A342D] bg-white dark:bg-[#181F1B] text-xs font-medium outline-hidden focus:border-[#365C4B]"
                  />
                </div>
              </div>

              {/* Duration + Visual Style + Auto Break */}
              <div className="md:col-span-7 space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1">Minutes</label>
                    <input
                      type="number"
                      min={0}
                      max={240}
                      value={draftMinutes}
                      onChange={(e) => setDraftMinutes(Math.max(0, parseInt(e.target.value, 10) || 0))}
                      className="w-full px-3 py-2 rounded-xl border border-[#E4E1D9] dark:border-[#2A342D] bg-white dark:bg-[#181F1B] font-mono text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Seconds</label>
                    <input
                      type="number"
                      min={0}
                      max={59}
                      value={draftSeconds}
                      onChange={(e) => setDraftSeconds(Math.max(0, Math.min(59, parseInt(e.target.value, 10) || 0)))}
                      className="w-full px-3 py-2 rounded-xl border border-[#E4E1D9] dark:border-[#2A342D] bg-white dark:bg-[#181F1B] font-mono text-sm font-bold"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-semibold mb-1">Animated Visual</label>
                    <select
                      value={draftStyle}
                      onChange={(e) => setDraftStyle(e.target.value as VisualStyleId)}
                      className="w-full px-2.5 py-2 rounded-xl border border-[#E4E1D9] dark:border-[#2A342D] bg-white dark:bg-[#181F1B] text-xs font-semibold"
                    >
                      <option value="circular">Circular Ring</option>
                      <option value="plant-growth">Growing Bloom (New)</option>
                      <option value="liquid-wave">Liquid Wave (New)</option>
                      <option value="breathing-orb">Zen Breathing Orb (New)</option>
                      <option value="battery-charge">Energy Battery (New)</option>
                      <option value="progress-bar">Progress Bar</option>
                      <option value="hourglass">Flowing Hourglass</option>
                      <option value="traffic-light">Traffic Light</option>
                      <option value="rainbow">Rainbow Arcs</option>
                      <option value="minimal-digital">Minimal Digital</option>
                    </select>
                  </div>
                </div>

                {/* Choose Custom Icon */}
                <div>
                  <label className="block text-xs font-semibold mb-1.5">
                    Choose Custom Activity Icon
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {CUSTOM_ICONS.map((ic) => (
                      <button
                        key={ic.id}
                        type="button"
                        onClick={() => setDraftIcon(ic.id)}
                        className={`px-2.5 py-1.5 rounded-xl border text-xs font-medium inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                          draftIcon === ic.id
                            ? 'text-white border-transparent shadow-2xs'
                            : 'border-[#E4E1D9] dark:border-[#2A342D] bg-white dark:bg-[#181F1B] hover:border-[#365C4B]'
                        }`}
                        style={{
                          backgroundColor: draftIcon === ic.id ? draftColor : undefined,
                        }}
                      >
                        <CustomTimerIcon icon={ic.id} className="w-3.5 h-3.5" />
                        <span>{ic.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-black/10 dark:border-white/10">
              <button
                type="button"
                onClick={() => setShowBuilder(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#252B27]/70 dark:text-slate-300 hover:bg-black/5 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-semibold text-white shadow-xs transition-opacity hover:opacity-95 cursor-pointer"
                style={{ backgroundColor: draftColor }}
              >
                Save & Load Custom Timer
              </button>
            </div>
          </form>
        )}

        {/* SAVED & LIKED CUSTOM TIMERS GRID */}
        {displayedTimers.length === 0 ? (
          <div className={`p-6 rounded-2xl border text-center space-y-3 ${cardSurface}`}>
            <p className="text-xs sm:text-sm text-[#252B27]/70 dark:text-slate-300">
              {filterTab === 'liked'
                ? 'No liked timers yet. Click the heart icon on any timer to favorite it.'
                : 'No saved timers in your list yet.'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {customTimers.length === 0 && (
                <button
                  type="button"
                  onClick={() => restoreDefaultSavedTimers()}
                  className="px-4 py-2 rounded-xl border border-[#365C4B]/40 text-xs font-semibold text-[#365C4B] dark:text-[#70B393] inline-flex items-center gap-1.5 hover:bg-[#365C4B]/10 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Load Pre-Saved Timers</span>
                </button>
              )}
              <button
                type="button"
                onClick={openBuilderWithCurrent}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white inline-flex items-center gap-1.5 cursor-pointer"
                style={{ backgroundColor: timerColor }}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Custom Timer</span>
              </button>
            </div>
          </div>
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {displayedTimers.map((item) => {
            const isActive = activeCustomId === item.id;
            const isPreSaved = PRE_SAVED_IDS.has(item.id);
            const mins = Math.floor(item.durationSec / 60);
            const secs = item.durationSec % 60;
            const timeBadge =
              secs > 0 ? `${mins}m ${secs}s` : `${mins} min`;

            return (
              <div
                key={item.id}
                onClick={() => onSelectCustomTimer(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectCustomTimer(item);
                  }
                }}
                className={`group p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                  isActive
                    ? 'border-[#365C4B] bg-[#E7EDE7]/45 dark:bg-[#252E28] ring-1 ring-[#365C4B]'
                    : `${cardSurface} hover:border-[#365C4B]/50`
                }`}
              >
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs"
                      style={{ backgroundColor: item.color }}
                    >
                      <CustomTimerIcon icon={item.icon} className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs sm:text-sm font-bold truncate">
                          {item.title}
                        </h4>
                        {isPreSaved && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide bg-[#365C4B]/10 text-[#365C4B] dark:bg-[#365C4B]/30 dark:text-[#8CD4B2] shrink-0">
                            Pre-Saved
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-mono font-semibold opacity-75">
                        {timeBadge} · {item.visualStyle.replace('-', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Like (Heart) & Delete Buttons */}
                  <div
                    className="flex items-center gap-1 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => onToggleLikeTimer(item.id)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        item.liked
                          ? 'text-[#D93B8A] bg-[#D93B8A]/10'
                          : 'text-slate-400 hover:text-[#D93B8A] hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                      aria-label={item.liked ? 'Remove from Liked timers' : 'Like this timer'}
                      title={item.liked ? 'Liked Timer' : 'Add to Liked Timers'}
                    >
                      <Heart className={`w-4 h-4 ${item.liked ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteCustomTimer(item.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-[#D94343] hover:bg-[#D94343]/10 transition-colors cursor-pointer"
                      aria-label={`Delete ${item.title} from saved list`}
                      title="Delete from saved list"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-[#252B27]/70 dark:text-slate-300 line-clamp-2 leading-relaxed">
                  {item.subtitle}
                </p>

                {/* Feature Tags & Open Dedicated Page Link */}
                <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {item.halfwayChime && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-black/5 dark:bg-white/10">
                        50% Chime
                      </span>
                    )}
                    {item.autoBreakSec > 0 && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#365C4B]/15 text-[#365C4B] dark:text-[#8CD4B2]">
                        +{Math.round(item.autoBreakSec / 60)}m Break
                      </span>
                    )}
                    {item.ambientSound !== 'off' && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-black/5 dark:bg-white/10">
                        Audio: {item.ambientSound}
                      </span>
                    )}
                  </div>

                  <Link prefetch={false}
                    href={buildCustomTimerHref(item)}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#365C4B] dark:text-[#70B393] hover:underline shrink-0"
                    title="Open dedicated page for this custom timer"
                  >
                    <span>Open Page</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
        )}
      </div>

      {/* ================================================================= */}
      {/* PART C: DEDICATED ANIMATED VISUAL PAGES BY PRESET                 */}
      {/* ================================================================= */}
      <div className="pt-6 border-t border-[#E4E1D9] dark:border-[#2A342D]">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#252B27] dark:text-white">
              Dedicated Animated Visual Timer Pages
            </h3>
            <p className="text-xs text-[#252B27]/65 dark:text-slate-400 mt-0.5">
              Launch full standalone pages tailored to each animated visual preset.
            </p>
          </div>
          <Link prefetch={false}
            href="/timers/sensory-timers"
            className="text-xs font-semibold text-[#365C4B] dark:text-[#70B393] inline-flex items-center gap-1 hover:underline"
          >
            <span>Explore All Animated Pages</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {[
            { label: 'Growing Bloom', href: '/custom-timer?id=deep-focus-bloom', desc: 'Botanical focus growth' },
            { label: 'Liquid Wave Page', href: '/timers/liquid-timer', desc: 'Fluid glass countdown' },
            { label: 'Rainbow Arcs Page', href: '/timers/rainbow-timer', desc: 'Colorful spectrum arcs' },
            { label: 'Sand Hourglass Page', href: '/timers/sand-timer', desc: 'Flowing sand grains' },
            { label: 'Breathing Orb', href: '/custom-timer?id=zen-breathing-orb', desc: '4s inhale / 4s exhale' },
            { label: 'Lava Lamp Page', href: '/timers/lava-lamp-timer', desc: 'Floating retro wax blobs' },
            { label: 'Galaxy Starfield Page', href: '/timers/galaxy-timer', desc: 'Deep space spiral motion' },
            { label: 'Forest Fire Page', href: '/timers/forest-fire-timer', desc: 'Cozy campfire embers' },
            { label: 'Energy Cells', href: '/custom-timer?id=hiit-energy-battery', desc: 'High-contrast power bars' },
            { label: 'Snowfall Page', href: '/timers/snow-timer', desc: 'Gentle winter snowfall' },
          ].map((presetPage) => (
            <Link prefetch={false}
              key={presetPage.href}
              href={presetPage.href}
              className={`p-3 rounded-xl border transition-all hover:border-[#365C4B] flex flex-col justify-between gap-1 ${cardSurface}`}
            >
              <span className="text-xs font-bold text-[#252B27] dark:text-white flex items-center justify-between gap-1">
                <span className="truncate">{presetPage.label}</span>
                <ArrowRight className="w-3 h-3 shrink-0 opacity-60" />
              </span>
              <span className="text-[11px] text-[#252B27]/60 dark:text-slate-400 truncate">
                {presetPage.desc}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

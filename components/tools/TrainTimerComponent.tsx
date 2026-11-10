'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Bell,
  BellOff,
  Maximize2,
  Minimize2,
  Eye,
  EyeOff,
  Bookmark,
  Check,
  Settings,
  ChevronUp,
  ChevronDown,
  TrainFront,
  Pencil,
  MapPin,
} from 'lucide-react';

export type TrainThemeId = 'classic-station' | 'modern-station' | 'vintage-railway' | 'night-station';
export type TrainStyleId = 'red-express' | 'metro-blue' | 'high-speed' | 'steam-loco';

interface TrainThemeConfig {
  id: TrainThemeId;
  name: string;
  platformLabel: string;
  boardFrameBg: string;
  boardInnerBg: string;
  boardBorder: string;
  cardTopBg: string;
  cardBottomBg: string;
  cardBorder: string;
  digitColor: string;
  accentText: string;
  sceneOverlay: string;
  archColor: string;
}

const TRAIN_THEMES: Record<TrainThemeId, TrainThemeConfig> = {
  'classic-station': {
    id: 'classic-station',
    name: 'Classic Station',
    platformLabel: 'Platform 1',
    boardFrameBg: 'linear-gradient(180deg, #3A3532 0%, #221E1C 50%, #171412 100%)',
    boardInnerBg: '#161412',
    boardBorder: '#574E47',
    cardTopBg: 'linear-gradient(180deg, #2D2A28 0%, #22201E 100%)',
    cardBottomBg: 'linear-gradient(180deg, #1E1C1A 0%, #282523 100%)',
    cardBorder: '#3E3A36',
    digitColor: '#F7F4EB',
    accentText: '#FACC15',
    sceneOverlay:
      'radial-gradient(circle at 50% 18%, rgba(251, 191, 36, 0.32) 0%, rgba(120, 72, 35, 0.55) 48%, rgba(20, 16, 14, 0.92) 100%)',
    archColor: 'rgba(251, 191, 36, 0.22)',
  },
  'modern-station': {
    id: 'modern-station',
    name: 'Modern Station',
    platformLabel: 'Platform 2',
    boardFrameBg: 'linear-gradient(180deg, #334155 0%, #1E293B 55%, #0F172A 100%)',
    boardInnerBg: '#0B1324',
    boardBorder: '#64748B',
    cardTopBg: 'linear-gradient(180deg, #1E293B 0%, #152033 100%)',
    cardBottomBg: 'linear-gradient(180deg, #111A2B 0%, #1B263B 100%)',
    cardBorder: '#334155',
    digitColor: '#F8FAFC',
    accentText: '#38BDF8',
    sceneOverlay:
      'radial-gradient(circle at 50% 18%, rgba(56, 189, 248, 0.34) 0%, rgba(30, 64, 175, 0.45) 48%, rgba(15, 23, 42, 0.92) 100%)',
    archColor: 'rgba(125, 211, 252, 0.25)',
  },
  'vintage-railway': {
    id: 'vintage-railway',
    name: 'Vintage Railway',
    platformLabel: 'Track 3',
    boardFrameBg: 'linear-gradient(180deg, #4A3728 0%, #2C1F16 55%, #1B120C 100%)',
    boardInnerBg: '#19110B',
    boardBorder: '#85603F',
    cardTopBg: 'linear-gradient(180deg, #36271C 0%, #281C14 100%)',
    cardBottomBg: 'linear-gradient(180deg, #211710 0%, #2E2117 100%)',
    cardBorder: '#5C4028',
    digitColor: '#FDE68A',
    accentText: '#F59E0B',
    sceneOverlay:
      'radial-gradient(circle at 50% 18%, rgba(245, 158, 11, 0.36) 0%, rgba(120, 53, 15, 0.58) 50%, rgba(28, 18, 12, 0.94) 100%)',
    archColor: 'rgba(245, 158, 11, 0.25)',
  },
  'night-station': {
    id: 'night-station',
    name: 'Night Station',
    platformLabel: 'Platform 4',
    boardFrameBg: 'linear-gradient(180deg, #27272A 0%, #18181B 55%, #09090B 100%)',
    boardInnerBg: '#090A0F',
    boardBorder: '#52525B',
    cardTopBg: 'linear-gradient(180deg, #1E1B2E 0%, #151324 100%)',
    cardBottomBg: 'linear-gradient(180deg, #110F1D 0%, #1A172B 100%)',
    cardBorder: '#3F3F46',
    digitColor: '#F4F4F5',
    accentText: '#FBBF24',
    sceneOverlay:
      'radial-gradient(circle at 50% 18%, rgba(99, 102, 241, 0.25) 0%, rgba(30, 27, 75, 0.65) 50%, rgba(9, 9, 11, 0.95) 100%)',
    archColor: 'rgba(251, 191, 36, 0.2)',
  },
};

const TRAIN_STYLES: Array<{
  id: TrainStyleId;
  name: string;
  bodyColor: string;
  stripeColor: string;
  roofColor: string;
  noseColor: string;
}> = [
  {
    id: 'red-express',
    name: 'Red Express',
    bodyColor: '#C81E1E',
    stripeColor: '#FACC15',
    roofColor: '#4B5563',
    noseColor: '#991B1B',
  },
  {
    id: 'metro-blue',
    name: 'Metro Blue',
    bodyColor: '#1D4ED8',
    stripeColor: '#93C5FD',
    roofColor: '#334155',
    noseColor: '#1E3A8A',
  },
  {
    id: 'high-speed',
    name: 'Bullet Gold',
    bodyColor: '#EAB308',
    stripeColor: '#1E40AF',
    roofColor: '#475569',
    noseColor: '#CA8A04',
  },
  {
    id: 'steam-loco',
    name: 'Steam Heritage',
    bodyColor: '#27272A',
    stripeColor: '#DC2626',
    roofColor: '#18181B',
    noseColor: '#991B1B',
  },
];

const PRESET_MINUTES = [
  { label: '1 min', minutes: 1, sub: 'Quick switch' },
  { label: '3 min', minutes: 3, sub: 'Short break' },
  { label: '5 min', minutes: 5, sub: 'Activity change' },
  { label: '10 min', minutes: 10, sub: 'Group task' },
  { label: '25 min', minutes: 25, sub: 'Focus session' },
];

const SESSION_SUGGESTIONS = [
  'Next Activity',
  'Presentation Starts',
  'Break Ends',
  'Group Rotation',
  'Boarding Soon',
];

const STORAGE_KEY = 'timetools_train_timer_defaults_v1';

interface SplitFlapDigitProps {
  digit: string;
  theme: TrainThemeConfig;
  size: 'normal' | 'compact' | 'fullscreen';
  reducedMotion: boolean;
}

function SplitFlapDigit({ digit, theme, size, reducedMotion }: SplitFlapDigitProps) {
  const [renderState, setRenderState] = useState<{
    current: string;
    previous: string;
    seq: number;
  }>({
    current: digit,
    previous: digit === '0' ? '9' : String((Number(digit) + 1) % 10),
    seq: 0,
  });

  if (digit !== renderState.current) {
    setRenderState({
      current: digit,
      previous: renderState.current,
      seq: renderState.seq + 1,
    });
  }

  const flapTopRef = useRef<HTMLDivElement>(null);
  const flapBottomRef = useRef<HTMLDivElement>(null);
  const topShadowRef = useRef<HTMLDivElement>(null);
  const bottomShadowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion) return;

    const topEl = flapTopRef.current;
    const bottomEl = flapBottomRef.current;
    const topShade = topShadowRef.current;
    const bottomShade = bottomShadowRef.current;
    if (!topEl || !bottomEl) return;

    topEl.getAnimations().forEach((a) => a.cancel());
    bottomEl.getAnimations().forEach((a) => a.cancel());
    topShade?.getAnimations().forEach((a) => a.cancel());
    bottomShade?.getAnimations().forEach((a) => a.cancel());

    topEl.animate(
      [
        { transform: 'rotateX(0deg)', opacity: 1 },
        { transform: 'rotateX(-90deg)', opacity: 1, offset: 0.95 },
        { transform: 'rotateX(-90deg)', opacity: 0 },
      ],
      {
        duration: 210,
        easing: 'cubic-bezier(0.32, 0.04, 0.85, 0.55)',
        fill: 'forwards',
      }
    );

    topShade?.animate(
      [
        { opacity: 0 },
        { opacity: 0.55 },
      ],
      {
        duration: 210,
        easing: 'ease-in',
        fill: 'forwards',
      }
    );

    bottomEl.animate(
      [
        { transform: 'rotateX(90deg)', opacity: 0 },
        { transform: 'rotateX(90deg)', opacity: 1, offset: 0.47 },
        { transform: 'rotateX(-5deg)', opacity: 1, offset: 0.88 },
        { transform: 'rotateX(0deg)', opacity: 1 },
      ],
      {
        duration: 420,
        easing: 'cubic-bezier(0.18, 0.82, 0.32, 1)',
        fill: 'forwards',
      }
    );

    bottomShade?.animate(
      [
        { opacity: 0.65 },
        { opacity: 0.55, offset: 0.48 },
        { opacity: 0 },
      ],
      {
        duration: 420,
        easing: 'ease-out',
        fill: 'forwards',
      }
    );
  }, [renderState.seq, reducedMotion]);

  const cardSizeClass =
    size === 'fullscreen'
      ? 'w-[86px] h-[126px] sm:w-[122px] sm:h-[178px] md:w-[152px] md:h-[220px] rounded-2xl'
      : size === 'compact'
        ? 'w-[40px] h-[62px] sm:w-[48px] sm:h-[74px] rounded-lg'
        : 'w-[54px] h-[84px] sm:w-[66px] sm:h-[100px] md:w-[72px] md:h-[110px] rounded-xl';

  const textSizeClass =
    size === 'fullscreen'
      ? 'text-[4.5rem] sm:text-[6.5rem] md:text-[8.2rem]'
      : size === 'compact'
        ? 'text-[2.1rem] sm:text-[2.6rem]'
        : 'text-[3.1rem] sm:text-[3.8rem] md:text-[4.25rem]';

  const currentDigit = renderState.current;
  const previousDigit = renderState.previous;

  const renderGlyph = (char: string, half: 'top' | 'bottom') => (
    <div
      className={`w-full flex items-center justify-center select-none font-mono font-bold tracking-tight leading-none ${textSizeClass}`}
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: half === 'top' ? '0%' : 'auto',
        bottom: half === 'bottom' ? '0%' : 'auto',
        height: '200%',
        color: theme.digitColor,
      }}
    >
      {char}
    </div>
  );

  return (
    <div
      className={`relative select-none shrink-0 ${cardSizeClass}`}
      style={{
        perspective: '900px',
        boxShadow:
          '0 10px 22px -6px rgba(0,0,0,0.7), 0 3px 6px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.12)',
        border: `1.5px solid ${theme.cardBorder}`,
        background: '#0A0A0A',
      }}
    >
      {/* 1. STATIC TOP HALF (Target current digit) */}
      <div
        className="absolute inset-x-0 top-0 h-1/2 overflow-hidden rounded-t-[inherit]"
        style={{ background: theme.cardTopBg }}
      >
        {renderGlyph(currentDigit, 'top')}
        <div
          className="absolute inset-x-0 top-0 h-2 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 100%)',
          }}
        />
      </div>

      {/* 2. STATIC BOTTOM HALF (Previous digit underneath while unfolding) */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/2 overflow-hidden rounded-b-[inherit]"
        style={{ background: theme.cardBottomBg }}
      >
        {renderGlyph(reducedMotion ? currentDigit : previousDigit, 'bottom')}
        <div
          className="absolute inset-x-0 bottom-0 h-2.5 pointer-events-none"
          style={{
            background: 'linear-gradient(0deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 100%)',
          }}
        />
      </div>

      {/* 3. ANIMATED TOP FLAP (Previous digit folding down 0deg -> -90deg) */}
      {!reducedMotion && (
        <div
          ref={flapTopRef}
          className="absolute inset-x-0 top-0 h-1/2 overflow-hidden rounded-t-[inherit] z-20 pointer-events-none"
          style={{
            background: theme.cardTopBg,
            transformOrigin: '50% 100%',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateX(-90deg)',
            opacity: 0,
            willChange: 'transform, opacity',
          }}
        >
          {renderGlyph(previousDigit, 'top')}
          <div
            ref={topShadowRef}
            className="absolute inset-0 pointer-events-none"
            style={{ background: '#000', opacity: 0 }}
          />
        </div>
      )}

      {/* 4. ANIMATED BOTTOM FLAP (Current digit unfolding 90deg -> 0deg) */}
      {!reducedMotion && (
        <div
          ref={flapBottomRef}
          className="absolute inset-x-0 bottom-0 h-1/2 overflow-hidden rounded-b-[inherit] z-20 pointer-events-none"
          style={{
            background: theme.cardBottomBg,
            transformOrigin: '50% 0%',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateX(0deg)',
            opacity: 1,
            willChange: 'transform, opacity',
          }}
        >
          {renderGlyph(currentDigit, 'bottom')}
          <div
            ref={bottomShadowRef}
            className="absolute inset-0 pointer-events-none"
            style={{ background: '#000', opacity: 0 }}
          />
        </div>
      )}

      {/* 5. CENTRAL MECHANICAL SPLIT HINGE & SIDE PINS */}
      <div
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2.5px] z-30 pointer-events-none"
        style={{
          background: 'rgba(0, 0, 0, 0.9)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.65), 0 -1px 1px rgba(255,255,255,0.06)',
        }}
      />
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-[4px] h-[9px] rounded-r-xs z-30 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, #78716C 0%, #292524 100%)',
          boxShadow: '1px 0 2px rgba(0,0,0,0.75)',
        }}
      />
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[4px] h-[9px] rounded-l-xs z-30 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, #78716C 0%, #292524 100%)',
          boxShadow: '-1px 0 2px rgba(0,0,0,0.75)',
        }}
      />
    </div>
  );
}

/** Illustrated Train SVG rendered on the panoramic route & style selector */
function TrainCarriageIllustration({
  styleId,
  isRunning,
  compact = false,
}: {
  styleId: TrainStyleId;
  isRunning: boolean;
  compact?: boolean;
}) {
  const cfg = TRAIN_STYLES.find((s) => s.id === styleId) || TRAIN_STYLES[0];

  if (compact) {
    return (
      <svg viewBox="0 0 92 42" className="w-full h-9 drop-shadow-xs">
        {/* Track line */}
        <line x1="2" y1="38" x2="90" y2="38" stroke="#64748B" strokeWidth="2" />
        {styleId === 'steam-loco' ? (
          <g>
            {/* Steam puffs */}
            <circle cx="68" cy="8" r="3.5" fill="#CBD5E1" opacity="0.8" />
            <circle cx="60" cy="6" r="4.5" fill="#E2E8F0" opacity="0.7" />
            {/* Boiler & Cab */}
            <rect x="16" y="14" width="30" height="19" rx="2" fill={cfg.bodyColor} />
            <rect x="44" y="18" width="28" height="15" rx="2" fill={cfg.bodyColor} />
            {/* Smokestack */}
            <rect x="63" y="11" width="5" height="8" rx="1" fill="#18181B" />
            {/* Red trim & cowcatcher */}
            <rect x="16" y="29" width="56" height="3" fill={cfg.stripeColor} />
            <polygon points="72,33 79,36 72,36" fill={cfg.noseColor} />
            {/* Cab Window */}
            <rect x="21" y="17" width="10" height="7" rx="1" fill="#FDE68A" />
            {/* Headlamp */}
            <circle cx="73" cy="22" r="2.2" fill="#FEF08A" />
          </g>
        ) : (
          <g>
            {/* Main streamlined locomotive body */}
            <path
              d="M12 15 H64 C72 15 78 22 81 31 C81.5 32.5 80.5 34 79 34 H12 C10.5 34 9.5 33 9.5 31.5 V17.5 C9.5 16 10.5 15 12 15 Z"
              fill={cfg.bodyColor}
            />
            {/* Roof */}
            <path d="M14 13 H60 L64 15 H12 Z" fill={cfg.roofColor} />
            {/* Accent Stripe */}
            <rect x="10" y="26" width="69" height="3.5" fill={cfg.stripeColor} />
            {/* Passenger Windows */}
            <rect x="15" y="18" width="10" height="6" rx="1.2" fill="#E0F2FE" />
            <rect x="28" y="18" width="10" height="6" rx="1.2" fill="#E0F2FE" />
            <rect x="41" y="18" width="10" height="6" rx="1.2" fill="#E0F2FE" />
            {/* Cockpit Windshield */}
            <path d="M55 18 H65 L71 24 H55 Z" fill="#38BDF8" />
            {/* Headlight */}
            <circle cx="77" cy="30" r="2" fill="#FEF08A" />
          </g>
        )}
        {/* Wheels */}
        <circle cx="22" cy="35.5" r="3" fill="#1E293B" stroke="#94A3B8" strokeWidth="1.2" />
        <circle cx="34" cy="35.5" r="3" fill="#1E293B" stroke="#94A3B8" strokeWidth="1.2" />
        <circle cx="54" cy="35.5" r="3" fill="#1E293B" stroke="#94A3B8" strokeWidth="1.2" />
        <circle cx="66" cy="35.5" r="3" fill="#1E293B" stroke="#94A3B8" strokeWidth="1.2" />
      </svg>
    );
  }

  // Full 2-car passenger train for the panoramic railway track
  return (
    <svg viewBox="0 0 250 56" className="w-[155px] sm:w-[210px] md:w-[235px] h-auto drop-shadow-md">
      {/* Headlight beam when running */}
      {isRunning && (
        <polygon
          points="236,36 250,29 250,45"
          fill="url(#headlightBeam)"
          opacity="0.85"
        />
      )}
      <defs>
        <linearGradient id="headlightBeam" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FEF08A" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Pantograph / Steam Puffs */}
      {styleId === 'steam-loco' ? (
        <g>
          <circle cx="206" cy="11" r="4.5" fill="#F1F5F9" opacity="0.85" />
          <circle cx="194" cy="8" r="6" fill="#E2E8F0" opacity="0.7" />
          <circle cx="180" cy="6" r="5" fill="#CBD5E1" opacity="0.55" />
        </g>
      ) : (
        <g stroke="#475569" strokeWidth="1.5" fill="none">
          <path d="M52 18 L58 11 L65 18" />
          <line x1="54" y1="11" x2="62" y2="11" />
          <path d="M158 18 L164 11 L171 18" />
          <line x1="160" y1="11" x2="168" y2="11" />
        </g>
      )}

      {/* REAR CARRIAGE */}
      <g>
        <rect x="8" y="18" width="102" height="26" rx="4" fill={cfg.bodyColor} stroke="#1F2937" strokeWidth="1" />
        <rect x="12" y="15" width="94" height="3.5" rx="1.5" fill={cfg.roofColor} />
        {/* Accent stripe */}
        <rect x="8" y="34" width="102" height="4.5" fill={cfg.stripeColor} />
        <rect x="8" y="40" width="102" height="3.5" fill="#1F2937" />
        {/* Windows */}
        {[16, 32, 48, 64, 80, 94].map((wx) => (
          <rect
            key={wx}
            x={wx}
            y="22"
            width="11"
            height="8.5"
            rx="1.5"
            fill="#FEF9C3"
            stroke="#374151"
            strokeWidth="0.8"
          />
        ))}
        {/* Wheels */}
        {[24, 38, 82, 96].map((cx) => (
          <g key={cx}>
            <circle cx={cx} cy="46" r="4.2" fill="#1E293B" stroke="#94A3B8" strokeWidth="1.4" />
            <circle cx={cx} cy="46" r="1.4" fill="#E2E8F0" />
          </g>
        ))}
      </g>

      {/* Coupler between cars */}
      <rect x="109" y="34" width="9" height="6" rx="1" fill="#1E293B" />

      {/* FRONT LOCOMOTIVE CAR */}
      <g>
        <path
          d="M117 18 H212 C222 18 231 27 235 39 C236 41.5 234.5 44 231.5 44 H117 V18 Z"
          fill={cfg.bodyColor}
          stroke="#1F2937"
          strokeWidth="1"
        />
        <path d="M120 15 H204 L210 18 H117 Z" fill={cfg.roofColor} />
        {/* Accent stripe */}
        <rect x="117" y="34" width="116" height="4.5" fill={cfg.stripeColor} />
        <rect x="117" y="40" width="117" height="3.5" fill="#1F2937" />
        {/* Passenger windows */}
        {[125, 141, 157, 173, 189].map((wx) => (
          <rect
            key={wx}
            x={wx}
            y="22"
            width="11"
            height="8.5"
            rx="1.5"
            fill="#FEF9C3"
            stroke="#374151"
            strokeWidth="0.8"
          />
        ))}
        {/* Driver Cabin Windshield */}
        <path
          d="M205 21 H216 L225 31 H205 Z"
          fill="#BAE6FD"
          stroke="#1E293B"
          strokeWidth="1"
        />
        {/* Front Nose Grille & Headlight */}
        <rect x="224" y="34" width="7" height="4.5" rx="1" fill={cfg.noseColor} />
        <circle cx="231" cy="36.5" r="2.6" fill="#FEF08A" stroke="#CA8A04" strokeWidth="0.8" />
        {/* Cowcatcher */}
        <polygon points="230,44 239,48 228,48" fill="#475569" />
        {/* Wheels */}
        {[134, 148, 198, 214].map((cx) => (
          <g key={cx}>
            <circle cx={cx} cy="46" r="4.2" fill="#1E293B" stroke="#94A3B8" strokeWidth="1.4" />
            <circle cx={cx} cy="46" r="1.4" fill="#E2E8F0" />
          </g>
        ))}
      </g>
    </svg>
  );
}

interface TrainTimerComponentProps {
  initialMinutes?: number;
}

export default function TrainTimerComponent({ initialMinutes = 25 }: TrainTimerComponentProps) {
  const [mode, setMode] = useState<'duration' | 'endTime'>('duration');
  const [totalSeconds, setTotalSeconds] = useState<number>(initialMinutes * 60);
  const [remainingMs, setRemainingMs] = useState<number>(initialMinutes * 60 * 1000);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const [customMinutes, setCustomMinutes] = useState<number>(initialMinutes);
  const [customSeconds, setCustomSeconds] = useState<number>(0);
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [endTimeInput, setEndTimeInput] = useState<string>('17:00');

  const [sessionName, setSessionName] = useState<string>('Next Activity');
  const [themeId, setThemeId] = useState<TrainThemeId>('classic-station');
  const [trainStyleId, setTrainStyleId] = useState<TrainStyleId>('red-express');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showTime, setShowTime] = useState<boolean>(true);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [savedToast, setSavedToast] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const sessionInputRef = useRef<HTMLInputElement>(null);
  const rafRef = useRef<number | null>(null);
  const targetEndTimeRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastDisplayedSecRef = useRef<number>(initialMinutes * 60);

  // Load saved defaults and prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const id = window.requestAnimationFrame(() => {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mediaQuery.matches) {
        setReducedMotion(true);
      }

      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.themeId && TRAIN_THEMES[parsed.themeId as TrainThemeId]) {
            setThemeId(parsed.themeId);
          }
          if (parsed.trainStyleId) {
            setTrainStyleId(parsed.trainStyleId);
          }
          if (typeof parsed.sessionName === 'string' && parsed.sessionName.trim()) {
            setSessionName(parsed.sessionName);
          }
          if (typeof parsed.soundEnabled === 'boolean') {
            setSoundEnabled(parsed.soundEnabled);
          }
          if (typeof parsed.showTime === 'boolean') {
            setShowTime(parsed.showTime);
          }
          if (typeof parsed.minutes === 'number' && parsed.minutes > 0) {
            const secs = parsed.minutes * 60 + (parsed.seconds || 0);
            setCustomMinutes(parsed.minutes);
            setCustomSeconds(parsed.seconds || 0);
            setTotalSeconds(secs);
            setRemainingMs(secs * 1000);
            lastDisplayedSecRef.current = secs;
          }
        }
      } catch {
        // Ignore storage errors
      }

      const defaultEnd = new Date(Date.now() + 25 * 60 * 1000);
      const hh = String(defaultEnd.getHours()).padStart(2, '0');
      const mm = String(defaultEnd.getMinutes()).padStart(2, '0');
      setEndTimeInput(`${hh}:${mm}`);
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  // Subtle mechanical split-flap click sound on each second
  const playFlapClick = useCallback(() => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(195, now);
      osc.frequency.exponentialRampToValueAtTime(62, now + 0.028);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.032);
    } catch {
      // Ignore audio errors
    }
  }, [soundEnabled]);

  // Classic 3-tone railway station chime ("Ding-Dong-Ding!") on completion
  const playStationChime = useCallback(() => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const notes = [523.25, 659.25, 783.99, 659.25]; // C5 - E5 - G5 - E5 station PA chime
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.24);

        gain.gain.setValueAtTime(0.0001, ctx.currentTime + idx * 0.24);
        gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + idx * 0.24 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.24 + 0.55);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.24);
        osc.stop(ctx.currentTime + idx * 0.24 + 0.58);
      });
    } catch {
      // Ignore audio errors
    }
  }, [soundEnabled]);

  // High-precision countdown loop
  useEffect(() => {
    if (!isRunning) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    targetEndTimeRef.current = performance.now() + remainingMs;

    const tick = (now: number) => {
      if (!targetEndTimeRef.current) return;
      const left = Math.max(0, targetEndTimeRef.current - now);
      setRemainingMs(left);

      const currentCeilSec = Math.ceil(left / 1000);
      if (currentCeilSec !== lastDisplayedSecRef.current) {
        lastDisplayedSecRef.current = currentCeilSec;
        if (currentCeilSec > 0) {
          playFlapClick();
        }
      }

      if (left <= 0) {
        setIsRunning(false);
        setIsCompleted(true);
        playStationChime();
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, playFlapClick, playStationChime]);

  const applyNewDuration = useCallback((mins: number, secs: number) => {
    const safeMins = Math.max(0, Math.min(999, Math.floor(mins)));
    const safeSecs = Math.max(0, Math.min(59, Math.floor(secs)));
    const total = Math.max(1, safeMins * 60 + safeSecs);
    setIsRunning(false);
    setIsCompleted(false);
    setCustomMinutes(safeMins);
    setCustomSeconds(safeSecs);
    setTotalSeconds(total);
    setRemainingMs(total * 1000);
    lastDisplayedSecRef.current = total;
  }, []);

  const handleSelectPreset = (minutes: number) => {
    setMode('duration');
    setIsCustomMode(false);
    applyNewDuration(minutes, 0);
  };

  const handleEndTimeChange = (val: string) => {
    setEndTimeInput(val);
    const parts = val.split(':');
    if (parts.length === 2) {
      const targetH = parseInt(parts[0], 10);
      const targetM = parseInt(parts[1], 10);
      if (!isNaN(targetH) && !isNaN(targetM)) {
        const now = new Date();
        const target = new Date();
        target.setHours(targetH, targetM, 0, 0);
        if (target.getTime() <= now.getTime()) {
          target.setDate(target.getDate() + 1);
        }
        const diffSec = Math.max(1, Math.round((target.getTime() - now.getTime()) / 1000));
        setIsRunning(false);
        setIsCompleted(false);
        setTotalSeconds(diffSec);
        setRemainingMs(diffSec * 1000);
        lastDisplayedSecRef.current = diffSec;
      }
    }
  };

  const handleStart = () => {
    if (remainingMs <= 0) {
      const restartedMs = Math.max(0, totalSeconds * 1000 - 50);
      setRemainingMs(restartedMs);
      lastDisplayedSecRef.current = Math.ceil(restartedMs / 1000);
      setIsCompleted(false);
      playFlapClick();
    } else if (remainingMs % 1000 === 0) {
      const nudgedMs = Math.max(0, remainingMs - 50);
      setRemainingMs(nudgedMs);
      lastDisplayedSecRef.current = Math.ceil(nudgedMs / 1000);
      playFlapClick();
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
    setRemainingMs(totalSeconds * 1000);
    lastDisplayedSecRef.current = totalSeconds;
  };

  const handleSaveDefault = () => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          themeId,
          trainStyleId,
          sessionName,
          soundEnabled,
          showTime,
          minutes: customMinutes,
          seconds: customSeconds,
        })
      );
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 2200);
    } catch {
      // Ignore storage errors
    }
  };

  const toggleFullscreen = async () => {
    const nextState = !isFullscreen;
    setIsFullscreen(nextState);

    if (nextState) {
      try {
        if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
      } catch {
        // Keep CSS .timer-fullscreen-stage active
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
  };

  useEffect(() => {
    const onFsChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // Calculate displayed digits & progress
  const totalMs = Math.max(1000, totalSeconds * 1000);
  const progress = Math.min(1, Math.max(0, 1 - remainingMs / totalMs));
  const displayTotalSec = Math.ceil(remainingMs / 1000);
  const hrs = Math.floor(displayTotalSec / 3600);
  const mins = Math.floor((displayTotalSec % 3600) / 60);
  const secs = displayTotalSec % 60;

  const hasHours = hrs > 0;
  const hrsStr = String(hrs).padStart(2, '0');
  const minsStr = String(mins).padStart(2, '0');
  const secsStr = String(secs).padStart(2, '0');

  const formattedRemaining = hasHours
    ? `${hrsStr}:${minsStr}:${secsStr}`
    : `${minsStr}:${secsStr}`;

  const activeTheme = TRAIN_THEMES[themeId];
  const digitCardSize: 'normal' | 'compact' | 'fullscreen' = isFullscreen
    ? 'fullscreen'
    : hasHours
      ? 'compact'
      : 'normal';

  return (
    <div className="space-y-8">
      {/* MAIN INTERACTIVE TRAIN TIMER DASHBOARD CARD */}
      <div
        ref={containerRef}
        className={`rounded-3xl bg-white/95 dark:bg-[#151816]/95 border border-[#DCE3DD] dark:border-[#262E29] shadow-[0_18px_50px_rgba(15,35,25,0.08)] overflow-hidden transition-all ${
          isFullscreen
            ? 'timer-fullscreen-stage flex flex-col justify-between bg-[#0E1310]'
            : ''
        }`}
      >
        {isFullscreen && (
          <button
            type="button"
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 z-50 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-black/65 hover:bg-black/85 text-white text-xs font-semibold backdrop-blur-xs transition cursor-pointer"
            aria-label="Exit Fullscreen"
          >
            <Minimize2 className="w-4 h-4" />
            <span>Exit Fullscreen</span>
          </button>
        )}

        {/* TOP 3-COLUMN GRID (In Fullscreen: only the Departure Board stage is shown) */}
        <div
          className={`p-4 sm:p-6 lg:p-7 ${
            isFullscreen
              ? 'w-full flex-1 flex items-center justify-center p-2 sm:p-4'
              : 'grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-7 items-stretch'
          }`}
        >
          {/* LEFT COLUMN (5 cols): REALISTIC RAILWAY STATION DEPARTURE BOARD */}
          <div
            className={`${
              isFullscreen ? 'w-full h-full flex flex-col justify-center' : 'lg:col-span-5 flex flex-col justify-center'
            }`}
          >
            <div
              className={`relative w-full overflow-hidden rounded-2xl border border-[#3E352F] flex flex-col items-center justify-center select-none ${
                isFullscreen
                  ? 'h-full p-4 sm:p-6'
                  : 'min-h-[350px] sm:min-h-[395px] p-4 sm:p-6'
              }`}
              style={{
                background: '#171311',
                boxShadow: 'inset 0 0 55px rgba(0,0,0,0.75)',
              }}
            >
              {/* Station Concourse Architectural Roof Arches & Warm Lights */}
              <div
                className="absolute inset-0 pointer-events-none transition-all duration-500"
                style={{ background: activeTheme.sceneOverlay }}
              />
              <svg
                viewBox="0 0 400 260"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-45"
                preserveAspectRatio="none"
              >
                {/* Station Iron Roof Trusses */}
                <path
                  d="M-20,90 Q200,-35 420,90"
                  fill="none"
                  stroke={activeTheme.archColor}
                  strokeWidth="4"
                />
                <path
                  d="M-20,60 Q200,-55 420,60"
                  fill="none"
                  stroke={activeTheme.archColor}
                  strokeWidth="2.5"
                />
                <line x1="60" y1="0" x2="60" y2="55" stroke="#78716C" strokeWidth="4" />
                <line x1="340" y1="0" x2="340" y2="55" stroke="#78716C" strokeWidth="4" />
                {/* Platform Bokeh Lights */}
                <circle cx="48" cy="48" r="10" fill="#FDE68A" opacity="0.35" />
                <circle cx="352" cy="48" r="10" fill="#FDE68A" opacity="0.35" />
                <circle cx="95" cy="225" r="14" fill="#F59E0B" opacity="0.25" />
                <circle cx="315" cy="220" r="16" fill="#F59E0B" opacity="0.25" />
              </svg>

              {/* Top Metal Suspension Rods holding the Departure Board */}
              <div className="relative z-10 w-[72%] flex justify-between px-6 -mb-1 pointer-events-none">
                <div className="w-2.5 h-5 bg-gradient-to-r from-stone-600 via-stone-400 to-stone-700 rounded-t-xs shadow-md" />
                <div className="w-2.5 h-5 bg-gradient-to-r from-stone-600 via-stone-400 to-stone-700 rounded-t-xs shadow-md" />
              </div>

              {/* MAIN DEPARTURE BOARD CASING */}
              <div
                className="relative z-10 w-full max-w-[440px] rounded-2xl p-3 sm:p-4 transition-all duration-300"
                style={{
                  background: activeTheme.boardFrameBg,
                  border: `2.5px solid ${activeTheme.boardBorder}`,
                  boxShadow:
                    '0 24px 48px -10px rgba(0,0,0,0.85), 0 8px 20px rgba(0,0,0,0.65), inset 0 1px 1px rgba(255,255,255,0.22)',
                }}
              >
                {/* Corner Rivets */}
                <span className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-stone-400/50" />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-stone-400/50" />
                <span className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-stone-400/50" />
                <span className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-stone-400/50" />

                {/* 1. HEADER BAR: Train Icon + DEPARTURE BOARD */}
                <div className="flex items-center justify-center gap-2.5 pb-2.5 border-b border-white/15">
                  <TrainFront className="w-5 h-5 sm:w-6 sm:h-6 text-white shrink-0" />
                  <span className="font-mono text-sm sm:text-base md:text-lg font-extrabold tracking-[0.22em] text-white uppercase">
                    DEPARTURE BOARD
                  </span>
                </div>

                {/* 2. SESSION NAME & PLATFORM ROW */}
                <div
                  className="mt-2.5 rounded-lg px-3.5 py-2 flex items-center justify-between gap-2 border border-black/80"
                  style={{
                    background: '#11100F',
                    boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.85)',
                  }}
                >
                  <span
                    className="font-sans text-sm sm:text-base md:text-[17px] font-extrabold tracking-tight truncate"
                    style={{ color: isCompleted ? '#4ADE80' : activeTheme.accentText }}
                    title={sessionName || 'Next Activity'}
                  >
                    {isCompleted ? 'ARRIVED • ON TIME' : sessionName || 'Next Activity'}
                  </span>
                  <span className="font-sans text-xs sm:text-sm font-bold text-stone-200 shrink-0">
                    {activeTheme.platformLabel}
                  </span>
                </div>

                {/* 3. SPLIT-FLAP DIGITS STAGE */}
                <div
                  className="mt-2.5 rounded-xl px-2.5 py-4 sm:px-4 sm:py-5 flex items-center justify-center border border-black/90"
                  style={{
                    background: activeTheme.boardInnerBg,
                    boxShadow: 'inset 0 6px 18px rgba(0,0,0,0.9)',
                  }}
                >
                  {showTime ? (
                    <div
                      className="flex items-center justify-center gap-1.5 sm:gap-2"
                      aria-live="polite"
                      aria-label={`Remaining time ${formattedRemaining}`}
                    >
                      {hasHours && (
                        <>
                          <SplitFlapDigit
                            digit={hrsStr[0]}
                            theme={activeTheme}
                            size={digitCardSize}
                            reducedMotion={reducedMotion}
                          />
                          <SplitFlapDigit
                            digit={hrsStr[1]}
                            theme={activeTheme}
                            size={digitCardSize}
                            reducedMotion={reducedMotion}
                          />
                          <div className="flex flex-col items-center justify-center gap-2.5 px-0.5">
                            <span className="w-2 h-2 rounded-full bg-stone-200 shadow-xs" />
                            <span className="w-2 h-2 rounded-full bg-stone-200 shadow-xs" />
                          </div>
                        </>
                      )}

                      {/* Minutes */}
                      <SplitFlapDigit
                        digit={minsStr[0]}
                        theme={activeTheme}
                        size={digitCardSize}
                        reducedMotion={reducedMotion}
                      />
                      <SplitFlapDigit
                        digit={minsStr[1]}
                        theme={activeTheme}
                        size={digitCardSize}
                        reducedMotion={reducedMotion}
                      />

                      {/* Colon Separator */}
                      <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 px-0.5 sm:px-1">
                        <span
                          className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-stone-100 transition-opacity duration-300 ${
                            isRunning ? 'animate-pulse' : ''
                          }`}
                        />
                        <span
                          className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-stone-100 transition-opacity duration-300 ${
                            isRunning ? 'animate-pulse' : ''
                          }`}
                        />
                      </div>

                      {/* Seconds */}
                      <SplitFlapDigit
                        digit={secsStr[0]}
                        theme={activeTheme}
                        size={digitCardSize}
                        reducedMotion={reducedMotion}
                      />
                      <SplitFlapDigit
                        digit={secsStr[1]}
                        theme={activeTheme}
                        size={digitCardSize}
                        reducedMotion={reducedMotion}
                      />
                    </div>
                  ) : (
                    <div className="py-6 text-center">
                      <div className="text-xs font-mono uppercase tracking-[0.22em] text-amber-300/90 mb-2">
                        {isCompleted
                          ? 'Train Has Arrived'
                          : isRunning
                            ? 'Train En Route...'
                            : 'Ready on Platform'}
                      </div>
                      <div className="w-48 h-2.5 bg-white/10 rounded-full overflow-hidden mx-auto p-0.5">
                        <div
                          className="h-full bg-emerald-400 rounded-full transition-all duration-300"
                          style={{ width: `${Math.round(progress * 100)}%` }}
                        />
                      </div>
                      <div className="mt-2 text-[11px] font-mono text-stone-300">
                        {Math.round(progress * 100)}% Journey Completed
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. FOOTER STATUS BAR: C O U N T D O W N */}
                <div className="mt-2.5 pt-1.5 border-t border-white/10 flex items-center justify-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isCompleted
                        ? 'bg-emerald-400 animate-ping'
                        : isRunning
                          ? 'bg-amber-400 animate-pulse'
                          : 'bg-stone-500'
                    }`}
                  />
                  <span className="font-mono text-xs sm:text-sm font-bold tracking-[0.34em] text-stone-200 uppercase">
                    {isCompleted ? 'ARRIVED AT STATION' : 'COUNTDOWN'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* CENTER COLUMN (4 cols): CONTROLS & SESSION NAME */}
          {!isFullscreen && (
          <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
            {/* Duration / End Time Segmented Tabs */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-[#EEF2EF] dark:bg-[#1E2420] border border-[#DCE3DD] dark:border-[#2C352F]">
              <button
                type="button"
                onClick={() => setMode('duration')}
                className={`py-2.5 px-4 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                  mode === 'duration'
                    ? 'bg-[#124E35] text-white shadow-xs'
                    : 'text-[#4A554E] dark:text-slate-300 hover:text-[#152019] dark:hover:text-white'
                }`}
              >
                Duration
              </button>
              <button
                type="button"
                onClick={() => setMode('endTime')}
                className={`py-2.5 px-4 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                  mode === 'endTime'
                    ? 'bg-[#124E35] text-white shadow-xs'
                    : 'text-[#4A554E] dark:text-slate-300 hover:text-[#152019] dark:hover:text-white'
                }`}
              >
                End Time
              </button>
            </div>

            {mode === 'duration' ? (
              <>
                {/* Preset Pills Row */}
                <div className="grid grid-cols-6 gap-1.5">
                  {PRESET_MINUTES.map((item) => {
                    const isSelected =
                      !isCustomMode &&
                      totalSeconds === item.minutes * 60 &&
                      customSeconds === 0;
                    return (
                      <button
                        key={item.minutes}
                        type="button"
                        onClick={() => handleSelectPreset(item.minutes)}
                        className={`py-2 px-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-[#124E35] text-white border-[#124E35] shadow-xs'
                            : 'bg-[#F6F8F6] dark:bg-[#1D231F] text-[#26302A] dark:text-slate-200 border-[#DCE3DD] dark:border-[#2D3630] hover:border-[#124E35]/50'
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => setIsCustomMode(true)}
                    className={`py-2 px-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                      isCustomMode
                        ? 'bg-[#124E35] text-white border-[#124E35] shadow-xs'
                        : 'bg-[#F6F8F6] dark:bg-[#1D231F] text-[#26302A] dark:text-slate-200 border-[#DCE3DD] dark:border-[#2D3630] hover:border-[#124E35]/50'
                    }`}
                  >
                    Custom
                  </button>
                </div>

                {/* Numeric Stepper Input */}
                <div className="flex items-center gap-3">
                  <div className="relative flex items-center bg-[#F6F8F6] dark:bg-[#1D231F] border border-[#DCE3DD] dark:border-[#2D3630] rounded-xl px-3.5 py-2 w-32">
                    <input
                      type="number"
                      min={0}
                      max={999}
                      value={customMinutes}
                      onChange={(e) => {
                        const val = parseInt(e.target.value || '0', 10);
                        applyNewDuration(val, customSeconds);
                      }}
                      className="w-full bg-transparent text-xl font-bold text-[#18221C] dark:text-white focus:outline-none"
                      aria-label="Duration in minutes"
                    />
                    <div className="flex flex-col -mr-1">
                      <button
                        type="button"
                        onClick={() => applyNewDuration(customMinutes + 1, customSeconds)}
                        className="p-0.5 text-[#526056] hover:text-[#124E35] cursor-pointer"
                        aria-label="Increase minutes"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          applyNewDuration(Math.max(1, customMinutes - 1), customSeconds)
                        }
                        className="p-0.5 text-[#526056] hover:text-[#124E35] cursor-pointer"
                        aria-label="Decrease minutes"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-[#4A554E] dark:text-slate-300">
                    minutes
                  </span>

                  {isCustomMode && (
                    <>
                      <div className="relative flex items-center bg-[#F6F8F6] dark:bg-[#1D231F] border border-[#DCE3DD] dark:border-[#2D3630] rounded-xl px-3 py-2 w-24">
                        <input
                          type="number"
                          min={0}
                          max={59}
                          value={customSeconds}
                          onChange={(e) => {
                            const val = parseInt(e.target.value || '0', 10);
                            applyNewDuration(customMinutes, val);
                          }}
                          className="w-full bg-transparent text-lg font-bold text-[#18221C] dark:text-white focus:outline-none"
                          aria-label="Seconds"
                        />
                      </div>
                      <span className="text-xs font-medium text-[#4A554E] dark:text-slate-300">
                        sec
                      </span>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="p-3.5 rounded-xl bg-[#F6F8F6] dark:bg-[#1D231F] border border-[#DCE3DD] dark:border-[#2D3630] space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4A554E] dark:text-slate-300">
                  Target Departure / Arrival Time
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="time"
                    value={endTimeInput}
                    onChange={(e) => handleEndTimeChange(e.target.value)}
                    className="bg-white dark:bg-[#141816] border border-[#DCE3DD] dark:border-[#2D3630] rounded-lg px-3 py-2 text-base font-bold text-[#18221C] dark:text-white focus:outline-none"
                  />
                  <span className="text-xs text-[#4A554E] dark:text-slate-400">
                    Counts down to {endTimeInput}
                  </span>
                </div>
              </div>
            )}

            {/* Primary Start Button */}
            <button
              type="button"
              onClick={handleStart}
              disabled={isRunning}
              className={`w-full py-3.5 px-6 rounded-xl font-bold text-base flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-sm ${
                isRunning
                  ? 'bg-[#124E35]/80 text-white/90 cursor-default'
                  : 'bg-[#124E35] hover:bg-[#0D3B28] text-white active:scale-[0.99]'
              }`}
            >
              <Play className="w-5 h-5 fill-current" />
              <span>
                {isRunning
                  ? 'Train Running...'
                  : remainingMs < totalSeconds * 1000 && remainingMs > 0
                    ? 'Resume'
                    : 'Start'}
              </span>
            </button>

            {/* Pause & Reset Row */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={isRunning ? handlePause : handleStart}
                className="py-2.5 px-4 rounded-xl font-bold text-sm bg-[#EEF2EF] dark:bg-[#1E2420] hover:bg-[#E2E8E4] dark:hover:bg-[#28302B] text-[#18221C] dark:text-slate-100 border border-[#DCE3DD] dark:border-[#2D3630] flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="py-2.5 px-4 rounded-xl font-bold text-sm bg-[#EEF2EF] dark:bg-[#1E2420] hover:bg-[#E2E8E4] dark:hover:bg-[#28302B] text-[#18221C] dark:text-slate-100 border border-[#DCE3DD] dark:border-[#2D3630] flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>

            {/* Session Name Input Box */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="train-session-name"
                  className="text-xs font-bold text-[#18221C] dark:text-slate-200"
                >
                  Session Name
                </label>
                <div className="flex items-center gap-1 overflow-x-auto">
                  {SESSION_SUGGESTIONS.slice(0, 3).map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => setSessionName(sug)}
                      className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#EEF2EF] dark:bg-[#1E2420] text-[#365C4B] dark:text-emerald-300 hover:bg-[#DCE5DF] transition-colors cursor-pointer"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>
              <div className="relative flex items-center bg-[#F6F8F6] dark:bg-[#1D231F] border border-[#DCE3DD] dark:border-[#2D3630] rounded-xl px-3.5 py-2.5 focus-within:border-[#124E35]">
                <input
                  ref={sessionInputRef}
                  id="train-session-name"
                  type="text"
                  maxLength={32}
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                  placeholder="e.g. Next Activity, Break Ends..."
                  className="w-full bg-transparent text-sm font-semibold text-[#18221C] dark:text-white focus:outline-none pr-7"
                />
                <button
                  type="button"
                  onClick={() => sessionInputRef.current?.focus()}
                  className="text-[#526056] hover:text-[#124E35] cursor-pointer"
                  aria-label="Edit session name"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Sound Alert / Fullscreen / Show Time Toggles */}
            <div className="pt-2 border-t border-[#E6ECE8] dark:border-[#252D28] flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-[#26302A] dark:text-slate-200">
              <div className="flex items-center gap-2">
                {soundEnabled ? (
                  <Bell className="w-4 h-4 text-[#18221C] dark:text-slate-200" />
                ) : (
                  <BellOff className="w-4 h-4 text-slate-400" />
                )}
                <span>Sound</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={soundEnabled}
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`w-10 h-5.5 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                    soundEnabled ? 'bg-[#1D7A46]' : 'bg-stone-300 dark:bg-stone-700'
                  }`}
                >
                  <span
                    className={`w-4.5 h-4.5 rounded-full bg-white shadow-xs transition-transform ${
                      soundEnabled ? 'translate-x-4.5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <button
                type="button"
                onClick={toggleFullscreen}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-[#EEF2EF] dark:hover:bg-[#1E2420] transition-colors cursor-pointer"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
                <span>Fullscreen</span>
              </button>

              <div className="flex items-center gap-2">
                {showTime ? (
                  <Eye className="w-4 h-4 text-[#18221C] dark:text-slate-200" />
                ) : (
                  <EyeOff className="w-4 h-4 text-slate-400" />
                )}
                <span>Show Time</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={showTime}
                  onClick={() => setShowTime(!showTime)}
                  className={`w-10 h-5.5 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                    showTime ? 'bg-[#1D7A46]' : 'bg-stone-300 dark:bg-stone-700'
                  }`}
                >
                  <span
                    className={`w-4.5 h-4.5 rounded-full bg-white shadow-xs transition-transform ${
                      showTime ? 'translate-x-4.5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
          )}

          {/* RIGHT COLUMN (3 cols): TRAIN THEME & TRAIN STYLE */}
          {!isFullscreen && (
            <div className="lg:col-span-3 flex flex-col justify-between space-y-4 border-t lg:border-t-0 lg:border-l border-[#E6ECE8] dark:border-[#252D28] pt-4 lg:pt-0 lg:pl-6">
              {/* Train Theme 2x2 Grid */}
              <div>
                <h3 className="text-sm font-bold text-[#18221C] dark:text-white mb-2.5">
                  Train Theme
                </h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {(Object.values(TRAIN_THEMES) as TrainThemeConfig[]).map((t) => {
                    const active = themeId === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setThemeId(t.id)}
                        className={`group rounded-xl p-1.5 border text-center transition-all cursor-pointer ${
                          active
                            ? 'border-[#1D7A46] ring-2 ring-[#1D7A46]/25 bg-emerald-50/40 dark:bg-emerald-950/20'
                            : 'border-[#DCE3DD] dark:border-[#2C352F] bg-[#F8FAF8] dark:bg-[#1A201C] hover:border-[#1D7A46]/50'
                        }`}
                      >
                        <div
                          className="w-full h-14 rounded-lg flex flex-col items-center justify-center relative overflow-hidden border border-black/20 px-1.5"
                          style={{ background: t.sceneOverlay, backgroundColor: '#171412' }}
                        >
                          <div
                            className="w-full rounded px-1.5 py-1 border flex flex-col items-center"
                            style={{
                              background: t.boardInnerBg,
                              borderColor: t.boardBorder,
                            }}
                          >
                            <span
                              className="text-[7px] font-bold uppercase tracking-wider truncate w-full text-center"
                              style={{ color: t.accentText }}
                            >
                              {t.platformLabel}
                            </span>
                            <span
                              className="font-mono text-xs font-extrabold tracking-wider"
                              style={{ color: t.digitColor }}
                            >
                              25:00
                            </span>
                          </div>
                        </div>
                        <div className="mt-1.5 text-[11px] font-bold text-[#18221C] dark:text-slate-200 truncate">
                          {t.name}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Train Style Selector (4 Illustrated Locomotives) */}
              <div>
                <h3 className="text-sm font-bold text-[#18221C] dark:text-white mb-2">
                  Train Style
                </h3>
                <div className="grid grid-cols-4 gap-1.5">
                  {TRAIN_STYLES.map((st) => {
                    const active = trainStyleId === st.id;
                    return (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setTrainStyleId(st.id)}
                        title={st.name}
                        className={`rounded-xl p-1.5 border transition-all cursor-pointer flex flex-col items-center ${
                          active
                            ? 'border-[#1D7A46] ring-2 ring-[#1D7A46]/25 bg-emerald-50/50 dark:bg-emerald-950/30'
                            : 'border-[#DCE3DD] dark:border-[#2C352F] bg-[#F8FAF8] dark:bg-[#1A201C] hover:border-[#1D7A46]/40'
                        }`}
                      >
                        <TrainCarriageIllustration styleId={st.id} isRunning={false} compact />
                        <span className="text-[9px] font-bold text-[#3A463E] dark:text-slate-300 truncate w-full text-center mt-0.5">
                          {st.name.split(' ')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Save as Default Button */}
              <button
                type="button"
                onClick={handleSaveDefault}
                className="w-full py-2.5 px-4 rounded-xl border border-[#2A855E] text-[#1A6646] dark:text-emerald-300 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/30 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {savedToast ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Saved as Default!</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4" />
                    <span>Save as Default</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* BOTTOM PANORAMIC ILLUSTRATED TRAIN ROUTE & PLATFORM PROGRESS BAR */}
        <div className="relative w-full border-t border-[#DCE3DD] dark:border-[#262E29] bg-gradient-to-b from-[#D7E9F7] via-[#EBF4FA] to-[#E6E2D8] dark:from-[#131C24] dark:via-[#19242B] dark:to-[#1E221F] pt-5 pb-4 px-4 sm:px-8 overflow-hidden select-none">
          {/* Scenic Distant Mountains & Trees Backdrop */}
          <svg
            viewBox="0 0 1200 120"
            className="absolute inset-x-0 top-0 w-full h-28 object-cover pointer-events-none opacity-80 dark:opacity-35"
            preserveAspectRatio="none"
          >
            {/* Distant Mountains */}
            <polygon points="0,110 140,32 290,110" fill="#B8D0E6" />
            <polygon points="210,110 380,18 550,110" fill="#9FBCD8" opacity="0.7" />
            <polygon points="480,110 660,28 830,110" fill="#C2D8EC" />
            <polygon points="760,110 950,24 1140,110" fill="#B0CBE2" />
            {/* Rolling Green Hills */}
            <path
              d="M0,115 Q180,68 380,98 T780,92 T1200,102 L1200,120 L0,120 Z"
              fill="#84B578"
            />
            <path
              d="M0,120 Q280,82 600,104 T1200,96 L1200,120 L0,120 Z"
              fill="#629658"
            />
          </svg>

          {/* Route Stage: START Station — Railway Track + Moving Train — ARRIVAL Station */}
          <div className="relative z-10 max-w-6xl mx-auto">
            <div className="relative flex items-end justify-between min-h-[78px] sm:min-h-[88px] pb-2">
              {/* LEFT: START STATION BUILDING */}
              <div className="relative z-20 flex flex-col items-center shrink-0">
                {/* Wooden Station Roof & Facade */}
                <div className="relative w-24 sm:w-28 bg-[#8C5832] border-2 border-[#5A351B] rounded-t-lg pt-2 pb-2.5 px-2 shadow-md flex flex-col items-center">
                  <div className="px-2.5 py-0.5 rounded bg-white text-[#18221C] font-extrabold text-[11px] sm:text-xs tracking-wider uppercase shadow-2xs border border-stone-300">
                    START
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="w-3.5 h-4 rounded-t-xs bg-[#FDE68A] border border-[#5A351B]" />
                    <span className="w-4 h-5 rounded-t-xs bg-[#432612] border border-[#5A351B]" />
                    <span className="w-3.5 h-4 rounded-t-xs bg-[#FDE68A] border border-[#5A351B]" />
                  </div>
                </div>
                <div className="w-28 sm:w-32 h-2.5 bg-[#6E472B] rounded-xs shadow-xs" />
              </div>

              {/* CENTER: RAILWAY TRACK BED & MOVING ILLUSTRATED TRAIN */}
              <div className="relative flex-1 mx-1 sm:mx-2 h-[66px] flex items-end">
                {/* Gravel Ballast & Wooden Sleepers + Steel Rails */}
                <div className="absolute inset-x-0 bottom-0 h-3 bg-gradient-to-b from-[#78716C] to-[#57534E] rounded-xs overflow-hidden flex items-center justify-around">
                  {Array.from({ length: 34 }).map((_, idx) => (
                    <span key={idx} className="w-1.5 h-full bg-[#3E2723]/80 inline-block" />
                  ))}
                </div>
                <div className="absolute inset-x-0 bottom-2.5 h-[3px] bg-gradient-to-r from-stone-400 via-stone-200 to-stone-400 shadow-2xs" />

                {/* Animated Train Positioned by Countdown Progress (0% -> 100%) */}
                <div
                  className="absolute bottom-1.5 transition-all duration-300 ease-out"
                  style={{
                    left: `${progress * 100}%`,
                    transform: `translateX(-${progress * 100}%)`,
                  }}
                >
                  <TrainCarriageIllustration
                    styleId={trainStyleId}
                    isRunning={isRunning && !reducedMotion}
                  />
                </div>
              </div>

              {/* RIGHT: ARRIVAL STATION BUILDING */}
              <div className="relative z-20 flex flex-col items-center shrink-0">
                <div className="relative w-24 sm:w-28 bg-[#8C5832] border-2 border-[#5A351B] rounded-t-lg pt-2 pb-2.5 px-2 shadow-md flex flex-col items-center">
                  <div
                    className={`px-2.5 py-0.5 rounded font-extrabold text-[11px] sm:text-xs tracking-wider uppercase shadow-2xs border ${
                      isCompleted
                        ? 'bg-emerald-500 text-white border-emerald-700 animate-bounce'
                        : 'bg-white text-[#18221C] border-stone-300'
                    }`}
                  >
                    ARRIVAL
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="w-3.5 h-4 rounded-t-xs bg-[#FDE68A] border border-[#5A351B]" />
                    <span className="w-4 h-5 rounded-t-xs bg-[#432612] border border-[#5A351B]" />
                    <span className="w-3.5 h-4 rounded-t-xs bg-[#FDE68A] border border-[#5A351B]" />
                  </div>
                </div>
                <div className="w-28 sm:w-32 h-2.5 bg-[#6E472B] rounded-xs shadow-xs" />
              </div>
            </div>

            {/* PLATFORM-STYLE PROGRESS INDICATOR BAR WITH STATION NODES */}
            <div className="relative mt-2 px-6 sm:px-10">
              <div className="relative h-3 rounded-full bg-[#64748B]/40 dark:bg-slate-700 border border-white/60 dark:border-slate-600 shadow-inner flex items-center">
                {/* Green Active Progress Fill */}
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#166534] via-[#15803D] to-[#22C55E] transition-all duration-300"
                  style={{ width: `${Math.round(progress * 100)}%` }}
                />

                {/* 5 Station Checkpoints (0%, 25%, 50%, 75%, 100% Arrival Pin) */}
                {[0, 0.25, 0.5, 0.75].map((stop) => {
                  const reached = progress >= stop;
                  return (
                    <span
                      key={stop}
                      style={{ left: `${stop * 100}%` }}
                      className={`absolute -translate-x-1/2 w-4 h-4 rounded-full border-2 shadow-xs transition-colors ${
                        reached
                          ? 'bg-[#15803D] border-white'
                          : 'bg-[#475569] border-white'
                      }`}
                    />
                  );
                })}

                {/* Final Red Arrival Pin at 100% */}
                <div
                  style={{ left: '100%' }}
                  className="absolute -translate-x-1/2 -top-3.5 flex flex-col items-center"
                >
                  <div className="w-6 h-6 rounded-full bg-[#DC2626] border-2 border-white shadow-md flex items-center justify-center text-white">
                    <MapPin className="w-3.5 h-3.5 fill-current" />
                  </div>
                </div>
              </div>

              {/* Bottom Remaining Time Readout */}
              <div className="mt-2 text-center">
                <span className="font-sans text-base sm:text-lg font-extrabold text-[#18221C] dark:text-white tracking-tight">
                  {isCompleted ? (
                    <span className="text-[#15803D] dark:text-emerald-400">
                      00:00 — Arrived at {activeTheme.platformLabel} ({sessionName || 'Next Activity'})
                    </span>
                  ) : (
                    <>
                      <span className="font-mono">{formattedRemaining}</span> Remaining
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK PRESETS BAR */}
      <div>
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#142018] dark:text-white">
          Quick Presets
        </h2>
        <p className="text-xs sm:text-sm text-[#4A554E] dark:text-slate-400 mt-0.5 mb-3.5">
          Start with a common time or set a custom duration.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {PRESET_MINUTES.map((preset) => {
            const active =
              !isCustomMode &&
              mode === 'duration' &&
              totalSeconds === preset.minutes * 60;
            return (
              <button
                key={preset.minutes}
                type="button"
                onClick={() => handleSelectPreset(preset.minutes)}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  active
                    ? 'bg-[#EEF6F0] dark:bg-emerald-950/30 border-[#2A7B4C] shadow-xs'
                    : 'bg-white dark:bg-[#161B18] border-[#DCE3DD] dark:border-[#262E29] hover:border-[#2A7B4C]/50'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#15803D] dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <TrainFront className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-bold text-[#142018] dark:text-white truncate">
                    {preset.minutes} {preset.minutes === 1 ? 'Minute' : 'Minutes'}
                  </div>
                  <div className="text-[11px] text-[#526056] dark:text-slate-400 truncate">
                    {preset.sub}
                  </div>
                </div>
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => {
              setMode('duration');
              setIsCustomMode(true);
            }}
            className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
              isCustomMode
                ? 'bg-[#EEF6F0] dark:bg-emerald-950/30 border-[#2A7B4C] shadow-xs'
                : 'bg-white dark:bg-[#161B18] border-[#DCE3DD] dark:border-[#262E29] hover:border-[#2A7B4C]/50'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#15803D] dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Settings className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs sm:text-sm font-bold text-[#142018] dark:text-white truncate">
                Custom
              </div>
              <div className="text-[11px] text-[#526056] dark:text-slate-400 truncate">
                Set your own time
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

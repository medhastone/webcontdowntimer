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
  Bookmark,
  Check,
  Settings,
  ChevronUp,
  ChevronDown,
  Flame,
} from 'lucide-react';

export type ForestThemeId = 'classic-forest' | 'pine-valley' | 'autumn-woods' | 'mountain-forest';
export type FireStyleId = 'warm-flame' | 'ember-spark' | 'radiant-wave';
export type IntensityLevel = 1 | 2 | 3; // 1 = Gentle, 2 = Normal, 3 = Vibrant

interface ForestThemeConfig {
  id: ForestThemeId;
  name: string;
  skyTop: string;
  skyMid: string;
  skyWarmGlow: string;
  farMountain: string;
  midMountain: string;
  nearHill: string;
  groundBase: string;
  treeFar: string;
  treeMid: string;
  treeNear: string;
  trunkColor: string;
}

const FOREST_THEMES: Record<ForestThemeId, ForestThemeConfig> = {
  'classic-forest': {
    id: 'classic-forest',
    name: 'Classic Forest',
    skyTop: '#163B4D',
    skyMid: '#375A5F',
    skyWarmGlow: '#D96B27',
    farMountain: '#3E5C63',
    midMountain: '#2F484E',
    nearHill: '#2A4226',
    groundBase: '#3A4F24',
    treeFar: '#274437',
    treeMid: '#1F3A27',
    treeNear: '#2E4C1E',
    trunkColor: '#3D2618',
  },
  'pine-valley': {
    id: 'pine-valley',
    name: 'Pine Valley',
    skyTop: '#1E4E68',
    skyMid: '#4A7C8C',
    skyWarmGlow: '#E07A35',
    farMountain: '#4B6E7C',
    midMountain: '#355764',
    nearHill: '#1E4631',
    groundBase: '#2D5A36',
    treeFar: '#234F3E',
    treeMid: '#183D2D',
    treeNear: '#1F4E29',
    trunkColor: '#362214',
  },
  'autumn-woods': {
    id: 'autumn-woods',
    name: 'Autumn Woods',
    skyTop: '#3A2338',
    skyMid: '#7C4439',
    skyWarmGlow: '#F59E0B',
    farMountain: '#633B3E',
    midMountain: '#4E2C2E',
    nearHill: '#5A3219',
    groundBase: '#6E3D16',
    treeFar: '#854D27',
    treeMid: '#9A3412',
    treeNear: '#B45309',
    trunkColor: '#2E1A0F',
  },
  'mountain-forest': {
    id: 'mountain-forest',
    name: 'Mountain Forest',
    skyTop: '#0F2942',
    skyMid: '#2B5372',
    skyWarmGlow: '#EA580C',
    farMountain: '#64748B',
    midMountain: '#475569',
    nearHill: '#1E3A2F',
    groundBase: '#274434',
    treeFar: '#1E3A3A',
    treeMid: '#132E2B',
    treeNear: '#1B3B2B',
    trunkColor: '#2B1B12',
  },
};

const FIRE_STYLES: Array<{
  id: FireStyleId;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  coreColor: string;
}> = [
  {
    id: 'warm-flame',
    name: 'Warm Flame',
    primaryColor: '#EA580C',
    secondaryColor: '#F59E0B',
    coreColor: '#FEF08A',
  },
  {
    id: 'ember-spark',
    name: 'Ember Glow',
    primaryColor: '#DC2626',
    secondaryColor: '#FB923C',
    coreColor: '#FDE047',
  },
  {
    id: 'radiant-wave',
    name: 'Golden Wave',
    primaryColor: '#D97706',
    secondaryColor: '#FBBF24',
    coreColor: '#FFFBEB',
  },
];

const PRESET_MINUTES = [
  { label: '1 min', minutes: 1, sub: 'Quick task' },
  { label: '3 min', minutes: 3, sub: 'Short break' },
  { label: '5 min', minutes: 5, sub: 'Activity round' },
  { label: '10 min', minutes: 10, sub: 'Focus time' },
  { label: '25 min', minutes: 25, sub: 'Study session' },
];

const INTENSITY_LABELS: Record<IntensityLevel, string> = {
  1: 'Gentle',
  2: 'Normal',
  3: 'Vibrant',
};

const STORAGE_KEY = 'timetools_forest_fire_timer_defaults_v1';

interface EmberParticle {
  id: number;
  xOffset: number;
  size: number;
  speed: number;
  phase: number;
  drift: number;
}

const EMBER_PARTICLES: EmberParticle[] = Array.from({ length: 28 }).map((_, i) => ({
  id: i,
  xOffset: (i * 37) % 100,
  size: 1.8 + (i % 4) * 0.9,
  speed: 0.6 + (i % 5) * 0.25,
  phase: (i * 0.42) % (Math.PI * 2),
  drift: (i % 2 === 0 ? 1 : -1) * (4 + (i % 4) * 2),
}));

interface ForestFireSceneProps {
  theme: ForestThemeConfig;
  fireStyleId: FireStyleId;
  progress: number; // 0 to 1
  isRunning: boolean;
  isCompleted: boolean;
  intensity: IntensityLevel;
  reducedMotion: boolean;
}

function ForestFireScene({
  theme,
  fireStyleId,
  progress,
  isRunning,
  isCompleted,
  intensity,
  reducedMotion,
}: ForestFireSceneProps) {
  const [animTick, setAnimTick] = useState<number>(0);
  const fireStyle = FIRE_STYLES.find((s) => s.id === fireStyleId) || FIRE_STYLES[0];

  useEffect(() => {
    if (reducedMotion || (!isRunning && !isCompleted)) return;
    let rafId: number;
    let start: number | null = null;

    const step = (ts: number) => {
      if (!start) start = ts;
      const elapsed = (ts - start) / 1000;
      setAnimTick(elapsed);
      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [isRunning, isCompleted, reducedMotion]);

  // Visible warm spread starts with an inviting baseline preview (like the mockup)
  // when idle at 0%, and grows across the entire landscape from 8% -> 100% as time elapses.
  const visualSpread =
    progress === 0 && !isRunning && !isCompleted
      ? 0.42
      : Math.min(1, 0.08 + progress * 0.92);

  // Flame X boundary spreads from right (x=760) toward left (x=80) across the 800px viewBox
  const spreadStartX = 765;
  const spreadLeftEdge = spreadStartX - visualSpread * 665;

  const flickerMultiplier = reducedMotion
    ? 0
    : intensity === 1
      ? 0.45
      : intensity === 2
        ? 1
        : 1.55;

  const pulseA = Math.sin(animTick * 4.2) * 5 * flickerMultiplier;
  const pulseB = Math.cos(animTick * 5.6) * 6 * flickerMultiplier;
  const pulseC = Math.sin(animTick * 3.1 + 1.2) * 4 * flickerMultiplier;

  return (
    <svg
      viewBox="0 0 800 500"
      className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Sky Gradient that warms as countdown progresses */}
        <linearGradient id="forestSkyGrad" x1="0" y1="0" x2="0.25" y2="1">
          <stop offset="0%" stopColor={theme.skyTop} />
          <stop offset="52%" stopColor={theme.skyMid} />
          <stop
            offset="100%"
            stopColor={isCompleted ? '#F59E0B' : theme.skyWarmGlow}
            stopOpacity={isCompleted ? 0.85 : 0.45 + visualSpread * 0.45}
          />
        </linearGradient>

        {/* Ambient Warm Glow radiating from the spreading ember field */}
        <radialGradient
          id="emberAtmosphereGlow"
          cx={`${Math.max(25, 88 - visualSpread * 48)}%`}
          cy="76%"
          r={`${35 + visualSpread * 42}%`}
        >
          <stop
            offset="0%"
            stopColor={fireStyle.coreColor}
            stopOpacity={isCompleted ? 0.48 : 0.55}
          />
          <stop
            offset="40%"
            stopColor={fireStyle.secondaryColor}
            stopOpacity={isCompleted ? 0.32 : 0.42}
          />
          <stop
            offset="75%"
            stopColor={fireStyle.primaryColor}
            stopOpacity={isCompleted ? 0.16 : 0.22}
          />
          <stop offset="100%" stopColor={fireStyle.primaryColor} stopOpacity="0" />
        </radialGradient>

        {/* Glowing Fire Floor Gradient */}
        <linearGradient id="fireFloorGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={fireStyle.coreColor} />
          <stop offset="35%" stopColor={fireStyle.secondaryColor} />
          <stop offset="80%" stopColor={fireStyle.primaryColor} />
          <stop offset="100%" stopColor="#991B1B" />
        </linearGradient>

        {/* Clip Path for the Spreading Warm Field */}
        <clipPath id="spreadingFireClip">
          <rect
            x={Math.max(45, spreadLeftEdge)}
            y="180"
            width={Math.min(755, 800 - Math.max(45, spreadLeftEdge))}
            height="320"
          />
        </clipPath>
      </defs>

      {/* 1. SKY BACKDROP */}
      <rect width="800" height="500" fill="url(#forestSkyGrad)" />

      {/* Soft distant clouds / atmospheric mist */}
      <g opacity="0.22" fill="#FDE68A">
        <ellipse cx="620" cy="145" rx="140" ry="26" />
        <ellipse cx="460" cy="175" rx="110" ry="20" />
        <ellipse cx="230" cy="160" rx="95" ry="18" />
      </g>

      {/* 2. DISTANT MOUNTAIN RANGES */}
      <polygon
        points="-20,360 110,210 245,305 410,165 565,285 695,185 820,290 820,420 -20,420"
        fill={theme.farMountain}
      />
      {theme.id === 'mountain-forest' && (
        <g fill="#E2E8F0" opacity="0.75">
          <polygon points="110,210 82,248 112,240 138,250" />
          <polygon points="410,165 372,216 408,204 446,218" />
          <polygon points="695,185 664,228 696,218 726,230" />
        </g>
      )}

      {/* Mid-ground Mountain Ridge */}
      <polygon
        points="-20,385 75,265 215,340 345,245 505,335 645,235 820,330 820,440 -20,440"
        fill={theme.midMountain}
      />

      {/* 3. DISTANT TREELINE SILHOUETTE */}
      <g fill={theme.treeFar} opacity="0.9">
        {[
          40, 75, 115, 160, 210, 255, 295, 340, 385, 430, 470, 515, 555, 600, 640, 685, 730,
          770,
        ].map((tx, idx) => {
          const h = 48 + (idx % 4) * 14;
          const baseY = 358 - (idx % 3) * 8;
          return (
            <g key={tx}>
              <polygon
                points={`${tx},${baseY - h} ${tx - 16},${baseY} ${tx + 16},${baseY}`}
              />
              <polygon
                points={`${tx},${baseY - h * 0.75} ${tx - 20},${baseY + 8} ${tx + 20},${baseY + 8}`}
              />
            </g>
          );
        })}
      </g>

      {/* 4. AMBIENT WARM GLOW OVER THE VALLEY */}
      <rect width="800" height="500" fill="url(#emberAtmosphereGlow)" />

      {/* 5. SLOPING FOREST HILLS & CLEARING FLOOR */}
      {/* Right & Center Sloping Meadow */}
      <path
        d="M120,415 Q380,360 800,320 L800,480 L120,480 Z"
        fill={theme.groundBase}
      />
      {/* Left Foreground Hill */}
      <path
        d="M-20,355 Q190,375 390,440 L390,500 L-20,500 Z"
        fill={theme.nearHill}
      />
      {/* Lower Foreground Bank */}
      <path
        d="M-20,435 Q360,405 820,375 L820,500 L-20,500 Z"
        fill="#1B2818"
      />

      {/* 6. STYLIZED SPREADING EMBER & FLAME FIELD (CLIPPED TO PROGRESS) */}
      <g clipPath="url(#spreadingFireClip)">
        {/* Warm Glowing Ground Carpet */}
        <path
          d="M60,435 Q390,375 800,325 L800,455 Q410,435 60,465 Z"
          fill="url(#fireFloorGrad)"
          opacity={isCompleted ? 0.65 : 0.92}
        />

        {/* Inner Bright Golden Core Stream */}
        <path
          d={`M75,436 Q260,${404 + pulseA} 460,${376 + pulseB} T800,334 L800,378 Q470,412 75,448 Z`}
          fill={fireStyle.secondaryColor}
          opacity={isCompleted ? 0.55 : 0.88}
        />

        {/* Stylized Artistic Flame Ribbons & Licks (Calm Golden Glow when Completed) */}
        {!isCompleted ? (
          <g>
            {[
              { x: 745, y: 332, w: 34, h: 46 },
              { x: 700, y: 340, w: 30, h: 42 },
              { x: 655, y: 348, w: 36, h: 52 },
              { x: 610, y: 356, w: 28, h: 38 },
              { x: 565, y: 364, w: 35, h: 48 },
              { x: 520, y: 372, w: 30, h: 42 },
              { x: 475, y: 379, w: 34, h: 45 },
              { x: 430, y: 386, w: 28, h: 38 },
              { x: 385, y: 393, w: 32, h: 44 },
              { x: 340, y: 400, w: 28, h: 36 },
              { x: 295, y: 407, w: 30, h: 40 },
              { x: 250, y: 413, w: 26, h: 35 },
              { x: 205, y: 419, w: 28, h: 34 },
              { x: 160, y: 424, w: 24, h: 30 },
              { x: 115, y: 429, w: 22, h: 28 },
            ].map((f, idx) => {
              const wave =
                idx % 2 === 0 ? pulseA : idx % 3 === 0 ? pulseB : pulseC;
              const scaleH =
                intensity === 1 ? 0.72 : intensity === 2 ? 1 : 1.28;
              const fh = f.h * scaleH;
              return (
                <g key={f.x}>
                  {/* Outer Orange Flame Tongue */}
                  <path
                    d={`M${f.x - f.w / 2},${f.y + 12} Q${f.x - f.w * 0.25},${
                      f.y - fh * 0.55
                    } ${f.x + wave},${f.y - fh} Q${f.x + f.w * 0.35},${
                      f.y - fh * 0.45
                    } ${f.x + f.w / 2},${f.y + 12} Z`}
                    fill={fireStyle.primaryColor}
                    opacity="0.92"
                  />
                  {/* Mid Amber Flame Tongue */}
                  <path
                    d={`M${f.x - f.w * 0.35},${f.y + 12} Q${f.x - f.w * 0.15},${
                      f.y - fh * 0.4
                    } ${f.x + wave * 0.7},${f.y - fh * 0.76} Q${
                      f.x + f.w * 0.22
                    },${f.y - fh * 0.35} ${f.x + f.w * 0.35},${f.y + 12} Z`}
                    fill={fireStyle.secondaryColor}
                  />
                  {/* Bright Yellow-White Core */}
                  <path
                    d={`M${f.x - f.w * 0.18},${f.y + 12} Q${f.x},${
                      f.y - fh * 0.45
                    } ${f.x + wave * 0.4},${f.y - fh * 0.52} Q${
                      f.x + f.w * 0.12
                    },${f.y - fh * 0.22} ${f.x + f.w * 0.18},${f.y + 12} Z`}
                    fill={fireStyle.coreColor}
                  />
                </g>
              );
            })}
          </g>
        ) : (
          /* Completed Calm Dawn/Twilight State: Serene warm golden meadow shimmer */
          <path
            d="M70,435 Q395,382 800,335 L800,375 Q410,418 70,446 Z"
            fill="#FEF08A"
            opacity="0.65"
          />
        )}

        {/* Glowing Frontier Leading Edge */}
        <ellipse
          cx={Math.max(65, spreadLeftEdge + 12)}
          cy={432 - (1 - visualSpread) * 48}
          rx="26"
          ry="12"
          fill={fireStyle.coreColor}
          opacity="0.95"
        />
      </g>

      {/* 7. RISING GLOWING EMBER SPARKS */}
      <g>
        {EMBER_PARTICLES.slice(0, intensity === 1 ? 10 : intensity === 2 ? 18 : 28).map(
          (p) => {
            const activeWidth = Math.max(80, 760 - spreadLeftEdge);
            const px =
              Math.max(60, spreadLeftEdge) + ((p.xOffset / 100) * activeWidth) +
              (reducedMotion ? 0 : Math.sin(animTick * p.speed + p.phase) * p.drift);
            const cycle = reducedMotion
              ? (p.id * 13) % 140
              : (animTick * 28 * p.speed + p.id * 19) % 160;
            const py = 395 - cycle;
            const op = Math.max(0, Math.min(0.9, 1 - cycle / 160));
            return (
              <circle
                key={p.id}
                cx={px}
                cy={py}
                r={p.size}
                fill={p.id % 2 === 0 ? fireStyle.coreColor : fireStyle.secondaryColor}
                opacity={op}
              />
            );
          }
        )}
      </g>

      {/* 8. MIDGROUND & FOREGROUND CONIFER AND DECIDUOUS TREES (Framing Left & Right like Mockup) */}
      {/* Right Side Tall Pine Trees */}
      {[
        { x: 755, baseY: 365, scale: 1.25 },
        { x: 695, baseY: 375, scale: 1.05 },
        { x: 642, baseY: 362, scale: 0.88 },
        { x: 588, baseY: 372, scale: 0.78 },
        { x: 525, baseY: 382, scale: 0.72 },
      ].map((t, i) => (
        <g
          key={t.x}
          transform={`translate(${t.x}, ${t.baseY}) scale(${t.scale})`}
        >
          {/* Trunk */}
          <rect x="-5" y="-22" width="10" height="32" fill={theme.trunkColor} />
          {/* Layered Pine Branches with subtle warm rim light on left side */}
          <polygon points="0,-145 -38,-85 38,-85" fill={theme.treeMid} />
          <polygon points="0,-118 -46,-52 46,-52" fill={theme.treeMid} />
          <polygon points="0,-88 -54,-18 54,-18" fill={theme.treeNear} />
          {/* Warm Rim Highlight from Fire Glow */}
          <polygon
            points="0,-145 -38,-85 -8,-85"
            fill={fireStyle.secondaryColor}
            opacity={0.18 + (i * 0.04)}
          />
          <polygon
            points="0,-88 -54,-18 -12,-18"
            fill={fireStyle.primaryColor}
            opacity="0.24"
          />
        </g>
      ))}

      {/* Left Foreground Lush Broadleaf & Pine Trees + Rocks & Logs (Matching Mockup Left Side) */}
      {/* Tall Left Background Pine */}
      <g transform="translate(42, 395) scale(1.3)">
        <rect x="-6" y="-20" width="12" height="35" fill={theme.trunkColor} />
        <polygon points="0,-155 -42,-92 42,-92" fill={theme.treeMid} />
        <polygon points="0,-122 -50,-54 50,-54" fill={theme.treeNear} />
        <polygon points="0,-86 -58,-15 58,-15" fill={theme.treeNear} />
      </g>

      {/* Main Left Hero Deciduous Tree with Warm Backlit Canopy */}
      <g transform="translate(125, 425)">
        {/* Trunk & Branches */}
        <path
          d="M-10,10 L-7,-95 L-28,-135 L-18,-138 L-4,-108 L8,-145 L16,-142 L5,-98 L26,-122 L31,-116 L7,-82 L12,10 Z"
          fill={theme.trunkColor}
        />
        {/* Warm Backlit Foliage Edge (Right side facing the fire) */}
        <circle cx="28" cy="-145" r="36" fill="#D97706" opacity="0.85" />
        <circle cx="42" cy="-115" r="28" fill="#EA580C" opacity="0.8" />
        <circle cx="15" cy="-175" r="34" fill="#CA8A04" opacity="0.85" />
        {/* Main Lush Green/Autumn Canopy Clusters */}
        <circle cx="-24" cy="-148" r="40" fill={theme.treeMid} />
        <circle cx="4" cy="-168" r="38" fill={theme.treeNear} />
        <circle cx="-12" cy="-118" r="36" fill={theme.treeNear} />
        <circle cx="22" cy="-126" r="32" fill="#4D7C2B" opacity="0.85" />
        <circle cx="-38" cy="-115" r="28" fill={theme.treeMid} />
      </g>

      {/* Secondary Left Midground Tree */}
      <g transform="translate(218, 412) scale(0.78)">
        <rect x="-6" y="-10" width="12" height="24" fill={theme.trunkColor} />
        <polygon points="0,-135 -36,-78 36,-78" fill={theme.treeMid} />
        <polygon points="0,-104 -44,-42 44,-42" fill={theme.treeNear} />
        <polygon points="0,-72 -50,-8 50,-8" fill={theme.treeNear} />
        <polygon
          points="0,-104 44,-42 10,-42"
          fill={fireStyle.secondaryColor}
          opacity="0.3"
        />
      </g>

      {/* Foreground Boulders, Fallen Log & Ferns */}
      <g>
        {/* Left Boulders */}
        <path
          d="M18,452 L38,426 L74,432 L88,455 Z"
          fill="#475569"
        />
        <path
          d="M38,426 L74,432 L62,453 L28,452 Z"
          fill="#64748B"
        />
        <path
          d="M142,445 L168,424 L205,432 L214,452 Z"
          fill="#475569"
        />
        {/* Fallen Log in Foreground */}
        <path
          d="M285,446 L395,428 L402,440 L290,458 Z"
          fill="#4A2C18"
        />
        <ellipse cx="287" cy="452" rx="5" ry="6" fill="#A16207" />
        {/* Right Foreground Silhouette Bushes */}
        <circle cx="740" cy="435" r="26" fill="#141E15" />
        <circle cx="775" cy="425" r="32" fill="#141E15" />
        <circle cx="695" cy="445" r="20" fill="#19261A" />
      </g>
    </svg>
  );
}

interface ForestFireTimerComponentProps {
  initialMinutes?: number;
}

export default function ForestFireTimerComponent({
  initialMinutes = 25,
}: ForestFireTimerComponentProps) {
  const [mode, setMode] = useState<'duration' | 'endTime'>('duration');
  const [totalSeconds, setTotalSeconds] = useState<number>(initialMinutes * 60);
  const [remainingMs, setRemainingMs] = useState<number>(initialMinutes * 60 * 1000);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const [customMinutes, setCustomMinutes] = useState<number>(initialMinutes);
  const [customSeconds, setCustomSeconds] = useState<number>(0);
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [endTimeInput, setEndTimeInput] = useState<string>('17:00');

  const [themeId, setThemeId] = useState<ForestThemeId>('classic-forest');
  const [fireStyleId, setFireStyleId] = useState<FireStyleId>('warm-flame');
  const [intensity, setIntensity] = useState<IntensityLevel>(2);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showTime, setShowTime] = useState<boolean>(true);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [savedToast, setSavedToast] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const targetEndTimeRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Load saved defaults and system reduced-motion preference
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const id = window.requestAnimationFrame(() => {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mq.matches) {
        setReducedMotion(true);
      }

      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.themeId && FOREST_THEMES[parsed.themeId as ForestThemeId]) {
            setThemeId(parsed.themeId);
          }
          if (parsed.fireStyleId) {
            setFireStyleId(parsed.fireStyleId);
          }
          if (parsed.intensity === 1 || parsed.intensity === 2 || parsed.intensity === 3) {
            setIntensity(parsed.intensity);
          }
          if (typeof parsed.soundEnabled === 'boolean') {
            setSoundEnabled(parsed.soundEnabled);
          }
          if (typeof parsed.showTime === 'boolean') {
            setShowTime(parsed.showTime);
          }
          if (typeof parsed.reducedMotion === 'boolean') {
            setReducedMotion(parsed.reducedMotion);
          }
          if (typeof parsed.minutes === 'number' && parsed.minutes > 0) {
            const secs = parsed.minutes * 60 + (parsed.seconds || 0);
            setCustomMinutes(parsed.minutes);
            setCustomSeconds(parsed.seconds || 0);
            setTotalSeconds(secs);
            setRemainingMs(secs * 1000);
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

  // Gentle warm nature chime on completion
  const playCompletionChime = useCallback(() => {
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

      const notes = [440, 554.37, 659.25, 880]; // Warm A-major nature chime
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.22);

        gain.gain.setValueAtTime(0.0001, ctx.currentTime + idx * 0.22);
        gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + idx * 0.22 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.22 + 0.65);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.22);
        osc.stop(ctx.currentTime + idx * 0.22 + 0.68);
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

      if (left <= 0) {
        setIsRunning(false);
        setIsCompleted(true);
        playCompletionChime();
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, playCompletionChime]);

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
      }
    }
  };

  const handleStart = () => {
    if (remainingMs <= 0) {
      setRemainingMs(totalSeconds * 1000);
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
  };

  const handleSaveDefault = () => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          themeId,
          fireStyleId,
          intensity,
          soundEnabled,
          showTime,
          reducedMotion,
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
      setIsFullscreen(!isFullscreen);
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

  // Format remaining time & progress percentage
  const totalMs = Math.max(1000, totalSeconds * 1000);
  const progress = Math.min(1, Math.max(0, 1 - remainingMs / totalMs));
  const progressPercent = Math.round(progress * 100);

  const displayTotalSec = Math.ceil(remainingMs / 1000);
  const hrs = Math.floor(displayTotalSec / 3600);
  const mins = Math.floor((displayTotalSec % 3600) / 60);
  const secs = displayTotalSec % 60;

  const formattedTime =
    hrs > 0
      ? `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(
          2,
          '0'
        )}`
      : `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const activeTheme = FOREST_THEMES[themeId];

  return (
    <div className="space-y-8">
      {/* MAIN INTERACTIVE FOREST FIRE TIMER CARD */}
      <div
        ref={containerRef}
        className="rounded-3xl bg-white/95 dark:bg-[#151816]/95 border border-[#E4E2DA] dark:border-[#262E29] shadow-[0_18px_50px_rgba(20,35,25,0.08)] p-4 sm:p-6 lg:p-7 transition-all"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-7 items-stretch">
          {/* LEFT COLUMN (5 cols): ILLUSTRATED FOREST FIRE LANDSCAPE STAGE */}
          <div className="lg:col-span-5 flex flex-col">
            <div
              className={`relative w-full overflow-hidden rounded-2xl border border-[#2C3A32] flex flex-col justify-between select-none shadow-inner min-h-[385px] sm:min-h-[425px] p-5 sm:p-6 ${
                isFullscreen ? 'timer-fullscreen-stage p-6 sm:p-10' : ''
              }`}
            >
              {/* Exit Fullscreen Button in Top-Right Corner */}
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

              {/* Animated SVG Forest & Spreading Warm Ember Scene */}
              <ForestFireScene
                theme={activeTheme}
                fireStyleId={fireStyleId}
                progress={progress}
                isRunning={isRunning}
                isCompleted={isCompleted}
                intensity={intensity}
                reducedMotion={reducedMotion}
              />

              {/* Top Centered Countdown Display Overlay */}
              <div className="relative z-10 text-center pt-1 sm:pt-2">
                {(showTime || isFullscreen) ? (
                  <>
                    <div
                      aria-live="polite"
                      className={`font-sans font-extrabold text-white tracking-tight leading-none tabular-nums drop-shadow-[0_4px_14px_rgba(0,0,0,0.55)] ${
                        isFullscreen
                          ? 'text-6xl sm:text-7xl md:text-8xl lg:text-9xl'
                          : 'text-6xl sm:text-7xl'
                      }`}
                    >
                      {formattedTime}
                    </div>
                    {!isFullscreen && (
                      <div className="mt-1.5 text-sm sm:text-base font-medium text-white/95 drop-shadow-[0_2px_6px_rgba(0,0,0,0.65)]">
                        {isCompleted ? 'Session Complete • Calm Ember Glow' : 'Forest Fire Timer'}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="inline-block px-3.5 py-1 rounded-full bg-black/35 backdrop-blur-xs text-xs font-semibold text-white/90">
                    {isCompleted ? 'Countdown Complete' : 'Forest Fire Visual Mode'}
                  </div>
                )}
              </div>

              {/* Bottom Progress Bar Pill inside Landscape Canvas */}
              <div className="relative z-10 mt-auto pt-4">
                <div className="w-full rounded-2xl bg-[#18221A]/85 backdrop-blur-md border border-white/15 px-3.5 py-2.5 flex items-center gap-3 shadow-lg">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="w-6 h-6 rounded-full bg-gradient-to-b from-amber-300 via-orange-500 to-red-600 flex items-center justify-center text-white shadow-xs">
                      <Flame className="w-3.5 h-3.5 fill-current" />
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-white">
                      {progressPercent}%
                    </span>
                  </div>

                  {/* Glowing Progress Track */}
                  <div className="flex-1 h-3 rounded-full bg-[#3A4338]/90 overflow-hidden p-0.5 shadow-inner">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#FACC15] via-[#F97316] to-[#EA580C] transition-all duration-300"
                      style={{
                        width: `${
                          progress === 0 && !isRunning && !isCompleted
                            ? 22
                            : Math.max(4, progressPercent)
                        }%`,
                      }}
                    />
                  </div>

                  <span className="text-xs sm:text-sm font-extrabold text-white shrink-0">
                    100%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* CENTER COLUMN (4 cols): TIMER CONTROLS & ANIMATION INTENSITY */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
            {/* Duration / End Time Mode Switch */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-[#EFECE4] dark:bg-[#1E2420] border border-[#DFDDD4] dark:border-[#2C352F]">
              <button
                type="button"
                onClick={() => setMode('duration')}
                className={`py-2.5 px-4 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                  mode === 'duration'
                    ? 'bg-[#174E31] text-white shadow-xs'
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
                    ? 'bg-[#174E31] text-white shadow-xs'
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
                            ? 'bg-[#174E31] text-white border-[#174E31] shadow-xs'
                            : 'bg-[#F8F6F0] dark:bg-[#1D231F] text-[#26302A] dark:text-slate-200 border-[#DFDDD4] dark:border-[#2D3630] hover:border-[#174E31]/50'
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
                        ? 'bg-[#174E31] text-white border-[#174E31] shadow-xs'
                        : 'bg-[#F8F6F0] dark:bg-[#1D231F] text-[#26302A] dark:text-slate-200 border-[#DFDDD4] dark:border-[#2D3630] hover:border-[#174E31]/50'
                    }`}
                  >
                    Custom
                  </button>
                </div>

                {/* Numeric Duration Input */}
                <div className="flex items-center gap-3">
                  <div className="relative flex items-center bg-[#F8F6F0] dark:bg-[#1D231F] border border-[#DFDDD4] dark:border-[#2D3630] rounded-xl px-3.5 py-2 w-32">
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
                        className="p-0.5 text-[#526056] hover:text-[#174E31] cursor-pointer"
                        aria-label="Increase minutes"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          applyNewDuration(Math.max(1, customMinutes - 1), customSeconds)
                        }
                        className="p-0.5 text-[#526056] hover:text-[#174E31] cursor-pointer"
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
                      <div className="relative flex items-center bg-[#F8F6F0] dark:bg-[#1D231F] border border-[#DFDDD4] dark:border-[#2D3630] rounded-xl px-3 py-2 w-24">
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
              <div className="p-3.5 rounded-xl bg-[#F8F6F0] dark:bg-[#1D231F] border border-[#DFDDD4] dark:border-[#2D3630] space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4A554E] dark:text-slate-300">
                  Target End Time
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="time"
                    value={endTimeInput}
                    onChange={(e) => handleEndTimeChange(e.target.value)}
                    className="bg-white dark:bg-[#141816] border border-[#DFDDD4] dark:border-[#2D3630] rounded-lg px-3 py-2 text-base font-bold text-[#18221C] dark:text-white focus:outline-none"
                  />
                  <span className="text-xs text-[#4A554E] dark:text-slate-400">
                    Counts down to {endTimeInput}
                  </span>
                </div>
              </div>
            )}

            {/* Primary Warm Burnt-Orange Start Button */}
            <button
              type="button"
              onClick={handleStart}
              disabled={isRunning}
              className={`w-full py-3.5 px-6 rounded-xl font-bold text-base flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-sm ${
                isRunning
                  ? 'bg-[#C84B0E]/80 text-white/95 cursor-default'
                  : 'bg-[#C84B0E] hover:bg-[#AD3E08] text-white active:scale-[0.99]'
              }`}
            >
              <Play className="w-5 h-5 fill-current" />
              <span>
                {isRunning
                  ? 'Running...'
                  : remainingMs < totalSeconds * 1000 && remainingMs > 0
                    ? 'Resume'
                    : 'Start'}
              </span>
            </button>

            {/* Pause & Reset Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={isRunning ? handlePause : handleStart}
                className="py-2.5 px-4 rounded-xl font-bold text-sm bg-[#F2F0E8] dark:bg-[#1E2420] hover:bg-[#E6E3D8] dark:hover:bg-[#28302B] text-[#18221C] dark:text-slate-100 border border-[#DFDDD4] dark:border-[#2D3630] flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="py-2.5 px-4 rounded-xl font-bold text-sm bg-[#F2F0E8] dark:bg-[#1E2420] hover:bg-[#E6E3D8] dark:hover:bg-[#28302B] text-[#18221C] dark:text-slate-100 border border-[#DFDDD4] dark:border-[#2D3630] flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>

            {/* Animation Intensity Slider + Reduced Motion Toggle */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="animation-intensity-range"
                  className="text-xs font-bold text-[#18221C] dark:text-slate-200"
                >
                  Animation Intensity
                </label>
                <button
                  type="button"
                  onClick={() => setReducedMotion(!reducedMotion)}
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded transition-colors cursor-pointer ${
                    reducedMotion
                      ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                      : 'text-[#526056] dark:text-slate-400 hover:text-[#174E31]'
                  }`}
                >
                  {reducedMotion ? 'Reduced Motion: On' : 'Reduced Motion: Off'}
                </button>
              </div>
              <div className="flex items-center gap-3">
                <input
                  id="animation-intensity-range"
                  type="range"
                  min={1}
                  max={3}
                  step={1}
                  value={intensity}
                  disabled={reducedMotion}
                  onChange={(e) => setIntensity(Number(e.target.value) as IntensityLevel)}
                  className="w-full h-2 rounded-lg appearance-none bg-[#E5E3DA] dark:bg-stone-700 accent-[#4D8B31] cursor-pointer disabled:opacity-50"
                />
                <span className="text-xs font-semibold text-[#37433B] dark:text-slate-300 w-14 text-right shrink-0">
                  {reducedMotion ? 'Calm' : INTENSITY_LABELS[intensity]}
                </span>
              </div>
            </div>

            {/* Sound / Fullscreen / Show Time Toggles */}
            <div className="pt-2 border-t border-[#E8E6DE] dark:border-[#252D28] flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-[#26302A] dark:text-slate-200">
              <div className="flex items-center gap-1.5">
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-[#174E31] dark:text-emerald-400" />
                ) : (
                  <VolumeX className="w-4 h-4 text-slate-400" />
                )}
                <span>Sound</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={soundEnabled}
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`w-10 h-5.5 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                    soundEnabled ? 'bg-[#1D6B3F]' : 'bg-stone-300 dark:bg-stone-700'
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
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-[#F2F0E8] dark:hover:bg-[#1E2420] transition-colors cursor-pointer"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
                <span>Fullscreen</span>
              </button>

              <div className="flex items-center gap-1.5">
                {showTime ? (
                  <Eye className="w-4 h-4 text-[#174E31] dark:text-emerald-400" />
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
                    showTime ? 'bg-[#1D6B3F]' : 'bg-stone-300 dark:bg-stone-700'
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

          {/* RIGHT COLUMN (3 cols): FOREST THEME & FIRE STYLE */}
          {!isFullscreen && (
            <div className="lg:col-span-3 flex flex-col justify-between space-y-4 border-t lg:border-t-0 lg:border-l border-[#E8E6DE] dark:border-[#252D28] pt-4 lg:pt-0 lg:pl-6">
              {/* Forest Theme 2x2 Grid */}
              <div>
                <h3 className="text-sm font-bold text-[#18221C] dark:text-white mb-2.5">
                  Forest Theme
                </h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {(Object.values(FOREST_THEMES) as ForestThemeConfig[]).map((t) => {
                    const active = themeId === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setThemeId(t.id)}
                        className={`group rounded-xl p-1.5 border text-center transition-all cursor-pointer ${
                          active
                            ? 'border-[#2E7D32] ring-2 ring-[#2E7D32]/25 bg-emerald-50/40 dark:bg-emerald-950/20'
                            : 'border-[#DFDDD4] dark:border-[#2C352F] bg-[#FAF9F5] dark:bg-[#1A201C] hover:border-[#2E7D32]/50'
                        }`}
                      >
                        {/* Miniature Illustrated Forest Thumbnail */}
                        <svg
                          viewBox="0 0 120 70"
                          className="w-full h-14 rounded-lg overflow-hidden border border-black/10"
                          preserveAspectRatio="none"
                        >
                          <rect width="120" height="70" fill={t.skyMid} />
                          <polygon points="0,55 32,22 65,48 95,18 120,45 120,70 0,70" fill={t.farMountain} />
                          {t.id === 'mountain-forest' && (
                            <g fill="#F8FAFC">
                              <polygon points="32,22 24,33 32,30 40,33" />
                              <polygon points="95,18 87,30 95,27 103,30" />
                            </g>
                          )}
                          <path d="M0,56 Q60,44 120,48 L120,70 L0,70 Z" fill={t.groundBase} />
                          {/* Miniature Trees */}
                          {[16, 36, 58, 82, 104].map((tx) => (
                            <polygon
                              key={tx}
                              points={`${tx},28 ${tx - 9},56 ${tx + 9},56`}
                              fill={t.treeNear}
                            />
                          ))}
                          {/* Warm ember glow strip on thumbnail */}
                          <path
                            d="M35,58 Q78,49 120,52 L120,66 L35,66 Z"
                            fill="#F97316"
                            opacity="0.85"
                          />
                          <path
                            d="M50,60 Q85,54 120,55 L120,64 L50,64 Z"
                            fill="#FDE047"
                            opacity="0.85"
                          />
                        </svg>
                        <div className="mt-1.5 text-[11px] font-bold text-[#18221C] dark:text-slate-200 truncate">
                          {t.name}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Fire Style Selector (3 Flame Buttons) */}
              <div>
                <h3 className="text-sm font-bold text-[#18221C] dark:text-white mb-2">
                  Fire Style
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {FIRE_STYLES.map((st, idx) => {
                    const active = fireStyleId === st.id;
                    return (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setFireStyleId(st.id)}
                        title={st.name}
                        className={`rounded-xl py-2.5 px-2 border transition-all cursor-pointer flex flex-col items-center justify-center ${
                          active
                            ? 'border-[#EA580C] ring-2 ring-[#EA580C]/20 bg-[#FFF5EB] dark:bg-orange-950/30'
                            : 'border-[#DFDDD4] dark:border-[#2C352F] bg-[#FAF9F5] dark:bg-[#1A201C] hover:border-[#EA580C]/40'
                        }`}
                      >
                        <svg viewBox="0 0 36 36" className="w-7 h-7">
                          <path
                            d="M18 3 C18 3 29 12 29 22 C29 28.5 24 33 18 33 C12 33 7 28.5 7 22 C7 15 13 9 14 6 C14 10 17 11 18 3 Z"
                            fill={st.primaryColor}
                          />
                          <path
                            d="M18 11 C18 11 24 17 24 23 C24 27 21.5 30 18 30 C14.5 30 12 27 12 23 C12 19 15.5 15 18 11 Z"
                            fill={st.secondaryColor}
                          />
                          <circle cx="18" cy="25.5" r="3.5" fill={st.coreColor} />
                          {idx === 1 && (
                            <>
                              <circle cx="10" cy="10" r="1.5" fill={st.secondaryColor} />
                              <circle cx="27" cy="12" r="1.5" fill={st.coreColor} />
                            </>
                          )}
                        </svg>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Save as Default Button */}
              <button
                type="button"
                onClick={handleSaveDefault}
                className="w-full py-2.5 px-4 rounded-xl border border-[#84A98C] dark:border-emerald-800 text-[#174E31] dark:text-emerald-300 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/30 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
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
                    ? 'bg-[#FDF6EE] dark:bg-orange-950/30 border-[#D96B27] shadow-xs'
                    : 'bg-white dark:bg-[#161B18] border-[#E4E2DA] dark:border-[#262E29] hover:border-[#D96B27]/50'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-950/60 text-[#EA580C] dark:text-orange-400 flex items-center justify-center shrink-0">
                  <Flame className="w-5 h-5 fill-current" />
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
                ? 'bg-[#FDF6EE] dark:bg-orange-950/30 border-[#D96B27] shadow-xs'
                : 'bg-white dark:bg-[#161B18] border-[#E4E2DA] dark:border-[#262E29] hover:border-[#D96B27]/50'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-950/60 text-[#EA580C] dark:text-orange-400 flex items-center justify-center shrink-0">
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

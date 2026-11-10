'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Play,
  Pause,
  ArrowRight,
  Check,
  Bell,
  SlidersHorizontal,
  Eye,
  Monitor,
  RotateCcw,
} from 'lucide-react';

export type SensoryFilterKey =
  | 'low-motion'
  | 'no-sound'
  | 'soft-colors'
  | 'numeric-display'
  | 'fullscreen-support'
  | 'visual-only';

interface FilterOption {
  id: SensoryFilterKey;
  label: string;
}

const FILTER_OPTIONS: FilterOption[] = [
  { id: 'low-motion', label: 'Low motion' },
  { id: 'no-sound', label: 'No sound' },
  { id: 'soft-colors', label: 'Soft colors' },
  { id: 'numeric-display', label: 'Numeric display' },
  { id: 'fullscreen-support', label: 'Fullscreen support' },
  { id: 'visual-only', label: 'Visual-only display' },
];

interface SensoryTimerItem {
  id: string;
  title: string;
  description: string;
  href: string;
  badges: [string, string];
  filters: SensoryFilterKey[];
}

const SENSORY_TIMERS: SensoryTimerItem[] = [
  {
    id: 'sand-timer',
    title: 'Sand Timer',
    description:
      'A classic, flowing sand countdown with a calm, steady visual.',
    href: '/timers/sand-timer',
    badges: ['Low Motion', 'Calming'],
    filters: [
      'low-motion',
      'no-sound',
      'soft-colors',
      'numeric-display',
      'fullscreen-support',
      'visual-only',
    ],
  },
  {
    id: 'liquid-timer',
    title: 'Liquid Timer',
    description:
      'Smooth, slow moving liquid that changes shape as time passes.',
    href: '/timers/liquid-timer',
    badges: ['Soothing', 'Visual Flow'],
    filters: [
      'no-sound',
      'soft-colors',
      'numeric-display',
      'fullscreen-support',
      'visual-only',
    ],
  },
  {
    id: 'rainbow-timer',
    title: 'Rainbow Timer',
    description:
      'A gentle, colorful countdown with a gradually building rainbow.',
    href: '/timers/rainbow-timer',
    badges: ['Soft Colors', 'Calming'],
    filters: [
      'low-motion',
      'no-sound',
      'soft-colors',
      'numeric-display',
      'fullscreen-support',
      'visual-only',
    ],
  },
  {
    id: 'bubble-timer',
    title: 'Bubble Timer',
    description: 'Floating bubbles that rise and change softly over time.',
    href: '/timers/bubble-timer',
    badges: ['Relaxing', 'Low Motion'],
    filters: [
      'low-motion',
      'no-sound',
      'soft-colors',
      'numeric-display',
      'fullscreen-support',
      'visual-only',
    ],
  },
  {
    id: 'frost-timer',
    title: 'Frost Timer',
    description: 'A cool, icy spread that gradually covers the screen.',
    href: '/timers/frost-timer',
    badges: ['Calm Visual', 'Soft Motion'],
    filters: [
      'low-motion',
      'no-sound',
      'soft-colors',
      'numeric-display',
      'fullscreen-support',
      'visual-only',
    ],
  },
  {
    id: 'snow-timer',
    title: 'Snow Timer',
    description: 'Gentle snowfall that builds as the countdown progresses.',
    href: '/timers/snow-timer',
    badges: ['Peaceful', 'Visual Only'],
    filters: [
      'low-motion',
      'no-sound',
      'soft-colors',
      'numeric-display',
      'fullscreen-support',
      'visual-only',
    ],
  },
  {
    id: 'lichen-timer',
    title: 'Lichen Timer',
    description:
      'A slow, natural growth effect inspired by lichen on stone.',
    href: '/timers/lichen-timer',
    badges: ['Nature Style', 'Low Motion'],
    filters: [
      'low-motion',
      'no-sound',
      'soft-colors',
      'numeric-display',
      'fullscreen-support',
      'visual-only',
    ],
  },
  {
    id: 'moon-timer',
    title: 'Moon Timer',
    description:
      'A calming lunar countdown with a gradual moon phase or glow.',
    href: '/timers/moon-timer',
    badges: ['Night Theme', 'Soft Visual'],
    filters: [
      'low-motion',
      'no-sound',
      'soft-colors',
      'numeric-display',
      'fullscreen-support',
      'visual-only',
    ],
  },
];

function CardThumbnailArtwork({
  id,
  isPlaying,
  progress,
  lowMotion,
}: {
  id: string;
  isPlaying: boolean;
  progress: number; // 0 to 1
  lowMotion: boolean;
}) {
  const p = isPlaying ? progress : 0.35;

  if (id === 'sand-timer') {
    const topSandHeight = Math.max(4, 28 * (1 - p));
    const bottomSandHeight = Math.max(6, 30 * p);
    return (
      <svg
        viewBox="0 0 280 160"
        className="w-full h-full object-cover"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="sandBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8D6E53" />
            <stop offset="50%" stopColor="#C8A987" />
            <stop offset="100%" stopColor="#E6D2B8" />
          </linearGradient>
          <linearGradient id="goldSand" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F5C469" />
            <stop offset="100%" stopColor="#C98A32" />
          </linearGradient>
        </defs>
        <rect width="280" height="160" fill="url(#sandBg)" />
        {/* Soft sunlit window blinds bokeh */}
        <rect
          x="0"
          y="0"
          width="110"
          height="130"
          fill="#FFF5E4"
          opacity="0.22"
        />
        {/* Wooden desk surface */}
        <rect x="0" y="132" width="280" height="28" fill="#B9926B" />
        <ellipse
          cx="140"
          cy="138"
          rx="44"
          ry="7"
          fill="#5C4028"
          opacity="0.35"
        />

        {/* Hourglass Frame */}
        <g transform="translate(140, 80)">
          {/* Top & Bottom wooden caps */}
          <rect
            x="-36"
            y="-58"
            width="72"
            height="8"
            rx="3"
            fill="#9C6B3B"
          />
          <rect
            x="-36"
            y="50"
            width="72"
            height="8"
            rx="3"
            fill="#9C6B3B"
          />
          {/* Glass bulbs */}
          <path
            d="M-30,-50 C-30,-18 -6,-6 -3,0 C-6,6 -30,18 -30,50 L30,50 C30,18 6,6 3,0 C6,-6 30,-18 30,-50 Z"
            fill="rgba(255,255,255,0.28)"
            stroke="rgba(255,255,255,0.75)"
            strokeWidth="2"
          />
          {/* Top sand */}
          <path
            d={`M${-24 * (1 - p * 0.4)},${-4 - topSandHeight} L${
              24 * (1 - p * 0.4)
            },${-4 - topSandHeight} L2,0 L-2,0 Z`}
            fill="url(#goldSand)"
          />
          {/* Falling sand stream */}
          {(isPlaying || !lowMotion) && (
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="49"
              stroke="#F5C469"
              strokeWidth="2.2"
              strokeDasharray={isPlaying && !lowMotion ? '3 2' : undefined}
            />
          )}
          {/* Bottom sand mound */}
          <path
            d={`M-27,50 Q0,${50 - bottomSandHeight * 1.4} 27,50 Z`}
            fill="url(#goldSand)"
          />
        </g>
      </svg>
    );
  }

  if (id === 'liquid-timer') {
    const bobOffset = isPlaying && !lowMotion ? Math.sin(p * Math.PI * 6) * 4 : 0;
    return (
      <svg
        viewBox="0 0 280 160"
        className="w-full h-full object-cover"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="liqBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#D6C6E1" />
            <stop offset="55%" stopColor="#B8B5E0" />
            <stop offset="100%" stopColor="#949AB1" />
          </linearGradient>
          <linearGradient id="liqPurple" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4CC9F0" />
            <stop offset="45%" stopColor="#7209B7" />
            <stop offset="100%" stopColor="#B5179E" />
          </linearGradient>
        </defs>
        <rect width="280" height="160" fill="url(#liqBg)" />
        {/* Soft bokeh circles */}
        <circle cx="55" cy="48" r="22" fill="#FFF" opacity="0.25" />
        <circle cx="220" cy="110" r="28" fill="#E0AAFF" opacity="0.25" />

        {/* Liquid Hourglass */}
        <g transform="translate(140, 82)">
          <path
            d="M-38,-56 C-38,-16 -10,-8 -5,0 C-10,8 -38,16 -38,56 C-38,62 38,62 38,56 C38,16 10,8 5,0 C10,-8 38,-16 38,-56 Z"
            fill="rgba(255,255,255,0.35)"
            stroke="rgba(255,255,255,0.85)"
            strokeWidth="2.5"
          />
          {/* Upper liquid */}
          <path
            d="M-32,-38 Q0,-33 32,-38 C28,-16 8,-7 4,0 L-4,0 C-8,-7 -28,-16 -32,-38 Z"
            fill="url(#liqPurple)"
            opacity="0.88"
          />
          {/* Lower liquid pool */}
          <path
            d="M-34,42 Q0,36 34,42 C36,52 28,56 0,56 C-28,56 -36,52 -34,42 Z"
            fill="url(#liqPurple)"
          />
          {/* Droplets */}
          <circle
            cx="0"
            cy={12 + bobOffset}
            r="5.5"
            fill="#9D4EDD"
          />
          <circle
            cx="7"
            cy={27 - bobOffset}
            r="4"
            fill="#48CAE4"
          />
          <circle cx="-8" cy="34" r="3" fill="#F72585" opacity="0.85" />
        </g>
      </svg>
    );
  }

  if (id === 'rainbow-timer') {
    const dashOffset = isPlaying ? (1 - p) * 60 : 0;
    return (
      <svg
        viewBox="0 0 280 160"
        className="w-full h-full object-cover"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="rainSky" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#90CAF9" />
            <stop offset="50%" stopColor="#CE93D8" />
            <stop offset="100%" stopColor="#FFCCBC" />
          </linearGradient>
        </defs>
        <rect width="280" height="160" fill="url(#rainSky)" />

        {/* Rainbow Concentric Arcs */}
        <g transform="translate(140, 152)" fill="none" strokeLinecap="round">
          {[
            { r: 108, c: '#FF6B6B', w: 8 },
            { r: 100, c: '#FFA94D', w: 8 },
            { r: 92, c: '#FFE066', w: 8 },
            { r: 84, c: '#69DB7C', w: 8 },
            { r: 76, c: '#4DABF7', w: 8 },
            { r: 68, c: '#9775FA', w: 8 },
          ].map((arc, idx) => (
            <path
              key={idx}
              d={`M ${-arc.r},0 A ${arc.r},${arc.r} 0 0,1 ${arc.r},0`}
              stroke={arc.c}
              strokeWidth={arc.w}
              opacity="0.88"
              strokeDasharray="360"
              strokeDashoffset={dashOffset}
            />
          ))}
        </g>

        {/* Soft Pastel Clouds at Bottom */}
        <g fill="#FFF9F5" opacity="0.92">
          <circle cx="40" cy="152" r="28" />
          <circle cx="72" cy="156" r="22" />
          <circle cx="205" cy="154" r="24" />
          <circle cx="240" cy="148" r="30" />
          <circle cx="140" cy="162" r="26" />
        </g>
      </svg>
    );
  }

  if (id === 'bubble-timer') {
    const floatY = isPlaying && !lowMotion ? Math.sin(p * Math.PI * 4) * 6 : 0;
    return (
      <svg
        viewBox="0 0 280 160"
        className="w-full h-full object-cover"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="bubBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1B6CA8" />
            <stop offset="55%" stopColor="#2A9D8F" />
            <stop offset="100%" stopColor="#1D4E56" />
          </linearGradient>
          <radialGradient id="bubSheen" cx="0.32" cy="0.3" r="0.65">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="35%" stopColor="#80FFDB" stopOpacity="0.45" />
            <stop offset="75%" stopColor="#F72585" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#4CC9F0" stopOpacity="0.85" />
          </radialGradient>
        </defs>
        <rect width="280" height="160" fill="url(#bubBg)" />
        {[
          { cx: 52, cy: 56 + floatY, r: 21 },
          { cx: 112, cy: 106 - floatY, r: 28 },
          { cx: 162, cy: 48 + floatY * 0.7, r: 24 },
          { cx: 212, cy: 100 - floatY * 0.6, r: 19 },
          { cx: 88, cy: 40, r: 10 },
          { cx: 228, cy: 55, r: 12 },
          { cx: 40, cy: 118, r: 14 },
        ].map((b, i) => (
          <g key={i}>
            <circle
              cx={b.cx}
              cy={b.cy}
              r={b.r}
              fill="url(#bubSheen)"
              stroke="rgba(255,255,255,0.7)"
              strokeWidth="1.2"
            />
            <circle
              cx={b.cx - b.r * 0.32}
              cy={b.cy - b.r * 0.32}
              r={b.r * 0.18}
              fill="#FFFFFF"
              opacity="0.85"
            />
          </g>
        ))}
      </svg>
    );
  }

  if (id === 'frost-timer') {
    return (
      <svg
        viewBox="0 0 280 160"
        className="w-full h-full object-cover"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="frostBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4A8FE7" />
            <stop offset="50%" stopColor="#73B3F2" />
            <stop offset="100%" stopColor="#B8DCFF" />
          </linearGradient>
        </defs>
        <rect width="280" height="160" fill="url(#frostBg)" />
        {/* Delicate ice crystal stars */}
        {[
          { cx: 70, cy: 88, r: 44 },
          { cx: 145, cy: 76, r: 52 },
          { cx: 215, cy: 96, r: 38 },
          { cx: 40, cy: 36, r: 26 },
          { cx: 195, cy: 34, r: 28 },
        ].map((cr, idx) => (
          <g
            key={idx}
            transform={`translate(${cr.cx}, ${cr.cy})`}
            stroke="rgba(255,255,255,0.82)"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            {[0, 30, 60, 90, 120, 150].map((deg) => (
              <g key={deg} transform={`rotate(${deg})`}>
                <line x1={-cr.r} y1="0" x2={cr.r} y2="0" />
                <line
                  x1={-cr.r * 0.55}
                  y1="0"
                  x2={-cr.r * 0.75}
                  y2={-cr.r * 0.22}
                />
                <line
                  x1={-cr.r * 0.55}
                  y1="0"
                  x2={-cr.r * 0.75}
                  y2={cr.r * 0.22}
                />
                <line
                  x1={cr.r * 0.55}
                  y1="0"
                  x2={cr.r * 0.75}
                  y2={-cr.r * 0.22}
                />
                <line
                  x1={cr.r * 0.55}
                  y1="0"
                  x2={cr.r * 0.75}
                  y2={cr.r * 0.22}
                />
              </g>
            ))}
          </g>
        ))}
      </svg>
    );
  }

  if (id === 'snow-timer') {
    const snowShift = isPlaying && !lowMotion ? (p * 30) % 20 : 0;
    return (
      <svg
        viewBox="0 0 280 160"
        className="w-full h-full object-cover"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="snowSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4A6B8A" />
            <stop offset="65%" stopColor="#8AA8C7" />
            <stop offset="100%" stopColor="#DCE8F5" />
          </linearGradient>
        </defs>
        <rect width="280" height="160" fill="url(#snowSky)" />

        {/* Snowy Pine Trees */}
        {[
          { x: 52, y: 132, s: 1.05 },
          { x: 105, y: 136, s: 0.72 },
          { x: 192, y: 138, s: 0.78 },
          { x: 232, y: 134, s: 0.96 },
        ].map((t, i) => (
          <g key={i} transform={`translate(${t.x}, ${t.y}) scale(${t.s})`}>
            <polygon points="0,-88 -28,-46 28,-46" fill="#2C4C3E" />
            <polygon points="0,-88 -22,-55 22,-55" fill="#EEF5FC" />
            <polygon points="0,-64 -34,-22 34,-22" fill="#244034" />
            <polygon points="0,-64 -26,-32 26,-32" fill="#E6F0FA" />
            <polygon points="0,-40 -40,4 40,4" fill="#1D352B" />
            <polygon points="0,-40 -30,-10 30,-10" fill="#E6F0FA" />
          </g>
        ))}

        {/* Accumulating Snowdrift at bottom */}
        <path
          d="M0,132 Q70,120 140,128 T280,124 L280,160 L0,160 Z"
          fill="#F4F8FD"
        />
        <path
          d="M0,142 Q95,132 180,140 T280,136 L280,160 L0,160 Z"
          fill="#FFFFFF"
        />

        {/* Gently Falling Snowflakes */}
        {[
          [28, 26],
          [75, 42],
          [125, 22],
          [165, 54],
          [210, 30],
          [252, 48],
          [45, 78],
          [95, 86],
          [142, 72],
          [185, 92],
          [240, 82],
        ].map(([cx, cy], idx) => (
          <circle
            key={idx}
            cx={cx}
            cy={(cy + snowShift) % 125}
            r={idx % 2 === 0 ? 2.4 : 1.7}
            fill="#FFFFFF"
            opacity="0.9"
          />
        ))}
      </svg>
    );
  }

  if (id === 'lichen-timer') {
    const scaleGrowth = isPlaying ? 0.85 + p * 0.25 : 1;
    return (
      <svg
        viewBox="0 0 280 160"
        className="w-full h-full object-cover"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="lichenBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3B4D2B" />
            <stop offset="50%" stopColor="#556B2F" />
            <stop offset="100%" stopColor="#2A361E" />
          </linearGradient>
        </defs>
        <rect width="280" height="160" fill="url(#lichenBg)" />
        {/* Natural Woodland Stone */}
        <ellipse cx="145" cy="108" rx="115" ry="58" fill="#5C5852" />
        <ellipse cx="140" cy="104" rx="102" ry="48" fill="#6E6A63" />

        {/* Organic Moss & Lichen Clusters */}
        <g transform={`translate(140, 92) scale(${scaleGrowth})`}>
          {[
            { cx: -48, cy: 8, r: 24, c: '#7CB518' },
            { cx: -22, cy: -8, r: 28, c: '#8AC926' },
            { cx: 12, cy: -14, r: 26, c: '#AACC00' },
            { cx: 42, cy: -4, r: 22, c: '#7CB518' },
            { cx: -8, cy: 14, r: 25, c: '#55A630' },
            { cx: 28, cy: 16, r: 20, c: '#80B918' },
            { cx: -58, cy: 22, r: 16, c: '#9EF01A' },
          ].map((cl, idx) => (
            <circle
              key={idx}
              cx={cl.cx}
              cy={cl.cy}
              r={cl.r}
              fill={cl.c}
              opacity="0.92"
            />
          ))}
          {/* Fine organic texture dots */}
          {[-35, -15, 5, 25, 40, -5, 18].map((x, i) => (
            <circle
              key={i}
              cx={x}
              cy={(i % 3) * 8 - 6}
              r="5"
              fill="#D4E09B"
              opacity="0.7"
            />
          ))}
        </g>
      </svg>
    );
  }

  // Default: moon-timer
  return (
    <svg
      viewBox="0 0 280 160"
      className="w-full h-full object-cover"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="moonSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0F203C" />
          <stop offset="65%" stopColor="#234268" />
          <stop offset="100%" stopColor="#3B628B" />
        </linearGradient>
        <radialGradient id="moonGlow" cx="0.5" cy="0.45" r="0.45">
          <stop offset="0%" stopColor="#FFF8E7" stopOpacity="1" />
          <stop offset="65%" stopColor="#EAD2AC" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#C9A97C" stopOpacity="0.9" />
        </radialGradient>
      </defs>
      <rect width="280" height="160" fill="url(#moonSky)" />

      {/* Subtle stars */}
      {[
        [32, 24],
        [68, 42],
        [95, 18],
        [205, 28],
        [248, 40],
        [48, 72],
        [228, 75],
      ].map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={i % 2 === 0 ? 1.3 : 1}
          fill="#FFF"
          opacity="0.75"
        />
      ))}

      {/* Outer lunar halo */}
      <circle
        cx="140"
        cy="72"
        r="54"
        fill="#FFF3D1"
        opacity={isPlaying ? 0.22 : 0.14}
      />

      {/* Glowing Full Moon */}
      <circle cx="140" cy="72" r="40" fill="url(#moonGlow)" />
      {/* Subtle lunar craters */}
      <circle cx="126" cy="62" r="7" fill="#C8AD88" opacity="0.45" />
      <circle cx="152" cy="58" r="9" fill="#C8AD88" opacity="0.38" />
      <circle cx="146" cy="84" r="11" fill="#C8AD88" opacity="0.42" />
      <circle cx="122" cy="82" r="6" fill="#C8AD88" opacity="0.35" />

      {/* Pine silhouettes & calm lake reflection */}
      <path
        d="M0,136 L20,102 L38,136 L58,96 L78,136 L205,136 L225,104 L245,136 L265,94 L280,136 L280,160 L0,160 Z"
        fill="#0D1B2A"
      />
      <rect x="0" y="136" width="280" height="24" fill="#142842" />
      <ellipse
        cx="140"
        cy="146"
        rx="32"
        ry="3"
        fill="#F3E3C3"
        opacity="0.45"
      />
    </svg>
  );
}

export default function SensoryTimersCollectionClient() {
  const [selectedFilters, setSelectedFilters] = useState<SensoryFilterKey[]>(
    []
  );
  const [playingCardId, setPlayingCardId] = useState<string | null>(null);
  const [previewSecondsLeft, setPreviewSecondsLeft] = useState<number>(600); // 10:00

  const toggleFilter = (key: SensoryFilterKey) => {
    setSelectedFilters((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  };

  // Gentle live preview ticker when a card's play button is active
  useEffect(() => {
    if (!playingCardId) return;
    const interval = setInterval(() => {
      setPreviewSecondsLeft((prev) => (prev <= 1 ? 600 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [playingCardId]);

  const hideNumericDisplay =
    selectedFilters.includes('visual-only') &&
    !selectedFilters.includes('numeric-display');
  const isLowMotion = selectedFilters.includes('low-motion');

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const progress = 1 - previewSecondsLeft / 600;

  return (
    <div className="space-y-7">
      {/* FILTER TIMERS BAR */}
      <div className="bg-[#EAF1E8] dark:bg-[#161C19] border border-[#D5E2D4] dark:border-[#28322C] rounded-2xl px-4 py-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-sm font-bold font-serif text-[#0D2137] dark:text-[#F3F5F4] mr-1">
            Filter Timers:
          </span>
          {FILTER_OPTIONS.map((filter) => {
            const isChecked = selectedFilters.includes(filter.id);
            return (
              <button
                key={filter.id}
                type="button"
                role="checkbox"
                aria-checked={isChecked}
                onClick={() => toggleFilter(filter.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  isChecked
                    ? 'bg-[#1B5E34] text-white border-[#1B5E34] shadow-xs'
                    : 'bg-[#FAF8F4] dark:bg-[#212A25] text-[#1F2937] dark:text-slate-200 border-[#D6DEC9] dark:border-[#2F3B34] hover:border-[#8FB396] dark:hover:border-[#6CC49B]'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded flex items-center justify-center border ${
                    isChecked
                      ? 'bg-white text-[#1B5E34] border-white'
                      : 'border-[#2E5A36] dark:border-[#6CC49B] bg-transparent'
                  }`}
                >
                  {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                </span>
                <span>{filter.label}</span>
              </button>
            );
          })}
        </div>

        {selectedFilters.length > 0 && (
          <button
            type="button"
            onClick={() => setSelectedFilters([])}
            className="flex items-center gap-1 text-xs font-semibold text-[#1B5E34] dark:text-[#6CC49B] hover:underline cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset filters</span>
          </button>
        )}
      </div>

      {/* 8 FEATURED SENSORY TIMER CARDS (2x4 Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {SENSORY_TIMERS.map((timer) => {
          const isPlaying = playingCardId === timer.id;
          const matchesAllFilters =
            selectedFilters.length === 0 ||
            selectedFilters.every((f) => timer.filters.includes(f));

          return (
            <div
              key={timer.id}
              className={`bg-white dark:bg-[#161C19] rounded-2xl border p-3.5 flex flex-col justify-between transition-all shadow-xs ${
                matchesAllFilters
                  ? 'border-[#E2DEC9] dark:border-[#28322C] hover:border-[#94B49B] dark:hover:border-[#4F8A6B] hover:shadow-md'
                  : 'border-[#EAE4D9] dark:border-[#222A25] opacity-60'
              }`}
            >
              <div>
                {/* Preview Thumbnail Container */}
                <div className="relative h-36 rounded-xl overflow-hidden border border-[#E6E1D5] dark:border-[#28322C] mb-3 bg-[#E9E4D8] dark:bg-[#1F2723]">
                  <CardThumbnailArtwork
                    id={timer.id}
                    isPlaying={isPlaying}
                    progress={progress}
                    lowMotion={isLowMotion}
                  />

                  {/* Top-Right 10:00 Numeric Display Badge */}
                  {!hideNumericDisplay && (
                    <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-md bg-black/55 backdrop-blur-xs text-white font-mono text-sm font-bold tracking-wider">
                      {isPlaying ? formatTime(previewSecondsLeft) : '10:00'}
                    </div>
                  )}

                  {/* Bottom-Right Interactive Preview Play/Pause Button */}
                  <button
                    type="button"
                    aria-label={
                      isPlaying
                        ? `Pause ${timer.title} preview`
                        : `Preview ${timer.title} animation`
                    }
                    onClick={() => {
                      if (isPlaying) {
                        setPlayingCardId(null);
                      } else {
                        setPreviewSecondsLeft(600);
                        setPlayingCardId(timer.id);
                      }
                    }}
                    className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-black/55 hover:bg-[#1B5E34] text-white border border-white/80 flex items-center justify-center transition-colors cursor-pointer shadow-sm"
                  >
                    {isPlaying ? (
                      <Pause className="w-3.5 h-3.5 fill-current" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    )}
                  </button>
                </div>

                {/* Title & Description */}
                <h2 className="text-lg font-bold font-serif text-[#0D2137] dark:text-[#F3F5F4] mb-1">
                  {timer.title}
                </h2>
                <p className="text-xs text-[#374151] dark:text-slate-300 leading-relaxed mb-3">
                  {timer.description}
                </p>

                {/* 2 Attribute Pills */}
                <div className="flex flex-wrap items-center gap-1.5 mb-3.5">
                  {timer.badges.map((badge) => (
                    <span
                      key={badge}
                      className="px-2.5 py-0.5 rounded-full bg-[#E6EFE4] dark:bg-[#213328] text-[#1F3A28] dark:text-[#8CD4B0] text-[11px] font-semibold"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>

              {/* Open Timer CTA Button */}
              <Link
                href={timer.href}
                className="w-full py-2.5 px-4 rounded-xl bg-[#1A5D34] hover:bg-[#144928] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Open {timer.title}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          );
        })}
      </div>

      {/* 4-COLUMN ACCESSIBILITY & FEATURE STRIP */}
      <div className="bg-[#EAF1E8] dark:bg-[#161C19] border border-[#D5E2D4] dark:border-[#28322C] rounded-2xl p-4 sm:px-6 sm:py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:divide-x lg:divide-[#CBDAC9] dark:lg:divide-[#28322C]">
        <div className="flex items-center gap-3 lg:pr-3">
          <div className="w-9 h-9 rounded-xl bg-white/80 dark:bg-[#212A25] text-[#1A5D34] dark:text-[#6CC49B] flex items-center justify-center shrink-0 border border-[#CFE0CE] dark:border-[#2F3B34]">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold font-serif text-[#0D2137] dark:text-[#F3F5F4]">
              Sound Muted by Default
            </div>
            <div className="text-[11px] text-[#374151] dark:text-slate-300">
              A quiet, distraction-free experience.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 lg:px-4">
          <div className="w-9 h-9 rounded-xl bg-white/80 dark:bg-[#212A25] text-[#1A5D34] dark:text-[#6CC49B] flex items-center justify-center shrink-0 border border-[#CFE0CE] dark:border-[#2F3B34]">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold font-serif text-[#0D2137] dark:text-[#F3F5F4]">
              Adjustable Motion
            </div>
            <div className="text-[11px] text-[#374151] dark:text-slate-300">
              Choose gentle or minimal motion.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 lg:px-4">
          <div className="w-9 h-9 rounded-xl bg-white/80 dark:bg-[#212A25] text-[#1A5D34] dark:text-[#6CC49B] flex items-center justify-center shrink-0 border border-[#CFE0CE] dark:border-[#2F3B34]">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold font-serif text-[#0D2137] dark:text-[#F3F5F4]">
              Accessible Design
            </div>
            <div className="text-[11px] text-[#374151] dark:text-slate-300">
              Keyboard friendly and easy to use.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 lg:pl-4">
          <div className="w-9 h-9 rounded-xl bg-white/80 dark:bg-[#212A25] text-[#1A5D34] dark:text-[#6CC49B] flex items-center justify-center shrink-0 border border-[#CFE0CE] dark:border-[#2F3B34]">
            <Monitor className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold font-serif text-[#0D2137] dark:text-[#F3F5F4]">
              Fullscreen Option
            </div>
            <div className="text-[11px] text-[#374151] dark:text-slate-300">
              Use any timer in a larger view.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

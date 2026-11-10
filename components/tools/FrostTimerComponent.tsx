'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Bell,
  Maximize2,
  Minimize2,
  Eye,
  Bookmark,
  Settings,
  BookOpen,
  GraduationCap,
  Monitor,
  Heart,
  Check,
  Sun,
  Snowflake,
  Activity,
} from 'lucide-react';

type FrostThemeId = 'classic-frost' | 'icy-blue' | 'winter-morning' | 'frosted-glass';
type GlassBgStyleId = 'sunrise-pines' | 'twilight-woods' | 'arctic-horizon' | 'misty-birch';

interface FrostThemeConfig {
  id: FrostThemeId;
  label: string;
  crystalPrimary: string;
  crystalSecondary: string;
  crystalHighlight: string;
  crystalShadow: string;
  rimeEdgeTint: string;
  facetFill: string;
}

interface GlassBgConfig {
  id: GlassBgStyleId;
  label: string;
  skyTop: string;
  skyMid: string;
  skyHorizon: string;
  skyBottom: string;
  sunGlow: string;
  sunCore: string;
  sunCx: number;
  sunCy: number;
  mountainFar: string;
  mountainNear: string;
  treeSilhouette: string;
  treeSnowHighlight: string;
  distantHaze: string;
}

const FROST_THEMES: Record<FrostThemeId, FrostThemeConfig> = {
  'classic-frost': {
    id: 'classic-frost',
    label: 'Classic Frost',
    crystalPrimary: '#E3F2FF',
    crystalSecondary: '#9CCAF6',
    crystalHighlight: '#FFFFFF',
    crystalShadow: 'rgba(24, 68, 118, 0.55)',
    rimeEdgeTint: 'rgba(185, 222, 255, 0.22)',
    facetFill: 'rgba(225, 242, 255, 0.28)',
  },
  'icy-blue': {
    id: 'icy-blue',
    label: 'Icy Blue',
    crystalPrimary: '#CEECFF',
    crystalSecondary: '#6ABBF5',
    crystalHighlight: '#F7FCFF',
    crystalShadow: 'rgba(14, 56, 106, 0.62)',
    rimeEdgeTint: 'rgba(130, 204, 255, 0.25)',
    facetFill: 'rgba(195, 234, 255, 0.32)',
  },
  'winter-morning': {
    id: 'winter-morning',
    label: 'Winter Morning',
    crystalPrimary: '#EEF6FF',
    crystalSecondary: '#B8D0EC',
    crystalHighlight: '#FFFFFF',
    crystalShadow: 'rgba(42, 74, 112, 0.50)',
    rimeEdgeTint: 'rgba(218, 234, 255, 0.24)',
    facetFill: 'rgba(238, 246, 255, 0.30)',
  },
  'frosted-glass': {
    id: 'frosted-glass',
    label: 'Frosted Glass',
    crystalPrimary: '#E8F1FA',
    crystalSecondary: '#B0C8DF',
    crystalHighlight: '#FFFFFF',
    crystalShadow: 'rgba(38, 64, 92, 0.52)',
    rimeEdgeTint: 'rgba(220, 235, 248, 0.28)',
    facetFill: 'rgba(235, 244, 252, 0.34)',
  },
};

const GLASS_BACKGROUNDS: Record<GlassBgStyleId, GlassBgConfig> = {
  'sunrise-pines': {
    id: 'sunrise-pines',
    label: 'Sunrise Pines',
    skyTop: '#1E3B63',
    skyMid: '#4A6E99',
    skyHorizon: '#F2B880',
    skyBottom: '#1B2E4B',
    sunGlow: '#FFD294',
    sunCore: '#FFF8E8',
    sunCx: 335,
    sunCy: 225,
    mountainFar: '#344F73',
    mountainNear: '#233856',
    treeSilhouette: '#13233B',
    treeSnowHighlight: '#7AA3CC',
    distantHaze: '#F5B576',
  },
  'twilight-woods': {
    id: 'twilight-woods',
    label: 'Twilight Woods',
    skyTop: '#182C4D',
    skyMid: '#3F5C82',
    skyHorizon: '#E89D6B',
    skyBottom: '#15243D',
    sunGlow: '#F8B274',
    sunCore: '#FFEAD0',
    sunCx: 290,
    sunCy: 240,
    mountainFar: '#2B4263',
    mountainNear: '#1C2D47',
    treeSilhouette: '#0F1C30',
    treeSnowHighlight: '#678BB2',
    distantHaze: '#E69A63',
  },
  'arctic-horizon': {
    id: 'arctic-horizon',
    label: 'Arctic Horizon',
    skyTop: '#0F294A',
    skyMid: '#2D5C8F',
    skyHorizon: '#9AD0F5',
    skyBottom: '#0E223D',
    sunGlow: '#BFE3FF',
    sunCore: '#F2FAFF',
    sunCx: 250,
    sunCy: 215,
    mountainFar: '#1E4470',
    mountainNear: '#153154',
    treeSilhouette: '#0A1A30',
    treeSnowHighlight: '#85BCE8',
    distantHaze: '#82BBE8',
  },
  'misty-birch': {
    id: 'misty-birch',
    label: 'Misty Birch',
    skyTop: '#35567D',
    skyMid: '#6E94BD',
    skyHorizon: '#FFE3B8',
    skyBottom: '#26405E',
    sunGlow: '#FFE6BE',
    sunCore: '#FFFFFF',
    sunCx: 325,
    sunCy: 198,
    mountainFar: '#46688F',
    mountainNear: '#314D6E',
    treeSilhouette: '#1B2E45',
    treeSnowHighlight: '#9CC0E3',
    distantHaze: '#D7E6F5',
  },
};

const STORAGE_KEY = 'timetools_frost_timer_prefs_v1';

// Logical canvas dimensions (scaled by devicePixelRatio for razor-sharp Retina rendering)
const CANVAS_W = 800;
const CANVAS_H = 680;

interface FrostSegment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  thickness: number;
  depth: number; // 0 = main spine, 1 = secondary fern, 2 = tertiary needle, 3 = micro-barb
  startAt: number; // frost progress [0..1] when segment begins growing
  endAt: number; // frost progress [0..1] when segment finishes growing
  hasHighlight: boolean;
}

interface FrostStarCrystal {
  cx: number;
  cy: number;
  radius: number;
  rotation: number;
  threshold: number;
}

interface FrostMicroFacet {
  x: number;
  y: number;
  size: number;
  angle: number;
  threshold: number;
}

// Deterministic seeded PRNG (Mulberry32)
function createSeededRng(seed: number) {
  let a = seed >>> 0;
  return function next(): number {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Normalized inward distance (0 at window edge/corners -> 1 at very center of glass)
function computeInwardNorm(x: number, y: number): number {
  const cx = CANVAS_W / 2;
  const cy = CANVAS_H / 2;
  const dx = (x - cx) / cx; // -1..1
  const dy = (y - cy) / cy; // -1..1
  // Combine Chebyshev & Euclidean distance so corners start earliest (0.0) and center finishes at 1.0
  const radial = Math.sqrt(dx * dx + dy * dy) / 1.32;
  const edgeDist = Math.max(Math.abs(dx), Math.abs(dy));
  const combined = radial * 0.62 + edgeDist * 0.38;
  return Math.max(0, Math.min(1, 1 - combined));
}

// Pre-compute the entire high-detail dendritic frost geometry once
function buildFrostCrystalGeometry(): {
  segments: FrostSegment[];
  stars: FrostStarCrystal[];
  facets: FrostMicroFacet[];
} {
  const rng = createSeededRng(20261101);
  const segments: FrostSegment[] = [];
  const stars: FrostStarCrystal[] = [];
  const facets: FrostMicroFacet[] = [];

  const addBranchRecursive = (
    x: number,
    y: number,
    angle: number,
    length: number,
    thickness: number,
    depth: number,
    parentThreshold: number
  ) => {
    const steps = depth === 0 ? 11 : depth === 1 ? 6 : depth === 2 ? 3 : 1;
    const stepLen = length / steps;
    let curX = x;
    let curY = y;
    let curAngle = angle;

    for (let i = 0; i < steps; i++) {
      const frac = i / steps;
      // Gentle natural crystalline curve
      const curveDelta =
        depth === 0
          ? (rng() - 0.5) * 0.14
          : depth === 1
          ? (rng() - 0.5) * 0.1
          : (rng() - 0.5) * 0.06;
      curAngle += curveDelta;

      const nx = curX + Math.cos(curAngle) * stepLen;
      const ny = curY + Math.sin(curAngle) * stepLen;

      const midX = (curX + nx) * 0.5;
      const midY = (curY + ny) * 0.5;
      const inward = computeInwardNorm(midX, midY);

      // Compute deterministic appearance threshold so frost grows smoothly from perimeter inward
      const depthDelay = depth * 0.032 + frac * (depth === 0 ? 0.16 : 0.07);
      const startAt = Math.max(parentThreshold, Math.min(0.94, inward * 0.82 + depthDelay));
      const endAt = Math.min(1.0, startAt + (depth === 0 ? 0.055 : depth === 1 ? 0.045 : 0.035));

      const segThickness = Math.max(0.45, thickness * (1 - frac * 0.52));

      segments.push({
        x1: curX,
        y1: curY,
        x2: nx,
        y2: ny,
        thickness: segThickness,
        depth,
        startAt,
        endAt,
        hasHighlight: depth <= 1 || (depth === 2 && i === 0),
      });

      // Spawn feathery secondary/tertiary/quaternary ice needles at 55°-62° hexagonal crystal angles
      if (depth < 3) {
        const subCount = depth === 0 ? 2 : 1;
        for (let s = 0; s < subCount; s++) {
          const interp = (s + 0.5) / subCount;
          const bx = curX + (nx - curX) * interp;
          const by = curY + (ny - curY) * interp;
          const profile = Math.sin(((i + interp) / steps) * Math.PI * 0.92 + 0.12);
          const subLen =
            depth === 0
              ? length * (0.28 + rng() * 0.12) * profile
              : depth === 1
              ? length * (0.38 + rng() * 0.14) * profile
              : length * 0.42 * profile;

          if (subLen > 4.5) {
            const branchAngleOffset = (54 + rng() * 10) * (Math.PI / 180);
            const subThick = segThickness * 0.68;
            // Left pinnule
            addBranchRecursive(
              bx,
              by,
              curAngle - branchAngleOffset,
              subLen,
              subThick,
              depth + 1,
              startAt + 0.012
            );
            // Right pinnule
            addBranchRecursive(
              bx,
              by,
              curAngle + branchAngleOffset,
              subLen,
              subThick,
              depth + 1,
              startAt + 0.012
            );
          }
        }
      }

      curX = nx;
      curY = ny;
    }
  };

  const cx = CANVAS_W / 2;
  const cy = CANVAS_H / 2;

  // 1. Dense Corner Dendritic Plumes (grow deep from all 4 corners toward the center)
  const corners = [
    { x: 0, y: 0, baseAngles: [18, 32, 46, 62, 74] },
    { x: CANVAS_W, y: 0, baseAngles: [106, 118, 134, 148, 162] },
    { x: 0, y: CANVAS_H, baseAngles: [-18, -32, -46, -62, -74] },
    { x: CANVAS_W, y: CANVAS_H, baseAngles: [-106, -118, -134, -148, -162] },
  ];

  corners.forEach((c) => {
    c.baseAngles.forEach((deg, idx) => {
      const rad = (deg * Math.PI) / 180;
      const isCenterDiagonal = idx === 2;
      const maxLen = isCenterDiagonal ? 445 : idx === 1 || idx === 3 ? 375 : 310;
      addBranchRecursive(c.x, c.y, rad, maxLen, isCenterDiagonal ? 2.9 : 2.4, 0, 0.0);
    });
  });

  // 2. Top & Bottom Perimeter Frost Ferns growing inward
  const topBottomCount = 9;
  for (let i = 1; i <= topBottomCount; i++) {
    const frac = i / (topBottomCount + 1);
    const tx = frac * CANVAS_W;
    const distFromMid = Math.abs(frac - 0.5) * 2; // 0 at center, 1 at corner
    const len = 255 + distFromMid * 95 + rng() * 35;

    // Top edge branch pointing inward toward center
    const angleTop = Math.atan2(cy - 0, cx - tx) + (rng() - 0.5) * 0.28;
    addBranchRecursive(tx, 0, angleTop, len, 2.25, 0, (1 - distFromMid) * 0.05);

    // Bottom edge branch pointing inward toward center
    const angleBot = Math.atan2(cy - CANVAS_H, cx - tx) + (rng() - 0.5) * 0.28;
    addBranchRecursive(tx, CANVAS_H, angleBot, len, 2.25, 0, (1 - distFromMid) * 0.05);
  }

  // 3. Left & Right Perimeter Frost Ferns growing inward
  const sideCount = 7;
  for (let i = 1; i <= sideCount; i++) {
    const frac = i / (sideCount + 1);
    const ty = frac * CANVAS_H;
    const distFromMid = Math.abs(frac - 0.5) * 2;
    const len = 285 + distFromMid * 90 + rng() * 35;

    // Left edge branch
    const angleLeft = Math.atan2(cy - ty, cx - 0) + (rng() - 0.5) * 0.26;
    addBranchRecursive(0, ty, angleLeft, len, 2.3, 0, (1 - distFromMid) * 0.05);

    // Right edge branch
    const angleRight = Math.atan2(cy - ty, cx - CANVAS_W) + (rng() - 0.5) * 0.26;
    addBranchRecursive(CANVAS_W, ty, angleRight, len, 2.3, 0, (1 - distFromMid) * 0.05);
  }

  // 4. Inner-Closure Dendritic Ferns (nucleate from mid-ring to seal the center smoothly at 65%..100%)
  const innerRingCount = 12;
  for (let i = 0; i < innerRingCount; i++) {
    const theta = (i / innerRingCount) * Math.PI * 2 + 0.2;
    const startR = 175 + (i % 2) * 35;
    const ox = cx + Math.cos(theta) * startR;
    const oy = cy + Math.sin(theta) * (startR * 0.84);
    const inwardAngle = theta + Math.PI + (rng() - 0.5) * 0.35;
    addBranchRecursive(ox, oy, inwardAngle, 195, 2.0, 0, 0.56 + (i % 3) * 0.05);
  }

  // 5. Crisp Hexagonal Stellar Dendrite Crystals
  const starPositions = [
    // Perimeter & corner stars
    { x: 58, y: 54, r: 34 },
    { x: 742, y: 54, r: 34 },
    { x: 58, y: 626, r: 36 },
    { x: 742, y: 626, r: 36 },
    { x: 155, y: 46, r: 28 },
    { x: 645, y: 46, r: 28 },
    { x: 155, y: 634, r: 28 },
    { x: 645, y: 634, r: 28 },
    { x: 48, y: 175, r: 29 },
    { x: 752, y: 175, r: 29 },
    { x: 48, y: 505, r: 29 },
    { x: 752, y: 505, r: 29 },
    // Mid-window stars
    { x: 145, y: 142, r: 32 },
    { x: 655, y: 142, r: 32 },
    { x: 145, y: 538, r: 32 },
    { x: 655, y: 538, r: 32 },
    { x: 285, y: 62, r: 26 },
    { x: 515, y: 62, r: 26 },
    { x: 285, y: 618, r: 26 },
    { x: 515, y: 618, r: 26 },
    { x: 72, y: 340, r: 30 },
    { x: 728, y: 340, r: 30 },
    // Center closure stars
    { x: 255, y: 215, r: 33 },
    { x: 545, y: 215, r: 33 },
    { x: 255, y: 465, r: 33 },
    { x: 545, y: 465, r: 33 },
    { x: 400, y: 135, r: 30 },
    { x: 400, y: 545, r: 30 },
    { x: 215, y: 340, r: 30 },
    { x: 585, y: 340, r: 30 },
    { x: 335, y: 295, r: 34 },
    { x: 465, y: 295, r: 34 },
    { x: 335, y: 395, r: 34 },
    { x: 465, y: 395, r: 34 },
    { x: 400, y: 340, r: 40 },
  ];

  starPositions.forEach((sp) => {
    const inward = computeInwardNorm(sp.x, sp.y);
    stars.push({
      cx: sp.x,
      cy: sp.y,
      radius: sp.r,
      rotation: rng() * 60,
      threshold: Math.min(0.9, inward * 0.88),
    });
  });

  // 6. Crisp Diamond Ice Facets & Sparkling Surface Rime Spangles
  for (let i = 0; i < 240; i++) {
    const fx = rng() * CANVAS_W;
    const fy = rng() * CANVAS_H;
    const inward = computeInwardNorm(fx, fy);
    facets.push({
      x: fx,
      y: fy,
      size: 2.2 + rng() * 3.8,
      angle: rng() * Math.PI,
      threshold: Math.min(0.95, inward * 0.9),
    });
  }

  return { segments, stars, facets };
}

// Crisp Ice Crystal Icon for Quick Presets & Popular Uses
function FrostCrystalIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 28 28"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="14" y1="2.5" x2="14" y2="25.5" />
      <line x1="4.04" y1="8.25" x2="23.96" y2="19.75" />
      <line x1="23.96" y1="8.25" x2="4.04" y2="19.75" />
      <polyline points="11.5,5.5 14,8 16.5,5.5" />
      <polyline points="11.5,22.5 14,20 16.5,22.5" />
      <polyline points="5.5,11.5 8.5,10.8 7.8,7.8" />
      <polyline points="22.5,16.5 19.5,17.2 20.2,20.2" />
      <polyline points="20.2,7.8 19.5,10.8 22.5,11.5" />
      <polyline points="7.8,20.2 8.5,17.2 5.5,16.5" />
    </svg>
  );
}

export default function FrostTimerComponent() {
  // Mode & Duration State (Default 25 minutes matching 25:00 in reference screenshot)
  const [mode, setMode] = useState<'duration' | 'endTime'>('duration');
  const [selectedPreset, setSelectedPreset] = useState<number | 'custom'>(25);
  const [customMinutes, setCustomMinutes] = useState<number>(25);
  const [endTimeStr, setEndTimeStr] = useState<string>('17:00');

  const [totalMs, setTotalMs] = useState<number>(25 * 60 * 1000);
  const [remainingMs, setRemainingMs] = useState<number>(25 * 60 * 1000);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [hasStartedOnce, setHasStartedOnce] = useState<boolean>(false);

  // Customization & Toggles State
  const [frostTheme, setFrostTheme] = useState<FrostThemeId>('classic-frost');
  const [glassBg, setGlassBg] = useState<GlassBgStyleId>('sunrise-pines');
  const [soundAlert, setSoundAlert] = useState<boolean>(true);
  const [showTime, setShowTime] = useState<boolean>(true);
  const [brightness, setBrightness] = useState<number>(100);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [savedToast, setSavedToast] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const frostCanvasRef = useRef<HTMLCanvasElement>(null);
  const customInputRef = useRef<HTMLInputElement>(null);
  const endTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  // Pre-compute high-resolution fractal frost geometry once
  const frostGeometry = useMemo(() => buildFrostCrystalGeometry(), []);

  // Load saved preferences from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setTimeout(() => {
          if (parsed.frostTheme && FROST_THEMES[parsed.frostTheme as FrostThemeId]) {
            setFrostTheme(parsed.frostTheme);
          }
          if (parsed.glassBg && GLASS_BACKGROUNDS[parsed.glassBg as GlassBgStyleId]) {
            setGlassBg(parsed.glassBg);
          }
          if (typeof parsed.soundAlert === 'boolean') setSoundAlert(parsed.soundAlert);
          if (typeof parsed.showTime === 'boolean') setShowTime(parsed.showTime);
          if (typeof parsed.brightness === 'number') setBrightness(parsed.brightness);
          if (typeof parsed.reducedMotion === 'boolean') setReducedMotion(parsed.reducedMotion);
        }, 0);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  // Crystalline Ice Bell Chime via Web Audio API
  const playFrostChime = useCallback(() => {
    if (!soundAlert) return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const notes = [1046.5, 1318.5, 1567.98, 2093.0]; // C6, E6, G6, C7
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.16);
        gain.gain.setValueAtTime(0.0001, ctx.currentTime + idx * 0.16);
        gain.gain.exponentialRampToValueAtTime(0.14, ctx.currentTime + idx * 0.16 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.16 + 1.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.16);
        osc.stop(ctx.currentTime + idx * 0.16 + 1.5);
      });
    } catch {
      // ignore audio restrictions
    }
  }, [soundAlert]);

  // High-precision countdown loop
  useEffect(() => {
    if (!isRunning) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    if (!endTimeRef.current) {
      endTimeRef.current = performance.now() + remainingMs;
    }

    const tick = (now: number) => {
      if (!endTimeRef.current) return;
      const left = Math.max(0, endTimeRef.current - now);
      setRemainingMs(left);

      if (left <= 0) {
        setIsRunning(false);
        setIsCompleted(true);
        endTimeRef.current = null;
        playFrostChime();
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isRunning, remainingMs, playFrostChime]);

  // Sync fullscreen state
  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const applyDurationMinutes = (mins: number, presetType: number | 'custom') => {
    const validMins = Math.max(1, Math.min(240, mins));
    const ms = validMins * 60 * 1000;
    setIsRunning(false);
    setIsCompleted(false);
    setHasStartedOnce(false);
    endTimeRef.current = null;
    setSelectedPreset(presetType);
    setCustomMinutes(validMins);
    setTotalMs(ms);
    setRemainingMs(ms);
  };

  const handleEndTimeChange = (val: string) => {
    setEndTimeStr(val);
    const [hh, mm] = val.split(':').map(Number);
    if (Number.isNaN(hh) || Number.isNaN(mm)) return;
    const now = new Date();
    const target = new Date();
    target.setHours(hh, mm, 0, 0);
    if (target.getTime() <= now.getTime()) {
      target.setDate(target.getDate() + 1);
    }
    const diffMs = Math.max(60 * 1000, target.getTime() - now.getTime());
    setIsRunning(false);
    setIsCompleted(false);
    setHasStartedOnce(false);
    endTimeRef.current = null;
    setTotalMs(diffMs);
    setRemainingMs(diffMs);
  };

  const handleStart = () => {
    if (remainingMs <= 0) {
      setRemainingMs(totalMs);
      setIsCompleted(false);
      endTimeRef.current = performance.now() + totalMs;
    } else {
      endTimeRef.current = performance.now() + remainingMs;
    }
    setHasStartedOnce(true);
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
    endTimeRef.current = null;
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsCompleted(false);
    setHasStartedOnce(false);
    endTimeRef.current = null;
    setRemainingMs(totalMs);
  };

  const handleToggleFullscreen = async () => {
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

  const handleSaveDefault = () => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          frostTheme,
          glassBg,
          soundAlert,
          showTime,
          brightness,
          reducedMotion,
        })
      );
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 2200);
    } catch {
      // ignore storage errors
    }
  };

  // Format MM:SS or HH:MM:SS
  const formattedTime = useMemo(() => {
    const totalSeconds = Math.ceil(remainingMs / 1000);
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    if (hrs > 0) {
      return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }, [remainingMs]);

  // Exact proportional frost progress (0.0 -> 1.0)
  const elapsedProgress = useMemo(() => {
    if (totalMs <= 0) return 0;
    return Math.min(1, Math.max(0, 1 - remainingMs / totalMs));
  }, [remainingMs, totalMs]);

  const visualFrostProgress = useMemo(() => {
    if (isCompleted) return 1;
    // Before starting, show the signature crystalline frost border around edges & corners (0.36) matching the reference screenshot
    if (!hasStartedOnce && !isRunning) return 0.36;
    // Once running, scale smoothly from 0.16 perimeter frost at t=0 to 1.0 full window crystallization at t=totalMs
    return 0.16 + elapsedProgress * 0.84;
  }, [elapsedProgress, hasStartedOnce, isRunning, isCompleted]);

  const activeTheme = FROST_THEMES[frostTheme];
  const activeBg = GLASS_BACKGROUNDS[glassBg];

  // Render Razor-Sharp HiDPI Fractal Frost Texture on Canvas
  useEffect(() => {
    const canvas = frostCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 2, 3);
    const targetW = CANVAS_W * dpr;
    const targetH = CANVAS_H * dpr;

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const progress = visualFrostProgress;
    const { segments, stars, facets } = frostGeometry;

    // 1. Subtle Crystalline Rime Vignette strictly along the frozen outer edge (leaves center 100% crystal-clear)
    const cx = CANVAS_W / 2;
    const cy = CANVAS_H / 2;
    const maxR = Math.hypot(cx, cy);
    const clearRatio = Math.max(0.02, Math.min(0.76, (1 - progress) * 0.78));
    const rimeGrad = ctx.createRadialGradient(cx, cy, maxR * clearRatio, cx, cy, maxR);
    rimeGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
    rimeGrad.addColorStop(0.55, activeTheme.rimeEdgeTint);
    rimeGrad.addColorStop(1, activeTheme.facetFill);
    ctx.fillStyle = rimeGrad;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // 2. Pass 1: Crisp Ice Refraction Shadow Facets (gives sharp 3D glass contrast without any blur!)
    ctx.strokeStyle = activeTheme.crystalShadow;
    for (let d = 0; d <= 2; d++) {
      ctx.lineWidth = d === 0 ? 2.6 : d === 1 ? 1.65 : 1.05;
      ctx.beginPath();
      for (let i = 0; i < segments.length; i++) {
        const seg = segments[i];
        if (seg.depth !== d || progress <= seg.startAt) continue;
        const localT =
          progress >= seg.endAt
            ? 1
            : (progress - seg.startAt) / Math.max(0.001, seg.endAt - seg.startAt);
        const ex = seg.x1 + (seg.x2 - seg.x1) * localT;
        const ey = seg.y1 + (seg.y2 - seg.y1) * localT;
        ctx.moveTo(seg.x1 + 0.9, seg.y1 + 0.9);
        ctx.lineTo(ex + 0.9, ey + 0.9);
      }
      ctx.stroke();
    }

    // 3. Pass 2: Crystalline Ice Body (Secondary & Primary Frost Needles)
    for (let d = 3; d >= 0; d--) {
      ctx.strokeStyle = d >= 2 ? activeTheme.crystalSecondary : activeTheme.crystalPrimary;
      ctx.lineWidth = d === 0 ? 2.35 : d === 1 ? 1.55 : d === 2 ? 1.05 : 0.75;
      ctx.beginPath();
      for (let i = 0; i < segments.length; i++) {
        const seg = segments[i];
        if (seg.depth !== d || progress <= seg.startAt) continue;
        const localT =
          progress >= seg.endAt
            ? 1
            : (progress - seg.startAt) / Math.max(0.001, seg.endAt - seg.startAt);
        const ex = seg.x1 + (seg.x2 - seg.x1) * localT;
        const ey = seg.y1 + (seg.y2 - seg.y1) * localT;
        ctx.moveTo(seg.x1, seg.y1);
        ctx.lineTo(ex, ey);
      }
      ctx.stroke();
    }

    // 4. Pass 3: Razor-Sharp Pure White Specular Crystal Ridges (#FFFFFF)
    ctx.strokeStyle = activeTheme.crystalHighlight;
    for (let d = 0; d <= 2; d++) {
      ctx.lineWidth = d === 0 ? 1.25 : d === 1 ? 0.85 : 0.6;
      ctx.beginPath();
      for (let i = 0; i < segments.length; i++) {
        const seg = segments[i];
        if (!seg.hasHighlight || seg.depth !== d || progress <= seg.startAt) continue;
        const localT =
          progress >= seg.endAt
            ? 1
            : (progress - seg.startAt) / Math.max(0.001, seg.endAt - seg.startAt);
        const ex = seg.x1 + (seg.x2 - seg.x1) * localT;
        const ey = seg.y1 + (seg.y2 - seg.y1) * localT;
        ctx.moveTo(seg.x1 - 0.3, seg.y1 - 0.3);
        ctx.lineTo(ex - 0.3, ey - 0.3);
      }
      ctx.stroke();
    }

    // 5. Crisp Hexagonal Stellar Dendrites & Faceted Ice Plates
    for (let i = 0; i < stars.length; i++) {
      const st = stars[i];
      if (progress <= st.threshold) continue;
      const scale = Math.min(1, (progress - st.threshold) / 0.14);
      const r = st.radius * (0.2 + scale * 0.8);

      ctx.save();
      ctx.translate(st.cx, st.cy);
      ctx.rotate((st.rotation * Math.PI) / 180);

      // Crisp inner hexagonal ice plate
      ctx.beginPath();
      for (let k = 0; k < 6; k++) {
        const a = (k * Math.PI) / 3;
        const hx = Math.cos(a) * (r * 0.34);
        const hy = Math.sin(a) * (r * 0.34);
        if (k === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.fillStyle = activeTheme.facetFill;
      ctx.fill();
      ctx.lineWidth = 0.9;
      ctx.strokeStyle = activeTheme.crystalPrimary;
      ctx.stroke();

      // 6 Branched Dendritic Arms
      ctx.beginPath();
      for (let k = 0; k < 6; k++) {
        const a = (k * Math.PI) / 3;
        const cosA = Math.cos(a);
        const sinA = Math.sin(a);
        ctx.moveTo(0, 0);
        ctx.lineTo(cosA * r, sinA * r);

        // Two pairs of sharp chevron barbs along each arm
        const p1 = r * 0.48;
        const p2 = r * 0.74;
        const b1 = r * 0.28;
        const b2 = r * 0.18;

        const aLeft = a - Math.PI / 3;
        const aRight = a + Math.PI / 3;

        ctx.moveTo(cosA * p1, sinA * p1);
        ctx.lineTo(cosA * p1 + Math.cos(aLeft) * b1, sinA * p1 + Math.sin(aLeft) * b1);
        ctx.moveTo(cosA * p1, sinA * p1);
        ctx.lineTo(cosA * p1 + Math.cos(aRight) * b1, sinA * p1 + Math.sin(aRight) * b1);

        ctx.moveTo(cosA * p2, sinA * p2);
        ctx.lineTo(cosA * p2 + Math.cos(aLeft) * b2, sinA * p2 + Math.sin(aLeft) * b2);
        ctx.moveTo(cosA * p2, sinA * p2);
        ctx.lineTo(cosA * p2 + Math.cos(aRight) * b2, sinA * p2 + Math.sin(aRight) * b2);
      }
      ctx.strokeStyle = activeTheme.crystalShadow;
      ctx.lineWidth = 1.8;
      ctx.stroke();

      ctx.strokeStyle = activeTheme.crystalHighlight;
      ctx.lineWidth = 1.15;
      ctx.stroke();

      ctx.restore();
    }

    // 6. Sparkling Micro-Crystals & Diamond Ice Needles
    ctx.fillStyle = activeTheme.crystalHighlight;
    ctx.strokeStyle = activeTheme.crystalPrimary;
    ctx.lineWidth = 0.75;
    for (let i = 0; i < facets.length; i++) {
      const f = facets[i];
      if (progress <= f.threshold) continue;
      const alpha = Math.min(0.95, (progress - f.threshold) / 0.12);
      const sz = f.size * Math.min(1, alpha);
      const dx = Math.cos(f.angle) * sz;
      const dy = Math.sin(f.angle) * sz;
      const px = -Math.sin(f.angle) * (sz * 0.45);
      const py = Math.cos(f.angle) * (sz * 0.45);

      ctx.beginPath();
      ctx.moveTo(f.x - dx, f.y - dy);
      ctx.lineTo(f.x + dx, f.y + dy);
      ctx.moveTo(f.x - px, f.y - py);
      ctx.lineTo(f.x + px, f.y + py);
      ctx.stroke();
    }

    // 7. Crisp Frosted Glass Inner Bevel Frame
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.52)';
    ctx.lineWidth = 2;
    ctx.strokeRect(8, 8, CANVAS_W - 16, CANVAS_H - 16);

    ctx.restore();
  }, [visualFrostProgress, activeTheme, frostGeometry]);

  return (
    <div className="space-y-10">
      {/* MAIN 3-COLUMN INTERACTIVE FROST TIMER CARD */}
      <div
        ref={containerRef}
        className="rounded-3xl bg-white dark:bg-[#171C19] border border-[#E2E6EC] dark:border-[#2B333B] shadow-sm p-4 sm:p-6 lg:p-7 transition-all"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-7 items-stretch">
          {/* LEFT COLUMN (lg:col-span-5): RAZOR-SHARP FROSTED GLASS SURFACE DISPLAY */}
          <div className="lg:col-span-5 flex flex-col">
            <div
              className={`relative w-full aspect-[1.06/1] rounded-2xl overflow-hidden border-2 border-[#B8D0E8] dark:border-[#2C4057] shadow-inner select-none ${
                isFullscreen ? 'timer-fullscreen-stage' : ''
              }`}
              style={{
                filter: `brightness(${brightness}%)`,
              }}
            >
              {/* Layer 1: Crisp Winter Sunrise Pine Landscape Behind the Glass (NO BLUR FILTER) */}
              <svg
                viewBox="0 0 500 420"
                className="w-full h-full block"
                preserveAspectRatio="xMidYMid slice"
                shapeRendering="geometricPrecision"
                role="img"
                aria-label={`Frost timer visual display showing ${formattedTime} remaining`}
              >
                <defs>
                  <linearGradient id="frostSkyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={activeBg.skyTop} />
                    <stop offset="48%" stopColor={activeBg.skyMid} />
                    <stop offset="76%" stopColor={activeBg.skyHorizon} />
                    <stop offset="100%" stopColor={activeBg.skyBottom} />
                  </linearGradient>

                  <radialGradient
                    id="frostSunGlow"
                    cx={`${(activeBg.sunCx / 500) * 100}%`}
                    cy={`${(activeBg.sunCy / 420) * 100}%`}
                    r="52%"
                  >
                    <stop offset="0%" stopColor={activeBg.sunCore} stopOpacity="0.98" />
                    <stop offset="22%" stopColor={activeBg.sunGlow} stopOpacity="0.82" />
                    <stop offset="55%" stopColor={activeBg.distantHaze} stopOpacity="0.38" />
                    <stop offset="100%" stopColor={activeBg.skyMid} stopOpacity="0" />
                  </radialGradient>

                  <linearGradient id="glassSpecularSheen" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.16" />
                    <stop offset="35%" stopColor="#FFFFFF" stopOpacity="0.02" />
                    <stop offset="65%" stopColor="#FFFFFF" stopOpacity="0.06" />
                    <stop offset="100%" stopColor="#D6ECFF" stopOpacity="0.15" />
                  </linearGradient>
                </defs>

                {/* Crisp Winter Sky & Golden Horizon */}
                <rect x="0" y="0" width="500" height="420" fill="url(#frostSkyGrad)" />
                <rect x="0" y="0" width="500" height="420" fill="url(#frostSunGlow)" />

                {/* Subtle Sunbeams Radiating from the Winter Sun */}
                <g opacity="0.18">
                  <polygon
                    points={`${activeBg.sunCx},${activeBg.sunCy} 80,420 155,420`}
                    fill={activeBg.sunCore}
                  />
                  <polygon
                    points={`${activeBg.sunCx},${activeBg.sunCy} 230,420 310,420`}
                    fill={activeBg.sunCore}
                  />
                  <polygon
                    points={`${activeBg.sunCx},${activeBg.sunCy} 375,420 455,420`}
                    fill={activeBg.sunCore}
                  />
                </g>

                {/* Crisp Sun Disc */}
                <circle
                  cx={activeBg.sunCx}
                  cy={activeBg.sunCy}
                  r="26"
                  fill={activeBg.sunCore}
                  opacity="0.92"
                />

                {/* Distant Crisp Mountain Range */}
                <polygon
                  points="0,295 65,245 135,278 215,232 290,268 365,238 440,266 500,242 500,340 0,340"
                  fill={activeBg.mountainFar}
                />
                {/* Mountain Snow Highlights */}
                <polygon
                  points="65,245 88,262 72,265 65,245"
                  fill="#DCEEFF"
                  opacity="0.35"
                />
                <polygon
                  points="215,232 245,254 222,258 215,232"
                  fill="#DCEEFF"
                  opacity="0.38"
                />
                <polygon
                  points="365,238 395,256 374,260 365,238"
                  fill="#DCEEFF"
                  opacity="0.35"
                />

                {/* Near Foothills & Snowy Banks */}
                <path
                  d="M 0 305 Q 125 278 255 296 T 500 288 L 500 420 L 0 420 Z"
                  fill={activeBg.mountainNear}
                />
                <path
                  d="M 0 338 Q 160 315 320 332 T 500 324 L 500 420 L 0 420 Z"
                  fill={activeBg.skyBottom}
                />

                {/* Shimmering Golden Reflection on Frozen Lake */}
                <ellipse
                  cx={activeBg.sunCx - 10}
                  cy="352"
                  rx="48"
                  ry="3.5"
                  fill={activeBg.sunGlow}
                  opacity="0.45"
                />
                <ellipse
                  cx={activeBg.sunCx - 10}
                  cy="364"
                  rx="34"
                  ry="2.5"
                  fill={activeBg.sunCore}
                  opacity="0.38"
                />
                <ellipse
                  cx={activeBg.sunCx - 10}
                  cy="374"
                  rx="22"
                  ry="2"
                  fill={activeBg.sunGlow}
                  opacity="0.28"
                />

                {/* Crisp Multi-Tiered Winter Pine Silhouettes Framing Left & Right */}
                {[
                  { x: 26, h: 205, w: 54 },
                  { x: 74, h: 168, w: 44 },
                  { x: 118, h: 138, w: 36 },
                  { x: 356, h: 145, w: 38 },
                  { x: 392, h: 178, w: 46 },
                  { x: 436, h: 212, w: 56 },
                ].map((tree, idx) => (
                  <g key={idx} transform={`translate(${tree.x}, ${348 - tree.h})`}>
                    {/* Trunk */}
                    <rect
                      x={tree.w * 0.44}
                      y={tree.h * 0.85}
                      width={tree.w * 0.12}
                      height={tree.h * 0.2}
                      fill={activeBg.treeSilhouette}
                    />
                    {/* 4 Crisp Layered Pine Boughs */}
                    {[0, 1, 2, 3].map((tier) => {
                      const topY = tree.h * (tier * 0.2);
                      const botY = tree.h * (0.34 + tier * 0.21);
                      const spread = tree.w * (0.36 + tier * 0.12);
                      const cxTree = tree.w / 2;
                      return (
                        <g key={tier}>
                          <polygon
                            points={`${cxTree},${topY} ${cxTree - spread},${botY} ${cxTree + spread},${botY}`}
                            fill={activeBg.treeSilhouette}
                          />
                          {/* Crisp Snow-Dusted Bough Highlight */}
                          <polyline
                            points={`${cxTree - spread * 0.82},${botY - 2} ${cxTree},${topY + 3} ${cxTree + spread * 0.82},${botY - 2}`}
                            fill="none"
                            stroke={activeBg.treeSnowHighlight}
                            strokeWidth="1.2"
                            strokeOpacity="0.45"
                          />
                        </g>
                      );
                    })}
                  </g>
                ))}

                {/* Diagonal Specular Window Glass Reflection */}
                <rect
                  x="0"
                  y="0"
                  width="500"
                  height="420"
                  fill="url(#glassSpecularSheen)"
                  pointerEvents="none"
                />
              </svg>

              {/* Layer 2: HiDPI Retina Procedural Fractal Frost Canvas (Zero Blur, Razor-Sharp Ice Crystals) */}
              <canvas
                ref={frostCanvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
              />

              {/* Layer 3: CENTER DIGITAL COUNTDOWN OVERLAY */}
              {(showTime || isFullscreen) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-4 text-center z-10">
                  <div
                    className={`font-sans font-bold text-white tracking-tight leading-none tabular-nums ${
                      isFullscreen
                        ? 'text-6xl sm:text-7xl md:text-8xl lg:text-9xl'
                        : 'text-5xl sm:text-6xl lg:text-[64px]'
                    }`}
                    style={{
                      textShadow:
                        '0 3px 16px rgba(10, 26, 48, 0.82), 0 1px 3px rgba(0, 0, 0, 0.65)',
                    }}
                  >
                    {formattedTime}
                  </div>
                  {!isFullscreen && (
                    <div
                      className="mt-2 text-sm sm:text-base font-medium text-white/95 tracking-wide"
                      style={{
                        textShadow: '0 2px 8px rgba(10, 26, 48, 0.9)',
                      }}
                    >
                      {isCompleted ? 'Frost Complete' : 'Focus Time'}
                    </div>
                  )}
                </div>
              )}

              {/* Subtle remaining clear-glass indicator badge in top-right when running (normal mode only) */}
              {isRunning && !isFullscreen && (
                <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-md bg-[#0E243D]/75 text-[11px] font-medium text-sky-100 border border-white/25">
                  {Math.round(elapsedProgress * 100)}% Frosted
                </div>
              )}

              {/* Exit Fullscreen Button in Top-Right Corner */}
              {isFullscreen && (
                <button
                  type="button"
                  onClick={handleToggleFullscreen}
                  className="absolute top-4 right-4 z-30 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-black/65 hover:bg-black/85 text-white text-xs font-semibold backdrop-blur-xs transition cursor-pointer"
                  aria-label="Exit Fullscreen"
                >
                  <Minimize2 className="w-4 h-4" />
                  <span>Exit Fullscreen</span>
                </button>
              )}
            </div>
          </div>

          {/* MIDDLE COLUMN (lg:col-span-4): DURATION & SESSION CONTROLS */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              {/* Duration / End Time Segmented Tabs */}
              <div className="grid grid-cols-2 bg-[#EEF2F6] dark:bg-[#212830] p-1 rounded-xl border border-[#DCE3EC] dark:border-[#2E3843]">
                <button
                  type="button"
                  onClick={() => setMode('duration')}
                  className={`py-2.5 px-4 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    mode === 'duration'
                      ? 'bg-[#0968B8] text-white shadow-xs'
                      : 'text-[#252B27]/80 dark:text-slate-300 hover:text-[#0968B8]'
                  }`}
                >
                  Duration
                </button>
                <button
                  type="button"
                  onClick={() => setMode('endTime')}
                  className={`py-2.5 px-4 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    mode === 'endTime'
                      ? 'bg-[#0968B8] text-white shadow-xs'
                      : 'text-[#252B27]/80 dark:text-slate-300 hover:text-[#0968B8]'
                  }`}
                >
                  End Time
                </button>
              </div>

              {mode === 'duration' ? (
                <>
                  {/* Preset Pill Buttons: 1 min | 3 min | 5 min | 10 min | 25 min | Custom */}
                  <div className="grid grid-cols-6 gap-1.5">
                    {[
                      { label: '1 min', val: 1 },
                      { label: '3 min', val: 3 },
                      { label: '5 min', val: 5 },
                      { label: '10 min', val: 10 },
                      { label: '25 min', val: 25 },
                    ].map((item) => {
                      const active = selectedPreset === item.val;
                      return (
                        <button
                          key={item.val}
                          type="button"
                          onClick={() => applyDurationMinutes(item.val, item.val)}
                          className={`py-2 px-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                            active
                              ? 'bg-[#0968B8] text-white border-[#0968B8] shadow-2xs'
                              : 'bg-[#F6F8FB] dark:bg-[#1E252C] text-[#252B27] dark:text-slate-200 border-[#DCE3EC] dark:border-[#2E3843] hover:border-[#0968B8]'
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPreset('custom');
                        customInputRef.current?.focus();
                      }}
                      className={`py-2 px-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        selectedPreset === 'custom'
                          ? 'bg-[#0968B8] text-white border-[#0968B8] shadow-2xs'
                          : 'bg-[#F6F8FB] dark:bg-[#1E252C] text-[#252B27] dark:text-slate-200 border-[#DCE3EC] dark:border-[#2E3843] hover:border-[#0968B8]'
                      }`}
                    >
                      Custom
                    </button>
                  </div>

                  {/* Custom Minutes Numeric Input */}
                  <div className="flex items-center gap-3">
                    <div className="relative flex items-center w-32 bg-[#F6F8FB] dark:bg-[#1E252C] border border-[#DCE3EC] dark:border-[#2E3843] rounded-xl px-3.5 py-2">
                      <input
                        ref={customInputRef}
                        type="number"
                        min={1}
                        max={240}
                        value={customMinutes}
                        onChange={(e) => {
                          const v = parseInt(e.target.value, 10);
                          if (!Number.isNaN(v)) {
                            applyDurationMinutes(v, 'custom');
                          } else {
                            setCustomMinutes(1);
                          }
                        }}
                        aria-label="Duration in minutes"
                        className="w-full bg-transparent text-lg font-bold text-[#142334] dark:text-white focus:outline-none"
                      />
                    </div>
                    <span className="text-sm font-medium text-[#252B27]/80 dark:text-slate-300">
                      minutes
                    </span>
                  </div>
                </>
              ) : (
                /* End Time Picker */
                <div className="flex items-center gap-3 py-2">
                  <label className="text-xs sm:text-sm font-medium text-[#252B27]/80 dark:text-slate-300">
                    Count down until:
                  </label>
                  <input
                    type="time"
                    value={endTimeStr}
                    onChange={(e) => handleEndTimeChange(e.target.value)}
                    className="bg-[#F6F8FB] dark:bg-[#1E252C] border border-[#DCE3EC] dark:border-[#2E3843] rounded-xl px-3.5 py-2 text-base font-bold text-[#142334] dark:text-white focus:outline-none focus:border-[#0968B8]"
                  />
                </div>
              )}

              {/* Primary Start Button */}
              <button
                type="button"
                onClick={isRunning ? handlePause : handleStart}
                className="w-full py-3.5 px-6 rounded-xl bg-[#0968B8] hover:bg-[#07569A] active:bg-[#064882] text-white font-semibold text-base shadow-xs flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{isRunning ? 'Running...' : 'Start'}</span>
              </button>

              {/* Secondary Pause & Reset Row */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={isRunning ? handlePause : handleStart}
                  className="py-2.5 px-4 rounded-xl bg-[#EFF3F7] dark:bg-[#222930] hover:bg-[#E2E8F0] dark:hover:bg-[#2B343D] text-[#1A2B3C] dark:text-slate-200 font-semibold text-sm flex items-center justify-center gap-2 border border-[#DCE3EC] dark:border-[#2E3843] transition-colors cursor-pointer"
                >
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pause</span>
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="py-2.5 px-4 rounded-xl bg-[#EFF3F7] dark:bg-[#222930] hover:bg-[#E2E8F0] dark:hover:bg-[#2B343D] text-[#1A2B3C] dark:text-slate-200 font-semibold text-sm flex items-center justify-center gap-2 border border-[#DCE3EC] dark:border-[#2E3843] transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Bottom Controls: Sound Alert, Fullscreen, Show Time, Brightness, Reduced Motion */}
            <div className="space-y-3.5 pt-3 border-t border-[#E6ECF2] dark:border-[#28313A]">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-[#252B27]/85 dark:text-slate-300">
                {/* Sound Alert Toggle */}
                <div className="flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-[#0968B8]" />
                  <span>Sound Alert</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={soundAlert}
                    aria-label="Sound Alert"
                    onClick={() => setSoundAlert(!soundAlert)}
                    className={`w-9 h-5 rounded-full transition-colors p-0.5 cursor-pointer ${
                      soundAlert ? 'bg-[#0968B8]' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-white shadow-2xs transition-transform ${
                        soundAlert ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Fullscreen Button */}
                <button
                  type="button"
                  onClick={handleToggleFullscreen}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-[#EFF3F7] dark:hover:bg-[#222930] transition-colors cursor-pointer"
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-3.5 h-3.5 text-[#0968B8]" />
                  ) : (
                    <Maximize2 className="w-3.5 h-3.5 text-[#0968B8]" />
                  )}
                  <span>Fullscreen</span>
                </button>

                {/* Show Time Toggle */}
                <div className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-[#0968B8]" />
                  <span>Show Time</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={showTime}
                    aria-label="Show Time"
                    onClick={() => setShowTime(!showTime)}
                    className={`w-9 h-5 rounded-full transition-colors p-0.5 cursor-pointer ${
                      showTime ? 'bg-[#0968B8]' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-white shadow-2xs transition-transform ${
                        showTime ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Brightness Slider matching reference image */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-[#1A2B3C] dark:text-slate-200">
                  <span>Brightness</span>
                  <span className="text-[11px] text-[#252B27]/60 dark:text-slate-400">
                    {brightness}%
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <input
                    type="range"
                    min={50}
                    max={130}
                    value={brightness}
                    onChange={(e) => setBrightness(Number(e.target.value))}
                    aria-label="Frost display brightness"
                    className="w-full h-1.5 bg-[#DCE5F0] dark:bg-[#2A3440] rounded-lg appearance-none cursor-pointer accent-[#0968B8]"
                  />
                  <Sun className="w-4 h-4 text-[#64748B] shrink-0" />
                </div>
              </div>

              {/* Reduced Motion Toggle */}
              <div className="flex items-center justify-between pt-0.5 text-xs font-medium text-[#252B27]/80 dark:text-slate-300">
                <span>Reduced Motion</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={reducedMotion}
                  aria-label="Reduced Motion"
                  onClick={() => setReducedMotion(!reducedMotion)}
                  className={`w-9 h-5 rounded-full transition-colors p-0.5 cursor-pointer ${
                    reducedMotion ? 'bg-[#0968B8]' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white shadow-2xs transition-transform ${
                      reducedMotion ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (lg:col-span-3): FROST THEME & BACKGROUND STYLE SELECTOR */}
          <div className="lg:col-span-3 flex flex-col justify-between bg-[#F8FAFC] dark:bg-[#1B2127] rounded-2xl p-4 border border-[#E2E8F0] dark:border-[#2A333D] space-y-4">
            <div className="space-y-4">
              {/* Frost Theme 2x2 Grid */}
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-[#142334] dark:text-white mb-2.5">
                  Frost Theme
                </h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {(Object.values(FROST_THEMES) as FrostThemeConfig[]).map((theme) => {
                    const isSelected = frostTheme === theme.id;
                    return (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => setFrostTheme(theme.id)}
                        className={`group rounded-xl overflow-hidden border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#0968B8] ring-2 ring-[#0968B8]/25 bg-[#EBF5FF] dark:bg-[#1C2E42]'
                            : 'border-[#DCE3EC] dark:border-[#2E3843] bg-white dark:bg-[#222930] hover:border-[#0968B8]/60'
                        }`}
                      >
                        {/* Crisp Illustrated Mini Frost Window Thumbnail */}
                        <div className="h-14 w-full relative overflow-hidden">
                          <svg
                            viewBox="0 0 120 70"
                            className="w-full h-full block"
                            shapeRendering="geometricPrecision"
                          >
                            <rect
                              x="0"
                              y="0"
                              width="120"
                              height="70"
                              fill={
                                theme.id === 'icy-blue'
                                  ? '#143861'
                                  : theme.id === 'winter-morning'
                                  ? '#466891'
                                  : theme.id === 'frosted-glass'
                                  ? '#344E6B'
                                  : '#24456E'
                              }
                            />
                            {/* Warm sun glow in thumbnail */}
                            <circle
                              cx={theme.id === 'icy-blue' ? 60 : 76}
                              cy="38"
                              r="16"
                              fill={theme.id === 'icy-blue' ? '#BAE6FD' : '#FFD393'}
                              opacity="0.82"
                            />
                            <circle
                              cx={theme.id === 'icy-blue' ? 60 : 76}
                              cy="38"
                              r="7"
                              fill="#FFFFFF"
                              opacity="0.9"
                            />
                            {/* Crisp Mini Pine Silhouettes */}
                            <polygon points="18,70 27,40 36,70" fill="#102238" />
                            <polygon points="30,70 37,46 44,70" fill="#152B46" />
                            <polygon points="86,70 95,36 104,70" fill="#102238" />
                            {/* Detailed Feathery Corner Frost Ferns */}
                            <g
                              stroke={theme.crystalPrimary}
                              strokeWidth="1.35"
                              strokeLinecap="round"
                            >
                              {/* Top-left fern */}
                              <line x1="0" y1="0" x2="42" y2="28" />
                              <line x1="12" y1="8" x2="26" y2="3" />
                              <line x1="12" y1="8" x2="6" y2="20" />
                              <line x1="24" y1="16" x2="36" y2="11" />
                              <line x1="24" y1="16" x2="18" y2="27" />
                              {/* Top-right fern */}
                              <line x1="120" y1="0" x2="78" y2="28" />
                              <line x1="108" y1="8" x2="94" y2="3" />
                              <line x1="108" y1="8" x2="114" y2="20" />
                              <line x1="96" y1="16" x2="84" y2="11" />
                              {/* Bottom-left fern */}
                              <line x1="0" y1="70" x2="42" y2="42" />
                              <line x1="14" y1="60" x2="28" y2="66" />
                              <line x1="14" y1="60" x2="6" y2="48" />
                              {/* Bottom-right fern */}
                              <line x1="120" y1="70" x2="78" y2="42" />
                              <line x1="106" y1="60" x2="92" y2="66" />
                              <line x1="106" y1="60" x2="114" y2="48" />
                            </g>
                            {/* Pure white crystal highlights */}
                            <g stroke="#FFFFFF" strokeWidth="0.75" strokeLinecap="round">
                              <line x1="0" y1="0" x2="34" y2="22" />
                              <line x1="120" y1="0" x2="86" y2="22" />
                              <line x1="0" y1="70" x2="34" y2="48" />
                              <line x1="120" y1="70" x2="86" y2="48" />
                            </g>
                          </svg>
                        </div>
                        <div
                          className={`py-1.5 px-1 text-[11px] font-semibold truncate ${
                            isSelected
                              ? 'text-[#0968B8] dark:text-sky-300'
                              : 'text-[#252B27]/85 dark:text-slate-200'
                          }`}
                        >
                          {theme.label}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Background Style Circular Swatches */}
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-[#142334] dark:text-white mb-2.5">
                  Background Style
                </h3>
                <div className="flex items-center justify-between gap-2">
                  {(Object.values(GLASS_BACKGROUNDS) as GlassBgConfig[]).map((bg) => {
                    const isSelected = glassBg === bg.id;
                    return (
                      <button
                        key={bg.id}
                        type="button"
                        onClick={() => setGlassBg(bg.id)}
                        title={bg.label}
                        aria-label={`Background style: ${bg.label}`}
                        className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all cursor-pointer p-0.5 ${
                          isSelected
                            ? 'border-[#0968B8] scale-105 shadow-xs'
                            : 'border-transparent hover:border-[#94A3B8]'
                        }`}
                      >
                        <svg
                          viewBox="0 0 48 48"
                          className="w-full h-full rounded-full"
                          shapeRendering="geometricPrecision"
                        >
                          <rect x="0" y="0" width="48" height="48" fill={bg.skyTop} />
                          <circle cx="30" cy="23" r="11" fill={bg.sunGlow} opacity="0.9" />
                          <circle cx="30" cy="23" r="5" fill={bg.sunCore} />
                          <path d="M0 34 Q24 28 48 34 L48 48 L0 48 Z" fill={bg.skyBottom} />
                          <polygon points="9,40 15,22 21,40" fill={bg.treeSilhouette} />
                          <polygon points="33,40 39,20 45,40" fill={bg.treeSilhouette} />
                          {/* Crisp frost rim lines on circular swatch */}
                          <g stroke="#E3F2FF" strokeWidth="1.2" strokeLinecap="round">
                            <line x1="4" y1="10" x2="14" y2="16" />
                            <line x1="44" y1="10" x2="34" y2="16" />
                          </g>
                        </svg>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Save as Default Button */}
            <button
              type="button"
              onClick={handleSaveDefault}
              className="w-full py-2.5 px-4 rounded-xl bg-white dark:bg-[#222930] border border-[#2A845C] text-[#1E6F4C] dark:text-emerald-300 hover:bg-[#F0F9F4] dark:hover:bg-[#1E2F28] text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {savedToast ? (
                <>
                  <Check className="w-4 h-4 text-[#1E6F4C]" />
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
        </div>
      </div>

      {/* QUICK PRESETS SECTION MATCHING SCREENSHOT */}
      <div>
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#142334] dark:text-white">
          Quick Presets
        </h2>
        <p className="text-xs sm:text-sm text-[#252B27]/70 dark:text-slate-400 mt-0.5 mb-4">
          Start with a common time or set a custom duration.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { mins: 1, label: '1 Minute', sub: 'Quick break' },
            { mins: 3, label: '3 Minutes', sub: 'Short focus' },
            { mins: 5, label: '5 Minutes', sub: 'Study session' },
            { mins: 10, label: '10 Minutes', sub: 'Deep work' },
            { mins: 25, label: '25 Minutes', sub: 'Longer session' },
          ].map((preset) => {
            const isSelected = selectedPreset === preset.mins && mode === 'duration';
            return (
              <button
                key={preset.mins}
                type="button"
                onClick={() => applyDurationMinutes(preset.mins, preset.mins)}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#F0F7FF] dark:bg-[#1A2836] border-[#0968B8] shadow-2xs'
                    : 'bg-white dark:bg-[#1A201C] border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#0968B8]/60'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-[#EBF5FF] dark:bg-[#1E3148] text-[#0968B8] dark:text-sky-400 flex items-center justify-center shrink-0">
                  <FrostCrystalIcon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-xs sm:text-sm text-[#142334] dark:text-white truncate">
                    {preset.label}
                  </div>
                  <div
                    className={`text-[11px] truncate ${
                      isSelected
                        ? 'text-[#0968B8] dark:text-sky-300 font-medium'
                        : 'text-[#252B27]/65 dark:text-slate-400'
                    }`}
                  >
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
              setSelectedPreset('custom');
              customInputRef.current?.focus();
            }}
            className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
              selectedPreset === 'custom'
                ? 'bg-[#F0F7FF] dark:bg-[#1A2836] border-[#0968B8] shadow-2xs'
                : 'bg-white dark:bg-[#1A201C] border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#0968B8]/60'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-[#EBF5FF] dark:bg-[#1E3148] text-[#0968B8] dark:text-sky-400 flex items-center justify-center shrink-0">
              <Settings className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-xs sm:text-sm text-[#142334] dark:text-white truncate">
                Custom
              </div>
              <div className="text-[11px] text-[#252B27]/65 dark:text-slate-400 truncate">
                Set your own time
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* POPULAR USES SECTION MATCHING SCREENSHOT */}
      <div>
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#142334] dark:text-white">
          Popular Uses
        </h2>
        <p className="text-xs sm:text-sm text-[#252B27]/70 dark:text-slate-400 mt-0.5 mb-4">
          A frost timer is great for many everyday activities.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {[
            {
              title: 'Study Sessions',
              desc: 'Stay focused and productive.',
              mins: 25,
              icon: <BookOpen className="w-5 h-5 text-[#0968B8]" />,
            },
            {
              title: 'Classroom Activities',
              desc: 'Keep students engaged during timed tasks.',
              mins: 10,
              icon: <GraduationCap className="w-5 h-5 text-[#0968B8]" />,
            },
            {
              title: 'Work Breaks',
              desc: 'Manage time for deeper focus.',
              mins: 5,
              icon: <Monitor className="w-5 h-5 text-[#0968B8]" />,
            },
            {
              title: 'Mindful Moments',
              desc: 'Take a calm break and reset.',
              mins: 3,
              icon: <Heart className="w-5 h-5 text-[#0968B8]" />,
            },
            {
              title: 'Activity Transitions',
              desc: 'Great for timed activities and games.',
              mins: 1,
              icon: <Activity className="w-5 h-5 text-[#0968B8]" />,
            },
            {
              title: 'Quiet Routines',
              desc: 'Build better habits with a visual timer.',
              mins: 15,
              icon: <Snowflake className="w-5 h-5 text-[#0968B8]" />,
            },
          ].map((useCase) => (
            <button
              key={useCase.title}
              type="button"
              onClick={() =>
                applyDurationMinutes(
                  useCase.mins,
                  [1, 3, 5, 10, 25].includes(useCase.mins) ? useCase.mins : 'custom'
                )
              }
              className="flex items-start gap-3 p-3.5 rounded-2xl bg-white dark:bg-[#1A201C] border border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#0968B8] transition-all text-left cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-[#EBF5FF] dark:bg-[#1E3148] flex items-center justify-center shrink-0 mt-0.5">
                {useCase.icon}
              </div>
              <div className="min-w-0">
                <div className="font-bold text-xs sm:text-sm text-[#142334] dark:text-white">
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

'use client';

import React from 'react';
import { motion } from 'motion/react';
import type { HolidayVisualIconKey, HolidayVisualTheme } from '@/lib/holiday-visuals';
import { HolidayIconGlyph } from '@/components/holidays/HolidayVisualIcon';

interface HolidayCelebrationSceneProps {
  theme: HolidayVisualTheme;
  isToday: boolean;
  isFullscreen?: boolean;
}

interface ParticleSpec {
  id: number;
  leftPct: number;
  topPct: number;
  sizeClass: string;
  duration: number;
  delay: number;
  driftX: number;
  rotateDeg: number;
  motifIndex: number;
}

const PARTICLES: ParticleSpec[] = [
  { id: 1, leftPct: 6, topPct: 14, sizeClass: 'w-4 h-4', duration: 7.5, delay: 0.0, driftX: 14, rotateDeg: 25, motifIndex: 0 },
  { id: 2, leftPct: 14, topPct: 68, sizeClass: 'w-5 h-5', duration: 9.2, delay: 0.6, driftX: -12, rotateDeg: -20, motifIndex: 1 },
  { id: 3, leftPct: 22, topPct: 28, sizeClass: 'w-3.5 h-3.5', duration: 6.8, delay: 1.1, driftX: 10, rotateDeg: 35, motifIndex: 2 },
  { id: 4, leftPct: 31, topPct: 78, sizeClass: 'w-4 h-4', duration: 8.4, delay: 0.3, driftX: -16, rotateDeg: -30, motifIndex: 0 },
  { id: 5, leftPct: 40, topPct: 12, sizeClass: 'w-3.5 h-3.5', duration: 7.1, delay: 1.8, driftX: 12, rotateDeg: 18, motifIndex: 1 },
  { id: 6, leftPct: 52, topPct: 82, sizeClass: 'w-5 h-5', duration: 9.6, delay: 0.9, driftX: -10, rotateDeg: -24, motifIndex: 2 },
  { id: 7, leftPct: 63, topPct: 16, sizeClass: 'w-4 h-4', duration: 7.9, delay: 1.5, driftX: 15, rotateDeg: 28, motifIndex: 0 },
  { id: 8, leftPct: 72, topPct: 72, sizeClass: 'w-3.5 h-3.5', duration: 6.5, delay: 0.2, driftX: -14, rotateDeg: -16, motifIndex: 1 },
  { id: 9, leftPct: 82, topPct: 24, sizeClass: 'w-5 h-5', duration: 8.8, delay: 1.3, driftX: 11, rotateDeg: 22, motifIndex: 2 },
  { id: 10, leftPct: 91, topPct: 64, sizeClass: 'w-4 h-4', duration: 7.4, delay: 0.5, driftX: -15, rotateDeg: -26, motifIndex: 0 },
  { id: 11, leftPct: 10, topPct: 44, sizeClass: 'w-3.5 h-3.5', duration: 8.1, delay: 2.1, driftX: 9, rotateDeg: 15, motifIndex: 2 },
  { id: 12, leftPct: 88, topPct: 42, sizeClass: 'w-4 h-4', duration: 8.6, delay: 1.7, driftX: -11, rotateDeg: -20, motifIndex: 1 },
];

export default function HolidayCelebrationScene({
  theme,
  isToday,
  isFullscreen = false,
}: HolidayCelebrationSceneProps) {
  const iconChoices: HolidayVisualIconKey[] = [
    theme.primaryIcon,
    theme.motifs[0],
    theme.motifs[1],
    theme.motifs[2],
  ];

  const renderParticleMotion = (p: ParticleSpec) => {
    if (theme.motionType === 'snow' || theme.motionType === 'leaves') {
      return {
        y: [-16, 26, -16],
        x: [0, p.driftX, 0],
        rotate: [0, p.rotateDeg, 0],
        opacity: [0.14, 0.34, 0.14],
      };
    }

    if (theme.motionType === 'hearts' || theme.motionType === 'lanterns') {
      return {
        y: [18, -24, 18],
        x: [0, p.driftX * 0.7, 0],
        scale: [0.92, 1.12, 0.92],
        opacity: [0.16, 0.36, 0.16],
      };
    }

    // sparks, stars, clover, ribbons
    return {
      y: [10, -14, 10],
      x: [0, p.driftX * 0.5, 0],
      scale: [0.85, 1.2, 0.85],
      rotate: [0, p.rotateDeg, 0],
      opacity: isToday ? [0.22, 0.48, 0.22] : [0.14, 0.34, 0.14],
    };
  };

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden pointer-events-none select-none rounded-[inherit]"
    >
      {/* Pulsing ambient festive halo behind flip cards */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: isToday ? [0.45, 0.75, 0.45] : [0.28, 0.48, 0.28],
        }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[78%] h-[62%] rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${theme.glowRgba} 0%, transparent 72%)`,
        }}
      />

      {/* Secondary corner celebration glow */}
      <motion.div
        animate={{
          opacity: [0.16, 0.32, 0.16],
        }}
        transition={{
          duration: 4.2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -right-12 -top-12 w-56 h-56 rounded-full blur-3xl"
        style={{
          backgroundColor: theme.secondaryHex,
        }}
      />

      {/* Floating themed holiday visual icons */}
      {PARTICLES.slice(0, isFullscreen ? 12 : 10).map((p) => {
        const iconName = iconChoices[p.motifIndex % iconChoices.length];
        const useSecondaryColor = p.id % 2 === 0;
        return (
          <motion.div
            key={p.id}
            animate={renderParticleMotion(p)}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute"
            style={{
              left: `${p.leftPct}%`,
              top: `${p.topPct}%`,
              color: useSecondaryColor ? theme.secondaryHex : theme.accentHex,
            }}
          >
            <HolidayIconGlyph
              name={iconName}
              className={isFullscreen ? 'w-6 h-6' : p.sizeClass}
            />
          </motion.div>
        );
      })}
    </div>
  );
}

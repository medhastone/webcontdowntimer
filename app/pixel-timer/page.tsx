import React from 'react';
import { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import PixelTimerComponent from '@/components/tools/PixelTimerComponent';

export const metadata: Metadata = {
  title: 'Free Online Pixel Timer — Retro Pixel-Art Visual Countdown | WebCountDownTimer',
  description:
    'A fun and retro pixel countdown timer to help you stay focused. Choose Retro Arcade, 8-bit Color, Monochrome, or Minimal Grid styles and customize pixel density.',
  alternates: {
    canonical: '/timers/pixel-timer',
  },
  openGraph: {
    title: 'Free Online Pixel Timer | WebCountDownTimer.com',
    description:
      'A fun and retro pixel-art visual countdown timer for gaming breaks, study sessions, classroom activities, and daily routines.',
    url: 'https://WebCountDownTimer.com/timers/pixel-timer',
    type: 'website',
  },
};

export default function PixelTimerAliasPage() {
  const tool = getToolBySlug('pixel-timer')!;
  return (
    <ToolPageLayout tool={tool}>
      <PixelTimerComponent />
    </ToolPageLayout>
  );
}

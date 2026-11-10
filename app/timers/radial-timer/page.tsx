import React from 'react';
import { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import RadialTimerComponent from '@/components/tools/RadialTimerComponent';

export const metadata: Metadata = {
  title: 'Free Online Radial Timer — Visual Radial Countdown Timer | WebCountDownTimer',
  description:
    'A unique radial countdown timer with a clear visual display. Choose Sunburst, Dots, Blocks, or Gradient Rays, customize colors and segment count, and use fullscreen mode.',
  alternates: {
    canonical: '/timers/radial-timer',
  },
  openGraph: {
    title: 'Free Online Radial Timer | WebCountDownTimer.com',
    description:
      'A unique radial countdown timer with customizable spokes, dots, blocks, and gradient rays for study, group activities, and productivity.',
    url: 'https://WebCountDownTimer.com/timers/radial-timer',
    type: 'website',
  },
};

export default function RadialTimerSubroutePage() {
  const tool = getToolBySlug('radial-timer')!;
  return (
    <ToolPageLayout tool={tool}>
      <RadialTimerComponent />
    </ToolPageLayout>
  );
}

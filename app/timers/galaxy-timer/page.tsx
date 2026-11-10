import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import GalaxyTimerComponent from '@/components/tools/GalaxyTimerComponent';

export const metadata: Metadata = {
  title: 'Free Online Galaxy Timer | Calming Starfield & Space Visual Countdown',
  description:
    'A stunning and relaxing galaxy countdown timer with a progressive starfield, spiral galaxy, and glowing nebula to help you focus, stay productive, and enjoy a calm space-inspired experience.',
  keywords: [
    'galaxy timer',
    'starfield countdown',
    'space visual timer',
    'cosmic countdown timer',
    'nebula visual timer',
    'study space timer',
  ],
  alternates: {
    canonical: 'https://WebCountDownTimer.com/timers/galaxy-timer/',
  },
  openGraph: {
    title: 'Free Online Galaxy Timer | Calming Starfield & Space Visual Countdown',
    description:
      'Watch a serene spiral galaxy, constellations, and glowing nebula gradually illuminate as your countdown progresses.',
    url: 'https://WebCountDownTimer.com/timers/galaxy-timer/',
    type: 'website',
  },
};

export default function GalaxyTimerPage() {
  const tool = getToolBySlug('galaxy-timer');
  if (!tool) notFound();

  return (
    <ToolPageLayout tool={tool}>
      <GalaxyTimerComponent />
    </ToolPageLayout>
  );
}

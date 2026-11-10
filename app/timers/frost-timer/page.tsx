import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import FrostTimerComponent from '@/components/tools/FrostTimerComponent';

export const metadata: Metadata = {
  title: 'Free Online Frost Timer | Calming Ice & Frosted Glass Visual Countdown',
  description:
    'A beautiful and calming frost visual timer that spreads delicate frost crystals across a realistic glass surface as time passes. Perfect for study sessions, classroom activities, work breaks, and quiet routines.',
  keywords: [
    'frost timer',
    'ice visual timer',
    'frost countdown timer',
    'frosted glass timer',
    'calming visual countdown',
    'ice crystal timer',
  ],
  alternates: {
    canonical: 'https://WebCountDownTimer.com/timers/frost-timer/',
  },
  openGraph: {
    title: 'Free Online Frost Timer | Calming Ice & Frosted Glass Visual Countdown',
    description:
      'Watch delicate frost crystals spread across a realistic glass surface as your countdown runs. Includes Classic Frost, Icy Blue, Winter Morning, and Frosted Glass themes.',
    url: 'https://WebCountDownTimer.com/timers/frost-timer/',
    type: 'website',
  },
};

export default function FrostTimerPage() {
  const tool = getToolBySlug('frost-timer');
  if (!tool) notFound();

  return (
    <ToolPageLayout tool={tool}>
      <FrostTimerComponent />
    </ToolPageLayout>
  );
}

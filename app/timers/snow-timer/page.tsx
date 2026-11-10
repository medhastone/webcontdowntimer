import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import SnowTimerComponent from '@/components/tools/SnowTimerComponent';

export const metadata: Metadata = {
  title: 'Free Online Snow Timer | Calming Falling Snow & Winter Visual Countdown',
  description:
    'A calming and beautiful snowfall visual timer where snowflakes gently fall and accumulate along the bottom of a peaceful winter scene as time passes. Perfect for classrooms, reading sessions, study breaks, and seasonal games.',
  keywords: [
    'snow timer',
    'falling snow countdown',
    'snow visual timer',
    'winter visual timer',
    'snowfall countdown timer',
    'calming winter timer',
  ],
  alternates: {
    canonical: 'https://WebCountDownTimer.com/timers/snow-timer/',
  },
  openGraph: {
    title: 'Free Online Snow Timer | Calming Falling Snow & Winter Visual Countdown',
    description:
      'Watch gentle snowflakes fall and gradually accumulate across a peaceful winter cabin or forest scene as your countdown progresses.',
    url: 'https://WebCountDownTimer.com/timers/snow-timer/',
    type: 'website',
  },
};

export default function SnowTimerPage() {
  const tool = getToolBySlug('snow-timer');
  if (!tool) notFound();

  return (
    <ToolPageLayout tool={tool}>
      <SnowTimerComponent />
    </ToolPageLayout>
  );
}

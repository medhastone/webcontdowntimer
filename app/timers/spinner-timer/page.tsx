import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import SpinnerTimerComponent from '@/components/tools/SpinnerTimerComponent';

export const metadata: Metadata = {
  title: 'Free Online Spinner Timer | Spinning Visual Countdown Timer',
  description:
    'A clear and interactive spinning countdown timer to help you stay focused, manage activities and make timed tasks more engaging.',
  keywords: [
    'spinner timer',
    'spinning countdown timer',
    'rotating visual timer',
    'free online spinner timer',
    'classroom spinner timer',
    'visual wheel countdown',
  ],
  alternates: {
    canonical: 'https://WebCountDownTimer.com/timers/spinner-timer/',
  },
  openGraph: {
    title: 'Free Online Spinner Timer | Spinning Visual Countdown Timer',
    description:
      'A clear and interactive spinning countdown timer with clockwise/counterclockwise rotation, glowing segment tracks, and custom durations.',
    url: 'https://WebCountDownTimer.com/timers/spinner-timer/',
    type: 'website',
  },
};

export default function SpinnerTimerPage() {
  const tool = getToolBySlug('spinner-timer');
  if (!tool) notFound();

  return (
    <ToolPageLayout tool={tool}>
      <SpinnerTimerComponent />
    </ToolPageLayout>
  );
}

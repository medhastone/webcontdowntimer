import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import CoralTimerComponent from '@/components/tools/CoralTimerComponent';

export const metadata: Metadata = {
  title: 'Free Online Coral Timer | Growing Coral Visual Countdown',
  description:
    'A relaxing and beautiful coral growth visual timer to help you focus, stay calm and make the most of your time. Customize coral themes, ocean backgrounds, and duration.',
  keywords: [
    'coral timer',
    'growing coral visual timer',
    'ocean visual countdown',
    'free online coral timer',
    'underwater coral countdown',
    'classroom coral timer',
    'reading break coral timer',
  ],
  alternates: {
    canonical: 'https://WebCountDownTimer.com/timers/coral-timer',
  },
  openGraph: {
    title: 'Free Online Coral Timer | Growing Coral Visual Countdown',
    description:
      'A relaxing and beautiful coral growth visual timer to help you focus, stay calm and make the most of your time.',
    url: 'https://WebCountDownTimer.com/timers/coral-timer',
    type: 'website',
  },
};

export default function CoralTimerPage() {
  const tool = getToolBySlug('coral-timer');
  if (!tool) {
    notFound();
  }

  return (
    <ToolPageLayout tool={tool}>
      <CoralTimerComponent />
    </ToolPageLayout>
  );
}

import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import LichenTimerComponent from '@/components/tools/LichenTimerComponent';

export const metadata: Metadata = {
  title: 'Free Online Lichen Timer | Organic Nature-Inspired Countdown',
  description:
    'A calming and beautiful lichen growth visual timer to help you focus, stay present and enjoy your time with nature-inspired visuals. Customize lichen themes, stone & bark backgrounds, and duration.',
  keywords: [
    'lichen timer',
    'organic visual timer',
    'nature-inspired countdown',
    'free online lichen timer',
    'moss and lichen timer',
    'quiet reading timer',
    'botanical visual timer',
  ],
  alternates: {
    canonical: 'https://WebCountDownTimer.com/timers/lichen-timer',
  },
  openGraph: {
    title: 'Free Online Lichen Timer | Organic Nature-Inspired Countdown',
    description:
      'A calming and beautiful lichen growth visual timer to help you focus, stay present and enjoy your time with nature-inspired visuals.',
    url: 'https://WebCountDownTimer.com/timers/lichen-timer',
    type: 'website',
  },
};

export default function LichenTimerPage() {
  const tool = getToolBySlug('lichen-timer');
  if (!tool) {
    notFound();
  }

  return (
    <ToolPageLayout tool={tool}>
      <LichenTimerComponent />
    </ToolPageLayout>
  );
}

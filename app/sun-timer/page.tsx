import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import SunTimerComponent from '@/components/tools/SunTimerComponent';

export const metadata: Metadata = {
  title: 'Free Online Sun Timer | Visual Sun & Sky Countdown Timer',
  description:
    'A beautiful sun visual timer to help you focus, stay productive and enjoy your time with calming Morning, Midday, Sunset, and Warm Neutral sky scenes.',
  alternates: {
    canonical: 'https://WebCountDownTimer.com/timers/sun-timer',
  },
};

export default function SunTimerAliasPage() {
  const tool = getToolBySlug('sun-timer');
  if (!tool) {
    notFound();
  }

  return (
    <ToolPageLayout tool={tool}>
      <SunTimerComponent />
    </ToolPageLayout>
  );
}

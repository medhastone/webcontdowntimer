import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import BubbleTimerComponent from '@/components/tools/BubbleTimerComponent';

export const metadata: Metadata = {
  title: 'Free Online Bubble Timer | Calming Bubble Visual Countdown',
  description:
    'A calming and interactive bubble visual timer to help you focus, relax and make the most of your time. Customize bubble themes, underwater backgrounds, density, and duration.',
  keywords: [
    'bubble timer',
    'bubble visual countdown',
    'calming bubble timer',
    'free online bubble timer',
    'underwater bubble countdown',
    'classroom bubble timer',
    'study break bubble timer',
  ],
  alternates: {
    canonical: 'https://WebCountDownTimer.com/timers/bubble-timer',
  },
  openGraph: {
    title: 'Free Online Bubble Timer | Calming Bubble Visual Countdown',
    description:
      'A calming and interactive bubble visual timer to help you focus, relax and make the most of your time.',
    url: 'https://WebCountDownTimer.com/timers/bubble-timer',
    type: 'website',
  },
};

export default function BubbleTimerPage() {
  const tool = getToolBySlug('bubble-timer');
  if (!tool) {
    notFound();
  }

  return (
    <ToolPageLayout tool={tool}>
      <BubbleTimerComponent />
    </ToolPageLayout>
  );
}

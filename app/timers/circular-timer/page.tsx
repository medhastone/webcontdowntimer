import React from 'react';
import { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import CircularTimerComponent from '@/components/tools/CircularTimerComponent';

export const metadata: Metadata = {
  title: 'Free Online Circular Timer — Visual Circle Countdown Timer | WebCountDownTimer',
  description:
    'A simple and visual circle countdown timer to help you stay focused. Customize circle colors, background styles, clockwise or counterclockwise direction, fullscreen display, and sound alerts.',
  alternates: {
    canonical: '/timers/circular-timer',
  },
  openGraph: {
    title: 'Free Online Circular Timer | WebCountDownTimer.com',
    description:
      'A simple and visual circle countdown timer for classrooms, presentations, study blocks, and daily planning.',
    url: 'https://WebCountDownTimer.com/timers/circular-timer',
    type: 'website',
  },
};

export default function CircularTimerSubroutePage() {
  const tool = getToolBySlug('circular-timer')!;
  return (
    <ToolPageLayout tool={tool}>
      <CircularTimerComponent />
    </ToolPageLayout>
  );
}

import React from 'react';
import { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import ProgressTimerComponent from '@/components/tools/ProgressTimerComponent';

export const metadata: Metadata = {
  title: 'Free Online Progress Timer — Visual Progress Bar Countdown | WebCountDownTimer',
  description:
    'A simple and flexible progress bar timer to help you stay on track. Choose Horizontal, Vertical, Segmented, or Thin Line styles, add a task label, and set warning alerts.',
  alternates: {
    canonical: '/timers/progress-timer',
  },
  openGraph: {
    title: 'Free Online Progress Timer | WebCountDownTimer.com',
    description:
      'A simple and flexible progress bar countdown timer with multiple display styles for work, study sessions, meetings, and classrooms.',
    url: 'https://WebCountDownTimer.com/timers/progress-timer',
    type: 'website',
  },
};

export default function ProgressTimerSubroutePage() {
  const tool = getToolBySlug('progress-timer')!;
  return (
    <ToolPageLayout tool={tool}>
      <ProgressTimerComponent />
    </ToolPageLayout>
  );
}

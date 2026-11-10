import React from 'react';
import { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import RingsTimerComponent from '@/components/tools/RingsTimerComponent';

export const metadata: Metadata = {
  title: 'Free Online Rings Timer — Multi-Ring Visual Countdown Timer | WebCountDownTimer',
  description:
    'A beautiful multi-ring countdown timer to help you stay focused and organized. Customize Classic, Gradient, Minimal, or Dashed concentric rings, ring colors, and fullscreen mode.',
  alternates: {
    canonical: '/timers/rings-timer',
  },
  openGraph: {
    title: 'Free Online Rings Timer | WebCountDownTimer.com',
    description:
      'A beautiful multi-ring countdown timer with customizable concentric rings for study sessions, classroom activities, and multi-stage tasks.',
    url: 'https://WebCountDownTimer.com/timers/rings-timer',
    type: 'website',
  },
};

export default function RingsTimerSubroutePage() {
  const tool = getToolBySlug('rings-timer')!;
  return (
    <ToolPageLayout tool={tool}>
      <RingsTimerComponent />
    </ToolPageLayout>
  );
}

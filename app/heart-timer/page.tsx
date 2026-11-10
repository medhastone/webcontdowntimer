import React from 'react';
import { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import HeartTimerComponent from '@/components/tools/HeartTimerComponent';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Free Online Heart Timer | Heart-Shaped Visual Countdown',
  description:
    'A beautiful heart-shaped countdown timer with smooth draining fill, Rose, Berry, Ivory, and Soft Red themes, custom durations, sound alerts, and fullscreen mode.',
  alternates: {
    canonical: '/timers/heart-timer',
  },
};

export default function HeartTimerAliasPage() {
  const tool = getToolBySlug('heart-timer');
  if (!tool) notFound();

  return (
    <ToolPageLayout tool={tool}>
      <HeartTimerComponent />
    </ToolPageLayout>
  );
}

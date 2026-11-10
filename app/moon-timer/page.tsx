import React from 'react';
import { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import MoonTimerComponent from '@/components/tools/MoonTimerComponent';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Free Online Moon Timer | Calming Moon Visual Countdown',
  description:
    'A calming and beautiful moon visual timer with Classic, Crescent, Blue, and Warm Moon styles, Night Sky, Forest, Mountains, and Lakeside themes, brightness controls, and fullscreen display.',
  alternates: {
    canonical: '/timers/moon-timer',
  },
};

export default function MoonTimerAliasPage() {
  const tool = getToolBySlug('moon-timer');
  if (!tool) notFound();

  return (
    <ToolPageLayout tool={tool}>
      <MoonTimerComponent />
    </ToolPageLayout>
  );
}

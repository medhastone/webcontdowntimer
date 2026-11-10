import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import LavaLampTimerComponent from '@/components/tools/LavaLampTimerComponent';

export const metadata: Metadata = {
  title: 'Free Online Lava Lamp Timer | Retro Lava Lamp Visual Countdown',
  description:
    'A retro and relaxing lava lamp countdown timer that helps you focus, relax and enjoy a calming visual experience with rising, merging liquid wax blobs.',
  keywords: [
    'lava lamp timer',
    'retro lava lamp countdown',
    'liquid motion timer',
    'free online lava lamp timer',
    'lava lamp visual timer',
    'calming retro timer',
  ],
  alternates: {
    canonical: 'https://WebCountDownTimer.com/timers/lava-lamp-timer/',
  },
  openGraph: {
    title: 'Free Online Lava Lamp Timer | Retro Lava Lamp Visual Countdown',
    description:
      'Watch smooth, glowing lava blobs slowly rise, expand, and merge as your countdown progresses.',
    url: 'https://WebCountDownTimer.com/timers/lava-lamp-timer/',
    type: 'website',
  },
};

export default function LavaLampTimerPage() {
  const tool = getToolBySlug('lava-lamp-timer');
  if (!tool) notFound();

  return (
    <ToolPageLayout tool={tool}>
      <LavaLampTimerComponent />
    </ToolPageLayout>
  );
}

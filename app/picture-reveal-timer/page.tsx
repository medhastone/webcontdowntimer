import React from 'react';
import { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import PictureRevealTimerComponent from '@/components/tools/PictureRevealTimerComponent';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Free Online Picture Reveal Timer | Photo Reveal Countdown',
  description:
    'Upload a photo and watch it gradually appear behind a grid of tiles as the countdown runs. Processed 100% locally in your browser for classrooms, guessing games, quizzes and surprises.',
  alternates: {
    canonical: '/timers/picture-reveal-timer',
  },
};

export default function PictureRevealTimerAliasPage() {
  const tool = getToolBySlug('picture-reveal-timer');
  if (!tool) notFound();

  return (
    <ToolPageLayout tool={tool}>
      <PictureRevealTimerComponent />
    </ToolPageLayout>
  );
}

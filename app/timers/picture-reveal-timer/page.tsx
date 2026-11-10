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
  openGraph: {
    title: 'Free Online Picture Reveal Timer',
    description:
      'Interactive hidden picture countdown timer for classroom guessing games, trivia quizzes, and group activities.',
    url: '/timers/picture-reveal-timer',
    type: 'website',
  },
};

export default function TimersPictureRevealTimerPage() {
  const tool = getToolBySlug('picture-reveal-timer');
  if (!tool) notFound();

  return (
    <ToolPageLayout tool={tool}>
      <PictureRevealTimerComponent />
    </ToolPageLayout>
  );
}

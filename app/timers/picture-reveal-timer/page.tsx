import { buildPageMetadata } from '@/lib/seo-metadata';
import React from 'react';
import { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import PictureRevealTimerComponent from '@/components/tools/PictureRevealTimerComponent';
import { notFound } from 'next/navigation';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/timers/picture-reveal-timer');
}

export default function TimersPictureRevealTimerPage() {
  const tool = getToolBySlug('picture-reveal-timer');
  if (!tool) notFound();

  return (
    <ToolPageLayout tool={tool}>
      <PictureRevealTimerComponent />
    </ToolPageLayout>
  );
}

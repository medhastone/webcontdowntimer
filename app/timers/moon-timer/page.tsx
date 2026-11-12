import { buildPageMetadata } from '@/lib/seo-metadata';
import React from 'react';
import { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import MoonTimerComponent from '@/components/tools/MoonTimerComponent';
import { notFound } from 'next/navigation';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/timers/moon-timer');
}

export default function TimersMoonTimerPage() {
  const tool = getToolBySlug('moon-timer');
  if (!tool) notFound();

  return (
    <ToolPageLayout tool={tool}>
      <MoonTimerComponent />
    </ToolPageLayout>
  );
}

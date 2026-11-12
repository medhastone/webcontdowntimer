import { buildPageMetadata } from '@/lib/seo-metadata';
import React from 'react';
import { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import HeartTimerComponent from '@/components/tools/HeartTimerComponent';
import { notFound } from 'next/navigation';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/timers/heart-timer');
}

export default function TimersHeartTimerPage() {
  const tool = getToolBySlug('heart-timer');
  if (!tool) notFound();

  return (
    <ToolPageLayout tool={tool}>
      <HeartTimerComponent />
    </ToolPageLayout>
  );
}

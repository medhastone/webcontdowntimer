import { buildPageMetadata } from '@/lib/seo-metadata';
import React from 'react';
import { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import CircularTimerComponent from '@/components/tools/CircularTimerComponent';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/timers/circular-timer');
}

export default function CircularTimerSubroutePage() {
  const tool = getToolBySlug('circular-timer')!;
  return (
    <ToolPageLayout tool={tool}>
      <CircularTimerComponent />
    </ToolPageLayout>
  );
}

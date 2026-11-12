import { buildPageMetadata } from '@/lib/seo-metadata';
import React from 'react';
import { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import RadialTimerComponent from '@/components/tools/RadialTimerComponent';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/timers/radial-timer');
}

export default function RadialTimerSubroutePage() {
  const tool = getToolBySlug('radial-timer')!;
  return (
    <ToolPageLayout tool={tool}>
      <RadialTimerComponent />
    </ToolPageLayout>
  );
}

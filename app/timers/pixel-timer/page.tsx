import { buildPageMetadata } from '@/lib/seo-metadata';
import React from 'react';
import { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import PixelTimerComponent from '@/components/tools/PixelTimerComponent';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/timers/pixel-timer');
}

export default function TimersPixelTimerPage() {
  const tool = getToolBySlug('pixel-timer')!;
  return (
    <ToolPageLayout tool={tool}>
      <PixelTimerComponent />
    </ToolPageLayout>
  );
}

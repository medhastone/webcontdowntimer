import { buildPageMetadata } from '@/lib/seo-metadata';
import React from 'react';
import { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import RingsTimerComponent from '@/components/tools/RingsTimerComponent';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/timers/rings-timer');
}

export default function RingsTimerSubroutePage() {
  const tool = getToolBySlug('rings-timer')!;
  return (
    <ToolPageLayout tool={tool}>
      <RingsTimerComponent />
    </ToolPageLayout>
  );
}

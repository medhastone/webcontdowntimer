import { buildPageMetadata } from '@/lib/seo-metadata';
import React from 'react';
import { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import ProgressTimerComponent from '@/components/tools/ProgressTimerComponent';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/timers/progress-timer');
}

export default function ProgressTimerSubroutePage() {
  const tool = getToolBySlug('progress-timer')!;
  return (
    <ToolPageLayout tool={tool}>
      <ProgressTimerComponent />
    </ToolPageLayout>
  );
}

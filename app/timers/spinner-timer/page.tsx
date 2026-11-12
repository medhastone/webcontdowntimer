import { buildPageMetadata } from '@/lib/seo-metadata';
import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import SpinnerTimerComponent from '@/components/tools/SpinnerTimerComponent';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/timers/spinner-timer');
}

export default function SpinnerTimerPage() {
  const tool = getToolBySlug('spinner-timer');
  if (!tool) notFound();

  return (
    <ToolPageLayout tool={tool}>
      <SpinnerTimerComponent />
    </ToolPageLayout>
  );
}

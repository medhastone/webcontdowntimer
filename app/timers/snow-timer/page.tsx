import { buildPageMetadata } from '@/lib/seo-metadata';
import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import SnowTimerComponent from '@/components/tools/SnowTimerComponent';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/timers/snow-timer');
}

export default function SnowTimerPage() {
  const tool = getToolBySlug('snow-timer');
  if (!tool) notFound();

  return (
    <ToolPageLayout tool={tool}>
      <SnowTimerComponent />
    </ToolPageLayout>
  );
}

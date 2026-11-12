import { buildPageMetadata } from '@/lib/seo-metadata';
import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import GalaxyTimerComponent from '@/components/tools/GalaxyTimerComponent';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/timers/galaxy-timer');
}

export default function GalaxyTimerPage() {
  const tool = getToolBySlug('galaxy-timer');
  if (!tool) notFound();

  return (
    <ToolPageLayout tool={tool}>
      <GalaxyTimerComponent />
    </ToolPageLayout>
  );
}

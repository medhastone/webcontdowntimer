import { buildPageMetadata } from '@/lib/seo-metadata';
import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import LavaLampTimerComponent from '@/components/tools/LavaLampTimerComponent';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/timers/lava-lamp-timer');
}

export default function LavaLampTimerPage() {
  const tool = getToolBySlug('lava-lamp-timer');
  if (!tool) notFound();

  return (
    <ToolPageLayout tool={tool}>
      <LavaLampTimerComponent />
    </ToolPageLayout>
  );
}

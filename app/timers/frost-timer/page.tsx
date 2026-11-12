import { buildPageMetadata } from '@/lib/seo-metadata';
import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import FrostTimerComponent from '@/components/tools/FrostTimerComponent';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/timers/frost-timer');
}

export default function FrostTimerPage() {
  const tool = getToolBySlug('frost-timer');
  if (!tool) notFound();

  return (
    <ToolPageLayout tool={tool}>
      <FrostTimerComponent />
    </ToolPageLayout>
  );
}

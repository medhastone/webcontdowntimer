import { buildPageMetadata } from '@/lib/seo-metadata';
import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import BubbleTimerComponent from '@/components/tools/BubbleTimerComponent';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/timers/bubble-timer');
}

export default function BubbleTimerPage() {
  const tool = getToolBySlug('bubble-timer');
  if (!tool) {
    notFound();
  }

  return (
    <ToolPageLayout tool={tool}>
      <BubbleTimerComponent />
    </ToolPageLayout>
  );
}

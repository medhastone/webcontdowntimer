import { buildPageMetadata } from '@/lib/seo-metadata';
import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import CoralTimerComponent from '@/components/tools/CoralTimerComponent';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/timers/coral-timer');
}

export default function CoralTimerPage() {
  const tool = getToolBySlug('coral-timer');
  if (!tool) {
    notFound();
  }

  return (
    <ToolPageLayout tool={tool}>
      <CoralTimerComponent />
    </ToolPageLayout>
  );
}

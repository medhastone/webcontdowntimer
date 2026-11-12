import { buildPageMetadata } from '@/lib/seo-metadata';
import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import LiquidTimerComponent from '@/components/tools/LiquidTimerComponent';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/timers/liquid-timer');
}

export default function TimersLiquidTimerPage() {
  const tool = getToolBySlug('liquid-timer')!;

  return (
    <ToolPageLayout tool={tool}>
      <LiquidTimerComponent />
    </ToolPageLayout>
  );
}

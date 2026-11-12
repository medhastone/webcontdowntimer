import { buildPageMetadata } from '@/lib/seo-metadata';
import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import IntervalTimerComponent from '@/components/tools/IntervalTimerComponent';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/interval-timer');
}

export default function IntervalTimerPage() {
  const tool = getToolBySlug('interval-timer')!;

  return (
    <ToolPageLayout tool={tool}>
      <IntervalTimerComponent />
    </ToolPageLayout>
  );
}

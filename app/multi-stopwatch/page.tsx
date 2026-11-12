import { buildPageMetadata } from '@/lib/seo-metadata';
import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import MultiStopwatchComponent from '@/components/tools/MultiStopwatchComponent';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/multi-stopwatch');
}

export default function MultiStopwatchPage() {
  const tool = getToolBySlug('multi-stopwatch')!;

  return (
    <ToolPageLayout tool={tool}>
      <MultiStopwatchComponent />
    </ToolPageLayout>
  );
}

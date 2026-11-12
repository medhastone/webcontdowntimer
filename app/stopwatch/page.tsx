import { buildPageMetadata } from '@/lib/seo-metadata';
import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import StopwatchComponent from '@/components/tools/StopwatchComponent';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/stopwatch');
}

export default function StopwatchPage() {
  const tool = getToolBySlug('stopwatch')!;

  return (
    <ToolPageLayout tool={tool}>
      <StopwatchComponent />
    </ToolPageLayout>
  );
}

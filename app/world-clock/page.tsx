import { buildPageMetadata } from '@/lib/seo-metadata';
import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import WorldClockDashboardComponent from '@/components/tools/WorldClockDashboardComponent';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/world-clock');
}

export default function WorldClockPage() {
  const tool = getToolBySlug('world-clock')!;

  return (
    <ToolPageLayout tool={tool}>
      <WorldClockDashboardComponent />
    </ToolPageLayout>
  );
}

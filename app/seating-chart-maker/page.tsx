import { buildPageMetadata } from '@/lib/seo-metadata';
import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import CommunityActivityToolsComponent from '@/components/tools/CommunityActivityToolsComponent';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/seating-chart-maker');
}

export default function SeatingChartMakerPage() {
  const tool = getToolBySlug('seating-chart-maker')!;

  return (
    <ToolPageLayout tool={tool}>
      <CommunityActivityToolsComponent variant="seating-chart-maker" />
    </ToolPageLayout>
  );
}

import { buildPageMetadata } from '@/lib/seo-metadata';
import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import CommunityActivityToolsComponent from '@/components/tools/CommunityActivityToolsComponent';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/chess-clock');
}

export default function ChessClockPage() {
  const tool = getToolBySlug('chess-clock')!;

  return (
    <ToolPageLayout tool={tool}>
      <CommunityActivityToolsComponent variant="chess-clock" />
    </ToolPageLayout>
  );
}

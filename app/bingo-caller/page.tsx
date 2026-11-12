import { buildPageMetadata } from '@/lib/seo-metadata';
import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import CommunityActivityToolsComponent from '@/components/tools/CommunityActivityToolsComponent';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/bingo-caller');
}

export default function BingoCallerPage() {
  const tool = getToolBySlug('bingo-caller')!;

  return (
    <ToolPageLayout tool={tool}>
      <CommunityActivityToolsComponent variant="bingo-caller" />
    </ToolPageLayout>
  );
}

import { buildPageMetadata } from '@/lib/seo-metadata';
import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import CommunityActivityToolsComponent from '@/components/tools/CommunityActivityToolsComponent';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/classroom-scoreboard');
}

export default function ClassroomScoreboardPage() {
  const tool = getToolBySlug('classroom-scoreboard')!;

  return (
    <ToolPageLayout tool={tool}>
      <CommunityActivityToolsComponent variant="classroom-scoreboard" />
    </ToolPageLayout>
  );
}

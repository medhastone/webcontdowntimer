import { buildPageMetadata } from '@/lib/seo-metadata';
import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import EmbedTimerComponent from '@/components/tools/EmbedTimerComponent';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/embed-timer');
}

export default function EmbedTimerPage() {
  const tool = getToolBySlug('embed-timer')!;

  return (
    <ToolPageLayout tool={tool}>
      <EmbedTimerComponent />
    </ToolPageLayout>
  );
}

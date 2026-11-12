import { buildPageMetadata } from '@/lib/seo-metadata';
import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import DebateTimerComponent from '@/components/tools/DebateTimerComponent';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/debate-timer');
}

export default function DebateTimerPage() {
  const tool = getToolBySlug('debate-timer')!;

  return (
    <ToolPageLayout tool={tool}>
      <DebateTimerComponent />
    </ToolPageLayout>
  );
}

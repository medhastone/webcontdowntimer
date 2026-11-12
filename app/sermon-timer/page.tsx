import { buildPageMetadata } from '@/lib/seo-metadata';
import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import SermonTimerComponent from '@/components/tools/SermonTimerComponent';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/sermon-timer');
}

export default function SermonTimerPage() {
  const tool = getToolBySlug('sermon-timer')!;

  return (
    <ToolPageLayout tool={tool}>
      <SermonTimerComponent />
    </ToolPageLayout>
  );
}

import { buildPageMetadata } from '@/lib/seo-metadata';
import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import WebinarTimerComponent from '@/components/tools/WebinarTimerComponent';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/webinar-timer');
}

export default function WebinarTimerPage() {
  const tool = getToolBySlug('webinar-timer')!;

  return (
    <ToolPageLayout tool={tool}>
      <WebinarTimerComponent />
    </ToolPageLayout>
  );
}

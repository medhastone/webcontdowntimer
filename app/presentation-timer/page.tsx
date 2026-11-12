import { buildPageMetadata } from '@/lib/seo-metadata';
import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import PresentationTimerComponent from '@/components/tools/PresentationTimerComponent';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/presentation-timer');
}

export default function PresentationTimerPage() {
  const tool = getToolBySlug('presentation-timer')!;

  return (
    <ToolPageLayout tool={tool}>
      <PresentationTimerComponent />
    </ToolPageLayout>
  );
}

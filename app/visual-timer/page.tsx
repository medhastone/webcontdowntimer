import { buildPageMetadata } from '@/lib/seo-metadata';
import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import VisualTimerComponent from '@/components/tools/VisualTimerComponent';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/visual-timer');
}

export default function VisualTimerPage() {
  const tool = getToolBySlug('visual-timer')!;

  return (
    <ToolPageLayout tool={tool}>
      <VisualTimerComponent />
    </ToolPageLayout>
  );
}

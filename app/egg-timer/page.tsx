import { buildPageMetadata } from '@/lib/seo-metadata';
import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import CookingTimerComponent from '@/components/tools/CookingTimerComponent';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/egg-timer');
}

export default function EggTimerPage() {
  const tool = getToolBySlug('egg-timer')!;

  return (
    <ToolPageLayout tool={tool}>
      <CookingTimerComponent variant="egg" />
    </ToolPageLayout>
  );
}

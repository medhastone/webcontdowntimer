import { buildPageMetadata } from '@/lib/seo-metadata';
import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import WellnessTimerComponent from '@/components/tools/WellnessTimerComponent';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/tabata-timer');
}

export default function TabataTimerPage() {
  const tool = getToolBySlug('tabata-timer')!;

  return (
    <ToolPageLayout tool={tool}>
      <WellnessTimerComponent variant="tabata" />
    </ToolPageLayout>
  );
}

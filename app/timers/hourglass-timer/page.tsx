import { buildPageMetadata } from '@/lib/seo-metadata';
import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import HourglassTimerComponent from '@/components/tools/HourglassTimerComponent';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/timers/hourglass-timer');
}

export default function HourglassTimerSubroutePage() {
  const tool = getToolBySlug('hourglass-timer')!;

  return (
    <ToolPageLayout tool={tool}>
      <HourglassTimerComponent />
    </ToolPageLayout>
  );
}

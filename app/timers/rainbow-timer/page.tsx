import { buildPageMetadata } from '@/lib/seo-metadata';
import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import RainbowTimerComponent from '@/components/tools/RainbowTimerComponent';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/timers/rainbow-timer');
}

export default function RainbowTimerSubroutePage() {
  const tool = getToolBySlug('rainbow-timer')!;

  return (
    <ToolPageLayout tool={tool}>
      <RainbowTimerComponent />
    </ToolPageLayout>
  );
}

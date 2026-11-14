import { buildPageMetadata } from '@/lib/seo-metadata';
import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import CountdownTimerComponent from '@/components/tools/CountdownTimerComponent';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/countdown-timer');
}

export default function CountdownTimerPage() {
  const tool = getToolBySlug('countdown-timer')!;

  return (
    <ToolPageLayout tool={tool}>
      <CountdownTimerComponent initialSeconds={600} />
    </ToolPageLayout>
  );
}

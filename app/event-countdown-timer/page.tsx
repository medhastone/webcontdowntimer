import { buildPageMetadata } from '@/lib/seo-metadata';
import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import EventCountdownComponent from '@/components/tools/EventCountdownComponent';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/event-countdown-timer');
}

export default function EventCountdownPage() {
  const tool = getToolBySlug('event-countdown-timer')!;

  return (
    <ToolPageLayout tool={tool}>
      <EventCountdownComponent />
    </ToolPageLayout>
  );
}

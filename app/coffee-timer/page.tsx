import { buildPageMetadata } from '@/lib/seo-metadata';
import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import CookingTimerComponent from '@/components/tools/CookingTimerComponent';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/coffee-timer');
}

export default function CoffeeTimerPage() {
  const tool = getToolBySlug('coffee-timer')!;

  return (
    <ToolPageLayout tool={tool}>
      <CookingTimerComponent variant="coffee" />
    </ToolPageLayout>
  );
}

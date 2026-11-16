import { buildPageMetadata } from '@/lib/seo-metadata';
import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import CustomTimerPageClient from '@/components/tools/CustomTimerPageClient';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/custom-timer');
}

export default function CustomTimerPage() {
  const tool = getToolBySlug('custom-timer')!;

  return (
    <ToolPageLayout tool={tool}>
      <CustomTimerPageClient />
    </ToolPageLayout>
  );
}

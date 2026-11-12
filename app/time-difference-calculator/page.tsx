import { buildPageMetadata } from '@/lib/seo-metadata';
import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import TimeDifferenceComponent from '@/components/tools/TimeDifferenceComponent';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/time-difference-calculator');
}

export default function TimeDifferencePage() {
  const tool = getToolBySlug('time-difference-calculator')!;

  return (
    <ToolPageLayout tool={tool}>
      <TimeDifferenceComponent />
    </ToolPageLayout>
  );
}

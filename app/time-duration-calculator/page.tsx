import { buildPageMetadata } from '@/lib/seo-metadata';
import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import TimeDurationCalculatorComponent from '@/components/tools/TimeDurationCalculatorComponent';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/time-duration-calculator');
}

export default function TimeDurationCalculatorPage() {
  const tool = getToolBySlug('time-duration-calculator')!;

  return (
    <ToolPageLayout tool={tool}>
      <TimeDurationCalculatorComponent />
    </ToolPageLayout>
  );
}

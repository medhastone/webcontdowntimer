import { buildPageMetadata } from '@/lib/seo-metadata';
import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import TimeAdditionCalculatorComponent from '@/components/tools/TimeAdditionCalculatorComponent';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/time-addition-calculator');
}

export default function TimeAdditionCalculatorPage() {
  const tool = getToolBySlug('time-addition-calculator')!;

  return (
    <ToolPageLayout tool={tool}>
      <TimeAdditionCalculatorComponent />
    </ToolPageLayout>
  );
}

import { buildPageMetadata } from '@/lib/seo-metadata';
import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import TimeCardCalculatorComponent from '@/components/tools/TimeCardCalculatorComponent';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/time-card-calculator');
}

export default function TimeCardCalculatorPage() {
  const tool = getToolBySlug('time-card-calculator')!;

  return (
    <ToolPageLayout tool={tool}>
      <TimeCardCalculatorComponent />
    </ToolPageLayout>
  );
}

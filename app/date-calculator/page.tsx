import { buildPageMetadata } from '@/lib/seo-metadata';
import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import DateCalculatorComponent from '@/components/tools/DateCalculatorComponent';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/date-calculator');
}

export default function DateCalculatorPage() {
  const tool = getToolBySlug('date-calculator')!;

  return (
    <ToolPageLayout tool={tool}>
      <DateCalculatorComponent />
    </ToolPageLayout>
  );
}

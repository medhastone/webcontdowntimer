import { buildPageMetadata } from '@/lib/seo-metadata';
import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import OvertimeCalculatorComponent from '@/components/tools/OvertimeCalculatorComponent';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/overtime-calculator');
}

export default function OvertimeCalculatorPage() {
  const tool = getToolBySlug('overtime-calculator')!;

  return (
    <ToolPageLayout tool={tool}>
      <OvertimeCalculatorComponent />
    </ToolPageLayout>
  );
}

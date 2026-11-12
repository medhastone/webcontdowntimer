import { buildPageMetadata } from '@/lib/seo-metadata';
import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import SpeechTimeCalculatorComponent from '@/components/tools/SpeechTimeCalculatorComponent';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/speech-time-calculator');
}

export default function SpeechTimeCalculatorPage() {
  const tool = getToolBySlug('speech-time-calculator')!;

  return (
    <ToolPageLayout tool={tool}>
      <SpeechTimeCalculatorComponent />
    </ToolPageLayout>
  );
}

import { buildPageMetadata } from '@/lib/seo-metadata';
import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import RandomGroupGeneratorComponent from '@/components/tools/RandomGroupGeneratorComponent';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/random-group-generator');
}

export default function RandomGroupGeneratorPage() {
  const tool = getToolBySlug('random-group-generator')!;

  return (
    <ToolPageLayout tool={tool}>
      <RandomGroupGeneratorComponent />
    </ToolPageLayout>
  );
}

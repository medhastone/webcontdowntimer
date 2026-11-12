import { buildPageMetadata } from '@/lib/seo-metadata';
import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import RandomNamePickerComponent from '@/components/tools/RandomNamePickerComponent';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/random-name-picker');
}

export default function RandomNamePickerPage() {
  const tool = getToolBySlug('random-name-picker')!;

  return (
    <ToolPageLayout tool={tool}>
      <RandomNamePickerComponent />
    </ToolPageLayout>
  );
}

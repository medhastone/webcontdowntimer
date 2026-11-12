import { buildPageMetadata } from '@/lib/seo-metadata';
import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import TimeUnitConverterComponent from '@/components/tools/TimeUnitConverterComponent';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/time-converter');
}

export default function TimeConverterPage() {
  const tool = getToolBySlug('time-converter')!;

  return (
    <ToolPageLayout tool={tool}>
      <TimeUnitConverterComponent
        defaultFrom="minutes"
        defaultTo="hours"
        defaultValue={90}
        mode="general"
      />
    </ToolPageLayout>
  );
}

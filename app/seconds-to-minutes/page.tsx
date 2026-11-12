import { buildPageMetadata } from '@/lib/seo-metadata';
import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import TimeUnitConverterComponent from '@/components/tools/TimeUnitConverterComponent';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/seconds-to-minutes');
}

export default function SecondsToMinutesPage() {
  const tool = getToolBySlug('seconds-to-minutes')!;

  return (
    <ToolPageLayout tool={tool}>
      <TimeUnitConverterComponent
        defaultFrom="seconds"
        defaultTo="minutes"
        defaultValue={240}
        mode="seconds-to-minutes"
      />
    </ToolPageLayout>
  );
}

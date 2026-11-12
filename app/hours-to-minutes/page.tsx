import { buildPageMetadata } from '@/lib/seo-metadata';
import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import TimeUnitConverterComponent from '@/components/tools/TimeUnitConverterComponent';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/hours-to-minutes');
}

export default function HoursToMinutesPage() {
  const tool = getToolBySlug('hours-to-minutes')!;

  return (
    <ToolPageLayout tool={tool}>
      <TimeUnitConverterComponent
        defaultFrom="hours"
        defaultTo="minutes"
        defaultValue={8.5}
        mode="hours-to-minutes"
      />
    </ToolPageLayout>
  );
}

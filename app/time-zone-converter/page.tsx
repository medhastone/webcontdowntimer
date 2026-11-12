import { buildPageMetadata } from '@/lib/seo-metadata';
import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import TimeZoneConverterComponent from '@/components/tools/TimeZoneConverterComponent';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/time-zone-converter');
}

export default function TimeZoneConverterPage() {
  const tool = getToolBySlug('time-zone-converter')!;

  return (
    <ToolPageLayout tool={tool}>
      <TimeZoneConverterComponent />
    </ToolPageLayout>
  );
}

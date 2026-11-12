import { buildPageMetadata } from '@/lib/seo-metadata';
import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import UnixTimestampComponent from '@/components/tools/UnixTimestampComponent';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/unix-timestamp-converter');
}

export default function UnixTimestampPage() {
  const tool = getToolBySlug('unix-timestamp-converter')!;

  return (
    <ToolPageLayout tool={tool}>
      <UnixTimestampComponent />
    </ToolPageLayout>
  );
}

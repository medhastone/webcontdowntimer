import { buildPageMetadata } from '@/lib/seo-metadata';
import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import WhatTimeWillItBeComponent from '@/components/tools/WhatTimeWillItBeComponent';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/what-time-will-it-be');
}

export default function WhatTimeWillItBePage() {
  const tool = getToolBySlug('what-time-will-it-be')!;

  return (
    <ToolPageLayout tool={tool}>
      <WhatTimeWillItBeComponent />
    </ToolPageLayout>
  );
}

import { Suspense } from 'react';
import { buildPageMetadata } from '@/lib/seo-metadata';
import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import VisualTimerComponent from '@/components/tools/VisualTimerComponent';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/visual-timer');
}

export default function VisualTimerPage() {
  const tool = getToolBySlug('visual-timer')!;

  return (
    <ToolPageLayout tool={tool}>
      <Suspense
        fallback={
          <div className="w-full rounded-2xl border border-[#E4E1D9] dark:border-[#2A342D] bg-white dark:bg-[#181F1B] p-8 text-center text-sm opacity-70">
            Loading Visual Timer...
          </div>
        }
      >
        <VisualTimerComponent />
      </Suspense>
    </ToolPageLayout>
  );
}

import { buildPageMetadata } from '@/lib/seo-metadata';
import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import ToastmastersTimerComponent from '@/components/tools/ToastmastersTimerComponent';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/toastmasters-timer');
}

export default function ToastmastersTimerPage() {
  const tool = getToolBySlug('toastmasters-timer')!;

  return (
    <ToolPageLayout tool={tool}>
      <ToastmastersTimerComponent />
    </ToolPageLayout>
  );
}

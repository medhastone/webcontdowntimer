import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import EmbedTimerComponent from '@/components/tools/EmbedTimerComponent';

export const metadata: Metadata = {
  title: 'Embeddable Timer Widget Generator – Notion, LMS & Website Iframe | WebCountDownTimer',
  description:
    'Generate clean, sandboxed HTML iframe countdown, visual timer, and stopwatch widgets for Notion pages, Google Sites, Canvas LMS, and event websites.',
};

export default function EmbedTimerPage() {
  const tool = getToolBySlug('embed-timer')!;

  return (
    <ToolPageLayout tool={tool}>
      <EmbedTimerComponent />
    </ToolPageLayout>
  );
}

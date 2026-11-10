import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import WebinarTimerComponent from '@/components/tools/WebinarTimerComponent';

export const metadata: Metadata = {
  title: 'Webinar Timer – Virtual Event Agenda & Live Q&A Clock | WebCountDownTimer',
  description:
    'Keep your webinars and online presentations strictly on schedule. Multi-segment transitions between keynote, panel discussion, and live Q&A.',
};

export default function WebinarTimerPage() {
  const tool = getToolBySlug('webinar-timer')!;

  return (
    <ToolPageLayout tool={tool}>
      <WebinarTimerComponent />
    </ToolPageLayout>
  );
}

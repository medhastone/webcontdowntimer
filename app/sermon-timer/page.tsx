import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import SermonTimerComponent from '@/components/tools/SermonTimerComponent';

export const metadata: Metadata = {
  title: 'Sermon Timer – Discreet Pulpit & Sanctuary Display | WebCountDownTimer',
  description:
    'Calm, distraction-free pulpit timer designed for pastors and church services. Features soft amber wrap-up cues, silent mode, and low-contrast blackout theme.',
};

export default function SermonTimerPage() {
  const tool = getToolBySlug('sermon-timer')!;

  return (
    <ToolPageLayout tool={tool}>
      <SermonTimerComponent />
    </ToolPageLayout>
  );
}

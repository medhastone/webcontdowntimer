import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import StudyBreakTimerComponent from '@/components/tools/StudyBreakTimerComponent';

export const metadata: Metadata = {
  title: 'Break Timer – Desk Stretch, Hydration & Rest Reminder | WebCountDownTimer',
  description:
    'Time workplace micro-breaks, lunch hours, and afternoon recharge intervals with automatic return-to-work chimes.',
};

export default function BreakTimerPage() {
  const tool = getToolBySlug('break-timer')!;

  return (
    <ToolPageLayout tool={tool}>
      <StudyBreakTimerComponent variant="break" />
    </ToolPageLayout>
  );
}

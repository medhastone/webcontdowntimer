import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import StudyBreakTimerComponent from '@/components/tools/StudyBreakTimerComponent';

export const metadata: Metadata = {
  title: 'Study Timer – Deep Academic Focus & Revision Cycles | WebCountDownTimer',
  description:
    'Distraction-free academic study timer with customizable 50/10, 25/5, and 90-minute exam prep blocks, automatic break transitions, and session counters.',
};

export default function StudyTimerPage() {
  const tool = getToolBySlug('study-timer')!;

  return (
    <ToolPageLayout tool={tool}>
      <StudyBreakTimerComponent variant="study" />
    </ToolPageLayout>
  );
}

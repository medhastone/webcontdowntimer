import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import StudyBreakTimerComponent from '@/components/tools/StudyBreakTimerComponent';

export const metadata: Metadata = {
  title: 'Reading Timer – Sustained Silent Reading & Note Intervals | WebCountDownTimer',
  description:
    'Track daily reading sprints, classroom sustained silent reading (SSR), and literature review blocks with gentle reflection breaks.',
};

export default function ReadingTimerPage() {
  const tool = getToolBySlug('reading-timer')!;

  return (
    <ToolPageLayout tool={tool}>
      <StudyBreakTimerComponent variant="reading" />
    </ToolPageLayout>
  );
}

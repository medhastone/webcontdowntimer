import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import PomodoroTimerComponent from '@/components/tools/PomodoroTimerComponent';

export const metadata: Metadata = {
  title: 'Pomodoro Timer – Focus Sprint & Productivity Tracker | WebCountDownTimer',
  description:
    'Boost focus and eliminate burnout with the classic Pomodoro Technique. 25-minute work intervals, 5-minute short breaks, task labelling, and streak tracking.',
};

export default function PomodoroTimerPage() {
  const tool = getToolBySlug('pomodoro-timer')!;

  return (
    <ToolPageLayout tool={tool}>
      <PomodoroTimerComponent />
    </ToolPageLayout>
  );
}

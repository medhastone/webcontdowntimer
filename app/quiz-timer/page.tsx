import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import CommunityActivityToolsComponent from '@/components/tools/CommunityActivityToolsComponent';

export const metadata: Metadata = {
  title: 'Quiz Timer – Per-Question Trivia & Classroom Game Show Clock | WebCountDownTimer',
  description:
    'Fast-reset per-question countdown timer for classroom trivia, pub quizzes, and academic bowls with 15s, 30s, 45s, and 60s presets and question counter.',
};

export default function QuizTimerPage() {
  const tool = getToolBySlug('quiz-timer')!;

  return (
    <ToolPageLayout tool={tool}>
      <CommunityActivityToolsComponent variant="quiz-timer" />
    </ToolPageLayout>
  );
}

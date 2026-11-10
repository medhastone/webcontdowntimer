import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import CommunityActivityToolsComponent from '@/components/tools/CommunityActivityToolsComponent';

export const metadata: Metadata = {
  title: 'Classroom Scoreboard – Live Multi-Team Point Tracker | WebCountDownTimer',
  description:
    'Interactive classroom and event scoreboard. Add custom teams, award +1, +5, +10, or -1 points with audio feedback, and display on projectors.',
};

export default function ClassroomScoreboardPage() {
  const tool = getToolBySlug('classroom-scoreboard')!;

  return (
    <ToolPageLayout tool={tool}>
      <CommunityActivityToolsComponent variant="classroom-scoreboard" />
    </ToolPageLayout>
  );
}

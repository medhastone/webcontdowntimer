import { buildPageMetadata } from '@/lib/seo-metadata';
import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import CommunityActivityToolsComponent from '@/components/tools/CommunityActivityToolsComponent';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/quiz-timer');
}

export default function QuizTimerPage() {
  const tool = getToolBySlug('quiz-timer')!;

  return (
    <ToolPageLayout tool={tool}>
      <CommunityActivityToolsComponent variant="quiz-timer" />
    </ToolPageLayout>
  );
}

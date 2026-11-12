import { buildPageMetadata } from '@/lib/seo-metadata';
import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import StudyBreakTimerComponent from '@/components/tools/StudyBreakTimerComponent';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/reading-timer');
}

export default function ReadingTimerPage() {
  const tool = getToolBySlug('reading-timer')!;

  return (
    <ToolPageLayout tool={tool}>
      <StudyBreakTimerComponent variant="reading" />
    </ToolPageLayout>
  );
}

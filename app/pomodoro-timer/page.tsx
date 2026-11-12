import { buildPageMetadata } from '@/lib/seo-metadata';
import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import PomodoroTimerComponent from '@/components/tools/PomodoroTimerComponent';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/pomodoro-timer');
}

export default function PomodoroTimerPage() {
  const tool = getToolBySlug('pomodoro-timer')!;

  return (
    <ToolPageLayout tool={tool}>
      <PomodoroTimerComponent />
    </ToolPageLayout>
  );
}

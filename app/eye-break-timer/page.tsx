import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import StudyBreakTimerComponent from '@/components/tools/StudyBreakTimerComponent';

export const metadata: Metadata = {
  title: '20-20-20 Eye Break Timer – Digital Eye Strain Relief | WebCountDownTimer',
  description:
    'Automated 20-20-20 rule timer for computer users: every 20 minutes of screen work, look 20 feet away for 20 seconds to relax ocular focus.',
};

export default function EyeBreakTimerPage() {
  const tool = getToolBySlug('eye-break-timer')!;

  return (
    <ToolPageLayout tool={tool}>
      <StudyBreakTimerComponent variant="eye-break" />
    </ToolPageLayout>
  );
}

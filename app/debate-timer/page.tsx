import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import DebateTimerComponent from '@/components/tools/DebateTimerComponent';

export const metadata: Metadata = {
  title: 'Debate Timer – Parliamentary, Oxford & Lincoln-Douglas Bells | WebCountDownTimer',
  description:
    'Debate adjudication timer with protected first and last minute, Points of Information (POI) bells, and constructive/rebuttal speech tracking.',
};

export default function DebateTimerPage() {
  const tool = getToolBySlug('debate-timer')!;

  return (
    <ToolPageLayout tool={tool}>
      <DebateTimerComponent />
    </ToolPageLayout>
  );
}

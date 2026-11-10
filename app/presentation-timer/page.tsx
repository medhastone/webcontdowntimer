import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import PresentationTimerComponent from '@/components/tools/PresentationTimerComponent';

export const metadata: Metadata = {
  title: 'Presentation Timer – Slide Deck & Pitch Pacing | WebCountDownTimer',
  description:
    'Structure your pitch deck or presentation into timed sections. Track time remaining in your current slide segment and overall presentation schedule.',
};

export default function PresentationTimerPage() {
  const tool = getToolBySlug('presentation-timer')!;

  return (
    <ToolPageLayout tool={tool}>
      <PresentationTimerComponent />
    </ToolPageLayout>
  );
}

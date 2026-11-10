import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import VisualTimerComponent from '@/components/tools/VisualTimerComponent';

export const metadata: Metadata = {
  title: 'Visual Timer – Circular, Hourglass, Traffic Light & Rainbow Countdown | WebCountDownTimer',
  description:
    'Interactive online visual timer with 6 visual representations: Circular Ring, Linear Bar, Hourglass, Traffic Light, Rainbow Arc, and Sand Dune. Ideal for classrooms, kids, ADHD focus, and events.',
};

export default function VisualTimerPage() {
  const tool = getToolBySlug('visual-timer')!;

  return (
    <ToolPageLayout tool={tool}>
      <VisualTimerComponent />
    </ToolPageLayout>
  );
}

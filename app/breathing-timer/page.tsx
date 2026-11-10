import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import WellnessTimerComponent from '@/components/tools/WellnessTimerComponent';

export const metadata: Metadata = {
  title: 'Breathing Timer – 4-4-4-4 Box Breathing & 4-7-8 Calm Pacer | WebCountDownTimer',
  description:
    'Interactive visual breathing pacer with expanding/contracting animation for 4-4-4-4 Box Breathing, 4-7-8 Relaxation, and 5-5 Coherent Breath.',
};

export default function BreathingTimerPage() {
  const tool = getToolBySlug('breathing-timer')!;

  return (
    <ToolPageLayout tool={tool}>
      <WellnessTimerComponent variant="breathing" />
    </ToolPageLayout>
  );
}

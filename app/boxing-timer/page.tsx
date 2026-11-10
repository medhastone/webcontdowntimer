import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import WellnessTimerComponent from '@/components/tools/WellnessTimerComponent';

export const metadata: Metadata = {
  title: 'Boxing Round Timer – 3-Minute Sparring, MMA & Heavy Bag Clock | WebCountDownTimer',
  description:
    'Online boxing and martial arts round timer with 3-minute championship rounds, 2-minute amateur rounds, 5-minute MMA rounds, and audible corner bells.',
};

export default function BoxingTimerPage() {
  const tool = getToolBySlug('boxing-timer')!;

  return (
    <ToolPageLayout tool={tool}>
      <WellnessTimerComponent variant="boxing" />
    </ToolPageLayout>
  );
}

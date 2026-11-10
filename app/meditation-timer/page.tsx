import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import WellnessTimerComponent from '@/components/tools/WellnessTimerComponent';

export const metadata: Metadata = {
  title: 'Meditation Timer – Mindful Bell & Calm Contemplation Clock | WebCountDownTimer',
  description:
    'Peaceful online meditation timer with 5, 10, 20, and 45-minute mindfulness presets and a gentle acoustic singing bowl completion chime.',
};

export default function MeditationTimerPage() {
  const tool = getToolBySlug('meditation-timer')!;

  return (
    <ToolPageLayout tool={tool}>
      <WellnessTimerComponent variant="meditation" />
    </ToolPageLayout>
  );
}

import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import WellnessTimerComponent from '@/components/tools/WellnessTimerComponent';

export const metadata: Metadata = {
  title: 'Tabata Timer – 20s Work / 10s Rest High-Intensity Interval Clock | WebCountDownTimer',
  description:
    'Free online Tabata workout timer. Pre-configured for 8 rounds of 20-second maximum sprints and 10-second recovery rests with audio phase transitions.',
};

export default function TabataTimerPage() {
  const tool = getToolBySlug('tabata-timer')!;

  return (
    <ToolPageLayout tool={tool}>
      <WellnessTimerComponent variant="tabata" />
    </ToolPageLayout>
  );
}

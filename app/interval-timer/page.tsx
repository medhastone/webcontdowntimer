import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import IntervalTimerComponent from '@/components/tools/IntervalTimerComponent';

export const metadata: Metadata = {
  title: 'Interval Timer – HIIT, Tabata & Circuit Training Clock | WebCountDownTimer',
  description:
    'Customizable workout timer with acoustic 3-2-1 countdowns, work and rest intervals, sets counter, and classic Tabata presets.',
};

export default function IntervalTimerPage() {
  const tool = getToolBySlug('interval-timer')!;

  return (
    <ToolPageLayout tool={tool}>
      <IntervalTimerComponent />
    </ToolPageLayout>
  );
}

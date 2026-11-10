import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import SandTimerComponent from '@/components/tools/SandTimerComponent';

export const metadata: Metadata = {
  title: 'Free Online Sand Timer – Realistic Digital Hourglass & Sand Countdown | WebCountDownTimer',
  description:
    'Use this free online sand timer with a realistic falling sand hourglass animation, 1, 3, 5, 10, and 15-minute presets, custom duration, adjustable speed, and reduced motion.',
  alternates: {
    canonical: 'https://WebCountDownTimer.com/timers/sand-timer',
  },
};

export default function SandTimerPage() {
  const tool = getToolBySlug('sand-timer')!;

  return (
    <ToolPageLayout tool={tool}>
      <SandTimerComponent />
    </ToolPageLayout>
  );
}

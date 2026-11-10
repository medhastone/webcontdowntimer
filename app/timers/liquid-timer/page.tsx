import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import LiquidTimerComponent from '@/components/tools/LiquidTimerComponent';

export const metadata: Metadata = {
  title: 'Free Online Liquid Timer – Realistic Liquid Countdown & Visual Timer | WebCountDownTimer',
  description:
    'A smooth liquid countdown to help you stay focused and on track. Features a realistic draining liquid glass animation, rising bubbles, 6 color themes, custom duration, and fullscreen mode.',
  alternates: {
    canonical: 'https://WebCountDownTimer.com/timers/liquid-timer',
  },
};

export default function TimersLiquidTimerPage() {
  const tool = getToolBySlug('liquid-timer')!;

  return (
    <ToolPageLayout tool={tool}>
      <LiquidTimerComponent />
    </ToolPageLayout>
  );
}

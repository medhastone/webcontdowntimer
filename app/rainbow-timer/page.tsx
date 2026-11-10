import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import RainbowTimerComponent from '@/components/tools/RainbowTimerComponent';

export const metadata: Metadata = {
  title: 'Free Online Rainbow Timer – Colorful Visual Countdown Timer | WebCountDownTimer',
  description:
    'A colorful countdown timer to make time visible and fun. Features a smooth multicolor rainbow arc, 4 rainbow styles, 6 color themes, custom duration, fullscreen mode, and reduced-motion accessibility.',
  alternates: {
    canonical: 'https://WebCountDownTimer.com/timers/rainbow-timer',
  },
};

export default function RainbowTimerPage() {
  const tool = getToolBySlug('rainbow-timer')!;

  return (
    <ToolPageLayout tool={tool}>
      <RainbowTimerComponent />
    </ToolPageLayout>
  );
}

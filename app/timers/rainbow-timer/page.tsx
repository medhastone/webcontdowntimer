import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import RainbowTimerComponent from '@/components/tools/RainbowTimerComponent';

export const metadata: Metadata = {
  title: 'Free Online Rainbow Timer – Colorful Visual Countdown Timer | WebCountDownTimer',
  description:
    'A colorful countdown timer to make time visible and fun. Features a smooth multicolor rainbow arc, 4 rainbow styles, 6 color themes, custom duration, fullscreen mode, and reduced-motion accessibility.',
  keywords: [
    'rainbow timer',
    'colorful visual timer',
    'rainbow countdown timer',
    'free online rainbow timer',
    'rainbow visual timer for kids',
    'classroom rainbow timer',
  ],
  alternates: {
    canonical: 'https://WebCountDownTimer.com/timers/rainbow-timer',
  },
  openGraph: {
    title: 'Free Online Rainbow Timer – Colorful Visual Countdown Timer',
    description:
      'A colorful countdown timer to make time visible and fun. Choose from 4 rainbow styles and 6 color themes.',
    url: 'https://WebCountDownTimer.com/timers/rainbow-timer',
    siteName: 'WebCountDownTimer',
    type: 'website',
  },
};

export default function RainbowTimerSubroutePage() {
  const tool = getToolBySlug('rainbow-timer')!;

  return (
    <ToolPageLayout tool={tool}>
      <RainbowTimerComponent />
    </ToolPageLayout>
  );
}

import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import HourglassTimerComponent from '@/components/tools/HourglassTimerComponent';

export const metadata: Metadata = {
  title: 'Free Online Hourglass Timer – Digital Hourglass Countdown | WebCountDownTimer',
  description:
    'A classic hourglass countdown with realistic sand animation, wooden frame, interactive flip-to-restart action, 1–15 minute presets, custom duration, and fullscreen mode.',
  keywords: [
    'hourglass timer',
    'online hourglass',
    'digital hourglass countdown',
    'free online hourglass timer',
    'sand clock online',
    'flip hourglass timer',
  ],
  alternates: {
    canonical: 'https://WebCountDownTimer.com/timers/hourglass-timer',
  },
  openGraph: {
    title: 'Free Online Hourglass Timer – Digital Hourglass Countdown',
    description:
      'A classic hourglass countdown with realistic sand animation, interactive Flip button, and multiple preset times.',
    url: 'https://WebCountDownTimer.com/timers/hourglass-timer',
    siteName: 'WebCountDownTimer',
    type: 'website',
  },
};

export default function HourglassTimerSubroutePage() {
  const tool = getToolBySlug('hourglass-timer')!;

  return (
    <ToolPageLayout tool={tool}>
      <HourglassTimerComponent />
    </ToolPageLayout>
  );
}

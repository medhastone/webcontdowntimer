import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import CountdownTimerComponent from '@/components/tools/CountdownTimerComponent';

export const metadata: Metadata = {
  title: 'Countdown Timer – Online Digital Alarm & Interval Loop | WebCountDownTimer',
  description:
    'Free online countdown clock. Set hours, minutes, and seconds with quick presets, audible acoustic alarm, auto-repeat loop, and distraction-free fullscreen.',
};

export default function CountdownTimerPage() {
  const tool = getToolBySlug('countdown-timer')!;

  return (
    <ToolPageLayout tool={tool}>
      <CountdownTimerComponent />
    </ToolPageLayout>
  );
}

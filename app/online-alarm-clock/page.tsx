import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import AlarmClockComponent from '@/components/tools/AlarmClockComponent';

export const metadata: Metadata = {
  title: 'Online Alarm Clock – Reliable Wake-Up & Custom Snooze | WebCountDownTimer',
  description:
    'Free online alarm clock with loud acoustic chimes, configurable snooze duration (5, 10, 15 mins), and live local time display. Simple, clean, and reliable.',
};

export default function OnlineAlarmClockPage() {
  const tool = getToolBySlug('online-alarm-clock')!;

  return (
    <ToolPageLayout tool={tool}>
      <AlarmClockComponent />
    </ToolPageLayout>
  );
}

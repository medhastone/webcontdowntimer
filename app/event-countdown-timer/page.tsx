import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import EventCountdownComponent from '@/components/tools/EventCountdownComponent';

export const metadata: Metadata = {
  title: 'Event Countdown Timer – Launch Date & Livestream Clock | WebCountDownTimer',
  description:
    'Count down to any target date and time across time zones. Accurate days, hours, minutes, and seconds countdown with shareable link and celebration confetti.',
};

export default function EventCountdownPage() {
  const tool = getToolBySlug('event-countdown-timer')!;

  return (
    <ToolPageLayout tool={tool}>
      <EventCountdownComponent />
    </ToolPageLayout>
  );
}

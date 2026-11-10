import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import SpeakerTimerComponent from '@/components/tools/SpeakerTimerComponent';

export const metadata: Metadata = {
  title: 'Speaker Timer – Podium & Confidence Monitor Clock | WebCountDownTimer',
  description:
    'Free high-contrast speaker timer designed for conference keynotes, seminars, and TED-style talks. Features automatic overtime countup and screen wake lock.',
};

export default function SpeakerTimerPage() {
  const tool = getToolBySlug('speaker-timer')!;

  return (
    <ToolPageLayout tool={tool}>
      <SpeakerTimerComponent initialSeconds={900} />
    </ToolPageLayout>
  );
}

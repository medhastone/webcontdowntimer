import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import ToastmastersTimerComponent from '@/components/tools/ToastmastersTimerComponent';

export const metadata: Metadata = {
  title: 'Toastmasters Timer – Green, Amber & Red Signaling Rules | WebCountDownTimer',
  description:
    'Official Toastmasters International speech timer with Green, Amber, and Red signaling cards, 30-second grace window, and contest disqualification tracking.',
};

export default function ToastmastersTimerPage() {
  const tool = getToolBySlug('toastmasters-timer')!;

  return (
    <ToolPageLayout tool={tool}>
      <ToastmastersTimerComponent />
    </ToolPageLayout>
  );
}

import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import CookingTimerComponent from '@/components/tools/CookingTimerComponent';

export const metadata: Metadata = {
  title: 'Egg Timer – Soft, Jammy, Medium & Hard Boiled Countdown | WebCountDownTimer',
  description:
    'Precision boiled egg timer with one-tap presets for soft runny (4:30), jammy ramen (6:30), medium firm (8:00), and classic hard-boiled (10:30) eggs.',
};

export default function EggTimerPage() {
  const tool = getToolBySlug('egg-timer')!;

  return (
    <ToolPageLayout tool={tool}>
      <CookingTimerComponent variant="egg" />
    </ToolPageLayout>
  );
}

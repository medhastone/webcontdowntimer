import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import CookingTimerComponent from '@/components/tools/CookingTimerComponent';

export const metadata: Metadata = {
  title: 'Coffee Brew Timer – Pour-Over Bloom, French Press & AeroPress | WebCountDownTimer',
  description:
    'Specialty coffee extraction timer with presets for 45-second Pour-Over Bloom, V60 total drawdown, French Press 4-minute steep, and AeroPress.',
};

export default function CoffeeTimerPage() {
  const tool = getToolBySlug('coffee-timer')!;

  return (
    <ToolPageLayout tool={tool}>
      <CookingTimerComponent variant="coffee" />
    </ToolPageLayout>
  );
}

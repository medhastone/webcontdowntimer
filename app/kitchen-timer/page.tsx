import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import CookingTimerComponent from '@/components/tools/CookingTimerComponent';

export const metadata: Metadata = {
  title: 'Kitchen Timer – Multi-Burner & Oven Cooking Countdowns | WebCountDownTimer',
  description:
    'Run multiple named kitchen timers simultaneously for oven roasting, simmering sauces, pasta, and baking with audible kitchen chimes.',
};

export default function KitchenTimerPage() {
  const tool = getToolBySlug('kitchen-timer')!;

  return (
    <ToolPageLayout tool={tool}>
      <CookingTimerComponent variant="kitchen" />
    </ToolPageLayout>
  );
}

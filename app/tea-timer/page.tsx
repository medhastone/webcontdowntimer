import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import CookingTimerComponent from '@/components/tools/CookingTimerComponent';

export const metadata: Metadata = {
  title: 'Tea Steep Timer – Green, White, Oolong, Black & Herbal Tea | WebCountDownTimer',
  description:
    'Steep green, white, oolong, black, and herbal tisane teas for the exact optimal duration and water temperature without bitterness.',
};

export default function TeaTimerPage() {
  const tool = getToolBySlug('tea-timer')!;

  return (
    <ToolPageLayout tool={tool}>
      <CookingTimerComponent variant="tea" />
    </ToolPageLayout>
  );
}

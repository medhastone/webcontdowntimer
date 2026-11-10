import { Metadata } from 'next';
import { TOOLS_REGISTRY } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import CandleTimerComponent from '@/components/tools/CandleTimerComponent';

const tool = TOOLS_REGISTRY.find((t) => t.slug === 'candle-timer');

export const metadata: Metadata = {
  title: 'Free Online Candle Timer | Visual Candle Countdown Timer',
  description:
    tool?.description ||
    'A peaceful and visual candle countdown timer to help you focus, relax and stay on track. Ideal for reading, journaling, meditation, and evening routines.',
  keywords: tool?.keywords,
  alternates: {
    canonical: '/timers/candle-timer',
  },
  openGraph: {
    title: 'Free Online Candle Timer | WebCountDownTimer',
    description:
      tool?.description ||
      'A peaceful and visual candle countdown timer to help you focus, relax and stay on track.',
    type: 'website',
  },
};

export default function CandleTimerPage() {
  if (!tool) return null;

  return (
    <ToolPageLayout tool={tool}>
      <CandleTimerComponent />
    </ToolPageLayout>
  );
}

import { buildPageMetadata } from '@/lib/seo-metadata';
import { Metadata } from 'next';
import { TOOLS_REGISTRY } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import CandleTimerComponent from '@/components/tools/CandleTimerComponent';

const tool = TOOLS_REGISTRY.find((t) => t.slug === 'candle-timer');

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/timers/candle-timer');
}

export default function TimersCandleTimerPage() {
  if (!tool) return null;

  return (
    <ToolPageLayout tool={tool}>
      <CandleTimerComponent />
    </ToolPageLayout>
  );
}

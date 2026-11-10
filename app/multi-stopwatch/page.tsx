import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import MultiStopwatchComponent from '@/components/tools/MultiStopwatchComponent';

export const metadata: Metadata = {
  title: 'Multi-Stopwatch – Track Multiple Runners, Teams & Relay Splits | WebCountDownTimer',
  description:
    'Run multiple independent stopwatches simultaneously. Includes Start/Stop/Reset All batch actions, Relay Handoff mode, lap splits, and CSV export.',
};

export default function MultiStopwatchPage() {
  const tool = getToolBySlug('multi-stopwatch')!;

  return (
    <ToolPageLayout tool={tool}>
      <MultiStopwatchComponent />
    </ToolPageLayout>
  );
}

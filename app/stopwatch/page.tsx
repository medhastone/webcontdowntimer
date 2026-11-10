import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import StopwatchComponent from '@/components/tools/StopwatchComponent';

export const metadata: Metadata = {
  title: 'Online Stopwatch – Millisecond Precision with Lap Times | WebCountDownTimer',
  description:
    'High-resolution online stopwatch with split time recording, fastest/slowest lap detection, clipboard export, and CSV download. Free and accurate.',
};

export default function StopwatchPage() {
  const tool = getToolBySlug('stopwatch')!;

  return (
    <ToolPageLayout tool={tool}>
      <StopwatchComponent />
    </ToolPageLayout>
  );
}

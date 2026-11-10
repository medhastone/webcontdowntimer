import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import TimeDurationCalculatorComponent from '@/components/tools/TimeDurationCalculatorComponent';

export const metadata: Metadata = {
  title: 'Time Duration Calculator – Hours, Minutes, Seconds & Decimal Hours | WebCountDownTimer',
  description:
    'Calculate exact elapsed time between start and end times or calendar dates. Automatically handles overnight cross-midnight shifts and outputs decimal hours.',
};

export default function TimeDurationCalculatorPage() {
  const tool = getToolBySlug('time-duration-calculator')!;

  return (
    <ToolPageLayout tool={tool}>
      <TimeDurationCalculatorComponent />
    </ToolPageLayout>
  );
}

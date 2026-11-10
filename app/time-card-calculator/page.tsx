import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import TimeCardCalculatorComponent from '@/components/tools/TimeCardCalculatorComponent';

export const metadata: Metadata = {
  title: 'Time Card Calculator – Weekly Work Hours & Break Deduction Log | WebCountDownTimer',
  description:
    'Free weekly work hours and time card calculator. Enter daily clock-in, clock-out, and unpaid break minutes to calculate daily and weekly net hours, decimal hours, and CSV export.',
};

export default function TimeCardCalculatorPage() {
  const tool = getToolBySlug('time-card-calculator')!;

  return (
    <ToolPageLayout tool={tool}>
      <TimeCardCalculatorComponent />
    </ToolPageLayout>
  );
}

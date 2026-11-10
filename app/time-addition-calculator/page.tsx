import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import TimeAdditionCalculatorComponent from '@/components/tools/TimeAdditionCalculatorComponent';

export const metadata: Metadata = {
  title: 'Time Addition & Subtraction Calculator – Add Hours, Minutes & Seconds | WebCountDownTimer',
  description:
    'Add and subtract multiple time blocks in hours, minutes, and seconds. Outputs running total, total minutes, total seconds, and payroll decimal hours.',
};

export default function TimeAdditionCalculatorPage() {
  const tool = getToolBySlug('time-addition-calculator')!;

  return (
    <ToolPageLayout tool={tool}>
      <TimeAdditionCalculatorComponent />
    </ToolPageLayout>
  );
}

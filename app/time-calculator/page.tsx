import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import TimeAdditionCalculatorComponent from '@/components/tools/TimeAdditionCalculatorComponent';

export const metadata: Metadata = {
  title: 'Time Calculator – Add & Subtract Hours, Minutes & Seconds | WebCountDownTimer',
  description:
    'Free online Time Calculator to add or subtract hours, minutes, and seconds. Ideal for timesheets, payroll decimal hours, project logs, and everyday time math.',
  alternates: {
    canonical: '/time-calculator',
  },
};

export default function TimeCalculatorPage() {
  const tool = getToolBySlug('time-calculator')!;

  return (
    <ToolPageLayout tool={tool}>
      <TimeAdditionCalculatorComponent />
    </ToolPageLayout>
  );
}

import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import OvertimeCalculatorComponent from '@/components/tools/OvertimeCalculatorComponent';

export const metadata: Metadata = {
  title: 'Overtime Calculator – Regular vs Overtime Hours & Pay Estimator | WebCountDownTimer',
  description:
    'Calculate regular hours, overtime hours, and estimated gross earnings using configurable weekly thresholds and 1.5x, 2.0x, or custom overtime multipliers.',
};

export default function OvertimeCalculatorPage() {
  const tool = getToolBySlug('overtime-calculator')!;

  return (
    <ToolPageLayout tool={tool}>
      <OvertimeCalculatorComponent />
    </ToolPageLayout>
  );
}

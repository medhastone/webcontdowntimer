import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import DateCalculatorComponent from '@/components/tools/DateCalculatorComponent';

export const metadata: Metadata = {
  title: 'Date Calculator – Days Between Dates & Business Weekdays | WebCountDownTimer',
  description:
    'Calculate exact calendar days, weeks, months, and working weekdays between any two dates with our free online Date Calculator.',
  alternates: {
    canonical: '/date-calculator',
  },
};

export default function DateCalculatorPage() {
  const tool = getToolBySlug('date-calculator')!;

  return (
    <ToolPageLayout tool={tool}>
      <DateCalculatorComponent />
    </ToolPageLayout>
  );
}

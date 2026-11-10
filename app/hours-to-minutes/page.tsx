import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import TimeUnitConverterComponent from '@/components/tools/TimeUnitConverterComponent';

export const metadata: Metadata = {
  title: 'Hours to Minutes Converter – Convert Hours & Decimal Hours to Mins | WebCountDownTimer',
  description:
    'Convert hours and decimal hours into total minutes and seconds. Multiply hours by 60 accurately for timesheets, payroll, and scheduling.',
  alternates: {
    canonical: '/hours-to-minutes',
  },
};

export default function HoursToMinutesPage() {
  const tool = getToolBySlug('hours-to-minutes')!;

  return (
    <ToolPageLayout tool={tool}>
      <TimeUnitConverterComponent
        defaultFrom="hours"
        defaultTo="minutes"
        defaultValue={8.5}
        mode="hours-to-minutes"
      />
    </ToolPageLayout>
  );
}

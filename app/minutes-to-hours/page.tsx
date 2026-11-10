import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import TimeUnitConverterComponent from '@/components/tools/TimeUnitConverterComponent';

export const metadata: Metadata = {
  title: 'Minutes to Hours Converter – Convert Mins to Hours & Decimal Hours | WebCountDownTimer',
  description:
    'Convert minutes to hours and minutes (HH:MM) or decimal hours instantly. Includes common conversion examples like 90, 120, 150, and 510 minutes to hours.',
  alternates: {
    canonical: '/minutes-to-hours',
  },
};

export default function MinutesToHoursPage() {
  const tool = getToolBySlug('minutes-to-hours')!;

  return (
    <ToolPageLayout tool={tool}>
      <TimeUnitConverterComponent
        defaultFrom="minutes"
        defaultTo="hours"
        defaultValue={90}
        mode="minutes-to-hours"
      />
    </ToolPageLayout>
  );
}

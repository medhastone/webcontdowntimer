import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import TimeUnitConverterComponent from '@/components/tools/TimeUnitConverterComponent';

export const metadata: Metadata = {
  title: 'Time Converter – Convert Seconds, Minutes, Hours, Days & Weeks | WebCountDownTimer',
  description:
    'Convert time units instantly between seconds, minutes, hours, decimal hours, days, and weeks with our free online Time Converter.',
  alternates: {
    canonical: '/time-converter',
  },
};

export default function TimeConverterPage() {
  const tool = getToolBySlug('time-converter')!;

  return (
    <ToolPageLayout tool={tool}>
      <TimeUnitConverterComponent
        defaultFrom="minutes"
        defaultTo="hours"
        defaultValue={90}
        mode="general"
      />
    </ToolPageLayout>
  );
}

import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import TimeUnitConverterComponent from '@/components/tools/TimeUnitConverterComponent';

export const metadata: Metadata = {
  title: 'Seconds to Minutes Converter – Convert Sec to Min Instantly | WebCountDownTimer',
  description:
    'Convert seconds into minutes and remaining seconds or decimal minutes. Free online Seconds to Minutes Converter for sports, cooking, study, and lab timing.',
  alternates: {
    canonical: '/seconds-to-minutes',
  },
};

export default function SecondsToMinutesPage() {
  const tool = getToolBySlug('seconds-to-minutes')!;

  return (
    <ToolPageLayout tool={tool}>
      <TimeUnitConverterComponent
        defaultFrom="seconds"
        defaultTo="minutes"
        defaultValue={240}
        mode="seconds-to-minutes"
      />
    </ToolPageLayout>
  );
}

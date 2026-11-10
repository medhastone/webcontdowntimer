import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import TimeDifferenceComponent from '@/components/tools/TimeDifferenceComponent';

export const metadata: Metadata = {
  title: 'Time Difference Calculator – Hours Between Two Cities | WebCountDownTimer',
  description:
    'Calculate the exact time difference in hours and minutes between two cities or time zones. Includes business hour overlap and DST clock change analysis.',
};

export default function TimeDifferencePage() {
  const tool = getToolBySlug('time-difference-calculator')!;

  return (
    <ToolPageLayout tool={tool}>
      <TimeDifferenceComponent />
    </ToolPageLayout>
  );
}

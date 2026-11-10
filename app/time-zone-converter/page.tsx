import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import TimeZoneConverterComponent from '@/components/tools/TimeZoneConverterComponent';

export const metadata: Metadata = {
  title: 'Time Zone Converter – Interactive 24-Hour Timeline Scrubber | WebCountDownTimer',
  description:
    'Compare and convert times across multiple global cities. Interactive 24-hour slider, day rollover indicators, working hour highlights, and one-click copy.',
};

export default function TimeZoneConverterPage() {
  const tool = getToolBySlug('time-zone-converter')!;

  return (
    <ToolPageLayout tool={tool}>
      <TimeZoneConverterComponent />
    </ToolPageLayout>
  );
}

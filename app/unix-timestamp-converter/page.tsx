import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import UnixTimestampComponent from '@/components/tools/UnixTimestampComponent';

export const metadata: Metadata = {
  title: 'Unix Timestamp Converter – Real-Time Epoch to Date & ISO | WebCountDownTimer',
  description:
    'Convert Unix epoch timestamps to UTC, ISO-8601, and local date formats. Live epoch clock ticking, auto-detects seconds, milliseconds, and microseconds.',
};

export default function UnixTimestampPage() {
  const tool = getToolBySlug('unix-timestamp-converter')!;

  return (
    <ToolPageLayout tool={tool}>
      <UnixTimestampComponent />
    </ToolPageLayout>
  );
}

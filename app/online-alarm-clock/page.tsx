import { buildPageMetadata } from '@/lib/seo-metadata';
import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import AlarmClockComponent from '@/components/tools/AlarmClockComponent';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/online-alarm-clock');
}

export default function OnlineAlarmClockPage() {
  const tool = getToolBySlug('online-alarm-clock')!;

  return (
    <ToolPageLayout tool={tool}>
      <AlarmClockComponent />
    </ToolPageLayout>
  );
}

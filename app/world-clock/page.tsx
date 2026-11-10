import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import WorldClockDashboardComponent from '@/components/tools/WorldClockDashboardComponent';

export const metadata: Metadata = {
  title: 'World Clock and Time-Zone Converter | WebCountDownTimer',
  description:
    'Compare local times and plan meetings across the world. Accurate city clocks, UTC offsets, daylight saving time calculations, and time-zone converter.',
};

export default function WorldClockPage() {
  const tool = getToolBySlug('world-clock')!;

  return (
    <ToolPageLayout tool={tool}>
      <WorldClockDashboardComponent />
    </ToolPageLayout>
  );
}

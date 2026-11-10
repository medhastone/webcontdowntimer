import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import CommunityActivityToolsComponent from '@/components/tools/CommunityActivityToolsComponent';

export const metadata: Metadata = {
  title: 'Classroom Seating Chart Maker – Randomized Desk Grid Generator | WebCountDownTimer',
  description:
    'Create and randomize classroom desk layouts in seconds. Paste your student roster, configure rows and columns, shuffle seats fairly, and export to CSV.',
};

export default function SeatingChartMakerPage() {
  const tool = getToolBySlug('seating-chart-maker')!;

  return (
    <ToolPageLayout tool={tool}>
      <CommunityActivityToolsComponent variant="seating-chart-maker" />
    </ToolPageLayout>
  );
}

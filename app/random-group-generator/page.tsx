import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import RandomGroupGeneratorComponent from '@/components/tools/RandomGroupGeneratorComponent';

export const metadata: Metadata = {
  title: 'Random Group Generator – Balanced Team & Breakout Maker | WebCountDownTimer',
  description:
    'Split any roster of students or participants into balanced random teams by number of groups or maximum members per group. Export teams to CSV or clipboard.',
};

export default function RandomGroupGeneratorPage() {
  const tool = getToolBySlug('random-group-generator')!;

  return (
    <ToolPageLayout tool={tool}>
      <RandomGroupGeneratorComponent />
    </ToolPageLayout>
  );
}

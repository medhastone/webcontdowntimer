import { Metadata } from 'next';
import { TOOLS_REGISTRY } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import BlocksTimerComponent from '@/components/tools/BlocksTimerComponent';

const tool = TOOLS_REGISTRY.find((t) => t.slug === 'blocks-timer');

export const metadata: Metadata = {
  title: 'Free Online Blocks Timer | Visual Stacked Block Countdown Timer',
  description:
    tool?.description ||
    'A visual stacked-block countdown timer that removes 3D blocks one by one as time passes. Ideal for classrooms, game turns, study sessions, and routines.',
  keywords: tool?.keywords,
  alternates: {
    canonical: '/timers/blocks-timer',
  },
  openGraph: {
    title: 'Free Online Blocks Timer | WebCountDownTimer',
    description:
      tool?.description ||
      'A visual block countdown timer to help you stay focused and track time.',
    type: 'website',
  },
};

export default function BlocksTimerPage() {
  if (!tool) return null;

  return (
    <ToolPageLayout tool={tool}>
      <BlocksTimerComponent />
    </ToolPageLayout>
  );
}

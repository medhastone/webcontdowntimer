import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import CommunityActivityToolsComponent from '@/components/tools/CommunityActivityToolsComponent';

export const metadata: Metadata = {
  title: 'Chess Clock – Two-Player Bullet, Blitz & Rapid Game Timer | WebCountDownTimer',
  description:
    'Responsive two-player chess and board game clock with 1m Bullet, 3m/5m Blitz, and 10m Rapid presets, move counter, and Spacebar turn switching.',
};

export default function ChessClockPage() {
  const tool = getToolBySlug('chess-clock')!;

  return (
    <ToolPageLayout tool={tool}>
      <CommunityActivityToolsComponent variant="chess-clock" />
    </ToolPageLayout>
  );
}

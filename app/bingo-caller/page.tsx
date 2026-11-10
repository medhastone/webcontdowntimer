import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import CommunityActivityToolsComponent from '@/components/tools/CommunityActivityToolsComponent';

export const metadata: Metadata = {
  title: 'Bingo Number Caller – 1–75 B-I-N-G-O Master Board & Draw | WebCountDownTimer',
  description:
    'Interactive 75-ball Bingo caller with large B-I-N-G-O callout display, full 1–75 verification master board, and chronological call history.',
};

export default function BingoCallerPage() {
  const tool = getToolBySlug('bingo-caller')!;

  return (
    <ToolPageLayout tool={tool}>
      <CommunityActivityToolsComponent variant="bingo-caller" />
    </ToolPageLayout>
  );
}

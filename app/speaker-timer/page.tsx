import { buildPageMetadata } from '@/lib/seo-metadata';
import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import SpeakerTimerComponent from '@/components/tools/SpeakerTimerComponent';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/speaker-timer');
}

export default function SpeakerTimerPage() {
  const tool = getToolBySlug('speaker-timer')!;

  return (
    <ToolPageLayout tool={tool}>
      <SpeakerTimerComponent initialSeconds={900} />
    </ToolPageLayout>
  );
}

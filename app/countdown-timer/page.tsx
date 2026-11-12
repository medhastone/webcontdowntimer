import { buildPageMetadata } from '@/lib/seo-metadata';
import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolPageLayout from '@/components/common/ToolPageLayout';
import CountdownTimerComponent from '@/components/tools/CountdownTimerComponent';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/countdown-timer');
}

interface CountdownTimerPageProps {
  searchParams?: Promise<{ m?: string; s?: string }>;
}

export default async function CountdownTimerPage({
  searchParams,
}: CountdownTimerPageProps) {
  const tool = getToolBySlug('countdown-timer')!;
  const resolved = searchParams ? await searchParams : {};

  let initialSeconds = 600;
  let durationLabel: string | undefined;

  if (resolved.m) {
    const minutes = Number(resolved.m);
    if (Number.isFinite(minutes) && minutes > 0 && minutes <= 1440) {
      initialSeconds = Math.round(minutes * 60);
      durationLabel = `${minutes} Minute Timer`;
    }
  } else if (resolved.s) {
    const seconds = Number(resolved.s);
    if (Number.isFinite(seconds) && seconds > 0 && seconds <= 86400) {
      initialSeconds = Math.round(seconds);
      durationLabel = `${seconds} Second Timer`;
    }
  }

  return (
    <ToolPageLayout tool={tool}>
      <CountdownTimerComponent
        key={`countdown-${initialSeconds}`}
        initialSeconds={initialSeconds}
        durationLabel={durationLabel}
      />
    </ToolPageLayout>
  );
}

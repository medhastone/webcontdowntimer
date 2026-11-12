import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import {
  APPROVED_DURATION_SLUGS,
  KEPT_MINUTE_TIMERS,
  getDurationPageData,
} from '@/lib/duration-timers-data';
import DurationTimerPageLayout from '@/components/common/DurationTimerPageLayout';
import { buildPageMetadata } from '@/lib/seo-metadata';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return APPROVED_DURATION_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = getDurationPageData(slug);
  if (!data) {
    return buildPageMetadata(`/${slug}`, {
      title: 'Page Not Found | WebCountDownTimer',
      description:
        'The requested timer duration page could not be found. Browse all free online countdown timers, stopwatches, and visual clocks at WebCountDownTimer.',
      noIndex: true,
    });
  }

  return buildPageMetadata(`/${data.slug}`, {
    title: data.seoTitle,
    description: data.metaDescription,
    keywords: [data.primaryKeyword, ...data.secondaryKeywords],
  });
}

export default async function DurationTimerDynamicPage({ params }: PageProps) {
  const { slug } = await params;

  // Redirect any /N-minute-timer that is not in the kept set [1, 5, 10, 15, 30, 60]
  const minMatch = /^(\d+)-minute-timer$/.exec(slug);
  if (minMatch) {
    const minutes = Number(minMatch[1]);
    if (!KEPT_MINUTE_TIMERS.includes(minutes as (typeof KEPT_MINUTE_TIMERS)[number])) {
      permanentRedirect(`/countdown-timer?m=${minutes}`);
    }
  }

  const data = getDurationPageData(slug);

  if (!data) {
    notFound();
  }

  return <DurationTimerPageLayout data={data} />;
}

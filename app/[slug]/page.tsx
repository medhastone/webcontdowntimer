import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  APPROVED_DURATION_SLUGS,
  getDurationPageData,
} from '@/lib/duration-timers-data';
import DurationTimerPageLayout from '@/components/common/DurationTimerPageLayout';

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
    return {
      title: 'Page Not Found | WebCountDownTimer',
    };
  }

  return {
    title: data.seoTitle,
    description: data.metaDescription,
    keywords: [data.primaryKeyword, ...data.secondaryKeywords],
    alternates: {
      canonical: `https://WebCountDownTimer.com/${data.slug}`,
    },
    openGraph: {
      title: data.seoTitle,
      description: data.metaDescription,
      url: `https://WebCountDownTimer.com/${data.slug}`,
      siteName: 'WebCountDownTimer',
      type: 'website',
    },
  };
}

export default async function DurationTimerDynamicPage({ params }: PageProps) {
  const { slug } = await params;
  const data = getDurationPageData(slug);

  if (!data) {
    notFound();
  }

  return <DurationTimerPageLayout data={data} />;
}

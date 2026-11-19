import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import {
  HOLIDAY_DEFINITIONS,
  getHolidayPageBundle,
} from '@/lib/holidays-data';
import HolidayCountdownTemplate from '@/components/holidays/HolidayCountdownTemplate';
import { buildPageMetadata } from '@/lib/seo-metadata';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return HOLIDAY_DEFINITIONS.map((h) => ({ slug: h.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const normalized = slug.toLowerCase();
  const bundle = getHolidayPageBundle(normalized);

  if (!bundle) {
    return buildPageMetadata(`/days-until/${normalized}`, {
      title: 'Holiday Countdown Not Found | WebCountDownTimer',
      description:
        'Browse live days, hours, minutes, and seconds holiday countdowns at WebCountDownTimer.',
      noIndex: true,
    });
  }

  const { resolved } = bundle;
  const subject = resolved.isPureYear
    ? resolved.holidayName
    : `${resolved.holidayName} ${resolved.year}`;

  const rawTitle = `How Many Days Until ${subject}? | WebCountDownTimer`;
  const title =
    rawTitle.length <= 65 ? rawTitle : `Days Until ${subject}? | WebCountDownTimer`;

  const description = resolved.isPastPinned
    ? `${subject} took place on ${resolved.dayOfWeek}, ${resolved.nextDate}. Confirm the date rule and track the upcoming ${resolved.holidayName} countdown.`
    : `There are ${resolved.daysRemaining} days until ${resolved.holidayName} on ${resolved.dayOfWeek}, ${resolved.nextDate}. Live days, hours, minutes & seconds counter.`;

  return buildPageMetadata(`/days-until/${resolved.slug}`, {
    title,
    description,
    keywords: [
      `how many days until ${subject.toLowerCase()}`,
      `how many days till ${resolved.holidayName.toLowerCase()}`,
      `${resolved.holidayName.toLowerCase()} countdown`,
      `${subject.toLowerCase()} date`,
    ],
  });
}

export default async function HolidayCountdownPage({ params }: PageProps) {
  const { slug } = await params;
  const normalized = slug.toLowerCase();

  if (slug !== normalized && getHolidayPageBundle(normalized)) {
    permanentRedirect(`/days-until/${normalized}`);
  }

  const bundle = getHolidayPageBundle(normalized);
  if (!bundle) {
    notFound();
  }

  return <HolidayCountdownTemplate bundle={bundle} />;
}

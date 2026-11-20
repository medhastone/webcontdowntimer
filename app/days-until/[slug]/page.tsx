import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import {
  HOLIDAY_DEFINITIONS,
  getHolidayPageBundle,
  type ResolvedHolidayOccurrence,
} from '@/lib/holidays-data';
import HolidayCountdownTemplate from '@/components/holidays/HolidayCountdownTemplate';
import { buildPageMetadata } from '@/lib/seo-metadata';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return HOLIDAY_DEFINITIONS.map((h) => ({ slug: h.slug }));
}

function buildOptimizedHolidayTitle(resolved: ResolvedHolidayOccurrence): string {
  const shortHoliday = resolved.holidayName.replace(/\s*\([^)]*\)/g, '').trim();
  const fullSubject = resolved.isPureYear
    ? resolved.holidayName
    : `${resolved.holidayName} ${resolved.year}`;
  const shortSubject = resolved.isPureYear
    ? shortHoliday
    : `${shortHoliday} ${resolved.year}`;

  const candidates = [
    `How Many Days Until ${fullSubject}? | WebCountDownTimer`,
    `How Many Days Until ${shortSubject}? | WebCountDownTimer`,
    `Days Until ${shortSubject}? | WebCountDownTimer`,
    `${shortSubject} Countdown | WebCountDownTimer`,
    `Days Until ${shortSubject} | WebCountDownTimer`,
  ];

  const ideal = candidates.find((c) => c.length >= 30 && c.length <= 60);
  if (ideal) return ideal;
  return candidates[candidates.length - 1].slice(0, 60).trim();
}

function buildOptimizedHolidayDescription(resolved: ResolvedHolidayOccurrence): string {
  const shortHoliday = resolved.holidayName.replace(/\s*\([^)]*\)/g, '').trim();
  const subject = resolved.isPureYear
    ? resolved.holidayName
    : `${shortHoliday} ${resolved.year}`;

  if (resolved.isPastPinned) {
    const desc = `${subject} took place on ${resolved.dayOfWeek}, ${resolved.nextDate}. Check the verified date rule, 5-year schedule, and track the next ${shortHoliday} countdown.`;
    return desc.length <= 160
      ? desc
      : `${subject} was on ${resolved.dayOfWeek}, ${resolved.nextDate}. View the calendar date rule and track the next ${shortHoliday} live flip countdown.`;
  }

  if (resolved.isToday) {
    return `Today is ${subject} (${resolved.dayOfWeek}, ${resolved.nextDate})! Celebrate with our live local time zone holiday countdown, date rule, and upcoming schedule.`;
  }

  const dayWord = resolved.daysRemaining === 1 ? 'day' : 'days';
  const primary = `${resolved.daysRemaining} ${dayWord} until ${subject} (${resolved.dayOfWeek}, ${resolved.nextDate}). Watch the live 3D flip countdown in your local time zone with business days.`;
  if (primary.length >= 120 && primary.length <= 160) {
    return primary;
  }

  const compact = `${resolved.daysRemaining} ${dayWord} until ${subject} on ${resolved.dayOfWeek}, ${resolved.nextDate}. Track the live flip countdown, weeks, and business days.`;
  if (compact.length <= 160) {
    return compact;
  }

  return `${resolved.daysRemaining} ${dayWord} until ${subject} (${resolved.nextDate}). Live flip countdown with weeks, business days, and date rules.`.slice(0, 160);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const normalized = slug.toLowerCase();
  const bundle = getHolidayPageBundle(normalized);

  if (!bundle) {
    return buildPageMetadata(`/days-until/${normalized}`, {
      title: 'Holiday Countdown Not Found | WebCountDownTimer',
      description:
        'Browse live 3D flip holiday countdowns in days, hours, minutes, and seconds calculated in your local time zone at WebCountDownTimer.',
      noIndex: true,
    });
  }

  const { resolved } = bundle;
  const shortHoliday = resolved.holidayName.replace(/\s*\([^)]*\)/g, '').trim();
  const subject = resolved.isPureYear
    ? resolved.holidayName
    : `${shortHoliday} ${resolved.year}`;

  const title = buildOptimizedHolidayTitle(resolved);
  const description = buildOptimizedHolidayDescription(resolved);

  return buildPageMetadata(`/days-until/${resolved.slug}`, {
    title,
    description,
    keywords: [
      `how many days until ${subject.toLowerCase()}`,
      `how many days till ${shortHoliday.toLowerCase()}`,
      `${shortHoliday.toLowerCase()} countdown`,
      `${subject.toLowerCase()} date`,
      `when is ${subject.toLowerCase()}`,
      `${shortHoliday.toLowerCase()} flip timer`,
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

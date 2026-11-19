import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo-metadata';
import { getAllHolidayOccurrences } from '@/lib/holidays-data';
import HomePageClient from '@/components/pages/HomePageClient';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/');
}

export default function Page() {
  const upcomingHolidays = getAllHolidayOccurrences()
    .filter((h) => !h.isPastPinned && !h.isPureYear && h.pinnedYear === undefined)
    .sort((a, b) => a.daysRemaining - b.daysRemaining)
    .slice(0, 8)
    .map((h) => ({
      slug: h.slug,
      baseSlug: h.baseSlug,
      holidayName: h.holidayName,
      year: h.year,
      nextDate: h.nextDate,
      dayOfWeek: h.dayOfWeek,
      daysRemaining: h.daysRemaining,
      isToday: h.isToday,
    }));

  return <HomePageClient upcomingHolidays={upcomingHolidays} />;
}

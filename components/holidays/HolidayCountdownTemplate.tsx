import React from 'react';
import Link from 'next/link';
import {
  Calendar,
  ArrowRight,
  Info,
  HelpCircle,
  Sparkles,
  Clock,
  Briefcase,
  CheckCircle2,
  CalendarDays,
} from 'lucide-react';
import SEOStructuredData from '@/components/common/SEOStructuredData';
import HolidayCountdownClient from '@/components/holidays/HolidayCountdownClient';
import { HolidayIconGlyph } from '@/components/holidays/HolidayVisualIcon';
import { getHolidayVisualTheme } from '@/lib/holiday-visuals';
import { getCanonicalUrl } from '@/lib/seo-metadata';
import type { HolidayPageBundle } from '@/lib/holidays-data';

interface HolidayCountdownTemplateProps {
  bundle: HolidayPageBundle;
}

export default function HolidayCountdownTemplate({ bundle }: HolidayCountdownTemplateProps) {
  const { resolved, upcomingSchedule, relatedCountdowns, faqs } = bundle;
  const theme = getHolidayVisualTheme(resolved.slug, resolved.baseSlug);
  const pageUrl = getCanonicalUrl(`/days-until/${resolved.slug}`);
  const homeUrl = getCanonicalUrl('/');
  const hubUrl = getCanonicalUrl('/days-until');

  const crumbLabel = resolved.isPureYear
    ? resolved.holidayName
    : `${resolved.holidayName} ${resolved.year}`;

  const breadcrumbs = [
    { name: 'Home', item: homeUrl },
    { name: 'Days Until', item: hubUrl },
    { name: crumbLabel, item: pageUrl },
  ];

  const metaDescription = resolved.isPastPinned
    ? `${crumbLabel} occurred on ${resolved.dayOfWeek}, ${resolved.nextDate}. View the fixed or variable date rule and switch to the upcoming ${resolved.holidayName} countdown.`
    : `There are ${resolved.daysRemaining} days until ${resolved.holidayName} on ${resolved.dayOfWeek}, ${resolved.nextDate}. Track the live days, hours, minutes, and seconds flip countdown in your local time zone.`;

  const extraSchemaNodes: Record<string, unknown>[] = [
    {
      '@type': 'WebPage',
      '@id': `${pageUrl}#webpage`,
      url: pageUrl,
      name: resolved.h1,
      description: metaDescription,
      inLanguage: 'en-US',
      isPartOf: {
        '@type': 'WebSite',
        '@id': `${homeUrl}/#website`,
        name: 'WebCountDownTimer',
        url: homeUrl,
      },
      breadcrumb: {
        '@id': `${pageUrl}#breadcrumb`,
      },
      about: {
        '@id': `${pageUrl}#event`,
      },
    },
    {
      '@type': 'Event',
      '@id': `${pageUrl}#event`,
      name: crumbLabel,
      startDate: resolved.isoDate,
      endDate: resolved.isoDate,
      eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
      eventStatus: 'https://schema.org/EventScheduled',
      description: resolved.ruleSummary,
      url: pageUrl,
      location: {
        '@type': 'VirtualLocation',
        name: 'WebCountDownTimer Live Holiday Countdown',
        url: pageUrl,
      },
      organizer: {
        '@type': 'Organization',
        '@id': `${homeUrl}/#organization`,
        name: 'WebCountDownTimer',
        url: homeUrl,
      },
    },
  ];

  const dayWord = resolved.daysRemaining === 1 ? 'day' : 'days';
  const bizDayWord = resolved.businessDaysRemaining === 1 ? 'business day' : 'business days';
  const firstScheduleYear = upcomingSchedule[0]?.year ?? resolved.targetYear;
  const lastScheduleYear = upcomingSchedule[upcomingSchedule.length - 1]?.year ?? resolved.targetYear;

  return (
    <div className="min-h-screen bg-[#F7F6F2] dark:bg-[#141816] text-[#252B27] dark:text-slate-100 transition-colors">
      <SEOStructuredData
        toolName={`${crumbLabel} Countdown`}
        description={metaDescription}
        url={pageUrl}
        faqs={faqs}
        breadcrumbs={breadcrumbs}
        applicationCategory="UtilitiesApplication"
        featureList={[
          'Live days, hours, minutes, and seconds 3D mechanical flip countdown',
          'Automatic local browser time zone synchronization',
          'Exact weeks remaining and Monday-to-Friday business days count',
          'Mobile vertical and desktop fullscreen display modes',
          'Verified fixed and variable multi-year holiday calendar schedule',
        ]}
        extraNodes={extraSchemaNodes}
      />

      {/* 1. VISIBLE BREADCRUMB BAR (Matches BreadcrumbList JSON-LD 1:1) */}
      <nav
        aria-label="Breadcrumb"
        className="border-b border-[#E4E1D9] dark:border-[#262D28] bg-white/60 dark:bg-[#181D1A]/60"
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-3">
          <ol className="flex items-center flex-wrap gap-2 text-xs text-[#252B27]/70 dark:text-slate-400">
            <li>
              <Link
                prefetch={false}
                href="/"
                className="hover:text-[#365C4B] dark:hover:text-[#5E917A] transition-colors"
              >
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-[#252B27]/30 dark:text-slate-600">
              ›
            </li>
            <li>
              <Link
                prefetch={false}
                href="/days-until"
                className="hover:text-[#365C4B] dark:hover:text-[#5E917A] transition-colors"
              >
                Days Until
              </Link>
            </li>
            <li aria-hidden="true" className="text-[#252B27]/30 dark:text-slate-600">
              ›
            </li>
            <li aria-current="page" className="text-[#252B27] dark:text-white font-medium">
              {crumbLabel}
            </li>
          </ol>
        </div>
      </nav>

      {/* 2. HERO + ABOVE-THE-FOLD SUMMARY + LIVE COUNTDOWN STAGE */}
      <section className="pt-8 pb-12 sm:pt-12 sm:pb-14 border-b border-[#E4E1D9] dark:border-[#262D28]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 space-y-6">
          <div className="max-w-4xl space-y-2.5">
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-[#B7804C] dark:text-[#cda06f]">
              <span
                className={`inline-flex items-center justify-center w-6 h-6 rounded-lg border ${theme.badgeBgClass} ${theme.badgeTextClass}`}
              >
                <HolidayIconGlyph name={theme.primaryIcon} className="w-3.5 h-3.5" />
              </span>
              <span>Holiday Countdown</span>
              <span aria-hidden="true">·</span>
              <span>{resolved.ruleTypeLabel}</span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1 text-[#365C4B] dark:text-[#7EC4A0]">
                <Sparkles className="w-3 h-3" />
                <span>Live Flip Timer</span>
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-[52px] leading-[1.08] font-normal tracking-tight text-[#252B27] dark:text-white text-balance">
              {resolved.h1}
            </h1>
          </div>

          <HolidayCountdownClient initialData={resolved} />

          {/* QUICK HOLIDAY SNAPSHOT STRIP (High-Scannability Key Facts) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            <div className="rounded-2xl bg-white dark:bg-[#1A201C] border border-[#E4E1D9] dark:border-[#2D352F] p-4 space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#252B27]/60 dark:text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-[#365C4B] dark:text-[#70B393]" />
                <span>{resolved.isPastPinned ? 'Target Date' : 'Next Date'}</span>
              </div>
              <div className="text-base sm:text-lg font-bold text-[#252B27] dark:text-white">
                {resolved.nextDate}
              </div>
              <div className="text-xs text-[#252B27]/65 dark:text-slate-400">
                Falls on {resolved.dayOfWeek}
              </div>
            </div>

            <div className="rounded-2xl bg-white dark:bg-[#1A201C] border border-[#E4E1D9] dark:border-[#2D352F] p-4 space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#252B27]/60 dark:text-slate-400">
                <Clock className="w-3.5 h-3.5 text-[#365C4B] dark:text-[#70B393]" />
                <span>Time Left</span>
              </div>
              <div className="text-base sm:text-lg font-bold font-mono tabular-nums text-[#365C4B] dark:text-[#7EC4A0]">
                {resolved.isToday
                  ? 'Today!'
                  : resolved.isPastPinned
                    ? '0 days'
                    : `${resolved.daysRemaining} ${dayWord}`}
              </div>
              <div className="text-xs text-[#252B27]/65 dark:text-slate-400">
                {resolved.isPastPinned ? 'Past pinned date' : resolved.weeksRemainingLabel}
              </div>
            </div>

            <div className="rounded-2xl bg-white dark:bg-[#1A201C] border border-[#E4E1D9] dark:border-[#2D352F] p-4 space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#252B27]/60 dark:text-slate-400">
                <Briefcase className="w-3.5 h-3.5 text-[#B7804C] dark:text-[#cda06f]" />
                <span>Workdays Left</span>
              </div>
              <div className="text-base sm:text-lg font-bold font-mono tabular-nums text-[#252B27] dark:text-white">
                {resolved.businessDaysRemaining} {bizDayWord}
              </div>
              <div className="text-xs text-[#252B27]/65 dark:text-slate-400">
                Monday–Friday count
              </div>
            </div>

            <div className="rounded-2xl bg-white dark:bg-[#1A201C] border border-[#E4E1D9] dark:border-[#2D352F] p-4 space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#252B27]/60 dark:text-slate-400">
                <CalendarDays className="w-3.5 h-3.5 text-[#B7804C] dark:text-[#cda06f]" />
                <span>Calendar Rule</span>
              </div>
              <div className="text-base sm:text-lg font-bold text-[#252B27] dark:text-white">
                {resolved.ruleTypeLabel}
              </div>
              <div className="text-xs text-[#252B27]/65 dark:text-slate-400">
                {resolved.ruleTypeLabel === 'Fixed Date'
                  ? 'Same date each year'
                  : 'Shifts by calendar rule'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. READABLE DATE RULE, 5-YEAR SCHEDULE TABLE & FAQS */}
      <section className="py-12 sm:py-14 border-b border-[#E4E1D9] dark:border-[#262D28]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Date Rule Explanation + Upcoming 5-Year Schedule Table */}
          <div className="lg:col-span-7 space-y-6">
            <article className="bg-white dark:bg-[#1A201C] rounded-2xl border border-[#E4E1D9] dark:border-[#2D352F] p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#365C4B] dark:text-[#70B393]">
                <Info className="w-4 h-4 shrink-0" />
                <span>Date Rule &amp; Calendar Verification</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#252B27] dark:text-white">
                When Is {crumbLabel}?
              </h2>
              <p className="text-base text-[#252B27]/85 dark:text-slate-200 leading-7 max-w-prose">
                {resolved.ruleSummary}
              </p>
              <div className="pt-3 flex flex-wrap items-center gap-4 text-xs text-[#252B27]/75 dark:text-slate-400 border-t border-[#E4E1D9] dark:border-[#262D28]">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#365C4B] dark:text-[#70B393]" />
                  <span>
                    Verified Date:{' '}
                    <strong className="text-[#252B27] dark:text-white">
                      {resolved.dayOfWeek}, {resolved.nextDate}
                    </strong>
                  </span>
                </span>
                <span>
                  Schedule Type:{' '}
                  <strong className="text-[#252B27] dark:text-white">
                    {resolved.ruleTypeLabel}
                  </strong>
                </span>
              </div>
            </article>

            {/* 5-Year Upcoming Dates Table (High Readability & Table Snippet SEO) */}
            <div className="bg-white dark:bg-[#1A201C] rounded-2xl border border-[#E4E1D9] dark:border-[#2D352F] p-6 sm:p-8 space-y-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#B7804C] dark:text-[#cda06f]">
                  <CalendarDays className="w-4 h-4 shrink-0" />
                  <span>Multi-Year Reference</span>
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-normal text-[#252B27] dark:text-white">
                  {resolved.isPureYear
                    ? `New Year Calendar Dates (${firstScheduleYear}–${lastScheduleYear})`
                    : `${resolved.holidayName} Dates (${firstScheduleYear}–${lastScheduleYear})`}
                </h2>
                <p className="text-sm text-[#252B27]/70 dark:text-slate-400 leading-relaxed">
                  Plan ahead with the exact weekday and calendar date for the next five occurrences.
                </p>
              </div>

              <div className="overflow-x-auto rounded-xl border border-[#E4E1D9] dark:border-[#2A342E]">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-[#F7F6F2] dark:bg-[#141816] text-xs uppercase tracking-wider text-[#252B27]/70 dark:text-slate-400 border-b border-[#E4E1D9] dark:border-[#2A342E]">
                      <th scope="col" className="py-3 px-4 font-bold">
                        Year
                      </th>
                      <th scope="col" className="py-3 px-4 font-bold">
                        Date
                      </th>
                      <th scope="col" className="py-3 px-4 font-bold">
                        Day of Week
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E4E1D9]/70 dark:divide-[#262D28]">
                    {upcomingSchedule.map((row) => (
                      <tr
                        key={row.year}
                        className={
                          row.isSelected
                            ? 'bg-[#E7EDE7]/65 dark:bg-[#223029]/70 font-semibold text-[#252B27] dark:text-white'
                            : 'text-[#252B27]/85 dark:text-slate-300'
                        }
                      >
                        <td className="py-3 px-4 font-mono tabular-nums whitespace-nowrap">
                          <span>{row.year}</span>
                          {row.isSelected && (
                            <span className="ml-2 inline-block text-[10px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#365C4B] text-white">
                              Current
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">{row.formattedDate}</td>
                        <td className="py-3 px-4 whitespace-nowrap">{row.dayOfWeek}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: How This Countdown Works + 5 Scannable FAQs */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-[#1A201C] rounded-2xl border border-[#E4E1D9] dark:border-[#2D352F] p-6 sm:p-7 space-y-4">
              <h2 className="font-serif text-xl sm:text-2xl font-normal text-[#252B27] dark:text-white">
                How This Countdown Works
              </h2>
              <ul className="space-y-3 text-sm text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#365C4B] dark:text-[#7EC4A0] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-[#252B27] dark:text-white">Local time zone accuracy:</strong>{' '}
                    Counts down to midnight on {resolved.nextDate} in your browser&apos;s own time zone.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#365C4B] dark:text-[#7EC4A0] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-[#252B27] dark:text-white">Flip &amp; digital views:</strong>{' '}
                    Switch instantly between the 3D mechanical flip clock and crisp digital cards.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#365C4B] dark:text-[#7EC4A0] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-[#252B27] dark:text-white">Distraction-free fullscreen:</strong>{' '}
                    Displays vertically on mobile phones and horizontally on desktop screens.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#365C4B] dark:text-[#7EC4A0] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-[#252B27] dark:text-white">Planning metrics included:</strong>{' '}
                    See total weeks and Monday–Friday business days at a glance.
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-white dark:bg-[#1A201C] rounded-2xl border border-[#E4E1D9] dark:border-[#2D352F] p-6 sm:p-7 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#365C4B] dark:text-[#70B393]">
                <HelpCircle className="w-4 h-4 shrink-0" />
                <span>Frequently Asked Questions</span>
              </div>
              <dl className="space-y-4 divide-y divide-[#E4E1D9] dark:divide-[#262D28]">
                {faqs.map((faq) => (
                  <div key={faq.question} className="pt-4 first:pt-0 space-y-1.5">
                    <dt className="text-sm sm:text-base font-bold text-[#252B27] dark:text-white leading-snug">
                      {faq.question}
                    </dt>
                    <dd className="text-sm text-[#252B27]/80 dark:text-slate-300 leading-relaxed">
                      {faq.answer}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* 4. RELATED COUNTDOWNS GRID (6–8 SIBLING HOLIDAY PAGES) */}
      <section className="py-12 sm:py-14">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#B7804C] dark:text-[#cda06f]">
                Explore More Dates
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#252B27] dark:text-white mt-1">
                Related Countdowns
              </h2>
            </div>
            <Link
              prefetch={false}
              href="/days-until"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#365C4B] dark:text-[#70B393] hover:underline"
            >
              <span>View All Holiday Countdowns</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {relatedCountdowns.map((item) => {
              const cardTitle = item.isPureYear
                ? item.holidayName
                : `${item.holidayName} ${item.year}`;
              const itemTheme = getHolidayVisualTheme(item.slug, item.baseSlug);
              const isSoon = item.daysRemaining > 0 && item.daysRemaining <= 14;
              return (
                <Link
                  key={item.slug}
                  prefetch={false}
                  href={`/days-until/${item.slug}`}
                  className="group bg-white dark:bg-[#1A201C] border border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#365C4B] dark:hover:border-[#5E917A] rounded-2xl p-4 sm:p-5 transition-colors flex flex-col justify-between gap-3"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${itemTheme.badgeBgClass} ${itemTheme.badgeTextClass}`}
                        >
                          <HolidayIconGlyph name={itemTheme.primaryIcon} className="w-4 h-4" />
                        </span>
                        <h3 className="text-sm font-bold text-[#252B27] dark:text-white group-hover:text-[#365C4B] dark:group-hover:text-[#70B393] transition-colors">
                          {cardTitle}
                        </h3>
                      </div>
                      <span className="font-mono text-xs font-bold tabular-nums px-2 py-0.5 rounded-md bg-[#E7EDE7] dark:bg-[#223029] text-[#365C4B] dark:text-[#7EC4A0] shrink-0">
                        {item.isToday ? 'Today' : `${item.daysRemaining}d`}
                      </span>
                    </div>
                    <p className="text-xs text-[#252B27]/65 dark:text-slate-400 mt-2">
                      {item.dayOfWeek}, {item.nextDate}
                    </p>
                    {isSoon && (
                      <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#B7804C] dark:text-[#F3C969]">
                        <Sparkles className="w-3 h-3" />
                        <span>Celebration Soon</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2.5 border-t border-[#F0EDE6] dark:border-[#262D28] flex items-center justify-between text-xs font-semibold text-[#365C4B] dark:text-[#70B393]">
                    <span>How many days until {item.holidayName}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

import React from 'react';
import Link from 'next/link';
import { Calendar, ArrowRight, Info, HelpCircle, Sparkles } from 'lucide-react';
import SEOStructuredData from '@/components/common/SEOStructuredData';
import HolidayCountdownClient from '@/components/holidays/HolidayCountdownClient';
import { HolidayIconGlyph } from '@/components/holidays/HolidayVisualIcon';
import { getHolidayVisualTheme } from '@/lib/holiday-visuals';
import type { HolidayPageBundle } from '@/lib/holidays-data';

interface HolidayCountdownTemplateProps {
  bundle: HolidayPageBundle;
}

export default function HolidayCountdownTemplate({ bundle }: HolidayCountdownTemplateProps) {
  const { resolved, relatedCountdowns, faqs } = bundle;
  const theme = getHolidayVisualTheme(resolved.slug, resolved.baseSlug);
  const pageUrl = `https://webcountdowntimer.com/days-until/${resolved.slug}`;

  const crumbLabel = resolved.isPureYear
    ? resolved.holidayName
    : `${resolved.holidayName} ${resolved.year}`;

  const breadcrumbs = [
    { name: 'Home', item: 'https://webcountdowntimer.com/' },
    { name: 'Days Until', item: 'https://webcountdowntimer.com/days-until' },
    { name: crumbLabel, item: pageUrl },
  ];

  const metaDescription = resolved.isPastPinned
    ? `${crumbLabel} occurred on ${resolved.dayOfWeek}, ${resolved.nextDate}. View the fixed or variable date rule and switch to the upcoming ${resolved.holidayName} countdown.`
    : `There are ${resolved.daysRemaining} days until ${resolved.holidayName} on ${resolved.dayOfWeek}, ${resolved.nextDate}. Track the live days, hours, minutes, and seconds countdown.`;

  return (
    <div className="min-h-screen bg-[#F7F6F2] dark:bg-[#141816] text-[#252B27] dark:text-slate-100 transition-colors">
      <SEOStructuredData
        toolName={`${crumbLabel} Countdown`}
        description={metaDescription}
        url={pageUrl}
        faqs={faqs}
        breadcrumbs={breadcrumbs}
        applicationCategory="UtilitiesApplication"
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
            <li className="text-[#252B27]/30 dark:text-slate-600">›</li>
            <li>
              <Link
                prefetch={false}
                href="/days-until"
                className="hover:text-[#365C4B] dark:hover:text-[#5E917A] transition-colors"
              >
                Days Until
              </Link>
            </li>
            <li className="text-[#252B27]/30 dark:text-slate-600">›</li>
            <li className="text-[#252B27] dark:text-white font-medium">{crumbLabel}</li>
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
        </div>
      </section>

      {/* 3. FIXED OR VARIABLE DATE RULE EXPLANATION (40–60 WORDS) + FAQS */}
      <section className="py-12 sm:py-14 border-b border-[#E4E1D9] dark:border-[#262D28]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white dark:bg-[#1A201C] rounded-2xl border border-[#E4E1D9] dark:border-[#2D352F] p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#365C4B] dark:text-[#70B393]">
              <Info className="w-4 h-4 shrink-0" />
              <span>Date Rule &amp; Calendar Verification</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#252B27] dark:text-white">
              When Is {crumbLabel}?
            </h2>
            <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
              {resolved.ruleSummary}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-[#252B27]/70 dark:text-slate-400 border-t border-[#E4E1D9] dark:border-[#262D28]">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#365C4B] dark:text-[#70B393]" />
                <span>
                  Target Date:{' '}
                  <strong className="text-[#252B27] dark:text-white">
                    {resolved.dayOfWeek}, {resolved.nextDate}
                  </strong>
                </span>
              </span>
              <span>
                Rule:{' '}
                <strong className="text-[#252B27] dark:text-white">
                  {resolved.ruleTypeLabel}
                </strong>
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white dark:bg-[#1A201C] rounded-2xl border border-[#E4E1D9] dark:border-[#2D352F] p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#365C4B] dark:text-[#70B393]">
              <HelpCircle className="w-4 h-4 shrink-0" />
              <span>Quick Questions</span>
            </div>
            <div className="space-y-4 divide-y divide-[#E4E1D9] dark:divide-[#262D28]">
              {faqs.map((faq) => (
                <div key={faq.question} className="pt-3 first:pt-0 space-y-1">
                  <h3 className="text-sm font-bold text-[#252B27] dark:text-white">
                    {faq.question}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#252B27]/75 dark:text-slate-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
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

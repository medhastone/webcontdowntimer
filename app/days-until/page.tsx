import type { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, ArrowRight, Clock, Calculator, Sparkles } from 'lucide-react';
import { buildPageMetadata } from '@/lib/seo-metadata';
import { getAllHolidayOccurrences, type HolidayCategory } from '@/lib/holidays-data';
import { getHolidayVisualTheme } from '@/lib/holiday-visuals';
import { HolidayIconGlyph } from '@/components/holidays/HolidayVisualIcon';
import BreadcrumbJsonLd from '@/components/common/BreadcrumbJsonLd';
import SharePageButton from '@/components/common/SharePageButton';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/days-until');
}

const CATEGORY_SECTIONS: Array<{
  id: HolidayCategory;
  title: string;
  subtitle: string;
}> = [
  {
    id: 'major',
    title: 'Major Annual Holidays',
    subtitle: 'Fixed and variable major holidays sorted by target occurrence.',
  },
  {
    id: 'new-year',
    title: 'New Year & Year Countdowns',
    subtitle: 'Track midnight New Year milestones and upcoming calendar years.',
  },
  {
    id: 'cultural',
    title: 'Cultural & Seasonal Traditions',
    subtitle: 'Fixed cultural holidays plus lunar and lunisolar calendar dates.',
  },
  {
    id: 'observance',
    title: 'Federal & Public Observances',
    subtitle: 'Monday holidays, civic observances, and multi-year lookup dates.',
  },
  {
    id: 'seasonal',
    title: 'Shopping & Seasonal Milestones',
    subtitle: 'Variable post-Thanksgiving retail and seasonal dates.',
  },
];

export default function DaysUntilHubPage() {
  const occurrences = getAllHolidayOccurrences();

  return (
    <div className="min-h-screen bg-[#F7F6F2] dark:bg-[#141816] text-[#252B27] dark:text-slate-100 transition-colors">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Days Until', path: '/days-until' },
        ]}
      />

      {/* Breadcrumb Bar */}
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
            <li className="text-[#252B27] dark:text-white font-medium">
              Holiday &amp; Event Countdowns
            </li>
          </ol>
        </div>
      </nav>

      {/* Hero Header */}
      <section className="pt-10 pb-12 border-b border-[#E4E1D9] dark:border-[#262D28]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="max-w-3xl space-y-3">
              <div className="text-[11px] font-bold tracking-widest uppercase text-[#B7804C] dark:text-[#cda06f]">
                Holiday Countdown Directory
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl font-normal tracking-tight text-[#252B27] dark:text-white">
                How Many Days Until Every Holiday?
              </h1>
              <p className="text-base sm:text-lg text-[#252B27]/80 dark:text-slate-300 leading-relaxed">
                Live animated celebration flip countdowns calculated in your local timezone—complete
                with weeks remaining, Monday–Friday business days, and verified fixed or variable
                date rules.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <SharePageButton variant="toolbar" />
              <Link
                prefetch={false}
                href="/event-countdown-timer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#365C4B] hover:bg-[#2B4A3C] text-white text-xs font-semibold transition-colors"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Custom Event Countdown</span>
              </Link>
              <Link
                prefetch={false}
                href="/date-calculator"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-[#1A201C] border border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#365C4B] text-xs font-semibold text-[#252B27] dark:text-slate-200 transition-colors"
              >
                <Calculator className="w-3.5 h-3.5 text-[#365C4B] dark:text-[#70B393]" />
                <span>Date Calculator</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categorized Holiday Countdowns Grid */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-12 space-y-12">
        {CATEGORY_SECTIONS.map((section) => {
          const items = occurrences
            .filter((item) => item.category === section.id)
            .sort((a, b) => a.daysRemaining - b.daysRemaining);

          if (items.length === 0) return null;

          return (
            <section key={section.id} className="space-y-5">
              <div className="border-b border-[#E4E1D9] dark:border-[#262D28] pb-3">
                <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#252B27] dark:text-white">
                  {section.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#252B27]/70 dark:text-slate-400 mt-1">
                  {section.subtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {items.map((item) => {
                  const title = item.isPureYear
                    ? item.holidayName
                    : `${item.holidayName} ${item.year}`;
                  const itemTheme = getHolidayVisualTheme(item.slug, item.baseSlug);
                  const isSoon = item.daysRemaining > 0 && item.daysRemaining <= 14;
                  return (
                    <Link
                      key={item.slug}
                      prefetch={false}
                      href={`/days-until/${item.slug}`}
                      className="group bg-white dark:bg-[#1A201C] border border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#365C4B] dark:hover:border-[#5E917A] rounded-2xl p-5 transition-colors flex flex-col justify-between gap-3"
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
                              {title}
                            </h3>
                          </div>
                          <span className="font-mono text-xs font-bold tabular-nums px-2 py-0.5 rounded-md bg-[#E7EDE7] dark:bg-[#223029] text-[#365C4B] dark:text-[#7EC4A0] shrink-0">
                            {item.isToday ? 'Today!' : `${item.daysRemaining}d`}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-[#252B27]/70 dark:text-slate-400 mt-2.5">
                          <Calendar className="w-3.5 h-3.5 text-[#B7804C] shrink-0" />
                          <span>
                            {item.dayOfWeek}, {item.nextDate}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#252B27]/55 dark:text-slate-500 mt-1 flex flex-wrap items-center gap-1.5">
                          <span>{item.ruleTypeLabel}</span>
                          <span aria-hidden="true">·</span>
                          <span>{item.businessDaysRemaining} business days</span>
                          {(item.isToday || isSoon) && (
                            <span className="inline-flex items-center gap-1 text-[#B7804C] dark:text-[#F3C969] font-bold">
                              <Sparkles className="w-3 h-3" />
                              <span>{item.isToday ? 'Today!' : 'Soon'}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="pt-2.5 border-t border-[#F0EDE6] dark:border-[#262D28] flex items-center justify-between text-xs font-semibold text-[#365C4B] dark:text-[#70B393]">
                        <span>Open flip countdown</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}

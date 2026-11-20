import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Calendar,
  ArrowRight,
  Clock,
  Calculator,
  Sparkles,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';
import { buildPageMetadata, getCanonicalUrl } from '@/lib/seo-metadata';
import { getAllHolidayOccurrences, type HolidayCategory } from '@/lib/holidays-data';
import { getHolidayVisualTheme } from '@/lib/holiday-visuals';
import { HolidayIconGlyph } from '@/components/holidays/HolidayVisualIcon';
import SharePageButton from '@/components/common/SharePageButton';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/days-until');
}

const CATEGORY_SECTIONS: Array<{
  id: HolidayCategory;
  shortLabel: string;
  title: string;
  subtitle: string;
}> = [
  {
    id: 'major',
    shortLabel: 'Major Holidays',
    title: 'Major Annual Holidays',
    subtitle: 'Fixed and variable major holidays sorted by target occurrence.',
  },
  {
    id: 'new-year',
    shortLabel: 'New Year & Years',
    title: 'New Year & Year Countdowns',
    subtitle: 'Track midnight New Year milestones and upcoming calendar years.',
  },
  {
    id: 'cultural',
    shortLabel: 'Cultural & Lunar',
    title: 'Cultural & Seasonal Traditions',
    subtitle: 'Fixed cultural holidays plus lunar and lunisolar calendar dates.',
  },
  {
    id: 'observance',
    shortLabel: 'Federal & Civic',
    title: 'Federal & Public Observances',
    subtitle: 'Monday holidays, civic observances, and multi-year lookup dates.',
  },
  {
    id: 'seasonal',
    shortLabel: 'Shopping & Seasonal',
    title: 'Shopping & Seasonal Milestones',
    subtitle: 'Variable post-Thanksgiving retail and seasonal dates.',
  },
];

const HUB_FAQS = [
  {
    question: 'How are holiday countdown dates calculated?',
    answer:
      'Fixed holidays such as Christmas Eve (December 24) and Halloween (October 31) stay on the same calendar number every year. Variable holidays—including Thanksgiving, Mother’s Day, Memorial Day, Easter, Hanukkah, and Lunar New Year—are calculated using official weekday, ecclesiastical Easter, and lunisolar calendar rules.',
  },
  {
    question: 'Do these holiday countdowns adjust to my local time zone?',
    answer:
      'Yes. Every holiday page reads your device clock and local IANA time zone automatically so the live 3D flip countdown hits zero at midnight on the holiday where you live.',
  },
  {
    question: 'What counts as a business day in the countdown summary?',
    answer:
      'Business days count standard weekdays from Monday through Friday between tomorrow and the holiday date, excluding Saturdays and Sundays.',
  },
  {
    question: 'Can I display a holiday countdown in fullscreen on my phone or TV?',
    answer:
      'Yes. Click Fullscreen inside any holiday countdown card for a distraction-free display that stacks vertically on mobile phones and spreads horizontally on desktop monitors and TVs.',
  },
];

export default function DaysUntilHubPage() {
  const occurrences = getAllHolidayOccurrences();
  const hubUrl = getCanonicalUrl('/days-until');
  const homeUrl = getCanonicalUrl('/');

  const hubStructuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${hubUrl}#webpage`,
        url: hubUrl,
        name: 'How Many Days Until Every Holiday? — Holiday Countdown Directory',
        description:
          'Browse live 3D flip holiday countdowns in days, hours, minutes, and seconds for major holidays, cultural traditions, and upcoming years.',
        inLanguage: 'en-US',
        isPartOf: {
          '@type': 'WebSite',
          '@id': `${homeUrl}/#website`,
          name: 'WebCountDownTimer',
          url: homeUrl,
        },
        breadcrumb: {
          '@id': `${hubUrl}#breadcrumb`,
        },
        mainEntity: {
          '@id': `${hubUrl}#itemlist`,
        },
      },
      {
        '@type': 'ItemList',
        '@id': `${hubUrl}#itemlist`,
        name: 'Holiday & Event Countdown Directory',
        numberOfItems: occurrences.length,
        itemListElement: occurrences.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.isPureYear
            ? `How Many Days Until ${item.holidayName}?`
            : `How Many Days Until ${item.holidayName} ${item.year}?`,
          url: getCanonicalUrl(`/days-until/${item.slug}`),
        })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${hubUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: homeUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Days Until',
            item: hubUrl,
          },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `${hubUrl}#faq`,
        mainEntity: HUB_FAQS.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2] dark:bg-[#141816] text-[#252B27] dark:text-slate-100 transition-colors">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hubStructuredData) }}
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
            <li aria-hidden="true" className="text-[#252B27]/30 dark:text-slate-600">
              ›
            </li>
            <li aria-current="page" className="text-[#252B27] dark:text-white font-medium">
              Days Until
            </li>
          </ol>
        </div>
      </nav>

      {/* Hero Header */}
      <section className="pt-10 pb-10 border-b border-[#E4E1D9] dark:border-[#262D28]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="max-w-3xl space-y-3">
              <div className="text-[11px] font-bold tracking-widest uppercase text-[#B7804C] dark:text-[#cda06f]">
                Holiday Countdown Directory
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl font-normal tracking-tight text-[#252B27] dark:text-white">
                How Many Days Until Every Holiday?
              </h1>
              <p className="text-base sm:text-lg text-[#252B27]/80 dark:text-slate-300 leading-relaxed max-w-2xl">
                Pick any holiday below to open a live 3D flip countdown synced to your local time
                zone—complete with weeks remaining, Monday–Friday business days, 5-year schedules,
                and verified date rules.
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

          {/* Quick Category Jump Links for Easy Scanning */}
          <div className="flex flex-wrap items-center gap-2 pt-1" aria-label="Jump to holiday category">
            {CATEGORY_SECTIONS.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="inline-flex items-center px-3.5 py-1.5 rounded-xl bg-white dark:bg-[#1A201C] border border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#365C4B] dark:hover:border-[#5E917A] text-xs font-semibold text-[#252B27] dark:text-slate-200 transition-colors"
              >
                {section.shortLabel}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Categorized Holiday Countdowns Grid */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-12 space-y-12">
        {CATEGORY_SECTIONS.map((section) => {
          const items = occurrences
            .filter((item) => item.category === section.id)
            .sort((a, b) => a.daysRemaining - b.daysRemaining);

          if (items.length === 0) return null;

          return (
            <section key={section.id} id={section.id} className="space-y-5 scroll-mt-24">
              <div className="border-b border-[#E4E1D9] dark:border-[#262D28] pb-3">
                <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#252B27] dark:text-white">
                  {section.title}
                </h2>
                <p className="text-sm text-[#252B27]/70 dark:text-slate-400 mt-1">
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
                        <div className="text-[11px] text-[#252B27]/60 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-1.5">
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

        {/* Readable Hub Guide + FAQ Section (Matches FAQPage JSON-LD 1:1) */}
        <section className="pt-8 border-t border-[#E4E1D9] dark:border-[#262D28] grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 bg-white dark:bg-[#1A201C] rounded-2xl border border-[#E4E1D9] dark:border-[#2D352F] p-6 sm:p-8 space-y-4">
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#252B27] dark:text-white">
              Why Use Our Holiday Countdowns?
            </h2>
            <p className="text-sm sm:text-base text-[#252B27]/80 dark:text-slate-300 leading-relaxed">
              Every page in this directory gives you the exact answer above the fold—followed by a
              live 3D flip countdown, multi-year reference table, and calendar verification.
            </p>
            <ul className="space-y-3 text-sm text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#365C4B] dark:text-[#7EC4A0] shrink-0 mt-0.5" />
                <span>Verified fixed, nth-weekday, Easter, and lunar holiday date calculations.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#365C4B] dark:text-[#7EC4A0] shrink-0 mt-0.5" />
                <span>Automatic local time zone sync with zero account or sign-up required.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#365C4B] dark:text-[#7EC4A0] shrink-0 mt-0.5" />
                <span>One-click transfer into our custom Event Countdown Timer for personal events.</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-7 bg-white dark:bg-[#1A201C] rounded-2xl border border-[#E4E1D9] dark:border-[#2D352F] p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#365C4B] dark:text-[#70B393]">
              <HelpCircle className="w-4 h-4 shrink-0" />
              <span>Frequently Asked Questions</span>
            </div>
            <dl className="space-y-4 divide-y divide-[#E4E1D9] dark:divide-[#262D28]">
              {HUB_FAQS.map((faq) => (
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
        </section>
      </div>
    </div>
  );
}

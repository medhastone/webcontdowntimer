import { buildPageMetadata } from '@/lib/seo-metadata';
import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ChevronRight,
  TrainFront,
  Settings,
  Monitor,
  CheckCircle2,
  Play,
  Info,
} from 'lucide-react';
import TrainTimerComponent from '@/components/tools/TrainTimerComponent';
import ToolSpecificContentSection from '@/components/common/ToolSpecificContentSection';
import { getToolSpecificContent } from '@/lib/tool-specific-content';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/timers/train-timer');
}

export default function TrainTimerPage() {
  const specificContent = getToolSpecificContent('train-timer');
  const faqs = specificContent ? specificContent.faqs : [];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Free Online Train Timer',
        url: 'https://WebCountDownTimer.com/timers/train-timer',
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'All',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        description:
          'A railway station–inspired visual countdown timer featuring a split-flap departure board, custom session names, station themes, and an animated train route progress bar.',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://WebCountDownTimer.com' },
          { '@type': 'ListItem', position: 2, name: 'Timers', item: 'https://WebCountDownTimer.com/tools' },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Train Timer',
            item: 'https://WebCountDownTimer.com/timers/train-timer',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#F5F7F5] dark:bg-[#0F1311] text-[#17211B] dark:text-slate-100 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HERO BANNER WITH RAILWAY STATION CLOCK & PLATFORM 1 DEPARTURE BOARD */}
      <section className="relative overflow-hidden border-b border-[#DCE3DD] dark:border-[#242C27] bg-gradient-to-r from-[#FAFBFA] via-[#F2F5F2] to-[#E6DEC8] dark:from-[#131815] dark:via-[#181E1A] dark:to-[#241E16]">
        {/* Right-side Grand Railway Terminal Illustration */}
        <div
          aria-hidden="true"
          className="hidden lg:flex absolute inset-y-0 right-0 w-[48%] items-center justify-end pr-8 pointer-events-none select-none overflow-hidden [mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.55)_32%,black_62%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.55)_32%,black_62%)]"
        >
          <div
            className="absolute inset-0 opacity-95"
            style={{
              background:
                'linear-gradient(90deg, rgba(56,42,28,0) 0%, rgba(56,42,28,0.82) 50%, rgba(24,18,12,0.96) 100%)',
            }}
          />
          <div className="absolute top-4 right-64 w-44 h-44 rounded-full bg-amber-300/25 blur-2xl" />
          <div className="absolute bottom-2 right-12 w-52 h-52 rounded-full bg-orange-400/20 blur-2xl" />

          {/* Hanging Vintage Station Analog Clock */}
          <div className="relative z-10 flex flex-col items-center mr-6 -mt-8">
            <div className="w-1.5 h-8 bg-stone-700" />
            <div className="w-20 h-20 rounded-full bg-[#FDFBF7] border-4 border-[#3E3227] shadow-xl flex items-center justify-center relative">
              <div className="w-16 h-16 rounded-full border border-stone-300 flex items-center justify-center relative">
                <span className="absolute top-1 text-[8px] font-serif font-bold text-stone-800">XII</span>
                <span className="absolute right-1.5 text-[8px] font-serif font-bold text-stone-800">III</span>
                <span className="absolute bottom-1 text-[8px] font-serif font-bold text-stone-800">VI</span>
                <span className="absolute left-1.5 text-[8px] font-serif font-bold text-stone-800">IX</span>
                <div className="w-1 h-4 bg-stone-900 rounded-full origin-bottom -translate-y-2 rotate-[-35deg]" />
                <div className="w-0.5 h-5 bg-stone-900 rounded-full origin-bottom -translate-y-2.5 rotate-[15deg]" />
                <div className="w-2 h-2 rounded-full bg-stone-900" />
              </div>
            </div>
          </div>

          {/* PLATFORM 1 Departure Board & Express Train Preview */}
          <div className="relative z-10 flex flex-col items-end gap-3 mr-4">
            <div className="rounded-xl p-3 bg-[#1A1614] border-2 border-[#57493D] shadow-2xl w-64">
              <div className="text-center font-mono text-xs font-extrabold tracking-[0.2em] text-amber-100 border-b border-white/15 pb-1.5 mb-2">
                PLATFORM 1
              </div>
              <div className="space-y-1 font-mono text-[10px]">
                <div className="flex justify-between text-amber-400 bg-black/50 px-2 py-0.5 rounded">
                  <span>11:30 CENTRAL</span>
                  <span>ON TIME</span>
                </div>
                <div className="flex justify-between text-amber-300/90 bg-black/50 px-2 py-0.5 rounded">
                  <span>11:45 EXPRESS</span>
                  <span>PLAT 1</span>
                </div>
                <div className="flex justify-between text-amber-300/80 bg-black/50 px-2 py-0.5 rounded">
                  <span>12:00 VALLEY</span>
                  <span>PLAT 2</span>
                </div>
              </div>
            </div>

            <div className="w-72 h-14 rounded-l-2xl bg-gradient-to-r from-stone-200 via-stone-100 to-stone-300 border-2 border-stone-500 shadow-lg flex items-center px-4 gap-3 overflow-hidden">
              <div className="w-10 h-8 rounded-l-lg bg-sky-900/80 border border-stone-600" />
              <div className="w-14 h-7 rounded bg-amber-100/90 border border-stone-500" />
              <div className="w-14 h-7 rounded bg-amber-100/90 border border-stone-500" />
              <div className="w-14 h-7 rounded bg-amber-100/90 border border-stone-500" />
            </div>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-9">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs text-[#4A554E] dark:text-slate-400 mb-3"
          >
            <Link href="/" className="hover:text-[#124E35] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            <Link href="/tools" className="hover:text-[#124E35] transition-colors">
              Timers
            </Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            <span className="font-semibold text-[#17211B] dark:text-white">Train Timer</span>
          </nav>

          <div className="max-w-2xl">
            <div className="text-xs font-extrabold tracking-[0.16em] uppercase text-[#B91C1C] dark:text-rose-400 mb-1.5">
              TRAIN TIMER
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold text-[#0E2338] dark:text-white tracking-tight leading-tight">
              Free Online Train Timer
            </h1>
            <p className="mt-2.5 text-sm sm:text-base text-[#2B352E] dark:text-slate-300 leading-relaxed max-w-xl">
              A railway station–inspired countdown timer that helps you manage activities with a
              fun and realistic train theme.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-[#1E2822] dark:text-slate-200">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-[#B91C1C] text-white flex items-center justify-center shadow-2xs">
                  <TrainFront className="w-3.5 h-3.5" />
                </span>
                <span>Station-style countdown</span>
              </div>
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#2B352E] dark:text-slate-300" />
                <span>Customizable display</span>
              </div>
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-[#2B352E] dark:text-slate-300" />
                <span>Works on all devices</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#124E35] dark:text-emerald-400" />
                <span>Free to use</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-12">
        {/* INTERACTIVE TRAIN TIMER + ROUTE + QUICK PRESETS */}
        <TrainTimerComponent initialMinutes={25} />

        {/* TOOL-SPECIFIC CONTENT (150-250 WORDS: USE CASES, HOW TO USE & 3 UNIQUE FAQS) + SIDEBAR */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
          <div className="lg:col-span-8 bg-white dark:bg-[#161B18] border border-[#DCE3DD] dark:border-[#262E29] rounded-3xl p-6 sm:p-8 shadow-2xs">
            <ToolSpecificContentSection slug="train-timer" toolName="Train Timer" />
          </div>

          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            <div className="rounded-2xl bg-[#EEF5F0] dark:bg-[#18221C] border border-[#CFE0D4] dark:border-[#2A3B30] p-5 shadow-2xs">
              <div className="flex items-center gap-2 text-[#14532D] dark:text-emerald-400 font-serif font-extrabold text-base mb-2">
                <Info className="w-5 h-5 shrink-0" />
                <h3>Important Note</h3>
              </div>
              <p className="text-xs text-[#2B352E] dark:text-slate-300 leading-relaxed">
                This is a user-configured visual countdown timer. It is not a live train timetable,
                railway departure tracker or real-time transport information service.
              </p>
            </div>

            <div className="rounded-2xl bg-white dark:bg-[#161B18] border border-[#DCE3DD] dark:border-[#262E29] p-5 shadow-2xs">
              <h3 className="text-sm font-bold text-[#142018] dark:text-white mb-3.5">
                Related Tools
              </h3>
              <div className="space-y-2.5">
                <Link
                  href="/timers/flip-clock"
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#F2F6F3] dark:hover:bg-[#1E2621] transition-colors group"
                >
                  <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-[#B91C1C] flex items-center justify-center shrink-0">
                    <TrainFront className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#142018] dark:text-white group-hover:text-[#15803D] transition-colors truncate">
                      Flip Clock
                    </div>
                    <div className="text-[11px] text-[#526056] dark:text-slate-400 truncate">
                      A station-style split-flap clock.
                    </div>
                  </div>
                </Link>

                <Link
                  href="/timers/flip-timer"
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#F2F6F3] dark:hover:bg-[#1E2621] transition-colors group"
                >
                  <div className="w-9 h-9 rounded-xl bg-stone-900 text-white font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    00
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#142018] dark:text-white group-hover:text-[#15803D] transition-colors truncate">
                      Flip Timer
                    </div>
                    <div className="text-[11px] text-[#526056] dark:text-slate-400 truncate">
                      A retro split-flap countdown.
                    </div>
                  </div>
                </Link>

                <Link
                  href="/visual-timer"
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#F2F6F3] dark:hover:bg-[#1E2621] transition-colors group"
                >
                  <div className="w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-950/50 text-orange-600 flex items-center justify-center shrink-0">
                    <Play className="w-4 h-4 fill-current" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#142018] dark:text-white group-hover:text-[#15803D] transition-colors truncate">
                      Visual Timer
                    </div>
                    <div className="text-[11px] text-[#526056] dark:text-slate-400 truncate">
                      A calming visual countdown.
                    </div>
                  </div>
                </Link>

                <Link
                  href="/countdown-timer"
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#F2F6F3] dark:hover:bg-[#1E2621] transition-colors group"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    31
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#142018] dark:text-white group-hover:text-[#15803D] transition-colors truncate">
                      Countdown Timer
                    </div>
                    <div className="text-[11px] text-[#526056] dark:text-slate-400 truncate">
                      A simple numeric countdown.
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

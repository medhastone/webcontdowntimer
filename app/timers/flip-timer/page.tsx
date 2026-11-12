import { buildPageMetadata } from '@/lib/seo-metadata';
import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  ChevronRight,
  Settings,
  Monitor,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import FlipTimerComponent from '@/components/tools/FlipTimerComponent';
import ToolSpecificContentSection from '@/components/common/ToolSpecificContentSection';
import { getToolSpecificContent } from '@/lib/tool-specific-content';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/timers/flip-timer');
}

const RELATED_TOOLS = [
  {
    name: 'Pomodoro Timer',
    desc: 'Stay focused with intervals.',
    href: '/pomodoro-timer',
    badge: (
      <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/40 flex items-center justify-center shrink-0">
        <svg viewBox="0 0 36 36" className="w-7 h-7">
          <circle cx="18" cy="20" r="11" fill="#EF4444" />
          <path
            d="M14 9c2 0 4 2 4 3 0-1 2-3 4-3M18 7v5"
            stroke="#16A34A"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
  },
  {
    name: 'Circular Timer',
    desc: 'A simple circle countdown.',
    href: '/timers/circular-timer',
    badge: (
      <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center shrink-0">
        <svg viewBox="0 0 36 36" className="w-7 h-7">
          <circle cx="18" cy="18" r="11" fill="none" stroke="#D1FAE5" strokeWidth="4.5" />
          <circle
            cx="18"
            cy="18"
            r="11"
            fill="none"
            stroke="#10B981"
            strokeWidth="4.5"
            strokeDasharray="52 70"
            transform="rotate(-90 18 18)"
          />
        </svg>
      </div>
    ),
  },
  {
    name: 'Progress Timer',
    desc: 'A visual progress bar timer.',
    href: '/timers/progress-timer',
    badge: (
      <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/40 flex items-center justify-center shrink-0">
        <svg viewBox="0 0 36 36" className="w-7 h-7">
          <rect x="8" y="21" width="4" height="7" rx="1" fill="#FB923C" />
          <rect x="14" y="17" width="4" height="11" rx="1" fill="#F97316" />
          <rect x="20" y="13" width="4" height="15" rx="1" fill="#EA580C" />
          <rect x="26" y="8" width="4" height="20" rx="1" fill="#C2410C" />
        </svg>
      </div>
    ),
  },
  {
    name: 'Flip Clock',
    desc: 'A retro flip style clock.',
    href: '/timers/flip-clock',
    badge: (
      <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-900 flex items-center justify-center shrink-0">
        <div className="w-7 h-6 rounded-md bg-[#1C1917] text-white font-mono text-[11px] font-bold flex items-center justify-center relative border border-stone-600">
          12
          <span className="absolute inset-x-0 top-1/2 h-[1px] bg-black" />
        </div>
      </div>
    ),
  },
];

export default function FlipTimerPage() {
  const specificContent = getToolSpecificContent('flip-timer');
  const allFaqs = specificContent ? specificContent.faqs : [];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Free Online Flip Timer',
        url: 'https://WebCountDownTimer.com/timers/flip-timer',
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Any',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        description:
          'A retro split-flap countdown timer with a classic mechanical flip animation. Simple, clear and perfect for focus, study and presentations.',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://WebCountDownTimer.com/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Timers',
            item: 'https://WebCountDownTimer.com/tools',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Flip Timer',
            item: 'https://WebCountDownTimer.com/timers/flip-timer',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: allFaqs.map((item) => ({
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
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#110E0D] text-[#1E1917] dark:text-slate-100 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HERO BANNER WITH RETRO MECHANICAL SPLIT-FLAP DESK ILLUSTRATION */}
      <section className="relative overflow-hidden border-b border-[#EAE1D7] dark:border-[#28201E] bg-gradient-to-r from-[#FDFBF8] via-[#F9F3EC] to-[#EADACA] dark:from-[#161210] dark:via-[#1C1614] dark:to-[#281C16]">
        <div
          aria-hidden="true"
          className="hidden lg:flex absolute inset-y-0 right-0 w-[48%] items-center justify-end pr-10 pointer-events-none select-none overflow-hidden [mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.55)_32%,black_62%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.55)_32%,black_62%)]"
        >
          <div
            className="absolute inset-0 opacity-95"
            style={{
              background:
                'linear-gradient(90deg, rgba(74,42,24,0) 0%, rgba(74,42,24,0.85) 52%, rgba(36,19,10,0.96) 100%)',
            }}
          />
          <div className="absolute top-6 right-72 w-36 h-36 rounded-full bg-amber-400/25 blur-2xl" />
          <div className="absolute bottom-6 right-16 w-44 h-44 rounded-full bg-orange-400/20 blur-2xl" />
          <div className="absolute bottom-0 right-0 w-[90%] h-14 bg-gradient-to-b from-[#5A341B] to-[#2E180B] border-t border-amber-200/20" />

          <div className="relative z-10 flex flex-col items-center mr-6 transform -rotate-2">
            <div className="rounded-3xl p-3.5 bg-gradient-to-b from-[#2E2C2A] via-[#1C1A19] to-[#121110] border-2 border-[#524B45] shadow-[0_20px_45px_rgba(0,0,0,0.8)]">
              <div className="rounded-2xl bg-[#0A0908] px-4 py-3.5 flex items-center gap-2 border border-black shadow-inner">
                {['2', '5', ':', '0', '0'].map((ch, idx) =>
                  ch === ':' ? (
                    <div key={idx} className="flex flex-col gap-2 px-0.5">
                      <span className="w-2 h-2 rounded-full bg-stone-300" />
                      <span className="w-2 h-2 rounded-full bg-stone-300" />
                    </div>
                  ) : (
                    <div
                      key={idx}
                      className="relative w-[48px] h-[68px] rounded-lg bg-gradient-to-b from-[#252422] to-[#181715] border border-[#3B3734] flex items-center justify-center font-mono text-4xl font-bold text-[#F7F4EE] shadow-md"
                    >
                      {ch}
                      <span className="absolute inset-x-0 top-1/2 h-[2px] bg-black/90" />
                    </div>
                  )
                )}
              </div>
            </div>
            <div className="mt-[-4px] px-5 py-1 rounded-md bg-[#2A2016] border border-[#8C6D3F] text-[9px] font-serif tracking-[0.2em] text-[#E7C888] uppercase shadow-md">
              COUNTDOWN TIMER
            </div>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-9">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs text-[#5A4E4A] dark:text-slate-400 mb-3"
          >
            <Link href="/" className="hover:text-[#A91D22] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            <Link href="/tools" className="hover:text-[#A91D22] transition-colors">
              Timers
            </Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            <span className="font-semibold text-[#1E1917] dark:text-white">Flip Timer</span>
          </nav>

          <div className="max-w-2xl">
            <div className="text-xs font-extrabold tracking-[0.16em] uppercase text-[#A91D22] dark:text-rose-400 mb-1.5">
              FLIP TIMER
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold text-[#0E2338] dark:text-white tracking-tight leading-tight">
              Free Online Flip Timer
            </h1>
            <p className="mt-2.5 text-sm sm:text-base text-[#2F2825] dark:text-slate-300 leading-relaxed max-w-xl">
              A retro split-flap countdown timer with a classic mechanical flip animation. Simple,
              clear and perfect for focus, study and presentations.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-[#2B2220] dark:text-slate-200">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-[#A91D22] text-white flex items-center justify-center shadow-2xs">
                  <Calendar className="w-3.5 h-3.5" />
                </span>
                <span>Retro split-flap display</span>
              </div>
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#3B312E] dark:text-slate-300" />
                <span>Customizable timer</span>
              </div>
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-[#3B312E] dark:text-slate-300" />
                <span>Works on all devices</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#3B312E] dark:text-slate-300" />
                <span>Free to use</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-10">
        <FlipTimerComponent />

        {/* TOOL-SPECIFIC CONTENT (150-250 WORDS: USE CASES, HOW TO USE & 3 UNIQUE FAQS) + RELATED TOOLS */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-2">
          <div className="lg:col-span-8 rounded-3xl bg-white dark:bg-[#1A1514] border border-[#E6DFD5] dark:border-[#2E2523] p-6 sm:p-8">
            <ToolSpecificContentSection slug="flip-timer" toolName="Flip Timer" />
          </div>

          <aside className="lg:col-span-4 rounded-3xl bg-white dark:bg-[#1A1514] border border-[#E6DFD5] dark:border-[#2E2523] p-5">
            <h2 className="text-sm font-bold text-[#0E2338] dark:text-white mb-3.5">
              Related Tools
            </h2>
            <div className="space-y-2.5">
              {RELATED_TOOLS.map((tool) => (
                <Link
                  key={tool.name}
                  href={tool.href}
                  className="flex items-center gap-3 p-2.5 rounded-2xl border border-[#F0EAE1] dark:border-[#2C2422] hover:border-[#A91D22] dark:hover:border-rose-500/60 bg-[#FCFBF9] dark:bg-[#211B19] transition-all group"
                >
                  {tool.badge}
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#0E2338] dark:text-white group-hover:text-[#A91D22] dark:group-hover:text-rose-400 truncate transition-colors">
                      {tool.name}
                    </div>
                    <div className="text-[11px] text-[#5A4E4A] dark:text-slate-400 truncate">
                      {tool.desc}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}

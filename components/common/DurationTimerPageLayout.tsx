'use client';

import React from 'react';
import Link from 'next/link';
import type { DurationPageData } from '@/lib/duration-timers-data';
import CountdownTimerComponent from '@/components/tools/CountdownTimerComponent';
import SEOStructuredData from '@/components/common/SEOStructuredData';
import ToolSpecificContentSection from '@/components/common/ToolSpecificContentSection';
import { getToolSpecificContent } from '@/lib/tool-specific-content';
import {
  ArrowRight,
  Clock,
  Hourglass,
  Flame,
  RotateCcw,
} from 'lucide-react';

interface DurationTimerPageLayoutProps {
  data: DurationPageData;
}

export default function DurationTimerPageLayout({ data }: DurationTimerPageLayoutProps) {
  const specificContent = getToolSpecificContent(data.slug);
  const faqsForSchema = specificContent ? specificContent.faqs : data.faqs;

  const breadcrumbs = [
    { name: 'Home', item: 'https://WebCountDownTimer.com' },
    { name: 'Timers', item: 'https://WebCountDownTimer.com/category/timers' },
    { name: data.h1, item: `https://WebCountDownTimer.com/${data.slug}` },
  ];

  return (
    <div className="min-h-screen bg-[#F7F6F2] dark:bg-[#141816] text-[#252B27] dark:text-slate-100 transition-colors">
      <SEOStructuredData
        toolName={data.h1}
        description={data.metaDescription}
        url={`https://WebCountDownTimer.com/${data.slug}`}
        faqs={faqsForSchema}
        breadcrumbs={breadcrumbs}
        steps={data.howToUseSteps}
        applicationCategory="UtilitiesApplication"
      />

      {/* 1. BREADCRUMB BAR */}
      <nav
        aria-label="Breadcrumb"
        className="border-b border-[#E4E1D9] dark:border-[#262D28] bg-white/60 dark:bg-[#181D1A]/60"
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-3">
          <ol className="flex items-center flex-wrap gap-2 text-xs text-[#252B27]/70 dark:text-slate-400">
            <li>
              <Link href="/" className="hover:text-[#365C4B] dark:hover:text-[#5E917A] transition-colors">
                Home
              </Link>
            </li>
            <li className="text-[#252B27]/30 dark:text-slate-600">›</li>
            <li>
              <Link
                href="/category/timers"
                className="hover:text-[#365C4B] dark:hover:text-[#5E917A] transition-colors"
              >
                Timers
              </Link>
            </li>
            <li className="text-[#252B27]/30 dark:text-slate-600">›</li>
            <li className="text-[#252B27] dark:text-white font-medium">{data.h1}</li>
          </ol>
        </div>
      </nav>

      {/* 2. HERO & INTRO */}
      <section className="pt-8 pb-8 sm:pt-10 sm:pb-10 border-b border-[#E4E1D9] dark:border-[#262D28]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-[#B7804C] dark:text-[#cda06f] uppercase mb-1.5">
            <span>{data.tierBadge}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{data.totalSeconds.toLocaleString()} SECONDS</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-[54px] leading-[1.08] font-normal tracking-tight text-[#252B27] dark:text-white mb-4 text-balance">
            {data.h1}
          </h1>
          <div className="max-w-3xl text-base sm:text-lg text-[#252B27]/80 dark:text-slate-300 leading-relaxed">
            <p>{data.introParagraphs[0]}</p>
          </div>
        </div>
      </section>

      {/* 3. FUNCTIONAL TIMER AREA NEAR TOP */}
      <section className="py-10 sm:py-12 border-b border-[#E4E1D9] dark:border-[#262D28]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <CountdownTimerComponent
            key={data.slug}
            initialSeconds={data.totalSeconds}
            durationLabel={data.h1}
          />
        </div>
      </section>

      {/* 4. TOOL-SPECIFIC CONTENT (150-250 WORDS: REAL USE CASES, HOW TO USE & 3 UNIQUE FAQS) */}
      <section className="py-14 sm:py-16 border-b border-[#E4E1D9] dark:border-[#262D28]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 space-y-12">
          <ToolSpecificContentSection slug={data.slug} toolName={data.h1} />

          {/* Other Timer Durations */}
          <div id="other-timer-durations" className="pt-8 border-t border-[#E4E1D9] dark:border-[#262D28]">
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#252B27] dark:text-white mb-3">
              {data.tier === 'sprint'
                ? 'Adjacent Sprint & Rest Durations'
                : data.tier === 'tactical'
                ? 'Other Tactical Timer Durations'
                : 'Related Session & Exam Blocks'}
            </h2>
            <p className="text-sm sm:text-base text-[#252B27]/80 dark:text-slate-300 leading-relaxed mb-4">
              Need a slightly shorter or longer window? Jump straight to one of these pre-configured countdowns:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {data.relatedDurations.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/${rel.slug}`}
                  className="bg-white dark:bg-[#1A201C] border border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#365C4B] rounded-xl p-4 transition-all group flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-sm text-[#252B27] dark:text-white group-hover:text-[#365C4B] transition-colors">
                      {rel.label}
                    </div>
                    <div className="text-xs font-mono tabular-nums text-[#252B27]/60 dark:text-slate-400 mt-0.5">
                      {rel.description}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#365C4B] group-hover:translate-x-0.5 transition-transform" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. RELATED TOOLS */}
      <section className="py-14 sm:py-20 bg-white/40 dark:bg-[#181D1A]/40">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
            <div>
              <h2 className="font-serif text-3xl font-normal text-[#252B27] dark:text-white">
                Specialized Timing Instruments
              </h2>
              <p className="text-xs sm:text-sm text-[#252B27]/70 dark:text-slate-400 mt-1">
                Switch to a visual disappearing disk, multi-round HIIT programmer, or split-lap chronograph.
              </p>
            </div>
            <Link
              href="/tools"
              className="text-xs sm:text-sm font-semibold text-[#365C4B] dark:text-[#5E917A] hover:underline flex items-center gap-1"
            >
              <span>View All Tools</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                slug: 'countdown-timer',
                name: 'Countdown Timer',
                desc: 'Set any custom hours, minutes, and seconds with loop and alarm controls.',
                icon: <Hourglass className="w-5 h-5" />,
              },
              {
                slug: 'visual-timer',
                name: 'Visual Timer',
                desc: 'See remaining time shrink visually with circular, bar, and hourglass modes.',
                icon: <Clock className="w-5 h-5" />,
              },
              {
                slug: 'stopwatch',
                name: 'Online Stopwatch',
                desc: 'Measure elapsed time with millisecond precision and split lap recording.',
                icon: <RotateCcw className="w-5 h-5" />,
              },
              {
                slug: 'interval-timer',
                name: 'Interval Timer',
                desc: 'Configure custom work and rest rounds for HIIT, Tabata, and study blocks.',
                icon: <Flame className="w-5 h-5" />,
              },
            ].map((tool) => (
              <div
                key={tool.slug}
                className="bg-white dark:bg-[#1A201C] border border-[#E4E1D9] dark:border-[#2D352F] rounded-2xl p-5 hover:border-[#365C4B] transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#E7EDE7] dark:bg-[#252E28] text-[#365C4B] dark:text-[#5E917A] flex items-center justify-center mb-3.5">
                    {tool.icon}
                  </div>
                  <h3 className="font-bold text-base text-[#252B27] dark:text-white mb-1 group-hover:text-[#365C4B] transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-[#252B27]/70 dark:text-slate-400 leading-relaxed mb-4">
                    {tool.desc}
                  </p>
                </div>
                <Link
                  href={`/${tool.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#365C4B] dark:text-[#5E917A] group-hover:translate-x-1 transition-transform"
                >
                  <span>Open {tool.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

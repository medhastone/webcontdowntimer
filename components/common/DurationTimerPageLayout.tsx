'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { DurationPageData } from '@/lib/duration-timers-data';
import CountdownTimerComponent from '@/components/tools/CountdownTimerComponent';
import SEOStructuredData from '@/components/common/SEOStructuredData';
import InformationProvenanceBox from '@/components/common/InformationProvenanceBox';
import {
  ChevronRight,
  Plus,
  Minus,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  Clock,
  Hourglass,
  Flame,
  RotateCcw,
  BookOpen,
} from 'lucide-react';

interface DurationTimerPageLayoutProps {
  data: DurationPageData;
}

export default function DurationTimerPageLayout({ data }: DurationTimerPageLayoutProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [activeTocIndex, setActiveTocIndex] = useState<number>(0);

  const breadcrumbs = [
    { name: 'Home', item: 'https://WebCountDownTimer.com/' },
    { name: 'Timers', item: 'https://WebCountDownTimer.com/category/timers' },
    { name: data.h1, item: `https://WebCountDownTimer.com/${data.slug}` },
  ];

  // Dynamic TOC order matching each tier's distinct section sequence
  const tocItems =
    data.tier === 'sprint'
      ? [
          { label: data.pacingTitle, id: 'pacing-splits' },
          { label: data.whenToUseTitle, id: 'when-to-use' },
          { label: data.comparisonTableTitle, id: 'comparison-matrix' },
          { label: data.howToUseTitle, id: 'how-to-use' },
          { label: 'Adjacent Sprint Durations', id: 'other-timer-durations' },
          { label: 'Frequently Asked Questions', id: 'frequently-asked-questions' },
        ]
      : data.tier === 'tactical'
      ? [
          { label: data.whenToUseTitle, id: 'when-to-use' },
          { label: data.pacingTitle, id: 'pacing-splits' },
          { label: data.howToUseTitle, id: 'how-to-use' },
          { label: data.comparisonTableTitle, id: 'comparison-matrix' },
          { label: 'Other Timer Durations', id: 'other-timer-durations' },
          { label: 'Frequently Asked Questions', id: 'frequently-asked-questions' },
        ]
      : [
          { label: data.pacingTitle, id: 'pacing-splits' },
          { label: data.comparisonTableTitle, id: 'comparison-matrix' },
          { label: data.whenToUseTitle, id: 'when-to-use' },
          { label: data.howToUseTitle, id: 'how-to-use' },
          { label: 'Related Session Blocks', id: 'other-timer-durations' },
          { label: 'Frequently Asked Questions', id: 'frequently-asked-questions' },
        ];

  const handleTocClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string,
    index: number
  ) => {
    e.preventDefault();
    setActiveTocIndex(index);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', `#${sectionId}`);
    }
  };

  // Reusable Pacing Split Block
  const pacingSection = (
    <div
      id="pacing-splits"
      className="scroll-mt-28 rounded-2xl border border-[#E4E1D9] dark:border-[#2D352F] bg-white dark:bg-[#1A201C] p-6 sm:p-7 space-y-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E4E1D9] dark:border-[#2D352F] pb-4">
        <div>
          <span className="text-[11px] font-bold tracking-widest text-[#365C4B] dark:text-[#5E917A] uppercase block mb-1">
            {data.tierBadge}
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#252B27] dark:text-white text-balance">
            {data.pacingTitle}
          </h2>
        </div>
        <Clock className="w-5 h-5 text-[#365C4B] dark:text-[#5E917A] shrink-0" />
      </div>

      {/* Proportional Phase Split Bar */}
      <div className="w-full h-3 rounded-full overflow-hidden flex bg-[#E4E1D9] dark:bg-[#2D352F]">
        {data.pacingSplits.map((split, idx) => {
          const colors = ['bg-[#365C4B]', 'bg-[#B7804C]', 'bg-[#5E917A]'];
          return (
            <div
              key={idx}
              style={{ width: `${split.sharePercent}%` }}
              className={`${colors[idx % colors.length]} h-full`}
              title={`${split.phase} (${split.sharePercent}%)`}
            />
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.pacingSplits.map((split, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-[#E4E1D9] dark:border-[#2D352F] bg-[#FAF9F6] dark:bg-[#161B18] p-4 space-y-1.5"
          >
            <div className="flex items-center justify-between gap-2 font-mono tabular-nums text-xs text-[#252B27]/60 dark:text-slate-400">
              <span>{split.timeWindow}</span>
              <span>{split.sharePercent}%</span>
            </div>
            <h3 className="font-bold text-sm text-[#252B27] dark:text-white">
              {split.phase}
            </h3>
            <p className="text-xs text-[#252B27]/80 dark:text-slate-300 leading-relaxed">
              {split.practitionerAction}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  // Reusable Real-World Scenarios Block
  const whenToUseSection = (
    <div id="when-to-use" className="scroll-mt-28">
      <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#252B27] dark:text-white mb-3 text-balance">
        {data.whenToUseTitle}
      </h2>
      <p className="text-sm sm:text-base text-[#252B27]/80 dark:text-slate-300 leading-relaxed mb-5">
        {data.whenToUseIntro}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {data.whenToUseExamples.map((ex, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-[#1A201C] border border-[#E4E1D9] dark:border-[#2D352F] rounded-2xl p-5"
          >
            <h3 className="font-bold text-sm sm:text-base text-[#252B27] dark:text-white mb-1.5">
              {ex.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#252B27]/75 dark:text-slate-400 leading-relaxed">
              {ex.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  // Reusable Tier-Specific Comparison Matrix Table
  const comparisonTableSection = (
    <div id="comparison-matrix" className="scroll-mt-28 space-y-3.5">
      <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#252B27] dark:text-white text-balance">
        {data.comparisonTableTitle}
      </h2>
      <div className="rounded-2xl border border-[#E4E1D9] dark:border-[#2D352F] overflow-hidden bg-white dark:bg-[#1A201C]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm tabular-nums">
            <thead>
              <tr className="bg-[#365C4B] text-white">
                <th scope="col" className="py-3.5 px-4 font-semibold">
                  {data.comparisonColumns[0]}
                </th>
                <th scope="col" className="py-3.5 px-4 font-semibold">
                  {data.comparisonColumns[1]}
                </th>
                <th scope="col" className="py-3.5 px-4 font-semibold">
                  {data.comparisonColumns[2]}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E1D9] dark:divide-[#2D352F]">
              {data.comparisonRows.map((row, idx) => (
                <tr
                  key={idx}
                  className={
                    idx % 2 === 0
                      ? 'bg-transparent'
                      : 'bg-[#F7F6F2]/55 dark:bg-[#1D2420]/50'
                  }
                >
                  <td className="py-3.5 px-4 font-semibold text-[#252B27] dark:text-white">
                    {row[0]}
                  </td>
                  <td className="py-3.5 px-4 font-mono tabular-nums text-[#252B27]/85 dark:text-slate-300">
                    {row[1]}
                  </td>
                  <td className="py-3.5 px-4 text-[#252B27]/80 dark:text-slate-300">
                    {row[2]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Reusable How to Use + Practitioner Field Note Block
  const howToUseAndFieldNoteSection = (
    <div id="how-to-use" className="scroll-mt-28 space-y-6">
      <div>
        <span className="text-[11px] font-bold tracking-widest text-[#365C4B] dark:text-[#5E917A] uppercase block mb-2">
          PRACTITIONER EXECUTION CHECKLIST
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#252B27] dark:text-white mb-4 text-balance">
          {data.howToUseTitle}
        </h2>
        <ol className="space-y-3">
          {data.howToUseSteps.map((step, idx) => (
            <li
              key={idx}
              className="flex items-start gap-3 text-sm sm:text-base text-[#252B27]/80 dark:text-slate-300"
            >
              <span className="w-6 h-6 rounded-full bg-[#365C4B] text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Practitioner Field Note Box */}
      <div className="rounded-2xl border border-[#E8DEC8] dark:border-[#353E37] bg-[#FAF6F0] dark:bg-[#202521] p-5 sm:p-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#B7804C] dark:text-[#cda06f]">
          <BookOpen className="w-4 h-4 shrink-0" />
          <span>{data.practitionerFieldNote.title}</span>
        </div>
        <p className="text-xs sm:text-sm text-[#252B27]/85 dark:text-slate-200 leading-relaxed">
          {data.practitionerFieldNote.body}
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F7F6F2] dark:bg-[#141816] text-[#252B27] dark:text-slate-100 transition-colors">
      <SEOStructuredData
        toolName={data.h1}
        description={data.metaDescription}
        url={`https://WebCountDownTimer.com/${data.slug}`}
        faqs={data.faqs}
        breadcrumbs={breadcrumbs}
        steps={data.howToUseSteps}
        categoryLabel="Online Countdown Timers"
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
          <div className="max-w-3xl space-y-2.5 text-base sm:text-lg text-[#252B27]/80 dark:text-slate-300 leading-relaxed">
            {data.introParagraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
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

      {/* 4. TIER-DIVERSIFIED EDITORIAL GUIDE (3 Distinct Layout Sequences by Duration Tier) */}
      <section className="py-16 sm:py-20 border-b border-[#E4E1D9] dark:border-[#262D28]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            {/* Left Sidebar */}
            <aside className="lg:col-span-4 space-y-6">
              <div className="sticky top-24 space-y-6">
                <div className="bg-white dark:bg-[#1A201C] border border-[#E4E1D9] dark:border-[#2D352F] rounded-2xl p-6">
                  <span className="text-[11px] font-bold tracking-widest text-[#252B27]/60 dark:text-slate-400 uppercase block mb-1">
                    On This Page
                  </span>
                  <div className="font-serif text-lg font-bold text-[#252B27] dark:text-white mb-4">
                    {data.h1} Playbook
                  </div>
                  <nav aria-label="Table of contents">
                    <ul className="space-y-2 text-xs sm:text-sm">
                      {tocItems.map((item, idx) => {
                        const isActive = activeTocIndex === idx;
                        return (
                          <li key={item.id}>
                            <a
                              href={`#${item.id}`}
                              onClick={(e) => handleTocClick(e, item.id, idx)}
                              className={`flex items-center gap-2 py-1.5 px-2.5 -mx-2 rounded-lg transition-colors cursor-pointer ${
                                isActive
                                  ? 'font-bold text-[#252B27] dark:text-white bg-[#E7EDE7]/80 dark:bg-[#252E28]/80 border border-[#C9D6CA] dark:border-[#35443B]'
                                  : 'text-[#252B27]/80 dark:text-slate-300 hover:text-[#365C4B] dark:hover:text-[#5E917A] hover:bg-[#F7F6F2] dark:hover:bg-[#222924]'
                              }`}
                            >
                              {!isActive && (
                                <ChevronRight className="w-3.5 h-3.5 text-[#365C4B] shrink-0" />
                              )}
                              <span>{item.label}</span>
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </nav>
                </div>

                {/* Quick Conversion Summary Box */}
                <div className="bg-[#FAF6F0] dark:bg-[#202521] border border-[#E8DEC8] dark:border-[#353E37] rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#B7804C]">
                    <Lightbulb className="w-4 h-4 fill-current" />
                    <span>Exact Unit Conversions</span>
                  </div>
                  <dl className="space-y-2 text-xs sm:text-sm tabular-nums">
                    <div className="flex justify-between">
                      <dt className="text-[#252B27]/70 dark:text-slate-400">Preset Duration:</dt>
                      <dd className="font-bold text-[#252B27] dark:text-white">{data.unitLabel}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-[#252B27]/70 dark:text-slate-400">Total Seconds:</dt>
                      <dd className="font-mono font-semibold text-[#252B27] dark:text-white">
                        {data.totalSeconds.toLocaleString()} sec
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-[#252B27]/70 dark:text-slate-400">Halfway Mark (50%):</dt>
                      <dd className="font-mono font-semibold text-[#252B27] dark:text-white">
                        {Math.round(data.totalSeconds / 2).toLocaleString()} sec
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-[#252B27]/70 dark:text-slate-400">In Minutes:</dt>
                      <dd className="font-mono font-semibold text-[#252B27] dark:text-white">
                        {Number((data.totalSeconds / 60).toFixed(2))} min
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-[#252B27]/70 dark:text-slate-400">Payroll Decimal Hours:</dt>
                      <dd className="font-mono font-semibold text-[#252B27] dark:text-white">
                        {Number((data.totalSeconds / 3600).toFixed(3))} hrs
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </aside>

            {/* Right Article Body: Section sequence dynamically varies by Tier */}
            <article className="lg:col-span-8 max-w-3xl space-y-11">
              {data.tier === 'sprint' && (
                <>
                  {pacingSection}
                  {whenToUseSection}
                  {comparisonTableSection}
                  {howToUseAndFieldNoteSection}
                </>
              )}

              {data.tier === 'tactical' && (
                <>
                  {whenToUseSection}
                  {pacingSection}
                  {howToUseAndFieldNoteSection}
                  {comparisonTableSection}
                </>
              )}

              {data.tier === 'deep-block' && (
                <>
                  {pacingSection}
                  {comparisonTableSection}
                  {whenToUseSection}
                  {howToUseAndFieldNoteSection}
                </>
              )}

              {/* Built-In Controls Summary */}
              <div id="timer-features" className="scroll-mt-28">
                <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#252B27] dark:text-white mb-4">
                  {data.featuresTitle}
                </h2>
                <ul className="space-y-2.5">
                  {data.featuresList.map((feat, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-sm sm:text-base text-[#252B27]/80 dark:text-slate-300"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#365C4B] dark:text-[#5E917A] mt-1 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Other Timer Durations */}
              <div id="other-timer-durations" className="scroll-mt-28">
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

              {/* Information Provenance, Calculation Method & Operating Limitations */}
              <InformationProvenanceBox
                slug={data.slug}
                toolName={data.h1}
                categorySlug="timers"
              />
            </article>
          </div>
        </div>
      </section>

      {/* 5. RELATED TOOLS */}
      <section className="py-14 sm:py-20 border-b border-[#E4E1D9] dark:border-[#262D28] bg-white/40 dark:bg-[#181D1A]/40">
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
              <span>View All 49 Tools</span>
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

      {/* 6. FREQUENTLY ASKED QUESTIONS */}
      <section
        id="frequently-asked-questions"
        className="py-16 sm:py-24 bg-[#E7EDE7]/50 dark:bg-[#181F1B] scroll-mt-24"
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="mb-10">
            <span className="text-[11px] font-bold tracking-widest text-[#365C4B] dark:text-[#5E917A] uppercase block mb-1.5">
              PRACTITIONER Q&A
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#252B27] dark:text-white">
              Common Questions About the {data.h1}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            {data.faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-[#1A201C] border border-[#E4E1D9] dark:border-[#2D352F] rounded-xl overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-bold text-sm text-[#252B27] dark:text-white hover:text-[#365C4B] dark:hover:text-[#5E917A] transition-colors cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <Minus className="w-4 h-4 text-[#365C4B] shrink-0" />
                    ) : (
                      <Plus className="w-4 h-4 text-[#252B27]/50 dark:text-slate-400 shrink-0" />
                    )}
                  </button>
                  <div
                    className={
                      isOpen
                        ? 'px-5 pb-4 pt-2 text-xs sm:text-sm text-[#252B27]/75 dark:text-slate-300 leading-relaxed border-t border-[#E4E1D9]/60 dark:border-[#2D352F] block'
                        : 'hidden'
                    }
                  >
                    {faq.answer}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

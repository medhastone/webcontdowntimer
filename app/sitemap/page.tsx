import type { Metadata } from 'next';
import Link from 'next/link';
import {
  TOOLS_REGISTRY,
  VISUAL_TIMERS_SUBPATH_SLUGS,
  getToolCanonicalPath,
} from '@/lib/tools-registry';
import { getDurationPageData, APPROVED_DURATION_SLUGS } from '@/lib/duration-timers-data';

export const metadata: Metadata = {
  title: 'HTML Sitemap – Complete Directory of Time Tools | WebCountDownTimer',
  description:
    'Browse the complete HTML sitemap of WebCountDownTimer.com, including all countdown timers, visual and sensory timers, stage tools, world clocks, calculators, and preset duration timers.',
  alternates: {
    canonical: 'https://WebCountDownTimer.com/sitemap',
  },
};

export default function HtmlSitemapPage() {
  const visualAndSensoryTools = TOOLS_REGISTRY.filter((t) =>
    VISUAL_TIMERS_SUBPATH_SLUGS.has(t.slug)
  );
  const coreTimerTools = TOOLS_REGISTRY.filter(
    (t) =>
      !VISUAL_TIMERS_SUBPATH_SLUGS.has(t.slug) &&
      (t.category === 'everyday' || t.category === 'productivity')
  );
  const stageAndClassroomTools = TOOLS_REGISTRY.filter(
    (t) => !VISUAL_TIMERS_SUBPATH_SLUGS.has(t.slug) && t.category === 'stage'
  );
  const worldAndCalculatorTools = TOOLS_REGISTRY.filter(
    (t) => !VISUAL_TIMERS_SUBPATH_SLUGS.has(t.slug) && t.category === 'world'
  );

  const durationItems = APPROVED_DURATION_SLUGS.map((slug) => ({
    slug,
    label: getDurationPageData(slug)?.h1 || slug,
  }));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="space-y-3 border-b border-[#E4E1D9] dark:border-[#262D28] pb-8">
        <span className="text-xs font-mono uppercase tracking-wider text-[#365C4B] dark:text-[#5E917A]">
          Site Architecture &amp; Index
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#252B27] dark:text-white">
          Complete HTML Sitemap
        </h1>
        <p className="text-base text-[#252B27]/80 dark:text-slate-300 max-w-3xl leading-relaxed">
          Every public tool, category hub, preset countdown duration, and documentation page on{' '}
          <strong>WebCountDownTimer.com</strong>, organized by functional category. Looking for the
          machine-readable XML feed? View{' '}
          <a
            href="/sitemap.xml"
            className="underline font-semibold text-[#365C4B] dark:text-[#5E917A]"
          >
            /sitemap.xml
          </a>{' '}
          or{' '}
          <a
            href="/llms.txt"
            className="underline font-semibold text-[#365C4B] dark:text-[#5E917A]"
          >
            /llms.txt
          </a>
          .
        </p>
      </div>

      {/* Category Hubs & Core Pages */}
      <section className="space-y-4">
        <h2 className="font-serif text-2xl font-bold text-[#252B27] dark:text-white">
          1. Category Hubs &amp; Platform Pages
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { href: '/', label: 'Homepage — WebCountDownTimer' },
            { href: '/tools', label: 'All Time Tools Directory' },
            { href: '/category/timers', label: 'Everyday & Online Timers Hub' },
            { href: '/category/events', label: 'Presentation, Stage & Event Timers Hub' },
            { href: '/education', label: 'Education & Classroom Timers Hub' },
            { href: '/category/productivity', label: 'Productivity, Focus & Study Timers Hub' },
            { href: '/category/fitness', label: 'Fitness, HIIT & Wellness Timers Hub' },
            { href: '/category/world', label: 'World Clock & Time Calculators Hub' },
            { href: '/category/calculators', label: 'Date & Time Calculators Hub' },
            { href: '/guides', label: 'Guides & Timing Playbooks' },
            { href: '/about', label: 'About & Calculation Methodology' },
            { href: '/accessibility', label: 'Accessibility Statement (WCAG 2.2 AA)' },
            { href: '/privacy', label: 'Privacy Policy' },
            { href: '/terms', label: 'Terms of Use' },
            { href: '/contact', label: 'Contact & Support' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="p-3.5 rounded-xl bg-white dark:bg-[#19201C] border border-[#E4E1D9] dark:border-[#2A342E] hover:border-[#365C4B] dark:hover:border-[#5E917A] text-sm font-medium text-[#252B27] dark:text-slate-200 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Visual & Sensory Timers */}
      <section className="space-y-4">
        <h2 className="font-serif text-2xl font-bold text-[#252B27] dark:text-white">
          2. Visual, Sensory &amp; Split-Flap Timers ({visualAndSensoryTools.length})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {visualAndSensoryTools.map((tool) => (
            <Link
              key={tool.slug}
              href={getToolCanonicalPath(tool.slug)}
              className="p-3.5 rounded-xl bg-white dark:bg-[#19201C] border border-[#E4E1D9] dark:border-[#2A342E] hover:border-[#365C4B] dark:hover:border-[#5E917A] transition-colors"
            >
              <div className="text-sm font-bold text-[#252B27] dark:text-white">{tool.name}</div>
              <div className="text-xs text-[#252B27]/70 dark:text-slate-400 line-clamp-1 mt-0.5">
                {tool.description}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Core Everyday, Focus & Fitness Timers */}
      <section className="space-y-4">
        <h2 className="font-serif text-2xl font-bold text-[#252B27] dark:text-white">
          3. Core Countdown, Focus, Kitchen &amp; Fitness Timers ({coreTimerTools.length})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {coreTimerTools.map((tool) => (
            <Link
              key={tool.slug}
              href={getToolCanonicalPath(tool.slug)}
              className="p-3.5 rounded-xl bg-white dark:bg-[#19201C] border border-[#E4E1D9] dark:border-[#2A342E] hover:border-[#365C4B] dark:hover:border-[#5E917A] transition-colors"
            >
              <div className="text-sm font-bold text-[#252B27] dark:text-white">{tool.name}</div>
              <div className="text-xs text-[#252B27]/70 dark:text-slate-400 line-clamp-1 mt-0.5">
                {tool.description}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Stage, Presentation & Classroom Tools */}
      <section className="space-y-4">
        <h2 className="font-serif text-2xl font-bold text-[#252B27] dark:text-white">
          4. Stage, Presentation &amp; Classroom Tools ({stageAndClassroomTools.length})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {stageAndClassroomTools.map((tool) => (
            <Link
              key={tool.slug}
              href={getToolCanonicalPath(tool.slug)}
              className="p-3.5 rounded-xl bg-white dark:bg-[#19201C] border border-[#E4E1D9] dark:border-[#2A342E] hover:border-[#365C4B] dark:hover:border-[#5E917A] transition-colors"
            >
              <div className="text-sm font-bold text-[#252B27] dark:text-white">{tool.name}</div>
              <div className="text-xs text-[#252B27]/70 dark:text-slate-400 line-clamp-1 mt-0.5">
                {tool.description}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* World Clock, Time Zones & Calculators */}
      <section className="space-y-4">
        <h2 className="font-serif text-2xl font-bold text-[#252B27] dark:text-white">
          5. World Clock, Time Zones &amp; Date/Time Calculators ({worldAndCalculatorTools.length})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {worldAndCalculatorTools.map((tool) => (
            <Link
              key={tool.slug}
              href={getToolCanonicalPath(tool.slug)}
              className="p-3.5 rounded-xl bg-white dark:bg-[#19201C] border border-[#E4E1D9] dark:border-[#2A342E] hover:border-[#365C4B] dark:hover:border-[#5E917A] transition-colors"
            >
              <div className="text-sm font-bold text-[#252B27] dark:text-white">{tool.name}</div>
              <div className="text-xs text-[#252B27]/70 dark:text-slate-400 line-clamp-1 mt-0.5">
                {tool.description}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Preset Duration Countdown Timers */}
      <section className="space-y-4">
        <h2 className="font-serif text-2xl font-bold text-[#252B27] dark:text-white">
          6. Preset Duration Countdown Timers ({durationItems.length})
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {durationItems.map((item) => (
            <Link
              key={item.slug}
              href={`/${item.slug}`}
              className="p-3 rounded-xl bg-white dark:bg-[#19201C] border border-[#E4E1D9] dark:border-[#2A342E] hover:border-[#365C4B] dark:hover:border-[#5E917A] text-sm font-medium text-[#252B27] dark:text-slate-200 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

import { buildPageMetadata } from '@/lib/seo-metadata';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  TOOLS_REGISTRY,
  VISUAL_TIMERS_SUBPATH_SLUGS,
  getToolCanonicalPath,
} from '@/lib/tools-registry';
import { getDurationPageData, APPROVED_DURATION_SLUGS } from '@/lib/duration-timers-data';
import BreadcrumbJsonLd from '@/components/common/BreadcrumbJsonLd';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/sitemap');
}

export default function HtmlSitemapPage() {
  const publicSpeakingAndEventsSlugs = new Set([
    'stage-timer',
    'presentation-timer',
    'speaker-timer',
    'debate-timer',
    'toastmasters-timer',
    'sermon-timer',
    'webinar-timer',
    'speech-time-calculator',
    'event-countdown-timer',
  ]);

  const educationAndClassroomSlugs = new Set([
    'classroom-timer',
    'classroom-noise-meter',
    'random-name-picker',
    'random-group-generator',
    'quiz-timer',
    'classroom-scoreboard',
    'bingo-caller',
    'seating-chart-maker',
  ]);

  const businessAndProductivitySlugs = new Set([
    'pomodoro-timer',
    'study-timer',
    'reading-timer',
    'break-timer',
    'eye-break-timer',
    'meeting-planner',
    'time-card-calculator',
    'overtime-calculator',
  ]);

  const fitnessAndWellnessSlugs = new Set([
    'interval-timer',
    'multi-stopwatch',
    'tabata-timer',
    'boxing-timer',
    'meditation-timer',
    'breathing-timer',
    'chess-clock',
  ]);

  const publicSpeakingAndEventTools = TOOLS_REGISTRY.filter((t) =>
    publicSpeakingAndEventsSlugs.has(t.slug)
  );
  const educationAndClassroomTools = TOOLS_REGISTRY.filter((t) =>
    educationAndClassroomSlugs.has(t.slug)
  );
  const businessAndProductivityTools = TOOLS_REGISTRY.filter((t) =>
    businessAndProductivitySlugs.has(t.slug)
  );
  const fitnessAndWellnessTools = TOOLS_REGISTRY.filter((t) =>
    fitnessAndWellnessSlugs.has(t.slug)
  );
  const visualAndSensoryTools = TOOLS_REGISTRY.filter((t) =>
    VISUAL_TIMERS_SUBPATH_SLUGS.has(t.slug)
  );
  const worldAndCalculatorTools = TOOLS_REGISTRY.filter(
    (t) =>
      t.category === 'world' &&
      !businessAndProductivitySlugs.has(t.slug) &&
      !publicSpeakingAndEventsSlugs.has(t.slug)
  );
  const everydayCoreTools = TOOLS_REGISTRY.filter(
    (t) =>
      !publicSpeakingAndEventsSlugs.has(t.slug) &&
      !educationAndClassroomSlugs.has(t.slug) &&
      !businessAndProductivitySlugs.has(t.slug) &&
      !fitnessAndWellnessSlugs.has(t.slug) &&
      !VISUAL_TIMERS_SUBPATH_SLUGS.has(t.slug) &&
      !worldAndCalculatorTools.some((w) => w.slug === t.slug)
  );

  const durationItems = APPROVED_DURATION_SLUGS.map((slug) => ({
    slug,
    label: getDurationPageData(slug)?.h1 || slug,
  }));

  const toolGroups = [
    {
      title: '2. Public Speaking, Stage & Event Timers',
      hubHref: '/category/events',
      hubLabel: 'Explore Public Speaking & Event Timers Hub →',
      tools: publicSpeakingAndEventTools,
    },
    {
      title: '3. Education & Classroom Management Timers',
      hubHref: '/category/education',
      hubLabel: 'Explore Education & Classroom Timers Hub →',
      tools: educationAndClassroomTools,
    },
    {
      title: '4. Business, Productivity & Focus Timers',
      hubHref: '/category/productivity',
      hubLabel: 'Explore Business & Productivity Timers Hub →',
      tools: businessAndProductivityTools,
    },
    {
      title: '5. Fitness, HIIT, Combat & Mindful Timers',
      hubHref: '/category/fitness',
      hubLabel: 'Explore Fitness & Wellness Timers Hub →',
      tools: fitnessAndWellnessTools,
    },
    {
      title: '6. Everyday, Kitchen & Utility Countdown Timers',
      hubHref: '/category/timers',
      hubLabel: 'Explore Everyday Online Timers Hub →',
      tools: everydayCoreTools,
    },
    {
      title: '7. Visual, Sensory & Split-Flap Timers',
      hubHref: '/category/timers',
      hubLabel: 'Explore Visual & Sensory Timers →',
      tools: visualAndSensoryTools,
    },
    {
      title: '8. World Clock, Time Zones & Date/Time Calculators',
      hubHref: '/category/world',
      hubLabel: 'Explore World Clock & Calculators Hub →',
      tools: worldAndCalculatorTools,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'HTML Sitemap', path: '/sitemap' },
        ]}
      />
      <div className="space-y-3 border-b border-[#E4E1D9] dark:border-[#262D28] pb-8">
        <span className="text-xs font-mono uppercase tracking-wider text-[#365C4B] dark:text-[#5E917A]">
          Site Architecture &amp; Index (Max Click Depth ≤ 2)
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#252B27] dark:text-white">
          Complete HTML Sitemap
        </h1>
        <p className="text-base text-[#252B27]/80 dark:text-slate-300 max-w-3xl leading-relaxed">
          Every public countdown tool, audience category hub, preset duration timer, and guide on{' '}
          <strong>WebCountDownTimer.com</strong> rendered with standard crawlable{' '}
          <code>&lt;ul&gt;</code> and <code>&lt;a href&gt;</code> links. Looking for the
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

      {/* 1. Category Hubs & Core Platform Pages */}
      <section className="space-y-4">
        <h2 className="font-serif text-2xl font-bold text-[#252B27] dark:text-white">
          1. Category Hubs &amp; Core Platform Pages
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 list-none p-0 m-0">
          {[
            { href: '/', label: 'Homepage — WebCountDownTimer' },
            { href: '/tools', label: 'All Time Tools Directory (/tools)' },
            { href: '/category/events', label: 'Public Speaking, Stage & Event Timers Hub' },
            { href: '/category/education', label: 'Education & Classroom Timers Hub' },
            { href: '/category/productivity', label: 'Business, Focus & Study Timers Hub' },
            { href: '/category/fitness', label: 'Fitness, HIIT & Wellness Timers Hub' },
            { href: '/category/timers', label: 'Everyday & Visual Timers Hub' },
            { href: '/category/world', label: 'World Clock & Time Zones Hub' },
            { href: '/category/calculators', label: 'Date, Time & Payroll Calculators Hub' },
            { href: '/guides', label: 'Guides & Timing Playbooks' },
            {
              href: '/guides/how-accurate-online-timers-work',
              label: 'How Accurate Online Timers Work — Engineering Guide',
            },
            { href: '/about', label: 'About & Calculation Methodology' },
            { href: '/accessibility', label: 'Accessibility Statement (WCAG 2.2 AA)' },
            { href: '/privacy', label: 'Privacy Policy' },
            { href: '/terms', label: 'Terms of Use' },
            { href: '/contact', label: 'Contact & Support' },
          ].map((item) => (
            <li key={item.href}>
              <Link prefetch={false}
                href={item.href}
                className="block p-3.5 rounded-xl bg-white dark:bg-[#19201C] border border-[#E4E1D9] dark:border-[#2A342E] hover:border-[#365C4B] dark:hover:border-[#5E917A] text-sm font-medium text-[#252B27] dark:text-slate-200 transition-colors"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Audience-Grouped Tool Lists (Semantic <ul><li><a href>) */}
      {toolGroups.map((group) => (
        <section key={group.title} className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <h2 className="font-serif text-2xl font-bold text-[#252B27] dark:text-white">
              {group.title} ({group.tools.length})
            </h2>
            <Link prefetch={false}
              href={group.hubHref}
              className="text-xs font-bold uppercase tracking-wider text-[#365C4B] dark:text-[#5E917A] hover:underline"
            >
              {group.hubLabel}
            </Link>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 list-none p-0 m-0">
            {group.tools.map((tool) => (
              <li key={tool.slug}>
                <Link prefetch={false}
                  href={getToolCanonicalPath(tool.slug)}
                  className="block p-3.5 rounded-xl bg-white dark:bg-[#19201C] border border-[#E4E1D9] dark:border-[#2A342E] hover:border-[#365C4B] dark:hover:border-[#5E917A] transition-colors"
                >
                  <div className="text-sm font-bold text-[#252B27] dark:text-white">
                    {tool.name}
                  </div>
                  <div className="text-xs text-[#252B27]/70 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {tool.description}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {/* Preset Duration Countdown Timers */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <h2 className="font-serif text-2xl font-bold text-[#252B27] dark:text-white">
            9. Preset Duration Countdown Timers ({durationItems.length})
          </h2>
          <Link prefetch={false}
            href="/category/timers"
            className="text-xs font-bold uppercase tracking-wider text-[#365C4B] dark:text-[#5E917A] hover:underline"
          >
            Linked from Everyday Timers Hub →
          </Link>
        </div>
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 list-none p-0 m-0">
          {durationItems.map((item) => (
            <li key={item.slug}>
              <Link prefetch={false}
                href={`/${item.slug}`}
                className="block p-3 rounded-xl bg-white dark:bg-[#19201C] border border-[#E4E1D9] dark:border-[#2A342E] hover:border-[#365C4B] dark:hover:border-[#5E917A] text-sm font-medium text-[#252B27] dark:text-slate-200 transition-colors"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

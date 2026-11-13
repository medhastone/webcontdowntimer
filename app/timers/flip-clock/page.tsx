import { buildPageMetadata } from '@/lib/seo-metadata';
import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  ChevronRight,
  Columns2,
  Settings,
  Monitor,
  CheckCircle2,
  Hourglass,
  CircleDot,
  Timer,
  Calendar,
  Globe,
} from 'lucide-react';
import FlipClockComponent from '@/components/tools/FlipClockComponent';
import ToolSpecificContentSection from '@/components/common/ToolSpecificContentSection';
import { getToolSpecificContent } from '@/lib/tool-specific-content';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/timers/flip-clock');
}

const RELATED_TOOLS = [
  {
    title: 'Flip Timer',
    desc: 'A retro split-flap countdown.',
    href: '/timers/flip-timer',
    icon: 'hourglass',
  },
  {
    title: 'Visual Timer',
    desc: 'A simple visual countdown.',
    href: '/visual-timer',
    icon: 'timer',
  },
  {
    title: 'Progress Timer',
    desc: 'A visual progress bar timer.',
    href: '/timers/progress-timer',
    icon: 'progress',
  },
  {
    title: 'Stopwatch',
    desc: 'Measure elapsed time with precision.',
    href: '/stopwatch',
    icon: 'stopwatch',
  },
  {
    title: 'Countdown Timer',
    desc: 'A simple numeric countdown.',
    href: '/countdown-timer',
    icon: 'calendar12',
  },
  {
    title: 'World Clock',
    desc: 'Check the time in multiple cities.',
    href: '/world-clock',
    icon: 'clock',
  },
  {
    title: 'Calendar',
    desc: 'View dates, plan events and stay organized.',
    href: '/date-calculator',
    icon: 'calendar',
  },
];

export default function FlipClockPage() {
  const specificContent = getToolSpecificContent('flip-clock');
  const faqs = specificContent ? specificContent.faqs : [];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Free Online Flip Clock',
        url: 'https://WebCountDownTimer.com/timers/flip-clock',
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'All',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        description:
          'A realistic retro split-flap clock with live time, countdown and stopwatch modes. Simple, stylish and perfect for your desk, study or display.',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://WebCountDownTimer.com',
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
            name: 'Flip Clock',
            item: 'https://WebCountDownTimer.com/timers/flip-clock',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.answer,
          },
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#FAF8F4] dark:bg-[#0F1412] text-[#0D2137] dark:text-[#F3F5F4] pb-20 transition-colors">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HERO BANNER */}
      <section className="relative overflow-hidden border-b border-[#EAE4D9] dark:border-[#242E28] bg-gradient-to-r from-[#FAF8F4] via-[#FBF7F0] to-[#F3E8D6] dark:from-[#121815] dark:via-[#151C18] dark:to-[#1B211D]">
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-8">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-slate-400 mb-3"
          >
            <Link href="/" className="hover:text-[#156B2C] dark:hover:text-[#6CC49B] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
            <Link
              href="/tools"
              className="hover:text-[#156B2C] dark:hover:text-[#6CC49B] transition-colors"
            >
              Timers
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
            <span className="text-gray-900 dark:text-white font-medium">Flip Clock</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7">
              <div className="text-[11px] font-extrabold tracking-[0.14em] uppercase text-[#156B2C] dark:text-[#6CC49B] mb-1.5">
                FLIP CLOCK
              </div>
              <h1 className="text-3xl sm:text-[42px] font-bold font-serif text-[#0D2137] dark:text-[#F3F5F4] leading-tight mb-3">
                Free Online Flip Clock
              </h1>
              <p className="text-base sm:text-[17px] text-[#374151] dark:text-slate-300 leading-relaxed mb-5">
                A realistic retro split-flap clock with live time, countdown and
                stopwatch modes. Simple, stylish and perfect for your desk, study
                or display.
              </p>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2.5 text-xs font-semibold text-[#1F2937] dark:text-slate-200">
                <div className="flex items-center gap-2">
                  <Columns2 className="w-4 h-4 text-[#156B2C] dark:text-[#6CC49B]" />
                  <span>Live clock, countdown &amp; stopwatch</span>
                </div>
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-[#156B2C] dark:text-[#6CC49B]" />
                  <span>12/24-hour format</span>
                </div>
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-[#156B2C] dark:text-[#6CC49B]" />
                  <span>Fullscreen display</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#156B2C] dark:text-[#6CC49B]" />
                  <span>Free to use</span>
                </div>
              </div>
            </div>

            <div
              aria-hidden="true"
              className="hidden lg:flex lg:col-span-5 items-center justify-end pointer-events-none select-none"
            >
              <svg
                viewBox="0 0 420 210"
                className="w-full max-w-[400px] h-auto overflow-visible"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <radialGradient id="lampWarmPool" cx="0.72" cy="0.42" r="0.48">
                    <stop offset="0%" stopColor="#F5B041" stopOpacity="0.28" />
                    <stop offset="60%" stopColor="#F5B041" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="#F5B041" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <ellipse cx="290" cy="95" rx="130" ry="85" fill="url(#lampWarmPool)" />
                <rect x="20" y="176" width="380" height="16" rx="6" fill="#9C6B3B" />
                <rect x="20" y="176" width="380" height="4" rx="2" fill="#C48F5A" />
                <g transform="translate(88, 118)">
                  <path d="M12,8 C-20,-24 -44,-16 -52,8 C-28,12 -8,10 12,8 Z" fill="#2D6A35" />
                  <path d="M16,4 C-12,-44 -32,-60 -16,-76 C4,-60 16,-28 16,4 Z" fill="#3B8042" />
                  <path d="M22,6 C20,-40 44,-68 64,-56 C56,-28 36,-4 22,6 Z" fill="#25582B" />
                  <path d="M26,11 C44,-20 72,-24 84,-4 C60,8 40,12 26,11 Z" fill="#47914E" />
                  <path d="M0,10 L42,10 L37,58 L5,58 Z" fill="#E8E4DC" stroke="#C8C1B4" strokeWidth="1.5" />
                </g>
                <g transform="translate(166, 126)">
                  <rect x="0" y="34" width="118" height="16" rx="3" fill="#5B3418" />
                  <rect x="7" y="37" width="104" height="10" fill="#EFE2C6" />
                  <rect x="5" y="17" width="108" height="16" rx="3" fill="#7D461D" />
                  <rect x="12" y="20" width="94" height="10" fill="#F4E8CE" />
                  <rect x="12" y="2" width="94" height="15" rx="3" fill="#3E2412" />
                  <rect x="18" y="5" width="82" height="9" fill="#EFE2C6" />
                </g>
                <g transform="translate(278, 12)">
                  <ellipse cx="78" cy="164" rx="30" ry="6" fill="#7D5C34" />
                  <rect x="48" y="158" width="60" height="6" rx="3" fill="#B58E58" />
                  <path
                    d="M84,158 L104,86 L38,26"
                    fill="none"
                    stroke="#B58E58"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <g transform="translate(14, 10) rotate(-18)">
                    <path
                      d="M0,32 C4,5 40,5 44,32 Z"
                      fill="#2C2A28"
                      stroke="#4A4642"
                      strokeWidth="1.5"
                    />
                    <ellipse cx="22" cy="32" rx="22" ry="6" fill="#FFE89E" />
                  </g>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTAINER */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 space-y-10">
        {/* Interactive Flip Clock Tool + Mode Overview + Quick Timer Presets */}
        <FlipClockComponent />

        {/* TOOL-SPECIFIC CONTENT (150-250 WORDS: USE CASES, HOW TO USE & 3 UNIQUE FAQS) + RELATED TOOLS */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-2">
          <div className="lg:col-span-8 bg-white dark:bg-[#161C19] rounded-2xl p-6 sm:p-8 border border-[#EAE4D9] dark:border-[#28322C] shadow-xs">
            <ToolSpecificContentSection slug="flip-clock" toolName="Flip Clock" />
          </div>

          <aside className="lg:col-span-4">
            <div className="bg-white dark:bg-[#161C19] rounded-2xl p-4 border border-[#EAE4D9] dark:border-[#28322C] shadow-xs">
              <h3 className="text-sm font-bold text-[#0D2137] dark:text-[#F3F5F4] mb-3 px-1">
                Related Tools
              </h3>
              <div className="space-y-2.5">
                {RELATED_TOOLS.map((tool) => (
                  <Link
                    key={tool.title}
                    href={tool.href}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#FAF8F4] dark:hover:bg-[#1F2723] transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#EAF4EC] dark:bg-[#1F352A] text-[#156B2C] dark:text-[#6CC49B] border border-[#CFE4D3] dark:border-[#2D4A3B] flex items-center justify-center shrink-0">
                      {tool.icon === 'hourglass' && <Hourglass className="w-5 h-5" />}
                      {tool.icon === 'timer' && <Timer className="w-5 h-5" />}
                      {tool.icon === 'progress' && <CircleDot className="w-5 h-5" />}
                      {tool.icon === 'stopwatch' && <Timer className="w-5 h-5" />}
                      {tool.icon === 'calendar12' && (
                        <span className="px-1.5 py-0.5 rounded bg-[#262626] text-white font-mono text-[11px] font-bold">
                          12
                        </span>
                      )}
                      {tool.icon === 'clock' && <Globe className="w-5 h-5" />}
                      {tool.icon === 'calendar' && <Calendar className="w-5 h-5" />}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#0D2137] dark:text-[#F3F5F4] group-hover:text-[#156B2C] dark:group-hover:text-[#6CC49B] transition-colors">
                        {tool.title}
                      </div>
                      <div className="text-[11px] text-gray-500 dark:text-slate-400 leading-tight">
                        {tool.desc}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}

import { buildPageMetadata } from '@/lib/seo-metadata';
import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  ChevronRight,
  Leaf,
  Monitor,
  SlidersHorizontal,
  CheckCircle2,
  Settings,
  Check,
  Info,
} from 'lucide-react';
import SensoryTimersCollectionClient from '@/components/tools/SensoryTimersCollectionClient';
import ToolSpecificContentSection from '@/components/common/ToolSpecificContentSection';
import { getToolSpecificContent } from '@/lib/tool-specific-content';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/timers/sensory-timers');
}

const SETTINGS_AT_A_GLANCE = [
  'Mute or enable sound',
  'Adjust motion level',
  'Show or hide numeric time',
  'Use fullscreen mode',
  'Choose a visual style',
  'Use a high-contrast display',
  'Keyboard-accessible controls',
];

export default function SensoryTimersCollectionPage() {
  const specificContent = getToolSpecificContent('sensory-timers');
  const faqs = specificContent ? specificContent.faqs : [];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Sensory Visual Timers',
        url: 'https://WebCountDownTimer.com/timers/sensory-timers',
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'All',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        description:
          'A collection of calm, visually engaging timers with gentle motion and distraction-free designs including Sand, Liquid, Rainbow, Bubble, Frost, Snow, Lichen, and Moon Timers.',
      },
      {
        '@type': 'CollectionPage',
        name: 'Sensory Visual Timers',
        url: 'https://WebCountDownTimer.com/timers/sensory-timers',
        description:
          'A collection of calm, visually engaging timers with gentle motion and distraction-free designs including Sand, Liquid, Rainbow, Bubble, Frost, Snow, Lichen, and Moon Timers.',
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
            name: 'Sensory Timers',
            item: 'https://WebCountDownTimer.com/timers/sensory-timers',
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
      <section className="relative overflow-hidden border-b border-[#EAE4D9] dark:border-[#242E28] bg-gradient-to-r from-[#FAF8F4] via-[#F7F3EA] to-[#EAE0CE] dark:from-[#121815] dark:via-[#161D19] dark:to-[#1E221D]">
        <div className="pointer-events-none absolute inset-y-0 right-0 w-full lg:w-[50%] overflow-hidden opacity-90 dark:opacity-55 [mask-image:linear-gradient(to_right,transparent_0%,transparent_18%,rgba(0,0,0,0.55)_45%,black_75%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,transparent_18%,rgba(0,0,0,0.55)_45%,black_75%)]">
          <svg
            viewBox="0 0 800 320"
            className="w-full h-full object-cover"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <linearGradient id="sensoryWallGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FAF8F4" />
                <stop offset="50%" stopColor="#EDE4D5" />
                <stop offset="100%" stopColor="#D5C5AD" />
              </linearGradient>
              <radialGradient id="orbWarmGlow" cx="0.65" cy="0.58" r="0.38">
                <stop offset="0%" stopColor="#FFFDF5" stopOpacity="1" />
                <stop offset="35%" stopColor="#FFE49E" stopOpacity="0.65" />
                <stop offset="100%" stopColor="#F5B041" stopOpacity="0" />
              </radialGradient>
            </defs>

            <rect
              width="800"
              height="320"
              fill="url(#sensoryWallGrad)"
              className="dark:opacity-0"
            />
            <rect width="800" height="320" fill="url(#orbWarmGlow)" />
            <rect x="240" y="254" width="560" height="66" fill="#C99E67" />
            <rect x="240" y="254" width="560" height="5" fill="#DFB885" />

            <g transform="translate(605, 22) rotate(3)">
              <rect
                x="0"
                y="0"
                width="148"
                height="220"
                rx="3"
                fill="#8C6239"
                stroke="#5E3F22"
                strokeWidth="3"
              />
              <rect x="10" y="10" width="128" height="200" fill="#F4F1EA" />
              <rect x="20" y="22" width="108" height="176" fill="#D5E0DC" />
              <path
                d="M20,140 L55,95 L92,130 L128,85 L128,198 L20,198 Z"
                fill="#88A299"
              />
            </g>

            <g transform="translate(520, 184)">
              <rect x="-26" y="46" width="52" height="24" rx="4" fill="#C89D54" />
              <circle cx="0" cy="8" r="46" fill="#FFF8DC" />
            </g>

            <g transform="translate(390, 172)">
              <path d="M10,12 C-35,-25 -75,15 -65,55 C-35,45 -10,25 10,12 Z" fill="#3A7D3B" />
              <path d="M15,5 C-25,-55 -45,-85 -15,-105 C10,-85 20,-40 15,5 Z" fill="#2E6830" />
              <path d="M28,6 C15,-65 55,-100 85,-80 C70,-40 45,-5 28,6 Z" fill="#468E47" />
              <path
                d="M-6,16 L58,16 L50,82 L2,82 Z"
                fill="#EAE4DA"
                stroke="#D1C9BC"
                strokeWidth="2"
              />
            </g>
          </svg>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-8">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-slate-400 mb-3"
          >
            <Link prefetch={false} href="/" className="hover:text-[#1A5D34] dark:hover:text-[#6CC49B] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
            <Link prefetch={false}
              href="/tools"
              className="hover:text-[#1A5D34] dark:hover:text-[#6CC49B] transition-colors"
            >
              Timers
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
            <span className="text-gray-900 dark:text-white font-medium">Sensory Timers</span>
          </nav>

          <div className="max-w-2xl">
            <div className="text-[11px] font-extrabold tracking-[0.14em] uppercase text-[#1A5D34] dark:text-[#6CC49B] mb-1.5">
              SENSORY TIMERS COLLECTION
            </div>
            <h1 className="text-3xl sm:text-[42px] font-bold font-serif text-[#0D2137] dark:text-[#F3F5F4] leading-tight mb-3">
              Sensory Visual Timers
            </h1>
            <p className="text-base sm:text-[17px] text-[#374151] dark:text-slate-300 leading-relaxed mb-5">
              A collection of calm, visually engaging timers with gentle motion
              and distraction-free designs. Choose a style that helps you stay
              on track, focused and relaxed.
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2.5 text-xs font-semibold text-[#1F2937] dark:text-slate-200">
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-[#1A5D34] dark:text-[#6CC49B]" />
                <span>Calming visuals</span>
              </div>
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-[#1A5D34] dark:text-[#6CC49B]" />
                <span>Multiple timer styles</span>
              </div>
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#1A5D34] dark:text-[#6CC49B]" />
                <span>Customizable settings</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1A5D34] dark:text-[#6CC49B]" />
                <span>Free to use</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTAINER */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 space-y-10">
        <SensoryTimersCollectionClient />

        {/* TOOL-SPECIFIC CONTENT (150-250 WORDS: USE CASES, HOW TO USE & 3 UNIQUE FAQS) + SIDEBAR */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-2">
          <div className="lg:col-span-8 bg-white dark:bg-[#161C19] rounded-2xl p-6 sm:p-8 border border-[#EAE4D9] dark:border-[#28322C] shadow-xs">
            <ToolSpecificContentSection slug="sensory-timers" toolName="Sensory Visual Timers" />
          </div>

          <aside className="lg:col-span-4 space-y-4">
            <div className="bg-[#EEF4EC] dark:bg-[#161C19] rounded-2xl p-5 border border-[#D8E5D6] dark:border-[#28322C] shadow-xs">
              <div className="flex items-center gap-2 mb-3.5">
                <Settings className="w-5 h-5 text-[#1A5D34] dark:text-[#6CC49B]" />
                <h3 className="text-sm font-bold font-serif text-[#0D2137] dark:text-[#F3F5F4]">
                  Settings at a Glance
                </h3>
              </div>
              <ul className="space-y-2.5 text-xs font-medium text-[#1F2937] dark:text-slate-200">
                {SETTINGS_AT_A_GLANCE.map((item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#1A5D34] dark:text-[#6CC49B] shrink-0 stroke-[2.5]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#EEF4EC] dark:bg-[#161C19] rounded-2xl p-5 border border-[#D8E5D6] dark:border-[#28322C] shadow-xs">
              <div className="flex items-center gap-2 mb-2">
                <Monitor className="w-5 h-5 text-[#1A5D34] dark:text-[#6CC49B] shrink-0" />
                <h3 className="text-sm font-bold font-serif text-[#0D2137] dark:text-[#F3F5F4]">
                  High-Contrast Alternative
                </h3>
              </div>
              <p className="text-xs text-[#374151] dark:text-slate-300 leading-relaxed mb-3">
                Prefer a simpler view? Use the numeric-only timer for a clear,
                high-contrast countdown.
              </p>
              <Link prefetch={false}
                href="/countdown-timer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1A5D34] dark:text-[#6CC49B] hover:underline"
              >
                <span>Open High-Contrast Countdown →</span>
              </Link>
            </div>
          </aside>
        </section>

        <div className="bg-[#F8EDD6] dark:bg-[#241E16] border border-[#E6D4B2] dark:border-[#3D3122] rounded-xl px-5 py-3.5 flex items-start gap-3">
          <Info className="w-5 h-5 text-[#9A5B13] dark:text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs sm:text-[13px] text-[#2B2118] dark:text-slate-200 leading-relaxed">
            <strong className="font-bold text-[#0D2137] dark:text-white">Note:</strong> These
            are general-purpose visual timers for time management, focus and
            activity planning. They are not designed to diagnose, treat or
            replace any professional advice or medical support.
          </p>
        </div>
      </div>
    </div>
  );
}

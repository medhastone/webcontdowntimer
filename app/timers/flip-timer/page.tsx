import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  ChevronRight,
  Settings,
  Monitor,
  CheckCircle2,
  Lightbulb,
  Plus,
  Calendar,
} from 'lucide-react';
import FlipTimerComponent from '@/components/tools/FlipTimerComponent';

export const metadata: Metadata = {
  title: 'Free Online Flip Timer | Retro Split-Flap Countdown Timer',
  description:
    'A retro split-flap countdown timer with a classic mechanical flip animation. Simple, clear and perfect for focus, study, office desks and presentations.',
  keywords: [
    'flip timer',
    'retro flip countdown',
    'split-flap timer',
    'free online flip timer',
    'mechanical flip timer',
    'split flap countdown',
    'retro desk timer',
  ],
  alternates: {
    canonical: '/timers/flip-timer',
  },
  openGraph: {
    title: 'Free Online Flip Timer | Retro Split-Flap Countdown Timer',
    description:
      'A retro split-flap countdown timer with a classic mechanical flip animation. Simple, clear and perfect for focus, study and presentations.',
    url: '/timers/flip-timer',
    type: 'website',
  },
};

const FAQ_LEFT = [
  {
    question: 'Is the flip timer free to use?',
    answer:
      'Yes, our online Flip Timer is completely free to use with no registration, downloads, or hidden fees.',
  },
  {
    question: 'Can I set a custom time?',
    answer:
      'Yes! You can pick from quick presets (1, 3, 5, 10, or 25 minutes), enter any custom duration in minutes and seconds, or set a target End Time.',
  },
  {
    question: 'Does it make a sound when it ends?',
    answer:
      'Yes, when Sound Alert is enabled, the timer plays a subtle mechanical flip click as digits change and a pleasant desk chime when the countdown reaches zero. You can mute sound anytime.',
  },
  {
    question: 'Does it work on mobile devices?',
    answer:
      'Yes, the split-flap countdown automatically scales to fit phones, tablets, laptops, desktop monitors, and conference room displays.',
  },
];

const FAQ_RIGHT = [
  {
    question: 'What is the difference between a flip timer and a flip clock?',
    answer:
      'A flip timer counts down from a chosen duration (like 25 minutes) to zero for tasks and sessions. A flip clock displays the current time of day (hours and minutes) continuously.',
  },
  {
    question: 'Can I use it for presentations?',
    answer:
      'Absolutely. The high-contrast split-flap numerals and Fullscreen mode make it easy for speakers and audiences to read remaining time from across a room.',
  },
  {
    question: 'Can I change the theme or digit style?',
    answer:
      'Yes! Choose from four Display Themes (Classic Black, Retro Cream, Industrial, and Modern Dark) and three Digit Styles to match your workspace.',
  },
  {
    question: 'What happens when the timer reaches zero?',
    answer:
      'When the countdown reaches 00:00, the split-flap panels stop at zero, the nameplate displays TIME IS UP!, and an optional completion chime sounds.',
  },
];

const RELATED_TOOLS = [
  {
    name: 'Pomodoro Timer',
    desc: 'Stay focused with intervals.',
    href: '/tools/pomodoro-timer',
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
    href: '/tools/circular-timer',
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
    href: '/tools/progress-timer',
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
    name: 'Pixel Timer',
    desc: 'A retro pixel countdown.',
    href: '/tools/pixel-timer',
    badge: (
      <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shrink-0 p-1.5">
        <div className="grid grid-cols-4 gap-0.5 w-full h-full">
          {Array.from({ length: 16 }).map((_, i) => (
            <span
              key={i}
              className={`rounded-[1px] ${
                i < 11 ? 'bg-emerald-400' : 'bg-emerald-950'
              }`}
            />
          ))}
        </div>
      </div>
    ),
  },
  {
    name: 'Blocks Timer',
    desc: 'A stacked block timer.',
    href: '/tools/blocks-timer',
    badge: (
      <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 flex flex-col items-center justify-center gap-0.5 shrink-0">
        <span className="w-4 h-1.5 rounded-xs bg-rose-500" />
        <span className="w-5 h-1.5 rounded-xs bg-amber-500" />
        <span className="w-6 h-1.5 rounded-xs bg-blue-600" />
        <span className="w-7 h-1.5 rounded-xs bg-emerald-600" />
      </div>
    ),
  },
  {
    name: 'Hourglass Timer',
    desc: 'A classic hourglass view.',
    href: '/tools/hourglass-timer',
    badge: (
      <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center shrink-0">
        <svg viewBox="0 0 36 36" className="w-7 h-7">
          <path d="M11 8h14M11 28h14" stroke="#991B1B" strokeWidth="2.5" strokeLinecap="round" />
          <path
            d="M13 8c0 6 5 8 5 10s-5 4-5 10h10c0-6-5-8-5-10s5-4 5-10H13z"
            fill="#FCA5A5"
            stroke="#B91C1C"
            strokeWidth="1.5"
          />
        </svg>
      </div>
    ),
  },
  {
    name: 'Candle Timer',
    desc: 'A peaceful visual timer.',
    href: '/tools/candle-timer',
    badge: (
      <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center shrink-0">
        <svg viewBox="0 0 36 36" className="w-7 h-7">
          <path d="M18 7c2 3 3 5 0 7-3-2-2-4 0-7z" fill="#F59E0B" />
          <rect x="14" y="15" width="8" height="14" rx="2" fill="#D97706" />
        </svg>
      </div>
    ),
  },
  {
    name: 'Spinner Timer',
    desc: 'A rotating countdown.',
    href: '/timers/spinner-timer',
    badge: (
      <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center shrink-0">
        <svg viewBox="0 0 36 36" className="w-7 h-7">
          <circle
            cx="18"
            cy="18"
            r="11"
            fill="none"
            stroke="#6366F1"
            strokeWidth="4"
            strokeDasharray="48 20"
          />
          <circle cx="18" cy="18" r="3" fill="#EC4899" />
        </svg>
      </div>
    ),
  },
  {
    name: 'Visual Timer',
    desc: 'A clear, visual countdown.',
    href: '/tools/visual-timer',
    badge: (
      <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center shrink-0">
        <svg viewBox="0 0 36 36" className="w-7 h-7">
          <circle cx="18" cy="18" r="11" fill="#78350F" stroke="#F59E0B" strokeWidth="2.5" />
          <polygon points="16,13 24,18 16,23" fill="#FDE68A" />
        </svg>
      </div>
    ),
  },
  {
    name: 'Flip Clock',
    desc: 'A retro flip style clock.',
    href: '/tools/world-clock',
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
  const allFaqs = [...FAQ_LEFT, ...FAQ_RIGHT];

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
        {/* Right-side Warm Retro Desk Split-Flap Scene */}
        <div
          aria-hidden="true"
          className="hidden lg:flex absolute inset-y-0 right-0 w-[48%] items-center justify-end pr-10 pointer-events-none select-none overflow-hidden [mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.55)_32%,black_62%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.55)_32%,black_62%)]"
        >
          {/* Warm Desk Backdrop Gradient & Bokeh */}
          <div
            className="absolute inset-0 opacity-95"
            style={{
              background:
                'linear-gradient(90deg, rgba(74,42,24,0) 0%, rgba(74,42,24,0.85) 52%, rgba(36,19,10,0.96) 100%)',
            }}
          />
          <div className="absolute top-6 right-72 w-36 h-36 rounded-full bg-amber-400/25 blur-2xl" />
          <div className="absolute bottom-6 right-16 w-44 h-44 rounded-full bg-orange-400/20 blur-2xl" />

          {/* Desk Surface */}
          <div className="absolute bottom-0 right-0 w-[90%] h-14 bg-gradient-to-b from-[#5A341B] to-[#2E180B] border-t border-amber-200/20" />

          {/* Stacked Vintage Books on Right */}
          <div className="relative z-10 mr-4 mt-16 hidden xl:flex flex-col items-end gap-1">
            <div className="w-28 h-5 rounded-l-md bg-gradient-to-r from-amber-700 to-amber-600 border-y border-l border-amber-900 shadow-md flex items-center pl-2">
              <div className="w-full h-3 bg-[#F6EFE2] rounded-l-xs" />
            </div>
            <div className="w-32 h-6 rounded-l-md bg-gradient-to-r from-stone-800 to-stone-700 border-y border-l border-stone-900 shadow-md flex items-center pl-2">
              <div className="w-full h-3.5 bg-[#EFE6D5] rounded-l-xs" />
            </div>
          </div>

          {/* Hero 3D Mechanical Split-Flap Clock Graphic */}
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
          {/* Breadcrumbs */}
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

          {/* Kicker & H1 */}
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

            {/* 4 Feature Badges Row */}
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
        {/* Interactive Flip Timer Tool */}
        <FlipTimerComponent />

        {/* 3-COLUMN EDITORIAL GUIDE & RELATED TOOLS SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-2">
          {/* LEFT SIDEBAR: On This Page + Quote Card */}
          <aside className="lg:col-span-3 space-y-5">
            <div className="rounded-2xl bg-white dark:bg-[#1A1514] border border-[#E6DFD5] dark:border-[#2E2523] p-5">
              <h2 className="text-sm font-bold text-[#0E2338] dark:text-white mb-3">
                On This Page
              </h2>
              <ul className="space-y-2.5 text-xs sm:text-[13px] font-medium text-[#3B312E] dark:text-slate-300">
                {[
                  { href: '#what-is-a-flip-timer', label: 'What Is a Flip Timer?' },
                  {
                    href: '#how-a-split-flap-countdown-works',
                    label: 'How a Split-Flap Countdown Works',
                  },
                  {
                    href: '#how-to-use-the-retro-flip-timer',
                    label: 'How to Use the Retro Flip Timer',
                  },
                  {
                    href: '#flip-timer-for-study-and-presentations',
                    label: 'Flip Timer for Study and Presentations',
                  },
                  { href: '#flip-timer-vs-flip-clock', label: 'Flip Timer vs Flip Clock' },
                  { href: '#faq', label: 'Frequently Asked Questions' },
                ].map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="flex items-start gap-2 hover:text-[#A91D22] dark:hover:text-rose-400 transition-colors"
                    >
                      <span className="text-[#A91D22] dark:text-rose-400 mt-0.5">▸</span>
                      <span>{item.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Visual Quote Card matching screenshot */}
            <div className="rounded-2xl overflow-hidden bg-gradient-to-b from-[#2A1810] via-[#1B100B] to-[#140B07] border border-[#3E281D] text-white shadow-md">
              {/* Mini 10:00 Split-Flap Graphic */}
              <div className="p-5 pb-3 flex flex-col items-center justify-center bg-[radial-gradient(circle_at_50%_30%,#5C341D_0%,#1F110A_75%)]">
                <div className="rounded-2xl p-2.5 bg-[#23211F] border border-[#4A433E] shadow-lg">
                  <div className="rounded-xl bg-[#0B0A09] px-3 py-2.5 flex items-center gap-1.5">
                    {['1', '0', ':', '0', '0'].map((d, idx) =>
                      d === ':' ? (
                        <span key={idx} className="text-stone-300 font-bold text-sm px-0.5">
                          :
                        </span>
                      ) : (
                        <span
                          key={idx}
                          className="relative w-8 h-11 rounded-md bg-[#22201E] border border-[#3B3734] flex items-center justify-center font-mono text-xl font-bold text-white"
                        >
                          {d}
                          <span className="absolute inset-x-0 top-1/2 h-[1.5px] bg-black/80" />
                        </span>
                      )
                    )}
                  </div>
                </div>
                <div className="mt-[-3px] px-3 py-0.5 rounded-xs bg-[#2C2116] border border-[#8C6D3F] text-[7px] tracking-[0.18em] text-[#E7C888] uppercase">
                  COUNTDOWN TIMER
                </div>
              </div>

              <div className="p-5 pt-3 text-center">
                <p className="font-serif italic text-sm sm:text-base text-[#F7EFE6] leading-relaxed">
                  &ldquo;A classic flip timer that makes focus time feel special.&rdquo;
                </p>
                <div className="mt-3 flex items-center justify-center gap-2">
                  <span className="h-[1px] w-8 bg-white/20" />
                  <span className="w-6 h-6 rounded-full bg-[#A91D22] text-white flex items-center justify-center">
                    <Calendar className="w-3.5 h-3.5" />
                  </span>
                  <span className="h-[1px] w-8 bg-white/20" />
                </div>
              </div>
            </div>
          </aside>

          {/* CENTER COLUMN: Complete SEO Guide */}
          <article className="lg:col-span-6 rounded-3xl bg-white dark:bg-[#1A1514] border border-[#E6DFD5] dark:border-[#2E2523] p-6 sm:p-8 space-y-6">
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#A91D22] dark:text-rose-400 mb-1">
                A COMPLETE GUIDE
              </div>
              <h2
                id="what-is-a-flip-timer"
                className="font-serif text-xl sm:text-2xl font-bold text-[#0E2338] dark:text-white scroll-mt-24"
              >
                What Is a Flip Timer?
              </h2>
              <p className="mt-2.5 text-sm text-[#2F2825] dark:text-slate-300 leading-relaxed">
                A flip timer is a visual countdown timer that uses a split-flap display, similar to
                old airport and train station boards. The numbers change with a mechanical-style
                flip animation as the time counts down, giving a classic and engaging experience.
              </p>
            </div>

            <div className="pt-2">
              <h2
                id="how-a-split-flap-countdown-works"
                className="font-serif text-xl sm:text-2xl font-bold text-[#0E2338] dark:text-white scroll-mt-24"
              >
                How a Split-Flap Countdown Works
              </h2>
              <p className="mt-2.5 text-sm text-[#2F2825] dark:text-slate-300 leading-relaxed">
                The timer uses a split-flap style animation for each digit. When a number changes,
                the top half flips down along a central horizontal pivot line and the next number
                appears, creating a realistic mechanical transition. As the countdown progresses,
                the digits flip at the exact right second until the timer reaches zero and
                completes.
              </p>
            </div>

            <div className="pt-2">
              <h2
                id="how-to-use-the-retro-flip-timer"
                className="font-serif text-xl sm:text-2xl font-bold text-[#0E2338] dark:text-white scroll-mt-24"
              >
                How to Use the Retro Flip Timer
              </h2>

              <div className="mt-3.5 grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                <ol className="md:col-span-7 space-y-2.5 text-sm text-[#2F2825] dark:text-slate-300">
                  {[
                    'Choose a preset time or enter a custom duration.',
                    'Pick a display theme and digit style.',
                    'Click Start to begin the countdown.',
                    'Use Pause to stop and Resume to continue.',
                    'Click Reset to set a new time and start again.',
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-[#A91D22] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>

                {/* Tip Callout Box matching screenshot */}
                <div className="md:col-span-5 rounded-2xl bg-[#F9EFEA] dark:bg-[#2A1C1A] border border-[#EED9D0] dark:border-[#422A27] p-4">
                  <div className="flex items-center gap-1.5 font-serif italic font-bold text-sm text-[#0E2338] dark:text-white mb-1.5">
                    <Lightbulb className="w-4 h-4 text-[#A91D22] dark:text-rose-400 shrink-0" />
                    <span>Tip</span>
                  </div>
                  <p className="text-xs text-[#3B312E] dark:text-slate-300 leading-relaxed">
                    Use short durations (5–25 minutes) for focused work, study sessions or quick
                    tasks.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <h2
                id="flip-timer-for-study-and-presentations"
                className="font-serif text-xl sm:text-2xl font-bold text-[#0E2338] dark:text-white scroll-mt-24"
              >
                Flip Timer for Study and Presentations
              </h2>
              <p className="mt-2.5 text-sm text-[#2F2825] dark:text-slate-300 leading-relaxed">
                A flip timer is perfect for study sessions, class activities and presentations. The
                large, clear digits are easy to read from a distance, helping you and your audience
                stay on track and manage time effectively.
              </p>
            </div>

            <div className="pt-2">
              <h2
                id="flip-timer-vs-flip-clock"
                className="font-serif text-xl sm:text-2xl font-bold text-[#0E2338] dark:text-white scroll-mt-24"
              >
                Flip Timer vs Flip Clock
              </h2>
              <p className="mt-2.5 text-sm text-[#2F2825] dark:text-slate-300 leading-relaxed">
                A flip timer counts down from a set duration to zero, which is ideal for timed
                tasks, focus sessions and activities. A flip clock, on the other hand, shows the
                current time continuously. If you want a real-time clock display, check our{' '}
                <Link
                  href="/tools/world-clock"
                  className="text-[#A91D22] dark:text-rose-400 font-semibold underline hover:no-underline"
                >
                  Flip Clock
                </Link>{' '}
                tool.
              </p>
            </div>
          </article>

          {/* RIGHT SIDEBAR: Related Tools */}
          <aside className="lg:col-span-3 rounded-3xl bg-white dark:bg-[#1A1514] border border-[#E6DFD5] dark:border-[#2E2523] p-5">
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

        {/* FREQUENTLY ASKED QUESTIONS SECTION (2-Column Accordion matching screenshot) */}
        <section id="faq" className="pt-2 scroll-mt-24">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0E2338] dark:text-white mb-4">
            Frequently Asked Questions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2.5">
              {FAQ_LEFT.map((item) => (
                <details
                  key={item.question}
                  className="group rounded-2xl bg-white dark:bg-[#1A1514] border border-[#E6DFD5] dark:border-[#2E2523] px-4 py-3.5"
                >
                  <summary className="flex items-center justify-between gap-3 cursor-pointer list-none text-xs sm:text-sm font-semibold text-[#1E1917] dark:text-white">
                    <span>{item.question}</span>
                    <Plus className="w-4 h-4 text-[#0E2338] dark:text-slate-300 shrink-0 transition-transform group-open:rotate-45" />
                  </summary>
                  <p className="mt-2.5 text-xs sm:text-sm text-[#4A3F3C] dark:text-slate-300 leading-relaxed pt-2 border-t border-[#F2ECE4] dark:border-[#2C2422]">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>

            <div className="space-y-2.5">
              {FAQ_RIGHT.map((item) => (
                <details
                  key={item.question}
                  className="group rounded-2xl bg-white dark:bg-[#1A1514] border border-[#E6DFD5] dark:border-[#2E2523] px-4 py-3.5"
                >
                  <summary className="flex items-center justify-between gap-3 cursor-pointer list-none text-xs sm:text-sm font-semibold text-[#1E1917] dark:text-white">
                    <span>{item.question}</span>
                    <Plus className="w-4 h-4 text-[#0E2338] dark:text-slate-300 shrink-0 transition-transform group-open:rotate-45" />
                  </summary>
                  <p className="mt-2.5 text-xs sm:text-sm text-[#4A3F3C] dark:text-slate-300 leading-relaxed pt-2 border-t border-[#F2ECE4] dark:border-[#2C2422]">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

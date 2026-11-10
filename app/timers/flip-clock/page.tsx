import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  ChevronRight,
  Columns2,
  Settings,
  Monitor,
  CheckCircle2,
  Lightbulb,
  Info,
  Clock,
  Hourglass,
  CircleDot,
  Timer,
  Calendar,
  Globe,
} from 'lucide-react';
import FlipClockComponent from '@/components/tools/FlipClockComponent';

export const metadata: Metadata = {
  title: 'Free Online Flip Clock | Retro Split-Flap Clock, Timer & Stopwatch',
  description:
    'A realistic retro split-flap clock with live time, countdown and stopwatch modes. Features 12/24-hour format, timezone selection, dark & light themes, and fullscreen display.',
  alternates: {
    canonical: '/timers/flip-clock',
  },
  openGraph: {
    title: 'Free Online Flip Clock | Retro Split-Flap Clock, Timer & Stopwatch',
    description:
      'A realistic retro split-flap clock with live time, countdown and stopwatch modes. Simple, stylish and perfect for your desk, study or display.',
    url: '/timers/flip-clock',
    type: 'website',
  },
};

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

const FAQS = [
  {
    q: 'Is the online flip clock free to use?',
    a: 'Yes! Our Free Online Flip Clock is 100% free with no account sign-up, subscription, or software installation required.',
    col: 'left',
  },
  {
    q: 'Does the live clock show the correct time?',
    a: 'Yes. In Live Clock mode, the flip clock synchronizes directly with your browser system clock or your selected international time zone for accurate real-time hours, minutes, and seconds.',
    col: 'left',
  },
  {
    q: 'Can I use it as a countdown timer?',
    a: 'Yes! Switch to Countdown Mode at the top of the control panel or click any of the Quick Timer Presets (1, 5, 10, 15, 25, or 30 minutes, or Custom Time) to count down with flipping split-flap numerals.',
    col: 'left',
  },
  {
    q: 'Can I use it as a stopwatch?',
    a: 'Yes. Select Stopwatch Mode to measure elapsed hours, minutes, and seconds upward from 00:00:00 with Start, Pause, and Reset controls.',
    col: 'left',
  },
  {
    q: 'Can I change the time format to 12-hour or 24-hour?',
    a: 'Yes. Click 12-hour (AM/PM) to display standard 12-hour time with an AM/PM indicator on the hours panel, or click 24-hour for military/international time.',
    col: 'right',
  },
  {
    q: 'Can I select a different time zone?',
    a: 'Yes. Use the Time Zone selector to switch between your Local Browser Time and major world cities (such as New Delhi, New York, London, Tokyo, Sydney, Dubai, or UTC).',
    col: 'right',
  },
  {
    q: 'Does it work on mobile devices?',
    a: 'Yes. The retro flip clock is responsive and works smoothly on smartphones, tablets, laptops, desktop monitors, and secondary desk displays.',
    col: 'right',
  },
  {
    q: 'Do I need to install anything?',
    a: 'No installation or browser extension is needed. The flip clock runs directly in your web browser, and you can press F anytime for a clean fullscreen desk display.',
    col: 'right',
  },
];

export default function FlipClockPage() {
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
            name: 'Flip Clock',
            item: 'https://WebCountDownTimer.com/timers/flip-clock',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQS.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.a,
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
          {/* Breadcrumbs */}
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

              {/* Feature Badges */}
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

            {/* Right-side self-contained desk illustration (never overlaps text or washes out dark mode) */}
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

                {/* Subtle ambient lamp glow */}
                <ellipse cx="290" cy="95" rx="130" ry="85" fill="url(#lampWarmPool)" />

                {/* Warm wooden desk shelf */}
                <rect x="20" y="176" width="380" height="16" rx="6" fill="#9C6B3B" />
                <rect x="20" y="176" width="380" height="4" rx="2" fill="#C48F5A" />

                {/* Ceramic pot & green houseplant */}
                <g transform="translate(88, 118)">
                  <path
                    d="M12,8 C-20,-24 -44,-16 -52,8 C-28,12 -8,10 12,8 Z"
                    fill="#2D6A35"
                  />
                  <path
                    d="M16,4 C-12,-44 -32,-60 -16,-76 C4,-60 16,-28 16,4 Z"
                    fill="#3B8042"
                  />
                  <path
                    d="M22,6 C20,-40 44,-68 64,-56 C56,-28 36,-4 22,6 Z"
                    fill="#25582B"
                  />
                  <path
                    d="M26,11 C44,-20 72,-24 84,-4 C60,8 40,12 26,11 Z"
                    fill="#47914E"
                  />
                  <path
                    d="M0,10 L42,10 L37,58 L5,58 Z"
                    fill="#E8E4DC"
                    stroke="#C8C1B4"
                    strokeWidth="1.5"
                  />
                </g>

                {/* Stack of 3 study books */}
                <g transform="translate(166, 126)">
                  <rect x="0" y="34" width="118" height="16" rx="3" fill="#5B3418" />
                  <rect x="7" y="37" width="104" height="10" fill="#EFE2C6" />
                  <rect x="5" y="17" width="108" height="16" rx="3" fill="#7D461D" />
                  <rect x="12" y="20" width="94" height="10" fill="#F4E8CE" />
                  <rect x="12" y="2" width="94" height="15" rx="3" fill="#3E2412" />
                  <rect x="18" y="5" width="82" height="9" fill="#EFE2C6" />
                </g>

                {/* Classic Brass & Matte Charcoal Desk Lamp */}
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

        {/* THREE-COLUMN GUIDE & SIDEBARS */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-2">
          {/* LEFT SIDEBAR: On This Page + Desk Flip Clock Quote Card */}
          <aside className="lg:col-span-3 space-y-5">
            <div className="bg-white dark:bg-[#161C19] rounded-2xl p-5 border border-[#EAE4D9] dark:border-[#28322C] shadow-xs">
              <h3 className="text-sm font-bold text-[#0D2137] dark:text-[#F3F5F4] mb-3">
                On This Page
              </h3>
              <ul className="space-y-2.5 text-xs font-medium text-[#374151] dark:text-slate-300">
                <li>
                  <a
                    href="#what-is"
                    className="flex items-start gap-2 hover:text-[#156B2C] dark:hover:text-[#6CC49B] transition-colors"
                  >
                    <span className="text-[#156B2C] dark:text-[#6CC49B] mt-0.5">▶</span>
                    <span>What Is a Flip Clock?</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="flex items-start gap-2 hover:text-[#156B2C] dark:hover:text-[#6CC49B] transition-colors"
                  >
                    <span className="text-[#156B2C] dark:text-[#6CC49B] mt-0.5">▶</span>
                    <span>How a Retro Split-Flap Clock Works</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#how-to-use"
                    className="flex items-start gap-2 hover:text-[#156B2C] dark:hover:text-[#6CC49B] transition-colors"
                  >
                    <span className="text-[#156B2C] dark:text-[#6CC49B] mt-0.5">▶</span>
                    <span>How to Use the Online Flip Clock</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#modes"
                    className="flex items-start gap-2 hover:text-[#156B2C] dark:hover:text-[#6CC49B] transition-colors"
                  >
                    <span className="text-[#156B2C] dark:text-[#6CC49B] mt-0.5">▶</span>
                    <span>Flip Clock Countdown and Stopwatch Modes</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#desks-and-displays"
                    className="flex items-start gap-2 hover:text-[#156B2C] dark:hover:text-[#6CC49B] transition-colors"
                  >
                    <span className="text-[#156B2C] dark:text-[#6CC49B] mt-0.5">▶</span>
                    <span>Flip Clock for Desks and Displays</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#vs-flip-timer"
                    className="flex items-start gap-2 hover:text-[#156B2C] dark:hover:text-[#6CC49B] transition-colors"
                  >
                    <span className="text-[#156B2C] dark:text-[#6CC49B] mt-0.5">▶</span>
                    <span>Flip Clock vs Flip Timer</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#faq"
                    className="flex items-start gap-2 hover:text-[#156B2C] dark:hover:text-[#6CC49B] transition-colors"
                  >
                    <span className="text-[#156B2C] dark:text-[#6CC49B] mt-0.5">▶</span>
                    <span>Frequently Asked Questions</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Illustrated 08:30 Desk Flip Clock Quote Card */}
            <div className="bg-[#EEF4EC] dark:bg-[#19221D] rounded-2xl overflow-hidden border border-[#DCE6D9] dark:border-[#28362D] shadow-xs">
              <div className="h-40 relative overflow-hidden bg-gradient-to-b from-[#E5DEC9] to-[#B78F5A]">
                <svg
                  viewBox="0 0 320 170"
                  className="w-full h-full object-cover"
                  preserveAspectRatio="xMidYMid slice"
                >
                  {/* Soft wall & desk surface */}
                  <rect width="320" height="125" fill="#DDD4C0" />
                  <rect y="125" width="320" height="45" fill="#A67846" />
                  <rect y="125" width="320" height="4" fill="#C49660" />

                  {/* Potted plant on left */}
                  <path
                    d="M25,75 C5,45 -5,25 12,10 C28,25 32,50 25,75 Z"
                    fill="#2D6A35"
                  />
                  <path
                    d="M32,75 C28,35 45,15 62,22 C55,45 42,62 32,75 Z"
                    fill="#3E8446"
                  />
                  <path
                    d="M12,72 L46,72 L42,126 L16,126 Z"
                    fill="#F2EFE9"
                  />

                  {/* Retro 08:30 Flip Clock */}
                  <g transform="translate(65, 36)">
                    {/* Pedestal stand */}
                    <rect
                      x="38"
                      y="82"
                      width="114"
                      height="10"
                      rx="2"
                      fill="#1E1D1B"
                    />
                    <rect x="52" y="74" width="8" height="10" fill="#33312E" />
                    <rect x="130" y="74" width="8" height="10" fill="#33312E" />

                    {/* Outer dark casing */}
                    <rect
                      x="0"
                      y="0"
                      width="190"
                      height="76"
                      rx="14"
                      fill="#1F1F22"
                      stroke="#38383E"
                      strokeWidth="2"
                    />
                    {/* Leftbay 08 */}
                    <rect
                      x="14"
                      y="10"
                      width="72"
                      height="56"
                      rx="6"
                      fill="#141416"
                    />
                    <text
                      x="50"
                      y="49"
                      textAnchor="middle"
                      fill="#F4F1EA"
                      fontSize="36"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      08
                    </text>
                    <line
                      x1="14"
                      y1="38"
                      x2="86"
                      y2="38"
                      stroke="#09090B"
                      strokeWidth="2"
                    />
                    {/* Colon */}
                    <circle cx="95" cy="30" r="2.5" fill="#E5E0D5" />
                    <circle cx="95" cy="46" r="2.5" fill="#E5E0D5" />
                    {/* Right bay 30 */}
                    <rect
                      x="104"
                      y="10"
                      width="72"
                      height="56"
                      rx="6"
                      fill="#141416"
                    />
                    <text
                      x="140"
                      y="49"
                      textAnchor="middle"
                      fill="#F4F1EA"
                      fontSize="36"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      30
                    </text>
                    <line
                      x1="104"
                      y1="38"
                      x2="176"
                      y2="38"
                      stroke="#09090B"
                      strokeWidth="2"
                    />
                  </g>
                </svg>
              </div>
              <div className="p-5 text-center">
                <p className="font-serif italic text-[15px] text-[#0D2137] dark:text-[#F3F5F4] leading-relaxed mb-3">
                  “A classic flip clock look for your desk, study or work
                  display.”
                </p>
                <div className="flex items-center justify-center gap-2 text-[#156B2C] dark:text-[#6CC49B]">
                  <span className="h-px w-8 bg-[#BDD2C0] dark:bg-[#2F4436]" />
                  <Clock className="w-5 h-5 text-[#156B2C] dark:text-[#6CC49B]" />
                  <span className="h-px w-8 bg-[#BDD2C0] dark:bg-[#2F4436]" />
                </div>
              </div>
            </div>
          </aside>

          {/* CENTER GUIDE CONTENT */}
          <article className="lg:col-span-6 space-y-6 text-[#1F2937] dark:text-slate-200">
            <div>
              <div className="text-[11px] font-extrabold tracking-[0.14em] uppercase text-[#156B2C] dark:text-[#6CC49B] mb-1">
                A COMPLETE GUIDE
              </div>
              <h2
                id="what-is"
                className="text-2xl font-bold font-serif text-[#0D2137] dark:text-[#F3F5F4] mb-2.5 scroll-mt-20"
              >
                What Is a Flip Clock?
              </h2>
              <p className="text-sm text-[#374151] dark:text-slate-300 leading-relaxed">
                A flip clock is a digital clock that uses mechanical-style
                split-flap panels to display the time, creating a classic, retro
                look. Our online flip clock brings the same style to your
                browser, with live time, a countdown timer and a stopwatch.
              </p>
            </div>

            <div>
              <h2
                id="how-it-works"
                className="text-2xl font-bold font-serif text-[#0D2137] dark:text-[#F3F5F4] mb-2.5 scroll-mt-20"
              >
                How a Retro Split-Flap Clock Works
              </h2>
              <p className="text-sm text-[#374151] dark:text-slate-300 leading-relaxed">
                A split-flap clock shows numbers on two hinged cards (top and
                bottom). When the time changes, the cards flip with a smooth,
                realistic animation to reveal the next number. It’s inspired by
                classic airport and train station display boards.
              </p>
            </div>

            <div>
              <h2
                id="how-to-use"
                className="text-2xl font-bold font-serif text-[#0D2137] dark:text-[#F3F5F4] mb-3 scroll-mt-20"
              >
                How to Use the Online Flip Clock
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
                <ol className="sm:col-span-7 space-y-2.5 text-sm text-[#374151] dark:text-slate-300">
                  {[
                    'Choose a mode: Live Clock, Countdown or Stopwatch.',
                    'Set your time format (12-hour or 24-hour).',
                    'Select your time zone (for Live Clock).',
                    'Add a duration (for Countdown) or start the stopwatch.',
                    'Use Start, Pause and Reset controls when needed.',
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-[#156B2C] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="leading-snug">{step}</span>
                    </li>
                  ))}
                </ol>

                {/* Tip Box */}
                <div className="sm:col-span-5 bg-[#E6F3E8] dark:bg-[#19261E] border border-[#C5E0C9] dark:border-[#2A4032] rounded-xl p-4">
                  <div className="flex items-center gap-1.5 font-serif italic font-bold text-[#0D2137] dark:text-[#F3F5F4] text-base mb-1.5">
                    <Lightbulb className="w-4 h-4 text-[#156B2C] dark:text-[#6CC49B] shrink-0" />
                    <span>Tip</span>
                  </div>
                  <p className="text-xs text-[#1F2937] dark:text-slate-300 leading-relaxed">
                    Press F for fullscreen and keep the flip clock open on your
                    desk or second screen for a clean, distraction-free display.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2
                id="modes"
                className="text-2xl font-bold font-serif text-[#0D2137] dark:text-[#F3F5F4] mb-2.5 scroll-mt-20"
              >
                Flip Clock Countdown and Stopwatch Modes
              </h2>
              <p className="text-sm text-[#374151] dark:text-slate-300 leading-relaxed">
                Use <strong className="font-semibold text-[#0D2137] dark:text-white">Countdown Mode</strong> to count down a specific
                duration, such as a study session, break or presentation. Use{' '}
                <strong className="font-semibold text-[#0D2137] dark:text-white">Stopwatch Mode</strong> to measure elapsed time, like
                a workout, focus session or activity. Both modes use the same
                realistic flip animation.
              </p>
            </div>

            <div>
              <h2
                id="desks-and-displays"
                className="text-2xl font-bold font-serif text-[#0D2137] dark:text-[#F3F5F4] mb-2.5 scroll-mt-20"
              >
                Flip Clock for Desks and Displays
              </h2>
              <p className="text-sm text-[#374151] dark:text-slate-300 leading-relaxed">
                The flip clock is perfect as a desktop clock, for study setups,
                office desks, classroom displays or live streams. The large,
                easy-to-read numbers and retro style make it a stylish and
                practical time display.
              </p>
            </div>

            <div>
              <h2
                id="vs-flip-timer"
                className="text-2xl font-bold font-serif text-[#0D2137] dark:text-[#F3F5F4] mb-2.5 scroll-mt-20"
              >
                Flip Clock vs Flip Timer
              </h2>
              <p className="text-sm text-[#374151] dark:text-slate-300 leading-relaxed">
                A flip clock shows the current time (live clock) and can also
                work as a countdown or stopwatch. A flip timer is only a
                countdown timer with flipping digits. In short, the flip clock
                has more modes and is a more versatile tool.
              </p>
            </div>

            {/* Note Callout Box */}
            <div className="bg-[#F9EED8] dark:bg-[#241E16] border border-[#E8D5B0] dark:border-[#3D3122] rounded-xl px-4 py-3.5 flex items-start gap-3">
              <Info className="w-5 h-5 text-[#B45309] dark:text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-[#2B2118] dark:text-slate-200 leading-relaxed">
                <strong className="font-bold text-[#0D2137] dark:text-white">Note:</strong> This
                is a visual clock and timer tool for personal, study and
                productivity use. It is not a physical device and does not
                require any installation.
              </p>
            </div>
          </article>

          {/* RIGHT SIDEBAR: Related Tools */}
          <aside className="lg:col-span-3">
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
                      {tool.icon === 'hourglass' && (
                        <Hourglass className="w-5 h-5" />
                      )}
                      {tool.icon === 'timer' && <Timer className="w-5 h-5" />}
                      {tool.icon === 'progress' && (
                        <CircleDot className="w-5 h-5" />
                      )}
                      {tool.icon === 'stopwatch' && (
                        <Timer className="w-5 h-5" />
                      )}
                      {tool.icon === 'calendar12' && (
                        <span className="px-1.5 py-0.5 rounded bg-[#262626] text-white font-mono text-[11px] font-bold">
                          12
                        </span>
                      )}
                      {tool.icon === 'clock' && <Globe className="w-5 h-5" />}
                      {tool.icon === 'calendar' && (
                        <Calendar className="w-5 h-5" />
                      )}
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

        {/* FREQUENTLY ASKED QUESTIONS */}
        <section id="faq" className="pt-2 scroll-mt-20">
          <h2 className="text-2xl font-bold font-serif text-[#0D2137] dark:text-[#F3F5F4] mb-4">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2.5">
              {FAQS.filter((f) => f.col === 'left').map((faq) => (
                <details
                  key={faq.q}
                  className="group bg-white dark:bg-[#161C19] rounded-xl border border-[#EAE4D9] dark:border-[#28322C] px-4 py-3 shadow-xs"
                >
                  <summary className="flex items-center justify-between cursor-pointer list-none text-xs sm:text-sm font-semibold text-[#0D2137] dark:text-[#F3F5F4]">
                    <span>{faq.q}</span>
                    <span className="text-gray-500 dark:text-slate-400 font-bold text-base group-open:rotate-45 transition-transform">
                      +
                    </span>
                  </summary>
                  <p className="mt-2.5 text-xs text-gray-600 dark:text-slate-300 leading-relaxed border-t border-gray-100 dark:border-[#28322C] pt-2.5">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
            <div className="space-y-2.5">
              {FAQS.filter((f) => f.col === 'right').map((faq) => (
                <details
                  key={faq.q}
                  className="group bg-white dark:bg-[#161C19] rounded-xl border border-[#EAE4D9] dark:border-[#28322C] px-4 py-3 shadow-xs"
                >
                  <summary className="flex items-center justify-between cursor-pointer list-none text-xs sm:text-sm font-semibold text-[#0D2137] dark:text-[#F3F5F4]">
                    <span>{faq.q}</span>
                    <span className="text-gray-500 dark:text-slate-400 font-bold text-base group-open:rotate-45 transition-transform">
                      +
                    </span>
                  </summary>
                  <p className="mt-2.5 text-xs text-gray-600 dark:text-slate-300 leading-relaxed border-t border-gray-100 dark:border-[#28322C] pt-2.5">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

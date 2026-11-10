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

export const metadata: Metadata = {
  title: 'Sensory Visual Timers | Calming Visual Countdown Timers Collection',
  description:
    'Explore a collection of calm, visually engaging sensory timers with gentle motion and distraction-free designs—including Sand, Liquid, Rainbow, Bubble, Frost, Snow, Lichen, and Moon Timers.',
  alternates: {
    canonical: '/timers/sensory-timers',
  },
  openGraph: {
    title: 'Sensory Visual Timers | Calming Visual Countdown Timers Collection',
    description:
      'A collection of calm, visually engaging timers with gentle motion and distraction-free designs. Choose a style that helps you stay on track, focused and relaxed.',
    url: '/timers/sensory-timers',
    type: 'website',
  },
};

const SETTINGS_AT_A_GLANCE = [
  'Mute or enable sound',
  'Adjust motion level',
  'Show or hide numeric time',
  'Use fullscreen mode',
  'Choose a visual style',
  'Use a high-contrast display',
  'Keyboard-accessible controls',
];

const FAQS = [
  {
    q: 'What are sensory timers used for?',
    a: 'Sensory timers are used for study sessions, classroom transitions, reading blocks, quiet breaks, creative work, and everyday time management where a calm, visual representation of elapsed time is preferred over a loud or abrupt clock.',
    col: 'left',
  },
  {
    q: 'Do these timers have sound?',
    a: 'All sensory timers can be used completely silently. You can keep sound muted for a quiet, distraction-free experience or enable a gentle completion chime if you prefer an audio cue when time reaches zero.',
    col: 'left',
  },
  {
    q: 'Can I reduce or turn off the animation?',
    a: 'Yes. Every timer in this collection includes adjustable animation speed or a Reduced Motion setting so you can choose gentle, minimal motion that feels comfortable on your screen.',
    col: 'left',
  },
  {
    q: 'Do the timers show the remaining time?',
    a: 'Yes! Each timer includes a clear digital MM:SS readout alongside the visual animation, and also provides a Show Time toggle if you prefer a purely visual-only display.',
    col: 'left',
  },
  {
    q: 'Are these timers free to use?',
    a: 'Yes, every timer in the Sensory Visual Timers collection is 100% free to use online with no registration, subscription, or downloads required.',
    col: 'right',
  },
  {
    q: 'Can I use them in a classroom?',
    a: 'Yes! Teachers frequently project these timers in fullscreen mode on classroom boards to help students see how much time remains during quiet reading, group activities, and transitions.',
    col: 'right',
  },
  {
    q: 'Do they work on mobile devices?',
    a: 'Yes. All eight sensory timers work smoothly in modern web browsers across smartphones, tablets, Chromebooks, laptops, and desktop monitors.',
    col: 'right',
  },
  {
    q: 'Are these timers suitable for all ages?',
    a: 'Yes. Their clean, low-distraction visuals and flexible display options make them practical and enjoyable for children, students, teachers, and adults alike.',
    col: 'right',
  },
];

export default function SensoryTimersCollectionPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
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
            name: 'Sensory Timers',
            item: 'https://WebCountDownTimer.com/timers/sensory-timers',
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
      <section className="relative overflow-hidden border-b border-[#EAE4D9] dark:border-[#242E28] bg-gradient-to-r from-[#FAF8F4] via-[#F7F3EA] to-[#EAE0CE] dark:from-[#121815] dark:via-[#161D19] dark:to-[#1E221D]">
        {/* Right-side serene interior shelf illustration (potted plant, glowing orb lamp, framed forest art, stacked books) */}
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

            {/* Warm wooden tabletop */}
            <rect x="240" y="254" width="560" height="66" fill="#C99E67" />
            <rect x="240" y="254" width="560" height="5" fill="#DFB885" />

            {/* Framed Misty Pine Forest Artwork on Right */}
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
              {/* Inner landscape painting */}
              <rect x="20" y="22" width="108" height="176" fill="#D5E0DC" />
              <path
                d="M20,140 L55,95 L92,130 L128,85 L128,198 L20,198 Z"
                fill="#88A299"
              />
              {/* Painted pine silhouettes */}
              {[36, 56, 76, 98, 114].map((px, idx) => (
                <g
                  key={idx}
                  transform={`translate(${px}, 196) scale(${
                    idx % 2 === 0 ? 0.55 : 0.45
                  })`}
                >
                  <polygon points="0,-130 -32,-65 32,-65" fill="#2F4F3E" />
                  <polygon points="0,-95 -38,-30 38,-30" fill="#254032" />
                  <polygon points="0,-60 -44,0 44,0" fill="#1C3327" />
                </g>
              ))}
            </g>

            {/* Stacked Linen Books on Right */}
            <g transform="translate(658, 206)">
              <rect
                x="0"
                y="30"
                width="126"
                height="18"
                rx="3"
                fill="#D6CFC2"
                stroke="#B8B0A0"
              />
              <rect
                x="6"
                y="14"
                width="116"
                height="16"
                rx="3"
                fill="#E5DFD3"
                stroke="#C5BDB0"
              />
              <rect
                x="12"
                y="0"
                width="104"
                height="14"
                rx="3"
                fill="#EFECE4"
                stroke="#CFC8BC"
              />
            </g>

            {/* Glowing Textured Orb Lamp on Brass Pedestal */}
            <g transform="translate(520, 184)">
              {/* Brass cylindrical base */}
              <rect
                x="-26"
                y="46"
                width="52"
                height="24"
                rx="4"
                fill="#C89D54"
              />
              <rect
                x="-22"
                y="46"
                width="14"
                height="24"
                fill="#E8C57B"
                opacity="0.7"
              />
              {/* Glowing sphere */}
              <circle cx="0" cy="8" r="46" fill="#FFF8DC" />
              <circle
                cx="0"
                cy="8"
                r="42"
                fill="#FFFDF2"
                stroke="#F5DEB3"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
            </g>

            {/* Lush Green Houseplant in White Ceramic Pot */}
            <g transform="translate(390, 172)">
              {/* Cascading & upright leaves */}
              <path
                d="M10,12 C-35,-25 -75,15 -65,55 C-35,45 -10,25 10,12 Z"
                fill="#3A7D3B"
              />
              <path
                d="M15,5 C-25,-55 -45,-85 -15,-105 C10,-85 20,-40 15,5 Z"
                fill="#2E6830"
              />
              <path
                d="M28,6 C15,-65 55,-100 85,-80 C70,-40 45,-5 28,6 Z"
                fill="#468E47"
              />
              <path
                d="M35,15 C65,-25 105,-25 112,8 C80,22 55,22 35,15 Z"
                fill="#357436"
              />
              <path
                d="M22,22 C-5,35 -35,65 -20,90 C5,75 20,45 22,22 Z"
                fill="#4E9A4F"
              />
              {/* Ceramic pot */}
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
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-slate-400 mb-3"
          >
            <Link href="/" className="hover:text-[#1A5D34] dark:hover:text-[#6CC49B] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
            <Link
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

            {/* Feature Badges */}
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
        {/* Interactive Filters + 8 Sensory Timer Cards + 4-Column Accessibility Strip */}
        <SensoryTimersCollectionClient />

        {/* THREE-COLUMN GUIDE & SIDEBARS */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-2">
          {/* LEFT SIDEBAR: On This Page */}
          <aside className="lg:col-span-3">
            <div className="bg-white dark:bg-[#161C19] rounded-2xl p-5 border border-[#EAE4D9] dark:border-[#28322C] shadow-xs">
              <h3 className="text-sm font-bold font-serif text-[#0D2137] dark:text-[#F3F5F4] mb-3">
                On This Page
              </h3>
              <ul className="space-y-2.5 text-xs font-medium text-[#374151] dark:text-slate-300">
                <li>
                  <a
                    href="#what-are-sensory-timers"
                    className="flex items-start gap-2 hover:text-[#1A5D34] dark:hover:text-[#6CC49B] transition-colors"
                  >
                    <span className="text-[#1A5D34] dark:text-[#6CC49B] mt-0.5">▶</span>
                    <span>What Are Sensory Timers?</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#different-types"
                    className="flex items-start gap-2 hover:text-[#1A5D34] dark:hover:text-[#6CC49B] transition-colors"
                  >
                    <span className="text-[#1A5D34] dark:text-[#6CC49B] mt-0.5">▶</span>
                    <span>Different Types of Sensory Visual Timers</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#how-to-choose"
                    className="flex items-start gap-2 hover:text-[#1A5D34] dark:hover:text-[#6CC49B] transition-colors"
                  >
                    <span className="text-[#1A5D34] dark:text-[#6CC49B] mt-0.5">▶</span>
                    <span>How to Choose a Calming Timer Display</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#classrooms"
                    className="flex items-start gap-2 hover:text-[#1A5D34] dark:hover:text-[#6CC49B] transition-colors"
                  >
                    <span className="text-[#1A5D34] dark:text-[#6CC49B] mt-0.5">▶</span>
                    <span>Sensory Timers for Classrooms</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#everyday-routines"
                    className="flex items-start gap-2 hover:text-[#1A5D34] dark:hover:text-[#6CC49B] transition-colors"
                  >
                    <span className="text-[#1A5D34] dark:text-[#6CC49B] mt-0.5">▶</span>
                    <span>Sensory Timers for Everyday Routines</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#accessibility-settings"
                    className="flex items-start gap-2 hover:text-[#1A5D34] dark:hover:text-[#6CC49B] transition-colors"
                  >
                    <span className="text-[#1A5D34] dark:text-[#6CC49B] mt-0.5">▶</span>
                    <span>Sound, Motion and Accessibility Settings</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#faq"
                    className="flex items-start gap-2 hover:text-[#1A5D34] dark:hover:text-[#6CC49B] transition-colors"
                  >
                    <span className="text-[#1A5D34] dark:text-[#6CC49B] mt-0.5">▶</span>
                    <span>Frequently Asked Questions</span>
                  </a>
                </li>
              </ul>
            </div>
          </aside>

          {/* CENTER GUIDE CONTENT */}
          <article className="lg:col-span-6 space-y-5 text-[#1F2937] dark:text-slate-200">
            <div>
              <div className="text-[11px] font-extrabold tracking-[0.14em] uppercase text-[#1A5D34] dark:text-[#6CC49B] mb-1">
                A COMPLETE GUIDE
              </div>
              <h2
                id="what-are-sensory-timers"
                className="text-2xl font-bold font-serif text-[#0D2137] dark:text-[#F3F5F4] mb-2 scroll-mt-20"
              >
                What Are Sensory Timers?
              </h2>
              <p className="text-sm text-[#374151] dark:text-slate-300 leading-relaxed">
                Sensory timers are visual countdown timers designed with calm,
                engaging animations. They use simple, soothing visuals such as
                sand, liquid, bubbles or nature-inspired scenes to show the
                passage of time in a clear and easy-to-follow way.
              </p>
            </div>

            <div>
              <h2
                id="different-types"
                className="text-2xl font-bold font-serif text-[#0D2137] dark:text-[#F3F5F4] mb-2 scroll-mt-20"
              >
                Different Types of Sensory Visual Timers
              </h2>
              <p className="text-sm text-[#374151] dark:text-slate-300 leading-relaxed">
                This collection includes a variety of visual styles, from
                classic formats like the{' '}
                <Link
                  href="/timers/sand-timer"
                  className="text-[#1A5D34] dark:text-[#6CC49B] font-semibold hover:underline"
                >
                  Sand Timer
                </Link>{' '}
                to creative options such as{' '}
                <Link
                  href="/timers/liquid-timer"
                  className="text-[#1A5D34] dark:text-[#6CC49B] font-semibold hover:underline"
                >
                  Liquid
                </Link>
                ,{' '}
                <Link
                  href="/timers/rainbow-timer"
                  className="text-[#1A5D34] dark:text-[#6CC49B] font-semibold hover:underline"
                >
                  Rainbow
                </Link>
                ,{' '}
                <Link
                  href="/timers/bubble-timer"
                  className="text-[#1A5D34] dark:text-[#6CC49B] font-semibold hover:underline"
                >
                  Bubble
                </Link>
                ,{' '}
                <Link
                  href="/timers/frost-timer"
                  className="text-[#1A5D34] dark:text-[#6CC49B] font-semibold hover:underline"
                >
                  Frost
                </Link>
                ,{' '}
                <Link
                  href="/timers/snow-timer"
                  className="text-[#1A5D34] dark:text-[#6CC49B] font-semibold hover:underline"
                >
                  Snow
                </Link>
                ,{' '}
                <Link
                  href="/timers/lichen-timer"
                  className="text-[#1A5D34] dark:text-[#6CC49B] font-semibold hover:underline"
                >
                  Lichen
                </Link>{' '}
                and{' '}
                <Link
                  href="/timers/moon-timer"
                  className="text-[#1A5D34] dark:text-[#6CC49B] font-semibold hover:underline"
                >
                  Moon Timers
                </Link>
                . Each style offers a unique look and a calm way to track time.
              </p>
            </div>

            <div>
              <h2
                id="how-to-choose"
                className="text-2xl font-bold font-serif text-[#0D2137] dark:text-[#F3F5F4] mb-2 scroll-mt-20"
              >
                How to Choose a Calming Timer Display
              </h2>
              <p className="text-sm text-[#374151] dark:text-slate-300 leading-relaxed">
                Pick a timer based on what feels most comfortable and engaging
                for you. If you prefer gentle movement, try the{' '}
                <Link
                  href="/timers/sand-timer"
                  className="text-[#1A5D34] dark:text-[#6CC49B] font-semibold hover:underline"
                >
                  Sand
                </Link>{' '}
                or{' '}
                <Link
                  href="/timers/lichen-timer"
                  className="text-[#1A5D34] dark:text-[#6CC49B] font-semibold hover:underline"
                >
                  Lichen Timer
                </Link>
                . If you enjoy colorful visuals, the{' '}
                <Link
                  href="/timers/rainbow-timer"
                  className="text-[#1A5D34] dark:text-[#6CC49B] font-semibold hover:underline"
                >
                  Rainbow
                </Link>{' '}
                or{' '}
                <Link
                  href="/timers/liquid-timer"
                  className="text-[#1A5D34] dark:text-[#6CC49B] font-semibold hover:underline"
                >
                  Liquid Timer
                </Link>{' '}
                may be a good fit.
              </p>
            </div>

            <div>
              <h2
                id="classrooms"
                className="text-2xl font-bold font-serif text-[#0D2137] dark:text-[#F3F5F4] mb-2 scroll-mt-20"
              >
                Sensory Timers for Classrooms
              </h2>
              <p className="text-sm text-[#374151] dark:text-slate-300 leading-relaxed">
                These timers are great for classroom activities such as focused
                work, transitions, reading time and group tasks. Their clear and
                calming visuals help everyone see the remaining time at a
                glance.
              </p>
            </div>

            <div>
              <h2
                id="everyday-routines"
                className="text-2xl font-bold font-serif text-[#0D2137] dark:text-[#F3F5F4] mb-2 scroll-mt-20"
              >
                Sensory Timers for Everyday Routines
              </h2>
              <p className="text-sm text-[#374151] dark:text-slate-300 leading-relaxed">
                Use a sensory timer for study sessions, short breaks, chores,
                creative work or personal routines. They make time management
                simple and visually engaging.
              </p>
            </div>

            <div>
              <h2
                id="accessibility-settings"
                className="text-2xl font-bold font-serif text-[#0D2137] dark:text-[#F3F5F4] mb-2 scroll-mt-20"
              >
                Sound, Motion and Accessibility Settings
              </h2>
              <p className="text-sm text-[#374151] dark:text-slate-300 leading-relaxed">
                Every sensory timer is built with low-distraction controls:
                audio can remain muted, animation speeds can be slowed down or
                switched to reduced-motion mode, numeric displays can be shown
                or hidden, and all controls are keyboard accessible.
              </p>
            </div>
          </article>

          {/* RIGHT SIDEBAR: Settings at a Glance + High-Contrast Alternative */}
          <aside className="lg:col-span-3 space-y-4">
            {/* Settings at a Glance */}
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

            {/* High-Contrast Alternative */}
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
              <Link
                href="/countdown-timer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1A5D34] dark:text-[#6CC49B] hover:underline"
              >
                <span>Open High-Contrast Countdown →</span>
              </Link>
            </div>
          </aside>
        </section>

        {/* FULL-WIDTH GENERAL-PURPOSE DISCLAIMER BANNER */}
        <div className="bg-[#F8EDD6] dark:bg-[#241E16] border border-[#E6D4B2] dark:border-[#3D3122] rounded-xl px-5 py-3.5 flex items-start gap-3">
          <Info className="w-5 h-5 text-[#9A5B13] dark:text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs sm:text-[13px] text-[#2B2118] dark:text-slate-200 leading-relaxed">
            <strong className="font-bold text-[#0D2137] dark:text-white">Note:</strong> These
            are general-purpose visual timers for time management, focus and
            activity planning. They are not designed to diagnose, treat or
            replace any professional advice or medical support.
          </p>
        </div>

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

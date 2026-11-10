import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ChevronRight,
  TrainFront,
  Settings,
  Monitor,
  CheckCircle2,
  BookOpen,
  Users,
  Laptop,
  Coffee,
  Calendar,
  Clock,
  Lightbulb,
  Plus,
  Play,
  Info,
} from 'lucide-react';
import TrainTimerComponent from '@/components/tools/TrainTimerComponent';

export const metadata: Metadata = {
  title: 'Free Online Train Timer — Railway Departure Board Countdown',
  description:
    'A railway station–inspired countdown timer with a split-flap departure board, custom session names, station themes, and an animated train route progress bar.',
  alternates: {
    canonical: '/timers/train-timer',
  },
  openGraph: {
    title: 'Free Online Train Timer — Railway Departure Board Countdown',
    description:
      'Manage classroom transitions, presentations, study sessions, and events with a realistic railway departure board and moving train countdown timer.',
    url: '/timers/train-timer',
    type: 'website',
  },
};

const POPULAR_USES = [
  {
    title: 'Classroom Transitions',
    desc: 'Move smoothly between activities.',
    icon: BookOpen,
  },
  {
    title: 'Presentations',
    desc: 'Keep your session on schedule.',
    icon: Users,
  },
  {
    title: 'Study Sessions',
    desc: 'Stay focused with a clear timer.',
    icon: Laptop,
  },
  {
    title: 'Breaks',
    desc: 'Add a fun and visual break timer.',
    icon: Coffee,
  },
  {
    title: 'Event Activities',
    desc: 'Manage games, challenges and events.',
    icon: Calendar,
  },
  {
    title: 'Routine Planning',
    desc: 'Keep daily tasks on track.',
    icon: Clock,
  },
];

const TOC_ITEMS = [
  { id: 'what-is-train-timer', label: 'What Is a Train Timer?' },
  { id: 'how-departure-board-works', label: 'How the Departure Board Countdown Works' },
  { id: 'how-to-use-train-timer', label: 'How to Use the Train Timer' },
  { id: 'classroom-and-events', label: 'Train Timer for Classroom Activities and Events' },
  { id: 'customize-departure-display', label: 'Customize the Departure Display' },
  { id: 'faq', label: 'Frequently Asked Questions' },
];

const FAQ_LEFT = [
  {
    q: 'Is the train timer free to use?',
    a: 'Yes, the Free Online Train Timer is 100% free with no account sign-up, downloads, or usage limits.',
  },
  {
    q: 'Can I set a custom duration?',
    a: 'Yes. Choose from quick presets (1, 3, 5, 10, or 25 minutes), enter any custom minute and second duration, or switch to End Time mode to count down to a specific clock time.',
  },
  {
    q: 'Can I change the session name?',
    a: 'Yes! Use the Session Name input field to display custom labels such as "Next Activity", "Presentation Starts", "Break Ends", or any custom title directly on the departure board.',
  },
  {
    q: 'Does it work on mobile devices?',
    a: 'Yes, the departure board and moving train route automatically adapt to smartphones, tablets, laptops, desktop monitors, and classroom smartboards.',
  },
];

const FAQ_RIGHT = [
  {
    q: 'Is this a real train timetable or live departure tracker?',
    a: 'No. This tool is a user-configured visual countdown timer inspired by railway station departure boards. It does not display live train timetables, railway departure tracking, or real-time public transport data.',
  },
  {
    q: 'Can I turn off the sound?',
    a: 'Yes. Toggle the Sound switch off at any time for silent study sessions, exams, or quiet classroom transitions.',
  },
  {
    q: 'Can I use it for classroom activities?',
    a: 'Absolutely. Teachers and facilitators use the Train Timer for station rotations, cleanup transitions, reading blocks, and travel-themed classroom games.',
  },
  {
    q: 'What happens when the timer ends?',
    a: 'When the countdown reaches 00:00, the train arrives at the ARRIVAL station, the departure board updates to ARRIVED • ON TIME, and an optional station PA chime plays.',
  },
];

export default function TrainTimerPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Free Online Train Timer',
        url: 'https://WebCountDownTimer.com/timers/train-timer',
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'All',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        description:
          'A railway station–inspired visual countdown timer featuring a split-flap departure board, custom session names, station themes, and an animated train route progress bar.',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://WebCountDownTimer.com/' },
          { '@type': 'ListItem', position: 2, name: 'Timers', item: 'https://WebCountDownTimer.com/tools' },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Train Timer',
            item: 'https://WebCountDownTimer.com/timers/train-timer',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [...FAQ_LEFT, ...FAQ_RIGHT].map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.a,
          },
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#F5F7F5] dark:bg-[#0F1311] text-[#17211B] dark:text-slate-100 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HERO BANNER WITH RAILWAY STATION CLOCK & PLATFORM 1 DEPARTURE BOARD */}
      <section className="relative overflow-hidden border-b border-[#DCE3DD] dark:border-[#242C27] bg-gradient-to-r from-[#FAFBFA] via-[#F2F5F2] to-[#E6DEC8] dark:from-[#131815] dark:via-[#181E1A] dark:to-[#241E16]">
        {/* Right-side Grand Railway Terminal Illustration */}
        <div
          aria-hidden="true"
          className="hidden lg:flex absolute inset-y-0 right-0 w-[48%] items-center justify-end pr-8 pointer-events-none select-none overflow-hidden [mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.55)_32%,black_62%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.55)_32%,black_62%)]"
        >
          {/* Golden-hour Concourse Backdrop */}
          <div
            className="absolute inset-0 opacity-95"
            style={{
              background:
                'linear-gradient(90deg, rgba(56,42,28,0) 0%, rgba(56,42,28,0.82) 50%, rgba(24,18,12,0.96) 100%)',
            }}
          />
          <div className="absolute top-4 right-64 w-44 h-44 rounded-full bg-amber-300/25 blur-2xl" />
          <div className="absolute bottom-2 right-12 w-52 h-52 rounded-full bg-orange-400/20 blur-2xl" />

          {/* Hanging Vintage Station Analog Clock */}
          <div className="relative z-10 flex flex-col items-center mr-6 -mt-8">
            <div className="w-1.5 h-8 bg-stone-700" />
            <div className="w-20 h-20 rounded-full bg-[#FDFBF7] border-4 border-[#3E3227] shadow-xl flex items-center justify-center relative">
              <div className="w-16 h-16 rounded-full border border-stone-300 flex items-center justify-center relative">
                <span className="absolute top-1 text-[8px] font-serif font-bold text-stone-800">
                  XII
                </span>
                <span className="absolute right-1.5 text-[8px] font-serif font-bold text-stone-800">
                  III
                </span>
                <span className="absolute bottom-1 text-[8px] font-serif font-bold text-stone-800">
                  VI
                </span>
                <span className="absolute left-1.5 text-[8px] font-serif font-bold text-stone-800">
                  IX
                </span>
                {/* Clock hands */}
                <div className="w-1 h-4 bg-stone-900 rounded-full origin-bottom -translate-y-2 rotate-[-35deg]" />
                <div className="w-0.5 h-5 bg-stone-900 rounded-full origin-bottom -translate-y-2.5 rotate-[15deg]" />
                <div className="w-2 h-2 rounded-full bg-stone-900" />
              </div>
            </div>
          </div>

          {/* PLATFORM 1 Departure Board & Express Train Preview */}
          <div className="relative z-10 flex flex-col items-end gap-3 mr-4">
            <div className="rounded-xl p-3 bg-[#1A1614] border-2 border-[#57493D] shadow-2xl w-64">
              <div className="text-center font-mono text-xs font-extrabold tracking-[0.2em] text-amber-100 border-b border-white/15 pb-1.5 mb-2">
                PLATFORM 1
              </div>
              <div className="space-y-1 font-mono text-[10px]">
                <div className="flex justify-between text-amber-400 bg-black/50 px-2 py-0.5 rounded">
                  <span>11:30 CENTRAL</span>
                  <span>ON TIME</span>
                </div>
                <div className="flex justify-between text-amber-300/90 bg-black/50 px-2 py-0.5 rounded">
                  <span>11:45 EXPRESS</span>
                  <span>PLAT 1</span>
                </div>
                <div className="flex justify-between text-amber-300/80 bg-black/50 px-2 py-0.5 rounded">
                  <span>12:00 VALLEY</span>
                  <span>PLAT 2</span>
                </div>
              </div>
            </div>

            {/* Sleek Passenger Train on Right Platform */}
            <div className="w-72 h-14 rounded-l-2xl bg-gradient-to-r from-stone-200 via-stone-100 to-stone-300 border-2 border-stone-500 shadow-lg flex items-center px-4 gap-3 overflow-hidden">
              <div className="w-10 h-8 rounded-l-lg bg-sky-900/80 border border-stone-600" />
              <div className="w-14 h-7 rounded bg-amber-100/90 border border-stone-500" />
              <div className="w-14 h-7 rounded bg-amber-100/90 border border-stone-500" />
              <div className="w-14 h-7 rounded bg-amber-100/90 border border-stone-500" />
            </div>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-9">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs text-[#4A554E] dark:text-slate-400 mb-3"
          >
            <Link href="/" className="hover:text-[#124E35] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            <Link href="/tools" className="hover:text-[#124E35] transition-colors">
              Timers
            </Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            <span className="font-semibold text-[#17211B] dark:text-white">Train Timer</span>
          </nav>

          {/* Kicker & H1 */}
          <div className="max-w-2xl">
            <div className="text-xs font-extrabold tracking-[0.16em] uppercase text-[#B91C1C] dark:text-rose-400 mb-1.5">
              TRAIN TIMER
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold text-[#0E2338] dark:text-white tracking-tight leading-tight">
              Free Online Train Timer
            </h1>
            <p className="mt-2.5 text-sm sm:text-base text-[#2B352E] dark:text-slate-300 leading-relaxed max-w-xl">
              A railway station–inspired countdown timer that helps you manage activities with a
              fun and realistic train theme.
            </p>

            {/* 4 Feature Badges Row */}
            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-[#1E2822] dark:text-slate-200">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-[#B91C1C] text-white flex items-center justify-center shadow-2xs">
                  <TrainFront className="w-3.5 h-3.5" />
                </span>
                <span>Station-style countdown</span>
              </div>
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#2B352E] dark:text-slate-300" />
                <span>Customizable display</span>
              </div>
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-[#2B352E] dark:text-slate-300" />
                <span>Works on all devices</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#124E35] dark:text-emerald-400" />
                <span>Free to use</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-12">
        {/* INTERACTIVE TRAIN TIMER + ROUTE + QUICK PRESETS */}
        <TrainTimerComponent initialMinutes={25} />

        {/* POPULAR USES SECTION */}
        <section aria-labelledby="popular-uses-heading">
          <h2
            id="popular-uses-heading"
            className="font-serif text-xl sm:text-2xl font-bold text-[#142018] dark:text-white"
          >
            Popular Uses
          </h2>
          <p className="text-xs sm:text-sm text-[#4A554E] dark:text-slate-400 mt-0.5 mb-4">
            A train timer is great for many everyday activities.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            {POPULAR_USES.map((use) => {
              const Icon = use.icon;
              return (
                <div
                  key={use.title}
                  className="flex items-start gap-3 p-3.5 rounded-2xl bg-white dark:bg-[#161B18] border border-[#DCE3DD] dark:border-[#262E29] shadow-2xs"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-[#15803D] dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-[#142018] dark:text-white leading-snug">
                      {use.title}
                    </h3>
                    <p className="text-[11px] text-[#526056] dark:text-slate-400 mt-0.5 leading-snug">
                      {use.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3-COLUMN GUIDE, TOC & RELATED TOOLS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
          {/* LEFT SIDEBAR: ON THIS PAGE + QUOTE CARD */}
          <aside className="lg:col-span-3 space-y-6 lg:sticky lg:top-24">
            <div className="rounded-2xl bg-white dark:bg-[#161B18] border border-[#DCE3DD] dark:border-[#262E29] p-5 shadow-2xs">
              <h3 className="text-sm font-bold text-[#142018] dark:text-white mb-3">
                On This Page
              </h3>
              <ul className="space-y-2.5 text-xs font-medium text-[#37433B] dark:text-slate-300">
                {TOC_ITEMS.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="flex items-start gap-2 hover:text-[#15803D] dark:hover:text-emerald-400 transition-colors"
                    >
                      <span className="text-[#15803D] dark:text-emerald-400 mt-0.5">▸</span>
                      <span>{item.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Illustrated Railway Quote Card */}
            <div className="rounded-2xl overflow-hidden bg-[#EEF3EE] dark:bg-[#18201B] border border-[#DCE3DD] dark:border-[#262E29] shadow-2xs">
              <div
                className="h-40 w-full relative flex flex-col items-center justify-end p-4 overflow-hidden"
                style={{
                  background:
                    'linear-gradient(180deg, #432818 0%, #99582A 45%, #E07A5F 80%, #2B2D42 100%)',
                }}
              >
                {/* Sunset Glow & Express Train Silhouette */}
                <div className="w-24 h-24 rounded-full bg-amber-300/40 blur-xl absolute top-4 left-8" />
                <div className="relative z-10 w-full flex items-end justify-center">
                  <div className="w-44 h-14 rounded-t-xl bg-gradient-to-r from-[#B91C1C] via-[#DC2626] to-[#EAB308] border-2 border-stone-900 shadow-lg flex items-center justify-around px-3">
                    <span className="w-6 h-5 rounded-xs bg-amber-100" />
                    <span className="w-6 h-5 rounded-xs bg-amber-100" />
                    <span className="w-8 h-6 rounded-xs bg-sky-200" />
                  </div>
                </div>
                <div className="w-full h-1.5 bg-stone-800 mt-0.5" />
              </div>

              <div className="p-5 text-center">
                <p className="font-serif italic text-sm sm:text-base text-[#17211B] dark:text-slate-100 leading-relaxed">
                  “A fun and visual countdown that keeps your activities on track.”
                </p>
                <div className="mt-3 flex items-center justify-center gap-3">
                  <span className="h-[1px] w-10 bg-[#B8C4BA] dark:bg-slate-700" />
                  <span className="w-7 h-7 rounded-md bg-[#16241B] text-white flex items-center justify-center shadow-2xs">
                    <TrainFront className="w-4 h-4" />
                  </span>
                  <span className="h-[1px] w-10 bg-[#B8C4BA] dark:bg-slate-700" />
                </div>
              </div>
            </div>
          </aside>

          {/* CENTER COLUMN: SEO CONTENT SECTIONS */}
          <article className="lg:col-span-6 space-y-8 bg-white dark:bg-[#161B18] border border-[#DCE3DD] dark:border-[#262E29] rounded-3xl p-6 sm:p-8 shadow-2xs">
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#15803D] dark:text-emerald-400 mb-1">
                A COMPLETE GUIDE
              </div>
              <h2
                id="what-is-train-timer"
                className="font-serif text-2xl sm:text-3xl font-extrabold text-[#0E2338] dark:text-white tracking-tight scroll-mt-24"
              >
                What Is a Train Timer?
              </h2>
              <p className="mt-3 text-sm sm:text-base text-[#2B352E] dark:text-slate-300 leading-relaxed">
                A train timer is a user-configured visual countdown that uses a railway departure
                board theme and a moving train animation to show the passage of time. It’s a fun
                and engaging way to keep activities, sessions and events on schedule.
              </p>
            </div>

            <div className="border-t border-[#E6ECE8] dark:border-[#252D28] pt-6">
              <h2
                id="how-departure-board-works"
                className="font-serif text-xl sm:text-2xl font-extrabold text-[#0E2338] dark:text-white tracking-tight scroll-mt-24"
              >
                How the Departure Board Countdown Works
              </h2>
              <p className="mt-2.5 text-sm sm:text-base text-[#2B352E] dark:text-slate-300 leading-relaxed">
                The tool counts down from your selected duration, updates the time on a realistic
                departure board and moves a train along a short route. As time progresses, the
                train moves closer to the destination, and the countdown reaches zero when the
                journey is complete.
              </p>
            </div>

            <div className="border-t border-[#E6ECE8] dark:border-[#252D28] pt-6">
              <h2
                id="how-to-use-train-timer"
                className="font-serif text-xl sm:text-2xl font-extrabold text-[#0E2338] dark:text-white tracking-tight scroll-mt-24"
              >
                How to Use the Train Timer
              </h2>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                <ol className="sm:col-span-7 space-y-3 text-sm text-[#2B352E] dark:text-slate-300">
                  {[
                    'Enter a duration or choose a preset time.',
                    'Add a session name (e.g., “Next Activity”).',
                    'Pick a train theme and style.',
                    'Click Start to begin the countdown.',
                    'Use Pause and Reset as needed.',
                  ].map((step, i) => (
                    <li key={step} className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-[#15803D] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>

                {/* Tip Box */}
                <div className="sm:col-span-5 rounded-2xl bg-[#EAF4EC] dark:bg-emerald-950/30 border border-[#C6E0CC] dark:border-emerald-900/50 p-4">
                  <div className="flex items-center gap-2 font-serif font-bold italic text-base text-[#142018] dark:text-white mb-1.5">
                    <Lightbulb className="w-4 h-4 text-[#15803D] dark:text-emerald-400 shrink-0" />
                    <span>Tip</span>
                  </div>
                  <p className="text-xs text-[#2B352E] dark:text-slate-300 leading-relaxed">
                    Use a clear session name and duration so everyone knows what’s coming next.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-[#E6ECE8] dark:border-[#252D28] pt-6">
              <h2
                id="classroom-and-events"
                className="font-serif text-xl sm:text-2xl font-extrabold text-[#0E2338] dark:text-white tracking-tight scroll-mt-24"
              >
                Train Timer for Classroom Activities and Events
              </h2>
              <p className="mt-2.5 text-sm sm:text-base text-[#2B352E] dark:text-slate-300 leading-relaxed">
                A train timer is perfect for schools, workshops and events. It helps manage
                transitions, group activities, presentations and timed challenges with a clear,
                visual countdown that’s easy to follow and keeps everyone engaged.
              </p>
            </div>

            <div className="border-t border-[#E6ECE8] dark:border-[#252D28] pt-6">
              <h2
                id="customize-departure-display"
                className="font-serif text-xl sm:text-2xl font-extrabold text-[#0E2338] dark:text-white tracking-tight scroll-mt-24"
              >
                Customize the Departure Display
              </h2>
              <p className="mt-2.5 text-sm sm:text-base text-[#2B352E] dark:text-slate-300 leading-relaxed">
                You can change the session name, duration, train theme, train style and other
                display settings such as sound and fullscreen. This lets you create a countdown
                that matches your classroom, event or personal style.
              </p>
            </div>
          </article>

          {/* RIGHT SIDEBAR: IMPORTANT NOTE + RELATED TOOLS */}
          <aside className="lg:col-span-3 space-y-6 lg:sticky lg:top-24">
            {/* Important Note Box */}
            <div className="rounded-2xl bg-[#EEF5F0] dark:bg-[#18221C] border border-[#CFE0D4] dark:border-[#2A3B30] p-5 shadow-2xs">
              <div className="flex items-center gap-2 text-[#14532D] dark:text-emerald-400 font-serif font-extrabold text-base mb-2">
                <Info className="w-5 h-5 shrink-0" />
                <h3>Important Note</h3>
              </div>
              <p className="text-xs text-[#2B352E] dark:text-slate-300 leading-relaxed">
                This is a user-configured visual countdown timer. It is not a live train timetable,
                railway departure tracker or real-time transport information service.
              </p>
            </div>

            {/* Related Tools Card */}
            <div className="rounded-2xl bg-white dark:bg-[#161B18] border border-[#DCE3DD] dark:border-[#262E29] p-5 shadow-2xs">
              <h3 className="text-sm font-bold text-[#142018] dark:text-white mb-3.5">
                Related Tools
              </h3>
              <div className="space-y-2.5">
                <Link
                  href="/timers/flip-clock"
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#F2F6F3] dark:hover:bg-[#1E2621] transition-colors group"
                >
                  <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-[#B91C1C] flex items-center justify-center shrink-0">
                    <TrainFront className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#142018] dark:text-white group-hover:text-[#15803D] transition-colors truncate">
                      Flip Clock
                    </div>
                    <div className="text-[11px] text-[#526056] dark:text-slate-400 truncate">
                      A station-style split-flap clock.
                    </div>
                  </div>
                </Link>

                <Link
                  href="/timers/flip-timer"
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#F2F6F3] dark:hover:bg-[#1E2621] transition-colors group"
                >
                  <div className="w-9 h-9 rounded-xl bg-stone-900 text-white font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    00
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#142018] dark:text-white group-hover:text-[#15803D] transition-colors truncate">
                      Flip Timer
                    </div>
                    <div className="text-[11px] text-[#526056] dark:text-slate-400 truncate">
                      A retro split-flap countdown.
                    </div>
                  </div>
                </Link>

                <Link
                  href="/timers/progress-timer"
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#F2F6F3] dark:hover:bg-[#1E2621] transition-colors group"
                >
                  <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center shrink-0">
                    <span className="flex items-end gap-0.5 h-4">
                      <span className="w-1 h-2 bg-amber-500 rounded-xs" />
                      <span className="w-1 h-3 bg-amber-500 rounded-xs" />
                      <span className="w-1 h-4 bg-amber-600 rounded-xs" />
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#142018] dark:text-white group-hover:text-[#15803D] transition-colors truncate">
                      Progress Timer
                    </div>
                    <div className="text-[11px] text-[#526056] dark:text-slate-400 truncate">
                      A visual progress bar timer.
                    </div>
                  </div>
                </Link>

                <Link
                  href="/timers/circular-timer"
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#F2F6F3] dark:hover:bg-[#1E2621] transition-colors group"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center shrink-0">
                    <span className="w-5 h-5 rounded-full border-4 border-emerald-500" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#142018] dark:text-white group-hover:text-[#15803D] transition-colors truncate">
                      Circular Timer
                    </div>
                    <div className="text-[11px] text-[#526056] dark:text-slate-400 truncate">
                      A simple circular countdown.
                    </div>
                  </div>
                </Link>

                <Link
                  href="/visual-timer"
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#F2F6F3] dark:hover:bg-[#1E2621] transition-colors group"
                >
                  <div className="w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-950/50 text-orange-600 flex items-center justify-center shrink-0">
                    <Play className="w-4 h-4 fill-current" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#142018] dark:text-white group-hover:text-[#15803D] transition-colors truncate">
                      Visual Timer
                    </div>
                    <div className="text-[11px] text-[#526056] dark:text-slate-400 truncate">
                      A calming visual countdown.
                    </div>
                  </div>
                </Link>

                <Link
                  href="/countdown-timer"
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#F2F6F3] dark:hover:bg-[#1E2621] transition-colors group"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    31
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#142018] dark:text-white group-hover:text-[#15803D] transition-colors truncate">
                      Countdown Timer
                    </div>
                    <div className="text-[11px] text-[#526056] dark:text-slate-400 truncate">
                      A simple numeric countdown.
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* FREQUENTLY ASKED QUESTIONS SECTION */}
        <section id="faq" aria-labelledby="faq-heading" className="pt-2 scroll-mt-24">
          <h2
            id="faq-heading"
            className="font-serif text-2xl sm:text-3xl font-extrabold text-[#0E2338] dark:text-white mb-5"
          >
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              {FAQ_LEFT.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-2xl bg-white dark:bg-[#161B18] border border-[#DCE3DD] dark:border-[#262E29] px-5 py-4 shadow-2xs"
                >
                  <summary className="flex items-center justify-between gap-3 cursor-pointer list-none text-sm font-bold text-[#142018] dark:text-white">
                    <span>{item.q}</span>
                    <Plus className="w-4 h-4 text-[#15803D] dark:text-emerald-400 shrink-0 transition-transform group-open:rotate-45" />
                  </summary>
                  <p className="mt-3 text-xs sm:text-sm text-[#4A554E] dark:text-slate-300 leading-relaxed border-t border-[#E6ECE8] dark:border-[#252D28] pt-3">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>

            <div className="space-y-3">
              {FAQ_RIGHT.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-2xl bg-white dark:bg-[#161B18] border border-[#DCE3DD] dark:border-[#262E29] px-5 py-4 shadow-2xs"
                >
                  <summary className="flex items-center justify-between gap-3 cursor-pointer list-none text-sm font-bold text-[#142018] dark:text-white">
                    <span>{item.q}</span>
                    <Plus className="w-4 h-4 text-[#15803D] dark:text-emerald-400 shrink-0 transition-transform group-open:rotate-45" />
                  </summary>
                  <p className="mt-3 text-xs sm:text-sm text-[#4A554E] dark:text-slate-300 leading-relaxed border-t border-[#E6ECE8] dark:border-[#252D28] pt-3">
                    {item.a}
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

import { buildPageMetadata } from '@/lib/seo-metadata';
import type { Metadata } from 'next';
import Link from 'next/link';
import BreadcrumbJsonLd from '@/components/common/BreadcrumbJsonLd';
import { ArrowRight, Tv, Trophy, Scale, Clock, Globe, Calculator } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/guides');
}

export default function GuidesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Guides & Standards', path: '/guides' },
        ]}
      />
      {/* Header */}
      <div className="space-y-4 border-b border-neutral-200 dark:border-neutral-800 pb-8">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-neutral-500">
          <Link prefetch={false} href="/" className="hover:text-neutral-900 dark:hover:text-white">
            Home
          </Link>
          <span>/</span>
          <span className="text-neutral-900 dark:text-white">Guides & Standards</span>
        </nav>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
          Timing Guides, Industry Rules & Calculation Standards
        </h1>
        <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-3xl leading-relaxed">
          Practical handbooks and verified timing tables for conference AV operators, Toastmasters timers, debate adjudicators, educators, and distributed teams working across international time zones.
        </p>

        {/* Quick Jump Table of Contents */}
        <div className="pt-2 flex flex-wrap gap-2">
          <a
            href="#stage-timer-setup"
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
          >
            1. Stage Confidence Monitors
          </a>
          <a
            href="#toastmasters-timing-rules"
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
          >
            2. Toastmasters Timing Rules
          </a>
          <a
            href="#debate-timing-bell-signals"
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
          >
            3. Debate Formats & POI Bells
          </a>
          <a
            href="#pomodoro-technique-guide"
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
          >
            4. Pomodoro & Study Cycles
          </a>
          <a
            href="#dst-and-non-integer-timezones"
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
          >
            5. IANA Time Zones & 2026 DST
          </a>
          <a
            href="#payroll-and-time-math"
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
          >
            6. Payroll & Decimal Hours Math
          </a>
          <Link prefetch={false}
            href="/guides/how-accurate-online-timers-work"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/70 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
          >
            7. How Accurate Online Timers Work (Epoch Delta & Provenance) →
          </Link>
        </div>
      </div>


      {/* Guide 1: Stage Confidence Monitor */}
      <article
        id="stage-timer-setup"
        className="p-6 sm:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-6"
      >
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            <Tv className="w-4 h-4" />
            <span>Stage Production & AV Engineering</span>
          </div>
          <span className="text-xs text-neutral-500">5 min read</span>
        </div>

        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
          1. How to Set Up a Multi-Screen Stage Confidence Monitor
        </h2>

        <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed">
          At live conferences, town halls, and worship services, presenters need to see their remaining speaking time without turning around to look at the main projection screen. A downstage <strong>confidence monitor</strong>—a floor wedge display placed at the foot of the stage facing the lectern—solves this problem by showing a high-contrast countdown visible only to the speaker.
        </p>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Step-by-Step Dual-Display Setup (Extended Desktop Mode)
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
            <li>
              <strong>Connect the HDMI/SDI Output in Extended Mode:</strong> Connect your control laptop to the downstage monitor or video switcher. In macOS System Settings (&gt; Displays) or Windows Display Settings (Win + P), select <em>Extend these displays</em> rather than Mirror mode.
            </li>
            <li>
              <strong>Launch the Stage Timer Display:</strong> Open the{' '}
              <Link prefetch={false} href="/stage-timer" className="text-blue-600 dark:text-blue-400 underline font-medium">
                Stage Timer
              </Link>{' '}
              or{' '}
              <Link prefetch={false} href="/speaker-timer" className="text-blue-600 dark:text-blue-400 underline font-medium">
                Speaker Timer
              </Link>{' '}
              and drag the browser window onto the extended downstage monitor.
            </li>
            <li>
              <strong>Enable Fullscreen & High-Contrast Green/Amber/Red Warnings:</strong> Click the Fullscreen button so browser tabs, URL bars, and OS docks disappear completely.
            </li>
            <li>
              <strong>Disable OS Sleep & Screen Savers:</strong> Before the first speaker walks onstage, disable automatic display sleep and enable Do Not Disturb so system pop-ups never appear on the stage monitor.
            </li>
          </ol>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse border border-neutral-200 dark:border-neutral-800">
            <thead>
              <tr className="bg-neutral-50 dark:bg-neutral-800/60 text-neutral-900 dark:text-white">
                <th className="p-3 border border-neutral-200 dark:border-neutral-800">Session Type</th>
                <th className="p-3 border border-neutral-200 dark:border-neutral-800">Total Slot</th>
                <th className="p-3 border border-neutral-200 dark:border-neutral-800">Amber Warning Cue</th>
                <th className="p-3 border border-neutral-200 dark:border-neutral-800">Red Wrap-Up / Q&amp;A Cue</th>
              </tr>
            </thead>
            <tbody className="text-neutral-700 dark:text-neutral-300">
              <tr>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800 font-medium">Lightning Talk</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">5:00</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">1:00 remaining</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">0:30 remaining</td>
              </tr>
              <tr>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800 font-medium">TED-Style Keynote</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">18:00</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">3:00 remaining</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">1:00 remaining</td>
              </tr>
              <tr>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800 font-medium">Conference Breakout (30m + 10m Q&amp;A)</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">40:00</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">10:00 remaining (Start Q&amp;A)</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">2:00 remaining</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold">
          <Link prefetch={false} href="/stage-timer" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
            <span>Open Stage Timer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link prefetch={false} href="/presentation-timer" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
            <span>Open Presentation Timer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link prefetch={false} href="/speech-time-calculator" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
            <span>Calculate Speech Word Count</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </article>

      {/* Guide 2: Toastmasters Timing Rules */}
      <article
        id="toastmasters-timing-rules"
        className="p-6 sm:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-6"
      >
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <Trophy className="w-4 h-4" />
            <span>Public Speaking Standards</span>
          </div>
          <span className="text-xs text-neutral-500">5 min read</span>
        </div>

        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
          2. Official Toastmasters Speech Timing & Contest Grace Window Rules
        </h2>

        <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed">
          In Toastmasters International club meetings and speech contests, the Timer uses three visual signal colors—<strong>Green</strong> (minimum qualifying time reached), <strong>Yellow/Amber</strong> (target midpoint), and <strong>Red</strong> (maximum time reached; wrap up immediately). Each signal card or background color remains displayed until the next threshold is reached or the speaker finishes.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse border border-neutral-200 dark:border-neutral-800">
            <thead>
              <tr className="bg-neutral-50 dark:bg-neutral-800/60 text-neutral-900 dark:text-white">
                <th className="p-3 border border-neutral-200 dark:border-neutral-800">Speech Category</th>
                <th className="p-3 border border-neutral-200 dark:border-neutral-800">Green Signal</th>
                <th className="p-3 border border-neutral-200 dark:border-neutral-800">Yellow Signal</th>
                <th className="p-3 border border-neutral-200 dark:border-neutral-800">Red Signal</th>
                <th className="p-3 border border-neutral-200 dark:border-neutral-800">Contest Qualifying Window (±30s Rule)</th>
              </tr>
            </thead>
            <tbody className="text-neutral-700 dark:text-neutral-300">
              <tr>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800 font-medium">Table Topics (Impromptu)</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">1:00</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">1:30</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">2:00</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">1:00 to 2:30 (under 1:00 DQ)</td>
              </tr>
              <tr>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800 font-medium">Speech Evaluation</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">2:00</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">2:30</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">3:00</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">1:30 to 3:30</td>
              </tr>
              <tr>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800 font-medium">Ice Breaker Speech</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">4:00</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">5:00</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">6:00</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">3:30 to 6:30</td>
              </tr>
              <tr>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800 font-medium">Standard Pathways / Contest Speech</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">5:00</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">6:00</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">7:00</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">4:30 to 7:30</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
          <strong>Important Contest Rule:</strong> Timing begins with the contestant’s first definite verbal or nonverbal communication with the audience. No audible signal or bell is ever used after the Red signal at 7:00—the speaker is personally responsible for concluding before 7:30.
        </p>

        <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold">
          <Link prefetch={false} href="/toastmasters-timer" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
            <span>Open Toastmasters Timer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </article>

      {/* Guide 3: Debate Timing */}
      <article
        id="debate-timing-bell-signals"
        className="p-6 sm:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-6"
      >
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            <Scale className="w-4 h-4" />
            <span>Debate & Forensics</span>
          </div>
          <span className="text-xs text-neutral-500">6 min read</span>
        </div>

        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
          3. Parliamentary, World Schools & NSDA Debate Timing Standards
        </h2>

        <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed">
          Competitive debate formats rely on strict timekeeping to ensure equal constructive, rebuttal, and cross-examination time for both sides. In Parliamentary formats, the timekeeper also rings gavel or bell signals to open and close the window for <strong>Points of Information (POIs)</strong>.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse border border-neutral-200 dark:border-neutral-800">
            <thead>
              <tr className="bg-neutral-50 dark:bg-neutral-800/60 text-neutral-900 dark:text-white">
                <th className="p-3 border border-neutral-200 dark:border-neutral-800">Debate Format</th>
                <th className="p-3 border border-neutral-200 dark:border-neutral-800">Speech / Segment Breakdown</th>
                <th className="p-3 border border-neutral-200 dark:border-neutral-800">Protected Time / Prep Rules</th>
              </tr>
            </thead>
            <tbody className="text-neutral-700 dark:text-neutral-300">
              <tr>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800 font-medium">British Parliamentary (BP / WUDC)</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">8 × 7-minute speeches</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">1st &amp; 7th minutes protected (POIs allowed 1:00–6:00); 15m prep before round</td>
              </tr>
              <tr>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800 font-medium">World Schools (WSDC)</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">6 × 8m substantive + 2 × 4m reply speeches</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">1st &amp; 8th minutes protected (POIs allowed 1:00–7:00); no POIs in reply speeches</td>
              </tr>
              <tr>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800 font-medium">Lincoln-Douglas (NSDA LD)</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">6m AC · 3m CX · 7m NC · 3m CX · 4m 1AR · 6m NR · 3m 2AR</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">4 minutes cumulative prep time per debater</td>
              </tr>
              <tr>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800 font-medium">Public Forum (NSDA PF)</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">4m Constructives · 4m Rebuttals · 3m Summaries · 2m Final Focus · 3m Crossfires</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">3 minutes cumulative prep time per team</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold">
          <Link prefetch={false} href="/debate-timer" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
            <span>Open Debate Timer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </article>

      {/* Guide 4: Pomodoro & Focus Cycles */}
      <article
        id="pomodoro-technique-guide"
        className="p-6 sm:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-6"
      >
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400">
            <Clock className="w-4 h-4" />
            <span>Productivity & Study Systems</span>
          </div>
          <span className="text-xs text-neutral-500">4 min read</span>
        </div>

        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
          4. Structured Focus Cycles: 25/5 Pomodoro vs. 50/10 Deep Work Blocks
        </h2>

        <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed">
          Developed by Francesco Cirillo in the late 1980s using a tomato-shaped kitchen timer, the classic <strong>Pomodoro Technique</strong> divides work into 25-minute single-task intervals separated by 5-minute breaks. After completing four 25-minute intervals (100 minutes of net focus over 2 hours), you take a longer 15-to-30-minute restorative break.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse border border-neutral-200 dark:border-neutral-800">
            <thead>
              <tr className="bg-neutral-50 dark:bg-neutral-800/60 text-neutral-900 dark:text-white">
                <th className="p-3 border border-neutral-200 dark:border-neutral-800">Cycle Format</th>
                <th className="p-3 border border-neutral-200 dark:border-neutral-800">Work / Break Ratio</th>
                <th className="p-3 border border-neutral-200 dark:border-neutral-800">Net Focus per 2 Hours</th>
                <th className="p-3 border border-neutral-200 dark:border-neutral-800">Best Suited For</th>
              </tr>
            </thead>
            <tbody className="text-neutral-700 dark:text-neutral-300">
              <tr>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800 font-medium">Classic Pomodoro (25 / 5)</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">25m work + 5m break (×4)</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">100 minutes</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">Overcoming procrastination, flashcards, email triage, short writing tasks</td>
              </tr>
              <tr>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800 font-medium">Academic Block (50 / 10)</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">50m work + 10m break (×2)</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">100 minutes</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">Software engineering, calculus problem sets, dense textbook chapters</td>
              </tr>
              <tr>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800 font-medium">Extended Deep Block (90 / 20)</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">90m work + 20m break</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">90m per 110m cycle</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">Full mock exam papers, architectural design, long-form drafting</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold">
          <Link prefetch={false} href="/pomodoro-timer" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
            <span>Open Pomodoro Timer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link prefetch={false} href="/study-timer" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
            <span>Open Study Timer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link prefetch={false} href="/countdown-timer?m=25" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
            <span>Open 25-Minute Timer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </article>

      {/* Guide 5: IANA Time Zones & 2026 DST */}
      <article
        id="dst-and-non-integer-timezones"
        className="p-6 sm:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-6"
      >
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            <Globe className="w-4 h-4" />
            <span>World Clock & IANA Standards</span>
          </div>
          <span className="text-xs text-neutral-500">5 min read</span>
        </div>

        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
          5. Non-Whole-Hour UTC Offsets & 2026 Daylight Saving Time (DST) Dates
        </h2>

        <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed">
          While most global time zones are offset from Coordinated Universal Time (UTC) by whole hours, several major regions defined in the official <strong>IANA Time Zone Database</strong> use <strong>30-minute</strong> or <strong>45-minute</strong> offsets. Furthermore, because North America, Europe, and Southern Hemisphere nations change their clocks on different Sundays—or do not observe DST at all—the time difference between two cities can change up to four times a year.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse border border-neutral-200 dark:border-neutral-800">
            <thead>
              <tr className="bg-neutral-50 dark:bg-neutral-800/60 text-neutral-900 dark:text-white">
                <th className="p-3 border border-neutral-200 dark:border-neutral-800">Region / Zone</th>
                <th className="p-3 border border-neutral-200 dark:border-neutral-800">IANA Identifier</th>
                <th className="p-3 border border-neutral-200 dark:border-neutral-800">Standard Offset</th>
                <th className="p-3 border border-neutral-200 dark:border-neutral-800">2026 DST Schedule / Notes</th>
              </tr>
            </thead>
            <tbody className="text-neutral-700 dark:text-neutral-300">
              <tr>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800 font-medium">US &amp; Canada (Observing Zones)</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800 font-mono text-xs">America/New_York, etc.</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">UTC−5 to UTC−8</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">Starts Mar 8, 2026 · Ends Nov 1, 2026</td>
              </tr>
              <tr>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800 font-medium">UK &amp; European Union</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800 font-mono text-xs">Europe/London, Europe/Berlin</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">UTC+0 / UTC+1</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">Starts Mar 29, 2026 · Ends Oct 25, 2026</td>
              </tr>
              <tr>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800 font-medium">India &amp; Sri Lanka (30m offset)</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800 font-mono text-xs">Asia/Kolkata, Asia/Colombo</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">UTC+05:30</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">No DST observed (fixed year-round)</td>
              </tr>
              <tr>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800 font-medium">Nepal (45m offset)</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800 font-mono text-xs">Asia/Kathmandu</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">UTC+05:45</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">No DST observed (fixed year-round)</td>
              </tr>
              <tr>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800 font-medium">Newfoundland, Canada (30m offset)</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800 font-mono text-xs">America/St_Johns</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">UTC−03:30 (NST)</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">UTC−02:30 (NDT) Mar 8 – Nov 1, 2026</td>
              </tr>
              <tr>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800 font-medium">South Australia (Adelaide)</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800 font-mono text-xs">Australia/Adelaide</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">UTC+09:30 (ACST)</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">UTC+10:30 (ACDT) ends Apr 5, starts Oct 4, 2026</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold">
          <Link prefetch={false} href="/world-clock" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
            <span>Open World Clock</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link prefetch={false} href="/time-zone-converter" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
            <span>Open Time Zone Converter</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link prefetch={false} href="/meeting-planner" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
            <span>Open Meeting Planner</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </article>

      {/* Guide 6: Payroll & Decimal Hours Math */}
      <article
        id="payroll-and-time-math"
        className="p-6 sm:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-6"
      >
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            <Calculator className="w-4 h-4" />
            <span>Payroll & Time Arithmetic</span>
          </div>
          <span className="text-xs text-neutral-500">4 min read</span>
        </div>

        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
          6. Converting Hours & Minutes (HH:MM) to Decimal Payroll Hours
        </h2>

        <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed">
          Because 1 hour contains 60 minutes (base-60 sexagesimal) rather than 100 minutes, multiplying an hourly wage by raw clock minutes produces an incorrect paycheck total. For example, <strong>8 hours 30 minutes</strong> must be entered into payroll software as <strong>8.50 hours</strong>, not 8.30.
        </p>

        <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 font-mono text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 space-y-1">
          <div><strong>Formula:</strong> Decimal Hours = Hours + (Minutes ÷ 60) + (Seconds ÷ 3600)</div>
          <div><strong>Worked Example:</strong> 7h 45m = 7 + (45 ÷ 60) = 7.75 hours · At $28.00/hr = $217.00 gross pay</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse border border-neutral-200 dark:border-neutral-800">
            <thead>
              <tr className="bg-neutral-50 dark:bg-neutral-800/60 text-neutral-900 dark:text-white">
                <th className="p-3 border border-neutral-200 dark:border-neutral-800">Minutes</th>
                <th className="p-3 border border-neutral-200 dark:border-neutral-800">Decimal Hour Equivalent</th>
                <th className="p-3 border border-neutral-200 dark:border-neutral-800">Minutes</th>
                <th className="p-3 border border-neutral-200 dark:border-neutral-800">Decimal Hour Equivalent</th>
              </tr>
            </thead>
            <tbody className="text-neutral-700 dark:text-neutral-300 font-mono text-xs">
              <tr>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">05 min</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">0.08 hr</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">35 min</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">0.58 hr</td>
              </tr>
              <tr>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">10 min</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">0.17 hr</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">40 min</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">0.67 hr</td>
              </tr>
              <tr>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">15 min</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">0.25 hr</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">45 min</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">0.75 hr</td>
              </tr>
              <tr>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">20 min</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">0.33 hr</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">50 min</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">0.83 hr</td>
              </tr>
              <tr>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">30 min</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">0.50 hr</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">60 min</td>
                <td className="p-3 border border-neutral-200 dark:border-neutral-800">1.00 hr</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold">
          <Link prefetch={false} href="/time-card-calculator" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
            <span>Open Time Card Calculator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link prefetch={false} href="/overtime-calculator" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
            <span>Open Overtime Calculator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link prefetch={false} href="/minutes-to-hours" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
            <span>Open Minutes to Hours Converter</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </article>
    </div>
  );
}


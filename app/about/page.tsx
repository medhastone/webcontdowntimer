import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Zap, Globe, Clock, Tv } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About & Calculation Methodology | WebCountDownTimer',
  description:
    'Learn how WebCountDownTimer.com engineers drift-free countdown timers, IANA time-zone conversions, and date/time calculators with full client-side privacy.',
  alternates: {
    canonical: 'https://WebCountDownTimer.com/about',
  },
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="space-y-4">
        <span className="text-xs font-mono uppercase text-neutral-500">About &amp; Technical Methodology</span>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-neutral-900 dark:text-white">
          Start quickly. Stay on time. Make every second count.
        </h1>
        <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed">
          WebCountDownTimer (WebCountDownTimer.com) is a precision time-tools platform engineered to solve real timing challenges
          for event directors, keynote speakers, educators, students, and international distributed teams.
        </p>
      </div>

      <div className="space-y-8 text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed border-t border-neutral-200 dark:border-neutral-800 pt-8">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
            Why We Built WebCountDownTimer
          </h2>
          <p>
            Many online timers are cluttered with intrusive ads, slow-loading trackers, or paywalls
            that require an account before you can set a simple countdown. Worse, naive timer scripts
            that rely on accumulated frame counters drift or freeze when a user switches browser tabs.
          </p>
          <p>
            WebCountDownTimer is built on verifiable web standards:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm">
            <li><strong>Timestamp-Delta Countdown Engine:</strong> Every timer calculates remaining time against a target epoch timestamp (<code>targetEndTime - Date.now()</code>) or monotonic clock reference (<code>performance.now()</code>). Switching tabs, minimizing windows, or backgrounding a mobile browser never causes cumulative drift.</li>
            <li><strong>Screen Wake Lock API:</strong> Automatically requests a display wake lock where supported so your podium, kitchen tablet, or classroom smartboard stays awake during active countdowns.</li>
            <li><strong>Synthesized Web Audio:</strong> All chimes, bells, and interval cues are synthesized mathematically in real time via the browser&apos;s Web Audio API—eliminating broken external MP3 links.</li>
            <li><strong>Real Multi-Screen Sync:</strong> Our Stage Timer uses the browser&apos;s <code>BroadcastChannel</code> and storage event APIs to synchronize presenter confidence monitors across separate windows with sub-millisecond local latency.</li>
            <li><strong>Official IANA Time Zones:</strong> World Clock, Time-Zone Converter, and Meeting Planner query the browser&apos;s <code>Intl.DateTimeFormat</code> IANA database to compute Daylight Saving Time (DST) transitions and fractional offsets such as India (UTC+5:30), Nepal (UTC+5:45), and Adelaide (UTC+9:30/UTC+10:30).</li>
          </ul>
        </section>

        <section className="space-y-3 pt-6 border-t border-neutral-200 dark:border-neutral-800">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
            Calculator Methodology, Formulas &amp; Known Limitations
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-sm">
            <li><strong>Date &amp; Business Days Calculators:</strong> Calendar differences are evaluated in UTC calendar days to avoid 23-hour or 25-hour DST shift errors, automatically accounting for 29-day Februaries in leap years (years divisible by 4, except century years not divisible by 400). Standard business day calculations exclude Saturdays and Sundays; regional public holidays vary by jurisdiction and should be accounted for separately.</li>
            <li><strong>Time Card &amp; Overtime Calculators:</strong> Payroll decimal hours are computed as <code>Hours + (Minutes ÷ 60)</code>. Overtime thresholds (such as 40 weekly hours) and multipliers (such as 1.5x or 2.0x) are user-configurable estimates and do not constitute legal or tax advice.</li>
            <li><strong>Visual &amp; Sensory Timers:</strong> Visual animations (falling sand, draining liquid, melting wax, split-flap cards, and botanical growth) are driven directly by the exact mathematical progress ratio <code>remainingMs / totalDurationMs</code> and respect <code>prefers-reduced-motion</code> accessibility settings.</li>
          </ul>
        </section>

        <section className="space-y-4 pt-6 border-t border-neutral-200 dark:border-neutral-800">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
            Architecture, Editorial Standards &amp; Privacy Principles
          </h2>
          <p className="text-sm">
            All timers and calculators execute locally inside your browser. Your rundown labels, student lists,
            custom images, and preferences remain private on your device. Every guide and tool instruction set
            is written and reviewed against the actual working tool controls so instructions match real interface behavior.
          </p>
        </section>
      </div>

      <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center gap-4">
        <Link
          href="/tools"
          className="px-6 py-3 text-xs font-bold text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 rounded-xl"
        >
          Explore All Tools
        </Link>
        <Link
          href="/guides"
          className="px-5 py-3 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
        >
          Read Timing Guides
        </Link>
        <Link
          href="/contact"
          className="px-5 py-3 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
        >
          Contact Our Team
        </Link>
      </div>
    </div>
  );
}


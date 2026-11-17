import { buildPageMetadata } from '@/lib/seo-metadata';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Zap, Globe, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import BreadcrumbJsonLd from '@/components/common/BreadcrumbJsonLd';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/about');
}

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'About & Methodology', path: '/about' },
        ]}
      />
      <div className="space-y-4">
        <span className="text-xs font-mono uppercase tracking-wider text-[#365C4B] dark:text-[#5E917A]">
          About &amp; Technical Verification Methodology
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Built for Drift-Free Browser Timing—With Zero Ads or Sign-Up Walls
        </h1>
        <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed">
          <strong>WebCountDownTimer.com</strong> is an independent web utility project built and maintained by software engineers who needed reliable, projector-ready countdown clocks for live conferences, classrooms, workouts, and cross-timezone team meetings.
        </p>
      </div>

      <div className="space-y-10 text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed border-t border-neutral-200 dark:border-neutral-800 pt-8">
        {/* 1. Who Runs the Site & Why It Was Built */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
            1. Who Runs WebCountDownTimer &amp; Why We Built It
          </h2>
          <p>
            WebCountDownTimer is operated by an independent web engineering and product team focused on browser-based time utilities. We originally built these tools after experiencing three recurring failures with legacy online timers during live events and classroom sessions:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Background Tab Drift:</strong> Traditional web timers rely on naive <code>setInterval(..., 1000)</code> counters that lose 15 to 45 seconds every 10 minutes when Chrome, Safari, or Edge throttles background tabs.
            </li>
            <li>
              <strong>Visual Clutter on Projectors:</strong> Banner ads, popups, and notification prompts make standard web timers unusable on conference confidence monitors and K–12 smartboards.
            </li>
            <li>
              <strong>Mandatory Account Walls:</strong> Simple workflows—like syncing a stage timer display, running a Toastmasters speech clock, or calculating weekly time-card hours—should work immediately in the browser without creating an account or handing over personal data.
            </li>
          </ul>
        </section>

        {/* 2. How We Verify & Test Timer Accuracy */}
        <section className="space-y-4 pt-6 border-t border-neutral-200 dark:border-neutral-800">
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
            2. How We Verify &amp; Test Timer Accuracy
          </h2>
          <p>
            Every timer and calculator on WebCountDownTimer is tested against four concrete engineering benchmarks before publication and after code updates. For full architectural details, see our technical reference:{' '}
            <Link
              href="/guides/how-accurate-online-timers-work"
              className="text-[#365C4B] dark:text-[#5E917A] underline font-semibold"
            >
              How Accurate Online Timers Work
            </Link>
            .
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-5 rounded-2xl bg-white dark:bg-[#19201C] border border-[#E4E1D9] dark:border-[#2A342E] space-y-2">
              <div className="flex items-center gap-2 font-bold text-neutral-900 dark:text-white">
                <Clock className="w-4 h-4 text-[#365C4B] dark:text-[#5E917A]" />
                <span>Epoch Delta Verification</span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300">
                Rather than counting JavaScript ticks, our timers record the target Unix epoch timestamp (<code>Date.now() + durationMs</code>) and compute remaining milliseconds on each animation frame.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#19201C] border border-[#E4E1D9] dark:border-[#2A342E] space-y-2">
              <div className="flex items-center gap-2 font-bold text-neutral-900 dark:text-white">
                <Zap className="w-4 h-4 text-[#365C4B] dark:text-[#5E917A]" />
                <span>Background Tab Throttling Tests</span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300">
                We test 30-minute and 60-minute countdowns inside minimized and unfocused tabs across Chrome, Safari, Firefox, and Edge to verify zero cumulative drift when returning to the tab.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#19201C] border border-[#E4E1D9] dark:border-[#2A342E] space-y-2">
              <div className="flex items-center gap-2 font-bold text-neutral-900 dark:text-white">
                <Globe className="w-4 h-4 text-[#365C4B] dark:text-[#5E917A]" />
                <span>IANA Time Zone &amp; DST Edge Cases</span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300">
                World clock and date/time calculators use the browser&apos;s native <code>Intl.DateTimeFormat</code> IANA database and are tested across Daylight Saving Time transitions, 30/45-minute offset zones (e.g., <code>Asia/Kolkata</code>, <code>Asia/Kathmandu</code>), and leap years.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#19201C] border border-[#E4E1D9] dark:border-[#2A342E] space-y-2">
              <div className="flex items-center gap-2 font-bold text-neutral-900 dark:text-white">
                <ShieldCheck className="w-4 h-4 text-[#365C4B] dark:text-[#5E917A]" />
                <span>Wake Lock &amp; Web Audio Synthesis</span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300">
                Active timers request the W3C <code>navigator.wakeLock</code> API to prevent display dimming and generate acoustic chimes directly via the Web Audio API so alerts fire even if your internet connection drops mid-countdown.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Local Privacy & Editorial Standards */}
        <section className="space-y-3 pt-6 border-t border-neutral-200 dark:border-neutral-800">
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
            3. Privacy-First Local Execution &amp; Editorial Standards
          </h2>
          <p>
            All countdown states, saved timer presets, classroom student rosters, and timesheet calculations run locally in your browser via <code>localStorage</code> and <code>BroadcastChannel</code>. We do not upload your classroom names or meeting schedules to external servers.
          </p>
          <p>
            Our tool guides and pacing tables are written directly against each tool&apos;s live interface and reference established public timing rulebooks—such as Toastmasters International speech timing signals, NSDA debate formats, the 25/5 Pomodoro workflow, and the 20-20-20 optometric rest guideline.
          </p>
        </section>

        {/* 4. Accuracy & Operational Disclaimer */}
        <section className="p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/50 space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-300 text-sm">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Operational &amp; Hardware Accuracy Disclaimer</span>
          </div>
          <p className="text-xs sm:text-sm text-amber-900/90 dark:text-amber-200/90 leading-relaxed">
            WebCountDownTimer relies on your device&apos;s operating system clock (NTP synchronization) and browser audio permissions. While our timestamp-delta engine eliminates JavaScript interval drift, browser timers should not be used as life-safety, medical, aviation, or certified industrial control instruments. Always verify audio volume and screen sleep settings before critical live productions or exams.
          </p>
        </section>
      </div>

      <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/tools"
            className="px-6 py-3 text-xs font-bold text-white bg-[#365C4B] hover:bg-[#2B4A3C] rounded-xl transition-colors"
          >
            Explore All Tools
          </Link>
          <Link
            href="/guides/how-accurate-online-timers-work"
            className="px-5 py-3 text-xs font-semibold text-neutral-700 dark:text-neutral-200 bg-white dark:bg-[#19201C] border border-[#E4E1D9] dark:border-[#2A342E] rounded-xl hover:border-[#365C4B] transition-colors"
          >
            Read Accuracy Engineering Guide
          </Link>
          <Link
            href="/contact"
            className="px-5 py-3 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
          >
            Contact / Report an Issue
          </Link>
        </div>
        <span className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#365C4B] dark:text-[#5E917A]" />
          Last Verified: November 2026
        </span>
      </div>
    </div>
  );
}


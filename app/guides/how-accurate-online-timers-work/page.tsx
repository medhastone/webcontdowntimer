import type { Metadata } from 'next';
import Link from 'next/link';
import { buildPageMetadata } from '@/lib/seo-metadata';
import BreadcrumbJsonLd from '@/components/common/BreadcrumbJsonLd';
import {
  ShieldCheck,
  Clock,
  Cpu,
  Volume2,
  Monitor,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
} from 'lucide-react';

export function generateMetadata(): Metadata {
  return buildPageMetadata('/guides/how-accurate-online-timers-work');
}

export default function HowAccurateOnlineTimersWorkPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline:
      'How Accurate Online Timers Work: Browser Tab Throttling, Epoch Delta Math & Information Provenance',
    description:
      'Learn how accurate online timers prevent browser tab throttling using Date.now() epoch deltas, performance.now(), Screen Wake Lock, and Web Audio.',
    url: 'https://WebCountDownTimer.com/guides/how-accurate-online-timers-work',
    author: {
      '@type': 'Organization',
      name: 'WebCountDownTimer Engineering & Editorial Team',
      url: 'https://WebCountDownTimer.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'WebCountDownTimer',
      url: 'https://WebCountDownTimer.com',
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B1120] text-slate-900 dark:text-slate-100">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Guides', path: '/guides' },
          { name: 'How Accurate Online Timers Work', path: '/guides/how-accurate-online-timers-work' },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="flex-1 py-10 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
            <Link prefetch={false} href="/" className="hover:text-slate-900 dark:hover:text-white">
              Home
            </Link>
            <span>/</span>
            <Link prefetch={false} href="/guides" className="hover:text-slate-900 dark:hover:text-white">
              Guides
            </Link>
            <span>/</span>
            <span className="text-slate-900 dark:text-white">How Accurate Online Timers Work</span>
          </nav>

          {/* Hero Header */}
          <header className="mt-6 mb-10 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-7 sm:p-10 shadow-sm">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/70 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-4">
              <ShieldCheck className="w-3.5 h-3.5" /> Technical Reference &amp; Provenance Guide
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight mb-4">
              How Accurate Online Timers Work: Browser Tab Throttling, Epoch Delta Math &amp; Information Provenance
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              Why do many simple web timers lose seconds—or even minutes—when you switch browser tabs? This technical guide explains how modern browser power-saving affects JavaScript timers, how epoch-delta calculation eliminates timing drift, and documents the exact calculation methods, standards, and operating limitations behind every tool on WebCountDownTimer.
            </p>
          </header>

          <article className="space-y-8">
            {/* Section 1: Browser Tab Throttling */}
            <section
              id="browser-tab-throttling"
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-7 sm:p-9 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <Clock className="w-5 h-5" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  1. Why Naive Web Timers Drift: Browser Background Tab Throttling
                </h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Beginner-built online countdown timers often rely on a naive counter decrement inside a 1,000-millisecond loop:
              </p>
              <pre className="bg-slate-950 text-slate-100 rounded-2xl p-4 text-xs sm:text-sm font-mono overflow-x-auto mb-5 border border-slate-800">
                <code>{`// ❌ Naive approach: Drifts severely in background tabs
let remainingSeconds = 600;
setInterval(() => {
  remainingSeconds -= 1;
}, 1000);`}</code>
              </pre>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                To save laptop battery and CPU cycles, modern web browsers (Chrome, Safari, Edge, and Firefox) aggressively throttle background tabs. When you switch to another tab, minimize the browser window, or let a mobile screen dim, the browser reduces timer callback frequency:
              </p>
              <ul className="space-y-2.5 text-sm sm:text-base text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Active Foreground Tab:</strong> <code className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">requestAnimationFrame</code> runs at 60Hz–120Hz (every 8.3ms–16.6ms) and <code className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">setInterval</code> fires near its requested interval.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Inactive Background Tab (After 10 Seconds):</strong> Browsers throttle timer callbacks to once per second (1Hz) or slower, and <code className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">requestAnimationFrame</code> pauses completely.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Intensive Battery Saver / Frozen Background Tab (After 5 Minutes):</strong> Browsers can delay background timer callbacks to once every 60 seconds. A naive counter that simply subtracts 1 on each callback can turn a 10-minute timer into a 45-minute timer.
                  </span>
                </li>
              </ul>
            </section>

            {/* Section 2: Epoch Delta Math */}
            <section
              id="epoch-delta-math"
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-7 sm:p-9 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Cpu className="w-5 h-5" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  2. How Epoch-Delta (<code className="font-mono text-lg">Date.now()</code>) &amp; Monotonic High-Resolution Timing Fix Drift
                </h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Every countdown timer, visual timer, interval clock, and stopwatch on WebCountDownTimer is anchored to your device&apos;s hardware-backed system clock rather than counting loop ticks. When you click <strong>Start</strong>, the timer computes an exact target completion timestamp in UTC epoch milliseconds:
              </p>
              <pre className="bg-slate-950 text-slate-100 rounded-2xl p-4 text-xs sm:text-sm font-mono overflow-x-auto mb-5 border border-slate-800">
                <code>{`// ✅ Drift-free Epoch-Delta calculation used on WebCountDownTimer
const targetEndTime = Date.now() + remainingMilliseconds;

function updateTimer() {
  const remainingMs = Math.max(0, targetEndTime - Date.now());
  renderDisplay(remainingMs);
}`}</code>
              </pre>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Because remaining time is always derived from <code className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">targetEndTime - Date.now()</code> (and <code className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">performance.now()</code> for millisecond stopwatch splits), even if your browser throttles a background tab for several minutes, the very next tick—or the instant you return to the tab via the <code className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">visibilitychange</code> event—recalculates the exact remaining millisecond with zero cumulative drift.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mt-6">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/70">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                    Countdown &amp; Event Timers
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Use <code className="font-mono text-xs">Date.now()</code> UTC epoch timestamps so long countdowns and target-date clocks stay locked to real wall-clock time.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/70">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                    Stopwatches &amp; Lap Splits
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Use the W3C High-Resolution Time API (<code className="font-mono text-xs">performance.now()</code>) for monotonic sub-millisecond elapsed and lap deltas unaffected by system clock NTP nudges.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3: Screen Wake Lock & Web Audio */}
            <section
              id="wake-lock-and-audio"
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-7 sm:p-9 shadow-sm"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2.5 mb-3">
                    <Monitor className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      3. W3C Screen Wake Lock API
                    </h2>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    During presentations, exams, workouts, or cooking, you cannot tap your screen every two minutes to stop the monitor from dimming. When a timer is active on a supported browser, WebCountDownTimer requests a <code className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">navigator.wakeLock.request(&apos;screen&apos;)</code> sentinel so your display stays awake—and releases it automatically when the timer stops or resets.
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2.5 mb-3">
                    <Volume2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      4. W3C Web Audio API Synthesis
                    </h2>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    External MP3 audio files can fail to buffer if your Wi-Fi drops mid-session. Our completion chimes, Toastmasters cues, and boxing round bells are synthesized locally in real time using the browser&apos;s native <code className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">AudioContext</code> oscillators—working 100% offline with zero network latency.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 4: Information Provenance & Calculation Method Table */}
            <section
              id="information-provenance"
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-7 sm:p-9 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  5. Information Provenance, Calculation Methods &amp; Technical Standards
                </h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                All tools on WebCountDownTimer execute 100% client-side in your browser with zero server-side data collection. The table below documents the authoritative standards and mathematical formulas used across each tool category:
              </p>

              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700">
                      <th className="p-3.5 font-bold">Tool Category</th>
                      <th className="p-3.5 font-bold">Authoritative Standard</th>
                      <th className="p-3.5 font-bold">Core Formula / Method</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
                    <tr>
                      <td className="p-3.5 font-semibold text-slate-900 dark:text-white">
                        Countdown, Visual, Stage &amp; Duration Timers
                      </td>
                      <td className="p-3.5">
                        W3C High-Resolution Time, Screen Wake Lock API, Web Audio API, BroadcastChannel API
                      </td>
                      <td className="p-3.5 font-mono text-xs">
                        remainingMs = max(0, targetEndTime - Date.now())
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-semibold text-slate-900 dark:text-white">
                        Stopwatches &amp; Multi-Lane Race Timers
                      </td>
                      <td className="p-3.5">
                        W3C <code className="font-mono text-xs">performance.now()</code> Monotonic Clock
                      </td>
                      <td className="p-3.5 font-mono text-xs">
                        elapsedMs = accumulatedMs + (performance.now() - startPerfTime)
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-semibold text-slate-900 dark:text-white">
                        World Clock, Time Zone Converter &amp; Meeting Planner
                      </td>
                      <td className="p-3.5">
                        IANA Time Zone Database (<code className="font-mono text-xs">tzdb</code>) &amp; ECMA-402 <code className="font-mono text-xs">Intl.DateTimeFormat</code>
                      </td>
                      <td className="p-3.5">
                        Evaluates UTC epoch timestamps against official regional meridian offsets and historical/current Daylight Saving Time (DST) transition rules.
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-semibold text-slate-900 dark:text-white">
                        Time, Date, Duration &amp; Payroll Calculators
                      </td>
                      <td className="p-3.5">
                        ISO 8601 Calendar Representation &amp; Base-60 / Base-10 Arithmetic
                      </td>
                      <td className="p-3.5 font-mono text-xs">
                        DecimalHours = NetMinutes / 60; GrossPay = (Reg × Rate) + (OT × Rate × Multiplier)
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-semibold text-slate-900 dark:text-white">
                        Random Name Picker, Group Generator &amp; Bingo Caller
                      </td>
                      <td className="p-3.5">
                        Knuth / Fisher-Yates Unbiased In-Place Permutation
                      </td>
                      <td className="p-3.5">
                        Uniform <code className="font-mono text-xs">1/N</code> selection probability across remaining uncalled items; 100% local in-memory array processing.
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-semibold text-slate-900 dark:text-white">
                        Classroom Noise Meter
                      </td>
                      <td className="p-3.5">
                        W3C Web Audio API (<code className="font-mono text-xs">AnalyserNode</code> RMS Amplitude)
                      </td>
                      <td className="p-3.5">
                        Computes real-time Root-Mean-Square (RMS) microphone signal on a relative 0–100 classroom scale; zero audio is recorded or transmitted.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 5: Operating Limitations */}
            <section
              id="operating-limitations"
              className="bg-amber-50/70 dark:bg-amber-950/20 rounded-3xl border border-amber-200/80 dark:border-amber-800/50 p-7 sm:p-9"
            >
              <div className="flex items-center gap-3 mb-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  6. Important Operating Limitations &amp; Disclaimers
                </h2>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed list-disc pl-5">
                <li>
                  <strong>Device Sleep &amp; Closed Laptop Lids:</strong> If your operating system enters full hardware suspend/sleep mode or you close your laptop lid, browser audio cannot play until the device wakes. Keep your device awake or use Fullscreen mode so the Screen Wake Lock remains active.
                </li>
                <li>
                  <strong>Browser Audio Autoplay Policy:</strong> Web browsers require at least one user interaction (such as clicking Start or Test Sound) on the page before allowing synthesized audio chimes to play.
                </li>
                <li>
                  <strong>Decorative Visual Metaphors:</strong> Nature and sensory timers (Sand, Liquid, Candle, Moon, Sun, Frost, Snow, Galaxy, Lava Lamp, Coral, Lichen, and Forest Fire) are artistic visual representations synchronized to your digital countdown duration—not meteorological, astronomical, biological, or emergency-warning instruments.
                </li>
                <li>
                  <strong>Informational &amp; Wellness Scope:</strong> Payroll/overtime calculators provide general mathematical estimates (verify against local labor regulations), and breathing/eye-break timers are ergonomic pacing aids rather than medical devices.
                </li>
              </ul>
            </section>

            {/* Quick Links to Core Tools */}
            <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-7 sm:p-9 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                Try Our Drift-Free Timing Tools
              </h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Countdown Timer', href: '/countdown-timer' },
                  { label: 'Online Stopwatch', href: '/stopwatch' },
                  { label: 'Stage Timer', href: '/stage-timer' },
                  { label: 'Visual Timer', href: '/visual-timer' },
                  { label: 'Pomodoro Timer', href: '/pomodoro-timer' },
                  { label: 'Interval Timer', href: '/interval-timer' },
                  { label: 'World Clock', href: '/world-clock' },
                  { label: 'All Guides', href: '/guides' },
                ].map((item) => (
                  <Link prefetch={false}
                    key={item.href}
                    href={item.href}
                    className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-700/70 text-sm font-semibold text-slate-800 dark:text-slate-200 transition-colors"
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </Link>
                ))}
              </div>
            </section>
          </article>
        </div>
      </main>
    </div>
  );
}

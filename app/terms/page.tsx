import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Use | WebCountDownTimer',
  description: 'Terms and conditions governing the use of WebCountDownTimer (WebCountDownTimer.com).',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-neutral-800 dark:text-neutral-200">
      <div className="space-y-2">
        <span className="text-xs font-mono uppercase text-neutral-500">Legal Agreement</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
          Terms of Use
        </h1>
        <p className="text-xs font-mono text-neutral-500">Last updated: October 2026</p>
      </div>

      <div className="space-y-6 text-sm leading-relaxed border-t border-neutral-200 dark:border-neutral-800 pt-6">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900 dark:text-white">1. Acceptance of Terms</h2>
          <p>
            By accessing or using WebCountDownTimer (WebCountDownTimer.com), you agree to these Terms of Use.
            The tools are provided free of charge for personal, educational, non-profit, and commercial event timing.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900 dark:text-white">2. Accuracy & Timing Disclaimer</h2>
          <p>
            While WebCountDownTimer leverages high-precision monotonic browser performance counters and the standardized
            IANA Time Zone database, timekeeping precision depends upon the host device&apos;s internal clock,
            operating system power management, and browser execution throttle policies. For safety-critical,
            aerospace, or life-support applications, certified hardware clocks must be employed.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900 dark:text-white">3. Intellectual Property</h2>
          <p>
            The software design, trademarks, branding, and interfaces of WebCountDownTimer are protected by international
            copyright and intellectual property laws.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900 dark:text-white">4. Modifications to the Service</h2>
          <p>
            We continually improve our tools, add new presets, and enhance accessibility features without prior notice.
          </p>
        </section>
      </div>
    </div>
  );
}

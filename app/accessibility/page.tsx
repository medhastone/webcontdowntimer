import { buildPageMetadata } from '@/lib/seo-metadata';
import type { Metadata } from 'next';
import { Keyboard, Eye, Volume2, Shield } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/accessibility');
}

export default function AccessibilityPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 text-neutral-800 dark:text-neutral-200">
      <div className="space-y-2">
        <span className="text-xs font-mono uppercase text-neutral-500">Universal Design</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
          Accessibility Statement
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Target compliance: Web Content Accessibility Guidelines (WCAG) 2.2 Level AA.
        </p>
      </div>

      <div className="space-y-8 border-t border-neutral-200 dark:border-neutral-800 pt-8 text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Eye className="w-4 h-4 text-emerald-500" />
            Visual Design & Contrast
          </h2>
          <p>
            WebCountDownTimer tools maintain high contrast ratios exceeding the 4.5:1 minimum for body text and 3:1 for
            large stage timer numerals. Critical state transitions (like Toastmasters Green, Amber, Red signals
            or overtime alerts) are never communicated by color alone—they always include distinct text labels,
            icons, and audible chimes.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-blue-500" />
            Keyboard Navigation & Global Shortcuts
          </h2>
          <p>
            Every interactive control can be reached and activated using the keyboard. In addition, the following
            single-key shortcuts are active when not typing in text fields:
          </p>

          <div className="overflow-x-auto border border-neutral-200 dark:border-neutral-800 rounded-xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 font-semibold">
                <tr>
                  <th className="p-3 w-36">Shortcut Key</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Applicable Tools</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 font-mono">
                <tr>
                  <td className="p-3 font-bold text-neutral-900 dark:text-white">Spacebar</td>
                  <td className="p-3 font-sans">Start / Pause active timer</td>
                  <td className="p-3 font-sans text-neutral-500">All countdowns, stopwatches, speaker tools</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-neutral-900 dark:text-white">R</td>
                  <td className="p-3 font-sans">Reset timer to preset duration</td>
                  <td className="p-3 font-sans text-neutral-500">All timers</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-neutral-900 dark:text-white">F</td>
                  <td className="p-3 font-sans">Toggle distraction-free Fullscreen</td>
                  <td className="p-3 font-sans text-neutral-500">Stage, speaker, classroom, stopwatch</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-neutral-900 dark:text-white">M</td>
                  <td className="p-3 font-sans">Toggle Mute / Unmute audio chimes</td>
                  <td className="p-3 font-sans text-neutral-500">All tools with acoustic signals</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-neutral-900 dark:text-white">Escape</td>
                  <td className="p-3 font-sans">Exit Fullscreen or close dialogs</td>
                  <td className="p-3 font-sans text-neutral-500">Global</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-amber-500" />
            Screen Reader Politeness
          </h2>
          <p>
            To prevent overwhelming assistive technology users, running timers do not announce every second.
            Announcements (via <code>aria-live=&quot;polite&quot;</code>) occur upon start, pause, reset, major section warnings,
            and final timer expiration.
          </p>
        </section>
      </div>
    </div>
  );
}

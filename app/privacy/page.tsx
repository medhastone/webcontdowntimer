import { buildPageMetadata } from '@/lib/seo-metadata';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/privacy');
}

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-neutral-800 dark:text-neutral-200">
      <div className="space-y-2">
        <span className="text-xs font-mono uppercase text-neutral-500">Legal &amp; Transparency</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
          Privacy Policy
        </h1>
        <p className="text-xs font-mono text-neutral-500">Last updated: November 2026</p>
      </div>

      <div className="space-y-6 text-sm leading-relaxed border-t border-neutral-200 dark:border-neutral-800 pt-6">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900 dark:text-white">1. Core Privacy Philosophy</h2>
          <p>
            WebCountDownTimer (WebCountDownTimer.com) was built on the principle that time tools should respect your attention and privacy.
            We do not require user accounts, email registration, or logins to access any of our tools.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900 dark:text-white">2. Data Storage &amp; Local State</h2>
          <p>
            All timers, custom countdown presets, student name lists, lap histories, and stage sync messages are processed
            locally inside your browser. State synchronization between multiple screens (such as stage confidence
            monitors) uses browser-native <code>BroadcastChannel</code> and <code>localStorage</code> APIs.
            This data never leaves your device.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900 dark:text-white">3. Cookies &amp; Tracking</h2>
          <p>
            WebCountDownTimer does not use behavioral advertising cookies or third-party marketing trackers.
            Only essential local preferences (such as your light/dark theme toggle or custom timer presets) are stored in your browser&apos;s <code>localStorage</code>.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900 dark:text-white">4. Device APIs, Microphone &amp; Local Files</h2>
          <p>
            WebCountDownTimer requests browser-native capabilities strictly for functional utility when initiated by the user:
          </p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li><strong>Screen Wake Lock:</strong> Used to keep presentation screens and classroom monitors from dimming during active countdowns.</li>
            <li><strong>Web Audio API:</strong> Used to synthesize completion chimes and interval bells locally in real time without external audio files.</li>
            <li><strong>Microphone Access (Classroom Noise Meter only):</strong> If you choose to enable live microphone monitoring in the Classroom Noise Meter, audio amplitude is analyzed locally in volatile browser memory via <code>AudioContext</code> to calculate a visual decibel level. Audio is never recorded, stored, or transmitted to any server.</li>
            <li><strong>Local Image Selection (Picture Reveal Timer only):</strong> If you upload a custom image in the Picture Reveal Timer, the image is rendered using a temporary local browser object URL (<code>URL.createObjectURL</code>) and is never uploaded to any external server.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900 dark:text-white">5. Contact</h2>
          <p>
            For privacy inquiries or technical questions, please reach out via our contact page.
          </p>
        </section>
      </div>
    </div>
  );
}


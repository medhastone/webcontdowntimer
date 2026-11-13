import { buildPageMetadata } from '@/lib/seo-metadata';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Zap, Globe, Clock, Tv } from 'lucide-react';
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
            that require an account before you can set a simple countdown. We built WebCountDownTimer
            so presenters, teachers, students, athletes, and remote teams can open a clean, full-screen
            timing tool in one click on any device.
          </p>
          <p>
            For a complete breakdown of our browser timing architecture, calculation formulas, and technical provenance standards, read our dedicated guide:{' '}
            <Link
              href="/guides/how-accurate-online-timers-work"
              className="text-blue-600 dark:text-blue-400 underline font-semibold"
            >
              How Accurate Online Timers Work
            </Link>
            .
          </p>
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


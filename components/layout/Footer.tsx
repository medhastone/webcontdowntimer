'use client';

import React, { useState, useEffect, useRef, useSyncExternalStore } from 'react';
import Link from 'next/link';
import {
  Globe,
  ChevronDown,
  Sun,
  Moon,
  ArrowUpRight,
  ArrowUp,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import {
  SUPPORTED_LANGUAGES,
  getLanguageSnapshot,
  getServerLanguageSnapshot,
  setGlobalLanguage,
  subscribeLanguage,
} from '@/lib/i18n';
import { LanguageFlag, LANGUAGE_META } from '@/components/ui/LanguageFlag';
import { BrandLogo } from '@/components/ui/BrandLogo';

interface FooterLinkItem {
  label: string;
  href: string;
  badge?: 'New' | 'Hot';
}

const ESSENTIAL_TIMERS: FooterLinkItem[] = [
  { label: 'Countdown Timer', href: '/countdown-timer', badge: 'Hot' },
  { label: 'Flip Clock', href: '/timers/flip-clock', badge: 'New' },
  { label: 'Visual Timer', href: '/visual-timer' },
  { label: 'Pomodoro Timer', href: '/pomodoro-timer' },
  { label: 'Stopwatch', href: '/stopwatch' },
  { label: 'Interval Timer', href: '/interval-timer' },
];

const VISUAL_AND_SENSORY: FooterLinkItem[] = [
  { label: 'Sensory Timers', href: '/timers/sensory-timers', badge: 'New' },
  { label: 'Flip Timer', href: '/timers/flip-timer', badge: 'New' },
  { label: 'Train Timer', href: '/timers/train-timer', badge: 'New' },
  { label: 'Forest Fire Timer', href: '/timers/forest-fire-timer', badge: 'New' },
  { label: 'Lava Lamp Timer', href: '/timers/lava-lamp-timer' },
  { label: 'Liquid Timer', href: '/timers/liquid-timer' },
];

const STAGE_CLASS_WORLD: FooterLinkItem[] = [
  { label: 'Stage Timer', href: '/stage-timer', badge: 'Hot' },
  { label: 'Classroom Timer', href: '/classroom-timer' },
  { label: 'World Clock', href: '/world-clock' },
  { label: 'Time-Zone Converter', href: '/time-zone-converter' },
  { label: 'Meeting Planner', href: '/meeting-planner' },
  { label: 'Duration Calculator', href: '/time-duration-calculator' },
];

const BROWSE_CATEGORIES: FooterLinkItem[] = [
  { label: 'Everyday Timers', href: '/category/timers' },
  { label: 'Presentation & Events', href: '/category/events' },
  { label: 'Education & Classroom', href: '/category/education' },
  { label: 'Fitness & Wellness', href: '/category/fitness' },
  { label: 'World Time & Tools', href: '/category/world' },
  { label: 'Random Name Picker', href: '/random-name-picker' },
];

const LANGUAGES = SUPPORTED_LANGUAGES;

export default function Footer() {
  const [langOpen, setLangOpen] = useState(false);
  const selectedLang = useSyncExternalStore(
    subscribeLanguage,
    getLanguageSnapshot,
    getServerLanguageSnapshot
  );
  const langMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    if (typeof document !== 'undefined') {
      const isDark = document.documentElement.classList.contains('dark');
      if (isDark) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('timetools_theme', 'light');
      } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('timetools_theme', 'dark');
      }
    }
  };

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full bg-[#F7F6F2] dark:bg-[#111513] text-[#252B27] dark:text-[#E7EDE7] border-t border-[#E4E1D9] dark:border-[#232B26] transition-colors">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Main Balanced 5-Column Footer Grid */}
        <div className="py-12 sm:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 border-b border-[#E4E1D9] dark:border-[#232B26]">
          {/* Column 1: Brand Identity, Trust Badges & Socials (4 cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-6 pr-0 lg:pr-6">
            <div className="space-y-4">
              <Link href="/" className="inline-flex items-center" aria-label="WebCountDownTimer Home">
                <BrandLogo size="md" />
              </Link>

              <p className="text-xs sm:text-sm text-[#252B27]/75 dark:text-slate-400 leading-relaxed max-w-sm">
                Precision online countdown timers, split-flap clocks, sensory visual timers, and global time tools designed for classrooms, stage events, and deep work.
              </p>

              {/* Key Trust Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {['100% Free', 'No Sign-Up', 'Fullscreen Ready'].map((pill) => (
                  <span
                    key={pill}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-[#19201C] border border-[#E4E1D9] dark:border-[#2A342E] text-[11px] font-medium text-[#252B27]/80 dark:text-slate-300"
                  >
                    <CheckCircle2 className="w-3 h-3 text-[#365C4B] dark:text-[#5E917A]" />
                    <span>{pill}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Social Links & Directory CTA */}
            <div className="flex items-center justify-between sm:justify-start gap-4 pt-1">
              <div className="flex items-center gap-2">
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-white dark:bg-[#19201C] border border-[#E4E1D9] dark:border-[#2A342E] flex items-center justify-center text-[#252B27]/70 dark:text-slate-400 hover:text-[#365C4B] dark:hover:text-white hover:border-[#365C4B] dark:hover:border-[#5E917A] transition-colors"
                  aria-label="X (Twitter)"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-white dark:bg-[#19201C] border border-[#E4E1D9] dark:border-[#2A342E] flex items-center justify-center text-[#252B27]/70 dark:text-slate-400 hover:text-[#365C4B] dark:hover:text-white hover:border-[#365C4B] dark:hover:border-[#5E917A] transition-colors"
                  aria-label="YouTube"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
                <a
                  href="https://pinterest.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-white dark:bg-[#19201C] border border-[#E4E1D9] dark:border-[#2A342E] flex items-center justify-center text-[#252B27]/70 dark:text-slate-400 hover:text-[#365C4B] dark:hover:text-white hover:border-[#365C4B] dark:hover:border-[#5E917A] transition-colors"
                  aria-label="Pinterest"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0a12 12 0 0 0-4.37 23.18c-.07-.94-.13-2.39.03-3.42l1.09-4.63s-.28-.56-.28-1.39c0-1.3.75-2.28 1.7-2.28.8 0 1.19.6 1.19 1.33 0 .81-.51 2.01-.78 3.13-.22.95.47 1.72 1.4 1.72 1.69 0 2.99-1.78 2.99-4.35 0-2.27-1.63-3.86-3.96-3.86-2.7 0-4.28 2.02-4.28 4.11 0 .81.31 1.68.7 2.16.08.1.09.18.06.33l-.26 1.08c-.04.18-.15.22-.34.13-1.28-.59-2.07-2.46-2.07-3.96 0-3.23 2.35-6.2 6.78-6.2 3.56 0 6.32 2.54 6.32 5.93 0 3.54-2.23 6.38-5.32 6.38-1.04 0-2.02-.54-2.35-1.18l-.64 2.45c-.23.89-.86 2.01-1.28 2.7A12 12 0 1 0 12 0z" />
                  </svg>
                </a>
              </div>

              <Link
                href="/tools"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#365C4B] hover:bg-[#2B4A3C] text-white text-xs font-semibold transition-colors shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Explore All 47+ Tools</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Column 2: Essential Timers (2 cols) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#252B27] dark:text-white">
              Essential Timers
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-[13px] text-[#252B27]/75 dark:text-slate-400">
              {ESSENTIAL_TIMERS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-2 hover:text-[#365C4B] dark:hover:text-[#5E917A] transition-colors"
                  >
                    <span>{item.label}</span>
                    {item.badge === 'New' && (
                      <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/70 leading-none">
                        New
                      </span>
                    )}
                    {item.badge === 'Hot' && (
                      <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/70 leading-none">
                        Hot
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Visual & Sensory (2 cols) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#252B27] dark:text-white">
              Visual &amp; Sensory
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-[13px] text-[#252B27]/75 dark:text-slate-400">
              {VISUAL_AND_SENSORY.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-2 hover:text-[#365C4B] dark:hover:text-[#5E917A] transition-colors"
                  >
                    <span>{item.label}</span>
                    {item.badge === 'New' && (
                      <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/70 leading-none">
                        New
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Stage, Class & World (2 cols) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#252B27] dark:text-white">
              Stage, Class &amp; World
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-[13px] text-[#252B27]/75 dark:text-slate-400">
              {STAGE_CLASS_WORLD.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-2 hover:text-[#365C4B] dark:hover:text-[#5E917A] transition-colors"
                  >
                    <span>{item.label}</span>
                    {item.badge === 'Hot' && (
                      <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/70 leading-none">
                        Hot
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Categories & Directory (2 cols) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#252B27] dark:text-white">
              Categories
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-[13px] text-[#252B27]/75 dark:text-slate-400">
              {BROWSE_CATEGORIES.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:text-[#365C4B] dark:hover:text-[#5E917A] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Quick Links & Controls */}
        <div className="py-6 flex flex-col lg:flex-row items-center justify-between gap-4 text-xs text-[#252B27]/65 dark:text-slate-400">
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-5 text-center sm:text-left">
            <span>
              © {new Date().getFullYear()} <strong className="font-semibold text-[#252B27] dark:text-slate-200">WebCountDownTimer.com</strong>. All rights reserved.
            </span>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[#252B27]/70 dark:text-slate-400">
              <Link href="/about" className="hover:text-[#365C4B] dark:hover:text-[#5E917A] transition-colors">
                About &amp; Methodology
              </Link>
              <Link href="/guides" className="hover:text-[#365C4B] dark:hover:text-[#5E917A] transition-colors">
                Guides
              </Link>
              <Link href="/accessibility" className="hover:text-[#365C4B] dark:hover:text-[#5E917A] transition-colors">
                Accessibility
              </Link>
              <Link href="/privacy" className="hover:text-[#365C4B] dark:hover:text-[#5E917A] transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-[#365C4B] dark:hover:text-[#5E917A] transition-colors">
                Terms of Use
              </Link>
              <Link href="/contact" className="hover:text-[#365C4B] dark:hover:text-[#5E917A] transition-colors">
                Contact
              </Link>
              <Link href="/sitemap" className="hover:text-[#365C4B] dark:hover:text-[#5E917A] transition-colors">
                Sitemap
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Language Selector */}
            <div className="relative" ref={langMenuRef} data-no-translate="true">
              <button
                type="button"
                onClick={() => setLangOpen(!langOpen)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-[#19201C] border border-[#E4E1D9] dark:border-[#2A342E] text-[#252B27]/80 dark:text-slate-300 hover:border-[#365C4B] dark:hover:border-[#5E917A] transition-colors cursor-pointer"
                aria-label="Select language"
              >
                <LanguageFlag lang={selectedLang} className="w-4 h-3" />
                <span>{selectedLang}</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {langOpen && (
                <div className="absolute right-0 bottom-full mb-1.5 w-44 bg-white dark:bg-[#19201C] border border-[#E4E1D9] dark:border-[#2A342E] rounded-xl shadow-xl p-1.5 z-50">
                  {LANGUAGES.map((l) => {
                    const meta = LANGUAGE_META[l];
                    const isSelected = selectedLang === l;
                    return (
                      <button
                        key={l}
                        type="button"
                        onClick={() => {
                          setGlobalLanguage(l);
                          setLangOpen(false);
                        }}
                        className={`w-full flex items-center justify-between gap-2.5 px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#E7EDE7]/80 dark:bg-[#253029] font-semibold text-[#365C4B] dark:text-[#5E917A]'
                            : 'hover:bg-[#F7F6F2] dark:hover:bg-[#202722] text-[#252B27] dark:text-slate-300'
                        }`}
                      >
                        <span className="flex items-center gap-2.5 min-w-0">
                          <LanguageFlag lang={l} className="w-4 h-3" />
                          <span className="truncate">{l}</span>
                        </span>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#252B27]/45 dark:text-slate-500">
                          {meta?.code}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Dark / Light Mode Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-[#19201C] border border-[#E4E1D9] dark:border-[#2A342E] text-[#252B27]/80 dark:text-slate-300 hover:border-[#365C4B] dark:hover:border-[#5E917A] transition-colors cursor-pointer"
              aria-label="Toggle color theme"
            >
              <Sun className="w-3.5 h-3.5 hidden dark:inline text-amber-400" />
              <Moon className="w-3.5 h-3.5 inline dark:hidden text-slate-600" />
              <span className="hidden sm:inline">Theme</span>
            </button>

            {/* Back to Top Button */}
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#19201C] border border-[#E4E1D9] dark:border-[#2A342E] text-[#252B27]/80 dark:text-slate-300 hover:border-[#365C4B] dark:hover:border-[#5E917A] hover:text-[#365C4B] dark:hover:text-white transition-colors cursor-pointer"
              aria-label="Back to top"
              title="Back to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Top</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

'use client';

import React, { useState, useEffect, useRef, useMemo, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
  Sun,
  Moon,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  Bookmark,
  Heart,
  Trash2,
  Plus,
  RotateCcw,
} from 'lucide-react';
import { ALL_HOME_TOOLS } from '@/lib/home-data';
import { ToolIconBadge } from '@/components/ui/ToolIcon';
import {
  SUPPORTED_LANGUAGES,
  getLanguageSnapshot,
  getServerLanguageSnapshot,
  setGlobalLanguage,
  subscribeLanguage,
} from '@/lib/i18n';
import { LanguageFlag, LANGUAGE_META } from '@/components/ui/LanguageFlag';
import { BrandLogo } from '@/components/ui/BrandLogo';
import {
  subscribeCustomTimers,
  getCustomTimersSnapshot,
  getServerCustomTimersSnapshot,
  buildCustomTimerHref,
  toggleLikeSavedTimer,
  deleteSavedTimer,
  restoreDefaultSavedTimers,
  DEFAULT_CUSTOM_TIMERS,
  PRE_SAVED_IDS,
} from '@/lib/custom-timers-store';
import { CustomTimerIcon } from '@/components/ui/CustomTimerIcon';

const themeListeners = new Set<() => void>();

function subscribeTheme(callback: () => void) {
  themeListeners.add(callback);
  return () => {
    themeListeners.delete(callback);
  };
}

function getThemeSnapshot(): boolean {
  if (typeof window === 'undefined') return false;
  const stored =
    localStorage.getItem('timetools_theme') || localStorage.getItem('timetoolsgo_theme');
  if (stored) return stored === 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function getServerThemeSnapshot(): boolean {
  return false;
}

interface NavTimerItem {
  label: string;
  href: string;
  desc: string;
}

const TIMERS_POPOVER_COLUMNS: Array<{
  heading: string;
  items: NavTimerItem[];
}> = [
  {
    heading: 'Core Timers',
    items: [
      {
        label: 'Countdown Timer',
        href: '/countdown-timer',
        desc: 'Precision daily countdown clock',
      },
      {
        label: 'Visual Timer',
        href: '/visual-timer',
        desc: '10 animated shrinking clock styles',
      },
      {
        label: 'Pomodoro Timer',
        href: '/pomodoro-timer',
        desc: '25/5 focus & break intervals',
      },
      {
        label: 'Stopwatch',
        href: '/stopwatch',
        desc: 'Millisecond split-lap timer',
      },
      {
        label: 'Stage Timer',
        href: '/stage-timer',
        desc: 'Speaker monitor & live controller',
      },
    ],
  },
  {
    heading: 'Visual & Custom',
    items: [
      {
        label: 'Custom Timer Studio',
        href: '/custom-timer',
        desc: 'Create & save your own timer',
      },
      {
        label: 'Flip Clock',
        href: '/timers/flip-clock',
        desc: 'Retro 3D mechanical split-flap',
      },
      {
        label: 'Sensory Visual Timers',
        href: '/timers/sensory-timers',
        desc: 'Calm, low-distraction visuals',
      },
      {
        label: 'Lava Lamp Timer',
        href: '/timers/lava-lamp-timer',
        desc: 'Relaxing rising wax blobs',
      },
      {
        label: 'Sand Timer',
        href: '/timers/sand-timer',
        desc: 'Digital glass hourglass',
      },
    ],
  },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const isDarkMode = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getServerThemeSnapshot
  );

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSavedOpen, setMobileSavedOpen] = useState(false);
  const [activePopover, setActivePopover] = useState<
    'timers' | 'search' | 'saved' | 'lang' | null
  >(null);
  const [navSearchQuery, setNavSearchQuery] = useState('');

  const currentLang = useSyncExternalStore(
    subscribeLanguage,
    getLanguageSnapshot,
    getServerLanguageSnapshot
  );

  const savedTimers = useSyncExternalStore(
    subscribeCustomTimers,
    getCustomTimersSnapshot,
    getServerCustomTimersSnapshot
  );

  const headerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (activePopover === 'search') {
      const rafId = window.requestAnimationFrame(() => {
        searchInputRef.current?.focus();
      });
      return () => window.cancelAnimationFrame(rafId);
    }
    return undefined;
  }, [activePopover]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setActivePopover(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActivePopover(null);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDarkMode;
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('timetools_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('timetools_theme', 'light');
    }
    themeListeners.forEach((fn) => fn());
  };

  const navSearchMatches = useMemo(() => {
    const q = navSearchQuery.trim().toLowerCase();
    if (!q) {
      return ALL_HOME_TOOLS.slice(0, 6);
    }
    return ALL_HOME_TOOLS.filter(
      (tool) =>
        tool.title.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q) ||
        tool.keywords.some((kw) => kw.toLowerCase().includes(q))
    ).slice(0, 7);
  }, [navSearchQuery]);

  const handleNavSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = navSearchQuery.trim();
    if (q) {
      if (navSearchMatches.length > 0) {
        router.push(navSearchMatches[0].href);
      } else {
        router.push(`/tools?q=${encodeURIComponent(q)}`);
      }
      setActivePopover(null);
      setMobileMenuOpen(false);
    }
  };

  const isTimersActive =
    pathname.startsWith('/timers') ||
    pathname === '/countdown-timer' ||
    pathname === '/visual-timer' ||
    pathname === '/stopwatch' ||
    pathname === '/pomodoro-timer' ||
    pathname === '/interval-timer' ||
    pathname === '/stage-timer' ||
    pathname === '/custom-timer';

  const isHolidaysActive = pathname.startsWith('/days-until');
  const isWorldActive =
    pathname.startsWith('/world-clock') || pathname.startsWith('/category/world');
  const isAllToolsActive =
    pathname.startsWith('/tools') ||
    (pathname.startsWith('/category/') && !pathname.startsWith('/category/world'));

  const currentLangCode = LANGUAGE_META[currentLang]?.code || 'EN';

  return (
    <header className="sticky top-0 z-50 w-full bg-[#F7F6F2]/95 dark:bg-[#141816]/95 backdrop-blur-md border-b border-[#E4E1D9] dark:border-[#262D28] transition-colors">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10" ref={headerRef}>
        <div className="flex items-center justify-between h-16 gap-6">
          {/* Left: Clean Brand Logo */}
          <Link
            prefetch={false}
            href="/"
            onClick={() => {
              setActivePopover(null);
              setMobileMenuOpen(false);
            }}
            className="inline-flex items-center shrink-0 py-1"
            aria-label="WebCountDownTimer Home"
          >
            <BrandLogo size="md" />
          </Link>

          {/* Center: Minimal 4-Item Primary Navigation */}
          <nav
            className="hidden lg:flex items-center gap-1.5 text-[14px] font-medium text-[#252B27] dark:text-slate-200"
            aria-label="Main Navigation"
          >
            {/* 1. Timers Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setActivePopover(activePopover === 'timers' ? null : 'timers')
                }
                aria-expanded={activePopover === 'timers'}
                className={`inline-flex items-center gap-1 px-3.5 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  isTimersActive || activePopover === 'timers'
                    ? 'bg-[#E7EDE7]/80 dark:bg-[#222B25] text-[#365C4B] dark:text-[#7EC4A0] font-semibold'
                    : 'text-[#252B27]/80 dark:text-slate-300 hover:text-[#252B27] dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.05]'
                }`}
              >
                <span>Timers</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-150 ${
                    activePopover === 'timers' ? 'rotate-180 opacity-100' : 'opacity-55'
                  }`}
                />
              </button>

              {activePopover === 'timers' && (
                <div className="absolute left-0 top-full mt-2.5 w-[540px] p-5 bg-white dark:bg-[#1A201C] border border-[#E4E1D9] dark:border-[#2D352F] rounded-2xl shadow-xl z-50">
                  <div className="grid grid-cols-2 gap-6">
                    {TIMERS_POPOVER_COLUMNS.map((col) => (
                      <div key={col.heading} className="space-y-2">
                        <div className="px-2 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-[#252B27]/50 dark:text-slate-400 border-b border-[#F0EDE6] dark:border-[#262D28]">
                          {col.heading}
                        </div>
                        <div className="space-y-0.5">
                          {col.items.map((item) => (
                            <Link
                              prefetch={false}
                              key={item.href}
                              href={item.href}
                              onClick={() => setActivePopover(null)}
                              className="group flex items-center gap-2.5 p-2 rounded-xl hover:bg-[#F7F6F2] dark:hover:bg-[#232B26] transition-colors"
                            >
                              <ToolIconBadge tool={item.href} size="xs" />
                              <div className="min-w-0 flex-1">
                                <div className="text-xs font-semibold text-[#252B27] dark:text-white group-hover:text-[#365C4B] dark:group-hover:text-[#7EC4A0] truncate">
                                  {item.label}
                                </div>
                                <div className="text-[11px] text-[#252B27]/60 dark:text-slate-400 truncate">
                                  {item.desc}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#E4E1D9] dark:border-[#262D28] flex items-center justify-between text-xs font-semibold">
                    <Link
                      prefetch={false}
                      href="/category/education"
                      onClick={() => setActivePopover(null)}
                      className="text-[#252B27]/70 dark:text-slate-300 hover:text-[#365C4B] dark:hover:text-[#7EC4A0] transition-colors"
                    >
                      Classroom &amp; Education
                    </Link>
                    <Link
                      prefetch={false}
                      href="/tools"
                      onClick={() => setActivePopover(null)}
                      className="inline-flex items-center gap-1 text-[#365C4B] dark:text-[#7EC4A0] hover:underline"
                    >
                      <span>Browse All Tools</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Holidays */}
            <Link
              prefetch={false}
              href="/days-until"
              onClick={() => setActivePopover(null)}
              className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
                isHolidaysActive
                  ? 'bg-[#E7EDE7]/80 dark:bg-[#222B25] text-[#365C4B] dark:text-[#7EC4A0] font-semibold'
                  : 'text-[#252B27]/80 dark:text-slate-300 hover:text-[#252B27] dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.05]'
              }`}
            >
              Holidays
            </Link>

            {/* 3. World Clock */}
            <Link
              prefetch={false}
              href="/world-clock"
              onClick={() => setActivePopover(null)}
              className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
                isWorldActive
                  ? 'bg-[#E7EDE7]/80 dark:bg-[#222B25] text-[#365C4B] dark:text-[#7EC4A0] font-semibold'
                  : 'text-[#252B27]/80 dark:text-slate-300 hover:text-[#252B27] dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.05]'
              }`}
            >
              World Clock
            </Link>

            {/* 4. All Tools */}
            <Link
              prefetch={false}
              href="/tools"
              onClick={() => setActivePopover(null)}
              className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
                isAllToolsActive
                  ? 'bg-[#E7EDE7]/80 dark:bg-[#222B25] text-[#365C4B] dark:text-[#7EC4A0] font-semibold'
                  : 'text-[#252B27]/80 dark:text-slate-300 hover:text-[#252B27] dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.05]'
              }`}
            >
              All Tools
            </Link>
          </nav>

          {/* Right: Clean Compact Utility Controls */}
          <div className="flex items-center gap-1.5">
            {/* Compact Search Popover Trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setActivePopover(activePopover === 'search' ? null : 'search')
                }
                aria-expanded={activePopover === 'search'}
                aria-label="Search tools"
                title="Search tools"
                className={`inline-flex items-center justify-center w-9 h-9 rounded-lg transition-colors cursor-pointer ${
                  activePopover === 'search'
                    ? 'bg-[#E7EDE7] dark:bg-[#222B25] text-[#365C4B] dark:text-[#7EC4A0]'
                    : 'text-[#252B27]/75 dark:text-slate-300 hover:text-[#252B27] dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
                }`}
              >
                <Search className="w-4 h-4" />
              </button>

              {activePopover === 'search' && (
                <div className="absolute right-0 top-full mt-2.5 w-[min(92vw,380px)] bg-white dark:bg-[#1A201C] border border-[#E4E1D9] dark:border-[#2D352F] rounded-2xl shadow-2xl z-50 overflow-hidden">
                  <form
                    onSubmit={handleNavSearch}
                    className="flex items-center gap-2 px-3.5 py-2.5 border-b border-[#E4E1D9] dark:border-[#262D28]"
                  >
                    <Search className="w-4 h-4 text-[#252B27]/45 dark:text-slate-400 shrink-0" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={navSearchQuery}
                      onChange={(e) => setNavSearchQuery(e.target.value)}
                      placeholder="Search timers, holidays, clocks..."
                      className="w-full text-sm bg-transparent text-[#252B27] dark:text-white placeholder-[#252B27]/45 dark:placeholder-slate-500 focus:outline-hidden"
                      aria-label="Search tools"
                    />
                    {navSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setNavSearchQuery('')}
                        className="text-[#252B27]/40 hover:text-[#252B27] dark:text-slate-500 dark:hover:text-white cursor-pointer"
                        aria-label="Clear search"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </form>

                  {navSearchMatches.length > 0 ? (
                    <div className="max-h-72 overflow-y-auto divide-y divide-[#E4E1D9]/50 dark:divide-[#262D28]">
                      {navSearchMatches.map((tool) => (
                        <Link
                          prefetch={false}
                          key={tool.id}
                          href={tool.href}
                          onClick={() => {
                            setActivePopover(null);
                            setNavSearchQuery('');
                          }}
                          className="flex items-center justify-between gap-3 px-3.5 py-2.5 hover:bg-[#F7F6F2] dark:hover:bg-[#232B26] transition-colors group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <ToolIconBadge tool={tool.href || tool.title} size="xs" />
                            <div className="min-w-0">
                              <div className="text-xs font-semibold text-[#252B27] dark:text-white group-hover:text-[#365C4B] dark:group-hover:text-[#7EC4A0] truncate">
                                {tool.title}
                              </div>
                              <p className="text-[11px] text-[#252B27]/60 dark:text-slate-400 truncate">
                                {tool.description}
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-[#365C4B] dark:text-[#7EC4A0] opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-xs text-[#252B27]/60 dark:text-slate-400">
                      No matching tools for &ldquo;{navSearchQuery}&rdquo;.
                    </div>
                  )}

                  <div className="border-t border-[#E4E1D9] dark:border-[#262D28] bg-[#F7F6F2]/70 dark:bg-[#141816]/70 px-3.5 py-2">
                    <Link
                      prefetch={false}
                      href={
                        navSearchQuery.trim()
                          ? `/tools?q=${encodeURIComponent(navSearchQuery.trim())}`
                          : '/tools'
                      }
                      onClick={() => setActivePopover(null)}
                      className="flex items-center justify-between text-xs font-semibold text-[#365C4B] dark:text-[#7EC4A0] hover:underline"
                    >
                      <span>View All Tools Directory</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Compact Saved Timers Icon Trigger (Desktop) */}
            <div className="relative hidden sm:block">
              <button
                type="button"
                onClick={() =>
                  setActivePopover(activePopover === 'saved' ? null : 'saved')
                }
                aria-expanded={activePopover === 'saved'}
                aria-label={`Saved Timers (${savedTimers.length})`}
                title={`Saved Timers (${savedTimers.length})`}
                className={`relative inline-flex items-center justify-center w-9 h-9 rounded-lg transition-colors cursor-pointer ${
                  activePopover === 'saved'
                    ? 'bg-[#E7EDE7] dark:bg-[#222B25] text-[#365C4B] dark:text-[#7EC4A0]'
                    : 'text-[#252B27]/75 dark:text-slate-300 hover:text-[#252B27] dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                {savedTimers.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-[#365C4B] text-white text-[10px] font-mono font-bold flex items-center justify-center leading-none">
                    {savedTimers.length}
                  </span>
                )}
              </button>

              {activePopover === 'saved' && (
                <div className="absolute right-0 top-full mt-2.5 w-[360px] p-3.5 bg-white dark:bg-[#1A201C] border border-[#E4E1D9] dark:border-[#2D352F] rounded-2xl shadow-2xl z-50">
                  <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[#F0EDE6] dark:border-[#262D28]">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#365C4B] dark:text-[#7EC4A0]">
                      Saved Timers ({savedTimers.length})
                    </span>
                    <div className="flex items-center gap-2.5">
                      {DEFAULT_CUSTOM_TIMERS.some(
                        (d) => !savedTimers.some((s) => s.id === d.id)
                      ) && (
                        <button
                          type="button"
                          onClick={() => restoreDefaultSavedTimers()}
                          className="text-[11px] font-semibold text-[#252B27]/65 dark:text-slate-300 hover:text-[#365C4B] dark:hover:text-[#7EC4A0] inline-flex items-center gap-1 cursor-pointer"
                          title="Restore pre-saved timers"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Restore</span>
                        </button>
                      )}
                      <Link
                        prefetch={false}
                        href="/custom-timer"
                        onClick={() => setActivePopover(null)}
                        className="text-[11px] font-bold text-[#365C4B] dark:text-[#7EC4A0] hover:underline inline-flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>New</span>
                      </Link>
                    </div>
                  </div>

                  <div className="max-h-72 overflow-y-auto py-2 space-y-1">
                    {savedTimers.length === 0 ? (
                      <div className="py-5 px-3 text-center space-y-2.5">
                        <p className="text-xs text-[#252B27]/65 dark:text-slate-400">
                          No saved timers yet.
                        </p>
                        <button
                          type="button"
                          onClick={() => restoreDefaultSavedTimers()}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#365C4B]/40 text-xs font-semibold text-[#365C4B] dark:text-[#7EC4A0] hover:bg-[#E7EDE7]/60 dark:hover:bg-[#232B26] cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Load Pre-Saved Timers</span>
                        </button>
                      </div>
                    ) : (
                      savedTimers.map((item) => {
                        const mins = Math.floor(item.durationSec / 60);
                        const secs = item.durationSec % 60;
                        const durText = secs > 0 ? `${mins}m ${secs}s` : `${mins} min`;
                        const isPreSaved = PRE_SAVED_IDS.has(item.id);
                        return (
                          <div
                            key={item.id}
                            className="group flex items-center justify-between gap-2 p-2 rounded-xl hover:bg-[#F7F6F2] dark:hover:bg-[#232B26] transition-colors"
                          >
                            <Link
                              prefetch={false}
                              href={buildCustomTimerHref(item)}
                              onClick={() => setActivePopover(null)}
                              className="flex items-center gap-2.5 min-w-0 flex-1"
                            >
                              <span
                                className="w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0"
                                style={{ backgroundColor: item.color }}
                              >
                                <CustomTimerIcon icon={item.icon} className="w-3.5 h-3.5" />
                              </span>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-semibold text-[#252B27] dark:text-white group-hover:text-[#365C4B] dark:group-hover:text-[#7EC4A0] truncate">
                                    {item.title}
                                  </span>
                                  {isPreSaved && (
                                    <span className="text-[10px] font-medium text-[#252B27]/45 dark:text-slate-500 shrink-0">
                                      Preset
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-[#252B27]/60 dark:text-slate-400 truncate">
                                  {durText}
                                </div>
                              </div>
                            </Link>

                            <div className="flex items-center gap-0.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => toggleLikeSavedTimer(item.id)}
                                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                  item.liked
                                    ? 'text-[#D93B8A]'
                                    : 'text-slate-400 hover:text-[#D93B8A]'
                                }`}
                                title={item.liked ? 'Liked' : 'Like timer'}
                                aria-label="Toggle like"
                              >
                                <Heart
                                  className={`w-3.5 h-3.5 ${item.liked ? 'fill-current' : ''}`}
                                />
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteSavedTimer(item.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-[#D94343] hover:bg-[#D94343]/10 transition-colors cursor-pointer"
                                title="Delete from saved list"
                                aria-label={`Delete ${item.title} from saved list`}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  <div className="pt-2.5 border-t border-[#E4E1D9] dark:border-[#262D28]">
                    <Link
                      prefetch={false}
                      href="/custom-timer"
                      onClick={() => setActivePopover(null)}
                      className="w-full py-2 px-3 rounded-xl bg-[#365C4B] hover:bg-[#2B4A3C] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create Custom Timer</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Compact Language Selector */}
            <div className="relative" data-no-translate="true">
              <button
                type="button"
                onClick={() =>
                  setActivePopover(activePopover === 'lang' ? null : 'lang')
                }
                aria-expanded={activePopover === 'lang'}
                className="inline-flex items-center gap-1.5 h-9 px-2.5 rounded-lg text-xs font-semibold text-[#252B27]/80 dark:text-slate-200 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
                aria-label="Select language"
                title={`Language: ${currentLang}`}
              >
                <LanguageFlag lang={currentLang} className="w-4 h-3" />
                <span className="hidden sm:inline uppercase tracking-wide">{currentLangCode}</span>
                <ChevronDown className="w-3 h-3 opacity-50" />
              </button>

              {activePopover === 'lang' && (
                <div className="absolute right-0 top-full mt-2.5 w-44 bg-white dark:bg-[#1A201C] border border-[#E4E1D9] dark:border-[#2D352F] rounded-xl shadow-xl p-1.5 z-50">
                  {SUPPORTED_LANGUAGES.map((lang) => {
                    const meta = LANGUAGE_META[lang];
                    const isSelected = currentLang === lang;
                    return (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => {
                          setGlobalLanguage(lang);
                          setActivePopover(null);
                        }}
                        className={`w-full flex items-center justify-between gap-2.5 px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#E7EDE7] dark:bg-[#252E28] text-[#365C4B] dark:text-[#7EC4A0] font-bold'
                            : 'text-[#252B27] dark:text-slate-300 hover:bg-[#F7F6F2] dark:hover:bg-[#202722]'
                        }`}
                      >
                        <span className="flex items-center gap-2.5 min-w-0">
                          <LanguageFlag lang={lang} className="w-4 h-3" />
                          <span className="truncate">{lang}</span>
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

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-[#252B27]/75 dark:text-amber-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-[#365C4B]" />
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                setActivePopover(null);
              }}
              className="lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg text-[#252B27] dark:text-slate-200 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] cursor-pointer"
              aria-label="Toggle mobile menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Clean Minimal Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-[#E4E1D9] dark:border-[#262D28] space-y-3">
            {/* Compact Mobile Links */}
            <nav className="flex flex-col space-y-1" aria-label="Mobile Navigation">
              {[
                { label: 'Timers', href: '/category/timers' },
                { label: 'Holidays', href: '/days-until' },
                { label: 'World Clock', href: '/world-clock' },
                { label: 'Custom Timer', href: '/custom-timer' },
                { label: 'All Tools', href: '/tools' },
              ].map((navItem) => {
                const active = pathname === navItem.href || pathname.startsWith(`${navItem.href}/`);
                return (
                  <Link
                    prefetch={false}
                    key={navItem.href}
                    href={navItem.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      active
                        ? 'bg-[#E7EDE7]/80 dark:bg-[#222B25] text-[#365C4B] dark:text-[#7EC4A0] font-semibold'
                        : 'text-[#252B27] dark:text-slate-200 hover:bg-white dark:hover:bg-[#1A201C]'
                    }`}
                  >
                    <span>{navItem.label}</span>
                    <ArrowRight className="w-4 h-4 opacity-45" />
                  </Link>
                );
              })}
            </nav>

            {/* Collapsible Saved Timers Section (Keeps Mobile Menu Compact) */}
            <div className="pt-2 border-t border-[#E4E1D9] dark:border-[#262D28]">
              <button
                type="button"
                onClick={() => setMobileSavedOpen(!mobileSavedOpen)}
                aria-expanded={mobileSavedOpen}
                className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-[#252B27]/80 dark:text-slate-300 hover:bg-white dark:hover:bg-[#1A201C] transition-colors cursor-pointer"
              >
                <span className="inline-flex items-center gap-2">
                  <Bookmark className="w-3.5 h-3.5 text-[#365C4B] dark:text-[#7EC4A0]" />
                  <span>Saved Timers ({savedTimers.length})</span>
                </span>
                <ChevronDown
                  className={`w-4 h-4 opacity-55 transition-transform ${
                    mobileSavedOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {mobileSavedOpen && (
                <div className="mt-2 px-1 space-y-1.5 max-h-56 overflow-y-auto">
                  {savedTimers.length === 0 ? (
                    <div className="p-3 rounded-xl bg-white dark:bg-[#1A201C] border border-[#E4E1D9] dark:border-[#2D352F] text-center space-y-2">
                      <p className="text-xs text-[#252B27]/65 dark:text-slate-400">
                        Your saved list is empty.
                      </p>
                      <button
                        type="button"
                        onClick={() => restoreDefaultSavedTimers()}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#365C4B] text-white text-xs font-semibold cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Load Pre-Saved Timers</span>
                      </button>
                    </div>
                  ) : (
                    savedTimers.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white dark:bg-[#1A201C] border border-[#E4E1D9] dark:border-[#2D352F]"
                      >
                        <Link
                          prefetch={false}
                          href={buildCustomTimerHref(item)}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-2 min-w-0 flex-1 text-xs font-semibold text-[#252B27] dark:text-white"
                        >
                          <span
                            className="w-6 h-6 rounded-md flex items-center justify-center text-white shrink-0"
                            style={{ backgroundColor: item.color }}
                          >
                            <CustomTimerIcon icon={item.icon} className="w-3.5 h-3.5" />
                          </span>
                          <span className="truncate">{item.title}</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => deleteSavedTimer(item.id)}
                          className="p-1 rounded-md text-slate-400 hover:text-[#D94343] cursor-pointer"
                          aria-label={`Delete ${item.title} from saved list`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

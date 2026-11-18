'use client';

import React, { useState, useEffect, useRef, useMemo, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
  Globe,
  Sun,
  Moon,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  Sparkles,
  Flame,
  TrendingUp,
  Bookmark,
  Heart,
  Trash2,
  Plus,
  Wand2,
  RotateCcw,
} from 'lucide-react';
import { ALL_HOME_TOOLS } from '@/lib/home-data';
import { ToolIconBadge, ToolTierTag, type ToolTier } from '@/components/ui/ToolIcon';
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

interface NavToolOption {
  label: string;
  href: string;
  desc: string;
  tier: ToolTier;
}

const TIMERS_MENU_GROUPS: Array<{
  tier: ToolTier;
  heading: string;
  items: NavToolOption[];
}> = [
  {
    tier: 'new',
    heading: 'New Releases',
    items: [
      {
        label: 'Sensory Visual Timers',
        href: '/timers/sensory-timers',
        desc: '8 calm, low-distraction visual styles',
        tier: 'new',
      },
      {
        label: 'Flip Clock',
        href: '/timers/flip-clock',
        desc: 'Live clock, countdown & stopwatch',
        tier: 'new',
      },
      {
        label: 'Forest Fire Timer',
        href: '/timers/forest-fire-timer',
        desc: 'Nature forest ember countdown',
        tier: 'new',
      },
      {
        label: 'Train Timer',
        href: '/timers/train-timer',
        desc: 'Station departure board & train',
        tier: 'new',
      },
      {
        label: 'Flip Timer',
        href: '/timers/flip-timer',
        desc: 'Retro split-flap countdown digits',
        tier: 'new',
      },
      {
        label: 'Spinner Timer',
        href: '/timers/spinner-timer',
        desc: 'Rotating wheel visual countdown',
        tier: 'new',
      },
    ],
  },
  {
    tier: 'trending',
    heading: 'Trending Visual Timers',
    items: [
      {
        label: 'Lava Lamp Timer',
        href: '/timers/lava-lamp-timer',
        desc: 'Rising & merging retro wax blobs',
        tier: 'trending',
      },
      {
        label: 'Galaxy Timer',
        href: '/timers/galaxy-timer',
        desc: 'Deep space spiral starfield',
        tier: 'trending',
      },
      {
        label: 'Liquid Timer',
        href: '/timers/liquid-timer',
        desc: 'Smooth draining glass & bubbles',
        tier: 'trending',
      },
      {
        label: 'Rainbow Timer',
        href: '/timers/rainbow-timer',
        desc: 'Colorful arc visual countdown',
        tier: 'trending',
      },
      {
        label: 'Frost Timer',
        href: '/timers/frost-timer',
        desc: 'Spreading ice crystal patterns',
        tier: 'trending',
      },
      {
        label: 'Snow Timer',
        href: '/timers/snow-timer',
        desc: 'Gentle winter snowfall & cabin',
        tier: 'trending',
      },
    ],
  },
  {
    tier: 'hot',
    heading: 'Hot & Daily Essentials',
    items: [
      {
        label: 'Countdown Timer',
        href: '/countdown-timer',
        desc: 'Precision daily countdown clock',
        tier: 'hot',
      },
      {
        label: 'Pomodoro Timer',
        href: '/pomodoro-timer',
        desc: '25/5 focus & break intervals',
        tier: 'hot',
      },
      {
        label: 'Visual Timer',
        href: '/visual-timer',
        desc: 'Shrinking proportional time disc',
        tier: 'hot',
      },
      {
        label: 'Sand Timer',
        href: '/timers/sand-timer',
        desc: 'Realistic digital glass hourglass',
        tier: 'hot',
      },
      {
        label: 'Stopwatch',
        href: '/stopwatch',
        desc: 'Millisecond split-lap timer',
        tier: 'hot',
      },
      {
        label: 'Interval Timer',
        href: '/interval-timer',
        desc: 'HIIT, Tabata & circuit rounds',
        tier: 'hot',
      },
    ],
  },
];

const CATEGORIES_MENU_ITEMS: Array<{
  title: string;
  desc: string;
  href: string;
  iconKey: string;
  tier: ToolTier;
}> = [
  {
    title: 'Everyday Timers',
    desc: 'Countdown, visual, sand, liquid & sensory timers',
    href: '/category/timers',
    iconKey: 'countdown-timer',
    tier: 'hot',
  },
  {
    title: 'Education & Classroom',
    desc: 'Classroom timers, name pickers & noise meters',
    href: '/category/education',
    iconKey: 'classroom-timer',
    tier: 'hot',
  },
  {
    title: 'Events & Presentations',
    desc: 'Stage confidence monitors, speaker & debate timers',
    href: '/category/events',
    iconKey: 'stage-timer',
    tier: 'trending',
  },
  {
    title: 'Productivity & Study',
    desc: 'Pomodoro focus blocks, flip clocks & study tools',
    href: '/category/productivity',
    iconKey: 'pomodoro-timer',
    tier: 'hot',
  },
  {
    title: 'Fitness & Intervals',
    desc: 'HIIT, Tabata, rings & multi-lane stopwatches',
    href: '/category/fitness',
    iconKey: 'interval-timer',
    tier: 'trending',
  },
  {
    title: 'World Clock & Time Zones',
    desc: 'Global city clocks, converters & meeting planners',
    href: '/category/world',
    iconKey: 'world-clock',
    tier: 'trending',
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
  const [langOpen, setLangOpen] = useState(false);
  const currentLang = useSyncExternalStore(
    subscribeLanguage,
    getLanguageSnapshot,
    getServerLanguageSnapshot
  );
  const [navSearchQuery, setNavSearchQuery] = useState('');
  const [navSearchOpen, setNavSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'timers' | 'categories' | 'saved' | null>(null);
  const [mobileTierTab, setMobileTierTab] = useState<ToolTier>('new');

  const savedTimers = useSyncExternalStore(
    subscribeCustomTimers,
    getCustomTimersSnapshot,
    getServerCustomTimersSnapshot
  );

  const navRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  // Sync dark class with reactive theme state
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [isDarkMode]);

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

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
        setNavSearchOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    ).slice(0, 8);
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
      setNavSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const languages = SUPPORTED_LANGUAGES;

  const isTimersActive =
    pathname.startsWith('/timers') ||
    pathname === '/countdown-timer' ||
    pathname === '/visual-timer' ||
    pathname === '/stopwatch' ||
    pathname === '/pomodoro-timer' ||
    pathname === '/interval-timer';

  const isCategoriesActive =
    pathname.startsWith('/category/') && !pathname.startsWith('/category/calculators');

  return (
    <header className="sticky top-0 z-50 w-full bg-[#F7F6F2]/95 dark:bg-[#141816]/95 backdrop-blur-md border-b border-[#E4E1D9] dark:border-[#262D28] transition-colors">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-16 gap-4" ref={navRef}>
          {/* Left: Brand Logo */}
          <Link
            href="/"
            onClick={() => setActiveDropdown(null)}
            className="inline-flex items-center shrink-0 py-1"
            aria-label="WebCountDownTimer Home"
          >
            <BrandLogo size="md" />
          </Link>

          {/* Center: Minimal 5-Item Navigation Bar */}
          <nav
            className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-semibold text-[#252B27] dark:text-slate-200"
            aria-label="Main Navigation"
          >
            {/* 1. Timers Mega-Popover (Organized by New, Trending, Hot) */}
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setActiveDropdown(activeDropdown === 'timers' ? null : 'timers')
                }
                aria-expanded={activeDropdown === 'timers'}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-colors cursor-pointer ${
                  isTimersActive || activeDropdown === 'timers'
                    ? 'bg-[#E7EDE7]/80 dark:bg-[#222B25] text-[#365C4B] dark:text-[#5E917A]'
                    : 'text-[#252B27]/80 dark:text-slate-300 hover:text-[#365C4B] dark:hover:text-[#5E917A] hover:bg-[#E7EDE7]/40 dark:hover:bg-[#1E2521]'
                }`}
              >
                <span>Timers</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeDropdown === 'timers' ? 'rotate-180 text-[#365C4B]' : ' opacity-60'
                  }`}
                />
              </button>

              {activeDropdown === 'timers' && (
                <div className="absolute left-0 top-full mt-2.5 w-[760px] p-5 bg-white dark:bg-[#1A201C] border border-[#E4E1D9] dark:border-[#2D352F] rounded-2xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-1">
                  <div className="grid grid-cols-3 gap-5">
                    {TIMERS_MENU_GROUPS.map((group) => (
                      <div key={group.tier} className="space-y-2.5">
                        <div className="flex items-center justify-between pb-2 border-b border-[#F0EDE6] dark:border-[#262D28]">
                          <ToolTierTag tier={group.tier} />
                          <span className="text-[11px] font-semibold text-[#252B27]/50 dark:text-slate-400">
                            {group.heading}
                          </span>
                        </div>
                        <div className="space-y-1">
                          {group.items.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setActiveDropdown(null)}
                              className="group flex items-center gap-2.5 p-2 rounded-xl hover:bg-[#F7F6F2] dark:hover:bg-[#232B26] transition-colors"
                            >
                              <ToolIconBadge tool={item.href} size="xs" />
                              <div className="min-w-0 flex-1">
                                <div className="text-xs font-bold text-[#252B27] dark:text-white group-hover:text-[#365C4B] dark:group-hover:text-[#5E917A] truncate">
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

                  <div className="mt-4 pt-3.5 border-t border-[#E4E1D9] dark:border-[#262D28] flex items-center justify-between">
                    <Link
                      href="/timers/sensory-timers"
                      onClick={() => setActiveDropdown(null)}
                      className="inline-flex items-center gap-2 text-xs font-bold text-[#1A5D34] dark:text-emerald-300 hover:underline"
                    >
                      <ToolIconBadge tool="/timers/sensory-timers" size="xs" />
                      <span>Open Sensory Visual Timers Collection</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <Link
                      href="/category/timers"
                      onClick={() => setActiveDropdown(null)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#365C4B] dark:text-[#5E917A] hover:underline"
                    >
                      <span>Open All Timers</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Custom Timer (New Dedicated Builder Page) */}
            <Link
              href="/custom-timer"
              onClick={() => setActiveDropdown(null)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl transition-colors whitespace-nowrap ${
                pathname.startsWith('/custom-timer')
                  ? 'bg-[#E7EDE7]/80 dark:bg-[#222B25] text-[#365C4B] dark:text-[#5E917A]'
                  : 'text-[#252B27]/80 dark:text-slate-300 hover:text-[#365C4B] dark:hover:text-[#5E917A] hover:bg-[#E7EDE7]/40 dark:hover:bg-[#1E2521]'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5 text-[#365C4B] dark:text-[#70B393]" />
              <span>Custom Timer</span>
            </Link>

            {/* 3. Saved List Dropdown in Header for Easy Navigation */}
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setActiveDropdown(activeDropdown === 'saved' ? null : 'saved')
                }
                aria-expanded={activeDropdown === 'saved'}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
                  activeDropdown === 'saved'
                    ? 'bg-[#E7EDE7]/80 dark:bg-[#222B25] text-[#365C4B] dark:text-[#5E917A]'
                    : 'text-[#252B27]/80 dark:text-slate-300 hover:text-[#365C4B] dark:hover:text-[#5E917A] hover:bg-[#E7EDE7]/40 dark:hover:bg-[#1E2521]'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5 text-[#365C4B] dark:text-[#70B393]" />
                <span>Saved List</span>
                <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#365C4B]/15 text-[#365C4B] dark:bg-[#365C4B]/40 dark:text-[#8CD4B2]">
                  {savedTimers.length}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeDropdown === 'saved' ? 'rotate-180 text-[#365C4B]' : 'opacity-60'
                  }`}
                />
              </button>

              {activeDropdown === 'saved' && (
                <div className="absolute left-0 top-full mt-2.5 w-[380px] p-3.5 bg-white dark:bg-[#1A201C] border border-[#E4E1D9] dark:border-[#2D352F] rounded-2xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-1">
                  <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[#F0EDE6] dark:border-[#262D28]">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#365C4B] dark:text-[#5E917A]">
                      My Saved Timers ({savedTimers.length})
                    </span>
                    <div className="flex items-center gap-2.5">
                      {DEFAULT_CUSTOM_TIMERS.some((d) => !savedTimers.some((s) => s.id === d.id)) && (
                        <button
                          type="button"
                          onClick={() => restoreDefaultSavedTimers()}
                          className="text-[11px] font-semibold text-[#252B27]/65 dark:text-slate-300 hover:text-[#365C4B] dark:hover:text-[#70B393] inline-flex items-center gap-1 cursor-pointer"
                          title="Restore pre-saved timers"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Restore Pre-Saved</span>
                        </button>
                      )}
                      <Link
                        href="/custom-timer"
                        onClick={() => setActiveDropdown(null)}
                        className="text-[11px] font-bold text-[#365C4B] dark:text-[#70B393] hover:underline inline-flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>New Timer</span>
                      </Link>
                    </div>
                  </div>

                  <div className="max-h-80 overflow-y-auto py-2 space-y-1.5">
                    {savedTimers.length === 0 ? (
                      <div className="py-6 px-3 text-center space-y-2.5">
                        <p className="text-xs text-[#252B27]/65 dark:text-slate-400">
                          Your saved list is currently empty.
                        </p>
                        <button
                          type="button"
                          onClick={() => restoreDefaultSavedTimers()}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#365C4B]/40 text-xs font-semibold text-[#365C4B] dark:text-[#70B393] hover:bg-[#E7EDE7]/60 dark:hover:bg-[#232B26] cursor-pointer"
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
                              href={buildCustomTimerHref(item)}
                              onClick={() => setActiveDropdown(null)}
                              className="flex items-center gap-2.5 min-w-0 flex-1"
                            >
                              <span
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 shadow-2xs"
                                style={{ backgroundColor: item.color }}
                              >
                                <CustomTimerIcon icon={item.icon} className="w-4 h-4" />
                              </span>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-bold text-[#252B27] dark:text-white group-hover:text-[#365C4B] dark:group-hover:text-[#70B393] truncate">
                                    {item.title}
                                  </span>
                                  {isPreSaved && (
                                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wide bg-[#365C4B]/10 text-[#365C4B] dark:bg-[#365C4B]/30 dark:text-[#8CD4B2] shrink-0">
                                      Pre-Saved
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-[#252B27]/60 dark:text-slate-400 truncate">
                                  {durText} · {item.visualStyle.replace('-', ' ')}
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
                                <Heart className={`w-3.5 h-3.5 ${item.liked ? 'fill-current' : ''}`} />
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
                      href="/custom-timer"
                      onClick={() => setActiveDropdown(null)}
                      className="w-full py-2 px-3 rounded-xl bg-[#365C4B] text-white text-xs font-semibold flex items-center justify-center gap-1.5 hover:opacity-95 transition-opacity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create &amp; Save Custom Timer</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* 4. World Clock */}
            <Link
              href="/world-clock"
              onClick={() => setActiveDropdown(null)}
              className={`px-3 py-2 rounded-xl transition-colors whitespace-nowrap ${
                pathname.startsWith('/world-clock') || pathname.startsWith('/category/world')
                  ? 'bg-[#E7EDE7]/80 dark:bg-[#222B25] text-[#365C4B] dark:text-[#5E917A]'
                  : 'text-[#252B27]/80 dark:text-slate-300 hover:text-[#365C4B] dark:hover:text-[#5E917A] hover:bg-[#E7EDE7]/40 dark:hover:bg-[#1E2521]'
              }`}
            >
              World Clock
            </Link>

            {/* 5. Categories Dropdown (Classroom, Events, Productivity, Fitness) */}
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setActiveDropdown(activeDropdown === 'categories' ? null : 'categories')
                }
                aria-expanded={activeDropdown === 'categories'}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
                  isCategoriesActive ||
                  pathname === '/category/education' ||
                  activeDropdown === 'categories'
                    ? 'bg-[#E7EDE7]/80 dark:bg-[#222B25] text-[#365C4B] dark:text-[#5E917A]'
                    : 'text-[#252B27]/80 dark:text-slate-300 hover:text-[#365C4B] dark:hover:text-[#5E917A] hover:bg-[#E7EDE7]/40 dark:hover:bg-[#1E2521]'
                }`}
              >
                <span>Categories</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeDropdown === 'categories' ? 'rotate-180 text-[#365C4B]' : 'opacity-60'
                  }`}
                />
              </button>

              {activeDropdown === 'categories' && (
                <div className="absolute left-0 top-full mt-2.5 w-[480px] p-4 bg-white dark:bg-[#1A201C] border border-[#E4E1D9] dark:border-[#2D352F] rounded-2xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#365C4B] dark:text-[#5E917A] px-2 pb-2.5 border-b border-[#F0EDE6] dark:border-[#262D28]">
                    Browse by Use Case &amp; Community
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2.5">
                    {CATEGORIES_MENU_ITEMS.map((cat) => (
                      <Link
                        key={cat.href}
                        href={cat.href}
                        onClick={() => setActiveDropdown(null)}
                        className="group p-2.5 rounded-xl border border-transparent hover:border-[#E4E1D9] dark:hover:border-[#2D352F] hover:bg-[#F7F6F2] dark:hover:bg-[#232B26] transition-all flex items-start gap-3"
                      >
                        <ToolIconBadge tool={cat.iconKey} size="sm" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-bold text-[#252B27] dark:text-white group-hover:text-[#365C4B] dark:group-hover:text-[#5E917A] truncate">
                              {cat.title}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#252B27]/65 dark:text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                            {cat.desc}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 6. All Tools */}
            <Link
              href="/tools"
              onClick={() => setActiveDropdown(null)}
              className={`px-3 py-2 rounded-xl transition-colors whitespace-nowrap ${
                pathname.startsWith('/tools')
                  ? 'bg-[#E7EDE7]/80 dark:bg-[#222B25] text-[#365C4B] dark:text-[#5E917A]'
                  : 'text-[#252B27]/80 dark:text-slate-300 hover:text-[#365C4B] dark:hover:text-[#5E917A] hover:bg-[#E7EDE7]/40 dark:hover:bg-[#1E2521]'
              }`}
            >
              All Tools
            </Link>
          </nav>

          {/* Right: Compact Search, Language & Theme Toggle */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Search Box with Live Unique-Icon Results */}
            <div className="relative hidden md:block">
              <form onSubmit={handleNavSearch}>
                <div className="flex items-center bg-white dark:bg-[#1A201C] border border-[#E4E1D9] dark:border-[#2D352F] rounded-xl px-3 py-1.5 w-48 lg:w-56 xl:w-64 focus-within:border-[#365C4B] focus-within:ring-2 focus-within:ring-[#365C4B]/15 transition-all">
                  <Search className="w-3.5 h-3.5 text-[#252B27]/45 dark:text-slate-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={navSearchQuery}
                    onFocus={() => {
                      setNavSearchOpen(true);
                      setActiveDropdown(null);
                    }}
                    onChange={(e) => {
                      setNavSearchQuery(e.target.value);
                      setNavSearchOpen(true);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        setNavSearchOpen(false);
                      }
                    }}
                    placeholder="Search tools..."
                    className="w-full text-xs bg-transparent text-[#252B27] dark:text-white placeholder-[#252B27]/45 dark:placeholder-slate-500 focus:outline-hidden"
                    aria-label="Search tools"
                  />
                  {navSearchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setNavSearchQuery('');
                        setNavSearchOpen(true);
                      }}
                      className="text-[#252B27]/40 hover:text-[#252B27] dark:text-slate-500 dark:hover:text-white ml-1 cursor-pointer"
                      aria-label="Clear search"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </form>

              {navSearchOpen && (
                <div className="absolute right-0 top-full mt-2.5 w-80 sm:w-96 bg-white dark:bg-[#1A201C] border border-[#E4E1D9] dark:border-[#2D352F] rounded-2xl shadow-2xl z-50 overflow-hidden">
                  <div className="px-3.5 py-2 bg-[#F7F6F2] dark:bg-[#141816] border-b border-[#E4E1D9] dark:border-[#262D28] flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#365C4B] dark:text-[#5E917A]">
                    <span>
                      {navSearchQuery.trim()
                        ? `Search Results (${navSearchMatches.length})`
                        : 'Quick Launch Tools'}
                    </span>
                    <span className="text-[10px] font-medium normal-case text-[#252B27]/50 dark:text-slate-400">
                      Enter to open
                    </span>
                  </div>

                  {navSearchMatches.length > 0 ? (
                    <div className="max-h-80 overflow-y-auto divide-y divide-[#E4E1D9]/50 dark:divide-[#262D28]">
                      {navSearchMatches.map((tool) => (
                        <Link
                          key={tool.id}
                          href={tool.href}
                          onClick={() => {
                            setNavSearchOpen(false);
                            setNavSearchQuery('');
                          }}
                          className="flex items-center justify-between gap-3 px-3.5 py-2.5 hover:bg-[#E7EDE7]/60 dark:hover:bg-[#252E28] transition-colors group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <ToolIconBadge tool={tool.href || tool.title} size="sm" />
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-[#252B27] dark:text-white group-hover:text-[#365C4B] dark:group-hover:text-[#5E917A] truncate">
                                  {tool.title}
                                </span>
                              </div>
                              <p className="text-[11px] text-[#252B27]/65 dark:text-slate-400 truncate">
                                {tool.description}
                              </p>
                            </div>
                          </div>
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#365C4B] dark:text-[#5E917A] shrink-0">
                            <span>Open</span>
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-all" />
                          </span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-xs text-[#252B27]/60 dark:text-slate-400">
                      No matching tools for &ldquo;{navSearchQuery}&rdquo;.
                    </div>
                  )}

                  <div className="border-t border-[#E4E1D9] dark:border-[#262D28] bg-[#F7F6F2]/60 dark:bg-[#141816]/60 px-3.5 py-2">
                    <Link
                      href={
                        navSearchQuery.trim()
                          ? `/tools?q=${encodeURIComponent(navSearchQuery.trim())}`
                          : '/tools'
                      }
                      onClick={() => setNavSearchOpen(false)}
                      className="flex items-center justify-between text-xs font-semibold text-[#365C4B] dark:text-[#5E917A] hover:underline"
                    >
                      <span>Open All Tools Directory</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Language Selector */}
            <div className="relative" ref={langRef} data-no-translate="true">
              <button
                type="button"
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-medium text-[#252B27] dark:text-slate-200 bg-white/70 dark:bg-[#1A201C] border border-[#E4E1D9] dark:border-[#2D352F] hover:bg-[#E7EDE7]/60 dark:hover:bg-[#252E28] transition-colors cursor-pointer"
                aria-label="Select language"
              >
                <LanguageFlag lang={currentLang} className="w-4 h-3" />
                <span className="hidden sm:inline">{currentLang}</span>
                <ChevronDown className="w-3 h-3 text-[#252B27]/45 dark:text-slate-400" />
              </button>

              {langOpen && (
                <div className="absolute right-0 top-full mt-2 w-44 bg-white dark:bg-[#1A201C] border border-[#E4E1D9] dark:border-[#2D352F] rounded-xl shadow-xl p-1.5 z-50">
                  {languages.map((lang) => {
                    const meta = LANGUAGE_META[lang];
                    const isSelected = currentLang === lang;
                    return (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => {
                          setGlobalLanguage(lang);
                          setLangOpen(false);
                        }}
                        className={`w-full flex items-center justify-between gap-2.5 px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#E7EDE7] dark:bg-[#252E28] text-[#365C4B] dark:text-[#5E917A] font-bold'
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

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl text-[#252B27]/70 dark:text-amber-400 hover:bg-[#E7EDE7]/60 dark:hover:bg-[#252E28] transition-colors cursor-pointer"
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
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-[#252B27] dark:text-slate-200 hover:bg-[#E7EDE7]/60 dark:hover:bg-[#252E28] cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Clean Minimal Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-[#E4E1D9] dark:border-[#262D28] space-y-4">
            {/* Search Input */}
            <form onSubmit={handleNavSearch}>
              <div className="flex items-center bg-white dark:bg-[#1A201C] border border-[#E4E1D9] dark:border-[#2D352F] rounded-xl px-3.5 py-2">
                <Search className="w-4 h-4 text-[#365C4B] mr-2 shrink-0" />
                <input
                  type="text"
                  value={navSearchQuery}
                  onChange={(e) => setNavSearchQuery(e.target.value)}
                  placeholder="Search time tools..."
                  className="w-full text-xs bg-transparent text-[#252B27] dark:text-white placeholder-[#252B27]/40 focus:outline-hidden"
                />
              </div>
            </form>

            {navSearchQuery.trim() && (
              <div className="space-y-1">
                {navSearchMatches.slice(0, 5).map((tool) => (
                  <Link
                    key={tool.id}
                    href={tool.href}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setNavSearchQuery('');
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-[#1A201C] border border-[#E4E1D9] dark:border-[#2D352F] text-xs font-semibold text-[#252B27] dark:text-white"
                  >
                    <span className="flex items-center gap-2.5">
                      <ToolIconBadge tool={tool.href || tool.title} size="xs" />
                      <span>{tool.title}</span>
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#365C4B]" />
                  </Link>
                ))}
              </div>
            )}

            {/* Minimal Top-Level Links */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-bold">
              {[
                { label: 'Custom Timer', href: '/custom-timer', iconKey: 'custom-timer' },
                { label: 'Timers', href: '/category/timers', iconKey: 'countdown-timer' },
                { label: 'World Clock', href: '/world-clock', iconKey: 'world-clock' },
                { label: 'Education', href: '/category/education', iconKey: 'classroom-timer' },
                { label: 'Calculators', href: '/category/calculators', iconKey: 'time-duration-calculator' },
                { label: 'All Tools', href: '/tools', iconKey: 'sensory-timers' },
              ].map((navItem) => (
                <Link
                  key={navItem.href}
                  href={navItem.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-[#1A201C] border border-[#E4E1D9] dark:border-[#2D352F] text-[#252B27] dark:text-white hover:border-[#365C4B]"
                >
                  <ToolIconBadge tool={navItem.iconKey} size="xs" />
                  <span>{navItem.label}</span>
                </Link>
              ))}
            </div>

            {/* Mobile Saved List Quick Navigation */}
            <div className="pt-2 border-t border-[#E4E1D9] dark:border-[#262D28] space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#365C4B] dark:text-[#70B393] flex items-center gap-1.5">
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Saved List ({savedTimers.length})</span>
                </span>
                <div className="flex items-center gap-2.5">
                  {DEFAULT_CUSTOM_TIMERS.some((d) => !savedTimers.some((s) => s.id === d.id)) && (
                    <button
                      type="button"
                      onClick={() => restoreDefaultSavedTimers()}
                      className="text-[11px] font-semibold text-[#252B27]/70 dark:text-slate-300 inline-flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Restore</span>
                    </button>
                  )}
                  <Link
                    href="/custom-timer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[11px] font-bold text-[#365C4B] dark:text-[#70B393]"
                  >
                    + Create Custom
                  </Link>
                </div>
              </div>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-56 overflow-y-auto">
                  {savedTimers.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-1.5 p-2 rounded-xl bg-white dark:bg-[#1A201C] border border-[#E4E1D9] dark:border-[#2D352F]"
                    >
                      <Link
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
                      <div className="flex items-center gap-0.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => toggleLikeSavedTimer(item.id)}
                          className={`p-1 rounded-md cursor-pointer ${
                            item.liked ? 'text-[#D93B8A]' : 'text-slate-400'
                          }`}
                          aria-label="Toggle like"
                        >
                          <Heart className={`w-3.5 h-3.5 ${item.liked ? 'fill-current' : ''}`} />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteSavedTimer(item.id)}
                          className="p-1 rounded-md text-slate-400 hover:text-[#D94343] cursor-pointer"
                          aria-label={`Delete ${item.title} from saved list`}
                          title="Delete from saved list"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Organized Trending / Hot / New Quick Tabs for Mobile */}
            <div className="pt-2 border-t border-[#E4E1D9] dark:border-[#262D28] space-y-2.5">
              <div className="flex items-center gap-1.5">
                {[
                  { id: 'new' as ToolTier, label: 'New', icon: Sparkles },
                  { id: 'trending' as ToolTier, label: 'Trending', icon: TrendingUp },
                  { id: 'hot' as ToolTier, label: 'Hot', icon: Flame },
                ].map((tab) => {
                  const TabIcon = tab.icon;
                  const active = mobileTierTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setMobileTierTab(tab.id)}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                        active
                          ? 'bg-[#365C4B] text-white'
                          : 'bg-white dark:bg-[#1A201C] text-[#252B27]/75 dark:text-slate-300 border border-[#E4E1D9] dark:border-[#2D352F]'
                      }`}
                    >
                      <TabIcon className="w-3 h-3" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                {TIMERS_MENU_GROUPS.find((g) => g.tier === mobileTierTab)?.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-[#1A201C] border border-[#E4E1D9] dark:border-[#2D352F] text-xs font-semibold text-[#252B27] dark:text-white"
                  >
                    <ToolIconBadge tool={item.href} size="xs" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

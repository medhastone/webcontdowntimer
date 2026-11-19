'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Play,
  Pause,
  RotateCcw,
  Search,
  Hourglass,
  Droplets,
  Palette,
  Clock,
  Tv,
  Globe,
  ArrowRightLeft,
  ArrowRight,
  CheckCircle2,
  Users,
  GraduationCap,
  Dumbbell,
  Target,
  Code2,
  Plus,
  Minus,
  Flame,
  Heart,
  Moon,
  Sun,
  Leaf,
  Sparkles,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import { playTimerSound } from '@/lib/sound';
import { ALL_HOME_TOOLS } from '@/lib/home-data';
import { ToolIconBadge, ToolTierTag, type ToolTier } from '@/components/ui/ToolIcon';
import SharePageButton from '@/components/common/SharePageButton';
import { HolidayIconGlyph } from '@/components/holidays/HolidayVisualIcon';
import { getHolidayVisualTheme } from '@/lib/holiday-visuals';

export interface HomeUpcomingHolidayItem {
  slug: string;
  baseSlug?: string;
  holidayName: string;
  year: number;
  nextDate: string;
  dayOfWeek: string;
  daysRemaining: number;
  isToday: boolean;
}

interface HomePageProps {
  upcomingHolidays?: HomeUpcomingHolidayItem[];
}

interface HomeToolCardItem {
  name: string;
  ctaName: string;
  href: string;
  description: string;
  tier: ToolTier;
}

const HOME_ORGANIZED_TOOLS: HomeToolCardItem[] = [
  // TRENDING
  {
    name: 'Lava Lamp Timer',
    ctaName: 'Lava Lamp Timer',
    href: '/timers/lava-lamp-timer',
    description: 'Retro and relaxing lava lamp countdown timer with rising and merging wax blobs in Retro Amber, Deep Blue, Neon Pink & Aqua Glow.',
    tier: 'trending',
  },
  {
    name: 'Galaxy Timer',
    ctaName: 'Galaxy Timer',
    href: '/timers/galaxy-timer',
    description: 'Stunning space-themed starfield and spiral galaxy visual countdown for study sessions and deep focus.',
    tier: 'trending',
  },
  {
    name: 'Rainbow Timer',
    ctaName: 'Rainbow Timer',
    href: '/timers/rainbow-timer',
    description: 'Colorful rainbow arc countdown with 4 styles & 6 color themes for classrooms and focus breaks.',
    tier: 'trending',
  },
  {
    name: 'Liquid Timer',
    ctaName: 'Liquid Timer',
    href: '/timers/liquid-timer',
    description: 'Smooth draining liquid glass countdown with rising bubbles & 6 soothing color styles.',
    tier: 'trending',
  },
  {
    name: 'Aesthetic Timer',
    ctaName: 'Aesthetic Timer',
    href: '/timers/aesthetic-timer',
    description: 'Calm visual countdown with 8 curated themes, custom accent colors & saved workspace style.',
    tier: 'trending',
  },
  {
    name: 'Candle Timer',
    ctaName: 'Candle Timer',
    href: '/timers/candle-timer',
    description: 'Peaceful digital candle countdown with Ivory, Amber, Forest Green & Charcoal wax themes.',
    tier: 'trending',
  },
  {
    name: 'Picture Reveal Timer',
    ctaName: 'Picture Reveal Timer',
    href: '/timers/picture-reveal-timer',
    description: 'Upload a photo and watch it gradually appear behind a grid of tiles as the countdown runs.',
    tier: 'trending',
  },
  {
    name: 'Blocks Timer',
    ctaName: 'Blocks Timer',
    href: '/timers/blocks-timer',
    description: 'Stacked 3D block countdown timer with Wooden, Colored, Stone & Minimal block styles.',
    tier: 'trending',
  },
  {
    name: 'Hourglass Timer',
    ctaName: 'Hourglass Timer',
    href: '/timers/hourglass-timer',
    description: 'Classic wooden-framed hourglass countdown with realistic falling sand & instant Flip button.',
    tier: 'trending',
  },

  // HOT
  {
    name: 'Countdown Timer',
    ctaName: 'Countdown Timer',
    href: '/countdown-timer',
    description: 'High-precision countdown clock for any duration with custom presets, sound themes & fullscreen mode.',
    tier: 'hot',
  },
  {
    name: 'Visual Timer',
    ctaName: 'Visual Timer',
    href: '/visual-timer',
    description: 'See remaining time disappear visually on a high-contrast proportional disc—ideal for classrooms.',
    tier: 'hot',
  },
  {
    name: 'Pomodoro Timer',
    ctaName: 'Pomodoro Timer',
    href: '/pomodoro-timer',
    description: 'Structured 25-minute deep work focus blocks paired with rejuvenating 5-minute rest intervals.',
    tier: 'hot',
  },
  {
    name: 'Sand Timer',
    ctaName: 'Sand Timer',
    href: '/timers/sand-timer',
    description: 'Realistic digital glass hourglass with smooth falling sand grains and chamber progress.',
    tier: 'hot',
  },
  {
    name: 'Stopwatch',
    ctaName: 'Stopwatch',
    href: '/stopwatch',
    description: 'Millisecond-accurate count-up stopwatch with split lap logging and keyboard controls.',
    tier: 'hot',
  },
  {
    name: 'Stage Timer',
    ctaName: 'Stage Timer',
    href: '/stage-timer',
    description: 'Multi-screen speaker confidence monitor with live operator controller and overtime tracking.',
    tier: 'hot',
  },
  {
    name: 'World Clock',
    ctaName: 'World Clock',
    href: '/world-clock',
    description: 'Live international city time grid with UTC offsets, day/night indicators, and DST sync.',
    tier: 'hot',
  },
  {
    name: 'Time-Zone Converter',
    ctaName: 'Time-Zone Converter',
    href: '/time-zone-converter',
    description: 'Compare and convert hours across multiple international time zones for global meetings.',
    tier: 'hot',
  },
  {
    name: 'Interval Timer',
    ctaName: 'Interval Timer',
    href: '/interval-timer',
    description: 'Configurable work and rest intervals with round counters and audio cues for HIIT & Tabata.',
    tier: 'hot',
  },

  // NEW
  {
    name: 'Holiday & Event Countdowns',
    ctaName: 'Holiday Countdowns',
    href: '/days-until',
    description: 'Live days, hours, minutes & seconds countdowns in your local timezone for Christmas Eve, Thanksgiving, Valentine’s Day, Mother’s Day & more.',
    tier: 'new',
  },
  {
    name: 'Sensory Visual Timers',
    ctaName: 'Sensory Timers',
    href: '/timers/sensory-timers',
    description: 'A collection of calm, visually engaging timers with gentle motion, muted audio by default, and distraction-free designs.',
    tier: 'new',
  },
  {
    name: 'Free Online Flip Clock',
    ctaName: 'Flip Clock',
    href: '/timers/flip-clock',
    description: 'Realistic retro split-flap clock with Live Clock, Countdown, and Stopwatch modes, 12/24-hour format, and Dark/Light themes.',
    tier: 'new',
  },
  {
    name: 'Free Online Forest Fire Timer',
    ctaName: 'Forest Fire Timer',
    href: '/timers/forest-fire-timer',
    description: 'Creative, nature-inspired countdown with a stylized spreading ember glow across 4 illustrated forest themes.',
    tier: 'new',
  },
  {
    name: 'Free Online Train Timer',
    ctaName: 'Train Timer',
    href: '/timers/train-timer',
    description: 'Railway station departure-board countdown with a moving illustrated train along a route and custom session names.',
    tier: 'new',
  },
  {
    name: 'Free Online Flip Timer',
    ctaName: 'Flip Timer',
    href: '/timers/flip-timer',
    description: 'Retro mechanical split-flap countdown timer with 3D flipping cards in Classic Black, Retro Cream, Industrial & Modern Dark.',
    tier: 'new',
  },
  {
    name: 'Free Online Spinner Timer',
    ctaName: 'Spinner Timer',
    href: '/timers/spinner-timer',
    description: 'Clear and interactive spinning countdown timer with circular progress segments, clockwise/counterclockwise pointer, and 6 themes.',
    tier: 'new',
  },
  {
    name: 'Snow Timer',
    ctaName: 'Snow Timer',
    href: '/timers/snow-timer',
    description: 'Calm winter snowfall countdown with accumulating snowdrifts and cozy cabin scenes.',
    tier: 'new',
  },
  {
    name: 'Frost Timer',
    ctaName: 'Frost Timer',
    href: '/timers/frost-timer',
    description: 'Calming frosted-glass visual countdown with delicate ice crystal patterns spreading from the edges.',
    tier: 'new',
  },
  {
    name: 'Lichen Timer',
    ctaName: 'Lichen Timer',
    href: '/timers/lichen-timer',
    description: 'Nature-inspired organic lichen growth countdown over forest stone and bark surfaces.',
    tier: 'new',
  },
  {
    name: 'Coral Timer',
    ctaName: 'Coral Timer',
    href: '/timers/coral-timer',
    description: 'A relaxing coral growth visual timer with Tropical Coral, Deep Ocean & Colorful Reef themes.',
    tier: 'new',
  },
  {
    name: 'Bubble Timer',
    ctaName: 'Bubble Timer',
    href: '/timers/bubble-timer',
    description: 'A calming and interactive bubble visual timer with Ocean Blue, Seafoam & Clear Glass themes.',
    tier: 'new',
  },
  {
    name: 'Sun Timer',
    ctaName: 'Sun Timer',
    href: '/timers/sun-timer',
    description: 'A beautiful sun visual timer with Morning, Midday, Sunset & Warm Neutral sky scenes.',
    tier: 'new',
  },
  {
    name: 'Moon Timer',
    ctaName: 'Moon Timer',
    href: '/timers/moon-timer',
    description: 'A calming moon visual timer with Classic, Crescent, Blue & Warm Moon night sky themes.',
    tier: 'new',
  },
  {
    name: 'Heart Timer',
    ctaName: 'Heart Timer',
    href: '/timers/heart-timer',
    description: 'A balanced heart-shaped countdown timer with Rose, Berry, Ivory & Soft Red themes.',
    tier: 'new',
  },
];

export default function HomePage({ upcomingHolidays = [] }: HomePageProps) {
  const router = useRouter();

  // Search state & Tool Tier Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [activeTierFilter, setActiveTierFilter] = useState<'all' | ToolTier>('all');
  const heroSearchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (heroSearchRef.current && !heroSearchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const heroSearchMatches = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return ALL_HOME_TOOLS.filter(
      (tool) =>
        tool.title.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q) ||
        tool.keywords.some((kw) => kw.toLowerCase().includes(q))
    ).slice(0, 6);
  }, [searchQuery]);

  // -------------------------------------------------------------
  // HERO TIMER STATE (05:00 Focus Timer)
  // -------------------------------------------------------------
  const [heroDurationSec] = useState<number>(300); // 5 min default
  const [heroRemainingSec, setHeroRemainingSec] = useState<number>(300);
  const [heroIsRunning, setHeroIsRunning] = useState<boolean>(false);
  const heroLastTickRef = useRef<number>(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (heroIsRunning) {
      heroLastTickRef.current = Date.now();
      interval = setInterval(() => {
        const now = Date.now();
        const delta = Math.floor((now - heroLastTickRef.current) / 1000);
        if (delta >= 1) {
          heroLastTickRef.current = now;
          setHeroRemainingSec((prev) => {
            if (prev > 1) {
              return prev - 1;
            } else if (prev === 1) {
              playTimerSound('bell', 0.8);
              setHeroIsRunning(false);
              return 0;
            }
            return 0;
          });
        }
      }, 500);
    }
    return () => clearInterval(interval);
  }, [heroIsRunning]);

  const toggleHeroTimer = () => {
    if (heroRemainingSec === 0) {
      setHeroRemainingSec(heroDurationSec);
    }
    setHeroIsRunning((prev) => !prev);
  };

  const resetHeroTimer = () => {
    setHeroIsRunning(false);
    setHeroRemainingSec(heroDurationSec);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target?.isContentEditable) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        setHeroRemainingSec((prev) => (prev === 0 ? heroDurationSec : prev));
        setHeroIsRunning((prev) => !prev);
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        setHeroIsRunning(false);
        setHeroRemainingSec(heroDurationSec);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [heroDurationSec]);

  const heroMins = Math.floor(heroRemainingSec / 60);
  const heroSecs = heroRemainingSec % 60;
  const heroFormatted = `${String(heroMins).padStart(2, '0')}:${String(heroSecs).padStart(2, '0')}`;
  const heroFraction = heroDurationSec > 0 ? heroRemainingSec / heroDurationSec : 0;

  // -------------------------------------------------------------
  // FEATURED TOOL TIMER STATE (15:00 Countdown)
  // -------------------------------------------------------------
  const [featuredTab, setFeaturedTab] = useState<'countdown' | 'stopwatch' | 'interval'>('countdown');
  const [featuredDurationSec, setFeaturedDurationSec] = useState<number>(900); // 15 min default
  const [featuredRemainingSec, setFeaturedRemainingSec] = useState<number>(900);
  const [featuredIsRunning, setFeaturedIsRunning] = useState<boolean>(false);
  const featuredLastTickRef = useRef<number>(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (featuredIsRunning) {
      featuredLastTickRef.current = Date.now();
      interval = setInterval(() => {
        const now = Date.now();
        const delta = Math.floor((now - featuredLastTickRef.current) / 1000);
        if (delta >= 1) {
          featuredLastTickRef.current = now;
          setFeaturedRemainingSec((prev) => {
            if (prev > 1) {
              return prev - 1;
            } else if (prev === 1) {
              playTimerSound('bell', 0.8);
              setFeaturedIsRunning(false);
              return 0;
            }
            return 0;
          });
        }
      }, 500);
    }
    return () => clearInterval(interval);
  }, [featuredIsRunning]);

  const toggleFeaturedTimer = () => {
    if (featuredRemainingSec === 0) {
      setFeaturedRemainingSec(featuredDurationSec);
    }
    setFeaturedIsRunning((prev) => !prev);
  };

  const resetFeaturedTimer = () => {
    setFeaturedIsRunning(false);
    setFeaturedRemainingSec(featuredDurationSec);
  };

  const selectFeaturedPreset = (seconds: number) => {
    setFeaturedIsRunning(false);
    setFeaturedDurationSec(seconds);
    setFeaturedRemainingSec(seconds);
  };

  const featMins = Math.floor(featuredRemainingSec / 60);
  const featSecs = featuredRemainingSec % 60;
  const featFormatted = `${String(featMins).padStart(2, '0')}:${String(featSecs).padStart(2, '0')}`;
  const featFraction = featuredDurationSec > 0 ? featuredRemainingSec / featuredDurationSec : 0;

  // -------------------------------------------------------------
  // FAQ ACCORDION STATE
  // -------------------------------------------------------------
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      if (heroSearchMatches.length > 0) {
        router.push(heroSearchMatches[0].href);
      } else {
        router.push(`/tools?q=${encodeURIComponent(q)}`);
      }
      setSearchFocused(false);
    }
  };

  return (
    <div className="w-full bg-[#F7F6F2] dark:bg-[#121614] text-[#252B27] dark:text-[#E7EDE7] transition-colors overflow-hidden">
      {/* ========================================================================= */}
      {/* SECTION 2 — HERO                                                         */}
      {/* ========================================================================= */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pt-10 sm:pt-14 pb-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Heading, Subtitle & Practical Search Bar (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-block text-[11px] font-bold tracking-[0.2em] text-[#B7804C] uppercase">
              Simple tools. Better time.
            </div>

            <div className="relative">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#252B27] dark:text-white leading-[1.12]">
                Free Online Countdown Timer, Stopwatch &amp; Stage Timer.
              </h1>
            </div>

            <p className="text-lg sm:text-xl text-[#252B27]/80 dark:text-slate-300 max-w-xl leading-relaxed font-normal">
              Start a countdown timer, lap stopwatch, visual classroom clock, or live stage timer in one click—free in your browser with no sign-up.
            </p>

            {/* Practical Search Input with Forest Green Button + Live Autocomplete Dropdown */}
            <div className="max-w-xl pt-2 relative" ref={heroSearchRef}>
              <form onSubmit={handleHeroSearch}>
                <div className="relative flex items-center bg-white dark:bg-[#1A201C] rounded-2xl border border-[#E4E1D9] dark:border-[#2D352F] shadow-sm p-1.5 focus-within:border-[#365C4B] focus-within:ring-2 focus-within:ring-[#365C4B]/20 transition-all">
                  <Search className="w-5 h-5 text-[#252B27]/40 dark:text-slate-500 ml-3.5 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onFocus={() => setSearchFocused(true)}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSearchFocused(true);
                    }}
                    placeholder="What are you trying to do? (e.g. liquid timer, sand timer)"
                    className="w-full text-sm sm:text-base bg-transparent text-[#252B27] dark:text-white placeholder-[#252B27]/40 dark:placeholder-slate-500 focus:outline-hidden py-2"
                  />
                  <button
                    type="submit"
                    className="h-10 sm:h-11 px-6 rounded-xl bg-[#365C4B] hover:bg-[#2B4A3C] text-white font-semibold text-sm transition-colors cursor-pointer shrink-0"
                  >
                    Search
                  </button>
                </div>
              </form>

              {searchFocused && searchQuery.trim().length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-[#1A201C] border border-[#E4E1D9] dark:border-[#2D352F] rounded-2xl shadow-xl z-40 overflow-hidden">
                  {heroSearchMatches.length > 0 ? (
                    <div className="divide-y divide-[#E4E1D9]/60 dark:divide-[#262D28]">
                      {heroSearchMatches.map((tool) => {
                        return (
                          <Link prefetch={false}
                            key={tool.id}
                            href={tool.href}
                            onClick={() => setSearchFocused(false)}
                            className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-[#E7EDE7]/60 dark:hover:bg-[#252E28] transition-colors group"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <ToolIconBadge tool={tool.href || tool.title} size="sm" />
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-bold text-[#252B27] dark:text-white group-hover:text-[#365C4B] truncate">
                                    {tool.title}
                                  </span>
                                  <span className="text-[10px] uppercase tracking-wider text-[#365C4B] dark:text-[#5E917A] font-bold">
                                    {tool.category}
                                  </span>
                                </div>
                                <p className="text-xs text-[#252B27]/65 dark:text-slate-400 truncate">
                                  {tool.description}
                                </p>
                              </div>
                            </div>
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#365C4B] dark:text-[#5E917A] shrink-0">
                              <span className="hidden sm:inline">Open {tool.title}</span>
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-all" />
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-xs text-[#252B27]/60 dark:text-slate-400">
                      No matching tools for &ldquo;{searchQuery}&rdquo;.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick Launch by Trending, Hot & New with Unique Icons */}
            <div className="pt-2 space-y-2.5">
              {[
                {
                  tier: 'trending' as ToolTier,
                  items: [
                    { label: 'Lava Lamp Timer', href: '/timers/lava-lamp-timer' },
                    { label: 'Galaxy Timer', href: '/timers/galaxy-timer' },
                    { label: 'Rainbow Timer', href: '/timers/rainbow-timer' },
                    { label: 'Liquid Timer', href: '/timers/liquid-timer' },
                    { label: 'Aesthetic Timer', href: '/timers/aesthetic-timer' },
                  ],
                },
                {
                  tier: 'hot' as ToolTier,
                  items: [
                    { label: 'Countdown Timer', href: '/countdown-timer' },
                    { label: 'Pomodoro Timer', href: '/pomodoro-timer' },
                    { label: 'Visual Timer', href: '/visual-timer' },
                    { label: 'Sand Timer', href: '/timers/sand-timer' },
                    { label: 'Stage Timer', href: '/stage-timer' },
                    { label: 'World Clock', href: '/world-clock' },
                  ],
                },
                {
                  tier: 'new' as ToolTier,
                  items: [
                    { label: 'Holiday Countdowns', href: '/days-until' },
                    { label: 'Sensory Timers', href: '/timers/sensory-timers' },
                    { label: 'Flip Clock', href: '/timers/flip-clock' },
                    { label: 'Forest Fire Timer', href: '/timers/forest-fire-timer' },
                    { label: 'Train Timer', href: '/timers/train-timer' },
                    { label: 'Flip Timer', href: '/timers/flip-timer' },
                    { label: 'Spinner Timer', href: '/timers/spinner-timer' },
                  ],
                },
              ].map((group) => (
                <div key={group.tier} className="flex flex-wrap items-center gap-2 text-xs">
                  <div className="w-20 shrink-0">
                    <ToolTierTag tier={group.tier} />
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {group.items.map((item) => (
                      <Link prefetch={false}
                        key={item.href}
                        href={item.href}
                        className="group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/95 dark:bg-[#1A201C] border border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#365C4B] dark:hover:border-[#5E917A] text-[#252B27] dark:text-slate-200 font-semibold transition-all shadow-2xs"
                      >
                        <ToolIconBadge tool={item.href} size="xs" />
                        <span className="group-hover:text-[#365C4B] dark:group-hover:text-[#5E917A] transition-colors">
                          {item.label}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Interactive 05:00 Focus Timer + Aesthetic Lifestyle Photo (5 cols) */}
          <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-row items-center gap-5 justify-center lg:justify-end">
            {/* Visual Focus Timer Card (05:00) */}
            <div className="w-full sm:w-72 bg-white dark:bg-[#1A201C] rounded-3xl border border-[#E4E1D9] dark:border-[#2D352F] p-6 shadow-sm flex flex-col items-center justify-between shrink-0">
              {/* Circular Timer Ring with Two-Tone Arc (Amber & Forest Green) */}
              <div className="relative w-48 h-48 flex items-center justify-center my-2">
                <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
                  {/* Background track (soft warm amber/tan) */}
                  <circle
                    cx="80"
                    cy="80"
                    r="68"
                    fill="none"
                    stroke="#D97706"
                    strokeWidth="10"
                    className="opacity-90"
                  />
                  {/* Remaining arc (deep forest green #365C4B) */}
                  <circle
                    cx="80"
                    cy="80"
                    r="68"
                    fill="none"
                    stroke="#365C4B"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 68}
                    strokeDashoffset={2 * Math.PI * 68 * (1 - heroFraction)}
                    className="transition-all duration-300"
                  />
                </svg>

                {/* Digital Readout Center */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <div className="text-4xl font-bold font-mono tracking-tight text-[#252B27] dark:text-white tabular-nums">
                    {heroFormatted}
                  </div>
                  <div className="text-xs font-medium text-[#252B27]/60 dark:text-slate-400 mt-1">
                    Focus Timer
                  </div>
                </div>
              </div>

              {/* Controls: Start & Reset */}
              <div className="w-full grid grid-cols-2 gap-2.5 mt-4">
                <button
                  type="button"
                  onClick={toggleHeroTimer}
                  className="h-10 rounded-xl bg-[#365C4B] hover:bg-[#2B4A3C] text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {heroIsRunning ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-current" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Start</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={resetHeroTimer}
                  className="h-10 rounded-xl bg-[#F2EFE9] dark:bg-[#252E28] hover:bg-[#E7E3DC] text-[#252B27] dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Editorial Hero Workspace Photo beside timer */}
            <div className="w-full sm:w-56 h-72 relative rounded-3xl overflow-hidden border border-[#E4E1D9] dark:border-[#2D352F] shadow-sm hidden sm:block">
              <Image
                src="/images/hero-workspace.webp"
                alt="Workspace with green plant, coffee and stacked books"
                width={448}
                height={576}
                sizes="224px"
                priority
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 p-4 flex flex-col justify-between text-white">
                <span className="font-serif italic text-sm text-amber-200">Time for a Better You</span>
                <div className="text-[11px] font-medium text-white/90 space-y-0.5">
                  <p className="bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md inline-block">Good Ideas Take Time</p>
                  <p className="bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md inline-block">A More Productive You</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2B — UPCOMING HOLIDAY COUNTDOWNS                                  */}
      {/* ========================================================================= */}
      {upcomingHolidays.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-10 border-t border-[#E4E1D9] dark:border-[#262D28]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-[#B7804C] dark:text-[#cda06f] uppercase">
                <Calendar className="w-3.5 h-3.5" />
                <span>Live Date Trackers · Local Timezone</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252B27] dark:text-white mt-1">
                Upcoming Holiday Countdowns
              </h2>
            </div>

            <Link
              prefetch={false}
              href="/days-until"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#365C4B] dark:text-[#5E917A] hover:underline self-start sm:self-end"
            >
              <span>View All Holiday Countdowns</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {upcomingHolidays.map((holiday) => {
              const itemTheme = getHolidayVisualTheme(holiday.slug, holiday.baseSlug);
              const isSoon = holiday.daysRemaining > 0 && holiday.daysRemaining <= 14;
              return (
                <Link
                  key={holiday.slug}
                  prefetch={false}
                  href={`/days-until/${holiday.slug}`}
                  className="group p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#1A201C] border border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#365C4B] dark:hover:border-[#5E917A] hover:shadow-sm transition-all flex flex-col justify-between gap-3"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${itemTheme.badgeBgClass} ${itemTheme.badgeTextClass}`}
                        >
                          <HolidayIconGlyph name={itemTheme.primaryIcon} className="w-4 h-4" />
                        </span>
                        <h3 className="text-sm font-bold text-[#252B27] dark:text-white group-hover:text-[#365C4B] dark:group-hover:text-[#70B393] transition-colors">
                          {holiday.holidayName} {holiday.year}
                        </h3>
                      </div>
                      <span className="font-mono text-xs font-bold tabular-nums px-2 py-0.5 rounded-md bg-[#E7EDE7] dark:bg-[#223029] text-[#365C4B] dark:text-[#7EC4A0] shrink-0">
                        {holiday.isToday ? 'Today!' : `${holiday.daysRemaining}d`}
                      </span>
                    </div>
                    <p className="text-xs text-[#252B27]/65 dark:text-slate-400 mt-2">
                      {holiday.dayOfWeek}, {holiday.nextDate}
                    </p>
                    {(holiday.isToday || isSoon) && (
                      <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#B7804C] dark:text-[#F3C969]">
                        <Sparkles className="w-3 h-3" />
                        <span>{holiday.isToday ? 'Celebration Today!' : 'Celebration Soon'}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2.5 border-t border-[#F0EDE6] dark:border-[#252D28] flex items-center justify-between text-xs font-semibold text-[#365C4B] dark:text-[#5E917A]">
                    <span>Open flip countdown</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3 — POPULAR TOOLS ORGANIZED BY TRENDING, HOT & NEW                */}
      {/* ========================================================================= */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-12 border-t border-[#E4E1D9] dark:border-[#262D28]">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <div className="text-[11px] font-bold tracking-wider text-[#365C4B] dark:text-[#5E917A] uppercase">
              Curated Directory · Trending, Hot &amp; New
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#252B27] dark:text-white mt-1">
              Tools People Use Every Day
            </h2>
            <p className="text-xs sm:text-sm text-[#252B27]/70 dark:text-slate-400 mt-1">
              Explore our complete collection of timers, clocks, and visual countdowns—each with a unique icon and organized by Trending, Hot, and New.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start lg:self-end">
            {/* Segmented Filter Control */}
            <div
              className="inline-flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-white dark:bg-[#1A201C] border border-[#E4E1D9] dark:border-[#2D352F]"
              role="tablist"
              aria-label="Filter tools by Trending, Hot, or New"
            >
              {[
                { id: 'all', label: `All (${HOME_ORGANIZED_TOOLS.length})`, icon: null },
                {
                  id: 'trending',
                  label: `Trending (${HOME_ORGANIZED_TOOLS.filter((t) => t.tier === 'trending').length})`,
                  icon: TrendingUp,
                },
                {
                  id: 'hot',
                  label: `Hot (${HOME_ORGANIZED_TOOLS.filter((t) => t.tier === 'hot').length})`,
                  icon: Flame,
                },
                {
                  id: 'new',
                  label: `New (${HOME_ORGANIZED_TOOLS.filter((t) => t.tier === 'new').length})`,
                  icon: Sparkles,
                },
              ].map((tab) => {
                const TabIcon = tab.icon;
                const isSelected = activeTierFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setActiveTierFilter(tab.id as 'all' | ToolTier)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#365C4B] text-white shadow-xs'
                        : 'text-[#252B27]/75 dark:text-slate-300 hover:text-[#252B27] dark:hover:text-white hover:bg-[#F7F6F2] dark:hover:bg-[#222924]'
                    }`}
                  >
                    {TabIcon && <TabIcon className="w-3.5 h-3.5" />}
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <SharePageButton variant="toolbar" />

            <Link prefetch={false}
              href="/tools"
              className="text-sm font-semibold text-[#365C4B] dark:text-[#5E917A] hover:underline flex items-center gap-1 px-2 py-1.5"
            >
              <span>Open All Tools</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Grouped Sections: Trending, Hot, New */}
        <div className="space-y-12">
          {(
            [
              {
                tier: 'trending' as ToolTier,
                title: 'Trending Right Now',
                subtitle: 'Fast-rising visual and atmospheric timers loved by students, creators, and teachers.',
              },
              {
                tier: 'hot' as ToolTier,
                title: 'Hot & Most Popular',
                subtitle: 'Essential daily countdowns, stage monitors, and global clocks used by thousands every day.',
              },
              {
                tier: 'new' as ToolTier,
                title: 'New Releases',
                subtitle: 'Freshly crafted split-flap, sensory, and nature-inspired countdown experiences.',
              },
            ] as const
          )
            .filter((section) => activeTierFilter === 'all' || activeTierFilter === section.tier)
            .map((section) => {
              const toolsInSection = HOME_ORGANIZED_TOOLS.filter((t) => t.tier === section.tier);
              return (
                <div key={section.tier} className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E4E1D9] dark:border-[#262D28]">
                    <div className="flex items-center gap-3">
                      <ToolTierTag tier={section.tier} />
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#252B27] dark:text-white">
                        {section.title}
                      </h3>
                      <span className="text-xs font-mono text-[#252B27]/50 dark:text-slate-400">
                        ({toolsInSection.length})
                      </span>
                    </div>
                    <p className="text-xs text-[#252B27]/65 dark:text-slate-400">
                      {section.subtitle}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {toolsInSection.map((tool) => (
                      <Link prefetch={false}
                        key={tool.href}
                        href={tool.href}
                        className="group p-5 rounded-2xl bg-white dark:bg-[#1A201C] border border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#365C4B] dark:hover:border-[#5E917A] hover:shadow-md transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-3 mb-3.5">
                            <ToolIconBadge tool={tool.href} size="md" />
                            <ToolTierTag tier={tool.tier} />
                          </div>
                          <h4 className="text-base font-bold text-[#252B27] dark:text-white group-hover:text-[#365C4B] dark:group-hover:text-[#5E917A] transition-colors">
                            {tool.name}
                          </h4>
                          <p className="text-xs text-[#252B27]/70 dark:text-slate-400 mt-1 leading-relaxed">
                            {tool.description}
                          </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-[#F0EDE6] dark:border-[#252D28] flex items-center justify-between text-xs font-semibold text-[#365C4B] dark:text-[#5E917A]">
                          <span>Open {tool.ctaName}</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4 — FEATURED TOOL ("A Better Way to Stay on Time")                */}
      {/* ========================================================================= */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-12">
        <div className="bg-[#E7EDE7] dark:bg-[#1A221D] rounded-3xl p-6 sm:p-10 border border-[#D5DDD5] dark:border-[#2A352E]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Description & Checklist (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="text-[11px] font-bold tracking-wider text-[#365C4B] dark:text-[#5E917A] uppercase">
                Featured Tool
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#252B27] dark:text-white leading-tight">
                A Better Way to Stay on Time
              </h2>
              <p className="text-sm text-[#252B27]/80 dark:text-slate-300 leading-relaxed">
                Our easy-to-use countdown timer helps you stay focused, productive and on schedule. Perfect for classrooms, presentations and everyday tasks.
              </p>

              {/* Checklist */}
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center gap-2.5 text-xs font-semibold text-[#252B27] dark:text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-[#365C4B] dark:text-[#5E917A] shrink-0" />
                  <span>Simple and reliable</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-semibold text-[#252B27] dark:text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-[#365C4B] dark:text-[#5E917A] shrink-0" />
                  <span>Works on all devices</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-semibold text-[#252B27] dark:text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-[#365C4B] dark:text-[#5E917A] shrink-0" />
                  <span>Full screen mode</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-semibold text-[#252B27] dark:text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-[#365C4B] dark:text-[#5E917A] shrink-0" />
                  <span>No registration required</span>
                </div>
              </div>
            </div>

            {/* Interactive 15:00 Timer Card with Presets (8 cols) */}
            <div className="lg:col-span-8 bg-white dark:bg-[#141816] rounded-3xl border border-[#E4E1D9] dark:border-[#2D352F] p-6 shadow-sm">
              {/* Tabs: Countdown / Stopwatch / Interval */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E4E1D9] dark:border-[#262D28]">
                <div className="flex items-center gap-1 bg-[#F7F6F2] dark:bg-[#1E2521] p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setFeaturedTab('countdown')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      featuredTab === 'countdown'
                        ? 'bg-[#365C4B] text-white shadow-2xs'
                        : 'text-[#252B27]/70 dark:text-slate-300'
                    }`}
                  >
                    Countdown
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeaturedTab('stopwatch')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      featuredTab === 'stopwatch'
                        ? 'bg-[#365C4B] text-white shadow-2xs'
                        : 'text-[#252B27]/70 dark:text-slate-300'
                    }`}
                  >
                    Stopwatch
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeaturedTab('interval')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      featuredTab === 'interval'
                        ? 'bg-[#365C4B] text-white shadow-2xs'
                        : 'text-[#252B27]/70 dark:text-slate-300'
                    }`}
                  >
                    Interval
                  </button>
                </div>

                <SharePageButton variant="icon" />
              </div>

              {/* Dial + Quick Presets row */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center my-4">
                {/* Visual Circle Dial */}
                <div className="sm:col-span-8 flex flex-col items-center justify-center">
                  <div className="relative w-44 h-44 flex items-center justify-center">
                    <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
                      <circle
                        cx="80"
                        cy="80"
                        r="66"
                        fill="none"
                        stroke="#D97706"
                        strokeWidth="10"
                        className="opacity-90"
                      />
                      <circle
                        cx="80"
                        cy="80"
                        r="66"
                        fill="none"
                        stroke="#365C4B"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 66}
                        strokeDashoffset={2 * Math.PI * 66 * (1 - featFraction)}
                        className="transition-all duration-200"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <div className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-[#252B27] dark:text-white tabular-nums">
                        {featFormatted}
                      </div>
                      <div className="text-[11px] font-medium text-[#252B27]/60 dark:text-slate-400 mt-0.5">
                        Minutes
                      </div>
                    </div>
                  </div>

                  {/* Start / Reset buttons */}
                  <div className="flex items-center gap-2 mt-4 w-full px-2">
                    <button
                      type="button"
                      onClick={toggleFeaturedTimer}
                      className="flex-1 h-10 rounded-xl bg-[#365C4B] hover:bg-[#2B4A3C] text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {featuredIsRunning ? (
                        <>
                          <Pause className="w-3.5 h-3.5 fill-current" />
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Start</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={resetFeaturedTimer}
                      className="h-10 px-4 rounded-xl bg-[#F2EFE9] dark:bg-[#252E28] hover:bg-[#E7E3DC] text-[#252B27] dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  </div>
                </div>

                {/* Quick Presets Vertical List */}
                <div className="sm:col-span-4 border-t sm:border-t-0 sm:border-l border-[#E4E1D9] dark:border-[#262D28] sm:pl-4 pt-3 sm:pt-0">
                  <div className="text-[11px] font-bold text-[#252B27]/60 dark:text-slate-400 uppercase mb-2">
                    Quick Presets
                  </div>
                  <div className="flex sm:flex-col gap-1 flex-wrap">
                    {[
                      { label: '1 min', sec: 60 },
                      { label: '5 min', sec: 300 },
                      { label: '10 min', sec: 600 },
                      { label: '15 min', sec: 900 },
                      { label: '30 min', sec: 1800 },
                      { label: '45 min', sec: 2700 },
                      { label: '1 hour', sec: 3600 },
                    ].map((p) => {
                      const isSelected = featuredDurationSec === p.sec;
                      return (
                        <button
                          key={p.label}
                          type="button"
                          onClick={() => selectFeaturedPreset(p.sec)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold text-center transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-[#365C4B] text-white'
                              : 'bg-[#F7F6F2] dark:bg-[#1E2521] text-[#252B27]/80 dark:text-slate-300 hover:bg-[#E7EDE7]'
                          }`}
                        >
                          {p.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5 — EXPLORE BY COMMUNITY ("Made for the Way You Work")           */}
      {/* ========================================================================= */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-12 border-t border-[#E4E1D9] dark:border-[#262D28]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
          <div>
            <div className="text-[11px] font-bold tracking-wider text-[#252B27]/60 dark:text-slate-400 uppercase">
              Explore by Community
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#252B27] dark:text-white mt-1">
              Made for the Way You Work
            </h2>
          </div>
          <Link prefetch={false}
            href="/tools"
            className="text-sm font-semibold text-[#365C4B] dark:text-[#5E917A] hover:underline flex items-center gap-1 self-start sm:self-end"
          >
            <span>See All Communities</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 6 Community Category Cards with Unique Icons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {[
            {
              title: 'Speakers & Event Organizers',
              desc: 'Timers and tools for smooth events and presentations.',
              href: '/stage-timer',
              cta: 'Open Stage Timer',
              iconKey: 'stage-timer',
              tier: 'hot' as ToolTier,
            },
            {
              title: 'Teachers & Students',
              desc: 'Create engaging and productive learning sessions.',
              href: '/classroom-timer',
              cta: 'Open Classroom Timer',
              iconKey: 'classroom-timer',
              tier: 'hot' as ToolTier,
            },
            {
              title: 'Fitness & Training',
              desc: 'Interval timers for workouts and training sessions.',
              href: '/interval-timer',
              cta: 'Open Interval Timer',
              iconKey: 'interval-timer',
              tier: 'trending' as ToolTier,
            },
            {
              title: 'Productivity & Focus',
              desc: 'Stay focused and get more done each day.',
              href: '/pomodoro-timer',
              cta: 'Open Pomodoro Timer',
              iconKey: 'pomodoro-timer',
              tier: 'hot' as ToolTier,
            },
            {
              title: 'Remote Teams',
              desc: 'Coordinate time across different locations.',
              href: '/time-zone-converter',
              cta: 'Open Time-Zone Converter',
              iconKey: 'remote-teams',
              tier: 'trending' as ToolTier,
            },
            {
              title: 'Developers & Pros',
              desc: 'Useful multi-track and embed time tools for work.',
              href: '/multi-stopwatch',
              cta: 'Open Multi-Stopwatch',
              iconKey: 'multi-stopwatch',
              tier: 'new' as ToolTier,
            },
          ].map((item) => (
            <Link prefetch={false}
              key={item.title}
              href={item.href}
              className="group p-5 rounded-2xl bg-white dark:bg-[#1A201C] border border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#365C4B] hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3.5">
                  <ToolIconBadge tool={item.iconKey} size="md" />
                  <ToolTierTag tier={item.tier} />
                </div>
                <h3 className="text-sm font-bold text-[#252B27] dark:text-white group-hover:text-[#365C4B] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-[#252B27]/70 dark:text-slate-400 mt-1 leading-relaxed">
                  {item.desc}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#F0EDE6] dark:border-[#252D28] flex items-center justify-between text-xs font-semibold text-[#365C4B] dark:text-[#5E917A]">
                <span>{item.cta}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 6 — FEATURED CATEGORIES ("Find the Right Tool for Every Moment")  */}
      {/* ========================================================================= */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-12 border-t border-[#E4E1D9] dark:border-[#262D28]">
        <div className="mb-8">
          <div className="text-[11px] font-bold tracking-wider text-[#252B27]/60 dark:text-slate-400 uppercase">
            Featured Categories
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#252B27] dark:text-white mt-1">
            Find the Right Tool for Every Moment
          </h2>
        </div>

        {/* 5 Cards with Photographic Headers & Unique Tool Icons per Option */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              title: 'Everyday Timers',
              href: '/category/timers',
              cta: 'Open Everyday Timers',
              img: '/images/cat-timers.webp',
              alt: 'Analog alarm clock on wooden table',
              tools: [
                { label: 'Flip Clock', href: '/timers/flip-clock', tier: 'new' as ToolTier },
                { label: 'Sand Timer', href: '/timers/sand-timer', tier: 'hot' as ToolTier },
                { label: 'Countdown Timer', href: '/countdown-timer', tier: 'hot' as ToolTier },
                { label: 'Stopwatch', href: '/stopwatch', tier: 'trending' as ToolTier },
              ],
            },
            {
              title: 'Presentation & Event Tools',
              href: '/category/events',
              cta: 'Open Event Tools',
              img: '/images/cat-events.webp',
              alt: 'Stage microphone in auditorium',
              tools: [
                { label: 'Holiday Countdowns', href: '/days-until', tier: 'new' as ToolTier },
                { label: 'Stage Timer', href: '/stage-timer', tier: 'hot' as ToolTier },
                { label: 'Presentation Timer', href: '/presentation-timer', tier: 'trending' as ToolTier },
                { label: 'Event Countdown', href: '/event-countdown-timer', tier: 'trending' as ToolTier },
              ],
            },
            {
              title: 'Education & Classroom',
              href: '/category/education',
              cta: 'Open Classroom Tools',
              img: '/images/cat-education.webp',
              alt: 'Classroom desks and chalkboard',
              tools: [
                { label: 'Sensory Timers', href: '/timers/sensory-timers', tier: 'new' as ToolTier },
                { label: 'Spinner Timer', href: '/timers/spinner-timer', tier: 'new' as ToolTier },
                { label: 'Classroom Timer', href: '/classroom-timer', tier: 'hot' as ToolTier },
                { label: 'Random Name Picker', href: '/random-name-picker', tier: 'trending' as ToolTier },
              ],
            },
            {
              title: 'Fitness & Wellness',
              href: '/category/fitness',
              cta: 'Open Fitness Tools',
              img: '/images/cat-fitness.webp',
              alt: 'Gym shoe and dumbbell weights',
              tools: [
                { label: 'Interval Timer', href: '/interval-timer', tier: 'hot' as ToolTier },
                { label: 'Tabata Timer', href: '/tabata-timer', tier: 'hot' as ToolTier },
                { label: 'Rings Timer', href: '/timers/rings-timer', tier: 'trending' as ToolTier },
                { label: 'Heart Timer', href: '/timers/heart-timer', tier: 'new' as ToolTier },
              ],
            },
            {
              title: 'World Time & Calculators',
              href: '/category/world',
              cta: 'Open World Clock & Tools',
              img: '/images/cat-world.webp',
              alt: 'Vintage desktop globe with compass',
              tools: [
                { label: 'World Clock', href: '/world-clock', tier: 'hot' as ToolTier },
                { label: 'Time-Zone Converter', href: '/time-zone-converter', tier: 'hot' as ToolTier },
                { label: 'Meeting Planner', href: '/meeting-planner', tier: 'trending' as ToolTier },
                { label: 'Duration Calculator', href: '/time-duration-calculator', tier: 'trending' as ToolTier },
              ],
            },
          ].map((cat) => (
            <div
              key={cat.title}
              className="bg-white dark:bg-[#1A201C] rounded-2xl overflow-hidden border border-[#E4E1D9] dark:border-[#2D352F] flex flex-col justify-between shadow-2xs"
            >
              <div className="h-32 relative overflow-hidden">
                <Image
                  src={cat.img}
                  alt={cat.alt}
                  width={800}
                  height={600}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 280px"
                  loading="lazy"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[#252B27] dark:text-white mb-3">
                    {cat.title}
                  </h3>
                  <ul className="text-xs space-y-2 text-[#252B27]/80 dark:text-slate-300">
                    {cat.tools.map((t) => (
                      <li key={t.label}>
                        <Link prefetch={false}
                          href={t.href}
                          className="group flex items-center justify-between gap-2 hover:text-[#365C4B] dark:hover:text-[#5E917A] transition-colors"
                        >
                          <span className="inline-flex items-center gap-2 font-medium truncate">
                            <ToolIconBadge tool={t.label} size="xs" />
                            <span className="truncate">{t.label}</span>
                          </span>
                          <ToolTierTag tier={t.tier} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link prefetch={false}
                  href={cat.href}
                  className="mt-4 pt-3 border-t border-[#F0EDE6] dark:border-[#252D28] text-xs font-semibold text-[#365C4B] dark:text-[#5E917A] hover:underline flex items-center justify-between"
                >
                  <span>{cat.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 7 — PRACTITIONER CHRONOMETRY & ARCHITECTURE OVERVIEW              */}
      {/* ========================================================================= */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-16 border-t border-[#E4E1D9] dark:border-[#262D28]">
        <div className="max-w-4xl mb-10">
          <div className="text-[11px] font-bold tracking-wider text-[#365C4B] dark:text-[#5E917A] uppercase">
            Browser Chronometry · IANA Standards · Zero-Account Architecture
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#252B27] dark:text-white mt-1">
            Built for Classrooms, Live Stage Booths, Athletic Floors &amp; Distributed Teams
          </h2>
          <p className="text-sm sm:text-base text-[#252B27]/80 dark:text-slate-300 mt-2 leading-relaxed">
            Every utility on <strong className="font-semibold text-[#252B27] dark:text-white">WebCountDownTimer</strong> (<span className="font-mono text-xs sm:text-sm">WebCountDownTimer.com</span>) computes elapsed and remaining time against hardware system timestamps (<code className="font-mono text-xs">Date.now()</code>) rather than naive <code className="font-mono text-xs">setInterval</code> ticks. Even when your browser tab is minimized or your laptop enters battery-saver mode, your countdowns, multi-lane stopwatches, and stage confidence monitors remain accurate to the millisecond.
          </p>
        </div>

        {/* 3-Column Practitioner Technical Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-xs sm:text-sm text-[#252B27]/80 dark:text-slate-300 leading-relaxed">
          {/* Column 1 */}
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-base text-[#252B27] dark:text-white mb-2">
                Why Naive Browser Timers Drift—and How We Fix It
              </h3>
              <p>
                Modern web browsers throttle background tab timers to once per second—or pause them entirely—to conserve CPU power. If a timer simply subtracts 1 every tick, a 25-minute Pomodoro or 45-minute exam clock can lag by 3 to 8 minutes. By anchoring every run to a Unix epoch target timestamp and requesting a <code className="font-mono text-xs">navigator.wakeLock(&apos;screen&apos;)</code> lease in fullscreen mode, our clocks never drift or dim mid-session.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-base text-[#252B27] dark:text-white mb-2">
                Downstage Confidence Monitors &amp; Dual-Screen Sync
              </h3>
              <p>
                Conference showcallers, Toastmasters timers, and debate adjudicators need silent visual cues rather than disruptive buzzers. Our Stage, Presentation, and Toastmasters timers use the browser&apos;s native <code className="font-mono text-xs">BroadcastChannel</code> API so you can control time from your booth laptop while projecting borderless Green, Amber, and Red phase warnings on a downstage floor wedge.
              </p>
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-base text-[#252B27] dark:text-white mb-3">
                4-Step Practitioner Triage: Matching the Clock to the Room
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#365C4B] text-white flex items-center justify-center font-mono font-bold text-[11px] shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <span className="font-bold text-[#252B27] dark:text-white">Sensory &amp; K–12 Classrooms</span>: Project proportional visual arcs, falling-sand hourglasses, or muted frost/liquid timers so young or neurodivergent learners see time pass spatially without reading abstract digits.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#365C4B] text-white flex items-center justify-center font-mono font-bold text-[11px] shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <span className="font-bold text-[#252B27] dark:text-white">HIIT, Tabata &amp; Combat Rounds</span>: Use programmable Work/Rest Interval and Boxing clocks with 3-2-1 Web Audio transition beeps and 30-second amber end-of-round clappers.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#365C4B] text-white flex items-center justify-center font-mono font-bold text-[11px] shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <span className="font-bold text-[#252B27] dark:text-white">Multi-Lane Track &amp; Swim Heats</span>: Launch the 8-lane Multi-Stopwatch to trigger a shared gun start, log individual lane splits, and export lap deltas to CSV.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#365C4B] text-white flex items-center justify-center font-mono font-bold text-[11px] shrink-0 mt-0.5">
                    4
                  </div>
                  <div>
                    <span className="font-bold text-[#252B27] dark:text-white">Cross-Border Scheduling &amp; Payroll</span>: Verify 2026 DST shifts and non-integer zones (<span className="font-mono text-xs">UTC+05:30</span>, <span className="font-mono text-xs">UTC+05:45</span>), or convert base-60 shifts (<span className="font-mono text-xs">08:45</span>) into decimal payroll hours (<span className="font-mono text-xs">8.75h</span>).
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Comparison Table & Additional Sections */}
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-base text-[#252B27] dark:text-white mb-2.5">
                Timing Architecture Matrix
              </h3>
              <div className="overflow-hidden rounded-xl border border-[#E4E1D9] dark:border-[#2D352F] bg-white dark:bg-[#1A201C] text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#365C4B] text-white">
                      <th className="p-2.5 font-bold">Parameter</th>
                      <th className="p-2.5 font-bold">Countdown / Stage</th>
                      <th className="p-2.5 font-bold">Stopwatch / Multi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E4E1D9] dark:divide-[#2D352F] font-mono text-[11px]">
                    <tr>
                      <td className="p-2.5 font-sans font-semibold">Direction</td>
                      <td className="p-2.5 tabular-nums">T−Duration → 00:00 (+OT)</td>
                      <td className="p-2.5 tabular-nums">00:00.00 → Elapsed</td>
                    </tr>
                    <tr className="bg-[#F7F6F2]/50 dark:bg-[#1E2521]/50">
                      <td className="p-2.5 font-sans font-semibold">Resolution</td>
                      <td className="p-2.5 tabular-nums">1s / 100ms delta</td>
                      <td className="p-2.5 tabular-nums">10ms (0.01s splits)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-sans font-semibold">Phase Signals</td>
                      <td className="p-2.5 font-sans">Green / Amber / Red + Chime</td>
                      <td className="p-2.5 font-sans">Fastest / Slowest Lap Delta</td>
                    </tr>
                    <tr className="bg-[#F7F6F2]/50 dark:bg-[#1E2521]/50">
                      <td className="p-2.5 font-sans font-semibold">Data Export</td>
                      <td className="p-2.5 font-sans">Shareable URL state</td>
                      <td className="p-2.5 font-sans">One-click CSV split log</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-base text-[#252B27] dark:text-white mb-1.5">
                IANA Time Zones &amp; Base-60 Payroll Accuracy
              </h3>
              <p>
                All world clock and meeting planner calculations run against the official IANA Time Zone Database via <code className="font-mono text-xs">Intl.DateTimeFormat</code>, handling 2026 US/EU Daylight Saving mismatches automatically. Time card and overtime calculators output both <span className="font-mono text-xs">HH:MM</span> and base-10 decimal hours for error-free payroll entry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 8 — TECHNICAL & OPERATIONAL FAQ                                   */}
      {/* ========================================================================= */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-12">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'Are these online tools free?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes, 100% free forever. There are no subscriptions, paywalls, or feature gates for any of our 49 timers and utilities.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Can I use the tools without registration?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Absolutely. Every tool works immediately in your browser with zero sign-up, email requirements, or account creation.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Do the timers work on mobile devices?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes! All tools are built mobile-first with responsive controls, touch-friendly buttons, and screen wake lock support.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Can I use a timer in fullscreen mode?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes. Press the Fullscreen button or tap the "F" key on your keyboard to enter a clean distraction-free projection display.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Do time-zone conversions account for daylight saving?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes. All world clock calculations utilize browser-native IANA time zone rules and automatically adjust for Daylight Saving Time (DST).',
                  },
                },
              ],
            }),
          }}
        />
        <div className="bg-[#E7EDE7] dark:bg-[#1A221D] rounded-3xl p-6 sm:p-10 border border-[#D5DDD5] dark:border-[#2A352E]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
            <div>
              <div className="text-[11px] font-bold tracking-wider text-[#365C4B] dark:text-[#5E917A] uppercase">
                Technical &amp; Operational FAQ
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#252B27] dark:text-white mt-1">
                Platform Architecture &amp; Usage Questions
              </h2>
            </div>
            <Link prefetch={false}
              href="/guides"
              className="text-sm font-semibold text-[#365C4B] dark:text-[#5E917A] hover:underline flex items-center gap-1 self-start sm:self-end"
            >
              <span>Read Timing Standards &amp; Guides</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 5 Horizontal Accordion Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {[
              {
                q: 'Are these online tools free?',
                a: 'Yes, 100% free forever. There are no subscriptions, paywalls, or feature gates for any of our 49 timers and utilities.',
              },
              {
                q: 'Can I use the tools without registration?',
                a: 'Absolutely. Every tool works immediately in your browser with zero sign-up, email requirements, or account creation.',
              },
              {
                q: 'Do the timers work on mobile devices?',
                a: 'Yes! All tools are built mobile-first with responsive controls, touch-friendly buttons, and screen wake lock support.',
              },
              {
                q: 'Can I use a timer in fullscreen mode?',
                a: 'Yes. Press the Fullscreen button or tap the "F" key on your keyboard to enter a clean distraction-free projection display.',
              },
              {
                q: 'Do time-zone conversions account for daylight saving?',
                a: 'Yes. All world clock calculations utilize browser-native IANA time zone rules and automatically adjust for Daylight Saving Time (DST).',
              },
            ].map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={faq.q} className="flex flex-col">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left p-3.5 rounded-2xl bg-white dark:bg-[#141816] border border-[#D5DDD5] dark:border-[#2A352E] hover:border-[#365C4B] transition-colors cursor-pointer flex items-center justify-between gap-2 shadow-2xs"
                  >
                    <span className="text-xs font-bold text-[#252B27] dark:text-white line-clamp-2">
                      <span className="text-[#365C4B] dark:text-[#5E917A] font-extrabold mr-1">+</span>
                      {faq.q}
                    </span>
                    <ArrowRight className={`w-3.5 h-3.5 text-[#365C4B] shrink-0 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                  </button>
                  <div
                    className={
                      isOpen
                        ? 'mt-2 p-3.5 rounded-xl bg-white/90 dark:bg-[#141816]/90 border border-[#D5DDD5] dark:border-[#2A352E] text-xs text-[#252B27]/80 dark:text-slate-300 leading-relaxed shadow-sm block'
                        : 'hidden'
                    }
                  >
                    {faq.a}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

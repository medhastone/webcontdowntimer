'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Plus,
  Minus,
  Lightbulb,
  GraduationCap,
  Users,
  Volume2,
  BarChart3,
  Tv,
  Presentation,
  Mic,
  Trophy,
  Scale,
  Calendar,
  BookOpen,
  Hourglass,
  Calculator,
  Flame,
  Code2,
  Globe,
  Bell,
  ArrowRight,
  Maximize2,
  VolumeX,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import type { CategoryData, CategoryToolItem } from '@/lib/category-data';
import { ToolIconBadge, ToolTierTag, type ToolTier } from '@/components/ui/ToolIcon';
import SharePageButton from '@/components/common/SharePageButton';

interface Props {
  data: CategoryData;
}

const NEW_TOOL_KEYS = new Set([
  'custom-timer',
  'sensory-timers',
  'flip-clock',
  'forest-fire-timer',
  'train-timer',
  'flip-timer',
  'spinner-timer',
  'snow-timer',
  'frost-timer',
  'lichen-timer',
  'coral-timer',
  'bubble-timer',
  'sun-timer',
  'moon-timer',
  'heart-timer',
]);

const TRENDING_TOOL_KEYS = new Set([
  'lava-lamp-timer',
  'galaxy-timer',
  'rainbow-timer',
  'liquid-timer',
  'aesthetic-timer',
  'pixel-timer',
  'picture-reveal-timer',
  'candle-timer',
  'blocks-timer',
  'rings-timer',
  'radial-timer',
  'progress-timer',
  'circular-timer',
  'presentation-timer',
  'toastmasters-timer',
  'debate-timer',
  'webinar-timer',
  'sermon-timer',
  'international-meeting-planner',
  'multi-stopwatch',
  'random-name-picker',
  'classroom-noise-meter',
  'embed-widget',
]);

function resolveCategoryToolTier(tool: CategoryToolItem, index: number): ToolTier {
  if (tool.tier) return tool.tier;
  const slug = tool.href.replace(/\/$/, '').split('/').pop() || '';
  if (NEW_TOOL_KEYS.has(slug)) return 'new';
  if (TRENDING_TOOL_KEYS.has(slug)) return 'trending';
  const badgeLower = (tool.badge || '').toLowerCase();
  if (badgeLower === 'hot' || badgeLower === 'popular' || badgeLower === 'recommended' || badgeLower === 'live sync') {
    return 'hot';
  }
  if (badgeLower === 'trending') return 'trending';
  if (badgeLower === 'new') {
    return index % 2 === 0 ? 'new' : 'trending';
  }
  return index % 2 === 0 ? 'hot' : 'trending';
}

// Icon resolver helper for dynamic icon names in CategoryData
function renderCategoryIcon(iconName: string, className = 'w-5 h-5') {
  switch (iconName) {
    case 'GraduationCap':
      return <GraduationCap className={className} />;
    case 'Clock':
      return <Clock className={className} />;
    case 'Users':
      return <Users className={className} />;
    case 'Volume2':
      return <Volume2 className={className} />;
    case 'BarChart3':
      return <BarChart3 className={className} />;
    case 'Tv':
      return <Tv className={className} />;
    case 'Presentation':
      return <Presentation className={className} />;
    case 'Mic':
      return <Mic className={className} />;
    case 'Trophy':
      return <Trophy className={className} />;
    case 'Scale':
      return <Scale className={className} />;
    case 'Calendar':
      return <Calendar className={className} />;
    case 'BookOpen':
      return <BookOpen className={className} />;
    case 'Hourglass':
      return <Hourglass className={className} />;
    case 'Calculator':
      return <Calculator className={className} />;
    case 'Flame':
      return <Flame className={className} />;
    case 'Code2':
      return <Code2 className={className} />;
    case 'Globe':
      return <Globe className={className} />;
    case 'Bell':
      return <Bell className={className} />;
    case 'RotateCcw':
    default:
      return <RotateCcw className={className} />;
  }
}

export default function CategoryLandingPageComponent({ data }: Props) {
  // --- Interactive Featured Timer State ---
  const initialDuration = data.featuredTool.defaultDurationSec > 0 ? data.featuredTool.defaultDurationSec : 600;
  const [activeTab, setActiveTab] = useState<'countdown' | 'visual' | 'alarm'>('countdown');
  const [selectedPresetSec, setSelectedPresetSec] = useState<number>(initialDuration);
  const [timeLeftSec, setTimeLeftSec] = useState<number>(initialDuration);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);
  const [activeTocIndex, setActiveTocIndex] = useState<number>(0);
  const [tierFilter, setTierFilter] = useState<'all' | ToolTier>('all');

  const mergedCategoryTools = data.tools;

  const organizedToolGroups = React.useMemo(() => {
    const trending: CategoryToolItem[] = [];
    const hot: CategoryToolItem[] = [];
    const newest: CategoryToolItem[] = [];

    mergedCategoryTools.forEach((tool, idx) => {
      const resolvedTier = resolveCategoryToolTier(tool, idx);
      const enriched = { ...tool, tier: resolvedTier };
      if (resolvedTier === 'trending') trending.push(enriched);
      else if (resolvedTier === 'hot') hot.push(enriched);
      else newest.push(enriched);
    });

    return [
      {
        id: 'trending' as ToolTier,
        title: 'Trending Right Now',
        subtitle: 'Rising visual and interactive tools gaining traction in this category.',
        tools: trending,
      },
      {
        id: 'hot' as ToolTier,
        title: 'Hot & Most Popular',
        subtitle: 'Battle-tested daily essentials trusted by teachers, teams, and presenters.',
        tools: hot,
      },
      {
        id: 'new' as ToolTier,
        title: 'New Releases',
        subtitle: 'Freshly crafted split-flap, sensory, and nature-inspired countdown experiences.',
        tools: newest,
      },
    ].filter((group) => group.tools.length > 0);
  }, [mergedCategoryTools]);

  const categoryTocSectionIds = [
    'guide-overview',
    'guide-what',
    'guide-how',
    'guide-practical',
    'guide-tips',
    'guide-mistakes',
    'frequently-asked-questions',
  ];

  const handleTocClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string,
    index: number
  ) => {
    e.preventDefault();
    setActiveTocIndex(index);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', `#${sectionId}`);
    }
  };

  // Timer interval handling with timestamp delta to prevent background throttling
  const startTimeRef = useRef<number>(0);
  const durationRef = useRef<number>(initialDuration);
  const timerIdRef = useRef<NodeJS.Timeout | null>(null);

  // Web Audio chime generator
  const playChime = () => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch {
      // Audio fallback silent
    }
  };

  const handleStartPause = () => {
    if (isRunning) {
      // Pause
      setIsRunning(false);
      if (timerIdRef.current) clearInterval(timerIdRef.current);
    } else {
      // Start
      if (timeLeftSec <= 0) {
        setTimeLeftSec(selectedPresetSec);
        durationRef.current = selectedPresetSec;
      }
      setIsRunning(true);
      startTimeRef.current = Date.now() - (durationRef.current - timeLeftSec) * 1000;

      timerIdRef.current = setInterval(() => {
        const elapsedSec = Math.floor((Date.now() - startTimeRef.current) / 1000);
        const remaining = Math.max(0, durationRef.current - elapsedSec);
        setTimeLeftSec(remaining);

        if (remaining <= 0) {
          if (timerIdRef.current) clearInterval(timerIdRef.current);
          setIsRunning(false);
          playChime();
        }
      }, 200);
    }
  };

  const handleReset = () => {
    if (timerIdRef.current) clearInterval(timerIdRef.current);
    setIsRunning(false);
    setTimeLeftSec(selectedPresetSec);
    durationRef.current = selectedPresetSec;
  };

  const handleSelectPreset = (sec: number) => {
    if (timerIdRef.current) clearInterval(timerIdRef.current);
    setIsRunning(false);
    setSelectedPresetSec(sec);
    setTimeLeftSec(sec);
    durationRef.current = sec;
  };

  useEffect(() => {
    return () => {
      if (timerIdRef.current) clearInterval(timerIdRef.current);
    };
  }, []);

  // Format time MM:SS
  const minutes = Math.floor(timeLeftSec / 60);
  const seconds = timeLeftSec % 60;
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');

  // Ring progress (fraction 0..1)
  const total = selectedPresetSec > 0 ? selectedPresetSec : 600;
  const progressRatio = Math.min(1, Math.max(0, timeLeftSec / total));
  // Circle geometry for SVG
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progressRatio * circumference;

  const categoryUrl = `https://WebCountDownTimer.com/category/${data.slug}`;

  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: data.title,
    description: data.description,
    url: categoryUrl,
    inLanguage: 'en',
    dateModified: '2026-11-16',
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: [
        '#category-quick-answer',
        '#guide-overview',
        '#frequently-asked-questions',
      ],
    },
    mainEntity: {
      '@type': 'ItemList',
      name: data.toolsHeading,
      numberOfItems: data.tools.length,
      itemListElement: data.tools.map((t, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: t.name,
        description: t.description,
        url: `https://WebCountDownTimer.com${t.href}`,
      })),
    },
    isPartOf: {
      '@type': 'WebSite',
      name: 'WebCountDownTimer',
      url: 'https://WebCountDownTimer.com',
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://WebCountDownTimer.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'All Tools',
        item: 'https://WebCountDownTimer.com/tools',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: data.title,
        item: categoryUrl,
      },
    ],
  };

  const faqSchema =
    data.faqs && data.faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: data.faqs.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: {
              '@type': 'Answer',
              text: f.a,
            },
          })),
        }
      : null;

  return (
    <div className="min-h-screen bg-[#F7F6F2] dark:bg-[#141816] text-[#252B27] dark:text-slate-100 transition-colors">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      {/* 1. BREADCRUMB BAR */}
      <nav aria-label="Breadcrumb" className="border-b border-[#E4E1D9] dark:border-[#262D28] bg-white/60 dark:bg-[#181D1A]/60">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-3">
          <ol className="flex items-center flex-wrap gap-2 text-xs text-[#252B27]/70 dark:text-slate-400">
            <li>
              <Link prefetch={false} href="/" className="hover:text-[#365C4B] dark:hover:text-[#5E917A] transition-colors">
                Home
              </Link>
            </li>
            <li className="text-[#252B27]/30 dark:text-slate-600">›</li>
            <li>
              <Link prefetch={false} href="/tools" className="hover:text-[#365C4B] dark:hover:text-[#5E917A] transition-colors">
                All Tools
              </Link>
            </li>
            <li className="text-[#252B27]/30 dark:text-slate-600">›</li>
            <li className="text-[#252B27] dark:text-white font-medium">
              {data.title}
            </li>
          </ol>
        </div>
      </nav>

      {/* 2. CATEGORY HERO */}
      <section className="pt-10 pb-12 sm:pt-14 sm:pb-16 border-b border-[#E4E1D9] dark:border-[#262D28]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7">
              <span className="inline-block text-[11px] sm:text-xs font-bold tracking-widest text-[#B7804C] dark:text-[#cda06f] uppercase mb-3">
                {data.categoryKicker}
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-[56px] leading-[1.08] font-normal tracking-tight text-[#252B27] dark:text-white mb-5">
                {data.title}
              </h1>
              <p className="text-base sm:text-lg text-[#252B27]/80 dark:text-slate-300 leading-relaxed max-w-2xl mb-8">
                {data.description}
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link prefetch={false}
                  href={data.heroCtaHref}
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[#365C4B] hover:bg-[#2b4a3c] dark:bg-[#365C4B] dark:hover:bg-[#436e5a] text-white font-medium text-sm sm:text-base shadow-sm transition-all"
                >
                  <span>{data.heroCtaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#explore-tools"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-[#E4E1D9] dark:border-[#2D352F] bg-white dark:bg-[#1A201C] text-[#252B27] dark:text-slate-200 text-sm font-medium hover:border-[#365C4B] transition-colors"
                >
                  <span>Explore Tools</span>
                  <ChevronRight className="w-4 h-4 text-[#252B27]/40" />
                </a>
              </div>
            </div>

            {/* Right Editorial Hero Image */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-[#E4E1D9] dark:border-[#2D352F] shadow-lg aspect-4/3 bg-[#E7EDE7]/30">
                <Image
                  src={data.heroImage.src}
                  alt={data.heroImage.alt}
                  width={800}
                  height={600}
                  sizes="(max-width: 1024px) 100vw, 560px"
                  className="w-full h-full object-cover"
                  priority
                  referrerPolicy="no-referrer"
                />
                {data.heroImage.chalkText && (
                  <div className="absolute top-4 left-4 bg-[#252B27]/85 backdrop-blur-xs text-[#E7EDE7] px-3.5 py-1.5 rounded-lg text-xs font-serif italic border border-white/10 shadow-md">
                    {data.heroImage.chalkText}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED TOOL SECTION (Interactive Preview) */}
      <section className="py-12 sm:py-16 bg-[#E7EDE7]/40 dark:bg-[#161D19]/40 border-b border-[#E4E1D9] dark:border-[#262D28]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left: Tool Details & Checklist */}
            <div className="lg:col-span-4 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold tracking-widest text-[#B7804C] dark:text-[#cda06f] uppercase block mb-2">
                  {data.featuredTool.kicker}
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#252B27] dark:text-white mb-3">
                  {data.featuredTool.title}
                </h2>
                <p className="text-sm text-[#252B27]/80 dark:text-slate-300 leading-relaxed mb-6">
                  {data.featuredTool.description}
                </p>

                <ul className="space-y-3 mb-8">
                  {data.featuredTool.checklist.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-[#252B27] dark:text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-[#365C4B] dark:text-[#5E917A] shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2">
                <Link prefetch={false}
                  href={data.featuredTool.href}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#365C4B] dark:text-[#5E917A] hover:underline"
                >
                  <span>Launch Fullscreen {data.featuredTool.title}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right: The Interactive Dial & Controls */}
            <div className="lg:col-span-8 bg-white dark:bg-[#1A201C] rounded-2xl border border-[#E4E1D9] dark:border-[#2D352F] p-6 shadow-sm flex flex-col justify-between">
              {/* Tabs: Countdown / Visual / Alarm */}
              <div className="flex items-center justify-between border-b border-[#E4E1D9] dark:border-[#2D352F] pb-4 mb-4">
                <div className="inline-flex p-1 bg-[#F7F6F2] dark:bg-[#252D28] rounded-xl text-xs font-medium">
                  {(['countdown', 'visual', 'alarm'] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1.5 rounded-lg capitalize transition-all cursor-pointer ${
                        activeTab === tab
                          ? 'bg-[#365C4B] text-white shadow-xs font-semibold'
                          : 'text-[#252B27]/70 dark:text-slate-300 hover:text-[#252B27]'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="p-1.5 rounded-lg text-[#252B27]/60 dark:text-slate-400 hover:bg-[#F7F6F2] dark:hover:bg-[#252D28] transition-colors"
                    title={soundEnabled ? 'Mute alert chime' : 'Enable alert chime'}
                  >
                    {soundEnabled ? <Volume2 className="w-4 h-4 text-[#365C4B]" /> : <VolumeX className="w-4 h-4 text-red-500" />}
                  </button>
                  <SharePageButton variant="icon" />
                  <Link prefetch={false}
                    href={data.featuredTool.href}
                    className="p-1.5 rounded-lg text-[#252B27]/60 dark:text-slate-400 hover:bg-[#F7F6F2] dark:hover:bg-[#252D28] transition-colors"
                    title="Fullscreen"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Main Circular Dial Area & Quick Presets */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center my-2">
                {/* SVG Progress Dial */}
                <div className="sm:col-span-8 flex flex-col items-center justify-center">
                  <div className="relative w-52 h-52 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 200 200">
                      {/* Background circle track */}
                      <circle
                        cx="100"
                        cy="100"
                        r={radius}
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="12"
                        className="text-[#E7EDE7] dark:text-[#26312B]"
                      />
                      {/* Dual-tone Progress Arc */}
                      <circle
                        cx="100"
                        cy="100"
                        r={radius}
                        fill="transparent"
                        stroke="#B7804C"
                        strokeWidth="12"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className="transition-all duration-300 ease-out"
                      />
                      {/* Inner accent ring */}
                      <circle
                        cx="100"
                        cy="100"
                        r={radius - 10}
                        fill="transparent"
                        stroke="#365C4B"
                        strokeWidth="2"
                        strokeDasharray="4 6"
                        className="opacity-30"
                      />
                    </svg>

                    {/* Numerical Readout inside Dial */}
                    <div className="absolute flex flex-col items-center justify-center text-center">
                      <span className="font-mono text-4xl sm:text-[42px] font-bold tracking-tight text-[#252B27] dark:text-white">
                        {formattedMinutes}:{formattedSeconds}
                      </span>
                      <span className="text-[11px] font-medium tracking-wide text-[#252B27]/60 dark:text-slate-400 uppercase mt-1">
                        {timeLeftSec >= 60 ? 'Minutes' : 'Seconds'}
                      </span>
                    </div>
                  </div>

                  {/* Primary Dial Buttons */}
                  <div className="flex items-center gap-3 mt-4 w-full max-w-xs justify-center">
                    <button
                      type="button"
                      onClick={handleStartPause}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#365C4B] hover:bg-[#2c4c3e] text-white font-medium text-sm shadow-sm transition-all cursor-pointer"
                    >
                      {isRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                      <span>{isRunning ? 'Pause' : 'Start'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#E4E1D9] dark:border-[#2D352F] bg-white dark:bg-[#1A201C] hover:bg-[#F7F6F2] dark:hover:bg-[#252D28] text-[#252B27] dark:text-slate-200 text-sm font-medium transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  </div>
                </div>

                {/* Quick Presets Vertical Stack */}
                <div className="sm:col-span-4 flex flex-col border-t sm:border-t-0 sm:border-l border-[#E4E1D9] dark:border-[#2D352F] sm:pl-4 pt-4 sm:pt-0">
                  <span className="text-[11px] font-bold text-[#252B27]/70 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Quick Presets
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-1 gap-1.5">
                    {data.featuredTool.presets.map((preset) => {
                      const isSelected = selectedPresetSec === preset.sec;
                      return (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => handleSelectPreset(preset.sec)}
                          className={`text-xs py-1.5 px-3 rounded-lg font-medium text-center transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-[#365C4B] text-white font-semibold shadow-xs'
                              : 'bg-[#F7F6F2] dark:bg-[#252D28] text-[#252B27] dark:text-slate-200 hover:bg-[#E7EDE7] dark:hover:bg-[#2d3731]'
                          }`}
                        >
                          {preset.label}
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

      {/* 4. EXPLORE ALL TOOLS GRID (ORGANIZED BY TRENDING, HOT & NEW) */}
      <section id="explore-tools" className="py-14 sm:py-20 border-b border-[#E4E1D9] dark:border-[#262D28]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 sm:mb-12">
            <div>
              <span className="text-[11px] font-bold tracking-widest text-[#365C4B] dark:text-[#5E917A] uppercase block mb-2">
                {data.toolsKicker} · ORGANIZED BY TRENDING, HOT &amp; NEW
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#252B27] dark:text-white">
                {data.toolsHeading}
              </h2>
            </div>

            {/* Interactive Trending / Hot / New Filter Tabs */}
            <div
              className="inline-flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-white dark:bg-[#1A201C] border border-[#E4E1D9] dark:border-[#2D352F] self-start lg:self-auto"
              role="tablist"
              aria-label="Filter category tools by Trending, Hot, or New"
            >
              {[
                { id: 'all', label: `All (${mergedCategoryTools.length})`, icon: null },
                { id: 'trending', label: 'Trending', icon: TrendingUp },
                { id: 'hot', label: 'Hot', icon: Flame },
                { id: 'new', label: 'New', icon: Sparkles },
              ].map((tab) => {
                const TabIcon = tab.icon;
                const active = tierFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setTierFilter(tab.id as 'all' | ToolTier)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      active
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
          </div>

          <div className="space-y-12">
            {organizedToolGroups
              .filter((group) => tierFilter === 'all' || group.id === tierFilter)
              .map((group) => (
                <div key={group.id} className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E4E1D9] dark:border-[#262D28]">
                    <div className="flex items-center gap-3">
                      <ToolTierTag tier={group.id} />
                      <h3 className="font-serif text-xl sm:text-2xl text-[#252B27] dark:text-white">
                        {group.title}
                      </h3>
                      <span className="text-xs font-mono text-[#252B27]/50 dark:text-slate-400">
                        ({group.tools.length})
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#252B27]/65 dark:text-slate-400">
                      {group.subtitle}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                    {group.tools.map((tool) => (
                      <Link prefetch={false}
                        key={tool.name}
                        href={tool.href}
                        className="bg-white dark:bg-[#1A201C] border border-[#E4E1D9] dark:border-[#2D352F] rounded-2xl p-5 sm:p-6 hover:border-[#365C4B] dark:hover:border-[#5E917A] hover:shadow-md transition-all flex flex-col justify-between group"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-3 mb-4">
                            <ToolIconBadge tool={tool.href || tool.name} size="md" />
                            {tool.tier && <ToolTierTag tier={tool.tier} />}
                          </div>
                          <h4 className="font-bold text-base sm:text-lg text-[#252B27] dark:text-white mb-1.5 group-hover:text-[#365C4B] dark:group-hover:text-[#5E917A] transition-colors">
                            {tool.name}
                          </h4>
                          <p className="text-xs sm:text-sm text-[#252B27]/70 dark:text-slate-400 leading-relaxed mb-4">
                            {tool.description}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-[#F0EDE6] dark:border-[#252D28] flex items-center justify-between text-xs sm:text-sm font-semibold text-[#365C4B] dark:text-[#5E917A]">
                          <span>Open {tool.name}</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* 5. AI OVERVIEW QUICK ANSWER & COMPARISON TABLE */}
      <section className="py-14 sm:py-20 bg-[#F7F6F2] dark:bg-[#141816] border-b border-[#E4E1D9] dark:border-[#262D28]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          {/* AI Overview Category Quick Answer Card */}
          <div
            id="category-quick-answer"
            data-ai-summary="true"
            className="mb-10 bg-white dark:bg-[#1A201C] rounded-2xl border border-[#E4E1D9] dark:border-[#2D352F] p-6 sm:p-8 shadow-sm"
          >
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-xl bg-[#E7EDE7] dark:bg-[#252E28] text-[#365C4B] dark:text-[#5E917A] flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold tracking-widest uppercase text-[#B7804C] dark:text-[#cda06f]">
                Quick Decision Summary · {data.tools.length} Free Browser Tools
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#252B27] dark:text-white mb-2.5">
              How to Choose the Best {data.title} Tool for Your Workflow
            </h2>
            <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed mb-4">
              {data.description} For the fastest start, launch <strong>{data.featuredTool.title}</strong> ({data.featuredTool.description.toLowerCase()}), or compare the specialized options in the matrix below:
              {data.comparisonTable.rows.slice(0, 3).map((r) => ` use ${r.tool} for ${r.bestFor.toLowerCase()}`).join('; ')}. Every tool runs 100% locally in your browser with zero login and drift-free timestamp accuracy.
            </p>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#252B27]/75 dark:text-slate-300">
              <span className="font-bold text-[#365C4B] dark:text-[#5E917A]">Top Picks:</span>
              {data.tools.slice(0, 5).map((t) => (
                <Link prefetch={false}
                  key={t.name}
                  href={t.href}
                  className="px-3 py-1 rounded-full bg-[#F7F6F2] dark:bg-[#252D28] border border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#365C4B] transition-colors font-medium"
                >
                  {t.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="max-w-3xl mb-8">
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#252B27] dark:text-white mb-3">
              {data.comparisonTable.title}
            </h2>
            <p className="text-sm sm:text-base text-[#252B27]/70 dark:text-slate-400 leading-relaxed">
              {data.comparisonTable.subtitle}
            </p>
          </div>

          <div className="rounded-2xl border border-[#E4E1D9] dark:border-[#2D352F] overflow-hidden bg-white dark:bg-[#1A201C] shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-[#365C4B] text-white">
                    <th scope="col" className="py-3.5 px-4 sm:px-6 font-semibold">Tool</th>
                    <th scope="col" className="py-3.5 px-4 sm:px-6 font-semibold">Best For</th>
                    <th scope="col" className="py-3.5 px-4 sm:px-6 font-semibold">Key Features</th>
                    <th scope="col" className="py-3.5 px-4 sm:px-6 font-semibold">Example Use Cases</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4E1D9] dark:divide-[#2D352F]">
                  {data.comparisonTable.rows.map((row, idx) => (
                    <tr
                      key={row.tool}
                      className={idx % 2 === 0 ? 'bg-transparent' : 'bg-[#F7F6F2]/50 dark:bg-[#1D2420]/50'}
                    >
                      <td className="py-3.5 px-4 sm:px-6 font-semibold text-[#252B27] dark:text-white whitespace-nowrap">
                        {row.tool}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-[#252B27]/80 dark:text-slate-300">
                        {row.bestFor}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-[#252B27]/80 dark:text-slate-300">
                        {row.keyFeatures}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-[#252B27]/70 dark:text-slate-400">
                        {row.exampleUseCases}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 6. LONG-FORM EDITORIAL SEO GUIDE */}
      <section className="py-16 sm:py-24 border-b border-[#E4E1D9] dark:border-[#262D28]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            {/* Left Sticky Sidebar: Table of Contents + Quick Tip */}
            <aside className="lg:col-span-4 space-y-6">
              <div className="sticky top-24 space-y-6">
                {/* On This Page Box */}
                <div className="bg-white dark:bg-[#1A201C] border border-[#E4E1D9] dark:border-[#2D352F] rounded-2xl p-6">
                  <span className="text-[11px] font-bold tracking-widest text-[#252B27]/60 dark:text-slate-400 uppercase block mb-1">
                    On This Page
                  </span>
                  <div className="font-serif text-lg font-bold text-[#252B27] dark:text-white mb-4">
                    {data.title} Guide
                  </div>
                  <nav aria-label="Table of contents">
                    <ul className="space-y-2 text-xs sm:text-sm">
                      {data.guide.tableOfContents.map((item, idx) => {
                        const sectionId = categoryTocSectionIds[idx] || `guide-section-${idx}`;
                        const isActive = activeTocIndex === idx;
                        return (
                          <li key={idx}>
                            <a
                              href={`#${sectionId}`}
                              onClick={(e) => handleTocClick(e, sectionId, idx)}
                              className={`flex items-center gap-2 py-1.5 px-2.5 -mx-2 rounded-lg transition-colors cursor-pointer ${
                                isActive
                                  ? 'font-bold text-[#252B27] dark:text-white bg-[#E7EDE7]/80 dark:bg-[#252E28]/80'
                                  : 'text-[#252B27]/80 dark:text-slate-300 hover:text-[#365C4B] dark:hover:text-[#5E917A] hover:bg-[#F7F6F2] dark:hover:bg-[#222924]'
                              }`}
                            >
                              <ChevronRight
                                className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                                  isActive ? 'text-[#365C4B] dark:text-[#5E917A] translate-x-0.5' : 'text-[#365C4B]/60'
                                }`}
                              />
                              <span>{item}</span>
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </nav>
                </div>

                {/* Quick Tip Callout */}
                <div className="bg-[#FAF6F0] dark:bg-[#202521] border border-[#E8DEC8] dark:border-[#353E37] rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-2 text-[#B7804C] dark:text-[#cda06f]">
                    <Lightbulb className="w-4 h-4 fill-current" />
                    <span className="font-bold text-xs uppercase tracking-wider">Practitioner Field Note</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#252B27]/80 dark:text-slate-300 leading-relaxed">
                    {data.guide.quickTip}
                  </p>
                </div>
              </div>
            </aside>

            {/* Right Reading Column */}
            <article className="lg:col-span-8 max-w-3xl">
              <div id="guide-overview" className="scroll-mt-28">
                <span className="text-[11px] font-bold tracking-widest text-[#365C4B] dark:text-[#5E917A] uppercase block mb-2">
                  {data.guide.kicker}
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] leading-tight font-normal text-[#252B27] dark:text-white mb-6">
                  {data.guide.title}
                </h2>
                <p className="text-base sm:text-lg text-[#252B27]/80 dark:text-slate-300 leading-relaxed mb-8">
                  {data.guide.lead}
                </p>
              </div>

              <div className="space-y-8">
                <div id="guide-what" className="scroll-mt-28">
                  <h3 className="font-serif text-2xl font-normal text-[#252B27] dark:text-white mb-3">
                    {data.guide.whatTitle}
                  </h3>
                  <p className="text-sm sm:text-base text-[#252B27]/80 dark:text-slate-300 leading-relaxed">
                    {data.guide.whatBody}
                  </p>
                </div>

                <div id="guide-how" className="scroll-mt-28">
                  <h3 className="font-serif text-2xl font-normal text-[#252B27] dark:text-white mb-3">
                    {data.guide.howTitle}
                  </h3>
                  <p className="text-sm sm:text-base text-[#252B27]/80 dark:text-slate-300 leading-relaxed">
                    {data.guide.howBody}
                  </p>
                </div>

                {/* Editorial Pull Quote */}
                <blockquote className="my-8 py-6 px-6 sm:px-8 rounded-2xl bg-[#FAF6F0] dark:bg-[#1E2420] border border-[#E4E1D9] dark:border-[#2D352F]">
                  <span className="block font-mono text-[10px] font-bold uppercase tracking-widest text-[#B7804C] dark:text-[#cda06f] mb-2">
                    Operational Principle
                  </span>
                  <p className="font-serif italic text-base sm:text-lg text-[#252B27] dark:text-white leading-relaxed">
                    {data.guide.quote}
                  </p>
                </blockquote>

                <div id="guide-practical" className="scroll-mt-28">
                  <h3 className="font-serif text-2xl font-normal text-[#252B27] dark:text-white mb-3">
                    {data.guide.practicalTitle}
                  </h3>
                  <ul className="space-y-2.5">
                    {data.guide.practicalItems.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm sm:text-base text-[#252B27]/80 dark:text-slate-300">
                        <span className="w-2 h-2 rounded-full bg-[#365C4B] mt-2 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div id="guide-tips" className="scroll-mt-28">
                  <h3 className="font-serif text-2xl font-normal text-[#252B27] dark:text-white mb-3">
                    {data.guide.tipsTitle}
                  </h3>
                  <ul className="space-y-2.5">
                    {data.guide.tipsItems.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm sm:text-base text-[#252B27]/80 dark:text-slate-300">
                        <span className="w-2 h-2 rounded-full bg-[#B7804C] mt-2 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div id="guide-mistakes" className="scroll-mt-28">
                  <h3 className="font-serif text-2xl font-normal text-[#252B27] dark:text-white mb-3">
                    {data.guide.mistakesTitle}
                  </h3>
                  <ul className="space-y-2.5">
                    {data.guide.mistakesItems.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm sm:text-base text-[#252B27]/80 dark:text-slate-300">
                        <span className="w-2 h-2 rounded-full bg-slate-400 mt-2 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS (FAQ Accordion) */}
      <section
        id="frequently-asked-questions"
        className="py-14 sm:py-20 bg-[#F7F6F2] dark:bg-[#141816] border-b border-[#E4E1D9] dark:border-[#262D28] scroll-mt-24"
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="mb-10 sm:mb-12">
            <span className="text-[11px] font-bold tracking-widest text-[#B7804C] dark:text-[#cda06f] uppercase block mb-2">
              Technical &amp; Operational Reference
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#252B27] dark:text-white">
              {data.title}: Common Questions &amp; Field Answers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.faqs.map((faq, idx) => {
              const isExpanded = expandedFaqIndex === idx;
              return (
                <div
                  key={faq.q}
                  className="bg-white dark:bg-[#1A201C] border border-[#E4E1D9] dark:border-[#2D352F] rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    aria-expanded={isExpanded}
                    onClick={() => setExpandedFaqIndex(isExpanded ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left text-sm sm:text-base font-semibold text-[#252B27] dark:text-white hover:text-[#365C4B] transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <span className="ml-4 shrink-0 text-[#365C4B] dark:text-[#5E917A]">
                      {isExpanded ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </span>
                  </button>

                  <div
                    className={
                      isExpanded
                        ? 'px-5 pb-5 pt-3 text-xs sm:text-sm text-[#252B27]/75 dark:text-slate-300 leading-relaxed border-t border-[#E4E1D9]/40 dark:border-[#2D352F]/40 block'
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

      {/* 8. RELATED CATEGORIES */}
      <section className="py-14 sm:py-20">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="mb-8">
            <span className="text-[11px] font-bold tracking-widest text-[#365C4B] dark:text-[#5E917A] uppercase block mb-1">
              Explore More
            </span>
            <h2 className="font-serif text-3xl font-normal text-[#252B27] dark:text-white">
              Related Categories
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {data.relatedCategories.map((cat) => (
              <Link prefetch={false}
                key={cat.title}
                href={cat.href}
                className="bg-white dark:bg-[#1A201C] border border-[#E4E1D9] dark:border-[#2D352F] rounded-2xl p-6 hover:border-[#365C4B] dark:hover:border-[#5E917A] hover:shadow-md transition-all flex items-start gap-4 group"
              >
                <ToolIconBadge tool={cat.title} size="md" />
                <div className="flex-1">
                  <h3 className="font-bold text-base text-[#252B27] dark:text-white group-hover:text-[#365C4B] transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-[#252B27]/70 dark:text-slate-400 mt-1 mb-3">
                    {cat.description}
                  </p>
                  <span className="text-xs font-semibold text-[#365C4B] dark:text-[#5E917A] inline-flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                    <span>Open {cat.title}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

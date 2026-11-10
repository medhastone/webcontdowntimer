'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ToolDefinition,
  getRelatedTools,
  getToolCanonicalPath,
} from '@/lib/tools-registry';
import {
  getToolEditorialData,
  ToolEditorialData,
} from '@/lib/tool-editorial-data';
import SEOStructuredData from '@/components/common/SEOStructuredData';
import InformationProvenanceBox from '@/components/common/InformationProvenanceBox';
import ArchetypeArticleSections from '@/components/common/ArchetypeArticleSections';
import {
  ChevronRight,
  Plus,
  Minus,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  Clock,
  Hourglass,
  GraduationCap,
  Users,
  Volume2,
  Tv,
  Presentation,
  Flame,
  Globe,
  Calculator,
  RotateCcw,
  Monitor,
  Palette,
  CheckSquare,
  Sparkles,
  Droplets,
  Leaf,
  Heart,
  Moon,
} from 'lucide-react';

interface ToolPageLayoutProps {
  tool: ToolDefinition;
  children: React.ReactNode;
}

// Icon resolver helper
function renderEditorialIcon(iconName: string, className = 'w-5 h-5') {
  switch (iconName) {
    case 'GraduationCap':
      return <GraduationCap className={className} />;
    case 'Monitor':
      return <Monitor className={className} />;
    case 'Palette':
      return <Palette className={className} />;
    case 'CheckSquare':
      return <CheckSquare className={className} />;
    case 'Clock':
      return <Clock className={className} />;
    case 'Hourglass':
      return <Hourglass className={className} />;
    case 'Tv':
      return <Tv className={className} />;
    case 'Presentation':
      return <Presentation className={className} />;
    case 'Users':
      return <Users className={className} />;
    case 'Volume2':
      return <Volume2 className={className} />;
    case 'Globe':
      return <Globe className={className} />;
    case 'Calculator':
      return <Calculator className={className} />;
    case 'Flame':
      return <Flame className={className} />;
    case 'Droplets':
      return <Droplets className={className} />;
    case 'Heart':
      return <Heart className={className} />;
    case 'RotateCcw':
    default:
      return <RotateCcw className={className} />;
  }
}

function slugifySectionId(text: string, fallbackIndex: number): string {
  const slug = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || `section-${fallbackIndex}`;
}

export default function ToolPageLayout({ tool, children }: ToolPageLayoutProps) {
  const editorial: ToolEditorialData = getToolEditorialData(tool);
  const relatedTools = getRelatedTools(tool.slug, 4);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [activeTocIndex, setActiveTocIndex] = useState<number>(0);

  const tocIds = editorial.guide.tableOfContents.map((item, idx) =>
    slugifySectionId(item, idx)
  );
  const faqSectionId = tocIds[tocIds.length - 1] || 'frequently-asked-questions';

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

  const canonicalPath = getToolCanonicalPath(tool.slug);

  // SEO breadcrumb schema
  const breadcrumbs = [
    { name: 'Home', item: 'https://WebCountDownTimer.com/' },
    { name: editorial.categoryLabel, item: `https://WebCountDownTimer.com/category/${editorial.categorySlug}` },
    { name: tool.name, item: `https://WebCountDownTimer.com${canonicalPath}` },
  ];

  return (
    <div className="min-h-screen bg-[#F7F6F2] dark:bg-[#141816] text-[#252B27] dark:text-slate-100 transition-colors">
      <SEOStructuredData
        toolName={tool.name}
        description={tool.description}
        url={`https://WebCountDownTimer.com${canonicalPath}`}
        faqs={tool.faq}
        breadcrumbs={breadcrumbs}
        steps={editorial.steps}
        categoryLabel={editorial.categoryLabel}
      />

      {/* 1. BREADCRUMB BAR */}
      <nav
        aria-label="Breadcrumb"
        className={
          tool.slug === 'moon-timer'
            ? 'border-b border-[#1A2D4A] bg-[#071020] text-slate-300'
            : 'border-b border-[#E4E1D9] dark:border-[#262D28] bg-white/60 dark:bg-[#181D1A]/60'
        }
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-3">
          <ol
            className={`flex items-center flex-wrap gap-2 text-xs ${
              tool.slug === 'moon-timer'
                ? 'text-slate-300/80'
                : 'text-[#252B27]/70 dark:text-slate-400'
            }`}
          >
            <li>
              <Link
                href="/"
                className={
                  tool.slug === 'moon-timer'
                    ? 'hover:text-white transition-colors'
                    : 'hover:text-[#365C4B] dark:hover:text-[#5E917A] transition-colors'
                }
              >
                Home
              </Link>
            </li>
            <li className={tool.slug === 'moon-timer' ? 'text-slate-500' : 'text-[#252B27]/30 dark:text-slate-600'}>›</li>
            <li>
              <Link
                href={`/category/${editorial.categorySlug}`}
                className={
                  tool.slug === 'moon-timer'
                    ? 'hover:text-white transition-colors'
                    : 'hover:text-[#365C4B] dark:hover:text-[#5E917A] transition-colors'
                }
              >
                {editorial.categoryLabel}
              </Link>
            </li>
            <li className={tool.slug === 'moon-timer' ? 'text-slate-500' : 'text-[#252B27]/30 dark:text-slate-600'}>›</li>
            <li className={tool.slug === 'moon-timer' ? 'text-white font-medium' : 'text-[#252B27] dark:text-white font-medium'}>
              {tool.slug === 'world-clock'
                ? 'World Clock and Time-Zone Converter'
                : tool.slug === 'time-duration-calculator'
                ? 'Time Duration Calculator'
                : tool.name}
            </li>
          </ol>
        </div>
      </nav>

      {/* 2. SECTION 1 — TOOL INTRODUCTION & HERO */}
      <section
        className={`pt-8 pb-10 sm:pt-12 sm:pb-12 border-b ${
          tool.slug === 'moon-timer'
            ? 'bg-gradient-to-r from-[#071020] via-[#0B1930] to-[#122646] border-[#1A2D4A] text-white relative overflow-hidden'
            : 'border-[#E4E1D9] dark:border-[#262D28]'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-8">
              <span
                className={`text-[11px] font-bold tracking-widest uppercase block mb-1 ${
                  tool.slug === 'moon-timer'
                    ? 'text-[#F6AD3C]'
                    : tool.slug === 'coral-timer'
                    ? 'text-[#F35B4F]'
                    : tool.slug === 'lichen-timer'
                    ? 'text-[#2E5A36]'
                    : tool.slug === 'frost-timer' || tool.slug === 'snow-timer'
                    ? 'text-[#0968B8]'
                    : tool.slug === 'galaxy-timer'
                    ? 'text-[#4C1D95] dark:text-purple-300'
                    : tool.slug === 'lava-lamp-timer'
                    ? 'text-[#881D58] dark:text-pink-300'
                    : tool.slug === 'spinner-timer'
                    ? 'text-[#1F7A3A] dark:text-emerald-400'
                    : tool.slug === 'sun-timer' || tool.slug === 'bubble-timer'
                    ? 'text-[#E65F16]'
                    : 'text-[#B7804C] dark:text-[#cda06f]'
                }`}
              >
                {tool.slug === 'visual-timer'
                  ? 'VISUAL TIMER'
                  : tool.slug === 'sand-timer'
                  ? 'SAND TIMER'
                  : tool.slug === 'liquid-timer'
                  ? 'LIQUID TIMER'
                  : tool.slug === 'rainbow-timer'
                  ? 'RAINBOW TIMER'
                  : tool.slug === 'hourglass-timer'
                  ? 'HOURGLASS TIMER'
                  : tool.slug === 'circular-timer'
                  ? 'CIRCULAR TIMER'
                  : tool.slug === 'radial-timer'
                  ? 'RADIAL TIMER'
                  : tool.slug === 'rings-timer'
                  ? 'RINGS TIMER'
                  : tool.slug === 'progress-timer'
                  ? 'PROGRESS TIMER'
                  : tool.slug === 'pixel-timer'
                  ? 'PIXEL TIMER'
                  : tool.slug === 'blocks-timer'
                  ? 'BLOCKS TIMER'
                  : tool.slug === 'candle-timer'
                  ? 'CANDLE TIMER'
                  : tool.slug === 'aesthetic-timer'
                  ? 'AESTHETIC TIMER'
                  : tool.slug === 'picture-reveal-timer'
                  ? 'PICTURE REVEAL TIMER'
                  : tool.slug === 'heart-timer'
                  ? 'HEART TIMER'
                  : tool.slug === 'moon-timer'
                  ? 'MOON TIMER'
                  : tool.slug === 'sun-timer'
                  ? 'SUN TIMER'
                  : tool.slug === 'bubble-timer'
                  ? 'BUBBLE TIMER'
                  : tool.slug === 'coral-timer'
                  ? 'CORAL TIMER'
                  : tool.slug === 'lichen-timer'
                  ? 'LICHEN TIMER'
                  : tool.slug === 'frost-timer'
                  ? 'FROST TIMER'
                  : tool.slug === 'snow-timer'
                  ? 'SNOW TIMER'
                  : tool.slug === 'galaxy-timer'
                  ? 'GALAXY TIMER'
                  : tool.slug === 'lava-lamp-timer'
                  ? 'LAVA LAMP TIMER'
                  : tool.slug === 'spinner-timer'
                  ? 'SPINNER TIMER'
                  : tool.slug === 'world-clock'
                  ? 'WORLD CLOCK'
                  : tool.slug === 'time-duration-calculator'
                  ? 'TIME CALCULATOR'
                  : tool.categoryLabel.toUpperCase()}
              </span>
              <h1
                className={`font-serif text-4xl sm:text-5xl lg:text-[56px] leading-[1.08] font-normal tracking-tight mb-4 ${
                  tool.slug === 'moon-timer'
                    ? 'text-white font-bold'
                    : tool.slug === 'sun-timer' || tool.slug === 'bubble-timer' || tool.slug === 'coral-timer' || tool.slug === 'lichen-timer' || tool.slug === 'frost-timer' || tool.slug === 'snow-timer' || tool.slug === 'galaxy-timer' || tool.slug === 'lava-lamp-timer' || tool.slug === 'spinner-timer'
                    ? 'text-[#0E2338] dark:text-white font-bold'
                    : 'text-[#252B27] dark:text-white'
                }`}
              >
                {tool.slug === 'visual-timer'
                  ? 'Visual Timer Online'
                  : tool.slug === 'sand-timer'
                  ? 'Free Online Sand Timer'
                  : tool.slug === 'liquid-timer'
                  ? 'Free Online Liquid Timer'
                  : tool.slug === 'rainbow-timer'
                  ? 'Free Online Rainbow Timer'
                  : tool.slug === 'hourglass-timer'
                  ? 'Free Online Hourglass Timer'
                  : tool.slug === 'circular-timer'
                  ? 'Free Online Circular Timer'
                  : tool.slug === 'radial-timer'
                  ? 'Free Online Radial Timer'
                  : tool.slug === 'rings-timer'
                  ? 'Free Online Rings Timer'
                  : tool.slug === 'progress-timer'
                  ? 'Free Online Progress Timer'
                  : tool.slug === 'pixel-timer'
                  ? 'Free Online Pixel Timer'
                  : tool.slug === 'blocks-timer'
                  ? 'Free Online Blocks Timer'
                  : tool.slug === 'candle-timer'
                  ? 'Free Online Candle Timer'
                  : tool.slug === 'aesthetic-timer'
                  ? 'Aesthetic Timer – A Beautiful Online Countdown'
                  : tool.slug === 'picture-reveal-timer'
                  ? 'Free Online Picture Reveal Timer'
                  : tool.slug === 'heart-timer'
                  ? 'Free Online Heart Timer'
                  : tool.slug === 'moon-timer'
                  ? 'Free Online Moon Timer'
                  : tool.slug === 'sun-timer'
                  ? 'Free Online Sun Timer'
                  : tool.slug === 'bubble-timer'
                  ? 'Free Online Bubble Timer'
                  : tool.slug === 'coral-timer'
                  ? 'Free Online Coral Timer'
                  : tool.slug === 'lichen-timer'
                  ? 'Free Online Lichen Timer'
                  : tool.slug === 'frost-timer'
                  ? 'Free Online Frost Timer'
                  : tool.slug === 'snow-timer'
                  ? 'Free Online Snow Timer'
                  : tool.slug === 'galaxy-timer'
                  ? 'Free Online Galaxy Timer'
                  : tool.slug === 'lava-lamp-timer'
                  ? 'Free Online Lava Lamp Timer'
                  : tool.slug === 'spinner-timer'
                  ? 'Free Online Spinner Timer'
                  : tool.slug === 'world-clock'
                  ? 'World Clock and Time-Zone Converter'
                  : tool.name}
              </h1>
              <p
                className={`text-base sm:text-lg leading-relaxed max-w-2xl mb-6 ${
                  tool.slug === 'moon-timer'
                    ? 'text-slate-200/90'
                    : 'text-[#252B27]/80 dark:text-slate-300'
                }`}
              >
                {editorial.heroSubtitle}
              </p>

              {/* Feature Pills matching screenshot (only if pills provided) */}
              {editorial.featurePills && editorial.featurePills.length > 0 && (
                <div
                  className={`flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs sm:text-sm font-medium ${
                    tool.slug === 'moon-timer'
                      ? 'text-slate-200'
                      : 'text-[#252B27]/85 dark:text-slate-300'
                  }`}
                >
                  {editorial.featurePills.map((pill, idx) => (
                    <div
                      key={idx}
                      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full shadow-2xs ${
                        tool.slug === 'moon-timer'
                          ? 'bg-[#10203B]/90 border border-[#243B61] text-slate-100'
                          : 'bg-white dark:bg-[#1A201C] border border-[#E4E1D9] dark:border-[#2D352F]'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          tool.slug === 'moon-timer'
                            ? 'bg-[#F6AD3C]'
                            : 'bg-[#365C4B] dark:bg-[#5E917A]'
                        }`}
                      />
                      <span>{pill}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Editorial Hero Desk Artwork with Motivational Notebook / Chalkboard */}
            <div className="lg:col-span-4">
              <div className="relative rounded-2xl overflow-hidden border border-[#E4E1D9] dark:border-[#2D352F] shadow-md aspect-4/3 bg-[#E7EDE7]/30">
                <Image
                  src={editorial.heroImage.src}
                  alt={editorial.heroImage.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  priority
                  referrerPolicy="no-referrer"
                />
                {tool.slug === 'rainbow-timer' ? (
                  <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/25 flex items-center justify-end p-4 gap-3">
                    {/* Framed Chalkboard Sign "Small Steps Bright Days" with Rainbow */}
                    <div className="bg-[#2B302C] border-[6px] border-[#C89D66] rounded-xl px-4 py-3 shadow-lg text-center relative w-36 sm:w-40 shrink-0 -rotate-2">
                      <div className="font-serif italic text-white/95 text-sm sm:text-base leading-snug space-y-0.5">
                        <div>Small</div>
                        <div>Steps</div>
                        <div>Bright</div>
                        <div>Days</div>
                      </div>
                      {/* Mini Chalk Rainbow in bottom right of chalkboard */}
                      <svg viewBox="0 0 60 34" className="w-12 h-7 ml-auto mt-1">
                        <path d="M 6 30 A 24 24 0 0 1 54 30" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
                        <path d="M 10 30 A 20 20 0 0 1 50 30" fill="none" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" />
                        <path d="M 14 30 A 16 16 0 0 1 46 30" fill="none" stroke="#FACC15" strokeWidth="2.5" strokeLinecap="round" />
                        <path d="M 18 30 A 12 12 0 0 1 42 30" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" />
                        <path d="M 22 30 A 8 8 0 0 1 38 30" fill="none" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
                        <path d="M 26 30 A 4 4 0 0 1 34 30" fill="none" stroke="#A855F7" strokeWidth="2.5" strokeLinecap="round" />
                      </svg>
                    </div>
                    {/* Stacked Books on Right */}
                    <div className="hidden sm:flex flex-col justify-end self-end space-y-1 w-28">
                      <div className="bg-[#DCE6DF] text-[#252B27] text-[10px] font-serif font-bold px-2.5 py-1 rounded-l-md border-l-4 border-[#365C4B] shadow-xs truncate">
                        Kind People
                      </div>
                      <div className="bg-[#EFECE6] text-[#252B27] text-[10px] font-serif italic px-2.5 py-1 rounded-l-md border-l-4 border-[#B7804C] shadow-xs truncate">
                        Creative Minds
                      </div>
                      <div className="bg-[#F3DFC8] text-[#252B27] text-[10px] font-serif font-semibold px-2.5 py-1 rounded-l-md border-l-4 border-[#D97706] shadow-xs truncate">
                        Brighter Tomorrow
                      </div>
                    </div>
                  </div>
                ) : tool.slug === 'hourglass-timer' ? (
                  <div className="absolute inset-0 bg-gradient-to-r from-black/15 via-transparent to-black/25 flex items-center justify-end p-4 gap-3">
                    {/* Framed Wooden Sign "Good Things Take Time" */}
                    <div className="bg-[#EFE8DB] dark:bg-[#221F1A] border-[6px] border-[#C89D66] rounded-xl px-4 py-3 shadow-lg text-center relative w-32 sm:w-36 shrink-0">
                      <div className="font-serif text-[#252B27] dark:text-white text-sm sm:text-base leading-snug space-y-0.5">
                        <div>Good</div>
                        <div>Things</div>
                        <div>Take</div>
                        <div>Time</div>
                      </div>
                    </div>
                  </div>
                ) : tool.slug === 'circular-timer' ? (
                  <div className="absolute inset-0 bg-gradient-to-r from-black/15 via-transparent to-black/25 flex items-center justify-end p-4 gap-3">
                    {/* Framed Wooden Sign "Focus Plan Do Repeat" */}
                    <div className="bg-[#EFE8DB] dark:bg-[#221F1A] border-[6px] border-[#C89D66] rounded-xl px-4 py-3 shadow-lg text-center relative w-32 sm:w-36 shrink-0 -rotate-1">
                      <div className="font-serif text-[#252B27] dark:text-white text-sm sm:text-base leading-snug space-y-0.5">
                        <div>Focus</div>
                        <div>Plan</div>
                        <div>Do</div>
                        <div>Repeat</div>
                      </div>
                    </div>
                  </div>
                ) : tool.slug === 'radial-timer' ? (
                  <div className="absolute inset-0 bg-gradient-to-r from-black/15 via-transparent to-black/25 flex items-center justify-end p-4 gap-3">
                    {/* Framed Wooden Sign "Focus Breathe Learn Grow" */}
                    <div className="bg-[#EFE8DB] dark:bg-[#221F1A] border-[6px] border-[#C89D66] rounded-xl px-4 py-3 shadow-lg text-center relative w-32 sm:w-36 shrink-0 -rotate-1">
                      <div className="font-serif text-[#252B27] dark:text-white text-sm sm:text-base leading-snug space-y-0.5">
                        <div>Focus</div>
                        <div>Breathe</div>
                        <div>Learn</div>
                        <div>Grow</div>
                      </div>
                    </div>
                  </div>
                ) : tool.slug === 'rings-timer' ? (
                  <div className="absolute inset-0 bg-gradient-to-r from-black/15 via-transparent to-black/25 flex items-center justify-end p-4 gap-3">
                    {/* Framed Wooden Sign "Focus Time Progress Achieve" + 3 mini concentric ring icons matching mockup */}
                    <div className="bg-[#EFE8DB] dark:bg-[#221F1A] border-[6px] border-[#C89D66] rounded-xl px-3.5 py-2.5 shadow-lg flex items-center gap-3 relative shrink-0 -rotate-1">
                      <div className="font-serif italic text-[#252B27] dark:text-white text-xs sm:text-sm leading-snug space-y-0.5 text-center">
                        <div>Focus</div>
                        <div>Time</div>
                        <div>Progress</div>
                        <div>Achieve</div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <svg viewBox="0 0 24 24" className="w-6 h-6">
                          <circle cx="12" cy="12" r="9.5" fill="none" stroke="#22C55E" strokeWidth="2" />
                          <circle cx="12" cy="12" r="6.5" fill="none" stroke="#3B82F6" strokeWidth="2" />
                          <circle cx="12" cy="12" r="3.5" fill="none" stroke="#F97316" strokeWidth="2" />
                        </svg>
                        <svg viewBox="0 0 24 24" className="w-6 h-6">
                          <circle cx="12" cy="12" r="9.5" fill="none" stroke="#16A34A" strokeWidth="2" />
                          <circle cx="12" cy="12" r="6.5" fill="none" stroke="#EAB308" strokeWidth="2" />
                          <circle cx="12" cy="12" r="3.5" fill="none" stroke="#EF4444" strokeWidth="2" />
                        </svg>
                        <svg viewBox="0 0 24 24" className="w-6 h-6">
                          <circle cx="12" cy="12" r="9.5" fill="none" stroke="#8B5CF6" strokeWidth="2" />
                          <circle cx="12" cy="12" r="6.5" fill="none" stroke="#EC4899" strokeWidth="2" />
                          <circle cx="12" cy="12" r="3.5" fill="none" stroke="#06B6D4" strokeWidth="2" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ) : tool.slug === 'progress-timer' ? (
                  <div className="absolute inset-0 bg-gradient-to-r from-black/15 via-transparent to-black/25 flex items-center justify-end p-4 gap-3">
                    {/* Framed Wooden Sign "Plan Focus Progress Achieve" + 4 colored square checkboxes matching mockup */}
                    <div className="bg-[#EFE8DB] dark:bg-[#221F1A] border-[6px] border-[#C89D66] rounded-xl px-4 py-3 shadow-lg flex items-center gap-3.5 relative shrink-0 -rotate-1">
                      <div className="font-serif italic text-[#252B27] dark:text-white text-xs sm:text-sm leading-snug space-y-1 text-left">
                        <div>Plan</div>
                        <div>Focus</div>
                        <div>Progress</div>
                        <div>Achieve</div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className="w-3.5 h-3.5 rounded-[3px] border-2 border-[#E0533C]" />
                        <span className="w-3.5 h-3.5 rounded-[3px] border-2 border-[#F59E0B]" />
                        <span className="w-3.5 h-3.5 rounded-[3px] border-2 border-[#22C55E]" />
                        <span className="w-3.5 h-3.5 rounded-[3px] border-2 border-[#2563EB]" />
                      </div>
                    </div>
                  </div>
                ) : tool.slug === 'pixel-timer' ? (
                  <div className="absolute inset-0 bg-gradient-to-r from-black/15 via-transparent to-black/30 flex items-center justify-end p-4 gap-2">
                    {/* Wooden Framed Retro Dark LED Sign "FOCUS PLAY LEARN REPEAT" matching mockup */}
                    <div className="bg-[#232624] border-[6px] border-[#C89D66] rounded-xl px-4 py-3 shadow-lg relative shrink-0 -rotate-1">
                      <div className="font-mono font-bold tracking-widest text-[#FDE68A] text-xs sm:text-sm leading-snug space-y-1 text-left drop-shadow-[0_0_6px_rgba(253,230,138,0.45)]">
                        <div>FOCUS</div>
                        <div>PLAY</div>
                        <div>LEARN</div>
                        <div>REPEAT</div>
                      </div>
                    </div>
                    {/* Cute 8-bit Pixel Mascot on Bottom Right matching mockup */}
                    <svg viewBox="0 0 12 12" className="w-11 h-11 self-end -mb-1 drop-shadow-md shrink-0" shapeRendering="crispEdges">
                      <rect x="2" y="1" width="2" height="2" fill="#D97706" />
                      <rect x="8" y="1" width="2" height="2" fill="#D97706" />
                      <rect x="2" y="3" width="8" height="5" fill="#F59E0B" />
                      <rect x="3" y="4" width="6" height="4" fill="#FDE68A" />
                      <rect x="3" y="4" width="1" height="2" fill="#1E293B" />
                      <rect x="8" y="4" width="1" height="2" fill="#1E293B" />
                      <rect x="5" y="6" width="2" height="1" fill="#1E293B" />
                      <rect x="3" y="8" width="6" height="3" fill="#EA580C" />
                      <rect x="4" y="8" width="4" height="2" fill="#FEF3C7" />
                    </svg>
                  </div>
                ) : tool.slug === 'blocks-timer' ? (
                  <div className="absolute inset-0 bg-gradient-to-r from-black/15 via-transparent to-black/30 flex items-center justify-end p-4 gap-3">
                    {/* Framed Chalkboard Sign "One Block Closer to Your Goal!" matching mockup */}
                    <div className="bg-[#232624] border-[6px] border-[#C89D66] rounded-xl px-4 py-2.5 shadow-lg text-center relative shrink-0 -rotate-1">
                      <div className="font-serif italic text-white/95 text-xs sm:text-sm leading-snug space-y-0.5">
                        <div>One</div>
                        <div>Block</div>
                        <div>Closer</div>
                        <div>to Your</div>
                        <div>Goal!</div>
                      </div>
                    </div>
                    {/* Mini Stack of 5 Colorful Wooden Blocks on Right matching mockup */}
                    <div className="flex flex-col items-center self-end mb-1 shrink-0 drop-shadow-md">
                      {[
                        { front: '#E53935', side: '#B71C1C', top: '#EF5350' },
                        { front: '#FB8C00', side: '#E65100', top: '#FFA726' },
                        { front: '#FDD835', side: '#F57F17', top: '#FFEE58' },
                        { front: '#43A047', side: '#1B5E20', top: '#66BB6A' },
                        { front: '#1E88E5', side: '#0D47A1', top: '#42A5F5' },
                      ].map((blk, i) => (
                        <div key={i} className="w-11 h-3.5 relative -mt-0.5 first:mt-0">
                          <div
                            className="w-full h-full rounded-[2px] border-b border-black/15"
                            style={{ backgroundColor: blk.front }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : tool.slug === 'candle-timer' ? (
                  <div className="absolute inset-0 bg-gradient-to-r from-black/15 via-transparent to-black/25 flex items-center justify-end p-4 gap-3">
                    {/* Framed Wooden Sign "Focus Relax Read Breathe Be Present" + botanical stem matching mockup */}
                    <div className="bg-[#EFE8DB] dark:bg-[#221F1A] border-[6px] border-[#C89D66] rounded-xl px-4 py-2.5 shadow-lg flex items-center gap-3 relative shrink-0 -rotate-1">
                      <div className="font-serif italic text-[#252B27] dark:text-white text-xs sm:text-sm leading-snug space-y-0.5 text-center">
                        <div>Focus</div>
                        <div>Relax</div>
                        <div>Read</div>
                        <div>Breathe</div>
                        <div>Be Present</div>
                      </div>
                      {/* Botanical leaf stem SVG */}
                      <svg viewBox="0 0 28 70" className="w-6 h-16 text-[#B7895B] shrink-0">
                        <path
                          d="M14 66 C14 46, 15 26, 17 8"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          fill="none"
                          strokeLinecap="round"
                        />
                        <path d="M15 48 C8 46, 6 40, 12 39 C15 39, 15 44, 15 48 Z" fill="currentColor" opacity="0.7" />
                        <path d="M15 40 C22 38, 24 32, 18 31 C15 31, 15 36, 15 40 Z" fill="currentColor" opacity="0.7" />
                        <path d="M16 30 C9 28, 7 22, 13 21 C16 21, 16 26, 16 30 Z" fill="currentColor" opacity="0.7" />
                        <path d="M16 22 C23 20, 25 14, 19 13 C16 13, 16 18, 16 22 Z" fill="currentColor" opacity="0.7" />
                      </svg>
                    </div>
                  </div>
                ) : tool.slug === 'aesthetic-timer' ? (
                  <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/25 flex items-end justify-end p-3.5 gap-2.5">
                    {/* Stacked Cream Books on Left of Sign matching mockup */}
                    <div className="hidden sm:flex flex-col items-center self-end mb-0.5 space-y-0.5 w-24 shrink-0">
                      <div className="w-20 bg-[#EDE2CF] text-[#3B2F24] text-[9px] font-serif font-bold py-0.5 px-2 rounded-xs border-b border-[#C6B295] text-center shadow-2xs">
                        Focus
                      </div>
                      <div className="w-22 bg-[#E5D6BE] text-[#3B2F24] text-[9px] font-serif font-bold py-0.5 px-2 rounded-xs border-b border-[#BBA485] text-center shadow-2xs">
                        Create
                      </div>
                      <div className="w-24 bg-[#DECBAEE6] text-[#3B2F24] text-[9px] font-serif font-bold py-0.5 px-2 rounded-xs border-b border-[#B09776] text-center shadow-2xs">
                        Do Good
                      </div>
                      <div className="w-24 bg-[#D4BC9B] text-[#3B2F24] text-[9px] font-serif font-bold py-0.5 px-2 rounded-xs text-center shadow-xs">
                        Take Breaks
                      </div>
                    </div>
                    {/* Framed Wooden Sign "Good Focus Good Progress A Better You" + botanical stem matching mockup */}
                    <div className="bg-[#EFE8DB] dark:bg-[#221F1A] border-[6px] border-[#B6824C] rounded-xl px-3.5 py-2.5 shadow-lg flex items-center gap-2.5 relative shrink-0 -rotate-1">
                      <div className="font-serif italic text-[#252B27] dark:text-white text-xs sm:text-sm leading-snug space-y-0.5 text-center">
                        <div>Good</div>
                        <div>Focus</div>
                        <div>Good</div>
                        <div>Progress</div>
                        <div>A Better You</div>
                      </div>
                      <svg viewBox="0 0 28 70" className="w-6 h-16 text-[#B7895B] shrink-0">
                        <path
                          d="M14 66 C14 46, 15 26, 17 8"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          fill="none"
                          strokeLinecap="round"
                        />
                        <path d="M15 48 C8 46, 6 40, 12 39 C15 39, 15 44, 15 48 Z" fill="currentColor" opacity="0.7" />
                        <path d="M15 40 C22 38, 24 32, 18 31 C15 31, 15 36, 15 40 Z" fill="currentColor" opacity="0.7" />
                        <path d="M16 30 C9 28, 7 22, 13 21 C16 21, 16 26, 16 30 Z" fill="currentColor" opacity="0.7" />
                        <path d="M16 22 C23 20, 25 14, 19 13 C16 13, 16 18, 16 22 Z" fill="currentColor" opacity="0.7" />
                      </svg>
                    </div>
                  </div>
                ) : tool.slug === 'picture-reveal-timer' ? (
                  <div className="absolute inset-0 bg-gradient-to-r from-black/15 via-transparent to-black/30 flex items-center justify-end p-4 gap-3">
                    {/* Framed Chalkboard Sign "Turn Time Into Surprises!" + chalk lightbulb matching mockup */}
                    <div className="bg-[#232624] border-[6px] border-[#C89D66] rounded-xl px-4 py-3 shadow-lg flex items-center gap-3 relative shrink-0 -rotate-1">
                      <div className="font-serif italic text-white/95 text-xs sm:text-sm leading-snug space-y-0.5 text-left">
                        <div>Turn</div>
                        <div>Time</div>
                        <div>Into</div>
                        <div>Surprises!</div>
                      </div>
                      {/* Chalk Lightbulb with Rays */}
                      <svg viewBox="0 0 36 36" className="w-8 h-8 text-white/90 shrink-0">
                        <circle cx="18" cy="16" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M15 22 L21 22 M16 25 L20 25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path
                          d="M18 5 L18 7 M28 9 L26.5 10.5 M31 16 L29 16 M28 23 L26.5 21.5 M8 9 L9.5 10.5 M5 16 L7 16 M8 23 L9.5 21.5"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>
                ) : tool.slug === 'heart-timer' ? (
                  /* Custom Wooden Heart Plaque + Ceramic Cup with Heart matching reference image */
                  <div className="absolute inset-0 bg-gradient-to-r from-[#F7F6F2]/85 via-[#FBF4F2]/40 to-transparent dark:from-[#141816]/85 flex items-end justify-end p-3 sm:p-4 gap-2.5">
                    {/* Wooden Heart Plaque ("Small Steps Big Dreams ♡") */}
                    <div className="relative w-32 h-28 flex items-center justify-center shrink-0 drop-shadow-md">
                      <svg viewBox="0 0 140 125" className="w-full h-full">
                        <path
                          d="M 70 118 C 52 103 10 74 10 40 C 10 18 28 6 48 6 C 60 6 66 13 70 21 C 74 13 80 6 92 6 C 112 6 130 18 130 40 C 130 74 88 103 70 118 Z"
                          fill="#EED9CE"
                          stroke="#D5B8A8"
                          strokeWidth="3"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center font-serif italic text-[#3B2624] text-[11px] leading-tight pt-1">
                        <span>Small</span>
                        <span>Steps</span>
                        <span>Big Dreams</span>
                        <span className="text-[#D43753] text-xs not-italic mt-0.5">♡</span>
                      </div>
                    </div>

                    {/* Blush Ceramic Cup with Heart */}
                    <div className="relative flex items-center shrink-0 mb-1">
                      <div className="w-14 h-12 rounded-b-2xl rounded-t-sm bg-[#F5E1DA] border border-[#DFC4BC] shadow-md flex items-center justify-center relative">
                        <span className="text-[#D43753] text-sm">♡</span>
                      </div>
                      <div className="w-3 h-7 rounded-r-full border-2 border-l-0 border-[#DFC4BC] -ml-0.5" />
                    </div>
                  </div>
                ) : tool.slug === 'moon-timer' ? (
                  /* Custom Luminous Full Moon over Starry Night Lake & Pine Trees matching reference image */
                  <div className="absolute inset-0 bg-gradient-to-b from-[#071124] via-[#112545] to-[#0A182E] flex items-center justify-center overflow-hidden">
                    <svg viewBox="0 0 360 270" className="w-full h-full object-cover">
                      <defs>
                        <radialGradient id="heroMoonGlow" cx="65%" cy="34%" r="36%">
                          <stop offset="0%" stopColor="#FFF5D6" stopOpacity="0.65" />
                          <stop offset="50%" stopColor="#F5D08A" stopOpacity="0.22" />
                          <stop offset="100%" stopColor="#071124" stopOpacity="0" />
                        </radialGradient>
                        <radialGradient id="heroMoonDisc" cx="38%" cy="35%" r="65%">
                          <stop offset="0%" stopColor="#FFFDF5" />
                          <stop offset="55%" stopColor="#F7E2B2" />
                          <stop offset="100%" stopColor="#D7B272" />
                        </radialGradient>
                      </defs>
                      {/* Corona glow */}
                      <circle cx="234" cy="92" r="95" fill="url(#heroMoonGlow)" />
                      {/* Twinkling stars */}
                      <circle cx="48" cy="38" r="1.1" fill="#FFFFFF" opacity="0.8" />
                      <circle cx="96" cy="28" r="1.4" fill="#FFF7D6" opacity="0.9" />
                      <circle cx="142" cy="54" r="1" fill="#FFFFFF" opacity="0.65" />
                      <circle cx="72" cy="78" r="1.2" fill="#FFFFFF" opacity="0.7" />
                      <circle cx="176" cy="30" r="1.1" fill="#FFFFFF" opacity="0.75" />
                      <circle cx="312" cy="42" r="1.3" fill="#FFF7D6" opacity="0.85" />
                      <circle cx="295" cy="78" r="1" fill="#FFFFFF" opacity="0.6" />
                      {/* Full Moon Disc + Subtle Lunar Mare Craters */}
                      <circle cx="234" cy="92" r="38" fill="url(#heroMoonDisc)" />
                      <ellipse cx="222" cy="82" rx="10" ry="7" fill="#C9A368" opacity="0.35" />
                      <ellipse cx="246" cy="96" rx="12" ry="8" fill="#C9A368" opacity="0.3" />
                      <circle cx="228" cy="105" r="6" fill="#C9A368" opacity="0.25" />
                      {/* Distant mountain ridges */}
                      <path
                        d="M 0 185 L 55 152 L 115 174 L 180 148 L 255 176 L 315 154 L 360 172 L 360 205 L 0 205 Z"
                        fill="#0E1E38"
                      />
                      <path
                        d="M 0 194 L 80 168 L 155 188 L 230 166 L 305 186 L 360 175 L 360 205 L 0 205 Z"
                        fill="#091528"
                      />
                      {/* Calm Night Lake */}
                      <rect x="0" y="196" width="360" height="74" fill="#081529" />
                      {/* Shimmering Golden Moon Reflection on Lake */}
                      <ellipse cx="234" cy="204" rx="28" ry="3.2" fill="#F7E2B2" opacity="0.65" />
                      <ellipse cx="234" cy="212" rx="22" ry="2.6" fill="#F5D08A" opacity="0.5" />
                      <ellipse cx="234" cy="220" rx="17" ry="2.2" fill="#F5D08A" opacity="0.4" />
                      <ellipse cx="234" cy="228" rx="12" ry="1.8" fill="#E5BA6E" opacity="0.32" />
                      <ellipse cx="234" cy="236" rx="8" ry="1.4" fill="#E5BA6E" opacity="0.22" />
                      {/* Evergreen Pine Silhouettes on Left & Right Shores */}
                      <path
                        d="M 18 202 L 30 162 L 42 202 Z M 36 204 L 46 172 L 56 204 Z M 305 204 L 318 156 L 331 204 Z M 326 204 L 340 144 L 354 204 Z"
                        fill="#040B16"
                      />
                    </svg>
                  </div>
                ) : tool.slug === 'sun-timer' ? (
                  /* Custom Golden Sunrise Over Mountain Ridges with "Bright Moments Brighter Days" Script matching reference image */
                  <div className="absolute inset-0 bg-gradient-to-b from-[#6FA9D8] via-[#F2C383] to-[#F5B062] flex items-center justify-center overflow-hidden">
                    <svg viewBox="0 0 360 270" className="w-full h-full object-cover">
                      <defs>
                        <linearGradient id="heroSunSky" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#65A1D4" />
                          <stop offset="50%" stopColor="#EBC68E" />
                          <stop offset="100%" stopColor="#F5AD5C" />
                        </linearGradient>
                        <radialGradient id="heroSunCorona" cx="52%" cy="42%" r="42%">
                          <stop offset="0%" stopColor="#FFFDF5" stopOpacity="0.9" />
                          <stop offset="45%" stopColor="#FFE184" stopOpacity="0.45" />
                          <stop offset="100%" stopColor="#F5AD5C" stopOpacity="0" />
                        </radialGradient>
                        <radialGradient id="heroSunOrb" cx="40%" cy="38%" r="60%">
                          <stop offset="0%" stopColor="#FFFDF6" />
                          <stop offset="65%" stopColor="#FFE48A" />
                          <stop offset="100%" stopColor="#F7B74A" />
                        </radialGradient>
                      </defs>
                      <rect x="0" y="0" width="360" height="270" fill="url(#heroSunSky)" />
                      {/* Soft morning clouds */}
                      <g fill="#FFF5DF" opacity="0.55">
                        <ellipse cx="68" cy="66" rx="44" ry="11" />
                        <ellipse cx="86" cy="60" rx="28" ry="12" />
                        <ellipse cx="292" cy="54" rx="42" ry="10" />
                      </g>
                      {/* Warm Sun Glow & Orb */}
                      <circle cx="178" cy="108" r="95" fill="url(#heroSunCorona)" />
                      <circle cx="178" cy="108" r="34" fill="url(#heroSunOrb)" />
                      {/* Layered Mountain Ranges */}
                      <path
                        d="M 0 218 L 62 178 L 124 202 L 194 174 L 266 204 L 322 176 L 360 194 L 360 270 L 0 270 Z"
                        fill="#9E7E6C"
                        opacity="0.85"
                      />
                      <path
                        d="M 0 232 L 84 196 L 158 224 L 236 194 L 308 220 L 360 202 L 360 270 L 0 270 Z"
                        fill="#6B5A58"
                      />
                      <path
                        d="M 0 248 L 96 222 L 188 244 L 284 218 L 360 238 L 360 270 L 0 270 Z"
                        fill="#3E3B3E"
                      />
                      {/* Evergreen Pine Silhouettes on Right */}
                      <path
                        d="M 304 270 L 318 210 L 332 270 Z M 324 270 L 340 192 L 356 270 Z"
                        fill="#1A2C24"
                      />
                    </svg>
                    {/* Hand-lettered Script Quote on Right Side of Sun */}
                    <div className="absolute right-4 top-8 text-center font-serif italic leading-tight select-none -rotate-3 drop-shadow-xs">
                      <div className="text-white text-base sm:text-lg font-medium">Bright</div>
                      <div className="text-white text-base sm:text-lg font-medium">Moments</div>
                      <div className="text-[#432312] font-bold text-base sm:text-lg mt-0.5">
                        Brighter Days
                      </div>
                    </div>
                  </div>
                ) : tool.slug === 'bubble-timer' ? (
                  /* Custom Calming Sunlit Underwater Scene with Rising Translucent Bubbles & Sea Plants matching reference image */
                  <div className="absolute inset-0 bg-gradient-to-b from-[#7CC7EC] via-[#3492CA] to-[#175B8D] flex items-center justify-center overflow-hidden">
                    <svg viewBox="0 0 360 270" className="w-full h-full object-cover">
                      <defs>
                        <linearGradient id="heroBubbleSea" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#8FD6F6" />
                          <stop offset="50%" stopColor="#3B98D0" />
                          <stop offset="100%" stopColor="#165788" />
                        </linearGradient>
                        <radialGradient id="heroBubbleFill" cx="32%" cy="28%" r="70%">
                          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.88" />
                          <stop offset="38%" stopColor="#B8E7FF" stopOpacity="0.42" />
                          <stop offset="78%" stopColor="#48A9E6" stopOpacity="0.24" />
                          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.68" />
                        </radialGradient>
                      </defs>
                      <rect x="0" y="0" width="360" height="270" fill="url(#heroBubbleSea)" />
                      {/* Diagonal Sunbeams from Water Surface */}
                      <g opacity="0.26">
                        <polygon points="40,0 110,0 190,270 95,270" fill="#FFFFFF" />
                        <polygon points="150,0 225,0 305,270 215,270" fill="#FFFFFF" />
                        <polygon points="255,0 315,0 360,220 310,270" fill="#FFFFFF" />
                      </g>
                      {/* Swaying Seaweed & Kelp on Right */}
                      <g opacity="0.88">
                        <path
                          d="M 318 270 C 304 225 332 180 314 132 C 302 98 326 65 318 35 C 330 68 316 105 328 140 C 344 185 320 228 334 270 Z"
                          fill="#1B7A58"
                        />
                        <path
                          d="M 338 270 C 325 230 348 190 335 148 C 325 118 345 88 338 62 C 349 92 336 122 346 154 C 358 194 338 232 350 270 Z"
                          fill="#25966D"
                        />
                        <path
                          d="M 296 270 C 288 238 306 208 296 178 C 306 206 296 238 308 270 Z"
                          fill="#155E44"
                        />
                      </g>
                      {/* Translucent Floating Bubbles with Specular Highlights */}
                      {[
                        { cx: 215, cy: 145, r: 34 },
                        { cx: 122, cy: 162, r: 24 },
                        { cx: 274, cy: 96, r: 26 },
                        { cx: 168, cy: 76, r: 19 },
                        { cx: 76, cy: 105, r: 21 },
                        { cx: 248, cy: 205, r: 20 },
                        { cx: 154, cy: 216, r: 15 },
                        { cx: 98, cy: 218, r: 13 },
                        { cx: 295, cy: 164, r: 14 },
                        { cx: 126, cy: 52, r: 11 },
                        { cx: 222, cy: 48, r: 12 },
                        { cx: 52, cy: 175, r: 12 },
                      ].map((b, i) => (
                        <g key={i}>
                          <circle
                            cx={b.cx}
                            cy={b.cy}
                            r={b.r}
                            fill="url(#heroBubbleFill)"
                            stroke="#FFFFFF"
                            strokeWidth="1.2"
                            strokeOpacity="0.75"
                          />
                          <ellipse
                            cx={b.cx - b.r * 0.32}
                            cy={b.cy - b.r * 0.32}
                            rx={b.r * 0.24}
                            ry={b.r * 0.13}
                            transform={`rotate(-35 ${b.cx - b.r * 0.32} ${b.cy - b.r * 0.32})`}
                            fill="#FFFFFF"
                            opacity="0.85"
                          />
                        </g>
                      ))}
                    </svg>
                  </div>
                ) : tool.slug === 'coral-timer' ? (
                  /* Custom Sunlit Underwater Coral Reef Hero Artwork with Clownfish & Branching Corals */
                  <div className="w-full h-full relative overflow-hidden bg-gradient-to-b from-[#1CB5E0] via-[#0B78B8] to-[#083F70]">
                    <svg viewBox="0 0 360 240" className="w-full h-full">
                      <defs>
                        <linearGradient id="heroCoralWater" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#35C9EB" />
                          <stop offset="55%" stopColor="#0E7EC0" />
                          <stop offset="100%" stopColor="#073B6B" />
                        </linearGradient>
                        <linearGradient id="heroCoralBranch" x1="0" y1="1" x2="0" y2="0">
                          <stop offset="0%" stopColor="#C93B3B" />
                          <stop offset="60%" stopColor="#F35B4F" />
                          <stop offset="100%" stopColor="#FFB09C" />
                        </linearGradient>
                      </defs>
                      <rect x="0" y="0" width="360" height="240" fill="url(#heroCoralWater)" />
                      {/* Sunbeams */}
                      <g opacity="0.24">
                        <polygon points="40,0 110,0 180,240 80,240" fill="#FFFFFF" />
                        <polygon points="150,0 225,0 310,240 205,240" fill="#FFFFFF" />
                        <polygon points="255,0 315,0 360,210 315,240" fill="#FFFFFF" />
                      </g>
                      {/* Sandy Reef Floor */}
                      <path d="M 0 206 Q 110 192 220 202 T 360 196 L 360 240 L 0 240 Z" fill="#E6C9A2" />
                      {/* Left Seaweed & Reef */}
                      <path
                        d="M 28 212 Q 16 172 34 140 Q 44 118 28 96 M 48 214 Q 36 178 52 152"
                        stroke="#1E967A"
                        strokeWidth="8"
                        strokeLinecap="round"
                        fill="none"
                      />
                      {/* Right Vibrant Branching Coral Reef */}
                      <path
                        d="M 255 215 C 255 186, 258 164, 256 142 C 244 126, 232 108, 228 92 M 256 154 C 272 136, 286 116, 292 95 M 256 172 C 234 160, 215 142, 206 124 M 258 170 C 282 158, 302 140, 312 118"
                        stroke="url(#heroCoralBranch)"
                        strokeWidth="10"
                        strokeLinecap="round"
                        fill="none"
                      />
                      {/* Purple & Pink Side Reef Corals */}
                      <ellipse cx="326" cy="192" rx="34" ry="24" fill="#9B4DCA" opacity="0.9" />
                      <ellipse cx="205" cy="204" rx="28" ry="16" fill="#EC4899" opacity="0.85" />
                      <ellipse cx="78" cy="204" rx="26" ry="15" fill="#F472B6" opacity="0.85" />
                      {/* Clownfish 1 */}
                      <g transform="translate(135, 138)">
                        <path d="M-18 0 L-26 -7 L-26 7 Z" fill="#FF6D00" />
                        <ellipse cx="-4" cy="0" rx="15" ry="8.5" fill="#FF6D00" />
                        <path d="M-11 -8 Q-8 0 -11 8" stroke="#FFFFFF" strokeWidth="3" fill="none" />
                        <path d="M-1 -8.5 Q2 0 -1 8.5" stroke="#FFFFFF" strokeWidth="3" fill="none" />
                        <circle cx="6" cy="-1.5" r="1.6" fill="#111827" />
                      </g>
                      {/* Golden Tang Fish */}
                      <g transform="translate(192, 168)">
                        <path d="M-12 0 L-18 -5 L-18 5 Z" fill="#FACC15" />
                        <ellipse cx="-3" cy="0" rx="10" ry="6.5" fill="#FDE047" />
                        <circle cx="3" cy="-1" r="1.3" fill="#1E293B" />
                      </g>
                    </svg>
                  </div>
                ) : tool.slug === 'lichen-timer' ? (
                  /* Custom Sunlit Forest Stone & Foliose Lichen Hero Artwork with "Small Moments / Big Focus" */
                  <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-[#3C4B33] via-[#2F3E28] to-[#1D281A]">
                    <svg viewBox="0 0 360 240" className="w-full h-full">
                      <defs>
                        <radialGradient id="heroLichenSun" cx="15%" cy="15%" r="80%">
                          <stop offset="0%" stopColor="#DDE8B9" stopOpacity="0.55" />
                          <stop offset="45%" stopColor="#4A5D3B" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="#162014" stopOpacity="0.85" />
                        </radialGradient>
                      </defs>
                      {/* Bark & Stone Diagonal Surface */}
                      <rect x="0" y="0" width="360" height="240" fill="#3A3832" />
                      <polygon points="40,240 220,0 360,0 360,240" fill="#2B2A25" />
                      <path d="M 55 240 L 228 0 M 145 240 L 310 20" stroke="#1E1D19" strokeWidth="4" fill="none" />
                      {/* Moss & Foliose Lichen Rosettes along the bark */}
                      {[
                        { cx: 95, cy: 190, r: 44, lobe: '#8EB39C', rim: '#C9E2CE', moss: '#4C7A3E' },
                        { cx: 165, cy: 135, r: 52, lobe: '#95B8A1', rim: '#D2E8D6', moss: '#3B6E38' },
                        { cx: 235, cy: 82, r: 48, lobe: '#84A992', rim: '#C4DEC9', moss: '#588B48' },
                        { cx: 195, cy: 198, r: 46, lobe: '#A3C2AD', rim: '#DCEFE0', moss: '#2E5A36' },
                        { cx: 285, cy: 165, r: 42, lobe: '#7E9F8B', rim: '#BDD6C2', moss: '#3D6B37' },
                      ].map((c, idx) => (
                        <g key={idx}>
                          <circle cx={c.cx} cy={c.cy} r={c.r} fill={c.moss} opacity="0.9" />
                          <circle
                            cx={c.cx - 6}
                            cy={c.cy - 4}
                            r={c.r * 0.65}
                            fill={c.lobe}
                            stroke={c.rim}
                            strokeWidth="2.5"
                          />
                          <circle
                            cx={c.cx + 10}
                            cy={c.cy + 8}
                            r={c.r * 0.45}
                            fill={c.lobe}
                            stroke={c.rim}
                            strokeWidth="2"
                          />
                          <circle cx={c.cx - 4} cy={c.cy - 5} r={5} fill="#C88A4B" stroke={c.rim} strokeWidth="1.5" />
                          <circle cx={c.cx + 8} cy={c.cy + 6} r={3.5} fill="#B36A3E" stroke={c.rim} strokeWidth="1.2" />
                        </g>
                      ))}
                      <rect x="0" y="0" width="360" height="240" fill="url(#heroLichenSun)" />
                      {/* Handwritten-style "Small Moments / Big Focus" on right */}
                      <g transform="translate(295, 86) rotate(-6)">
                        <text
                          x="0"
                          y="0"
                          textAnchor="middle"
                          className="font-serif italic fill-white text-[19px] font-medium"
                          style={{ textShadow: '0 2px 8px rgba(0,0,0,0.65)' }}
                        >
                          Small
                        </text>
                        <text
                          x="0"
                          y="23"
                          textAnchor="middle"
                          className="font-serif italic fill-white text-[19px] font-medium"
                          style={{ textShadow: '0 2px 8px rgba(0,0,0,0.65)' }}
                        >
                          Moments
                        </text>
                        <text
                          x="0"
                          y="47"
                          textAnchor="middle"
                          className="font-serif italic fill-[#E9F5DB] text-[20px] font-bold"
                          style={{ textShadow: '0 2px 8px rgba(0,0,0,0.65)' }}
                        >
                          Big Focus
                        </text>
                        <path
                          d="M -32 56 Q 0 50 32 56"
                          stroke="#A3C999"
                          strokeWidth="2.2"
                          fill="none"
                          strokeLinecap="round"
                        />
                      </g>
                    </svg>
                  </div>
                ) : tool.slug === 'frost-timer' ? (
                  /* Custom Frosted Window Glass & Golden Winter Sunrise Hero Artwork with "Calm / Focus / Clear Mind" */
                  <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-[#1E3B63] via-[#3E648F] to-[#162C4A]">
                    <svg viewBox="0 0 360 240" className="w-full h-full" shapeRendering="geometricPrecision">
                      <defs>
                        <radialGradient id="heroFrostSun" cx="44%" cy="54%" r="58%">
                          <stop offset="0%" stopColor="#FFF6E0" stopOpacity="0.96" />
                          <stop offset="34%" stopColor="#F7BC7E" stopOpacity="0.68" />
                          <stop offset="100%" stopColor="#162C4A" stopOpacity="0" />
                        </radialGradient>
                      </defs>
                      <rect x="0" y="0" width="360" height="240" fill="#213E66" />
                      <rect x="0" y="0" width="360" height="240" fill="url(#heroFrostSun)" />
                      <circle cx="158" cy="128" r="22" fill="#FFFDF5" opacity="0.9" />
                      {/* Crisp Distant Mountains & Winter Pines Silhouette */}
                      <polygon points="0,185 55,148 115,174 185,142 255,172 360,145 360,240 0,240" fill="#1C3456" />
                      <polygon points="28,240 58,108 88,240" fill="#12243D" />
                      <polygon points="68,240 94,128 120,240" fill="#172D4B" />
                      <polygon points="198,240 228,102 258,240" fill="#12243D" />
                      <polygon points="242,240 276,84 310,240" fill="#0E1D33" />
                      {/* Crisp Multi-Layered Dendritic Ice Crystal Ferns at Corners & Edges */}
                      <g stroke="#174475" strokeLinecap="round" opacity="0.55" transform="translate(1, 1)">
                        <line x1="0" y1="240" x2="136" y2="144" strokeWidth="2.8" />
                        <line x1="0" y1="0" x2="122" y2="84" strokeWidth="2.6" />
                        <line x1="360" y1="240" x2="228" y2="152" strokeWidth="2.8" />
                      </g>
                      <g stroke="#DCEEFF" strokeLinecap="round">
                        {/* Bottom-left feathery frost fern */}
                        <line x1="0" y1="240" x2="136" y2="144" strokeWidth="2.4" />
                        <line x1="28" y1="220" x2="12" y2="184" strokeWidth="1.7" />
                        <line x1="28" y1="220" x2="62" y2="230" strokeWidth="1.7" />
                        <line x1="56" y1="200" x2="38" y2="164" strokeWidth="1.6" />
                        <line x1="56" y1="200" x2="90" y2="212" strokeWidth="1.6" />
                        <line x1="84" y1="180" x2="68" y2="148" strokeWidth="1.4" />
                        <line x1="84" y1="180" x2="114" y2="190" strokeWidth="1.4" />
                        <line x1="110" y1="162" x2="96" y2="136" strokeWidth="1.2" />
                        {/* Top-left feathery frost fern */}
                        <line x1="0" y1="0" x2="122" y2="84" strokeWidth="2.2" />
                        <line x1="32" y1="22" x2="62" y2="10" strokeWidth="1.6" />
                        <line x1="32" y1="22" x2="16" y2="52" strokeWidth="1.6" />
                        <line x1="64" y1="44" x2="92" y2="32" strokeWidth="1.4" />
                        <line x1="64" y1="44" x2="48" y2="72" strokeWidth="1.4" />
                        <line x1="94" y1="65" x2="116" y2="54" strokeWidth="1.2" />
                        {/* Bottom-right feathery frost fern */}
                        <line x1="360" y1="240" x2="228" y2="152" strokeWidth="2.4" />
                        <line x1="324" y1="216" x2="342" y2="180" strokeWidth="1.7" />
                        <line x1="324" y1="216" x2="288" y2="228" strokeWidth="1.7" />
                        <line x1="292" y1="195" x2="310" y2="162" strokeWidth="1.5" />
                        <line x1="292" y1="195" x2="258" y2="206" strokeWidth="1.5" />
                        <line x1="260" y1="173" x2="276" y2="146" strokeWidth="1.3" />
                      </g>
                      {/* Razor-sharp pure white specular crystal spines */}
                      <g stroke="#FFFFFF" strokeWidth="1.1" strokeLinecap="round">
                        <line x1="0" y1="240" x2="124" y2="152" />
                        <line x1="0" y1="0" x2="110" y2="76" />
                        <line x1="360" y1="240" x2="240" y2="160" />
                      </g>
                      {/* Handwritten-style "Calm / Focus / Clear Mind" on right */}
                      <g transform="translate(292, 74) rotate(-5)">
                        <text
                          x="0"
                          y="0"
                          textAnchor="middle"
                          className="font-serif italic fill-white text-[19px] font-medium"
                          style={{ textShadow: '0 2px 8px rgba(10,25,48,0.85)' }}
                        >
                          Calm
                        </text>
                        <text
                          x="0"
                          y="23"
                          textAnchor="middle"
                          className="font-serif italic fill-white text-[19px] font-medium"
                          style={{ textShadow: '0 2px 8px rgba(10,25,48,0.85)' }}
                        >
                          Focus
                        </text>
                        <text
                          x="0"
                          y="47"
                          textAnchor="middle"
                          className="font-serif italic fill-[#E6F4FF] text-[20px] font-bold"
                          style={{ textShadow: '0 2px 8px rgba(10,25,48,0.85)' }}
                        >
                          Clear Mind
                        </text>
                        <path
                          d="M -38 56 Q 0 50 38 56"
                          stroke="#8CC8FA"
                          strokeWidth="2.4"
                          fill="none"
                          strokeLinecap="round"
                        />
                      </g>
                    </svg>
                  </div>
                ) : tool.slug === 'snow-timer' ? (
                  /* Custom Winter Cabin in Snowy Evergreen Forest & Mountains Hero Artwork matching reference screenshot */
                  <div className="w-full h-full relative overflow-hidden bg-gradient-to-b from-[#4B709E] via-[#7A9CC6] to-[#DDEAF7]">
                    <svg viewBox="0 0 360 240" className="w-full h-full" shapeRendering="geometricPrecision">
                      <defs>
                        <linearGradient id="heroSnowSky" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#3D6291" />
                          <stop offset="45%" stopColor="#779BC4" />
                          <stop offset="85%" stopColor="#C8DDF2" />
                          <stop offset="100%" stopColor="#EAF4FC" />
                        </linearGradient>
                        <radialGradient id="heroCabinGlow" cx="50%" cy="50%" r="55%">
                          <stop offset="0%" stopColor="#FFF6C9" stopOpacity="0.98" />
                          <stop offset="50%" stopColor="#F5A638" stopOpacity="0.65" />
                          <stop offset="100%" stopColor="#E67E22" stopOpacity="0" />
                        </radialGradient>
                      </defs>
                      <rect x="0" y="0" width="360" height="240" fill="url(#heroSnowSky)" />
                      {/* Distant Snow-Capped Mountains */}
                      <polygon points="0,164 68,108 142,154 218,98 294,148 360,114 360,240 0,240" fill="#7D9EC5" />
                      <polygon points="68,108 46,126 62,124 74,132 90,125" fill="#EEF6FD" opacity="0.9" />
                      <polygon points="218,98 194,119 212,116 226,125 244,117" fill="#F2F8FF" opacity="0.92" />
                      {/* Midground Snowy Hills */}
                      <path d="M 0 176 Q 95 148 210 170 T 360 162 L 360 240 L 0 240 Z" fill="#BBD3EC" />
                      {/* Background Snow-Dusted Pine Trees */}
                      <g fill="#2A4A6E">
                        <polygon points="26,192 48,104 70,192" />
                        <polygon points="60,196 80,118 100,196" />
                        <polygon points="104,194 122,128 140,194" />
                        <polygon points="304,196 328,96 352,196" />
                      </g>
                      {/* Snow-Covered Log Cabin on Right */}
                      <g transform="translate(172, 114)">
                        {/* Warm ambient light spill on snow in front of cabin */}
                        <ellipse cx="64" cy="84" rx="58" ry="18" fill="url(#heroCabinGlow)" />
                        {/* Chimney */}
                        <rect x="86" y="-4" width="12" height="24" rx="1.5" fill="#5B4638" />
                        <path d="M 84 -4 Q 92 -9 100 -4 Z" fill="#F5FAFF" />
                        {/* Cabin timber walls */}
                        <polygon points="16,32 64,2 112,32 112,78 16,78" fill="#6E472B" stroke="#4D301B" strokeWidth="1.2" />
                        {/* Horizontal log lines */}
                        <line x1="18" y1="44" x2="110" y2="44" stroke="#4E311C" strokeWidth="1.2" />
                        <line x1="18" y1="56" x2="110" y2="56" stroke="#4E311C" strokeWidth="1.2" />
                        <line x1="18" y1="68" x2="110" y2="68" stroke="#4E311C" strokeWidth="1.2" />
                        {/* Glowing warm cabin windows */}
                        <rect x="30" y="42" width="22" height="20" rx="2" fill="#FFE885" stroke="#4A2E19" strokeWidth="2" />
                        <line x1="41" y1="42" x2="41" y2="62" stroke="#4A2E19" strokeWidth="1.5" />
                        <line x1="30" y1="52" x2="52" y2="52" stroke="#4A2E19" strokeWidth="1.5" />
                        <rect x="74" y="42" width="22" height="20" rx="2" fill="#FFE885" stroke="#4A2E19" strokeWidth="2" />
                        <line x1="85" y1="42" x2="85" y2="62" stroke="#4A2E19" strokeWidth="1.5" />
                        <line x1="74" y1="52" x2="96" y2="52" stroke="#4A2E19" strokeWidth="1.5" />
                        {/* Attic small warm window */}
                        <rect x="57" y="18" width="14" height="12" rx="1.5" fill="#FFE885" stroke="#4A2E19" strokeWidth="1.6" />
                        {/* Thick white snow roof cap */}
                        <path
                          d="M 6 36 L 64 -2 L 122 36 Q 114 42 106 35 L 64 8 L 22 35 Q 14 42 6 36 Z"
                          fill="#F5FAFF"
                          stroke="#BFD8F2"
                          strokeWidth="1.2"
                        />
                      </g>
                      {/* Foreground Snow-Laden Evergreen Pines */}
                      <g>
                        <polygon points="10,214 38,118 66,214" fill="#1E3958" />
                        <path d="M 38 118 L 24 148 Q 38 144 52 148 Z" fill="#F0F7FF" opacity="0.92" />
                        <path d="M 38 142 L 18 176 Q 38 170 58 176 Z" fill="#E6F2FC" opacity="0.9" />
                        <polygon points="134,208 156,134 178,208" fill="#213F61" />
                        <path d="M 156 134 L 144 158 Q 156 154 168 158 Z" fill="#F0F7FF" opacity="0.92" />
                      </g>
                      {/* Crisp Layered Snowdrifts at Bottom */}
                      <path d="M 0 194 Q 90 178 190 192 T 360 186 L 360 240 L 0 240 Z" fill="#DCEBFA" />
                      <path d="M 0 210 Q 115 196 230 208 T 360 202 L 360 240 L 0 240 Z" fill="#F5FAFF" />
                      {/* Gentle Falling Snowflakes */}
                      <g fill="#FFFFFF" opacity="0.9">
                        <circle cx="42" cy="36" r="2.2" />
                        <circle cx="96" cy="58" r="1.8" />
                        <circle cx="148" cy="28" r="2.5" />
                        <circle cx="204" cy="48" r="1.9" />
                        <circle cx="268" cy="32" r="2.3" />
                        <circle cx="318" cy="64" r="2.0" />
                        <circle cx="72" cy="96" r="2.1" />
                        <circle cx="176" cy="82" r="1.7" />
                        <circle cx="242" cy="76" r="2.2" />
                        <circle cx="292" cy="102" r="1.8" />
                      </g>
                    </svg>
                  </div>
                ) : tool.slug === 'galaxy-timer' ? (
                  /* Custom Luminous Spiral Galaxy, Nebula & Crescent Exoplanet Hero Artwork matching reference screenshot */
                  <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-[#070B1E] via-[#1B1240] to-[#0B061D]">
                    <svg viewBox="0 0 360 240" className="w-full h-full" shapeRendering="geometricPrecision">
                      <defs>
                        <radialGradient id="heroGalaxyNebula" cx="48%" cy="46%" r="62%">
                          <stop offset="0%" stopColor="#FFF7ED" stopOpacity="0.98" />
                          <stop offset="18%" stopColor="#FBBF24" stopOpacity="0.88" />
                          <stop offset="42%" stopColor="#EC4899" stopOpacity="0.58" />
                          <stop offset="72%" stopColor="#6366F1" stopOpacity="0.35" />
                          <stop offset="100%" stopColor="#070B1E" stopOpacity="0" />
                        </radialGradient>
                        <radialGradient id="heroExoplanet" cx="32%" cy="28%" r="70%">
                          <stop offset="0%" stopColor="#FDBA74" />
                          <stop offset="35%" stopColor="#7C2D12" />
                          <stop offset="75%" stopColor="#1E1B4B" />
                          <stop offset="100%" stopColor="#050816" />
                        </radialGradient>
                      </defs>
                      <rect x="0" y="0" width="360" height="240" fill="#070B1E" />
                      {/* Ambient Deep Space Nebula */}
                      <ellipse cx="172" cy="110" rx="165" ry="96" transform="rotate(-22 172 110)" fill="url(#heroGalaxyNebula)" />
                      {/* Tilted Spiral Arms */}
                      <g transform="translate(172, 110) rotate(-22) scale(1, 0.52)">
                        <path
                          d="M 0 0 C 35 -10 68 18 52 54 C 32 96 -36 108 -86 76 C -138 42 -152 -32 -112 -88"
                          fill="none"
                          stroke="#93C5FD"
                          strokeWidth="22"
                          strokeLinecap="round"
                          opacity="0.38"
                        />
                        <path
                          d="M 0 0 C -35 10 -68 -18 -52 -54 C -32 -96 36 -108 86 -76 C 138 -42 152 32 112 88"
                          fill="none"
                          stroke="#C084FC"
                          strokeWidth="22"
                          strokeLinecap="round"
                          opacity="0.42"
                        />
                        <path
                          d="M 0 0 C 28 -8 54 14 42 42 C 24 76 -28 86 -68 60"
                          fill="none"
                          stroke="#FDE68A"
                          strokeWidth="12"
                          strokeLinecap="round"
                          opacity="0.75"
                        />
                        <path
                          d="M 0 0 C -28 8 -54 -14 -42 -42 C -24 -76 28 -86 68 -60"
                          fill="none"
                          stroke="#FDE68A"
                          strokeWidth="12"
                          strokeLinecap="round"
                          opacity="0.75"
                        />
                        <circle cx="0" cy="0" r="28" fill="#FFFBEB" />
                      </g>
                      {/* Foreground Crescent Exoplanet on Bottom-Right matching screenshot */}
                      <circle cx="318" cy="188" r="56" fill="url(#heroExoplanet)" />
                      <path
                        d="M 275 152 A 56 56 0 0 1 356 147"
                        fill="none"
                        stroke="#FDE68A"
                        strokeWidth="2.4"
                        opacity="0.75"
                      />
                      {/* Crisp Starfield & Four-Point Cosmic Stars */}
                      <g fill="#FFFFFF" opacity="0.92">
                        <circle cx="36" cy="34" r="1.5" />
                        <circle cx="78" cy="24" r="1.2" />
                        <circle cx="118" cy="48" r="1.8" />
                        <circle cx="246" cy="28" r="1.6" />
                        <circle cx="298" cy="42" r="2.1" />
                        <circle cx="332" cy="76" r="1.4" />
                        <circle cx="52" cy="148" r="1.7" />
                        <circle cx="96" cy="186" r="1.4" />
                        <circle cx="152" cy="176" r="1.9" />
                        <circle cx="222" cy="158" r="1.5" />
                      </g>
                    </svg>
                  </div>
                ) : tool.slug === 'lava-lamp-timer' ? (
                  /* Custom Cozy Retro Room Desk with Glowing Amber/Magenta Lava Lamp, Rainbow Wall Arch, Plants, Books & Vintage Radio matching reference screenshot */
                  <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-[#3A1734] via-[#541C3A] to-[#260E1F]">
                    <svg viewBox="0 0 360 240" className="w-full h-full" shapeRendering="geometricPrecision">
                      <defs>
                        <radialGradient id="heroLavaGlow" cx="62%" cy="46%" r="54%">
                          <stop offset="0%" stopColor="#FFB74D" stopOpacity="0.88" />
                          <stop offset="42%" stopColor="#E91E63" stopOpacity="0.45" />
                          <stop offset="100%" stopColor="#260E1F" stopOpacity="0" />
                        </radialGradient>
                        <linearGradient id="heroLampLiquid" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#880E4F" />
                          <stop offset="55%" stopColor="#D81B60" />
                          <stop offset="100%" stopColor="#FF6F00" />
                        </linearGradient>
                        <radialGradient id="heroWaxBlob" cx="38%" cy="35%" r="65%">
                          <stop offset="0%" stopColor="#FFF59D" />
                          <stop offset="52%" stopColor="#FFA000" />
                          <stop offset="100%" stopColor="#E65100" />
                        </radialGradient>
                      </defs>
                      {/* Warm Retro Room Backdrop */}
                      <rect x="0" y="0" width="360" height="240" fill="#321329" />
                      <rect x="0" y="0" width="360" height="240" fill="url(#heroLavaGlow)" />
                      {/* Retro Rainbow Wall Arch Behind Desk */}
                      <g transform="translate(148, 178)" fill="none" strokeLinecap="round" opacity="0.82">
                        <path d="M -64 0 A 64 64 0 0 1 64 0" stroke="#F97316" strokeWidth="10" />
                        <path d="M -53 0 A 53 53 0 0 1 53 0" stroke="#FACC15" strokeWidth="10" />
                        <path d="M -42 0 A 42 42 0 0 1 42 0" stroke="#4ADE80" strokeWidth="10" />
                        <path d="M -31 0 A 31 31 0 0 1 31 0" stroke="#38BDF8" strokeWidth="10" />
                      </g>
                      {/* Potted Leafy Houseplant on Left */}
                      <g transform="translate(46, 128)">
                        <polygon points="10,22 44,22 39,56 15,56" fill="#C87A4B" />
                        <g fill="#2E7D32">
                          <ellipse cx="8" cy="10" rx="18" ry="8" transform="rotate(-28 8 10)" />
                          <ellipse cx="26" cy="-4" rx="20" ry="9" transform="rotate(-65 26 -4)" />
                          <ellipse cx="44" cy="8" rx="19" ry="8" transform="rotate(24 44 8)" />
                          <ellipse cx="18" cy="-18" rx="16" ry="7" transform="rotate(-42 18 -18)" />
                          <ellipse cx="38" cy="-16" rx="16" ry="7" transform="rotate(38 38 -16)" />
                        </g>
                      </g>
                      {/* Stacked Hardcover Books in Center-Left */}
                      <g transform="translate(112, 152)">
                        <rect x="0" y="16" width="66" height="11" rx="2" fill="#D97706" />
                        <rect x="4" y="18" width="58" height="7" rx="1" fill="#FEF3C7" />
                        <rect x="4" y="6" width="60" height="10" rx="2" fill="#0284C7" />
                        <rect x="8" y="8" width="52" height="6" rx="1" fill="#E0F2FE" />
                        <rect x="8" y="-3" width="52" height="9" rx="2" fill="#E11D48" />
                      </g>
                      {/* Vintage Wooden Radio on Right */}
                      <g transform="translate(274, 128)">
                        <rect x="0" y="0" width="76" height="52" rx="8" fill="#B45309" stroke="#78350F" strokeWidth="2" />
                        <rect x="6" y="7" width="64" height="14" rx="3" fill="#FDE68A" opacity="0.85" />
                        <circle cx="24" cy="36" r="10" fill="#451A03" />
                        <circle cx="54" cy="34" r="5" fill="#FDE68A" />
                        <circle cx="64" cy="34" r="4" fill="#FDE68A" />
                      </g>
                      {/* Wooden Desk Surface */}
                      <rect x="0" y="178" width="360" height="62" fill="#4A2116" />
                      <line x1="0" y1="178" x2="360" y2="178" stroke="#7C3A26" strokeWidth="2.5" />
                      {/* Glowing Retro Lava Lamp (Hero Focal Point at x=224) */}
                      <g transform="translate(224, 14)">
                        {/* Silver Top Cap */}
                        <polygon points="-11,8 11,8 16,28 -16,28" fill="#E2E8F0" />
                        {/* Glass Conical Chamber */}
                        <polygon
                          points="-16,28 16,28 34,104 24,132 -24,132 -34,104"
                          fill="url(#heroLampLiquid)"
                          stroke="rgba(255,255,255,0.45)"
                          strokeWidth="1.5"
                        />
                        {/* Glowing Wax Blobs Inside Lamp */}
                        <ellipse cx="0" cy="126" rx="20" ry="7" fill="url(#heroWaxBlob)" />
                        <path
                          d="M -12 126 C -8 106 -19 92 -14 76 C -10 62 10 62 14 76 C 19 92 8 106 12 126 Z"
                          fill="url(#heroWaxBlob)"
                        />
                        <circle cx="-4" cy="48" r="9.5" fill="url(#heroWaxBlob)" />
                        <circle cx="11" cy="64" r="5.5" fill="url(#heroWaxBlob)" />
                        <circle cx="-13" cy="96" r="6" fill="url(#heroWaxBlob)" />
                        <circle cx="14" cy="108" r="4.5" fill="url(#heroWaxBlob)" />
                        {/* Silver Metallic Pedestal Base */}
                        <polygon points="-24,132 24,132 32,168 -32,168" fill="#CBD5E1" />
                        <polygon points="-32,168 32,168 26,178 -26,178" fill="#64748B" />
                      </g>
                    </svg>
                  </div>
                ) : tool.slug === 'spinner-timer' ? (
                  /* Custom Sunlit Study Desk with Notebook, Potted Plants & Tilted Sticky Note Checklist ("✓ Study, ✓ Workout, ✓ Game, ✓ Group Activity") matching reference screenshot */
                  <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-[#EFECE4] via-[#E5DEC9] to-[#D4C7AD]">
                    <svg viewBox="0 0 360 240" className="w-full h-full" shapeRendering="geometricPrecision">
                      <defs>
                        <linearGradient id="heroSpinnerDesk" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#D6B88D" />
                          <stop offset="100%" stopColor="#B89263" />
                        </linearGradient>
                        <linearGradient id="heroStickyNote" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#FAF0CA" />
                          <stop offset="100%" stopColor="#EAD69B" />
                        </linearGradient>
                      </defs>
                      {/* Soft Sunlit Window Wall Backdrop */}
                      <rect x="0" y="0" width="360" height="158" fill="#EAE6DC" />
                      <polygon points="0,0 185,0 130,158 0,158" fill="#F7F5F0" opacity="0.7" />
                      {/* Warm Wooden Desk Surface */}
                      <rect x="0" y="154" width="360" height="86" fill="url(#heroSpinnerDesk)" />
                      <line x1="0" y1="154" x2="360" y2="154" stroke="#C5A375" strokeWidth="2" />
                      {/* Blurred Potted Green Plant on Left */}
                      <g transform="translate(86, 108)">
                        <rect x="-16" y="22" width="32" height="30" rx="4" fill="#F5F3EF" />
                        <ellipse cx="-10" cy="14" rx="12" ry="7" transform="rotate(-25 -10 14)" fill="#2E7D32" />
                        <ellipse cx="0" cy="8" rx="14" ry="8" transform="rotate(-70 0 8)" fill="#43A047" />
                        <ellipse cx="11" cy="15" rx="12" ry="7" transform="rotate(28 11 15)" fill="#1B5E20" />
                      </g>
                      {/* Open Notebook on Left-Center Desk */}
                      <g transform="translate(92, 166) rotate(-6)">
                        <polygon points="-45,0 58,-4 72,22 -35,28" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
                        <line x1="-28" y1="7" x2="42" y2="4" stroke="#E2E8F0" strokeWidth="1.5" />
                        <line x1="-24" y1="14" x2="48" y2="11" stroke="#E2E8F0" strokeWidth="1.5" />
                      </g>
                      {/* Lush Green Potted Plant on Right */}
                      <g transform="translate(314, 104)">
                        <polygon points="-24,38 24,38 18,74 -18,74" fill="#A47148" />
                        <g fill="#2E7D32">
                          <ellipse cx="-18" cy="24" rx="20" ry="9" transform="rotate(-28 -18 24)" />
                          <ellipse cx="-6" cy="8" rx="22" ry="10" transform="rotate(-55 -6 8)" />
                          <ellipse cx="10" cy="6" rx="22" ry="10" transform="rotate(-82 10 6)" />
                          <ellipse cx="22" cy="20" rx="20" ry="9" transform="rotate(32 22 20)" />
                          <ellipse cx="0" cy="24" rx="18" ry="8" fill="#43A047" />
                        </g>
                      </g>
                      {/* Wooden Easel Stand & Kraft Sticky Note Card ("✓ Study / ✓ Workout / ✓ Game / ✓ Group Activity") */}
                      <g transform="translate(216, 98) rotate(5)">
                        {/* Drop shadow */}
                        <rect x="-66" y="-58" width="136" height="118" rx="4" fill="rgba(0,0,0,0.18)" transform="translate(4, 6)" />
                        {/* Sticky Note Card */}
                        <rect
                          x="-66"
                          y="-58"
                          width="136"
                          height="118"
                          rx="3"
                          fill="url(#heroStickyNote)"
                          stroke="#D6BE7C"
                          strokeWidth="1.5"
                        />
                        {/* Checklist Items */}
                        <g className="font-serif italic" fill="#1E293B" fontSize="16" fontWeight="600">
                          <text x="-50" y="-28">✓ Study</text>
                          <text x="-50" y="-4">✓ Workout</text>
                          <text x="-50" y="20">✓ Game</text>
                          <text x="-50" y="44">✓ Group Activity</text>
                        </g>
                      </g>
                    </svg>
                  </div>
                ) : (
                  editorial.heroImage.notebookLines &&
                  editorial.heroImage.notebookLines.length > 0 && (
                    <div className="absolute top-4 right-4 bg-[#F7F6F2]/95 dark:bg-[#1A201C]/95 backdrop-blur-xs p-3 rounded-xl border border-[#E4E1D9] dark:border-[#2D352F] shadow-sm text-right space-y-0.5 max-w-[220px]">
                      {editorial.heroImage.notebookLines.map((line, idx) => (
                        <div
                          key={idx}
                          className={`text-xs ${
                            idx === 0
                              ? 'font-serif text-[#252B27] dark:text-white font-bold'
                              : 'font-serif italic text-[#365C4B] dark:text-[#5E917A]'
                          }`}
                        >
                          {line}
                        </div>
                      ))}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION 2 — THE FUNCTIONAL TOOL AREA */}
      <section className="py-10 sm:py-14 border-b border-[#E4E1D9] dark:border-[#262D28]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          {children}
        </div>
      </section>

      {/* 4. SECTION 3 — HOW TO USE THIS TOOL (Conditional: skipped if empty) */}
      {editorial.steps && editorial.steps.length > 0 && (
        <section className="py-12 sm:py-16 border-b border-[#E4E1D9] dark:border-[#262D28] bg-white/40 dark:bg-[#181D1A]/40">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
            <div className="mb-8">
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#252B27] dark:text-white">
                {tool.slug === 'visual-timer' ? 'How to Use the Visual Timer' : `How to Use ${tool.name}`}
              </h2>
            </div>

            {/* Sequential Steps in a row */}
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 ${
                editorial.steps.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'
              } gap-6`}
            >
              {editorial.steps.map((st) => (
                <div key={st.step} className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-[#365C4B] text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {st.step}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-[#252B27] dark:text-white mb-1">
                      {st.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#252B27]/70 dark:text-slate-400 leading-relaxed">
                      {st.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. SECTION 4 — LONG-FORM SEO ARTICLE (Asymmetric 2-Column Layout) */}
      <section className="py-16 sm:py-24 border-b border-[#E4E1D9] dark:border-[#262D28]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            {/* Left Column (sticky sidebar) */}
            <aside className={`${tool.slug === 'rainbow-timer' || tool.slug === 'liquid-timer' || tool.slug === 'hourglass-timer' || tool.slug === 'circular-timer' || tool.slug === 'radial-timer' || tool.slug === 'rings-timer' || tool.slug === 'progress-timer' || tool.slug === 'pixel-timer' || tool.slug === 'blocks-timer' || tool.slug === 'candle-timer' || tool.slug === 'aesthetic-timer' || tool.slug === 'picture-reveal-timer' || tool.slug === 'heart-timer' || tool.slug === 'moon-timer' || tool.slug === 'sun-timer' || tool.slug === 'bubble-timer' || tool.slug === 'coral-timer' || tool.slug === 'lichen-timer' || tool.slug === 'frost-timer' || tool.slug === 'snow-timer' || tool.slug === 'galaxy-timer' || tool.slug === 'lava-lamp-timer' || tool.slug === 'spinner-timer' ? 'lg:col-span-3' : 'lg:col-span-4'} space-y-6`}>
              <div className="sticky top-24 space-y-6">
                {/* On This Page Box */}
                <div className="bg-white dark:bg-[#1A201C] border border-[#E4E1D9] dark:border-[#2D352F] rounded-2xl p-6 shadow-2xs">
                  <span className="text-[11px] font-bold tracking-widest text-[#252B27]/60 dark:text-slate-400 uppercase block mb-1">
                    On This Page
                  </span>
                  <div className="font-serif text-lg font-bold text-[#252B27] dark:text-white mb-4">
                    {tool.name} Guide
                  </div>
                  <nav aria-label="Table of contents">
                    <ul className="space-y-2 text-xs sm:text-sm">
                      {editorial.guide.tableOfContents.map((item, idx) => {
                        const sectionId = tocIds[idx];
                        const isActive = activeTocIndex === idx;
                        return (
                          <li key={idx}>
                            <a
                              href={`#${sectionId}`}
                              onClick={(e) => handleTocClick(e, sectionId, idx)}
                                className={`flex items-center gap-2 py-1.5 px-2.5 -mx-2 rounded-lg transition-colors cursor-pointer ${
                                  isActive
                                    ? 'font-bold text-[#252B27] dark:text-white bg-[#E7EDE7]/80 dark:bg-[#252E28]/80 border border-[#C9D6CA] dark:border-[#35443B]'
                                    : 'text-[#252B27]/80 dark:text-slate-300 hover:text-[#365C4B] dark:hover:text-[#5E917A] hover:bg-[#F7F6F2] dark:hover:bg-[#222924]'
                                }`}
                            >
                              {!isActive && (
                                <ChevronRight className="w-3.5 h-3.5 text-[#365C4B] shrink-0" />
                              )}
                              <span>{item}</span>
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </nav>
                </div>

                {/* Decorative Countdown Disclaimer Card (Specifically for Heart Timer matching reference image) */}
                {tool.slug === 'heart-timer' && (
                  <div className="bg-[#FDF4F5] dark:bg-[#241B1E] border border-[#F2DCE0] dark:border-[#3A282D] rounded-2xl p-4 shadow-2xs">
                    <div className="flex items-start gap-3">
                      <Heart className="w-5 h-5 text-[#D43753] fill-[#D43753] shrink-0 mt-0.5" />
                      <p className="text-xs text-[#252B27]/85 dark:text-slate-200 leading-relaxed">
                        This is a decorative countdown visualization, not a heart-rate monitor, health tracker or medical tool.
                      </p>
                    </div>
                    <div className="flex items-center justify-center gap-2 mt-2.5 text-[#D43753]/50">
                      <span className="h-[1px] w-8 bg-[#E8C5CC] dark:bg-[#4A3238]" />
                      <span className="text-[10px] text-[#D43753]">♥</span>
                      <span className="h-[1px] w-8 bg-[#E8C5CC] dark:bg-[#4A3238]" />
                    </div>
                  </div>
                )}

                {/* Editorial Photo Card with checklist & pull quote */}
                {tool.slug !== 'picture-reveal-timer' && (
                <div className="bg-white dark:bg-[#1A201C] border border-[#E4E1D9] dark:border-[#2D352F] rounded-2xl overflow-hidden shadow-2xs">
                  <div className="relative h-44 bg-[#EAE4DC] dark:bg-[#252B27]">
                    {tool.slug === 'rainbow-timer' ? (
                      /* Custom Pastel Wooden Rainbow Toy Desk Artwork matching mockup */
                      <div className="w-full h-full bg-gradient-to-b from-[#EDE6DA] to-[#DFD5C6] dark:from-[#232925] dark:to-[#1B201D] flex flex-col items-center justify-end p-4 relative overflow-hidden">
                        {/* Desk surface */}
                        <div className="absolute bottom-0 inset-x-0 h-10 bg-[#D7C4AA] dark:bg-[#2C261E] border-t border-[#C4AF93] dark:border-[#3A3228]" />
                        {/* Wooden Rainbow Toy */}
                        <svg viewBox="0 0 200 110" className="w-44 h-28 relative z-10 drop-shadow-md">
                          <path d="M 16 102 A 84 84 0 0 1 184 102" fill="none" stroke="#F472B6" strokeWidth="13" />
                          <path d="M 29 102 A 71 71 0 0 1 171 102" fill="none" stroke="#FB923C" strokeWidth="13" />
                          <path d="M 42 102 A 58 58 0 0 1 158 102" fill="none" stroke="#FACC15" strokeWidth="13" />
                          <path d="M 55 102 A 45 45 0 0 1 145 102" fill="none" stroke="#4ADE80" strokeWidth="13" />
                          <path d="M 68 102 A 32 32 0 0 1 132 102" fill="none" stroke="#38BDF8" strokeWidth="13" />
                          <path d="M 81 102 A 19 19 0 0 1 119 102" fill="none" stroke="#A855F7" strokeWidth="13" />
                        </svg>
                      </div>
                    ) : tool.slug === 'circular-timer' ? (
                      /* Tablet on wooden desk displaying the Circular Timer 05:00 matching mockup */
                      <div className="w-full h-full bg-gradient-to-b from-[#DFD3C3] via-[#D2C2AE] to-[#BFA68A] dark:from-[#24201C] dark:to-[#1B1714] flex flex-col items-center justify-end p-3 relative overflow-hidden">
                        {/* Warm desk surface */}
                        <div className="absolute bottom-0 inset-x-0 h-9 bg-[#A67C52] dark:bg-[#2B2118] border-t border-[#8C643E]" />
                        {/* Tablet Frame */}
                        <div className="relative z-10 w-32 h-32 rounded-xl bg-white dark:bg-[#181E1B] border-[5px] border-[#2C333A] shadow-lg flex items-center justify-center mb-1">
                          <svg viewBox="0 0 100 100" className="w-24 h-24">
                            <circle cx="50" cy="50" r="38" fill="none" stroke="#E5E7EB" strokeWidth="11" />
                            <circle
                              cx="50"
                              cy="50"
                              r="38"
                              fill="none"
                              stroke="#1E7A4C"
                              strokeWidth="11"
                              strokeDasharray="185 239"
                              transform="rotate(-90 50 50)"
                            />
                            <text
                              x="50"
                              y="49"
                              textAnchor="middle"
                              dominantBaseline="middle"
                              className="fill-[#1E2522] dark:fill-white font-bold text-[15px]"
                            >
                              05:00
                            </text>
                            <text
                              x="50"
                              y="62"
                              textAnchor="middle"
                              className="fill-[#64748B] text-[6.5px]"
                            >
                              Time Left
                            </text>
                          </svg>
                        </div>
                      </div>
                    ) : tool.slug === 'radial-timer' ? (
                      /* Tablet on wooden desk displaying the Radial Sunburst Timer 05:00 matching mockup */
                      <div className="w-full h-full bg-gradient-to-b from-[#DFD3C3] via-[#D2C2AE] to-[#BFA68A] dark:from-[#24201C] dark:to-[#1B1714] flex flex-col items-center justify-end p-3 relative overflow-hidden">
                        {/* Warm desk surface */}
                        <div className="absolute bottom-0 inset-x-0 h-9 bg-[#A67C52] dark:bg-[#2B2118] border-t border-[#8C643E]" />
                        {/* Tablet Frame */}
                        <div className="relative z-10 w-32 h-32 rounded-xl bg-white dark:bg-[#181E1B] border-[5px] border-[#2C333A] shadow-lg flex items-center justify-center mb-1">
                          <svg viewBox="0 0 100 100" className="w-24 h-24">
                            {Array.from({ length: 24 }).map((_, i) => {
                              const angle = (i * 360) / 24;
                              const isActive = i < 14;
                              return (
                                <line
                                  key={i}
                                  x1="50"
                                  y1="11"
                                  x2="50"
                                  y2="25"
                                  stroke={isActive ? '#1E7A4C' : '#E2E6E4'}
                                  strokeWidth="3.2"
                                  strokeLinecap="round"
                                  transform={`rotate(${angle} 50 50)`}
                                />
                              );
                            })}
                            <text
                              x="50"
                              y="49"
                              textAnchor="middle"
                              dominantBaseline="middle"
                              className="fill-[#1E2522] dark:fill-white font-bold text-[14px]"
                            >
                              05:00
                            </text>
                            <text
                              x="50"
                              y="61"
                              textAnchor="middle"
                              className="fill-[#64748B] text-[6px]"
                            >
                              Time Left
                            </text>
                          </svg>
                        </div>
                      </div>
                    ) : tool.slug === 'rings-timer' ? (
                      /* Tablet on wooden desk displaying the Concentric Rings Timer 05:00 matching mockup */
                      <div className="w-full h-full bg-gradient-to-b from-[#DFD3C3] via-[#D2C2AE] to-[#BFA68A] dark:from-[#24201C] dark:to-[#1B1714] flex flex-col items-center justify-end p-3 relative overflow-hidden">
                        {/* Warm desk surface */}
                        <div className="absolute bottom-0 inset-x-0 h-9 bg-[#A67C52] dark:bg-[#2B2118] border-t border-[#8C643E]" />
                        {/* Tablet Frame */}
                        <div className="relative z-10 w-32 h-32 rounded-xl bg-white dark:bg-[#181E1B] border-[5px] border-[#2C333A] shadow-lg flex items-center justify-center mb-1">
                          <svg viewBox="0 0 100 100" className="w-24 h-24">
                            <circle cx="50" cy="50" r="41" fill="none" stroke="#E5E7EB" strokeWidth="5.5" />
                            <circle cx="50" cy="50" r="33" fill="none" stroke="#E5E7EB" strokeWidth="5.5" />
                            <circle cx="50" cy="50" r="25" fill="none" stroke="#E5E7EB" strokeWidth="5.5" />
                            <circle
                              cx="50"
                              cy="50"
                              r="41"
                              fill="none"
                              stroke="#22C55E"
                              strokeWidth="5.5"
                              strokeLinecap="round"
                              strokeDasharray="185 258"
                              transform="rotate(-90 50 50)"
                            />
                            <circle
                              cx="50"
                              cy="50"
                              r="33"
                              fill="none"
                              stroke="#1D8CF8"
                              strokeWidth="5.5"
                              strokeLinecap="round"
                              strokeDasharray="140 207"
                              transform="rotate(-90 50 50)"
                            />
                            <circle
                              cx="50"
                              cy="50"
                              r="25"
                              fill="none"
                              stroke="#F97316"
                              strokeWidth="5.5"
                              strokeLinecap="round"
                              strokeDasharray="122 157"
                              transform="rotate(-90 50 50)"
                            />
                            <text
                              x="50"
                              y="49"
                              textAnchor="middle"
                              dominantBaseline="middle"
                              className="fill-[#1E2522] dark:fill-white font-bold text-[13px]"
                            >
                              05:00
                            </text>
                            <text
                              x="50"
                              y="59"
                              textAnchor="middle"
                              className="fill-[#64748B] text-[5.5px]"
                            >
                              Time Left
                            </text>
                          </svg>
                        </div>
                      </div>
                    ) : tool.slug === 'progress-timer' ? (
                      /* Laptop on wooden desk displaying the Progress Timer 05:00 matching mockup */
                      <div className="w-full h-full bg-gradient-to-b from-[#DFD3C3] via-[#D2C2AE] to-[#BFA68A] dark:from-[#24201C] dark:to-[#1B1714] flex flex-col items-center justify-end p-3 relative overflow-hidden">
                        {/* Warm desk surface */}
                        <div className="absolute bottom-0 inset-x-0 h-8 bg-[#A67C52] dark:bg-[#2B2118] border-t border-[#8C643E]" />
                        {/* Laptop Screen Frame */}
                        <div className="relative z-10 w-40 h-28 rounded-t-xl bg-white dark:bg-[#181E1B] border-[4px] border-[#2C333A] shadow-lg flex flex-col justify-between p-2.5">
                          <div className="flex items-center justify-between border border-gray-200 dark:border-gray-700 rounded px-1.5 py-0.5 text-[7px] text-gray-600 dark:text-gray-300">
                            <span>Study Session</span>
                            <span>×</span>
                          </div>
                          <div className="text-center my-0.5">
                            <div className="font-mono font-bold text-sm text-[#1A241E] dark:text-white leading-none">
                              05:00
                            </div>
                            <div className="text-[6px] text-gray-500 mt-0.5">Time Left</div>
                          </div>
                          <div>
                            <div className="w-full h-3.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex items-center justify-between pr-1.5">
                              <div className="h-full w-[78%] bg-[#22B567] rounded-l-full" />
                              <span className="text-[6.5px] font-bold text-gray-800 dark:text-gray-100">83%</span>
                            </div>
                            <div className="flex justify-between text-[5.5px] text-gray-500 mt-0.5">
                              <span>Elapsed: 1:00</span>
                              <span>Total: 6:00</span>
                            </div>
                          </div>
                        </div>
                        {/* Laptop Base */}
                        <div className="relative z-10 w-44 h-2 bg-[#475569] rounded-b-md shadow-md mb-0.5" />
                      </div>
                    ) : tool.slug === 'pixel-timer' ? (
                      /* Retro LED Pixel Display Frame on wooden desk showing 05:00 matching mockup */
                      <div className="w-full h-full bg-gradient-to-b from-[#DFD3C3] via-[#D2C2AE] to-[#BFA68A] dark:from-[#24201C] dark:to-[#1B1714] flex flex-col items-center justify-end p-3 relative overflow-hidden">
                        {/* Warm desk surface */}
                        <div className="absolute bottom-0 inset-x-0 h-8 bg-[#A67C52] dark:bg-[#2B2118] border-t border-[#8C643E]" />
                        {/* Square Dark LED Pixel Matrix Frame */}
                        <div className="relative z-10 w-28 h-28 rounded-xl bg-[#181B1A] border-[5px] border-[#2C312E] shadow-lg p-1.5 flex items-center justify-center mb-1">
                          <div className="grid grid-cols-10 gap-[1.5px] w-full h-full">
                            {Array.from({ length: 100 }).map((_, idx) => {
                              const r = Math.floor(idx / 10);
                              const c = idx % 10;
                              const diag = r + c;
                              const isLit = diag < 10;
                              const colors = ['#EF4444', '#F97316', '#FACC15', '#22C55E', '#38BDF8'];
                              const color = isLit ? colors[Math.min(4, Math.floor(diag / 2))] : '#2A302D';
                              return (
                                <div
                                  key={idx}
                                  className="rounded-[1px]"
                                  style={{ backgroundColor: color }}
                                />
                              );
                            })}
                          </div>
                          <div className="absolute px-2 py-0.5 rounded bg-[#181B1A]/95 border border-white/10 font-mono font-bold text-xs text-white tracking-wider shadow">
                            05:00
                          </div>
                        </div>
                      </div>
                    ) : tool.slug === 'blocks-timer' ? (
                      /* Stack of 6 Colorful 3D Wooden Blocks on warm wooden desk matching mockup */
                      <div className="w-full h-full bg-gradient-to-b from-[#E5DAC9] via-[#D8C8B2] to-[#C4AE92] dark:from-[#24201C] dark:to-[#1B1714] flex flex-col items-center justify-end p-3 relative overflow-hidden">
                        {/* Warm desk surface */}
                        <div className="absolute bottom-0 inset-x-0 h-9 bg-[#B68D62] dark:bg-[#2B2118] border-t border-[#9B7349]" />
                        {/* 3D Stacked Blocks SVG */}
                        <svg viewBox="0 0 120 140" className="w-28 h-34 relative z-10 drop-shadow-md mb-1">
                          {[
                            { y: 12, front: '#E53935', top: '#EF5350', side: '#C62828' },
                            { y: 31, front: '#FB8C00', top: '#FFA726', side: '#EF6C00' },
                            { y: 50, front: '#FDD835', top: '#FFEE58', side: '#F9A825' },
                            { y: 69, front: '#43A047', top: '#66BB6A', side: '#2E7D32' },
                            { y: 88, front: '#1E88E5', top: '#42A5F5', side: '#1565C0' },
                            { y: 107, front: '#8E24AA', top: '#AB47BC', side: '#6A1B9A' },
                          ].map((b, i) => (
                            <g key={i}>
                              {/* Top face */}
                              <polygon
                                points={`28,${b.y} 38,${b.y - 6} 92,${b.y - 6} 82,${b.y}`}
                                fill={b.top}
                              />
                              {/* Front face */}
                              <rect
                                x="28"
                                y={b.y}
                                width="54"
                                height="18"
                                rx="1.5"
                                fill={b.front}
                              />
                              {/* Right 3D side face */}
                              <polygon
                                points={`82,${b.y} 92,${b.y - 6} 92,${b.y + 12} 82,${b.y + 18}`}
                                fill={b.side}
                              />
                            </g>
                          ))}
                        </svg>
                      </div>
                    ) : tool.slug === 'candle-timer' ? (
                      /* Forest Green Pillar Candle burning on warm wooden desk matching mockup */
                      <div className="w-full h-full bg-gradient-to-b from-[#DFD0BC] via-[#CEB99E] to-[#B49A7B] dark:from-[#24201C] dark:to-[#1B1714] flex flex-col items-center justify-end p-3 relative overflow-hidden">
                        {/* Warm ambient flame radial glow */}
                        <div
                          className="absolute top-2 w-28 h-28 rounded-full opacity-70 blur-xl pointer-events-none"
                          style={{
                            background: 'radial-gradient(circle, rgba(255,196,87,0.8) 0%, rgba(255,140,40,0) 70%)',
                          }}
                        />
                        {/* Warm desk surface */}
                        <div className="absolute bottom-0 inset-x-0 h-8 bg-[#8D633A] dark:bg-[#2B2118] border-t border-[#734E2A]" />
                        {/* Forest Green Candle SVG */}
                        <svg viewBox="0 0 120 140" className="w-28 h-34 relative z-10 drop-shadow-md mb-0.5">
                          <defs>
                            <linearGradient id="sidebarGreenWax" x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor="#657D5E" />
                              <stop offset="45%" stopColor="#4F6849" />
                              <stop offset="100%" stopColor="#354931" />
                            </linearGradient>
                          </defs>
                          {/* Wooden coaster */}
                          <ellipse cx="60" cy="126" rx="34" ry="6" fill="#5C3D20" />
                          {/* Candle body */}
                          <path
                            d="M36 52 L84 52 L84 122 C84 126, 36 126, 36 122 Z"
                            fill="url(#sidebarGreenWax)"
                          />
                          {/* Top illuminated wax rim */}
                          <ellipse cx="60" cy="52" rx="24" ry="5" fill="#9BB08E" />
                          <ellipse cx="60" cy="52" rx="18" ry="3.2" fill="#D5DEC2" />
                          {/* Wick */}
                          <line x1="60" y1="45" x2="60" y2="52" stroke="#2B2118" strokeWidth="1.8" strokeLinecap="round" />
                          {/* Flame outer */}
                          <path
                            d="M60 18 C67 28, 68 39, 60 46 C52 39, 53 28, 60 18 Z"
                            fill="#F59E0B"
                          />
                          {/* Flame inner */}
                          <path
                            d="M60 25 C64 32, 64 39, 60 44 C56 39, 56 32, 60 25 Z"
                            fill="#FEF08A"
                          />
                        </svg>
                      </div>
                    ) : tool.slug === 'aesthetic-timer' ? (
                      /* Laptop on warm wooden desk displaying the 25:00 Aesthetic Circular Timer beside coffee mug matching mockup */
                      <div className="w-full h-full bg-gradient-to-b from-[#E5D7C3] via-[#D4BFA4] to-[#BC9F7C] dark:from-[#24201C] dark:to-[#1B1714] flex items-end justify-center p-3 gap-2.5 relative overflow-hidden">
                        {/* Warm desk surface */}
                        <div className="absolute bottom-0 inset-x-0 h-8 bg-[#9A7148] dark:bg-[#2B2118] border-t border-[#7F5A36]" />
                        {/* White ceramic coffee mug on left */}
                        <div className="relative z-10 flex items-center mb-1.5 shrink-0">
                          <div className="w-7 h-8 rounded-b-lg rounded-t-xs bg-[#FAF6F0] border border-[#DFD5C5] shadow-sm" />
                          <div className="w-2.5 h-5 -ml-0.5 rounded-r-full border-2 border-[#FAF6F0]" />
                        </div>
                        {/* Laptop displaying 25:00 Aesthetic Timer */}
                        <div className="relative z-10 flex flex-col items-center mb-0.5">
                          <div className="w-36 h-25 rounded-t-lg bg-[#EFE6D8] border-[3.5px] border-[#2A2E33] shadow-lg flex items-center justify-center">
                            <svg viewBox="0 0 80 80" className="w-18 h-18">
                              <circle cx="40" cy="40" r="28" fill="#FAF5EC" stroke="#E6DAC6" strokeWidth="4.5" />
                              <path
                                d="M 40 12 A 28 28 0 0 1 68 40"
                                fill="none"
                                stroke="#F39C6B"
                                strokeWidth="4.5"
                                strokeLinecap="round"
                              />
                              <text
                                x="40"
                                y="40"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="fill-[#1E2522] font-bold text-[12px]"
                              >
                                25:00
                              </text>
                            </svg>
                          </div>
                          <div className="w-40 h-2 bg-[#CBD5E1] rounded-b-md shadow" />
                        </div>
                      </div>
                    ) : tool.slug === 'heart-timer' ? (
                      /* Custom Heart Desk Clock Displaying 25:00 matching reference image */
                      <div className="w-full h-full bg-gradient-to-b from-[#EFE3DC] to-[#DEC7BA] dark:from-[#261E20] dark:to-[#1B1517] flex flex-col items-center justify-end p-4 relative overflow-hidden">
                        {/* Desk surface */}
                        <div className="absolute bottom-0 inset-x-0 h-11 bg-[#C69C72] dark:bg-[#3A2B22] border-t border-[#B0855B]" />
                        {/* Heart Desk Clock */}
                        <div className="relative z-10 flex flex-col items-center mb-1">
                          <svg viewBox="0 0 120 110" className="w-28 h-24 drop-shadow-md">
                            <path
                              d="M 60 102 C 44 88 10 64 10 35 C 10 17 25 6 42 6 C 52 6 57 12 60 19 C 63 12 68 6 78 6 C 95 6 110 17 110 35 C 110 64 76 88 60 102 Z"
                              fill="#D43753"
                              stroke="#FCE8EC"
                              strokeWidth="5"
                            />
                            <text
                              x="60"
                              y="52"
                              textAnchor="middle"
                              fill="#FFFFFF"
                              fontSize="18"
                              fontWeight="700"
                              fontFamily="sans-serif"
                            >
                              25:00
                            </text>
                            <text
                              x="60"
                              y="68"
                              textAnchor="middle"
                              fill="#FFE4E9"
                              fontSize="10"
                            >
                              ♥
                            </text>
                          </svg>
                          <div className="w-14 h-2 bg-[#FCE8EC] rounded-full -mt-1.5 shadow-xs" />
                        </div>
                      </div>
                    ) : tool.slug === 'moon-timer' ? (
                      /* Custom Night Lake Moon Artwork matching reference image */
                      <div className="w-full h-full bg-gradient-to-b from-[#071124] via-[#102342] to-[#081528] relative overflow-hidden">
                        <svg viewBox="0 0 280 180" className="w-full h-full object-cover">
                          <defs>
                            <radialGradient id="sidebarMoonGlow" cx="62%" cy="32%" r="38%">
                              <stop offset="0%" stopColor="#FFF4D2" stopOpacity="0.6" />
                              <stop offset="55%" stopColor="#F5CF87" stopOpacity="0.2" />
                              <stop offset="100%" stopColor="#071124" stopOpacity="0" />
                            </radialGradient>
                          </defs>
                          <circle cx="174" cy="56" r="65" fill="url(#sidebarMoonGlow)" />
                          {/* Stars */}
                          <circle cx="38" cy="28" r="1" fill="#FFFFFF" opacity="0.75" />
                          <circle cx="76" cy="20" r="1.2" fill="#FFF7D6" opacity="0.85" />
                          <circle cx="112" cy="42" r="0.9" fill="#FFFFFF" opacity="0.65" />
                          <circle cx="238" cy="30" r="1.1" fill="#FFFFFF" opacity="0.8" />
                          {/* Full Moon */}
                          <circle cx="174" cy="56" r="24" fill="#F8E5B8" />
                          <ellipse cx="167" cy="50" rx="6" ry="4.5" fill="#C9A368" opacity="0.35" />
                          <ellipse cx="182" cy="60" rx="7" ry="5" fill="#C9A368" opacity="0.3" />
                          {/* Mountains */}
                          <path
                            d="M 0 118 L 52 92 L 108 112 L 164 90 L 222 112 L 280 96 L 280 130 L 0 130 Z"
                            fill="#0D1D36"
                          />
                          {/* Lake & Shimmering Reflection */}
                          <rect x="0" y="122" width="280" height="58" fill="#071326" />
                          <ellipse cx="174" cy="129" rx="18" ry="2.4" fill="#F8E5B8" opacity="0.65" />
                          <ellipse cx="174" cy="136" rx="14" ry="2" fill="#F5CF87" opacity="0.5" />
                          <ellipse cx="174" cy="143" rx="10" ry="1.6" fill="#F5CF87" opacity="0.38" />
                          <ellipse cx="174" cy="150" rx="6" ry="1.2" fill="#E5BA6E" opacity="0.25" />
                          {/* Pine trees */}
                          <path
                            d="M 12 126 L 22 92 L 32 126 Z M 28 126 L 36 100 L 44 126 Z M 234 126 L 246 88 L 258 126 Z M 252 126 L 264 80 L 276 126 Z"
                            fill="#040A14"
                          />
                        </svg>
                      </div>
                    ) : tool.slug === 'sun-timer' ? (
                      /* Custom Warm Golden Sun Over Mountain Lake Artwork matching reference image */
                      <div className="w-full h-full bg-gradient-to-b from-[#E58A52] via-[#F5B766] to-[#FCE09C] relative overflow-hidden">
                        <svg viewBox="0 0 280 180" className="w-full h-full object-cover">
                          <defs>
                            <linearGradient id="sidebarSunSky" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#DF7C4A" />
                              <stop offset="55%" stopColor="#F4B460" />
                              <stop offset="100%" stopColor="#FCE29C" />
                            </linearGradient>
                            <radialGradient id="sidebarSunGlow" cx="50%" cy="48%" r="42%">
                              <stop offset="0%" stopColor="#FFFDF5" stopOpacity="0.9" />
                              <stop offset="50%" stopColor="#FFE180" stopOpacity="0.4" />
                              <stop offset="100%" stopColor="#F4B460" stopOpacity="0" />
                            </radialGradient>
                          </defs>
                          <rect x="0" y="0" width="280" height="180" fill="url(#sidebarSunSky)" />
                          {/* Sun Glow & Disc */}
                          <circle cx="140" cy="84" r="65" fill="url(#sidebarSunGlow)" />
                          <circle cx="140" cy="84" r="21" fill="#FFFBE8" />
                          {/* Mountains */}
                          <path
                            d="M 0 122 L 48 96 L 96 114 L 140 106 L 188 114 L 236 94 L 280 112 L 280 132 L 0 132 Z"
                            fill="#734844"
                          />
                          <path
                            d="M 0 128 L 68 108 L 128 124 L 194 110 L 280 124 L 280 134 L 0 134 Z"
                            fill="#4B2F33"
                          />
                          {/* Lake & Golden Reflection */}
                          <rect x="0" y="128" width="280" height="52" fill="#D98245" />
                          <ellipse cx="140" cy="134" rx="22" ry="2.4" fill="#FFF8D6" opacity="0.8" />
                          <ellipse cx="140" cy="141" rx="17" ry="2" fill="#FFE48F" opacity="0.65" />
                          <ellipse cx="140" cy="148" rx="13" ry="1.7" fill="#FFE48F" opacity="0.5" />
                          <ellipse cx="140" cy="155" rx="9" ry="1.4" fill="#F9C86B" opacity="0.35" />
                          {/* Left & Right Pine Trees */}
                          <path
                            d="M 10 134 L 22 86 L 34 134 Z M 28 134 L 38 98 L 48 134 Z M 232 134 L 242 96 L 252 134 Z M 246 134 L 258 84 L 270 134 Z"
                            fill="#1F1A22"
                          />
                        </svg>
                      </div>
                    ) : tool.slug === 'bubble-timer' ? (
                      /* Custom Underwater Coral Reef & Rising Bubbles Artwork matching reference image */
                      <div className="w-full h-full bg-gradient-to-b from-[#6CC2EC] via-[#2C86C1] to-[#175282] relative overflow-hidden">
                        <svg viewBox="0 0 280 180" className="w-full h-full object-cover">
                          <defs>
                            <linearGradient id="sidebarBubbleSea" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#7AD0F5" />
                              <stop offset="55%" stopColor="#2E8BC6" />
                              <stop offset="100%" stopColor="#165182" />
                            </linearGradient>
                            <radialGradient id="sidebarBubbleSphere" cx="32%" cy="28%" r="70%">
                              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
                              <stop offset="40%" stopColor="#BAE8FF" stopOpacity="0.45" />
                              <stop offset="80%" stopColor="#4BA8E5" stopOpacity="0.25" />
                              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.7" />
                            </radialGradient>
                          </defs>
                          <rect x="0" y="0" width="280" height="180" fill="url(#sidebarBubbleSea)" />
                          {/* Light rays */}
                          <g opacity="0.22">
                            <polygon points="35,0 90,0 145,180 70,180" fill="#FFFFFF" />
                            <polygon points="130,0 190,0 245,180 175,180" fill="#FFFFFF" />
                          </g>
                          {/* Sandy ocean floor */}
                          <path
                            d="M 0 148 Q 70 138 145 146 T 280 144 L 280 180 L 0 180 Z"
                            fill="#E6C79C"
                          />
                          <path
                            d="M 0 158 Q 95 148 180 156 T 280 154 L 280 180 L 0 180 Z"
                            fill="#D4B07B"
                          />
                          {/* Coral & Sea Plants on Left & Right */}
                          <path
                            d="M 14 156 C 8 132 24 114 16 94 C 24 112 18 134 26 156 Z M 28 158 C 24 136 38 120 30 102 C 38 118 32 138 40 158 Z"
                            fill="#228B68"
                          />
                          <circle cx="42" cy="146" r="14" fill="#F08CAE" opacity="0.9" />
                          <circle cx="24" cy="150" r="11" fill="#F5A3B7" opacity="0.9" />
                          <path
                            d="M 248 156 C 240 130 258 110 248 88 C 258 110 248 132 260 156 Z M 262 158 C 256 136 270 118 262 100 C 270 118 264 138 272 158 Z"
                            fill="#1E7D5E"
                          />
                          <circle cx="236" cy="148" r="12" fill="#F294B4" opacity="0.88" />
                          {/* Central & Surrounding Rising Bubbles */}
                          {[
                            { cx: 140, cy: 84, r: 28 },
                            { cx: 88, cy: 76, r: 15 },
                            { cx: 194, cy: 68, r: 17 },
                            { cx: 108, cy: 118, r: 12 },
                            { cx: 178, cy: 114, r: 13 },
                            { cx: 64, cy: 106, r: 10 },
                            { cx: 216, cy: 104, r: 11 },
                            { cx: 132, cy: 36, r: 10 },
                            { cx: 164, cy: 42, r: 8 },
                          ].map((b, i) => (
                            <g key={i}>
                              <circle
                                cx={b.cx}
                                cy={b.cy}
                                r={b.r}
                                fill="url(#sidebarBubbleSphere)"
                                stroke="#FFFFFF"
                                strokeWidth="1"
                                strokeOpacity="0.8"
                              />
                              <ellipse
                                cx={b.cx - b.r * 0.3}
                                cy={b.cy - b.r * 0.3}
                                rx={b.r * 0.22}
                                ry={b.r * 0.12}
                                transform={`rotate(-35 ${b.cx - b.r * 0.3} ${b.cy - b.r * 0.3})`}
                                fill="#FFFFFF"
                                opacity="0.85"
                              />
                            </g>
                          ))}
                        </svg>
                      </div>
                    ) : tool.slug === 'coral-timer' ? (
                      /* Custom Underwater Coral Reef & Clownfish Quote Card Artwork matching reference screenshot */
                      <div className="w-full h-full relative overflow-hidden">
                        <svg viewBox="0 0 280 180" className="w-full h-full">
                          <defs>
                            <linearGradient id="sidebarCoralSea" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#1CB5E0" />
                              <stop offset="60%" stopColor="#0B6DA8" />
                              <stop offset="100%" stopColor="#073D6B" />
                            </linearGradient>
                          </defs>
                          <rect x="0" y="0" width="280" height="180" fill="url(#sidebarCoralSea)" />
                          {/* Sunbeams */}
                          <g opacity="0.22">
                            <polygon points="45,0 100,0 155,180 75,180" fill="#FFFFFF" />
                            <polygon points="145,0 205,0 255,180 180,180" fill="#FFFFFF" />
                          </g>
                          {/* Sandy ocean floor */}
                          <path d="M 0 150 Q 75 138 150 146 T 280 144 L 280 180 L 0 180 Z" fill="#E6C79C" />
                          {/* Left & Right Branching Coral Clusters */}
                          <path
                            d="M 38 156 C 38 134, 24 118, 18 102 M 38 142 C 50 128, 60 114, 64 100"
                            stroke="#F35B4F"
                            strokeWidth="7"
                            strokeLinecap="round"
                            fill="none"
                          />
                          <path
                            d="M 236 156 C 236 134, 222 116, 214 98 M 236 140 C 248 124, 260 110, 264 94"
                            stroke="#F35B4F"
                            strokeWidth="7.5"
                            strokeLinecap="round"
                            fill="none"
                          />
                          <ellipse cx="22" cy="154" rx="22" ry="12" fill="#9B4DCA" opacity="0.88" />
                          <ellipse cx="258" cy="154" rx="24" ry="13" fill="#EC4899" opacity="0.88" />
                          {/* Clownfish */}
                          <g transform="translate(88, 96)">
                            <path d="M-14 0 L-20 -5.5 L-20 5.5 Z" fill="#FF6D00" />
                            <ellipse cx="-3" cy="0" rx="12" ry="7" fill="#FF6D00" />
                            <path d="M-8 -6.5 Q-6 0 -8 6.5" stroke="#FFFFFF" strokeWidth="2.5" fill="none" />
                            <path d="M0 -7 Q2 0 0 7" stroke="#FFFFFF" strokeWidth="2.5" fill="none" />
                            <circle cx="5" cy="-1.2" r="1.4" fill="#111827" />
                          </g>
                          {/* Yellow Fish */}
                          <g transform="translate(166, 112)">
                            <path d="M-10 0 L-15 -4.5 L-15 4.5 Z" fill="#FACC15" />
                            <ellipse cx="-2" cy="0" rx="8.5" ry="5.5" fill="#FDE047" />
                            <circle cx="2.5" cy="-1" r="1.1" fill="#1E293B" />
                          </g>
                        </svg>
                      </div>
                    ) : tool.slug === 'lichen-timer' ? (
                      /* Custom Close-up Foliose Lichen on Forest Stone Quote Card Artwork matching reference screenshot */
                      <div className="w-full h-full relative overflow-hidden">
                        <svg viewBox="0 0 280 180" className="w-full h-full">
                          <rect x="0" y="0" width="280" height="180" fill="#3B3A35" />
                          <polygon points="0,0 160,0 90,180 0,180" fill="#484640" opacity="0.6" />
                          <path d="M 155 0 L 110 95 L 35 180" stroke="#22211E" strokeWidth="3.5" fill="none" />
                          {/* Surrounding Moss */}
                          <circle cx="48" cy="148" r="36" fill="#3D6B37" />
                          <circle cx="235" cy="42" r="38" fill="#4A7A3F" />
                          <circle cx="242" cy="142" r="34" fill="#2E5A36" />
                          {/* Central Foliose Lichen Rosette Cluster */}
                          {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((deg) => (
                            <g key={deg} transform={`translate(140, 92) rotate(${deg})`}>
                              <ellipse
                                cx="30"
                                cy="0"
                                rx="28"
                                ry="18"
                                fill="#7E9F8B"
                                stroke="#C9E2CE"
                                strokeWidth="2"
                              />
                              <ellipse cx="22" cy="-3" rx="18" ry="11" fill="#9ABBA6" />
                            </g>
                          ))}
                          <circle cx="140" cy="92" r="24" fill="#8EB39C" stroke="#D5EAD9" strokeWidth="2" />
                          {/* Amber Apothecia Cups */}
                          <circle cx="132" cy="86" r="6" fill="#C88A4B" stroke="#E2F0E5" strokeWidth="1.8" />
                          <circle cx="150" cy="96" r="5" fill="#B36A3E" stroke="#E2F0E5" strokeWidth="1.5" />
                          <circle cx="138" cy="103" r="4" fill="#D49B4B" stroke="#E2F0E5" strokeWidth="1.4" />
                        </svg>
                      </div>
                    ) : tool.slug === 'frost-timer' ? (
                      /* Custom Frosted Window Pane Overlooking Sunrise Pines Quote Card Artwork matching reference screenshot */
                      <div className="w-full h-full relative overflow-hidden">
                        <svg viewBox="0 0 280 180" className="w-full h-full" shapeRendering="geometricPrecision">
                          <defs>
                            <radialGradient id="sidebarFrostSun" cx="62%" cy="55%" r="55%">
                              <stop offset="0%" stopColor="#FFF5DC" stopOpacity="0.95" />
                              <stop offset="42%" stopColor="#F2B172" stopOpacity="0.58" />
                              <stop offset="100%" stopColor="#1D3658" stopOpacity="0" />
                            </radialGradient>
                          </defs>
                          <rect x="0" y="0" width="280" height="180" fill="#1F3B61" />
                          <rect x="0" y="0" width="280" height="180" fill="url(#sidebarFrostSun)" />
                          <circle cx="174" cy="99" r="16" fill="#FFFDF5" opacity="0.9" />
                          {/* Crisp Winter Mountains & Pine Silhouettes */}
                          <polygon points="0,142 52,114 108,136 168,112 228,134 280,116 280,180 0,180" fill="#182F4F" />
                          <polygon points="44,180 70,76 96,180" fill="#10223A" />
                          <polygon points="82,180 104,94 126,180" fill="#152B47" />
                          <polygon points="182,180 208,82 234,180" fill="#10223A" />
                          {/* Crisp Multi-Layered Window Frost Ferns on Edges */}
                          <g stroke="#164273" strokeLinecap="round" opacity="0.55" transform="translate(0.8, 0.8)">
                            <line x1="0" y1="0" x2="92" y2="66" strokeWidth="2.5" />
                            <line x1="280" y1="0" x2="188" y2="66" strokeWidth="2.5" />
                            <line x1="0" y1="180" x2="96" y2="114" strokeWidth="2.5" />
                            <line x1="280" y1="180" x2="184" y2="114" strokeWidth="2.5" />
                          </g>
                          <g stroke="#E2F1FF" strokeLinecap="round">
                            <line x1="0" y1="0" x2="92" y2="66" strokeWidth="2.2" />
                            <line x1="26" y1="18" x2="52" y2="8" strokeWidth="1.6" />
                            <line x1="26" y1="18" x2="14" y2="42" strokeWidth="1.6" />
                            <line x1="54" y1="38" x2="78" y2="28" strokeWidth="1.4" />
                            <line x1="54" y1="38" x2="42" y2="58" strokeWidth="1.4" />
                            <line x1="280" y1="0" x2="188" y2="66" strokeWidth="2.2" />
                            <line x1="254" y1="18" x2="228" y2="8" strokeWidth="1.6" />
                            <line x1="254" y1="18" x2="266" y2="42" strokeWidth="1.6" />
                            <line x1="226" y1="38" x2="202" y2="28" strokeWidth="1.4" />
                            <line x1="0" y1="180" x2="96" y2="114" strokeWidth="2.3" />
                            <line x1="32" y1="158" x2="18" y2="128" strokeWidth="1.6" />
                            <line x1="32" y1="158" x2="62" y2="168" strokeWidth="1.6" />
                            <line x1="62" y1="138" x2="48" y2="114" strokeWidth="1.4" />
                            <line x1="280" y1="180" x2="184" y2="114" strokeWidth="2.3" />
                            <line x1="248" y1="158" x2="262" y2="128" strokeWidth="1.6" />
                            <line x1="248" y1="158" x2="218" y2="168" strokeWidth="1.6" />
                          </g>
                          <g stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round">
                            <line x1="0" y1="0" x2="82" y2="58" />
                            <line x1="280" y1="0" x2="198" y2="58" />
                            <line x1="0" y1="180" x2="86" y2="122" />
                            <line x1="280" y1="180" x2="194" y2="122" />
                          </g>
                        </svg>
                      </div>
                    ) : tool.slug === 'snow-timer' ? (
                      /* Custom Peaceful Winter Sunrise Over Snowy Pine Forest Quote Card Artwork matching reference screenshot */
                      <div className="w-full h-full relative overflow-hidden">
                        <svg viewBox="0 0 280 180" className="w-full h-full" shapeRendering="geometricPrecision">
                          <defs>
                            <linearGradient id="sidebarSnowSky" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#3B5D8A" />
                              <stop offset="52%" stopColor="#8AA7C9" />
                              <stop offset="100%" stopColor="#F5D3B0" />
                            </linearGradient>
                            <radialGradient id="sidebarSnowSun" cx="56%" cy="62%" r="50%">
                              <stop offset="0%" stopColor="#FFF7DC" stopOpacity="0.98" />
                              <stop offset="45%" stopColor="#F7B977" stopOpacity="0.65" />
                              <stop offset="100%" stopColor="#3B5D8A" stopOpacity="0" />
                            </radialGradient>
                          </defs>
                          <rect x="0" y="0" width="280" height="180" fill="url(#sidebarSnowSky)" />
                          <rect x="0" y="0" width="280" height="180" fill="url(#sidebarSnowSun)" />
                          <circle cx="156" cy="110" r="16" fill="#FFFDF5" opacity="0.94" />
                          {/* Distant Snowy Mountain Peaks */}
                          <polygon points="0,138 56,94 114,128 176,88 232,126 280,98 280,180 0,180" fill="#6382AA" />
                          <polygon points="56,94 40,107 52,105 62,111 72,106" fill="#F0F7FF" opacity="0.9" />
                          <polygon points="176,88 158,103 171,100 182,107 194,101" fill="#F0F7FF" opacity="0.9" />
                          {/* Snowy Evergreen Pines Framing Left & Right */}
                          <g fill="#1F3B5C">
                            <polygon points="-6,162 24,52 54,162" />
                            <polygon points="28,164 52,74 76,164" />
                            <polygon points="62,166 80,96 98,166" />
                            <polygon points="192,166 212,88 232,166" />
                            <polygon points="218,164 246,56 274,164" />
                          </g>
                          {/* Crisp Snow Caps on Pines */}
                          <g fill="#EBF5FF" opacity="0.9">
                            <path d="M 24 52 L 12 84 Q 24 80 36 84 Z" />
                            <path d="M 52 74 L 42 100 Q 52 96 62 100 Z" />
                            <path d="M 246 56 L 234 88 Q 246 84 258 88 Z" />
                          </g>
                          {/* Layered Snowbank Along Bottom */}
                          <path d="M 0 144 Q 80 132 155 144 T 280 138 L 280 180 L 0 180 Z" fill="#D5E6F7" />
                          <path d="M 0 156 Q 105 144 195 156 T 280 150 L 280 180 L 0 180 Z" fill="#F3F9FF" />
                          {/* Gentle Snowflakes */}
                          <g fill="#FFFFFF" opacity="0.9">
                            <circle cx="38" cy="26" r="1.8" />
                            <circle cx="92" cy="42" r="2.1" />
                            <circle cx="136" cy="24" r="1.7" />
                            <circle cx="188" cy="36" r="2.2" />
                            <circle cx="234" cy="28" r="1.8" />
                            <circle cx="116" cy="68" r="1.9" />
                            <circle cx="168" cy="62" r="1.6" />
                          </g>
                        </svg>
                      </div>
                    ) : tool.slug === 'galaxy-timer' ? (
                      /* Custom Stargazer Silhouette Watching Milky Way Galaxy Quote Card Artwork matching reference screenshot */
                      <div className="w-full h-full relative overflow-hidden">
                        <svg viewBox="0 0 280 180" className="w-full h-full" shapeRendering="geometricPrecision">
                          <defs>
                            <linearGradient id="sidebarGalaxySky" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#090721" />
                              <stop offset="48%" stopColor="#2E1A68" />
                              <stop offset="78%" stopColor="#8338EC" />
                              <stop offset="100%" stopColor="#FDBA74" />
                            </linearGradient>
                            <linearGradient id="milkyWayBand" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#C084FC" stopOpacity="0.15" />
                              <stop offset="50%" stopColor="#F5D0FE" stopOpacity="0.65" />
                              <stop offset="100%" stopColor="#FDE68A" stopOpacity="0.4" />
                            </linearGradient>
                          </defs>
                          <rect x="0" y="0" width="280" height="180" fill="url(#sidebarGalaxySky)" />
                          {/* Diagonal Milky Way Nebula Band */}
                          <ellipse cx="145" cy="76" rx="145" ry="38" transform="rotate(26 145 76)" fill="url(#milkyWayBand)" />
                          {/* Starfield */}
                          <g fill="#FFFFFF" opacity="0.9">
                            <circle cx="32" cy="24" r="1.4" />
                            <circle cx="68" cy="36" r="1.8" />
                            <circle cx="104" cy="22" r="1.3" />
                            <circle cx="142" cy="48" r="2.0" />
                            <circle cx="188" cy="28" r="1.5" />
                            <circle cx="228" cy="42" r="1.9" />
                            <circle cx="256" cy="22" r="1.3" />
                            <circle cx="168" cy="74" r="1.7" />
                            <circle cx="212" cy="88" r="1.6" />
                          </g>
                          {/* Distant Horizon Mountains */}
                          <polygon points="0,152 64,132 128,146 196,128 280,144 280,180 0,180" fill="#2A154B" />
                          {/* Foreground Rocky Ridge & Seated Stargazer Silhouette on Left */}
                          <path d="M 0 136 Q 58 134 118 156 L 154 180 L 0 180 Z" fill="#120826" />
                          {/* Seated Stargazer Silhouette */}
                          <g fill="#0D051D" transform="translate(52, 96)">
                            <circle cx="14" cy="8" r="5.5" />
                            <path d="M 8 15 Q 14 14 19 20 L 22 36 L 34 38 L 37 48 L 32 49 L 28 41 L 12 41 Q 7 40 7 32 Z" />
                          </g>
                        </svg>
                      </div>
                    ) : tool.slug === 'lava-lamp-timer' ? (
                      /* Custom Glowing Retro Lava Lamp on Wooden Desk Beside Potted Plant Quote Card Artwork matching reference screenshot */
                      <div className="w-full h-full relative overflow-hidden">
                        <svg viewBox="0 0 280 180" className="w-full h-full" shapeRendering="geometricPrecision">
                          <defs>
                            <radialGradient id="sidebarLavaGlow" cx="52%" cy="48%" r="56%">
                              <stop offset="0%" stopColor="#FFB74D" stopOpacity="0.85" />
                              <stop offset="45%" stopColor="#D81B60" stopOpacity="0.45" />
                              <stop offset="100%" stopColor="#2A1023" stopOpacity="0" />
                            </radialGradient>
                            <linearGradient id="sidebarLavaChamber" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#7B114B" />
                              <stop offset="55%" stopColor="#D81B60" />
                              <stop offset="100%" stopColor="#FF6F00" />
                            </linearGradient>
                            <radialGradient id="sidebarLavaBlob" cx="38%" cy="35%" r="65%">
                              <stop offset="0%" stopColor="#FFF59D" />
                              <stop offset="52%" stopColor="#FFA000" />
                              <stop offset="100%" stopColor="#E65100" />
                            </radialGradient>
                          </defs>
                          <rect x="0" y="0" width="280" height="180" fill="#2A1023" />
                          <rect x="0" y="0" width="280" height="180" fill="url(#sidebarLavaGlow)" />
                          {/* Potted Plant on Left */}
                          <g transform="translate(36, 98)">
                            <polygon points="8,18 36,18 32,46 12,46" fill="#B86B43" />
                            <g fill="#2E6F3E">
                              <ellipse cx="6" cy="8" rx="15" ry="7" transform="rotate(-26 6 8)" />
                              <ellipse cx="22" cy="-2" rx="16" ry="7" transform="rotate(-62 22 -2)" />
                              <ellipse cx="36" cy="6" rx="15" ry="7" transform="rotate(24 36 6)" />
                            </g>
                          </g>
                          {/* Warm Wooden Table */}
                          <rect x="0" y="142" width="280" height="38" fill="#4A2116" />
                          <line x1="0" y1="142" x2="280" y2="142" stroke="#7A3B28" strokeWidth="2" />
                          {/* Central Retro Lava Lamp */}
                          <g transform="translate(148, 8)">
                            <polygon points="-10,6 10,6 15,24 -15,24" fill="#E2E8F0" />
                            <polygon
                              points="-15,24 15,24 31,90 22,114 -22,114 -31,90"
                              fill="url(#sidebarLavaChamber)"
                              stroke="rgba(255,255,255,0.45)"
                              strokeWidth="1.4"
                            />
                            <ellipse cx="0" cy="108" rx="18" ry="6" fill="url(#sidebarLavaBlob)" />
                            <path
                              d="M -11 108 C -7 90 -17 78 -12 64 C -8 52 8 52 12 64 C 17 78 7 90 11 108 Z"
                              fill="url(#sidebarLavaBlob)"
                            />
                            <circle cx="-3" cy="40" r="8" fill="url(#sidebarLavaBlob)" />
                            <circle cx="10" cy="54" r="5" fill="url(#sidebarLavaBlob)" />
                            <circle cx="-12" cy="82" r="5" fill="url(#sidebarLavaBlob)" />
                            <polygon points="-22,114 22,114 29,144 -29,144" fill="#CBD5E1" />
                          </g>
                        </svg>
                      </div>
                    ) : tool.slug === 'spinner-timer' ? (
                      /* Custom Glowing Green Segmented Spinner Dial Quote Card Artwork matching reference screenshot */
                      <div className="w-full h-full relative overflow-hidden bg-gradient-to-b from-[#112618] to-[#0B170F] flex items-center justify-center">
                        <svg viewBox="0 0 280 180" className="w-full h-full" shapeRendering="geometricPrecision">
                          <defs>
                            <radialGradient id="sidebarSpinnerGlow" cx="50%" cy="50%" r="52%">
                              <stop offset="0%" stopColor="#4ADE80" stopOpacity="0.32" />
                              <stop offset="65%" stopColor="#166534" stopOpacity="0.16" />
                              <stop offset="100%" stopColor="#0B170F" stopOpacity="0" />
                            </radialGradient>
                          </defs>
                          <rect x="0" y="0" width="280" height="180" fill="#0D1C12" />
                          <circle cx="140" cy="90" r="88" fill="url(#sidebarSpinnerGlow)" />
                          {/* Outer Glowing Dial Circle */}
                          <circle
                            cx="140"
                            cy="90"
                            r="68"
                            fill="#0D1F14"
                            stroke="#4ADE80"
                            strokeWidth="2.5"
                          />
                          {/* 36 Radial Segments around the Dial */}
                          {Array.from({ length: 36 }).map((_, i) => {
                            const deg = -90 + (i * 360) / 36;
                            const isLit = i >= 5;
                            return (
                              <line
                                key={i}
                                x1="140"
                                y1="28"
                                x2="140"
                                y2="43"
                                stroke={isLit ? (i < 18 ? '#D9F99D' : '#22C55E') : '#4B5550'}
                                strokeWidth="3.6"
                                transform={`rotate(${deg} 140 90)`}
                              />
                            );
                          })}
                          {/* Tapered Pointer Needle & Metallic Hub */}
                          <polygon
                            points="137.5,90 142.5,90 140.8,44 139.2,44"
                            fill="#FFFFFF"
                            transform="rotate(52 140 90)"
                          />
                          <circle cx="140" cy="90" r="9.5" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
                          <circle cx="140" cy="90" r="2" fill="#334155" />
                        </svg>
                      </div>
                    ) : (
                      <>
                        <Image
                          src={editorial.quoteCard.src}
                          alt={editorial.quoteCard.alt}
                          fill
                          className="object-cover opacity-90"
                          sizes="(max-width: 1024px) 100vw, 30vw"
                          referrerPolicy="no-referrer"
                        />
                        {editorial.quoteCard.checklist && editorial.quoteCard.checklist.length > 0 && (
                          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-4 text-white">
                            <ul className="text-xs space-y-0.5">
                              {editorial.quoteCard.checklist.map((item, idx) => (
                                <li key={idx} className="flex items-center gap-1.5 font-medium">
                                  <span className="text-[#B7804C]">✓</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  <div
                    className={`p-5 ${
                      tool.slug === 'heart-timer'
                        ? 'bg-[#FDF4F5] dark:bg-[#241B1E] text-center'
                        : tool.slug === 'moon-timer'
                        ? 'bg-[#0B172A] text-center'
                        : tool.slug === 'sun-timer'
                        ? 'bg-[#FDF1E6] dark:bg-[#241E1A] text-center'
                        : tool.slug === 'bubble-timer' || tool.slug === 'coral-timer'
                        ? 'bg-[#EAF4FC] dark:bg-[#16222F] text-center'
                        : tool.slug === 'lichen-timer'
                        ? 'bg-[#EFEFE9] dark:bg-[#1C221E] text-center'
                        : tool.slug === 'frost-timer'
                        ? 'bg-gradient-to-b from-[#2A4A6E] to-[#1E3654] text-center'
                        : tool.slug === 'snow-timer'
                        ? 'bg-[#EEF5FC] dark:bg-[#162230] text-center'
                        : tool.slug === 'galaxy-timer'
                        ? 'bg-gradient-to-b from-[#251447] to-[#170B30] text-center'
                        : tool.slug === 'lava-lamp-timer'
                        ? 'bg-[#F9EFF3] dark:bg-[#241720] text-center'
                        : tool.slug === 'spinner-timer'
                        ? 'bg-[#EDF5EC] dark:bg-[#18241B] text-center'
                        : 'bg-[#FAF6F0] dark:bg-[#1E2420]'
                    }`}
                  >
                    <p
                      className={`font-serif italic text-sm sm:text-base leading-relaxed ${
                        tool.slug === 'moon-timer' || tool.slug === 'frost-timer' || tool.slug === 'galaxy-timer'
                          ? 'text-white font-medium'
                          : tool.slug === 'bubble-timer' || tool.slug === 'coral-timer' || tool.slug === 'lichen-timer' || tool.slug === 'snow-timer' || tool.slug === 'lava-lamp-timer' || tool.slug === 'spinner-timer'
                          ? 'text-[#0E2338] dark:text-white font-semibold'
                          : 'text-[#252B27] dark:text-white'
                      }`}
                    >
                      {editorial.quoteCard.quote}
                    </p>
                    {tool.slug === 'heart-timer' && (
                      <div className="flex items-center justify-center gap-2 mt-2.5 text-[#D43753]/50">
                        <span className="h-[1px] w-8 bg-[#E8C5CC] dark:bg-[#4A3238]" />
                        <span className="text-[10px] text-[#D43753]">♥</span>
                        <span className="h-[1px] w-8 bg-[#E8C5CC] dark:bg-[#4A3238]" />
                      </div>
                    )}
                    {tool.slug === 'sun-timer' && (
                      <div className="flex items-center justify-center mt-2.5">
                        <svg viewBox="0 0 80 8" className="w-16 h-2">
                          <path
                            d="M 4 5 Q 40 1 76 5"
                            fill="none"
                            stroke="#E65F16"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    )}
                    {tool.slug === 'bubble-timer' && (
                      <div className="flex items-center justify-center mt-2.5">
                        <svg viewBox="0 0 80 8" className="w-16 h-2">
                          <path
                            d="M 4 5 Q 40 1 76 5"
                            fill="none"
                            stroke="#0277CC"
                            strokeWidth="2.4"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    )}
                    {tool.slug === 'coral-timer' && (
                      <div className="flex items-center justify-center mt-2.5 text-[#F35B4F]">
                        <svg viewBox="0 0 28 24" className="w-6 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="M14 22V10" />
                          <path d="M14 16C10 16 8 13.5 8 9.5" />
                          <path d="M14 14C18 14 20 11.5 20 7.5" />
                          <path d="M14 10C14 7 12 4.5 10.5 3" />
                          <path d="M14 10C14 7.5 16 5.5 17.5 4" />
                        </svg>
                      </div>
                    )}
                    {tool.slug === 'lichen-timer' && (
                      <div className="flex items-center justify-center mt-2.5 text-[#4E7349]">
                        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                          <path d="M12 2C8 6 6 10 6 14C6 17.3 8.7 20 12 20C15.3 20 18 17.3 18 14C18 10 16 6 12 2ZM12 18V8" stroke="#EAF2E8" strokeWidth="1.3" strokeLinecap="round" />
                        </svg>
                      </div>
                    )}
                    {tool.slug === 'frost-timer' && (
                      <div className="flex items-center justify-center gap-2 mt-2.5 text-sky-200">
                        <span className="h-[1px] w-7 bg-sky-200/35" />
                        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                          <line x1="12" y1="2" x2="12" y2="22" />
                          <line x1="3.34" y1="7" x2="20.66" y2="17" />
                          <line x1="20.66" y1="7" x2="3.34" y2="17" />
                        </svg>
                        <span className="h-[1px] w-7 bg-sky-200/35" />
                      </div>
                    )}
                    {tool.slug === 'snow-timer' && (
                      <div className="flex items-center justify-center gap-2.5 mt-3 text-[#0968B8] dark:text-sky-400">
                        <span className="h-[1px] w-8 bg-[#0968B8]/25 dark:bg-sky-400/30" />
                        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <line x1="12" y1="2" x2="12" y2="22" />
                          <line x1="3.34" y1="7" x2="20.66" y2="17" />
                          <line x1="20.66" y1="7" x2="3.34" y2="17" />
                          <polyline points="9.5,4.5 12,7 14.5,4.5" />
                          <polyline points="9.5,19.5 12,17 14.5,19.5" />
                        </svg>
                        <span className="h-[1px] w-8 bg-[#0968B8]/25 dark:bg-sky-400/30" />
                      </div>
                    )}
                    {tool.slug === 'galaxy-timer' && (
                      <div className="flex items-center justify-center gap-2.5 mt-3 text-purple-200">
                        <span className="h-[1px] w-8 bg-purple-300/35" />
                        <svg viewBox="0 0 28 28" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
                          <ellipse cx="14" cy="14" rx="3" ry="2" fill="currentColor" stroke="none" />
                          <path d="M11 13.5C9.5 11.2 11.8 8.2 15.8 8.4C20.4 8.6 23.5 12.2 22.2 16.2C21.1 19.6 16.5 21.6 11.5 20.6" />
                          <path d="M17 14.5C18.5 16.8 16.2 19.8 12.2 19.6C7.6 19.4 4.5 15.8 5.8 11.8C6.9 8.4 11.5 6.4 16.5 7.4" />
                        </svg>
                        <span className="h-[1px] w-8 bg-purple-300/35" />
                      </div>
                    )}
                    {tool.slug === 'lava-lamp-timer' && (
                      <div className="flex items-center justify-center gap-2.5 mt-3 text-[#7B1850] dark:text-pink-300">
                        <span className="h-[1px] w-8 bg-[#7B1850]/25 dark:bg-pink-300/30" />
                        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="10,2 14,2 15,6 9,6" fill="currentColor" />
                          <polygon points="9,6 15,6 18,16 16,19 8,19 6,16" />
                          <circle cx="12" cy="14" r="2" fill="currentColor" />
                          <circle cx="12" cy="10" r="1.2" fill="currentColor" />
                          <polygon points="8,19 16,19 17.5,22 6.5,22" fill="currentColor" />
                        </svg>
                        <span className="h-[1px] w-8 bg-[#7B1850]/25 dark:bg-pink-300/30" />
                      </div>
                    )}
                    {tool.slug === 'spinner-timer' && (
                      <div className="flex items-center justify-center gap-2.5 mt-3 text-[#1F7A3A] dark:text-emerald-400">
                        <span className="h-[1px] w-8 bg-[#1F7A3A]/25 dark:bg-emerald-400/30" />
                        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                          <circle cx="12" cy="12" r="8" strokeOpacity="0.28" />
                          <path d="M 12 4 A 8 8 0 1 1 5.5 16.5" />
                          <circle cx="12" cy="4" r="1.5" fill="currentColor" stroke="none" />
                        </svg>
                        <span className="h-[1px] w-8 bg-[#1F7A3A]/25 dark:bg-emerald-400/30" />
                      </div>
                    )}
                  </div>
                </div>
                )}
              </div>
            </aside>

            {/* Right Column */}
            <article className={`${tool.slug === 'rainbow-timer' || tool.slug === 'liquid-timer' || tool.slug === 'hourglass-timer' || tool.slug === 'circular-timer' || tool.slug === 'radial-timer' || tool.slug === 'rings-timer' || tool.slug === 'progress-timer' || tool.slug === 'pixel-timer' || tool.slug === 'blocks-timer' || tool.slug === 'candle-timer' || tool.slug === 'aesthetic-timer' || tool.slug === 'picture-reveal-timer' || tool.slug === 'heart-timer' || tool.slug === 'moon-timer' || tool.slug === 'sun-timer' || tool.slug === 'bubble-timer' || tool.slug === 'coral-timer' || tool.slug === 'lichen-timer' || tool.slug === 'frost-timer' || tool.slug === 'snow-timer' || tool.slug === 'galaxy-timer' || tool.slug === 'lava-lamp-timer' || tool.slug === 'spinner-timer' ? 'lg:col-span-9 max-w-none' : 'lg:col-span-8 max-w-3xl'} space-y-10`}>
              {tool.slug !== 'rainbow-timer' && tool.slug !== 'hourglass-timer' && tool.slug !== 'circular-timer' && tool.slug !== 'radial-timer' && tool.slug !== 'rings-timer' && tool.slug !== 'progress-timer' && tool.slug !== 'pixel-timer' && tool.slug !== 'blocks-timer' && tool.slug !== 'candle-timer' && tool.slug !== 'aesthetic-timer' && tool.slug !== 'picture-reveal-timer' && tool.slug !== 'heart-timer' && tool.slug !== 'moon-timer' && tool.slug !== 'sun-timer' && tool.slug !== 'bubble-timer' && tool.slug !== 'coral-timer' && tool.slug !== 'lichen-timer' && tool.slug !== 'frost-timer' && tool.slug !== 'snow-timer' && tool.slug !== 'galaxy-timer' && tool.slug !== 'lava-lamp-timer' && tool.slug !== 'spinner-timer' && (
                <div id={tocIds[0]} className="scroll-mt-28">
                  <span className="text-[11px] font-bold tracking-widest text-[#365C4B] dark:text-[#5E917A] uppercase block mb-2">
                    A COMPLETE GUIDE
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl leading-tight font-normal text-[#252B27] dark:text-white mb-4">
                    {editorial.guide.whatIsTitle}
                  </h2>
                  {editorial.guide.whatIsBody.map((p, idx) => (
                    <p key={idx} className="text-base sm:text-lg text-[#252B27]/80 dark:text-slate-300 leading-relaxed mb-4">
                      {p}
                    </p>
                  ))}
                </div>
              )}

              {/* How it works for generic tools */}
              {tool.slug !== 'time-duration-calculator' && tool.slug !== 'rainbow-timer' && tool.slug !== 'hourglass-timer' && tool.slug !== 'circular-timer' && tool.slug !== 'radial-timer' && tool.slug !== 'rings-timer' && tool.slug !== 'progress-timer' && tool.slug !== 'pixel-timer' && tool.slug !== 'blocks-timer' && tool.slug !== 'candle-timer' && tool.slug !== 'aesthetic-timer' && tool.slug !== 'picture-reveal-timer' && tool.slug !== 'heart-timer' && tool.slug !== 'moon-timer' && tool.slug !== 'sun-timer' && tool.slug !== 'bubble-timer' && tool.slug !== 'coral-timer' && tool.slug !== 'lichen-timer' && tool.slug !== 'frost-timer' && tool.slug !== 'snow-timer' && tool.slug !== 'galaxy-timer' && tool.slug !== 'lava-lamp-timer' && tool.slug !== 'spinner-timer' && (
                <div id={tocIds[1]} className="scroll-mt-28">
                  <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#252B27] dark:text-white mb-3">
                    {editorial.guide.howItWorksTitle}
                  </h2>
                  {editorial.guide.howItWorksBody.map((p, idx) => (
                    <p key={idx} className="text-sm sm:text-base text-[#252B27]/80 dark:text-slate-300 leading-relaxed mb-3">
                      {p}
                    </p>
                  ))}

                  {/* Highlight Callout Box (for liquid-timer, the leaf callout is shown beneath the Liquid Timer Styles table) */}
                  {tool.slug !== 'liquid-timer' && (
                    <div className="my-6 p-5 sm:p-6 rounded-2xl bg-[#FAF6F0] dark:bg-[#202521] border border-[#E8DEC8] dark:border-[#353E37] flex items-start gap-3.5">
                      <Lightbulb className="w-5 h-5 text-[#B7804C] shrink-0 mt-0.5 fill-current" />
                      <p className="font-serif italic text-sm sm:text-base text-[#252B27] dark:text-slate-200 leading-relaxed">
                        {editorial.guide.calloutNote}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* If tool is Time Duration Calculator, render exact screenshot layout */}
              {tool.slug === 'time-duration-calculator' ? (
                <>
                  <div id={tocIds[1]} className="scroll-mt-28">
                    <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#252B27] dark:text-white mb-3">
                      How to Calculate Time Between Two Times
                    </h2>
                    <p className="text-sm sm:text-base text-[#252B27]/80 dark:text-slate-300 leading-relaxed mb-4">
                      Follow these simple steps:
                    </p>
                    <ol className="space-y-3">
                      {[
                        'Enter the start date and time.',
                        'Enter the end date and time.',
                        'Click Calculate Duration.',
                        'View the result in hours, minutes, total minutes and decimal hours.',
                      ].map((step, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm sm:text-base text-[#252B27]/80 dark:text-slate-300">
                          <span className="w-6 h-6 rounded-full bg-[#365C4B] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span>
                            {idx === 2 ? (
                              <>Click <strong className="font-bold text-[#252B27] dark:text-white">Calculate Duration</strong>.</>
                            ) : (
                              step
                            )}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div id={tocIds[2]} className="scroll-mt-28">
                    <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#252B27] dark:text-white mb-3">
                      How to Calculate Overnight Hours
                    </h2>
                    <p className="text-sm sm:text-base text-[#252B27]/80 dark:text-slate-300 leading-relaxed mb-4">
                      If the end time is on the next day, the calculator automatically counts the hours across midnight. For example, 10:00 PM to 6:00 AM equals 8 hours.
                    </p>
                    {/* Amber Callout Box with Lightbulb */}
                    <div className="my-4 p-5 sm:p-6 rounded-2xl bg-[#FAF6F0] dark:bg-[#202521] border border-[#E8DEC8] dark:border-[#353E37] flex items-start gap-3.5">
                      <Lightbulb className="w-5 h-5 text-[#B7804C] shrink-0 mt-0.5 fill-current" />
                      <p className="font-serif italic text-sm sm:text-base text-[#252B27] dark:text-slate-200 leading-relaxed">
                        You do not need to manually adjust for midnight. Just enter the correct dates and times and the calculator will handle the rest.
                      </p>
                    </div>
                  </div>

                  <div id={tocIds[3]} className="scroll-mt-28">
                    <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#252B27] dark:text-white mb-3">
                      How to Convert Hours Into Minutes
                    </h2>
                    <p className="text-sm sm:text-base text-[#252B27]/80 dark:text-slate-300 leading-relaxed mb-4">
                      To convert hours into minutes, multiply the number of hours by 60.
                    </p>
                    <div className="rounded-2xl bg-[#E7EDE7]/60 dark:bg-[#1E2721] border border-[#CCD8CD] dark:border-[#2F3E33] p-5">
                      <span className="font-bold block text-sm text-[#252B27] dark:text-white mb-1">
                        Example:
                      </span>
                      <p className="text-sm sm:text-base text-[#252B27]/90 dark:text-slate-200 font-mono">
                        8.5 hours × 60 = 510 minutes
                      </p>
                    </div>
                  </div>

                  <div id={tocIds[4]} className="scroll-mt-28">
                    <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#252B27] dark:text-white mb-3">
                      How to Calculate Decimal Hours
                    </h2>
                    <p className="text-sm sm:text-base text-[#252B27]/80 dark:text-slate-300 leading-relaxed mb-4">
                      Decimal hours are useful for timesheets and payroll. To get decimal hours, convert the minutes into a fraction of an hour.
                    </p>
                    <div className="rounded-2xl bg-[#E7EDE7]/60 dark:bg-[#1E2721] border border-[#CCD8CD] dark:border-[#2F3E33] p-5 space-y-1">
                      <span className="font-bold block text-sm text-[#252B27] dark:text-white mb-1">
                        Example:
                      </span>
                      <p className="text-sm sm:text-base text-[#252B27]/90 dark:text-slate-200 font-mono">
                        30 minutes = 0.5 hours
                      </p>
                      <p className="text-sm sm:text-base text-[#252B27]/90 dark:text-slate-200 font-mono">
                        8 hours 30 minutes = 8.5 decimal hours
                      </p>
                    </div>
                  </div>

                  <div id={tocIds[5]} className="scroll-mt-28">
                    <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#252B27] dark:text-white mb-3">
                      Practical Workplace Examples
                    </h2>
                    <p className="text-sm sm:text-base text-[#252B27]/80 dark:text-slate-300 leading-relaxed mb-4">
                      Here are some common examples of time duration calculations:
                    </p>
                    <div className="rounded-2xl border border-[#E4E1D9] dark:border-[#2D352F] overflow-hidden bg-white dark:bg-[#1A201C] shadow-2xs">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs sm:text-sm">
                          <thead>
                            <tr className="bg-[#365C4B] text-white">
                              <th scope="col" className="py-3 px-4 font-semibold">Scenario</th>
                              <th scope="col" className="py-3 px-4 font-semibold">Start Time</th>
                              <th scope="col" className="py-3 px-4 font-semibold">End Time</th>
                              <th scope="col" className="py-3 px-4 font-semibold">Total Duration</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#E4E1D9] dark:divide-[#2D352F]">
                            {[
                              { scenario: 'Office hours', start: '9:00 AM', end: '5:00 PM', duration: '8 hours 0 minutes' },
                              { scenario: 'Part-time shift', start: '10:00 AM', end: '2:30 PM', duration: '4 hours 30 minutes' },
                              { scenario: 'Overnight shift', start: '10:00 PM', end: '6:00 AM (next day)', duration: '8 hours 0 minutes' },
                              { scenario: 'Study time', start: '7:00 PM', end: '10:15 PM', duration: '3 hours 15 minutes' },
                              { scenario: 'Project work', start: '8:30 AM', end: '6:00 PM', duration: '9 hours 30 minutes' },
                            ].map((row, idx) => (
                              <tr
                                key={idx}
                                className={idx % 2 === 0 ? 'bg-transparent' : 'bg-[#F7F6F2]/50 dark:bg-[#1D2420]/50'}
                              >
                                <td className="py-3 px-4 font-semibold text-[#252B27] dark:text-white whitespace-nowrap">
                                  {row.scenario}
                                </td>
                                <td className="py-3 px-4 text-[#252B27]/80 dark:text-slate-300 font-mono">
                                  {row.start}
                                </td>
                                <td className="py-3 px-4 text-[#252B27]/80 dark:text-slate-300 font-mono">
                                  {row.end}
                                </td>
                                <td className="py-3 px-4 font-semibold text-[#252B27] dark:text-white">
                                  {row.duration}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  <div id={tocIds[6]} className="scroll-mt-28">
                    <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#252B27] dark:text-white mb-4">
                      Common Calculation Mistakes
                    </h2>
                    <ul className="space-y-2.5">
                      {[
                        'Forgetting to set the correct date when calculating overnight hours.',
                        'Using the wrong AM/PM time.',
                        'Not accounting for breaks.',
                        'Confusing decimal hours with minutes.',
                        'Entering the same start and end time.',
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-sm sm:text-base text-[#252B27]/80 dark:text-slate-300">
                          <span className="w-2 h-2 rounded-full bg-[#365C4B] mt-2 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : tool.slug === 'world-clock' ? (
                <>
                  <div id={tocIds[2]} className="scroll-mt-28">
                    <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#252B27] dark:text-white mb-3">
                      UTC Offsets Explained
                    </h2>
                    <p className="text-sm sm:text-base text-[#252B27]/80 dark:text-slate-300 leading-relaxed mb-4">
                      UTC (Coordinated Universal Time) is the global time standard. Time zones are written as an offset from UTC, such as UTC -4 or UTC +5:30. A positive offset means the time is ahead of UTC, while a negative offset means it is behind UTC.
                    </p>
                    <div className="rounded-2xl border border-[#E4E1D9] dark:border-[#2D352F] overflow-hidden bg-white dark:bg-[#1A201C] shadow-2xs">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs sm:text-sm">
                          <thead>
                            <tr className="bg-[#365C4B] text-white">
                              <th scope="col" className="py-3 px-4 font-semibold">Location</th>
                              <th scope="col" className="py-3 px-4 font-semibold">Time Zone</th>
                              <th scope="col" className="py-3 px-4 font-semibold">UTC Offset</th>
                              <th scope="col" className="py-3 px-4 font-semibold">Example Local Time (Oct 26, 2026)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#E4E1D9] dark:divide-[#2D352F]">
                            {[
                              { loc: 'New York', tz: 'Eastern Daylight Time (EDT)', offset: 'UTC -4', time: '10:24 AM' },
                              { loc: 'London', tz: 'Greenwich Mean Time (GMT)', offset: 'UTC +0', time: '3:24 PM' },
                              { loc: 'Mumbai', tz: 'India Standard Time (IST)', offset: 'UTC +5:30', time: '8:54 PM' },
                              { loc: 'Tokyo', tz: 'Japan Standard Time (JST)', offset: 'UTC +9', time: '12:24 AM (Oct 27)' },
                            ].map((row, idx) => (
                              <tr
                                key={idx}
                                className={idx % 2 === 0 ? 'bg-transparent' : 'bg-[#F7F6F2]/50 dark:bg-[#1D2420]/50'}
                              >
                                <td className="py-3 px-4 font-semibold text-[#252B27] dark:text-white whitespace-nowrap">
                                  {row.loc}
                                </td>
                                <td className="py-3 px-4 text-[#252B27]/80 dark:text-slate-300">
                                  {row.tz}
                                </td>
                                <td className="py-3 px-4 text-[#252B27]/75 dark:text-slate-400">
                                  {row.offset}
                                </td>
                                <td className="py-3 px-4 text-[#252B27]/80 dark:text-slate-300 font-mono">
                                  {row.time}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  <div id={tocIds[3]} className="scroll-mt-28">
                    <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#252B27] dark:text-white mb-3">
                      Understanding Daylight-Saving Time
                    </h2>
                    <p className="text-sm sm:text-base text-[#252B27]/80 dark:text-slate-300 leading-relaxed">
                      Some countries use daylight-saving time (DST) to make better use of daylight during certain months. This means the time-zone offset can change throughout the year. Our tool automatically takes DST into account so you always see the correct local time.
                    </p>
                  </div>

                  <div id={tocIds[4]} className="scroll-mt-28">
                    <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#252B27] dark:text-white mb-3">
                      Planning Meetings Across Countries
                    </h2>
                    <p className="text-sm sm:text-base text-[#252B27]/80 dark:text-slate-300 leading-relaxed">
                      When planning a meeting, it&apos;s important to find a time that works for everyone. Use the meeting planner to compare multiple time zones and find overlapping hours.
                    </p>
                  </div>

                  <div id={tocIds[5]} className="scroll-mt-28">
                    <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#252B27] dark:text-white mb-3">
                      Working With Different Local Dates
                    </h2>
                    <p className="text-sm sm:text-base text-[#252B27]/80 dark:text-slate-300 leading-relaxed">
                      When converting times between distant regions such as North America and Asia-Pacific, a late-afternoon meeting in one city may already be the next calendar morning in another. Always check both the converted time and the local date indicator before sending calendar invites.
                    </p>
                  </div>

                  <div id={tocIds[6]} className="scroll-mt-28">
                    <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#252B27] dark:text-white mb-4">
                      Common Time-Zone Conversion Mistakes
                    </h2>
                    <ul className="space-y-2.5">
                      {[
                        'Forgetting to check daylight-saving time.',
                        'Using the wrong date when converting late-night times.',
                        'Assuming all countries in a region have the same time zone.',
                        'Not considering local holidays or working hours.',
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-sm sm:text-base text-[#252B27]/80 dark:text-slate-300">
                          <span className="w-2 h-2 rounded-full bg-[#365C4B] mt-2 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : tool.slug !== 'liquid-timer' && tool.slug !== 'rainbow-timer' && tool.slug !== 'hourglass-timer' && tool.slug !== 'circular-timer' && tool.slug !== 'radial-timer' && tool.slug !== 'rings-timer' && tool.slug !== 'progress-timer' && tool.slug !== 'pixel-timer' && tool.slug !== 'blocks-timer' && tool.slug !== 'candle-timer' && tool.slug !== 'aesthetic-timer' && tool.slug !== 'picture-reveal-timer' && tool.slug !== 'heart-timer' && tool.slug !== 'moon-timer' && tool.slug !== 'sun-timer' && tool.slug !== 'bubble-timer' && tool.slug !== 'coral-timer' && tool.slug !== 'lichen-timer' && tool.slug !== 'frost-timer' && tool.slug !== 'snow-timer' && tool.slug !== 'galaxy-timer' && tool.slug !== 'lava-lamp-timer' && tool.slug !== 'spinner-timer' && editorial.guide.howToUseSteps && editorial.guide.howToUseSteps.length > 0 ? (
                <div id={tocIds[2]} className="scroll-mt-28">
                  <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#252B27] dark:text-white mb-4">
                    {editorial.guide.howToUseTitle}
                  </h2>
                  <ol className="space-y-3">
                    {editorial.guide.howToUseSteps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm sm:text-base text-[#252B27]/80 dark:text-slate-300">
                        <span className="w-6 h-6 rounded-full bg-[#365C4B] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              ) : null}

              {/* If tool is Spinner Timer, render the exact 2-column editorial + Tip box + Related Tools sidebar layout from the reference mockup */}
              {tool.slug === 'spinner-timer' ? (
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                  {/* Center Editorial Sub-Column (xl:col-span-8) */}
                  <div className="xl:col-span-8 space-y-8">
                    <div id={tocIds[0]} className="scroll-mt-28">
                      <span className="text-[11px] font-bold tracking-widest text-[#1F7A3A] dark:text-emerald-400 uppercase block mb-1.5">
                        A COMPLETE GUIDE
                      </span>
                      <h2 className="font-serif text-2xl sm:text-3xl lg:text-[34px] leading-tight font-bold text-[#0E2338] dark:text-white mb-3">
                        What Is a Spinner Timer?
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        A spinner timer is a visual countdown timer that uses a rotating wheel to show the passage of time. As the timer runs, the spinner moves smoothly and the progress ring updates, giving you a clear and engaging way to stay on track.
                      </p>
                    </div>

                    <div id={tocIds[1]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0E2338] dark:text-white mb-3">
                        How the Spinning Countdown Works
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        The spinner starts at your chosen duration and rotates at a steady speed. The circular progress ring fills as time elapses, and the remaining segments show the time left. When the countdown reaches zero, the spinner stops and an optional alert lets you know the time is up.
                      </p>
                    </div>

                    <div id={tocIds[2]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0E2338] dark:text-white mb-4">
                        How to Use the Spinner Timer
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
                        <ol className="sm:col-span-7 space-y-3">
                          {editorial.guide.howToUseSteps.map((step, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-3 text-xs sm:text-sm text-[#252B27]/85 dark:text-slate-300"
                            >
                              <span className="w-6 h-6 rounded-full bg-[#1F7A3A] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>

                        {/* Soft Sage-Green Tip Card on the right matching screenshot */}
                        <div className="sm:col-span-5 rounded-2xl bg-[#EDF5EC] dark:bg-[#19271C] border border-[#CFE3CE] dark:border-[#2B4230] p-4">
                          <div className="flex items-center gap-2 mb-1.5 text-[#1F7A3A] dark:text-emerald-400">
                            <Lightbulb className="w-4 h-4 fill-current shrink-0" />
                            <span className="font-serif italic font-bold text-sm text-[#0E2338] dark:text-white">
                              Tip
                            </span>
                          </div>
                          <p className="text-xs text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                            Use clear, short durations for focused tasks and longer durations for study sessions, group activities or workouts.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div id={tocIds[3]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0E2338] dark:text-white mb-3">
                        Spinner Timer for Games and Group Activities
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        A spinner timer is perfect for classroom games, team challenges, group activities and activity transitions. The visual rotation keeps everyone aware of the time and helps activities run smoothly and fairly.
                      </p>
                    </div>

                    <div id={tocIds[4]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0E2338] dark:text-white mb-3">
                        Spinner Timer vs Random Spinner Wheel
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        A spinner timer shows a countdown based on a set duration, and its rotation represents elapsed time. A random spinner wheel, on the other hand, is used to make a random selection (such as a name, option or task) and does not track time.
                      </p>
                    </div>
                  </div>

                  {/* Right Sub-Column (xl:col-span-4): Related Tools Vertical Card List matching mockup */}
                  <div className="xl:col-span-4">
                    <div className="rounded-2xl border border-[#E4E1D9] dark:border-[#2D352F] bg-white/80 dark:bg-[#1A201C] p-4 sm:p-5 shadow-2xs space-y-3">
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-[#252B27] dark:text-white mb-2">
                        Related Tools
                      </h3>
                      {[
                        {
                          name: 'Pomodoro Timer',
                          desc: 'Stay focused with intervals.',
                          href: '/pomodoro-timer',
                          iconBg: 'bg-[#FDECE8] text-[#D94E34]',
                          icon: <Flame className="w-5 h-5" />,
                        },
                        {
                          name: 'Circular Timer',
                          desc: 'A simple circle countdown.',
                          href: '/timers/circular-timer',
                          iconBg: 'bg-[#E7EDE7] text-[#1E7A4C]',
                          icon: <Clock className="w-5 h-5" />,
                        },
                        {
                          name: 'Rings Timer',
                          desc: 'Multiple concentric rings.',
                          href: '/timers/rings-timer',
                          iconBg: 'bg-[#E7EDE7] text-[#1E7A4C]',
                          icon: <Clock className="w-5 h-5" />,
                        },
                        {
                          name: 'Progress Timer',
                          desc: 'A visual progress bar timer.',
                          href: '/timers/progress-timer',
                          iconBg: 'bg-[#FCF3E4] text-[#EA580C]',
                          icon: <Monitor className="w-5 h-5" />,
                        },
                        {
                          name: 'Pixel Timer',
                          desc: 'A retro pixel countdown.',
                          href: '/timers/pixel-timer',
                          iconBg: 'bg-[#E7EDE7] text-[#1E7A4C]',
                          icon: <Monitor className="w-5 h-5" />,
                        },
                        {
                          name: 'Blocks Timer',
                          desc: 'A stacked block timer.',
                          href: '/timers/blocks-timer',
                          iconBg: 'bg-[#FDECE8] text-[#D94E34]',
                          icon: <Clock className="w-5 h-5" />,
                        },
                        {
                          name: 'Candle Timer',
                          desc: 'A peaceful visual timer.',
                          href: '/timers/candle-timer',
                          iconBg: 'bg-[#FCF3E4] text-[#D97706]',
                          icon: <Flame className="w-5 h-5" />,
                        },
                        {
                          name: 'Moon Timer',
                          desc: 'A calming moon timer.',
                          href: '/timers/moon-timer',
                          iconBg: 'bg-[#17253B] text-[#F5D08A]',
                          icon: <Moon className="w-5 h-5" />,
                        },
                        {
                          name: 'Sun Timer',
                          desc: 'A bright and cheerful timer.',
                          href: '/timers/sun-timer',
                          iconBg: 'bg-[#FFF3E0] text-[#E65F16]',
                          icon: <Sparkles className="w-5 h-5" />,
                        },
                        {
                          name: 'Galaxy Timer',
                          desc: 'A space-themed countdown.',
                          href: '/timers/galaxy-timer',
                          iconBg: 'bg-[#F3E8FF] text-[#6B21A8]',
                          icon: (
                            <svg viewBox="0 0 28 28" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                              <ellipse cx="14" cy="14" rx="3" ry="2" fill="currentColor" stroke="none" />
                              <path d="M11 13.5C9.5 11.2 11.8 8.2 15.8 8.4C20.4 8.6 23.5 12.2 22.2 16.2C21.1 19.6 16.5 21.6 11.5 20.6" />
                              <path d="M17 14.5C18.5 16.8 16.2 19.8 12.2 19.6C7.6 19.4 4.5 15.8 5.8 11.8C6.9 8.4 11.5 6.4 16.5 7.4" />
                            </svg>
                          ),
                        },
                      ].map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-[#222924] border border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#1F7A3A] transition-all group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg}`}>
                              {item.icon}
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-xs sm:text-sm text-[#252B27] dark:text-white group-hover:text-[#1F7A3A] transition-colors">
                                {item.name}
                              </div>
                              <div className="text-[11px] text-[#252B27]/70 dark:text-slate-400 truncate">
                                {item.desc}
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[#252B27]/40 group-hover:text-[#1F7A3A] group-hover:translate-x-0.5 transition-all shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}

              {/* If tool is Lava Lamp Timer, render the exact 2-column editorial + Tip box + Related Tools sidebar layout from the reference mockup */}
              {tool.slug === 'lava-lamp-timer' ? (
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                  {/* Center Editorial Sub-Column (xl:col-span-8) */}
                  <div className="xl:col-span-8 space-y-8">
                    <div id={tocIds[0]} className="scroll-mt-28">
                      <span className="text-[11px] font-bold tracking-widest text-[#881D58] dark:text-pink-400 uppercase block mb-1.5">
                        A COMPLETE GUIDE
                      </span>
                      <h2 className="font-serif text-2xl sm:text-3xl lg:text-[34px] leading-tight font-bold text-[#0E2338] dark:text-white mb-3">
                        What Is a Lava Lamp Timer?
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        A lava lamp timer is a visual countdown timer inspired by the classic retro lava lamp. It shows smooth, floating blobs inside a lamp that change and flow as time passes, giving you a relaxing and engaging way to track a set duration.
                      </p>
                    </div>

                    <div id={tocIds[1]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0E2338] dark:text-white mb-3">
                        How the Lava Lamp Countdown Works
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        The timer is based on a real countdown duration. As the time progresses, the lava blobs move, grow and merge in a smooth, continuous animation. The visual state of the lamp changes gradually to represent the passage of time, and the countdown completes when the timer reaches zero.
                      </p>
                    </div>

                    <div id={tocIds[2]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0E2338] dark:text-white mb-4">
                        How to Use the Retro Lava Lamp Timer
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
                        <ol className="sm:col-span-7 space-y-3">
                          {editorial.guide.howToUseSteps.map((step, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-3 text-xs sm:text-sm text-[#252B27]/85 dark:text-slate-300"
                            >
                              <span className="w-6 h-6 rounded-full bg-[#6E1848] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>

                        {/* Soft Berry-Blush Tip Card on the right matching screenshot */}
                        <div className="sm:col-span-5 rounded-2xl bg-[#F9EFF3] dark:bg-[#261822] border border-[#E8D2DC] dark:border-[#42283A] p-4">
                          <div className="flex items-center gap-2 mb-1.5 text-[#881D58] dark:text-pink-300">
                            <Lightbulb className="w-4 h-4 fill-current shrink-0" />
                            <span className="font-serif italic font-bold text-sm text-[#0E2338] dark:text-white">
                              Tip
                            </span>
                          </div>
                          <p className="text-xs text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                            Use a slower animation speed for study and reading, or a slightly faster speed for short breaks and quick activities.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div id={tocIds[3]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0E2338] dark:text-white mb-3">
                        Lava Lamp Timer for Study and Quiet Activities
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        A lava lamp timer is perfect for study sessions, reading, focused work and mindful breaks. Its gentle motion helps create a calm environment, reduce distraction and keep you on track.
                      </p>
                    </div>

                    <div id={tocIds[4]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0E2338] dark:text-white mb-3">
                        Customize Your Lava Lamp Theme
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        You can choose from different color themes, adjust the animation speed, show or hide the numeric time, enable sound alerts and use reduced-motion mode for a simpler and more comfortable experience.
                      </p>
                    </div>
                  </div>

                  {/* Right Sub-Column (xl:col-span-4): Related Tools Vertical Card List matching mockup */}
                  <div className="xl:col-span-4">
                    <div className="rounded-2xl border border-[#E4E1D9] dark:border-[#2D352F] bg-white/80 dark:bg-[#1A201C] p-4 sm:p-5 shadow-2xs space-y-3">
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-[#252B27] dark:text-white mb-2">
                        Related Tools
                      </h3>
                      {[
                        {
                          name: 'Pomodoro Timer',
                          desc: 'Stay focused with intervals.',
                          href: '/pomodoro-timer',
                          iconBg: 'bg-[#FDECE8] text-[#D94E34]',
                          icon: <Flame className="w-5 h-5" />,
                        },
                        {
                          name: 'Circular Timer',
                          desc: 'A simple circle countdown.',
                          href: '/timers/circular-timer',
                          iconBg: 'bg-[#E7EDE7] text-[#1E7A4C]',
                          icon: <Clock className="w-5 h-5" />,
                        },
                        {
                          name: 'Rings Timer',
                          desc: 'Multiple concentric rings.',
                          href: '/timers/rings-timer',
                          iconBg: 'bg-[#E7EDE7] text-[#1E7A4C]',
                          icon: <Clock className="w-5 h-5" />,
                        },
                        {
                          name: 'Progress Timer',
                          desc: 'A visual progress bar timer.',
                          href: '/timers/progress-timer',
                          iconBg: 'bg-[#FCF3E4] text-[#EA580C]',
                          icon: <Monitor className="w-5 h-5" />,
                        },
                        {
                          name: 'Pixel Timer',
                          desc: 'A retro pixel countdown.',
                          href: '/timers/pixel-timer',
                          iconBg: 'bg-[#E7EDE7] text-[#1E7A4C]',
                          icon: <Monitor className="w-5 h-5" />,
                        },
                        {
                          name: 'Blocks Timer',
                          desc: 'A stacked block timer.',
                          href: '/timers/blocks-timer',
                          iconBg: 'bg-[#FDECE8] text-[#D94E34]',
                          icon: <Clock className="w-5 h-5" />,
                        },
                        {
                          name: 'Candle Timer',
                          desc: 'A peaceful visual timer.',
                          href: '/timers/candle-timer',
                          iconBg: 'bg-[#FCF3E4] text-[#D97706]',
                          icon: <Flame className="w-5 h-5" />,
                        },
                        {
                          name: 'Moon Timer',
                          desc: 'A calming moon timer.',
                          href: '/timers/moon-timer',
                          iconBg: 'bg-[#17253B] text-[#F5D08A]',
                          icon: <Moon className="w-5 h-5" />,
                        },
                        {
                          name: 'Sun Timer',
                          desc: 'A bright and cheerful timer.',
                          href: '/timers/sun-timer',
                          iconBg: 'bg-[#FFF3E0] text-[#E65F16]',
                          icon: <Sparkles className="w-5 h-5" />,
                        },
                        {
                          name: 'Galaxy Timer',
                          desc: 'A space-themed countdown.',
                          href: '/timers/galaxy-timer',
                          iconBg: 'bg-[#F3E8FF] text-[#6B21A8]',
                          icon: (
                            <svg viewBox="0 0 28 28" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                              <ellipse cx="14" cy="14" rx="3" ry="2" fill="currentColor" stroke="none" />
                              <path d="M11 13.5C9.5 11.2 11.8 8.2 15.8 8.4C20.4 8.6 23.5 12.2 22.2 16.2C21.1 19.6 16.5 21.6 11.5 20.6" />
                              <path d="M17 14.5C18.5 16.8 16.2 19.8 12.2 19.6C7.6 19.4 4.5 15.8 5.8 11.8C6.9 8.4 11.5 6.4 16.5 7.4" />
                            </svg>
                          ),
                        },
                      ].map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-[#222924] border border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#881D58] transition-all group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg}`}>
                              {item.icon}
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-xs sm:text-sm text-[#252B27] dark:text-white group-hover:text-[#881D58] transition-colors">
                                {item.name}
                              </div>
                              <div className="text-[11px] text-[#252B27]/70 dark:text-slate-400 truncate">
                                {item.desc}
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[#252B27]/40 group-hover:text-[#881D58] group-hover:translate-x-0.5 transition-all shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}

              {/* If tool is Galaxy Timer, render the exact 2-column editorial + Tip box + Related Tools sidebar layout from the reference mockup */}
              {tool.slug === 'galaxy-timer' ? (
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                  {/* Center Editorial Sub-Column (xl:col-span-8) */}
                  <div className="xl:col-span-8 space-y-8">
                    <div id={tocIds[0]} className="scroll-mt-28">
                      <span className="text-[11px] font-bold tracking-widest text-[#4C1D95] dark:text-purple-400 uppercase block mb-1.5">
                        A COMPLETE GUIDE
                      </span>
                      <h2 className="font-serif text-2xl sm:text-3xl lg:text-[34px] leading-tight font-bold text-[#0E2338] dark:text-white mb-3">
                        What Is a Galaxy Timer?
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        A galaxy timer is a visual countdown timer that uses a space-inspired scene with a galaxy, stars and nebula to show the passage of time. As the timer runs, the starfield gradually changes, giving you a calm and engaging way to stay focused.
                      </p>
                    </div>

                    <div id={tocIds[1]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0E2338] dark:text-white mb-3">
                        How the Starfield Countdown Works
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        The animation begins with a partial galaxy or a simpler starfield. As time passes, more stars, details and glow are slowly revealed, and the galaxy becomes more complete. The animation is designed to match the selected duration, and the final state is reached when the timer ends.
                      </p>
                    </div>

                    <div id={tocIds[2]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0E2338] dark:text-white mb-4">
                        How to Use the Galaxy Timer
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
                        <ol className="sm:col-span-7 space-y-3">
                          {editorial.guide.howToUseSteps.map((step, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-3 text-xs sm:text-sm text-[#252B27]/85 dark:text-slate-300"
                            >
                              <span className="w-6 h-6 rounded-full bg-[#4A148C] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>

                        {/* Soft Lavender-Purple Tip Card on the right matching screenshot */}
                        <div className="sm:col-span-5 rounded-2xl bg-[#F3EEFF] dark:bg-[#221A3A] border border-[#DDD0FA] dark:border-[#392A5E] p-4">
                          <div className="flex items-center gap-2 mb-1.5 text-[#5B21B6] dark:text-purple-300">
                            <Lightbulb className="w-4 h-4 fill-current shrink-0" />
                            <span className="font-serif italic font-bold text-sm text-[#0E2338] dark:text-white">
                              Tip
                            </span>
                          </div>
                          <p className="text-xs text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                            For a calmer experience, use a slower animation speed or the low-motion mode.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div id={tocIds[3]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0E2338] dark:text-white mb-3">
                        Space-Themed Timers for Study and Productivity
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        A galaxy timer is perfect for study sessions, creative writing, focused work, reading, evening routines and breaks. The soothing space visuals can create a peaceful environment and help you stay on task for longer.
                      </p>
                    </div>

                    <div id={tocIds[4]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0E2338] dark:text-white mb-3">
                        Customize Your Galaxy Countdown
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        You can choose from different galaxy themes, change the background style, adjust the animation speed, enable or disable sound, and use a reduced-motion mode for a simpler, more static visual experience.
                      </p>
                    </div>
                  </div>

                  {/* Right Sub-Column (xl:col-span-4): Related Tools Vertical Card List matching mockup */}
                  <div className="xl:col-span-4">
                    <div className="rounded-2xl border border-[#E4E1D9] dark:border-[#2D352F] bg-white/80 dark:bg-[#1A201C] p-4 sm:p-5 shadow-2xs space-y-3">
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-[#252B27] dark:text-white mb-2">
                        Related Tools
                      </h3>
                      {[
                        {
                          name: 'Pomodoro Timer',
                          desc: 'Stay focused with intervals.',
                          href: '/pomodoro-timer',
                          iconBg: 'bg-[#FDECE8] text-[#D94E34]',
                          icon: <Flame className="w-5 h-5" />,
                        },
                        {
                          name: 'Circular Timer',
                          desc: 'A simple circle countdown.',
                          href: '/timers/circular-timer',
                          iconBg: 'bg-[#E7EDE7] text-[#1E7A4C]',
                          icon: <Clock className="w-5 h-5" />,
                        },
                        {
                          name: 'Rings Timer',
                          desc: 'Multiple concentric rings.',
                          href: '/timers/rings-timer',
                          iconBg: 'bg-[#E7EDE7] text-[#1E7A4C]',
                          icon: <Clock className="w-5 h-5" />,
                        },
                        {
                          name: 'Progress Timer',
                          desc: 'A visual progress bar timer.',
                          href: '/timers/progress-timer',
                          iconBg: 'bg-[#FCF3E4] text-[#EA580C]',
                          icon: <Monitor className="w-5 h-5" />,
                        },
                        {
                          name: 'Pixel Timer',
                          desc: 'A retro pixel countdown.',
                          href: '/timers/pixel-timer',
                          iconBg: 'bg-[#E7EDE7] text-[#1E7A4C]',
                          icon: <Monitor className="w-5 h-5" />,
                        },
                        {
                          name: 'Blocks Timer',
                          desc: 'A stacked block timer.',
                          href: '/timers/blocks-timer',
                          iconBg: 'bg-[#FDECE8] text-[#D94E34]',
                          icon: <Clock className="w-5 h-5" />,
                        },
                        {
                          name: 'Candle Timer',
                          desc: 'A peaceful visual timer.',
                          href: '/timers/candle-timer',
                          iconBg: 'bg-[#FCF3E4] text-[#D97706]',
                          icon: <Flame className="w-5 h-5" />,
                        },
                        {
                          name: 'Moon Timer',
                          desc: 'A calming moon timer.',
                          href: '/timers/moon-timer',
                          iconBg: 'bg-[#17253B] text-[#F5D08A]',
                          icon: <Moon className="w-5 h-5" />,
                        },
                        {
                          name: 'Sun Timer',
                          desc: 'A bright and cheerful timer.',
                          href: '/timers/sun-timer',
                          iconBg: 'bg-[#FFF3E0] text-[#E65F16]',
                          icon: <Sparkles className="w-5 h-5" />,
                        },
                        {
                          name: 'Planet Timer',
                          desc: 'A space and planet timer.',
                          href: '/timers/moon-timer',
                          iconBg: 'bg-[#FFF3E0] text-[#D97706]',
                          icon: (
                            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                              <circle cx="12" cy="12" r="5" fill="currentColor" fillOpacity="0.25" />
                              <ellipse cx="12" cy="12" rx="10" ry="3.5" transform="rotate(-22 12 12)" />
                            </svg>
                          ),
                        },
                      ].map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-[#222924] border border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#5B21B6] transition-all group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg}`}>
                              {item.icon}
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-xs sm:text-sm text-[#252B27] dark:text-white group-hover:text-[#5B21B6] transition-colors">
                                {item.name}
                              </div>
                              <div className="text-[11px] text-[#252B27]/70 dark:text-slate-400 truncate">
                                {item.desc}
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[#252B27]/40 group-hover:text-[#5B21B6] group-hover:translate-x-0.5 transition-all shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}

              {/* If tool is Snow Timer, render the exact 2-column editorial + Tip box + Related Tools sidebar layout from the reference mockup */}
              {tool.slug === 'snow-timer' ? (
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                  {/* Center Editorial Sub-Column (xl:col-span-8) */}
                  <div className="xl:col-span-8 space-y-8">
                    <div id={tocIds[0]} className="scroll-mt-28">
                      <span className="text-[11px] font-bold tracking-widest text-[#0968B8] dark:text-sky-400 uppercase block mb-1.5">
                        A COMPLETE GUIDE
                      </span>
                      <h2 className="font-serif text-2xl sm:text-3xl lg:text-[34px] leading-tight font-bold text-[#0E2338] dark:text-white mb-3">
                        What Is a Snow Timer?
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        A snow timer is a visual countdown timer that uses a gentle snowfall and accumulating snow to show the passage of time. As the timer runs, snowflakes fall and the snow layer gradually builds up, giving you a calm and engaging way to stay focused.
                      </p>
                    </div>

                    <div id={tocIds[1]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0E2338] dark:text-white mb-3">
                        How the Falling Snow Countdown Works
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        The animation starts with a clean winter scene. As time passes, snowflakes fall at a steady rate and a visible layer of snow slowly increases along the bottom of the display. The snowfall and accumulation are designed to match the selected duration. When the timer reaches zero, the final snow layer is complete.
                      </p>
                    </div>

                    <div id={tocIds[2]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0E2338] dark:text-white mb-4">
                        How to Use the Snow Timer
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
                        <ol className="sm:col-span-7 space-y-3">
                          {editorial.guide.howToUseSteps.map((step, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-3 text-xs sm:text-sm text-[#252B27]/85 dark:text-slate-300"
                            >
                              <span className="w-6 h-6 rounded-full bg-[#0968B8] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>

                        {/* Soft Ice-Blue Tip Card on the right matching screenshot */}
                        <div className="sm:col-span-5 rounded-2xl bg-[#EEF5FC] dark:bg-[#192534] border border-[#D4E4F4] dark:border-[#293B52] p-4">
                          <div className="flex items-center gap-2 mb-1.5 text-[#0968B8] dark:text-sky-400">
                            <Lightbulb className="w-4 h-4 fill-current shrink-0" />
                            <span className="font-serif italic font-bold text-sm text-[#0E2338] dark:text-white">
                              Tip
                            </span>
                          </div>
                          <p className="text-xs text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                            Try a lower snowfall intensity for longer sessions, and a higher intensity for shorter, more playful activities.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div id={tocIds[3]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0E2338] dark:text-white mb-3">
                        Winter-Themed Timers for Classrooms and Activities
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        A snow timer is perfect for classrooms, study sessions, reading time, seasonal games and activity transitions. The gentle snowfall creates a calm, distraction-free atmosphere that helps learners and groups stay on task.
                      </p>
                    </div>

                    <div id={tocIds[4]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0E2338] dark:text-white mb-3">
                        Customize the Snowfall Effect
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        You can choose from different winter themes, adjust the snowfall intensity, show or hide the numeric time, toggle sound alerts and use reduced-motion mode. These settings let you create a comfortable and battery-friendly experience for your needs.
                      </p>
                    </div>
                  </div>

                  {/* Right Sub-Column (xl:col-span-4): Related Tools Vertical Card List matching mockup */}
                  <div className="xl:col-span-4">
                    <div className="rounded-2xl border border-[#E4E1D9] dark:border-[#2D352F] bg-white/80 dark:bg-[#1A201C] p-4 sm:p-5 shadow-2xs space-y-3">
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-[#252B27] dark:text-white mb-2">
                        Related Tools
                      </h3>
                      {[
                        {
                          name: 'Pomodoro Timer',
                          desc: 'Stay focused with intervals.',
                          href: '/pomodoro-timer',
                          iconBg: 'bg-[#FDECE8] text-[#D94E34]',
                          icon: <Flame className="w-5 h-5" />,
                        },
                        {
                          name: 'Circular Timer',
                          desc: 'A simple circle countdown.',
                          href: '/timers/circular-timer',
                          iconBg: 'bg-[#E7EDE7] text-[#1E7A4C]',
                          icon: <Clock className="w-5 h-5" />,
                        },
                        {
                          name: 'Rings Timer',
                          desc: 'Multiple concentric rings.',
                          href: '/timers/rings-timer',
                          iconBg: 'bg-[#E7EDE7] text-[#1E7A4C]',
                          icon: <Clock className="w-5 h-5" />,
                        },
                        {
                          name: 'Progress Timer',
                          desc: 'A visual progress bar timer.',
                          href: '/timers/progress-timer',
                          iconBg: 'bg-[#FCF3E4] text-[#EA580C]',
                          icon: <Monitor className="w-5 h-5" />,
                        },
                        {
                          name: 'Pixel Timer',
                          desc: 'A retro pixel countdown.',
                          href: '/timers/pixel-timer',
                          iconBg: 'bg-[#E7EDE7] text-[#1E7A4C]',
                          icon: <Monitor className="w-5 h-5" />,
                        },
                        {
                          name: 'Blocks Timer',
                          desc: 'A stacked block timer.',
                          href: '/timers/blocks-timer',
                          iconBg: 'bg-[#FDECE8] text-[#D94E34]',
                          icon: <Clock className="w-5 h-5" />,
                        },
                        {
                          name: 'Candle Timer',
                          desc: 'A peaceful visual timer.',
                          href: '/timers/candle-timer',
                          iconBg: 'bg-[#FCF3E4] text-[#D97706]',
                          icon: <Flame className="w-5 h-5" />,
                        },
                        {
                          name: 'Moon Timer',
                          desc: 'A calming moon timer.',
                          href: '/timers/moon-timer',
                          iconBg: 'bg-[#17253B] text-[#F5D08A]',
                          icon: <Moon className="w-5 h-5" />,
                        },
                        {
                          name: 'Sun Timer',
                          desc: 'A bright and cheerful timer.',
                          href: '/timers/sun-timer',
                          iconBg: 'bg-[#FFF3E0] text-[#E65F16]',
                          icon: <Sparkles className="w-5 h-5" />,
                        },
                        {
                          name: 'Frost Timer',
                          desc: 'A frost and ice timer.',
                          href: '/timers/frost-timer',
                          iconBg: 'bg-[#EBF5FF] text-[#0968B8]',
                          icon: (
                            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                              <line x1="12" y1="2" x2="12" y2="22" />
                              <line x1="3.34" y1="7" x2="20.66" y2="17" />
                              <line x1="20.66" y1="7" x2="3.34" y2="17" />
                            </svg>
                          ),
                        },
                      ].map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-[#222924] border border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#0968B8] transition-all group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg}`}>
                              {item.icon}
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-xs sm:text-sm text-[#252B27] dark:text-white group-hover:text-[#0968B8] transition-colors">
                                {item.name}
                              </div>
                              <div className="text-[11px] text-[#252B27]/70 dark:text-slate-400 truncate">
                                {item.desc}
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[#252B27]/40 group-hover:text-[#0968B8] group-hover:translate-x-0.5 transition-all shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}

              {/* If tool is Frost Timer, render the exact 2-column editorial + Tip box + Related Tools sidebar layout from the reference mockup */}
              {tool.slug === 'frost-timer' ? (
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                  {/* Center Editorial Sub-Column (xl:col-span-8) */}
                  <div className="xl:col-span-8 space-y-8">
                    <div id={tocIds[0]} className="scroll-mt-28">
                      <span className="text-[11px] font-bold tracking-widest text-[#1E7A4C] dark:text-emerald-400 uppercase block mb-1.5">
                        A COMPLETE GUIDE
                      </span>
                      <h2 className="font-serif text-2xl sm:text-3xl lg:text-[34px] leading-tight font-bold text-[#0E2338] dark:text-white mb-3">
                        What Is a Frost Timer?
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        A frost timer is a calming visual countdown timer that uses a frost or ice pattern to show the passage of time. As the timer runs, delicate frost crystals gradually spread across the screen, giving you a peaceful and engaging way to stay focused.
                      </p>
                    </div>

                    <div id={tocIds[1]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0E2338] dark:text-white mb-3">
                        How Frost Crystals Visualize Time
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        The animation starts with a clear surface and small frost patterns at the edges. As time passes, the crystals slowly grow and spread toward the center. The growth is smooth and accurately represents the remaining time. When the timer reaches zero, the screen is fully covered with frost and the countdown is complete.
                      </p>
                    </div>

                    <div id={tocIds[2]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0E2338] dark:text-white mb-4">
                        How to Use the Frost Countdown
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
                        <ol className="sm:col-span-7 space-y-3">
                          {editorial.guide.howToUseSteps.map((step, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-3 text-xs sm:text-sm text-[#252B27]/85 dark:text-slate-300"
                            >
                              <span className="w-6 h-6 rounded-full bg-[#0968B8] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>

                        {/* Soft Ice-Blue Tip Card on the right matching screenshot */}
                        <div className="sm:col-span-5 rounded-2xl bg-[#EBF3FA] dark:bg-[#192534] border border-[#D4E4F4] dark:border-[#293B52] p-4">
                          <div className="flex items-center gap-2 mb-1.5 text-[#0968B8] dark:text-sky-400">
                            <Lightbulb className="w-4 h-4 fill-current shrink-0" />
                            <span className="font-serif italic font-bold text-sm text-[#0E2338] dark:text-white">
                              Tip
                            </span>
                          </div>
                          <p className="text-xs text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                            Try different frost themes and background styles to create a calm and focused environment that matches your mood and activity.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div id={tocIds[3]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0E2338] dark:text-white mb-3">
                        Frost Timer for Focus and Classroom Activities
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        A frost timer is perfect for study sessions, work breaks, classroom activities and other timed tasks. The gentle frost animation helps create a calm atmosphere and makes time feel more natural and enjoyable.
                      </p>
                    </div>

                    <div id={tocIds[4]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0E2338] dark:text-white mb-3">
                        Frost Timer Display Settings
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        You can choose from different frost themes, adjust the background style, change the brightness, enable or disable sound and use reduced motion if you prefer a simpler effect.
                      </p>
                    </div>
                  </div>

                  {/* Right Sub-Column (xl:col-span-4): Related Tools Vertical Card List matching mockup */}
                  <div className="xl:col-span-4">
                    <div className="rounded-2xl border border-[#E4E1D9] dark:border-[#2D352F] bg-white/80 dark:bg-[#1A201C] p-4 sm:p-5 shadow-2xs space-y-3">
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-[#252B27] dark:text-white mb-2">
                        Related Tools
                      </h3>
                      {[
                        {
                          name: 'Pomodoro Timer',
                          desc: 'Stay focused with intervals.',
                          href: '/pomodoro-timer',
                          iconBg: 'bg-[#FDECE8] text-[#D94E34]',
                          icon: <Flame className="w-5 h-5" />,
                        },
                        {
                          name: 'Circular Timer',
                          desc: 'A simple circle countdown.',
                          href: '/timers/circular-timer',
                          iconBg: 'bg-[#E7EDE7] text-[#1E7A4C]',
                          icon: <Clock className="w-5 h-5" />,
                        },
                        {
                          name: 'Rings Timer',
                          desc: 'Multiple concentric rings.',
                          href: '/timers/rings-timer',
                          iconBg: 'bg-[#E7EDE7] text-[#1E7A4C]',
                          icon: <Clock className="w-5 h-5" />,
                        },
                        {
                          name: 'Progress Timer',
                          desc: 'A visual progress bar timer.',
                          href: '/timers/progress-timer',
                          iconBg: 'bg-[#FCF3E4] text-[#EA580C]',
                          icon: <Monitor className="w-5 h-5" />,
                        },
                        {
                          name: 'Pixel Timer',
                          desc: 'A retro pixel countdown.',
                          href: '/timers/pixel-timer',
                          iconBg: 'bg-[#E7EDE7] text-[#1E7A4C]',
                          icon: <Monitor className="w-5 h-5" />,
                        },
                        {
                          name: 'Blocks Timer',
                          desc: 'A stacked block timer.',
                          href: '/timers/blocks-timer',
                          iconBg: 'bg-[#FDECE8] text-[#D94E34]',
                          icon: <Clock className="w-5 h-5" />,
                        },
                        {
                          name: 'Candle Timer',
                          desc: 'A peaceful visual timer.',
                          href: '/timers/candle-timer',
                          iconBg: 'bg-[#FCF3E4] text-[#D97706]',
                          icon: <Flame className="w-5 h-5" />,
                        },
                        {
                          name: 'Moon Timer',
                          desc: 'A calming moon timer.',
                          href: '/timers/moon-timer',
                          iconBg: 'bg-[#17253B] text-[#F5D08A]',
                          icon: <Moon className="w-5 h-5" />,
                        },
                        {
                          name: 'Sun Timer',
                          desc: 'A bright and cheerful timer.',
                          href: '/timers/sun-timer',
                          iconBg: 'bg-[#FFF3E0] text-[#E65F16]',
                          icon: <Sparkles className="w-5 h-5" />,
                        },
                        {
                          name: 'Bubble Timer',
                          desc: 'A relaxing bubble timer.',
                          href: '/timers/bubble-timer',
                          iconBg: 'bg-[#EBF5FF] text-[#0076CE]',
                          icon: <Droplets className="w-5 h-5" />,
                        },
                      ].map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-[#222924] border border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#0968B8] transition-all group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg}`}>
                              {item.icon}
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-xs sm:text-sm text-[#252B27] dark:text-white group-hover:text-[#0968B8] transition-colors">
                                {item.name}
                              </div>
                              <div className="text-[11px] text-[#252B27]/70 dark:text-slate-400 truncate">
                                {item.desc}
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[#252B27]/40 group-hover:text-[#0968B8] group-hover:translate-x-0.5 transition-all shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}

              {/* If tool is Lichen Timer, render the exact 2-column editorial + Tip box + Related Tools sidebar layout from the reference mockup */}
              {tool.slug === 'lichen-timer' ? (
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                  {/* Center Editorial Sub-Column (xl:col-span-8) */}
                  <div className="xl:col-span-8 space-y-8">
                    <div id={tocIds[0]} className="scroll-mt-28">
                      <span className="text-[11px] font-bold tracking-widest text-[#2E5A36] dark:text-emerald-400 uppercase block mb-1.5">
                        A COMPLETE GUIDE
                      </span>
                      <h2 className="font-serif text-2xl sm:text-3xl lg:text-[34px] leading-tight font-bold text-[#0E2338] dark:text-white mb-3">
                        What Is a Lichen Timer?
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        A lichen timer is a calming visual countdown timer that uses a nature-inspired lichen growth animation to show the passage of time. As the timer runs, the lichen gradually spreads across the surface, giving you a peaceful and organic way to stay focused.
                      </p>
                    </div>

                    <div id={tocIds[1]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0E2338] dark:text-white mb-3">
                        How the Organic Countdown Visualization Works
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        The animation starts with a natural stone or bark surface and a small patch of lichen. As time passes, the lichen slowly grows and spreads with realistic textures and patterns. The growth rate is smooth and accurately represents the remaining time. When the timer reaches zero, the surface is fully covered and the countdown is complete.
                      </p>
                    </div>

                    <div id={tocIds[2]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0E2338] dark:text-white mb-4">
                        How to Use the Lichen Timer
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
                        <ol className="sm:col-span-7 space-y-3">
                          {editorial.guide.howToUseSteps.map((step, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-3 text-xs sm:text-sm text-[#252B27]/85 dark:text-slate-300"
                            >
                              <span className="w-6 h-6 rounded-full bg-[#2E5A36] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>

                        {/* Soft Sage-Stone Tip Card on the right matching screenshot */}
                        <div className="sm:col-span-5 rounded-2xl bg-[#EFEFE9] dark:bg-[#1E2520] border border-[#DCE0D8] dark:border-[#2E3A32] p-4">
                          <div className="flex items-center gap-2 mb-1.5 text-[#2E5A36] dark:text-emerald-400">
                            <Lightbulb className="w-4 h-4 fill-current shrink-0" />
                            <span className="font-serif italic font-bold text-sm text-[#0E2338] dark:text-white">
                              Tip
                            </span>
                          </div>
                          <p className="text-xs text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                            Try different lichen themes and background styles to create a relaxing natural environment that matches your mood and activity.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div id={tocIds[3]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0E2338] dark:text-white mb-3">
                        Nature-Inspired Timers for Quiet Activities
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        A lichen timer is perfect for reading, study sessions, creative work, mindfulness practice and other quiet activities. The slow and natural growth animation helps create a calm atmosphere and makes time feel more meaningful.
                      </p>
                    </div>

                    <div id={tocIds[4]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0E2338] dark:text-white mb-3">
                        Customizing the Lichen Display
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        You can choose from different lichen themes, change the background style, adjust the sound and enable or disable the numeric timer. Use the reduced motion option if you prefer less animation. This effect is a decorative artistic growth visualization rather than a biologically accurate lichen-growth simulation.
                      </p>
                    </div>
                  </div>

                  {/* Right Sub-Column (xl:col-span-4): Related Tools Vertical Card List matching mockup */}
                  <div className="xl:col-span-4">
                    <div className="rounded-2xl border border-[#E4E1D9] dark:border-[#2D352F] bg-white/80 dark:bg-[#1A201C] p-4 sm:p-5 shadow-2xs space-y-3">
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-[#252B27] dark:text-white mb-2">
                        Related Tools
                      </h3>
                      {[
                        {
                          name: 'Pomodoro Timer',
                          desc: 'Stay focused with intervals.',
                          href: '/pomodoro-timer',
                          iconBg: 'bg-[#FDECE8] text-[#D94E34]',
                          icon: <Flame className="w-5 h-5" />,
                        },
                        {
                          name: 'Circular Timer',
                          desc: 'A simple circle countdown.',
                          href: '/timers/circular-timer',
                          iconBg: 'bg-[#E7EDE7] text-[#1E7A4C]',
                          icon: <Clock className="w-5 h-5" />,
                        },
                        {
                          name: 'Rings Timer',
                          desc: 'Multiple concentric rings.',
                          href: '/timers/rings-timer',
                          iconBg: 'bg-[#E7EDE7] text-[#1E7A4C]',
                          icon: <Clock className="w-5 h-5" />,
                        },
                        {
                          name: 'Progress Timer',
                          desc: 'A visual progress bar timer.',
                          href: '/timers/progress-timer',
                          iconBg: 'bg-[#FCF3E4] text-[#EA580C]',
                          icon: <Monitor className="w-5 h-5" />,
                        },
                        {
                          name: 'Pixel Timer',
                          desc: 'A retro pixel countdown.',
                          href: '/timers/pixel-timer',
                          iconBg: 'bg-[#E7EDE7] text-[#1E7A4C]',
                          icon: <Monitor className="w-5 h-5" />,
                        },
                        {
                          name: 'Blocks Timer',
                          desc: 'A stacked block timer.',
                          href: '/timers/blocks-timer',
                          iconBg: 'bg-[#FDECE8] text-[#D94E34]',
                          icon: <Clock className="w-5 h-5" />,
                        },
                        {
                          name: 'Candle Timer',
                          desc: 'A peaceful visual timer.',
                          href: '/timers/candle-timer',
                          iconBg: 'bg-[#FCF3E4] text-[#D97706]',
                          icon: <Flame className="w-5 h-5" />,
                        },
                        {
                          name: 'Moon Timer',
                          desc: 'A calming moon timer.',
                          href: '/timers/moon-timer',
                          iconBg: 'bg-[#17253B] text-[#F5D08A]',
                          icon: <Moon className="w-5 h-5" />,
                        },
                        {
                          name: 'Sun Timer',
                          desc: 'A bright and cheerful timer.',
                          href: '/timers/sun-timer',
                          iconBg: 'bg-[#FFF3E0] text-[#E65F16]',
                          icon: <Sparkles className="w-5 h-5" />,
                        },
                        {
                          name: 'Bubble Timer',
                          desc: 'A relaxing bubble timer.',
                          href: '/timers/bubble-timer',
                          iconBg: 'bg-[#EBF5FF] text-[#0076CE]',
                          icon: <Droplets className="w-5 h-5" />,
                        },
                      ].map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-[#222924] border border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#2E5A36] transition-all group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg}`}>
                              {item.icon}
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-xs sm:text-sm text-[#252B27] dark:text-white group-hover:text-[#2E5A36] transition-colors">
                                {item.name}
                              </div>
                              <div className="text-[11px] text-[#252B27]/70 dark:text-slate-400 truncate">
                                {item.desc}
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[#252B27]/40 group-hover:text-[#2E5A36] group-hover:translate-x-0.5 transition-all shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}

              {/* If tool is Coral Timer, render the exact 2-column editorial + Tip box + Related Tools sidebar layout from the reference mockup */}
              {tool.slug === 'coral-timer' ? (
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                  {/* Center Editorial Sub-Column (xl:col-span-8) */}
                  <div className="xl:col-span-8 space-y-8">
                    <div id={tocIds[0]} className="scroll-mt-28">
                      <span className="text-[11px] font-bold tracking-widest text-[#F35B4F] uppercase block mb-1.5">
                        A COMPLETE GUIDE
                      </span>
                      <h2 className="font-serif text-2xl sm:text-3xl lg:text-[34px] leading-tight font-bold text-[#0E2338] dark:text-white mb-3">
                        What Is a Coral Visual Timer?
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        A coral visual timer is a calming countdown timer that uses an underwater scene with a growing coral structure to show the passage of time. As the timer runs, the coral gradually grows, giving you a peaceful and engaging way to stay focused.
                      </p>
                    </div>

                    <div id={tocIds[1]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0E2338] dark:text-white mb-3">
                        How the Coral Growth Countdown Works
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        The animation starts with a small coral base. As time passes, new branches and details appear gradually. The coral grows smoothly and accurately to match the selected duration. When the timer reaches zero, the coral is fully grown and the countdown is complete.
                      </p>
                    </div>

                    <div id={tocIds[2]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0E2338] dark:text-white mb-4">
                        How to Use the Coral Timer
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
                        <ol className="sm:col-span-7 space-y-3">
                          {editorial.guide.howToUseSteps.map((step, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-3 text-xs sm:text-sm text-[#252B27]/85 dark:text-slate-300"
                            >
                              <span className="w-6 h-6 rounded-full bg-[#026AA7] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>

                        {/* Soft Coral-Tinted Tip Card on the right matching screenshot */}
                        <div className="sm:col-span-5 rounded-2xl bg-[#FDF2EF] dark:bg-[#261B1A] border border-[#F5DCD6] dark:border-[#3D2927] p-4">
                          <div className="flex items-center gap-2 mb-1.5 text-[#F35B4F]">
                            <Lightbulb className="w-4 h-4 fill-current shrink-0" />
                            <span className="font-serif italic font-bold text-sm text-[#0E2338] dark:text-white">
                              Tip
                            </span>
                          </div>
                          <p className="text-xs text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                            Try different coral themes and backgrounds to create a relaxing environment that matches your mood and activity.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div id={tocIds[3]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0E2338] dark:text-white mb-3">
                        Ocean-Themed Visual Timers for Learning
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        A coral timer is great for classrooms, study sessions, reading, creative tasks and other focused activities. The gentle underwater scene helps create a calm atmosphere and makes time management more enjoyable for students and adults.
                      </p>
                    </div>

                    <div id={tocIds[4]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0E2338] dark:text-white mb-3">
                        Customize Your Underwater Timer
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        You can choose from different coral themes, change the background style, adjust the sound and enable or disable reduced motion. Customize the timer to create a visual experience that feels calm and inspiring. This is an artistic visual metaphor for time management and does not represent real coral growth rates or environmental monitoring.
                      </p>
                    </div>
                  </div>

                  {/* Right Sub-Column (xl:col-span-4): Related Tools Vertical Card List matching mockup */}
                  <div className="xl:col-span-4">
                    <div className="rounded-2xl border border-[#E4E1D9] dark:border-[#2D352F] bg-white/80 dark:bg-[#1A201C] p-4 sm:p-5 shadow-2xs space-y-3">
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-[#252B27] dark:text-white mb-2">
                        Related Tools
                      </h3>
                      {[
                        {
                          name: 'Pomodoro Timer',
                          desc: 'Stay focused with intervals.',
                          href: '/pomodoro-timer',
                          iconBg: 'bg-[#FDECE8] text-[#D94E34]',
                          icon: <Flame className="w-5 h-5" />,
                        },
                        {
                          name: 'Circular Timer',
                          desc: 'A simple circle countdown.',
                          href: '/timers/circular-timer',
                          iconBg: 'bg-[#E7EDE7] text-[#1E7A4C]',
                          icon: <Clock className="w-5 h-5" />,
                        },
                        {
                          name: 'Rings Timer',
                          desc: 'Multiple concentric rings.',
                          href: '/timers/rings-timer',
                          iconBg: 'bg-[#E7EDE7] text-[#1E7A4C]',
                          icon: <Clock className="w-5 h-5" />,
                        },
                        {
                          name: 'Progress Timer',
                          desc: 'A visual progress bar timer.',
                          href: '/timers/progress-timer',
                          iconBg: 'bg-[#FCF3E4] text-[#EA580C]',
                          icon: <Monitor className="w-5 h-5" />,
                        },
                        {
                          name: 'Pixel Timer',
                          desc: 'A retro pixel countdown.',
                          href: '/timers/pixel-timer',
                          iconBg: 'bg-[#E7EDE7] text-[#1E7A4C]',
                          icon: <Monitor className="w-5 h-5" />,
                        },
                        {
                          name: 'Blocks Timer',
                          desc: 'A stacked block timer.',
                          href: '/timers/blocks-timer',
                          iconBg: 'bg-[#FDECE8] text-[#D94E34]',
                          icon: <Clock className="w-5 h-5" />,
                        },
                        {
                          name: 'Candle Timer',
                          desc: 'A peaceful visual timer.',
                          href: '/timers/candle-timer',
                          iconBg: 'bg-[#FCF3E4] text-[#D97706]',
                          icon: <Flame className="w-5 h-5" />,
                        },
                        {
                          name: 'Moon Timer',
                          desc: 'A calming moon timer.',
                          href: '/timers/moon-timer',
                          iconBg: 'bg-[#17253B] text-[#F5D08A]',
                          icon: <Moon className="w-5 h-5" />,
                        },
                        {
                          name: 'Sun Timer',
                          desc: 'A bright and cheerful timer.',
                          href: '/timers/sun-timer',
                          iconBg: 'bg-[#FFF3E0] text-[#E65F16]',
                          icon: <Sparkles className="w-5 h-5" />,
                        },
                        {
                          name: 'Aesthetic Timer',
                          desc: 'Beautiful timer themes.',
                          href: '/timers/aesthetic-timer',
                          iconBg: 'bg-[#F3E8FF] text-[#9333EA]',
                          icon: <Palette className="w-5 h-5" />,
                        },
                      ].map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-[#222924] border border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#F35B4F] transition-all group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg}`}>
                              {item.icon}
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-xs sm:text-sm text-[#252B27] dark:text-white group-hover:text-[#F35B4F] transition-colors">
                                {item.name}
                              </div>
                              <div className="text-[11px] text-[#252B27]/70 dark:text-slate-400 truncate">
                                {item.desc}
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[#252B27]/40 group-hover:text-[#F35B4F] group-hover:translate-x-0.5 transition-all shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}

              {/* If tool is Bubble Timer, render the exact 2-column editorial + Tip box + Related Tools sidebar layout from the reference mockup */}
              {tool.slug === 'bubble-timer' ? (
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                  {/* Center Editorial Sub-Column (xl:col-span-8) */}
                  <div className="xl:col-span-8 space-y-8">
                    <div id={tocIds[0]} className="scroll-mt-28">
                      <span className="text-[11px] font-bold tracking-widest text-[#1E7A4C] dark:text-[#5E917A] uppercase block mb-1.5">
                        A COMPLETE GUIDE
                      </span>
                      <h2 className="font-serif text-2xl sm:text-3xl lg:text-[34px] leading-tight font-bold text-[#0E2338] dark:text-white mb-3">
                        What Is a Bubble Timer?
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        A bubble timer is a visual countdown timer that uses gentle, floating bubbles to show the passage of time. As the timer runs, the bubbles gradually change, giving you a calm and engaging way to stay focused, relaxed and productive.
                      </p>
                    </div>

                    <div id={tocIds[1]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0E2338] dark:text-white mb-3">
                        How the Bubble Countdown Works
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        When you start the timer, bubbles appear and gently rise through the scene. As time passes, the number of bubbles decreases or they gradually fade, showing the remaining time. When the timer reaches zero, the bubbles stop and the countdown is complete.
                      </p>
                    </div>

                    <div id={tocIds[2]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0E2338] dark:text-white mb-4">
                        How to Use the Bubble Timer
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
                        <ol className="sm:col-span-7 space-y-3">
                          {editorial.guide.howToUseSteps.map((step, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-3 text-xs sm:text-sm text-[#252B27]/85 dark:text-slate-300"
                            >
                              <span className="w-6 h-6 rounded-full bg-[#0277CC] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>

                        {/* Soft Sky-Blue Tip Card on the right matching screenshot */}
                        <div className="sm:col-span-5 rounded-2xl bg-[#EAF4FC] dark:bg-[#172432] border border-[#D3E7F8] dark:border-[#263B52] p-4">
                          <div className="flex items-center gap-2 mb-1.5 text-[#0277CC] dark:text-[#38BDF8]">
                            <Lightbulb className="w-4 h-4 fill-current shrink-0" />
                            <span className="font-serif italic font-bold text-sm text-[#0E2338] dark:text-white">
                              Tip
                            </span>
                          </div>
                          <p className="text-xs text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                            Try a lower bubble density for a calmer experience or a higher density for a more playful look.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div id={tocIds[3]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0E2338] dark:text-white mb-3">
                        Bubble Timer for Classrooms and Everyday Activities
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        A bubble timer is great for classroom transitions, study sessions, creative tasks, quiet time and daily routines. The calm bubble animation helps children and adults stay focused without distractions.
                      </p>
                    </div>

                    <div id={tocIds[4]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0E2338] dark:text-white mb-3">
                        Customizing Bubble Movement and Appearance
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        You can choose from different bubble themes, adjust the bubble density, change the background style and enable or disable the numeric timer. Use the reduced motion option if you prefer less animation.
                      </p>
                    </div>
                  </div>

                  {/* Right Sub-Column (xl:col-span-4): Related Tools Vertical Card List matching mockup */}
                  <div className="xl:col-span-4">
                    <div className="rounded-2xl border border-[#E4E1D9] dark:border-[#2D352F] bg-white/80 dark:bg-[#1A201C] p-4 sm:p-5 shadow-2xs space-y-3">
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-[#252B27] dark:text-white mb-2">
                        Related Tools
                      </h3>
                      {[
                        {
                          name: 'Pomodoro Timer',
                          desc: 'Stay focused with intervals.',
                          href: '/pomodoro-timer',
                          iconBg: 'bg-[#FDECE8] text-[#D94E34]',
                          icon: <Flame className="w-5 h-5" />,
                        },
                        {
                          name: 'Circular Timer',
                          desc: 'A simple circle countdown.',
                          href: '/timers/circular-timer',
                          iconBg: 'bg-[#E7EDE7] text-[#1E7A4C]',
                          icon: <Clock className="w-5 h-5" />,
                        },
                        {
                          name: 'Rings Timer',
                          desc: 'Multiple concentric rings.',
                          href: '/timers/rings-timer',
                          iconBg: 'bg-[#E7EDE7] text-[#1E7A4C]',
                          icon: <Clock className="w-5 h-5" />,
                        },
                        {
                          name: 'Progress Timer',
                          desc: 'A visual progress bar timer.',
                          href: '/timers/progress-timer',
                          iconBg: 'bg-[#FCF3E4] text-[#EA580C]',
                          icon: <Monitor className="w-5 h-5" />,
                        },
                        {
                          name: 'Pixel Timer',
                          desc: 'A retro pixel countdown.',
                          href: '/timers/pixel-timer',
                          iconBg: 'bg-[#E7EDE7] text-[#1E7A4C]',
                          icon: <Monitor className="w-5 h-5" />,
                        },
                        {
                          name: 'Blocks Timer',
                          desc: 'A stacked block timer.',
                          href: '/timers/blocks-timer',
                          iconBg: 'bg-[#FDECE8] text-[#D94E34]',
                          icon: <Clock className="w-5 h-5" />,
                        },
                        {
                          name: 'Candle Timer',
                          desc: 'A peaceful visual timer.',
                          href: '/timers/candle-timer',
                          iconBg: 'bg-[#FCF3E4] text-[#D97706]',
                          icon: <Flame className="w-5 h-5" />,
                        },
                        {
                          name: 'Moon Timer',
                          desc: 'A calming moon timer.',
                          href: '/timers/moon-timer',
                          iconBg: 'bg-[#17253B] text-[#F5D08A]',
                          icon: <Moon className="w-5 h-5" />,
                        },
                        {
                          name: 'Sun Timer',
                          desc: 'A bright and cheerful timer.',
                          href: '/timers/sun-timer',
                          iconBg: 'bg-[#FFF3E0] text-[#E65F16]',
                          icon: <Sparkles className="w-5 h-5" />,
                        },
                        {
                          name: 'Aesthetic Timer',
                          desc: 'Beautiful timer themes.',
                          href: '/timers/aesthetic-timer',
                          iconBg: 'bg-[#F3E8FF] text-[#9333EA]',
                          icon: <Palette className="w-5 h-5" />,
                        },
                      ].map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-[#222924] border border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#0277CC] transition-all group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg}`}>
                              {item.icon}
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-xs sm:text-sm text-[#252B27] dark:text-white group-hover:text-[#0277CC] transition-colors">
                                {item.name}
                              </div>
                              <div className="text-[11px] text-[#252B27]/70 dark:text-slate-400 truncate">
                                {item.desc}
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[#252B27]/40 group-hover:text-[#0277CC] group-hover:translate-x-0.5 transition-all shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}

              {/* If tool is Sun Timer, render the exact 2-column editorial + Tip box + Related Tools sidebar layout from the reference mockup */}
              {tool.slug === 'sun-timer' ? (
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                  {/* Center Editorial Sub-Column (xl:col-span-8) */}
                  <div className="xl:col-span-8 space-y-8">
                    <div id={tocIds[0]} className="scroll-mt-28">
                      <span className="text-[11px] font-bold tracking-widest text-[#E65F16] uppercase block mb-1.5">
                        A COMPLETE GUIDE
                      </span>
                      <h2 className="font-serif text-2xl sm:text-3xl lg:text-[34px] leading-tight font-bold text-[#0E2338] dark:text-white mb-3">
                        What Is a Sun Visual Timer?
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        A sun visual timer is a calming countdown timer that uses a sun and sky scene to show the passage of time. As the timer runs, the sun moves along a smooth path and the sky gradually changes, giving you a peaceful and visual way to stay focused.
                      </p>
                    </div>

                    <div id={tocIds[1]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0E2338] dark:text-white mb-3">
                        How the Sun Countdown Works
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        The timer starts with the sun at the beginning of its path. As time passes, the sun moves across the sky along a curved arc and the background colors change smoothly. The position of the sun accurately represents the remaining time. When the timer reaches zero, the animation reaches its final state based on the selected theme.
                      </p>
                    </div>

                    <div id={tocIds[2]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0E2338] dark:text-white mb-4">
                        How to Use the Sun Timer
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
                        <ol className="sm:col-span-7 space-y-3">
                          {editorial.guide.howToUseSteps.map((step, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-3 text-xs sm:text-sm text-[#252B27]/85 dark:text-slate-300"
                            >
                              <span className="w-6 h-6 rounded-full bg-[#E65F16] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>

                        {/* Warm Cream Tip Card on the right matching screenshot */}
                        <div className="sm:col-span-5 rounded-2xl bg-[#FDF4EB] dark:bg-[#241E1A] border border-[#F4DFC8] dark:border-[#3A2E25] p-4">
                          <div className="flex items-center gap-2 mb-1.5 text-[#F59E0B]">
                            <Lightbulb className="w-4 h-4 fill-current shrink-0" />
                            <span className="font-serif italic font-bold text-sm text-[#252B27] dark:text-white">
                              Tip
                            </span>
                          </div>
                          <p className="text-xs text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                            Try different sky themes to match your mood and environment. A morning scene is great for focus, while a sunset theme can feel more relaxing.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div id={tocIds[3]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0E2338] dark:text-white mb-3">
                        Sun Timer for Morning and Daily Routines
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        A sun timer can help you build better habits, stay consistent with your routines and create dedicated time for reading, studying, exercise and other daily activities. The gentle visual progression makes it easy to stay on track.
                      </p>
                    </div>

                    <div id={tocIds[4]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0E2338] dark:text-white mb-3">
                        Sun-Inspired Timers for Learning and Activities
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        Teachers, students and families can use the sun timer for classroom activities, homework sessions, timed tasks and group challenges. The clear and engaging visual makes time feel more natural and easy to understand.
                      </p>
                    </div>

                    <div id={tocIds[5]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0E2338] dark:text-white mb-3">
                        Sun Timer vs Sunrise and Sunset Calculator
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        A sun timer is a decorative countdown visualization. It does not calculate real sunrise or sunset times and does not use your location, date or astronomical data.
                      </p>
                    </div>
                  </div>

                  {/* Right Sub-Column (xl:col-span-4): Related Tools Vertical Card List matching mockup */}
                  <div className="xl:col-span-4">
                    <div className="rounded-2xl border border-[#E4E1D9] dark:border-[#2D352F] bg-white/80 dark:bg-[#1A201C] p-4 sm:p-5 shadow-2xs space-y-3">
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-[#252B27] dark:text-white mb-2">
                        Related Tools
                      </h3>
                      {[
                        {
                          name: 'Pomodoro Timer',
                          desc: 'Stay focused with intervals.',
                          href: '/pomodoro-timer',
                          iconBg: 'bg-[#FDECE8] text-[#D94E34]',
                          icon: <Flame className="w-5 h-5" />,
                        },
                        {
                          name: 'Circular Timer',
                          desc: 'A simple circle countdown.',
                          href: '/timers/circular-timer',
                          iconBg: 'bg-[#E7EDE7] text-[#1E7A4C]',
                          icon: <Clock className="w-5 h-5" />,
                        },
                        {
                          name: 'Rings Timer',
                          desc: 'Multiple concentric rings.',
                          href: '/timers/rings-timer',
                          iconBg: 'bg-[#E7EDE7] text-[#1E7A4C]',
                          icon: <Clock className="w-5 h-5" />,
                        },
                        {
                          name: 'Progress Timer',
                          desc: 'A visual progress bar timer.',
                          href: '/timers/progress-timer',
                          iconBg: 'bg-[#FCF3E4] text-[#EA580C]',
                          icon: <Monitor className="w-5 h-5" />,
                        },
                        {
                          name: 'Pixel Timer',
                          desc: 'A retro pixel countdown.',
                          href: '/timers/pixel-timer',
                          iconBg: 'bg-[#E7EDE7] text-[#1E7A4C]',
                          icon: <Monitor className="w-5 h-5" />,
                        },
                        {
                          name: 'Blocks Timer',
                          desc: 'A stacked block timer.',
                          href: '/timers/blocks-timer',
                          iconBg: 'bg-[#FDECE8] text-[#D94E34]',
                          icon: <Clock className="w-5 h-5" />,
                        },
                        {
                          name: 'Candle Timer',
                          desc: 'A peaceful visual timer.',
                          href: '/timers/candle-timer',
                          iconBg: 'bg-[#FCF3E4] text-[#D97706]',
                          icon: <Flame className="w-5 h-5" />,
                        },
                        {
                          name: 'Aesthetic Timer',
                          desc: 'Beautiful timer themes.',
                          href: '/timers/aesthetic-timer',
                          iconBg: 'bg-[#F3E8FF] text-[#9333EA]',
                          icon: <Palette className="w-5 h-5" />,
                        },
                      ].map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-[#222924] border border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#E65F16] transition-all group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg}`}>
                              {item.icon}
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-xs sm:text-sm text-[#252B27] dark:text-white group-hover:text-[#E65F16] transition-colors">
                                {item.name}
                              </div>
                              <div className="text-[11px] text-[#252B27]/70 dark:text-slate-400 truncate">
                                {item.desc}
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[#252B27]/40 group-hover:text-[#E65F16] group-hover:translate-x-0.5 transition-all shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}

              {/* If tool is Moon Timer, render the exact 2-column editorial + Tip box + Related Tools sidebar layout from the reference mockup */}
              {tool.slug === 'moon-timer' ? (
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                  {/* Center Editorial Sub-Column (xl:col-span-8) */}
                  <div className="xl:col-span-8 space-y-8">
                    <div id={tocIds[0]} className="scroll-mt-28">
                      <span className="text-[11px] font-bold tracking-widest text-[#1E7A4C] dark:text-[#5E917A] uppercase block mb-1.5">
                        A COMPLETE GUIDE
                      </span>
                      <h2 className="font-serif text-2xl sm:text-3xl lg:text-[34px] leading-tight font-bold text-[#252B27] dark:text-white mb-3">
                        What Is a Moon Visual Timer?
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        A moon visual timer is a calming countdown timer that uses a moon design to show the remaining time. As the timer runs, the illuminated part of the moon gradually changes, giving you a peaceful and visual way to stay focused.
                      </p>
                    </div>

                    <div id={tocIds[1]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252B27] dark:text-white mb-3">
                        How the Moon Countdown Animation Works
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        The timer starts with a bright moon and the shadow slowly moves across the moon as time passes. The illuminated portion reduces smoothly and accurately to match the selected duration. When the timer reaches zero, the moon reaches its completed state based on the chosen theme.
                      </p>
                    </div>

                    <div id={tocIds[2]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252B27] dark:text-white mb-4">
                        How to Use the Moon Timer
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
                        <ol className="sm:col-span-7 space-y-3">
                          {editorial.guide.howToUseSteps.map((step, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-3 text-xs sm:text-sm text-[#252B27]/85 dark:text-slate-300"
                            >
                              <span className="w-6 h-6 rounded-full bg-[#174578] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>

                        {/* Soft Slate-Blue Tip Card on the right matching screenshot */}
                        <div className="sm:col-span-5 rounded-2xl bg-[#EEF2F7] dark:bg-[#1B222D] border border-[#DCE4EE] dark:border-[#2C3748] p-4">
                          <div className="flex items-center gap-2 mb-1.5 text-[#174578] dark:text-[#60A5FA]">
                            <Lightbulb className="w-4 h-4 fill-current shrink-0" />
                            <span className="font-serif italic font-bold text-sm text-[#252B27] dark:text-white">
                              Tip
                            </span>
                          </div>
                          <p className="text-xs text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                            Try different moon styles and backgrounds to create a relaxing environment for your activity.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div id={tocIds[3]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252B27] dark:text-white mb-3">
                        Moon Timer for Quiet Activities and Evening Routines
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        The moon timer is perfect for reading, journaling, meditation, evening study sessions and other quiet activities. The soft visual countdown helps you stay focused and creates a calm atmosphere, especially during nighttime routines.
                      </p>
                    </div>

                    <div id={tocIds[4]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252B27] dark:text-white mb-3">
                        Moon Timer vs Actual Lunar Phases
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        This is a decorative countdown timer and not a real moon-phase tracker. It does not show astronomical data or live lunar phases. The animation is only a visual representation of the selected duration.
                      </p>
                    </div>
                  </div>

                  {/* Right Sub-Column (xl:col-span-4): Related Tools Vertical Card List matching mockup */}
                  <div className="xl:col-span-4">
                    <div className="rounded-2xl border border-[#E4E1D9] dark:border-[#2D352F] bg-white/80 dark:bg-[#1A201C] p-4 sm:p-5 shadow-2xs space-y-3">
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-[#252B27] dark:text-white mb-2">
                        Related Tools
                      </h3>
                      {[
                        {
                          name: 'Pomodoro Timer',
                          desc: 'Stay focused with intervals.',
                          href: '/pomodoro-timer',
                          iconBg: 'bg-[#FDECE8] text-[#D94E34]',
                          icon: <Flame className="w-5 h-5" />,
                        },
                        {
                          name: 'Circular Timer',
                          desc: 'A simple circle countdown.',
                          href: '/timers/circular-timer',
                          iconBg: 'bg-[#E7EDE7] text-[#1E7A4C]',
                          icon: <Clock className="w-5 h-5" />,
                        },
                        {
                          name: 'Rings Timer',
                          desc: 'Multiple concentric rings.',
                          href: '/timers/rings-timer',
                          iconBg: 'bg-[#E7EDE7] text-[#1E7A4C]',
                          icon: <Clock className="w-5 h-5" />,
                        },
                        {
                          name: 'Progress Timer',
                          desc: 'A visual progress bar timer.',
                          href: '/timers/progress-timer',
                          iconBg: 'bg-[#FCF3E4] text-[#EA580C]',
                          icon: <Monitor className="w-5 h-5" />,
                        },
                        {
                          name: 'Pixel Timer',
                          desc: 'A retro pixel countdown.',
                          href: '/timers/pixel-timer',
                          iconBg: 'bg-[#E7EDE7] text-[#1E7A4C]',
                          icon: <Monitor className="w-5 h-5" />,
                        },
                        {
                          name: 'Blocks Timer',
                          desc: 'A stacked block timer.',
                          href: '/timers/blocks-timer',
                          iconBg: 'bg-[#FDECE8] text-[#D94E34]',
                          icon: <Clock className="w-5 h-5" />,
                        },
                        {
                          name: 'Candle Timer',
                          desc: 'A peaceful visual timer.',
                          href: '/timers/candle-timer',
                          iconBg: 'bg-[#FCF3E4] text-[#D97706]',
                          icon: <Flame className="w-5 h-5" />,
                        },
                        {
                          name: 'Aesthetic Timer',
                          desc: 'Beautiful timer themes.',
                          href: '/timers/aesthetic-timer',
                          iconBg: 'bg-[#F3E8FF] text-[#9333EA]',
                          icon: <Palette className="w-5 h-5" />,
                        },
                      ].map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-[#222924] border border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#174578] transition-all group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg}`}>
                              {item.icon}
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-xs sm:text-sm text-[#252B27] dark:text-white group-hover:text-[#174578] transition-colors">
                                {item.name}
                              </div>
                              <div className="text-[11px] text-[#252B27]/70 dark:text-slate-400 truncate">
                                {item.desc}
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[#252B27]/40 group-hover:text-[#174578] group-hover:translate-x-0.5 transition-all shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}

              {/* If tool is Heart Timer, render the exact 2-column editorial + Tip box + Related Tools sidebar layout from the reference mockup */}
              {tool.slug === 'heart-timer' ? (
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                  {/* Center Editorial Sub-Column (xl:col-span-8) */}
                  <div className="xl:col-span-8 space-y-8">
                    <div id={tocIds[0]} className="scroll-mt-28">
                      <span className="text-[11px] font-bold tracking-widest text-[#D43753] uppercase block mb-1.5">
                        A COMPLETE GUIDE
                      </span>
                      <h2 className="font-serif text-2xl sm:text-3xl lg:text-[34px] leading-tight font-bold text-[#252B27] dark:text-white mb-3">
                        What Is a Heart-Shaped Timer?
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        A heart-shaped timer is a visual countdown timer that uses a heart design to show the remaining time. The heart fill gradually decreases as time passes, giving you a clear and engaging way to stay on track.
                      </p>
                    </div>

                    <div id={tocIds[1]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252B27] dark:text-white mb-3">
                        How the Heart Countdown Works
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        The heart starts with a full color fill. As time passes, the fill level reduces smoothly and accurately. When the timer reaches zero, the heart is empty and the countdown is complete.
                      </p>
                    </div>

                    <div id={tocIds[2]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252B27] dark:text-white mb-4">
                        How to Use the Heart Timer
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
                        <ol className="sm:col-span-7 space-y-3">
                          {editorial.guide.howToUseSteps.map((step, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-3 text-xs sm:text-sm text-[#252B27]/85 dark:text-slate-300"
                            >
                              <span className="w-6 h-6 rounded-full bg-[#D43753] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>

                        {/* Warm Blush Tip Card on the right matching screenshot */}
                        <div className="sm:col-span-5 rounded-2xl bg-[#FDF4F5] dark:bg-[#241B1E] border border-[#F2DCE0] dark:border-[#3A282D] p-4">
                          <div className="flex items-center gap-2 mb-1.5 text-[#D43753]">
                            <Lightbulb className="w-4 h-4 fill-current shrink-0" />
                            <span className="font-serif italic font-bold text-sm text-[#252B27] dark:text-white">
                              Tip
                            </span>
                          </div>
                          <p className="text-xs text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                            Try different themes and colors to find the one that helps you stay focused and calm.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div id={tocIds[3]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252B27] dark:text-white mb-3">
                        Heart Timer for Activities and Games
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        A heart timer adds a fun and friendly touch to your activities. It&apos;s great for reading breaks, classroom challenges, timed games and personal routines. The simple visual design keeps everyone engaged and aware of the time.
                      </p>
                    </div>

                    <div id={tocIds[4]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252B27] dark:text-white mb-3">
                        Customize the Heart Timer Display
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        Choose from a variety of heart styles and color themes. You can also adjust the size, sound, and display options to match your mood and environment.
                      </p>
                    </div>
                  </div>

                  {/* Right Sub-Column (xl:col-span-4): Related Tools Vertical Card List matching mockup */}
                  <div className="xl:col-span-4">
                    <div className="rounded-2xl border border-[#E4E1D9] dark:border-[#2D352F] bg-white/80 dark:bg-[#1A201C] p-4 sm:p-5 shadow-2xs space-y-3">
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-[#252B27] dark:text-white mb-2">
                        Related Tools
                      </h3>
                      {[
                        {
                          name: 'Pomodoro Timer',
                          desc: 'Stay focused with intervals.',
                          href: '/pomodoro-timer',
                          iconBg: 'bg-[#FDECE8] text-[#D94E34]',
                          icon: <Flame className="w-5 h-5" />,
                        },
                        {
                          name: 'Circular Timer',
                          desc: 'A simple circle countdown.',
                          href: '/timers/circular-timer',
                          iconBg: 'bg-[#E7EDE7] text-[#1E7A4C]',
                          icon: <Clock className="w-5 h-5" />,
                        },
                        {
                          name: 'Progress Timer',
                          desc: 'A visual progress bar timer.',
                          href: '/timers/progress-timer',
                          iconBg: 'bg-[#E7EDE7] text-[#1E7A4C]',
                          icon: <Monitor className="w-5 h-5" />,
                        },
                        {
                          name: 'Rings Timer',
                          desc: 'Multiple concentric rings.',
                          href: '/timers/rings-timer',
                          iconBg: 'bg-[#E7EDE7] text-[#1E7A4C]',
                          icon: <Clock className="w-5 h-5" />,
                        },
                        {
                          name: 'Sand Timer',
                          desc: 'A realistic sand animation.',
                          href: '/timers/sand-timer',
                          iconBg: 'bg-[#FCF3E4] text-[#C87A28]',
                          icon: <Hourglass className="w-5 h-5" />,
                        },
                        {
                          name: 'Candle Timer',
                          desc: 'A peaceful visual timer.',
                          href: '/timers/candle-timer',
                          iconBg: 'bg-[#FCF3E4] text-[#D97706]',
                          icon: <Flame className="w-5 h-5" />,
                        },
                      ].map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-[#222924] border border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#365C4B] transition-all group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg}`}>
                              {item.icon}
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-xs sm:text-sm text-[#252B27] dark:text-white group-hover:text-[#365C4B] transition-colors">
                                {item.name}
                              </div>
                              <div className="text-[11px] text-[#252B27]/70 dark:text-slate-400 truncate">
                                {item.desc}
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[#252B27]/40 group-hover:text-[#365C4B] group-hover:translate-x-0.5 transition-all shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}

              {/* If tool is Picture Reveal Timer, render the exact 2-column editorial + Related Tools sidebar layout from the reference mockup */}
              {tool.slug === 'picture-reveal-timer' ? (
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                  {/* Center Editorial Sub-Column (xl:col-span-8) */}
                  <div className="xl:col-span-8 space-y-8">
                    <div id={tocIds[0]} className="scroll-mt-28">
                      <span className="text-[11px] font-bold tracking-widest text-[#365C4B] dark:text-[#5E917A] uppercase block mb-1.5">
                        A COMPLETE GUIDE
                      </span>
                      <h2 className="font-serif text-2xl sm:text-3xl lg:text-[34px] leading-tight font-bold text-[#252B27] dark:text-white mb-3">
                        What Is a Picture Reveal Timer?
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        A picture reveal timer is a visual countdown timer that hides an image behind a grid of tiles and gradually reveals it as time passes. It is a fun and engaging way to build excitement for classroom activities, games, quizzes and group events.
                      </p>
                    </div>

                    <div id={tocIds[1]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252B27] dark:text-white mb-3">
                        How the Photo Reveal Countdown Works
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        The uploaded image is divided into a grid of tiles. As the countdown runs, the tiles disappear either randomly or in a set order, gradually revealing the picture underneath. When the timer reaches zero, the full image is displayed.
                      </p>
                    </div>

                    <div id={tocIds[2]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252B27] dark:text-white mb-4">
                        How to Upload and Reveal Your Picture
                      </h2>
                      <ol className="space-y-3">
                        {editorial.guide.howToUseSteps.map((step, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-3 text-xs sm:text-sm text-[#252B27]/85 dark:text-slate-300"
                          >
                            <span className="w-6 h-6 rounded-full bg-[#1F4E3B] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div id={tocIds[3]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252B27] dark:text-white mb-3">
                        Picture Reveal Timer for Classrooms
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        Teachers can use this tool to create engaging classroom activities. Students can guess the image as it slowly appears, making lessons more interactive and fun. It works well for quizzes, vocabulary practice and group challenges.
                      </p>
                    </div>

                    <div id={tocIds[4]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252B27] dark:text-white mb-3">
                        Photo Guessing Games and Group Activities
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        Use the picture reveal countdown for trivia nights, icebreakers, party surprises, reward activities and product reveals. Watching the mystery image emerge tile by tile keeps participants curious and attentive.
                      </p>
                    </div>

                    <div id={tocIds[5]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252B27] dark:text-white mb-3">
                        Image Privacy and Browser Processing
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        Your privacy is fully protected. All uploaded JPG, PNG and WebP photos are processed locally inside your browser and are never uploaded to or stored on a server. You can replace or remove your photo at any time.
                      </p>
                    </div>
                  </div>

                  {/* Right Sub-Column (xl:col-span-4): Related Tools Vertical Card List matching mockup */}
                  <div className="xl:col-span-4">
                    <div className="rounded-2xl border border-[#E4E1D9] dark:border-[#2D352F] bg-white/80 dark:bg-[#1A201C] p-4 sm:p-5 shadow-2xs space-y-3">
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-[#252B27] dark:text-white mb-2">
                        Related Tools
                      </h3>
                      {[
                        {
                          name: 'Sand Timer',
                          desc: 'A realistic sand animation.',
                          href: '/timers/sand-timer',
                          iconBg: 'bg-[#FCF3E4] text-[#C87A28]',
                          icon: <Hourglass className="w-5 h-5" />,
                        },
                        {
                          name: 'Circular Timer',
                          desc: 'A simple circle countdown.',
                          href: '/timers/circular-timer',
                          iconBg: 'bg-[#E7EDE7] text-[#1E7A4C]',
                          icon: <Clock className="w-5 h-5" />,
                        },
                        {
                          name: 'Rings Timer',
                          desc: 'Multiple concentric rings.',
                          href: '/timers/rings-timer',
                          iconBg: 'bg-[#E7EDE7] text-[#1E7A4C]',
                          icon: <Clock className="w-5 h-5" />,
                        },
                        {
                          name: 'Progress Timer',
                          desc: 'A visual progress bar.',
                          href: '/timers/progress-timer',
                          iconBg: 'bg-[#FEF3C7] text-[#D97706]',
                          icon: <Monitor className="w-5 h-5" />,
                        },
                        {
                          name: 'Pixel Timer',
                          desc: 'A retro pixel countdown.',
                          href: '/timers/pixel-timer',
                          iconBg: 'bg-[#E7EDE7] text-[#1E7A4C]',
                          icon: <Monitor className="w-5 h-5" />,
                        },
                        {
                          name: 'Blocks Timer',
                          desc: 'A stacked block timer.',
                          href: '/timers/blocks-timer',
                          iconBg: 'bg-[#FDECE8] text-[#D94E34]',
                          icon: <Palette className="w-5 h-5" />,
                        },
                        {
                          name: 'Candle Timer',
                          desc: 'A peaceful visual timer.',
                          href: '/timers/candle-timer',
                          iconBg: 'bg-[#FCF3E4] text-[#D97706]',
                          icon: <Flame className="w-5 h-5" />,
                        },
                        {
                          name: 'Aesthetic Timer',
                          desc: 'Beautiful timer themes.',
                          href: '/timers/aesthetic-timer',
                          iconBg: 'bg-[#F3E8FF] text-[#7E22CE]',
                          icon: <Palette className="w-5 h-5" />,
                        },
                      ].map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-[#222924] border border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#365C4B] transition-all group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg}`}>
                              {item.icon}
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-xs sm:text-sm text-[#252B27] dark:text-white group-hover:text-[#365C4B] transition-colors">
                                {item.name}
                              </div>
                              <div className="text-[11px] text-[#252B27]/70 dark:text-slate-400 truncate">
                                {item.desc}
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[#252B27]/40 group-hover:text-[#365C4B] group-hover:translate-x-0.5 transition-all shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}

              {/* If tool is Aesthetic Timer, render the exact 2-column editorial + Tip box + Related Tools sidebar layout from the reference mockup */}
              {tool.slug === 'aesthetic-timer' ? (
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                  {/* Center Editorial Sub-Column (xl:col-span-8) */}
                  <div className="xl:col-span-8 space-y-8">
                    <div id={tocIds[0]} className="scroll-mt-28">
                      <span className="text-[11px] font-bold tracking-widest text-[#365C4B] dark:text-[#5E917A] uppercase block mb-1.5">
                        A COMPLETE GUIDE
                      </span>
                      <h2 className="font-serif text-2xl sm:text-3xl lg:text-[34px] leading-tight font-bold text-[#252B27] dark:text-white mb-3">
                        What Is an Aesthetic Timer?
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        An aesthetic timer is a visual countdown timer with carefully designed themes, colors and styles. It combines functionality with a beautiful and calming design, making it a pleasant desk accessory for studying, working and everyday routines.
                      </p>
                    </div>

                    <div id={tocIds[1]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252B27] dark:text-white mb-3">
                        Beautiful Timer Themes and Styles
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        This timer offers a collection of carefully crafted themes such as minimal ivory, warm sunset, forest green, soft pastel, dark academia, clean monochrome, natural paper texture and coastal blue. Each theme gives a unique and peaceful visual experience.
                      </p>
                    </div>

                    <div id={tocIds[2]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252B27] dark:text-white mb-4">
                        How to Use an Aesthetic Countdown
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
                        <ol className="sm:col-span-7 space-y-3">
                          {editorial.guide.howToUseSteps.map((step, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-3 text-xs sm:text-sm text-[#252B27]/85 dark:text-slate-300"
                            >
                              <span className="w-6 h-6 rounded-full bg-[#1F4E3B] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>

                        {/* Warm Tip Card on the right matching screenshot */}
                        <div className="sm:col-span-5 rounded-2xl bg-[#FAF3E8] dark:bg-[#24201A] border border-[#EEDEC5] dark:border-[#3A3227] p-4">
                          <div className="flex items-center gap-2 mb-1.5 text-[#D97706]">
                            <Lightbulb className="w-4 h-4 fill-current shrink-0" />
                            <span className="font-serif italic font-bold text-sm text-[#252B27] dark:text-white">
                              Tip
                            </span>
                          </div>
                          <p className="text-xs text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                            Save your favorite theme and settings so you can quickly start your timer with the same aesthetic style next time.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div id={tocIds[3]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252B27] dark:text-white mb-3">
                        Aesthetic Timer for Studying
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        A calm and beautiful timer can help you stay focused during study sessions. The pleasant visuals reduce mental fatigue and create a peaceful environment for learning.
                      </p>
                    </div>

                    <div id={tocIds[4]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252B27] dark:text-white mb-3">
                        Aesthetic Timer for Work and Productivity
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        Use the aesthetic timer for deep work, time blocking, meetings and regular breaks. A visually appealing timer can make your workspace feel more organized and motivating.
                      </p>
                    </div>

                    <div id={tocIds[5]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252B27] dark:text-white mb-3">
                        Choosing a Calm Timer Design
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        Select a theme that matches your environment and personal preference. Neutral and soft colors can help create a calm atmosphere, while natural textures and minimal designs keep the focus on the task without distraction.
                      </p>
                    </div>
                  </div>

                  {/* Right Sub-Column (xl:col-span-4): Related Tools Vertical Card List matching mockup */}
                  <div className="xl:col-span-4">
                    <div className="rounded-2xl border border-[#E4E1D9] dark:border-[#2D352F] bg-white/80 dark:bg-[#1A201C] p-4 sm:p-5 shadow-2xs space-y-3">
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-[#252B27] dark:text-white mb-2">
                        Related Tools
                      </h3>
                      {[
                        {
                          name: 'Pomodoro Timer',
                          desc: 'Stay focused with intervals.',
                          href: '/pomodoro-timer',
                          iconBg: 'bg-[#FDECE8] text-[#D94E34]',
                          icon: <Flame className="w-5 h-5" />,
                        },
                        {
                          name: 'Circular Timer',
                          desc: 'A simple circle countdown.',
                          href: '/timers/circular-timer',
                          iconBg: 'bg-[#E7EDE7] text-[#1E7A4C]',
                          icon: <Clock className="w-5 h-5" />,
                        },
                        {
                          name: 'Rings Timer',
                          desc: 'Multiple concentric rings.',
                          href: '/timers/rings-timer',
                          iconBg: 'bg-[#E7EDE7] text-[#1E7A4C]',
                          icon: <Clock className="w-5 h-5" />,
                        },
                        {
                          name: 'Progress Timer',
                          desc: 'A visual progress bar timer.',
                          href: '/timers/progress-timer',
                          iconBg: 'bg-[#E7EDE7] text-[#1E7A4C]',
                          icon: <Monitor className="w-5 h-5" />,
                        },
                        {
                          name: 'Pixel Timer',
                          desc: 'A retro pixel countdown.',
                          href: '/timers/pixel-timer',
                          iconBg: 'bg-[#E7EDE7] text-[#1E7A4C]',
                          icon: <Monitor className="w-5 h-5" />,
                        },
                        {
                          name: 'Candle Timer',
                          desc: 'A peaceful visual timer.',
                          href: '/timers/candle-timer',
                          iconBg: 'bg-[#FCF3E4] text-[#D97706]',
                          icon: <Flame className="w-5 h-5" />,
                        },
                        {
                          name: 'Sand Timer',
                          desc: 'A realistic sand animation.',
                          href: '/timers/sand-timer',
                          iconBg: 'bg-[#FCF3E4] text-[#C87A28]',
                          icon: <Hourglass className="w-5 h-5" />,
                        },
                      ].map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-[#222924] border border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#365C4B] transition-all group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg}`}>
                              {item.icon}
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-xs sm:text-sm text-[#252B27] dark:text-white group-hover:text-[#365C4B] transition-colors">
                                {item.name}
                              </div>
                              <div className="text-[11px] text-[#252B27]/70 dark:text-slate-400 truncate">
                                {item.desc}
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[#252B27]/40 group-hover:text-[#365C4B] group-hover:translate-x-0.5 transition-all shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}

              {/* If tool is Candle Timer, render the exact 2-column editorial + Tip box + Related Tools sidebar layout from the reference mockup */}
              {tool.slug === 'candle-timer' ? (
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                  {/* Center Editorial Sub-Column (xl:col-span-8) */}
                  <div className="xl:col-span-8 space-y-8">
                    <div id={tocIds[0]} className="scroll-mt-28">
                      <span className="text-[11px] font-bold tracking-widest text-[#365C4B] dark:text-[#5E917A] uppercase block mb-1.5">
                        A COMPLETE GUIDE
                      </span>
                      <h2 className="font-serif text-2xl sm:text-3xl lg:text-[34px] leading-tight font-bold text-[#252B27] dark:text-white mb-3">
                        What Is a Candle Timer?
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        A candle timer is a visual countdown timer that uses a digital candle to show the remaining time. As the timer runs, the candle wax gradually decreases, giving you a calm and intuitive view of how much time is left.
                      </p>
                    </div>

                    <div id={tocIds[1]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252B27] dark:text-white mb-3">
                        How the Candle Countdown Works
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        The total duration is represented by the height of the candle wax. As time passes, the wax slowly melts and the candle becomes shorter. The flame gently flickers, creating a relaxing visual effect while the countdown continues. When the timer reaches zero, the candle is completely burnt out.
                      </p>
                    </div>

                    <div id={tocIds[2]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252B27] dark:text-white mb-4">
                        How to Use the Digital Candle Timer
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
                        <ol className="sm:col-span-7 space-y-3">
                          {editorial.guide.howToUseSteps.map((step, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-3 text-xs sm:text-sm text-[#252B27]/85 dark:text-slate-300"
                            >
                              <span className="w-6 h-6 rounded-full bg-[#1F4E3B] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>

                        {/* Warm Tip Card on the right matching screenshot */}
                        <div className="sm:col-span-5 rounded-2xl bg-[#FAF3E8] dark:bg-[#24201A] border border-[#EEDEC5] dark:border-[#3A3227] p-4">
                          <div className="flex items-center gap-2 mb-1.5 text-[#D97706]">
                            <Lightbulb className="w-4 h-4 fill-current shrink-0" />
                            <span className="font-serif italic font-bold text-sm text-[#252B27] dark:text-white">
                              Tip
                            </span>
                          </div>
                          <p className="text-xs text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                            Use a calm environment and turn on sound alerts to make your session more effective.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div id={tocIds[3]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252B27] dark:text-white mb-3">
                        Candle Timer for Reading and Quiet Activities
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        A candle timer is perfect for reading, journaling, meditation, deep work and other quiet activities. The soft visual countdown helps you stay focused without constantly checking numbers, creating a calm and relaxing atmosphere.
                      </p>
                    </div>

                    <div id={tocIds[4]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252B27] dark:text-white mb-3">
                        Digital Candle Timer vs Physical Candles
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        A digital candle timer gives you the same visual experience as a real candle, but it is safe, reusable and customizable. It does not produce real fire, smoke or heat, and you can use it for any duration without worrying about safety or cleanup.
                      </p>
                    </div>
                  </div>

                  {/* Right Sub-Column (xl:col-span-4): Related Tools Vertical Card List matching mockup */}
                  <div className="xl:col-span-4">
                    <div className="rounded-2xl border border-[#E4E1D9] dark:border-[#2D352F] bg-white/80 dark:bg-[#1A201C] p-4 sm:p-5 shadow-2xs space-y-3">
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-[#252B27] dark:text-white mb-2">
                        Related Tools
                      </h3>
                      {[
                        {
                          name: 'Sand Timer',
                          desc: 'A realistic sand animation.',
                          href: '/timers/sand-timer',
                          iconBg: 'bg-[#FCF3E4] text-[#C87A28]',
                          icon: <Hourglass className="w-5 h-5" />,
                        },
                        {
                          name: 'Progress Timer',
                          desc: 'A visual progress bar timer.',
                          href: '/timers/progress-timer',
                          iconBg: 'bg-[#E7EDE7] text-[#1E7A4C]',
                          icon: <Monitor className="w-5 h-5" />,
                        },
                        {
                          name: 'Circular Timer',
                          desc: 'A simple circle countdown.',
                          href: '/timers/circular-timer',
                          iconBg: 'bg-[#E7EDE7] text-[#1E7A4C]',
                          icon: <Clock className="w-5 h-5" />,
                        },
                        {
                          name: 'Rings Timer',
                          desc: 'Multiple concentric rings.',
                          href: '/timers/rings-timer',
                          iconBg: 'bg-[#E7EDE7] text-[#1E7A4C]',
                          icon: <Clock className="w-5 h-5" />,
                        },
                        {
                          name: 'Pixel Timer',
                          desc: 'A retro pixel countdown.',
                          href: '/timers/pixel-timer',
                          iconBg: 'bg-[#E7EDE7] text-[#1E7A4C]',
                          icon: <Monitor className="w-5 h-5" />,
                        },
                        {
                          name: 'Pomodoro Timer',
                          desc: 'Stay focused with intervals.',
                          href: '/pomodoro-timer',
                          iconBg: 'bg-[#FDECE8] text-[#D94E34]',
                          icon: <Flame className="w-5 h-5" />,
                        },
                      ].map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-[#222924] border border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#365C4B] transition-all group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg}`}>
                              {item.icon}
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-xs sm:text-sm text-[#252B27] dark:text-white group-hover:text-[#365C4B] transition-colors">
                                {item.name}
                              </div>
                              <div className="text-[11px] text-[#252B27]/70 dark:text-slate-400 truncate">
                                {item.desc}
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[#252B27]/40 group-hover:text-[#365C4B] group-hover:translate-x-0.5 transition-all shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}

              {/* If tool is Blocks Timer, render the exact 2-column editorial + Tip box + Related Tools sidebar layout from the reference mockup */}
              {tool.slug === 'blocks-timer' ? (
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                  {/* Center Editorial Sub-Column (xl:col-span-8) */}
                  <div className="xl:col-span-8 space-y-8">
                    <div id={tocIds[0]} className="scroll-mt-28">
                      <span className="text-[11px] font-bold tracking-widest text-[#365C4B] dark:text-[#5E917A] uppercase block mb-1.5">
                        A COMPLETE GUIDE
                      </span>
                      <h2 className="font-serif text-2xl sm:text-3xl lg:text-[34px] leading-tight font-bold text-[#252B27] dark:text-white mb-3">
                        What Is a Blocks Timer?
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        A blocks timer is a visual countdown timer that uses a stacked set of blocks to show the remaining time. As time passes, blocks are removed from the stack, giving you a clear and intuitive sense of how much time is left.
                      </p>
                    </div>

                    <div id={tocIds[1]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252B27] dark:text-white mb-3">
                        How the Stacked Block Countdown Works
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        The total duration is divided into equal blocks. Each block represents a portion of the time. At regular intervals, one block is removed from the stack. As the stack gets shorter, you can easily see the time decreasing.
                      </p>
                    </div>

                    <div id={tocIds[2]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252B27] dark:text-white mb-4">
                        How to Use the Block Timer
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
                        <ol className="sm:col-span-7 space-y-3">
                          {editorial.guide.howToUseSteps.map((step, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-3 text-xs sm:text-sm text-[#252B27]/85 dark:text-slate-300"
                            >
                              <span className="w-6 h-6 rounded-full bg-[#1F4E3B] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>

                        {/* Warm Tip Card on the right matching screenshot */}
                        <div className="sm:col-span-5 rounded-2xl bg-[#FAF3E8] dark:bg-[#24201A] border border-[#EEDEC5] dark:border-[#3A3227] p-4">
                          <div className="flex items-center gap-2 mb-1.5 text-[#D97706]">
                            <Lightbulb className="w-4 h-4 fill-current shrink-0" />
                            <span className="font-serif italic font-bold text-sm text-[#252B27] dark:text-white">
                              Tip
                            </span>
                          </div>
                          <p className="text-xs text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                            Use more blocks for a smoother countdown and fewer blocks for a simple and clear visual.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div id={tocIds[3]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252B27] dark:text-white mb-3">
                        Blocks Timer for Games and Classroom Activities
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        A blocks timer is great for classroom activities, group games, turn-taking and children&apos;s routines. The visual blocks make it easy for everyone to understand the passage of time, especially for younger users.
                      </p>
                    </div>

                    <div id={tocIds[4]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252B27] dark:text-white mb-3">
                        Visual Blocks vs Digital Countdown
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        A digital countdown shows only numbers, while a blocks timer provides a visual representation of time using a stack of blocks. The visual approach can be more engaging, especially for children, groups and interactive activities.
                      </p>
                    </div>
                  </div>

                  {/* Right Sub-Column (xl:col-span-4): Related Tools Vertical Card List matching mockup */}
                  <div className="xl:col-span-4">
                    <div className="rounded-2xl border border-[#E4E1D9] dark:border-[#2D352F] bg-white/80 dark:bg-[#1A201C] p-4 sm:p-5 shadow-2xs space-y-3">
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-[#252B27] dark:text-white mb-2">
                        Related Tools
                      </h3>
                      {[
                        {
                          name: 'Sand Timer',
                          desc: 'A realistic sand animation.',
                          href: '/timers/sand-timer',
                          iconBg: 'bg-[#FCF3E4] text-[#C87A28]',
                          icon: <Hourglass className="w-5 h-5" />,
                        },
                        {
                          name: 'Circular Timer',
                          desc: 'A simple circle countdown.',
                          href: '/timers/circular-timer',
                          iconBg: 'bg-[#E7EDE7] text-[#1E7A4C]',
                          icon: <Clock className="w-5 h-5" />,
                        },
                        {
                          name: 'Rings Timer',
                          desc: 'Multiple concentric rings.',
                          href: '/timers/rings-timer',
                          iconBg: 'bg-[#E7EDE7] text-[#1E7A4C]',
                          icon: <Clock className="w-5 h-5" />,
                        },
                        {
                          name: 'Progress Timer',
                          desc: 'A visual progress bar.',
                          href: '/timers/progress-timer',
                          iconBg: 'bg-[#FEF3C7] text-[#D97706]',
                          icon: <Monitor className="w-5 h-5" />,
                        },
                        {
                          name: 'Visual Timer',
                          desc: 'A simple visual timer.',
                          href: '/visual-timer',
                          iconBg: 'bg-[#E7EDE7] text-[#1E7A4C]',
                          icon: <Clock className="w-5 h-5" />,
                        },
                        {
                          name: 'Pomodoro Timer',
                          desc: 'Stay focused with intervals.',
                          href: '/pomodoro-timer',
                          iconBg: 'bg-[#FDECE8] text-[#D94E34]',
                          icon: <Flame className="w-5 h-5" />,
                        },
                      ].map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-[#222924] border border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#365C4B] transition-all group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg}`}>
                              {item.icon}
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-xs sm:text-sm text-[#252B27] dark:text-white group-hover:text-[#365C4B] transition-colors">
                                {item.name}
                              </div>
                              <div className="text-[11px] text-[#252B27]/70 dark:text-slate-400 truncate">
                                {item.desc}
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[#252B27]/40 group-hover:text-[#365C4B] group-hover:translate-x-0.5 transition-all shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}

              {/* If tool is Pixel Timer, render the exact 2-column editorial + Tip box + Related Tools sidebar layout from the reference mockup */}
              {tool.slug === 'pixel-timer' ? (
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                  {/* Center Editorial Sub-Column (xl:col-span-8) */}
                  <div className="xl:col-span-8 space-y-8">
                    <div id={tocIds[0]} className="scroll-mt-28">
                      <span className="text-[11px] font-bold tracking-widest text-[#365C4B] dark:text-[#5E917A] uppercase block mb-1.5">
                        A COMPLETE GUIDE
                      </span>
                      <h2 className="font-serif text-2xl sm:text-3xl lg:text-[34px] leading-tight font-bold text-[#252B27] dark:text-white mb-3">
                        What Is a Pixel Timer?
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        A pixel timer is a visual countdown timer that uses a grid of square pixels to show the remaining time. As the timer runs, the filled pixels gradually disappear, giving you a clear and engaging visual representation of time.
                      </p>
                    </div>

                    <div id={tocIds[1]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252B27] dark:text-white mb-3">
                        How the Pixel Countdown Works
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        The timer divides the total duration into a grid of pixels. Each pixel represents a small portion of the total time. As time passes, the pixels turn off or change color in a smooth sequence, making it easy to see how much time is left at a glance.
                      </p>
                    </div>

                    <div id={tocIds[2]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252B27] dark:text-white mb-4">
                        How to Use a Retro Pixel Timer
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
                        <ol className="sm:col-span-7 space-y-3">
                          {editorial.guide.howToUseSteps.map((step, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-3 text-xs sm:text-sm text-[#252B27]/85 dark:text-slate-300"
                            >
                              <span className="w-6 h-6 rounded-full bg-[#1F4E3B] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>

                        {/* Warm Tip Card on the right matching screenshot */}
                        <div className="sm:col-span-5 rounded-2xl bg-[#FAF3E8] dark:bg-[#24201A] border border-[#EEDEC5] dark:border-[#3A3227] p-4">
                          <div className="flex items-center gap-2 mb-1.5 text-[#D97706]">
                            <Lightbulb className="w-4 h-4 fill-current shrink-0" />
                            <span className="font-serif italic font-bold text-sm text-[#252B27] dark:text-white">
                              Tip
                            </span>
                          </div>
                          <p className="text-xs text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                            Use a higher pixel density for a smoother animation and a lower density for a classic retro look.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div id={tocIds[3]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252B27] dark:text-white mb-3">
                        Pixel Timer for Gaming and Study Breaks
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        A pixel timer is perfect for gaming breaks, study sessions, classroom activities and short challenges. The retro visual style makes it fun and engaging, especially for children, students and anyone who enjoys a playful way to track time.
                      </p>
                    </div>

                    <div id={tocIds[4]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252B27] dark:text-white mb-3">
                        Customizing Pixel Countdown Styles
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        You can choose different pixel styles, adjust the pixel density and select your preferred colors. From classic monochrome to colorful 8-bit designs, the pixel timer can match your personal style or learning environment.
                      </p>
                    </div>
                  </div>

                  {/* Right Sub-Column (xl:col-span-4): Related Tools Vertical Card List matching mockup */}
                  <div className="xl:col-span-4">
                    <div className="rounded-2xl border border-[#E4E1D9] dark:border-[#2D352F] bg-white/80 dark:bg-[#1A201C] p-4 sm:p-5 shadow-2xs space-y-3">
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-[#252B27] dark:text-white mb-2">
                        Related Tools
                      </h3>
                      {[
                        {
                          name: 'Progress Timer',
                          desc: 'A visual progress bar timer.',
                          href: '/timers/progress-timer',
                          iconBg: 'bg-[#FEF3C7] text-[#D97706]',
                          icon: <Monitor className="w-5 h-5" />,
                        },
                        {
                          name: 'Circular Timer',
                          desc: 'A simple circle countdown.',
                          href: '/timers/circular-timer',
                          iconBg: 'bg-[#E7EDE7] text-[#1E7A4C]',
                          icon: <Clock className="w-5 h-5" />,
                        },
                        {
                          name: 'Radial Timer',
                          desc: 'Countdown with segments.',
                          href: '/timers/radial-timer',
                          iconBg: 'bg-[#E7EDE7] text-[#1E7A4C]',
                          icon: <Clock className="w-5 h-5" />,
                        },
                        {
                          name: 'Rings Timer',
                          desc: 'Multiple concentric rings.',
                          href: '/timers/rings-timer',
                          iconBg: 'bg-[#E7EDE7] text-[#1E7A4C]',
                          icon: <Clock className="w-5 h-5" />,
                        },
                        {
                          name: 'Visual Timer',
                          desc: 'A colorful visual timer.',
                          href: '/visual-timer',
                          iconBg: 'bg-[#FDECE8] text-[#D94E34]',
                          icon: <Flame className="w-5 h-5" />,
                        },
                        {
                          name: 'Pomodoro Timer',
                          desc: 'Stay focused with intervals.',
                          href: '/pomodoro-timer',
                          iconBg: 'bg-[#FDECE8] text-[#D94E34]',
                          icon: <Flame className="w-5 h-5" />,
                        },
                      ].map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-[#222924] border border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#365C4B] transition-all group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg}`}>
                              {item.icon}
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-xs sm:text-sm text-[#252B27] dark:text-white group-hover:text-[#365C4B] transition-colors">
                                {item.name}
                              </div>
                              <div className="text-[11px] text-[#252B27]/70 dark:text-slate-400 truncate">
                                {item.desc}
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[#252B27]/40 group-hover:text-[#365C4B] group-hover:translate-x-0.5 transition-all shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}

              {/* If tool is Progress Timer, render the exact 2-column editorial + Tip box + Related Tools sidebar layout from the reference mockup */}
              {tool.slug === 'progress-timer' ? (
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                  {/* Center Editorial Sub-Column (xl:col-span-8) */}
                  <div className="xl:col-span-8 space-y-8">
                    <div id={tocIds[0]} className="scroll-mt-28">
                      <span className="text-[11px] font-bold tracking-widest text-[#365C4B] dark:text-[#5E917A] uppercase block mb-1.5">
                        A COMPLETE GUIDE
                      </span>
                      <h2 className="font-serif text-2xl sm:text-3xl lg:text-[34px] leading-tight font-bold text-[#252B27] dark:text-white mb-3">
                        What Is a Progress Timer?
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        A progress timer is a visual countdown timer that uses a progress bar to show the remaining time. As the timer runs, the bar gradually decreases, giving you a clear and intuitive way to see how much time is left at a glance.
                      </p>
                    </div>

                    <div id={tocIds[1]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252B27] dark:text-white mb-3">
                        How a Visual Progress Bar Timer Works
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        The progress bar represents the total duration. It starts full and gradually reduces as time passes. The bar can move horizontally, vertically or in segments, depending on the style you choose. The progress is synchronized with the countdown, so it accurately reflects the remaining time.
                      </p>
                    </div>

                    <div id={tocIds[2]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252B27] dark:text-white mb-4">
                        How to Use the Progress Timer
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
                        <ol className="sm:col-span-7 space-y-3">
                          {editorial.guide.howToUseSteps.map((step, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-3 text-xs sm:text-sm text-[#252B27]/85 dark:text-slate-300"
                            >
                              <span className="w-6 h-6 rounded-full bg-[#1F4E3B] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>

                        {/* Warm Tip Card on the right matching screenshot */}
                        <div className="sm:col-span-5 rounded-2xl bg-[#FAF3E8] dark:bg-[#24201A] border border-[#EEDEC5] dark:border-[#3A3227] p-4">
                          <div className="flex items-center gap-2 mb-1.5 text-[#D97706]">
                            <Lightbulb className="w-4 h-4 fill-current shrink-0" />
                            <span className="font-serif italic font-bold text-sm text-[#252B27] dark:text-white">
                              Tip
                            </span>
                          </div>
                          <p className="text-xs text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                            Set a warning alert to get a sound notification when the timer reaches the last few seconds. This is helpful for meetings, classes and focused work sessions.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div id={tocIds[3]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252B27] dark:text-white mb-3">
                        Progress Timer for Work and Study
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        A progress timer is perfect for work sessions, study blocks, meetings and regular breaks. The visual progress bar helps you stay aware of time, reduce distractions and maintain a steady pace.
                      </p>
                    </div>

                    <div id={tocIds[4]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252B27] dark:text-white mb-3">
                        Using Progress Indicators for Timed Activities
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        You can choose different styles such as horizontal, vertical, segmented or thin-line displays. Each style works well for different activities, from classroom lessons to presentations and personal productivity.
                      </p>
                    </div>

                    <div id={tocIds[5]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252B27] dark:text-white mb-3">
                        Progress Timer vs Countdown Timer
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        A countdown timer mainly shows the remaining time in numbers, while a progress timer adds a visual bar to represent time passing. The progress bar makes it easier to see how much time is left, especially for group settings, presentations and children.
                      </p>
                    </div>
                  </div>

                  {/* Right Sub-Column (xl:col-span-4): Related Tools Vertical Card List matching mockup */}
                  <div className="xl:col-span-4">
                    <div className="rounded-2xl border border-[#E4E1D9] dark:border-[#2D352F] bg-white/80 dark:bg-[#1A201C] p-4 sm:p-5 shadow-2xs space-y-3">
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-[#252B27] dark:text-white mb-2">
                        Related Tools
                      </h3>
                      {[
                        {
                          name: 'Circular Timer',
                          desc: 'A simple circle countdown.',
                          href: '/timers/circular-timer',
                          iconBg: 'bg-[#E7EDE7] text-[#1E7A4C]',
                          icon: <Clock className="w-5 h-5" />,
                        },
                        {
                          name: 'Radial Timer',
                          desc: 'Countdown with segments.',
                          href: '/timers/radial-timer',
                          iconBg: 'bg-[#E7EDE7] text-[#1E7A4C]',
                          icon: <Clock className="w-5 h-5" />,
                        },
                        {
                          name: 'Rings Timer',
                          desc: 'Multiple concentric rings.',
                          href: '/timers/rings-timer',
                          iconBg: 'bg-[#E7EDE7] text-[#1E7A4C]',
                          icon: <Clock className="w-5 h-5" />,
                        },
                        {
                          name: 'Visual Timer',
                          desc: 'A circular visual timer.',
                          href: '/visual-timer',
                          iconBg: 'bg-[#FDECE8] text-[#D94E34]',
                          icon: <Flame className="w-5 h-5" />,
                        },
                        {
                          name: 'Countdown Timer',
                          desc: 'Set a timer for any duration.',
                          href: '/countdown-timer',
                          iconBg: 'bg-[#FCF3E4] text-[#C87A28]',
                          icon: <Hourglass className="w-5 h-5" />,
                        },
                        {
                          name: 'Pomodoro Timer',
                          desc: 'Stay focused with intervals.',
                          href: '/pomodoro-timer',
                          iconBg: 'bg-[#FDECE8] text-[#D94E34]',
                          icon: <Flame className="w-5 h-5" />,
                        },
                        {
                          name: 'Classroom Timer',
                          desc: 'Simple timer for classroom use.',
                          href: '/classroom-timer',
                          iconBg: 'bg-[#E7EDE7] text-[#1E7A4C]',
                          icon: <GraduationCap className="w-5 h-5" />,
                        },
                      ].map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-[#222924] border border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#365C4B] transition-all group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg}`}>
                              {item.icon}
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-xs sm:text-sm text-[#252B27] dark:text-white group-hover:text-[#365C4B] transition-colors">
                                {item.name}
                              </div>
                              <div className="text-[11px] text-[#252B27]/70 dark:text-slate-400 truncate">
                                {item.desc}
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[#252B27]/40 group-hover:text-[#365C4B] group-hover:translate-x-0.5 transition-all shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}

              {/* If tool is Rings Timer, render the exact 2-column editorial + Tip box + Related Tools sidebar layout from the reference mockup */}
              {tool.slug === 'rings-timer' ? (
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                  {/* Center Editorial Sub-Column (xl:col-span-8) */}
                  <div className="xl:col-span-8 space-y-8">
                    <div id={tocIds[0]} className="scroll-mt-28">
                      <span className="text-[11px] font-bold tracking-widest text-[#365C4B] dark:text-[#5E917A] uppercase block mb-1.5">
                        A COMPLETE GUIDE
                      </span>
                      <h2 className="font-serif text-2xl sm:text-3xl lg:text-[34px] leading-tight font-bold text-[#252B27] dark:text-white mb-3">
                        What Is a Rings Timer?
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        A rings timer is a visual countdown timer that uses multiple concentric rings to show the remaining time. Each ring represents a different portion or stage of the duration, giving you a clear and engaging view of your progress.
                      </p>
                    </div>

                    <div id={tocIds[1]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252B27] dark:text-white mb-3">
                        How Concentric Ring Timers Work
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        The total duration is divided across multiple rings. As time passes, each ring gradually shrinks or changes color based on its assigned time segment. This makes it easy to see both the overall progress and smaller milestones within the same countdown.
                      </p>
                    </div>

                    <div id={tocIds[2]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252B27] dark:text-white mb-4">
                        How to Use This Ring Countdown
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
                        <ol className="sm:col-span-7 space-y-3">
                          {editorial.guide.howToUseSteps.map((step, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-3 text-xs sm:text-sm text-[#252B27]/85 dark:text-slate-300"
                            >
                              <span className="w-6 h-6 rounded-full bg-[#1F4E3B] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>

                        {/* Warm Tip Card on the right matching screenshot */}
                        <div className="sm:col-span-5 rounded-2xl bg-[#FAF3E8] dark:bg-[#24201A] border border-[#EEDEC5] dark:border-[#3A3227] p-4">
                          <div className="flex items-center gap-2 mb-1.5 text-[#D97706]">
                            <Lightbulb className="w-4 h-4 fill-current shrink-0" />
                            <span className="font-serif italic font-bold text-sm text-[#252B27] dark:text-white">
                              Tip
                            </span>
                          </div>
                          <p className="text-xs text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                            Use different colors for each ring to represent different stages, such as work, short breaks and final minutes.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div id={tocIds[3]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252B27] dark:text-white mb-3">
                        Multiple Visual Time Indicators
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        Rings timers combine an overall countdown with multiple visual indicators. You can use each ring to represent a phase, a quarter of the time, or custom segments, making it ideal for structured activities.
                      </p>
                    </div>

                    <div id={tocIds[4]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252B27] dark:text-white mb-3">
                        Rings Timer for Productivity and Learning
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        A rings timer is great for Pomodoro sessions, study blocks, focus periods and regular breaks. The multiple rings help you stay aware of time without constantly checking numbers, making it easier to maintain focus and build better habits.
                      </p>
                    </div>

                    <div id={tocIds[5]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252B27] dark:text-white mb-3">
                        Rings Timer vs Circular Timer
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        A circular timer uses a single ring to show the remaining time, while a rings timer uses multiple concentric rings. Rings timers provide more visual information, making them especially useful for multi-stage tasks and structured time management.
                      </p>
                    </div>
                  </div>

                  {/* Right Sub-Column (xl:col-span-4): Related Tools Vertical Card List matching mockup */}
                  <div className="xl:col-span-4">
                    <div className="rounded-2xl border border-[#E4E1D9] dark:border-[#2D352F] bg-white/80 dark:bg-[#1A201C] p-4 sm:p-5 shadow-2xs space-y-3">
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-[#252B27] dark:text-white mb-2">
                        Related Tools
                      </h3>
                      {[
                        {
                          name: 'Circular Timer',
                          desc: 'A simple circle countdown.',
                          href: '/timers/circular-timer',
                          iconBg: 'bg-[#E7EDE7] text-[#1E7A4C]',
                          icon: <Clock className="w-5 h-5" />,
                        },
                        {
                          name: 'Radial Timer',
                          desc: 'Countdown with segments.',
                          href: '/timers/radial-timer',
                          iconBg: 'bg-[#E7EDE7] text-[#1E7A4C]',
                          icon: <Clock className="w-5 h-5" />,
                        },
                        {
                          name: 'Visual Timer',
                          desc: 'A visual countdown timer.',
                          href: '/visual-timer',
                          iconBg: 'bg-[#FDECE8] text-[#D94E34]',
                          icon: <Flame className="w-5 h-5" />,
                        },
                        {
                          name: 'Countdown Timer',
                          desc: 'Set a timer for any duration.',
                          href: '/countdown-timer',
                          iconBg: 'bg-[#FCF3E4] text-[#C87A28]',
                          icon: <Hourglass className="w-5 h-5" />,
                        },
                        {
                          name: 'Pomodoro Timer',
                          desc: 'Stay focused with intervals.',
                          href: '/pomodoro-timer',
                          iconBg: 'bg-[#FDECE8] text-[#D94E34]',
                          icon: <Flame className="w-5 h-5" />,
                        },
                      ].map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-[#222924] border border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#365C4B] transition-all group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg}`}>
                              {item.icon}
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-xs sm:text-sm text-[#252B27] dark:text-white group-hover:text-[#365C4B] transition-colors">
                                {item.name}
                              </div>
                              <div className="text-[11px] text-[#252B27]/70 dark:text-slate-400 truncate">
                                {item.desc}
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[#252B27]/40 group-hover:text-[#365C4B] group-hover:translate-x-0.5 transition-all shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}

              {/* If tool is Radial Timer, render the exact editorial + Tip box layout from the reference mockup */}
              {tool.slug === 'radial-timer' ? (
                <div className="space-y-8 max-w-4xl">
                  <div id={tocIds[0]} className="scroll-mt-28">
                    <span className="text-[11px] font-bold tracking-widest text-[#365C4B] dark:text-[#5E917A] uppercase block mb-1.5">
                      A COMPLETE GUIDE
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl lg:text-[34px] leading-tight font-bold text-[#252B27] dark:text-white mb-3">
                      What Is a Radial Timer?
                    </h2>
                    <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                      A radial timer is a visual countdown timer that uses multiple spokes, rays or segments arranged in a circle to show the remaining time. As the timer runs, the segments gradually disappear or change, giving you a clear and intuitive view of how much time is left.
                    </p>
                  </div>

                  <div id={tocIds[1]} className="scroll-mt-28">
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252B27] dark:text-white mb-3">
                      How Radial Countdown Displays Work
                    </h2>
                    <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                      The radial display is divided into equal segments. Each segment represents a small portion of the total duration. As time passes, the segments are turned off or change color in a smooth animation, making it easy to see the countdown progress at a glance.
                    </p>
                  </div>

                  <div id={tocIds[2]} className="scroll-mt-28">
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252B27] dark:text-white mb-4">
                      How to Use the Radial Timer
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
                      <ol className="sm:col-span-7 space-y-3">
                        {editorial.guide.howToUseSteps.map((step, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-3 text-xs sm:text-sm text-[#252B27]/85 dark:text-slate-300"
                          >
                            <span className="w-6 h-6 rounded-full bg-[#1F4E3B] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>

                      {/* Warm Tip Card on the right matching screenshot */}
                      <div className="sm:col-span-5 rounded-2xl bg-[#FAF3E8] dark:bg-[#24201A] border border-[#EEDEC5] dark:border-[#3A3227] p-4 sm:p-5">
                        <div className="flex items-center gap-2 mb-1.5 text-[#D97706]">
                          <Lightbulb className="w-4 h-4 fill-current shrink-0" />
                          <span className="font-serif italic font-bold text-sm sm:text-base text-[#252B27] dark:text-white">
                            Tip
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                          Try different segment counts and colors to find the style that works best for your activity or environment.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div id={tocIds[3]} className="scroll-mt-28">
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252B27] dark:text-white mb-3">
                      Radial Timer for Study and Productivity
                    </h2>
                    <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                      A radial timer is perfect for study sessions, deep work, Pomodoro cycles and focus time. The visual progress helps you stay aware of time without constantly checking the numbers, reducing distractions and improving concentration.
                    </p>
                  </div>

                  <div id={tocIds[4]} className="scroll-mt-28">
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252B27] dark:text-white mb-3">
                      Radial Timer for Group Activities
                    </h2>
                    <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                      Teachers, coaches and team leaders can use a radial timer for classroom activities, group discussions, workshops and presentations. The clear visual countdown helps everyone stay on the same page.
                    </p>
                  </div>

                  <div id={tocIds[5]} className="scroll-mt-28">
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252B27] dark:text-white mb-3">
                      Radial Timer vs Circular Timer
                    </h2>
                    <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                      A radial timer uses multiple spokes or segments, while a circular timer uses a continuous circle or pie shape. Radial timers are often more visually engaging and easier to understand for group settings, especially for children and visual learners.
                    </p>
                  </div>
                </div>
              ) : null}

              {/* If tool is Circular Timer, render the exact editorial + Tip box + Comparison Table layout from the reference mockup */}
              {tool.slug === 'circular-timer' ? (
                <div className="space-y-8 max-w-4xl">
                  <div id={tocIds[0]} className="scroll-mt-28">
                    <span className="text-[11px] font-bold tracking-widest text-[#365C4B] dark:text-[#5E917A] uppercase block mb-1.5">
                      A COMPLETE GUIDE
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl lg:text-[34px] leading-tight font-bold text-[#252B27] dark:text-white mb-3">
                      What Is a Circular Countdown Timer?
                    </h2>
                    <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                      A circular timer is a visual countdown timer that uses a circle to show the remaining time. As time passes, the colored portion of the circle gradually decreases, making it easy to see how much time is left at a glance.
                    </p>
                  </div>

                  <div id={tocIds[1]} className="scroll-mt-28">
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252B27] dark:text-white mb-3">
                      How a Circular Timer Visualizes Time
                    </h2>
                    <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                      The circle represents the total duration, and the colored sector shows the remaining time. The sector shrinks smoothly in a clockwise (or counterclockwise) direction as the countdown runs. This visual format helps you quickly understand how time is passing without focusing only on numbers.
                    </p>
                  </div>

                  <div id={tocIds[2]} className="scroll-mt-28">
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252B27] dark:text-white mb-4">
                      How to Use This Circle Timer
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
                      <ol className="sm:col-span-7 space-y-3">
                        {editorial.guide.howToUseSteps.map((step, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-3 text-xs sm:text-sm text-[#252B27]/85 dark:text-slate-300"
                          >
                            <span className="w-6 h-6 rounded-full bg-[#1F4E3B] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>

                      {/* Warm Tip Card on the right matching screenshot */}
                      <div className="sm:col-span-5 rounded-2xl bg-[#FAF3E8] dark:bg-[#24201A] border border-[#EEDEC5] dark:border-[#3A3227] p-4 sm:p-5">
                        <div className="flex items-center gap-2 mb-1.5 text-[#D97706]">
                          <Lightbulb className="w-4 h-4 fill-current shrink-0" />
                          <span className="font-serif italic font-bold text-sm sm:text-base text-[#252B27] dark:text-white">
                            Tip
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                          Use the circular timer in fullscreen mode for classrooms, presentations and focused work sessions.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div id={tocIds[3]} className="scroll-mt-28">
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252B27] dark:text-white mb-3">
                      Circular Timer for Classrooms and Presentations
                    </h2>
                    <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                      A circular countdown timer is ideal for classroom activities, group discussions and presentations. The clear visual display helps students and audiences understand how much time is left, reducing distractions and keeping everyone on track.
                    </p>
                  </div>

                  <div id={tocIds[4]} className="scroll-mt-28">
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252B27] dark:text-white mb-3">
                      Circular Timer vs Progress Bar Timer
                    </h2>
                    <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed mb-4">
                      Both circular and progress bar timers show remaining time visually. A circular timer is often easier to understand at a glance, especially for group settings and presentations, while a progress bar timer works well in compact layouts.
                    </p>

                    <div className="overflow-x-auto rounded-xl border border-[#DCE5DD] dark:border-[#2D352F] bg-white dark:bg-[#1A201C] shadow-2xs">
                      <table className="w-full text-left border-collapse text-xs sm:text-sm">
                        <thead>
                          <tr className="bg-[#1F4E3B] text-white">
                            <th scope="col" className="py-2.5 px-4 font-semibold">
                              Feature
                            </th>
                            <th scope="col" className="py-2.5 px-4 font-semibold">
                              Circular Timer
                            </th>
                            <th scope="col" className="py-2.5 px-4 font-semibold">
                              Progress Bar Timer
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E4E1D9] dark:divide-[#2D352F]">
                          {[
                            {
                              feature: 'Visual style',
                              circular: 'Circular countdown',
                              progress: 'Linear bar',
                            },
                            {
                              feature: 'Best for',
                              circular: 'Classrooms, presentations, group use',
                              progress: 'Compact spaces, simple displays',
                            },
                            {
                              feature: 'Time visibility',
                              circular: 'Very easy to see at a glance',
                              progress: 'Clear but less visually intuitive',
                            },
                            {
                              feature: 'Appearance',
                              circular: 'Engaging and modern',
                              progress: 'Minimal and simple',
                            },
                            {
                              feature: 'User preference',
                              circular: 'Great for visual learners',
                              progress: 'Useful for small layouts',
                            },
                          ].map((row, idx) => (
                            <tr
                              key={row.feature}
                              className={
                                idx % 2 === 0
                                  ? 'bg-transparent'
                                  : 'bg-[#F7F6F2]/55 dark:bg-[#1D2420]/50'
                              }
                            >
                              <td className="py-2.5 px-4 font-semibold text-[#252B27] dark:text-white whitespace-nowrap">
                                {row.feature}
                              </td>
                              <td className="py-2.5 px-4 text-[#252B27]/85 dark:text-slate-200">
                                {row.circular}
                              </td>
                              <td className="py-2.5 px-4 text-[#252B27]/75 dark:text-slate-400">
                                {row.progress}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* If tool is Hourglass Timer, render the exact 2-column editorial + Tips for Best Experience + Related Tools layout from the reference mockup */}
              {tool.slug === 'hourglass-timer' ? (
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                  {/* Center Editorial Sub-Column (xl:col-span-7) */}
                  <div className="xl:col-span-7 space-y-8">
                    <div id={tocIds[0]} className="scroll-mt-28">
                      <span className="text-[11px] font-bold tracking-widest text-[#365C4B] dark:text-[#5E917A] uppercase block mb-1.5">
                        A COMPLETE GUIDE
                      </span>
                      <h2 className="font-serif text-2xl sm:text-3xl lg:text-[34px] leading-tight font-bold text-[#252B27] dark:text-white mb-3">
                        What Is an Hourglass Timer?
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed mb-3">
                        An hourglass timer is a visual countdown timer that shows time passing through falling sand. This digital hourglass recreates the classic sand clock experience online, making it easy to use on any device.
                      </p>
                      <p className="text-sm sm:text-base text-[#252B27]/80 dark:text-slate-300 leading-relaxed">
                        Unlike a basic digital countdown or a close-up sand bulb, this traditional hourglass features a symmetrical transparent glass vessel framed with turned wooden bases and pillars, plus an interactive <strong className="font-semibold text-[#252B27] dark:text-white">Flip</strong> action that turns the entire hourglass over 180 degrees whenever you reset or restart.
                      </p>
                    </div>

                    <div id={tocIds[1]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252B27] dark:text-white mb-3">
                        How Does a Digital Hourglass Work?
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        The digital hourglass uses a smooth animation to simulate sand falling from the upper chamber to the lower chamber. As the countdown runs, the sand level in the top half decreases and the sand level in the bottom half increases. When the time reaches zero, the upper chamber is empty and an optional sound alert notifies you.
                      </p>
                    </div>

                    <div id={tocIds[2]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252B27] dark:text-white mb-3">
                        Online Hourglass vs Traditional Sand Clock
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed mb-4">
                        A traditional hourglass uses real sand and has a fixed duration, for example 1 minute, 5 minutes or 30 minutes. This online hourglass gives you full control over the duration, allows different time presets, provides optional sound alerts and works on any device.
                      </p>

                      <div className="overflow-x-auto rounded-xl border border-[#DCE5DD] dark:border-[#2D352F] bg-white dark:bg-[#1A201C] shadow-2xs">
                        <table className="w-full text-left border-collapse text-xs sm:text-sm">
                          <thead>
                            <tr className="bg-[#265641] text-white">
                              <th scope="col" className="py-2.5 px-3.5 font-semibold">
                                Feature
                              </th>
                              <th scope="col" className="py-2.5 px-3.5 font-semibold">
                                Online Hourglass Timer
                              </th>
                              <th scope="col" className="py-2.5 px-3.5 font-semibold">
                                Traditional Sand Clock
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#E4E1D9] dark:divide-[#2D352F]">
                            {[
                              {
                                feature: 'Duration',
                                online: 'Custom time (1 min to 60+ min)',
                                traditional: 'Fixed duration only',
                              },
                              {
                                feature: 'Visual experience',
                                online: 'Realistic animated sand',
                                traditional: 'Real sand',
                              },
                              {
                                feature: 'Flip to restart',
                                online: 'Click Flip or Reset',
                                traditional: 'Manually turn the hourglass',
                              },
                              {
                                feature: 'Sound alert',
                                online: 'Optional',
                                traditional: 'Not available',
                              },
                              {
                                feature: 'Works on any device',
                                online: 'Yes (desktop, tablet, mobile)',
                                traditional: 'No',
                              },
                              {
                                feature: 'Multiple presets',
                                online: 'Yes',
                                traditional: 'Limited',
                              },
                            ].map((row, idx) => (
                              <tr
                                key={row.feature}
                                className={
                                  idx % 2 === 0
                                    ? 'bg-transparent'
                                    : 'bg-[#F7F6F2]/55 dark:bg-[#1D2420]/50'
                                }
                              >
                                <td className="py-2.5 px-3.5 font-semibold text-[#252B27] dark:text-white whitespace-nowrap">
                                  {row.feature}
                                </td>
                                <td className="py-2.5 px-3.5 text-[#252B27]/85 dark:text-slate-200">
                                  {row.online}
                                </td>
                                <td className="py-2.5 px-3.5 text-[#252B27]/75 dark:text-slate-400">
                                  {row.traditional}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div id={tocIds[3]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252B27] dark:text-white mb-4">
                        How to Use an Hourglass Countdown
                      </h2>
                      <ol className="space-y-3">
                        <li className="flex items-start gap-3 text-xs sm:text-sm text-[#252B27]/85 dark:text-slate-300">
                          <span className="w-6 h-6 rounded-full bg-[#265641] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                            1
                          </span>
                          <span>Choose a preset time or enter your own duration.</span>
                        </li>
                        <li className="flex items-start gap-3 text-xs sm:text-sm text-[#252B27]/85 dark:text-slate-300">
                          <span className="w-6 h-6 rounded-full bg-[#265641] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                            2
                          </span>
                          <span>
                            Click <strong className="font-semibold text-[#265641] dark:text-[#5E917A]">Start</strong> to begin the countdown.
                          </span>
                        </li>
                        <li className="flex items-start gap-3 text-xs sm:text-sm text-[#252B27]/85 dark:text-slate-300">
                          <span className="w-6 h-6 rounded-full bg-[#265641] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                            3
                          </span>
                          <span>Watch the sand fall from the top to the bottom.</span>
                        </li>
                        <li className="flex items-start gap-3 text-xs sm:text-sm text-[#252B27]/85 dark:text-slate-300">
                          <span className="w-6 h-6 rounded-full bg-[#265641] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                            4
                          </span>
                          <span>
                            Use <strong className="font-semibold text-[#265641] dark:text-[#5E917A]">Pause</strong> to stop and <strong className="font-semibold text-[#265641] dark:text-[#5E917A]">Resume</strong> to continue.
                          </span>
                        </li>
                        <li className="flex items-start gap-3 text-xs sm:text-sm text-[#252B27]/85 dark:text-slate-300">
                          <span className="w-6 h-6 rounded-full bg-[#265641] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                            5
                          </span>
                          <span>
                            Click <strong className="font-semibold text-[#265641] dark:text-[#5E917A]">Reset</strong> or <strong className="font-semibold text-[#265641] dark:text-[#5E917A]">Flip</strong> to turn the hourglass over and start again.
                          </span>
                        </li>
                      </ol>
                    </div>

                    <div id={tocIds[4]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252B27] dark:text-white mb-3">
                        Hourglass Timer for Games, Learning and Daily Activities
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        An hourglass timer is perfect for board games, classroom activities, study sessions, cooking intervals, meditation and everyday tasks. The visual sand movement helps everyone understand how much time is left at a glance, making it especially useful for children and visual learners.
                      </p>
                    </div>
                  </div>

                  {/* Right Sub-Column (xl:col-span-5): Tips for Best Experience + Related Tools Card List */}
                  <div className="xl:col-span-5 space-y-6">
                    {/* Tips for Best Experience Card */}
                    <div className="rounded-2xl border border-[#DCE5DD] dark:border-[#2C3931] bg-[#EDF3EF] dark:bg-[#1A221E] p-5 shadow-2xs">
                      <div className="flex items-center gap-2 mb-3.5">
                        <Lightbulb className="w-5 h-5 text-[#D97706] fill-current shrink-0" />
                        <h3 className="font-serif italic text-lg sm:text-xl font-bold text-[#252B27] dark:text-white">
                          Tips for Best Experience
                        </h3>
                      </div>
                      <ul className="space-y-3">
                        {[
                          'Use fullscreen for a larger view.',
                          'Enable sound alerts for better focus.',
                          'Try different durations for different activities.',
                          'Use the Flip button to quickly restart.',
                          'Enable reduced motion if you prefer a simpler animation.',
                        ].map((tip, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#252B27]/85 dark:text-slate-300">
                            <span className="text-[#265641] dark:text-[#5E917A] font-bold mt-0.5 shrink-0">✓</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Related Tools Vertical Stack matching mockup */}
                    <div className="rounded-2xl border border-[#E4E1D9] dark:border-[#2D352F] bg-white/80 dark:bg-[#1A201C] p-4 sm:p-5 shadow-2xs space-y-3">
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-[#252B27] dark:text-white mb-2">
                        Related Tools
                      </h3>
                      {[
                        {
                          name: 'Sand Timer',
                          desc: 'Realistic sand countdown.',
                          href: '/timers/sand-timer',
                          iconBg: 'bg-[#FCF3E4] text-[#C87A28]',
                          icon: <Hourglass className="w-5 h-5" />,
                        },
                        {
                          name: 'Visual Timer',
                          desc: 'Circular visual countdown.',
                          href: '/visual-timer',
                          iconBg: 'bg-[#E7EDE7] text-[#265641]',
                          icon: <Clock className="w-5 h-5" />,
                        },
                        {
                          name: 'Countdown Timer',
                          desc: 'Set a timer for any duration.',
                          href: '/countdown-timer',
                          iconBg: 'bg-[#FDECE8] text-[#D94E34]',
                          icon: <Clock className="w-5 h-5" />,
                        },
                        {
                          name: 'Pomodoro Timer',
                          desc: 'Stay focused with intervals.',
                          href: '/pomodoro-timer',
                          iconBg: 'bg-[#FDECE8] text-[#D94E34]',
                          icon: <Flame className="w-5 h-5" />,
                        },
                        {
                          name: 'Classroom Timer',
                          desc: 'Simple timer for classroom use.',
                          href: '/classroom-timer',
                          iconBg: 'bg-[#E7EDE7] text-[#265641]',
                          icon: <GraduationCap className="w-5 h-5" />,
                        },
                      ].map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-[#222924] border border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#365C4B] transition-all group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg}`}>
                              {item.icon}
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-xs sm:text-sm text-[#252B27] dark:text-white group-hover:text-[#365C4B] transition-colors">
                                {item.name}
                              </div>
                              <div className="text-[11px] text-[#252B27]/70 dark:text-slate-400 truncate">
                                {item.desc}
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[#252B27]/40 group-hover:text-[#365C4B] group-hover:translate-x-0.5 transition-all shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}

              {/* If tool is Rainbow Timer, render the exact 2-column editorial + comparison + related tools layout from the reference mockup */}
              {tool.slug === 'rainbow-timer' ? (
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                  {/* Center Editorial Sub-Column (xl:col-span-7) */}
                  <div className="xl:col-span-7 space-y-8">
                    <div id={tocIds[0]} className="scroll-mt-28">
                      <span className="text-[11px] font-bold tracking-widest text-[#365C4B] dark:text-[#5E917A] uppercase block mb-1.5">
                        A COMPLETE GUIDE
                      </span>
                      <h2 className="font-serif text-2xl sm:text-3xl lg:text-[34px] leading-tight font-bold text-[#252B27] dark:text-white mb-3">
                        What Is a Rainbow Visual Timer?
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        A rainbow timer is a visual countdown timer that uses a multicolor rainbow to show time passing. As the timer runs, the rainbow arc gradually decreases, making the remaining time easy to see at a glance. It&apos;s a simple and engaging way to help people of all ages understand time.
                      </p>
                    </div>

                    <div id={tocIds[1]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252B27] dark:text-white mb-3">
                        How the Rainbow Countdown Works
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        The rainbow arc represents the total time you set. As seconds pass, the colored arc disappears in a smooth and continuous animation. The remaining arc always matches the time left. When the countdown reaches zero, the rainbow is fully gone and an optional sound alert notifies you.
                      </p>
                    </div>

                    {/* How to Use the Rainbow Timer + Right-side Tip Card matching screenshot */}
                    <div id={tocIds[2]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252B27] dark:text-white mb-4">
                        How to Use the Rainbow Timer
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
                        <ol className="sm:col-span-7 space-y-3">
                          {editorial.guide.howToUseSteps.map((step, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-3 text-xs sm:text-sm text-[#252B27]/85 dark:text-slate-300"
                            >
                              <span className="w-6 h-6 rounded-full bg-[#265641] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>

                        {/* Warm Amber Tip Box right next to steps */}
                        <div className="sm:col-span-5 rounded-2xl bg-[#FAF3E8] dark:bg-[#24201A] border border-[#EEDEC5] dark:border-[#3A3227] p-4">
                          <div className="flex items-center gap-2 mb-1.5 text-[#B7804C]">
                            <Lightbulb className="w-4 h-4 fill-current shrink-0" />
                            <span className="font-serif italic font-bold text-sm text-[#252B27] dark:text-white">
                              Tip
                            </span>
                          </div>
                          <p className="text-xs text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                            The rainbow timer is especially helpful for children, visual learners and anyone who finds it easier to understand time visually instead of using only numbers.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div id={tocIds[3]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252B27] dark:text-white mb-3">
                        Rainbow Timer for Kids and Classrooms
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        Teachers and parents can use a rainbow timer to manage classroom activities, transitions, group work and quiet time. The colorful visual helps children understand how much time is left, reduce distractions and stay engaged in a positive way.
                      </p>
                    </div>

                    <div id={tocIds[4]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252B27] dark:text-white mb-3">
                        Colorful Timers for Activities and Breaks
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
                        A rainbow countdown is useful for study sessions, creative work, exercise, short breaks, cooking timers and presentation time limits. The color changes make the countdown more engaging and easier to follow.
                      </p>
                    </div>

                    <div id={tocIds[5]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252B27] dark:text-white mb-3">
                        Customizing Your Rainbow Countdown
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed mb-3">
                        You can choose different rainbow styles, color themes and durations. Use fullscreen mode for a clean display, enable sound alerts and turn on reduced motion if you prefer a simpler animation.
                      </p>
                      <p className="text-xs sm:text-sm text-[#252B27]/75 dark:text-slate-400 leading-relaxed">
                        Looking for more sensory and visual timing options? Explore our{' '}
                        <Link href="/visual-timer" className="text-[#265641] dark:text-[#5E917A] font-semibold underline hover:no-underline">
                          Visual Timer
                        </Link>
                        ,{' '}
                        <Link href="/timers/liquid-timer" className="text-[#265641] dark:text-[#5E917A] font-semibold underline hover:no-underline">
                          Liquid Timer
                        </Link>
                        ,{' '}
                        <Link href="/timers/sand-timer" className="text-[#265641] dark:text-[#5E917A] font-semibold underline hover:no-underline">
                          Sand Timer
                        </Link>
                        , and{' '}
                        <Link href="/classroom-timer" className="text-[#265641] dark:text-[#5E917A] font-semibold underline hover:no-underline">
                          Classroom Timer
                        </Link>
                        .
                      </p>
                    </div>
                  </div>

                  {/* Right Sub-Column (xl:col-span-5): Rainbow Timer vs Digital Timer Table + Related Tools Card List */}
                  <div className="xl:col-span-5 space-y-6">
                    {/* Comparison Table Card */}
                    <div className="rounded-2xl border border-[#DCE5DD] dark:border-[#2C3931] bg-[#EBF0EC]/65 dark:bg-[#1A221E] p-4 sm:p-5 shadow-2xs">
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-[#252B27] dark:text-white mb-3">
                        Rainbow Timer vs Digital Timer
                      </h3>
                      <div className="overflow-x-auto rounded-xl border border-[#DCE5DD] dark:border-[#2D352F] bg-white dark:bg-[#1A201C]">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-[#265641] text-white">
                              <th scope="col" className="py-2.5 px-3 font-semibold">
                                Feature
                              </th>
                              <th scope="col" className="py-2.5 px-3 font-semibold">
                                Rainbow Timer
                              </th>
                              <th scope="col" className="py-2.5 px-3 font-semibold">
                                Digital Timer
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#E4E1D9] dark:divide-[#2D352F]">
                            {[
                              {
                                feature: 'Visual display',
                                rainbow: 'Colorful rainbow arc',
                                digital: 'Numbers only',
                              },
                              {
                                feature: 'Easier for kids',
                                rainbow: 'Yes, very engaging',
                                digital: 'Less visual',
                              },
                              {
                                feature: 'Shows time passing',
                                rainbow: 'Visual and intuitive',
                                digital: 'Only numbers',
                              },
                              {
                                feature: 'Best use cases',
                                rainbow: 'Classrooms, kids, creative activities',
                                digital: 'General purpose',
                              },
                              {
                                feature: 'Appearance',
                                rainbow: 'Fun and colorful',
                                digital: 'Simple and minimal',
                              },
                            ].map((row, idx) => (
                              <tr
                                key={row.feature}
                                className={
                                  idx % 2 === 0
                                    ? 'bg-transparent'
                                    : 'bg-[#F7F6F2]/55 dark:bg-[#1D2420]/50'
                                }
                              >
                                <td className="py-2.5 px-3 font-semibold text-[#252B27] dark:text-white whitespace-nowrap">
                                  {row.feature}
                                </td>
                                <td className="py-2.5 px-3 text-[#252B27]/85 dark:text-slate-200">
                                  {row.rainbow}
                                </td>
                                <td className="py-2.5 px-3 text-[#252B27]/75 dark:text-slate-400">
                                  {row.digital}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Related Tools Vertical Stack matching mockup */}
                    <div className="rounded-2xl border border-[#E4E1D9] dark:border-[#2D352F] bg-white/80 dark:bg-[#1A201C] p-4 sm:p-5 shadow-2xs space-y-3">
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-[#252B27] dark:text-white mb-2">
                        Related Tools
                      </h3>
                      {[
                        {
                          name: 'Visual Timer',
                          desc: 'A circular visual countdown timer.',
                          href: '/visual-timer',
                          iconBg: 'bg-[#E7EDE7] text-[#265641]',
                          icon: <Clock className="w-5 h-5" />,
                        },
                        {
                          name: 'Countdown Timer',
                          desc: 'Set a timer for any duration.',
                          href: '/countdown-timer',
                          iconBg: 'bg-[#FDECE8] text-[#D94E34]',
                          icon: <Clock className="w-5 h-5" />,
                        },
                        {
                          name: 'Classroom Timer',
                          desc: 'Simple timer for classroom use.',
                          href: '/classroom-timer',
                          iconBg: 'bg-[#E7EDE7] text-[#265641]',
                          icon: <GraduationCap className="w-5 h-5" />,
                        },
                        {
                          name: 'Pomodoro Timer',
                          desc: 'Stay focused with intervals.',
                          href: '/pomodoro-timer',
                          iconBg: 'bg-[#FDECE8] text-[#D94E34]',
                          icon: <Flame className="w-5 h-5" />,
                        },
                        {
                          name: 'Liquid Timer',
                          desc: 'Calming sensory liquid countdown.',
                          href: '/timers/liquid-timer',
                          iconBg: 'bg-sky-50 text-sky-600',
                          icon: <Droplets className="w-5 h-5" />,
                        },
                      ].map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-[#222924] border border-[#E4E1D9] dark:border-[#2D352F] hover:border-[#365C4B] transition-all group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg}`}>
                              {item.icon}
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-xs sm:text-sm text-[#252B27] dark:text-white group-hover:text-[#365C4B] transition-colors">
                                {item.name}
                              </div>
                              <div className="text-[11px] text-[#252B27]/70 dark:text-slate-400 truncate">
                                {item.desc}
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[#252B27]/40 group-hover:text-[#365C4B] group-hover:translate-x-0.5 transition-all shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}

              {/* If tool is Liquid Timer, render the exact 2-column editorial layout from the reference design */}
              {tool.slug === 'liquid-timer' ? (
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                  {/* Left Sub-Column: How to Use + Focus & Study + Kids & Classrooms + Choosing a Style */}
                  <div className="xl:col-span-7 space-y-8">
                    <div id={tocIds[2]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#252B27] dark:text-white mb-4">
                        How to Use the Liquid Timer
                      </h2>
                      <ol className="space-y-3">
                        {editorial.guide.howToUseSteps.map((step, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-3 text-sm sm:text-base text-[#252B27]/80 dark:text-slate-300"
                          >
                            <span className="w-6 h-6 rounded-full bg-[#265641] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div id={tocIds[3]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#252B27] dark:text-white mb-3">
                        Liquid Timer for Focus and Study
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/80 dark:text-slate-300 leading-relaxed">
                        A visual liquid timer can help you stay focused during study sessions. It gives a clear visual cue of the remaining time, which can reduce distractions and make it easier to work in short, manageable intervals.
                      </p>
                    </div>

                    <div id={tocIds[4]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#252B27] dark:text-white mb-3">
                        Liquid Timer for Kids and Classrooms
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/80 dark:text-slate-300 leading-relaxed">
                        Teachers and parents can use a liquid timer to manage classroom activities, transitions and group work. The visual countdown is especially helpful for children, as it shows time passing in a simple and intuitive way.
                      </p>
                    </div>

                    <div id={tocIds[5]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#252B27] dark:text-white mb-3">
                        Choosing a Liquid Timer Style
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/80 dark:text-slate-300 leading-relaxed">
                        You can choose from different liquid colors and styles such as ocean blue, amber, clear water, sage green, purple or rose pink. Select a style that matches your environment and purpose. Calmer colors often work well for study and relaxation, while brighter colors are great for kids and classroom activities.
                      </p>
                    </div>
                  </div>

                  {/* Right Sub-Column: Liquid Timer Styles Table + Sage Leaf Callout */}
                  <div className="xl:col-span-5 space-y-5">
                    <div className="rounded-2xl border border-[#E4E1D9] dark:border-[#2D352F] bg-white dark:bg-[#1A201C] p-4 sm:p-5 shadow-2xs">
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-[#252B27] dark:text-white mb-3">
                        Liquid Timer Styles
                      </h3>
                      <div className="overflow-x-auto rounded-xl border border-[#E4E1D9] dark:border-[#2D352F]">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-[#265641] text-white">
                              <th scope="col" className="py-2.5 px-3 font-semibold">
                                Style
                              </th>
                              <th scope="col" className="py-2.5 px-3 font-semibold">
                                Appearance
                              </th>
                              <th scope="col" className="py-2.5 px-3 font-semibold">
                                Best For
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#E4E1D9] dark:divide-[#2D352F]">
                            {[
                              {
                                style: 'Ocean Blue',
                                appearance: 'Calm and clear',
                                bestFor: 'Study, focus, everyday use',
                              },
                              {
                                style: 'Amber',
                                appearance: 'Warm and vibrant',
                                bestFor: 'Kitchen, games',
                              },
                              {
                                style: 'Clear Water',
                                appearance: 'Minimal and clean',
                                bestFor: 'Any environment',
                              },
                              {
                                style: 'Sage Green',
                                appearance: 'Natural and calming',
                                bestFor: 'Mindfulness, relaxation',
                              },
                              {
                                style: 'Purple',
                                appearance: 'Soothing and smooth',
                                bestFor: 'Classrooms, kids',
                              },
                              {
                                style: 'Rose Pink',
                                appearance: 'Bright and playful',
                                bestFor: 'Kids, fun activities',
                              },
                            ].map((row, idx) => (
                              <tr
                                key={row.style}
                                className={
                                  idx % 2 === 0
                                    ? 'bg-transparent'
                                    : 'bg-[#F7F6F2]/55 dark:bg-[#1D2420]/50'
                                }
                              >
                                <td className="py-2.5 px-3 font-semibold text-[#252B27] dark:text-white whitespace-nowrap">
                                  {row.style}
                                </td>
                                <td className="py-2.5 px-3 text-[#252B27]/80 dark:text-slate-300">
                                  {row.appearance}
                                </td>
                                <td className="py-2.5 px-3 text-[#252B27]/75 dark:text-slate-400">
                                  {row.bestFor}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Sage Leaf Mood Callout Box */}
                    <div className="p-5 rounded-2xl bg-[#EBF0EC] dark:bg-[#1E2722] border border-[#D8E2D8] dark:border-[#2C3931] flex items-start gap-3.5">
                      <Leaf className="w-5 h-5 text-[#265641] dark:text-[#5E917A] shrink-0 mt-0.5 fill-current" />
                      <p className="font-serif italic text-xs sm:text-sm text-[#252B27] dark:text-slate-200 leading-relaxed">
                        Different colors can create different moods. Choose the style that helps you stay focused and comfortable.
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* If tool has specialized editorial sections (e.g. Sand Timer or Visual Timer) and not world-clock or time-duration-calculator */}
              {tool.slug === 'sand-timer' ? (
                <>
                  <div id={tocIds[3]} className="scroll-mt-28">
                    <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#252B27] dark:text-white mb-3">
                      Sand Timer for Games and Classrooms
                    </h2>
                    <p className="text-sm sm:text-base text-[#252B27]/80 dark:text-slate-300 leading-relaxed mb-3">
                      A sand timer is perfect for board games, classroom activities and group work. It helps keep turns fair, manages activity time and gives a clear visual cue that is easy for everyone to understand, especially children.
                    </p>
                    <p className="text-sm sm:text-base text-[#252B27]/80 dark:text-slate-300 leading-relaxed">
                      In tabletop and party board games such as trivia, word-guessing, or chess sprints, setting a 1-minute or 3-minute digital sand timer keeps gameplay lively. In classrooms, teachers project the fullscreen hourglass during reading centers, clean-up transitions, and partner discussions so students can gauge remaining time at a glance without feeling pressured by ticking numbers.
                    </p>
                  </div>

                  <div id={tocIds[4]} className="scroll-mt-28">
                    <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#252B27] dark:text-white mb-3">
                      Sand Timer for Cooking and Everyday Activities
                    </h2>
                    <p className="text-sm sm:text-base text-[#252B27]/80 dark:text-slate-300 leading-relaxed mb-3">
                      Beyond games and learning, an online sand countdown timer brings calm structure to everyday routines:
                    </p>
                    <ul className="space-y-2.5">
                      {[
                        'Cooking & Tea Steeping: Use 3-minute and 5-minute presets for steeping loose-leaf tea, blooming pour-over coffee, soft-boiling eggs, or resting pan-seared dishes.',
                        'Meditation & Breathwork: Hide the digital clock numbers and watch the gentle golden sand flow during 10-minute or 15-minute mindfulness sessions.',
                        'Short Work Breaks: Step away from intense desk work for a 5-minute screen-free stretch or eye break between Pomodoro intervals.',
                        'Kids’ Daily Routines: Make toothbrushing (2–3 minutes) and bedtime toy tidy-ups engaging and visual.',
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-sm sm:text-base text-[#252B27]/80 dark:text-slate-300">
                          <span className="w-2 h-2 rounded-full bg-[#365C4B] mt-2 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div id={tocIds[5]} className="scroll-mt-28">
                    <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#252B27] dark:text-white mb-3">
                      Digital Sand Timer vs Traditional Hourglass
                    </h2>
                    <p className="text-sm sm:text-base text-[#252B27]/80 dark:text-slate-300 leading-relaxed mb-4">
                      While a traditional physical hourglass measures time through the gravity-driven flow of silica or mineral grains through a narrow glass aperture, a digital sand timer is driven by your device&apos;s high-precision system clock. The falling sand animation is a visual representation synchronized to the exact remaining countdown duration rather than a physical measurement of grain flow.
                    </p>
                    <div className="rounded-2xl border border-[#E4E1D9] dark:border-[#2D352F] overflow-hidden bg-white dark:bg-[#1A201C] shadow-2xs">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs sm:text-sm">
                          <thead>
                            <tr className="bg-[#365C4B] text-white">
                              <th scope="col" className="py-3 px-4 font-semibold">Feature</th>
                              <th scope="col" className="py-3 px-4 font-semibold">Digital Sand Timer</th>
                              <th scope="col" className="py-3 px-4 font-semibold">Traditional Glass Hourglass</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#E4E1D9] dark:divide-[#2D352F]">
                            {[
                              {
                                feature: 'Timing Mechanism',
                                digital: 'Exact digital clock with synchronized visual sand animation',
                                physical: 'Physical gravity flow of sand grains through a glass neck',
                              },
                              {
                                feature: 'Duration Flexibility',
                                digital: 'Any preset (1, 3, 5, 10, 15 min) or custom duration on demand',
                                physical: 'Fixed to a single duration per physical glass vessel',
                              },
                              {
                                feature: 'Pause & Resume',
                                digital: 'Instant Pause, Resume, and Reset controls at any moment',
                                physical: 'Must be laid flat carefully or restarted from the beginning',
                              },
                              {
                                feature: 'Completion Alert',
                                digital: 'Optional acoustic sound chime plus visual empty indicator',
                                physical: 'Silent—requires watching the glass bulb closely',
                              },
                              {
                                feature: 'Accessibility',
                                digital: 'Adjustable animation speed, reduced motion mode, and fullscreen',
                                physical: 'Fixed physical size and motion speed',
                              },
                            ].map((row, idx) => (
                              <tr
                                key={idx}
                                className={idx % 2 === 0 ? 'bg-transparent' : 'bg-[#F7F6F2]/50 dark:bg-[#1D2420]/50'}
                              >
                                <td className="py-3 px-4 font-semibold text-[#252B27] dark:text-white whitespace-nowrap">
                                  {row.feature}
                                </td>
                                <td className="py-3 px-4 text-[#252B27]/85 dark:text-slate-300">
                                  {row.digital}
                                </td>
                                <td className="py-3 px-4 text-[#252B27]/75 dark:text-slate-400">
                                  {row.physical}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </>
              ) : tool.slug !== 'world-clock' && tool.slug !== 'time-duration-calculator' && tool.slug !== 'liquid-timer' && tool.slug !== 'rainbow-timer' && tool.slug !== 'hourglass-timer' && tool.slug !== 'circular-timer' && tool.slug !== 'radial-timer' && tool.slug !== 'rings-timer' && tool.slug !== 'progress-timer' && tool.slug !== 'pixel-timer' && tool.slug !== 'blocks-timer' && tool.slug !== 'candle-timer' && tool.slug !== 'aesthetic-timer' && tool.slug !== 'picture-reveal-timer' && tool.slug !== 'heart-timer' && tool.slug !== 'moon-timer' && tool.slug !== 'sun-timer' && tool.slug !== 'bubble-timer' && tool.slug !== 'coral-timer' && tool.slug !== 'lichen-timer' && tool.slug !== 'frost-timer' && tool.slug !== 'snow-timer' && tool.slug !== 'galaxy-timer' && tool.slug !== 'lava-lamp-timer' && tool.slug !== 'spinner-timer' && (
                editorial.guide.classroomsTitle ? (
                  <>
                    <div id={tocIds[3]} className="scroll-mt-28">
                      <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#252B27] dark:text-white mb-3">
                        {editorial.guide.classroomsTitle}
                      </h2>
                      <p className="text-sm sm:text-base text-[#252B27]/80 dark:text-slate-300 leading-relaxed">
                        {editorial.guide.classroomsBody}
                      </p>
                    </div>

                    {editorial.guide.productivityTitle && (
                      <div id={tocIds[4]} className="scroll-mt-28">
                        <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#252B27] dark:text-white mb-3">
                          {editorial.guide.productivityTitle}
                        </h2>
                        <p className="text-sm sm:text-base text-[#252B27]/80 dark:text-slate-300 leading-relaxed">
                          {editorial.guide.productivityBody}
                        </p>
                      </div>
                    )}

                    {editorial.guide.presentationsTitle && (
                      <div id={tocIds[5]} className="scroll-mt-28">
                        <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#252B27] dark:text-white mb-3">
                          {editorial.guide.presentationsTitle}
                        </h2>
                        <p className="text-sm sm:text-base text-[#252B27]/80 dark:text-slate-300 leading-relaxed">
                          {editorial.guide.presentationsBody}
                        </p>
                      </div>
                    )}

                    {editorial.guide.choosingStyleTitle && (
                      <div id={tocIds[6]} className="scroll-mt-28">
                        <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#252B27] dark:text-white mb-3">
                          {editorial.guide.choosingStyleTitle}
                        </h2>
                        <p className="text-sm sm:text-base text-[#252B27]/80 dark:text-slate-300 leading-relaxed">
                          {editorial.guide.choosingStyleBody}
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <ArchetypeArticleSections
                    slug={tool.slug}
                    toolName={tool.name}
                    categorySlug={editorial.categorySlug}
                    renderFullArticle={true}
                  />
                )
              )}

              {/* For specialized visual timers & custom layouts, render their tailored Sensory Studio / Global / Ledger practitioner blocks */}
              {(tool.slug === 'world-clock' ||
                tool.slug === 'time-duration-calculator' ||
                tool.slug === 'visual-timer' ||
                tool.slug === 'sand-timer' ||
                tool.slug === 'liquid-timer' ||
                tool.slug === 'rainbow-timer' ||
                tool.slug === 'hourglass-timer' ||
                tool.slug === 'circular-timer' ||
                tool.slug === 'radial-timer' ||
                tool.slug === 'rings-timer' ||
                tool.slug === 'progress-timer' ||
                tool.slug === 'pixel-timer' ||
                tool.slug === 'blocks-timer' ||
                tool.slug === 'candle-timer' ||
                tool.slug === 'aesthetic-timer' ||
                tool.slug === 'picture-reveal-timer' ||
                tool.slug === 'heart-timer' ||
                tool.slug === 'moon-timer' ||
                tool.slug === 'sun-timer' ||
                tool.slug === 'bubble-timer' ||
                tool.slug === 'coral-timer' ||
                tool.slug === 'lichen-timer' ||
                tool.slug === 'frost-timer' ||
                tool.slug === 'snow-timer' ||
                tool.slug === 'galaxy-timer' ||
                tool.slug === 'lava-lamp-timer' ||
                tool.slug === 'spinner-timer') && (
                <ArchetypeArticleSections
                  slug={tool.slug}
                  toolName={tool.name}
                  categorySlug={editorial.categorySlug}
                  renderFullArticle={false}
                />
              )}

              {/* Information Provenance, Calculation Method & Operating Limitations */}
              <InformationProvenanceBox
                slug={tool.slug}
                toolName={tool.name}
                categorySlug={editorial.categorySlug}
              />
            </article>
          </div>
        </div>
      </section>

      {/* 6. SECTION 5 — RELATED TOOLS */}
      {tool.slug !== 'rainbow-timer' && tool.slug !== 'liquid-timer' && tool.slug !== 'hourglass-timer' && tool.slug !== 'circular-timer' && tool.slug !== 'radial-timer' && tool.slug !== 'rings-timer' && tool.slug !== 'progress-timer' && tool.slug !== 'pixel-timer' && tool.slug !== 'blocks-timer' && tool.slug !== 'candle-timer' && tool.slug !== 'aesthetic-timer' && tool.slug !== 'picture-reveal-timer' && tool.slug !== 'heart-timer' && tool.slug !== 'moon-timer' && tool.slug !== 'sun-timer' && tool.slug !== 'bubble-timer' && tool.slug !== 'coral-timer' && tool.slug !== 'lichen-timer' && tool.slug !== 'frost-timer' && tool.slug !== 'snow-timer' && tool.slug !== 'galaxy-timer' && tool.slug !== 'lava-lamp-timer' && tool.slug !== 'spinner-timer' && (
        <section className="py-14 sm:py-20 border-b border-[#E4E1D9] dark:border-[#262D28] bg-white/40 dark:bg-[#181D1A]/40">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
              <div>
                <h2 className="font-serif text-3xl font-normal text-[#252B27] dark:text-white">
                  Related Tools
                </h2>
                <p className="text-xs sm:text-sm text-[#252B27]/70 dark:text-slate-400 mt-1">
                  {tool.slug === 'time-duration-calculator'
                    ? 'These tools can also help you with time and date calculations.'
                    : 'These tools can also help you stay productive and manage your time better.'}
                </p>
              </div>
              <Link
                href="/tools"
                className="text-xs sm:text-sm font-semibold text-[#365C4B] dark:text-[#5E917A] hover:underline flex items-center gap-1 self-start sm:self-end"
              >
                <span>View All Tools</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedTools.map((rel) => (
                <div
                  key={rel.slug}
                  className="bg-white dark:bg-[#1A201C] border border-[#E4E1D9] dark:border-[#2D352F] rounded-2xl p-5 hover:border-[#365C4B] transition-all flex flex-col justify-between group shadow-2xs"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-[#E7EDE7] dark:bg-[#252E28] text-[#365C4B] dark:text-[#5E917A] flex items-center justify-center mb-3.5">
                      {renderEditorialIcon(rel.icon, 'w-5 h-5')}
                    </div>
                    <h3 className="font-bold text-base text-[#252B27] dark:text-white mb-1 group-hover:text-[#365C4B] transition-colors">
                      {rel.name}
                    </h3>
                    <p className="text-xs text-[#252B27]/70 dark:text-slate-400 leading-relaxed mb-4">
                      {rel.description}
                    </p>
                  </div>

                  <Link
                    href={getToolCanonicalPath(rel.slug)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#365C4B] dark:text-[#5E917A] group-hover:translate-x-1 transition-transform"
                  >
                    <span>Open {rel.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. SECTION 6 — FREQUENTLY ASKED QUESTIONS (FAQ) */}
      <section id={faqSectionId} className="py-14 sm:py-20 scroll-mt-24">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="mb-8">
            {tool.slug === 'rainbow-timer' || tool.slug === 'liquid-timer' || tool.slug === 'sand-timer' || tool.slug === 'hourglass-timer' || tool.slug === 'circular-timer' || tool.slug === 'radial-timer' || tool.slug !== 'rings-timer' && false || tool.slug === 'rings-timer' || tool.slug === 'progress-timer' || tool.slug === 'pixel-timer' || tool.slug === 'blocks-timer' || tool.slug === 'candle-timer' || tool.slug === 'aesthetic-timer' || tool.slug === 'picture-reveal-timer' || tool.slug === 'heart-timer' || tool.slug === 'moon-timer' || tool.slug === 'sun-timer' || tool.slug === 'bubble-timer' || tool.slug === 'coral-timer' || tool.slug === 'lichen-timer' || tool.slug === 'frost-timer' || tool.slug === 'snow-timer' || tool.slug === 'galaxy-timer' || tool.slug === 'lava-lamp-timer' || tool.slug === 'spinner-timer' ? (
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#252B27] dark:text-white">
                Frequently Asked Questions
              </h2>
            ) : (
              <>
                <span className="text-[11px] font-bold tracking-widest text-[#B7804C] dark:text-[#cda06f] uppercase block mb-1">
                  Frequently Asked Questions
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#252B27] dark:text-white">
                  Got Questions? We&apos;ve Got Answers.
                </h2>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tool.faq.map((faq, idx) => {
              const isExpanded = openFaqIndex === idx;
              return (
                <div
                  key={faq.question}
                  className="bg-white dark:bg-[#1A201C] border border-[#E4E1D9] dark:border-[#2D352F] rounded-2xl overflow-hidden shadow-2xs transition-all"
                >
                  <button
                    type="button"
                    aria-expanded={isExpanded}
                    onClick={() => setOpenFaqIndex(isExpanded ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left text-sm sm:text-base font-semibold text-[#252B27] dark:text-white hover:text-[#365C4B] transition-colors cursor-pointer"
                  >
                    <span>{faq.question}</span>
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
                    {faq.answer}
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

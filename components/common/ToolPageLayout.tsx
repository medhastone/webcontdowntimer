'use client';

import React from 'react';
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
import ToolSpecificContentSection from '@/components/common/ToolSpecificContentSection';
import { getToolSpecificContent } from '@/lib/tool-specific-content';
import {
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
  Droplets,
  Heart,
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

export default function ToolPageLayout({ tool, children }: ToolPageLayoutProps) {
  const editorial: ToolEditorialData = getToolEditorialData(tool);
  const specificContent = getToolSpecificContent(tool.slug);
  const relatedTools = getRelatedTools(tool.slug, 4);

  const canonicalPath = getToolCanonicalPath(tool.slug);

  // SEO breadcrumb schema
  const breadcrumbs = [
    { name: 'Home', item: 'https://WebCountDownTimer.com/' },
    { name: editorial.categoryLabel, item: `https://WebCountDownTimer.com/category/${editorial.categorySlug}` },
    { name: tool.name, item: `https://WebCountDownTimer.com${canonicalPath}` },
  ];

  const stepsForSchema = specificContent
    ? specificContent.howToUse.map((desc, idx) => ({
        step: idx + 1,
        title: `Step ${idx + 1}`,
        description: desc,
      }))
    : editorial.steps;

  return (
    <div className="min-h-screen bg-[#F7F6F2] dark:bg-[#141816] text-[#252B27] dark:text-slate-100 transition-colors">
      <SEOStructuredData
        toolName={tool.name}
        description={tool.description}
        url={`https://WebCountDownTimer.com${canonicalPath}`}
        faqs={specificContent ? specificContent.faqs : tool.faq}
        breadcrumbs={breadcrumbs}
        steps={stepsForSchema}
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
                    ? 'text-[#3F6A34] dark:text-[#7FB670]'
                    : tool.slug === 'frost-timer' || tool.slug === 'snow-timer'
                    ? 'text-[#2563EB] dark:text-[#60A5FA]'
                    : tool.slug === 'galaxy-timer'
                    ? 'text-[#7C3AED] dark:text-[#A78BFA]'
                    : tool.slug === 'lava-lamp-timer'
                    ? 'text-[#D97706] dark:text-[#FBBF24]'
                    : tool.slug === 'spinner-timer'
                    ? 'text-[#2563EB] dark:text-[#60A5FA]'
                    : 'text-[#B7804C] dark:text-[#cda06f]'
                }`}
              >
                {tool.slug === 'sand-timer'
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
                    : tool.slug === 'sun-timer' ||
                      tool.slug === 'bubble-timer' ||
                      tool.slug === 'coral-timer' ||
                      tool.slug === 'lichen-timer' ||
                      tool.slug === 'frost-timer' ||
                      tool.slug === 'snow-timer' ||
                      tool.slug === 'galaxy-timer' ||
                      tool.slug === 'lava-lamp-timer' ||
                      tool.slug === 'spinner-timer'
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

              {/* Feature Pills */}
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

            {/* Right Editorial Hero Desk Artwork */}
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
                    <div className="bg-[#2B302C] border-[6px] border-[#C89D66] rounded-xl px-4 py-3 shadow-lg text-center relative w-36 sm:w-40 shrink-0 -rotate-2">
                      <div className="font-serif italic text-white/95 text-sm sm:text-base leading-snug space-y-0.5">
                        <div>Small</div>
                        <div>Steps</div>
                        <div>Bright</div>
                        <div>Days</div>
                      </div>
                      <svg viewBox="0 0 60 34" className="w-12 h-7 ml-auto mt-1">
                        <path d="M 6 30 A 24 24 0 0 1 54 30" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
                        <path d="M 10 30 A 20 20 0 0 1 50 30" fill="none" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" />
                        <path d="M 14 30 A 16 16 0 0 1 46 30" fill="none" stroke="#FACC15" strokeWidth="2.5" strokeLinecap="round" />
                        <path d="M 18 30 A 12 12 0 0 1 42 30" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" />
                        <path d="M 22 30 A 8 8 0 0 1 38 30" fill="none" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
                        <path d="M 26 30 A 4 4 0 0 1 34 30" fill="none" stroke="#A855F7" strokeWidth="2.5" strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>
                ) : tool.slug === 'hourglass-timer' ? (
                  <div className="absolute inset-0 bg-gradient-to-r from-black/15 via-transparent to-black/25 flex items-center justify-end p-4 gap-3">
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
                    <div className="bg-[#EFE8DB] dark:bg-[#221F1A] border-[6px] border-[#C89D66] rounded-xl px-4 py-3 shadow-lg text-center relative w-32 sm:w-36 shrink-0 -rotate-1">
                      <div className="font-serif text-[#252B27] dark:text-white text-sm sm:text-base leading-snug space-y-0.5">
                        <div>Focus</div>
                        <div>Breathe</div>
                        <div>Learn</div>
                        <div>Grow</div>
                      </div>
                    </div>
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

      {/* 4. SECTION 3 — TOOL-SPECIFIC USE CASES, HOW TO USE & 3 UNIQUE FAQS (150-250 WORDS) */}
      <section className="py-12 sm:py-16 border-b border-[#E4E1D9] dark:border-[#262D28]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <ToolSpecificContentSection slug={tool.slug} toolName={tool.name} />
        </div>
      </section>

      {/* 5. SECTION 4 — RELATED TOOLS */}
      <section className="py-14 sm:py-20 bg-white/40 dark:bg-[#181D1A]/40">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
            <div>
              <h2 className="font-serif text-3xl font-normal text-[#252B27] dark:text-white">
                Related Tools
              </h2>
              <p className="text-xs sm:text-sm text-[#252B27]/70 dark:text-slate-400 mt-1">
                Explore related timing, world clock, and calculation tools.
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
    </div>
  );
}

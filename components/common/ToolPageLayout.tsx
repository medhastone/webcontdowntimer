'use client';

import React from 'react';
import Link from 'next/link';
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
  Sparkles,
  BookOpen,
  Lightbulb,
  Wrench,
  CheckCircle2,
  Cpu,
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
    { name: 'Home', item: 'https://WebCountDownTimer.com' },
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

  // Merge and deduplicate FAQs from both tool-specific-content and tools-registry
  const seenFaqKeys = new Set<string>();
  const mergedFaqs: Array<{ question: string; answer: string }> = [];
  const primaryFaqs = specificContent ? specificContent.faqs : [];
  const secondaryFaqs = tool.faq || [];
  for (const item of [...primaryFaqs, ...secondaryFaqs]) {
    const key = item.question.trim().toLowerCase();
    if (!seenFaqKeys.has(key)) {
      seenFaqKeys.add(key);
      mergedFaqs.push(item);
    }
  }

  const isCalculatorOrClock =
    editorial.categorySlug === 'calculators' ||
    editorial.categorySlug === 'world' ||
    tool.category === 'world' ||
    tool.slug === 'world-clock';

  return (
    <div className="min-h-screen bg-[#F7F6F2] dark:bg-[#141816] text-[#252B27] dark:text-slate-100 transition-colors">
      <SEOStructuredData
        toolName={tool.name}
        description={tool.description}
        url={`https://WebCountDownTimer.com${canonicalPath}`}
        faqs={mergedFaqs}
        breadcrumbs={breadcrumbs}
        steps={stepsForSchema}
        applicationCategory="UtilitiesApplication"
        featureList={editorial.featurePills}
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
          <div className="max-w-4xl">
            {/* Hero Intro Content */}
            <div>
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
                  : tool.slug === 'custom-timer'
                  ? 'CUSTOM TIMER'
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
          </div>
        </div>
      </section>

      {/* 3. SECTION 2 — THE FUNCTIONAL TOOL AREA */}
      <section className="py-10 sm:py-14 border-b border-[#E4E1D9] dark:border-[#262D28]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          {children}
        </div>
      </section>

      {/* 4. SECTION 3 — AI OVERVIEW QUICK ANSWER, USE CASES, STEP-BY-STEP & MERGED FAQS */}
      <section className="py-12 sm:py-16 border-b border-[#E4E1D9] dark:border-[#262D28]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 space-y-8">
          {/* AI Overview Quick Answer & Specification Matrix */}
          <div
            id="ai-quick-answer"
            data-ai-summary="true"
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              {/* Left: Direct Answer Summary & Practitioner Callout */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold tracking-widest uppercase text-[#B7804C] dark:text-[#cda06f] block">
                      Quick Answer &amp; Overview
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                      What is the {tool.name} and how does it work?
                    </h2>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong>{tool.name}</strong> is a free, browser-native {editorial.categoryLabel.toLowerCase()} tool: {tool.description}{' '}
                  {Array.isArray(editorial.guide.whatIsBody)
                    ? editorial.guide.whatIsBody[0]
                    : editorial.guide.whatIsBody}
                </p>

                {editorial.guide.calloutNote && (
                  <div className="p-4 rounded-2xl bg-[#FAF6F0] dark:bg-slate-800/70 border border-[#E8DEC8] dark:border-slate-700 flex items-start gap-3">
                    <Lightbulb className="w-4 h-4 text-[#B7804C] dark:text-[#cda06f] shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                      <strong className="font-semibold text-slate-900 dark:text-white">Practitioner Tip: </strong>
                      {editorial.guide.calloutNote}
                    </p>
                  </div>
                )}
              </div>

              {/* Right: Structured Technical & AI Agent Specification Matrix (<dl>) */}
              <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 p-5">
                <div className="flex items-center gap-2 mb-3.5 pb-2.5 border-b border-slate-200 dark:border-slate-700">
                  <Cpu className="w-4 h-4 text-[#365C4B] dark:text-[#5E917A]" />
                  <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Technical Specifications &amp; Controls
                  </h3>
                </div>
                <dl className="space-y-2.5 text-xs sm:text-sm">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 pb-2 border-b border-slate-200/60 dark:border-slate-700/50">
                    <dt className="font-semibold text-slate-500 dark:text-slate-400">Category</dt>
                    <dd className="font-medium text-slate-900 dark:text-white sm:text-right">{editorial.categoryLabel}</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 pb-2 border-b border-slate-200/60 dark:border-slate-700/50">
                    <dt className="font-semibold text-slate-500 dark:text-slate-400">Timing &amp; Math Engine</dt>
                    <dd className="font-medium text-slate-900 dark:text-white sm:text-right">
                      {isCalculatorOrClock
                        ? 'IANA Time Zone & Calendar Math (Client-Side)'
                        : 'Monotonic Timestamp Delta (Zero Tab Drift)'}
                    </dd>
                  </div>
                  {!isCalculatorOrClock && (
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 pb-2 border-b border-slate-200/60 dark:border-slate-700/50">
                      <dt className="font-semibold text-slate-500 dark:text-slate-400">Keyboard Shortcuts</dt>
                      <dd className="font-mono text-xs font-semibold text-slate-900 dark:text-white sm:text-right">
                        Space (Start/Pause) · R (Reset) · F (Fullscreen)
                      </dd>
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 pb-2 border-b border-slate-200/60 dark:border-slate-700/50">
                    <dt className="font-semibold text-slate-500 dark:text-slate-400">Audio &amp; Alerts</dt>
                    <dd className="font-medium text-slate-900 dark:text-white sm:text-right">
                      {isCalculatorOrClock ? 'Instant Copy & CSV/Text Export' : 'Web Audio API Synthesis + Mute Toggle'}
                    </dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                    <dt className="font-semibold text-slate-500 dark:text-slate-400">Privacy &amp; Cost</dt>
                    <dd className="font-medium text-emerald-700 dark:text-emerald-400 sm:text-right">
                      100% Free · No Login · Runs Locally in Browser
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          <ToolSpecificContentSection
            slug={tool.slug}
            toolName={tool.name}
            extraFaqs={tool.faq}
          />
        </div>
      </section>

      {/* 5. SECTION 4 — IN-DEPTH PRACTITIONER GUIDE, EXAMPLES & TROUBLESHOOTING TABLE */}
      <section
        aria-labelledby="in-depth-guide-heading"
        className="py-12 sm:py-16 border-b border-[#E4E1D9] dark:border-[#262D28] bg-[#F7F6F2] dark:bg-[#141816]"
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 space-y-8">
          {/* Deep-Dive Mechanics + Key Features */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* How It Works Deep Dive */}
            <article className="lg:col-span-7 bg-white dark:bg-[#1A201C] rounded-3xl border border-[#E4E1D9] dark:border-[#2D352F] p-6 sm:p-8 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-xl bg-[#E7EDE7] dark:bg-[#252E28] text-[#365C4B] dark:text-[#5E917A] flex items-center justify-center">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#365C4B] dark:text-[#5E917A]">
                    In-Depth Operational Guide
                  </span>
                </div>
                <h2
                  id="in-depth-guide-heading"
                  className="font-serif text-2xl sm:text-3xl font-normal text-[#252B27] dark:text-white mb-3"
                >
                  {editorial.guide.howItWorksTitle}
                </h2>
                <div className="space-y-3 text-sm sm:text-base text-[#252B27]/80 dark:text-slate-300 leading-relaxed mb-6">
                  {Array.isArray(editorial.guide.howItWorksBody) ? (
                    editorial.guide.howItWorksBody.map((para, idx) => (
                      <p key={idx}>{para}</p>
                    ))
                  ) : (
                    <p>{editorial.guide.howItWorksBody}</p>
                  )}
                </div>
              </div>

              {/* Key Features Sub-List */}
              <div className="pt-5 border-t border-[#E4E1D9] dark:border-[#2D352F]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#252B27]/70 dark:text-slate-400 mb-3">
                  Key Capabilities &amp; Design Highlights
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {editorial.guide.featuresList.map((feat, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-xs sm:text-sm text-[#252B27]/85 dark:text-slate-200"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#365C4B] dark:text-[#5E917A] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>

            {/* Who Benefits Most */}
            <div className="lg:col-span-5 bg-white dark:bg-[#1A201C] rounded-3xl border border-[#E4E1D9] dark:border-[#2D352F] p-6 sm:p-8 shadow-2xs">
              <span className="text-xs font-bold uppercase tracking-widest text-[#B7804C] dark:text-[#cda06f] block mb-1">
                Target Workflows
              </span>
              <h2 className="font-serif text-2xl font-normal text-[#252B27] dark:text-white mb-4">
                {editorial.guide.whoBenefitsTitle || `Who Benefits Most from ${tool.name}`}
              </h2>
              <ul className="space-y-3">
                {editorial.guide.whoBenefitsList.map((benefit, idx) => (
                  <li
                    key={idx}
                    className="p-3.5 rounded-2xl bg-[#F7F6F2] dark:bg-[#222924] border border-[#E4E1D9] dark:border-[#2D352F] flex items-start gap-3 text-xs sm:text-sm text-[#252B27]/85 dark:text-slate-200 leading-relaxed"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#E7EDE7] dark:bg-[#2D3831] text-[#365C4B] dark:text-[#5E917A] flex items-center justify-center shrink-0 mt-0.5">
                      <Users className="w-3.5 h-3.5" />
                    </div>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Practical Examples + Pro Tips Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Real-World Scenarios */}
            <div className="lg:col-span-6 bg-white dark:bg-[#1A201C] rounded-3xl border border-[#E4E1D9] dark:border-[#2D352F] p-6 sm:p-8 shadow-2xs">
              <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#252B27] dark:text-white mb-4">
                Real-World Timing &amp; Planning Scenarios
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {editorial.guide.practicalExamples.map((example, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#F7F6F2] dark:bg-[#222924] border border-[#E4E1D9] dark:border-[#2D352F]"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#E7EDE7] dark:bg-[#2D3831] text-[#365C4B] dark:text-[#5E917A] flex items-center justify-center mb-2.5">
                      {renderEditorialIcon(example.icon, 'w-4 h-4')}
                    </div>
                    <h4 className="text-sm font-bold text-[#252B27] dark:text-white mb-1">
                      {example.title}
                    </h4>
                    <p className="text-xs text-[#252B27]/75 dark:text-slate-300 leading-relaxed">
                      {example.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Practitioner Pro Tips */}
            <div className="lg:col-span-6 bg-white dark:bg-[#1A201C] rounded-3xl border border-[#E4E1D9] dark:border-[#2D352F] p-6 sm:p-8 shadow-2xs">
              <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#252B27] dark:text-white mb-4">
                Expert Tips for Best Results
              </h3>
              <ul className="space-y-3">
                {editorial.guide.tipsList.map((tip, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-xs sm:text-sm text-[#252B27]/85 dark:text-slate-300 leading-relaxed"
                  >
                    <Lightbulb className="w-4 h-4 text-[#B7804C] dark:text-[#cda06f] shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Troubleshooting & Quick Fixes Table */}
          {editorial.guide.problemsRows && editorial.guide.problemsRows.length > 0 && (
            <div className="bg-white dark:bg-[#1A201C] rounded-3xl border border-[#E4E1D9] dark:border-[#2D352F] p-6 sm:p-8 shadow-2xs">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <Wrench className="w-4 h-4" />
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#252B27] dark:text-white">
                  {editorial.guide.problemsTitle}
                </h3>
              </div>

              <div className="rounded-2xl border border-[#E4E1D9] dark:border-[#2D352F] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-[#365C4B] text-white">
                        <th scope="col" className="py-3 px-4 font-semibold">Issue or Question</th>
                        <th scope="col" className="py-3 px-4 font-semibold">Common Cause</th>
                        <th scope="col" className="py-3 px-4 font-semibold">Recommended Solution</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E4E1D9] dark:divide-[#2D352F]">
                      {editorial.guide.problemsRows.map((row, idx) => (
                        <tr
                          key={idx}
                          className={
                            idx % 2 === 0
                              ? 'bg-transparent'
                              : 'bg-[#F7F6F2]/60 dark:bg-[#222924]/50'
                          }
                        >
                          <td className="py-3 px-4 font-semibold text-[#252B27] dark:text-white">
                            {row.problem}
                          </td>
                          <td className="py-3 px-4 text-[#252B27]/75 dark:text-slate-300">
                            {row.cause}
                          </td>
                          <td className="py-3 px-4 text-[#252B27]/85 dark:text-slate-200">
                            {row.solution}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 6. SECTION 5 — RELATED TOOLS */}
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

import { buildPageMetadata } from '@/lib/seo-metadata';
import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  ChevronRight,
  SlidersHorizontal,
  Monitor,
  CheckCircle2,
  Leaf,
  Info,
  Flame,
  Hourglass,
  Trees,
  Mountain,
  Sprout,
  CircleDot,
  Clock,
} from 'lucide-react';
import ForestFireTimerComponent from '@/components/tools/ForestFireTimerComponent';
import ToolSpecificContentSection from '@/components/common/ToolSpecificContentSection';
import { getToolSpecificContent } from '@/lib/tool-specific-content';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/timers/forest-fire-timer');
}

const RELATED_TOOLS = [
  {
    title: 'Visual Timer',
    desc: 'A simple visual countdown.',
    href: '/visual-timer',
    badgeColor: 'bg-[#FFF3E0] text-[#E65100] border-[#FFE0B2]',
    icon: 'clock',
  },
  {
    title: 'Progress Timer',
    desc: 'A visual progress bar timer.',
    href: '/timers/progress-timer',
    badgeColor: 'bg-[#FFF3E0] text-[#D84315] border-[#FFCCBC]',
    icon: 'hourglass',
  },
  {
    title: 'Lichen Timer',
    desc: 'A calm botanical forest-floor timer.',
    href: '/timers/lichen-timer',
    badgeColor: 'bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]',
    icon: 'trees',
  },
  {
    title: 'Candle Timer',
    desc: 'A cozy, fire-themed countdown.',
    href: '/timers/candle-timer',
    badgeColor: 'bg-[#FBE9E7] text-[#BF360C] border-[#FFCCBC]',
    icon: 'flame',
  },
  {
    title: 'Sensory Timers',
    desc: 'Calming nature and sensory visual timers.',
    href: '/timers/sensory-timers',
    badgeColor: 'bg-[#E8F5E9] text-[#1B5E20] border-[#C8E6C9]',
    icon: 'leaf',
  },
  {
    title: 'Snow Timer',
    desc: 'A scenic winter mountain countdown.',
    href: '/timers/snow-timer',
    badgeColor: 'bg-[#E0F2F1] text-[#00695C] border-[#B2DFDB]',
    icon: 'mountain',
  },
  {
    title: 'Coral Timer',
    desc: 'A living reef-growth visual timer.',
    href: '/timers/coral-timer',
    badgeColor: 'bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]',
    icon: 'sprout',
  },
  {
    title: 'Circular Timer',
    desc: 'A simple circular countdown.',
    href: '/timers/circular-timer',
    badgeColor: 'bg-[#FFF3E0] text-[#E65100] border-[#FFE0B2]',
    icon: 'circle',
  },
];

export default function ForestFireTimerPage() {
  const specificContent = getToolSpecificContent('forest-fire-timer');
  const faqs = specificContent ? specificContent.faqs : [];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Free Online Forest Fire Timer',
        url: 'https://WebCountDownTimer.com/timers/forest-fire-timer',
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'All',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        description:
          'A creative, nature-inspired countdown with a stylized spreading fire animation that visually shows the passage of time in an engaging way.',
      },
      {
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
            name: 'Timers',
            item: 'https://WebCountDownTimer.com/tools',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Forest Fire Timer',
            item: 'https://WebCountDownTimer.com/timers/forest-fire-timer',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.answer,
          },
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#FAF8F4] dark:bg-[#0F1412] text-[#0D2137] dark:text-[#F3F5F4] pb-20 transition-colors">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HERO BANNER */}
      <section className="relative overflow-hidden border-b border-[#EAE4D9] dark:border-[#242E28] bg-gradient-to-r from-[#FAF8F4] via-[#FBF7F0] to-[#F4E6D4] dark:from-[#121815] dark:via-[#161D19] dark:to-[#221A14]">
        <div className="pointer-events-none absolute inset-y-0 right-0 w-full lg:w-[50%] overflow-hidden opacity-90 dark:opacity-55 [mask-image:linear-gradient(to_right,transparent_0%,transparent_18%,rgba(0,0,0,0.55)_45%,black_75%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,transparent_18%,rgba(0,0,0,0.55)_45%,black_75%)]">
          <svg
            viewBox="0 0 800 320"
            className="w-full h-full object-cover"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <linearGradient id="heroForestSky" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FAF8F4" />
                <stop offset="35%" stopColor="#F5E6D3" />
                <stop offset="70%" stopColor="#A9C6D9" />
                <stop offset="100%" stopColor="#5F86A2" />
              </linearGradient>
              <linearGradient id="heroFireGlow" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#FF6D00" stopOpacity="0.9" />
                <stop offset="45%" stopColor="#FF9E00" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#FF9E00" stopOpacity="0" />
              </linearGradient>
            </defs>

            <rect
              width="800"
              height="320"
              fill="url(#heroForestSky)"
              className="dark:opacity-0"
            />
            <path
              d="M180,260 L310,95 L435,215 L565,65 L695,190 L775,115 L820,260 Z"
              fill="#7A9EB8"
              opacity="0.7"
            />
            <path
              d="M220,280 L380,145 L495,220 L635,125 L800,245 L800,320 L220,320 Z"
              fill="#4E738A"
              opacity="0.8"
            />
            <rect x="440" y="130" width="360" height="190" fill="url(#heroFireGlow)" />

            {[
              { x: 290, y: 270, s: 0.75, c: '#2E5A36' },
              { x: 335, y: 275, s: 0.9, c: '#244A2C' },
              { x: 385, y: 272, s: 1.05, c: '#2E5A36' },
              { x: 435, y: 276, s: 0.85, c: '#1E3F24' },
              { x: 480, y: 274, s: 0.95, c: '#295231' },
              { x: 525, y: 278, s: 0.8, c: '#3A281D' },
              { x: 575, y: 275, s: 1.0, c: '#4A2511' },
              { x: 630, y: 272, s: 1.1, c: '#3B1D0E' },
              { x: 685, y: 276, s: 0.95, c: '#2D150A' },
              { x: 740, y: 270, s: 1.18, c: '#241007' },
              { x: 780, y: 275, s: 0.9, c: '#241007' },
            ].map((t, idx) => (
              <g key={idx} transform={`translate(${t.x}, ${t.y}) scale(${t.s})`}>
                <rect x="-4" y="-18" width="8" height="22" fill="#2A1B12" />
                <polygon points="0,-115 -34,-65 34,-65" fill={t.c} />
                <polygon points="0,-90 -42,-38 42,-38" fill={t.c} />
                <polygon points="0,-64 -48,-12 48,-12" fill={t.c} />
              </g>
            ))}

            <path
              d="M450,285 Q490,262 525,276 T605,260 T690,255 T770,248 L800,255 L800,320 L450,320 Z"
              fill="#FF6D00"
              opacity="0.85"
            />
            <path
              d="M475,292 Q520,272 560,282 T650,268 T745,262 L800,270 L800,320 L475,320 Z"
              fill="#FFD54F"
              opacity="0.9"
            />
            <path
              d="M180,295 Q380,272 580,286 T800,282 L800,320 L180,320 Z"
              fill="#2B4228"
            />
          </svg>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-8">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-slate-400 mb-3"
          >
            <Link prefetch={false} href="/" className="hover:text-[#C84B0E] dark:hover:text-[#FB923C] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
            <Link prefetch={false}
              href="/tools"
              className="hover:text-[#C84B0E] dark:hover:text-[#FB923C] transition-colors"
            >
              Timers
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
            <span className="text-gray-900 dark:text-white font-medium">Forest Fire Timer</span>
          </nav>

          <div className="max-w-2xl">
            <div className="text-[11px] font-extrabold tracking-[0.14em] uppercase text-[#B5430A] dark:text-[#FB923C] mb-1.5">
              FOREST FIRE TIMER
            </div>
            <h1 className="text-3xl sm:text-[42px] font-bold font-serif text-[#0D2137] dark:text-[#F3F5F4] leading-tight mb-3">
              Free Online Forest Fire Timer
            </h1>
            <p className="text-base sm:text-[17px] text-[#374151] dark:text-slate-300 leading-relaxed mb-5">
              A creative, nature-inspired countdown with a spreading fire
              animation that visually shows the passage of time in an engaging
              way.
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2.5 text-xs font-semibold text-[#1F2937] dark:text-slate-200">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#FFF0E0] dark:bg-orange-950/60 flex items-center justify-center text-[#D84315] dark:text-orange-400">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                </span>
                <span>Nature-themed visual</span>
              </div>
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#1E4631] dark:text-[#6CC49B]" />
                <span>Customizable display</span>
              </div>
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-[#1E4631] dark:text-[#6CC49B]" />
                <span>Works on all devices</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1E4631] dark:text-[#6CC49B]" />
                <span>Free to use</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTAINER */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 space-y-10">
        <ForestFireTimerComponent initialMinutes={25} />

        {/* TOOL-SPECIFIC CONTENT (150-250 WORDS: USE CASES, HOW TO USE & 3 UNIQUE FAQS) + SIDEBAR */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-2">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white dark:bg-[#161C19] rounded-2xl p-6 sm:p-8 border border-[#EAE4D9] dark:border-[#28322C] shadow-xs">
              <ToolSpecificContentSection slug="forest-fire-timer" toolName="Forest Fire Timer" />
            </div>

            <div className="bg-[#F8EDD6] dark:bg-[#241E16] border border-[#E6D4B2] dark:border-[#3D3122] rounded-xl px-5 py-3.5 flex items-start gap-3">
              <Info className="w-5 h-5 text-[#A84308] dark:text-orange-400 shrink-0 mt-0.5" />
              <p className="text-xs sm:text-[13px] text-[#2B2118] dark:text-slate-200 leading-relaxed">
                <strong className="font-bold text-[#0D2137] dark:text-white">Important:</strong>{' '}
                This is a decorative visual timer for focus, learning and
                creative activities. It is not a wildfire prediction tool,
                fire-danger assessment or emergency-warning service.
              </p>
            </div>
          </div>

          <aside className="lg:col-span-4">
            <div className="bg-white dark:bg-[#161C19] rounded-2xl p-4 border border-[#EAE4D9] dark:border-[#28322C] shadow-xs">
              <h3 className="text-sm font-bold text-[#0D2137] dark:text-[#F3F5F4] mb-3 px-1">
                Related Tools
              </h3>
              <div className="space-y-2">
                {RELATED_TOOLS.map((tool) => (
                  <Link prefetch={false}
                    key={tool.title}
                    href={tool.href}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#FAF8F4] dark:hover:bg-[#1F2723] transition-colors group"
                  >
                    <div
                      className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${tool.badgeColor}`}
                    >
                      {tool.icon === 'clock' && <Clock className="w-5 h-5" />}
                      {tool.icon === 'hourglass' && <Hourglass className="w-5 h-5" />}
                      {tool.icon === 'trees' && <Trees className="w-5 h-5" />}
                      {tool.icon === 'flame' && <Flame className="w-5 h-5 fill-current" />}
                      {tool.icon === 'leaf' && <Leaf className="w-5 h-5" />}
                      {tool.icon === 'mountain' && <Mountain className="w-5 h-5" />}
                      {tool.icon === 'sprout' && <Sprout className="w-5 h-5" />}
                      {tool.icon === 'circle' && <CircleDot className="w-5 h-5" />}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#0D2137] dark:text-[#F3F5F4] group-hover:text-[#C84B0E] dark:group-hover:text-[#FB923C] transition-colors">
                        {tool.title}
                      </div>
                      <div className="text-[11px] text-gray-500 dark:text-slate-400 truncate">
                        {tool.desc}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}

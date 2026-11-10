import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  ChevronRight,
  SlidersHorizontal,
  Monitor,
  CheckCircle2,
  BookOpen,
  Gamepad2,
  Laptop,
  Palette,
  Users,
  Leaf,
  Lightbulb,
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

export const metadata: Metadata = {
  title: 'Free Online Forest Fire Timer | Spreading Fire Visual Countdown',
  description:
    'A creative, nature-inspired countdown with a stylized spreading fire animation that visually shows the passage of time for classroom activities, games, and study sessions.',
  alternates: {
    canonical: '/timers/forest-fire-timer',
  },
  openGraph: {
    title: 'Free Online Forest Fire Timer | Spreading Fire Visual Countdown',
    description:
      'A creative, nature-inspired countdown with a stylized spreading fire animation that visually shows the passage of time in an engaging way.',
    url: '/timers/forest-fire-timer',
    type: 'website',
  },
};

const POPULAR_USES = [
  {
    title: 'Classroom Activities',
    desc: 'Make timed learning fun.',
    icon: BookOpen,
  },
  {
    title: 'Games & Challenges',
    desc: 'Add a visual countdown to games.',
    icon: Gamepad2,
  },
  {
    title: 'Study Sessions',
    desc: 'Stay focused with a clear timer.',
    icon: Laptop,
  },
  {
    title: 'Creative Projects',
    desc: 'Use a themed timer for art, writing or design.',
    icon: Palette,
  },
  {
    title: 'Group Activities',
    desc: 'Keep everyone on the same schedule.',
    icon: Users,
  },
  {
    title: 'Themed Events',
    desc: 'Great for nature, forest or adventure themes.',
    icon: Leaf,
  },
];

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

const FAQS = [
  {
    q: 'Is the forest fire timer free to use?',
    a: 'Yes! Our Free Online Forest Fire Timer is 100% free with no sign-up, registration, or hidden fees required. You can use all forest themes, fire styles, fullscreen mode, and sound settings immediately.',
    col: 'left',
  },
  {
    q: 'Can I set a custom time?',
    a: 'Absolutely. You can click any quick preset (1, 3, 5, 10, or 25 minutes) or choose Custom to set your exact duration in minutes and seconds, or even count down to a specific End Time on the clock.',
    col: 'left',
  },
  {
    q: 'Can I change the forest theme?',
    a: 'Yes, you can switch between four stylized illustrated scenes: Classic Forest, Pine Valley, Autumn Woods, and Mountain Forest, as well as three distinct warm Fire Styles.',
    col: 'left',
  },
  {
    q: 'Does it work on mobile devices?',
    a: 'Yes. The forest fire countdown is fully responsive and runs smoothly across smartphones, tablets, classroom interactive whiteboards, laptops, and desktop monitors.',
    col: 'left',
  },
  {
    q: 'Is this a real forest fire or emergency alert?',
    a: 'No. This is an artistic, game-like decorative visual countdown timer designed for focus, classroom activities, and creative challenges. It is not a wildfire prediction tool, fire-danger assessment, or emergency-warning service.',
    col: 'right',
  },
  {
    q: 'Can I turn off the sound?',
    a: 'Yes. Simply toggle the Sound switch off in the control panel if you prefer a completely silent visual countdown for quiet classrooms, libraries, or study sessions.',
    col: 'right',
  },
  {
    q: 'Can I use it for classroom activities?',
    a: 'Yes! Teachers and facilitators frequently project the Forest Fire Timer in fullscreen mode for group challenges, reading sprints, science games, and timed classroom transitions.',
    col: 'right',
  },
  {
    q: 'What happens when the timer ends?',
    a: 'When the countdown reaches 00:00, the spreading warm ember glow completes its journey to 100% across the forest floor, the scene transitions to a calm completed state, and an optional gentle chime sounds.',
    col: 'right',
  },
];

export default function ForestFireTimerPage() {
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
            item: 'https://WebCountDownTimer.com/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Timers',
            item: 'https://WebCountDownTimer.com/timers',
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
        mainEntity: FAQS.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.a,
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
        {/* Right-side stylized illustrated forest & warm ember backdrop */}
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

            {/* Distant mountain peaks */}
            <path
              d="M180,260 L310,95 L435,215 L565,65 L695,190 L775,115 L820,260 Z"
              fill="#7A9EB8"
              opacity="0.7"
            />
            <path
              d="M310,95 L348,145 L312,135 L286,150 Z"
              fill="#EBF3F9"
              opacity="0.65"
            />
            <path
              d="M565,65 L610,128 L572,115 L535,132 Z"
              fill="#EBF3F9"
              opacity="0.7"
            />

            {/* Mid-distance mountain ridge */}
            <path
              d="M220,280 L380,145 L495,220 L635,125 L800,245 L800,320 L220,320 Z"
              fill="#4E738A"
              opacity="0.8"
            />

            {/* Warm sunset / ember glow rising on right side */}
            <rect x="440" y="130" width="360" height="190" fill="url(#heroFireGlow)" />

            {/* Pine tree silhouettes across the valley */}
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

            {/* Stylized warm flame ribbon along the right forest floor */}
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

            {/* Foreground ground */}
            <path
              d="M180,295 Q380,272 580,286 T800,282 L800,320 L180,320 Z"
              fill="#2B4228"
            />
          </svg>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-8">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-slate-400 mb-3"
          >
            <Link href="/" className="hover:text-[#C84B0E] dark:hover:text-[#FB923C] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
            <Link
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

            {/* Feature Badges */}
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
        {/* Interactive Forest Fire Timer Tool */}
        <ForestFireTimerComponent initialMinutes={25} />

        {/* POPULAR USES */}
        <section className="pt-1">
          <h2 className="text-xl font-bold font-serif text-[#0D2137] dark:text-[#F3F5F4] mb-1">
            Popular Uses
          </h2>
          <p className="text-xs text-gray-600 dark:text-slate-400 mb-4">
            A forest fire timer is great for many creative activities.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            {POPULAR_USES.map((use) => {
              const Icon = use.icon;
              return (
                <div
                  key={use.title}
                  className="bg-white dark:bg-[#161C19] rounded-xl p-3.5 border border-[#EAE4D9] dark:border-[#28322C] shadow-xs flex items-start gap-3 hover:border-[#D9CFC0] dark:hover:border-[#3A483F] transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#EAF4EC] dark:bg-[#1F352A] text-[#236B38] dark:text-[#6CC49B] flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#0D2137] dark:text-[#F3F5F4] leading-snug mb-0.5">
                      {use.title}
                    </div>
                    <div className="text-[11px] text-gray-500 dark:text-slate-400 leading-tight">
                      {use.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* THREE-COLUMN GUIDE & SIDEBARS */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-2">
          {/* LEFT SIDEBAR: On This Page + Quote Card */}
          <aside className="lg:col-span-3 space-y-5">
            <div className="bg-white dark:bg-[#161C19] rounded-2xl p-5 border border-[#EAE4D9] dark:border-[#28322C] shadow-xs">
              <h3 className="text-sm font-bold text-[#0D2137] dark:text-[#F3F5F4] mb-3">
                On This Page
              </h3>
              <ul className="space-y-2.5 text-xs font-medium text-[#374151] dark:text-slate-300">
                <li>
                  <a
                    href="#what-is"
                    className="flex items-start gap-2 hover:text-[#C84B0E] dark:hover:text-[#FB923C] transition-colors"
                  >
                    <span className="text-[#236B38] dark:text-[#6CC49B] mt-0.5">▶</span>
                    <span>What Is a Forest Fire Visual Timer?</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="flex items-start gap-2 hover:text-[#C84B0E] dark:hover:text-[#FB923C] transition-colors"
                  >
                    <span className="text-[#236B38] dark:text-[#6CC49B] mt-0.5">▶</span>
                    <span>How the Spreading Countdown Animation Works</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#how-to-use"
                    className="flex items-start gap-2 hover:text-[#C84B0E] dark:hover:text-[#FB923C] transition-colors"
                  >
                    <span className="text-[#236B38] dark:text-[#6CC49B] mt-0.5">▶</span>
                    <span>How to Use the Timer</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#activities-and-games"
                    className="flex items-start gap-2 hover:text-[#C84B0E] dark:hover:text-[#FB923C] transition-colors"
                  >
                    <span className="text-[#236B38] dark:text-[#6CC49B] mt-0.5">▶</span>
                    <span>Forest-Themed Countdown for Activities and Games</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#customize"
                    className="flex items-start gap-2 hover:text-[#C84B0E] dark:hover:text-[#FB923C] transition-colors"
                  >
                    <span className="text-[#236B38] dark:text-[#6CC49B] mt-0.5">▶</span>
                    <span>Customize the Visual Experience</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#faq"
                    className="flex items-start gap-2 hover:text-[#C84B0E] dark:hover:text-[#FB923C] transition-colors"
                  >
                    <span className="text-[#236B38] dark:text-[#6CC49B] mt-0.5">▶</span>
                    <span>Frequently Asked Questions</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Illustrated Quote Card */}
            <div className="bg-[#FAF5EB] dark:bg-[#19201C] rounded-2xl overflow-hidden border border-[#EAE4D9] dark:border-[#28322C] shadow-xs">
              <div className="h-36 relative overflow-hidden">
                <svg
                  viewBox="0 0 320 160"
                  className="w-full h-full object-cover"
                  preserveAspectRatio="xMidYMid slice"
                >
                  <defs>
                    <linearGradient
                      id="quoteSunsetGrad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#9C532B" />
                      <stop offset="50%" stopColor="#E68A3E" />
                      <stop offset="100%" stopColor="#FFD166" />
                    </linearGradient>
                  </defs>
                  <rect width="320" height="160" fill="url(#quoteSunsetGrad)" />
                  {/* Glowing sun */}
                  <circle
                    cx="160"
                    cy="108"
                    r="34"
                    fill="#FFF3B0"
                    opacity="0.85"
                  />
                  {/* Distant ridge */}
                  <path
                    d="M0,130 L75,92 L150,120 L235,88 L320,125 L320,160 L0,160 Z"
                    fill="#6E3518"
                    opacity="0.7"
                  />
                  {/* Pine silhouettes */}
                  {[20, 48, 80, 112, 205, 238, 270, 300].map((x, idx) => (
                    <g
                      key={idx}
                      transform={`translate(${x}, 145) scale(${
                        idx % 2 === 0 ? 0.55 : 0.45
                      })`}
                    >
                      <polygon points="0,-120 -36,-65 36,-65" fill="#2A1208" />
                      <polygon points="0,-90 -44,-35 44,-35" fill="#2A1208" />
                      <polygon points="0,-60 -52,0 52,0" fill="#2A1208" />
                    </g>
                  ))}
                  {/* Warm ember ribbon at base */}
                  <path
                    d="M0,145 Q90,136 160,144 T320,138 L320,160 L0,160 Z"
                    fill="#FF6D00"
                    opacity="0.75"
                  />
                  <rect y="148" width="320" height="12" fill="#240F06" />
                </svg>
              </div>
              <div className="p-5 text-center">
                <p className="font-serif italic text-[15px] text-[#1F2937] dark:text-slate-200 leading-relaxed mb-3">
                  “A creative, nature-inspired timer that brings a sense of
                  progress and excitement to your tasks.”
                </p>
                <div className="flex items-center justify-center gap-2 text-[#D84315] dark:text-orange-400">
                  <span className="h-px w-8 bg-[#E5D5C3] dark:bg-[#2F3B34]" />
                  <Flame className="w-5 h-5 fill-[#FF6D00] text-[#D84315] dark:text-orange-400" />
                  <span className="h-px w-8 bg-[#E5D5C3] dark:bg-[#2F3B34]" />
                </div>
              </div>
            </div>
          </aside>

          {/* CENTER + RIGHT COLUMNS WRAPPER */}
          <div className="lg:col-span-9 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-9 gap-6 items-start">
              {/* CENTER GUIDE CONTENT */}
              <article className="lg:col-span-6 space-y-6 text-[#1F2937] dark:text-slate-200">
                <div>
                  <div className="text-[11px] font-extrabold tracking-[0.14em] uppercase text-[#B5430A] dark:text-[#FB923C] mb-1">
                    A COMPLETE GUIDE
                  </div>
                  <h2
                    id="what-is"
                    className="text-2xl font-bold font-serif text-[#0D2137] dark:text-[#F3F5F4] mb-2.5 scroll-mt-20"
                  >
                    What Is a Forest Fire Visual Timer?
                  </h2>
                  <p className="text-sm text-[#374151] dark:text-slate-300 leading-relaxed">
                    A forest fire visual timer is a creative countdown timer
                    that uses a stylized, spreading fire animation in a forest
                    scene to show the passage of time. It gives you a clear,
                    visual sense of progress, making your activities more
                    engaging and focused.
                  </p>
                </div>

                <div>
                  <h2
                    id="how-it-works"
                    className="text-2xl font-bold font-serif text-[#0D2137] dark:text-[#F3F5F4] mb-2.5 scroll-mt-20"
                  >
                    How the Spreading Countdown Animation Works
                  </h2>
                  <p className="text-sm text-[#374151] dark:text-slate-300 leading-relaxed">
                    The timer starts with a calm forest scene. As time passes, a
                    warm, glowing area gradually spreads across the landscape.
                    The animation moves in a controlled and predictable way,
                    showing how much time has elapsed. When the countdown
                    reaches zero, the scene shifts to a completed state.
                  </p>
                </div>

                <div>
                  <h2
                    id="how-to-use"
                    className="text-2xl font-bold font-serif text-[#0D2137] dark:text-[#F3F5F4] mb-3 scroll-mt-20"
                  >
                    How to Use the Timer
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
                    <ol className="sm:col-span-7 space-y-2.5 text-sm text-[#374151] dark:text-slate-300">
                      {[
                        'Choose a preset time or enter a custom duration.',
                        'Adjust the animation intensity and other settings.',
                        'Click Start to begin the countdown.',
                        'Use Pause to temporarily stop the timer.',
                        'Click Reset to set a new time and start again.',
                      ].map((step, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-[#C84B0E] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <span className="leading-snug">{step}</span>
                        </li>
                      ))}
                    </ol>

                    {/* Tip Box */}
                    <div className="sm:col-span-5 bg-[#F7EEDB] dark:bg-[#241E16] border border-[#E8D8B9] dark:border-[#3D3122] rounded-xl p-4">
                      <div className="flex items-center gap-1.5 font-serif italic font-bold text-[#0D2137] dark:text-[#F3F5F4] text-base mb-1.5">
                        <Lightbulb className="w-4 h-4 text-[#D84315] dark:text-orange-400 shrink-0" />
                        <span>Tip</span>
                      </div>
                      <p className="text-xs text-[#374151] dark:text-slate-300 leading-relaxed">
                        Try different durations and animation settings to match
                        your activity, classroom or game.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h2
                    id="activities-and-games"
                    className="text-2xl font-bold font-serif text-[#0D2137] dark:text-[#F3F5F4] mb-2.5 scroll-mt-20"
                  >
                    Forest-Themed Countdown for Activities and Games
                  </h2>
                  <p className="text-sm text-[#374151] dark:text-slate-300 leading-relaxed">
                    This timer is perfect for classroom activities, study
                    sessions, creative projects and group games. The nature
                    theme keeps it fun and visually interesting while still
                    giving you a clear and reliable countdown.
                  </p>
                </div>

                <div>
                  <h2
                    id="customize"
                    className="text-2xl font-bold font-serif text-[#0D2137] dark:text-[#F3F5F4] mb-2.5 scroll-mt-20"
                  >
                    Customize the Visual Experience
                  </h2>
                  <p className="text-sm text-[#374151] dark:text-slate-300 leading-relaxed">
                    You can set a custom time, choose from different forest
                    themes, adjust the fire animation intensity, turn sound on
                    or off, and use fullscreen mode for a more immersive
                    experience.
                  </p>
                </div>
              </article>

              {/* RIGHT SIDEBAR: Related Tools */}
              <aside className="lg:col-span-3">
                <div className="bg-white dark:bg-[#161C19] rounded-2xl p-4 border border-[#EAE4D9] dark:border-[#28322C] shadow-xs">
                  <h3 className="text-sm font-bold text-[#0D2137] dark:text-[#F3F5F4] mb-3 px-1">
                    Related Tools
                  </h3>
                  <div className="space-y-2">
                    {RELATED_TOOLS.map((tool) => (
                      <Link
                        key={tool.title}
                        href={tool.href}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#FAF8F4] dark:hover:bg-[#1F2723] transition-colors group"
                      >
                        <div
                          className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${tool.badgeColor}`}
                        >
                          {tool.icon === 'clock' && (
                            <Clock className="w-5 h-5" />
                          )}
                          {tool.icon === 'hourglass' && (
                            <Hourglass className="w-5 h-5" />
                          )}
                          {tool.icon === 'trees' && (
                            <Trees className="w-5 h-5" />
                          )}
                          {tool.icon === 'flame' && (
                            <Flame className="w-5 h-5 fill-current" />
                          )}
                          {tool.icon === 'leaf' && <Leaf className="w-5 h-5" />}
                          {tool.icon === 'mountain' && (
                            <Mountain className="w-5 h-5" />
                          )}
                          {tool.icon === 'sprout' && (
                            <Sprout className="w-5 h-5" />
                          )}
                          {tool.icon === 'circle' && (
                            <CircleDot className="w-5 h-5" />
                          )}
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
            </div>

            {/* IMPORTANT DISCLAIMER BANNER */}
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
        </section>

        {/* FREQUENTLY ASKED QUESTIONS */}
        <section id="faq" className="pt-2 scroll-mt-20">
          <h2 className="text-2xl font-bold font-serif text-[#0D2137] dark:text-[#F3F5F4] mb-4">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2.5">
              {FAQS.filter((f) => f.col === 'left').map((faq) => (
                <details
                  key={faq.q}
                  className="group bg-white dark:bg-[#161C19] rounded-xl border border-[#EAE4D9] dark:border-[#28322C] px-4 py-3 shadow-xs"
                >
                  <summary className="flex items-center justify-between cursor-pointer list-none text-xs sm:text-sm font-semibold text-[#0D2137] dark:text-[#F3F5F4]">
                    <span>{faq.q}</span>
                    <span className="text-gray-500 dark:text-slate-400 font-bold text-base group-open:rotate-45 transition-transform">
                      +
                    </span>
                  </summary>
                  <p className="mt-2.5 text-xs text-gray-600 dark:text-slate-300 leading-relaxed border-t border-gray-100 dark:border-[#28322C] pt-2.5">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
            <div className="space-y-2.5">
              {FAQS.filter((f) => f.col === 'right').map((faq) => (
                <details
                  key={faq.q}
                  className="group bg-white dark:bg-[#161C19] rounded-xl border border-[#EAE4D9] dark:border-[#28322C] px-4 py-3 shadow-xs"
                >
                  <summary className="flex items-center justify-between cursor-pointer list-none text-xs sm:text-sm font-semibold text-[#0D2137] dark:text-[#F3F5F4]">
                    <span>{faq.q}</span>
                    <span className="text-gray-500 dark:text-slate-400 font-bold text-base group-open:rotate-45 transition-transform">
                      +
                    </span>
                  </summary>
                  <p className="mt-2.5 text-xs text-gray-600 dark:text-slate-300 leading-relaxed border-t border-gray-100 dark:border-[#28322C] pt-2.5">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

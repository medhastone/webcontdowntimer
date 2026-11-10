import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, GraduationCap } from 'lucide-react';
import ClassroomTimerDashboard from '@/components/tools/ClassroomTimerDashboard';

export const metadata: Metadata = {
  title: 'Classroom Timer for Teachers – WebCountDownTimer',
  description:
    'Keep your class focused, organized and on track with a simple visual timer. Perfect for lessons, activities, group work and breaks.',
  openGraph: {
    title: 'Classroom Timer for Teachers – WebCountDownTimer',
    description:
      'Keep your class focused, organized and on track with a simple visual timer. Perfect for lessons, activities, group work and breaks.',
  },
};

export default function ClassroomTimerPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 pb-12 transition-colors">
      {/* ================================================================= */}
      {/* FULL-WIDTH HERO BANNER WITH INTEGRATED CHALKBOARD SCENE           */}
      {/* ================================================================= */}
      <div className="relative w-full bg-gradient-to-r from-[#F1F5F9] via-[#F8FAFC] to-[#F1F5F9] dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 border-b border-slate-200/80 dark:border-slate-800 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 relative">
          {/* Left Content: Breadcrumbs + Icon Badge + Headline */}
          <div className="relative z-10 max-w-2xl space-y-4">
            {/* Breadcrumb Navigation */}
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400"
            >
              <Link
                href="/"
                className="hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-colors"
              >
                <Home className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                <span className="sr-only">Home</span>
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <Link
                href="/tools"
                className="hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                For Communities
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-600 dark:text-slate-300">Teachers</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-800 dark:text-white font-semibold">Classroom Timer</span>
            </nav>

            {/* Icon Badge & H1 Title */}
            <div className="flex items-center gap-4 sm:gap-5 pt-1">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#E8F0FE] dark:bg-blue-950/80 border border-blue-200/60 dark:border-blue-800/60 flex items-center justify-center shrink-0 text-[#2563EB] shadow-2xs">
                <GraduationCap className="w-9 h-9 sm:w-11 sm:h-11 stroke-[1.8]" />
              </div>

              <div>
                <h1 className="text-2xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                  Classroom Timer <span className="text-[#2563EB]">for Teachers</span>
                </h1>
                <p className="mt-1.5 text-xs sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                  Keep your class focused, organized and on track with a simple visual timer.
                  Perfect for lessons, activities, group work and breaks.
                </p>
              </div>
            </div>
          </div>

          {/* Right Classroom Chalkboard Scene (matching mockup) */}
          <div className="hidden lg:block absolute top-0 right-0 bottom-0 w-[440px] pointer-events-none select-none overflow-hidden">
            {/* Soft left-to-right fade mask */}
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#F8FAFC] dark:from-slate-900 to-transparent z-20" />

            {/* Classroom Wall & Chalkboard SVG Scene */}
            <svg
              className="w-full h-full object-cover"
              viewBox="0 0 440 170"
              fill="none"
              preserveAspectRatio="xMidYMid slice"
            >
              {/* Warm Classroom Wall Backdrop */}
              <rect width="440" height="170" fill="#E2E8F0" opacity="0.45" />

              {/* Soft Indoor Plant on Left of Chalkboard */}
              <ellipse cx="75" cy="95" rx="18" ry="26" fill="#4ADE80" opacity="0.35" />
              <path d="M72 135 C65 110, 52 92, 48 75 C62 82, 70 102, 74 135 Z" fill="#15803D" opacity="0.65" />
              <path d="M76 135 C76 105, 84 82, 92 65 C94 88, 84 112, 78 135 Z" fill="#166534" opacity="0.75" />
              <path d="M78 135 C86 115, 98 98, 105 88 C102 106, 90 122, 80 135 Z" fill="#22C55E" opacity="0.6" />

              {/* Chalkboard Wooden Frame */}
              <rect x="135" y="8" width="285" height="132" rx="4" fill="#8B6F4E" />
              {/* Dark Green Chalkboard Surface */}
              <rect x="142" y="14" width="271" height="120" rx="2" fill="#1E3A2F" />
              <rect x="142" y="14" width="271" height="120" rx="2" fill="url(#chalkGlow)" opacity="0.4" />

              {/* Chalk Text: "Better Focus Brighter Learning" */}
              <text
                x="185"
                y="46"
                fill="#E2F1E8"
                opacity="0.88"
                fontFamily="cursive, Georgia, serif"
                fontSize="21"
                fontStyle="italic"
                transform="rotate(-4 185 46)"
              >
                Better
              </text>
              <text
                x="192"
                y="72"
                fill="#E2F1E8"
                opacity="0.88"
                fontFamily="cursive, Georgia, serif"
                fontSize="21"
                fontStyle="italic"
                transform="rotate(-3 192 72)"
              >
                Focus
              </text>
              <text
                x="186"
                y="98"
                fill="#D1FAE5"
                opacity="0.9"
                fontFamily="cursive, Georgia, serif"
                fontSize="20"
                fontStyle="italic"
                transform="rotate(-3 186 98)"
              >
                Brighter
              </text>
              <text
                x="202"
                y="122"
                fill="#D1FAE5"
                opacity="0.9"
                fontFamily="cursive, Georgia, serif"
                fontSize="21"
                fontStyle="italic"
                transform="rotate(-2 202 122)"
              >
                Learning
              </text>

              {/* Chalk Smiley Face */}
              <circle
                cx="348"
                cy="66"
                r="18"
                stroke="#E2F1E8"
                strokeWidth="2"
                strokeDasharray="3 1"
                opacity="0.75"
              />
              <circle cx="342" cy="61" r="2" fill="#E2F1E8" opacity="0.8" />
              <circle cx="354" cy="61" r="2" fill="#E2F1E8" opacity="0.8" />
              <path
                d="M340 70 Q348 78 356 70"
                stroke="#E2F1E8"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
                opacity="0.8"
              />

              {/* Stacked Books on Desk */}
              <rect x="132" y="142" width="66" height="9" rx="2" fill="#0F766E" />
              <rect x="135" y="144" width="60" height="5" rx="1" fill="#F8FAFC" />
              <rect x="136" y="133" width="58" height="9" rx="2" fill="#B45309" />
              <rect x="139" y="135" width="52" height="5" rx="1" fill="#FEF3C7" />
              <rect x="140" y="125" width="50" height="8" rx="2" fill="#1D4ED8" />

              {/* Pencil Holder & Colored Pencils */}
              <rect x="108" y="114" width="3" height="18" rx="1" transform="rotate(-12 108 114)" fill="#F59E0B" />
              <rect x="114" y="111" width="3" height="20" rx="1" fill="#3B82F6" />
              <rect x="120" y="113" width="3" height="18" rx="1" transform="rotate(10 120 113)" fill="#EF4444" />
              <rect x="106" y="126" width="20" height="24" rx="2" fill="#1E293B" />

              {/* Classroom Wooden Desk Foreground */}
              <rect x="45" y="151" width="395" height="19" rx="2" fill="#D5C4A1" />
              <rect x="45" y="151" width="395" height="4" fill="#E6D7B8" />

              <defs>
                <radialGradient id="chalkGlow" cx="0.5" cy="0.5" r="0.5">
                  <stop offset="0%" stopColor="#34D399" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#064E3B" stopOpacity="0" />
                </radialGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* MAIN INTERACTIVE DASHBOARD CONTAINER                              */}
      {/* ================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <ClassroomTimerDashboard />
      </div>
    </main>
  );
}

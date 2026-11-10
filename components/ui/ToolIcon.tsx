import React from 'react';
import {
  Clock,
  Timer,
  Hourglass,
  Watch,
  Flame,
  TrainFront,
  Snowflake,
  Sun,
  MoonStar,
  Heart,
  Sparkles,
  Droplets,
  Rainbow,
  Palette,
  Boxes,
  Gamepad2,
  Compass,
  Disc,
  Activity,
  Tv,
  Presentation,
  Mic,
  Trophy,
  Scale,
  Calendar,
  Video,
  BookOpen,
  Globe,
  ArrowRightLeft,
  Users,
  Dumbbell,
  Zap,
  GraduationCap,
  Shuffle,
  Volume2,
  Calculator,
  BellRing,
  Code2,
  Brain,
  LayoutGrid,
  Sprout,
  Shell,
  Orbit,
  FlaskConical,
  SplitSquareVertical,
  Gauge,
  Target,
  GlassWater,
  TimerReset,
  ListOrdered,
  CalendarCheck,
  BarChart3,
  PieChart,
  Gem,
  RefreshCw,
  TrendingUp,
   type LucideIcon,
} from 'lucide-react';

export type ToolTier = 'trending' | 'hot' | 'new';

export interface ToolIconMeta {
  icon: LucideIcon;
  accentIcon?: LucideIcon;
  bgClass: string;
  iconClass: string;
  ringClass: string;
  dotColor: string;
}

/**
 * Unique, realistic icon & color theme mapping for every tool and category in WebCountDownTimer.
 * Uses explicit dark:from-*, dark:via-*, and dark:to-* stops plus high-contrast dark:text-*-300
 * and luminous dark:border-*-500/40 rings so icons are 100% crisp and visible in both light and dark modes.
 */
const TOOL_ICON_MAP: Record<string, ToolIconMeta> = {
  // Visual, Sensory & Novelty Timers
  'sensory-timers': {
    icon: Sparkles,
    accentIcon: Droplets,
    bgClass:
      'bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-100 dark:from-teal-950 dark:via-emerald-950 dark:to-cyan-900/90',
    iconClass: 'text-teal-700 dark:text-teal-300',
    ringClass: 'border-teal-200 dark:border-teal-500/40',
    dotColor: '#0D9488',
  },
  'flip-clock': {
    icon: Clock,
    accentIcon: SplitSquareVertical,
    bgClass:
      'bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 dark:from-slate-800 dark:via-zinc-800 dark:to-slate-900',
    iconClass: 'text-amber-800 dark:text-amber-300',
    ringClass: 'border-amber-200 dark:border-amber-500/45',
    dotColor: '#F59E0B',
  },
  'flip-timer': {
    icon: SplitSquareVertical,
    bgClass:
      'bg-gradient-to-br from-rose-50 via-orange-50 to-amber-100 dark:from-rose-950 dark:via-slate-900 dark:to-amber-950',
    iconClass: 'text-rose-700 dark:text-amber-300',
    ringClass: 'border-rose-200 dark:border-amber-500/45',
    dotColor: '#E11D48',
  },
  'train-timer': {
    icon: TrainFront,
    bgClass:
      'bg-gradient-to-br from-emerald-50 via-teal-50 to-amber-100 dark:from-emerald-950 dark:via-teal-950 dark:to-emerald-900/90',
    iconClass: 'text-emerald-800 dark:text-amber-300',
    ringClass: 'border-emerald-200 dark:border-emerald-500/40',
    dotColor: '#059669',
  },
  'forest-fire-timer': {
    icon: Flame,
    bgClass:
      'bg-gradient-to-br from-orange-50 via-amber-100 to-red-100 dark:from-orange-950 dark:via-red-950 dark:to-amber-900/90',
    iconClass: 'text-orange-600 dark:text-orange-300',
    ringClass: 'border-orange-200 dark:border-orange-500/45',
    dotColor: '#EA580C',
  },
  'spinner-timer': {
    icon: Compass,
    accentIcon: Disc,
    bgClass:
      'bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-100 dark:from-indigo-950 dark:via-blue-950 dark:to-cyan-900/90',
    iconClass: 'text-indigo-600 dark:text-sky-300',
    ringClass: 'border-indigo-200 dark:border-indigo-500/40',
    dotColor: '#4F46E5',
  },
  'lava-lamp-timer': {
    icon: FlaskConical,
    accentIcon: Flame,
    bgClass:
      'bg-gradient-to-br from-fuchsia-50 via-pink-100 to-purple-100 dark:from-fuchsia-950 dark:via-pink-950 dark:to-purple-900/90',
    iconClass: 'text-fuchsia-700 dark:text-fuchsia-300',
    ringClass: 'border-fuchsia-200 dark:border-fuchsia-500/45',
    dotColor: '#C026D3',
  },
  'galaxy-timer': {
    icon: Orbit,
    accentIcon: Sparkles,
    bgClass:
      'bg-gradient-to-br from-violet-100 via-indigo-100 to-purple-200 dark:from-violet-950 dark:via-indigo-950 dark:to-purple-900/90',
    iconClass: 'text-violet-700 dark:text-violet-300',
    ringClass: 'border-violet-200 dark:border-violet-500/45',
    dotColor: '#7C3AED',
  },
  'snow-timer': {
    icon: Snowflake,
    bgClass:
      'bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 dark:from-sky-950 dark:via-blue-950 dark:to-indigo-900/90',
    iconClass: 'text-sky-700 dark:text-sky-300',
    ringClass: 'border-sky-200 dark:border-sky-500/40',
    dotColor: '#0284C7',
  },
  'frost-timer': {
    icon: Gem,
    accentIcon: Snowflake,
    bgClass:
      'bg-gradient-to-br from-cyan-50 via-sky-100 to-blue-100 dark:from-cyan-950 dark:via-sky-950 dark:to-blue-900/90',
    iconClass: 'text-cyan-700 dark:text-cyan-300',
    ringClass: 'border-cyan-200 dark:border-cyan-500/40',
    dotColor: '#0891B2',
  },
  'lichen-timer': {
    icon: Sprout,
    bgClass:
      'bg-gradient-to-br from-lime-50 via-emerald-50 to-green-100 dark:from-lime-950 dark:via-emerald-950 dark:to-green-900/90',
    iconClass: 'text-emerald-700 dark:text-lime-300',
    ringClass: 'border-emerald-200 dark:border-lime-500/40',
    dotColor: '#16A34A',
  },
  'coral-timer': {
    icon: Shell,
    bgClass:
      'bg-gradient-to-br from-rose-50 via-orange-50 to-teal-100 dark:from-rose-950 dark:via-orange-950 dark:to-teal-900/90',
    iconClass: 'text-rose-600 dark:text-rose-300',
    ringClass: 'border-rose-200 dark:border-rose-500/40',
    dotColor: '#F43F5E',
  },
  'bubble-timer': {
    icon: Droplets,
    bgClass:
      'bg-gradient-to-br from-cyan-50 via-teal-50 to-sky-100 dark:from-cyan-950 dark:via-teal-950 dark:to-sky-900/90',
    iconClass: 'text-teal-700 dark:text-cyan-300',
    ringClass: 'border-teal-200 dark:border-cyan-500/40',
    dotColor: '#0D9488',
  },
  'sun-timer': {
    icon: Sun,
    bgClass:
      'bg-gradient-to-br from-amber-50 via-yellow-100 to-orange-100 dark:from-amber-950 dark:via-yellow-950 dark:to-orange-900/90',
    iconClass: 'text-amber-600 dark:text-amber-300',
    ringClass: 'border-amber-200 dark:border-amber-500/45',
    dotColor: '#D97706',
  },
  'moon-timer': {
    icon: MoonStar,
    bgClass:
      'bg-gradient-to-br from-indigo-50 via-slate-100 to-violet-100 dark:from-indigo-950 dark:via-slate-900 dark:to-violet-900/90',
    iconClass: 'text-indigo-700 dark:text-indigo-300',
    ringClass: 'border-indigo-200 dark:border-indigo-500/45',
    dotColor: '#4F46E5',
  },
  'heart-timer': {
    icon: Heart,
    bgClass:
      'bg-gradient-to-br from-rose-50 via-pink-100 to-red-100 dark:from-rose-950 dark:via-pink-950 dark:to-red-900/90',
    iconClass: 'text-rose-600 dark:text-rose-300',
    ringClass: 'border-rose-200 dark:border-rose-500/45',
    dotColor: '#E11D48',
  },
  'picture-reveal-timer': {
    icon: LayoutGrid,
    bgClass:
      'bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-100 dark:from-teal-950 dark:via-emerald-950 dark:to-cyan-900/90',
    iconClass: 'text-teal-700 dark:text-teal-300',
    ringClass: 'border-teal-200 dark:border-teal-500/40',
    dotColor: '#0D9488',
  },
  'aesthetic-timer': {
    icon: Palette,
    bgClass:
      'bg-gradient-to-br from-purple-50 via-pink-50 to-amber-100 dark:from-purple-950 dark:via-pink-950 dark:to-fuchsia-900/90',
    iconClass: 'text-purple-700 dark:text-purple-300',
    ringClass: 'border-purple-200 dark:border-purple-500/45',
    dotColor: '#9333EA',
  },
  'candle-timer': {
    icon: Flame,
    bgClass:
      'bg-gradient-to-br from-amber-50 via-orange-100 to-yellow-100 dark:from-amber-950 dark:via-orange-950 dark:to-yellow-900/90',
    iconClass: 'text-amber-700 dark:text-amber-300',
    ringClass: 'border-amber-200 dark:border-amber-500/45',
    dotColor: '#D97706',
  },
  'blocks-timer': {
    icon: Boxes,
    bgClass:
      'bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-100 dark:from-blue-950 dark:via-indigo-950 dark:to-violet-900/90',
    iconClass: 'text-blue-700 dark:text-blue-300',
    ringClass: 'border-blue-200 dark:border-blue-500/45',
    dotColor: '#2563EB',
  },
  'hourglass-timer': {
    icon: Hourglass,
    bgClass:
      'bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-100 dark:from-amber-950 dark:via-yellow-950 dark:to-orange-900/90',
    iconClass: 'text-amber-800 dark:text-amber-300',
    ringClass: 'border-amber-200 dark:border-amber-500/45',
    dotColor: '#B45309',
  },
  'rainbow-timer': {
    icon: Rainbow,
    bgClass:
      'bg-gradient-to-br from-rose-50 via-amber-50 to-sky-100 dark:from-rose-950 dark:via-amber-950 dark:to-sky-900/90',
    iconClass: 'text-pink-600 dark:text-amber-300',
    ringClass: 'border-pink-200 dark:border-pink-500/45',
    dotColor: '#DB2777',
  },
  'liquid-timer': {
    icon: GlassWater,
    accentIcon: Droplets,
    bgClass:
      'bg-gradient-to-br from-sky-50 via-cyan-100 to-blue-100 dark:from-sky-950 dark:via-cyan-950 dark:to-blue-900/90',
    iconClass: 'text-sky-700 dark:text-sky-300',
    ringClass: 'border-sky-200 dark:border-sky-500/45',
    dotColor: '#0284C7',
  },
  'sand-timer': {
    icon: Timer,
    accentIcon: Hourglass,
    bgClass:
      'bg-gradient-to-br from-orange-50 via-amber-100 to-yellow-100 dark:from-orange-950 dark:via-amber-950 dark:to-yellow-900/90',
    iconClass: 'text-orange-800 dark:text-amber-300',
    ringClass: 'border-orange-200 dark:border-orange-500/45',
    dotColor: '#C2410C',
  },
  'pixel-timer': {
    icon: Gamepad2,
    bgClass:
      'bg-gradient-to-br from-emerald-50 via-green-100 to-teal-100 dark:from-emerald-950 dark:via-green-950 dark:to-teal-900/90',
    iconClass: 'text-emerald-700 dark:text-emerald-300',
    ringClass: 'border-emerald-200 dark:border-emerald-500/45',
    dotColor: '#059669',
  },
  'progress-timer': {
    icon: Activity,
    bgClass:
      'bg-gradient-to-br from-blue-50 via-sky-100 to-cyan-100 dark:from-blue-950 dark:via-sky-950 dark:to-cyan-900/90',
    iconClass: 'text-blue-700 dark:text-sky-300',
    ringClass: 'border-blue-200 dark:border-sky-500/45',
    dotColor: '#2563EB',
  },
  'rings-timer': {
    icon: Target,
    bgClass:
      'bg-gradient-to-br from-teal-50 via-emerald-100 to-green-100 dark:from-teal-950 dark:via-emerald-950 dark:to-green-900/90',
    iconClass: 'text-teal-700 dark:text-teal-300',
    ringClass: 'border-teal-200 dark:border-teal-500/45',
    dotColor: '#0D9488',
  },
  'radial-timer': {
    icon: Gauge,
    bgClass:
      'bg-gradient-to-br from-indigo-50 via-blue-100 to-violet-100 dark:from-indigo-950 dark:via-blue-950 dark:to-violet-900/90',
    iconClass: 'text-indigo-700 dark:text-indigo-300',
    ringClass: 'border-indigo-200 dark:border-indigo-500/45',
    dotColor: '#4F46E5',
  },
  'circular-timer': {
    icon: RefreshCw,
    bgClass:
      'bg-gradient-to-br from-emerald-50 via-teal-100 to-cyan-100 dark:from-emerald-950 dark:via-teal-950 dark:to-cyan-900/90',
    iconClass: 'text-emerald-700 dark:text-emerald-300',
    ringClass: 'border-emerald-200 dark:border-emerald-500/45',
    dotColor: '#10B981',
  },

  // Core Everyday Timers & Stopwatches
  'countdown-timer': {
    icon: TimerReset,
    bgClass:
      'bg-gradient-to-br from-emerald-50 via-green-100 to-teal-100 dark:from-emerald-950 dark:via-green-950 dark:to-teal-900/90',
    iconClass: 'text-emerald-800 dark:text-emerald-300',
    ringClass: 'border-emerald-200 dark:border-emerald-500/45',
    dotColor: '#15803D',
  },
  'visual-timer': {
    icon: PieChart,
    bgClass:
      'bg-gradient-to-br from-orange-50 via-amber-100 to-rose-100 dark:from-orange-950 dark:via-amber-950 dark:to-rose-900/90',
    iconClass: 'text-orange-700 dark:text-orange-300',
    ringClass: 'border-orange-200 dark:border-orange-500/45',
    dotColor: '#EA580C',
  },
  stopwatch: {
    icon: Watch,
    bgClass:
      'bg-gradient-to-br from-sky-50 via-blue-100 to-indigo-100 dark:from-sky-950 dark:via-blue-950 dark:to-indigo-900/90',
    iconClass: 'text-blue-700 dark:text-sky-300',
    ringClass: 'border-blue-200 dark:border-sky-500/45',
    dotColor: '#1D4ED8',
  },
  'multi-stopwatch': {
    icon: ListOrdered,
    bgClass:
      'bg-gradient-to-br from-violet-50 via-purple-100 to-indigo-100 dark:from-violet-950 dark:via-purple-950 dark:to-indigo-900/90',
    iconClass: 'text-violet-700 dark:text-violet-300',
    ringClass: 'border-violet-200 dark:border-violet-500/45',
    dotColor: '#6D28D9',
  },
  'pomodoro-timer': {
    icon: Brain,
    accentIcon: Flame,
    bgClass:
      'bg-gradient-to-br from-rose-50 via-red-100 to-orange-100 dark:from-rose-950 dark:via-red-950 dark:to-orange-900/90',
    iconClass: 'text-rose-700 dark:text-rose-300',
    ringClass: 'border-rose-200 dark:border-rose-500/45',
    dotColor: '#E11D48',
  },

  // Stage, Events & Presentations
  'stage-timer': {
    icon: Tv,
    bgClass:
      'bg-gradient-to-br from-purple-50 via-violet-100 to-indigo-100 dark:from-purple-950 dark:via-violet-950 dark:to-indigo-900/90',
    iconClass: 'text-purple-700 dark:text-purple-300',
    ringClass: 'border-purple-200 dark:border-purple-500/45',
    dotColor: '#7E22CE',
  },
  'presentation-timer': {
    icon: Presentation,
    bgClass:
      'bg-gradient-to-br from-blue-50 via-indigo-100 to-sky-100 dark:from-blue-950 dark:via-indigo-950 dark:to-sky-900/90',
    iconClass: 'text-indigo-700 dark:text-indigo-300',
    ringClass: 'border-indigo-200 dark:border-indigo-500/45',
    dotColor: '#4338CA',
  },
  'speaker-timer': {
    icon: Mic,
    bgClass:
      'bg-gradient-to-br from-amber-50 via-orange-100 to-yellow-100 dark:from-amber-950 dark:via-orange-950 dark:to-yellow-900/90',
    iconClass: 'text-amber-800 dark:text-amber-300',
    ringClass: 'border-amber-200 dark:border-amber-500/45',
    dotColor: '#B45309',
  },
  'toastmasters-timer': {
    icon: Trophy,
    bgClass:
      'bg-gradient-to-br from-yellow-50 via-amber-100 to-emerald-100 dark:from-yellow-950 dark:via-amber-950 dark:to-emerald-900/90',
    iconClass: 'text-amber-700 dark:text-amber-300',
    ringClass: 'border-amber-200 dark:border-amber-500/45',
    dotColor: '#D97706',
  },
  'debate-timer': {
    icon: Scale,
    bgClass:
      'bg-gradient-to-br from-slate-100 via-indigo-50 to-blue-100 dark:from-slate-900 dark:via-indigo-950 dark:to-blue-900/90',
    iconClass: 'text-slate-800 dark:text-indigo-300',
    ringClass: 'border-slate-300 dark:border-indigo-500/45',
    dotColor: '#334155',
  },
  'event-countdown-timer': {
    icon: Calendar,
    bgClass:
      'bg-gradient-to-br from-rose-50 via-pink-100 to-purple-100 dark:from-rose-950 dark:via-pink-950 dark:to-purple-900/90',
    iconClass: 'text-rose-700 dark:text-rose-300',
    ringClass: 'border-rose-200 dark:border-rose-500/45',
    dotColor: '#BE123C',
  },
  'webinar-timer': {
    icon: Video,
    bgClass:
      'bg-gradient-to-br from-cyan-50 via-sky-100 to-blue-100 dark:from-cyan-950 dark:via-sky-950 dark:to-blue-900/90',
    iconClass: 'text-sky-700 dark:text-sky-300',
    ringClass: 'border-sky-200 dark:border-sky-500/45',
    dotColor: '#0369A1',
  },
  'sermon-timer': {
    icon: BookOpen,
    bgClass:
      'bg-gradient-to-br from-stone-100 via-amber-50 to-orange-100 dark:from-stone-900 dark:via-amber-950 dark:to-orange-900/90',
    iconClass: 'text-amber-900 dark:text-amber-300',
    ringClass: 'border-amber-200 dark:border-amber-500/45',
    dotColor: '#92400E',
  },

  // World Time & Global Teams
  'world-clock': {
    icon: Globe,
    bgClass:
      'bg-gradient-to-br from-cyan-50 via-teal-100 to-emerald-100 dark:from-cyan-950 dark:via-teal-950 dark:to-emerald-900/90',
    iconClass: 'text-teal-800 dark:text-teal-300',
    ringClass: 'border-teal-200 dark:border-teal-500/45',
    dotColor: '#0F766E',
  },
  'time-zone-converter': {
    icon: ArrowRightLeft,
    bgClass:
      'bg-gradient-to-br from-blue-50 via-cyan-100 to-teal-100 dark:from-blue-950 dark:via-cyan-950 dark:to-teal-900/90',
    iconClass: 'text-blue-700 dark:text-cyan-300',
    ringClass: 'border-blue-200 dark:border-cyan-500/45',
    dotColor: '#0284C7',
  },
  'international-meeting-planner': {
    icon: CalendarCheck,
    bgClass:
      'bg-gradient-to-br from-indigo-50 via-blue-100 to-cyan-100 dark:from-indigo-950 dark:via-blue-950 dark:to-cyan-900/90',
    iconClass: 'text-indigo-700 dark:text-indigo-300',
    ringClass: 'border-indigo-200 dark:border-indigo-500/45',
    dotColor: '#4338CA',
  },

  // Fitness & Training
  'interval-timer': {
    icon: Dumbbell,
    bgClass:
      'bg-gradient-to-br from-orange-50 via-amber-100 to-red-100 dark:from-orange-950 dark:via-amber-950 dark:to-red-900/90',
    iconClass: 'text-orange-700 dark:text-orange-300',
    ringClass: 'border-orange-200 dark:border-orange-500/45',
    dotColor: '#EA580C',
  },
  'tabata-timer': {
    icon: Zap,
    accentIcon: Flame,
    bgClass:
      'bg-gradient-to-br from-red-50 via-orange-100 to-amber-100 dark:from-red-950 dark:via-orange-950 dark:to-amber-900/90',
    iconClass: 'text-red-700 dark:text-red-300',
    ringClass: 'border-red-200 dark:border-red-500/45',
    dotColor: '#DC2626',
  },

  // Classroom & Education
  'classroom-timer': {
    icon: GraduationCap,
    bgClass:
      'bg-gradient-to-br from-emerald-50 via-teal-100 to-green-100 dark:from-emerald-950 dark:via-teal-950 dark:to-green-900/90',
    iconClass: 'text-emerald-800 dark:text-emerald-300',
    ringClass: 'border-emerald-200 dark:border-emerald-500/45',
    dotColor: '#15803D',
  },
  'random-name-picker': {
    icon: Shuffle,
    bgClass:
      'bg-gradient-to-br from-fuchsia-50 via-purple-100 to-indigo-100 dark:from-fuchsia-950 dark:via-purple-950 dark:to-indigo-900/90',
    iconClass: 'text-purple-700 dark:text-purple-300',
    ringClass: 'border-purple-200 dark:border-purple-500/45',
    dotColor: '#9333EA',
  },
  'classroom-noise-meter': {
    icon: Volume2,
    bgClass:
      'bg-gradient-to-br from-amber-50 via-yellow-100 to-lime-100 dark:from-amber-950 dark:via-yellow-950 dark:to-lime-900/90',
    iconClass: 'text-amber-800 dark:text-amber-300',
    ringClass: 'border-amber-200 dark:border-amber-500/45',
    dotColor: '#CA8A04',
  },

  // Calculators & Widgets
  'time-duration-calculator': {
    icon: Calculator,
    bgClass:
      'bg-gradient-to-br from-slate-100 via-emerald-50 to-teal-100 dark:from-slate-900 dark:via-emerald-950 dark:to-teal-900/90',
    iconClass: 'text-emerald-800 dark:text-emerald-300',
    ringClass: 'border-emerald-200 dark:border-emerald-500/45',
    dotColor: '#0F766E',
  },
  'online-alarm-clock': {
    icon: BellRing,
    bgClass:
      'bg-gradient-to-br from-rose-50 via-orange-100 to-amber-100 dark:from-rose-950 dark:via-orange-950 dark:to-amber-900/90',
    iconClass: 'text-rose-700 dark:text-rose-300',
    ringClass: 'border-rose-200 dark:border-rose-500/45',
    dotColor: '#E11D48',
  },
  'embed-widget': {
    icon: Code2,
    bgClass:
      'bg-gradient-to-br from-slate-100 via-zinc-100 to-indigo-100 dark:from-slate-900 dark:via-zinc-900 dark:to-indigo-900/90',
    iconClass: 'text-indigo-700 dark:text-indigo-300',
    ringClass: 'border-indigo-200 dark:border-indigo-500/45',
    dotColor: '#4F46E5',
  },
  'time-tracker': {
    icon: BarChart3,
    bgClass:
      'bg-gradient-to-br from-teal-50 via-cyan-100 to-blue-100 dark:from-teal-950 dark:via-cyan-950 dark:to-blue-900/90',
    iconClass: 'text-teal-800 dark:text-teal-300',
    ringClass: 'border-teal-200 dark:border-teal-500/45',
    dotColor: '#0D9488',
  },
  'remote-teams': {
    icon: Users,
    bgClass:
      'bg-gradient-to-br from-sky-50 via-blue-100 to-indigo-100 dark:from-sky-950 dark:via-blue-950 dark:to-indigo-900/90',
    iconClass: 'text-blue-700 dark:text-sky-300',
    ringClass: 'border-blue-200 dark:border-sky-500/45',
    dotColor: '#2563EB',
  },
};

export function normalizeToolKey(hrefOrName: string): string {
  const lower = hrefOrName.toLowerCase().trim();

  // Direct match
  if (TOOL_ICON_MAP[lower]) return lower;

  // Extract slug from href if it's a path
  if (lower.startsWith('/')) {
    const parts = lower.split('/').filter(Boolean);
    const last = parts[parts.length - 1] || '';
    if (TOOL_ICON_MAP[last]) return last;
  }

  // Name-based resolution for tools that share a route or have display titles
  if (lower.includes('sensory')) return 'sensory-timers';
  if (lower.includes('flip clock')) return 'flip-clock';
  if (lower.includes('forest fire')) return 'forest-fire-timer';
  if (lower.includes('train')) return 'train-timer';
  if (lower.includes('flip timer')) return 'flip-timer';
  if (lower.includes('spinner')) return 'spinner-timer';
  if (lower.includes('lava lamp')) return 'lava-lamp-timer';
  if (lower.includes('galaxy')) return 'galaxy-timer';
  if (lower.includes('snow')) return 'snow-timer';
  if (lower.includes('frost')) return 'frost-timer';
  if (lower.includes('lichen')) return 'lichen-timer';
  if (lower.includes('coral')) return 'coral-timer';
  if (lower.includes('bubble')) return 'bubble-timer';
  if (lower.includes('sun')) return 'sun-timer';
  if (lower.includes('moon')) return 'moon-timer';
  if (lower.includes('heart')) return 'heart-timer';
  if (lower.includes('picture reveal')) return 'picture-reveal-timer';
  if (lower.includes('aesthetic')) return 'aesthetic-timer';
  if (lower.includes('candle')) return 'candle-timer';
  if (lower.includes('blocks')) return 'blocks-timer';
  if (lower.includes('hourglass')) return 'hourglass-timer';
  if (lower.includes('rainbow')) return 'rainbow-timer';
  if (lower.includes('liquid')) return 'liquid-timer';
  if (lower.includes('sand')) return 'sand-timer';
  if (lower.includes('pixel')) return 'pixel-timer';
  if (lower.includes('progress')) return 'progress-timer';
  if (lower.includes('rings')) return 'rings-timer';
  if (lower.includes('radial')) return 'radial-timer';
  if (lower.includes('circular')) return 'circular-timer';
  if (lower.includes('tabata')) return 'tabata-timer';
  if (lower.includes('interval') || lower.includes('fitness')) return 'interval-timer';
  if (lower.includes('multi-stopwatch') || lower.includes('multi stopwatch')) return 'multi-stopwatch';
  if (lower.includes('stopwatch')) return 'stopwatch';
  if (lower.includes('pomodoro') || lower.includes('productivity')) return 'pomodoro-timer';
  if (lower.includes('visual timer')) return 'visual-timer';
  if (lower.includes('stage') || lower.includes('event')) return 'stage-timer';
  if (lower.includes('presentation')) return 'presentation-timer';
  if (lower.includes('speaker')) return 'speaker-timer';
  if (lower.includes('toastmasters')) return 'toastmasters-timer';
  if (lower.includes('debate')) return 'debate-timer';
  if (lower.includes('webinar')) return 'webinar-timer';
  if (lower.includes('sermon')) return 'sermon-timer';
  if (lower.includes('world clock') || lower.includes('world')) return 'world-clock';
  if (lower.includes('converter') || lower.includes('time-zone') || lower.includes('time zone')) return 'time-zone-converter';
  if (lower.includes('meeting planner')) return 'international-meeting-planner';
  if (lower.includes('random name')) return 'random-name-picker';
  if (lower.includes('noise') || lower.includes('sound level')) return 'classroom-noise-meter';
  if (lower.includes('classroom') || lower.includes('education')) return 'classroom-timer';
  if (lower.includes('tracker')) return 'time-tracker';
  if (lower.includes('calculator') || lower.includes('duration')) return 'time-duration-calculator';
  if (lower.includes('alarm')) return 'online-alarm-clock';
  if (lower.includes('embed') || lower.includes('widget')) return 'embed-widget';
  if (lower.includes('remote')) return 'remote-teams';
  if (lower.includes('countdown')) return 'countdown-timer';

  return 'countdown-timer';
}

export function getToolIconMeta(hrefOrName: string): ToolIconMeta {
  const key = normalizeToolKey(hrefOrName);
  return (
    TOOL_ICON_MAP[key] || {
      icon: Clock,
      bgClass:
        'bg-gradient-to-br from-emerald-50 via-teal-50 to-teal-100 dark:from-emerald-950 dark:via-teal-950 dark:to-teal-900/90',
      iconClass: 'text-emerald-800 dark:text-emerald-300',
      ringClass: 'border-emerald-200 dark:border-emerald-500/45',
      dotColor: '#365C4B',
    }
  );
}

interface ToolIconBadgeProps {
  tool: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

export function ToolIconBadge({ tool, size = 'md', className = '' }: ToolIconBadgeProps) {
  const meta = getToolIconMeta(tool);
  const PrimaryIcon = meta.icon;
  const AccentIcon = meta.accentIcon;

  const containerSize =
    size === 'xs'
      ? 'w-7 h-7 rounded-lg'
      : size === 'sm'
      ? 'w-9 h-9 rounded-xl'
      : size === 'lg'
      ? 'w-14 h-14 rounded-2xl'
      : 'w-11 h-11 rounded-xl';

  const iconSize =
    size === 'xs'
      ? 'w-3.5 h-3.5'
      : size === 'sm'
      ? 'w-4 h-4'
      : size === 'lg'
      ? 'w-7 h-7'
      : 'w-5 h-5';

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 border shadow-2xs transition-transform duration-200 group-hover:scale-105 ${containerSize} ${meta.bgClass} ${meta.ringClass} ${meta.iconClass} ${className}`}
    >
      <PrimaryIcon className={`${iconSize} ${meta.iconClass} stroke-[2.2] shrink-0`} />
      {AccentIcon && size !== 'xs' && (
        <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 flex items-center justify-center shadow-2xs">
          <AccentIcon className="w-2.5 h-2.5 text-amber-500 dark:text-amber-300 stroke-[2.2]" />
        </span>
      )}
    </div>
  );
}

export function ToolTierTag({ tier }: { tier: ToolTier }) {
  if (tier === 'hot') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300">
        <Flame className="w-3 h-3 text-rose-600 dark:text-rose-400 fill-rose-500/20" />
        <span>Hot</span>
      </span>
    );
  }
  if (tier === 'trending') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
        <TrendingUp className="w-3 h-3 text-amber-600 dark:text-amber-400" />
        <span>Trending</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
      <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
      <span>New</span>
    </span>
  );
}

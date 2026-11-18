'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  ArrowRight,
  Clock,
  Timer,
  Tv,
  Presentation,
  Globe,
  ArrowLeftRight,
  Users,
  TimerReset,
  Leaf,
  MessageSquare,
  GraduationCap,
  Code2,
  ChevronDown,
  X,
  Hourglass,
  Dumbbell,
  Briefcase,
  Check,
  Mic,
  Scale,
  Bell,
  Calendar,
  Calculator,
  ChefHat,
  Coffee,
  BookOpen,
  Eye,
  HeartPulse,
  Wind,
  Trophy,
  Shuffle,
  Volume2,
  Grid,
  Sparkles,
  Droplets,
  Palette,
  Flame,
  TrendingUp,
} from 'lucide-react';
import { ToolIconBadge, ToolTierTag, type ToolTier } from '@/components/ui/ToolIcon';

const NEW_TOOL_IDS = new Set([
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

const TRENDING_TOOL_IDS = new Set([
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

function resolveDirectoryToolTier(id: string, isPopular?: boolean): ToolTier {
  if (NEW_TOOL_IDS.has(id)) return 'new';
  if (TRENDING_TOOL_IDS.has(id)) return 'trending';
  if (isPopular) return 'hot';
  return 'trending';
}

interface ToolItem {
  id: string;
  name: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBgClass: string;
  categories: string[];
  keywords: string[];
  isPopular?: boolean;
  priority: number;
}

const TOOLS_DIRECTORY: ToolItem[] = [
  {
    id: 'sensory-timers',
    name: 'Sensory Visual Timers',
    description:
      'Curated collection of calm, low-distraction visual countdown timers—compare Sand, Liquid, Rainbow, Bubble, Frost, Snow, Lichen & Moon styles.',
    href: '/timers/sensory-timers',
    icon: Leaf,
    iconBgClass:
      'bg-emerald-50 dark:bg-emerald-950/40 text-[#1A5D34] dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/60',
    categories: ['Timers & Stopwatches', 'Education & Classroom', 'Productivity & Study', 'Fitness & Wellness'],
    keywords: ['sensory timers', 'calming visual timers', 'sensory countdown timers', 'sensory visual timers', 'low motion timer'],
    isPopular: true,
    priority: 1,
  },
  {
    id: 'flip-clock',
    name: 'Flip Clock',
    description:
      'Realistic retro split-flap clock with Live Clock, Countdown & Stopwatch modes, 12/24-hour format, timezone selector, and Dark & Light themes.',
    href: '/timers/flip-clock',
    icon: Clock,
    iconBgClass:
      'bg-emerald-50 dark:bg-emerald-950/40 text-[#156B2C] dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/60',
    categories: ['Timers & Stopwatches', 'World Time & Zones', 'Productivity & Study', 'Stage & Presentation'],
    keywords: ['flip clock', 'online flip clock', 'retro digital clock', 'flip clock timer', 'free online flip clock', 'split-flap clock'],
    isPopular: true,
    priority: 1,
  },
  {
    id: 'forest-fire-timer',
    name: 'Forest Fire Timer',
    description:
      'Creative, nature-inspired countdown with a stylized spreading warm ember and flame animation across Classic, Pine Valley, Autumn & Mountain forests.',
    href: '/timers/forest-fire-timer',
    icon: Flame,
    iconBgClass:
      'bg-orange-50 dark:bg-orange-950/40 text-[#C84B0E] dark:text-orange-300 border border-orange-100 dark:border-orange-900/60',
    categories: ['Timers & Stopwatches', 'Education & Classroom', 'Productivity & Study', 'Stage & Presentation'],
    keywords: ['forest fire timer', 'spreading fire visual timer', 'fire countdown', 'free online forest fire timer', 'nature visual timer'],
    isPopular: true,
    priority: 1,
  },
  {
    id: 'train-timer',
    name: 'Train Timer',
    description:
      'Railway station departure-board countdown timer with split-flap digits, custom session names, station themes & moving train route progress bar.',
    href: '/timers/train-timer',
    icon: Calendar,
    iconBgClass:
      'bg-emerald-50 dark:bg-emerald-950/40 text-[#124E35] dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/60',
    categories: ['Timers & Stopwatches', 'Education & Classroom', 'Productivity & Study', 'Stage & Presentation'],
    keywords: ['train timer', 'train countdown timer', 'departure board timer', 'free online train timer', 'railway station timer'],
    isPopular: true,
    priority: 1,
  },
  {
    id: 'flip-timer',
    name: 'Flip Timer',
    description:
      'Retro mechanical split-flap countdown timer with 3D flipping number cards, Classic Black, Retro Cream, Industrial & Modern Dark themes.',
    href: '/timers/flip-timer',
    icon: Calendar,
    iconBgClass:
      'bg-rose-50 dark:bg-rose-950/40 text-[#A91D22] dark:text-rose-300 border border-rose-100 dark:border-rose-900/60',
    categories: ['Timers & Stopwatches', 'Education & Classroom', 'Productivity & Study', 'Stage & Presentation'],
    keywords: ['flip timer', 'retro flip countdown', 'split-flap timer', 'free online flip timer', 'mechanical flip timer', 'desk flip timer'],
    isPopular: true,
    priority: 1,
  },
  {
    id: 'spinner-timer',
    name: 'Spinner Timer',
    description: 'Clear and interactive spinning-wheel countdown timer with circular progress segments, clockwise/counterclockwise pointer rotation, and 6 vibrant themes.',
    href: '/timers/spinner-timer',
    icon: Timer,
    iconBgClass:
      'bg-emerald-50 dark:bg-emerald-950/40 text-[#187A35] dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/60',
    categories: ['Timers & Stopwatches', 'Education & Classroom', 'Productivity & Study', 'Fitness & Wellness'],
    keywords: ['spinner timer', 'spinning countdown timer', 'rotating visual timer', 'free online spinner timer', 'wheel countdown timer', 'classroom game timer'],
    isPopular: true,
    priority: 1,
  },
  {
    id: 'lava-lamp-timer',
    name: 'Lava Lamp Timer',
    description: 'Retro and relaxing lava lamp visual countdown with rising and merging wax blobs in Retro Amber, Deep Blue, Neon Pink & Aqua Glow themes.',
    href: '/timers/lava-lamp-timer',
    icon: Sparkles,
    iconBgClass:
      'bg-fuchsia-50 dark:bg-fuchsia-950/40 text-[#6F1653] dark:text-fuchsia-300 border border-fuchsia-100 dark:border-fuchsia-900/60',
    categories: ['Timers & Stopwatches', 'Education & Classroom', 'Productivity & Study', 'Fitness & Wellness'],
    keywords: ['lava lamp timer', 'retro lava lamp countdown', 'liquid motion timer', 'free online lava lamp timer', 'wax lamp timer'],
    isPopular: true,
    priority: 1,
  },
  {
    id: 'galaxy-timer',
    name: 'Galaxy Timer',
    description: 'Stunning space-inspired starfield and spiral galaxy visual countdown with Spiral Galaxy, Nebula Cloud, Starfield & Andromeda Style themes.',
    href: '/timers/galaxy-timer',
    icon: Sparkles,
    iconBgClass:
      'bg-purple-50 dark:bg-purple-950/40 text-[#471688] dark:text-purple-300 border border-purple-100 dark:border-purple-900/60',
    categories: ['Timers & Stopwatches', 'Education & Classroom', 'Productivity & Study', 'Fitness & Wellness'],
    keywords: ['galaxy timer', 'starfield countdown', 'space visual timer', 'cosmic timer', 'nebula timer'],
    isPopular: true,
    priority: 1,
  },
  {
    id: 'snow-timer',
    name: 'Snow Timer',
    description: 'Calming snowfall visual countdown with accumulating winter snowdrifts and Winter Cabin, Snowy Forest, Mountain Snow & Calm Snowfall themes.',
    href: '/timers/snow-timer',
    icon: Sparkles,
    iconBgClass:
      'bg-sky-50 dark:bg-sky-950/40 text-[#184B7A] dark:text-sky-300 border border-sky-100 dark:border-sky-900/60',
    categories: ['Timers & Stopwatches', 'Education & Classroom', 'Productivity & Study', 'Fitness & Wellness'],
    keywords: ['snow timer', 'falling snow countdown', 'snow visual timer', 'winter timer'],
    isPopular: true,
    priority: 1,
  },
  {
    id: 'frost-timer',
    name: 'Frost Timer',
    description: 'Calming frosted-glass visual countdown with delicate ice crystal patterns, Classic Frost, Icy Blue, Winter Morning & Frosted Glass themes.',
    href: '/timers/frost-timer',
    icon: Sparkles,
    iconBgClass:
      'bg-sky-50 dark:bg-sky-950/40 text-[#0968B8] dark:text-sky-400 border border-sky-100 dark:border-sky-900/60',
    categories: ['Timers & Stopwatches', 'Education & Classroom', 'Productivity & Study', 'Fitness & Mindfulness'],
    keywords: ['frost timer', 'ice visual timer', 'frost countdown timer', 'frosted glass timer', 'ice crystal countdown'],
    isPopular: true,
    priority: 1,
  },
  {
    id: 'lichen-timer',
    name: 'Lichen Timer',
    description: 'Nature-inspired organic lichen growth visual countdown over stone and bark surfaces with Forest Rock, Tree Bark, Coastal Stone & Autumn Lichen themes.',
    href: '/timers/lichen-timer',
    icon: Leaf,
    iconBgClass:
      'bg-emerald-50 dark:bg-emerald-950/40 text-[#2E5A36] dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/60',
    categories: ['Timers & Stopwatches', 'Education & Classroom', 'Productivity & Study', 'Fitness & Mindfulness'],
    keywords: ['lichen timer', 'organic visual timer', 'nature-inspired countdown', 'moss timer', 'forest stone timer'],
    isPopular: true,
    priority: 1,
  },
  {
    id: 'coral-timer',
    name: 'Coral Timer',
    description: 'Relaxing coral growth visual countdown with Tropical Coral, Deep Ocean, Colorful Reef & Minimal Coral themes.',
    href: '/timers/coral-timer',
    icon: Leaf,
    iconBgClass:
      'bg-rose-50 dark:bg-rose-950/40 text-[#F35B4F] dark:text-rose-400 border border-rose-100 dark:border-rose-900/60',
    categories: ['Timers & Stopwatches', 'Education & Classroom', 'Productivity & Study', 'Fitness & Mindfulness'],
    keywords: ['coral timer', 'growing coral visual timer', 'ocean visual countdown', 'underwater timer'],
    isPopular: true,
    priority: 1,
  },
  {
    id: 'bubble-timer',
    name: 'Bubble Timer',
    description: 'Calming floating bubble visual countdown with Ocean Blue, Seafoam Green, Pastel Dreams & Clear Glass themes.',
    href: '/timers/bubble-timer',
    icon: Droplets,
    iconBgClass:
      'bg-sky-50 dark:bg-sky-950/40 text-[#0277CC] dark:text-sky-400 border border-sky-100 dark:border-sky-900/60',
    categories: ['Timers & Stopwatches', 'Education & Classroom', 'Productivity & Study', 'Fitness & Mindfulness'],
    keywords: ['bubble timer', 'bubble visual countdown', 'calming bubble timer', 'underwater bubbles'],
    isPopular: true,
    priority: 1,
  },
  {
    id: 'sun-timer',
    name: 'Sun Timer',
    description: 'Warm sun-arc visual countdown with Morning, Midday, Sunset & Warm Neutral sky themes.',
    href: '/timers/sun-timer',
    icon: Sparkles,
    iconBgClass:
      'bg-amber-50 dark:bg-amber-950/40 text-[#E65F16] dark:text-amber-400 border border-amber-100 dark:border-amber-900/60',
    categories: ['Timers & Stopwatches', 'Education & Classroom', 'Productivity & Study', 'Cooking & Everyday'],
    keywords: ['sun timer', 'sun visual countdown', 'sunrise style timer', 'morning routine timer'],
    isPopular: true,
    priority: 1,
  },
  {
    id: 'moon-timer',
    name: 'Moon Timer',
    description: 'Calming night-sky lunar visual countdown with Classic Moon, Crescent Moon, Blue Moon & Warm Moon styles.',
    href: '/timers/moon-timer',
    icon: Sparkles,
    iconBgClass:
      'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/60',
    categories: ['Timers & Stopwatches', 'Productivity & Study', 'Fitness & Mindfulness', 'Cooking & Everyday'],
    keywords: ['moon timer', 'moon countdown', 'calming moon visual timer', 'evening routine timer'],
    isPopular: true,
    priority: 1,
  },
  {
    id: 'heart-timer',
    name: 'Heart Timer',
    description: 'Balanced heart-shaped visual countdown with Muted Rose, Berry, Ivory & Soft Red themes.',
    href: '/timers/heart-timer',
    icon: HeartPulse,
    iconBgClass:
      'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/60',
    categories: ['Timers & Stopwatches', 'Education & Classroom', 'Productivity & Study', 'Fitness & Mindfulness'],
    keywords: ['heart timer', 'heart shaped visual timer', 'heart countdown', 'valentine games'],
    isPopular: true,
    priority: 1,
  },
  {
    id: 'picture-reveal-timer',
    name: 'Picture Reveal Timer',
    description: 'Interactive hidden-picture tile reveal countdown for classrooms, guessing games, and group activities.',
    href: '/timers/picture-reveal-timer',
    icon: Grid,
    iconBgClass:
      'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/60',
    categories: ['Timers & Stopwatches', 'Education & Classroom', 'Stage & Presentation'],
    keywords: ['picture reveal timer', 'photo reveal countdown', 'hidden picture timer', 'classroom guessing game'],
    isPopular: true,
    priority: 1,
  },
  {
    id: 'aesthetic-timer',
    name: 'Aesthetic Timer',
    description: 'Refined visual countdown with 8 curated themes including Minimal Ivory, Warm Sunset, Forest Green & Dark Academia.',
    href: '/timers/aesthetic-timer',
    icon: Palette,
    iconBgClass:
      'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-900/60',
    categories: ['Timers & Stopwatches', 'Productivity & Study', 'Fitness & Mindfulness'],
    keywords: ['aesthetic timer', 'beautiful online timer', 'aesthetic visual countdown', 'study desk timer'],
    isPopular: true,
    priority: 1,
  },
  {
    id: 'candle-timer',
    name: 'Candle Timer',
    description: 'Peaceful visual candle countdown timer with Ivory, Amber, Forest Green & Charcoal wax themes and 4 flame styles.',
    href: '/timers/candle-timer',
    icon: Sparkles,
    iconBgClass:
      'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-900/60',
    categories: ['Timers & Stopwatches', 'Productivity & Study', 'Fitness & Mindfulness', 'Cooking & Everyday'],
    keywords: ['candle timer', 'candle countdown timer', 'visual candle timer', 'reading timer', 'journaling', 'meditation'],
    isPopular: true,
    priority: 1,
  },
  {
    id: 'blocks-timer',
    name: 'Blocks Timer',
    description: 'Visual 3D stacked-block countdown timer with Wooden, Colored, Stone & Minimal block styles and adjustable block count.',
    href: '/timers/blocks-timer',
    icon: Clock,
    iconBgClass:
      'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/60',
    categories: ['Timers & Stopwatches', 'Education & Classroom', 'Productivity & Study', 'Cooking & Everyday'],
    keywords: ['blocks timer', 'block countdown timer', 'visual block timer', 'stacked blocks', 'classroom challenges', 'game turns'],
    isPopular: true,
    priority: 1,
  },
  {
    id: 'pixel-timer',
    name: 'Pixel Timer',
    description: 'Fun and retro pixel-art countdown timer with Retro Arcade, 8-bit Color, Monochrome & Minimal Grid styles and adjustable pixel density.',
    href: '/timers/pixel-timer',
    icon: Clock,
    iconBgClass:
      'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/60',
    categories: ['Timers & Stopwatches', 'Education & Classroom', 'Productivity & Study', 'Cooking & Everyday'],
    keywords: ['pixel timer', 'pixel countdown timer', 'retro visual timer', '8-bit timer', 'gaming breaks', 'study sessions'],
    isPopular: true,
    priority: 1,
  },
  {
    id: 'progress-timer',
    name: 'Progress Timer',
    description: 'Simple and flexible progress bar timer with Horizontal, Vertical, Segmented & Thin Line styles, task label & warning alerts.',
    href: '/timers/progress-timer',
    icon: Clock,
    iconBgClass:
      'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/60',
    categories: ['Timers & Stopwatches', 'Education & Classroom', 'Productivity & Study', 'Stage & Presentation'],
    keywords: ['progress timer', 'visual progress bar timer', 'countdown progress bar', 'horizontal timer', 'presentations', 'meetings'],
    isPopular: true,
    priority: 1,
  },
  {
    id: 'rings-timer',
    name: 'Rings Timer',
    description: 'Beautiful multi-ring countdown timer with concentric progress rings, 4 ring styles & custom colors.',
    href: '/timers/rings-timer',
    icon: Clock,
    iconBgClass:
      'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/60',
    categories: ['Timers & Stopwatches', 'Education & Classroom', 'Productivity & Study', 'Stage & Presentation'],
    keywords: ['rings timer', 'ring countdown timer', 'multiple ring visual timer', 'concentric ring timer', 'multi-stage tasks'],
    isPopular: true,
    priority: 1,
  },
  {
    id: 'radial-timer',
    name: 'Radial Timer',
    description: 'Unique radial countdown timer with Sunburst, Dots, Blocks & Gradient Rays styles, color themes, and adjustable segment count.',
    href: '/timers/radial-timer',
    icon: Timer,
    iconBgClass:
      'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/60',
    categories: ['Timers & Stopwatches', 'Education & Classroom', 'Productivity & Study', 'Stage & Presentation'],
    keywords: ['radial timer', 'radial countdown timer', 'radial visual timer', 'sunburst timer', 'spoke timer', 'study', 'group activities'],
    isPopular: true,
    priority: 1,
  },
  {
    id: 'circular-timer',
    name: 'Circular Timer',
    description: 'Simple and visual circle countdown timer with customizable colors, direction & low-time warnings.',
    href: '/timers/circular-timer',
    icon: Clock,
    iconBgClass:
      'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/60',
    categories: ['Timers & Stopwatches', 'Education & Classroom', 'Productivity & Study', 'Stage & Presentation'],
    keywords: ['circular timer', 'circle countdown timer', 'visual countdown circle', 'pie timer', 'classroom', 'presentation'],
    isPopular: true,
    priority: 1,
  },
  {
    id: 'hourglass-timer',
    name: 'Hourglass Timer',
    description: 'Classic wooden-framed hourglass countdown with realistic falling sand animation & interactive Flip button.',
    href: '/timers/hourglass-timer',
    icon: Hourglass,
    iconBgClass:
      'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-900/60',
    categories: ['Timers & Stopwatches', 'Education & Classroom', 'Productivity & Study', 'Cooking & Everyday'],
    keywords: ['hourglass timer', 'online hourglass', 'digital hourglass countdown', 'sand clock', 'flip hourglass', 'board games'],
    isPopular: true,
    priority: 1,
  },
  {
    id: 'rainbow-timer',
    name: 'Rainbow Timer',
    description: 'Colorful visual countdown timer with 4 rainbow styles, 6 color themes & fullscreen display.',
    href: '/timers/rainbow-timer',
    icon: Palette,
    iconBgClass:
      'bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 border border-pink-100 dark:border-pink-900/60',
    categories: ['Timers & Stopwatches', 'Education & Classroom', 'Productivity & Study', 'Cooking & Everyday'],
    keywords: ['rainbow timer', 'colorful visual timer', 'rainbow countdown timer', 'kids timer', 'classroom', 'sensory timer'],
    isPopular: true,
    priority: 1,
  },
  {
    id: 'liquid-timer',
    name: 'Liquid Timer',
    description: 'Smooth liquid countdown timer with realistic draining glass container, rising bubbles & 6 color styles.',
    href: '/timers/liquid-timer',
    icon: Droplets,
    iconBgClass:
      'bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-900/60',
    categories: ['Timers & Stopwatches', 'Education & Classroom', 'Productivity & Study', 'Cooking & Everyday'],
    keywords: ['liquid timer', 'liquid countdown timer', 'online liquid visual timer', 'water timer', 'sensory timer', 'bubbles', 'classroom'],
    isPopular: true,
    priority: 1,
  },
  {
    id: 'sand-timer',
    name: 'Sand Timer',
    description: 'Realistic digital hourglass with falling golden sand animation, 1–15 min presets & custom duration.',
    href: '/timers/sand-timer',
    icon: Hourglass,
    iconBgClass:
      'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/60',
    categories: ['Timers & Stopwatches', 'Education & Classroom', 'Productivity & Study', 'Cooking & Everyday'],
    keywords: ['sand timer', 'online sand timer', 'digital sand timer', 'hourglass', 'board games', 'classroom'],
    isPopular: true,
    priority: 1,
  },
  {
    id: 'visual-timer',
    name: 'Visual Timer',
    description: '6 visual countdown modes: Circular, Linear, Hourglass, Traffic Light, Rainbow & Sand.',
    href: '/visual-timer',
    icon: Hourglass,
    iconBgClass:
      'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/60',
    categories: ['Timers & Stopwatches', 'Education & Classroom', 'Productivity & Study'],
    keywords: ['visual timer', 'hourglass', 'traffic light', 'rainbow', 'classroom', 'adhd', 'kids'],
    isPopular: true,
    priority: 1,
  },
  {
    id: 'countdown-timer',
    name: 'Countdown Timer',
    description: 'Set a duration and start a countdown for any purpose.',
    href: '/countdown-timer',
    icon: Clock,
    iconBgClass:
      'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/60',
    categories: ['Timers & Stopwatches', 'Productivity & Study', 'Education & Classroom'],
    keywords: ['countdown', 'timer', 'minutes', 'seconds', 'alarm', 'clock'],
    isPopular: true,
    priority: 2,
  },
  {
    id: 'stopwatch',
    name: 'Stopwatch',
    description: 'Measure elapsed time and laps with precision.',
    href: '/stopwatch',
    icon: Timer,
    iconBgClass:
      'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/60',
    categories: ['Timers & Stopwatches', 'Fitness & Wellness', 'Productivity & Study'],
    keywords: ['stopwatch', 'laps', 'splits', 'elapsed', 'measure', 'running'],
    isPopular: true,
    priority: 3,
  },
  {
    id: 'multi-stopwatch',
    name: 'Multi-Stopwatch',
    description: 'Track multiple participants simultaneously with Relay Mode and CSV export.',
    href: '/multi-stopwatch',
    icon: Users,
    iconBgClass:
      'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/60',
    categories: ['Timers & Stopwatches', 'Fitness & Wellness', 'Education & Classroom'],
    keywords: ['multi stopwatch', 'multiple', 'relay', 'lanes', 'runners', 'race', 'csv'],
    isPopular: true,
    priority: 4,
  },
  {
    id: 'stage-timer',
    name: 'Stage Timer',
    description: 'Control presentation timing for events and live shows with remote viewer sync.',
    href: '/stage-timer',
    icon: Tv,
    iconBgClass:
      'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/60',
    categories: ['Stage & Presentation', 'Timers & Stopwatches'],
    keywords: ['stage', 'event', 'conference', 'keynote', 'show', 'production', 'speaker', 'qr'],
    isPopular: true,
    priority: 5,
  },
  {
    id: 'presentation-timer',
    name: 'Presentation Timer',
    description: 'Stay within your speaking time with visual and audio alerts.',
    href: '/presentation-timer',
    icon: Presentation,
    iconBgClass:
      'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-100 dark:border-orange-900/60',
    categories: ['Stage & Presentation', 'Productivity & Study', 'Education & Classroom'],
    keywords: ['presentation', 'slides', 'pitch', 'talk', 'speaking', 'deck'],
    isPopular: true,
    priority: 6,
  },
  {
    id: 'world-clock',
    name: 'World Clock',
    description: 'Check time in cities and countries around the world.',
    href: '/world-clock',
    icon: Globe,
    iconBgClass:
      'bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-900/60',
    categories: ['World Clock & Time Zones'],
    keywords: ['world clock', 'cities', 'international', 'country', 'local time', 'utc', 'gmt'],
    isPopular: true,
    priority: 7,
  },
  {
    id: 'time-zone-converter',
    name: 'Time-Zone Converter',
    description: 'Convert local times accurately between different time zones.',
    href: '/time-zone-converter',
    icon: ArrowLeftRight,
    iconBgClass:
      'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/60',
    categories: ['World Clock & Time Zones', 'Time Calculators'],
    keywords: ['converter', 'time zone', 'timezone', 'dst', 'offset', 'compare'],
    isPopular: true,
    priority: 8,
  },
  {
    id: 'meeting-planner',
    name: 'Meeting Planner',
    description: 'Find overlapping working hours and build schedules for global teams.',
    href: '/meeting-planner',
    icon: Users,
    iconBgClass:
      'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-100 dark:border-orange-900/60',
    categories: ['World Clock & Time Zones', 'Productivity & Study', 'Stage & Presentation'],
    keywords: ['meeting', 'planner', 'schedule', 'agenda', 'overlap', 'team', 'summit', 'session'],
    isPopular: false,
    priority: 9,
  },
  {
    id: 'interval-timer',
    name: 'Interval Timer',
    description: 'Configure work and rest rounds for training or productivity.',
    href: '/interval-timer',
    icon: TimerReset,
    iconBgClass:
      'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/60',
    categories: ['Fitness & Wellness', 'Timers & Stopwatches', 'Productivity & Study'],
    keywords: ['interval', 'hiit', 'tabata', 'workout', 'rounds', 'rest', 'fitness', 'gym'],
    isPopular: false,
    priority: 10,
  },
  {
    id: 'pomodoro-timer',
    name: 'Pomodoro Timer',
    description: 'Plan focus and break sessions using the Pomodoro technique.',
    href: '/pomodoro-timer',
    icon: Leaf,
    iconBgClass:
      'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/60',
    categories: ['Productivity & Study', 'Timers & Stopwatches', 'Education & Classroom'],
    keywords: ['pomodoro', 'focus', 'study', 'break', '25 min', 'productivity'],
    isPopular: false,
    priority: 11,
  },
  {
    id: 'classroom-timer',
    name: 'Classroom Timer',
    description: 'Display a visual activity countdown for classrooms and education.',
    href: '/classroom-timer',
    icon: GraduationCap,
    iconBgClass:
      'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/60',
    categories: ['Education & Classroom', 'Timers & Stopwatches'],
    keywords: ['classroom', 'teacher', 'school', 'students', 'lesson', 'quiz', 'group work'],
    isPopular: false,
    priority: 12,
  },
  {
    id: 'random-name-picker',
    name: 'Random Name Picker',
    description: 'Fair Fisher-Yates student and raffle selector with winner removal and history.',
    href: '/random-name-picker',
    icon: Shuffle,
    iconBgClass:
      'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/60',
    categories: ['Randomizers & Group Activities', 'Education & Classroom'],
    keywords: ['random name', 'picker', 'student selector', 'wheel', 'raffle', 'draw'],
    isPopular: true,
    priority: 13,
  },
  {
    id: 'random-group-generator',
    name: 'Random Group Generator',
    description: 'Divide rosters into balanced teams by group count or max team size.',
    href: '/random-group-generator',
    icon: Users,
    iconBgClass:
      'bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 border border-teal-100 dark:border-teal-900/60',
    categories: ['Randomizers & Group Activities', 'Education & Classroom'],
    keywords: ['group generator', 'team maker', 'random teams', 'breakout rooms', 'classroom'],
    isPopular: false,
    priority: 14,
  },
  {
    id: 'classroom-noise-meter',
    name: 'Classroom Noise Meter',
    description: 'Live microphone volume gauge (0–100) with custom quiet alerts and zero recording.',
    href: '/classroom-noise-meter',
    icon: Volume2,
    iconBgClass:
      'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/60',
    categories: ['Education & Classroom'],
    keywords: ['noise meter', 'volume monitor', 'quiet classroom', 'microphone', 'decibel'],
    isPopular: false,
    priority: 15,
  },
  {
    id: 'speech-time-calculator',
    name: 'Speech Time Calculator',
    description: 'Convert speech scripts and word counts into speaking minutes at any WPM.',
    href: '/speech-time-calculator',
    icon: Mic,
    iconBgClass:
      'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/60',
    categories: ['Stage & Presentation', 'Time Calculators', 'Education & Classroom'],
    keywords: ['speech time', 'words to minutes', 'wpm', 'script length', 'speaking rate'],
    isPopular: false,
    priority: 16,
  },
  {
    id: 'time-duration-calculator',
    name: 'Time Duration Calculator',
    description: 'Calculate exact hours, minutes, seconds, and decimal hours between two times.',
    href: '/time-duration-calculator',
    icon: Calculator,
    iconBgClass:
      'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/60',
    categories: ['Time Calculators', 'Productivity & Study'],
    keywords: ['time duration', 'elapsed time', 'hours between', 'cross midnight', 'decimal hours'],
    isPopular: true,
    priority: 17,
  },
  {
    id: 'time-addition-calculator',
    name: 'Time Addition Calculator',
    description: 'Add and subtract multiple hours, minutes, and seconds blocks.',
    href: '/time-addition-calculator',
    icon: Calculator,
    iconBgClass:
      'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/60',
    categories: ['Time Calculators', 'Productivity & Study'],
    keywords: ['add time', 'subtract time', 'hours minutes seconds', 'time sum', 'logbook'],
    isPopular: false,
    priority: 18,
  },
  {
    id: 'time-card-calculator',
    name: 'Time Card Calculator',
    description: 'Weekly work shift log with unpaid break deductions, decimal hours, and CSV export.',
    href: '/time-card-calculator',
    icon: Briefcase,
    iconBgClass:
      'bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-900/60',
    categories: ['Time Calculators', 'Productivity & Study'],
    keywords: ['time card', 'timesheet', 'work hours', 'payroll', 'break deduction', 'weekly hours'],
    isPopular: true,
    priority: 19,
  },
  {
    id: 'overtime-calculator',
    name: 'Overtime Calculator',
    description: 'Calculate regular vs overtime hours and estimated gross pay with 1.5x/2.0x rates.',
    href: '/overtime-calculator',
    icon: Calculator,
    iconBgClass:
      'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/60',
    categories: ['Time Calculators', 'Productivity & Study'],
    keywords: ['overtime', 'time and a half', 'double time', 'pay calculator', 'regular hours'],
    isPopular: false,
    priority: 20,
  },
  {
    id: 'embed-timer',
    name: 'Embeddable Timer Widget',
    description: 'Generate custom HTML iframe timers for Notion, Canvas LMS, and event websites.',
    href: '/embed-timer',
    icon: Code2,
    iconBgClass:
      'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/60',
    categories: ['Embeddable Widgets', 'Timers & Stopwatches'],
    keywords: ['embed timer', 'iframe widget', 'notion timer', 'website countdown', 'html snippet'],
    isPopular: false,
    priority: 21,
  },
  {
    id: 'kitchen-timer',
    name: 'Kitchen Timer',
    description: 'Run multiple simultaneous named burner and oven timers with distinct chimes.',
    href: '/kitchen-timer',
    icon: ChefHat,
    iconBgClass:
      'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-100 dark:border-orange-900/60',
    categories: ['Cooking & Everyday', 'Timers & Stopwatches'],
    keywords: ['kitchen timer', 'cooking', 'baking', 'oven', 'multi burner', 'roast'],
    isPopular: false,
    priority: 22,
  },
  {
    id: 'egg-timer',
    name: 'Egg Timer',
    description: 'Precision presets for soft runny, jammy ramen, medium, and hard-boiled eggs.',
    href: '/egg-timer',
    icon: ChefHat,
    iconBgClass:
      'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/60',
    categories: ['Cooking & Everyday', 'Timers & Stopwatches'],
    keywords: ['egg timer', 'soft boiled', 'hard boiled', 'jammy egg', 'breakfast'],
    isPopular: false,
    priority: 23,
  },
  {
    id: 'tea-timer',
    name: 'Tea Steep Timer',
    description: 'Steep green, white, oolong, black, and herbal teas with temperature guidance.',
    href: '/tea-timer',
    icon: Coffee,
    iconBgClass:
      'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/60',
    categories: ['Cooking & Everyday', 'Timers & Stopwatches'],
    keywords: ['tea timer', 'steep', 'green tea', 'black tea', 'oolong', 'herbal'],
    isPopular: false,
    priority: 24,
  },
  {
    id: 'coffee-timer',
    name: 'Coffee Brew Timer',
    description: 'Specialty coffee extraction timer for V60 Pour-Over bloom, French Press & AeroPress.',
    href: '/coffee-timer',
    icon: Coffee,
    iconBgClass:
      'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/60',
    categories: ['Cooking & Everyday', 'Timers & Stopwatches'],
    keywords: ['coffee timer', 'pour over', 'v60', 'french press', 'aeropress', 'bloom'],
    isPopular: false,
    priority: 25,
  },
  {
    id: 'study-timer',
    name: 'Study Timer',
    description: 'Academic focus cycles (50/10, 25/5, 90m exam block) with session tracking.',
    href: '/study-timer',
    icon: BookOpen,
    iconBgClass:
      'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/60',
    categories: ['Productivity & Study', 'Education & Classroom', 'Timers & Stopwatches'],
    keywords: ['study timer', 'exam prep', 'revision', 'homework', 'academic focus'],
    isPopular: false,
    priority: 26,
  },
  {
    id: 'reading-timer',
    name: 'Reading Timer',
    description: 'Sustained silent reading (SSR) and note reflection intervals.',
    href: '/reading-timer',
    icon: BookOpen,
    iconBgClass:
      'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/60',
    categories: ['Productivity & Study', 'Education & Classroom'],
    keywords: ['reading timer', 'book', 'silent reading', 'ssr', 'literature'],
    isPopular: false,
    priority: 27,
  },
  {
    id: 'break-timer',
    name: 'Break Timer',
    description: 'Workplace stretch, hydration, and lunch break reminder countdown.',
    href: '/break-timer',
    icon: Leaf,
    iconBgClass:
      'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/60',
    categories: ['Productivity & Study', 'Fitness & Wellness'],
    keywords: ['break timer', 'rest', 'lunch break', 'desk stretch', 'recharge'],
    isPopular: false,
    priority: 28,
  },
  {
    id: 'eye-break-timer',
    name: '20-20-20 Eye Break Timer',
    description: 'Every 20 minutes of screen work, look 20 feet away for 20 seconds.',
    href: '/eye-break-timer',
    icon: Eye,
    iconBgClass:
      'bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-900/60',
    categories: ['Productivity & Study', 'Fitness & Wellness'],
    keywords: ['20-20-20', 'eye break', 'eye strain', 'screen break', 'vision'],
    isPopular: false,
    priority: 29,
  },
  {
    id: 'tabata-timer',
    name: 'Tabata Timer',
    description: 'High-intensity 20s sprint / 10s rest protocol across 8 rounds.',
    href: '/tabata-timer',
    icon: Dumbbell,
    iconBgClass:
      'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/60',
    categories: ['Fitness & Wellness', 'Timers & Stopwatches'],
    keywords: ['tabata', '20 10', 'hiit', 'sprint', 'workout', 'CrossFit'],
    isPopular: false,
    priority: 30,
  },
  {
    id: 'boxing-timer',
    name: 'Boxing Round Timer',
    description: '3-minute pro boxing, 2-minute amateur, and 5-minute MMA rounds with corner bell.',
    href: '/boxing-timer',
    icon: Dumbbell,
    iconBgClass:
      'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/60',
    categories: ['Fitness & Wellness', 'Timers & Stopwatches'],
    keywords: ['boxing timer', 'mma', 'sparring', 'heavy bag', 'rounds', 'corner bell'],
    isPopular: false,
    priority: 31,
  },
  {
    id: 'meditation-timer',
    name: 'Meditation Timer',
    description: 'Peaceful mindfulness countdown with gentle acoustic singing bowl chimes.',
    href: '/meditation-timer',
    icon: HeartPulse,
    iconBgClass:
      'bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 border border-teal-100 dark:border-teal-900/60',
    categories: ['Fitness & Wellness', 'Productivity & Study'],
    keywords: ['meditation', 'mindfulness', 'zen', 'bell', 'calm'],
    isPopular: false,
    priority: 32,
  },
  {
    id: 'breathing-timer',
    name: 'Breathing Timer',
    description: 'Visual breathing pacer for 4-4-4-4 Box Breathing and 4-7-8 Relaxation.',
    href: '/breathing-timer',
    icon: Wind,
    iconBgClass:
      'bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-900/60',
    categories: ['Fitness & Wellness', 'Productivity & Study'],
    keywords: ['breathing timer', 'box breathing', '4-7-8', 'breathwork', 'calm'],
    isPopular: false,
    priority: 33,
  },
  {
    id: 'chess-clock',
    name: 'Chess Clock',
    description: 'Two-player game timer with Bullet, Blitz, and Rapid presets plus move counter.',
    href: '/chess-clock',
    icon: Trophy,
    iconBgClass:
      'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/60',
    categories: ['Timers & Stopwatches', 'Randomizers & Group Activities'],
    keywords: ['chess clock', 'two player', 'blitz', 'bullet', 'board game'],
    isPopular: false,
    priority: 34,
  },
  {
    id: 'quiz-timer',
    name: 'Quiz Timer',
    description: 'Fast-reset per-question countdown for trivia nights and classroom games.',
    href: '/quiz-timer',
    icon: Sparkles,
    iconBgClass:
      'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/60',
    categories: ['Education & Classroom', 'Randomizers & Group Activities'],
    keywords: ['quiz timer', 'trivia', 'question timer', 'game show'],
    isPopular: false,
    priority: 35,
  },
  {
    id: 'classroom-scoreboard',
    name: 'Classroom Scoreboard',
    description: 'Live multi-team point tracker with +1, +5, +10, and -1 buttons.',
    href: '/classroom-scoreboard',
    icon: Trophy,
    iconBgClass:
      'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/60',
    categories: ['Education & Classroom', 'Randomizers & Group Activities'],
    keywords: ['scoreboard', 'team points', 'classroom game', 'scorekeeper'],
    isPopular: false,
    priority: 36,
  },
  {
    id: 'bingo-caller',
    name: 'Bingo Number Caller',
    description: '75-ball B-I-N-G-O random number caller with live verification master board.',
    href: '/bingo-caller',
    icon: Grid,
    iconBgClass:
      'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/60',
    categories: ['Randomizers & Group Activities', 'Education & Classroom'],
    keywords: ['bingo caller', '75 ball', 'number generator', 'bingo board'],
    isPopular: false,
    priority: 37,
  },
  {
    id: 'seating-chart-maker',
    name: 'Seating Chart Maker',
    description: 'Randomize classroom desk grids with configurable rows, columns, and CSV export.',
    href: '/seating-chart-maker',
    icon: Grid,
    iconBgClass:
      'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/60',
    categories: ['Education & Classroom', 'Randomizers & Group Activities'],
    keywords: ['seating chart', 'desk layout', 'classroom seats', 'student grid'],
    isPopular: false,
    priority: 38,
  },
  {
    id: 'toastmasters-timer',
    name: 'Toastmasters Timer',
    description: 'Configure speech timing signals (Green/Yellow/Red) for Toastmasters meetings.',
    href: '/toastmasters-timer',
    icon: MessageSquare,
    iconBgClass:
      'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/60',
    categories: ['Stage & Presentation', 'Education & Classroom'],
    keywords: ['toastmasters', 'speech', 'green yellow red', 'table topics', 'speaking'],
    isPopular: false,
    priority: 39,
  },
  {
    id: 'unix-timestamp-converter',
    name: 'Unix Timestamp Converter',
    description: 'Convert dates and timestamps between human time and Unix epoch.',
    href: '/unix-timestamp-converter',
    icon: Code2,
    iconBgClass:
      'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/60',
    categories: ['Time Calculators', 'World Clock & Time Zones'],
    keywords: ['unix', 'timestamp', 'epoch', 'developer', 'milliseconds', 'iso', 'code'],
    isPopular: false,
    priority: 40,
  },
  {
    id: 'speaker-timer',
    name: 'Speaker Timer',
    description: 'High-contrast podium timer for keynote speakers and presenters.',
    href: '/speaker-timer',
    icon: Mic,
    iconBgClass:
      'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/60',
    categories: ['Stage & Presentation', 'Timers & Stopwatches'],
    keywords: ['speaker', 'podium', 'keynote', 'talk', 'conference'],
    isPopular: false,
    priority: 41,
  },
  {
    id: 'debate-timer',
    name: 'Debate Timer',
    description: 'Structured round timing for parliamentary, policy and club debates.',
    href: '/debate-timer',
    icon: Scale,
    iconBgClass:
      'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/60',
    categories: ['Education & Classroom', 'Stage & Presentation'],
    keywords: ['debate', 'rebuttal', 'speech', 'adjudicator', 'club'],
    isPopular: false,
    priority: 42,
  },
  {
    id: 'online-alarm-clock',
    name: 'Online Alarm Clock',
    description: 'Set browser alarms with custom wake-up chimes and snooze.',
    href: '/online-alarm-clock',
    icon: Bell,
    iconBgClass:
      'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/60',
    categories: ['Timers & Stopwatches', 'Cooking & Everyday'],
    keywords: ['alarm', 'wake up', 'bell', 'alert', 'reminder'],
    isPopular: false,
    priority: 43,
  },
  {
    id: 'event-countdown-timer',
    name: 'Event Countdown Timer',
    description: 'Count down days, hours, minutes and seconds to any upcoming date.',
    href: '/event-countdown-timer',
    icon: Calendar,
    iconBgClass:
      'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/60',
    categories: ['Stage & Presentation', 'Timers & Stopwatches'],
    keywords: ['event countdown', 'days until', 'launch', 'holiday', 'date'],
    isPopular: false,
    priority: 44,
  },
  {
    id: 'sermon-timer',
    name: 'Sermon & Service Timer',
    description: 'Discreet visual agenda timer for religious speakers and services.',
    href: '/sermon-timer',
    icon: Clock,
    iconBgClass:
      'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/60',
    categories: ['Stage & Presentation', 'Timers & Stopwatches'],
    keywords: ['sermon', 'service', 'worship', 'church', 'religious', 'speaker'],
    isPopular: false,
    priority: 45,
  },
  {
    id: 'webinar-timer',
    name: 'Webinar Host Timer',
    description: 'Keep online broadcasts, Q&A segments and virtual panels on schedule.',
    href: '/webinar-timer',
    icon: Tv,
    iconBgClass:
      'bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-900/60',
    categories: ['Stage & Presentation', 'Productivity & Study'],
    keywords: ['webinar', 'zoom', 'stream', 'broadcast', 'host', 'virtual'],
    isPopular: false,
    priority: 46,
  },
  {
    id: 'time-difference-calculator',
    name: 'Time Difference Calculator',
    description: 'Calculate exact hours and minutes between two dates or locations.',
    href: '/time-difference-calculator',
    icon: ArrowLeftRight,
    iconBgClass:
      'bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 border border-teal-100 dark:border-teal-900/60',
    categories: ['Time Calculators', 'World Clock & Time Zones'],
    keywords: ['calculate', 'difference', 'duration', 'hours between', 'dates'],
    isPopular: false,
    priority: 47,
  },
];

const CATEGORIES = [
  'All Tools',
  'Timers & Stopwatches',
  'Stage & Presentation',
  'Education & Classroom',
  'Fitness & Wellness',
  'Productivity & Study',
  'World Clock & Time Zones',
  'Time Calculators',
  'Cooking & Everyday',
  'Randomizers & Group Activities',
  'Embeddable Widgets',
];

const COMMUNITIES = [
  {
    id: 'speakers-events',
    title: 'Speakers & Events',
    description: 'Conferences, presentations, stage timers & speech calculators.',
    categoryFilter: 'Stage & Presentation',
    icon: Users,
    iconBg: 'bg-purple-100/80 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400',
  },
  {
    id: 'education',
    title: 'Education & Classroom',
    description: 'Visual timers, noise meter, random pickers & scoreboards.',
    categoryFilter: 'Education & Classroom',
    icon: GraduationCap,
    iconBg: 'bg-blue-100/80 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400',
  },
  {
    id: 'fitness',
    title: 'Fitness & Wellness',
    description: 'Tabata, boxing rounds, HIIT intervals, breathing & meditation.',
    categoryFilter: 'Fitness & Wellness',
    icon: Dumbbell,
    iconBg: 'bg-emerald-100/80 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400',
  },
  {
    id: 'productivity',
    title: 'Productivity & Study',
    description: 'Pomodoro, academic study blocks, reading & 20-20-20 eye breaks.',
    categoryFilter: 'Productivity & Study',
    icon: Briefcase,
    iconBg: 'bg-orange-100/80 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400',
  },
  {
    id: 'global-teams',
    title: 'World Clock & Teams',
    description: 'Time-zone conversion, world clocks & global meeting overlap.',
    categoryFilter: 'World Clock & Time Zones',
    icon: Globe,
    iconBg: 'bg-sky-100/80 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400',
  },
  {
    id: 'calculators',
    title: 'Time Calculators',
    description: 'Time cards, overtime, duration, time addition & Unix epoch.',
    categoryFilter: 'Time Calculators',
    icon: Calculator,
    iconBg: 'bg-rose-100/80 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400',
  },
];

export default function AllToolsPage() {
  const router = useRouter();
  const [search, setSearch] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('q') || '';
    }
    return '';
  });
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All Tools');
  const [selectedTier, setSelectedTier] = useState<'all' | ToolTier>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'alpha' | 'category'>('popular');
  const [sortOpen, setSortOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchBoxContainerRef = useRef<HTMLDivElement>(null);
  const toolsGridRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsSearchFocused(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
      if (
        searchBoxContainerRef.current &&
        !searchBoxContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const liveSearchMatches = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return [];
    return TOOLS_DIRECTORY.filter(
      (tool) =>
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.categories.some((cat) => cat.toLowerCase().includes(query)) ||
        tool.keywords.some((kw) => kw.toLowerCase().includes(query))
    );
  }, [search]);

  const filteredTools = useMemo(() => {
    const query = search.trim().toLowerCase();

    let result = TOOLS_DIRECTORY.filter((tool) => {
      const matchesCategory =
        selectedCategory === 'All Tools' || tool.categories.includes(selectedCategory);

      const tier = resolveDirectoryToolTier(tool.id, tool.isPopular);
      const matchesTier = selectedTier === 'all' || tier === selectedTier;

      const matchesSearch =
        !query ||
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.categories.some((cat) => cat.toLowerCase().includes(query)) ||
        tool.keywords.some((kw) => kw.toLowerCase().includes(query));

      return matchesCategory && matchesTier && matchesSearch;
    });

    if (query && result.length === 0 && liveSearchMatches.length > 0) {
      result = [...liveSearchMatches];
    }

    if (sortBy === 'popular') {
      result = [...result].sort((a, b) => {
        if (a.isPopular && !b.isPopular) return -1;
        if (!a.isPopular && b.isPopular) return 1;
        return a.priority - b.priority;
      });
    } else if (sortBy === 'alpha') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'category') {
      result = [...result].sort((a, b) =>
        (a.categories[0] || '').localeCompare(b.categories[0] || '')
      );
    }

    return result;
  }, [search, selectedCategory, selectedTier, sortBy, liveSearchMatches]);

  const handleSelectCommunity = (cat: string) => {
    setSelectedCategory(cat);
    setSearch('');
    toolsGridRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const showLiveDropdown = isSearchFocused && search.trim().length > 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 transition-colors">
      <section className="relative pt-12 pb-10 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-20">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Find the Right <span className="text-[#2563EB]">Time Tool</span>
          </h1>

          <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-normal">
            Explore 47 specialized tools on <strong className="font-semibold text-slate-900 dark:text-white">WebCountDownTimer</strong> (WebCountDownTimer.com) for presentations, classrooms, events, fitness, cooking, time cards, and global teams.
          </p>

          <div className="mt-8 max-w-2xl mx-auto relative text-left" ref={searchBoxContainerRef}>
            <div className="relative flex items-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs px-4 py-3.5 focus-within:ring-2 focus-within:ring-[#2563EB] focus-within:border-transparent transition-all">
              <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0 mr-3" />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setIsSearchFocused(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && liveSearchMatches.length > 0) {
                    router.push(liveSearchMatches[0].href);
                  } else if (e.key === 'Escape') {
                    setIsSearchFocused(false);
                  }
                }}
                placeholder="Search 47 timers, calculators, clocks and classroom tools..."
                className="w-full text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 bg-transparent focus:outline-hidden"
                aria-label="Search timers, clocks and time tools"
              />
              {search ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    setIsSearchFocused(false);
                  }}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <div className="hidden sm:flex items-center text-xs text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 whitespace-nowrap">
                  Press / to search
                </div>
              )}
            </div>

            {showLiveDropdown && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl z-50 overflow-hidden">
                <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/70 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  <span>
                    {liveSearchMatches.length > 0
                      ? `Live Search Results (${liveSearchMatches.length} found)`
                      : 'No matching tools'}
                  </span>
                  {liveSearchMatches.length > 0 && (
                    <span className="hidden sm:inline text-slate-400">
                      Press Enter to launch top match
                    </span>
                  )}
                </div>

                {liveSearchMatches.length > 0 ? (
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
                    {liveSearchMatches.map((tool) => {
                      const tier = resolveDirectoryToolTier(tool.id, tool.isPopular);
                      return (
                        <Link prefetch={false}
                          key={tool.id}
                          href={tool.href}
                          onClick={() => setIsSearchFocused(false)}
                          className="px-4 py-3 flex items-center justify-between gap-3 hover:bg-blue-50/60 dark:hover:bg-slate-800/80 transition-colors group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <ToolIconBadge tool={tool.href || tool.id} size="sm" />
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#2563EB] truncate">
                                  {tool.name}
                                </span>
                                <ToolTierTag tier={tier} />
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                {tool.description}
                              </p>
                            </div>
                          </div>
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#365C4B] dark:text-[#5E917A] shrink-0">
                            <span className="hidden sm:inline">Open {tool.name}</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-all" />
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-slate-500">
                    No tools matched &ldquo;{search}&rdquo;. Try searching for visual, stopwatch,
                    time card, random, or egg.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" ref={toolsGridRef}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {CATEGORIES.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#2563EB] text-white shadow-xs'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 self-end lg:self-auto shrink-0">
            {/* Trending / Hot / New Quick Filter */}
            <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              {[
                { id: 'all', label: 'All', icon: null },
                { id: 'trending', label: 'Trending', icon: TrendingUp },
                { id: 'hot', label: 'Hot', icon: Flame },
                { id: 'new', label: 'New', icon: Sparkles },
              ].map((t) => {
                const TIcon = t.icon;
                const active = selectedTier === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTier(t.id as 'all' | ToolTier)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      active
                        ? 'bg-[#365C4B] text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {TIcon && <TIcon className="w-3 h-3" />}
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 relative" ref={sortRef}>
              <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                Sort by:
              </span>
              <button
                type="button"
                onClick={() => setSortOpen(!sortOpen)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs cursor-pointer"
                aria-expanded={sortOpen}
              >
                <span>
                  {sortBy === 'popular'
                    ? 'Most Popular'
                    : sortBy === 'alpha'
                    ? 'Name (A-Z)'
                    : 'Category'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {sortOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-44 py-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl z-30 text-xs sm:text-sm font-medium">
                  <button
                    type="button"
                    onClick={() => {
                      setSortBy('popular');
                      setSortOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 ${
                      sortBy === 'popular'
                        ? 'text-[#2563EB] font-semibold bg-blue-50/50 dark:bg-blue-950/30'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>Most Popular</span>
                    {sortBy === 'popular' && <Check className="w-3.5 h-3.5 text-[#2563EB]" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSortBy('alpha');
                      setSortOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 ${
                      sortBy === 'alpha'
                        ? 'text-[#2563EB] font-semibold bg-blue-50/50 dark:bg-blue-950/30'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>Name (A-Z)</span>
                    {sortBy === 'alpha' && <Check className="w-3.5 h-3.5 text-[#2563EB]" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSortBy('category');
                      setSortOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 ${
                      sortBy === 'category'
                        ? 'text-[#2563EB] font-semibold bg-blue-50/50 dark:bg-blue-950/30'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>Category</span>
                    {sortBy === 'category' && <Check className="w-3.5 h-3.5 text-[#2563EB]" />}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTools.map((tool) => {
            const tier = resolveDirectoryToolTier(tool.id, tool.isPopular);
            return (
              <Link prefetch={false}
                key={tool.id}
                href={tool.href}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all group flex flex-col justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <ToolIconBadge tool={tool.href || tool.id} size="lg" />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h2 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#2563EB] dark:group-hover:text-[#3B82F6] transition-colors leading-tight">
                        {tool.name}
                      </h2>
                      <ToolTierTag tier={tier} />
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-snug">
                      {tool.description}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-[#365C4B] dark:text-[#5E917A]">
                  <span>Open {tool.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform shrink-0" />
                </div>
              </Link>
            );
          })}
        </div>

        {filteredTools.length === 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-3">
            <Clock className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              No time tools matched &ldquo;{search}&rdquo;
            </h3>
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setSelectedCategory('All Tools');
              }}
              className="mt-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#2563EB] text-white hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        <section className="pt-10 border-t border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Choose by Community
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Find time tools for your profession, activity or use case.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All Tools');
                setSearch('');
                toolsGridRef.current?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-blue-200 dark:border-blue-800/60 bg-blue-50/50 dark:bg-blue-950/30 text-[#2563EB] dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors self-start sm:self-auto cursor-pointer"
            >
              <span>View All 47 Tools</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {COMMUNITIES.map((comm) => {
              return (
                <button
                  key={comm.id}
                  type="button"
                  onClick={() => handleSelectCommunity(comm.categoryFilter)}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs transition-all text-left flex flex-col justify-between group cursor-pointer"
                >
                  <div className="mb-3">
                    <ToolIconBadge tool={comm.title} size="md" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#2563EB] dark:group-hover:text-blue-400 transition-colors">
                      {comm.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {comm.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

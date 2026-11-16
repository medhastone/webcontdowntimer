import type { Metadata } from 'next';

export const SITE_BASE_URL = 'https://WebCountDownTimer.com';

export interface RouteSeoEntry {
  path: string;
  title: string;
  description: string;
  keywords?: string[];
  noIndex?: boolean;
}

/**
 * Normalizes a route path so canonical and og:url are always:
 * - Absolute (https://WebCountDownTimer.com...)
 * - Free of trailing slashes (even on root: https://WebCountDownTimer.com)
 * - Free of query strings or hash fragments
 */
export function getCanonicalUrl(routePath: string): string {
  const cleanPath = routePath.split('?')[0].split('#')[0].trim();
  const normalizedPath =
    cleanPath === '/' || cleanPath === ''
      ? ''
      : `/${cleanPath.replace(/^\/+|\/+$/g, '')}`;
  return `${SITE_BASE_URL}${normalizedPath}`;
}

export const ROUTE_SEO_REGISTRY: Record<string, RouteSeoEntry> = {
  // ============================================================================
  // 1. CORE STATIC & INFORMATIONAL PAGES
  // ============================================================================
  '/': {
    path: '/',
    title: 'Free Online Countdown Timer, Stage Timer & Visual Timer | WebCountDownTimer',
    description:
      'Free online countdown timer, stopwatch, stage timer, and visual timers for classrooms, meetings, workouts, and daily tasks. No sign-up required.',
    keywords: [
      'free online countdown timer',
      'online stopwatch',
      'stage timer',
      'visual timer',
      'classroom timer',
      'world clock',
    ],
  },
  '/tools': {
    path: '/tools',
    title: 'All Time Tools, Timers & Calculators | WebCountDownTimer',
    description:
      'Browse the complete directory of 60+ free online countdown timers, sensory visual clocks, stage monitors, world time converters, and date calculators.',
    keywords: ['all time tools', 'timer directory', 'online timers list', 'time calculators'],
  },
  '/guides': {
    path: '/guides',
    title: 'Event Timing & Time Zone Guides | WebCountDownTimer',
    description:
      'Read practical handbooks on stage confidence monitors, official Toastmasters speech rules, debate bells, Pomodoro focus cycles, and IANA time zones.',
    keywords: ['event timing guides', 'toastmasters rules', 'debate timer rules', 'iana time zones'],
  },
  '/education': {
    path: '/education',
    title: 'Classroom Timers & Teacher Tools | WebCountDownTimer',
    description:
      'Free online classroom timers, visual countdowns, student name pickers, noise meters, and group generators built for K-12 teachers and smartboards.',
    keywords: ['classroom timers', 'teacher tools', 'school countdown', 'classroom management'],
  },
  '/about': {
    path: '/about',
    title: 'About & Timing Methodology | WebCountDownTimer',
    description:
      'Learn how WebCountDownTimer engineers drift-free timestamp countdowns, Web Audio chimes, IANA time-zone conversions, and private browser calculators.',
    keywords: ['about webcountdowntimer', 'timer methodology', 'drift-free clock'],
  },
  '/contact': {
    path: '/contact',
    title: 'Contact & Feature Requests | WebCountDownTimer',
    description:
      'Contact the WebCountDownTimer engineering team to request new timer presets, ask stage synchronization questions, or share classroom tool feedback.',
    keywords: ['contact webcountdowntimer', 'timer feedback', 'support'],
  },
  '/privacy': {
    path: '/privacy',
    title: 'Privacy Policy & Local Data Security | WebCountDownTimer',
    description:
      'Read the WebCountDownTimer privacy policy. All timers, student rosters, custom images, and stage sync sessions run locally in your browser with zero ads.',
    keywords: ['privacy policy', 'local browser privacy', 'student data privacy'],
  },
  '/terms': {
    path: '/terms',
    title: 'Terms of Use & Service Conditions | WebCountDownTimer',
    description:
      'Review the Terms of Use governing WebCountDownTimer free online countdown timers, stage monitors, world clocks, and payroll time-card calculators.',
    keywords: ['terms of use', 'service conditions', 'legal disclaimer'],
  },
  '/accessibility': {
    path: '/accessibility',
    title: 'Accessibility Statement (WCAG 2.2 AA) | WebCountDownTimer',
    description:
      'WebCountDownTimer is built to WCAG 2.2 Level AA accessibility standards with keyboard shortcuts, ARIA live regions, high contrast, and reduced motion.',
    keywords: ['accessibility statement', 'wcag 2.2 aa', 'accessible timers'],
  },
  '/sitemap': {
    path: '/sitemap',
    title: 'HTML Sitemap & Tool Index | WebCountDownTimer',
    description:
      'Explore the complete HTML sitemap of WebCountDownTimer, indexing all countdown clocks, sensory visual timers, category hubs, and preset durations.',
    keywords: ['html sitemap', 'site index', 'all timer links'],
  },

  // ============================================================================
  // 2. CATEGORY HUB ROUTES (/category/[slug])
  // ============================================================================
  '/category/timers': {
    path: '/category/timers',
    title: 'Timers & Stopwatches Directory | WebCountDownTimer',
    description:
      'Explore precision online countdown timers, split-lap stopwatches, interval clocks, and fullscreen visual timers for work, study, cooking, and sports.',
  },
  '/category/everyday': {
    path: '/category/everyday',
    title: 'Everyday Timers & Daily Clocks | WebCountDownTimer',
    description:
      'Simple, drift-free everyday countdown clocks, kitchen timers, online alarms, and lap stopwatches designed for home routines, cooking, and workouts.',
  },
  '/category/events': {
    path: '/category/events',
    title: 'Events & Presentation Timers | WebCountDownTimer',
    description:
      'Professional stage timers, downstage speaker confidence monitors, Toastmasters signaling cards, and webinar agenda clocks for live event production.',
  },
  '/category/stage': {
    path: '/category/stage',
    title: 'Stage & Speaker Pacing Tools | WebCountDownTimer',
    description:
      'Synchronized backstage operator consoles, podium countdown clocks, debate gavel timers, and sermon displays built for conference and theater stages.',
  },
  '/category/education': {
    path: '/category/education',
    title: 'Education & Classroom Activity Hub | WebCountDownTimer',
    description:
      'Projector-ready classroom timers, sensory visual countdowns, random student pickers, decibel noise monitors, and desk seating chart generators.',
  },
  '/category/fitness': {
    path: '/category/fitness',
    title: 'Fitness, HIIT & Interval Timers | WebCountDownTimer',
    description:
      'High-intensity interval timers, 20/10 Tabata clocks, boxing round bells, and multi-lane athletic stopwatches for gym circuits and conditioning.',
  },
  '/category/productivity': {
    path: '/category/productivity',
    title: 'Productivity & Deep Focus Timers | WebCountDownTimer',
    description:
      'Structured Pomodoro sprint timers, 50/10 academic study clocks, 20-20-20 eye-break reminders, and calm desk timers to eliminate context switching.',
  },
  '/category/world': {
    path: '/category/world',
    title: 'World Clocks & Time Zone Tools | WebCountDownTimer',
    description:
      'Live international city clocks, interactive 24-hour time-zone scrubbers, and global team meeting planners powered by official IANA DST rules.',
  },
  '/category/world-clock': {
    path: '/category/world-clock',
    title: 'Global Time Zones & City Clocks | WebCountDownTimer',
    description:
      'Compare current local times across 400+ cities, verify Daylight Saving Time offsets, and calculate exact hour differences between international hubs.',
  },
  '/category/calculators': {
    path: '/category/calculators',
    title: 'Time, Date & Payroll Calculators | WebCountDownTimer',
    description:
      'Accurate base-60 time duration calculators, weekly payroll timesheet logs, FLSA overtime estimators, and calendar business-day counters.',
  },

  // ============================================================================
  // 3. CANONICAL VISUAL & SENSORY TIMERS (/timers/<slug>)
  // ============================================================================
  '/timers/aesthetic-timer': {
    path: '/timers/aesthetic-timer',
    title: 'Aesthetic Timer – Curated Desk Clock | WebCountDownTimer',
    description:
      'Customize a calm aesthetic countdown timer with 8 curated studio themes, Minimal Ivory and Dark Academia palettes, soft chimes, and fullscreen mode.',
  },
  '/timers/blocks-timer': {
    path: '/timers/blocks-timer',
    title: 'Blocks Timer – 3D Stacked Countdown | WebCountDownTimer',
    description:
      'Watch 3D stacked blocks disappear one by one as your countdown runs. Choose Wooden, Colored, Stone, or Minimal styles for classrooms and game turns.',
  },
  '/timers/bubble-timer': {
    path: '/timers/bubble-timer',
    title: 'Bubble Timer – Floating Visual Clock | WebCountDownTimer',
    description:
      'Relax with a gentle floating bubble visual countdown timer featuring Ocean Blue, Seafoam Green, and Clear Glass themes for calm study and transitions.',
  },
  '/timers/candle-timer': {
    path: '/timers/candle-timer',
    title: 'Candle Timer – Melting Wax Countdown | WebCountDownTimer',
    description:
      'Unwind with a peaceful melting candle countdown timer featuring flickering flame animation and Ivory, Amber, Forest Green, and Charcoal wax themes.',
  },
  '/timers/circular-timer': {
    path: '/timers/circular-timer',
    title: 'Circular Timer – Shrinking Ring Clock | WebCountDownTimer',
    description:
      'Track remaining time at a glance with a smooth 360-degree circular countdown ring, custom color themes, direction controls, and low-time warnings.',
  },
  '/timers/coral-timer': {
    path: '/timers/coral-timer',
    title: 'Coral Timer – Reef Growth Countdown | WebCountDownTimer',
    description:
      'Focus with a soothing underwater coral reef visual countdown timer that branches and blooms across Tropical, Deep Ocean, and Colorful Reef scenes.',
  },
  '/timers/flip-clock': {
    path: '/timers/flip-clock',
    title: 'Flip Clock – Retro Split-Flap Display | WebCountDownTimer',
    description:
      'Full-screen retro mechanical split-flap clock with Live Clock, Countdown, and Stopwatch modes, 12/24-hour switching, and Dark and Light housings.',
  },
  '/timers/flip-timer': {
    path: '/timers/flip-timer',
    title: 'Flip Timer – Split-Flap Countdown | WebCountDownTimer',
    description:
      'Count down with a tactile 3D mechanical split-flap timer featuring Classic Black, Retro Cream, Industrial, and Modern Dark card themes and chimes.',
  },
  '/timers/forest-fire-timer': {
    path: '/timers/forest-fire-timer',
    title: 'Forest Fire Timer – Ember Visual Clock | WebCountDownTimer',
    description:
      'Engage students and teams with a stylized nature-inspired countdown featuring a warm spreading ember glow across four illustrated woodland themes.',
  },
  '/timers/frost-timer': {
    path: '/timers/frost-timer',
    title: 'Frost Timer – Ice Crystal Countdown | WebCountDownTimer',
    description:
      'Watch delicate frost and ice crystals spread inward across a frosted glass pane as time elapses—ideal for quiet reading blocks and calm transitions.',
  },
  '/timers/galaxy-timer': {
    path: '/timers/galaxy-timer',
    title: 'Galaxy Timer – Deep Space Countdown | WebCountDownTimer',
    description:
      'Immerse your study block in a glowing cosmic spiral galaxy and starfield countdown with Spiral, Nebula, Starfield, and Andromeda visual themes.',
  },
  '/timers/heart-timer': {
    path: '/timers/heart-timer',
    title: 'Heart Timer – Rhythmic Visual Clock | WebCountDownTimer',
    description:
      'Track wellness breaks, classroom games, and cardio intervals with a smooth draining heart-shaped visual countdown in Rose, Berry, and Ivory themes.',
  },
  '/timers/hourglass-timer': {
    path: '/timers/hourglass-timer',
    title: 'Hourglass Timer – Wooden Sand Clock | WebCountDownTimer',
    description:
      'Run a classic wooden-framed hourglass countdown with realistic falling sand physics, instant 180-degree Flip button, and borderless fullscreen view.',
  },
  '/timers/lava-lamp-timer': {
    path: '/timers/lava-lamp-timer',
    title: 'Lava Lamp Timer – Retro Wax Countdown | WebCountDownTimer',
    description:
      'Stay focused with a relaxing retro lava lamp visual countdown featuring rising, merging liquid wax blobs in Amber, Deep Blue, Neon Pink, and Aqua.',
  },
  '/timers/lichen-timer': {
    path: '/timers/lichen-timer',
    title: 'Lichen Timer – Organic Moss Countdown | WebCountDownTimer',
    description:
      'Observe calm, nature-inspired organic lichen colonies slowly spread across Forest Rock, Tree Bark, and Coastal Stone surfaces as your timer runs.',
  },
  '/timers/liquid-timer': {
    path: '/timers/liquid-timer',
    title: 'Liquid Timer – Draining Glass Clock | WebCountDownTimer',
    description:
      'Visualize elapsed time with a transparent glass vessel, smooth draining liquid level, rising effervescent bubbles, and six calming color palettes.',
  },
  '/timers/moon-timer': {
    path: '/timers/moon-timer',
    title: 'Moon Timer – Lunar Night Sky Clock | WebCountDownTimer',
    description:
      'Wind down with a tranquil night-sky moon visual countdown featuring twinkling stars and Classic, Crescent, Blue Moon, and Harvest Warm styles.',
  },
  '/timers/picture-reveal-timer': {
    path: '/timers/picture-reveal-timer',
    title: 'Picture Reveal Timer – Tile Game Clock | WebCountDownTimer',
    description:
      'Turn classroom warmups and trivia into a guessing game: upload any photo or pick a preset and watch hidden grid tiles uncover as the clock counts down.',
  },
  '/timers/pixel-timer': {
    path: '/timers/pixel-timer',
    title: 'Pixel Timer – 8-Bit Arcade Countdown | WebCountDownTimer',
    description:
      'Bring retro gaming energy to study sprints and coding blocks with an 8-bit pixel grid countdown, adjustable pixel density, and four arcade themes.',
  },
  '/timers/progress-timer': {
    path: '/timers/progress-timer',
    title: 'Progress Timer – Visual Bar Countdown | WebCountDownTimer',
    description:
      'Keep meetings, exams, and sprints on pace with a clean progress bar timer offering Horizontal, Vertical, Segmented, and Thin Line visual layouts.',
  },
  '/timers/radial-timer': {
    path: '/timers/radial-timer',
    title: 'Radial Timer – Sunburst Spoke Clock | WebCountDownTimer',
    description:
      'Count down with a geometric radial spoke timer featuring Sunburst, Dots, Blocks, and Gradient Rays styles plus customizable segment counts.',
  },
  '/timers/rainbow-timer': {
    path: '/timers/rainbow-timer',
    title: 'Rainbow Timer – Colorful Arc Clock | WebCountDownTimer',
    description:
      'Make remaining time unmistakable for young learners with a vibrant multicolor rainbow arc countdown, four arc geometries, and six cheerful palettes.',
  },
  '/timers/rings-timer': {
    path: '/timers/rings-timer',
    title: 'Rings Timer – Concentric Circle Clock | WebCountDownTimer',
    description:
      'Visualize multi-stage tasks and study blocks with concentric animated progress rings in Classic, Gradient, Minimal, and Dashed ring styles.',
  },
  '/timers/sand-timer': {
    path: '/timers/sand-timer',
    title: 'Sand Timer – Digital Glass Hourglass | WebCountDownTimer',
    description:
      'Experience a realistic glass sand timer with golden falling grains, accumulating lower chamber mounds, 1–15 minute presets, and fullscreen projection.',
  },
  '/timers/sensory-timers': {
    path: '/timers/sensory-timers',
    title: 'Sensory Timers – Calm Visual Clocks | WebCountDownTimer',
    description:
      'Compare and launch calm, low-stimulation sensory visual timers with gentle motion, muted default audio, and soft colors for neurodivergent learners.',
  },
  '/timers/snow-timer': {
    path: '/timers/snow-timer',
    title: 'Snow Timer – Winter Snowfall Clock | WebCountDownTimer',
    description:
      'Create a peaceful winter atmosphere with gently falling snowflakes that accumulate into deep drifts across Cabin, Forest, and Mountain scenes.',
  },
  '/timers/spinner-timer': {
    path: '/timers/spinner-timer',
    title: 'Spinner Timer – Rotating Wheel Clock | WebCountDownTimer',
    description:
      'Manage classroom stations, board games, and drills with an interactive spinning wheel countdown featuring segmented progress and six bold themes.',
  },
  '/timers/sun-timer': {
    path: '/timers/sun-timer',
    title: 'Sun Timer – Horizon Sky Arc Clock | WebCountDownTimer',
    description:
      'Track routines naturally as an illustrated sun travels across a smooth horizon arc through Morning, Midday, Sunset, and Warm Neutral sky scenes.',
  },
  '/timers/train-timer': {
    path: '/timers/train-timer',
    title: 'Train Timer – Departure Board Clock | WebCountDownTimer',
    description:
      'Pace classroom transitions and workshop breaks with a railway departure-board split-flap countdown and an animated train moving along the route track.',
  },

  // ============================================================================
  // 4. ROOT VISUAL TIMER ALIAS ROUTES (/<slug>) — UNIQUE TITLES, DESCS & CANONICALS
  // ============================================================================
  '/aesthetic-timer': {
    path: '/aesthetic-timer',
    title: 'Aesthetic Countdown – Minimalist Timer | WebCountDownTimer',
    description:
      'Launch a minimalist aesthetic countdown clock for study desks and second monitors with eight cohesive color palettes and distraction-free fullscreen.',
  },
  '/blocks-timer': {
    path: '/blocks-timer',
    title: 'Stacked Blocks Countdown – 3D Timer | WebCountDownTimer',
    description:
      'Use a 3D stacked-block visual countdown that clears blocks step-by-step for kids routines, classroom cleanup transitions, and tabletop game turns.',
  },
  '/bubble-timer': {
    path: '/bubble-timer',
    title: 'Bubble Countdown – Ambient Water Timer | WebCountDownTimer',
    description:
      'Run a soothing underwater bubble countdown clock with rising translucent spheres and gentle aquatic gradients for mindful breaks and quiet study.',
  },
  '/candle-timer': {
    path: '/candle-timer',
    title: 'Candle Countdown – Ambient Flame Timer | WebCountDownTimer',
    description:
      'Set a tranquil digital candle timer that gradually melts down as you read, journal, or meditate, complete with customizable wax and flame styles.',
  },
  '/circular-timer': {
    path: '/circular-timer',
    title: 'Circle Countdown – Proportional Disc | WebCountDownTimer',
    description:
      'Display a high-contrast proportional circle countdown clock on smartboards and tablets with clockwise or counterclockwise sweep and alert cues.',
  },
  '/coral-timer': {
    path: '/coral-timer',
    title: 'Coral Reef Countdown – Ocean Timer | WebCountDownTimer',
    description:
      'Watch vibrant marine coral formations grow across the ocean floor as your countdown progresses—built for calm classroom focus and study sessions.',
  },
  '/frost-timer': {
    path: '/frost-timer',
    title: 'Frosted Glass Countdown – Ice Timer | WebCountDownTimer',
    description:
      'Project a low-distraction frosted window countdown where crystalline ice patterns gradually frame the screen during silent reading and exams.',
  },
  '/galaxy-timer': {
    path: '/galaxy-timer',
    title: 'Galaxy Countdown – Starfield Clock | WebCountDownTimer',
    description:
      'Focus beneath a rotating nebula and starfield countdown display engineered for late-night coding, studying, and ambient dual-monitor setups.',
  },
  '/heart-timer': {
    path: '/heart-timer',
    title: 'Heart Countdown – Pulse Visual Timer | WebCountDownTimer',
    description:
      'Keep wellness circuits, breathing exercises, and classroom activities on schedule with a smooth heart-shaped fill countdown and gentle pulse animation.',
  },
  '/hourglass-timer': {
    path: '/hourglass-timer',
    title: 'Hourglass Countdown – Flip Sand Clock | WebCountDownTimer',
    description:
      'Time board games, debates, and study blocks with a classic twin-chamber hourglass countdown featuring realistic sand flow and instant flip-reset.',
  },
  '/lava-lamp-timer': {
    path: '/lava-lamp-timer',
    title: 'Lava Lamp Countdown – Liquid Wax Clock | WebCountDownTimer',
    description:
      'Enjoy a groovy retro lava lamp countdown clock with buoyant glowing wax spheres that rise and blend smoothly through every minute of your session.',
  },
  '/lichen-timer': {
    path: '/lichen-timer',
    title: 'Lichen Growth Countdown – Nature Clock | WebCountDownTimer',
    description:
      'Bring calm botanical pacing to your desk with an organic lichen countdown that expands naturally across textured stone and woodland bark.',
  },
  '/liquid-timer': {
    path: '/liquid-timer',
    title: 'Liquid Countdown – Sensory Water Clock | WebCountDownTimer',
    description:
      'Track time effortlessly with a draining liquid glass timer featuring smooth meniscus motion, floating bubbles, and six vibrant sensory colors.',
  },
  '/moon-timer': {
    path: '/moon-timer',
    title: 'Lunar Moon Countdown – Night Timer | WebCountDownTimer',
    description:
      'Pair evening study, wind-down routines, and bedtime reading with a serene lunar phase countdown set against a deep starlit night sky.',
  },
  '/picture-reveal-timer': {
    path: '/picture-reveal-timer',
    title: 'Photo Reveal Countdown – Mystery Grid | WebCountDownTimer',
    description:
      'Engage elementary classes and workshop teams with a mystery picture reveal timer that removes covering tiles one by one until 00:00.',
  },
  '/pixel-timer': {
    path: '/pixel-timer',
    title: 'Pixel Art Countdown – Retro 8-Bit Clock | WebCountDownTimer',
    description:
      'Count down with a nostalgic 8-bit arcade pixel matrix timer featuring customizable grid resolution and classic CRT monochrome or color palettes.',
  },
  '/progress-timer': {
    path: '/progress-timer',
    title: 'Progress Bar Countdown – Linear Timer | WebCountDownTimer',
    description:
      'Display a crisp linear or segmented progress bar countdown for keynotes, test proctoring, and agile standups with customizable warning thresholds.',
  },
  '/radial-timer': {
    path: '/radial-timer',
    title: 'Radial Spoke Countdown – Dial Timer | WebCountDownTimer',
    description:
      'Visualize time in discrete radial segments and sunburst rays—ideal for pacing multi-part presentations, workouts, and group rotations.',
  },
  '/rainbow-timer': {
    path: '/rainbow-timer',
    title: 'Rainbow Arc Countdown – Kids Timer | WebCountDownTimer',
    description:
      'Help kids and early learners see remaining time clearly with a bright seven-band rainbow countdown clock and cheerful optional completion chimes.',
  },
  '/rings-timer': {
    path: '/rings-timer',
    title: 'Multi-Ring Countdown – Nested Clock | WebCountDownTimer',
    description:
      'Track outer, middle, and inner concentric progress rings simultaneously for structured study intervals, lab stations, and fitness sets.',
  },
  '/sand-timer': {
    path: '/sand-timer',
    title: 'Online Sand Countdown – Hourglass Tool | WebCountDownTimer',
    description:
      'Use a drift-free digital sand timer with smooth particle physics and clear digital readout for quick classroom transitions and kitchen tasks.',
  },
  '/snow-timer': {
    path: '/snow-timer',
    title: 'Snowfall Countdown – Cozy Winter Clock | WebCountDownTimer',
    description:
      'Set a calm winter snowfall timer where gentle flurries blanket pine trees and cabin rooftops as your study or reading session counts down.',
  },
  '/spinner-timer': {
    path: '/spinner-timer',
    title: 'Spinning Wheel Countdown – Sweep Clock | WebCountDownTimer',
    description:
      'Run a high-visibility rotating pointer and segmented wheel countdown for classroom games, speed drills, and rapid team turn-taking.',
  },
  '/sun-timer': {
    path: '/sun-timer',
    title: 'Sun Arc Countdown – Daylight Clock | WebCountDownTimer',
    description:
      'Follow a warm illustrated sun from sunrise to sunset across the sky dome to pace morning routines, study blocks, and outdoor breaks.',
  },

  // ============================================================================
  // 5. CORE TIMERS, STAGE TOOLS, WORLD CLOCKS & CALCULATORS
  // ============================================================================
  '/countdown-timer': {
    path: '/countdown-timer',
    title: 'Countdown Timer – Online Alarm Clock | WebCountDownTimer',
    description:
      'Free online countdown timer with hours, minutes, and seconds presets, auto-repeat loop mode, synthesized Web Audio alarms, and fullscreen view.',
  },
  '/stopwatch': {
    path: '/stopwatch',
    title: 'Online Stopwatch – Split & Lap Timer | WebCountDownTimer',
    description:
      'Millisecond-accurate online stopwatch with split and lap recording, fastest and slowest lap highlighting, keyboard hotkeys, and one-click CSV export.',
  },
  '/multi-stopwatch': {
    path: '/multi-stopwatch',
    title: 'Multi-Stopwatch – Parallel Lane Timer | WebCountDownTimer',
    description:
      'Run multiple independent stopwatches simultaneously for track heats, swim lanes, relay handoffs, and lab trials with mass start and CSV export.',
  },
  '/interval-timer': {
    path: '/interval-timer',
    title: 'Interval Timer – HIIT & Circuit Clock | WebCountDownTimer',
    description:
      'Configurable HIIT and circuit interval timer with warm-up, work, rest, and cool-down phases, round counters, and 3-2-1 acoustic transition beeps.',
  },
  '/pomodoro-timer': {
    path: '/pomodoro-timer',
    title: 'Pomodoro Timer – 25-Min Focus Clock | WebCountDownTimer',
    description:
      'Boost deep work with a structured Pomodoro timer featuring 25-minute focus sprints, 5-minute short breaks, 15-minute long breaks, and task logging.',
  },
  '/online-alarm-clock': {
    path: '/online-alarm-clock',
    title: 'Online Alarm Clock – Browser Wake Bell | WebCountDownTimer',
    description:
      'Set reliable time-of-day browser alarms with 12/24-hour selection, acoustic and electronic wake tones, instant sound testing, and custom snooze.',
  },
  '/visual-timer': {
    path: '/visual-timer',
    title: 'Visual Timer – 10-Mode Animated Shrinking Clock | WebCountDownTimer',
    description:
      'Switch live between Growing Bloom, Liquid Wave, Breathing Orb, Energy Cells, Circular Disc, Linear Bar, Hourglass, Traffic Light, Rainbow, and Minimal Digital modes.',
  },
  '/custom-timer': {
    path: '/custom-timer',
    title: 'Custom Timer Studio – Create & Save Animated Visual Timers | WebCountDownTimer',
    description:
      'Create custom timers with your own title, description, activity icon, and 10 animated visual styles. Save them to your header Saved List for instant 1-click access.',
  },
  '/stage-timer': {
    path: '/stage-timer',
    title: 'Stage Timer – Live Showcaller Console | WebCountDownTimer',
    description:
      'Synchronize a backstage operator console with a fullscreen speaker confidence monitor. Features green/amber/red alerts, live flash cues, and overtime.',
  },
  '/stage-timer/viewer': {
    path: '/stage-timer/viewer',
    title: 'Stage Confidence Monitor – Live Display | WebCountDownTimer',
    description:
      'Dedicated blackout downstage confidence monitor for keynote speakers and talent with zero-latency BroadcastChannel sync and live operator flash prompts.',
  },
  '/speaker-timer': {
    path: '/speaker-timer',
    title: 'Speaker Timer – Podium Keynote Clock | WebCountDownTimer',
    description:
      'High-contrast podium countdown timer for keynote presenters and moderators with green, amber, and red wrap-up phases plus automatic red overtime.',
  },
  '/presentation-timer': {
    path: '/presentation-timer',
    title: 'Presentation Timer – Slide Deck Pacer | WebCountDownTimer',
    description:
      'Divide pitch decks, lectures, and thesis defenses into timed Intro, Demo, and Q&A segments with section transition chimes and overall pacing bars.',
  },
  '/toastmasters-timer': {
    path: '/toastmasters-timer',
    title: 'Toastmasters Timer – Speech Rule Cards | WebCountDownTimer',
    description:
      'Official Toastmasters International speech timer for Table Topics, Evaluations, and 5–7 minute speeches with Green, Amber, Red cards and 30s grace.',
  },
  '/debate-timer': {
    path: '/debate-timer',
    title: 'Debate Timer – Parliamentary POI Bells | WebCountDownTimer',
    description:
      'Time British Parliamentary, World Schools, Oxford, and Lincoln-Douglas debates with protected-time indicators and automatic 1-minute and 6-minute bells.',
  },
  '/sermon-timer': {
    path: '/sermon-timer',
    title: 'Sermon Timer – Sanctuary Pulpit Clock | WebCountDownTimer',
    description:
      'Discreet blackout pulpit countdown timer for pastors and worship production teams featuring gentle amber wrap-up warnings and silent overtime count-up.',
  },
  '/classroom-timer': {
    path: '/classroom-timer',
    title: 'Classroom Timer – Smartboard Clock | WebCountDownTimer',
    description:
      'Projector-ready classroom countdown timer for K-12 teachers with quiz, reading, and station rotation presets, shrinking visual ring, and silent mode.',
  },
  '/webinar-timer': {
    path: '/webinar-timer',
    title: 'Webinar Timer – Virtual Agenda Clock | WebCountDownTimer',
    description:
      'Keep Zoom, Teams, and livestream webinars on schedule with multi-segment agenda tracking across Welcome, Keynote, Panel, and Live Audience Q&A.',
  },
  '/event-countdown-timer': {
    path: '/event-countdown-timer',
    title: 'Event Countdown Timer – Target Date | WebCountDownTimer',
    description:
      'Count down days, hours, minutes, and seconds to product launches, conferences, and holidays with IANA time-zone accuracy and shareable links.',
  },
  '/world-clock': {
    path: '/world-clock',
    title: 'World Clock – Live Global City Times | WebCountDownTimer',
    description:
      'Track real-time local clocks across 400+ international cities and IANA time zones with UTC offsets, Daylight Saving indicators, and day/night status.',
  },
  '/time-zone-converter': {
    path: '/time-zone-converter',
    title: 'Time Zone Converter – 24h Scrubber | WebCountDownTimer',
    description:
      'Compare and convert local times across multiple global cities using an interactive 24-hour timeline scrubber with automatic DST and date-rollover tags.',
  },
  '/time-difference-calculator': {
    path: '/time-difference-calculator',
    title: 'Time Difference Calculator – City Delta | WebCountDownTimer',
    description:
      'Calculate the exact hour and minute difference between any two world cities, inspect 9-to-5 business overlap windows, and verify DST shifts.',
  },
  '/meeting-planner': {
    path: '/meeting-planner',
    title: 'Meeting Planner – Global Team Overlap | WebCountDownTimer',
    description:
      'Find optimal international meeting slots across distributed team time zones with a color-coded green, amber, and red working-hour availability grid.',
  },
  '/unix-timestamp-converter': {
    path: '/unix-timestamp-converter',
    title: 'Unix Timestamp Converter – Epoch Tool | WebCountDownTimer',
    description:
      'Convert Unix epoch seconds, milliseconds, and microseconds to UTC, ISO-8601, and local dates with a live ticking epoch clock and 64-bit support.',
  },
  '/embed-timer': {
    path: '/embed-timer',
    title: 'Embed Timer – HTML & Notion Widgets | WebCountDownTimer',
    description:
      'Customize and copy responsive, sandboxed HTML iframe countdown, visual timer, and stopwatch widgets for Notion, Canvas LMS, Moodle, and websites.',
  },
  '/embed-widget': {
    path: '/embed-widget',
    title: 'Embeddable Timer Frame – Live Widget | WebCountDownTimer',
    description:
      'Lightweight, zero-cookie embedded countdown, visual ring, and stopwatch widget frame engineered for Notion pages, LMS courses, and documentation.',
    noIndex: true,
  },
  '/random-name-picker': {
    path: '/random-name-picker',
    title: 'Random Name Picker – Fair Roster Draw | WebCountDownTimer',
    description:
      'Pick a random student or raffle winner fairly using an unbiased Fisher-Yates shuffle with optional winner removal, draw history, and local privacy.',
  },
  '/random-group-generator': {
    path: '/random-group-generator',
    title: 'Random Group Generator – Team Maker | WebCountDownTimer',
    description:
      'Split classroom rosters and workshop lists into balanced random teams by group count or max team size with one-click reshuffle and CSV export.',
  },
  '/classroom-noise-meter': {
    path: '/classroom-noise-meter',
    title: 'Classroom Noise Meter – Volume Gauge | WebCountDownTimer',
    description:
      'Monitor live classroom decibel and volume levels (0–100) using your browser microphone with visual quiet-zone alerts and zero audio recording.',
  },
  '/speech-time-calculator': {
    path: '/speech-time-calculator',
    title: 'Speech Time Calculator – Words to Mins | WebCountDownTimer',
    description:
      'Convert speech scripts and word counts into exact speaking durations at 110, 130, 150, or custom WPM rates, or find target word counts for any slot.',
  },
  '/time-duration-calculator': {
    path: '/time-duration-calculator',
    title: 'Time Duration Calculator – Elapsed Hrs | WebCountDownTimer',
    description:
      'Calculate exact elapsed hours, minutes, seconds, and payroll decimal hours between start and end times with automatic overnight midnight rollover.',
  },
  '/time-addition-calculator': {
    path: '/time-addition-calculator',
    title: 'Time Addition Calculator – Sum Hours | WebCountDownTimer',
    description:
      'Add or subtract multiple rows of hours, minutes, and seconds for aviation logbooks, video editing timelines, and project billing with decimal output.',
  },
  '/time-card-calculator': {
    path: '/time-card-calculator',
    title: 'Time Card Calculator – Weekly Payroll | WebCountDownTimer',
    description:
      'Calculate weekly employee work hours, deduct unpaid meal breaks, visualize daily shift charts, and export payroll decimal hours and pay to CSV.',
  },
  '/overtime-calculator': {
    path: '/overtime-calculator',
    title: 'Overtime Calculator – 1.5x & 2x Pay | WebCountDownTimer',
    description:
      'Compute regular vs. overtime hours, apply 1.5x time-and-a-half and 2.0x double-time multipliers, and visualize gross weekly pay breakdowns.',
  },
  '/time-calculator': {
    path: '/time-calculator',
    title: 'Time Calculator – Add & Subtract Time | WebCountDownTimer',
    description:
      'Perform base-60 time arithmetic: add or subtract hours, minutes, and seconds, or add a duration to any clock time to find the exact finish timestamp.',
  },
  '/date-calculator': {
    path: '/date-calculator',
    title: 'Date Calculator – Days Between Dates | WebCountDownTimer',
    description:
      'Count exact calendar days, weeks, and Mon–Fri business weekdays between two dates, or add and subtract days from any start date with leap-year math.',
  },
  '/time-converter': {
    path: '/time-converter',
    title: 'Time Converter – Sec, Min, Hr & Days | WebCountDownTimer',
    description:
      'Convert instantaneously between milliseconds, seconds, minutes, hours, days, weeks, and decimal payroll units with an all-in-one conversion table.',
  },
  '/minutes-to-hours': {
    path: '/minutes-to-hours',
    title: 'Minutes to Hours Converter – Min to Hr | WebCountDownTimer',
    description:
      'Convert any number of minutes into hours and minutes (HH:MM) and decimal hours (e.g., 90 mins = 1.5 hrs) for timesheets, payroll, and scheduling.',
  },
  '/hours-to-minutes': {
    path: '/hours-to-minutes',
    title: 'Hours to Minutes Converter – Hr to Min | WebCountDownTimer',
    description:
      'Convert decimal hours (such as 1.75 hrs) or hours and minutes into total minutes and seconds instantly with step-by-step sexagesimal formulas.',
  },
  '/seconds-to-minutes': {
    path: '/seconds-to-minutes',
    title: 'Seconds to Minutes Converter – Sec/Min | WebCountDownTimer',
    description:
      'Convert seconds into exact minutes and remaining seconds (MM:SS) plus decimal minutes for athletic splits, lab intervals, and audio production.',
  },
  '/what-time-will-it-be': {
    path: '/what-time-will-it-be',
    title: 'What Time Will It Be – Future Clock | WebCountDownTimer',
    description:
      'Find out what time it will be in X hours and Y minutes from right now or any start time, complete with 12-hour AM/PM, 24-hour, and next-day rollovers.',
  },
  '/kitchen-timer': {
    path: '/kitchen-timer',
    title: 'Kitchen Timer – Multi-Burner Cooking | WebCountDownTimer',
    description:
      'Run multiple simultaneous named cooking and baking timers for oven roasts, stovetop burners, and dough proofing with distinct acoustic chimes.',
  },
  '/egg-timer': {
    path: '/egg-timer',
    title: 'Egg Timer – Soft, Jammy & Hard Boiled | WebCountDownTimer',
    description:
      'Boil eggs to perfection with calibrated countdown presets for 4-minute runny, 6-minute jammy ramen, 8-minute medium, and 10-minute firm yolks.',
  },
  '/tea-timer': {
    path: '/tea-timer',
    title: 'Tea Timer – Green, Black & Oolong Steep | WebCountDownTimer',
    description:
      'Steep loose-leaf and bagged teas without bitterness using calibrated presets and water temperature guides for Green, White, Oolong, Black, and Herbal.',
  },
  '/coffee-timer': {
    path: '/coffee-timer',
    title: 'Coffee Timer – Pour-Over & French Press | WebCountDownTimer',
    description:
      'Brew balanced specialty coffee with multi-stage bloom and pour countdowns for V60 Pour-Over, 4-minute French Press, AeroPress, and Chemex.',
  },
  '/study-timer': {
    path: '/study-timer',
    title: 'Study Timer – 50/10 & Exam Focus Clock | WebCountDownTimer',
    description:
      'Structure academic revision and homework with 50/10 Ultradian blocks, 25/5 Pomodoro sprints, and 90-minute mock exam countdowns with session logs.',
  },
  '/reading-timer': {
    path: '/reading-timer',
    title: 'Reading Timer – Silent Reading Clock | WebCountDownTimer',
    description:
      'Build daily reading habits and run classroom Sustained Silent Reading (SSR) blocks with a calm countdown clock and optional 5-minute reflection prompt.',
  },
  '/break-timer': {
    path: '/break-timer',
    title: 'Break Timer – Desk Stretch & Rest Clock | WebCountDownTimer',
    description:
      'Prevent desk fatigue with one-click 5-minute micro-break, 15-minute coffee rest, and 30-minute lunch countdowns featuring gentle return chimes.',
  },
  '/eye-break-timer': {
    path: '/eye-break-timer',
    title: '20-20-20 Eye Break Timer – Vision Rest | WebCountDownTimer',
    description:
      'Relieve digital eye strain with an automated 20-20-20 cycle that reminds you every 20 minutes to focus 20 feet away for a refreshing 20-second rest.',
  },
  '/tabata-timer': {
    path: '/tabata-timer',
    title: 'Tabata Timer – 20s Work / 10s Rest HIIT | WebCountDownTimer',
    description:
      'Train with the official 4-minute Tabata HIIT protocol: 8 rounds of 20 seconds maximum effort and 10 seconds rest with bold color shifts and beeps.',
  },
  '/boxing-timer': {
    path: '/boxing-timer',
    title: 'Boxing Timer – 3-Min Round & Gym Bell | WebCountDownTimer',
    description:
      'Time pro 3-minute boxing, 2-minute amateur, and 5-minute MMA sparring rounds with 60-second corner rests, 10-second clapper warnings, and gym bells.',
  },
  '/meditation-timer': {
    path: '/meditation-timer',
    title: 'Meditation Timer – Singing Bowl Clock | WebCountDownTimer',
    description:
      'Sit in quiet mindfulness with a serene meditation countdown featuring gentle preparation buffer, interval mindfulness bells, and resonant bowl chimes.',
  },
  '/breathing-timer': {
    path: '/breathing-timer',
    title: 'Breathing Timer – Box & 4-7-8 Pacer | WebCountDownTimer',
    description:
      'Calm your nervous system with an expanding visual breathwork pacer supporting 4-4-4-4 Box Breathing, 4-7-8 Relaxation, and Coherent 5.5s breathing.',
  },
  '/chess-clock': {
    path: '/chess-clock',
    title: 'Chess Clock – Two-Player Blitz Timer | WebCountDownTimer',
    description:
      'Play over-the-board chess and two-player tabletop games with Bullet (1m), Blitz (3m/5m), and Rapid (10m) presets, spacebar switching, and move counts.',
  },
  '/quiz-timer': {
    path: '/quiz-timer',
    title: 'Quiz Timer – Rapid Trivia Buzzer Clock | WebCountDownTimer',
    description:
      'Run lively classroom review games and trivia nights with a per-question countdown featuring 10s–60s presets, instant N-key reset, and buzzer sound.',
  },
  '/classroom-scoreboard': {
    path: '/classroom-scoreboard',
    title: 'Classroom Scoreboard – Team Point Board | WebCountDownTimer',
    description:
      'Track live points for up to 8 classroom teams on your smartboard with editable team names, +1/+5/+10/-1 score buttons, and automatic leader ranking.',
  },
  '/bingo-caller': {
    path: '/bingo-caller',
    title: 'Bingo Caller – 75-Ball Number Generator | WebCountDownTimer',
    description:
      'Host classroom and community bingo games with an unbiased 75-ball B-I-N-G-O random number caller, call history log, and master verification board.',
  },
  '/seating-chart-maker': {
    path: '/seating-chart-maker',
    title: 'Seating Chart Maker – Desk Grid Tool | WebCountDownTimer',
    description:
      'Generate randomized classroom desk seating charts in seconds. Customize rows and columns, shuffle student placements fairly, and export to CSV.',
  },
  '/guides/how-accurate-online-timers-work': {
    path: '/guides/how-accurate-online-timers-work',
    title: 'How Accurate Online Timers Work – Guide | WebCountDownTimer',
    description:
      'Learn how accurate online timers prevent browser tab throttling using Date.now() epoch deltas, performance.now(), Screen Wake Lock, and Web Audio.',
  },
};


/**
 * Builds a complete, compliant Next.js Metadata object for any registered route
 * or dynamic route with:
 * - Unique <title> (< 60 chars, primary keyword first, brand last)
 * - Unique meta description (130-155 chars)
 * - Self-referencing absolute canonical URL (no trailing slash, no query strings)
 * - Matching og:title, og:description, og:url (never homepage fallback)
 */
export function buildPageMetadata(
  routePath: string,
  custom?: {
    title?: string;
    description?: string;
    keywords?: string[];
    noIndex?: boolean;
  }
): Metadata {
  const normalizedKey =
    routePath === '/' || routePath === ''
      ? '/'
      : `/${routePath.split('?')[0].split('#')[0].replace(/^\/+|\/+$/g, '')}`;

  const entry = ROUTE_SEO_REGISTRY[normalizedKey];
  const title = custom?.title ?? entry?.title ?? 'Online Countdown Timer | WebCountDownTimer';
  const description =
    custom?.description ??
    entry?.description ??
    'Free online countdown timers, visual clocks, stopwatches, stage monitors, world clocks, and time calculators for classrooms, events, and daily focus.';
  const canonical = getCanonicalUrl(normalizedKey);
  const keywords = custom?.keywords ?? entry?.keywords;
  const noIndex = custom?.noIndex ?? entry?.noIndex ?? false;

  return {
    title,
    description,
    ...(keywords && keywords.length > 0 ? { keywords } : {}),
    ...(noIndex
      ? {
          robots: {
            index: false,
            follow: true,
          },
        }
      : {}),
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'WebCountDownTimer',
      type: 'website',
      images: [
        {
          url: '/logo.svg',
          width: 512,
          height: 512,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/logo.svg'],
    },
  };
}

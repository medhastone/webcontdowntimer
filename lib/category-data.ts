export interface CategoryToolItem {
  name: string;
  description: string;
  href: string;
  iconName: string;
  badge?: string;
  tier?: 'trending' | 'hot' | 'new';
}

export interface ComparisonRow {
  tool: string;
  bestFor: string;
  keyFeatures: string;
  exampleUseCases: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface RelatedCategoryItem {
  title: string;
  description: string;
  href: string;
  iconName: string;
}

export interface CategoryData {
  slug: string;
  parentName: string;
  parentHref: string;
  categoryKicker: string;
  title: string;
  description: string;
  heroCtaText: string;
  heroCtaHref: string;
  heroImage: {
    src: string;
    alt: string;
    chalkText?: string;
  };
  featuredTool: {
    kicker: string;
    title: string;
    description: string;
    href: string;
    checklist: string[];
    defaultDurationSec: number;
    presets: Array<{ label: string; sec: number }>;
    photo?: {
      src: string;
      alt: string;
      caption?: string;
    };
  };
  toolsHeading: string;
  toolsKicker: string;
  tools: CategoryToolItem[];
  comparisonTable: {
    title: string;
    subtitle: string;
    rows: ComparisonRow[];
  };
  guide: {
    kicker: string;
    title: string;
    lead: string;
    tableOfContents: string[];
    quickTip: string;
    whatTitle: string;
    whatBody: string;
    howTitle: string;
    howBody: string;
    quote: string;
    practicalTitle: string;
    practicalItems: string[];
    tipsTitle: string;
    tipsItems: string[];
    mistakesTitle: string;
    mistakesItems: string[];
  };
  faqs: FaqItem[];
  relatedCategories: RelatedCategoryItem[];
}

export const CATEGORIES_DATA: Record<string, CategoryData> = {
  education: {
    slug: 'education',
    parentName: 'Education',
    parentHref: '/category/education',
    categoryKicker: 'EDUCATION & CLASSROOM TOOLS',
    title: 'Classroom Timers',
    description:
      'Simple and effective timers for teachers, students and learning environments. Keep your classroom focused, manage activities and create a better learning experience.',
    heroCtaText: 'Open Classroom Timer',
    heroCtaHref: '/classroom-timer',
    heroImage: {
      src: '/images/cat-hero-education.webp',
      alt: 'Classroom desk with vintage timer clock, green plant and chalkboard',
      chalkText: 'Good Ideas Take Time',
    },
    featuredTool: {
      kicker: 'FEATURED TOOL',
      title: 'Classroom Timer',
      description:
        'A visual and easy-to-use timer designed for classroom activities, study sessions and group work.',
      href: '/classroom-timer',
      checklist: [
        'Visual countdown',
        'Fullscreen mode',
        'Optional alarm sound',
        'Works on all devices',
      ],
      defaultDurationSec: 600, // 10:00
      presets: [
        { label: '1 min', sec: 60 },
        { label: '5 min', sec: 300 },
        { label: '10 min', sec: 600 },
        { label: '15 min', sec: 900 },
        { label: '20 min', sec: 1200 },
        { label: '30 min', sec: 1800 },
      ],
    },
    toolsHeading: 'Explore All Education & Classroom Tools',
    toolsKicker: 'ALL EDUCATION TOOLS',
    tools: [
      {
        name: 'Sensory Visual Timers',
        description: 'Calm, low-distraction visual timers with gentle motion and muted audio by default.',
        href: '/timers/sensory-timers',
        iconName: 'Clock',
        badge: 'New',
      },
      {
        name: 'Train Timer',
        description: 'Railway station departure-board countdown with a moving train animation for classroom transitions.',
        href: '/timers/train-timer',
        iconName: 'Clock',
        badge: 'New',
      },
      {
        name: 'Forest Fire Timer',
        description: 'Creative nature-inspired forest countdown with a stylized spreading glow for classroom activities.',
        href: '/timers/forest-fire-timer',
        iconName: 'Clock',
        badge: 'New',
      },
      {
        name: 'Spinner Timer',
        description: 'Interactive spinning countdown wheel with circular progress segments for classroom games.',
        href: '/timers/spinner-timer',
        iconName: 'Clock',
        badge: 'New',
      },
      {
        name: 'Flip Timer',
        description: 'Retro mechanical split-flap countdown timer with 3D flipping cards for study sessions.',
        href: '/timers/flip-timer',
        iconName: 'Clock',
        badge: 'New',
      },
      {
        name: 'Classroom Timer',
        description: 'A simple timer for classroom activities, lessons and group work.',
        href: '/classroom-timer',
        iconName: 'GraduationCap',
        badge: 'Popular',
      },
      {
        name: 'Visual Timer',
        description: 'See time disappear visually. Great for younger students.',
        href: '/visual-timer',
        iconName: 'Clock',
      },
      {
        name: 'Sand Timer',
        description: 'Realistic digital glass hourglass with falling sand for classroom transitions and games.',
        href: '/timers/sand-timer',
        iconName: 'Hourglass',
        badge: 'Popular',
      },
      {
        name: 'Liquid Timer',
        description: 'Smooth draining liquid glass timer with rising bubbles and 6 color styles.',
        href: '/timers/liquid-timer',
        iconName: 'Clock',
        badge: 'New',
      },
      {
        name: 'Pomodoro Timer',
        description: 'Stay focused with structured study sessions.',
        href: '/pomodoro-timer',
        iconName: 'Tomato',
      },
      {
        name: 'Interval Timer',
        description: 'Set work and break intervals for learning.',
        href: '/interval-timer',
        iconName: 'RotateCcw',
      },
      {
        name: 'Random Name Picker',
        description: 'Pick a random student or group fairly and quickly.',
        href: '/random-name-picker',
        iconName: 'Users',
      },
      {
        name: 'Classroom Stopwatch',
        description: 'Accurate and simple stopwatch for activities and tests.',
        href: '/stopwatch',
        iconName: 'Stopwatch',
      },
      {
        name: 'Time Tracker',
        description: 'Track time spent on study sessions and assignments.',
        href: '/time-duration-calculator',
        iconName: 'BarChart3',
      },
      {
        name: 'Sound Level Meter',
        description: 'Monitor classroom noise levels to keep a focused environment.',
        href: '/classroom-noise-meter',
        iconName: 'Volume2',
      },
    ],
    comparisonTable: {
      title: 'Which Education Tool Should You Use?',
      subtitle:
        'Different tools work better for different classroom and learning situations. This quick guide can help you choose the right tool.',
      rows: [
        {
          tool: 'Classroom Timer',
          bestFor: 'Managing class activities',
          keyFeatures: 'Countdown, visual display, alarm',
          exampleUseCases: 'Lessons, group work, transitions',
        },
        {
          tool: 'Visual Timer',
          bestFor: 'Younger students, focus',
          keyFeatures: 'Visual countdown, large display',
          exampleUseCases: 'Early education, special needs',
        },
        {
          tool: 'Pomodoro Timer',
          bestFor: 'Individual study',
          keyFeatures: 'Work/break intervals',
          exampleUseCases: 'Study sessions, homework',
        },
        {
          tool: 'Interval Timer',
          bestFor: 'Repeating activities',
          keyFeatures: 'Custom intervals, multiple rounds',
          exampleUseCases: 'Class rotations, practice sessions',
        },
        {
          tool: 'Random Name Picker',
          bestFor: 'Fair participation',
          keyFeatures: 'Random selection, customizable list',
          exampleUseCases: 'Calling on students, group formation',
        },
        {
          tool: 'Stopwatch',
          bestFor: 'Timing specific tasks',
          keyFeatures: 'Count up, lap times',
          exampleUseCases: 'Experiments, tests, presentations',
        },
      ],
    },
    guide: {
      kicker: 'CLASSROOM & SENSORY PACING BRIEF',
      title: 'Structuring K–12 Transitions, Station Rotations, and Low-Stimulus Study Blocks',
      lead:
        'In a room of 28 students, verbal time warnings ("five minutes left!") often trigger more chatter than focus. Projecting a continuous visual arc or falling-sand timer on the front smartboard externalizes the clock so students self-regulate their cleanup and writing pace without constant teacher intervention.',
      tableOfContents: [
        'Why Externalized Time Cues Work in Classrooms',
        'Matching Sensory Load to Grade Level',
        'Smartboard & Chromebook Setup Protocol',
        'Daily Bell-Ringer & Station Rotation Playbooks',
        'Acoustic & Visual Pacing Adjustments',
        'Classroom Timing Pitfalls to Avoid',
        'Technical & Operational Reference',
      ],
      quickTip:
        'For neurodivergent or sensory-sensitive classrooms, launch the Frost, Liquid, or Sand Timer with the audio bell muted—the visual completion state alone signals the transition without triggering startle responses.',
      whatTitle: 'Matching Sensory Load to Grade Level & Neurodiversity',
      whatBody:
        'Early elementary learners (K–2) have not yet developed abstract numerical time perception; a numeral reading "04:15" carries little meaning compared to a 360-degree colored wedge that visibly shrinks to a sliver. For grades 3–8, station rotation timers and split-flap clocks add structure to 12-minute lab intervals, while high school AP/IB proctors rely on high-contrast digital readouts paired with 10-minute warning cues.',
      howTitle: 'Smartboard & Chromebook Projection Protocol',
      howBody:
        'Connect your teacher laptop or Chromebook to the classroom interactive display, choose a high-contrast visual theme, and press F for borderless full-screen projection so bookmarks and browser tabs stay hidden.',
      quote:
        '“When the smartboard shows the remaining wedge of time, the teacher stops being the bad guy who cuts off the activity—the clock becomes a neutral, shared boundary for the whole room.”',
      practicalTitle: 'Daily Bell-Ringer & Station Rotation Playbooks',
      practicalItems: [
        '5-Minute Bell-Ringer Warmup: Start the Visual Timer as the hallway bell rings so students settle into their daily journal prompt immediately.',
        '12-Minute Literacy & STEM Stations: Pair a 12-minute work countdown with a 90-second Train Timer transition buffer for resetting lab materials.',
        'Silent Sustained Reading (SSR): Project the Moon, Snow, or Candle Timer in muted full-screen mode to anchor a calm 20-minute reading block.',
        'Fair Cold-Calling & Group Splits: Use the Random Name Picker with "Remove after pick" enabled so every student on the roster participates once before the cycle resets.',
        'Independent Seatwork Decibel Monitoring: Run the Classroom Noise Meter on a corner tablet so table groups see real-time green/amber/red volume feedback.',
      ],
      tipsTitle: 'Acoustic & Visual Pacing Adjustments',
      tipsItems: [
        'Build a 2-minute cleanup buffer into every art or science block rather than starting cleanup after the main timer hits 00:00.',
        'Use Fullscreen mode (F key) on classroom projectors so browser tabs and email notifications never appear on screen.',
        'Select soft acoustic chimes—or mute audio completely—during standardized testing and quiet reading blocks.',
      ],
      mistakesTitle: 'Classroom Timing Pitfalls to Avoid',
      mistakesItems: [
        'Switching between stations with zero transition buffer, which steals 3–4 minutes from the next group’s learning window.',
        'Leaving projector audio at 100% volume before testing the end-of-round chime in a quiet room.',
        'Using high-motion particle timers during high-stakes written assessments where minimalist radial or numeric displays reduce distraction.',
      ],
    },
    faqs: [
      {
        q: 'Are the classroom timers free to use?',
        a: 'Yes, 100% free with no limits, accounts, or subscriptions required.',
      },
      {
        q: 'Can I customize the alarm sound?',
        a: 'Yes, you can toggle audio on or off and choose between Acoustic, Digital, and Soft bell chimes.',
      },
      {
        q: 'Can I use these tools on tablets and mobile devices?',
        a: 'Yes! All tools are fully responsive, touch-friendly, and run natively in any mobile browser.',
      },
      {
        q: 'Which timer is best for young children?',
        a: 'The Visual Timer is ideal because the shrinking circular colored disc communicates elapsed time without requiring children to read numbers.',
      },
      {
        q: 'Do the timers work in fullscreen mode?',
        a: 'Yes, click the Fullscreen button or press the "F" key on your keyboard to project a clean, borderless display on classroom monitors.',
      },
      {
        q: 'Do I need to create an account?',
        a: 'No account, login, or email is ever needed. Everything runs instantly in your browser.',
      },
    ],
    relatedCategories: [
      {
        title: 'Timers & Stopwatches',
        description: 'Countdown timers, stopwatches and more.',
        href: '/category/timers',
        iconName: 'Tv',
      },
      {
        title: 'Events & Presentation Tools',
        description: 'Stage timers and tools for events.',
        href: '/category/events',
        iconName: 'Users',
      },
      {
        title: 'Time Calculators',
        description: 'Useful calculators for everyday time and date calculations.',
        href: '/category/calculators',
        iconName: 'Calculator',
      },
    ],
  },

  timers: {
    slug: 'timers',
    parentName: 'Timers',
    parentHref: '/category/timers',
    categoryKicker: 'EVERYDAY TIMERS & STOPWATCHES',
    title: 'Timers & Stopwatches',
    description:
      'Precision countdown timers, multi-lap stopwatches, and interval clocks for daily tasks, exercise, presentations, and work sprints.',
    heroCtaText: 'Open Countdown Timer',
    heroCtaHref: '/countdown-timer',
    heroImage: {
      src: '/images/cat-timers.webp',
      alt: 'Classic analog alarm clock on wooden table',
      chalkText: 'Track Every Second',
    },
    featuredTool: {
      kicker: 'FEATURED TOOL',
      title: 'Countdown Timer',
      description:
        'A clean, reliable countdown timer with custom presets, audio alerts, and full-screen projection mode.',
      href: '/countdown-timer',
      checklist: [
        'High-precision millisecond timing',
        'Keyboard shortcuts (Space, R, F)',
        'Customizable sound themes',
        'Overtime count-up support',
      ],
      defaultDurationSec: 900, // 15:00
      presets: [
        { label: '1 min', sec: 60 },
        { label: '5 min', sec: 300 },
        { label: '10 min', sec: 600 },
        { label: '15 min', sec: 900 },
        { label: '30 min', sec: 1800 },
        { label: '1 hour', sec: 3600 },
      ],
    },
    toolsHeading: 'Explore All Everyday Timers & Stopwatches',
    toolsKicker: 'ALL TIMERS',
    tools: [
      {
        name: 'Sensory Visual Timers',
        description: 'A dedicated collection of calm, low-distraction sensory visual timers with gentle motion and filters.',
        href: '/timers/sensory-timers',
        iconName: 'Clock',
        badge: 'New',
      },
      {
        name: 'Flip Clock',
        description: 'Realistic retro split-flap clock with Live Clock, Countdown, and Stopwatch modes.',
        href: '/timers/flip-clock',
        iconName: 'Clock',
        badge: 'New',
      },
      {
        name: 'Forest Fire Timer',
        description: 'Creative nature-inspired forest countdown with a stylized spreading ember glow across 4 themes.',
        href: '/timers/forest-fire-timer',
        iconName: 'Clock',
        badge: 'New',
      },
      {
        name: 'Train Timer',
        description: 'Railway departure-board countdown with a moving illustrated train and custom session names.',
        href: '/timers/train-timer',
        iconName: 'Clock',
        badge: 'New',
      },
      {
        name: 'Flip Timer',
        description: 'Retro mechanical split-flap countdown timer with 3D flipping cards and 4 display themes.',
        href: '/timers/flip-timer',
        iconName: 'Clock',
        badge: 'New',
      },
      {
        name: 'Spinner Timer',
        description: 'Clear and interactive spinning countdown wheel with circular progress segments and 6 themes.',
        href: '/timers/spinner-timer',
        iconName: 'Clock',
        badge: 'New',
      },
      {
        name: 'Lava Lamp Timer',
        description: 'Retro and relaxing lava lamp countdown timer with rising and merging wax blobs.',
        href: '/timers/lava-lamp-timer',
        iconName: 'Clock',
        badge: 'New',
      },
      {
        name: 'Galaxy Timer',
        description: 'Stunning space-themed starfield and spiral galaxy visual countdown for study and focus.',
        href: '/timers/galaxy-timer',
        iconName: 'Clock',
        badge: 'New',
      },
      {
        name: 'Snow Timer',
        description: 'Calm winter snowfall countdown with accumulating snowdrifts and cozy cabin scenes.',
        href: '/timers/snow-timer',
        iconName: 'Clock',
        badge: 'New',
      },
      {
        name: 'Frost Timer',
        description: 'Calming frosted-glass visual countdown with delicate ice crystal patterns spreading from the edges.',
        href: '/timers/frost-timer',
        iconName: 'Clock',
        badge: 'New',
      },
      {
        name: 'Lichen Timer',
        description: 'Nature-inspired organic lichen growth countdown over natural stone and bark surfaces.',
        href: '/timers/lichen-timer',
        iconName: 'Clock',
        badge: 'New',
      },
      {
        name: 'Coral Timer',
        description: 'Relaxing coral growth visual countdown with underwater reef themes.',
        href: '/timers/coral-timer',
        iconName: 'Clock',
        badge: 'New',
      },
      {
        name: 'Bubble Timer',
        description: 'Gentle floating bubble visual countdown with Ocean Blue and Seafoam themes.',
        href: '/timers/bubble-timer',
        iconName: 'Clock',
        badge: 'New',
      },
      {
        name: 'Sun Timer',
        description: 'Warm illustrated sky with a sun that travels along a smooth arc as time passes.',
        href: '/timers/sun-timer',
        iconName: 'Clock',
        badge: 'New',
      },
      {
        name: 'Moon Timer',
        description: 'Calming night-sky lunar visual countdown with customizable moon styles.',
        href: '/timers/moon-timer',
        iconName: 'Clock',
        badge: 'New',
      },
      {
        name: 'Heart Timer',
        description: 'Balanced heart-shaped visual countdown with draining fill and subtle pulse.',
        href: '/timers/heart-timer',
        iconName: 'Clock',
        badge: 'New',
      },
      {
        name: 'Picture Reveal Timer',
        description: 'Interactive hidden-picture tile reveal countdown for classrooms and guessing games.',
        href: '/timers/picture-reveal-timer',
        iconName: 'Clock',
        badge: 'New',
      },
      {
        name: 'Aesthetic Timer',
        description: 'Refined digital desk countdown with 8 curated visual themes.',
        href: '/timers/aesthetic-timer',
        iconName: 'Clock',
        badge: 'New',
      },
      {
        name: 'Sand Timer',
        description: 'Realistic digital glass hourglass with falling golden sand particles.',
        href: '/timers/sand-timer',
        iconName: 'Hourglass',
        badge: 'Popular',
      },
      {
        name: 'Liquid Timer',
        description: 'Realistic transparent glass countdown with draining liquid, bubbles, and 6 color themes.',
        href: '/timers/liquid-timer',
        iconName: 'Clock',
        badge: 'Popular',
      },
      {
        name: 'Countdown Timer',
        description: 'Versatile timer with presets, chimes, and full screen display.',
        href: '/countdown-timer',
        iconName: 'Hourglass',
        badge: 'Popular',
      },
      {
        name: 'Visual Timer',
        description: 'Circular shrinking wedge disc for intuitive visual pacing.',
        href: '/visual-timer',
        iconName: 'Clock',
      },
      {
        name: 'Stopwatch',
        description: 'Single-tap precision stopwatch with split times and lap logging.',
        href: '/stopwatch',
        iconName: 'Stopwatch',
      },
      {
        name: 'Multi-Stopwatch',
        description: 'Track multiple runners, relay handoffs, or race lanes at once.',
        href: '/multi-stopwatch',
        iconName: 'Users',
      },
      {
        name: 'Interval Timer',
        description: 'Custom work and rest cycles for fitness and high-intensity sprints.',
        href: '/interval-timer',
        iconName: 'RotateCcw',
      },
      {
        name: 'Pomodoro Timer',
        description: '25-minute focus intervals and short breaks for maximum output.',
        href: '/pomodoro-timer',
        iconName: 'Tomato',
      },
      {
        name: 'Online Alarm Clock',
        description: 'Set alarms with custom repeat times and pleasant morning chimes.',
        href: '/online-alarm-clock',
        iconName: 'Bell',
      },
      {
        name: 'Embed Timer Widget',
        description: 'Generate clean embed code for Notion, blogs, and presentations.',
        href: '/embed-timer',
        iconName: 'Code2',
      },
    ],
    comparisonTable: {
      title: 'Choosing Between a Countdown Timer and Stopwatch',
      subtitle:
        'Select the ideal timing tool based on whether your task has a fixed deadline or requires measuring elapsed duration.',
      rows: [
        {
          tool: 'Countdown Timer',
          bestFor: 'Deadlines, cooking, meetings',
          keyFeatures: 'Counts down to 00:00, alarm chime',
          exampleUseCases: 'Classrooms, speaking, presentations',
        },
        {
          tool: 'Visual Timer',
          bestFor: 'Kids, ADHD focus, sprint demos',
          keyFeatures: 'Shrinking 360° circular disc',
          exampleUseCases: 'Quick turn-and-talks, study blocks',
        },
        {
          tool: 'Stopwatch',
          bestFor: 'Athletic races, speech trials',
          keyFeatures: 'Counts up from 0, lap splits',
          exampleUseCases: 'Track & field, science experiments',
        },
        {
          tool: 'Multi-Stopwatch',
          bestFor: 'Group trials, relay handoffs',
          keyFeatures: 'Batch start/stop, CSV export',
          exampleUseCases: 'Swim meets, agile team demos',
        },
        {
          tool: 'Interval Timer',
          bestFor: 'HIIT, Tabata, boxing rounds',
          keyFeatures: 'Work & rest periods, round alerts',
          exampleUseCases: 'Circuit training, workout routines',
        },
      ],
    },
    guide: {
      kicker: 'BROWSER CHRONOMETRY & TIMING HANDBOOK',
      title: 'Countdown Clocks, Split-Lap Stopwatches, and Visual Timers',
      lead:
        'From one-click kitchen and study countdowns to multi-lane race stopwatches and calming visual timers, this directory organizes every daily timekeeping tool by visual style and workflow.',
      tableOfContents: [
        'Fixed-Deadline Countdowns vs. Open-Ended Stopwatches',
        'Keyboard Controls & Fullscreen Display Setup',
        'High-Frequency Daily Timing Workflows',
        'Operator Shortcuts & Audio Calibration',
        'Common Timing Pitfalls to Avoid',
        'Technical & Operational Reference',
      ],
      quickTip:
        'Press Spacebar to start or pause any timer, R to reset to your starting duration, and F to enter borderless fullscreen projection mode.',
      whatTitle: 'Fixed-Deadline Countdowns vs. Open-Ended Stopwatches',
      whatBody:
        'Choose a countdown timer when your activity has a fixed time budget—such as a 15-minute standup meeting, a 6-minute soft-boiled egg, or a 45-minute exam paper. Choose a stopwatch or multi-stopwatch when you need to measure how long a process actually takes from 00:00.00 upward, such as logging 400-meter track splits, laboratory titration reactions, or multi-lane swim heats.',
      howTitle: 'Keyboard Controls & Fullscreen Display Setup',
      howBody:
        'Every timer supports instant keyboard shortcuts for hands-free control: press Spacebar to start or pause, R to reset, M to toggle the completion chime, and F to expand the clock across your entire screen.',
      quote:
        '“A reliable clock should disappear into the workflow—accurate when minimized in a background tab, legible from 20 feet away in fullscreen, and silent until the exact second you ask for a cue.”',
      practicalTitle: 'High-Frequency Daily Timing Workflows',
      practicalItems: [
        'Agile Standups & Sprint Demos: Run a 15-minute Countdown or Visual Timer on a shared screen to keep team updates crisp.',
        'Multi-Lane Athletic & Lab Trials: Use the Multi-Stopwatch to time up to 8 independent lanes simultaneously and export lap deltas to CSV.',
        'Kitchen & Culinary Precision: Set dedicated 3-minute, 6-minute, or 10-minute boiling and steeping countdowns with audible Web Audio chimes.',
        'Ambient Desk Timekeeping: Keep the Flip Clock or Aesthetic Timer running on a secondary display for continuous peripheral time awareness.',
      ],
      tipsTitle: 'Operator Shortcuts & Audio Calibration',
      tipsItems: [
        'Use keyboard shortcuts (Space to start/pause, R to reset, F for fullscreen, M to mute) for eyes-free operation.',
        'Click once anywhere on the timer page before walking away so your browser unlocks Web Audio playback permissions.',
      ],
      mistakesTitle: 'Browser Power-Saving Traps to Avoid',
      mistakesItems: [
        'Closing the browser tab completely instead of leaving it pinned when relying on an in-browser alarm chime.',
        'Forgetting to test system mute and Bluetooth audio routing before timing a public group session.',
      ],
    },
    faqs: [
      {
        q: 'When should I use a visual timer instead of a digital countdown?',
        a: 'Visual timers (such as circular, sand, liquid, or rainbow timers) show remaining time as a shrinking shape or color fill, making it easier for children, students, and groups to judge pacing from across a room.',
      },
      {
        q: 'Can I set a countdown to a specific clock time of day?',
        a: 'Yes, most visual and countdown timers include an End Time mode that counts down to a target clock time such as 3:30 PM.',
      },
      {
        q: 'Can I export lap times from the stopwatch?',
        a: 'Yes! Both the Online Stopwatch and Multi-Stopwatch include one-click CSV export for spreadsheets and athletic records.',
      },
    ],
    relatedCategories: [
      {
        title: 'Education & Classroom Tools',
        description: 'Timers and pickers for teachers and students.',
        href: '/category/education',
        iconName: 'GraduationCap',
      },
      {
        title: 'Events & Presentation Tools',
        description: 'Stage timers, speaker monitors, and event tools.',
        href: '/category/events',
        iconName: 'Users',
      },
      {
        title: 'World Clock & Time Zones',
        description: 'Global clocks and time-zone converters.',
        href: '/world-clock',
        iconName: 'Globe',
      },
    ],
  },

  events: {
    slug: 'events',
    parentName: 'Events',
    parentHref: '/category/events',
    categoryKicker: 'EVENTS & PRESENTATION TOOLS',
    title: 'Events & Presentation Tools',
    description:
      'Professional stage timers, speaker confidence monitors, and event countdown tools for conferences, keynote speeches, and live broadcasts.',
    heroCtaText: 'Open Stage Timer',
    heroCtaHref: '/stage-timer',
    heroImage: {
      src: '/images/cat-events.webp',
      alt: 'Stage microphone in auditorium spotlight',
      chalkText: 'Showtime Pacing',
    },
    featuredTool: {
      kicker: 'FEATURED TOOL',
      title: 'Stage Timer & Confidence Monitor',
      description:
        'Multi-screen live event timing with operator controller and fullscreen speaker monitor sync.',
      href: '/stage-timer',
      checklist: [
        'Zero-latency BroadcastChannel sync',
        'Overtime count-up (+MM:SS)',
        'Live operator flash prompts',
        'Dedicated blackout confidence screen',
      ],
      defaultDurationSec: 1200, // 20:00
      presets: [
        { label: '5 min', sec: 300 },
        { label: '10 min', sec: 600 },
        { label: '15 min', sec: 900 },
        { label: '20 min', sec: 1200 },
        { label: '30 min', sec: 1800 },
        { label: '45 min', sec: 2700 },
      ],
    },
    toolsHeading: 'Explore All Event & Presentation Tools',
    toolsKicker: 'ALL EVENT TOOLS',
    tools: [
      {
        name: 'Train Timer',
        description: 'Railway departure-board countdown with a moving train for event schedules and session breaks.',
        href: '/timers/train-timer',
        iconName: 'Clock',
        badge: 'New',
        tier: 'new',
      },
      {
        name: 'Flip Timer',
        description: 'Retro mechanical split-flap countdown timer for conference rooms and keynote breaks.',
        href: '/timers/flip-timer',
        iconName: 'Clock',
        badge: 'New',
        tier: 'new',
      },
      {
        name: 'Flip Clock',
        description: 'Fullscreen retro split-flap Live Clock, Countdown, and Stopwatch for lobby and stage displays.',
        href: '/timers/flip-clock',
        iconName: 'Clock',
        badge: 'New',
        tier: 'new',
      },
      {
        name: 'Stage Timer',
        description: 'Full operator controller and live speaker monitor sync.',
        href: '/stage-timer',
        iconName: 'Tv',
        badge: 'Hot',
        tier: 'hot',
      },
      {
        name: 'Presentation Timer',
        description: 'Segmented slide pacing and pitch deck rehearsal timing.',
        href: '/presentation-timer',
        iconName: 'Presentation',
        badge: 'Trending',
        tier: 'trending',
      },
      {
        name: 'Speaker Timer',
        description: 'High-contrast confidence monitor for podiums and stages.',
        href: '/speaker-timer',
        iconName: 'Mic',
        badge: 'Hot',
        tier: 'hot',
      },
      {
        name: 'Toastmasters Timer',
        description: 'Green, Amber, Red signaling cards for speech contests.',
        href: '/toastmasters-timer',
        iconName: 'Trophy',
        badge: 'Trending',
        tier: 'trending',
      },
      {
        name: 'Debate Timer',
        description: 'Alternating affirmative and negative debate speech clocks.',
        href: '/debate-timer',
        iconName: 'Scale',
        badge: 'Trending',
        tier: 'trending',
      },
      {
        name: 'Event Countdown',
        description: 'Days, hours, minutes countdown to product launches.',
        href: '/event-countdown-timer',
        iconName: 'Calendar',
        badge: 'Hot',
        tier: 'hot',
      },
      {
        name: 'Webinar Timer',
        description: 'Virtual event pacing for Zoom, Teams, and YouTube Live.',
        href: '/webinar-timer',
        iconName: 'Tv',
        badge: 'Trending',
        tier: 'trending',
      },
      {
        name: 'Sermon Timer',
        description: 'Discreet visual pacing for houses of worship and lectures.',
        href: '/sermon-timer',
        iconName: 'BookOpen',
        badge: 'Trending',
        tier: 'trending',
      },
    ],
    comparisonTable: {
      title: 'Which Presentation Tool Fits Your Event?',
      subtitle:
        'Match the tool to your stage setup: single podium, multi-track conference, or contest judging.',
      rows: [
        {
          tool: 'Stage Timer',
          bestFor: 'Conferences & live streams',
          keyFeatures: 'Multi-screen sync, operator cues',
          exampleUseCases: 'Keynotes, panel discussions',
        },
        {
          tool: 'Presentation Timer',
          bestFor: 'Pitch decks & dissertations',
          keyFeatures: 'Section pacing, slide transition chimes',
          exampleUseCases: 'Investor pitches, thesis defense',
        },
        {
          tool: 'Speaker Timer',
          bestFor: 'Podium displays',
          keyFeatures: 'Large numerals, overtime tracking',
          exampleUseCases: 'Town halls, guest lectures',
        },
        {
          tool: 'Toastmasters Timer',
          bestFor: 'Speech clubs & contests',
          keyFeatures: 'Green/Yellow/Red card flags',
          exampleUseCases: 'Table Topics, speech evaluations',
        },
      ],
    },
    guide: {
      kicker: 'STAGE & AV PRODUCTION HANDBOOK',
      title: 'Running Downstage Confidence Monitors, Toastmasters Contests, and Debate Rounds',
      lead:
        'In live event production, an audible buzzer in the middle of a keynote speech ruins the room’s atmosphere—yet allowing a speaker to run 8 minutes over wrecks the entire conference catering and breakout schedule. Professional stage timing relies on high-contrast visual green/amber/red thresholds positioned at the foot of the stage.',
      tableOfContents: [
        'Why Silent Visual Cues Beat Audible Buzzers',
        'Downstage Confidence Monitor Architecture',
        'Cross-Window BroadcastChannel Synchronization',
        'Run-of-Show Playbooks by Event Format',
        'AV Booth & Showcaller Operating Rules',
        'Live Production Failures to Prevent',
        'Technical & Operational Reference',
      ],
      quickTip:
        'Set your laptop’s HDMI output to "Extend Desktop" (never Mirror), drag the viewer window onto the downstage floor wedge, and press F for borderless fullscreen while keeping the operator controls on your booth laptop.',
      whatTitle: 'Downstage Confidence Monitor Architecture',
      whatBody:
        'A stage confidence monitor separates the backstage showcaller console from the speaker-facing floor display. While the presenter sees only giant tabular numerals (MM:SS) and unmistakable Green, Amber, and Red phase shifts from 15–25 feet away, the AV operator can nudge time (+1m / -1m), trigger silent flash cues, or push short text prompts ("START Q&A NOW") without touching the lectern.',
      howTitle: 'Cross-Window BroadcastChannel Synchronization',
      howBody:
        'Our Stage Timer synchronizes the operator controller and fullscreen viewer window across dual displays using the browser’s native BroadcastChannel API and local storage state replication. State updates propagate in under 2 milliseconds with zero reliance on fragile venue Wi-Fi or paid cloud relay subscriptions.',
      quote:
        '“When presenters know exactly where their 3-minute amber warning and 1-minute red wrap-up sit, their delivery relaxes—they stop rushing their opening slides and land their closing call-to-action on the second.”',
      practicalTitle: 'Run-of-Show Playbooks by Event Format',
      practicalItems: [
        '18-Minute TED-Style Keynotes: Set Amber at 03:00 remaining and Red at 01:00 remaining, with overtime counting up in red (+MM:SS) past 00:00.',
        '40-Minute Conference Breakouts (30m + 10m Q&A): Trigger the Amber phase at 10:00 remaining so the moderator knows to open floor microphones.',
        'Toastmasters International Speech Contests (5–7m): Configure Green at 05:00 elapsed, Yellow at 06:00, and Red at 07:00 with a silent 30-second grace window to 07:30.',
        'British Parliamentary & World Schools Debates: Ring single gavel bells at 01:00 and 06:00 (or 07:00 in WSDC) to bound the Point of Information (POI) window.',
      ],
      tipsTitle: 'AV Booth & Showcaller Operating Rules',
      tipsItems: [
        'Keep live text flash messages under 4 words in ALL CAPS ("2 MINS LEFT", "WRAP UP NOW", "MIC 2 LIVE") for instant reading speed.',
        'Let overtime count up (+01:45) rather than stopping at 00:00 so the stage manager knows exactly how much buffer to trim from the next intermission.',
      ],
      mistakesTitle: 'Live Production Failures to Prevent',
      mistakesItems: [
        'Leaving OS notifications, Slack banners, or screen savers active on the laptop driving the downstage HDMI feed.',
        'Placing the timer behind the speaker on the main projector wall where they must turn their back to the audience to check their time.',
      ],
    },
    faqs: [
      {
        q: 'How does multi-screen sync work without an account?',
        a: 'Our hybrid synchronization engine uses the native BroadcastChannel API and local storage state replication, allowing instant cross-window sync.',
      },
      {
        q: 'Can I send a custom message to the speaker screen?',
        a: 'Yes! The Operator Controller includes a Live Prompt tool that displays messages in bold letters on the confidence monitor.',
      },
      {
        q: 'Does it support overtime tracking?',
        a: 'Yes, when time expires, the timer automatically counts up in high-visibility red numerals (+01:23) so moderators know the exact overrun.',
      },
    ],
    relatedCategories: [
      {
        title: 'Timers & Stopwatches',
        description: 'Everyday countdowns and stopwatches.',
        href: '/category/timers',
        iconName: 'Hourglass',
      },
      {
        title: 'Education & Classroom Tools',
        description: 'Timers and classroom tools for learning.',
        href: '/category/education',
        iconName: 'GraduationCap',
      },
      {
        title: 'Time Calculators',
        description: 'Duration and date arithmetic calculators.',
        href: '/category/calculators',
        iconName: 'Calculator',
      },
    ],
  },

  fitness: {
    slug: 'fitness',
    parentName: 'Fitness',
    parentHref: '/category/fitness',
    categoryKicker: 'FITNESS & INTERVAL TIMERS',
    title: 'Fitness & Interval Timers',
    description:
      'High-intensity interval training, Tabata rounds, EMOM timers, and workout clocks designed for gyms, running tracks, and home fitness routines.',
    heroCtaText: 'Open Interval Timer',
    heroCtaHref: '/interval-timer',
    heroImage: {
      src: '/images/cat-fitness.webp',
      alt: 'Athletic gym training session with weights and stopwatch',
      chalkText: 'Push Every Second',
    },
    featuredTool: {
      kicker: 'FEATURED TOOL',
      title: 'Interval Timer & Tabata Clock',
      description:
        'Customizable work and rest intervals with high-volume audio beeps, large color-coded screen changes, and round counters.',
      href: '/interval-timer',
      checklist: [
        'Configurable work, rest, and warm-up sets',
        'High-decibel countdown beeps',
        'High-contrast green/red round visual cues',
        'Works offline in any mobile gym setting',
      ],
      defaultDurationSec: 45,
      presets: [
        { label: '20s / 10s Tabata', sec: 20 },
        { label: '30s / 30s HIIT', sec: 30 },
        { label: '40s / 20s Circuit', sec: 40 },
        { label: '60s / 60s Boxing', sec: 60 },
        { label: '2 min Round', sec: 120 },
        { label: '3 min Sparring', sec: 180 },
      ],
    },
    toolsHeading: 'Explore All Fitness & Training Tools',
    toolsKicker: 'ALL FITNESS TOOLS',
    tools: [
      {
        name: 'Interval Timer',
        description: 'Custom work and rest intervals with round counters.',
        href: '/interval-timer',
        iconName: 'RotateCcw',
        badge: 'Hot',
        tier: 'hot',
      },
      {
        name: 'Tabata Timer',
        description: 'Classic 20-second work and 10-second rest protocol for 8 rounds.',
        href: '/interval-timer',
        iconName: 'Flame',
        badge: 'Hot',
        tier: 'hot',
      },
      {
        name: 'Rings Timer',
        description: 'Concentric multi-ring progress display for multi-stage workouts and cooldowns.',
        href: '/timers/rings-timer',
        iconName: 'Clock',
        badge: 'Trending',
        tier: 'trending',
      },
      {
        name: 'Heart Timer',
        description: 'Rhythmic heart-shaped visual countdown for cardio, yoga, and recovery breathing.',
        href: '/timers/heart-timer',
        iconName: 'Clock',
        badge: 'New',
        tier: 'new',
      },
      {
        name: 'Spinner Timer',
        description: 'Rotating wheel countdown with clear segments for station circuits and drills.',
        href: '/timers/spinner-timer',
        iconName: 'Clock',
        badge: 'New',
        tier: 'new',
      },
      {
        name: 'Stopwatch',
        description: 'Accurate split laps and sprint timing for athletes and trainers.',
        href: '/stopwatch',
        iconName: 'Stopwatch',
        badge: 'Hot',
        tier: 'hot',
      },
      {
        name: 'Multi-Stopwatch',
        description: 'Time multiple swimmers, runners, or circuit stations simultaneously.',
        href: '/multi-stopwatch',
        iconName: 'Users',
        badge: 'Trending',
        tier: 'trending',
      },
      {
        name: 'Countdown Timer',
        description: 'Simple countdown clock for stretching, planks, and rests.',
        href: '/countdown-timer',
        iconName: 'Hourglass',
        badge: 'Trending',
        tier: 'trending',
      },
      {
        name: 'Time Duration Calculator',
        description: 'Calculate pace, total session duration, and split averages.',
        href: '/time-duration-calculator',
        iconName: 'Calculator',
        badge: 'Trending',
        tier: 'trending',
      },
    ],
    comparisonTable: {
      title: 'Which Fitness Timer Fits Your Workout?',
      subtitle:
        'Choose the right timing format based on whether you perform circuit intervals, steady sprints, or multi-athlete trials.',
      rows: [
        {
          tool: 'Interval Timer',
          bestFor: 'HIIT & Circuit Training',
          keyFeatures: 'Work & Rest phases, round count',
          exampleUseCases: 'CrossFit, kettlebell sets, bodyweight intervals',
        },
        {
          tool: 'Tabata Timer',
          bestFor: 'High-intensity 4-minute bursts',
          keyFeatures: 'Fixed 20s/10s format with audio cues',
          exampleUseCases: 'Sprint intervals, pushup rounds',
        },
        {
          tool: 'Stopwatch',
          bestFor: 'Track laps & race times',
          keyFeatures: 'Split times, lap logging, millisecond accuracy',
          exampleUseCases: 'Track & field, 5K trials, swimming',
        },
        {
          tool: 'Multi-Stopwatch',
          bestFor: 'Coaches and group drills',
          keyFeatures: 'Multi-lane logging, batch export',
          exampleUseCases: 'Swim team heats, relay handoffs',
        },
      ],
    },
    guide: {
      kicker: 'STRENGTH & CONDITIONING FIELD MANUAL',
      title: 'Programming Work-to-Rest Ratios for Tabata, EMOM, Boxing Rounds, and Track Splits',
      lead:
        'In metabolic conditioning and combat sports, the work-to-rest ratio dictates which human energy system you train. A 20s/10s Tabata block taxes anaerobic glycolysis by denying full ATP-PCr recovery, whereas a 1-minute work / 2-minute rest sprint protocol restores phosphocreatine for peak power output.',
      tableOfContents: [
        'Physiology of Work-to-Rest Ratios',
        'Interval Clocks vs. Multi-Lane Track Stopwatches',
        'Audio Synthesis & Gym Floor Visibility',
        'Verified Conditioning Protocols (Tabata, EMOM, Boxing)',
        'Coaching & Gym Floor Setup Rules',
        'Conditioning Pacing Errors to Avoid',
        'Technical & Operational Reference',
      ],
      quickTip:
        'Always program a 5-to-10-second preparation countdown before Round 1 so athletes can chalk their hands, step up to the barbell, and start on the exact top beep.',
      whatTitle: 'Interval Clocks vs. Multi-Lane Track Stopwatches',
      whatBody:
        'Use an automated Interval or Boxing Timer when the clock dictates fixed work and recovery windows across multiple rounds (such as 8 × 20s/10s Tabata or 12 × 3-minute boxing rounds with a 30-second amber clapper warning). Use the Stopwatch or Multi-Stopwatch when athletes race a fixed distance (400m repeats, 100m swim heats) and you need to record individual split deltas.',
      howTitle: 'Audio Synthesis & Gym Floor Visibility',
      howBody:
        'During high-heart-rate sets, athletes cannot read small typography. Our conditioning timers pair full-viewport green (WORK) and amber/red (REST) color states with sharp 3-2-1 Web Audio transition beeps that cut cleanly through gym music over Bluetooth PA systems without pausing background Spotify or Apple Music playback.',
      quote:
        '“If you eyeball your rest periods on a wall clock, a 10-second Tabata recovery quietly stretches into 25 seconds—and the entire metabolic stimulus of the block changes.”',
      practicalTitle: 'Verified Conditioning Protocols (Tabata, EMOM, Boxing)',
      practicalItems: [
        'Izumi Tabata Protocol (4:00 Total): 8 rounds of 20 seconds all-out effort followed by 10 seconds strict rest.',
        '10-Minute Strength EMOM (Every Minute on the Minute): Perform 5 heavy deadlifts or 12 kettlebell swings at the top of each 60-second bell; rest for the remainder of the minute.',
        'Amateur & Pro Boxing Sparring: 3-minute work rounds (or 2-minute amateur rounds) with a 30-second end-of-round clapper warning and 60-second corner recovery.',
        'Multi-Lane Track & Swim Trials: Start all 6–8 lanes simultaneously on the gun in the Multi-Stopwatch, tap individual lane split buttons as athletes cross each lap, and export CSV results.',
      ],
      tipsTitle: 'Coaching & Gym Floor Setup Rules',
      tipsItems: [
        'Use Fullscreen mode on a wall-mounted tablet or TV so athletes can see the green WORK and amber REST colors from any station.',
        'Mount your tablet or monitor at eye level near the rig so athletes can check remaining round time without breaking spinal alignment.',
      ],
      mistakesTitle: 'Conditioning Pacing Errors to Avoid',
      mistakesItems: [
        'Going 100% max effort in Round 1 of a 12-minute EMOM instead of holding a sustainable 80% threshold pace.',
        'Programming complex barbell equipment changes inside a 10-second Tabata transition window.',
      ],
    },
    faqs: [
      {
        q: 'Can I use this interval timer with Bluetooth speakers?',
        a: 'Yes! The audio cues route through your device audio output, including wireless headphones and Bluetooth gym sound systems.',
      },
      {
        q: 'What is the difference between Tabata and custom HIIT intervals?',
        a: 'Classic Tabata uses a fixed 20-second work / 10-second rest ratio for 8 rounds (4 minutes), whereas custom HIIT intervals let you configure any work, rest, warm-up, and round combination.',
      },
      {
        q: 'Is there a limit to how many rounds I can set?',
        a: 'You can configure custom sets, cycles, work periods, and recovery blocks for everything from 4-minute sprints to 60-minute boxing and circuit sessions.',
      },
    ],
    relatedCategories: [
      {
        title: 'Timers & Stopwatches',
        description: 'Standard countdowns and precision stopwatches.',
        href: '/category/timers',
        iconName: 'Hourglass',
      },
      {
        title: 'Productivity & Study Tools',
        description: 'Pomodoro and focus timers for deep work.',
        href: '/category/productivity',
        iconName: 'Clock',
      },
      {
        title: 'Time Calculators',
        description: 'Pace and time arithmetic tools.',
        href: '/category/calculators',
        iconName: 'Calculator',
      },
    ],
  },

  productivity: {
    slug: 'productivity',
    parentName: 'Productivity',
    parentHref: '/category/productivity',
    categoryKicker: 'PRODUCTIVITY & STUDY TOOLS',
    title: 'Productivity & Study Tools',
    description:
      'Structured Pomodoro focus blocks, task timeboxing clocks, and distraction-free countdowns engineered for deep work and effective study sessions.',
    heroCtaText: 'Open Pomodoro Timer',
    heroCtaHref: '/pomodoro-timer',
    heroImage: {
      src: '/images/cat-productivity.webp',
      alt: 'Clean wooden desk with notebook, coffee and minimalist clock',
      chalkText: 'Deep Work Flow',
    },
    featuredTool: {
      kicker: 'FEATURED TOOL',
      title: 'Pomodoro Focus Timer',
      description:
        'A distraction-free focus timer that splits work into 25-minute sprints separated by structured 5-minute cognitive breaks.',
      href: '/pomodoro-timer',
      checklist: [
        'Standard 25/5 and custom interval modes',
        'Automatic cycle switching between work & break',
        'Daily completed focus session tally',
        'Calm acoustic chimes to protect focus',
      ],
      defaultDurationSec: 1500, // 25:00
      presets: [
        { label: '15 min sprint', sec: 900 },
        { label: '25 min focus', sec: 1500 },
        { label: '30 min block', sec: 1800 },
        { label: '45 min deep work', sec: 2700 },
        { label: '50 min academic', sec: 3000 },
        { label: '90 min ultradian', sec: 5400 },
      ],
    },
    toolsHeading: 'Explore All Productivity & Focus Tools',
    toolsKicker: 'ALL PRODUCTIVITY TOOLS',
    tools: [
      {
        name: 'Pomodoro Timer',
        description: 'Structured 25-min focus sessions and short breaks.',
        href: '/pomodoro-timer',
        iconName: 'Tomato',
        badge: 'Hot',
        tier: 'hot',
      },
      {
        name: 'Flip Clock',
        description: 'Retro mechanical split-flap desk clock with Live Clock, Countdown & Stopwatch.',
        href: '/timers/flip-clock',
        iconName: 'Clock',
        badge: 'New',
        tier: 'new',
      },
      {
        name: 'Flip Timer',
        description: 'Tactile split-flap countdown digits for deep work and study desks.',
        href: '/timers/flip-timer',
        iconName: 'Clock',
        badge: 'New',
        tier: 'new',
      },
      {
        name: 'Sensory Visual Timers',
        description: 'Calm, low-distraction visual timers (Sand, Liquid, Frost, Moon) for quiet focus.',
        href: '/timers/sensory-timers',
        iconName: 'Clock',
        badge: 'New',
        tier: 'new',
      },
      {
        name: 'Aesthetic Timer',
        description: 'Cozy minimalist study timer with lo-fi, pastel, and dark aesthetic themes.',
        href: '/timers/aesthetic-timer',
        iconName: 'Clock',
        badge: 'Trending',
        tier: 'trending',
      },
      {
        name: 'Visual Timer',
        description: 'Watch time diminish visually to beat procrastination.',
        href: '/visual-timer',
        iconName: 'Clock',
        badge: 'Hot',
        tier: 'hot',
      },
      {
        name: 'Countdown Timer',
        description: 'Timebox any project or task to prevent scope creep.',
        href: '/countdown-timer',
        iconName: 'Hourglass',
        badge: 'Hot',
        tier: 'hot',
      },
      {
        name: 'Time Duration Calculator',
        description: 'Calculate total billable hours and study time.',
        href: '/time-duration-calculator',
        iconName: 'Calculator',
        badge: 'Trending',
        tier: 'trending',
      },
      {
        name: 'Stopwatch',
        description: 'Track how long tasks genuinely take from start to finish.',
        href: '/stopwatch',
        iconName: 'Stopwatch',
        badge: 'Trending',
        tier: 'trending',
      },
      {
        name: 'Embed Widget',
        description: 'Embed clean timers directly inside Notion, Obsidian, or blogs.',
        href: '/embed-timer',
        iconName: 'Code2',
        badge: 'Trending',
        tier: 'trending',
      },
    ],
    comparisonTable: {
      title: 'Choosing Your Ideal Deep Work Timing Method',
      subtitle:
        'Compare classic Pomodoro cycles against timeboxing and open stopwatch tracking.',
      rows: [
        {
          tool: 'Pomodoro Timer',
          bestFor: 'Sustained cognitive work',
          keyFeatures: '25m work + 5m break cycles',
          exampleUseCases: 'Coding, academic writing, studying',
        },
        {
          tool: 'Visual Timer',
          bestFor: 'Task initiation & ADHD focus',
          keyFeatures: 'Shrinking circular progress disc',
          exampleUseCases: 'Overcoming procrastination, quick chores',
        },
        {
          tool: 'Countdown Timer',
          bestFor: 'Hard deadline tasks',
          keyFeatures: 'Zero-hour alarm alert',
          exampleUseCases: 'Inbox zero sprints, administrative tasks',
        },
        {
          tool: 'Stopwatch',
          bestFor: 'Task auditing',
          keyFeatures: 'Count-up duration logging',
          exampleUseCases: 'Estimating project scope, client billing',
        },
      ],
    },
    guide: {
      kicker: 'DEEP WORK & COGNITIVE PACING BRIEF',
      title: 'Structuring 25/5 Pomodoro Cycles, 50/10 Academic Blocks, and 90-Minute Ultradian Sprints',
      lead:
        'Open-ended study and coding sessions invite Parkinson’s Law: a task that should take 40 minutes stretches across three hours of tab-switching and half-written drafts. Deliberate timeboxing pairs a finite single-task work sprint with a scheduled cognitive recovery break before attention residue sets in.',
      tableOfContents: [
        'Why Open-Ended Work Sessions Fail',
        'Comparing 25/5, 50/10, and 90/20 Focus Architectures',
        'Attention Residue & Break Recovery Mechanics',
        'High-Output Study & Engineering Workflows',
        'Desk Setup & Distraction Containment Rules',
        'Focus Cycle Pitfalls That Cause Afternoon Burnout',
        'Technical & Operational Reference',
      ],
      quickTip:
        'Step away from glowing screens during your 5-minute or 10-minute recovery interval—scrolling social feeds consumes the exact same prefrontal working memory you need for your next work block.',
      whatTitle: 'Comparing 25/5, 50/10, and 90/20 Focus Architectures',
      whatBody:
        'Classic 25-minute Pomodoro sprints (with 5-minute breaks) excel when task initiation resistance is high—such as clearing an inbox, reviewing flashcards, or starting a rough draft. Once you reach deep flow in software engineering, legal writing, or calculus problem sets, switching to a 50/10 academic block or a 90-minute ultradian cycle prevents the chime from interrupting complex mental models.',
      howTitle: 'Attention Residue & Break Recovery Mechanics',
      howBody:
        'Research on task-switching shows that jumping briefly to Slack or email mid-sprint leaves "attention residue" that degrades cognitive performance for 10 to 15 minutes afterward. Keep a physical capture notepad next to your keyboard: whenever an unrelated errand pops into your head during a running timer, write it down in 3 seconds and return immediately to the active task.',
      quote:
        '“A 25-minute timer works not because 25 minutes is magic, but because promising yourself 25 minutes of single-tasking lowers the psychological friction of starting.”',
      practicalTitle: 'High-Output Study & Engineering Workflows',
      practicalItems: [
        '25/5 Classic Pomodoro Set (2 Hours Total): Four 25-minute single-task sprints separated by 5-minute movement breaks, followed by a 20-minute restorative walk.',
        '50/10 Deep Coding & STEM Problem Block: Two 50-minute uninterrupted engineering or problem-solving blocks per 2-hour window.',
        '90-Minute Mock Exam & Thesis Block: Simulate full university lecture or standardized exam endurance with a single 90-minute countdown.',
        'Notion & Obsidian Dashboard Timeboxing: Use the Embed Timer Widget to place a live countdown directly inside your project specification page.',
      ],
      tipsTitle: 'Desk Setup & Distraction Containment Rules',
      tipsItems: [
        'Launch the Flip Timer, Aesthetic Timer, or Sensory Timer in Fullscreen mode (F) on a secondary monitor or tablet.',
        'Define a concrete "done criterion" before pressing Start (e.g., "Write 350 words of Section 2" rather than "Work on paper").',
      ],
      mistakesTitle: 'Focus Cycle Pitfalls That Cause Afternoon Burnout',
      mistakesItems: [
        'Skipping your 5-minute break after the first two sprints, which causes steep cognitive fatigue by hour three.',
        'Checking email or news headlines during short breaks instead of resting visual focus and standing up.',
      ],
    },
    faqs: [
      {
        q: 'Can I change the default 25/5 Pomodoro duration?',
        a: 'Yes, presets for 15, 25, 30, 45, 50, and 90 minutes are available with one click.',
      },
      {
        q: 'Does WebCountDownTimer store my focus data?',
        a: 'Your session counts are stored locally in your browser so you retain complete privacy.',
      },
    ],
    relatedCategories: [
      {
        title: 'Education & Classroom Tools',
        description: 'Timers and study aids for students.',
        href: '/category/education',
        iconName: 'GraduationCap',
      },
      {
        title: 'Timers & Stopwatches',
        description: 'Everyday countdowns and stopwatches.',
        href: '/category/timers',
        iconName: 'Hourglass',
      },
      {
        title: 'Time Calculators',
        description: 'Calculators for work hours and dates.',
        href: '/category/calculators',
        iconName: 'Calculator',
      },
    ],
  },

  world: {
    slug: 'world',
    parentName: 'World Clock',
    parentHref: '/category/world',
    categoryKicker: 'WORLD CLOCK & TIME ZONES',
    title: 'World Clock & Time Zones',
    description:
      'Live international time zone comparisons, global city clocks, meeting planners, and daylight saving tracking for remote teams and worldwide travelers.',
    heroCtaText: 'Open World Clock',
    heroCtaHref: '/world-clock',
    heroImage: {
      src: '/images/cat-world.webp',
      alt: 'Global world map and compass on rustic desk',
      chalkText: 'Connect Worldwide',
    },
    featuredTool: {
      kicker: 'FEATURED TOOL',
      title: 'World Clock & Global Grid',
      description:
        'Track multiple international cities with accurate local time, UTC offsets, day/night indicators, and time difference summaries.',
      href: '/world-clock',
      checklist: [
        'Instant live atomic time synchronization',
        'Automatic Daylight Saving Time (DST) adjustments',
        'Interactive city search across 10,000+ locations',
        'Working hour overlap indicator for distributed teams',
      ],
      defaultDurationSec: 0,
      presets: [
        { label: 'New York (EDT)', sec: 0 },
        { label: 'London (BST)', sec: 0 },
        { label: 'Tokyo (JST)', sec: 0 },
        { label: 'Sydney (AEST)', sec: 0 },
      ],
    },
    toolsHeading: 'Explore All World Clock & Time Zone Tools',
    toolsKicker: 'ALL GLOBAL TOOLS',
    tools: [
      {
        name: 'World Clock',
        description: 'Track real-time clocks across international cities.',
        href: '/world-clock',
        iconName: 'Globe',
        badge: 'Hot',
        tier: 'hot',
      },
      {
        name: 'Flip Clock',
        description: 'Live retro split-flap clock with global timezone selection and 12/24h formats.',
        href: '/timers/flip-clock',
        iconName: 'Clock',
        badge: 'New',
        tier: 'new',
      },
      {
        name: 'Time-Zone Converter',
        description: 'Convert any time between multiple international zones.',
        href: '/time-zone-converter',
        iconName: 'RotateCcw',
        badge: 'Hot',
        tier: 'hot',
      },
      {
        name: 'Meeting Planner',
        description: 'Find overlapping business hours for teams worldwide.',
        href: '/meeting-planner',
        iconName: 'Users',
        badge: 'Trending',
        tier: 'trending',
      },
      {
        name: 'Sun Timer',
        description: 'Illustrated daylight arc visual timer inspired by solar progression.',
        href: '/timers/sun-timer',
        iconName: 'Clock',
        badge: 'New',
        tier: 'new',
      },
      {
        name: 'Moon Timer',
        description: 'Calming lunar phase and night-sky visual countdown.',
        href: '/timers/moon-timer',
        iconName: 'Clock',
        badge: 'New',
        tier: 'new',
      },
      {
        name: 'Time Duration Calculator',
        description: 'Compute time differences and flight durations between cities.',
        href: '/time-duration-calculator',
        iconName: 'Calculator',
        badge: 'Trending',
        tier: 'trending',
      },
    ],
    comparisonTable: {
      title: 'Which Global Time Tool Do You Need?',
      subtitle:
        'Pick the right tool depending on whether you need a quick current time check or a multi-zone meeting schedule.',
      rows: [
        {
          tool: 'World Clock',
          bestFor: 'At-a-glance time checking',
          keyFeatures: 'Live city grid, day/night flags',
          exampleUseCases: 'Calling international colleagues, travel prep',
        },
        {
          tool: 'Time-Zone Converter',
          bestFor: 'Event scheduling',
          keyFeatures: 'Slider time shift across zones',
          exampleUseCases: 'Webinar broadcasts, global launches',
        },
        {
          tool: 'Meeting Planner',
          bestFor: 'Distributed teams',
          keyFeatures: 'Color-coded work hour overlap matrix',
          exampleUseCases: 'Remote team sprint planning, client demos',
        },
      ],
    },
    guide: {
      kicker: 'IANA GLOBAL TIME & DST REFERENCE',
      title: 'Navigating UTC Offsets, 2026 Daylight Saving Mismatches, and Non-Integer Time Zones',
      lead:
        'Cross-border scheduling errors rarely happen during mid-winter or mid-summer—they happen during the March and October Daylight Saving Time (DST) transition gaps when North America and Europe shift their clocks on different Sundays, and across non-integer zones like India (UTC+05:30) and Nepal (UTC+05:45).',
      tableOfContents: [
        'Why Static Hour Offsets Fail Twice a Year',
        'IANA Time Zone Database & Intl Engine Mechanics',
        '2026 DST Transition Mismatches (US vs. UK/EU vs. AU)',
        'Distributed Team & Global Broadcast Workflows',
        'International Scheduling Protocol',
        'Cross-Border Time Zone Traps to Avoid',
        'Technical & Operational Reference',
      ],
      quickTip:
        'Always include both the local civil time and the UTC timestamp in cross-continental calendar invites (e.g., "14:00 UTC / 09:00 EST / 19:30 IST") so recipients in non-DST regions are never caught off guard.',
      whatTitle: 'IANA Time Zone Database & Intl Engine Mechanics',
      whatBody:
        'Rather than relying on hardcoded offset tables that go stale whenever a government amends its daylight saving laws, our World Clock, Time-Zone Converter, and Meeting Planner query your browser’s native ECMAScript Intl.DateTimeFormat engine backed by the official IANA Time Zone Database (e.g., America/New_York, Europe/London, Asia/Kolkata).',
      howTitle: '2026 DST Transition Mismatches (US vs. UK/EU vs. AU)',
      howBody:
        'In 2026, the United States and Canada spring forward on March 8, while the United Kingdom and European Union wait until March 29—shrinking the New York–London gap from 5 hours to 4 hours for three full weeks. In autumn, Europe falls back on October 25 while North America waits until November 1. Meanwhile, Japan (UTC+9), India (UTC+05:30), and Arizona (America/Phoenix, UTC−7) maintain fixed offsets year-round.',
      quote:
        '“There is no such thing as a fixed time difference between two cities unless both follow the exact same Daylight Saving transition calendar.”',
      practicalTitle: 'Distributed Team & Global Broadcast Workflows',
      practicalItems: [
        'US–Europe–India Engineering Syncs: Use the Meeting Planner 24-hour overlap matrix to target the 13:30–15:00 UTC golden window (09:30 EDT / 14:30 BST / 19:00 IST).',
        'March & October DST Audit: Preview your target future date in the Time-Zone Converter before sending webinar invitations during DST transition months.',
        'Half-Hour & 45-Minute Offset Verification: Check exact minute alignments for Mumbai/Colombo (UTC+05:30), Kathmandu (UTC+05:45), Adelaide (UTC+09:30/10:30), and St. John’s (UTC−03:30/02:30).',
      ],
      tipsTitle: 'International Scheduling Protocol',
      tipsItems: [
        'Anchor global server maintenance windows, aviation logs, and release cutoffs strictly in 24-hour UTC.',
        'Rotate recurring all-hands meetings quarterly between Americas/EMEA and EMEA/APAC slots so one region does not carry all late-night calls.',
      ],
      mistakesTitle: 'Cross-Border Time Zone Traps to Avoid',
      mistakesItems: [
        'Writing "EST" or "PST" in July when North America is actually observing EDT (UTC−4) and PDT (UTC−7).',
        'Forgetting that crossing midnight UTC shifts the calendar date forward by +1 day for participants in Asia and Oceania.',
      ],
    },
    faqs: [
      {
        q: 'Does WebCountDownTimer account for Daylight Saving Time automatically?',
        a: 'Yes. All time calculations use official IANA time database rules, automatically shifting forward or backward.',
      },
      {
        q: 'Can I add custom cities to my World Clock?',
        a: 'Yes, search any major city in the world to pin it to your personalized dashboard.',
      },
    ],
    relatedCategories: [
      {
        title: 'Events & Presentation Tools',
        description: 'Timers for global webinars and keynotes.',
        href: '/category/events',
        iconName: 'Tv',
      },
      {
        title: 'Time Calculators',
        description: 'Calculators for time differences and dates.',
        href: '/category/calculators',
        iconName: 'Calculator',
      },
      {
        title: 'Timers & Stopwatches',
        description: 'Everyday countdowns and stopwatches.',
        href: '/category/timers',
        iconName: 'Hourglass',
      },
    ],
  },

  calculators: {
    slug: 'calculators',
    parentName: 'Calculators',
    parentHref: '/category/calculators',
    categoryKicker: 'TIME CALCULATORS & CONVERTERS',
    title: 'Time & Date Calculators',
    description:
      'Accurate time duration calculators, date arithmetic, work hour summators, and time unit converters for payroll, logistics, and everyday planning.',
    heroCtaText: 'Open Time Duration Calculator',
    heroCtaHref: '/time-duration-calculator',
    heroImage: {
      src: '/images/cat-calculators.webp',
      alt: 'Calculator, notebook, and financial ledger on clean wooden desk',
      chalkText: 'Accurate to the Second',
    },
    featuredTool: {
      kicker: 'FEATURED TOOL',
      title: 'Time Duration & Difference Calculator',
      description:
        'Calculate exact elapsed hours, minutes, and seconds between two timestamps or add durations to any base time.',
      href: '/time-duration-calculator',
      checklist: [
        'Start and end time duration calculation',
        'Add or subtract hours, minutes, and seconds',
        'Overnight rollover calculation',
        'Instant decimal hour conversion for billing',
      ],
      defaultDurationSec: 0,
      presets: [
        { label: '8-Hour Workday', sec: 28800 },
        { label: 'Half-Day (4h)', sec: 14400 },
        { label: '1 Hour Lunch', sec: 3600 },
        { label: '30-Min Sprint', sec: 1800 },
      ],
    },
    toolsHeading: 'Explore All Time & Date Calculators',
    toolsKicker: 'ALL CALCULATORS',
    tools: [
      {
        name: 'Time Duration Calculator',
        description: 'Calculate difference between two times in hours and minutes.',
        href: '/time-duration-calculator',
        iconName: 'Calculator',
        badge: 'Hot',
        tier: 'hot',
      },
      {
        name: 'Time-Zone Converter',
        description: 'Convert hours across global time zones instantly.',
        href: '/time-zone-converter',
        iconName: 'RotateCcw',
        badge: 'Hot',
        tier: 'hot',
      },
      {
        name: 'Meeting Planner',
        description: 'Calculate overlapping workable hours across teams.',
        href: '/meeting-planner',
        iconName: 'Users',
        badge: 'Trending',
        tier: 'trending',
      },
      {
        name: 'Flip Clock',
        description: 'Live retro split-flap clock, countdown, and stopwatch for desk time tracking.',
        href: '/timers/flip-clock',
        iconName: 'Clock',
        badge: 'New',
        tier: 'new',
      },
      {
        name: 'Stopwatch',
        description: 'Measure elapsed duration in real time with lap splits.',
        href: '/stopwatch',
        iconName: 'Stopwatch',
        badge: 'Trending',
        tier: 'trending',
      },
      {
        name: 'Multi-Stopwatch',
        description: 'Track multiple parallel projects, tasks, or client timers at once.',
        href: '/multi-stopwatch',
        iconName: 'Users',
        badge: 'Trending',
        tier: 'trending',
      },
    ],
    comparisonTable: {
      title: 'Which Calculation Tool Suits Your Task?',
      subtitle:
        'Choose between time-difference arithmetic, timezone conversion, or live elapsed duration.',
      rows: [
        {
          tool: 'Time Duration Calculator',
          bestFor: 'Timesheets, payroll, study logs',
          keyFeatures: 'Start/End math, decimal conversions',
          exampleUseCases: 'Freelancer billing, contractor hours',
        },
        {
          tool: 'Time-Zone Converter',
          bestFor: 'Cross-border logistics',
          keyFeatures: 'Multi-zone time translation',
          exampleUseCases: 'Flight timetables, global webinars',
        },
        {
          tool: 'Stopwatch',
          bestFor: 'Live measurement',
          keyFeatures: 'Split tracking, millisecond precision',
          exampleUseCases: 'Lab experiments, race splits',
        },
      ],
    },
    guide: {
      kicker: 'SEXAGESIMAL & PAYROLL AUDIT MANUAL',
      title: 'Base-60 Time Arithmetic, Decimal Payroll Conversion, and Calendar Day Accounting',
      lead:
        'Standard spreadsheets and pocket calculators operate in base-10 decimal math, whereas clock time is sexagesimal (60 minutes per hour, 24 hours per civil day). Entering "8 hours 45 minutes" into a payroll spreadsheet as 8.45 instead of 8.75 underpays an employee by 0.30 hours (18 minutes) on every single shift.',
      tableOfContents: [
        'Why Base-60 Time Breaks Standard Spreadsheets',
        'Sexagesimal (HH:MM) to Decimal Hours Conversion Formula',
        'Overnight Midnight Rollover & Gregorian Leap-Year Rules',
        'Payroll, SLA, and Contract Auditing Workflows',
        'Timesheet & Billing Verification Protocol',
        'Costly Payroll & Date Math Errors to Avoid',
        'Technical & Operational Reference',
      ],
      quickTip:
        'To convert minutes to decimal hours for payroll, divide the minutes by 60: 15m = 0.25h, 30m = 0.50h, 45m = 0.75h, and 50m = 0.8333h.',
      whatTitle: 'Sexagesimal (HH:MM) to Decimal Hours Conversion Formula',
      whatBody:
        'Every time duration and payroll calculator on WebCountDownTimer outputs both standard clock format (HH:MM:SS) and base-10 decimal hours: Decimal Hours = Hours + (Minutes ÷ 60) + (Seconds ÷ 3600). For example, a shift from 08:15 to 17:00 with a 30-minute unpaid meal deduction yields 8 hours 15 minutes net work, which equals exactly 8.25 billable decimal hours.',
      howTitle: 'Overnight Midnight Rollover & Gregorian Leap-Year Rules',
      howBody:
        'When an overnight hospital or logistics shift starts at 21:45 and ends at 06:15 the next morning, our duration engine automatically applies the +24-hour modulo rollover ((06:15 + 24:00) − 21:45 = 8h 30m / 8.50 decimal hours). Date calculators evaluate exact Gregorian month lengths (28, 29, 30, or 31 days) and leap-year rules (divisible by 4, except century years not divisible by 400).',
      quote:
        '“Confusing 45 clock minutes (0.75 hours) with 0.45 decimal hours is the single most common—and most preventable—error in hourly payroll accounting.”',
      practicalTitle: 'Payroll, SLA, and Contract Auditing Workflows',
      practicalItems: [
        'Weekly FLSA Overtime Auditing: Tally daily punches, subtract unpaid meal breaks, convert to decimal hours, and apply 1.5× overtime multipliers above 40.00 weekly hours.',
        'Overnight Shift & Aviation Log Math: Compute exact elapsed hours and minutes across midnight or multi-day timestamps.',
        'Legal & Escrow Deadline Counting: Calculate business days vs. calendar days between contract execution and closing dates.',
        'Script Word-Count to Speaking Duration: Convert speech word counts into exact MM:SS read times at 110, 130, or 150 words per minute.',
      ],
      tipsTitle: 'Timesheet & Billing Verification Protocol',
      tipsItems: [
        'Keep at least 4 decimal places on repeating-third minute fractions (such as 20m = 0.3333h) until the final currency multiplication step.',
        'Verify whether legal or construction deadlines use exclusive start-day counting (standard deadline rule) or inclusive counting (+1 day).',
      ],
      mistakesTitle: 'Costly Payroll & Date Math Errors to Avoid',
      mistakesItems: [
        'Typing HH.MM directly into an hourly rate formula (e.g., multiplying $30/hr × 7.30 instead of $30/hr × 7.50).',
        'Assuming every calendar month equals 30 days when computing statutory 60-day or 90-day notice windows.',
      ],
    },
    faqs: [
      {
        q: 'How do I convert minutes into decimal hours for payroll?',
        a: 'Divide the number of minutes by 60. For example, 45 minutes ÷ 60 = 0.75 hours. Our calculator shows both formats instantly.',
      },
      {
        q: 'Can I calculate time spanning across midnight?',
        a: 'Yes, if the end time is numerically earlier than the start time, the calculator automatically factors in the 24-hour next-day rollover.',
      },
    ],
    relatedCategories: [
      {
        title: 'Timers & Stopwatches',
        description: 'Everyday countdowns and stopwatches.',
        href: '/category/timers',
        iconName: 'Hourglass',
      },
      {
        title: 'Productivity & Study Tools',
        description: 'Focus blocks and Pomodoro timers.',
        href: '/category/productivity',
        iconName: 'Clock',
      },
      {
        title: 'World Clock & Time Zones',
        description: 'Global clocks and time-zone converters.',
        href: '/world-clock',
        iconName: 'Globe',
      },
    ],
  },
};

export function getCategoryData(slug: string): CategoryData {
  const normalized = slug.toLowerCase();
  if (normalized === 'everyday') return CATEGORIES_DATA.timers;
  if (normalized === 'stage') return CATEGORIES_DATA.events;
  if (normalized === 'world-clock') return CATEGORIES_DATA.world;
  return CATEGORIES_DATA[normalized] || CATEGORIES_DATA.education;
}

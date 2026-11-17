import type { ToolDefinition } from '@/lib/tools-registry';

export interface PracticalExampleItem {
  icon: string;
  title: string;
  description: string;
}

export interface ProblemSolutionRow {
  problem: string;
  cause: string;
  solution: string;
}

export interface ToolEditorialData {
  slug: string;
  categorySlug: string;
  categoryLabel: string;
  heroSubtitle: string;
  featurePills: string[];
  heroImage?: {
    src: string;
    alt: string;
    notebookLines: string[];
  };
  quickPresets: Array<{
    icon: string;
    label: string;
    sublabel: string;
    workSec?: number;
    breakSec?: number;
    sec?: number;
  }>;
  steps: Array<{
    step: number;
    title: string;
    description: string;
  }>;
  guide: {
    tableOfContents: string[];
    whatIsTitle: string;
    whatIsBody: string[];
    howItWorksTitle: string;
    howItWorksBody: string[];
    calloutNote: string;
    howToUseTitle: string;
    howToUseSteps: string[];
    featuresTitle: string;
    featuresList: string[];
    classroomsTitle?: string;
    classroomsBody?: string;
    productivityTitle?: string;
    productivityBody?: string;
    presentationsTitle?: string;
    presentationsBody?: string;
    choosingStyleTitle?: string;
    choosingStyleBody?: string;
    practicalExamples: PracticalExampleItem[];
    whoBenefitsTitle: string;
    whoBenefitsList: string[];
    tipsTitle: string;
    tipsList: string[];
    problemsTitle: string;
    problemsRows: ProblemSolutionRow[];
  };
  quoteCard?: {
    src: string;
    alt: string;
    checklist: string[];
    quote: string;
  };
}

export const TOOL_EDITORIAL_CUSTOM: Record<string, Partial<ToolEditorialData>> = {
  'pomodoro-timer': {
    slug: 'pomodoro-timer',
    categorySlug: 'productivity',
    categoryLabel: 'Timers',
    heroSubtitle:
      'Use this free online Pomodoro Timer to stay focused, work in short sessions and get more done. Perfect for study, work and daily tasks.',
    featurePills: [
      'Focus better',
      'Boost productivity',
      'Simple and easy to use',
      'Works on all devices',
    ],
    quickPresets: [
      { icon: '🍅', label: '25 / 5', sublabel: 'Classic Pomodoro', workSec: 1500, breakSec: 300 },
      { icon: '📦', label: '50 / 10', sublabel: 'Deep Work', workSec: 3000, breakSec: 600 },
      { icon: '🎓', label: '15 / 5', sublabel: 'Study Session', workSec: 900, breakSec: 300 },
      { icon: '💼', label: '30 / 10', sublabel: 'Balanced', workSec: 1800, breakSec: 600 },
      { icon: '⚙', label: 'Custom', sublabel: 'Set your own time', workSec: 1500, breakSec: 300 },
    ],
    steps: [
      { step: 1, title: 'Set your work duration', description: 'Choose how long you want to focus.' },
      { step: 2, title: 'Click Start', description: 'Begin your focused work session.' },
      { step: 3, title: 'Take a short break', description: 'Rest when the timer ends.' },
      { step: 4, title: 'Repeat', description: 'Continue cycles and take a longer break after a few sessions.' },
    ],
    guide: {
      tableOfContents: [
        'What Is Pomodoro Timer?',
        'How Does It Work?',
        'How to Use',
        'Features and Settings',
        'Practical Examples',
        'Who Can Benefit?',
        'Tips for Better Results',
        'Common Problems',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is a Pomodoro Timer?',
      whatIsBody: [
        'A Pomodoro Timer is a simple time management tool that helps you work in focused intervals, usually 25 minutes, followed by a short break. It is based on the Pomodoro Technique, a popular productivity method created by Francesco Cirillo. This method helps you stay focused, reduce distractions and make steady progress on your tasks.',
      ],
      howItWorksTitle: 'How Does It Work?',
      howItWorksBody: [
        'You work for a set period of time (for example, 25 minutes) with full focus. When the timer ends, you take a short break (for example, 5 minutes). After a few cycles, you take a longer break. This simple routine helps your brain stay fresh and productive.',
      ],
      calloutNote:
        'The Pomodoro Technique works because it gives your brain clear time limits, makes tasks less overwhelming and builds a natural rhythm of focus and rest.',
      howToUseTitle: 'How to Use The Pomodoro Timer',
      howToUseSteps: [
        'Set your preferred work duration and break times.',
        'Click Start to begin the timer.',
        'Work on your task until the timer ends.',
        'Take a short break and relax.',
        'Repeat for better focus and productivity.',
      ],
      featuresTitle: 'Main Features and Settings',
      featuresList: [
        'Custom work, short break and long break durations',
        'Auto start breaks option',
        'Ticking sound and notification alert',
        'Multiple preset modes',
        'Works on desktop, tablet and mobile devices',
        'Simple and clean interface',
      ],
      practicalExamples: [
        {
          icon: 'GraduationCap',
          title: 'For Students',
          description: 'Study for 25 minutes, then take a 5-minute break.',
        },
        {
          icon: 'Monitor',
          title: 'For Remote Workers',
          description: 'Focus on one task at a time and avoid distractions.',
        },
        {
          icon: 'Palette',
          title: 'For Creative Work',
          description: 'Use 50/10 cycles for deep work.',
        },
        {
          icon: 'CheckSquare',
          title: 'For Daily Tasks',
          description: 'Break large tasks into smaller focused sessions.',
        },
      ],
      whoBenefitsTitle: 'Who Can Benefit From This Tool?',
      whoBenefitsList: [
        'Students who want to study more effectively',
        'Professionals who need to stay focused',
        'Freelancers and remote workers',
        'Writers, designers and creative professionals',
        'Anyone who struggles with distractions',
      ],
      tipsTitle: 'Tips for Better Results',
      tipsList: [
        'Remove distractions before starting a session.',
        'Use a clear and specific task.',
        'Take real breaks away from your screen.',
        'Try different durations to find what works for you.',
        'Stay consistent and build a routine.',
      ],
      problemsTitle: 'Common Problems and Solutions',
      problemsRows: [
        {
          problem: 'Timer not starting',
          cause: 'Browser issue or extension',
          solution: 'Refresh the page or try a different browser',
        },
        {
          problem: 'No sound alert',
          cause: 'Browser sound is muted',
          solution: 'Check your device volume and browser settings',
        },
        {
          problem: 'Distracted during session',
          cause: 'Notifications or open tabs',
          solution: 'Use fullscreen mode and turn off notifications',
        },
        {
          problem: 'Breaks not starting automatically',
          cause: 'Auto start is disabled',
          solution: 'Enable the auto start breaks option',
        },
        {
          problem: 'Timer stops unexpectedly',
          cause: 'Tab closed or device locked',
          solution: 'Keep the page open or use a PWA/app version',
        },
      ],
    },
  },

  'countdown-timer': {
    slug: 'countdown-timer',
    categorySlug: 'timers',
    categoryLabel: 'Timers',
    heroSubtitle:
      'Use this free online Countdown Timer to measure any duration with accurate second-by-second countdown, custom presets, and audible alerts.',
    featurePills: [
      'Accurate timing',
      'Custom alarms',
      'Fullscreen projection',
      'Works on all devices',
    ],
    quickPresets: [
      { icon: '⏱', label: '1 min', sublabel: 'Quick Sprint', sec: 60 },
      { icon: '⏱', label: '5 min', sublabel: 'Turn & Talk', sec: 300 },
      { icon: '⏱', label: '10 min', sublabel: 'Group Exercise', sec: 600 },
      { icon: '⏱', label: '15 min', sublabel: 'Meeting Block', sec: 900 },
      { icon: '⏱', label: '30 min', sublabel: 'Work Sprint', sec: 1800 },
    ],
    steps: [
      { step: 1, title: 'Choose your duration', description: 'Enter hours, minutes and seconds or pick a preset.' },
      { step: 2, title: 'Click Start', description: 'The countdown begins with smooth second transitions.' },
      { step: 3, title: 'Listen for the chime', description: 'An acoustic chime sounds as digits hit 00:00.' },
      { step: 4, title: 'Reset or loop', description: 'Reset to your starting duration or loop automatically.' },
    ],
    guide: {
      tableOfContents: [
        'What Is Countdown Timer?',
        'How Does It Work?',
        'How to Use',
        'Features and Settings',
        'Practical Examples',
        'Who Can Benefit?',
        'Tips for Better Results',
        'Common Problems',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is a Countdown Timer?',
      whatIsBody: [
        'A countdown timer is a precision digital clock that counts backwards from a specified duration down to zero. Unlike count-up stopwatches, countdown timers establish a clear boundary, signaling when time has elapsed with sound and visual cues.',
      ],
      howItWorksTitle: 'How Does It Work?',
      howItWorksBody: [
        'You enter your desired hours, minutes, and seconds. Once started, WebCountDownTimer calculates exact timestamp deltas using high-resolution browser performance clocks, guaranteeing zero drift even if your computer slows down or switches tabs.',
      ],
      calloutNote:
        'Setting a finite countdown timer activates the psychological principle of timeboxing, helping you concentrate without getting bogged down in endless perfectionism.',
      howToUseTitle: 'How to Use The Countdown Timer',
      howToUseSteps: [
        'Type hours, minutes, or seconds into the input fields.',
        'Click Start (or press Spacebar) to begin counting down.',
        'Enter Fullscreen mode (press F) for presentations or classroom displays.',
        'Click Reset (or press R) to return to your chosen preset.',
      ],
      featuresTitle: 'Main Features and Settings',
      featuresList: [
        'Custom hours, minutes, and seconds input',
        'One-click quick presets for 1, 5, 10, 15, 30, and 60 minutes',
        'Acoustic chime, bell, and digital alarm sounds',
        'Distraction-free fullscreen projection mode',
        'Overtime count-up indicator after zero',
      ],
      practicalExamples: [
        {
          icon: 'GraduationCap',
          title: 'Classroom Activities',
          description: 'Keep student partner talks and reading sprints on schedule.',
        },
        {
          icon: 'Monitor',
          title: 'Meeting Agendas',
          description: 'Limit discussions to 10-minute brainstorming blocks.',
        },
        {
          icon: 'Palette',
          title: 'Kitchen & Cooking',
          description: 'Time baking, boiling, and tea steeping accurately.',
        },
        {
          icon: 'CheckSquare',
          title: 'Speech Rehearsals',
          description: 'Practice presentations to ensure you do not overrun limits.',
        },
      ],
      whoBenefitsTitle: 'Who Can Benefit From This Tool?',
      whoBenefitsList: [
        'Teachers running timed classroom exercises',
        'Presenters and speakers preparing timed talks',
        'Productivity enthusiasts timeboxing tasks',
        'Chefs and home cooks timing dishes',
      ],
      tipsTitle: 'Tips for Better Results',
      tipsList: [
        'Press the F key to project a huge, borderless clock for audiences.',
        'Keep device volume at a moderate level and test the sound chime before speaking.',
        'Use the Overtime setting to see exactly how much you ran past the deadline.',
      ],
      problemsTitle: 'Common Problems and Solutions',
      problemsRows: [
        {
          problem: 'Timer drifts in background',
          cause: 'Browser tab throttling',
          solution: 'WebCountDownTimer uses timestamp delta math, preventing background clock drift',
        },
        {
          problem: 'No sound heard',
          cause: 'User interaction required for Web Audio',
          solution: 'Click Start or unmute browser audio permission',
        },
        {
          problem: 'Display turns off',
          cause: 'Device power-saver lock',
          solution: 'Screen Wake Lock is requested automatically while timer runs',
        },
      ],
    },
  },

  'visual-timer': {
    slug: 'visual-timer',
    categorySlug: 'timers',
    categoryLabel: 'Timers',
    heroSubtitle: 'See time passing with a clear visual countdown.',
    featurePills: [
      'Easy to use',
      'Visual countdown',
      'Works on all devices',
      'Free to use',
    ],
    quickPresets: [
      { icon: '⏱', label: '1 min', sublabel: 'Quick Task', sec: 60 },
      { icon: '⏱', label: '5 min', sublabel: 'Short Exercise', sec: 300 },
      { icon: '⏱', label: '10 min', sublabel: 'Group Work', sec: 600 },
      { icon: '⏱', label: '15 min', sublabel: 'Visual Pacing', sec: 900 },
      { icon: '⏱', label: '30 min', sublabel: 'Study Block', sec: 1800 },
    ],
    steps: [
      { step: 1, title: 'Set a duration', description: 'Choose a preset or enter your own time.' },
      { step: 2, title: 'Click Start', description: 'The visual timer will begin counting down.' },
      { step: 3, title: 'Stay focused', description: 'Watch time decrease and get alert when it ends.' },
    ],
    guide: {
      tableOfContents: [
        'What Is a Visual Timer?',
        'Why It Helps',
        'How to Use',
        'Classrooms',
        'Productivity',
        'Presentations',
        'Choosing a Style',
        'Tips for Better Results',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is a Visual Timer?',
      whatIsBody: [
        'A visual timer is a countdown timer that shows time passing with a visual display, such as a circle, progress bar or other animations. It helps you see how much time is left at a glance, making it easier to stay focused and manage tasks.',
      ],
      howItWorksTitle: 'Why Visual Timers Help Make Time Easier to Understand',
      howItWorksBody: [
        'Visual timers give a clear and intuitive representation of time. As the visual gradually decreases, you can quickly see how much time is remaining, which helps reduce distractions and improves focus. They are especially helpful for children, students and anyone who finds traditional digital timers less intuitive.',
      ],
      calloutNote:
        'Try different styles and colors to find the visual timer that works best for your environment and focus style.',
      howToUseTitle: 'How to Use a Visual Timer',
      howToUseSteps: [
        'Set your desired duration using the preset buttons or custom input.',
        'Choose a visual style that works best for you.',
        'Click Start to begin the countdown.',
        'Use Pause or Reset when needed.',
        'Customize the color, sound and display settings to match your environment.',
      ],
      classroomsTitle: 'Visual Timers for Classrooms',
      classroomsBody:
        'Visual timers are widely used in classrooms to help students stay on task during activities, transitions and tests. Teachers can use them for group work, reading time, or to signal the end of an activity. The clear visual display helps younger students understand time more easily.',
      productivityTitle: 'Visual Timers for Productivity',
      productivityBody:
        'Whether you\'re working from home, studying or managing daily tasks, a visual timer can help you stay focused and avoid distractions. Techniques like the Pomodoro method use visual timers to break work into focused intervals with short breaks.',
      presentationsTitle: 'Visual Timers for Presentations',
      presentationsBody:
        'Use a visual timer to keep your presentation on track. The clear visual countdown helps you manage your time and ensures you cover all your key points without running over.',
      choosingStyleTitle: 'Choosing the Right Visual Timer Style',
      choosingStyleBody:
        'Different visual styles work better for different situations. The circular timer is simple and popular, while the progress bar works well for wide displays. The hourglass style is great for a classic look, and the traffic light style is especially useful for children.',
      featuresTitle: 'Key Capabilities & Visual Styles',
      featuresList: [
        '6 Live Visual Countdown Styles: Switch seamlessly between Circular Disc, Progress Bar, Hourglass Sand, Traffic Light, Rainbow Arc, and Minimal Digital.',
        'Duration & Target End-Time Modes: Count down a fixed duration (e.g., 15 minutes) or count down to an exact wall-clock time (e.g., 2:45 PM).',
        'Responsive Fullscreen Stage: Scales both the visual graphic and digital readout for phones, tablets, laptops, and classroom projectors.',
        'Elapsed Time & Hide-Numbers Toggles: Count upward or hide the digital numerals so learners focus purely on the shrinking visual shape.',
        'Screen Wake Lock & Web Audio Chimes: Keeps your display awake and plays a clear completion chime at 00:00.',
      ],
      practicalExamples: [
        {
          icon: 'GraduationCap',
          title: 'Classroom Centers & Transitions',
          description: 'Project the Traffic Light or Circular disc on a smartboard during 10-minute reading centers and 3-minute cleanup transitions.',
        },
        {
          icon: 'Monitor',
          title: 'ADHD & Time-Blindness Focus',
          description: 'Keep a 25-minute shrinking wedge visible on a secondary monitor to externalize time and overcome task-initiation friction.',
        },
        {
          icon: 'Presentation',
          title: 'Keynote & Standup Pacing',
          description: 'Run a 15-minute Progress Bar or Traffic Light timer during daily agile standups and pitch rehearsals.',
        },
        {
          icon: 'CheckSquare',
          title: 'Proctored Exams & Quizzes',
          description: 'Show both the shrinking visual sector and exact remaining minutes so students pace essay sections calmly.',
        },
      ],
      whoBenefitsTitle: 'Who Benefits Most from the Visual Timer?',
      whoBenefitsList: [
        'Elementary, middle-school, and special education teachers managing classroom transitions',
        'Students and adults with ADHD or executive-function time blindness',
        'Agile scrum masters, workshop facilitators, and conference speakers',
        'Parents guiding homework blocks, toothbrushing, and screen-time limits',
      ],
      tipsTitle: 'Expert Tips for Visual Timing',
      tipsList: [
        'Hide the digital time text for younger children or test-anxious students so they read the shrinking shape rather than fixating on ticking seconds.',
        'Use Traffic Light mode when participants need automatic Green (>30%), Yellow (10%–30%), and Red (<10%) wrap-up warnings.',
        'Switch to End Time mode when a class period or meeting must end at a hard wall-clock time like 11:15 AM.',
        'Press Spacebar to start/pause, R to reset, and F to enter borderless fullscreen mode.',
      ],
      problemsTitle: 'Choosing the Right Visual Timer Style',
      problemsRows: [
        {
          problem: 'Circular Disc',
          cause: 'General classroom, study & desk focus',
          solution: 'Shows remaining time as a familiar 360° disappearing wedge',
        },
        {
          problem: 'Progress Bar',
          cause: 'Presentations, wide monitors & smartboards',
          solution: 'Horizontal linear depletion bar readable from 30+ feet away',
        },
        {
          problem: 'Hourglass Sand',
          cause: 'Visual learners, board games & short turns',
          solution: 'Classic upper-to-lower chamber falling sand metaphor',
        },
        {
          problem: 'Traffic Light',
          cause: 'Speeches, debates & early elementary classes',
          solution: 'Automatic Green, Amber, and Red phase transitions',
        },
        {
          problem: 'Rainbow Arc',
          cause: 'Kids’ activities, art rooms & reading corners',
          solution: 'Engaging 7-band color arc that recedes smoothly to 00:00',
        },
        {
          problem: 'Minimal Digital',
          cause: 'Exams, coding sprints & minimalist desks',
          solution: 'Ultra-large tabular digits with zero visual clutter',
        },
      ],
    },
  },

  'world-clock': {
    slug: 'world-clock',
    categorySlug: 'world',
    categoryLabel: 'World Clock',
    heroSubtitle: 'Compare local times, UTC offsets, and business hours across global cities in real time.',
    featurePills: [
      'Official IANA time zone engine',
      'Automatic Daylight Saving (DST)',
      'Day/Night & working-hours badges',
      'Instant multi-city comparison',
    ],
    quickPresets: [],
    steps: [
      { step: 1, title: 'View or add global cities', description: 'Search and pin cities from North America, Europe, Asia-Pacific, Latin America, and Africa.' },
      { step: 2, title: 'Compare live UTC offsets & dates', description: 'Inspect each city’s live local time, day of the week, and UTC offset side by side.' },
      { step: 3, title: 'Check Day/Night & business hours', description: 'Use the sun/moon indicators to see which offices are currently in standard working hours.' },
      { step: 4, title: 'Scrub future meeting times', description: 'Jump to the Time-Zone Converter or Meeting Planner to test future dates across DST changes.' },
    ],
    guide: {
      tableOfContents: [
        'Understanding World Clocks',
        'How Time-Zone Conversion Works',
        'UTC Offsets Explained',
        'Daylight-Saving Time',
        'Planning Meetings',
        'Working With Different Dates',
        'Common Mistakes',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'Understanding World Clocks',
      whatIsBody: [
        'A world clock shows the current local time in different cities around the globe. It helps you quickly see what time it is in other time zones, making it easier to plan meetings, calls, travel and online events.',
      ],
      howItWorksTitle: 'How Time-Zone Conversion Works',
      howItWorksBody: [
        'Time-zone conversion calculates the time in one location based on the time difference between two regions. Each location follows a specific time zone, which is usually expressed as an offset from Coordinated Universal Time (UTC) via the official IANA Time Zone Database.',
      ],
      calloutNote:
        'For example, if it is 10:00 AM in New York (UTC-4 during EDT), the time in Mumbai (UTC+5:30) is 7:30 PM on the same day—a 9.5-hour offset.',
      howToUseTitle: 'How to Compare Global Time Zones',
      howToUseSteps: [
        'Check your local reference time at the top of the World Clock dashboard.',
        'Add or pin the international cities your team, clients, or family members live in.',
        'Verify the date badge (+1 Day / -1 Day) when comparing the Americas with Asia or Oceania.',
        'Toggle between 12-hour AM/PM and 24-hour military/ISO display formats.',
      ],
      featuresTitle: 'Key Capabilities & Time-Zone Accuracy',
      featuresList: [
        'Official IANA Time Zone Resolution: Automatically handles regional Daylight Saving Time (DST) transitions on the exact date each country switches.',
        'Fractional UTC Offset Support: Accurately computes 30-minute and 45-minute offsets including India (UTC+5:30), Adelaide (UTC+9:30), Newfoundland (UTC-3:30), and Nepal (UTC+5:45).',
        'International Date Line Awareness: Clearly flags when a target city is on Tomorrow (+1 day) or Yesterday (-1 day).',
        'Daylight & Working-Hours Visual Cues: Shows at a glance whether a city is in daytime business hours, evening, or overnight sleep hours.',
      ],
      practicalExamples: [
        {
          icon: 'Globe',
          title: 'Distributed Engineering Standups',
          description: 'Find the morning/afternoon overlap window between San Francisco (PT), New York (ET), London (GMT/BST), and Berlin (CET/CEST).',
        },
        {
          icon: 'Users',
          title: 'Client Calls Across the Date Line',
          description: 'Verify that a Thursday 4:00 PM call in Los Angeles lands on Friday 11:00 AM in Sydney without date confusion.',
        },
        {
          icon: 'Tv',
          title: 'Global Product Launches & Livestreams',
          description: 'Publish simultaneous launch times for New York, London, Tokyo, and Singapore from a single UTC reference.',
        },
        {
          icon: 'Clock',
          title: 'Aviation, Financial Markets & Travel',
          description: 'Track market open/close bells across NYSE, LSE, and Tokyo Stock Exchange alongside UTC/Zulu time.',
        },
      ],
      whoBenefitsTitle: 'Who Uses the World Clock & Time-Zone Suite?',
      whoBenefitsList: [
        'Remote software teams, project managers, and executive assistants scheduling global calls',
        'International sales, customer support, and operations teams covering 24/7 follow-the-sun shifts',
        'Frequent flyers, digital nomads, and families staying in touch across continents',
        'Event producers and webinar hosts announcing global broadcast start times',
      ],
      tipsTitle: 'Expert Tips to Prevent Time-Zone Mistakes',
      tipsList: [
        'Watch out for the 2-to-3-week spring and autumn gap when the US and Europe switch Daylight Saving Time on different Sundays.',
        'Always include the explicit IANA city or UTC offset in meeting invites (e.g., "14:00 UTC / 10:00 EDT / 15:00 BST").',
        'Remember that regions like Arizona, Hawaii, Japan, India, and Singapore do not observe Daylight Saving Time.',
        'Use 24-hour format (e.g., 19:30 instead of 7:30) when coordinating international travel or server maintenance windows.',
      ],
      problemsTitle: 'Common Time-Zone Conversion Pitfalls & Solutions',
      problemsRows: [
        {
          problem: 'Meeting is off by 1 hour in March or October',
          cause: 'US and Europe/UK change Daylight Saving Time on different dates',
          solution: 'Select the exact future meeting date so the IANA engine applies that day’s DST offset',
        },
        {
          problem: 'Half-hour mismatch with India or Australia',
          cause: 'Assuming all time zones are whole-hour offsets from UTC',
          solution: 'Use city-based lookup (Mumbai UTC+5:30, Adelaide UTC+9:30/10:30) instead of manual hour math',
        },
        {
          problem: 'Participant joins 24 hours late',
          cause: 'Crossing the International Date Line between US afternoon and APAC morning',
          solution: 'Always check both the weekday name and calendar date shown on each city card',
        },
      ],
    },
  },

  'time-duration-calculator': {
    slug: 'time-duration-calculator',
    categorySlug: 'calculators',
    categoryLabel: 'Calculators',
    heroSubtitle:
      'Calculate the exact elapsed duration between two times or dates—including overnight shifts, total minutes, and payroll decimal hours.',
    featurePills: [
      'Exact HH:MM:SS & minute totals',
      'Multi-day & overnight support',
      'Payroll decimal hours output',
      'Break deduction ready',
    ],
    quickPresets: [],
    steps: [
      { step: 1, title: 'Enter start date & time', description: 'Select your starting time (and date if spanning multiple days).' },
      { step: 2, title: 'Enter end date & time', description: 'Select your ending time—overnight midnight rollovers are handled automatically.' },
      { step: 3, title: 'Deduct unpaid breaks (optional)', description: 'Enter any lunch or rest break minutes to compute net working duration.' },
      { step: 4, title: 'Read standard & decimal totals', description: 'Copy the exact result in hours/minutes, total minutes, total seconds, and decimal hours.' },
    ],
    guide: {
      tableOfContents: [
        'What Is a Time Duration Calculator?',
        'How to Calculate Time Between Two Times',
        'How to Calculate Overnight Hours',
        'Convert Hours Into Minutes & Decimal Hours',
        'Practical Examples',
        'Common Mistakes',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is a Time Duration Calculator?',
      whatIsBody: [
        'A Time Duration Calculator finds the exact elapsed time between a start time and an end time. It outputs the result simultaneously in standard hours and minutes (HH:MM:SS), total elapsed minutes, total seconds, and payroll-ready decimal hours (e.g., 7.75 hours).',
      ],
      howItWorksTitle: 'How Base-60 & Overnight Duration Math Works',
      howItWorksBody: [
        'Clock time uses base-60 (sexagesimal) arithmetic where 60 minutes equal 1 hour, whereas payroll and billing software require base-10 decimal hours (Minutes ÷ 60). This calculator converts both timestamps into epoch milliseconds, computes the exact delta across midnight or multi-day boundaries, and formats the output in both systems simultaneously.',
      ],
      calloutNote:
        'You do not need to split overnight shifts at midnight. Enter 10:30 PM as the start time and 6:15 AM as the end time, and the calculator automatically resolves the 7-hour 45-minute (7.75 hr) span.',
      howToUseTitle: 'How to Calculate Overnight & Multi-Day Hours',
      howToUseSteps: [
        'Enter the start date and time.',
        'Enter the end date and time.',
        'Click Calculate Duration.',
        'View the result in hours, minutes, total minutes and decimal hours.',
      ],
      featuresTitle: 'Key Capabilities & Calculation Outputs',
      featuresList: [
        'Automatic Midnight Rollover: Accurately computes night shifts (e.g., 22:00 to 06:30 = 8h 30m) without manual 24-hour subtraction.',
        'Instant Payroll Decimal Conversion: Converts minutes into hundredths of an hour (15m = 0.25h, 30m = 0.50h, 45m = 0.75h).',
        'Multi-Day & Date-Aware Span: Calculates total elapsed days, hours, and minutes across weekends or project milestones.',
        'Total Minutes & Seconds Breakdown: Ideal for video editing, aviation logs, lab experiments, and athletic pacing.',
      ],
      practicalExamples: [
        {
          icon: 'Calculator',
          title: 'Employee Shift & Payroll Verification',
          description: 'Clock in at 8:15 AM and out at 4:45 PM with a 30-minute lunch break to verify exactly 8h 00m (8.00 decimal hours).',
        },
        {
          icon: 'Clock',
          title: 'Hospital & Warehouse Night Shifts',
          description: 'Calculate an overnight shift from 7:00 PM (19:00) to 7:30 AM (07:30) the next morning (= 12h 30m / 12.50 hours).',
        },
        {
          icon: 'Monitor',
          title: 'Freelance Client Billing',
          description: 'Convert a 2-hour 20-minute consulting call into 2.33 billable decimal hours for invoicing.',
        },
        {
          icon: 'Globe',
          title: 'Flight & Layover Elapsed Time',
          description: 'Measure total transit time between departure and arrival timestamps across multi-day itineraries.',
        },
      ],
      whoBenefitsTitle: 'Who Uses the Time Duration Calculator?',
      whoBenefitsList: [
        'Payroll administrators, HR managers, and bookkeepers auditing timesheets',
        'Nurses, first responders, factory workers, and security staff working overnight shifts',
        'Freelancers, attorneys, and consultants billing clients in decimal hour increments',
        'Students, researchers, and video producers calculating exact media or lab runtimes',
      ],
      tipsTitle: 'Pro Tips for Accurate Time Math',
      tipsList: [
        'Never enter "8:45" into payroll software as "8.45"—45 minutes divided by 60 equals 0.75, so 8 hours 45 minutes is 8.75 decimal hours.',
        'Double-check AM vs. PM when entering 12:00: 12:00 PM is noon (midday), while 12:00 AM is midnight (start of the day).',
        'Subtract unpaid meal breaks before multiplying decimal hours by your hourly pay rate.',
        'Use 24-hour military time input whenever auditing hospital, aviation, or logistics logs to eliminate AM/PM ambiguity.',
      ],
      problemsTitle: 'Common Time Calculation Mistakes & Fixes',
      problemsRows: [
        {
          problem: '8 hours 30 minutes entered as 8.30 in payroll',
          cause: 'Confusing base-60 minutes with base-10 decimals (underpays by 12 minutes)',
          solution: 'Divide minutes by 60 (30 ÷ 60 = 0.50), giving 8.50 decimal hours',
        },
        {
          problem: 'Negative or 12-hour error on afternoon shifts',
          cause: 'Selecting 4:30 AM instead of 4:30 PM (16:30)',
          solution: 'Verify AM/PM indicators or switch to 24-hour input mode',
        },
        {
          problem: 'Overnight shift shows 16 hours instead of 8 hours',
          cause: 'Start and end times entered in reverse order on the same calendar date',
          solution: 'Ensure the end date is set to the following calendar day for shifts crossing midnight',
        },
      ],
    },
  },

  'sand-timer': {
    slug: 'sand-timer',
    categorySlug: 'timers',
    categoryLabel: 'Timers',
    heroSubtitle: 'A realistic digital sand timer with falling golden grains to help you stay on track.',
    featurePills: [
      'Realistic falling sand physics',
      'Multiple preset & custom times',
      'One-click hourglass flip',
      'Fullscreen & silent modes',
    ],
    quickPresets: [],
    steps: [],
    guide: {
      tableOfContents: [
        'What Is a Digital Sand Timer?',
        'How Does a Sand Timer Work?',
        'How to Use an Online Sand Timer',
        'Sand Timer for Games and Classrooms',
        'Sand Timer for Cooking and Everyday Activities',
        'Digital vs Traditional Hourglass',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is a Digital Sand Timer?',
      whatIsBody: [
        'A digital sand timer is an online countdown timer that shows time passing with a realistic hourglass animation. Just like a traditional sand timer, you can see the sand gradually fall from the top to the bottom as the time counts down.',
      ],
      howItWorksTitle: 'How Does a Sand Timer Work?',
      howItWorksBody: [
        'The digital sand timer uses a smooth animation to simulate falling sand particles. As the timer runs, the sand level in the upper chamber decreases and the sand in the lower chamber grows. When the time reaches zero, the upper chamber is empty and a sound alert (optional) notifies you.',
      ],
      calloutNote:
        'The animation is a visual representation of time. It does not measure real sand flow, but it provides a clear and engaging way to see time passing.',
      howToUseTitle: 'How to Use an Online Sand Timer',
      howToUseSteps: [
        'Choose a preset time or enter a custom duration.',
        'Click Start to begin the countdown.',
        'Watch the sand fall as time decreases.',
        'The timer will alert you when it reaches zero.',
        'Use Pause or Reset whenever needed.',
      ],
      featuresTitle: 'Key Capabilities & Visual Controls',
      featuresList: [
        'Proportional Upper & Lower Sand Chambers: Upper chamber depletes and lower chamber fills in exact sync with remaining seconds.',
        'Any Custom Duration: Unlike physical glass sand timers locked to 1, 3, or 5 minutes, set any duration from 10 seconds to 99 minutes.',
        'Show or Hide Digital Numbers: Run with big digital numerals or pure visual sand flow for non-readers and young children.',
        'Fullscreen & Reduced Motion Support: Expand across classroom smartboards or enable calm reduced-particle rendering.',
      ],
      practicalExamples: [
        {
          icon: 'GraduationCap',
          title: 'Classroom Cleanup & Turn-Taking',
          description: 'Project a 2-minute or 5-minute sand timer so students finish tidying desks before the top bulb empties.',
        },
        {
          icon: 'Users',
          title: 'Board Games, Chess & Charades',
          description: 'Replace lost plastic board-game sand timers with an exact 30-second, 60-second, or 90-second turn clock.',
        },
        {
          icon: 'Clock',
          title: 'Kids’ Toothbrushing & Bedtime',
          description: 'Run a 2-minute sand timer at the bathroom sink so children brush until the last grain drops.',
        },
        {
          icon: 'Flame',
          title: 'Tea Steeping & Kitchen Tasks',
          description: 'Time 3-minute green tea, 4-minute French press coffee, or 6-minute soft-boiled eggs with an audible chime.',
        },
      ],
      whoBenefitsTitle: 'Who Benefits Most from the Digital Sand Timer?',
      whoBenefitsList: [
        'Elementary school teachers and special educators guiding transitions',
        'Board game players hosting Catan, Pictionary, Articulate, or trivia nights',
        'Parents helping toddlers and young kids visualize 2-to-10-minute routines',
        'Students and writers who prefer a warm, tactile hourglass over cold digital numbers',
      ],
      tipsTitle: 'Pro Tips for Using the Sand Timer',
      tipsList: [
        'Toggle off "Show Time Text" when playing party games so players feel the excitement of watching the final grains fall.',
        'Press Spacebar to pause the falling sand immediately if a classroom discussion or game rule question interrupts a turn.',
        'Use Fullscreen (F) on a tablet placed in the center of the game table so every player has an equal view.',
        'Enable Screen Wake Lock on mobile phones so the screen does not dim during longer 15-to-30-minute study sessions.',
      ],
      problemsTitle: 'Digital Sand Timer vs. Traditional Glass Hourglass',
      problemsRows: [
        {
          problem: 'Custom Time Durations',
          cause: 'Physical glass timers are fixed to a single duration (e.g., 3 mins)',
          solution: 'Digital Sand Timer lets you set any exact second, minute, or hour duration',
        },
        {
          problem: 'Pausing Mid-Turn',
          cause: 'Physical hourglasses must be laid flat (and often spill sand)',
          solution: 'Click Pause or press Spacebar to freeze the countdown with millisecond accuracy',
        },
        {
          problem: 'Room-Wide Visibility & Chime',
          cause: 'Small desk sand timers are silent and hard to see across a room',
          solution: 'Fullscreen projection plus an optional Web Audio chime at 00:00',
        },
      ],
    },
  },

  'liquid-timer': {
    slug: 'liquid-timer',
    categorySlug: 'timers',
    categoryLabel: 'Timers',
    heroSubtitle: 'A smooth liquid countdown with rising bubbles and 6 color styles to help you stay focused and calm.',
    featurePills: [
      'Smooth draining liquid physics',
      '6 calming color themes',
      'Works on all devices',
      'Free & sensory-friendly',
    ],
    quickPresets: [],
    steps: [],
    guide: {
      tableOfContents: [
        'What Is a Liquid Timer?',
        'How Does This Liquid Countdown Work?',
        'How to Use the Liquid Timer',
        'Liquid Timer for Focus and Study',
        'Liquid Timer for Kids and Classrooms',
        'Choosing a Liquid Timer Style',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is a Liquid Timer?',
      whatIsBody: [
        'A liquid timer is a visual countdown timer that shows time passing through a gradually decreasing liquid level. As the timer runs, the liquid smoothly drains from the top to the bottom, helping you see how much time is left at a glance.',
      ],
      howItWorksTitle: 'How Does This Liquid Countdown Work?',
      howItWorksBody: [
        'The timer uses a realistic animation to simulate liquid draining from a container. The liquid level gradually decreases while small bubbles rise, creating a calm and natural visual effect. When the time reaches zero, the container becomes empty and an optional sound alert notifies you.',
      ],
      calloutNote:
        'Different colors can create different moods. Choose the style that helps you stay focused and comfortable.',
      howToUseTitle: 'How to Use the Liquid Timer',
      howToUseSteps: [
        'Choose a preset or enter your own duration.',
        'Select a liquid style and color.',
        'Click Start to begin the countdown.',
        'Watch the liquid level decrease as time passes.',
        'Use Pause or Reset anytime.',
      ],
      featuresTitle: 'Key Capabilities & Sensory Controls',
      featuresList: [
        'Continuous Meniscus Wave Animation: Fluid level lowers smoothly from 100% to 0% with gentle surface wave motion and effervescent bubbles.',
        '6 Curated Liquid Palettes: Switch between Ocean Blue, Emerald Mint, Sunset Amber, Lavender Mist, Coral Rose, and Midnight Indigo.',
        'Sensory-Friendly Reduced Motion: Calm the wave and bubble speed for neurodivergent learners or low-distraction study.',
        'Optional Digital Overlay & Audio: Display or hide the numeric countdown and toggle the completion chime.',
      ],
      practicalExamples: [
        {
          icon: 'Heart',
          title: 'Sensory Regulation & Calm-Down Breaks',
          description: 'Run a 3-to-5-minute Ocean Blue or Lavender liquid timer in occupational therapy rooms or classroom calm corners.',
        },
        {
          icon: 'BookOpen',
          title: 'Low-Anxiety Study & Reading Sprints',
          description: 'Use a 25-minute draining liquid vessel on a tablet beside your notebook to track Pomodoro progress without ticking stress.',
        },
        {
          icon: 'GraduationCap',
          title: 'Early Childhood Transitions',
          description: 'Let preschoolers and elementary students watch the colored water drain down to the bottom line during cleanup.',
        },
        {
          icon: 'Droplets',
          title: 'Hydration, Stretching & Eye Breaks',
          description: 'Time a 2-minute posture stretch or 60-second breathing reset between meetings.',
        },
      ],
      whoBenefitsTitle: 'Who Benefits Most from the Liquid Timer?',
      whoBenefitsList: [
        'Students and adults with ADHD, autism, or sensory processing sensitivity',
        'Special education teachers, school counselors, and occupational therapists',
        'Writers, programmers, and students seeking a calm ambient desk timer',
        'Parents managing gentle transitions for young children at home',
      ],
      tipsTitle: 'Tips for Choosing & Using Liquid Timer Styles',
      tipsList: [
        'Choose cool tones (Ocean Blue, Emerald Mint, Lavender) for quiet reading, therapy, or wind-down routines.',
        'Choose warm high-contrast tones (Sunset Amber, Coral Rose) when projecting across a bright classroom.',
        'Hide the numeric time readout when working with learners who get anxious watching seconds tick down.',
        'Enable Reduced Motion if rising bubbles feel distracting in peripheral vision.',
      ],
      problemsTitle: 'Liquid Timer Color Themes & Best Applications',
      problemsRows: [
        {
          problem: 'Ocean Blue & Emerald Mint',
          cause: 'Calm sensory regulation & deep study',
          solution: 'Soothing cool-spectrum hues reduce visual fatigue on desk monitors',
        },
        {
          problem: 'Sunset Amber & Coral Rose',
          cause: 'Group visibility on classroom projectors',
          solution: 'Warm high-contrast fill stands out clearly in sunlit rooms',
        },
        {
          problem: 'Digital vs. Physical Liquid Bubbler Toy',
          cause: 'Plastic oil-and-water bubblers only run for ~45–90 seconds',
          solution: 'Digital Liquid Timer supports any exact duration from 10 seconds to 2+ hours',
        },
      ],
    },
  },

  'rainbow-timer': {
    slug: 'rainbow-timer',
    categorySlug: 'timers',
    categoryLabel: 'Timers',
    heroSubtitle: 'A colorful rainbow arc countdown timer that makes remaining time visible, cheerful, and easy to understand.',
    featurePills: [
      'Multicolor shrinking rainbow arc',
      'Multiple rainbow palettes',
      'Great for kids & classrooms',
      'Fullscreen & mute options',
    ],
    quickPresets: [],
    steps: [],
    guide: {
      tableOfContents: [
        'What Is a Rainbow Visual Timer?',
        'How the Rainbow Countdown Works',
        'How to Use the Rainbow Timer',
        'Rainbow Timer for Kids and Classrooms',
        'Colorful Timers for Activities and Breaks',
        'Customizing Your Rainbow Countdown',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is a Rainbow Visual Timer?',
      whatIsBody: [
        'A rainbow timer is a visual countdown timer that uses a multicolor rainbow to show time passing. As the timer runs, the rainbow arc gradually decreases, making the remaining time easy to see at a glance. It’s a simple and engaging way to help people of all ages understand time.',
      ],
      howItWorksTitle: 'How the Rainbow Countdown Works',
      howItWorksBody: [
        'The rainbow arc represents the total time you set. As seconds pass, the colored arc disappears in a smooth and continuous animation. The remaining arc always matches the time left. When the countdown reaches zero, the rainbow is fully gone and an optional sound alert notifies you.',
      ],
      calloutNote:
        'The rainbow timer is especially helpful for children, visual learners and anyone who finds it easier to understand time visually instead of using only numbers.',
      howToUseTitle: 'How to Use the Rainbow Timer',
      howToUseSteps: [
        'Choose a preset time or enter a custom duration.',
        'Select a rainbow style and color theme.',
        'Click Start to begin the countdown.',
        'Watch the rainbow arc decrease as time passes.',
        'Use Pause or Reset whenever needed.',
      ],
      featuresTitle: 'Key Capabilities & Classroom Highlights',
      featuresList: [
        '7-Band Multicolor Arc Depletion: Smoothly sweeps from a full 180° rainbow arch down to 0° as time elapses.',
        'Multiple Color Palettes: Switch between Classic Vibrant Rainbow, Soft Pastel Rainbow, Sunset Spectrum, and Neon Glow.',
        'Number-Free Visual Mode: Toggle off digital digits so pre-readers and kindergarteners read the rainbow arc directly.',
        'Instant Fullscreen Smartboard Mode: Fills interactive classroom whiteboards and home tablets cleanly.',
      ],
      practicalExamples: [
        {
          icon: 'GraduationCap',
          title: 'Kindergarten & Elementary Centers',
          description: 'Project a 10-minute Rainbow Timer during art, phonics, or math stations so young learners see how much arc remains.',
        },
        {
          icon: 'Palette',
          title: 'Creative Art & Craft Sessions',
          description: 'Give kids a cheerful 15-minute colorful arc for drawing, painting, or Lego building challenges.',
        },
        {
          icon: 'Users',
          title: 'Morning Getting-Ready & Chore Races',
          description: 'Use a 5-minute rainbow countdown for putting on shoes, packing backpacks, or picking up toys.',
        },
        {
          icon: 'Heart',
          title: 'Pediatric Therapy & Play Breaks',
          description: 'Provide a friendly, non-intimidating visual boundary for reward breaks and speech therapy games.',
        },
      ],
      whoBenefitsTitle: 'Who Benefits Most from the Rainbow Timer?',
      whoBenefitsList: [
        'Preschool, kindergarten, and elementary school teachers',
        'Young children (ages 3–9) who have not yet mastered reading digital clock numbers',
        'Pediatric occupational therapists, speech therapists, and child-life specialists',
        'Parents looking for a positive, frustration-free timer for daily family routines',
      ],
      tipsTitle: 'Tips for Using the Rainbow Timer with Kids',
      tipsList: [
        'Select the Soft Pastel palette during quiet reading or rest time, and Classic Vibrant during active cleanup or games.',
        'Give a simple visual cue: "When the rainbow reaches the halfway cloud, start putting caps back on your markers."',
        'Hide the digital clock text for toddlers so they focus solely on the colorful arch.',
        'Press F for fullscreen mode when displaying on a classroom smartboard or TV.',
      ],
      problemsTitle: 'Rainbow Visual Timer vs. Standard Digital Timer',
      problemsRows: [
        {
          problem: 'Pre-readers cannot interpret "04:30"',
          cause: 'Abstract base-60 digits require numeracy skills',
          solution: 'A shrinking rainbow arch is understood intuitively by children as young as 3',
        },
        {
          problem: 'Bright colors feel too stimulating during quiet study',
          cause: 'Default saturated rainbow spectrum',
          solution: 'Switch to the Soft Pastel theme and enable Reduced Motion',
        },
        {
          problem: 'Sudden end-of-activity meltdowns',
          cause: 'Children did not realize time was almost up',
          solution: 'The receding rainbow arc gives continuous visual notice as the final sliver approaches',
        },
      ],
    },
  },

  'hourglass-timer': {
    slug: 'hourglass-timer',
    categorySlug: 'timers',
    categoryLabel: 'Timers',
    heroSubtitle: 'A classic hourglass countdown with realistic falling sand and one-click flip restart.',
    featurePills: [
      'Realistic glass hourglass animation',
      'One-click Flip & Restart',
      'Multiple preset & custom times',
      'Works on all devices',
    ],
    quickPresets: [],
    steps: [],
    guide: {
      tableOfContents: [
        'What Is an Hourglass Timer?',
        'How Does a Digital Hourglass Work?',
        'Online Hourglass vs Traditional Sand Clock',
        'How to Use an Hourglass Countdown',
        'Hourglass Timer for Games, Learning and Daily Activities',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is an Hourglass Timer?',
      whatIsBody: [
        'An hourglass timer is a visual countdown timer that shows time passing through falling sand. This digital hourglass recreates the classic sand clock experience online, making it easy to use on any device.',
      ],
      howItWorksTitle: 'How Does a Digital Hourglass Work?',
      howItWorksBody: [
        'The digital hourglass uses a smooth animation to simulate sand falling from the upper chamber to the lower chamber. As the countdown runs, the sand level in the top half decreases and the sand level in the bottom half increases. When the time reaches zero, the upper chamber is empty and an optional sound alert notifies you.',
      ],
      calloutNote:
        'Click Flip to turn the hourglass over and start again, just like a traditional sand clock.',
      howToUseTitle: 'How to Use an Hourglass Countdown',
      howToUseSteps: [
        'Choose a preset time or enter your own duration.',
        'Click Start to begin the countdown.',
        'Watch the sand fall from the top to the bottom.',
        'Use Pause to stop and Resume to continue.',
        'Click Reset or Flip to turn the hourglass over and start again.',
      ],
      featuresTitle: 'Key Capabilities & Design Highlights',
      featuresList: [
        'Authentic Dual-Bulb Sand Physics: Watch golden sand grains stream through the narrow glass neck from the top bulb into the rising lower mound.',
        'Instant Flip-to-Restart Control: Click Flip (or press R) to invert the hourglass and restart your interval immediately.',
        'Custom Sand & Frame Themes: Customize the sand color, glass vessel style, and dark/light background contrast.',
        'Zero-Drift Monotonic Engine: Maintains exact millisecond accuracy even if you switch browser tabs mid-countdown.',
      ],
      practicalExamples: [
        {
          icon: 'Users',
          title: 'Board Games & Tabletop Turns',
          description: 'Run 1-minute, 2-minute, or 3-minute player turns for chess, Rummikub, Catan, Boggle, and trivia nights.',
        },
        {
          icon: 'GraduationCap',
          title: 'Classroom Think-Pair-Share',
          description: 'Project the hourglass during 3-minute partner discussions and flip it when partners switch roles.',
        },
        {
          icon: 'BookOpen',
          title: 'Focused Reading & Writing Sprints',
          description: 'Set a 25-minute or 45-minute hourglass on your desk for calm, tactile study pacing.',
        },
        {
          icon: 'Flame',
          title: 'Kitchen, Tea & Coffee Brewing',
          description: 'Time 4-minute pour-over blooms, herbal infusions, and resting steaks with a clear completion chime.',
        },
      ],
      whoBenefitsTitle: 'Hourglass Timer for Games, Learning and Daily Activities',
      whoBenefitsList: [
        'Tabletop gamers, chess players, and quizmasters enforcing fair turn limits',
        'Teachers and professors running timed partner discussions and station rotations',
        'Students and writers who enjoy the classic aesthetic of a traditional sand glass',
        'Families using visual sand flow for kids’ chores, reading minutes, and routines',
      ],
      tipsTitle: 'Expert Tips for Best Results',
      tipsList: [
        'Use fullscreen (F) for a larger view across a classroom or game table.',
        'Use the Flip button during two-player games or partner discussions to restart the exact same duration in one click.',
        'Hide the digital time text if you want players to judge remaining time purely by the sand level in the upper bulb.',
        'Enable reduced motion if you prefer a calm, simplified sand level indicator without falling particle motion.',
      ],
      problemsTitle: 'Online Hourglass vs. Traditional Physical Sand Clock',
      problemsRows: [
        {
          problem: 'Fixed Duration Limitation',
          cause: 'Physical glass hourglasses only measure one fixed time (e.g., 3 minutes)',
          solution: 'Set any exact duration from 5 seconds to multiple hours in the digital hourglass',
        },
        {
          problem: 'Accuracy & Clumping',
          cause: 'Physical sand clocks vary by ±10% and can jam from humidity',
          solution: 'Monotonic browser timestamp math guarantees 100% digital accuracy',
        },
        {
          problem: 'Pausing & Audible Completion',
          cause: 'Physical hourglasses cannot be paused cleanly and make no sound when empty',
          solution: 'Pause/Resume anytime with Spacebar and enable an optional Web Audio chime at 00:00',
        },
      ],
    },
  },

  'circular-timer': {
    slug: 'circular-timer',
    categorySlug: 'timers',
    categoryLabel: 'Timers',
    heroSubtitle: 'A clean, high-contrast 360° circular countdown timer that shows remaining time as a shrinking sector.',
    featurePills: [
      '360° shrinking circle display',
      'Multiple color & ring styles',
      'Works on all devices',
      'Fullscreen projection ready',
    ],
    quickPresets: [],
    steps: [],
    guide: {
      tableOfContents: [
        'What Is a Circular Countdown Timer?',
        'How a Circular Timer Visualizes Time',
        'How to Use This Circle Timer',
        'Circular Timer for Classrooms and Presentations',
        'Circular Timer vs Progress Bar Timer',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is a Circular Countdown Timer?',
      whatIsBody: [
        'A circular timer is a visual countdown timer that uses a circle to show the remaining time. As time passes, the colored portion of the circle gradually decreases, making it easy to see how much time is left at a glance.',
      ],
      howItWorksTitle: 'How a Circular Timer Visualizes Time',
      howItWorksBody: [
        'The circle represents the total duration, and the colored sector shows the remaining time. The sector shrinks smoothly in a clockwise (or counterclockwise) direction as the countdown runs. This visual format helps you quickly understand how time is passing without focusing only on numbers.',
      ],
      calloutNote:
        'Use the circular timer in fullscreen mode for classrooms, presentations and focused work sessions.',
      howToUseTitle: 'How to Use This Circle Timer',
      howToUseSteps: [
        'Choose a preset time or enter a custom duration.',
        'Select your preferred color and background style.',
        'Click Start to begin the countdown.',
        'Watch the circle shrink as time decreases.',
        'Use Pause, Resume or Reset whenever needed.',
      ],
      featuresTitle: 'Key Capabilities & Visual Modes',
      featuresList: [
        '360° Proportional Wedge & Ring Modes: View remaining time as a solid pie sector or a clean perimeter progress ring.',
        'Instant Quarter-Time Recognition: Quickly spot 75%, 50% (halfway), and 25% remaining time based on familiar clock-face geometry.',
        'High-Contrast Color Themes: Choose Emerald, Cobalt Blue, Amber Gold, Crimson Red, or Violet on light or dark backgrounds.',
        'Borderless Fullscreen & Wake Lock: Ideal for front-of-room classroom projection and conference monitors.',
      ],
      practicalExamples: [
        {
          icon: 'GraduationCap',
          title: 'Classroom Quizzes & Independent Work',
          description: 'Project a 20-minute circular disc so students see half the circle remaining at 10 minutes and a quarter wedge at 5 minutes.',
        },
        {
          icon: 'Presentation',
          title: 'Agile Standups & Sprint Demos',
          description: 'Keep 15-minute team standups and 5-minute lightning demos strictly on schedule.',
        },
        {
          icon: 'Monitor',
          title: 'Pomodoro & Deep Work Blocks',
          description: 'Run a 25-minute circular countdown alongside your code editor or writing document.',
        },
        {
          icon: 'CheckSquare',
          title: 'Standardized Test Practice',
          description: 'Help students internalize 35-minute and 45-minute exam section pacing visually.',
        },
      ],
      whoBenefitsTitle: 'Who Benefits Most from the Circular Timer?',
      whoBenefitsList: [
        'Teachers and exam proctors who want a classic red/green disappearing-disk timer online',
        'Visual learners and individuals with ADHD who process geometric proportions faster than digits',
        'Public speakers, moderators, and team leads pacing meetings and presentations',
        'Students practicing time management for SAT, ACT, AP, or university exams',
      ],
      tipsTitle: 'Expert Tips for Circular Timer Pacing',
      tipsList: [
        'Teach students the "Quarter Circle Rule": when only one quarter (90°) of the circle remains, begin reviewing and wrapping up.',
        'Use high-contrast Dark Mode when projecting on LED displays or TVs in dim auditoriums.',
        'Press Spacebar to start or pause instantly, R to reset, and F to toggle fullscreen.',
        'Toggle off the digital numbers if you want participants to focus on proportional pacing rather than second-by-second counting.',
      ],
      problemsTitle: 'Circular Timer vs. Linear Progress Bar Timer',
      problemsRows: [
        {
          problem: 'Recognizing 1/2 and 1/4 Milestones',
          cause: 'Human eyes naturally map 90° and 180° angles to quarter and half hours',
          solution: 'Circular Timer excels when you want instant clock-face fraction awareness',
        },
        {
          problem: 'Ultra-Wide Banners & Split Screens',
          cause: 'Circles require square vertical space',
          solution: 'Use Circular Timer for full-screen focus, or Progress Bar Timer for narrow horizontal strips',
        },
        {
          problem: 'Screen Sleeps During 45-Minute Exam',
          cause: 'Laptop or tablet power settings',
          solution: 'Keep the Wake Lock toggle enabled so the circular display stays lit until 00:00',
        },
      ],
    },
  },

  'radial-timer': {
    slug: 'radial-timer',
    categorySlug: 'timers',
    categoryLabel: 'Timers',
    heroSubtitle: 'A unique radial countdown timer with a clear visual display.',
    featurePills: [
      'Clear radial display',
      'Multiple styles and colors',
      'Works on all devices',
      'Free to use',
    ],
    quickPresets: [],
    steps: [],
    guide: {
      tableOfContents: [
        'What Is a Radial Timer?',
        'How Radial Countdown Displays Work',
        'How to Use the Radial Timer',
        'Radial Timer for Study and Productivity',
        'Radial Timer for Group Activities',
        'Radial Timer vs Circular Timer',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is a Radial Timer?',
      whatIsBody: [
        'A radial timer is a visual countdown timer that uses multiple spokes, rays or segments arranged in a circle to show the remaining time. As the timer runs, the segments gradually disappear or change, giving you a clear and intuitive view of how much time is left.',
      ],
      howItWorksTitle: 'How Radial Countdown Displays Work',
      howItWorksBody: [
        'The radial display is divided into equal segments. Each segment represents a small portion of the total duration. As time passes, the segments are turned off or change color in a smooth animation, making it easy to see the countdown progress at a glance.',
      ],
      calloutNote:
        'Try different segment counts and colors to find the style that works best for your activity or environment.',
      howToUseTitle: 'How to Use the Radial Timer',
      howToUseSteps: [
        'Choose a preset time or enter a custom duration.',
        'Select a radial style and color theme.',
        'Click Start to begin the countdown.',
        'Watch the segments disappear as time passes.',
        'Use Pause or Reset whenever needed.',
      ],
      featuresTitle: 'Radial Timer for Study and Productivity',
      featuresList: [
        'Segmented radial rays that make micro-milestones easy to count from a distance',
        'Adjustable spoke density (12, 24, 30, or 60 segments) to match your session length',
        'High-contrast glowing and minimalist themes for both desktop monitors and classroom boards',
        'Drift-free timestamp engine that keeps radial segments locked to real elapsed seconds',
        'Full keyboard control (Spacebar to start/pause, R to reset, F for fullscreen)',
      ],
      practicalExamples: [
        {
          icon: 'Clock',
          title: '30-Minute Deep Work Block (30 Segments)',
          description:
            'Each radial spoke represents exactly 1 minute of focused coding or writing, letting you see minute-by-minute progress without reading digits.',
        },
        {
          icon: 'Users',
          title: '12-Minute Lightning Talk (12 Segments)',
          description:
            'Speakers can glance at the 12 clock-like radial bars to know exactly how many minutes remain before Q&A.',
        },
        {
          icon: 'GraduationCap',
          title: '15-Minute Classroom Station Rotation',
          description:
            'Students count remaining illuminated spokes from across the room to pace group assignments and lab clean-up.',
        },
        {
          icon: 'CheckSquare',
          title: '60-Second Circuit Exercise Interval',
          description:
            'Use 60 radial ticks so every second extinguishes one spoke during planks, wall sits, or HIIT intervals.',
        },
      ],
      whoBenefitsTitle: 'Radial Timer for Group Activities',
      whoBenefitsList: [
        'Facilitators and scrum masters running time-boxed standups and retrospectives',
        'Students and writers who prefer discrete minute-by-minute ticks over a continuous sweep',
        'Fitness coaches and physical therapists timing isometric holds and circuit stations',
        'Teachers projecting a structured, easy-to-count visual clock on smartboards',
      ],
      tipsTitle: 'Expert Tips for Radial Countdown Pacing',
      tipsList: [
        'Match the segment count to your duration: use 12 segments for 12 minutes or 60 segments for 60 seconds so 1 spoke = 1 unit of time.',
        'Switch to Dark Mode when displaying on television screens or projectors for crisper spoke contrast.',
        'Press F for Fullscreen Mode so the radial ring fills the viewport during group sessions.',
        'Combine the radial visual with a gentle warning chime for the final 10% of segments.',
      ],
      problemsTitle: 'Radial Timer vs Circular Timer',
      problemsRows: [
        {
          problem: 'Counting Discrete Units (Minutes or Reps)',
          cause: 'A solid circular wedge shows overall proportion but not individual increments',
          solution: 'Radial Timer divides the ring into countable spokes so you can see individual units',
        },
        {
          problem: 'Glanceable Fractions (1/4, 1/2, 3/4)',
          cause: 'Both circular and radial layouts follow a 360-degree clock geometry',
          solution: 'Use Radial Timer for discrete ticks, or Circular Timer for a smooth continuous sweep',
        },
        {
          problem: 'Visual Clutter on Very Small Screens',
          cause: 'High spoke counts can look dense on compact phone screens',
          solution: 'Choose a lower segment count (12 or 24 spokes) on mobile devices for maximum clarity',
        },
      ],
    },
  },
  'rings-timer': {
    slug: 'rings-timer',
    categorySlug: 'timers',
    categoryLabel: 'Timers',
    heroSubtitle: 'A beautiful multi-ring countdown timer to help you stay focused and organized.',
    featurePills: [
      'Multiple concentric rings',
      'Customizable colors',
      'Works on all devices',
      'Free to use',
    ],
    quickPresets: [],
    steps: [],
    guide: {
      tableOfContents: [
        'What Is a Rings Timer?',
        'How Concentric Ring Timers Work',
        'How to Use This Ring Countdown',
        'Multiple Visual Time Indicators',
        'Rings Timer for Productivity and Learning',
        'Rings Timer vs Circular Timer',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is a Rings Timer?',
      whatIsBody: [
        'A rings timer is a visual countdown timer that uses multiple concentric rings to show the remaining time. Each ring represents a different portion or stage of the duration, giving you a clear and engaging view of your progress.',
      ],
      howItWorksTitle: 'How Concentric Ring Timers Work',
      howItWorksBody: [
        'The total duration is divided across multiple rings. As time passes, each ring gradually shrinks or changes color based on its assigned time segment. This makes it easy to see both the overall progress and smaller milestones within the same countdown.',
      ],
      calloutNote:
        'Use different colors for each ring to represent different stages, such as work, short breaks and final minutes.',
      howToUseTitle: 'How to Use This Ring Countdown',
      howToUseSteps: [
        'Choose a preset time or enter a custom duration.',
        'Select a ring style and customize the colors.',
        'Click Start to begin the countdown.',
        'Watch the rings decrease as time passes.',
        'Use Pause or Reset whenever needed.',
      ],
      featuresTitle: 'Multiple Visual Time Indicators',
      featuresList: [
        'Nested concentric rings that track macro session progress and micro intervals simultaneously',
        'Distinct color coding per ring so you can separate opening, core work, and wrap-up phases',
        'Smooth 60fps SVG arc rendering that scales cleanly to 4K monitors and classroom displays',
        'Optional center digital readout that can be hidden for pure geometric focus',
        'Instant keyboard shortcuts (Spacebar, R, F) and screen wake lock support',
      ],
      practicalExamples: [
        {
          icon: 'Monitor',
          title: 'Multi-Stage Coding & Review Sprint (45 Minutes)',
          description:
            'Track your overall 45-minute block on the outer ring while inner rings pace 15-minute implementation and testing milestones.',
        },
        {
          icon: 'Presentation',
          title: 'Workshop Facilitation (Intro, Activity, Debrief)',
          description:
            'Keep group workshops on schedule by using concentric rings to visualize when to transition from brainstorming to sharing.',
        },
        {
          icon: 'GraduationCap',
          title: 'Essay Practice (Outline, Draft, Proofread)',
          description:
            'Students use the nested rings to allocate proportional time to outlining, writing, and reviewing during timed practice exams.',
        },
        {
          icon: 'CheckSquare',
          title: 'Fitness Warm-Up, Peak Set & Cool-Down',
          description:
            'See both the current minute progress and total workout completion at a single glance from across the gym floor.',
        },
      ],
      whoBenefitsTitle: 'Rings Timer for Productivity and Learning',
      whoBenefitsList: [
        'Product designers, engineers, and writers who break deep work into multi-stage milestones',
        'Teachers and professors running multi-part lab exercises or timed writing prompts',
        'Apple Watch and fitness-ring fans who love closing concentric progress loops',
        'ADHD learners who stay engaged when long durations are broken into nested visual loops',
      ],
      tipsTitle: 'Expert Tips for Multi-Ring Time Management',
      tipsList: [
        'Assign a mental task to each ring before clicking Start (for example: Outer Ring = Total Session, Inner Ring = Current Sub-Task).',
        'Use contrasting palette themes so each concentric track stands out clearly from across the room.',
        'Enter Fullscreen Mode (press F) to turn your second monitor into a dedicated productivity dashboard.',
        'Enable the completion chime so you know the moment all concentric rings close at zero.',
      ],
      problemsTitle: 'Rings Timer vs Circular Timer',
      problemsRows: [
        {
          problem: 'Losing Momentum in Long 45–60 Minute Sessions',
          cause: 'A single circle moves very slowly over an hour, making progress feel invisible',
          solution: 'Rings Timer pairs a fast-moving inner ring with a steady outer ring so you see constant motion',
        },
        {
          problem: 'Tracking Multi-Part Tasks in One Countdown',
          cause: 'Standard timers only show a single undifferentiated bar or disk',
          solution: 'Concentric rings let you visually divide a session into distinct phases',
        },
        {
          problem: 'Simple Preschool or Toddler Countdowns',
          cause: 'Multiple rings may be more detail than young children need',
          solution: 'Use Rings Timer for study/work milestones, or Circular/Rainbow Timer for early learners',
        },
      ],
    },
  },
  'progress-timer': {
    slug: 'progress-timer',
    categorySlug: 'timers',
    categoryLabel: 'Timers',
    heroSubtitle: 'A simple and flexible progress bar timer to help you stay on track.',
    featurePills: [
      'Visual progress bar',
      'Multiple display styles',
      'Works on all devices',
      'Free to use',
    ],
    quickPresets: [],
    steps: [],
    guide: {
      tableOfContents: [
        'What Is a Progress Timer?',
        'How a Visual Progress Bar Timer Works',
        'How to Use the Progress Timer',
        'Progress Timer for Work and Study',
        'Using Progress Indicators for Timed Activities',
        'Progress Timer vs Countdown Timer',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is a Progress Timer?',
      whatIsBody: [
        'A progress timer is a visual countdown timer that uses a progress bar to show the remaining time. As the timer runs, the bar gradually decreases, giving you a clear and intuitive way to see how much time is left at a glance.',
      ],
      howItWorksTitle: 'How a Visual Progress Bar Timer Works',
      howItWorksBody: [
        'The progress bar represents the total duration. It starts full and gradually reduces as time passes. The bar can move horizontally, vertically or in segments, depending on the style you choose. The progress is synchronized with the countdown, so it accurately reflects the remaining time.',
      ],
      calloutNote:
        'Set a warning alert to get a sound notification when the timer reaches the last few seconds. This is helpful for meetings, classes and focused work sessions.',
      howToUseTitle: 'How to Use the Progress Timer',
      howToUseSteps: [
        'Enter a duration or choose a preset time.',
        '(Optional) Add a task or event label.',
        'Select a display style and color.',
        'Click Start to begin the countdown.',
        'Watch the progress bar decrease as time passes.',
        'Use Pause or Reset whenever needed.',
      ],
      featuresTitle: 'Progress Timer for Work and Study',
      featuresList: [
        'Clean linear horizontal and segmented progress bars that show exact percentage completion',
        'Space-efficient layout that docks neatly beside study notes, code editors, or slide decks',
        'Automatic or custom color transitions as the bar approaches the final minutes',
        'Optional percentage, elapsed time, and remaining digital readout toggles',
        'Accurate background tab timing using high-precision system timestamps',
      ],
      practicalExamples: [
        {
          icon: 'Monitor',
          title: 'Split-Screen Study & Coding Sprints',
          description:
            'Keep the horizontal progress bar docked at the edge of your laptop screen while taking notes or writing code.',
        },
        {
          icon: 'Presentation',
          title: 'Webinar Breaks & Live Stream Intermissions',
          description:
            'Screen-share a clean "Back in 5:00" progress bar during Zoom workshops, Twitch streams, or virtual conferences.',
        },
        {
          icon: 'GraduationCap',
          title: 'Timed Quizzes & Standardized Test Prep',
          description:
            'Simulate computer-based testing interfaces that display a horizontal time-remaining bar at the top of the screen.',
        },
        {
          icon: 'Users',
          title: 'Agile Standup & Agenda Time-Boxing',
          description:
            'Give each agenda topic a 10-minute linear bar so everyone in the meeting sees when to move to action items.',
        },
      ],
      whoBenefitsTitle: 'Using Progress Indicators for Timed Activities',
      whoBenefitsList: [
        'Remote workers, streamers, and webinar hosts sharing a visual break bar on screen',
        'Students preparing for digital exams (GRE, GMAT, SAT, nursing boards) that use linear timer bars',
        'Project managers and facilitators keeping agenda items strictly on schedule',
        'Anyone who prefers a left-to-right progress bar over a circular clock face',
      ],
      tipsTitle: 'Expert Tips for Linear Progress Timing',
      tipsList: [
        'Add a custom task label (e.g., "Q3 Planning — Wrap up at 20%") so teammates immediately know the goal of the timer.',
        'Use segmented bar style when you want clear 10% or 25% checkpoint markers along the track.',
        'Enable the final warning chime to alert speakers before the bar hits zero.',
        'Press F for Fullscreen Mode when displaying a break countdown on a conference room screen.',
      ],
      problemsTitle: 'Progress Timer vs Countdown Timer',
      problemsRows: [
        {
          problem: 'Estimating Halfway or 75% Completion Instantly',
          cause: 'Digits like 18:45 out of 25:00 require mental division to judge progress',
          solution: 'A linear Progress Bar makes 50%, 75%, and 90% milestones immediately obvious',
        },
        {
          problem: 'Fitting a Timer into a Narrow Split-Screen Window',
          cause: 'Large circular or hourglass graphics need square vertical height',
          solution: 'Horizontal Progress Timer fits comfortably in compact side-by-side browser windows',
        },
        {
          problem: 'Audience Asking "How Much Longer Is the Break?"',
          cause: 'Static slides give no live indication of remaining break time',
          solution: 'Share the Progress Timer tab so remote and in-room attendees see the live bar fill',
        },
      ],
    },
  },
  'pixel-timer': {
    categorySlug: 'everyday',
    categoryLabel: 'Timers',
    heroSubtitle:
      'A fun and retro pixel countdown timer to help you stay focused.',
    featurePills: [
      'Retro pixel animation',
      'Multiple styles and colors',
      'Works on all devices',
      'Free to use',
    ],
    steps: [],
    guide: {
      tableOfContents: [
        'What Is a Pixel Timer?',
        'How the Pixel Countdown Works',
        'How to Use a Retro Pixel Timer',
        'Pixel Timer for Gaming and Study Breaks',
        'Customizing Pixel Countdown Styles',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is a Pixel Timer?',
      whatIsBody: [
        'A pixel timer is a visual countdown timer that uses a grid of square pixels to show the remaining time. As the timer runs, the filled pixels gradually disappear, giving you a clear and engaging visual representation of time.',
      ],
      howItWorksTitle: 'How the Pixel Countdown Works',
      howItWorksBody: [
        'The timer divides the total duration into a grid of pixels. Each pixel represents a small portion of the total time. As time passes, the pixels turn off or change color in a smooth sequence, making it easy to see how much time is left at a glance.',
      ],
      calloutNote:
        'Use a higher pixel density for a smoother animation and a lower density for a classic retro look.',
      howToUseTitle: 'How to Use a Retro Pixel Timer',
      howToUseSteps: [
        'Choose a preset time or enter a custom duration.',
        'Select a pixel style, color theme and pixel density.',
        'Click Start to begin the countdown.',
        'Watch the pixels disappear as time passes.',
        'Use Pause or Reset whenever needed.',
      ],
      featuresTitle: 'Pixel Timer for Gaming and Study Breaks',
      featuresList: [
        'Crisp 8-bit and 16-bit retro pixel grid animations that clear block-by-block as time elapses',
        'Adjustable grid density so you can choose chunky arcade blocks or fine mosaic matrices',
        'Nostalgic arcade, neon synthwave, and classic handheld color palettes',
        'Gamified visual feedback that makes study sprints and chore countdowns feel like a game level',
        'Full-screen display and keyboard shortcuts (Spacebar, R, F) for desktop and classroom setups',
      ],
      practicalExamples: [
        {
          icon: 'Monitor',
          title: 'Pomodoro Study & Coding Sprints (25 Minutes)',
          description:
            'Turn exam revision or bug-squashing sessions into an arcade challenge by clearing the entire pixel matrix before taking a break.',
        },
        {
          icon: 'Tv',
          title: 'Gaming Screen Time & Break Limits',
          description:
            'Help kids and teens manage video game sessions or intermission breaks with a visual timer that matches their gaming setup.',
        },
        {
          icon: 'GraduationCap',
          title: 'STEM, Coding & Robotics Club Challenges',
          description:
            'Project the retro pixel grid during Scratch, Python, or robotics classroom challenges to build excitement without stress.',
        },
        {
          icon: 'Users',
          title: 'Trivia Nights & Game Show Rounds',
          description:
            'Display a bold 60-second pixel matrix on a TV so teams can watch the remaining squares vanish during lightning rounds.',
        },
      ],
      whoBenefitsTitle: 'Who Benefits from a Retro Pixel Timer?',
      whoBenefitsList: [
        'Gamers, streamers, and developers who love retro 8-bit and pixel-art aesthetics on their desk setup',
        'Students with ADHD who find gamified grid clearing more motivating than a plain digital clock',
        'Coding teachers, STEM club leaders, and esports coaches timing practice drills',
        'Parents setting fair, visual video-game turn timers for siblings',
      ],
      tipsTitle: 'Customizing Pixel Countdown Styles',
      tipsList: [
        'Choose a lower pixel density for short 1–5 minute tasks so every disappearing square feels like a visible milestone.',
        'Switch to a high-density pixel grid for 25–60 minute study blocks so the matrix updates every few seconds.',
        'Pair with Dark Mode on OLED or dual-monitor setups for an authentic arcade cabinet glow.',
        'Use the Spacebar shortcut to pause instantly when answering a question or switching tasks.',
      ],
      problemsTitle: 'Pixel Grid Timer vs Standard Digital Timer',
      problemsRows: [
        {
          problem: 'Boredom During Repetitive Homework or Drills',
          cause: 'Plain numeric timers feel clinical and uninspiring',
          solution: 'Pixel Timer gamifies the countdown so watching the grid clear feels rewarding',
        },
        {
          problem: 'Judging Area vs Reading Digits',
          cause: 'Calculating remaining percentage from MM:SS takes mental effort',
          solution: 'The 2D pixel grid shows exact area remaining—half the grid lit means half the time left',
        },
        {
          problem: 'Matching a Gaming or Stream Overlay Aesthetic',
          cause: 'Office timers clash with gaming setups and coding themes',
          solution: 'Retro pixel palettes blend naturally into developer and streamer workspaces',
        },
      ],
    },
  },
  'blocks-timer': {
    categorySlug: 'everyday',
    categoryLabel: 'Timers',
    heroSubtitle:
      'A visual block countdown timer to help you stay focused and track time.',
    featurePills: [
      'Visual block countdown',
      'Multiple styles',
      'Works on all devices',
      'Free to use',
    ],
    steps: [],
    guide: {
      tableOfContents: [
        'What Is a Blocks Timer?',
        'How the Stacked Block Countdown Works',
        'How to Use the Block Timer',
        'Blocks Timer for Games and Classroom Activities',
        'Visual Blocks vs Digital Countdown',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is a Blocks Timer?',
      whatIsBody: [
        'A blocks timer is a visual countdown timer that uses a stacked set of blocks to show the remaining time. As time passes, blocks are removed from the stack, giving you a clear and intuitive sense of how much time is left.',
      ],
      howItWorksTitle: 'How the Stacked Block Countdown Works',
      howItWorksBody: [
        'The total duration is divided into equal blocks. Each block represents a portion of the time. At regular intervals, one block is removed from the stack. As the stack gets shorter, you can easily see the time decreasing.',
      ],
      calloutNote:
        'Use more blocks for a smoother countdown and fewer blocks for a simple and clear visual.',
      howToUseTitle: 'How to Use the Block Timer',
      howToUseSteps: [
        'Choose a preset time or enter a custom duration.',
        'Select a block style, color theme and number of blocks.',
        'Click Start to begin the countdown.',
        'Watch the blocks disappear one by one.',
        'Use Pause or Reset whenever needed.',
      ],
      featuresTitle: 'Blocks Timer for Games and Classroom Activities',
      featuresList: [
        'Tactile stacked-block visualization where each block represents a fixed chunk of time',
        'Configurable block counts (e.g., 5, 10, 15, or 20 blocks) to match any activity length',
        'Crystal-clear countable milestones ideal for children, classrooms, and time-chunking',
        'Bright, high-contrast color themes that remain legible across a classroom or gym',
        'Distraction-free fullscreen mode with optional digital readout and end-of-timer sound',
      ],
      practicalExamples: [
        {
          icon: 'GraduationCap',
          title: '10-Minute Classroom Clean-Up (10 Blocks = 1 Min Each)',
          description:
            'Set 10 blocks for 10 minutes so young students know that every time a block disappears, one minute has passed.',
        },
        {
          icon: 'CheckSquare',
          title: '25-Minute Time-Chunked Study (5 Blocks = 5 Min Each)',
          description:
            'Break a 25-minute homework session into 5 manageable 5-minute building blocks to prevent overwhelm.',
        },
        {
          icon: 'Users',
          title: 'Board Games & Turn-Taking',
          description:
            'Give each player a 5-block stack during family game night so everyone can see how many blocks remain in their turn.',
        },
        {
          icon: 'Clock',
          title: 'Morning Routine & Getting Ready for School',
          description:
            'Use a 15-minute block tower for getting dressed and packing backpacks—kids race to finish before the bottom block vanishes.',
        },
      ],
      whoBenefitsTitle: 'Who Benefits Most from a Stacked Blocks Timer?',
      whoBenefitsList: [
        'Elementary school teachers and special educators teaching time-chunking and counting',
        'Children who understand concrete building blocks long before they can read a clock',
        'Adults with ADHD or executive dysfunction who benefit from breaking tasks into 5-minute blocks',
        'Occupational and speech therapists pacing structured therapy exercises',
      ],
      tipsTitle: 'Tips for Effective Time-Chunking with Blocks',
      tipsList: [
        'Set the number of blocks to match the number of minutes (e.g., 5 blocks for 5 minutes) so 1 block = 1 minute.',
        'For longer 30-minute study sessions, use 6 blocks so each block represents a clear 5-minute mini-goal.',
        'Challenge students or kids to complete one sub-task (like 3 math problems) per block.',
        'Use Fullscreen Mode on a tablet or smartboard so the block stack is large and easy to count.',
      ],
      problemsTitle: 'Visual Blocks vs Digital Countdown',
      problemsRows: [
        {
          problem: 'Task Paralysis on Long Assignments',
          cause: 'A 30:00 digital timer looks like one giant wall of time',
          solution: 'Blocks Timer breaks the session into bite-sized, countable chunks',
        },
        {
          problem: 'Rapidly Changing Seconds Causing Anxiety',
          cause: 'Ticking seconds create visual noise for sensitive learners',
          solution: 'Blocks update in calm, discrete steps while keeping exact time',
        },
        {
          problem: 'Helping Kids Pace Multi-Step Chores',
          cause: 'Children spend 90% of the time on the first step',
          solution: 'Assign 1–2 blocks per chore step so kids pace themselves evenly',
        },
      ],
    },
  },
  'candle-timer': {
    categorySlug: 'everyday',
    categoryLabel: 'Timers',
    heroSubtitle:
      'A peaceful and visual candle countdown timer to help you focus, relax and stay on track.',
    featurePills: [
      'Realistic candle animation',
      'Multiple styles and colors',
      'Works on all devices',
      'Free to use',
    ],
    steps: [],
    guide: {
      tableOfContents: [
        'What Is a Candle Timer?',
        'How the Candle Countdown Works',
        'How to Use the Digital Candle Timer',
        'Candle Timer for Reading and Quiet Activities',
        'Digital Candle Timer vs Physical Candles',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is a Candle Timer?',
      whatIsBody: [
        'A candle timer is a visual countdown timer that uses a digital candle to show the remaining time. As the timer runs, the candle wax gradually decreases, giving you a calm and intuitive view of how much time is left.',
      ],
      howItWorksTitle: 'How the Candle Countdown Works',
      howItWorksBody: [
        'The total duration is represented by the height of the candle wax. As time passes, the wax slowly melts and the candle becomes shorter. The flame gently flickers, creating a relaxing visual effect while the countdown continues. When the timer reaches zero, the candle is completely burnt out.',
      ],
      calloutNote:
        'Use a calm environment and turn on sound alerts to make your session more effective.',
      howToUseTitle: 'How to Use the Digital Candle Timer',
      howToUseSteps: [
        'Choose a preset time or enter a custom duration.',
        'Select a candle style and flame type.',
        'Click Start to begin the countdown.',
        'Watch the candle wax decrease as time passes.',
        'Use Pause or Reset whenever needed.',
      ],
      featuresTitle: 'Candle Timer for Reading and Quiet Activities',
      featuresList: [
        'Warm, gently flickering flame animation paired with proportional wax melting',
        'Inspired by historic medieval time-candles with clear horizontal height progression',
        'Cozy dark-academia and evening themes that reduce harsh blue light during late study sessions',
        '100% safe, smoke-free, and classroom/dorm-compliant alternative to open flames',
        'Optional soft acoustic chime when the candle burns down to the base',
      ],
      practicalExamples: [
        {
          icon: 'Flame',
          title: 'Evening Reading & Journaling (20–30 Minutes)',
          description:
            'Set a 30-minute candle timer on your nightstand or iPad to unwind with a book before bed without checking your phone.',
        },
        {
          icon: 'GraduationCap',
          title: 'Dark Academia Study & Essay Writing',
          description:
            'Create a cozy library atmosphere on your secondary monitor while writing papers or studying literature.',
        },
        {
          icon: 'Heart',
          title: 'Meditation, Breathwork & Trataka Focus',
          description:
            'Use the gentle flickering flame as a calm focal point during 10-minute mindfulness or yoga cool-down sessions.',
        },
        {
          icon: 'Users',
          title: 'Classroom Silent Sustained Reading (SSR)',
          description:
            'Project the melting candle on the classroom board during quiet reading time—students stay quiet while the candle is lit.',
        },
      ],
      whoBenefitsTitle: 'Who Uses the Digital Candle Timer?',
      whoBenefitsList: [
        'Students and writers who love cozy "study with me" and dark-academia desk aesthetics',
        'College students in dorms and teachers in classrooms where real candles are prohibited',
        'Meditation practitioners, yoga instructors, and evening readers seeking a low-glare timer',
        'Anyone who finds mechanical ticking clocks too harsh for creative or reflective work',
      ],
      tipsTitle: 'Tips for Creating a Calm Candle-Timed Routine',
      tipsList: [
        'Switch to Dark Mode and Fullscreen (press F) to let the warm amber flame glow softly in a dim room.',
        'Hide the digital numbers when journaling or meditating so you only notice the natural wax height.',
        'Use a 45-minute candle for deep writing blocks and a short 5-minute votive for tea breaks.',
        'Keep Screen Wake Lock enabled so your tablet or laptop stays lit for the entire burn duration.',
      ],
      problemsTitle: 'Digital Candle Timer vs Physical Candles',
      problemsRows: [
        {
          problem: 'Exact Countdown Accuracy',
          cause: 'Real wax candles burn unevenly depending on room drafts and wick length',
          solution: 'Digital Candle Timer melts at a mathematically exact rate to finish at 00:00',
        },
        {
          problem: 'Fire Safety in Dorms, Classrooms & Bedrooms',
          cause: 'Open flames pose fire hazards and are banned in schools and dormitories',
          solution: 'Enjoy the warm ambient glow of a candle on any screen with zero fire or smoke risk',
        },
        {
          problem: 'Reusability Across Any Duration',
          cause: 'A physical candle cannot be reset or adjusted from 5 minutes to 60 minutes',
          solution: 'Reset and reuse your digital candle infinitely for any time length',
        },
      ],
    },
  },
  'aesthetic-timer': {
    categorySlug: 'everyday',
    categoryLabel: 'Timers',
    heroSubtitle:
      'A calm and customizable visual timer to help you focus, be productive and enjoy your time.',
    featurePills: [
      'Beautiful themes',
      'Customizable design',
      'Works on all devices',
      'Free to use',
    ],
    steps: [],
    guide: {
      tableOfContents: [
        'What Is an Aesthetic Timer?',
        'Beautiful Timer Themes and Styles',
        'How to Use an Aesthetic Countdown',
        'Aesthetic Timer for Studying',
        'Aesthetic Timer for Work and Productivity',
        'Choosing a Calm Timer Design',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is an Aesthetic Timer?',
      whatIsBody: [
        'An aesthetic timer is a visual countdown timer with carefully designed themes, colors and styles. It combines functionality with a beautiful and calming design, making it a pleasant desk accessory for studying, working and everyday routines.',
      ],
      howItWorksTitle: 'Beautiful Timer Themes and Styles',
      howItWorksBody: [
        'This timer offers a collection of carefully crafted themes such as minimal ivory, warm sunset, forest green, soft pastel, dark academia, clean monochrome, natural paper texture and coastal blue. Each theme gives a unique and peaceful visual experience.',
      ],
      calloutNote:
        'Save your favorite theme and settings so you can quickly start your timer with the same aesthetic style next time.',
      howToUseTitle: 'How to Use an Aesthetic Countdown',
      howToUseSteps: [
        'Choose a duration or select a preset time.',
        'Pick a theme or customize the accent color.',
        '(Optional) Add a session label.',
        'Click Start to begin the countdown.',
        'Use Pause or Reset whenever needed.',
      ],
      featuresTitle: 'Aesthetic Timer for Studying',
      featuresList: [
        'Curated designer palettes including Minimal Ivory, Dark Academia, Matcha Forest, Warm Sunset, and Soft Pastel',
        'Refined editorial typography with balanced whitespace designed for modern desk setups',
        'Custom session labels so you can display your current study subject or goal right on screen',
        'Distraction-free fullscreen mode that turns any iPad, laptop, or monitor into a minimalist desk clock',
        'Gentle, non-jarring completion chimes and persistent theme preferences',
      ],
      practicalExamples: [
        {
          icon: 'GraduationCap',
          title: '"Study With Me" & Pomodoro Desk Setups',
          description:
            'Place an iPad or secondary monitor on your desk running a 50/10 study block in Minimal Ivory or Matcha Green.',
        },
        {
          icon: 'Palette',
          title: 'Creative Design, Writing & Illustration Sessions',
          description:
            'Keep time without breaking your visual flow using a calm, color-coordinated countdown alongside Figma or Notion.',
        },
        {
          icon: 'Monitor',
          title: 'Content Creation & Livestream Backdrops',
          description:
            'Display a clean, photogenic timer on camera during YouTube study vlogs, co-working streams, or TikTok time-lapses.',
        },
        {
          icon: 'Heart',
          title: 'Morning Coffee, Journaling & Self-Care Routines',
          description:
            'Start your morning with a peaceful 15-minute Warm Sunset countdown for stretching, planning, and mindfulness.',
        },
      ],
      whoBenefitsTitle: 'Aesthetic Timer for Work and Productivity',
      whoBenefitsList: [
        'Students and "Studygram" / "StudyTok" creators who curate calm, inspiring desk setups',
        'Designers, writers, and Notion enthusiasts who dislike cluttered, utilitarian utility websites',
        'Remote workers who keep a dedicated tablet or portrait monitor as a desk dashboard',
        'Sensitive focusers who want a peaceful visual timer without aggressive flashing red numbers',
      ],
      tipsTitle: 'Choosing a Calm Timer Design',
      tipsList: [
        'Match your timer palette to the time of day: use airy Ivory or Coastal Blue in the morning and Dark Academia or Sunset in the evening.',
        'Add a specific intention in the session label (e.g., "Chapter 4 Organic Chemistry Notes") to anchor your attention.',
        'Press F to enter Fullscreen Mode and hide browser tabs for a clean, frame-worthy display.',
        'Enable Screen Wake Lock on tablets so your desk timer never dims mid-Pomodoro.',
      ],
      problemsTitle: 'Aesthetic Timer vs Standard Utility Timers',
      problemsRows: [
        {
          problem: 'Harsh, Cluttered Utility Websites Ruining Focus',
          cause: 'Many online timers are surrounded by flashing banners and jarring neon colors',
          solution: 'Aesthetic Timer uses calm editorial typography and zero-clutter themes',
        },
        {
          problem: 'Phone Timers Leading to Social Media Distraction',
          cause: 'Picking up your phone to check the timer triggers notification checking',
          solution: 'Keep the Aesthetic Timer open in fullscreen on your laptop or iPad so your phone stays away',
        },
        {
          problem: 'Eye Strain During Late-Night Study Sessions',
          cause: 'Pure white #FFFFFF backgrounds cause glare in dim rooms',
          solution: 'Switch to Warm Paper, Dark Academia, or Dusk palettes for comfortable low-light viewing',
        },
      ],
    },
  },
  'picture-reveal-timer': {
    categorySlug: 'everyday',
    categoryLabel: 'Timers',
    heroSubtitle:
      'Upload a photo and watch it gradually appear as the countdown runs. Perfect for classrooms, games, quizzes and surprises.',
    featurePills: [
      'Upload your own image',
      'Customizable grid',
      'Multiple reveal styles',
      'Works on all devices',
      'Free to use',
    ],
    steps: [],
    guide: {
      tableOfContents: [
        'What Is a Picture Reveal Timer?',
        'How the Photo Reveal Countdown Works',
        'How to Upload and Reveal Your Picture',
        'Picture Reveal Timer for Classrooms',
        'Photo Guessing Games and Group Activities',
        'Image Privacy and Browser Processing',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is a Picture Reveal Timer?',
      whatIsBody: [
        'A picture reveal timer is a visual countdown timer that hides an image behind a grid of tiles and gradually reveals it as time passes. It is a fun and engaging way to build excitement for classroom activities, games, quizzes and group events.',
      ],
      howItWorksTitle: 'How the Photo Reveal Countdown Works',
      howItWorksBody: [
        'The uploaded image is divided into a grid of tiles. As the countdown runs, the tiles disappear either randomly or in a set order, gradually revealing the picture underneath. When the timer reaches zero, the full image is displayed.',
      ],
      calloutNote:
        'All uploaded photos are processed locally inside your browser and are never sent to a server.',
      howToUseTitle: 'How to Upload and Reveal Your Picture',
      howToUseSteps: [
        'Click the upload button and choose an image from your device.',
        'Adjust the timer duration and grid size.',
        'Select a reveal style such as random or sequential.',
        'Click Start to begin the countdown.',
        'Watch the tiles disappear and reveal your picture.',
        'Use Pause or Reset whenever needed.',
      ],
      featuresTitle: 'Picture Reveal Timer for Classrooms',
      featuresList: [
        'Instant local photo upload (JPG, PNG, WebP) with 100% client-side browser privacy',
        'Configurable tile grid sizes from simple 3×3 grids up to challenging 10×10 puzzles',
        'Multiple reveal orders including Random Scatter, Sequential Row-by-Row, and Spiral',
        'Synchronized tile removal that uncovers the final tile at the exact moment 00:00 is reached',
        'Pause-and-guess support using the Spacebar so teachers and quizmasters can take answers mid-countdown',
      ],
      practicalExamples: [
        {
          icon: 'GraduationCap',
          title: 'Classroom Bell-Ringers & Mystery Lesson Hooks',
          description:
            'Upload a photo of a historical landmark, animal, or science diagram and let students guess today’s lesson topic as tiles vanish.',
        },
        {
          icon: 'Users',
          title: 'Trivia Nights & Zoom Icebreakers',
          description:
            'Run a "Guess the Celebrity, Movie Poster, or City" round where teams earn more points the earlier they buzz in.',
        },
        {
          icon: 'Heart',
          title: 'Reward & Surprise Announcements for Kids',
          description:
            'Motivate kids during a 10-minute room clean-up by revealing a picture of their weekend treat or outing as they tidy up.',
        },
        {
          icon: 'Presentation',
          title: 'ESL & Vocabulary Flashcard Games',
          description:
            'Language teachers pause the timer every few tiles to let students practice describing visual clues in the target language.',
        },
      ],
      whoBenefitsTitle: 'Photo Guessing Games and Group Activities',
      whoBenefitsList: [
        'Elementary, middle, and high school teachers creating interactive bell-ringers and review games',
        'Trivia hosts, youth group leaders, and event facilitators running live or virtual game shows',
        'Speech-language pathologists (SLPs) and ESL instructors prompting descriptive conversation',
        'Parents turning daily chores into an exciting mystery picture reveal for children',
      ],
      tipsTitle: 'Image Privacy and Browser Processing Tips',
      tipsList: [
        'Your uploaded photos never leave your device—all slicing and tile animation happen locally in your browser memory.',
        'Use a Random reveal pattern for guessing games so the center of the photo isn’t given away predictably.',
        'Press Spacebar at any moment to freeze the tiles while a student or team makes a guess, then press Spacebar again to resume.',
        'Choose a higher grid density (e.g., 8×8 or 10×10) when playing with older students or adults to keep the mystery challenging.',
      ],
      problemsTitle: 'Picture Reveal Timer Troubleshooting & Best Practices',
      problemsRows: [
        {
          problem: 'Students Guess the Picture Too Quickly',
          cause: 'Large tiles uncover big sections of the subject right away',
          solution: 'Increase the grid size and select Random Reveal so smaller clues appear gradually',
        },
        {
          problem: 'School Privacy Policy for Classroom Photos',
          cause: 'Cloud upload tools store images on external servers',
          solution: 'Picture Reveal Timer processes files 100% locally in the browser with zero server uploads',
        },
        {
          problem: 'Image Aspect Ratio Cropping',
          cause: 'Tall portrait photos on wide landscape screens',
          solution: 'Use landscape (16:9 or 4:3) images for the best full-screen smartboard fit',
        },
      ],
    },
  },
  'heart-timer': {
    categorySlug: 'everyday',
    categoryLabel: 'Timers',
    heroSubtitle:
      'A beautiful heart-shaped countdown timer to help you focus, relax and make the most of your time.',
    featurePills: [
      'Beautiful designs',
      'Customizable styles',
      'Works on all devices',
      'Free to use',
    ],
    steps: [],
    guide: {
      tableOfContents: [
        'What Is a Heart-Shaped Timer?',
        'How the Heart Countdown Works',
        'How to Use the Heart Timer',
        'Heart Timer for Activities and Games',
        'Customize the Heart Timer Display',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is a Heart-Shaped Timer?',
      whatIsBody: [
        'A heart-shaped timer is a visual countdown timer that uses a heart design to show the remaining time. The heart fill gradually decreases as time passes, giving you a clear and engaging way to stay on track.',
      ],
      howItWorksTitle: 'How the Heart Countdown Works',
      howItWorksBody: [
        'The heart starts with a full color fill. As time passes, the fill level reduces smoothly and accurately. When the timer reaches zero, the heart is empty and the countdown is complete.',
      ],
      calloutNote:
        'Try different themes and colors to find the one that helps you stay focused and calm.',
      howToUseTitle: 'How to Use the Heart Timer',
      howToUseSteps: [
        'Choose a preset time or enter a custom duration.',
        'Select a heart style, color theme and your preferred accent color.',
        'Click Start to begin the countdown.',
        'Watch the heart fill decrease as time passes.',
        'Use Pause or Reset whenever needed.',
      ],
      featuresTitle: 'Heart Timer for Activities and Games',
      featuresList: [
        'Smooth liquid-fill and pulse animations inside a sculpted heart silhouette',
        'Warm rose, coral, berry, and pastel color themes for a friendly, uplifting vibe',
        'Proportional vertical fill level that shows remaining time at a single glance',
        'Gentle optional pulse rhythm that doubles as a calming visual anchor',
        'Full-screen mode and one-key shortcuts (Spacebar, R, F) across mobile and desktop',
      ],
      practicalExamples: [
        {
          icon: 'Heart',
          title: 'Self-Care, Skincare & Mindfulness Breaks',
          description:
            'Time a 10-minute face mask, gratitude journaling session, or breathing break with a warm, encouraging visual.',
        },
        {
          icon: 'GraduationCap',
          title: 'Social-Emotional Learning (SEL) & Sharing Circles',
          description:
            'Teachers pass a talking piece around the circle while the Heart Timer gives each student 2 minutes to share.',
        },
        {
          icon: 'CheckSquare',
          title: 'Cardio, Jump Rope & Wellness Circuits',
          description:
            'Use the heart visual during PE class or home cardio intervals to keep energy positive and motivating.',
        },
        {
          icon: 'Users',
          title: 'Valentine’s Day, Classroom Parties & Icebreakers',
          description:
            'Project the Heart Timer on a smartboard during themed classroom games, speed-friending, or party stations.',
        },
      ],
      whoBenefitsTitle: 'Who Loves Using the Heart Timer?',
      whoBenefitsList: [
        'Teachers leading Social-Emotional Learning (SEL), morning meetings, and kindness activities',
        'Children who respond warmly to friendly, approachable shapes during homework or chores',
        'Wellness coaches, counselors, and therapists timing reflection or relaxation exercises',
        'Students and creators who enjoy cute, kawaii, or pastel desk setups',
      ],
      tipsTitle: 'Customize the Heart Timer Display',
      tipsList: [
        'Use soft pastel rose or lavender themes for calm reflection, or vibrant ruby red for energetic classroom games.',
        'Toggle off the digital clock digits when you want children or clients to focus purely on the visual fill level.',
        'Press F for Fullscreen Mode so the heart fills the screen on tablets or classroom projectors.',
        'Pair with a gentle chime alert so transitions feel warm and supportive rather than abrupt.',
      ],
      problemsTitle: 'Heart Visual Timer vs Standard Digital Timers',
      problemsRows: [
        {
          problem: 'Timers Feeling Cold or Punitive for Young Kids',
          cause: 'Harsh red digits and loud buzzers can feel stressful during timeouts or transitions',
          solution: 'The Heart Timer frames time limits in a warm, positive, and comforting shape',
        },
        {
          problem: 'Keeping Seasonal or SEL Activities Engaging',
          cause: 'Plain utility timers break the mood of themed classroom events',
          solution: 'Customizable heart styles match wellness, kindness, and party themes effortlessly',
        },
        {
          problem: 'Judging Halfway Point Without Reading Numbers',
          cause: 'Pre-readers cannot interpret MM:SS digits',
          solution: 'Watching the heart fill drop to the middle gives instant visual feedback',
        },
      ],
    },
  },
  'moon-timer': {
    categorySlug: 'everyday',
    categoryLabel: 'Timers',
    heroSubtitle:
      'A calming and beautiful moon visual timer to help you focus, relax and enjoy your time.',
    featurePills: [
      'Beautiful night themes',
      'Customizable display',
      'Works on all devices',
      'Free to use',
    ],
    steps: [],
    guide: {
      tableOfContents: [
        'What Is a Moon Visual Timer?',
        'How the Moon Countdown Animation Works',
        'How to Use the Moon Timer',
        'Moon Timer for Quiet Activities and Evening Routines',
        'Moon Timer vs Actual Lunar Phases',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is a Moon Visual Timer?',
      whatIsBody: [
        'A moon visual timer is a calming countdown timer that uses a moon design to show the remaining time. As the timer runs, the illuminated part of the moon gradually changes, giving you a peaceful and visual way to stay focused.',
      ],
      howItWorksTitle: 'How the Moon Countdown Animation Works',
      howItWorksBody: [
        'The timer starts with a bright moon and the shadow slowly moves across the moon as time passes. The illuminated portion reduces smoothly and accurately to match the selected duration. When the timer reaches zero, the moon reaches its completed state based on the chosen theme.',
      ],
      calloutNote:
        'Try different moon styles and backgrounds to create a relaxing environment for your activity.',
      howToUseTitle: 'How to Use the Moon Timer',
      howToUseSteps: [
        'Choose a preset time or enter a custom duration.',
        'Select a moon style and background theme.',
        'Adjust brightness and display settings if needed.',
        'Click Start to begin the countdown.',
        'Watch the moon change as time passes.',
        'Use Pause or Reset whenever needed.',
      ],
      featuresTitle: 'Moon Timer for Quiet Activities and Evening Routines',
      featuresList: [
        'Smooth lunar phase progression that transitions from a glowing full moon to crescent and new moon',
        'Eye-friendly midnight, indigo, and starlight palettes designed for dim rooms and evening wind-downs',
        'Zero harsh flashing elements—ideal for bedtime routines, nap time, and late-night studying',
        'Optional numerical readout that can be hidden for a pure celestial display',
        'Built-in Screen Wake Lock and quiet chime options for gentle transitions',
      ],
      practicalExamples: [
        {
          icon: 'Clock',
          title: 'Kids’ Bedtime Wind-Down (15–20 Minutes)',
          description:
            'Let children read or play quietly until the full moon slowly wanes into a sleepy crescent—signaling lights-out without arguments.',
        },
        {
          icon: 'GraduationCap',
          title: 'Preschool & Kindergarten Rest / Quiet Time',
          description:
            'Project the calming night sky on the classroom screen during post-lunch rest time so children see how long quiet time lasts.',
        },
        {
          icon: 'Heart',
          title: 'Evening Meditation, Yin Yoga & Breathwork',
          description:
            'Dim the room lights and use a 20-minute lunar countdown to hold restorative poses or practice evening mindfulness.',
        },
        {
          icon: 'Monitor',
          title: 'Late-Night Study & Creative Writing',
          description:
            'Avoid bright white screens after 9 PM by using the low-glare Moon Timer on your secondary display.',
        },
      ],
      whoBenefitsTitle: 'Who Benefits Most from the Moon Visual Timer?',
      whoBenefitsList: [
        'Parents establishing peaceful, predictable bedtime and storytime routines for young children',
        'Early childhood educators managing classroom nap time, quiet reading, and calm-down corners',
        'Night-owl students, programmers, and writers who prefer dark, low-blue-light visuals at night',
        'Yoga teachers, sound-bath facilitators, and meditation guides pacing evening sessions',
      ],
      tipsTitle: 'Tips for Evening & Quiet-Time Pacing',
      tipsList: [
        'Tell young kids: "When the moon turns into a tiny sliver, it’s time to tuck in"—visual cues work far better than clock numbers at bedtime.',
        'Lower your screen brightness slightly and press F for Fullscreen Mode to create an ambient nightlight effect.',
        'Disable or soften the end alarm when using the Moon Timer for falling asleep or savasana relaxation.',
        'Use the Spacebar to pause smoothly if bedtime story questions take an extra minute.',
      ],
      problemsTitle: 'Moon Timer vs Actual Lunar Phases',
      problemsRows: [
        {
          problem: 'Countdown Duration vs 29.5-Day Astronomical Cycle',
          cause: 'The real moon takes 29.5 days to cycle from full to new',
          solution: 'Moon Timer scales the lunar shadow animation to match your exact chosen minutes and seconds',
        },
        {
          problem: 'Bright Screens Disrupting Melatonin Before Bed',
          cause: 'Standard white timers emit harsh glare in dark rooms',
          solution: 'Deep night-sky backgrounds keep ambient light soft and sleep-friendly',
        },
        {
          problem: 'Toddlers Asking "Is Rest Time Over Yet?"',
          cause: 'Young children cannot read digital clocks',
          solution: 'The waning moon shadow shows clearly how much rest time remains',
        },
      ],
    },
  },
  'sun-timer': {
    categorySlug: 'everyday',
    categoryLabel: 'Timers',
    heroSubtitle:
      'A beautiful sun visual timer to help you focus, stay productive and enjoy your time with calming sky scenes.',
    featurePills: [
      'Beautiful sky themes',
      'Customizable display',
      'Works on all devices',
      'Free to use',
    ],
    steps: [],
    guide: {
      tableOfContents: [
        'What Is a Sun Visual Timer?',
        'How the Sun Countdown Works',
        'How to Use the Sun Timer',
        'Sun Timer for Morning and Daily Routines',
        'Sun-Inspired Timers for Learning and Activities',
        'Sun Timer vs Sunrise and Sunset Calculator',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is a Sun Visual Timer?',
      whatIsBody: [
        'A sun visual timer is a calming countdown timer that uses a sun and sky scene to show the passage of time. As the timer runs, the sun moves along a smooth path and the sky gradually changes, giving you a peaceful and visual way to stay focused.',
      ],
      howItWorksTitle: 'How the Sun Countdown Works',
      howItWorksBody: [
        'The timer starts with the sun at the beginning of its path. As time passes, the sun moves across the sky along a curved arc and the background colors change smoothly. The position of the sun accurately represents the remaining time. When the timer reaches zero, the animation reaches its final state based on the selected theme.',
      ],
      calloutNote:
        'Try different sky themes to match your mood and environment. A morning scene is great for focus, while a sunset theme can feel more relaxing.',
      howToUseTitle: 'How to Use the Sun Timer',
      howToUseSteps: [
        'Choose a preset time or enter a custom duration.',
        'Select a sky theme and accent color.',
        'Add an optional session label.',
        'Click Start to begin the countdown.',
        'Watch the sun move as time passes.',
        'Use Pause or Reset whenever needed.',
      ],
      featuresTitle: 'Sun Timer for Morning and Daily Routines',
      featuresList: [
        'Natural solar arc animation that travels smoothly across the horizon from start to finish',
        'Dynamic sky gradient transitions including Dawn Gold, Midday Azure, and Golden Hour Sunset',
        'Intuitive horizon-based progress—when the sun nears the horizon, time is almost up',
        'Optional session label and digital time overlay that can be toggled on or off',
        'Full-screen mode and Screen Wake Lock for morning routines and classroom smartboards',
      ],
      practicalExamples: [
        {
          icon: 'Clock',
          title: 'School Morning Routine (20–30 Minutes)',
          description:
            'Help children finish breakfast, brush teeth, and put on shoes before the sun completes its arc across the kitchen tablet.',
        },
        {
          icon: 'GraduationCap',
          title: 'Classroom Morning Meeting & Warm-Up',
          description:
            'Start the school day with a cheerful 10-minute sunrise timer projected on the board during morning journal prompts.',
        },
        {
          icon: 'Heart',
          title: 'Morning Yoga, Sun Salutations & Mobility',
          description:
            'Pace a 15-minute morning stretch or sunlight exposure routine with a calming horizon visual.',
        },
        {
          icon: 'Monitor',
          title: 'End-of-Workday Shutdown Ritual',
          description:
            'Run a 15-minute Sunset theme at 4:45 PM to clear your inbox, write tomorrow’s to-do list, and close your laptop on time.',
        },
      ],
      whoBenefitsTitle: 'Sun-Inspired Timers for Learning and Activities',
      whoBenefitsList: [
        'Parents and children who want a cheerful, natural visual cue to keep busy mornings on schedule',
        'Elementary teachers leading morning circle time, weather discussions, and daily warm-ups',
        'Remote workers creating structured morning startup and evening wind-down rituals',
        'Visual learners who intuitively understand the sun’s height in the sky as remaining time',
      ],
      tipsTitle: 'Tips for Pacing Routines with the Sun Timer',
      tipsList: [
        'Use the Sunrise / Morning sky theme to energize early study blocks, and switch to Golden Hour Sunset for afternoon wrap-ups.',
        'Point out the "High Noon" halfway mark at the top of the arc so kids know when half their time has elapsed.',
        'Press F for Fullscreen Mode to turn a kitchen tablet or classroom smartboard into a scenic sky window.',
        'Pair with a gentle chime alert to signal the end of morning prep without stressful alarms.',
      ],
      problemsTitle: 'Sun Timer vs Sunrise and Sunset Calculator',
      problemsRows: [
        {
          problem: 'Custom Countdown vs Local Astronomical Daylight',
          cause: 'Real daylight lasts 9–15 hours depending on latitude and season',
          solution: 'Sun Timer compresses the solar sky arc into your exact chosen countdown duration (e.g., 5 or 25 minutes)',
        },
        {
          problem: 'Morning Rush Stress with Loud Alarm Clocks',
          cause: 'Sudden buzzing alarms create rush and frustration for kids',
          solution: 'Watching the sun travel across the sky gives continuous, stress-free advance notice',
        },
        {
          problem: 'Checking Real-World Sunrise / Golden Hour Times',
          cause: 'Planning outdoor photography requires geographic solar coordinates',
          solution: 'Use Sun Timer for activity countdowns, or our Sunrise & Sunset Calculator for real astronomical times',
        },
      ],
    },
  },
  'bubble-timer': {
    categorySlug: 'everyday',
    categoryLabel: 'Timers',
    heroSubtitle:
      'A calming and interactive bubble visual timer to help you focus, relax and make the most of your time.',
    featurePills: [
      'Calming visual themes',
      'Customizable bubbles',
      'Works on all devices',
      'Free to use',
    ],
    steps: [],
    guide: {
      tableOfContents: [
        'What Is a Bubble Timer?',
        'How the Bubble Countdown Works',
        'How to Use the Bubble Timer',
        'Bubble Timer for Classrooms and Everyday Activities',
        'Customizing Bubble Movement and Appearance',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is a Bubble Timer?',
      whatIsBody: [
        'A bubble timer is a visual countdown timer that uses gentle, floating bubbles to show the passage of time. As the timer runs, the bubbles gradually change, giving you a calm and engaging way to stay focused, relaxed and productive.',
      ],
      howItWorksTitle: 'How the Bubble Countdown Works',
      howItWorksBody: [
        'When you start the timer, bubbles appear and gently rise through the scene. As time passes, the number of bubbles decreases or they gradually fade, showing the remaining time. When the timer reaches zero, the bubbles stop and the countdown is complete.',
      ],
      calloutNote:
        'Try a lower bubble density for a calmer experience or a higher density for a more playful look.',
      howToUseTitle: 'How to Use the Bubble Timer',
      howToUseSteps: [
        'Choose a preset time or enter a custom duration.',
        'Select a bubble theme and background style.',
        'Adjust the bubble density if needed.',
        'Click Start to begin the countdown.',
        'Watch the bubbles as time passes.',
        'Use Pause or Reset whenever you need to.',
      ],
      featuresTitle: 'Bubble Timer for Classrooms and Everyday Activities',
      featuresList: [
        'Buoyant, physics-inspired floating bubbles that thin out and settle as time counts down',
        'Adjustable bubble density and rise speed for either playful energy or sensory calm',
        'Soothing aqua, pastel, Iridescent Pearl, and Deep Ocean color themes',
        'Ideal sensory regulation visual for autism, ADHD, and early childhood classrooms',
        'Instant fullscreen projection and one-key shortcuts (Spacebar, R, F)',
      ],
      practicalExamples: [
        {
          icon: 'Droplets',
          title: '2-Minute Toothbrushing & Bathroom Routine',
          description:
            'Prop a phone or tablet on the bathroom counter so kids brush until the last floating soap bubbles pop at 00:00.',
        },
        {
          icon: 'Heart',
          title: 'Sensory Calm-Down & Emotional Regulation (3–5 Minutes)',
          description:
            'Students take slow belly breaths while watching gentle bubbles rise in the classroom calm-down corner.',
        },
        {
          icon: 'GraduationCap',
          title: 'Preschool Clean-Up & Transition Game',
          description:
            'Challenge preschoolers to put away all toys and sit on the rug before the bubbles finish floating away.',
        },
        {
          icon: 'CheckSquare',
          title: 'Short Stretch & Eye-Rest Breaks (60 Seconds)',
          description:
            'Look away from spreadsheets and relax your eyes for 1 minute with a soothing aquatic bubble display.',
        },
      ],
      whoBenefitsTitle: 'Who Benefits Most from the Bubble Timer?',
      whoBenefitsList: [
        'Preschool and elementary teachers managing classroom transitions, handwashing, and clean-up',
        'Occupational therapists, school counselors, and parents supporting sensory regulation',
        'Young children who love playful bubble visuals during toothbrushing and bedtime prep',
        'Anyone looking for a lighthearted, low-stress break timer between study sessions',
      ],
      tipsTitle: 'Customizing Bubble Movement and Appearance',
      tipsList: [
        'Select a lower bubble density and slow speed when using the timer for breathing exercises or sensory decompression.',
        'Switch to a high bubble density for energetic 2-minute classroom clean-up races.',
        'Hide the digital numbers when working with toddlers so they simply watch the bubble count dwindle.',
        'Press F to fill the entire smartboard or iPad screen for group activities.',
      ],
      problemsTitle: 'Bubble Visual Timer vs Standard Digital Timers',
      problemsRows: [
        {
          problem: 'Sensory Overload from Harsh Countdown Clocks',
          cause: 'Flashing digits and sharp ticks heighten anxiety during meltdowns',
          solution: 'Floating translucent bubbles provide a gentle, non-threatening visual anchor',
        },
        {
          problem: 'Getting Kids to Brush Teeth for a Full 2 Minutes',
          cause: '2 minutes feels endless to a child staring at a bathroom mirror',
          solution: 'Watching rising bubbles makes the 120-second hygiene routine fly by',
        },
        {
          problem: 'Maintaining Accuracy with Playful Animations',
          cause: 'Toy liquid bubblers run for random, uncalibrated durations',
          solution: 'Digital Bubble Timer combines soothing bubble motion with exact second-level accuracy',
        },
      ],
    },
  },
  'coral-timer': {
    slug: 'coral-timer',
    categorySlug: 'everyday',
    categoryLabel: 'Timers',
    heroSubtitle:
      'A relaxing and beautiful coral growth visual timer to help you focus, stay calm and make the most of your time.',
    featurePills: [
      'Beautiful ocean themes',
      'Customizable display',
      'Works on all devices',
      'Free to use',
    ],
    quickPresets: [
      { icon: '🪸', label: '1 Minute', sublabel: 'Quick break', sec: 60 },
      { icon: '🪸', label: '3 Minutes', sublabel: 'Short focus', sec: 180 },
      { icon: '🪸', label: '5 Minutes', sublabel: 'Study session', sec: 300 },
      { icon: '🪸', label: '10 Minutes', sublabel: 'Deep work', sec: 600 },
      { icon: '🪸', label: '25 Minutes', sublabel: 'Longer session', sec: 1500 },
    ],
    steps: [],
    guide: {
      tableOfContents: [
        'What Is a Coral Visual Timer?',
        'How the Coral Growth Countdown Works',
        'How to Use the Coral Timer',
        'Ocean-Themed Visual Timers for Learning',
        'Customize Your Underwater Timer',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is a Coral Visual Timer?',
      whatIsBody: [
        'A coral visual timer is a calming countdown timer that uses an underwater scene with a growing coral structure to show the passage of time. As the timer runs, the coral gradually grows, giving you a peaceful and engaging way to stay focused.',
      ],
      howItWorksTitle: 'How the Coral Growth Countdown Works',
      howItWorksBody: [
        'The animation starts with a small coral base. As time passes, new branches and details appear gradually. The coral grows smoothly and accurately to match the selected duration. When the timer reaches zero, the coral is fully grown and the countdown is complete.',
      ],
      calloutNote:
        'Try different coral themes and backgrounds to create a relaxing environment that matches your mood and activity.',
      howToUseTitle: 'How to Use the Coral Timer',
      howToUseSteps: [
        'Choose a preset time or enter a custom duration.',
        'Select a coral theme and background style.',
        'Click Start to begin the countdown.',
        'Watch the coral grow as time passes.',
        'Use Pause or Reset whenever you need to.',
      ],
      featuresTitle: 'Ocean-Themed Visual Timers for Learning',
      featuresList: [
        'Generative branching coral animation that blooms from a small reef base into a full structure',
        'Positive "growth" framing—instead of losing time, your focused minutes build a living reef',
        'Tranquil underwater palettes including Tropical Reef, Bioluminescent Deep, and Seafoam Lagoon',
        'Synchronized growth mathematics that reaches 100% full bloom at the exact end of your countdown',
        'Full-screen display with optional digital clock toggle and gentle ocean-friendly chimes',
      ],
      practicalExamples: [
        {
          icon: 'GraduationCap',
          title: '25-Minute Pomodoro Study Reef',
          description:
            'Reward yourself for staying focused for 25 minutes by watching a complete branching coral structure grow on your desk screen.',
        },
        {
          icon: 'Palette',
          title: 'Marine Biology & Science Classroom Stations',
          description:
            'Science teachers project the Coral Timer during oceanography labs, ecosystem discussions, and independent research blocks.',
        },
        {
          icon: 'Heart',
          title: 'Calm Reading & Homework Time for Kids',
          description:
            'Children who feel anxious when watching a bar shrink love watching their reading minutes grow a colorful coral reef.',
        },
        {
          icon: 'Monitor',
          title: 'Ambient Second-Monitor Focus Companion',
          description:
            'Turn an idle monitor into a peaceful underwater reef that quietly tracks your 45-minute deep work block.',
        },
      ],
      whoBenefitsTitle: 'Who Benefits Most from a Coral Growth Timer?',
      whoBenefitsList: [
        'Students and writers who prefer positive "building/growing" visuals over depleting countdown bars',
        'Science and elementary teachers running ocean-themed units or quiet independent work',
        'Neurodivergent learners who experience countdown anxiety when watching sand or bars run out',
        'Anyone who loves marine life, aquariums, and biophilic desk aesthetics',
      ],
      tipsTitle: 'Customize Your Underwater Timer',
      tipsList: [
        'Use the Coral Timer for longer 15–45 minute study sessions so you can appreciate the intricate branching stages.',
        'Try the Bioluminescent Dark theme during evening study sessions for a soothing deep-sea glow.',
        'Hide the digital timer text if ticking seconds distract you—let the size of the coral tell you how far along you are.',
        'Press Spacebar to pause growth if you need to step away, or R to plant a fresh coral base.',
      ],
      problemsTitle: 'Growth-Based Coral Timer vs Depleting Timers',
      problemsRows: [
        {
          problem: 'Scarcity Anxiety from Shrinking Timer Bars',
          cause: 'Watching time drain away can trigger urgency stress during creative work',
          solution: 'Coral Timer flips the psychology: every minute of focus grows a beautiful structure',
        },
        {
          problem: 'Distracting Fast-Moving Animations',
          cause: 'Rapid spinners or flashing digits pull peripheral vision away from reading',
          solution: 'Organic coral branches unfurl gradually, keeping peripheral motion calm',
        },
        {
          problem: 'Knowing When the Session Is Complete',
          cause: 'Organic shapes need a clear completion state',
          solution: 'The coral reaches full canopy height at 00:00 and plays an optional completion chime',
        },
      ],
    },
  },
  'lichen-timer': {
    slug: 'lichen-timer',
    categorySlug: 'everyday',
    categoryLabel: 'Timers',
    heroSubtitle:
      'A calming and beautiful lichen growth visual timer to help you focus, stay present and enjoy your time with nature-inspired visuals.',
    featurePills: [
      'Beautiful nature themes',
      'Customizable display',
      'Works on all devices',
      'Free to use',
    ],
    quickPresets: [
      { icon: '🌿', label: '1 Minute', sublabel: 'Quick break', sec: 60 },
      { icon: '🌿', label: '3 Minutes', sublabel: 'Short focus', sec: 180 },
      { icon: '🌿', label: '5 Minutes', sublabel: 'Study session', sec: 300 },
      { icon: '🌿', label: '10 Minutes', sublabel: 'Deep work', sec: 600 },
      { icon: '🌿', label: '25 Minutes', sublabel: 'Longer session', sec: 1500 },
    ],
    steps: [],
    guide: {
      tableOfContents: [
        'What Is a Lichen Timer?',
        'How the Organic Countdown Works',
        'How to Use the Lichen Timer',
        'Nature-Inspired Timers for Quiet Activities',
        'Customizing the Lichen Display',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is a Lichen Timer?',
      whatIsBody: [
        'A lichen timer is a calming visual countdown timer that uses a nature-inspired lichen growth animation to show the passage of time. As the timer runs, the lichen gradually spreads across the surface, giving you a peaceful and organic way to stay focused.',
      ],
      howItWorksTitle: 'How the Organic Countdown Visualization Works',
      howItWorksBody: [
        'The animation starts with a natural stone or bark surface and a small patch of lichen. As time passes, the lichen slowly grows and spreads with realistic textures and patterns. The growth rate is smooth and accurately represents the remaining time. When the timer reaches zero, the surface is fully covered and the countdown is complete.',
      ],
      calloutNote:
        'Try different lichen themes and background styles to create a relaxing natural environment that matches your mood and activity.',
      howToUseTitle: 'How to Use the Lichen Timer',
      howToUseSteps: [
        'Choose a preset time or enter a custom duration.',
        'Select a lichen theme and background style.',
        'Click Start to begin the countdown.',
        'Watch the lichen grow as time passes.',
        'Use Pause or Reset whenever you need to.',
      ],
      featuresTitle: 'Nature-Inspired Timers for Quiet Activities',
      featuresList: [
        'Organic botanical moss and lichen colony simulation that spreads across natural stone or bark',
        'Earthy biophilic color palettes including Woodland Moss, Alpine Slate, Golden Sunburst Lichen, and Boreal Bark',
        'Ultra-low peripheral distraction—designed for deep reading, writing, and contemplative work',
        'Proportional surface coverage that reaches 100% bloom when your timer hits 00:00',
        'Full-screen mode, keyboard shortcuts (Spacebar, R, F), and screen wake lock',
      ],
      practicalExamples: [
        {
          icon: 'GraduationCap',
          title: 'Deep Reading & Literature Study (30–60 Minutes)',
          description:
            'Let a slow-growing moss and lichen colony accompany long textbook chapters or thesis research without pulling your eyes from the page.',
        },
        {
          icon: 'Palette',
          title: 'Botanical Sketching, Journaling & Creative Writing',
          description:
            'Pair a 20-minute freewriting or sketching block with an earthy woodland visual that inspires calm creativity.',
        },
        {
          icon: 'Heart',
          title: 'Forest-Bathing Mindfulness & Grounding Breaks',
          description:
            'Bring nature indoors during a 10-minute tea break or breathing exercise at your office desk.',
        },
        {
          icon: 'Users',
          title: 'Biology & Ecology Classroom Labs',
          description:
            'Project a time-lapse style lichen growth countdown during botany, symbiosis, or environmental science lessons.',
        },
      ],
      whoBenefitsTitle: 'Who Uses the Biophilic Lichen Timer?',
      whoBenefitsList: [
        'Writers, researchers, and academics who want an ultra-calm, non-mechanical timer for deep focus',
        'Nature lovers, botanists, and cottagecore / goblincore / green-academia enthusiasts',
        'Highly sensitive focusers who find spinning wheels or flashing bars visually fatiguing',
        'Biology and environmental science educators timing quiet lab observations',
      ],
      tipsTitle: 'Customizing the Lichen Display',
      tipsList: [
        'Choose Woodland Moss on dark slate for a low-glare evening study aesthetic, or Golden Lichen for warm daytime contrast.',
        'Toggle off the digital numbers when doing creative writing so you experience time as gradual organic growth.',
        'Use Fullscreen Mode (press F) on a secondary display to create a calm biophilic window on your desk.',
        'Enable the soft chime alert so you can immerse yourself in your book without checking the screen.',
      ],
      problemsTitle: 'Organic Lichen Timer vs Standard Digital Timers',
      problemsRows: [
        {
          problem: 'Visual Fatigue from High-Motion Timers',
          cause: 'Fast-moving animations demand constant eye attention',
          solution: 'Lichen grows at a serene, botanical pace that respects deep concentration',
        },
        {
          problem: 'Sterile Office Aesthetics',
          cause: 'Plain black-and-white utility clocks feel cold and stressful',
          solution: 'Natural stone, bark, and moss textures bring calming biophilic design to your screen',
        },
        {
          problem: 'Tracking Progress Without Reading Digits',
          cause: 'Checking MM:SS interrupts verbal and reading comprehension',
          solution: 'Glance at how much of the stone surface is covered in moss to judge elapsed time instantly',
        },
      ],
    },
  },
  'frost-timer': {
    slug: 'frost-timer',
    categorySlug: 'everyday',
    categoryLabel: 'Timers',
    heroSubtitle:
      'A beautiful and calming frost visual timer to help you focus, stay productive and enjoy your time with a unique ice-inspired display.',
    featurePills: [
      'Beautiful frost themes',
      'Customizable display',
      'Works on all devices',
      'Free to use',
    ],
    quickPresets: [
      { icon: '❄️', label: '1 Minute', sublabel: 'Quick break', sec: 60 },
      { icon: '❄️', label: '3 Minutes', sublabel: 'Short focus', sec: 180 },
      { icon: '❄️', label: '5 Minutes', sublabel: 'Study session', sec: 300 },
      { icon: '❄️', label: '10 Minutes', sublabel: 'Deep work', sec: 600 },
      { icon: '❄️', label: '25 Minutes', sublabel: 'Longer session', sec: 1500 },
    ],
    steps: [],
    guide: {
      tableOfContents: [
        'What Is a Frost Timer?',
        'How Frost Crystals Visualize Time',
        'How to Use the Frost Countdown',
        'Frost Timer for Focus and Classroom Activities',
        'Frost Timer Display Settings',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is a Frost Timer?',
      whatIsBody: [
        'A frost timer is a calming visual countdown timer that uses a frost or ice pattern to show the passage of time. As the timer runs, delicate frost crystals gradually spread across the screen, giving you a peaceful and engaging way to stay focused.',
      ],
      howItWorksTitle: 'How Frost Crystals Visualize Time',
      howItWorksBody: [
        'The animation starts with a clear surface and small frost patterns at the edges. As time passes, the crystals slowly grow and spread toward the center. The growth is smooth and accurately represents the remaining time. When the timer reaches zero, the screen is fully covered with frost and the countdown is complete.',
      ],
      calloutNote:
        'Try different frost themes and background styles to create a calm and focused environment that matches your mood and activity.',
      howToUseTitle: 'How to Use the Frost Countdown',
      howToUseSteps: [
        'Choose a preset time or enter a custom duration.',
        'Select a frost theme and background style.',
        'Adjust brightness and other display settings.',
        'Click Start to begin the countdown.',
        'Use Pause or Reset whenever you need to.',
      ],
      featuresTitle: 'Frost Timer for Focus and Classroom Activities',
      featuresList: [
        'Intricate crystalline frost fractals that branch inward from the window edges as time progresses',
        'Crisp winter palettes including Glacial Blue, Arctic Silver, Aurora Ice, and Midnight Frost',
        'Clear perimeter-to-center visual progression that shows how close the window is to freezing over',
        'Soothing "cool-down" visual metaphor for emotional regulation and focused study',
        'Full-screen display with keyboard shortcuts (Spacebar, R, F) and Wake Lock',
      ],
      practicalExamples: [
        {
          icon: 'GraduationCap',
          title: 'Classroom Winter Centres & Quiet Reading',
          description:
            'Project the Frost Timer on your classroom smartboard during winter literacy centers—students finish their station before the window freezes over.',
        },
        {
          icon: 'Heart',
          title: '"Cool Down" Emotional Regulation Break (3–5 Minutes)',
          description:
            'Help frustrated or overstimulated children take a 3-minute "cool down" breath break while watching delicate ice crystals form.',
        },
        {
          icon: 'Monitor',
          title: '25-Minute Crisp Deep-Work Sprint',
          description:
            'Use the clean, high-contrast Arctic Silver frost theme on a second monitor for distraction-free coding or data analysis.',
        },
        {
          icon: 'CheckSquare',
          title: 'Cold Plunge, Ice Bath & Recovery Timing',
          description:
            'Time a 2-minute or 3-minute cold shower or contrast-therapy recovery interval with a fitting glacial visual.',
        },
      ],
      whoBenefitsTitle: 'Who Benefits Most from the Frost Visual Timer?',
      whoBenefitsList: [
        'Teachers looking for engaging seasonal winter timers for classroom smartboards',
        'Counselors and parents using a soothing "cool-down" visual for emotional self-regulation',
        'Students and programmers who love crisp, cool-toned blue and silver desk setups',
        'Wellness and cold-exposure practitioners timing recovery sessions',
      ],
      tipsTitle: 'Frost Timer Display Settings & Tips',
      tipsList: [
        'Tell students: "When the frost reaches the center of the window, pencils down!" for a clear, stress-free cue.',
        'Switch to the Midnight Frost or Aurora theme in dim rooms for glowing ice-crystal contrast.',
        'Hide the digital clock readout if you want a pure winter window effect during silent reading.',
        'Press R at any time to "defrost" the window instantly and start a fresh round.',
      ],
      problemsTitle: 'Frost Crystal Timer vs Standard Digital Timers',
      problemsRows: [
        {
          problem: 'Keeping Classroom Timers Fresh in Winter Months',
          cause: 'Using the same plain circle timer every day leads to student tune-out',
          solution: 'Frost Timer brings seasonal excitement while keeping exact countdown structure',
        },
        {
          problem: 'Helping Kids "Cool Down" When Angry or Overwhelmed',
          cause: 'Red timers feel aggressive when a child is already upset',
          solution: 'Cool icy blues and slow crystal formation naturally encourage calm breathing',
        },
        {
          problem: 'Peripheral Glare on Dual Monitors',
          cause: 'Bright white backgrounds strain eyes during long workdays',
          solution: 'Deep glacial navy and slate backgrounds keep the frost crystals easy on the eyes',
        },
      ],
    },
  },
  'snow-timer': {
    heroSubtitle:
      'A calming and beautiful snowfall visual timer to help you focus, stay productive and enjoy a peaceful winter scene.',
    featurePills: [
      'Realistic snow effect',
      'Customizable display',
      'Works on all devices',
      'Free to use',
    ],
    quickPresets: [
      { icon: '❄️', label: '1 Minute', sublabel: 'Quick break', sec: 60 },
      { icon: '❄️', label: '3 Minutes', sublabel: 'Short focus', sec: 180 },
      { icon: '❄️', label: '5 Minutes', sublabel: 'Study session', sec: 300 },
      { icon: '❄️', label: '10 Minutes', sublabel: 'Deep work', sec: 600 },
      { icon: '❄️', label: '25 Minutes', sublabel: 'Longer session', sec: 1500 },
    ],
    steps: [],
    guide: {
      tableOfContents: [
        'What Is a Snow Timer?',
        'How the Falling Snow Countdown Works',
        'How to Use the Snow Timer',
        'Winter-Themed Timers for Classrooms and Activities',
        'Customize the Snowfall Effect',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is a Snow Timer?',
      whatIsBody: [
        'A snow timer is a visual countdown timer that uses a gentle snowfall and accumulating snow to show the passage of time. As the timer runs, snowflakes fall and the snow layer gradually builds up, giving you a calm and engaging way to stay focused.',
      ],
      howItWorksTitle: 'How the Falling Snow Countdown Works',
      howItWorksBody: [
        'The animation starts with a clean winter scene. As time passes, snowflakes fall at a steady rate and a visible layer of snow slowly increases along the bottom of the display. The snowfall and accumulation are designed to match the selected duration. When the timer reaches zero, the final snow layer is complete.',
      ],
      calloutNote:
        'Try a lower snowfall intensity for longer sessions, and a higher intensity for shorter, more playful activities.',
      howToUseTitle: 'How to Use the Snow Timer',
      howToUseSteps: [
        'Choose a preset time or enter a custom duration.',
        'Adjust the snowfall intensity and theme.',
        'Click Start to begin the countdown.',
        'Use Pause to temporarily stop the timer.',
        'Click Reset to set a new time and start again.',
      ],
      featuresTitle: 'Winter-Themed Timers for Classrooms and Activities',
      featuresList: [
        'Gentle drifting snowflakes paired with a rising snowbank accumulation bar that tracks elapsed time',
        'Adjustable snowfall intensity from a quiet flurry to a playful winter blizzard',
        'Cozy winter sky themes including Alpine Night, Nordic Twilight, and Snowy Pine',
        'Dual visual feedback: soothing falling flakes for calm focus plus snow depth for exact progress',
        'Full-screen mode and keyboard shortcuts (Spacebar, R, F) for smartboards and desk monitors',
      ],
      practicalExamples: [
        {
          icon: 'GraduationCap',
          title: 'Classroom Cozy Reading & Winter Writing Prompts',
          description:
            'Display the falling snow scene on the classroom projector during 20-minute independent reading or creative winter storytelling.',
        },
        {
          icon: 'Monitor',
          title: 'Cozy Study Sessions & Hot Cocoa Breaks',
          description:
            'Pair a 25-minute study block with a peaceful Alpine Night snowfall on your iPad or secondary screen.',
        },
        {
          icon: 'Users',
          title: 'Holiday Classroom Parties & Station Rotations',
          description:
            'Keep December classroom craft stations and winter games running on time with a festive, kid-friendly snow drift countdown.',
        },
        {
          icon: 'Heart',
          title: 'Evening Wind-Down & Quiet Reflection',
          description:
            'Watch slow, silent snowflakes settle for 10 minutes before bedtime to quiet a busy mind.',
        },
      ],
      whoBenefitsTitle: 'Who Loves the Snowfall Visual Timer?',
      whoBenefitsList: [
        'Elementary and middle school teachers creating a calm, cozy classroom atmosphere in winter',
        'Students who enjoy "cozy study with me" winter scenes while preparing for December or January exams',
        'Children with sensory sensitivities who find gentle falling snow deeply soothing',
        'Families timing holiday games, baking steps, or evening storytime',
      ],
      tipsTitle: 'Customize the Snowfall Effect',
      tipsList: [
        'Use low snowfall intensity for 25–45 minute study sessions so the gentle flurries keep your peripheral vision relaxed.',
        'Watch the rising snowdrift at the bottom of the screen to judge how much time has passed without reading numbers.',
        'Press F for Fullscreen Mode to turn your television or smartboard into a peaceful winter window.',
        'Enable Screen Wake Lock so your winter scene stays active throughout the entire countdown.',
      ],
      problemsTitle: 'Snow Timer vs Static Winter Wallpapers',
      problemsRows: [
        {
          problem: 'Ambient Video Loops Don’t Track Real Time',
          cause: 'YouTube snowfall videos loop infinitely without telling you how much study time is left',
          solution: 'Snow Timer links the rising snowbank directly to your exact countdown duration',
        },
        {
          problem: 'Overexcited Classrooms Before Winter Break',
          cause: 'Loud or flashy timers increase classroom restlessness',
          solution: 'Quiet drifting snow calms the room while keeping students aware of remaining time',
        },
        {
          problem: 'Restarting for the Next Group Rotation',
          cause: 'Scrubbing video timers back to zero is clumsy',
          solution: 'Press R to clear the snowbank and restart your exact preset in one keystroke',
        },
      ],
    },
  },
  'galaxy-timer': {
    heroSubtitle:
      'A stunning and relaxing galaxy countdown timer to help you focus, stay productive and enjoy a calm, space-inspired experience.',
    featurePills: [
      'Space-themed visuals',
      'Customizable galaxy',
      'Works on all devices',
      'Free to use',
    ],
    quickPresets: [
      { icon: '🌌', label: '1 Minute', sublabel: 'Quick break', sec: 60 },
      { icon: '🌌', label: '3 Minutes', sublabel: 'Short focus', sec: 180 },
      { icon: '🌌', label: '5 Minutes', sublabel: 'Study session', sec: 300 },
      { icon: '🌌', label: '10 Minutes', sublabel: 'Deep work', sec: 600 },
      { icon: '🌌', label: '25 Minutes', sublabel: 'Longer session', sec: 1500 },
    ],
    steps: [],
    guide: {
      tableOfContents: [
        'What Is a Galaxy Timer?',
        'How the Starfield Countdown Works',
        'How to Use the Galaxy Timer',
        'Space-Themed Timers for Study and Productivity',
        'Customize Your Galaxy Countdown',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is a Galaxy Timer?',
      whatIsBody: [
        'A galaxy timer is a visual countdown timer that uses a space-inspired scene with a galaxy, stars and nebula to show the passage of time. As the timer runs, the starfield gradually changes, giving you a calm and engaging way to stay focused.',
      ],
      howItWorksTitle: 'How the Starfield Countdown Works',
      howItWorksBody: [
        'The animation begins with a partial galaxy or a simpler starfield. As time passes, more stars, details and glow are slowly revealed, and the galaxy becomes more complete. The animation is designed to match the selected duration, and the final state is reached when the timer ends.',
      ],
      calloutNote:
        'For a calmer experience, use a slower animation speed or the low-motion mode.',
      howToUseTitle: 'How to Use the Galaxy Timer',
      howToUseSteps: [
        'Choose a preset time or enter a custom duration.',
        'Select a galaxy theme and background style.',
        'Adjust the animation speed and sound settings.',
        'Click Start to begin the countdown.',
        'Use Pause or Reset whenever you need to.',
      ],
      featuresTitle: 'Space-Themed Timers for Study and Productivity',
      featuresList: [
        'Swirling spiral galaxy, nebula clouds, and starfield illumination that evolve with your countdown',
        'OLED-friendly deep-space backgrounds (Andromeda Violet, Cosmic Teal, Supernova Gold, Deep Void)',
        'Low-glare dark palette that prevents eye strain during late-night coding, gaming, or studying',
        'Smooth orbital rotation and star-density progression tied to exact elapsed percentage',
        'Full-screen planetarium mode (press F) with optional digital clock toggle',
      ],
      practicalExamples: [
        {
          icon: 'Monitor',
          title: 'Late-Night Coding & Engineering Sprints',
          description:
            'Run a 45-minute deep-space countdown on your secondary OLED monitor without any harsh white light in your dark office.',
        },
        {
          icon: 'GraduationCap',
          title: 'Astronomy & STEM Classroom Activities',
          description:
            'Science teachers project the swirling nebula timer during space units, physics labs, and planetarium stations.',
        },
        {
          icon: 'Heart',
          title: 'Cosmic Decompression & Audio Meditation',
          description:
            'Pair a 10-minute ambient music or binaural-beats break with a slow-rotating starfield to reset between intense meetings.',
        },
        {
          icon: 'Tv',
          title: 'Sci-Fi Tabletop RPG & Board Game Rounds',
          description:
            'Use the Galaxy Timer on a tablet at the gaming table to pace turn decisions in sci-fi board games and RPG encounters.',
        },
      ],
      whoBenefitsTitle: 'Who Uses the Galaxy Visual Timer?',
      whoBenefitsList: [
        'Developers, night-owl students, and gamers who work in dark rooms with dark-mode setups',
        'Science and astronomy teachers looking for an inspiring space-themed classroom timer',
        'Sci-fi writers, worldbuilders, and tabletop RPG game masters',
        'Neurodivergent learners who find slow cosmic motion grounding and calming',
      ],
      tipsTitle: 'Customize Your Galaxy Countdown',
      tipsList: [
        'Select low-motion or slow rotation speed during reading-heavy tasks so the starfield stays serene.',
        'Press F to enter Fullscreen Mode on an external monitor for an immersive planetarium desk backdrop.',
        'Hide the digital MM:SS text when you want to judge progress purely by the brightness and fullness of the nebula.',
        'Use the Spacebar shortcut to pause the cosmos instantly if interrupted.',
      ],
      problemsTitle: 'Galaxy Timer vs Standard Dark-Mode Timers',
      problemsRows: [
        {
          problem: 'Eye Strain from Bright Timers at Night',
          cause: 'High-brightness screens ruin night vision and cause fatigue',
          solution: 'Deep-space nebula palettes use true dark backgrounds with soft starlight accents',
        },
        {
          problem: 'Plain Black Timers Feeling Empty or Boring',
          cause: 'A lone white number on a black screen offers no visual sense of progress',
          solution: 'The evolving starfield and spiral arms show proportional completion artistically',
        },
        {
          problem: 'Keeping STEM Students Engaged During Lab Work',
          cause: 'Generic timers disconnect from the lesson theme',
          solution: 'Galaxy Timer reinforces astronomy and physics themes while keeping strict time',
        },
      ],
    },
  },
  'lava-lamp-timer': {
    heroSubtitle:
      'A retro and relaxing lava lamp countdown timer that helps you focus, relax and enjoy a calming visual experience.',
    featurePills: [
      'Retro visual timer',
      'Customizable display',
      'Works on all devices',
      'Free to use',
    ],
    quickPresets: [
      { icon: '⏳', label: '1 Minute', sublabel: 'Quick break', sec: 60 },
      { icon: '⏳', label: '3 Minutes', sublabel: 'Short focus', sec: 180 },
      { icon: '⏳', label: '5 Minutes', sublabel: 'Study session', sec: 300 },
      { icon: '⏳', label: '10 Minutes', sublabel: 'Deep work', sec: 600 },
      { icon: '⏳', label: '25 Minutes', sublabel: 'Longer session', sec: 1500 },
    ],
    steps: [],
    guide: {
      tableOfContents: [
        'What Is a Lava Lamp Timer?',
        'How the Lava Lamp Countdown Works',
        'How to Use the Retro Lava Lamp Timer',
        'Lava Lamp Timer for Study and Quiet Activities',
        'Customize Your Lava Lamp Theme',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is a Lava Lamp Timer?',
      whatIsBody: [
        'A lava lamp timer is a visual countdown timer inspired by the classic retro lava lamp. It shows smooth, floating blobs inside a lamp that change and flow as time passes, giving you a relaxing and engaging way to track a set duration.',
      ],
      howItWorksTitle: 'How the Lava Lamp Countdown Works',
      howItWorksBody: [
        'The timer is based on a real countdown duration. As the time progresses, the lava blobs move, grow and merge in a smooth, continuous animation. The visual state of the lamp changes gradually to represent the passage of time, and the countdown completes when the timer reaches zero.',
      ],
      calloutNote:
        'Use a slower animation speed for study and reading, or a slightly faster speed for short breaks and quick activities.',
      howToUseTitle: 'How to Use the Retro Lava Lamp Timer',
      howToUseSteps: [
        'Choose a preset time or enter a custom duration.',
        'Select a lava lamp theme and lamp style.',
        'Adjust the animation speed and other settings.',
        'Click Start to begin the countdown.',
        'Use Pause or Reset whenever you need to.',
      ],
      featuresTitle: 'Lava Lamp Timer for Study and Quiet Activities',
      featuresList: [
        'Hypnotic, organic metaball wax blobs that rise, split, and merge inside a classic glass lamp silhouette',
        'Groovy 1970s retro and modern neon color combinations (Magma Orange, Cyber Purple, Emerald Glow, Sunset Pink)',
        'Calibrated countdown progression tied to exact system clock timestamps',
        'Ideal sensory decompression and "visual fidget" timer for ADHD and creative brainstorming',
        'Full-screen display mode with optional digital time readout and completion chime',
      ],
      practicalExamples: [
        {
          icon: 'Palette',
          title: 'Creative Brainstorming & Lo-Fi Study Sessions',
          description:
            'Put on a lo-fi hip-hop playlist and run a 25-minute Lava Lamp Timer on your desk tablet while sketching, coding, or studying.',
        },
        {
          icon: 'Heart',
          title: 'Sensory Decompression & Anxiety Reset (5 Minutes)',
          description:
            'Watch the slow, predictable rise and fall of warm wax blobs for 5 minutes to lower stress after a hectic class or meeting.',
        },
        {
          icon: 'GraduationCap',
          title: 'Classroom Calm-Down Corner & Quiet Reading',
          description:
            'Give students a safe, heat-free digital lava lamp on an iPad to pace their 5-minute sensory break before rejoining the class.',
        },
        {
          icon: 'Monitor',
          title: 'Retro Desk Setup & Stream Background',
          description:
            'Add a nostalgic 70s/90s lava lamp vibe to your dual-monitor workspace while keeping your Pomodoro breaks strictly on time.',
        },
      ],
      whoBenefitsTitle: 'Who Loves the Retro Lava Lamp Timer?',
      whoBenefitsList: [
        'Students and creatives who listen to lo-fi beats and want a relaxing, groovy desk companion',
        'Neurodivergent individuals (ADHD, autism) who benefit from soothing "visual stimming" motion',
        'Teachers and school counselors equipping a classroom sensory or calm-down station without hot glass lamps',
        'Anyone who finds rigid geometric timers too clinical for creative or evening work',
      ],
      tipsTitle: 'Customize Your Lava Lamp Theme',
      tipsList: [
        'Choose a slow blob speed when studying or reading so the lamp acts as calm ambient lighting.',
        'Use a real physical lava lamp? Remember real wax takes 45–60 minutes just to heat up—this digital version starts flowing at 00:01!',
        'Press F for Fullscreen Mode and switch to Dark Mode so the glowing wax colors pop against your screen.',
        'Toggle the digital numbers off during mindfulness breaks for a pure retro lamp experience.',
      ],
      problemsTitle: 'Digital Lava Lamp Timer vs Physical Lava Lamps',
      problemsRows: [
        {
          problem: '45-Minute Warm-Up Wait Time',
          cause: 'Real paraffin wax lamps require an incandescent bulb to heat up for nearly an hour',
          solution: 'Digital Lava Lamp Timer flows immediately with zero warm-up delay',
        },
        {
          problem: 'Hot Glass Hazard in Classrooms & Kids’ Rooms',
          cause: 'Physical lava lamps get dangerously hot to the touch and can shatter if knocked over',
          solution: '100% cool, shatter-proof visual experience on any tablet, Chromebook, or smartboard',
        },
        {
          problem: 'Tracking Exact Study Intervals',
          cause: 'A physical lamp offers no way to measure a 15- or 25-minute work block',
          solution: 'Combines hypnotic wax motion with a precise countdown and end-of-session chime',
        },
      ],
    },
  },
  'spinner-timer': {
    heroSubtitle:
      'A clear and interactive spinning countdown timer to help you stay focused, manage activities and make timed tasks more engaging.',
    featurePills: [
      'Visual countdown',
      'Customizable display',
      'Works on all devices',
      'Free to use',
    ],
    quickPresets: [
      { icon: '⏱', label: '1 Minute', sublabel: 'Quick break', sec: 60 },
      { icon: '⏱', label: '3 Minutes', sublabel: 'Short focus', sec: 180 },
      { icon: '⏱', label: '5 Minutes', sublabel: 'Mini task', sec: 300 },
      { icon: '⏱', label: '10 Minutes', sublabel: 'Deep focus', sec: 600 },
      { icon: '⏱', label: '25 Minutes', sublabel: 'Study session', sec: 1500 },
    ],
    steps: [],
    guide: {
      tableOfContents: [
        'What Is a Spinner Timer?',
        'How the Spinning Countdown Works',
        'How to Use the Spinner Timer',
        'Spinner Timer for Games and Group Activities',
        'Spinner Timer vs Random Spinner Wheel',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is a Spinner Timer?',
      whatIsBody: [
        'A spinner timer is a visual countdown timer that uses a rotating wheel to show the passage of time. As the timer runs, the spinner moves smoothly and the progress ring updates, giving you a clear and engaging way to stay on track.',
      ],
      howItWorksTitle: 'How the Spinning Countdown Works',
      howItWorksBody: [
        'The spinner starts at your chosen duration and rotates at a steady speed. The circular progress ring fills as time elapses, and the remaining segments show the time left. When the countdown reaches zero, the spinner stops and an optional alert lets you know the time is up.',
      ],
      calloutNote:
        'Use clear, short durations for focused tasks and longer durations for study sessions, group activities or workouts.',
      howToUseTitle: 'How to Use the Spinner Timer',
      howToUseSteps: [
        'Choose a preset time or enter a custom duration.',
        'Select a spinner theme and rotation direction.',
        'Click Start to begin the countdown.',
        'Use Pause and Resume if you need a break.',
        'Click Reset to set a new time and start again.',
      ],
      featuresTitle: 'Spinner Timer for Games and Group Activities',
      featuresList: [
        'Dynamic rotating turbine/wheel visual paired with a high-contrast outer progress ring',
        'Clear active-running indicator—anyone in the room can see immediately that the clock is live',
        'Customizable rotation direction (clockwise or counter-clockwise) and color themes',
        'Drift-free millisecond timing engine that braking-stops smoothly at 00:00',
        'One-key controls (Spacebar to start/pause, R to reset, F for fullscreen) for fast game hosting',
      ],
      practicalExamples: [
        {
          icon: 'RotateCcw',
          title: '60-Second Trivia & Lightning Quiz Rounds',
          description:
            'Build game-show momentum by projecting the rotating Spinner Timer while teams race to write down their answers.',
        },
        {
          icon: 'Users',
          title: 'Classroom "Beat the Spinner" Clean-Up & Transitions',
          description:
            'Give students 2 minutes to swap notebooks and line up before the spinning wheel comes to a stop.',
        },
        {
          icon: 'CheckSquare',
          title: 'HIIT, CrossFit & Circuit Gym Stations',
          description:
            'Athletes can see from across the gym that the interval is actively running thanks to the continuous rotational motion.',
        },
        {
          icon: 'Presentation',
          title: 'Rapid-Fire Brainstorming & Design Sprints',
          description:
            'Run a "Crazy 8s" sketching exercise where participants sketch one idea every 60 seconds while the spinner turns.',
        },
      ],
      whoBenefitsTitle: 'Who Uses the Spinner Countdown Timer?',
      whoBenefitsList: [
        'Teachers and game hosts running high-energy review games, trivia nights, and Minute-to-Win-It challenges',
        'PE instructors and fitness coaches timing active workout stations',
        'Workshop facilitators leading rapid-fire ideation and design thinking sprints',
        'Students who stay more engaged when the timer has lively, kinetic motion',
      ],
      tipsTitle: 'Tips for Hosting Games & Sprints with the Spinner Timer',
      tipsList: [
        'Use the Spinner Timer for short, energetic bursts (30 seconds to 5 minutes) where kinetic motion keeps momentum high.',
        'Keep your hand near the Spacebar during trivia or classroom games so you can freeze the spinner the instant a team buzzes in.',
        'Press F for Fullscreen Mode on a TV or projector so the outer progress ring is visible from the back row.',
        'Enable the end alarm chime so everyone hears the exact buzzer moment when the wheel stops.',
      ],
      problemsTitle: 'Spinner Timer vs Random Spinner Wheel',
      problemsRows: [
        {
          problem: 'Counting Down Time vs Picking a Random Name',
          cause: 'Users searching "spinner" sometimes want a countdown and sometimes a random picker',
          solution: 'Spinner Timer measures exact countdown durations; for random name picking, use a decision wheel',
        },
        {
          problem: 'Knowing If a Static Timer Is Paused or Running',
          cause: 'On a long countdown, a slow-moving bar can look frozen from across the room',
          solution: 'Continuous wheel rotation proves at a glance that the countdown is actively running',
        },
        {
          problem: 'Motion Sensitivity During Long Reading Sessions',
          cause: 'Continuous rotation can be too energetic for 60-minute silent reading',
          solution: 'Use Spinner Timer for energetic games/workouts, or switch to Circular/Lichen Timer for quiet study',
        },
      ],
    },
  },
  'time-calculator': {
    heroSubtitle:
      'Add and subtract hours, minutes, and seconds with automatic base-60 rollover and instant decimal-hour conversion.',
    featurePills: ['Base-60 time math', 'Decimal hours output', 'Multi-row addition & subtraction', 'Free to use'],
    quickPresets: [],
    steps: [
      { step: 1, title: 'Enter time values', description: 'Type hours, minutes, and seconds into each row.' },
      { step: 2, title: 'Choose + Add or − Subtract', description: 'Select whether each row adds to or deducts from the total.' },
      { step: 3, title: 'Add more rows', description: 'Click Add Duration Row to include extra work blocks or breaks.' },
      { step: 4, title: 'Copy results', description: 'Read the total in HH:MM:SS, total minutes, and decimal hours.' },
    ],
    guide: {
      tableOfContents: [
        'What Is the Time Calculator?',
        'Formulas and Base-60 Time Math',
        'How to Use the Time Calculator',
        'Worked Calculation Examples',
        'Practical Use Cases',
        'Who Uses This Calculator?',
        'Tips for Accurate Time Math',
        'Reference Conversion Table',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is the Time Calculator?',
      whatIsBody: [
        'The Time Calculator is an online arithmetic tool that adds and subtracts multiple blocks of hours, minutes, and seconds. Unlike a standard pocket calculator that uses base-10 decimals (where 0.50 + 0.50 = 1.00), clock durations follow sexagesimal (base-60) math where 60 seconds equal 1 minute and 60 minutes equal 1 hour.',
        'Whether you are totaling daily project logs, subtracting an unpaid lunch break from a shift, or combining audio and video clip lengths, this calculator computes the exact cumulative total in standard HH:MM:SS format, total minutes, total seconds, and payroll-ready decimal hours.',
      ],
      howItWorksTitle: 'Formulas and Base-60 Time Math',
      howItWorksBody: [
        'To prevent rounding errors, the calculator converts every input row into total seconds first: Row Seconds = (Hours × 3,600) + (Minutes × 60) + Seconds. Rows marked "+ Add" are added to the running sum, and rows marked "− Subtract" are deducted.',
        'From the net total seconds (S), the calculator derives each output unit using integer division and modulo arithmetic: Whole Hours = Math.floor(S ÷ 3,600); Remaining Minutes = Math.floor((S mod 3,600) ÷ 60); Remaining Seconds = S mod 60; and Decimal Hours = S ÷ 3,600 (rounded to 2 decimal places for timesheets).',
      ],
      calloutNote:
        'Worked Example: 2h 45m + 1h 35m − 0h 30m = (165 min + 95 min − 30 min) = 230 minutes = 3 hours 50 minutes (3.83 decimal hours).',
      howToUseTitle: 'How to Use the Time Calculator',
      howToUseSteps: [
        'In Row 1, enter your starting hours, minutes, and seconds.',
        'In Row 2, choose + Add or − Subtract and enter the second duration.',
        'Click "Add Duration Row" to include additional work blocks, flight legs, or break deductions.',
        'Read the live result in HH:MM:SS, total minutes, and decimal hours, or click Copy to paste into your spreadsheet.',
      ],
      featuresTitle: 'Worked Calculation Examples',
      featuresList: [
        'Adding Work Blocks: 3 hours 40 minutes + 4 hours 35 minutes = 7 hours 75 minutes → carries 60 minutes to 1 hour = 8 hours 15 minutes (8.25 decimal hours).',
        'Subtracting Unpaid Breaks: 8 hours 30 minutes gross shift − 45 minutes lunch break = 510 minutes − 45 minutes = 465 minutes = 7 hours 45 minutes (7.75 decimal hours).',
        'Video & Podcast Editing: 12m 48s intro + 24m 19s interview + 03m 15s outro = 2,422 total seconds = 40 minutes 22 seconds (0.67 decimal hours).',
        'Assumptions & Limitations: This tool calculates pure elapsed durations rather than calendar dates or time-zone shifts. For clock times across midnight or DST changes, use the Time Duration Calculator.',
      ],
      practicalExamples: [
        { icon: 'CheckSquare', title: 'Payroll & Billing', description: 'Convert HH:MM logs into exact decimal hours (e.g. 7h 45m = 7.75 hrs).' },
        { icon: 'Monitor', title: 'Media Production', description: 'Sum multiple video scenes, music tracks, or podcast segments.' },
        { icon: 'GraduationCap', title: 'Exam & Lab Timing', description: 'Add section durations and break buffers when scheduling assessments.' },
        { icon: 'Clock', title: 'Aviation & Driving Logs', description: 'Total multi-leg flight hours or commercial driving logs accurately.' },
      ],
      whoBenefitsTitle: 'Who Uses This Calculator?',
      whoBenefitsList: [
        'Freelancers, consultants, and bookkeepers totaling client billable hours',
        'Video editors, podcasters, and broadcast producers calculating program runtime',
        'Pilots and transport operators logging cumulative block hours',
        'Students and teachers checking base-60 time arithmetic',
      ],
      tipsTitle: 'Tips for Accurate Time Math',
      tipsList: [
        'Never multiply hourly pay rates by HH.MM directly (8 hours 30 minutes is 8.50 hours, not 8.30).',
        'You can type values larger than 59 into the Minutes or Seconds box (e.g. 90 minutes) and the calculator will carry the hours automatically.',
        'Use negative ("− Subtract") rows in the same list instead of running a separate calculation for break deductions.',
      ],
      problemsTitle: 'Minute-to-Decimal Hour Reference Table',
      problemsRows: [
        { problem: '15 minutes', cause: '15 ÷ 60 hours', solution: '0.25 decimal hours (quarter hour)' },
        { problem: '20 minutes', cause: '20 ÷ 60 hours', solution: '0.33 decimal hours (one-third hour)' },
        { problem: '30 minutes', cause: '30 ÷ 60 hours', solution: '0.50 decimal hours (half hour)' },
        { problem: '45 minutes', cause: '45 ÷ 60 hours', solution: '0.75 decimal hours (three-quarter hour)' },
        { problem: '50 minutes', cause: '50 ÷ 60 hours', solution: '0.83 decimal hours' },
      ],
    },
  },
  'time-addition-calculator': {
    heroSubtitle:
      'Sum or deduct long lists of hours, minutes, and seconds with instant HH:MM:SS and decimal-hour totals.',
    featurePills: ['Multi-row time summation', 'Automatic 60-min carry', 'Decimal hour readout', 'One-click copy'],
    quickPresets: [],
    steps: [
      { step: 1, title: 'Input duration rows', description: 'Enter hours, minutes, and seconds for each task or clip.' },
      { step: 2, title: 'Add or subtract per row', description: 'Toggle + Add or − Sub on individual rows.' },
      { step: 3, title: 'Expand your list', description: 'Add unlimited rows for weekly logs or playlists.' },
      { step: 4, title: 'Export total', description: 'Copy the formatted HH:MM:SS or decimal total.' },
    ],
    guide: {
      tableOfContents: [
        'What Is the Time Addition Calculator?',
        'How Base-60 Carryover Works',
        'How to Sum Multiple Time Entries',
        'Worked Examples and Formulas',
        'Common Use Cases',
        'Who Benefits Most?',
        'Time Addition Best Practices',
        'Common Mistakes Fixed',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is the Time Addition Calculator?',
      whatIsBody: [
        'The Time Addition Calculator lets you sum (and optionally subtract) a multi-row list of hours, minutes, and seconds in one place. Adding time manually on paper or in a standard spreadsheet often fails when seconds or minutes exceed 59.',
        'This tool handles unlimited rows of time segments, automatically carries every 60 seconds into 1 minute and every 60 minutes into 1 hour, and displays the grand total in HH:MM:SS, total minutes, and base-10 decimal hours.',
      ],
      howItWorksTitle: 'How Base-60 Carryover Works',
      howItWorksBody: [
        'Formula: Total Seconds = Σ [ ± ((H × 3,600) + (M × 60) + S) ]. Once all rows are summed in seconds, the calculator divides by 3,600 to extract whole hours, divides the remainder by 60 to extract whole minutes, and keeps the final remainder as seconds.',
        'Worked Example: Suppose you add three freelance tasks: 1h 50m 30s + 2h 25m 45s + 0h 40m 15s. The seconds sum to 30 + 45 + 15 = 90s (1m 30s). The minutes sum to 50 + 25 + 40 + 1 (carried) = 116m (1h 56m). The hours sum to 1 + 2 + 0 + 1 (carried) = 4 hours. Final result: 04:56:30 (296.5 minutes / 4.94 decimal hours).',
      ],
      calloutNote:
        'Tip: You can enter raw minutes (like 135 minutes) into a single row without converting to hours first.',
      howToUseTitle: 'How to Sum Multiple Time Entries',
      howToUseSteps: [
        'Enter the Hours, Minutes, and Seconds for your first entry.',
        'Add subsequent entries in the rows below, clicking "+ Add Duration Row" whenever you need more lines.',
        'Switch any row to "− Sub" if you need to deduct a break, trim a video cut, or remove unbillable time.',
        'Click "Copy Result" to copy the HH:MM:SS and decimal-hour summary.',
      ],
      featuresTitle: 'Worked Examples and Formulas',
      featuresList: [
        'Formula for Decimal Hours: Decimal Hours = TotalHours + (TotalMinutes ÷ 60) + (TotalSeconds ÷ 3,600).',
        'Playlist & Album Runtime: 03:42 + 04:18 + 02:55 + 05:05 = 16 minutes 00 seconds (960 seconds).',
        'Weekly Project Log: 2h 15m (Mon) + 3h 45m (Tue) + 1h 30m (Wed) + 4h 20m (Thu) = 11 hours 50 minutes (11.83 decimal hours).',
        'Assumptions: All entries represent pure elapsed durations (1 hour = 60 minutes = 3,600 seconds).',
      ],
      practicalExamples: [
        { icon: 'Monitor', title: 'Video & Audio Editing', description: 'Calculate exact runtime of multi-clip sequences and podcasts.' },
        { icon: 'CheckSquare', title: 'Client Invoicing', description: 'Total ticket-by-ticket support or engineering time logs.' },
        { icon: 'Clock', title: 'Aviation Logbooks', description: 'Sum flight hours and instrument time across logbook pages.' },
        { icon: 'GraduationCap', title: 'Curriculum Planning', description: 'Add lecture modules and lab exercises to fit a class period.' },
      ],
      whoBenefitsTitle: 'Who Benefits Most?',
      whoBenefitsList: [
        'Contractors and agencies billing across multiple daily tasks',
        'Film editors, YouTubers, and audio engineers timing cuts',
        'Teachers and workshop hosts building minute-by-minute agendas',
        'Athletes summing multi-stage race or triathlon splits',
      ],
      tipsTitle: 'Time Addition Best Practices',
      tipsList: [
        'Keep seconds at 0 if you only need hour-and-minute timesheet math.',
        'Double-check whether your payroll software expects HH:MM (11:50) or decimal hours (11.83).',
        'Use the Clear button to reset all rows to zero before starting a new batch.',
      ],
      problemsTitle: 'Common Time Addition Errors Avoided',
      problemsRows: [
        { problem: 'Adding 1.45 + 1.30 on a normal calculator gives 2.75', cause: 'Standard calculators treat .45 and .30 as base-10 hundredths instead of 60ths', solution: '1h 45m + 1h 30m is actually 3 hours 15 minutes (3.25 decimal hours)' },
        { problem: 'Seconds rollover forgotten', cause: '45s + 35s written as 80s', solution: 'Automatically carries 60s into +1 minute, leaving 20s' },
      ],
    },
  },
  'date-calculator': {
    heroSubtitle:
      'Calculate the exact number of calendar days, weeks, working weekdays, and weekend days between any two dates.',
    featurePills: ['Exact calendar days', 'Weekday vs. weekend breakdown', 'Leap-year aware', 'Inclusive end-date option'],
    quickPresets: [],
    steps: [
      { step: 1, title: 'Select Start Date', description: 'Pick the beginning calendar date from the date picker.' },
      { step: 2, title: 'Select End Date', description: 'Choose your target completion or milestone date.' },
      { step: 3, title: 'Toggle inclusive mode', description: 'Check "Include end date" if counting both boundary days.' },
      { step: 4, title: 'Inspect breakdown', description: 'View total days, weeks + days, weekdays, and weekend days.' },
    ],
    guide: {
      tableOfContents: [
        'What Is the Date Calculator?',
        'How Calendar Date Math & Leap Years Work',
        'How to Use the Date Calculator',
        'Worked Examples & Formulas',
        'When to Count Calendar vs. Business Days',
        'Who Uses This Tool?',
        'Tips for Date & Contract Calculations',
        'Inclusive vs. Exclusive Date Counting',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is the Date Calculator?',
      whatIsBody: [
        'The Date Calculator computes the exact duration between two Gregorian calendar dates. In a single view, it breaks the span down into total calendar days, whole weeks plus remaining days, total hours, Monday-through-Friday working weekdays, and Saturday-through-Sunday weekend days.',
        'Because months vary between 28, 29, 30, and 31 days, counting days across multiple months by hand is error-prone. This tool performs UTC calendar math to give an instant, verifiable day count for project timelines, legal notices, travel itineraries, and academic semesters.',
      ],
      howItWorksTitle: 'How Calendar Date Math & Leap Years Work',
      howItWorksBody: [
        'Both selected dates are normalized to 00:00:00 UTC so local Daylight Saving Time shifts (23-hour or 25-hour days) never distort the day count. The exclusive day difference is: Total Days = |UTC(End Date) − UTC(Start Date)| ÷ 86,400,000 ms. If "Include end date in calculation" is checked, 1 day is added.',
        'Gregorian Leap Year Rule: A year is a 366-day leap year (with February 29) if it is divisible by 4, except century years (divisible by 100) unless they are also divisible by 400. Thus 2024 and 2028 are leap years (366 days), 2026 is a common year (365 days), 2000 was a leap year, and 2100 will not be.',
      ],
      calloutNote:
        'Worked Example (2026): From March 1, 2026 to March 31, 2026 is 30 elapsed days (exclusive) or 31 inclusive days (the full month of March, comprising 22 weekdays and 9 weekend days).',
      howToUseTitle: 'How to Use the Date Calculator',
      howToUseSteps: [
        'Choose the Start Date and End Date in the calendar fields.',
        'Check "Include end date in calculation (+1 day)" if both the first and last date should be counted as full days (for example, PTO leave requests).',
        'Read the Total Calendar Days, Weeks & Days breakdown, Weekdays (Mon–Fri), and Weekend Days (Sat–Sun).',
      ],
      featuresTitle: 'Worked Examples & Formulas',
      featuresList: [
        '90-Day Notice / Visa Window: Adding 90 calendar days to June 1, 2026 (June has 30 days, July has 31 days, August has 31 days) lands on August 30, 2026 (30 + 31 + 29 = 90 days).',
        'Full Year 2026 Span: January 1, 2026 to December 31, 2026 is 364 elapsed days (exclusive) or 365 calendar days (inclusive), consisting of 52 weeks + 1 day (261 weekdays and 104 weekend days).',
        'Weeks Formula: Whole Weeks = Math.floor(Total Days ÷ 7); Remaining Days = Total Days mod 7.',
        'Assumptions & Limitations: The weekday counter counts all Monday–Friday dates and excludes Saturdays and Sundays. It does not automatically deduct country-specific public holidays, which should be subtracted manually if applicable.',
      ],
      practicalExamples: [
        { icon: 'Monitor', title: 'Project Management', description: 'Count exact working weekdays between sprint kickoff and launch.' },
        { icon: 'CheckSquare', title: 'HR & Leave Tracking', description: 'Calculate inclusive vacation days, maternity/paternity leave, or probation periods.' },
        { icon: 'Calendar', title: 'Travel & Visas', description: 'Verify hotel nights (exclusive) or Schengen 90/180-day stay limits (inclusive).' },
        { icon: 'GraduationCap', title: 'Academic Planning', description: 'Count study weeks remaining until final exams or thesis submission.' },
      ],
      whoBenefitsTitle: 'Who Uses This Tool?',
      whoBenefitsList: [
        'Project managers and software teams estimating sprint and milestone windows',
        'HR specialists and payroll administrators verifying employee leave durations',
        'Legal and real-estate professionals tracking 30-, 60-, and 90-day contract windows',
        'Travelers counting nights booked vs. total calendar days abroad',
      ],
      tipsTitle: 'Tips for Date & Contract Calculations',
      tipsList: [
        'Use Exclusive mode (unchecked) when counting hotel nights or age intervals (May 10 to May 15 = 5 nights).',
        'Use Inclusive mode (checked) when counting vacation days taken off work (Monday May 11 through Friday May 15 = 5 days off).',
        'Remember to subtract national or bank holidays that fall on Monday–Friday when estimating net business days.',
      ],
      problemsTitle: 'Inclusive vs. Exclusive Date Counting Reference',
      problemsRows: [
        { problem: 'Hotel Stay (Check-in May 1, Check-out May 5)', cause: 'Counting nights elapsed between dates', solution: 'Leave "Include end date" unchecked → 4 nights' },
        { problem: 'Work Vacation (Off Monday May 4 through Friday May 8)', cause: 'Both first and last day are full leave days', solution: 'Check "Include end date" → 5 calendar/business days' },
        { problem: 'Spanning February in 2028 vs. 2026', cause: '2028 is a leap year (Feb has 29 days); 2026 has 28 days', solution: 'Automatically accounted for by UTC calendar math' },
      ],
    },
  },
  'time-card-calculator': {
    heroSubtitle:
      'Calculate daily and weekly net work hours from shift start times, end times, and unpaid break deductions with CSV export.',
    featurePills: ['7-day weekly timesheet', 'Unpaid break deductions', 'HH:MM & decimal hours', 'Instant CSV export'],
    quickPresets: [],
    steps: [
      { step: 1, title: 'Select active workdays', description: 'Check the days worked during the pay period.' },
      { step: 2, title: 'Enter Start & End times', description: 'Input clock-in and clock-out times for each day.' },
      { step: 3, title: 'Deduct unpaid breaks', description: 'Enter unpaid lunch or rest minutes (e.g. 30 or 60 min).' },
      { step: 4, title: 'Review & export CSV', description: 'Read total weekly HH:MM and decimal hours or download CSV.' },
    ],
    guide: {
      tableOfContents: [
        'What Is the Time Card Calculator?',
        'Timesheet Formulas & Decimal Conversion',
        'How to Calculate Weekly Work Hours',
        'Worked Payroll Examples',
        'Practical Workplace Uses',
        'Who Uses This Calculator?',
        'Timesheet Accuracy Tips',
        'Payroll Minute-to-Decimal Conversion Table',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is the Time Card Calculator?',
      whatIsBody: [
        'The Time Card Calculator is a weekly timesheet calculator that computes net daily and weekly hours worked from clock-in times, clock-out times, and unpaid break deductions. It outputs both standard hours and minutes (HH:MM) and base-10 decimal hours required by payroll software.',
        'All calculations happen locally in your browser and can be exported to a clean CSV spreadsheet for bookkeeping, client invoicing, or payroll verification.',
      ],
      howItWorksTitle: 'Timesheet Formulas & Decimal Conversion',
      howItWorksBody: [
        'Daily Net Minutes Formula: Net Minutes = ((End Time − Start Time in minutes) − Unpaid Break Minutes). If the End Time is earlier than the Start Time (an overnight shift crossing midnight), the calculator automatically adds 1,440 minutes (24 hours).',
        'Daily Decimal Hours Formula: Decimal Hours = Net Minutes ÷ 60. Weekly Total Hours = Σ (Daily Net Minutes across all checked days) ÷ 60.',
      ],
      calloutNote:
        'Worked Example: Clock in at 08:30, clock out at 17:00 (8 hours 30 minutes = 510 gross minutes), minus a 30-minute unpaid lunch break = 480 net minutes = 8:00 (8.00 decimal hours). Over 5 days, that equals 40.00 hours.',
      howToUseTitle: 'How to Calculate Weekly Work Hours',
      howToUseSteps: [
        'Check the box next to each day worked (Monday through Sunday).',
        'Enter the Start Time and End Time for each shift.',
        'Enter any unpaid meal or rest break in minutes (for example, 30 minutes).',
        'Check the Weekly Total bar at the bottom for net HH:MM and Decimal Hours, then click "Export Time Card CSV" if needed.',
      ],
      featuresTitle: 'Worked Payroll Examples',
      featuresList: [
        'Standard 5-Day Shift with 45-Min Lunch: 09:00 to 17:30 (8h 30m gross) − 45m break = 7h 45m net per day (7.75 decimal hours). Over 5 days: 5 × 7.75 = 38.75 hours (38 hours 45 minutes).',
        'Overnight Hospital / Warehouse Shift: Clock in at 22:00 (10:00 PM), clock out at 06:30 (6:30 AM) − 30m break = 8h 30m gross − 30m = 8.00 net hours.',
        'Assumptions & Limitations: This tool computes net hours worked. If you need to split weekly hours into Regular vs. 1.5x Overtime pay, copy your Weekly Decimal Hours total into our Overtime Calculator.',
      ],
      practicalExamples: [
        { icon: 'CheckSquare', title: 'Small Business Payroll', description: 'Verify hourly employee time cards before running biweekly payroll.' },
        { icon: 'Monitor', title: 'Freelance & Agency Billing', description: 'Export a clean CSV timesheet to attach to client invoices.' },
        { icon: 'Clock', title: 'Overnight Shift Tracking', description: 'Calculate graveyard shifts that cross midnight without manual math.' },
        { icon: 'GraduationCap', title: 'Internship & Clinical Logs', description: 'Track required weekly practicum or clinical rotation hours.' },
      ],
      whoBenefitsTitle: 'Who Uses This Calculator?',
      whoBenefitsList: [
        'Hourly workers double-checking their pay stubs against clock-in logs',
        'Small business owners, office managers, and bookkeepers',
        'Independent contractors and consultants billing hourly rates',
        'Healthcare, hospitality, and logistics shift supervisors',
      ],
      tipsTitle: 'Timesheet Accuracy Tips',
      tipsList: [
        'Always enter unpaid breaks in minutes (e.g., 30 for a half-hour lunch). Paid rest breaks should be left at 0 so they remain included in net work hours.',
        'Always multiply hourly wage rates by the Decimal Hours column (e.g., 38.75 × $25/hr = $968.75), never by HH.MM.',
        'Use the CSV export button to save a permanent local record of each week’s hours.',
      ],
      problemsTitle: 'Payroll Minute-to-Decimal Conversion Table',
      problemsRows: [
        { problem: '05 minutes / 10 minutes', cause: '5 ÷ 60 / 10 ÷ 60', solution: '0.08 hrs / 0.17 hrs' },
        { problem: '15 minutes / 20 minutes', cause: '15 ÷ 60 / 20 ÷ 60', solution: '0.25 hrs / 0.33 hrs' },
        { problem: '30 minutes / 40 minutes', cause: '30 ÷ 60 / 40 ÷ 60', solution: '0.50 hrs / 0.67 hrs' },
        { problem: '45 minutes / 50 minutes', cause: '45 ÷ 60 / 50 ÷ 60', solution: '0.75 hrs / 0.83 hrs' },
      ],
    },
  },
  'overtime-calculator': {
    heroSubtitle:
      'Calculate regular hours, overtime hours, and gross pay using customizable thresholds and 1.5x or 2.0x multipliers.',
    featurePills: ['Custom overtime threshold', '1.5x & 2.0x multipliers', 'Gross pay breakdown', 'Clear formulas'],
    quickPresets: [],
    steps: [
      { step: 1, title: 'Enter Total Hours', description: 'Input total decimal hours worked in the week or shift.' },
      { step: 2, title: 'Set Overtime Threshold', description: 'Use 40 hours (standard weekly) or 8 hours (daily).' },
      { step: 3, title: 'Choose Multiplier & Rate', description: 'Select 1.5x (time-and-a-half), 2.0x, or custom rate.' },
      { step: 4, title: 'Review Pay Breakdown', description: 'See Regular Pay, Overtime Pay, and Total Gross Pay.' },
    ],
    guide: {
      tableOfContents: [
        'What Is the Overtime Calculator?',
        'Overtime Formulas & Worked Examples',
        'How to Use the Overtime Calculator',
        'Understanding Weekly vs. Daily Overtime Rules',
        'Practical Scenarios',
        'Who Uses This Tool?',
        'Tips for Estimating Overtime Pay',
        'Multiplier Reference Table',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is the Overtime Calculator?',
      whatIsBody: [
        'The Overtime Calculator splits your total hours worked into Regular Hours and Overtime Hours based on your chosen threshold, then calculates your effective overtime hourly rate, regular pay, overtime pay, and total gross pay.',
        'Because labor laws and union or employment contracts vary across countries and states, every parameter—total hours, overtime threshold, multiplier (1.5x, 2.0x, or custom), and base hourly wage—is fully configurable.',
      ],
      howItWorksTitle: 'Overtime Formulas & Worked Examples',
      howItWorksBody: [
        'Formulas: Regular Hours = min(Total Hours, Threshold); Overtime Hours = max(0, Total Hours − Threshold); Overtime Hourly Rate = Base Rate × Multiplier; Regular Pay = Regular Hours × Base Rate; Overtime Pay = Overtime Hours × Overtime Hourly Rate; Total Gross Pay = Regular Pay + Overtime Pay.',
        'Worked Example: Suppose you work 46.5 hours in a week with a 40-hour overtime threshold, a base rate of $24.00/hour, and a 1.5x (time-and-a-half) multiplier. Regular Hours = 40.00 hrs × $24.00 = $960.00. Overtime Hours = 6.50 hrs. Overtime Rate = $24.00 × 1.5 = $36.00/hr. Overtime Pay = 6.50 × $36.00 = $234.00. Total Gross Pay = $960.00 + $234.00 = $1,194.00.',
      ],
      calloutNote:
        'Double-Time (2.0x) Example: At $24.00/hr base rate, a 2.0x holiday or seventh-day multiplier equals $48.00/hr.',
      howToUseTitle: 'How to Use the Overtime Calculator',
      howToUseSteps: [
        'Enter your Total Hours Worked in decimal format (e.g. 46.5 hours).',
        'Set your Overtime Threshold (default is 40 hours per week; change to 8 for daily overtime or 37.5 / 44 per your contract).',
        'Select your Overtime Multiplier (1.5x Time-and-a-Half, 2.0x Double Time, or a custom multiplier) and enter your Base Hourly Rate.',
        'Read the itemized Regular vs. Overtime hours and gross pay summary.',
      ],
      featuresTitle: 'Understanding Weekly vs. Daily Overtime Rules',
      featuresList: [
        'U.S. Federal FLSA Standard: Under the Fair Labor Standards Act (29 U.S.C. § 207), non-exempt employees receive at least 1.5x their regular rate for hours worked beyond 40 in a workweek.',
        'Daily Overtime Jurisdictions (e.g. California): Some jurisdictions require 1.5x pay after 8 hours in a single workday and 2.0x pay after 12 hours in a workday. To calculate a single day, set the Threshold to 8.',
        'Contract & European Thresholds: Many collective bargaining agreements trigger overtime after 35, 37.5, or 38 hours per week.',
        'Assumptions & Disclaimer: Calculations represent pre-tax gross earnings before income tax, Social Security/FICA, or benefit deductions, and are provided for informational estimation rather than legal or tax advice.',
      ],
      practicalExamples: [
        { icon: 'CheckSquare', title: 'Paycheck Verification', description: 'Confirm that 1.5x overtime hours on your pay stub match your logged shifts.' },
        { icon: 'Monitor', title: 'Project Staffing Budgets', description: 'Estimate labor cost impact before authorizing weekend overtime.' },
        { icon: 'Clock', title: 'Shift Differential Planning', description: 'Compare 1.5x time-and-a-half vs. 2.0x holiday double-time pay.' },
        { icon: 'Users', title: 'Freelance Rush Rates', description: 'Quote 1.5x rush or weekend hourly rates transparently to clients.' },
      ],
      whoBenefitsTitle: 'Who Uses This Tool?',
      whoBenefitsList: [
        'Hourly and non-exempt employees checking weekly gross pay',
        'Small business managers forecasting shift labor budgets',
        'Contractors charging overtime or weekend rush multipliers',
        'Bookkeepers and payroll clerks auditing manual time cards',
      ],
      tipsTitle: 'Tips for Estimating Overtime Pay',
      tipsList: [
        'Convert minutes to decimal hours before entering Total Hours (e.g., 44 hours 30 minutes = 44.5 hours).',
        'Remember that paid holidays or PTO hours typically do not count toward the 40-hour physical work threshold under federal rules unless specified by your employer.',
        'If you receive non-discretionary bonuses, your statutory regular rate of pay may be slightly higher than your base hourly wage.',
      ],
      problemsTitle: 'Overtime Multiplier Reference Table ($20.00/hr Base Example)',
      problemsRows: [
        { problem: '1.0x (Regular Time)', cause: 'Hours up to threshold (e.g. ≤ 40 hrs)', solution: '$20.00 / hour' },
        { problem: '1.25x (Quarter Premium)', cause: 'Weekend or evening shift differential', solution: '$25.00 / hour' },
        { problem: '1.5x (Time and a Half)', cause: 'Standard overtime beyond 40 hrs/week', solution: '$30.00 / hour' },
        { problem: '2.0x (Double Time)', cause: 'Holiday or extended >12h daily threshold', solution: '$40.00 / hour' },
      ],
    },
  },
  'speech-time-calculator': {
    heroSubtitle:
      'Convert speech scripts and word counts into accurate speaking duration estimates with adjustable WPM pacing.',
    featurePills: ['Live script word counter', 'Adjustable 90–200 WPM', 'Pause buffer calculation', 'Direct rehearsal link'],
    quickPresets: [],
    steps: [
      { step: 1, title: 'Paste your script', description: 'Paste your speech text or type your target word count.' },
      { step: 2, title: 'Select speaking pace', description: 'Choose Slow (110 WPM), Conversational (130 WPM), or Fast (150+ WPM).' },
      { step: 3, title: 'Add pause buffers', description: 'Include extra seconds for slide transitions or applause.' },
      { step: 4, title: 'Rehearse with timer', description: 'Launch the Presentation Timer pre-loaded with your target time.' },
    ],
    guide: {
      tableOfContents: [
        'What Is the Speech Time Calculator?',
        'Speaking Time Formula & Word Count Math',
        'How to Estimate Your Speech Duration',
        'Words-Per-Minute (WPM) Reference Table',
        'Practical Speaking Scenarios',
        'Who Uses This Calculator?',
        'Tips for Pacing Your Presentation',
        'Common Scripting Mistakes',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is the Speech Time Calculator?',
      whatIsBody: [
        'The Speech Time Calculator estimates how many minutes and seconds it will take to deliver a written script aloud based on your speaking rate in words per minute (WPM) and planned pause intervals.',
        'Whether you are preparing a 5-minute Toastmasters speech, an 18-minute conference keynote, a 60-second commercial voiceover, or a university thesis defense, knowing your exact word-to-minute ratio prevents rushing or getting cut off on stage.',
      ],
      howItWorksTitle: 'Speaking Time Formula & Word Count Math',
      howItWorksBody: [
        'Formula: Total Speaking Seconds = ((Word Count ÷ WPM) × 60) + Pause Buffer Seconds. Conversely, to find how many words to write for a fixed time slot: Target Word Count = Speaking Minutes × WPM.',
        'Worked Example: You paste a 910-word script and select a conversational presentation pace of 130 WPM with 15 seconds of slide-transition pauses. Base speaking time = (910 ÷ 130) × 60 = 7.00 minutes (420 seconds). Adding the 15-second pause buffer gives 435 seconds = 7 minutes 15 seconds.',
      ],
      calloutNote:
        'Quick Rule of Thumb: At a clear, natural stage pace of 130 words per minute, every 130 words equals 1 minute of speaking (650 words = 5 minutes; 1,300 words = 10 minutes).',
      howToUseTitle: 'How to Estimate Your Speech Duration',
      howToUseSteps: [
        'Paste your draft script into the text area to count words, sentences, and paragraphs automatically.',
        'Pick a WPM preset that matches your delivery style (110 WPM for deliberate/technical, 130 WPM for conversational keynotes, 150 WPM for upbeat podcasts).',
        'Add pause seconds for slide changes, audience laughter, or demonstrations.',
        'Trim or expand your script until the estimated duration sits comfortably inside your allotted stage slot.',
      ],
      featuresTitle: 'Words-Per-Minute (WPM) Reference by Format',
      featuresList: [
        '1-Minute Elevator Pitch: 110 words (slow) · 130 words (conversational) · 150 words (fast).',
        '5-Minute Lightning Talk / Toastmasters Speech: 550 words (110 WPM) · 650 words (130 WPM) · 750 words (150 WPM).',
        '10-Minute Conference Talk: 1,100 words (110 WPM) · 1,300 words (130 WPM) · 1,500 words (150 WPM).',
        '18-Minute TED-Style Keynote: 1,980 words (110 WPM) · 2,340 words (130 WPM) · 2,700 words (150 WPM).',
      ],
      practicalExamples: [
        { icon: 'Mic', title: 'Conference Keynotes', description: 'Trim a 2,500-word draft down to fit a strict 18-minute stage slot.' },
        { icon: 'Trophy', title: 'Toastmasters Speeches', description: 'Target 650–780 words to hit the 5-to-7 minute qualifying window.' },
        { icon: 'Video', title: 'YouTube & Voiceovers', description: 'Time 30-second (65–75 words) and 60-second (130–150 words) ad reads.' },
        { icon: 'GraduationCap', title: 'Academic Defenses', description: 'Pace a 15-minute conference paper (~1,900 words) with slide pauses.' },
      ],
      whoBenefitsTitle: 'Who Uses This Calculator?',
      whoBenefitsList: [
        'Keynote speakers and conference presenters',
        'Toastmasters members preparing 5–7 minute speeches',
        'Podcasters, video scriptwriters, and voiceover artists',
        'Students and researchers presenting papers or thesis defenses',
      ],
      tipsTitle: 'Tips for Pacing Your Presentation',
      tipsList: [
        'Stage adrenaline makes most speakers talk 10–15% faster live than in rehearsal—aim for 125–130 WPM.',
        'Budget 3 to 5 seconds of silent pause every time you introduce a complex chart or slide.',
        'Read your script aloud with our Speaker Timer running to measure your true personal WPM.',
      ],
      problemsTitle: 'Speaking Pace Reference Guide',
      problemsRows: [
        { problem: 'Slow & Deliberate (100–115 WPM)', cause: 'Technical lectures, non-native audiences, or solemn ceremonial speeches', solution: 'Write ~110 words per minute of stage time' },
        { problem: 'Conversational Keynote (125–140 WPM)', cause: 'Standard conference talks, Toastmasters, and TED-style presentations', solution: 'Write ~130 words per minute of stage time' },
        { problem: 'Fast / Broadcast (150–170 WPM)', cause: 'Energetic podcasts, YouTube explainers, and debate speeches', solution: 'Write ~155 words per minute of speaking time' },
      ],
    },
  },
  'time-converter': {
    heroSubtitle:
      'Convert between milliseconds, seconds, minutes, hours, days, and weeks with exact formulas and decimal breakdowns.',
    featurePills: ['6 time units supported', 'Exact SI & calendar factors', 'Decimal & HMS output', 'One-click unit swap'],
    quickPresets: [],
    steps: [
      { step: 1, title: 'Enter numeric value', description: 'Type any whole or decimal quantity to convert.' },
      { step: 2, title: 'Select From & To units', description: 'Pick Milliseconds, Seconds, Minutes, Hours, Days, or Weeks.' },
      { step: 3, title: 'Swap direction', description: 'Click Swap Units to reverse the conversion instantly.' },
      { step: 4, title: 'View multi-unit breakdown', description: 'See equivalent seconds, minutes, decimal hours, and days.' },
    ],
    guide: {
      tableOfContents: [
        'What Is the Time Converter?',
        'Exact Conversion Factors & Formulas',
        'How to Convert Time Units',
        'Worked Conversion Examples',
        'Practical Applications',
        'Who Uses This Converter?',
        'Tips for Unit Conversion',
        'Standard Time Unit Equivalencies',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is the Time Converter?',
      whatIsBody: [
        'The Time Converter transforms any numeric duration between milliseconds (ms), seconds (s), minutes (min), hours (hr), days (d), and weeks (wk). Alongside the primary target unit, it displays a complete breakdown across all standard time units.',
        'Because time units use mixed bases—1,000 milliseconds per second, 60 seconds per minute, 60 minutes per hour, 24 hours per day, and 7 days per week—having a single verified conversion table prevents multiplication and division mistakes.',
      ],
      howItWorksTitle: 'Exact Conversion Factors & Formulas',
      howItWorksBody: [
        'The converter normalizes your input value into base seconds using exact SI and standard calendar factors: 1 millisecond = 0.001 seconds; 1 second = 1 second; 1 minute = 60 seconds; 1 hour = 3,600 seconds; 1 day = 86,400 seconds; 1 week = 604,800 seconds.',
        'Formula: Target Value = (Input Value × Source Unit Seconds) ÷ Target Unit Seconds.',
      ],
      calloutNote:
        'Worked Example: Convert 2.5 days into minutes → (2.5 × 86,400 seconds) ÷ 60 seconds = 216,000 ÷ 60 = 3,600 minutes (or 60 hours).',
      howToUseTitle: 'How to Convert Time Units',
      howToUseSteps: [
        'Type the number you want to convert into the Value box.',
        'Choose your starting unit in the "From" menu and your desired unit in the "To" menu.',
        'Click any quick preset button or "Swap Units" to test common conversions.',
      ],
      featuresTitle: 'Worked Conversion Examples',
      featuresList: [
        'Hours to Seconds: 3.5 hours × 3,600 seconds/hour = 12,600 seconds.',
        'Seconds to Hours: 10,800 seconds ÷ 3,600 seconds/hour = 3.00 hours (180 minutes).',
        'Weeks to Hours: 2 weeks × 7 days/week × 24 hours/day = 336 hours (20,160 minutes).',
        'Milliseconds to Seconds: 45,000 ms ÷ 1,000 = 45 seconds.',
      ],
      practicalExamples: [
        { icon: 'Monitor', title: 'Software & DevOps', description: 'Convert cache TTLs and timeout intervals between ms, seconds, and hours.' },
        { icon: 'CheckSquare', title: 'Payroll & Accounting', description: 'Translate total shift minutes into decimal hours for wages.' },
        { icon: 'GraduationCap', title: 'Physics & Chemistry Labs', description: 'Convert experimental reaction times into standard SI seconds.' },
        { icon: 'Clock', title: 'Endurance Sports', description: 'Convert marathon or cycling times between total minutes, seconds, and hours.' },
      ],
      whoBenefitsTitle: 'Who Uses This Converter?',
      whoBenefitsList: [
        'Software engineers setting API timeouts, cron jobs, and cache expirations',
        'Students and science teachers working with SI unit conversions',
        'Payroll administrators and project planners',
        'Everyday users converting recipe, workout, or travel durations',
      ],
      tipsTitle: 'Tips for Unit Conversion',
      tipsList: [
        'When configuring server timeouts or JavaScript setTimeout(), remember 1 minute = 60,000 ms and 1 hour = 3,600,000 ms.',
        'Use the HMS readout to see how a decimal value (like 2.75 hours) translates into whole hours and minutes (2h 45m).',
      ],
      problemsTitle: 'Standard Time Unit Reference Table',
      problemsRows: [
        { problem: '1 Minute', cause: '60 seconds', solution: '60,000 milliseconds / 0.0167 hours' },
        { problem: '1 Hour', cause: '60 minutes', solution: '3,600 seconds / 3,600,000 milliseconds' },
        { problem: '1 Day (24 Hours)', cause: '1,440 minutes', solution: '86,400 seconds' },
        { problem: '1 Week (7 Days)', cause: '168 hours', solution: '10,080 minutes / 604,800 seconds' },
      ],
    },
  },
  'minutes-to-hours': {
    heroSubtitle:
      'Convert any number of minutes into decimal hours and hours-and-minutes (HH:MM) format instantly.',
    featurePills: ['Minutes ÷ 60 formula', 'Both HH:MM & decimal output', 'Timesheet ready', 'Quick preset chips'],
    quickPresets: [],
    steps: [
      { step: 1, title: 'Enter total minutes', description: 'Type any minute count (e.g. 90, 135, or 510 minutes).' },
      { step: 2, title: 'Read decimal hours', description: 'See the base-10 decimal value (e.g. 1.5 or 8.5 hours).' },
      { step: 3, title: 'Read hours & minutes', description: 'See the clock breakdown (e.g. 1 hr 30 min or 8 hr 30 min).' },
      { step: 4, title: 'Swap or copy', description: 'Click Swap Units to reverse from hours to minutes.' },
    ],
    guide: {
      tableOfContents: [
        'What Is the Minutes to Hours Converter?',
        'Formula: How to Convert Minutes to Hours',
        'How to Use This Converter',
        'Step-by-Step Worked Examples',
        'Where Minutes-to-Hours Conversion Is Used',
        'Who Uses This Tool?',
        'Avoiding the Base-10 vs. Base-60 Trap',
        'Minutes to Hours Conversion Table',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is the Minutes to Hours Converter?',
      whatIsBody: [
        'The Minutes to Hours Converter takes any number of minutes and converts it into both decimal hours (such as 2.25 hours) and standard hours and remaining minutes (such as 2 hours 15 minutes).',
        'This dual output solves the most common timesheet and scheduling mistake: confusing the digits after a decimal point with raw minutes.',
      ],
      howItWorksTitle: 'Formula: How to Convert Minutes to Hours',
      howItWorksBody: [
        'Because there are 60 minutes in 1 hour, divide the total minutes by 60: Decimal Hours = Total Minutes ÷ 60.',
        'To find whole hours and remaining minutes: Whole Hours = Math.floor(Total Minutes ÷ 60); Remaining Minutes = Total Minutes mod 60 (or subtract Whole Hours × 60 from Total Minutes).',
      ],
      calloutNote:
        'Worked Example: Convert 135 minutes to hours → 135 ÷ 60 = 2.25 decimal hours. Whole hours = 2 (120 minutes), and remaining minutes = 135 − 120 = 15 minutes (2 hours 15 minutes).',
      howToUseTitle: 'How to Use This Converter',
      howToUseSteps: [
        'Enter your total minutes into the input box, or click a preset chip (45m, 75m, 90m, 120m, 150m, 510m).',
        'Check the primary result for Decimal Hours and the secondary card for Hours + Remaining Minutes.',
        'Use the Swap Units button anytime you need to convert backward from hours into minutes.',
      ],
      featuresTitle: 'Step-by-Step Worked Examples',
      featuresList: [
        '90 Minutes to Hours: 90 ÷ 60 = 1.50 decimal hours = 1 hour 30 minutes.',
        '100 Minutes to Hours: 100 ÷ 60 = 1.67 decimal hours = 1 hour 40 minutes (not 1 hour 67 minutes).',
        '200 Minutes to Hours: 200 ÷ 60 = 3.33 decimal hours = 3 hours 20 minutes.',
        '510 Minutes (Standard Work Shift): 510 ÷ 60 = 8.50 decimal hours = 8 hours 30 minutes.',
      ],
      practicalExamples: [
        { icon: 'CheckSquare', title: 'Payroll Timesheets', description: 'Convert 495 weekly shift minutes into 8.25 decimal hours.' },
        { icon: 'Monitor', title: 'Movie & Flight Lengths', description: 'See that a 148-minute movie or flight is 2 hours 28 minutes.' },
        { icon: 'GraduationCap', title: 'Study & Reading Logs', description: 'Total daily 25-minute or 45-minute study sessions into hours.' },
        { icon: 'Clock', title: 'Workout Tracking', description: 'Convert weekly cardio minutes (e.g. 150 minutes) into 2.5 hours.' },
      ],
      whoBenefitsTitle: 'Who Uses This Tool?',
      whoBenefitsList: [
        'Hourly employees and payroll administrators',
        'Students and parents totaling monthly reading or practice logs',
        'Travelers checking flight layovers and movie runtimes',
        'Project managers converting task estimates from minutes into hours',
      ],
      tipsTitle: 'Avoiding the Base-10 vs. Base-60 Trap',
      tipsList: [
        'Remember that .25 hours = 15 minutes, .50 hours = 30 minutes, and .75 hours = 45 minutes.',
        'To turn the decimal part of an hour back into minutes, multiply the decimal portion by 60 (e.g., 0.40 hours × 60 = 24 minutes).',
      ],
      problemsTitle: 'Common Minutes to Hours Reference Table',
      problemsRows: [
        { problem: '30 min / 45 min / 60 min', cause: 'Divided by 60', solution: '0.50 hrs (0h 30m) / 0.75 hrs (0h 45m) / 1.00 hr (1h 00m)' },
        { problem: '75 min / 90 min / 105 min', cause: 'Divided by 60', solution: '1.25 hrs (1h 15m) / 1.50 hrs (1h 30m) / 1.75 hrs (1h 45m)' },
        { problem: '120 min / 150 min / 180 min', cause: 'Divided by 60', solution: '2.00 hrs (2h 00m) / 2.50 hrs (2h 30m) / 3.00 hrs (3h 00m)' },
        { problem: '240 min / 480 min / 510 min', cause: 'Divided by 60', solution: '4.00 hrs (4h 00m) / 8.00 hrs (8h 00m) / 8.50 hrs (8h 30m)' },
      ],
    },
  },
  'hours-to-minutes': {
    heroSubtitle:
      'Convert whole or decimal hours into exact minutes and seconds with one-click presets.',
    featurePills: ['Hours × 60 formula', 'Supports decimal hours', 'Shows total seconds', 'Instant presets'],
    quickPresets: [],
    steps: [
      { step: 1, title: 'Enter hours', description: 'Type whole or decimal hours (e.g. 1.5, 2.75, or 8 hours).' },
      { step: 2, title: 'Read total minutes', description: 'See the exact minute total immediately.' },
      { step: 3, title: 'Check HMS & seconds', description: 'View hours + minutes and total seconds side by side.' },
      { step: 4, title: 'Use quick chips', description: 'Click common shift or class lengths to test.' },
    ],
    guide: {
      tableOfContents: [
        'What Is the Hours to Minutes Converter?',
        'Formula: How to Convert Hours to Minutes',
        'How to Use This Converter',
        'Step-by-Step Worked Examples',
        'Everyday & Professional Uses',
        'Who Uses This Converter?',
        'Quick Mental Math Tips',
        'Hours to Minutes Reference Table',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is the Hours to Minutes Converter?',
      whatIsBody: [
        'The Hours to Minutes Converter multiplies any whole or decimal hour value by 60 to give you the exact number of minutes and seconds. It also translates decimal hours (such as 1.75 hours) into clean clock hours and minutes (1 hour 45 minutes).',
      ],
      howItWorksTitle: 'Formula: How to Convert Hours to Minutes',
      howItWorksBody: [
        'Because every hour contains 60 minutes, multiply the hour value by 60: Total Minutes = Hours × 60. To find total seconds, multiply by 3,600: Total Seconds = Hours × 3,600.',
        'Worked Example: Convert 2.75 hours into minutes → 2.75 × 60 = 165 minutes (which is 2 hours and 45 minutes, or 9,900 seconds).',
      ],
      calloutNote:
        'Worked Example: A standard 8.5-hour shift equals 8.5 × 60 = 510 minutes (30,600 seconds).',
      howToUseTitle: 'How to Use This Converter',
      howToUseSteps: [
        'Type the number of hours (whole or decimal) into the Value input.',
        'Read the exact total minutes in the primary output card, along with the HH:MM:SS breakdown and total seconds.',
        'Click "Swap Units" if you need to convert minutes back into hours.',
      ],
      featuresTitle: 'Step-by-Step Worked Examples',
      featuresList: [
        '0.25 Hours (Quarter Hour): 0.25 × 60 = 15 minutes.',
        '1.5 Hours: 1.5 × 60 = 90 minutes.',
        '3.25 Hours: 3.25 × 60 = 195 minutes (3 hours 15 minutes).',
        '24 Hours (1 Full Day): 24 × 60 = 1,440 minutes (86,400 seconds).',
      ],
      practicalExamples: [
        { icon: 'GraduationCap', title: 'Exam Administration', description: 'Convert a 2.5-hour exam allowance into a 150-minute countdown.' },
        { icon: 'CheckSquare', title: 'Agenda & Event Planning', description: 'Break a 1.5-hour workshop into 90 minutes of timed segments.' },
        { icon: 'Utensils', title: 'Cooking & Slow Roasting', description: 'Convert a 1.75-hour roast time into 105 kitchen timer minutes.' },
        { icon: 'Clock', title: 'Shift Scheduling', description: 'Calculate total minutes in a 7.5-hour (450 min) or 8-hour (480 min) shift.' },
      ],
      whoBenefitsTitle: 'Who Uses This Converter?',
      whoBenefitsList: [
        'Teachers and exam proctors setting minute-based countdown timers',
        'Conference producers allocating minute-by-minute run-of-show blocks',
        'Home cooks and bakers converting recipe hours into minutes',
        'Payroll and scheduling coordinators',
      ],
      tipsTitle: 'Quick Mental Math Tips',
      tipsList: [
        'To multiply by 60 in your head, multiply by 6 first and add a zero (e.g., 4 hours × 6 = 24 → 240 minutes).',
        'For .5 hours, always add 30 minutes to the whole-hour total.',
      ],
      problemsTitle: 'Hours to Minutes Reference Table',
      problemsRows: [
        { problem: '0.5 hrs / 0.75 hrs / 1 hr', cause: 'Multiplied by 60', solution: '30 min / 45 min / 60 min' },
        { problem: '1.25 hrs / 1.5 hrs / 1.75 hrs', cause: 'Multiplied by 60', solution: '75 min / 90 min / 105 min' },
        { problem: '2 hrs / 3 hrs / 4 hrs', cause: 'Multiplied by 60', solution: '120 min / 180 min / 240 min' },
        { problem: '8 hrs / 12 hrs / 24 hrs', cause: 'Multiplied by 60', solution: '480 min / 720 min / 1,440 min' },
      ],
    },
  },
  'seconds-to-minutes': {
    heroSubtitle:
      'Convert seconds into decimal minutes as well as whole minutes and remaining seconds (MM:SS).',
    featurePills: ['Seconds ÷ 60 formula', 'MM:SS & decimal minutes', 'Decimal hours included', 'One-click presets'],
    quickPresets: [],
    steps: [
      { step: 1, title: 'Enter total seconds', description: 'Type any number of seconds (e.g. 90, 300, or 1,500).' },
      { step: 2, title: 'View decimal minutes', description: 'Read the exact base-10 minute value.' },
      { step: 3, title: 'View MM:SS breakdown', description: 'See whole minutes plus remaining seconds.' },
      { step: 4, title: 'Swap or test presets', description: 'Click preset chips or swap to minutes-to-seconds.' },
    ],
    guide: {
      tableOfContents: [
        'What Is the Seconds to Minutes Converter?',
        'Formula: How to Convert Seconds into Minutes',
        'How to Use This Converter',
        'Worked Conversion Examples',
        'Where Seconds-to-Minutes Math Matters',
        'Who Uses This Converter?',
        'Tips for Fast Seconds Conversion',
        'Seconds to Minutes Reference Table',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is the Seconds to Minutes Converter?',
      whatIsBody: [
        'The Seconds to Minutes Converter divides any number of seconds by 60 to display both decimal minutes (e.g., 3.5 minutes) and standard minutes with remaining seconds (e.g., 3 minutes 30 seconds).',
      ],
      howItWorksTitle: 'Formula: How to Convert Seconds into Minutes',
      howItWorksBody: [
        'Formula: Decimal Minutes = Total Seconds ÷ 60. To express the result as whole minutes and remaining seconds: Whole Minutes = Math.floor(Total Seconds ÷ 60); Remaining Seconds = Total Seconds mod 60.',
        'Worked Example: Convert 1,000 seconds into minutes → 1,000 ÷ 60 = 16.67 decimal minutes. Since 16 × 60 = 960 seconds, the remainder is 1,000 − 960 = 40 seconds. Result: 16 minutes 40 seconds.',
      ],
      calloutNote:
        'Worked Example: 1,500 seconds (a standard 25-minute Pomodoro sprint) ÷ 60 = 25.00 minutes.',
      howToUseTitle: 'How to Use This Converter',
      howToUseSteps: [
        'Enter the total number of seconds into the input field or pick a preset chip (90s, 180s, 300s, 600s, 1500s, 3600s).',
        'Read the converted Decimal Minutes alongside the Whole Minutes + Remaining Seconds card.',
        'Click "Swap Units" to convert minutes into seconds.',
      ],
      featuresTitle: 'Worked Conversion Examples',
      featuresList: [
        '90 Seconds: 90 ÷ 60 = 1.50 minutes = 1 minute 30 seconds.',
        '180 Seconds: 180 ÷ 60 = 3.00 minutes.',
        '300 Seconds: 300 ÷ 60 = 5.00 minutes.',
        '3,600 Seconds: 3,600 ÷ 60 = 60.00 minutes (1 hour).',
      ],
      practicalExamples: [
        { icon: 'Flame', title: 'HIIT & Track Splits', description: 'Convert a 400-meter or 1,500-meter run time in seconds into MM:SS.' },
        { icon: 'Monitor', title: 'Video & Animation', description: 'Translate frame-rate second counts into exact timeline minutes.' },
        { icon: 'Coffee', title: 'Coffee & Tea Extraction', description: 'Convert a 210-second pour-over recipe into 3 minutes 30 seconds.' },
        { icon: 'GraduationCap', title: 'Science & Lab Timing', description: 'Convert centrifugation or exposure seconds into minutes.' },
      ],
      whoBenefitsTitle: 'Who Uses This Converter?',
      whoBenefitsList: [
        'Athletes, runners, rowers, and swim coaches analyzing split times',
        'Video editors, animators, and motion designers',
        'Web developers checking API cache headers (e.g. max-age=3600 = 60 minutes)',
        'Students and home cooks following second-based instructions',
      ],
      tipsTitle: 'Tips for Fast Seconds Conversion',
      tipsList: [
        'Memorize the key multiples of 60: 60s = 1m, 120s = 2m, 180s = 3m, 240s = 4m, 300s = 5m, 600s = 10m, 1,800s = 30m, 3,600s = 60m.',
      ],
      problemsTitle: 'Seconds to Minutes Reference Table',
      problemsRows: [
        { problem: '45 sec / 90 sec / 150 sec', cause: 'Divided by 60', solution: '0.75 min (0m 45s) / 1.50 min (1m 30s) / 2.50 min (2m 30s)' },
        { problem: '180 sec / 240 sec / 300 sec', cause: 'Divided by 60', solution: '3.00 min / 4.00 min / 5.00 min' },
        { problem: '600 sec / 900 sec / 1,200 sec', cause: 'Divided by 60', solution: '10.00 min / 15.00 min / 20.00 min' },
        { problem: '1,500 sec / 1,800 sec / 3,600 sec', cause: 'Divided by 60', solution: '25.00 min / 30.00 min / 60.00 min (1 hr)' },
      ],
    },
  },
  'what-time-will-it-be': {
    heroSubtitle:
      'Find out the exact clock time and date X hours, minutes, and seconds from right now or any custom starting time.',
    featurePills: ['Live ticking clock option', 'Future (+ Add) & Past (− Ago)', '12-hour & 24-hour output', 'Quick minute chips'],
    quickPresets: [],
    steps: [
      { step: 1, title: 'Choose starting time', description: 'Use Live Current Time or pick a custom start time.' },
      { step: 2, title: 'Select Future or Past', description: 'Choose "+ In the Future" or "− In the Past".' },
      { step: 3, title: 'Enter duration or click chip', description: 'Type hours/minutes or click "In 20 min", "In 30 min", "In 45 min".' },
      { step: 4, title: 'Read target clock time', description: 'See the exact 12-hour AM/PM time, 24-hour time, and date.' },
    ],
    guide: {
      tableOfContents: [
        'What Is the "What Time Will It Be" Calculator?',
        'How Clock Rollover & Midnight Math Works',
        'How to Find Future or Past Clock Times',
        'Worked Examples',
        'Everyday Uses',
        'Who Uses This Calculator?',
        'Tips for Scheduling Ahead',
        'Quick Offset Reference Examples',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is the "What Time Will It Be" Calculator?',
      whatIsBody: [
        'The "What Time Will It Be" Calculator answers questions like "What time will it be in 30 minutes?", "What time will it be in 4 hours and 45 minutes?", or "What time was it 90 minutes ago?" directly from your live system clock or any custom starting time.',
        'It displays the resulting clock time in both 12-hour AM/PM format and 24-hour military format, and indicates if the calculation crosses midnight into tomorrow or a future calendar date.',
      ],
      howItWorksTitle: 'How Clock Rollover & Midnight Math Works',
      howItWorksBody: [
        'Formula: Target Timestamp = Start Timestamp ± ((Hours × 3,600,000) + (Minutes × 60,000) + (Seconds × 1,000)). When adding minutes pushes the minute hand past :59, 60 minutes are subtracted and +1 is carried to the hour. When hours cross 12:00 PM or 12:00 AM, AM/PM flips and the calendar date advances at midnight (00:00).',
        'Worked Example: If the starting time is 2:40 PM (14:40) and you add 45 minutes: 40 + 45 = 85 minutes = 1 hour 25 minutes. Carrying +1 hour to 2:00 PM gives 3:25 PM (15:25).',
      ],
      calloutNote:
        'Live Mode updates every second against your device clock so you always see the exact completion time if you start a task right now.',
      howToUseTitle: 'How to Find Future or Past Clock Times',
      howToUseSteps: [
        'Keep "Current Time (Live)" selected to calculate from right now, or switch to "Custom Start Time" to enter a specific clock time.',
        'Click any one-tap preset ("In 15 minutes", "In 20 minutes", "In 30 minutes", "In 45 minutes", "In 90 minutes") or type custom hours, minutes, and seconds.',
        'Toggle "In the Past (− Ago)" if you need to work backward from a deadline or arrival time.',
      ],
      featuresTitle: 'Worked Examples',
      featuresList: [
        'Adding 30 Minutes to 11:45 AM: Crosses noon → 12:15 PM (12:15).',
        'Adding 2 Hours 30 Minutes to 10:45 PM: Crosses midnight → 1:15 AM (01:15) the next calendar day (+1 day).',
        'Subtracting 45 Minutes from 9:15 AM (Departure Planning): 9:15 AM − 45 minutes = 8:30 AM.',
      ],
      practicalExamples: [
        { icon: 'Utensils', title: 'Cooking & Baking', description: 'See the exact clock time a 45-minute bake or 90-minute dough rise will finish.' },
        { icon: 'Coffee', title: 'Work & Lunch Breaks', description: 'Know the exact minute your 30-minute or 45-minute break ends.' },
        { icon: 'Clock', title: 'Medication & Parking', description: 'Calculate when a 4-hour dose window or 2-hour parking meter expires.' },
        { icon: 'Calendar', title: 'Airport & Commute Backward Math', description: 'Switch to "− Ago" to see when to leave for a flight.' },
      ],
      whoBenefitsTitle: 'Who Uses This Calculator?',
      whoBenefitsList: [
        'Remote workers and students scheduling breaks and focus blocks',
        'Home cooks and bakers tracking oven finish times',
        'Parents and caregivers timing nap windows or reminders',
        'Drivers and travelers checking arrival and departure clock times',
      ],
      tipsTitle: 'Tips for Scheduling Ahead',
      tipsList: [
        'Use "− In the Past" when you know your required arrival time and want to subtract travel and prep minutes.',
        'Once you see your target time, you can launch a live Countdown Timer or Online Alarm Clock in one click.',
      ],
      problemsTitle: 'Common Clock Rollover Examples',
      problemsRows: [
        { problem: '11:40 AM + 35 minutes', cause: 'Crosses 12:00 PM (Noon)', solution: '12:15 PM (Same day)' },
        { problem: '11:30 PM + 45 minutes', cause: 'Crosses 12:00 AM (Midnight)', solution: '12:15 AM (Next calendar day)' },
        { problem: '1:10 PM − 25 minutes', cause: 'Rolls back across 1:00 PM', solution: '12:45 PM' },
      ],
    },
  },
  'time-zone-converter': {
    heroSubtitle:
      'Compare and convert local times and dates across multiple global cities using official IANA time-zone rules.',
    featurePills: ['Official IANA tz database', 'Interactive 24-hour scrubber', 'Automatic DST detection', 'One-click meeting copy'],
    quickPresets: [],
    steps: [
      { step: 1, title: 'Add global cities', description: 'Select the cities or IANA zones you want to compare.' },
      { step: 2, title: 'Pick date & time', description: 'Drag the 24-hour timeline slider or select a specific date.' },
      { step: 3, title: 'Check date rollovers', description: 'Notice +1 Day or −1 Day badges across the International Date Line.' },
      { step: 4, title: 'Copy meeting block', description: 'Click Copy Meeting Time to share formatted local times.' },
    ],
    guide: {
      tableOfContents: [
        'What Is the Time Zone Converter?',
        'How IANA Time Zones, UTC Offsets & DST Work',
        'How to Convert Time Across Cities',
        'Worked International Conversion Examples',
        'Non-Whole-Hour Time Zones Explained',
        'Who Uses This Converter?',
        'Tips for Global Scheduling',
        '2026 Daylight Saving Time Transition Reference',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is the Time Zone Converter?',
      whatIsBody: [
        'The Time Zone Converter is an interactive multi-city time comparison tool that converts any date and clock time across global cities simultaneously. Instead of converting only two zones in isolation, you can stack New York, London, Berlin, Mumbai, Singapore, Sydney, and Tokyo on a single 24-hour timeline.',
      ],
      howItWorksTitle: 'How IANA Time Zones, UTC Offsets & DST Work',
      howItWorksBody: [
        'Every city is mapped to its canonical IANA Time Zone Database identifier (such as America/New_York, Europe/London, Asia/Kolkata, or Pacific/Auckland) and evaluated using the browser Intl.DateTimeFormat engine for the exact calendar date you select.',
        'Coordinated Universal Time (UTC) serves as the global reference point (UTC±00:00). Local Time = UTC Time + Current Zone Offset. Because Daylight Saving Time (DST) begins and ends on different dates in North America, Europe, and the Southern Hemisphere, evaluating a specific calendar date ensures the correct seasonal offset is applied.',
      ],
      calloutNote:
        'Worked Example (Winter vs. Summer): On January 15, 2026, 09:00 AM in New York (EST, UTC-5) equals 14:00 (2:00 PM) in London (GMT, UTC+0) and 19:30 (7:30 PM) in Mumbai (IST, UTC+5:30).',
      howToUseTitle: 'How to Convert Time Across Cities',
      howToUseSteps: [
        'Add or remove cities from the comparison stack using the city selector.',
        'Select your target calendar date (crucial during March, April, October, and November DST changeover weeks).',
        'Drag the interactive 24-hour slider to scrub through the day and watch all cities update in lockstep.',
        'Click "Copy Meeting Time" to copy a clean multi-timezone summary for your calendar invite or Slack channel.',
      ],
      featuresTitle: 'Worked International Conversion Examples',
      featuresList: [
        'US East Coast to UK & Central Europe (Standard Time): 10:00 AM New York (UTC-5) = 3:00 PM London (UTC+0) = 4:00 PM Berlin/Paris (UTC+1).',
        'Half-Hour & 45-Minute Offset Zones: India (Asia/Kolkata, UTC+5:30) and Sri Lanka (UTC+5:30) are 30 minutes off the hour; Nepal (Asia/Kathmandu, UTC+5:45) is 45 minutes off the hour. When it is 12:00 PM UTC in London, it is 5:30 PM in Mumbai and 5:45 PM in Kathmandu.',
        'Crossing the International Date Line: When it is Monday 4:00 PM in San Francisco (PST, UTC-8), it is already Tuesday 9:00 AM in Tokyo (JST, UTC+9) and Tuesday 1:00 PM in Auckland (NZDT, UTC+13).',
      ],
      practicalExamples: [
        { icon: 'Users', title: 'Distributed Engineering Standups', description: 'Convert a 16:00 UTC sprint review across US, UK, and EU hubs.' },
        { icon: 'Globe', title: 'International Flights & Layovers', description: 'Verify local arrival dates when crossing the Pacific or Atlantic.' },
        { icon: 'Video', title: 'Global Webinars & Product Launches', description: 'Publish accurate local start times for Americas, EMEA, and APAC.' },
        { icon: 'Monitor', title: 'Financial Market Opens', description: 'Track overlap windows between London, New York, and Tokyo trading hours.' },
      ],
      whoBenefitsTitle: 'Who Uses This Converter?',
      whoBenefitsList: [
        'Remote workers and global project managers',
        'Executive assistants scheduling cross-border client calls',
        'Event marketers announcing international livestream times',
        'Travelers and expatriates coordinating with family abroad',
      ],
      tipsTitle: 'Tips for Global Scheduling',
      tipsList: [
        'Always include the UTC time and the calendar date when announcing global events across Asia-Pacific and the Americas.',
        'Watch out for the 3-week March gap (March 8 to March 29, 2026) when the US has already sprung forward into EDT (UTC-4) while the UK is still on GMT (UTC+0).',
      ],
      problemsTitle: '2026 Daylight Saving Time (DST) Transition Dates',
      problemsRows: [
        { problem: 'United States & Canada', cause: '2nd Sunday in March / 1st Sunday in November', solution: 'Starts March 8, 2026 · Ends November 1, 2026' },
        { problem: 'United Kingdom & European Union', cause: 'Last Sunday in March / Last Sunday in October', solution: 'Starts March 29, 2026 · Ends October 25, 2026' },
        { problem: 'Australia (NSW, VIC, TAS, SA, ACT)', cause: '1st Sunday in October / 1st Sunday in April (Southern Hemisphere)', solution: 'Ends April 5, 2026 · Starts October 4, 2026' },
        { problem: 'Japan, India, Singapore, China, UAE', cause: 'Do not observe Daylight Saving Time', solution: 'Remain on fixed standard UTC offset year-round' },
      ],
    },
  },
  'time-difference-calculator': {
    heroSubtitle:
      'Calculate the exact hour and minute offset between any two cities and inspect their shared 9-to-5 working hour overlap.',
    featurePills: ['Exact hour & minute delta', '9-to-5 business overlap', 'IANA & DST aware', 'Supports 30m/45m offsets'],
    quickPresets: [],
    steps: [
      { step: 1, title: 'Select Location A', description: 'Choose your home city or base time zone.' },
      { step: 2, title: 'Select Location B', description: 'Choose the second city you want to compare.' },
      { step: 3, title: 'Read exact time delta', description: 'See how many hours and minutes ahead or behind Location B is.' },
      { step: 4, title: 'Check business overlap', description: 'Review the shared 9:00 AM–5:00 PM working hours window.' },
    ],
    guide: {
      tableOfContents: [
        'What Is the Time Difference Calculator?',
        'Formula: How UTC Offset Differences Are Calculated',
        'How to Use the Time Difference Calculator',
        'Worked City-Pair Examples',
        'Shared Working Hours Overlap Explained',
        'Who Uses This Calculator?',
        'Tips for Cross-Border Collaboration',
        'Major Global City Time Differences',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is the Time Difference Calculator?',
      whatIsBody: [
        'The Time Difference Calculator computes the exact hour and minute offset between any two world cities (for example, "London is 5 hours ahead of New York" or "Mumbai is 9 hours 30 minutes ahead of New York" in winter) and identifies how many standard 9:00 AM to 5:00 PM working hours the two locations share each day.',
      ],
      howItWorksTitle: 'Formula: How UTC Offset Differences Are Calculated',
      howItWorksBody: [
        'Each city’s current offset from Coordinated Universal Time (UTC) is queried in minutes from the IANA Time Zone Database. Formula: Offset Difference = Offset(City B) − Offset(City A).',
        'Worked Example: Compare Los Angeles (PST, UTC−8:00 = −480 minutes) and Mumbai (IST, UTC+5:30 = +330 minutes). Difference = +330 − (−480) = +810 minutes = 13 hours 30 minutes. Mumbai is 13 hours and 30 minutes ahead of Los Angeles during North American standard time (and 12 hours 30 minutes ahead during PDT summer time).',
      ],
      calloutNote:
        'Because regions switch Daylight Saving Time on different dates, the time difference between two cities can shift by 1 or 2 hours depending on the month of the year.',
      howToUseTitle: 'How to Use the Time Difference Calculator',
      howToUseSteps: [
        'Pick your first city in the Location A dropdown and your second city in Location B.',
        'Read the live local clock time and calendar date in both cities side by side.',
        'Check the Working Hours Overlap analysis to see the exact window when both cities are between 09:00 and 17:00 local time.',
      ],
      featuresTitle: 'Worked City-Pair Examples',
      featuresList: [
        'New York (UTC-5) vs. London (UTC+0): 5 hours difference (London is 5 hours ahead). Shared 9-to-5 window: 9:00 AM–12:00 PM New York / 2:00 PM–5:00 PM London (3 hours overlap).',
        'London (UTC+0) vs. Singapore (UTC+8): 8 hours difference. When it is 9:00 AM in London, it is 5:00 PM in Singapore—making 9:00–10:00 AM London (5:00–6:00 PM Singapore) the primary call window.',
        'Sydney (AEDT, UTC+11) vs. Auckland (NZDT, UTC+13): 2 hours difference (Auckland is 2 hours ahead), giving 6 shared working hours daily.',
      ],
      practicalExamples: [
        { icon: 'Users', title: 'Client & Vendor Calls', description: 'See immediately if two offices share daytime business hours.' },
        { icon: 'Globe', title: 'Travel Jet-Lag Planning', description: 'Check the exact hour shift before flying across continents.' },
        { icon: 'Clock', title: 'Family & Expat Calls', description: 'Find morning-to-evening windows when neither side is asleep.' },
        { icon: 'Monitor', title: 'Support Hand-offs', description: 'Plan "follow-the-sun" DevOps shifts across Americas, EMEA, and APAC.' },
      ],
      whoBenefitsTitle: 'Who Uses This Calculator?',
      whoBenefitsList: [
        'Distributed teams collaborating between North America, Europe, and Asia',
        'International travelers calculating jet-lag adjustments',
        'Customer support managers designing 24/7 follow-the-sun coverage',
        'Friends and families staying connected across oceans',
      ],
      tipsTitle: 'Tips for Cross-Border Collaboration',
      tipsList: [
        'When two cities are more than 8 hours apart (0 shared 9-to-5 hours), rotate early-morning (8:00 AM) and early-evening (6:00 PM) calls fairly between teams.',
        'Use the World Meeting Planner if you need to coordinate 3 or more cities at the same time.',
      ],
      problemsTitle: 'Major City-Pair Time Differences (Standard Time vs. DST)',
      problemsRows: [
        { problem: 'New York ↔ London', cause: 'UTC-5 vs. UTC+0 (Winter) / UTC-4 vs. UTC+1 (Summer)', solution: '5 hours (4 hours during March/Oct transition gap)' },
        { problem: 'Los Angeles ↔ New York', cause: 'America/Los_Angeles vs. America/New_York', solution: '3 hours year-round (both switch DST on the same dates)' },
        { problem: 'London ↔ Mumbai (India)', cause: 'India stays at UTC+5:30 year-round', solution: '5 hours 30 min in winter (GMT) · 4 hours 30 min in summer (BST)' },
        { problem: 'New York ↔ Tokyo', cause: 'Japan stays at UTC+9:00 year-round', solution: '14 hours in winter (EST) · 13 hours in summer (EDT)' },
      ],
    },
  },
  'meeting-planner': {
    heroSubtitle:
      'Find fair, mutually convenient international meeting slots across multiple world cities with a color-coded 24-hour grid.',
    featurePills: ['Multi-city 24h matrix', 'Green/Yellow/Red availability', 'Date & DST aware', 'Copy invite summary'],
    quickPresets: [],
    steps: [
      { step: 1, title: 'Add participant cities', description: 'Select every city where meeting attendees are located.' },
      { step: 2, title: 'Choose meeting date', description: 'Pick the target date so seasonal DST rules apply accurately.' },
      { step: 3, title: 'Scan for Green columns', description: 'Look for vertical columns where all cities show Green (8am–6pm).' },
      { step: 4, title: 'Copy meeting slot', description: 'Click the best hour column to copy local times for all cities.' },
    ],
    guide: {
      tableOfContents: [
        'What Is the World Meeting Planner?',
        'How the Availability Color Matrix Works',
        'How to Schedule a Multi-Timezone Meeting',
        'Best Overlap Windows for Global Teams',
        'Practical Scheduling Scenarios',
        'Who Uses This Planner?',
        'Best Practices for Global Meeting Equity',
        'Continent Overlap Cheat Sheet',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is the World Meeting Planner?',
      whatIsBody: [
        'The World Meeting Planner is a visual 24-hour scheduling matrix that displays local hours for multiple global cities side by side. Each hour cell is color-coded according to local waking and working hours so you can spot the best meeting window in seconds.',
      ],
      howItWorksTitle: 'How the Availability Color Matrix Works',
      howItWorksBody: [
        'For every UTC hour of your selected date, the planner calculates the local clock time in each participant’s IANA time zone and assigns a status color: Green (08:00–18:00 local time) for standard working hours; Yellow (07:00–08:00 and 18:00–21:00) for early/late shoulder hours; and Red (21:00–07:00) for overnight sleeping hours.',
        'The optimal meeting slot is any vertical column where every row is Green—or, for three-continent teams, where rows are a mix of Green and Yellow with zero Red overnight cells.',
      ],
      calloutNote:
        'Example 3-Hub Slot (New York + London + Bangalore): 13:30 UTC corresponds to 8:30 AM in New York (EST), 1:30 PM in London (GMT), and 7:00 PM in Bangalore (IST)—avoiding overnight hours for all three hubs.',
      howToUseTitle: 'How to Schedule a Multi-Timezone Meeting',
      howToUseSteps: [
        'Add each team hub (for example, San Francisco, New York, London, Berlin, Singapore).',
        'Pick your meeting date to account for upcoming Daylight Saving Time changes.',
        'Scan across the 24-hour grid to find the column with the most Green cells.',
        'Click that hour column to copy a formatted list of local start times for your calendar invite.',
      ],
      featuresTitle: 'Best Overlap Windows for Global Teams',
      featuresList: [
        'US West Coast + US East Coast + UK/Europe: 16:00–17:00 UTC (8:00–9:00 AM Pacific, 11:00 AM–12:00 PM Eastern, 4:00–5:00 PM London, 5:00–6:00 PM Berlin).',
        'UK/Europe + India + Singapore/Tokyo: 08:00–10:00 UTC (8:00–10:00 AM London, 1:30–3:30 PM India, 4:00–6:00 PM Singapore, 5:00–7:00 PM Tokyo).',
        'US West Coast + Australia/New Zealand: 22:00–00:00 UTC (2:00–4:00 PM Pacific on Day 1 = 9:00–11:00 AM Sydney on Day 2).',
      ],
      practicalExamples: [
        { icon: 'Users', title: 'All-Hands Town Halls', description: 'Find the single best hour for Americas, EMEA, and APAC staff.' },
        { icon: 'Monitor', title: 'Sprint Planning & Retros', description: 'Schedule recurring agile ceremonies across distributed pods.' },
        { icon: 'GraduationCap', title: 'International Research Calls', description: 'Coordinate university consortia across multiple continents.' },
        { icon: 'Globe', title: 'Board & Investor Meetings', description: 'Share clear multi-timezone options in email proposals.' },
      ],
      whoBenefitsTitle: 'Who Uses This Planner?',
      whoBenefitsList: [
        'Remote engineering, product, and design managers',
        'Executive assistants and operations coordinators',
        'International sales and customer success teams',
        'Open-source maintainers hosting community calls',
      ],
      tipsTitle: 'Best Practices for Global Meeting Equity',
      tipsList: [
        'When spanning more than 12 time-zone hours, alternate between two meeting times (one favorable to Americas/EMEA, one favorable to EMEA/APAC) and record sessions.',
        'Always verify your recurring meeting slot twice a year in March and October/November when DST shifts occur.',
      ],
      problemsTitle: 'Global Hub Overlap Reference Table (UTC)',
      problemsRows: [
        { problem: 'Americas + Europe', cause: '5 to 9 hours apart', solution: '14:00–17:00 UTC (Morning Americas / Afternoon Europe)' },
        { problem: 'Europe + Asia-Pacific', cause: '5.5 to 9 hours apart', solution: '07:30–10:30 UTC (Morning Europe / Afternoon-Evening Asia)' },
        { problem: 'US West Coast + East Asia / Australia', cause: 'Across International Date Line', solution: '22:00–01:00 UTC (Afternoon US / Morning Next Day APAC)' },
      ],
    },
  },
  'unix-timestamp-converter': {
    heroSubtitle:
      'Convert Unix epoch timestamps (seconds, milliseconds, microseconds) to UTC, local time, and ISO-8601 dates.',
    featurePills: ['Live epoch clock', 'Auto-detects s / ms / μs', 'ISO-8601 & RFC-2822 output', '64-bit Year 2038 safe'],
    quickPresets: [],
    steps: [
      { step: 1, title: 'Paste Unix timestamp', description: 'Enter a 10-digit (s), 13-digit (ms), or 16-digit (μs) number.' },
      { step: 2, title: 'Inspect decoded dates', description: 'Read UTC, local time zone, ISO-8601, and relative time.' },
      { step: 3, title: 'Or pick a calendar date', description: 'Enter any human date/time to generate its epoch timestamp.' },
      { step: 4, title: 'Copy for code or SQL', description: 'One-click copy for JSON APIs, logs, or database queries.' },
    ],
    guide: {
      tableOfContents: [
        'What Is a Unix Timestamp?',
        'How Epoch Conversion & Unit Auto-Detection Work',
        'How to Use the Unix Timestamp Converter',
        'Worked Examples & Code Snippets',
        'Understanding the Year 2038 Problem (Y2K38)',
        'Who Uses This Converter?',
        'Developer Tips for Timestamps',
        'Common Epoch Milestone Timestamps',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is a Unix Timestamp?',
      whatIsBody: [
        'A Unix timestamp (also called Epoch time or POSIX time) is the total number of elapsed seconds since 00:00:00 Coordinated Universal Time (UTC) on Thursday, January 1, 1970, excluding leap seconds.',
        'Because a Unix timestamp is a single timezone-independent integer, software engineers use it in databases, JWT authentication tokens (exp / iat claims), server logs, and REST APIs to store and compare moments in time unambiguously.',
      ],
      howItWorksTitle: 'How Epoch Conversion & Unit Auto-Detection Work',
      howItWorksBody: [
        'Formulas: Unix Seconds = Math.floor(Date.UTC(Y, M, D, h, m, s) ÷ 1,000); Unix Milliseconds = Date.UTC(Y, M, D, h, m, s, ms).',
        'Unit Auto-Detection: A standard timestamp in seconds is 10 digits long (e.g., 1767225600 for 2026-01-01T00:00:00Z). JavaScript and Java millisecond timestamps are 13 digits (1767225600000), and microsecond database/tracing timestamps are 16 digits. Our converter inspects the magnitude of your input and scales it automatically.',
      ],
      calloutNote:
        'Worked Example: Timestamp 1767225600 seconds × 1,000 = 1767225600000 ms → decodes to Thursday, January 1, 2026 at 00:00:00 UTC (ISO-8601: 2026-01-01T00:00:00.000Z).',
      howToUseTitle: 'How to Use the Unix Timestamp Converter',
      howToUseSteps: [
        'Watch or pause the live Unix Epoch clock at the top of the tool.',
        'Paste any integer timestamp into the input box to decode its UTC date, your local browser time zone, ISO-8601 string, and relative age.',
        'Use the Date-to-Epoch panel to convert a specific calendar date and time into seconds and milliseconds.',
      ],
      featuresTitle: 'Understanding the Year 2038 Problem (Y2K38)',
      featuresList: [
        'Why 2038 Matters: Legacy systems that store Unix timestamps as signed 32-bit integers have a maximum value of 2³¹ − 1 = 2,147,483,647 seconds.',
        'Exact Overflow Moment: 0 + 2,147,483,647 seconds occurs at 03:14:07 UTC on Tuesday, January 19, 2038. One second later, a 32-bit signed integer wraps around to −2,147,483,648 (December 13, 1901).',
        '64-Bit Safety: Modern 64-bit operating systems, databases, and this web converter use 64-bit numbers, supporting dates billions of years into the future.',
        'Leap Seconds Note: Standard POSIX time treats every UTC day as exactly 86,400 seconds and does not increment during astronomical leap seconds.',
      ],
      practicalExamples: [
        { icon: 'Binary', title: 'JWT Token Debugging', description: 'Decode iat (issued at) and exp (expiration) claims from OAuth tokens.' },
        { icon: 'Monitor', title: 'Log & Trace Analysis', description: 'Convert CloudWatch, Datadog, or Kubernetes millisecond log timestamps.' },
        { icon: 'CheckSquare', title: 'Database Queries', description: 'Generate exact epoch boundaries for SQL WHERE created_at >= queries.' },
        { icon: 'Clock', title: 'API Rate-Limit Headers', description: 'Check X-RateLimit-Reset epoch headers to see when quotas refresh.' },
      ],
      whoBenefitsTitle: 'Who Uses This Converter?',
      whoBenefitsList: [
        'Backend, frontend, and mobile software engineers',
        'DevOps, SRE, and cloud infrastructure engineers inspecting logs',
        'Database administrators and data analysts',
        'QA and security engineers testing token expirations',
      ],
      tipsTitle: 'Developer Tips for Timestamps',
      tipsList: [
        'In JavaScript/TypeScript, Date.now() returns milliseconds (13 digits); use Math.floor(Date.now() / 1000) when an API expects Unix seconds.',
        'In Python, int(time.time()) returns Unix seconds; in PostgreSQL, use EXTRACT(EPOCH FROM NOW()).',
      ],
      problemsTitle: 'Notable Unix Timestamp Reference Table',
      problemsRows: [
        { problem: '0', cause: '1970-01-01T00:00:00Z', solution: 'The Unix Epoch origin (Thursday, Jan 1, 1970 UTC)' },
        { problem: '1000000000', cause: '2001-09-09T01:46:40Z', solution: 'Unix Billennium (1 billion seconds)' },
        { problem: '1767225600', cause: '2026-01-01T00:00:00Z', solution: 'Start of calendar year 2026 UTC' },
        { problem: '2000000000', cause: '2033-05-18T03:33:20Z', solution: '2 billion seconds milestone' },
        { problem: '2147483647', cause: '2038-01-19T03:14:07Z', solution: 'Maximum 32-bit signed integer (Y2K38 limit)' },
      ],
    },
  },
  'speaker-timer': {
    heroSubtitle:
      'High-contrast podium and keynote countdown timer with green, amber, and red pacing alerts plus automatic overtime tracking.',
    featurePills: ['Green / Amber / Red stages', 'Automatic overtime count-up', 'Screen Wake Lock active', 'Fullscreen podium view'],
    quickPresets: [
      { icon: '🎤', label: '5 min', sublabel: 'Lightning Talk', sec: 300 },
      { icon: '🎤', label: '10 min', sublabel: 'Short Talk', sec: 600 },
      { icon: '🎤', label: '15 min', sublabel: 'Panel Slot', sec: 900 },
      { icon: '🎤', label: '18 min', sublabel: 'TED-Style Keynote', sec: 1080 },
      { icon: '🎤', label: '45 min', sublabel: 'Main Keynote', sec: 2700 },
    ],
    steps: [
      { step: 1, title: 'Select speech duration', description: 'Pick a keynote preset (5m, 10m, 18m, 45m) or enter custom time.' },
      { step: 2, title: 'Launch Fullscreen (F)', description: 'Expand the high-contrast display on the podium tablet or monitor.' },
      { step: 3, title: 'Follow color stages', description: 'Green = on pace, Amber = wrap up soon, Red = final minute.' },
      { step: 4, title: 'Monitor overtime', description: 'If time reaches 00:00, the timer counts up in red so you know exact overrun.' },
    ],
    guide: {
      tableOfContents: [
        'What Is the Speaker Timer?',
        'How Color-Coded Stage Pacing & Overtime Work',
        'How to Use the Speaker Timer',
        'Keynote & Podium Features',
        'Practical Event Scenarios',
        'Who Uses This Timer?',
        'Tips for Speakers and Moderators',
        'Stage Signal Thresholds Reference',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is the Speaker Timer?',
      whatIsBody: [
        'The Speaker Timer is a high-contrast confidence countdown clock built for conference podiums, keynote presenters, panel moderators, and lecture halls. Instead of forcing a presenter to squint at small digits mid-sentence, it combines oversized tabular numerals with automatic Green, Amber, and Red visual pacing states.',
      ],
      howItWorksTitle: 'How Color-Coded Stage Pacing & Overtime Work',
      howItWorksBody: [
        'During the main body of your talk, the status indicator stays Green. When you enter the final wrap-up window (20% of total duration or 2 minutes remaining), the display transitions to Amber so you can begin summarizing. In the final 60 seconds, the display shifts to Red.',
        'If a speaker continues past 00:00, the timer does not simply stop—it switches to an Overtime count-up (+00:01, +00:02...) in bold red digits so both the presenter and the session chair can see exact overrun time.',
      ],
      calloutNote:
        'Tip: Leave 3 to 5 minutes at the end of a 20-minute conference slot for audience Q&A and microphone handoffs.',
      howToUseTitle: 'How to Use the Speaker Timer',
      howToUseSteps: [
        'Select your talk length (such as 5m Lightning Talk, 18m TED-style Keynote, or 45m Plenary) or enter custom minutes and seconds.',
        'Place your tablet or laptop on the lectern or downstage floor monitor and press F for Fullscreen.',
        'Press Spacebar or click Start when the speaker begins.',
        'Use M to mute audio chimes if you want purely visual color cues during a live broadcast.',
      ],
      featuresTitle: 'Keynote & Podium Features',
      featuresList: [
        'Automatic Screen Wake Lock prevents tablets and laptops from dimming mid-speech.',
        'Seamless Overtime count-up mode after 00:00 so moderators never lose track of schedule drift.',
        'Keyboard shortcuts: Spacebar (Start/Pause), R (Reset), F (Fullscreen), M (Mute/Unmute).',
        'Tabular monospace digits prevent horizontal jitter as seconds tick down.',
      ],
      practicalExamples: [
        { icon: 'Mic', title: 'TED-Style 18-Min Keynotes', description: 'Keep high-stakes single-topic talks inside the classic 18-minute cap.' },
        { icon: 'Users', title: 'Academic Paper Sessions', description: 'Run four 12-minute paper presentations plus 3-minute Q&As on schedule.' },
        { icon: 'Monitor', title: 'Demo Day Pitches', description: 'Give startup founders a clear 3-minute or 5-minute pitch clock.' },
        { icon: 'GraduationCap', title: 'Guest Lectures', description: 'Pace 45-minute university lectures without checking a wristwatch.' },
      ],
      whoBenefitsTitle: 'Who Uses This Timer?',
      whoBenefitsList: [
        'Conference keynote speakers and panelists',
        'Event emcees, session chairs, and stage managers',
        'University lecturers and symposium organizers',
        'Startup accelerators hosting investor demo days',
      ],
      tipsTitle: 'Tips for Speakers and Moderators',
      tipsList: [
        'Test sightlines from the podium before doors open so the speaker can see the screen without looking down.',
        'For multi-screen AV setups where a technician controls the clock from backstage, use our synchronized Stage Timer.',
      ],
      problemsTitle: 'Standard Conference Slot Breakdown',
      problemsRows: [
        { problem: '5-Minute Lightning Talk', cause: '300 seconds total', solution: 'Green 0:00–4:00 · Amber at 1:00 left · Red at 0:30 left' },
        { problem: '18-Minute Keynote', cause: '1,080 seconds total', solution: 'Green 0:00–15:00 · Amber at 3:00 left · Red at 1:00 left' },
        { problem: '30-Minute Session (20m + 10m Q&A)', cause: '1,800 seconds total', solution: 'Transition to Q&A when Amber warning appears at 10:00 left' },
      ],
    },
  },
  'presentation-timer': {
    heroSubtitle:
      'Pace your slide deck across introduction, main content, demo, and Q&A segments without rushing your conclusion.',
    featurePills: ['Slide-section pacing', 'Visual progress bar', 'Optional audio cues', 'Fullscreen presenter view'],
    quickPresets: [
      { icon: '📊', label: '5 min', sublabel: 'Pitch Deck', sec: 300 },
      { icon: '📊', label: '10 min', sublabel: 'Client Update', sec: 600 },
      { icon: '📊', label: '15 min', sublabel: 'Board Brief', sec: 900 },
      { icon: '📊', label: '20 min', sublabel: '10-20-30 Rule', sec: 1200 },
      { icon: '📊', label: '30 min', sublabel: 'Thesis Defense', sec: 1800 },
    ],
    steps: [
      { step: 1, title: 'Set total presentation time', description: 'Choose 5, 10, 15, 20, or 30 minutes (or custom).' },
      { step: 2, title: 'Start rehearsal or pitch', description: 'Click Start as you deliver your opening slide.' },
      { step: 3, title: 'Check section milestones', description: 'Use the progress bar to verify you are halfway through slides at 50% time.' },
      { step: 4, title: 'Transition to Q&A on time', description: 'Wrap up core slides when the amber warning appears.' },
    ],
    guide: {
      tableOfContents: [
        'What Is the Presentation Timer?',
        'How Slide Pacing & the 10-20-30 Rule Work',
        'How to Use the Presentation Timer',
        'Example Presentation Time Budgets',
        'Practical Use Cases',
        'Who Uses This Tool?',
        'Tips for Rehearsing Slide Decks',
        'Slide Count vs. Duration Reference Table',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is the Presentation Timer?',
      whatIsBody: [
        'The Presentation Timer helps founders, executives, students, and educators pace multi-part slide presentations. The most common presentation failure is spending 70% of the allotted time on background context and rushing through the solution or results in the final 60 seconds.',
      ],
      howItWorksTitle: 'How Slide Pacing & the 10-20-30 Rule Work',
      howItWorksBody: [
        'As the countdown runs, the visual progress bar and color states show what fraction of your time budget has been spent. Following Guy Kawasaki’s classic 10-20-30 presentation rule (10 slides, 20 minutes, 30-point minimum font), each core slide receives an average of 1.5 to 2 minutes.',
      ],
      calloutNote:
        'Worked Example (15-Minute Thesis or Client Pitch): Allocate 2 min for Problem/Hook, 5 min for Methodology/Product, 4 min for Results/Traction, and 4 min for Conclusion & Q&A.',
      howToUseTitle: 'How to Use the Presentation Timer',
      howToUseSteps: [
        'Select your total presentation duration or enter custom minutes and seconds.',
        'Keep the timer open on a secondary monitor or phone beside your laptop while PowerPoint, Keynote, or Google Slides is in Presenter View.',
        'Use silent visual mode during live pitches or enable gentle chimes during solo rehearsal.',
      ],
      featuresTitle: 'Example Presentation Time Budgets',
      featuresList: [
        '5-Minute Startup Pitch: 45s Hook & Problem · 90s Product & Demo · 60s Traction & Market · 45s Team & Ask · 60s Q&A.',
        '20-Minute Executive Briefing: 3m Executive Summary · 10m Deep Dive Data · 7m Discussion & Decisions.',
        '45-Minute Classroom Lesson: 5m Warm-up Hook · 15m Direct Instruction · 20m Guided Practice · 5m Exit Ticket.',
      ],
      practicalExamples: [
        { icon: 'Presentation', title: 'Investor Pitch Decks', description: 'Hit every key metric before the 5-minute or 10-minute partner bell.' },
        { icon: 'GraduationCap', title: 'Thesis & Dissertation Defenses', description: 'Keep committee presentations strictly inside the 20- or 30-minute rule.' },
        { icon: 'Monitor', title: 'Product Demos & Webinars', description: 'Balance slide framing with live software walkthroughs.' },
        { icon: 'Users', title: 'Quarterly Business Reviews', description: 'Leave ample room for executive questions at the end of the deck.' },
      ],
      whoBenefitsTitle: 'Who Uses This Tool?',
      whoBenefitsList: [
        'Startup founders rehearsing seed and Series A pitches',
        'Graduate students defending master’s theses or PhD dissertations',
        'Sales engineers running timed software demonstrations',
        'Corporate leaders presenting quarterly updates',
      ],
      tipsTitle: 'Tips for Rehearsing Slide Decks',
      tipsList: [
        'Record your elapsed time at the halfway slide during rehearsal; if more than 55% of your time is gone, cut introductory slides.',
        'Use our Speech Time Calculator if you write out speaker notes and want to check word count against speaking minutes.',
      ],
      problemsTitle: 'Recommended Slide Count by Presentation Length',
      problemsRows: [
        { problem: '5-Minute Lightning Pitch', cause: '1.5 to 2 min per core point', solution: '5 to 7 slides maximum' },
        { problem: '10-Minute Conference Talk', cause: '1.5 min per slide + intro/outro', solution: '8 to 10 slides' },
        { problem: '20-Minute Keynote / Defense', cause: '1.5 to 2 min per slide', solution: '10 to 14 slides' },
        { problem: '45-Minute Seminar', cause: 'Includes interactive discussion', solution: '20 to 25 slides' },
      ],
    },
  },
  'stage-timer': {
    heroSubtitle:
      'Run a backstage Operator Console in one window while projecting a synchronized confidence monitor display on stage.',
    featurePills: ['Dual-screen BroadcastChannel sync', 'Live backstage flash messages', 'Sub-millisecond local sync', 'Zero account required'],
    quickPresets: [
      { icon: '📺', label: '5 min', sublabel: 'Segment', sec: 300 },
      { icon: '📺', label: '15 min', sublabel: 'Fireside Chat', sec: 900 },
      { icon: '📺', label: '20 min', sublabel: 'Keynote', sec: 1200 },
      { icon: '📺', label: '30 min', sublabel: 'Panel', sec: 1800 },
      { icon: '📺', label: '60 min', sublabel: 'Main Session', sec: 3600 },
    ],
    steps: [
      { step: 1, title: 'Open Stage Display', description: 'Click "Open Stage Display" and drag that window to your projector or HDMI monitor.' },
      { step: 2, title: 'Control from Operator Console', description: 'Start, pause, reset, or adjust time from your laptop console.' },
      { step: 3, title: 'Send live cue messages', description: 'Type "WRAP UP" or "MIC TOO LOW" and toggle Show Message.' },
      { step: 4, title: 'Track overtime', description: 'Monitor exact overrun seconds if a panel runs past 00:00.' },
    ],
    guide: {
      tableOfContents: [
        'What Is the Stage Timer?',
        'How Multi-Window BroadcastChannel Synchronization Works',
        'How to Set Up a Dual-Screen Confidence Monitor',
        'Live Backstage Messaging & Controls',
        'Production Use Cases',
        'Who Uses the Stage Timer?',
        'AV Technician Setup Tips',
        'Troubleshooting Multi-Display Setups',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is the Stage Timer?',
      whatIsBody: [
        'The Stage Timer is a two-window production countdown system designed for AV technicians, stage managers, conference producers, and broadcast directors. It separates the Operator Console (kept privately on the technician’s laptop) from the clean Stage Display (projected fullscreen on the downstage confidence monitor facing the presenter).',
      ],
      howItWorksTitle: 'How Multi-Window BroadcastChannel Synchronization Works',
      howItWorksBody: [
        'When you click "Open Stage Display", the second browser window connects to the Operator Console over the native HTML5 BroadcastChannel API and local storage state replication. Every play, pause, time adjustment, or text message transmits in under 1 millisecond—even if venue Wi-Fi drops completely.',
      ],
      calloutNote:
        'Hardware Setup: Set your operating system display settings to "Extend Desktop" (not Mirror) so the audience and speaker never see your mouse cursor or operator controls.',
      howToUseTitle: 'How to Set Up a Dual-Screen Confidence Monitor',
      howToUseSteps: [
        'Connect your laptop to the downstage monitor or video switcher via HDMI, DisplayPort, or SDI converter in Extended Desktop mode.',
        'Click "Open Stage Display" in the top bar of the Stage Timer.',
        'Drag the newly opened Stage Display window onto the secondary monitor and press F for borderless Fullscreen.',
        'Use the Operator Console on your main laptop screen to start/pause the clock and send silent text cues to the speaker.',
      ],
      featuresTitle: 'Live Backstage Messaging & Controls',
      featuresList: [
        'Instant Flash Messages: Send discreet prompts like "2 MINUTES LEFT", "START Q&A", or "HOLD FOR APPLAUSE" directly beneath the countdown digits.',
        'Works 100% Offline After Load: Because synchronization uses browser-native BroadcastChannel between windows on the same machine, congested conference Wi-Fi never causes lag.',
        'Color-Coded Urgency: Automatic Green, Amber, and Red phase transitions plus overtime count-up.',
      ],
      practicalExamples: [
        { icon: 'Tv', title: 'Conference Main Stages', description: 'Feed a clean HDMI countdown to downstage wedge monitors.' },
        { icon: 'Video', title: 'Livestream & OBS Production', description: 'Capture the Stage Display window as a multiview source in OBS or vMix.' },
        { icon: 'Users', title: 'Town Halls & Panels', description: 'Cue moderators silently when it is time to take audience questions.' },
        { icon: 'Mic', title: 'Awards & Gala Broadcasts', description: 'Keep acceptance speeches and presenters on a strict broadcast clock.' },
      ],
      whoBenefitsTitle: 'Who Uses the Stage Timer?',
      whoBenefitsList: [
        'AV engineers and live event production companies',
        'Conference stage managers and show callers',
        'Corporate town-hall and webinar producers',
        'House of worship and theater technical directors',
      ],
      tipsTitle: 'AV Technician Setup Tips',
      tipsList: [
        'Disable operating system notifications (Do Not Disturb / Focus Assist) before going live so pop-ups never appear on the extended display.',
        'Keep both the Operator Console and Stage Display open in the same browser profile (e.g., both in Chrome) so BroadcastChannel messages link automatically.',
      ],
      problemsTitle: 'Troubleshooting Multi-Display Setups',
      problemsRows: [
        { problem: 'Stage Display window not syncing', cause: 'Opened in an Incognito window or a different browser app', solution: 'Open both tabs in the same standard browser window/profile' },
        { problem: 'Operator controls visible on stage screen', cause: 'Display set to "Mirror / Duplicate" instead of "Extend"', solution: 'Switch OS Display Settings to "Extend These Displays"' },
      ],
    },
  },
  'toastmasters-timer': {
    heroSubtitle:
      'Time Table Topics, Icebreakers, Evaluations, and Prepared Speeches with official Green, Amber, and Red signal cards.',
    featurePills: ['Official Toastmasters rules', 'Green / Amber / Red card view', '30s contest grace window', 'Speech role presets'],
    quickPresets: [
      { icon: '🟢', label: '2 min', sublabel: 'Table Topics (1–2m)', sec: 120 },
      { icon: '🟡', label: '3 min', sublabel: 'Evaluation (2–3m)', sec: 180 },
      { icon: '🔴', label: '6 min', sublabel: 'Icebreaker (4–6m)', sec: 360 },
      { icon: '🏆', label: '7 min', sublabel: 'Prepared Speech (5–7m)', sec: 420 },
    ],
    steps: [
      { step: 1, title: 'Select speech category', description: 'Pick Table Topics (1–2m), Evaluation (2–3m), Icebreaker (4–6m), or Prepared (5–7m).' },
      { step: 2, title: 'Start when speaker begins', description: 'Click Start at the speaker’s first word or gesture.' },
      { step: 3, title: 'Show Green, Amber & Red cards', description: 'The background changes automatically at minimum, midpoint, and maximum times.' },
      { step: 4, title: 'Record timer report', description: 'Check total elapsed time and whether the speech qualified within the 30s grace window.' },
    ],
    guide: {
      tableOfContents: [
        'What Is the Toastmasters Timer?',
        'Official Toastmasters Timing Rules & Signal Thresholds',
        'How to Act as Timer Officer in a Meeting',
        'Contest Disqualification & the 30-Second Grace Period',
        'Practice & Club Meeting Scenarios',
        'Who Uses This Timer?',
        'Tips for Toastmasters Timers & Contestants',
        'Official Toastmasters Signal Reference Table',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is the Toastmasters Timer?',
      whatIsBody: [
        'The Toastmasters Timer is a specialized public-speaking timer built around Toastmasters International speech categories. One of the core meeting roles in every Toastmasters club is the Timer, who signals speakers using Green, Yellow (Amber), and Red visual indicators so members learn to express thoughts concisely within a defined time window.',
      ],
      howItWorksTitle: 'Official Toastmasters Timing Rules & Signal Thresholds',
      howItWorksBody: [
        'Unlike a standard countdown that only alerts at 00:00, Toastmasters timing tracks three milestones based on elapsed time: Green signals that the minimum qualifying time has been reached; Amber signals the midpoint (usually 30 to 60 seconds left); and Red signals the target maximum time.',
        'Once the Red signal is triggered at maximum time, the red card remains displayed until the speaker concludes—no audible bell is rung during official contests.',
      ],
      calloutNote:
        'Contest Disqualification Rule: In official speech contests, a speaker is disqualified if they speak less than 30 seconds under minimum time or more than 30 seconds over maximum time (for example, under 4:30 or over 7:30 in a 5–7 minute speech). For Table Topics (1–2m), the qualifying window is 1:00 to 2:30.',
      howToUseTitle: 'How to Act as Timer Officer in a Meeting',
      howToUseSteps: [
        'Choose the preset matching the current agenda item: Table Topics (1–2m), Speech Evaluation (2–3m), Icebreaker (4–6m), or Standard Prepared Speech (5–7m).',
        'Start the timer at the speaker’s first definite verbal or nonverbal communication with the audience.',
        'Use Fullscreen mode on a tablet or laptop facing the lectern (or share the window in Zoom for online clubs) so the entire screen acts as the Green, Amber, and Red signal card.',
        'Log the speaker’s exact finish time for the Timer’s Report at the end of the meeting.',
      ],
      featuresTitle: 'Contest Disqualification & the 30-Second Grace Period',
      featuresList: [
        'Table Topics (1 to 2 Minutes): Green at 1:00 · Amber at 1:30 · Red at 2:00 · Disqualified if < 1:00 or > 2:30.',
        'Speech Evaluation (2 to 3 Minutes): Green at 2:00 · Amber at 2:30 · Red at 3:00 · Disqualified if < 1:30 or > 3:30.',
        'Icebreaker Speech (4 to 6 Minutes): Green at 4:00 · Amber at 5:00 · Red at 6:00 · Disqualified if < 3:30 or > 6:30.',
        'Prepared Pathways Speech (5 to 7 Minutes): Green at 5:00 · Amber at 6:00 · Red at 7:00 · Disqualified if < 4:30 or > 7:30.',
      ],
      practicalExamples: [
        { icon: 'Trophy', title: 'Club & Area Speech Contests', description: 'Enforce exact Green/Amber/Red thresholds and 30s grace windows.' },
        { icon: 'Mic', title: 'Impromptu Table Topics', description: 'Train members to structure a 90-second impromptu answer.' },
        { icon: 'Video', title: 'Zoom & Hybrid Club Meetings', description: 'Use the fullscreen color card as a virtual camera background or shared tab.' },
        { icon: 'CheckSquare', title: 'Solo Speech Rehearsal', description: 'Practice hitting your conclusion right as the Amber light turns Red.' },
      ],
      whoBenefitsTitle: 'Who Uses This Timer?',
      whoBenefitsList: [
        'Toastmasters club Timer officers and Chief Judges',
        'Contestants rehearsing International, Humorous, or Evaluation speeches',
        'Public speaking coaches and communication classes',
        'Job candidates practicing 2-minute interview STAR responses',
      ],
      tipsTitle: 'Tips for Toastmasters Timers & Contestants',
      tipsList: [
        'Design your speech so your final call-to-action begins as soon as you see the Amber card at 6:00, giving you a stress-free 60-second buffer before Red.',
        'In online meetings, pin the Timer’s video feed so the Green/Amber/Red background stays visible without looking away from the webcam.',
      ],
      problemsTitle: 'Official Toastmasters Timing Chart',
      problemsRows: [
        { problem: 'Table Topics (1–2 min)', cause: 'Green 1:00 · Amber 1:30 · Red 2:00', solution: 'Qualifies between 1:00 and 2:30' },
        { problem: 'Evaluation (2–3 min)', cause: 'Green 2:00 · Amber 2:30 · Red 3:00', solution: 'Qualifies between 1:30 and 3:30' },
        { problem: 'Icebreaker (4–6 min)', cause: 'Green 4:00 · Amber 5:00 · Red 6:00', solution: 'Qualifies between 3:30 and 6:30' },
        { problem: 'Prepared Speech (5–7 min)', cause: 'Green 5:00 · Amber 6:00 · Red 7:00', solution: 'Qualifies between 4:30 and 7:30' },
      ],
    },
  },
  'debate-timer': {
    heroSubtitle:
      'Time British Parliamentary, World Schools, Public Forum, and Lincoln-Douglas debates with protected-time POI bells.',
    featurePills: ['Protected time indicators', '1:00 & 6:00 POI bell cues', 'BP / WSDC / LD presets', 'Overtime grace tracking'],
    quickPresets: [
      { icon: '⚖️', label: '7 min', sublabel: 'British Parliamentary', sec: 420 },
      { icon: '⚖️', label: '8 min', sublabel: 'World Schools (WSDC)', sec: 480 },
      { icon: '⚖️', label: '6 min', sublabel: 'LD Affirmative (1AC)', sec: 360 },
      { icon: '⚖️', label: '4 min', sublabel: 'Public Forum / Rebuttal', sec: 240 },
      { icon: '⚖️', label: '3 min', sublabel: 'Cross-Examination', sec: 180 },
    ],
    steps: [
      { step: 1, title: 'Select debate format', description: 'Choose British Parliamentary (7m), World Schools (8m), LD, or custom speech time.' },
      { step: 2, title: 'Start speech clock', description: 'Click Start when the debater begins speaking.' },
      { step: 3, title: 'Listen for POI bells', description: 'Single bells mark the end of opening protected time (1:00) and start of closing protected time.' },
      { step: 4, title: 'Enforce double bell & grace', description: 'A double bell sounds at 00:00, followed by a 15-second sentence-completion grace window.' },
    ],
    guide: {
      tableOfContents: [
        'What Is the Debate Timer?',
        'How Protected Time & Points of Information (POI) Work',
        'How to Time a Debate Round',
        'Standard Debate Format Timings',
        'Forensics & Classroom Use Cases',
        'Who Uses This Timer?',
        'Tips for Debate Adjudicators & Timekeepers',
        'Debate Format Reference Table',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is the Debate Timer?',
      whatIsBody: [
        'The Debate Timer is a forensics and parliamentary adjudication clock designed for university unions, high school speech and debate tournaments, and classroom debates. It automates protected-time windows and acoustic gavel/bell signals so judges can focus on evaluating arguments rather than watching a stopwatch.',
      ],
      howItWorksTitle: 'How Protected Time & Points of Information (POI) Work',
      howItWorksBody: [
        'In British Parliamentary (BP) and World Schools (WSDC) formats, the first 60 seconds and final 60 seconds of a constructive speech are "Protected Time"—opposing debaters are prohibited from rising to offer Points of Information (POIs).',
        'In a standard 7-minute BP speech: at 1:00 elapsed (6:00 remaining), a single bell rings to announce that POIs are now open. At 6:00 elapsed (1:00 remaining), a single bell rings to announce that protected time has resumed and POIs are closed. At 7:00 (0:00 remaining), a double bell rings to signal time is up.',
      ],
      calloutNote:
        '15-Second Grace Window: After the double bell at 7:00, adjudicators typically allow a 15-second grace window (until 7:15) for the speaker to finish their current sentence before penalizing or ignoring new arguments.',
      howToUseTitle: 'How to Time a Debate Round',
      howToUseSteps: [
        'Pick your tournament format preset (7m British Parliamentary, 8m World Schools, 6m Lincoln-Douglas 1AC, 4m Public Forum Constructive, or 3m Cross-X).',
        'Ensure audio is enabled so debaters hear the single and double bell transitions clearly.',
        'Click Start when the speaker begins and Reset between speakers.',
      ],
      featuresTitle: 'Standard Debate Format Timings',
      featuresList: [
        'British Parliamentary (BP): Eight 7-minute speeches (PM, LO, DPM, DLO, MG, MO, GW, OW) with POIs permitted between 1:00 and 6:00.',
        'World Schools (WSDC): Six 8-minute main speeches (POIs permitted between 1:00 and 7:00) plus two 4-minute reply speeches (no POIs allowed).',
        'Lincoln-Douglas (LD): 6m 1AC · 3m CX · 7m 1NC · 3m CX · 4m 1AR · 6m 1NR · 3m 2AR (plus 4 minutes prep time per debater).',
        'Public Forum (PF): 4m Constructives · 3m Crossfire · 4m Rebuttals · 3m Summary · 2m Final Focus.',
      ],
      practicalExamples: [
        { icon: 'Scale', title: 'Parliamentary Tournaments', description: 'Automate 1:00 and 6:00 POI bell cues for adjudicators.' },
        { icon: 'GraduationCap', title: 'High School Forensics', description: 'Time Lincoln-Douglas, Policy, and Public Forum rounds accurately.' },
        { icon: 'Users', title: 'Model UN & Mock Trial', description: 'Run moderated caucus speaker lists and opening statements.' },
        { icon: 'Mic', title: 'Classroom Civics Debates', description: 'Project the timer so student teams see protected vs. open questioning time.' },
      ],
      whoBenefitsTitle: 'Who Uses This Timer?',
      whoBenefitsList: [
        'University parliamentary debate adjudicators and wing judges',
        'High school speech and debate coaches and tournament tab rooms',
        'Model United Nations (MUN) committee chairs',
        'Law school moot court and mock trial timekeepers',
      ],
      tipsTitle: 'Tips for Debate Adjudicators & Timekeepers',
      tipsList: [
        'If a venue is noisy, supplement the acoustic bell with a visual tap on the table at 1:00 and 6:00.',
        'Remember that reply/whip summary speeches in WSDC (4 minutes) are 100% protected time with zero POIs.',
      ],
      problemsTitle: 'Debate Bell Schedule Reference (7-Minute BP Speech)',
      problemsRows: [
        { problem: '0:00 – 1:00 Elapsed (7:00 – 6:00 Left)', cause: 'Opening Protected Time', solution: 'No POIs allowed; 1 bell rings at 1:00' },
        { problem: '1:00 – 6:00 Elapsed (6:00 – 1:00 Left)', cause: 'Unprotected Main Speech Window', solution: 'Opponents may offer 15-second POIs; 1 bell rings at 6:00' },
        { problem: '6:00 – 7:00 Elapsed (1:00 – 0:00 Left)', cause: 'Closing Protected Time', solution: 'No POIs allowed; 2 bells ring at 7:00' },
        { problem: '7:00 – 7:15 Elapsed (+0:15 Overtime)', cause: 'Grace Period Expired at 7:15', solution: 'Continuous triple bell; adjudicators stop taking notes' },
      ],
    },
  },
  'sermon-timer': {
    heroSubtitle:
      'Discreet blackout pulpit countdown timer for pastors, ministry teams, and multi-service worship schedules.',
    featurePills: ['Low-glare sanctuary dark theme', 'Silent visual wrap-up cues', 'Graceful overtime counter', 'Zero jarring alarms'],
    quickPresets: [
      { icon: '⛪', label: '20 min', sublabel: 'Homily', sec: 1200 },
      { icon: '⛪', label: '30 min', sublabel: 'Sunday Message', sec: 1800 },
      { icon: '⛪', label: '35 min', sublabel: 'Standard Sermon', sec: 2100 },
      { icon: '⛪', label: '45 min', sublabel: 'Teaching Series', sec: 2700 },
    ],
    steps: [
      { step: 1, title: 'Select message duration', description: 'Choose 20, 30, 35, or 45 minutes to match your service run sheet.' },
      { step: 2, title: 'Mute audio for sanctuary', description: 'Keep silent mode active so only visual color cues appear at the pulpit.' },
      { step: 3, title: 'Launch Fullscreen', description: 'Display on the rear wall confidence monitor or lectern iPad.' },
      { step: 4, title: 'Watch gentle wrap-up cues', description: 'Amber at 5 minutes left and red at 1 minute left guide a smooth closing.' },
    ],
    guide: {
      tableOfContents: [
        'What Is the Sermon Timer?',
        'How Silent Sanctuary Visual Cues Work',
        'How to Use the Sermon Timer in Worship Services',
        'Keeping Multi-Service Sunday Schedules on Time',
        'Ministry & Event Use Cases',
        'Who Uses This Timer?',
        'Tips for Church Media & Production Teams',
        'Service Segment Timing Guide',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is the Sermon Timer?',
      whatIsBody: [
        'The Sermon Timer is a low-glare, silent visual countdown clock tailored for pastors, speakers, and house-of-worship AV teams. When a church runs multiple back-to-back Sunday services (such as 9:00 AM and 11:00 AM) with parking-lot turnover and children’s ministry check-in, keeping the message on schedule is essential—yet an audible alarm in a sanctuary is out of the question.',
      ],
      howItWorksTitle: 'How Silent Sanctuary Visual Cues Work',
      howItWorksBody: [
        'Designed for dark auditoriums and stage monitors, the display uses calm, high-contrast digits that transition to warm Amber with 5 minutes remaining (signaling time to begin the closing application or prayer) and soft Red in the final minute. If the message extends past 00:00, it counts up silently so the worship band and media booth know exact elapsed overtime.',
      ],
      calloutNote:
        'Tip: For control-room-to-stage syncing where the media booth starts the clock remotely, pair this with our dual-window Stage Timer.',
      howToUseTitle: 'How to Use the Sermon Timer in Worship Services',
      howToUseSteps: [
        'Set the allocated sermon or homily duration (e.g., 30 or 35 minutes).',
        'Verify that the audio chime is muted for silent sanctuary operation.',
        'Place the tablet on the pulpit or project onto the rear-balcony confidence screen in Fullscreen mode.',
      ],
      featuresTitle: 'Keeping Multi-Service Sunday Schedules on Time',
      featuresList: [
        'Zero-Glare Dark Interface: Prevents bright white screen spill on the speaker’s face during video broadcast.',
        'Silent Overtime Tracking: Counts up past 00:00 without flashing aggressively or sounding a buzzer.',
        'Always-On Screen Wake Lock: Ensures an iPad or laptop on the lectern never locks during a 40-minute message.',
      ],
      practicalExamples: [
        { icon: 'Church', title: 'Sunday Morning Sermons', description: 'Keep 9:00 AM and 11:00 AM services aligned for smooth lobby and parking turnover.' },
        { icon: 'Video', title: 'Livestream Broadcasts', description: 'Coordinate message wrap-up with online hosts and worship team cues.' },
        { icon: 'Users', title: 'Youth & Small Group Talks', description: 'Reserve enough time after the teaching block for small-group discussion.' },
        { icon: 'Mic', title: 'Weddings, Funerals & Ceremonies', description: 'Provide discreet pacing for officiants and eulogies.' },
      ],
      whoBenefitsTitle: 'Who Uses This Timer?',
      whoBenefitsList: [
        'Pastors, rabbis, imams, and ceremonial officiants',
        'Church production directors and volunteer media teams',
        'Worship leaders coordinating musical transitions',
        'Chaplains and seminary preaching students',
      ],
      tipsTitle: 'Tips for Church Media & Production Teams',
      tipsList: [
        'Start the sermon timer right as the welcome prayer finishes so the speaker gets their full teaching window.',
        'Agree with the speaker beforehand that Amber (5 minutes left) is the cue to transition to the final point.',
      ],
      problemsTitle: 'Typical 65-Minute Worship Service Run Sheet',
      problemsRows: [
        { problem: 'Welcome & Worship Set (22 min)', cause: '3–4 congregational songs + greeting', solution: '00:00 to 22:00 of service' },
        { problem: 'Announcements & Offering (5 min)', cause: 'Video or host transition', solution: '22:00 to 27:00 of service' },
        { problem: 'Sermon / Message (33 min)', cause: 'Main teaching block', solution: 'Amber cue at 5:00 left (28m elapsed)' },
        { problem: 'Closing Song & Benediction (5 min)', cause: 'Dismissal & 25-min lobby turnover', solution: 'Service concludes on time at 65:00' },
      ],
    },
  },
  'classroom-timer': {
    heroSubtitle:
      'Project a clear, student-friendly visual countdown on your classroom smartboard for centers, quizzes, and transitions.',
    featurePills: ['Back-row smartboard visibility', 'Shrinking visual progress ring', 'Gentle bell or silent mode', 'Zero student data collected'],
    quickPresets: [
      { icon: '🔔', label: '2 min', sublabel: 'Clean-Up Transition', sec: 120 },
      { icon: '✏️', label: '5 min', sublabel: 'Bell Ringer / Warm-Up', sec: 300 },
      { icon: '🗣️', label: '10 min', sublabel: 'Think-Pair-Share', sec: 600 },
      { icon: '📖', label: '15 min', sublabel: 'Silent Reading (SSR)', sec: 900 },
      { icon: '🧪', label: '25 min', sublabel: 'Station Rotation', sec: 1500 },
    ],
    steps: [
      { step: 1, title: 'Pick an activity preset', description: 'Select Clean-Up (2m), Warm-Up (5m), Group Work (10m), or Reading (15m).' },
      { step: 2, title: 'Project in Fullscreen (F)', description: 'Display on your classroom projector or interactive whiteboard.' },
      { step: 3, title: 'Students watch visual ring', description: 'Learners see remaining time at a glance from the shrinking ring.' },
      { step: 4, title: 'Chime signals transition', description: 'A gentle acoustic bell rings at 00:00 (or run silently for exams).' },
    ],
    guide: {
      tableOfContents: [
        'What Is the Classroom Timer?',
        'How Visual Timeboxing Helps Students Self-Regulate',
        'How to Use the Classroom Timer on a Smartboard',
        'Popular Classroom Timing Routines',
        'Grade-Level Applications',
        'Who Uses This Timer?',
        'Classroom Management Tips for Teachers',
        'Instructional Block Timing Guide',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is the Classroom Timer?',
      whatIsBody: [
        'The Classroom Timer is a large-format visual and numeric countdown built for K–12 classrooms, university seminars, and training workshops. Projected on an interactive whiteboard or screen, it combines oversized digits with a shrinking progress ring so students of all ages can see how much time remains without repeatedly asking "How many minutes left?"',
      ],
      howItWorksTitle: 'How Visual Timeboxing Helps Students Self-Regulate',
      howItWorksBody: [
        'Abstract time announcements ("You have 10 minutes left") are difficult for young learners and students engrossed in group work to judge. By displaying a continuous circular arc that shrinks proportionally with every second, students develop executive-function pacing and transition between activities with less friction.',
      ],
      calloutNote:
        'Privacy Guarantee: This classroom tool runs 100% in your browser with zero accounts, zero cookies, and zero student personal data (COPPA/FERPA safe).',
      howToUseTitle: 'How to Use the Classroom Timer on a Smartboard',
      howToUseSteps: [
        'Click a classroom preset (2m Transition, 5m Do-Now, 10m Group Discussion, 15m Independent Reading) or set a custom duration.',
        'Press F to expand the timer to Fullscreen on your smartboard or projector.',
        'Toggle the sound icon off during quiet testing, or keep it on for a pleasant chime when station rotations end.',
      ],
      featuresTitle: 'Popular Classroom Timing Routines',
      featuresList: [
        '5-Minute "Do Now" / Bell Ringer: Start the 5-minute clock as the bell rings so students settle in and complete their warm-up prompt.',
        '2-Minute Supply & Clean-Up Transition: Turn desk clean-up and material handoffs into a brisk 120-second challenge.',
        '12-Minute Learning Station Rotations: Enable Loop mode to run three back-to-back 12-minute literacy or science lab stations.',
        '15-Minute Sustained Silent Reading (SSR): Mute audio chimes and let the visual ring pace quiet independent reading.',
      ],
      practicalExamples: [
        { icon: 'GraduationCap', title: 'Elementary Centers', description: 'Guide smooth literacy and math station rotations.' },
        { icon: 'Users', title: 'Think-Pair-Share', description: 'Time 2 minutes of solo thinking followed by 4 minutes of partner sharing.' },
        { icon: 'CheckSquare', title: 'Timed Quizzes & Exit Tickets', description: 'Give students a clear 5-minute or 10-minute end-of-class check.' },
        { icon: 'Palette', title: 'Art & Lab Clean-Up', description: 'Ensure brushes, beakers, and laptops are stowed before the bell.' },
      ],
      whoBenefitsTitle: 'Who Uses This Timer?',
      whoBenefitsList: [
        'Elementary, middle, and high school teachers',
        'Special education teachers and instructional aides',
        'University professors and lab instructors',
        'Corporate trainers and workshop facilitators',
      ],
      tipsTitle: 'Classroom Management Tips for Teachers',
      tipsList: [
        'Pair the Classroom Timer with our Random Group Generator and Classroom Noise Meter for complete group-work management.',
        'For younger elementary students who prefer playful themes, explore our Rainbow Timer, Bubble Timer, or Picture Reveal Timer.',
      ],
      problemsTitle: 'Recommended Classroom Activity Durations',
      problemsRows: [
        { problem: 'Transition / Clean-Up', cause: 'Preventing downtime between tasks', solution: '1 to 3 minutes' },
        { problem: 'Bell Ringer / Exit Ticket', cause: 'Opening or closing formative check', solution: '3 to 5 minutes' },
        { problem: 'Small-Group Station', cause: '3 rotations in a 45-minute period', solution: '10 to 12 minutes per station' },
        { problem: 'Independent Practice / Reading', cause: 'Sustained solo concentration', solution: '15 to 25 minutes' },
      ],
    },
  },
  'webinar-timer': {
    heroSubtitle:
      'Keep virtual events, Zoom workshops, and livestreams on schedule across intro, keynote, demo, and live Q&A segments.',
    featurePills: ['Agenda segment tracking', 'OBS & StreamYard friendly', 'Private host audio cues', 'Overtime protection'],
    quickPresets: [
      { icon: '🎥', label: '5 min', sublabel: 'Stream Starting Soon', sec: 300 },
      { icon: '🎥', label: '15 min', sublabel: 'Live Q&A Block', sec: 900 },
      { icon: '🎥', label: '30 min', sublabel: 'Fireside Webinar', sec: 1800 },
      { icon: '🎥', label: '45 min', sublabel: 'Workshop Main', sec: 2700 },
      { icon: '🎥', label: '60 min', sublabel: 'Full Webinar', sec: 3600 },
    ],
    steps: [
      { step: 1, title: 'Set segment or webinar length', description: 'Pick 5m Starting Soon, 30m Keynote, 15m Q&A, or custom.' },
      { step: 2, title: 'Position beside webcam', description: 'Place the timer window near the top of your screen so you maintain eye contact.' },
      { step: 3, title: 'Capture in OBS (optional)', description: 'Use Window Capture to show a Starting Soon or Break countdown on stream.' },
      { step: 4, title: 'Pivot to Q&A on cue', description: 'Wrap up slides when the Amber warning appears so audience Q&A is never cut.' },
    ],
    guide: {
      tableOfContents: [
        'What Is the Webinar Timer?',
        'How Virtual Event Pacing Works',
        'How to Use the Webinar Timer with Zoom, Teams & OBS',
        'Sample 60-Minute Webinar Run-of-Show',
        'Virtual Production Use Cases',
        'Who Uses This Timer?',
        'Tips for Webinar Hosts & Moderators',
        'Webinar Segment Timing Reference',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is the Webinar Timer?',
      whatIsBody: [
        'The Webinar Timer is a virtual-event countdown clock designed for Zoom webinars, Microsoft Teams town halls, YouTube livestreams, and online workshops. Because remote audiences drop off sharply when a webinar runs past the top of the hour or skips promised Q&A, keeping each segment on a strict clock is critical.',
      ],
      howItWorksTitle: 'How Virtual Event Pacing Works',
      howItWorksBody: [
        'You can run the Webinar Timer either privately on your host monitor (positioned right below your webcam lens so your eyes stay on the camera) or publicly inside an OBS / StreamYard / Zoom screen share during "Starting Soon" lobbies and workshop breakout exercises.',
      ],
      calloutNote:
        'Sample 60-Minute Webinar Formula: 5m Welcome & Housekeeping + 30m Presentation/Demo + 15m Audience Q&A + 5m Call-to-Action + 5m Buffer (End at :55).',
      howToUseTitle: 'How to Use the Webinar Timer with Zoom, Teams & OBS',
      howToUseSteps: [
        'Choose your segment duration (for example, 5 minutes for a pre-show lobby countdown or 35 minutes for the main presentation).',
        'If using as a private host confidence clock, keep the window compact near the top bezel of your monitor.',
        'If displaying to attendees during a workshop exercise, press F for Fullscreen and share that browser tab.',
      ],
      featuresTitle: 'Sample 60-Minute Webinar Run-of-Show',
      featuresList: [
        '00:00 – 05:00 (5 min): Lobby "Starting Soon" countdown + host welcome and poll.',
        '05:00 – 35:00 (30 min): Core presentation and live product demonstration.',
        '35:00 – 50:00 (15 min): Moderated live audience Q&A.',
        '50:00 – 55:00 (5 min): Next steps, resource links, and on-time wrap-up 5 minutes before the hour.',
      ],
      practicalExamples: [
        { icon: 'Video', title: 'Pre-Stream Starting Soon', description: 'Run a 5-minute countdown while attendees join the livestream.' },
        { icon: 'Users', title: 'Virtual Panel Discussions', description: 'Give each remote panelist a fair 3-minute response window.' },
        { icon: 'Monitor', title: 'Interactive Zoom Workshops', description: 'Project a 10-minute timer during live participant exercises.' },
        { icon: 'Mic', title: 'Podcast & Fireside Recordings', description: 'Keep guest interviews inside a crisp 45-minute recording block.' },
      ],
      whoBenefitsTitle: 'Who Uses This Timer?',
      whoBenefitsList: [
        'Demand-generation and product marketing webinar hosts',
        'Virtual instructor-led training (VILT) facilitators',
        'YouTube, Twitch, and LinkedIn Live broadcasters',
        'Remote executive communication producers',
      ],
      tipsTitle: 'Tips for Webinar Hosts & Moderators',
      tipsList: [
        'End 60-minute webinars at the 55-minute mark so attendees can make their next meeting without dropping off before your final call to action.',
        'Keep "Share Computer Sound" unchecked in Zoom if you want audio chimes to play only in your host headset.',
      ],
      problemsTitle: 'Virtual Event Timing Reference',
      problemsRows: [
        { problem: 'Pre-Show Lobby', cause: 'Allowing latecomers to connect audio', solution: '3 to 5 minutes before host intro' },
        { problem: '30-Minute Micro-Webinar', cause: 'Fast product demo + Q&A', solution: '2m Intro · 18m Demo · 8m Q&A · 2m Wrap' },
        { problem: '60-Minute Masterclass', cause: 'Deep dive + live Q&A', solution: '5m Intro · 35m Content · 15m Q&A · 5m Buffer' },
      ],
    },
  },
  'event-countdown-timer': {
    heroSubtitle:
      'Count down exact days, hours, minutes, and seconds to any future launch, conference, holiday, or milestone.',
    featurePills: ['Days / Hours / Min / Sec', 'UTC & timezone accurate', 'Shareable URL parameters', 'Fullscreen lobby mode'],
    quickPresets: [],
    steps: [
      { step: 1, title: 'Enter event name', description: 'Type the title of your launch, conference, exam, or holiday.' },
      { step: 2, title: 'Pick target date & time', description: 'Select the exact calendar date and clock time.' },
      { step: 3, title: 'Launch Fullscreen', description: 'Display on lobby screens, livestream overlays, or project TVs.' },
      { step: 4, title: 'Share or bookmark', description: 'Copy the link so teammates see the same live countdown.' },
    ],
    guide: {
      tableOfContents: [
        'What Is the Event Countdown Timer?',
        'How Target-Date Epoch Math Works',
        'How to Create a Live Event Countdown',
        'Practical Event & Milestone Ideas',
        'Where to Display Your Countdown',
        'Who Uses This Timer?',
        'Tips for Event Organizers',
        'Time Unit Breakdown Reference',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is the Event Countdown Timer?',
      whatIsBody: [
        'The Event Countdown Timer tracks the exact number of Days, Hours, Minutes, and Seconds remaining until any future calendar date and clock time. Unlike a simple duration timer that counts down a set number of minutes, an event countdown anchors to a specific calendar moment and updates continuously in real time.',
      ],
      howItWorksTitle: 'How Target-Date Epoch Math Works',
      howItWorksBody: [
        'Formula: Remaining Milliseconds (Δ) = Target Date Timestamp − Current System Timestamp. From Δ, the timer computes: Days = Math.floor(Δ ÷ 86,400,000); Hours = Math.floor((Δ mod 86,400,000) ÷ 3,600,000); Minutes = Math.floor((Δ mod 3,600,000) ÷ 60,000); Seconds = Math.floor((Δ mod 60,000) ÷ 1,000).',
        'Because it compares real timestamps rather than decrementing a counter, you can close your laptop and reopen the page days later and the countdown will be accurate to the second.',
      ],
      calloutNote:
        'Worked Example: A target event exactly 100 hours away displays as 4 Days, 04 Hours, 00 Minutes, 00 Seconds (since 4 × 24 = 96 hours + 4 hours = 100 hours).',
      howToUseTitle: 'How to Create a Live Event Countdown',
      howToUseSteps: [
        'Type a custom Event Title (such as "Product Launch v2.0", "Annual Summit Doors Open", or "Final Exam").',
        'Select the target Date and Time using the calendar picker.',
        'Press F to enter Fullscreen mode for lobby displays, war rooms, or livestream scenes.',
      ],
      featuresTitle: 'Practical Event & Milestone Ideas',
      featuresList: [
        'Software Releases & Code Freezes: Project a live countdown to production deployment in your engineering area.',
        'Conferences & Trade Shows: Display the countdown to keynote doors opening on venue foyer monitors.',
        'Academic Deadlines & Exams: Track days and hours until thesis submission or certification testing.',
        'Holidays, Weddings & Celebrations: Count down to New Year’s midnight, vacations, or retirement dates.',
      ],
      practicalExamples: [
        { icon: 'Calendar', title: 'Product Launches', description: 'Keep engineering and marketing aligned to the exact launch hour.' },
        { icon: 'Tv', title: 'Venue Lobby Screens', description: 'Show attendees how many minutes remain until keynote doors open.' },
        { icon: 'GraduationCap', title: 'Exam & Submission Deadlines', description: 'Visualize remaining study days and hours before finals.' },
        { icon: 'Sparkles', title: 'New Year & Holiday Clocks', description: 'Project a fullscreen midnight countdown at parties and events.' },
      ],
      whoBenefitsTitle: 'Who Uses This Timer?',
      whoBenefitsList: [
        'Event producers and conference organizers',
        'Software engineering leads and release managers',
        'Teachers and students tracking project deadlines',
        'Families counting down to trips, weddings, and holidays',
      ],
      tipsTitle: 'Tips for Event Organizers',
      tipsList: [
        'Verify whether your target time is in your local time zone or UTC when coordinating international launches.',
        'Use our Embeddable Timer Widgets if you want to embed a countdown directly inside a Notion page or website.',
      ],
      problemsTitle: 'Days-to-Hours Conversion Reference',
      problemsRows: [
        { problem: '1 Day / 2 Days / 3 Days', cause: '24 hours per day', solution: '24 hrs / 48 hrs / 72 hrs' },
        { problem: '7 Days (1 Week)', cause: '7 × 24 hours', solution: '168 hours / 10,080 minutes' },
        { problem: '14 Days (2 Weeks)', cause: '14 × 24 hours', solution: '336 hours / 20,160 minutes' },
        { problem: '30 Days (Approx. 1 Month)', cause: '30 × 24 hours', solution: '720 hours / 43,200 minutes' },
      ],
    },
  },
  'stopwatch': {
    heroSubtitle:
      'Measure elapsed time to millisecond precision with lap splits, fastest/slowest lap highlighting, and CSV export.',
    featurePills: ['High-resolution performance.now()', 'Lap & split time table', 'Fastest & slowest lap badges', 'One-click CSV export'],
    quickPresets: [],
    steps: [
      { step: 1, title: 'Press Start (Spacebar)', description: 'Begin counting up immediately with millisecond resolution.' },
      { step: 2, title: 'Record Laps (L key)', description: 'Click Lap at each interval to log individual lap and cumulative split times.' },
      { step: 3, title: 'Compare lap pace', description: 'Green highlights your fastest lap; Amber marks your slowest lap.' },
      { step: 4, title: 'Export to CSV', description: 'Copy or download your complete lap table for analysis.' },
    ],
    guide: {
      tableOfContents: [
        'What Is the Online Stopwatch?',
        'How High-Resolution Timestamp Timing Works',
        'How to Use the Stopwatch & Lap Timer',
        'Lap Time vs. Split Time Explained',
        'Sports, Lab & Usability Testing Uses',
        'Who Uses This Stopwatch?',
        'Tips for Accurate Split Timing',
        'Stopwatch Metric Definitions',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is the Online Stopwatch?',
      whatIsBody: [
        'The Online Stopwatch is a high-precision count-up timer that measures elapsed time in hours, minutes, seconds, and milliseconds (HH:MM:SS.ms). It includes a live lap and split recorder that automatically flags your fastest and slowest laps and exports data to CSV.',
      ],
      howItWorksTitle: 'How High-Resolution Timestamp Timing Works',
      howItWorksBody: [
        'Rather than adding 10ms on every animation frame (which drifts when a browser tab is busy), the stopwatch records the monotonic hardware timestamp via performance.now() when you press Start. On every screen refresh, Elapsed Time = CurrentTimestamp − StartTimestamp + AccumulatedPausedTime.',
        'This architecture guarantees zero cumulative drift—even across multi-hour timing sessions or when you switch to another browser tab.',
      ],
      calloutNote:
        'Keyboard Shortcuts: Press Spacebar to Start/Stop, L to record a Lap while running, R to Reset, and F for Fullscreen.',
      howToUseTitle: 'How to Use the Stopwatch & Lap Timer',
      howToUseSteps: [
        'Click Start or press the Spacebar to begin timing from 00:00.00.',
        'Press the Lap button (or L key) each time a lap, repetition, or task step finishes.',
        'Inspect the Lap Table below the clock to compare individual lap durations against cumulative split time.',
        'Click "Export CSV" or "Copy Laps" to save your timing log into Excel or Google Sheets.',
      ],
      featuresTitle: 'Lap Time vs. Split Time Explained',
      featuresList: [
        'Lap Duration (Delta Time): The exact time taken for a single lap: Lap(n) = Split(n) − Split(n − 1).',
        'Split Time (Cumulative Time): The total elapsed time from 00:00.00 up to the end of Lap(n).',
        'Worked Example: If you press Lap at 01:12.40 (Lap 1) and again at 02:28.90 (Split 2), then Lap 2 Duration = 02:28.90 − 01:12.40 = 01:16.50.',
        'Automatic Pace Analysis: Once 2 or more laps are recorded, the table highlights the minimum lap duration in Green (Fastest) and maximum in Amber (Slowest).',
      ],
      practicalExamples: [
        { icon: 'Flame', title: 'Track & Swim Splits', description: 'Record 400m track laps or 100m pool splits with pace comparison.' },
        { icon: 'Monitor', title: 'UX & Usability Benchmarking', description: 'Measure time-on-task for user interface workflows and QA tests.' },
        { icon: 'GraduationCap', title: 'Physics & Science Labs', description: 'Time pendulum periods, chemical reactions, and kinematics trials.' },
        { icon: 'Mic', title: 'Speech & Speedrun Timing', description: 'Clock rehearsal runtimes and segment checkpoints.' },
      ],
      whoBenefitsTitle: 'Who Uses This Stopwatch?',
      whoBenefitsList: [
        'Track coaches, swimmers, cyclists, and fitness trainers',
        'UX researchers and QA engineers measuring task completion times',
        'Science teachers and laboratory students',
        'Debaters and speakers timing rehearsal segments',
      ],
      tipsTitle: 'Tips for Accurate Split Timing',
      tipsList: [
        'Use the keyboard (Spacebar and L key) rather than a laptop trackpad for faster, more consistent finger reaction when logging laps.',
        'If you need to time multiple athletes or lanes at the same time, switch to our Multi Stopwatch.',
      ],
      problemsTitle: 'Stopwatch Terminology Reference',
      problemsRows: [
        { problem: 'Elapsed Time', cause: 'Total running time since Start', solution: 'Displayed in main oversized digits' },
        { problem: 'Lap Time', cause: 'Duration of a single individual segment', solution: 'Split(n) − Split(n−1)' },
        { problem: 'Split Time', cause: 'Cumulative total time at checkpoint n', solution: 'Sum of all laps from 1 through n' },
      ],
    },
  },
  'multi-stopwatch': {
    heroSubtitle:
      'Run multiple independent lane stopwatches simultaneously with mass Start All, sequential Relay Mode, and CSV export.',
    featurePills: ['Simultaneous mass start', 'Sequential Relay Handoff mode', 'Individual lap tracking', 'CSV results export'],
    quickPresets: [],
    steps: [
      { step: 1, title: 'Configure lanes/participants', description: 'Edit lane names or add new participant stopwatches.' },
      { step: 2, title: 'Click Start All (or individual)', description: 'Launch all lanes at the exact same millisecond or start staggered heats.' },
      { step: 3, title: 'Optional: Enable Relay Mode', description: 'When Relay Mode is ON, stopping Lane 1 automatically starts Lane 2.' },
      { step: 4, title: 'Export race results CSV', description: 'Download ranks, total times, and lap counts in one spreadsheet.' },
    ],
    guide: {
      tableOfContents: [
        'What Is the Multi Stopwatch?',
        'How Mass Start & Relay Handoff Timing Work',
        'How to Time Multiple Participants',
        'Worked Relay & Race Examples',
        'Coaching, Lab & Classroom Use Cases',
        'Who Uses the Multi Stopwatch?',
        'Tips for Multi-Lane Timing',
        'Operating Modes Comparison',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is the Multi Stopwatch?',
      whatIsBody: [
        'The Multi Stopwatch lets you run, lap, and stop multiple independent stopwatches on a single screen. Instead of juggling three separate phones or physical stopwatches during a track heat, swim practice, or lab experiment, you can manage every participant from one unified dashboard.',
      ],
      howItWorksTitle: 'How Mass Start & Relay Handoff Timing Work',
      howItWorksBody: [
        'Mass Start ("Start All"): Clicking Start All assigns the exact same high-resolution timestamp to every non-running lane simultaneously, eliminating human thumb delay between lanes. Each lane can then be lapped and stopped independently as participants cross the finish line.',
        'Relay Mode: When Relay Mode is toggled ON, stopping Participant N immediately triggers Start on Participant N+1 at the exact same millisecond—ideal for 4×100m or 4×400m relay leg splits and pit-stop handoffs.',
      ],
      calloutNote:
        'CSV Export includes Participant Name, Final Elapsed Time, Total Laps, Fastest Lap, and Average Lap for instant spreadsheet sorting.',
      howToUseTitle: 'How to Time Multiple Participants',
      howToUseSteps: [
        'Rename the default lanes (or click "+ Add Stopwatch" to add more participants).',
        'For a simultaneous race, click "Start All" at the starting whistle, then click "Stop" on each card as that person finishes.',
        'For a relay team, toggle "Relay Mode" ON, start Runner 1, and click Stop on Runner 1 at the baton pass to automatically start Runner 2.',
        'Click "Export CSV" to save all lane times and splits.',
      ],
      featuresTitle: 'Worked Relay & Race Examples',
      featuresList: [
        '4×400m Track Relay: Enable Relay Mode for 4 runners. Leg 1 (54.20s) + Leg 2 (55.80s) + Leg 3 (53.90s) + Leg 4 (52.60s) = 3:36.50 total team time with exact individual leg splits.',
        'Staggered Time-Trial Starts: Start Lane 1 at 0:00, start Lane 2 thirty seconds later, and compare net elapsed times fairly.',
        'Multi-Beaker Chemistry Trials: Track 4 concurrent reaction vessels started at different moments on one lab tablet.',
      ],
      practicalExamples: [
        { icon: 'Flame', title: 'Track & Swim Heats', description: 'Start 6 lanes together and stop each swimmer or runner at the wall.' },
        { icon: 'Users', title: 'Relay Baton Splits', description: 'Use Relay Mode to chain leg 1 → leg 2 → leg 3 → leg 4 seamlessly.' },
        { icon: 'GraduationCap', title: 'Science Lab Stations', description: 'Monitor multiple concurrent chemical or biological timers.' },
        { icon: 'CheckSquare', title: 'Classroom Fluency Checks', description: 'Track completion times across multiple student groups.' },
      ],
      whoBenefitsTitle: 'Who Uses the Multi Stopwatch?',
      whoBenefitsList: [
        'Track, cross-country, rowing, and swimming coaches',
        'Physical education (PE) teachers timing class fitness tests',
        'Laboratory researchers running parallel assays',
        'Motorsport and engineering teams timing pit or assembly stages',
      ],
      tipsTitle: 'Tips for Multi-Lane Timing',
      tipsList: [
        'On touchscreens (iPads/tablets), arrange the screen in landscape orientation so you can tap multiple Stop buttons with two hands as finishers cross close together.',
      ],
      problemsTitle: 'Multi Stopwatch Modes Comparison',
      problemsRows: [
        { problem: 'Mass Start ("Start All")', cause: 'All participants start at the same gun', solution: 'Click Start All once; tap Stop individually at finish' },
        { problem: 'Staggered Start', cause: 'Participants start one by one', solution: 'Click Start on each lane card as that person begins' },
        { problem: 'Relay Mode ON', cause: 'Sequential team handoffs', solution: 'Stopping Lane N automatically starts Lane N+1' },
      ],
    },
  },
  'interval-timer': {
    heroSubtitle:
      'Program custom warm-up, work, rest, sets, and cool-down intervals with 3-2-1 audio countdowns and color-coded phases.',
    featurePills: ['Custom Work / Rest / Rounds', 'Warm-up & Cool-down stages', '3-2-1 acoustic transition cues', 'Color-coded WORK vs REST'],
    quickPresets: [
      { icon: '🔥', label: '4 min', sublabel: 'Tabata (8 × 20s/10s)', sec: 240 },
      { icon: '💪', label: '10 min', sublabel: 'EMOM (10 × 45s/15s)', sec: 600 },
      { icon: '🏃', label: '15 min', sublabel: 'HIIT (10 × 60s/30s)', sec: 900 },
      { icon: '🥊', label: '12 min', sublabel: '3 × 3m Boxing Rounds', sec: 720 },
    ],
    steps: [
      { step: 1, title: 'Set Work, Rest & Rounds', description: 'Configure Warm-up, Work seconds, Rest seconds, Rounds, and Cool-down.' },
      { step: 2, title: 'Start interval cycle', description: 'Click Start to begin with the preparation countdown.' },
      { step: 3, title: 'Follow Green & Amber cues', description: 'Green indicates active WORK; Amber indicates recovery REST.' },
      { step: 4, title: 'Listen for 3-2-1 beeps', description: 'Acoustic warning ticks alert you 3 seconds before every phase change.' },
    ],
    guide: {
      tableOfContents: [
        'What Is the Interval Timer?',
        'Formula: How Total Interval Workout Time Is Calculated',
        'How to Configure Custom Work & Rest Cycles',
        'Popular Interval Training Protocols (HIIT, EMOM, Circuit)',
        'Fitness, Rehab & Study Applications',
        'Who Uses the Interval Timer?',
        'Tips for Effective Interval Pacing',
        'Work-to-Rest Ratio Reference Table',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is the Interval Timer?',
      whatIsBody: [
        'The Interval Timer is a programmable multi-phase countdown clock that alternates automatically between active Work periods and recovery Rest periods for a set number of rounds, bracketed by optional Warm-up and Cool-down phases.',
      ],
      howItWorksTitle: 'Formula: How Total Interval Workout Time Is Calculated',
      howItWorksBody: [
        'Formula: Total Session Seconds = WarmUp + (Rounds × Work) + ((Rounds − 1) × Rest) + CoolDown (or Rounds × (Work + Rest) if a rest period is included after the final round).',
        'Worked Example: A 10-round circuit with a 60-second Warm-up, 40 seconds Work, 20 seconds Rest, and a 60-second Cool-down equals: 60 + (10 × 60) + 60 = 720 seconds = 12 minutes 00 seconds total.',
      ],
      calloutNote:
        '3-2-1 Transition Cues: Short acoustic ticks sound at 03, 02, and 01 seconds remaining so you can get into position for the next set without staring at the screen.',
      howToUseTitle: 'How to Configure Custom Work & Rest Cycles',
      howToUseSteps: [
        'Set your Warm-up seconds, Work duration, Rest duration, total Rounds, and Cool-down.',
        'Press Start (or Spacebar) and launch Fullscreen (F) if working out across the room.',
        'Watch the phase banner switch between PREP (Blue), WORK (Green), REST (Amber), and COOL DOWN.',
      ],
      featuresTitle: 'Popular Interval Training Protocols (HIIT, EMOM, Circuit)',
      featuresList: [
        'Classic Tabata (2:1 Ratio): 8 rounds of 20s maximum effort Work / 10s Rest = 4 minutes.',
        '40/20 Conditioning Circuit (2:1 Ratio): 10 to 15 rounds of 40s Work / 20s Rest (1 round per minute).',
        '30/30 Aerobic Interval (1:1 Ratio): 10 to 20 rounds of 30s Work / 30s Rest for sustainable pacing.',
        'Physical Therapy & Mobility Holds: 5 rounds of 45s stretch hold / 15s position switch.',
      ],
      practicalExamples: [
        { icon: 'Flame', title: 'HIIT & CrossFit', description: 'Run 40s/20s or 45s/15s station rotations hands-free.' },
        { icon: 'Timer', title: 'Track & Rowing Repeats', description: 'Time 1-minute hard efforts separated by 1-minute easy recovery.' },
        { icon: 'Users', title: 'Speed Networking & Stations', description: 'Rotate workshop pairs every 3 minutes with a 30-second switch buffer.' },
        { icon: 'GraduationCap', title: 'Music & Drill Practice', description: 'Alternate 4 minutes of scale practice with 1 minute of hand rest.' },
      ],
      whoBenefitsTitle: 'Who Uses the Interval Timer?',
      whoBenefitsList: [
        'Personal trainers, gym instructors, and home fitness enthusiasts',
        'Physical therapists prescribing timed isometric holds and reps',
        'Music teachers and sports coaches running drill stations',
        'Facilitators running speed-networking or station rotations',
      ],
      tipsTitle: 'Tips for Effective Interval Pacing',
      tipsList: [
        'When designing group station circuits, pick Work + Rest durations that sum to 60 seconds (such as 40s/20s or 45s/15s) so every round starts cleanly at the top of a minute.',
      ],
      problemsTitle: 'Interval Work-to-Rest Ratio Reference',
      problemsRows: [
        { problem: '2:1 Work-to-Rest (e.g. 40s / 20s)', cause: 'High metabolic conditioning / Tabata', solution: 'Short recovery keeps heart rate elevated' },
        { problem: '1:1 Work-to-Rest (e.g. 30s / 30s)', cause: 'Balanced aerobic & stamina circuits', solution: 'Equal recovery allows consistent output across 10–20 rounds' },
        { problem: '1:2 Work-to-Rest (e.g. 20s / 40s)', cause: 'Power sprints & heavy resistance', solution: 'Longer rest restores explosive power between sets' },
      ],
    },
  },
  'online-alarm-clock': {
    heroSubtitle:
      'Set a reliable browser alarm for any time of day with selectable acoustic tones, sound preview, and snooze controls.',
    featurePills: ['12-hour & 24-hour clock', 'Built-in sound tester', '5 / 10 / 15m snooze', 'Active Screen Wake Lock'],
    quickPresets: [],
    steps: [
      { step: 1, title: 'Select alarm time', description: 'Pick the hour and minute you want the alarm to ring.' },
      { step: 2, title: 'Choose & test tone', description: 'Select Acoustic Bell, Chime, or Beep and click Test Sound.' },
      { step: 3, title: 'Activate alarm', description: 'Click Set Alarm and leave the browser tab open.' },
      { step: 4, title: 'Dismiss or Snooze', description: 'Click Stop or Snooze (5, 10, or 15 min) when the alarm triggers.' },
    ],
    guide: {
      tableOfContents: [
        'What Is the Online Alarm Clock?',
        'How Browser Wake Locks & Audio Synthesis Work',
        'How to Set an Online Alarm',
        'Important Operating System Sleep Limitations',
        'Everyday Uses for a Browser Alarm',
        'Who Uses This Alarm Clock?',
        'Tips to Ensure Your Alarm Always Rings',
        'Troubleshooting Alarm Playback',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is the Online Alarm Clock?',
      whatIsBody: [
        'The Online Alarm Clock turns your laptop, desktop, or tablet browser into a digital bedside or desk alarm clock. It displays the current local time in large tabular digits, shows the exact hours and minutes remaining until your alarm triggers, and plays a synthesized Web Audio alarm tone with zero external audio files required.',
      ],
      howItWorksTitle: 'How Browser Wake Locks & Audio Synthesis Work',
      howItWorksBody: [
        'When you set an alarm, the tool requests the browser Screen Wake Lock API to prevent your display from dimming or locking, and compares your system clock against your target HH:MM every second. Tones are generated directly through the browser’s Web Audio API oscillator engine so they play even if your internet connection drops overnight.',
      ],
      calloutNote:
        'Important Limitation: Do not close your laptop lid or put your computer into hardware Sleep/Hibernate mode. Operating systems suspend all browser tabs during hardware sleep. Keep your laptop plugged in and the screen open.',
      howToUseTitle: 'How to Set an Online Alarm',
      howToUseSteps: [
        'Select your target wake-up or reminder hour and minute.',
        'Pick an alarm tone and click "Test Sound" to confirm your speakers or headphones are audible.',
        'Click "Set Alarm" and verify the green "Alarm Active" badge and remaining countdown time.',
        'When the alarm rings, click "Stop Alarm" or choose a 5, 10, or 15-minute Snooze.',
      ],
      featuresTitle: 'Important Operating System Sleep Limitations',
      featuresList: [
        'Keep Lid Open & Power Connected: On macOS and Windows, closing the laptop lid forces hardware sleep regardless of browser Wake Lock.',
        'Unlock Audio via "Test Sound": Modern browsers block automatic sound unless you have clicked on the page at least once—clicking Set Alarm or Test Sound unlocks audio automatically.',
        'Works Offline Once Loaded: Because chimes are synthesized in-browser, Wi-Fi dropouts will never prevent the alarm from ringing.',
      ],
      practicalExamples: [
        { icon: 'BellRing', title: 'Desk Power Naps', description: 'Set a 20-minute afternoon nap alarm right on your laptop.' },
        { icon: 'Monitor', title: 'Hard Stop Before Meetings', description: 'Set an alarm for 2:58 PM so you never miss a 3:00 PM client call.' },
        { icon: 'Globe', title: 'Hotel & Travel Backup', description: 'Use your laptop as a loud backup wake-up clock when traveling.' },
        { icon: 'Clock', title: 'School & Shift Reminders', description: 'Alert yourself when it is time to leave for pickup or shift change.' },
      ],
      whoBenefitsTitle: 'Who Uses This Alarm Clock?',
      whoBenefitsList: [
        'Remote workers setting hard-stop reminders before meetings while in deep focus',
        'Travelers who want a secondary wake-up alarm on their laptop',
        'Students taking timed study power naps at their desk',
        'Anyone whose phone is charging in another room',
      ],
      tipsTitle: 'Tips to Ensure Your Alarm Always Rings',
      tipsList: [
        'Always click "Test Sound" after setting your alarm to verify your system mute key is not active and Bluetooth headphones are not connected across the house.',
        'Use Fullscreen mode (F) at night to turn your screen into a clean bedside clock.',
      ],
      problemsTitle: 'Troubleshooting Online Alarm Clock Issues',
      problemsRows: [
        { problem: 'Alarm did not ring overnight', cause: 'Laptop lid was closed or battery saver forced OS sleep', solution: 'Keep laptop plugged into power with lid open' },
        { problem: 'Visual alert shows but no sound', cause: 'System volume muted or routed to Bluetooth earbuds', solution: 'Disconnect Bluetooth headphones and click Test Sound' },
      ],
    },
  },
  'embed-timer': {
    heroSubtitle:
      'Generate clean, sandboxed HTML iframe countdown, visual timer, and stopwatch widgets for Notion, Canvas, and websites.',
    featurePills: ['Sandboxed HTML5 iframe', 'Works in Notion & LMS', 'Zero tracking cookies', 'Live interactive preview'],
    quickPresets: [],
    steps: [
      { step: 1, title: 'Choose widget mode', description: 'Select Countdown Timer, Visual Ring Timer, or Stopwatch.' },
      { step: 2, title: 'Customize duration & theme', description: 'Set default minutes/seconds, title label, and color theme.' },
      { step: 3, title: 'Test in live preview', description: 'Interact with the embedded widget right on the page.' },
      { step: 4, title: 'Copy iframe or Notion link', description: 'Paste the code into WordPress, Canvas, Moodle, or Notion.' },
    ],
    guide: {
      tableOfContents: [
        'What Are the Embeddable Timer Widgets?',
        'How Sandboxed Iframe Widgets Work',
        'How to Embed a Timer in Notion, Canvas & Websites',
        'URL Parameter Customization Reference',
        'Where Embedded Timers Are Used',
        'Who Uses These Widgets?',
        'Tips for Responsive Embeds',
        'Platform Embed Instructions Table',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Are the Embeddable Timer Widgets?',
      whatIsBody: [
        'The Embeddable Timer Widgets generator lets educators, Notion creators, course builders, and web developers configure a self-contained timer or stopwatch and embed it directly inside any webpage, learning management system (LMS), or workspace document.',
      ],
      howItWorksTitle: 'How Sandboxed Iframe Widgets Work',
      howItWorksBody: [
        'The builder encodes your chosen widget type, duration in seconds, heading label, and accent color directly into a lightweight URL query string. The resulting HTML5 <iframe> uses a strict sandbox attribute and loads zero advertising scripts, cookies, or trackers.',
      ],
      calloutNote:
        'Notion Tip: In Notion, you only need the widget URL (not the full <iframe> tag)—type /embed, paste the URL, and press Enter.',
      howToUseTitle: 'How to Embed a Timer in Notion, Canvas & Websites',
      howToUseSteps: [
        'Pick your widget type (Digital Countdown, Visual Ring, or Stopwatch) and set the default duration.',
        'Enter an optional custom heading (such as "Quiz Time Remaining" or "5-Minute Warm-Up") and select a color theme.',
        'Copy the full HTML <iframe> snippet for websites/LMS, or copy the direct URL for Notion and Coda.',
      ],
      featuresTitle: 'URL Parameter Customization Reference',
      featuresList: [
        'type=countdown | visual | stopwatch: Controls which timing engine renders inside the widget.',
        'sec=300: Sets the default starting duration in seconds (e.g. 300 = 5 minutes, 1500 = 25 minutes).',
        'label=Custom+Title: Displays a clean header above the clock digits.',
        'Privacy & Security: Runs inside a sandboxed frame with no third-party analytics or cookies.',
      ],
      practicalExamples: [
        { icon: 'BookOpen', title: 'Notion Study Dashboards', description: 'Embed a 25-minute Pomodoro clock directly inside your Notion task page.' },
        { icon: 'GraduationCap', title: 'Canvas & Moodle Courses', description: 'Add a 10-minute practice timer inside online lesson modules.' },
        { icon: 'Code2', title: 'Internal Team Wikis', description: 'Place a 15-minute standup timer inside Confluence or internal docs.' },
        { icon: 'Utensils', title: 'Recipe & Fitness Blogs', description: 'Let readers start a 4-minute brew or plank timer without leaving your post.' },
      ],
      whoBenefitsTitle: 'Who Uses These Widgets?',
      whoBenefitsList: [
        'Notion template designers and productivity creators',
        'Instructional designers building Canvas, Blackboard, or Moodle courses',
        'Food, fitness, and education bloggers',
        'Internal documentation and wiki maintainers',
      ],
      tipsTitle: 'Tips for Responsive Embeds',
      tipsList: [
        'Use width="100%" and a minimum height of 260px to 320px so the timer digits and control buttons have comfortable breathing room on mobile screens.',
      ],
      problemsTitle: 'Platform Embed Guide',
      problemsRows: [
        { problem: 'Notion / Coda', cause: 'Uses URL embeds rather than raw HTML', solution: 'Type /embed and paste only the src="..." URL' },
        { problem: 'Canvas / Moodle / WordPress', cause: 'Supports standard HTML blocks', solution: 'Switch to HTML / Custom HTML block and paste the full <iframe> code' },
        { problem: 'Google Sites', cause: 'Embed dialog accepts URL or Embed Code', solution: 'Click Insert → Embed → Embed Code and paste the <iframe>' },
      ],
    },
  },
  'kitchen-timer': {
    heroSubtitle:
      'Run multiple simultaneous cooking and baking countdowns for different burners, oven racks, and resting dishes.',
    featurePills: ['Multi-burner parallel timers', 'Custom dish labels', 'One-click culinary presets', 'Screen stays awake'],
    quickPresets: [
      { icon: '🍝', label: '9 min', sublabel: 'Al Dente Pasta', sec: 540 },
      { icon: '🍚', label: '18 min', sublabel: 'Steamed Rice', sec: 1080 },
      { icon: '🥩', label: '10 min', sublabel: 'Steak Resting', sec: 600 },
      { icon: '🥦', label: '22 min', sublabel: 'Roasted Veggies', sec: 1320 },
      { icon: '🍞', label: '35 min', sublabel: 'Oven Baking', sec: 2100 },
    ],
    steps: [
      { step: 1, title: 'Click a culinary preset or add custom', description: 'Launch a timer card for Pasta, Rice, Roasting, or type a custom dish name.' },
      { step: 2, title: 'Run multiple stations at once', description: 'Start, pause, or reset each burner and oven timer independently.' },
      { step: 3, title: 'Monitor hands-free', description: 'Screen Wake Lock keeps your tablet or laptop visible across the kitchen.' },
      { step: 4, title: 'Hear individual dish alarms', description: 'Each completed station flashes red and chimes so you know which pot is done.' },
    ],
    guide: {
      tableOfContents: [
        'What Is the Multi-Burner Kitchen Timer?',
        'How Simultaneous Station Timing Works',
        'How to Coordinate a Multi-Dish Meal',
        'Standard Cooking & Baking Time Reference',
        'Everyday Culinary Use Cases',
        'Who Uses This Kitchen Timer?',
        'Tips for Coordinating Dinner Timing',
        'Common Kitchen Timing Benchmarks',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is the Multi-Burner Kitchen Timer?',
      whatIsBody: [
        'The Kitchen Timer is a multi-station culinary countdown dashboard that lets you run several labeled cooking timers at the same time. A built-in oven or microwave timer can usually track only one countdown at a time—leaving you guessing when you have pasta boiling on the front burner, vegetables roasting on the top rack, and sauce reducing on the back burner.',
      ],
      howItWorksTitle: 'How Simultaneous Station Timing Works',
      howItWorksBody: [
        'Every time you click a culinary preset or add a custom dish, a new independent timer card is added to your active kitchen board. Each card runs its own drift-free countdown, displays its dish label in bold letters, and triggers an acoustic alert when that specific item reaches 00:00.',
      ],
      calloutNote:
        'Hands-Free Display: While any kitchen station timer is active, Screen Wake Lock prevents your tablet or laptop screen from going dark while your hands are wet or covered in flour.',
      howToUseTitle: 'How to Coordinate a Multi-Dish Meal',
      howToUseSteps: [
        'Click any quick preset (Al Dente Pasta 9m, White Rice 18m, Roasted Veggies 22m) or enter a custom Dish Name and duration in the creator bar.',
        'Start each card as that dish hits the heat or comes out of the oven to rest.',
        'Add +1 minute or reset individual cards as you test doneness.',
      ],
      featuresTitle: 'Standard Cooking & Baking Time Reference',
      featuresList: [
        'Dried Pasta (Boiling Salted Water): Spaghetti/Linguine 8–10 min · Penne/Rigatoni 11–12 min · Fresh Pasta 2–3 min.',
        'Grains (Covered Simmer): White Jasmine/Basmati Rice 15–18 min (+ 5m covered rest) · Quinoa 15 min · Brown Rice 40–45 min.',
        'Oven Roasting at 400°F (200°C): Asparagus/Broccoli 12–15 min · Salmon Fillets 12–14 min · Cubed Potatoes 30–35 min.',
        'Meat Resting After Searing/Roasting: Steaks & Pork Chops 5–10 min · Whole Roast Chicken or Turkey 15–25 min.',
      ],
      practicalExamples: [
        { icon: 'Utensils', title: 'Weeknight Multi-Burner Dinners', description: 'Track protein, starch, and vegetable sides simultaneously.' },
        { icon: 'Flame', title: 'Holiday & Thanksgiving Feasts', description: 'Label 5+ oven and stovetop dishes so nothing burns.' },
        { icon: 'Clock', title: 'Sourdough & Yeast Proofing', description: 'Time 30-minute stretch-and-folds alongside active baking.' },
        { icon: 'Coffee', title: 'Meal Prep Sundays', description: 'Batch-cook grains, sheet-pan proteins, and hard-boiled eggs.' },
      ],
      whoBenefitsTitle: 'Who Uses This Kitchen Timer?',
      whoBenefitsList: [
        'Home cooks preparing multi-course or family meals',
        'Bakers tracking multiple proofing bowls and oven trays',
        'Culinary students practicing station mise en place',
        'Weekly meal preppers running multiple appliances at once',
      ],
      tipsTitle: 'Tips for Coordinating Dinner Timing',
      tipsList: [
        'Work backward from your longest-cooking item (e.g., start the 35-minute roasted potatoes first, start the 18-minute rice when 20 minutes remain on the potatoes, and sear the fish in the final 10 minutes).',
      ],
      problemsTitle: 'Culinary Timing Reference Table',
      problemsRows: [
        { problem: 'Blanching Green Beans / Broccoli', cause: 'Boiling salted water → ice bath', solution: '2 to 3 minutes' },
        { problem: 'Al Dente Spaghetti / Penne', cause: 'Rolling boil in salted water', solution: '9 to 11 minutes' },
        { problem: 'Steamed White Rice', cause: 'Covered low simmer + 5m rest', solution: '18 minutes simmer + 5 minutes rest' },
        { problem: 'Resting Pan-Seared Steak', cause: 'Allows juices to redistribute', solution: '7 to 10 minutes on warm board' },
      ],
    },
  },
  'egg-timer': {
    heroSubtitle:
      'Boil soft runny, jammy ramen, medium, or firm hard-boiled eggs with exact simmering countdown presets.',
    featurePills: ['Soft / Jammy / Medium / Hard presets', 'Calibrated for simmering start', 'Ice-bath carryover guide', 'Altitude & size tips'],
    quickPresets: [
      { icon: '🥚', label: '4m 30s', sublabel: 'Soft Runny Yolk', sec: 270 },
      { icon: '🍜', label: '6m 30s', sublabel: 'Jammy Ramen Egg', sec: 390 },
      { icon: '🍳', label: '8 min', sublabel: 'Medium Creamy', sec: 480 },
      { icon: '🥗', label: '10m 30s', sublabel: 'Firm Hard Boiled', sec: 630 },
    ],
    steps: [
      { step: 1, title: 'Bring water to a gentle simmer', description: 'Heat 3 inches of water to a gentle boil before adding eggs.' },
      { step: 2, title: 'Lower cold large eggs & click preset', description: 'Choose Soft (4:30), Jammy (6:30), Medium (8:00), or Hard (10:30) and press Start.' },
      { step: 3, title: 'Maintain a steady simmer', description: 'Keep heat at a gentle simmer so shells do not crack.' },
      { step: 4, title: 'Plunge into ice water at 00:00', description: 'Transfer eggs to an ice bath immediately when the chime rings.' },
    ],
    guide: {
      tableOfContents: [
        'What Is the Boiled Egg Timer?',
        'The Science of Egg White & Yolk Coagulation Temperatures',
        'How to Boil Eggs for Exact Yolk Consistency',
        'Adjustments for Egg Size, Starting Temp & Altitude',
        'Culinary Uses by Egg Style',
        'Who Uses This Egg Timer?',
        'Tips for Easy-Peel Boiled Eggs',
        'Boiled Egg Doneness Chart (Large Refrigerator-Cold Eggs)',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is the Boiled Egg Timer?',
      whatIsBody: [
        'The Boiled Egg Timer is a calibrated kitchen countdown with one-click presets for Soft Runny (4m 30s), Jammy Ramen (6m 30s), Medium Firm (8m 00s), and Hard Boiled (10m 30s) eggs. Because the difference between a runny yolk and a set yolk is less than 90 seconds, exact timing is the key to repeatable results.',
      ],
      howItWorksTitle: 'The Science of Egg White & Yolk Coagulation Temperatures',
      howItWorksBody: [
        'Egg whites (albumen) and egg yolks solidify at different temperatures: egg whites begin setting at 144°F (62°C) and become firm at 158°F (70°C), while yolks thicken between 149°F (65°C) and 158°F (70°C).',
        'Why We Start in Simmering Water: Starting eggs in cold water produces inconsistent results because an induction burner, gas stove, and electric coil take different times to reach a boil. Lowering refrigerator-cold USDA Large eggs (approx. 57g in shell) directly into already simmering water (205–212°F / 96–100°C) makes timing predictable on any stove.',
      ],
      calloutNote:
        'Crucial Step: Always prepare a bowl of cold water and ice before the timer finishes. Leaving a 6.5-minute jammy egg on a warm counter for 2 extra minutes allows residual heat to turn it hard-boiled.',
      howToUseTitle: 'How to Boil Eggs for Exact Yolk Consistency',
      howToUseSteps: [
        'Bring a pot of water (deep enough to cover the eggs by 1 inch) to a gentle boil.',
        'Gently lower refrigerator-cold Large eggs into the water using a slotted spoon.',
        'Immediately click your desired preset (4:30 Soft, 6:30 Jammy, 8:00 Medium, or 10:30 Hard) and press Start.',
        'When the alarm chimes at 00:00, transfer the eggs into an ice-water bath for at least 3 minutes before peeling.',
      ],
      featuresTitle: 'Adjustments for Egg Size, Starting Temp & Altitude',
      featuresList: [
        'Egg Size Adjustment: Presets are calibrated for standard Large (L) eggs (~57g). Subtract 30 seconds for Medium eggs; add 30 to 45 seconds for Extra-Large (XL) or Jumbo eggs.',
        'Room-Temperature Eggs: If your eggs are stored at room temperature (68°F / 20°C) rather than in the refrigerator (38°F / 3°C), subtract 45 seconds from each preset.',
        'High-Altitude Adjustment: Above 5,000 feet (1,500 meters), water boils at a lower temperature (~203°F / 95°C); add 30 to 60 seconds to each cooking time.',
      ],
      practicalExamples: [
        { icon: 'Utensils', title: '4:30 Dippy Eggs & Soldiers', description: 'Barely set whites with a warm, liquid golden yolk for toast.' },
        { icon: 'Flame', title: '6:30 Ajitsuke Tamago (Ramen)', description: 'Custardy, jammy yolk that holds its shape when halved over noodles.' },
        { icon: 'CheckSquare', title: '8:00 Niçoise & Cobb Salads', description: 'Creamy, tender-firm yolk that does not crumble when sliced.' },
        { icon: 'Clock', title: '10:30 Deviled Eggs & Egg Salad', description: 'Fully cooked yolk with zero gray-green iron sulfide ring.' },
      ],
      whoBenefitsTitle: 'Who Uses This Egg Timer?',
      whoBenefitsList: [
        'Breakfast cooks making soft-boiled or jammy toast eggs',
        'Home ramen enthusiasts preparing marinated ajitsuke tamago',
        'Meal preppers batch-boiling easy-peel protein snacks',
        'Hosts making deviled eggs or potato salad',
      ],
      tipsTitle: 'Tips for Easy-Peel Boiled Eggs',
      tipsList: [
        'Lowering eggs into already-hot simmering water (rather than starting in cold water) coagulates the outer albumen membrane quickly so it bonds less tightly to the shell.',
        'Tap both ends of the cooled egg on the counter and peel under cool running water to slip under the membrane.',
      ],
      problemsTitle: 'Boiled Egg Doneness Chart (Large Fridge-Cold Eggs in Simmering Water)',
      problemsRows: [
        { problem: '4 min 30 sec (270s)', cause: 'Set exterior white, liquid yolk', solution: 'Soft-boiled / Toast dipping' },
        { problem: '6 min 30 sec (390s)', cause: 'Firm white, glossy jammy custard yolk', solution: 'Ramen bowls, avocado toast, grain bowls' },
        { problem: '8 min 00 sec (480s)', cause: 'Tender-firm jammy-center yolk', solution: 'Sliced on salads & Nicoise platters' },
        { problem: '10 min 30 sec (630s)', cause: 'Fully set pale yellow yolk (no gray ring)', solution: 'Deviled eggs, egg salad, meal prep' },
      ],
    },
  },
  'tea-timer': {
    heroSubtitle:
      'Steep Green, White, Oolong, Black, and Herbal teas for the exact duration and water temperature to prevent bitterness.',
    featurePills: ['Green / White / Oolong / Black / Herbal', 'Water temperature guide (°C & °F)', 'Prevents bitter over-extraction', 'One-click steep presets'],
    quickPresets: [
      { icon: '🍵', label: '2 min', sublabel: 'Green Tea (75–80°C)', sec: 120 },
      { icon: '🍃', label: '2m 30s', sublabel: 'White Tea (80–85°C)', sec: 150 },
      { icon: '🫖', label: '3 min', sublabel: 'Oolong Tea (85–90°C)', sec: 180 },
      { icon: '☕', label: '4 min', sublabel: 'Black Tea (95–100°C)', sec: 240 },
      { icon: '🌿', label: '5 min', sublabel: 'Herbal / Rooibos (100°C)', sec: 300 },
    ],
    steps: [
      { step: 1, title: 'Select your tea variety', description: 'Click Green, White, Oolong, Black, or Herbal to load its steep time and temperature.' },
      { step: 2, title: 'Check water temperature', description: 'Let boiling water cool briefly for delicate Green and White teas.' },
      { step: 3, title: 'Pour water & click Start', description: 'Begin the countdown as soon as water meets the tea leaves.' },
      { step: 4, title: 'Remove leaves at 00:00', description: 'Lift the infuser basket or tea bag immediately when the chime sounds.' },
    ],
    guide: {
      tableOfContents: [
        'What Is the Tea Steeping Timer?',
        'Why Steep Time & Water Temperature Control Bitterness',
        'How to Steep Loose-Leaf & Bagged Tea',
        'Steeping Guide by Tea Variety',
        'Multiple Infusions & Re-Steeping',
        'Who Uses This Tea Timer?',
        'Tips for a Better Cup of Tea',
        'Tea Steeping Temperature & Duration Chart',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is the Tea Steeping Timer?',
      whatIsBody: [
        'The Tea Steeping Timer pairs exact steeping countdowns with recommended water temperatures (°C and °F) for the five major tea categories: Green, White, Oolong, Black, and Herbal tisanes.',
      ],
      howItWorksTitle: 'Why Steep Time & Water Temperature Control Bitterness',
      howItWorksBody: [
        'Tea leaves contain aromatic essential oils, amino acids (such as savory-sweet L-theanine), caffeine, and astringent polyphenols (tannins/catechins). Amino acids and aroma compounds dissolve quickly at moderate temperatures, whereas bitter tannins extract rapidly in boiling water and after 3 to 4 minutes of steeping.',
        'Because Green and White teas are unoxidized, pouring 100°C (212°F) boiling water on them or steeping past 2–3 minutes scorches the delicate leaves and produces a harsh, grassy bitterness.',
      ],
      calloutNote:
        'No Thermometer? Bring your kettle to a boil, then let it sit with the lid open for 2 minutes to drop to ~85°C (185°F) for Oolong/White tea, or 3–4 minutes to drop to ~78°C (172°F) for Green tea.',
      howToUseTitle: 'How to Steep Loose-Leaf & Bagged Tea',
      howToUseSteps: [
        'Measure roughly 2 to 2.5 grams (1 level teaspoon) of loose-leaf tea—or 1 tea bag—per 240 mL (8 oz) cup.',
        'Select your tea variety preset on the timer and heat water to the displayed target temperature.',
        'Pour water over the leaves and press Start immediately.',
        'When the chime sounds at 00:00, remove the strainer or tea bag completely so the leaves do not keep extracting in the mug.',
      ],
      featuresTitle: 'Steeping Guide by Tea Variety',
      featuresList: [
        'Japanese & Chinese Green Tea (Sencha, Dragonwell, Jasmine): 1 min 30 sec to 2 min at 75–80°C (167–176°F).',
        'White Tea (Silver Needle, White Peony): 2 min 30 sec to 3 min at 80–85°C (175–185°F).',
        'Oolong Tea (Tieguanyin, Dong Ding, Wuyi): 3 min at 85–92°C (185–198°F); whole rolled leaves can be re-steeped 3–4 times.',
        'Black Tea (Earl Grey, Assam, Darjeeling, English Breakfast): 3 min 30 sec to 4 min at 95–100°C (205–212°F).',
        'Herbal Tisanes (Chamomile, Peppermint, Rooibos, Hibiscus): 5 to 7 min at 100°C (212°F)—caffeine-free herbs do not turn bitter from over-steeping.',
      ],
      practicalExamples: [
        { icon: 'Coffee', title: 'Delicate Sencha & Matcha Prep', description: 'Avoid bitter catechins with a strict 90-to-120 second steep.' },
        { icon: 'Sparkles', title: 'Multi-Steep Oolong Sessions', description: 'Add 30 seconds to each subsequent infusion of rolled oolong.' },
        { icon: 'Clock', title: 'Afternoon Earl Grey & Chai', description: 'Get full-bodied malty extraction in 4 minutes without astringency.' },
        { icon: 'Wind', title: 'Evening Herbal Infusions', description: 'Steep chamomile or peppermint for a full 5 minutes.' },
      ],
      whoBenefitsTitle: 'Who Uses This Tea Timer?',
      whoBenefitsList: [
        'Loose-leaf tea enthusiasts and specialty cafe baristas',
        'Office and remote workers brewing desk tea between meetings',
        'Green tea drinkers who want sweet, umami cups instead of bitter tea',
        'Evening herbal tea drinkers',
      ],
      tipsTitle: 'Tips for a Better Cup of Tea',
      tipsList: [
        'If you want stronger tea, use more tea leaves (e.g. 1.5 teaspoons per cup) rather than steeping for twice as long—extra time extracts bitterness, whereas extra leaf extracts more flavor.',
        'Never squeeze the tea bag against the side of the mug at the end of steeping, as that forces bitter tannins into the cup.',
      ],
      problemsTitle: 'Tea Steeping Reference Chart',
      problemsRows: [
        { problem: 'Green Tea', cause: '75–80°C (170–175°F)', solution: '1 min 30 sec – 2 min 00 sec' },
        { problem: 'White Tea', cause: '80–85°C (175–185°F)', solution: '2 min 30 sec – 3 min 00 sec' },
        { problem: 'Oolong Tea', cause: '85–90°C (185–195°F)', solution: '3 min 00 sec (re-steepable)' },
        { problem: 'Black Tea', cause: '95–100°C (205–212°F)', solution: '3 min 30 sec – 4 min 00 sec' },
        { problem: 'Herbal / Rooibos', cause: '100°C (212°F)', solution: '5 min 00 sec – 7 min 00 sec' },
      ],
    },
  },
  'coffee-timer': {
    heroSubtitle:
      'Time your coffee bloom, V60 pour-over, French Press steep, AeroPress inversion, and 28-second espresso shots.',
    featurePills: ['45s Pour-Over Bloom preset', 'V60 / Chemex / French Press / AeroPress', '1:16 brew ratio guide', 'Dual-stage brew tracking'],
    quickPresets: [
      { icon: '💧', label: '45 sec', sublabel: 'Pour-Over Bloom', sec: 45 },
      { icon: '☕', label: '3 min', sublabel: 'V60 / Pour-Over Total', sec: 180 },
      { icon: '🫖', label: '4 min', sublabel: 'French Press Steep', sec: 240 },
      { icon: '🧪', label: '1m 45s', sublabel: 'AeroPress Brew', sec: 105 },
      { icon: '⚡', label: '28 sec', sublabel: 'Espresso Shot (1:2)', sec: 28 },
    ],
    steps: [
      { step: 1, title: 'Select your brewing method', description: 'Pick Pour-Over Bloom (45s), V60 Total (3m), French Press (4m), AeroPress (1m 45s), or Espresso (28s).' },
      { step: 2, title: 'Measure 1:16 coffee-to-water ratio', description: 'Use 15g coffee to 240g water (or 30g coffee to 480g water) at 92–96°C.' },
      { step: 3, title: 'Start timer on first water contact', description: 'Press Start the moment hot water touches the dry grounds.' },
      { step: 4, title: 'Finish pour or plunge at 00:00', description: 'Decant or press when the chime rings to prevent over-extraction.' },
    ],
    guide: {
      tableOfContents: [
        'What Is the Coffee Brew Timer?',
        'Coffee Extraction Science, Bloom & the 1:16 Ratio',
        'How to Time Pour-Over, French Press & AeroPress',
        'Worked Brew Recipes by Method',
        'Dialing In Grind Size by Brew Time',
        'Who Uses This Coffee Timer?',
        'Barista Tips for Consistent Extraction',
        'Specialty Coffee Brewing Chart',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is the Coffee Brew Timer?',
      whatIsBody: [
        'The Coffee Brew Timer is a specialty coffee extraction timer with presets for the 45-second Pour-Over Bloom, 3-minute V60/Kalita drawdown, 4-minute French Press immersion, 1:45 AeroPress steep, and 28-second double Espresso shot.',
      ],
      howItWorksTitle: 'Coffee Extraction Science, Bloom & the 1:16 Ratio',
      howItWorksBody: [
        'During roasting, coffee beans trap carbon dioxide (CO₂) gas inside their cellular structure. When hot water (92–96°C / 198–205°F) first hits freshly ground coffee, that CO₂ rapidly escapes and repels water—a process called degassing. Pouring 2× to 3× the dry coffee weight in water (e.g. 45g water for 15g coffee) and waiting 30 to 45 seconds for the "Bloom" allows CO₂ to vent so the main pour extracts sweet sugars and balanced acids evenly.',
        'Standard Brew Ratio Formula: Water (grams/mL) = Coffee Dose (grams) × 16. For a single 240 mL mug: 15g coffee × 16 = 240g water. For a two-cup 480 mL carafe: 30g coffee × 16 = 480g water.',
      ],
      calloutNote:
        'Extraction Order: Fruity acids and caffeine dissolve first (0:00–1:30), followed by Maillard sweetness and body (1:30–2:45), and finally dry, bitter plant fibers if brewed too long (>3:30 for pour-over).',
      howToUseTitle: 'How to Time Pour-Over, French Press & AeroPress',
      howToUseSteps: [
        'Rinse your paper filter with hot water, add freshly ground coffee, and tare your scale to zero.',
        'Click your method preset (e.g., 45s Bloom + 3m V60, or 4m French Press) and start the timer as you begin pouring.',
        'Follow the target drawdown or plunge time so every cup tastes repeatable.',
      ],
      featuresTitle: 'Worked Brew Recipes by Method',
      featuresList: [
        'Hario V60 Pour-Over (3:00 Total): 15g medium-fine coffee, 250g water at 94°C. Pour 45g for Bloom (0:00–0:45), pour to 150g by 1:15, pour to 250g by 1:45, full drawdown by 2:45–3:00.',
        'French Press Immersion (4:00 Total): 30g coarse coffee, 480g water at 95°C. Pour all water, steep for 4:00, break the top crust, skim foam, and plunge gently.',
        'AeroPress Standard (1:45 Total): 15g medium-fine coffee, 240g water at 90–93°C. Stir at 0:15, attach cap, and press steadily from 1:15 to 1:45.',
        'Modern Double Espresso (25–30 Seconds): 18g fine espresso dose → 36g liquid espresso yield (1:2 ratio) at 9 bars pressure and 93°C.',
      ],
      practicalExamples: [
        { icon: 'Coffee', title: 'Morning V60 & Chemex', description: 'Hit a consistent 45-second bloom and 3:00–3:30 total drawdown.' },
        { icon: 'Utensils', title: 'French Press Carafes', description: 'Steep coarse grounds for 4 minutes before pressing and decanting.' },
        { icon: 'Flame', title: 'Espresso Shot Dial-In', description: 'Time 25–30 second extractions to calibrate burr grinder settings.' },
        { icon: 'Clock', title: 'Cold Brew Concentrate', description: 'Use custom hours for 12-to-16 hour room-temperature cold brew.' },
      ],
      whoBenefitsTitle: 'Who Uses This Coffee Timer?',
      whoBenefitsList: [
        'Home baristas brewing V60, Chemex, Kalita Wave, or Origami pour-overs',
        'French Press and AeroPress coffee drinkers',
        'Espresso enthusiasts dialing in new roast bags',
        'Cafe staff training on repeatable brew recipes',
      ],
      tipsTitle: 'Barista Tips for Consistent Extraction',
      tipsList: [
        'If your pour-over finishes draining in under 2:15 and tastes sour or thin, adjust your burr grinder 1–2 clicks finer.',
        'If your pour-over stalls past 3:45 and tastes dry or astringent, adjust your grinder 1–2 clicks coarser.',
      ],
      problemsTitle: 'Specialty Coffee Brew Method Reference Table',
      problemsRows: [
        { problem: 'Pour-Over Bloom', cause: '2×–3× coffee weight in water', solution: '30 to 45 seconds degassing wait' },
        { problem: 'V60 / Kalita Pour-Over', cause: 'Medium-fine grind · 1:16 ratio · 93–96°C', solution: '2 min 45 sec – 3 min 15 sec total' },
        { problem: 'Chemex Carafe', cause: 'Medium-coarse grind · thick bonded filter', solution: '3 min 45 sec – 4 min 30 sec total' },
        { problem: 'French Press Immersion', cause: 'Coarse grind · 1:15 to 1:16 ratio', solution: '4 min 00 sec steep before plunge' },
        { problem: 'Double Espresso (1:2)', cause: 'Fine grind · 18g in → 36g out · 9 bar', solution: '25 to 30 seconds from pump start' },
      ],
    },
  },
  'study-timer': {
    heroSubtitle:
      'A distraction-free study timer with structured focus blocks, exam practice durations, and recovery intervals.',
    featurePills: [
      '25, 45, 50 & 90m blocks',
      'Full exam practice timing',
      'Quiet completion chime',
      'Fullscreen desk display',
    ],
    quickPresets: [
      { icon: '📚', label: '25 min', sublabel: 'Pomodoro Sprint', sec: 1500 },
      { icon: '✏️', label: '45 min', sublabel: 'Lecture Block', sec: 2700 },
      { icon: '🎓', label: '50 min', sublabel: 'Deep Study', sec: 3000 },
      { icon: '🧠', label: '60 min', sublabel: 'Exam Section', sec: 3600 },
      { icon: '🔬', label: '90 min', sublabel: 'Problem Set', sec: 5400 },
    ],
    steps: [
      { step: 1, title: 'Write down one concrete goal', description: 'Define the exact chapter, problem set, or flashcard deck you will complete during this block.' },
      { step: 2, title: 'Select your study block preset', description: 'Click 25m for memorization, 50m for deep reading and notes, or 60–90m for mock exam sections.' },
      { step: 3, title: 'Study without tab-switching', description: 'Keep unrelated tabs closed and work steadily until the completion chime sounds.' },
      { step: 4, title: 'Take a scheduled recovery break', description: 'Step away from your screen for 5 to 15 minutes before starting your next study block.' },
    ],
    guide: {
      tableOfContents: [
        'What Is the Study Timer?',
        'Matching Study Block Length to Your Subject',
        'How to Run a Focused Study Session',
        'Worked Study & Exam Pacing Schedules',
        'Practical Study Scenarios',
        'Who Uses This Study Timer?',
        'Tips for Effective Timed Revision',
        'Study Block & Exam Pacing Reference',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is the Study Timer?',
      whatIsBody: [
        'Studying without a defined endpoint often leads to passive reading and frequent phone checks. The Study Timer turns open-ended revision into concrete blocks with a clear start, a single learning objective, and a scheduled break.',
      ],
      howItWorksTitle: 'Matching Study Block Length to Your Subject',
      howItWorksBody: [
        'Different academic tasks benefit from different block lengths. Use shorter 25-to-30-minute blocks when memorizing vocabulary, anatomical terms, or formulas with flashcards. Stop immediately when the chime sounds, take a 5-minute movement break away from screens, and then test yourself on the material.',
        'Use 50-minute blocks (paired with 10-minute breaks) or 90-minute blocks (paired with 15–20-minute breaks) when working through dense textbook chapters, programming assignments, or past exam papers where context-switching costs time.',
      ],
      calloutNote:
        'Exam Pacing Formula: Minutes Per Mark = Total Exam Minutes ÷ Total Marks. On a 60-minute, 50-mark paper, budget 1.2 minutes per mark and check the timer at the 30-minute halfway point.',
      howToUseTitle: 'How to Run a Focused Study Session',
      howToUseSteps: [
        'Write down the exact task (e.g., "Complete 15 organic chemistry mechanism problems") before starting the clock.',
        'Select 25m, 45m, 50m, 60m, or 90m and enable fullscreen mode beside your notebook.',
        'Spend the final 3 minutes of the block testing your recall without looking at your notes.',
      ],
      featuresTitle: 'Worked Study & Exam Pacing Schedules',
      featuresList: [
        '25/5 Flashcard Sprint (30m cycle): 25 minutes active recall + 5 minutes rest. Two cycles per hour yield 50 net study minutes.',
        '50/10 University Hour (60m cycle): 50 minutes deep reading, essay outlining, or coding + 10 minutes standing recovery.',
        '90/20 STEM & Mock Exam Block (110m cycle): 90 minutes uninterrupted problem-solving or past-paper simulation + 20 minutes rest.',
      ],
      practicalExamples: [
        { icon: 'GraduationCap', title: '25m Flashcard Recall', description: 'Spaced-repetition review and active self-quizzing.' },
        { icon: 'BookOpen', title: '50m Deep Reading', description: 'Textbook annotation, literature synthesis, and outlining.' },
        { icon: 'Calculator', title: '90m STEM Problem Set', description: 'Mathematics, physics, and engineering problem sets.' },
        { icon: 'Clock', title: '60m Mock Exam Section', description: 'Timed essay writing and multiple-choice pacing.' },
      ],
      whoBenefitsTitle: 'Who Uses This Study Timer?',
      whoBenefitsList: [
        'High school and university students preparing for midterms and finals',
        'Medical, law, and engineering candidates running timed practice blocks',
        'Self-taught programmers working through coding exercises',
        'Study groups keeping shared library sessions on schedule',
      ],
      tipsTitle: 'Tips for Effective Timed Revision',
      tipsList: [
        'Spend the last 3 minutes of every 50-minute study block writing down 3 key points from memory before closing your book.',
        'Keep a scratchpad next to your keyboard to jot down unrelated thoughts ("buy groceries", "reply to email") so you can handle them during your break without breaking focus.',
      ],
      problemsTitle: 'Study Block & Exam Pacing Reference',
      problemsRows: [
        { problem: '25 min Focus + 5 min Break', cause: 'High-frequency recall & flashcards', solution: '2 sessions per hour (50m net study)' },
        { problem: '50 min Focus + 10 min Break', cause: 'University lecture review & essays', solution: '1 session per hour (50m net study)' },
        { problem: '90 min Focus + 20 min Break', cause: 'Full problem sets & mock exams', solution: 'Matches standard college exam length' },
      ],
    },
  },
  'reading-timer': {
    heroSubtitle:
      'A quiet reading timer for daily reading habits, student reading logs, and calculating pages-per-hour reading speed.',
    featurePills: [
      '15, 20, 30 & 60m presets',
      'Gentle completion chime',
      'Pages-per-hour pacing math',
      'Distraction-free fullscreen',
    ],
    quickPresets: [
      { icon: '📕', label: '15 min', sublabel: 'Daily Habit', sec: 900 },
      { icon: '📗', label: '20 min', sublabel: 'School Log', sec: 1200 },
      { icon: '📘', label: '30 min', sublabel: 'Chapter Block', sec: 1800 },
      { icon: '📙', label: '45 min', sublabel: 'Literature Study', sec: 2700 },
      { icon: '📚', label: '60 min', sublabel: 'Deep Reading', sec: 3600 },
    ],
    steps: [
      { step: 1, title: 'Choose your reading duration', description: 'Select 20m for school reading logs, 30m for daily chapters, or 45–60m for academic study.' },
      { step: 2, title: 'Note your starting page number', description: 'Jot down the starting page if you want to calculate your pages-per-hour pace.' },
      { step: 3, title: 'Read attentively until the chime', description: 'Keep your phone silenced and read continuously until the soft completion tone.' },
      { step: 4, title: 'Log pages completed', description: 'Subtract your starting page from your ending page to track progress.' },
    ],
    guide: {
      tableOfContents: [
        'What Is the Reading Timer?',
        'Pages-Per-Hour Formula & Book Completion Math',
        'How to Time a Daily Reading Session',
        'Worked Reading Speed Examples',
        'Common Reading Timer Routines',
        'Who Uses This Reading Timer?',
        'Reading Pace & Habit Tips',
        'Reading Speed & Book Completion Reference Table',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is the Reading Timer?',
      whatIsBody: [
        'Setting a fixed reading duration—such as 20 or 30 minutes a day—is one of the most reliable ways to finish more books without feeling rushed. Instead of worrying about how many chapters remain, you simply read attentively until the soft chime sounds.',
      ],
      howItWorksTitle: 'Pages-Per-Hour Formula & Book Completion Math',
      howItWorksBody: [
        'To find your reading speed in pages per hour (PPH), record your starting page and ending page across a timed session and apply this formula: Pages Per Hour = (Pages Read ÷ Minutes Elapsed) × 60.',
        'Worked Example: Suppose you read 18 pages of a trade paperback during a 30-minute timer session. Your pace is (18 ÷ 30) × 60 = 36 pages per hour. If the book is 324 pages long, it will take 324 ÷ 36 = 9 hours of total reading—or exactly 18 daily sessions of 30 minutes.',
      ],
      calloutNote:
        'Annual Reading Math: Just 20 minutes of reading per day equals 7,300 minutes (121.6 hours) per year—enough to finish 15 to 20 full-length 300-page books annually.',
      howToUseTitle: 'How to Time a Daily Reading Session',
      howToUseSteps: [
        'Select 15m, 20m, 30m, 45m, or 60m depending on your schedule or school reading log requirement.',
        'Record your starting page number before clicking Start.',
        'Read without checking notifications until the gentle chime rings.',
      ],
      featuresTitle: 'Worked Reading Speed Examples',
      featuresList: [
        'Trade Fiction / Nonfiction Pace: 20 pages in 30 minutes = 40 pages/hour (a 320-page book takes 8 hours).',
        'Dense History / Biography Pace: 14 pages in 30 minutes = 28 pages/hour (a 420-page book takes 15 hours).',
        'Technical Textbook + Note-Taking Pace: 8 pages in 30 minutes = 16 pages/hour (an 80-page exam unit takes 5 hours).',
      ],
      practicalExamples: [
        { icon: 'BookOpen', title: '20m Student Reading Log', description: 'Standard daily homework reading block for elementary and middle school.' },
        { icon: 'Coffee', title: '30m Morning Nonfiction', description: 'Finishing one chapter before starting the workday.' },
        { icon: 'GraduationCap', title: '45m Seminar Preparation', description: 'Close reading and margin note-taking for university courses.' },
        { icon: 'Moon', title: '15m Bedtime Wind-Down', description: 'Screen-free print reading before sleep.' },
      ],
      whoBenefitsTitle: 'Who Uses This Reading Timer?',
      whoBenefitsList: [
        'K–12 students and parents completing daily 20-minute reading logs',
        'Book-club members pacing weekly chapter assignments',
        'University students budgeting syllabus reading hours',
        'Lifelong readers building a consistent evening reading habit',
      ],
      tipsTitle: 'Reading Pace & Habit Tips',
      tipsList: [
        'Measure your pace separately for fiction and dense textbooks so your study time estimates stay realistic.',
        'Pair your reading timer with a fixed daily cue—such as right after pouring morning coffee or 20 minutes before lights-out.',
      ],
      problemsTitle: 'Reading Speed & Book Completion Reference Table',
      problemsRows: [
        { problem: '15 pages in 30 minutes', cause: '(15 ÷ 30) × 60 = 30 pages/hour', solution: '300-page book takes 10 hours (20 × 30m sessions)' },
        { problem: '20 pages in 30 minutes', cause: '(20 ÷ 30) × 60 = 40 pages/hour', solution: '300-page book takes 7.5 hours (15 × 30m sessions)' },
        { problem: '8 pages in 30 minutes (Textbook)', cause: '(8 ÷ 30) × 60 = 16 pages/hour', solution: '80-page textbook unit takes 5 hours' },
      ],
    },
  },
  'break-timer': {
    heroSubtitle:
      'A clean work and study break timer for 5-minute micro-breaks, 15-minute coffee pauses, and 30-to-60-minute lunch breaks.',
    featurePills: [
      '5, 10, 15, 30 & 60m presets',
      'Return-to-desk audio alert',
      'Conference & workshop ready',
      'Fullscreen return countdown',
    ],
    quickPresets: [
      { icon: '🧘', label: '5 min', sublabel: 'Pomodoro Break', sec: 300 },
      { icon: '🚶', label: '10 min', sublabel: 'Stretch Walk', sec: 600 },
      { icon: '☕', label: '15 min', sublabel: 'Coffee Break', sec: 900 },
      { icon: '🥪', label: '30 min', sublabel: 'Lunch Break', sec: 1800 },
      { icon: '🍽️', label: '60 min', sublabel: 'Full Hour Lunch', sec: 3600 },
    ],
    steps: [
      { step: 1, title: 'Select your break duration', description: 'Click 5m for a Pomodoro pause, 15m for a coffee intermission, or 30m/60m for lunch.' },
      { step: 2, title: 'Project or leave running on desk', description: 'In workshops, press Fullscreen on the shared projector so attendees see when the session resumes.' },
      { step: 3, title: 'Step away from screens', description: 'Stand up, stretch, refill water, and rest your eyes during the countdown.' },
      { step: 4, title: 'Return promptly on the chime', description: 'Resume your next focus block or meeting segment when the timer reaches 00:00.' },
    ],
    guide: {
      tableOfContents: [
        'What Is the Break Timer?',
        'Choosing the Right Break Duration for Work & Workshops',
        'How to Run an Individual or Group Break Timer',
        'Standard Work-to-Break Ratios',
        'Common Break Timer Scenarios',
        'Who Uses This Break Timer?',
        'Break Management Best Practices',
        'Work-to-Break Ratio Reference Table',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is the Break Timer?',
      whatIsBody: [
        'Scheduled breaks work best when they have a clear boundary. Without a timer, a quick 5-minute pause between focus blocks can easily stretch into half an hour—or, in group workshops, a 15-minute intermission can derail the afternoon agenda.',
      ],
      howItWorksTitle: 'Choosing the Right Break Duration for Work & Workshops',
      howItWorksBody: [
        'Match your break duration to the length of the preceding work block. After a 25-minute Pomodoro sprint, a 5-minute micro-break is enough to stand up, get water, and rest your eyes. After a 50-to-60-minute lecture or meeting, a 10-to-15-minute break gives participants time to use the restroom and stretch.',
        'For hourly shift scheduling, standard US state labor rules commonly mandate a paid 10-to-15-minute rest period for every 4 hours worked and an unpaid 30-minute meal period for shifts exceeding 5 or 6 hours.',
      ],
      calloutNote:
        'Facilitator Tip: For a 15-minute conference break, set the projected countdown to 13 minutes so attendees have 2 minutes to walk back and take their seats before the speaker begins.',
      howToUseTitle: 'How to Run an Individual or Group Break Timer',
      howToUseSteps: [
        'Click the 5m, 10m, 15m, 30m, or 60m preset button.',
        'Enable audio and fullscreen mode if displaying to a classroom or seminar room.',
        'Step away from your desk and return when the completion chime sounds.',
      ],
      featuresTitle: 'Standard Work-to-Break Ratios',
      featuresList: [
        '5-Minute Micro-Break: Pairs with 25-minute Pomodoro sprints (17% break ratio).',
        '10-Minute Hourly Break: Pairs with 50-minute academic lectures or coding blocks (17% break ratio).',
        '15-Minute Seminar Intermission: Standard mid-morning or mid-afternoon coffee break for 90-minute workshops.',
        '30-to-60-Minute Meal Break: Midday lunch countdown for remote workers and shift teams.',
      ],
      practicalExamples: [
        { icon: 'Clock', title: '5m Pomodoro Pause', description: 'Short recovery between 25-minute focus sprints.' },
        { icon: 'Coffee', title: '15m Workshop Intermission', description: 'Shared projector countdown for seminar coffee breaks.' },
        { icon: 'Utensils', title: '30m Shift Meal Break', description: 'Timed lunch break for customer support and retail teams.' },
        { icon: 'Activity', title: '10m Hourly Movement', description: 'Standing and stretching after 50 minutes of desk work.' },
      ],
      whoBenefitsTitle: 'Who Uses This Break Timer?',
      whoBenefitsList: [
        'Corporate trainers, workshop facilitators, and conference emcees',
        'Teachers timing classroom recess and transition breaks',
        'Remote workers structuring home-office lunch and coffee pauses',
        'Call-center and support teams tracking scheduled 15-minute rest breaks',
      ],
      tipsTitle: 'Break Management Best Practices',
      tipsList: [
        'Avoid spending a screen break scrolling social media on another screen—physical movement and distant visual focus restore energy much faster.',
        'In multi-hour meetings, announce the break timer before dismissing the room so everyone sees the countdown already running.',
      ],
      problemsTitle: 'Work-to-Break Ratio Reference Table',
      problemsRows: [
        { problem: '25 min Work Block', cause: 'Standard Pomodoro cycle', solution: '5 min short break (15–20m after 4 cycles)' },
        { problem: '50 min Work Block', cause: 'Academic hour / deep coding', solution: '10 min movement & hydration break' },
        { problem: '90 min Workshop Session', cause: 'Conference / seminar block', solution: '15 min coffee & restroom intermission' },
      ],
    },
  },
  'eye-break-timer': {
    heroSubtitle:
      'An ergonomic 20-20-20 screen break reminder: every 20 minutes, look at an object 20 feet away for 20 seconds.',
    featurePills: [
      '20-minute work interval',
      '20-second distance gaze cue',
      'Audible & visual alert',
      'Runs accurately in background tabs',
    ],
    quickPresets: [
      { icon: '👁️', label: '20 min', sublabel: '20-20-20 Work', sec: 1200 },
      { icon: '🌲', label: '20 sec', sublabel: '20-Sec Gaze', sec: 20 },
      { icon: '💻', label: '30 min', sublabel: 'Extended Screen', sec: 1800 },
      { icon: '👓', label: '45 min', sublabel: 'Studio Block', sec: 2700 },
      { icon: '🌙', label: '60 min', sublabel: 'Hourly Rest', sec: 3600 },
    ],
    steps: [
      { step: 1, title: 'Start the 20-minute screen interval', description: 'Click the 20 min preset and keep this tab open in the background while you work.' },
      { step: 2, title: 'Shift your gaze 20+ feet away', description: 'When the chime sounds, look out a window or across the room at an object at least 20 feet (6 meters) away.' },
      { step: 3, title: 'Run the 20-second gaze preset', description: 'Click the 20 sec preset and blink slowly several times until the completion chime sounds.' },
      { step: 4, title: 'Restart your next 20-minute block', description: 'Return to your screen refreshed and repeat throughout your computer workday.' },
    ],
    guide: {
      tableOfContents: [
        'What Is the 20-20-20 Eye Break Timer?',
        'Why 20 Minutes, 20 Feet, and 20 Seconds?',
        'How to Practice the 20-20-20 Routine at Your Desk',
        'Ergonomic Screen Setup Guidelines',
        'Who Uses an Eye Break Reminder?',
        'Workspace Ergonomics Tips',
        '20-20-20 Ergonomic Reference Table',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is the 20-20-20 Eye Break Timer?',
      whatIsBody: [
        'When looking closely at a monitor or laptop screen for hours, the ciliary muscles inside the eye stay contracted to maintain near focus, and human blink rates typically drop by half. Over a full workday, this sustained near focus can leave eyes feeling dry or tired.',
        'The 20-20-20 guideline—originally popularized by optometrist Dr. Jeffrey Anshel and widely recommended by workplace ergonomics programs—provides a simple habit: after every 20 minutes of screen work, look at something at least 20 feet (about 6 meters) away for at least 20 seconds. Note: This timer is an ergonomic productivity reminder and is not a medical device or a substitute for professional optometric care.',
      ],
      howItWorksTitle: 'Why 20 Minutes, 20 Feet, and 20 Seconds?',
      howItWorksBody: [
        'In optical terms, light rays coming from an object 20 feet (6 meters) or farther away are nearly parallel, allowing the eye’s focusing mechanism to relax from close-range convergence. Taking 20 full seconds gives the focusing muscles enough time to release tension and reminds you to take several full, complete blinks to refresh the tear film.',
        'Across an 8-hour computer shift, running a 20-minute reminder creates 24 brief 20-second pauses—adding up to just 8 total minutes per day while breaking up continuous near-point strain.',
      ],
      calloutNote:
        'Ergonomic Disclaimer: This tool is a general workplace timing aid. If you experience persistent blurred vision, headaches, or eye discomfort, consult a licensed optometrist or ophthalmologist.',
      howToUseTitle: 'How to Practice the 20-20-20 Routine at Your Desk',
      howToUseSteps: [
        'Click the 20 min preset at the start of your coding, writing, or design session.',
        'When the chime sounds, look out a window or down a hallway at an object at least 20 feet (6 meters) away.',
        'Click the 20 sec preset, blink slowly to moisten your eyes, and resume work when the 20 seconds finish.',
      ],
      featuresTitle: 'Ergonomic Screen Setup Guidelines',
      featuresList: [
        'Viewing Distance: Position your monitor 20 to 28 inches (50 to 70 cm)—roughly arm’s length—from your eyes.',
        'Monitor Height: Place the top line of text at or slightly (10°–20°) below horizontal eye level.',
        'Glare Reduction: Position screens perpendicular to bright windows and match screen brightness to ambient room lighting.',
      ],
      practicalExamples: [
        { icon: 'Monitor', title: 'Software Engineers & Analysts', description: 'Breaking up multi-hour coding and spreadsheet sessions.' },
        { icon: 'Palette', title: 'Designers & Video Editors', description: 'Pausing high-detail pixel and timeline inspection.' },
        { icon: 'BookOpen', title: 'Online Students & Researchers', description: 'Reducing fatigue during digital textbook and PDF reading.' },
        { icon: 'CheckSquare', title: 'Writers & Content Creators', description: 'Maintaining comfortable focus across long drafting days.' },
      ],
      whoBenefitsTitle: 'Who Uses an Eye Break Reminder?',
      whoBenefitsList: [
        'Developers, accountants, and data analysts working on multi-monitor setups',
        'Graphic designers, CAD engineers, and video editors',
        'Remote employees and university students reading digital texts',
        'Anyone building healthier daily screen-hygiene habits',
      ],
      tipsTitle: 'Workspace Ergonomics Tips',
      tipsList: [
        'If your desk faces a close wall with no window, stand up during your 20-second pause and look down a hallway or across the room.',
        'Consciously take 3 slow, complete blinks (eyelids gently touching) at the start of every 20-second break.',
      ],
      problemsTitle: '20-20-20 Ergonomic Reference Table',
      problemsRows: [
        { problem: 'Work Interval', cause: '20 minutes (1,200 seconds)', solution: '3 reminders per hour of screen work' },
        { problem: 'Viewing Distance', cause: '20 feet (approx. 6 meters) or farther', solution: 'Relaxes close-range optical convergence' },
        { problem: 'Rest Duration', cause: '20 seconds minimum + slow blinking', solution: 'Total of 1 minute of rest per hour' },
      ],
    },
  },
  'tabata-timer': {
    heroSubtitle:
      'An accurate Tabata HIIT interval timer featuring the classic 20-second work / 10-second rest × 8 rounds (4-minute) protocol.',
    featurePills: [
      '20s work / 10s rest protocol',
      '4-minute total Tabata block',
      'High-visibility gym display',
      'Distinct audio round cues',
    ],
    quickPresets: [
      { icon: '🔥', label: '20 sec', sublabel: 'Tabata Work', sec: 20 },
      { icon: '💨', label: '10 sec', sublabel: 'Tabata Rest', sec: 10 },
      { icon: '⚡', label: '4 min', sublabel: 'Full 8-Round Block', sec: 240 },
      { icon: '🏋️', label: '30 sec', sublabel: 'HIIT Work', sec: 30 },
      { icon: '🧘', label: '60 sec', sublabel: 'Block Recovery', sec: 60 },
    ],
    steps: [
      { step: 1, title: 'Complete a 5-minute dynamic warm-up', description: 'Warm up joints and elevate your heart rate before starting high-intensity 20-second intervals.' },
      { step: 2, title: 'Select your Tabata or HIIT preset', description: 'Choose the 4-minute full 8-round block, or use 20s work / 10s rest intervals.' },
      { step: 3, title: 'Alternate 20s effort and 10s rest for 8 rounds', description: 'Work for 20 seconds and rest for 10 seconds across all 8 cycles (240 seconds total).' },
      { step: 4, title: 'Rest 1–2 minutes between 4-minute blocks', description: 'Recover completely before starting a second Tabata station.' },
    ],
    guide: {
      tableOfContents: [
        'What Is the Tabata Timer?',
        'How the 4-Minute Tabata Protocol Works (20s Work / 10s Rest)',
        'Single-Exercise vs. 4-Station Tabata Circuits',
        'Worked 8-Round Cumulative Split Table',
        'Popular Tabata & HIIT Formats',
        'Who Uses This Tabata Timer?',
        'Safe & Effective Interval Pacing Tips',
        'Tabata 8-Round Cumulative Time Table',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is the Tabata Timer?',
      whatIsBody: [
        'A standard Tabata block lasts exactly 4 minutes (240 seconds) and consists of 8 consecutive cycles. Each 30-second cycle pairs 20 seconds of vigorous exercise with 10 seconds of rest: 8 rounds × (20s work + 10s rest) = 160 seconds of work + 80 seconds of rest = 240 seconds total.',
        'The protocol is named after Japanese researcher Dr. Izumi Tabata and his colleagues at the National Institute of Fitness and Sports in Kanoya, who published their 1996 study comparing moderate-intensity endurance training with 20s/10s interval cycling protocols.',
      ],
      howItWorksTitle: 'Single-Exercise vs. 4-Station Tabata Circuits',
      howItWorksBody: [
        'In a single-modality Tabata, you perform one exercise (such as stationary bike sprints, rowing ergometer intervals, or air squats) for all 8 rounds. Because the 10-second rest window is too short for full recovery, effort accumulates rapidly across rounds 5 through 8.',
        'In group fitness classes and home bodyweight workouts, trainers frequently rotate through 4 exercises twice (for example: Round 1 Push-ups, Round 2 Air Squats, Round 3 Mountain Climbers, Round 4 Plank Hold, then repeat for Rounds 5–8) so local muscular fatigue is distributed across different movement patterns.',
      ],
      calloutNote:
        'Interval Math: 1 Tabata block = 8 × 30s = 4:00. A 20-minute HIIT workout typically combines 4 Tabata blocks (16 minutes of work/rest) separated by 3 × 1-minute water breaks (3 minutes) + 1 minute transition.',
      howToUseTitle: 'How to Time a Tabata Workout',
      howToUseSteps: [
        'Warm up for at least 5 minutes with light cardio and dynamic mobility.',
        'Launch the timer in fullscreen mode on your phone, tablet, or gym TV and enable audio alerts.',
        'Follow the 20-second work / 10-second rest cadence for 8 rounds, then take a 60-to-120-second recovery break.',
      ],
      featuresTitle: 'Worked 8-Round Cumulative Split Schedule',
      featuresList: [
        'Round 1: 0:00–0:20 Work · 0:20–0:30 Rest | Round 2: 0:30–0:50 Work · 0:50–1:00 Rest',
        'Round 3: 1:00–1:20 Work · 1:20–1:30 Rest | Round 4: 1:30–1:50 Work · 1:50–2:00 Rest',
        'Round 5: 2:00–2:20 Work · 2:20–2:30 Rest | Round 6: 2:30–2:50 Work · 2:50–3:00 Rest',
        'Round 7: 3:00–3:20 Work · 3:20–3:30 Rest | Round 8: 3:30–3:50 Work · 3:50–4:00 Rest',
      ],
      practicalExamples: [
        { icon: 'Activity', title: 'Ergometer Sprints', description: '8 × (20s sprint / 10s easy spin) on a stationary bike or rower.' },
        { icon: 'Flame', title: '4-Move Bodyweight Circuit', description: 'Alternating push-ups, squats, lunges, and planks for 4 minutes.' },
        { icon: 'Dumbbell', title: 'Kettlebell Conditioning', description: '20 seconds of two-handed kettlebell swings + 10 seconds rest.' },
        { icon: 'Clock', title: '30s / 30s Aerobic HIIT', description: '1:1 work-to-rest intervals for longer conditioning circuits.' },
      ],
      whoBenefitsTitle: 'Who Uses This Tabata Timer?',
      whoBenefitsList: [
        'Home fitness enthusiasts running bodyweight or kettlebell circuits',
        'Group fitness instructors and boot-camp coaches projecting class timers',
        'Cyclists and rowers performing ergometer conditioning intervals',
        'Physical education teachers running station rotations',
      ],
      tipsTitle: 'Safe & Effective Interval Pacing Tips',
      tipsList: [
        'Choose exercises with simple, safe mechanics (stationary bike, air squats, shadowboxing, battle ropes) rather than complex heavy barbell lifts where form can degrade under fatigue.',
        'Pace Round 1 at a repeatable fast rhythm so your rep count in Round 8 stays close to Round 1.',
      ],
      problemsTitle: 'Tabata 8-Round Cumulative Time Table (4:00 Countdown)',
      problemsRows: [
        { problem: 'Rounds 1 & 2', cause: 'Work 4:00–3:40 · Rest 3:40–3:30 | Work 3:30–3:10 · Rest 3:10–3:00', solution: '1:00 elapsed (40s work / 20s rest)' },
        { problem: 'Rounds 3 & 4', cause: 'Work 3:00–2:40 · Rest 2:40–2:30 | Work 2:30–2:10 · Rest 2:10–2:00', solution: '2:00 elapsed (80s work / 40s rest)' },
        { problem: 'Rounds 5 & 6', cause: 'Work 2:00–1:40 · Rest 1:40–1:30 | Work 1:30–1:10 · Rest 1:10–1:00', solution: '3:00 elapsed (120s work / 60s rest)' },
        { problem: 'Rounds 7 & 8', cause: 'Work 1:00–0:40 · Rest 0:40–0:30 | Work 0:30–0:10 · Rest 0:10–0:00', solution: '4:00 complete (160s work / 80s rest)' },
      ],
    },
  },
  'boxing-timer': {
    heroSubtitle:
      'A high-visibility boxing, Muay Thai, and MMA round timer with 3-minute pro rounds, 2-minute amateur rounds, 5-minute MMA rounds, and 1-minute corner rest.',
    featurePills: [
      '3m Pro & 2m Amateur rounds',
      '5m MMA & grappling rounds',
      '60s & 30s corner rest presets',
      'Glove-friendly fullscreen controls',
    ],
    quickPresets: [
      { icon: '🥊', label: '3 min', sublabel: 'Pro Boxing Round', sec: 180 },
      { icon: '🥇', label: '2 min', sublabel: 'Amateur / Youth', sec: 120 },
      { icon: '🥋', label: '5 min', sublabel: 'MMA / BJJ Round', sec: 300 },
      { icon: '🪑', label: '1 min', sublabel: 'Corner Rest', sec: 60 },
      { icon: '⚡', label: '30 sec', sublabel: 'Burnout Drill', sec: 30 },
    ],
    steps: [
      { step: 1, title: 'Select your combat sport round length', description: 'Click 3 min for pro boxing/Muay Thai, 2 min for amateur/fitness boxing, or 5 min for MMA/BJJ.' },
      { step: 2, title: 'Enable fullscreen before putting on gloves', description: 'Prop your phone, tablet, or laptop where it is clearly visible from the heavy bag or mat.' },
      { step: 3, title: 'Work until the round bell', description: 'Maintain footwork, combinations, or grappling pace until the completion bell rings.' },
      { step: 4, title: 'Run the 1-minute corner rest preset', description: 'Take 60 seconds of slow nasal breathing before starting your next round.' },
    ],
    guide: {
      tableOfContents: [
        'What Is the Boxing Round Timer?',
        'Standard Round Durations for Boxing, Muay Thai, MMA & BJJ',
        'Structuring a 6- to 12-Round Gym Session',
        'Worked 45-Minute Boxing Workout Breakdown',
        'Combat Sport & Conditioning Applications',
        'Who Uses This Boxing Timer?',
        'Boxing Timer Training Tips',
        'Official Combat Sport Round & Rest Reference Table',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is the Boxing Round Timer?',
      whatIsBody: [
        'Whether you are hitting the heavy bag, working mitts with a coach, drilling takedowns, or rolling in Brazilian Jiu-Jitsu, training in timed rounds teaches you to manage energy output and recovery under realistic time constraints.',
        'Different combat sports govern round durations differently. Professional boxing and Muay Thai use 3-minute action rounds separated by 1-minute corner rest periods, whereas Unified Rules MMA uses 5-minute rounds and IBJJF Jiu-Jitsu matches range from 5 to 10 minutes depending on belt rank.',
      ],
      howItWorksTitle: 'Structuring a 6- to 12-Round Gym Session',
      howItWorksBody: [
        'A complete 45-minute boxing workout follows a 3-minute round / 1-minute rest rhythm (4 minutes per full cycle): 3 rounds of jump rope and shadowboxing (12 minutes), 5 rounds on the heavy bag or focus mitts (20 minutes), and 3 rounds of speed bag, double-end bag, and core conditioning (12 minutes).',
        'During the final 30 seconds of a 3-minute round, coaches often call for a "burnout" (continuous straight punches or high knees until the bell) to simulate late-round fatigue.',
      ],
      calloutNote:
        'Cycle Math: At 3 minutes work + 1 minute rest (4 minutes per round cycle), 6 rounds take 24 minutes, 8 rounds take 32 minutes, 10 rounds take 40 minutes, and a full 12-round championship distance takes 47 minutes (including 11 rest periods).',
      howToUseTitle: 'How to Run a Boxing Round Session',
      howToUseSteps: [
        'Click 3 min (Boxing/Muay Thai), 2 min (Amateur/Fitness), or 5 min (MMA/BJJ).',
        'Turn up device volume and enter Fullscreen mode before wrapping hands or putting on gloves.',
        'Use the 1 min Corner Rest preset between active rounds.',
      ],
      featuresTitle: 'Worked 45-Minute Boxing Workout Breakdown (11 Rounds)',
      featuresList: [
        'Rounds 1–2 (Jump Rope): 2 × 3m rounds (with 1m rest) to warm up calves, shoulders, and rhythm.',
        'Round 3 (Shadowboxing): 1 × 3m round focusing on stance, jab mechanics, and head movement.',
        'Rounds 4–8 (Heavy Bag / Mitts): 5 × 3m rounds working specific combination themes with 30-second end-of-round burnouts.',
        'Rounds 9–11 (Conditioning & Core): 3 × 3m rounds of medicine ball slams, planks, and footwork drills.',
      ],
      practicalExamples: [
        { icon: 'Activity', title: 'Heavy Bag & Mitt Work', description: '3-minute rounds with 60-second rest for combination drilling.' },
        { icon: 'Flame', title: 'Muay Thai Pad Rounds', description: '3-minute kick, knee, and clinch conditioning blocks.' },
        { icon: 'Shield', title: 'MMA & BJJ Live Sparring', description: '5-minute grappling and positional sparring rounds.' },
        { icon: 'Clock', title: 'Jump Rope Warm-Up', description: '3 consecutive 3-minute jump rope rounds to start training.' },
      ],
      whoBenefitsTitle: 'Who Uses This Boxing Timer?',
      whoBenefitsList: [
        'Boxers, kickboxers, and Muay Thai practitioners training on heavy bags',
        'MMA fighters and Brazilian Jiu-Jitsu academies timing 5-to-10-minute rolling rounds',
        'Personal trainers holding focus mitts or Thai pads for clients',
        'Home garage-gym athletes running jump-rope and shadowboxing workouts',
      ],
      tipsTitle: 'Boxing Timer Training Tips',
      tipsList: [
        'Assign a specific technical theme to each bag round (Round 1: jab and footwork only; Round 2: 3-punch combinations + slips; Round 3: inside work and body shots).',
        'Use the Spacebar on a laptop or large tap targets on a tablet to restart rounds easily while wearing hand wraps.',
      ],
      problemsTitle: 'Official Combat Sport Round & Rest Reference Table',
      problemsRows: [
        { problem: 'Men’s Pro & Olympic Boxing', cause: '3 min Round · 1 min Corner Rest', solution: '3 rounds (Olympic) or 4–12 rounds (Pro)' },
        { problem: 'Youth / Fitness Boxing', cause: '2 min Round · 1 min Corner Rest', solution: '3 to 6 rounds per session' },
        { problem: 'Muay Thai (Stadium / Pro)', cause: '3 min Round · 2 min (or 1 min) Rest', solution: '3 to 5 rounds total' },
        { problem: 'Unified Rules MMA', cause: '5 min Round · 1 min Corner Rest', solution: '3 rounds (Non-title) or 5 rounds (Title)' },
        { problem: 'IBJJF Brazilian Jiu-Jitsu', cause: '5m (White), 6m (Blue), 7m (Purple), 8m (Brown), 10m (Black)', solution: 'Continuous single-round match' },
      ],
    },
  },
  'meditation-timer': {
    heroSubtitle:
      'A calm, minimalist meditation timer with gentle singing-bowl chime options and preset mindfulness durations from 5 to 60 minutes.',
    featurePills: [
      '5, 10, 15, 20, 30 & 60m sits',
      'Gentle completion chime',
      'Dark-mode friendly display',
      'Zero ads or visual clutter',
    ],
    quickPresets: [
      { icon: '🌱', label: '5 min', sublabel: 'Quick Centering', sec: 300 },
      { icon: '🧘', label: '10 min', sublabel: 'Daily Mindfulness', sec: 600 },
      { icon: '🔔', label: '15 min', sublabel: 'Breath Awareness', sec: 900 },
      { icon: '🪷', label: '20 min', sublabel: 'Standard Sit', sec: 1200 },
      { icon: '🌙', label: '30 min', sublabel: 'Deep Practice', sec: 1800 },
    ],
    steps: [
      { step: 1, title: 'Select your sit duration', description: 'Choose 5, 10, 15, 20, or 30 minutes (or enter a custom duration up to 60+ minutes).' },
      { step: 2, title: 'Check that your chime volume is gentle', description: 'Set your speaker volume to a comfortable level so the ending chime is soft and clear.' },
      { step: 3, title: 'Settle your posture and press Start', description: 'Sit upright on a chair, cushion, or bench and lower your gaze or close your eyes.' },
      { step: 4, title: 'Rest attention until the chime', description: 'Let go of checking the clock until the completion tone gently marks the end of your sit.' },
    ],
    guide: {
      tableOfContents: [
        'What Is the Meditation Timer?',
        'Choosing a Meditation Duration for Your Practice',
        'How to Start an Unassisted Silent Sit',
        'Common Meditation Session Lengths',
        'Meditation & Contemplative Practices',
        'Who Uses This Meditation Timer?',
        'Tips for Uninterrupted Practice',
        'Meditation Session Progression Guide',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is the Meditation Timer?',
      whatIsBody: [
        'One of the most common obstacles during silent meditation is wondering how much time has passed. When you rely on a quiet, trustworthy meditation timer, you delegate timekeeping to the clock—freeing your attention to rest on the breath, bodily sensations, or open awareness until the chime sounds.',
        'Unlike mobile apps that require accounts, subscriptions, or constant spoken prompts, this browser meditation timer provides an uncluttered silent countdown that respects your stillness.',
      ],
      howItWorksTitle: 'Choosing a Meditation Duration for Your Practice',
      howItWorksBody: [
        'If you are building a daily habit, consistency matters more than duration. A daily 10-minute sit each morning is far more sustainable than an occasional 45-minute session. Once 10 minutes feels comfortable, gradually step up to 15 or 20 minutes.',
        'For practitioners following structured traditions—such as 20-minute twice-daily sits, 25-to-30-minute Zazen periods, or 45-to-60-minute Insight (Vipassana) sittings—you can select a preset or enter any custom duration.',
      ],
      calloutNote:
        'Habit Tip: Anchor your daily 10- or 20-minute sit to an existing morning routine (such as right after waking up and drinking water) before checking messages or news.',
      howToUseTitle: 'How to Start an Unassisted Silent Sit',
      howToUseSteps: [
        'Click your desired preset (5m, 10m, 15m, 20m, or 30m) and silence phone notifications.',
        'Settle into a comfortable seated posture with an upright, unstrained spine.',
        'Press Start and rest your attention on your chosen anchor until the gentle chime rings.',
      ],
      featuresTitle: 'Common Meditation Session Lengths',
      featuresList: [
        '5 Minutes (Quick Reset): Transitioning between work meetings or centering before a stressful task.',
        '10 to 15 Minutes (Daily Foundation): Ideal daily mindfulness duration for beginners and busy schedules.',
        '20 Minutes (Standard Twice-Daily Sit): Classic duration for mantra, breath-awareness, and relaxation practices.',
        '30 to 45 Minutes (Deep Contemplative Sit): Standard length for Zazen, Vipassana, and MBSR group sittings.',
      ],
      practicalExamples: [
        { icon: 'Wind', title: '10m Breath Mindfulness', description: 'Daily morning anchor focusing on natural inhalation and exhalation.' },
        { icon: 'Heart', title: '20m Silent Sit', description: 'Standard midday or evening mindfulness and body-scan session.' },
        { icon: 'Clock', title: '25m–30m Zazen Period', description: 'Traditional seated meditation block followed by 5 minutes of walking.' },
        { icon: 'Moon', title: '45m–60m Retreat Sit', description: 'Extended silent practice for experienced practitioners.' },
      ],
      whoBenefitsTitle: 'Who Uses This Meditation Timer?',
      whoBenefitsList: [
        'Daily mindfulness practitioners who prefer silent, unguided sits',
        'Yoga, Zen, and insight meditation groups timing shared sittings',
        'Students and professionals taking a 5-to-10-minute midday mental reset',
        'Anyone seeking a privacy-first timer with zero sign-up walls',
      ],
      tipsTitle: 'Tips for Uninterrupted Practice',
      tipsList: [
        'Enable Do Not Disturb on your phone and computer before starting your meditation countdown.',
        'When the ending chime sounds, take three slow breaths before opening your eyes or standing up.',
      ],
      problemsTitle: 'Meditation Session Progression Guide',
      problemsRows: [
        { problem: '5 to 10 Minutes', cause: 'Beginners & busy workdays', solution: 'Establishes a consistent daily sitting habit' },
        { problem: '15 to 20 Minutes', cause: 'Intermediate daily practice', solution: 'Allows initial mental chatter to settle' },
        { problem: '30 to 45 Minutes', cause: 'Sustained contemplative sit', solution: 'Standard length for group sits and MBSR practice' },
      ],
    },
  },
  'breathing-timer': {
    heroSubtitle:
      'A paced breathing timer for Box Breathing (4-4-4-4), 4-7-8 relaxation breathing, and 5-5 coherent breathing sessions.',
    featurePills: [
      'Box Breathing (4-4-4-4)',
      '4-7-8 Relaxation cadence',
      'Coherent 5.5–6 breaths/min',
      '2, 3, 5 & 10m session presets',
    ],
    quickPresets: [
      { icon: '🌬️', label: '2 min', sublabel: 'Quick Reset', sec: 120 },
      { icon: '🟦', label: '3 min', sublabel: '11 Box Cycles', sec: 180 },
      { icon: '🧘', label: '5 min', sublabel: 'Coherent Session', sec: 300 },
      { icon: '🌿', label: '10 min', sublabel: 'Deep Wind-Down', sec: 600 },
      { icon: '🌙', label: '15 min', sublabel: 'Evening Calm', sec: 900 },
    ],
    steps: [
      { step: 1, title: 'Select a session duration (2 to 5 minutes)', description: 'Click 2 min for a quick pre-meeting reset, 3 min for 11 Box Breathing cycles, or 5 min for coherent breathing.' },
      { step: 2, title: 'Sit comfortably and breathe through the nose', description: 'Keep inhalations light, quiet, and low in the ribs rather than taking forceful chest breaths.' },
      { step: 3, title: 'Follow your chosen cadence ratio', description: 'Use 4-4-4-4 (Box), 4-7-8 (Relaxation), or 5-5 (Coherent) until the gentle completion chime sounds.' },
      { step: 4, title: 'Return to natural breathing', description: 'Pause for a moment after the chime before resuming your activity.' },
    ],
    guide: {
      tableOfContents: [
        'What Is the Paced Breathing Timer?',
        'Cycle Math for Box Breathing (4-4-4-4), 4-7-8 & Coherent Breathing',
        'How to Run a Paced Breathing Session',
        'Worked Breath Cadence Breakdown',
        'When to Use a Breathing Timer',
        'Who Uses This Breathing Timer?',
        'Tips for Comfortable Paced Breathing',
        'Paced Breathing Cadence & Cycle Math Table',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is the Paced Breathing Timer?',
      whatIsBody: [
        'Paced breathing exercises use a steady, deliberate count to slow your respiratory rate from the typical resting pace of 12–18 breaths per minute down to 3–6 breaths per minute. Slowing the breath—especially lengthening the exhale—is widely used for relaxation, pre-performance composure, and winding down before sleep.',
        'This timer bounds your breathing practice to a clear 2-, 3-, 5-, or 10-minute session so you can focus entirely on your cadence. Note: Paced breathing is a general relaxation and mindfulness practice, not a medical treatment. Always breathe gently without straining, and return to normal breathing if you ever feel lightheaded.',
      ],
      howItWorksTitle: 'Cycle Math for Box Breathing (4-4-4-4), 4-7-8 & Coherent Breathing',
      howItWorksBody: [
        '1. Box Breathing (4-4-4-4): Inhale gently through the nose for 4 seconds, hold comfortably for 4 seconds, exhale smoothly for 4 seconds, and pause for 4 seconds. Each full cycle takes 4 + 4 + 4 + 4 = 16 seconds (3.75 breaths per minute). A 3-minute (180s) timer fits 11 full cycles.',
        '2. 4-7-8 Breathing: Inhale quietly through the nose for 4 seconds, hold for 7 seconds, and exhale softly through the mouth for 8 seconds. Each cycle takes 4 + 7 + 8 = 19 seconds (about 3.15 breaths per minute). Four cycles take 76 seconds; eight cycles take 152 seconds (~2.5 minutes).\n3. Coherent / Resonance Breathing (5-5): Inhale smoothly for 5 seconds and exhale smoothly for 5 seconds with no holds. Each cycle takes 10 seconds, producing exactly 6 breaths per minute (30 breaths in a 5-minute session).',
      ],
      calloutNote:
        'Comfort Rule: Never force a maximum lungful of air during paced breathing. Slow breathing is most relaxing when each breath is soft, quiet, and unstrained.',
      howToUseTitle: 'How to Run a Paced Breathing Session',
      howToUseSteps: [
        'Choose a 2-minute, 3-minute, or 5-minute session preset.',
        'Pick one breathing ratio (e.g., 5s In / 5s Out for Coherent Breathing, or 4-4-4-4 for Box Breathing).',
        'Follow the seconds display calmly until the ending chime rings.',
      ],
      featuresTitle: 'Worked Breath Cadence Breakdown',
      featuresList: [
        'Box Breathing (4-4-4-4 = 16s cycle): 3.75 breaths/min · 7.5 cycles in 2m · 11.25 cycles in 3m.',
        '4-7-8 Breathing (4+7+8 = 19s cycle): 3.16 breaths/min · 4 cycles = 76s · 8 cycles = 152s.',
        'Coherent Breathing (5s In / 5s Out = 10s cycle): 6.0 breaths/min · 18 cycles in 3m · 30 cycles in 5m.',
        'Extended Exhale (4s In / 6s Out = 10s cycle): 6.0 breaths/min with a 1:1.5 inhale-to-exhale ratio and zero breath holds.',
      ],
      practicalExamples: [
        { icon: 'Mic', title: '2m Pre-Presentation Reset', description: 'Steadying nerves before stepping onto a stage or video call.' },
        { icon: 'Monitor', title: '3m Afternoon Desk Pause', description: 'Transitioning between intense meetings or study blocks.' },
        { icon: 'Activity', title: '5m Post-Workout Cooldown', description: 'Down-regulating heart rate and breathing cadence after exercise.' },
        { icon: 'Moon', title: '5m Bedtime Wind-Down', description: 'Slow extended-exhale breathing before sleep.' },
      ],
      whoBenefitsTitle: 'Who Uses This Breathing Timer?',
      whoBenefitsList: [
        'Public speakers, musicians, and test-takers calming pre-event nerves',
        'Office workers taking a 2-to-3-minute respiratory reset between meetings',
        'Athletes cooling down after high-intensity conditioning sessions',
        'Evening meditators winding down before sleep',
      ],
      tipsTitle: 'Tips for Comfortable Paced Breathing',
      tipsList: [
        'If a 4-second hold feels too long at first, shorten Box Breathing to 3-3-3-3 (12-second cycle) or skip holds altogether and use 4s inhale / 6s exhale.',
        'Focus on a smooth, unhurried transition between inhalation and exhalation.',
      ],
      problemsTitle: 'Paced Breathing Cadence & Cycle Math Table',
      problemsRows: [
        { problem: 'Box Breathing (4-4-4-4)', cause: '4s In · 4s Hold · 4s Out · 4s Hold', solution: '16 sec per cycle (3.75 breaths/min · 11 cycles in 3m)' },
        { problem: '4-7-8 Relaxation', cause: '4s In · 7s Hold · 8s Out', solution: '19 sec per cycle (3.15 breaths/min · 4 cycles = 76s)' },
        { problem: 'Coherent Breathing (5-5)', cause: '5s In · 0s Hold · 5s Out', solution: '10 sec per cycle (6.0 breaths/min · 30 cycles in 5m)' },
        { problem: 'Extended Exhale (4-6)', cause: '4s In · 0s Hold · 6s Out', solution: '10 sec per cycle (6.0 breaths/min · no breath holds)' },
      ],
    },
  },
  'chess-clock': {
    heroSubtitle:
      'A responsive two-player chess and board-game timer supporting Bullet, Blitz, Rapid, and Fischer increment time controls.',
    featurePills: [
      'Bullet, Blitz & Rapid presets',
      'Fischer increment (+sec/move)',
      'Move counter per player',
      'Keyboard & touch tap switching',
    ],
    steps: [
      { step: 1, title: 'Select a time control & increment', description: 'Choose 1+0 (Bullet), 3+2 or 5+0 (Blitz), 10+0 or 15+10 (Rapid), or set custom base minutes and increment seconds.' },
      { step: 2, title: 'Position the device beside the board', description: 'Place your phone or tablet flat between both players, or use a laptop keyboard within reach.' },
      { step: 3, title: 'Tap your clock after each move', description: 'Tap your side of the screen (or press the Spacebar) to pause your timer, add the Fischer increment, and start your opponent’s timer.' },
      { step: 4, title: 'Watch for move counts & flag alerts', description: 'The clock tracks total moves and alerts immediately when either player reaches 00:00.' },
    ],
    guide: {
      tableOfContents: [
        'What Is the Two-Player Chess Clock?',
        'How Fischer Increment (Time + Increment) Works',
        'How to Use the Chess Clock Over the Board',
        'Official FIDE Bullet, Blitz & Rapid Time Controls',
        'Chess & Tabletop Applications',
        'Who Uses This Chess Clock?',
        'Over-the-Board Clock Etiquette Rules',
        'FIDE & Club Chess Time Control Reference Table',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is the Two-Player Chess Clock?',
      whatIsBody: [
        'A two-player chess clock uses two linked countdown timers that never run simultaneously. While Player 1 (White) is thinking, only White’s clock counts down. The instant White completes a move and taps the clock, White’s timer pauses and Player 2’s (Black’s) timer immediately begins counting down.',
        'Modern tournament and online chess time controls are written in the shorthand format "M+S", where M is the starting base time in minutes per player and S is the Fischer increment in seconds added after every completed move.',
      ],
      howItWorksTitle: 'How Fischer Increment (Time + Increment) Works',
      howItWorksBody: [
        'Introduced by former World Chess Champion Bobby Fischer in his 1988 patent (US Patent 4,884,255), the Fischer increment adds a fixed number of seconds to a player’s remaining time every time they press their clock. If you play faster than the increment, your remaining clock time increases.',
        'Worked Example (3+2 Blitz): Each player starts with 3 minutes (180 seconds) and receives +2 seconds per move. If you take 1.2 seconds to play Move 1 and press your clock, your net time change is −1.2s + 2.0s = +0.8 seconds, leaving you with 3:00.8. Across a 40-move game, each player receives 3m + (40 × 2s) = 4 minutes 20 seconds of total thinking time, meaning a full game finishes in under 9 minutes.',
      ],
      calloutNote:
        'FIDE Rule 6.2.3: In over-the-board play, a player must press the clock with the same hand that moved the piece on the chessboard.',
      howToUseTitle: 'How to Use the Chess Clock Over the Board',
      howToUseSteps: [
        'Select your preferred time control (such as 3+2 Blitz or 10+0 Rapid).',
        'Black taps their side of the clock to start White’s timer for Move 1.',
        'After moving a piece on the board, tap your side of the screen (or press Spacebar) to hand the turn to your opponent.',
      ],
      featuresTitle: 'Official FIDE Bullet, Blitz & Rapid Time Controls',
      featuresList: [
        '1+0 & 2+1 Bullet: Ultra-fast games lasting 2 to 6 minutes total.',
        '3+0, 3+2 & 5+0 Blitz: Standard club and coffeehouse speed chess lasting 6 to 12 minutes.',
        '10+0 & 15+10 Rapid: Serious rapid tournament time controls allowing deeper calculation.',
        '25+0 Scrabble / Board Game Mode: Standard tournament word and strategy game allocation.',
      ],
      practicalExamples: [
        { icon: 'Flame', title: '3+2 & 5+0 Club Blitz', description: 'Fast casual games at chess clubs, coffee shops, and parks.' },
        { icon: 'Trophy', title: '10+0 & 15+10 Rapid Chess', description: 'Tournament preparation and serious training games.' },
        { icon: 'BookOpen', title: 'Scrabble & Go Matches', description: '25-minute per player tournament word and territory games.' },
        { icon: 'Gamepad2', title: 'Strategy Board Games', description: 'Preventing analysis paralysis in two-player tabletop games.' },
      ],
      whoBenefitsTitle: 'Who Uses This Chess Clock?',
      whoBenefitsList: [
        'Club and scholastic chess players practicing over-the-board games',
        'School chess coaches running classroom tournaments without physical clocks',
        'Scrabble, Go, Shogi, and backgammon players',
        'Tabletop board gamers adding turn time limits',
      ],
      tipsTitle: 'Over-the-Board Clock Etiquette Rules',
      tipsList: [
        'Always complete your physical move on the board before tapping the screen.',
        'If a piece is accidentally knocked over, press the center Pause button before resetting the position.',
      ],
      problemsTitle: 'FIDE & Club Chess Time Control Reference Table',
      problemsRows: [
        { problem: 'Bullet (1+0 or 2+1)', cause: 'Under 3 minutes per player', solution: 'Total game length: 2 to 6 minutes' },
        { problem: 'Blitz (3+0, 3+2, 5+0, 5+3)', cause: '3 to 10 minutes per player', solution: 'Total game length: 6 to 15 minutes' },
        { problem: 'Rapid (10+0, 15+10, 25+10)', cause: 'More than 10m and under 60m per player', solution: 'Total game length: 20 to 65 minutes' },
      ],
    },
  },
  'quiz-timer': {
    heroSubtitle:
      'A rapid-reset quiz, trivia night, and game-show countdown timer with 5, 10, 15, 30, and 60-second question presets and buzzer audio.',
    featurePills: [
      '5s, 10s, 15s, 30s & 60s presets',
      'One-click question reset',
      'Audible time-up buzzer',
      'High-contrast projector mode',
    ],
    quickPresets: [
      { icon: '⚡', label: '5 sec', sublabel: 'Lightning Round', sec: 5 },
      { icon: '❓', label: '10 sec', sublabel: 'Recall Question', sec: 10 },
      { icon: '🔔', label: '15 sec', sublabel: 'Trivia Toss-Up', sec: 15 },
      { icon: '🧩', label: '30 sec', sublabel: 'Team Deliberation', sec: 30 },
      { icon: '🧮', label: '60 sec', sublabel: 'Math / Bonus Round', sec: 60 },
    ],
    steps: [
      { step: 1, title: 'Select the seconds-per-question preset', description: 'Click 5s or 10s for lightning recall, 15s for toss-ups, or 30s–60s for team deliberation.' },
      { step: 2, title: 'Read the question aloud first', description: 'Finish reading the entire prompt clearly before starting the countdown.' },
      { step: 3, title: 'Start the countdown & wait for the buzzer', description: 'Teams lock in their answers before the timer reaches 00:00 and chimes.' },
      { step: 4, title: 'Click Reset for the next question', description: 'Reload the exact same duration in one click or press the R key.' },
    ],
    guide: {
      tableOfContents: [
        'What Is the Quiz Timer?',
        'Recommended Seconds Per Question by Format',
        'How to Host a Timed Quiz Round',
        'Standard Trivia & Academic Bowl Pacing',
        'Quiz & Game Show Formats',
        'Who Uses This Quiz Timer?',
        'Quizmaster Hosting Tips',
        'Quiz & Competition Timing Reference Table',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is the Quiz Timer?',
      whatIsBody: [
        'A well-paced quiz depends on consistent question timing. If teams are given an indefinite window to deliberate, a 20-question trivia night can drag on for hours—and in academic competitions, unequal response windows feel unfair to contestants.',
        'Using a dedicated quiz timer on a shared screen creates natural excitement, prevents smartphone look-ups during pub trivia, and trains students to retrieve facts rapidly under exam-like conditions.',
      ],
      howItWorksTitle: 'Recommended Seconds Per Question by Format',
      howItWorksBody: [
        'Match your countdown preset to the cognitive load of the question: Fact-recall and buzzer toss-up questions require only 5 to 10 seconds once the host finishes reading the prompt. Multiple-choice and short-answer classroom review questions work best at 15 to 20 seconds.',
        'For pub trivia table deliberation where 4 to 6 teammates whisper and write an answer on a slip, 30 to 45 seconds is the sweet spot. For multi-step mental math, logic puzzles, or final wager questions, allow 60 seconds.',
      ],
      calloutNote:
        'Host Rule: Always finish reading the question out loud before pressing Start so every participant hears the complete prompt before the clock begins.',
      howToUseTitle: 'How to Host a Timed Quiz Round',
      howToUseSteps: [
        'Select your round preset (5s, 10s, 15s, 30s, or 60s) and enter Fullscreen on the room projector.',
        'Read the prompt clearly, then press Spacebar or click Start.',
        'Call "Pencils down" when the buzzer sounds, then press R to reset for the next question.',
      ],
      featuresTitle: 'Standard Trivia & Academic Bowl Pacing',
      featuresList: [
        '5–10 Seconds (Lightning / Toss-Up): Individual buzzer recall in Science Bowl and Quiz Bowl.',
        '15–20 Seconds (Bonus / Classroom Review): Quick 3-person team consultation or whiteboard flash-up.',
        '30–45 Seconds (Pub Trivia Deliberation): Table consensus and written answer submission.',
        '60 Seconds (Calculation / Wager Round): Multi-step math problems and final championship questions.',
      ],
      practicalExamples: [
        { icon: 'GraduationCap', title: 'Classroom Exit Tickets', description: '10-question rapid review at the end of a lesson.' },
        { icon: 'Trophy', title: 'Academic & Science Bowls', description: '5-second toss-up and 20-second bonus question timing.' },
        { icon: 'Mic', title: 'Pub & Corporate Trivia', description: '30-second table deliberation countdowns.' },
        { icon: 'Gamepad2', title: 'Family Party Games', description: '30-to-60-second charades, drawing, and word-guessing turns.' },
      ],
      whoBenefitsTitle: 'Who Uses This Quiz Timer?',
      whoBenefitsList: [
        'K–12 and university educators running interactive review games',
        'Academic Quiz Bowl, Science Bowl, and Mathcounts coaches',
        'Pub trivia hosts and corporate event emcees',
        'Families hosting game nights and party trivia',
      ],
      tipsTitle: 'Quizmaster Hosting Tips',
      tipsList: [
        'Use keyboard shortcuts (Space to start/pause, R to reset) so you can keep your eyes on the teams rather than hunting for buttons.',
        'Announce a "10-second lightning round" for tie-breakers to resolve deadlocks in under 2 minutes.',
      ],
      problemsTitle: 'Quiz & Competition Timing Reference Table',
      problemsRows: [
        { problem: 'Buzzer Toss-Up / Lightning Recall', cause: 'Single-fact recall after prompt read', solution: '5 to 10 seconds' },
        { problem: 'Academic Bowl Bonus Question', cause: 'Quick 3-person team consultation', solution: '20 seconds' },
        { problem: 'Pub Trivia / Classroom Group Table', cause: 'Writing answer on slip or whiteboard', solution: '30 to 45 seconds' },
        { problem: 'Calculation / Final Wager Question', cause: 'Multi-step math or point wagering', solution: '60 seconds' },
      ],
    },
  },
  'classroom-scoreboard': {
    heroSubtitle:
      'An interactive multi-team digital scoreboard for classroom review games, trivia nights, and intramural competitions.',
    featurePills: [
      '2 to 8 custom teams',
      'Instant +1, +5, +10 & −1 buttons',
      'Editable team names',
      'Projector-ready fullscreen view',
    ],
    steps: [
      { step: 1, title: 'Add & rename your teams', description: 'Create cards for 2 to 8 teams and type custom team names (e.g., Table 1, Red House, or trivia team names).' },
      { step: 2, title: 'Project on the classroom smartboard', description: 'Display the scoreboard in fullscreen mode or alongside your quiz questions.' },
      { step: 3, title: 'Award or deduct points live', description: 'Click the +1, +5, +10, or −1 buttons on any team card as questions are answered.' },
      { step: 4, title: 'Reset scores for the next round', description: 'Clear point totals in one click while keeping your custom team names intact.' },
    ],
    guide: {
      tableOfContents: [
        'What Is the Classroom Scoreboard?',
        'Structuring Fair Point Systems for Group Games',
        'How to Set Up & Run Your Live Scoreboard',
        'Recommended Point Increments by Game Type',
        'Where to Use the Digital Scoreboard',
        'Who Uses This Scoreboard?',
        'Tips for Engaging Classroom Competitions',
        'Recommended Point Systems by Game Format',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is the Classroom Scoreboard?',
      whatIsBody: [
        'Keeping score on a whiteboard during a fast-paced classroom review game or trivia contest forces the teacher or host to turn their back on the room and constantly erase and rewrite numbers. A projected digital scoreboard updates totals instantaneously and keeps every team focused on the standings.',
        'Whether you are running a 4-team Jeopardy-style review, tracking table points across a week, or hosting a field-day competition, you can customize team names and point increments in seconds.',
      ],
      howItWorksTitle: 'Structuring Fair Point Systems for Group Games',
      howItWorksBody: [
        'For standard classroom review games, simple integer systems (+1 point for a correct answer, +2 points for a bonus explanation) are easiest for students to follow. For game-show formats, using +10 or +100 point increments creates an arcade feel.',
        'All team names and scores are processed locally in your browser so no student data is ever transmitted to external servers.',
      ],
      calloutNote:
        'Engagement Tip: Make the final round worth double points (+2 or +20) so trailing teams remain mathematically in contention right up to the final question.',
      howToUseTitle: 'How to Set Up & Run Your Live Scoreboard',
      howToUseSteps: [
        'Click Add Team to create cards matching your classroom tables or trivia groups.',
        'Click any team title to type a custom name.',
        'Use the increment/decrement buttons to update scores live in front of the room.',
      ],
      featuresTitle: 'Recommended Point Increments by Game Type',
      featuresList: [
        'Standard +1 / −1 Mode: Best for quick 10-question exit tickets and vocabulary review.',
        'Tiered +5 / +10 Mode: Best for multi-round trivia where harder questions carry higher point values.',
        'Weekly Table Points: Track positive table transitions and readiness across an entire school day.',
      ],
      practicalExamples: [
        { icon: 'GraduationCap', title: 'Exam Review Games', description: 'Tracking team points during vocabulary, history, and science trivia.' },
        { icon: 'Users', title: 'Classroom House Points', description: 'Rewarding table groups for participation and clean transitions.' },
        { icon: 'Trophy', title: 'PE & Intramural Sports', description: 'Tabletop scoring for volleyball, badminton, cornhole, and table tennis.' },
        { icon: 'Mic', title: 'Club & Camp Competitions', description: 'Live standings for youth groups, camps, and trivia nights.' },
      ],
      whoBenefitsTitle: 'Who Uses This Scoreboard?',
      whoBenefitsList: [
        'Elementary, middle, and high school teachers gamifying test review',
        'Physical education coaches running gym and field-day games',
        'Youth group leaders, camp counselors, and after-school clubs',
        'Trivia hosts and corporate training facilitators',
      ],
      tipsTitle: 'Tips for Engaging Classroom Competitions',
      tipsList: [
        'Pair the Classroom Scoreboard in one browser tab with the Quiz Timer or Random Name Picker in an adjacent tab.',
        'Award +1 bonus point for clear teamwork and showing work so speed is not the only path to winning.',
      ],
      problemsTitle: 'Recommended Point Systems by Game Format',
      problemsRows: [
        { problem: 'Quick Exit-Ticket Review (10–15 min)', cause: 'Fast single-question rounds', solution: '+1 per correct answer · +2 for streak bonus' },
        { problem: 'Multi-Round Trivia / Jeopardy (30–45 min)', cause: 'Tiered question difficulty', solution: '+10 / +20 / +30 points by difficulty tier' },
        { problem: 'Daily Table Behavior & Participation', cause: 'Full-period classroom management', solution: '+1 for ready tables · target team goal (e.g., 15 pts)' },
      ],
    },
  },
  'classroom-noise-meter': {
    heroSubtitle:
      'A privacy-first visual classroom noise meter that uses your device microphone to display real-time room volume levels and too-loud alerts.',
    featurePills: [
      'Real-time visual volume bar',
      'Adjustable threshold slider',
      '100% local browser audio (no recording)',
      'Fullscreen smartboard display',
    ],
    steps: [
      { step: 1, title: 'Click Start Microphone & allow access', description: 'Click the activation button and select Allow when your browser requests local microphone permission.' },
      { step: 2, title: 'Calibrate for your room & activity', description: 'Observe the meter for 5 seconds of target classroom chatter and set the threshold slider 10–15 points above that baseline.' },
      { step: 3, title: 'Project in Fullscreen mode', description: 'Display the live color-coded meter on your smartboard so students can self-regulate their volume.' },
      { step: 4, title: 'Adjust threshold as activities change', description: 'Lower the threshold for silent reading (25–35) or raise it for small-group lab work (60–75).' },
    ],
    guide: {
      tableOfContents: [
        'What Is the Visual Classroom Noise Meter?',
        'How Browser Microphone Amplitude Is Measured (0–100 Scale vs. dB SPL)',
        'How to Calibrate & Run the Noise Meter in Class',
        'Classroom Voice-Level Modes (Levels 0 to 3)',
        'Practical Classroom Applications',
        'Who Uses This Classroom Noise Meter?',
        'Calibration & Privacy Best Practices',
        'Classroom Voice Level & Threshold Calibration Guide',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is the Visual Classroom Noise Meter?',
      whatIsBody: [
        'During group work or independent practice, classroom chatter naturally escalates as each table speaks slightly louder to be heard over neighboring tables—a phenomenon acousticians call the Lombard effect. Constantly clapping, ringing bells, or asking for quiet interrupts instruction and wears on the teacher’s voice.',
        'Projecting a live visual noise meter on the front board turns volume control into an objective visual cue. When students see the bar climb into the amber warning zone, they naturally moderate their voices before crossing the red threshold.',
      ],
      howItWorksTitle: 'How Browser Microphone Amplitude Is Measured (0–100 Scale vs. dB SPL)',
      howItWorksBody: [
        'When you grant microphone permission, this tool uses the browser’s built-in Web Audio API (AnalyserNode) to sample the incoming waveform and compute its Root Mean Square (RMS) amplitude many times per second. It maps that signal onto a smooth 0–100 relative volume scale and compares it against your chosen threshold.',
        'Important Technical Note: Because laptop, tablet, and webcam microphones have different hardware preamps, automatic gain controls, and distances from students, a web browser cannot measure absolute, calibrated sound pressure levels (dB SPL) the way a certified Type 1/Type 2 hardware sound-level meter does. Instead, take 10 seconds at the start of class to observe the meter during normal quiet work and set the threshold slider just above that baseline.',
      ],
      calloutNote:
        '100% Local Privacy: Microphone audio is analyzed instantaneously in browser memory (RAM) to calculate the volume bar height. Audio is never recorded, saved, or transmitted over the internet.',
      howToUseTitle: 'How to Calibrate & Run the Noise Meter in Class',
      howToUseSteps: [
        'Click Start Microphone and grant browser microphone access.',
        'Have the class demonstrate the target voice level (e.g., partner whisper) and set the red threshold slider just above that level.',
        'Project in Fullscreen mode on the front board so students can monitor the green, amber, and red zones.',
      ],
      featuresTitle: 'Classroom Voice-Level Modes (Levels 0 to 3)',
      featuresList: [
        'Level 0–1 (Silent Reading & Testing — Threshold 25–35): Pages turning, writing, and quiet independent focus.',
        'Level 2 (Partner Whisper — Threshold 45–55): Two students conversing softly at arm’s length.',
        'Level 3 (Table Collaboration — Threshold 60–75): 4–5 students working together on a lab or project.',
      ],
      practicalExamples: [
        { icon: 'BookOpen', title: 'Level 0–1: Silent Reading', description: 'Low threshold (25–35) for independent reading and quizzes.' },
        { icon: 'Users', title: 'Level 2: Partner Whispering', description: 'Moderate threshold (45–55) for pair-share and peer editing.' },
        { icon: 'FlaskConical', title: 'Level 3: Small-Group Lab Work', description: 'Collaborative threshold (60–75) for science labs and math stations.' },
        { icon: 'CheckSquare', title: 'Quiet Transition Challenge', description: 'Challenging classes to pack up without triggering the red alert.' },
      ],
      whoBenefitsTitle: 'Who Uses This Classroom Noise Meter?',
      whoBenefitsList: [
        'Elementary and middle school teachers managing station rotations',
        'High school science and makerspace teachers overseeing group labs',
        'School librarians and study-hall supervisors',
        'After-school program leaders and exam proctors',
      ],
      tipsTitle: 'Calibration & Privacy Best Practices',
      tipsList: [
        'Place your laptop or microphone away from projector cooling fans or HVAC vents so background hum does not inflate the baseline reading.',
        'Gamify quiet work by awarding +1 point on the Classroom Scoreboard for every 10 minutes the class stays inside the green and amber zones.',
      ],
      problemsTitle: 'Classroom Voice Level & Threshold Calibration Guide',
      problemsRows: [
        { problem: 'Silent Independent Work / Testing', cause: 'Pages turning, typing, quiet coughs', solution: 'Set threshold slider to 25–35' },
        { problem: 'Partner Talk (Voice Level 2)', cause: 'Two students speaking at arm’s length', solution: 'Set threshold slider to 45–55' },
        { problem: 'Table Group Collaboration (Level 3)', cause: '4–5 students discussing a project', solution: 'Set threshold slider to 60–75' },
      ],
    },
  },
  'random-name-picker': {
    heroSubtitle:
      'A fair, unbiased random name picker and student selector using an equal-probability shuffle with optional "remove after pick" tracking.',
    featurePills: [
      'Equal 1/N selection probability',
      'Remove-after-pick mode (no repeats)',
      'Paste roster from any spreadsheet',
      '100% private local browser storage',
    ],
    steps: [
      { step: 1, title: 'Paste or type your roster', description: 'Enter one name per line by copying directly from Google Sheets, Excel, or your gradebook.' },
      { step: 2, title: 'Choose repeat or no-repeat mode', description: 'Enable "Remove after pick" to cycle through the entire group without duplicates, or keep names in the pool.' },
      { step: 3, title: 'Click Pick a Name', description: 'Project the screen so the class or team can watch the unbiased selection happen live.' },
      { step: 4, title: 'Reset the pool anytime', description: 'Restore all picked names back into the active roster with one click once everyone has had a turn.' },
    ],
    guide: {
      tableOfContents: [
        'What Is the Random Name Picker?',
        'Sampling With Replacement vs. Without Replacement (No-Repeat Mode)',
        'How to Draw Names from Your Roster',
        'Selection Probability Math (1/N)',
        'Common Name Picker Uses',
        'Who Uses This Random Name Picker?',
        'Classroom Cold-Call Best Practices',
        'Selection Mode Comparison Table',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is the Random Name Picker?',
      whatIsBody: [
        'When teachers or meeting facilitators call on people from memory, human attention naturally gravitates toward the front row or the fastest raised hands. A digital random name picker replaces subjective choice with transparent, equal-probability selection.',
        'Whether you are replacing a cup of wooden popsicle sticks in a classroom, choosing who speaks first in a daily engineering stand-up, or drawing a raffle winner at a community event, you can paste a list of names and draw in one click.',
      ],
      howItWorksTitle: 'Sampling With Replacement vs. Without Replacement (No-Repeat Mode)',
      howItWorksBody: [
        'Mathematically, there are two ways to draw names from a list of N participants:\n1. With Replacement (Keep Name in Pool): Every draw is independent, and each person always has a 1/N probability of being picked. In a class of 25 students, each student has a 1/25 (4.0%) chance on every single spin—which keeps everyone attentive even right after they have answered a question.',
        '2. Without Replacement (Remove After Pick): Once a name is drawn, it is moved to the "Already Picked" list, reducing the remaining pool to N − 1. Probability progresses from 1/25 → 1/24 → 1/23 ... → 1/1, guaranteeing that all 25 participants are selected exactly once before anyone is called a second time.',
      ],
      calloutNote:
        'Student Privacy Guarantee: All names entered into the Random Name Picker remain strictly in your local browser tab and are never uploaded to external servers.',
      howToUseTitle: 'How to Draw Names from Your Roster',
      howToUseSteps: [
        'Paste your list of names (one name per line) into the roster input.',
        'Choose whether selected names should be removed after each pick.',
        'Click Pick a Name to draw a random participant with uniform probability.',
      ],
      featuresTitle: 'Selection Probability Math (1/N)',
      featuresList: [
        'Uniform Random Index: Uses unbiased index selection across the active array of length N.',
        'No-Repeat Tracking: Automatically separates remaining names from already-called names.',
        'Instant Roster Paste: Supports multi-line paste directly from spreadsheets or text files.',
      ],
      practicalExamples: [
        { icon: 'GraduationCap', title: 'Equitable Classroom Questioning', description: 'Ensuring every student is heard across a lesson.' },
        { icon: 'Monitor', title: 'Daily Stand-Up Speaker Order', description: 'Randomizing the order of engineering and product team updates.' },
        { icon: 'Mic', title: 'Presentation Order Draw', description: 'Assigning unbiased speech or project presentation slots.' },
        { icon: 'Trophy', title: 'Door Prizes & Giveaways', description: 'Drawing winners transparently on a shared screen.' },
      ],
      whoBenefitsTitle: 'Who Uses This Random Name Picker?',
      whoBenefitsList: [
        'K–12 teachers and university seminar instructors',
        'Scrum masters and engineering managers running daily stand-ups',
        'Toastmasters Table Topics Masters selecting impromptu speakers',
        'Event hosts drawing giveaway and raffle winners',
      ],
      tipsTitle: 'Classroom Cold-Call Best Practices',
      tipsList: [
        'Ask the question to the entire room first, pause for 3 to 5 seconds of "think time", and only then click Pick a Name so every student formulates an answer.',
        'Keep a plain-text file of your class rosters on your desktop so you can paste any period’s names in two seconds.',
      ],
      problemsTitle: 'Selection Mode Comparison Table',
      problemsRows: [
        { problem: 'Keep in Pool (With Replacement)', cause: 'Probability remains 1/N on every draw', solution: 'Best for quick check-for-understanding questions' },
        { problem: 'Remove After Pick (Without Replacement)', cause: 'Pool shrinks N → N−1 → ... → 1', solution: 'Best for presentation order, stand-ups & raffles' },
      ],
    },
  },
  'random-group-generator': {
    heroSubtitle:
      'An instant random group and team generator that splits any roster into balanced teams by group count or max group size.',
    featurePills: [
      'Split by # of teams or team size',
      'Fisher-Yates uniform shuffle',
      'Balanced remainder distribution',
      'Copy or project team rosters',
    ],
    steps: [
      { step: 1, title: 'Paste your participant roster', description: 'Enter one name per line (remove any absent students first so team sizes stay balanced).' },
      { step: 2, title: 'Choose number of groups or group size', description: 'Specify either how many total teams you need (e.g., 6 lab stations) or how many members per team (e.g., pairs of 2).' },
      { step: 3, title: 'Click Generate Groups', description: 'The tool shuffles the roster using Fisher-Yates randomization and deals names into balanced team cards.' },
      { step: 4, title: 'Project or re-shuffle in one click', description: 'Display the numbered team cards on your smartboard or click Shuffle Again for a fresh arrangement.' },
    ],
    guide: {
      tableOfContents: [
        'What Is the Random Group Generator?',
        'How Remainder Distribution Keeps Group Sizes Balanced',
        'How to Generate Balanced Teams from Any Roster',
        'Fisher-Yates Shuffle & Modulo Math Explained',
        'Ideal Grouping Scenarios',
        'Who Uses This Group Generator?',
        'Group Facilitation Tips',
        'Group Remainder Math Examples',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is the Random Group Generator?',
      whatIsBody: [
        'Dividing a class or workshop into small groups manually takes valuable instructional time and often results in the same friends pairing up every week. A random group generator creates fresh, unbiased collaborations in one second and displays the numbered rosters clearly on the screen.',
        'You can split your participant list in two ways: either specify the exact number of groups you need (for example, 6 lab stations) or specify the target number of people per group (for example, pairs of 2 or triads of 3).',
      ],
      howItWorksTitle: 'How Remainder Distribution Keeps Group Sizes Balanced',
      howItWorksBody: [
        'First, the generator performs a full in-place Fisher-Yates shuffle across all N names so every permutation is equally likely. Next, it distributes participants across K groups using integer division and modulo remainder assignment: Base Size = floor(N ÷ K), with the remaining R = N mod K participants added one each to the first R groups.',
        'Worked Example: Suppose you have N = 26 students and want K = 6 lab groups. Because 26 ÷ 6 = 4 with a remainder of 2, the generator creates 2 groups of 5 students (2 × 5 = 10) and 4 groups of 4 students (4 × 4 = 16), totaling 26 students—so no group is ever stuck with only 2 people.',
      ],
      calloutNote:
        'Balance Guarantee: Using round-robin remainder assignment ensures that no two groups ever differ in size by more than 1 person.',
      howToUseTitle: 'How to Generate Balanced Teams from Any Roster',
      howToUseSteps: [
        'Paste your participant names (one per line) and remove anyone who is absent today.',
        'Select your target number of groups (e.g., 4, 6, 8) or group size (e.g., 2, 3, 4).',
        'Click Generate and display the numbered team cards on the room screen.',
      ],
      featuresTitle: 'Fisher-Yates Shuffle & Modulo Math Explained',
      featuresList: [
        'Unbiased Permutation: Iterates from index N−1 down to 1, swapping each element with a uniform random index j ≤ i.',
        'By Number of Groups (K): Creates exactly K cards of size floor(N/K) or ceil(N/K).',
        'By Max Group Size (S): Calculates K = ceil(N/S) groups and balances members evenly across all K cards.',
      ],
      practicalExamples: [
        { icon: 'FlaskConical', title: 'Science Lab Stations', description: 'Splitting a class across a fixed number of lab benches.' },
        { icon: 'Users', title: 'Think-Pair-Share Partners', description: 'Generating random pairs of 2 for peer review and discussion.' },
        { icon: 'Monitor', title: 'Workshop Breakout Tables', description: 'Mixing cross-functional employees at corporate offsites.' },
        { icon: 'Trophy', title: 'PE & Trivia Teams', description: 'Creating fair, balanced teams for sports and quiz games.' },
      ],
      whoBenefitsTitle: 'Who Uses This Group Generator?',
      whoBenefitsList: [
        'Classroom teachers forming lab partners, reading circles, and project teams',
        'University lab instructors assigning bench groups',
        'Workshop facilitators and agile coaches running breakout exercises',
        'Physical education teachers and camp directors splitting intramural teams',
      ],
      tipsTitle: 'Group Facilitation Tips',
      tipsList: [
        'Delete absent students from the text box before clicking Generate so you do not accidentally create a "pair" with only one present student.',
        'Assign instant group roles by list order (for example: "Person #1 on each card is the Scribe, Person #2 is the Timekeeper, Person #3 is the Presenter").',
      ],
      problemsTitle: 'Group Remainder Math Examples (N Students into K Groups)',
      problemsRows: [
        { problem: '25 Students ÷ 4 Groups', cause: 'floor(25/4) = 6, remainder 1', solution: '1 group of 7 and 3 groups of 6' },
        { problem: '26 Students ÷ 6 Lab Stations', cause: 'floor(26/6) = 4, remainder 2', solution: '2 groups of 5 and 4 groups of 4' },
        { problem: '29 Students ÷ Pairs of 2 (14 Groups)', cause: 'floor(29/14) = 2, remainder 1', solution: '13 pairs of 2 and 1 triad of 3' },
      ],
    },
  },
  'bingo-caller': {
    heroSubtitle:
      'A full-screen 75-ball digital Bingo caller with B-I-N-G-O letter/number display, complete master call board, and call history verification.',
    featurePills: [
      'Standard 75-ball B-I-N-G-O rules',
      'Live 1–75 master verification board',
      'Chronological call history',
      'Projector & TV fullscreen view',
    ],
    steps: [
      { step: 1, title: 'Announce the winning card pattern', description: 'Tell players whether the game is 5-in-a-Row (horizontal, vertical, diagonal), Four Corners, or Full Blackout.' },
      { step: 2, title: 'Click Draw Next Ball', description: 'Call out the letter and number (e.g., "G-52") and allow 8–12 seconds for players to scan their cards.' },
      { step: 3, title: 'Verify winning cards on the master grid', description: 'Check each number read back by the winner against the highlighted 1–75 master board.' },
      { step: 4, title: 'Click Reset Game for a fresh 75-ball pool', description: 'Clear the board only after confirming a valid Bingo.' },
    ],
    guide: {
      tableOfContents: [
        'What Is the 75-Ball Digital Bingo Caller?',
        'Official 75-Ball B-I-N-G-O Column Number Ranges',
        'How to Host a Game with the Digital Bingo Caller',
        'Popular Winning Card Patterns',
        'Where to Use the Digital Bingo Caller',
        'Who Uses This Bingo Caller?',
        'Bingo Caller Hosting Tips',
        'Official 75-Ball B-I-N-G-O Column Reference Table',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is the 75-Ball Digital Bingo Caller?',
      whatIsBody: [
        'In standard North American and classroom 75-ball Bingo, each player uses a 5×5 grid card where the five columns are labeled B, I, N, G, and O. The center square (Row 3, Column N) is typically a "Free Space" that counts as already marked for every player.',
        'Instead of juggling a wire cage and 75 plastic balls that roll off tables, this digital Bingo caller draws each letter-number combination without replacement and illuminates a live 75-number master board on your projector or TV.',
      ],
      howItWorksTitle: 'Official 75-Ball B-I-N-G-O Column Number Ranges',
      howItWorksBody: [
        'The 75 balls are divided evenly into five 15-number ranges corresponding to the five letters of B-I-N-G-O:\n• Column B: Numbers 1 through 15\n• Column I: Numbers 16 through 30\n• Column N: Numbers 31 through 45 (4 numbers on the card + 1 center Free Space)\n• Column G: Numbers 46 through 60\n• Column O: Numbers 61 through 75',
        'Because draws are made without replacement from the 75-ball pool, the first draw has a 1/75 probability for each ball, the second draw has a 1/74 probability among the remaining balls, and a full blackout game requires at most 75 calls.',
      ],
      calloutNote:
        'Host Rule: Always remind players "Keep your markers on your card until we verify your numbers against the master board!" before clicking Reset.',
      howToUseTitle: 'How to Host a Game with the Digital Bingo Caller',
      howToUseSteps: [
        'Project the Bingo Caller in Fullscreen mode on a TV, smartboard, or hall screen.',
        'Click Draw Ball to select the next random B-I-N-G-O number without replacement.',
        'Use the illuminated 1–75 master grid and recent-call history to verify winning cards.',
      ],
      featuresTitle: 'Popular Winning Card Patterns',
      featuresList: [
        'Standard 5-in-a-Row: Any 5 marked squares in a horizontal, vertical, or diagonal line (4 numbers + Free Space on the N column or diagonals).',
        'Four Corners: Marking the top-left (B), top-right (O), bottom-left (B), and bottom-right (O) squares.',
        'Letter X or Letter T: Two intersecting diagonals (9 squares) or top row + middle column (9 squares).',
        'Full Card Blackout (Coverall): Marking all 24 numbered squares plus the center Free Space.',
      ],
      practicalExamples: [
        { icon: 'GraduationCap', title: 'Classroom Review Bingo', description: 'Reviewing sight words, multiplication facts, and vocabulary.' },
        { icon: 'Users', title: 'Community & Senior Socials', description: 'High-contrast large-type display for hall projectors and TVs.' },
        { icon: 'Trophy', title: 'PTA & Fundraiser Nights', description: 'Fast, reliable calling with instant card verification.' },
        { icon: 'Monitor', title: 'Remote Team & Zoom Socials', description: 'Screen-sharing the live call board for distributed teams.' },
      ],
      whoBenefitsTitle: 'Who Uses This Bingo Caller?',
      whoBenefitsList: [
        'Elementary and middle school teachers running review games',
        'Senior centers, community halls, and recreation directors',
        'PTA/PTO parent volunteers hosting school family nights',
        'Remote teams playing virtual Bingo over video calls',
      ],
      tipsTitle: 'Bingo Caller Hosting Tips',
      tipsList: [
        'Play progressive multi-stage games on a single paper card: first award a prize for regular 5-in-a-row, then keep drawing from the same board for an X-pattern prize, and finish with a Full Blackout prize.',
        'Pause 10 seconds between calls when hosting large multi-generational rooms or players using multiple cards.',
      ],
      problemsTitle: 'Official 75-Ball B-I-N-G-O Column Reference Table',
      problemsRows: [
        { problem: 'B Column', cause: 'Numbers 1 to 15 (15 balls)', solution: '5 squares per card in Column 1' },
        { problem: 'I Column', cause: 'Numbers 16 to 30 (15 balls)', solution: '5 squares per card in Column 2' },
        { problem: 'N Column', cause: 'Numbers 31 to 45 (15 balls)', solution: '4 numbers + 1 center FREE square in Column 3' },
        { problem: 'G Column', cause: 'Numbers 46 to 60 (15 balls)', solution: '5 squares per card in Column 4' },
        { problem: 'O Column', cause: 'Numbers 61 to 75 (15 balls)', solution: '5 squares per card in Column 5' },
      ],
    },
  },
  'seating-chart-maker': {
    heroSubtitle:
      'A fast, privacy-first classroom and event seating chart generator that shuffles rosters into customizable row-and-column desk grids.',
    featurePills: [
      'Customizable rows & columns',
      'One-click roster shuffle',
      'Front-of-room orientation marker',
      '100% local browser privacy',
    ],
    steps: [
      { step: 1, title: 'Enter your class roster', description: 'Paste one student name per line from your gradebook or spreadsheet.' },
      { step: 2, title: 'Set your room rows & columns', description: 'Choose row and column counts that match your physical desk grid (where Rows × Columns ≥ Student Count).' },
      { step: 3, title: 'Click Shuffle Seats', description: 'Randomly assign every student to a desk using an unbiased Fisher-Yates shuffle.' },
      { step: 4, title: 'Project on the front board', description: 'Display the grid with the Front of Room banner oriented clearly as students enter.' },
    ],
    guide: {
      tableOfContents: [
        'What Is the Classroom Seating Chart Maker?',
        'Grid Capacity Math & Empty Seat Handling',
        'How to Build & Project Your Seating Chart',
        'Standard Classroom & Exam Hall Grid Layouts',
        'When to Use a Randomized Seating Chart',
        'Who Uses This Seating Chart Maker?',
        'Seating Chart Management Tips',
        'Common Classroom Grid Configurations',
        'Frequently Asked Questions',
      ],
      whatIsTitle: 'What Is the Classroom Seating Chart Maker?',
      whatIsBody: [
        'Creating a new seating chart by dragging thirty sticky notes around a page takes unnecessary prep time, and letting students pick their own seats during an exam or at the start of a unit often clusters distractions together.',
        'A grid-based seating chart generator lets you paste your student list, set the number of rows and columns in your room, and assign every student to a numbered desk position using an unbiased random shuffle.',
      ],
      howItWorksTitle: 'Grid Capacity Math & Empty Seat Handling',
      howItWorksBody: [
        'A rectangular room layout with R rows and C columns provides a total capacity of Total Seats = R × C. As long as R × C ≥ N (where N is the number of students on your roster), every student receives a unique seat and the remaining (R × C) − N desks are marked as Empty.',
        'Worked Example: If your roster has N = 28 students and your classroom has 5 rows of 6 desks (5 × 6 = 30 seats), the generator shuffles the 28 students into Seats 1 through 28 and leaves the final 2 desks in the back row unassigned.',
      ],
      calloutNote:
        '100% Local Privacy: Student names are processed entirely inside your browser memory and are never uploaded or stored on external servers.',
      howToUseTitle: 'How to Build & Project Your Seating Chart',
      howToUseSteps: [
        'Paste your student roster (one name per line).',
        'Adjust the Rows and Columns controls to match your room layout.',
        'Click Shuffle Seats and project the chart on your classroom smartboard.',
      ],
      featuresTitle: 'Standard Classroom & Exam Hall Grid Layouts',
      featuresList: [
        '4 × 6 Grid (24 Desks): Standard seminar and middle-school layout.',
        '5 × 6 Grid (30 Desks): Standard high-school classroom layout.',
        '6 × 6 Grid (36 Desks): Large classroom or proctored testing room.',
        'Front-of-Room Orientation Banner: Clearly marks the whiteboard/lectern side so students orient themselves immediately.',
      ],
      practicalExamples: [
        { icon: 'CheckSquare', title: 'Proctored Midterms & Finals', description: 'Assigning randomized exam seats to uphold academic integrity.' },
        { icon: 'Calendar', title: 'Monthly Seat Rotation', description: 'Giving students fresh neighbors and sightlines each unit.' },
        { icon: 'Monitor', title: 'Computer Lab Stations', description: 'Mapping students to numbered lab terminals or art tables.' },
        { icon: 'BookOpen', title: 'Substitute Teacher Map', description: 'Screenshotting or printing a clean desk grid for guest teachers.' },
      ],
      whoBenefitsTitle: 'Who Uses This Seating Chart Maker?',
      whoBenefitsList: [
        'Middle school, high school, and university instructors',
        'Exam proctors assigning randomized test-day seating',
        'Computer lab, chemistry lab, and art studio teachers',
        'Workshop organizers assigning table and seat numbers',
      ],
      tipsTitle: 'Seating Chart Management Tips',
      tipsList: [
        'Project the new seating chart on the board before the bell rings so students walk directly to their new desks.',
        'If a student has a documented front-row accommodation, note their assigned seat after shuffling and swap that single desk with a front-row spot.',
      ],
      problemsTitle: 'Common Classroom Grid Configurations',
      problemsRows: [
        { problem: '24-Seat Layout', cause: '4 Rows × 6 Columns (or 6 × 4)', solution: 'Ideal for standard seminar and middle-school rooms' },
        { problem: '30-Seat Layout', cause: '5 Rows × 6 Columns', solution: 'Standard high-school classroom grid' },
        { problem: '36-Seat Layout', cause: '6 Rows × 6 Columns', solution: 'Large classroom or proctored testing room' },
      ],
    },
  },

  'custom-timer': {
    categorySlug: 'timers',
    categoryLabel: 'Timers & Stopwatches',
    heroSubtitle:
      'Build, customize, and save your own personalized countdown timers with custom titles, task notes, icons, color themes, and 10 animated visual styles—accessible from any page via your header Saved List.',
    featurePills: [
      '10 animated visual styles',
      'Custom titles, notes & icons',
      'Header Saved List + Pre-Saved templates',
      'Shareable URL parameters',
    ],
    quickPresets: [
      { icon: '🧠', label: '25 min', sublabel: 'Deep Work', sec: 1500 },
      { icon: '☕', label: '5 min', sublabel: 'Coffee Break', sec: 300 },
      { icon: '🔥', label: '7 min', sublabel: 'HIIT Circuit', sec: 420 },
      { icon: '📚', label: '45 min', sublabel: 'Study Block', sec: 2700 },
      { icon: '🧘', label: '10 min', sublabel: 'Meditation', sec: 600 },
    ],
    steps: [
      { step: 1, title: 'Name your timer & add notes', description: 'Type a custom title (e.g., "Morning Deep Work") and optional task instructions or reminders.' },
      { step: 2, title: 'Pick icon, color & visual style', description: 'Select from 12 icons, 8 accent colors, and 10 live-animated countdown visuals.' },
      { step: 3, title: 'Set duration & save to list', description: 'Enter Hours, Minutes, and Seconds, then click "Save to My Saved List" for instant header access.' },
      { step: 4, title: 'Launch fullscreen or share link', description: 'Press Spacebar to start, F for fullscreen display, or copy a shareable URL with your exact setup.' },
    ],
    guide: {
      tableOfContents: [
        'What Is the Custom Timer Builder?',
        'How the 10 Animated Visual Styles & Saved List Work',
        'How to Build & Save Your Custom Timer',
        'Key Features & Personalization Options',
        'Practical Workflows & Use Cases',
        'Who Benefits Most?',
        'Pro Tips for Custom Timer Routines',
        'Troubleshooting & FAQ Reference',
      ],
      whatIsTitle: 'What Is the Custom Timer Builder?',
      whatIsBody: [
        'Standard online timers force you to re-enter your duration, re-select your visual theme, and remember which task you are timing every single session. The Custom Timer Builder solves this by combining a live visual countdown stage with a personal routine studio where you can name each timer, attach task instructions, pick an icon and color theme, and choose from 10 distinct animated visuals.',
        'Whether you are a teacher rotating through named classroom stations, a developer alternating between 25-minute coding sprints and 5-minute posture breaks, or a presenter rehearsing a keynote, your saved timers stay pinned in the top navigation bar under "Saved List" so you can launch or delete them from anywhere on the site.',
      ],
      howItWorksTitle: 'How the 10 Animated Visual Styles & Saved List Work',
      howItWorksBody: [
        'Every custom timer combines three layers: metadata (custom title, subtitle/notes, category icon, and color palette), a drift-free monotonic countdown engine (using Date.now() delta math so background tabs never lose a second), and a live-switchable visual renderer supporting Circular Ring, Hourglass Sand, Traffic Light, Liquid Wave, Progress Bar, Rainbow Arc, Cozy Candle, Pixel Grid, Neon Pulse, and Minimal Digital.',
        'When you click "Save to My Saved List", your configuration is serialized to local browser storage (localStorage) and broadcast via a custom window event so the global Header Saved List updates immediately. We also pre-load 6 starter Pre-Saved timers so you can test different visual styles right away, delete any preset you do not need, or restore the starter pack with a single click.',
      ],
      calloutNote:
        'Every custom timer can also be shared via a self-contained URL query string—send your link to students, teammates, or clients and your exact title, notes, duration, and visual animation load automatically.',
      howToUseTitle: 'How to Build & Manage Custom Timers',
      howToUseSteps: [
        'Enter your timer Title and optional Description/Task Notes in the builder panel.',
        'Choose a custom Icon, Color Theme, and Duration (via quick buttons or exact Hours, Minutes, Seconds).',
        'Select one of the 10 Animated Visual Styles and preview it live on the countdown stage.',
        'Click "Save to My Saved List" to pin the timer to your header dropdown, or click the Trash icon on any saved item to remove it.',
      ],
      featuresTitle: 'Custom Timer Studio Capabilities',
      featuresList: [
        '10 Live Animated Visuals: Switch anytime between Circular Ring, Hourglass Sand, Traffic Light, Liquid Wave, Progress Bar, Rainbow Arc, Cozy Candle, Pixel Grid, Neon Pulse, and Minimal Digital.',
        'Global Header Saved List: Launch, inspect, or delete any saved or pre-saved timer directly from the site header dropdown.',
        '6 Pre-Saved Starter Templates: Includes ready-to-run Deep Work, Coffee Break, HIIT, Study Block, Meditation, and Presentation timers with one-click delete and restore.',
        'Responsive Fullscreen Stage: Scales the visual graphic and digital readout dynamically across mobile phones, tablets, laptops, and 4K classroom projectors.',
        'Keyboard & Wake Lock Support: Full support for Spacebar (Start/Pause), R (Reset), F (Fullscreen), ? (Shortcuts modal), and Screen Wake Lock.',
      ],
      practicalExamples: [
        { icon: 'GraduationCap', title: 'Classroom Station Rotations', description: 'Display "Station 3: Microscope Lab — 12 Mins" with a Traffic Light or Hourglass visual so students know both the task and remaining time.' },
        { icon: 'Monitor', title: 'Deep Work & Coding Sprints', description: 'Run a 25-minute Circular Ring or Pixel Grid timer titled "Feature Sprint — No Slack" and switch to a 5-minute Liquid Wave break.' },
        { icon: 'Flame', title: 'Home HIIT & Mobility Sets', description: 'Launch a 7-minute Neon Pulse circuit or 10-minute Cozy Candle evening stretch from your Saved List.' },
        { icon: 'Presentation', title: 'Keynote & Pitch Rehearsals', description: 'Use a 15-minute Traffic Light custom timer that shifts automatically from green to amber (under 30% left) to red (under 10% left).' },
      ],
      whoBenefitsTitle: 'Who Uses the Custom Timer Studio?',
      whoBenefitsList: [
        'Teachers and professors managing named daily classroom transitions and lab blocks',
        'Software engineers, writers, and students with repeatable deep-work blocks',
        'Neurodivergent and ADHD users who benefit from pairing explicit task notes with visual time cues',
        'Event moderators, coaches, and facilitators who switch rapidly between pre-built session durations',
      ],
      tipsTitle: 'Pro Tips for Getting the Most Out of Custom Timers',
      tipsList: [
        'Write your single most important outcome in the Description field (e.g., "Draft 300 words of Section 2 before chime") to prevent task-switching.',
        'Use Traffic Light mode for speeches and exams where participants need unmistakable green, yellow, and red phase warnings.',
        'Bookmark or copy the Share Link of your favorite custom timer to embed it in Notion, Google Classroom, or team wikis.',
      ],
      problemsTitle: 'Troubleshooting Custom & Saved Timers',
      problemsRows: [
        { problem: 'Saved timer missing on another device', cause: 'Saved List is stored privately in local browser storage', solution: 'Use the "Share Link" button to open and save the exact timer URL on your second device' },
        { problem: 'Accidentally deleted a Pre-Saved timer', cause: 'Clicked the Trash icon on a starter preset', solution: 'Click "Restore Pre-Saved" in the Saved Timers drawer or page library to bring back all 6 starter timers' },
        { problem: 'No sound at 00:00 completion', cause: 'Sound toggle is muted or system volume is off', solution: 'Ensure the Sound switch is green and click Start to unlock browser Web Audio' },
      ],
    },
  },

  'flip-clock': {
    categorySlug: 'timers',
    categoryLabel: 'Timers & Stopwatches',
    heroSubtitle:
      'A realistic retro mechanical split-flap clock combining a Live Time-of-Day Clock (with global time-zone selector), a Flip Countdown Timer, and a Flip Stopwatch.',
    featurePills: [
      '3-in-1: Live Clock, Countdown & Stopwatch',
      '3D mechanical split-flap cards',
      '12h / 24h & Time Zone selector',
      'Dark & Light studio themes',
    ],
    quickPresets: [
      { icon: '🕰️', label: 'Live Clock', sublabel: 'Wall Time', sec: 0 },
      { icon: '⏱', label: '10 min', sublabel: 'Flip Countdown', sec: 600 },
      { icon: '⏱', label: '25 min', sublabel: 'Pomodoro Flip', sec: 1500 },
      { icon: '⏱', label: '45 min', sublabel: 'Study Block', sec: 2700 },
      { icon: '⏱', label: '60 min', sublabel: 'Full Hour', sec: 3600 },
    ],
    steps: [
      { step: 1, title: 'Select Clock, Countdown, or Stopwatch', description: 'Switch modes at the top of the split-flap display.' },
      { step: 2, title: 'Configure display format & zone', description: 'Toggle 12-hour AM/PM or 24-hour time, Show/Hide Seconds, and select Local Time or any global city.' },
      { step: 3, title: 'Choose Dark or Light housing', description: 'Pick classic matte-black split-flap cards or warm ivory cards.' },
      { step: 4, title: 'Enter fullscreen desk mode', description: 'Press F to turn a secondary monitor, iPad, or laptop into a dedicated desk timepiece.' },
    ],
    guide: {
      tableOfContents: [
        'What Is the Online Flip Clock?',
        'How 3D Split-Flap Mechanics & Time Zones Work',
        'How to Use Live Clock, Countdown & Stopwatch Modes',
        'Key Display & Audio Features',
        'Best Workspace & Studio Setups',
        'Who Uses the Flip Clock?',
        'Tips for Ambient Desk Displays',
        'Common Questions & Troubleshooting',
      ],
      whatIsTitle: 'What Is the Online Flip Clock?',
      whatIsBody: [
        'Inspired by mid-century Italian Solari departure boards and classic electro-mechanical desk clocks, the Online Flip Clock renders large, high-contrast split-flap numerals that physically hinge and drop as each second or minute advances.',
        'Unlike single-purpose screensavers that require paid downloads, this browser-native timepiece integrates three full instruments in one view: a Live Time-of-Day Clock with international time-zone support, a configurable Flip Countdown Timer, and a Flip Stopwatch.',
      ],
      howItWorksTitle: 'How 3D Split-Flap Mechanics & Time Zones Work',
      howItWorksBody: [
        'Each digit card is split into upper and lower halves animated with hardware-accelerated 3D CSS perspective transforms. In Live Clock mode, the clock queries your system clock and the browser’s IANA Intl.DateTimeFormat database to display exact local or international wall time.',
        'In Countdown and Stopwatch modes, elapsed and remaining time are calculated against monotonic epoch timestamps (Date.now()) so tab switching or computer sleep never introduces drift.',
      ],
      calloutNote:
        'Want a calmer peripheral desk display while writing or studying? Toggle off "Show Seconds" so the split-flap cards only turn once per minute.',
      howToUseTitle: 'How to Configure Your Flip Clock',
      howToUseSteps: [
        'Choose Live Clock, Countdown, or Stopwatch mode.',
        'In Live Clock mode, select 12h or 24h format and pick Local Time or a target world time zone.',
        'Toggle Show Seconds, Tick Sound, and Dark/Light theme according to your room lighting.',
        'Press F for borderless fullscreen mode on your desk monitor or tablet stand.',
      ],
      featuresTitle: 'Flip Clock Highlights',
      featuresList: [
        'Three Modes in One: Seamlessly switch between Live Wall Clock, Countdown Timer, and Elapsed Stopwatch.',
        'Global Time Zone Selector: Display live split-flap time for New York, London, Tokyo, Sydney, UTC, or your local zone.',
        'Show or Hide Seconds: Run a 3-panel HH:MM:SS display or a calm 2-panel HH:MM display.',
        'Optional Mechanical Tick & Chime: Synthesizes crisp split-flap card ticks and completion chimes via Web Audio API.',
      ],
      practicalExamples: [
        { icon: 'Monitor', title: 'Dual-Monitor Desk Setup', description: 'Keep a full-screen matte-black Flip Clock on your secondary display or docked tablet.' },
        { icon: 'Tv', title: 'Study-With-Me & Livestream Overlay', description: 'Capture the clean split-flap window in OBS for YouTube or Twitch productivity streams.' },
        { icon: 'GraduationCap', title: 'Exam Hall Wall Clock', description: 'Project official 12h or 24h wall time at the front of a testing room.' },
        { icon: 'Globe', title: 'Remote Team HQ Clock', description: 'Pin your headquarters time zone so distributed teammates always know home-office hours.' },
      ],
      whoBenefitsTitle: 'Who Benefits From the Flip Clock?',
      whoBenefitsList: [
        'Remote workers and designers curating minimalist desk setups',
        'Study-With-Me creators and livestreamers needing a crisp on-camera clock',
        'Teachers and exam proctors projecting a distraction-free room clock',
        'Anyone repurposing an old iPad or laptop into a dedicated bedside or shelf clock',
      ],
      tipsTitle: 'Pro Tips for Flip Clock Displays',
      tipsList: [
        'Enable the Dark theme on OLED tablets or monitors to minimize glare and reduce power consumption.',
        'Enable Screen Wake Lock before stepping away so your tablet or laptop screen stays illuminated.',
      ],
      problemsTitle: 'Troubleshooting Flip Clock Display',
      problemsRows: [
        { problem: 'Screen dims after 5 minutes', cause: 'OS power-saving sleep timer', solution: 'Toggle on "Keep Screen Awake" (Wake Lock) in the control bar' },
        { problem: 'Seconds movement feels distracting', cause: 'Every-second card flip in peripheral vision', solution: 'Toggle off "Show Seconds" for a calm HH:MM display' },
      ],
    },
  },

  'flip-timer': {
    categorySlug: 'timers',
    categoryLabel: 'Timers & Stopwatches',
    heroSubtitle:
      'A tactile mechanical split-flap countdown timer with 3D flipping cards, 4 studio themes, custom session labels, and optional mechanical tick sounds.',
    featurePills: [
      '3D split-flap countdown cards',
      '4 curated studio themes',
      'Optional mechanical tick audio',
      'Fullscreen projection ready',
    ],
    quickPresets: [
      { icon: '⏱', label: '5 min', sublabel: 'Short Break', sec: 300 },
      { icon: '⏱', label: '15 min', sublabel: 'Standup', sec: 900 },
      { icon: '⏱', label: '25 min', sublabel: 'Pomodoro', sec: 1500 },
      { icon: '⏱', label: '45 min', sublabel: 'Deep Work', sec: 2700 },
      { icon: '⏱', label: '60 min', sublabel: '1 Hour Block', sec: 3600 },
    ],
    steps: [
      { step: 1, title: 'Set your countdown duration', description: 'Pick a quick preset (1m to 60m) or enter custom Hours, Minutes, and Seconds.' },
      { step: 2, title: 'Select a split-flap theme', description: 'Choose Classic Dark, Warm Ivory, Retro Amber, or Midnight Slate.' },
      { step: 3, title: 'Configure audio & session label', description: 'Add a custom task title and toggle mechanical flip ticks or completion chime.' },
      { step: 4, title: 'Start & expand fullscreen', description: 'Press Spacebar to start and F for full-viewport readability.' },
    ],
    guide: {
      tableOfContents: [
        'What Is the Split-Flap Flip Timer?',
        'Why Mechanical Flip Cards Improve Time Awareness',
        'How to Use the Flip Timer',
        'Themes & Customization Settings',
        'Real-World Scenarios',
        'Who Benefits Most?',
        'Tips for Focus & Classroom Projection',
        'Troubleshooting',
      ],
      whatIsTitle: 'What Is the Split-Flap Flip Timer?',
      whatIsBody: [
        'The Flip Timer is a dedicated countdown clock modeled after vintage split-flap station boards and retro desk chronometers. Every second or minute transition is marked by a crisp 3D card flip across Hours, Minutes, and Seconds panels.',
        'Because each digit sits inside its own high-contrast card housing, the remaining time is legible from across a classroom, conference room, or home gym while adding tactile visual rhythm to study and work blocks.',
      ],
      howItWorksTitle: 'Why Mechanical Flip Cards Improve Time Awareness',
      howItWorksBody: [
        'Flat digital numbers change silently without catching peripheral vision, which makes it easy to lose track of 30 minutes during an exam or coding sprint. The subtle hinge motion of a split-flap card provides a gentle visual cue as each minute turns over.',
        'Under the hood, the countdown engine calculates exact remaining milliseconds from a monotonic target timestamp so the flip animation stays accurate even if you switch tabs and return later.',
      ],
      calloutNote:
        'Add a custom session title (such as "Section B: Essay Writing — 40 Mins") above the split-flap board so everyone in the room knows the active task.',
      howToUseTitle: 'How to Run a Split-Flap Countdown',
      howToUseSteps: [
        'Click a preset duration or enter custom Hours, Minutes, and Seconds.',
        'Choose from Classic Dark, Warm Ivory, Retro Amber, or Midnight Slate themes.',
        'Toggle the mechanical tick sound and completion alarm on or off.',
        'Press Spacebar to start/pause, R to reset, and F for fullscreen.',
      ],
      featuresTitle: 'Flip Timer Key Features',
      featuresList: [
        'Authentic 3D Split-Flap Animation: Smooth upper/lower card hinge physics on every digit change.',
        '4 Curated Color Themes: Classic Dark, Warm Ivory, Retro Amber, and Midnight Slate.',
        'Custom Session Banner: Display your current subject, meeting agenda item, or workout block.',
        'Zero-Drift Timestamp Accuracy: Never loses time when browser tabs are backgrounded.',
      ],
      practicalExamples: [
        { icon: 'BookOpen', title: 'Pomodoro & Exam Sprints', description: 'Run 25-minute or 50-minute study blocks with high-contrast mechanical numerals.' },
        { icon: 'Presentation', title: 'Workshop & Breakout Pacing', description: 'Project the Retro Amber or Classic Dark board during 15-minute group exercises.' },
        { icon: 'Tv', title: 'Livestream Starting-Soon Screen', description: 'Use a 5-minute split-flap countdown before webinars and live broadcasts.' },
        { icon: 'CheckSquare', title: 'Daily Timeboxing', description: 'Keep inbox triage and administrative tasks strictly within a 20-minute window.' },
      ],
      whoBenefitsTitle: 'Who Benefits From the Flip Timer?',
      whoBenefitsList: [
        'Students and researchers running structured study and writing blocks',
        'Teachers and exam proctors projecting clear front-of-room countdowns',
        'Workshop facilitators and agile scrum masters timing team sprints',
        'Content creators recording time-lapses or study streams',
      ],
      tipsTitle: 'Tips for Best Results',
      tipsList: [
        'Use the Retro Amber theme in dim lecture halls for warm, low-glare legibility.',
        'Keep the mechanical tick sound off during silent exams, and turn it on during fast-paced 1-to-5-minutelightning rounds.',
      ],
      problemsTitle: 'Common Questions & Solutions',
      problemsRows: [
        { problem: 'Want live wall time instead of a countdown', cause: 'Flip Timer is dedicated to countdowns', solution: 'Switch to the Online Flip Clock (/timers/flip-clock) which includes Live Clock, Countdown, and Stopwatch modes' },
        { problem: 'No chime at 00:00', cause: 'Mute toggle enabled', solution: 'Click the Sound button in the control bar to enable the Web Audio completion alert' },
      ],
    },
  },

  'train-timer': {
    categorySlug: 'education',
    categoryLabel: 'Education & Classroom',
    heroSubtitle:
      'A charming railway station departure-board countdown where an illustrated train travels steadily along the track from Departure to Arrival as time counts down.',
    featurePills: [
      'Moving train progress animation',
      'Split-flap station departure board',
      '4 scenic railway themes',
      'Custom route & activity titles',
    ],
    quickPresets: [
      { icon: '🚂', label: '2 min', sublabel: 'Quick Cleanup', sec: 120 },
      { icon: '🚂', label: '5 min', sublabel: 'Station Transition', sec: 300 },
      { icon: '🚂', label: '10 min', sublabel: 'Reading Express', sec: 600 },
      { icon: '🚂', label: '15 min', sublabel: 'Group Activity', sec: 900 },
      { icon: '🚂', label: '25 min', sublabel: 'Study Journey', sec: 1500 },
    ],
    steps: [
      { step: 1, title: 'Set journey duration & route name', description: 'Pick a preset or custom duration and type a fun station title (e.g., "Cleanup Express" or "Reading Line").' },
      { step: 2, title: 'Choose a railway scene', description: 'Select Classic Station, Alpine Express, Sunset Rail, or Night Sleeper.' },
      { step: 3, title: 'Start the departure countdown', description: 'Click Start (Spacebar) and watch the train depart the left platform and travel toward the destination.' },
      { step: 4, title: 'Arrive on time at 00:00', description: 'The train pulls into the arrival station at 00:00 with an optional station bell chime.' },
    ],
    guide: {
      tableOfContents: [
        'What Is the Train Timer?',
        'How Spatial Journey Pacing Helps Young Learners',
        'How to Use the Train Departure Timer',
        'Railway Themes & Departure Board Features',
        'Classroom & Event Use Cases',
        'Who Benefits Most?',
        'Teacher & Facilitator Tips',
        'Troubleshooting',
      ],
      whatIsTitle: 'What Is the Train Timer?',
      whatIsBody: [
        'The Train Timer pairs a classic railway station split-flap departure board with an animated locomotive that travels horizontally along a track from the Departure platform (100% time remaining) to the Arrival station (00:00).',
        'For elementary classrooms, neurodivergent learners, and workshop breaks, translating abstract minutes into a concrete physical journey ("finish putting away markers before the train reaches the station") eliminates transition arguments and makes time visible from across the room.',
      ],
      howItWorksTitle: 'How Spatial Journey Pacing Helps Young Learners',
      howItWorksBody: [
        'Children under age 10 often struggle to interpret digital numbers like "03:45", but they immediately understand spatial distance along a track. Watching the train pass the halfway bridge and approach the final station platform gives students an intuitive sense of how fast they need to wrap up.',
        'At the same time, older students and adults can read the crisp split-flap departure board numerals and custom route banner at the top of the screen.',
      ],
      calloutNote:
        'Rename the route banner to match your exact transition—such as "Carpet Time Express", "Center Rotation 2", or "Intermission Boarding"—to reinforce instructions without repeating yourself.',
      howToUseTitle: 'How to Run the Train Timer',
      howToUseSteps: [
        'Select a preset time (1m, 3m, 5m, 10m, 15m, 25m) or enter custom Hours, Minutes, and Seconds.',
        'Type a custom Station / Activity Label in the departure board header.',
        'Pick from 4 railway themes: Classic Station, Alpine Express, Sunset Rail, or Night Sleeper.',
        'Press Start (Spacebar) and F for fullscreen whiteboard projection.',
      ],
      featuresTitle: 'Train Timer Features',
      featuresList: [
        'Synchronized Train & Track Progress: The locomotive’s position along the rail maps 1:1 to elapsed percentage.',
        'Split-Flap Departure Header: Displays remaining time, status badge (BOARDING, IN TRANSIT, ARRIVED), and custom activity name.',
        '4 Illustrated Scenic Themes: Daylight Alpine mountains, warm Sunset rails, Classic terminal, and calm Night Sleeper.',
        'Gentle Station Bell Alert: Optional Web Audio chime when the train pulls into the final platform.',
      ],
      practicalExamples: [
        { icon: 'GraduationCap', title: 'Elementary Cleanup & Line-Up', description: 'Challenge students to clear their desks and line up before the 3-minute Cleanup Express reaches the platform.' },
        { icon: 'BookOpen', title: 'Independent Reading Journeys', description: 'Run a calm 15-minute Night Sleeper or Alpine Express train during silent reading blocks.' },
        { icon: 'Presentation', title: 'Conference Break Boarding', description: 'Project a 10-minute "Next Keynote Boarding" train timer during workshop coffee breaks.' },
        { icon: 'Users', title: 'Family Morning & Bedtime Routines', description: 'Use a 5-minute toothbrushing and pajama train countdown for toddlers and young kids.' },
      ],
      whoBenefitsTitle: 'Who Loves the Train Timer?',
      whoBenefitsList: [
        'Kindergarten, elementary, and special education teachers',
        'Parents guiding morning getting-ready and bedtime routines',
        'Pediatric occupational therapists and speech pathologists',
        'Workshop facilitators running playful session break countdowns',
      ],
      tipsTitle: 'Classroom & Facilitation Tips',
      tipsList: [
        'Give a verbal halfway check when the train passes the center of the screen ("The train is halfway to the station—check your desk!").',
        'Switch to the Night Sleeper theme during quiet writing or calm-down periods.',
      ],
      problemsTitle: 'Troubleshooting the Train Timer',
      problemsRows: [
        { problem: 'Students watching the train instead of working', cause: 'Novelty on first introduction', solution: 'Run a quick 30-second demo journey first, or enable Reduced Motion for a calmer display' },
        { problem: 'Need a silent arrival at 00:00', cause: 'Quiet testing or reading environment', solution: 'Toggle off the Sound button so only the visual ARRIVED badge triggers at 00:00' },
      ],
    },
  },

  'forest-fire-timer': {
    categorySlug: 'timers',
    categoryLabel: 'Timers & Stopwatches',
    heroSubtitle:
      'A high-energy nature visual countdown where a stylized ember glow spreads steadily across an illustrated woodland landscape as time runs out.',
    featurePills: [
      'Dynamic spreading ember progress',
      '4 woodland & elemental themes',
      'High-contrast digital overlay',
      'Reduced-motion calm mode',
    ],
    quickPresets: [
      { icon: '🔥', label: '1 min', sublabel: 'Lightning Round', sec: 60 },
      { icon: '🔥', label: '3 min', sublabel: 'Brainstorm', sec: 180 },
      { icon: '🔥', label: '5 min', sublabel: 'Quick Sprint', sec: 300 },
      { icon: '🔥', label: '10 min', sublabel: 'Challenge Block', sec: 600 },
      { icon: '🔥', label: '20 min', sublabel: 'Focus Burn', sec: 1200 },
    ],
    steps: [
      { step: 1, title: 'Choose your countdown duration', description: 'Select a quick sprint preset or enter custom Hours, Minutes, and Seconds.' },
      { step: 2, title: 'Select a woodland color theme', description: 'Pick Wildfire Amber, Autumn Canopy, Campfire Dusk, or Mystic Aurora.' },
      { step: 3, title: 'Start the countdown', description: 'Watch the warm illumination progress across the treeline from 0% to 100%.' },
      { step: 4, title: 'Beat the clock before 00:00', description: 'Use Fullscreen (F) for group games, trivia challenges, and fast-paced sprints.' },
    ],
    guide: {
      tableOfContents: [
        'What Is the Forest Fire Timer?',
        'How Progressive Landscape Illumination Works',
        'How to Use the Forest Fire Timer',
        'Themes & Accessibility Controls',
        'Best Use Cases for High-Energy Sprints',
        'Who Benefits Most?',
        'Facilitator Tips',
        'Troubleshooting',
      ],
      whatIsTitle: 'What Is the Forest Fire Timer?',
      whatIsBody: [
        'The Forest Fire Timer is a dramatic, nature-inspired visual countdown where a stylized warm glow advances across a layered woodland silhouette in direct proportion to elapsed time.',
        'While calm sensory timers (like Lichen, Frost, or Moon) are designed for quiet relaxation, the Forest Fire Timer creates healthy visual momentum for brainstorming sprints, classroom review games, escape-room puzzles, and beat-the-clock challenges.',
      ],
      howItWorksTitle: 'How Progressive Landscape Illumination Works',
      howItWorksBody: [
        'As the timer counts down from 100% to 0%, the active illumination line moves smoothly across the forest canopy while floating ember particles rise gently in the foreground.',
        'If you prefer a gentler aesthetic without flickering particles, switching to the Mystic Aurora or Autumn Canopy theme—or enabling the Reduced Motion toggle—turns the scene into a smooth, tranquil color transition.',
      ],
      calloutNote:
        'Use the Forest Fire Timer for "Beat the Clock" team challenges where participants must solve a puzzle or complete a brainstorm before the glow reaches the far ridge.',
      howToUseTitle: 'How to Run the Forest Fire Timer',
      howToUseSteps: [
        'Set your countdown time using the preset chips or custom H:M:S inputs.',
        'Select one of the 4 landscape themes (Wildfire Amber, Autumn Canopy, Campfire Dusk, or Mystic Aurora).',
        'Toggle Reduced Motion or Sound Alerts as needed.',
        'Press Spacebar to start and F for fullscreen projection.',
      ],
      featuresTitle: 'Forest Fire Timer Highlights',
      featuresList: [
        'Proportional Horizon Progress: Judge remaining time instantly by how far the glow has traveled across the trees.',
        '4 Distinct Palette Themes: From energetic Wildfire Amber to soothing Mystic Aurora greens and violets.',
        'Reduced Motion Accessibility: Disables particle flicker while preserving smooth progress progression.',
        'Drift-Free Monotonic Timing: Accurate to the millisecond across all browsers.',
      ],
      practicalExamples: [
        { icon: 'GraduationCap', title: 'Classroom Escape Rooms & Trivia', description: 'Project a 5-minute or 10-minute challenge clock that builds excitement during team review games.' },
        { icon: 'Flame', title: 'Rapid Brainstorming Sprints', description: 'Give design or product teams 3 minutes to generate sticky-note ideas before the canopy fills.' },
        { icon: 'CheckSquare', title: 'Speed-Cleaning Challenges', description: 'Turn a 5-minute room tidy or desk reset into a fast-paced game.' },
        { icon: 'Monitor', title: 'Coding & Writing Blitzes', description: 'Use a 15-minute Campfire Dusk sprint to push through writer’s block.' },
      ],
      whoBenefitsTitle: 'Who Uses the Forest Fire Timer?',
      whoBenefitsList: [
        'Teachers running gamified classroom quizzes and STEM challenges',
        'Workshop facilitators leading design sprints and rapid ideation rounds',
        'Game masters hosting tabletop RPGs, trivia nights, or escape rooms',
        'Students who need high-contrast visual urgency to beat procrastination',
      ],
      tipsTitle: 'Tips for Best Results',
      tipsList: [
        'Switch to Mystic Aurora or enable Reduced Motion if you want the woodland artwork without high-urgency orange tones.',
        'Press F for fullscreen mode so the layered forest illustration fills the entire projector screen.',
      ],
      problemsTitle: 'Common Questions & Fixes',
      problemsRows: [
        { problem: 'Visual feels too intense for quiet study', cause: 'Default Wildfire Amber palette is high-energy', solution: 'Select the Mystic Aurora theme and enable Reduced Motion, or try the Lichen or Snow Timer' },
        { problem: 'Want to hide the digital numbers', cause: 'Pure visual pacing preferred', solution: 'Toggle off "Show Time Text" so participants rely purely on the landscape progress' },
      ],
    },
  },

  'sensory-timers': {
    categorySlug: 'education',
    categoryLabel: 'Education & Classroom',
    heroSubtitle:
      'Explore and filter our complete collection of calm, low-distraction sensory visual timers—engineered with gentle motion, soft palettes, and muted-by-default options for neurodivergent learners, classrooms, and therapy spaces.',
    featurePills: [
      'Interactive sensory attribute filters',
      'Live inline animation previews',
      'Calm motion & soft color palettes',
      'ADHD, autism & classroom friendly',
    ],
    quickPresets: [
      { icon: '⏳', label: 'Sand Timer', sublabel: 'Falling Grains', sec: 300 },
      { icon: '💧', label: 'Liquid Timer', sublabel: 'Smooth Drain', sec: 300 },
      { icon: '❄️', label: 'Frost Timer', sublabel: 'Ice Crystals', sec: 600 },
      { icon: '🌙', label: 'Moon Timer', sublabel: 'Lunar Phase', sec: 900 },
      { icon: '🌿', label: 'Lichen Timer', sublabel: 'Organic Growth', sec: 900 },
    ],
    steps: [
      { step: 1, title: 'Filter by sensory preference', description: 'Check attributes such as Low motion, No sound, Soft colors, Numeric display, or Visual-only display.' },
      { step: 2, title: 'Test live inline previews', description: 'Click the Preview button on any timer card to watch its animation style before leaving the page.' },
      { step: 3, title: 'Compare best-for recommendations', description: 'Read the sensory profile tags on each card to match the visual metaphor to your student or workspace.' },
      { step: 4, title: 'Launch your chosen sensory timer', description: 'Click "Open Timer" to enter the full interactive tool with fullscreen and Reduced Motion controls.' },
    ],
    guide: {
      tableOfContents: [
        'What Are Sensory Visual Timers?',
        'Why Low-Stimulation Visual Pacing Matters for ADHD & Autism',
        'How to Filter & Preview the Sensory Timer Collection',
        'Overview of Available Sensory Metaphors',
        'Classroom, Therapy & Home Applications',
        'Who Benefits Most?',
        'Practitioner Guidelines for Sensory-Friendly Timing',
        'Troubleshooting & Accessibility Reference',
      ],
      whatIsTitle: 'What Are Sensory Visual Timers?',
      whatIsBody: [
        'Sensory visual timers replace harsh ticking clocks and abrupt buzzers with calm, continuous natural metaphors—draining liquid, falling sand grains, rising bubbles, spreading frost crystals, accumulating snow, growing lichen, and lunar phases.',
        'For children and adults with autism, ADHD, sensory processing sensitivity, or test anxiety, rapid flashing digits and loud alarms can trigger dysregulation or task freeze. A sensory timer externalizes the passage of time gently so the brain can monitor pacing in peripheral vision without stress.',
      ],
      howItWorksTitle: 'Why Low-Stimulation Visual Pacing Matters for ADHD & Autism',
      howItWorksBody: [
        'Executive function researchers refer to difficulty estimating elapsed time as "time blindness." When a learner cannot see time moving, a 10-minute worksheet feels endless, and a 2-minute transition warning feels sudden and unfair.',
        'Our Sensory Visual Timers hub lets teachers, occupational therapists, parents, and students filter 8+ specialized visual timers by sensory traits—such as "Low motion", "Soft colors", and "Visual-only display"—and preview the live animation on the spot before launching fullscreen mode.',
      ],
      calloutNote:
        'Letting a student or therapy client pick their own sensory timer (e.g., choosing between Bubble Timer and Snow Timer) dramatically increases buy-in during transitions and independent work.',
      howToUseTitle: 'How to Choose the Right Sensory Timer',
      howToUseSteps: [
        'Use the interactive filter checkboxes at the top of the hub to narrow by Low motion, Soft colors, or Visual-only support.',
        'Click "Preview" on any card to watch a live demonstration of its visual motion.',
        'Click "Open Timer" to launch that timer’s dedicated page, where you can set exact durations, mute audio, or hide numbers.',
      ],
      featuresTitle: 'Sensory Hub Capabilities',
      featuresList: [
        'Trait-Based Sensory Filtering: Instantly filter by Low motion, No sound, Soft colors, Numeric display, and Visual-only mode.',
        'Live Card Previews: Inspect motion speed and visual contrast before opening a full timer.',
        'Universal Reduced Motion & Mute: Every timer in the collection supports silent visual completion and reduced particle motion.',
        'Zero Ads & Zero Clutter: Clean, calming typography and natural palettes across both light and dark modes.',
      ],
      practicalExamples: [
        { icon: 'GraduationCap', title: 'Special Education & IEP Support', description: 'Pair individual tablets or smartboards with low-motion Frost, Lichen, or Sand timers during structured tasks.' },
        { icon: 'Heart', title: 'Calm-Down Corners & OT Sessions', description: 'Run a 3-minute Bubble, Lava Lamp, or Liquid timer for sensory regulation and breathing breaks.' },
        { icon: 'BookOpen', title: 'Silent Reading & Exam Accommodations', description: 'Use Moon or Sun arc timers with numbers hidden to remove clock-watching anxiety.' },
        { icon: 'Users', title: 'Neurodivergent Home Routines', description: 'Support smooth homework, screen-time wind-down, and bedtime transitions.' },
      ],
      whoBenefitsTitle: 'Who Benefits From Sensory Visual Timers?',
      whoBenefitsList: [
        'Neurodivergent students and adults with ADHD, autism, or time blindness',
        'Special education teachers, school psychologists, and occupational therapists',
        'Early childhood educators teaching time concepts without numeracy barriers',
        'Writers, programmers, and meditators seeking calm ambient desk timers',
      ],
      tipsTitle: 'Best Practices for Sensory-Friendly Timing',
      tipsList: [
        'For learners who fixate on counting down seconds, toggle off "Show Time Text" inside the chosen timer so only the natural visual metaphor is shown.',
        'Keep audio muted by default in sensory-sensitive rooms and rely on the gentle 00:00 visual completion state.',
      ],
      problemsTitle: 'Matching Sensory Profiles to the Right Timer',
      problemsRows: [
        { problem: 'Student is distracted by rising bubbles or falling particles', cause: 'High sensitivity to vertical particle motion', solution: 'Filter by "Low motion" and choose the Lichen, Frost, Moon, or Rainbow Timer' },
        { problem: 'Bright white screen causes eye strain', cause: 'Photophobia or fluorescent classroom lighting', solution: 'Choose the Moon Timer, Galaxy Timer, or enable Dark Mode' },
        { problem: 'Want to create a custom named sensory timer', cause: 'Need custom task text on screen', solution: 'Open the Custom Timer Builder (/custom-timer) and choose Liquid Wave, Hourglass Sand, or Cozy Candle' },
      ],
    },
  },
};

function normalizeCategorySlug(rawSlug: string, categoryLabel?: string): string {
  const s = (rawSlug || '').toLowerCase();
  if (s === 'everyday') return 'timers';
  if (s === 'world-clock') return 'world';
  if (s === 'stage') {
    if (
      categoryLabel &&
      (categoryLabel.toLowerCase().includes('education') ||
        categoryLabel.toLowerCase().includes('classroom'))
    ) {
      return 'education';
    }
    return 'events';
  }
  return s || 'timers';
}

// Generic editorial content generator for any tool in the registry
export function getToolEditorialData(tool: ToolDefinition): ToolEditorialData {
  const custom = TOOL_EDITORIAL_CUSTOM[tool.slug];
  if (custom) {
    return {
      slug: tool.slug,
      categorySlug: normalizeCategorySlug(
        custom.categorySlug || tool.category,
        custom.categoryLabel || tool.categoryLabel
      ),
      categoryLabel: custom.categoryLabel || tool.categoryLabel,
      heroSubtitle: custom.heroSubtitle || tool.description,
      featurePills: custom.featurePills || [
        'Simple and reliable',
        'Works on all devices',
        'Fullscreen display',
        'Zero setup required',
      ],
      quickPresets: custom.quickPresets || [
        { icon: '⏱', label: '1 min', sublabel: 'Quick Sprint', sec: 60 },
        { icon: '⏱', label: '5 min', sublabel: 'Short Block', sec: 300 },
        { icon: '⏱', label: '10 min', sublabel: 'Activity', sec: 600 },
        { icon: '⏱', label: '15 min', sublabel: 'Standard', sec: 900 },
        { icon: '⏱', label: '30 min', sublabel: 'Extended', sec: 1800 },
      ],
      steps: custom.steps || [
        { step: 1, title: 'Configure parameters', description: 'Select presets or enter your desired settings.' },
        { step: 2, title: 'Start tool', description: `Begin running ${tool.name} with one click.` },
        { step: 3, title: 'Monitor progress', description: 'Observe clear numerical and visual updates.' },
        { step: 4, title: 'Review & reset', description: 'Complete your session and repeat as needed.' },
      ],
      guide: custom.guide || {
        tableOfContents: [
          `What Is ${tool.name}?`,
          'How Does It Work?',
          'How to Use',
          'Features and Settings',
          'Practical Examples',
          'Who Can Benefit?',
          'Tips for Better Results',
          'Common Problems',
          'Frequently Asked Questions',
        ],
        whatIsTitle: `What Is ${tool.name}?`,
        whatIsBody: [
          `${tool.name} is a high-precision, zero-install web application designed to help users track, manage, and optimize time without distractions. Built for performance and reliability across desktop and mobile devices.`,
        ],
        howItWorksTitle: 'How Does It Work?',
        howItWorksBody: [
          `It operates directly inside your modern web browser using standard high-resolution timing APIs. Calculations run with millisecond precision, ensuring zero drift during background execution.`,
        ],
        calloutNote: `Using ${tool.name} provides immediate structure to tasks, eliminating ambiguity and keeping every participant aligned.`,
        howToUseTitle: `How to Use ${tool.name}`,
        howToUseSteps: tool.instructions || [
          'Choose your desired settings or presets.',
          'Click Start to begin timing.',
          'Enable fullscreen mode for shared screen visibility.',
          'Reset or restart with convenient keyboard shortcuts.',
        ],
        featuresTitle: 'Main Features and Settings',
        featuresList: [
          'Instant browser-native execution',
          'High-contrast readability from distance',
          'Screen Wake Lock to prevent device sleep',
          'Audio chimes and pleasant sound notifications',
          'Fully touch-friendly for tablets and smartphones',
        ],
        practicalExamples: [
          {
            icon: 'GraduationCap',
            title: 'Learning & Study',
            description: 'Time lessons, tests, and study intervals.',
          },
          {
            icon: 'Monitor',
            title: 'Professional Work',
            description: 'Track meetings, presentations, and sprint reviews.',
          },
          {
            icon: 'Palette',
            title: 'Creative Practice',
            description: 'Maintain deep flow sessions without interruption.',
          },
          {
            icon: 'CheckSquare',
            title: 'Daily Productivity',
            description: 'Keep everyday habits and routines strictly on schedule.',
          },
        ],
        whoBenefitsTitle: 'Who Can Benefit From This Tool?',
        whoBenefitsList: [
          'Teachers and students in educational settings',
          'Event organizers, speakers, and moderators',
          'Remote team members coordinating across distances',
          'Fitness enthusiasts, athletes, and coaches',
        ],
        tipsTitle: 'Tips for Better Results',
        tipsList: [
          'Press the F key for distraction-free fullscreen projection.',
          'Ensure your audio volume is set comfortably before group events.',
          'Bookmark the tool for instant one-click launch during daily tasks.',
        ],
        problemsTitle: 'Common Problems and Solutions',
        problemsRows: [
          {
            problem: 'Timer not updating',
            cause: 'Browser tab paused by battery saver',
            solution: 'WebCountDownTimer uses delta timestamps to automatically recalculate exact time on resume',
          },
          {
            problem: 'No sound alert',
            cause: 'Browser requires user interaction before audio playback',
            solution: 'Click anywhere on the tool or toggle the audio icon to enable sound',
          },
        ],
      },
    };
  }

  // Fallback for tools without custom override
  return {
    slug: tool.slug,
    categorySlug: normalizeCategorySlug(tool.category, tool.categoryLabel),
    categoryLabel: tool.categoryLabel,
    heroSubtitle: tool.description,
    featurePills: [
      'Simple and reliable',
      'Works on all devices',
      'Fullscreen display',
      'Zero setup required',
    ],
    quickPresets: [
      { icon: '⏱', label: '1 min', sublabel: 'Quick Sprint', sec: 60 },
      { icon: '⏱', label: '5 min', sublabel: 'Short Block', sec: 300 },
      { icon: '⏱', label: '10 min', sublabel: 'Activity', sec: 600 },
      { icon: '⏱', label: '15 min', sublabel: 'Standard', sec: 900 },
      { icon: '⏱', label: '30 min', sublabel: 'Extended', sec: 1800 },
    ],
    steps: [
      { step: 1, title: 'Configure parameters', description: 'Select presets or enter your desired settings.' },
      { step: 2, title: 'Start tool', description: `Begin running ${tool.name} with one click.` },
      { step: 3, title: 'Monitor progress', description: 'Observe clear numerical and visual updates.' },
      { step: 4, title: 'Review & reset', description: 'Complete your session and repeat as needed.' },
    ],
    guide: {
      tableOfContents: [
        `What Is ${tool.name}?`,
        'How Does It Work?',
        'How to Use',
        'Features and Settings',
        'Practical Examples',
        'Who Can Benefit?',
        'Tips for Better Results',
        'Common Problems',
        'Frequently Asked Questions',
      ],
      whatIsTitle: `What Is ${tool.name}?`,
      whatIsBody: [
        `${tool.name} is a high-precision, zero-install web application designed to help users track, manage, and optimize time without distractions. Built for performance and reliability across desktop and mobile devices.`,
      ],
      howItWorksTitle: 'How Does It Work?',
      howItWorksBody: [
        `It operates directly inside your modern web browser using standard high-resolution timing APIs. Calculations run with millisecond precision, ensuring zero drift during background execution.`,
      ],
      calloutNote: `Using ${tool.name} provides immediate structure to tasks, eliminating ambiguity and keeping every participant aligned.`,
      howToUseTitle: `How to Use ${tool.name}`,
      howToUseSteps: tool.instructions || [
        'Choose your desired settings or presets.',
        'Click Start to begin timing.',
        'Enable fullscreen mode for shared screen visibility.',
        'Reset or restart with convenient keyboard shortcuts.',
      ],
      featuresTitle: 'Main Features and Settings',
      featuresList: [
        'Instant browser-native execution',
        'High-contrast readability from distance',
        'Screen Wake Lock to prevent device sleep',
        'Audio chimes and pleasant sound notifications',
        'Fully touch-friendly for tablets and smartphones',
      ],
      practicalExamples: [
        {
          icon: 'GraduationCap',
          title: 'Learning & Study',
          description: 'Time lessons, tests, and study intervals.',
        },
        {
          icon: 'Monitor',
          title: 'Professional Work',
          description: 'Track meetings, presentations, and sprint reviews.',
        },
        {
          icon: 'Palette',
          title: 'Creative Practice',
          description: 'Maintain deep flow sessions without interruption.',
        },
        {
          icon: 'CheckSquare',
          title: 'Daily Productivity',
          description: 'Keep everyday habits and routines strictly on schedule.',
        },
      ],
      whoBenefitsTitle: 'Who Can Benefit From This Tool?',
      whoBenefitsList: [
        'Teachers and students in educational settings',
        'Event organizers, speakers, and moderators',
        'Remote team members coordinating across distances',
        'Fitness enthusiasts, athletes, and coaches',
      ],
      tipsTitle: 'Tips for Better Results',
      tipsList: [
        'Press the F key for distraction-free fullscreen projection.',
        'Ensure your audio volume is set comfortably before group events.',
        'Bookmark the tool for instant one-click launch during daily tasks.',
      ],
      problemsTitle: 'Common Problems and Solutions',
      problemsRows: [
        {
          problem: 'Timer not updating',
          cause: 'Browser tab paused by battery saver',
          solution: 'WebCountDownTimer uses delta timestamps to automatically recalculate exact time on resume',
        },
        {
          problem: 'No sound alert',
          cause: 'Browser requires user interaction before audio playback',
          solution: 'Click anywhere on the tool or toggle the audio icon to enable sound',
        },
      ],
    },
  };
}

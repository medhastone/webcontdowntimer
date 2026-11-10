// Complete Registry of Time Tools in WebCountDownTimer

export interface ToolDefinition {
  slug: string;
  name: string;
  category: 'stage' | 'everyday' | 'world' | 'productivity';
  categoryLabel: string;
  description: string;
  badge?: string;
  icon: string;
  keywords: string[];
  targetAudience: string;
  faq: Array<{ question: string; answer: string }>;
  instructions: string[];
}

export const TOOLS_REGISTRY: ToolDefinition[] = [
  // 1. Stage and presentation tools
  {
    slug: 'speaker-timer',
    name: 'Speaker Timer',
    category: 'stage',
    categoryLabel: 'Stage & Presentation',
    description: 'High-contrast confidence timer designed for public speakers, keynote presenters, and conference podiums.',
    badge: 'Popular',
    icon: 'Mic',
    keywords: ['speaker timer', 'conference timer', 'keynote countdown', 'podium timer', 'stage display'],
    targetAudience: 'Conference speakers, event organizers, seminar leaders',
    instructions: [
      'Select a speech duration preset (e.g. 15 min, 20 min TED-style, 45 min keynote) or customize seconds.',
      'Click Start or press Spacebar. Enter Fullscreen (F) for clean visibility.',
      'Colors transition from green (active) to amber (wrap-up warning) to high-visibility red alert.',
      'Overtime mode activates automatically if the speaker exceeds their allocated time.',
    ],
    faq: [
      {
        question: 'Does the timer keep my screen from dimming or going to sleep?',
        answer: 'Yes. WebCountDownTimer automatically requests the browser Screen Wake Lock API so your podium display remains active for the entire duration of the speech.',
      },
      {
        question: 'Can I see how much the speaker ran over time?',
        answer: 'Yes, once the countdown hits zero, it seamlessly begins counting up in bold red numerals so moderators know exact overtime.',
      },
      {
        question: 'When do the yellow and red warning colors appear?',
        answer: 'The display remains green during the main body of the talk, turns amber when entering the final wrap-up window (typically the last 20% or 2 minutes), and turns red in the final minute and during overtime.',
      },
      {
        question: 'Can I use keyboard shortcuts at the podium?',
        answer: 'Yes. Press Spacebar to Start or Pause, R to Reset, F to toggle Fullscreen, and M to mute or unmute audio chimes.',
      },
    ],
  },
  {
    slug: 'presentation-timer',
    name: 'Presentation Timer',
    category: 'stage',
    categoryLabel: 'Stage & Presentation',
    description: 'Section-based timing tool for pitch decks, corporate presentations, and university dissertations.',
    icon: 'Presentation',
    keywords: ['presentation timer', 'pitch deck timer', 'slide timer', 'dissertation clock'],
    targetAudience: 'Founders pitching investors, business executives, graduate students',
    instructions: [
      'Configure overall presentation length and divide time across intro, problem, solution, and Q&A.',
      'Monitor the pacing meter to ensure you do not spend too long on initial slides.',
      'Use audio cue chimes to signal when it is time to move to the next section.',
    ],
    faq: [
      {
        question: 'How does section-based presentation timing work?',
        answer: 'You can define segments (e.g., 5 min Pitch, 10 min Demo, 5 min Q&A). The timer tracks your current section while showing overall remaining time.',
      },
      {
        question: 'Can I mute sound cues during formal pitches?',
        answer: 'Yes, sound alerts can be toggled on or off at any moment via the audio control or pressing M.',
      },
      {
        question: 'How much time should I reserve for Q&A in a 20-minute presentation?',
        answer: 'A standard rule is to allocate 15 minutes for slides (roughly 10 to 12 slides at 1.5 minutes each) and 5 full minutes for audience or investor questions.',
      },
      {
        question: 'Does the timer work on a second monitor while PowerPoint or Keynote is in Presenter View?',
        answer: 'Yes. You can place the Presentation Timer on a tablet or secondary screen next to your laptop, or run it in a compact side window alongside your slide notes.',
      },
    ],
  },
  {
    slug: 'stage-timer',
    name: 'Stage Timer',
    category: 'stage',
    categoryLabel: 'Stage & Presentation',
    description: 'Multi-screen synchronized stage countdown system with separate Operator Console and confidence monitor display.',
    badge: 'Live Sync',
    icon: 'Tv',
    keywords: ['stage timer', 'stagetimer alternative', 'confidence monitor', 'operator timer', 'broadcast timer'],
    targetAudience: 'AV engineers, live stream directors, theater stage managers, conference producers',
    instructions: [
      'Run the Operator Console on your laptop to control countdowns, pause, reset, and send instant messages.',
      'Click "Open Stage Display" in a new tab or projector screen on your confidence monitor.',
      'Everything syncs in real-time with zero lag using local BroadcastChannel and state replication.',
      'Send flash messages like "2 MINUTES LEFT", "WRAP UP", or "SPEAKER CHANGE" directly to the speaker.',
    ],
    faq: [
      {
        question: 'How does remote stage synchronization work without an account?',
        answer: 'WebCountDownTimer uses the browser BroadcastChannel API and local storage state sync. Any window or display open on the same room ID syncs in sub-millisecond real time.',
      },
      {
        question: 'Can I display a custom message to the speaker while the timer is running?',
        answer: 'Yes! Type any message into the Operator Console and toggle Show Message. It appears instantaneously in bold letters beneath the timer digits.',
      },
      {
        question: 'How do I connect a downstage confidence monitor to the Operator Console?',
        answer: 'Connect your projector or downstage monitor via HDMI/SDI in Extended Desktop mode, click "Open Stage Display", drag that window onto the confidence monitor, and press F for fullscreen.',
      },
      {
        question: 'Can I add or subtract 1 minute while a speaker is live on stage?',
        answer: 'Yes. The Operator Console allows live time adjustments and preset changes that update the stage monitor immediately without refreshing the page.',
      },
    ],
  },
  {
    slug: 'toastmasters-timer',
    name: 'Toastmasters Timer',
    category: 'stage',
    categoryLabel: 'Stage & Presentation',
    description: 'Official Toastmasters International timing rules with Green, Amber, and Red signaling cards and disqualification tracking.',
    badge: 'Official Rules',
    icon: 'Trophy',
    keywords: ['toastmasters timer', 'toastmasters green yellow red', 'table topics timer', 'speech contest timer'],
    targetAudience: 'Toastmasters club timer officers, contest chairs, club members practicing speeches',
    instructions: [
      'Select your speech role: Table Topics (1-2m), Icebreaker (4-6m), Prepared Speech (5-7m), or Evaluation (2-3m).',
      'At minimum qualifying time, the screen turns Green. At mid-point, it turns Amber. At maximum, it turns Red.',
      'Grace period is tracked: 30 seconds over Red marks the speech as disqualified for contests.',
    ],
    faq: [
      {
        question: 'What are the exact Toastmasters timing rules applied here?',
        answer: 'Table Topics: Green at 1:00, Amber at 1:30, Red at 2:00. Evaluations: Green at 2:00, Amber at 2:30, Red at 3:00. Icebreaker: Green at 4:00, Amber at 5:00, Red at 6:00. Prepared Speeches: Green at 5:00, Amber at 6:00, Red at 7:00.',
      },
      {
        question: 'Can this be used on a tablet or phone to hold up for speakers?',
        answer: 'Yes! Switch to Fullscreen mode or Color Card view to turn your entire screen into a bright Green, Amber, or Red flag.',
      },
      {
        question: 'What is the 30-second grace period in Toastmasters speech contests?',
        answer: 'Contestants are disqualified if they speak more than 30 seconds under the minimum (Green) time or more than 30 seconds over the maximum (Red) time—Except for Table Topics, where the minimum is strictly 1:00.',
      },
      {
        question: 'Does the red background stay on screen after maximum time is reached?',
        answer: 'Yes. In accordance with Toastmasters protocol, once the Red threshold is reached, the red signal remains visible until the speaker finishes.',
      },
    ],
  },
  {
    slug: 'debate-timer',
    name: 'Debate Timer',
    category: 'stage',
    categoryLabel: 'Stage & Presentation',
    description: 'Parliamentary, Oxford, and Lincoln-Douglas debate timer with protected time and Points of Information (POI) bells.',
    icon: 'Scale',
    keywords: ['debate timer', 'parliamentary debate timer', 'lincoln douglas timer', 'poi debate bell'],
    targetAudience: 'Debate society adjudicators, collegiate debaters, high school forensics teams',
    instructions: [
      'Choose debate format: British Parliamentary (7 min), World Schools, Lincoln-Douglas, or Oxford.',
      'The timer signals protected time during the first and last minute where Points of Information are prohibited.',
      'Double acoustic bell chimes ring automatically at 1:00 and 6:00, with continuous bells at overtime.',
    ],
    faq: [
      {
        question: 'What is protected time in debate timing?',
        answer: 'In parliamentary debate, the first and last minute of a speech are protected: opponents cannot offer Points of Information (POIs). The timer visually highlights this window.',
      },
      {
        question: 'Can judges customize speech and rebuttal durations?',
        answer: 'Yes, full custom speech length and rebuttal segment configurations are editable before starting.',
      },
      {
        question: 'When do the single and double gavel bells ring in a 7-minute British Parliamentary speech?',
        answer: 'A single bell rings at 1:00 elapsed (6:00 remaining) to open POIs, a single bell rings at 6:00 elapsed (1:00 remaining) to close POIs, and a double bell rings at 7:00 when time expires.',
      },
      {
        question: 'What is the grace period after the final double bell?',
        answer: 'Adjudicators typically allow a 15-second grace period (until 7:15) for the speaker to finish their current sentence before disregarding new material.',
      },
    ],
  },
  {
    slug: 'sermon-timer',
    name: 'Sermon Timer',
    category: 'stage',
    categoryLabel: 'Stage & Presentation',
    description: 'Discreet pulpit countdown timer for pastors, church services, and ministry timing with subtle amber warnings.',
    icon: 'Church',
    keywords: ['sermon timer', 'church timer', 'pulpit clock', 'ministry timer', 'sanctuary display'],
    targetAudience: 'Pastors, worship leaders, church AV production teams',
    instructions: [
      'Set target sermon length (e.g. 25 min, 35 min, 45 min) or sync with service end time.',
      'Enjoy calm, non-distracting visual cues that alert the speaker gently without startling the congregation.',
      'Discreet wrap-up prompt alerts the speaker 5 minutes and 2 minutes before benediction.',
    ],
    faq: [
      {
        question: 'Is the display discreet enough for a pulpit monitor?',
        answer: 'Yes. Sermon Timer features a pure blackout theme with low eye-strain contrast specifically designed for sanctuary confidence monitors.',
      },
      {
        question: 'Can the media booth send a silent message to the pulpit?',
        answer: 'Yes, discreet text alerts can be prompted or toggled without any audible chime.',
      },
      {
        question: 'What happens if the sermon goes past the scheduled time?',
        answer: 'The timer smoothly switches to a silent overtime counter so the speaker and worship team can see exact elapsed minutes past zero.',
      },
      {
        question: 'Can I use this for multi-service Sunday schedules?',
        answer: 'Yes, you can reset to your preset duration in one click between early and late services.',
      },
    ],
  },
  {
    slug: 'classroom-timer',
    name: 'Classroom Timer',
    category: 'stage',
    categoryLabel: 'Stage & Presentation',
    description: 'Visual classroom timer with vibrant progress rings, group activity presets, and cheerful end bells.',
    icon: 'GraduationCap',
    keywords: ['classroom timer', 'teacher countdown', 'student activity timer', 'school clock'],
    targetAudience: 'K-12 educators, university professors, workshop facilitators',
    instructions: [
      'Choose an activity: Quick Quiz (5m), Group Discussion (10m), Silent Reading (15m), or Custom.',
      'Project on your whiteboard or interactive display for the whole class to see.',
      'The visual ring shrinks smoothly so students can gauge pacing without counting digits.',
    ],
    faq: [
      {
        question: 'Can the timer run silently for reading and testing sessions?',
        answer: 'Yes, one-click silent mode disables all audio chimes, relying solely on the smooth visual ring.',
      },
      {
        question: 'Is it visible from the back row of a classroom?',
        answer: 'The extra-large typographic mode is designed specifically for classroom projectors and smartboards.',
      },
      {
        question: 'Can I add 1 or 2 extra minutes if students need more time on an activity?',
        answer: 'Yes, you can pause or adjust the duration at any point without losing classroom focus.',
      },
      {
        question: 'Does this classroom timer collect any student data?',
        answer: 'No. The timer runs 100% locally in your browser with zero accounts, cookies, or student data collection.',
      },
    ],
  },
  {
    slug: 'webinar-timer',
    name: 'Webinar Timer',
    category: 'stage',
    categoryLabel: 'Stage & Presentation',
    description: 'Live virtual event and webinar agenda tracker with multi-segment transitions (Intro, Keynote, Q&A).',
    icon: 'Video',
    keywords: ['webinar timer', 'zoom timer', 'virtual event clock', 'stream countdown'],
    targetAudience: 'Webinar hosts, virtual event producers, remote keynote speakers',
    instructions: [
      'Set your webinar agenda: Intro (5m), Keynote (30m), Panel (15m), Live Q&A (10m).',
      'Keep track of both your current segment and your overall webinar schedule.',
      'Receive gentle audio chimes 2 minutes before audience Q&A begins.',
    ],
    faq: [
      {
        question: 'Can I capture this window in OBS or Zoom as an overlay?',
        answer: 'Yes! Use distraction-free fullscreen or window capture. The clean high-contrast layout works crisply in OBS, vMix, and StreamYard.',
      },
      {
        question: 'Can I add or remove segments dynamically?',
        answer: 'Yes, add, delete, or reorder agenda segments at any time before or during setup.',
      },
      {
        question: 'How do I keep a 60-minute webinar from running out of time for Q&A?',
        answer: 'Break your 60-minute agenda into a 5-minute Welcome, 35-minute Presentation, 15-minute Live Q&A, and 5-minute Closing so the Q&A segment has its own protected countdown.',
      },
      {
        question: 'Will attendees hear the timer chime over Zoom or Teams?',
        answer: 'Only if you choose "Share Computer Sound" when sharing your screen. Otherwise, the chime plays privately in your host headphones.',
      },
    ],
  },
  {
    slug: 'event-countdown-timer',
    name: 'Event Countdown Timer',
    category: 'stage',
    categoryLabel: 'Stage & Presentation',
    description: 'Accurate target date and time countdown to product launches, conferences, livestreams, and new year celebrations.',
    icon: 'Calendar',
    keywords: ['event countdown timer', 'launch countdown', 'livestream timer', 'target date clock'],
    targetAudience: 'Product marketing managers, wedding planners, stream broadcasters',
    instructions: [
      'Select your target event date, time, and target time zone.',
      'Watch days, hours, minutes, and seconds count down with precision.',
      'Activate Livestream Mode for a clean overlay with celebratory confetti upon arrival.',
    ],
    faq: [
      {
        question: 'Does the countdown account for time zone differences?',
        answer: 'Yes! You can specify the exact time zone of your event so visitors around the world see the exact same countdown.',
      },
      {
        question: 'Can I share a direct link with the event pre-configured?',
        answer: 'Yes! The URL updates with your event parameters, making it instant to share with team members or embed.',
      },
      {
        question: 'How are leap years and different month lengths handled?',
        answer: 'The countdown subtracts the current UTC epoch millisecond timestamp from your target date timestamp, automatically accounting for 28, 29, 30, and 31-day months.',
      },
      {
        question: 'Can I display the event countdown on a lobby TV before doors open?',
        answer: 'Yes. Press F to launch Fullscreen mode, which hides browser chrome and centers the Days, Hours, Minutes, and Seconds display.',
      },
    ],
  },

  // 2. Everyday timing tools
  {
    slug: 'countdown-timer',
    name: 'Countdown Timer',
    category: 'everyday',
    categoryLabel: 'Everyday Timing',
    description: 'Precision digital countdown clock with custom hours, minutes, seconds, loop mode, and synthesized acoustic alarms.',
    badge: 'Essential',
    icon: 'Hourglass',
    keywords: ['countdown timer', 'online timer', 'alarm timer', 'set timer for 10 minutes'],
    targetAudience: 'Everyone needing reliable countdowns for cooking, working, studying, or resting',
    instructions: [
      'Enter hours, minutes, and seconds using the quick keypad or select one-click presets.',
      'Press Space to Start or Pause. Press R to Reset.',
      'Toggle looping mode if you want the countdown to repeat automatically.',
    ],
    faq: [
      {
        question: 'Will the timer still ring if I switch browser tabs?',
        answer: 'Yes! WebCountDownTimer continues running in the background and plays the audio chime even if the tab is inactive.',
      },
      {
        question: 'Can I set it for more than 24 hours?',
        answer: 'Yes, you can set countdowns up to 99 hours, 59 minutes, and 59 seconds.',
      },
      {
        question: 'How does the timer stay accurate when my browser throttles background tabs?',
        answer: 'Instead of relying on interval ticks that can lag, the timer compares your system clock against the exact target completion timestamp on every update.',
      },
      {
        question: 'What does Loop Mode do when the timer reaches 00:00?',
        answer: 'When Loop Mode is enabled, the timer plays the completion chime at 00:00 and immediately restarts the same duration for recurring intervals.',
      },
    ],
  },
  {
    slug: 'stopwatch',
    name: 'Online Stopwatch',
    category: 'everyday',
    categoryLabel: 'Everyday Timing',
    description: 'Millisecond-accurate online stopwatch with lap recording, split times, fastest/slowest lap detection, and CSV export.',
    badge: 'Precision',
    icon: 'Timer',
    keywords: ['stopwatch', 'online stopwatch', 'lap timer', 'split timer', 'millisecond stopwatch'],
    targetAudience: 'Athletes, coaches, lab technicians, usability testers, speedrunners',
    instructions: [
      'Click Start (or press Space) to begin millisecond timing.',
      'Click Lap (or press L) to record individual laps and split times.',
      'Review fastest (green) and slowest (amber) lap metrics, and export lap history to CSV.',
    ],
    faq: [
      {
        question: 'How accurate is this stopwatch?',
        answer: 'It calculates elapsed time using performance.now() high-resolution timestamps, giving sub-millisecond precision.',
      },
      {
        question: 'Can I export all my lap times?',
        answer: 'Yes, you can copy lap records directly to your clipboard or download them as a CSV file.',
      },
      {
        question: 'What is the difference between Lap Time and Split (Total) Time?',
        answer: 'Lap Time measures the duration of a single segment since the previous lap button press, while Split Time shows the cumulative elapsed time since the stopwatch started.',
      },
      {
        question: 'Does the stopwatch keep running if I switch to another window?',
        answer: 'Yes. Because elapsed time is calculated from the initial start timestamp, switching tabs or minimizing the window never introduces timing drift.',
      },
    ],
  },
  {
    slug: 'interval-timer',
    name: 'Interval Timer',
    category: 'productivity',
    categoryLabel: 'Productivity',
    description: 'Configurable HIIT, Tabata, and circuit training interval timer with warm-up, work/rest periods, and acoustic cues.',
    icon: 'Flame',
    keywords: ['interval timer', 'hiit timer', 'tabata timer', 'workout timer', 'round timer'],
    targetAudience: 'Fitness enthusiasts, personal trainers, boxers, physical therapists',
    instructions: [
      'Set Warm-up duration, Work interval, Rest interval, number of Sets, and Cycles.',
      'Audio chimes provide 3-2-1 acoustic countdowns before every work and rest transition.',
      'Clear color transitions (Green for Work, Amber for Rest) keep you focused mid-exercise.',
    ],
    faq: [
      {
        question: 'What is the classic Tabata protocol preset?',
        answer: 'Classic Tabata consists of 8 rounds of 20 seconds maximum effort work followed by 10 seconds of rest (4 minutes total).',
      },
      {
        question: 'Can I customize preparation and cool down periods?',
        answer: 'Yes, prep time, cool down, and inter-cycle recovery intervals are all individually customizable.',
      },
      {
        question: 'How do I calculate the total workout duration from work, rest, and rounds?',
        answer: 'Total Duration = Warm-up + (Rounds × (Work + Rest)) − Final Rest + Cool-down. The timer calculates and displays this total automatically.',
      },
      {
        question: 'What work-to-rest ratios are common for circuit training?',
        answer: 'Beginner circuits often use 1:1 (30s work / 30s rest), intermediate conditioning uses 2:1 (40s work / 20s rest), and high-intensity Tabata uses 2:1 (20s work / 10s rest).',
      },
    ],
  },
  {
    slug: 'pomodoro-timer',
    name: 'Pomodoro Timer',
    category: 'productivity',
    categoryLabel: 'Productivity',
    description: 'Structured Pomodoro focus timer with 25-minute work sprints, short/long breaks, and daily completion tracking.',
    badge: 'Productivity',
    icon: 'Coffee',
    keywords: ['pomodoro timer', 'focus timer', 'tomato timer', 'productivity sprint', 'pomodoro technique'],
    targetAudience: 'Software engineers, writers, students, knowledge workers',
    instructions: [
      'Type your current task name to stay intentionally focused.',
      'Start the 25-minute focus session. Work uninterrupted until the bell rings.',
      'Take a 5-minute short break. After 4 completed pomodoros, enjoy a rejuvenating 15-minute long break.',
    ],
    faq: [
      {
        question: 'What is the Pomodoro Technique?',
        answer: 'Developed by Francesco Cirillo in the late 1980s, it uses 25-minute focused work intervals separated by 5-minute breaks to maintain concentration and prevent mental fatigue.',
      },
      {
        question: 'Can I customize the session lengths?',
        answer: 'Yes, customize focus duration (e.g. 50 minutes), short break (10 minutes), and long break lengths in settings.',
      },
      {
        question: 'How long does one full 4-Pomodoro cycle take?',
        answer: 'Four 25-minute work sprints (100 minutes) plus three 5-minute short breaks (15 minutes) and one 15-minute long break equal 130 minutes (2 hours 10 minutes) of structured work.',
      },
      {
        question: 'What should I do if I get interrupted during a Pomodoro?',
        answer: 'Write down the distraction quickly to handle during your next break, or pause the timer if the interruption is urgent.',
      },
    ],
  },
  {
    slug: 'online-alarm-clock',
    name: 'Online Alarm Clock',
    category: 'everyday',
    categoryLabel: 'Everyday Timing',
    description: 'Set custom time-of-day alarms with gentle or loud wake chimes, customizable snooze intervals, and full-screen display.',
    icon: 'BellRing',
    keywords: ['alarm clock', 'online alarm clock', 'wake up alarm', 'set alarm for 7am'],
    targetAudience: 'Travelers, desk workers, power-nappers, shift workers',
    instructions: [
      'Select your desired wake-up or reminder time (AM/PM or 24-hour).',
      'Choose your alarm tone (Acoustic Bell, Electronic Chime, or Energetic Double Beep).',
      'Test your sound, leave the tab open, and rely on the alarm waking you reliably.',
    ],
    faq: [
      {
        question: 'Does the alarm work if my computer goes into sleep mode?',
        answer: 'Modern operating systems pause browser execution during sleep mode. Keep your device powered and prevent sleep or use our active wake lock to ensure the alarm triggers.',
      },
      {
        question: 'How long does snooze last?',
        answer: 'You can choose between 5, 10, or 15 minute snooze increments.',
      },
      {
        question: 'How can I test if my speakers are loud enough before setting the alarm?',
        answer: 'Click the "Test Sound" button next to the tone selector to preview the exact chime at your current system volume.',
      },
      {
        question: 'Does the online alarm clock use my local time zone?',
        answer: 'Yes, the alarm reads your device’s system clock and local time zone automatically.',
      },
    ],
  },

  // 3. World clock and time utilities
  {
    slug: 'world-clock',
    name: 'World Clock',
    category: 'world',
    categoryLabel: 'World Clock & Utilities',
    description: 'Real-time global clock for 400+ cities and IANA time zones with analog and digital displays, day/night status, and offsets.',
    badge: 'Global',
    icon: 'Globe',
    keywords: ['world clock', 'current time in tokyo', 'time in london', 'global timezones', 'city clocks'],
    targetAudience: 'Distributed global teams, travelers, stock market traders, remote workers',
    instructions: [
      'Browse major financial hubs or search any world city by name, country, or IANA code.',
      'Pin your favorite global cities for instantaneous side-by-side comparison.',
      'View day/night solar status, current UTC offsets, and active Daylight Saving Time indicators.',
    ],
    faq: [
      {
        question: 'Is this world clock accurate?',
        answer: 'Yes, our world clock uses the official IANA time-zone database and real-time calculations to ensure accurate local times, including daylight-saving adjustments.',
      },
      {
        question: 'Can I plan meetings for multiple time zones?',
        answer: 'Yes, you can use our Meeting Planner tool to compare multiple locations and find mutually convenient working hours.',
      },
      {
        question: 'Does the tool account for daylight-saving time?',
        answer: 'Yes. The tool automatically detects whether Daylight Saving Time (DST) is active in each region and updates the offset accordingly.',
      },
      {
        question: 'Why is the date different after conversion?',
        answer: 'Because of time-zone differences and the International Date Line, when it is morning in the Americas, it may already be nighttime or the next calendar day in Asia.',
      },
      {
        question: 'Can I convert time for any city in the world?',
        answer: 'You can convert time between major cities and all standard UTC offsets worldwide.',
      },
      {
        question: 'Is this tool free to use?',
        answer: 'Yes, all world clock and conversion tools on WebCountDownTimer are 100% free with no registration or limits.',
      },
    ],
  },
  {
    slug: 'time-zone-converter',
    name: 'Time Zone Converter',
    category: 'world',
    categoryLabel: 'World Clock & Utilities',
    description: 'Interactive 24-hour timeline scrubber to compare and convert dates and times seamlessly across multiple world time zones.',
    badge: 'Interactive',
    icon: 'ArrowLeftRight',
    keywords: ['time zone converter', 'timezone comparison', 'est to pst converter', 'convert gmt to ist'],
    targetAudience: 'Remote project managers, global meeting organizers, flight coordinators',
    instructions: [
      'Add the cities you want to compare.',
      'Drag the 24-hour time scrubber or pick an exact date and time.',
      'See corresponding local times instantly across every selected city, highlighting working hours.',
    ],
    faq: [
      {
        question: 'How does it handle date rollovers when converting across the International Date Line?',
        answer: 'The converter highlights +1 Day or -1 Day indicators whenever a converted time crosses midnight.',
      },
      {
        question: 'Can I share the converted time with participants?',
        answer: 'Yes! Click "Copy Meeting Time" to paste a formatted multi-timezone announcement directly into Slack, Teams, or email.',
      },
      {
        question: 'Why does the hour difference between New York and London change twice a year?',
        answer: 'The US switches to Daylight Saving Time on the second Sunday in March (March 8, 2026), while the UK and Europe switch on the last Sunday in March (March 29, 2026). During that 3-week gap, the difference shrinks from 5 hours to 4 hours.',
      },
      {
        question: 'Does it support 30-minute and 45-minute offset zones like India and Nepal?',
        answer: 'Yes. IANA zones such as Asia/Kolkata (UTC+5:30), Australia/Adelaide (UTC+9:30/+10:30), and Asia/Kathmandu (UTC+5:45) convert to exact minute precision.',
      },
    ],
  },
  {
    slug: 'time-difference-calculator',
    name: 'Time Difference Calculator',
    category: 'world',
    categoryLabel: 'World Clock & Utilities',
    description: 'Calculate the exact hour, minute, and calendar difference between two cities or time zones with business overlap analysis.',
    icon: 'Calculator',
    keywords: ['time difference calculator', 'hours between london and new york', 'time difference between cities'],
    targetAudience: 'Co-workers scheduling calls, loved ones staying in touch across oceans',
    instructions: [
      'Select Location A and Location B from our comprehensive global database.',
      'View the exact time delta (e.g. London is 5 hours ahead of New York).',
      'Inspect the shared working hour overlap window (9:00 AM - 5:00 PM mutual business hours).',
    ],
    faq: [
      {
        question: 'Does the calculator account for upcoming daylight-saving clock changes?',
        answer: 'Yes. You can calculate time differences for today as well as any future date to verify if DST changes will affect your schedule.',
      },
      {
        question: 'What about cities with 30-minute or 45-minute offsets?',
        answer: 'Locations like Mumbai (UTC+5:30) and Kathmandu (UTC+5:45) are computed to exact minute precision.',
      },
      {
        question: 'How is the time difference between two UTC offsets calculated?',
        answer: 'Subtract Location A’s UTC offset from Location B’s UTC offset. For example, Tokyo (UTC+9) minus New York (UTC-5 in winter) = +9 − (−5) = 14 hours ahead.',
      },
      {
        question: 'What if two cities have zero overlapping 9-to-5 business hours?',
        answer: 'When cities are 9 or more hours apart (such as San Francisco and Singapore), the calculator highlights early-morning and early-evening shoulder hours (7:00–9:00 AM and 5:00–8:00 PM) to find the least disruptive call time.',
      },
    ],
  },
  {
    slug: 'meeting-planner',
    name: 'World Meeting Planner',
    category: 'world',
    categoryLabel: 'World Clock & Utilities',
    description: 'Find optimal international meeting times across distributed team locations with color-coded green, yellow, and red availability.',
    badge: 'Popular',
    icon: 'Users',
    keywords: ['meeting planner', 'world clock meeting planner', 'international meeting scheduler', 'remote team time finder'],
    targetAudience: 'Remote team leaders, executive assistants, international client managers',
    instructions: [
      'Add team members and their respective cities (e.g. San Francisco, London, Berlin, Singapore).',
      'Examine the 24-hour visual grid: Green = Working hours (8am-6pm), Yellow = Early/Late (7am or 6-9pm), Red = Sleep.',
      'Click the column with the highest green overlap to copy the meeting invite link.',
    ],
    faq: [
      {
        question: 'What defines a good meeting slot in the planner?',
        answer: 'A slot where all participants are within reasonable waking and working hours (green), minimizing intrusive late-night calls.',
      },
      {
        question: 'Can I change the date to plan ahead for next week?',
        answer: 'Yes, choose any target date to account for scheduled DST transitions.',
      },
      {
        question: 'What do the Green, Yellow, and Red blocks represent?',
        answer: 'Green indicates standard working hours (08:00–18:00 local time), Yellow indicates flexible shoulder hours (07:00–08:00 and 18:00–21:00), and Red indicates overnight sleeping hours (21:00–07:00).',
      },
      {
        question: 'What is the best overlap window for US East Coast, UK, and India?',
        answer: 'Between 13:30 and 16:30 UTC: that corresponds to 8:30–11:30 AM in New York (EST), 1:30–4:30 PM in London (GMT), and 7:00–10:00 PM in Mumbai (IST).',
      },
    ],
  },
  {
    slug: 'unix-timestamp-converter',
    name: 'Unix Timestamp Converter',
    category: 'world',
    categoryLabel: 'World Clock & Utilities',
    description: 'Real-time Unix epoch converter supporting seconds, milliseconds, microseconds, human-readable dates, and batch conversion.',
    icon: 'Binary',
    keywords: ['unix timestamp converter', 'epoch time converter', 'timestamp to date', 'epoch now'],
    targetAudience: 'Software engineers, database administrators, DevOps professionals, QA engineers',
    instructions: [
      'View the real-time Unix timestamp ticking in live seconds and milliseconds.',
      'Paste any timestamp to instantly decode UTC, Local, ISO-8601, and relative time ("2 hours ago").',
      'Or pick a date and time to convert into epoch seconds or milliseconds.',
    ],
    faq: [
      {
        question: 'What is the Year 2038 Problem?',
        answer: 'On January 19, 2038 at 03:14:07 UTC, 32-bit signed integers reach their maximum value of 2,147,483,647 seconds and overflow. Modern 64-bit systems and this converter handle dates far beyond 2038 safely.',
      },
      {
        question: 'Does it support milliseconds and microseconds?',
        answer: 'Yes! The tool automatically detects whether an input has 10 digits (seconds), 13 digits (milliseconds), or 16 digits (microseconds).',
      },
      {
        question: 'What is the Unix Epoch starting date?',
        answer: 'Unix time counts elapsed seconds since 00:00:00 UTC on Thursday, January 1, 1970 (not counting leap seconds).',
      },
      {
        question: 'Does a Unix timestamp change depending on my local time zone?',
        answer: 'No. A Unix timestamp is always referenced to UTC. Two servers in Tokyo and New York at the exact same moment share the exact same Unix timestamp.',
      },
    ],
  },

  // ==========================================================================
  // PHASE 1 ADDITIONS: Visual Timer, Multi Stopwatch, Embed Timer
  // ==========================================================================
  {
    slug: 'visual-timer',
    name: 'Visual Timer',
    category: 'everyday',
    categoryLabel: 'Timers & Stopwatches',
    description: 'Configurable visual countdown timer with shrinking circular ring, linear bar, hourglass, traffic-light, rainbow segments, and sand dune modes.',
    badge: 'New',
    icon: 'Eye',
    keywords: ['visual timer', 'visual countdown', 'shrinking circle timer', 'sensory timer', 'traffic light timer'],
    targetAudience: 'Teachers, students, neurodivergent learners, presenters, and focus enthusiasts',
    instructions: [
      'Choose any of the 6 visual modes (Circular Ring, Linear Bar, Hourglass, Traffic Light, Segmented Arc, or Sand Dune).',
      'Select a preset duration or enter custom minutes and seconds.',
      'Switch between visual styles at any time—even while the countdown is actively running—without losing your timer state.',
    ],
    faq: [
      {
        question: 'Is the visual timer free to use?',
        answer: 'Yes, 100% free with no limits, accounts, or subscriptions.',
      },
      {
        question: 'Can I change the timer color?',
        answer: 'Yes, you can choose from 6 distinct color themes in the Appearance settings.',
      },
      {
        question: 'Can I use the visual timer on mobile devices?',
        answer: 'Yes, the visual timer is fully responsive and touch-friendly on iOS, Android, and tablets.',
      },
      {
        question: 'Can I use my own custom time?',
        answer: 'Yes, you can enter any custom hours, minutes, and seconds, or pick from popular presets.',
      },
      {
        question: 'Does the timer work in fullscreen mode?',
        answer: 'Yes, click the Fullscreen toggle or press the F key for a borderless display.',
      },
      {
        question: 'Is there a sound when the timer ends?',
        answer: 'Yes, an audible alarm chime sounds at 00:00, which can be toggled on or off.',
      },
    ],
  },
  {
    slug: 'multi-stopwatch',
    name: 'Multi Stopwatch',
    category: 'everyday',
    categoryLabel: 'Timers & Stopwatches',
    description: 'Run multiple independent stopwatches simultaneously for races, heats, swim lanes, group activities, and relay handoffs with CSV export.',
    badge: 'Pro',
    icon: 'Timer',
    keywords: ['multi stopwatch', 'multiple stopwatches', 'race timer', 'lane timer', 'relay stopwatch'],
    targetAudience: 'Track & swim coaches, PE teachers, lab researchers, race coordinators',
    instructions: [
      'Add participant names and heat or lane labels, or use the pre-configured lanes.',
      'Click "Start All" for a mass start, or start and stop each participant independently.',
      'Enable Relay Mode so stopping one participant automatically starts the next timer in sequence, then export all results to CSV.',
    ],
    faq: [
      {
        question: 'How does Relay Mode work?',
        answer: 'When Relay Mode is toggled ON, clicking Stop on participant #1 immediately starts participant #2 at the exact same millisecond timestamp.',
      },
      {
        question: 'Can I export all participant times and laps to a spreadsheet?',
        answer: 'Yes. Click Export CSV to download a complete table of ranks, total times, lap counts, and best laps.',
      },
      {
        question: 'How does "Start All" ensure fair race timing?',
        answer: 'Clicking Start All assigns the exact same high-resolution start timestamp to every lane simultaneously, eliminating human button-press delay between lanes.',
      },
      {
        question: 'How many independent stopwatches can I run at the same time?',
        answer: 'You can add and run a dozen or more lane stopwatches simultaneously on a single screen with zero performance lag.',
      },
    ],
  },
  {
    slug: 'embed-timer',
    name: 'Embeddable Timer Widgets',
    category: 'productivity',
    categoryLabel: 'Embeddable Widgets',
    description: 'Configure and copy responsive, sandboxed iframe countdown, visual timer, and stopwatch widgets for Notion, Canvas, WordPress, and docs.',
    icon: 'Code2',
    keywords: ['embed timer', 'timer widget', 'notion timer embed', 'iframe countdown', 'website timer widget'],
    targetAudience: 'Course creators, Notion builders, web developers, documentation authors',
    instructions: [
      'Select your widget type (Countdown, Visual Timer, or Stopwatch), title, duration, and color theme.',
      'Test the live interactive preview right on the page.',
      'Click "Copy Embed Code" to paste the sandboxed iframe snippet into your website or LMS.',
    ],
    faq: [
      {
        question: 'Is the embed widget safe and privacy-friendly?',
        answer: 'Yes. The generated iframe uses a strict HTML5 sandbox attribute with zero third-party tracking scripts or cookies.',
      },
      {
        question: 'How do I embed the timer in Notion?',
        answer: 'Copy the embed URL from the snippet, type /embed inside your Notion page, paste the URL, and click Embed Link.',
      },
      {
        question: 'Does the embedded timer work in Canvas, Moodle, and Google Sites?',
        answer: 'Yes. Any LMS or website builder that accepts standard HTML iframe embeds can display the responsive widget.',
      },
      {
        question: 'Can I customize the default duration and theme color in the embed code?',
        answer: 'Yes, all parameters (duration in seconds, label, mode, and color theme) are encoded directly in the widget URL query string.',
      },
    ],
  },

  // ==========================================================================
  // PHASE 2 ADDITIONS: Community Tools
  // ==========================================================================
  {
    slug: 'random-name-picker',
    name: 'Random Name Picker',
    category: 'productivity',
    categoryLabel: 'Randomizers & Group Activities',
    description: 'Pick a random name fairly from any list with optional winner removal, draw history, and 100% private local browser processing.',
    icon: 'Shuffle',
    keywords: ['random name picker', 'name of wheel alternative', 'student picker', 'raffle draw', 'random selector'],
    targetAudience: 'Teachers, workshop facilitators, team leads, event hosts',
    instructions: [
      'Paste or type your participant names (one name per line) or import a .txt/.csv file.',
      'Toggle "Remove winner after draw" if you want each person selected at most once.',
      'Click "Pick a Random Name" to draw fairly using an unbiased Fisher-Yates shuffle.',
    ],
    faq: [
      {
        question: 'Are the names I enter uploaded to any server?',
        answer: 'No. All name lists and random draws are processed 100% locally in your browser memory for complete student and team privacy.',
      },
      {
        question: 'How does the tool ensure every name has an equal chance?',
        answer: 'Each draw selects an index uniformly across the remaining list so every participant has an exact 1/N probability of being chosen.',
      },
      {
        question: 'How do I prevent the same student from being called twice?',
        answer: 'Enable the "Remove winner after draw" toggle. Chosen names are moved to the Draw History list until you reset the pool.',
      },
      {
        question: 'Can I paste a column of names directly from Excel or Google Sheets?',
        answer: 'Yes. Copy any column of cells from a spreadsheet and paste it directly into the text box—each row automatically becomes a separate entry.',
      },
    ],
  },
  {
    slug: 'random-group-generator',
    name: 'Random Group Generator',
    category: 'productivity',
    categoryLabel: 'Randomizers & Group Activities',
    description: 'Split any list of participants into balanced random teams by number of groups or maximum group size with CSV and clipboard export.',
    icon: 'Users',
    keywords: ['random group generator', 'team maker', 'split into groups', 'classroom group maker', 'breakout group generator'],
    targetAudience: 'Educators, scrum masters, hackathon organizers, sports coaches',
    instructions: [
      'Enter participant names (one per line) and choose whether to split by Number of Groups or Max People per Group.',
      'Click "Shuffle & Regenerate Groups" to create balanced teams without losing your original list.',
      'Copy the formatted teams to your clipboard or download as a CSV file.',
    ],
    faq: [
      {
        question: 'How does the generator handle uneven participant counts?',
        answer: 'Remainders are distributed round-robin across groups so group sizes differ by at most 1 person, preventing any team from being left with a single member.',
      },
      {
        question: 'What is the difference between splitting by "Number of Groups" and "Max People per Group"?',
        answer: 'If you have 24 students and choose 6 Groups, you get 6 teams of 4. If you choose Max 3 People per Group, you get 8 teams of 3.',
      },
      {
        question: 'Is the group shuffle unbiased?',
        answer: 'Yes, the participant array is randomized using the unbiased Fisher-Yates shuffle algorithm before distributing members into teams.',
      },
      {
        question: 'Can I re-shuffle the teams if two participants should not be paired?',
        answer: 'Yes, click "Shuffle & Regenerate Groups" as many times as needed or export the list to make manual adjustments.',
      },
    ],
  },
  {
    slug: 'classroom-noise-meter',
    name: 'Classroom Noise Meter',
    category: 'stage',
    categoryLabel: 'Education & Classroom',
    description: 'Visual ambient classroom volume monitor with configurable quiet/warning/loud thresholds and local browser microphone processing.',
    icon: 'Mic',
    keywords: ['classroom noise meter', 'volume monitor for teachers', 'quiet classroom tool', 'voice level meter'],
    targetAudience: 'Elementary, middle, and high school teachers, study hall proctors, librarians',
    instructions: [
      'Click "Start Microphone Monitoring" and grant browser microphone permission when prompted.',
      'Adjust the Maximum Acceptable Level slider to match the current activity (e.g., Silent Exam vs. Group Work).',
      'Project the live 20-segment bar on your classroom board so students can self-regulate room volume.',
    ],
    faq: [
      {
        question: 'Is classroom audio recorded or sent over the internet?',
        answer: 'Never. Audio amplitude is computed locally in real time using the browser Web Audio API and immediately discarded.',
      },
      {
        question: 'Why does the meter show a 0–100 relative scale instead of decibels (dB)?',
        answer: 'Consumer laptop and tablet microphones have uncalibrated hardware gain. Displaying a 0–100 relative scale is scientifically honest and allows teachers to set a practical threshold for their specific room.',
      },
      {
        question: 'What threshold setting works best for silent reading vs. group work?',
        answer: 'In most classrooms, a threshold of 25–35 works well for silent reading or testing, while 55–70 allows productive partner and small-group conversation.',
      },
      {
        question: 'What should I do if the meter stays at zero after clicking Start?',
        answer: 'Check the microphone icon in your browser address bar to ensure microphone permission is set to Allow and the correct input device is selected.',
      },
    ],
  },
  {
    slug: 'speech-time-calculator',
    name: 'Speech Time Calculator',
    category: 'stage',
    categoryLabel: 'Stage & Presentation',
    description: 'Convert speech scripts and word counts into estimated speaking duration with adjustable words-per-minute (WPM) pacing and pause intervals.',
    icon: 'FileText',
    keywords: ['speech time calculator', 'words to minutes', 'speaking time estimator', 'script timer', 'wpm calculator'],
    targetAudience: 'Keynote speakers, Toastmasters, students, podcasters, copywriters',
    instructions: [
      'Paste your speech script into the editor to see instant word, sentence, and paragraph counts.',
      'Select your speaking speed preset (Slow 110 WPM, Conversational 130 WPM, Keynote 150 WPM) or drag the custom WPM slider.',
      'Click "Practice in Presentation Timer" to rehearse your script against a live countdown.',
    ],
    faq: [
      {
        question: 'How many words per minute is a typical presentation?',
        answer: 'Most conversational presenters speak between 125 and 145 words per minute. A 5-minute speech is typically around 650 to 700 words.',
      },
      {
        question: 'What is the formula for converting word count into speaking time?',
        answer: 'Speaking Minutes = (Total Words ÷ Words Per Minute) + Pause Buffer. For example, 1,300 words at 130 WPM equals 10.0 minutes of speaking.',
      },
      {
        question: 'How many words is a 10-minute keynote speech?',
        answer: 'At a deliberate keynote pace of 130 WPM, a 10-minute talk is approximately 1,300 words. At a faster 150 WPM pace, it is about 1,500 words.',
      },
      {
        question: 'Why should I speak slower when presenting with slides or over Zoom?',
        answer: 'Audiences need 2 to 3 seconds to read slide visuals and process technical terms, so aiming for 120–130 WPM improves comprehension.',
      },
    ],
  },

  // ==========================================================================
  // PHASE 3 ADDITIONS: Time Calculators
  // ==========================================================================
  {
    slug: 'time-duration-calculator',
    name: 'Time Duration Calculator',
    category: 'world',
    categoryLabel: 'Calculators',
    description: 'Calculate the time between two points, including overnight hours.',
    icon: 'Clock',
    keywords: ['time duration calculator', 'hours between two times', 'elapsed time calculator', 'shift duration calculator'],
    targetAudience: 'Project managers, freelancers, pilots, healthcare shift workers, students',
    instructions: [
      'Enter the start date and time.',
      'Enter the end date and time.',
      'Click Calculate Duration.',
      'View the result in hours, minutes, total minutes and decimal hours.',
    ],
    faq: [
      {
        question: 'Can I calculate time across midnight?',
        answer: 'Yes! The calculator automatically counts the hours across midnight if the end time is on the next day (or earlier than the start time).',
      },
      {
        question: 'Does this calculator work with different dates?',
        answer: 'Yes. You can enter optional start and end dates to calculate exact duration across multiple calendar days or overnight shifts.',
      },
      {
        question: 'Is the time duration calculator free to use?',
        answer: 'Yes, this tool is completely free with no registration, software installation, or usage limits required.',
      },
      {
        question: 'Can I get the result in decimal hours?',
        answer: 'Yes. In addition to hours and minutes, the result displays decimal hours (e.g. 8.5 hours), which is ideal for payroll, invoicing, and timesheets.',
      },
      {
        question: 'Can I subtract break time from the total duration?',
        answer: 'You can calculate your shift chunks separately or subtract unpaid break minutes directly from the total minutes readout.',
      },
      {
        question: 'What if the start and end time are the same?',
        answer: 'If the start and end times are identical on the same calendar date, the total duration is 0 hours 0 minutes.',
      },
    ],
  },
  {
    slug: 'time-addition-calculator',
    name: 'Time Addition Calculator',
    category: 'world',
    categoryLabel: 'Time Calculators',
    description: 'Add and subtract multiple hours, minutes, and seconds entries with automatic base-60 rollover and decimal-hour conversion.',
    icon: 'Calculator',
    keywords: ['time addition calculator', 'add hours and minutes', 'sum time durations', 'video length calculator'],
    targetAudience: 'Video editors, podcast producers, aviation logbook keepers, accountants',
    instructions: [
      'Enter hours, minutes, and seconds for each row and choose + Add or − Subtract.',
      'Click "Add Duration Row" to include as many segments as needed.',
      'Copy the cumulative HH:MM:SS and decimal-hour total with one click.',
    ],
    faq: [
      {
        question: 'Can I mix addition and subtraction in the same list?',
        answer: 'Yes. Each row has its own + Add / − Sub selector so you can add work blocks and subtract deductions in one calculation.',
      },
      {
        question: 'How does base-60 rollover work when adding minutes and seconds?',
        answer: 'Every 60 seconds carries over as +1 minute, and every 60 minutes carries over as +1 hour. For example, 1h 45m + 2h 30m = 3h 75m = 4 hours 15 minutes.',
      },
      {
        question: 'Can I enter more than 59 minutes in a single row?',
        answer: 'Yes! You can type 90 or 150 minutes directly into the Minutes field and the calculator automatically converts it into hours and minutes.',
      },
      {
        question: 'How is the decimal-hour total calculated?',
        answer: 'Total seconds are divided by 3,600 (Decimal Hours = Total Seconds ÷ 3,600). For example, 4 hours 15 minutes = 15,300 seconds ÷ 3,600 = 4.25 hours.',
      },
    ],
  },
  {
    slug: 'time-card-calculator',
    name: 'Time Card Calculator',
    category: 'world',
    categoryLabel: 'Time Calculators',
    description: 'Calculate daily and weekly net work hours from start times, end times, and unpaid break deductions with decimal hours and CSV export.',
    icon: 'Calendar',
    keywords: ['time card calculator', 'timesheet calculator', 'weekly work hours calculator', 'payroll hours calculator'],
    targetAudience: 'Hourly employees, contractors, small business owners, bookkeepers',
    instructions: [
      'Check the days worked and enter Start Time, End Time, and unpaid Break (in minutes) for each shift.',
      'Review daily net hours in both standard (HH:MM) and payroll decimal format.',
      'Click "Export Time Card CSV" to save or print your weekly timesheet.',
    ],
    faq: [
      {
        question: 'Why are decimal hours shown alongside hours and minutes?',
        answer: 'Payroll systems multiply hourly rates by decimal hours (e.g., 7 hours 30 minutes = 7.50 hours rather than 7.30).',
      },
      {
        question: 'How do you calculate net daily work hours with an unpaid lunch break?',
        answer: 'Subtract Start Time from End Time to find gross shift minutes, subtract unpaid break minutes, and divide by 60. For example, 08:30 to 17:00 is 8h 30m (510 min); minus a 30m break = 480 min = 8.00 net hours.',
      },
      {
        question: 'Does the Time Card Calculator support overnight graveyard shifts?',
        answer: 'Yes. If a shift End Time is earlier than the Start Time (for example, 22:00 to 06:00), the calculator automatically adds 24 hours to compute the 8-hour overnight shift.',
      },
      {
        question: 'What is the minute-to-decimal conversion for 15, 30, and 45 minutes?',
        answer: '15 minutes = 0.25 hours, 30 minutes = 0.50 hours, and 45 minutes = 0.75 hours.',
      },
    ],
  },
  {
    slug: 'overtime-calculator',
    name: 'Overtime Calculator',
    category: 'world',
    categoryLabel: 'Time Calculators',
    description: 'Estimate regular and overtime hours and gross pay with configurable weekly/daily thresholds and custom overtime multipliers (1.5x, 2.0x).',
    icon: 'Calculator',
    keywords: ['overtime calculator', 'time and a half calculator', 'overtime pay estimator', '1.5x pay calculator'],
    targetAudience: 'Workers, freelancers, HR coordinators, operations managers',
    instructions: [
      'Enter your Total Hours Worked and your applicable Overtime Threshold (e.g. 40 hours).',
      'Select your Overtime Multiplier (1.5x, 2.0x, or custom) and optional Base Hourly Rate.',
      'Review the separate Regular and Overtime totals and copy the breakdown.',
    ],
    faq: [
      {
        question: 'Does this calculator enforce state or national overtime laws automatically?',
        answer: 'Because overtime rules vary by jurisdiction and contract, all thresholds and multipliers are user-configurable estimates.',
      },
      {
        question: 'How is "time and a half" (1.5x) overtime pay calculated?',
        answer: 'Multiply your base hourly rate by 1.5 to get your overtime hourly rate, then multiply by your overtime hours. For example, at $24/hour with 6 overtime hours: $24 × 1.5 = $36/hr × 6 hrs = $216 overtime pay.',
      },
      {
        question: 'What is the total gross pay formula?',
        answer: 'Gross Pay = (Regular Hours × Base Rate) + (Overtime Hours × Base Rate × Multiplier).',
      },
      {
        question: 'Can I calculate daily overtime (such as an 8-hour daily threshold)?',
        answer: 'Yes. Change the Overtime Threshold field from 40 hours to 8 hours (or any contract threshold) to calculate daily overtime for a single shift.',
      },
    ],
  },

  // ==========================================================================
  // PHASE 4 ADDITIONS: Cooking, Study/Break, Wellness, & Community Activities
  // ==========================================================================
  {
    slug: 'kitchen-timer',
    name: 'Kitchen Timer',
    category: 'everyday',
    categoryLabel: 'Cooking & Everyday Tools',
    description: 'Multi-burner kitchen countdown timer allowing home cooks and chefs to track pasta, roasting, simmering, and resting simultaneously.',
    icon: 'Utensils',
    keywords: ['kitchen timer', 'cooking timer', 'multi burner timer', 'baking timer'],
    targetAudience: 'Home cooks, bakers, culinary students, meal preppers',
    instructions: [
      'Click any culinary preset to launch a new simultaneous kitchen station timer, or add a custom dish below.',
      'Run multiple timers at the same time—each station rings independently when finished.',
    ],
    faq: [
      {
        question: 'Can I run multiple cooking timers at once?',
        answer: 'Yes! Add as many burner or oven timers as you need; each card has its own Start, Pause, and Reset controls.',
      },
      {
        question: 'Can I label each timer for a different pot or oven rack?',
        answer: 'Yes, type a custom dish name (such as "Garlic Bread Top Rack" or "Boiling Pasta") before adding a timer card.',
      },
      {
        question: 'Will my tablet screen turn off while my hands are covered in flour?',
        answer: 'No. When a kitchen timer is running, the browser Screen Wake Lock keeps your display illuminated so you can check remaining time hands-free.',
      },
      {
        question: 'What happens if two kitchen timers finish around the same time?',
        answer: 'Each completed station highlights in bright red and plays an acoustic chime so you can see immediately which dish is ready.',
      },
    ],
  },
  {
    slug: 'egg-timer',
    name: 'Egg Timer',
    category: 'everyday',
    categoryLabel: 'Cooking & Everyday Tools',
    description: 'Precision boiled egg timer with presets for soft runny yolks, jammy ramen eggs, medium firm, and hard-boiled eggs.',
    icon: 'Hourglass',
    keywords: ['egg timer', 'boiled egg timer', 'soft boiled egg time', 'jammy egg timer'],
    targetAudience: 'Breakfast lovers, ramen enthusiasts, home cooks',
    instructions: [
      'Bring water to a gentle simmer before lowering your eggs in.',
      'Select Soft Runny (4m 30s), Jammy (6m 30s), Medium (8m), or Hard Boiled (10m 30s) and click Start.',
      'Transfer eggs to an ice bath immediately when the chime sounds.',
    ],
    faq: [
      {
        question: 'Why should I use an ice bath when the egg timer finishes?',
        answer: 'Cold water halts residual carryover cooking immediately and shrinks the egg body slightly inside the shell, making it much easier to peel.',
      },
      {
        question: 'Should I put eggs into cold water or already-boiling water?',
        answer: 'For consistent timing, gently lower refrigerator-cold large eggs into already simmering water. Starting in boiling water eliminates the variable time different stoves take to heat up.',
      },
      {
        question: 'How long do you boil an egg for a jammy ramen yolk?',
        answer: '6 minutes 30 seconds in simmering water followed by an ice bath produces set whites and a custardy, jammy yolk.',
      },
      {
        question: 'How should I adjust time for extra-large eggs or high altitude?',
        answer: 'Add 30 to 45 seconds for Extra-Large (XL) eggs, or if you live above 5,000 feet (1,500 meters) where water boils at a lower temperature.',
      },
    ],
  },
  {
    slug: 'tea-timer',
    name: 'Tea Steeping Timer',
    category: 'everyday',
    categoryLabel: 'Cooking & Everyday Tools',
    description: 'Steeping countdown timer with ideal water temperature guides for Green, White, Oolong, Black, and Herbal teas.',
    icon: 'Coffee',
    keywords: ['tea timer', 'steeping timer', 'green tea timer', 'black tea brew time'],
    targetAudience: 'Tea enthusiasts, baristas, everyday tea drinkers',
    instructions: [
      'Select your tea variety to load its recommended steeping duration and water temperature note.',
      'Start the timer as soon as hot water meets the tea leaves to prevent bitterness from over-extraction.',
    ],
    faq: [
      {
        question: 'Why does green tea steep for less time than black tea?',
        answer: 'Green tea leaves are unoxidized and release bitter tannins and catechins quickly if steeped longer than 2 minutes or in boiling water.',
      },
      {
        question: 'What water temperatures are recommended for each tea type?',
        answer: 'Green tea: 75–80°C (170–175°F); White tea: 80–85°C (175–185°F); Oolong tea: 85–90°C (185–195°F); Black and Herbal tisanes: 95–100°C (205–212°F).',
      },
      {
        question: 'Does steeping tea longer increase caffeine or just bitterness?',
        answer: 'Most caffeine extracts within the first 2 to 3 minutes; steeping black or green tea beyond 5 minutes mainly extracts astringent polyphenols that make the cup taste bitter.',
      },
      {
        question: 'Can I re-steep loose-leaf oolong or green tea?',
        answer: 'Yes. Whole-leaf oolong, white, and green teas can be steeped 2 to 3 times—simply add 30 seconds to each subsequent infusion.',
      },
    ],
  },
  {
    slug: 'coffee-timer',
    name: 'Coffee Brew Timer',
    category: 'everyday',
    categoryLabel: 'Cooking & Everyday Tools',
    description: 'Specialty coffee extraction timer with presets for V60 Pour-Over bloom and pour, French Press, AeroPress, and Espresso shots.',
    icon: 'Coffee',
    keywords: ['coffee timer', 'pour over timer', 'french press timer', 'aeropress timer', 'espresso shot timer'],
    targetAudience: 'Home baristas, specialty coffee brewers, cafe staff',
    instructions: [
      'Choose your brew method (Pour-Over 45s Bloom, V60 3m Total, French Press 4m, AeroPress 1m 45s, or Espresso 28s).',
      'Run the Bloom and Total Pour timers simultaneously or sequentially for consistent extraction.',
    ],
    faq: [
      {
        question: 'What is the coffee bloom phase?',
        answer: 'Pouring twice the weight of coffee in hot water and waiting 30–45 seconds allows trapped CO2 gas to escape so water extracts flavor evenly.',
      },
      {
        question: 'What coffee-to-water ratio works best for Pour-Over and French Press?',
        answer: 'A standard specialty coffee ratio is 1:16 (for example, 15 grams of ground coffee to 240 grams/mL of water, or 30 grams to 480 grams).',
      },
      {
        question: 'What if my V60 pour-over finishes draining much faster or slower than 3 minutes?',
        answer: 'If it drains in under 2 minutes and tastes sour, grind slightly finer. If it takes over 4 minutes and tastes bitter or dry, grind slightly coarser.',
      },
      {
        question: 'How long should a standard double espresso shot run?',
        answer: 'Most modern espresso recipes target a 1:2 yield (e.g., 18g dry dose to 36g liquid espresso) extracted in 25 to 30 seconds from pump start.',
      },
    ],
  },
  {
    slug: 'study-timer',
    name: 'Study Timer',
    category: 'productivity',
    categoryLabel: 'Productivity & Study',
    description: 'Structured academic study timer with 25m/5m, 45m/10m, 50m/10m, and 90m/20m ultradian focus and review cycles.',
    icon: 'GraduationCap',
    keywords: ['study timer', 'exam prep timer', 'homework timer', 'student focus clock'],
    targetAudience: 'High school, college, medical, and law students, lifelong learners',
    instructions: [
      'Select your preferred study-to-break ratio (such as the 45m Study / 10m Break academic block).',
      'Study without phone distractions until the completion chime transitions you to your break.',
    ],
    faq: [
      {
        question: 'Which study interval length is best for deep memorization?',
        answer: 'Many students find 45-to-50 minute blocks ideal for complex problem sets, while 25-minute blocks help overcome initial procrastination.',
      },
      {
        question: 'What is the 50/10 academic study rule?',
        answer: 'Studying for 50 minutes followed by a 10-minute screen-free break aligns every cycle to a clean 60-minute clock hour, making full-day revision schedules easy to plan.',
      },
      {
        question: 'How should I use the 90-minute ultradian block?',
        answer: 'Use 90-minute blocks for full practice exams, essay writing, or coding projects, followed by a 20-minute restorative walk or snack break.',
      },
      {
        question: 'Can I mute the timer in a university library?',
        answer: 'Yes. Click the sound icon to enable silent visual mode so the countdown finishes without disturbing quiet study areas.',
      },
    ],
  },
  {
    slug: 'reading-timer',
    name: 'Reading Timer',
    category: 'productivity',
    categoryLabel: 'Productivity & Study',
    description: 'Dedicated reading session countdown timer with pages-read tracking and estimated reading pace calculation.',
    icon: 'BookOpen',
    keywords: ['reading timer', 'book reading clock', 'daily reading habit timer', 'pages per hour tracker'],
    targetAudience: 'Students, book club members, researchers, parents tracking kids reading logs',
    instructions: [
      'Select a 15, 30, 45, or 60-minute reading block and start the countdown.',
      'Log the number of pages completed to see your estimated pages-per-hour reading pace.',
    ],
    faq: [
      {
        question: 'Can this be used for daily school reading logs?',
        answer: 'Yes, the 15-minute and 30-minute presets match standard school reading log requirements.',
      },
      {
        question: 'How is the Pages Per Hour reading speed calculated?',
        answer: 'Pages Per Hour = (Pages Read ÷ Session Minutes) × 60. For example, reading 18 pages in a 30-minute session equals 36 pages per hour.',
      },
      {
        question: 'How long will it take to finish a 300-page book?',
        answer: 'At an average pace of 30 pages per hour, a 300-page book takes 10 hours—just 20 daily 30-minute reading sessions.',
      },
      {
        question: 'Does the reading timer make any ticking sound while I read?',
        answer: 'No, the countdown runs completely silently and only plays a gentle chime when your reading session ends.',
      },
    ],
  },
  {
    slug: 'break-timer',
    name: 'Break Timer',
    category: 'productivity',
    categoryLabel: 'Productivity & Study',
    description: 'Quick 5, 10, 15, and 30-minute restorative break countdown timer to recharge between meetings and deep work blocks.',
    icon: 'Coffee',
    keywords: ['break timer', '10 minute break timer', 'lunch break countdown', 'rest timer'],
    targetAudience: 'Remote workers, office teams, workshop facilitators, students',
    instructions: [
      'Pick a 5m Micro-Break, 10m Stretch, 15m Coffee Break, or 30m Lunch Recharge.',
      'Step away from your screen; the acoustic chime will let you know when it is time to resume.',
    ],
    faq: [
      {
        question: 'Why time work breaks?',
        answer: 'Intentional timed breaks prevent short rests from turning into 45-minute scrolling sessions while ensuring you genuinely step away from work.',
      },
      {
        question: 'What is the best activity for a 5-minute or 10-minute work break?',
        answer: 'Stand up from your desk, hydrate, stretch your shoulders and hips, and look out a distant window rather than switching to a phone screen.',
      },
      {
        question: 'Can workshop facilitators project this during conference intermissions?',
        answer: 'Yes! Switch to Fullscreen mode (F) on the room projector so attendees see exactly how many minutes remain before the next session begins.',
      },
      {
        question: 'Does the break chime play if I step away from my desk?',
        answer: 'Yes, keep your laptop volume audible and the acoustic chime will ring across the room when the break reaches 00:00.',
      },
    ],
  },
  {
    slug: 'eye-break-timer',
    name: '20-20-20 Eye Break Timer',
    category: 'productivity',
    categoryLabel: 'Productivity & Study',
    description: 'Automated 20-20-20 rule reminder timer: every 20 minutes of screen work, look 20 feet away for 20 seconds to reduce digital eye strain.',
    icon: 'Eye',
    keywords: ['eye break timer', '20 20 20 timer', 'screen rest reminder', 'eye strain timer'],
    targetAudience: 'Software developers, designers, gamers, office workers',
    instructions: [
      'Start the 20-minute screen work countdown while working at your monitor.',
      'When the gentle chime sounds, focus your eyes on an object at least 20 feet (6 meters) away for the 20-second rest phase.',
    ],
    faq: [
      {
        question: 'What is the 20-20-20 rule?',
        answer: 'Optometrists commonly suggest taking a 20-second break every 20 minutes to look at something 20 feet (6 meters) away to relax the eye focusing muscles.',
      },
      {
        question: 'Why 20 feet (6 meters)?',
        answer: 'Looking at an object 20 feet or further away allows the ciliary muscles inside the eye to relax from continuous near-focus screen accommodation.',
      },
      {
        question: 'Does the timer automatically switch between the 20-minute work phase and 20-second rest phase?',
        answer: 'Yes, you can cycle directly between the 20-minute screen interval and the 20-second distant-gaze countdown.',
      },
      {
        question: 'Is this tool a substitute for an eye exam?',
        answer: 'No. This is a general workplace ergonomic reminder. Consult a qualified optometrist or ophthalmologist for persistent eye strain or vision issues.',
      },
    ],
  },
  {
    slug: 'tabata-timer',
    name: 'Tabata Timer',
    category: 'productivity',
    categoryLabel: 'Fitness & Wellness',
    description: 'High-intensity 8-round Tabata workout timer (20 seconds work, 10 seconds rest) with round counter and acoustic transitions.',
    icon: 'Flame',
    keywords: ['tabata timer', '20 10 interval timer', '4 minute tabata clock', 'hiit tabata'],
    targetAudience: 'HIIT athletes, CrossFitters, home workout enthusiasts, fitness coaches',
    instructions: [
      'Use the classic 8 rounds of 20s Work / 10s Rest (4 minutes total) or customize your intervals.',
      'Follow the high-contrast round indicator and bell cues through all 8 sprints.',
    ],
    faq: [
      {
        question: 'Who invented the Tabata protocol?',
        answer: 'Dr. Izumi Tabata and his colleagues at the National Institute of Fitness and Sports in Kanoya, Japan published the 20-second work / 10-second rest protocol in 1996 working with Olympic speed skaters.',
      },
      {
        question: 'Why is a standard Tabata workout 4 minutes long?',
        answer: '8 rounds × (20 seconds work + 10 seconds rest) = 8 × 30 seconds = 240 seconds, or 4 minutes of high-intensity interval training.',
      },
      {
        question: 'Should I warm up before starting the 4-minute Tabata clock?',
        answer: 'Yes. Always perform 5 to 10 minutes of dynamic warm-up before high-intensity intervals, and include a cool-down afterward.',
      },
      {
        question: 'Can I change the 20s/10s durations for beginner workouts?',
        answer: 'Yes, you can customize work seconds, rest seconds, and total rounds to match your fitness level.',
      },
    ],
  },
  {
    slug: 'boxing-timer',
    name: 'Boxing Round Timer',
    category: 'productivity',
    categoryLabel: 'Fitness & Wellness',
    description: '3-minute boxing, MMA, and Muay Thai round timer with 1-minute corner rest and 30-second end-of-round warning clapper.',
    icon: 'Timer',
    keywords: ['boxing timer', 'mma round timer', '3 minute round clock', 'sparring timer'],
    targetAudience: 'Boxers, martial artists, kickboxing gyms, heavy bag trainers',
    instructions: [
      'Default configuration runs 12 rounds of 3-minute work and 1-minute rest (or customize for 5-minute MMA rounds).',
      'Listen for the 30-second warning alert before the round bell rings.',
    ],
    faq: [
      {
        question: 'Can I change the round length for amateur boxing or MMA?',
        answer: 'Yes! Set work duration to 120 seconds (2m amateur rounds) or 300 seconds (5m MMA rounds) in one click.',
      },
      {
        question: 'What are standard round lengths across combat sports?',
        answer: 'Professional Boxing and Muay Thai use 3-minute rounds with 1-minute rest; Amateur Boxing uses 2- or 3-minute rounds; MMA uses 5-minute rounds with 1-minute rest.',
      },
      {
        question: 'Does the timer include a warning cue before the round ends?',
        answer: 'Yes, an acoustic warning cue sounds with 30 seconds remaining in the work round, followed by the round bell at 00:00.',
      },
      {
        question: 'Can I project this on a gym wall monitor?',
        answer: 'Yes, press F for Fullscreen mode so fighters and coaches can read the round number, phase (WORK / REST), and remaining time across the gym.',
      },
    ],
  },
  {
    slug: 'meditation-timer',
    name: 'Meditation Timer',
    category: 'productivity',
    categoryLabel: 'Fitness & Wellness',
    description: 'Distraction-free mindfulness and meditation timer with gentle acoustic tubular bell chimes.',
    icon: 'Sparkles',
    keywords: ['meditation timer', 'mindfulness bell timer', 'zen timer', 'quiet meditation clock'],
    targetAudience: 'Meditators, yoga practitioners, mindfulness groups',
    instructions: [
      'Set your desired sitting duration (e.g. 10 minutes, 20 minutes, or 30 minutes).',
      'Press Start and rest your attention; a resonant acoustic bell will sound gently when your session completes.',
    ],
    faq: [
      {
        question: 'Does the meditation timer make ticking noises during the session?',
        answer: 'No. The timer runs completely silently and only rings the gentle harmonic bell at completion.',
      },
      {
        question: 'What is a good meditation duration for beginners?',
        answer: 'Starting with 5 or 10 minutes daily builds a sustainable habit before gradually extending sessions to 20 or 30 minutes.',
      },
      {
        question: 'Will my screen stay awake so the completion bell plays on time?',
        answer: 'Yes, the active Screen Wake Lock prevents your phone or laptop from sleeping during your sit.',
      },
      {
        question: 'Can I use this for yoga savasana or sound-bath sessions?',
        answer: 'Yes, you can enter any custom duration up to 180 minutes for extended yoga, breathwork, or group mindfulness classes.',
      },
    ],
  },
  {
    slug: 'breathing-timer',
    name: 'Breathing Pacer Timer',
    category: 'productivity',
    categoryLabel: 'Fitness & Wellness',
    description: 'Guided visual breathing pacer supporting Box Breathing (4-4-4-4), 4-7-8 Relaxing Breath, and Coherent Breathing (5-5).',
    icon: 'Wind',
    keywords: ['breathing timer', 'box breathing timer', '4 7 8 breathing pacer', 'coherent breathing tool'],
    targetAudience: 'Speakers calming pre-stage nerves, students, athletes, everyday relaxation',
    instructions: [
      'Choose Box Breathing (4-4-4-4), 4-7-8 Relaxing Breath, or Coherent Breathing (5-5).',
      'Follow the live phase prompt (Inhale, Hold, Exhale) as the timer cycles smoothly through each breath stage.',
    ],
    faq: [
      {
        question: 'Is this breathing tool a medical device?',
        answer: 'No. It is a simple visual pacing guide for general relaxation and focus before presentations or study sessions.',
      },
      {
        question: 'How does Box Breathing (4-4-4-4) work?',
        answer: 'Inhale gently for 4 seconds, hold the breath for 4 seconds, exhale smoothly for 4 seconds, and pause for 4 seconds before the next breath (16 seconds per full cycle).',
      },
      {
        question: 'What is Coherent Breathing (5-5)?',
        answer: 'Coherent breathing uses a steady 5-second inhale and 5-second exhale with no breath holds, resulting in 6 calm breaths per minute.',
      },
      {
        question: 'What should I do if holding my breath feels uncomfortable?',
        answer: 'Never force breath holds. Switch to Coherent Breathing (5s inhale / 5s exhale) or return to your natural breathing rhythm at any time.',
      },
    ],
  },
  {
    slug: 'chess-clock',
    name: 'Chess Clock',
    category: 'everyday',
    categoryLabel: 'Randomizers & Group Activities',
    description: 'Two-player digital chess and board game clock with Bullet, Blitz, and Rapid presets, Fischer time increments, and move counters.',
    icon: 'Timer',
    keywords: ['chess clock', 'two player game timer', 'fischer increment clock', 'blitz chess timer'],
    targetAudience: 'Chess players, board game clubs, tournament organizers',
    instructions: [
      'Select a time control preset (Bullet 1+0, Blitz 3+2, Blitz 5+3, or Rapid 10+0).',
      'Tap your side of the clock after completing each move to add your Fischer increment and start your opponent’s clock.',
    ],
    faq: [
      {
        question: 'What does 5+3 mean in chess time controls?',
        answer: 'Each player starts with 5 minutes on their clock and gains 3 seconds of bonus Fischer increment after every completed move.',
      },
      {
        question: 'What are the standard time categories for Bullet, Blitz, and Rapid chess?',
        answer: 'Under FIDE and online chess standards, Bullet is under 3 minutes per player (e.g. 1+0, 2+1), Blitz is 3 to 10 minutes (3+0, 3+2, 5+3), and Rapid is 10 to 60 minutes (10+0, 15+10).',
      },
      {
        question: 'Can we use this on a phone or tablet placed between two players?',
        answer: 'Yes! Place your phone or tablet flat beside the board and tap your player card after each move.',
      },
      {
        question: 'Does the clock track total moves made by White and Black?',
        answer: 'Yes, each player card displays a live move counter alongside the remaining time.',
      },
    ],
  },
  {
    slug: 'quiz-timer',
    name: 'Quiz & Trivia Timer',
    category: 'stage',
    categoryLabel: 'Education & Classroom',
    description: 'Per-question rapid countdown timer with question counter, buzz-in pause, 3-2-1 warning ticks, and optional auto-advance.',
    icon: 'GraduationCap',
    keywords: ['quiz timer', 'trivia timer', 'question countdown', 'game show timer'],
    targetAudience: 'Teachers, trivia hosts, academic bowl moderators',
    instructions: [
      'Configure Seconds per Question (e.g. 30s) and Total Questions.',
      'Click Start Question; use Pause whenever a contestant buzzes in, or let Auto-Advance roll to the next question.',
    ],
    faq: [
      {
        question: 'Does it play a countdown sound on the final seconds?',
        answer: 'Yes, short acoustic ticks play at 3, 2, and 1 seconds remaining followed by a completion bell.',
      },
      {
        question: 'What happens when a team buzzes in before time expires?',
        answer: 'Click Pause (or press Spacebar) immediately to freeze the clock while the contestant answers; if incorrect, click Resume to give the opposing team the remaining seconds.',
      },
      {
        question: 'How does Auto-Advance Next Question work?',
        answer: 'When Auto-Advance is enabled, reaching 00:00 increments the Question Counter (e.g., Question 4 of 10) and starts the next question countdown automatically.',
      },
      {
        question: 'What question duration works best for pub trivia vs. rapid-fire academic bowl?',
        answer: 'Academic lightning rounds typically use 10 to 15 seconds per question, while team trivia nights use 30 to 60 seconds for group discussion.',
      },
    ],
  },
  {
    slug: 'classroom-scoreboard',
    name: 'Classroom Scoreboard',
    category: 'stage',
    categoryLabel: 'Education & Classroom',
    description: 'Interactive multi-team scoreboard with editable team names and instant +1, +5, and -1 point controls for classroom review games.',
    icon: 'Trophy',
    keywords: ['classroom scoreboard', 'team points tracker', 'online scoreboard', 'trivia scorekeeper'],
    targetAudience: 'Teachers, camp counselors, quizmasters, youth leaders',
    instructions: [
      'Click any team heading to customize its name.',
      'Use the +1, +5, and -1 buttons to award or deduct points during live review games.',
    ],
    faq: [
      {
        question: 'Can I reset all team scores to zero for a new round?',
        answer: 'Yes, click "Reset All Scores" at the bottom of the board to start a fresh game while keeping your custom team names.',
      },
      {
        question: 'Can I edit the team names on the board?',
        answer: 'Yes, click directly inside any team title field (Team Alpha, Team Bravo, etc.) to type custom house, table, or squad names.',
      },
      {
        question: 'Can scores go below zero if a team loses points?',
        answer: 'Yes, the −1 button supports negative point deductions for trivia rules that penalize incorrect buzz-ins.',
      },
      {
        question: 'Is the scoreboard readable on a classroom smartboard?',
        answer: 'Yes, large tabular score numerals and color-coded team cards are designed for full-room visibility.',
      },
    ],
  },
  {
    slug: 'bingo-caller',
    name: 'Bingo Number Caller',
    category: 'everyday',
    categoryLabel: 'Randomizers & Group Activities',
    description: '75-ball (B-I-N-G-O) random number caller with live master verification board and zero-repeat draw history.',
    icon: 'Trophy',
    keywords: ['bingo caller', 'random number caller 1-75', 'bingo board tracker', 'classroom bingo'],
    targetAudience: 'Community event hosts, teachers, family game nights, activity directors',
    instructions: [
      'Click "Draw Next Ball" to call a random uncalled number from B-1 through O-75.',
      'Verify winning cards against the 1–75 Master Verification Grid where called numbers are highlighted in blue.',
    ],
    faq: [
      {
        question: 'Can the same number be called twice in a game?',
        answer: 'No. Each drawn ball is removed from the remaining pool until you click Reset Board.',
      },
      {
        question: 'How are the 75 numbers divided across the B-I-N-G-O letters?',
        answer: 'B contains numbers 1–15, I contains 16–30, N contains 31–45, G contains 46–60, and O contains 61–75.',
      },
      {
        question: 'How do I verify a player’s winning Bingo card?',
        answer: 'Check the 1–75 Master Verification Grid on screen—every number called during the current game is highlighted in blue and listed in chronological draw order.',
      },
      {
        question: 'Is the ball draw completely random?',
        answer: 'Yes, each draw selects uniformly from the remaining uncalled balls so every number has an equal probability.',
      },
    ],
  },
  {
    slug: 'seating-chart-maker',
    name: 'Seating Chart Maker',
    category: 'stage',
    categoryLabel: 'Education & Classroom',
    description: 'Randomize student or attendee desk assignments across configurable classroom rows and columns in one click.',
    icon: 'Users',
    keywords: ['seating chart maker', 'random desk assigner', 'classroom seating generator'],
    targetAudience: 'K-12 teachers, workshop instructors, exam proctors',
    instructions: [
      'Paste your student list (one per line) and choose the number of Desks per Row (Columns).',
      'Click "Randomize Seating Chart" to assign every student to a numbered desk.',
    ],
    faq: [
      {
        question: 'Does it prevent duplicate student names?',
        answer: 'Yes, duplicate lines are automatically filtered so each student is assigned to a single desk.',
      },
      {
        question: 'How do I match my physical classroom desk layout?',
        answer: 'Set "Desks per Row (Columns)" between 2 and 8 to match your room’s column layout; the grid automatically creates as many rows as needed for your class size.',
      },
      {
        question: 'Are student names stored or sent over the internet?',
        answer: 'No. Student rosters are randomized 100% locally in your browser and never leave your device.',
      },
      {
        question: 'Can I project the seating chart as students walk into class?',
        answer: 'Yes, project the numbered desk grid on your whiteboard so students can find their assigned seat Number and Row immediately.',
      },
    ],
  },

  // ==========================================================================
  // PHASE 5 SEO EXPANSION: Time Calculator, Date Calculator, Unit Converters & Future Time
  // ==========================================================================
  {
    slug: 'time-calculator',
    name: 'Time Calculator',
    category: 'world',
    categoryLabel: 'Calculators',
    description: 'Add or subtract time from a date and time, or sum multiple hours, minutes, and seconds blocks with decimal-hour output.',
    icon: 'Calculator',
    keywords: ['time calculator', 'add and subtract time', 'hours and minutes calculator', 'time math calculator'],
    targetAudience: 'Employees, students, payroll coordinators, freelancers, and project planners',
    instructions: [
      'Enter hours, minutes, and seconds for each row and select + Add or − Subtract.',
      'Click "Add Duration Row" to include additional time segments.',
      'View the total elapsed time in HH:MM:SS, total minutes, and decimal hours.',
    ],
    faq: [
      {
        question: 'How do you add hours and minutes together?',
        answer: 'Add the hours and minutes separately. If the total minutes reach 60 or more, divide by 60 to carry whole hours over and keep the remainder as minutes.',
      },
      {
        question: 'Can I subtract time intervals in the same calculation?',
        answer: 'Yes. Toggle any row from + Add to − Subtract to deduct breaks or time adjustments.',
      },
      {
        question: 'Does the Time Calculator show decimal hours for payroll?',
        answer: 'Yes, every calculation displays both standard hours/minutes and decimal hours (e.g. 8.5 hours).',
      },
      {
        question: 'What is the difference between 8:30 in standard time and 8.50 in decimal hours?',
        answer: 'In base-60 clock time, 30 minutes is half of 60 minutes, which equals 0.50 in base-10 decimal hours (30 ÷ 60 = 0.50).',
      },
    ],
  },
  {
    slug: 'date-calculator',
    name: 'Date Calculator',
    category: 'world',
    categoryLabel: 'Calculators',
    description: 'Calculate days between dates, including business weekdays, weekend days, weeks, and total hours.',
    icon: 'Calendar',
    keywords: ['date calculator', 'days between dates', 'date duration calculator', 'how many days between two dates'],
    targetAudience: 'Project managers, event planners, HR specialists, students, and travelers',
    instructions: [
      'Select your Start Date and End Date using the calendar inputs.',
      'Optionally check "Include end date in calculation" to add +1 inclusive day.',
      'Review the exact day count, week breakdown, and weekday vs. weekend count.',
    ],
    faq: [
      {
        question: 'Does the Date Calculator account for leap years?',
        answer: 'Yes. Exact calendar dates are evaluated using UTC calendar math, automatically accounting for 29-day Februaries in leap years (years divisible by 4, except century years not divisible by 400).',
      },
      {
        question: 'Can I see only working weekdays between two dates?',
        answer: 'Yes! The result panel breaks down total calendar days into Monday–Friday weekdays and Saturday–Sunday weekend days.',
      },
      {
        question: 'When should I check "Include end date in calculation"?',
        answer: 'Leave it unchecked for elapsed duration (e.g., hotel nights from May 1 to May 5 = 4 nights). Check it when counting inclusive leave or event days (May 1 through May 5 inclusive = 5 days).',
      },
      {
        question: 'Does the weekday count automatically subtract public holidays?',
        answer: 'The weekday counter counts all Monday–Friday calendar days. Because public holidays vary by country and state, subtract any local holidays that fall on a weekday during your range.',
      },
    ],
  },
  {
    slug: 'time-converter',
    name: 'Time Converter',
    category: 'world',
    categoryLabel: 'Calculators',
    description: 'Convert between seconds, minutes, hours, days, weeks, and milliseconds with instant decimal and HMS breakdowns.',
    icon: 'Calculator',
    keywords: ['time converter', 'time unit converter', 'convert time units', 'hours minutes seconds converter'],
    targetAudience: 'Students, engineers, scientists, payroll admins, and everyday users',
    instructions: [
      'Enter the numeric amount you want to convert.',
      'Choose the source unit (From) and target unit (To).',
      'Inspect the exact converted value along with decimal hours, total minutes, and total seconds.',
    ],
    faq: [
      {
        question: 'How do I convert minutes into decimal hours?',
        answer: 'Divide the number of minutes by 60. For example, 45 minutes ÷ 60 = 0.75 decimal hours.',
      },
      {
        question: 'How many seconds are in a full day?',
        answer: 'There are 86,400 seconds in 24 hours (24 × 60 minutes × 60 seconds).',
      },
      {
        question: 'How many minutes and seconds are in 1 week?',
        answer: 'One 7-day week contains 168 hours, 10,080 minutes (168 × 60), and 604,800 seconds (10,080 × 60).',
      },
      {
        question: 'How do I convert milliseconds into seconds?',
        answer: 'Divide milliseconds by 1,000. For example, 2,500 milliseconds ÷ 1,000 = 2.5 seconds.',
      },
    ],
  },
  {
    slug: 'minutes-to-hours',
    name: 'Minutes to Hours Converter',
    category: 'world',
    categoryLabel: 'Calculators',
    description: 'Convert minutes to hours and minutes (HH:MM) or decimal hours instantly for timesheets, study logs, and scheduling.',
    icon: 'Clock',
    keywords: ['minutes to hours', 'convert minutes to hours', 'mins to hours', 'minutes into hours calculator'],
    targetAudience: 'Employees logging timesheets, students, teachers, and travelers',
    instructions: [
      'Type the number of minutes you want to convert (for example, 90, 135, or 510 minutes).',
      'Read the instant result in both decimal hours (e.g., 1.5 hours) and hours + minutes (1 hr 30 min).',
      'Click any quick preset chip to test common minute durations.',
    ],
    faq: [
      {
        question: 'How do you convert minutes to hours?',
        answer: 'Divide the number of minutes by 60. The whole number is the hours, and the remainder is the remaining minutes. For example, 150 minutes ÷ 60 = 2.5 hours (2 hours 30 minutes).',
      },
      {
        question: 'What is 90 minutes in hours?',
        answer: '90 minutes is equal to 1.5 hours, or 1 hour and 30 minutes.',
      },
      {
        question: 'What is 510 minutes in hours?',
        answer: '510 minutes divided by 60 equals 8.5 decimal hours, or 8 hours and 30 minutes.',
      },
      {
        question: 'Why does 100 minutes equal 1.67 hours instead of 1.40 hours?',
        answer: '100 minutes is 1 whole hour (60 minutes) plus 40 remaining minutes. In decimal hours, 40 ÷ 60 = 0.6667 hours, giving 1.67 decimal hours (1 hour 40 minutes).',
      },
    ],
  },
  {
    slug: 'seconds-to-minutes',
    name: 'Seconds to Minutes Converter',
    category: 'world',
    categoryLabel: 'Calculators',
    description: 'Convert seconds into minutes and remaining seconds or decimal minutes with one click.',
    icon: 'Clock',
    keywords: ['seconds to minutes', 'convert seconds into minutes', 'sec to min', 'how many minutes is seconds'],
    targetAudience: 'Athletes, video editors, science students, cooks, and everyday users',
    instructions: [
      'Enter the total number of seconds (e.g., 180, 240, or 1,500 seconds).',
      'See the exact conversion in decimal minutes as well as whole minutes and remaining seconds.',
      'Use Swap Units to convert backward from minutes to seconds.',
    ],
    faq: [
      {
        question: 'How do you convert seconds into minutes?',
        answer: 'Divide the total number of seconds by 60. For example, 240 seconds ÷ 60 = 4 minutes.',
      },
      {
        question: 'How many minutes is 300 seconds?',
        answer: '300 seconds divided by 60 equals exactly 5 minutes.',
      },
      {
        question: 'How many minutes is 1,000 seconds?',
        answer: '1,000 seconds equals 16 minutes and 40 seconds (16.67 decimal minutes).',
      },
      {
        question: 'How do I find the remaining seconds after dividing by 60?',
        answer: 'Multiply the whole minutes by 60 and subtract from the total seconds (Remaining Seconds = Total Seconds − (Whole Minutes × 60)). For 1,000 seconds: 1,000 − (16 × 60) = 40 seconds.',
      },
    ],
  },
  {
    slug: 'hours-to-minutes',
    name: 'Hours to Minutes Converter',
    category: 'world',
    categoryLabel: 'Calculators',
    description: 'Convert hours and decimal hours into total minutes and seconds with instant accuracy.',
    icon: 'Clock',
    keywords: ['hours to minutes', 'convert hours to minutes', 'how many minutes in an hour', 'decimal hours to minutes'],
    targetAudience: 'Payroll clerks, project managers, students, and educators',
    instructions: [
      'Enter whole or decimal hours (e.g., 1.5, 2.25, or 8.5 hours).',
      'View the exact number of minutes and seconds immediately.',
      'Click any preset chip for standard shift and class durations.',
    ],
    faq: [
      {
        question: 'How do you convert hours into minutes?',
        answer: 'Multiply the number of hours by 60. For example, 8.5 hours × 60 = 510 minutes.',
      },
      {
        question: 'How many minutes are in 1.5 hours?',
        answer: '1.5 hours × 60 = 90 minutes.',
      },
      {
        question: 'How many minutes are in 8 hours?',
        answer: '8 hours × 60 = 480 minutes.',
      },
      {
        question: 'How many minutes are in 24 hours?',
        answer: '24 hours × 60 minutes per hour = 1,440 minutes in a full day.',
      },
    ],
  },
  {
    slug: 'what-time-will-it-be',
    name: 'What Time Will It Be Calculator',
    category: 'world',
    categoryLabel: 'Calculators',
    description: 'Find out what time it will be in X minutes or hours from right now or from any custom starting clock time.',
    icon: 'Clock',
    keywords: [
      'what time will it be',
      'what time will it be in 30 minutes',
      'what time will it be in 20 minutes',
      'what time will it be in 45 minutes',
      'future time calculator',
    ],
    targetAudience: 'Anyone scheduling reminders, cooking, taking breaks, or planning shifts',
    instructions: [
      'Choose "Current Time (Live)" or pick a custom starting time.',
      'Enter the number of hours, minutes, and seconds to add (or subtract).',
      'Or click any quick chip ("In 20 minutes", "In 30 minutes", "In 45 minutes") to see the exact future clock time.',
    ],
    faq: [
      {
        question: 'How do I calculate what time it will be in 30 minutes?',
        answer: 'Add 30 minutes to your current clock time. If the minutes exceed 59, subtract 60 from the minutes and add 1 to the hour. Our live calculator updates this automatically every second.',
      },
      {
        question: 'Can I calculate what time it was in the past?',
        answer: 'Yes! Switch the Direction toggle from "In the Future (+ Add)" to "In the Past (− Ago)" to subtract hours and minutes from any time.',
      },
      {
        question: 'Does it show both 12-hour AM/PM and 24-hour military time?',
        answer: 'Yes, the result panel displays the target time in both 12-hour AM/PM format and 24-hour format, along with the calendar date if midnight is crossed.',
      },
      {
        question: 'What happens if adding hours crosses midnight into tomorrow or multiple days ahead?',
        answer: 'The calculator computes the exact future calendar date and day of the week (for example, adding 48 hours shows the exact date two days ahead).',
      },
    ],
  },
  {
    slug: 'sand-timer',
    name: 'Sand Timer',
    category: 'everyday',
    categoryLabel: 'Timers',
    description: 'A realistic digital sand timer with falling golden sand particles, custom presets, adjustable animation speed, and reduced-motion accessibility.',
    badge: 'Popular',
    icon: 'Hourglass',
    keywords: ['online sand timer', 'digital sand timer', 'sand countdown timer', 'hourglass timer online', 'virtual sand timer'],
    targetAudience: 'Board game players, teachers, students, home cooks, and mindfulness practitioners',
    instructions: [
      'Choose a preset time (1, 3, 5, 10, or 15 minutes) or enter a custom duration.',
      'Click Start to begin the countdown.',
      'Watch the sand fall from the upper chamber into the lower chamber as time decreases.',
      'The timer will alert you when it reaches zero and the upper chamber empties.',
      'Use Pause or Reset whenever needed.',
    ],
    faq: [
      {
        question: 'Does the digital sand timer measure physical sand flow?',
        answer: 'No. The falling sand animation is a visual representation synchronized to a high-precision digital countdown clock. Unlike a physical glass hourglass that can vary slightly due to humidity or grain friction, this online sand timer is accurate to the millisecond while giving you the calm visual experience of a traditional hourglass.',
      },
      {
        question: 'Can I set a custom duration other than 1, 3, 5, 10, or 15 minutes?',
        answer: 'Yes! You can enter any custom duration in minutes or switch to End Time mode to count down to a specific time of day.',
      },
      {
        question: 'Can I hide the digital numbers and only watch the sand?',
        answer: 'Yes. Toggle off "Show Time" in the control panel to hide the numeric MM:SS readout so children, students, or meditation participants can focus purely on the visual sand level.',
      },
      {
        question: 'Is there an option for reduced motion or slower particle speed?',
        answer: 'Yes. You can switch Animation Speed between Slow, Normal, and Fast, or enable the Reduced Motion toggle for a calm, accessible visual transition.',
      },
      {
        question: 'Is the online sand timer free to use for board games and classrooms?',
        answer: 'Yes, it is 100% free with no account required, and includes a Fullscreen mode ideal for interactive whiteboards, tablets, and tabletop game nights.',
      },
      {
        question: 'Will a sound play when all the sand reaches the bottom?',
        answer: 'Yes, an optional gentle acoustic chime plays when the countdown reaches zero. You can mute or enable the Sound Alert toggle at any time.',
      },
    ],
  },
  {
    slug: 'liquid-timer',
    name: 'Liquid Timer',
    category: 'everyday',
    categoryLabel: 'Timers',
    description: 'A smooth liquid countdown timer with realistic draining liquid level, rising bubbles, 6 liquid color styles, and reduced-motion accessibility.',
    badge: 'Popular',
    icon: 'Droplets',
    keywords: ['liquid timer', 'liquid countdown timer', 'online liquid visual timer', 'water timer online', 'sensory liquid timer'],
    targetAudience: 'Students, teachers, parents, home cooks, and focus enthusiasts',
    instructions: [
      'Choose a preset or enter your own duration.',
      'Select a liquid style and color.',
      'Click Start to begin the countdown.',
      'Watch the liquid level decrease as time passes.',
      'Use Pause or Reset anytime.',
    ],
    faq: [
      {
        question: 'Is this liquid timer free to use?',
        answer: 'Yes, our online liquid timer is 100% free to use with no registration, downloads, or usage limits.',
      },
      {
        question: 'Can I set a custom time?',
        answer: 'Yes! You can pick from quick presets (1, 3, 5, 10, or 15 minutes), enter any custom duration in minutes, or switch to End Time mode.',
      },
      {
        question: 'Can I change the liquid color?',
        answer: 'Yes. Choose from six curated liquid styles—Ocean Blue, Amber, Clear Water, Sage Green, Purple, and Rose Pink—even while the timer is running.',
      },
      {
        question: 'Is there a sound when the timer ends?',
        answer: 'Yes, an optional gentle acoustic chime plays when the liquid drains completely at 00:00. You can toggle Sound Alert on or off anytime.',
      },
      {
        question: 'Does the timer work on mobile devices?',
        answer: 'Yes, the liquid timer is fully responsive and works smoothly across desktop computers, tablets, iPads, and smartphones.',
      },
      {
        question: 'Can I use this in a classroom?',
        answer: 'Absolutely. Use Fullscreen mode to project the liquid glass container and countdown clock onto your classroom smartboard or projector for transitions and group activities.',
      },
    ],
  },
  {
    slug: 'rainbow-timer',
    name: 'Rainbow Timer',
    category: 'everyday',
    categoryLabel: 'Timers',
    description: 'A colorful countdown timer with a smooth multicolor rainbow arc, 4 rainbow styles, 6 color themes, custom duration, and fullscreen mode.',
    badge: 'New',
    icon: 'Palette',
    keywords: ['rainbow timer', 'colorful visual timer', 'rainbow countdown timer', 'kids visual timer', 'classroom rainbow timer', 'sensory timer'],
    targetAudience: 'Teachers, parents, children, students, presenters, and visual learners',
    instructions: [
      'Choose a preset time or enter a custom duration.',
      'Select a rainbow style and color theme.',
      'Click Start to begin the countdown.',
      'Watch the rainbow arc decrease as time passes.',
      'Use Pause or Reset whenever needed.',
    ],
    faq: [
      {
        question: 'Is the rainbow timer free to use?',
        answer: 'Yes, our online rainbow timer is 100% free to use with no sign-up, downloads, or usage limits.',
      },
      {
        question: 'Can I change the rainbow colors?',
        answer: 'Yes! You can switch between 6 curated color themes—Classic Rainbow, Pastel, Bright, Sunset, Forest, and Candy—as well as 4 rainbow styles (Classic Arc, Full Circle, Filling Arc, and Segmented).',
      },
      {
        question: 'Can I set a custom time?',
        answer: 'Yes. Pick from quick presets (1, 3, 5, 10, or 15 minutes), enter any custom duration in minutes, or use End Time mode to count down to a specific clock time.',
      },
      {
        question: 'Is there a sound when the timer ends?',
        answer: 'Yes, an optional gentle chime plays when the countdown reaches 00:00 and the rainbow arc finishes. You can toggle Sound Alert on or off at any time.',
      },
      {
        question: 'Does it work on mobile devices?',
        answer: 'Yes, the rainbow timer is fully responsive and works smoothly on smartphones, tablets, iPads, laptops, and classroom interactive whiteboards.',
      },
      {
        question: 'Can I use this timer in a classroom?',
        answer: 'Absolutely. Teachers use the fullscreen rainbow timer on projectors and smartboards to make activity transitions, reading blocks, and group work visually intuitive for students.',
      },
    ],
  },
  {
    slug: 'hourglass-timer',
    name: 'Hourglass Timer',
    category: 'everyday',
    categoryLabel: 'Timers',
    description: 'A classic hourglass countdown with realistic sand animation, wooden frame, interactive flip-to-restart action, and multiple preset times.',
    badge: 'New',
    icon: 'Hourglass',
    keywords: ['hourglass timer', 'online hourglass', 'digital hourglass countdown', 'sand clock', 'flip hourglass timer', 'board game hourglass'],
    targetAudience: 'Board game players, teachers, students, families, and visual learners',
    instructions: [
      'Choose a preset time or enter your own duration.',
      'Click Start to begin the countdown.',
      'Watch the sand fall from the top to the bottom.',
      'Use Pause to stop and Resume to continue.',
      'Click Reset or Flip to turn the hourglass over and start again.',
    ],
    faq: [
      {
        question: 'Is this hourglass timer free to use?',
        answer: 'Yes, this online hourglass timer is 100% free to use on any browser with no sign-up, downloads, or limits.',
      },
      {
        question: 'Can I use this on mobile devices?',
        answer: 'Yes! The digital hourglass automatically adapts to smartphones, tablets, iPads, laptops, and desktop monitors.',
      },
      {
        question: 'Can I set a custom time?',
        answer: 'Yes. You can choose from quick presets (1, 3, 5, 10, or 15 minutes), enter any custom duration from 1 to 180 minutes, or use End Time mode to count down to a specific clock time.',
      },
      {
        question: 'Is there a sound when the timer ends?',
        answer: 'Yes, an optional gentle chime plays when all sand reaches the lower chamber and the timer hits 00:00. You can toggle Sound Alert on or off anytime.',
      },
      {
        question: 'Does the hourglass flip automatically?',
        answer: 'When the countdown finishes, the hourglass stays in its completed state so you can clearly see time is up. Click the Flip button at any time to physically turn the hourglass over 180° and start a fresh countdown.',
      },
      {
        question: 'How is this different from the sand timer?',
        answer: 'While the Sand Timer focuses on a close-up glass bulb and sand theme customization, the Hourglass Timer recreates a traditional wooden-framed tabletop hourglass complete with an interactive 180-degree Flip button that turns the vessel over just like a real sand clock.',
      },
    ],
  },
  {
    slug: 'circular-timer',
    name: 'Circular Timer',
    category: 'everyday',
    categoryLabel: 'Timers',
    description:
      'A simple and visual circle countdown timer to help you stay focused.',
    badge: 'New',
    icon: 'Clock',
    keywords: [
      'circular timer',
      'circle countdown timer',
      'visual countdown circle',
      'free online circular timer',
      'circle timer online',
      'pie countdown timer',
    ],
    targetAudience: 'Teachers, students, presenters, teams, and visual learners',
    instructions: [
      'Choose a preset time or enter a custom duration.',
      'Select your preferred color and background style.',
      'Click Start to begin the countdown.',
      'Watch the circle shrink as time decreases.',
      'Use Pause, Resume or Reset whenever needed.',
    ],
    faq: [
      {
        question: 'Is this circular timer free to use?',
        answer:
          'Yes! This online circular countdown timer is 100% free to use with no sign-up, downloads, or usage limits.',
      },
      {
        question: 'Can I use this in a classroom or presentation?',
        answer:
          'Absolutely. Click the Fullscreen button to project a large, distraction-free circular countdown on smartboards, projectors, or shared meeting screens.',
      },
      {
        question: 'Can I set a custom time?',
        answer:
          'Yes. You can choose from quick presets (1, 3, 5, 10, or 15 minutes), enter any custom duration in minutes, or switch to End Time mode to count down to a specific clock time.',
      },
      {
        question: 'Is there a sound when the timer ends?',
        answer:
          'Yes, a gentle acoustic chime plays when the circle reaches zero. You can toggle the Sound Alert switch on or off at any time.',
      },
      {
        question: 'Can I change the circle color?',
        answer:
          'Yes! Use the Timer Appearance panel to pick from six vibrant circle colors (Forest Green, Ocean Blue, Coral Red, Amber Orange, Royal Purple, or Rose Pink) and four background styles.',
      },
      {
        question: 'Can I change the countdown direction?',
        answer:
          'Yes. You can switch between Clockwise and Counterclockwise countdown directions in the Timer Appearance panel.',
      },
      {
        question: 'Does it work on mobile devices?',
        answer:
          'Yes, the circular timer is fully responsive and works smoothly on desktops, laptops, iPads, tablets, and smartphones.',
      },
      {
        question: 'Can I use this instead of a progress bar timer?',
        answer:
          'Yes. A circular timer shows the proportion of remaining time in a 360-degree view that is often easier to read at a glance from across a classroom or meeting room than a linear progress bar.',
      },
    ],
  },
  {
    slug: 'radial-timer',
    name: 'Radial Timer',
    category: 'everyday',
    categoryLabel: 'Timers',
    description:
      'A unique radial countdown timer with a clear visual display.',
    badge: 'New',
    icon: 'Clock',
    keywords: [
      'radial timer',
      'radial countdown timer',
      'radial visual timer',
      'free online radial timer',
      'sunburst timer',
      'segmented countdown timer',
    ],
    targetAudience: 'Students, teachers, coaches, facilitators, presenters, and visual learners',
    instructions: [
      'Choose a preset time or enter a custom duration.',
      'Select a radial style and color theme.',
      'Click Start to begin the countdown.',
      'Watch the segments disappear as time passes.',
      'Use Pause or Reset whenever needed.',
    ],
    faq: [
      {
        question: 'Is this radial timer free to use?',
        answer:
          'Yes! This online radial countdown timer is 100% free to use on any browser with no sign-up, downloads, or usage limits.',
      },
      {
        question: 'Can I change the colors?',
        answer:
          'Yes! You can choose from six color themes including Forest Green, Ocean Blue, Coral Red, Amber Orange, Royal Purple, and a multicolor Rainbow Gradient theme.',
      },
      {
        question: 'Can I set a custom time?',
        answer:
          'Yes. Pick from quick presets (1, 3, 5, 10, or 15 minutes), enter any custom duration in minutes, or switch to End Time mode to count down to a specific clock time.',
      },
      {
        question: 'Is there a sound when the timer ends?',
        answer:
          'Yes, an optional gentle acoustic chime plays when the radial segments finish and the countdown reaches 00:00. You can toggle Sound Alert on or off anytime.',
      },
      {
        question: 'Can I change the number of segments?',
        answer:
          'Yes! Use the Segment Count slider in the appearance panel to adjust the number of radial spokes, dots, or blocks from 12 up to 60 segments.',
      },
      {
        question: 'Can I use this in a classroom?',
        answer:
          'Absolutely. Click the Fullscreen button to project a large, high-visibility radial countdown on classroom smartboards, projectors, or shared screens.',
      },
      {
        question: 'Does it work on mobile devices?',
        answer:
          'Yes, the radial timer is fully responsive and works smoothly on smartphones, tablets, iPads, laptops, and desktop monitors.',
      },
      {
        question: 'What is the difference between a radial timer and a circular timer?',
        answer:
          'A radial timer divides time into discrete evenly spaced spokes, dots, blocks, or rays that turn off one by one around the dial, whereas a circular timer uses a continuous solid ring or pie sector.',
      },
    ],
  },
  {
    slug: 'rings-timer',
    name: 'Rings Timer',
    category: 'everyday',
    categoryLabel: 'Timers',
    description:
      'A beautiful multi-ring countdown timer with concentric progress rings, customizable ring styles and colors, and fullscreen mode.',
    badge: 'New',
    icon: 'Clock',
    keywords: [
      'rings timer',
      'ring countdown timer',
      'multiple ring visual timer',
      'concentric ring timer',
      'multi-ring countdown',
      'multi-stage timer',
    ],
    targetAudience:
      'Students, teachers, presenters, productivity enthusiasts, and visual learners',
    instructions: [
      'Choose a preset time or enter a custom duration.',
      'Select a ring style and customize the colors.',
      'Click Start to begin the countdown.',
      'Watch the rings decrease as time passes.',
      'Use Pause or Reset whenever needed.',
    ],
    faq: [
      {
        question: 'Is this rings timer free to use?',
        answer:
          'Yes! This online rings countdown timer is 100% free to use in your browser with no sign-up, downloads, or hidden fees.',
      },
      {
        question: 'What do the different rings represent?',
        answer:
          'Each concentric ring visualizes a distinct layer of your countdown: the Outer Ring shows overall session progress, the Middle Ring tracks stage progress, and the Inner Ring highlights current phase or minute pacing.',
      },
      {
        question: 'Can I set a custom time?',
        answer:
          'Yes. Choose from quick presets (1, 3, 5, 10, or 15 minutes), enter any custom duration in minutes, or switch to End Time mode to count down toward a specific time of day.',
      },
      {
        question: 'Is there a sound when the timer ends?',
        answer:
          'Yes, an optional gentle chime plays when all concentric rings reach zero. You can toggle Sound Alert on or off at any time.',
      },
      {
        question: 'Can I change the ring colors?',
        answer:
          'Yes! You can independently customize the color of the Outer Ring, Middle Ring, and Inner Ring, or switch between Classic Rings, Gradient Rings, Minimal Rings, and Dashed Rings styles.',
      },
      {
        question: 'Can I use this in a classroom?',
        answer:
          'Absolutely. Enable Fullscreen mode to project the multi-ring display clearly on classroom smartboards, projectors, or shared monitors for group activities and transitions.',
      },
      {
        question: 'Does it work on mobile devices?',
        answer:
          'Yes, the rings timer is fully responsive and works seamlessly on phones, tablets, iPads, laptops, and desktop screens.',
      },
      {
        question: 'What is the difference between a rings timer and a circular timer?',
        answer:
          'A circular timer uses a single ring or sector to show remaining time, while a rings timer uses three nested concentric rings to provide richer multi-stage visual feedback within the same countdown.',
      },
    ],
  },
  {
    slug: 'progress-timer',
    name: 'Progress Timer',
    category: 'everyday',
    categoryLabel: 'Timers',
    description:
      'A simple and flexible progress bar timer with Horizontal, Vertical, Segmented, and Thin Line display styles, custom task label, and warning alert threshold.',
    badge: 'New',
    icon: 'Clock',
    keywords: [
      'progress timer',
      'visual progress bar timer',
      'countdown progress bar',
      'progress bar timer',
      'horizontal timer',
      'segmented progress timer',
    ],
    targetAudience:
      'Professionals in meetings, students, teachers, presenters, and online instructors',
    instructions: [
      'Enter a duration or choose a preset time.',
      '(Optional) Add a task or event label.',
      'Select a display style and color.',
      'Click Start to begin the countdown.',
      'Watch the progress bar decrease as time passes.',
      'Use Pause or Reset whenever needed.',
    ],
    faq: [
      {
        question: 'Is this progress timer free to use?',
        answer:
          'Yes! This online progress bar countdown timer is completely free to use in any browser with no registration, downloads, or usage restrictions.',
      },
      {
        question: 'Can I change the bar color?',
        answer:
          'Yes! You can choose from six bar color options including Emerald Green, Ocean Blue, Coral Red, Amber Orange, Royal Purple, and a full Rainbow Gradient.',
      },
      {
        question: 'Can I set a custom time?',
        answer:
          'Yes. Pick from quick presets (1, 3, 5, 10, or 15 minutes), enter any custom duration in minutes, or switch to End Time mode to count down toward a target clock time.',
      },
      {
        question: 'Is there a sound when the timer ends?',
        answer:
          'Yes, an optional gentle acoustic chime plays when the countdown finishes, and you can also configure a Warning Alert percentage to play a notification chime when remaining time reaches your threshold.',
      },
      {
        question: 'Can I change the progress bar style?',
        answer:
          'Yes! Switch seamlessly between Horizontal Bar, Vertical Bar, Segmented Bar, and Thin Line display styles at any point before or during a countdown.',
      },
      {
        question: 'Can I use this for presentations?',
        answer:
          'Absolutely. Add your presentation topic in the Task / Event field and click Fullscreen to display a high-visibility progress bar and remaining percentage for speakers or audiences.',
      },
      {
        question: 'Does it work on mobile devices?',
        answer:
          'Yes, the progress timer is fully responsive and works smoothly on smartphones, tablets, laptops, and desktop monitors.',
      },
      {
        question: 'What is the difference between a progress timer and a countdown timer?',
        answer:
          'A standard countdown timer mainly shows remaining time in digits, while a progress timer pairs a synchronized visual progress bar and live percentage indicator with elapsed and total time readouts.',
      },
    ],
  },
  {
    slug: 'pixel-timer',
    name: 'Pixel Timer',
    category: 'everyday',
    categoryLabel: 'Timers',
    description:
      'A fun and retro pixel countdown timer to help you stay focused. Watch a grid of square pixels progressively disappear with customizable retro arcade, 8-bit color, monochrome, and minimal grid styles.',
    badge: 'Popular',
    icon: 'Monitor',
    keywords: [
      'pixel timer',
      'pixel countdown timer',
      'retro visual timer',
      '8-bit timer',
      'retro arcade timer',
      'gaming break timer',
    ],
    targetAudience: 'Students, gamers, teachers, children, and productivity enthusiasts',
    instructions: [
      'Choose a preset time (1, 3, 5, 10, or 15 min) or enter a custom duration.',
      'Select a pixel style, color theme, and pixel density.',
      'Click Start to begin the countdown.',
      'Watch the pixels disappear as time passes.',
      'Use Pause or Reset whenever needed.',
    ],
    faq: [
      {
        question: 'Is this pixel timer free to use?',
        answer:
          'Yes! This online pixel countdown timer is 100% free to use directly in your browser with no sign-up, downloads, or hidden fees.',
      },
      {
        question: 'Is there a sound when the timer ends?',
        answer:
          'Yes, an optional gentle audio chime plays when all pixels disappear and the countdown reaches zero. You can toggle Sound Alert on or off at any time.',
      },
      {
        question: 'Can I set a custom time?',
        answer:
          'Yes. You can pick from quick presets (1, 3, 5, 10, or 15 minutes), enter any custom duration in minutes, or switch to End Time mode to count down toward a specific clock time.',
      },
      {
        question: 'Can I use this in a classroom?',
        answer:
          'Absolutely! Teachers love projecting the pixel timer in Fullscreen mode for classroom activities, group games, and fun transition challenges.',
      },
      {
        question: 'Can I change the pixel style or colors?',
        answer:
          'Yes! Choose from four retro styles—Retro Arcade, 8-bit Color, Monochrome, and Minimal Grid—plus six color themes including Arcade Green, Ocean Blue, Magenta Pink, Coral Red, Amber Gold, and Rainbow 8-bit.',
      },
      {
        question: 'What is the best pixel density?',
        answer:
          'A 20×20 grid offers a great balance of retro charm and smooth progress. Use a higher pixel density (24×24 or 30×30) for smoother animation, or a lower density (10×10 or 12×12) for a chunky classic 8-bit look.',
      },
      {
        question: 'Does it work on mobile devices?',
        answer:
          'Yes, the pixel timer scales cleanly and works smoothly across smartphones, tablets, laptops, and desktop monitors.',
      },
      {
        question: 'How is this different from a regular countdown timer?',
        answer:
          'Instead of showing only numbers, a pixel timer turns time into a retro grid of glowing square pixels that progressively disappear, making remaining time intuitive and fun to watch at a glance.',
      },
    ],
  },
  {
    slug: 'blocks-timer',
    name: 'Blocks Timer',
    category: 'everyday',
    categoryLabel: 'Timers',
    description:
      'A visual block countdown timer to help you stay focused and track time. Watch a stack of wooden, colored, stone, or minimal geometric blocks disappear one by one as time passes.',
    badge: 'Popular',
    icon: 'CheckSquare',
    keywords: [
      'blocks timer',
      'block countdown timer',
      'visual block timer',
      'stacked block timer',
      'wooden blocks timer',
      'classroom blocks timer',
    ],
    targetAudience: 'Teachers, students, families, game players, and productivity learners',
    instructions: [
      'Choose a preset time or enter a custom duration.',
      'Select a block style, color theme and number of blocks.',
      'Click Start to begin the countdown.',
      'Watch the blocks disappear one by one.',
      'Use Pause or Reset whenever needed.',
    ],
    faq: [
      {
        question: 'Is this blocks timer free to use?',
        answer:
          'Yes! This online blocks countdown timer is 100% free to use directly in your browser with no sign-up, downloads, or restrictions.',
      },
      {
        question: 'What does each block represent?',
        answer:
          'The total countdown duration is divided equally across your chosen number of blocks. For example, if you set a 5-minute timer with 5 blocks, each block represents 1 minute of remaining time.',
      },
      {
        question: 'Can I set a custom time?',
        answer:
          'Yes. Choose from quick presets (1, 3, 5, 10, or 15 minutes), enter any custom duration in minutes, or switch to End Time mode to count down toward a target clock time.',
      },
      {
        question: 'Is there a sound when the timer ends?',
        answer:
          'Yes, an optional gentle chime plays when the final block is removed and the timer reaches zero. You can toggle Sound Alert on or off at any time.',
      },
      {
        question: 'Can I change the block style or colors?',
        answer:
          'Yes! Choose from four distinct 3D block styles—Wooden Blocks, Colored Blocks, Stone Blocks, and Minimal Blocks—plus six color themes and a customizable Block Count from 5 to 20 blocks.',
      },
      {
        question: 'Can I use this in a classroom?',
        answer:
          'Absolutely! Teachers frequently project the blocks timer in Fullscreen mode for classroom activities, turn-taking games, reading blocks, and transition routines.',
      },
      {
        question: 'Does it work on mobile devices?',
        answer:
          'Yes, the blocks timer is fully responsive and works smoothly on smartphones, tablets, laptops, and classroom smartboards.',
      },
      {
        question: 'What is the difference between a blocks timer and a digital timer?',
        answer:
          'A digital countdown shows only numbers, while a blocks timer represents time physically as a stack of solid 3D blocks that gets shorter block by block—making remaining time concrete and easy for children and groups to grasp.',
      },
    ],
  },
  {
    slug: 'candle-timer',
    name: 'Candle Timer',
    category: 'everyday',
    categoryLabel: 'Timers',
    description:
      'A peaceful and visual candle countdown timer to help you focus, relax and stay on track.',
    badge: 'New',
    icon: 'Flame',
    keywords: [
      'candle timer',
      'candle countdown timer',
      'visual candle timer',
      'digital candle timer',
      'online candle timer',
      'reading timer',
      'meditation candle timer',
    ],
    targetAudience:
      'Readers, writers, students, mindfulness practitioners, and anyone seeking a calm visual countdown',
    instructions: [
      'Choose a preset time or enter a custom duration.',
      'Select a candle style and flame type.',
      'Click Start to begin the countdown.',
      'Watch the candle wax decrease as time passes.',
      'Use Pause or Reset whenever needed.',
    ],
    faq: [
      {
        question: 'Is this candle timer free to use?',
        answer:
          'Yes! This online candle timer is 100% free to use in your browser with no sign-up, downloads, or subscriptions required.',
      },
      {
        question: 'Is there a sound when the timer ends?',
        answer:
          'Yes, an optional gentle chime plays when the candle finishes burning down and the countdown reaches zero. You can toggle Sound Alert on or off anytime.',
      },
      {
        question: 'Can I set a custom time?',
        answer:
          'Yes. You can choose a quick preset (1, 3, 5, 10, or 15 minutes), enter any custom duration in minutes, or set a target End Time.',
      },
      {
        question: 'Can I use this for meditation or reading?',
        answer:
          'Absolutely! The calm candle animation and optional hidden numbers make it ideal for reading, journaling, meditation, breathwork, and quiet evening routines.',
      },
      {
        question: 'Can I change the candle style or color?',
        answer:
          'Yes! You can switch between four soothing candle wax themes—Ivory, Amber, Forest Green, and Charcoal—and choose from four flame styles.',
      },
      {
        question: 'Is this a real candle?',
        answer:
          'No. This is a safe digital illustration synchronized to your countdown duration. It does not simulate physical wax combustion rates and never involves real fire, smoke, or heat.',
      },
      {
        question: 'Does it work on mobile devices?',
        answer:
          'Yes, the digital candle timer works smoothly across smartphones, tablets, laptops, and desktop monitors.',
      },
      {
        question: 'What is the difference between a candle timer and a sand timer?',
        answer:
          'A sand timer visualizes time as grains flowing between two glass chambers, while a candle timer shows a single glowing pillar candle that gradually shortens as time elapses, creating a warm, cozy ambiance for quiet work and relaxation.',
      },
    ],
  },
  {
    slug: 'aesthetic-timer',
    name: 'Aesthetic Timer',
    category: 'everyday',
    categoryLabel: 'Timers',
    description:
      'A calm and customizable visual timer to help you focus, be productive and enjoy your time.',
    badge: 'New',
    icon: 'Palette',
    keywords: [
      'aesthetic timer',
      'beautiful online timer',
      'aesthetic visual countdown',
      'study aesthetic timer',
      'dark academia timer',
      'minimalist timer online',
      'customizable desk timer',
    ],
    targetAudience:
      'Students, writers, readers, remote professionals, and anyone curating a calm study or desk environment',
    instructions: [
      'Choose a duration or select a preset time.',
      'Pick a theme or customize the accent color.',
      '(Optional) Add a session label.',
      'Click Start to begin the countdown.',
      'Use Pause or Reset whenever needed.',
    ],
    faq: [
      {
        question: 'Is this aesthetic timer free to use?',
        answer:
          'Yes! This online aesthetic countdown timer is 100% free to use directly in your browser with no sign-up, downloads, or usage restrictions.',
      },
      {
        question: 'Can I save my preferred style?',
        answer:
          'Yes! Click the "Save as Default" button in the right panel to save your favorite theme, accent color, duration, session label, and display settings locally in your browser so they load automatically next time.',
      },
      {
        question: 'Can I set a custom time?',
        answer:
          'Yes. You can pick from popular study presets (5, 10, 25, or 50 minutes), enter any custom duration in minutes, or switch to End Time mode to count down toward a specific time of day.',
      },
      {
        question: 'Is there a sound when the timer ends?',
        answer:
          'Yes, an optional gentle acoustic chime plays when your countdown reaches zero. You can toggle Sound Alert on or off at any time.',
      },
      {
        question: 'Can I change the timer theme or color?',
        answer:
          'Yes! Choose from eight curated themes—Minimal Ivory, Warm Sunset, Forest Green, Soft Pastel, Dark Academia, Monochrome, Paper Texture, and Coastal Blue—and customize the progress ring with seven restrained accent colors.',
      },
      {
        question: 'Can I use this for studying or work?',
        answer:
          'Absolutely. With 25-minute Pomodoro, 50-minute deep work presets, customizable session labels, and Fullscreen mode, it is designed as a calm digital desk companion for studying, reading, writing, and work blocks.',
      },
      {
        question: 'Does it work on mobile devices?',
        answer:
          'Yes, the aesthetic timer is fully responsive and works smoothly on smartphones, tablets, iPads, laptops, and desktop monitors.',
      },
      {
        question: 'What makes an aesthetic timer different from a regular timer?',
        answer:
          'Instead of a utilitarian stopwatch screen, an aesthetic timer pairs high-precision countdown timing with calm scenic themes, soft typography, custom accent colors, and inspirational quotes to reduce visual fatigue and make your desk environment more inviting.',
      },
    ],
  },
  {
    slug: 'picture-reveal-timer',
    name: 'Picture Reveal Timer',
    category: 'everyday',
    categoryLabel: 'Timers',
    description:
      'Upload a photo and watch it gradually appear as the countdown runs. Perfect for classrooms, games, quizzes and surprises.',
    badge: 'New',
    icon: 'Eye',
    keywords: [
      'picture reveal timer',
      'photo reveal countdown',
      'hidden picture timer',
      'image reveal countdown',
      'classroom guessing game timer',
      'mystery picture timer',
    ],
    targetAudience:
      'Teachers, students, quiz hosts, party organizers, and group facilitators',
    instructions: [
      'Click the upload button and choose an image from your device.',
      'Adjust the timer duration and grid size.',
      'Select a reveal style such as random or sequential.',
      'Click Start to begin the countdown.',
      'Watch the tiles disappear and reveal your picture.',
      'Use Pause or Reset whenever needed.',
    ],
    faq: [
      {
        question: 'Is the picture reveal timer free to use?',
        answer:
          'Yes! This online picture reveal timer is 100% free to use with no sign-up, watermark, or usage limits.',
      },
      {
        question: 'Can I change the grid size?',
        answer:
          'Yes. You can choose from 4 × 4 (16 tiles), 5 × 5 (25 tiles), 6 × 6 (36 tiles), 8 × 8 (64 tiles), or 10 × 10 (100 tiles) depending on how detailed you want the reveal to be.',
      },
      {
        question: 'Are my uploaded images stored on a server?',
        answer:
          'No. Your photos are processed 100% locally inside your web browser using local object URLs and are never uploaded to or stored on any server.',
      },
      {
        question: 'What reveal styles are available?',
        answer:
          'You can choose between Random Reveal, Sequential (Top to Bottom), Spiral (Outside In), and Center Outward tile reveal patterns.',
      },
      {
        question: 'What image file types are supported?',
        answer:
          'The timer supports standard JPG (JPEG), PNG, and WebP image files.',
      },
      {
        question: 'Does it work on mobile devices?',
        answer:
          'Yes, the picture reveal timer is fully responsive and works smoothly on smartphones, tablets, iPads, laptops, and classroom interactive whiteboards.',
      },
      {
        question: 'What is the maximum file size?',
        answer:
          'You can upload any JPG, PNG, or WebP image up to 5 MB in size (between 100 × 100 px and 8000 × 8000 px).',
      },
      {
        question: 'Can I remove my uploaded image?',
        answer:
          'Yes. Click the Remove button or the × icon on the image preview at any time to immediately clear your uploaded photo from browser memory.',
      },
    ],
  },
  {
    slug: 'heart-timer',
    name: 'Heart Timer',
    category: 'everyday',
    categoryLabel: 'Timers',
    description:
      'A beautiful heart-shaped countdown timer to help you focus, relax and make the most of your time.',
    badge: 'New',
    icon: 'Heart',
    keywords: [
      'heart timer',
      'heart shaped visual timer',
      'heart countdown',
      'heart countdown timer',
      'valentine timer',
      'cute heart timer',
    ],
    targetAudience:
      'Students, readers, teachers, couples, event hosts, and anyone seeking a warm visual countdown',
    instructions: [
      'Choose a preset time or enter a custom duration.',
      'Select a heart style, color theme and your preferred accent color.',
      'Click Start to begin the countdown.',
      'Watch the heart fill decrease as time passes.',
      'Use Pause or Reset whenever needed.',
    ],
    faq: [
      {
        question: 'Is this heart timer free to use?',
        answer:
          'Yes! This online heart timer is 100% free to use in any browser with no sign-up, downloads, or usage restrictions.',
      },
      {
        question: 'Can I save my preferred style?',
        answer:
          'Yes! Click the "Save as Default" button in the right panel to save your favorite heart style, color theme, duration, and sound or motion settings locally in your browser.',
      },
      {
        question: 'Can I set a custom time?',
        answer:
          'Yes. You can pick from quick presets (1, 3, 5, 10, or 15 minutes), enter any custom duration in minutes, or switch to End Time mode to count down to a specific clock time.',
      },
      {
        question: 'Is there a sound when the timer ends?',
        answer:
          'Yes, an optional gentle chime plays when the heart fill empties completely at 00:00. You can toggle Sound Alert on or off at any time.',
      },
      {
        question: 'Can I change the heart style or color?',
        answer:
          'Yes! Choose between four heart styles—Rose, Berry, Ivory, and Soft Red—and customize the fill with six color theme swatches.',
      },
      {
        question: 'Can I use this for classroom activities?',
        answer:
          'Absolutely. Use Fullscreen mode to project the heart countdown onto classroom smartboards or screens for reading breaks, Valentine’s Day games, and group challenges.',
      },
      {
        question: 'Does it work on mobile devices?',
        answer:
          'Yes, the heart timer is fully responsive and works smoothly on smartphones, tablets, iPads, laptops, and desktop monitors.',
      },
      {
        question: 'What makes a heart timer different from a regular countdown timer?',
        answer:
          'Instead of showing only numbers, a heart timer pairs a digital readout with a large, contoured heart silhouette whose colored fill drains smoothly as time passes—making remaining time warm, engaging, and easy to see at a glance. Note that this is a decorative countdown visualization, not a heart-rate monitor or medical tool.',
      },
    ],
  },
  {
    slug: 'moon-timer',
    name: 'Moon Timer',
    category: 'everyday',
    categoryLabel: 'Timers',
    description:
      'A calming and beautiful moon visual timer with Classic, Crescent, Blue, and Warm Moon styles, Night Sky, Forest, Mountains, and Lakeside themes, brightness controls, and fullscreen mode.',
    badge: 'New',
    icon: 'Clock',
    keywords: [
      'moon timer',
      'moon countdown',
      'calming moon visual timer',
      'night sky timer',
      'lunar timer',
      'evening reading timer',
    ],
    targetAudience:
      'Readers, students, writers, night owls, and anyone looking for a calm evening countdown timer',
    instructions: [
      'Choose a preset time or enter a custom duration.',
      'Select a moon style and background theme.',
      'Adjust brightness and display settings if needed.',
      'Click Start to begin the countdown.',
      'Watch the moon change as time passes.',
      'Use Pause or Reset whenever needed.',
    ],
    faq: [
      {
        question: 'Is the moon timer free to use?',
        answer:
          'Yes! This online moon timer is completely free to use in your browser with no sign-up, downloads, or usage limits.',
      },
      {
        question: 'Is this a real moon phase tracker?',
        answer:
          'No. This is a decorative countdown visualization and not a live astronomical lunar-phase tracker. The moving lunar shadow represents your selected countdown duration.',
      },
      {
        question: 'Can I set a custom time?',
        answer:
          'Yes. You can choose from quick presets (5, 10, 25, 50, or 90 minutes), enter any custom duration in minutes, or switch to End Time mode to count down toward a specific clock time.',
      },
      {
        question: 'Can I turn off the timer sound?',
        answer:
          'Yes! Toggle the Sound Alert switch off at any time if you prefer a completely silent countdown for reading, meditation, or nighttime work.',
      },
      {
        question: 'Can I change the moon style or background?',
        answer:
          'Yes. Choose from four moon styles—Classic Moon, Crescent Moon, Blue Moon, and Warm Moon—and pair them with Night Sky, Forest, Mountains, or Lakeside background themes.',
      },
      {
        question: 'Can I hide the numbers on the moon?',
        answer:
          'Yes! Toggle the Show Time switch off to hide the central digital numbers and enjoy an uninterrupted visual moon countdown.',
      },
      {
        question: 'Does it work on mobile devices?',
        answer:
          'Yes, the moon timer is fully responsive and works smoothly on smartphones, tablets, iPads, laptops, and desktop screens.',
      },
      {
        question: 'What happens when the timer ends?',
        answer:
          'When the countdown reaches zero, the lunar shadow completes its sweep across the moon disc and an optional gentle chime sounds to let you know your session is complete.',
      },
    ],
  },
  {
    slug: 'sun-timer',
    name: 'Sun Timer',
    category: 'everyday',
    categoryLabel: 'Timers',
    description:
      'A beautiful sun visual timer to help you focus, stay productive and enjoy your time with calming sky scenes.',
    badge: 'New',
    icon: 'Clock',
    keywords: [
      'sun timer',
      'sun visual countdown',
      'sunrise style timer',
      'free online sun timer',
      'morning routine timer',
      'sunset visual timer',
      'sky countdown timer',
    ],
    targetAudience:
      'Students, teachers, families, readers, remote workers, and anyone building calm daily routines',
    instructions: [
      'Choose a preset time or enter a custom duration.',
      'Select a sky theme and accent color.',
      'Add an optional session label.',
      'Click Start to begin the countdown.',
      'Watch the sun move as time passes.',
      'Use Pause or Reset whenever needed.',
    ],
    faq: [
      {
        question: 'Is the sun timer free to use?',
        answer:
          'Yes! This online sun timer is 100% free to use directly in your browser with no sign-up, downloads, or usage limits.',
      },
      {
        question: 'Does the sun timer show real sunrise or sunset times?',
        answer:
          'No. The sun timer is a decorative countdown visualization and does not calculate real sunrise, sunset, or daylight duration. Those functions require real date, location, and astronomical calculations.',
      },
      {
        question: 'Can I set a custom time?',
        answer:
          'Yes. You can choose from quick presets (5, 10, 25, 50, or 90 minutes), enter any custom duration in minutes, or switch to End Time mode to count down toward a specific clock time.',
      },
      {
        question: 'Can I turn off the timer sound?',
        answer:
          'Yes! Toggle the Sound Alert switch off at any time if you prefer a silent visual countdown for reading, studying, or quiet classroom activities.',
      },
      {
        question: 'Can I change the sky theme or color?',
        answer:
          'Yes. Choose from four curated sky themes—Morning, Midday, Sunset, and Warm Neutral—and customize the interface with seven accent colors. You can also click Save as Default to remember your preferred setup.',
      },
      {
        question: 'Can I hide the numbers on the sun timer?',
        answer:
          'Yes! Toggle the Show Time switch off to hide the numeric countdown and track your remaining duration purely through the sun’s position along the sky arc.',
      },
      {
        question: 'Does it work on mobile devices?',
        answer:
          'Yes, the sun timer is fully responsive and works smoothly on smartphones, tablets, iPads, laptops, desktop monitors, and classroom smartboards.',
      },
      {
        question: 'What makes a sun timer different from a regular countdown timer?',
        answer:
          'Unlike a plain digital timer that only shows ticking numbers, a sun timer pairs your countdown with a serene illustrated sky where the sun travels smoothly along a curved arc as time passes.',
      },
    ],
  },
  {
    slug: 'bubble-timer',
    name: 'Bubble Timer',
    category: 'everyday',
    categoryLabel: 'Timers',
    description:
      'A calming and interactive bubble visual timer to help you focus, relax and make the most of your time.',
    badge: 'New',
    icon: 'Droplets',
    keywords: [
      'bubble timer',
      'bubble visual countdown',
      'calming bubble timer',
      'free online bubble timer',
      'underwater bubble timer',
      'sensory bubble timer',
      'classroom bubble timer',
    ],
    targetAudience:
      'Students, teachers, children, creative workers, and anyone seeking a gentle underwater visual countdown',
    instructions: [
      'Choose a preset time or enter a custom duration.',
      'Select a bubble theme and background style.',
      'Adjust the bubble density if needed.',
      'Click Start to begin the countdown.',
      'Watch the bubbles as time passes.',
      'Use Pause or Reset whenever you need to.',
    ],
    faq: [
      {
        question: 'Is the bubble timer free to use?',
        answer:
          'Yes! This online bubble timer is 100% free to use directly in your browser with no sign-up, downloads, or usage limits.',
      },
      {
        question: 'Can I turn off the sound?',
        answer:
          'Yes. Toggle the Sound Alert switch off at any time if you prefer a completely silent visual countdown for study sessions, classrooms, or quiet relaxation.',
      },
      {
        question: 'Can I set a custom time?',
        answer:
          'Yes! Choose from quick presets (1, 3, 5, 10, or 15 minutes), enter any custom duration in minutes, or switch to End Time mode to count down toward a specific time of day.',
      },
      {
        question: 'What is the reduced motion option?',
        answer:
          'The Reduced Motion toggle pauses continuous upward floating movement and shimmer effects while still smoothly updating the bubble count and water fill level as time passes.',
      },
      {
        question: 'Can I change the bubble theme or background?',
        answer:
          'Yes! You can choose between four bubble themes—Ocean Blue, Seafoam Green, Pastel Dreams, and Clear Glass—and four scenic underwater background styles, plus save your favorite setup as default.',
      },
      {
        question: 'Can I hide the numbers on the timer?',
        answer:
          'Yes! Toggle the Show Time switch off to hide the numeric MM:SS readout inside the central bubble so you can focus purely on the visual bubble progression.',
      },
      {
        question: 'Does it work on mobile devices?',
        answer:
          'Yes, the bubble timer is fully responsive and works smoothly on smartphones, tablets, iPads, laptops, desktop monitors, and classroom interactive whiteboards.',
      },
      {
        question: 'What happens when the timer ends?',
        answer:
          'As the countdown reaches zero, the rising bubbles gradually fade away until the scene reaches a calm completed state, and an optional gentle chime notifies you that time is up.',
      },
    ],
  },
  {
    slug: 'coral-timer',
    name: 'Coral Timer',
    category: 'everyday',
    categoryLabel: 'Timers',
    description:
      'A relaxing and beautiful coral growth visual timer to help you focus, stay calm and make the most of your time.',
    badge: 'New',
    icon: 'Flower2',
    keywords: [
      'coral timer',
      'growing coral visual timer',
      'ocean visual countdown',
      'free online coral timer',
      'underwater coral countdown',
      'classroom coral timer',
      'reading break timer',
    ],
    targetAudience:
      'Students, teachers, readers, creative professionals, and anyone looking for a peaceful ocean-themed countdown',
    instructions: [
      'Choose a preset time or enter a custom duration.',
      'Select a coral theme and background style.',
      'Click Start to begin the countdown.',
      'Watch the coral grow as time passes.',
      'Use Pause or Reset whenever you need to.',
    ],
    faq: [
      {
        question: 'Is the coral timer free to use?',
        answer:
          'Yes! This online coral timer is 100% free to use in your browser with no sign-up, downloads, or hidden fees.',
      },
      {
        question: 'Is this a real coral growth simulation?',
        answer:
          'No. This is an artistic visual metaphor for time management and does not represent real biological coral growth rates or environmental monitoring.',
      },
      {
        question: 'Can I set a custom time?',
        answer:
          'Yes! Choose from quick presets (1, 3, 5, 10, or 25 minutes), enter any custom duration in minutes, or switch to End Time mode to count down toward a specific time of day.',
      },
      {
        question: 'Can I turn off the sound?',
        answer:
          'Yes. Toggle the Sound Alert switch off at any time if you prefer a completely silent underwater countdown for reading, studying, or quiet classroom sessions.',
      },
      {
        question: 'Can I change the coral theme or background?',
        answer:
          'Yes! Choose between four coral themes—Tropical Coral, Deep Ocean, Colorful Reef, and Minimal Coral—along with four underwater background styles, and save your favorite combination as default.',
      },
      {
        question: 'Can I use this for classroom activities?',
        answer:
          'Absolutely. Use Fullscreen mode to project the growing coral reef on classroom smartboards or projectors so students can calmly see how much time remains for reading, group work, or transitions.',
      },
      {
        question: 'Does it work on mobile devices?',
        answer:
          'Yes, the coral timer is fully responsive and works smoothly on smartphones, tablets, iPads, laptops, and desktop monitors.',
      },
      {
        question: 'What happens when the timer ends?',
        answer:
          'When the countdown reaches zero, the coral structure reaches its full, vibrant bloom and an optional gentle ocean chime notifies you that your session is complete.',
      },
    ],
  },
  {
    slug: 'lichen-timer',
    name: 'Lichen Timer',
    category: 'everyday',
    categoryLabel: 'Timers',
    description:
      'A calming and beautiful lichen growth visual timer to help you focus, stay present and enjoy your time with nature-inspired visuals.',
    badge: 'New',
    icon: 'Leaf',
    keywords: [
      'lichen timer',
      'organic visual timer',
      'nature-inspired countdown',
      'free online lichen timer',
      'moss timer',
      'botanical countdown timer',
      'quiet reading timer',
    ],
    targetAudience:
      'Readers, students, teachers, creative workers, and anyone seeking a calm nature-inspired visual countdown',
    instructions: [
      'Choose a preset time or enter a custom duration.',
      'Select a lichen theme and background style.',
      'Click Start to begin the countdown.',
      'Watch the lichen grow as time passes.',
      'Use Pause or Reset whenever you need to.',
    ],
    faq: [
      {
        question: 'Is the lichen timer free to use?',
        answer:
          'Yes! This online lichen timer is 100% free to use directly in your browser with no sign-up, downloads, or usage limits.',
      },
      {
        question: 'Is this a real lichen growth simulation?',
        answer:
          'No. This is an artistic, decorative nature illustration designed for calm time management rather than a biologically accurate lichen-growth simulation.',
      },
      {
        question: 'Can I set a custom time?',
        answer:
          'Yes! Choose from quick presets (1, 3, 5, 10, or 25 minutes), enter any custom duration in minutes, or switch to End Time mode to count down toward a specific time of day.',
      },
      {
        question: 'Can I turn off the sound?',
        answer:
          'Yes. Toggle the Sound Alert switch off at any time if you prefer a completely silent visual countdown for quiet reading, studying, or classroom use.',
      },
      {
        question: 'Can I change the lichen theme or background?',
        answer:
          'Yes! Choose between four lichen themes—Forest Rock, Tree Bark, Coastal Stone, and Autumn Lichen—along with four natural stone and bark background styles, and save your favorite setup as default.',
      },
      {
        question: 'Can I hide the numbers on the timer?',
        answer:
          'Yes! Toggle the Show Time switch off to hide the numeric countdown so you can track remaining time purely through the organic lichen spread across the stone surface.',
      },
      {
        question: 'Does it work on mobile devices?',
        answer:
          'Yes, the lichen timer is fully responsive and works smoothly on smartphones, tablets, iPads, laptops, and desktop monitors.',
      },
      {
        question: 'What happens when the timer ends?',
        answer:
          'When the timer reaches zero, the natural stone or bark surface reaches its full artistic lichen growth pattern and an optional gentle woodland chime notifies you that time is up.',
      },
    ],
  },
  {
    slug: 'frost-timer',
    name: 'Frost Timer',
    category: 'everyday',
    categoryLabel: 'Timers',
    description:
      'A beautiful and calming frost visual timer that develops delicate ice crystal patterns across a realistic glass surface as time counts down.',
    badge: 'New',
    icon: 'Sparkles',
    keywords: [
      'frost timer',
      'ice visual timer',
      'frost countdown timer',
      'frosted glass timer',
      'ice crystal countdown',
      'calming visual timer',
    ],
    targetAudience:
      'Students, teachers, remote workers, readers, and anyone seeking a serene frosted-glass visual countdown',
    instructions: [
      'Choose a preset time or enter a custom duration.',
      'Select a frost theme and background style.',
      'Adjust brightness and other display settings.',
      'Click Start to begin the countdown.',
      'Use Pause or Reset whenever you need to.',
    ],
    faq: [
      {
        question: 'Is the frost timer free to use?',
        answer:
          'Yes! The online Frost Timer is 100% free to use in your browser with all frost themes, window backgrounds, brightness controls, and fullscreen mode unlocked—no sign-up required.',
      },
      {
        question: 'Is this a real frost or weather simulation?',
        answer:
          'No. This is an artistic, decorative frosted-glass countdown visualization rather than a meteorological weather simulator or falling snow tracker. The crystalline pattern is strictly synchronized with your selected timer duration.',
      },
      {
        question: 'Can I set a custom time?',
        answer:
          'Yes! You can pick from quick presets (1, 3, 5, 10, or 25 minutes), enter any custom duration up to 240 minutes, or switch to End Time mode to count down toward a specific time of day.',
      },
      {
        question: 'Can I turn off the sound?',
        answer:
          'Yes. Toggle the Sound Alert switch off at any time if you prefer a completely silent visual countdown for study blocks, quiet reading, or classroom activities.',
      },
      {
        question: 'Can I change the frost theme or background?',
        answer:
          'Yes! Choose from four curated frost themes—Classic Frost, Icy Blue, Winter Morning, and Frosted Glass—and four winter horizon background styles, then click Save as Default to remember your setup.',
      },
      {
        question: 'Can I hide the numbers on the timer?',
        answer:
          'Yes. Toggle the Show Time switch off to hide the digital numbers and experience a pure visual countdown where the remaining clear glass in the center shows how much time is left.',
      },
      {
        question: 'Does it work on mobile devices?',
        answer:
          'Yes, the frost timer is fully responsive and works smoothly on smartphones, tablets, iPads, laptops, and classroom smartboards.',
      },
      {
        question: 'What happens when the timer ends?',
        answer:
          'When the countdown reaches zero, the glass surface reaches its full crystalline frost pattern and an optional harmonic ice-bell chime gently alerts you that your session is complete.',
      },
    ],
  },
  {
    slug: 'snow-timer',
    name: 'Snow Timer',
    category: 'everyday',
    categoryLabel: 'Timers',
    description:
      'A calming and beautiful snowfall visual timer where snowflakes gently fall and gradually accumulate along the bottom of a peaceful winter scene as time passes.',
    badge: 'New',
    icon: 'Sparkles',
    keywords: [
      'snow timer',
      'falling snow countdown',
      'snow visual timer',
      'winter visual timer',
      'snowfall countdown timer',
      'calming winter timer',
    ],
    targetAudience:
      'Students, teachers, readers, remote workers, and anyone looking for a calm winter snowfall countdown',
    instructions: [
      'Choose a preset time or enter a custom duration.',
      'Adjust the snowfall intensity and theme.',
      'Click Start to begin the countdown.',
      'Use Pause to temporarily stop the timer.',
      'Click Reset to set a new time and start again.',
    ],
    faq: [
      {
        question: 'Is the snow timer free to use?',
        answer:
          'Yes! The online Snow Timer is 100% free to use directly in your browser with all four winter scenes, snowflake styles, intensity controls, and fullscreen mode included.',
      },
      {
        question: 'Is the snowfall real weather data?',
        answer:
          'No. The snowfall and bottom snow accumulation are a calm, decorative visual countdown representation synchronized with your chosen timer duration rather than live meteorological or weather data.',
      },
      {
        question: 'Can I set a custom time?',
        answer:
          'Yes! Choose from instant presets (1, 3, 5, 10, or 25 minutes), type any custom duration up to 240 minutes, or switch to End Time mode to count down to a specific clock time.',
      },
      {
        question: 'Can I turn off the sound?',
        answer:
          'Yes. Toggle the Sound Alert switch off at any time if you prefer a completely silent snowfall countdown for quiet reading, classrooms, or study blocks.',
      },
      {
        question: 'Can I change the snowfall intensity?',
        answer:
          'Yes! Use the Snowfall Intensity slider to switch between a light, peaceful flurry for long focus sessions or a denser snowfall for short, playful classroom activities. You can also enable Reduced Motion for battery-friendly, minimal movement.',
      },
      {
        question: 'Can I hide the numbers on the timer?',
        answer:
          'Yes. Toggle the Show Time switch off to hide the numeric clock and track your session purely through the rising snow layer along the bottom of the winter scene.',
      },
      {
        question: 'Does it work on mobile devices?',
        answer:
          'Yes, the Snow Timer is fully responsive and battery-efficient across smartphones, tablets, iPads, laptops, desktop monitors, and classroom smartboards.',
      },
      {
        question: 'What happens when the timer ends?',
        answer:
          'When the countdown reaches zero, the snow accumulation layer reaches its completed winter depth across the bottom of the scene and an optional gentle winter chime notifies you.',
      },
    ],
  },
  {
    slug: 'galaxy-timer',
    name: 'Galaxy Timer',
    category: 'everyday',
    categoryLabel: 'Timers',
    description:
      'A stunning and relaxing galaxy countdown timer to help you focus, stay productive and enjoy a calm, space-inspired experience.',
    badge: 'New',
    icon: 'Sparkles',
    keywords: [
      'galaxy timer',
      'starfield countdown',
      'space visual timer',
      'cosmic countdown timer',
      'nebula visual timer',
      'space study timer',
    ],
    targetAudience:
      'Students, creative writers, evening readers, gamers, and anyone seeking a calm cosmic countdown timer',
    instructions: [
      'Choose a preset time or enter a custom duration.',
      'Select a galaxy theme and background style.',
      'Adjust the animation speed and sound settings.',
      'Click Start to begin the countdown.',
      'Use Pause or Reset whenever you need to.',
    ],
    faq: [
      {
        question: 'Is the galaxy timer free to use?',
        answer:
          'Yes! The online Galaxy Timer is 100% free to use directly in your browser with all galaxy themes, cosmic background styles, animation speed controls, and fullscreen mode included.',
      },
      {
        question: 'Is this a real astronomical simulation?',
        answer:
          'No. The galaxy, nebula, and starfield visuals are a calm, decorative countdown animation synchronized to your chosen timer duration rather than a real-time astronomical or planetarium simulation.',
      },
      {
        question: 'Can I set a custom time?',
        answer:
          'Yes! Select from quick presets (1, 3, 5, 10, or 25 minutes), enter any custom duration up to 240 minutes, or switch to End Time mode to count down toward a specific time of day.',
      },
      {
        question: 'Can I turn off the sound?',
        answer:
          'Yes. Toggle the Sound Alert switch off at any time if you prefer a completely silent cosmic visual countdown for study sessions, creative writing, or evening wind-down routines.',
      },
      {
        question: 'Can I change the galaxy theme or background?',
        answer:
          'Yes! Choose from four distinct space themes—Spiral Galaxy, Nebula Cloud, Starfield, and Andromeda Style—and four deep-space background color palettes, then click Save as Default to keep your favorite combination.',
      },
      {
        question: 'Is there a low-motion option?',
        answer:
          'Yes! You can slow down the rotation using the Animation Speed slider or click the Low Motion toggle for a calm, static starfield without rotation or shimmer.',
      },
      {
        question: 'Does it work on mobile devices?',
        answer:
          'Yes, the Galaxy Timer is fully responsive and battery-friendly across smartphones, tablets, iPads, laptops, desktop monitors, and smartboards.',
      },
      {
        question: 'What happens when the timer ends?',
        answer:
          'When the countdown reaches zero, the spiral galaxy, outer star clusters, and constellation lines reach their complete, luminous state and an optional ambient space chime plays.',
      },
    ],
  },
  {
    slug: 'lava-lamp-timer',
    name: 'Lava Lamp Timer',
    category: 'everyday',
    categoryLabel: 'Timers',
    description:
      'A retro and relaxing lava lamp countdown timer that helps you focus, relax and enjoy a calming visual experience.',
    badge: 'New',
    icon: 'Flame',
    keywords: [
      'lava lamp timer',
      'retro lava lamp countdown',
      'liquid motion timer',
      'free online lava lamp timer',
      'retro visual timer',
      'wax blob countdown',
    ],
    targetAudience:
      'Students, readers, creative professionals, and anyone looking for a relaxing retro visual countdown',
    instructions: [
      'Choose a preset time or enter a custom duration.',
      'Select a lava lamp theme and lamp style.',
      'Adjust the animation speed and other settings.',
      'Click Start to begin the countdown.',
      'Use Pause or Reset whenever you need to.',
    ],
    faq: [
      {
        question: 'Is the lava lamp timer free to use?',
        answer:
          'Yes! The online Lava Lamp Timer is 100% free to use directly in your browser with all retro color themes, lamp styles, speed settings, and fullscreen mode included.',
      },
      {
        question: 'Is this a real lava lamp?',
        answer:
          'No. It is a digital visual countdown inspired by the classic retro lava lamp, where smooth rising and merging blobs are synchronized to your chosen countdown duration rather than physical heated wax.',
      },
      {
        question: 'Can I set a custom time?',
        answer:
          'Yes! Choose from quick presets (1, 3, 5, 10, or 25 minutes), enter any custom duration up to 240 minutes, or switch to End Time mode to count down toward a specific clock time.',
      },
      {
        question: 'Can I turn off the sound?',
        answer:
          'Yes. Toggle the Sound Alert switch off at any time if you prefer a completely silent retro visual countdown for studying, reading, or quiet work breaks.',
      },
      {
        question: 'Can I change the lava lamp theme or colors?',
        answer:
          'Yes! Choose from four retro lava lamp themes—Retro Amber, Deep Blue, Neon Pink, and Aqua Glow—plus four glowing Lamp Style wax orbs, and click Save as Default to keep your favorite look.',
      },
      {
        question: 'Is there a reduced-motion option?',
        answer:
          'Yes! You can adjust the Animation Speed slider between Slow, Normal, and Fast, or click the Reduced Motion button for a calm, static visual display.',
      },
      {
        question: 'Does it work on mobile devices?',
        answer:
          'Yes, the Lava Lamp Timer is fully responsive and runs smoothly across smartphones, tablets, iPads, laptops, desktop monitors, and smartboards.',
      },
      {
        question: 'What happens when the timer ends?',
        answer:
          'When the countdown reaches zero, the lava lamp reaches its completed visual state, the base readout indicates completion, and an optional warm retro chime plays.',
      },
    ],
  },
  {
    slug: 'spinner-timer',
    name: 'Spinner Timer',
    category: 'everyday',
    categoryLabel: 'Timers',
    description:
      'A clear and interactive spinning countdown timer to help you stay focused, manage activities and make timed tasks more engaging.',
    badge: 'New',
    icon: 'RotateCw',
    keywords: [
      'spinner timer',
      'spinning countdown timer',
      'rotating visual timer',
      'free online spinner timer',
      'classroom spinner timer',
    ],
    targetAudience:
      'Teachers, students, coaches, workout groups, workshop facilitators, and families playing timed games',
    instructions: [
      'Choose a preset time or enter a custom duration.',
      'Select a spinner theme and rotation direction.',
      'Click Start to begin the countdown.',
      'Use Pause and Resume if you need a break.',
      'Click Reset to set a new time and start again.',
    ],
    faq: [
      {
        question: 'Is the spinner timer free to use?',
        answer:
          'Yes, the online Spinner Timer is 100% free to use with no sign-up, account, or subscription required.',
      },
      {
        question: 'Is this a random spinner wheel?',
        answer:
          'No. Unlike a random prize wheel that picks a random option or name, the Spinner Timer is a deterministic visual countdown timer where pointer rotation strictly represents elapsed time.',
      },
      {
        question: 'Can I set a custom time?',
        answer:
          'Yes! You can choose from quick presets (1, 3, 5, 10, or 25 minutes), enter any custom duration in minutes, or count down until a specific clock end time.',
      },
      {
        question: 'Can I turn off the sound?',
        answer:
          'Yes, you can toggle the Sound Alert switch on or off at any time for silent study sessions or quiet classrooms.',
      },
      {
        question: 'Can I change the spinner direction?',
        answer:
          'Yes! Use the Rotation Direction buttons to switch between Clockwise and Counterclockwise rotation at any time.',
      },
      {
        question: 'Can I use it for classroom activities?',
        answer:
          'Absolutely. The high-contrast segmented dial and fullscreen mode make it easy for students across a classroom to see how much time remains during games, group work, and transitions.',
      },
      {
        question: 'Does it work on mobile devices?',
        answer:
          'Yes, the Spinner Timer works seamlessly across smartphones, tablets, iPads, laptops, desktop monitors, and interactive smartboards.',
      },
      {
        question: 'What happens when the timer ends?',
        answer:
          'When the countdown reaches zero, the spinner pointer reaches the completed 12 o’clock position, all progress segments complete, and an optional chime sounds.',
      },
    ],
  },
  {
    slug: 'flip-timer',
    name: 'Flip Timer',
    category: 'everyday',
    categoryLabel: 'Timers',
    description:
      'A retro split-flap countdown timer with a classic mechanical flip animation. Simple, clear and perfect for focus, study and presentations.',
    badge: 'New',
    icon: 'Calendar',
    keywords: [
      'flip timer',
      'retro flip countdown',
      'split-flap timer',
      'free online flip timer',
      'mechanical flip timer',
    ],
    targetAudience:
      'Students, office workers, presenters, speakers, teachers, and retro workspace enthusiasts',
    instructions: [
      'Choose a preset time or enter a custom duration.',
      'Pick a display theme and digit style.',
      'Click Start to begin the countdown.',
      'Use Pause to stop and Resume to continue.',
      'Click Reset to set a new time and start again.',
    ],
    faq: [
      {
        question: 'Is the flip timer free to use?',
        answer:
          'Yes, our online Flip Timer is completely free to use with no registration, downloads, or hidden fees.',
      },
      {
        question: 'What is the difference between a flip timer and a flip clock?',
        answer:
          'A flip timer counts down from a set duration to zero for timed tasks and focus sessions, whereas a flip clock displays the current time of day continuously.',
      },
      {
        question: 'Can I set a custom time?',
        answer:
          'Yes! Choose from quick presets (1, 3, 5, 10, or 25 minutes), enter any custom duration, or count down until a target clock End Time.',
      },
      {
        question: 'Can I use it for presentations?',
        answer:
          'Yes, the high-contrast mechanical split-flap digits and Fullscreen mode make it easy to read from a distance during talks and presentations.',
      },
      {
        question: 'Does it make a sound when it ends?',
        answer:
          'Yes, when Sound Alert is enabled, a classic desk chime plays when the countdown reaches zero.',
      },
      {
        question: 'Can I change the theme or digit style?',
        answer:
          'Yes, choose from Classic Black, Retro Cream, Industrial, and Modern Dark themes plus three Digit Styles.',
      },
      {
        question: 'Does it work on mobile devices?',
        answer:
          'Yes, the Flip Timer works smoothly on smartphones, tablets, laptops, and desktop screens.',
      },
      {
        question: 'What happens when the timer reaches zero?',
        answer:
          'When the timer reaches 00:00, the split-flap panels stop at zero, the nameplate shows TIME IS UP!, and an optional alert chime sounds.',
      },
    ],
  },
  {
    slug: 'train-timer',
    name: 'Train Timer',
    category: 'everyday',
    categoryLabel: 'Everyday Timers',
    description:
      'Railway station departure-board countdown timer with split-flap digits, custom session names, station themes, and an animated train route progress bar.',
    badge: 'New',
    icon: 'TrainFront',
    keywords: [
      'train timer',
      'train countdown timer',
      'departure board timer',
      'free online train timer',
      'railway station timer',
      'classroom train timer',
    ],
    targetAudience:
      'Teachers, event organizers, presenters, students, and activity facilitators',
    instructions: [
      'Enter a duration or choose a quick preset (1, 3, 5, 10, or 25 minutes).',
      'Type a custom Session Name such as "Next Activity", "Presentation Starts", or "Break Ends".',
      'Select a Train Theme (Classic Station, Modern Station, Vintage Railway, or Night Station) and Train Style.',
      'Click Start to watch the split-flap departure board count down and the train travel from START to ARRIVAL.',
    ],
    faq: [
      {
        question: 'Is the train timer free to use?',
        answer:
          'Yes, the Free Online Train Timer is completely free with no sign-up or installation required.',
      },
      {
        question: 'Is this a real train timetable or live departure tracker?',
        answer:
          'No. This is a user-configured visual countdown timer inspired by railway departure boards, not a live train timetable or real-time transport tracker.',
      },
    ],
  },
  {
    slug: 'forest-fire-timer',
    name: 'Forest Fire Timer',
    category: 'everyday',
    categoryLabel: 'Everyday Timers',
    description:
      'Creative, nature-inspired countdown with a stylized spreading warm ember and flame animation across Classic, Pine Valley, Autumn & Mountain forests.',
    badge: 'New',
    icon: 'Flame',
    keywords: [
      'forest fire timer',
      'spreading fire visual timer',
      'fire countdown',
      'free online forest fire timer',
      'nature visual timer',
      'classroom forest timer',
    ],
    targetAudience:
      'Teachers, students, game hosts, creative writers, and activity facilitators',
    instructions: [
      'Choose a preset time or enter a custom duration.',
      'Adjust the animation intensity and other settings.',
      'Click Start to begin the countdown.',
      'Use Pause to temporarily stop the timer.',
      'Click Reset to set a new time and start again.',
    ],
    faq: [
      {
        question: 'Is the forest fire timer free to use?',
        answer:
          'Yes, the Free Online Forest Fire Timer is completely free with no registration or downloads required.',
      },
      {
        question: 'Is this a real forest fire or emergency alert?',
        answer:
          'No. This is a decorative visual timer for focus, learning and creative activities. It is not a wildfire prediction tool, fire-danger assessment or emergency-warning service.',
      },
    ],
  },
  {
    slug: 'flip-clock',
    name: 'Flip Clock',
    category: 'everyday',
    categoryLabel: 'Everyday Timers',
    description:
      'A realistic retro split-flap clock with Live Clock, Countdown, and Stopwatch modes, 12/24-hour format, timezone selection, and Dark & Light themes.',
    badge: 'New',
    icon: 'Clock',
    keywords: [
      'flip clock',
      'online flip clock',
      'retro digital clock',
      'flip clock timer',
      'free online flip clock',
      'split-flap clock',
    ],
    targetAudience:
      'Desk setup enthusiasts, students, presenters, office workers, and streamers',
    instructions: [
      'Choose a mode: Live Clock, Countdown or Stopwatch.',
      'Set your time format (12-hour or 24-hour).',
      'Select your time zone (for Live Clock).',
      'Add a duration (for Countdown) or start the stopwatch.',
      'Use Start, Pause and Reset controls when needed.',
    ],
    faq: [
      {
        question: 'Is the online flip clock free to use?',
        answer:
          'Yes! Our Free Online Flip Clock is 100% free with no account sign-up, subscription, or software installation required.',
      },
      {
        question: 'What is the difference between a flip clock and a flip timer?',
        answer:
          'A flip clock shows the current time (live clock) and can also work as a countdown or stopwatch, whereas a flip timer is solely a countdown timer.',
      },
    ],
  },
  {
    slug: 'sensory-timers',
    name: 'Sensory Visual Timers',
    category: 'everyday',
    categoryLabel: 'Everyday Timers',
    description:
      'A curated collection of calm, visually engaging timers with gentle motion and distraction-free designs—compare Sand, Liquid, Rainbow, Bubble, Frost, Snow, Lichen, and Moon Timers.',
    badge: 'New',
    icon: 'Leaf',
    keywords: [
      'sensory timers',
      'calming visual timers',
      'sensory countdown timers',
      'sensory visual timers',
      'low motion timer',
    ],
    targetAudience:
      'Teachers, students, parents, focus enthusiasts, and anyone preferring low-distraction visual time management',
    instructions: [
      'Use the Filter Timers checkboxes (Low motion, No sound, Soft colors, Numeric display, Fullscreen support, Visual-only display) to narrow down your preferred style.',
      'Click the preview button on any timer card to see a gentle animation preview.',
      'Click Open Timer to launch the full interactive sensory timer.',
    ],
    faq: [
      {
        question: 'What are sensory timers used for?',
        answer:
          'Sensory timers are used for study sessions, classroom transitions, reading blocks, quiet breaks, creative work, and everyday time management.',
      },
      {
        question: 'Are these timers free to use?',
        answer:
          'Yes, every timer in the Sensory Visual Timers collection is 100% free to use online with no registration required.',
      },
    ],
  },
];

// Explicit contextual tool pairing map (Section 7 architecture)
const CONTEXTUAL_RELATED_MAP: Record<string, string[]> = {
  'sensory-timers': ['sand-timer', 'liquid-timer', 'rainbow-timer', 'bubble-timer', 'frost-timer', 'snow-timer', 'lichen-timer', 'moon-timer'],
  'flip-clock': ['flip-timer', 'visual-timer', 'progress-timer', 'stopwatch', 'countdown-timer', 'world-clock'],
  'forest-fire-timer': ['visual-timer', 'progress-timer', 'candle-timer', 'snow-timer', 'circular-timer'],
  'train-timer': ['flip-timer', 'progress-timer', 'circular-timer', 'visual-timer', 'countdown-timer', 'classroom-timer'],
  'flip-timer': ['train-timer', 'pomodoro-timer', 'circular-timer', 'progress-timer', 'pixel-timer', 'blocks-timer', 'hourglass-timer', 'candle-timer', 'spinner-timer', 'visual-timer'],
  'spinner-timer': ['pomodoro-timer', 'circular-timer', 'rings-timer', 'progress-timer', 'pixel-timer', 'blocks-timer', 'candle-timer', 'moon-timer', 'sun-timer', 'galaxy-timer'],
  'lava-lamp-timer': ['pomodoro-timer', 'circular-timer', 'rings-timer', 'progress-timer', 'pixel-timer', 'blocks-timer', 'candle-timer', 'moon-timer', 'sun-timer', 'galaxy-timer'],
  'galaxy-timer': ['pomodoro-timer', 'circular-timer', 'rings-timer', 'progress-timer', 'pixel-timer', 'blocks-timer', 'candle-timer', 'moon-timer', 'sun-timer', 'snow-timer'],
  'snow-timer': ['pomodoro-timer', 'circular-timer', 'rings-timer', 'progress-timer', 'pixel-timer', 'blocks-timer', 'candle-timer', 'moon-timer', 'sun-timer', 'frost-timer'],
  'frost-timer': ['pomodoro-timer', 'circular-timer', 'rings-timer', 'progress-timer', 'pixel-timer', 'blocks-timer', 'candle-timer', 'moon-timer', 'sun-timer', 'bubble-timer'],
  'lichen-timer': ['pomodoro-timer', 'circular-timer', 'rings-timer', 'progress-timer', 'pixel-timer', 'blocks-timer', 'candle-timer', 'moon-timer', 'sun-timer', 'bubble-timer'],
  'coral-timer': ['pomodoro-timer', 'circular-timer', 'rings-timer', 'progress-timer', 'pixel-timer', 'blocks-timer', 'candle-timer', 'moon-timer', 'sun-timer', 'aesthetic-timer'],
  'bubble-timer': ['pomodoro-timer', 'circular-timer', 'rings-timer', 'progress-timer', 'pixel-timer', 'blocks-timer', 'candle-timer', 'moon-timer', 'sun-timer', 'aesthetic-timer'],
  'sun-timer': ['pomodoro-timer', 'circular-timer', 'rings-timer', 'progress-timer', 'pixel-timer', 'blocks-timer', 'candle-timer', 'aesthetic-timer'],
  'moon-timer': ['pomodoro-timer', 'circular-timer', 'rings-timer', 'progress-timer', 'pixel-timer', 'blocks-timer', 'candle-timer', 'aesthetic-timer'],
  'heart-timer': ['pomodoro-timer', 'circular-timer', 'progress-timer', 'rings-timer', 'sand-timer', 'candle-timer'],
  'picture-reveal-timer': ['sand-timer', 'circular-timer', 'rings-timer', 'progress-timer', 'pixel-timer', 'blocks-timer', 'candle-timer', 'aesthetic-timer'],
  'aesthetic-timer': ['pomodoro-timer', 'circular-timer', 'rings-timer', 'progress-timer', 'pixel-timer', 'candle-timer', 'sand-timer'],
  'candle-timer': ['sand-timer', 'progress-timer', 'circular-timer', 'rings-timer', 'pixel-timer', 'pomodoro-timer'],
  'blocks-timer': ['sand-timer', 'circular-timer', 'rings-timer', 'progress-timer', 'visual-timer', 'pomodoro-timer'],
  'pixel-timer': ['progress-timer', 'circular-timer', 'radial-timer', 'rings-timer', 'visual-timer', 'pomodoro-timer'],
  'progress-timer': ['circular-timer', 'radial-timer', 'rings-timer', 'visual-timer', 'countdown-timer', 'pomodoro-timer', 'classroom-timer'],
  'rings-timer': ['progress-timer', 'circular-timer', 'radial-timer', 'visual-timer', 'countdown-timer', 'pomodoro-timer'],
  'radial-timer': ['progress-timer', 'rings-timer', 'circular-timer', 'visual-timer', 'countdown-timer'],
  'circular-timer': ['progress-timer', 'rings-timer', 'radial-timer', 'visual-timer', 'countdown-timer'],
  'hourglass-timer': ['sand-timer', 'visual-timer', 'countdown-timer', 'pomodoro-timer', 'classroom-timer'],
  'rainbow-timer': ['progress-timer', 'rings-timer', 'radial-timer', 'visual-timer', 'countdown-timer'],
  'sand-timer': ['hourglass-timer', 'circular-timer', 'radial-timer', 'rainbow-timer', 'liquid-timer'],
  'liquid-timer': ['progress-timer', 'rings-timer', 'radial-timer', 'circular-timer', 'hourglass-timer'],
  'visual-timer': ['progress-timer', 'rings-timer', 'radial-timer', 'circular-timer', 'hourglass-timer'],
  'presentation-timer': ['stage-timer', 'speech-time-calculator', 'speaker-timer', 'countdown-timer'],
  'stage-timer': ['presentation-timer', 'meeting-planner', 'speaker-timer', 'webinar-timer'],
  'multi-stopwatch': ['interval-timer', 'stopwatch', 'tabata-timer', 'countdown-timer'],
  'random-name-picker': ['random-group-generator', 'seating-chart-maker', 'classroom-scoreboard', 'classroom-timer'],
  'random-group-generator': ['random-name-picker', 'seating-chart-maker', 'classroom-timer', 'classroom-scoreboard'],
  'speech-time-calculator': ['presentation-timer', 'speaker-timer', 'toastmasters-timer', 'debate-timer'],
  'world-clock': ['time-zone-converter', 'meeting-planner', 'countdown-timer', 'time-difference-calculator'],
  'time-zone-converter': ['meeting-planner', 'world-clock', 'time-difference-calculator', 'what-time-will-it-be'],
  'meeting-planner': ['time-zone-converter', 'world-clock', 'stage-timer', 'time-difference-calculator'],
  'time-card-calculator': ['overtime-calculator', 'time-duration-calculator', 'time-addition-calculator', 'minutes-to-hours'],
  'overtime-calculator': ['time-card-calculator', 'time-duration-calculator', 'time-addition-calculator', 'hours-to-minutes'],
  'time-duration-calculator': ['time-calculator', 'date-calculator', 'world-clock', 'countdown-timer'],
  'time-addition-calculator': ['time-duration-calculator', 'time-calculator', 'time-card-calculator', 'overtime-calculator'],
  'time-calculator': ['time-duration-calculator', 'time-addition-calculator', 'time-converter', 'date-calculator'],
  'date-calculator': ['time-duration-calculator', 'time-calculator', 'event-countdown-timer', 'world-clock'],
  'time-converter': ['minutes-to-hours', 'seconds-to-minutes', 'hours-to-minutes', 'time-calculator'],
  'minutes-to-hours': ['hours-to-minutes', 'seconds-to-minutes', 'time-converter', 'time-duration-calculator'],
  'seconds-to-minutes': ['minutes-to-hours', 'hours-to-minutes', 'time-converter', 'stopwatch'],
  'hours-to-minutes': ['minutes-to-hours', 'seconds-to-minutes', 'time-converter', 'time-duration-calculator'],
  'what-time-will-it-be': ['time-duration-calculator', 'time-calculator', 'countdown-timer', 'world-clock'],
  'pomodoro-timer': ['study-timer', 'break-timer', 'eye-break-timer', 'visual-timer'],
  'study-timer': ['pomodoro-timer', 'reading-timer', 'eye-break-timer', 'visual-timer'],
  'classroom-timer': ['visual-timer', 'sand-timer', 'classroom-noise-meter', 'random-name-picker'],
  'classroom-noise-meter': ['classroom-timer', 'classroom-scoreboard', 'random-group-generator', 'visual-timer'],
};

export const VISUAL_TIMERS_SUBPATH_SLUGS = new Set<string>([
  'aesthetic-timer',
  'blocks-timer',
  'bubble-timer',
  'candle-timer',
  'circular-timer',
  'coral-timer',
  'flip-clock',
  'flip-timer',
  'forest-fire-timer',
  'frost-timer',
  'galaxy-timer',
  'heart-timer',
  'hourglass-timer',
  'lava-lamp-timer',
  'lichen-timer',
  'liquid-timer',
  'moon-timer',
  'picture-reveal-timer',
  'pixel-timer',
  'progress-timer',
  'radial-timer',
  'rainbow-timer',
  'rings-timer',
  'sand-timer',
  'sensory-timers',
  'snow-timer',
  'spinner-timer',
  'sun-timer',
  'train-timer',
]);

export function getToolCanonicalPath(slug: string): string {
  return VISUAL_TIMERS_SUBPATH_SLUGS.has(slug) ? `/timers/${slug}` : `/${slug}`;
}

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return TOOLS_REGISTRY.find((t) => t.slug === slug);
}

export function getRelatedTools(currentSlug: string, count = 3): ToolDefinition[] {
  const explicitSlugs = CONTEXTUAL_RELATED_MAP[currentSlug];
  if (explicitSlugs) {
    const resolved = explicitSlugs
      .map((s) => getToolBySlug(s))
      .filter((t): t is ToolDefinition => Boolean(t));
    if (resolved.length >= count) {
      return resolved.slice(0, count);
    }
  }

  const current = getToolBySlug(currentSlug);
  if (!current) return TOOLS_REGISTRY.slice(0, count);

  const sameCategory = TOOLS_REGISTRY.filter(
    (t) => t.category === current.category && t.slug !== currentSlug
  );
  if (sameCategory.length >= count) {
    return sameCategory.slice(0, count);
  }

  const others = TOOLS_REGISTRY.filter(
    (t) => t.slug !== currentSlug && !sameCategory.includes(t)
  );
  return [...sameCategory, ...others].slice(0, count);
}

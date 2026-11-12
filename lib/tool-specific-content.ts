export interface ToolSpecificContent {
  slug: string;
  useCasesIntro: string;
  useCases: string[];
  howToUse: string[];
  faqs: [
    { question: string; answer: string },
    { question: string; answer: string },
    { question: string; answer: string },
  ];
}

export const TOOL_SPECIFIC_CONTENT: Record<string, ToolSpecificContent> = {
  'speaker-timer': {
    slug: 'speaker-timer',
    useCasesIntro:
      'Built for live lecterns, panel moderation, and conference podiums where presenters need unmistakable visual pacing cues from across the stage.',
    useCases: [
      'Keynote & TED-Style Talks: Run 15- or 20-minute talk blocks with green, amber, and red wrap-up warnings.',
      'Academic Paper Defenses: Keep 12-minute faculty presentations and 3-minute Q&A transitions strictly on schedule.',
      'Executive Town Halls: Track department updates on a floor monitor without interrupting speakers verbally.',
    ],
    howToUse: [
      'Select a speech duration preset (5, 10, 15, 20, or 45 minutes) or enter custom minutes and seconds.',
      'Press Start (or Spacebar) and click Fullscreen (F) on your podium tablet or downstage monitor.',
      'Watch the display shift from green to amber wrap-up warning to red final-minute and overtime count-up.',
    ],
    faqs: [
      {
        question: 'When do the amber and red stage warning colors trigger on the Speaker Timer?',
        answer:
          'The display stays green during the main talk, shifts to amber for the wrap-up window, and turns red in the final minute.',
      },
      {
        question: 'What happens on screen if a keynote speaker talks past 00:00?',
        answer:
          'Instead of stopping, the clock switches into red overtime count-up mode so the moderator and speaker see exact elapsed overtime.',
      },
      {
        question: 'Which keyboard shortcuts control the podium display without a mouse?',
        answer:
          'Press Spacebar to start or pause, R to reset to your preset duration, F for fullscreen, and M to mute chimes.',
      },
    ],
  },

  'presentation-timer': {
    slug: 'presentation-timer',
    useCasesIntro:
      'Designed for slide-deck presenters, startup founders, and thesis candidates who divide a talk into timed agenda sections.',
    useCases: [
      'Startup Investor Pitches: Split a 10-minute pitch into 2m Problem, 4m Product Demo, 2m Traction, and 2m Q&A.',
      'Quarterly Business Reviews: Allocate fixed minutes per slide section so executive discussion never gets cut short.',
      'University Dissertation Defenses: Pace literature review, methodology, and findings before committee questions.',
    ],
    howToUse: [
      'Set your total presentation time and configure individual section durations for your deck outline.',
      'Click Start as you advance past your title slide and monitor both section time and total time remaining.',
      'Use the section transition chime or visual bar to move to your next slide topic on pace.',
    ],
    faqs: [
      {
        question: 'How should I divide a 20-minute slide deck presentation with audience Q&A?',
        answer:
          'Reserve 15 minutes for slides (roughly 10 to 12 slides at 90 seconds each) and protect the final 5 minutes for Q&A.',
      },
      {
        question: 'Can I run the Presentation Timer alongside PowerPoint or Keynote Presenter View?',
        answer:
          'Yes, dock the browser window beside your speaker notes or run it on a companion tablet propped next to your laptop.',
      },
      {
        question: 'How do I keep early introductory slides from eating into my demo time?',
        answer:
          'Assign a strict 2-minute cap to your introduction segment so the pacing bar alerts you to transition into your core material.',
      },
    ],
  },

  'stage-timer': {
    slug: 'stage-timer',
    useCasesIntro:
      'Created for AV technicians, show callers, and conference producers managing a downstage confidence monitor from a backstage laptop.',
    useCases: [
      'Multi-Speaker Conferences: Control speaker countdowns from the sound booth while projecting a clean stage view.',
      'Live Broadcast & Streaming Studios: Flash silent cue messages like "WRAP UP" or "MIC CHECK" to on-camera talent.',
      'Award Ceremonies & Panels: Add or subtract 1 minute on the fly when live program segments shift.',
    ],
    howToUse: [
      'Keep the Operator Console open on your control laptop and click "Open Stage Display" to launch the viewer window.',
      'Drag the Stage Display window onto your extended HDMI/SDI confidence monitor and press F for fullscreen.',
      'Trigger timers, adjust minutes live, or broadcast instant text prompts that sync across screens in real time.',
    ],
    faqs: [
      {
        question: 'How does the Operator Console sync with the Stage Display window?',
        answer:
          'Both windows communicate instantaneously over the browser BroadcastChannel and local state sync using your shared room ID.',
      },
      {
        question: 'Can I send a silent text cue to the presenter while the countdown is running?',
        answer:
          'Yes, type any prompt into the Operator Console message box and click Show Message to flash it beneath the stage digits.',
      },
      {
        question: 'Can I add extra time to a live speaker without restarting their clock?',
        answer:
          'Yes, use the +1m and -1m live adjustment buttons in the Operator Console to modify remaining time seamlessly.',
      },
    ],
  },

  'toastmasters-timer': {
    slug: 'toastmasters-timer',
    useCasesIntro:
      'Tailored for Toastmasters International club meetings and speech contests requiring official Green, Amber, and Red qualification signals.',
    useCases: [
      'Table Topics Impromptu Rounds: Signal Green at 1:00, Amber at 1:30, and Red at 2:00 with a 30-second grace window.',
      'Prepared Pathways Speeches (5–7 Minutes): Trigger Green at 5:00, Amber at 6:00, and Red at 7:00 automatically.',
      'Speech Evaluations & Icebreakers: Run official 2–3 minute evaluation or 4–6 minute Icebreaker timing rules.',
    ],
    howToUse: [
      'Choose your official Toastmasters speech role preset (Table Topics, Evaluation, Icebreaker, or 5–7m Prepared Speech).',
      'Click Start when the speaker begins; the background automatically shifts to Green, Amber, and Red at official marks.',
      'Stop the clock when the speaker finishes to record their exact elapsed time and contest qualification status.',
    ],
    faqs: [
      {
        question: 'What are the official Green, Amber, and Red marks for a 5-to-7 minute Toastmasters speech?',
        answer:
          'The Green signal appears at 5:00, the Amber signal appears at 6:00, and the Red signal appears at 7:00.',
      },
      {
        question: 'When is a speaker disqualified in a Toastmasters speech contest?',
        answer:
          'Contestants are disqualified if they finish before the minimum qualifying time (or more than 30s under) or more than 30 seconds past Red.',
      },
      {
        question: 'Does the Red card stay on screen after the maximum speech time is reached?',
        answer:
          'Yes, following Toastmasters protocol, the Red background remains displayed until the speaker concludes their remarks.',
      },
    ],
  },

  'debate-timer': {
    slug: 'debate-timer',
    useCasesIntro:
      'Built for collegiate, parliamentary, and high school forensics debates requiring protected-time tracking and Point of Information (POI) gavel bells.',
    useCases: [
      'British Parliamentary (BP) Debates: Track 7-minute constructive speeches with 1:00 and 6:00 POI bell cues.',
      'Lincoln-Douglas & Public Forum Rounds: Time constructive speeches, cross-examinations, and prep-time banks.',
      'World Schools & Oxford Style Debates: Enforce opening and closing protected minutes where interruptions are barred.',
    ],
    howToUse: [
      'Select your debate format (British Parliamentary 7m, World Schools 8m, Lincoln-Douglas, or custom rebuttal length).',
      'Click Start when the debater rises to speak; watch the status badge indicate Protected Time vs. Open POI Window.',
      'Listen for the single acoustic bell at 1:00 and 6:00 and the double gavel bell when speech time expires.',
    ],
    faqs: [
      {
        question: 'What is Protected Time in British Parliamentary and World Schools debate?',
        answer:
          'Protected Time covers the first and final minute of a speech, during which opposing teams cannot offer Points of Information.',
      },
      {
        question: 'When do the single and double acoustic bells ring during a 7-minute BP speech?',
        answer:
          'A single bell rings at 1:00 elapsed to open POIs, a single bell rings at 6:00 to close POIs, and a double bell sounds at 7:00.',
      },
      {
        question: 'How much grace time do adjudicators allow after the final double bell?',
        answer:
          'Judges typically grant a 15-second grace window (up to 7:15) for the speaker to finish their active sentence.',
      },
    ],
  },

  'sermon-timer': {
    slug: 'sermon-timer',
    useCasesIntro:
      'Engineered for church sanctuaries, pastors, and worship production teams needing distraction-free pulpit timing between services.',
    useCases: [
      'Sunday Morning Multi-Service Schedules: Keep 30- or 40-minute sermons on schedule so parking and children’s ministry align.',
      'Worship Transitions & Communion: Time 5-minute welcome announcements, prayer segments, and musical interludes.',
      'Pulpit Confidence Monitors: Display low-glare dark-mode digits that never cast harsh light onto the sanctuary stage.',
    ],
    howToUse: [
      'Select your sermon length (25, 35, or 45 minutes) or enter a custom duration matching your service order.',
      'Launch Fullscreen mode on the pulpit tablet or rear sanctuary confidence monitor with audio chimes muted.',
      'Follow the subtle amber 5-minute wrap-up cue and silent red overtime counter if the message extends past zero.',
    ],
    faqs: [
      {
        question: 'Why does the Sermon Timer use a dark matte display by default?',
        answer:
          'A pure dark background prevents bright monitor glare on the pastor’s face and blends into dimmed sanctuary lighting.',
      },
      {
        question: 'Does the Sermon Timer play any audible alarm that could interrupt prayer?',
        answer:
          'Silent mode can be toggled on so all wrap-up and completion cues are 100% visual with zero audible bells.',
      },
      {
        question: 'How does the timer help worship bands coordinate the closing song?',
        answer:
          'Both the pulpit and backstage monitor show the exact final 5-minute amber window so musicians know when to return to stage.',
      },
    ],
  },

  'classroom-timer': {
    slug: 'classroom-timer',
    useCasesIntro:
      'Designed for K–12 teachers and university instructors projecting timed activities, quizzes, and station rotations on a classroom smartboard.',
    useCases: [
      'Bell-Ringer Warmups: Run a 5-minute morning warmup on the whiteboard as students enter the room.',
      'Literacy & Lab Station Rotations: Time 12-minute small-group stations followed by a 2-minute cleanup transition.',
      'Independent Reading & Exit Tickets: Project a shrinking progress ring so students self-pace without asking how much time is left.',
    ],
    howToUse: [
      'Pick a classroom preset (Quick Quiz 5m, Group Work 10m, Silent Reading 15m) or enter custom minutes.',
      'Click Fullscreen (F) to project the extra-large digits and shrinking visual ring on your interactive whiteboard.',
      'Use +1 Min if students need extra work time, or toggle Mute for silent exam proctoring.',
    ],
    faqs: [
      {
        question: 'Why does combining a shrinking ring with digits help younger students?',
        answer:
          'Elementary students grasp a shrinking colored ring visually even before they are fluent at subtracting digital minutes.',
      },
      {
        question: 'Can I add 1 or 2 bonus minutes mid-activity without resetting the clock?',
        answer:
          'Yes, use the quick time adjustment controls to extend an active group discussion or quiz on the fly.',
      },
      {
        question: 'Can I silence the end bell during standardized testing or silent reading?',
        answer:
          'Yes, click the mute control (or press M) so the timer finishes with a visual flash only.',
      },
    ],
  },

  'webinar-timer': {
    slug: 'webinar-timer',
    useCasesIntro:
      'Built for Zoom hosts, livestream producers, and virtual panel moderators running multi-segment online events.',
    useCases: [
      '60-Minute Marketing Webinars: Structure 5m Welcome, 30m Demo, 15m Panel, and 10m Live Audience Q&A.',
      'Virtual Workshops & Bootcamps: Pace breakout exercises and live screen-share tutorials without running over the hour.',
      'OBS & StreamYard Broadcasts: Keep a compact run-of-show clock beside your webcam to hit exact segment marks.',
    ],
    howToUse: [
      'Define your webinar agenda segments (such as Intro, Keynote, Demo, and Q&A) and assign minutes to each.',
      'Click Start when your broadcast goes live to track both the current segment and overall webinar time remaining.',
      'Advance or reorder segments dynamically if a guest speaker finishes early.',
    ],
    faqs: [
      {
        question: 'How do I prevent a 60-minute webinar from running out of time for audience Q&A?',
        answer:
          'Create a dedicated 15-minute Q&A segment in the agenda queue so your presentation countdown alerts you at the 40-minute mark.',
      },
      {
        question: 'Will webinar attendees hear the segment transition chime on Zoom?',
        answer:
          'Attendees only hear browser audio if you enable "Share Computer Sound"; otherwise, chimes play privately in your headset.',
      },
      {
        question: 'Can I capture the Webinar Timer inside OBS Studio as a producer overlay?',
        answer:
          'Yes, add the browser window as a Window Capture source in OBS or vMix for your studio multiview monitor.',
      },
    ],
  },

  'event-countdown-timer': {
    slug: 'event-countdown-timer',
    useCasesIntro:
      'Counts down days, hours, minutes, and seconds to a specific calendar date and time for launches, conferences, and holidays.',
    useCases: [
      'Product & SaaS Launches: Display a live Days-Hours-Minutes-Seconds clock leading up to release hour.',
      'Conference Lobby Screens: Project a pre-show countdown before doors open or the opening keynote begins.',
      'New Year, Wedding & Holiday Milestones: Share a pre-configured countdown URL with guests across time zones.',
    ],
    howToUse: [
      'Enter your event title and pick the exact target calendar date, clock time, and regional time zone.',
      'Choose a display theme and click Start or Fullscreen to project the live Days, Hours, Minutes, and Seconds counter.',
      'Copy the shareable URL to send your pre-configured event countdown to teammates or attendees.',
    ],
    faqs: [
      {
        question: 'How does the Event Countdown handle viewers in different time zones?',
        answer:
          'When you anchor the target to a specific time zone, every viewer worldwide counts down to that exact simultaneous UTC moment.',
      },
      {
        question: 'Does the day counter account for 28-, 30-, and 31-day months and leap years?',
        answer:
          'Yes, the timer computes the exact difference between the current calendar timestamp and your target date.',
      },
      {
        question: 'What happens on screen when the event countdown reaches zero?',
        answer:
          'The digits land on 00:00:00:00 and trigger celebratory completion visuals along with your optional audio fanfare.',
      },
    ],
  },

  'countdown-timer': {
    slug: 'countdown-timer',
    useCasesIntro:
      'A general-purpose digital countdown clock with hours, minutes, seconds, quick presets, and auto-repeat loop mode for daily tasks.',
    useCases: [
      'Timeboxed Desk Sprints: Set 15-, 30-, or 45-minute countdowns for focused inbox zero, coding, or writing tasks.',
      'Home & Kitchen Reminders: Track laundry cycles, baking times, or power naps from your laptop tab.',
      'Recurring Interval Reminders: Enable Loop Mode to chime every 20 or 30 minutes for posture or hydration checks.',
    ],
    howToUse: [
      'Click a one-tap preset chip or type custom hours, minutes, and seconds up to 99:59:59.',
      'Press Start (or hit Spacebar) to begin the countdown, and toggle Loop Mode if you want automatic restarts.',
      'Press F for fullscreen visibility or M to mute the completion chime.',
    ],
    faqs: [
      {
        question: 'What is the maximum duration I can enter into the Countdown Timer?',
        answer:
          'You can configure any duration up to 99 hours, 59 minutes, and 59 seconds.',
      },
      {
        question: 'How does Loop Mode work when the countdown hits 00:00?',
        answer:
          'When Loop Mode is enabled, the timer sounds the completion chime at zero and immediately restarts the same duration.',
      },
      {
        question: 'Can I pause the countdown mid-session and resume from the exact second?',
        answer:
          'Yes, press Spacebar or click Pause at any moment to freeze the remaining milliseconds until you click Resume.',
      },
    ],
  },

  'stopwatch': {
    slug: 'stopwatch',
    useCasesIntro:
      'A millisecond-resolution online stopwatch with lap splits, fastest/slowest lap highlighting, and CSV export.',
    useCases: [
      'Track & Swimming Splits: Record individual 400m or 50m lap times alongside cumulative race time.',
      'Laboratory & Usability Benchmarking: Measure chemical reaction durations, page-load tests, or user task completion times.',
      'Speedrunning & Puzzle Solving: Track Rubik’s Cube solves or game segments with Spacebar start/stop control.',
    ],
    howToUse: [
      'Press Start (or Spacebar) to begin counting upward with millisecond precision.',
      'Click Lap (or press L) at the end of each segment to log both the individual lap delta and cumulative split time.',
      'Click Pause to stop timing, inspect highlighted fastest (green) and slowest (amber) laps, and export your table to CSV.',
    ],
    faqs: [
      {
        question: 'What is the difference between Lap Time and Total Split Time in the table?',
        answer:
          'Lap Time shows the duration of that single segment since your last lap press, while Total Split Time shows cumulative time from 00:00.00.',
      },
      {
        question: 'How does the stopwatch highlight my best and worst laps?',
        answer:
          'Once you record two or more laps, the fastest lap is automatically badged in green and the slowest lap in amber.',
      },
      {
        question: 'Can I download my recorded lap splits into Excel or Google Sheets?',
        answer:
          'Yes, click Export CSV or Copy Laps to transfer every lap number, segment time, and cumulative split into a spreadsheet.',
      },
    ],
  },

  'interval-timer': {
    slug: 'interval-timer',
    useCasesIntro:
      'A programmable work-and-rest round timer with warm-up, cool-down, set counters, and 3-2-1 audio transition cues.',
    useCases: [
      'HIIT & Circuit Training: Alternate 40 seconds of high-output exercise with 20 seconds of station recovery across 10 rounds.',
      'EMOM (Every Minute on the Minute) Sets: Set 60-second work intervals with 0-second rest for top-of-the-minute strength sets.',
      'Physical Therapy & Mobility Drills: Time 45-second bilateral stretches with 15-second side-switching buffers.',
    ],
    howToUse: [
      'Configure your Warm-up seconds, Work duration, Rest duration, Total Rounds, and Cool-down period.',
      'Click Start Workout; the screen turns green during Work phases and amber during Rest recovery phases.',
      'Follow the 3-2-1 countdown beeps before each phase transition so you are in position when the work bell rings.',
    ],
    faqs: [
      {
        question: 'How is the total workout duration calculated from my interval settings?',
        answer:
          'Total Time equals Warm-up + (Rounds × (Work + Rest)) minus the final skipped rest period, plus your Cool-down duration.',
      },
      {
        question: 'What work-to-rest ratio works best for general circuit conditioning?',
        answer:
          'A 2:1 ratio (such as 40s work / 20s rest) suits metabolic conditioning, while a 1:1 ratio (30s / 30s) suits strength circuits.',
      },
      {
        question: 'How do I configure an EMOM (Every Minute on the Minute) workout?',
        answer:
          'Set Work to 60 seconds, Rest to 0 seconds, and Rounds to your total minutes so a transition cue sounds at the top of each minute.',
      },
    ],
  },

  'pomodoro-timer': {
    slug: 'pomodoro-timer',
    useCasesIntro:
      'A structured focus timer based on the 25-minute work sprint and 5-minute break cycle with four-round long-break tracking.',
    useCases: [
      'Software Engineering & Debugging: Complete four 25-minute distraction-free coding sprints before taking a 15-minute walk.',
      'Academic Essay & Thesis Writing: Overcome blank-page procrastination by committing to a single 25-minute draft sprint.',
      'Exam Revision & Flashcard Drills: Alternate focused active-recall blocks with short 5-minute mental resets.',
    ],
    howToUse: [
      'Enter your current task name and select Focus (25m), Short Break (5m), or Long Break (15m), or customize the lengths.',
      'Click Start and work on that single task until the completion bell rings.',
      'Take a 5-minute break after each sprint; after completing 4 Pomodoros, switch to a 15-minute Long Break.',
    ],
    faqs: [
      {
        question: 'How long does one full 4-Pomodoro cycle take from start to finish?',
        answer:
          'Four 25-minute work sprints (100m) plus three 5-minute short breaks (15m) and one 15-minute long break total 130 minutes (2h 10m).',
      },
      {
        question: 'Can I customize the Pomodoro Timer to run 50-minute work blocks with 10-minute breaks?',
        answer:
          'Yes, open the timer settings to change Focus, Short Break, and Long Break durations to 50/10/20 or any custom ratio.',
      },
      {
        question: 'What should I do if a colleague or phone call interrupts an active Pomodoro?',
        answer:
          'Jot down non-urgent thoughts for your break, or pause and reset the sprint if a real interruption breaks your flow.',
      },
    ],
  },

  'online-alarm-clock': {
    slug: 'online-alarm-clock',
    useCasesIntro:
      'A time-of-day browser alarm clock with selectable acoustic chimes, sound testing, and 5-, 10-, or 15-minute snooze options.',
    useCases: [
      'Desk Power Naps & Hotel Stays: Set a backup wake-up alarm on your laptop when traveling across time zones.',
      'Hard-Stop Meeting Reminders: Trigger an audible alert at 2:55 PM so you never miss a 3:00 PM client call while deep in work.',
      'Shift & Break Transitions: Alert warehouse, studio, or front-desk staff at exact clock times throughout the day.',
    ],
    howToUse: [
      'Pick your target alarm hour and minute (in 12-hour AM/PM or 24-hour format) and choose an alarm tone.',
      'Click "Test Sound" to verify your speaker volume, then click "Set Alarm" and leave the browser tab open.',
      'When the alarm triggers, click Stop to dismiss or Snooze to pause for 5, 10, or 15 minutes.',
    ],
    faqs: [
      {
        question: 'How can I make sure my laptop speakers are loud enough before relying on the alarm?',
        answer:
          'Click the Test Sound button next to the tone selector to preview the exact chime at your current system volume.',
      },
      {
        question: 'What happens if I set an alarm time that has already passed today?',
        answer:
          'The Online Alarm Clock automatically schedules that time for tomorrow and shows the exact hours and minutes until it rings.',
      },
      {
        question: 'Will the browser alarm sound if I close my laptop lid or put the computer to sleep?',
        answer:
          'No—operating system sleep suspends browser audio, so keep your laptop open and awake while an alarm is armed.',
      },
    ],
  },

  'world-clock': {
    slug: 'world-clock',
    useCasesIntro:
      'A live multi-city world clock tracking local time, day/night status, UTC offsets, and Daylight Saving Time across global hubs.',
    useCases: [
      'Distributed Engineering & Support Teams: Pin San Francisco, New York, London, Berlin, Bengaluru, and Tokyo side by side.',
      'Global Financial & Forex Trading: Monitor market open and close hours across New York, London, Singapore, and Sydney.',
      'International Travel & Family Calls: Check local day/night solar indicators before calling overseas relatives or hotels.',
    ],
    howToUse: [
      'Search for any city, country, or IANA time zone and click to pin it to your personal World Clock dashboard.',
      'Toggle between 12-hour AM/PM and 24-hour military time or inspect analog and digital clock faces.',
      'Check each city card for its current UTC offset, calendar date, and Day/Night indicator.',
    ],
    faqs: [
      {
        question: 'Why do some cities show a +1 Day or -1 Day badge on the World Clock?',
        answer:
          'When a city has already crossed midnight relative to your local time zone, the badge shows that it is on the next or previous calendar date.',
      },
      {
        question: 'Does the World Clock support 30-minute and 45-minute fractional UTC offsets?',
        answer:
          'Yes, regions like India (UTC+5:30), Adelaide (UTC+9:30/+10:30), and Nepal (UTC+5:45) display exact minute offsets.',
      },
      {
        question: 'Do the city clocks adjust automatically when Daylight Saving Time starts or ends?',
        answer:
          'Yes, every city card queries the IANA time-zone rules for the current date and updates its UTC offset automatically.',
      },
    ],
  },

  'time-zone-converter': {
    slug: 'time-zone-converter',
    useCasesIntro:
      'An interactive 24-hour timeline converter for translating a specific date and clock time across multiple global cities at once.',
    useCases: [
      'Global Webinar & Product Launch Scheduling: Convert 10:00 AM PT into EST, GMT, CET, IST, and JST in one view.',
      'Cross-Border Client Proposals: Verify the exact local date and hour of a contract deadline across three continents.',
      'Flight & Layover Coordination: Compare departure and arrival local times across origin and destination cities.',
    ],
    howToUse: [
      'Add two or more cities or time zones to your comparison list and pick your target calendar date.',
      'Drag the 24-hour timeline slider or enter a specific time in your primary city.',
      'Read the converted local time and date for every location and click Copy to paste the multi-zone schedule into Slack or email.',
    ],
    faqs: [
      {
        question: 'Why does the time difference between New York and London shrink from 5 hours to 4 hours in March?',
        answer:
          'The US starts Daylight Saving Time on the second Sunday of March while the UK starts on the last Sunday of March, creating a 3-week 4-hour gap.',
      },
      {
        question: 'Why should I pick the exact future date when converting a meeting time next month?',
        answer:
          'Selecting the actual meeting date ensures the converter applies any Daylight Saving Time switch that occurs between today and that date.',
      },
      {
        question: 'How does the converter indicate when a time crosses midnight in another city?',
        answer:
          'Each city row displays the full calendar date and day of the week so overnight date rollovers are immediately visible.',
      },
    ],
  },

  'time-difference-calculator': {
    slug: 'time-difference-calculator',
    useCasesIntro:
      'Computes the exact hour and minute offset between any two cities and highlights their overlapping 9:00 AM–5:00 PM business hours.',
    useCases: [
      'Bilateral Client & Partner Calls: See how many hours ahead or behind London is relative to Chicago or Singapore.',
      'Remote Hiring & Core-Hours Planning: Measure exact working-hour overlap between a candidate’s city and headquarters.',
      'Long-Distance Travel Jet-Lag Prep: Check the exact hour shift and direction (+ ahead or − behind) before flying.',
    ],
    howToUse: [
      'Select City A (Origin) and City B (Destination) and optionally choose a future calendar date.',
      'Read the exact hour and minute difference and see which city is ahead or behind.',
      'Review the Business Hours Overlap bar to find shared 9:00 AM–5:00 PM working windows.',
    ],
    faqs: [
      {
        question: 'How is the hour difference between two UTC offsets calculated?',
        answer:
          'Subtract Location A’s UTC offset from Location B’s offset—for example, Tokyo (UTC+9) minus New York (UTC-5) equals 14 hours ahead.',
      },
      {
        question: 'What if two cities are 12 hours apart and have zero 9-to-5 business overlap?',
        answer:
          'The calculator highlights early-morning (7:00–9:00 AM) and early-evening (5:00–8:00 PM) shoulder slots so neither side takes an overnight call.',
      },
      {
        question: 'Can two cities have a half-hour or 45-minute time difference?',
        answer:
          'Yes, comparing a standard integer zone like London (UTC+0) with Mumbai (UTC+5:30) or Kathmandu (UTC+5:45) yields a 30- or 45-minute offset.',
      },
    ],
  },

  'meeting-planner': {
    slug: 'meeting-planner',
    useCasesIntro:
      'A color-coded 24-hour availability matrix that finds the fairest international meeting slot across multiple participant cities.',
    useCases: [
      'Global All-Hands & Town Halls: Find a 1-hour slot where Americas, EMEA, and APAC teammates avoid overnight hours.',
      'Cross-Timezone Sprint Ceremonies: Coordinate daily standups between US East Coast, UK, Germany, and India.',
      'Multi-Party Board & Advisory Calls: Compare 4 to 6 executive locations and copy a formatted multi-zone invite block.',
    ],
    howToUse: [
      'Add each participant city to the planner and select your meeting date.',
      'Scan the 24-hour grid where Green marks work hours (8am–6pm), Yellow marks shoulder hours, and Red marks sleep hours.',
      'Click the column with the strongest green overlap to inspect local times and copy a ready-to-send meeting summary.',
    ],
    faqs: [
      {
        question: 'What do the Green, Yellow, and Red cells mean in the World Meeting Planner grid?',
        answer:
          'Green represents standard working hours (08:00–18:00), Yellow represents flexible morning/evening shoulder hours, and Red marks overnight sleep (21:00–07:00).',
      },
      {
        question: 'What is the best overlapping meeting window for New York, London, and Bengaluru?',
        answer:
          'Between 13:30 and 15:30 UTC—which corresponds to 8:30–10:30 AM in New York, 1:30–3:30 PM in London, and 7:00–9:00 PM in Bengaluru.',
      },
      {
        question: 'How should distributed teams handle 3-continent meetings when no all-green slot exists?',
        answer:
          'Rotate between two alternating shoulder-hour slots every other week so the early-morning or evening burden is shared fairly.',
      },
    ],
  },

  'unix-timestamp-converter': {
    slug: 'unix-timestamp-converter',
    useCasesIntro:
      'A developer utility for converting Unix epoch seconds, milliseconds, and microseconds into UTC, local time, and ISO-8601 strings.',
    useCases: [
      'API & JWT Token Debugging: Decode `iat` and `exp` epoch claims from JSON Web Tokens to verify expiration times.',
      'Server Log & Database Forensics: Translate 10-digit or 13-digit database timestamps into human-readable UTC and local dates.',
      'Cron & Scheduled Job Setup: Convert a future calendar date and time into an exact Unix epoch integer for scripts.',
    ],
    howToUse: [
      'Paste any 10-digit (seconds), 13-digit (milliseconds), or 16-digit (microseconds) Unix timestamp into the input field.',
      'Read the decoded UTC date, local time zone date, ISO-8601 string, and relative time ("3 hours ago").',
      'Or enter a human-readable year, month, day, and time to generate the corresponding Unix epoch timestamp.',
    ],
    faqs: [
      {
        question: 'How does the converter know whether my timestamp is in seconds or milliseconds?',
        answer:
          'It checks the digit length automatically: 10 digits represent epoch seconds (e.g. 1767225600), while 13 digits represent milliseconds.',
      },
      {
        question: 'Does a Unix epoch timestamp change based on which time zone a server is in?',
        answer:
          'No, Unix time always counts elapsed seconds since 1970-01-01T00:00:00Z in UTC regardless of local server time zone.',
      },
      {
        question: 'What is the 32-bit Year 2038 Unix timestamp overflow limit?',
        answer:
          'Signed 32-bit integers max out at 2,147,483,647 seconds (2038-01-19 03:14:07 UTC), whereas 64-bit systems and this tool support dates centuries ahead.',
      },
    ],
  },

  'visual-timer': {
    slug: 'visual-timer',
    useCasesIntro:
      'A multi-mode visual countdown timer featuring Circular Ring, Linear Bar, Hourglass, Traffic Light, Segmented Arc, and Sand Dune views.',
    useCases: [
      'Neurodivergent & ADHD Time Blindness Support: Turn abstract minutes into a shrinking colored wedge visible in peripheral vision.',
      'Elementary Classroom Transitions: Use Traffic Light or Shrinking Ring mode to signal cleanup and station changes.',
      'Design Sprints & Workshop Facilitations: Project a silent visual timer during Crazy 8s sketching or sticky-note voting.',
    ],
    howToUse: [
      'Select any of the 6 visual modes (Circular, Linear, Hourglass, Traffic Light, Segmented, or Sand Dune) and pick a color theme.',
      'Choose a quick preset duration or enter custom minutes and seconds.',
      'Click Start and press F for fullscreen; you can switch visual modes mid-countdown without losing your remaining time.',
    ],
    faqs: [
      {
        question: 'Can I switch between the 6 visual styles while a countdown is already running?',
        answer:
          'Yes, clicking Circular, Linear, Hourglass, Traffic Light, Segmented, or Sand Dune updates the visualization live without resetting the clock.',
      },
      {
        question: 'How does the Traffic Light mode work inside the Visual Timer?',
        answer:
          'It illuminates the green light during the main work period, switches to yellow for the wrap-up threshold, and turns red in the final stretch.',
      },
      {
        question: 'Can I hide the digital numbers so learners focus only on the shrinking visual shape?',
        answer:
          'Yes, toggle the numeric readout off in the appearance controls for a pure non-numeric visual countdown.',
      },
    ],
  },

  'multi-stopwatch': {
    slug: 'multi-stopwatch',
    useCasesIntro:
      'Runs multiple independent stopwatches on one screen for track heats, swim lanes, relay handoffs, and parallel lab trials.',
    useCases: [
      'Track & Cross-Country Heats: Click "Start All" on the starter gun and tap individual lane buttons as runners cross the line.',
      'Relay Race Handoffs: Enable Relay Mode so stopping Runner 1 automatically starts Runner 2 at the exact same millisecond.',
      'Multi-Sample Lab & Culinary Testing: Track up to a dozen simultaneous chemical samples or test stations and export CSV results.',
    ],
    howToUse: [
      'Add participant or lane names to each stopwatch card, or use the pre-loaded lanes.',
      'Click "Start All" for a synchronized mass start, or start, lap, and stop each lane card independently.',
      'Toggle Relay Mode for sequential handoffs, then click Export CSV to download ranked results and lap splits.',
    ],
    faqs: [
      {
        question: 'How does "Start All" avoid human button-press lag across lanes?',
        answer:
          'Clicking Start All assigns the exact same start timestamp to every active stopwatch card simultaneously.',
      },
      {
        question: 'What happens when I enable Relay Mode in the Multi Stopwatch?',
        answer:
          'In Relay Mode, clicking Stop on Lane 1 immediately starts Lane 2 on that exact millisecond so handoff transitions have zero gap.',
      },
      {
        question: 'What columns are included when I click Export CSV?',
        answer:
          'The CSV file exports each lane’s rank, participant label, final elapsed time, lap count, and fastest lap split.',
      },
    ],
  },

  'embed-timer': {
    slug: 'embed-timer',
    useCasesIntro:
      'Generates customizable, sandboxed HTML iframe countdown, visual timer, and stopwatch widgets for Notion, Canvas, Moodle, and websites.',
    useCases: [
      'Notion Study & Project Dashboards: Embed a themed Pomodoro or visual countdown directly inside your Notion workspace.',
      'Canvas, Moodle & Google Sites Courses: Place a live quiz or assignment practice timer inside an LMS lesson page.',
      'Event & Hackathon Landing Pages: Add a responsive countdown widget to WordPress, Webflow, or internal wiki docs.',
    ],
    howToUse: [
      'Configure your widget mode (Countdown, Visual Timer, or Stopwatch), default duration, custom heading, and color theme.',
      'Test your widget inside the live interactive preview pane to verify its layout and controls.',
      'Click "Copy Embed Code" for HTML/LMS pages or copy the direct widget URL for Notion `/embed` blocks.',
    ],
    faqs: [
      {
        question: 'How do I embed this timer inside a Notion page?',
        answer:
          'Copy the direct widget URL from the generator, type /embed on your Notion page, paste the link, and click Embed.',
      },
      {
        question: 'Are the duration, title, and color theme saved inside the iframe code?',
        answer:
          'Yes, your custom seconds, label, mode, and color theme are encoded directly in the iframe URL query parameters.',
      },
      {
        question: 'Does the embedded timer widget load any third-party ad scripts or cookies?',
        answer:
          'No, the `/embed-widget` route renders a clean, self-contained timer inside a sandboxed iframe with zero tracking scripts.',
      },
    ],
  },

  'random-name-picker': {
    slug: 'random-name-picker',
    useCasesIntro:
      'Draws a random participant name from any roster using an unbiased shuffle with optional winner removal and draw history.',
    useCases: [
      'Equitable Classroom Cold-Calling: Enable "Remove winner after draw" so every student answers once before anyone repeats.',
      'Daily Standup Speaker Order: Pick who gives their team update first and keep moving through the remaining roster.',
      'Webinar Giveaways & Raffles: Paste attendee names from a spreadsheet and draw prize winners live on screen.',
    ],
    howToUse: [
      'Paste or type your list of names (one name per line) or upload a `.txt` or `.csv` roster file.',
      'Check "Remove winner after draw" if you want drawn names moved out of the active pool into Draw History.',
      'Click "Pick a Random Name" to select a winner and click "Reset Pool" when you want to restore all names.',
    ],
    faqs: [
      {
        question: 'How does "Remove winner after draw" keep classroom participation fair?',
        answer:
          'Each selected name is moved to the Draw History panel so every remaining student is called before the roster resets.',
      },
      {
        question: 'Can I paste a column of names straight from Excel or Google Sheets?',
        answer:
          'Yes, copying a vertical column from any spreadsheet and pasting it into the text box puts each name on its own line automatically.',
      },
      {
        question: 'Are student or employee rosters uploaded to a remote server?',
        answer:
          'No, all name lists and random selections run 100% in your local browser memory and never leave your device.',
      },
    ],
  },

  'random-group-generator': {
    slug: 'random-group-generator',
    useCasesIntro:
      'Splits any class roster or team list into balanced random groups by total number of teams or maximum members per team.',
    useCases: [
      'Classroom Lab & Project Teams: Divide 28 students into 7 balanced lab tables of 4 in one click.',
      'Hackathon & Workshop Breakouts: Randomize cross-functional participants into small discussion squads.',
      'Intramural Sports & Trivia Nights: Shuffle players into fair, even-sized teams and export the roster to CSV.',
    ],
    howToUse: [
      'Paste your participant names (one per line) and choose whether to split by Number of Groups or Max People per Group.',
      'Click "Shuffle & Generate Groups" to randomize the roster and deal participants evenly across teams.',
      'Click Copy Teams or Export CSV to share or print the generated team assignments.',
    ],
    faqs: [
      {
        question: 'How does the generator avoid leaving a group with only 1 person when numbers do not divide evenly?',
        answer:
          'Remainders are dealt round-robin across the groups so team sizes never differ by more than a single person.',
      },
      {
        question: 'What is the difference between splitting by "Number of Groups" and "Max People per Group"?',
        answer:
          'With 20 people, choosing 4 Groups creates 4 teams of 5, while choosing Max 3 per Group creates 7 teams (six of 3 and one of 2).',
      },
      {
        question: 'Can I reshuffle the same roster without retyping all the names?',
        answer:
          'Yes, click "Shuffle & Generate Groups" as many times as you like to generate a fresh random team distribution.',
      },
    ],
  },

  'classroom-noise-meter': {
    slug: 'classroom-noise-meter',
    useCasesIntro:
      'Monitors live ambient room volume through your device microphone and displays a color-coded 0–100 visual bar for student self-regulation.',
    useCases: [
      'Silent Reading & Exam Proctoring: Set the threshold slider to 30 so students see immediately if whispers rise.',
      'Partner & Small-Group Work: Set the threshold to 60 so productive table talk stays in the green and amber zones.',
      'Elementary Transitions & Line-Up: Gamify quiet classroom cleanups by challenging the class to keep the bar green.',
    ],
    howToUse: [
      'Click "Start Microphone Monitoring" and select Allow when your browser asks for microphone access.',
      'Drag the Maximum Acceptable Level slider (0–100) to match your current classroom activity.',
      'Project the live 20-segment volume meter on your whiteboard so students see green (quiet), amber (caution), and red (too loud).',
    ],
    faqs: [
      {
        question: 'Is any classroom voice or audio ever recorded or saved by the Noise Meter?',
        answer:
          'Never—the browser Web Audio API calculates instantaneous volume amplitude in memory and discards the signal immediately.',
      },
      {
        question: 'Why does the meter use a 0–100 relative classroom scale instead of calibrated decibels (dB)?',
        answer:
          'Laptop and tablet microphones have uncalibrated hardware gain, so a 0–100 adjustable scale lets you set a practical threshold for your room.',
      },
      {
        question: 'What threshold setting works best for silent reading versus group projects?',
        answer:
          'Set the threshold around 25–35 for silent reading or tests, and 55–70 for collaborative table discussions.',
      },
    ],
  },

  'speech-time-calculator': {
    slug: 'speech-time-calculator',
    useCasesIntro:
      'Converts speech scripts or word counts into exact speaking minutes and seconds across slow, conversational, and fast WPM paces.',
    useCases: [
      'Keynote & TED Talk Script Editing: Check whether your 1,950-word draft fits inside a strict 15-minute slot at 130 WPM.',
      'Wedding Toasts & Graduation Speeches: Trim a 5-minute speech script to ~650 words so delivery feels unhurried.',
      'Video Essay, Podcast & Voiceover Scripts: Estimate recording runtime including slide or dramatic pause buffers.',
    ],
    howToUse: [
      'Paste your full speech script into the text area (or enter a target word count) to see live word and sentence totals.',
      'Select your delivery pace—Slow (110 WPM), Conversational (130 WPM), or Fast Keynote (150 WPM)—or adjust the custom WPM slider.',
      'Review your estimated speaking time and click "Practice with Timer" to rehearse your script against a live countdown.',
    ],
    faqs: [
      {
        question: 'How many words should a 5-minute or 10-minute presentation script be?',
        answer:
          'At a natural 130 words-per-minute speaking pace, a 5-minute talk is about 650 words and a 10-minute talk is about 1,300 words.',
      },
      {
        question: 'Why should presenters aim for 120–130 WPM when presenting with slide decks?',
        answer:
          'Pausing 2 to 3 seconds whenever a new slide appears lowers your effective speaking rate and helps audiences absorb visual data.',
      },
      {
        question: 'How is estimated speaking duration calculated from word count?',
        answer:
          'Speaking Minutes equals Total Words divided by Words Per Minute (WPM), plus any pause buffer seconds you add.',
      },
    ],
  },

  'time-duration-calculator': {
    slug: 'time-duration-calculator',
    useCasesIntro:
      'Calculates the exact elapsed hours, minutes, seconds, total minutes, and decimal hours between a start time and end time.',
    useCases: [
      'Overnight Shift & Nursing Logs: Compute exact hours between a 9:45 PM clock-in and a 6:15 AM clock-out across midnight.',
      'Freelance & Legal Client Billing: Convert start-to-end work blocks into exact decimal hours (e.g., 3.75 hours) for invoices.',
      'Aviation, Trucking & Event Logs: Measure multi-day elapsed duration between departure and arrival timestamps.',
    ],
    howToUse: [
      'Enter your Start Time and End Time (and optional Start/End calendar dates for multi-day spans).',
      'Enter any unpaid break minutes you want deducted from the shift.',
      'Read the exact net duration in HH:MM:SS, total minutes, and payroll decimal hours.',
    ],
    faqs: [
      {
        question: 'How does the Time Duration Calculator handle shifts that cross midnight?',
        answer:
          'If the End Time is earlier than the Start Time (such as 22:00 to 06:30), it automatically counts forward across midnight (8h 30m).',
      },
      {
        question: 'Why does 7 hours and 45 minutes equal 7.75 decimal hours?',
        answer:
          'Decimal hours divide remaining minutes by 60 (45 ÷ 60 = 0.75), giving 7.75 hours for payroll multiplication.',
      },
      {
        question: 'Can I calculate elapsed hours across multiple calendar days?',
        answer:
          'Yes, enable the Start Date and End Date fields to compute total hours and minutes across multi-day spans.',
      },
    ],
  },

  'time-addition-calculator': {
    slug: 'time-addition-calculator',
    useCasesIntro:
      'Sums or subtracts multiple rows of hours, minutes, and seconds with automatic base-60 rollover and decimal-hour output.',
    useCases: [
      'Video & Podcast Post-Production: Add 12 scene or chapter lengths (MM:SS) to find the exact final episode runtime.',
      'Pilot & Driver Logbook Totals: Sum dozens of flight legs or driving segments without manual base-60 arithmetic errors.',
      'Project Task Auditing: Add billable task durations and subtract non-billable pause rows in a single list.',
    ],
    howToUse: [
      'For each row, choose + Add or − Subtract and enter the hours, minutes, and seconds.',
      'Click "+ Add Row" to append as many time segments as your log or playlist requires.',
      'Copy the cumulative total in standard HH:MM:SS, total minutes, or decimal hours.',
    ],
    faqs: [
      {
        question: 'How does base-60 rollover work when adding minutes and seconds together?',
        answer:
          'Every 60 accumulated seconds carry over as +1 minute, and every 60 accumulated minutes carry over as +1 hour.',
      },
      {
        question: 'Can I type more than 59 minutes (like 125 minutes) into a single row?',
        answer:
          'Yes, typing 125 into the minutes field is automatically normalized into 2 hours and 5 minutes in the total.',
      },
      {
        question: 'Can I mix addition rows and subtraction rows in the same calculation?',
        answer:
          'Yes, toggle any individual row from + Add to − Subtract to deduct breaks, trims, or time credits.',
      },
    ],
  },

  'time-card-calculator': {
    slug: 'time-card-calculator',
    useCasesIntro:
      'Computes daily and weekly net work hours from Monday–Sunday clock-in/clock-out times and unpaid meal breaks with CSV export.',
    useCases: [
      'Weekly Hourly Payroll Prep: Convert a week of punch-in and punch-out times into net regular and decimal hours.',
      'Contractor & Agency Timesheets: Deduct 30- or 45-minute lunch breaks per day and export a clean CSV invoice attachment.',
      'Small Business Shift Auditing: Verify whether an employee’s weekly schedule stayed within 40 regular hours.',
    ],
    howToUse: [
      'Toggle on each day worked and enter the daily Start Time, End Time, and unpaid Break minutes.',
      'Inspect each row’s net hours in both standard HH:MM and payroll decimal format.',
      'Review the weekly summary total at the bottom and click "Export Time Card CSV" to save your timesheet.',
    ],
    faqs: [
      {
        question: 'Why do payroll systems require decimal hours (like 8.50) instead of hours and minutes (8:30)?',
        answer:
          'Multiplying an hourly pay rate requires base-10 decimals where 30 minutes equals 0.50 hours (30 ÷ 60) rather than 0.30.',
      },
      {
        question: 'How are unpaid lunch breaks deducted on each row of the Time Card Calculator?',
        answer:
          'The calculator finds the gross minutes between Start Time and End Time, subtracts your break minutes, and converts the net total.',
      },
      {
        question: 'Does the weekly timesheet handle an overnight shift that ends the next morning?',
        answer:
          'Yes, entering a clock-out time earlier than your clock-in time automatically computes the overnight shift across midnight.',
      },
    ],
  },

  'overtime-calculator': {
    slug: 'overtime-calculator',
    useCasesIntro:
      'Splits total hours worked into regular hours and overtime hours and estimates gross pay using configurable thresholds and multipliers.',
    useCases: [
      'Weekly 40-Hour Overtime Estimates: Calculate 1.5x time-and-a-half pay when a weekly timesheet reaches 46.5 hours.',
      'Daily 8-Hour or Double-Time Contracts: Switch the threshold to 8 daily hours or test a 2.0x holiday pay multiplier.',
      'Shift Differential & Budget Forecasting: Compare gross labor cost before approving extra weekend shifts.',
    ],
    howToUse: [
      'Enter your Total Hours Worked and your Overtime Threshold (such as 40 weekly hours or 8 daily hours).',
      'Select your Overtime Multiplier (1.5x, 2.0x, or custom) and enter your Base Hourly Rate.',
      'Read the breakdown of Regular Hours, Overtime Hours, Regular Pay, Overtime Pay, and Total Gross Pay.',
    ],
    faqs: [
      {
        question: 'How is 1.5x "time and a half" overtime pay calculated?',
        answer:
          'Multiply your base hourly rate by 1.5 to get your overtime hourly rate, then multiply by the hours worked above your threshold.',
      },
      {
        question: 'Can I change the overtime threshold from 40 weekly hours to 8 daily hours?',
        answer:
          'Yes, edit the Overtime Threshold input to any hour value required by your workplace contract or local rules.',
      },
      {
        question: 'Does this calculator deduct payroll taxes or union withholdings?',
        answer:
          'No, it calculates pre-tax gross regular and overtime pay; verify tax withholdings and labor rules with your payroll provider.',
      },
    ],
  },

  'kitchen-timer': {
    slug: 'kitchen-timer',
    useCasesIntro:
      'A multi-burner cooking dashboard that lets you run, label, and monitor several independent dish countdowns at the same time.',
    useCases: [
      'Multi-Dish Holiday & Sunday Roasts: Track roasting poultry, boiling potatoes, oven vegetables, and resting gravy on one screen.',
      'Meal Prep & Batch Baking: Run parallel oven rack timers with custom labels like "Top Rack Cookies" and "Sourdough Proof".',
      'Stovetop Simmering & Pasta Stations: Launch one-click presets for pasta, rice, steaming greens, and broiling.',
    ],
    howToUse: [
      'Click any culinary preset chip or type a custom Dish Name and duration to add a new burner timer card.',
      'Start, pause, or add +1 minute to each station card independently as you cook.',
      'When a dish hits 00:00, its card flashes red and chimes so you know immediately which pot or oven rack is ready.',
    ],
    faqs: [
      {
        question: 'How many simultaneous burner or oven timers can I run at once?',
        answer:
          'You can add and run as many labeled station cards as your meal requires, each with independent controls.',
      },
      {
        question: 'How do I tell which dish finished if two timers are close together?',
        answer:
          'Each timer card displays your custom dish title and highlights in bright red when its specific countdown reaches 00:00.',
      },
      {
        question: 'Can I add 1 extra minute to a baking timer if the crust needs more browning?',
        answer:
          'Yes, click the +1m button on that specific dish card to extend its countdown immediately.',
      },
    ],
  },

  'egg-timer': {
    slug: 'egg-timer',
    useCasesIntro:
      'A boiled-egg countdown timer calibrated for soft-runny dippy eggs, jammy ramen yolks, medium breakfast eggs, and firm hard-boiled eggs.',
    useCases: [
      'Soft-Boiled Dippy Eggs (4m 30s): Time runny yolks with just-set whites for toast soldiers.',
      'Jammy Ramen & Salad Eggs (6m 30s): Hit the exact custardy yolk texture for noodle bowls and grain salads.',
      'Hard-Boiled Meal Prep & Deviled Eggs (10m 30s): Boil firm yolks without the chalky gray-green sulfur ring.',
    ],
    howToUse: [
      'Bring a pot of water to a gentle simmer before lowering refrigerator-cold large eggs into the water.',
      'Select Soft (4:30), Jammy (6:30), Medium (8:00), or Hard Boiled (10:30) and click Start immediately.',
      'When the chime sounds, transfer the eggs straight into an ice-water bath for 2 minutes to stop carryover cooking.',
    ],
    faqs: [
      {
        question: 'Why should I lower eggs into already-simmering water instead of cold water?',
        answer:
          'Different stoves take anywhere from 4 to 12 minutes to boil cold water; starting in simmering water makes timing repeatable.',
      },
      {
        question: 'Why is an ice-water bath essential as soon as the Egg Timer rings?',
        answer:
          'Residual heat inside the shell keeps cooking the yolk for another minute unless cold water halts it immediately.',
      },
      {
        question: 'How much time should I add for Extra-Large (XL) eggs or high altitudes?',
        answer:
          'Add 30 to 45 seconds for Extra-Large eggs or when boiling water above 5,000 feet (1,500 meters) elevation.',
      },
    ],
  },

  'tea-timer': {
    slug: 'tea-timer',
    useCasesIntro:
      'A specialty tea steeping timer pairing exact infusion countdowns with recommended water temperatures for Green, White, Oolong, Black, and Herbal teas.',
    useCases: [
      'Delicate Japanese & Chinese Green Teas (1m 30s–2m): Steep at 75–80°C (170–175°F) so catechins stay sweet rather than bitter.',
      'Loose-Leaf Oolong & White Infusions (3m): Track multiple gongfu or western re-steepings with +30s increments.',
      'Full-Bodied Black & Herbal Tisanes (4m–5m): Extract full aroma from Assam, Earl Grey, chamomile, or peppermint at 95–100°C.',
    ],
    howToUse: [
      'Select your tea variety preset (Green, White, Oolong, Black, or Herbal) to load its target steep time and temperature guide.',
      'Click Start the moment hot water pours over your tea leaves or infuser basket.',
      'Remove the leaves as soon as the chime rings to prevent bitter tannin over-extraction.',
    ],
    faqs: [
      {
        question: 'Why does green tea turn bitter if steeped for 4 minutes like black tea?',
        answer:
          'Unoxidized green tea leaves release bitter tannins rapidly when steeped past 2 minutes or brewed with boiling 100°C water.',
      },
      {
        question: 'Does steeping black tea longer than 5 minutes give you much more caffeine?',
        answer:
          'Most caffeine infuses within the first 2 to 3 minutes; steeping past 5 minutes mainly adds dry, astringent polyphenols.',
      },
      {
        question: 'How should I adjust the Tea Timer when re-steeping loose-leaf oolong or green tea?',
        answer:
          'Add 30 to 45 seconds to each subsequent infusion to draw out deeper flavor notes from the opened leaves.',
      },
    ],
  },

  'coffee-timer': {
    slug: 'coffee-timer',
    useCasesIntro:
      'A specialty coffee extraction timer with presets for V60 Pour-Over bloom and drawdown, French Press, AeroPress, and Espresso shots.',
    useCases: [
      'V60 & Kalita Pour-Over Brewing: Time the 45-second CO2 bloom phase and 3:00 total drawdown target.',
      'French Press Immersion (4:00): Steep coarse grounds evenly before plunging and decanting.',
      'Espresso & AeroPress Dial-In: Measure 28-second double espresso shots or 1:45 AeroPress inversions.',
    ],
    howToUse: [
      'Choose your brewing method preset (Pour-Over Bloom 45s, V60 Total 3:00, French Press 4:00, AeroPress 1:45, or Espresso 28s).',
      'Press Start simultaneously with your first pour of water or espresso pump engagement.',
      'Use the elapsed/remaining time to dial in your burr grind size if extraction finishes too fast or too slow.',
    ],
    faqs: [
      {
        question: 'Why is the 30-to-45 second bloom phase important in pour-over coffee?',
        answer:
          'Wetting fresh grounds releases trapped roasting CO2 gas; without blooming, escaping gas bubbles repel water and cause sour channeling.',
      },
      {
        question: 'What should I adjust if my V60 pour-over finishes draining in under 2 minutes?',
        answer:
          'If drawdown finishes too fast and tastes sour or thin, adjust your burr grinder slightly finer to slow water flow.',
      },
      {
        question: 'What is the standard coffee-to-water weight ratio for pour-over and French press?',
        answer:
          'A 1:16 ratio—such as 15 grams of coffee to 240 grams of water, or 30 grams to 480 grams—produces a balanced cup.',
      },
    ],
  },

  'study-timer': {
    slug: 'study-timer',
    useCasesIntro:
      'An academic revision clock supporting 25/5, 45/10, 50/10 clock-hour blocks, and 90/20 ultradian exam-prep intervals.',
    useCases: [
      '50/10 Full-Day Exam Revision: Study for 50 minutes and rest for 10 minutes so every cycle aligns cleanly with the top of the hour.',
      '90-Minute Practice Papers & Coding Labs: Simulate full university lecture or mock-exam endurance blocks.',
      'Active Recall & Spaced Repetition: Time 45-minute problem-set blocks before reviewing errors during the 10-minute break.',
    ],
    howToUse: [
      'Pick an academic interval preset (25m/5m, 45m/10m, 50m/10m, or 90m/20m) or enter custom study minutes.',
      'Put your phone out of reach, click Start, and focus on one subject until the completion chime.',
      'Switch to the paired break interval to stretch and rest your eyes before starting your next study block.',
    ],
    faqs: [
      {
        question: 'When should I choose a 50/10 study block over a 25/5 Pomodoro?',
        answer:
          'Use 25/5 when overcoming initial procrastination or drilling flashcards, and 50/10 for deep reading, math proofs, or essays.',
      },
      {
        question: 'Why does the 90-minute study preset pair with a 20-minute break?',
        answer:
          'Human alertness naturally cycles in ~90-minute ultradian rhythms, after which a 20-minute walk or rest restores concentration.',
      },
      {
        question: 'Can I run the Study Timer silently inside a quiet university library?',
        answer:
          'Yes, toggle the sound button off so completion is signaled visually on screen without any audible chime.',
      },
    ],
  },

  'reading-timer': {
    slug: 'reading-timer',
    useCasesIntro:
      'A silent book-reading countdown timer that tracks pages read and calculates your personal pages-per-hour reading pace.',
    useCases: [
      'Daily 20- or 30-Minute Reading Habits: Build a consistent evening book routine without checking your phone.',
      'School & Summer Reading Logs: Time required 15- or 30-minute elementary and middle-school homework reading blocks.',
      'Textbook & Book Club Pacing: Measure your pages-per-hour speed to estimate how many sessions a 350-page book will take.',
    ],
    howToUse: [
      'Select a 15-, 30-, 45-, or 60-minute reading session preset and click Start.',
      'Read uninterrupted until the gentle completion chime sounds.',
      'Enter your starting and ending page numbers (or total pages read) to compute your Pages Per Hour pace.',
    ],
    faqs: [
      {
        question: 'How does the Reading Timer calculate my Pages Per Hour speed?',
        answer:
          'It divides the pages you completed by your session minutes and multiplies by 60 (for example, 16 pages in 30m = 32 pages/hour).',
      },
      {
        question: 'How many daily 30-minute sessions does it take to read a 300-page book?',
        answer:
          'At a typical pace of 30 pages per hour (15 pages per 30-minute session), a 300-page book takes 20 sessions (10 hours).',
      },
      {
        question: 'Does the Reading Timer make any ticking noise while I am reading?',
        answer:
          'No, it counts down in complete silence and only plays a soft chime when your session reaches 00:00.',
      },
    ],
  },

  'break-timer': {
    slug: 'break-timer',
    useCasesIntro:
      'A dedicated 5-, 10-, 15-, and 30-minute intermission and work-break countdown that keeps restorative pauses intentional and bounded.',
    useCases: [
      'Conference & Workshop Intermissions: Project a 15-minute coffee break countdown on the main room screen so attendees return on time.',
      'Remote Work Desk Breaks: Step away for a 10-minute walk or stretch knowing an audible chime will call you back.',
      'Lunch & Shift Rest Periods: Track exact 30-minute or 60-minute meal breaks without overshooting your return time.',
    ],
    howToUse: [
      'Click a one-tap preset (5m Micro-Break, 10m Stretch, 15m Coffee Break, or 30m Lunch) or enter custom minutes.',
      'Press Start and step away from your keyboard, or press F to project the countdown on a shared room display.',
      'Return to your desk or reconvene your group when the acoustic completion bell rings.',
    ],
    faqs: [
      {
        question: 'Why is a dedicated Break Timer useful during live workshops and classes?',
        answer:
          'Displaying a giant ticking break countdown on the projector eliminates ambiguity and gets participants seated on time.',
      },
      {
        question: 'What is the most restorative way to spend a 5- to 10-minute desk break?',
        answer:
          'Stand up, drink water, stretch your neck and hips, and look out a window rather than scrolling on a phone screen.',
      },
      {
        question: 'Can I add 5 extra minutes if a workshop intermission line is running long?',
        answer:
          'Yes, pause or adjust the break duration in one click and resume the countdown immediately.',
      },
    ],
  },

  'eye-break-timer': {
    slug: 'eye-break-timer',
    useCasesIntro:
      'Automates the ergonomic 20-20-20 rule: after every 20 minutes of near-screen work, look at least 20 feet away for 20 seconds.',
    useCases: [
      'All-Day Coding & Design Sessions: Relax eye focusing muscles every 20 minutes during long monitor hours.',
      'Spreadsheet, CAD & Video Editing Work: Prevent dry eyes and afternoon screen fatigue during detail-heavy tasks.',
      'Student Laptop & Gaming Sessions: Remind learners to blink and shift focal distance between study chapters.',
    ],
    howToUse: [
      'Click Start to begin the 20-minute screen work countdown while you work at your monitor.',
      'When the gentle chime sounds at 00:00, start the 20-second Eye Rest phase and look at an object 20+ feet (6 meters) away.',
      'Repeat the 20-minute / 20-second cycle throughout your screen session.',
    ],
    faqs: [
      {
        question: 'Why does the 20-20-20 rule specify looking 20 feet (6 meters) away?',
        answer:
          'Focusing on an object 20 feet or farther away lets the eye’s ciliary focusing muscles relax from constant close-up screen tension.',
      },
      {
        question: 'Why is 20 seconds required for the distant-gaze rest phase?',
        answer:
          'It takes roughly 20 seconds for the human optical accommodation system to fully relax and for natural blinking to rehydrate the cornea.',
      },
      {
        question: 'Is the 20-20-20 Eye Break Timer a medical device?',
        answer:
          'No, it is a workplace ergonomic reminder tool; consult an optometrist or ophthalmologist for vision or eye health care.',
      },
    ],
  },

  'tabata-timer': {
    slug: 'tabata-timer',
    useCasesIntro:
      'A high-intensity 8-round Tabata interval clock preloaded with the classic 20-second work / 10-second rest 4-minute protocol.',
    useCases: [
      'Classic 4-Minute Tabata Sprints: Run 8 rounds of 20s all-out air squats, burpees, kettlebell swings, or rowing with 10s rest.',
      'Multi-Station Gym Finishers: Alternate two exercises (such as push-ups and mountain climbers) across Rounds 1–8.',
      'Custom HIIT Ratios: Adjust the work/rest seconds (e.g., 30s/15s) for intermediate conditioning sets.',
    ],
    howToUse: [
      'Complete a 5-minute dynamic warm-up before starting the default 8 × (20s Work / 10s Rest) Tabata preset.',
      'Click Start and go at high effort during the green 20-second WORK phase until the rest bell rings.',
      'Recover during the amber 10-second REST phase while watching the live Round 1-of-8 counter.',
    ],
    faqs: [
      {
        question: 'Why is the classic Tabata workout exactly 4 minutes long?',
        answer:
          'Dr. Izumi Tabata’s 1996 speed-skating protocol prescribes 8 rounds of 20 seconds maximum effort + 10 seconds rest (8 × 30s = 240s = 4m).',
      },
      {
        question: 'Can I customize the 20s work and 10s rest durations for beginner classes?',
        answer:
          'Yes, you can modify the Work seconds, Rest seconds, and Round count before starting the clock.',
      },
      {
        question: 'Does the Tabata Timer play distinct audio cues for Work and Rest transitions?',
        answer:
          'Yes, countdown ticks sound on the final 3-2-1 seconds of each phase followed by a bell when switching between Work and Rest.',
      },
    ],
  },

  'boxing-timer': {
    slug: 'boxing-timer',
    useCasesIntro:
      'A combat-sports round clock featuring 3-minute boxing rounds, 5-minute MMA rounds, 2-minute amateur rounds, and a 30-second end-of-round warning cue.',
    useCases: [
      'Pro Boxing & Muay Thai Sparring: Run 3-minute work rounds with a 30-second warning clapper and 1-minute corner rest.',
      'MMA & Grappling Rounds: Switch to 5-minute rounds with 1-minute rest for cage or mat conditioning.',
      'Heavy Bag & Shadowboxing Workouts: Follow audio round bells hands-free while wearing boxing gloves.',
    ],
    howToUse: [
      'Select your combat format preset (3m Pro Boxing, 2m Amateur, or 5m MMA) and set total rounds (3, 5, 10, or 12).',
      'Click Start before putting on your gloves and press F for fullscreen gym-wall visibility.',
      'Listen for the opening bell, the 30-second end-of-round warning cue, and the corner rest bell.',
    ],
    faqs: [
      {
        question: 'What are the standard round durations for Boxing, Muay Thai, and MMA?',
        answer:
          'Professional Boxing and Muay Thai use 3-minute rounds, Amateur Boxing uses 2- or 3-minute rounds, and MMA uses 5-minute rounds.',
      },
      {
        question: 'When does the end-of-round warning sound during a boxing round?',
        answer:
          'An acoustic warning cue sounds with 30 seconds left in the active work round so fighters know to finish strong.',
      },
      {
        question: 'How long is the standard corner recovery period between rounds?',
        answer:
          'The default rest interval is 60 seconds (1 minute), which you can adjust down to 30 seconds for conditioning drills.',
      },
    ],
  },

  'meditation-timer': {
    slug: 'meditation-timer',
    useCasesIntro:
      'A distraction-free mindfulness sit timer that runs in complete silence and concludes with a resonant acoustic singing-bowl chime.',
    useCases: [
      'Morning & Evening Mindfulness Sits: Meditate for 10, 15, 20, or 30 minutes without checking a bright phone lockscreen.',
      'Yoga Savasana & Breathwork Classes: Time closing relaxation blocks for studio or home yoga flows.',
      'Pre-Keynote & Pre-Exam Centering: Take 5 quiet minutes to settle attention before walking onstage or opening a test.',
    ],
    howToUse: [
      'Choose a sit preset (5, 10, 15, 20, or 30 minutes) or enter any custom duration.',
      'Ensure your device volume is set to a comfortable level and click Start.',
      'Close your eyes and sit quietly; the harmonic bell will chime gently when your meditation reaches 00:00.',
    ],
    faqs: [
      {
        question: 'Does the Meditation Timer play any ticking sounds during the countdown?',
        answer:
          'No, the timer runs in 100% silence during your sit and only sounds the gentle harmonic chime when time completes.',
      },
      {
        question: 'What session length works best when starting a daily meditation habit?',
        answer:
          'Starting with 5 to 10 minutes at the same time each morning builds consistency before expanding to 20-minute sits.',
      },
      {
        question: 'Can I mute the ending chime if I prefer a visual-only meditation timer?',
        answer:
          'Yes, toggle the audio icon off if you want to finish silently with eyes-open visual pacing.',
      },
    ],
  },

  'breathing-timer': {
    slug: 'breathing-timer',
    useCasesIntro:
      'A visual breathwork pacer guiding Inhale, Hold, and Exhale phases for Box Breathing (4-4-4-4), 4-7-8 Relaxing Breath, and Coherent Breathing (5-5).',
    useCases: [
      'Pre-Presentation Calm (Box Breathing 4-4-4-4): Run 4 cycles of 4s inhale, 4s hold, 4s exhale, 4s hold before speaking.',
      'Evening Wind-Down (4-7-8 Pattern): Lengthen the exhale phase to settle down after high-screen workdays.',
      'Steady Focus Pacing (Coherent 5-5): Breathe smoothly at 6 breaths per minute (5s inhale / 5s exhale) with zero breath holds.',
    ],
    howToUse: [
      'Select your breathing pattern preset: Box Breathing (4-4-4-4), 4-7-8 Relaxing Breath, or Coherent Breathing (5-5).',
      'Click Start and follow the expanding and contracting visual guide along with the live Inhale / Hold / Exhale prompt.',
      'Pause or switch patterns at any time if you prefer a gentler rhythm without breath holds.',
    ],
    faqs: [
      {
        question: 'How many seconds is one full cycle of 4-4-4-4 Box Breathing?',
        answer:
          'Each Box Breathing cycle takes 16 seconds (4s inhale + 4s hold + 4s exhale + 4s hold), or 3.75 breaths per minute.',
      },
      {
        question: 'Which breathing preset should I choose if holding my breath feels uncomfortable?',
        answer:
          'Select Coherent Breathing (5-5), which alternates a smooth 5-second inhale with a 5-second exhale and no breath holds.',
      },
      {
        question: 'Is the Breathing Pacer Timer a medical or clinical respiratory device?',
        answer:
          'No, it is a general relaxation and focus visual pacer; always breathe comfortably and consult a physician for medical advice.',
      },
    ],
  },

  'chess-clock': {
    slug: 'chess-clock',
    useCasesIntro:
      'A two-player digital game clock supporting Bullet, Blitz, and Rapid chess presets, Fischer time increments (+1s, +2s, +3s), and move counters.',
    useCases: [
      'Over-the-Board Blitz & Rapid Chess: Place a phone or tablet beside your board and tap after every move.',
      'Tournament Fischer Increment Practice: Play 3+2 or 5+3 time controls where each completed move adds bonus seconds.',
      'Two-Player Tabletop Games (Scrabble, Go, Shogi): Enforce fair per-player thinking time banks during family game nights.',
    ],
    howToUse: [
      'Select a time control preset (Bullet 1+0, Blitz 3+2, Blitz 5+3, Rapid 10+0, or custom minutes and increment seconds).',
      'Place your device between both players and tap Black’s clock to start White’s opening move.',
      'After each move on the board, tap your side of the screen (or press Spacebar) to add your Fischer increment and switch clocks.',
    ],
    faqs: [
      {
        question: 'What does "3+2" or "5+3" mean on a Fischer chess clock?',
        answer:
          'In 5+3, each player starts with 5 minutes of base time and receives +3 bonus seconds added to their clock after every move.',
      },
      {
        question: 'How are Bullet, Blitz, and Rapid chess time controls defined?',
        answer:
          'Bullet games give under 3 minutes per player, Blitz gives 3 to 10 minutes, and Rapid gives 10 to 60 minutes per player.',
      },
      {
        question: 'Does the Chess Clock track how many moves White and Black have played?',
        answer:
          'Yes, each player panel displays a live move counter alongside their remaining minutes, seconds, and tenths of a second.',
      },
    ],
  },

  'quiz-timer': {
    slug: 'quiz-timer',
    useCasesIntro:
      'A rapid-fire per-question trivia and academic bowl timer with buzz-in pause, question counter, 3-2-1 warning ticks, and auto-advance.',
    useCases: [
      'Academic Bowl & Science Olympiad Toss-Ups: Run 10- or 15-second question clocks with instant Spacebar buzz-in pause.',
      'Pub Trivia & Family Game Nights: Project a 30- or 60-second discussion countdown for each trivia round question.',
      'Classroom Flashcard & Spelling Bee Drills: Enable Auto-Advance to cycle smoothly through 10 to 50 rapid questions.',
    ],
    howToUse: [
      'Set your Seconds per Question (such as 15s, 30s, or 60s) and Total Questions for the round.',
      'Click Start Question; press Spacebar immediately to Pause if a player buzzes in to answer.',
      'Click Next Question (or enable Auto-Advance) to reset the clock and increment the question counter.',
    ],
    faqs: [
      {
        question: 'How do I handle a player buzzing in before the question countdown expires?',
        answer:
          'Press Spacebar (or click Pause) to freeze the clock while they answer; if incorrect, click Resume to give the other team the remaining seconds.',
      },
      {
        question: 'What does the Auto-Advance toggle do when a question hits 00:00?',
        answer:
          'When enabled, reaching zero plays the buzzer chime, increments the Question X of Y counter, and starts the next countdown automatically.',
      },
      {
        question: 'What question duration works best for lightning rounds versus team trivia?',
        answer:
          'Use 10 to 15 seconds for individual buzzer lightning rounds and 30 to 60 seconds when teams confer on written answers.',
      },
    ],
  },

  'classroom-scoreboard': {
    slug: 'classroom-scoreboard',
    useCasesIntro:
      'An interactive multi-team digital scoreboard with editable squad names and one-click +1, +5, and −1 point buttons for live review games.',
    useCases: [
      'Jeopardy & Exam Review Games: Track 2 to 6 classroom teams on your smartboard with instant point awards and deductions.',
      'House Cup & Camp Competitions: Keep a running tally of table or cabin points across daily challenges.',
      'Youth Sports & Tabletop Trivia Nights: Project big, high-contrast tabular scores readable from the back of a gym or hall.',
    ],
    howToUse: [
      'Click directly on any team title (e.g., Team Alpha) to type custom house, table, or squad names.',
      'Click +1 or +5 to award points for correct answers, or −1 for penalty rules.',
      'Click "Reset All Scores" to zero out points for a new round while keeping your custom team names intact.',
    ],
    faqs: [
      {
        question: 'Can I rename the teams on the Classroom Scoreboard without resetting their points?',
        answer:
          'Yes, click any team name heading at any point during the game to edit its label live.',
      },
      {
        question: 'Does the scoreboard allow negative scores if a team loses points on a penalty?',
        answer:
          'Yes, clicking the −1 button can take a team below zero for trivia formats that penalize incorrect buzz-ins.',
      },
      {
        question: 'How do I start a second round with the same teams?',
        answer:
          'Click "Reset All Scores" at the bottom of the board to return all point counters to 0 while preserving your custom team names.',
      },
    ],
  },

  'bingo-caller': {
    slug: 'bingo-caller',
    useCasesIntro:
      'A 75-ball (B-I-N-G-O) random number caller with a live 1–75 master verification grid and chronological call history.',
    useCases: [
      'Community Center & Fundraiser Bingo Nights: Project the giant drawn ball and 1–75 verification board on a TV or wall screen.',
      'Classroom Vocabulary & Math Bingo: Call random numbers 1–75 with zero repeats while students mark their cards.',
      'Holiday Party & Family Game Nights: Replace physical plastic cages and lost balls with a one-click digital caller.',
    ],
    howToUse: [
      'Click "Draw Next Ball" to select a random uncalled number from B-1 through O-75.',
      'Read the large letter-number callout (such as N-38) and check the 1–75 Master Verification Grid where called balls turn blue.',
      'When a player shouts "Bingo!", verify their card numbers against the highlighted grid, then click "Reset Board" for the next game.',
    ],
    faqs: [
      {
        question: 'How are numbers 1 through 75 grouped under the letters B-I-N-G-O?',
        answer:
          'B covers 1–15, I covers 16–30, N covers 31–45, G covers 46–60, and O covers 61–75.',
      },
      {
        question: 'Can the Bingo Caller ever draw the same ball twice in the same game?',
        answer:
          'No, each called number is removed from the active 75-ball pool until you click Reset Board to start a new game.',
      },
      {
        question: 'How do I check a player’s winning Bingo card quickly?',
        answer:
          'Look at the 1–75 Master Verification Grid on screen—every number called in the current game is highlighted in solid blue.',
      },
    ],
  },

  'seating-chart-maker': {
    slug: 'seating-chart-maker',
    useCasesIntro:
      'Randomizes student or attendee rosters into a numbered row-and-column classroom desk grid in one click.',
    useCases: [
      'New Grading Period Desk Rotations: Assign 25 to 35 students to fresh desks fairly without perceived teacher bias.',
      'Standardized Testing & Proctoring Layouts: Randomize exam seat numbers across a fixed column grid before students enter.',
      'Collaborative Workshop & Lab Mixing: Reshuffle table pairings weekly so students work with new classmates.',
    ],
    howToUse: [
      'Paste your student roster (one name per line) and select the number of Desks per Row (Columns, from 2 to 8).',
      'Click "Randomize Seating Chart" to shuffle the roster and assign each student to a numbered Row and Seat card.',
      'Project the desk grid on your whiteboard as students enter or click Copy/Export to save the layout.',
    ],
    faqs: [
      {
        question: 'How do I match the seating grid to my physical classroom layout?',
        answer:
          'Set the "Desks per Row (Columns)" selector to match your room’s column count; the tool automatically builds as many rows as needed.',
      },
      {
        question: 'What happens if my pasted roster accidentally includes a duplicate line or blank row?',
        answer:
          'Blank lines and duplicate entries are filtered automatically so each student receives exactly one desk.',
      },
      {
        question: 'Can I reshuffle the seating chart if two students need to sit in different rows?',
        answer:
          'Yes, click "Randomize Seating Chart" again for an instant new arrangement.',
      },
    ],
  },

  'time-calculator': {
    slug: 'time-calculator',
    useCasesIntro:
      'Performs base-60 time arithmetic—adding or subtracting hours, minutes, and seconds blocks and converting results into decimal hours.',
    useCases: [
      'Work Shift & Timesheet Math: Add morning and afternoon work blocks and subtract a 45-minute break.',
      'Media & Course Curriculum Totals: Sum lecture video lengths to calculate total course hours and minutes.',
      'Athletic Race Split Totals: Add swim, bike, and run leg times plus transition minutes for triathlon totals.',
    ],
    howToUse: [
      'Enter hours, minutes, and seconds in each row and select + Add or − Subtract.',
      'Click "Add Duration Row" to include additional time blocks.',
      'View the calculated result in HH:MM:SS, total minutes, total seconds, and base-10 decimal hours.',
    ],
    faqs: [
      {
        question: 'Why can’t I add hours and minutes on a normal pocket calculator?',
        answer:
          'Standard calculators use base-10 decimals (where 0.50 + 0.50 = 1.00), whereas clock minutes roll over at 60 (0:45 + 0:30 = 1 hour 15 minutes).',
      },
      {
        question: 'How do I convert the Time Calculator result into decimal hours for an invoice?',
        answer:
          'The result card displays the exact decimal-hour equivalent automatically (for example, 6 hours 15 minutes = 6.25 hours).',
      },
      {
        question: 'What happens if subtracting a time row makes the total negative?',
        answer:
          'The calculator displays the net negative duration clearly so you can see any time deficit or credit balance.',
      },
    ],
  },

  'date-calculator': {
    slug: 'date-calculator',
    useCasesIntro:
      'Calculates the exact number of calendar days, weeks, weekdays (Mon–Fri), and weekend days between any two dates.',
    useCases: [
      'Project & Construction Milestones: Count exact working weekdays versus total calendar days until a launch deadline.',
      'Travel, Visa & Lease Counting: Verify whether a trip or rental stay falls within a 30-, 60-, or 90-day window.',
      'HR Leave & Notice Periods: Calculate inclusive calendar days for parental leave, PTO blocks, or contract notice.',
    ],
    howToUse: [
      'Pick your Start Date and End Date using the calendar date selectors.',
      'Check "Include end date in calculation (+1 day)" if you are counting inclusive leave or event days rather than nights.',
      'Read the breakdown of total calendar days, weeks + remaining days, business weekdays, and weekend days.',
    ],
    faqs: [
      {
        question: 'When should I check "Include end date in calculation" on the Date Calculator?',
        answer:
          'Leave it unchecked for elapsed spans (e.g., hotel nights May 1–5 = 4 days); check it for inclusive spans (work leave May 1 through May 5 = 5 days).',
      },
      {
        question: 'Does the Date Calculator account for 29-day Februaries in leap years?',
        answer:
          'Yes, it evaluates exact calendar dates across leap years (such as 2024 and 2028) and varying 30- and 31-day months.',
      },
      {
        question: 'Does the Monday–Friday weekday count automatically subtract national public holidays?',
        answer:
          'It counts all Monday–Friday weekdays in your span; subtract any local bank holidays that fall on a weekday in your region.',
      },
    ],
  },

  'time-converter': {
    slug: 'time-converter',
    useCasesIntro:
      'Converts any numeric time value between milliseconds, seconds, minutes, hours, days, and weeks with instant HMS and decimal readouts.',
    useCases: [
      'Engineering & Software Timeout Configs: Convert hours or days into milliseconds or seconds for cache TTL and API settings.',
      'Payroll & Billing Normalization: Translate total logged minutes or seconds into decimal hours.',
      'Physics & Science Lab Problems: Convert multi-day or multi-hour experiment durations into standard SI seconds.',
    ],
    howToUse: [
      'Type the numeric value you want to convert into the Amount field.',
      'Select your source unit (From) and target unit (To) from milliseconds, seconds, minutes, hours, days, or weeks.',
      'Inspect the primary converted result alongside the complete multi-unit reference breakdown.',
    ],
    faqs: [
      {
        question: 'How many seconds are in 1 hour, 1 day, and 1 week?',
        answer:
          '1 hour has 3,600 seconds; 1 day (24h) has 86,400 seconds; and 1 week (7 days) has 604,800 seconds.',
      },
      {
        question: 'How do I convert milliseconds into seconds or minutes?',
        answer:
          'Divide milliseconds by 1,000 to get seconds, or divide by 60,000 to get decimal minutes.',
      },
      {
        question: 'Can I swap the From and To units in one click?',
        answer:
          'Yes, click the Swap Units button to reverse the conversion direction immediately.',
      },
    ],
  },

  'minutes-to-hours': {
    slug: 'minutes-to-hours',
    useCasesIntro:
      'Converts any number of minutes into both hours-and-minutes (HH:MM) and base-10 decimal hours for payroll, travel, and scheduling.',
    useCases: [
      'Payroll & Timesheet Entry: Convert 510 shift minutes into 8.50 decimal hours or 8 hours 30 minutes.',
      'Movie & Audiobook Runtimes: See what a 138-minute film or 495-minute audiobook equals in hours and minutes.',
      'Flight & Layover Planning: Translate 225-minute transit durations into 3 hours 45 minutes.',
    ],
    howToUse: [
      'Enter the total number of minutes (such as 90, 135, 240, or 510) or click a preset chip.',
      'Read the converted value in both decimal hours (e.g., 2.25 hours) and whole hours + remaining minutes (2h 15m).',
      'Use Swap Units if you want to convert backward from hours to minutes.',
    ],
    faqs: [
      {
        question: 'What is the formula for converting minutes into hours and remaining minutes?',
        answer:
          'Divide total minutes by 60: the whole integer quotient is the hours, and the remainder is the leftover minutes.',
      },
      {
        question: 'Why does 100 minutes equal 1.67 decimal hours instead of 1.40?',
        answer:
          '100 minutes is 1 hour plus 40 minutes, and 40 divided by 60 minutes equals 0.667 hours (1.67 decimal hours).',
      },
      {
        question: 'What are 15, 30, and 45 minutes in decimal hours?',
        answer:
          '15 minutes = 0.25 hours, 30 minutes = 0.50 hours, and 45 minutes = 0.75 hours.',
      },
    ],
  },

  'seconds-to-minutes': {
    slug: 'seconds-to-minutes',
    useCasesIntro:
      'Translates raw seconds into whole minutes plus remaining seconds (MM:SS) as well as decimal minutes.',
    useCases: [
      'Track, Rowing & Swim Coaching: Convert a 275-second 1500m trial into 4 minutes 35 seconds.',
      'Video, Ad Spot & Audio Editing: Translate 90-, 150-, or 1,000-second timeline durations into exact MM:SS marks.',
      'Workout & Plank Intervals: See how many minutes and seconds a 210-second hold or rest block equals.',
    ],
    howToUse: [
      'Type the total number of seconds into the input box or click a preset chip (such as 90s, 180s, 300s, or 1000s).',
      'Read both the decimal minutes result and the exact whole minutes + remaining seconds breakdown.',
      'Click Copy Result to paste the formatted conversion into your notes or script.',
    ],
    faqs: [
      {
        question: 'How do you convert seconds into whole minutes and leftover seconds?',
        answer:
          'Divide total seconds by 60 to get whole minutes, then subtract (Whole Minutes × 60) from total seconds for the remainder.',
      },
      {
        question: 'How many minutes and seconds is 1,000 seconds?',
        answer:
          '1,000 divided by 60 equals 16 whole minutes (960 seconds) with 40 seconds remaining—so 16 minutes 40 seconds.',
      },
      {
        question: 'How many seconds are in 5, 10, and 15 minutes?',
        answer:
          '5 minutes is 300 seconds, 10 minutes is 600 seconds, and 15 minutes is 900 seconds.',
      },
    ],
  },

  'hours-to-minutes': {
    slug: 'hours-to-minutes',
    useCasesIntro:
      'Converts whole or decimal hours (like 1.5, 2.75, or 8.5 hours) into exact minutes and total seconds.',
    useCases: [
      'Shift & Break Scheduling: Convert an 8.5-hour shift or 1.75-hour meeting block into 510 or 105 minutes.',
      'Exam & Standardized Test Allocation: Translate a 2.25-hour test accommodation into 135 countdown minutes.',
      'Baking, Roasting & Slow-Cooking: Convert recipe times given in fractional hours into exact kitchen timer minutes.',
    ],
    howToUse: [
      'Enter any whole or decimal hour value (such as 0.75, 1.5, 3.25, or 8) into the Hours field.',
      'Read the total minutes and total seconds immediately.',
      'Click any quick preset button to inspect common shift and study durations.',
    ],
    faqs: [
      {
        question: 'How do you convert decimal hours like 2.75 hours into minutes?',
        answer:
          'Multiply the decimal hour number by 60: 2.75 × 60 = 165 minutes (or 2 hours and 45 minutes).',
      },
      {
        question: 'How many minutes are in an 8-hour workday and a 24-hour day?',
        answer:
          'An 8-hour workday contains 480 minutes (8 × 60), and a full 24-hour day contains 1,440 minutes.',
      },
      {
        question: 'Why does 1.30 decimal hours equal 78 minutes instead of 90 minutes?',
        answer:
          'In base-10 decimals, 0.30 of an hour is 30% of 60 minutes (0.30 × 60 = 18 minutes), totaling 78 minutes; 90 minutes is 1.50 hours.',
      },
    ],
  },

  'what-time-will-it-be': {
    slug: 'what-time-will-it-be',
    useCasesIntro:
      'Calculates the exact future or past clock time in 12-hour AM/PM and 24-hour format when adding minutes or hours to now.',
    useCases: [
      'Cooking & Laundry Finish Times: Check what clock time it will be in 45 minutes or 2 hours 15 minutes.',
      'Parking Meter & Break Deadlines: See the exact clock minute when a 30-minute break or 90-minute ticket expires.',
      'Medication & Lab Sample Windows: Calculate what time it will be 6, 8, or 12 hours from a logged dose.',
    ],
    howToUse: [
      'Keep "Current Time (Live)" selected or switch to a custom starting clock time.',
      'Choose "In the Future (+ Add)" or "In the Past (− Ago)" and enter the hours, minutes, and seconds.',
      'Or click a quick preset chip ("In 20 minutes", "In 30 minutes", "In 45 minutes") to see the target clock time.',
    ],
    faqs: [
      {
        question: 'How do I find what time it was 3 hours and 45 minutes ago?',
        answer:
          'Switch the direction toggle from "+ In the Future" to "− In the Past (Ago)" and enter 3 hours and 45 minutes.',
      },
      {
        question: 'Does the calculator show if adding hours crosses midnight into tomorrow?',
        answer:
          'Yes, whenever the calculated time crosses midnight, the result displays the new day of the week and calendar date.',
      },
      {
        question: 'Are both 12-hour AM/PM and 24-hour military time shown in the result?',
        answer:
          'Yes, the output displays the future or past clock time in both 12-hour AM/PM and 24-hour formats simultaneously.',
      },
    ],
  },


  'sand-timer': {
    slug: 'sand-timer',
    useCasesIntro:
      'A digital sand timer where golden grains flow smoothly from the upper glass bulb to the lower bulb in sync with your countdown.',
    useCases: [
      'Tabletop & Board Game Turns: Replace lost plastic 1-, 2-, or 3-minute game timers for Codenames, Pictionary, or Boggle.',
      'Calm Classroom & Homework Blocks: Give students a low-anxiety visual gauge of remaining time with optional hidden digits.',
      'Tea Steeping & Mindful Desk Breaks: Watch soothing sand flow during a 3-minute brew or 5-minute screen pause.',
    ],
    howToUse: [
      'Pick a preset duration (1, 3, 5, 10, or 15 minutes), enter custom minutes, or choose End Time mode.',
      'Select your preferred sand color theme, animation speed, and whether to show or hide the digital MM:SS numbers.',
      'Click Start and press Fullscreen (F) to display the flowing sand glass across your screen.',
    ],
    faqs: [
      {
        question: 'Can I hide the digital countdown numbers on the Sand Timer so only the sand is visible?',
        answer:
          'Yes, toggle off "Show Time" in the control panel so viewers judge remaining time purely by the upper and lower sand levels.',
      },
      {
        question: 'Why is a digital sand timer more consistent than a physical glass hourglass?',
        answer:
          'Physical sand glasses can vary by 10–15% due to humidity and grain clumping, whereas this animation is locked to exact digital seconds.',
      },
      {
        question: 'What does the Reduced Motion toggle change on the Sand Timer?',
        answer:
          'It disables rapid falling particle streams while still updating the upper and lower sand chamber levels smoothly.',
      },
    ],
  },

  'liquid-timer': {
    slug: 'liquid-timer',
    useCasesIntro:
      'A calming water-vessel countdown timer with a smoothly draining liquid meniscus, gentle rising bubbles, and six liquid color themes.',
    useCases: [
      'Sensory-Friendly Study & Reading Blocks: Track 10- to 25-minute focus sessions with soft Ocean Blue or Sage Green water levels.',
      'Hydration, Dental & Handwashing Routines: Time 2-minute toothbrushing or classroom cleanup routines for kids.',
      'Therapy & Counseling Sessions: Provide a gentle, non-startling visual time boundary on a tablet or desk monitor.',
    ],
    howToUse: [
      'Choose a quick preset (1, 3, 5, 10, or 15 minutes) or enter a custom duration in minutes.',
      'Pick one of the 6 liquid color styles (Ocean Blue, Amber, Clear Water, Sage Green, Purple, or Rose Pink).',
      'Click Start to watch the liquid level drain steadily toward zero, and toggle Reduced Motion if you prefer still water.',
    ],
    faqs: [
      {
        question: 'Can I change the liquid color while the countdown is actively draining?',
        answer:
          'Yes, switching between Ocean Blue, Amber, Clear Water, Sage Green, Purple, and Rose Pink updates the vessel live.',
      },
      {
        question: 'How does the Reduced Motion option affect the Liquid Timer?',
        answer:
          'It pauses the surface wave ripples and rising bubbles while keeping the vertical liquid level synchronized to remaining time.',
      },
      {
        question: 'Can I count down to a specific clock time like 2:30 PM with the Liquid Timer?',
        answer:
          'Yes, switch from Duration mode to End Time mode and enter your target clock time.',
      },
    ],
  },

  'rainbow-timer': {
    slug: 'rainbow-timer',
    useCasesIntro:
      'A cheerful multicolor arc countdown timer with 4 rainbow geometry styles and 6 color palettes for classrooms, kids, and creative sessions.',
    useCases: [
      'Early Elementary Classroom Centers: Project a bright rainbow arc on the smartboard so Pre-K to Grade 3 students see time left.',
      'Kids Chore, Cleanup & Bedtime Routines: Turn 5-minute toy cleanups or 15-minute reading time into a colorful visual game.',
      'Creative Brainstorming & Art Workshops: Keep group sketching and craft stations moving with a friendly visual arc.',
    ],
    howToUse: [
      'Select a preset time (1, 3, 5, 10, or 15 minutes) or enter any custom minute duration.',
      'Pick a Rainbow Style (Classic Arc, Full Circle, Filling Arc, or Segmented) and a Color Theme (Classic, Pastel, Bright, Sunset, Forest, or Candy).',
      'Click Start and use Fullscreen mode to project the shrinking rainbow arc for your room.',
    ],
    faqs: [
      {
        question: 'What is the difference between Classic Arc and Filling Arc in the Rainbow Timer?',
        answer:
          'Classic Arc starts full and shrinks toward zero as time elapses, while Filling Arc starts empty and builds a full rainbow at completion.',
      },
      {
        question: 'Which rainbow color palette is best for low-stimulation classrooms?',
        answer:
          'Choose the Pastel or Forest color theme for softer, muted hues that remain easy to read on a classroom projector.',
      },
      {
        question: 'Can I save my favorite rainbow style and duration for tomorrow’s class?',
        answer:
          'Yes, click "Save as Default" in the settings panel to store your preferred style, palette, and duration in your browser.',
      },
    ],
  },

  'hourglass-timer': {
    slug: 'hourglass-timer',
    useCasesIntro:
      'A classic wooden-framed tabletop hourglass countdown featuring an interactive 180-degree Flip button that turns the vessel over to restart.',
    useCases: [
      'Board Games & RPG Encounters: Flip a virtual 1-, 3-, or 5-minute wooden hourglass on the table for chess, D&D, or party games.',
      'Classroom Turn-Taking & Sharing: Let students click the Flip button to start the next speaker’s or partner’s turn.',
      'Short Writing & Sketching Prompts: Run 5- or 10-minute creative sprints with a traditional sand-clock aesthetic.',
    ],
    howToUse: [
      'Select a preset duration (1, 3, 5, 10, or 15 minutes) or enter custom minutes up to 180.',
      'Click Start to watch sand trickle from the upper glass chamber into the lower chamber.',
      'Click the "Flip" button at any time to rotate the wooden hourglass 180 degrees and restart the countdown.',
    ],
    faqs: [
      {
        question: 'How is the Hourglass Timer different from the Sand Timer?',
        answer:
          'The Hourglass Timer models a traditional wooden-framed tabletop sand glass with an interactive 180-degree Flip button to invert the clock.',
      },
      {
        question: 'What happens when I click the Flip button while the Hourglass Timer is running?',
        answer:
          'The wooden frame animates a 180-degree rotation and resets the sand to the top chamber for a fresh countdown.',
      },
      {
        question: 'Does the hourglass flip over automatically when it reaches 00:00?',
        answer:
          'It stops at 00:00 with all sand in the bottom bulb so you know time is up until you click Flip or Reset.',
      },
    ],
  },

  'circular-timer': {
    slug: 'circular-timer',
    useCasesIntro:
      'A clean 360-degree circular ring countdown timer with clockwise or counterclockwise sweep, 6 ring colors, and 4 background styles.',
    useCases: [
      'Smartboard Exam & Quiz Pacing: Show students a high-contrast 360-degree ring that sweeps down to zero.',
      'Agile Standups & Retrospectives: Time 2-minute speaker updates or 10-minute team voting rounds on a shared screen.',
      'Home Workouts & Stretching Blocks: Read remaining time from across the floor via the bold circular progress ring.',
    ],
    howToUse: [
      'Pick a preset time (1, 3, 5, 10, or 15 minutes), type custom minutes, or choose End Time mode.',
      'Select your ring color, background style, and Clockwise or Counterclockwise sweep direction.',
      'Click Start and press Fullscreen (F) for a distraction-free circular display.',
    ],
    faqs: [
      {
        question: 'Why do many teachers prefer a 360-degree Circular Timer over a flat progress bar?',
        answer:
          'A circular ring mirrors a familiar clock face, making fractions like half-time (180°) and quarter-time (90°) effortless to read at a glance.',
      },
      {
        question: 'Can I switch the Circular Timer between clockwise and counterclockwise sweep?',
        answer:
          'Yes, use the Countdown Direction toggle in the appearance panel to sweep the ring clockwise or counterclockwise.',
      },
      {
        question: 'Can I hide the center digits so only the colored circle is shown?',
        answer:
          'Yes, turn off the Show Time toggle to display a pure geometric ring countdown.',
      },
    ],
  },

  'radial-timer': {
    slug: 'radial-timer',
    useCasesIntro:
      'A sunburst radial countdown clock where 12 to 60 discrete spokes, dots, blocks, or rays extinguish one by one around the dial.',
    useCases: [
      'Minute-by-Minute Classroom Pacing: Set 15 minutes with 15 radial segments so exactly one spoke turns off every minute.',
      'HIIT & Tempo Exercise Sets: Use 30 or 60 radial ticks to track seconds visually during planks or wall sits.',
      'Lightning Talks & Pitch Coaching: Give speakers a clear segmented dial that marks each fraction of their talk.',
    ],
    howToUse: [
      'Select a preset time or custom duration and choose a Radial Style (Spokes, Dots, Blocks, or Sunburst Rays).',
      'Adjust the Segment Count slider (from 12 to 60 segments) and pick a color theme.',
      'Click Start to watch each radial segment turn off around the perimeter as time elapses.',
    ],
    faqs: [
      {
        question: 'How do I make each radial spoke represent exactly 1 minute of my countdown?',
        answer:
          'Match the Segment Count slider to your duration in minutes—for example, set a 20-minute timer with 20 radial segments.',
      },
      {
        question: 'What is the difference between the Radial Timer and the Circular Timer?',
        answer:
          'The Circular Timer uses a continuous smooth ring, while the Radial Timer divides the circle into discrete spokes or dots that turn off step by step.',
      },
      {
        question: 'How many radial segments can I configure around the dial?',
        answer:
          'You can set anywhere from 12 bold segments up to 60 fine second-by-second ticks using the Segment Count slider.',
      },
    ],
  },

  'rings-timer': {
    slug: 'rings-timer',
    useCasesIntro:
      'A concentric three-ring visual countdown timer where the Outer, Middle, and Inner rings track overall session, stage, and minute pacing.',
    useCases: [
      'Multi-Layered Study & Deep Work Blocks: Watch overall session progress on the outer ring and rapid pacing on the inner ring.',
      'Presentation & Workshop Pacing: Keep track of macro session time and micro section rhythm simultaneously.',
      'Fitness & Studio Classes: Project a vibrant Apple-Activity-style concentric ring countdown on a studio monitor.',
    ],
    howToUse: [
      'Select a preset duration (1, 3, 5, 10, or 15 minutes) or enter custom minutes.',
      'Choose a Ring Style (Classic, Gradient, Minimal, or Dashed) and customize the Outer, Middle, and Inner ring colors.',
      'Click Start to watch all three concentric rings sweep smoothly toward completion.',
    ],
    faqs: [
      {
        question: 'What do the three concentric rings represent on the Rings Timer?',
        answer:
          'The Outer Ring tracks total countdown completion, the Middle Ring shows quarter-stage progress, and the Inner Ring tracks fine minute pacing.',
      },
      {
        question: 'Can I assign a different color to each of the three rings?',
        answer:
          'Yes, the appearance panel lets you pick independent color swatches for the Outer, Middle, and Inner rings.',
      },
      {
        question: 'Which ring style works best on a projector or smartboard?',
        answer:
          'Classic Rings and Dashed Rings offer thick, high-contrast strokes that stay crisp from across a classroom or studio.',
      },
    ],
  },

  'progress-timer': {
    slug: 'progress-timer',
    useCasesIntro:
      'A linear progress-bar countdown timer with Horizontal, Vertical, Segmented, and Thin Line layouts, live percentage readout, and warning alerts.',
    useCases: [
      'Screen-Share Workshop & Coding Demos: Place a clean horizontal progress bar at the top or bottom of a shared screen.',
      'Exam & Test Proctoring: Display elapsed time, remaining time, and completion percentage (0%–100%) on the room board.',
      'Livestream & Break Overlays: Run a labeled task bar ("Break Ends Soon") with an automatic warning chime at 20% remaining.',
    ],
    howToUse: [
      'Enter your duration, type an optional Task / Event label, and select Horizontal, Vertical, Segmented, or Thin Line style.',
      'Optionally set a Warning Alert percentage (such as 20% remaining) to trigger a mid-session heads-up chime.',
      'Click Start to watch the progress bar and live percentage indicator update smoothly.',
    ],
    faqs: [
      {
        question: 'How does the Warning Alert percentage work on the Progress Timer?',
        answer:
          'When remaining time drops to your chosen percentage (e.g., 20% left), the bar plays a single warning cue before the final 00:00 bell.',
      },
      {
        question: 'Can I switch the progress bar from horizontal to a vertical column?',
        answer:
          'Yes, select "Vertical Bar" in the display style controls to turn the bar into a thermometer-style vertical column.',
      },
      {
        question: 'Does the Progress Timer display both elapsed percentage and remaining time?',
        answer:
          'Yes, it shows the main countdown digits alongside elapsed time, total duration, and live percentage.',
      },
    ],
  },

  'pixel-timer': {
    slug: 'pixel-timer',
    useCasesIntro:
      'A retro 8-bit grid countdown timer where a matrix of glowing arcade pixels disappears square by square until time expires.',
    useCases: [
      'Gamified Classroom Challenges: Turn 5-minute math drills or vocabulary sprints into a retro arcade countdown.',
      'Coding Bootcamps & Game Jams: Project an 8-bit pixel grid during pitch demos, bug bashes, or standups.',
      'Kids Screen-Time & Gaming Breaks: Use a familiar retro gaming aesthetic to signal when a 15-minute break ends.',
    ],
    howToUse: [
      'Choose a preset duration (1, 3, 5, 10, or 15 minutes) or enter custom minutes.',
      'Pick a Pixel Style (Retro Arcade, 8-bit Color, Monochrome, or Minimal Grid), color palette, and Grid Density (10×10 up to 30×30).',
      'Click Start to watch individual pixels vanish across the matrix as the countdown runs.',
    ],
    faqs: [
      {
        question: 'How does changing the Pixel Density (like 10×10 vs. 24×24) affect the timer?',
        answer:
          'A 10×10 grid shows 100 chunky retro blocks (each equal to 1% of your time), while a 24×24 grid clears 576 fine pixels smoothly.',
      },
      {
        question: 'Which pixel styles are included in the Pixel Timer?',
        answer:
          'You can switch between Retro Arcade CRT glow, 8-bit Multicolor, Monochrome, and Minimal Flat Grid.',
      },
      {
        question: 'Can I hide the digital numbers so only the disappearing pixel matrix is shown?',
        answer:
          'Yes, toggle off "Show Time" to track remaining time purely by how many lit pixels remain on the board.',
      },
    ],
  },

  'blocks-timer': {
    slug: 'blocks-timer',
    useCasesIntro:
      'A tactile 3D stacked-block countdown timer where 5 to 20 wooden, colored, stone, or minimal blocks vanish one by one.',
    useCases: [
      'Early Childhood & Special Education Routines: Make abstract minutes concrete—e.g., 5 minutes = 5 physical-style blocks.',
      'Classroom Clean-Up & Transition Games: Challenge students to finish putting away supplies before the last block disappears.',
      'Speech & Turn-Taking Practice: Set 10 blocks for a 10-minute activity so learners see each individual minute block clear.',
    ],
    howToUse: [
      'Enter your countdown duration and set the Block Count slider (from 5 to 20 blocks).',
      'Choose a 3D Block Style (Wooden Blocks, Colored Blocks, Stone Blocks, or Minimal Blocks) and color theme.',
      'Click Start to watch the stack shrink block by block until the final block clears at 00:00.',
    ],
    faqs: [
      {
        question: 'How much time does each individual block represent in the stack?',
        answer:
          'Your total duration is divided evenly by your Block Count—for example, a 10-minute timer with 10 blocks clears 1 block per minute.',
      },
      {
        question: 'Why do elementary teachers use a Blocks Timer for transitions?',
        answer:
          'Young children can easily count 5 or 10 stacked blocks disappearing one by one even before they can read digital clock numbers.',
      },
      {
        question: 'Can I switch between Wooden Blocks and Colored Toy Blocks mid-session?',
        answer:
          'Yes, changing the Block Style or Color Theme updates the 3D stack immediately without interrupting your countdown.',
      },
    ],
  },

  'candle-timer': {
    slug: 'candle-timer',
    useCasesIntro:
      'A cozy digital pillar-candle countdown timer where the wax column slowly melts downward with a gentle flickering flame.',
    useCases: [
      'Evening Journaling & Novel Reading: Create a warm, low-glare desk atmosphere for 20- or 30-minute wind-down sessions.',
      'Dark-Academia Study & Essay Sprints: Pair an Ivory or Forest Green wax candle with focused nighttime study blocks.',
      'Mindfulness, Breathwork & Restorative Yoga: Time quiet reflection periods without harsh white screen glare.',
    ],
    howToUse: [
      'Select a preset time (1, 3, 5, 10, or 15 minutes) or enter any custom duration in minutes.',
      'Pick a Candle Wax Theme (Ivory, Amber, Forest Green, or Charcoal) and Flame Style.',
      'Click Start to watch the candle wax shorten steadily toward the base holder as time passes.',
    ],
    faqs: [
      {
        question: 'Does the candle height match the exact percentage of time remaining?',
        answer:
          'Yes, a candle at 50% wax height means exactly half of your selected countdown duration remains.',
      },
      {
        question: 'Can I stop the candle flame from flickering if I prefer a static visual?',
        answer:
          'Yes, enable the Reduced Motion toggle to keep the flame steady while the wax height continues to lower smoothly.',
      },
      {
        question: 'What happens visually when the Candle Timer reaches 00:00?',
        answer:
          'The wax reaches the base holder, the flame gently extinguishes with a wisp of glow, and your optional chime rings.',
      },
    ],
  },

  'aesthetic-timer': {
    slug: 'aesthetic-timer',
    useCasesIntro:
      'A minimalist, design-forward desk timer featuring 8 curated studio themes—from Minimal Ivory and Dark Academia to Paper Texture and Coastal Blue.',
    useCases: [
      'Study-With-Me Streams & Desk Setups: Match your secondary monitor or iPad to a Dark Academia, Forest Green, or Ivory aesthetic.',
      'Deep Writing & Creative Design Blocks: Run 25- or 50-minute labeled focus sessions with restrained typography.',
      'Calm Client & Coaching Calls: Keep a subtle, non-clinical visual clock visible during studio or therapy sessions.',
    ],
    howToUse: [
      'Choose a study preset (5, 10, 25, or 50 minutes), enter custom minutes, or pick an End Time.',
      'Select one of the 8 studio themes, pick an accent color, and type an optional session label (e.g., "Chapter 4 Draft").',
      'Click "Save as Default" to remember your aesthetic setup, then press Start or Fullscreen.',
    ],
    faqs: [
      {
        question: 'Which studio themes are available in the Aesthetic Timer?',
        answer:
          'You can choose Minimal Ivory, Warm Sunset, Forest Green, Soft Pastel, Dark Academia, Monochrome, Paper Texture, or Coastal Blue.',
      },
      {
        question: 'Does clicking "Save as Default" keep my theme and session label for next time?',
        answer:
          'Yes, your chosen theme, accent swatch, duration, and label are saved in local browser storage for future visits.',
      },
      {
        question: 'Can I display a custom study goal or task name above the Aesthetic Timer?',
        answer:
          'Yes, type any goal into the Session Label field and it renders cleanly above the countdown ring.',
      },
    ],
  },

  'picture-reveal-timer': {
    slug: 'picture-reveal-timer',
    useCasesIntro:
      'A mystery-image countdown timer that covers any photo with a grid of 16 to 100 tiles and removes them one by one as time runs down.',
    useCases: [
      'Classroom "Guess the Topic" Warmups: Upload a historical photo, animal, or map and let students guess as tiles vanish.',
      'Trivia & Party Icebreakers: Reveal a celebrity, landmark, or product photo gradually over a 60-second round.',
      'Vocabulary & ESL Visual Prompts: Use built-in scenes or custom images to spark descriptive speaking exercises.',
    ],
    howToUse: [
      'Pick a built-in illustration or upload your own JPG, PNG, or WebP picture (processed 100% locally in your browser).',
      'Select your countdown duration, Grid Size (4×4, 5×5, 6×6, 8×8, or 10×10), and Reveal Pattern (Random, Sequential, Spiral, or Center Out).',
      'Click Start to watch tiles clear steadily until the full image is unveiled at 00:00.',
    ],
    faqs: [
      {
        question: 'Are photos I upload to the Picture Reveal Timer sent to any external server?',
        answer:
          'No, uploaded images are rendered locally inside your browser via a local object URL and never leave your device.',
      },
      {
        question: 'How many tiles are in each Grid Size option?',
        answer:
          'You can choose 4×4 (16 tiles), 5×5 (25 tiles), 6×6 (36 tiles), 8×8 (64 tiles), or 10×10 (100 tiles).',
      },
      {
        question: 'Which tile reveal patterns can I choose from?',
        answer:
          'Switch between Random Tile Reveal, Top-to-Bottom Sequential, Outside-In Spiral, and Center-Outward reveal modes.',
      },
    ],
  },

  'heart-timer': {
    slug: 'heart-timer',
    useCasesIntro:
      'A warm heart-shaped visual countdown timer where a contoured Rose, Berry, Ivory, or Soft Red heart drains smoothly to zero.',
    useCases: [
      'Classroom Kindness, SEL & Valentine Activities: Project a friendly heart countdown for group sharing and craft rotations.',
      'Gratitude Journaling & Self-Care Routines: Time 5- or 10-minute reflection, stretching, or skincare routines.',
      'Couples, Wedding & Anniversary Games: Run timed trivia or toast segments during receptions and showers.',
    ],
    howToUse: [
      'Select a preset time (1, 3, 5, 10, or 15 minutes) or enter a custom duration.',
      'Pick a Heart Style (Rose, Berry, Ivory, or Soft Red) and choose your preferred fill accent color.',
      'Click Start to watch the liquid-smooth fill inside the heart silhouette lower steadily to zero.',
    ],
    faqs: [
      {
        question: 'Is the Heart Timer a heart-rate monitor or pulse tracker?',
        answer:
          'No, it is a decorative heart-shaped countdown timer where the colored fill inside the heart represents remaining time.',
      },
      {
        question: 'Can I turn off the subtle pulse animation on the Heart Timer?',
        answer:
          'Yes, enable the Reduced Motion toggle to keep the heart outline completely still while the internal fill level lowers.',
      },
      {
        question: 'Can I hide the digital numbers inside the heart for a visual-only display?',
        answer:
          'Yes, toggle off "Show Time" so only the draining heart graphic is displayed.',
      },
    ],
  },

  'moon-timer': {
    slug: 'moon-timer',
    useCasesIntro:
      'A serene nighttime visual timer where a lunar shadow sweeps across a glowing moon disc set against Night Sky, Forest, Mountain, or Lakeside scenes.',
    useCases: [
      'Evening Reading & Bedtime Wind-Downs: Replace harsh white timers with a low-brightness lunar scene before sleep.',
      'Late-Night Writing & Coding Sprints: Keep a calm Crescent, Blue, or Warm Moon countdown on a dimmed monitor.',
      'Quiet Classroom Calm-Down Corners: Project a soothing night-sky visual timer during post-recess quiet time.',
    ],
    howToUse: [
      'Choose a preset duration (5, 10, 25, 50, or 90 minutes) or enter custom minutes.',
      'Select a Moon Style (Classic, Crescent, Blue, or Warm Moon), a Scenic Background, and adjust the Brightness slider.',
      'Click Start to watch the lunar phase shadow progress smoothly across the moon disc.',
    ],
    faqs: [
      {
        question: 'Does the Moon Timer track live astronomical moon phases for tonight’s sky?',
        answer:
          'No, the moving lunar shadow is synchronized to your chosen countdown duration (0% to 100%) as a calm visual timer.',
      },
      {
        question: 'How can I make the Moon Timer extra dim for a dark bedroom or evening study desk?',
        answer:
          'Use the built-in Brightness slider in the appearance panel to lower scene luminance and hide the digital numbers if desired.',
      },
      {
        question: 'Which scenic backgrounds can I pair with the moon disc?',
        answer:
          'You can switch between Starry Night Sky, Pine Forest Silhouette, Alpine Mountains, and Still Lakeside Reflection.',
      },
    ],
  },

  'sun-timer': {
    slug: 'sun-timer',
    useCasesIntro:
      'A warm sky-arc countdown timer where a glowing sun travels smoothly across Morning, Midday, Sunset, or Warm Neutral horizons.',
    useCases: [
      'Morning Classroom Arrival & Bell-Ringers: Welcome students with a sunrise sky arc counting down the first 10 minutes of class.',
      'Family Morning & Getting-Ready Routines: Help kids see how much time remains before leaving for school as the sun crosses the sky.',
      'Daytime Pomodoro & Journaling Blocks: Anchor 25- or 50-minute daytime focus sessions with a bright, uplifting horizon.',
    ],
    howToUse: [
      'Select a preset duration (5, 10, 25, 50, or 90 minutes) or enter custom minutes.',
      'Choose a Sky Theme (Morning, Midday, Sunset, or Warm Neutral), pick an accent color, and add an optional session label.',
      'Click Start to watch the sun travel along its curved sky path from start to horizon.',
    ],
    faqs: [
      {
        question: 'Does the Sun Timer calculate local meteorological sunrise or sunset times?',
        answer:
          'No, the sun’s path across the sky arc is a visual representation of your selected countdown duration from start to finish.',
      },
      {
        question: 'Can children track remaining time on the Sun Timer without reading numbers?',
        answer:
          'Yes, you can toggle off "Show Time" so learners simply watch the sun travel from the left horizon to the right horizon.',
      },
      {
        question: 'Which sky themes are included in the Sun Timer?',
        answer:
          'You can switch between Morning Sunrise, Bright Midday, Golden Sunset, and Warm Neutral studio palettes.',
      },
    ],
  },

  'bubble-timer': {
    slug: 'bubble-timer',
    useCasesIntro:
      'A gentle underwater visual countdown timer with translucent rising bubbles, adjustable bubble density, and four ocean color themes.',
    useCases: [
      'Sensory & Calm-Down Breaks: Provide a soothing underwater bubble display for 3- to 10-minute emotional regulation pauses.',
      'Early Elementary Clean-Up & Handwashing: Engage young learners with Ocean Blue or Pastel Dreams bubbles during routines.',
      'Relaxed Reading & Creative Sketching: Run a gentle ambient timer that avoids sharp edges or stressful countdown buzzers.',
    ],
    howToUse: [
      'Pick a preset time (1, 3, 5, 10, or 15 minutes) or enter a custom duration in minutes.',
      'Select a Bubble Theme (Ocean Blue, Seafoam Green, Pastel Dreams, or Clear Glass) and adjust the Bubble Density slider.',
      'Click Start to watch the water column and rising bubbles gradually settle as time reaches 00:00.',
    ],
    faqs: [
      {
        question: 'What does the Bubble Density slider control on the Bubble Timer?',
        answer:
          'It adjusts how many floating bubbles appear in the chamber—choose Low for minimal distraction or High for a lively reef look.',
      },
      {
        question: 'How does the Reduced Motion toggle work on the Bubble Timer?',
        answer:
          'Enabling Reduced Motion stops continuous upward bubble floating while still lowering the water fill level as time passes.',
      },
      {
        question: 'What happens visually when the Bubble Timer finishes at zero?',
        answer:
          'The rising bubbles gradually subside until the vessel reaches a calm, still completed state.',
      },
    ],
  },

  'coral-timer': {
    slug: 'coral-timer',
    useCasesIntro:
      'A reward-based ocean countdown timer where a colorful underwater coral reef branches and blooms as you stay focused.',
    useCases: [
      'Positive-Reinforcement Study Sessions: Watch your focused minutes grow a vibrant coral reef rather than watching a bar drain.',
      'Marine Science & Classroom Reading Blocks: Project a growing reef on the smartboard during 15- or 25-minute silent reading.',
      'Creative Writing & Art Sprints: Pair a peaceful underwater palette with 25-minute creative work blocks.',
    ],
    howToUse: [
      'Select a preset time (1, 3, 5, 10, or 25 minutes) or enter any custom duration in minutes.',
      'Choose a Coral Theme (Tropical Coral, Deep Ocean, Colorful Reef, or Minimal Coral) and underwater background style.',
      'Click Start to watch the coral branches grow from a small seabed sprout into a full reef at 00:00.',
    ],
    faqs: [
      {
        question: 'Why does the Coral Timer grow upward instead of shrinking like a regular timer?',
        answer:
          'Growing visuals turn time spent focusing into a sense of progress and completion, ending with a fully bloomed coral reef.',
      },
      {
        question: 'Is the Coral Timer a biological simulation of real marine coral growth?',
        answer:
          'No, it is an illustrated time-management visualization synchronized to your chosen countdown duration.',
      },
      {
        question: 'Can I pause the Coral Timer without losing my reef’s current growth stage?',
        answer:
          'Yes, clicking Pause freezes the coral at its exact current growth percentage until you click Resume.',
      },
    ],
  },

  'lichen-timer': {
    slug: 'lichen-timer',
    useCasesIntro:
      'A botanical woodland countdown timer where organic moss and lichen rosettes slowly spread across natural stone or tree bark.',
    useCases: [
      'Quiet Nature-Inspired Reading & Study: Keep an earthy Forest Rock or Tree Bark visual timer on your desk.',
      'Botany, Biology & Outdoor Education Classes: Project an organic woodland countdown during lab observation or journaling.',
      'Low-Stimulation Focus Sessions: Avoid bright neon colors with muted sage, ochre, and slate stone palettes.',
    ],
    howToUse: [
      'Choose a preset duration (1, 3, 5, 10, or 25 minutes) or enter custom minutes.',
      'Select a Lichen Theme (Forest Rock, Tree Bark, Coastal Stone, or Autumn Lichen) and natural surface texture.',
      'Click Start to watch the botanical lichen colonies expand steadily across the surface until 00:00.',
    ],
    faqs: [
      {
        question: 'What makes the Lichen Timer well suited for sensory-sensitive users?',
        answer:
          'It uses low-contrast earthy greens, warm grays, and slow organic expansion with zero flashing lights or sudden motion.',
      },
      {
        question: 'Can I hide the digital clock numbers on the stone surface?',
        answer:
          'Yes, toggle off "Show Time" so only the spreading botanical lichen pattern marks elapsed time.',
      },
      {
        question: 'Which natural surface themes are included in the Lichen Timer?',
        answer:
          'You can switch between Forest Rock, Weathered Tree Bark, Coastal Slate Stone, and Warm Autumn Lichen.',
      },
    ],
  },

  'frost-timer': {
    slug: 'frost-timer',
    useCasesIntro:
      'A serene winter windowpane countdown timer that grows delicate ice-crystal frost patterns inward from the glass edges as time passes.',
    useCases: [
      'Winter Classroom & Library Reading Blocks: Project a peaceful frosting windowpane during silent sustained reading.',
      'Calm Deep-Work & Coding Sprints: Track 25- or 50-minute focus sessions with cool Icy Blue or Winter Morning glass hues.',
      'Sensory Cool-Down & Breathing Breaks: Watch delicate crystalline branches form without rapid particle movement.',
    ],
    howToUse: [
      'Select a preset time (1, 3, 5, 10, or 25 minutes) or enter a custom duration up to 240 minutes.',
      'Pick a Frost Theme (Classic Frost, Icy Blue, Winter Morning, or Frosted Glass) and adjust the Brightness slider.',
      'Click Start to watch crystalline frost spread inward across the glass pane until completion at 00:00.',
    ],
    faqs: [
      {
        question: 'How does the Frost Timer show remaining time visually when numbers are hidden?',
        answer:
          'Frost crystals grow inward from the window frame edges, so the clear unfrosted glass circle in the center shrinks as time runs out.',
      },
      {
        question: 'Is the Frost Timer connected to live weather or freezing temperatures?',
        answer:
          'No, the ice-crystal growth is a decorative visual animation synchronized strictly to your countdown clock.',
      },
      {
        question: 'Can I dim the winter window background for evening study sessions?',
        answer:
          'Yes, drag the Brightness control down to reduce screen glare in dimly lit rooms.',
      },
    ],
  },

  'snow-timer': {
    slug: 'snow-timer',
    useCasesIntro:
      'A peaceful winter snowfall countdown timer where snowflakes drift down and gradually build a rising snowdrift along the bottom horizon.',
    useCases: [
      'Cozy Winter Classroom Activities: Project a snowy pine forest or mountain village countdown on the smartboard.',
      'Quiet Study & Essay Writing Blocks: Pair a gentle flurry with 25-minute Pomodoro or 45-minute reading sessions.',
      'Holiday Event & Break Countdowns: Display a festive winter scene during December classroom transitions or office breaks.',
    ],
    howToUse: [
      'Choose a preset duration (1, 3, 5, 10, or 25 minutes) or enter custom minutes.',
      'Select your winter scene theme and drag the Snowfall Intensity slider between a light flurry and a heavy snowfall.',
      'Click Start to watch snowflakes fall and the bottom snow accumulation layer rise to 100% at 00:00.',
    ],
    faqs: [
      {
        question: 'How can I tell how much time is left on the Snow Timer without looking at the digits?',
        answer:
          'The accumulated snowbank along the bottom of the winter scene rises steadily from 0% to full height as your countdown progresses.',
      },
      {
        question: 'What does the Snowfall Intensity slider change?',
        answer:
          'It controls how many active snowflakes drift across the sky without changing your underlying countdown speed.',
      },
      {
        question: 'Can I pause the falling snow motion while keeping the rising snowdrift indicator?',
        answer:
          'Yes, turn on Reduced Motion to pause falling flakes while the bottom snowbank height still updates smoothly.',
      },
    ],
  },

  'galaxy-timer': {
    slug: 'galaxy-timer',
    useCasesIntro:
      'A deep-space visual countdown timer featuring Spiral Galaxy, Nebula Cloud, Starfield, and Andromeda themes that illuminate as time progresses.',
    useCases: [
      'STEM & Astronomy Classroom Activities: Project a cosmic countdown during science labs, planetarium lessons, or space units.',
      'Night-Owl Coding, Gaming & Writing Sprints: Use a dark-mode nebula display that preserves night vision in dim rooms.',
      'Evening Meditation & Wind-Downs: Slow the galaxy rotation slider for a tranquil starfield timer.',
    ],
    howToUse: [
      'Pick a preset time (1, 3, 5, 10, or 25 minutes) or enter custom minutes up to 240.',
      'Select a Space Theme (Spiral Galaxy, Nebula Cloud, Starfield, or Andromeda) and adjust the Animation Speed slider.',
      'Click Start to watch star clusters and constellation rings illuminate across the cosmos until 00:00.',
    ],
    faqs: [
      {
        question: 'Can I slow down or stop the spinning galaxy rotation while the timer runs?',
        answer:
          'Yes, lower the Animation Speed slider or toggle Low Motion to keep the starfield stationary while progress rings update.',
      },
      {
        question: 'Is the Galaxy Timer a live astronomical star chart or planetarium map?',
        answer:
          'No, it is an artistic cosmic countdown visualization whose star clusters and rings are tied to your timer duration.',
      },
      {
        question: 'Why is the Galaxy Timer popular for late-night study setups?',
        answer:
          'Its deep-space dark backgrounds emit minimal blue-white glare compared to bright white browser tabs.',
      },
    ],
  },

  'lava-lamp-timer': {
    slug: 'lava-lamp-timer',
    useCasesIntro:
      'A retro 1970s-inspired lava lamp countdown timer with rising and merging glowing wax blobs in Amber, Deep Blue, Neon Pink, and Aqua Glow.',
    useCases: [
      'Creative Brainstorming & Design Studios: Keep a groovy, low-stress retro lamp running on a secondary desk display.',
      'Sensory Visual Breaks & Reading Corners: Watch slow-rising wax orbs during 5- or 15-minute decompression breaks.',
      'Lofi Study & Music Practice Sessions: Pair a glowing Amber or Neon Pink lava lamp with 25-minute practice blocks.',
    ],
    howToUse: [
      'Select a preset time (1, 3, 5, 10, or 25 minutes) or enter custom minutes.',
      'Choose a Lava Lamp Theme (Retro Amber, Deep Blue, Neon Pink, or Aqua Glow), Lamp Style, and Animation Speed.',
      'Click Start (and press Fullscreen if desired) to watch the wax blobs rise and morph while the base clock counts down.',
    ],
    faqs: [
      {
        question: 'Where is the digital countdown displayed on the Lava Lamp Timer?',
        answer:
          'The remaining MM:SS readout is integrated right into the metallic base of the lava lamp, with a toggle to hide digits if preferred.',
      },
      {
        question: 'Can I adjust how fast the wax blobs rise and merge inside the glass bottle?',
        answer:
          'Yes, switch the Animation Speed between Slow, Normal, and Fast, or enable Reduced Motion for a calm static glow.',
      },
      {
        question: 'Does the Lava Lamp Timer fit cleanly on mobile screens in Fullscreen mode?',
        answer:
          'Yes, the lamp bottle and base readout automatically scale to fit both portrait and landscape mobile viewports without clipping.',
      },
    ],
  },

  'spinner-timer': {
    slug: 'spinner-timer',
    useCasesIntro:
      'A high-visibility rotating dial countdown timer where a sweeping pointer and segmented outer ring track elapsed and remaining time.',
    useCases: [
      'Classroom Game Shows & Station Rotations: Give students a clear rotating dial that sweeps toward the 12 o’clock finish mark.',
      'Group Fitness & Agility Drills: Project a bold spinning countdown on a gym monitor for 1-, 3-, or 5-minute stations.',
      'Family Board Games & Speed Challenges: Time rapid drawing, charades, or word-building rounds on a tablet.',
    ],
    howToUse: [
      'Choose a quick preset (1, 3, 5, 10, or 25 minutes) or enter custom minutes.',
      'Select a Spinner Color Theme and choose Clockwise or Counterclockwise pointer rotation.',
      'Click Start to watch the central pointer and outer progress segments sweep around the dial to 00:00.',
    ],
    faqs: [
      {
        question: 'Is the Spinner Timer a random prize wheel or a deterministic countdown clock?',
        answer:
          'It is a deterministic countdown timer where one full 360-degree sweep of the pointer equals your exact selected duration.',
      },
      {
        question: 'Can I reverse the pointer to spin counterclockwise instead of clockwise?',
        answer:
          'Yes, click the Counterclockwise button in the Rotation Direction controls at any time.',
      },
      {
        question: 'What happens visually when the Spinner Timer reaches zero?',
        answer:
          'The pointer lands at the 12 o’clock completion mark, all dial segments highlight, and your optional chime rings.',
      },
    ],
  },

  'flip-timer': {
    slug: 'flip-timer',
    useCasesIntro:
      'A retro mechanical split-flap countdown timer where oversized hinged number cards flip downward with every passing second.',
    useCases: [
      'Desk Setup & Study-With-Me Videos: Display classic split-flap cards in Classic Black, Retro Cream, or Industrial style.',
      'Podium & Workshop Countdowns: Project oversized mechanical-style numerals that remain crisp from the back of a room.',
      'Focused Pomodoro & Writing Sprints: Run 25- or 50-minute countdowns with bold mid-century typography.',
    ],
    howToUse: [
      'Pick a preset duration (1, 3, 5, 10, or 25 minutes), enter custom minutes, or switch to End Time mode.',
      'Choose a Display Theme (Classic Black, Retro Cream, Industrial, or Modern Dark) and Digit Style.',
      'Click Start and press Fullscreen (F) to watch the split-flap cards flip down to 00:00.',
    ],
    faqs: [
      {
        question: 'How is the Flip Timer different from the Flip Clock?',
        answer:
          'The Flip Timer is a dedicated countdown clock with custom session labels and themes, whereas the Flip Clock also displays live time of day.',
      },
      {
        question: 'Can I disable the 3D card-flip animation if I prefer instant digit changes?',
        answer:
          'Yes, enable the Reduced Motion toggle to update digits cleanly without the hinged flap animation.',
      },
      {
        question: 'What appears on the Flip Timer nameplate when the countdown hits 00:00?',
        answer:
          'The split-flap panels stop at 00:00, the status badge displays "TIME IS UP!", and your optional desk chime plays.',
      },
    ],
  },

  'train-timer': {
    slug: 'train-timer',
    useCasesIntro:
      'A railway departure-board countdown timer combining split-flap station digits with an animated train traveling from START to ARRIVAL.',
    useCases: [
      'Classroom Activity Transitions ("All Aboard!"): Motivate elementary students to finish cleanup before the train reaches the arrival platform.',
      'Workshop & Conference Intermissions: Display "Next Session Departs In..." on a departure board during 10-minute breaks.',
      'Rail Enthusiast & Study Sprints: Track 25-minute focus blocks across Classic, Modern, Vintage, or Night Station themes.',
    ],
    howToUse: [
      'Select a preset duration (1, 3, 5, 10, or 25 minutes) or enter custom minutes.',
      'Type a custom departure board label (such as "NEXT ACTIVITY" or "BREAK ENDS") and choose a Station Theme and Train Style.',
      'Click Start to watch the split-flap board count down while the train moves along the route track to ARRIVAL.',
    ],
    faqs: [
      {
        question: 'Does the Train Timer show real public transit schedules or live train departures?',
        answer:
          'No, it is a customizable railway-themed countdown timer where the train’s journey from Start to Arrival matches your set duration.',
      },
      {
        question: 'Can I customize the destination or session title on the departure board?',
        answer:
          'Yes, type any label into the Session Name input and it appears in railway signage letters at the top of the board.',
      },
      {
        question: 'Which locomotive styles can I switch between on the route track?',
        answer:
          'You can choose Classic Commuter, High-Speed Bullet Train, Vintage Steam Locomotive, or Metro Subway Car.',
      },
    ],
  },

  'forest-fire-timer': {
    slug: 'forest-fire-timer',
    useCasesIntro:
      'A high-urgency stylized nature countdown timer where warm glowing embers and flames spread across an illustrated forest silhouette.',
    useCases: [
      'Escape Rooms & Tabletop RPG Scenarios: Add dramatic visual urgency to a 5- or 10-minute puzzle or rescue challenge.',
      'High-Energy Classroom Trivia & Brainstorms: Use a vivid spreading-ember visual when teams race against the clock.',
      'Anti-Procrastination Speed Sprints: Beat the spreading flame by finishing a quick chore or inbox cleanup before 00:00.',
    ],
    howToUse: [
      'Pick a preset duration (1, 3, 5, 10, or 25 minutes) or enter custom minutes.',
      'Select a Forest Scene (Classic Forest, Pine Valley, Autumn Woods, or Mountain Ridge) and adjust the Animation Intensity slider.',
      'Click Start to watch the stylized ember glow progress across the tree line as time counts down.',
    ],
    faqs: [
      {
        question: 'Is the Forest Fire Timer a real wildfire tracker or emergency alert tool?',
        answer:
          'No, it is purely an illustrated countdown visualization for games, classrooms, and focus sprints—never an emergency or weather service.',
      },
      {
        question: 'Can I tone down the flickering flame and ember particles for a calmer screen?',
        answer:
          'Yes, lower the Animation Intensity slider or toggle Reduced Motion for a smooth, low-flicker warm horizon.',
      },
      {
        question: 'How does the forest scene indicate how much countdown time has elapsed?',
        answer:
          'The warm amber-orange glow spreads proportionally across the woodland tree line from 0% at start to 100% at 00:00.',
      },
    ],
  },

  'flip-clock': {
    slug: 'flip-clock',
    useCasesIntro:
      'A retro split-flap desk clock combining a Live Time-of-Day Clock (with time-zone selector), a Countdown Timer, and a Stopwatch in one display.',
    useCases: [
      'Full-Screen Desk & Secondary Monitor Clock: Turn an idle iPad, laptop, or second monitor into a minimalist retro flip clock.',
      'Study-With-Me & Livestream Backgrounds: Display a 12-hour AM/PM or 24-hour split-flap clock with optional seconds cards.',
      'All-in-One Workspace Timepiece: Switch tabs inside one tool between live wall time, a focus countdown, and an elapsed stopwatch.',
    ],
    howToUse: [
      'Select your active mode at the top: Live Clock, Countdown, or Stopwatch.',
      'In Live Clock mode, toggle 12-hour or 24-hour format, Show/Hide Seconds, and pick Local Time or any global time zone.',
      'Switch between Dark and Light themes and press Fullscreen (F) for a borderless desk display.',
    ],
    faqs: [
      {
        question: 'What modes are built into the Online Flip Clock?',
        answer:
          'It includes three modes in one interface: a live time-of-day Flip Clock, a configurable Flip Countdown, and a Flip Stopwatch.',
      },
      {
        question: 'Can I display the live Flip Clock for a different time zone like Tokyo or London?',
        answer:
          'Yes, use the Time Zone selector in Live Clock mode to display either your local system clock or major international zones.',
      },
      {
        question: 'Can I hide the flipping seconds cards so only Hours and Minutes are shown?',
        answer:
          'Yes, toggle off "Show Seconds" for a calm two-panel HH:MM desk clock that only flips once per minute.',
      },
    ],
  },

  'sensory-timers': {
    slug: 'sensory-timers',
    useCasesIntro:
      'An interactive directory and live-preview filter for comparing calm, low-distraction visual timers (Sand, Liquid, Bubble, Frost, Snow, Lichen, Moon, and Rainbow).',
    useCases: [
      'Special Education & Neurodivergent Classrooms: Filter specifically for "Low motion", "Soft colors", and "No sound" timers.',
      'Occupational Therapy & Counseling Rooms: Let a child or client preview and pick the visual metaphor they find most soothing.',
      'Quiet Study & Reading Spaces: Compare nature-inspired visual timers side by side before launching full-screen mode.',
    ],
    howToUse: [
      'Check any combination of attribute filters (Low motion, No sound, Soft colors, Numeric display, or Visual-only display).',
      'Click the live Preview toggle on any matching timer card to inspect its motion style right on the page.',
      'Click "Open Timer" on your chosen card to launch the full interactive sensory timer.',
    ],
    faqs: [
      {
        question: 'How do the attribute checkboxes help me choose the right sensory timer?',
        answer:
          'Checking traits like "Low motion" or "Soft colors" narrows the grid to calm nature timers such as Lichen, Frost, Moon, and Sand.',
      },
      {
        question: 'Can I preview a timer’s animation before opening its full page?',
        answer:
          'Yes, every card in the Sensory Visual Timers collection includes an inline interactive preview button.',
      },
      {
        question: 'Do all timers in the sensory collection support silent mode and reduced motion?',
        answer:
          'Yes, every timer in this collection includes a one-click Sound Alert mute toggle and a Reduced Motion accessibility option.',
      },
    ],
  },
};

export const DURATION_SPECIFIC_CONTENT: Record<string, ToolSpecificContent> = {
  '30-second-timer': {
    slug: '30-second-timer',
    useCasesIntro:
      'A pre-set 30-second sprint clock for high-intensity exercise intervals, rapid-fire trivia responses, and quick hygiene or kitchen tasks.',
    useCases: [
      'Core & Conditioning Intervals: Time 30-second planks, hollow holds, jump-rope sprints, or rest transitions.',
      'Elevator Pitch & Lightning Drills: Practice delivering a concise 30-second introduction (~65 words) before networking events.',
      'Handwashing & Sanitizing Protocols: Track a thorough 30-second scrub at classroom or clinic sinks.',
    ],
    howToUse: [
      'Click Start (or press Spacebar) to launch the pre-loaded 00:30 countdown immediately.',
      'Toggle Loop Mode if you want repeating 30-second circuits without touching the screen.',
      'Press R to reset back to 00:30 or F for fullscreen gym visibility.',
    ],
    faqs: [
      {
        question: 'How many words fit comfortably inside a 30-second elevator pitch?',
        answer:
          'At a natural conversational pace of 130 words per minute, a crisp 30-second pitch is approximately 60 to 65 words.',
      },
      {
        question: 'Can I set the 30-Second Timer to repeat continuously for circuit training?',
        answer:
          'Yes, enable the Loop toggle so the timer chimes at 00:00 and restarts 00:30 automatically for every station.',
      },
      {
        question: 'How many 30-second intervals fit inside a 10-minute workout block?',
        answer:
          'Ten minutes equals 600 seconds, which divides into exactly twenty 30-second intervals.',
      },
    ],
  },

  '45-second-timer': {
    slug: '45-second-timer',
    useCasesIntro:
      'A ready-to-run 45-second interval clock tailored for circuit training work stations, physical therapy stretches, and speech drills.',
    useCases: [
      '45s/15s Bootcamp Circuits: Work for 45 seconds at each station and use the remaining 15 seconds of the minute to rotate.',
      'Myofascial Release & Stretching: Hold hamstring, hip-flexor, or foam-roller positions for a full 45 seconds per side.',
      'Debate & Interview Answer Practice: Train yourself to answer behavioral interview prompts within a tight 45-second window.',
    ],
    howToUse: [
      'Press Start (or Spacebar) to begin the 00:45 countdown immediately.',
      'Watch the progress ring sweep down and listen for the completion chime at 00:00.',
      'Press R to reset to 45 seconds for your opposite side or next circuit station.',
    ],
    faqs: [
      {
        question: 'Why do fitness coaches pair a 45-second work timer with 15 seconds of transition?',
        answer:
          '45 seconds of work plus 15 seconds of rest equals exactly 60 seconds, keeping every station locked to the top of the clock minute.',
      },
      {
        question: 'Why is 45 seconds recommended for static flexibility stretches?',
        answer:
          'Holding a gentle stretch for 30 to 45 seconds gives muscle spindles time to relax past the initial stretch reflex.',
      },
      {
        question: 'How many seconds is two back-to-back 45-second sets?',
        answer:
          'Two 45-second sets equal 90 seconds (1 minute and 30 seconds) of total time under tension.',
      },
    ],
  },

  '90-second-timer': {
    slug: '90-second-timer',
    useCasesIntro:
      'A 1-minute-30-second countdown timer built for heavy strength-training rest periods, toastmasters evaluations, and classroom transitions.',
    useCases: [
      'Hypertrophy & Barbell Set Recovery: Rest exactly 90 seconds (01:30) between heavy squat, bench, or row sets.',
      'Classroom Station Cleanup & Rotation: Give students 90 seconds to pack materials and move to their next lab table.',
      'Short Video & Reel Scripting: Time 90-second vertical video monologues or product walkthroughs.',
    ],
    howToUse: [
      'Click Start (or press Spacebar) as soon as you rack your barbell or announce a room transition.',
      'Monitor the 01:30 countdown in large digits or fullscreen mode.',
      'Click Reset (R) to reload 01:30 for your next working set.',
    ],
    faqs: [
      {
        question: 'Why is a 90-second rest timer ideal between hypertrophy lifting sets?',
        answer:
          '90 seconds replenishes roughly 80–85% of intramuscular ATP-CP energy stores while keeping workout density high.',
      },
      {
        question: 'What is 90 seconds expressed in decimal minutes?',
        answer:
          '90 seconds divided by 60 equals exactly 1.5 minutes (1 minute and 30 seconds).',
      },
      {
        question: 'How many words is a 90-second video script at a normal speaking pace?',
        answer:
          'At 130 to 140 words per minute, a 90-second script is roughly 195 to 210 words.',
      },
    ],
  },

  '1-minute-timer': {
    slug: '1-minute-timer',
    useCasesIntro:
      'A 60-second countdown timer for one-minute fluency reads, EMOM workout sets, plank tests, and rapid-fire party games.',
    useCases: [
      'Reading Fluency & WPM Assessments: Time 60-second oral reading passages or typing speed tests.',
      '60-Second Fitness & Boxing Corner Rests: Measure exact 1-minute recovery periods between sparring or conditioning rounds.',
      'Board Game & Charades Rounds: Run strict 60-second clue-giving turns on a phone or tablet.',
    ],
    howToUse: [
      'Press Start (or hit Spacebar) to start the 01:00 (60-second) countdown immediately.',
      'Enable Loop Mode if you are running continuous 1-minute EMOM (Every Minute on the Minute) intervals.',
      'Press R to reset to 01:00 between turns or contestants.',
    ],
    faqs: [
      {
        question: 'How do teachers use a 1-Minute Timer for oral reading fluency (ORF) checks?',
        answer:
          'The student reads aloud for exactly 60 seconds while the teacher marks errors; Total Words Read minus Errors equals Words Correct Per Minute.',
      },
      {
        question: 'How can I use the 1-Minute Timer for an EMOM workout?',
        answer:
          'Turn on Loop Mode before clicking Start so the chime sounds every 60 seconds and immediately restarts the next minute.',
      },
      {
        question: 'How many 1-minute rounds fit in a 15-minute practice block?',
        answer:
          'Exactly 15 back-to-back 60-second rounds.',
      },
    ],
  },

  '2-minute-timer': {
    slug: '2-minute-timer',
    useCasesIntro:
      'A 120-second countdown clock designed for ADA-recommended toothbrushing, Toastmasters Table Topics speeches, and two-minute productivity rules.',
    useCases: [
      'Dental Hygiene (2-Minute Brush): Spend 30 seconds on each of the four mouth quadrants until 02:00 reaches zero.',
      'Toastmasters Table Topics & Pitch Practice: Deliver a structured 2-minute impromptu response with a clear conclusion.',
      'David Allen’s "Two-Minute Rule": Knock out quick emails or desk tasks that take under 120 seconds immediately.',
    ],
    howToUse: [
      'Click Start (or press Spacebar) to begin the 02:00 countdown.',
      'Watch the 30-second marks (1:30, 1:00, 0:30) to pace mouth quadrants or speech points.',
      'Press Reset (R) to reload 02:00 in a single click.',
    ],
    faqs: [
      {
        question: 'How do you divide a 2-Minute Timer when brushing your teeth?',
        answer:
          'Brush the upper-right quadrant from 2:00 to 1:30, upper-left to 1:00, lower-left to 0:30, and lower-right until 0:00.',
      },
      {
        question: 'What is the productivity "Two-Minute Rule"?',
        answer:
          'Popularized in Getting Things Done (GTD), it states that if an action takes less than 2 minutes, do it right now rather than queueing it.',
      },
      {
        question: 'How many seconds are in a 2-minute countdown?',
        answer:
          '2 minutes equals 120 seconds.',
      },
    ],
  },

  '3-minute-timer': {
    slug: '3-minute-timer',
    useCasesIntro:
      'A 180-second countdown timer calibrated for boxing rounds, Three Minute Thesis (3MT) talks, green tea steeping, and board games.',
    useCases: [
      'Pro Boxing & Muay Thai Rounds: Run standard 3-minute heavy-bag or sparring rounds (180 seconds).',
      'Three Minute Thesis (3MT) & Pitch Competitions: Rehearse academic research pitches where exceeding 3:00 results in disqualification.',
      'Culinary & Tea Timing: Steep delicate green or oolong tea or cook instant ramen noodles for exactly 3 minutes.',
    ],
    howToUse: [
      'Press Start (or Spacebar) to launch the pre-set 03:00 countdown.',
      'Click Fullscreen (F) when rehearsing a 3MT talk or hitting the heavy bag from across the room.',
      'Use Reset (R) or Loop Mode for consecutive 3-minute rounds.',
    ],
    faqs: [
      {
        question: 'What are the timing rules for a university Three Minute Thesis (3MT) competition?',
        answer:
          'Presenters have strictly 3 minutes (180 seconds) and a single static slide; speaking past the 3:00 chime disqualifies the entry.',
      },
      {
        question: 'How many words is a well-paced 3-minute speech?',
        answer:
          'At a clear 130 words-per-minute pace, a 3-minute presentation script is roughly 380 to 400 words.',
      },
      {
        question: 'Why do many classic word and party board games use a 3-minute timer?',
        answer:
          '180 seconds is long enough for deep word-finding in Boggle or Pictionary without leaving other players waiting too long.',
      },
    ],
  },

  '4-minute-timer': {
    slug: '4-minute-timer',
    useCasesIntro:
      'A 240-second countdown timer built for French press coffee extraction, 4-minute Tabata blocks, and classroom partner shares.',
    useCases: [
      'French Press Coffee Brewing: Steep coarse coffee grounds for the gold-standard 4 minutes (240 seconds) before plunging.',
      'Full Tabata Workout Block: Track the complete 4-minute duration of an 8-round 20s/10s Tabata finisher.',
      'Balanced Pair-Share Discussions: Give Partner A 2 minutes and Partner B 2 minutes inside a single 4-minute window.',
    ],
    howToUse: [
      'Click Start (or hit Spacebar) as soon as you pour hot water into your French press or begin a pair-share.',
      'At 02:00 remaining, switch speaking partners or stir the coffee crust if desired.',
      'When the chime sounds at 00:00, plunge and pour immediately or reconvene the class.',
    ],
    faqs: [
      {
        question: 'Why is 4 minutes the standard steep time for a French press?',
        answer:
          'Coarse-ground immersion coffee requires 4 minutes (240 seconds) for water to dissolve balanced sugars and oils without over-extracting bitterness.',
      },
      {
        question: 'How do teachers split a 4-Minute Timer for Think-Pair-Share activities?',
        answer:
          'Give students 1 minute to think silently, 90 seconds for Partner A to share, and 90 seconds for Partner B to respond.',
      },
      {
        question: 'What is 4 minutes in total seconds and decimal hours?',
        answer:
          '4 minutes equals 240 seconds, or 0.0667 decimal hours.',
      },
    ],
  },

  '5-minute-timer': {
    slug: '5-minute-timer',
    useCasesIntro:
      'A 300-second countdown timer for Pomodoro short breaks, classroom bell-ringer warmups, ignite talks, and anti-procrastination starts.',
    useCases: [
      'Pomodoro Short Breaks: Step away from your monitor for a bounded 5-minute rest between 25-minute work sprints.',
      'Classroom Bell-Ringer Warmups: Project 05:00 on the smartboard as students enter and complete their opening prompt.',
      'Ignite Talks & Lightning Demos: Keep 5-minute conference lightning talks strictly on schedule.',
    ],
    howToUse: [
      'Click Start (or press Spacebar) to launch the 05:00 countdown in one click.',
      'Press F for fullscreen projection on a classroom board or meeting display.',
      'Listen for the acoustic completion bell at 00:00 or press M for silent visual mode.',
    ],
    faqs: [
      {
        question: 'How does the "5-Minute Rule" help overcome task procrastination?',
        answer:
          'Commit to working on a dreaded task for just 5 minutes; once the 05:00 clock starts, momentum usually carries you forward.',
      },
      {
        question: 'How many slides and words fit in a 5-minute Ignite lightning talk?',
        answer:
          'Standard Ignite talks use 20 slides that auto-advance every 15 seconds (300 seconds total) with roughly 650 spoken words.',
      },
      {
        question: 'How many 5-minute blocks are in 1 hour?',
        answer:
          'There are twelve 5-minute blocks in a 60-minute hour.',
      },
    ],
  },

  '6-minute-timer': {
    slug: '6-minute-timer',
    useCasesIntro:
      'A 360-second countdown clock used for the clinical 6-Minute Walk Test (6MWT), jammy soft-boiled eggs, and Toastmasters Icebreakers.',
    useCases: [
      'Jammy Medium-Soft Boiled Eggs: Boil large eggs in simmering water for 6 minutes before plunging into an ice bath.',
      '6-Minute Walk Endurance Pacing: Track a 360-second walking or ergometer conditioning test.',
      'PechaKucha & Icebreaker Speeches: Time a 4-to-6 minute Toastmasters Icebreaker speech up to its 6:00 maximum mark.',
    ],
    howToUse: [
      'Press Start (or Spacebar) to begin the 06:00 (360-second) countdown.',
      'Monitor the halfway mark at 03:00 and final minute at 01:00 on the high-contrast display.',
      'Click Reset (R) to return to 06:00 when finished.',
    ],
    faqs: [
      {
        question: 'What yolk texture does a 6-minute boiled egg produce?',
        answer:
          'Lowering a large cold egg into simmering water for 6 minutes followed by an ice bath produces set whites and a glossy, jammy yolk.',
      },
      {
        question: 'Why is 6 minutes equal to 0.10 decimal hours on timesheets?',
        answer:
          'Because 6 minutes is exactly one-tenth of a 60-minute hour (6 ÷ 60 = 0.10), many legal and consulting firms bill in 6-minute increments.',
      },
      {
        question: 'How many seconds are in a 6-minute countdown?',
        answer:
          '6 minutes equals 360 seconds.',
      },
    ],
  },

  '7-minute-timer': {
    slug: '7-minute-timer',
    useCasesIntro:
      'A 420-second countdown timer built for the scientific 7-Minute Workout, British Parliamentary debate speeches, and Toastmasters speeches.',
    useCases: [
      'Scientific 7-Minute Bodyweight Circuit: Complete 12 exercises (30s work / 10s transition) inside a 7-minute window.',
      'British Parliamentary Debate Speeches: Track standard 7-minute constructive speeches from opening to double bell.',
      'Toastmasters Prepared Speeches (5–7m): Practice concluding your prepared speech right before the 7:00 red limit.',
    ],
    howToUse: [
      'Click Start (or hit Spacebar) to begin the 07:00 countdown.',
      'Use Fullscreen (F) so debaters, speakers, or home athletes can read the clock from across the room.',
      'Press Pause to freeze the clock or R to reset to 07:00.',
    ],
    faqs: [
      {
        question: 'What is the structure of the classic 7-Minute Workout?',
        answer:
          'It sequences 12 bodyweight exercises (jumping jacks, wall sit, push-ups, crunches, step-ups, squats, dips, plank, high knees, lunges, push-up rotations, side plank) for 30s each.',
      },
      {
        question: 'Why is 7 minutes the standard limit in British Parliamentary debate and Toastmasters?',
        answer:
          'Both formats use 7:00 (420 seconds) as the maximum time for a full constructive or prepared speech before overtime penalties apply.',
      },
      {
        question: 'How many words is a 7-minute speech at 130 words per minute?',
        answer:
          'Approximately 910 words.',
      },
    ],
  },

  '8-minute-timer': {
    slug: '8-minute-timer',
    useCasesIntro:
      'A 480-second countdown timer ideal for Crazy 8s UX design sketching, World Schools debate speeches, al dente pasta, and 8-minute abs.',
    useCases: [
      'Crazy 8s Design Sprint Sketching: Fold a sheet of paper into 8 rectangles and sketch 8 wireframe ideas in 8 minutes (60s per panel).',
      'Al Dente Pasta & Medium Boiled Eggs: Time 8-minute spaghetti boils or firm-centered medium boiled eggs.',
      '8-Minute Core & Tabata Double-Blocks: Run two back-to-back 4-minute Tabata sets or an 8-minute core circuit.',
    ],
    howToUse: [
      'Click Start (or press Spacebar) to launch the 08:00 countdown.',
      'During Crazy 8s workshops, call out each passing minute (7:00, 6:00, 5:00...) so participants move to their next sketch panel.',
      'Press F for fullscreen projection on a design studio or classroom display.',
    ],
    faqs: [
      {
        question: 'How does the "Crazy 8s" UX design sprint exercise use an 8-Minute Timer?',
        answer:
          'Participants fold a page into 8 frames and have strictly 8 minutes (1 minute per frame) to sketch 8 distinct solutions before the bell rings.',
      },
      {
        question: 'What is 8 minutes in total seconds?',
        answer:
          '8 minutes × 60 seconds equals 480 seconds.',
      },
      {
        question: 'How many 8-minute station rotations fit inside a 40-minute class period?',
        answer:
          'Five 8-minute rotations fit cleanly inside 40 minutes.',
      },
    ],
  },

  '9-minute-timer': {
    slug: '9-minute-timer',
    useCasesIntro:
      'A 540-second countdown timer shaped around the classic 9-minute mechanical alarm snooze interval, short baking batches, and classroom stations.',
    useCases: [
      'Classic 9-Minute Power Rest: Take a brief eyes-closed desk rest modeled on the traditional 9-minute clock snooze gear.',
      'Small-Batch Baking & Air-Fryer Cycles: Time 9-minute chocolate chip cookie sheets or air-fried vegetables.',
      '45-Minute Class Five-Station Rotations: Divide a 45-minute school period into five equal 9-minute learning centers.',
    ],
    howToUse: [
      'Click Start (or hit Spacebar) to start the 09:00 (540-second) countdown.',
      'Use Fullscreen (F) or Loop Mode when rotating five groups through 9-minute classroom stations.',
      'Listen for the completion chime at 00:00 or mute audio for silent timing.',
    ],
    faqs: [
      {
        question: 'Why did traditional alarm clocks standardize on a 9-minute snooze interval?',
        answer:
          'Early mechanical gear teeth in 1950s alarm clocks could not easily divide into 10 exact minutes, making 9 minutes the mechanical standard.',
      },
      {
        question: 'Why is a 9-Minute Timer useful for a 45-minute classroom period?',
        answer:
          '45 minutes divided by 5 group stations equals exactly 9 minutes per station.',
      },
      {
        question: 'What is 9 minutes expressed in decimal hours?',
        answer:
          '9 divided by 60 equals 0.15 decimal hours (540 seconds).',
      },
    ],
  },

  '10-minute-timer': {
    slug: '10-minute-timer',
    useCasesIntro:
      'A 600-second countdown timer for 10-minute EMOM workouts, study break intervals, daily mindfulness sits, and hard-boiled eggs.',
    useCases: [
      '50/10 Academic Study Breaks: Take a structured 10-minute screen-free break after every 50-minute deep study block.',
      'Daily Morning Meditation & Journaling: Build a 10-minute daily mindfulness or morning pages habit.',
      'Conference & Workshop Coffee Breaks: Project 10:00 on the main room screen so attendees return to their seats on time.',
    ],
    howToUse: [
      'Press Start (or Spacebar) to launch the 10:00 countdown immediately.',
      'Click Fullscreen (F) to display the shrinking progress ring and large digits across a classroom or meeting room.',
      'Press R to reset to 10:00 or toggle Loop Mode for repeating 10-minute blocks.',
    ],
    faqs: [
      {
        question: 'Why is 10 minutes the standard break length in the 50/10 study method?',
        answer:
          'Pairing 50 minutes of study with a 10-minute break totals 60 minutes, locking every cycle to the top of the clock hour.',
      },
      {
        question: 'How many words is a 10-minute conference presentation at 130 WPM?',
        answer:
          'A 10-minute talk at a conversational 130 words per minute is approximately 1,300 words.',
      },
      {
        question: 'What is 10 minutes in total seconds and decimal hours?',
        answer:
          '10 minutes equals 600 seconds, or one-sixth (0.167) of a decimal hour.',
      },
    ],
  },

  '11-minute-timer': {
    slug: '11-minute-timer',
    useCasesIntro:
      'A 660-second countdown timer suited for the Royal Canadian Air Force 5BX 11-minute fitness routine, baking trays, and custom station blocks.',
    useCases: [
      '5BX 11-Minute Daily Calisthenics: Complete the classic 5-exercise 11-minute physical conditioning chart.',
      'Precision Cookie & Pastry Baking: Catch golden-brown edges on 11-minute cookie batches before they overbake at 12 minutes.',
      '10-Minute Activity + 1-Minute Cleanup: Give students 10 minutes of group work plus a built-in 60-second transition buffer.',
    ],
    howToUse: [
      'Click Start (or hit Spacebar) to start the 11:00 (660-second) countdown.',
      'Watch the progress indicator or switch to Fullscreen (F) for hands-free kitchen or floor visibility.',
      'Press Reset (R) to reload 11:00 for your next oven tray or group rotation.',
    ],
    faqs: [
      {
        question: 'Why do teachers set an 11-Minute Timer for a 10-minute classroom station?',
        answer:
          'Adding 1 extra buffer minute gives students a full 10 minutes of task time plus 60 seconds to clean up and rotate.',
      },
      {
        question: 'What is the 11-minute 5BX exercise plan?',
        answer:
          'Developed by Dr. Bill Orban for the Royal Canadian Air Force, 5BX combines 5 calisthenics and aerobic exercises into a daily 11-minute block.',
      },
      {
        question: 'How many seconds are in an 11-minute countdown?',
        answer:
          '11 minutes × 60 seconds equals 660 seconds.',
      },
    ],
  },

  '12-minute-timer': {
    slug: '12-minute-timer',
    useCasesIntro:
      'A 720-second countdown clock built for the Cooper 12-Minute Run Test, 4-round boxing workouts, and 5-per-hour classroom stations.',
    useCases: [
      'Cooper 12-Minute Aerobic Run Test: Measure maximum distance covered on a 400m track in 12 minutes (720 seconds).',
      'Five-Station 60-Minute Class Period: Divide a 1-hour workshop or class into five equal 12-minute rotations.',
      'Academic Conference Paper Talks: Pace a 12-minute research presentation inside a standard 15-minute conference slot (leaving 3m for Q&A).',
    ],
    howToUse: [
      'Press Start (or Spacebar) to launch the 12:00 countdown.',
      'Use Fullscreen (F) on a trackside tablet, lectern, or classroom whiteboard.',
      'Click Reset (R) or enable Loop Mode when running consecutive 12-minute stations.',
    ],
    faqs: [
      {
        question: 'How is the Cooper 12-Minute Run Test scored?',
        answer:
          'Participants run or walk as far as possible on a flat track for exactly 12 minutes (720 seconds), and total meters covered estimate VO2 max.',
      },
      {
        question: 'Why do academic conferences use a 12-minute timer for a 15-minute speaker slot?',
        answer:
          'Speaking for 12 minutes reserves 2.5 minutes for audience questions and 30 seconds for the next speaker’s laptop handoff.',
      },
      {
        question: 'What is 12 minutes expressed in decimal hours for billing?',
        answer:
          '12 minutes is one-fifth of an hour, or exactly 0.20 decimal hours.',
      },
    ],
  },

  '13-minute-timer': {
    slug: '13-minute-timer',
    useCasesIntro:
      'A 780-second countdown timer for 12-minute activities with a 1-minute transition buffer, artisan baking rounds, and focused study sprints.',
    useCases: [
      'Buffered Classroom Rotations (12m + 1m): Run 12 minutes of lab work plus 60 seconds of station reset inside one 13-minute clock.',
      'Artisan Pizza & Roasting Stages: Time 13-minute par-bakes, covered Dutch-oven bread stages, or broiling intervals.',
      'ACT/SAT Reading Passage Drills: Practice completing an extended reading comprehension set in 13 minutes.',
    ],
    howToUse: [
      'Click Start (or press Spacebar) to begin the 13:00 (780-second) countdown.',
      'Press F for fullscreen visibility across a classroom, kitchen, or study desk.',
      'Press R to reset back to 13:00 when the completion chime sounds.',
    ],
    faqs: [
      {
        question: 'How many seconds are in a 13-minute countdown?',
        answer:
          '13 minutes × 60 seconds equals 780 seconds.',
      },
      {
        question: 'How can I use a 13-Minute Timer to pace a 65-minute class block?',
        answer:
          'A 65-minute block divides evenly into five 13-minute segments (65 ÷ 5 = 13).',
      },
      {
        question: 'Can I mute the 13-Minute Timer chime during quiet test practice?',
        answer:
          'Yes, press M or click the audio toggle to run a silent visual countdown.',
      },
    ],
  },

  '14-minute-timer': {
    slug: '14-minute-timer',
    useCasesIntro:
      'An 840-second countdown timer tailored for 15-minute slots that need a 60-second wrap-up buffer, dual 7-minute debate rounds, and cooking.',
    useCases: [
      'Buffered 15-Minute Meetings (14m + 1m): End a 15-minute standup or 1-on-1 at the 14:00 mark so you have 60 seconds before your next call.',
      'Back-to-Back 7-Minute Speeches: Time a two-speaker debate constructive pair (2 × 7m = 14m) on a single clock.',
      'Baking & Air-Frying Batches: Track 14-minute salmon fillets, scones, or sheet-pan vegetables.',
    ],
    howToUse: [
      'Press Start (or Spacebar) to start the 14:00 (840-second) countdown.',
      'Check the 07:00 midpoint mark when timing paired 7-minute speeches or flipping food halfway.',
      'Click Reset (R) to reload 14:00 for the next round.',
    ],
    faqs: [
      {
        question: 'Why do remote managers set a 14-Minute Timer for a 15-minute calendar meeting?',
        answer:
          'Ending at 14 minutes prevents back-to-back video calls from running late and gives everyone 60 seconds to switch rooms or links.',
      },
      {
        question: 'What is the exact halfway point of a 14-minute countdown?',
        answer:
          '07:00 (420 seconds)—making it easy to flip food in an oven or switch speakers at the midpoint.',
      },
      {
        question: 'How many seconds are in 14 minutes?',
        answer:
          '14 minutes equals 840 seconds.',
      },
    ],
  },

  '15-minute-timer': {
    slug: '15-minute-timer',
    useCasesIntro:
      'A quarter-hour (900-second) countdown timer for Agile daily standups, Pomodoro long breaks, classroom reading blocks, and quarter-hour billing.',
    useCases: [
      'Agile Daily Standup Meetings: Keep engineering team standups inside the strict 15-minute Scrum timebox.',
      'Pomodoro Long Breaks & Coffee Intermissions: Recharge for 15 minutes after completing four 25-minute focus sprints.',
      'Daily Elementary Reading & Music Practice: Log a clean quarter-hour of homework reading or instrument scales.',
    ],
    howToUse: [
      'Click Start (or press Spacebar) to launch the 15:00 countdown immediately.',
      'Press F for fullscreen projection during team standups, conference breaks, or classroom activities.',
      'Enable Loop Mode if you want a quarter-hour chime every 15 minutes.',
    ],
    faqs: [
      {
        question: 'Why does Scrum prescribe a strict 15-minute timebox for the Daily Standup?',
        answer:
          'A 15-minute cap keeps status updates focused on today’s plan and blockers while pushing deep technical debates into separate follow-ups.',
      },
      {
        question: 'What is 15 minutes expressed in decimal hours and total seconds?',
        answer:
          '15 minutes equals 0.25 decimal hours (one quarter of an hour) and 900 seconds.',
      },
      {
        question: 'How many words is a 15-minute keynote talk at 130 words per minute?',
        answer:
          'Approximately 1,950 words.',
      },
    ],
  },

  '18-minute-timer': {
    slug: '18-minute-timer',
    useCasesIntro:
      'A 1,080-second countdown timer famous as the official maximum length of a TED Talk—long enough to be serious, short enough to hold attention.',
    useCases: [
      'TED & TEDx Talk Rehearsals: Practice delivering your entire keynote story and conclusion inside the strict 18:00 TED ceiling.',
      '20-Minute Slot with 2-Minute Buffer: Finish a 20-minute presentation at 18:00 so stage hands have 2 minutes for speaker turnover.',
      'Three-Part 6-Minute Station Blocks: Run three consecutive 6-minute drills or writing prompts inside one 18-minute clock.',
    ],
    howToUse: [
      'Press Start (or Spacebar) as you step onto your rehearsal mark to start the 18:00 countdown.',
      'Click Fullscreen (F) on a floor tablet or laptop to simulate a downstage TED confidence monitor.',
      'Aim to begin your closing takeaway when the clock passes 02:00 remaining.',
    ],
    faqs: [
      {
        question: 'Why are TED Talks capped at strictly 18 minutes?',
        answer:
          'TED curator Chris Anderson set the 18-minute rule because it forces speakers to distill complex ideas before audience cognitive fatigue sets in.',
      },
      {
        question: 'How many words fit in an 18-minute TED-style keynote script?',
        answer:
          'At a deliberate 130 words-per-minute stage pace, an 18-minute talk is roughly 2,250 to 2,350 words.',
      },
      {
        question: 'What is 18 minutes in decimal hours and total seconds?',
        answer:
          '18 minutes equals 0.30 decimal hours (18 ÷ 60) and 1,080 seconds.',
      },
    ],
  },

  '20-minute-timer': {
    slug: '20-minute-timer',
    useCasesIntro:
      'A 1,200-second countdown timer for the 20-20-20 eye-care interval, power naps, AMRAP CrossFit workouts, and 20-minute study blocks.',
    useCases: [
      '20-Minute Power Naps: Rest for 20 minutes to boost afternoon alertness while waking up before slow-wave sleep inertia.',
      '20-20-20 Screen Work Reminders: Loop a 20-minute countdown to remind yourself to look 20 feet away for 20 seconds.',
      '20-Minute AMRAP & EMOM Conditioning: Track 20-minute aerobic workouts or three-per-hour classroom rotations.',
    ],
    howToUse: [
      'Click Start (or hit Spacebar) to start the 20:00 (1,200-second) countdown.',
      'Toggle Loop Mode if using it for recurring 20-minute screen-break reminders.',
      'Press F for fullscreen visibility or R to reset to 20:00.',
    ],
    faqs: [
      {
        question: 'Why do sleep researchers recommend 20 minutes for an afternoon power nap?',
        answer:
          'A 20-minute nap keeps you in lighter Stage 2 non-REM sleep so you wake up refreshed without groggy deep-sleep inertia.',
      },
      {
        question: 'How many 20-minute blocks fit inside 1 hour?',
        answer:
          'Three 20-minute blocks equal exactly 60 minutes (1/3 of an hour, or 0.333 decimal hours each).',
      },
      {
        question: 'How many seconds are in a 20-minute countdown?',
        answer:
          '20 minutes × 60 seconds equals 1,200 seconds.',
      },
    ],
  },

  '25-minute-timer': {
    slug: '25-minute-timer',
    useCasesIntro:
      'A 1,500-second countdown clock preloaded with the classic 25-minute Pomodoro focus sprint duration for deep work and studying.',
    useCases: [
      'Classic 25-Minute Pomodoro Sprints: Focus on a single coding, writing, or study task for 25 uninterrupted minutes.',
      'Speedy 30-Minute Calendar Meetings: Cap half-hour video calls at 25 minutes so teammates get a 5-minute bio break before the top of the hour.',
      'SAT/ACT & Essay Section Practice: Time 25-minute timed essay drafts or problem sets.',
    ],
    howToUse: [
      'Choose a single task, silence phone notifications, and press Start (or Spacebar) to launch the 25:00 countdown.',
      'Work without switching contexts until the completion bell rings at 00:00.',
      'Take a 5-minute break, then press Reset (R) and Start to begin your next 25-minute sprint.',
    ],
    faqs: [
      {
        question: 'Why did Francesco Cirillo choose 25 minutes for the Pomodoro Technique?',
        answer:
          '25 minutes is long enough to enter productive concentration on a task while remaining short enough to resist checking distractions.',
      },
      {
        question: 'Why do many companies schedule 25-minute meetings instead of 30-minute meetings?',
        answer:
          'Ending at :25 or :55 past the hour prevents back-to-back calendar fatigue and gives attendees 5 minutes to transition.',
      },
      {
        question: 'How many seconds are in a 25-minute timer?',
        answer:
          '25 minutes × 60 seconds equals 1,500 seconds.',
      },
    ],
  },

  '30-minute-timer': {
    slug: '30-minute-timer',
    useCasesIntro:
      'A half-hour (1,800-second) countdown clock for 30-minute lunch breaks, client consultations, daily exercise goals, and baking recipes.',
    useCases: [
      'Employee 30-Minute Meal Breaks: Track an exact half-hour unpaid lunch break so you clock back in on time.',
      'Client Discovery & Coaching Calls: Keep 30-minute consultation slots and podcast interviews on pace.',
      'Daily 30-Minute Reading or Cardio Goals: Complete a full half-hour treadmill walk, bike ride, or book session.',
    ],
    howToUse: [
      'Click Start (or press Spacebar) to begin the 30:00 half-hour countdown.',
      'Press F for fullscreen display during meetings, workouts, or kitchen prep.',
      'Click Pause if interrupted, or Reset (R) to return to 30:00.',
    ],
    faqs: [
      {
        question: 'What is 30 minutes in decimal hours and total seconds?',
        answer:
          '30 minutes is 0.50 decimal hours (half an hour) and 1,800 seconds.',
      },
      {
        question: 'How should I structure a 30-minute client or 1-on-1 meeting?',
        answer:
          'Spend 2 minutes on agenda setup, 20 minutes on core discussion, 5 minutes on action items, and wrap up 3 minutes early.',
      },
      {
        question: 'How many pages can an average reader finish during a 30-Minute Timer?',
        answer:
          'At a typical reading pace of 30 to 40 pages per hour, a 30-minute block covers 15 to 20 pages.',
      },
    ],
  },

  '35-minute-timer': {
    slug: '35-minute-timer',
    useCasesIntro:
      'A 2,100-second countdown timer calibrated for SAT/ACT standardized test sections, bread proofing, and 35-minute keynote or sermon blocks.',
    useCases: [
      'Standardized Test Section Practice (ACT/SAT/LSAT): Simulate strict 35-minute reading, science, or logical reasoning test sections.',
      'Baking, Roasting & Bread Proofing: Track 35-minute cake bakes, roasted vegetables, or second dough rises.',
      'Extended Study Sprints: Bridge the gap between a 25-minute Pomodoro and a 50-minute lecture block.',
    ],
    howToUse: [
      'Press Start (or hit Spacebar) when you open your practice test booklet or slide your pan into the oven.',
      'Monitor the large digital readout or switch to silent mode (M) during timed exam practice.',
      'Press Reset (R) to reload 35:00 for the next test section.',
    ],
    faqs: [
      {
        question: 'Which standardized exam sections use a 35-minute time limit?',
        answer:
          'Both the ACT Reading/Science sections and standard LSAT analytical/logical reasoning sections historically use a strict 35-minute clock.',
      },
      {
        question: 'How should I pace 4 passages inside a 35-minute reading test section?',
        answer:
          'Allocate 8 minutes and 30 seconds per passage (34 minutes total), leaving 60 seconds at the end to verify bubbled answers.',
      },
      {
        question: 'How many seconds are in a 35-minute countdown?',
        answer:
          '35 minutes × 60 seconds equals 2,100 seconds.',
      },
    ],
  },

  '40-minute-timer': {
    slug: '40-minute-timer',
    useCasesIntro:
      'A 2,400-second countdown timer built for 40-minute school periods, FIBA/NCAA basketball halves, and Zoom basic meeting caps.',
    useCases: [
      '40-Minute Video Call & Workshop Caps: Keep virtual team meetings inside the classic 40-minute video-conferencing window.',
      'K–12 Lesson & Lab Periods: Pace a 40-minute classroom instructional block (5m warmup, 25m lesson/lab, 10m exit ticket).',
      'Endurance Conditioning & Roasting: Time 40-minute Zone 2 cardio sessions or sheet-pan dinners.',
    ],
    howToUse: [
      'Click Start (or press Spacebar) to launch the 40:00 countdown.',
      'Project in Fullscreen (F) on a classroom smartboard or keep docked beside your video call window.',
      'Press R to reset to 40:00 between class periods.',
    ],
    faqs: [
      {
        question: 'What is 40 minutes expressed as a fraction and decimal of an hour?',
        answer:
          '40 minutes is two-thirds (2/3) of an hour, or 0.67 decimal hours (2,400 seconds).',
      },
      {
        question: 'How do teachers structure a 40-minute classroom period effectively?',
        answer:
          'Use a 5-minute bell-ringer, 15 minutes of direct instruction, 15 minutes of guided practice, and a 5-minute exit summary.',
      },
      {
        question: 'Which sports use 40 minutes of regulation game time?',
        answer:
          'FIBA international basketball, NCAA college basketball (two 20-minute halves), and futsal use 40 minutes of regulation clock time.',
      },
    ],
  },

  '45-minute-timer': {
    slug: '45-minute-timer',
    useCasesIntro:
      'A three-quarter-hour (2,700-second) countdown clock for soccer halves, spin/fitness studio classes, academic periods, and deep study.',
    useCases: [
      '45/15 Deep Study & Coding Cycles: Work deeply for 45 minutes and take a 15-minute recharge break to complete a clean 60-minute hour.',
      'Group Fitness, Spin & Yoga Classes: Pace a 45-minute studio workout (5m warmup, 35m main work, 5m cooldown).',
      'Soccer Halves & Exam Blocks: Track a 45-minute football half or university midterm exam window.',
    ],
    howToUse: [
      'Press Start (or hit Spacebar) to begin the 45:00 (2,700-second) countdown.',
      'Click Fullscreen (F) for studio wall monitors, exam halls, or classroom projection.',
      'Use Pause/Resume if needed or press R to reset to 45:00.',
    ],
    faqs: [
      {
        question: 'What is 45 minutes in decimal hours for payroll and billing?',
        answer:
          '45 minutes is three-quarters (3/4) of an hour, which equals exactly 0.75 decimal hours (2,700 seconds).',
      },
      {
        question: 'Why is the 45/15 work-to-break ratio popular with software developers and writers?',
        answer:
          '45 minutes allows enough uninterrupted runway to load complex code or prose into working memory while still aligning every cycle to 1 clock hour.',
      },
      {
        question: 'Can I silence the 45-Minute Timer for an exam room?',
        answer:
          'Yes, press M or click the mute button so the countdown finishes with a silent visual alert.',
      },
    ],
  },

  '50-minute-timer': {
    slug: '50-minute-timer',
    useCasesIntro:
      'A 3,000-second countdown timer designed for the 50/10 academic study method, university lecture hours, and 50-minute therapy or coaching sessions.',
    useCases: [
      'The 50/10 Academic Study Rule: Study intensively for 50 minutes, then take a 10-minute walk before the next clock hour begins.',
      '50-Minute Therapy & Executive Coaching Sessions: Keep "clinical hour" consultations on schedule while reserving 10 minutes for session notes.',
      'University Lecture & Seminar Pacing: Deliver a 50-minute college lecture allowing 10 minutes for students to walk between buildings.',
    ],
    howToUse: [
      'Click Start (or press Spacebar) at the top of the hour (:00) to launch the 50:00 countdown.',
      'Focus on your lecture, study chapter, or client session until the chime sounds at :50 past the hour.',
      'Use the remaining 10 minutes of the hour for notes and stretching before resetting (R) for the next hour.',
    ],
    faqs: [
      {
        question: 'Why do therapists and universities use a 50-minute "hour" instead of 60 minutes?',
        answer:
          'Ending at :50 past the hour provides a dedicated 10-minute buffer for clinical notes, restroom breaks, and room transitions.',
      },
      {
        question: 'How does the 50/10 study method compare to 25/5 Pomodoros?',
        answer:
          '50/10 cuts the number of context-switching interruptions in half while keeping the exact same 5:1 work-to-rest ratio.',
      },
      {
        question: 'How many seconds are in a 50-minute countdown?',
        answer:
          '50 minutes × 60 seconds equals 3,000 seconds (0.833 decimal hours).',
      },
    ],
  },

  '55-minute-timer': {
    slug: '55-minute-timer',
    useCasesIntro:
      'A 3,300-second countdown timer built for 1-hour meetings, Pilates/barre classes, and workshops that need a 5-minute turnover buffer.',
    useCases: [
      'Buffered 1-Hour Corporate Meetings: Cap 60-minute calendar meetings at 55:00 so every attendee gets 5 minutes before their next call.',
      'Pilates, Barre & Personal Training Sessions: Run a 55-minute client workout leaving 5 minutes to sanitize equipment for the next hour.',
      'Bread Baking & Long Simmers: Time 55-minute sourdough loaf bakes or bone-broth reductions.',
    ],
    howToUse: [
      'Press Start (or Spacebar) at the start of your 1-hour slot to begin the 55:00 countdown.',
      'Project in Fullscreen (F) on the conference room TV or studio wall display.',
      'Wrap up action items when the chime rings at 00:00 so the room clears 5 minutes before the next hour.',
    ],
    faqs: [
      {
        question: 'Why do productivity teams replace 60-minute meetings with a 55-Minute Timer?',
        answer:
          'Back-to-back 60-minute meetings guarantee people arrive late to the next call; a 55-minute hard stop protects a 5-minute transition gap.',
      },
      {
        question: 'How many seconds are in a 55-minute countdown?',
        answer:
          '55 minutes × 60 seconds equals 3,300 seconds (0.917 decimal hours).',
      },
      {
        question: 'Can I pause the 55-Minute Timer if a workshop takes an unscheduled break?',
        answer:
          'Yes, press Spacebar to pause and resume from the exact remaining second at any time.',
      },
    ],
  },

  '60-minute-timer': {
    slug: '60-minute-timer',
    useCasesIntro:
      'A full 1-hour (3,600-second) countdown clock for university exams, escape rooms, webinar broadcasts, and 60-minute culinary roasts.',
    useCases: [
      'University & Certification Exams: Project a high-contrast 60:00 countdown in lecture halls for 1-hour test papers.',
      'Escape Rooms & Hackathon Sprints: Run the classic 60-minute countdown for puzzle rooms or 1-hour coding challenges.',
      '1-Hour Webinars & Fitness Classes: Track a full 60-minute broadcast, spin class, or slow-roast recipe.',
    ],
    howToUse: [
      'Click Start (or press Spacebar) to launch the 60:00 (1-hour) countdown.',
      'Press F for fullscreen projection so students, players, or athletes can read the clock from across the room.',
      'Use Mute (M) for silent exam proctoring or leave the chime enabled for an audible 1-hour bell.',
    ],
    faqs: [
      {
        question: 'How many seconds are in a 60-minute (1-hour) timer?',
        answer:
          '60 minutes × 60 seconds per minute equals 3,600 seconds.',
      },
      {
        question: 'Why do escape rooms standardize on a 60-Minute Timer?',
        answer:
          'One full hour provides enough time for teams to solve 10 to 15 multi-step puzzles while fitting cleanly into hourly venue booking slots.',
      },
      {
        question: 'How can I divide a 60-minute webinar using this timer?',
        answer:
          'Aim to finish your welcome by 55:00 remaining, complete your main presentation by 15:00 remaining, and use the final 15 minutes for live Q&A.',
      },
    ],
  },

  '90-minute-timer': {
    slug: '90-minute-timer',
    useCasesIntro:
      'A 1.5-hour (5,400-second) countdown timer aligned with the human 90-minute ultradian focus cycle, full soccer matches, and university block exams.',
    useCases: [
      '90-Minute Ultradian Deep-Work Blocks: Tackle your hardest engineering, research, or writing work in one 90-minute morning block.',
      'University Block Lectures & Final Exams: Procter 90-minute (1 hour 30 minute) seminar blocks and mock exams.',
      'Feature Film Scripting & Full Soccer Matches: Track 90 minutes of regulation match time or long-form rehearsal.',
    ],
    howToUse: [
      'Press Start (or hit Spacebar) to launch the 90:00 (1h 30m) countdown.',
      'Click Fullscreen (F) for lecture-hall exam proctoring or studio display.',
      'After the 90-minute block completes at 00:00, take a 20-minute screen-free recovery break.',
    ],
    faqs: [
      {
        question: 'What is the 90-minute Basic Rest-Activity Cycle (BRAC) in productivity research?',
        answer:
          'Discovered by sleep researcher Nathaniel Kleitman, human alertness naturally peaks and troughs in ~90-minute ultradian waves throughout the day.',
      },
      {
        question: 'What is 90 minutes expressed in hours, decimal hours, and seconds?',
        answer:
          '90 minutes equals 1 hour and 30 minutes, 1.50 decimal hours, and 5,400 total seconds.',
      },
      {
        question: 'How long should I rest after finishing a 90-minute deep work block?',
        answer:
          'A 15- to 20-minute screen-free walk, hydration break, or snack allows cognitive focus to reset before your next block.',
      },
    ],
  },
};

export function getToolSpecificContent(slug: string): ToolSpecificContent | undefined {
  return TOOL_SPECIFIC_CONTENT[slug] || DURATION_SPECIFIC_CONTENT[slug];
}

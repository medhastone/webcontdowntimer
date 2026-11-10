export type DurationTierKind = 'sprint' | 'tactical' | 'deep-block';

export interface DurationPacingSplit {
  phase: string;
  timeWindow: string;
  sharePercent: number;
  practitionerAction: string;
}

export interface DurationPageData {
  slug: string;
  tier: DurationTierKind;
  tierBadge: string;
  h1: string;
  seoTitle: string;
  metaDescription: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  totalSeconds: number;
  unitLabel: string; // e.g., "4 Minutes" or "30 Seconds"
  spelledOut: string; // e.g., "four-minute"
  introParagraphs: string[];
  pacingTitle: string;
  pacingSplits: DurationPacingSplit[];
  comparisonTableTitle: string;
  comparisonColumns: [string, string, string];
  comparisonRows: Array<[string, string, string]>;
  practitionerFieldNote: {
    title: string;
    body: string;
  };
  howToUseTitle: string;
  howToUseSteps: string[];
  whenToUseTitle: string;
  whenToUseIntro: string;
  whenToUseExamples: Array<{
    title: string;
    description: string;
  }>;
  featuresTitle: string;
  featuresList: string[];
  relatedDurations: Array<{
    slug: string;
    label: string;
    description: string;
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

const NUMBER_WORDS: Record<number, string> = {
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four',
  5: 'five',
  6: 'six',
  7: 'seven',
  8: 'eight',
  9: 'nine',
  10: 'ten',
  11: 'eleven',
  12: 'twelve',
  13: 'thirteen',
  14: 'fourteen',
  15: 'fifteen',
  18: 'eighteen',
  20: 'twenty',
  25: 'twenty-five',
  30: 'thirty',
  35: 'thirty-five',
  40: 'forty',
  45: 'forty-five',
  50: 'fifty',
  55: 'fifty-five',
  60: 'sixty',
  90: 'ninety',
};

// Domain-specific realistic use cases per minute duration so no two pages have duplicate filler
const DURATION_SPECIFIC_USES: Record<
  string,
  {
    intro: string;
    examples: Array<{ title: string; description: string }>;
  }
> = {
  '1-minute-timer': {
    intro:
      'A one-minute countdown (60 seconds) is ideal for high-intensity bursts, quick classroom transitions, and rapid daily habits.',
    examples: [
      {
        title: 'Plank & Core Holds',
        description:
          'Hold a standard forearm plank, wall sit, or hollow-body hold for a full 60-second set.',
      },
      {
        title: 'Speed Reading & Fluency Drills',
        description:
          'Measure words read per minute (WPM) in elementary reading assessments and speech warmups.',
      },
      {
        title: 'One-Minute Pitch & Icebreakers',
        description:
          'Give each meeting participant 60 seconds to share a status update or elevator pitch.',
      },
      {
        title: 'Mindful Box Breathing Reset',
        description:
          'Complete four 15-second breathing cycles to calm your nervous system between meetings.',
      },
    ],
  },
  '2-minute-timer': {
    intro:
      'A two-minute countdown (120 seconds) matches dental hygiene recommendations, short kitchen steps, and productivity micro-tasks.',
    examples: [
      {
        title: 'Toothbrushing Routine',
        description:
          'Dentists recommend brushing for a full two minutes—30 seconds per quadrant of your mouth.',
      },
      {
        title: 'The "Two-Minute Rule" for Tasks',
        description:
          'Clear small emails, desk clutter, or quick replies that take less than 120 seconds to finish.',
      },
      {
        title: 'Classroom Turn-and-Talk',
        description:
          'Give student pairs two minutes to compare notes or brainstorm before sharing with the class.',
      },
      {
        title: 'Between-Set Weightlifting Rest',
        description:
          'Rest exactly 120 seconds between heavy compound lifts to restore ATP energy.',
      },
    ],
  },
  '3-minute-timer': {
    intro:
      'A three-minute countdown (180 seconds) is a classic interval for boxing rounds, kitchen steeping, and structured speaking.',
    examples: [
      {
        title: 'Standard Boxing & MMA Rounds',
        description:
          'Time full three-minute sparring, heavy bag, or shadowboxing rounds at home or in the gym.',
      },
      {
        title: 'Soft-Boiled Eggs & Green Tea',
        description:
          'Steep loose-leaf green tea or simmer soft-boiled eggs with runny yolks for 180 seconds.',
      },
      {
        title: 'Three-Minute Thesis (3MT) Practice',
        description:
          'Rehearse academic or startup presentations that require explaining a complex topic in three minutes.',
      },
      {
        title: 'Quick Brainstorming Sprint',
        description:
          'Write down as many ideas or solutions as possible before the 3-minute alarm rings.',
      },
    ],
  },
  '4-minute-timer': {
    intro:
      'A four-minute countdown (240 seconds) powers Tabata training protocols, French press coffee brewing, and focused classroom stations.',
    examples: [
      {
        title: 'Complete Tabata Workout Block',
        description:
          'Run a full 4-minute Tabata cycle (eight 20-second all-out effort intervals paired with 10-second rests).',
      },
      {
        title: 'French Press Coffee Extraction',
        description:
          'Steep coarse-ground coffee in hot water for exactly four minutes before pressing the plunger.',
      },
      {
        title: 'Debate Cross-Examination & Rebuttal',
        description:
          'Keep competitive high school and parliamentary debate speeches strictly on schedule.',
      },
      {
        title: 'Short Classroom Cleanup & Transition',
        description:
          'Give students a clear four-minute window to pack materials and move to their next learning station.',
      },
    ],
  },
  '5-minute-timer': {
    intro:
      'A five-minute countdown (300 seconds) is the universal standard for Pomodoro short breaks, daily standups, and classroom warmups.',
    examples: [
      {
        title: 'Pomodoro Short Break',
        description:
          'Step away from your screen, stretch, and hydrate for five minutes after a 25-minute focus sprint.',
      },
      {
        title: 'Bell-Ringer Classroom Warmup',
        description:
          'Start class with a 5-minute review prompt or math drill on the projector.',
      },
      {
        title: 'Overcoming Procrastination',
        description:
          'Commit to working on a difficult project for just five minutes to build momentum.',
      },
      {
        title: 'Lightning Talk & Demo',
        description:
          'Pace 5-minute conference lightning talks and product demos so you finish right on cue.',
      },
    ],
  },
  '6-minute-timer': {
    intro:
      'A six-minute countdown (360 seconds) is widely used in clinical walking tests, soft-cooked eggs, and billable time increments.',
    examples: [
      {
        title: 'Six-Minute Walk Test (6MWT)',
        description:
          'Measure functional exercise capacity and endurance across a flat 6-minute walking course.',
      },
      {
        title: 'Jammy Ramen Eggs',
        description:
          'Boil large eggs for exactly six minutes before transferring to an ice bath for jammy yolks.',
      },
      {
        title: '0.1 Hour Billable Increment',
        description:
          'Six minutes equals 0.1 decimal hours—the standard minimum unit for legal and consulting timesheets.',
      },
      {
        title: 'PechaKucha Presentation Pacing',
        description:
          'Practice a 6-minute-40-second visual deck or a tight 6-minute executive briefing.',
      },
    ],
  },
  '7-minute-timer': {
    intro:
      'A seven-minute countdown (420 seconds) is famous for the scientific 7-Minute Workout and structured Toastmasters speeches.',
    examples: [
      {
        title: 'Scientific 7-Minute Circuit',
        description:
          'Complete 12 bodyweight exercises for 30 seconds each with 10-second transitions.',
      },
      {
        title: 'Toastmasters Speech Upper Limit',
        description:
          'Standard 5-to-7-minute club speeches reach their final red card signal at the 7-minute mark.',
      },
      {
        title: 'Al Dente Pasta Cooking',
        description:
          'Boil dried spaghetti, penne, or macaroni for seven minutes before testing texture.',
      },
      {
        title: 'Small-Group Workshop Rotation',
        description:
          'Rotate breakout groups every seven minutes during collaborative design sprints.',
      },
    ],
  },
  '8-minute-timer': {
    intro:
      'An eight-minute countdown (480 seconds) is ideal for EMOM fitness sets, speed networking rounds, and focused writing exercises.',
    examples: [
      {
        title: '8-Minute Abs & EMOM Workouts',
        description:
          'Run an "Every Minute on the Minute" conditioning block for eight consecutive rounds.',
      },
      {
        title: 'Crazy 8s Design Sketching',
        description:
          'Fold a sheet of paper into eight rectangles and sketch eight distinct UI concepts in 8 minutes.',
      },
      {
        title: 'Hard-Boiled Eggs (Firm Yolk)',
        description:
          'Simmer eggs for 8 minutes for a creamy yet firm yolk suitable for salads and slicing.',
      },
      {
        title: 'Speed Networking & Interview Stations',
        description:
          'Run structured 8-minute one-on-one conversation rounds at career fairs and team mixers.',
      },
    ],
  },
  '9-minute-timer': {
    intro:
      'A nine-minute countdown (540 seconds) matches traditional alarm snooze intervals, baking steps, and presentation rehearsals.',
    examples: [
      {
        title: 'Classic 9-Minute Power Rest',
        description:
          'Inspired by mechanical clock gear ratios, a 9-minute rest lets you close your eyes without entering deep sleep.',
      },
      {
        title: '9-Minute Core & Mobility Flow',
        description:
          'Combine three 3-minute mobility blocks for hips, thoracic spine, and shoulders.',
      },
      {
        title: 'Batch Cookie Par-Bake',
        description:
          'Bake drop cookies for 9 minutes so centers stay soft while edges turn golden brown.',
      },
      {
        title: 'Classroom Reading Station',
        description:
          'Run three 9-minute literacy or math centers inside a 30-minute instructional block.',
      },
    ],
  },
  '10-minute-timer': {
    intro:
      'A ten-minute countdown (600 seconds) is one of the most versatile intervals for daily tidying, meditation, and study sprints.',
    examples: [
      {
        title: '10-Minute Daily Reset & Tidy',
        description:
          'Set a timer for 10 minutes each evening to clear surfaces and prep your workspace for tomorrow.',
      },
      {
        title: 'Daily Mindfulness Meditation',
        description:
          'Sit quietly for 600 seconds of breath awareness without checking your phone.',
      },
      {
        title: '10-Minute Freewriting Warmup',
        description:
          'Write continuously for ten minutes without editing to break through writer’s block.',
      },
      {
        title: 'Conference Q&A Session',
        description:
          'Keep post-keynote audience question-and-answer sessions strictly within their 10-minute slot.',
      },
    ],
  },
  '12-minute-timer': {
    intro:
      'A twelve-minute countdown (720 seconds) is the benchmark for the Cooper 12-minute run test, basketball quarters, and classroom stations.',
    examples: [
      {
        title: 'Cooper 12-Minute Run Test',
        description:
          'Measure aerobic VO2 max fitness by tracking how far you can run or walk in exactly 12 minutes.',
      },
      {
        title: 'Basketball Quarter Timing',
        description:
          'Regulation pro basketball quarters and intramural scrimmage halves frequently use a 12-minute clock.',
      },
      {
        title: '0.2 Decimal Hour Task Block',
        description:
          'Twelve minutes equals 0.2 hours—ideal for logging short client calls and support tickets.',
      },
      {
        title: 'Air Fryer & Oven Roasting',
        description:
          'Crisp vegetables, salmon fillets, or frozen appetizers in an air fryer for 12 minutes.',
      },
    ],
  },
  '15-minute-timer': {
    intro:
      'A fifteen-minute countdown (900 seconds) represents a quarter-hour block—ideal for daily standups, power naps, and study intervals.',
    examples: [
      {
        title: 'Agile Daily Standup Meeting',
        description:
          'Keep engineering and product team syncs focused and under the 15-minute timebox.',
      },
      {
        title: 'Quarter-Hour Billable Tracking',
        description:
          'Fifteen minutes equals 0.25 decimal hours, the standard billing block for freelancers and agencies.',
      },
      {
        title: 'Pomodoro Long Break',
        description:
          'Recharge for 15 minutes after completing four consecutive focus sessions.',
      },
      {
        title: '15-Minute Study & Piano Practice',
        description:
          'Build consistent daily habits with an approachable 15-minute practice commitment.',
      },
    ],
  },
  '20-minute-timer': {
    intro:
      'A twenty-minute countdown (1,200 seconds) is the sweet spot for power naps, TED-style talks, and the 20-20-20 eye care rule.',
    examples: [
      {
        title: 'Stage-2 Power Nap',
        description:
          'Nap for 20 minutes to boost alertness and motor learning while waking up before slow-wave grogginess.',
      },
      {
        title: '20-20-20 Eye Strain Relief',
        description:
          'Every 20 minutes of screen work, look at an object 20 feet away for 20 seconds.',
      },
      {
        title: '20-Minute AMRAP Conditioning',
        description:
          'Complete "As Many Rounds As Possible" in a 20-minute functional fitness workout.',
      },
      {
        title: 'Keynote & TED-Style Rehearsal',
        description:
          'TED talks are capped at 18–20 minutes to hold peak audience attention.',
      },
    ],
  },
  '25-minute-timer': {
    intro:
      'A twenty-five-minute countdown (1,500 seconds) is the core work sprint of the world-famous Pomodoro Technique.',
    examples: [
      {
        title: 'Classic Pomodoro Focus Session',
        description:
          'Dedicate 25 uninterrupted minutes to a single deep-work task before taking a 5-minute break.',
      },
      {
        title: 'Exam Essay Section Pacing',
        description:
          'Allocate 25 minutes to outline, draft, and proofread a timed standardized test essay.',
      },
      {
        title: 'Focused Coding & Debugging Sprint',
        description:
          'Silence notifications for 1,500 seconds while solving a complex engineering ticket.',
      },
      {
        title: 'Roasting Sheet-Pan Meals',
        description:
          'Bake sheet-pan chicken, root vegetables, or sourdough rolls for 25 minutes.',
      },
    ],
  },
  '30-minute-timer': {
    intro:
      'A thirty-minute countdown (1,800 seconds) provides a full half-hour block for workouts, meetings, cooking, and deep study.',
    examples: [
      {
        title: 'Half-Hour 1-on-1 Meetings',
        description:
          'Keep client calls, interviews, and coaching sessions on track without spilling into the next half hour.',
      },
      {
        title: '30-Minute Cardio & Run Session',
        description:
          'Meet daily physical activity guidelines with a brisk 30-minute run, cycle, or swim.',
      },
      {
        title: 'Independent Reading & Homework',
        description:
          'Give students a clear half-hour window for evening reading logs and homework.',
      },
      {
        title: 'Bread Dough Proofing & Marinades',
        description:
          'Rest yeast dough or marinate proteins for 30 minutes at room temperature.',
      },
    ],
  },
  '35-minute-timer': {
    intro:
      'A thirty-five-minute countdown (2,100 seconds) fits standardized test sections, extended workouts, and baking recipes.',
    examples: [
      {
        title: 'SAT / ACT Practice Test Section',
        description:
          'Simulate real exam conditions for 35-minute reading, science, and math modules.',
      },
      {
        title: 'Cake & Brownie Baking',
        description:
          'Many 9x13 pan cakes, banana breads, and fudge brownies bake for 35 minutes at 350°F.',
      },
      {
        title: 'Extended Classroom Lab Activity',
        description:
          'Give students 35 minutes of hands-on lab experimentation inside a 45-minute class period.',
      },
      {
        title: 'Deep Focus Writing Block',
        description:
          'Step up from a 25-minute Pomodoro when you need extra flow time for long-form writing.',
      },
    ],
  },
  '40-minute-timer': {
    intro:
      'A forty-minute countdown (2,400 seconds) aligns with standard school periods, webinar sessions, and endurance training.',
    examples: [
      {
        title: 'Classroom Lesson & Lecture Block',
        description:
          'Pace a 40-minute instructional period while leaving 5 minutes for wrap-up and exit tickets.',
      },
      {
        title: 'Virtual Webinar & Zoom Session',
        description:
          'Structure group meetings and online workshops cleanly within a 40-minute window.',
      },
      {
        title: 'Zone-2 Aerobic Endurance',
        description:
          'Maintain a steady heart rate for 40 minutes on an indoor bike, rower, or trail.',
      },
      {
        title: 'Braising & Casserole Baking',
        description:
          'Bake lasagna, enchiladas, or roasted whole vegetables for 40 minutes.',
      },
    ],
  },
  '45-minute-timer': {
    intro:
      'A forty-five-minute countdown (2,700 seconds) equals three-quarters of an hour (0.75 decimal hours)—ideal for classes, soccer halves, and deep work.',
    examples: [
      {
        title: 'Regulation Soccer Half',
        description:
          'Track 45-minute match halves and conditioning scrimmages on the pitch.',
      },
      {
        title: 'Group Fitness & Spin Class',
        description:
          'Lead a complete 45-minute studio workout including warmup, peak intervals, and cooldown.',
      },
      {
        title: 'University Seminar & Workshop',
        description:
          'Deliver a comprehensive 45-minute lecture or training module with clear time visibility.',
      },
      {
        title: 'Laundry Wash Cycle Reminder',
        description:
          'Set a 45-minute alert so you can transfer wet laundry to the dryer right when the wash finishes.',
      },
    ],
  },
  '50-minute-timer': {
    intro:
      'A fifty-minute countdown (3,000 seconds) powers the popular 50/10 Ultradian deep-work cycle and standard academic lectures.',
    examples: [
      {
        title: '50/10 Deep Work Productivity Cycle',
        description:
          'Work with complete concentration for 50 minutes, followed by a 10-minute restorative walk.',
      },
      {
        title: 'University Lecture Hour',
        description:
          'Most college "1-hour" classes run for 50 minutes to allow 10 minutes of campus passing time.',
      },
      {
        title: 'Therapy & Coaching Session',
        description:
          'Maintain a respectful 50-minute clinical hour while keeping 10 minutes for session notes.',
      },
      {
        title: 'Artisan Bread Loaf Baking',
        description:
          'Bake Dutch-oven sourdough or yeast loaves for 50 minutes until deeply caramelized.',
      },
    ],
  },
  '60-minute-timer': {
    intro:
      'A sixty-minute countdown (3,600 seconds / 1 hour) provides a full-hour clock for exams, workouts, webinars, and deep project blocks.',
    examples: [
      {
        title: 'Full-Hour Exam & Certification Practice',
        description:
          'Take timed 60-minute mock exams with a large, distraction-free fullscreen display.',
      },
      {
        title: '1-Hour Strength & Conditioning Session',
        description:
          'Keep your entire gym session—from dynamic warmup to final stretch—inside 60 minutes.',
      },
      {
        title: 'Client Workshop & Webinar',
        description:
          'Keep 1-hour client workshops, board meetings, and panel discussions strictly on schedule.',
      },
      {
        title: 'Slow Simmering & Stock Reduction',
        description:
          'Simmer soups, sauces, or bone broths for a full hour with an audible completion chime.',
      },
    ],
  },
  '11-minute-timer': {
    intro:
      'An eleven-minute countdown (660 seconds) is used for al dente thick pasta shapes, medium-hard boiled eggs, and structured 10-minute talks with a 1-minute wrap-up buffer.',
    examples: [
      {
        title: 'Rigatoni & Penne Al Dente Cooking',
        description:
          'Thick tubular pastas like rigatoni, tortiglioni, and large penne typically require 11 minutes in salted boiling water.',
      },
      {
        title: '10-Minute Pitch + 1-Minute Buffer',
        description:
          'Give presenters 10 minutes for core slides plus a 60-second transition buffer before the next speaker.',
      },
      {
        title: 'Firm Hard-Boiled Eggs (Large)',
        description:
          'Boil large refrigerator-cold eggs for 11 minutes for a fully set yolk without a chalky ring.',
      },
      {
        title: 'Vocabulary & Math Fluency Drill',
        description:
          'Run a 10-minute timed worksheet with 1 extra minute for students to check their work.',
      },
    ],
  },
  '13-minute-timer': {
    intro:
      'A thirteen-minute countdown (780 seconds) works well for baking small-batch cookies, farfalle and fusilli pasta, and 12-minute Cooper test warm-ups.',
    examples: [
      {
        title: 'Golden Chocolate Chip Cookies',
        description:
          'Bake standard drop cookies at 350°F (175°C) for 13 minutes until edges are golden brown and centers remain soft.',
      },
      {
        title: 'Farfalle & Conchiglie Pasta',
        description:
          'Dense pinched pasta shapes like bow-tie farfalle often take 13 minutes to cook evenly through the center.',
      },
      {
        title: 'Academic Paper Abstract & Outline Sprint',
        description:
          'Spend 13 focused minutes drafting a structured outline before writing a full section.',
      },
      {
        title: 'Small-Group Breakout Rotation',
        description:
          'Give three students 4 minutes each to share findings plus 1 minute to summarize.',
      },
    ],
  },
  '14-minute-timer': {
    intro:
      'A fourteen-minute countdown (840 seconds) fits steamed dumplings and vegetables, double-length 7-minute debate speeches, and mid-length reading blocks.',
    examples: [
      {
        title: 'Steaming Vegetables & Dumplings',
        description:
          'Steam broccoli florets, carrots, or frozen dumplings for 14 minutes until tender.',
      },
      {
        title: 'Two-Speaker Debate Segment (2 × 7 Min)',
        description:
          'Time back-to-back 7-minute parliamentary constructive speeches within a single 14-minute block.',
      },
      {
        title: 'Sheet-Pan Salmon Fillet',
        description:
          'Roast 1-inch salmon fillets at 400°F (200°C) for 14 minutes for flaky, moist results.',
      },
      {
        title: 'Focused Code Review Window',
        description:
          'Review pull requests for 14 minutes before a scheduled 15-minute team standup.',
      },
    ],
  },
  '18-minute-timer': {
    intro:
      'An eighteen-minute countdown (1,080 seconds) is the classic maximum length of a TED-style keynote talk, as well as the standard simmer time for white jasmine or basmati rice.',
    examples: [
      {
        title: 'TED-Style Keynote Rehearsal',
        description:
          'Conference keynotes are famously capped at 18 minutes—long enough to develop a serious idea, yet short enough to hold full audience attention.',
      },
      {
        title: 'Steamed Jasmine & Basmati Rice',
        description:
          'Simmer covered white rice on low heat for 18 minutes before fluffing with a fork.',
      },
      {
        title: ' Muffin & Cupcake Baking',
        description:
          'Bake standard 12-cup muffin tins at 375°F (190°C) for 18 minutes until a toothpick comes out clean.',
      },
      {
        title: 'Three-Station Circuit (3 × 6 Min)',
        description:
          'Run three 6-minute skill or conditioning stations inside one continuous 18-minute block.',
      },
    ],
  },
  '55-minute-timer': {
    intro:
      'A fifty-five-minute countdown (3,300 seconds / 0.92 decimal hours) is the standard length for studio fitness classes, university seminars, and 1-hour meetings that end 5 minutes early.',
    examples: [
      {
        title: '55-Minute Meeting Rule',
        description:
          'Cap 60-minute calendar meetings at 55 minutes so remote and in-person attendees have 5 minutes to stretch and transition.',
      },
      {
        title: 'Pilates, Spin & Yoga Studio Class',
        description:
          'Most commercial group fitness classes run for 55 minutes to allow 5 minutes for equipment wipe-down and room turnover.',
      },
      {
        title: 'Deep Focus Hour + 5-Minute Buffer',
        description:
          'Work uninterrupted on architecture, writing, or analysis for 55 minutes before taking a 5-minute break.',
      },
      {
        title: 'Whole Roasted Chicken or Lasagna',
        description:
          'Bake covered lasagna or roast poultry for 55 minutes before checking internal temperature.',
      },
    ],
  },
  '90-minute-timer': {
    intro:
      'A ninety-minute countdown (5,400 seconds / 1.5 hours) matches a full ultradian deep-work cycle, a standard soccer match duration, and university block lectures.',
    examples: [
      {
        title: 'Ultradian Deep-Work Session (1.5 Hours)',
        description:
          'Human alertness naturally cycles in roughly 90-minute waves. Use a 90-minute timer for deep engineering, research, or writing followed by a 20-minute rest.',
      },
      {
        title: 'University Block Lecture & Lab Exam',
        description:
          'Project a 90-minute countdown on the lecture hall screen for midterms, coding assessments, and seminar workshops.',
      },
      {
        title: '90-Minute Soccer / Football Match Equivalent',
        description:
          'Track full 90-minute scrimmages, endurance runs, or long cycling zone-2 rides.',
      },
      {
        title: 'Bread Bulk Fermentation & Proofing',
        description:
          'Time 90-minute yeast dough rises and sourdough stretch-and-fold intervals accurately.',
      },
    ],
  },
  '30-second-timer': {
    intro:
      'A thirty-second countdown (0.5 minutes) is built for HIIT work/rest sprints, stretching holds, elevator pitches, and rapid trivia lightning rounds.',
    examples: [
      {
        title: '30-Second HIIT & Plank Holds',
        description:
          'Time 30-second high-intensity burpees, mountain climbers, hollow holds, or static hamstring stretches.',
      },
      {
        title: '30-Second Soap Handwashing',
        description:
          'Public health guidelines recommend scrubbing hands with soap for 20 to 30 seconds before rinsing.',
      },
      {
        title: 'Coffee Bloom & Espresso Extraction',
        description:
          'Bloom fresh pour-over coffee grounds or pull a double espresso shot over a 30-second window.',
      },
      {
        title: 'Rapid Trivia & Quiz Response',
        description:
          'Give game-night teams 30 seconds to lock in their answer before the buzzer sounds.',
      },
    ],
  },
  '45-second-timer': {
    intro:
      'A forty-five-second countdown (0.75 minutes) is the standard work phase for circuit training (45s work / 15s rest) and pour-over coffee blooming.',
    examples: [
      {
        title: '45/15 Circuit Training Interval',
        description:
          'Work for 45 seconds and rest for 15 seconds at each gym station to keep every set aligned to the minute.',
      },
      {
        title: 'V60 Pour-Over Coffee Bloom',
        description:
          'Wait 45 seconds after wetting freshly ground coffee so trapped CO₂ gas escapes before the main pour.',
      },
      {
        title: 'Mobility & Myofascial Foam Rolling',
        description:
          'Spend 45 seconds rolling each major muscle group (calves, quads, thoracic spine) during warm-up or recovery.',
      },
      {
        title: 'Impromptu Speaking Drill',
        description:
          'Practice delivering a concise answer to an interview or panel question in 45 seconds.',
      },
    ],
  },
  '90-second-timer': {
    intro:
      'A ninety-second countdown (1 minute 30 seconds) is ideal for heavy strength-training rest periods between sets, AeroPress coffee brewing, and Toastmasters Table Topics.',
    examples: [
      {
        title: 'Hypertrophy & Strength Rest Between Sets',
        description:
          'Resting 90 seconds between compound lifts (squats, bench press, rows) replenishes ATP while keeping workout density high.',
      },
      {
        title: 'AeroPress Coffee Steep Time',
        description:
          'Steep inverted or standard AeroPress coffee for 90 seconds before pressing gently through the filter.',
      },
      {
        title: 'Toastmasters Table Topics Amber Target',
        description:
          'In 1-to-2 minute Table Topics speeches, 90 seconds (1:30) is the exact midpoint where the amber signal appears.',
      },
      {
        title: 'Cold Plunge & Contrast Shower Interval',
        description:
          'Time a 90-second cold rinse or breath-recovery interval with a clear countdown readout.',
      },
    ],
  },
};

export const APPROVED_DURATION_SLUGS = [
  '1-minute-timer',
  '2-minute-timer',
  '3-minute-timer',
  '4-minute-timer',
  '5-minute-timer',
  '6-minute-timer',
  '7-minute-timer',
  '8-minute-timer',
  '9-minute-timer',
  '10-minute-timer',
  '11-minute-timer',
  '12-minute-timer',
  '13-minute-timer',
  '14-minute-timer',
  '15-minute-timer',
  '18-minute-timer',
  '20-minute-timer',
  '25-minute-timer',
  '30-minute-timer',
  '35-minute-timer',
  '40-minute-timer',
  '45-minute-timer',
  '50-minute-timer',
  '55-minute-timer',
  '60-minute-timer',
  '90-minute-timer',
  '30-second-timer',
  '45-second-timer',
  '90-second-timer',
];

function formatSecToMMSS(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function getDurationPageData(slug: string): DurationPageData | null {
  const minMatch = /^(\d+)-minute-timer$/.exec(slug);
  const secMatch = /^(\d+)-second-timer$/.exec(slug);

  if (!minMatch && !secMatch) return null;

  const isMinutes = Boolean(minMatch);
  const value = Number(isMinutes ? minMatch![1] : secMatch![1]);
  if (value <= 0 || value > 1440) return null;

  const totalSeconds = isMinutes ? value * 60 : value;
  const word = NUMBER_WORDS[value] || `${value}`;
  const unitSingular = isMinutes ? 'minute' : 'second';
  const unitPlural = value === 1 ? unitSingular : `${unitSingular}s`;
  const unitCapitalized = isMinutes ? 'Minute' : 'Second';

  const h1 = `${value} ${unitCapitalized} Timer`;
  const primaryKeyword = `${value} ${unitSingular} timer`;
  const shortUnit = isMinutes ? 'min' : 'sec';

  // Determine structural tier based on human usage patterns
  const tier: DurationTierKind =
    totalSeconds <= 120
      ? 'sprint'
      : totalSeconds <= 900
      ? 'tactical'
      : 'deep-block';

  const tierBadge =
    tier === 'sprint'
      ? 'SPRINT, HOLD & MICRO-DRILL LAYOUT'
      : tier === 'tactical'
      ? 'TACTICAL ROTATION & KITCHEN THERMAL LAYOUT'
      : 'DEEP COGNITIVE & SESSION BLOCK LAYOUT';

  const secondaryKeywords = isMinutes
    ? [
        `${value} min timer`,
        `timer for ${value} ${unitPlural}`,
        `set a timer for ${value} ${unitPlural}`,
        `${word} minute countdown`,
        `online ${value} minute timer`,
        `${totalSeconds} second timer`,
      ]
    : [
        `${value} sec timer`,
        `timer for ${value} seconds`,
        `set a timer for ${value} seconds`,
        `${word} second countdown`,
        `online ${value} second timer`,
      ];

  const seoTitle = `${h1} (${totalSeconds.toLocaleString()}s) – Pacing Guide & Online Countdown | WebCountDownTimer`;

  const customUse = DURATION_SPECIFIC_USES[slug];
  const whenToUseIntro = customUse
    ? customUse.intro
    : `A ${word}-${unitSingular} countdown (${totalSeconds.toLocaleString()} seconds) gives you an exact, drift-free boundary for ${
        tier === 'sprint'
          ? 'isometric holds, speed drills, and rapid turn-taking'
          : tier === 'tactical'
          ? 'kitchen thermal stages, classroom station rotations, and stand-up updates'
          : 'deep cognitive work, university blocks, and structured endurance sets'
      }.`;

  const whenToUseExamples = customUse
    ? customUse.examples
    : [
        {
          title: `Focused ${value}-${unitCapitalized} Sprint`,
          description: `Work on a single deliverable for ${value} ${unitPlural} (${totalSeconds.toLocaleString()}s) before taking a scheduled break.`,
        },
        {
          title: 'Classroom & Workshop Pacing',
          description: `Project the ${value} ${shortUnit} clock in fullscreen so every participant sees the exact remaining window.`,
        },
        {
          title: 'Conditioning & Mobility Sets',
          description: `Use the acoustic chime to mark the finish of a ${value}-${unitSingular} training block or recovery window.`,
        },
        {
          title: 'Culinary & Lab Timing',
          description: `Keep the tab open while simmering, steeping, or resting steps that call for an exact ${value}-${unitSingular} hold.`,
        },
      ];

  // Build 3 concrete pacing splits based on exact seconds and tier
  const s1 = Math.round(totalSeconds * 0.25);
  const s2 = Math.round(totalSeconds * 0.75);
  const ex0Title = whenToUseExamples[0]?.title || `${value}-${unitCapitalized} Block`;
  const ex1Title = whenToUseExamples[1]?.title || 'Secondary Application';

  const pacingTitle =
    tier === 'sprint'
      ? `Second-by-Second Split Breakdown Across ${totalSeconds} Seconds`
      : tier === 'tactical'
      ? `How to Pace a ${value}-${unitCapitalized} Window Without Rushing the Finish`
      : `Structuring a ${value}-${unitCapitalized} Session Across Three Energy Phases`;

  const pacingSplits: DurationPacingSplit[] =
    tier === 'sprint'
      ? [
          {
            phase: 'Phase 1 · Initial Lock-In',
            timeWindow: `${formatSecToMMSS(totalSeconds)} → ${formatSecToMMSS(totalSeconds - s1)}`,
            sharePercent: 25,
            practitionerAction: `Set your posture, grip, or opening cadence for ${ex0Title.toLowerCase()}. Avoid starting too fast in the first ${s1} seconds.`,
          },
          {
            phase: 'Phase 2 · Core Hold & Rhythm',
            timeWindow: `${formatSecToMMSS(totalSeconds - s1)} → ${formatSecToMMSS(totalSeconds - s2)}`,
            sharePercent: 50,
            practitionerAction: `Maintain steady nasal breathing and repeatable mechanics through the middle ${s2 - s1} seconds (${Math.round(totalSeconds / 2)}s halfway mark).`,
          },
          {
            phase: 'Phase 3 · Final Drive to 00:00',
            timeWindow: `${formatSecToMMSS(totalSeconds - s2)} → 00:00`,
            sharePercent: 25,
            practitionerAction: `Hold form through the final ${totalSeconds - s2}-second burn until the acoustic chime sounds at 00:00.`,
          },
        ]
      : tier === 'tactical'
      ? [
          {
            phase: 'Stage 1 · Launch & Framing',
            timeWindow: `First ${formatSecToMMSS(s1)} (0%–25%)`,
            sharePercent: 25,
            practitionerAction: `Get materials, heat, or prompt in place during the opening ${s1} seconds so the group or recipe starts cleanly.`,
          },
          {
            phase: 'Stage 2 · Active Execution',
            timeWindow: `Middle ${formatSecToMMSS(s2 - s1)} (25%–75%)`,
            sharePercent: 50,
            practitionerAction: `Core execution window for ${ex0Title.toLowerCase()} and ${ex1Title.toLowerCase()}. Check progress as the clock crosses ${formatSecToMMSS(Math.round(totalSeconds / 2))}.`,
          },
          {
            phase: 'Stage 3 · Wrap & Handoff',
            timeWindow: `Final ${formatSecToMMSS(totalSeconds - s2)} (75%–100%)`,
            sharePercent: 25,
            practitionerAction: `Use the final ${totalSeconds - s2} seconds to plate, summarize key takeaways, or rotate to the next station before 00:00.`,
          },
        ]
      : [
          {
            phase: 'Phase 1 · Context & Ramp-Up',
            timeWindow: `Minutes 0 to ${Math.max(1, Math.round(value * 0.15))} (15%)`,
            sharePercent: 15,
            practitionerAction: `Close messaging tabs, outline your single objective for this ${value}-minute block, and load necessary reference files.`,
          },
          {
            phase: 'Phase 2 · Uninterrupted Deep Work',
            timeWindow: `Minutes ${Math.max(1, Math.round(value * 0.15))} to ${Math.round(value * 0.85)} (70%)`,
            sharePercent: 70,
            practitionerAction: `Peak cognitive output window (${Math.round(totalSeconds * 0.7)} seconds). Jot stray thoughts on paper rather than switching browser tabs.`,
          },
          {
            phase: 'Phase 3 · Review & Recovery Buffer',
            timeWindow: `Final ${Math.max(1, value - Math.round(value * 0.85))} Minutes (15%)`,
            sharePercent: 15,
            practitionerAction: `Proofread work, commit code, or log next steps before stepping away from the screen at the 00:00 bell.`,
          },
        ];

  const decimalMinutes = Number((totalSeconds / 60).toFixed(2));
  const decimalHours = Number((totalSeconds / 3600).toFixed(3));

  // Build bespoke comparison table per tier and duration
  const comparisonTableTitle =
    tier === 'sprint'
      ? `How ${value} ${unitCapitalized}${value === 1 ? '' : 's'} Compares to Adjacent Sprint Intervals`
      : tier === 'tactical'
      ? `${value}-${unitCapitalized} Checkpoint & Task Allocation Matrix`
      : `Pacing a ${value}-${unitCapitalized} Block vs. Adjacent Session Lengths`;

  const comparisonColumns: [string, string, string] =
    tier === 'sprint'
      ? ['Interval Length', 'Exact Seconds & Ratio', 'Best Practical Fit']
      : tier === 'tactical'
      ? ['Use Case', 'Midpoint Check (`50%`)', 'Completion Action at `00:00`']
      : ['Block Metric', `Value for ${value} ${unitCapitalized}s`, 'Why It Matters for Scheduling'];

  const comparisonRows: Array<[string, string, string]> =
    tier === 'sprint'
      ? [
          [
            `Shorter Sprint (${Math.max(10, totalSeconds - 15)}s)`,
            `${Math.max(10, totalSeconds - 15)} seconds`,
            'Explosive max-effort reps or quick transitions',
          ],
          [
            `This ${h1} (${formatSecToMMSS(totalSeconds)})`,
            `${totalSeconds} seconds (${decimalMinutes} min)`,
            `${ex0Title} and ${ex1Title}`,
          ],
          [
            `Extended Hold (${totalSeconds + 30}s)`,
            `${totalSeconds + 30} seconds (${Number(((totalSeconds + 30) / 60).toFixed(2))} min)`,
            'Progression target once current duration feels comfortable',
          ],
        ]
      : tier === 'tactical'
      ? whenToUseExamples.slice(0, 4).map((ex) => [
          ex.title,
          `Check status at ${formatSecToMMSS(Math.round(totalSeconds / 2))} left`,
          ex.description,
        ])
      : [
          [
            'Total Seconds & Minutes',
            `${totalSeconds.toLocaleString()} sec · ${decimalMinutes} min`,
            `Exact duration for ${ex0Title.toLowerCase()}`,
          ],
          [
            'Payroll / Billing Decimal Hours',
            `${decimalHours} decimal hours`,
            `Multiply ${decimalHours} by hourly rate for exact timesheet billing`,
          ],
          [
            'Halfway Milestone Mark',
            `${formatSecToMMSS(Math.round(totalSeconds / 2))} remaining`,
            'Check that 50% of your exam questions, slides, or agenda items are complete',
          ],
          [
            'Recommended Post-Block Break',
            `${Math.max(5, Math.round(value * 0.2))} minutes rest`,
            'Stand up, hydrate, and rest visual focus before starting another block',
          ],
        ];

  const practitionerFieldNote =
    tier === 'sprint'
      ? {
          title: `Coach’s Note on Timing ${totalSeconds}-Second Holds`,
          body: `On short ${totalSeconds}-second efforts, looking at a phone in your hand ruins neck and shoulder alignment. Set your device on the floor or stand, press Spacebar (or tap Start), and rely on the acoustic chime at 00:00 so your posture stays locked in.`,
        }
      : tier === 'tactical'
      ? {
          title: `Why ${value} Minutes (${totalSeconds.toLocaleString()} Seconds) Is a High-Leverage Tactical Window`,
          body: `A ${value}-minute countdown is short enough that participants feel immediate momentum, yet long enough to complete ${ex0Title.toLowerCase()} thoroughly. If you switch browser tabs while working, our epoch-delta clock recalculates the exact remaining millisecond automatically.`,
        }
      : {
          title: `Protecting a ${value}-Minute Block from Context Switching`,
          body: `Research on cognitive context switching shows it takes 15+ minutes to regain deep concentration after checking a single chat notification. During this ${value}-minute (${decimalHours}-hour) block, pin this tab so you can glance at the live MM:SS countdown in the browser tab title without leaving your workspace.`,
        };

  // Build adjacent related duration links
  const candidateMinutes = [1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 20, 25, 30, 35, 40, 45, 50, 60];
  const relatedDurations = candidateMinutes
    .filter((m) => (isMinutes ? m !== value : true))
    .sort((a, b) => Math.abs(a - (isMinutes ? value : 1)) - Math.abs(b - (isMinutes ? value : 1)))
    .slice(0, 6)
    .sort((a, b) => a - b)
    .map((m) => ({
      slug: `${m}-minute-timer`,
      label: `${m}-Minute Timer`,
      description: `${m * 60} seconds online countdown`,
    }));

  // Varied, human-written intro paragraphs by tier so pages never share identical opening copy
  const introParagraphs =
    tier === 'sprint'
      ? [
          `${whenToUseIntro} Pre-loaded to ${formatSecToMMSS(totalSeconds)} (${totalSeconds} exact seconds), this ${primaryKeyword} starts with a single click or Spacebar tap—so you never waste half your sprint fumbling with duration spinners.`,
          `Whether you are timing ${ex0Title.toLowerCase()}, ${ex1Title.toLowerCase()}, or rapid interval repeats with Loop Mode enabled, the monotonic browser clock tracks every millisecond accurately and sounds a clean acoustic chime at 00:00.`,
        ]
      : tier === 'tactical'
      ? [
          `${whenToUseIntro} This ${primaryKeyword} comes ready at ${formatSecToMMSS(totalSeconds)} (${totalSeconds.toLocaleString()} seconds / ${decimalHours} decimal hours) for immediate one-click timing in the kitchen, classroom, or meeting room.`,
          `Press Start (or hit Spacebar) to launch the countdown, expand to Fullscreen (F) when projecting across a room, or enable Loop Mode when running back-to-back ${value}-${unitSingular} rotations.`,
        ]
      : [
          `${whenToUseIntro} Spanning ${totalSeconds.toLocaleString()} seconds (${decimalHours} decimal hours), this ${primaryKeyword} anchors your finish time to your device’s system epoch—meaning background tab throttling never causes your ${value}-minute block to drift.`,
          `Use it in Fullscreen Mode for lecture halls and practice exams, or keep it pinned in a background tab while the live browser tab title tracks your remaining minutes through ${ex0Title.toLowerCase()}.`,
        ];

  const howToUseTitle =
    tier === 'sprint'
      ? `Running Your ${value}-${unitCapitalized} Sprint Hands-Free`
      : tier === 'tactical'
      ? `Quick Setup for Your ${value}-${unitCapitalized} Countdown`
      : `Setting Up a Distraction-Free ${value}-${unitCapitalized} Session`;

  const howToUseSteps =
    tier === 'sprint'
      ? [
          `Press the Spacebar or click Start to launch the ${formatSecToMMSS(totalSeconds)} sprint immediately.`,
          `Enable Loop Mode before starting if you are repeating back-to-back ${value}-${unitSingular} sets or turns.`,
          `Tap Pause to freeze the clock mid-rep if interrupted, or press R to snap straight back to ${formatSecToMMSS(totalSeconds)}.`,
          `Press F for Fullscreen landscape view so you can read the digits from your gym mat or game table.`,
        ]
      : tier === 'tactical'
      ? [
          `Click Start (or tap Spacebar) to begin the ${value}-${unitSingular} (${totalSeconds.toLocaleString()}s) countdown.`,
          `Check your halfway progress at the ${formatSecToMMSS(Math.round(totalSeconds / 2))} mark (${Math.round(totalSeconds / 2)} seconds remaining).`,
          `Toggle Loop Mode on if you are running recurring ${value}-minute classroom stations or stand-up rounds.`,
          `Use Fullscreen Mode (F) to display high-contrast digits on a smartboard, TV, or kitchen tablet.`,
        ]
      : [
          `Confirm your audio chime is unmuted and click Start to lock in your ${value}-minute (${decimalHours} hr) block.`,
          `Work in your main application while the live remaining MM:SS updates inside this browser tab’s title bar.`,
          `Use the ${formatSecToMMSS(Math.round(totalSeconds / 2))} halfway mark to audit your pace on ${ex0Title.toLowerCase()}.`,
          `When the 00:00 chime sounds, step away for a ${Math.max(5, Math.round(value * 0.2))}-minute non-screen recovery break before resetting.`,
        ];

  return {
    slug,
    tier,
    tierBadge,
    h1,
    seoTitle,
    metaDescription: isMinutes
      ? `Free ${value}-${unitSingular} timer (${totalSeconds.toLocaleString()} seconds / ${decimalHours} hrs) for ${ex0Title.toLowerCase()} and ${ex1Title.toLowerCase()}. Drift-free countdown with fullscreen, loop, and chime.`
      : `Free ${value}-second timer (${decimalMinutes} mins) for ${ex0Title.toLowerCase()} and ${ex1Title.toLowerCase()}. Millisecond-accurate sprint countdown with loop and fullscreen mode.`,
    primaryKeyword,
    secondaryKeywords,
    totalSeconds,
    unitLabel: `${value} ${unitCapitalized}${value === 1 ? '' : 's'}`,
    spelledOut: `${word}-${unitSingular}`,
    introParagraphs,
    pacingTitle,
    pacingSplits,
    comparisonTableTitle,
    comparisonColumns,
    comparisonRows,
    practitionerFieldNote,
    howToUseTitle,
    howToUseSteps,
    whenToUseTitle: `Best Real-World Uses for a ${value}-${unitCapitalized} Timer`,
    whenToUseIntro,
    whenToUseExamples,
    featuresTitle: `Built-In Timing Controls for ${value} ${unitCapitalized}${value === 1 ? '' : 's'}`,
    featuresList: [
      `Pre-loaded to ${formatSecToMMSS(totalSeconds)} (${totalSeconds.toLocaleString()} total seconds) for zero-setup launch.`,
      'Epoch-delta timing engine (`Date.now()`) that never loses time when backgrounded.',
      'Synthesized Web Audio completion chime with instant Mute / Sound On toggle.',
      `One-click Loop Mode for repeating ${value}-${unitSingular} circuits, turns, and rotations.`,
      'Edge-to-edge Fullscreen projection (`F` hotkey) with Screen Wake Lock support.',
    ],
    relatedDurations,
    faqs: [
      {
        question: `How many seconds and decimal hours are in ${value} ${unitPlural}?`,
        answer: isMinutes
          ? `${value} ${unitPlural} equals exactly ${totalSeconds.toLocaleString()} seconds (${value} × 60). For payroll or timesheet billing, ${value} ${unitPlural} equals ${decimalHours} decimal hours (${value} ÷ 60), with an exact halfway mark at ${formatSecToMMSS(Math.round(totalSeconds / 2))}.`
          : `${value} seconds equals ${decimalMinutes} minutes (${value} ÷ 60) or ${decimalHours} decimal hours, with an exact halfway mark at ${value / 2} seconds.`,
      },
      {
        question: `What are the most common uses for a ${value}-${unitSingular} countdown?`,
        answer: `Practitioners most frequently use a ${value}-${unitSingular} timer for ${whenToUseExamples.map((e) => e.title.toLowerCase()).join(', ')}.`,
      },
      {
        question: `Will this ${value}-${unitSingular} timer stay accurate if I switch browser tabs?`,
        answer: `Yes. Instead of relying on frame counters that slow down in background tabs, this timer calculates remaining time from your system clock’s epoch timestamp—so your ${totalSeconds.toLocaleString()}-second countdown stays accurate to the millisecond while you work in other tabs.`,
      },
      {
        question: `Can I make the ${value}-${unitSingular} timer repeat automatically?`,
        answer: `Yes. Toggle the Loop button on before or during your countdown, and the clock will sound its chime at 00:00 and immediately restart from ${formatSecToMMSS(totalSeconds)} for continuous rounds.`,
      },
    ],
  };
}

export const DURATION_TIMERS_DATA: Record<string, DurationPageData> = Object.fromEntries(
  APPROVED_DURATION_SLUGS.map((slug) => [slug, getDurationPageData(slug)!])
);


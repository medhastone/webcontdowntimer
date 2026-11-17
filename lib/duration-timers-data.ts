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

export const KEPT_MINUTE_TIMERS = [1, 5, 10, 15, 30, 60] as const;

export const REDIRECTED_MINUTE_TIMERS = [
  2, 3, 4, 6, 7, 8, 9, 11, 12, 13, 14, 18, 20, 25, 35, 40, 45, 50, 55, 90,
] as const;

export const APPROVED_DURATION_SLUGS = [
  '1-minute-timer',
  '5-minute-timer',
  '10-minute-timer',
  '15-minute-timer',
  '30-minute-timer',
  '60-minute-timer',
  '30-second-timer',
  '45-second-timer',
  '90-second-timer',
];

function formatSecToMMSS(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

interface BespokeDurationEditorial {
  h1: string;
  seoTitle: string;
  metaDescription: string;
  introParagraphs: string[];
  practitionerFieldNote: {
    title: string;
    body: string;
  };
  pacingTitle: string;
  pacingSplits: DurationPacingSplit[];
  howToUseTitle: string;
  howToUseSteps: string[];
  featuresTitle: string;
  featuresList: string[];
  faqs: Array<{ question: string; answer: string }>;
}

const BESPOKE_DURATION_EDITORIAL: Record<string, BespokeDurationEditorial> = {
  '30-second-timer': {
    h1: '30-Second Timer for Dental Quadrants, Static Stretches & Speed Drills',
    seoTitle: '30-Second Timer (00:30) – Dental Quadrant & Stretch Clock | WebCountDownTimer',
    metaDescription:
      'Run a 30-second timer for ADA dental quadrant brushing, Golgi tendon static stretching, and explosive plyometric sets with instant Spacebar restart and loop mode.',
    introParagraphs: [
      'A 30-second countdown is the foundational micro-interval in preventive dentistry, sports physical therapy, and broadcast pacing. In clinical mobility work, holding a static stretch for at least 30 seconds is the physiological threshold required for the Golgi tendon organ (GTO) to override the myotatic stretch reflex and allow muscle fibers to lengthen safely.',
      'Dentists likewise divide the standard two-minute brushing routine into four 30-second quadrants (upper right, upper left, lower left, lower right) so plaque removal stays uniform across every molar surface. In high-intensity conditioning, 30-second all-out work intervals tap the anaerobic lactic energy system without degrading movement mechanics.',
    ],
    practitionerFieldNote: {
      title: 'Physical Therapist Note: Why 15 Seconds Is Too Short for Stretching',
      body: 'During the first 12 to 15 seconds of a hamstring or hip-flexor stretch, muscle spindles actually increase tension to protect the joint. Only between seconds 18 and 30 does autogenic inhibition relax the muscle belly—making a true 30-second clock essential for flexibility gains.',
    },
    pacingTitle: 'How to Pace a 30-Second Isometric Hold or Plyometric Set',
    pacingSplits: [
      {
        phase: '00:30 → 00:20 · Alignment & Exhale',
        timeWindow: 'First 10 Seconds',
        sharePercent: 33,
        practitionerAction:
          'Set your joint alignment or begin your first burst of reps while neuromuscular coordination is fresh.',
      },
      {
        phase: '00:20 → 00:10 · Reflex Release Zone',
        timeWindow: 'Middle 10 Seconds',
        sharePercent: 34,
        practitionerAction:
          'On static stretches, exhale slowly at the 00:15 midpoint as protective muscle spindle tension begins to release.',
      },
      {
        phase: '00:10 → 00:00 · Final Lock-Out',
        timeWindow: 'Final 10 Seconds',
        sharePercent: 33,
        practitionerAction:
          'Hold steady depth without bouncing or rushing reps until the acoustic chime sounds at 00:00.',
      },
    ],
    howToUseTitle: 'Running Repeated 30-Second Quadrant & Circuit Rounds',
    howToUseSteps: [
      'Toggle Loop Mode on before starting if you are brushing four 30-second dental quadrants or alternating left/right leg stretches.',
      'Press Spacebar (or tap Start) to launch the 00:30 countdown hands-free from your sink counter or gym floor.',
      'Listen for the chime at 00:00 to switch sides or quadrants immediately without touching the screen with wet hands.',
      'Press R at any moment to snap back to 00:30 for a fresh repetition.',
    ],
    featuresTitle: 'Specialized Controls for 30-Second Micro-Intervals',
    featuresList: [
      'Zero-setup 00:30 launch with automatic Loop Mode for 4-quadrant brushing and bilateral stretching.',
      'Sub-millisecond timestamp engine that never lags during rapid 30-second HIIT transitions.',
      'Hands-free Spacebar start/pause and R reset shortcuts for gym floor or studio script timing.',
      'Crisp Web Audio chime that cuts through bathroom water noise or gym background music.',
      'Full-viewport landscape display (F key) readable from across a weight room or treatment table.',
    ],
    faqs: [
      {
        question: 'Why do dentists recommend timing 30 seconds per mouth quadrant?',
        answer:
          'Without a timer, most people brush for only 45 seconds total and neglect the inner lower molars. Timing four consecutive 30-second quadrants guarantees a full 120-second contact window for fluoride uptake and plaque disruption.',
      },
      {
        question: 'Why does a static stretch need to last a full 30 seconds?',
        answer:
          'Clinical sports-medicine studies show that holds under 15 seconds only tension the connective tissue briefly. Holding for 30 seconds triggers the Golgi tendon organ to relax the muscle fibers, producing measurable range-of-motion improvements.',
      },
      {
        question: 'How many words fit into a 30-second radio or TV commercial script?',
        answer:
          'At a natural broadcast speaking pace of 150 words per minute, a 30-second voiceover spot accommodates 70 to 75 words—or roughly 60 words if you need breathing room around a call-to-action.',
      },
    ],
  },

  '45-second-timer': {
    h1: '45-Second Timer for Coffee Pour-Over Blooms, Circuit Sets & Foam Rolling',
    seoTitle: '45-Second Timer (00:45) – Coffee Bloom & HIIT Circuit Clock | WebCountDownTimer',
    metaDescription:
      'Use a precision 45-second timer for V60 pour-over coffee CO2 degassing blooms, 45/15 metabolic conditioning circuits, and myofascial foam rolling.',
    introParagraphs: [
      'A 45-second countdown sits at the sweet spot between short anaerobic sprints and full-minute endurance holds. For specialty coffee brewers using a Hario V60, Chemex, or Kalita Wave, 45 seconds is the gold-standard "bloom" duration: pouring twice the coffee weight in hot water and waiting 00:45 allows roasted grounds to expel trapped carbon dioxide (CO₂) gas so subsequent water pours extract evenly instead of channeling.',
      'In group fitness and metabolic conditioning, the 45/15 protocol (45 seconds of sustained work followed by 15 seconds to wipe down and rotate stations) maximizes glycolytic calorie burn while keeping heart rates in Zone 4.',
    ],
    practitionerFieldNote: {
      title: 'Barista Note: Why Pouring Before 45 Seconds Causes Sour Coffee',
      body: 'Freshly roasted coffee beans release vigorous CO₂ bubbles when hot water first hits the bed. If you pour your main brew water at 15 or 20 seconds, rising gas repels water away from the cellulose fibers—resulting in sour, under-extracted cups. Waiting the full 45 seconds lets the bed settle flat.',
    },
    pacingTitle: 'Three-Stage Pacing Across a 45-Second Window',
    pacingSplits: [
      {
        phase: '00:45 → 00:30 · Saturation & Swirl',
        timeWindow: 'Seconds 0 to 15',
        sharePercent: 33,
        practitionerAction:
          'For pour-over coffee, saturate all dry grounds within the first 10 seconds and give the dripper a gentle swirl; for HIIT, establish smooth movement tempo.',
      },
      {
        phase: '00:30 → 00:15 · Degassing & Midpoint Hold',
        timeWindow: 'Seconds 15 to 30',
        sharePercent: 34,
        practitionerAction:
          'Watch CO₂ bubbles surface across the coffee bed, or pass the 00:22 midpoint of your myofascial foam-rolling pass.',
      },
      {
        phase: '00:15 → 00:00 · Final Glycolytic Push',
        timeWindow: 'Final 15 Seconds',
        sharePercent: 33,
        practitionerAction:
          'Prepare your gooseneck kettle for the main spiral pour at 00:00, or drive through the final 15 seconds of your circuit station.',
      },
    ],
    howToUseTitle: 'How to Time a 45-Second Coffee Bloom or Circuit Station',
    howToUseSteps: [
      'Press Spacebar as soon as hot water touches your coffee grounds or as your 45-second circuit work bell begins.',
      'Watch the 00:22 halfway mark to verify even saturation or check your rep count.',
      'Enable Loop Mode when foam rolling multiple muscle groups (calves, IT band, quads, lats) for 45 seconds each.',
      'Press R to reset instantly to 00:45 between sets or pour stages.',
    ],
    featuresTitle: 'Purpose-Built Features for 45-Second Timing',
    featuresList: [
      'Instant 00:45 preset calibrated for V60/Chemex coffee blooms and 45/15 gym intervals.',
      'Continuous Loop Mode for multi-muscle myofascial release routines.',
      'High-contrast fullscreen numerals visible from across a kitchen island or studio floor.',
      'Zero-drift system clock math that stays exact even if your phone screen locks.',
      'Single-key Spacebar and R controls for effortless one-handed operation.',
    ],
    faqs: [
      {
        question: 'Why is 45 seconds the ideal bloom time for V60 and Chemex pour-over coffee?',
        answer:
          'Light- and medium-roast specialty coffees retain dense cellular CO₂ after roasting. A 45-second bloom gives hot water enough time to displace that gas without letting the slurry cool below optimal extraction temperature (195°F–205°F).',
      },
      {
        question: 'How does a 45/15 HIIT interval compare to a 30/30 interval?',
        answer:
          'A 45-second work / 15-second rest ratio represents a 3:1 work-to-rest density. It places significantly higher demand on muscular endurance and aerobic recovery than a 1:1 (30/30) split, making it ideal for bodyweight and kettlebell circuits.',
      },
      {
        question: 'Is 45 seconds enough time for foam rolling a tight muscle group?',
        answer:
          'Yes. Spending 45 seconds slowly rolling a tender trigger point (such as the quadriceps or thoracic spine) provides enough sustained mechanical pressure to reduce fascial viscosity without bruising the tissue.',
      },
    ],
  },

  '90-second-timer': {
    h1: '90-Second Timer (1:30) for Hypertrophy Rest Sets, AeroPress & Speech Midpoints',
    seoTitle: '90-Second Timer (01:30) – Strength Rest & AeroPress Clock | WebCountDownTimer',
    metaDescription:
      'Start a 90-second (1 minute 30 second) timer for hypertrophy weightlifting rest sets, AeroPress coffee immersion, and Toastmasters Table Topics pacing.',
    introParagraphs: [
      'Ninety seconds (01:30) is one of the most researched durations in exercise physiology and cognitive neurology. When lifting weights in the 8-to-12 rep hypertrophy range, resting 90 seconds between sets allows your muscles to resynthesize roughly 80% to 85% of depleted phosphocreatine (ATP-PCr) while keeping metabolic stress and intramuscular growth signaling elevated.',
      'In behavioral neuroscience, Dr. Jill Bolte Taylor’s "90-Second Rule" demonstrates that the initial surge of adrenaline and noradrenaline triggered by stress or anger flushes completely out of the bloodstream within 90 seconds unless re-triggered by rumination. Meanwhile, specialty coffee enthusiasts rely on a 90-second immersion steep for crisp, sweet AeroPress extractions.',
    ],
    practitionerFieldNote: {
      title: 'Strength Coach Tip: Why Skipping Your 90-Second Rest Costs Reps',
      body: 'Lifters who guess their rest periods routinely start their next set after only 40 seconds—causing rep counts to drop from 10 reps on Set 1 to 5 reps on Set 3. Timing an honest 01:30 rest preserves total volume tonnage across all working sets.',
    },
    pacingTitle: 'How Your Body & Workflow Progress Through 90 Seconds (01:30)',
    pacingSplits: [
      {
        phase: '01:30 → 01:00 · Acute Heart-Rate Drop',
        timeWindow: 'First 30 Seconds',
        sharePercent: 33,
        practitionerAction:
          'Rack the bar, rack your weights, or stir your AeroPress crust; take slow nasal inhales to bring heart rate down.',
      },
      {
        phase: '01:00 → 00:30 · ATP-PCr Replenishment',
        timeWindow: 'Middle 30 Seconds (45s Halfway)',
        sharePercent: 34,
        practitionerAction:
          'Log your completed reps and load in your training notebook as phosphocreatine stores cross 70% recovery.',
      },
      {
        phase: '00:30 → 00:00 · Brace & Setup Window',
        timeWindow: 'Final 30 Seconds',
        sharePercent: 33,
        practitionerAction:
          'Step back up to the barbell at 00:15, set your grip and bracing breath, and unrack right as the 00:00 bell rings.',
      },
    ],
    howToUseTitle: 'Timing 90-Second Rest Intervals & AeroPress Steeps',
    howToUseSteps: [
      'Tap Spacebar or Start the moment you rack your barbell or finish pouring water into your AeroPress chamber.',
      'At the 00:45 midpoint, check your breathing cadence or cap your AeroPress with the rinsed paper filter.',
      'At 00:15 remaining, step into position so your next set or 30-second plunge starts precisely at 00:00.',
      'Use R to reset to 01:30 immediately after completing your next working set.',
    ],
    featuresTitle: 'Why Lifters, Speakers & Brewers Use This 01:30 Clock',
    featuresList: [
      'Displays as a clear 01:30 MM:SS readout so you never have to mentally convert 90 seconds.',
      'Instant R-key reset between weightlifting sets without unlocking or re-typing digits.',
      'Works reliably in the background while you log sets in a notes or workout tracker tab.',
      'Loop Mode option for continuous 90-second EMOM/E90MOM conditioning blocks.',
      'Gentle or crisp Web Audio chime options suitable for both quiet offices and busy gyms.',
    ],
    faqs: [
      {
        question: 'Why is 90 seconds the optimal rest period for muscle hypertrophy?',
        answer:
          'Resting 90 seconds (1.5 minutes) balances mechanical tension and metabolic fatigue. It restores enough ATP-PCr energy to maintain heavy working loads across 3 to 4 sets without letting muscle temperature drop.',
      },
      {
        question: 'What is the "90-Second Rule" in emotional regulation and neuroscience?',
        answer:
          'Neuroanatomist Dr. Jill Bolte Taylor showed that when the amygdala triggers a stress response, the chemical flood of adrenaline takes roughly 90 seconds to peak and clear the bloodstream—making a 90-second pause a powerful tool to prevent reactive decisions.',
      },
      {
        question: 'Why does 90 seconds matter in Toastmasters Table Topics speeches?',
        answer:
          'In a 1-to-2 minute impromptu Table Topics speech, 90 seconds (1:30) is the official midpoint where the Amber warning signal illuminates, telling the speaker they have 30 seconds to deliver their conclusion.',
      },
    ],
  },

  '1-minute-timer': {
    h1: '1-Minute Timer (60 Seconds) for WPM Reading Fluency, Planks & Pulse Checks',
    seoTitle: '1-Minute Timer (60s) – Reading Fluency, Plank & Pulse Clock | WebCountDownTimer',
    metaDescription:
      'Launch a 1-minute (60-second) timer for elementary WPM oral reading fluency tests, 60-second core planks, heart-rate recovery checks, and pitch drills.',
    introParagraphs: [
      'A 1-minute countdown (60 seconds) is the universal benchmark unit for human rate measurements: Words Per Minute (WPM) in literacy education, Beats Per Minute (BPM) in cardiovascular assessments, and Repetitions Per Minute in physical fitness tests. In K–5 classrooms, teachers use an exact 60-second timer for DIBELS and Oral Reading Fluency (ORF) passages to measure how many words a student reads accurately in one minute.',
      'In sports cardiology, the 1-Minute Heart Rate Recovery (HRR) test measures how many beats your pulse drops in the 60 seconds immediately following peak exercise—a primary indicator of vagal tone and aerobic conditioning.',
    ],
    practitionerFieldNote: {
      title: 'Reading Specialist Note: Silent Alerts for 1-Minute Fluency Checks',
      body: 'When administering a 1-minute Oral Reading Fluency (ORF) assessment to an elementary student, a harsh buzzer can startle the reader on the final sentence. Use our soft chime or toggle Mute (M key) and watch the 00:00 visual flash to mark the final word calmly.',
    },
    pacingTitle: 'How to Split a 60-Second Effort Across Three 20-Second Windows',
    pacingSplits: [
      {
        phase: '01:00 → 00:40 · Clean Start & Cadence',
        timeWindow: 'First 20 Seconds',
        sharePercent: 33,
        practitionerAction:
          'Establish neutral spine alignment on a forearm plank or steady vocal pacing on a 60-second elevator pitch.',
      },
      {
        phase: '00:40 → 00:20 · Crossing the 30s Midpoint',
        timeWindow: 'Middle 20 Seconds',
        sharePercent: 34,
        practitionerAction:
          'Engage glutes and core as you pass 00:30, or transition from problem statement to solution in a 1-minute pitch.',
      },
      {
        phase: '00:20 → 00:00 · Final 20-Second Finish',
        timeWindow: 'Final 20 Seconds',
        sharePercent: 33,
        practitionerAction:
          'Breathe steadily through the final abdominal tremor or deliver your closing call-to-action before 00:00.',
      },
    ],
    howToUseTitle: 'How to Time a 60-Second Assessment or Core Hold',
    howToUseSteps: [
      'Click Start or press Spacebar the instant the student speaks the first word or your elbows lock into a plank.',
      'Toggle Mute (M) if you are running a quiet clinical pulse count or classroom reading assessment.',
      'Turn on Loop Mode for Every-Minute-On-The-Minute (EMOM) cross-training workouts.',
      'Press R to reset straight back to 01:00 for the next student or set.',
    ],
    featuresTitle: 'Key Capabilities for 60-Second Benchmarking',
    featuresList: [
      'Exact 60.000-second epoch delta timing for standardized WPM, BPM, and fitness testing.',
      'Instant Mute toggle (M key) for distraction-free elementary reading assessments.',
      'Auto-repeating Loop Mode for multi-round EMOM (Every Minute on the Minute) workouts.',
      '4-cycle Box Breathing compatibility (four 15-second inhale/hold/exhale/hold quarters).',
      'Fullscreen projection (F key) for whole-class 60-second desk cleanup sprints.',
    ],
    faqs: [
      {
        question: 'How do teachers calculate Words Correct Per Minute (WCPM) with a 1-minute timer?',
        answer:
          'Start the 1-minute timer when the student reads the first word of a grade-level passage. Mark any skipped or mispronounced words while the clock runs, mark the last word read at 00:00, and subtract errors from total words read.',
      },
      {
        question: 'What is a healthy 1-minute Heart Rate Recovery (HRR) drop after exercise?',
        answer:
          'Check your pulse immediately upon stopping intense cardio, start the 1-minute timer, and measure your pulse again at 00:00. A drop of 18 to 25+ beats per minute indicates strong parasympathetic nervous system recovery.',
      },
      {
        question: 'How do you run 4-4-4-4 Box Breathing with a 1-minute timer?',
        answer:
          'Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds, and hold empty for 4 seconds (16 seconds per cycle). Four calm cycles fill roughly one 60-second reset between meetings.',
      },
    ],
  },

  '5-minute-timer': {
    h1: '5-Minute Timer (300s) for Pomodoro Short Breaks, Bell-Ringers & Soft-Boiled Eggs',
    seoTitle: '5-Minute Timer (05:00) – Pomodoro Break & Classroom Warmup | WebCountDownTimer',
    metaDescription:
      'Run a 5-minute (300-second) timer for Pomodoro recovery breaks, K-12 classroom bell-ringer warmups, 5-minute journal prompts, and soft-boiled eggs.',
    introParagraphs: [
      'A 5-minute countdown (300 seconds) is the universal transition bridge in knowledge work, education, and culinary timing. In the classic Pomodoro Technique developed by Francesco Cirillo, the 5-minute short break following every 25-minute focus sprint is specifically calibrated to let the prefrontal cortex consolidate working memory into long-term storage without losing task context.',
      'In K–12 classrooms, projecting a 05:00 timer on the smartboard as students walk through the door anchors the opening "Bell-Ringer" or "Do Now" warmup—turning the chaotic first 300 seconds of class into focused independent work while the teacher takes attendance.',
    ],
    practitionerFieldNote: {
      title: 'Productivity Note: Why Scrolling Social Media Ruins a 5-Minute Break',
      body: 'If you spend your 5-minute Pomodoro break reading rapid-fire feeds or answering Slack messages, your visual cortex and working memory never rest. Stand up, look out a window at least 20 feet away, and hydrate until the 00:00 chime brings you back.',
    },
    pacingTitle: 'Structuring a 5-Minute Classroom Warmup or Standup',
    pacingSplits: [
      {
        phase: '05:00 → 04:00 · Prompt & Settle',
        timeWindow: 'Minute 1 (First 60s)',
        sharePercent: 20,
        practitionerAction:
          'Students open notebooks and read the board prompt; in kitchen timing, lower chilled eggs gently into simmering water.',
      },
      {
        phase: '04:00 → 01:00 · Independent Execution',
        timeWindow: 'Minutes 2 to 4 (180s Core)',
        sharePercent: 60,
        practitionerAction:
          'Three uninterrupted minutes of writing, problem-solving, or steeping. Check progress at the 02:30 halfway mark.',
      },
      {
        phase: '01:00 → 00:00 · Final Sentence & Ice Bath',
        timeWindow: 'Final 60 Seconds',
        sharePercent: 20,
        practitionerAction:
          'Give a "one minute left" verbal cue so students finish their thought, or prepare an ice-water bowl to stop egg cooking at 00:00.',
      },
    ],
    howToUseTitle: 'Using the 5-Minute Timer for Breaks, Warmups & Cooking',
    howToUseSteps: [
      'Press Spacebar or click Start to begin the 05:00 (300-second) countdown immediately.',
      'Press F to expand the clock into Fullscreen mode for classroom smartboards or kitchen counters.',
      'Watch the 02:30 midpoint to gauge whether your group or warmup is on pace.',
      'Enable Loop Mode if you are rotating 5-minute speed-networking or parent-teacher conference slots.',
    ],
    featuresTitle: 'Built-In Advantages of This 5-Minute Clock',
    featuresList: [
      'Pre-set to 05:00 (300 seconds / 0.083 decimal hours) for instant one-click launch.',
      'Live countdown readout in the browser tab title so you can monitor breaks from any window.',
      'Projector-friendly Fullscreen mode (F key) with automatic Screen Wake Lock.',
      'Acoustic chime at 00:00 that signals the end of a Pomodoro break or steeping window.',
      'Zero-drift timestamp math that stays exact across background tabs.',
    ],
    faqs: [
      {
        question: 'Why does a 5-minute boiled egg have a set white and a runny yolk?',
        answer:
          'Egg white proteins (albumen) coagulate between 144°F and 149°F, whereas egg yolk proteins require 150°F to 158°F. Simmering a large egg for exactly 5 minutes (300 seconds) solidifies the outer white while keeping the center yolk warm and jammy.',
      },
      {
        question: 'Why does the Pomodoro Technique use a 5-minute break instead of 15 minutes?',
        answer:
          'A 5-minute break is long enough to relieve ocular strain and physical stiffness, but short enough that your brain retains the mental map of the code, essay, or problem you were working on.',
      },
      {
        question: 'How do behavioral therapists use the "5-Minute Rule" to beat procrastination?',
        answer:
          'Commit to working on a dreaded task for just 5 minutes on the timer, with full permission to stop at 00:00. Overcoming initial activation energy is the hardest part—most people choose to keep going once the 5-minute bell rings.',
      },
    ],
  },

  '10-minute-timer': {
    h1: '10-Minute Timer (600s) for Power Naps, Al Dente Pasta & Writing Sprints',
    seoTitle: '10-Minute Timer (10:00) – NASA Power Nap & Sprint Clock | WebCountDownTimer',
    metaDescription:
      'Start a 10-minute (600-second) timer for Stage-2 alertness power naps, al dente pasta boiling, 10-minute freewriting sprints, and 0.17h billing blocks.',
    introParagraphs: [
      'A 10-minute countdown (600 seconds) is backed by sleep research, culinary science, and agile facilitation. A landmark sleep laboratory study published in the journal Sleep compared 5-, 10-, 20-, and 30-minute afternoon naps and found that a 10-minute nap produced the most immediate improvements in cognitive alertness and vigor without triggering post-nap "sleep inertia" grogginess.',
      'In the kitchen, 10 minutes is the standard starch-gelatinization window for boiling dried durum-wheat spaghetti, penne, and rigatoni to a true al dente bite. In professional services, 10 minutes equals 0.167 decimal hours—making it a clean micro-block for freewriting sprints and lightning talks.',
    ],
    practitionerFieldNote: {
      title: 'Sleep Science Note: Why 10 Minutes Beats a 30-Minute Afternoon Nap',
      body: 'After roughly 15 to 20 minutes of sleep, the brain transitions from light Stage 2 non-REM sleep into slow-wave delta sleep. Waking up from slow-wave sleep causes 30+ minutes of disorientation. Setting a 10:00 timer wakes you before delta waves begin.',
    },
    pacingTitle: 'Pacing a 10-Minute Lightning Talk, Nap or Boiling Window',
    pacingSplits: [
      {
        phase: '10:00 → 07:30 · Launch & Immersion',
        timeWindow: 'First 2.5 Minutes (150s)',
        sharePercent: 25,
        practitionerAction:
          'Stir pasta vigorously during the first 2 minutes so strands do not stick; in a writing sprint, write continuously without backspacing.',
      },
      {
        phase: '07:30 → 02:30 · Core 5-Minute Body',
        timeWindow: 'Middle 5 Minutes (05:00 Halfway)',
        sharePercent: 50,
        practitionerAction:
          'Cross the 05:00 midpoint. In a 10-minute pitch, transition from your live product demo into metrics and traction.',
      },
      {
        phase: '02:30 → 00:00 · Taste Test & Wrap-Up',
        timeWindow: 'Final 2.5 Minutes (150s)',
        sharePercent: 25,
        practitionerAction:
          'Taste-test pasta for al dente firmness at 01:30 remaining, or open the floor for final questions before 00:00.',
      },
    ],
    howToUseTitle: 'How to Run a 10-Minute Sprint or Kitchen Countdown',
    howToUseSteps: [
      'Click Start or press Spacebar to begin the 10:00 (600-second) countdown.',
      'Use the 05:00 halfway mark to check pacing on your presentation slides or classroom station.',
      'Keep audio unmuted so the Web Audio chime wakes you cleanly from a 10-minute desk rest or signals draining time.',
      'Press F for Fullscreen display during 10-minute workshop breakout discussions.',
    ],
    featuresTitle: 'Why Practitioners Choose This 10-Minute Clock',
    featuresList: [
      'Pre-configured to 10:00 (600 seconds) with zero setup or account required.',
      'Gentle yet clear Web Audio wake chime ideal for 10-minute alertness naps.',
      'Background tab title updates (`09:42 - 10 Minute Timer`) while you write in Google Docs or Notion.',
      'Loop Mode for repeating 10-minute classroom center rotations.',
      'Keyboard shortcuts (`Space`, `R`, `F`, `M`) for instant control.',
    ],
    faqs: [
      {
        question: 'Why do sleep researchers recommend a 10-minute power nap?',
        answer:
          'Controlled sleep studies show that a 10-minute nap stays inside light Stage 2 non-REM sleep, clearing adenosine fatigue from the brain and boosting alertness for up to 155 minutes with zero sleep inertia.',
      },
      {
        question: 'Why should I check dried pasta 1 to 2 minutes before the 10-minute timer ends?',
        answer:
          'If you plan to finish pasta in a hot skillet with sauce, draining it at 8.5 to 9 minutes (when a tiny white core of ungelatinized starch remains) prevents it from overcooking during the final toss.',
      },
      {
        question: 'What is 10 minutes in decimal hours for timesheets?',
        answer:
          'Ten minutes is one-sixth of an hour (10 ÷ 60), which equals 0.17 decimal hours when rounded to two decimal places.',
      },
    ],
  },

  '15-minute-timer': {
    h1: '15-Minute Timer (900s) for Daily Standups, Quarter-Hour Billing & Study Sprints',
    seoTitle: '15-Minute Timer (15:00) – Daily Standup & 0.25h Billing Clock | WebCountDownTimer',
    metaDescription:
      'Use a 15-minute (900-second / 0.25-hour) timer for Agile daily scrum standups, quarter-hour legal and CPA billing increments, and focused study blocks.',
    introParagraphs: [
      'Fifteen minutes (900 seconds) is the structural quarter-hour unit of the modern workday. In Agile software development, the Scrum Guide mandates a strict 15-minute timebox for the Daily Scrum standup—regardless of whether the engineering team has 4 developers or 9—to surface blockers without devolving into a sprawling status meeting.',
      'In accounting, consulting, and freelance billing, 15 minutes equals exactly 0.25 decimal hours, making it the universal quarter-hour timesheet increment. In clinical medicine and allergy clinics, patients are routinely observed for a 15-minute window following vaccinations or skin-prick tests.',
    ],
    practitionerFieldNote: {
      title: 'Scrum Master Tip: Share the 15:00 Clock on Screen During Remote Standups',
      body: 'Remote video standups run over schedule when speakers cannot see how much shared time remains. Pinning a visible 15:00 countdown in the corner of your screen share naturally encourages teammates to keep updates under 90 seconds each and park deep technical debates for an after-party.',
    },
    pacingTitle: 'How to Pace a 15-Minute Standup or Quarter-Hour Block',
    pacingSplits: [
      {
        phase: '15:00 → 10:00 · First Third & Sprint Goal Check',
        timeWindow: 'First 5 Minutes (300s)',
        sharePercent: 33,
        practitionerAction:
          'Walk the right-hand side of the sprint board (items closest to Done) or complete your initial task setup.',
      },
      {
        phase: '10:00 → 05:00 · Core Updates & 07:30 Midpoint',
        timeWindow: 'Middle 5 Minutes (300s)',
        sharePercent: 34,
        practitionerAction:
          'Cross the 07:30 halfway mark. Ensure at least half of the team or half of your quarter-hour checklist is complete.',
      },
      {
        phase: '05:00 → 00:00 · Blockers & Parking Lot',
        timeWindow: 'Final 5 Minutes (300s)',
        sharePercent: 33,
        practitionerAction:
          'Confirm owner assignments for any active blockers and wrap up before the 00:00 bell rings.',
      },
    ],
    howToUseTitle: 'Running a Strict 15-Minute Timebox',
    howToUseSteps: [
      'Press Spacebar or click Start at the top of your meeting or 0.25-hour billable task.',
      'Glance at the 07:30 halfway mark to verify that discussion or work is 50% complete.',
      'Use Fullscreen mode (F) on a conference room TV or shared window for group accountability.',
      'Log 0.25 decimal hours on your timesheet when the 00:00 chime sounds.',
    ],
    featuresTitle: 'Designed for Agile Teams & Quarter-Hour Workflows',
    featuresList: [
      'Exact 15:00 (900-second / 0.25 decimal hour) quarter-hour calibration.',
      'High-visibility Fullscreen display for conference room monitors and Zoom screen shares.',
      'Drift-free system clock tracking while you work inside Jira, Linear, or IDE tabs.',
      'Loop Mode for running four consecutive 15-minute blocks across a full hour.',
      'Instant keyboard controls (`Space` start/pause, `R` reset, `F` fullscreen, `M` mute).',
    ],
    faqs: [
      {
        question: 'Why does the Scrum Guide cap the Daily Standup at exactly 15 minutes?',
        answer:
          'A 15-minute cap forces participants to focus on coordination and immediate blockers rather than problem-solving in front of the whole group. Deeper architectural discussions are deferred to smaller follow-up huddles right after the 15-minute bell.',
      },
      {
        question: 'How is a 15-minute timer recorded in decimal hours on a payroll or legal timesheet?',
        answer:
          'Fifteen minutes is one-quarter of a 60-minute hour (15 ÷ 60 = 0.25). Multiply 0.25 by your hourly billing rate to calculate the exact fee for a single 15-minute increment.',
      },
      {
        question: 'Why do clinics use a 15-minute timer after allergy shots or vaccinations?',
        answer:
          'The vast majority of acute immediate-hypersensitivity reactions occur within 15 minutes of administration, making a 15:00 observation countdown standard clinical practice before discharge.',
      },
    ],
  },

  '30-minute-timer': {
    h1: '30-Minute Timer (1,800s) for Half-Hour Consultations, Dough Proofing & Deep Work',
    seoTitle: '30-Minute Timer (30:00) – Half-Hour Session & Study Clock | WebCountDownTimer',
    metaDescription:
      'Launch a 30-minute (1,800-second / 0.50-hour) timer for half-hour client consultations, bread dough autolyse, Zone-2 cardio, and Pomodoro long breaks.',
    introParagraphs: [
      'Thirty minutes (1,800 seconds / 0.50 decimal hours) is the primary building block of executive calendars, clinical therapy sessions, and culinary preparation. While a 15-minute check-in only covers surface status updates, a 30-minute window provides enough runway for a structured 1-on-1 coaching session, a candidate screening interview, or a focused coding module without inducing cognitive fatigue.',
      'In artisan sourdough baking, a 30-minute timer paces both the initial flour-and-water autolyse rest (allowing protease and amylase enzymes to hydrate gluten strands) and the intervals between stretch-and-fold sets during bulk fermentation.',
    ],
    practitionerFieldNote: {
      title: 'Executive Calendar Rule: The 25/5 Buffer Inside a 30-Minute Meeting',
      body: 'When back-to-back 30-minute meetings run all the way to minute 30, every subsequent call starts late. Use the 05:00 remaining mark on this 30-minute timer as your hard wrap-up cue so you summarize decisions at minute 25 and reclaim a 5-minute transition buffer.',
    },
    pacingTitle: 'Structuring a 30-Minute Consultation, Interview or Study Block',
    pacingSplits: [
      {
        phase: '30:00 → 25:00 · Context & Agenda Lock',
        timeWindow: 'First 5 Minutes (300s)',
        sharePercent: 17,
        practitionerAction:
          'Define the single desired outcome for the half-hour session or outline the subsections of your study chapter.',
      },
      {
        phase: '25:00 → 05:00 · 20-Minute Core Execution',
        timeWindow: 'Middle 20 Minutes (15:00 Midpoint)',
        sharePercent: 66,
        practitionerAction:
          'Uninterrupted problem-solving, interview questioning, or Zone-2 aerobic conditioning. Audit progress at the 15:00 halfway mark.',
      },
      {
        phase: '05:00 → 00:00 · Action Items & Next Steps',
        timeWindow: 'Final 5 Minutes (300s)',
        sharePercent: 17,
        practitionerAction:
          'Confirm owners and deadlines in the final 300 seconds so the session closes cleanly at 00:00.',
      },
    ],
    howToUseTitle: 'Getting the Most Out of Your 30-Minute Session',
    howToUseSteps: [
      'Click Start (or press Spacebar) to begin the 30:00 (1,800-second) countdown.',
      'Pin this browser tab so you can monitor the live MM:SS readout in your tab bar while working in other apps.',
      'Use the 15:00 midpoint to verify you are halfway through your agenda or reading assignment.',
      'Enable Loop Mode if you are performing 30-minute sourdough stretch-and-fold sets across a 2-hour bulk rise.',
    ],
    featuresTitle: 'Capabilities Built for Half-Hour Scheduling',
    featuresList: [
      'Exact 30:00 (1,800 seconds / 0.50 decimal hours) half-hour duration.',
      'Epoch timestamp tracking that never drifts when your browser tab is backgrounded for 30 minutes.',
      'Loop Mode for recurring 30-minute dough folds, hydration reminders, or posture resets.',
      'Screen Wake Lock in Fullscreen mode (F key) so your tablet or monitor stays awake.',
      'Synthesized Web Audio chime with one-key Mute (M) control.',
    ],
    faqs: [
      {
        question: 'Why do sourdough bakers use a 30-minute timer for stretch-and-folds?',
        answer:
          'After stretching and folding fermenting dough, gluten networks tighten up. Resting the dough for 30 minutes allows the gluten to relax (extensibility) so you can perform the next coil fold without tearing the dough matrix.',
      },
      {
        question: 'How does a 30-minute timer fit into the Pomodoro workflow?',
        answer:
          'Practitioners use 30 minutes either as a slightly extended work block (30 minutes of focus + 5 minutes of rest) or as the restorative "Long Break" taken after completing four consecutive 25-minute Pomodoros.',
      },
      {
        question: 'What is 30 minutes expressed in decimal hours for payroll?',
        answer:
          'Thirty minutes is exactly 0.50 decimal hours (30 ÷ 60), representing a standard unpaid meal break deduction or half-hour billable consultation.',
      },
    ],
  },

  '60-minute-timer': {
    h1: '60-Minute Timer (1 Hour / 3,600s) for Mock Exams, Deep Work & Billable Hours',
    seoTitle: '60-Minute Timer (60:00 / 1 Hour) – Exam & Deep Work Clock | WebCountDownTimer',
    metaDescription:
      'Run a 60-minute (1-hour / 3,600-second) countdown timer for SAT/ACT and university mock exams, uninterrupted deep-work engineering blocks, and 1.0h billing.',
    introParagraphs: [
      'A 60-minute countdown (3,600 seconds / 1.00 decimal hour) is the cornerstone of academic examination pacing, deep cognitive work, and professional time billing. Standardized university exams, bar-exam essay prompts, and AP free-response sections frequently allocate 60 minutes—requiring students to budget their reading, outlining, writing, and proofreading checkpoints across a single 3,600-second clock.',
      'In cognitive psychology, a 60-minute uninterrupted block allows engineers, writers, and analysts to pass the initial 15-minute "attention residue" warm-up phase and spend 45 full minutes in high-output flow before taking an ultradian recovery break.',
    ],
    practitionerFieldNote: {
      title: 'Test-Prep Pro Tip: Why Practicing with a 60:00 Minute Display Beats a Wall Clock',
      body: 'On test day, students often lose track of minutes when trying to calculate elapsed time on an analog wall clock. Practicing timed essay and problem sets against a pure 60:00 countdown trains your internal sense of the 45:00, 30:00, and 15:00 quarter marks.',
    },
    pacingTitle: 'Quarter-Hour Checkpoint Strategy Across a 60-Minute Block',
    pacingSplits: [
      {
        phase: '60:00 → 45:00 · Deconstruction & Architecture',
        timeWindow: 'First 15 Minutes (Quarter 1)',
        sharePercent: 25,
        practitionerAction:
          'Annotate the exam prompt, outline your argument or software architecture, and close all non-essential browser tabs.',
      },
      {
        phase: '45:00 → 15:00 · 30-Minute Deep Execution Core',
        timeWindow: 'Middle 30 Minutes (30:00 Halfway)',
        sharePercent: 50,
        practitionerAction:
          'Peak flow window (1,800 seconds). By the 30:00 midpoint, you should be halfway through your problem set or first draft.',
      },
      {
        phase: '15:00 → 00:00 · Verification, QA & Polish',
        timeWindow: 'Final 15 Minutes (Quarter 4)',
        sharePercent: 25,
        practitionerAction:
          'Use the final quarter-hour to check calculations, run unit tests, proofread citations, and save your work before 00:00.',
      },
    ],
    howToUseTitle: 'Setting Up a Distraction-Free 60-Minute Session',
    howToUseSteps: [
      'Confirm your audio alert preference and press Spacebar (or click Start) to lock in the 60:00 (3,600s) countdown.',
      'Press F to project a clean Fullscreen proctoring display for mock exams or study halls.',
      'Check your quarter-hour milestones at 45:00, 30:00 (halfway), and 15:00 remaining.',
      'When the 00:00 chime rings, step away from your desk for a 10- to 15-minute physical recovery break.',
    ],
    featuresTitle: 'Engineered for Full-Hour Reliability',
    featuresList: [
      'Full 60:00 (3,600-second / 1.00 decimal hour) precision countdown.',
      'Immune to browser tab throttling—uses system epoch timestamps so it never loses a second over a full hour.',
      'Screen Wake Lock integration keeps proctoring monitors and iPads awake for all 60 minutes.',
      'Live browser tab title countdown so you can track remaining minutes without switching windows.',
      'One-key shortcuts (`Space` start/pause, `R` reset, `F` fullscreen, `M` mute).',
    ],
    faqs: [
      {
        question: 'How should I pace a 60-minute essay exam with two prompts?',
        answer:
          'Spend minutes 60:00 to 30:00 on Prompt 1 (5 minutes outlining, 22 minutes writing, 3 minutes reviewing). The moment the clock crosses 30:00, move immediately to Prompt 2 so both essays receive equal weight.',
      },
      {
        question: 'Will this 60-minute timer drift or pause if my browser tab is in the background for an hour?',
        answer:
          'No. Modern browsers throttle background JavaScript intervals, which breaks naive counters. Our timer subtracts the current system epoch timestamp from your start timestamp on every tick, guaranteeing 100% accuracy across a full 3,600-second hour.',
      },
      {
        question: 'Why should I take a break after a 60-minute deep work block?',
        answer:
          'Human daytime alertness follows a 90-minute ultradian cycle (roughly 60 to 75 minutes of high focus followed by a 15-minute physiological dip). Taking a 10-minute movement break at 00:00 prevents afternoon burnout.',
      },
    ],
  },
};

export function getDurationPageData(slug: string): DurationPageData | null {
  if (!APPROVED_DURATION_SLUGS.includes(slug)) return null;

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

  const bespoke = BESPOKE_DURATION_EDITORIAL[slug];
  const h1 = bespoke?.h1 || `${value} ${unitCapitalized} Timer`;
  const primaryKeyword = `${value} ${unitSingular} timer`;

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

  const seoTitle =
    bespoke?.seoTitle ||
    (isMinutes
      ? `${h1} (${totalSeconds.toLocaleString()}s) – Countdown | WebCountDownTimer`
      : `${h1} (${totalSeconds}s) – Sprint Clock | WebCountDownTimer`);

  const customUse = DURATION_SPECIFIC_USES[slug];
  const whenToUseIntro = customUse
    ? customUse.intro
    : `A ${word}-${unitSingular} countdown (${totalSeconds.toLocaleString()} seconds) gives you an exact, drift-free boundary.`;

  const whenToUseExamples = customUse ? customUse.examples : [];

  const ex0Title = whenToUseExamples[0]?.title || `${value}-${unitCapitalized} Block`;
  const ex1Title = whenToUseExamples[1]?.title || 'Secondary Application';

  const decimalMinutes = Number((totalSeconds / 60).toFixed(2));
  const decimalHours = Number((totalSeconds / 3600).toFixed(3));

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
            `Target Interval (${formatSecToMMSS(totalSeconds)})`,
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

  const candidateMinutes = [...KEPT_MINUTE_TIMERS];
  const relatedDurations = candidateMinutes
    .filter((m) => (isMinutes ? m !== value : true))
    .map((m) => ({
      slug: `${m}-minute-timer`,
      label: `${m}-Minute Timer`,
      description: `${(m * 60).toLocaleString()} seconds online countdown`,
    }));

  return {
    slug,
    tier,
    tierBadge,
    h1,
    seoTitle,
    metaDescription: bespoke?.metaDescription || whenToUseIntro,
    primaryKeyword,
    secondaryKeywords,
    totalSeconds,
    unitLabel: `${value} ${unitCapitalized}${value === 1 ? '' : 's'}`,
    spelledOut: `${word}-${unitSingular}`,
    introParagraphs: bespoke?.introParagraphs || [whenToUseIntro],
    pacingTitle: bespoke?.pacingTitle || `Pacing Your ${value}-${unitCapitalized} Session`,
    pacingSplits: bespoke?.pacingSplits || [],
    comparisonTableTitle,
    comparisonColumns,
    comparisonRows,
    practitionerFieldNote: bespoke?.practitionerFieldNote || {
      title: `Timing Note for ${value} ${unitCapitalized}s`,
      body: whenToUseIntro,
    },
    howToUseTitle: bespoke?.howToUseTitle || `How to Use the ${value}-${unitCapitalized} Timer`,
    howToUseSteps: bespoke?.howToUseSteps || [],
    whenToUseTitle: `Best Real-World Uses for a ${value}-${unitCapitalized} Timer`,
    whenToUseIntro,
    whenToUseExamples,
    featuresTitle: bespoke?.featuresTitle || `Built-In Timing Controls for ${value} ${unitCapitalized}s`,
    featuresList: bespoke?.featuresList || [],
    relatedDurations,
    faqs: bespoke?.faqs || [],
  };
}

export const DURATION_TIMERS_DATA: Record<string, DurationPageData> = Object.fromEntries(
  APPROVED_DURATION_SLUGS.map((slug) => [slug, getDurationPageData(slug)!])
);


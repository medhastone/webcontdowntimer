export type ToolArchetypeKind =
  | 'run-of-show'
  | 'sensory-studio'
  | 'formula-ledger'
  | 'coach-brief'
  | 'global-desk';

export interface ArchetypePhaseItem {
  phase: string;
  window: string;
  sharePercent: number;
  cue: string;
}

export interface ArchetypeWorkedLedger {
  formulaTitle: string;
  formulaExpression: string;
  scenarioName: string;
  inputs: Array<{ label: string; value: string }>;
  mathSteps: string[];
  finalOutput: string;
  auditWarning: string;
}

export interface ArchetypeRunOfShowCue {
  slotLabel: string;
  greenMark: string;
  amberMark: string;
  redMark: string;
  overtimeRule: string;
  boothNotes: string[];
}

export interface ArchetypeSensoryMatrix {
  viewingDistance: string;
  ambientContrast: string;
  soundProfile: string;
  sensoryNote: string;
  routines: Array<{ title: string; timing: string; setup: string }>;
}

export interface ArchetypeGlobalCorridor {
  corridorLabel: string;
  utcFormula: string;
  dstTrapWarning: string;
  goldenWindow: string;
  playbooks: Array<{ regionPair: string; bestSlotUtc: string; localTimes: string; tip: string }>;
}

export interface ToolPractitionerArchetype {
  slug: string;
  archetype: ToolArchetypeKind;
  kicker: string;
  leadHeading: string;
  leadParagraphs: string[];
  executionHeading: string;
  executionSteps: Array<{ title: string; detail: string }>;
  // Archetype-specific structural payloads
  runOfShow?: ArchetypeRunOfShowCue;
  sensoryMatrix?: ArchetypeSensoryMatrix;
  workedLedger?: ArchetypeWorkedLedger;
  coachPhases?: {
    blueprintTitle: string;
    phases: ArchetypePhaseItem[];
    pacingMistakesTitle: string;
    pacingMistakes: string[];
  };
  globalCorridor?: ArchetypeGlobalCorridor;
  // Custom reference table with bespoke column headers per tool
  tableSectionTitle: string;
  tableSectionIntro: string;
  tableColumns: [string, string, string];
  tableRows: Array<[string, string, string]>;
  // Practitioner field notes
  fieldNotesTitle: string;
  fieldNotes: Array<{ label: string; note: string }>;
}

export const PRACTITIONER_ARCHETYPES: Record<string, ToolPractitionerArchetype> = {
  // ============================================================================
  // ARCHETYPE 1: PRODUCTION RUN-OF-SHOW PLAYBOOK (Stage, Event & Speaking)
  // ============================================================================
  'stage-timer': {
    slug: 'stage-timer',
    archetype: 'run-of-show',
    kicker: 'LIVE AV & STAGE PRODUCTION PLAYBOOK',
    leadHeading: 'Why Keynote Schedules Slip—and How Confidence Monitor Color Cues Stop It',
    leadParagraphs: [
      'Anyone who has called a multi-speaker conference from a back-of-room AV booth knows the real problem is rarely a presenter who wants to run over. It is a presenter under bright stage wash lights who cannot read a tiny wristwatch and loses track of the middle 15 minutes of their talk.',
      'A dedicated stage confidence monitor solves this by placing giant, high-contrast digits at the foot of the stage (a "downstage monitor") and shifting the visual frame from calm green to an unmistakable amber warning before hitting solid red at zero. When the clock crosses 00:00, switching immediately to a flashing `+MM:SS` count-up tells the speaker—and the moderator—exactly how many seconds of Q&A time are being burned.',
    ],
    executionHeading: 'AV Booth & Dual-Screen Setup Sequence',
    executionSteps: [
      {
        title: 'Extend (Don’t Mirror) Your Display Output',
        detail: 'Connect your laptop to the downstage HDMI or SDI feed in Extended Desktop mode so your operator controls stay on your laptop while the clean Audience View fills the stage monitor.',
      },
      {
        title: 'Lock In Amber and Red Warning Thresholds Before Doors Open',
        detail: 'For a 20-minute keynote, set Amber at 05:00 remaining and Red at 01:00 remaining. Walk the stage during speaker check-in and show presenters what those two colors look like from the lectern.',
      },
      {
        title: 'Use Live Text Cues Instead of Open-Mic Interruptions',
        detail: 'Type short 3-to-5 word prompts ("Wrap up for Q&A", "Mic 2 is live next") in the controller tab—BroadcastChannel sync pushes them to the stage screen in under 10 milliseconds without touching the PA.',
      },
    ],
    runOfShow: {
      slotLabel: 'Standard 20:00 Conference Keynote Slot',
      greenMark: '20:00 → 05:01 (Normal Delivery)',
      amberMark: '05:00 → 01:01 (Begin Closing Summary)',
      redMark: '01:00 → 00:00 (Final Takeaway Only)',
      overtimeRule: 'Counts up in flashing red (+00:01...) to deduct directly from Q&A buffer',
      boothNotes: [
        'Disable OS screen sleep and notification banners on the presentation machine before the first walk-on track.',
        'Keep `+1m` and `-1m` hotkeys ready when a panel moderator cuts an intro short or a video roll runs 45 seconds long.',
      ],
    },
    tableSectionTitle: 'Conference Slot Threshold Matrix',
    tableSectionIntro: 'Use these field-tested green, amber, and red transition points across common live event formats:',
    tableColumns: ['Session Format', 'Amber Warning Mark', 'Red Wrap Mark & Overtime Policy'],
    tableRows: [
      ['5-Minute Lightning Talk', '01:00 remaining', '00:30 remaining; hard mic fade at +00:15 overtime'],
      ['15-Minute Breakout Presentation', '03:00 remaining', '01:00 remaining; deducts from 5-min Q&A slot'],
      ['20-Minute Mainstage Keynote', '05:00 remaining', '01:00 remaining; stage manager steps to wings at +01:00'],
      ['45-Minute Fireside Chat / Panel', '10:00 remaining (open Q&A)', '02:00 remaining (final lightning question)'],
    ],
    fieldNotesTitle: 'Back-of-House Stage Manager Notes',
    fieldNotes: [
      {
        label: 'Anti-Glare Dark Background',
        note: 'Always run the downstage monitor in dark mode (`#141816`). A bright white monitor at the edge of the stage casts harsh upward light onto the speaker’s chin on camera.',
      },
      {
        label: 'Zero Wi-Fi Dependency in Concrete Venues',
        note: 'Because the Dual-Screen Audience View communicates over the browser’s local BroadcastChannel API, your controller and stage display stay synced even if ballroom Wi-Fi collapses when 800 attendees join the network.',
      },
    ],
  },

  'presentation-timer': {
    slug: 'presentation-timer',
    archetype: 'run-of-show',
    kicker: 'SPEAKER PACING & SLIDE DECK GUIDE',
    leadHeading: 'Pacing a Slide Deck Without Staring at a Ticking Clock',
    leadParagraphs: [
      'Most presenters spend 60% of their allotted time on their first four context slides and then sprint breathlessly through their actual findings at the end. Watching raw seconds tick down on a phone screen only increases stage anxiety.',
      'A structured presentation timer fixes your pacing by dividing your talk into three clear acts: hook and framing, core argument, and closing call-to-action—using peripheral color shifts so you know whether to expand an anecdote or advance to your next slide.',
    ],
    executionHeading: 'How to Rehearse and Run Your Talk',
    executionSteps: [
      {
        title: 'Subtract 90 Seconds from Your Official Slot',
        detail: 'If you are scheduled for 15 minutes, rehearse to a 13:30 timer. Walk-on applause, HDMI handoffs, and a sip of water always eat the first 90 seconds.',
      },
      {
        title: 'Tie Slide Milestones to Your Halfway Mark',
        detail: 'Write the slide number you must reach at the 50% mark on the top corner of your notes. If you are behind that slide when the bar crosses halfway, skip secondary examples immediately.',
      },
      {
        title: 'Set the Amber Cue to Match Your Summary Slide',
        detail: 'Configure the amber warning for 2 minutes before zero so the color change serves as your visual trigger to transition to your conclusion slide.',
      },
    ],
    runOfShow: {
      slotLabel: '15:00 Pitch or Academic Defense (Targeted at 13:30 Net)',
      greenMark: '13:30 → 03:01 (Problem, Method & Core Proof)',
      amberMark: '03:00 → 01:01 (Synthesis & Commercial/Research Impact)',
      redMark: '01:00 → 00:00 (Ask / Final Slide & Thank You)',
      overtimeRule: 'Silent visual flash at 00:00 so you never trigger a jarring buzzer into an active lapel mic',
      boothNotes: [
        'Place your phone or tablet on the lectern lip in landscape fullscreen so your eyes stay toward the audience.',
        'Rehearse standing up at least twice—speaking while standing is 12% to 15% faster than reading seated at a desk.',
      ],
    },
    tableSectionTitle: 'Slide Count & Milestone Pacing Guide',
    tableSectionIntro: 'Match your total talk length to a realistic slide budget and halfway checkpoint:',
    tableColumns: ['Talk Duration', 'Recommended Slide Cap', 'Halfway Checkpoint Target'],
    tableRows: [
      ['5-Minute Investor Pitch', '6 to 8 slides max', 'At 02:30 left, you must be on Traction / Financials'],
      ['10-Minute Department Update', '8 to 10 slides', 'At 05:00 left, finish retrospective and pivot to next-quarter plan'],
      ['20-Minute Conference Talk', '15 to 18 slides', 'At 10:00 left, complete case study setup and enter live demo/results'],
      ['30-Minute Thesis / Client Review', '22 to 25 slides', 'At 15:00 left, move from methodology into findings and recommendations'],
    ],
    fieldNotesTitle: 'Presenter Rehearsal Field Notes',
    fieldNotes: [
      {
        label: 'The Two-Minute Accordion Slide',
        note: 'Build one optional case-study slide near the end of your deck that you can either spend 2 minutes explaining if you are ahead of pace, or skip cleanly with a single sentence if the amber warning is already lit.',
      },
      {
        label: 'Mute Audio Chimes During Live Mic Sessions',
        note: 'Clip-on lavalier and podium condenser mics pick up laptop speakers easily. Use Silent Visual Flash mode on stage and save audible chimes for private rehearsal runs.',
      },
    ],
  },

  'toastmasters-timer': {
    slug: 'toastmasters-timer',
    archetype: 'run-of-show',
    kicker: 'OFFICIAL CLUB & CONTEST TIMING PROTOCOL',
    leadHeading: 'Running Accurate Green, Yellow, and Red Signals as Toastmasters Timer',
    leadParagraphs: [
      'In a Toastmasters meeting or speech contest, the Timer holds one of the most consequential roles in the room: a speaker who finishes even one second before the minimum qualifying mark or 31 seconds past the red signal is disqualified from contest ballots.',
      'This tool pre-loads the exact green, yellow, and red signal windows for Table Topics (1–2 min), Ice Breakers (4–6 min), Standard Pathways Speeches (5–7 min), and Speech Evaluations (2–3 min), switching background colors automatically while logging each speaker’s exact finish time.',
    ],
    executionHeading: 'Checklist for the Meeting Timer Role',
    executionSteps: [
      {
        title: 'Confirm the Speech Category Before the Toastmaster Introduces the Speaker',
        detail: 'Select Table Topics, Ice Breaker, 5–7 Minute Speech, Evaluation, or enter a custom contest window so the green/yellow/red thresholds arm automatically.',
      },
      {
        title: 'Start the Clock on the First Verbal or Non-Verbal Communication',
        detail: 'Per official Toastmasters contest rules, timing begins at the speaker’s first word or intentional gesture toward the audience—not when they shake hands with the chair.',
      },
      {
        title: 'Hold Each Color Signal Until the Next Threshold or Speech End',
        detail: 'unlike a momentary bell, the green, yellow, and red background remains illuminated so the speaker can glance over at any point during their closing paragraph.',
      },
    ],
    runOfShow: {
      slotLabel: 'Standard 5–7 Minute Pathways Speech Window',
      greenMark: '05:00 Elapsed (Minimum Qualifying Time Reached)',
      amberMark: '06:00 Elapsed (1 Minute Target Remaining)',
      redMark: '07:00 Elapsed (Maximum Time — 30s Grace Window Starts)',
      overtimeRule: 'Disqualification in contests occurs below 04:30 or above 07:30 elapsed',
      boothNotes: [
        'In contest mode, never announce disqualification times aloud—record the exact MM:SS on the Chief Judge’s tally sheet.',
        'For Zoom or hybrid club meetings, share the fullscreen timer window as your virtual camera background so remote speakers see the full color card.',
      ],
    },
    tableSectionTitle: 'Official Toastmasters Speech Timing Windows',
    tableSectionIntro: 'Reference thresholds for club meetings and area/division/district speech contests:',
    tableColumns: ['Speech Type', 'Green / Yellow / Red Marks', 'Contest Grace Period (Qualifying Window)'],
    tableRows: [
      ['Table Topics (Impromptu)', 'Green 1:00 · Yellow 1:30 · Red 2:00', '1:00 minimum to 2:30 maximum (no under-time grace)'],
      ['Speech Evaluation', 'Green 2:00 · Yellow 2:30 · Red 3:00', '1:30 minimum to 3:30 maximum (±30 seconds)'],
      ['Ice Breaker Speech', 'Green 4:00 · Yellow 5:00 · Red 6:00', '3:30 minimum to 6:30 maximum (±30 seconds)'],
      ['Standard Pathways / Contest Speech', 'Green 5:00 · Yellow 6:00 · Red 7:00', '4:30 minimum to 7:30 maximum (±30 seconds)'],
    ],
    fieldNotesTitle: 'Club Timer & Chief Judge Field Notes',
    fieldNotes: [
      {
        label: 'Why Table Topics Has No Under-Time Grace Period',
        note: 'While evaluations and prepared speeches allow a 30-second under-time buffer in contests, Table Topics requires a strict 1:00 minimum—finishing at 0:59 disqualifies the contestant.',
      },
      {
        label: 'Color-Blind Accessibility at the Lectern',
        note: 'In addition to green, yellow, and red background fills, the display renders explicit text badges ("GREEN", "YELLOW", "RED") so speakers with red-green color vision deficiency never misread a cue.',
      },
    ],
  },

  'debate-timer': {
    slug: 'debate-timer',
    archetype: 'run-of-show',
    kicker: 'FORENSICS & PARLIAMENTARY ROUND CLOCK',
    leadHeading: 'Managing Constructive Speeches, Cross-Ex, and Flowing Prep Time in One Window',
    leadParagraphs: [
      'Running a competitive debate round with a generic phone timer forces judges and debaters to constantly re-enter durations between an 8-minute constructive, a 3-minute cross-examination, and a running bank of prep time.',
      'This debate clock separates speech segments from cumulative team prep banks so you can start and stop Affirmative or Negative prep down to the second while switching cleanly between Policy, Lincoln-Douglas, Public Forum, and British Parliamentary speech blocks.',
    ],
    executionHeading: 'How to Time a Tournament Round',
    executionSteps: [
      {
        title: 'Load the Tournament Format Before the Coin Flip',
        detail: 'Select Policy (CX), Lincoln-Douglas (LD), Public Forum (PF), or British Parliamentary (BP) to populate the exact speech sequence and prep banks.',
      },
      {
        title: 'Run Cumulative Prep Banks Independently of Speech Clocks',
        detail: 'When a team calls for prep before a rebuttal, click their Prep Bank button; pause it the moment they stand at the podium to preserve their remaining seconds for final focus.',
      },
      {
        title: 'Observe Protected Time in Parliamentary Rounds',
        detail: 'In 7-minute BP speeches, the first minute (0:00–1:00) and final minute (6:00–7:00) are protected from Points of Information (POIs); watch the phase indicator to gavel down out-of-bounds POIs.',
      },
    ],
    runOfShow: {
      slotLabel: 'Public Forum (PF) & Lincoln-Douglas (LD) Round Flow',
      greenMark: 'Constructive / Rebuttal Active (POIs or Crossfire Open)',
      amberMark: '01:00 Remaining (Protected Closing Minute in BP / WUDC)',
      redMark: '00:00 (Finish Current Sentence Only — Judges Stop Flowing)',
      overtimeRule: 'Judges typically allow a speaker to finish the grammatical sentence in progress at 00:00',
      boothNotes: [
        'Keep the screen angled toward both benches and the judge table so neither side has to ask "how much prep do we have left?"',
        'During flashing/email evidence exchange, clarify tournament rules on whether prep starts when the file leaves the sender or opens on the recipient laptop.',
      ],
    },
    tableSectionTitle: 'Competitive Debate Format Breakdown',
    tableSectionIntro: 'Standard NSDA high school, collegiate, and WUDC international tournament time allocations:',
    tableColumns: ['Debate Format', 'Constructive & Rebuttal Lengths', 'Cross-Ex / Prep Time Allocation'],
    tableRows: [
      ['Policy (Cross-Examination)', '8m Constructives · 5m Rebuttals', '3m Cross-Ex after each constructive · 5–8m Prep per team'],
      ['Lincoln-Douglas (LD)', '6m Aff · 7m Neg · 4m 1AR · 6m NR · 3m 2AR', '3m Cross-Ex after each constructive · 4m Prep per debater'],
      ['Public Forum (PF)', '4m Constructives · 4m Rebuttals · 3m Summary · 2m Final Focus', '3m Crossfire (Grand Crossfire after summaries) · 3m Prep per team'],
      ['British Parliamentary (BP)', '7m Speeches across 4 teams (OG, OO, CG, CO)', '15m Pre-round prep · POIs allowed between 1:00 and 6:00'],
    ],
    fieldNotesTitle: 'Adjudicator & Competitor Timing Notes',
    fieldNotes: [
      {
        label: 'Saving 90 Seconds of Prep for the Final Rebuttal',
        note: 'Experienced debaters budget no more than 40% of their prep bank before the first rebuttal, banking at least 90 seconds to weigh final voting issues before the last speech.',
      },
      {
        label: 'Audible vs. Hand-Signal Time Cues',
        note: 'In crowded classrooms where three rounds run adjacent to each other, mute the chime and flash the screen at 1:00 and 0:30 remaining.',
      },
    ],
  },

  'webinar-timer': {
    slug: 'webinar-timer',
    archetype: 'run-of-show',
    kicker: 'VIRTUAL BROADCAST & LIVESTREAM PACING',
    leadHeading: 'Keeping Multi-Host Webinars on Schedule Through Screen Shares and Live Q&A',
    leadParagraphs: [
      'Virtual events lose 35% of their live audience if the host spends 12 minutes on housekeeping slides or lets a product demo bleed into the promised Q&A window. Unlike an in-person stage, remote speakers are staring into a webcam with presentation slides covering their main monitor.',
      'This webinar production clock is built to sit in a compact side window or secondary tablet right below your webcam lens so you can hold eye contact with your audience while tracking segment transitions.',
    ],
    executionHeading: 'Producer Workflow for a 45-Minute Broadcast',
    executionSteps: [
      {
        title: 'Segment the Broadcast into 4 Hard Time Blocks',
        detail: 'Break a 45-minute webinar into a 4-minute cold open, 18-minute core presentation, 10-minute live demo, and 13-minute moderated Q&A.',
      },
      {
        title: 'Pin the Timer Window Directly Beneath Your Webcam',
        detail: 'Position the timer at the top-center of your screen so checking your remaining demo time looks like natural eye contact on camera.',
      },
      {
        title: 'Trigger the Amber Cue 3 Minutes Before Q&A Transition',
        detail: 'When the amber warning illuminates, instruct your co-host in backchannel chat to queue the top three upvoted audience questions.',
      },
    ],
    runOfShow: {
      slotLabel: '45:00 Live Product Webinar & Audience Q&A',
      greenMark: '45:00 → 15:01 (Hook, Core Teaching & Live Walkthrough)',
      amberMark: '15:00 → 03:01 (Audience Q&A & Poll Results)',
      redMark: '03:00 → 00:00 (Next Steps, Resource Links & Hard Sign-Off)',
      overtimeRule: 'End 60 seconds before the top of the hour so attendees can make their next calendar meeting',
      boothNotes: [
        'Never play computer audio chimes if you are sharing system audio in Zoom, Teams, or OBS—keep the timer in visual-only alert mode.',
        'Always pre-load a 2-minute countdown before going live to pace your pre-show lobby music.',
      ],
    },
    tableSectionTitle: 'Webinar Run-of-Show Pacing Blueprint',
    tableSectionIntro: 'Recommended segment splits to maximize live attendee retention through the end of the broadcast:',
    tableColumns: ['Broadcast Segment', 'Clock Window (45m Total)', 'Producer & Host Action'],
    tableRows: [
      ['1. Cold Open & Agenda Hook', '00:00 – 04:00 (4 mins)', 'Skip long bios; state the concrete takeaway within 90 seconds'],
      ['2. Core Framework & Slides', '04:00 – 22:00 (18 mins)', 'Launch 1 audience poll at minute 12 to reset viewer attention'],
      ['3. Live Screen-Share Demo', '22:00 – 32:00 (10 mins)', 'Use pre-staged browser tabs so login/loading never stalls the clock'],
      ['4. Moderated Q&A & Wrap', '32:00 – 44:00 (12 mins)', 'Answer 4–5 concise questions and close 1 minute before the hour'],
    ],
    fieldNotesTitle: 'Livestream Producer Field Notes',
    fieldNotes: [
      {
        label: 'The :59 Minute Rule for Calendar Respect',
        note: 'Ending at `:44` or `:59` instead of dragging 4 minutes past the hour dramatically increases post-webinar survey completion because attendees aren’t rushing out the door.',
      },
      {
        label: 'Backchannel Sync for Remote Co-Hosts',
        note: 'Have both your moderator and presenter open the same preset duration and start on the producer’s verbal "3-2-1 live" count during greenroom check.',
      },
    ],
  },

  'sermon-timer': {
    slug: 'sermon-timer',
    archetype: 'run-of-show',
    kicker: 'SANCTUARY & WORSHIP SERVICE TIMING',
    leadHeading: 'Coordinating Pulpit Pacing, Worship Sets, and Multi-Service Turnarounds',
    leadParagraphs: [
      'When a church or house of worship runs 9:00 AM and 11:00 AM services back-to-back, a 10-minute sermon overrun cascades into the parking lot, children’s ministry check-out, and livestream broadcast cutoffs.',
      'A sanctuary confidence timer gives the speaker a silent, dignified countdown on the rear balcony monitor or pulpit tablet—transitioning smoothly from green to amber when it is time to invite the worship team back up, without ever sounding a disruptive alarm.',
    ],
    executionHeading: 'Sanctuary & Pulpit Display Setup',
    executionSteps: [
      {
        title: 'Lock Silent Visual Mode for All Sanctuary Feeds',
        detail: 'Ensure acoustic chimes are muted so an expired timer never bleeds into the pulpit microphone during closing prayer or altar call.',
      },
      {
        title: 'Set the Amber Threshold for the Worship Team Walk-On Cue',
        detail: 'If the band returns to the platform for the final 4 minutes of the message, set Amber at 04:00 remaining so both the pastor and musical director see the exact transition mark.',
      },
      {
        title: 'Use High-Contrast Dark Mode on Balcony Projection Screens',
        detail: 'Dark background mode keeps rear-wall confidence screens invisible to the congregation while remaining razor-sharp from 80 feet away on the platform.',
      },
    ],
    runOfShow: {
      slotLabel: '35:00 Sunday Message with 4-Minute Musical Underscore',
      greenMark: '35:00 → 05:01 (Scripture, Exposition & Main Points)',
      amberMark: '05:00 → 01:01 (Application & Band Walk-On Cue)',
      redMark: '01:00 → 00:00 (Closing Prayer & Benediction Handoff)',
      overtimeRule: 'Silent red count-up (+MM:SS) alerts the service producer to trim closing announcements',
      boothNotes: [
        'Leave a minimum 25-minute turnaround buffer between services to clear the lobby and reset children’s check-in.',
        'Mount a secondary iPad flat on the lectern angled at 30 degrees if your sanctuary lacks a rear balcony confidence screen.',
      ],
    },
    tableSectionTitle: 'Multi-Service Worship Timing Schedule',
    tableSectionIntro: 'Standard 65-minute service run sheet engineered for smooth two-service Sunday turnarounds:',
    tableColumns: ['Service Element', 'Target Duration', 'Visual Timer Cue & Handoff'],
    tableRows: [
      ['Pre-Service Countdown Walk-In', '05:00 countdown', 'Projected on main screens with background music; hits 00:00 on downbeat'],
      ['Opening Worship Set & Welcome', '18:00 – 20:00', 'Amber at 02:00 left for host transition and greeting'],
      ['Main Sermon / Message', '32:00 – 35:00', 'Amber at 04:00 left (band cue); Red at 01:00 left (closing prayer)'],
      ['Closing Song & Dismissal', '06:00 – 08:00', 'Hard finish at 65 minutes total to preserve 25m parking turnaround'],
    ],
    fieldNotesTitle: 'Production Director Field Notes',
    fieldNotes: [
      {
        label: 'Why Red Count-Up Works Better Than Flashing 00:00',
        note: 'When a speaker sees `00:00` for ten minutes, they lose all sense of how far over they are. Seeing `+04:30` in red provides immediate, gentle accountability.',
      },
      {
        label: 'Synchronizing Livestream Lower-Thirds',
        note: 'Match the pulpit countdown to your broadcast switcher clock so your livestream host knows exactly when to prepare the post-service wrap-up camera.',
      },
    ],
  },

  // ============================================================================
  // ARCHETYPE 5: GLOBAL OPERATIONS & TZ DESK (World Clock & Time-Zone Tools)
  // ============================================================================
  'world-clock': {
    slug: 'world-clock',
    archetype: 'global-desk',
    kicker: 'INTERNATIONAL TIME & IANA OFFSET DESK',
    leadHeading: 'Tracking Live Global Hubs Across Fractional Offsets and Split DST Seasons',
    leadParagraphs: [
      'Mental time-zone math works fine when you only track New York and London—except during the two weeks in March and November when the US and Europe switch Daylight Saving Time on different Sundays, temporarily shrinking their 5-hour gap to 4 hours.',
      'Add Mumbai (`UTC+05:30`), Kathmandu (`UTC+05:45`), Adelaide (`UTC+09:30`), and Sydney (which enters summer DST in October while the Northern Hemisphere enters winter standard time), and manual offset arithmetic breaks down fast. This live World Clock queries your browser’s official IANA Time Zone Database every second to show verified local times, UTC offsets, and day-of-week rollovers.',
    ],
    executionHeading: 'Setting Up Your Multi-Region Operations Board',
    executionSteps: [
      {
        title: 'Pin Your Home Reference Hub First',
        detail: 'Add your local headquarters city first so every other card displays an instant relative hour delta (`+5h`, `-8h`, `+5.5h`) alongside its UTC offset.',
      },
      {
        title: 'Watch the Day-of-Week Badge Across the International Date Line',
        detail: 'When scheduling Friday afternoon calls in San Francisco, check the `Tomorrow` badge on Tokyo, Sydney, and Auckland cards so you don’t book a teammate’s Saturday morning.',
      },
      {
        title: 'Verify Active DST Status Before Locking Recurring Calendar Invites',
        detail: 'A recurring meeting fixed to 09:00 EST will shift by an hour in UTC-stable hubs like Tokyo or Singapore the Monday after US Daylight Saving switches.',
      },
    ],
    globalCorridor: {
      corridorLabel: 'US / UK / India / APAC Engineering Corridor',
      utcFormula: 'Local Time = UTC Epoch + IANA Zone Base Offset + Active Seasonal DST Rule',
      dstTrapWarning: 'Between mid-March and late-March, US clocks are already on EDT (UTC-4) while London is still on GMT (UTC+0)—temporarily changing the NY–London gap from 5 hours to 4 hours.',
      goldenWindow: '13:00 UTC – 15:00 UTC connects US East (09:00–11:00), UK (13:00–15:00), and India (18:30–20:30)',
      playbooks: [
        {
          regionPair: 'New York ↔ London ↔ Berlin',
          bestSlotUtc: '13:00 – 16:00 UTC',
          localTimes: '09:00–12:00 EDT · 14:00–17:00 BST · 15:00–18:00 CEST',
          tip: 'Audit recurring invites during the March and October/November DST transition weeks.',
        },
        {
          regionPair: 'London ↔ Bengaluru ↔ Singapore',
          bestSlotUtc: '08:00 – 10:00 UTC',
          localTimes: '09:00–11:00 BST · 13:30–15:30 IST · 16:00–18:00 SGT',
          tip: 'Remember India uses a 30-minute fractional offset (UTC+05:30) year-round with no DST.',
        },
        {
          regionPair: 'San Francisco ↔ Tokyo ↔ Sydney',
          bestSlotUtc: '22:00 – 00:00 UTC',
          localTimes: '15:00–17:00 PDT · 07:00–09:00+1 JST · 08:00–10:00+1 AEST',
          tip: 'US West Coast afternoon maps cleanly to Friday morning in Tokyo and Sydney.',
        },
      ],
    },
    tableSectionTitle: 'Global Hub UTC Offsets & Daylight Saving Reference',
    tableSectionIntro: 'Standard vs. Daylight Saving offsets for major financial and engineering hubs:',
    tableColumns: ['City / IANA Zone', 'Standard Offset', 'DST Offset & Seasonal Rule'],
    tableRows: [
      ['New York (America/New_York)', 'UTC−05:00 (EST)', 'UTC−04:00 (EDT) · 2nd Sun Mar to 1st Sun Nov'],
      ['London (Europe/London)', 'UTC+00:00 (GMT)', 'UTC+01:00 (BST) · Last Sun Mar to Last Sun Oct'],
      ['Mumbai / Bengaluru (Asia/Kolkata)', 'UTC+05:30 (IST)', 'No DST · Fixed 30-minute fractional offset year-round'],
      ['Tokyo (Asia/Tokyo) & Singapore', 'UTC+09:00 (JST) / UTC+08:00 (SGT)', 'No DST · Clocks never shift seasonally'],
      ['Sydney (Australia/Sydney)', 'UTC+10:00 (AEST)', 'UTC+11:00 (AEDT) · 1st Sun Oct to 1st Sun Apr (Southern Summer)'],
    ],
    fieldNotesTitle: 'Distributed Team Scheduling Notes',
    fieldNotes: [
      {
        label: 'Why Arizona and Hawaii Break US Time-Zone Assumptions',
        note: 'Phoenix (`America/Phoenix`) stays on `UTC-7` year-round, meaning it matches Denver in winter (MST) and Los Angeles in summer (PDT). Always select the specific IANA city rather than guessing by mountain/pacific labels.',
      },
      {
        label: 'Publishing Release Windows in Explicit UTC',
        note: 'When announcing server maintenance or global product launches, always state both the local hub time and explicit `UTC` (e.g., `14:00 UTC`) so international engineers never misread ambiguous abbreviations like `CST`.',
      },
    ],
  },

  'time-zone-converter': {
    slug: 'time-zone-converter',
    archetype: 'global-desk',
    kicker: 'FUTURE DATE & DST-AWARE CONVERSION DESK',
    leadHeading: 'Converting Future Event Times Across Cities Without Falling Into the DST Gap',
    leadParagraphs: [
      'Converting "what time is 3:00 PM right now in Berlin" is easy. Converting "what time will our November 2nd product launch be in London, New York, and Sydney" is where teams make costly mistakes—because between October 25 and November 1, Europe has already returned to standard time while North America is still on Daylight Saving Time.',
      'This date-aware Time-Zone Converter resolves the exact historical and future IANA offset for the specific calendar date you pick, updating every comparison city simultaneously as you scrub the time slider.',
    ],
    executionHeading: 'How to Convert a Future Event Time Accurately',
    executionSteps: [
      {
        title: 'Pick the Exact Future Calendar Date First',
        detail: 'Always set the target month and day before reading the converted hours so the IANA engine applies the correct seasonal DST rules for that specific date.',
      },
      {
        title: 'Scrub the Time Slider to Preview Morning vs. Evening Impact',
        detail: 'Drag the timeline across the 24-hour bar to watch how shifting an event by 90 minutes moves partner offices out of late-night overtime.',
      },
      {
        title: 'Copy the Multi-Zone Timestamp Block Into Your Invite',
        detail: 'Paste the verified city block (including day-of-week rollover markers like `+1 day`) directly into Slack, Teams, or email announcements.',
      },
    ],
    globalCorridor: {
      corridorLabel: 'Date-Specific Cross-Hemisphere Conversion',
      utcFormula: 'Target City Time = Source Local Time − Source Offset(Date) + Target Offset(Date)',
      dstTrapWarning: 'Never convert a July meeting time using January UTC offsets: Sydney and London swing by a full 2 hours relative to each other between January (11h gap) and July (9h gap).',
      goldenWindow: 'Always anchor global webinar announcements to UTC plus 3 regional hub times',
      playbooks: [
        {
          regionPair: 'London ↔ Sydney (January vs. July)',
          bestSlotUtc: '07:00 UTC (Jan) / 08:00 UTC (Jul)',
          localTimes: 'Jan: 07:00 GMT = 18:00 AEDT (11h gap) · Jul: 09:00 BST = 18:00 AEST (9h gap)',
          tip: 'Opposite-hemisphere DST shifts the London–Sydney time difference by 2 full hours twice a year.',
        },
        {
          regionPair: 'New York ↔ Tel Aviv / Dubai',
          bestSlotUtc: '13:00 – 15:00 UTC',
          localTimes: '09:00–11:00 EDT · 16:00–18:00 IDT · 17:00–19:00 GST',
          tip: 'Keep Middle East syncs before 11:00 AM Eastern, and note Sunday–Thursday workweek norms where applicable.',
        },
      ],
    },
    tableSectionTitle: 'Seasonal Time-Difference Swing Table',
    tableSectionIntro: 'See how the hour difference between major city pairs changes across the calendar year:',
    tableColumns: ['City Pair', 'Northern Winter (Jan)', 'Northern Summer (Jul) & Transition Weeks'],
    tableRows: [
      ['New York ↔ London', '5 hours (EST to GMT)', '5 hours (EDT to BST) · 4 hours during late-March / late-October gap'],
      ['London ↔ Sydney', '11 hours (GMT to AEDT)', '9 hours (BST to AEST) · 10 hours during April/October transition weeks'],
      ['San Francisco ↔ Bengaluru', '13.5 hours (PST to IST)', '12.5 hours (PDT to IST) · India never shifts clocks'],
      ['New York ↔ Tokyo', '14 hours (EST to JST)', '13 hours (EDT to JST) · Japan never shifts clocks'],
    ],
    fieldNotesTitle: 'Cross-Border Conversion Field Notes',
    fieldNotes: [
      {
        label: 'Avoid Ambiguous 3-Letter Abbreviations (`CST`, `IST`, `BST`)',
        note: '`CST` can mean US Central Standard Time (`UTC-6`), China Standard Time (`UTC+8`), or Cuba Standard Time (`UTC-5`). Always pair abbreviations with the city name or numeric `UTC±HH:MM` offset.',
      },
      {
        label: 'Checking Midnight Date Rollovers',
        note: 'A webinar at 5:00 PM Thursday in California is 10:00 AM Friday in Sydney. Always include the day of the week for APAC recipients.',
      },
    ],
  },

  'meeting-planner': {
    slug: 'meeting-planner',
    archetype: 'global-desk',
    kicker: 'MULTI-ZONE WORKING HOURS OVERLAP FINDER',
    leadHeading: 'Finding Humane Meeting Slots Across Three Continents',
    leadParagraphs: [
      'When your product team spans San Francisco, London, and Bengaluru, there is zero hour of the 24-hour day where all three offices sit inside standard 9-to-5 working hours. Trying to eyeball three calendar columns usually results in the same remote hub taking 10:30 PM calls every week.',
      'This International Meeting Planner color-codes every hour across all participant cities into green standard hours (09:00–17:00), amber flex hours (07:00–09:00 and 17:00–21:00), and red overnight hours so you can spot the least painful compromise slot in seconds.',
    ],
    executionHeading: 'How to Schedule a Fair Global Sync',
    executionSteps: [
      {
        title: 'Add All Participant Cities to the Comparison Matrix',
        detail: 'Select 2 to 6 cities to align their 24-hour rows vertically on the same UTC baseline.',
      },
      {
        title: 'Scan for All-Green Columns First, Then Green + Amber Columns',
        detail: 'For 2-region calls, pick an all-green column. For 3-continent calls, look for columns with two green cells and one amber early-morning or early-evening cell—never a red overnight cell.',
      },
      {
        title: 'Rotate the Amber Burden Monthly Across Regions',
        detail: 'If a monthly all-hands requires one hub to join at 07:30 AM or 07:30 PM, alternate between an Americas-friendly slot and an APAC-friendly slot every other month.',
      },
    ],
    globalCorridor: {
      corridorLabel: 'Three-Continent Overlap Optimization',
      utcFormula: 'Overlap Score = Sum of Participant Working-Hour Weights at Hour(UTC)',
      dstTrapWarning: 'Locking a recurring 3-region meeting to one local clock causes the early-morning hub in APAC or US West to shift into 06:00 AM darkness when DST switches.',
      goldenWindow: '14:00–15:00 UTC (US West 07:00, US East 10:00, UK 15:00, CET 16:00, India 19:30)',
      playbooks: [
        {
          regionPair: 'US West + US East + UK/Europe',
          bestSlotUtc: '15:00 – 17:00 UTC',
          localTimes: '08:00–10:00 PDT · 11:00–13:00 EDT · 16:00–18:00 BST',
          tip: 'Golden 2-hour window where California starts the day and Europe wraps up.',
        },
        {
          regionPair: 'US East + UK + India',
          bestSlotUtc: '12:30 – 14:30 UTC',
          localTimes: '08:30–10:30 EDT · 13:30–15:30 BST · 18:00–20:00 IST',
          tip: 'Starting on the `:30` half-hour respects India’s `UTC+5:30` evening boundary.',
        },
      ],
    },
    tableSectionTitle: 'Global Overlap Playbook by Region Mix',
    tableSectionIntro: 'Use these proven UTC slots when coordinating distributed teams:',
    tableColumns: ['Team Footprint', 'Best UTC Window', 'Trade-Off & Rotation Strategy'],
    tableRows: [
      ['Americas + Europe (EMEA)', '14:00 – 17:00 UTC', 'Zero overnight burden; hits morning in Americas and afternoon in EMEA'],
      ['Europe (EMEA) + India + APAC', '07:30 – 09:30 UTC', 'Morning in London/Berlin, early afternoon in India, late afternoon in Singapore/Tokyo'],
      ['US West + US East + APAC', '21:00 – 23:00 UTC', 'Afternoon in US, early morning (+1 day) in Tokyo/Sydney'],
      ['Full Global (US + EMEA + APAC)', 'Split into 2 alternating sessions', 'Run Session A at 08:00 UTC (EMEA/APAC) and Session B at 16:00 UTC (Americas/EMEA)'],
    ],
    fieldNotesTitle: 'Global Operations Lead Notes',
    fieldNotes: [
      {
        label: 'Why Async Video Beats a 3-Continent Status Call',
        note: 'Never force a 3-continent live call just to read status updates. Record a 5-minute video walkthrough ahead of time and reserve the live 30-minute overlap window strictly for high-bandwidth decisions.',
      },
      {
        label: 'Half-Hour Start Times for `UTC+5:30` and `UTC+9:30` Teams',
        note: 'When scheduling with colleagues in Bengaluru or Adelaide, booking meetings at `:30` past the hour gives them clean top-of-the-hour boundaries on their local clock.',
      },
    ],
  },

  // ============================================================================
  // ARCHETYPE 3: WORKED-FORMULA & AUDIT LEDGER (Date, Time & Payroll Calculators)
  // ============================================================================
  'time-duration-calculator': {
    slug: 'time-duration-calculator',
    archetype: 'formula-ledger',
    kicker: 'ELAPSED TIME & DECIMAL PAYROLL AUDIT',
    leadHeading: 'Why Base-60 Clock Hours Break Spreadsheet Payroll—and How to Calculate Exact Elapsed Time',
    leadParagraphs: [
      'The most common payroll and billing error happens when someone types `8:45` into a spreadsheet as `8.45` and multiplies it by an hourly rate. Because clocks run on base-60 minutes while currency runs on base-100 decimals, `45 minutes` is `0.75 hours`—meaning `8.45` shortchanges a worker or contractor by 18 minutes of pay on a single shift.',
      'This Time Duration Calculator computes the exact elapsed span between any two timestamps (including overnight shifts that cross midnight and multi-day spans), outputting hours/minutes, total minutes, total seconds, and exact 2-decimal payroll hours side by side.',
    ],
    executionHeading: 'Auditing a Shift or SLA Window Step by Step',
    executionSteps: [
      {
        title: 'Enter Start and End Timestamps in 12-Hour or 24-Hour Format',
        detail: 'Input the clock-in and clock-out times; if the end time is earlier than the start time (such as 22:15 to 06:45), the calculator automatically handles the midnight date rollover.',
      },
      {
        title: 'Deduct Unpaid Meal Breaks Before Converting to Decimal Hours',
        detail: 'Subtract unpaid 30-minute or 45-minute breaks in base-60 minutes first, then divide the remaining net minutes by 60.',
      },
      {
        title: 'Use the Decimal Hours Output for Hourly Rate Multiplication',
        detail: 'Copy the base-10 decimal value (`8.75 hrs`, not `8:45`) into your invoice, ERP, or payroll sheet.',
      },
    ],
    workedLedger: {
      formulaTitle: 'Base-60 to Decimal Hours Conversion Formula',
      formulaExpression: 'Decimal Hours = Whole Hours + (Remaining Minutes ÷ 60) + (Seconds ÷ 3600)',
      scenarioName: 'Overnight Hospital Nurse Shift with 30m Unpaid Meal Break',
      inputs: [
        { label: 'Clock-In Timestamp', value: '18:45 (6:45 PM)' },
        { label: 'Clock-Out Timestamp', value: '07:15 (+1 Day, 7:15 AM)' },
        { label: 'Unpaid Meal Deduction', value: '30 Minutes' },
      ],
      mathSteps: [
        'Step 1 (Evening Segment to Midnight): 24:00 − 18:45 = 5 hours 15 minutes (315 mins)',
        'Step 2 (Morning Segment after Midnight): 00:00 → 07:15 = 7 hours 15 minutes (435 mins)',
        'Step 3 (Gross Elapsed Span): 315 mins + 435 mins = 750 mins (12 hours 30 minutes)',
        'Step 4 (Deduct 30m Break & Convert): (750 − 30) ÷ 60 = 720 ÷ 60 = 12.00 Decimal Hours',
      ],
      finalOutput: '12 hrs 00 mins Net · 720 Total Mins · 12.00 Decimal Hours',
      auditWarning: 'During the November "Fall Back" DST night, a physical 18:45 to 07:15 overnight shift includes the repeated 01:00–02:00 AM hour, equaling 13.00 net hours worked.',
    },
    tableSectionTitle: 'Minutes to Payroll Decimal Conversion Chart',
    tableSectionIntro: 'Bookmark this base-60 to base-100 lookup table to eliminate timesheet rounding mistakes:',
    tableColumns: ['Clock Minutes', 'Exact Fraction of an Hour', 'Decimal Payroll Equivalent'],
    tableRows: [
      ['05 / 10 / 15 minutes', '1/12 · 1/6 · 1/4 hr', '0.08 · 0.17 · 0.25 hrs'],
      ['20 / 25 / 30 minutes', '1/3 · 5/12 · 1/2 hr', '0.33 · 0.42 · 0.50 hrs'],
      ['35 / 40 / 45 minutes', '7/12 · 2/3 · 3/4 hr', '0.58 · 0.67 · 0.75 hrs'],
      ['50 / 55 / 60 minutes', '5/6 · 11/12 · 1/1 hr', '0.83 · 0.92 · 1.00 hrs'],
    ],
    fieldNotesTitle: 'Payroll & SLA Audit Field Notes',
    fieldNotes: [
      {
        label: 'The FLSA 7-Minute (Quarter-Hour) Rounding Rule',
        note: 'Organizations that round timecards to 15-minute increments must round 1–7 minutes down and 8–14 minutes up consistently—or switch to exact minute-by-minute decimal calculation (`Minutes ÷ 60`) to avoid rounding disputes.',
      },
      {
        label: 'Calculating Server Uptime & Incident MTTR',
        note: 'Site Reliability Engineers use the Total Seconds and Total Minutes outputs to compute Mean Time To Recovery (MTTR) and verify whether a downtime incident breached a monthly 99.9% SLA budget (`43m 49s` per 30-day month).',
      },
    ],
  },

  'time-calculator': {
    slug: 'time-calculator',
    archetype: 'formula-ledger',
    kicker: 'SEXAGESIMAL TIME ADDITION & SUBTRACTION',
    leadHeading: 'Adding and Subtracting Multi-Segment Durations Without Base-60 Carry Errors',
    leadParagraphs: [
      'Adding `1 hour 45 minutes`, `2 hours 35 minutes`, and `50 minutes` by hand is tedious because every time your minutes column passes 60, you have to carry an hour over and keep the remainder.',
      'Whether you are totaling flight logbook legs, summing video editing timeline reels, or subtracting a warm-up block from a 3-hour broadcast window, this Time Calculator normalizes all inputs to total seconds first and converts the final sum cleanly into days, hours, minutes, and seconds.',
    ],
    executionHeading: 'How to Sum or Deduct Time Blocks',
    executionSteps: [
      {
        title: 'Enter Your Base Time Block (Days, Hours, Minutes, Seconds)',
        detail: 'Start with your primary duration or budget cap—even if someone gives you an un-normalized value like `95 minutes`.',
      },
      {
        title: 'Choose Add (+) or Subtract (−) for Each Additional Segment',
        detail: 'Chain multiple work logs, flight legs, or audio tracks together to compute a running cumulative total.',
      },
      {
        title: 'Review Both Normalized D:H:M:S and Single-Unit Equivalents',
        detail: 'Read the carried result in standard clock units alongside total minutes, total seconds, and decimal hours.',
      },
    ],
    workedLedger: {
      formulaTitle: 'Base-60 Normalization Algorithm',
      formulaExpression: 'Total Seconds = Σ (Days × 86,400 + Hours × 3,600 + Minutes × 60 + Seconds)',
      scenarioName: 'Summing Three Podcast Interview Segments + Intro/Outro Music',
      inputs: [
        { label: 'Segment 1 + Segment 2', value: '00:28:45 + 00:34:50' },
        { label: 'Segment 3 + Ad Read', value: '00:19:30 + 00:02:15' },
        { label: 'Trim Cut (Subtracted)', value: '− 00:04:20' },
      ],
      mathSteps: [
        'Step 1 (Sum Raw Seconds): 45s + 50s + 30s + 15s − 20s = 120s = 2 minutes 00 seconds carry',
        'Step 2 (Sum Raw Minutes + Carry): 28m + 34m + 19m + 2m − 4m + 2m (carry) = 81 minutes',
        'Step 3 (Normalize 81 Minutes): 81 ÷ 60 = 1 hour with 21 minutes remainder',
      ],
      finalOutput: '1 Hour 21 Minutes 00 Seconds (81.00 Minutes / 4,860 Seconds)',
      auditWarning: 'Always enter seconds when summing media or athletics splits—ignoring 45-second remainders across 10 clips creates a 7.5-minute runtime error.',
    },
    tableSectionTitle: 'Common Multi-Segment Time Addition Benchmarks',
    tableSectionIntro: 'Quick verification examples for aviation, media post-production, and project billing:',
    tableColumns: ['Use Case', 'Input Segments', 'Normalized Output & Decimal Equivalent'],
    tableRows: [
      ['Pilot Logbook Cross-Country', '1h 50m + 2h 25m + 0h 45m', '5 hours 00 minutes (5.00 decimal flight hours)'],
      ['4-Ticket Freelance Sprint', '1h 20m + 0h 55m + 2h 10m + 0h 35m', '5 hours 00 minutes (300 total minutes)'],
      ['Marathon Split Projection', '1:58:30 First Half + 2:04:45 Second Half', '4 hours 03 minutes 15 seconds (243.25 minutes)'],
      ['Broadcast Show Timing', '60m Slot − (42m Content + 14m 30s Ads)', '3 minutes 30 seconds remaining buffer'],
    ],
    fieldNotesTitle: 'Time Arithmetic Field Notes',
    fieldNotes: [
      {
        label: 'Entering Un-Normalized Values Directly (`140 Minutes`)',
        note: 'You don’t need to pre-convert `140 minutes` to `2 hours 20 minutes` before typing it in—enter `140` directly in the minutes box and the engine normalizes it automatically.',
      },
      {
        label: 'Aviation Tenths of an Hour (`Hobbs Meter` Logging)',
        note: 'Flight logs typically bill in tenths of an hour (every 6 minutes = `0.1 hr`), whereas corporate payroll bills in quarter hours (15 minutes = `0.25 hr`). Use the decimal output to match your exact billing standard.',
      },
    ],
  },

  'date-calculator': {
    slug: 'date-calculator',
    archetype: 'formula-ledger',
    kicker: 'GREGORIAN CALENDAR & BUSINESS DAY LEDGER',
    leadHeading: 'Counting Exact Calendar Days, Business Days, and Chronological Age Without Off-by-One Errors',
    leadParagraphs: [
      'When a contract gives you "30 days from March 15" or "45 business days to close escrow," counting squares on a wall calendar often goes wrong around 31-day vs. 30-day months, leap-year Februarys, and whether the start date itself is included.',
      'This three-in-one Date Calculator handles exact calendar day spans, weekday-only business day projections, and chronological age breakdowns (years, months, days) using strict proleptic Gregorian calendar rules.',
    ],
    executionHeading: 'How to Audit Contract Deadlines and Date Spans',
    executionSteps: [
      {
        title: 'Choose Days Between, Add/Subtract Days, or Age Mode',
        detail: 'Select whether you are measuring the span between two known dates or projecting a future/past deadline from a start date.',
      },
      {
        title: 'Decide Whether to Include the End Date (Inclusive vs. Exclusive)',
        detail: 'Standard subtraction (`March 10 − March 1 = 9 days`) measures elapsed nights; hotel bookings or inclusive PTO requests count both endpoints (`10 days`).',
      },
      {
        title: 'Check the Weekday vs. Weekend Split for Business Deadlines',
        detail: 'Review the exact count of Monday–Friday working days separately from Saturday/Sunday weekend days.',
      },
    ],
    workedLedger: {
      formulaTitle: 'Gregorian Leap-Year & Inclusive Span Rules',
      formulaExpression: 'Leap Year = (Year % 4 === 0 && Year % 100 !== 0) || (Year % 400 === 0)',
      scenarioName: '90-Calendar-Day Visa & Contract Notice Window Starting Jan 15 (Non-Leap Year)',
      inputs: [
        { label: 'Start Date', value: 'January 15, 2026' },
        { label: 'Notice Period', value: '+90 Calendar Days (Exclusive of Start Day)' },
        { label: 'February Length (2026)', value: '28 Days (2026 is not divisible by 4)' },
      ],
      mathSteps: [
        'Step 1 (Remaining Days in January): 31 − 15 = 16 days (reaches Jan 31)',
        'Step 2 (Full Month of February 2026): 16 + 28 = 44 days elapsed (reaches Feb 28)',
        'Step 3 (Full Month of March): 44 + 31 = 75 days elapsed (reaches Mar 31)',
        'Step 4 (Remaining Days Needed in April): 90 − 75 = 15 days → April 15, 2026',
      ],
      finalOutput: 'Wednesday, April 15, 2026 (64 Weekdays · 26 Weekend Days)',
      auditWarning: 'Why "3 Months" ≠ "90 Days": Adding 3 calendar months to May 15 lands on August 15 (92 days later because May and July have 31 days). Legal agreements specify "90 days" to avoid month-length variance.',
    },
    tableSectionTitle: 'Calendar Span vs. Business Day Reference',
    tableSectionIntro: 'How standard legal, real estate, and HR windows translate across calendar vs. working days:',
    tableColumns: ['Common Deadline Window', 'Counting Method', 'Typical Calendar Span & Trap to Watch'],
    tableRows: [
      ['10 Business Days (Legal Response)', 'Monday–Friday only (excludes weekends)', '14 calendar days (15–16 days if a public holiday falls mid-week)'],
      ['30 Calendar Days (Net-30 Invoice)', 'Every calendar day including weekends', 'Shifts by 1–2 days depending on whether the start month has 28, 30, or 31 days'],
      ['60-Day Lease Notice', 'Exact day count (`+60 days`) vs. 2 calendar months', 'Verify lease wording: 60 days from July 1 is August 30, not September 1'],
      ['90-Day Probationary Period', 'Exact 90 calendar days (12 weeks + 6 days)', 'Always check if day 90 lands on a Saturday/Sunday and rolls to Monday'],
    ],
    fieldNotesTitle: 'Contract & Scheduling Audit Notes',
    fieldNotes: [
      {
        label: 'Public Holidays in Business-Day Counts',
        note: 'The weekday counter automatically strips Saturdays and Sundays. Because statutory holidays vary by country and state, subtract any mid-week bank holidays that fall inside your date range.',
      },
      {
        label: 'Century Leap-Year Exception (`2000` vs. `2100`)',
        note: 'Years divisible by 4 are leap years (`2024`, `2028`), except century years not divisible by 400 (`1900` and `2100` have 28-day Februarys, while `2000` had 29).',
      },
    ],
  },

  'time-card-calculator': {
    slug: 'time-card-calculator',
    archetype: 'formula-ledger',
    kicker: 'WEEKLY TIMESHEET & GROSS PAYROLL LEDGER',
    leadHeading: 'Auditing Weekly Clock-In / Clock-Out Punches and Unpaid Meal Deductions',
    leadParagraphs: [
      'Weekly payroll disputes almost always come down to two things: an unpaid 30-minute lunch break that wasn’t deducted properly on one day, or daily minute remainders that were rounded inconsistently before multiplying by the hourly wage.',
      'This 7-day Time Card Calculator lets you enter exact clock-in, clock-out, and unpaid break minutes for Monday through Sunday, automatically computing daily net hours, weekly regular vs. overtime splits, and total gross pay.',
    ],
    executionHeading: 'How to Run a Weekly Timesheet Audit',
    executionSteps: [
      {
        title: 'Enter Daily In/Out Punches and Unpaid Break Minutes',
        detail: 'Input each day’s start time, end time, and unpaid meal break (e.g., 30 or 45 minutes). Leave off-days blank.',
      },
      {
        title: 'Set Your Weekly Overtime Threshold and Multiplier',
        detail: 'Configure your standard weekly threshold (default 40.00 hours) and overtime multiplier (`1.5x` time-and-a-half or `2.0x` double time).',
      },
      {
        title: 'Export or Print the Verified Weekly Breakdown',
        detail: 'Review both `HH:MM` and `0.00` decimal totals alongside gross regular and overtime pay before submitting to payroll.',
      },
    ],
    workedLedger: {
      formulaTitle: 'Weekly Net Hours & Overtime Split Formula',
      formulaExpression: 'Weekly Net = Σ ((Out − In − Break) ÷ 60) · OT Hours = max(0, Weekly Net − 40)',
      scenarioName: '5-Day Warehouse Technician Timesheet at $28.00/hr (1.5x OT over 40h)',
      inputs: [
        { label: 'Mon–Thu Shifts (4 Days)', value: '07:30 to 16:45 with 30m break (8h 45m = 8.75h/day)' },
        { label: 'Friday Shift (1 Day)', value: '07:30 to 15:30 with 30m break (7h 30m = 7.50h)' },
        { label: 'Hourly Rate & OT Rule', value: '$28.00/hr Regular · $42.00/hr (1.5x) over 40.00 hrs' },
      ],
      mathSteps: [
        'Step 1 (Mon–Thu Subtotal): 4 days × 8.75 hours = 35.00 net hours',
        'Step 2 (Add Friday Shift): 35.00 + 7.50 = 42.50 total weekly decimal hours (42h 30m)',
        'Step 3 (Split Regular vs. Overtime): 40.00 Regular Hours + 2.50 Overtime Hours',
        'Step 4 (Compute Gross Pay): (40 × $28.00 = $1,120.00) + (2.50 × $42.00 = $105.00) = $1,225.00',
      ],
      finalOutput: '42.50 Total Hours (40.00 Reg + 2.50 OT) · $1,225.00 Gross Pay',
      auditWarning: 'Under US FLSA rules, paid 10–15 minute rest breaks count as compensable time worked and must NOT be entered in the unpaid break deduction column.',
    },
    tableSectionTitle: 'Daily Shift & Break Deduction Reference',
    tableSectionIntro: 'Common shift schedules showing gross span vs. net payable decimal hours:',
    tableColumns: ['Shift Window', 'Unpaid Meal Break', 'Net Payable Time (HH:MM & Decimal)'],
    tableRows: [
      ['08:00 AM – 04:30 PM', '30 minutes', '8 hours 00 minutes (8.00 decimal hrs)'],
      ['08:30 AM – 05:15 PM', '45 minutes', '8 hours 00 minutes (8.00 decimal hrs)'],
      ['07:00 AM – 03:45 PM', '30 minutes', '8 hours 15 minutes (8.25 decimal hrs)'],
      ['06:00 AM – 06:30 PM (12h Shift)', '30 minutes', '12 hours 00 minutes (12.00 decimal hrs)'],
    ],
    fieldNotesTitle: 'HR & Bookkeeping Field Notes',
    fieldNotes: [
      {
        label: 'Weekly (>40h) vs. Daily (>8h) Overtime Jurisdictions',
        note: 'While federal FLSA calculates overtime strictly on hours worked over 40 in a workweek, states like California also require daily `1.5x` overtime for hours worked beyond 8 in a single workday.',
      },
      {
        label: 'Gross Pre-Tax Scope',
        note: 'All dollar outputs represent gross pre-tax earnings before FICA, federal/state income tax withholding, or benefit deductions.',
      },
    ],
  },

  'overtime-calculator': {
    slug: 'overtime-calculator',
    archetype: 'formula-ledger',
    kicker: 'FLSA & DOUBLE-TIME PAYOUT CALCULATOR',
    leadHeading: 'Calculating 1.5x Time-and-a-Half and 2.0x Double-Time Pay Without Spreadsheet Errors',
    leadParagraphs: [
      'When an hourly employee works a 54-hour week—including a Sunday emergency call-out—managers need to know two things immediately: what is the total gross payout, and what is the true "effective blended hourly rate" for job-costing that project?',
      'This Overtime Calculator separates regular base hours, `1.5x` time-and-a-half hours, and `2.0x` double-time hours, showing exact dollar subtotals and the blended hourly cost per labor hour.',
    ],
    executionHeading: 'How to Model Overtime Pay and Labor Cost',
    executionSteps: [
      {
        title: 'Enter Base Hourly Wage and Regular Hours Worked',
        detail: 'Input the worker’s standard hourly rate and base hours (typically 40.00 hours for a full-time workweek).',
      },
      {
        title: 'Add 1.5x Overtime and 2.0x Double-Time Hours',
        detail: 'Enter any hours worked at time-and-a-half (`1.5x`) and any holiday or seventh-consecutive-day hours worked at double time (`2.0x`).',
      },
      {
        title: 'Check the Blended Hourly Rate for Project Bidding',
        detail: 'Use the Effective Hourly Rate output (`Total Gross Pay ÷ Total Hours`) to see how overtime impacts your unit labor margin.',
      },
    ],
    workedLedger: {
      formulaTitle: 'Multi-Tier Overtime & Blended Rate Formula',
      formulaExpression: 'Gross Pay = (Reg × R) + (OT₁ × R × 1.5) + (OT₂ × R × 2.0) · Blended Rate = Gross ÷ Total Hours',
      scenarioName: 'Field Electrician Working 40h Regular + 8h (1.5x) + 4h Sunday (2.0x) at $32.00/hr',
      inputs: [
        { label: 'Base Hourly Rate (R)', value: '$32.00 / hr' },
        { label: 'Regular Hours (1.0x)', value: '40.00 hrs ($1,280.00)' },
        { label: 'Overtime (1.5x) & Double-Time (2.0x)', value: '8.00 hrs @ $48/hr + 4.00 hrs @ $64/hr' },
      ],
      mathSteps: [
        'Step 1 (Regular Base Pay): 40.00 × $32.00 = $1,280.00',
        'Step 2 (Time-and-a-Half 1.5x Pay): 8.00 × ($32.00 × 1.5) = 8.00 × $48.00 = $384.00',
        'Step 3 (Double-Time 2.0x Pay): 4.00 × ($32.00 × 2.0) = 4.00 × $64.00 = $256.00',
        'Step 4 (Total Gross & Blended Rate): $1,920.00 ÷ 52.00 hrs = $36.92 Effective Hourly Rate',
      ],
      finalOutput: '$1,920.00 Total Gross Pay ($640.00 OT Premium) · $36.92/hr Blended Rate',
      auditWarning: 'Non-discretionary production bonuses must be included in the "Regular Rate of Pay" before calculating the 1.5x overtime premium under federal FLSA rules.',
    },
    tableSectionTitle: 'Overtime Multiplier & Effective Rate Reference',
    tableSectionIntro: 'See how overtime hours increase effective hourly labor cost on a $30.00/hr base wage:',
    tableColumns: ['Weekly Schedule (at $30/hr Base)', 'Gross Weekly Pay', 'Effective Blended Hourly Cost'],
    tableRows: [
      ['40h Regular + 0h Overtime', '$1,200.00', '$30.00 / hr (0% premium)'],
      ['40h Regular + 5h Overtime (1.5x)', '$1,425.00', '$31.67 / hr (+5.6% blended labor cost)'],
      ['40h Regular + 10h Overtime (1.5x)', '$1,650.00', '$33.00 / hr (+10.0% blended labor cost)'],
      ['40h Regular + 10h (1.5x) + 6h (2.0x)', '$2,010.00', '$35.89 / hr (+19.6% blended labor cost)'],
    ],
    fieldNotesTitle: 'Labor Costing & Compliance Notes',
    fieldNotes: [
      {
        label: 'No "Comp Time" Swap for Private-Sector Non-Exempt Workers',
        note: 'In the US private sector, non-exempt employees who work 45 hours in Week 1 cannot legally be given 5 hours off in Week 2 instead of paying `1.5x` overtime for Week 1—each 7-day workweek stands alone.',
      },
      {
        label: 'When Overtime Is Cheaper Than Hiring',
        note: 'Because employer healthcare premiums and onboarding costs are fixed per headcount, paying up to 10%–12% in `1.5x` overtime during seasonal peaks often costs less than hiring temporary staff.',
      },
    ],
  },

  'time-converter': {
    slug: 'time-converter',
    archetype: 'formula-ledger',
    kicker: 'SI & CALENDAR TIME UNIT CONVERSION',
    leadHeading: 'Converting Between Milliseconds, Seconds, Hours, Days, and Years in One Step',
    leadParagraphs: [
      'Time is one of the few measurement systems that mixes metric decimal prefixes at the bottom (`1,000 milliseconds = 1 second`) with ancient Babylonian base-60 ratios in the middle (`60 seconds = 1 minute`, `60 minutes = 1 hour`) and astronomical cycles at the top (`24 hours = 1 day`, `365.2425 days = 1 mean Gregorian year`).',
      'This all-in-one Time Unit Converter normalizes any value through a high-precision seconds pivot so developers, physicists, and operations planners can compare every unit from milliseconds to years simultaneously.',
    ],
    executionHeading: 'How to Convert Across Time Scales',
    executionSteps: [
      {
        title: 'Enter Your Numerical Value and Source Unit',
        detail: 'Type any whole or decimal number (e.g., `86400` seconds or `1.5` weeks) and select the starting unit.',
      },
      {
        title: 'Read All 7 Converted Time Units Simultaneously',
        detail: 'Compare the exact equivalent in milliseconds, seconds, minutes, hours, days, weeks, and 365-day standard years.',
      },
      {
        title: 'Copy Exact Constants for Code or SLA Contracts',
        detail: 'Use the integer outputs directly in `Cache-Control: max-age`, JWT expiration claims, or `setTimeout` millisecond parameters.',
      },
    ],
    workedLedger: {
      formulaTitle: 'Seconds-Pivot Conversion Constants',
      formulaExpression: '1 min = 60s · 1 hr = 3,600s · 1 day = 86,400s · 1 wk = 604,800s · 1 yr (365d) = 31,536,000s',
      scenarioName: 'Converting a 14-Day JWT Refresh Token TTL into Seconds and Milliseconds',
      inputs: [
        { label: 'Source Duration', value: '14 Days (2 Weeks)' },
        { label: 'Seconds per Day Constant', value: '86,400 Seconds (24 × 60 × 60)' },
        { label: 'Milliseconds per Second', value: '1,000 ms' },
      ],
      mathSteps: [
        'Step 1 (Days to Hours): 14 days × 24 hours/day = 336 hours',
        'Step 2 (Hours to Minutes): 336 hours × 60 minutes/hour = 20,160 minutes',
        'Step 3 (Minutes to Seconds): 20,160 minutes × 60 seconds/minute = 1,209,600 seconds',
        'Step 4 (Seconds to Milliseconds): 1,209,600 × 1,000 = 1,209,600,000 ms',
      ],
      finalOutput: '1,209,600 Seconds (JWT exp / HTTP max-age) · 1,209,600,000 ms (JS setTimeout)',
      auditWarning: 'JavaScript’s 32-bit signed integer limit for `setTimeout` is `2,147,483,647 ms` (~24.85 days). Passing a 30-day millisecond value (`2,592,000,000 ms`) overflows and fires immediately!',
    },
    tableSectionTitle: 'Essential Developer & Engineering Time Constants',
    tableSectionIntro: 'Exact second and millisecond constants used in HTTP headers, cron jobs, and system architecture:',
    tableColumns: ['Human Duration', 'Exact Seconds (`max-age` / Unix)', 'Exact Milliseconds (JS Timers)'],
    tableRows: [
      ['1 Hour (60 mins)', '3,600 seconds', '3,600,000 ms'],
      ['1 Day (24 hours)', '86,400 seconds', '86,400,000 ms'],
      ['7 Days (1 Week)', '604,800 seconds', '604,800,000 ms'],
      ['30 Days / 365 Days', '2,592,000 s / 31,536,000 s', '2,592,000,000 ms / 31,536,000,000 ms'],
    ],
    fieldNotesTitle: 'Engineering & Scientific Conversion Notes',
    fieldNotes: [
      {
        label: '365-Day Calendar Year vs. 365.2425-Day Mean Gregorian Year',
        note: 'Standard financial and software conventions define `1 year = 365 days = 31,536,000 seconds`. In astronomy and long-term orbital mechanics, the Julian year (`365.25 days = 31,557,600 s`) or Gregorian mean year (`365.2425 days`) is used.',
      },
      {
        label: 'Monthly Downtime Budgets (`Five Nines` vs. `Three Nines`)',
        note: 'In a 30-day month (`43,200 minutes`), `99.9%` uptime allows `43.2 minutes` of downtime, while `99.999%` ("five nines") allows only `25.9 seconds`.',
      },
    ],
  },

  'minutes-to-hours': {
    slug: 'minutes-to-hours',
    archetype: 'formula-ledger',
    kicker: 'MINUTES TO HOURS & DECIMAL CONVERTER',
    leadHeading: 'Turning Raw Minute Totals Into Both Clock Hours (HH:MM) and Payroll Decimals',
    leadParagraphs: [
      'When a movie runtime says `148 minutes`, a workout app logs `215 minutes` for the week, or a call-center report exports `495 minutes` of talk time, your brain wants two different answers depending on the context: "how many hours and minutes is that on a clock?" and "what decimal number do I multiply by an hourly rate?"',
      'Dividing `145 minutes` by `60` on a phone calculator gives `2.4166667`—which leaves people guessing how many actual minutes `.4166667` represents. This converter runs integer quotient/remainder math (`2 hours 25 minutes`) and decimal division (`2.42 hours`) together.',
    ],
    executionHeading: 'How to Convert Minutes Without Rounding Mistakes',
    executionSteps: [
      {
        title: 'Type Your Total Minutes (Whole or Decimal)',
        detail: 'Enter any minute count—from a `45-minute` class period to `2,400 minutes` of monthly client retainer work.',
      },
      {
        title: 'Read the Clock Format (Hours + Remainder Minutes) for Scheduling',
        detail: 'Use the `X hours Y minutes` result when blocking calendar time or reading movie/flight runtimes.',
      },
      {
        title: 'Read the Decimal Hours Value for Billing and Spreadsheets',
        detail: 'Use the `X.XX hours` decimal result when multiplying by an hourly pay rate or billing rate.',
      },
    ],
    workedLedger: {
      formulaTitle: 'Dual Quotient-Remainder & Decimal Formula',
      formulaExpression: 'Whole Hours = ⌊Minutes ÷ 60⌋ · Remainder Mins = Minutes mod 60 · Decimal = Minutes ÷ 60',
      scenarioName: 'Converting 195 Minutes of Consulting Work for a Client Invoice',
      inputs: [
        { label: 'Total Logged Minutes', value: '195 Minutes' },
        { label: 'Hourly Billing Rate', value: '$120.00 / hr' },
      ],
      mathSteps: [
        'Step 1 (Find Whole Hours): ⌊195 ÷ 60⌋ = 3 whole hours (3 × 60 = 180 minutes)',
        'Step 2 (Find Remainder Minutes): 195 − 180 = 15 minutes → 3 hours 15 minutes on a clock',
        'Step 3 (Compute Decimal Hours): 195 ÷ 60 = 3.25 decimal hours',
        'Step 4 (Calculate Invoice Amount): 3.25 hours × $120.00/hr = $390.00',
      ],
      finalOutput: '3 Hours 15 Minutes (Clock) · 3.25 Hours (Decimal) · $390.00 Billable',
      auditWarning: 'Never write "3 hours 15 minutes" as `3.15` in an invoice formula—`3.15 × $120` bills `$378.00` instead of `$390.00`, losing $12.00 per entry.',
    },
    tableSectionTitle: 'Popular Minute-to-Hour Conversion Lookup Table',
    tableSectionIntro: 'Instant reference for common movie runtimes, study blocks, and work shifts:',
    tableColumns: ['Total Minutes', 'Hours & Minutes (HH:MM)', 'Decimal Hours (`Mins ÷ 60`)'],
    tableRows: [
      ['75 / 90 / 105 mins', '1h 15m · 1h 30m · 1h 45m', '1.25 · 1.50 · 1.75 hrs'],
      ['120 / 135 / 150 mins', '2h 00m · 2h 15m · 2h 30m', '2.00 · 2.25 · 2.50 hrs'],
      ['180 / 210 / 240 mins', '3h 00m · 3h 30m · 4h 00m', '3.00 · 3.50 · 4.00 hrs'],
      ['300 / 450 / 480 mins', '5h 00m · 7h 30m · 8h 00m', '5.00 · 7.50 · 8.00 hrs'],
    ],
    fieldNotesTitle: 'Practitioner Conversion Tips',
    fieldNotes: [
      {
        label: 'The 6-Minute Tenth-Hour Shortcut',
        note: 'Because `60 ÷ 10 = 6`, every 6 minutes equals exactly `0.1 hours` (`6m = 0.1h`, `12m = 0.2h`, `18m = 0.3h`, `24m = 0.4h`, `36m = 0.6h`, `42m = 0.7h`, `48m = 0.8h`, `54m = 0.9h`).',
      },
      {
        label: 'Feature Film Runtime Mental Math',
        note: 'Anchor on `120m = 2 hours` and `180m = 3 hours`. A `162-minute` film is simply `2 hours + (162 − 120) = 2 hours 42 minutes`.',
      },
    ],
  },

  'hours-to-minutes': {
    slug: 'hours-to-minutes',
    archetype: 'formula-ledger',
    kicker: 'DECIMAL HOURS TO MINUTES & SECONDS',
    leadHeading: 'Converting Decimal Hours (Like 2.75 Hrs) Back Into Exact Clock Minutes',
    leadParagraphs: [
      'Payroll software, ERP task trackers, and aviation Hobbs meters report durations in decimal hours—like `1.75 hours`, `3.4 hours`, or `7.65 hours`. When you need to enter that duration into a countdown timer or calendar block, you have to convert the decimal fraction back into base-60 minutes and seconds.',
      'This Hours to Minutes Converter accepts both decimal hours (`2.75`) and split hours/minutes (`2h 45m`), multiplying by 60 to give you exact total minutes (`165 mins`), total seconds (`9,900 secs`), and standard `HH:MM:SS` notation.',
    ],
    executionHeading: 'How to Convert Decimal or Split Hours Into Minutes',
    executionSteps: [
      {
        title: 'Enter Decimal Hours (e.g., 2.75) or Whole Hours',
        detail: 'Type any decimal hour figure from a timesheet or project estimate directly into the Hours input.',
      },
      {
        title: 'Add Any Extra Remainder Minutes If Using Split Format',
        detail: 'If your source says `2 hours 20 minutes`, enter `2` in Hours and `20` in Additional Minutes.',
      },
      {
        title: 'Read Total Minutes and HH:MM Breakdown',
        detail: 'Use the Total Minutes result for timer presets, workout logs, or minute-based SLA budgets.',
      },
    ],
    workedLedger: {
      formulaTitle: 'Decimal Hours to Base-60 Minutes Formula',
      formulaExpression: 'Total Minutes = Decimal Hours × 60 · Clock Mins = (Decimal Hours − ⌊Hours⌋) × 60',
      scenarioName: 'Converting an ERP Task Estimate of 3.65 Hours into Minutes and Clock Time',
      inputs: [
        { label: 'ERP Decimal Estimate', value: '3.65 Hours' },
        { label: 'Minutes per Hour', value: '60 Minutes' },
      ],
      mathSteps: [
        'Step 1 (Total Minutes): 3.65 × 60 = 219.0 total minutes',
        'Step 2 (Separate Whole Hours): ⌊3.65⌋ = 3 whole hours (180 minutes)',
        'Step 3 (Convert Fractional Part): 0.65 × 60 = 39 minutes',
        'Step 4 (Total Seconds): 219 minutes × 60 = 13,140 seconds',
      ],
      finalOutput: '219 Total Minutes · 3 Hours 39 Minutes (03:39:00)',
      auditWarning: '`3.65 hours` is 3 hours 39 minutes—NOT 3 hours 65 minutes (which would be 4 hours 5 minutes). Always multiply the decimal portion by 60.',
    },
    tableSectionTitle: 'Decimal Hours to Minutes Reference Chart',
    tableSectionIntro: 'Quick lookup for converting payroll and project-management decimal hours:',
    tableColumns: ['Decimal Hours', 'Total Minutes (`Hours × 60`)', 'Clock Equivalent (HH:MM)'],
    tableRows: [
      ['0.25 / 0.50 / 0.75 hrs', '15 / 30 / 45 minutes', '0h 15m · 0h 30m · 0h 45m'],
      ['1.25 / 1.50 / 1.75 hrs', '75 / 90 / 105 minutes', '1h 15m · 1h 30m · 1h 45m'],
      ['2.50 / 4.00 / 6.50 hrs', '150 / 240 / 390 minutes', '2h 30m · 4h 00m · 6h 30m'],
      ['7.50 / 8.00 / 12.00 hrs', '450 / 480 / 720 minutes', '7h 30m · 8h 00m · 12h 00m'],
    ],
    fieldNotesTitle: 'Scheduling & Time-Budgeting Notes',
    fieldNotes: [
      {
        label: 'Why Workday & Dayforce Export Decimal Hours',
        note: 'Enterprise HR systems store all shifts as floating-point decimal hours so SQL `SUM()` queries can total 10,000 employee rows without base-60 overflow logic.',
      },
      {
        label: 'Converting Repeating Thirds (`0.33` and `0.67` Hours)',
        note: 'In 2-decimal payroll exports, `0.33 hours` represents `20 minutes` (`1/3 hr`) and `0.67 hours` represents `40 minutes` (`2/3 hr`).',
      },
    ],
  },

  'seconds-to-minutes': {
    slug: 'seconds-to-minutes',
    archetype: 'formula-ledger',
    kicker: 'SECONDS TO MM:SS & HH:MM:SS CONVERTER',
    leadHeading: 'Translating Raw Second Counts Into Readable Minutes and Seconds',
    leadParagraphs: [
      'APIs, video encoders (`FFmpeg`), database query profilers, and HIIT workout specs routinely output raw second counts like `150 seconds`, `540 seconds`, or `4,320 seconds`. Reading raw seconds past 90 forces you to divide by 60 and mentally reconstruct the remainder.',
      'This Seconds to Minutes Converter turns any second value—including sub-second decimal milliseconds like `92.45s`—into clean `MM:SS`, `HH:MM:SS`, and decimal minute formats simultaneously.',
    ],
    executionHeading: 'How to Convert Seconds to Clock & Decimal Formats',
    executionSteps: [
      {
        title: 'Enter Your Raw Seconds (Integer or Decimal)',
        detail: 'Type any second count—such as `90` for a gym rest timer, `1,500` for a Pomodoro block, or `3,725.5` from a server log.',
      },
      {
        title: 'Read the MM:SS / HH:MM:SS Clock String',
        detail: 'Use the colon-formatted clock string (`02:30` or `01:02:05`) for video players, pace charts, and timer inputs.',
      },
      {
        title: 'Read the Decimal Minutes Output for Rate Calculations',
        detail: 'Use the decimal minutes value (`2.50 mins`) when computing words-per-minute (WPM) or cadence rates.',
      },
    ],
    workedLedger: {
      formulaTitle: 'Seconds to H:M:S & Decimal Minutes Formula',
      formulaExpression: 'Hours = ⌊S ÷ 3600⌋ · Mins = ⌊(S mod 3600) ÷ 60⌋ · Rem Secs = S mod 60',
      scenarioName: 'Converting an FFmpeg Video Duration of 4,050 Seconds',
      inputs: [
        { label: 'Raw Video Stream Seconds', value: '4,050 Seconds' },
        { label: 'Seconds per Hour / Minute', value: '3,600 s/hr · 60 s/min' },
      ],
      mathSteps: [
        'Step 1 (Extract Whole Hours): ⌊4,050 ÷ 3,600⌋ = 1 hour (4,050 − 3,600 = 450 seconds left)',
        'Step 2 (Extract Whole Minutes): ⌊450 ÷ 60⌋ = 7 minutes (7 × 60 = 420 seconds)',
        'Step 3 (Extract Remainder Seconds): 450 − 420 = 30 seconds → 01:07:30',
        'Step 4 (Compute Decimal Minutes): 4,050 ÷ 60 = 67.50 minutes',
      ],
      finalOutput: '67 Minutes 30 Seconds (01:07:30) · 67.50 Decimal Minutes',
      auditWarning: 'When calculating speech words-per-minute (WPM) over a 90-second clip, divide word count by `1.5` (decimal minutes), never `1.3` (`1m 30s`).',
    },
    tableSectionTitle: 'Common Second-to-Minute Benchmarks',
    tableSectionIntro: 'Fast lookup for fitness intervals, cooking presets, and software timeouts:',
    tableColumns: ['Raw Seconds', 'Clock Format (MM:SS / HH:MM:SS)', 'Decimal Minutes & Common Use'],
    tableRows: [
      ['45 / 75 / 90 seconds', '00:45 · 01:15 · 01:30', '0.75m / 1.25m / 1.50m (HIIT & weightlifting rest sets)'],
      ['150 / 180 / 300 seconds', '02:30 · 03:00 · 05:00', '2.50m / 3.00m / 5.00m (Boxing rounds & tea steeping)'],
      ['600 / 900 / 1,500 seconds', '10:00 · 15:00 · 25:00', '10.0m / 15.0m / 25.0m (Lightning talks & Pomodoro blocks)'],
      ['1,800 / 3,600 / 86,400 seconds', '30:00 · 01:00:00 · 24:00:00', '30.0m / 60.0m / 1,440m (API cache & token TTLs)'],
    ],
    fieldNotesTitle: 'Audio, Video & Athletics Notes',
    fieldNotes: [
      {
        label: 'Track & Field 400m / 800m Split Conversion',
        note: 'Middle-distance coaches routinely call 800m targets in seconds (`112 seconds`). Dividing `112 ÷ 60` gives `1 minute 52 seconds` (`1:52.0`).',
      },
      {
        label: 'HTTP `Retry-After` and `Cache-Control` Headers',
        note: 'HTTP headers specify delays in integer seconds (`max-age=900` = 15 minutes; `max-age=3600` = 1 hour).',
      },
    ],
  },

  'what-time-will-it-be': {
    slug: 'what-time-will-it-be',
    archetype: 'formula-ledger',
    kicker: 'FUTURE & PAST CLOCK PROJECTION LEDGER',
    leadHeading: 'Finding the Exact Clock Time X Hours and Y Minutes From Right Now',
    leadParagraphs: [
      'When a brisket recipe says "smoke for 9 hours and 45 minutes," a lab assay needs to incubate for "16 hours," or a flight departs in "5 hours and 20 minutes," counting forward around a 12-hour AM/PM clock face is surprisingly error-prone.',
      'This future/past clock calculator anchors either to your live system clock or any custom start time you enter, projecting the exact target timestamp, AM/PM rollover, and calendar day offset (`Today`, `Tomorrow`, or `+N Days`).',
    ],
    executionHeading: 'How to Project a Future or Past Clock Time',
    executionSteps: [
      {
        title: 'Choose "From Live Current Time" or Enter a Custom Start Time',
        detail: 'Let the tool track your live clock automatically, or lock a specific departure/oven-in timestamp.',
      },
      {
        title: 'Select Add (+ In the Future) or Subtract (− In the Past)',
        detail: 'Use Add to see when a task finishes, or Subtract to work backward from a deadline (e.g., "what time must I put the turkey in the oven to eat at 5:30 PM?").',
      },
      {
        title: 'Enter Hours, Minutes, and Seconds to Project',
        detail: 'Read the exact target clock time in both 12-hour AM/PM and 24-hour military formats alongside the calendar date.',
      },
    ],
    workedLedger: {
      formulaTitle: 'Modulo-24 Clock Projection & Day-Rollover Formula',
      formulaExpression: 'Target Timestamp = Base Epoch ± (Hours × 3,600,000 + Mins × 60,000 + Secs × 1,000)',
      scenarioName: 'Working Backward for a 5:30 PM Holiday Dinner (4h 15m Roast + 45m Rest)',
      inputs: [
        { label: 'Target Serving Time', value: '05:30 PM (17:30)' },
        { label: 'Roasting + Resting Time', value: '4h 15m + 0h 45m = 5 hours 00 minutes total' },
        { label: 'Pre-Heat & Prep Buffer', value: '35 Minutes' },
      ],
      mathSteps: [
        'Step 1 (Sum Total Lead Time): 4h 15m + 45m + 35m = 5 hours 35 minutes',
        'Step 2 (Subtract 5 Hours from 17:30): 17:30 − 05:00 = 12:30 PM',
        'Step 3 (Subtract 35 Minutes from 12:30 PM): 12:30 − 00:35 = 11:55 AM (Crosses Noon to AM)',
      ],
      finalOutput: 'Start Prep at 11:55 AM · Into Oven at 12:30 PM · Out to Rest at 04:45 PM',
      auditWarning: 'Remember that 12:00 PM is Noon and 12:00 AM is Midnight—crossing 12:00 always flips the AM/PM indicator.',
    },
    tableSectionTitle: 'Anchor-12 & Anchor-24 Mental Math Shortcuts',
    tableSectionIntro: 'How to estimate future clock times in your head and verify them against the calculator:',
    tableColumns: ['Offset Added', 'Mental Math Shortcut', 'Example From 02:40 PM'],
    tableRows: [
      ['+ 4 to 8 Hours', 'Add to 24-hour hour (`14:40 + 6h = 20:40`), then subtract 12 (`8:40 PM`)', '02:40 PM + 6h = 08:40 PM Today'],
      ['+ 12 Hours', 'Keep the exact same digits and flip AM ↔ PM', '02:40 PM + 12h = 02:40 AM Tomorrow'],
      ['+ 16 Hours', 'Add 1 day (`+24h`) and subtract 8 hours', '02:40 PM + 16h = 06:40 AM Tomorrow'],
      ['+ 36 Hours', 'Add 1 full day (`+24h`) plus 12 hours (flip AM ↔ PM)', '02:40 PM + 36h = 02:40 AM (+2 Days)'],
    ],
    fieldNotesTitle: 'Kitchen, Medication & Travel Planning Notes',
    fieldNotes: [
      {
        label: 'Every-8-Hour Medication Dosing Schedules',
        note: 'Because `24 ÷ 3 = 8`, an every-8-hour schedule repeats at the exact same three clock marks every day (e.g., `07:00 AM`, `03:00 PM`, and `11:00 PM`).',
      },
      {
        label: 'Airport Arrival Backward Planning',
        note: 'For international flights, subtract 3 hours for airport check-in plus your peak-traffic drive time plus a 20-minute parking shuttle buffer from the scheduled boarding time (not departure time).',
      },
    ],
  },

  // ============================================================================
  // ARCHETYPE 4: COACH'S INTERVAL & PACE BRIEF (Core, Fitness & Focus Timers)
  // ============================================================================
  'countdown-timer': {
    slug: 'countdown-timer',
    archetype: 'coach-brief',
    kicker: 'DRIFT-FREE DIGITAL COUNTDOWN BRIEF',
    leadHeading: 'Why Browser Tab Throttling Breaks Ordinary Web Timers—and How Epoch Delta Math Fixes It',
    leadParagraphs: [
      'If you start a poorly coded web timer for 20 minutes and switch to another browser tab to write a document, modern browsers throttle background `setInterval` callbacks down to once per minute to save battery. On naive timers that simply subtract `1` on each tick, your 20-minute countdown can drift by 8 to 12 minutes.',
      'This Countdown Timer anchors your target finish time to the system epoch (`targetTimestamp = Date.now() + durationMs`). Even if your browser tab sleeps in the background for 15 minutes, the exact millisecond remaining is recalculated the instant the tab wakes or the audio engine checks the clock.',
    ],
    executionHeading: 'Setting Up a Zero-Drift Countdown Session',
    executionSteps: [
      {
        title: 'Pick a One-Tap Preset or Enter Exact Hours, Minutes, and Seconds',
        detail: 'Select a quick chip (1m to 60m) or type any custom `HH:MM:SS` duration up to 99 hours.',
      },
      {
        title: 'Choose Your Completion Behavior (Single Chime vs. Auto-Loop)',
        detail: 'Enable Loop Mode if you want the timer to automatically restart at `00:00` for recurring ergonomic stretch breaks or station rotations.',
      },
      {
        title: 'Press "F" for Fullscreen Projection Across a Room or Gym',
        detail: 'Expand the high-contrast tabular numerals across your entire monitor so everyone in the room can read the clock from 40 feet away.',
      },
    ],
    coachPhases: {
      blueprintTitle: 'Anatomy of a Well-Paced Timed Block',
      phases: [
        { phase: '1. Setup & Lock-In', window: 'First 10% of Duration', sharePercent: 10, cue: 'Close unrelated tabs, confirm audio volume, and define the single outcome for this block.' },
        { phase: '2. Uninterrupted Execution', window: 'Middle 75% of Duration', sharePercent: 75, cue: 'Work or hold pace without resetting the clock; let the browser tab Title Bar track time quietly.' },
        { phase: '3. Wrap & Buffer', window: 'Final 15% of Duration', sharePercent: 15, cue: 'Summarize progress, save work, or prepare for station transition before the 00:00 chime.' },
      ],
      pacingMistakesTitle: 'Three Mistakes That Undermine Timed Sessions',
      pacingMistakes: [
        'Setting a vague 60-minute timer for a task that actually consists of three 15-minute sub-steps—shorter checkpoints prevent mid-block drift.',
        'Forgetting to test system speaker volume before stepping away from your laptop in the kitchen.',
        'Closing the browser tab completely instead of leaving it pinned in the background.',
      ],
    },
    tableSectionTitle: 'Recommended Countdown Presets by Real-World Task',
    tableSectionIntro: 'Match your activity to the right countdown window and alert mode:',
    tableColumns: ['Task Category', 'Optimal Countdown Window', 'Recommended Timer Settings'],
    tableRows: [
      ['Espresso Extraction / Plank Hold', '00:25 – 01:00', 'Sound On · Keep screen awake in active view'],
      ['Classroom Station Rotation', '08:00 – 12:00', 'Fullscreen Mode (`F`) · Loop Mode enabled for 4 rotations'],
      ['Deep Coding / Writing Sprint', '25:00 – 45:00', 'Pin browser tab · Soft chime at 00:00'],
      ['Written Practice Exam', '60:00 – 180:00', 'Fullscreen desktop view · Silent final-5-minute visual check'],
    ],
    fieldNotesTitle: 'Practitioner Timing Field Notes',
    fieldNotes: [
      {
        label: 'Keyboard-First Operation (`Space`, `R`, `F`)',
        note: 'When your hands are covered in flour in the kitchen or holding a whiteboard marker in class, tap the `Spacebar` to start/pause, `R` to reset, and `F` to toggle fullscreen without aiming a mouse cursor.',
      },
      {
        label: 'Live Browser Tab Title Countdown',
        note: 'You don’t need to keep the timer window visible on a single-screen laptop—the remaining `MM:SS` updates live inside the browser tab title while you work in Google Docs or VS Code.',
      },
    ],
  },

  'stopwatch': {
    slug: 'stopwatch',
    archetype: 'coach-brief',
    kicker: 'HIGH-RESOLUTION LAP & SPLIT CHRONOGRAPH',
    leadHeading: 'Reading Individual Lap Time vs. Cumulative Split Time Like a Track Coach',
    leadParagraphs: [
      'People often use the words "lap" and "split" interchangeably, but in athletics, motorsport, and industrial time-motion studies they measure two different things: a **Lap Time** is the isolated duration of that single round (`01:14.22` for Lap 3 alone), while a **Split Time** is the cumulative elapsed time from the starting gun (`03:42.85` at the end of Lap 3).',
      'This Online Stopwatch uses your browser’s monotonic `performance.now()` clock to record both individual lap times and cumulative splits side by side, automatically flagging your fastest (green) and slowest (red) laps.',
    ],
    executionHeading: 'How to Time Laps and Export Trial Data',
    executionSteps: [
      {
        title: 'Trigger Start with the Spacebar or Primary Button',
        detail: 'Use the `Spacebar` so your eyes stay on the runner, swimmer, or process step rather than looking down at the screen.',
      },
      {
        title: 'Tap "L" at Every Checkpoint to Log Both Lap and Split',
        detail: 'Each press of `L` (or the Lap button) appends a timestamped row without interrupting the running clock.',
      },
      {
        title: 'Compare Fastest/Slowest Delta and Export to CSV',
        detail: 'Download the full lap table as a `.csv` spreadsheet for coaching logs, lab notebooks, or QA regression benchmarks.',
      },
    ],
    coachPhases: {
      blueprintTitle: 'How to Analyze a 4-Lap Pacing Trial',
      phases: [
        { phase: 'Lap 1 (Opening Pace)', window: '0% – 25% Distance', sharePercent: 25, cue: 'Watch for going out 3–4 seconds too fast on fresh legs—the #1 cause of late-race fade.' },
        { phase: 'Laps 2–3 (Settled Rhythm)', window: '25% – 75% Distance', sharePercent: 50, cue: 'Target <1.5 seconds variance between Lap 2 and Lap 3 for aerobic efficiency.' },
        { phase: 'Lap 4 (Negative Split Kick)', window: '75% – 100% Distance', sharePercent: 25, cue: 'Aim for Lap 4 to match or beat Lap 1 (a negative split).' },
      ],
      pacingMistakesTitle: 'Common Stopwatch & Time-Study Errors',
      pacingMistakes: [
        'Hitting Reset instead of Lap at an intermediate checkpoint—use keyboard shortcuts (`Space` = Start/Stop, `L` = Lap) to prevent misclicks.',
        'Looking down at the screen before the subject crosses the line, introducing a 0.25-second visual reaction delay.',
        'Confusing cumulative split time with isolated lap duration when calculating average cycle time.',
      ],
    },
    tableSectionTitle: 'Lap Time vs. Cumulative Split Example (1600m Track Trial)',
    tableSectionIntro: 'How the stopwatch table structures a 4-lap 1600-meter run:',
    tableColumns: ['Lap #', 'Isolated Lap Time (Segment)', 'Cumulative Split & Pacing Note'],
    tableRows: [
      ['Lap 1 (400m)', '01:16.40', '01:16.40 Split · Controlled opening pace'],
      ['Lap 2 (800m)', '01:18.10 (Slowest)', '02:34.50 Split · Slight mid-race settle (+1.70s)'],
      ['Lap 3 (1200m)', '01:17.20', '03:51.70 Split · Re-engaged cadence on lap 3'],
      ['Lap 4 (1600m)', '01:13.80 (Fastest)', '05:05.50 Final · Strong −2.60s finishing kick'],
    ],
    fieldNotesTitle: 'Track & Industrial Time-Study Notes',
    fieldNotes: [
      {
        label: 'Human Finger Reaction Latency (~150–200ms)',
        note: 'While `performance.now()` measures time to sub-millisecond accuracy, human thumb/finger reaction to a visual finish line has a natural variance of 0.15 to 0.20 seconds.',
      },
      {
        label: 'Industrial Cycle-Time Auditing',
        note: 'When timing warehouse pick-pack cycles or software build steps, discard the outlier slowest lap if an external interruption occurred, and average the remaining clean laps.',
      },
    ],
  },

  'multi-stopwatch': {
    slug: 'multi-stopwatch',
    archetype: 'coach-brief',
    kicker: 'PARALLEL LANE & MULTI-TRACK CHRONOGRAPH',
    leadHeading: 'Timing Staggered Starts and Parallel Lanes Without Juggling Four Phones',
    leadParagraphs: [
      'In a swim practice where swimmers leave the wall 5 seconds apart, a science lab where six titration beakers react on different schedules, or a kitchen where four pans hit the stove at staggered times, a single stopwatch is useless.',
      'This Multi-Stopwatch lets you label and run independent chronographs side by side—either launching every lane simultaneously with **Start All** for a mass-start heat, or triggering each lane individually as staggered trials begin.',
    ],
    executionHeading: 'How to Run Parallel or Staggered Trials',
    executionSteps: [
      {
        title: 'Name Each Lane Before the Heat or Experiment Starts',
        detail: 'Rename Timer 1, Timer 2, Timer 3, and Timer 4 with athlete names, lane numbers, or sample IDs so you never forget which clock belongs to which subject.',
      },
      {
        title: 'Use "Start All" for Mass Starts or Individual Play Buttons for Staggered Starts',
        detail: 'Click Start All when a whole heat leaves on the same gun, or click each card’s Start button as staggered runners cross the starting mat.',
      },
      {
        title: 'Record Independent Laps Inside Each Lane Card',
        detail: 'Click Lap on any individual card to log that specific athlete’s split without affecting the other running lanes.',
      },
    ],
    coachPhases: {
      blueprintTitle: 'Managing a 4-Lane Staggered Interval Set',
      phases: [
        { phase: 'Pre-Heat Labeling', window: 'Before Whistle', sharePercent: 20, cue: 'Order the cards on screen in the exact physical left-to-right order of the lanes or lab stations.' },
        { phase: 'Staggered Launch', window: '+0s / +5s / +10s / +15s', sharePercent: 40, cue: 'Trigger Lane 1 at 0:00, Lane 2 when Lane 1 reads 0:05, and so on.' },
        { phase: 'Finish Capture', window: 'As Each Athlete Touches', sharePercent: 40, cue: 'Stop each card independently as that lane finishes; compare net elapsed times.' },
      ],
      pacingMistakesTitle: 'Mistakes to Avoid in Multi-Lane Timing',
      pacingMistakes: [
        'Leaving cards labeled "Timer 1 / Timer 2" during a 6-person trial and forgetting who was assigned to Timer 3.',
        'Scrambling physical lane order vs. screen card order—always arrange cards left-to-right to match the room or pool.',
      ],
    },
    tableSectionTitle: 'Mass Start vs. Staggered Start Workflow Comparison',
    tableSectionIntro: 'Choose the right multi-stopwatch control mode for your environment:',
    tableColumns: ['Scenario', 'Launch Method', 'How to Read & Compare Results'],
    tableRows: [
      ['4-Lane Track Heat / Swim Race', 'Click "Start All" on the starting whistle', 'Stop each card as the runner crosses; difference between cards = margin of victory'],
      ['Time-Trial Send-Offs (5s Stagger)', 'Start Card 1, then Card 2 five seconds later', 'Each card shows true net elapsed time—no mental subtraction needed at the finish'],
      ['4-Bench Chemistry / Baking Lab', 'Start each card as that sample enters heat', 'Monitor independent elapsed times and lap checkpoints per sample'],
      ['Multi-Client Support / Billing', 'Toggle active client card as phone calls switch', 'Sum exact billable minutes per client at the end of the afternoon'],
    ],
    fieldNotesTitle: 'Multi-Track Coaching Field Notes',
    fieldNotes: [
      {
        label: 'Why Independent Clocks Beat Single-Clock Split Math',
        note: 'When swimmers push off 5 seconds apart on a single wall clock, coaches have to subtract `5s`, `10s`, and `15s` in their head for every lap. Independent lane clocks display each swimmer’s true split immediately.',
      },
      {
        label: 'Persist State Across Tab Switches',
        note: 'Each running lane stores its own monotonic start timestamp, so all active lanes stay 100% synchronized even if you minimize the browser.',
      },
    ],
  },

  'lap-timer': {
    slug: 'lap-timer',
    archetype: 'coach-brief',
    kicker: 'CONSISTENCY & DELTA SPLIT ANALYZER',
    leadHeading: 'Measuring Lap-to-Lap Variance and Target Pace Consistency',
    leadParagraphs: [
      'Winning an endurance race or optimizing an assembly line isn’t about throwing down one blistering fast lap followed by a 15-second collapse—it is about narrowing the spread (delta) between your fastest and slowest cycles.',
      'This dedicated Lap Timer emphasizes split-by-split comparison, computing your rolling average lap time and highlighting positive/negative deltas so you can spot fatigue or process bottlenecks immediately.',
    ],
    executionHeading: 'How to Run a Consistency & Pace Audit',
    executionSteps: [
      {
        title: 'Start the Clock and Hit Lap at Every Fixed Marker',
        detail: 'Press the `L` key or tap the oversized Lap button each time the athlete passes the 400m line or the operator finishes a unit.',
      },
      {
        title: 'Monitor the Rolling Average and Fastest/Slowest Spread',
        detail: 'Compare the most recent lap against your rolling mean to see whether pace is drifting upward.',
      },
      {
        title: 'Export the Split Ledger for Post-Session Analysis',
        detail: 'Save the CSV table to chart lap degradation curves in Excel or Google Sheets.',
      },
    ],
    coachPhases: {
      blueprintTitle: 'Evaluating Pace Variance Across a 10-Rep Set',
      phases: [
        { phase: 'Reps 1–2 (Calibration)', window: 'Initial Rhythm', sharePercent: 20, cue: 'Establish target split; avoid overshooting target pace by more than 2%.' },
        { phase: 'Reps 3–8 (Metabolic Steady State)', window: 'Core Work', sharePercent: 60, cue: 'Keep lap-to-lap variance within ±1.0 second of the rolling average.' },
        { phase: 'Reps 9–10 (Fatigue Test)', window: 'Closing Effort', sharePercent: 20, cue: 'If Lap 9 drops >5% slower than average, aerobic threshold was exceeded early.' },
      ],
      pacingMistakesTitle: 'What Skewed Lap Data Usually Means',
      pacingMistakes: [
        'A >4-second drop between Lap 1 and Lap 2 almost always signals an adrenaline start rather than lack of fitness.',
        'Forgetting to log a missed lap at the line—which merges two laps into one double-length outlier and skews the average.',
      ],
    },
    tableSectionTitle: 'Pace Variance Benchmarks by Discipline',
    tableSectionIntro: 'Target lap-to-lap consistency spreads used by coaches and operations engineers:',
    tableColumns: ['Discipline', 'Target Lap Spread (Fastest vs. Slowest)', 'What Excess Variance Indicates'],
    tableRows: [
      ['1500m / Mile Track Pacing', '≤ 1.5 to 2.0 seconds per 400m lap', '>3s drop on Lap 3 indicates early lactate spike from going out too hard'],
      ['100m Swim Repeat Set', '≤ 1.0 second across 8 repeats', 'Rising splits mean rest interval is too short or stroke length is slipping'],
      ['Karting / Autocross Practice', '≤ 0.4 seconds across a 5-lap stint', 'High variance points to inconsistent braking points into slow corners'],
      ['Manual Packaging / QA Cycle', '≤ 8% variance from mean cycle time', 'Outlier spikes reveal tool-reach friction or defective part handling'],
    ],
    fieldNotesTitle: 'Split Analysis Field Notes',
    fieldNotes: [
      {
        label: 'Even Pacing vs. Negative Splitting',
        note: 'Nearly every distance world record from 1500m to the marathon has been set with even splits or a slight 1%–2% negative split (second half faster than first half).',
      },
      {
        label: 'Using the Spacebar & L Key Without Looking',
        note: 'Rest your index finger on `L` and thumb on `Space` so your eyes never leave the track or stopwatch subject.',
      },
    ],
  },

  'interval-timer': {
    slug: 'interval-timer',
    archetype: 'coach-brief',
    kicker: 'HIIT, TABATA & WORK/REST PROGRAMMER',
    leadHeading: 'Programming Work-to-Rest Ratios for Tabata, EMOM, and Study Circuits',
    leadParagraphs: [
      'A standard countdown timer forces you to stop, reset, and start a new timer between every work set and recovery break. During a 20-second Tabata sprint with a 10-second rest, fumbling with a phone screen eats half your recovery window.',
      'This programmable Interval Timer chains Warm-Up, High-Intensity Work, Recovery Rest, and Round Loops into one continuous automated sequence—firing distinct acoustic cues at each phase change and shifting the screen color so you know whether to push or breathe from across the gym.',
    ],
    executionHeading: 'How to Build Your Custom Interval Sequence',
    executionSteps: [
      {
        title: 'Choose a Classic Preset (Tabata 20/10, HIIT 40/20, EMOM 60/0) or Custom Ratios',
        detail: 'Set your exact Work seconds, Rest seconds, total Rounds, and an initial Get-Ready countdown.',
      },
      {
        title: 'Match Your Work-to-Rest Ratio to Your Energy System Goal',
        detail: 'Use `2:1` (e.g., 40s work / 20s rest) for metabolic conditioning, `1:1` (30s / 30s) for sustainable aerobic circuits, or `1:2` (20s / 40s) for max-power sprints.',
      },
      {
        title: 'Launch Fullscreen Mode and Follow the Color & Audio Cues',
        detail: 'High-contrast green signals active work, cool blue/amber signals recovery rest, and automated transition beeps let you train hands-free.',
      },
    ],
    coachPhases: {
      blueprintTitle: 'Energy System Work-to-Rest Programming Guide',
      phases: [
        { phase: '2:1 Ratio (Tabata / Glycolytic)', window: '20s Work / 10s Rest × 8', sharePercent: 67, cue: 'Incomplete recovery forces maximum VO2 demand; sustainable for 4-minute blocks.' },
        { phase: '1:1 Ratio (Aerobic Power)', window: '30s Work / 30s Rest × 10', sharePercent: 50, cue: 'Balanced recovery maintains high movement quality across 10 to 15 rounds.' },
        { phase: '1:2 Ratio (Phosphagen / Speed)', window: '15s Sprint / 30s Rest × 8', sharePercent: 33, cue: 'Longer rest replenishes ATP-PCr stores so every sprint stays explosive.' },
      ],
      pacingMistakesTitle: 'Common Interval Programming Mistakes',
      pacingMistakes: [
        'Calling a 20-minute circuit "Tabata"—true Izumi Tabata protocol is 8 rounds of 20s all-out / 10s rest (4 minutes total).',
        'Cutting rest intervals short during heavy kettlebell or barbell sets, which degrades form rather than improving conditioning.',
      ],
    },
    tableSectionTitle: 'Proven Interval Protocols for Fitness & Focus',
    tableSectionIntro: 'Configure these exact Work, Rest, and Round parameters in the timer:',
    tableColumns: ['Protocol Name', 'Work / Rest / Rounds', 'Total Time & Primary Benefit'],
    tableRows: [
      ['Classic Tabata Sprint', '20s Work · 10s Rest · 8 Rounds', '04:00 Total · Peak anaerobic & VO2 max stimulus'],
      ['40/20 Metabolic Circuit', '40s Work · 20s Rest · 10 Rounds', '10:00 Total · High-volume bodyweight & kettlebell conditioning'],
      ['EMOM (Every Minute on the Minute)', '45s Work · 15s Transition · 12 Rounds', '12:00 Total · Paced strength-endurance & CrossFit skill work'],
      ['50/10 Desk & Mobility Loop', '50m Work · 10m Walk/Stretch · 4 Rounds', '4 Hours Total · Sustainable deep work without lower-back stiffness'],
    ],
    fieldNotesTitle: 'Strength & Conditioning Coach Notes',
    fieldNotes: [
      {
        label: 'Always Include a 10-Second "Get Ready" Buffer',
        note: 'It takes 5 to 8 seconds to walk from your laptop or phone to your barbell or mat. A 10-second pre-start countdown ensures Round 1 starts with your hands already on the bar.',
      },
      {
        label: 'Physiotherapy Isometric Rehab Sets',
        note: 'For tendon loading (such as Spanish squats or calf isometrics), program `45s Work / 90s Rest × 5 Rounds` to give collagen fibers full recovery between holds.',
      },
    ],
  },

  'boxing-timer': {
    slug: 'boxing-timer',
    archetype: 'coach-brief',
    kicker: 'COMBAT SPORTS ROUND & CORNER CLOCK',
    leadHeading: 'Running Authentic 3-Minute Rounds, 1-Minute Corner Rests, and 10-Second Clapper Warnings',
    leadParagraphs: [
      'When you are wearing 16-ounce sparring gloves or holding focus mitts for a fighter, you cannot tap a touchscreen between rounds. You need an authentic gym bell that rings sharply at the start and end of every round, plus a distinct 10-second warning clapper ("seconds out") that tells you to empty the tank in the final flurry.',
      'This Boxing & MMA Round Timer comes pre-configured with Pro/Amateur Boxing (3m/1m), MMA (5m/1m), Amateur Youth/Novice (2m/1m), and Muay Thai presets—all running hands-free from Round 1 to the final bell.',
    ],
    executionHeading: 'How to Run a Heavy Bag or Sparring Session',
    executionSteps: [
      {
        title: 'Select Your Combat Discipline Preset before Wrapping Your Hands',
        detail: 'Pick 3:00 Boxing (4 to 12 rounds), 5:00 MMA (3 or 5 rounds), or 2:00 Novice/Kickboxing rounds with a 1:00 corner rest.',
      },
      {
        title: 'Enable the 10-Second Warning Clapper',
        detail: 'At `00:10` left in each work round, the clapper sounds—your cue to throw a non-stop 10-second burnout combination to the bell.',
      },
      {
        title: 'Listen for the Corner Warning Before the Next Bell',
        detail: 'During the 60-second rest, a 10-second warning alerts you to put your mouthpiece back in and raise your guard before the next round starts.',
      },
    ],
    coachPhases: {
      blueprintTitle: 'How to Pace a 3-Minute Heavy Bag Round',
      phases: [
        { phase: 'Minute 1 (Range & Jab)', window: '03:00 → 02:00', sharePercent: 33, cue: 'Establish distance, double the jab, and move your head off the centerline after every combination.' },
        { phase: 'Minute 2 (Inside & Body Work)', window: '02:00 → 01:00', sharePercent: 33, cue: 'Sit down on 3-to-4 punch combinations mixing hooks to the body and uppercuts.' },
        { phase: 'Minute 3 + 10s Burnout', window: '01:00 → 00:00', sharePercent: 34, cue: 'Keep hands high under fatigue; when the 00:10 clapper sounds, throw continuous straight punches to the bell.' },
      ],
      pacingMistakesTitle: 'Gym Mistakes That Ruin Round Training',
      pacingMistakes: [
        'Throwing 100% power haymakers for the first 45 seconds and dropping your hands for the remaining 2 minutes.',
        'Sitting or leaning on the ropes during the 1-minute rest without taking deep nasal recovery breaths.',
      ],
    },
    tableSectionTitle: 'Official Combat Sports Round & Rest Specifications',
    tableSectionIntro: 'Standard commission and gym timing rules across boxing, MMA, and kickboxing:',
    tableColumns: ['Discipline', 'Round Duration & Corner Rest', 'Standard Championship / Gym Distance'],
    tableRows: [
      ['Professional & Olympic Boxing', '3:00 Round · 1:00 Rest', '3 Rounds (Olympic) · 4–10 Rounds (Under-card) · 12 Rounds (Title)'],
      ['Mixed Martial Arts (UFC / Unified)', '5:00 Round · 1:00 Rest', '3 Rounds (Non-title / 15m) · 5 Rounds (Main Event & Title / 25m)'],
      ['Muay Thai & Kickboxing', '3:00 Round · 1:00–2:00 Rest', '3 to 5 Rounds · High kicking cadence and clinch transitions'],
      ['Novice / Fitness Heavy Bag Circuit', '2:00 Round · 0:30–1:00 Rest', '6 to 10 Rounds · High-output conditioning without form breakdown'],
    ],
    fieldNotesTitle: 'Corner & Conditioning Coach Notes',
    fieldNotes: [
      {
        label: 'Heart-Rate Recovery During the 60-Second Stool Period',
        note: 'Track how many beats per minute (BPM) your heart rate drops during the 60-second rest between Round 3 and Round 4. A drop of 25–35+ BPM is a strong benchmark of ring conditioning.',
      },
      {
        label: 'Bluetooth Gym Speaker Tip',
        note: 'Because Bluetooth speakers sometimes clip the first 50 milliseconds of audio when waking from idle, our Web Audio bell synthesis uses a resonant dual-strike decay that cuts cleanly through gym music.',
      },
    ],
  },

  'chess-clock': {
    slug: 'chess-clock',
    archetype: 'coach-brief',
    kicker: 'TWO-PLAYER FIDE INCREMENT & DELAY CLOCK',
    leadHeading: 'Playing Bullet, Blitz, and Rapid Chess with Fischer Increment and Bronstein Delay',
    leadParagraphs: [
      'A real chess clock is a zero-sum battle of two independent countdowns: the instant Player 1 presses their clock button (or taps the `Spacebar`), their timer freezes and Player 2’s timer begins running.',
      'This digital Chess Clock supports official FIDE and club time controls—including **Fischer Increment** (which adds `+2` or `+10` seconds to your bank after every completed move so you can convert a winning endgame without flagging) and **Bronstein Delay** (which waits `d` seconds before your main clock begins ticking each turn).',
    ],
    executionHeading: 'How to Set Up an Over-the-Board Match',
    executionSteps: [
      {
        title: 'Select Bullet (1+0 / 2+1), Blitz (3+2 / 5+0), or Rapid (10+0 / 15+10)',
        detail: 'Pick a preset FIDE time control or configure custom base minutes and per-move increment/delay seconds.',
      },
      {
        title: 'Place Your Phone or Tablet Flat Beside the Board (or Use a Laptop Keyboard)',
        detail: 'On mobile/tablet, each player taps their large half of the screen. On a laptop, either player can hit the `Spacebar` or `Enter` key to switch turns.',
      },
      {
        title: 'Watch the Move Counter and Sub-Second Tenths in Time Trouble',
        detail: 'When a player drops into their finalseconds, the display tracks tenths of a second and highlights the flag the instant a clock hits `00:00.0`.',
      },
    ],
    coachPhases: {
      blueprintTitle: 'Time Budget Across a 10+0 Rapid Game',
      phases: [
        { phase: 'Opening (Moves 1–12)', window: 'Spend ≤ 15% of Bank (1m 30s)', sharePercent: 15, cue: 'Play book development moves briskly; never spend 3 minutes on Move 6.' },
        { phase: 'Middlegame Critical Turns (Moves 13–28)', window: 'Spend 60% of Bank (6m 00s)', sharePercent: 60, cue: 'Invest two 90-second deep thinks on critical pawn breaks or tactical sacrifices.' },
        { phase: 'Endgame Conversion (Move 29+)', window: 'Reserve 25% of Bank (2m 30s)', sharePercent: 25, cue: 'Keep a 2-minute buffer for king-and-pawn calculation or increment banking.' },
      ],
      pacingMistakesTitle: 'Classic Over-the-Board Clock Mistakes',
      pacingMistakes: [
        'Pressing the clock with the other hand—FIDE tournament rules strictly require pressing the clock with the same hand that moved the piece.',
        'Playing instantaneously in a winning position when opponent is in time trouble, instead of using their clock to double-check for stalemates or blunders.',
      ],
    },
    tableSectionTitle: 'Official FIDE & Club Chess Time Controls',
    tableSectionIntro: 'Standard time classifications and increment rules used in tournaments:',
    tableColumns: ['Category', 'Popular Time Controls (`Base + Increment`)', 'How Increment vs. Delay Works'],
    tableRows: [
      ['Bullet Chess (< 3 mins)', '1+0 (1m Sudden Death) · 2+1 (2m + 1s Fischer)', 'Pure pattern recognition and pre-move speed'],
      ['Blitz Chess (3 to 10 mins)', '3+2 (FIDE World Blitz) · 5+0 · 5+3', '3+2 adds 2 seconds per move, preventing dirty-flagging in drawn rook endings'],
      ['Rapid Chess (10 to 60 mins)', '10+0 · 15+10 (FIDE World Rapid) · 25+10', '15+10 gives a 25-minute equivalent budget for a 60-move game'],
      ['US Chess Delay Controls', 'G/5;d2 · G/25;d5 (Bronstein / Simple Delay)', 'Clock waits 2 or 5 seconds each turn before subtracting main time; bank never grows'],
    ],
    fieldNotesTitle: 'Tournament Director & Club Player Notes',
    fieldNotes: [
      {
        label: 'Fischer Increment vs. Bronstein Delay',
        note: 'With a `3+2` Fischer increment, moving in 0.5 seconds adds `+1.5` net seconds to your bank. With a `2-second` Bronstein delay, moving in 0.5 seconds simply costs 0 seconds—your total time can never rise above the starting 3:00.',
      },
      {
        label: 'Handicap / Time-Odds Games',
        note: 'For casual games between players of different ratings, give the higher-rated player `1:00` or `2:00` against `5:00` for the lower-rated player to make every game tense.',
      },
    ],
  },

  'egg-timer': {
    slug: 'egg-timer',
    archetype: 'coach-brief',
    kicker: 'THERMAL CULINARY TIMING GUIDE',
    leadHeading: 'Why 60 Seconds Changes an Egg from Runny Gold to Chalky—and How to Time Every Style',
    leadParagraphs: [
      'Egg white proteins (ovalbumin) set firm between `140°F` and `149°F` (`60°C–65°C`), while yolk proteins coagulate between `150°F` and `158°F` (`65°C–70°C`). When you lower a fridge-cold egg into `212°F` (`100°C`) simmering water, heat moves inward at an exact thermal rate—meaning a single extra minute is the difference between a jammy ramen yolk and a dry hard-boiled center.',
      'This Egg Timer adjusts your exact countdown based on **Doneness Style** (Soft Dippy, Jammy Medium, Classic Hard-Boiled) and **Egg Size** (Medium, Large, Extra-Large), with built-in reminders for the ice-bath shock that stops carryover cooking.',
    ],
    executionHeading: 'The Foolproof Simmering-Start Method',
    executionSteps: [
      {
        title: 'Bring Water to a Gentle Simmer First (Never Start in Cold Water)',
        detail: 'Cold-water starts vary wildly depending on stove BTU power and pot size. Always lower eggs into already simmering water so timing starts from a fixed `212°F / 100°C` baseline.',
      },
      {
        title: 'Select Your Egg Size and Target Yolk Texture, Then Hit Start',
        detail: 'Lower fridge-cold (`38°F / 3°C`) eggs gently with a slotted spoon and start the timer immediately.',
      },
      {
        title: 'Transfer Straight Into an Ice Bath at the 00:00 Chime',
        detail: 'Leaving a 6-minute egg in hot water for even 45 seconds after the chime turns a runny yolk solid via residual shell heat.',
      },
    ],
    coachPhases: {
      blueprintTitle: 'Thermal Stages Inside a Simmering Large Egg',
      phases: [
        { phase: 'Minutes 0:00–4:30 (White Coagulation)', window: '0s – 270s', sharePercent: 45, cue: 'Outer and inner albumen proteins denature and turn opaque white; yolk remains liquid.' },
        { phase: 'Minutes 4:30–6:30 (Custard & Jammy Window)', window: '270s – 390s', sharePercent: 25, cue: '6:00 yields a runny dippy yolk; 6:30–7:00 yields a translucent jammy ramen yolk.' },
        { phase: 'Minutes 7:00–10:00 (Creamy Hard Set)', window: '390s – 600s', sharePercent: 30, cue: '9:30–10:00 sets the center firm and creamy without triggering the gray-green iron sulfide ring.' },
      ],
      pacingMistakesTitle: 'Three Kitchen Mistakes That Ruin Boiled Eggs',
      pacingMistakes: [
        'Starting the timer with eggs in cold water—an induction burner reaches a boil 4 minutes faster than an electric coil, throwing off yolk texture.',
        'Skipping the ice-water bath at `00:00`—carryover heat inside the shell keeps cooking the yolk for 2 full minutes on the counter.',
        'Boiling past 12 minutes, which reacts sulfur in the white with iron in the yolk to form a chalky greenish-gray ring.',
      ],
    },
    tableSectionTitle: 'Exact Simmering Times for Fridge-Cold Large Eggs (Sea Level)',
    tableSectionIntro: 'Verified culinary benchmarks for standard 57g Large eggs lowered into gently simmering water:',
    tableColumns: ['Target Yolk Style', 'Exact Simmer Time (Large Egg)', 'Best Culinary Dish & Size Adjustment'],
    tableRows: [
      ['Runny Dippy Soft-Boiled', '05:30 – 06:00', 'Toast soldiers, breakfast bowls · (−30s Medium / +30s XL)'],
      ['Custardy Jammy Medium', '06:30 – 07:00', 'Ramen, grain bowls, Niçoise salad · (−30s Medium / +30s XL)'],
      ['Tender Creamy Hard-Boiled', '08:30 – 09:00', 'Sliced on avocado toast or Cobb salad · (−30s Medium / +40s XL)'],
      ['Firm Peelable Hard-Boiled', '10:00 – 10:30', 'Deviled eggs & classic egg salad · Shock in ice water for 5 mins'],
    ],
    fieldNotesTitle: 'Test Kitchen & Food Science Notes',
    fieldNotes: [
      {
        label: 'High-Altitude Adjustment (`>3,000 ft / 900 m`)',
        note: 'In Denver (`5,280 ft`), water boils at `202°F` (`94.4°C`) instead of `212°F` (`100°C`). Add 45 seconds to soft-boiled times and 60–90 seconds to hard-boiled times at altitude.',
      },
      {
        label: 'Why Simmering Start Makes Eggs Peel Easily',
        note: 'Shocking cold eggs directly into simmering water rapidly contracts the outer membrane away from the shell—making even fresh farm eggs peel cleanly after an ice bath.',
      },
    ],
  },

  'pomodoro-timer': {
    slug: 'pomodoro-timer',
    archetype: 'coach-brief',
    kicker: 'FOCUS SPRINT & BREAK RECOVERY SYSTEM',
    leadHeading: 'Why 25-Minute Sprints Beat Marathon Desk Sessions—and When to Switch to 50/10',
    leadParagraphs: [
      'Sitting down at 9:00 AM with a vague plan to "work on the quarterly report all morning" almost guarantees you will check email seven times, reorganize a folder, and feel exhausted by noon with half a page written. The brain resists open-ended drudgery, but it willingly commits to a strict 25-minute single-task sprint when a 5-minute break is guaranteed at the bell.',
      'This Pomodoro Timer automates the complete cycle—tracking four focused work intervals separated by short recovery breaks before triggering a longer 15-to-20-minute restorative reset, while letting deep-work veterans switch to `50/10` or custom intervals in one click.',
    ],
    executionHeading: 'How to Run a True 4-Cycle Pomodoro Block',
    executionSteps: [
      {
        title: 'Write Down One Concrete Deliverable Before Clicking Start',
        detail: 'Never start a Pomodoro on a vague project name ("Marketing"). Define a single unit of output ("Draft the 3 email subject lines and hero paragraph").',
      },
      {
        title: 'Protect the 25-Minute Sprint with an "Interruption Capture Pad"',
        detail: 'When a sudden urge to check a message or look up an unrelated fact hits at minute 11, jot a 3-word note on paper and keep working until the 00:00 chime.',
      },
      {
        title: 'Take a Non-Screen Break During the 5-Minute Recovery',
        detail: 'Stand up, refill water, or look out a window. Scrolling social media feeds during your 5-minute break taxes the exact same prefrontal attention network you are trying to rest.',
      },
    ],
    coachPhases: {
      blueprintTitle: 'The 2-Hour Four-Pomodoro Architecture',
      phases: [
        { phase: 'Pomodoros 1 & 2 (Activation & Momentum)', window: '25m Work / 5m Break × 2', sharePercent: 45, cue: 'Overcome starting friction on your hardest cognitive task of the morning.' },
        { phase: 'Pomodoros 3 & 4 (Deep Execution)', window: '25m Work / 5m Break × 2', sharePercent: 40, cue: 'Finish drafting, coding, or problem-solving and log completed checkmarks.' },
        { phase: 'Cycle 4 Long Break (Prefrontal Reset)', window: '15m – 20m Walk / Rest', sharePercent: 15, cue: 'Step away from the desk completely before starting a second 4-cycle block.' },
      ],
      pacingMistakesTitle: 'Three Habits That Break the Pomodoro Method',
      pacingMistakes: [
        'Skipping the 5-minute break because you feel "in the zone"—which leads to an attention crash 40 minutes later. If 25m feels too short for coding, switch the preset to `50 / 10` upfront.',
        'Multitasking across three Slack threads inside a single Pomodoro—if a Pomodoro is interrupted by an urgent call, reset it cleanly.',
      ],
    },
    tableSectionTitle: 'Choosing the Right Focus-to-Break Ratio',
    tableSectionIntro: 'Match your interval preset to the cognitive nature of your task:',
    tableColumns: ['Preset Ratio', 'Work / Short Break / Long Break', 'Best Task Fit & Why It Works'],
    tableRows: [
      ['Classic 25 / 5 (Cirillo)', '25m Work · 5m Break · 15m Long Break', 'Exam study, writing drafts, clearing procrastinated admin tasks'],
      ['Deep Work 50 / 10 (Ultradian)', '50m Work · 10m Break · 25m Long Break', 'Software engineering, financial modeling, architecture—avoids mid-flow context loss'],
      ['Micro-Sprint 15 / 5 (ADHD / Warmup)', '15m Work · 5m Break · 15m Long Break', 'High-resistance tasks, inbox triage, or late-afternoon energy slumps'],
      ['Balanced 30 / 10 (Creative Studio)', '30m Work · 10m Break · 20m Long Break', 'UI design, video editing, and music practice requiring frequent visual/ear resets'],
    ],
    fieldNotesTitle: 'Productivity Practitioner Notes',
    fieldNotes: [
      {
        label: 'Estimating Work in "Pomodoros" Instead of Hours',
        note: 'Most knowledge workers can complete **8 to 10 true Pomodoros** (4 to 5 net hours of pure, uninterrupted cognitive output) in an 8-hour workday once meetings and messages are factored in.',
      },
      {
        label: 'Why Software Developers Prefer 50 / 10',
        note: 'Loading a complex codebase into working memory takes 8 to 12 minutes. Switching to the `50 / 10` preset gives you 38+ minutes of peak flow after ramp-up while still enforcing an hourly posture break.',
      },
    ],
  },

  'alarm-clock': {
    slug: 'alarm-clock',
    archetype: 'coach-brief',
    kicker: 'BROWSER DESK ALARM & WAKE GUARD',
    leadHeading: 'Setting a Reliable Browser Alarm for Desk Boundaries, Calls, and Power Naps',
    leadParagraphs: [
      'When you are deep in full-screen code or spreadsheets on a desktop monitor with your phone face-down in another room, it is remarkably easy to blow past a 2:00 PM client call or school pickup time.',
      'This Online Alarm Clock watches your live system clock second by second, displaying a real-time countdown to your target hour and firing a continuous Web Audio chime with a one-tap 5-minute or 10-minute Snooze button.',
    ],
    executionHeading: 'How to Arm and Test Your Desk Alarm',
    executionSteps: [
      {
        title: 'Pick Your Target Hour and Minute (and Verify AM vs. PM)',
        detail: 'Select the exact clock time; check the live "Rings in X hours Y minutes" preview badge to confirm you didn’t set PM when you meant AM.',
      },
      {
        title: 'Click "Test Sound" Once to Unlock Browser Audio & Verify Volume',
        detail: 'Modern browsers require one user click to unlock the Web Audio API; testing the chime also confirms your laptop speakers aren’t muted.',
      },
      {
        title: 'Leave the Tab Open (Pinned) and Keep Laptop Awake',
        detail: 'For overnight or nap use, plug your laptop into AC power or keep the alarm open in Fullscreen Mode so OS sleep settings don’t suspend the browser.',
      },
    ],
    coachPhases: {
      blueprintTitle: 'The 22-Minute NASA Power Nap Protocol',
      phases: [
        { phase: 'Minutes 0–4 (Sleep Onset)', window: 'Eyes Closed & Darkened Room', sharePercent: 20, cue: 'Set the alarm 25 minutes ahead of the current clock time to allow 3–4 minutes to fall asleep.' },
        { phase: 'Minutes 4–22 (Stage 2 Light Sleep)', window: '18–20 Mins Restorative Nap', sharePercent: 70, cue: 'Clears adenosine drowsiness and restores alertness without entering deep slow-wave sleep.' },
        { phase: 'Minute 25 (Wake Chime)', window: 'Immediate Stand-Up', sharePercent: 10, cue: 'Avoid hitting Snooze—sleeping past 30 minutes drops you into slow-wave sleep inertia (grogginess).' },
      ],
      pacingMistakesTitle: 'Why Browser Alarms Fail (and How to Prevent It)',
      pacingMistakes: [
        'Closing the laptop lid or letting battery-saver sleep suspend the OS after 15 minutes of inactivity.',
        'Leaving Bluetooth headphones connected inside a backpack across the room so the alarm plays into the headphones instead of the room speakers.',
      ],
    },
    tableSectionTitle: 'Desk Alarm Use Cases & Recommended Chime Tones',
    tableSectionIntro: 'Match your alarm scenario to the right acoustic tone and lead time:',
    tableColumns: ['Use Case', 'When to Set the Alarm', 'Recommended Tone & Setup Tip'],
    tableRows: [
      ['Hard-Stop Meeting Guard', '3 minutes before call start (e.g., 1:57 PM)', 'Soft Chime · Gives you 3 minutes to wrap your thought and open Zoom'],
      ['Afternoon Power Nap', '+24 to +26 minutes from current clock', 'Digital Beep · Keep laptop on AC power with screen awake'],
      ['Medication / Standing Reminder', 'Fixed daily clock mark (e.g., 11:30 AM & 4:30 PM)', 'Classic Bell · Pin the tab in the left-most browser slot'],
      ['End-of-Workday Shutdown', '15 minutes before departure (e.g., 5:15 PM)', 'Soft Chime · Cue to write tomorrow’s top 3 priorities and close tabs'],
    ],
    fieldNotesTitle: 'Browser Audio & Wake Lock Field Notes',
    fieldNotes: [
      {
        label: 'Why the "Rings in X Hours" Preview Matters',
        note: 'If it is `2:00 PM` and you accidentally set `03:00 AM` instead of `03:00 PM`, the preview badge will immediately read `Rings in 13 hours` instead of `Rings in 1 hour`—catching the AM/PM mistake instantly.',
      },
      {
        label: 'Screen Wake Lock in Fullscreen Mode',
        note: 'Entering Fullscreen Mode (`F`) requests the browser’s Screen Wake Lock API on supported desktop and mobile browsers, preventing the display from dimming.',
      },
    ],
  },

  'embed-widget': {
    slug: 'embed-widget',
    archetype: 'coach-brief',
    kicker: 'IFRAME GENERATOR FOR NOTION, CANVAS & WEB',
    leadHeading: 'Embedding a Live Countdown, Pomodoro, or World Clock Inside Notion, Canvas, and Web Pages',
    leadParagraphs: [
      'When students open a Canvas LMS assignment page or a remote team opens a Notion sprint wiki, forcing them to open a separate tab to find a timer creates unnecessary context switching.',
      'This Embed Widget Studio generates a clean, self-contained HTML `<iframe>` snippet (or direct Notion `/embed` URL) pre-configured with your exact tool mode, default duration, and light/dark theme—zero external scripts or tracking cookies required.',
    ],
    executionHeading: 'How to Generate and Embed Your Widget',
    executionSteps: [
      {
        title: 'Choose the Tool Mode, Default Duration, and Theme',
        detail: 'Select Countdown, Visual Timer, Pomodoro, Stopwatch, or World Clock, and set your preferred dark/light appearance and pixel dimensions.',
      },
      {
        title: 'Preview the Live Interactive Widget in the Builder',
        detail: 'Test the controls right inside the live preview frame to confirm the height and width fit your sidebar or Notion column.',
      },
      {
        title: 'Copy the HTML `<iframe>` Snippet or Direct URL',
        detail: 'Paste the `<iframe>` into WordPress, Webflow, Canvas LMS, or Google Sites—or paste the `src` URL into a Notion `/embed` block.',
      },
    ],
    coachPhases: {
      blueprintTitle: 'Responsive Sizing Guide for Embedded Widgets',
      phases: [
        { phase: 'Compact Sidebar (320×360px)', window: 'Notion 2-Column / Blog Rail', sharePercent: 30, cue: 'Ideal for a personal Pomodoro or 5-minute warm-up timer beside notes.' },
        { phase: 'Standard Card (480×420px)', window: 'LMS Assignment / Wiki Body', sharePercent: 40, cue: 'Fits comfortably inside a 720px article column on desktop and tablet.' },
        { phase: 'Full-Width Stage (100%×520px)', window: 'Classroom Portal / Event Page', sharePercent: 30, cue: 'Best for shared classroom smartboards or live event landing pages.' },
      ],
      pacingMistakesTitle: 'Common Iframe Integration Mistakes',
      pacingMistakes: [
        'Pasting raw `<iframe ...>` HTML tags into a Notion text block—Notion expects only the URL inside its `/embed` command.',
        'Omitting `allow="fullscreen"` from custom HTML embeds when teachers want to expand the widget to full screen.',
      ],
    },
    tableSectionTitle: 'Platform-Specific Embed Instructions',
    tableSectionIntro: 'How to paste your generated timer widget into popular workspaces and CMS platforms:',
    tableColumns: ['Platform', 'What to Copy', 'Exact Integration Steps'],
    tableRows: [
      ['Notion Workspace / Study Dashboard', 'Direct `https://...` URL from `src`', 'Type `/embed`, paste the URL, and drag the frame handles to resize'],
      ['Canvas LMS / Blackboard / Moodle', 'Full `<iframe ...></iframe>` HTML', 'Open the page editor, click the `</>` HTML Editor toggle, and paste'],
      ['WordPress / Webflow / Ghost', 'Full `<iframe ...></iframe>` HTML', 'Insert a "Custom HTML" or "Embed" block and paste the snippet'],
      ['Obsidian / Logseq Local Notes', 'Full `<iframe ...></iframe>` HTML', 'Paste directly into Markdown; renders live in Reading and Live Preview modes'],
    ],
    fieldNotesTitle: 'Webmaster & LMS Admin Notes',
    fieldNotes: [
      {
        label: 'Zero Third-Party Cookie Footprint (`loading="lazy"`)',
        note: 'Every generated snippet includes `loading="lazy"` so below-the-fold widgets never impact your host page’s Largest Contentful Paint (LCP) Core Web Vitals score.',
      },
      {
        label: 'Pre-Configuring Assignment Durations via URL Params',
        note: 'Each embed URL encodes your exact duration in the query string, so every student who opens the LMS page sees the exact 15-minute or 45-minute quiz timer pre-loaded.',
      },
    ],
  },

  // ============================================================================
  // ARCHETYPE 2: SENSORY & CLASSROOM STUDIO (Classroom & 27 Visual/Sensory Timers)
  // ============================================================================
  'classroom-noise-meter': {
    slug: 'classroom-noise-meter',
    archetype: 'sensory-studio',
    kicker: 'CLASSROOM ACOUSTIC FEEDBACK & VOICE LEVELS',
    leadHeading: 'Teaching Students to Self-Regulate Room Volume Without Raising Your Voice',
    leadParagraphs: [
      'When 28 students are working in four small groups, classroom chatter naturally escalates through the Lombard Effect—each table speaks slightly louder to be heard over the next table until the room hits 80 decibels. Clapping your hands or shouting "quiet down" every three minutes exhausts the teacher and breaks student concentration.',
      'Projecting this live Classroom Noise Meter on your front smartboard turns volume control into an objective visual game: students see the needle and color bar climb toward the amber warning zone in real time and hush their own group before the red threshold triggers.',
    ],
    executionHeading: 'Calibrating the Microphone for Your Classroom',
    executionSteps: [
      {
        title: 'Grant Local Browser Microphone Access and Sample Silent Room Baseline',
        detail: 'Click Start Microphone while the room is quiet for 5 seconds; all audio analysis runs 100% locally in your browser’s Web Audio API (`AnalyserNode`)—zero audio is ever recorded or uploaded.',
      },
      {
        title: 'Adjust Mic Sensitivity for Your Laptop’s Placement',
        detail: 'A laptop sitting on a teacher’s desk 15 feet from the nearest student table needs higher sensitivity than an iPad sitting in the center of a group table.',
      },
      {
        title: 'Select the Target Voice Mode (Silent Study, Partner Whisper, or Group Work)',
        detail: 'Set the threshold slider to match the current activity so students know the exact ceiling before they lose a quiet-streak point.',
      },
    ],
    sensoryMatrix: {
      viewingDistance: 'Front Smartboard / Projector visible from all student tables (15–35 ft)',
      ambientContrast: 'High-contrast green/amber/red level bar with numerical 0–100 relative index',
      soundProfile: 'Optional gentle alert chime when red threshold is exceeded for >2 seconds',
      sensoryNote: 'Measures relative RMS microphone amplitude (0–100 classroom scale)—not a calibrated ANSI Type-1 hardware dB SPL meter.',
      routines: [
        { title: 'Mode 0: Silent Reading & Testing', timing: 'Threshold: 25 / 100', setup: 'Any sustained talking moves the bar into amber; ideal for independent writing.' },
        { title: 'Mode 1: Partner "6-Inch Voices"', timing: 'Threshold: 50 / 100', setup: 'Allows quiet turn-and-talk pairs while flagging across-the-room shouting.' },
        { title: 'Mode 2: Collaborative STEM Centers', timing: 'Threshold: 75 / 100', setup: 'Permits lively 4-student table discussion while preventing runaway Lombard escalation.' },
      ],
    },
    tableSectionTitle: 'Classroom Voice Level Calibration Matrix',
    tableSectionIntro: 'Align your smartboard noise threshold with standard elementary and middle-school voice levels:',
    tableColumns: ['Classroom Voice Level', 'Meter Threshold Setting', 'Expected Room Acoustic Behavior'],
    tableRows: [
      ['Level 0 — Silent Independent Work', '20 – 30 on Meter Scale', 'Page turning, pencil writing, and keyboard typing only'],
      ['Level 1 — Partner Whisper', '40 – 55 on Meter Scale', 'Only the partner sitting directly beside you can hear your voice'],
      ['Level 2 — Table Group Talk', '60 – 75 on Meter Scale', 'Normal conversational tone heard only by your 4-person table'],
      ['Level 3 — Whole-Class Presenter', '75 – 85 on Meter Scale', 'Single student presenting to the entire classroom'],
    ],
    fieldNotesTitle: 'Teacher & School Privacy Field Notes',
    fieldNotes: [
      {
        label: '100% Local FERPA / COPPA Safe Audio Processing',
        note: 'The meter reads instantaneous root-mean-square (RMS) amplitude numbers from your browser’s `AudioContext` memory buffer and discards the buffer every animation frame. No voice audio is ever saved or transmitted over the network.',
      },
      {
        label: 'Don’t Place the Laptop Next to an HVAC Vent or Projector Fan',
        note: 'A ceiling projector fan or window AC unit 2 feet from your laptop mic creates a constant 40-point noise floor. Move the laptop away from mechanical fans before calibrating.',
      },
    ],
  },

  'random-name-picker': {
    slug: 'random-name-picker',
    archetype: 'sensory-studio',
    kicker: 'UNBIASED ROSTER WHEEL & COLD-CALL TOOL',
    leadHeading: 'Replacing Popsicle Sticks with Fair, No-Repeat Classroom & Stand-Up Draws',
    leadParagraphs: [
      'In every classroom and daily engineering stand-up, the same three extroverted people raise their hands first while quieter participants hang back. Calling on people from memory unintentionally favors the front row or repeats the same names.',
      'This Random Name Picker uses an unbiased Fisher-Yates shuffle (`1/N` exact probability) with one-click **"Remove Winner After Pick"** mode—guaranteeing every student or teammate gets called once before the roster resets.',
    ],
    executionHeading: 'How to Run a No-Repeat Roster Session',
    executionSteps: [
      {
        title: 'Paste Your Class Roster or Stand-Up Team List (One Name per Line)',
        detail: 'Copy names directly from Google Sheets, Excel, or your attendance roster; your list saves automatically in local browser storage.',
      },
      {
        title: 'Enable "Remove Selected Name" for Full-Roster Participation',
        detail: 'Toggle no-repeat mode on so each selected person moves to the "Already Called" list until everyone has had a turn.',
      },
      {
        title: 'Project Fullscreen and Spin to Build Anticipation',
        detail: 'Click Spin (or press `Space`) on the classroom smartboard or screen-share window so everyone sees the fair selection.',
      },
    ],
    sensoryMatrix: {
      viewingDistance: 'Shared Smartboard or Zoom/Teams screen share (readable up to 40 ft)',
      ambientContrast: 'High-contrast winner banner with optional celebration sound toggle',
      soundProfile: 'Optional tick-tick-chime audio (can be muted for low-stimulation classrooms)',
      sensoryNote: 'Uses `prefers-reduced-motion` safe transition when reduced motion is enabled.',
      routines: [
        { title: '15-Minute Daily Scrum Order', timing: '60s–90s per teammate', setup: 'Pick the first speaker randomly, then click "Remove & Pick Next" to keep stand-up moving.' },
        { title: 'Equitable Classroom Cold-Calling', timing: 'Ask Question First → Pause 5s → Spin', setup: 'Always ask the question and wait 5 seconds BEFORE spinning so the whole class thinks through the answer.' },
        { title: 'Lab Partner & Group Generator', timing: '2-Minute Setup', setup: 'Spin twice at a time with Remove Winner active to pair up the entire class fairly.' },
      ],
    },
    tableSectionTitle: 'Selection Mode Comparison: With vs. Without Replacement',
    tableSectionIntro: 'Choose whether selected names stay in the pool or move to the completed list:',
    tableColumns: ['Mode', 'Mathematical Behavior', 'Best Classroom or Team Use Case'],
    tableRows: [
      ['Remove After Pick (Without Replacement)', 'Pool shrinks from N to N−1 each spin until everyone is called', 'Daily scrum updates, reading aloud, presentation order, raffle prizes'],
      ['Keep in Pool (With Replacement)', 'Every name retains a 1/N chance on every single spin', 'Keeping students on their toes during review quizzes (being called once doesn’t make you "safe")'],
      ['Restore Full Roster', 'Returns all called names back to the active pool in 1 click', 'Starting a new class period or next day’s stand-up'],
    ],
    fieldNotesTitle: 'Instructional & Agile Facilitator Notes',
    fieldNotes: [
      {
        label: 'Pedagogical Rule: Question First, Spin Second',
        note: 'If you spin a student’s name *before* asking the question, the other 27 students mentally tune out. State the question, give 5 seconds of silent think time, and *then* spin the wheel.',
      },
      {
        label: 'Zero Cloud Upload of Student Names',
        note: 'Student rosters are stored exclusively in your browser’s `localStorage` on your device—no student names or PII are ever sent to any external server.',
      },
    ],
  },

  'visual-timer': {
    slug: 'visual-timer',
    archetype: 'sensory-studio',
    kicker: 'SPATIAL TIME-BLINDNESS & CLASSROOM DISC',
    leadHeading: 'Why Shrinking Colored Space Works Better Than Ticking Digits for Time Blindness',
    leadParagraphs: [
      'To a 6-year-old child—or an adult with ADHD deep in hyperfocus—the digital numbers `08:42` and `03:15` are just abstract math symbols. They don’t trigger any visceral sense that a transition is approaching until `00:00` suddenly blares and causes frustration.',
      'A disappearing-disk Visual Timer translates time into physical geometry: a colored wedge that visibly shrinks across a 360-degree dial. Even from the back row of a classroom or out of the corner of your eye, seeing a thin sliver of color left tells your brain immediately how much time remains relative to the whole block.',
    ],
    executionHeading: 'Setting Up Your Visual Timer for Maximum Clarity',
    executionSteps: [
      {
        title: 'Choose Circular Wedge, Horizontal Bar, or Hourglass Mode',
        detail: 'Pick the classic disappearing red/emerald disk for distance viewing, or switch to the linear bar if you prefer a left-to-right progress track.',
      },
      {
        title: 'Hide Digital Numbers When Tick-By-Tick Seconds Cause Test Anxiety',
        detail: 'For neurodivergent students or mindfulness sessions where ticking seconds create pressure, toggle the numeric readout off and let the color wedge guide the pace.',
      },
      {
        title: 'Project Fullscreen in Landscape Mode on Smartboards or Tablets',
        detail: 'Tap Fullscreen (`F`) to strip away all page menus so only the high-contrast visual dial and optional digital time fill the screen.',
      },
    ],
    sensoryMatrix: {
      viewingDistance: 'Up to 50 feet on classroom projectors; 3–10 feet on desk tablets',
      ambientContrast: '6 curated color palettes (Sage, Amber, Terracotta, Ocean, Lavender, High-Contrast)',
      soundProfile: 'Soft chime, bell, or 100% silent visual completion flash',
      sensoryNote: 'Synchronized to monotonic epoch delta (`Date.now()`)—the wedge angle always matches true remaining time even after tab switches.',
      routines: [
        { title: '5-Minute Classroom Clean-Up Transition', timing: '05:00 Disappearing Disk', setup: 'Give a "5-minute visual warning" before ending center time so children see the transition coming.' },
        { title: '25-Minute ADHD Body-Doubling Sprint', timing: '25:00 Sage Green Wedge', setup: 'Keep the shrinking disk in peripheral vision on an iPad or second monitor to prevent hyperfocus time loss.' },
        { title: '10-Minute Design Thinking Ideation', timing: '10:00 Amber Wedge', setup: 'Project at the front of the workshop room so participants pace sticky-note brainstorming.' },
      ],
    },
    tableSectionTitle: 'Visual Timer Display Modes Compared',
    tableSectionIntro: 'Select the visual geometry that fits your room layout and cognitive goal:',
    tableColumns: ['Visual Mode', 'How Time Is Represented', 'Best Environment & Audience'],
    tableRows: [
      ['Disappearing Circular Disk', '360° colored sector shrinks clockwise toward 12 o’clock', 'K–12 classrooms, ADHD time blindness, and group workshops'],
      ['Linear Progress Bar', 'Horizontal ribbon drains smoothly from 100% to 0%', 'Presentations, exam halls, and sequential step-by-step tasks'],
      ['Dual Visual + Numeric Mode', 'Shrinking geometry paired with tabular `MM:SS` readout', 'Standardized testing and mixed audiences needing both spatial and exact cues'],
    ],
    fieldNotesTitle: 'Occupational Therapy & Classroom Notes',
    fieldNotes: [
      {
        label: 'Why Red vs. Sage Green Matters for Sensory Regulation',
        note: 'Classic red visual disks provide maximum urgency from across a bright classroom, while sage green or ocean blue palettes reduce sympathetic nervous system arousal for anxious learners.',
      },
      {
        label: 'Preventing Transition Meltdowns',
        note: 'Occupational therapists recommend starting a 3-minute or 5-minute visual timer *before* asking a child to stop a preferred activity, allowing their brain to process the shrinking wedge visually.',
      },
    ],
  },
};

// Dynamic generator for all remaining visual/sensory timers in /timers/* so every single one of the 49 tools has unique, domain-specific practitioner archetype data
const SENSORY_TIMER_PROFILES: Record<
  string,
  {
    kicker: string;
    leadHeading: string;
    leadParagraphs: [string, string];
    viewingDistance: string;
    ambientContrast: string;
    sensoryNote: string;
    routines: Array<{ title: string; timing: string; setup: string }>;
    tableTitle: string;
    tableColumns: [string, string, string];
    tableRows: Array<[string, string, string]>;
    fieldNotes: Array<{ label: string; note: string }>;
  }
> = {
  'sensory-timers': {
    kicker: 'CALM SENSORY & NEURODIVERGENT TIMING HUB',
    leadHeading: 'How Ambient Sensory Timers Replace Jarring Alarms with Predictable Visual Flow',
    leadParagraphs: [
      'For students with autism, ADHD, or sensory processing differences, a sudden buzzer or flashing red `00:00` clock can trigger a fight-or-flight stress response that derails an entire lesson or therapy session.',
      'Sensory timers replace rigid ticking counters with organic, continuous motion—floating liquid droplets, rising bubbles, melting candle wax, or drifting snow—that communicates remaining time gently while keeping the nervous system regulated.',
    ],
    viewingDistance: 'Individual desk tablet (2–5 ft) or darkened sensory corner projection',
    ambientContrast: 'Low-glare pastel and deep-ocean palettes with smooth 60fps easing',
    sensoryNote: 'All animations automatically honor OS `prefers-reduced-motion` settings and support 100% silent completion.',
    routines: [
      { title: 'Sensory Corner De-Escalation', timing: '03:00 – 05:00 Silent Mode', setup: 'Use Liquid, Bubble, or Lava Lamp timer with digital digits hidden for co-regulation.' },
      { title: 'Occupational Therapy Fine-Motor Station', timing: '08:00 – 10:00 Soft Chime', setup: 'Pair Sand or Blocks timer with handwriting or pegboard tasks.' },
      { title: 'Calm Morning Classroom Arrival', timing: '10:00 – 15:00 Fullscreen', setup: 'Project Snow, Coral, or Sun Arc timer on the smartboard as students unpack.' },
    ],
    tableTitle: 'Matching Sensory Timer Styles to Regulation Needs',
    tableColumns: ['Sensory Goal', 'Recommended Timer Styles', 'Why This Visual Motion Works'],
    tableRows: [
      ['Down-Regulating High Energy / Anxiety', 'Liquid, Lava Lamp, Snow, Candle', 'Slow, predictable vertical drift lowers visual stimulation and slows breathing cadence'],
      ['Concrete Step-by-Step Task Completion', 'Blocks, Pixel, Progress Bar, Picture Reveal', 'Discrete units disappear or unlock one by one, rewarding steady task progress'],
      ['Clear Whole-Room Distance Visibility', 'Circular, Radial, Rings, Rainbow, Hourglass', 'High-contrast geometric arcs readable from 30+ feet away'],
    ],
    fieldNotes: [
      { label: 'Hide Numbers for Pure Visual Pacing', note: 'Toggle the numeric clock off when working with children who fixate on counting down seconds.' },
      { label: 'Always Pair with Silent Visual Completion in Quiet Rooms', note: 'Set sound to Mute/Visual Flash during reading blocks or therapy sessions.' },
    ],
  },
  'sand-timer': {
    kicker: 'DIGITAL HOURGLASS & TURN-TAKING STUDIO',
    leadHeading: 'Why the Falling Sand Metaphor Makes Turn-Taking Intuitive for Kids and Board Games',
    leadParagraphs: [
      'A physical glass sand timer is universally understood because you can see both the remaining sand in the top bulb and the elapsed pile building at the bottom—until someone wants a 4-minute round instead of the fixed 1-minute glass tube that came in the game box.',
      'This Digital Sand Timer pairs an organic falling-grain hourglass visualization with an exact system-clock engine, letting you set any custom duration, pause mid-turn during a rule dispute, and project the hourglass across an entire classroom.',
    ],
    viewingDistance: 'Tabletop iPad/phone (2–4 ft) or Classroom Smartboard (up to 35 ft)',
    ambientContrast: 'Warm golden silica grains inside a high-contrast glass chamber',
    sensoryNote: 'Unlike physical sand that can clog or vary by ±10%, the upper/lower bulb levels are mathematically locked to `remainingMs / totalMs`.',
    routines: [
      { title: 'Board Game Turn Enforcer', timing: '01:00 or 02:00 per Turn', setup: 'Place a phone in the center of the table; tap Reset after each player finishes their move.' },
      { title: 'Elementary Reading Center Rotation', timing: '12:00 – 15:00 Fullscreen', setup: 'Project the sand timer so students see the top bulb emptying before cleanup.' },
      { title: 'Loose-Leaf Tea & Pour-Over Steep', timing: '03:00 – 04:00 Kitchen Counter', setup: 'Use preset buttons for black tea (3m), herbal infusions (5m), or French press (4m).' },
    ],
    tableTitle: 'Digital Sand Timer vs. Physical Glass Hourglass',
    tableColumns: ['Capability', 'WebCountDownTimer Sand Timer', 'Physical Glass Hourglass'],
    tableRows: [
      ['Duration Selection', 'Any second/minute duration from 10s to 99m', 'Locked permanently to the single duration of that glass bulb'],
      ['Mid-Turn Pause', 'Instant Pause & Resume without losing a second', 'Must be laid flat horizontally (which still shifts sand grains)'],
      ['End-of-Time Signal', 'Optional gentle chime + empty bulb state', 'Completely silent—requires someone staring at the neck'],
    ],
    fieldNotes: [
      { label: 'Why Kids Respond Better to Sand Than Digits', note: 'Seeing the bottom pile grow gives young learners a tangible sense of "work accomplished" alongside time remaining.' },
      { label: 'One-Tap Flip Reset (`R`)', note: 'In fast word games like Codenames or Articulate, hit `R` then `Space` to flip the hourglass instantly for the next team.' },
    ],
  },
  'flip-clock': {
    kicker: 'RETRO SPLIT-FLAP DESK & STUDIO CLOCK',
    leadHeading: 'Why Mid-Century Split-Flap Cards Are Easier to Read Across a Room Than LCD Digits',
    leadParagraphs: [
      'Classic Solari and Braun split-flap clocks became the gold standard for train stations and broadcast studios because each numeral fills the entire height of its mechanical card with zero surrounding bezel clutter.',
      'This full-screen Flip Clock recreates that crisp mechanical card drop in 12-hour AM/PM or 24-hour military time, turning any idle monitor, iPad stand, or streaming backdrop into a zero-glare studio timepiece.',
    ],
    viewingDistance: 'Desk setup (2–6 ft) or room-wide studio monitor (up to 45 ft)',
    ambientContrast: 'Matte charcoal split-flap cards with crisp high-contrast white numerals',
    sensoryNote: 'Synchronized directly to your OS system clock; optional mechanical tick sound can be toggled on or muted.',
    routines: [
      { title: 'Always-On Desk & YouTube Studio Backdrop', timing: '24/7 Live Clock', setup: 'Run in Fullscreen (`F`) on a secondary monitor or docked iPad beside your keyboard.' },
      { title: 'Exam Hall Wall Timepiece', timing: '12h or 24h Format', setup: 'Project at the front of a testing room with seconds hidden or visible per exam rules.' },
      { title: 'Broadcast & Podcast Time-of-Day Reference', timing: '24-Hour Military Mode', setup: 'Keep open in a studio corner so hosts hit top-of-the-hour breaks cleanly.' },
    ],
    tableTitle: '12-Hour vs. 24-Hour Split-Flap Display Options',
    tableColumns: ['Display Setting', 'Visual Behavior', 'Best Studio or Room Application'],
    tableRows: [
      ['12-Hour with AM/PM Badge', 'Hours 1–12 with clear meridian badge on the left card', 'Home office desks, classrooms, and everyday bedside/tablet stands'],
      ['24-Hour Military Time (`00–23`)', 'Zero-padded 24-hour cards matching aviation & broadcast standards', 'Podcast studios, IT operations centers, and international teams'],
      ['Seconds Card Toggle', 'Show or hide the third flipping seconds card', 'Hide seconds during deep writing to eliminate peripheral motion'],
    ],
    fieldNotes: [
      { label: 'Hide the Seconds Card for Deep Work', note: 'When writing or coding, hiding the seconds flap so cards only drop once per minute keeps your desk setup calm.' },
      { label: 'OLED & Monitor Burn-In Prevention', note: 'High-contrast matte dark greys (`#1A1D1B`) reduce panel heat compared to pure `#000` / `#FFF` harsh contrast.' },
    ],
  },
  'flip-timer': {
    kicker: 'TACTILE SPLIT-FLAP COUNTDOWN TIMER',
    leadHeading: 'Combining Mechanical Split-Flap Legibility with Precision Countdown Control',
    leadParagraphs: [
      'When you project a countdown in a sunlit gym or a wide lecture hall, thin digital fonts wash out. Split-flap countdown cards use ultra-bold, heavy-weight typography split by a subtle horizontal hinge so every digit punches through room glare.',
      'This Flip Timer gives you mechanical card-flip motion synchronized to a drift-free countdown engine—complete with one-tap minute presets, custom HMS entry, and fullscreen projection.',
    ],
    viewingDistance: 'Up to 50 feet in bright classrooms, gyms, and conference rooms',
    ambientContrast: 'Heavy-weight split-flap numerals with 3D hinged card transitions',
    sensoryNote: 'Card flip animations automatically simplify when OS Reduced Motion is enabled.',
    routines: [
      { title: '25-Minute Study Desk Sprint', timing: '25:00 Fullscreen', setup: 'Prop your phone horizontally under your monitor for an iconic retro study timer.' },
      { title: '10-Minute Workshop Break Countdown', timing: '10:00 Projector View', setup: 'Display on the main room screen so attendees return to their seats before 00:00.' },
      { title: '45-Minute Mock Exam Paper', timing: '45:00 Silent Mode', setup: 'Give students a bold, unmistakable front-of-room clock during timed practice essays.' },
    ],
    tableTitle: 'Flip Timer vs. Standard Digital Countdown',
    tableColumns: ['Aspect', 'Split-Flap Flip Timer', 'Standard Digital Readout'],
    tableRows: [
      ['Peripheral Motion Cue', 'Physical card-drop flip every second/minute marks time tangibly', 'Flat instant pixel change with no mechanical transition'],
      ['Distance Legibility', 'Extra-tall condensed numerals fill 85% of the card height', 'Standard font proportions require closer viewing distance'],
      ['Aesthetic Presence', 'Doubles as a warm desk-setup centerpiece for study videos', 'Purely utilitarian text display'],
    ],
    fieldNotes: [
      { label: 'Landscape Fullscreen on Mobile Stands', note: 'Place your phone on a MagSafe or desk stand in landscape orientation and tap Fullscreen for maximum card height.' },
      { label: 'Optional Flip Tick vs. Silent Mode', note: 'Keep the subtle flip sound on for short 3-minute sprints, or mute it for quiet library study.' },
    ],
  },
  'train-timer': {
    kicker: 'SOLARI DEPARTURE BOARD COUNTDOWN',
    leadHeading: 'Pacing Event Check-Ins and Sprint Deadlines Like a European Rail Terminal',
    leadParagraphs: [
      'Walk into Zurich HB or Paris Gare du Nord and your eyes go straight to the split-flap departure board: amber platform numbers, crisp white destination tiles, and an unmistakable status column switching from `BOARDING` to `FINAL CALL` to `DEPARTED`.',
      'This Train Departure Board Timer brings that iconic terminal urgency to workshop transitions, hackathon submission cutoffs, and classroom station rotations.',
    ],
    viewingDistance: 'Event lobbies, hackathon halls, and front-of-room smartboards (up to 45 ft)',
    ambientContrast: 'Authentic terminal slate board with amber status flaps and tabular digits',
    sensoryNote: 'Status flaps update automatically as remaining time crosses 25% (`FINAL CALL`) and `00:00` (`DEPARTED`).',
    routines: [
      { title: 'Conference Coffee-Break Recall', timing: '15:00 Terminal Board', setup: 'Project in the hallway so attendees see when the next keynote "departs."' },
      { title: 'Hackathon Code-Freeze Countdown', timing: '60:00 Main Screen', setup: 'Build excitement in the final hour before Git repositories lock.' },
      { title: 'Classroom "Train Leaving the Station" Cleanup', timing: '04:00 Fullscreen', setup: 'Give elementary students a playful "all aboard" countdown to finish packing backpacks.' },
    ],
    tableTitle: 'Terminal Board Status Flap Thresholds',
    tableColumns: ['Countdown Phase', 'Board Status Indicator', 'Recommended Room Action'],
    tableRows: [
      ['100% → 25% Remaining', 'ON TIME / BOARDING (Green/White)', 'Main activity, break, or sprint work in progress'],
      ['Final 25% → 00:01', 'FINAL CALL (Amber Warning)', 'Wrap up conversations, save files, and return to seats'],
      ['00:00 Reached', 'DEPARTED (Red Flash + Chime)', 'Hard start of the next session or submission cutoff'],
    ],
    fieldNotes: [
      { label: 'Why Event Producers Love the Terminal Metaphor', note: 'Attendees instinctively respect a "departure time" more than a generic break countdown because nobody wants to miss a train.' },
      { label: 'Customizing the Destination Header', note: 'Use the preset duration buttons to switch rapidly between 5-minute stand-ups and 30-minute workshop sprints.' },
    ],
  },
  'forest-fire-timer': {
    kicker: 'CAMPFIRE EMBER & ECOLOGICAL VISUAL TIMER',
    leadHeading: 'Watching Time Burn Down Through Living Campfire Embers and Forest Atmosphere',
    leadParagraphs: [
      'Before mechanical clocks existed, people measured evening storytelling and watch shifts by the height of a burning log or candle. As the flame settles into glowing amber coals, the changing light naturally signals that the session is winding down.',
      'This Forest Fire & Campfire Timer maps your countdown to a dynamic flame and ember canvas—starting with a bright, crackling canopy glow and settling into deep twilight embers at `00:00`.',
    ],
    viewingDistance: 'Desk monitor, cozy reading corner, or classroom projection (3–30 ft)',
    ambientContrast: 'Warm amber, vermilion, and twilight pine palette optimized for low-glare dark rooms',
    sensoryNote: 'Flame intensity and particle height scale proportionally with remaining countdown percentage.',
    routines: [
      { title: 'Evening Reading & Journaling Wind-Down', timing: '20:00 – 30:00 Warm Glow', setup: 'Avoid blue-light screens before bed by using the warm amber ember palette.' },
      { title: 'Campfire Storytelling & Creative Writing', timing: '10:00 – 15:00 Classroom', setup: 'Dim overhead fluorescent lights and project the flame timer during creative writing prompts.' },
      { title: 'High-Urgency Sprint Challenge', timing: '05:00 Rapid Burn', setup: 'Use short durations when you want a vivid, energetic visual countdown for games.' },
    ],
    tableTitle: 'Flame & Ember Stages Across Your Countdown',
    tableColumns: ['Remaining Time Share', 'Visual Flame State', 'Pacing Cue'],
    tableRows: [
      ['100% – 50% Remaining', 'Tall Golden Canopy Flame', 'Full energy—dive into drafting, reading, or brainstorming'],
      ['50% – 15% Remaining', 'Steady Amber Hearth Glow', 'Halfway mark passed—begin shaping your conclusion'],
      ['Final 15% → 00:00', 'Deep Crimson Coals & Rising Sparks', 'Final wrap-up before the fire settles to ash at 00:00'],
    ],
    fieldNotes: [
      { label: 'Low-Blue-Light Evening Study', note: 'Warm amber and red wavelengths (`590nm–650nm`) create far less evening eye strain than stark white backgrounds.' },
      { label: 'Fullscreen Campfire Ambience', note: 'Press `F` on a TV or monitor during group discussions to create an instant hearth focal point.' },
    ],
  },
  'liquid-timer': {
    kicker: 'CALM GRAVITY DROPLET & FLUID TIMER',
    leadHeading: 'Using Smooth Fluid Motion and Gravity Droplets to Pace Sensory Breaks',
    leadParagraphs: [
      'Physical liquid motion bubblers have been a staple on occupational therapists’ shelves for decades because watching colored oil droplets descend through water slows down rapid eye movements and regulates breathing.',
      'Unlike a plastic desk toy that empties in an erratic 48 seconds and cannot be adjusted, this digital Liquid Timer lets you set an exact 2-minute, 5-minute, or 20-minute countdown while preserving the soothing physics of flowing liquid.',
    ],
    viewingDistance: 'Sensory desk tablet (2–5 ft) or whole-class smartboard (up to 30 ft)',
    ambientContrast: '6 soothing fluid themes (Ocean Blue, Emerald Green, Sunset Amber, Teal, Purple, Rose)',
    sensoryNote: 'Fluid level drains in exact proportion to `remainingSeconds / totalSeconds` while droplets animate smoothly.',
    routines: [
      { title: 'OT Sensory Reset & Breathing Break', timing: '03:00 Ocean Blue', setup: 'Have the student track individual falling droplets while taking slow 4-second inhales.' },
      { title: 'Quiet Reading & Library Block', timing: '15:00 Emerald Green', setup: 'Run in silent fullscreen mode so readers can check remaining time calmly.' },
      { title: 'Early Childhood Clean-Up Cue', timing: '05:00 Rose Pink', setup: '"Can we put all blocks in the bin before the pink liquid reaches the bottom?"' },
    ],
    tableTitle: 'Choosing the Right Liquid Color Mood',
    tableColumns: ['Fluid Palette', 'Sensory & Visual Character', 'Recommended Activity'],
    tableRows: [
      ['Ocean Blue / Teal', 'Cool, tranquil, low-arousal contrast', 'Anxiety de-escalation, breathwork, and test preparation'],
      ['Emerald Green / Purple', 'Balanced, restorative natural tones', 'Sustained independent reading, art therapy, and study sprints'],
      ['Sunset Amber / Rose Pink', 'Warm, cheerful, high-visibility fill', 'Group classroom transitions, games, and morning routines'],
    ],
    fieldNotes: [
      { label: 'Why Predictable Fluid Level Beats Random Bubblers', note: 'Because the overall liquid chamber drains steadily from top to bottom, children get both soothing droplet motion and an honest visual progress bar.' },
      { label: 'Reduced Motion Accessibility', note: 'Toggling Reduced Motion steadies the wave ripples while keeping the smooth vertical fluid drain.' },
    ],
  },
  'rainbow-timer': {
    kicker: 'MULTI-BAND SPECTRUM ARC COUNTDOWN',
    leadHeading: 'Making Time Joyful and Visible for Early Learners with a Shrinking Rainbow Arc',
    leadParagraphs: [
      'Young children in pre-K through 3rd grade haven’t yet mastered reading a 60-minute clock face, but every child understands a vibrant 6-band rainbow arch.',
      'As this Rainbow Timer counts down, all six spectrum bands sweep smoothly across the 180-degree sky arc—giving teachers and parents an inviting, cheerful visual cue for center rotations, toothbrushing, and tidy-up routines.',
    ],
    viewingDistance: 'Carpet circle smartboard (10–35 ft) or kitchen/bathroom counter tablet',
    ambientContrast: 'Soft Montessori wooden-rainbow pastel spectrum on warm cream or dark slate',
    sensoryNote: 'Arc sweep angle is locked to `180° × (remaining / total)` so half an arch always means exact halfway.',
    routines: [
      { title: '2-Minute Morning & Bedtime Toothbrushing', timing: '02:00 Bathroom Stand', setup: 'Kids brush top teeth for the first half of the rainbow and bottom teeth for the second half.' },
      { title: '10-Minute Kindergarten Center Rotation', timing: '10:00 Smartboard', setup: 'Project above the carpet area so every table sees the rainbow shrinking toward cleanup.' },
      { title: '5-Minute "Beat the Rainbow" Toy Tidy-Up', timing: '05:00 Living Room', setup: 'Turn living-room cleanup into a cooperative game before the rainbow finishes its sweep.' },
    ],
    tableTitle: 'Rainbow Arc Checkpoints for Kids’ Routines',
    tableColumns: ['Rainbow Arc Position', 'Remaining Time Fraction', 'Kid-Friendly Verbal Cue'],
    tableRows: [
      ['Full 180° Arch Across Sky', '100% (Start of Activity)', '"The rainbow is full—let’s start our station!"'],
      ['Half Arch (90° Top Peak)', '50% (Halfway Mark)', '"We’re at the top of the rainbow—switch partners or flip your page!"'],
      ['Final Sliver Near Horizon', 'Last 10% of Time', '"Almost at the cloud—finish your last piece and get ready to tidy up!"'],
    ],
    fieldNotes: [
      { label: 'Pastel Montessori Palette Prevents Overstimulation', note: 'We tuned the six bands to warm, natural toy tones rather than harsh neon primaries so the screen stays gentle on young eyes.' },
      { label: 'Hide Digits for Pre-Readers', note: 'For ages 3–5, toggle the digital numbers off so children focus purely on the rainbow arc.' },
    ],
  },
  'hourglass-timer': {
    kicker: 'PROPORTIONAL DUAL-CHAMBER HOURGLASS',
    leadHeading: 'Seeing Elapsed Time and Remaining Time Simultaneously in Two Glass Chambers',
    leadParagraphs: [
      'A progress bar shows only a horizontal line, and a digital clock shows only an instant snapshot. A proportional hourglass shows the entire story of your session at once: the top chamber displays what you have left to spend, while the bottom chamber displays everything you have already invested.',
      'This Hourglass Timer renders a geometric dual-bulb vessel with a live waist stream, giving speakers, chess players, and students a clear upper-to-lower ratio from across the room.',
    ],
    viewingDistance: 'Lectern, study desk, or 40-foot classroom projector',
    ambientContrast: 'Crisp architectural glass outline with high-contrast sand fill',
    sensoryNote: 'When the upper and lower sand levels are equal height, you are at the exact 50.0% halfway mark.',
    routines: [
      { title: '15-Minute Essay Outline & Drafting Split', timing: '15:00 Desk View', setup: 'Outline until one-third of the top bulb drains, then write paragraphs until the bottom fills.' },
      { title: '3-Minute Board Game & Trivia Round', timing: '03:00 Tabletop', setup: 'Place flat in the middle of the game board so all four sides of the table can read the bulbs.' },
      { title: '20-Minute Mediation or Coaching Turn', timing: '20:00 Office Tablet', setup: 'Give each participant equal speaking time without an intrusive digital stopwatch.' },
    ],
    tableTitle: 'Reading Hourglass Chamber Proportions at a Glance',
    tableColumns: ['Chamber Ratio (Top : Bottom)', 'Session Progress', 'Practical Pacing Action'],
    tableRows: [
      ['3 : 1 (Top Mostly Full)', '25% Elapsed · 75% Left', 'Finish setup/intro and transition into your core task'],
      ['1 : 1 (Equal Bulb Levels)', '50% Exact Halfway Mark', 'Check milestone progress; switch sides in partner exercises'],
      ['1 : 3 (Bottom Mostly Full)', '75% Elapsed · 25% Left', 'Begin synthesis, review, or final round of turns'],
    ],
    fieldNotes: [
      { label: 'Instant Halfway Visual Check', note: 'Your eye is extraordinarily good at comparing the height of two adjacent triangles—making it effortless to spot the 50% mark.' },
      { label: 'Fullscreen Projector Clarity', note: 'Press `F` to scale the hourglass vector to full viewport height with zero pixelation.' },
    ],
  },
  'circular-timer': {
    kicker: '360-DEGREE RADIAL RING COUNTDOWN',
    leadHeading: 'Why a 360-Degree Circular Ring Is the Cleanest Way to Read Time on Any Screen',
    leadParagraphs: [
      'Because humans have read 12-hour analog clock faces for centuries, our visual cortex automatically interprets a 90-degree quarter arc as "one quarter left" and a 180-degree half circle as "halfway there"—even when the total duration is 7 minutes or 45 minutes instead of 60.',
      'This Circular Timer pairs a smooth, thick SVG progress ring with centered tabular digits, giving you both instant geometric proportion and exact second precision.',
    ],
    viewingDistance: 'Universal: smartwatch-sized split window up to 50-foot auditorium screens',
    ambientContrast: 'High-contrastemerald/amber/coral ring track against a clean neutral dial',
    sensoryNote: 'Uses sub-pixel SVG `stroke-dashoffset` interpolation for jitter-free 60fps ring movement.',
    routines: [
      { title: '25-Minute Focused Coding / Study Ring', timing: '25:00 Split Window', setup: 'Dock in the corner of your monitor; read the quarter-ring marks at 18:45, 12:30, and 06:15.' },
      { title: '60-Second Gym Rest & Plank Ring', timing: '01:00 Mobile Stand', setup: 'Watch the ring close its final quarter arc during the last 15 seconds of a plank hold.' },
      { title: '10-Minute Stand-Up Meeting Cap', timing: '10:00 Screen Share', setup: 'Keep the ring visible on the team dashboard so updates wrap before the circle closes.' },
    ],
    tableTitle: '360° Ring Quadrant Pacing Guide',
    tableColumns: ['Ring Arc Remaining', 'Clock-Face Position', 'Pacing Meaning'],
    tableRows: [
      ['270° (Three-Quarters Ring)', '9 o’clock position', 'First 25% complete—warm-up/context phase should be finished'],
      ['180° (Half Ring)', '6 o’clock bottom mark', 'Exact 50% midpoint—check that you are halfway through your agenda'],
      ['90° (Final Quarter Arc)', '3 o’clock to 12 o’clock', 'Final 25% sprint—move to review, Q&A, or final set'],
    ],
    fieldNotes: [
      { label: 'Universal Analog Intuition', note: 'Even when set to an odd duration like 14 minutes, anyone in the room immediately recognizes when a quarter circle is left.' },
      { label: 'Crisp Vector Scaling at 4K', note: 'Because the ring is rendered as pure SVG geometry, it stays razor-sharp on 4K TVs and Retina projectors.' },
    ],
  },
  'radial-timer': {
    kicker: 'SUNBURST TICK-SEGMENT VISUAL TIMER',
    leadHeading: 'Counting Down Discrete Segments with a Precision Radial Sunburst Dial',
    leadParagraphs: [
      'Sometimes a smooth continuous ring feels too subtle when you want to see discrete steps clicking off—like the 60 chapter markers around a chronometer bezel or the individual spokes of a broadcast countdown wheel.',
      'This Radial Timer divides your entire duration into crisp radiating tick segments around a central digital core, extinguishing each spoke in sequence so you can judge progress both by overall arc and by individual remaining ticks.',
    ],
    viewingDistance: 'Broadcast control rooms, gyms, and classrooms (5–40 ft)',
    ambientContrast: 'Illuminated active spokes vs. muted track spokes for zero-ambiguity reading',
    sensoryNote: 'Each spoke represents an exact equal fraction (`1/N`) of your total configured duration.',
    routines: [
      { title: 'Broadcast & Podcast Intro Countdown', timing: '01:00 – 03:00 Studio', setup: 'Watch the final spokes extinguish cleanly down to the top-of-the-hour mic cue.' },
      { title: 'HIIT & Circuit Station Pacing', timing: '00:45 or 01:00 Gym', setup: 'Athletes can count the final 5 spokes visually even over loud gym music.' },
      { title: 'Timed Quiz & Flashcard Drill', timing: '05:00 – 10:00 Desk', setup: 'Use the segmented dial to allocate equal spokes per test question.' },
    ],
    tableTitle: 'How Radial Spokes Map to Different Durations',
    tableColumns: ['Configured Duration', 'Time Value per Quarter of Spokes', 'How to Pace Using the Dial'],
    tableRows: [
      ['60 Seconds (01:00)', '15 seconds per quadrant', 'Each spoke extinguishes at a brisk, visible beat for sprint drills'],
      ['12 Minutes (12:00)', '3 minutes per quadrant', 'Use each quadrant for one 3-minute station or agenda topic'],
      ['24 Minutes (24:00)', '6 minutes per quadrant', 'Allocate 1 quadrant to planning, 2 to drafting, and 1 to editing'],
    ],
    fieldNotes: [
      { label: 'Color-Blind Friendly Spoke Contrast', note: 'Because extinguished spokes change both luminance and opacity against the active arc, the dial is readable without relying on hue alone.' },
      { label: 'Great for Loud Environments', note: 'When music or machinery masks audio beeps, discrete extinguishing spokes provide a clear visual rhythm.' },
    ],
  },
  'rings-timer': {
    kicker: 'MULTI-LAYER CONCENTRIC ACTIVITY RINGS',
    leadHeading: 'Tracking Macro Progress and Micro Seconds Simultaneously with Concentric Rings',
    leadParagraphs: [
      'On a long 30-minute or 60-minute countdown, a single circular ring moves so slowly that you can’t tell at a glance whether the timer is actively running or paused. Conversely, a fast 60-second ring spins every minute without showing total session progress.',
      'The Concentric Rings Timer solves both problems at once by nesting three synchronized rings—an outer ring for overall session completion, a middle ring for minute/phase progress, and an inner cadence ring that sweeps smoothly.',
    ],
    viewingDistance: 'Desktop dashboards, fitness studios, and smartboards (3–35 ft)',
    ambientContrast: 'Tri-color high-contrast concentric tracks (Emerald, Sky Blue, Warm Amber)',
    sensoryNote: 'All three rings derive their exact angle from the same monotonic timestamp delta.',
    routines: [
      { title: '45-Minute Deep Work & Study Block', timing: '45:00 Desktop', setup: 'The outer ring tracks the full 45m block while the inner rings confirm active minute cadence.' },
      { title: '30-Minute Group Fitness Circuit', timing: '30:00 Wall TV', setup: 'Athletes see both the current minute revolution and how far through the 30-minute class they are.' },
      { title: 'Multi-Part Exam Pacing', timing: '60:00 Lecture Hall', setup: 'Students track both minute-by-minute pace and overall exam progress.' },
    ],
    tableTitle: 'How the Three Concentric Rings Work Together',
    tableColumns: ['Ring Layer', 'What It Tracks', 'Why It Helps Your Pacing'],
    tableRows: [
      ['Outer Ring (Emerald)', 'Total Session Completion (100% → 0%)', 'Shows macro progress across the entire 15m, 30m, or 60m block'],
      ['Middle Ring (Sky Blue)', 'Current Phase / Minute Sub-Cycle', 'Breaks long blocks into digestible intermediate revolutions'],
      ['Inner Ring (Warm Amber)', 'Immediate Cadence Sweep', 'Confirms at a glance that the timer is actively running'],
    ],
    fieldNotes: [
      { label: 'Closing Your Focus Rings', note: 'Inspired by wearable fitness rings, watching all three concentric tracks align at `00:00` provides a satisfying visual reward.' },
      { label: 'Best Choice for Long (>20 Min) Timers', note: 'Whenever a single ring moves too slowly to perceive motion, switch to Concentric Rings.' },
    ],
  },
  'progress-timer': {
    kicker: 'LINEAR HORIZONTAL PROGRESS BAR & PERCENTAGE',
    leadHeading: 'Pacing Sequential Tasks with a Left-to-Right Linear Progress Bar and Live Percentage',
    leadParagraphs: [
      'When you are working through a linear checklist—like grading 20 papers, answering 30 multiple-choice questions, or running a 4-point meeting agenda—a horizontal progress bar matches the way we read and track sequential milestones better than a round clock.',
      'This Progress Bar Timer pairs a wide horizontal fill bar with a live `0%–100%` percentage counter and `Elapsed vs. Remaining` readout so you can compare your task completion percentage directly against your time percentage.',
    ],
    viewingDistance: 'Top/bottom of a laptop screen, webinar overlay, or classroom board (2–40 ft)',
    ambientContrast: 'Wide high-contrast ribbon with clear quarter-mark milestone ticks (25%, 50%, 75%)',
    sensoryNote: 'Displays both `Elapsed` and `Remaining` time alongside the exact completion percentage.',
    routines: [
      { title: 'Timed Practice Test (Compare % Done vs. % Time)', timing: '30:00 – 60:00 Desk', setup: 'When the bar hits 50%, check that you are on Question 15 of 30.' },
      { title: 'Batch Grading & Inbox Triage', timing: '20:00 Sprint', setup: 'Pace yourself through 20 items by staying ahead of the percentage counter (5% per item).' },
      { title: 'Workshop & Webinar Progress Ribbon', timing: '15:00 – 45:00 Screen Share', setup: 'Give attendees a familiar software-style progress bar during training modules.' },
    ],
    tableTitle: 'Matching Task Milestones to Progress Bar Percentages',
    tableColumns: ['Bar Percentage', 'Time Split (on 40m Block)', 'Milestone Audit Check'],
    tableRows: [
      ['25% Complete', '10:00 Elapsed · 30:00 Left', 'Quarter of your test questions or checklist items should be done'],
      ['50% Complete', '20:00 Elapsed · 20:00 Left', 'Halfway checkpoint—adjust speed if task progress is below 50%'],
      ['75% Complete', '30:00 Elapsed · 10:00 Left', 'Begin final section or transition to review and proofreading'],
    ],
    fieldNotes: [
      { label: 'The "Beat the Percentage" Productivity Game', note: 'If you have 10 emails to reply to in 20 minutes (10% per email), racing to stay 10% ahead of the progress bar turns dull admin work into a fast game.' },
      { label: 'Clean Horizontal Geometry for Wide Screens', note: 'On 16:9 projectors and ultrawide monitors, a horizontal bar uses screen width far more efficiently than a circle.' },
    ],
  },
  'pixel-timer': {
    kicker: '10×10 GRID MATRIX & RETRO ARCADE TIMER',
    leadHeading: 'Turning Every 1% of Your Countdown Into a Visible Pixel Tile on a 10×10 Grid',
    leadParagraphs: [
      'A 10×10 pixel matrix contains exactly **100 tiles**—which means each glowing LED tile on the board represents **1% of your total time**. Whether you set the timer for 100 seconds (1 second per pixel) or 25 minutes (15 seconds per pixel), watching the 100-tile grid clear row by row makes percentage math visual and concrete.',
      'This Pixel Timer combines retro 8-bit LED matrix charm with exact 100-unit proportional math—making it a favorite for coding sprints, elementary math classrooms, and gamified study sessions.',
    ],
    viewingDistance: 'Desk setup, streaming overlay, or classroom smartboard (2–35 ft)',
    ambientContrast: 'Recessed dark LED matrix frame with vibrant 5-row spectrum pixel tiles',
    sensoryNote: '100 discrete LED tiles = 1% per tile; zero dizzying fast motion.',
    routines: [
      { title: '100-Second Lightning Math or Coding Challenge', timing: '01:40 (100 Seconds)', setup: 'Set to 1 minute 40 seconds so every single pixel tile equals exactly 1 second.' },
      { title: '25-Minute Gamified Study Quest', timing: '25:00 (15s per Pixel)', setup: 'Each row of 10 pixels equals 2.5 minutes of focused study.' },
      { title: 'Elementary Percentage & Decimals Lesson', timing: '05:00 Classroom', setup: 'Show students visually how 3 rows of 10 pixels equals 30/100 (30%).' },
    ],
    tableTitle: '10×10 Pixel Grid Math Across Common Durations',
    tableColumns: ['Total Duration', 'Time per Single Pixel (1%)', 'Time per Full Row of 10 Pixels (10%)'],
    tableRows: [
      ['100 Seconds (01:40)', '1.0 second per pixel', '10 seconds per row'],
      ['5 Minutes (300s)', '3.0 seconds per pixel', '30 seconds per row'],
      ['10 Minutes (600s)', '6.0 seconds per pixel', '1 minute per row'],
      ['25 Minutes (1,500s)', '15.0 seconds per pixel', '2 minutes 30 seconds per row'],
    ],
    fieldNotes: [
      { label: 'Why 100 Tiles Teaches Number Sense Automatically', note: 'Elementary teachers love using the 10×10 grid to reinforce base-10 place value (`10 rows × 10 columns = 100%`) during everyday classroom transitions.' },
      { label: 'Naturally Low Motion for Sensory Comfort', note: 'Because tiles step discretely rather than spinning continuously, pixel grids feel calm and grounded.' },
    ],
  },
  'blocks-timer': {
    kicker: '3D STACKED BUILDING BLOCKS COUNTDOWN',
    leadHeading: 'Breaking Tasks Into Manageable Chunks with Disappearing 3D Building Blocks',
    leadParagraphs: [
      'When a child or student with executive dysfunction hears "you have 15 minutes to finish your worksheet," 15 minutes feels like an amorphous wall of time. Breaking that same 15 minutes into **5 or 6 stacked building blocks** (where each block equals one 3-minute mini-goal) immediately makes the task approachable.',
      'This Blocks Timer renders a colorful stack of 3D isometric blocks that clear from the top down as your session progresses—turning time management into concrete, bite-sized chunks.',
    ],
    viewingDistance: 'Elementary smartboard, therapy table, or study desk (2–35 ft)',
    ambientContrast: 'Tactile 3D isometric blocks with distinct top, front, and side shading',
    sensoryNote: 'Each block in the stack represents one clear sub-segment of the total timer.',
    routines: [
      { title: 'Chunked Homework Worksheet (1 Block per Section)', timing: '12:00 – 18:00 Desk', setup: 'Match the number of worksheet sections to the block stack so the student races one block at a time.' },
      { title: 'Preschool & Kindergarten Playroom Cleanup', timing: '06:00 Smartboard', setup: 'Assign each block color a cleanup zone (Red = books, Orange = blocks, Yellow = crayons).' },
      { title: 'Agile Retro or Brainstorm Topic Stack', timing: '15:00 Team Screen', setup: 'Spend one block per discussion prompt so no single topic eats the whole meeting.' },
    ],
    tableTitle: 'Using Stacked Blocks for Task Chunking',
    tableColumns: ['Total Timer', 'Time per Block (6-Block Stack)', 'How to Assign Sub-Tasks'],
    tableRows: [
      ['6 Minutes (06:00)', '1 minute per block', '6 rapid 1-minute clean-up or warm-up drills'],
      ['12 Minutes (12:00)', '2 minutes per block', '6 short math problems or vocabulary flashcards'],
      ['18 Minutes (18:00)', '3 minutes per block', 'Drafting a 5-paragraph essay (1 block per paragraph + 1 review)'],
      ['30 Minutes (30:00)', '5 minutes per block', '6 five-minute station rotations or study modules'],
    ],
    fieldNotes: [
      { label: 'Why Executive Function Coaches Use "Block Chunking"', note: 'Finishing the first block gives an immediate dopamine win at the 1/6th mark, preventing early task abandonment.' },
      { label: 'Assigning Colors to Specific Sub-Steps', note: 'Tell students: "While we are on the red top block, write your name and read the prompt; when we reach orange, start Question 1."' },
    ],
  },
  'candle-timer': {
    kicker: 'MELTING WAX PILLAR & MEDITATION FLAME',
    leadHeading: 'Using King Alfred’s Ancient Melting Candle Clock for Calm Writing and Meditation',
    leadParagraphs: [
      'Over a thousand years ago, Anglo-Saxon and Chinese scholars measured night study and prayer with graduated wax candles: as the tallow melted down past each ring mark, an hour had passed. There were no ticking gears, no harsh bells, and no glowing blue digits.',
      'This digital Candle Timer revives that tranquil ritual—rendering a forest-green or warm beeswax pillar candle whose wax column melts smoothly downward while a gentle flame sways at the wick until extinguishing softly at `00:00`.',
    ],
    viewingDistance: 'Writing desk, yoga/meditation mat, or quiet reading corner (2–20 ft)',
    ambientContrast: 'Warm amber candlelight glow with zero harsh blue-light glare',
    sensoryNote: 'Wax pillar height scales linearly from 100% to 0% as the countdown progresses.',
    routines: [
      { title: 'Morning Pages & Freewriting Ritual', timing: '20:00 Candlelight Mode', setup: 'Start the candle timer with your morning coffee and write continuously until the wax melts down.' },
      { title: 'Trataka (Candle Gazing) & Breath Meditation', timing: '10:00 Silent Mode', setup: 'Soften your gaze on the gentle flame tip to anchor attention without checking a phone.' },
      { title: 'Evening Screen Wind-Down', timing: '30:00 Before Bed', setup: 'Use as a calm visual signal to close laptops and read a physical book.' },
    ],
    tableTitle: 'Candle Height Milestones During a Focus Session',
    tableColumns: ['Wax Pillar Height', 'Session Stage', 'Mindful Focus Cue'],
    tableRows: [
      ['Tall Full Pillar (100% → 70%)', 'Settling In', 'Release external distractions and establish a steady writing or breathing rhythm'],
      ['Mid-Pillar (70% → 30%)', 'Deep Absorption', 'Stay immersed in the flow without checking word counts or messages'],
      ['Low Wax Stump (30% → 0%)', 'Gentle Landing', 'Bring your current thought or meditation softly to a close as the flame dims'],
    ],
    fieldNotes: [
      { label: 'Safe Candlelight Ambience in Dorms & Classrooms', note: 'Delivers the cozy psychological cue of a real desk candle in classrooms, libraries, and dorm rooms where open flames are prohibited.' },
      { label: 'Pair with Soft Chime or Silent Extinguish', note: 'For meditation, mute the completion sound so the flame simply goes out quietly at `00:00`.' },
    ],
  },
  'aesthetic-timer': {
    kicker: 'MINIMALIST STUDYGRAM & LO-FI DESK TIMER',
    leadHeading: 'Creating a Calm, Distraction-Free Desk Aesthetic for Deep Study and "Study With Me" Streams',
    leadParagraphs: [
      'Standard utility timers often look like industrial kitchen appliances or harsh neon gym clocks—clashing with a thoughtfully arranged wooden desk, warm lamp, and fountain-pen notebook.',
      'This Aesthetic Timer is designed specifically for deep-focus desk setups and "Study With Me" video streams, blending warm archival paper tones, soft terracotta and sage accents, and unhurried typography that keeps your workspace serene.',
    ],
    viewingDistance: 'Desk iPad stand, secondary monitor, or OBS livestream overlay (1.5–10 ft)',
    ambientContrast: 'Warm cream, matcha sage, and oat neutral palette with soft contrast',
    sensoryNote: 'Engineered for zero visual clutter during multi-hour study marathons.',
    routines: [
      { title: '50-Minute "Study With Me" Stream Block', timing: '50:00 Fullscreen iPad', setup: 'Place your tablet beside your textbook in landscape fullscreen for a clean camera-ready frame.' },
      { title: '25-Minute Café Writing Session', timing: '25:00 Silent or Soft Chime', setup: 'Run in a compact split window alongside Notion, Obsidian, or Scrivener.' },
      { title: '15-Minute Evening Desk Reset', timing: '15:00 Warm Palette', setup: 'Clear your desk, review tomorrow’s planner, and pack your bag before the arc completes.' },
    ],
    tableTitle: 'Aesthetic Palette Pairing for Your Desk Environment',
    tableColumns: ['Workspace Lighting', 'Recommended Timer Mode', 'Why It Reduces Eye Fatigue'],
    tableRows: [
      ['Daylight / Sunny Window Desk', 'Warm Cream & Terracotta Light Mode', 'Matches natural paper reflectance so your pupils don’t constrict switching from book to screen'],
      ['Evening Warm Desk Lamp (2700K)', 'Deep Forest & Espresso Dark Mode', 'Eliminates stark white screen glare in dim evening rooms'],
      ['OBS / YouTube Livestream Overlay', 'Fullscreen Minimalist View (`F`)', 'Hides all browser toolbars so only the clean dial and time appear on camera'],
    ],
    fieldNotes: [
      { label: 'Matching Paper Book Brightness', note: 'When studying from physical textbooks under daylight, warm cream mode (`#FAF5EC`) prevents the contrast shock of looking back and forth at a black screen.' },
      { label: 'One-Key Fullscreen Toggle (`F`)', note: 'Tap `F` to enter pure studio display mode with only the visual dial and a discreet corner exit button.' },
    ],
  },
  'picture-reveal-timer': {
    kicker: 'GAMIFIED MYSTERY IMAGE UNLOCK TIMER',
    leadHeading: 'Turning Classroom Transitions and Waiting Time Into a Mystery Picture Reveal Game',
    leadParagraphs: [
      'When you tell a 1st-grade class "sit quietly for 3 minutes while we wait for the assembly," three minutes feels like three hours. When you project a hidden mystery picture covered by tiles that vanish one by one as the timer counts down, every student’s eyes lock onto the board to guess what animal or landmark is emerging.',
      'This Picture Reveal Timer lets you pick from curated classroom illustrations—or upload your own custom photo right from your device (stored 100% locally in browser memory)—turning any countdown into an engaging visual reward.',
    ],
    viewingDistance: 'Classroom smartboard (10–35 ft) or pediatric/speech therapy tablet',
    ambientContrast: 'Progressive tile/blur reveal synchronized to exact countdown completion',
    sensoryNote: 'Uploaded photos use local `URL.createObjectURL` memory only and are never uploaded to any server.',
    routines: [
      { title: 'Lesson Hook "Guess Today’s Topic"', timing: '02:00 – 03:00 Smartboard', setup: 'Upload a photo of a volcano, historical artifact, or book cover; students unpack while tiles reveal the clue.' },
      { title: 'Speech & Occupational Therapy Reward', timing: '05:00 Tablet', setup: 'Upload a picture of the child’s favorite dinosaur or train that unlocks as they finish their articulation reps.' },
      { title: 'Morning Bell-Ringer Warmup', timing: '04:00 Fullscreen', setup: 'By `00:00`, the full image is revealed and the class discusses how it connects to the day’s lesson.' },
    ],
    tableTitle: 'Creative Classroom Ways to Use Picture Reveal',
    tableColumns: ['Subject / Routine', 'What Image to Load', 'How Students Engage as Tiles Clear'],
    tableRows: [
      ['Science / Geography Hook', 'Satellite map, animal close-up, or planet', 'Students write silent hypotheses on mini whiteboards at 25%, 50%, and 75% reveal'],
      ['Elementary Vocabulary / Phonics', 'Object starting with the target blend', 'Early finishers quietly sound out the word as the center tiles unlock'],
      ['Special Ed / ABA Reinforcement', 'Preferred interest photo (trains, space, pets)', 'Provides continuous visual reinforcement throughout a 5-minute table task'],
    ],
    fieldNotes: [
      { label: '100% Private Local Photo Handling', note: 'When you select a photo from your computer or iPad, it stays strictly inside your local browser tab (`Blob URL`)—making it completely safe for classroom use.' },
      { label: 'Wait Until 50% Before Taking Verbal Guesses', note: 'Ask students to keep guesses silent until the timer crosses the halfway mark so everyone stays focused on their bell-ringer task first.' },
    ],
  },
  'heart-timer': {
    kicker: 'WELLNESS, GRATITUDE & COHERENCE TIMER',
    leadHeading: 'Pacing Heart-Centered Breathwork, Gratitude Journaling, and Self-Care Breaks',
    leadParagraphs: [
      'Wellness coaching, loving-kindness (*metta*) meditation, and therapy check-ins call for a softer visual presence than a stopwatch or industrial bar chart.',
      'This Heart Timer pairs a calm, proportional heart vessel visualization with a precision countdown engine—providing a gentle visual anchor for 5-minute coherent breathing resets, therapy reflections, and classroom kindness circles (note: this is a visual countdown timer, not a biometric heart-rate sensor).',
    ],
    viewingDistance: 'Personal phone/tablet (1.5–4 ft) or wellness studio screen (up to 25 ft)',
    ambientContrast: 'Warm rose and soft blush palette with dark-mode plum support',
    sensoryNote: 'Purely a decorative time visualization; respects `prefers-reduced-motion` preferences.',
    routines: [
      { title: '5-Minute Coherent Breathing (5.5s In / 5.5s Out)', timing: '05:00 Silent Mode', setup: 'Use the calm heart visual as your focal point while taking 5 to 6 slow breaths per minute.' },
      { title: 'Morning Gratitude & Reflection Journal', timing: '10:00 Desk Stand', setup: 'Write three specific things you appreciate today before the heart timer finishes.' },
      { title: 'Classroom SEL (Social-Emotional Learning) Circle', timing: '02:00 per Student Share', setup: 'Pass the talking piece around the circle with a gentle 2-minute heart timer per share.' },
    ],
    tableTitle: 'Wellness & SEL Routines for the Heart Timer',
    tableColumns: ['Practice', 'Recommended Duration', 'Setup & Facilitation Tip'],
    tableRows: [
      ['Heart-Coherence Breathing Reset', '03:00 – 05:00', 'Mute audio chime or use soft bell; inhale smoothly through the nose'],
      ['Loving-Kindness (Metta) Meditation', '10:00 – 15:00', 'Divide the heart fill into self, loved ones, neutral people, and community'],
      ['Therapy / Counseling Check-In', '05:00 – 10:00', 'Gives couples or group participants equal, non-threatening speaking windows'],
    ],
    fieldNotes: [
      { label: 'Clarification: Visual Countdown vs. Biometric Monitor', note: 'The rhythm and fill of the Heart Timer reflect your countdown clock settings only—it does not measure pulse or medical heart rate.' },
      { label: 'Ideal for SEL Morning Meetings', note: 'Elementary counselors use the heart visual to signal a supportive, non-competitive sharing window.' },
    ],
  },
  'moon-timer': {
    kicker: 'NIGHT SKY & LUNAR PHASE VISUAL TIMER',
    leadHeading: 'Winding Down Evening Study and Sleep Routines Under a Deep-Indigo Lunar Sky',
    leadParagraphs: [
      'Staring at a bright white browser tab at 10:00 PM suppresses melatonin and leaves your eyes wired right before bed. Evening study, bedtime reading with kids, and astronomy club sessions need a timer built natively for dark rooms.',
      'This Moon Phase Timer renders an illuminated lunar orb set against a deep midnight-indigo starfield (`#071020`), tracking your countdown through smooth lunar shadow phases without casting harsh glare into a dark bedroom or planetarium.',
    ],
    viewingDistance: 'Bedside tablet, evening desk monitor, or darkened classroom (2–30 ft)',
    ambientContrast: 'Deep-indigo night sky with warm gold/silver lunar illumination',
    sensoryNote: 'Designed natively as a low-luminance night-mode canvas to protect dark adaptation.',
    routines: [
      { title: '30-Minute Pre-Sleep Reading Wind-Down', timing: '30:00 Bedside Stand', setup: 'Dim your screen to 30% brightness and read a physical book until the moon cycle completes.' },
      { title: 'Kids’ Bedtime Routine (Pajamas, Teeth, Story)', timing: '15:00 Bedroom', setup: 'Children love racing calmly to get tucked into bed before the moon reaches its final phase.' },
      { title: 'Astronomy & Dark-Room Lab Timing', timing: '10:00 – 20:00 Lab', setup: 'Preserve night vision during telescope viewing or photography darkroom steps.' },
    ],
    tableTitle: 'Lunar Countdown Phases & Evening Pacing',
    tableColumns: ['Moon Illumination Stage', 'Countdown Progress', 'Evening Routine Checkpoint'],
    tableRows: [
      ['Full / Gibbous Moon (100% → 50%)', 'First Half of Timer', 'Finish evening journaling, packing tomorrow’s bag, or story chapter 1'],
      ['Quarter Moon (50% Mark)', 'Exact Halfway Point', 'Transition to quiet reading or guided relaxation'],
      ['Crescent → New Moon (25% → 0%)', 'Final Wind-Down', 'Close books, turn off lamps, and settle in for sleep at 00:00'],
    ],
    fieldNotes: [
      { label: 'Preserving Melatonin in the Final Hour Before Sleep', note: 'Pairing the dark indigo lunar canvas with warm Night Shift / f.lux display settings minimizes blue-light exposure after 9:00 PM.' },
      { label: 'Silent Completion for Sleep Meditation', note: 'When using the Moon Timer to fall asleep to breathwork or audiobooks, set the completion alert to Silent so `00:00` never wakes you.' },
    ],
  },
  'sun-timer': {
    kicker: 'SOLAR HORIZON ARC & DAYLIGHT TIMER',
    leadHeading: 'Tracking Your Session Across a Natural Sunrise-to-Sunset Horizon Arc',
    leadParagraphs: [
      'For hundreds of thousands of years, the human brain calibrated time by the height and warmth of the sun’s arc across the sky—rising in crisp morning gold, peaking at high noon, and settling into warm sunset amber at the horizon.',
      'This Sun Arc Timer maps your countdown to a solar journey from dawn to dusk: you know you are at the exact halfway mark when the sun reaches its zenith at the top of the sky, and you feel the natural wrap-up cue as the sky warms into sunset.',
    ],
    viewingDistance: 'Morning classroom smartboard, yoga studio, or desk monitor (3–40 ft)',
    ambientContrast: 'Dynamic sky gradient transitioning from morning gold to midday azure to sunset amber',
    sensoryNote: 'Sun position along the 180° sky parabola is locked to exact elapsed time percentage.',
    routines: [
      { title: 'Morning Classroom Arrival & Bell-Ringer', timing: '10:00 – 15:00 Smartboard', setup: 'Start the sun arc as the first bell rings; morning announcements begin when the sun sets.' },
      { title: 'Morning Yoga & Sun Salutation Practice', timing: '20:00 – 30:00 Studio', setup: 'Peak vinyasa flow at solar noon (50%), then transition to cool-down and savasana at sunset.' },
      { title: 'Daylight Productivity Sprint', timing: '45:00 Desk Monitor', setup: 'Use the intuitive sky color shift to pace drafting without watching digital numbers.' },
    ],
    tableTitle: 'Solar Arc Positions & Session Pacing',
    tableColumns: ['Sky Position', 'Session Progress', 'Natural Pacing Action'],
    tableRows: [
      ['Sunrise Ascent (Left Horizon → Top)', '0% – 40% Elapsed', 'Warm up, set out materials, and build momentum on core work'],
      ['Solar Zenith (Top Center Peak)', '50% Exact Midpoint', 'Halfway check—pivot from first half of task to second half'],
      ['Golden Hour Sunset (Right Horizon)', '80% – 100% Elapsed', 'Sky turns warm amber—summarize notes, stretch, or clean up station'],
    ],
    fieldNotes: [
      { label: 'Why Peripheral Sky Color Shifts Work So Well', note: 'Even without looking directly at the sun orb, the background sky warming from daylight blue to golden-hour amber tells your peripheral vision that 80% of the time is gone.' },
      { label: 'Great for Morning Routines with Kids', note: 'Use a 20-minute Sun Timer at the breakfast table so kids know shoes and backpacks must be on before sunset.' },
    ],
  },
  'bubble-timer': {
    kicker: 'EFFERVESCENT AQUATIC BUBBLE STREAM TIMER',
    leadHeading: 'Using Rising Aquatic Bubbles and Water Levels for Playful, Calming Time Cues',
    leadParagraphs: [
      'Pediatric occupational therapists and early-childhood educators know that rising water bubbles hold a child’s visual attention effortlessly without triggering the stress of a ticking red clock.',
      'This Bubble Timer combines a buoyant stream of rising translucent bubbles with a clear aquatic water level that recedes smoothly from 100% to 0%—giving you both calming upward motion and an honest visual readout of remaining time.',
    ],
    viewingDistance: 'Pediatric therapy tablet, bathroom counter, or K–2 smartboard (2–30 ft)',
    ambientContrast: 'Crisp aqua-marine gradients with specular bubble highlights',
    sensoryNote: 'Water column height tracks exact remaining seconds; bubble drift honors Reduced Motion.',
    routines: [
      { title: 'Handwashing & Toothbrushing Hygiene', timing: '00:30 or 02:00 Sink Side', setup: '30 seconds for thorough soap-and-water handwashing or 2 minutes for brushing teeth.' },
      { title: 'Pediatric Speech & OT Turn-Taking', timing: '03:00 – 05:00 iPad', setup: 'Use the soothing bubble stream to keep young learners engaged through structured table drills.' },
      { title: '4-7-8 Deep Breathing Pacer', timing: '03:00 Silent Mode', setup: 'Let tension float upward and release like rising bubbles on every slow exhale.' },
    ],
    tableTitle: 'Pediatric & Classroom Uses for the Bubble Timer',
    tableColumns: ['Routine', 'Recommended Time', 'Why the Bubble Visual Works'],
    tableRows: [
      ['Thorough Handwashing (CDC Standard)', '00:20 – 00:30', 'Soap bubbles on hands match the rising bubbles on screen'],
      ['Sensory Corner Calm-Down', '03:00 – 05:00', 'Upward floating motion slows eye tracking and reduces frustration'],
      ['Pre-K Center Cleanup', '05:00 Fullscreen', 'Children race gently to finish before the water tank empties'],
    ],
    fieldNotes: [
      { label: 'Dual Cue: Rising Bubbles + Draining Tank', note: 'While the bubbles float upward for sensory calm, the overall water line drops steadily so you always know how close `00:00` is.' },
      { label: 'Fullscreen Horizontal Mode on Tablets', note: 'Tap `F` on an iPad to fill the entire screen with the aquatic chamber.' },
    ],
  },
  'coral-timer': {
    kicker: 'MARINE REEF & OCEAN ECOSYSTEM TIMER',
    leadHeading: 'Bringing Calm Aquarium Reef Ambience to Science Classrooms and Study Desks',
    leadParagraphs: [
      'There is a documented reason waiting rooms and classrooms keep saltwater reef aquariums: watching swaying coral polyps and gentle underwater light caustics measurably lowers heart rate and baseline restlessness.',
      'This Coral Reef Timer pairs a vibrant living reef illustration with a synchronized ocean countdown—making it a favorite for marine biology classrooms, quiet reading blocks, and low-stress work sessions.',
    ],
    viewingDistance: 'Classroom smartboard (10–35 ft) or study desk monitor',
    ambientContrast: 'Warm living-coral terracotta and sea-fan tones against deep pelagic teal',
    sensoryNote: 'Synchronized to monotonic clock math so reef progression never drifts in background tabs.',
    routines: [
      { title: 'Science Lab & Biology Station Rotation', timing: '12:00 – 15:00 Smartboard', setup: 'Project during microscope labs or marine ecology units for thematic timing.' },
      { title: '20-Minute Independent Reading Block', timing: '20:00 Silent Mode', setup: 'Create a calm underwater library atmosphere on the front projector.' },
      { title: '5-Minute Desk Decompression Break', timing: '05:00 Fullscreen', setup: 'Step back from spreadsheets and rest your eyes on the ocean reef scene.' },
    ],
    tableTitle: 'Reef Timer Settings by Learning Environment',
    tableColumns: ['Setting', 'Duration Range', 'Recommended Configuration'],
    tableRows: [
      ['Elementary Science / Reading Block', '10:00 – 20:00', 'Fullscreen projection (`F`) with soft completion chime'],
      ['Quiet Sensory / Counseling Office', '05:00 – 10:00', 'Silent completion mode with Reduced Motion optional'],
      ['Personal Study / Pomodoro Sprint', '25:00', 'Keep digital `MM:SS` readout visible for structured study'],
    ],
    fieldNotes: [
      { label: 'Complementary Coral-on-Teal Contrast', note: 'Because warm coral (`#F35B4F`) and deep ocean teal sit opposite each other on the color wheel, the progress state is effortless to read from the back row.' },
      { label: 'Zero Audio Clutter', note: 'Runs silently throughout the countdown and plays a single clean chime only when time expires.' },
    ],
  },
  'lichen-timer': {
    kicker: 'BOTANICAL MOSS & BIOPHILIC STUDIO TIMER',
    leadHeading: 'Designing a Grounded, Biophilic Study Space with Forest Lichen and Moss Tones',
    leadParagraphs: [
      'Most digital interfaces scream for your attention with saturated reds and electric blues. Biophilic design takes the opposite approach: drawing on woodland moss, stone lichen, and sage foliage to keep your visual cortex relaxed during multi-hour deep work.',
      'This Lichen & Woodland Moss Timer maps your countdown to organic botanical growth rings on a muted stone-and-fern canvas—built for writers, architects, researchers, and nature classrooms.',
    ],
    viewingDistance: 'Personal writing monitor, studio tablet, or botany classroom (2–30 ft)',
    ambientContrast: 'Earthy woodland sage, mineral slate, and lichen moss palette',
    sensoryNote: 'Ultra-low glare luminance profile prevents eye fatigue during long 45–60 minute blocks.',
    routines: [
      { title: '45-Minute Deep Writing or Research Block', timing: '45:00 Desk Monitor', setup: 'Dock beside your manuscript for a zero-glare, nature-grounded timer.' },
      { title: 'Botany & Environmental Science Lab', timing: '15:00 Classroom Board', setup: 'Time specimen observation or field-journal sketching.' },
      { title: '10-Minute Tea & Eye-Rest Break', timing: '10:00 Fullscreen', setup: 'Look away from dense text and let your eyes rest on soft green wavelengths.' },
    ],
    tableTitle: 'Why Biophilic Green Palettes Support Sustained Focus',
    tableColumns: ['Visual Property', 'Lichen & Moss Palette', 'High-Saturation Standard Timers'],
    tableRows: [
      ['Spectral Wavelength', '520nm–560nm middle-spectrum greens (lowest retinal cone strain)', 'High-energy blue/red extremes that fatigue photoreceptors'],
      ['Peripheral Distraction', 'Organic botanical progression blends into a calm desk setup', 'Flashy UI chrome competes with your primary document'],
      ['Best Duration Range', 'Long 25m to 60m deep-work and study blocks', 'Short high-urgency 30s to 3m alerts'],
    ],
    fieldNotes: [
      { label: 'The University of Melbourne "Green Micro-Break" Finding', note: 'Environmental psychology research shows that viewing natural green foliage patterns for even 40 seconds between tasks restores directed attention.' },
      { label: 'Pair with 50/10 Ultradian Study Blocks', note: 'Set for 50 minutes of manuscript or code work followed by a 10-minute walk outdoors.' },
    ],
  },
  'frost-timer': {
    kicker: 'CRYSTALLINE ICE GEOMETRY VISUAL TIMER',
    leadHeading: 'Watching Six-Fold Frost Crystals Branch and Thaw Across Your Countdown',
    leadParagraphs: [
      'Water molecules freeze into hexagonal (`60°` six-fold symmetry) dendritic crystals—forming intricate windowpane frost ferns that grow and thaw along precise geometric branches.',
      'This Frost Crystal Timer turns that natural hexagonal symmetry into a crisp winter countdown: delicate ice dendrites trace across a deep arctic glass pane as your time runs, offering a cool, razor-sharp visual focal point.',
    ],
    viewingDistance: 'Classroom smartboard, chemistry lab, or desktop monitor (3–35 ft)',
    ambientContrast: 'Luminous ice-cyan and silver crystal branches on a deep arctic slate pane',
    sensoryNote: 'Crystal branch growth/thaw is driven directly by elapsed timestamp percentage.',
    routines: [
      { title: 'Winter Classroom Morning Warm-Up', timing: '05:00 – 10:00 Smartboard', setup: 'Project a seasonal frost crystal timer during January/February bell-ringer work.' },
      { title: 'Chemistry & Physics Crystallography Demo', timing: '10:00 Lab Screen', setup: 'Use while timing cooling curves or lab crystallization experiments.' },
      { title: '25-Minute Crisp Focus Sprint', timing: '25:00 Desktop', setup: 'High-contrast ice geometry provides clear visibility in both dark and bright rooms.' },
    ],
    tableTitle: 'Frost Crystal Stages Across Your Countdown',
    tableColumns: ['Countdown Stage', 'Crystal Geometry State', 'Visual Pacing Cue'],
    tableRows: [
      ['100% → 50% Remaining', 'Full Six-Pointed Dendritic Star', 'Core focus window—all six primary arms and side branches illuminated'],
      ['50% → 15% Remaining', 'Inner Hexagonal Plate', 'Outer fern tips recede toward the center hexagon—begin wrapping up'],
      ['Final 15% → 00:00', 'Core Ice Nucleus', 'Final crystal facet clears cleanly at 00:00'],
    ],
    fieldNotes: [
      { label: 'High Contrast on Classroom Projectors', note: 'Because silver-white crystal lines sit on a deep Prussian-blue background (`#1E3654`), even older low-lumen school projectors display the geometry sharply.' },
      { label: 'Zero Flicker Vector Rendering', note: 'Pure geometric SVG lines ensure crisp edges at any zoom level.' },
    ],
  },
  'snow-timer': {
    kicker: 'QUIET WINTER SNOWFALL & DRIFT TIMER',
    leadHeading: 'Creating "Snowfall Quiet" in Busy Classrooms and Study Spaces',
    leadParagraphs: [
      'Anyone who has walked outside during a heavy winter snowfall knows the acoustic hush that settles over a neighborhood—fresh snow absorbs ambient noise and slows down the pace of everything around it.',
      'This Snowfall Timer brings that same peaceful winter stillness to your screen: soft snowflakes drift down as the snowbank level tracks your exact countdown, encouraging quiet voices during independent reading, journaling, and winter classroom centers.',
    ],
    viewingDistance: 'Whole-class smartboard (10–35 ft) or cozy desk monitor',
    ambientContrast: 'Crisp alpine sky with soft white snowflakes and high-legibility digits',
    sensoryNote: 'Automatically pauses flake drift while preserving snow-level progress when Reduced Motion is active.',
    routines: [
      { title: '"Snowfall Silent" Independent Reading', timing: '15:00 – 20:00 Smartboard', setup: 'Tell students: "Keep the room as quiet as falling snow until the timer finishes."' },
      { title: 'Winter Gear & Coat Line-Up Transition', timing: '04:00 Elementary Room', setup: 'Give kids a clear 4-minute countdown to zip coats, boots, and mittens before recess.' },
      { title: 'Cozy Afternoon Study Session', timing: '25:00 – 30:00 Desk', setup: 'Pair with a warm drink for a calm winter study block.' },
    ],
    tableTitle: 'Classroom & Study Routines for the Snowfall Timer',
    tableColumns: ['Activity', 'Suggested Time', 'Why Students Respond to the Snow Visual'],
    tableRows: [
      ['Silent Sustained Reading (SSR)', '15:00 – 20:00', 'Gentle downward flake drift models calm, quiet room energy'],
      ['Recess Snow-Gear Transition', '04:00 – 05:00', 'Turns putting on boots, hats, and gloves into a beat-the-clock routine'],
      ['Creative Winter Story Writing', '10:00 – 15:00', 'Sets an atmospheric visual prompt on the front board'],
    ],
    fieldNotes: [
      { label: 'Why Vertical Downward Drift Calms a Room', note: 'Slow downward vertical motion (`20–40px/sec`) naturally encourages viewers to lower their shoulders and quiet their voice level.' },
      { label: 'Clear Numeric Overlay', note: 'Large tabular numerals stay centered in a high-contrast badge so students never have to squint through the snowflakes.' },
    ],
  },
  'galaxy-timer': {
    kicker: 'DEEP-SPACE SPIRAL NEBULA COUNTDOWN',
    leadHeading: 'Exploring Deep Focus Under a Rotating Cosmic Spiral Galaxy',
    leadParagraphs: [
      'When you are tackling physics problem sets, late-night programming, or a STEM classroom challenge, a deep-space cosmic canvas feels inspiring without blinding your eyes with white light.',
      'This Galaxy Spiral Timer renders a luminous violet-and-gold spiral nebula whose star arms and orbital progress ring track your countdown to the second—built for STEM classrooms, planetarium programs, and night-owl creators.',
    ],
    viewingDistance: 'Darkened desktop studio, STEM lab, or classroom projector (2–40 ft)',
    ambientContrast: 'Deep cosmic void (`#170B30`) with luminous nebula violet, cyan, and starlight gold',
    sensoryNote: 'True dark-first palette prevents screen glare in dim rooms and coding setups.',
    routines: [
      { title: 'Late-Night Coding & Physics Problem Block', timing: '45:00 Dark Mode', setup: 'Run on a secondary monitor in dark mode for zero eye strain at night.' },
      { title: 'STEM & Astronomy Classroom Challenge', timing: '10:00 – 15:00 Smartboard', setup: 'Project during space-science labs, robotics builds, or math competitions.' },
      { title: 'Sci-Fi & Worldbuilding Writing Sprint', timing: '25:00 Fullscreen', setup: 'Set a 25-minute word-count sprint with an inspiring cosmic backdrop.' },
    ],
    tableTitle: 'Galaxy Timer Features for STEM & Night Study',
    tableColumns: ['Feature', 'How It Works', 'Benefit for Users'],
    tableRows: [
      ['Deep-Space Dark Canvas', 'Low-luminance indigo/violet background field', 'Prevents pupil constriction and eye fatigue during evening sessions'],
      ['Proportional Orbital Ring', 'High-contrast outer ring tracks exact 0%–100% countdown', 'Gives crystal-clear progress visibility alongside the nebula artwork'],
      ['Epoch-Synced Engine', 'Calculates remaining time from `Date.now()` delta', 'Never loses a second even when compiling code or running heavy tabs'],
    ],
    fieldNotes: [
      { label: 'Robotics & Makerspace Build Sprints', note: 'Middle and high school STEM coaches use the Galaxy Timer in Fullscreen (`F`) on shop TVs to time 15-minute robot build-and-test rounds.' },
      { label: 'Reduced Motion Mode', note: 'Enabling Reduced Motion pauses nebula rotation while keeping the orbital progress ring and digital clock active.' },
    ],
  },
  'lava-lamp-timer': {
    kicker: 'RETRO 1970s BUOYANT WAX BLOB TIMER',
    leadHeading: 'Unwinding Hyperfocus and Creative Blocks with Slow-Rising Lava Lamp Blobs',
    leadParagraphs: [
      'Since Edward Craven Walker invented the Astro Lava Lamp in 1963, its slow, hypnotic cycle of warming wax spheres rising, splitting, and sinking has been an icon of creative studios, dorm rooms, and sensory lounges.',
      'This digital Lava Lamp Timer pairs that unmistakable retro glass-bottle silhouette and buoyant wax motion with a precision countdown clock—giving designers, students, and neurodivergent thinkers a groovy, low-pressure way to bound creative sessions.',
    ],
    viewingDistance: 'Creative studio desk, counseling room, or classroom chill corner (2–25 ft)',
    ambientContrast: 'Warm magenta, plum, and glowing amber-coral wax blobs inside a tapered glass vessel',
    sensoryNote: 'Smooth organic metaball-style motion with instant Reduced Motion fallback.',
    routines: [
      { title: '20-Minute Divergent Sketching & Ideation', timing: '20:00 Studio Tablet', setup: 'Let the unhurried lava motion keep your inner critic relaxed while sketching rough concepts.' },
      { title: 'Sensory Lounge & Counseling De-Escalation', timing: '05:00 Silent Mode', setup: 'Give overwhelmed students a classic visual focal point to watch while regulating breathing.' },
      { title: '10-Minute Music Practice / Jam Warm-Up', timing: '10:00 Fullscreen', setup: 'Set on your amp or music stand during scales and improv warm-ups.' },
    ],
    tableTitle: 'Why Lava Lamp Motion Works for Creative & Sensory Pacing',
    tableColumns: ['Use Case', 'Recommended Time', 'How the Visual Supports the Task'],
    tableRows: [
      ['Brainstorming & Concept Sketching', '15:00 – 25:00', 'Organic, non-rigid motion prevents the "blank page freeze" caused by strict ticking clocks'],
      ['ADHD / Autism Sensory Regulation', '03:00 – 05:00', 'Predictable rise-and-sink wax cycle provides soothing visual stimming support'],
      ['Listening Party / Album Break', '10:00 – 20:00', 'Doubles as retro ambient lighting in Fullscreen Mode (`F`)'],
    ],
    fieldNotes: [
      { label: 'Zero Burn Hazard in Classrooms', note: 'Real glass lava lamps run at `120°F+` (`50°C+`) via an incandescent bulb at the base and take 45 minutes to warm up—this digital version starts instantly and safely.' },
      { label: 'Clear Digital Readout When You Need Exact Seconds', note: 'Keep the crisp `MM:SS` badge visible for timed exercises, or hide it for pure ambient flow.' },
    ],
  },
  'spinner-timer': {
    kicker: 'HIGH-VISIBILITY TACHOMETER & DIAL SPINNER',
    leadHeading: 'Pacing Fast Game Rounds, Trivia Nights, and Gym Sets with a Sweeping Pointer Dial',
    leadParagraphs: [
      'When you have 30 seconds to shout out a trivia answer or 60 seconds to finish a kettlebell set, you want a timer with kinetic energy: a central pointer needle sweeping around a ring of glowing green-to-lime segments.',
      'This Spinner Dial Timer acts like a precision sports tachometer—combining a crisp rotating pointer needle, 36 radial LED segments that extinguish around the bezel, and a bold digital readout.',
    ],
    viewingDistance: 'Trivia screens, gym floors, and classroom game boards (3–45 ft)',
    ambientContrast: 'Luminous emerald-to-lime radial segments on a deep matte instrument bezel',
    sensoryNote: 'Needle angle and 36-segment bezel stay 100% locked to exact remaining milliseconds.',
    routines: [
      { title: '60-Second Trivia & Classroom Quiz Round', timing: '01:00 Fullscreen', setup: 'Project during team trivia or vocabulary lightning rounds so everyone sees the needle sweep.' },
      { title: '45-Second Gym Circuit Station', timing: '00:45 Horizontal Tablet', setup: 'Each of the 36 segments equals 1.25 seconds—easy to read mid-workout.' },
      { title: '2-Minute Pitch or Stand-Up Update', timing: '02:00 Screen Share', setup: 'Keep daily stand-up updates crisp by giving each speaker one full sweep of the dial.' },
    ],
    tableTitle: 'How the 36-Segment Spinner Bezel Maps to Common Sprints',
    tableColumns: ['Timer Duration', 'Seconds per Bezel Segment (1/36th)', 'Halfway & Final-Quarter Cues'],
    tableRows: [
      ['36 Seconds (Quick Game Turn)', '1.0 second per segment', '18s at 6 o’clock · Final 9 segments = 9-second countdown'],
      ['60 Seconds (1 Minute)', '1.67 seconds per segment', '30s at 6 o’clock · Final 9 segments = last 15 seconds'],
      ['3 Minutes (180 Seconds)', '5.0 seconds per segment', '90s at 6 o’clock · Final 9 segments = last 45 seconds'],
      ['6 Minutes (360 Seconds)', '10.0 seconds per segment', '3m at 6 o’clock · Each segment = 10 seconds'],
    ],
    fieldNotes: [
      { label: 'Dual-Cue Instrument Design (Needle + Segments)', note: 'Combining a sweeping center needle with extinguishing perimeter segments lets your brain read both the exact pointer angle and the remaining lit arc.' },
      { label: 'Instant Reset (`R`) for Back-to-Back Players', note: 'During fast-paced classroom games, press `R` then `Space` to snap all 36 segments back to full green for the next contestant.' },
    ],
  },
};

export function getPractitionerArchetype(
  slug: string,
  toolName: string,
  categorySlug: string
): ToolPractitionerArchetype {
  if (PRACTITIONER_ARCHETYPES[slug]) {
    return PRACTITIONER_ARCHETYPES[slug];
  }

  const sensoryProfile = SENSORY_TIMER_PROFILES[slug];
  if (sensoryProfile) {
    return {
      slug,
      archetype: 'sensory-studio',
      kicker: sensoryProfile.kicker,
      leadHeading: sensoryProfile.leadHeading,
      leadParagraphs: sensoryProfile.leadParagraphs,
      executionHeading: `Setting Up the ${toolName} for Classrooms, Desks & Projectors`,
      executionSteps: [
        {
          title: 'Select Your Preset Duration or Enter Custom Minutes & Seconds',
          detail: 'Choose a quick duration chip (1m, 3m, 5m, 10m, 15m, 25m) or input your exact custom interval.',
        },
        {
          title: 'Adjust Visual Palette, Numeric Readout, and Sound Mode',
          detail: 'Choose whether to display tabular `MM:SS` digits alongside the animation and pick a gentle chime or silent visual flash.',
        },
        {
          title: 'Launch Fullscreen (`F`) for Shared Screens or Desk Stands',
          detail: 'Expand the visual canvas edge-to-edge on desktop monitors, classroom smartboards, or horizontal mobile screens.',
        },
      ],
      sensoryMatrix: {
        viewingDistance: sensoryProfile.viewingDistance,
        ambientContrast: sensoryProfile.ambientContrast,
        soundProfile: 'Configurable Web Audio gentle chime or silent visual completion state',
        sensoryNote: sensoryProfile.sensoryNote,
        routines: sensoryProfile.routines,
      },
      tableSectionTitle: sensoryProfile.tableTitle,
      tableSectionIntro: `Practical reference guide for deploying the ${toolName} across learning and focus environments:`,
      tableColumns: sensoryProfile.tableColumns,
      tableRows: sensoryProfile.tableRows,
      fieldNotesTitle: `Practitioner Notes for ${toolName}`,
      fieldNotes: sensoryProfile.fieldNotes,
    };
  }

  return {
    slug,
    archetype: categorySlug === 'calculators' ? 'formula-ledger' : 'sensory-studio',
    kicker: `VISUAL PACING & STUDIO GUIDE · ${toolName.toUpperCase()}`,
    leadHeading: `How the ${toolName} Turns Abstract Minutes Into Calm, Glanceable Motion`,
    leadParagraphs: [
      `Watching raw digital numbers tick down second by second often splits your attention—either you ignore the clock completely until time runs out, or the constant numeric ticking creates low-grade pressure during creative work, study, or classroom transitions.`,
      `The ${toolName} solves this by mapping an exact monotonic countdown engine (\`Date.now()\` delta) directly to a continuous visual progression.`,
    ],
    executionHeading: `Getting the Best Visual Clarity from the ${toolName}`,
    executionSteps: [
      {
        title: 'Match the Duration to a Single, Self-Contained Activity',
        detail: `Use 2-to-5-minute intervals for transitions and breathing resets, 10-to-15-minute blocks for classroom stations, or 25-to-45-minute blocks for deep study.`,
      },
      {
        title: 'Choose Between Silent Visual Cue and Soft Acoustic Chime',
        detail: 'In libraries, sensory rooms, or shared offices, mute the audio so the final visual state signals completion quietly.',
      },
      {
        title: 'Use Fullscreen Mode (`F`) on Projectors and Horizontal Tablets',
        detail: 'Fullscreen mode removes all navigation chrome, presenting only the high-resolution visual animation, remaining time, and a corner exit button.',
      },
    ],
    tableSectionTitle: `${toolName} Setup Guide by Environment`,
    tableSectionIntro: `Recommended duration, audio, and display settings for using the ${toolName} in real-world rooms:`,
    tableColumns: ['Environment', 'Ideal Duration Window', 'Recommended Display & Audio Setup'],
    tableRows: [
      ['Elementary & Middle School Classroom', '03:00 – 15:00', 'Fullscreen on Smartboard (`F`) · Soft chime at 00:00'],
      ['Neurodivergent / ADHD Study Desk', '15:00 – 25:00', 'Split-screen or horizontal tablet · Silent visual completion'],
      ['Therapy, Yoga & Mindfulness Space', '05:00 – 20:00', 'Dark mode surface · Mute audio or use gentle bell'],
    ],
    fieldNotesTitle: `Classroom & Studio Field Notes for ${toolName}`,
    fieldNotes: [
      {
        label: 'Zero Drift When Switching Browser Tabs',
        note: `If you switch tabs to check a lesson plan or slide deck while the ${toolName} is running, the animation recalculates its exact geometric progress from the system clock the instant you return.`,
      },
      {
        label: 'Horizontal Mobile Fullscreen Support',
        note: 'On phones and tablets, tapping Fullscreen automatically optimizes the visual canvas for horizontal landscape viewing on a desk stand.',
      },
    ],
  };
}

import React from 'react';
import { ShieldCheck, Database, Cpu, AlertCircle } from 'lucide-react';

export interface ProvenanceMetadata {
  dataClassification: string;
  sourceAndStandard: string;
  calculationMethod: string;
  limitationsAndAssumptions: string;
  timeZoneContext?: string;
}

export function getProvenanceForTool(slug: string, categorySlug?: string): ProvenanceMetadata {
  // 1. World Clock, Time Zone & Epoch Tools
  if (
    slug === 'world-clock' ||
    slug === 'time-zone-converter' ||
    slug === 'time-difference-calculator' ||
    slug === 'meeting-planner'
  ) {
    return {
      dataClassification:
        'Live System Clock + Official IANA Time Zone Database (Browser-Calculated) + User-Entered City/Date Selections',
      sourceAndStandard:
        'IANA Time Zone Database (tzdb) accessed via ECMAScript Intl.DateTimeFormat API and UTC Epoch timestamps (ISO 8601).',
      calculationMethod:
        'Converts local wall-clock times to Coordinated Universal Time (UTC) epoch milliseconds, applies the target city’s historical or 2026 IANA UTC offset (including ±30m and ±45m fractional zones and regional Daylight Saving Time rules), and computes exact hour/minute offsets.',
      limitationsAndAssumptions:
        'Live clock accuracy depends on the user’s operating system NTP synchronization. Future DST transitions reflect currently enacted laws in the IANA database as of 2026; governments occasionally amend DST schedules on short notice.',
      timeZoneContext:
        'All city times dynamically display their active UTC offset (e.g., UTC−05:00 EST / UTC−04:00 EDT) and date rollover status.',
    };
  }

  if (slug === 'unix-timestamp-converter') {
    return {
      dataClassification:
        'Live UTC Epoch Clock + Browser-Calculated Values + User-Entered Timestamps',
      sourceAndStandard:
        'POSIX.1-2017 / IEEE Std 1003.1 Unix Epoch (1970-01-01T00:00:00Z) and ISO 8601 Date-Time Standard.',
      calculationMethod:
        '10-digit inputs are evaluated as seconds since 1970-01-01T00:00:00Z (multiplied by 1,000 for JavaScript Date); 13-digit inputs are evaluated directly as milliseconds. Every POSIX day is defined as exactly 86,400 seconds.',
      limitationsAndAssumptions:
        'POSIX Unix time does not count astronomical leap seconds inserted by IERS. Legacy 32-bit signed integer systems overflow at 2,147,483,647 seconds (2038-01-19T03:14:07Z), whereas this tool uses 64-bit safe integers.',
      timeZoneContext:
        'Displays both UTC (ISO 8601 Z) and the user’s local IANA browser time zone side by side.',
    };
  }

  // 2. Date, Time, Payroll & Speech Calculators
  if (slug === 'time-card-calculator' || slug === 'overtime-calculator') {
    return {
      dataClassification:
        'Browser-Calculated Values + Official Labor Standard Reference Formulas + User-Entered Shift & Wage Data',
      sourceAndStandard:
        'Base-60 Sexagesimal-to-Decimal Conversion Standard and US Fair Labor Standards Act (FLSA, 29 CFR Part 778) / California Labor Code § 510 reference models.',
      calculationMethod:
        'Net Shift Minutes = (Clock-Out − Clock-In) − Unpaid Break Minutes. Decimal Hours = Hours + (Minutes ÷ 60). Gross Pay = (Regular Hours × Base Rate) + (Overtime Hours × Base Rate × OT Multiplier).',
      limitationsAndAssumptions:
        'Outputs represent pre-tax gross wage estimates based solely on user-entered shifts, rounding options, and multipliers. Does not account for federal/state tax withholding, union collective bargaining agreements, or shift differentials, and is not legal or accounting advice.',
    };
  }

  if (slug === 'date-calculator') {
    return {
      dataClassification:
        'Browser-Calculated Values + Official Gregorian Calendar Rules + User-Entered Dates',
      sourceAndStandard:
        'ISO 8601 Proleptic Gregorian Calendar (365 days/year; leap years divisible by 4, except century years not divisible by 400).',
      calculationMethod:
        'Normalizes start and end dates to UTC midnight (00:00:00Z) to eliminate 23-hour/25-hour Daylight Saving Time rounding errors, then computes exact calendar day, business weekday (Mon–Fri), and Y/M/D intervals.',
      limitationsAndAssumptions:
        'Standard business-day counts exclude Saturdays and Sundays (and optional user-entered holiday counts) but do not automatically fetch country-specific bank holidays.',
    };
  }

  if (slug === 'speech-time-calculator') {
    return {
      dataClassification:
        'Browser-Calculated Word Count + Estimated Speaking Rate Averages + User-Entered Script Text',
      sourceAndStandard:
        'Broadcast, keynote, and Toastmasters International speaking cadence benchmarks (110 to 170 Words Per Minute).',
      calculationMethod:
        'Splits pasted text on whitespace boundaries to count exact words, then computes Speaking Minutes = Total Words ÷ Selected WPM + Pause Buffers.',
      limitationsAndAssumptions:
        'Speaking duration is an estimate based on average WPM cadence. Actual stage delivery varies with applause, audience laughter, slide transitions, and technical terminology.',
    };
  }

  if (
    slug === 'time-calculator' ||
    slug === 'time-addition-calculator' ||
    slug === 'time-duration-calculator' ||
    slug === 'time-converter' ||
    slug === 'minutes-to-hours' ||
    slug === 'hours-to-minutes' ||
    slug === 'seconds-to-minutes' ||
    slug === 'what-time-will-it-be'
  ) {
    return {
      dataClassification:
        'Browser-Calculated Exact Arithmetic + SI / ISO 80000-3 Time Unit Definitions + User-Entered Values',
      sourceAndStandard:
        'SI Base Unit of Time (Second) and Sexagesimal Base-60 Time Convention (1 min = 60 s, 1 hr = 3,600 s, 1 day = 86,400 s).',
      calculationMethod:
        'Converts all hours, minutes, and seconds into a common base of total seconds (or milliseconds), performs exact integer addition, subtraction, or division, and normalizes the remainder via modulo-60 / modulo-24 arithmetic.',
      limitationsAndAssumptions:
        'Fixed unit conversions use standard 24-hour days (86,400 s). Relative future/past clock time ("What Time Will It Be") adds duration to the user’s live local system clock.',
    };
  }

  // 3. Official Rulebook Timers (Toastmasters, Debate, Chess, Tabata, Boxing, Bingo)
  if (slug === 'toastmasters-timer') {
    return {
      dataClassification:
        'Browser-Calculated Monotonic Timer + Official Toastmasters International Timing Rules',
      sourceAndStandard:
        'Toastmasters International Speech Contest Rulebook (Green, Yellow, and Red signal thresholds and ±30-second contest qualifying grace windows).',
      calculationMethod:
        'Tracks elapsed time using Date.now() delta timestamps and triggers visual background transitions at exact rulebook thresholds (e.g., 5:00 Green, 6:00 Yellow, 7:00 Red, 7:30 Disqualification for Prepared Speeches).',
      limitationsAndAssumptions:
        'In official Toastmasters contests, no audible bell may be used after the Red signal; the timer operator must start the clock on the speaker’s first verbal or nonverbal communication with the audience.',
    };
  }

  if (slug === 'debate-timer') {
    return {
      dataClassification:
        'Browser-Calculated Monotonic Timer + Official WUDC / WSDC / NSDA Debate Timing Formats',
      sourceAndStandard:
        'World Universities Debating Championship (British Parliamentary), World Schools Debating Championships (WSDC), and US National Speech & Debate Association (Lincoln-Douglas & Public Forum) manuals.',
      calculationMethod:
        'Computes remaining speech or prep time via epoch timestamp deltas and triggers protected-time / Point of Information (POI) bells at 1:00 and 6:00 (or 7:00).',
      limitationsAndAssumptions:
        'Prep time banks require the adjudicator or timekeeper to manually start and pause each side’s clock as teams request preparation time.',
    };
  }

  if (slug === 'chess-clock') {
    return {
      dataClassification:
        'Browser-Calculated Dual Countdown Engine + Official FIDE Time Control & Fischer Increment Rules',
      sourceAndStandard:
        'FIDE Laws of Chess (Article 6: The Chessclock) and US Patent 4,884,255 (Bobby Fischer per-move increment).',
      calculationMethod:
        'Maintains independent millisecond-accurate remaining counters for Player 1 and Player 2; tapping an active clock pauses it, adds the configured +S Fischer increment in milliseconds, increments the move counter, and starts the opponent’s clock.',
      limitationsAndAssumptions:
        'Touchscreen and keyboard clocks are designed for casual, club, and classroom play; FIDE-rated master tournaments require physical DGT/hardware clocks.',
    };
  }

  // 4. Classroom Noise Meter & Randomizers
  if (slug === 'classroom-noise-meter') {
    return {
      dataClassification:
        'Live Local Microphone Waveform (Browser-Calculated RMS Amplitude) + User-Selected Threshold',
      sourceAndStandard:
        'W3C Web Audio API (AudioContext & AnalyserNode time-domain root-mean-square signal processing).',
      calculationMethod:
        'Samples real-time microphone audio frames in local RAM, computes Root Mean Square (RMS) amplitude, and maps the signal onto a relative 0–100 visual volume scale. Zero audio is ever recorded or transmitted.',
      limitationsAndAssumptions:
        'Web browsers do not have access to hardware-calibrated microphone sensitivity curves; therefore, the 0–100 reading is a relative room-volume indicator, not a certified ANSI/IEC dB SPL sound-level measurement. Calibrate the threshold slider to your room’s baseline noise.',
    };
  }

  if (
    slug === 'random-name-picker' ||
    slug === 'random-group-generator' ||
    slug === 'bingo-caller' ||
    slug === 'seating-chart-maker'
  ) {
    return {
      dataClassification:
        'Browser-Calculated Uniform Randomization + User-Entered Rosters (100% Local Browser Memory)',
      sourceAndStandard:
        'Fisher-Yates (Knuth) Unbiased Array Permutation Algorithm and North American 75-Ball B-I-N-G-O Column Standard (1–75).',
      calculationMethod:
        'Selects indices with uniform 1/N probability (with or without replacement) and distributes group remainders via integer division floor(N ÷ K) and modulo (N mod K) so team sizes never differ by more than 1.',
      limitationsAndAssumptions:
        'All participant names and seating grids exist strictly inside local browser memory (and optional localStorage) and are never uploaded to external servers.',
    };
  }

  // 5. Cooking, Ergonomic & Breathing Timers
  if (slug === 'egg-timer' || slug === 'tea-timer' || slug === 'coffee-timer' || slug === 'kitchen-timer') {
    return {
      dataClassification:
        'Browser-Calculated Drift-Free Countdown + Estimated Culinary & Specialty Extraction Benchmarks',
      sourceAndStandard:
        'Sea-level water boiling point (100°C / 212°F at 1 atm), USDA food safety thermal guidelines, and Specialty Coffee Association (SCA) 1:16 extraction standards.',
      calculationMethod:
        'Tracks remaining cooking or steeping time against a target epoch timestamp (targetEndTime − Date.now()) while displaying stage-by-stage culinary cues.',
      limitationsAndAssumptions:
        'Egg boiling presets assume a standard US Large / EU Medium-Large egg (55–60g) taken from a 4°C (40°F) refrigerator at sea level. Add 30–90 seconds at altitudes above 5,000 ft (1,500 m) or when using Jumbo eggs.',
    };
  }

  if (slug === 'eye-break-timer' || slug === 'breathing-timer' || slug === 'meditation-timer') {
    return {
      dataClassification:
        'Browser-Calculated Drift-Free Countdown + General Ergonomic & Paced-Breathing Cadence Guidelines',
      sourceAndStandard:
        'Workplace 20-20-20 visual ergonomics guideline (20m interval, 20ft / 6m distance, 20s duration) and standard respiratory pacing ratios (4-4-4-4 Box, 4-7-8, and 5-5 Coherent).',
      calculationMethod:
        'Computes remaining interval time via monotonic timestamp deltas so background tabs never drift.',
      limitationsAndAssumptions:
        'Provided for general workplace ergonomics, mindfulness, and relaxation timing only. Not a medical device or a substitute for professional optometric or medical care.',
    };
  }

  // 6. Default for Countdown, Visual, Sensory, Stage, Interval & Pre-Set Duration Timers
  return {
    dataClassification:
      'Browser-Calculated Drift-Free Countdown Engine + User-Configured Duration & Presets',
    sourceAndStandard:
      'W3C High-Resolution Time Standard (performance.now() / Date.now() epoch delta), W3C Screen Wake Lock API, and W3C Web Audio API.',
    calculationMethod:
      'Records the exact target completion timestamp (targetEndTime = Date.now() + remainingMs) and recalculates remainingMs = Math.max(0, targetEndTime − Date.now()) on every animation frame, guaranteeing zero cumulative drift even when browser tabs are backgrounded.',
    limitationsAndAssumptions:
      'The timer continues accurately in background tabs or minimized windows, but completely closing the browser tab or powering off the device terminates the active page session. Browser autoplay rules require at least one click/tap on the page to unlock Web Audio chimes.',
  };
}

interface InformationProvenanceBoxProps {
  slug: string;
  toolName: string;
  categorySlug?: string;
}

export default function InformationProvenanceBox({
  slug,
  toolName,
  categorySlug,
}: InformationProvenanceBoxProps) {
  const meta = getProvenanceForTool(slug, categorySlug);

  return (
    <section
      aria-label={`Information provenance and calculation methodology for ${toolName}`}
      className="my-8 rounded-2xl border border-[#D8E2DC] dark:border-[#2A352E] bg-[#F4F7F4] dark:bg-[#171E1A] p-5 sm:p-6 shadow-2xs"
    >
      <div className="flex items-center justify-between flex-wrap gap-2 pb-3 mb-4 border-b border-[#E2EAE4] dark:border-[#252E28]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#365C4B] dark:text-[#5E917A] shrink-0" />
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#252B27] dark:text-white">
            Information Provenance, Calculation Method &amp; Technical Scope
          </h3>
        </div>
        <span className="text-[11px] font-mono text-[#252B27]/60 dark:text-slate-400">
          Verified Standard · Updated Nov 2026
        </span>
      </div>

      <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm leading-relaxed">
        <div className="bg-white/80 dark:bg-[#1B231E] rounded-xl p-3.5 border border-[#E4E1D9]/80 dark:border-[#28312B]">
          <dt className="flex items-center gap-1.5 font-bold text-[#252B27] dark:text-white mb-1">
            <Database className="w-3.5 h-3.5 text-[#365C4B] dark:text-[#5E917A] shrink-0" />
            <span>Data Classification &amp; Source</span>
          </dt>
          <dd className="text-[#252B27]/80 dark:text-slate-300">
            <strong className="font-semibold text-[#252B27] dark:text-slate-200">Type:</strong>{' '}
            {meta.dataClassification}
            <br />
            <strong className="font-semibold text-[#252B27] dark:text-slate-200">Standard:</strong>{' '}
            {meta.sourceAndStandard}
          </dd>
        </div>

        <div className="bg-white/80 dark:bg-[#1B231E] rounded-xl p-3.5 border border-[#E4E1D9]/80 dark:border-[#28312B]">
          <dt className="flex items-center gap-1.5 font-bold text-[#252B27] dark:text-white mb-1">
            <Cpu className="w-3.5 h-3.5 text-[#365C4B] dark:text-[#5E917A] shrink-0" />
            <span>Calculation &amp; Timing Method</span>
          </dt>
          <dd className="text-[#252B27]/80 dark:text-slate-300">{meta.calculationMethod}</dd>
        </div>

        <div className="md:col-span-2 bg-white/80 dark:bg-[#1B231E] rounded-xl p-3.5 border border-[#E4E1D9]/80 dark:border-[#28312B]">
          <dt className="flex items-center gap-1.5 font-bold text-[#252B27] dark:text-white mb-1">
            <AlertCircle className="w-3.5 h-3.5 text-[#B7804C] dark:text-[#cda06f] shrink-0" />
            <span>Explicit Limitations &amp; Operating Assumptions</span>
          </dt>
          <dd className="text-[#252B27]/80 dark:text-slate-300">
            {meta.limitationsAndAssumptions}
            {meta.timeZoneContext ? ` ${meta.timeZoneContext}` : ''}
          </dd>
        </div>
      </dl>
    </section>
  );
}

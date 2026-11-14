import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET() {
  const content = `# WebCountDownTimer.com — Precision Online Timers, Visual Timers, World Clocks & Time Calculators

> WebCountDownTimer.com is a free, browser-native time tools platform engineered for classrooms, conference stages, deep work, and international scheduling. Every timer, stopwatch, visual countdown, and calculator runs locally in the user's browser with zero account sign-up and zero tracking cookies.

## Technical Methodology & Accuracy Standards
- **Drift-Free Countdown Engine**: All countdowns, stopwatches, and visual timers compute remaining or elapsed time from a monotonic/epoch timestamp delta (\`Date.now()\` / \`performance.now()\`) rather than accumulating frame intervals. Switching browser tabs or backgrounding a window never causes time drift.
- **Official IANA Time Zone Database**: World Clock, Time-Zone Converter, and International Meeting Planner use the browser's \`Intl.DateTimeFormat\` IANA database to resolve Daylight Saving Time (DST) transitions and fractional UTC offsets (such as UTC+5:30 in India and UTC+9:30 in Adelaide).
- **Web Audio API Synthesis**: Completion chimes, boxing bells, and countdown warnings are synthesized mathematically in real time via the Web Audio API with zero external audio file dependencies.
- **Client-Side Privacy**: Microphone decibel sampling in the Classroom Noise Meter and custom photo uploads in the Picture Reveal Timer are processed exclusively in local browser memory (\`AudioContext\` / \`URL.createObjectURL\`) and are never transmitted to any server.

## Primary Category Hubs
- [All Time Tools Directory](https://WebCountDownTimer.com/tools)
- [Everyday & Online Timers](https://WebCountDownTimer.com/category/timers)
- [Presentation, Stage & Event Timers](https://WebCountDownTimer.com/category/events)
- [Education & Classroom Timers](https://WebCountDownTimer.com/education)
- [Productivity, Study & Focus Timers](https://WebCountDownTimer.com/category/productivity)
- [Fitness, HIIT & Wellness Timers](https://WebCountDownTimer.com/category/fitness)
- [World Clock & Time-Zone Tools](https://WebCountDownTimer.com/category/world)
- [Date & Time Calculators](https://WebCountDownTimer.com/category/calculators)

## Flagship Interactive Tools
- [Countdown Timer](https://WebCountDownTimer.com/countdown-timer): Precision digital countdown with presets, custom HMS input, fullscreen mode, and acoustic chimes.
- [Visual Timer](https://WebCountDownTimer.com/visual-timer): High-contrast disappearing disk timer for classrooms, ADHD focus, and presentations.
- [Stage Timer](https://WebCountDownTimer.com/stage-timer): Multi-screen presenter confidence monitor with green/amber/red thresholds, speaker cues, and BroadcastChannel display sync.
- [Pomodoro Timer](https://WebCountDownTimer.com/pomodoro-timer): 25m/5m focus and break interval cycles with task tracking.
- [Stopwatch](https://WebCountDownTimer.com/stopwatch): Millisecond-accurate elapsed time tracker with lap splits and CSV export.
- [Interval Timer](https://WebCountDownTimer.com/interval-timer): Customizable HIIT, circuit, and round interval timer.
- [World Clock](https://WebCountDownTimer.com/world-clock): Live multi-city world clock with UTC offsets and day/night indicators.
- [Time-Zone Converter](https://WebCountDownTimer.com/time-zone-converter): Interactive time-scrubbing converter across international cities.
- [International Meeting Planner](https://WebCountDownTimer.com/meeting-planner): Overlap finder for green working hours across global teams.

## Visual, Sensory & Split-Flap Timers (/timers/*)
- [Sensory Timers Hub](https://WebCountDownTimer.com/timers/sensory-timers)
- [Flip Clock](https://WebCountDownTimer.com/timers/flip-clock)
- [Flip Timer](https://WebCountDownTimer.com/timers/flip-timer)
- [Train Departure Board Timer](https://WebCountDownTimer.com/timers/train-timer)
- [Forest Fire Timer](https://WebCountDownTimer.com/timers/forest-fire-timer)
- [Sand Timer](https://WebCountDownTimer.com/timers/sand-timer)
- [Hourglass Timer](https://WebCountDownTimer.com/timers/hourglass-timer)
- [Liquid Timer](https://WebCountDownTimer.com/timers/liquid-timer)
- [Lava Lamp Timer](https://WebCountDownTimer.com/timers/lava-lamp-timer)
- [Rainbow Timer](https://WebCountDownTimer.com/timers/rainbow-timer)
- [Circular Timer](https://WebCountDownTimer.com/timers/circular-timer)
- [Radial Timer](https://WebCountDownTimer.com/timers/radial-timer)
- [Rings Timer](https://WebCountDownTimer.com/timers/rings-timer)
- [Progress Bar Timer](https://WebCountDownTimer.com/timers/progress-timer)
- [Pixel Timer](https://WebCountDownTimer.com/timers/pixel-timer)
- [Blocks Timer](https://WebCountDownTimer.com/timers/blocks-timer)
- [Candle Timer](https://WebCountDownTimer.com/timers/candle-timer)
- [Aesthetic Timer](https://WebCountDownTimer.com/timers/aesthetic-timer)
- [Picture Reveal Timer](https://WebCountDownTimer.com/timers/picture-reveal-timer)
- [Heart Timer](https://WebCountDownTimer.com/timers/heart-timer)
- [Moon Phase Timer](https://WebCountDownTimer.com/timers/moon-timer)
- [Sun Arc Timer](https://WebCountDownTimer.com/timers/sun-timer)
- [Bubble Timer](https://WebCountDownTimer.com/timers/bubble-timer)
- [Coral Reef Timer](https://WebCountDownTimer.com/timers/coral-timer)
- [Lichen Timer](https://WebCountDownTimer.com/timers/lichen-timer)
- [Frost Crystal Timer](https://WebCountDownTimer.com/timers/frost-timer)
- [Snowfall Timer](https://WebCountDownTimer.com/timers/snow-timer)
- [Galaxy Spiral Timer](https://WebCountDownTimer.com/timers/galaxy-timer)
- [Spinner Timer](https://WebCountDownTimer.com/timers/spinner-timer)

## Date, Time & Payroll Calculators
- [Time Duration Calculator](https://WebCountDownTimer.com/time-duration-calculator)
- [Time Calculator (Add & Subtract Time)](https://WebCountDownTimer.com/time-calculator)
- [Date Calculator (Days Between Dates)](https://WebCountDownTimer.com/date-calculator)
- [Business Days Calculator](https://WebCountDownTimer.com/business-days-calculator)
- [Age Calculator](https://WebCountDownTimer.com/age-calculator)
- [Time Card Calculator](https://WebCountDownTimer.com/time-card-calculator)
- [Overtime Calculator](https://WebCountDownTimer.com/overtime-calculator)
- [Time Unit Converter](https://WebCountDownTimer.com/time-converter)
- [Minutes to Hours Converter](https://WebCountDownTimer.com/minutes-to-hours)
- [Hours to Minutes Converter](https://WebCountDownTimer.com/hours-to-minutes)
- [Seconds to Minutes Converter](https://WebCountDownTimer.com/seconds-to-minutes)
- [What Time Will It Be Calculator](https://WebCountDownTimer.com/what-time-will-it-be)

## Documentation, Policies & Sitemaps
- [HTML Sitemap](https://WebCountDownTimer.com/sitemap)
- [XML Sitemap](https://WebCountDownTimer.com/sitemap.xml)
- [Guides & Timing Playbooks](https://WebCountDownTimer.com/guides)
- [About & Methodology](https://WebCountDownTimer.com/about)
- [Accessibility Statement](https://WebCountDownTimer.com/accessibility)
- [Privacy Policy](https://WebCountDownTimer.com/privacy)
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 's-maxage=86400, stale-while-revalidate',
    },
  });
}

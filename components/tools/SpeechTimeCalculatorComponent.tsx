'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mic, Clock, ArrowRight, FileText, Sliders } from 'lucide-react';
import { calculateSpeechTime } from '@/lib/calculators/time-calculators';

const SAMPLE_SPEECH = `Good morning everyone, and thank you for joining our Global Product Summit keynote today. Over the next few minutes, we will explore how distributed teams coordinate complex launches across time zones without losing creative momentum.

When every second on stage matters, clear visual pacing empowers speakers to deliver their message with confidence, clarity, and composure. Let us walk through the three core pillars of modern event synchronization.`;

const SPEED_PRESETS = [
  { label: 'Slow & Deliberate', wpm: 110 },
  { label: 'Conversational (Default)', wpm: 130 },
  { label: 'Energetic Keynote', wpm: 150 },
  { label: 'Fast / Broadcast', wpm: 170 },
];

export default function SpeechTimeCalculatorComponent() {
  const [text, setText] = useState<string>(SAMPLE_SPEECH);
  const [wpm, setWpm] = useState<number>(130);
  const [pauseCount, setPauseCount] = useState<number>(2);
  const [secondsPerPause, setSecondsPerPause] = useState<number>(3);

  const extraPauseSeconds = pauseCount * secondsPerPause;
  const result = calculateSpeechTime(text, wpm, extraPauseSeconds);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left 7 Cols: Script Editor */}
      <div className="lg:col-span-7 bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <label
            htmlFor="speech-script-textarea"
            className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2"
          >
            <FileText className="w-4 h-4 text-[#2563EB]" />
            <span>Paste or Write Your Speech Script</span>
          </label>
          <button
            type="button"
            onClick={() => setText('')}
            className="text-xs font-semibold text-slate-500 hover:text-red-600 cursor-pointer"
          >
            Clear Script
          </button>
        </div>

        <textarea
          id="speech-script-textarea"
          rows={12}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your presentation script, keynote notes, or essay here..."
          className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-slate-900 dark:text-white leading-relaxed"
        />

        {/* Word / Character / Sentence Stats */}
        <div className="grid grid-cols-4 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800">
            <div className="text-[11px] text-slate-500">Words</div>
            <div className="text-lg font-extrabold font-mono tabular-nums text-slate-900 dark:text-white">
              {result.wordCount}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800">
            <div className="text-[11px] text-slate-500">Sentences</div>
            <div className="text-lg font-extrabold font-mono tabular-nums text-slate-900 dark:text-white">
              {result.sentenceCount}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800">
            <div className="text-[11px] text-slate-500">Paragraphs</div>
            <div className="text-lg font-extrabold font-mono tabular-nums text-slate-900 dark:text-white">
              {result.paragraphCount}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800">
            <div className="text-[11px] text-slate-500">Characters</div>
            <div className="text-lg font-extrabold font-mono tabular-nums text-slate-900 dark:text-white">
              {result.characterCount}
            </div>
          </div>
        </div>
      </div>

      {/* Right 5 Cols: Estimated Speaking Duration & Pacing Controls */}
      <div className="lg:col-span-5 space-y-5">
        <div className="bg-[#0F172A] text-white rounded-2xl p-6 border border-slate-800 shadow-lg space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400">
            <Clock className="w-4 h-4" />
            <span>Estimated Speaking Duration</span>
          </div>

          <div className="text-5xl font-black font-mono tabular-nums tracking-tight">
            {result.formattedEstimate}
          </div>

          <div className="text-xs text-slate-300">
            Estimated delivery range:{' '}
            <span className="font-mono font-bold text-white">{result.formattedRange}</span> (at{' '}
            {wpm} WPM + {extraPauseSeconds}s pauses)
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            Note: Duration is an estimate based on word count and selected speaking speed. Actual live delivery varies with audience applause, slide transitions, and improvisation.
          </p>

          <Link prefetch={false}
            href={`/presentation-timer`}
            className="w-full h-11 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <Mic className="w-4 h-4" />
            <span>Practice in Presentation Timer</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Speaking Speed & Pause Controls */}
        <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <Sliders className="w-4 h-4 text-[#2563EB]" />
            <span>Speaking Speed (Words Per Minute)</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {SPEED_PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => setWpm(p.wpm)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  wpm === p.wpm
                    ? 'bg-blue-50 dark:bg-blue-950/60 border-[#2563EB] text-[#2563EB]'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="text-xs font-bold">{p.label}</div>
                <div className="text-[11px] font-mono opacity-80">{p.wpm} WPM</div>
              </button>
            ))}
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span>Custom Pace</span>
              <span className="font-mono font-bold text-[#2563EB]">{wpm} WPM</span>
            </div>
            <input
              type="range"
              min={70}
              max={240}
              value={wpm}
              onChange={(e) => setWpm(Number(e.target.value))}
              className="w-full accent-[#2563EB] cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Slide / Emphasis Pauses
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={pauseCount}
                onChange={(e) => setPauseCount(Math.max(0, Number(e.target.value) || 0))}
                className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Seconds per Pause
              </label>
              <input
                type="number"
                min={1}
                max={30}
                value={secondsPerPause}
                onChange={(e) => setSecondsPerPause(Math.max(1, Number(e.target.value) || 3))}
                className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

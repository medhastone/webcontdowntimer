'use client';

import React, { useState, useRef } from 'react';
import {
  Shuffle,
  Trophy,
  RotateCcw,
  Download,
  Upload,
  Trash2,
  UserCheck,
  History,
} from 'lucide-react';
import { parseParticipantLines, shuffleArray } from '@/lib/calculators/time-calculators';
import { playTimerSound } from '@/lib/sound';

const SAMPLE_NAMES = [
  'Aria Montgomery',
  'Benjamin Carter',
  'Chloe Takahashi',
  'David Okafor',
  'Elena Rostova',
  'Fatima Al-Mansoor',
  'Gabriel Santos',
  'Hannah Lindqvist',
  'Isaac Chen',
  'Jasmine Kaur',
].join('\n');

export default function RandomNamePickerComponent() {
  const [rawInput, setRawInput] = useState<string>(SAMPLE_NAMES);
  const [removeAfterPick, setRemoveAfterPick] = useState<boolean>(false);
  const [deduplicate, setDeduplicate] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [currentPreviewName, setCurrentPreviewName] = useState<string>('');
  const [winner, setWinner] = useState<string | null>(null);
  const [history, setHistory] = useState<Array<{ name: string; timestamp: string }>>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const names = parseParticipantLines(rawInput, deduplicate);

  const handlePickRandom = () => {
    if (names.length === 0 || isSpinning) return;

    // Respect prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const shuffled = shuffleArray(names);
    const chosen = shuffled[0];

    if (prefersReducedMotion) {
      finalizeWinner(chosen);
      return;
    }

    setIsSpinning(true);
    setWinner(null);
    let step = 0;
    const totalSteps = 10;

    const interval = setInterval(() => {
      const randomPreview = names[Math.floor(Math.random() * names.length)];
      setCurrentPreviewName(randomPreview);
      step++;
      if (step >= totalSteps) {
        clearInterval(interval);
        setIsSpinning(false);
        finalizeWinner(chosen);
      }
    }, 65);
  };

  const finalizeWinner = (chosen: string) => {
    setWinner(chosen);
    setCurrentPreviewName(chosen);
    if (soundEnabled) {
      playTimerSound('marimba');
    }
    const timeStr = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    setHistory((prev) => [{ name: chosen, timestamp: timeStr }, ...prev]);

    if (removeAfterPick) {
      const remaining = names.filter((n) => n !== chosen);
      setRawInput(remaining.join('\n'));
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setRawInput(reader.result);
      }
    };
    reader.readAsText(file);
  };

  const handleExportNames = () => {
    const blob = new Blob([names.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'participant-list.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left 7 Cols: Winner Stage + Draw Controls */}
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-[#0F172A] text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-lg text-center space-y-6">
          <div className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            {isSpinning
              ? 'Selecting Random Participant...'
              : winner
              ? 'Selected Winner'
              : `${names.length} Eligible Participants Ready`}
          </div>

          <div
            aria-live="polite"
            className="min-h-[120px] flex flex-col items-center justify-center px-4 py-6 rounded-2xl bg-slate-900/90 border border-slate-800"
          >
            {winner ? (
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <Trophy className="w-4 h-4" />
                  <span>Selected Name</span>
                </div>
                <div className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                  {winner}
                </div>
              </div>
            ) : isSpinning ? (
              <div className="text-2xl sm:text-4xl font-bold text-blue-400">
                {currentPreviewName}
              </div>
            ) : (
              <div className="text-base sm:text-lg text-slate-400">
                Click &ldquo;Pick a Random Name&rdquo; to draw fairly from the list
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={handlePickRandom}
              disabled={names.length === 0 || isSpinning}
              className="w-full sm:w-auto px-8 h-12 rounded-xl bg-[#2563EB] hover:bg-blue-600 disabled:opacity-40 text-white font-bold text-base flex items-center justify-center gap-2.5 shadow-md cursor-pointer"
            >
              <Shuffle className="w-5 h-5" />
              <span>Pick a Random Name</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setWinner(null);
                setCurrentPreviewName('');
              }}
              className="w-full sm:w-auto px-4 h-12 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Clear Stage</span>
            </button>
          </div>

          {/* Options Row */}
          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-300">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={removeAfterPick}
                onChange={(e) => setRemoveAfterPick(e.target.checked)}
                className="rounded border-slate-600 text-[#2563EB]"
              />
              <span>Remove winner after draw</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={deduplicate}
                onChange={(e) => setDeduplicate(e.target.checked)}
                className="rounded border-slate-600 text-[#2563EB]"
              />
              <span>Remove duplicate names</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="rounded border-slate-600 text-[#2563EB]"
              />
              <span>Sound effect on draw</span>
            </label>
          </div>
        </div>

        {/* Draw History */}
        <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <History className="w-4 h-4 text-[#2563EB]" />
              <span>Draw History ({history.length})</span>
            </h2>
            {history.length > 0 && (
              <button
                type="button"
                onClick={() => setHistory([])}
                className="text-xs font-semibold text-slate-500 hover:text-red-600 cursor-pointer"
              >
                Clear History
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <p className="text-xs text-slate-500 py-3">
              No names drawn yet in this session. All selection processing runs 100% locally in your browser.
            </p>
          ) : (
            <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {history.map((item, idx) => (
                <div key={idx} className="py-2 flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">
                    #{history.length - idx} · {item.name}
                  </span>
                  <span className="font-mono text-slate-500">{item.timestamp}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right 5 Cols: Participant List Editor */}
      <div className="lg:col-span-5 bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <label
            htmlFor="participant-names-input"
            className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2"
          >
            <UserCheck className="w-4 h-4 text-[#2563EB]" />
            <span>Participant List ({names.length})</span>
          </label>

          <div className="flex items-center gap-1.5">
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.csv"
              onChange={handleImportFile}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import</span>
            </button>
            <button
              type="button"
              onClick={handleExportNames}
              className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          </div>
        </div>

        <textarea
          id="participant-names-input"
          rows={12}
          value={rawInput}
          onChange={(e) => setRawInput(e.target.value)}
          placeholder="Enter one name per line..."
          className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-slate-900 dark:text-white font-sans focus:outline-hidden focus:ring-2 focus:ring-[#2563EB]"
        />

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setRawInput(SAMPLE_NAMES)}
            className="text-xs font-semibold text-[#2563EB] hover:underline cursor-pointer"
          >
            Restore Sample List
          </button>
          <button
            type="button"
            onClick={() => setRawInput('')}
            className="text-xs font-semibold text-slate-500 hover:text-red-600 flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear List</span>
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { Users, Shuffle, Copy, Check, Download } from 'lucide-react';
import {
  parseParticipantLines,
  generateBalancedGroups,
} from '@/lib/calculators/time-calculators';

const DEFAULT_PARTICIPANTS = [
  'Alex Rivera',
  'Bianca Moretti',
  'Carlos Mendez',
  'Diana Prince',
  'Ethan Hunt',
  'Fiona Gallagher',
  'George Martin',
  'Hannah Abbott',
  'Ivan Petrov',
  'Julia Roberts',
  'Kevin Patel',
  'Laura Palmer',
  'Marcus Vance',
  'Nadia Comaneci',
].join('\n');

export default function RandomGroupGeneratorComponent() {
  const [rawText, setRawText] = useState<string>(DEFAULT_PARTICIPANTS);
  const [mode, setMode] = useState<'byGroupCount' | 'byGroupSize'>('byGroupCount');
  const [targetValue, setTargetValue] = useState<number>(4);
  const [deduplicate, setDeduplicate] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [seedCounter, setSeedCounter] = useState<number>(0);

  const participants = parseParticipantLines(rawText, deduplicate);
  const groups = React.useMemo(() => {
    void seedCounter;
    return generateBalancedGroups(participants, mode, targetValue);
  }, [participants, mode, targetValue, seedCounter]);

  const handleCopyGroups = () => {
    const formatted = groups
      .map((g, idx) => `Group ${idx + 1} (${g.length}):\n${g.map((m) => `  - ${m}`).join('\n')}`)
      .join('\n\n');
    navigator.clipboard?.writeText(formatted).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleExportCsv = () => {
    const rows = ['Group Number,Participant Name'];
    groups.forEach((g, idx) => {
      g.forEach((member) => {
        rows.push(`Group ${idx + 1},"${member.replace(/"/g, '""')}"`);
      });
    });
    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-groups.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left 5 Cols: Participant Input & Grouping Rules */}
      <div className="lg:col-span-5 bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-2xs">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-[#2563EB]" />
            <span>Participants ({participants.length})</span>
          </h2>
          <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={deduplicate}
              onChange={(e) => setDeduplicate(e.target.checked)}
              className="rounded border-slate-300 text-[#2563EB]"
            />
            <span>Prevent duplicates</span>
          </label>
        </div>

        <textarea
          rows={10}
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder="Paste participant names (one per line)..."
          className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-slate-900 dark:text-white"
        />

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setMode('byGroupCount')}
              className={`h-10 rounded-xl text-xs font-bold border cursor-pointer ${
                mode === 'byGroupCount'
                  ? 'bg-[#2563EB] text-white border-[#2563EB]'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              Number of Groups
            </button>
            <button
              type="button"
              onClick={() => setMode('byGroupSize')}
              className={`h-10 rounded-xl text-xs font-bold border cursor-pointer ${
                mode === 'byGroupSize'
                  ? 'bg-[#2563EB] text-white border-[#2563EB]'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              Max People per Group
            </button>
          </div>

          <div className="flex items-center justify-between gap-4">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {mode === 'byGroupCount' ? 'Total Groups to Create:' : 'Maximum Group Size:'}
            </label>
            <input
              type="number"
              min={1}
              max={50}
              value={targetValue}
              onChange={(e) => setTargetValue(Math.max(1, Number(e.target.value) || 2))}
              className="w-24 h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-mono font-bold text-center"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => setSeedCounter((c) => c + 1)}
          className="w-full h-11 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs cursor-pointer"
        >
          <Shuffle className="w-4 h-4" />
          <span>Shuffle &amp; Regenerate Groups</span>
        </button>
      </div>

      {/* Right 7 Cols: Generated Groups Display */}
      <div className="lg:col-span-7 space-y-4">
        <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              Generated Teams ({groups.length} Groups)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Uneven remainders are distributed evenly across groups so no team is left undersized.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyGroups}
              className="h-9 px-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Teams</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleExportCsv}
              className="h-9 px-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {groups.map((group, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-3"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                <h3 className="text-sm font-extrabold text-[#2563EB]">Group {idx + 1}</h3>
                <span className="text-xs font-mono text-slate-500">
                  {group.length} {group.length === 1 ? 'member' : 'members'}
                </span>
              </div>
              <ol className="space-y-1.5 text-sm text-slate-800 dark:text-slate-200">
                {group.map((member, mIdx) => (
                  <li key={mIdx} className="flex items-center gap-2.5">
                    <span className="text-xs font-mono text-slate-400 w-5">{mIdx + 1}.</span>
                    <span className="font-medium">{member}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

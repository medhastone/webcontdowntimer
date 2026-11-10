'use client';

import React, { useState, useEffect } from 'react';
import { Copy, Check, Clock, Binary, RefreshCw } from 'lucide-react';

export default function UnixTimestampComponent() {
  const [currentEpochSec, setCurrentEpochSec] = useState<number>(() => Math.floor(Date.now() / 1000));
  const [currentEpochMs, setCurrentEpochMs] = useState<number>(() => Date.now());

  // Conversion Inputs
  const [inputTimestamp, setInputTimestamp] = useState<string>('');
  const [inputDateStr, setInputDateStr] = useState<string>(() => new Date().toISOString().slice(0, 19));

  const [copied, setCopied] = useState<string | null>(null);

  // Live Ticker
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      setCurrentEpochMs(now);
      setCurrentEpochSec(Math.floor(now / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  // Decode input timestamp
  const parseTimestamp = (raw: string) => {
    if (!raw.trim()) return null;
    const num = Number(raw.trim());
    if (isNaN(num)) return null;

    let dateMs = num;
    // Auto-detect seconds (10 digits) vs milliseconds (13 digits) vs microseconds (16 digits)
    if (raw.trim().length <= 11) {
      dateMs = num * 1000;
    } else if (raw.trim().length >= 15) {
      dateMs = Math.floor(num / 1000);
    }

    const d = new Date(dateMs);
    if (isNaN(d.getTime())) return null;

    return {
      dateObj: d,
      utc: d.toUTCString(),
      iso: d.toISOString(),
      local: d.toLocaleString(),
      relative: getRelativeTimeString(d, currentEpochMs),
    };
  };

  const getRelativeTimeString = (date: Date, nowMs: number) => {
    const diffSec = Math.round((date.getTime() - nowMs) / 1000);
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const absDiff = Math.abs(diffSec);

    if (absDiff < 60) return rtf.format(diffSec, 'second');
    if (absDiff < 3600) return rtf.format(Math.round(diffSec / 60), 'minute');
    if (absDiff < 86400) return rtf.format(Math.round(diffSec / 3600), 'hour');
    return rtf.format(Math.round(diffSec / 86400), 'day');
  };

  const decoded = parseTimestamp(inputTimestamp || String(currentEpochSec));

  // Convert Date to timestamp
  const dateToTimestampMs = new Date(inputDateStr).getTime();
  const dateToTimestampSec = Math.floor(dateToTimestampMs / 1000);

  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-sm space-y-8">
      {/* Live Unix Epoch Ticker */}
      <div className="p-6 rounded-2xl bg-neutral-950 text-white border border-neutral-800 text-center space-y-2">
        <div className="text-xs font-mono uppercase tracking-widest text-neutral-400">
          Current Live Unix Epoch Timestamp
        </div>
        <div className="flex items-center justify-center gap-3">
          <div className="font-mono text-5xl sm:text-7xl font-black tabular-nums tracking-tight text-amber-400 select-all">
            {currentEpochSec}
          </div>
          <button
            onClick={() => copyToClipboard(String(currentEpochSec), 'current')}
            className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors"
            title="Copy Current Epoch"
          >
            {copied === 'current' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
        <div className="text-xs font-mono text-neutral-400">
          Milliseconds: <span className="text-neutral-300">{currentEpochMs}</span>
        </div>
      </div>

      {/* Convert Timestamp to Human Date */}
      <div className="space-y-4 p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
            Convert Timestamp → Human-Readable Date
          </h3>
          <button
            onClick={() => setInputTimestamp(String(currentEpochSec))}
            className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            Set to Now
          </button>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={inputTimestamp}
            onChange={(e) => setInputTimestamp(e.target.value)}
            placeholder={`Enter timestamp (e.g. ${currentEpochSec})`}
            className="flex-1 py-2.5 px-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono text-sm"
          />
        </div>

        {decoded && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-mono">
            <div className="p-3 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <span className="text-neutral-400 block text-[10px] uppercase font-sans">GMT / UTC Format</span>
              <span className="font-semibold text-neutral-900 dark:text-white">{decoded.utc}</span>
            </div>
            <div className="p-3 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <span className="text-neutral-400 block text-[10px] uppercase font-sans">ISO-8601</span>
              <span className="font-semibold text-neutral-900 dark:text-white">{decoded.iso}</span>
            </div>
            <div className="p-3 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <span className="text-neutral-400 block text-[10px] uppercase font-sans">Local Browser Time</span>
              <span className="font-semibold text-neutral-900 dark:text-white">{decoded.local}</span>
            </div>
            <div className="p-3 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <span className="text-neutral-400 block text-[10px] uppercase font-sans">Relative Time</span>
              <span className="font-semibold text-neutral-900 dark:text-white">{decoded.relative}</span>
            </div>
          </div>
        )}
      </div>

      {/* Convert Human Date to Timestamp */}
      <div className="space-y-4 p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
        <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
          Convert Date & Time → Unix Epoch
        </h3>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="datetime-local"
            value={inputDateStr}
            onChange={(e) => setInputDateStr(e.target.value)}
            className="py-2.5 px-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono text-sm"
          />

          {!isNaN(dateToTimestampSec) && (
            <div className="flex-1 flex items-center justify-between p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-mono">
              <div>
                <span className="text-neutral-400 mr-2">Epoch Seconds:</span>
                <span className="text-base font-bold text-neutral-900 dark:text-white">{dateToTimestampSec}</span>
              </div>
              <button
                onClick={() => copyToClipboard(String(dateToTimestampSec), 'converted')}
                className="p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                {copied === 'converted' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

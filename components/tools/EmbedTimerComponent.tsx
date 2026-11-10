'use client';

import React, { useState } from 'react';
import { Code2, Copy, Check, Eye, Sliders } from 'lucide-react';

export default function EmbedTimerComponent() {
  const [widgetType, setWidgetType] = useState<'countdown' | 'visual' | 'stopwatch'>('countdown');
  const [title, setTitle] = useState<string>('Session Starts In');
  const [minutes, setMinutes] = useState<number>(15);
  const [seconds, setSeconds] = useState<number>(0);
  const [theme, setTheme] = useState<'midnight' | 'light'>('midnight');
  const [widthPx, setWidthPx] = useState<number>(420);
  const [heightPx, setHeightPx] = useState<number>(260);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const totalSeconds = Math.max(5, Math.min(86400, minutes * 60 + seconds));
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://WebCountDownTimer.com';
  const widgetPath = `/embed-widget?type=${widgetType}&d=${totalSeconds}&theme=${theme}&title=${encodeURIComponent(
    title.slice(0, 60)
  )}`;
  const fullWidgetUrl = `${origin}${widgetPath}`;

  const iframeSnippet = `<iframe
  src="${fullWidgetUrl}"
  width="${widthPx}"
  height="${heightPx}"
  style="border:0;border-radius:16px;overflow:hidden;max-width:100%;"
  sandbox="allow-scripts allow-same-origin"
  loading="lazy"
  title="${title.replace(/"/g, '&quot;')} – WebCountDownTimer Embed"
></iframe>`;

  const handleCopySnippet = () => {
    navigator.clipboard?.writeText(iframeSnippet).catch(() => {});
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left 6 Cols: Widget Configuration */}
      <div className="lg:col-span-6 bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-2xs">
        <div className="flex items-center gap-2 text-base font-extrabold text-slate-900 dark:text-white">
          <Sliders className="w-4 h-4 text-[#2563EB]" />
          <h2>Configure Embeddable Timer Widget</h2>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            Widget Type
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['countdown', 'visual', 'stopwatch'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setWidgetType(t)}
                className={`h-10 rounded-xl text-xs font-bold capitalize border transition-all cursor-pointer ${
                  widgetType === t
                    ? 'bg-[#2563EB] text-white border-[#2563EB]'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                {t} Timer
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            Widget Heading
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={60}
            className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white"
          />
        </div>

        {widgetType !== 'stopwatch' && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Minutes
              </label>
              <input
                type="number"
                min={0}
                max={999}
                value={minutes}
                onChange={(e) => setMinutes(Math.max(0, Number(e.target.value) || 0))}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Seconds
              </label>
              <input
                type="number"
                min={0}
                max={59}
                value={seconds}
                onChange={(e) => setSeconds(Math.max(0, Math.min(59, Number(e.target.value) || 0)))}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-mono font-bold"
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Theme
            </label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as 'midnight' | 'light')}
              className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
            >
              <option value="midnight">Midnight Navy</option>
              <option value="light">Cloud White</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Width (px)
            </label>
            <input
              type="number"
              min={260}
              max={1200}
              value={widthPx}
              onChange={(e) => setWidthPx(Math.max(260, Number(e.target.value) || 420))}
              className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Height (px)
            </label>
            <input
              type="number"
              min={180}
              max={800}
              value={heightPx}
              onChange={(e) => setHeightPx(Math.max(180, Number(e.target.value) || 260))}
              className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold"
            />
          </div>
        </div>

        {/* Sandboxed Iframe Code Output */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-[#2563EB]" />
              <span>Sandboxed Embed Code</span>
            </span>
            <button
              type="button"
              onClick={handleCopySnippet}
              className="px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-blue-600 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              {copiedCode ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied HTML!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Embed Code</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-3.5 rounded-xl bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto leading-relaxed">
            {iframeSnippet}
          </pre>
        </div>
      </div>

      {/* Right 6 Cols: Live Interactive Preview */}
      <div className="lg:col-span-6 bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-base font-extrabold text-slate-900 dark:text-white">
            <Eye className="w-4 h-4 text-[#2563EB]" />
            <h2>Live Widget Preview</h2>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {widthPx} × {heightPx} px
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex items-center justify-center overflow-x-auto">
          <iframe
            key={widgetPath}
            src={widgetPath}
            width={widthPx}
            height={heightPx}
            className="rounded-2xl border-0 shadow-md max-w-full"
            sandbox="allow-scripts allow-same-origin"
            title="Live Embed Timer Preview"
          />
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Works in Notion, Confluence, WordPress, Webflow, Canvas LMS, and custom HTML sites using a strict{' '}
          <code className="font-mono text-slate-700 dark:text-slate-200">sandbox</code> attribute with zero third-party tracking scripts.
        </p>
      </div>
    </div>
  );
}

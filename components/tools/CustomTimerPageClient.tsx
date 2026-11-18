'use client';

import React, { Suspense, useSyncExternalStore } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Bookmark, Sparkles, ArrowRight, Trash2, RotateCcw } from 'lucide-react';
import VisualTimerComponent from '@/components/tools/VisualTimerComponent';
import {
  subscribeCustomTimers,
  getCustomTimersSnapshot,
  getServerCustomTimersSnapshot,
  buildCustomTimerHref,
  deleteSavedTimer,
  restoreDefaultSavedTimers,
  DEFAULT_CUSTOM_TIMERS,
} from '@/lib/custom-timers-store';
import { CustomTimerIcon } from '@/components/ui/CustomTimerIcon';

function CustomTimerDynamicBanner() {
  const searchParams = useSearchParams();
  const savedTimers = useSyncExternalStore(
    subscribeCustomTimers,
    getCustomTimersSnapshot,
    getServerCustomTimersSnapshot
  );

  const idParam = searchParams?.get('id');
  const titleParam = searchParams?.get('vt_title');
  const descParam = searchParams?.get('vt_desc');

  const activeSaved = idParam ? savedTimers.find((t) => t.id === idParam) : undefined;
  const displayTitle = activeSaved?.title || titleParam;
  const displayDesc = activeSaved?.subtitle || descParam;
  const missingPreSaved = DEFAULT_CUSTOM_TIMERS.some(
    (d) => !savedTimers.some((s) => s.id === d.id)
  );

  return (
    <div className="mb-6 space-y-4">
      {displayTitle && (
        <div className="p-4 sm:p-5 rounded-2xl border border-[#365C4B]/30 bg-[#E7EDE7]/60 dark:bg-[#1E2722] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            {activeSaved && (
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs"
                style={{ backgroundColor: activeSaved.color }}
              >
                <CustomTimerIcon icon={activeSaved.icon} className="w-5 h-5" />
              </div>
            )}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#365C4B] dark:text-[#70B393] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Custom Saved Timer View</span>
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-[#252B27] dark:text-white mt-0.5">
                {displayTitle}
              </h2>
              {displayDesc && (
                <p className="text-xs sm:text-sm text-[#252B27]/75 dark:text-slate-300 mt-0.5">
                  {displayDesc}
                </p>
              )}
            </div>
          </div>
          <Link
            href="/custom-timer"
            className="text-xs font-semibold text-[#365C4B] dark:text-[#70B393] hover:underline whitespace-nowrap shrink-0"
          >
            + Create Another Custom Timer
          </Link>
        </div>
      )}

      {/* Quick Saved List Ribbon for Instant Switching & Deleting */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#252B27]/70 dark:text-slate-300 whitespace-nowrap shrink-0 mr-1">
          <Bookmark className="w-3.5 h-3.5 text-[#365C4B] dark:text-[#70B393]" />
          <span>Saved List ({savedTimers.length}):</span>
        </span>
        {savedTimers.map((item) => {
          const isCurrent = idParam === item.id;
          return (
            <div
              key={item.id}
              className={`inline-flex items-center rounded-xl border text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                isCurrent
                  ? 'border-[#365C4B] bg-[#365C4B] text-white shadow-2xs'
                  : 'border-[#E4E1D9] dark:border-[#2A342D] bg-white dark:bg-[#1A201C] text-[#252B27] dark:text-slate-200 hover:border-[#365C4B]'
              }`}
            >
              <Link
                href={buildCustomTimerHref(item)}
                className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1.5"
              >
                <CustomTimerIcon icon={item.icon} className="w-3.5 h-3.5" />
                <span>{item.title}</span>
                <ArrowRight className="w-3 h-3 opacity-60" />
              </Link>
              <button
                type="button"
                onClick={() => deleteSavedTimer(item.id)}
                className={`p-1.5 mr-1 rounded-lg transition-colors cursor-pointer ${
                  isCurrent
                    ? 'text-white/80 hover:text-white hover:bg-white/15'
                    : 'text-slate-400 hover:text-[#D94343] hover:bg-[#D94343]/10'
                }`}
                title={`Delete ${item.title} from saved list`}
                aria-label={`Delete ${item.title} from saved list`}
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          );
        })}
        {missingPreSaved && (
          <button
            type="button"
            onClick={() => restoreDefaultSavedTimers()}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-dashed border-[#365C4B]/50 text-xs font-semibold text-[#365C4B] dark:text-[#70B393] hover:bg-[#365C4B]/10 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Restore Pre-Saved</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default function CustomTimerPageClient() {
  return (
    <Suspense
      fallback={
        <div className="w-full rounded-2xl border border-[#E4E1D9] dark:border-[#2A342D] bg-white dark:bg-[#181F1B] p-8 text-center text-sm opacity-70">
          Loading Custom Timer Studio...
        </div>
      }
    >
      <CustomTimerDynamicBanner />
      <VisualTimerComponent />
    </Suspense>
  );
}

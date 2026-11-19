'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Keyboard, X } from 'lucide-react';
import SharePageButton from '@/components/common/SharePageButton';

interface ToolShortcutsStageProps {
  isCalculatorOrClock: boolean;
  hasBuiltInShortcutsModal: boolean;
  children: React.ReactNode;
}

export default function ToolShortcutsStage({
  isCalculatorOrClock,
  hasBuiltInShortcutsModal,
  children,
}: ToolShortcutsStageProps) {
  const toolContainerRef = useRef<HTMLDivElement>(null);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [shortcutFeedback, setShortcutFeedback] = useState<string | null>(null);
  const feedbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showBriefFeedback = useCallback((label: string) => {
    setShortcutFeedback(label);
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
    }
    feedbackTimeoutRef.current = setTimeout(() => {
      setShortcutFeedback(null);
    }, 1400);
  }, []);

  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
      }
    };
  }, []);

  const triggerToolShortcut = useCallback(
    (action: 'start-pause' | 'reset' | 'fullscreen' | 'mute' | 'lap' | 'escape') => {
      const container = toolContainerRef.current;
      if (!container) return false;

      const allButtons = Array.from(
        container.querySelectorAll<HTMLButtonElement>('button:not([data-shortcuts-ui="true"])')
      ).filter((btn) => !btn.disabled);

      const getBtnLabel = (btn: HTMLButtonElement) => {
        const text = (btn.textContent || '').replace(/\s+/g, ' ').trim().toLowerCase();
        const aria = (btn.getAttribute('aria-label') || '').trim().toLowerCase();
        const title = (btn.getAttribute('title') || '').trim().toLowerCase();
        return { text, aria, title };
      };

      if (action === 'start-pause') {
        const startResumeBtn = allButtons.find((btn) => {
          const { text, aria } = getBtnLabel(btn);
          return (
            text === 'start' ||
            text === 'resume' ||
            text.startsWith('start ') ||
            text.startsWith('resume ') ||
            text.startsWith('begin ') ||
            text === 'spin' ||
            text === 'spin wheel' ||
            aria.startsWith('start') ||
            aria.startsWith('resume')
          );
        });
        if (startResumeBtn) {
          startResumeBtn.click();
          showBriefFeedback('Start / Resume (Space)');
          return true;
        }

        const pauseStopBtn = allButtons.find((btn) => {
          const { text, aria } = getBtnLabel(btn);
          return (
            text === 'pause' ||
            text === 'stop' ||
            text.startsWith('pause ') ||
            text.startsWith('stop ') ||
            aria.startsWith('pause') ||
            aria.startsWith('stop')
          );
        });
        if (pauseStopBtn) {
          pauseStopBtn.click();
          showBriefFeedback('Paused (Space)');
          return true;
        }
        return false;
      }

      if (action === 'reset') {
        const resetBtn = allButtons.find((btn) => {
          const { text, aria } = getBtnLabel(btn);
          return (
            text === 'reset' ||
            text === 'reset timer' ||
            text === 'reset clocks' ||
            aria === 'reset' ||
            aria === 'reset timer' ||
            (text.startsWith('reset') &&
              !text.includes('score') &&
              !text.includes('board') &&
              !text.includes('pre-saved'))
          );
        });
        if (resetBtn) {
          resetBtn.click();
          showBriefFeedback('Reset Timer (R)');
          return true;
        }
        return false;
      }

      if (action === 'lap') {
        const lapBtn = allButtons.find((btn) => {
          const { text, aria } = getBtnLabel(btn);
          return text === 'lap' || text === 'split' || aria.includes('lap');
        });
        if (lapBtn) {
          lapBtn.click();
          showBriefFeedback('Lap Recorded (L)');
          return true;
        }
        return false;
      }

      if (action === 'fullscreen') {
        const fsStage =
          container.querySelector('.timer-fullscreen-stage') ||
          document.querySelector('.timer-fullscreen-stage');
        const isCurrentlyFs = Boolean(document.fullscreenElement || fsStage);

        if (isCurrentlyFs) {
          const exitBtn = allButtons.find((btn) => {
            const { text, aria, title } = getBtnLabel(btn);
            return (
              text.includes('exit fullscreen') ||
              aria.includes('exit fullscreen') ||
              title.includes('exit fullscreen') ||
              text === 'fullscreen' ||
              aria.includes('fullscreen')
            );
          });
          if (exitBtn) {
            exitBtn.click();
            showBriefFeedback('Exited Fullscreen (F)');
            return true;
          }
          if (document.fullscreenElement && document.exitFullscreen) {
            document.exitFullscreen().catch(() => {});
            showBriefFeedback('Exited Fullscreen (F)');
            return true;
          }
        } else {
          const fsBtn = allButtons.find((btn) => {
            const { text, aria, title } = getBtnLabel(btn);
            const parentText = (btn.parentElement?.textContent || '').toLowerCase();
            return (
              text === 'fullscreen' ||
              text.includes('fullscreen') ||
              aria.includes('fullscreen') ||
              title.includes('fullscreen') ||
              (btn.getAttribute('role') === 'switch' && parentText.includes('fullscreen'))
            );
          });
          if (fsBtn) {
            fsBtn.click();
            showBriefFeedback('Fullscreen Toggled (F)');
            return true;
          }
        }
        return false;
      }

      if (action === 'mute') {
        const muteBtn = allButtons.find((btn) => {
          const { text, aria, title } = getBtnLabel(btn);
          const parentText = (btn.parentElement?.textContent || '').toLowerCase();
          return (
            aria.includes('sound') ||
            aria.includes('mute') ||
            aria.includes('audio') ||
            title.includes('sound') ||
            title.includes('mute') ||
            text === 'sound on' ||
            text === 'muted' ||
            (btn.getAttribute('role') === 'switch' &&
              (parentText.includes('sound') || parentText.includes('alarm')))
          );
        });
        if (muteBtn) {
          muteBtn.click();
          showBriefFeedback('Sound Toggled (M)');
          return true;
        }
        return false;
      }

      if (action === 'escape') {
        const fsStage =
          container.querySelector('.timer-fullscreen-stage') ||
          document.querySelector('.timer-fullscreen-stage');
        if (fsStage || document.fullscreenElement) {
          const exitBtn = allButtons.find((btn) => {
            const { text, aria, title } = getBtnLabel(btn);
            return (
              text.includes('exit fullscreen') ||
              aria.includes('exit fullscreen') ||
              title.includes('exit fullscreen')
            );
          });
          if (exitBtn) {
            exitBtn.click();
            return true;
          }
        }
        return false;
      }

      return false;
    },
    [showBriefFeedback]
  );

  useEffect(() => {
    if (isCalculatorOrClock) return;

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const targetEl = e.target as HTMLElement | null;
      const tag = targetEl?.tagName;

      if (tag === 'TEXTAREA' || tag === 'SELECT' || targetEl?.isContentEditable) {
        if (e.key === 'Escape') {
          targetEl?.blur?.();
        }
        return;
      }

      if (tag === 'INPUT') {
        const inputEl = targetEl as HTMLInputElement;
        const inputType = (inputEl.type || 'text').toLowerCase();
        const inputMode = (inputEl.getAttribute('inputmode') || '').toLowerCase();
        const isNumericOrControlInput =
          inputMode === 'numeric' ||
          inputMode === 'decimal' ||
          inputType === 'number' ||
          inputType === 'range' ||
          inputType === 'time' ||
          inputType === 'checkbox' ||
          inputType === 'radio' ||
          inputType === 'color';

        if (!isNumericOrControlInput) {
          if (e.key === 'Escape') {
            inputEl.blur();
          }
          return;
        }
      }

      if (e.key === 'Escape') {
        if (showShortcutsModal) {
          e.preventDefault();
          setShowShortcutsModal(false);
          return;
        }
        if (triggerToolShortcut('escape')) {
          e.preventDefault();
        }
        return;
      }

      if (e.key === '?' || (e.shiftKey && e.code === 'Slash')) {
        if (!hasBuiltInShortcutsModal) {
          e.preventDefault();
          targetEl?.blur?.();
          setShowShortcutsModal((prev) => !prev);
        }
        return;
      }

      if (e.code === 'Space' || e.key === ' ') {
        targetEl?.blur?.();
        if (showShortcutsModal) setShowShortcutsModal(false);
        if (triggerToolShortcut('start-pause')) {
          e.preventDefault();
        }
      } else if (e.key === 'r' || e.key === 'R') {
        targetEl?.blur?.();
        if (showShortcutsModal) setShowShortcutsModal(false);
        if (triggerToolShortcut('reset')) {
          e.preventDefault();
        }
      } else if (e.key === 'f' || e.key === 'F') {
        targetEl?.blur?.();
        if (showShortcutsModal) setShowShortcutsModal(false);
        if (triggerToolShortcut('fullscreen')) {
          e.preventDefault();
        }
      } else if (e.key === 'm' || e.key === 'M') {
        targetEl?.blur?.();
        if (triggerToolShortcut('mute')) {
          e.preventDefault();
        }
      } else if (e.key === 'l' || e.key === 'L') {
        targetEl?.blur?.();
        if (triggerToolShortcut('lap')) {
          e.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [
    isCalculatorOrClock,
    hasBuiltInShortcutsModal,
    showShortcutsModal,
    triggerToolShortcut,
  ]);

  return (
    <>
      <div
        ref={toolContainerRef}
        className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10"
      >
        {!isCalculatorOrClock && (
          <div
            data-shortcuts-ui="true"
            className="mb-4 flex flex-wrap items-center justify-between gap-2.5 px-3.5 py-2 rounded-2xl bg-white/80 dark:bg-[#1A201C]/90 border border-[#E4E1D9] dark:border-[#2D352F] text-xs"
          >
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="inline-flex items-center gap-1.5 font-semibold text-[#252B27]/75 dark:text-slate-300 mr-1">
                <Keyboard className="w-3.5 h-3.5 text-[#365C4B] dark:text-[#5E917A]" />
                <span>Quick Controls:</span>
              </span>
              <button
                type="button"
                data-shortcuts-ui="true"
                onClick={() => triggerToolShortcut('start-pause')}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F7F6F2] dark:bg-[#222924] hover:bg-[#E7EDE7] dark:hover:bg-[#2A342D] border border-[#E4E1D9] dark:border-[#323D36] text-[#252B27] dark:text-slate-200 font-medium transition-colors cursor-pointer"
                title="Press Spacebar or click to Start / Pause timer"
              >
                <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-[#141816] border border-[#D8D4CA] dark:border-[#3A463E] font-mono text-[10px] font-bold text-[#365C4B] dark:text-[#70B393]">
                  Space
                </kbd>
                <span>Start / Pause</span>
              </button>

              <button
                type="button"
                data-shortcuts-ui="true"
                onClick={() => triggerToolShortcut('reset')}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F7F6F2] dark:bg-[#222924] hover:bg-[#E7EDE7] dark:hover:bg-[#2A342D] border border-[#E4E1D9] dark:border-[#323D36] text-[#252B27] dark:text-slate-200 font-medium transition-colors cursor-pointer"
                title="Press R or click to Reset timer"
              >
                <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-[#141816] border border-[#D8D4CA] dark:border-[#3A463E] font-mono text-[10px] font-bold text-[#365C4B] dark:text-[#70B393]">
                  R
                </kbd>
                <span>Reset</span>
              </button>

              <button
                type="button"
                data-shortcuts-ui="true"
                onClick={() => triggerToolShortcut('fullscreen')}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F7F6F2] dark:bg-[#222924] hover:bg-[#E7EDE7] dark:hover:bg-[#2A342D] border border-[#E4E1D9] dark:border-[#323D36] text-[#252B27] dark:text-slate-200 font-medium transition-colors cursor-pointer"
                title="Press F or click to toggle Fullscreen"
              >
                <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-[#141816] border border-[#D8D4CA] dark:border-[#3A463E] font-mono text-[10px] font-bold text-[#365C4B] dark:text-[#70B393]">
                  F
                </kbd>
                <span>Fullscreen</span>
              </button>

              <button
                type="button"
                data-shortcuts-ui="true"
                onClick={() => triggerToolShortcut('mute')}
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F7F6F2] dark:bg-[#222924] hover:bg-[#E7EDE7] dark:hover:bg-[#2A342D] border border-[#E4E1D9] dark:border-[#323D36] text-[#252B27] dark:text-slate-200 font-medium transition-colors cursor-pointer"
                title="Press M or click to toggle Sound"
              >
                <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-[#141816] border border-[#D8D4CA] dark:border-[#3A463E] font-mono text-[10px] font-bold text-[#365C4B] dark:text-[#70B393]">
                  M
                </kbd>
                <span>Sound</span>
              </button>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              {shortcutFeedback && (
                <span className="px-2.5 py-1 rounded-full bg-[#365C4B] text-white text-[11px] font-semibold animate-in fade-in duration-150">
                  {shortcutFeedback}
                </span>
              )}
              {!hasBuiltInShortcutsModal && (
                <button
                  type="button"
                  data-shortcuts-ui="true"
                  onClick={() => setShowShortcutsModal(true)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#E7EDE7]/70 dark:bg-[#252E28] hover:bg-[#E7EDE7] text-[#365C4B] dark:text-[#70B393] font-semibold transition-colors cursor-pointer"
                  aria-label="Open Keyboard Shortcuts Guide"
                >
                  <span>All Shortcuts</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-white/80 dark:bg-[#141816] font-mono text-[10px]">
                    ?
                  </kbd>
                </button>
              )}
              <SharePageButton variant="toolbar" />
            </div>
          </div>
        )}

        {isCalculatorOrClock && (
          <div className="mb-3 flex items-center justify-end">
            <SharePageButton variant="toolbar" />
          </div>
        )}

        <div className="min-h-[420px] sm:min-h-[480px] tabular-nums">
          {children}
        </div>
      </div>

      {showShortcutsModal && !isCalculatorOrClock && (
        <div
          data-shortcuts-ui="true"
          className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setShowShortcutsModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="universal-shortcuts-title"
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-[#E4E1D9] dark:border-[#2D352F] bg-white dark:bg-[#1A201C] text-[#252B27] dark:text-white p-5 sm:p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 pb-3.5 border-b border-[#E4E1D9] dark:border-[#2D352F]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#365C4B] flex items-center justify-center text-white shrink-0">
                  <Keyboard className="w-4 h-4" />
                </div>
                <div>
                  <h3 id="universal-shortcuts-title" className="text-sm sm:text-base font-bold leading-tight">
                    Keyboard Shortcuts
                  </h3>
                  <p className="text-[11px] text-[#252B27]/60 dark:text-slate-400">
                    Press the key or click any row below
                  </p>
                </div>
              </div>
              <button
                type="button"
                data-shortcuts-ui="true"
                onClick={() => setShowShortcutsModal(false)}
                className="p-1.5 rounded-lg text-[#252B27]/60 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close keyboard shortcuts modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-2 text-xs sm:text-sm">
              {(
                [
                  {
                    id: 'start-pause' as const,
                    action: 'Start / Pause / Resume timer',
                    keyLabel: 'Spacebar',
                  },
                  {
                    id: 'reset' as const,
                    action: 'Reset timer to initial duration',
                    keyLabel: 'R',
                  },
                  {
                    id: 'fullscreen' as const,
                    action: 'Toggle Fullscreen display',
                    keyLabel: 'F',
                  },
                  {
                    id: 'mute' as const,
                    action: 'Toggle Sound / Mute alerts',
                    keyLabel: 'M',
                  },
                  {
                    id: 'escape' as const,
                    action: 'Exit Fullscreen / Close modal',
                    keyLabel: 'Esc',
                  },
                ]
              ).map((item) => (
                <button
                  key={item.keyLabel}
                  type="button"
                  data-shortcuts-ui="true"
                  onClick={() => {
                    setShowShortcutsModal(false);
                    triggerToolShortcut(item.id);
                  }}
                  className="w-full flex items-center justify-between gap-4 px-3.5 py-2.5 rounded-xl bg-[#F7F6F2] dark:bg-[#222924] border border-transparent hover:border-[#365C4B]/40 transition-all cursor-pointer text-left"
                >
                  <span className="font-medium text-[#252B27]/90 dark:text-slate-200">
                    {item.action}
                  </span>
                  <kbd className="px-2.5 py-1 rounded-lg border border-[#E4E1D9] dark:border-[#2A342D] bg-white dark:bg-[#181F1B] font-mono text-xs font-semibold shadow-2xs shrink-0">
                    {item.keyLabel}
                  </kbd>
                </button>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                data-shortcuts-ui="true"
                onClick={() => setShowShortcutsModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#365C4B] text-white transition-opacity hover:opacity-95 cursor-pointer"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

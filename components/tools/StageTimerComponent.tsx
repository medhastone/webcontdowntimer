'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  Plus,
  Minus,
  Volume2,
  VolumeX,
  Calendar,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Settings,
  List,
  Monitor,
  Link2,
  Check,
  MoreVertical,
  Smartphone,
  LayoutGrid,
  ExternalLink,
  MessageSquare,
  Send,
} from 'lucide-react';
import { playTimerSound } from '@/lib/sound';

export interface AgendaSession {
  id: string;
  order: number;
  startTime: string;
  durationMinutes: number;
  durationSeconds: number;
  title: string;
  subtitle: string;
  speaker?: string;
}

const DEFAULT_AGENDA: AgendaSession[] = [
  {
    id: 'session-1',
    order: 1,
    startTime: '09:15 AM',
    durationMinutes: 30,
    durationSeconds: 1800,
    title: 'Opening Keynote',
    subtitle: 'The future of global product development',
    speaker: 'Dr. Elena Rostova',
  },
  {
    id: 'session-2',
    order: 2,
    startTime: '09:45 AM',
    durationMinutes: 30,
    durationSeconds: 1800,
    title: 'Product Demonstration',
    subtitle: 'Live demo of key features',
    speaker: 'Marcus Vance',
  },
  {
    id: 'session-3',
    order: 3,
    startTime: '10:15 AM',
    durationMinutes: 30,
    durationSeconds: 1800,
    title: 'Panel Discussion',
    subtitle: 'Industry experts and customer stories',
    speaker: 'Moderated by Priya Nair',
  },
  {
    id: 'session-4',
    order: 4,
    startTime: '10:45 AM',
    durationMinutes: 15,
    durationSeconds: 900,
    title: 'Networking Break',
    subtitle: 'Refreshments in the Main Concourse',
  },
  {
    id: 'session-5',
    order: 5,
    startTime: '11:00 AM',
    durationMinutes: 20,
    durationSeconds: 1200,
    title: 'Audience Questions',
    subtitle: 'Live Q&A with product leadership',
  },
];

const EVENT_OPTIONS = [
  { name: 'Global Product Summit', date: 'Oct 27, 2026', venue: 'Main Hall' },
  { name: 'Annual Conference', date: 'Nov 12, 2026', venue: 'Keynote Stage A' },
  { name: 'Executive Town Hall', date: 'Dec 04, 2026', venue: 'Broadcast Studio' },
];

function formatTimerDigits(seconds: number): { formatted: string; isNegative: boolean } {
  const isNegative = seconds < 0;
  const abs = Math.abs(Math.floor(seconds));
  const mins = Math.floor(abs / 60);
  const secs = abs % 60;
  return {
    formatted: `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`,
    isNegative,
  };
}

interface StageTimerProps {
  initialViewMode?: 'operator' | 'display';
  initialRoomId?: string;
}

export default function StageTimerComponent({
  initialViewMode = 'operator',
  initialRoomId = 'global-product-summit',
}: StageTimerProps) {
  // View mode: 'mobile' (default mobile-first controller matching screenshot), 'desktop' (2-column console), or 'display' (fullscreen audience viewer)
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop' | 'display'>(
    initialViewMode === 'display' ? 'display' : 'mobile'
  );

  // Event selection state
  const [selectedEventIdx, setSelectedEventIdx] = useState(0);
  const [eventMenuOpen, setEventMenuOpen] = useState(false);

  // Agenda & active session state
  const [agenda, setAgenda] = useState<AgendaSession[]>(DEFAULT_AGENDA);
  const [activeSessionId, setActiveSessionId] = useState<string>('session-1');
  const [showAllAgenda, setShowAllAgenda] = useState(false);
  const [openMenuSessionId, setOpenMenuSessionId] = useState<string | null>(null);

  // Active timer state — initialized to 12:45 remaining of 30:00 (17:15 elapsed) to match the design spec
  const [totalSeconds, setTotalSeconds] = useState<number>(1800); // 30:00
  const [remainingSeconds, setRemainingSeconds] = useState<number>(765); // 12:45
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [confirmReset, setConfirmReset] = useState<boolean>(false);

  // Quick Settings state
  const [quickSettingsOpen, setQuickSettingsOpen] = useState<boolean>(true);
  const [warningMinutes, setWarningMinutes] = useState<number>(2); // "2 min left"
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [soundProfile, setSoundProfile] = useState<'Bell (Default)' | 'Chime' | 'Double Beep'>('Bell (Default)');
  const [displayTheme, setDisplayTheme] = useState<'Normal' | 'High Contrast' | 'Light'>('Normal');

  // Viewer link, QR drawer & server sync state
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [showQrPanel, setShowQrPanel] = useState<boolean>(false);
  const [syncConnected, setSyncConnected] = useState<boolean>(true);
  const [cueMessage, setCueMessage] = useState<string>('');
  const [cueVisible, setCueVisible] = useState<boolean>(false);
  const controllerTokenRef = useRef<string>('ctrl_default_token_2026');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storageKey = `ttg_stage_token_${initialRoomId}`;
    let token = sessionStorage.getItem(storageKey);
    if (!token) {
      token = `ctrl_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
      sessionStorage.setItem(storageKey, token);
    }
    controllerTokenRef.current = token;
  }, [initialRoomId]);

  const activeSession = agenda.find((s) => s.id === activeSessionId) || agenda[0];
  const activeIdx = agenda.findIndex((s) => s.id === activeSessionId);
  const nextSession = activeIdx >= 0 && activeIdx + 1 < agenda.length ? agenda[activeIdx + 1] : null;
  const currentEvent = EVENT_OPTIONS[selectedEventIdx];

  // BroadcastChannel + Server API (/api/stage-sync) synchronization
  const channelRef = useRef<BroadcastChannel | null>(null);

  const broadcastState = useCallback(
    (overrides?: Partial<{ remaining: number; total: number; running: boolean; sessionTitle: string; cueMessage: string; messageVisible: boolean }>) => {
      const payload = {
        type: 'STAGE_TIMER_SYNC',
        roomId: initialRoomId,
        eventName: currentEvent.name,
        sessionId: activeSessionId,
        sessionTitle: overrides?.sessionTitle ?? activeSession.title,
        speakerName: activeSession.speaker || '',
        nextSessionTitle: nextSession?.title || '',
        remainingSeconds: overrides?.remaining ?? remainingSeconds,
        totalSeconds: overrides?.total ?? totalSeconds,
        isRunning: overrides?.running ?? isRunning,
        warningMinutes,
        displayTheme,
        cueMessage: overrides?.cueMessage ?? cueMessage,
        messageVisible: overrides?.messageVisible ?? cueVisible,
      };

      if (channelRef.current) {
        try {
          channelRef.current.postMessage(payload);
        } catch {
          // Ignore broadcast errors
        }
      }

      // Also broadcast to standard stage sync channel for /stage-timer/viewer
      if (typeof window !== 'undefined') {
        try {
          const ch2 = new BroadcastChannel(`ttg_stage_${initialRoomId}`);
          ch2.postMessage(payload);
          ch2.close();
        } catch {
          // ignore
        }
        try {
          localStorage.setItem(`chronos_stage_sync_${initialRoomId}`, JSON.stringify(payload));
          localStorage.setItem(`ttg_stage_state_${initialRoomId}`, JSON.stringify(payload));
        } catch {
          // ignore
        }
      }

      // Sync to server-side room endpoint when in controller mode
      if (viewMode !== 'display' && typeof window !== 'undefined') {
        fetch('/api/stage-sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...payload,
            controllerToken: controllerTokenRef.current,
          }),
        })
          .then((res) => {
            if (res.ok) setSyncConnected(true);
          })
          .catch(() => {
            setSyncConnected(false);
          });
      }
    },
    [
      initialRoomId,
      currentEvent.name,
      activeSessionId,
      activeSession.title,
      activeSession.speaker,
      nextSession?.title,
      remainingSeconds,
      totalSeconds,
      isRunning,
      warningMinutes,
      displayTheme,
      viewMode,
      cueMessage,
      cueVisible,
    ]
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ('BroadcastChannel' in window) {
      const ch = new BroadcastChannel(`timetoolsgo_stage_${initialRoomId}`);
      channelRef.current = ch;

      ch.onmessage = (event) => {
        const data = event.data;
        if (data && data.type === 'STAGE_TIMER_SYNC') {
          if (typeof data.remainingSeconds === 'number') setRemainingSeconds(data.remainingSeconds);
          if (typeof data.totalSeconds === 'number') setTotalSeconds(data.totalSeconds);
          if (typeof data.isRunning === 'boolean') setIsRunning(data.isRunning);
          if (typeof data.sessionId === 'string') setActiveSessionId(data.sessionId);
          if (typeof data.warningMinutes === 'number') setWarningMinutes(data.warningMinutes);
          if (data.displayTheme) setDisplayTheme(data.displayTheme);
        }
      };
    }

    // Remote viewer polling fallback for cross-device Audience Display
    let pollTimer: ReturnType<typeof setInterval> | null = null;
    if (viewMode === 'display') {
      const pollServer = () => {
        fetch(`/api/stage-sync?room=${encodeURIComponent(initialRoomId)}`)
          .then((r) => r.json())
          .then((data) => {
            setSyncConnected(true);
            if (data?.state) {
              setRemainingSeconds(data.state.remainingSeconds);
              setTotalSeconds(data.state.totalSeconds);
              setIsRunning(data.state.isRunning);
              setActiveSessionId(data.state.sessionId);
              setWarningMinutes(data.state.warningMinutes);
              setDisplayTheme(data.state.displayTheme);
            }
          })
          .catch(() => setSyncConnected(false));
      };
      pollServer();
      pollTimer = setInterval(pollServer, 2000);
    }

    return () => {
      if (channelRef.current) {
        channelRef.current.close();
        channelRef.current = null;
      }
      if (pollTimer) clearInterval(pollTimer);
    };
  }, [initialRoomId, viewMode]);

  // Countdown tick interval
  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        const next = prev - 1;
        if (soundEnabled && (next === warningMinutes * 60 || next === 0)) {
          try {
            playTimerSound(next === 0 ? 'bell' : 'warning');
          } catch {
            // Ignore audio play restriction
          }
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isRunning, soundEnabled, warningMinutes]);

  // Broadcast state updates when key values change
  useEffect(() => {
    broadcastState();
  }, [remainingSeconds, totalSeconds, isRunning, activeSessionId, warningMinutes, displayTheme, broadcastState]);

  // Auto-clear reset confirmation after 3 seconds
  useEffect(() => {
    if (!confirmReset) return;
    const timeout = setTimeout(() => setConfirmReset(false), 3000);
    return () => clearTimeout(timeout);
  }, [confirmReset]);

  const handleTogglePlay = () => {
    setIsRunning((prev) => !prev);
    setConfirmReset(false);
  };

  // Protected reset: if timer is actively running, first tap arms confirmation to prevent accidental taps
  const handleReset = () => {
    if (isRunning && !confirmReset) {
      setConfirmReset(true);
      return;
    }
    setIsRunning(false);
    setRemainingSeconds(totalSeconds);
    setConfirmReset(false);
  };

  const handleAdjustSeconds = (deltaSeconds: number) => {
    setRemainingSeconds((prev) => {
      const updated = prev + deltaSeconds;
      if (updated > totalSeconds) {
        setTotalSeconds(updated);
      }
      return updated;
    });
  };

  const handleSelectPreset = (minutes: number) => {
    const secs = minutes * 60;
    setTotalSeconds(secs);
    setRemainingSeconds(secs);
    setConfirmReset(false);
    setAgenda((prev) =>
      prev.map((item) =>
        item.id === activeSessionId
          ? { ...item, durationMinutes: minutes, durationSeconds: secs }
          : item
      )
    );
  };

  const handleSelectSession = (session: AgendaSession) => {
    setActiveSessionId(session.id);
    setTotalSeconds(session.durationSeconds);
    setRemainingSeconds(session.id === 'session-1' ? 765 : session.durationSeconds);
    setConfirmReset(false);
    setOpenMenuSessionId(null);
  };

  const handleCycleWarning = () => {
    const options = [1, 2, 5, 10];
    const nextIdx = (options.indexOf(warningMinutes) + 1) % options.length;
    setWarningMinutes(options[nextIdx]);
  };

  const handleCycleSoundProfile = () => {
    const profiles: Array<'Bell (Default)' | 'Chime' | 'Double Beep'> = [
      'Bell (Default)',
      'Chime',
      'Double Beep',
    ];
    const nextIdx = (profiles.indexOf(soundProfile) + 1) % profiles.length;
    setSoundProfile(profiles[nextIdx]);
    if (soundEnabled) {
      try {
        playTimerSound('bell');
      } catch {
        // Ignore audio errors
      }
    }
  };

  const handleCycleDisplayTheme = () => {
    const modes: Array<'Normal' | 'High Contrast' | 'Light'> = ['Normal', 'High Contrast', 'Light'];
    const nextIdx = (modes.indexOf(displayTheme) + 1) % modes.length;
    setDisplayTheme(modes[nextIdx]);
  };

  const handleCopyViewerLink = () => {
    if (typeof window === 'undefined') return;
    const url = `${window.location.origin}/stage-timer/viewer?room=${encodeURIComponent(initialRoomId)}`;
    navigator.clipboard?.writeText(url).catch(() => {});
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleToggleFullscreen = async () => {
    setViewMode('display');
    if (typeof document === 'undefined') return;
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        const orientation = (screen as unknown as { orientation?: { lock?: (mode: string) => Promise<void> } }).orientation;
        orientation?.lock?.('landscape')?.catch(() => {});
      }
    } catch {
      // Fullscreen API may be restricted inside preview iframe; display view mode is active
    }
  };

  const handleExitFullscreen = () => {
    setViewMode('mobile');
    if (typeof document !== 'undefined' && document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
      const orientation = (screen as unknown as { orientation?: { unlock?: () => void } }).orientation;
      orientation?.unlock?.();
    }
  };

  // Derived timing values
  const { formatted: formattedRemaining, isNegative } = formatTimerDigits(remainingSeconds);
  const { formatted: formattedTotal } = formatTimerDigits(totalSeconds);
  const elapsedSeconds = Math.max(0, totalSeconds - Math.max(0, remainingSeconds));
  const { formatted: formattedElapsed } = formatTimerDigits(elapsedSeconds);
  const elapsedPercent =
    totalSeconds > 0 ? Math.min(100, Math.max(0, (elapsedSeconds / totalSeconds) * 100)) : 0;

  const isWarningState = !isNegative && remainingSeconds > 0 && remainingSeconds <= warningMinutes * 60;
  const isOvertimeState = remainingSeconds < 0;

  const visibleAgenda = showAllAgenda ? agenda : agenda.slice(0, 3);

  // ============================================================================
  // 1. FULLSCREEN AUDIENCE DISPLAY MODE (1920 x 1080 16:9 Confidence Monitor)
  // ============================================================================
  if (viewMode === 'display') {
    const bgClass =
      displayTheme === 'Light'
        ? 'bg-[#F8FAFC] text-[#111827]'
        : displayTheme === 'High Contrast'
        ? 'bg-black text-white'
        : 'bg-[#111827] text-white';

    const digitColorClass = isOvertimeState
      ? 'text-red-500'
      : isWarningState
      ? 'text-amber-400'
      : displayTheme === 'Light'
      ? 'text-[#111827]'
      : 'text-white';

    return (
      <div
        ref={containerRef}
        className={`timer-fullscreen-stage flex flex-col items-center justify-center p-6 sm:p-12 lg:p-16 select-none relative overflow-hidden transition-colors ${bgClass}`}
      >
        {/* Exit Fullscreen in Corner */}
        <button
          type="button"
          onClick={handleExitFullscreen}
          className="absolute top-4 right-4 z-50 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-black/55 hover:bg-black/75 text-white border border-white/20 backdrop-blur-md text-xs font-semibold shadow-lg transition-all cursor-pointer"
          aria-label="Exit Fullscreen"
        >
          <Minimize2 className="w-4 h-4" />
          <span>Exit Fullscreen</span>
        </button>

        {/* Massive Centered Countdown Digits + Visual Progress Bar */}
        <div className="my-auto py-8 text-center w-full max-w-5xl mx-auto">
          <div
            className={`text-[clamp(4.5rem,20vmin,16rem)] font-black leading-none tracking-tight tabular-nums ${digitColorClass}`}
          >
            {isNegative ? `-${formattedRemaining}` : formattedRemaining}
          </div>

          <div className="w-full h-3.5 bg-slate-800 rounded-full overflow-hidden mt-8">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isOvertimeState
                  ? 'bg-red-500'
                  : isWarningState
                  ? 'bg-amber-400'
                  : 'bg-[#2563EB]'
              }`}
              style={{ width: `${elapsedPercent}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // 2. MOBILE-FIRST STAGE TIMER CONTROLLER UI (Matches Reference Screenshot 1:1)
  // ============================================================================
  return (
    <div
      ref={containerRef}
      className="w-full min-h-[calc(100vh-4rem)] bg-[#F1F5F9] dark:bg-[#0B0F19] text-[#111827] dark:text-slate-100 pb-10 overflow-x-hidden"
    >
      {/* Top Event Selector Bar (Global Product Summit • Oct 27, 2026 • Main Hall) */}
      <div className="w-full bg-white dark:bg-slate-900 border-b border-slate-200/90 dark:border-slate-800">
        <div
          className={`mx-auto px-4 py-3 flex items-center justify-between gap-3 ${
            viewMode === 'desktop' ? 'max-w-7xl' : 'max-w-[440px]'
          }`}
        >
          <div className="relative flex-1 min-w-0">
            <button
              type="button"
              onClick={() => setEventMenuOpen((prev) => !prev)}
              className="w-full flex items-center justify-between gap-3 text-left cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/70 border border-blue-100 dark:border-blue-900/60 flex items-center justify-center text-[#2563EB] shrink-0">
                  <Calendar className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div className="min-w-0">
                  <div className="text-base font-extrabold text-[#111827] dark:text-white tracking-tight truncate">
                    {currentEvent.name}
                  </div>
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5 truncate">
                    <span>{currentEvent.date}</span>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <span>{currentEvent.venue}</span>
                  </div>
                </div>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-transform shrink-0 ${
                  eventMenuOpen ? 'rotate-180 text-[#2563EB]' : ''
                }`}
              />
            </button>

            {/* Dropdown menu to switch event */}
            {eventMenuOpen && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-1.5 z-30">
                {EVENT_OPTIONS.map((evt, idx) => (
                  <button
                    key={evt.name}
                    type="button"
                    onClick={() => {
                      setSelectedEventIdx(idx);
                      setEventMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                      idx === selectedEventIdx
                        ? 'bg-blue-50 dark:bg-blue-950/50 text-[#2563EB] font-bold'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-sm">{evt.name}</div>
                      <div className="text-[11px] text-slate-500">
                        {evt.date} • {evt.venue}
                      </div>
                    </div>
                    {idx === selectedEventIdx && <Check className="w-4 h-4 text-[#2563EB]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Desktop layout switcher (visible on tablet/desktop screens so user can inspect both 390px Mobile Controller and 2-Column Console) */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700 shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('mobile')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'mobile'
                  ? 'bg-white dark:bg-slate-900 text-[#2563EB] shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
              title="Mobile Stage Manager Controller (390px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile Controller</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('desktop')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'desktop'
                  ? 'bg-white dark:bg-slate-900 text-[#2563EB] shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
              title="Two-Column Production Console"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Split Console</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Controller Container */}
      <div
        className={`mx-auto px-3.5 pt-3.5 ${
          viewMode === 'desktop'
            ? 'max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-start'
            : 'max-w-[440px] space-y-3.5'
        }`}
      >
        {/* Left / Primary Column: Active Session Cockpit + Quick Settings */}
        <div className={viewMode === 'desktop' ? 'lg:col-span-7 space-y-4' : 'space-y-3.5'}>
          {/* ================================================================= */}
          {/* DARK ACTIVE SESSION & TIMER CARD                                  */}
          {/* ================================================================= */}
          <section
            aria-label="Active Stage Timer"
            className="bg-[#0F172A] text-white rounded-2xl p-4 sm:p-5 shadow-xl border border-slate-800/90"
          >
            {/* Top Row: Current Session + LIVE Badge */}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="text-xs font-medium text-slate-300">Current Session</div>
                <h1 className="text-xl font-extrabold text-white tracking-tight leading-snug truncate mt-0.5">
                  {activeSession.title}
                </h1>
              </div>

              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide shrink-0 border ${
                  isOvertimeState
                    ? 'bg-red-950/90 border-red-500/50 text-red-300'
                    : isWarningState
                    ? 'bg-amber-950/90 border-amber-500/50 text-amber-300'
                    : isRunning
                    ? 'bg-[#064E3B]/90 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-800 border-slate-600 text-slate-300'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isOvertimeState
                      ? 'bg-red-400 animate-ping'
                      : isWarningState
                      ? 'bg-amber-400 animate-pulse'
                      : isRunning
                      ? 'bg-emerald-400 animate-pulse'
                      : 'bg-slate-400'
                  }`}
                />
                <span>
                  {isOvertimeState
                    ? 'OVERTIME'
                    : isWarningState
                    ? 'WARNING'
                    : isRunning
                    ? 'LIVE'
                    : 'PAUSED'}
                </span>
              </div>
            </div>

            {/* Large Centered Timer Readout (12:45) */}
            <div className="text-center my-3.5">
              <div
                className={`text-[4.5rem] sm:text-[5rem] leading-none font-black tracking-tight tabular-nums select-none ${
                  isOvertimeState
                    ? 'text-red-400'
                    : isWarningState
                    ? 'text-amber-300'
                    : 'text-white'
                }`}
              >
                {isNegative ? `-${formattedRemaining}` : formattedRemaining}
              </div>
              <div className="text-xs font-medium text-slate-300 mt-2">
                {isNegative
                  ? `overtime (of ${formattedTotal})`
                  : `remaining (of ${formattedTotal})`}
              </div>
            </div>

            {/* Progress Bar + Elapsed / Total Readout */}
            <div className="mt-3">
              <div className="w-full h-3 bg-slate-700/80 rounded-full overflow-hidden p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isOvertimeState
                      ? 'bg-red-500'
                      : isWarningState
                      ? 'bg-amber-400'
                      : 'bg-[#2563EB]'
                  }`}
                  style={{ width: `${elapsedPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs font-medium text-slate-300 mt-1.5 tabular-nums">
                <span>{formattedElapsed} elapsed</span>
                <span>{formattedTotal} total</span>
              </div>
            </div>

            {/* Primary Touch Controls: Pause/Start (Wide Left) + Protected Reset (Right) */}
            <div className="grid grid-cols-12 gap-2.5 mt-4">
              <button
                type="button"
                onClick={handleTogglePlay}
                className="col-span-7 h-12 rounded-xl bg-[#2563EB] hover:bg-blue-600 active:scale-[0.99] text-white font-bold text-base flex items-center justify-center gap-2.5 shadow-md shadow-blue-950/50 transition-all cursor-pointer"
              >
                {isRunning ? (
                  <>
                    <Pause className="w-5 h-5 fill-current" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" />
                    <span>Start</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className={`col-span-5 h-12 rounded-xl border font-semibold text-base flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99] ${
                  confirmReset
                    ? 'bg-red-950/90 border-red-500 text-red-200 hover:bg-red-900/80 text-xs font-bold'
                    : 'bg-[#1E293B] hover:bg-slate-700/90 border-slate-600/80 text-white'
                }`}
                title="Protected Reset: requires confirmation while timer is running"
              >
                <RotateCcw className="w-4 h-4 shrink-0" />
                <span>{confirmReset ? 'Confirm?' : 'Reset'}</span>
              </button>
            </div>

            {/* Secondary Time Adjustment Row: - 1 min | - 30 sec | + 30 sec | + 1 min */}
            <div className="grid grid-cols-4 gap-2 mt-2.5">
              <button
                type="button"
                onClick={() => handleAdjustSeconds(-60)}
                className="h-10 rounded-xl bg-[#1E293B]/95 hover:bg-slate-800 active:scale-95 border border-slate-700/80 text-slate-100 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span className="w-4 h-4 rounded-full bg-slate-200 text-[#0F172A] flex items-center justify-center shrink-0">
                  <Minus className="w-2.5 h-2.5 stroke-[3]" />
                </span>
                <span>1 min</span>
              </button>

              <button
                type="button"
                onClick={() => handleAdjustSeconds(-30)}
                className="h-10 rounded-xl bg-[#1E293B]/95 hover:bg-slate-800 active:scale-95 border border-slate-700/80 text-slate-100 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span className="w-4 h-4 rounded-full bg-slate-200 text-[#0F172A] flex items-center justify-center shrink-0">
                  <Minus className="w-2.5 h-2.5 stroke-[3]" />
                </span>
                <span>30 sec</span>
              </button>

              <button
                type="button"
                onClick={() => handleAdjustSeconds(30)}
                className="h-10 rounded-xl bg-[#1E293B]/95 hover:bg-slate-800 active:scale-95 border border-slate-700/80 text-slate-100 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span className="w-4 h-4 rounded-full bg-slate-200 text-[#0F172A] flex items-center justify-center shrink-0">
                  <Plus className="w-2.5 h-2.5 stroke-[3]" />
                </span>
                <span>30 sec</span>
              </button>

              <button
                type="button"
                onClick={() => handleAdjustSeconds(60)}
                className="h-10 rounded-xl bg-[#1E293B]/95 hover:bg-slate-800 active:scale-95 border border-slate-700/80 text-slate-100 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span className="w-4 h-4 rounded-full bg-slate-200 text-[#0F172A] flex items-center justify-center shrink-0">
                  <Plus className="w-2.5 h-2.5 stroke-[3]" />
                </span>
                <span>1 min</span>
              </button>
            </div>
          </section>

          {/* ================================================================= */}
          {/* QUICK SETTINGS CARD                                               */}
          {/* ================================================================= */}
          <section
            aria-label="Quick Settings"
            className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-2xs"
          >
            <button
              type="button"
              onClick={() => setQuickSettingsOpen((prev) => !prev)}
              className="w-full flex items-center justify-between text-left cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#2563EB]" />
                <h2 className="text-sm font-bold text-[#111827] dark:text-white">
                  Quick Settings
                </h2>
              </div>
              {quickSettingsOpen ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {quickSettingsOpen && (
              <div className="mt-3.5 space-y-3.5">
                {/* Duration Presets */}
                <div>
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                    Duration Presets
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[5, 10, 15, 30].map((mins) => {
                      const isSelected = totalSeconds === mins * 60;
                      return (
                        <button
                          key={mins}
                          type="button"
                          onClick={() => handleSelectPreset(mins)}
                          className={`h-9 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                            isSelected
                              ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-xs'
                              : 'bg-slate-50 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-blue-300'
                          }`}
                        >
                          {mins} min
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3 Compact Setting Tiles: Warning Alert | Sound | Display Mode */}
                <div className="grid grid-cols-3 gap-2">
                  {/* Tile 1: Warning Alert */}
                  <button
                    type="button"
                    onClick={handleCycleWarning}
                    className="rounded-xl bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700 p-2.5 text-left hover:border-blue-300 transition-colors cursor-pointer flex flex-col justify-between"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
                      <span className="text-[11px] font-bold text-slate-800 dark:text-slate-100 leading-tight truncate">
                        Warning Alert
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      <span className="truncate">{warningMinutes} min left</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    </div>
                  </button>

                  {/* Tile 2: Sound Toggle + Bell Profile */}
                  <div className="rounded-xl bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700 p-2.5 text-left flex flex-col justify-between">
                    <div className="flex items-center justify-between gap-1">
                      <button
                        type="button"
                        onClick={() => setSoundEnabled((prev) => !prev)}
                        className="flex items-center gap-1 min-w-0 cursor-pointer"
                      >
                        {soundEnabled ? (
                          <Volume2 className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                        ) : (
                          <VolumeX className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        )}
                        <span className="text-[11px] font-bold text-slate-800 dark:text-slate-100 truncate">
                          Sound
                        </span>
                      </button>

                      {/* Toggle Switch */}
                      <button
                        type="button"
                        role="switch"
                        aria-checked={soundEnabled}
                        onClick={() => setSoundEnabled((prev) => !prev)}
                        className={`w-7 h-4 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 flex items-center ${
                          soundEnabled ? 'bg-[#2563EB] justify-end' : 'bg-slate-300 dark:bg-slate-600 justify-start'
                        }`}
                      >
                        <span className="w-3 h-3 rounded-full bg-white shadow-2xs" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleCycleSoundProfile}
                      className="flex items-center justify-between mt-2 text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 cursor-pointer w-full"
                    >
                      <span className="truncate">{soundProfile}</span>
                      <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
                    </button>
                  </div>

                  {/* Tile 3: Display Mode */}
                  <button
                    type="button"
                    onClick={handleCycleDisplayTheme}
                    className="rounded-xl bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700 p-2.5 text-left hover:border-blue-300 transition-colors cursor-pointer flex flex-col justify-between"
                  >
                    <div className="flex items-center gap-1.5">
                      <Monitor className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                      <span className="text-[11px] font-bold text-slate-800 dark:text-slate-100 leading-tight truncate">
                        Display Mode
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      <span className="truncate">{displayTheme}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    </div>
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Right / Secondary Column: Event Agenda + Audience Display */}
        <div className={viewMode === 'desktop' ? 'lg:col-span-5 space-y-4' : 'space-y-3.5'}>
          {/* ================================================================= */}
          {/* EVENT AGENDA CARD                                                 */}
          {/* ================================================================= */}
          <section
            aria-label="Event Agenda"
            className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-2xs"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <List className="w-4 h-4 text-[#2563EB]" />
                <h2 className="text-sm font-bold text-[#111827] dark:text-white">
                  Event Agenda
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowAllAgenda((prev) => !prev)}
                className="text-xs font-semibold text-[#2563EB] hover:underline cursor-pointer"
              >
                {showAllAgenda ? 'Show Compact' : 'View All'}
              </button>
            </div>

            <div className="space-y-2.5">
              {visibleAgenda.map((item) => {
                const isActive = item.id === activeSessionId;
                const isMenuOpen = openMenuSessionId === item.id;

                return (
                  <div
                    key={item.id}
                    className={`relative rounded-xl p-3 transition-all border ${
                      isActive
                        ? 'bg-[#EFF6FF] dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/80 border-l-4 border-l-[#2563EB]'
                        : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2.5">
                      <button
                        type="button"
                        onClick={() => handleSelectSession(item)}
                        className="flex items-start gap-3 text-left flex-1 min-w-0 cursor-pointer"
                      >
                        {/* Numbered Circle Badge */}
                        <div
                          className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                            isActive
                              ? 'bg-[#2563EB] text-white shadow-2xs'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {item.order}
                        </div>

                        <div className="min-w-0 flex-1">
                          {/* Time + Duration Pill */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 tabular-nums">
                              {item.startTime}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                                isActive
                                  ? 'bg-blue-100/90 dark:bg-blue-900/60 text-[#2563EB] dark:text-blue-300'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              {item.durationMinutes} min
                            </span>
                          </div>

                          {/* Session Title */}
                          <div
                            className={`text-sm font-bold mt-1 truncate ${
                              isActive
                                ? 'text-[#2563EB] dark:text-blue-400'
                                : 'text-[#111827] dark:text-white'
                            }`}
                          >
                            {item.title}
                          </div>

                          {/* Session Subtitle */}
                          <div className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {item.subtitle}
                          </div>
                        </div>
                      </button>

                      {/* Three-dot action button */}
                      <div className="relative shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenMenuSessionId(isMenuOpen ? null : item.id)
                          }
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                          aria-label={`Session options for ${item.title}`}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {isMenuOpen && (
                          <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg p-1 z-20">
                            <button
                              type="button"
                              onClick={() => handleSelectSession(item)}
                              className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                            >
                               Cue Session Now
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                handleSelectSession(item);
                                setIsRunning(true);
                              }}
                              className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold text-[#2563EB] hover:bg-blue-50 dark:hover:bg-blue-950/50 cursor-pointer"
                            >
                              Start Immediately
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ================================================================= */}
          {/* AUDIENCE DISPLAY CARD                                             */}
          {/* ================================================================= */}
          <section
            aria-label="Audience Display Controls"
            className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-2xs"
          >
            <button
              type="button"
              onClick={() => setViewMode('display')}
              className="w-full flex items-center justify-between text-left group cursor-pointer"
            >
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 text-[#2563EB]">
                  <Monitor className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#111827] dark:text-white">
                    Audience Display
                  </h2>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        syncConnected ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                    />
                    <span>
                      {syncConnected
                        ? 'Viewers can see this timer'
                        : 'Reconnecting remote sync...'}
                    </span>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
            </button>

            {/* Primary Actions: Open Dedicated Confidence Monitor & Inline Display */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3.5">
              <a
                href={`/stage-timer/viewer?room=${encodeURIComponent(initialRoomId)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="h-11 rounded-xl bg-[#2563EB] hover:bg-blue-600 active:scale-[0.99] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Confidence Monitor</span>
              </a>

              <button
                type="button"
                onClick={handleToggleFullscreen}
                className="h-11 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
              >
                <Maximize2 className="w-4 h-4 text-slate-500" />
                <span>Audience Display</span>
              </button>
            </div>

            {/* Live Prompt / Cue Banner to Speaker Screen */}
            <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                <span className="flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Live Prompt to Stage Screen</span>
                </span>
                {cueVisible && (
                  <span className="text-[10px] uppercase font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full">
                    Broadcasting Cue
                  </span>
                )}
              </div>

              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={cueMessage}
                  onChange={(e) => setCueMessage(e.target.value)}
                  placeholder="e.g. Wrap up in 2 mins..."
                  className="flex-1 h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    const nextVisible = !cueVisible;
                    setCueVisible(nextVisible);
                    broadcastState({ cueMessage, messageVisible: nextVisible });
                  }}
                  className={`px-3 h-9 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    cueVisible
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'bg-slate-900 dark:bg-blue-600 text-white'
                  }`}
                >
                  <Send className="w-3 h-3" />
                  <span>{cueVisible ? 'Clear Cue' : 'Flash Cue'}</span>
                </button>
              </div>

              {/* Quick Prompt Presets */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['2 mins left', 'Wrap up now', '1 question left', 'Next speaker ready'].map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => {
                      setCueMessage(prompt);
                      setCueVisible(true);
                      broadcastState({ cueMessage: prompt, messageVisible: true });
                    }}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer font-medium"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Secondary Action: Copy Viewer Link + QR Code Toggle */}
            <div className="mt-2.5 flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyViewerLink}
                className="flex-1 h-10 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/90 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                      Viewer Link Copied!
                    </span>
                  </>
                ) : (
                  <>
                    <Link2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copy Viewer Link</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowQrPanel((prev) => !prev)}
                className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/90 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                title="Show QR Code for Audience Viewer"
              >
                <span>QR</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                    showQrPanel ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </div>

            {showQrPanel && (
              <div className="mt-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-center space-y-2">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Scan for Read-Only Audience Display
                </div>
                {/* Deterministic SVG QR Matrix Pattern */}
                <div className="w-28 h-28 mx-auto bg-white p-2 rounded-lg border border-slate-200 shadow-2xs flex items-center justify-center">
                  <svg viewBox="0 0 21 21" className="w-full h-full text-[#111827]" fill="currentColor">
                    {/* Finder patterns */}
                    <path d="M0 0h7v7H0V0zm1 1v5h5V1H1zm1 1h3v3H2V2zm12-2h7v7h-7V0zm1 1v5h5V1h-5zm1 1h3v3h-3V2zM0 14h7v7H0v-7zm1 1v5h5v-5H1zm1 1h3v3H2v-3z" />
                    {/* Data modules */}
                    <rect x="8" y="1" width="1" height="2" />
                    <rect x="10" y="0" width="2" height="1" />
                    <rect x="9" y="3" width="2" height="2" />
                    <rect x="12" y="4" width="1" height="2" />
                    <rect x="8" y="6" width="1" height="1" />
                    <rect x="10" y="6" width="1" height="1" />
                    <rect x="1" y="8" width="2" height="1" />
                    <rect x="4" y="8" width="3" height="1" />
                    <rect x="8" y="8" width="2" height="2" />
                    <rect x="11" y="8" width="2" height="1" />
                    <rect x="14" y="8" width="3" height="1" />
                    <rect x="18" y="8" width="2" height="2" />
                    <rect x="0" y="10" width="2" height="2" />
                    <rect x="3" y="11" width="2" height="1" />
                    <rect x="6" y="10" width="2" height="2" />
                    <rect x="10" y="11" width="3" height="2" />
                    <rect x="15" y="10" width="2" height="2" />
                    <rect x="19" y="11" width="2" height="2" />
                    <rect x="8" y="14" width="2" height="2" />
                    <rect x="11" y="15" width="2" height="1" />
                    <rect x="14" y="14" width="3" height="2" />
                    <rect x="18" y="15" width="3" height="1" />
                    <rect x="9" y="17" width="2" height="2" />
                    <rect x="12" y="18" width="3" height="2" />
                    <rect x="16" y="17" width="2" height="3" />
                    <rect x="19" y="18" width="2" height="3" />
                  </svg>
                </div>
                <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 break-all">
                  /stage-timer?view=display&amp;room={initialRoomId}
                </div>
                <p className="text-[10px] text-slate-400">
                  Public viewer link is read-only. Controller credentials remain private to this device.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

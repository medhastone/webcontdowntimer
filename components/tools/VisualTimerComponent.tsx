'use client';

import React, { useState, useEffect, useRef, useCallback, useSyncExternalStore } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Bell,
  Sun,
  Moon,
  Monitor,
  ChevronUp,
  ChevronDown,
  Check,
  Keyboard,
  X,
  Heart,
  BookmarkPlus,
} from 'lucide-react';
import { playTimerSound } from '@/lib/sound';
import { requestWakeLock, releaseWakeLock } from '@/lib/wakelock';
import {
  subscribeCustomTimers,
  getCustomTimersSnapshot,
  getServerCustomTimersSnapshot,
  addOrUpdateCustomTimer,
  toggleLikeSavedTimer,
  deleteSavedTimer,
  type CustomTimerItem,
  type CustomIconId,
  type AmbientSoundId,
} from '@/lib/custom-timers-store';
import VisualTimerCustomStudio, {
  LiquidWaveVisual,
  PlantGrowthVisual,
  BatteryChargeVisual,
  BreathingOrbVisual,
  CustomTimerIcon,
  CUSTOM_ICONS,
} from './VisualTimerCustomStudio';

export type VisualStyleId =
  | 'circular'
  | 'progress-bar'
  | 'hourglass'
  | 'traffic-light'
  | 'rainbow'
  | 'minimal-digital'
  | 'liquid-wave'
  | 'plant-growth'
  | 'battery-charge'
  | 'breathing-orb';

export type BackgroundMode = 'light' | 'dark' | 'auto';

interface ColorOption {
  id: string;
  label: string;
  hex: string;
}

const COLOR_SWATCHES: ColorOption[] = [
  { id: 'forest-green', label: 'Forest Green', hex: '#365C4B' },
  { id: 'warm-orange', label: 'Warm Orange', hex: '#E06A3B' },
  { id: 'coral-red', label: 'Coral Red', hex: '#D94343' },
  { id: 'royal-blue', label: 'Royal Blue', hex: '#2E6FD9' },
  { id: 'sky-blue', label: 'Sky Blue', hex: '#3BA8E0' },
  { id: 'pink', label: 'Pink', hex: '#D93B8A' },
];

const PRESETS = [
  { label: '1 min', seconds: 60 },
  { label: '5 min', seconds: 300 },
  { label: '10 min', seconds: 600 },
  { label: '15 min', seconds: 900 },
  { label: '30 min', seconds: 1800 },
];

export default function VisualTimerComponent() {
  // Timer mode: duration vs end time
  const [timerMode, setTimerMode] = useState<'duration' | 'endTime'>('duration');

  // Time values (defaults to 15:00 minutes)
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(15);
  const [seconds, setSeconds] = useState<number>(0);

  // Target end time for 'endTime' mode (e.g. "17:30")
  const [targetEndTimeStr, setTargetEndTimeStr] = useState<string>(() => {
    const d = new Date(Date.now() + 15 * 60 * 1000);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  });

  // Active duration in seconds & countdown state
  const [totalDurationSec, setTotalDurationSec] = useState<number>(900);
  const [remainingMs, setRemainingMs] = useState<number>(900 * 1000);
  const [status, setStatus] = useState<'idle' | 'running' | 'paused' | 'completed'>('idle');

  // Visual style & customization
  const [visualStyle, setVisualStyle] = useState<VisualStyleId>('circular');
  const [timerColor, setTimerColor] = useState<string>('#365C4B');
  const [bgMode, setBgMode] = useState<BackgroundMode>('auto');

  // Toggle settings
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [alarmAtEnd, setAlarmAtEnd] = useState<boolean>(true);
  const [showElapsedTime, setShowElapsedTime] = useState<boolean>(false);
  const [showTimeText, setShowTimeText] = useState<boolean>(true);
  const [keepScreenAwake, setKeepScreenAwake] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState<boolean>(false);

  // Active preset highlight (defaults to 15 min)
  const [selectedPreset, setSelectedPreset] = useState<string>('15 min');

  // Shared reactive Custom & Liked Timers list (synced with Header Navbar)
  const customTimers = useSyncExternalStore(
    subscribeCustomTimers,
    getCustomTimersSnapshot,
    getServerCustomTimersSnapshot
  );

  const searchParams = useSearchParams();
  const [activeCustomId, setActiveCustomId] = useState<string | null>(null);
  const [activeCustomTitle, setActiveCustomTitle] = useState<string>('Custom Visual Timer');
  const [activeCustomSubtitle, setActiveCustomSubtitle] = useState<string>(
    'Add your custom title, description, and choose an animated visual below.'
  );
  const [activeCustomIcon, setActiveCustomIcon] = useState<CustomIconId>('brain');
  const [savedToast, setSavedToast] = useState<boolean>(false);

  // Smart Focus Power-Ups (Halfway chime, 60s warning, 3-2-1 pips, Auto-break chain, Ambient sound)
  const [halfwayChime, setHalfwayChime] = useState<boolean>(false);
  const [oneMinWarning, setOneMinWarning] = useState<boolean>(false);
  const [countdown321, setCountdown321] = useState<boolean>(false);
  const [autoBreakSec, setAutoBreakSec] = useState<number>(0);
  const [isBreakPhase, setIsBreakPhase] = useState<boolean>(false);
  const [ambientSound, setAmbientSound] = useState<AmbientSoundId>('off');
  const [shareCopied, setShareCopied] = useState<boolean>(false);
  const [milestoneBanner, setMilestoneBanner] = useState<string | null>(null);

  // Refs for high-precision timestamp math & milestone deduplication
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const endTimeTimestampRef = useRef<number>(0);
  const pausedRemainingMsRef = useRef<number>(900 * 1000);
  const lastStateRef = useRef<'idle' | 'running' | 'paused' | 'completed'>('idle');
  const firedHalfwayRef = useRef<boolean>(false);
  const firedOneMinRef = useRef<boolean>(false);
  const firedSecRef = useRef<number>(-1);

  // Keep last state updated
  useEffect(() => {
    lastStateRef.current = status;
  }, [status]);

  // Sync when navigating to a saved timer from the Header dropdown or shared URL
  const paramId = searchParams?.get('id') || null;
  const paramSec = Number(searchParams?.get('vt_sec') || 0);
  const paramTitle = searchParams?.get('vt_title') || null;
  const paramDesc = searchParams?.get('vt_desc') || null;
  const paramStyle = (searchParams?.get('vt_style') as VisualStyleId) || null;
  const paramIcon = (searchParams?.get('vt_icon') as CustomIconId) || null;
  const paramColor = searchParams?.get('vt_color') || null;

  useEffect(() => {
    if (paramId) {
      const found = getCustomTimersSnapshot().find((t) => t.id === paramId);
      if (found) {
        queueMicrotask(() => {
          setActiveCustomId(found.id);
          setActiveCustomTitle(found.title);
          setActiveCustomSubtitle(found.subtitle);
          setActiveCustomIcon(found.icon);
          setVisualStyle(found.visualStyle);
          setTimerColor(found.color);
          setHalfwayChime(found.halfwayChime);
          setOneMinWarning(found.oneMinWarning);
          setCountdown321(found.countdown321);
          setAutoBreakSec(found.autoBreakSec);
          setAmbientSound(found.ambientSound);
          setTotalDurationSec(found.durationSec);
          setRemainingMs(found.durationSec * 1000);
          pausedRemainingMsRef.current = found.durationSec * 1000;
          setHours(Math.floor(found.durationSec / 3600));
          setMinutes(Math.floor((found.durationSec % 3600) / 60));
          setSeconds(found.durationSec % 60);
          setSelectedPreset('Custom');
          setStatus('idle');
        });
        return;
      }
    }
    if (paramSec > 0 && paramSec <= 86400) {
      queueMicrotask(() => {
        setTotalDurationSec(paramSec);
        setRemainingMs(paramSec * 1000);
        pausedRemainingMsRef.current = paramSec * 1000;
        setHours(Math.floor(paramSec / 3600));
        setMinutes(Math.floor((paramSec % 3600) / 60));
        setSeconds(paramSec % 60);
        setSelectedPreset('Custom');
        if (paramTitle) setActiveCustomTitle(paramTitle);
        if (paramDesc) setActiveCustomSubtitle(paramDesc);
        if (paramStyle) setVisualStyle(paramStyle);
        if (paramIcon) setActiveCustomIcon(paramIcon);
        if (paramColor && /^#[0-9A-Fa-f]{6}$/.test(paramColor)) setTimerColor(paramColor);
        setStatus('idle');
      });
    }
  }, [paramId, paramSec, paramTitle, paramDesc, paramStyle, paramIcon, paramColor]);

  // Compute total duration whenever inputs change in duration mode
  const syncDurationFromInputs = useCallback((h: number, m: number, s: number) => {
    const total = Math.max(1, h * 3600 + m * 60 + s);
    setTotalDurationSec(total);
    setRemainingMs(total * 1000);
    pausedRemainingMsRef.current = total * 1000;
    setStatus('idle');
  }, []);

  // Set preset
  const handleSelectPreset = (presetLabel: string, sec: number) => {
    setSelectedPreset(presetLabel);
    setHours(Math.floor(sec / 3600));
    setMinutes(Math.floor((sec % 3600) / 60));
    setSeconds(sec % 60);
    setTotalDurationSec(sec);
    setRemainingMs(sec * 1000);
    pausedRemainingMsRef.current = sec * 1000;
    setStatus('idle');
  };

  const handleCustomPresetClick = () => {
    setSelectedPreset('Custom');
  };

  // Adjust time inputs via steppers
  const adjustValue = (type: 'h' | 'm' | 's', delta: number) => {
    setSelectedPreset('Custom');
    if (type === 'h') {
      const nextH = Math.max(0, Math.min(23, hours + delta));
      setHours(nextH);
      syncDurationFromInputs(nextH, minutes, seconds);
    } else if (type === 'm') {
      const nextM = Math.max(0, Math.min(59, minutes + delta));
      setMinutes(nextM);
      syncDurationFromInputs(hours, nextM, seconds);
    } else if (type === 's') {
      const nextS = Math.max(0, Math.min(59, seconds + delta));
      setSeconds(nextS);
      syncDurationFromInputs(hours, minutes, nextS);
    }
  };

  // Switch to End Time mode & calculate difference
  const handleEndTimeChange = (timeStr: string) => {
    setTargetEndTimeStr(timeStr);
    const [th, tm] = timeStr.split(':').map(Number);
    if (Number.isFinite(th) && Number.isFinite(tm)) {
      const now = new Date();
      const target = new Date();
      target.setHours(th, tm, 0, 0);
      if (target.getTime() <= now.getTime()) {
        // Assume next day if target is in the past
        target.setDate(target.getDate() + 1);
      }
      const diffSec = Math.max(1, Math.round((target.getTime() - now.getTime()) / 1000));
      setTotalDurationSec(diffSec);
      setHours(Math.floor(diffSec / 3600));
      setMinutes(Math.floor((diffSec % 3600) / 60));
      setSeconds(diffSec % 60);
      setRemainingMs(diffSec * 1000);
      pausedRemainingMsRef.current = diffSec * 1000;
      setStatus('idle');
    }
  };

  // Start timer
  const handleStart = () => {
    if (status === 'running') return;

    let durationToRunMs = pausedRemainingMsRef.current;
    if (status === 'completed' || durationToRunMs <= 0) {
      durationToRunMs = totalDurationSec * 1000;
      setRemainingMs(durationToRunMs);
      firedHalfwayRef.current = false;
      firedOneMinRef.current = false;
      firedSecRef.current = -1;
      setMilestoneBanner(null);
    }

    endTimeTimestampRef.current = performance.now() + durationToRunMs;
    setStatus('running');

    if (keepScreenAwake) {
      requestWakeLock();
    }
  };

  // Pause timer
  const handlePause = () => {
    if (status !== 'running') return;
    const now = performance.now();
    const remaining = Math.max(0, endTimeTimestampRef.current - now);
    pausedRemainingMsRef.current = remaining;
    setRemainingMs(remaining);
    setStatus('paused');
    releaseWakeLock();
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
  };

  // Reset timer
  const handleReset = () => {
    setStatus('idle');
    setIsBreakPhase(false);
    setMilestoneBanner(null);
    firedHalfwayRef.current = false;
    firedOneMinRef.current = false;
    firedSecRef.current = -1;
    releaseWakeLock();
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    const resetMs = totalDurationSec * 1000;
    pausedRemainingMsRef.current = resetMs;
    setRemainingMs(resetMs);
  };

  // Live on-the-fly time adjustment (+1m, +5m, -1m) without resetting the timer
  const handleLiveAdjustSeconds = (deltaSec: number) => {
    const deltaMs = deltaSec * 1000;
    const nextMs = Math.max(5000, remainingMs + deltaMs);
    if (status === 'running') {
      endTimeTimestampRef.current += nextMs - remainingMs;
      setRemainingMs(nextMs);
      if (nextMs > totalDurationSec * 1000) {
        setTotalDurationSec(Math.ceil(nextMs / 1000));
      }
    } else {
      pausedRemainingMsRef.current = nextMs;
      setRemainingMs(nextMs);
      setTotalDurationSec(Math.ceil(nextMs / 1000));
    }
  };

  // Custom & Liked Timers handlers
  const handleSelectCustomTimer = (item: CustomTimerItem) => {
    setActiveCustomId(item.id);
    setActiveCustomTitle(item.title);
    setActiveCustomSubtitle(item.subtitle);
    setActiveCustomIcon(item.icon);
    setVisualStyle(item.visualStyle);
    setTimerColor(item.color);
    setHalfwayChime(item.halfwayChime);
    setOneMinWarning(item.oneMinWarning);
    setCountdown321(item.countdown321);
    setAutoBreakSec(item.autoBreakSec);
    setAmbientSound(item.ambientSound);
    setIsBreakPhase(false);
    setMilestoneBanner(null);
    firedHalfwayRef.current = false;
    firedOneMinRef.current = false;
    firedSecRef.current = -1;

    setSelectedPreset('Custom');
    setHours(Math.floor(item.durationSec / 3600));
    setMinutes(Math.floor((item.durationSec % 3600) / 60));
    setSeconds(item.durationSec % 60);
    setTotalDurationSec(item.durationSec);
    setRemainingMs(item.durationSec * 1000);
    pausedRemainingMsRef.current = item.durationSec * 1000;
    setStatus('idle');
  };

  const handleToggleLikeTimer = (id: string) => {
    toggleLikeSavedTimer(id);
  };

  const handleDeleteCustomTimer = (id: string) => {
    deleteSavedTimer(id);
    if (activeCustomId === id) {
      setActiveCustomId(null);
    }
  };

  const handleCreateCustomTimer = (newItem: CustomTimerItem) => {
    addOrUpdateCustomTimer(newItem);
    handleSelectCustomTimer(newItem);
  };

  // Save current custom title, description, icon & animated visual directly to Header Saved List
  const handleQuickSaveToList = () => {
    const idToSave =
      activeCustomId && activeCustomId.startsWith('custom-')
        ? activeCustomId
        : `custom-${Date.now()}`;
    const itemToSave: CustomTimerItem = {
      id: idToSave,
      title: activeCustomTitle.trim() || 'My Custom Timer',
      subtitle:
        activeCustomSubtitle.trim() ||
        `${Math.floor(totalDurationSec / 60)}m ${visualStyle.replace('-', ' ')} timer`,
      icon: activeCustomIcon,
      durationSec: totalDurationSec,
      visualStyle,
      color: timerColor,
      liked: true,
      halfwayChime,
      oneMinWarning,
      countdown321,
      autoBreakSec,
      ambientSound,
    };
    addOrUpdateCustomTimer(itemToSave);
    setActiveCustomId(idToSave);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2600);
  };

  const handleShareActiveTimer = () => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.origin + '/custom-timer');
    if (activeCustomId) url.searchParams.set('id', activeCustomId);
    url.searchParams.set('vt_title', activeCustomTitle);
    url.searchParams.set('vt_desc', activeCustomSubtitle);
    url.searchParams.set('vt_sec', String(totalDurationSec));
    url.searchParams.set('vt_style', visualStyle);
    url.searchParams.set('vt_icon', activeCustomIcon);
    url.searchParams.set('vt_color', timerColor);
    navigator.clipboard?.writeText(url.toString()).catch(() => {});
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2500);
  };

  // Ambient Focus Soundscape interval while timer is running
  useEffect(() => {
    if (status !== 'running' || !soundEnabled || ambientSound === 'off') return;

    const triggerAmbient = () => {
      if (ambientSound === 'focus-tick') {
        playTimerSound('count321', 0.14, 'soft');
      } else if (ambientSound === 'zen-drone') {
        playTimerSound('bell', 0.18, 'soft');
      } else if (ambientSound === 'rain') {
        playTimerSound('beep', 0.12, 'soft');
      }
    };

    triggerAmbient();
    const intervalMs =
      ambientSound === 'focus-tick' ? 1000 : ambientSound === 'zen-drone' ? 4000 : 1600;
    const id = window.setInterval(triggerAmbient, intervalMs);
    return () => window.clearInterval(id);
  }, [status, soundEnabled, ambientSound]);

  // Precision animation frame loop with Smart Milestone Chimes & Auto-Break Chain
  useEffect(() => {
    if (status !== 'running') return;

    const totalMsCurrent = totalDurationSec * 1000;

    const tick = () => {
      const now = performance.now();
      const left = endTimeTimestampRef.current - now;

      if (left <= 0) {
        if (soundEnabled && alarmAtEnd) {
          playTimerSound('bell');
        }

        // Check if Auto-Break Chain is enabled and we just finished the main work phase
        if (autoBreakSec > 0 && !isBreakPhase) {
          const breakMs = autoBreakSec * 1000;
          setIsBreakPhase(true);
          setTotalDurationSec(autoBreakSec);
          setRemainingMs(breakMs);
          pausedRemainingMsRef.current = breakMs;
          endTimeTimestampRef.current = performance.now() + breakMs;
          firedHalfwayRef.current = false;
          firedOneMinRef.current = false;
          firedSecRef.current = -1;
          setMilestoneBanner(`Auto-Break Started (${Math.round(autoBreakSec / 60)}m Rest)`);
          animFrameRef.current = requestAnimationFrame(tick);
          return;
        }

        setRemainingMs(0);
        pausedRemainingMsRef.current = 0;
        setStatus('completed');
        setMilestoneBanner("Time's Up! Great session.");
        releaseWakeLock();
      } else {
        setRemainingMs(left);

        // 1. 50% Halfway Chime check
        if (
          halfwayChime &&
          !firedHalfwayRef.current &&
          totalMsCurrent >= 20000 &&
          left <= totalMsCurrent * 0.5 &&
          left > totalMsCurrent * 0.5 - 1500
        ) {
          firedHalfwayRef.current = true;
          setMilestoneBanner('50% Halfway Reached');
          if (soundEnabled) playTimerSound('chime', 0.6);
        }

        // 2. Last 60 Seconds Warning check
        if (
          oneMinWarning &&
          !firedOneMinRef.current &&
          totalMsCurrent > 70000 &&
          left <= 60000 &&
          left > 58500
        ) {
          firedOneMinRef.current = true;
          setMilestoneBanner('1 Minute Remaining');
          if (soundEnabled) playTimerSound('toastmaster-amber', 0.65);
        }

        // 3. Final 3-2-1 Countdown Pips
        const secLeft = Math.ceil(left / 1000);
        if (
          countdown321 &&
          secLeft <= 3 &&
          secLeft >= 1 &&
          firedSecRef.current !== secLeft
        ) {
          firedSecRef.current = secLeft;
          if (soundEnabled) playTimerSound('count321', 0.55);
        }

        animFrameRef.current = requestAnimationFrame(tick);
      }
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [
    status,
    soundEnabled,
    alarmAtEnd,
    totalDurationSec,
    halfwayChime,
    oneMinWarning,
    countdown321,
    autoBreakSec,
    isBreakPhase,
  ]);

  // Fullscreen handler
  const handleToggleFullscreen = async () => {
    const entering = !isFullscreen;
    setIsFullscreen(entering);

    try {
      if (entering) {
        if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
        try {
          const orientation = screen.orientation as unknown as { lock?: (mode: string) => Promise<void> };
          if (orientation?.lock && window.innerWidth <= 900) {
            await orientation.lock('landscape');
          }
        } catch {
          // ignore orientation lock errors
        }
      } else {
        if (document.fullscreenElement && document.exitFullscreen) {
          await document.exitFullscreen();
        }
        try {
          const orientation = screen.orientation as unknown as { unlock?: () => void };
          if (orientation?.unlock) orientation.unlock();
        } catch {
          // ignore
        }
      }
    } catch {
      // Keep CSS .timer-fullscreen-stage state active even if Fullscreen API is blocked in iframe
    }
  };

  // Sync when exiting native fullscreen via browser Esc key
  useEffect(() => {
    const onFsChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      } else {
        setIsFullscreen(true);
      }
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // Keyboard shortcuts (Space: Start/Pause, R: Reset, F: Fullscreen, M: Mute, ?: Shortcuts, Esc: Close/Exit)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
        if (isFullscreen) {
          e.preventDefault();
          setIsFullscreen(false);
        }
        return;
      }

      if (e.key === '?' || (e.shiftKey && e.code === 'Slash')) {
        e.preventDefault();
        targetEl?.blur?.();
        setShowShortcutsModal((prev) => !prev);
        return;
      }

      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        targetEl?.blur?.();
        if (showShortcutsModal) setShowShortcutsModal(false);
        if (status === 'running') {
          handlePause();
        } else {
          handleStart();
        }
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        targetEl?.blur?.();
        if (showShortcutsModal) setShowShortcutsModal(false);
        handleReset();
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        targetEl?.blur?.();
        if (showShortcutsModal) setShowShortcutsModal(false);
        handleToggleFullscreen();
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        targetEl?.blur?.();
        setSoundEnabled((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  });

  // Calculate fractions
  const totalMs = totalDurationSec * 1000;
  const remainingFraction = totalMs > 0 ? Math.max(0, Math.min(1, remainingMs / totalMs)) : 0;
  const elapsedMs = Math.max(0, totalMs - remainingMs);

  // Time formatters
  const remSecTotal = Math.ceil(remainingMs / 1000);
  const remH = Math.floor(remSecTotal / 3600);
  const remM = Math.floor((remSecTotal % 3600) / 60);
  const remS = remSecTotal % 60;

  const displayTime =
    remH > 0
      ? `${String(remH).padStart(2, '0')}:${String(remM).padStart(2, '0')}:${String(remS).padStart(2, '0')}`
      : `${String(remM).padStart(2, '0')}:${String(remS).padStart(2, '0')}`;

  const elapSecTotal = Math.floor(elapsedMs / 1000);
  const elapM = Math.floor(elapSecTotal / 60);
  const elapS = elapSecTotal % 60;
  const displayElapsed = `${String(elapM).padStart(2, '0')}:${String(elapS).padStart(2, '0')}`;

  // Semantic live status label shown across all visual styles and fullscreen header
  const statusLabel =
    status === 'running'
      ? 'Running'
      : status === 'paused'
      ? 'Paused'
      : status === 'completed'
      ? "Time's Up"
      : 'Time Left';

  const statusColorClass =
    status === 'running'
      ? 'text-[#365C4B] dark:text-[#70B393] font-semibold'
      : status === 'completed'
      ? 'text-[#D94343] dark:text-[#FF7A7A] font-semibold'
      : 'text-[#252B27]/65 dark:text-slate-300 font-medium';

  // Theme styling based on bgMode
  const surfaceClasses =
    bgMode === 'dark'
      ? 'bg-[#181F1B] text-white border-[#2A342D]'
      : bgMode === 'auto'
      ? 'bg-white dark:bg-[#181F1B] text-[#252B27] dark:text-white border-[#E4E1D9] dark:border-[#2A342D]'
      : 'bg-white text-[#252B27] border-[#E4E1D9]';

  const secondaryBoxBg =
    bgMode === 'dark'
      ? 'bg-[#212A25]'
      : bgMode === 'auto'
      ? 'bg-[#F7F6F2] dark:bg-[#212A25]'
      : 'bg-[#F7F6F2]';

  return (
    <div
      className={`w-full rounded-2xl border shadow-sm transition-colors relative ${
        isFullscreen ? '' : 'overflow-hidden'
      } p-4 sm:p-8 lg:p-10 ${surfaceClasses}`}
    >
      {/* =================================================================== */}
      {/* CUSTOM TITLE, DESCRIPTION & SAVE TO HEADER LIST BAR                 */}
      {/* =================================================================== */}
      <div
        className={`mb-7 p-4 sm:p-5 rounded-2xl border ${secondaryBoxBg} border-[#E4E1D9] dark:border-[#2A342D]`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            {/* Custom Icon Picker Dropdown / Cycle */}
            <div className="sm:col-span-3">
              <label className="block text-[11px] font-bold uppercase tracking-wider opacity-65 mb-1">
                Custom Icon
              </label>
              <div className="flex items-center gap-2">
                <span
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs"
                  style={{ backgroundColor: timerColor }}
                >
                  <CustomTimerIcon icon={activeCustomIcon} className="w-4 h-4" />
                </span>
                <select
                  value={activeCustomIcon}
                  onChange={(e) => setActiveCustomIcon(e.target.value as CustomIconId)}
                  aria-label="Choose custom icon"
                  className="w-full px-2.5 py-2 rounded-xl border border-[#E4E1D9] dark:border-[#2A342D] bg-white dark:bg-[#181F1B] text-xs font-semibold outline-hidden focus:border-[#365C4B]"
                >
                  {CUSTOM_ICONS.map((ic) => (
                    <option key={ic.id} value={ic.id}>
                      {ic.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Custom Title Input */}
            <div className="sm:col-span-4">
              <label className="block text-[11px] font-bold uppercase tracking-wider opacity-65 mb-1">
                Custom Timer Title
              </label>
              <input
                type="text"
                value={activeCustomTitle}
                onChange={(e) => setActiveCustomTitle(e.target.value)}
                placeholder="Enter custom timer title..."
                aria-label="Custom timer title"
                className="w-full px-3 py-2 rounded-xl border border-[#E4E1D9] dark:border-[#2A342D] bg-white dark:bg-[#181F1B] text-xs sm:text-sm font-bold outline-hidden focus:border-[#365C4B]"
              />
            </div>

            {/* Custom Description Input */}
            <div className="sm:col-span-5">
              <label className="block text-[11px] font-bold uppercase tracking-wider opacity-65 mb-1">
                Custom Description / Goal
              </label>
              <input
                type="text"
                value={activeCustomSubtitle}
                onChange={(e) => setActiveCustomSubtitle(e.target.value)}
                placeholder="Add description, instructions, or session goal..."
                aria-label="Custom timer description"
                className="w-full px-3 py-2 rounded-xl border border-[#E4E1D9] dark:border-[#2A342D] bg-white dark:bg-[#181F1B] text-xs sm:text-sm font-medium outline-hidden focus:border-[#365C4B]"
              />
            </div>
          </div>

          {/* Save to Header Saved List Button */}
          <div className="flex items-center gap-2 shrink-0 lg:pt-4">
            <button
              type="button"
              onClick={handleQuickSaveToList}
              className="min-h-[40px] px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white inline-flex items-center gap-2 shadow-xs transition-all hover:opacity-95 active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
              style={{ backgroundColor: timerColor }}
            >
              {savedToast ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Saved to Header List!</span>
                </>
              ) : (
                <>
                  <BookmarkPlus className="w-4 h-4" />
                  <span>Save to My Saved List</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* TOP SECTION: 2-COLUMN MAIN TIMER & CONTROLS                        */}
      {/* =================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* LEFT COLUMN: VISUAL COUNTDOWN DISPLAY & TRANSPORT BUTTONS */}
        <div
          ref={containerRef}
          className={`lg:col-span-6 flex flex-col items-center ${
            isFullscreen
              ? `timer-fullscreen-stage justify-between p-4 sm:p-6 md:p-10 gap-3 sm:gap-6 ${surfaceClasses} border-0`
              : 'relative justify-center'
          }`}
        >
          {isFullscreen && (
            <div className="w-full max-w-7xl flex items-center justify-between gap-3 shrink-0 z-20">
              <div className="flex items-center gap-2 text-xs sm:text-base whitespace-nowrap">
                <span className="font-semibold opacity-80">Visual Timer</span>
                <span aria-hidden="true" className="opacity-40">·</span>
                <span className={statusColorClass}>{statusLabel}</span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowShortcutsModal(true)}
                  title="Keyboard Shortcuts (Space: Start/Pause, R: Reset, F: Fullscreen)"
                  className={`min-h-[42px] px-3 py-2 rounded-xl border text-xs sm:text-sm font-medium inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 transition cursor-pointer ${
                    bgMode === 'dark'
                      ? 'border-[#2A342D] bg-[#212A25] hover:bg-[#28332D] text-white'
                      : bgMode === 'auto'
                      ? 'border-[#E4E1D9] dark:border-[#2A342D] bg-[#F7F6F2] dark:bg-[#212A25] hover:bg-[#ECE8DF] dark:hover:bg-[#28332D] text-[#252B27] dark:text-white'
                      : 'border-[#E4E1D9] bg-[#F7F6F2] hover:bg-[#ECE8DF] text-[#252B27]'
                  }`}
                  aria-label="Keyboard Shortcuts"
                  aria-haspopup="dialog"
                  aria-expanded={showShortcutsModal}
                >
                  <Keyboard className="h-4 w-4 opacity-80" />
                  <span className="hidden md:inline">Shortcuts</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSoundEnabled((prev) => !prev)}
                  className={`min-h-[42px] px-3.5 py-2 rounded-xl border text-xs sm:text-sm font-medium inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 transition cursor-pointer ${
                    bgMode === 'dark'
                      ? 'border-[#2A342D] bg-[#212A25] hover:bg-[#28332D] text-white'
                      : bgMode === 'auto'
                      ? 'border-[#E4E1D9] dark:border-[#2A342D] bg-[#F7F6F2] dark:bg-[#212A25] hover:bg-[#ECE8DF] dark:hover:bg-[#28332D] text-[#252B27] dark:text-white'
                      : 'border-[#E4E1D9] bg-[#F7F6F2] hover:bg-[#ECE8DF] text-[#252B27]'
                  }`}
                  aria-label={soundEnabled ? 'Mute sound' : 'Enable sound'}
                >
                  {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4 opacity-60" />}
                  <span className="hidden sm:inline">{soundEnabled ? 'Sound On' : 'Muted'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleToggleFullscreen}
                  className="min-h-[42px] inline-flex items-center gap-1.5 rounded-xl bg-[#252B27] hover:bg-[#181D1A] dark:bg-white/15 dark:hover:bg-white/25 border border-black/10 dark:border-white/20 px-4 py-2 text-xs sm:text-sm font-semibold text-white whitespace-nowrap shrink-0 shadow-sm transition cursor-pointer"
                  aria-label="Exit Fullscreen"
                >
                  <Minimize2 className="h-4 w-4" />
                  <span>Exit Fullscreen</span>
                </button>
              </div>
            </div>
          )}

          {/* Active Custom Timer Identity & Milestone Banner */}
          <div className="w-full flex flex-wrap items-center justify-center gap-2 mb-2 z-10">
            <div
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs sm:text-sm font-semibold ${secondaryBoxBg} border-[#E4E1D9] dark:border-[#2A342D]`}
            >
              <span
                className="w-6 h-6 rounded-lg flex items-center justify-center text-white shrink-0"
                style={{ backgroundColor: timerColor }}
              >
                <CustomTimerIcon icon={activeCustomIcon} className="w-3.5 h-3.5" />
              </span>
              <span className="truncate max-w-[200px] sm:max-w-[280px]">
                {activeCustomTitle}
              </span>
              {activeCustomId && (
                <button
                  type="button"
                  onClick={() => handleToggleLikeTimer(activeCustomId)}
                  className="ml-0.5 text-[#D93B8A] hover:scale-110 transition-transform cursor-pointer"
                  aria-label="Toggle Liked Timer"
                  title="Like / Favorite this timer"
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      customTimers.find((t) => t.id === activeCustomId)?.liked
                        ? 'fill-current'
                        : ''
                    }`}
                  />
                </button>
              )}
            </div>

            {isBreakPhase && (
              <span className="px-3 py-1 rounded-xl text-xs font-bold bg-[#365C4B] text-white">
                Rest / Break Phase
              </span>
            )}

            {milestoneBanner && (
              <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-[#E06A3B]/15 text-[#E06A3B] border border-[#E06A3B]/30">
                {milestoneBanner}
              </span>
            )}
          </div>

          {activeCustomSubtitle && !isFullscreen && (
            <p className="text-xs text-center text-[#252B27]/65 dark:text-slate-400 max-w-md mb-1">
              {activeCustomSubtitle}
            </p>
          )}

          {/* Main Visual Display Area */}
          <div
            className={`${
              isFullscreen
                ? 'flex-1 min-h-0 w-full flex items-center justify-center'
                : 'w-full min-h-[280px] sm:min-h-[340px] lg:min-h-[380px] flex items-center justify-center py-2'
            } relative select-none`}
          >
            {/* 1. CIRCULAR STYLE (Default) */}
            {visualStyle === 'circular' && (
              <div
                className={`relative flex items-center justify-center ${
                  isFullscreen
                    ? 'w-[min(88vw,72dvh)] h-[min(88vw,72dvh)] max-w-[820px] max-h-[820px]'
                    : 'w-full max-w-[300px] sm:max-w-[380px] lg:max-w-[420px] aspect-square'
                }`}
              >
                <svg viewBox="0 0 240 240" shapeRendering="geometricPrecision" className="w-full h-full">
                  {/* Subtle Background Track */}
                  <circle
                    cx="120"
                    cy="120"
                    r="102"
                    fill="none"
                    stroke={bgMode === 'dark' ? '#2A342D' : '#E7EDE7'}
                    strokeWidth={isFullscreen ? 16 : 18}
                  />
                  {/* Active Remaining Ring Arc */}
                  <circle
                    cx="120"
                    cy="120"
                    r="102"
                    fill="none"
                    stroke={timerColor}
                    strokeWidth={isFullscreen ? 16 : 18}
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 102}
                    strokeDashoffset={2 * Math.PI * 102 * (1 - remainingFraction)}
                    transform="rotate(-90 120 120)"
                    className="transition-all duration-75"
                  />
                </svg>

                {/* Digital Readout Center */}
                {showTimeText && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-6">
                    <span
                      className={`font-bold font-mono tracking-tight tabular-nums leading-none ${
                        isFullscreen
                          ? 'text-[clamp(2.75rem,15vmin,9.5rem)]'
                          : 'text-5xl sm:text-6xl lg:text-7xl'
                      }`}
                    >
                      {displayTime}
                    </span>
                    <span
                      className={`${statusColorClass} ${
                        isFullscreen
                          ? 'text-[clamp(1rem,2.8vmin,2rem)] mt-2.5 sm:mt-4'
                          : 'text-sm sm:text-base mt-2'
                      }`}
                    >
                      {statusLabel}
                    </span>
                    {showElapsedTime && (
                      <span
                        className={`font-mono text-[#252B27]/50 dark:text-slate-400 ${
                          isFullscreen ? 'text-[clamp(0.8rem,2vmin,1.25rem)] mt-1.5' : 'text-xs mt-1'
                        }`}
                      >
                        Elapsed: {displayElapsed}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 2. PROGRESS BAR STYLE */}
            {visualStyle === 'progress-bar' && (
              <div
                className={`w-full flex flex-col items-center justify-center px-2 sm:px-6 ${
                  isFullscreen
                    ? 'max-w-[min(94vw,1240px)] space-y-6 sm:space-y-10'
                    : 'max-w-[480px] space-y-6'
                }`}
              >
                {showTimeText && (
                  <div className="text-center">
                    <span
                      className={`font-bold font-mono tracking-tight tabular-nums block leading-none ${
                        isFullscreen
                          ? 'text-[clamp(3.75rem,20vmin,13.5rem)]'
                          : 'text-6xl sm:text-7xl lg:text-8xl'
                      }`}
                    >
                      {displayTime}
                    </span>
                    <span
                      className={`${statusColorClass} block ${
                        isFullscreen
                          ? 'text-[clamp(1.1rem,3vmin,2.25rem)] mt-2.5 sm:mt-4'
                          : 'text-sm sm:text-base mt-2'
                      }`}
                    >
                      {statusLabel}
                    </span>
                    {showElapsedTime && (
                      <span
                        className={`font-mono text-[#252B27]/50 dark:text-slate-400 block ${
                          isFullscreen ? 'text-[clamp(0.8rem,2vmin,1.25rem)] mt-1.5' : 'text-xs mt-1'
                        }`}
                      >
                        Elapsed: {displayElapsed}
                      </span>
                    )}
                  </div>
                )}
                <div
                  className={`w-full overflow-hidden ${
                    isFullscreen
                      ? 'h-16 sm:h-24 md:h-32 rounded-2xl sm:rounded-3xl p-2 sm:p-3'
                      : 'h-16 sm:h-20 rounded-2xl p-2'
                  } ${
                    bgMode === 'dark'
                      ? 'bg-[#2A342D]'
                      : bgMode === 'auto'
                      ? 'bg-[#E7EDE7] dark:bg-[#2A342D]'
                      : 'bg-[#E7EDE7]'
                  }`}
                >
                  <div
                    className={`h-full transition-all duration-150 ${
                      isFullscreen ? 'rounded-xl sm:rounded-2xl' : 'rounded-xl'
                    }`}
                    style={{
                      width: `${remainingFraction * 100}%`,
                      backgroundColor: timerColor,
                    }}
                  />
                </div>
                <div
                  className={`w-full flex justify-between font-mono text-[#252B27]/55 dark:text-slate-400 px-1 ${
                    isFullscreen ? 'text-sm sm:text-lg md:text-xl' : 'text-xs sm:text-sm'
                  }`}
                >
                  <span>0%</span>
                  <span>{Math.round(remainingFraction * 100)}% remaining</span>
                  <span>100%</span>
                </div>
              </div>
            )}

            {/* 3. HOURGLASS STYLE */}
            {visualStyle === 'hourglass' && (
              <div
                className={`w-full flex items-center justify-center ${
                  isFullscreen
                    ? 'max-w-[min(94vw,1180px)] flex-col md:flex-row gap-6 sm:gap-10 md:gap-16'
                    : 'flex-col sm:flex-row gap-6 sm:gap-8'
                }`}
              >
                <div
                  className={`relative shrink-0 ${
                    isFullscreen
                      ? 'h-[min(42dvh,62vw)] md:h-[min(64dvh,42vw)] aspect-[2/3] w-auto'
                      : 'w-36 h-52 sm:w-44 sm:h-64'
                  }`}
                >
                  <svg viewBox="0 0 120 180" className="w-full h-full">
                    {/* Top & bottom wooden frames */}
                    <rect x="15" y="6" width="90" height="8" rx="4" fill="#365C4B" />
                    <rect x="15" y="166" width="90" height="8" rx="4" fill="#365C4B" />
                    {/* Glass contour */}
                    <path
                      d="M25 14 L95 14 L66 88 L95 166 L25 166 L54 88 Z"
                      fill="none"
                      stroke={bgMode === 'dark' ? '#4A5850' : '#B8C2B8'}
                      strokeWidth="3"
                    />
                    {/* Upper chamber sand */}
                    <clipPath id="topGlassClip">
                      <polygon points="28,16 92,16 62,86 58,86" />
                    </clipPath>
                    <g clipPath="url(#topGlassClip)">
                      <rect
                        x="25"
                        y={16 + (1 - remainingFraction) * 70}
                        width="70"
                        height={remainingFraction * 70}
                        fill={timerColor}
                      />
                    </g>
                    {/* Trickling sand stream */}
                    {status === 'running' && remainingFraction > 0 && (
                      <line
                        x1="60"
                        y1="86"
                        x2="60"
                        y2="164"
                        stroke={timerColor}
                        strokeWidth="2.5"
                        strokeDasharray="4 3"
                      />
                    )}
                    {/* Lower chamber accumulating sand */}
                    <clipPath id="bottomGlassClip">
                      <polygon points="58,90 62,90 92,164 28,164" />
                    </clipPath>
                    <g clipPath="url(#bottomGlassClip)">
                      <rect
                        x="25"
                        y={164 - (1 - remainingFraction) * 74}
                        width="70"
                        height={(1 - remainingFraction) * 74}
                        fill={timerColor}
                      />
                    </g>
                  </svg>
                </div>
                <div className={isFullscreen ? 'text-center md:text-left' : 'text-center sm:text-left'}>
                  {showTimeText && (
                    <div>
                      <span
                        className={`font-bold font-mono tracking-tight tabular-nums block leading-none ${
                          isFullscreen
                            ? 'text-[clamp(3.25rem,16vmin,11.5rem)]'
                            : 'text-5xl sm:text-6xl lg:text-7xl'
                        }`}
                      >
                        {displayTime}
                      </span>
                      <span
                        className={`${statusColorClass} block ${
                          isFullscreen
                            ? 'text-[clamp(1.05rem,2.8vmin,2rem)] mt-2.5 sm:mt-4'
                            : 'text-sm sm:text-base mt-2'
                        }`}
                      >
                        {statusLabel}
                      </span>
                      {showElapsedTime && (
                        <span
                          className={`font-mono text-[#252B27]/50 dark:text-slate-400 block ${
                            isFullscreen ? 'text-[clamp(0.8rem,2vmin,1.25rem)] mt-1.5' : 'text-xs mt-1'
                          }`}
                        >
                          Elapsed: {displayElapsed}
                        </span>
                      )}
                    </div>
                  )}
                  {!isFullscreen && (
                    <Link
                      href="/timers/sand-timer"
                      className="text-xs font-semibold text-[#365C4B] dark:text-[#5E917A] hover:underline inline-flex items-center gap-1 mt-3"
                    >
                      <span>Open Full 3D Sand Timer →</span>
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* 4. TRAFFIC LIGHT STYLE */}
            {visualStyle === 'traffic-light' && (
              <div
                className={`w-full flex items-center justify-center ${
                  isFullscreen
                    ? 'max-w-[min(94vw,1200px)] flex-col sm:flex-row gap-6 sm:gap-12 md:gap-20'
                    : 'gap-6 sm:gap-9'
                }`}
              >
                <div
                  className={`border-2 flex shadow-lg shrink-0 ${
                    isFullscreen
                      ? 'flex-row sm:flex-col p-4 sm:p-6 md:p-8 rounded-3xl sm:rounded-[2.25rem] gap-4 sm:gap-6'
                      : 'flex-col p-4 sm:p-5 rounded-3xl gap-3.5 sm:gap-4'
                  } ${
                    bgMode === 'dark' ? 'bg-[#121614] border-[#2A342D]' : 'bg-[#252B27] border-[#181D1A]'
                  }`}
                >
                  {/* Red light (top) */}
                  <div
                    className={`rounded-full border-2 transition-all ${
                      isFullscreen
                        ? 'w-[clamp(3.25rem,13vmin,7.5rem)] h-[clamp(3.25rem,13vmin,7.5rem)]'
                        : 'w-12 h-12 sm:w-16 sm:h-16'
                    } ${
                      status === 'completed' || remainingFraction === 0
                        ? 'bg-[#D94343] border-[#FF8585] shadow-lg shadow-red-500/50 scale-105'
                        : 'bg-[#401818] border-[#2B1010] opacity-40'
                    }`}
                  />
                  {/* Amber light (middle) */}
                  <div
                    className={`rounded-full border-2 transition-all ${
                      isFullscreen
                        ? 'w-[clamp(3.25rem,13vmin,7.5rem)] h-[clamp(3.25rem,13vmin,7.5rem)]'
                        : 'w-12 h-12 sm:w-16 sm:h-16'
                    } ${
                      remainingFraction > 0 && remainingFraction <= 0.2
                        ? 'bg-[#E06A3B] border-[#FFB28E] shadow-lg shadow-amber-500/50 scale-105'
                        : 'bg-[#3A2215] border-[#2B180D] opacity-40'
                    }`}
                  />
                  {/* Green light (bottom) */}
                  <div
                    className={`rounded-full border-2 transition-all ${
                      isFullscreen
                        ? 'w-[clamp(3.25rem,13vmin,7.5rem)] h-[clamp(3.25rem,13vmin,7.5rem)]'
                        : 'w-12 h-12 sm:w-16 sm:h-16'
                    } ${
                      remainingFraction > 0.2
                        ? 'bg-[#365C4B] border-[#70B393] shadow-lg shadow-emerald-600/50 scale-105'
                        : 'bg-[#16271F] border-[#0E1B15] opacity-40'
                    }`}
                  />
                </div>
                {showTimeText && (
                  <div className={isFullscreen ? 'text-center sm:text-left' : 'text-left'}>
                    <span
                      className={`font-bold font-mono tracking-tight tabular-nums block leading-none ${
                        isFullscreen
                          ? 'text-[clamp(3.5rem,18vmin,12.5rem)]'
                          : 'text-5xl sm:text-6xl lg:text-7xl'
                      }`}
                    >
                      {displayTime}
                    </span>
                    <span
                      className={`${statusColorClass} block ${
                        isFullscreen
                          ? 'text-[clamp(1.1rem,3vmin,2.25rem)] mt-2.5 sm:mt-4'
                          : 'text-sm sm:text-base lg:text-lg mt-2'
                      }`}
                    >
                      {status === 'running' && remainingFraction <= 0.2
                        ? 'Running · Wrapping Up'
                        : status === 'idle' && remainingFraction <= 0.2
                        ? 'Wrapping Up'
                        : statusLabel}
                    </span>
                    {showElapsedTime && (
                      <span
                        className={`font-mono text-[#252B27]/50 dark:text-slate-400 block ${
                          isFullscreen ? 'text-[clamp(0.8rem,2vmin,1.25rem)] mt-1.5' : 'text-xs mt-1'
                        }`}
                      >
                        Elapsed: {displayElapsed}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 5. RAINBOW STYLE */}
            {visualStyle === 'rainbow' && (
              <div
                className={`w-full flex flex-col items-center justify-center ${
                  isFullscreen ? 'max-w-[min(94vw,1120px)] space-y-4 sm:space-y-8' : 'space-y-5'
                }`}
              >
                <div
                  className={`relative flex items-center justify-center overflow-hidden ${
                    isFullscreen
                      ? 'w-[min(88vw,86dvh)] max-w-[840px] aspect-[200/110]'
                      : 'w-72 sm:w-88 lg:w-96 aspect-[200/110]'
                  }`}
                >
                  <svg viewBox="0 0 200 110" className="w-full h-full">
                    {/* Rainbow Arcs */}
                    {[
                      { r: 90, color: '#D94343' },
                      { r: 76, color: '#E06A3B' },
                      { r: 62, color: '#E5A93C' },
                      { r: 48, color: '#365C4B' },
                      { r: 34, color: '#2E6FD9' },
                      { r: 20, color: '#884DFF' },
                    ].map((band, idx) => {
                      const circ = Math.PI * band.r;
                      const offset = circ * (1 - remainingFraction);
                      return (
                        <path
                          key={idx}
                          d={`M ${100 - band.r} 105 A ${band.r} ${band.r} 0 0 1 ${100 + band.r} 105`}
                          fill="none"
                          stroke={band.color}
                          strokeWidth="10"
                          strokeLinecap="round"
                          strokeDasharray={circ}
                          strokeDashoffset={offset}
                          className="transition-all duration-100"
                        />
                      );
                    })}
                  </svg>
                </div>
                {showTimeText && (
                  <div className="text-center">
                    <span
                      className={`font-bold font-mono tracking-tight tabular-nums block leading-none ${
                        isFullscreen
                          ? 'text-[clamp(3.25rem,16vmin,10.5rem)]'
                          : 'text-5xl sm:text-6xl lg:text-7xl'
                      }`}
                    >
                      {displayTime}
                    </span>
                    <span
                      className={`${statusColorClass} block ${
                        isFullscreen
                          ? 'text-[clamp(1.05rem,2.8vmin,2rem)] mt-2.5 sm:mt-4'
                          : 'text-sm sm:text-base mt-2'
                      }`}
                    >
                      {statusLabel}
                    </span>
                    {showElapsedTime && (
                      <span
                        className={`font-mono text-[#252B27]/50 dark:text-slate-400 block ${
                          isFullscreen ? 'text-[clamp(0.8rem,2vmin,1.25rem)] mt-1.5' : 'text-xs mt-1'
                        }`}
                      >
                        Elapsed: {displayElapsed}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 6. MINIMAL DIGITAL STYLE */}
            {visualStyle === 'minimal-digital' && (
              <div
                className={`w-full flex flex-col items-center justify-center ${
                  isFullscreen ? 'max-w-[min(94vw,1240px)]' : 'max-w-[480px]'
                }`}
              >
                <div
                  className={`w-full rounded-2xl sm:rounded-3xl border-2 text-center transition-all ${secondaryBoxBg} ${
                    isFullscreen
                      ? 'py-[clamp(2rem,8dvh,6rem)] px-6 sm:px-14'
                      : 'py-10 sm:py-14 px-6 sm:px-10'
                  } ${
                    status === 'running'
                      ? 'border-[#365C4B] shadow-lg shadow-[#365C4B]/10'
                      : 'border-[#E4E1D9] dark:border-[#2A342D]'
                  }`}
                >
                  <span
                    className={`font-bold font-mono tracking-tight tabular-nums block leading-none ${
                      isFullscreen
                        ? 'text-[clamp(4rem,22vmin,15rem)]'
                        : 'text-6xl sm:text-7xl lg:text-8xl'
                    }`}
                  >
                    {displayTime}
                  </span>
                  {showTimeText && (
                    <span
                      className={`${statusColorClass} block uppercase tracking-wider ${
                        isFullscreen
                          ? 'text-[clamp(1.05rem,2.8vmin,2rem)] mt-3 sm:mt-5'
                          : 'text-sm sm:text-base mt-3'
                      }`}
                    >
                      {statusLabel}
                    </span>
                  )}
                  {showElapsedTime && (
                    <span
                      className={`font-mono text-[#252B27]/50 dark:text-slate-400 block ${
                        isFullscreen ? 'text-[clamp(0.8rem,2vmin,1.25rem)] mt-1.5' : 'text-xs mt-1.5'
                      }`}
                    >
                      Elapsed: {displayElapsed}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* 7. LIQUID WAVE STYLE */}
            {visualStyle === 'liquid-wave' && (
              <LiquidWaveVisual
                isFullscreen={isFullscreen}
                remainingFraction={remainingFraction}
                displayTime={displayTime}
                displayElapsed={displayElapsed}
                statusLabel={statusLabel}
                statusColorClass={statusColorClass}
                showTimeText={showTimeText}
                showElapsedTime={showElapsedTime}
                timerColor={timerColor}
                bgMode={bgMode}
                status={status}
                remainingMs={remainingMs}
              />
            )}

            {/* 8. GROWING BLOOM STYLE */}
            {visualStyle === 'plant-growth' && (
              <PlantGrowthVisual
                isFullscreen={isFullscreen}
                remainingFraction={remainingFraction}
                displayTime={displayTime}
                displayElapsed={displayElapsed}
                statusLabel={statusLabel}
                statusColorClass={statusColorClass}
                showTimeText={showTimeText}
                showElapsedTime={showElapsedTime}
                timerColor={timerColor}
                bgMode={bgMode}
                status={status}
                remainingMs={remainingMs}
              />
            )}

            {/* 9. ENERGY BATTERY CELLS STYLE */}
            {visualStyle === 'battery-charge' && (
              <BatteryChargeVisual
                isFullscreen={isFullscreen}
                remainingFraction={remainingFraction}
                displayTime={displayTime}
                displayElapsed={displayElapsed}
                statusLabel={statusLabel}
                statusColorClass={statusColorClass}
                showTimeText={showTimeText}
                showElapsedTime={showElapsedTime}
                timerColor={timerColor}
                bgMode={bgMode}
                status={status}
                remainingMs={remainingMs}
              />
            )}

            {/* 10. ZEN BREATHING ORB STYLE */}
            {visualStyle === 'breathing-orb' && (
              <BreathingOrbVisual
                isFullscreen={isFullscreen}
                remainingFraction={remainingFraction}
                displayTime={displayTime}
                displayElapsed={displayElapsed}
                statusLabel={statusLabel}
                statusColorClass={statusColorClass}
                showTimeText={showTimeText}
                showElapsedTime={showElapsedTime}
                timerColor={timerColor}
                bgMode={bgMode}
                status={status}
                remainingMs={remainingMs}
              />
            )}
          </div>

          {/* Dedicated Transport Buttons (shown in both normal view and responsive fullscreen footer) */}
          <div
            className={`flex flex-col items-center gap-2.5 shrink-0 z-20 ${
              isFullscreen ? 'pb-1 sm:pb-2' : 'mt-6'
            }`}
          >
            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
              {/* Start / Running... / Resume Button */}
              <button
                type="button"
                onClick={handleStart}
                aria-pressed={status === 'running'}
                className={`min-h-[44px] px-5 sm:px-6 py-2.5 rounded-xl text-white font-semibold text-sm sm:text-base flex items-center gap-2 whitespace-nowrap shrink-0 shadow-xs transition-all cursor-pointer ${
                  status === 'running'
                    ? 'ring-2 ring-offset-2 ring-[#365C4B] dark:ring-offset-[#181F1B] opacity-95'
                    : 'active:scale-95 hover:opacity-95'
                }`}
                style={{ backgroundColor: timerColor }}
              >
                <Play className="w-4 h-4 fill-current shrink-0" />
                <span>
                  {status === 'running' ? 'Running...' : status === 'paused' ? 'Resume' : 'Start'}
                </span>
              </button>

              {/* Pause Button */}
              <button
                type="button"
                onClick={handlePause}
                disabled={status !== 'running'}
                className={`min-h-[44px] px-5 sm:px-6 py-2.5 rounded-xl border text-sm sm:text-base font-medium flex items-center gap-2 whitespace-nowrap shrink-0 transition-all ${
                  status !== 'running' ? 'opacity-60 cursor-not-allowed' : 'active:scale-95 cursor-pointer'
                } ${
                  bgMode === 'dark'
                    ? 'border-[#2A342D] bg-[#212A25] hover:bg-[#28332D] text-white'
                    : bgMode === 'auto'
                    ? 'border-[#E4E1D9] dark:border-[#2A342D] bg-white dark:bg-[#212A25] hover:bg-[#F7F6F2] dark:hover:bg-[#28332D] text-[#252B27] dark:text-white'
                    : 'border-[#E4E1D9] bg-white hover:bg-[#F7F6F2] text-[#252B27]'
                }`}
              >
                <Pause className="w-4 h-4 fill-current shrink-0" />
                <span>{status === 'paused' ? 'Paused' : 'Pause'}</span>
              </button>

              {/* Reset Button */}
              <button
                type="button"
                onClick={handleReset}
                className={`min-h-[44px] px-5 sm:px-6 py-2.5 rounded-xl border text-sm sm:text-base font-medium flex items-center gap-2 whitespace-nowrap shrink-0 transition-all active:scale-95 cursor-pointer ${
                  bgMode === 'dark'
                    ? 'border-[#2A342D] bg-[#212A25] hover:bg-[#28332D] text-white'
                    : bgMode === 'auto'
                    ? 'border-[#E4E1D9] dark:border-[#2A342D] bg-white dark:bg-[#212A25] hover:bg-[#F7F6F2] dark:hover:bg-[#28332D] text-[#252B27] dark:text-white'
                    : 'border-[#E4E1D9] bg-white hover:bg-[#F7F6F2] text-[#252B27]'
                }`}
              >
                <RotateCcw className="w-4 h-4 shrink-0" />
                <span>Reset</span>
              </button>
            </div>

            {/* Live On-The-Fly Quick Time Adjusters (-1m, +1m, +5m without resetting!) */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-[11px] opacity-60 mr-1">Quick Adjust:</span>
              {[
                { label: '-1m', delta: -60 },
                { label: '+1m', delta: 60 },
                { label: '+5m', delta: 300 },
              ].map((adj) => (
                <button
                  key={adj.label}
                  type="button"
                  onClick={() => handleLiveAdjustSeconds(adj.delta)}
                  className={`px-2.5 py-1 rounded-lg border font-mono font-semibold transition-all active:scale-95 cursor-pointer ${
                    bgMode === 'dark'
                      ? 'border-[#2A342D] bg-[#212A25] hover:bg-[#28332D] text-slate-200'
                      : bgMode === 'auto'
                      ? 'border-[#E4E1D9] dark:border-[#2A342D] bg-[#F7F6F2] dark:bg-[#212A25] hover:bg-[#ECE8DF] dark:hover:bg-[#28332D] text-[#252B27] dark:text-slate-200'
                      : 'border-[#E4E1D9] bg-[#F7F6F2] hover:bg-[#ECE8DF] text-[#252B27]'
                  }`}
                  title="Adjust remaining time without resetting"
                >
                  {adj.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: MODE TABS, STEPPERS, PRESETS & SETTINGS GRID */}
        <div className="lg:col-span-6 space-y-6">
          {/* Duration vs End Time Tabs + Non-Intrusive Keyboard Shortcuts Button/Tooltip */}
          <div className="flex items-center justify-between gap-3">
            <div
              className={`p-1 rounded-xl flex items-center gap-1 ${
                bgMode === 'dark'
                  ? 'bg-[#212A25]'
                  : bgMode === 'auto'
                  ? 'bg-[#E7EDE7] dark:bg-[#212A25]'
                  : 'bg-[#E7EDE7]'
              }`}
            >
              <button
                type="button"
                onClick={() => setTimerMode('duration')}
                className={`px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  timerMode === 'duration'
                    ? 'text-white shadow-xs'
                    : 'text-[#252B27]/70 dark:text-slate-300 hover:text-[#252B27] dark:hover:text-white'
                }`}
                style={{
                  backgroundColor: timerMode === 'duration' ? timerColor : 'transparent',
                }}
              >
                Duration
              </button>
              <button
                type="button"
                onClick={() => setTimerMode('endTime')}
                className={`px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  timerMode === 'endTime'
                    ? 'text-white shadow-xs'
                    : 'text-[#252B27]/70 dark:text-slate-300 hover:text-[#252B27] dark:hover:text-white'
                }`}
                style={{
                  backgroundColor: timerMode === 'endTime' ? timerColor : 'transparent',
                }}
              >
                End Time
              </button>
            </div>

            {/* Non-intrusive Keyboard Shortcuts Trigger with Hover Tooltip & Modal */}
            <div className="relative group">
              <button
                type="button"
                onClick={() => setShowShortcutsModal((prev) => !prev)}
                aria-label="Keyboard Shortcuts"
                aria-haspopup="dialog"
                aria-expanded={showShortcutsModal}
                className={`px-3 py-2 rounded-xl border text-xs font-medium inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  bgMode === 'dark'
                    ? 'border-[#2A342D] bg-[#212A25] hover:bg-[#28332D] text-slate-300 hover:text-white'
                    : bgMode === 'auto'
                    ? 'border-[#E4E1D9] dark:border-[#2A342D] bg-[#F7F6F2] dark:bg-[#212A25] hover:bg-[#ECE8DF] dark:hover:bg-[#28332D] text-[#252B27]/75 dark:text-slate-300 hover:text-[#252B27] dark:hover:text-white'
                    : 'border-[#E4E1D9] bg-[#F7F6F2] hover:bg-[#ECE8DF] text-[#252B27]/75 hover:text-[#252B27]'
                }`}
              >
                <Keyboard className="w-3.5 h-3.5 shrink-0 opacity-80" />
                <span className="hidden sm:inline">Shortcuts</span>
                <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono rounded bg-black/5 dark:bg-white/10 opacity-75">
                  ?
                </kbd>
              </button>

              {/* Interactive Hover/Focus Tooltip */}
              <div
                role="tooltip"
                className="opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto transition-opacity duration-150 absolute right-0 top-full pt-2 w-64 z-30 hidden sm:block"
              >
                <div className="p-2.5 rounded-xl bg-[#181F1B] text-white text-[11px] leading-relaxed shadow-lg border border-[#2A342D]">
                  <p className="font-semibold text-white/95 mb-1.5 px-1">
                    Keyboard Shortcuts <span className="text-[10px] font-normal text-slate-400">(press key or click)</span>
                  </p>
                  <div className="space-y-1 text-slate-300">
                    <button
                      type="button"
                      onClick={() => (status === 'running' ? handlePause() : handleStart())}
                      className="w-full flex items-center justify-between px-1.5 py-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer text-left"
                    >
                      <span>Start / Pause</span>
                      <kbd className="px-1.5 py-0.5 rounded bg-white/15 font-mono text-[10px] text-white">Space</kbd>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReset()}
                      className="w-full flex items-center justify-between px-1.5 py-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer text-left"
                    >
                      <span>Reset Timer</span>
                      <kbd className="px-1.5 py-0.5 rounded bg-white/15 font-mono text-[10px] text-white">R</kbd>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleFullscreen()}
                      className="w-full flex items-center justify-between px-1.5 py-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer text-left"
                    >
                      <span>Fullscreen</span>
                      <kbd className="px-1.5 py-0.5 rounded bg-white/15 font-mono text-[10px] text-white">F</kbd>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stepper Inputs: [15] [00] [00] minutes (or End Time clock input) */}
          {timerMode === 'duration' ? (
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              {/* Minutes box */}
              <div
                className={`flex items-center rounded-xl border px-3 py-1.5 ${
                  bgMode === 'dark'
                    ? 'bg-[#212A25] border-[#2A342D]'
                    : bgMode === 'auto'
                    ? 'bg-[#F7F6F2] dark:bg-[#212A25] border-[#E4E1D9] dark:border-[#2A342D]'
                    : 'bg-[#F7F6F2] border-[#E4E1D9]'
                }`}
              >
                <input
                  type="text"
                  inputMode="numeric"
                  value={String(minutes).padStart(2, '0')}
                  onChange={(e) => {
                    const val = Math.max(0, Math.min(59, parseInt(e.target.value, 10) || 0));
                    setMinutes(val);
                    syncDurationFromInputs(hours, val, seconds);
                  }}
                  className="w-10 text-center font-mono text-base font-bold bg-transparent outline-hidden"
                  aria-label="Minutes"
                />
                <div className="flex flex-col ml-1">
                  <button
                    type="button"
                    onClick={() => adjustValue('m', 1)}
                    className="text-[#252B27]/60 dark:text-slate-400 hover:text-[#365C4B] cursor-pointer"
                    aria-label="Increase minutes"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustValue('m', -1)}
                    className="text-[#252B27]/60 dark:text-slate-400 hover:text-[#365C4B] cursor-pointer"
                    aria-label="Decrease minutes"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Seconds box */}
              <div
                className={`flex items-center rounded-xl border px-3 py-1.5 ${
                  bgMode === 'dark'
                    ? 'bg-[#212A25] border-[#2A342D]'
                    : bgMode === 'auto'
                    ? 'bg-[#F7F6F2] dark:bg-[#212A25] border-[#E4E1D9] dark:border-[#2A342D]'
                    : 'bg-[#F7F6F2] border-[#E4E1D9]'
                }`}
              >
                <input
                  type="text"
                  inputMode="numeric"
                  value={String(seconds).padStart(2, '0')}
                  onChange={(e) => {
                    const val = Math.max(0, Math.min(59, parseInt(e.target.value, 10) || 0));
                    setSeconds(val);
                    syncDurationFromInputs(hours, minutes, val);
                  }}
                  className="w-10 text-center font-mono text-base font-bold bg-transparent outline-hidden"
                  aria-label="Seconds"
                />
                <div className="flex flex-col ml-1">
                  <button
                    type="button"
                    onClick={() => adjustValue('s', 5)}
                    className="text-[#252B27]/60 dark:text-slate-400 hover:text-[#365C4B] cursor-pointer"
                    aria-label="Increase seconds"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustValue('s', -5)}
                    className="text-[#252B27]/60 dark:text-slate-400 hover:text-[#365C4B] cursor-pointer"
                    aria-label="Decrease seconds"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Optional Hours box */}
              <div
                className={`flex items-center rounded-xl border px-3 py-1.5 ${
                  bgMode === 'dark'
                    ? 'bg-[#212A25] border-[#2A342D]'
                    : bgMode === 'auto'
                    ? 'bg-[#F7F6F2] dark:bg-[#212A25] border-[#E4E1D9] dark:border-[#2A342D]'
                    : 'bg-[#F7F6F2] border-[#E4E1D9]'
                }`}
              >
                <input
                  type="text"
                  inputMode="numeric"
                  value={String(hours).padStart(2, '0')}
                  onChange={(e) => {
                    const val = Math.max(0, Math.min(23, parseInt(e.target.value, 10) || 0));
                    setHours(val);
                    syncDurationFromInputs(val, minutes, seconds);
                  }}
                  className="w-10 text-center font-mono text-base font-bold bg-transparent outline-hidden"
                  aria-label="Hours"
                />
                <div className="flex flex-col ml-1">
                  <button
                    type="button"
                    onClick={() => adjustValue('h', 1)}
                    className="text-[#252B27]/60 dark:text-slate-400 hover:text-[#365C4B] cursor-pointer"
                    aria-label="Increase hours"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustValue('h', -1)}
                    className="text-[#252B27]/60 dark:text-slate-400 hover:text-[#365C4B] cursor-pointer"
                    aria-label="Decrease hours"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <span className="text-xs sm:text-sm font-medium text-[#252B27]/70 dark:text-slate-300">
                minutes
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <input
                type="time"
                value={targetEndTimeStr}
                onChange={(e) => handleEndTimeChange(e.target.value)}
                className={`px-4 py-2 rounded-xl border font-mono text-base font-bold ${
                  bgMode === 'dark'
                    ? 'bg-[#212A25] border-[#2A342D] text-white'
                    : bgMode === 'auto'
                    ? 'bg-[#F7F6F2] dark:bg-[#212A25] border-[#E4E1D9] dark:border-[#2A342D] text-[#252B27] dark:text-white'
                    : 'bg-[#F7F6F2] border-[#E4E1D9] text-[#252B27]'
                }`}
              />
              <span className="text-xs sm:text-sm text-[#252B27]/70 dark:text-slate-300">
                Count down to target time
              </span>
            </div>
          )}

          {/* Quick Presets: 1 min, 5 min, 10 min, 15 min [active], 30 min, Custom */}
          <div className="flex flex-wrap items-center gap-2">
            {PRESETS.map((p) => {
              const isSelected = selectedPreset === p.label;
              return (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => handleSelectPreset(p.label, p.seconds)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'text-white shadow-xs'
                      : bgMode === 'dark'
                      ? 'bg-[#212A25] text-slate-300 hover:bg-[#2B352F]'
                      : bgMode === 'auto'
                      ? 'bg-[#F7F6F2] dark:bg-[#212A25] text-[#252B27] dark:text-slate-300 hover:bg-[#ECE8DF] dark:hover:bg-[#2B352F]'
                      : 'bg-[#F7F6F2] text-[#252B27] hover:bg-[#ECE8DF]'
                  }`}
                  style={{
                    backgroundColor: isSelected ? timerColor : undefined,
                  }}
                >
                  {p.label}
                </button>
              );
            })}
            <button
              type="button"
              onClick={handleCustomPresetClick}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                selectedPreset === 'Custom'
                  ? 'text-white shadow-xs'
                  : bgMode === 'dark'
                  ? 'bg-[#212A25] text-slate-300 hover:bg-[#2B352F]'
                  : bgMode === 'auto'
                  ? 'bg-[#F7F6F2] dark:bg-[#212A25] text-[#252B27] dark:text-slate-300 hover:bg-[#ECE8DF] dark:hover:bg-[#2B352F]'
                  : 'bg-[#F7F6F2] text-[#252B27] hover:bg-[#ECE8DF]'
              }`}
              style={{
                backgroundColor: selectedPreset === 'Custom' ? timerColor : undefined,
              }}
            >
              Custom
            </button>
          </div>

          {/* 2-Column Settings Grid with Toggles matching the screenshot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5 pt-2">
            {/* Left Column Controls */}
            {/* 1. Sound */}
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-medium flex items-center gap-2">
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-[#365C4B] dark:text-[#5E917A]" />
                ) : (
                  <VolumeX className="w-4 h-4 text-slate-400" />
                )}
                <span>Sound</span>
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={soundEnabled}
                onClick={() => setSoundEnabled((prev) => !prev)}
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                  soundEnabled ? 'bg-[#365C4B]' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    soundEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* 4. Fullscreen */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleToggleFullscreen}
                className="text-xs sm:text-sm font-medium flex items-center gap-2 cursor-pointer hover:opacity-85 text-left"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4 text-[#365C4B] dark:text-[#5E917A]" />
                ) : (
                  <Maximize2 className="w-4 h-4 text-[#365C4B] dark:text-[#5E917A]" />
                )}
                <span>Fullscreen</span>
              </button>
              <button
                type="button"
                onClick={handleToggleFullscreen}
                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                  bgMode === 'dark'
                    ? 'border-[#2A342D] hover:bg-[#212A25]'
                    : bgMode === 'auto'
                    ? 'border-[#E4E1D9] dark:border-[#2A342D] hover:bg-[#F7F6F2] dark:hover:bg-[#212A25]'
                    : 'border-[#E4E1D9] hover:bg-[#F7F6F2]'
                }`}
                title="Toggle Fullscreen (F)"
                aria-label="Toggle Fullscreen"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-3.5 h-3.5" />
                ) : (
                  <Maximize2 className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* 2. Alarm at end */}
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-medium flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#365C4B]" />
                <span>Alarm at end</span>
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={alarmAtEnd}
                onClick={() => setAlarmAtEnd((prev) => !prev)}
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                  alarmAtEnd ? 'bg-[#365C4B]' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    alarmAtEnd ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* 5. Show time text */}
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-medium flex items-center gap-2">
                <span className="w-4 h-4 font-mono font-bold text-xs flex items-center justify-center text-[#365C4B]">
                  00
                </span>
                <span>Show time text</span>
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={showTimeText}
                onClick={() => setShowTimeText((prev) => !prev)}
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                  showTimeText ? 'bg-[#365C4B]' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    showTimeText ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* 3. Elapsed time */}
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-medium flex items-center gap-2">
                <span className="w-4 h-4 rounded-full border border-current text-[9px] flex items-center justify-center text-[#365C4B]">
                  +
                </span>
                <span>Elapsed time</span>
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={showElapsedTime}
                onClick={() => setShowElapsedTime((prev) => !prev)}
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                  showElapsedTime ? 'bg-[#365C4B]' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    showElapsedTime ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* 6. Keep screen awake */}
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-medium flex items-center gap-2">
                <Sun className="w-4 h-4 text-[#365C4B]" />
                <span>Keep screen awake</span>
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={keepScreenAwake}
                onClick={() => setKeepScreenAwake((prev) => !prev)}
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                  keepScreenAwake ? 'bg-[#365C4B]' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    keepScreenAwake ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* SECTION 2: CHOOSE VISUAL STYLE (10 ANIMATED VISUAL CARDS)           */}
      {/* =================================================================== */}
      <div className="mt-10 pt-8 border-t border-[#E4E1D9] dark:border-[#2A342D]">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <h3 className="text-sm sm:text-base font-bold text-[#252B27] dark:text-white">
            Choose Animated Visual Style (10 Styles)
          </h3>
          <span className="text-xs text-[#252B27]/60 dark:text-slate-400">
            Includes Reverse-Anxiety Plant Growth, Liquid Wave, Energy Battery & Zen Breathing Orb
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {/* 1. Circular */}
          <button
            type="button"
            onClick={() => setVisualStyle('circular')}
            className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-between transition-all cursor-pointer ${
              visualStyle === 'circular'
                ? 'border-[#365C4B] bg-[#E7EDE7]/40 dark:bg-[#252E28] ring-1 ring-[#365C4B]'
                : bgMode === 'dark'
                ? 'border-[#2A342D] bg-[#212A25] hover:border-slate-600'
                : bgMode === 'auto'
                ? 'border-[#E4E1D9] dark:border-[#2A342D] bg-white dark:bg-[#212A25] hover:border-[#365C4B]/50 dark:hover:border-slate-600'
                : 'border-[#E4E1D9] bg-white hover:border-[#365C4B]/50'
            }`}
          >
            <div className="w-12 h-12 relative flex items-center justify-center my-1">
              <svg viewBox="0 0 40 40" className="w-full h-full">
                <circle cx="20" cy="20" r="14" fill="none" stroke="#E7EDE7" strokeWidth="4" />
                <circle
                  cx="20"
                  cy="20"
                  r="14"
                  fill="none"
                  stroke={timerColor}
                  strokeWidth="4"
                  strokeDasharray={2 * Math.PI * 14}
                  strokeDashoffset={2 * Math.PI * 14 * 0.25}
                  transform="rotate(-90 20 20)"
                />
              </svg>
            </div>
            <span className="text-xs font-semibold text-[#252B27] dark:text-white mt-1">
              Circular
            </span>
          </button>

          {/* 2. Progress Bar */}
          <button
            type="button"
            onClick={() => setVisualStyle('progress-bar')}
            className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-between transition-all cursor-pointer ${
              visualStyle === 'progress-bar'
                ? 'border-[#365C4B] bg-[#E7EDE7]/40 dark:bg-[#252E28] ring-1 ring-[#365C4B]'
                : bgMode === 'dark'
                ? 'border-[#2A342D] bg-[#212A25] hover:border-slate-600'
                : bgMode === 'auto'
                ? 'border-[#E4E1D9] dark:border-[#2A342D] bg-white dark:bg-[#212A25] hover:border-[#365C4B]/50 dark:hover:border-slate-600'
                : 'border-[#E4E1D9] bg-white hover:border-[#365C4B]/50'
            }`}
          >
            <div className="w-16 h-12 flex items-center justify-center my-1">
              <div className="w-full h-3 rounded-full bg-[#E7EDE7] p-0.5">
                <div
                  className="h-full w-2/3 rounded-full"
                  style={{ backgroundColor: timerColor }}
                />
              </div>
            </div>
            <span className="text-xs font-semibold text-[#252B27] dark:text-white mt-1">
              Progress Bar
            </span>
          </button>

          {/* 3. Hourglass */}
          <button
            type="button"
            onClick={() => setVisualStyle('hourglass')}
            className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-between transition-all cursor-pointer ${
              visualStyle === 'hourglass'
                ? 'border-[#365C4B] bg-[#E7EDE7]/40 dark:bg-[#252E28] ring-1 ring-[#365C4B]'
                : bgMode === 'dark'
                ? 'border-[#2A342D] bg-[#212A25] hover:border-slate-600'
                : bgMode === 'auto'
                ? 'border-[#E4E1D9] dark:border-[#2A342D] bg-white dark:bg-[#212A25] hover:border-[#365C4B]/50 dark:hover:border-slate-600'
                : 'border-[#E4E1D9] bg-white hover:border-[#365C4B]/50'
            }`}
          >
            <div className="w-12 h-12 relative flex items-center justify-center my-1">
              <svg viewBox="0 0 30 40" className="w-6 h-8">
                <rect x="2" y="2" width="26" height="3" rx="1.5" fill="#365C4B" />
                <rect x="2" y="35" width="26" height="3" rx="1.5" fill="#365C4B" />
                <path d="M5 5 L25 5 L17 20 L25 35 L5 35 L13 20 Z" fill="none" stroke="#8A9A8A" strokeWidth="1.5" />
                <polygon points="7,8 23,8 15,19" fill="#D94343" />
                <polygon points="15,21 21,32 9,32" fill="#D94343" />
              </svg>
            </div>
            <span className="text-xs font-semibold text-[#252B27] dark:text-white mt-1">
              Hourglass
            </span>
          </button>

          {/* 4. Traffic Light */}
          <button
            type="button"
            onClick={() => setVisualStyle('traffic-light')}
            className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-between transition-all cursor-pointer ${
              visualStyle === 'traffic-light'
                ? 'border-[#365C4B] bg-[#E7EDE7]/40 dark:bg-[#252E28] ring-1 ring-[#365C4B]'
                : bgMode === 'dark'
                ? 'border-[#2A342D] bg-[#212A25] hover:border-slate-600'
                : bgMode === 'auto'
                ? 'border-[#E4E1D9] dark:border-[#2A342D] bg-white dark:bg-[#212A25] hover:border-[#365C4B]/50 dark:hover:border-slate-600'
                : 'border-[#E4E1D9] bg-white hover:border-[#365C4B]/50'
            }`}
          >
            <div className="w-12 h-12 flex flex-col items-center justify-center gap-1 my-1">
              <div className="w-2.5 h-2.5 rounded-full bg-[#D94343]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#E06A3B]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#365C4B]" />
            </div>
            <span className="text-xs font-semibold text-[#252B27] dark:text-white mt-1">
              Traffic Light
            </span>
          </button>

          {/* 5. Rainbow */}
          <button
            type="button"
            onClick={() => setVisualStyle('rainbow')}
            className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-between transition-all cursor-pointer ${
              visualStyle === 'rainbow'
                ? 'border-[#365C4B] bg-[#E7EDE7]/40 dark:bg-[#252E28] ring-1 ring-[#365C4B]'
                : bgMode === 'dark'
                ? 'border-[#2A342D] bg-[#212A25] hover:border-slate-600'
                : bgMode === 'auto'
                ? 'border-[#E4E1D9] dark:border-[#2A342D] bg-white dark:bg-[#212A25] hover:border-[#365C4B]/50 dark:hover:border-slate-600'
                : 'border-[#E4E1D9] bg-white hover:border-[#365C4B]/50'
            }`}
          >
            <div className="w-12 h-12 flex items-center justify-center my-1">
              <svg viewBox="0 0 40 24" className="w-10 h-6">
                <path d="M 4 22 A 16 16 0 0 1 36 22" fill="none" stroke="#D94343" strokeWidth="2.5" />
                <path d="M 7 22 A 13 13 0 0 1 33 22" fill="none" stroke="#E06A3B" strokeWidth="2.5" />
                <path d="M 10 22 A 10 10 0 0 1 30 22" fill="none" stroke="#365C4B" strokeWidth="2.5" />
                <path d="M 13 22 A 7 7 0 0 1 27 22" fill="none" stroke="#2E6FD9" strokeWidth="2.5" />
              </svg>
            </div>
            <span className="text-xs font-semibold text-[#252B27] dark:text-white mt-1">
              Rainbow
            </span>
          </button>

          {/* 6. Minimal Digital */}
          <button
            type="button"
            onClick={() => setVisualStyle('minimal-digital')}
            className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-between transition-all cursor-pointer ${
              visualStyle === 'minimal-digital'
                ? 'border-[#365C4B] bg-[#E7EDE7]/40 dark:bg-[#252E28] ring-1 ring-[#365C4B]'
                : bgMode === 'dark'
                ? 'border-[#2A342D] bg-[#212A25] hover:border-slate-600'
                : bgMode === 'auto'
                ? 'border-[#E4E1D9] dark:border-[#2A342D] bg-white dark:bg-[#212A25] hover:border-[#365C4B]/50 dark:hover:border-slate-600'
                : 'border-[#E4E1D9] bg-white hover:border-[#365C4B]/50'
            }`}
          >
            <div className="w-14 h-12 flex items-center justify-center my-1">
              <div className="px-2 py-1 rounded-md border border-[#E4E1D9] dark:border-slate-600 font-mono text-[11px] font-bold">
                15:00
              </div>
            </div>
            <span className="text-xs font-semibold text-[#252B27] dark:text-white mt-1">
              Minimal Digital
            </span>
          </button>

          {/* 7. Growing Bloom (Reverse-Anxiety Plant Growth) */}
          <button
            type="button"
            onClick={() => setVisualStyle('plant-growth')}
            className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-between transition-all cursor-pointer relative ${
              visualStyle === 'plant-growth'
                ? 'border-[#365C4B] bg-[#E7EDE7]/40 dark:bg-[#252E28] ring-1 ring-[#365C4B]'
                : bgMode === 'dark'
                ? 'border-[#2A342D] bg-[#212A25] hover:border-slate-600'
                : bgMode === 'auto'
                ? 'border-[#E4E1D9] dark:border-[#2A342D] bg-white dark:bg-[#212A25] hover:border-[#365C4B]/50 dark:hover:border-slate-600'
                : 'border-[#E4E1D9] bg-white hover:border-[#365C4B]/50'
            }`}
          >
            <div className="w-12 h-12 flex items-center justify-center my-1">
              <svg viewBox="0 0 40 40" className="w-9 h-9">
                <path d="M13 30 L27 30 L25 37 L15 37 Z" fill="#C86D51" />
                <path d="M20 30 L20 14" stroke={timerColor} strokeWidth="2.5" strokeLinecap="round" />
                <path d="M20 23 C14 20 14 16 20 19" fill={timerColor} />
                <path d="M20 20 C26 17 26 13 20 16" fill={timerColor} />
                <circle cx="20" cy="11" r="4.5" fill="#F28B82" />
                <circle cx="20" cy="11" r="2" fill="#F6AD55" />
              </svg>
            </div>
            <span className="text-xs font-semibold text-[#252B27] dark:text-white mt-1">
              Growing Bloom
            </span>
          </button>

          {/* 8. Liquid Wave */}
          <button
            type="button"
            onClick={() => setVisualStyle('liquid-wave')}
            className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-between transition-all cursor-pointer ${
              visualStyle === 'liquid-wave'
                ? 'border-[#365C4B] bg-[#E7EDE7]/40 dark:bg-[#252E28] ring-1 ring-[#365C4B]'
                : bgMode === 'dark'
                ? 'border-[#2A342D] bg-[#212A25] hover:border-slate-600'
                : bgMode === 'auto'
                ? 'border-[#E4E1D9] dark:border-[#2A342D] bg-white dark:bg-[#212A25] hover:border-[#365C4B]/50 dark:hover:border-slate-600'
                : 'border-[#E4E1D9] bg-white hover:border-[#365C4B]/50'
            }`}
          >
            <div className="w-12 h-12 flex items-center justify-center my-1">
              <svg viewBox="0 0 40 40" className="w-8 h-9">
                <rect x="7" y="5" width="26" height="30" rx="7" fill="none" stroke="#8A9A8A" strokeWidth="2" />
                <path d="M8 20 Q14 17 20 20 T32 20 L32 32 C32 34 30 34 28 34 L12 34 C10 34 8 34 8 32 Z" fill={timerColor} />
              </svg>
            </div>
            <span className="text-xs font-semibold text-[#252B27] dark:text-white mt-1">
              Liquid Wave
            </span>
          </button>

          {/* 9. Energy Battery */}
          <button
            type="button"
            onClick={() => setVisualStyle('battery-charge')}
            className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-between transition-all cursor-pointer ${
              visualStyle === 'battery-charge'
                ? 'border-[#365C4B] bg-[#E7EDE7]/40 dark:bg-[#252E28] ring-1 ring-[#365C4B]'
                : bgMode === 'dark'
                ? 'border-[#2A342D] bg-[#212A25] hover:border-slate-600'
                : bgMode === 'auto'
                ? 'border-[#E4E1D9] dark:border-[#2A342D] bg-white dark:bg-[#212A25] hover:border-[#365C4B]/50 dark:hover:border-slate-600'
                : 'border-[#E4E1D9] bg-white hover:border-[#365C4B]/50'
            }`}
          >
            <div className="w-14 h-12 flex items-center justify-center my-1">
              <div className="flex items-center gap-0.5">
                <div className="w-10 h-5 rounded-md border border-[#8A9A8A] p-0.5 grid grid-cols-4 gap-0.5">
                  <div className="rounded-xs" style={{ backgroundColor: timerColor }} />
                  <div className="rounded-xs" style={{ backgroundColor: timerColor }} />
                  <div className="rounded-xs" style={{ backgroundColor: timerColor }} />
                  <div className="rounded-xs bg-black/10 dark:bg-white/10" />
                </div>
                <div className="w-1 h-2.5 rounded-r-xs bg-[#8A9A8A]" />
              </div>
            </div>
            <span className="text-xs font-semibold text-[#252B27] dark:text-white mt-1">
              Energy Cells
            </span>
          </button>

          {/* 10. Zen Breathing Orb */}
          <button
            type="button"
            onClick={() => setVisualStyle('breathing-orb')}
            className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-between transition-all cursor-pointer ${
              visualStyle === 'breathing-orb'
                ? 'border-[#365C4B] bg-[#E7EDE7]/40 dark:bg-[#252E28] ring-1 ring-[#365C4B]'
                : bgMode === 'dark'
                ? 'border-[#2A342D] bg-[#212A25] hover:border-slate-600'
                : bgMode === 'auto'
                ? 'border-[#E4E1D9] dark:border-[#2A342D] bg-white dark:bg-[#212A25] hover:border-[#365C4B]/50 dark:hover:border-slate-600'
                : 'border-[#E4E1D9] bg-white hover:border-[#365C4B]/50'
            }`}
          >
            <div className="w-12 h-12 flex items-center justify-center my-1">
              <svg viewBox="0 0 40 40" className="w-10 h-10">
                <circle cx="20" cy="20" r="16" fill={timerColor} opacity="0.18" />
                <circle cx="20" cy="20" r="11" fill={timerColor} opacity="0.35" />
                <circle cx="20" cy="20" r="6" fill={timerColor} />
              </svg>
            </div>
            <span className="text-xs font-semibold text-[#252B27] dark:text-white mt-1">
              Breathing Orb
            </span>
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* SECTION 2.5: CUSTOM INTEREST & LIKED TIMERS STUDIO + POWER-UPS      */}
      {/* =================================================================== */}
      <VisualTimerCustomStudio
        customTimers={customTimers}
        activeCustomId={activeCustomId}
        onSelectCustomTimer={handleSelectCustomTimer}
        onToggleLikeTimer={handleToggleLikeTimer}
        onDeleteCustomTimer={handleDeleteCustomTimer}
        onCreateCustomTimer={handleCreateCustomTimer}
        onSaveCurrentAsCustom={(title, icon) => {
          handleCreateCustomTimer({
            id: `custom-${Date.now()}`,
            title,
            subtitle: 'Saved custom visual timer',
            icon,
            durationSec: totalDurationSec,
            visualStyle,
            color: timerColor,
            liked: true,
            halfwayChime,
            oneMinWarning,
            countdown321,
            autoBreakSec,
            ambientSound,
          });
        }}
        onShareActiveTimer={handleShareActiveTimer}
        shareCopied={shareCopied}
        halfwayChime={halfwayChime}
        setHalfwayChime={setHalfwayChime}
        oneMinWarning={oneMinWarning}
        setOneMinWarning={setOneMinWarning}
        countdown321={countdown321}
        setCountdown321={setCountdown321}
        autoBreakSec={autoBreakSec}
        setAutoBreakSec={setAutoBreakSec}
        ambientSound={ambientSound}
        setAmbientSound={setAmbientSound}
        timerColor={timerColor}
        bgMode={bgMode}
        currentVisualStyle={visualStyle}
        currentDurationSec={totalDurationSec}
      />

      {/* =================================================================== */}
      {/* SECTION 3: APPEARANCE (COLOR SWATCHES & LIGHT/DARK/AUTO MODE)       */}
      {/* =================================================================== */}
      <div className="mt-8 pt-6 border-t border-[#E4E1D9] dark:border-[#2A342D] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        {/* Timer Color Swatches */}
        <div className="flex items-center gap-3">
          <span className="text-xs sm:text-sm font-medium text-[#252B27]/80 dark:text-slate-300">
            Timer Color
          </span>
          <div className="flex items-center gap-2">
            {COLOR_SWATCHES.map((col) => (
              <button
                key={col.id}
                type="button"
                onClick={() => setTimerColor(col.hex)}
                className={`w-6 h-6 rounded-full transition-transform cursor-pointer flex items-center justify-center ${
                  timerColor === col.hex ? 'ring-2 ring-offset-2 ring-[#252B27] dark:ring-white scale-110' : 'hover:scale-105'
                }`}
                style={{ backgroundColor: col.hex }}
                title={col.label}
                aria-label={col.label}
              >
                {timerColor === col.hex && <Check className="w-3 h-3 text-white stroke-[3]" />}
              </button>
            ))}
          </div>
        </div>

        {/* Background Mode: Light / Dark / Auto */}
        <div className="flex items-center gap-3">
          <span className="text-xs sm:text-sm font-medium text-[#252B27]/80 dark:text-slate-300">
            Background Mode
          </span>
          <div
            className={`p-1 rounded-xl flex items-center gap-1 border ${
              bgMode === 'dark'
                ? 'bg-[#212A25] border-[#2A342D]'
                : bgMode === 'auto'
                ? 'bg-[#F7F6F2] dark:bg-[#212A25] border-[#E4E1D9] dark:border-[#2A342D]'
                : 'bg-[#F7F6F2] border-[#E4E1D9]'
            }`}
          >
            <button
              type="button"
              onClick={() => setBgMode('light')}
              className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                bgMode === 'light'
                  ? 'bg-white text-[#252B27] shadow-xs font-semibold'
                  : 'text-[#252B27]/70 dark:text-slate-400'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Light</span>
            </button>
            <button
              type="button"
              onClick={() => setBgMode('dark')}
              className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                bgMode === 'dark'
                  ? 'bg-[#2A342D] text-white shadow-xs font-semibold'
                  : 'text-[#252B27]/70 dark:text-slate-400'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Dark</span>
            </button>
            <button
              type="button"
              onClick={() => setBgMode('auto')}
              className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                bgMode === 'auto'
                  ? 'bg-white dark:bg-[#2A342D] text-[#252B27] dark:text-white shadow-xs font-semibold'
                  : 'text-[#252B27]/70 dark:text-slate-400'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Auto</span>
            </button>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* KEYBOARD SHORTCUTS MODAL                                            */}
      {/* =================================================================== */}
      {showShortcutsModal && (
        <div
          className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setShowShortcutsModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="visual-timer-shortcuts-title"
        >
          <div
            className={`w-full max-w-sm rounded-2xl border p-5 sm:p-6 shadow-2xl transition-all ${surfaceClasses}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 pb-3.5 border-b border-[#E4E1D9] dark:border-[#2A342D]">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0"
                  style={{ backgroundColor: timerColor }}
                >
                  <Keyboard className="w-4 h-4" />
                </div>
                <div>
                  <h3 id="visual-timer-shortcuts-title" className="text-sm sm:text-base font-bold leading-tight">
                    Keyboard Shortcuts
                  </h3>
                  <p className="text-[11px] text-[#252B27]/60 dark:text-slate-400">
                    Quickly control the visual timer
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowShortcutsModal(false)}
                className="p-1.5 rounded-lg text-[#252B27]/60 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close keyboard shortcuts modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-2 text-xs sm:text-sm">
              <p className="text-[11px] text-[#252B27]/65 dark:text-slate-400 pb-1">
                Press the key on your keyboard or click any row below to trigger the action immediately:
              </p>
              {(
                [
                  {
                    id: 'space' as const,
                    action: status === 'running' ? 'Pause timer' : 'Start / Resume timer',
                    keyLabel: 'Spacebar',
                  },
                  {
                    id: 'reset' as const,
                    action: 'Reset timer',
                    keyLabel: 'R',
                  },
                  {
                    id: 'fullscreen' as const,
                    action: isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen',
                    keyLabel: 'F',
                  },
                  {
                    id: 'mute' as const,
                    action: soundEnabled ? 'Mute sound alerts' : 'Unmute sound alerts',
                    keyLabel: 'M',
                  },
                  {
                    id: 'escape' as const,
                    action: 'Exit Fullscreen / Close modal',
                    keyLabel: 'Esc',
                  },
                  {
                    id: 'help' as const,
                    action: 'Show / Hide shortcuts modal',
                    keyLabel: '?',
                  },
                ]
              ).map((item) => (
                <button
                  key={item.keyLabel}
                  type="button"
                  onClick={() => {
                    if (item.id === 'space') {
                      setShowShortcutsModal(false);
                      if (status === 'running') handlePause();
                      else handleStart();
                    } else if (item.id === 'reset') {
                      setShowShortcutsModal(false);
                      handleReset();
                    } else if (item.id === 'fullscreen') {
                      setShowShortcutsModal(false);
                      handleToggleFullscreen();
                    } else if (item.id === 'mute') {
                      setSoundEnabled((prev) => !prev);
                    } else if (item.id === 'escape') {
                      setShowShortcutsModal(false);
                      if (isFullscreen) setIsFullscreen(false);
                    } else {
                      setShowShortcutsModal(false);
                    }
                  }}
                  className={`w-full flex items-center justify-between gap-4 px-3.5 py-2.5 rounded-xl border border-transparent hover:border-[#365C4B]/40 transition-all cursor-pointer text-left ${secondaryBoxBg}`}
                >
                  <span className="font-medium text-[#252B27]/90 dark:text-slate-200">
                    {item.action}
                  </span>
                  <kbd
                    className={`px-2.5 py-1 rounded-lg border font-mono text-xs font-semibold shadow-2xs shrink-0 ${
                      bgMode === 'dark'
                        ? 'bg-[#181F1B] border-[#2A342D] text-white'
                        : bgMode === 'auto'
                        ? 'bg-white dark:bg-[#181F1B] border-[#E4E1D9] dark:border-[#2A342D] text-[#252B27] dark:text-white'
                        : 'bg-white border-[#E4E1D9] text-[#252B27]'
                    }`}
                  >
                    {item.keyLabel}
                  </kbd>
                </button>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowShortcutsModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white transition-opacity hover:opacity-95 cursor-pointer"
                style={{ backgroundColor: timerColor }}
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


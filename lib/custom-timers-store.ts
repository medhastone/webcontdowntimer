'use client';

import type { VisualStyleId } from '@/components/tools/VisualTimerComponent';

export type CustomIconId =
  | 'brain'
  | 'book'
  | 'coffee'
  | 'dumbbell'
  | 'sparkles'
  | 'flame'
  | 'rocket'
  | 'graduation'
  | 'smile'
  | 'music'
  | 'utensils'
  | 'gamepad'
  | 'heart'
  | 'timer';

export type AmbientSoundId = 'off' | 'rain' | 'zen-drone' | 'focus-tick';

export interface CustomTimerItem {
  id: string;
  title: string;
  subtitle: string;
  icon: CustomIconId;
  durationSec: number;
  visualStyle: VisualStyleId;
  color: string;
  liked: boolean;
  halfwayChime: boolean;
  oneMinWarning: boolean;
  countdown321: boolean;
  autoBreakSec: number;
  ambientSound: AmbientSoundId;
}

export const STORAGE_KEY_CUSTOM_TIMERS = 'wct_custom_visual_timers_v1';

export const DEFAULT_CUSTOM_TIMERS: CustomTimerItem[] = [
  {
    id: 'deep-focus-bloom',
    title: 'Deep Focus Bloom',
    subtitle: 'Grow a full botanical flower while you focus, then auto-start a 5m break',
    icon: 'brain',
    durationSec: 25 * 60,
    visualStyle: 'plant-growth',
    color: '#365C4B',
    liked: true,
    halfwayChime: true,
    oneMinWarning: true,
    countdown321: false,
    autoBreakSec: 5 * 60,
    ambientSound: 'off',
  },
  {
    id: 'pour-over-coffee',
    title: 'Artisan Coffee Steep',
    subtitle: 'Liquid wave countdown with halfway stir chime & final pour alert',
    icon: 'coffee',
    durationSec: 210,
    visualStyle: 'liquid-wave',
    color: '#E06A3B',
    liked: true,
    halfwayChime: true,
    oneMinWarning: false,
    countdown321: true,
    autoBreakSec: 0,
    ambientSound: 'off',
  },
  {
    id: 'zen-breathing-orb',
    title: 'Zen Exam Calm-Down',
    subtitle: '4s inhale / 4s exhale guided breathing orb with soothing 432Hz tone',
    icon: 'sparkles',
    durationSec: 5 * 60,
    visualStyle: 'breathing-orb',
    color: '#3BA8E0',
    liked: true,
    halfwayChime: false,
    oneMinWarning: true,
    countdown321: false,
    autoBreakSec: 0,
    ambientSound: 'zen-drone',
  },
  {
    id: 'hiit-energy-battery',
    title: 'HIIT Core Circuit',
    subtitle: 'High-contrast energy battery cells with halfway & 3-2-1 final sprint audio',
    icon: 'flame',
    durationSec: 12 * 60,
    visualStyle: 'battery-charge',
    color: '#D94343',
    liked: false,
    halfwayChime: true,
    oneMinWarning: true,
    countdown321: true,
    autoBreakSec: 2 * 60,
    ambientSound: 'focus-tick',
  },
  {
    id: 'kids-toothbrush-party',
    title: 'Kids Toothbrush Routine',
    subtitle: 'Rainbow visual with a 50% halfway chime to switch from top to bottom teeth',
    icon: 'smile',
    durationSec: 120,
    visualStyle: 'rainbow',
    color: '#D93B8A',
    liked: true,
    halfwayChime: true,
    oneMinWarning: false,
    countdown321: true,
    autoBreakSec: 0,
    ambientSound: 'off',
  },
  {
    id: 'classroom-reading',
    title: 'Classroom Quiet Reading',
    subtitle: 'Traffic light visual that shifts from green to amber at 1 minute left',
    icon: 'graduation',
    durationSec: 15 * 60,
    visualStyle: 'traffic-light',
    color: '#2E6FD9',
    liked: false,
    halfwayChime: true,
    oneMinWarning: true,
    countdown321: false,
    autoBreakSec: 0,
    ambientSound: 'rain',
  },
];

export const PRE_SAVED_IDS = new Set(DEFAULT_CUSTOM_TIMERS.map((t) => t.id));

let cachedRaw: string | null = null;
let cachedList: CustomTimerItem[] = DEFAULT_CUSTOM_TIMERS;
const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((fn) => fn());
}

export function subscribeCustomTimers(callback: () => void): () => void {
  listeners.add(callback);
  if (typeof window !== 'undefined') {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY_CUSTOM_TIMERS) {
        cachedRaw = null;
        notifyListeners();
      }
    };
    window.addEventListener('storage', onStorage);
    return () => {
      listeners.delete(callback);
      window.removeEventListener('storage', onStorage);
    };
  }
  return () => {
    listeners.delete(callback);
  };
}

export function getCustomTimersSnapshot(): CustomTimerItem[] {
  if (typeof window === 'undefined') return DEFAULT_CUSTOM_TIMERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_TIMERS);
    if (raw === null) {
      return DEFAULT_CUSTOM_TIMERS;
    }
    if (raw === cachedRaw) {
      return cachedList;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      cachedRaw = raw;
      cachedList = parsed;
      return cachedList;
    }
  } catch {
    // ignore storage errors
  }
  return DEFAULT_CUSTOM_TIMERS;
}

export function getServerCustomTimersSnapshot(): CustomTimerItem[] {
  return DEFAULT_CUSTOM_TIMERS;
}

export function setCustomTimersList(nextList: CustomTimerItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = JSON.stringify(nextList);
    localStorage.setItem(STORAGE_KEY_CUSTOM_TIMERS, raw);
    cachedRaw = raw;
    cachedList = nextList;
    notifyListeners();
  } catch {
    // ignore storage errors
  }
}

export function addOrUpdateCustomTimer(item: CustomTimerItem): void {
  const current = getCustomTimersSnapshot();
  const exists = current.some((t) => t.id === item.id);
  const next = exists
    ? current.map((t) => (t.id === item.id ? item : t))
    : [item, ...current];
  setCustomTimersList(next);
}

export function toggleLikeSavedTimer(id: string): void {
  const current = getCustomTimersSnapshot();
  const next = current.map((t) => (t.id === id ? { ...t, liked: !t.liked } : t));
  setCustomTimersList(next);
}

export function deleteSavedTimer(id: string): void {
  const current = getCustomTimersSnapshot();
  const next = current.filter((t) => t.id !== id);
  setCustomTimersList(next);
}

export function restoreDefaultSavedTimers(): void {
  const current = getCustomTimersSnapshot();
  const existingIds = new Set(current.map((t) => t.id));
  const missingDefaults = DEFAULT_CUSTOM_TIMERS.filter((d) => !existingIds.has(d.id));
  setCustomTimersList([...current, ...missingDefaults]);
}

export function buildCustomTimerHref(item: CustomTimerItem): string {
  const params = new URLSearchParams();
  params.set('id', item.id);
  params.set('vt_title', item.title);
  params.set('vt_desc', item.subtitle);
  params.set('vt_sec', String(item.durationSec));
  params.set('vt_style', item.visualStyle);
  params.set('vt_icon', item.icon);
  params.set('vt_color', item.color);
  return `/custom-timer?${params.toString()}`;
}

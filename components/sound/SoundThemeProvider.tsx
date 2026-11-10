'use client';

import React, {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useSyncExternalStore,
  useEffect,
} from 'react';
import {
  SoundTheme,
  SoundType,
  SoundThemeConfig,
  SOUND_THEMES,
  STORAGE_KEY_SOUND_THEME,
  STORAGE_KEY_SOUND_MUTED,
  STORAGE_KEY_SOUND_VOLUME,
  setActiveSoundTheme,
  setSoundMuted,
  setGlobalVolume,
  playTimerSound,
  getActiveSoundTheme,
} from '@/lib/sound';

export interface SoundThemeContextValue {
  soundTheme: SoundTheme;
  setSoundTheme: (theme: SoundTheme) => void;
  isMuted: boolean;
  toggleMute: () => void;
  volume: number;
  setVolume: (volume: number) => void;
  playSound: (type?: SoundType, vol?: number) => void;
  previewSound: (theme?: SoundTheme, type?: SoundType) => void;
  soundThemes: SoundThemeConfig[];
  currentThemeConfig: SoundThemeConfig;
}

const SoundThemeContext = createContext<SoundThemeContextValue | null>(null);

// External store listeners for sound settings
const soundListeners = new Set<() => void>();

function notifySoundListeners() {
  soundListeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      console.warn('Sound listener notification error:', e);
    }
  });
}

function subscribeSoundStore(callback: () => void) {
  soundListeners.add(callback);
  // Also listen to storage events across tabs
  const handleStorage = (e: StorageEvent) => {
    if (
      e.key === STORAGE_KEY_SOUND_THEME ||
      e.key === STORAGE_KEY_SOUND_MUTED ||
      e.key === STORAGE_KEY_SOUND_VOLUME
    ) {
      callback();
    }
  };
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', handleStorage);
  }
  return () => {
    soundListeners.delete(callback);
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', handleStorage);
    }
  };
}

function getSoundThemeSnapshot(): SoundTheme {
  if (typeof window === 'undefined') return 'acoustic';
  const saved = localStorage.getItem(STORAGE_KEY_SOUND_THEME);
  if (saved === 'acoustic' || saved === 'digital' || saved === 'soft') {
    return saved;
  }
  return 'acoustic';
}

function getMutedSnapshot(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_KEY_SOUND_MUTED) === 'true';
}

function getVolumeSnapshot(): number {
  if (typeof window === 'undefined') return 0.8;
  const val = localStorage.getItem(STORAGE_KEY_SOUND_VOLUME);
  if (val !== null) {
    const parsed = parseFloat(val);
    if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
      return parsed;
    }
  }
  return 0.8;
}

const getServerThemeSnapshot = () => 'acoustic' as SoundTheme;
const getServerMutedSnapshot = () => false;
const getServerVolumeSnapshot = () => 0.8;

export function SoundThemeProvider({ children }: { children: React.ReactNode }) {
  const soundTheme = useSyncExternalStore(
    subscribeSoundStore,
    getSoundThemeSnapshot,
    getServerThemeSnapshot
  );

  const isMuted = useSyncExternalStore(
    subscribeSoundStore,
    getMutedSnapshot,
    getServerMutedSnapshot
  );

  const volume = useSyncExternalStore(
    subscribeSoundStore,
    getVolumeSnapshot,
    getServerVolumeSnapshot
  );

  // Synchronize internal sound synthesizer state with store
  useEffect(() => {
    setActiveSoundTheme(soundTheme);
    setSoundMuted(isMuted);
    setGlobalVolume(volume);
  }, [soundTheme, isMuted, volume]);

  // Update theme and persist
  const setSoundTheme = useCallback((newTheme: SoundTheme) => {
    if (newTheme === 'acoustic' || newTheme === 'digital' || newTheme === 'soft') {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_SOUND_THEME, newTheme);
      }
      setActiveSoundTheme(newTheme);
      notifySoundListeners();
    }
  }, []);

  // Toggle mute and persist
  const toggleMute = useCallback(() => {
    if (typeof window !== 'undefined') {
      const current = localStorage.getItem(STORAGE_KEY_SOUND_MUTED) === 'true';
      const next = !current;
      localStorage.setItem(STORAGE_KEY_SOUND_MUTED, String(next));
      setSoundMuted(next);
      notifySoundListeners();
    }
  }, []);

  // Update volume and persist
  const setVolume = useCallback((newVol: number) => {
    const clamped = Math.max(0, Math.min(1, newVol));
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_SOUND_VOLUME, String(clamped));
    }
    setGlobalVolume(clamped);
    notifySoundListeners();
  }, []);

  // Play sound using active theme
  const playSound = useCallback(
    (type: SoundType = 'bell', vol = 0.7) => {
      playTimerSound(type, vol, soundTheme);
    },
    [soundTheme]
  );

  // Audition / preview sound
  const previewSound = useCallback(
    (theme?: SoundTheme, type: SoundType = 'bell') => {
      const target = theme || soundTheme;
      playTimerSound(type, 0.8, target);
    },
    [soundTheme]
  );

  const currentThemeConfig = useMemo(() => {
    return SOUND_THEMES.find((t) => t.id === soundTheme) || SOUND_THEMES[0];
  }, [soundTheme]);

  const value = useMemo<SoundThemeContextValue>(() => {
    return {
      soundTheme: soundTheme || getActiveSoundTheme(),
      setSoundTheme,
      isMuted,
      toggleMute,
      volume,
      setVolume,
      playSound,
      previewSound,
      soundThemes: SOUND_THEMES,
      currentThemeConfig,
    };
  }, [
    soundTheme,
    setSoundTheme,
    isMuted,
    toggleMute,
    volume,
    setVolume,
    playSound,
    previewSound,
    currentThemeConfig,
  ]);

  return <SoundThemeContext.Provider value={value}>{children}</SoundThemeContext.Provider>;
}

export function useSoundTheme(): SoundThemeContextValue {
  const context = useContext(SoundThemeContext);
  if (!context) {
    throw new Error('useSoundTheme must be used within a <SoundThemeProvider>');
  }
  return context;
}

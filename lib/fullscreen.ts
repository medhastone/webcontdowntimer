'use client';

import { useCallback, useEffect, useState } from 'react';

/**
 * Toggles fullscreen mode on document.documentElement so that child `.timer-fullscreen-stage`
 * elements can freely apply CSS transforms (90deg horizontal rotation on mobile portrait)
 * without being blocked by the browser's `:not(:root):fullscreen { transform: none !important }` UA rule.
 * Also attempts `screen.orientation.lock('landscape')` on mobile devices where supported.
 */
export async function toggleTimerFullscreenState(
  currentIsFullscreen: boolean,
  setIsFullscreen: (next: boolean | ((prev: boolean) => boolean)) => void
): Promise<void> {
  if (typeof document === 'undefined') return;

  try {
    if (!currentIsFullscreen && !document.fullscreenElement) {
      setIsFullscreen(true);
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
      try {
        const orientation = window.screen?.orientation as unknown as {
          lock?: (mode: string) => Promise<void>;
        };
        if (orientation?.lock && window.innerWidth <= 900) {
          await orientation.lock('landscape');
        }
      } catch {
        // CSS .timer-fullscreen-stage portrait rotation fallback handles mobile horizontal layout
      }
    } else {
      setIsFullscreen(false);
      try {
        const orientation = window.screen?.orientation as unknown as {
          unlock?: () => void;
        };
        orientation?.unlock?.();
      } catch {
        // Ignore unlock errors
      }
      if (document.fullscreenElement && document.exitFullscreen) {
        await document.exitFullscreen();
      }
    }
  } catch {
    // Fallback for iOS Safari / restricted iframes where Fullscreen API is unavailable
    setIsFullscreen((prev) => !prev);
  }
}

/**
 * Reusable hook for timer fullscreen state with Escape key, native fullscreenchange sync,
 * and body scroll lock while in fullscreen.
 */
export function useTimerFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = useCallback(async () => {
    await toggleTimerFullscreenState(isFullscreen, setIsFullscreen);
  }, [isFullscreen]);

  useEffect(() => {
    const onFsChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen && !document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener('fullscreenchange', onFsChange);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('fullscreenchange', onFsChange);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isFullscreen]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (isFullscreen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isFullscreen]);

  return { isFullscreen, setIsFullscreen, toggleFullscreen };
}

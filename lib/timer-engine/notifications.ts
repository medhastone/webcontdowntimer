/**
 * Cross-platform Notification and Sensory Feedback
 * Supports Browser Notifications, Vibration API, and Web Audio synthesis
 */

import { playTimerSound, SoundType } from '../sound';

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission !== 'denied') {
    return await Notification.requestPermission();
  }

  return 'denied';
}

export function sendBrowserNotification(title: string, options?: NotificationOptions): boolean {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  if (Notification.permission === 'granted') {
    try {
      new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options,
      });
      return true;
    } catch (err) {
      console.warn('Could not display notification:', err);
    }
  }
  return false;
}

export function triggerVibration(pattern: number | number[] = [200, 100, 200]): boolean {
  if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
    try {
      return navigator.vibrate(pattern);
    } catch {
      return false;
    }
  }
  return false;
}

export function triggerTimerCompletionFeedback(options?: {
  title?: string;
  body?: string;
  soundType?: SoundType;
  volume?: number;
}): void {
  // Audio chime
  playTimerSound(options?.soundType || 'bell', options?.volume ?? 0.8);

  // Vibration for mobile devices
  triggerVibration([200, 100, 200]);

  // Browser notification if app is in background
  if (typeof document !== 'undefined' && document.hidden) {
    sendBrowserNotification(options?.title || 'Timer Finished', {
      body: options?.body || 'Your countdown timer has completed.',
    });
  }
}

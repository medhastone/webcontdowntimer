// Web Screen Wake Lock API manager
// Prevents screens from sleeping during presentations, speeches, and events.

let wakeLockSentinel: WakeLockSentinel | null = null;

export async function requestWakeLock(): Promise<boolean> {
  if (typeof window === 'undefined' || !('wakeLock' in navigator)) {
    return false;
  }

  try {
    wakeLockSentinel = await navigator.wakeLock.request('screen');
    wakeLockSentinel.addEventListener('release', () => {
      wakeLockSentinel = null;
    });
    return true;
  } catch (err) {
    console.debug('Screen WakeLock unavailable or denied', err);
    return false;
  }
}

export async function releaseWakeLock(): Promise<void> {
  if (wakeLockSentinel) {
    try {
      await wakeLockSentinel.release();
    } catch {
      // ignore
    } finally {
      wakeLockSentinel = null;
    }
  }
}

export function isWakeLockActive(): boolean {
  return wakeLockSentinel !== null && !wakeLockSentinel.released;
}

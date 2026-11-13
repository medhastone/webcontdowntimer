export const SITE_BASE_URL = 'https://WebCountDownTimer.com';

/**
 * Official social profile URLs for WebCountDownTimer.
 * Populate each URL to automatically render footer links and populate Organization.sameAs in JSON-LD.
 */
export const SITE_SOCIAL_PROFILES = {
  x: '',
  youtube: '',
  pinterest: '',
} as const;

export const REAL_SAME_AS_URLS: string[] = Object.values(SITE_SOCIAL_PROFILES)
  .map((url) => url.trim())
  .filter((url) => url.length > 0);

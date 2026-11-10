// Comprehensive IANA Time Zone database and calculations
// Accurately handles half-hour/45-min offsets, DST transitions, and formatting.

export interface CityTimeZone {
  id: string; // e.g., 'new-york'
  name: string; // 'New York'
  country: string; // 'United States'
  countryCode: string; // 'US'
  iana: string; // 'America/New_York'
  region: 'Americas' | 'Europe' | 'Asia' | 'Pacific' | 'Africa' | 'Middle East';
  flag: string;
}

export const POPULAR_CITIES: CityTimeZone[] = [
  { id: 'london', name: 'London', country: 'United Kingdom', countryCode: 'GB', iana: 'Europe/London', region: 'Europe', flag: '🇬🇧' },
  { id: 'new-york', name: 'New York', country: 'United States', countryCode: 'US', iana: 'America/New_York', region: 'Americas', flag: '🇺🇸' },
  { id: 'san-francisco', name: 'San Francisco', country: 'United States', countryCode: 'US', iana: 'America/Los_Angeles', region: 'Americas', flag: '🇺🇸' },
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', countryCode: 'JP', iana: 'Asia/Tokyo', region: 'Asia', flag: '🇯🇵' },
  { id: 'paris', name: 'Paris', country: 'France', countryCode: 'FR', iana: 'Europe/Paris', region: 'Europe', flag: '🇫🇷' },
  { id: 'berlin', name: 'Berlin', country: 'Germany', countryCode: 'DE', iana: 'Europe/Berlin', region: 'Europe', flag: '🇩🇪' },
  { id: 'sydney', name: 'Sydney', country: 'Australia', countryCode: 'AU', iana: 'Australia/Sydney', region: 'Pacific', flag: '🇦🇺' },
  { id: 'dubai', name: 'Dubai', country: 'United Arab Emirates', countryCode: 'AE', iana: 'Asia/Dubai', region: 'Middle East', flag: '🇦🇪' },
  { id: 'singapore', name: 'Singapore', country: 'Singapore', countryCode: 'SG', iana: 'Asia/Singapore', region: 'Asia', flag: '🇸🇬' },
  { id: 'mumbai', name: 'Mumbai', country: 'India', countryCode: 'IN', iana: 'Asia/Kolkata', region: 'Asia', flag: '🇮🇳' }, // UTC+5:30
  { id: 'delhi', name: 'New Delhi', country: 'India', countryCode: 'IN', iana: 'Asia/Kolkata', region: 'Asia', flag: '🇮🇳' },
  { id: 'hong-kong', name: 'Hong Kong', country: 'China', countryCode: 'HK', iana: 'Asia/Hong_Kong', region: 'Asia', flag: '🇭🇰' },
  { id: 'toronto', name: 'Toronto', country: 'Canada', countryCode: 'CA', iana: 'America/Toronto', region: 'Americas', flag: '🇨🇦' },
  { id: 'vancouver', name: 'Vancouver', country: 'Canada', countryCode: 'CA', iana: 'America/Vancouver', region: 'Americas', flag: '🇨🇦' },
  { id: 'sao-paulo', name: 'São Paulo', country: 'Brazil', countryCode: 'BR', iana: 'America/Sao_Paulo', region: 'Americas', flag: '🇧🇷' },
  { id: 'adelaide', name: 'Adelaide', country: 'Australia', countryCode: 'AU', iana: 'Australia/Adelaide', region: 'Pacific', flag: '🇦🇺' }, // UTC+9:30 or +10:30 DST
  { id: 'kathmandu', name: 'Kathmandu', country: 'Nepal', countryCode: 'NP', iana: 'Asia/Kathmandu', region: 'Asia', flag: '🇳🇵' }, // UTC+5:45
  { id: 'auckland', name: 'Auckland', country: 'New Zealand', countryCode: 'NZ', iana: 'Pacific/Auckland', region: 'Pacific', flag: '🇳🇿' },
  { id: 'cairo', name: 'Cairo', country: 'Egypt', countryCode: 'EG', iana: 'Africa/Cairo', region: 'Africa', flag: '🇪🇬' },
  { id: 'johannesburg', name: 'Johannesburg', country: 'South Africa', countryCode: 'ZA', iana: 'Africa/Johannesburg', region: 'Africa', flag: '🇿🇦' },
  { id: 'utc', name: 'Coordinated Universal Time (UTC)', country: 'International', countryCode: 'UN', iana: 'UTC', region: 'Europe', flag: '🌐' },
  { id: 'chicago', name: 'Chicago', country: 'United States', countryCode: 'US', iana: 'America/Chicago', region: 'Americas', flag: '🇺🇸' },
  { id: 'denver', name: 'Denver', country: 'United States', countryCode: 'US', iana: 'America/Denver', region: 'Americas', flag: '🇺🇸' },
  { id: 'honolulu', name: 'Honolulu', country: 'United States', countryCode: 'US', iana: 'Pacific/Honolulu', region: 'Pacific', flag: '🇺🇸' },
  { id: 'seoul', name: 'Seoul', country: 'South Korea', countryCode: 'KR', iana: 'Asia/Seoul', region: 'Asia', flag: '🇰🇷' },
  { id: 'bangkok', name: 'Bangkok', country: 'Thailand', countryCode: 'TH', iana: 'Asia/Bangkok', region: 'Asia', flag: '🇹🇭' },
  { id: 'zurich', name: 'Zurich', country: 'Switzerland', countryCode: 'CH', iana: 'Europe/Zurich', region: 'Europe', flag: '🇨🇭' },
  { id: 'amsterdam', name: 'Amsterdam', country: 'Netherlands', countryCode: 'NL', iana: 'Europe/Amsterdam', region: 'Europe', flag: '🇳🇱' },
  { id: 'madrid', name: 'Madrid', country: 'Spain', countryCode: 'ES', iana: 'Europe/Madrid', region: 'Europe', flag: '🇪🇸' },
  { id: 'rome', name: 'Rome', country: 'Italy', countryCode: 'IT', iana: 'Europe/Rome', region: 'Europe', flag: '🇮🇹' },
  { id: 'buenos-aires', name: 'Buenos Aires', country: 'Argentina', countryCode: 'AR', iana: 'America/Argentina/Buenos_Aires', region: 'Americas', flag: '🇦🇷' },
  { id: 'mexico-city', name: 'Mexico City', country: 'Mexico', countryCode: 'MX', iana: 'America/Mexico_City', region: 'Americas', flag: '🇲🇽' },
];

/**
 * Get formatted parts for a given Date in a target IANA timezone
 */
export function getTimeZoneData(date: Date, iana: string) {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: iana,
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZoneName: 'short',
    });

    const parts = formatter.formatToParts(date);
    const lookup: Record<string, string> = {};
    for (const p of parts) {
      lookup[p.type] = p.value;
    }

    const hour = parseInt(lookup.hour || '0', 10);
    const minute = parseInt(lookup.minute || '0', 10);
    const second = parseInt(lookup.second || '0', 10);

    // Compute exact UTC offset in minutes
    // By creating a localized date string and comparing with UTC milliseconds
    const offsetMinutes = getUtcOffsetMinutes(date, iana);
    const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
    const offsetMinsRemainder = Math.abs(offsetMinutes) % 60;
    const sign = offsetMinutes >= 0 ? '+' : '-';
    const offsetString = `UTC${sign}${String(offsetHours).padStart(2, '0')}:${String(offsetMinsRemainder).padStart(2, '0')}`;

    const isDaylight = hour >= 6 && hour < 18;

    return {
      formattedTime: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`,
      formattedShortTime: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
      hour,
      minute,
      second,
      day: lookup.day,
      month: lookup.month,
      year: lookup.year,
      weekday: lookup.weekday,
      timeZoneCode: lookup.timeZoneName || '',
      offsetMinutes,
      offsetString,
      isDaylight,
    };
  } catch (e) {
    console.warn(`Error formatting timezone ${iana}:`, e);
    return {
      formattedTime: '00:00:00',
      formattedShortTime: '00:00',
      hour: 0,
      minute: 0,
      second: 0,
      day: '1',
      month: 'Jan',
      year: '2026',
      weekday: 'Mon',
      timeZoneCode: iana,
      offsetMinutes: 0,
      offsetString: 'UTC+00:00',
      isDaylight: true,
    };
  }
}

/**
 * Returns exact offset from UTC in minutes for a given date and IANA time zone
 */
export function getUtcOffsetMinutes(date: Date, iana: string): number {
  try {
    const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(date.toLocaleString('en-US', { timeZone: iana }));
    return Math.round((tzDate.getTime() - utcDate.getTime()) / 60000);
  } catch {
    return 0;
  }
}

/**
 * Check if a timezone is currently experiencing Daylight Saving Time (DST)
 */
export function isDaylightSavingTime(date: Date, iana: string): boolean {
  try {
    const janDate = new Date(date.getFullYear(), 0, 15);
    const julDate = new Date(date.getFullYear(), 6, 15);
    const janOffset = getUtcOffsetMinutes(janDate, iana);
    const julOffset = getUtcOffsetMinutes(julDate, iana);

    // If January and July offsets are identical, there's no DST observed
    if (janOffset === julOffset) return false;

    const currentOffset = getUtcOffsetMinutes(date, iana);
    // Northern Hemisphere DST is usually higher offset in July than Jan
    // Southern Hemisphere DST is usually higher offset in Jan than July
    const maxOffset = Math.max(janOffset, julOffset);
    return currentOffset === maxOffset;
  } catch {
    return false;
  }
}

/**
 * Get difference in hours between two time zones
 */
export function getTimeDifferenceBetween(date: Date, ianaA: string, ianaB: string) {
  const offsetA = getUtcOffsetMinutes(date, ianaA);
  const offsetB = getUtcOffsetMinutes(date, ianaB);
  const diffMinutes = offsetB - offsetA;
  const hours = diffMinutes / 60;
  return {
    diffMinutes,
    hours,
    formatted: `${hours >= 0 ? '+' : ''}${hours}h`,
  };
}

/**
 * Accurately convert a specific date/time from one IANA timezone to another
 */
export function convertTimeBetweenZones(
  dateString: string, // 'YYYY-MM-DD'
  timeString: string, // 'HH:mm'
  fromIana: string,
  toIana: string
) {
  try {
    const [year, month, day] = dateString.split('-').map(Number);
    const [hour, minute] = timeString.split(':').map(Number);

    // Approximate UTC timestamp
    const approxUtcMs = Date.UTC(year, month - 1, day, hour, minute);
    const approxDate = new Date(approxUtcMs);

    // Get offset in fromIana
    const offsetFrom = getUtcOffsetMinutes(approxDate, fromIana);
    const exactUtcMs = approxUtcMs - offsetFrom * 60000;
    const targetDate = new Date(exactUtcMs);

    // If there is any DST boundary shift within the hour, do a 1-step refinement
    const testOffset = getUtcOffsetMinutes(targetDate, fromIana);
    const refinedUtcMs = testOffset !== offsetFrom ? approxUtcMs - testOffset * 60000 : exactUtcMs;
    const finalDate = new Date(refinedUtcMs);

    const fromData = getTimeZoneData(finalDate, fromIana);
    const toData = getTimeZoneData(finalDate, toIana);

    // Calculate formatted 12-hour string (e.g. "2:00 PM")
    const h12 = toData.hour % 12 || 12;
    const ampm = toData.hour >= 12 ? 'PM' : 'AM';
    const formatted12h = `${h12}:${String(toData.minute).padStart(2, '0')} ${ampm}`;

    return {
      targetDate: finalDate,
      fromData,
      toData,
      formatted12h,
      h12,
      ampm,
      minuteString: String(toData.minute).padStart(2, '0'),
    };
  } catch (err) {
    console.error('Error in convertTimeBetweenZones:', err);
    const fallbackDate = new Date();
    const toData = getTimeZoneData(fallbackDate, toIana);
    return {
      targetDate: fallbackDate,
      fromData: getTimeZoneData(fallbackDate, fromIana),
      toData,
      formatted12h: '12:00 PM',
      h12: 12,
      ampm: 'PM',
      minuteString: '00',
    };
  }
}


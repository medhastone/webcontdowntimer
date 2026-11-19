export type HolidayCategory =
  | 'major'
  | 'seasonal'
  | 'cultural'
  | 'observance'
  | 'new-year';

export type HolidayDateRule =
  | { type: 'fixed'; month: number; day: number }
  | {
      type: 'nth-weekday';
      month: number;
      weekday: 0 | 1 | 2 | 3 | 4 | 5 | 6;
      nth: 1 | 2 | 3 | 4;
    }
  | {
      type: 'last-weekday';
      month: number;
      weekday: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    }
  | { type: 'easter-offset'; offsetDays: number }
  | { type: 'lunar-lookup'; datesByYear: Record<number, string> };

export interface HolidayDefinition {
  slug: string;
  baseSlug: string;
  holidayName: string;
  isPureYear?: boolean;
  pinnedYear?: number;
  rule: HolidayDateRule;
  ruleTypeLabel: 'Fixed Date' | 'Variable Date';
  ruleSummary: string;
  category: HolidayCategory;
  relatedSlugs: string[];
}

export interface ResolvedHolidayOccurrence {
  slug: string;
  holidayName: string;
  h1: string;
  year: number;
  targetYear: number;
  targetMonth: number; // 1-12
  targetDay: number; // 1-31
  isoDate: string; // YYYY-MM-DD
  isoLocalMidnight: string; // YYYY-MM-DDTHH:mm
  nextDate: string; // e.g., "December 24, 2026"
  dayOfWeek: string; // e.g., "Thursday"
  daysRemaining: number;
  weeksRemainingLabel: string;
  businessDaysRemaining: number;
  isToday: boolean;
  isPastPinned: boolean;
  isPureYear: boolean;
  pinnedYear?: number;
  baseSlug: string;
  ruleTypeLabel: 'Fixed Date' | 'Variable Date';
  ruleSummary: string;
  category: HolidayCategory;
}

export interface HolidayFaqItem {
  question: string;
  answer: string;
}

export interface HolidayPageBundle {
  resolved: ResolvedHolidayOccurrence;
  relatedCountdowns: ResolvedHolidayOccurrence[];
  faqs: HolidayFaqItem[];
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const WEEKDAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

/**
 * Anonymous Gregorian Easter algorithm (Meeus/Jones/Butcher).
 * Returns [year, month(1-12), day(1-31)] for Western Easter Sunday.
 */
function getGregorianEaster(year: number): { year: number; month: number; day: number } {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return { year, month, day };
}

function getDateForRuleInYear(
  rule: HolidayDateRule,
  year: number
): { year: number; month: number; day: number } {
  if (rule.type === 'fixed') {
    return { year, month: rule.month, day: rule.day };
  }

  if (rule.type === 'nth-weekday') {
    const firstOfMonth = new Date(Date.UTC(year, rule.month - 1, 1));
    const firstDow = firstOfMonth.getUTCDay();
    const offset = (rule.weekday - firstDow + 7) % 7;
    const day = 1 + offset + (rule.nth - 1) * 7;
    return { year, month: rule.month, day };
  }

  if (rule.type === 'last-weekday') {
    const lastOfMonth = new Date(Date.UTC(year, rule.month, 0));
    const lastDay = lastOfMonth.getUTCDate();
    const lastDow = lastOfMonth.getUTCDay();
    const offset = (lastDow - rule.weekday + 7) % 7;
    return { year, month: rule.month, day: lastDay - offset };
  }

  if (rule.type === 'easter-offset') {
    const easter = getGregorianEaster(year);
    const dt = new Date(Date.UTC(easter.year, easter.month - 1, easter.day + rule.offsetDays));
    return {
      year: dt.getUTCFullYear(),
      month: dt.getUTCMonth() + 1,
      day: dt.getUTCDate(),
    };
  }

  // lunar-lookup fallback
  const mapped = rule.datesByYear[year];
  if (mapped) {
    const [y, m, d] = mapped.split('-').map(Number);
    return { year: y, month: m, day: d };
  }
  const availableYears = Object.keys(rule.datesByYear).map(Number).sort((a, b) => a - b);
  const fallbackYear = availableYears.find((y) => y >= year) ?? availableYears[availableYears.length - 1];
  const [y, m, d] = rule.datesByYear[fallbackYear].split('-').map(Number);
  return { year: y, month: m, day: d };
}

export function formatHolidayH1(def: HolidayDefinition, year: number): string {
  if (def.isPureYear) {
    return `How Many Days Until ${def.holidayName}?`;
  }
  return `How Many Days Until ${def.holidayName} ${year}?`;
}

export function formatWeeksRemaining(daysRemaining: number): string {
  if (daysRemaining <= 0) return '0 weeks';
  const weeks = Math.floor(daysRemaining / 7);
  const remDays = daysRemaining % 7;
  const weekWord = weeks === 1 ? 'week' : 'weeks';
  const dayWord = remDays === 1 ? 'day' : 'days';
  if (weeks === 0) return `${remDays} ${dayWord}`;
  if (remDays === 0) return `${weeks} ${weekWord}`;
  return `${weeks} ${weekWord} and ${remDays} ${dayWord}`;
}

/**
 * Counts Monday–Friday weekdays from tomorrow up to and including the target calendar date
 * when target is in the future. Returns 0 if target is today or in the past.
 */
export function countBusinessDaysBetween(
  startYear: number,
  startMonth: number,
  startDay: number,
  endYear: number,
  endMonth: number,
  endDay: number
): number {
  const startUtc = Date.UTC(startYear, startMonth - 1, startDay);
  const endUtc = Date.UTC(endYear, endMonth - 1, endDay);
  if (endUtc <= startUtc) return 0;

  const totalDays = Math.round((endUtc - startUtc) / 86400000);
  const fullWeeks = Math.floor(totalDays / 7);
  let businessDays = fullWeeks * 5;
  const remainder = totalDays % 7;

  // Check the remaining partial week starting from startDay + 1
  const startDow = new Date(startUtc).getUTCDay();
  for (let i = 1; i <= remainder; i++) {
    const dow = (startDow + i) % 7;
    if (dow !== 0 && dow !== 6) {
      businessDays += 1;
    }
  }
  return businessDays;
}

export const HOLIDAY_DEFINITIONS: HolidayDefinition[] = [
  {
    slug: 'christmas-eve',
    baseSlug: 'christmas-eve',
    holidayName: 'Christmas Eve',
    rule: { type: 'fixed', month: 12, day: 24 },
    ruleTypeLabel: 'Fixed Date',
    ruleSummary:
      'Christmas Eve follows a fixed calendar date every year on December 24, the evening before Christmas Day. Because its calendar number never moves, only the day of the week rotates forward by one day annually—or two days after a leap year—keeping holiday planning completely predictable.',
    category: 'major',
    relatedSlugs: [
      'christmas',
      'boxing-day',
      'new-years-eve',
      'new-years-day',
      'thanksgiving',
      'valentines-day',
      'halloween',
      'hanukkah',
    ],
  },
  {
    slug: 'christmas',
    baseSlug: 'christmas',
    holidayName: 'Christmas',
    rule: { type: 'fixed', month: 12, day: 25 },
    ruleTypeLabel: 'Fixed Date',
    ruleSummary:
      'Christmas Day is observed on a fixed Gregorian calendar date every year on December 25. While the numerical date never shifts, the weekday changes each year, advancing by one weekday in standard years and two weekdays following February 29 leap years.',
    category: 'major',
    relatedSlugs: [
      'christmas-eve',
      'boxing-day',
      'new-years-eve',
      'new-years-day',
      'thanksgiving',
      'black-friday',
      'hanukkah',
      'valentines-day',
    ],
  },
  {
    slug: 'boxing-day',
    baseSlug: 'boxing-day',
    holidayName: 'Boxing Day',
    rule: { type: 'fixed', month: 12, day: 26 },
    ruleTypeLabel: 'Fixed Date',
    ruleSummary:
      'Boxing Day is fixed on December 26 every year in the United Kingdom, Canada, Australia, New Zealand, and across the Commonwealth. When December 26 falls on a Saturday or Sunday, the calendar date remains fixed while countries often grant a substitute bank holiday.',
    category: 'cultural',
    relatedSlugs: [
      'christmas',
      'christmas-eve',
      'new-years-eve',
      'new-years-day',
      'black-friday',
      'thanksgiving',
      'valentines-day',
      'st-patricks-day',
    ],
  },
  {
    slug: 'new-years-eve',
    baseSlug: 'new-years-eve',
    holidayName: "New Year's Eve",
    rule: { type: 'fixed', month: 12, day: 31 },
    ruleTypeLabel: 'Fixed Date',
    ruleSummary:
      "New Year's Eve always falls on the fixed calendar date of December 31, marking the final day of the Gregorian calendar year. Because December has 31 days every year without exception, midnight on New Year's Eve universally triggers the countdown to January 1.",
    category: 'new-year',
    relatedSlugs: [
      'new-years-day',
      '2027',
      'christmas',
      'christmas-eve',
      'boxing-day',
      'valentines-day',
      'thanksgiving',
      'halloween',
    ],
  },
  {
    slug: 'new-years-day',
    baseSlug: 'new-years-day',
    holidayName: "New Year's Day",
    rule: { type: 'fixed', month: 1, day: 1 },
    ruleTypeLabel: 'Fixed Date',
    ruleSummary:
      "New Year's Day is anchored to the fixed calendar date of January 1 each year under the Gregorian calendar. It is one of the most widely recognized public holidays worldwide, with only the day of the week shifting year over year.",
    category: 'new-year',
    relatedSlugs: [
      'new-years-eve',
      '2027',
      'valentines-day',
      'presidents-day',
      'christmas-eve',
      'christmas',
      'lunar-new-year',
      'st-patricks-day',
    ],
  },
  {
    slug: 'valentines-day',
    baseSlug: 'valentines-day',
    holidayName: "Valentine's Day",
    rule: { type: 'fixed', month: 2, day: 14 },
    ruleTypeLabel: 'Fixed Date',
    ruleSummary:
      "Valentine's Day follows a fixed calendar rule and is celebrated annually on February 14. Because February 14 occurs before February 29 in leap years, the date itself never shifts, while the day of the week advances steadily each calendar cycle.",
    category: 'cultural',
    relatedSlugs: [
      'presidents-day',
      'st-patricks-day',
      'easter',
      'mothers-day',
      'new-years-day',
      'christmas-eve',
      'halloween',
      'memorial-day',
    ],
  },
  {
    slug: 'presidents-day',
    baseSlug: 'presidents-day',
    holidayName: "Presidents' Day",
    rule: { type: 'nth-weekday', month: 2, weekday: 1, nth: 3 },
    ruleTypeLabel: 'Variable Date',
    ruleSummary:
      "Presidents' Day (officially Washington's Birthday at the federal level) follows a variable date rule in the United States. Under the Uniform Monday Holiday Act, it always falls on the third Monday of February, meaning the calendar date shifts between February 15 and February 21.",
    category: 'observance',
    relatedSlugs: [
      'presidents-day-2027',
      'valentines-day',
      'new-years-day',
      'st-patricks-day',
      'memorial-day',
      'labor-day',
      'independence-day',
      'veterans-day',
    ],
  },
  {
    slug: 'presidents-day-2027',
    baseSlug: 'presidents-day',
    holidayName: "Presidents' Day",
    pinnedYear: 2027,
    rule: { type: 'nth-weekday', month: 2, weekday: 1, nth: 3 },
    ruleTypeLabel: 'Variable Date',
    ruleSummary:
      "Presidents' Day follows a variable Monday rule rather than a fixed date, occurring on the third Monday in February each year. In 2027, February 1 falls on a Monday, placing the third Monday and federal holiday on Monday, February 15, 2027.",
    category: 'observance',
    relatedSlugs: [
      'presidents-day',
      'fathers-day-2027',
      '2027',
      'valentines-day',
      'memorial-day',
      'labor-day',
      'independence-day',
      'mothers-day',
    ],
  },
  {
    slug: 'st-patricks-day',
    baseSlug: 'st-patricks-day',
    holidayName: "St. Patrick's Day",
    rule: { type: 'fixed', month: 3, day: 17 },
    ruleTypeLabel: 'Fixed Date',
    ruleSummary:
      "St. Patrick's Day is observed on a fixed annual date of March 17, commemorating the patron saint of Ireland. Regardless of weekend observances or school schedules, March 17 remains unchanged each year while its day of the week shifts by one or two days annually.",
    category: 'cultural',
    relatedSlugs: [
      'valentines-day',
      'easter',
      'mothers-day',
      'memorial-day',
      'independence-day',
      'halloween',
      'christmas',
      'new-years-day',
    ],
  },
  {
    slug: 'easter',
    baseSlug: 'easter',
    holidayName: 'Easter Sunday',
    rule: { type: 'easter-offset', offsetDays: 0 },
    ruleTypeLabel: 'Variable Date',
    ruleSummary:
      'Easter Sunday is a moveable variable holiday calculated by the ecclesiastical lunar cycle. In Western Christianity, Easter falls on the first Sunday after the first full moon occurring on or after the March 21 vernal equinox, placing it anywhere between March 22 and April 25.',
    category: 'major',
    relatedSlugs: [
      'st-patricks-day',
      'mothers-day',
      'memorial-day',
      'fathers-day',
      'valentines-day',
      'christmas',
      'thanksgiving',
      'lunar-new-year',
    ],
  },
  {
    slug: 'mothers-day',
    baseSlug: 'mothers-day',
    holidayName: "Mother's Day",
    rule: { type: 'nth-weekday', month: 5, weekday: 0, nth: 2 },
    ruleTypeLabel: 'Variable Date',
    ruleSummary:
      "Mother's Day in the United States, Canada, Australia, and many other countries follows a variable date rule, landing on the second Sunday of May every year. Because it tracks a Sunday rather than a calendar number, it shifts between May 8 and May 14 annually.",
    category: 'major',
    relatedSlugs: [
      'fathers-day',
      'fathers-day-2027',
      'memorial-day',
      'easter',
      'valentines-day',
      'independence-day',
      'thanksgiving',
      'christmas',
    ],
  },
  {
    slug: 'memorial-day',
    baseSlug: 'memorial-day',
    holidayName: 'Memorial Day',
    rule: { type: 'last-weekday', month: 5, weekday: 1 },
    ruleTypeLabel: 'Variable Date',
    ruleSummary:
      'Memorial Day follows a variable federal rule in the United States, always occurring on the last Monday of May. Because May ends on different weekdays each year, Memorial Day ranges between May 25 and May 31 while guaranteeing a three-day weekend.',
    category: 'observance',
    relatedSlugs: [
      'mothers-day',
      'juneteenth',
      'fathers-day',
      'independence-day',
      'labor-day',
      'veterans-day',
      'presidents-day',
      'thanksgiving',
    ],
  },
  {
    slug: 'juneteenth',
    baseSlug: 'juneteenth',
    holidayName: 'Juneteenth',
    rule: { type: 'fixed', month: 6, day: 19 },
    ruleTypeLabel: 'Fixed Date',
    ruleSummary:
      'Juneteenth National Independence Day is observed on the fixed calendar date of June 19 every year in the United States. While the federal holiday observance day may shift to Friday or Monday when June 19 lands on a weekend, the commemoration itself is always June 19.',
    category: 'observance',
    relatedSlugs: [
      'fathers-day',
      'memorial-day',
      'independence-day',
      'labor-day',
      'veterans-day',
      'presidents-day',
      'thanksgiving',
      'new-years-day',
    ],
  },
  {
    slug: 'fathers-day',
    baseSlug: 'fathers-day',
    holidayName: "Father's Day",
    rule: { type: 'nth-weekday', month: 6, weekday: 0, nth: 3 },
    ruleTypeLabel: 'Variable Date',
    ruleSummary:
      "Father's Day follows a variable Sunday rule in the United States, United Kingdom, Canada, and India, occurring on the third Sunday of June each year. Depending on where June 1 falls, the holiday shifts between June 15 and June 21.",
    category: 'major',
    relatedSlugs: [
      'fathers-day-2027',
      'mothers-day',
      'memorial-day',
      'juneteenth',
      'independence-day',
      'labor-day',
      'thanksgiving',
      'christmas',
    ],
  },
  {
    slug: 'fathers-day-2027',
    baseSlug: 'fathers-day',
    holidayName: "Father's Day",
    pinnedYear: 2027,
    rule: { type: 'nth-weekday', month: 6, weekday: 0, nth: 3 },
    ruleTypeLabel: 'Variable Date',
    ruleSummary:
      "Father's Day follows a variable date rule rather than a fixed number, falling on the third Sunday of June each year. In 2027, June 1 lands on a Tuesday, placing the three Sundays on June 6, June 13, and Sunday, June 20, 2027.",
    category: 'major',
    relatedSlugs: [
      'fathers-day',
      '2027',
      'presidents-day-2027',
      'mothers-day',
      'independence-day',
      'memorial-day',
      'thanksgiving',
      'christmas',
    ],
  },
  {
    slug: 'independence-day',
    baseSlug: 'independence-day',
    holidayName: 'Independence Day (4th of July)',
    rule: { type: 'fixed', month: 7, day: 4 },
    ruleTypeLabel: 'Fixed Date',
    ruleSummary:
      'United States Independence Day is tied to the fixed historic date of July 4, commemorating the adoption of the Declaration of Independence in 1776. The calendar date never changes, while the weekday moves forward one day per standard year or two in leap years.',
    category: 'major',
    relatedSlugs: [
      'memorial-day',
      'juneteenth',
      'fathers-day',
      'labor-day',
      'halloween',
      'veterans-day',
      'thanksgiving',
      'christmas',
    ],
  },
  {
    slug: 'labor-day',
    baseSlug: 'labor-day',
    holidayName: 'Labor Day',
    rule: { type: 'nth-weekday', month: 9, weekday: 1, nth: 1 },
    ruleTypeLabel: 'Variable Date',
    ruleSummary:
      'Labor Day follows a variable Monday rule in both the United States and Canada, occurring annually on the first Monday of September. Because September 1 falls on a different weekday each year, Labor Day shifts between September 1 and September 7.',
    category: 'observance',
    relatedSlugs: [
      'memorial-day',
      'independence-day',
      'halloween',
      'veterans-day',
      'thanksgiving',
      'presidents-day',
      'christmas',
      'new-years-day',
    ],
  },
  {
    slug: 'halloween',
    baseSlug: 'halloween',
    holidayName: 'Halloween',
    rule: { type: 'fixed', month: 10, day: 31 },
    ruleTypeLabel: 'Fixed Date',
    ruleSummary:
      'Halloween is fixed on October 31 every year, falling on the final day of October regardless of whether it lands on a weekday or weekend. Its numerical date never changes, meaning only the day of the week shifts each autumn.',
    category: 'major',
    relatedSlugs: [
      'halloween-2050',
      'thanksgiving',
      'veterans-day',
      'black-friday',
      'christmas-eve',
      'christmas',
      'new-years-eve',
      'labor-day',
    ],
  },
  {
    slug: 'halloween-2050',
    baseSlug: 'halloween',
    holidayName: 'Halloween',
    pinnedYear: 2050,
    rule: { type: 'fixed', month: 10, day: 31 },
    ruleTypeLabel: 'Fixed Date',
    ruleSummary:
      'Halloween is observed on the fixed calendar date of October 31 in every calendar year, past and future. In 2050, October 31 falls on a Monday, allowing long-range event planners and countdown enthusiasts to track the exact multi-decade duration cleanly.',
    category: 'major',
    relatedSlugs: [
      'halloween',
      'thanksgiving',
      'christmas-eve',
      'christmas',
      'new-years-eve',
      '2027',
      'fathers-day-2027',
      'valentines-day',
    ],
  },
  {
    slug: 'veterans-day',
    baseSlug: 'veterans-day',
    holidayName: 'Veterans Day',
    rule: { type: 'fixed', month: 11, day: 11 },
    ruleTypeLabel: 'Fixed Date',
    ruleSummary:
      'Veterans Day is a fixed-date United States federal holiday observed annually on November 11 to honor the eleventh hour of the eleventh day of the eleventh month Armistice. Its calendar date never moves, though federal offices observe nearby weekdays when November 11 hits a weekend.',
    category: 'observance',
    relatedSlugs: [
      'thanksgiving',
      'halloween',
      'memorial-day',
      'independence-day',
      'labor-day',
      'presidents-day',
      'christmas',
      'new-years-day',
    ],
  },
  {
    slug: 'thanksgiving',
    baseSlug: 'thanksgiving',
    holidayName: 'Thanksgiving',
    rule: { type: 'nth-weekday', month: 11, weekday: 4, nth: 4 },
    ruleTypeLabel: 'Variable Date',
    ruleSummary:
      'United States Thanksgiving follows a variable Thursday rule set by federal law in 1941, occurring every year on the fourth Thursday of November. As a result, Thanksgiving can land on any calendar date from November 22 through November 28 each autumn.',
    category: 'major',
    relatedSlugs: [
      'black-friday',
      'cyber-monday',
      'thanksgiving-2025',
      'christmas-eve',
      'christmas',
      'halloween',
      'veterans-day',
      'new-years-eve',
    ],
  },
  {
    slug: 'thanksgiving-2025',
    baseSlug: 'thanksgiving',
    holidayName: 'Thanksgiving',
    pinnedYear: 2025,
    rule: { type: 'nth-weekday', month: 11, weekday: 4, nth: 4 },
    ruleTypeLabel: 'Variable Date',
    ruleSummary:
      'United States Thanksgiving follows a variable date rule, landing on the fourth Thursday of November each year rather than a fixed number. Under that federal statutory schedule, Thanksgiving 2025 fell on Thursday, November 27, 2025 across all U.S. time zones.',
    category: 'major',
    relatedSlugs: [
      'thanksgiving',
      'black-friday',
      'christmas-eve',
      'christmas',
      'new-years-eve',
      '2026',
      'halloween',
      'fathers-day-2027',
    ],
  },
  {
    slug: 'black-friday',
    baseSlug: 'black-friday',
    holidayName: 'Black Friday',
    rule: { type: 'nth-weekday', month: 11, weekday: 5, nth: 4 },
    ruleTypeLabel: 'Variable Date',
    ruleSummary:
      'Black Friday follows a variable calendar rule tied directly to U.S. Thanksgiving, always occurring on the Friday immediately after the fourth Thursday in November (between November 23 and November 29). Note: if November 1 is a Friday, Black Friday falls on November 29.',
    category: 'seasonal',
    relatedSlugs: [
      'thanksgiving',
      'cyber-monday',
      'christmas-eve',
      'christmas',
      'boxing-day',
      'new-years-eve',
      'halloween',
      'hanukkah',
    ],
  },
  {
    slug: 'cyber-monday',
    baseSlug: 'cyber-monday',
    holidayName: 'Cyber Monday',
    rule: { type: 'nth-weekday', month: 11, weekday: 1, nth: 4 },
    ruleTypeLabel: 'Variable Date',
    ruleSummary:
      'Cyber Monday follows a variable date rule anchored to the Monday immediately following U.S. Thanksgiving weekend. Depending on how late Thanksgiving lands in November, Cyber Monday falls between November 26 and December 2 each year as the kickoff to holiday shopping.',
    category: 'seasonal',
    relatedSlugs: [
      'black-friday',
      'thanksgiving',
      'christmas-eve',
      'christmas',
      'boxing-day',
      'new-years-eve',
      'hanukkah',
      'new-years-day',
    ],
  },
  {
    slug: 'hanukkah',
    baseSlug: 'hanukkah',
    holidayName: 'Hanukkah',
    rule: {
      type: 'lunar-lookup',
      datesByYear: {
        2025: '2025-12-14',
        2026: '2026-12-04',
        2027: '2027-12-24',
        2028: '2028-12-12',
        2029: '2029-12-01',
        2030: '2030-12-20',
      },
    },
    ruleTypeLabel: 'Variable Date',
    ruleSummary:
      'Hanukkah follows a variable lunisolar date rule based on the Hebrew calendar, always beginning at sundown on the 25th day of Kislev. Because the Hebrew lunar year differs in length from the Gregorian solar year, its start shifts across late November and December.',
    category: 'cultural',
    relatedSlugs: [
      'christmas-eve',
      'christmas',
      'thanksgiving',
      'new-years-eve',
      'new-years-day',
      'lunar-new-year',
      'easter',
      'boxing-day',
    ],
  },
  {
    slug: 'lunar-new-year',
    baseSlug: 'lunar-new-year',
    holidayName: 'Lunar New Year',
    rule: {
      type: 'lunar-lookup',
      datesByYear: {
        2025: '2025-01-29',
        2026: '2026-02-17',
        2027: '2027-02-06',
        2028: '2028-01-26',
        2029: '2029-02-13',
        2030: '2030-02-03',
      },
    },
    ruleTypeLabel: 'Variable Date',
    ruleSummary:
      'Lunar New Year follows a variable astronomical rule rather than a fixed Gregorian date, beginning on the second new moon after the winter solstice (or third when an intercalary leap month occurs). Consequently, it lands between January 21 and February 20 each year.',
    category: 'cultural',
    relatedSlugs: [
      'new-years-day',
      'valentines-day',
      'presidents-day',
      'st-patricks-day',
      'easter',
      'hanukkah',
      '2027',
      'new-years-eve',
    ],
  },
  {
    slug: '2026',
    baseSlug: 'new-years-day',
    holidayName: '2026',
    isPureYear: true,
    pinnedYear: 2026,
    rule: { type: 'fixed', month: 1, day: 1 },
    ruleTypeLabel: 'Fixed Date',
    ruleSummary:
      'The year 2026 follows the fixed Gregorian calendar rollover at midnight on January 1, 2026. Because 2026 is a standard 365-day non-leap calendar year, January 1, 2026 occurred on a Thursday, running through the final midnight on Thursday, December 31, 2026.',
    category: 'new-year',
    relatedSlugs: [
      '2027',
      'new-years-eve',
      'new-years-day',
      'christmas-eve',
      'christmas',
      'fathers-day-2027',
      'presidents-day-2027',
      'halloween-2050',
    ],
  },
  {
    slug: '2027',
    baseSlug: 'new-years-day',
    holidayName: '2027',
    isPureYear: true,
    pinnedYear: 2027,
    rule: { type: 'fixed', month: 1, day: 1 },
    ruleTypeLabel: 'Fixed Date',
    ruleSummary:
      'The year 2027 begins on the fixed Gregorian calendar milestone of January 1, 2027 at 00:00:00 local browser time. As a regular 365-day non-leap year starting on a Friday, 2027 runs from Friday, January 1 through Friday, December 31, 2027.',
    category: 'new-year',
    relatedSlugs: [
      'new-years-eve',
      'new-years-day',
      '2026',
      'presidents-day-2027',
      'fathers-day-2027',
      'christmas-eve',
      'christmas',
      'valentines-day',
    ],
  },
];

// Black Friday is the Friday immediately following US Thanksgiving (4th Thursday of Nov).
// Note: If Nov 1 is Friday, 4th Friday is Nov 22 while Thanksgiving is Nov 28 (4th Thu).
// Override helper handles Black Friday & Cyber Monday accurately from Thanksgiving!
function getDateForDefinitionInYear(
  def: HolidayDefinition,
  year: number
): { year: number; month: number; day: number } {
  if (def.baseSlug === 'black-friday') {
    const thanksgiving = getDateForRuleInYear(
      { type: 'nth-weekday', month: 11, weekday: 4, nth: 4 },
      year
    );
    const dt = new Date(Date.UTC(thanksgiving.year, thanksgiving.month - 1, thanksgiving.day + 1));
    return {
      year: dt.getUTCFullYear(),
      month: dt.getUTCMonth() + 1,
      day: dt.getUTCDate(),
    };
  }
  if (def.baseSlug === 'cyber-monday') {
    const thanksgiving = getDateForRuleInYear(
      { type: 'nth-weekday', month: 11, weekday: 4, nth: 4 },
      year
    );
    const dt = new Date(Date.UTC(thanksgiving.year, thanksgiving.month - 1, thanksgiving.day + 4));
    return {
      year: dt.getUTCFullYear(),
      month: dt.getUTCMonth() + 1,
      day: dt.getUTCDate(),
    };
  }
  return getDateForRuleInYear(def.rule, year);
}

export function getHolidayDefinition(slug: string): HolidayDefinition | undefined {
  return HOLIDAY_DEFINITIONS.find((h) => h.slug === slug.toLowerCase());
}

export function resolveHolidayOccurrence(
  def: HolidayDefinition,
  referenceDate: Date = new Date()
): ResolvedHolidayOccurrence {
  const refYear = referenceDate.getFullYear();
  const refMonth = referenceDate.getMonth() + 1;
  const refDay = referenceDate.getDate();

  let target: { year: number; month: number; day: number };

  if (def.pinnedYear !== undefined) {
    target = getDateForDefinitionInYear(def, def.pinnedYear);
  } else {
    const thisYearTarget = getDateForDefinitionInYear(def, refYear);
    const todayUtc = Date.UTC(refYear, refMonth - 1, refDay);
    const targetUtc = Date.UTC(thisYearTarget.year, thisYearTarget.month - 1, thisYearTarget.day);

    // Evergreen rollover only after the entire calendar day has passed
    target = targetUtc < todayUtc ? getDateForDefinitionInYear(def, refYear + 1) : thisYearTarget;
  }

  const todayUtc = Date.UTC(refYear, refMonth - 1, refDay);
  const targetUtc = Date.UTC(target.year, target.month - 1, target.day);
  const rawDaysDiff = Math.round((targetUtc - todayUtc) / 86400000);

  const isToday = rawDaysDiff === 0;
  const isPastPinned = def.pinnedYear !== undefined && rawDaysDiff < 0;
  const daysRemaining = Math.max(0, rawDaysDiff);

  const monthName = MONTH_NAMES[target.month - 1];
  const dayOfWeek = WEEKDAY_NAMES[new Date(targetUtc).getUTCDay()];
  const nextDate = `${monthName} ${target.day}, ${target.year}`;

  const mm = String(target.month).padStart(2, '0');
  const dd = String(target.day).padStart(2, '0');
  const isoDate = `${target.year}-${mm}-${dd}`;
  const isoLocalMidnight = `${isoDate}T00:00`;

  const businessDaysRemaining = countBusinessDaysBetween(
    refYear,
    refMonth,
    refDay,
    target.year,
    target.month,
    target.day
  );

  return {
    slug: def.slug,
    holidayName: def.holidayName,
    h1: formatHolidayH1(def, target.year),
    year: target.year,
    targetYear: target.year,
    targetMonth: target.month,
    targetDay: target.day,
    isoDate,
    isoLocalMidnight,
    nextDate,
    dayOfWeek,
    daysRemaining,
    weeksRemainingLabel: formatWeeksRemaining(daysRemaining),
    businessDaysRemaining,
    isToday,
    isPastPinned,
    isPureYear: Boolean(def.isPureYear),
    pinnedYear: def.pinnedYear,
    baseSlug: def.baseSlug,
    ruleTypeLabel: def.ruleTypeLabel,
    ruleSummary: def.ruleSummary,
    category: def.category,
  };
}

export function getHolidayPageBundle(
  slug: string,
  referenceDate: Date = new Date()
): HolidayPageBundle | null {
  const def = getHolidayDefinition(slug);
  if (!def) return null;

  const resolved = resolveHolidayOccurrence(def, referenceDate);

  const relatedCountdowns = def.relatedSlugs
    .map((relSlug) => getHolidayDefinition(relSlug))
    .filter((item): item is HolidayDefinition => item !== undefined && item.slug !== def.slug)
    .slice(0, 8)
    .map((item) => resolveHolidayOccurrence(item, referenceDate));

  const titleSubject = resolved.isPureYear
    ? resolved.holidayName
    : `${resolved.holidayName} ${resolved.year}`;

  const faqs: HolidayFaqItem[] = [
    {
      question: `How many days until ${titleSubject}?`,
      answer: resolved.isPastPinned
        ? `${titleSubject} occurred on ${resolved.dayOfWeek}, ${resolved.nextDate}. Use the evergreen ${resolved.holidayName} countdown page to track the upcoming annual occurrence.`
        : resolved.isToday
          ? `${titleSubject} is today (${resolved.dayOfWeek}, ${resolved.nextDate}), so there are 0 days remaining.`
          : `There are ${resolved.daysRemaining} ${resolved.daysRemaining === 1 ? 'day' : 'days'} until ${resolved.holidayName} on ${resolved.dayOfWeek}, ${resolved.nextDate} (${resolved.weeksRemainingLabel}, or ${resolved.businessDaysRemaining} business days).`,
    },
    {
      question: `What day of the week is ${titleSubject}?`,
      answer: `${titleSubject} falls on ${resolved.dayOfWeek}, ${resolved.nextDate}.`,
    },
    {
      question: `Is ${resolved.holidayName} a fixed or variable date?`,
      answer: `${resolved.holidayName} follows a ${resolved.ruleTypeLabel.toLowerCase()} rule. ${resolved.ruleSummary}`,
    },
  ];

  return {
    resolved,
    relatedCountdowns,
    faqs,
  };
}

export function getAllHolidayOccurrences(
  referenceDate: Date = new Date()
): ResolvedHolidayOccurrence[] {
  return HOLIDAY_DEFINITIONS.map((def) => resolveHolidayOccurrence(def, referenceDate));
}

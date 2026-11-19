export type HolidayVisualIconKey =
  | 'tree-pine'
  | 'gift'
  | 'snowflake'
  | 'sparkles'
  | 'party-popper'
  | 'star'
  | 'heart'
  | 'flame'
  | 'clover'
  | 'egg'
  | 'rabbit'
  | 'flower'
  | 'sun'
  | 'trophy'
  | 'award'
  | 'flag'
  | 'ghost'
  | 'moon'
  | 'leaf'
  | 'utensils'
  | 'shopping-bag'
  | 'zap'
  | 'compass'
  | 'crown'
  | 'bell'
  | 'calendar';

export type HolidayMotionType =
  | 'snow'
  | 'hearts'
  | 'sparks'
  | 'leaves'
  | 'stars'
  | 'clover'
  | 'lanterns'
  | 'ribbons';

export interface HolidayVisualTheme {
  id: string;
  vibeLabel: string;
  celebrationTitle: string;
  motionType: HolidayMotionType;
  primaryIcon: HolidayVisualIconKey;
  motifs: [HolidayVisualIconKey, HolidayVisualIconKey, HolidayVisualIconKey];
  stageGradient: string;
  fullscreenGradient: string;
  accentHex: string;
  secondaryHex: string;
  glowRgba: string;
  flapTopBg: string;
  flapBottomBg: string;
  flapBorder: string;
  digitColor: string;
  digitShadow: string;
  colonColor: string;
  badgeBgClass: string;
  badgeTextClass: string;
  confettiColors: [string, string, string, string];
}

const HOLIDAY_VISUAL_THEMES: Record<string, HolidayVisualTheme> = {
  'christmas-eve': {
    id: 'christmas-eve',
    vibeLabel: 'Candlelit Pine & Winter Snowfall',
    celebrationTitle: 'Christmas Eve Anticipation',
    motionType: 'snow',
    primaryIcon: 'tree-pine',
    motifs: ['snowflake', 'gift', 'sparkles'],
    stageGradient:
      'radial-gradient(circle at 20% 15%, rgba(212, 175, 55, 0.22) 0%, transparent 45%), radial-gradient(circle at 82% 80%, rgba(190, 38, 51, 0.24) 0%, transparent 48%), linear-gradient(135deg, #0D261C 0%, #163729 52%, #0B1913 100%)',
    fullscreenGradient:
      'radial-gradient(circle at 50% 25%, #1A4230 0%, #0C2118 58%, #06110C 100%)',
    accentHex: '#F3C969',
    secondaryHex: '#E05A63',
    glowRgba: 'rgba(243, 201, 105, 0.28)',
    flapTopBg: 'linear-gradient(180deg, #1E3329 0%, #14251D 100%)',
    flapBottomBg: 'linear-gradient(180deg, #101F18 0%, #192E24 100%)',
    flapBorder: '#3B634E',
    digitColor: '#FDF8EC',
    digitShadow: '0 2px 10px rgba(243, 201, 105, 0.28)',
    colonColor: '#F3C969',
    badgeBgClass: 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800',
    badgeTextClass: 'text-emerald-800 dark:text-emerald-300',
    confettiColors: ['#D42426', '#1E7A46', '#F3C969', '#FFFFFF'],
  },
  christmas: {
    id: 'christmas',
    vibeLabel: 'Festive Evergreen, Gifts & Snow',
    celebrationTitle: 'Christmas Celebration Glow',
    motionType: 'snow',
    primaryIcon: 'gift',
    motifs: ['tree-pine', 'snowflake', 'star'],
    stageGradient:
      'radial-gradient(circle at 18% 20%, rgba(220, 38, 38, 0.25) 0%, transparent 45%), radial-gradient(circle at 82% 20%, rgba(250, 204, 21, 0.2) 0%, transparent 45%), linear-gradient(135deg, #192D21 0%, #24191B 55%, #111E17 100%)',
    fullscreenGradient:
      'radial-gradient(circle at 50% 25%, #2B3B2E 0%, #1B181A 60%, #0C1410 100%)',
    accentHex: '#FBBF24',
    secondaryHex: '#EF4444',
    glowRgba: 'rgba(239, 68, 68, 0.24)',
    flapTopBg: 'linear-gradient(180deg, #272223 0%, #191516 100%)',
    flapBottomBg: 'linear-gradient(180deg, #141112 0%, #221D1E 100%)',
    flapBorder: '#63353A',
    digitColor: '#FFFDF7',
    digitShadow: '0 2px 12px rgba(251, 191, 36, 0.3)',
    colonColor: '#FBBF24',
    badgeBgClass: 'bg-rose-100 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800',
    badgeTextClass: 'text-rose-700 dark:text-rose-300',
    confettiColors: ['#DC2626', '#16A34A', '#FBBF24', '#F8FAFC'],
  },
  'boxing-day': {
    id: 'boxing-day',
    vibeLabel: 'Wrapped Ribbons & Holiday Cheer',
    celebrationTitle: 'Boxing Day Festivities',
    motionType: 'ribbons',
    primaryIcon: 'gift',
    motifs: ['sparkles', 'star', 'snowflake'],
    stageGradient:
      'radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.25) 0%, transparent 45%), linear-gradient(135deg, #16242C 0%, #1F2E37 52%, #0F1A20 100%)',
    fullscreenGradient:
      'radial-gradient(circle at 50% 30%, #1F3944 0%, #111D24 65%, #091115 100%)',
    accentHex: '#34D399',
    secondaryHex: '#F59E0B',
    glowRgba: 'rgba(52, 211, 153, 0.24)',
    flapTopBg: 'linear-gradient(180deg, #1D2E38 0%, #132129 100%)',
    flapBottomBg: 'linear-gradient(180deg, #101C23 0%, #1A2A33 100%)',
    flapBorder: '#2D4E5E',
    digitColor: '#F0FDF4',
    digitShadow: '0 2px 10px rgba(52, 211, 153, 0.25)',
    colonColor: '#34D399',
    badgeBgClass: 'bg-teal-100 dark:bg-teal-950/60 border-teal-200 dark:border-teal-800',
    badgeTextClass: 'text-teal-700 dark:text-teal-300',
    confettiColors: ['#10B981', '#F59E0B', '#EF4444', '#FFFFFF'],
  },
  'new-years-eve': {
    id: 'new-years-eve',
    vibeLabel: 'Midnight Champagne & Fireworks',
    celebrationTitle: 'Midnight Celebration Spark',
    motionType: 'sparks',
    primaryIcon: 'party-popper',
    motifs: ['sparkles', 'star', 'crown'],
    stageGradient:
      'radial-gradient(circle at 22% 18%, rgba(251, 191, 36, 0.28) 0%, transparent 45%), radial-gradient(circle at 82% 78%, rgba(139, 92, 246, 0.28) 0%, transparent 48%), linear-gradient(135deg, #111124 0%, #1E1838 55%, #0A0B17 100%)',
    fullscreenGradient:
      'radial-gradient(circle at 50% 30%, #271E47 0%, #121024 62%, #070712 100%)',
    accentHex: '#FCD34D',
    secondaryHex: '#C084FC',
    glowRgba: 'rgba(252, 211, 77, 0.3)',
    flapTopBg: 'linear-gradient(180deg, #211D38 0%, #161328 100%)',
    flapBottomBg: 'linear-gradient(180deg, #110F20 0%, #1B1730 100%)',
    flapBorder: '#534585',
    digitColor: '#FEF3C7',
    digitShadow: '0 0 14px rgba(252, 211, 77, 0.42)',
    colonColor: '#FCD34D',
    badgeBgClass: 'bg-amber-100 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800',
    badgeTextClass: 'text-amber-700 dark:text-amber-300',
    confettiColors: ['#FCD34D', '#A855F7', '#F472B6', '#FFFFFF'],
  },
  'new-years-day': {
    id: 'new-years-day',
    vibeLabel: 'Fresh Year Horizon & Confetti',
    celebrationTitle: 'New Year Celebration',
    motionType: 'sparks',
    primaryIcon: 'sparkles',
    motifs: ['party-popper', 'star', 'sun'],
    stageGradient:
      'radial-gradient(circle at 25% 20%, rgba(250, 204, 21, 0.24) 0%, transparent 45%), linear-gradient(135deg, #131B2E 0%, #1C2B45 52%, #0C1220 100%)',
    fullscreenGradient:
      'radial-gradient(circle at 50% 30%, #213457 0%, #10192B 65%, #070B14 100%)',
    accentHex: '#FDE047',
    secondaryHex: '#38BDF8',
    glowRgba: 'rgba(253, 224, 71, 0.26)',
    flapTopBg: 'linear-gradient(180deg, #1E2C47 0%, #141F35 100%)',
    flapBottomBg: 'linear-gradient(180deg, #101A2C 0%, #192640 100%)',
    flapBorder: '#3B5482',
    digitColor: '#FEFCE8',
    digitShadow: '0 0 12px rgba(253, 224, 71, 0.34)',
    colonColor: '#FDE047',
    badgeBgClass: 'bg-indigo-100 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800',
    badgeTextClass: 'text-indigo-700 dark:text-indigo-300',
    confettiColors: ['#FDE047', '#38BDF8', '#A78BFA', '#FFFFFF'],
  },
  'valentines-day': {
    id: 'valentines-day',
    vibeLabel: 'Velvet Rose & Heartbeat Glow',
    celebrationTitle: "Valentine's Celebration",
    motionType: 'hearts',
    primaryIcon: 'heart',
    motifs: ['sparkles', 'gift', 'flower'],
    stageGradient:
      'radial-gradient(circle at 20% 20%, rgba(244, 63, 94, 0.32) 0%, transparent 46%), radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.25) 0%, transparent 46%), linear-gradient(135deg, #320F1D 0%, #4A152B 52%, #1E0812 100%)',
    fullscreenGradient:
      'radial-gradient(circle at 50% 30%, #571832 0%, #2C0B19 62%, #15050C 100%)',
    accentHex: '#FDA4AF',
    secondaryHex: '#F472B6',
    glowRgba: 'rgba(244, 63, 94, 0.32)',
    flapTopBg: 'linear-gradient(180deg, #47162A 0%, #320E1D 100%)',
    flapBottomBg: 'linear-gradient(180deg, #290B17 0%, #3C1223 100%)',
    flapBorder: '#88294F',
    digitColor: '#FFF1F2',
    digitShadow: '0 2px 12px rgba(251, 113, 133, 0.35)',
    colonColor: '#FDA4AF',
    badgeBgClass: 'bg-rose-100 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800',
    badgeTextClass: 'text-rose-600 dark:text-rose-300',
    confettiColors: ['#F43F5E', '#EC4899', '#FDA4AF', '#FDE68A'],
  },
  'presidents-day': {
    id: 'presidents-day',
    vibeLabel: 'Civic Heritage & Starry Navy',
    celebrationTitle: "Presidents' Day Tribute",
    motionType: 'stars',
    primaryIcon: 'award',
    motifs: ['flag', 'star', 'sparkles'],
    stageGradient:
      'radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.25) 0%, transparent 45%), radial-gradient(circle at 85% 80%, rgba(220, 38, 38, 0.22) 0%, transparent 45%), linear-gradient(135deg, #101F3B 0%, #1A2D52 55%, #0B1426 100%)',
    fullscreenGradient:
      'radial-gradient(circle at 50% 30%, #1F3561 0%, #101B33 65%, #070C18 100%)',
    accentHex: '#93C5FD',
    secondaryHex: '#F87171',
    glowRgba: 'rgba(96, 165, 250, 0.26)',
    flapTopBg: 'linear-gradient(180deg, #1D3054 0%, #13223D 100%)',
    flapBottomBg: 'linear-gradient(180deg, #0F1C33 0%, #182A4A 100%)',
    flapBorder: '#3B588C',
    digitColor: '#F8FAFC',
    digitShadow: '0 2px 10px rgba(147, 197, 253, 0.3)',
    colonColor: '#93C5FD',
    badgeBgClass: 'bg-blue-100 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800',
    badgeTextClass: 'text-blue-700 dark:text-blue-300',
    confettiColors: ['#2563EB', '#DC2626', '#FFFFFF', '#FBBF24'],
  },
  'st-patricks-day': {
    id: 'st-patricks-day',
    vibeLabel: 'Emerald Clover & Golden Luck',
    celebrationTitle: "St. Patrick's Emerald Vibe",
    motionType: 'clover',
    primaryIcon: 'clover',
    motifs: ['sparkles', 'star', 'leaf'],
    stageGradient:
      'radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.3) 0%, transparent 46%), radial-gradient(circle at 82% 78%, rgba(234, 179, 8, 0.22) 0%, transparent 45%), linear-gradient(135deg, #072A1B 0%, #0E422B 52%, #051B11 100%)',
    fullscreenGradient:
      'radial-gradient(circle at 50% 30%, #125236 0%, #07291A 65%, #03130C 100%)',
    accentHex: '#4ADE80',
    secondaryHex: '#FACC15',
    glowRgba: 'rgba(74, 222, 128, 0.28)',
    flapTopBg: 'linear-gradient(180deg, #11432D 0%, #0B2F1F 100%)',
    flapBottomBg: 'linear-gradient(180deg, #082619 0%, #0F3A27 100%)',
    flapBorder: '#267550',
    digitColor: '#ECFDF5',
    digitShadow: '0 2px 10px rgba(74, 222, 128, 0.3)',
    colonColor: '#FACC15',
    badgeBgClass: 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800',
    badgeTextClass: 'text-emerald-700 dark:text-emerald-300',
    confettiColors: ['#10B981', '#22C55E', '#FACC15', '#FFFFFF'],
  },
  easter: {
    id: 'easter',
    vibeLabel: 'Spring Pastels & Blossom Sun',
    celebrationTitle: 'Easter Spring Celebration',
    motionType: 'ribbons',
    primaryIcon: 'egg',
    motifs: ['rabbit', 'flower', 'sun'],
    stageGradient:
      'radial-gradient(circle at 20% 20%, rgba(168, 85, 247, 0.24) 0%, transparent 46%), radial-gradient(circle at 80% 78%, rgba(56, 189, 248, 0.24) 0%, transparent 46%), linear-gradient(135deg, #1E1C38 0%, #2C294D 52%, #151428 100%)',
    fullscreenGradient:
      'radial-gradient(circle at 50% 30%, #373261 0%, #1D1B36 65%, #0F0E1E 100%)',
    accentHex: '#FDE047',
    secondaryHex: '#F9A8D4',
    glowRgba: 'rgba(249, 168, 212, 0.26)',
    flapTopBg: 'linear-gradient(180deg, #322E57 0%, #232040 100%)',
    flapBottomBg: 'linear-gradient(180deg, #1D1A36 0%, #2B274D 100%)',
    flapBorder: '#5B5396',
    digitColor: '#FFFBEB',
    digitShadow: '0 2px 10px rgba(249, 168, 212, 0.32)',
    colonColor: '#F9A8D4',
    badgeBgClass: 'bg-purple-100 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800',
    badgeTextClass: 'text-purple-700 dark:text-purple-300',
    confettiColors: ['#F9A8D4', '#FDE047', '#7DD3FC', '#86EFAC'],
  },
  'mothers-day': {
    id: 'mothers-day',
    vibeLabel: 'Warm Botanicals & Rose Petals',
    celebrationTitle: "Mother's Day Appreciation",
    motionType: 'hearts',
    primaryIcon: 'flower',
    motifs: ['heart', 'sun', 'sparkles'],
    stageGradient:
      'radial-gradient(circle at 22% 20%, rgba(236, 72, 153, 0.24) 0%, transparent 46%), radial-gradient(circle at 80% 75%, rgba(251, 146, 60, 0.2) 0%, transparent 46%), linear-gradient(135deg, #2D1824 0%, #412132 52%, #1D0F17 100%)',
    fullscreenGradient:
      'radial-gradient(circle at 50% 30%, #4F263C 0%, #291420 65%, #150910 100%)',
    accentHex: '#F9A8D4',
    secondaryHex: '#FDBA74',
    glowRgba: 'rgba(249, 168, 212, 0.28)',
    flapTopBg: 'linear-gradient(180deg, #452235 0%, #301725 100%)',
    flapBottomBg: 'linear-gradient(180deg, #28131E 0%, #3B1D2D 100%)',
    flapBorder: '#7D3E60',
    digitColor: '#FFF1F2',
    digitShadow: '0 2px 10px rgba(249, 168, 212, 0.3)',
    colonColor: '#F9A8D4',
    badgeBgClass: 'bg-pink-100 dark:bg-pink-950/60 border-pink-200 dark:border-pink-800',
    badgeTextClass: 'text-pink-700 dark:text-pink-300',
    confettiColors: ['#F472B6', '#FB7185', '#FBBF24', '#FDE68A'],
  },
  'memorial-day': {
    id: 'memorial-day',
    vibeLabel: 'Honored Stars & Summer Twilight',
    celebrationTitle: 'Memorial Day Remembrance',
    motionType: 'stars',
    primaryIcon: 'flag',
    motifs: ['star', 'award', 'sun'],
    stageGradient:
      'radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.24) 0%, transparent 45%), linear-gradient(135deg, #111D33 0%, #1B2C4A 52%, #0B1221 100%)',
    fullscreenGradient:
      'radial-gradient(circle at 50% 30%, #203457 0%, #101A2E 65%, #070B14 100%)',
    accentHex: '#93C5FD',
    secondaryHex: '#FCA5A5',
    glowRgba: 'rgba(147, 197, 253, 0.24)',
    flapTopBg: 'linear-gradient(180deg, #1E2F4F 0%, #142138 100%)',
    flapBottomBg: 'linear-gradient(180deg, #101A2E 0%, #192845 100%)',
    flapBorder: '#385485',
    digitColor: '#F8FAFC',
    digitShadow: '0 2px 10px rgba(147, 197, 253, 0.26)',
    colonColor: '#93C5FD',
    badgeBgClass: 'bg-sky-100 dark:bg-sky-950/60 border-sky-200 dark:border-sky-800',
    badgeTextClass: 'text-sky-700 dark:text-sky-300',
    confettiColors: ['#3B82F6', '#EF4444', '#FFFFFF', '#93C5FD'],
  },
  juneteenth: {
    id: 'juneteenth',
    vibeLabel: 'Freedom Starlight & Gold',
    celebrationTitle: 'Juneteenth Freedom Celebration',
    motionType: 'sparks',
    primaryIcon: 'star',
    motifs: ['sparkles', 'sun', 'award'],
    stageGradient:
      'radial-gradient(circle at 20% 20%, rgba(239, 68, 68, 0.24) 0%, transparent 45%), radial-gradient(circle at 80% 78%, rgba(34, 197, 94, 0.24) 0%, transparent 45%), linear-gradient(135deg, #171D1A 0%, #26231C 52%, #101411 100%)',
    fullscreenGradient:
      'radial-gradient(circle at 50% 30%, #2B2B20 0%, #151814 65%, #0A0C0A 100%)',
    accentHex: '#FACC15',
    secondaryHex: '#4ADE80',
    glowRgba: 'rgba(250, 204, 21, 0.26)',
    flapTopBg: 'linear-gradient(180deg, #272A22 0%, #1A1D17 100%)',
    flapBottomBg: 'linear-gradient(180deg, #141712 0%, #21241C 100%)',
    flapBorder: '#5C5B38',
    digitColor: '#FEF9C3',
    digitShadow: '0 2px 10px rgba(250, 204, 21, 0.3)',
    colonColor: '#FACC15',
    badgeBgClass: 'bg-amber-100 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800',
    badgeTextClass: 'text-amber-800 dark:text-amber-300',
    confettiColors: ['#EF4444', '#22C55E', '#FACC15', '#FFFFFF'],
  },
  'fathers-day': {
    id: 'fathers-day',
    vibeLabel: 'Warm Timber, Brass & Trophy Gold',
    celebrationTitle: "Father's Day Celebration",
    motionType: 'stars',
    primaryIcon: 'trophy',
    motifs: ['compass', 'award', 'sun'],
    stageGradient:
      'radial-gradient(circle at 22% 20%, rgba(217, 119, 6, 0.24) 0%, transparent 45%), linear-gradient(135deg, #16222B 0%, #20313D 52%, #0F171E 100%)',
    fullscreenGradient:
      'radial-gradient(circle at 50% 30%, #253847 0%, #131E26 65%, #090F14 100%)',
    accentHex: '#FBBF24',
    secondaryHex: '#60A5FA',
    glowRgba: 'rgba(251, 191, 36, 0.24)',
    flapTopBg: 'linear-gradient(180deg, #223442 0%, #172530 100%)',
    flapBottomBg: 'linear-gradient(180deg, #121E28 0%, #1D2E3B 100%)',
    flapBorder: '#436278',
    digitColor: '#FFFBEB',
    digitShadow: '0 2px 10px rgba(251, 191, 36, 0.28)',
    colonColor: '#FBBF24',
    badgeBgClass: 'bg-amber-100 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800',
    badgeTextClass: 'text-amber-800 dark:text-amber-300',
    confettiColors: ['#F59E0B', '#3B82F6', '#10B981', '#FFFFFF'],
  },
  'independence-day': {
    id: 'independence-day',
    vibeLabel: 'Fireworks Night & Starbursts',
    celebrationTitle: '4th of July Fireworks Vibe',
    motionType: 'sparks',
    primaryIcon: 'party-popper',
    motifs: ['flag', 'star', 'flame'],
    stageGradient:
      'radial-gradient(circle at 20% 20%, rgba(239, 68, 68, 0.28) 0%, transparent 45%), radial-gradient(circle at 82% 22%, rgba(59, 130, 246, 0.3) 0%, transparent 46%), linear-gradient(135deg, #0D162B 0%, #172342 52%, #080E1C 100%)',
    fullscreenGradient:
      'radial-gradient(circle at 50% 30%, #1E2E54 0%, #0E162B 65%, #060914 100%)',
    accentHex: '#FDE047',
    secondaryHex: '#EF4444',
    glowRgba: 'rgba(96, 165, 250, 0.3)',
    flapTopBg: 'linear-gradient(180deg, #1D2A4D 0%, #131D38 100%)',
    flapBottomBg: 'linear-gradient(180deg, #0F172E 0%, #182545 100%)',
    flapBorder: '#3B528C',
    digitColor: '#FFFFFF',
    digitShadow: '0 0 12px rgba(253, 224, 71, 0.35)',
    colonColor: '#EF4444',
    badgeBgClass: 'bg-blue-100 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800',
    badgeTextClass: 'text-blue-700 dark:text-blue-300',
    confettiColors: ['#EF4444', '#2563EB', '#FFFFFF', '#FDE047'],
  },
  'labor-day': {
    id: 'labor-day',
    vibeLabel: 'Late Summer Sun & Long Weekend',
    celebrationTitle: 'Labor Day Weekend',
    motionType: 'ribbons',
    primaryIcon: 'sun',
    motifs: ['compass', 'star', 'sparkles'],
    stageGradient:
      'radial-gradient(circle at 20% 20%, rgba(245, 158, 11, 0.25) 0%, transparent 45%), linear-gradient(135deg, #1A2632 0%, #263847 52%, #111A24 100%)',
    fullscreenGradient:
      'radial-gradient(circle at 50% 30%, #2B4052 0%, #15212B 65%, #0B1218 100%)',
    accentHex: '#FCD34D',
    secondaryHex: '#38BDF8',
    glowRgba: 'rgba(252, 211, 77, 0.24)',
    flapTopBg: 'linear-gradient(180deg, #273847 0%, #1B2833 100%)',
    flapBottomBg: 'linear-gradient(180deg, #15212B 0%, #213140 100%)',
    flapBorder: '#435F75',
    digitColor: '#FFFBEB',
    digitShadow: '0 2px 10px rgba(252, 211, 77, 0.26)',
    colonColor: '#FCD34D',
    badgeBgClass: 'bg-sky-100 dark:bg-sky-950/60 border-sky-200 dark:border-sky-800',
    badgeTextClass: 'text-sky-700 dark:text-sky-300',
    confettiColors: ['#F59E0B', '#0EA5E9', '#10B981', '#FFFFFF'],
  },
  halloween: {
    id: 'halloween',
    vibeLabel: 'Jack-o’-Lantern Glow & Moonlit Night',
    celebrationTitle: 'Spooky Halloween Night',
    motionType: 'lanterns',
    primaryIcon: 'ghost',
    motifs: ['moon', 'flame', 'sparkles'],
    stageGradient:
      'radial-gradient(circle at 20% 20%, rgba(249, 115, 22, 0.3) 0%, transparent 46%), radial-gradient(circle at 82% 78%, rgba(168, 85, 247, 0.3) 0%, transparent 46%), linear-gradient(135deg, #1B1026 0%, #2B173D 52%, #120919 100%)',
    fullscreenGradient:
      'radial-gradient(circle at 50% 30%, #361C4D 0%, #190D24 65%, #0B0510 100%)',
    accentHex: '#FB923C',
    secondaryHex: '#C084FC',
    glowRgba: 'rgba(249, 115, 22, 0.32)',
    flapTopBg: 'linear-gradient(180deg, #331B47 0%, #221130 100%)',
    flapBottomBg: 'linear-gradient(180deg, #1C0D29 0%, #2B163D 100%)',
    flapBorder: '#6D3C8F',
    digitColor: '#FFEDD5',
    digitShadow: '0 0 14px rgba(251, 146, 60, 0.44)',
    colonColor: '#FB923C',
    badgeBgClass: 'bg-orange-100 dark:bg-orange-950/60 border-orange-200 dark:border-orange-800',
    badgeTextClass: 'text-orange-700 dark:text-orange-300',
    confettiColors: ['#F97316', '#9333EA', '#A3E635', '#FACC15'],
  },
  'veterans-day': {
    id: 'veterans-day',
    vibeLabel: 'Honored Stars & Heritage Gold',
    celebrationTitle: 'Veterans Day Honor',
    motionType: 'stars',
    primaryIcon: 'award',
    motifs: ['flag', 'star', 'sparkles'],
    stageGradient:
      'radial-gradient(circle at 20% 20%, rgba(234, 179, 8, 0.2) 0%, transparent 45%), linear-gradient(135deg, #142136 0%, #1F314F 52%, #0D1624 100%)',
    fullscreenGradient:
      'radial-gradient(circle at 50% 30%, #253A5E 0%, #121D30 65%, #090E18 100%)',
    accentHex: '#FDE047',
    secondaryHex: '#93C5FD',
    glowRgba: 'rgba(253, 224, 71, 0.24)',
    flapTopBg: 'linear-gradient(180deg, #213454 0%, #16233A 100%)',
    flapBottomBg: 'linear-gradient(180deg, #121E33 0%, #1C2D4A 100%)',
    flapBorder: '#435F8F',
    digitColor: '#F8FAFC',
    digitShadow: '0 2px 10px rgba(253, 224, 71, 0.26)',
    colonColor: '#FDE047',
    badgeBgClass: 'bg-indigo-100 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800',
    badgeTextClass: 'text-indigo-700 dark:text-indigo-300',
    confettiColors: ['#EAB308', '#2563EB', '#DC2626', '#FFFFFF'],
  },
  thanksgiving: {
    id: 'thanksgiving',
    vibeLabel: 'Autumn Harvest & Candlelight Glow',
    celebrationTitle: 'Thanksgiving Harvest Warmth',
    motionType: 'leaves',
    primaryIcon: 'utensils',
    motifs: ['leaf', 'flame', 'sun'],
    stageGradient:
      'radial-gradient(circle at 20% 20%, rgba(234, 88, 12, 0.3) 0%, transparent 46%), radial-gradient(circle at 82% 78%, rgba(217, 119, 6, 0.28) 0%, transparent 46%), linear-gradient(135deg, #2E170A 0%, #46230F 52%, #1C0D05 100%)',
    fullscreenGradient:
      'radial-gradient(circle at 50% 30%, #572B12 0%, #2B1508 65%, #140903 100%)',
    accentHex: '#FBBF24',
    secondaryHex: '#FB923C',
    glowRgba: 'rgba(245, 158, 11, 0.32)',
    flapTopBg: 'linear-gradient(180deg, #4A2511 0%, #34190B 100%)',
    flapBottomBg: 'linear-gradient(180deg, #2B1508 0%, #3F1F0E 100%)',
    flapBorder: '#8C4D23',
    digitColor: '#FFFBEB',
    digitShadow: '0 2px 12px rgba(251, 191, 36, 0.35)',
    colonColor: '#FBBF24',
    badgeBgClass: 'bg-amber-100 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800',
    badgeTextClass: 'text-amber-800 dark:text-amber-300',
    confettiColors: ['#EA580C', '#D97706', '#FBBF24', '#854D0E'],
  },
  'black-friday': {
    id: 'black-friday',
    vibeLabel: 'Electric Amber & Midnight Deals',
    celebrationTitle: 'Black Friday Countdown Rush',
    motionType: 'sparks',
    primaryIcon: 'shopping-bag',
    motifs: ['zap', 'sparkles', 'star'],
    stageGradient:
      'radial-gradient(circle at 20% 20%, rgba(245, 158, 11, 0.25) 0%, transparent 45%), radial-gradient(circle at 82% 78%, rgba(59, 130, 246, 0.22) 0%, transparent 45%), linear-gradient(135deg, #111318 0%, #1C2029 52%, #090A0E 100%)',
    fullscreenGradient:
      'radial-gradient(circle at 50% 30%, #232836 0%, #111319 65%, #07080B 100%)',
    accentHex: '#FACC15',
    secondaryHex: '#FB923C',
    glowRgba: 'rgba(250, 204, 21, 0.28)',
    flapTopBg: 'linear-gradient(180deg, #232730 0%, #161920 100%)',
    flapBottomBg: 'linear-gradient(180deg, #12141A 0%, #1E222B 100%)',
    flapBorder: '#524A2E',
    digitColor: '#FEF08A',
    digitShadow: '0 0 12px rgba(250, 204, 21, 0.35)',
    colonColor: '#FACC15',
    badgeBgClass: 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700',
    badgeTextClass: 'text-slate-800 dark:text-amber-300',
    confettiColors: ['#FACC15', '#FB923C', '#38BDF8', '#FFFFFF'],
  },
  'cyber-monday': {
    id: 'cyber-monday',
    vibeLabel: 'Neon Cyan & Digital Pulse',
    celebrationTitle: 'Cyber Monday Drop Countdown',
    motionType: 'sparks',
    primaryIcon: 'zap',
    motifs: ['shopping-bag', 'sparkles', 'star'],
    stageGradient:
      'radial-gradient(circle at 20% 20%, rgba(6, 182, 212, 0.28) 0%, transparent 46%), radial-gradient(circle at 80% 78%, rgba(99, 102, 241, 0.28) 0%, transparent 46%), linear-gradient(135deg, #091826 0%, #0F2740 52%, #050E17 100%)',
    fullscreenGradient:
      'radial-gradient(circle at 50% 30%, #123354 0%, #081829 65%, #030A12 100%)',
    accentHex: '#22D3EE',
    secondaryHex: '#818CF8',
    glowRgba: 'rgba(34, 211, 238, 0.3)',
    flapTopBg: 'linear-gradient(180deg, #112A42 0%, #0B1D2E 100%)',
    flapBottomBg: 'linear-gradient(180deg, #091826 0%, #10263B 100%)',
    flapBorder: '#24587A',
    digitColor: '#ECFEFF',
    digitShadow: '0 0 14px rgba(34, 211, 238, 0.45)',
    colonColor: '#22D3EE',
    badgeBgClass: 'bg-cyan-100 dark:bg-cyan-950/60 border-cyan-200 dark:border-cyan-800',
    badgeTextClass: 'text-cyan-700 dark:text-cyan-300',
    confettiColors: ['#22D3EE', '#818CF8', '#38BDF8', '#FFFFFF'],
  },
  hanukkah: {
    id: 'hanukkah',
    vibeLabel: 'Candlelight Blue & Festival Gold',
    celebrationTitle: 'Festival of Lights Glow',
    motionType: 'lanterns',
    primaryIcon: 'flame',
    motifs: ['star', 'sparkles', 'moon'],
    stageGradient:
      'radial-gradient(circle at 20% 20%, rgba(56, 189, 248, 0.28) 0%, transparent 46%), radial-gradient(circle at 82% 78%, rgba(250, 204, 21, 0.24) 0%, transparent 46%), linear-gradient(135deg, #0E1F3D 0%, #16305E 52%, #091326 100%)',
    fullscreenGradient:
      'radial-gradient(circle at 50% 30%, #1D3E75 0%, #0E1F3D 65%, #060D1C 100%)',
    accentHex: '#FDE047',
    secondaryHex: '#7DD3FC',
    glowRgba: 'rgba(125, 211, 252, 0.3)',
    flapTopBg: 'linear-gradient(180deg, #193566 0%, #112547 100%)',
    flapBottomBg: 'linear-gradient(180deg, #0E1F3D 0%, #17305C 100%)',
    flapBorder: '#3B65A8',
    digitColor: '#F0F9FF',
    digitShadow: '0 0 12px rgba(253, 224, 71, 0.38)',
    colonColor: '#FDE047',
    badgeBgClass: 'bg-sky-100 dark:bg-sky-950/60 border-sky-200 dark:border-sky-800',
    badgeTextClass: 'text-sky-700 dark:text-sky-300',
    confettiColors: ['#38BDF8', '#FDE047', '#FFFFFF', '#93C5FD'],
  },
  'lunar-new-year': {
    id: 'lunar-new-year',
    vibeLabel: 'Crimson Lanterns & Prosperity Gold',
    celebrationTitle: 'Lunar New Year Lantern Glow',
    motionType: 'lanterns',
    primaryIcon: 'flame',
    motifs: ['sparkles', 'star', 'crown'],
    stageGradient:
      'radial-gradient(circle at 20% 20%, rgba(239, 68, 68, 0.34) 0%, transparent 46%), radial-gradient(circle at 82% 78%, rgba(250, 204, 21, 0.28) 0%, transparent 46%), linear-gradient(135deg, #3B0B0E 0%, #571015 52%, #240507 100%)',
    fullscreenGradient:
      'radial-gradient(circle at 50% 30%, #6E151B 0%, #38090C 65%, #1A0406 100%)',
    accentHex: '#FDE047',
    secondaryHex: '#FCA5A5',
    glowRgba: 'rgba(250, 204, 21, 0.32)',
    flapTopBg: 'linear-gradient(180deg, #591116 0%, #3E0B0F 100%)',
    flapBottomBg: 'linear-gradient(180deg, #33080B 0%, #4C0E13 100%)',
    flapBorder: '#9C3B28',
    digitColor: '#FEF9C3',
    digitShadow: '0 0 14px rgba(253, 224, 71, 0.42)',
    colonColor: '#FDE047',
    badgeBgClass: 'bg-red-100 dark:bg-red-950/60 border-red-200 dark:border-red-800',
    badgeTextClass: 'text-red-700 dark:text-red-300',
    confettiColors: ['#DC2626', '#FACC15', '#FB923C', '#FEF08A'],
  },
};

const DEFAULT_THEME: HolidayVisualTheme = {
  id: 'default-holiday',
  vibeLabel: 'Festive Celebration Countdown',
  celebrationTitle: 'Live Holiday Countdown',
  motionType: 'sparks',
  primaryIcon: 'calendar',
  motifs: ['sparkles', 'party-popper', 'star'],
  stageGradient:
    'radial-gradient(circle at 20% 20%, rgba(54, 92, 75, 0.38) 0%, transparent 48%), linear-gradient(135deg, #16241D 0%, #1E3329 52%, #0F1914 100%)',
  fullscreenGradient:
    'radial-gradient(circle at 50% 30%, #243D31 0%, #121E18 65%, #09100C 100%)',
  accentHex: '#8CD4B2',
  secondaryHex: '#F3C969',
  glowRgba: 'rgba(140, 212, 178, 0.25)',
  flapTopBg: 'linear-gradient(180deg, #1E3027 0%, #15221C 100%)',
  flapBottomBg: 'linear-gradient(180deg, #111C17 0%, #1A2B23 100%)',
  flapBorder: '#375948',
  digitColor: '#F7F6F2',
  digitShadow: '0 2px 10px rgba(140, 212, 178, 0.25)',
  colonColor: '#8CD4B2',
  badgeBgClass: 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800',
  badgeTextClass: 'text-[#365C4B] dark:text-emerald-300',
  confettiColors: ['#365C4B', '#F3C969', '#8CD4B2', '#FFFFFF'],
};

export function getHolidayVisualTheme(slug: string, baseSlug?: string): HolidayVisualTheme {
  const s = slug.toLowerCase();
  const b = (baseSlug || '').toLowerCase();
  return (
    HOLIDAY_VISUAL_THEMES[s] ||
    HOLIDAY_VISUAL_THEMES[b] ||
    DEFAULT_THEME
  );
}

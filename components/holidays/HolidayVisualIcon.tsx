import React from 'react';
import {
  TreePine,
  Gift,
  Snowflake,
  Sparkles,
  PartyPopper,
  Star,
  Heart,
  Flame,
  Clover,
  Egg,
  Rabbit,
  Flower2,
  Sun,
  Trophy,
  Award,
  Flag,
  Ghost,
  Moon,
  Leaf,
  Utensils,
  ShoppingBag,
  Zap,
  Compass,
  Crown,
  Bell,
  Calendar,
  type LucideIcon,
} from 'lucide-react';
import type { HolidayVisualIconKey } from '@/lib/holiday-visuals';

const ICON_MAP: Record<HolidayVisualIconKey, LucideIcon> = {
  'tree-pine': TreePine,
  gift: Gift,
  snowflake: Snowflake,
  sparkles: Sparkles,
  'party-popper': PartyPopper,
  star: Star,
  heart: Heart,
  flame: Flame,
  clover: Clover,
  egg: Egg,
  rabbit: Rabbit,
  flower: Flower2,
  sun: Sun,
  trophy: Trophy,
  award: Award,
  flag: Flag,
  ghost: Ghost,
  moon: Moon,
  leaf: Leaf,
  utensils: Utensils,
  'shopping-bag': ShoppingBag,
  zap: Zap,
  compass: Compass,
  crown: Crown,
  bell: Bell,
  calendar: Calendar,
};

interface HolidayIconGlyphProps {
  name: HolidayVisualIconKey;
  className?: string;
}

export function HolidayIconGlyph({ name, className = 'w-4 h-4' }: HolidayIconGlyphProps) {
  const IconComp = ICON_MAP[name] || Calendar;
  return <IconComp className={className} aria-hidden="true" />;
}

import React from 'react';
import {
  BookOpen,
  Coffee,
  Dumbbell,
  Brain,
  Sparkles,
  Gamepad2,
  Utensils,
  Music,
  Heart,
  Flame,
  Rocket,
  GraduationCap,
  Smile,
  Timer,
} from 'lucide-react';
import type { CustomIconId, AmbientSoundId } from '@/lib/custom-timers-store';

export const CUSTOM_ICONS: { id: CustomIconId; label: string }[] = [
  { id: 'brain', label: 'Deep Focus' },
  { id: 'book', label: 'Study / Read' },
  { id: 'coffee', label: 'Coffee / Tea' },
  { id: 'dumbbell', label: 'Workout' },
  { id: 'sparkles', label: 'Meditation' },
  { id: 'flame', label: 'HIIT / Sprint' },
  { id: 'graduation', label: 'Classroom' },
  { id: 'smile', label: 'Kids Routine' },
  { id: 'music', label: 'Music Practice' },
  { id: 'utensils', label: 'Cooking / Bake' },
  { id: 'gamepad', label: 'Screen Time' },
  { id: 'rocket', label: 'Launch / Pitch' },
];

export const AMBIENT_SOUNDS: { id: AmbientSoundId; label: string; desc: string }[] = [
  { id: 'off', label: 'Off', desc: 'Silent countdown' },
  { id: 'rain', label: 'Soft Rain', desc: 'Gentle pink-noise rain' },
  { id: 'zen-drone', label: '432Hz Zen Bowl', desc: 'Calming harmonic aura' },
  { id: 'focus-tick', label: 'Soft Pulse', desc: 'Subtle 60 BPM rhythm' },
];

export function CustomTimerIcon({
  icon,
  className = 'w-4 h-4',
}: {
  icon: CustomIconId;
  className?: string;
}) {
  switch (icon) {
    case 'brain':
      return <Brain className={className} />;
    case 'book':
      return <BookOpen className={className} />;
    case 'coffee':
      return <Coffee className={className} />;
    case 'dumbbell':
      return <Dumbbell className={className} />;
    case 'sparkles':
      return <Sparkles className={className} />;
    case 'flame':
      return <Flame className={className} />;
    case 'rocket':
      return <Rocket className={className} />;
    case 'graduation':
      return <GraduationCap className={className} />;
    case 'smile':
      return <Smile className={className} />;
    case 'music':
      return <Music className={className} />;
    case 'utensils':
      return <Utensils className={className} />;
    case 'gamepad':
      return <Gamepad2 className={className} />;
    case 'heart':
      return <Heart className={className} />;
    default:
      return <Timer className={className} />;
  }
}

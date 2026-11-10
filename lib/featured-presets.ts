/**
 * Featured Timer Preset definitions and utilities for the Home Page Timer Panel.
 * Supports grouping and filtering by categories ('all', 'work', 'break', 'custom').
 */

export type PresetCategory = 'all' | 'work' | 'break' | 'custom';

export interface FeaturedTimerPreset {
  id: string;
  label: string;
  minutes: number;
  category: 'work' | 'break' | 'custom';
  isCustom?: boolean;
}

export const PRESET_CATEGORY_CONFIG: {
  id: PresetCategory;
  label: string;
  description: string;
}[] = [
  { id: 'all', label: 'All', description: 'Show all timer presets' },
  { id: 'work', label: 'Work', description: 'Focus, Pomodoro & standup intervals' },
  { id: 'break', label: 'Break', description: 'Rest, coffee & stretch breaks' },
  { id: 'custom', label: 'Custom', description: 'User-defined custom presets' },
];

export const DEFAULT_FEATURED_PRESETS: FeaturedTimerPreset[] = [
  // Work Presets
  { id: 'work-15', label: 'Standup', minutes: 15, category: 'work' },
  { id: 'work-25', label: 'Pomodoro', minutes: 25, category: 'work' },
  { id: 'work-45', label: 'Focus Block', minutes: 45, category: 'work' },
  { id: 'work-50', label: 'Deep Work', minutes: 50, category: 'work' },

  // Break Presets
  { id: 'break-5', label: 'Quick Break', minutes: 5, category: 'break' },
  { id: 'break-10', label: 'Coffee Break', minutes: 10, category: 'break' },
  { id: 'break-15', label: 'Rest & Walk', minutes: 15, category: 'break' },
  { id: 'break-30', label: 'Lunch Break', minutes: 30, category: 'break' },

  // Custom / Quick Presets
  { id: 'custom-1', label: '1m Sprint', minutes: 1, category: 'custom' },
  { id: 'custom-3', label: '3m Quick', minutes: 3, category: 'custom' },
  { id: 'custom-5', label: '5m Standard', minutes: 5, category: 'custom' },
  { id: 'custom-20', label: '20m Power', minutes: 20, category: 'custom' },
];

export const STORAGE_KEY_CUSTOM_PRESETS = 'timetools_featured_custom_presets_v1';
export const STORAGE_KEY_PRESET_CATEGORY = 'timetools_featured_preset_category_v1';

/**
 * Filter presets by category. If category is 'all', returns all presets.
 */
export function filterPresetsByCategory(
  presets: FeaturedTimerPreset[],
  category: PresetCategory
): FeaturedTimerPreset[] {
  if (category === 'all') {
    return presets;
  }
  return presets.filter((p) => p.category === category);
}

/**
 * Group presets by category dictionary.
 */
export function groupPresetsByCategory(
  presets: FeaturedTimerPreset[]
): Record<'work' | 'break' | 'custom', FeaturedTimerPreset[]> {
  const grouped: Record<'work' | 'break' | 'custom', FeaturedTimerPreset[]> = {
    work: [],
    break: [],
    custom: [],
  };

  for (const preset of presets) {
    if (preset.category in grouped) {
      grouped[preset.category].push(preset);
    } else {
      grouped.custom.push(preset);
    }
  }

  return grouped;
}

/**
 * Load custom presets from client localStorage safely.
 */
export function loadCustomPresetsFromStorage(): FeaturedTimerPreset[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_PRESETS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is FeaturedTimerPreset =>
        typeof item === 'object' &&
        item !== null &&
        typeof item.id === 'string' &&
        typeof item.label === 'string' &&
        typeof item.minutes === 'number' &&
        item.minutes > 0 &&
        ['work', 'break', 'custom'].includes(item.category)
    );
  } catch {
    return [];
  }
}

/**
 * Save custom presets to client localStorage safely.
 */
export function saveCustomPresetsToStorage(presets: FeaturedTimerPreset[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_CUSTOM_PRESETS, JSON.stringify(presets));
  } catch (err) {
    console.error('Failed to save custom presets:', err);
  }
}

/**
 * Load saved category selection from localStorage.
 */
export function loadSavedCategoryFromStorage(): PresetCategory {
  if (typeof window === 'undefined') return 'all';
  try {
    const saved = localStorage.getItem(STORAGE_KEY_PRESET_CATEGORY) as PresetCategory | null;
    if (saved && ['all', 'work', 'break', 'custom'].includes(saved)) {
      return saved;
    }
  } catch {
    // fallback
  }
  return 'all';
}

/**
 * Save preferred category to localStorage.
 */
export function saveCategoryToStorage(category: PresetCategory): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_PRESET_CATEGORY, category);
  } catch (err) {
    console.error('Failed to save category preference:', err);
  }
}

/**
 * Helper to build a new custom preset.
 */
export function createCustomPreset(
  label: string,
  minutes: number,
  category: 'work' | 'break' | 'custom'
): FeaturedTimerPreset {
  const cleanMinutes = Math.max(1, Math.min(999, Math.round(minutes)));
  const cleanLabel = label.trim() || `${cleanMinutes}m Custom`;
  const id = `user-preset-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  return {
    id,
    label: cleanLabel,
    minutes: cleanMinutes,
    category,
    isCustom: true,
  };
}

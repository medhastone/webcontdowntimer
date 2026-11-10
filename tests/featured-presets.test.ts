import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_FEATURED_PRESETS,
  PRESET_CATEGORY_CONFIG,
  filterPresetsByCategory,
  groupPresetsByCategory,
  createCustomPreset,
  STORAGE_KEY_CUSTOM_PRESETS,
  STORAGE_KEY_PRESET_CATEGORY,
} from '../lib/featured-presets';

describe('Featured Timer Preset & Category Selector Logic', () => {
  it('defines valid category configurations for All, Work, Break, and Custom', () => {
    assert.strictEqual(PRESET_CATEGORY_CONFIG.length, 4);
    const categoryIds = PRESET_CATEGORY_CONFIG.map((c) => c.id);
    assert.deepStrictEqual(categoryIds, ['all', 'work', 'break', 'custom']);
  });

  it('provides built-in presets covering work, break, and custom intervals', () => {
    assert.ok(DEFAULT_FEATURED_PRESETS.length >= 8);

    const workPresets = DEFAULT_FEATURED_PRESETS.filter((p) => p.category === 'work');
    const breakPresets = DEFAULT_FEATURED_PRESETS.filter((p) => p.category === 'break');
    const customPresets = DEFAULT_FEATURED_PRESETS.filter((p) => p.category === 'custom');

    assert.ok(workPresets.some((p) => p.minutes === 25)); // Pomodoro
    assert.ok(workPresets.some((p) => p.minutes === 50)); // Deep Work
    assert.ok(breakPresets.some((p) => p.minutes === 5));  // Quick Break
    assert.ok(breakPresets.some((p) => p.minutes === 15)); // Rest / Walk
    assert.ok(customPresets.length > 0);
  });

  it('filters presets correctly by category', () => {
    const all = filterPresetsByCategory(DEFAULT_FEATURED_PRESETS, 'all');
    assert.strictEqual(all.length, DEFAULT_FEATURED_PRESETS.length);

    const workOnly = filterPresetsByCategory(DEFAULT_FEATURED_PRESETS, 'work');
    assert.ok(workOnly.length > 0);
    assert.ok(workOnly.every((p) => p.category === 'work'));

    const breakOnly = filterPresetsByCategory(DEFAULT_FEATURED_PRESETS, 'break');
    assert.ok(breakOnly.length > 0);
    assert.ok(breakOnly.every((p) => p.category === 'break'));

    const customOnly = filterPresetsByCategory(DEFAULT_FEATURED_PRESETS, 'custom');
    assert.ok(customOnly.length > 0);
    assert.ok(customOnly.every((p) => p.category === 'custom'));
  });

  it('groups presets into categorical buckets accurately', () => {
    const grouped = groupPresetsByCategory(DEFAULT_FEATURED_PRESETS);
    assert.ok(Array.isArray(grouped.work));
    assert.ok(Array.isArray(grouped.break));
    assert.ok(Array.isArray(grouped.custom));

    const totalGrouped = grouped.work.length + grouped.break.length + grouped.custom.length;
    assert.strictEqual(totalGrouped, DEFAULT_FEATURED_PRESETS.length);
  });

  it('creates custom presets with proper constraints and defaults', () => {
    const preset = createCustomPreset('Deep Sprint', 35, 'work');
    assert.strictEqual(preset.label, 'Deep Sprint');
    assert.strictEqual(preset.minutes, 35);
    assert.strictEqual(preset.category, 'work');
    assert.strictEqual(preset.isCustom, true);
    assert.ok(preset.id.startsWith('user-preset-'));

    // Test clamped values and fallback label
    const clampedPreset = createCustomPreset('', 0, 'break');
    assert.strictEqual(clampedPreset.minutes, 1);
    assert.strictEqual(clampedPreset.label, '1m Custom');
    assert.strictEqual(clampedPreset.category, 'break');
  });

  it('defines valid storage keys for localStorage persistence', () => {
    assert.strictEqual(typeof STORAGE_KEY_CUSTOM_PRESETS, 'string');
    assert.strictEqual(typeof STORAGE_KEY_PRESET_CATEGORY, 'string');
    assert.ok(STORAGE_KEY_CUSTOM_PRESETS.length > 0);
    assert.ok(STORAGE_KEY_PRESET_CATEGORY.length > 0);
  });
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SOUND_THEMES,
  getActiveSoundTheme,
  setActiveSoundTheme,
  isSoundMuted,
  setSoundMuted,
  getGlobalVolume,
  setGlobalVolume,
  STORAGE_KEY_SOUND_THEME,
  STORAGE_KEY_SOUND_MUTED,
  STORAGE_KEY_SOUND_VOLUME,
  playTimerSound,
  SoundTheme,
} from '../lib/sound';

test('Sound Theme & Audio Synthesizer Logic', async (t) => {
  await t.test('provides all required sound themes: Acoustic, Digital, and Soft', () => {
    assert.equal(SOUND_THEMES.length, 3);
    const themeIds = SOUND_THEMES.map((theme) => theme.id);
    assert.deepEqual(themeIds, ['acoustic', 'digital', 'soft']);

    const acoustic = SOUND_THEMES.find((t) => t.id === 'acoustic');
    assert.equal(acoustic?.label, 'Acoustic');
    assert.ok(acoustic?.description.length > 10);

    const digital = SOUND_THEMES.find((t) => t.id === 'digital');
    assert.equal(digital?.label, 'Digital');
    assert.ok(digital?.description.length > 10);

    const soft = SOUND_THEMES.find((t) => t.id === 'soft');
    assert.equal(soft?.label, 'Soft');
    assert.ok(soft?.description.length > 10);
  });

  await t.test('updates active sound theme and maintains state', () => {
    setActiveSoundTheme('acoustic');
    assert.equal(getActiveSoundTheme(), 'acoustic');

    setActiveSoundTheme('digital');
    assert.equal(getActiveSoundTheme(), 'digital');

    setActiveSoundTheme('soft');
    assert.equal(getActiveSoundTheme(), 'soft');

    // Ignores invalid theme strings
    setActiveSoundTheme('invalid-theme' as unknown as SoundTheme);
    assert.equal(getActiveSoundTheme(), 'soft');
  });

  await t.test('manages mute and volume levels with proper clamping', () => {
    setSoundMuted(true);
    assert.equal(isSoundMuted(), true);
    setSoundMuted(false);
    assert.equal(isSoundMuted(), false);

    setGlobalVolume(0.5);
    assert.equal(getGlobalVolume(), 0.5);

    // Clamps below 0 and above 1
    setGlobalVolume(-0.3);
    assert.equal(getGlobalVolume(), 0);

    setGlobalVolume(1.8);
    assert.equal(getGlobalVolume(), 1);
  });

  await t.test('defines valid storage keys for client localStorage persistence', () => {
    assert.equal(STORAGE_KEY_SOUND_THEME, 'timetools_sound_theme');
    assert.equal(STORAGE_KEY_SOUND_MUTED, 'timetools_sound_muted');
    assert.equal(STORAGE_KEY_SOUND_VOLUME, 'timetools_sound_volume');
  });

  await t.test('executes playTimerSound safely in non-browser/SSR test environments without throwing', () => {
    // In node test environment without AudioContext, it should fail-soft without exceptions
    assert.doesNotThrow(() => {
      playTimerSound('bell', 0.8, 'acoustic');
      playTimerSound('beep', 0.5, 'digital');
      playTimerSound('chime', 0.7, 'soft');
      playTimerSound('warning', 0.6);
      playTimerSound('toastmaster-green', 0.5);
    });
  });
});

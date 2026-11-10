// Browser Web Audio API sound synthesizer - zero external audio asset dependencies
// Hermetic, low-latency, and high-fidelity sound synthesis with theme support:
// - Acoustic: Resonant tubular bells, warm orchestral chimes, and wooden percussion
// - Digital: Crisp crystal frequencies, Casio-style stopwatch pips, and 8-bit alerts
// - Soft: Soothing meditation bowls, felt-mallet notes, and ambient sine harmonics

export type SoundTheme = 'acoustic' | 'digital' | 'soft';

export type SoundType =
  | 'beep'
  | 'bell'
  | 'chime'
  | 'warning'
  | 'count321'
  | 'toastmaster-green'
  | 'toastmaster-amber'
  | 'toastmaster-red'
  | 'marimba';

export interface SoundThemeConfig {
  id: SoundTheme;
  label: string;
  tagline: string;
  description: string;
  iconName: 'bell' | 'cpu' | 'feather';
}

export const SOUND_THEMES: SoundThemeConfig[] = [
  {
    id: 'acoustic',
    label: 'Acoustic',
    tagline: 'Warm & Natural',
    description: 'Resonant bronze tubular bells, rich orchestral chimes, and natural acoustic woodblock tones.',
    iconName: 'bell',
  },
  {
    id: 'digital',
    label: 'Digital',
    tagline: 'Crisp & Modern',
    description: 'Precision crystal pips, classic digital watch chimes, and punchy synthetic alert tones.',
    iconName: 'cpu',
  },
  {
    id: 'soft',
    label: 'Soft',
    tagline: 'Gentle & Ambient',
    description: 'Soothing Tibetan singing bowls, felt-mallet marimba tones, and peaceful non-jarring pulses.',
    iconName: 'feather',
  },
];

export const STORAGE_KEY_SOUND_THEME = 'timetools_sound_theme';
export const STORAGE_KEY_SOUND_MUTED = 'timetools_sound_muted';
export const STORAGE_KEY_SOUND_VOLUME = 'timetools_sound_volume';

let activeTheme: SoundTheme = 'acoustic';
let globalMuted = false;
let globalVolume = 0.8;

export function getActiveSoundTheme(): SoundTheme {
  return activeTheme;
}

export function setActiveSoundTheme(theme: SoundTheme): void {
  if (theme === 'acoustic' || theme === 'digital' || theme === 'soft') {
    activeTheme = theme;
  }
}

export function isSoundMuted(): boolean {
  return globalMuted;
}

export function setSoundMuted(muted: boolean): void {
  globalMuted = muted;
}

export function getGlobalVolume(): number {
  return globalVolume;
}

export function setGlobalVolume(vol: number): void {
  globalVolume = Math.max(0, Math.min(1, vol));
}

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Synthesizes and plays a timer sound based on the chosen sound theme.
 * If themeOverride is omitted, uses the active global theme.
 */
export function playTimerSound(
  type: SoundType = 'bell',
  volume = 0.7,
  themeOverride?: SoundTheme
): void {
  if (globalMuted) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const theme = themeOverride || activeTheme;
    const finalVolume = Math.max(0, Math.min(1, volume * globalVolume));

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(finalVolume, ctx.currentTime);
    masterGain.connect(ctx.destination);

    const now = ctx.currentTime;

    // Dispatch synthesis according to theme and type
    switch (theme) {
      case 'digital':
        playDigitalSound(ctx, masterGain, type, now);
        break;
      case 'soft':
        playSoftSound(ctx, masterGain, type, now);
        break;
      case 'acoustic':
      default:
        playAcousticSound(ctx, masterGain, type, now);
        break;
    }
  } catch (err) {
    console.warn('Audio playback error', err);
  }
}

// -------------------------------------------------------------
// ACOUSTIC THEME SYNTHESIZER
// -------------------------------------------------------------
function playAcousticSound(
  ctx: AudioContext,
  masterGain: GainNode,
  type: SoundType,
  now: number
): void {
  switch (type) {
    case 'bell': {
      // Natural bronze tubular bell with harmonic partials & acoustic decay
      const fundamental = 587.33; // D5
      const partials = [1, 2.76, 5.4, 8.93];
      const gains = [0.65, 0.35, 0.18, 0.08];

      partials.forEach((mult, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(fundamental * mult, now);
        // Slight organic detune on higher partials
        if (i > 0) {
          osc.detune.setValueAtTime((i % 2 === 0 ? 4 : -4), now);
        }
        gain.gain.setValueAtTime(gains[i], now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.0 / (i + 1));
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 2.1);
      });
      break;
    }

    case 'chime':
    case 'toastmaster-green': {
      // Warm vibraphone double chime chord (C6 -> G6)
      [1046.5, 1567.98].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);
        gain.gain.setValueAtTime(0.45, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.65);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.7);
      });
      break;
    }

    case 'toastmaster-amber': {
      // Warning double resonant pulse
      [784, 880].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.16);
        gain.gain.setValueAtTime(0.4, now + idx * 0.16);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.16 + 0.35);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now + idx * 0.16);
        osc.stop(now + idx * 0.16 + 0.38);
      });
      break;
    }

    case 'toastmaster-red':
    case 'warning': {
      // 3 acoustic chime strikes descending slightly
      [587.33, 523.25, 440].forEach((freq, idx) => {
        const offset = idx * 0.18;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + offset);
        gain.gain.setValueAtTime(0.45, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.22);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now + offset);
        osc.stop(now + offset + 0.25);
      });
      break;
    }

    case 'beep': {
      // Acoustic woodblock tap with fast frequency decay
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.05);
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.15);
      break;
    }

    case 'count321': {
      // Percussive wood tick
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1100, now);
      osc.frequency.exponentialRampToValueAtTime(450, now + 0.04);
      gain.gain.setValueAtTime(0.45, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.07);
      break;
    }

    case 'marimba':
    default: {
      // Concert rosewood marimba triad
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.45, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.42);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.46);
      });
      break;
    }
  }
}

// -------------------------------------------------------------
// DIGITAL THEME SYNTHESIZER
// -------------------------------------------------------------
function playDigitalSound(
  ctx: AudioContext,
  masterGain: GainNode,
  type: SoundType,
  now: number
): void {
  switch (type) {
    case 'bell': {
      // Dual high-tech digital crystal alert (1318Hz -> 1760Hz)
      [1318.5, 1760].forEach((freq, idx) => {
        const offset = idx * 0.1;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, now + offset);
        gain.gain.setValueAtTime(0.25, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.18);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now + offset);
        osc.stop(now + offset + 0.2);
      });
      break;
    }

    case 'chime':
    case 'toastmaster-green': {
      // 8-bit digital victory arpeggio: C6 -> E6 -> G6 -> C7
      [1046.5, 1318.51, 1567.98, 2093].forEach((freq, idx) => {
        const offset = idx * 0.06;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + offset);
        gain.gain.setValueAtTime(0.35, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.15);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now + offset);
        osc.stop(now + offset + 0.18);
      });
      break;
    }

    case 'toastmaster-amber': {
      // Classic digital 2-tone alert
      [1200, 1500].forEach((freq, idx) => {
        const offset = idx * 0.12;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, now + offset);
        gain.gain.setValueAtTime(0.2, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.09);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now + offset);
        osc.stop(now + offset + 0.1);
      });
      break;
    }

    case 'toastmaster-red':
    case 'warning': {
      // Urgent digital pulse sequence (3 crisp square wave bursts at 2048Hz)
      [0, 0.12, 0.24].forEach((offset) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(2048, now + offset);
        gain.gain.setValueAtTime(0.25, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.07);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now + offset);
        osc.stop(now + offset + 0.08);
      });
      break;
    }

    case 'beep': {
      // Classic digital watch / Casio button beep (2400 Hz)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(2400, now);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.09);
      break;
    }

    case 'count321': {
      // Crisp 1760 Hz digital pip
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(1760, now);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.05);
      break;
    }

    case 'marimba':
    default: {
      // 8-bit digital synth plucks
      [587.33, 739.99, 880].forEach((freq, idx) => {
        const offset = idx * 0.06;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + offset);
        gain.gain.setValueAtTime(0.3, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.15);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now + offset);
        osc.stop(now + offset + 0.18);
      });
      break;
    }
  }
}

// -------------------------------------------------------------
// SOFT THEME SYNTHESIZER
// -------------------------------------------------------------
function playSoftSound(
  ctx: AudioContext,
  masterGain: GainNode,
  type: SoundType,
  now: number
): void {
  switch (type) {
    case 'bell': {
      // Tibetan singing bowl - smooth curved attack (40ms) and long soothing decay
      const fundamental = 432; // Calming 432Hz solfeggio tone
      const partials = [1, 2.02, 3.01];
      const gains = [0.55, 0.22, 0.1];

      partials.forEach((mult, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(fundamental * mult, now);
        // Soft envelope: ramp up gradually, then long smooth decay
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(gains[i], now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 2.6);
      });
      break;
    }

    case 'chime':
    case 'toastmaster-green': {
      // Soothing kalimba / ambient chord (F4 -> A4 -> C5)
      [349.23, 440, 523.25].forEach((freq, idx) => {
        const offset = idx * 0.14;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + offset);
        gain.gain.setValueAtTime(0.001, now + offset);
        gain.gain.linearRampToValueAtTime(0.35, now + offset + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 1.2);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now + offset);
        osc.stop(now + offset + 1.25);
      });
      break;
    }

    case 'toastmaster-amber': {
      // Gentle warm double breath tone
      [440, 554.37].forEach((freq, idx) => {
        const offset = idx * 0.2;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + offset);
        gain.gain.setValueAtTime(0.001, now + offset);
        gain.gain.linearRampToValueAtTime(0.3, now + offset + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.45);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now + offset);
        osc.stop(now + offset + 0.5);
      });
      break;
    }

    case 'toastmaster-red':
    case 'warning': {
      // Gentle warm 2-tone chime swell (non-jarring)
      [392, 330].forEach((freq, idx) => {
        const offset = idx * 0.22;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + offset);
        gain.gain.setValueAtTime(0.001, now + offset);
        gain.gain.linearRampToValueAtTime(0.35, now + offset + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.5);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now + offset);
        osc.stop(now + offset + 0.55);
      });
      break;
    }

    case 'beep': {
      // Water droplet / soft sine blip with ultra-smooth 25ms curve
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(620, now);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.18);
      break;
    }

    case 'count321': {
      // Soft raindrop tick
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.09);
      break;
    }

    case 'marimba':
    default: {
      // Mellow felt-mallet marimba
      [392, 493.88, 587.33].forEach((freq, idx) => {
        const offset = idx * 0.1;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + offset);
        gain.gain.setValueAtTime(0.001, now + offset);
        gain.gain.linearRampToValueAtTime(0.35, now + offset + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.6);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now + offset);
        osc.stop(now + offset + 0.65);
      });
      break;
    }
  }
}

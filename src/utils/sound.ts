import { getSoundPreference } from './storage';

let audioCtx: AudioContext | null = null;

// Low master volume multiplier: around 30% (0.30 max)
const MASTER_VOLUME = 0.30;

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
 * Selecting an option or navigation item: very subtle soft click (~0.04s).
 * Low volume, non-intrusive.
 */
export function playSelectSound(isChildren = false): void {
  if (!getSoundPreference()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const now = ctx.currentTime;
    osc.type = 'sine';

    // Start with gentle pitch ramp for organic tactile click feel
    const startFreq = isChildren ? 750 : 520;
    const endFreq = isChildren ? 420 : 260;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.04);

    // Peak volume around 30% scale
    const peakGain = 0.07 * MASTER_VOLUME;
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(peakGain, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  } catch {
    // Graceful fallback
  }
}

/**
 * Correct answer: short pleasant two-note "ding" (about 0.3s).
 * Note 1 (E5/G5) followed by Note 2 (B5/E6), gentle bell-like resonance.
 */
export function playCorrectSound(isChildren = false): void {
  if (!getSoundPreference()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Frequencies:
    // General: E5 (659.25Hz) -> B5 (987.77Hz)
    // Children: slightly higher, bright & playful: G5 (783.99Hz) -> E6 (1318.51Hz)
    const note1Freq = isChildren ? 783.99 : 659.25;
    const note2Freq = isChildren ? 1318.51 : 987.77;

    // Note 1: 0.0s to 0.12s
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(note1Freq, now);

    const peak1 = 0.14 * MASTER_VOLUME;
    gain1.gain.setValueAtTime(0.001, now);
    gain1.gain.linearRampToValueAtTime(peak1, now + 0.015);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.14);

    // Note 2: 0.11s to 0.32s
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(note2Freq, now + 0.11);

    const peak2 = 0.16 * MASTER_VOLUME;
    gain2.gain.setValueAtTime(0.001, now + 0.11);
    gain2.gain.linearRampToValueAtTime(peak2, now + 0.125);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.11);
    osc2.stop(now + 0.33);
  } catch {
    // Graceful fallback
  }
}

/**
 * Wrong answer: soft low "buzz" (about 0.25s), gentle and not harsh.
 * Uses soft triangle wave with gentle envelope.
 */
export function playWrongSound(isChildren = false): void {
  if (!getSoundPreference()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Triangle wave creates a warm, rounded tone, avoiding harsh piercing buzz
    osc.type = 'triangle';

    // General: 165Hz to 135Hz
    // Children: friendly soft "boop" 240Hz to 175Hz
    const startFreq = isChildren ? 240 : 165;
    const endFreq = isChildren ? 175 : 135;

    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.24);

    const peakGain = 0.11 * MASTER_VOLUME;
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(peakGain, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.26);
  } catch {
    // Graceful fallback
  }
}

/**
 * Quiz complete: short rising 3-note jingle (1-2s).
 * If score is 7/10 or more (70%+), plays a happier, triumphant version.
 */
export function playQuizCompleteSound(
  score: number,
  totalQuestions: number,
  isChildren = false
): void {
  if (!getSoundPreference()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const isHappy = (score / Math.max(totalQuestions, 1)) >= 0.7;

    if (isHappy) {
      // Happier triumphant version: rising joyful chime
      // General: C5 (523Hz) -> E5 (659Hz) -> G5 (784Hz) -> C6 (1046Hz)
      // Children: F5 (698Hz) -> A5 (880Hz) -> C6 (1046Hz) -> F6 (1396Hz)
      const notes = isChildren
        ? [698.46, 880.00, 1046.50, 1396.91]
        : [523.25, 659.25, 783.99, 1046.50];

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        const noteStart = now + idx * 0.17;
        const noteDuration = idx === notes.length - 1 ? 0.65 : 0.28;

        osc.frequency.setValueAtTime(freq, noteStart);

        const peak = (idx === notes.length - 1 ? 0.16 : 0.12) * MASTER_VOLUME;
        gain.gain.setValueAtTime(0.001, noteStart);
        gain.gain.linearRampToValueAtTime(peak, noteStart + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + noteDuration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + noteDuration + 0.02);
      });
    } else {
      // Standard pleasant rising 3-note jingle (warm & encouraging)
      // General: C4 (261Hz) -> E4 (330Hz) -> G4 (392Hz)
      // Children: G4 (392Hz) -> B4 (493Hz) -> D5 (587Hz)
      const notes = isChildren
        ? [392.00, 493.88, 587.33]
        : [261.63, 329.63, 392.00];

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        const noteStart = now + idx * 0.22;
        const noteDuration = idx === notes.length - 1 ? 0.55 : 0.32;

        osc.frequency.setValueAtTime(freq, noteStart);

        const peak = 0.11 * MASTER_VOLUME;
        gain.gain.setValueAtTime(0.001, noteStart);
        gain.gain.linearRampToValueAtTime(peak, noteStart + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + noteDuration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + noteDuration + 0.02);
      });
    }
  } catch {
    // Graceful fallback
  }
}

/**
 * Last 10 seconds of the timer: soft tick each second.
 */
export function playTickSound(isChildren = false): void {
  if (!getSoundPreference()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const tickFreq = isChildren ? 1150 : 900;
    osc.frequency.setValueAtTime(tickFreq, now);

    const peakGain = 0.05 * MASTER_VOLUME;
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(peakGain, now + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.035);
  } catch {
    // Silent
  }
}

/**
 * Backward compatibility alias for playQuizCompleteSound
 */
export function playSuccessSound(isChildren = false): void {
  playQuizCompleteSound(10, 10, isChildren);
}

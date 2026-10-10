/**
 * Web Audio API Synthesized Sound Feedback
 * Lightweight, zero-dependency, instant acoustic feedback for fintech actions.
 */

let audioCtx = null;

const getAudioContext = () => {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

// Check if sound effects are enabled (default true)
export const isSoundEnabled = () => {
  if (typeof window === 'undefined') return false;
  const stored = localStorage.getItem('ledgerly_sound_enabled');
  return stored === null ? true : stored === 'true';
};

export const setSoundEnabled = (enabled) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('ledgerly_sound_enabled', enabled ? 'true' : 'false');
};

/**
 * 1. Add Expense Success: Ascending warm triad chord chime (Stripe/Fintech feel)
 */
export const playAddSuccessSound = () => {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  // Notes: C5 (523.25Hz), E5 (659.25Hz), G5 (783.99Hz), C6 (1046.50Hz)
  const notes = [523.25, 659.25, 783.99, 1046.50];

  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + idx * 0.055);

    // Envelope
    gain.gain.setValueAtTime(0, now + idx * 0.055);
    gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.055 + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.055 + 0.38);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + idx * 0.055);
    osc.stop(now + idx * 0.055 + 0.4);
  });
};

/**
 * 2. Update Expense Success: Snappy modern crisp double blip
 */
export const playUpdateSuccessSound = () => {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [740, 1108.7]; // F#5 to C#6

  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now + idx * 0.065);

    gain.gain.setValueAtTime(0, now + idx * 0.065);
    gain.gain.linearRampToValueAtTime(0.1, now + idx * 0.065 + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.065 + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + idx * 0.065);
    osc.stop(now + idx * 0.065 + 0.24);
  });
};

/**
 * 3. Delete Expense Feedback: Gentle downward pitch sweep / soft whoosh thud
 */
export const playDeleteSound = () => {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(600, now);
  filter.frequency.exponentialRampToValueAtTime(120, now + 0.25);

  osc.type = 'sine';
  osc.frequency.setValueAtTime(260, now);
  osc.frequency.exponentialRampToValueAtTime(75, now + 0.25);

  gain.gain.setValueAtTime(0.16, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.26);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.28);
};

/**
 * 4. Micro Click / Tab Pop: Ultra subtle tactile feedback
 */
export const playClickPopSound = () => {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(950, now);
  osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

  gain.gain.setValueAtTime(0.04, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.05);
};

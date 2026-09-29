import type { TypingRhythm } from './types';

export const QWERTY_NEIGHBORS: Record<string, string> = {
  a: 'qwsz',
  b: 'vghn',
  c: 'xdfv',
  d: 'serfcx',
  e: 'wsdr',
  f: 'drtgvc',
  g: 'ftyhbv',
  h: 'gyujnb',
  i: 'ujko',
  j: 'huikmn',
  k: 'jiolm',
  l: 'kop',
  m: 'njk',
  n: 'bhjm',
  o: 'iklp',
  p: 'ol',
  q: 'wa',
  r: 'edft',
  s: 'awedxz',
  t: 'rfgy',
  u: 'yhji',
  v: 'cfgb',
  w: 'qase',
  x: 'zsdc',
  y: 'tghu',
  z: 'asx',
};

export const AWKWARD_LETTERS = 'jqzxkvw';

export const CHARACTER_TYPING: Record<string, { tempo: number; rhythm: TypingRhythm }> = {
  rosa: { tempo: 1.2, rhythm: 'erratic' },
  kinzo: { tempo: 1.12, rhythm: 'patient' },
  beatrice: { tempo: 0.96, rhythm: 'human' },
  clair: { tempo: 1.28, rhythm: 'patient' },
  goldenBeatrice: { tempo: 1.04, rhythm: 'human' },
  evaBeatrice: { tempo: 0.86, rhythm: 'erratic' },
  chiester: { tempo: 0.7, rhythm: 'staccato' },
  lambdadelta: { tempo: 0.62, rhythm: 'mechanical' },
  erika: { tempo: 0.8, rhythm: 'staccato' },
  kasumi: { tempo: 0.82, rhythm: 'human' },
  tohya: { tempo: 1.35, rhythm: 'patient' },
  bernkastel: { tempo: 0.9, rhythm: 'erratic' },
  featherine: { tempo: 0.72, rhythm: 'instant' },
  featherineAuthor: { tempo: 0.58, rhythm: 'instant' },
  finale: { tempo: 0.54, rhythm: 'instant' },
};

export function slipKey(ch: string, random: () => number): string {
  const lower = ch.toLowerCase();
  const opts = QWERTY_NEIGHBORS[lower];
  if (!opts) return ch;
  const pick = opts[Math.floor(random() * opts.length)] ?? ch;
  return ch === lower ? pick : pick.toUpperCase();
}

export function typingStyleForName(name: string): { tempo: number; rhythm: TypingRhythm } {
  const speedHash = [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return {
    tempo: 0.86 + (speedHash % 48) / 100,
    rhythm: speedHash % 5 === 0 ? 'staccato' : speedHash % 4 === 0 ? 'patient' : 'human',
  };
}

export function keyDelay(rhythm: TypingRhythm, tempo: number, random: () => number): number {
  if (rhythm === 'instant') return 0.018 + random() * 0.018;
  if (rhythm === 'mechanical') return 0.064 * tempo;
  let delay =
    rhythm === 'staccato'
      ? (0.034 + random() * 0.035) * tempo
      : rhythm === 'patient'
        ? (0.08 + random() * 0.075) * tempo
        : (0.055 + random() * 0.08) * tempo;
  const roll = random();
  if (rhythm === 'erratic' && roll < 0.16) delay += 0.22 + random() * 0.52;
  else if (rhythm === 'staccato' && roll < 0.12) delay += 0.1 + random() * 0.12;
  else if (roll < 0.05) delay += 0.25 + random() * 0.5;
  else if (roll < 0.16) delay += 0.12 + random() * 0.25;
  return delay;
}

export function typoBudget(wordLength: number, rhythm: TypingRhythm, random: () => number): number {
  if (wordLength < 4 || rhythm === 'instant' || rhythm === 'mechanical') return 0;
  const roll = random();
  const fumbleBoost = rhythm === 'erratic' ? 0.18 : rhythm === 'patient' ? -0.18 : 0;
  if (wordLength >= 10) return roll < 0.22 + fumbleBoost ? 2 : roll < 0.72 + fumbleBoost ? 1 : 0;
  if (wordLength >= 6) return roll < 0.12 + fumbleBoost ? 2 : roll < 0.55 + fumbleBoost ? 1 : 0;
  return roll < 0.42 + fumbleBoost ? 1 : 0;
}

export function leadInDelay(rhythm: TypingRhythm, random: () => number): number {
  if (rhythm === 'instant') return 0.04;
  if (rhythm === 'mechanical') return 0.12;
  if (rhythm === 'patient') return 0.35 + random() * 0.32;
  return 0.15 + random() * 0.35;
}

export function endPauseFor(human: boolean, rhythm: TypingRhythm | null, random: () => number): number {
  if (!human) return 0.7;
  if (rhythm === 'instant') return 0.16;
  if (rhythm === 'staccato') return 0.3;
  if (rhythm === 'mechanical') return 0.38;
  if (rhythm === 'patient') return 0.85;
  if (rhythm === 'erratic') return 0.52;
  return 0.5 + random() * 0.55;
}

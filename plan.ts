import type { AutotypeOptions, AutotypePlan, AutotypeStep, TypingRhythm } from './types';
import { AWKWARD_LETTERS, endPauseFor, keyDelay, leadInDelay, slipKey, typoBudget } from './variance';

const STEADY_INTERVAL = 0.09;

export function buildAutotypePlan(word: string, options: AutotypeOptions = {}): AutotypePlan {
  const human = options.human !== false;
  const random = options.random ?? Math.random;
  const rhythm: TypingRhythm | null = human ? (options.rhythm ?? 'human') : null;
  const tempo = human ? (options.tempo ?? 0.85 + random() * 0.65) : 1;
  const steps: AutotypeStep[] = [];

  const push = (typed: string, delay: number, kind: AutotypeStep['kind'] = 'type') => {
    const prev = steps.length ? steps[steps.length - 1].typed : '';
    const key = kind === 'back' ? prev.slice(-1) : typed.slice(prev.length);
    steps.push({ typed, delay, kind, key });
  };

  if (!human || !rhythm) {
    const interval = options.steadyInterval ?? STEADY_INTERVAL;
    for (let i = 0; i < word.length; i++) {
      push(word.slice(0, i + 1), interval);
    }
    return {
      word,
      human: false,
      rhythm: null,
      tempo: 1,
      steps,
      endPause: endPauseFor(false, null, random),
    };
  }

  let budget = typoBudget(word.length, rhythm, random);
  let shown = '';
  let i = 0;
  while (i < word.length) {
    const ch = word[i] ?? '';
    if (budget > 0 && i >= 1 && random() < 0.55) {
      budget -= 1;
      const style = random();

      if (style < 0.28 && i + 1 < word.length) {
        const a = ch;
        const b = word[i + 1] ?? '';
        push(shown + b, keyDelay(rhythm, tempo, random));
        push(shown + b + a, keyDelay(rhythm, tempo, random));
        push(shown + b, 0.2 + random() * 0.3, 'back');
        push(shown, 0.05 + random() * 0.09, 'back');
        push(shown + a, 0.1 + random() * 0.12);
        push(shown + a + b, 0.08 + random() * 0.1);
        shown += a + b;
        i += 2;
        continue;
      }

      if (style < 0.5) {
        push(shown + ch, keyDelay(rhythm, tempo, random));
        push(shown + ch + ch, keyDelay(rhythm, tempo, random));
        push(shown + ch, 0.16 + random() * 0.26, 'back');
        shown += ch;
        i += 1;
        continue;
      }

      if (style < 0.75 && i + 1 < word.length) {
        const wrong = slipKey(ch, random);
        const next = word[i + 1] ?? '';
        push(shown + wrong, keyDelay(rhythm, tempo, random));
        push(shown + wrong + next, keyDelay(rhythm, tempo, random));
        push(shown + wrong, 0.14 + random() * 0.22, 'back');
        push(shown, 0.05 + random() * 0.09, 'back');
        push(shown + ch, 0.1 + random() * 0.12);
        push(shown + ch + next, 0.08 + random() * 0.1);
        shown += ch + next;
        i += 2;
        continue;
      }

      const wrong = slipKey(ch, random);
      push(shown + wrong, keyDelay(rhythm, tempo, random));
      push(shown, 0.18 + random() * 0.3, 'back');
      push(shown + ch, 0.1 + random() * 0.12);
      shown += ch;
      i += 1;
      continue;
    }

    let delay = keyDelay(rhythm, tempo, random);
    if (AWKWARD_LETTERS.includes(ch.toLowerCase()) && random() < 0.45) {
      delay += 0.08 + random() * 0.16;
    }
    push(shown + ch, delay);
    shown += ch;
    i += 1;
  }

  if (steps.length) {
    steps[0].delay += leadInDelay(rhythm, random);
  }

  return {
    word,
    human: true,
    rhythm,
    tempo,
    steps,
    endPause: endPauseFor(true, rhythm, random),
  };
}

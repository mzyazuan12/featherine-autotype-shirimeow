import { buildAutotypePlan } from './plan';
import type { AutotypeClock, AutotypeOptions, AutotypePlan, AutotypeStep } from './types';

export function createAutotypeClock(): AutotypeClock {
  return { stepIndex: 0, stepTimer: 0, afterDelay: 0 };
}

export function tickAutotype(plan: AutotypePlan, clock: AutotypeClock, dt: number): AutotypeStep[] {
  const fired: AutotypeStep[] = [];
  if (clock.stepIndex < plan.steps.length) {
    clock.stepTimer += dt;
    while (clock.stepIndex < plan.steps.length) {
      const step = plan.steps[clock.stepIndex];
      if (!step || clock.stepTimer < step.delay) break;
      clock.stepTimer -= step.delay;
      clock.stepIndex += 1;
      fired.push(step);
    }
    return fired;
  }
  clock.afterDelay += dt;
  return fired;
}

export type AutotypeTarget = { value: string };

export type AutotypePlayOptions = AutotypeOptions & {
  onStep?: (step: AutotypeStep) => void;
  onText?: (typed: string, step: AutotypeStep) => void;
  onDone?: () => void;
};

export type AutotypeHandle = {
  plan: AutotypePlan;
  cancel: () => void;
};

export function playAutotype(word: string, options: AutotypePlayOptions = {}): AutotypeHandle {
  const plan = buildAutotypePlan(word, options);
  const clock = createAutotypeClock();
  let cancelled = false;
  let frame = 0;
  let last = performance.now();

  const loop = (now: number) => {
    if (cancelled) return;
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    const alreadyDone = clock.stepIndex >= plan.steps.length;
    const fired = tickAutotype(plan, clock, dt);
    if (!alreadyDone) {
      for (const step of fired) {
        options.onStep?.(step);
        options.onText?.(step.typed, step);
      }
    }
    if (clock.stepIndex >= plan.steps.length && clock.afterDelay >= plan.endPause) {
      options.onDone?.();
      return;
    }
    frame = requestAnimationFrame(loop);
  };

  frame = requestAnimationFrame(loop);
  return {
    plan,
    cancel() {
      cancelled = true;
      cancelAnimationFrame(frame);
    },
  };
}

export function autotypeInto(
  target: AutotypeTarget,
  word: string,
  options: AutotypePlayOptions = {}
): AutotypeHandle {
  return playAutotype(word, {
    ...options,
    onText(typed, step) {
      target.value = typed;
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
        const end = typed.length;
        try {
          target.setSelectionRange(end, end);
        } catch {}
        target.dispatchEvent(new Event('input', { bubbles: true }));
      }
      options.onText?.(typed, step);
    },
    onDone() {
      options.onDone?.();
    },
  });
}

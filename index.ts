export { buildAutotypePlan } from './plan';
export {
  autotypeInto,
  createAutotypeClock,
  playAutotype,
  tickAutotype,
} from './player';
export type { AutotypeHandle, AutotypePlayOptions, AutotypeTarget } from './player';
export type {
  AutotypeClock,
  AutotypeKind,
  AutotypeOptions,
  AutotypePlan,
  AutotypeStep,
  TypingRhythm,
} from './types';
export {
  AWKWARD_LETTERS,
  CHARACTER_TYPING,
  QWERTY_NEIGHBORS,
  endPauseFor,
  keyDelay,
  leadInDelay,
  slipKey,
  typingStyleForName,
  typoBudget,
} from './variance';

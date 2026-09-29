export type TypingRhythm =
  | 'patient'
  | 'human'
  | 'staccato'
  | 'mechanical'
  | 'erratic'
  | 'instant';

export type AutotypeKind = 'type' | 'back';

export type AutotypeStep = {
  typed: string;
  delay: number;
  kind: AutotypeKind;
  key: string;
};

export type AutotypePlan = {
  word: string;
  human: boolean;
  rhythm: TypingRhythm | null;
  tempo: number;
  steps: AutotypeStep[];
  endPause: number;
};

export type AutotypeOptions = {
  human?: boolean;
  rhythm?: TypingRhythm;
  tempo?: number;
  steadyInterval?: number;
  random?: () => number;
};

export type AutotypeClock = {
  stepIndex: number;
  stepTimer: number;
  afterDelay: number;
};

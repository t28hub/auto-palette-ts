import { expect } from 'vitest';

import { toBeSimilarColor } from './toBeSimilarColor';

export interface AutoPaletteMatchers<R = unknown> {
  toBeSimilarColor(expected: unknown): R;

  toBeSimilarColor(expected: unknown, threshold: number): R;
}

declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Assertion extends AutoPaletteMatchers {}

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface AsymmetricMatchersContaining extends AutoPaletteMatchers {}
}

expect.extend({ toBeSimilarColor });

import { expect } from 'vitest';

import { toBeSimilarColor } from './toBeSimilarColor';

export interface AutoPaletteMatchers<R = unknown> {
  toBeSimilarColor(expected: unknown): R;

  toBeSimilarColor(expected: unknown, threshold: number): R;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Vi {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Assertion extends AutoPaletteMatchers {}

    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface AsymmetricMatchersContaining extends AutoPaletteMatchers {}
  }
}

expect.extend({
  toBeSimilarColor,
});

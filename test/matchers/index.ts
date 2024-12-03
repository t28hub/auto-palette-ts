import { expect } from 'vitest';

import { toBeSimilarColor } from './toBeSimilarColor';

/**
 * Custom matchers for AutoPalette.
 *
 * These matchers are automatically extended to the global scope.
 */
interface AutoPaletteMatchers<R = unknown> {
  /**
   * Check whether the received color is similar to the expected color.
   *
   * @param expected - The expected color.
   * @return The matcher result.
   */
  toBeSimilarColor(expected: unknown): R;

  /**
   * Check whether the received color is similar to the expected color.
   *
   * @param expected - The expected color.
   * @param threshold - The allowed threshold.
   * @return The matcher result.
   */
  toBeSimilarColor(expected: unknown, threshold: number): R;
}

// Extend the built-in matchers with the custom matchers.
declare module 'vitest' {
  interface Assertion extends AutoPaletteMatchers {}

  interface AsymmetricMatchersContaining extends AutoPaletteMatchers {}
}

// Add the custom matchers to the global scope.
expect.extend({ toBeSimilarColor });

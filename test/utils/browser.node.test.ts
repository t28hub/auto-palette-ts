import { isBrowser } from '@internal/utils/browser';
import { describe, expect, it } from 'vitest';

// @vitest-environment node
describe('isBrowser', () => {
  it('should return false when the current environment is not a browser', () => {
    const actual = isBrowser();

    expect(actual).toBeFalsy();
  });
});

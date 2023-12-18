import { isBrowser } from '@internal/utils/browser';
import { describe, expect, it } from 'vitest';

// @vitest-environment jsdom
describe('isBrowser', () => {
  it('should return true when the current environment is a browser', () => {
    const actual = isBrowser();

    expect(actual).toBeTruthy();
  });
});

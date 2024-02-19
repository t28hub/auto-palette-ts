import { isBrowser, isWebWorker } from '@internal/utils/browser';
import { describe, expect, it } from 'vitest';

// @vitest-environment jsdom
describe('browser', () => {
  describe('isBrowser', () => {
    it('should return true when the current environment is a browser', () => {
      const actual = isBrowser();

      expect(actual).toBeTruthy();
    });
  });

  describe('isWebWorker', () => {
    it('should return false when the current environment is a browser', () => {
      const actual = isWebWorker();

      expect(actual).toBeFalsy();
    });
  });
});

import { isBrowser, isWebWorker } from '@internal/utils/browser';
import { describe, expect, it } from 'vitest';

// @vitest-environment node
describe('browser', () => {
  describe('isBrowser', () => {
    it('should return false when the current environment is not a browser', () => {
      const actual = isBrowser();

      expect(actual).toBeFalsy();
    });
  });

  describe('isWebWorker', () => {
    it('should return false when the current environment is not a web worker', () => {
      const actual = isWebWorker();

      expect(actual).toBeFalsy();
    });
  });
});

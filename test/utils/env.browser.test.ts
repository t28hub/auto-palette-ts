import { isBrowser, isWebWorker } from '@internal/utils/env';
import { describe, expect, it } from 'vitest';

describe('e2e:browser/env', () => {
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

import { isBrowser, isWebWorker } from '@internal/utils/env';
import { describe, expect, it } from 'vitest';

describe('e2e:node/env', () => {
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

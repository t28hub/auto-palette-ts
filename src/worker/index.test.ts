import { describe, expect, it } from 'vitest';

import { defaultWorker } from './index';

describe('index', () => {
  describe('defaultWorker', () => {
    it('should return the default worker', () => {
      // Actual
      const actual1 = defaultWorker();
      const actual2 = defaultWorker();

      // Assert
      expect(actual1).toBeDefined();
      expect(actual2).toBeDefined();
      expect(actual1).toBe(actual2);
    });
  });
});

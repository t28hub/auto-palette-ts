import { retrieveColorNames } from '@internal/color/name';
import { describe, expect, it } from 'vitest';

describe('name', () => {
  describe('retrieveColorNames', () => {
    it('should retrieve the ColorNames instance', () => {
      // Act
      const actual = retrieveColorNames();

      // Assert
      expect(actual).toBeDefined();
    });

    it('should retrieve the same ColorNames instance', () => {
      // Act
      const actual1 = retrieveColorNames();
      const actual2 = retrieveColorNames();

      // Assert
      expect(actual1).toBe(actual2);
    });
  });
});

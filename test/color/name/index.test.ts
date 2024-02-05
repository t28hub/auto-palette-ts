import { retrieveColorNameFinder } from '@internal/color/name';
import { describe, expect, it } from 'vitest';

describe('name', () => {
  describe('retrieveColorNameFinder', () => {
    it('should retrieve the color name finder instance', () => {
      // Act
      const actual = retrieveColorNameFinder();

      // Assert
      expect(actual).toBeDefined();
    });

    it('should retrieve the same color name finder instance', () => {
      // Act
      const actual1 = retrieveColorNameFinder();
      const actual2 = retrieveColorNameFinder();

      // Assert
      expect(actual1).toBe(actual2);
    });
  });
});

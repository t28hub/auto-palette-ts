import { DefaultThemeStrategy } from '@internal/theme/default';
import { AssertionError } from '@internal/utils';
import { Color } from 'auto-palette';
import { describe, expect, it } from 'vitest';

describe('DefaultThemeStrategy', () => {
  describe('constructor', () => {
    it('should create a new DefaultThemeStrategy instance', () => {
      // Act
      const actual = new DefaultThemeStrategy(128);

      // Assert
      expect(actual).toBeDefined();
    });

    it('should throw an AssertionError if the maximum population is not a positive integer', () => {
      // Assert
      expect(() => {
        // Act
        new DefaultThemeStrategy(0);
      }).toThrowError(AssertionError);
    });
  });

  describe('filter', () => {
    it('should always return true', () => {
      // Arrange
      const strategy = new DefaultThemeStrategy(128);

      // Act
      const actual = strategy.filter({
        color: Color.fromLAB({ l: 0, a: 0, b: 0 }),
        position: { x: 0, y: 0 },
        population: 1,
      });

      // Assert
      expect(actual).toBeTruthy();
    });
  });

  describe('score', () => {
    it('should return the normalized population', () => {
      // Arrange
      const strategy = new DefaultThemeStrategy(128);

      // Act
      const actual = strategy.score({
        color: Color.fromLAB({ l: 0, a: 0, b: 0 }),
        position: { x: 0, y: 0 },
        population: 32,
      });

      // Assert
      expect(actual).toBe(0.25);
    });
  });
});

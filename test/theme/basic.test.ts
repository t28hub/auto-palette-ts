import { BasicThemeStrategy } from '@internal/theme/basic';
import { AssertionError } from '@internal/utils';
import { Color } from 'auto-palette';
import { describe, expect, it } from 'vitest';

describe('BasicThemeStrategy', () => {
  describe('constructor', () => {
    it('should create a new DefaultThemeStrategy instance', () => {
      // Act
      const actual = new BasicThemeStrategy(128);

      // Assert
      expect(actual).toBeDefined();
    });

    it('should throw an AssertionError if the maximum population is not a positive integer', () => {
      // Assert
      expect(() => {
        // Act
        new BasicThemeStrategy(0);
      }).toThrowError(AssertionError);
    });
  });

  describe('filter', () => {
    it.each([
      { lightness: 0, expected: false },
      { lightness: 25, expected: true },
      { lightness: 50, expected: true },
      { lightness: 85, expected: true },
      { lightness: 100, expected: false },
    ])('should return $expected if the lightness is $lightness', ({ lightness, expected }) => {
      // Arrange
      const strategy = new BasicThemeStrategy(128);

      // Act
      const actual = strategy.filter({
        color: Color.fromLAB({ l: lightness, a: 0, b: 0 }),
        position: { x: 0, y: 0 },
        population: 32,
      });

      // Assert
      expect(actual).toBe(expected);
    });
  });

  describe('score', () => {
    it('should return the normalized population', () => {
      // Arrange
      const strategy = new BasicThemeStrategy(128);

      // Act
      const actual = strategy.score({
        color: Color.fromLAB({ l: 0, a: 0, b: 0 }),
        position: { x: 0, y: 0 },
        population: 32,
      });

      // Assert
      expect(actual).toBe(0.125);
    });
  });
});

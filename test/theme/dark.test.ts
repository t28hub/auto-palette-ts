import { DarkThemeStrategy } from '@internal/theme/dark';
import { AssertionError } from '@internal/utils';
import { Color } from 'auto-palette';
import { describe, expect, it } from 'vitest';

describe('DarkThemeStrategy', () => {
  describe('constructor', () => {
    it('should create a new DarkThemeStrategy instance', () => {
      // Act
      const actual = new DarkThemeStrategy();

      // Assert
      expect(actual).toBeDefined();
    });

    it('should create a new DarkThemeStrategy instance with the specified maximum lightness', () => {
      // Act
      const actual = new DarkThemeStrategy(60);

      // Assert
      expect(actual).toBeDefined();
    });

    it.each([-1, 101, NaN, Infinity, -Infinity])(
      'should throw an AssertionError if the maximum lightness(%d) is not in the range [0, 100]',
      (lightness) => {
        // Assert
        expect(() => {
          // Act
          new DarkThemeStrategy(lightness);
        }).toThrowError(AssertionError);
      },
    );
  });

  describe('filter', () => {
    it('should return true for dark colors', () => {
      // Arrange
      const strategy = new DarkThemeStrategy(50);

      // Act
      const color = Color.fromLAB({ l: 20, a: 0, b: 0 });
      const actual = strategy.filter({
        color,
        position: { x: 0, y: 0 },
        population: 1,
      });

      // Assert
      expect(actual).toBeTruthy();
    });

    it('should return false for light colors', () => {
      // Arrange
      const strategy = new DarkThemeStrategy(50);

      // Act
      const color = Color.fromLAB({ l: 80, a: 0, b: 0 });
      const actual = strategy.filter({
        color,
        position: { x: 0, y: 0 },
        population: 1,
      });

      // Assert
      expect(actual).toBeFalsy();
    });
  });

  describe('score', () => {
    it('should return normalized darkness', () => {
      // Arrange
      const strategy = new DarkThemeStrategy(50);

      // Act
      const color = Color.fromLAB({ l: 20, a: 0, b: 0 });
      const actual = strategy.score({
        color,
        position: { x: 0, y: 0 },
        population: 1,
      });

      // Assert
      expect(actual).toBeCloseTo(0.8);
    });
  });
});

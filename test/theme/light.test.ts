import { LightThemeStrategy } from '@internal/theme/light';
import { AssertionError } from '@internal/utils';
import { Color } from 'auto-palette';
import { describe, expect, it } from 'vitest';

describe('LightThemeStrategy', () => {
  describe('constructor', () => {
    it('should create a new LightThemeStrategy instance', () => {
      // Act
      const actual = new LightThemeStrategy();

      // Assert
      expect(actual).toBeDefined();
    });

    it('should create a new LightThemeStrategy instance with the specified minimum lightness', () => {
      // Act
      const actual = new LightThemeStrategy(40);

      // Assert
      expect(actual).toBeDefined();
    });

    it.each([-1, 101, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])(
      'should throw an AssertionError if the minimum lightness(%d) is not in the range [0, 100]',
      (lightness) => {
        // Assert
        expect(() => {
          // Act
          new LightThemeStrategy(lightness);
        }).toThrowError(AssertionError);
      },
    );
  });

  describe('filter', () => {
    it('should return true for light colors', () => {
      // Arrange
      const strategy = new LightThemeStrategy(50);

      // Act
      const color = Color.fromLAB({ l: 80, a: 0, b: 0 });
      const actual = strategy.filter({
        color,
        position: { x: 0, y: 0 },
        population: 1,
      });

      // Assert
      expect(actual).toBeTruthy();
    });

    it('should return false for dark colors', () => {
      // Arrange
      const strategy = new LightThemeStrategy(50);

      // Act
      const color = Color.fromLAB({ l: 20, a: 0, b: 0 });
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
    it('should return normalized lightness', () => {
      // Arrange
      const strategy = new LightThemeStrategy(50);

      // Act
      const color = Color.fromLAB({ l: 80, a: 0, b: 0 });
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

import { VividThemeStrategy } from '@internal/theme/vivid';
import { AssertionError } from '@internal/utils';
import { Color } from 'auto-palette';
import { describe, expect, it } from 'vitest';

describe('VividThemeStrategy', () => {
  describe('constructor', () => {
    it('should create a new VividThemeStrategy instance', () => {
      // Act
      const actual = new VividThemeStrategy();

      // Assert
      expect(actual).toBeDefined();
    });

    it('should create a new VividThemeStrategy instance with the specified minimum chroma', () => {
      // Act
      const actual = new VividThemeStrategy(120);

      // Assert
      expect(actual).toBeDefined();
    });

    it.each([-1, 181, NaN, Infinity, -Infinity])(
      'should throw an AssertionError if the minimum chroma(%d) is not in the range [0, 180]',
      (chroma) => {
        // Assert
        expect(() => {
          // Act
          new VividThemeStrategy(chroma);
        }).toThrowError(AssertionError);
      },
    );
  });

  describe('filter', () => {
    it('should return true for vivid colors', () => {
      // Arrange
      const strategy = new VividThemeStrategy();

      // Act
      const color = Color.fromLAB({ l: 50, a: 80, b: 80 });
      const actual = strategy.filter({
        color,
        position: { x: 0, y: 0 },
        population: 1,
      });

      // Assert
      expect(actual).toBeTruthy();
    });

    it('should return false for non-vivid colors', () => {
      // Arrange
      const strategy = new VividThemeStrategy();

      // Act
      const color = Color.fromLAB({ l: 50, a: 20, b: 20 });
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
    it('should return normalized chroma', () => {
      // Arrange
      const strategy = new VividThemeStrategy();

      // Act
      const color = Color.fromLAB({ l: 50, a: 80, b: 80 });
      const actual = strategy.score({
        color,
        position: { x: 0, y: 0 },
        population: 1,
      });

      // Assert
      expect(actual).toBeCloseTo(0.6285);
    });
  });
});

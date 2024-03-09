import { MutedThemeStrategy } from '@internal/theme/muted';
import { AssertionError } from '@internal/utils';
import { Color } from 'auto-palette';
import { describe, expect, it } from 'vitest';

describe('MutedThemeStrategy', () => {
  describe('constructor', () => {
    it('should create a new MutedThemeStrategy instance', () => {
      // Act
      const actual = new MutedThemeStrategy();

      // Assert
      expect(actual).toBeDefined();
    });

    it('should create a new MutedThemeStrategy instance with the specified maximum chroma', () => {
      // Act
      const actual = new MutedThemeStrategy(90);

      // Assert
      expect(actual).toBeDefined();
    });

    it.each([-1, 181, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])(
      'should throw an AssertionError if the maximum chroma(%d) is not in the range [0, 180]',
      (chroma) => {
        // Assert
        expect(() => {
          // Act
          new MutedThemeStrategy(chroma);
        }).toThrowError(AssertionError);
      },
    );
  });
  describe('filter', () => {
    it('should return true for muted colors', () => {
      // Arrange
      const strategy = new MutedThemeStrategy();

      // Act
      const color = Color.fromLAB({ l: 50, a: 20, b: 20 });
      const actual = strategy.filter({
        color,
        position: { x: 0, y: 0 },
        population: 1,
      });

      // Assert
      expect(actual).toBeTruthy();
    });

    it('should return false for non-muted colors', () => {
      // Arrange
      const strategy = new MutedThemeStrategy();

      // Act
      const color = Color.fromLAB({ l: 50, a: 80, b: 80 });
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
    it('should return inverse normalized chroma', () => {
      // Arrange
      const strategy = new MutedThemeStrategy();

      // Act
      const color = Color.fromLAB({ l: 50, a: 20, b: 20 });
      const actual = strategy.score({
        color,
        position: { x: 0, y: 0 },
        population: 1,
      });

      // Assert
      expect(actual).toBeCloseTo(0.8429);
    });
  });
});

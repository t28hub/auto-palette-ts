import { LightThemeStrategy } from '@internal/theme/light';
import { Color } from 'auto-palette';
import { describe, expect, it } from 'vitest';

describe('LightThemeStrategy', () => {
  describe('filter', () => {
    it('should return true for ligth colors', () => {
      // Act
      const color = Color.fromLAB({ l: 80, a: 0, b: 0 });
      const actual = LightThemeStrategy.filter({
        color,
        position: { x: 0, y: 0 },
        population: 1,
      });

      // Assert
      expect(actual).toBeTruthy();
    });

    it('should return false for dark colors', () => {
      // Act
      const color = Color.fromLAB({ l: 20, a: 0, b: 0 });
      const actual = LightThemeStrategy.filter({
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
      // Act
      const color = Color.fromLAB({ l: 80, a: 0, b: 0 });
      const actual = LightThemeStrategy.score({
        color,
        position: { x: 0, y: 0 },
        population: 1,
      });

      // Assert
      expect(actual).toBeCloseTo(0.8);
    });
  });
});

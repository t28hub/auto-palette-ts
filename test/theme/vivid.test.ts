import { VividThemeStrategy } from '@internal/theme/vivid';
import { Color } from 'auto-palette';
import { describe, expect, it } from 'vitest';

describe('VividThemeStrategy', () => {
  describe('filter', () => {
    it('should return true for vivid colors', () => {
      // Act
      const color = Color.fromLAB({ l: 50, a: 80, b: 80 });
      const actual = VividThemeStrategy.filter({
        color,
        position: { x: 0, y: 0 },
        population: 1,
      });

      // Assert
      expect(actual).toBeTruthy();
    });

    it('should return false for non-vivid colors', () => {
      // Act
      const color = Color.fromLAB({ l: 50, a: 20, b: 20 });
      const actual = VividThemeStrategy.filter({
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
      // Act
      const color = Color.fromLAB({ l: 50, a: 80, b: 80 });
      const actual = VividThemeStrategy.score({
        color,
        position: { x: 0, y: 0 },
        population: 1,
      });

      // Assert
      expect(actual).toBeCloseTo(0.6285);
    });
  });
});

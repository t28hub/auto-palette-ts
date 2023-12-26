import { MutedThemeStrategy } from '@internal/theme/muted';
import { Color } from 'auto-palette';
import { describe, expect, it } from 'vitest';

describe('MutedThemeStrategy', () => {
  describe('filter', () => {
    it('should return true for muted colors', () => {
      // Act
      const color = Color.fromLAB({ l: 50, a: 20, b: 20 });
      const actual = MutedThemeStrategy.filter({
        color,
        position: { x: 0, y: 0 },
        population: 1,
      });

      // Assert
      expect(actual).toBeTruthy();
    });

    it('should return false for non-muted colors', () => {
      // Act
      const color = Color.fromLAB({ l: 50, a: 80, b: 80 });
      const actual = MutedThemeStrategy.filter({
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
      // Act
      const color = Color.fromLAB({ l: 50, a: 20, b: 20 });
      const actual = MutedThemeStrategy.score({
        color,
        position: { x: 0, y: 0 },
        population: 1,
      });

      // Assert
      expect(actual).toBeCloseTo(0.8429);
    });
  });
});

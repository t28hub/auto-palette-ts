import { getWeightFunction, Theme } from '@internal/theme';
import { Color, Swatch } from 'auto-palette';
import { describe, expect, it } from 'vitest';

describe('Theme', () => {
  describe('getWeightFunction', () => {
    it.each([
      { theme: 'vivid', color: new Color(50, 0, 0), expected: 0.0 },
      { theme: 'vivid', color: new Color(50, 32, 32), expected: 0.25 },
      { theme: 'vivid', color: new Color(50, 128, 128), expected: 1.0 },
      { theme: 'muted', color: new Color(50, 0, 0), expected: 1.0 },
      { theme: 'muted', color: new Color(50, 32, 32), expected: 0.75 },
      { theme: 'muted', color: new Color(50, 128, 128), expected: 0.0 },
      { theme: 'light', color: new Color(0, 0, 0), expected: 0.0 },
      { theme: 'light', color: new Color(25, 0, 0), expected: 0.25 },
      { theme: 'light', color: new Color(100, 0, 0), expected: 1.0 },
      { theme: 'dark', color: new Color(0, 0, 0), expected: 1.0 },
      { theme: 'dark', color: new Color(25, 0, 0), expected: 0.75 },
      { theme: 'dark', color: new Color(100, 0, 0), expected: 0.0 },
    ])(
      'should return the WeightFunction for the $theme and calculate the weight of the swatch($color)',
      ({ theme, color, expected }) => {
        // Act
        const weightFunction = getWeightFunction(theme as Theme);

        // Assert
        expect(weightFunction).toBeDefined();
        const swatch: Swatch = { color, population: 1, position: { x: 0, y: 0 } };
        expect(weightFunction(swatch)).toBeCloseTo(expected);
      },
    );
  });
});

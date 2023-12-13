import { Theme, getWeightFunction } from '@internal/theme';
import { Color, Swatch } from 'auto-palette';
import { describe, expect, it } from 'vitest';

describe('Theme', () => {
  describe('getWeightFunction', () => {
    it.each([
      { theme: 'vivid', color: Color.fromLAB({ l: 50, a: 0, b: 0 }), expected: 0.0 },
      { theme: 'vivid', color: Color.fromLAB({ l: 50, a: 0, b: 0 }), expected: 0.0 },
      { theme: 'vivid', color: Color.fromLAB({ l: 50, a: 32, b: 32 }), expected: 0.25 },
      { theme: 'vivid', color: Color.fromLAB({ l: 50, a: 128, b: 128 }), expected: 1.0 },
      { theme: 'muted', color: Color.fromLAB({ l: 50, a: 0, b: 0 }), expected: 1.0 },
      { theme: 'muted', color: Color.fromLAB({ l: 50, a: 32, b: 32 }), expected: 0.75 },
      { theme: 'muted', color: Color.fromLAB({ l: 50, a: 128, b: 128 }), expected: 0.0 },
      { theme: 'light', color: Color.fromLAB({ l: 0, a: 0, b: 0 }), expected: 0.0 },
      { theme: 'light', color: Color.fromLAB({ l: 25, a: 0, b: 0 }), expected: 0.25 },
      { theme: 'light', color: Color.fromLAB({ l: 100, a: 0, b: 0 }), expected: 1.0 },
      { theme: 'dark', color: Color.fromLAB({ l: 0, a: 0, b: 0 }), expected: 1.0 },
      { theme: 'dark', color: Color.fromLAB({ l: 25, a: 0, b: 0 }), expected: 0.75 },
      { theme: 'dark', color: Color.fromLAB({ l: 100, a: 0, b: 0 }), expected: 0.0 },
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

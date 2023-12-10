import { clampLightness, clampSaturation, fromRGB, normalizeHue, toRGB } from '@internal/color/space/hsl';
import { AssertionError } from '@internal/utils';
import { describe, expect, it } from 'vitest';

describe('HSL', () => {
  describe('normalizeHue', () => {
    it.each([
      { value: -120, expected: 240 },
      { value: -1, expected: 359 },
      { value: 0, expected: 0 },
      { value: 180, expected: 180 },
      { value: 360, expected: 0 },
      { value: 361, expected: 1 },
      { value: 480, expected: 120 },
    ])('should normalize hue value($value) to $expected', ({ value, expected }) => {
      // Act
      const actual = normalizeHue(value);

      // Assert
      expect(actual).toEqual(expected);
    });
  });

  describe('clampSaturation', () => {
    it.each([
      { value: -0.1, expected: 0.0 },
      { value: 0.0, expected: 0.0 },
      { value: 0.5, expected: 0.5 },
      { value: 1.0, expected: 1.0 },
      { value: 1.1, expected: 1.0 },
    ])('should clamp saturation value($value) to $expected', ({ value, expected }) => {
      // Act
      const actual = clampSaturation(value);

      // Assert
      expect(actual).toEqual(expected);
    });
  });

  describe('clampLightness', () => {
    it.each([
      { value: -0.1, expected: 0.0 },
      { value: 0.0, expected: 0.0 },
      { value: 0.5, expected: 0.5 },
      { value: 1.0, expected: 1.0 },
      { value: 1.1, expected: 1.0 },
    ])('should clamp lightness value($value) to $expected', ({ value, expected }) => {
      // Act
      const actual = clampLightness(value);

      // Assert
      expect(actual).toEqual(expected);
    });
  });

  describe('toRGB', () => {
    it.each([
      { hsl: { h: 0, s: 0, l: 0 }, expected: { r: 0, g: 0, b: 0 } }, // Black
      { hsl: { h: 0, s: 0, l: 1 }, expected: { r: 255, g: 255, b: 255 } }, // White
      { hsl: { h: 0, s: 1, l: 0.5 }, expected: { r: 255, g: 0, b: 0 } }, // Red
      { hsl: { h: 120, s: 1, l: 0.5 }, expected: { r: 0, g: 255, b: 0 } }, // Green
      { hsl: { h: 240, s: 1, l: 0.5 }, expected: { r: 0, g: 0, b: 255 } }, // Blue
      { hsl: { h: 180, s: 1, l: 0.5 }, expected: { r: 0, g: 255, b: 255 } }, // Cyan
      { hsl: { h: 300, s: 1, l: 0.5 }, expected: { r: 255, g: 0, b: 255 } }, // Magenta
      { hsl: { h: 60, s: 1, l: 0.5 }, expected: { r: 255, g: 255, b: 0 } }, // Yellow
    ])('should convert HSL($hsl) to RGB($expected)', ({ hsl, expected }) => {
      // Act
      const actual = toRGB(hsl);

      // Assert
      expect(actual).toMatchObject(expected);
    });

    it.each([
      { h: NaN, s: 0, l: 0 },
      { h: Infinity, s: 0, l: 0 },
      { h: -Infinity, s: 0, l: 0 },
      { h: 0, s: NaN, l: 0 },
      { h: 0, s: Infinity, l: 0 },
      { h: 0, s: -Infinity, l: 0 },
      { h: 0, s: 0, l: NaN },
      { h: 0, s: 0, l: Infinity },
      { h: 0, s: 0, l: -Infinity },
    ])('should throw an AssertionError if the h, s, or l component(%o) is not a finite number', (hsl) => {
      // Assert
      expect(() => {
        // Act
        toRGB(hsl);
      }).toThrowError(AssertionError);
    });
  });

  describe('fromRGB', () => {
    it.each([
      { rgb: { r: 0, g: 0, b: 0 }, expected: { h: 0, s: 0, l: 0 } }, // Black
      { rgb: { r: 255, g: 255, b: 255 }, expected: { h: 0, s: 0, l: 1 } }, // White
      { rgb: { r: 255, g: 0, b: 0 }, expected: { h: 0, s: 1, l: 0.5 } }, // Red
      { rgb: { r: 0, g: 255, b: 0 }, expected: { h: 120, s: 1, l: 0.5 } }, // Green
      { rgb: { r: 0, g: 0, b: 255 }, expected: { h: 240, s: 1, l: 0.5 } }, // Blue
      { rgb: { r: 0, g: 255, b: 255 }, expected: { h: 180, s: 1, l: 0.5 } }, // Cyan
      { rgb: { r: 255, g: 0, b: 255 }, expected: { h: 300, s: 1, l: 0.5 } }, // Magenta
      { rgb: { r: 255, g: 255, b: 0 }, expected: { h: 60, s: 1, l: 0.5 } }, // Yellow
    ])('should convert RGB($rgb) to HSL($expected)', ({ rgb, expected }) => {
      // Act
      const actual = fromRGB(rgb);

      // Assert
      expect(actual).toMatchObject(expected);
    });

    it.each([
      { r: NaN, g: 0, b: 0 },
      { r: Infinity, g: 0, b: 0 },
      { r: -Infinity, g: 0, b: 0 },
      { r: 0, g: NaN, b: 0 },
      { r: 0, g: Infinity, b: 0 },
      { r: 0, g: -Infinity, b: 0 },
      { r: 0, g: 0, b: NaN },
      { r: 0, g: 0, b: Infinity },
      { r: 0, g: 0, b: -Infinity },
    ])('should throw an AssertionError if the r, g, or b component(%o) is not a finite number', (rgb) => {
      // Assert
      expect(() => {
        // Act
        fromRGB(rgb);
      }).toThrowError(AssertionError);
    });
  });
});

import { clampX, clampY, clampZ, fromRGB, toRGB } from '@internal/color/space/xyz';
import { AssertionError } from '@internal/utils';
import { describe, expect, it } from 'vitest';

describe('XYZ', () => {
  describe('clampX', () => {
    it.each([
      { value: -0.1, expected: 0.0 },
      { value: 0.0, expected: 0.0 },
      { value: 0.1, expected: 0.1 },
      { value: 0.25, expected: 0.25 },
      { value: 0.95, expected: 0.95 },
      { value: 0.950456, expected: 0.950456 },
      { value: 0.950457, expected: 0.950456 },
      { value: 1.0, expected: 0.950456 },
      { value: 1.1, expected: 0.950456 },
    ])('should clamp value($value) to $expected', ({ value, expected }) => {
      // Act
      const actual = clampX(value);

      // Assert
      expect(actual).toEqual(expected);
    });
  });

  describe('clampY', () => {
    it.each([
      { value: -0.1, expected: 0.0 },
      { value: 0.0, expected: 0.0 },
      { value: 0.1, expected: 0.1 },
      { value: 0.5, expected: 0.5 },
      { value: 1.0, expected: 1.0 },
      { value: 1.1, expected: 1.0 },
    ])('should clamp value($value) to $expected', ({ value, expected }) => {
      // Act
      const actual = clampY(value);

      // Assert
      expect(actual).toEqual(expected);
    });
  });

  describe('clampZ', () => {
    it.each([
      { value: -0.1, expected: 0.0 },
      { value: 0.0, expected: 0.0 },
      { value: 0.1, expected: 0.1 },
      { value: 0.5, expected: 0.5 },
      { value: 1.088644, expected: 1.088644 },
      { value: 1.088645, expected: 1.088644 },
      { value: 1.1, expected: 1.088644 },
    ])('should clamp value($value) to $expected', ({ value, expected }) => {
      // Act
      const actual = clampZ(value);

      // Assert
      expect(actual).toEqual(expected);
    });
  });

  describe('fromRGB', () => {
    it.each([
      { rgb: { r: 0, g: 0, b: 0 }, expected: { x: 0.0, y: 0.0, z: 0.0 } }, // Black
      { rgb: { r: 255, g: 255, b: 255 }, expected: { x: 0.9505, y: 1.0, z: 1.0886 } }, // White
      { rgb: { r: 255, g: 0, b: 0 }, expected: { x: 0.4124, y: 0.2126, z: 0.01933 } }, // Red
      { rgb: { r: 0, g: 255, b: 0 }, expected: { x: 0.3576, y: 0.7152, z: 0.1192 } }, // Green
      { rgb: { r: 0, g: 0, b: 255 }, expected: { x: 0.1805, y: 0.0722, z: 0.9505 } }, // Blue
      { rgb: { r: 0, g: 255, b: 255 }, expected: { x: 0.5381, y: 0.7874, z: 1.0697 } }, // Cyan
      { rgb: { r: 255, g: 0, b: 255 }, expected: { x: 0.5929, y: 0.2848, z: 0.9699 } }, // Magenta
      { rgb: { r: 255, g: 255, b: 0 }, expected: { x: 0.77, y: 0.9278, z: 0.1385 } }, // Yellow
    ])('should convert RGB(%o) to XYZ(%o)', ({ rgb, expected }) => {
      // Act
      const actual = fromRGB(rgb);

      // Assert
      expect(actual.x).toBeCloseTo(expected.x, 4);
      expect(actual.y).toBeCloseTo(expected.y, 4);
      expect(actual.z).toBeCloseTo(expected.z, 4);
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

  describe('toRGB', () => {
    it.each([
      { xyz: { x: 0.0, y: 0.0, z: 0.0 }, expected: { r: 0, g: 0, b: 0 } }, // Black
      { xyz: { x: 0.9505, y: 1.0, z: 1.0886 }, expected: { r: 255, g: 255, b: 255 } }, // White
      { xyz: { x: 0.4124, y: 0.2126, z: 0.01933 }, expected: { r: 255, g: 0, b: 0 } }, // Red
      { xyz: { x: 0.3576, y: 0.7152, z: 0.1192 }, expected: { r: 0, g: 255, b: 0 } }, // Green
      { xyz: { x: 0.1805, y: 0.0722, z: 0.9505 }, expected: { r: 0, g: 0, b: 255 } }, // Blue
      { xyz: { x: 0.5381, y: 0.7874, z: 1.0697 }, expected: { r: 0, g: 255, b: 255 } }, // Cyan
      { xyz: { x: 0.5929, y: 0.2848, z: 0.9699 }, expected: { r: 255, g: 0, b: 255 } }, // Magenta
      { xyz: { x: 0.77, y: 0.9278, z: 0.1385 }, expected: { r: 255, g: 255, b: 0 } }, // Yellow
    ])('should convert XYZ(%o) to RGB(%o)', ({ xyz, expected }) => {
      // Act
      const actual = toRGB(xyz);

      // Assert
      expect(actual.r).toBe(expected.r);
      expect(actual.g).toBe(expected.g);
      expect(actual.b).toBe(expected.b);
    });

    it.each([
      { x: NaN, y: 0, z: 0 },
      { x: Infinity, y: 0, z: 0 },
      { x: -Infinity, y: 0, z: 0 },
      { x: 0, y: NaN, z: 0 },
      { x: 0, y: Infinity, z: 0 },
      { x: 0, y: -Infinity, z: 0 },
      { x: 0, y: 0, z: NaN },
      { x: 0, y: 0, z: Infinity },
      { x: 0, y: 0, z: -Infinity },
    ])('should throw an AssertionError if the x, y, or z component(%o) is not a finite number', (xyz) => {
      // Assert
      expect(() => {
        // Act
        toRGB(xyz);
      }).toThrowError(AssertionError);
    });
  });
});

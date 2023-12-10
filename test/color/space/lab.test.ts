import { clampA, clampB, clampL, fromXYZ, toXYZ } from '@internal/color/space/lab';
import { AssertionError } from '@internal/utils';
import { describe, expect, it } from 'vitest';

describe('CIELab', () => {
  describe('clampL', () => {
    it.each([
      { value: -1, expected: 0 },
      { value: 0, expected: 0 },
      { value: 50, expected: 50 },
      { value: 100, expected: 100 },
      { value: 101, expected: 100 },
    ])('should return clamped value($expected) when the value is $value', ({ value, expected }) => {
      // Act
      const actual = clampL(value);

      // Assert
      expect(actual).toEqual(expected);
    });
  });

  describe('clampA', () => {
    it.each([
      { value: -129, expected: -128 },
      { value: -128, expected: -128 },
      { value: 0, expected: 0 },
      { value: 128, expected: 128 },
      { value: 129, expected: 128 },
    ])('should return clamped value($expected) when the value is $value', ({ value, expected }) => {
      // Act
      const actual = clampA(value);

      // Assert
      expect(actual).toEqual(expected);
    });
  });

  describe('clampB', () => {
    it.each([
      { value: -129, expected: -128 },
      { value: -128, expected: -128 },
      { value: 0, expected: 0 },
      { value: 128, expected: 128 },
      { value: 129, expected: 128 },
    ])('should return clamped value($expected) when the value is $value', ({ value, expected }) => {
      // Act
      const actual = clampB(value);

      // Assert
      expect(actual).toEqual(expected);
    });
  });

  describe('fromXYZ', () => {
    it.each([
      { xyz: { x: 0.0, y: 0.0, z: 0.0 }, expected: { l: 0.0, a: 0.0, b: 0.0 } }, // Black
      { xyz: { x: 0.9505, y: 1.0, z: 1.089 }, expected: { l: 100.0, a: 0.0053, b: -0.0104 } }, // White
      { xyz: { x: 0.4124, y: 0.2126, z: 0.0193 }, expected: { l: 53.2329, a: 80.1093, b: 67.2201 } }, // Red
      { xyz: { x: 0.3576, y: 0.7152, z: 0.1192 }, expected: { l: 87.737, a: -86.1846, b: 83.1812 } }, // Green
      { xyz: { x: 0.1805, y: 0.0722, z: 0.9505 }, expected: { l: 32.3026, a: 79.1967, b: -107.8637 } }, // Blue
      { xyz: { x: 0.5381, y: 0.7874, z: 1.0697 }, expected: { l: 91.1165, a: -48.0796, b: -14.1381 } }, // Cyan
      { xyz: { x: 0.5929, y: 0.2848, z: 0.9698 }, expected: { l: 60.3199, a: 98.2542, b: -60.843 } }, // Magenta
      { xyz: { x: 0.77, y: 0.9278, z: 0.1385 }, expected: { l: 97.1382, a: -21.5559, b: 94.4825 } }, // Yellow
    ])('should convert XYZ(%o) to LAB(%o)', ({ xyz, expected }) => {
      // Act
      const actual = fromXYZ(xyz);

      // Assert
      expect(actual.l).toBeCloseTo(expected.l, 4);
      expect(actual.a).toBeCloseTo(expected.a, 4);
      expect(actual.b).toBeCloseTo(expected.b, 4);
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
        fromXYZ(xyz);
      }).toThrowError(AssertionError);
    });
  });

  describe('toXYZ', () => {
    it.each([
      { lab: { l: 0.0, a: 0.0, b: 0.0 }, expected: { x: 0.0, y: 0.0, z: 0.0 } }, // Black
      { lab: { l: 100.0, a: 0.0, b: 0.0254 }, expected: { x: 0.9505, y: 1.0, z: 1.0884 } }, // White
      { lab: { l: 53.2371, a: 80.1106, b: 67.2237 }, expected: { x: 0.4125, y: 0.2126, z: 0.0193 } }, // Red
      { lab: { l: 87.7355, a: -86.1822, b: 83.1866 }, expected: { x: 0.3576, y: 0.7152, z: 0.1192 } }, // Green
      { lab: { l: 32.3008, a: 79.1952, b: -107.8554 }, expected: { x: 0.1805, y: 0.0722, z: 0.9503 } }, // Blue
      { lab: { l: 91.1132, a: -48.0875, b: -14.1312 }, expected: { x: 0.538, y: 0.7873, z: 1.0695 } }, // Cyan
      { lab: { l: 60.3242, a: 98.2557, b: -60.8249 }, expected: { x: 0.593, y: 0.2848, z: 0.9696 } }, // Magenta
      { lab: { l: 97.1393, a: -21.5537, b: 94.4896 }, expected: { x: 0.77, y: 0.9278, z: 0.1385 } }, // Yellow
    ])('should convert LAB(%o) to XYZ(%o)', ({ lab, expected }) => {
      // Act
      const actual = toXYZ(lab);

      // Assert
      expect(actual.x).toBeCloseTo(expected.x, 4);
      expect(actual.y).toBeCloseTo(expected.y, 4);
      expect(actual.z).toBeCloseTo(expected.z, 4);
    });

    it.each([
      { l: NaN, a: 0, b: 0 },
      { l: Infinity, a: 0, b: 0 },
      { l: -Infinity, a: 0, b: 0 },
      { l: 0, a: NaN, b: 0 },
      { l: 0, a: Infinity, b: 0 },
      { l: 0, a: -Infinity, b: 0 },
      { l: 0, a: 0, b: NaN },
      { l: 0, a: 0, b: Infinity },
      { l: 0, a: 0, b: -Infinity },
    ])('should throw an AssertionError if the l, a, or b component(%o) is not a finite number', (lab) => {
      // Assert
      expect(() => {
        // Act
        toXYZ(lab);
      }).toThrowError(AssertionError);
    });
  });
});

import { describe, expect, it } from 'vitest';

import { asPackedColor } from './utils';
import { clampX, clampY, clampZ, XYZColorSpace } from './xyz';

describe('xyz', () => {
  describe('clampX', () => {
    it.each([
      { value: NaN, expected: 0.0 },
      { value: -0.01, expected: 0.0 },
      { value: 0.0, expected: 0.0 },
      { value: 0.01, expected: 0.01 },
      { value: 0.25, expected: 0.25 },
      { value: 0.95, expected: 0.95 },
      { value: 0.950456, expected: 0.950456 },
      { value: 0.950457, expected: 0.950456 },
    ])('should clamp value($value) to $expected', ({ value, expected }) => {
      // Act
      const actual = clampX(value);

      // Assert
      expect(actual).toEqual(expected);
    });
  });

  describe('clampY', () => {
    it.each([
      { value: NaN, expected: 0.0 },
      { value: -0.01, expected: 0.0 },
      { value: 0.0, expected: 0.0 },
      { value: 0.01, expected: 0.01 },
      { value: 0.25, expected: 0.25 },
      { value: 0.99, expected: 0.99 },
      { value: 1.0, expected: 1.0 },
      { value: 1.01, expected: 1.0 },
    ])('should clamp value($value) to $expected', ({ value, expected }) => {
      // Act
      const actual = clampY(value);

      // Assert
      expect(actual).toEqual(expected);
    });
  });

  describe('clampZ', () => {
    it.each([
      { value: NaN, expected: 0.0 },
      { value: -0.01, expected: 0.0 },
      { value: 0.0, expected: 0.0 },
      { value: 0.01, expected: 0.01 },
      { value: 0.25, expected: 0.25 },
      { value: 1.0, expected: 1.0 },
      { value: 1.088644, expected: 1.088644 },
      { value: 1.088645, expected: 1.088644 },
    ])('should clamp value($value) to $expected', ({ value, expected }) => {
      // Act
      const actual = clampZ(value);

      // Assert
      expect(actual).toEqual(expected);
    });
  });

  const fixtures = [
    { value: 0x00000000, x: 0.0, y: 0.0, z: 0.0, opacity: 0.0 },
    { value: 0x00000080, x: 0.0, y: 0.0, z: 0.0, opacity: 0.5 },
    { value: 0x000000ff, x: 0.0, y: 0.0, z: 0.0, opacity: 1.0 },
    { value: 0xff0000ff, x: 0.41246, y: 0.21267, z: 0.01933, opacity: 1.0 },
    { value: 0x00ff00ff, x: 0.35758, y: 0.71515, z: 0.11919, opacity: 1.0 },
    { value: 0x007fffff, x: 0.256394, y: 0.223987, z: 0.975798, opacity: 1.0 },
    { value: 0x0000ffff, x: 0.18044, y: 0.07217, z: 0.9503, opacity: 1.0 },
    { value: 0xffffffff, x: 0.95047, y: 1.0, z: 1.08883, opacity: 1.0 },
  ];

  describe('encode', () => {
    it.each(fixtures)(
      'should encode XYZ($x, $y, $z, $opacity) to packed value($value)',
      ({ x, y, z, opacity, value }) => {
        // Act
        const actual = XYZColorSpace.encode({ x, y, z, opacity });

        // Assert
        expect(actual).toEqual(value);
      },
    );
  });

  describe('decode', () => {
    it.each(fixtures)('should decode $value to XYZ($x, $y, $z, $opacity)', ({ value, x, y, z, opacity }) => {
      // Act
      const packed = asPackedColor(value);
      const actual = XYZColorSpace.decode(packed);

      // Assert
      expect(actual.x).toBeCloseTo(x);
      expect(actual.y).toBeCloseTo(y);
      expect(actual.z).toBeCloseTo(z);
      expect(actual.opacity).toBeCloseTo(opacity);
    });
  });
});

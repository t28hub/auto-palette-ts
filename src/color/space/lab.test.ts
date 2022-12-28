import { describe, expect, it } from 'vitest';

import { clampA, clampB, clampL, LabColorSpace } from './lab';
import { asPackedColor } from './utils';

describe('lab', () => {
  describe('clampL', () => {
    it.each([
      { value: NaN, expected: 0 },
      { value: -1, expected: 0 },
      { value: 0, expected: 0 },
      { value: 1, expected: 1 },
      { value: 99, expected: 99 },
      { value: 100, expected: 100 },
      { value: 101, expected: 100 },
    ])('should clamp value($value) to $expected', ({ value, expected }) => {
      // Act
      const actual = clampL(value);

      // Assert
      expect(actual).toEqual(expected);
    });
  });

  describe('clampA', () => {
    it.each([
      { value: NaN, expected: -128 },
      { value: -129, expected: -128 },
      { value: -128, expected: -128 },
      { value: 0, expected: 0 },
      { value: 126, expected: 126 },
      { value: 127, expected: 127 },
      { value: 128, expected: 127 },
    ])('should clamp value($value) to $expected', ({ value, expected }) => {
      // Act
      const actual = clampA(value);

      // Assert
      expect(actual).toEqual(expected);
    });
  });

  describe('clampB', () => {
    it.each([
      { value: NaN, expected: -128 },
      { value: -129, expected: -128 },
      { value: -128, expected: -128 },
      { value: 0, expected: 0 },
      { value: 126, expected: 126 },
      { value: 127, expected: 127 },
      { value: 128, expected: 127 },
    ])('should clamp value($value) to $expected', ({ value, expected }) => {
      // Act
      const actual = clampB(value);

      // Assert
      expect(actual).toEqual(expected);
    });
  });

  const fixtures = [
    { value: 0x00000000, l: 0.0, a: 0.0, b: 0.0, opacity: 0.0 },
    { value: 0x00000080, l: 0.0, a: 0.0, b: 0.0, opacity: 0.5 },
    { value: 0x000000ff, l: 0.0, a: 0.0, b: 0.0, opacity: 1.0 },
    { value: 0xff0000ff, l: 53.23, a: 80.11, b: 67.22, opacity: 1.0 },
    { value: 0x00ff00ff, l: 87.74, a: -86.18, b: 83.18, opacity: 1.0 },
    { value: 0x007fffff, l: 54.45, a: 19.41, b: -71.36, opacity: 1.0 },
    { value: 0x0000ffff, l: 32.3, a: 79.2, b: -107.86, opacity: 1.0 },
    { value: 0xffffff00, l: 100.0, a: 0.01, b: -0.01, opacity: 0.0 },
    { value: 0xffffffff, l: 100.0, a: 0.01, b: -0.01, opacity: 1.0 },
  ];

  describe('encode', () => {
    it.each(fixtures)(
      'should encode Lab($l, $a, $b, $opacity) to packed value($value)',
      ({ l, a, b, opacity, value }) => {
        // Act
        const actual = LabColorSpace.encode({ l, a, b, opacity });

        // Assert
        expect(actual).toEqual(value);
      },
    );
  });

  describe('decode', () => {
    it.each(fixtures)('should decode $value to Lab($l, $a, $b, $opacity)', ({ value, l, a, b, opacity }) => {
      // Act
      const packed = asPackedColor(value);
      const actual = LabColorSpace.decode(packed);

      // Assert
      expect(actual.l).toBeCloseTo(l, 1);
      expect(actual.a).toBeCloseTo(a, 1);
      expect(actual.b).toBeCloseTo(b, 1);
      expect(actual.opacity).toBeCloseTo(opacity);
    });
  });
});

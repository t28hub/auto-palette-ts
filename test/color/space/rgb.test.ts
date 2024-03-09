import { clampValue, fromHexString, toHexString } from '@internal/color/space/rgb';
import { AssertionError } from '@internal/utils';
import { describe, expect, it } from 'vitest';

describe('RGB', () => {
  describe('clampValue', () => {
    it.each([
      { value: -1, expected: 0 },
      { value: 0, expected: 0 },
      { value: 128, expected: 128 },
      { value: 255, expected: 255 },
      { value: 256, expected: 255 },
    ])('should return clamped value($expected) when the value is $value', ({ value, expected }) => {
      // Act
      const actual = clampValue(value);

      // Assert
      expect(actual).toEqual(expected);
    });
  });

  describe('fromHexString', () => {
    it.each([
      { value: '#000', expected: { r: 0, g: 0, b: 0 } },
      { value: '#FFF', expected: { r: 255, g: 255, b: 255 } },
      { value: '#F00', expected: { r: 255, g: 0, b: 0 } },
      { value: '#0F0', expected: { r: 0, g: 255, b: 0 } },
      { value: '#00F', expected: { r: 0, g: 0, b: 255 } },
      { value: '#FF0', expected: { r: 255, g: 255, b: 0 } },
      { value: '#0FF', expected: { r: 0, g: 255, b: 255 } },
      { value: '#F0F', expected: { r: 255, g: 0, b: 255 } },
      { value: '#000000', expected: { r: 0, g: 0, b: 0 } },
      { value: '#FFFFFF', expected: { r: 255, g: 255, b: 255 } },
      { value: '#FF0000', expected: { r: 255, g: 0, b: 0 } },
      { value: '#00FF00', expected: { r: 0, g: 255, b: 0 } },
      { value: '#0000FF', expected: { r: 0, g: 0, b: 255 } },
      { value: '#FFFF00', expected: { r: 255, g: 255, b: 0 } },
      { value: '#00FFFF', expected: { r: 0, g: 255, b: 255 } },
      { value: '#FF00FF', expected: { r: 255, g: 0, b: 255 } },
    ])('should return $expected when the value is $value', ({ value, expected }) => {
      // Act
      const actual = fromHexString(value);

      // Assert
      expect(actual).toEqual(expected);
    });

    it.each(['000000', '#00000', '#0000', '#00G', 'FF0050', '#FF00GA'])(
      'should throw an AssertionError when the value is %s',
      (value) => {
        // Assert
        expect(() => {
          // Act
          fromHexString(value);
        }).toThrow(AssertionError);
      },
    );
  });

  describe('toHexString', () => {
    it.each([
      { r: 0, g: 0, b: 0, expected: '#000000' },
      { r: 255, g: 255, b: 255, expected: '#FFFFFF' },
      { r: 255, g: 0, b: 0, expected: '#FF0000' },
      { r: 0, g: 255, b: 0, expected: '#00FF00' },
      { r: 0, g: 0, b: 255, expected: '#0000FF' },
      { r: 255, g: 255, b: 0, expected: '#FFFF00' },
      { r: 0, g: 255, b: 255, expected: '#00FFFF' },
      { r: 255, g: 0, b: 255, expected: '#FF00FF' },
    ])('should return $expected when the color is ($r, $g, $b)', ({ r, g, b, expected }) => {
      // Act
      const actual = toHexString({ r, g, b });

      // Assert
      expect(actual).toEqual(expected);
    });

    it.each([
      { r: Number.NaN, g: 0, b: 0 },
      { r: Number.POSITIVE_INFINITY, g: 0, b: 0 },
      { r: Number.NEGATIVE_INFINITY, g: 0, b: 0 },
      { r: 0, g: Number.NaN, b: 0 },
      { r: 0, g: Number.POSITIVE_INFINITY, b: 0 },
      { r: 0, g: Number.NEGATIVE_INFINITY, b: 0 },
      { r: 0, g: 0, b: Number.NaN },
      { r: 0, g: 0, b: Number.POSITIVE_INFINITY },
      { r: 0, g: 0, b: Number.NEGATIVE_INFINITY },
    ])('should throw an AssertionError when the color is ($r, $g, $b)', ({ r, g, b }) => {
      // Assert
      expect(() => {
        // Act
        toHexString({ r, g, b });
      }).toThrow(AssertionError);
    });
  });
});

import { describe, expect, it } from 'vitest';

import { RGBSpace } from './rgb';

describe('RGBSpace', () => {
  describe('clampValue', () => {
    it.each([
      { value: -1, expected: 0 },
      { value: 0, expected: 0 },
      { value: 128, expected: 128 },
      { value: 255, expected: 255 },
      { value: 256, expected: 255 },
    ])('should return clamped value($expected) when the value is $value', ({ value, expected }) => {
      // Act
      const actual = RGBSpace.clampValue(value);

      // Assert
      expect(actual).toEqual(expected);
    });
  });

  describe('fromHexString', () => {
    it.each([
      { value: '#000000', expected: { r: 0, g: 0, b: 0 } },
      { value: '#ffffff', expected: { r: 255, g: 255, b: 255 } },
      { value: '#ff0000', expected: { r: 255, g: 0, b: 0 } },
      { value: '#00ff00', expected: { r: 0, g: 255, b: 0 } },
      { value: '#0000ff', expected: { r: 0, g: 0, b: 255 } },
      { value: '#ffff00', expected: { r: 255, g: 255, b: 0 } },
      { value: '#00ffff', expected: { r: 0, g: 255, b: 255 } },
      { value: '#ff00ff', expected: { r: 255, g: 0, b: 255 } },
    ])('should return $expected when the value is $value', ({ value, expected }) => {
      // Act
      const actual = RGBSpace.fromHexString(value);

      // Assert
      expect(actual).toEqual(expected);
    });

    it.each(['000000', '#00000', '#0000', 'ff0050', '#ff00gg'])(
      'should throw TypeError when the value is %s',
      (value) => {
        // Assert
        expect(() => {
          // Act
          RGBSpace.fromHexString(value);
        }).toThrow(TypeError);
      },
    );
  });

  describe('toHexString', () => {
    it.each([
      { r: 0, g: 0, b: 0, expected: '#000000' },
      { r: 255, g: 255, b: 255, expected: '#ffffff' },
      { r: 255, g: 0, b: 0, expected: '#ff0000' },
      { r: 0, g: 255, b: 0, expected: '#00ff00' },
      { r: 0, g: 0, b: 255, expected: '#0000ff' },
      { r: 255, g: 255, b: 0, expected: '#ffff00' },
      { r: 0, g: 255, b: 255, expected: '#00ffff' },
      { r: 255, g: 0, b: 255, expected: '#ff00ff' },
    ])('should return $expected when the color is ($r, $g, $b)', ({ r, g, b, expected }) => {
      // Act
      const actual = RGBSpace.toHexString({ r, g, b });

      // Assert
      expect(actual).toEqual(expected);
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
    ])('should throw TypeError when the color is ($r, $g, $b)', ({ r, g, b }) => {
      // Assert
      expect(() => {
        // Act
        RGBSpace.toHexString({ r, g, b });
      }).toThrow(TypeError);
    });
  });
});

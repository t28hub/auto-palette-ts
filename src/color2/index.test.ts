import { describe, expect, it } from 'vitest';

import { Color } from './index';

describe('Color', () => {
  describe('constructor', () => {
    it('should create a color with valid values', () => {
      // Act
      const actual = new Color(50, 0, 0);

      // Assert
      expect(actual).toMatchObject({
        l: 50,
        a: 0,
        b: 0,
      });
    });

    it.each([
      [-1, 0, 0, { l: 0, a: 0, b: 0 }],
      [101, 0, 0, { l: 100, a: 0, b: 0 }],
      [0, -129, 0, { l: 0, a: -128, b: 0 }],
      [0, 128, 0, { l: 0, a: 127, b: 0 }],
      [0, 0, -129, { l: 0, a: 0, b: -128 }],
      [0, 0, 128, { l: 0, a: 0, b: 127 }],
    ])('should clamp the component if the l(%d), a(%d), or b(%d) is out of range', (l, a, b, expected) => {
      // Act
      const actual = new Color(l, a, b);

      // Assert
      expect(actual).toMatchObject(expected);
    });

    it.each([
      [NaN, 0, 0],
      [Infinity, 0, 0],
      [-Infinity, 0, 0],
      [0, NaN, 0],
      [0, Infinity, 0],
      [0, -Infinity, 0],
      [0, 0, NaN],
      [0, 0, Infinity],
      [0, 0, -Infinity],
    ])('should throw an error if the l(%d), a(%d), or b(%d) is not finite number', (l, a, b) => {
      // Assert
      expect(() => {
        // Act
        new Color(l, a, b);
      }).toThrowError(TypeError);
    });
  });

  describe('isLight', () => {
    it('should return true for light colors', () => {
      // Act
      const color = new Color(50.1, 0, 0);
      const actual = color.isLight;

      // Assert
      expect(actual).toBeTruthy();
    });

    it('should return false for dark colors', () => {
      // Act
      const color = new Color(50, 0, 0);
      const actual = color.isLight;

      // Assert
      expect(actual).toBeFalsy();
    });
  });

  describe('isDark', () => {
    it('should return true for dark colors', () => {
      // Act
      const color = new Color(50, 0, 0);
      const actual = color.isDark;

      // Assert
      expect(actual).toBeTruthy();
    });

    it('should return false for light colors', () => {
      const color = new Color(50.1, 0, 0);
      const actual = color.isDark;

      // Assert
      expect(actual).toBeFalsy();
    });
  });

  describe('luminance', () => {
    it('should return the luminance of the color', () => {
      // Act
      const color = new Color(50, 0, 0);
      const actual = color.luminance;

      // Assert
      expect(actual).toEqual(50);
    });
  });

  describe('chroma', () => {
    it('should return the chroma of the color', () => {
      // Act
      const color = new Color(50, 3, 4);
      const actual = color.chroma();

      // Assert
      expect(actual).toEqual(5);
    });
  });

  describe('hue', () => {
    it('should return the hue of the color', () => {
      // Act
      const color = new Color(50, 0, 1);
      const actual = color.hue();

      // Assert
      expect(actual).toEqual(90);
    });
  });

  describe('toRGB', () => {
    it.each([
      { l: 0, a: 0, b: 0, expected: { r: 0, g: 0, b: 0 } }, // Black
      { l: 100, a: 0, b: 0, expected: { r: 255, g: 255, b: 255 } }, // White
      { l: 53.2371, a: 80.1106, b: 67.2237, expected: { r: 255, g: 0, b: 0 } }, // Red
      { l: 87.7355, a: -86.1822, b: 83.1866, expected: { r: 0, g: 255, b: 0 } }, // Green
      { l: 32.3008, a: 79.1952, b: -107.8554, expected: { r: 0, g: 0, b: 255 } }, // Blue
      { l: 91.1132, a: -48.0875, b: -14.1312, expected: { r: 0, g: 255, b: 255 } }, // Cyan
      { l: 60.3242, a: 98.2557, b: -60.8249, expected: { r: 255, g: 0, b: 255 } }, // Magenta
      { l: 97.1393, a: -21.5537, b: 94.4896, expected: { r: 255, g: 255, b: 0 } }, // Yellow
    ])('should convert color($l, $a, $b%) to RGB($expected)', ({ l, a, b, expected }) => {
      // Act
      const color = new Color(l, a, b);
      const actual = color.toRGB();

      // Assert
      expect(actual).toMatchObject(expected);
    });
  });

  describe('toHexString', () => {
    it.each([
      { l: 0, a: 0, b: 0, expected: '#000000' }, // Black
      { l: 100, a: 0, b: 0, expected: '#ffffff' }, // White
      { l: 53.2371, a: 80.1106, b: 67.2237, expected: '#ff0000' }, // Red
      { l: 87.7355, a: -86.1822, b: 83.1866, expected: '#00ff00' }, // Green
      { l: 32.3008, a: 79.1952, b: -107.8554, expected: '#0000ff' }, // Blue
      { l: 91.1132, a: -48.0875, b: -14.1312, expected: '#00ffff' }, // Cyan
      { l: 60.3242, a: 98.2557, b: -60.8249, expected: '#ff00ff' }, // Magenta
      { l: 97.1393, a: -21.5537, b: 94.4896, expected: '#ffff00' }, // Yellow
    ])('should convert color($l, $a, $b) to hex decimal string($expected)', ({ l, a, b, expected }) => {
      // Act
      const color = new Color(l, a, b);
      const actual = color.toHexString();

      // Assert
      expect(actual).toEqual(expected);
    });
  });
});

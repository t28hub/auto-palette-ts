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
      expect(actual).toBe(50);
    });
  });

  describe('chroma', () => {
    it('should return the chroma of the color', () => {
      // Act
      const color = new Color(50, 3, 4);
      const actual = color.chroma();

      // Assert
      expect(actual).toBe(5);
    });
  });

  describe('hue', () => {
    it('should return the hue of the color', () => {
      // Act
      const color = new Color(50, 0, 1);
      const actual = color.hue();

      // Assert
      expect(actual).toBe(90);
    });
  });
});

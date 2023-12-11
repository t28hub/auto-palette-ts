import { Color, cie94 } from 'auto-palette';
import { describe, expect, it } from 'vitest';

describe('Color', () => {
  describe('clone', () => {
    it('should return a cloned color', () => {
      // Act
      const color = Color.fromLAB({ l: 50, a: 0, b: 0 });
      const actual = color.clone();

      // Assert
      expect(actual).not.toBe(color);
      expect(actual).toMatchObject(color);
    });
  });

  describe('isLight', () => {
    it('should return true for light colors', () => {
      // Act
      const color = Color.fromLAB({ l: 50.1, a: 0, b: 0 });
      const actual = color.isLight();

      // Assert
      expect(actual).toBeTruthy();
    });

    it('should return false for dark colors', () => {
      // Act
      const color = Color.fromLAB({ l: 50, a: 0, b: 0 });
      const actual = color.isLight();

      // Assert
      expect(actual).toBeFalsy();
    });
  });

  describe('isDark', () => {
    it('should return true for dark colors', () => {
      // Act
      const color = Color.fromLAB({ l: 50, a: 0, b: 0 });
      const actual = color.isDark();

      // Assert
      expect(actual).toBeTruthy();
    });

    it('should return false for light colors', () => {
      const color = Color.fromLAB({ l: 50.1, a: 0, b: 0 });
      const actual = color.isDark();

      // Assert
      expect(actual).toBeFalsy();
    });
  });

  describe('lightness', () => {
    it('should return the lightness of the color', () => {
      // Act
      const color = Color.fromLAB({ l: 50, a: 0, b: 0 });
      const actual = color.lightness();

      // Assert
      expect(actual).toEqual(50);
    });
  });

  describe('chroma', () => {
    it('should return the chroma of the color', () => {
      // Act
      const color = Color.fromLAB({ l: 50, a: 3, b: 4 });
      const actual = color.chroma();

      // Assert
      expect(actual).toEqual(5);
    });
  });

  describe('hue', () => {
    it('should return the hue of the color', () => {
      // Act
      const color = Color.fromLAB({ l: 50, a: 0, b: 1 });
      const actual = color.hue();

      // Assert
      expect(actual).toEqual(90);
    });
  });

  describe('differenceTo', () => {
    it('should compute the color difference between two colors', () => {
      // Act
      const color1 = Color.fromLAB({ l: 50, a: 0, b: 0 });
      const color2 = Color.fromLAB({ l: 100, a: 0, b: 0 });
      const actual = color1.differenceTo(color2);

      // Assert
      expect(actual).toBeCloseTo(36.5193);
    });

    it('should compute the color difference between two colors using the specified formula', () => {
      // Act
      const color1 = Color.fromLAB({ l: 30, a: 0, b: 0 });
      const color2 = Color.fromLAB({ l: 100, a: 0, b: 0 });
      const actual = color1.differenceTo(color2, cie94);

      // Assert
      expect(actual).toEqual(70);
    });
  });

  describe('toString', () => {
    it.each([
      { l: 0, a: 0, b: 0, expected: '#000000' }, // Black
      { l: 100, a: 0, b: 0, expected: '#FFFFFF' }, // White
      { l: 53.2371, a: 80.1106, b: 67.2237, expected: '#FF0000' }, // Red
      { l: 87.7355, a: -86.1822, b: 83.1866, expected: '#00FF00' }, // Green
      { l: 32.3008, a: 79.1952, b: -107.8554, expected: '#0000FF' }, // Blue
      { l: 91.1132, a: -48.0875, b: -14.1312, expected: '#00FFFF' }, // Cyan
      { l: 60.3242, a: 98.2557, b: -60.8249, expected: '#FF00FF' }, // Magenta
      { l: 97.1393, a: -21.5537, b: 94.4896, expected: '#FFFF00' }, // Yellow
    ])('should convert color($l, $a, $b) to hex decimal string($expected)', ({ l, a, b, expected }) => {
      // Act
      const color = Color.fromLAB({ l, a, b });
      const actual = color.toString();

      // Assert
      expect(actual).toEqual(expected);
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
      const color = Color.fromLAB({ l, a, b });
      const actual = color.toRGB();

      // Assert
      expect(actual).toMatchObject(expected);
    });
  });

  describe('toHSL', () => {
    it.each([
      { l: 0, a: 0, b: 0, expected: { h: 0, s: 0.0, l: 0.0 } }, // Black
      { l: 100, a: 0, b: 0, expected: { h: 0, s: 0.0, l: 1.0 } }, // White
      { l: 53.2371, a: 80.1106, b: 67.2237, expected: { h: 0, s: 1.0, l: 0.5 } }, // Red
      { l: 87.7355, a: -86.1822, b: 83.1866, expected: { h: 120, s: 1.0, l: 0.5 } }, // Green
      { l: 32.3008, a: 79.1952, b: -107.8554, expected: { h: 240, s: 1.0, l: 0.5 } }, // Blue
      { l: 91.1132, a: -48.0875, b: -14.1312, expected: { h: 180, s: 1.0, l: 0.5 } }, // Cyan
      { l: 60.3242, a: 98.2557, b: -60.8249, expected: { h: 300, s: 1.0, l: 0.5 } }, // Magenta
      { l: 97.1393, a: -21.5537, b: 94.4896, expected: { h: 60, s: 1.0, l: 0.5 } }, // Yellow
    ])('should convert color($l, $a, $b%) to HSL($expected)', ({ l, a, b, expected }) => {
      // Act
      const color = Color.fromLAB({ l, a, b });
      const actual = color.toHSL();

      // Assert
      expect(actual).toMatchObject(expected);
    });
  });

  describe('toLAB', () => {
    it.each([
      { l: 0, a: 0, b: 0 },
      { l: 100, a: 0, b: 0 },
      { l: 53.2371, a: 80.1106, b: 67.2237 },
      { l: 87.7355, a: -86.1822, b: 83.1866 },
      { l: 32.3008, a: 79.1952, b: -107.8554 },
      { l: 91.1132, a: -48.0875, b: -14.1312 },
      { l: 60.3242, a: 98.2557, b: -60.8249 },
      { l: 97.1393, a: -21.5537, b: 94.4896 },
    ])('should return the color($l, $a, $b) in CIELAB color space', ({ l, a, b }) => {
      // Act
      const color = Color.fromLAB({ l, a, b });
      const actual = color.toLAB();

      // Assert
      expect(actual).toMatchObject({ l, a, b });
    });
  });

  describe('fromRGB', () => {
    it.each([
      { rgb: { r: 0, g: 0, b: 0 }, expected: { l: 0, a: 0, b: 0 } }, // Black
      { rgb: { r: 255, g: 255, b: 255 }, expected: { l: 100, a: 0, b: 0 } }, // White
      { rgb: { r: 255, g: 0, b: 0 }, expected: { l: 53.2408, a: 80.0925, b: 67.2032 } }, // Red
      { rgb: { r: 0, g: 255, b: 0 }, expected: { l: 87.7347, a: -86.1827, b: 83.1793 } }, // Green
      { rgb: { r: 0, g: 0, b: 255 }, expected: { l: 32.297, a: 79.1875, b: -107.8602 } }, // Blue
    ])('should create Color($expected) from RGB($rgb)', ({ rgb, expected }) => {
      // Act
      const actual = Color.fromRGB(rgb);

      // Assert
      expect(actual).toBeSimilarColor(Color.fromLAB(expected));
    });
  });

  describe('fromHSL', () => {
    it.each([
      { hsl: { h: 0, s: 0, l: 0 }, expected: { l: 0, a: 0, b: 0 } }, // Black
      { hsl: { h: 0, s: 0, l: 1 }, expected: { l: 100, a: 0, b: 0 } }, // White
      { hsl: { h: 0, s: 1, l: 0.5 }, expected: { l: 53.2408, a: 80.0925, b: 67.2032 } }, // Red
      { hsl: { h: 120, s: 1, l: 0.5 }, expected: { l: 87.7347, a: -86.1827, b: 83.1793 } }, // Green
      { hsl: { h: 240, s: 1, l: 0.5 }, expected: { l: 32.297, a: 79.1875, b: -107.8602 } }, // Blue
    ])('should create Color($expected) from HSL($hsl)', ({ hsl, expected }) => {
      // Act
      const actual = Color.fromHSL(hsl);

      // Assert
      expect(actual).toBeSimilarColor(Color.fromLAB(expected));
    });
  });

  describe('fromLAB', () => {
    it.each([
      { lab: { l: 0, a: 0, b: 0 }, expected: { l: 0, a: 0, b: 0 } }, // Black
      { lab: { l: 100, a: 0, b: 0 }, expected: { l: 100, a: 0, b: 0 } }, // White
      { lab: { l: 53.2408, a: 80.0925, b: 67.2032 }, expected: { l: 53.2408, a: 80.0925, b: 67.2032 } }, // Red
      { lab: { l: 87.7347, a: -86.1827, b: 83.1793 }, expected: { l: 87.7347, a: -86.1827, b: 83.1793 } }, // Green
      { lab: { l: 32.297, a: 79.1875, b: -107.8602 }, expected: { l: 32.297, a: 79.1875, b: -107.8602 } }, // Blue
    ])('should create Color($expected) from LAB($lab)', ({ lab, expected }) => {
      // Act
      const actual = Color.fromLAB(lab);

      // Assert
      expect(actual).toEqual(expected);
    });
  });

  describe('fromString', () => {
    it.each([
      { value: '#000000', expected: { l: 0, a: 0, b: 0 } }, // Black
      { value: '#FFFFFF', expected: { l: 100, a: 0, b: 0 } }, // White
      { value: '#FF0000', expected: { l: 53.2408, a: 80.0925, b: 67.2032 } }, // Red
      { value: '#00FF00', expected: { l: 87.7347, a: -86.1827, b: 83.1793 } }, // Green
      { value: '#0000FF', expected: { l: 32.297, a: 79.1875, b: -107.8602 } }, // Blue
    ])('should create Color($expected) from string($value)', ({ value, expected }) => {
      // Act
      const actual = Color.fromString(value);

      // Assert
      expect(actual).toBeSimilarColor(Color.fromLAB(expected));
    });
  });
});

import { HSL, clampH, clampL, clampS } from './hsl';
import { asPackedColor } from './model';

describe('hsl', () => {
  describe('clampH', () => {
    it.each([
      { value: 0, expected: 0 },
      { value: 60, expected: 60 },
      { value: 300, expected: 300 },
      { value: 359, expected: 359 },
      { value: 360, expected: 0 },
      { value: 361, expected: 1 },
      { value: 480, expected: 120 },
      { value: 1080, expected: 0 },
      { value: -1, expected: 359 },
      { value: -60, expected: 300 },
      { value: NaN, expected: 0 },
    ])('should clamp the value($value) to valid hue($expected)', ({ value, expected }) => {
      // Act
      const actual = clampH(value);

      // Assert
      expect(actual).toEqual(expected);
    });
  });

  describe('clampS', () => {
    it.each([
      { value: 0.0, expected: 0.0 },
      { value: 0.5, expected: 0.5 },
      { value: 1.0, expected: 1.0 },
      { value: 1.5, expected: 1.0 },
      { value: -0.5, expected: 0.0 },
      { value: NaN, expected: 0.0 },
    ])('should clamp the value($value) to valid saturation($expected)', ({ value, expected }) => {
      // Act
      const actual = clampS(value);

      // Assert
      expect(actual).toEqual(expected);
    });
  });

  describe('clampL', () => {
    it.each([
      { value: 0.0, expected: 0.0 },
      { value: 0.5, expected: 0.5 },
      { value: 1.0, expected: 1.0 },
      { value: 1.5, expected: 1.0 },
      { value: -0.5, expected: 0.0 },
      { value: NaN, expected: 0.0 },
    ])('should clamp the value($value) to valid lightness($expected)', ({ value, expected }) => {
      // Act
      const actual = clampL(value);

      // Assert
      expect(actual).toEqual(expected);
    });
  });

  const fixtures = [
    { value: 0x00000000, h: 0, s: 0.0, l: 0.0, opacity: 0.0 },
    { value: 0x00000080, h: 0, s: 0.0, l: 0.0, opacity: 0.5 },
    { value: 0x000000ff, h: 0, s: 0.0, l: 0.0, opacity: 1.0 },
    { value: 0xff0000ff, h: 0, s: 1.0, l: 0.5, opacity: 1.0 },
    { value: 0x808000ff, h: 60, s: 1.0, l: 0.25, opacity: 1.0 },
    { value: 0xffff00ff, h: 60, s: 1.0, l: 0.5, opacity: 1.0 },
    { value: 0xffff80ff, h: 60, s: 1.0, l: 0.75, opacity: 1.0 },
    { value: 0x9f9f60ff, h: 60, s: 0.25, l: 0.5, opacity: 1.0 },
    { value: 0xbfbf40ff, h: 60, s: 0.5, l: 0.5, opacity: 1.0 },
    { value: 0xdfdf20ff, h: 60, s: 0.75, l: 0.5, opacity: 1.0 },
    { value: 0xffff00ff, h: 60, s: 1.0, l: 0.5, opacity: 1.0 },
    { value: 0x00ff00ff, h: 120, s: 1.0, l: 0.5, opacity: 1.0 },
    { value: 0x00ffffff, h: 180, s: 1.0, l: 0.5, opacity: 1.0 },
    { value: 0x0000ffff, h: 240, s: 1.0, l: 0.5, opacity: 1.0 },
    { value: 0xff00ffff, h: 300, s: 1.0, l: 0.5, opacity: 1.0 },
    { value: 0x404040ff, h: 0, s: 0.0, l: 0.25, opacity: 1.0 },
    { value: 0x808080ff, h: 0, s: 0.0, l: 0.5, opacity: 1.0 },
    { value: 0xbfbfbfff, h: 0, s: 0.0, l: 0.75, opacity: 1.0 },
    { value: 0xffffffff, h: 0, s: 0.0, l: 1.0, opacity: 1.0 },
  ];

  describe('pack', () => {
    it.each(fixtures)('should pack HSL($h, $s, $l, $opacity) to $value', ({ value, h, s, l, opacity }) => {
      // Act
      const actual = HSL.pack({ h, s, l, opacity });

      // Assert
      expect(actual).toEqual(value);
    });
  });

  describe('unpack', () => {
    it.each(fixtures)('should unpack $value to HSL($h, $s, $l, $opacity)', ({ value, h, s, l, opacity }) => {
      // Act
      const packed = asPackedColor(value);
      const actual = HSL.unpack(packed);

      // Assert
      expect(actual.h).toBeCloseTo(h);
      expect(actual.s).toBeCloseTo(s);
      expect(actual.l).toBeCloseTo(l);
      expect(actual.opacity).toBeCloseTo(opacity);
    });
  });
});

import { asPackedColor } from './model';
import { clampValue, RGB } from './rgb';

describe('rgb', () => {
  describe('clampComponent', () => {
    it.each([
      { value: NaN, expected: 0 },
      { value: -255, expected: 0 },
      { value: -1, expected: 0 },
      { value: 0, expected: 0 },
      { value: 1, expected: 1 },
      { value: 128, expected: 128 },
      { value: 254, expected: 254 },
      { value: 255, expected: 255 },
      { value: 256, expected: 255 },
      { value: 1024, expected: 255 },
    ])('should return clamped value($expected) when the value is $value', ({ value, expected }) => {
      // Act
      const actual = clampValue(value);

      // Assert
      expect(actual).toEqual(expected);
    });
  });

  const fixtures = [
    { value: 0x00000000, r: 0, g: 0, b: 0, opacity: 0.0 },
    { value: 0x00000080, r: 0, g: 0, b: 0, opacity: 0.5 },
    { value: 0x000000ff, r: 0, g: 0, b: 0, opacity: 1.0 },
    { value: 0x800000ff, r: 128, g: 0, b: 0, opacity: 1.0 },
    { value: 0xff0000ff, r: 255, g: 0, b: 0, opacity: 1.0 },
    { value: 0x008000ff, r: 0, g: 128, b: 0, opacity: 1.0 },
    { value: 0x00ff00ff, r: 0, g: 255, b: 0, opacity: 1.0 },
    { value: 0x000080ff, r: 0, g: 0, b: 128, opacity: 1.0 },
    { value: 0x0000ffff, r: 0, g: 0, b: 255, opacity: 1.0 },
    { value: 0x00ffffff, r: 0, g: 255, b: 255, opacity: 1.0 },
    { value: 0xffff00ff, r: 255, g: 255, b: 0, opacity: 1.0 },
    { value: 0xff00ffff, r: 255, g: 0, b: 255, opacity: 1.0 },
    { value: 0xffffffff, r: 255, g: 255, b: 255, opacity: 1.0 },
  ];

  describe('pack', () => {
    it.each(fixtures)('should pack RGB($r, $g, $b, $opacity) to $value', ({ value, r, g, b, opacity }) => {
      // Act
      const actual = RGB.pack({ r, g, b, opacity });

      // Assert
      expect(actual).toEqual(value);
    });
  });

  describe('unpack', () => {
    it.each(fixtures)('should unpack $value to RGB($r, $g, $b, $opacity)', ({ value, r, g, b, opacity }) => {
      // Act
      const packed = asPackedColor(value);
      const actual = RGB.unpack(packed);

      // Assert
      expect(actual).toMatchObject({ r, g, b });
      expect(actual.opacity).toBeCloseTo(opacity);
    });
  });
});

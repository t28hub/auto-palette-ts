import { asPackedColor } from './model';
import { RGB } from './rgb';

describe('rgb', () => {
  const fixtures = [
    { value: 0x00000000, r: 0, g: 0, b: 0, opacity: 0.0 },
    { value: 0x80000000, r: 0, g: 0, b: 0, opacity: 0.5 },
    { value: 0xff000000, r: 0, g: 0, b: 0, opacity: 1.0 },
    { value: 0xff800000, r: 128, g: 0, b: 0, opacity: 1.0 },
    { value: 0xffff0000, r: 255, g: 0, b: 0, opacity: 1.0 },
    { value: 0xff008000, r: 0, g: 128, b: 0, opacity: 1.0 },
    { value: 0xff00ff00, r: 0, g: 255, b: 0, opacity: 1.0 },
    { value: 0xff000080, r: 0, g: 0, b: 128, opacity: 1.0 },
    { value: 0xff0000ff, r: 0, g: 0, b: 255, opacity: 1.0 },
    { value: 0xff00ffff, r: 0, g: 255, b: 255, opacity: 1.0 },
    { value: 0xffffff00, r: 255, g: 255, b: 0, opacity: 1.0 },
    { value: 0xffff00ff, r: 255, g: 0, b: 255, opacity: 1.0 },
    { value: 0xffffffff, r: 255, g: 255, b: 255, opacity: 1.0 },
  ];

  describe('decode', () => {
    it.each(fixtures)('should decode $value to RGB($r, $g, $b, $opacity)', ({ value, r, g, b, opacity }) => {
      // Act
      const packed = asPackedColor(value);
      const actual = RGB.decode(packed);

      // Assert
      expect(actual).toMatchObject({ r, g, b });
      expect(actual.opacity).toBeCloseTo(opacity);
    });
  });

  describe('encode', () => {
    it.each(fixtures)('should encode RGB($r, $g, $b, $opacity) to $value', ({ value, r, g, b, opacity }) => {
      // Act
      const actual = RGB.encode({ r, g, b, opacity });

      // Assert
      expect(actual).toEqual(value);
    });
  });
});

import { Color } from './color';
import { asPackedColor } from './model';

describe('color', () => {
  describe('constructor', () => {
    it('should create a new color', () => {
      // Act
      const actual = new Color(180, 1.0, 0.5, 1.0);

      // Assert
      expect(actual).toMatchObject({
        h: 180,
        s: 1.0,
        l: 0.5,
        opacity: 1.0,
      });
    });
  });

  describe('toString', () => {
    it('should return the string representation of this color', () => {
      // Act
      const color = new Color(60, 1.0, 0.5, 0.5);
      const actual = color.toString();

      // Assert
      expect(actual).toEqual('Color(0xffff0080)');
    });
  });

  describe('toPackedColor', () => {
    it('should return the packed color', () => {
      // Act
      const color = new Color(270, 1.0, 0.5, 0.5);
      const actual = color.toPackedColor();

      // Assert
      expect(actual).toEqual(0x8000ff80);
    });
  });

  describe('convertTo', () => {
    it('should convert this color by name of the given color model', () => {
      // Act
      const color = new Color(180, 1.0, 0.5, 0.5);
      const actual = color.convertTo('rgb');

      // Assert
      expect(actual.r).toEqual(0);
      expect(actual.g).toEqual(255);
      expect(actual.b).toEqual(255);
      expect(actual.opacity).toBeCloseTo(0.5);
    });
  });

  describe('fromPackedColor', () => {
    it.each([
      { value: 0x00000000, h: 0, s: 0, l: 0, opacity: 0.0 },
      { value: 0x00000080, h: 0, s: 0, l: 0, opacity: 0.5 },
      { value: 0x808080ff, h: 0, s: 0, l: 0.5, opacity: 1.0 },
      { value: 0xff0000ff, h: 0, s: 1.0, l: 0.5, opacity: 1.0 },
      { value: 0xffff00ff, h: 60, s: 1.0, l: 0.5, opacity: 1.0 },
      { value: 0xff00ffff, h: 300, s: 1.0, l: 0.5, opacity: 1.0 },
      { value: 0xffffffff, h: 0, s: 0, l: 1.0, opacity: 1.0 },
    ])('should create a color from PackedColor($value)', ({ value, h, s, l, opacity }) => {
      // Act
      const packed = asPackedColor(value);
      const actual = Color.fromPackedColor(packed);

      // Assert
      expect(actual.h).toBeCloseTo(h);
      expect(actual.s).toBeCloseTo(s);
      expect(actual.l).toBeCloseTo(l);
      expect(actual.opacity).toBeCloseTo(opacity);
    });
  });
});

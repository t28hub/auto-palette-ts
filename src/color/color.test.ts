import { Color } from './color';

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
});

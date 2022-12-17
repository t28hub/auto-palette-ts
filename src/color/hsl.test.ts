import { HSLColor } from './hsl';

describe('hsl', () => {
  describe('constructor', () => {
    it('should create a new color', () => {
      // Act
      const actual = new HSLColor(180, 1.0, 0.5, 1.0);

      // Assert
      expect(actual).toMatchObject({
        h: 180,
        s: 1.0,
        l: 0.5,
        opacity: 1.0,
      });
    });
  });

  describe('isLight', () => {
    it('should return true if lightness is greater than 0.5', () => {
      // Act
      const color = new HSLColor(120, 0.8, 0.51, 1.0);
      const actual = color.isLight;

      // Assert
      expect(actual).toEqual(true);
    });

    it('should return false if lightness is less than 0.5', () => {
      // Act
      const color = new HSLColor(120, 0.8, 0.49, 1.0);
      const actual = color.isLight;

      // Assert
      expect(actual).toEqual(false);
    });
  });

  describe('isDark', () => {
    it('should return true if lightness is less than 0.5', () => {
      // Act
      const color = new HSLColor(120, 0.8, 0.49, 1.0);
      const actual = color.isDark;

      // Assert
      expect(actual).toEqual(true);
    });

    it('should return false if lightness is greater than 0.5', () => {
      // Act
      const color = new HSLColor(120, 0.8, 0.51, 1.0);
      const actual = color.isDark;

      // Assert
      expect(actual).toEqual(false);
    });
  });
  describe('toString', () => {
    it('should return the string representation of this color', () => {
      // Act
      const color = new HSLColor(60, 1.0, 0.5, 0.5);
      const actual = color.toString();

      // Assert
      expect(actual).toEqual('#ffff0080');
    });
  });

  describe('pack', () => {
    it('should return the packed color', () => {
      // Act
      const color = new HSLColor(270, 1.0, 0.5, 0.5);
      const actual = color.pack();

      // Assert
      expect(actual).toEqual(0x8000ff80);
    });
  });

  describe('convertTo', () => {
    it('should convert this color by name of the given color space', () => {
      // Act
      const color = new HSLColor(180, 1.0, 0.5, 0.5);
      const actual = color.convertTo('rgb');

      // Assert
      expect(actual.r).toEqual(0);
      expect(actual.g).toEqual(255);
      expect(actual.b).toEqual(255);
      expect(actual.opacity).toBeCloseTo(0.5);
    });
  });
});

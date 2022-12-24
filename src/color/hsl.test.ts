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

  describe('clone', () => {
    it('should return cloned instance', () => {
      // Act
      const color = new HSLColor(270, 1.0, 0.5, 0.5);
      const actual = color.clone();

      // Assert
      expect(actual).toEqual(color);
      expect(actual).not.toBe(color);
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

  describe('mix', () => {
    it.each([
      {
        hsl1: { h: 0, s: 1.0, l: 0.5, opacity: 1.0 },
        hsl2: { h: 0, s: 1.0, l: 0.5, opacity: 1.0 },
        fraction: 0.5,
        expected: { h: 0, s: 1.0, l: 0.5, opacity: 1.0 },
      },
      {
        hsl1: { h: 0, s: 1.0, l: 0.5, opacity: 1.0 },
        hsl2: { h: 360, s: 1.0, l: 0.5, opacity: 1.0 },
        fraction: 0.5,
        expected: { h: 0, s: 1.0, l: 0.5, opacity: 1.0 },
      },
      {
        hsl1: { h: 120, s: 1.0, l: 0.5, opacity: 1.0 },
        hsl2: { h: 240, s: 0.4, l: 0.7, opacity: 0.2 },
        fraction: 0.5,
        expected: { h: 180, s: 0.7, l: 0.6, opacity: 0.6 },
      },
      {
        hsl1: { h: 120, s: 1.0, l: 0.5, opacity: 1.0 },
        hsl2: { h: 240, s: 0.4, l: 0.7, opacity: 0.2 },
        fraction: 0.25,
        expected: { h: 150, s: 0.85, l: 0.55, opacity: 0.8 },
      },
    ])(
      'should mix HSL($hsl1) and HSL($hsl2) with fraction($fraction) and return HSL($expected)',
      ({ hsl1, hsl2, fraction, expected }) => {
        // Act
        const color1 = new HSLColor(hsl1.h, hsl1.s, hsl1.l, hsl1.opacity);
        const color2 = new HSLColor(hsl2.h, hsl2.s, hsl2.l, hsl2.opacity);
        const actual = color1.mix(color2, fraction) as HSLColor;

        // Assert
        expect(actual.h).toBeCloseTo(expected.h);
        expect(actual.s).toBeCloseTo(expected.s);
        expect(actual.l).toBeCloseTo(expected.l);
        expect(actual.opacity).toBeCloseTo(expected.opacity);
      },
    );
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

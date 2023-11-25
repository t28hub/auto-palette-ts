import { describe, expect, it } from 'vitest';

import { HSL, HSLA, RGB, RGBA } from '../color';

import { ColorFilter, composite, opacity } from './filter';

describe('filter', () => {
  describe('opacity', () => {
    it('should create a new filter', () => {
      // Act
      const actual = opacity<RGB>();

      // Assert
      expect(actual).toBeDefined();
    });

    it('should create a new filter with threshold', () => {
      // Act
      const actual = opacity<RGB>(0.25);

      // Assert
      expect(actual).toBeDefined();
    });

    it('should return true if the opacity > the threshold', () => {
      // Act
      const color: RGBA = { r: 255, g: 0, b: 0, a: 128 + Number.EPSILON };
      const actual = opacity<RGB>().test(color);

      // Assert
      expect(actual).toBeTrue();
    });

    it('should return true if the opacity == the threshold', () => {
      // Act
      const color: RGBA = { r: 255, g: 0, b: 0, a: 128 + Number.EPSILON };
      const actual = opacity<RGB>().test(color);

      // Assert
      expect(actual).toBeTrue();
    });

    it('should return false if the opacity < the threshold', () => {
      // Act
      const color: RGBA = { r: 255, g: 0, b: 0, a: 0.5 - Number.EPSILON };
      const actual = opacity<RGB>().test(color);

      // Assert
      expect(actual).toBeFalse();
    });
  });

  describe('composite', () => {
    it('should create a composite filter', () => {
      // Act
      const filter1: ColorFilter<HSLA> = {
        test(color: HSLA): boolean {
          return color.s >= 0.25 && color.l >= 0.5;
        },
      };
      const filter2: ColorFilter<HSLA> = opacity<HSL>(64);
      const actual = composite(filter1, filter2);

      // Assert
      expect(actual).toBeDefined();
      expect(actual.test({ h: 0, s: 0.25, l: 0.5, a: 64 })).toBeTrue();
      expect(actual.test({ h: 0, s: 0.25, l: 0.5, a: 32 })).toBeFalse();
    });

    it('should create a empty filter without filter', () => {
      // Act
      const actual = composite();

      // Assert
      expect(actual).toBeDefined();
      expect(actual.test({ opacity: 0.0 })).toBeTrue();
    });
  });
});

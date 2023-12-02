import { describe, expect, it } from 'vitest';

import { alphaFilter, composeFilters, luminanceFilter } from './filter';

describe('filter', () => {
  describe('alphaFilter', () => {
    it('should create a new color filter function', () => {
      // Act
      const actual = alphaFilter();

      // Assert
      expect(actual).toBeDefined();
      expect(actual({ r: 0, g: 0, b: 0, a: 0 })).toBeFalsy();
      expect(actual({ r: 0, g: 0, b: 0, a: 255 })).toBeTruthy();
    });

    it('should create a new color filter function with the given threshold', () => {
      // Act
      const actual = alphaFilter(0.5);

      // Assert
      expect(actual).toBeDefined();
      expect(actual({ r: 0, g: 0, b: 0, a: 0 })).toBeFalsy();
      expect(actual({ r: 0, g: 0, b: 0, a: 127 })).toBeFalsy();
      expect(actual({ r: 0, g: 0, b: 0, a: 128 })).toBeTruthy();
      expect(actual({ r: 0, g: 0, b: 0, a: 255 })).toBeTruthy();
    });

    it.each([-1, 1.1, NaN, Infinity, -Infinity])(
      'should throw a TypeError if the threshold(%d) is not within the range [0.0, 1.0]',
      (threshold) => {
        // Assert
        expect(() => {
          // Act
          alphaFilter(threshold);
        }).toThrowError(TypeError);
      },
    );
  });

  describe('luminanceFilter', () => {
    it('should create a new color filter function', () => {
      // Act
      const actual = luminanceFilter();

      // Assert
      expect(actual).toBeDefined();
      expect(actual({ r: 247, g: 12, b: 164, a: 255 })).toBeTruthy();
      expect(actual({ r: 0, g: 0, b: 0, a: 255 })).toBeFalsy();
      expect(actual({ r: 255, g: 255, b: 255, a: 255 })).toBeFalsy();
    });

    it('should create a new color filter function with the given thresholds', () => {
      // Act
      const actual = luminanceFilter(0.5, 1.0);

      // Assert
      expect(actual).toBeDefined();
      expect(actual({ r: 0, g: 0, b: 0, a: 255 })).toBeFalsy();
      expect(actual({ r: 255, g: 255, b: 255, a: 255 })).toBeTruthy();
    });

    it.each([-1, 1.1, NaN, Infinity, -Infinity])(
      'should throw a TypeError if the minThreshold(%d) is not within the range [0.0, 1.0]',
      (minThreshold) => {
        // Assert
        expect(() => {
          // Act
          luminanceFilter(minThreshold, 1.0);
        }).toThrowError(TypeError);
      },
    );

    it.each([-1, 1.1, NaN, Infinity, -Infinity])(
      'should throw a TypeError if the maxThreshold(%d) is not within the range [0.0, 1.0]',
      (maxThreshold) => {
        // Assert
        expect(() => {
          // Act
          luminanceFilter(0.0, maxThreshold);
        }).toThrowError(TypeError);
      },
    );

    it('should throw a RangeError if the minThreshold is greater than the maxThreshold', () => {
      // Assert
      expect(() => {
        // Act
        luminanceFilter(1.0, 0.0);
      }).toThrowError(RangeError);
    });
  });

  describe('composeFilters', () => {
    it('should create a new color filter function that combines the given filters', () => {
      // Arrange
      const filter1 = alphaFilter(0.5);
      const filter2 = luminanceFilter(0.5, 1.0);

      // Act
      const actual = composeFilters(filter1, filter2);

      // Assert
      expect(actual).toBeDefined();
      expect(actual({ r: 0, g: 0, b: 0, a: 0 })).toBeFalsy();
      expect(actual({ r: 0, g: 0, b: 0, a: 128 })).toBeFalsy();
      expect(actual({ r: 0, g: 0, b: 0, a: 255 })).toBeFalsy();
      expect(actual({ r: 255, g: 255, b: 255, a: 127 })).toBeFalsy();
      expect(actual({ r: 255, g: 255, b: 255, a: 128 })).toBeTruthy();
      expect(actual({ r: 255, g: 255, b: 255, a: 255 })).toBeTruthy();
    });
  });
});

import { composeFilters, luminanceFilter, opacityFilter } from '@internal/filter';
import { AssertionError } from '@internal/utils';
import { describe, expect, it } from 'vitest';

describe('filter', () => {
  describe('opacityFilter', () => {
    it('should create a new color filter function', () => {
      // Act
      const actual = opacityFilter();

      // Assert
      expect(actual).toBeDefined();
      expect(actual({ r: 0, g: 0, b: 0, a: 0 })).toBeFalsy();
      expect(actual({ r: 0, g: 0, b: 0, a: 255 })).toBeTruthy();
    });

    it('should create a new color filter function with the given threshold', () => {
      // Act
      const actual = opacityFilter(0.5);

      // Assert
      expect(actual).toBeDefined();
      expect(actual({ r: 0, g: 0, b: 0, a: 0 })).toBeFalsy();
      expect(actual({ r: 0, g: 0, b: 0, a: 127 })).toBeFalsy();
      expect(actual({ r: 0, g: 0, b: 0, a: 128 })).toBeTruthy();
      expect(actual({ r: 0, g: 0, b: 0, a: 255 })).toBeTruthy();
    });

    it.each([NaN, Infinity])(
      'should throw an AssertionError if the threshold(%d) is not a finite number',
      (threshold) => {
        // Assert
        expect(() => {
          // Act
          opacityFilter(threshold);
        }).toThrowError(AssertionError);
      },
    );

    it.each([-1, 1.1])(
      'should throw a RangeError if the threshold(%d) is not within the range [0.0, 1.0]',
      (threshold) => {
        // Assert
        expect(() => {
          // Act
          opacityFilter(threshold);
        }).toThrowError(RangeError);
      },
    );
  });

  describe('luminanceFilter', () => {
    it('should create a new color filter function', () => {
      // Act
      const actual = luminanceFilter();

      // Assert
      expect(actual).toBeDefined();
      expect(actual({ r: 173, g: 248, b: 65, a: 255 })).toBeTruthy();
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

    it.each([
      { minThreshold: NaN, maxThreshold: 1.0 },
      { minThreshold: 0.0, maxThreshold: NaN },
      { minThreshold: Infinity, maxThreshold: 1.0 },
      { minThreshold: 0.0, maxThreshold: Infinity },
    ])(
      'should throw an AssertionError if the minThreshold(%d) or maxThreshold(%d) is not a finite number',
      ({ minThreshold, maxThreshold }) => {
        // Assert
        expect(() => {
          // Act
          luminanceFilter(minThreshold, maxThreshold);
        }).toThrowError(AssertionError);
      },
    );

    it.each([
      { minThreshold: -1.0, maxThreshold: 1.0 },
      { minThreshold: 0.0, maxThreshold: -1.0 },
      { minThreshold: 1.1, maxThreshold: 1.0 },
      { minThreshold: 0.0, maxThreshold: 1.1 },
    ])(
      'should throw a RangeError if the minThreshold(%d) or maxThreshold(%d) is not within the range [0.0, 1.0]',
      ({ minThreshold, maxThreshold }) => {
        // Assert
        expect(() => {
          // Act
          luminanceFilter(minThreshold, maxThreshold);
        }).toThrowError(RangeError);
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
      const filter1 = opacityFilter(0.5);
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

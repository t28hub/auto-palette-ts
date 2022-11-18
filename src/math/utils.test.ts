import { clamp } from './utils';

describe('utils', () => {
  describe('clamp', () => {
    it.each([
      { value: -1, min: 0, max: 100, expected: 0 },
      { value: 0, min: 0, max: 100, expected: 0 },
      { value: 1, min: 0, max: 100, expected: 1 },
      { value: 50, min: 0, max: 100, expected: 50 },
      { value: 99, min: 0, max: 100, expected: 99 },
      { value: 100, min: 0, max: 100, expected: 100 },
      { value: 101, min: 0, max: 100, expected: 100 },
      { value: Number.MIN_VALUE, min: 0, max: 100, expected: Number.MIN_VALUE },
      { value: Number.MAX_VALUE, min: 0, max: 100, expected: 100 },
    ])('should clamp the given value($value) in [$min, $max]', ({ value, min, max, expected }) => {
      // Act
      const actual = clamp(value, min, max);

      // Assert
      expect(actual).toEqual(expected);
    });

    it.each([
      { value: NaN, min: 0, max: 100 },
      { value: 50, min: NaN, max: 100 },
      { value: 50, min: 0, max: NaN },
    ])('should throw TypeError if value($value), min($min) or max($max) is invalid', ({ value, min, max }) => {
      // Assert
      expect(() => {
        // Act
        clamp(value, min, max);
      }).toThrowError(TypeError);
    });
  });
});

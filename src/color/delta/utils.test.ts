import { asColorDifference, isColorDifference } from './utils';

describe('utils', () => {
  describe('isColorDifference', () => {
    it.each([
      { value: 0, expected: true },
      { value: 1, expected: true },
      { value: 0.01, expected: true },
      { value: 1024, expected: true },
      { value: Number.EPSILON, expected: true },
      { value: Number.MIN_VALUE, expected: true },
      { value: Number.MAX_VALUE, expected: true },
      { value: Number.MAX_SAFE_INTEGER, expected: true },
      { value: -1, expected: false },
      { value: NaN, expected: false },
      { value: Number.MIN_SAFE_INTEGER, expected: false },
      { value: Number.NEGATIVE_INFINITY, expected: false },
      { value: Number.POSITIVE_INFINITY, expected: false },
    ])('should return $expected when value == $value', ({ value, expected }) => {
      // Act
      const actual = isColorDifference(value);

      // Assert
      expect(actual).toEqual(expected);
    });
  });

  describe('asColorDifference', () => {
    it('should convert value as color difference', () => {
      // Act
      const actual = asColorDifference(15);

      // Assert
      expect(actual).toEqual(15);
    });

    it('should throw TypeError when value is invalid DeltaE', () => {
      // Assert
      expect(() => {
        // Act
        asColorDifference(-1);
      }).toThrowError(TypeError);
    });
  });
});

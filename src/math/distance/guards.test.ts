import { describe, expect, it } from 'vitest';

import { isDistance, toDistance } from './guards';

describe('guards', () => {
  describe('isDistance', () => {
    it.each([
      { value: 0.0, expected: true },
      { value: 0.1, expected: true },
      { value: 1024, expected: true },
      { value: Number.MAX_VALUE, expected: true },
      { value: undefined, expected: false },
      { value: null, expected: false },
      { value: true, expected: false },
      { value: -Number.EPSILON, expected: false },
      { value: NaN, expected: false },
      { value: 'string', expected: false },
      { value: [], expected: false },
      { value: {}, expected: false },
    ])('should return $expected when the value is $value', ({ value, expected }) => {
      // Act
      const actual = isDistance(value);

      // Assert
      expect(actual).toEqual(expected);
    });
  });

  describe('toDistance', () => {
    it('should return the given value as the distance', () => {
      // Act
      const actual = toDistance(1024);

      // Assert
      expect(actual).toBeDefined();
    });

    it('should throw TypeError if the given value is invalid', () => {
      // Assert
      expect(() => {
        // Act
        toDistance(-1.0);
      }).toThrowError(TypeError);
    });
  });
});

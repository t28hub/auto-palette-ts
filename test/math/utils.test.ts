import { clamp, degreeToRadian, denormalize, normalize, radianToDegree } from '@internal/math';
import { describe, expect, it } from 'vitest';

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

  describe('normalize', () => {
    it.each([
      { value: 0, min: 0, max: 100, expected: 0 },
      { value: 1, min: 0, max: 100, expected: 0.01 },
      { value: 50, min: 0, max: 100, expected: 0.5 },
      { value: 99, min: 0, max: 100, expected: 0.99 },
      { value: 100, min: 0, max: 100, expected: 1.0 },
    ])('should normalize the given value($value) in [$min, $max] to $expected', ({ value, min, max, expected }) => {
      // Act
      const actual = normalize(value, min, max);

      // Assert
      expect(actual).toEqual(expected);
    });

    it.each([
      { value: NaN, min: 0, max: 100 },
      { value: 50, min: NaN, max: 100 },
      { value: 50, min: 0, max: NaN },
    ])('should throw a TypeError if the value($value), min($min) or max($max) is invalid', ({ value, min, max }) => {
      // Assert
      expect(() => {
        // Act
        normalize(value, min, max);
      }).toThrowError(TypeError);
    });

    it.each([
      { value: 50, min: 0, max: 0 },
      { value: 50, min: 100, max: 0 },
    ])('should throw a RangeError if min($min) is not less than max($max)', ({ value, min, max }) => {
      // Assert
      expect(() => {
        // Act
        normalize(value, min, max);
      }).toThrowError(RangeError);
    });
  });

  describe('denormalize', () => {
    it.each([
      { value: 0, min: 0, max: 100, expected: 0 },
      { value: 0.01, min: 0, max: 100, expected: 1 },
      { value: 0.5, min: 0, max: 100, expected: 50 },
      { value: 0.99, min: 0, max: 100, expected: 99 },
      { value: 1.0, min: 0, max: 100, expected: 100 },
    ])('should denormalize the given value($value) in [$min, $max] to $expected', ({ value, min, max, expected }) => {
      // Act
      const actual = denormalize(value, min, max);

      // Assert
      expect(actual).toEqual(expected);
    });

    it.each([
      { value: NaN, min: 0, max: 100 },
      { value: 0.5, min: NaN, max: 100 },
      { value: 0.5, min: 0, max: NaN },
    ])('should throw a TypeError if the value($value), min($min) or max($max) is invalid', ({ value, min, max }) => {
      // Assert
      expect(() => {
        // Act
        denormalize(value, min, max);
      }).toThrowError(TypeError);
    });

    it.each([
      { value: 0, min: 0, max: 0 },
      { value: 0, min: 100, max: 0 },
    ])('should throw a RangeError if min($min) is not less than max($max)', ({ value, min, max }) => {
      // Assert
      expect(() => {
        // Act
        denormalize(value, min, max);
      }).toThrowError(RangeError);
    });
  });

  describe('degreeToRadian', () => {
    it.each([
      { degree: 0, radian: 0 },
      { degree: 30, radian: 0.5236 },
      { degree: 90, radian: 1.5708 },
      { degree: 180, radian: 3.1415 },
      { degree: 330, radian: 5.7596 },
      { degree: 360, radian: 6.2832 },
    ])('should convert from degree($degree) to radian($radian)', ({ degree, radian }) => {
      // Act
      const actual = degreeToRadian(degree);

      // Assert
      expect(actual).toBeCloseTo(radian);
    });
  });

  describe('radianToDegree', () => {
    it.each([
      { degree: 0, radian: 0 },
      { degree: 30, radian: 0.5236 },
      { degree: 90, radian: 1.5708 },
      { degree: 180, radian: 3.1415 },
      { degree: 330, radian: 5.7596 },
      { degree: 360, radian: 6.2832 },
    ])('should convert from radian($radian) to degree($degree)', ({ degree, radian }) => {
      // Act
      const actual = radianToDegree(radian);

      // Assert
      expect(actual).toBeCloseTo(degree, 1);
    });
  });
});

import { describe, expect, it } from 'vitest';

import { RandomSampling } from './random';

describe('RandomSampling', () => {
  describe('constructor', () => {
    it('should create a new instance', () => {
      // Act
      const actual = new RandomSampling();

      // Assert
      expect(actual).toBeDefined();
    });
  });

  describe('sample', () => {
    it('should return n data points', () => {
      // Act
      const sampling = new RandomSampling<number>();
      const actual = sampling.sample([1, 2, 3, 4, 5], 3);

      // Assert
      expect(actual.length).toEqual(3);
      expect(actual).toContainAnyValues([1, 2, 3, 4, 5]);
    });

    it('should return all data points when n is greater than or equal to the number of data points', () => {
      // Act
      const sampling = new RandomSampling<number>();
      const actual = sampling.sample([1, 2, 3, 4, 5], 5);

      // Assert
      expect(actual.length).toEqual(5);
      expect(actual).toContainAllValues([1, 2, 3, 4, 5]);
    });

    it('should throw a RangeError when n is less than or equal to 0', () => {
      // Arrange
      const sampling = new RandomSampling<number>();

      // Assert
      expect(() => {
        // Act
        sampling.sample([1, 2, 3], 0);
      }).toThrowError(RangeError);
    });
  });
});

import { FarthestPointSampling, type Point2, euclidean } from '@internal/math';
import { AssertionError } from '@internal/utils';
import { describe, expect, it } from 'vitest';

const points: Point2[] = [
  [0.0, 0.0],
  [1.0, 0.0],
  [0.0, 1.0],
  [1.0, 1.0],
  [2.0, 2.0],
];

describe('FarthestPointSampling', () => {
  describe('constructor', () => {
    it('should create a new instance', () => {
      // Act
      const actual = new FarthestPointSampling<Point2>(euclidean);

      // Assert
      expect(actual).toBeDefined();
    });
  });

  describe('sample', () => {
    it('should return n data points', () => {
      // Act
      const sampling = new FarthestPointSampling<Point2>(euclidean);
      const actual = sampling.sample(points, 2);

      // Assert
      expect(actual).toHaveLength(2);
      expect(actual).toContainAllValues([
        [0.0, 0.0],
        [2.0, 2.0],
      ]);
    });

    it('should return all data points when n is greater than or equal to the number of data points', () => {
      // Act
      const sampling = new FarthestPointSampling<Point2>(euclidean);
      const actual = sampling.sample(points, 5);

      // Assert
      expect(actual).toHaveLength(5);
      expect(actual).toContainAllValues(points);
    });

    it('should throw an AssertionError when n is less than or equal to 0', () => {
      // Arrange
      const sampling = new FarthestPointSampling<Point2>(euclidean);

      // Assert
      expect(() => {
        // Act
        sampling.sample(points, 0);
      }).toThrowError(AssertionError);
    });
  });
});

import { type Point2, WeightedFarthestPointSampling, euclidean } from '@internal/math';
import { AssertionError } from '@internal/utils';
import { describe, expect, it } from 'vitest';

const points: Point2[] = [
  [0.0, 0.0],
  [1.0, 1.0],
  [1.0, 2.0],
  [2.0, 2.0],
  [2.0, 4.0],
  [3.0, 5.0],
  [1.0, 0.0],
  [0.0, 1.0],
  [0.0, 2.0],
] as const;

const weights: number[] = [1.0, 1.0, 2.0, 3.0, 5.0, 8.0, 13.0, 21.0, 34.0] as const;

describe('WeightedFarthestPointSampling', () => {
  it('should create a new instance', () => {
    // Act
    const actual = new WeightedFarthestPointSampling<Point2>(weights, euclidean);

    // Assert
    expect(actual).toBeDefined();
  });

  describe('sample', () => {
    it('should return n data points', () => {
      // Act
      const sampling = new WeightedFarthestPointSampling<Point2>(weights, euclidean);
      const actual = sampling.sample(points, 3);

      // Assert
      expect(actual).toMatchObject(new Set([5, 6, 8]));
    });

    it('should return all data points when n is greater than or equal to the number of data points', () => {
      // Act
      const sampling = new WeightedFarthestPointSampling<Point2>(weights, euclidean);
      const actual = sampling.sample(points, 9);

      // Assert
      expect(actual).toMatchObject(new Set([0, 1, 2, 3, 4, 5, 6, 7, 8]));
    });

    it('should throw an AssertionError when n is less than or equal to 0', () => {
      // Arrange
      const sampling = new WeightedFarthestPointSampling<Point2>(weights, euclidean);

      // Assert
      expect(() => {
        // Act
        sampling.sample(points, 0);
      }).toThrowError(AssertionError);
    });

    it('should throw an AssertionError when the number of data points and weights are different', () => {
      // Arrange
      const sampling = new WeightedFarthestPointSampling<Point2>(weights, euclidean);

      // Assert
      expect(() => {
        // Act
        sampling.sample(
          [
            [0.5, 1.0],
            [3.0, 2.5],
            [1.0, 1.0],
          ],
          2,
        );
      }).toThrowError(AssertionError);
    });
  });
});

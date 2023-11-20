import { describe, expect, it } from 'vitest';

import { Point3, squaredEuclidean } from '../../index';

import { Kmeans } from './index';

describe('Kmeans', () => {
  describe('constructor', () => {
    it('should create a new Kmeans instance', () => {
      // Act
      const actual = new Kmeans(15, 10, Number.EPSILON, squaredEuclidean);

      // Assert
      expect(actual).toBeDefined();
    });

    it.each([
      { k: NaN, maxIterations: 10, tolerance: 0.01 },
      { k: 0, maxIterations: 10, tolerance: 0.01 },
      { k: 10, maxIterations: NaN, tolerance: 0.01 },
      { k: 10, maxIterations: 0, tolerance: 0.01 },
      { k: 10, maxIterations: 10, tolerance: NaN },
      { k: 10, maxIterations: 10, tolerance: -1.0 },
    ])('should throw a TypeError if constructor parameters are invalid %p', ({ k, maxIterations, tolerance }) => {
      // Assert
      expect(() => {
        // Act
        new Kmeans(k, maxIterations, tolerance, squaredEuclidean);
      }).toThrowError(TypeError);
    });
  });

  describe('fit', () => {
    const points: Point3[] = [
      [0, 0, 0],
      [0, 0, 1],
      [1, 0, 0],
      [2, 2, 2],
      [2, 1, 2],
      [4, 4, 4],
      [4, 4, 5],
      [3, 4, 5],
    ];

    it.each([
      { k: 1, expected: 1 },
      { k: 3, expected: 3 },
      { k: 8, expected: 8 },
      { k: 10, expected: 8 },
    ])('should return $k clusters when fitting', ({ k, expected }) => {
      // Act
      const kmeans = new Kmeans(k, 10, 0.01, squaredEuclidean);
      const actual = kmeans.fit(points);

      // Assert
      expect(actual).toHaveLength(expected);
    });

    it('should throw an Error if points array is empty', () => {
      // Arrange
      const kmeans = new Kmeans(3, 10, 0.01, squaredEuclidean);

      // Assert
      expect(() => {
        // Act
        kmeans.fit([]);
      }).toThrowError(Error);
    });
  });
});

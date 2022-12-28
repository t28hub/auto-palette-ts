import { describe, expect, it } from 'vitest';

import { EuclideanDistance, SquaredEuclideanDistance } from './distance';
import { Point2 } from './point';

describe('DistanceMeasure', () => {
  describe('EuclideanDistance', () => {
    it('should compute euclidean distance between 2 points', () => {
      // Act
      const actual = EuclideanDistance<Point2>([0, 0], [1, 2]);

      // Assert
      expect(actual).toEqual(Math.sqrt(5));
    });

    it('should throw TypeError if any component contain infinite number', () => {
      // Assert
      expect(() => {
        // Act
        EuclideanDistance<Point2>([0, 0], [1, NaN]);
      }).toThrowError(TypeError);
    });
  });

  describe('SquaredEuclideanDistance', () => {
    it('should compute squared euclidean distance between 2 points', () => {
      // Act
      const actual = SquaredEuclideanDistance<Point2>([0, 0], [1, 2]);

      // Assert
      expect(actual).toEqual(5);
    });

    it('should throw TypeError if any component contain infinite number', () => {
      // Assert
      expect(() => {
        // Act
        SquaredEuclideanDistance<Point2>([NaN, 0], [1, 2]);
      }).toThrowError(TypeError);
    });
  });
});

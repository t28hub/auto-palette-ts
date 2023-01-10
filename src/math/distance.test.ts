import { describe, expect, it } from 'vitest';

import { euclidean, squaredEuclidean } from './distance';
import { Point2 } from './point';

describe('DistanceFunction', () => {
  describe('euclidean', () => {
    it('should compute euclidean distance between 2 points', () => {
      // Act
      const actual = euclidean()<Point2>([0, 0], [1, 2]);

      // Assert
      expect(actual).toEqual(Math.sqrt(5));
    });

    it('should throw TypeError if any component contain infinite number', () => {
      // Assert
      expect(() => {
        // Act
        euclidean()<Point2>([0, 0], [1, NaN]);
      }).toThrowError(TypeError);
    });
  });

  describe('squaredEuclidean', () => {
    it('should compute squared euclidean distance between 2 points', () => {
      // Act
      const actual = squaredEuclidean()<Point2>([0, 0], [1, 2]);

      // Assert
      expect(actual).toEqual(5);
    });

    it('should throw TypeError if any component contain infinite number', () => {
      // Assert
      expect(() => {
        // Act
        squaredEuclidean()<Point2>([NaN, 0], [1, 2]);
      }).toThrowError(TypeError);
    });
  });
});

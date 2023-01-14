import { beforeEach, describe, expect, it } from 'vitest';

import { DistanceFunction, Point2 } from '../types';

import { EuclideanDistance } from './euclidean';

describe('EuclideanDistance', () => {
  let euclideanDistance: DistanceFunction<Point2>;
  beforeEach(() => {
    euclideanDistance = new EuclideanDistance();
  });

  describe('compute', () => {
    it('should compute euclidean distance between 2 points', () => {
      // Act
      const actual = euclideanDistance.compute([0, 0], [1, 2]);

      // Assert
      expect(actual).toEqual(Math.sqrt(5));
    });

    it('should throw TypeError if any component contain infinite number', () => {
      // Assert
      expect(() => {
        // Act
        euclideanDistance.compute([0, 0], [1, NaN]);
      }).toThrowError(TypeError);
    });
  });
});

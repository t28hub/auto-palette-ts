import { describe, it, expect } from 'vitest';

import { squaredEuclidean } from '../../distance';
import { Point2 } from '../../types';

import { SingleLinkage } from './singleLinkage';

describe('SingleLinkage', () => {
  describe('constructor', () => {
    it('should create a new SingleLinkage', () => {});
  });

  describe('fit', () => {
    it('should return an array of nodes', () => {
      const points: Point2[] = [
        [0.0, 0.0],
        [1.0, 1.0],
        [2.0, 1.5],
        [1.0, 0.0],
        [2.0, 2.0],
        [0.0, 1.0],
        [2.5, 3.0],
      ];
      const distanceFunction = squaredEuclidean<Point2>();
      const singleLinkage = new SingleLinkage({
        compute: (u: number, v: number): number => {
          const pointU = points[u];
          const pointV = points[v];
          return distanceFunction.measure(pointU, pointV);
        },
      });

      const actual = singleLinkage.fit(points);

      // Assert
      expect(actual).toHaveLength(6);
      expect(actual).toContainAllValues([
        { left: 4, right: 2, weight: 0.25, size: 2 },
        { left: 1, right: 5, weight: 1.0, size: 2 },
        { left: 8, right: 0, weight: 1.0, size: 3 },
        { left: 9, right: 3, weight: 1.0, size: 4 },
        { left: 6, right: 7, weight: 1.25, size: 3 },
        { left: 11, right: 10, weight: 1.25, size: 7 },
      ]);
    });
  });
});

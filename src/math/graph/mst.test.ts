import { describe, expect, it } from 'vitest';

import { squaredEuclidean } from '../distance';
import { Point2 } from '../types';

import { MinimumSpanningTree } from './mst';

describe('MinimumSpanningTree', () => {
  describe('prim', () => {
    it('should return a graph from the given vertices', () => {
      // Act
      const points: Point2[] = [
        [0, 0],
        [8, 4],
        [1, 2],
        [4, 2],
      ];
      const actual = MinimumSpanningTree.prim(points, (index1, index2): number => {
        const point1 = points[index1];
        const point2 = points[index2];
        return squaredEuclidean().measure(point1, point2);
      });

      // Assert
      expect(actual.isEmpty).toBeFalse();
      expect(actual.getEdges()).toContainAllValues([
        { u: 3, v: 2, weight: 9 },
        { u: 2, v: 0, weight: 5 },
        { u: 3, v: 1, weight: 20 },
      ]);
    });

    it('should return empty graph if the given vertices is empty', () => {
      // Act
      const actual = MinimumSpanningTree.prim([], (_index1, _index2): number => {
        return Math.random();
      });

      // Assert
      expect(actual.isEmpty).toBeTrue();
      expect(actual.getEdges()).toBeEmpty();
    });
  });
});

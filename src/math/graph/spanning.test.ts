import { describe, expect, it } from 'vitest';

import { squaredEuclidean } from '../distance';
import { Graph, Point2, WeightedEdge } from '../types';

import { MinimumSpanningTree } from './spanning';

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
      const graph: Graph<Point2, WeightedEdge> = {
        getEdge(u: number, v: number): WeightedEdge {
          const pointU = points[u];
          const pointV = points[v];
          const weight = squaredEuclidean().measure(pointU, pointV);
          return { u, v, weight };
        },
        getVertices(): Point2[] {
          return Array.from(points);
        },
        countVertices(): number {
          return points.length;
        },
      };
      const actual = MinimumSpanningTree.prim(graph);

      // Assert
      expect(actual.weight).toEqual(34.0);
      expect(actual.getEdges()).toContainAllValues([
        { u: 3, v: 2, weight: 9 },
        { u: 2, v: 0, weight: 5 },
        { u: 3, v: 1, weight: 20 },
      ]);
    });

    it('should return empty graph if the given vertices is empty', () => {
      // Arrange
      const emptyGraph: Graph<Point2, WeightedEdge> = {
        getEdge(u: number, v: number): WeightedEdge {
          throw new RangeError(`The given indices are out of range: ${u}, ${v}`);
        },
        getVertices(): Point2[] {
          return [];
        },
        countVertices(): number {
          return 0;
        },
      };

      // Act
      const actual = MinimumSpanningTree.prim(emptyGraph);

      // Assert
      expect(actual.weight).toEqual(0.0);
      expect(actual.getEdges()).toBeEmpty();
    });
  });
});

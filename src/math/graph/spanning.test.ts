import { describe, expect, it } from 'vitest';

import { Point2 } from '../point';
import { Graph, WeightedEdge } from '../types';

import { MinimumSpanningTree } from './spanning';

describe('MinimumSpanningTree', () => {
  describe('prim', () => {
    it('should return a graph from the given vertices', () => {
      // Act
      const weights = [
        [NaN, 1, 4, 3],
        [1, NaN, NaN, 2],
        [4, NaN, NaN, 5],
        [3, 2, 5, NaN],
      ];
      const graph: Graph<number, WeightedEdge> = {
        getEdge(u: number, v: number): WeightedEdge {
          const weight = weights[u][v];
          return { u, v, weight };
        },
        getVertices(): number[] {
          return [0, 1, 2, 3];
        },
        countVertices(): number {
          return weights.length;
        },
      };
      const actual = MinimumSpanningTree.fromGraph(graph);

      // Assert
      expect(actual.weight).toEqual(7);
      expect(actual.getEdges()).toContainAllValues([
        { u: 3, v: 1, weight: 2 },
        { u: 1, v: 0, weight: 1 },
        { u: 0, v: 2, weight: 4 },
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
      const actual = MinimumSpanningTree.fromGraph(emptyGraph);

      // Assert
      expect(actual.weight).toEqual(0.0);
      expect(actual.getEdges()).toBeEmpty();
    });
  });
});

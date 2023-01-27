import { beforeEach, describe, expect, it } from 'vitest';

import { euclidean } from '../../distance';
import { Point2 } from '../../types';

import { CoreDistance } from './coreDistance';
import { PointGraph } from './pointGraph';

// Arrange
const points: Point2[] = [
  [0.0, 0.0], // 0
  [0.1, 0.1], // 1
  [0.2, 0.1], // 2
  [1.9, 1.1], // 3
  [2.0, 1.0], // 4
  [2.1, 0.9], // 5
  [3.0, 2.0], // 6
  [3.1, 2.1], // 7
];

describe('PointGraph', () => {
  describe('constructor', () => {
    it('should create a new PointGraph', () => {
      // Act
      const coreDistance = CoreDistance.from(points, 2, euclidean());
      const actual = new PointGraph(points, coreDistance, euclidean());

      // Assert
      expect(actual).toBeDefined();
    });
  });

  describe('getEdge', () => {
    let coreDistance: CoreDistance;
    let pointGraph: PointGraph<Point2>;
    beforeEach(() => {
      coreDistance = CoreDistance.from(points, 2, euclidean());
      pointGraph = new PointGraph(points, coreDistance, euclidean());
    });

    it('should return core distance of u', () => {
      // Act
      const actual = pointGraph.getEdge(0, 1);

      // Assert
      expect(actual).toMatchObject({ u: 0, v: 1 });
      const expected = coreDistance.at(0);
      expect(actual.weight).toBeCloseTo(expected);
    });

    it('should return core distance of v', () => {
      // Act
      const actual = pointGraph.getEdge(6, 7);

      // Assert
      expect(actual).toMatchObject({ u: 6, v: 7 });
      const expected = coreDistance.at(7);
      expect(actual.weight).toBeCloseTo(expected);
    });

    it('should return distance between u and v', () => {
      // Act
      const actual = pointGraph.getEdge(0, 7);

      // Assert
      expect(actual).toMatchObject({ u: 0, v: 7 });
      const expected = euclidean().measure(points[0], points[7]);
      expect(actual.weight).toBeCloseTo(expected);
    });

    it.each([
      { u: -1, v: 0 },
      { u: 0, v: -1 },
      { u: 0, v: 8 },
      { u: 8, v: 0 },
      { u: -1, v: -1 },
      { u: 8, v: 8 },
    ])('should throw RangeError if either or both vertices u($u) and v($v) are invalid', ({ u, v }) => {
      // Assert
      expect(() => {
        // Act
        pointGraph.getEdge(u, v);
      }).toThrowError(RangeError);
    });
  });

  describe('getVertices', () => {
    it('should return a set of all vertices', () => {
      // Arrange
      const coreDistance = CoreDistance.from(points, 2, euclidean());
      const pointGraph = new PointGraph(points, coreDistance, euclidean());

      // Act
      const actual = pointGraph.getVertices();

      // Assert
      expect(actual).toHaveLength(8);
      expect(actual).toEqual(points);
    });
  });

  describe('countVertices', () => {
    it('should return the number of vertices.', () => {
      // Arrange
      const coreDistance = CoreDistance.from(points, 2, euclidean());
      const pointGraph = new PointGraph(points, coreDistance, euclidean());

      // Act
      const actual = pointGraph.countVertices();

      // Assert
      expect(actual).toEqual(8);
    });
  });
});

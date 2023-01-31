import { beforeEach, describe, expect, it } from 'vitest';

import { squaredEuclidean } from '../../distance';
import { Point2, WeightFunction } from '../../types';

import { HierarchicalClustering } from './index';

// Arrange
const points: Point2[] = [
  [0.0, 0.0],
  [1.0, 1.0],
  [2.0, 1.5],
  [1.0, 0.0],
  [2.0, 2.0],
  [0.0, 1.0],
  [2.5, 3.0],
];

const DistanceWeightFunction: WeightFunction = {
  compute: (u: number, v: number): number => {
    const pointU = points[u];
    const pointV = points[v];
    return squaredEuclidean().measure(pointU, pointV);
  },
};

describe('HierarchicalClustering', () => {
  describe('constructor', () => {
    it('should create a new HierarchicalClustering', () => {
      // Act
      const actual = new HierarchicalClustering(3, DistanceWeightFunction);

      // Assert
      expect(actual).toBeDefined();
    });

    it.each([{ k: 0 }, { k: -1 }, { k: 0.0001 }])('should throw RangeError if the k($k) is less than 1', ({ k }) => {
      // Assert
      expect(() => {
        // Act
        new HierarchicalClustering(k, DistanceWeightFunction);
      }).toThrowError(RangeError);
    });
  });

  describe('fit', () => {
    it('should return an array of clusters', () => {
      // Act
      const hierarchicalClustering = new HierarchicalClustering(3, DistanceWeightFunction);
      const actual = hierarchicalClustering.fit(points);

      // Assert
      expect(actual).toHaveLength(3);
      expect(actual[0]).toMatchObject({
        id: 1,
        points: [
          [0.0, 0.0],
          [1.0, 1.0],
          [1.0, 0.0],
          [0.0, 1.0],
        ],
      });
      expect(actual[1]).toMatchObject({
        id: 2,
        points: [
          [2.0, 1.5],
          [2.0, 2.0],
        ],
      });
      expect(actual[2]).toMatchObject({
        id: 0,
        points: [[2.5, 3.0]],
      });
    });

    it('should return an array contains single cluster if the cluster size === 1', () => {
      // Act
      const hierarchicalClustering = new HierarchicalClustering(1, DistanceWeightFunction);
      const actual = hierarchicalClustering.fit(points);

      // Assert
      expect(actual).toHaveLength(1);
      expect(actual[0]).toMatchObject({ id: 0, points });
    });
  });

  describe('label', () => {
    it('should return labels', () => {
      // Act
      const hierarchicalClustering = new HierarchicalClustering(3, DistanceWeightFunction);
      const actual = hierarchicalClustering.label(points);

      // Assert
      expect(actual).toHaveLength(points.length);
      expect(actual).toContainAllValues([1, 1, 2, 1, 2, 1, 0]);
    });

    it('should return labels contains only 0 if the cluster size is less than 2', () => {
      // Act
      const hierarchicalClustering = new HierarchicalClustering(1, DistanceWeightFunction);
      const actual = hierarchicalClustering.label(points);

      // Assert
      expect(actual).toHaveLength(points.length);
      expect(actual).toContainAllValues([0, 0, 0, 0, 0, 0, 0]);
    });
  });

  describe('buildHierarchy', () => {
    let hierarchicalClustering: HierarchicalClustering<Point2>;
    beforeEach(() => {
      hierarchicalClustering = new HierarchicalClustering(3, DistanceWeightFunction);
    });

    it('should build hierarchical tree from the given points', () => {
      // Act
      const actual = hierarchicalClustering.buildHierarchy(points);

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

    it('should return an empty array if the points is empty', () => {
      // Act
      const actual = hierarchicalClustering.buildHierarchy([]);

      // Assert
      expect(actual).toBeEmpty();
    });
  });
});

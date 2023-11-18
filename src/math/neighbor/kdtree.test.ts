import { beforeEach, describe, expect, it } from 'vitest';

import { euclidean, Point3 } from '../../math';

import { KDTree } from './kdtree';

// Arrange
const points: Point3[] = [
  [1, 2, 3],
  [5, 1, 2],
  [9, 3, 4],
  [3, 9, 1],
  [4, 8, 3],
  [9, 1, 1],
  [5, 0, 0],
  [1, 1, 1],
  [7, 2, 2],
  [5, 9, 1],
  [1, 1, 9],
  [9, 8, 7],
  [2, 3, 4],
  [4, 5, 4],
];

describe('KDTree', () => {
  describe('build', () => {
    it('should build KDTree from points', () => {
      // Act
      const actual = KDTree.build(points, euclidean());

      // Assert
      expect(actual).toBeDefined();
    });

    it('should throw Error if points is empty', () => {
      // Assert
      expect(() => {
        // Act
        KDTree.build([], euclidean());
      }).toThrowError(Error);
    });
  });

  describe('search', () => {
    let kdtree: KDTree<Point3>;
    beforeEach(() => {
      kdtree = KDTree.build(points, euclidean());
    });

    it('should return the k nearest neighbors to the given point', () => {
      // Act
      const actual = kdtree.search([2, 5, 6], 3);

      // Assert
      expect(actual).toHaveLength(3);
      expect(actual[0]).toMatchObject({
        index: 12,
        point: [2, 3, 4],
        distance: 2.8284271247461903,
      });
      expect(actual[1]).toMatchObject({
        index: 13,
        point: [4, 5, 4],
        distance: 2.8284271247461903,
      });
      expect(actual[2]).toMatchObject({
        index: 0,
        point: [1, 2, 3],
        distance: 4.358898943540674,
      });
    });

    it('should return all neighbors if the k >= points.length', () => {
      // Act
      const actual = kdtree.search([3, 5, 7], points.length);

      // Assert
      expect(actual).toHaveLength(points.length);
      expect(actual[0]).toMatchObject({
        index: 13,
        point: [4, 5, 4],
        distance: 3.1622776601683795,
      });
    });

    it('should throw RangeError if the k is invalid', () => {
      // Assert
      expect(() => {
        // Act
        kdtree.search([0, 1, 2], 0);
      }).toThrowError(RangeError);
    });
  });

  describe('searchNearest', () => {
    let kdtree: KDTree<Point3>;
    beforeEach(() => {
      kdtree = KDTree.build(points, euclidean());
    });

    it('should return the nearest neighbor to the given point', () => {
      // Act
      const actual = kdtree.searchNearest([9, 3, 4]);

      // Assert
      expect(actual).toMatchObject({
        index: 8,
        point: [7, 2, 2],
        distance: 3.0,
      });
    });

    it('should return the nearest neighbor if the given point exists', () => {
      // Act
      const actual = kdtree.searchNearest([5, 0, 0]);

      // Assert
      expect(actual).toMatchObject({
        index: 6,
        point: [5, 0, 0],
        distance: 0.0,
      });
    });
  });

  describe('searchRadius', () => {
    let kdtree: KDTree<Point3>;
    beforeEach(() => {
      kdtree = KDTree.build(points, euclidean());
    });

    it('should return the neighbors in the given radius to the given point', () => {
      // Act
      const actual = kdtree.searchRadius([2, 5, 6], 3.0);

      // Assert
      expect(actual).toHaveLength(2);
      expect(actual[0]).toMatchObject({
        index: 12,
        point: [2, 3, 4],
        distance: 2.8284271247461903,
      });
      expect(actual[1]).toMatchObject({
        index: 13,
        point: [4, 5, 4],
        distance: 2.8284271247461903,
      });
    });

    it('should return an empty array if no neighbors exist', () => {
      // Act
      const actual = kdtree.searchRadius([2, 5, 6], 2.0);

      // Assert
      expect(actual).toBeEmpty();
    });

    it('should return the all neighbors if all points exist in the given radius', () => {
      // Act
      const actual = kdtree.searchRadius([2, 5, 6], 100.0);

      // Assert
      expect(actual).toHaveLength(14);
    });

    it('should throw RangeError if the given radius is not positive', () => {
      // Assert
      expect(() => {
        kdtree.searchRadius([2, 5, 6], 0.0);
      }).toThrowError(RangeError);
    });
  });
});

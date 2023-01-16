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

  describe('nearest', () => {
    let kdtree: KDTree<Point3>;
    beforeEach(() => {
      kdtree = KDTree.build(points, euclidean());
    });

    it('should return the nearest neighbor to the given point', () => {
      // Act
      const actual = kdtree.nearest([9, 3, 4]);

      // Assert
      expect(actual).toMatchObject({
        index: 8,
        point: [7, 2, 2],
        distance: 3.0,
      });
    });

    it('should return the nearest neighbor if the given point exists', () => {
      // Act
      const actual = kdtree.nearest([5, 0, 0]);

      // Assert
      expect(actual).toMatchObject({
        index: 6,
        point: [5, 0, 0],
        distance: 0.0,
      });
    });
  });

  describe('search', () => {
    let kdtree: KDTree<Point3>;
    beforeEach(() => {
      kdtree = KDTree.build(points, euclidean());
    });

    it('should return the neighbors to the given point', () => {
      // Act
      const actual = kdtree.search([2, 5, 6], 3.0);

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
      const actual = kdtree.search([2, 5, 6], 2.0);

      // Assert
      expect(actual).toBeEmpty();
    });

    it('should throw RangeError if the given radius is not positive', () => {
      // Assert
      expect(() => {
        kdtree.search([2, 5, 6], 0.0);
      }).toThrowError(RangeError);
    });
  });
});

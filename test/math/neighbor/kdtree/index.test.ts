import { KDTreeSearch, Point3, euclidean } from '@internal/math';
import { AssertionError } from '@internal/utils';
import { describe, expect, it } from 'vitest';

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
    it('should build a KDTree from the provided points', () => {
      // Act
      const actual = KDTreeSearch.build(points, euclidean);

      // Assert
      expect(actual).toBeDefined();
    });

    it('should throw an AssertionError if no points are provided', () => {
      // Assert
      expect(() => {
        // Act
        KDTreeSearch.build([], euclidean);
      }).toThrowError(AssertionError);
    });
  });

  describe('search', () => {
    it('should return the k nearest neighbors to the given point', () => {
      // Act
      const kdtreeSearch = KDTreeSearch.build(points, euclidean);
      const actual = kdtreeSearch.search([2, 5, 6], 3);

      console.info(actual);

      // Assert
      expect(actual).toHaveLength(3);
      expect(actual[0]).toMatchObject({
        index: 12,
        distance: 2.8284271247461903,
      });
      expect(actual[1]).toMatchObject({
        index: 13,
        distance: 2.8284271247461903,
      });
      expect(actual[2]).toMatchObject({
        index: 0,
        distance: 4.358898943540674,
      });
    });

    it('should return all neighbors if the specified k is greater than or equal to the total number of points', () => {
      // Act
      const kdtreeSearch = KDTreeSearch.build(points, euclidean);
      const actual = kdtreeSearch.search([3, 5, 7], points.length + 1);

      // Assert
      expect(actual).toHaveLength(points.length);
      expect(actual[0]).toMatchObject({
        index: 13,
        distance: 3.1622776601683795,
      });
    });

    it('should throw an AssertionError if the specified k is not a positive integer', () => {
      // Arrange
      const kdtreeSearch = KDTreeSearch.build(points, euclidean);

      // Assert
      expect(() => {
        // Act
        kdtreeSearch.search([0, 1, 2], 0);
      }).toThrowError(AssertionError);
    });
  });

  describe('searchNearest', () => {
    it('should return the nearest neighbors to the given point', () => {
      // Act
      const kdtreeSearch = KDTreeSearch.build(points, euclidean);
      const actual = kdtreeSearch.searchNearest([9, 3, 4]);

      // Assert
      expect(actual).toMatchObject({
        index: 2,
        distance: 0.0,
      });
    });

    it('should return the nearest neighbor even if the given point exists in the points array', () => {
      // Act
      const kdtreeSearch = KDTreeSearch.build(points, euclidean);
      const actual = kdtreeSearch.searchNearest([5, 0, 0]);

      // Assert
      expect(actual).toMatchObject({
        index: 6,
        distance: 0.0,
      });
    });
  });

  describe('searchRadius', () => {
    it('should return the neighbors within the specified radius from the given point', () => {
      // Act
      const kdtreeSearch = KDTreeSearch.build(points, euclidean);
      const actual = kdtreeSearch.searchRadius([2, 5, 6], 3.0);

      // Assert
      expect(actual).toHaveLength(2);
      expect(actual[0]).toMatchObject({
        index: 12,
        distance: 2.8284271247461903,
      });
      expect(actual[1]).toMatchObject({
        index: 13,
        distance: 2.8284271247461903,
      });
    });

    it('should return an empty array if no neighbors are within the specified radius', () => {
      // Act
      const kdtreeSearch = KDTreeSearch.build(points, euclidean);
      const actual = kdtreeSearch.searchRadius([2, 5, 6], 2.0);

      // Assert
      expect(actual).toBeEmpty();
    });

    it('should return the all neighbors if all points are within the specified radius', () => {
      // Act
      const kdtreeSearch = KDTreeSearch.build(points, euclidean);
      const actual = kdtreeSearch.searchRadius([2, 5, 6], 100.0);

      // Assert
      expect(actual).toHaveLength(14);
    });

    it('should throw an AssertionError if the specified radius is not a positive number', () => {
      // Arrange
      const kdtreeSearch = KDTreeSearch.build(points, euclidean);

      // Assert
      expect(() => {
        kdtreeSearch.searchRadius([2, 5, 6], 0.0);
      }).toThrowError(AssertionError);
    });
  });
});

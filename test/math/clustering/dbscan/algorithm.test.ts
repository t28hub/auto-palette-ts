import { DBSCAN, type Point2, Vector, euclidean } from '@internal/math';
import { AssertionError } from '@internal/utils';
import { describe, expect, it } from 'vitest';

const points: Point2[] = [
  [0, 0], // 0
  [0, 1], // 0
  [0, 7], // 1
  [0, 8], // 1
  [1, 0], // 0
  [1, 1], // 0
  [1, 2], // 0
  [1, 7], // 1
  [1, 8], // 1
  [2, 1], // 0
  [2, 2], // 0
  [4, 3], // 2
  [4, 4], // 2
  [4, 5], // 2
  [5, 3], // 2
  [5, 4], // 2
  [9, 8], // Outlier
];

describe('DBSCAN', () => {
  describe('constructor', () => {
    it('should create a new DBSCAN instance', () => {
      // Actual
      const actual = new DBSCAN(10, 2.5, euclidean);

      // Assert
      expect(actual).toBeDefined();
    });

    it('should throw an AssertionError if minPoint is less than 1', () => {
      // Assert
      expect(() => {
        // Actual
        new DBSCAN(0, 2.5, euclidean);
      }).toThrowError(AssertionError);
    });

    it('should throw an AssertionError if epsilon is less than 0.0', () => {
      // Assert
      expect(() => {
        // Actual
        new DBSCAN(10, -1.0, euclidean);
      }).toThrowError(AssertionError);
    });
  });

  describe('fit', () => {
    it('should cluster the provided points', () => {
      // Act
      const dbscan = new DBSCAN(4, 2.0, euclidean);
      const actual = dbscan.fit(points);

      // Assert
      expect(actual).toHaveLength(3);
      expect(actual[0].size).toEqual(7);
      expect(actual[0]).toMatchObject({
        centroid: new Vector([1, 1]),
        memberships: new Set([0, 1, 4, 5, 6, 9, 10]),
      });
      expect(actual[1].size).toEqual(4);
      expect(actual[1]).toMatchObject({
        centroid: new Vector([0.5, 7.5]),
        memberships: new Set([2, 3, 7, 8]),
      });
      expect(actual[2].size).toEqual(5);
      expect(actual[2]).toMatchObject({
        centroid: new Vector([4.4, 3.8000000000000003]),
        memberships: new Set([11, 12, 13, 14, 15]),
      });
    });

    it('should return an empty array if the provided points are empty', () => {
      // Act
      const dbscan = new DBSCAN(4, 2.0, euclidean);
      const actual = dbscan.fit([]);

      // Assert
      expect(actual).toHaveLength(0);
    });
  });
});

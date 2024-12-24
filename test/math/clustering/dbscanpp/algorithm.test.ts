import { DBSCANpp, type Point2, Vector, euclidean } from '@internal/math';
import { AssertionError } from '@internal/utils';
import { describe, expect, it } from 'vitest';

const points: Point2[] = [
  [0, 0], // 0
  [0, 8], // 1
  [1, 0], // 0
  [4, 3], // 2
  [5, 4], // 2
  [1, 1], // 0
  [5, 3], // 2
  [2, 2], // Outlier
  [4, 5], // 2
  [1, 2], // 0
  [1, 7], // 1
  [1, 8], // 1
  [0, 7], // 1
  [2, 1], // 0
  [9, 8], // Outlier
  [4, 4], // 2
  [0, 1], // 0
];

describe('DBSCANpp', () => {
  describe('constructor', () => {
    it('should create a new DBSCANpp instance', () => {
      // Act
      const actual = new DBSCANpp(0.25, 10, 2.5, euclidean);

      // Assert
      expect(actual).toBeDefined();
    });

    it('should throw an AssertionError if probability is less than 0.0', () => {
      // Assert
      expect(() => {
        // Act
        new DBSCANpp(0.0, 10, 2.5, euclidean);
      }).toThrowError(AssertionError);
    });

    it('should throw an AssertionError if probability is greater than 1.0', () => {
      // Assert
      expect(() => {
        // Act
        new DBSCANpp(1.1, 10, 2.5, euclidean);
      }).toThrowError(AssertionError);
    });

    it('should throw an AssertionError if minPoint is less than 1', () => {
      // Assert
      expect(() => {
        // Act
        new DBSCANpp(0.25, 0, 2.5, euclidean);
      }).toThrowError(AssertionError);
    });

    it('should throw an AssertionError if epsilon is less than 0.0', () => {
      // Assert
      expect(() => {
        // Act
        new DBSCANpp(0.25, 10, -0.1, euclidean);
      }).toThrowError(AssertionError);
    });
  });

  describe('fit', () => {
    it('should cluster the provided points', () => {
      // Act
      const dbscanpp = new DBSCANpp(0.5, 2, 2.0, euclidean);
      const actual = dbscanpp.fit(points);

      // Assert
      expect(actual).toHaveLength(3);
      expect(actual[0].size).toEqual(6);
      expect(actual[0]).toMatchObject({
        centroid: new Vector([0.8333333333333333, 0.8333333333333333]),
        memberships: new Set([0, 2, 5, 9, 13, 16]),
      });

      expect(actual[1].size).toEqual(4);
      expect(actual[1]).toMatchObject({
        centroid: new Vector([0.5, 7.5]),
        memberships: new Set([1, 10, 11, 12]),
      });

      expect(actual[2].size).toEqual(5);
      expect(actual[2]).toMatchObject({
        centroid: new Vector([4.4, 3.8000000000000003]),
        memberships: new Set([3, 4, 6, 8, 15]),
      });
    });

    it('should return an empty array if the provided points are empty', () => {
      // Act
      const dbscanpp = new DBSCANpp(0.25, 2, 2.0, euclidean);
      const actual = dbscanpp.fit([]);

      // Assert
      expect(actual).toBeArrayOfSize(0);
    });
  });
});

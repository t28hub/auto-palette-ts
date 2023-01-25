import { describe, expect, it } from 'vitest';

import { euclidean, Point2 } from '../../index';

import { DBSCAN } from './index';

const points: Point2[] = [
  [0, 0],
  [0, 1],
  [0, 7],
  [0, 8],
  [1, 0],
  [1, 1],
  [1, 2],
  [1, 7],
  [1, 8],
  [2, 1],
  [2, 2],
  [4, 3],
  [4, 4],
  [4, 5],
  [5, 3],
  [5, 4],
];

describe('DBSCAN', () => {
  describe('constructor', () => {
    it('should create a new DBSCAN', () => {
      // Actual
      const actual = new DBSCAN(10, 2.5, euclidean());

      // Assert
      expect(actual).toBeDefined();
    });

    it('should throw RangeError if minPoint < 1', () => {
      // Assert
      expect(() => {
        // Actual
        new DBSCAN(0, 2.5, euclidean());
      }).toThrowError(RangeError);
    });

    it('should throw RangeError if radius < 0.0', () => {
      // Assert
      expect(() => {
        // Actual
        new DBSCAN(10, -1.0, euclidean());
      }).toThrowError(RangeError);
    });
  });

  describe('fit', () => {
    it('should cluster the given points', () => {
      // Arrange
      const dbscan = new DBSCAN(4, 2.0, euclidean());

      // Act
      const actual = dbscan.fit(points);

      // Assert
      expect(actual).toHaveLength(3);
      expect(actual[0].size).toEqual(8);
      expect(actual[0]).toMatchObject({
        points: [
          [1, 0],
          [0, 1],
          [0, 0],
          [1, 1],
          [1, 2],
          [2, 1],
          [2, 2],
          [0, 0],
        ],
      });
      expect(actual[1].size).toEqual(4);
      expect(actual[1]).toMatchObject({
        points: [
          [1, 8],
          [0, 8],
          [1, 7],
          [0, 7],
        ],
      });
      expect(actual[2].size).toEqual(5);
      expect(actual[2]).toMatchObject({
        points: [
          [5, 3],
          [4, 5],
          [4, 4],
          [5, 4],
          [4, 3],
        ],
      });
    });
  });
});

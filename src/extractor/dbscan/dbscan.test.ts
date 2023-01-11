import { describe, expect, it } from 'vitest';

import { euclidean, Point2, squaredEuclidean } from '../../math';

import { DBSCAN } from './dbscan';
import { LinearSearch } from './linear';

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

describe('dbscan', () => {
  describe('constructor', () => {
    it('should create a new DBSCAN', () => {
      // Actual
      const actual = new DBSCAN(10, 2.5, new LinearSearch(points, euclidean()));

      // Assert
      expect(actual).toBeDefined();
    });

    it('should throw RangeError if minPoint < 1', () => {
      // Assert
      expect(() => {
        // Actual
        new DBSCAN(0, 2.5, new LinearSearch(points, euclidean()));
      }).toThrowError(RangeError);
    });

    it('should throw RangeError if radius < 0.0', () => {
      // Assert
      expect(() => {
        // Actual
        new DBSCAN(10, -1.0, new LinearSearch(points, euclidean()));
      }).toThrowError(RangeError);
    });
  });

  describe('predict', () => {
    it('should cluster the given points', () => {
      // Arrange
      const nns = new LinearSearch(points, squaredEuclidean());
      const dbscan = new DBSCAN(4, 2.0, nns);

      // Act
      const actual = dbscan.fit(points);

      // Assert
      expect(actual).toHaveLength(2);
      expect(actual[0].size).toEqual(7);
      expect(actual[0]).toMatchObject({
        children: [
          [0, 0],
          [1, 1],
          [1, 0],
          [1, 2],
          [2, 1],
          [2, 2],
          [0, 1],
        ],
      });
      expect(actual[1].size).toEqual(5);
      expect(actual[1]).toMatchObject({
        children: [
          [4, 3],
          [4, 5],
          [5, 4],
          [5, 3],
          [4, 4],
        ],
      });
    });
  });
});

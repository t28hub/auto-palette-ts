import { beforeEach, describe, it } from 'vitest';

import { euclidean } from '../distance';
import { Point2 } from '../types';

import { HDBSCAN } from './hdbscan';

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
  [8, 4],
  [8, 4],
  [8, 5],
  [8, 7],
  [8, 8],
];

describe('HDBSCAN', () => {
  describe('constructor', () => {
    it('should create a HDBSCAN', () => {
      // Act
      const actual = new HDBSCAN(16, euclidean());

      // Assert
      expect(actual).toBeDefined();
    });
  });

  describe('fit', () => {
    let hdbscan: HDBSCAN<Point2>;
    beforeEach(() => {
      hdbscan = new HDBSCAN<Point2>(4, euclidean());
    });

    it('should return clusters', () => {
      // Act
      const actual = hdbscan.fit(points);

      // Assert
      expect(actual).toBeEmpty();
    });

    it('should return an empty clusters if the given points is empty', () => {
      // Act
      const actual = hdbscan.fit([]);

      // Assert
      expect(actual).toBeEmpty();
    });
  });
});

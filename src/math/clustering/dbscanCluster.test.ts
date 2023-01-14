import { describe, expect, it } from 'vitest';

import { Point2 } from '../types';

import { DBSCANCluster } from './dbscanCluster';

describe('DBSCANCluster', () => {
  describe('constructor', () => {
    it('should create a new cluster with initial points', () => {
      // Act
      const actual = new DBSCANCluster([
        [0, 1],
        [1, 3],
        [3, 5],
      ]);

      // Assert
      expect(actual).toMatchObject({
        size: 3,
        isEmpty: false,
        points: [
          [0, 1],
          [1, 3],
          [3, 5],
        ],
      });
    });

    it('should create a new cluster with an empty array', () => {
      // Act
      const actual = new DBSCANCluster([]);

      // Assert
      expect(actual).toMatchObject({
        size: 0,
        isEmpty: true,
        points: [],
      });
    });
  });

  describe('centroid', () => {
    it('should compute the centroid of the cluster', () => {
      // Act
      const cluster = new DBSCANCluster([
        [2, 1],
        [1, 3],
        [3, 5],
      ]);
      const actual = cluster.centroid();

      // Assert
      expect(actual).toEqual([2, 3]);
    });

    it('should throw Error if the cluster is empty', () => {
      // Arrange
      const cluster = new DBSCANCluster([]);

      // Assert
      expect(() => {
        // Act
        cluster.centroid();
      }).toThrowError(Error);
    });
  });

  describe('append', () => {
    it('should append the given point', () => {
      // Act
      const cluster = new DBSCANCluster<Point2>([]);
      cluster.append([0, 1]);
      cluster.append([2, 4]);

      // Assert
      expect(cluster).toMatchObject({
        size: 2,
        isEmpty: false,
        points: [
          [0, 1],
          [2, 4],
        ],
      });
    });
  });
});

import { describe, expect, it } from 'vitest';

import { Point2 } from '../point';

import { MutableCluster } from './cluster';

describe('MutableCluster', () => {
  describe('constructor', () => {
    it('should create a new cluster', () => {
      // Act
      const actual = new MutableCluster(0);

      // Assert
      expect(actual).toBeDefined();
      expect(actual.size).toEqual(0);
      expect(actual.isEmpty).toBeTrue();
    });

    it('should create a new cluster with initial points', () => {
      // Act
      const points: Point2[] = [
        [0.0, 0.1],
        [0.5, 0.3],
        [1.1, 0.7],
      ];
      const actual = new MutableCluster(0, points);

      // Assert
      expect(actual).toBeDefined();
      expect(actual.size).toEqual(3);
      expect(actual.isEmpty).toBeFalse();
    });
  });

  describe('getPoints', () => {
    it('should return the all points of the cluster', () => {
      // Arrange
      const cluster = new MutableCluster(0);
      cluster.add([0.0, 1.0]);
      cluster.add([0.1, 0.3]);
      cluster.add([0.5, 1.0]);

      // Act
      const actual = cluster.getPoints();

      // Assert
      expect(actual).toEqual([
        [0.0, 1.0],
        [0.1, 0.3],
        [0.5, 1.0],
      ]);
    });

    it('should return an empty array if the cluster is empty', () => {
      // Act
      const cluster = new MutableCluster(0);
      const actual = cluster.getPoints();

      // Assert
      expect(actual).toBeEmpty();
    });
  });

  describe('computeCentroid', () => {
    it('should compute the centroid of the cluster', () => {
      // Arrange
      const cluster = new MutableCluster(0);
      cluster.add([2.0, 1.0]);
      cluster.add([3.0, 5.0]);
      cluster.add([7.0, 3.0]);

      // Act
      const actual = cluster.computeCentroid();

      // Assert
      expect(actual).toEqual([4.0, 3.0]);
    });

    it('should throw Error if the cluster is empty', () => {
      // Arrange
      const cluster = new MutableCluster(0);

      // Act & Assert
      expect(() => {
        cluster.computeCentroid();
      }).toThrowError(Error);
    });
  });

  describe('add', () => {
    it('should add a point to the cluster', () => {
      // Act
      const cluster = new MutableCluster(0);
      cluster.add([1.0, 2.0]);
      cluster.add([2.0, 3.0]);

      // Assert
      expect(cluster.size).toEqual(2);
      expect(cluster.isEmpty).toBeFalse();
      expect(cluster.getPoints()).toEqual([
        [1.0, 2.0],
        [2.0, 3.0],
      ]);
    });
  });

  describe('clear', () => {
    it('should clear all point of the cluster', () => {
      // Arrange
      const cluster = new MutableCluster(0);
      cluster.add([1.0, 2.0]);
      cluster.add([2.0, 3.0]);
      cluster.add([3.0, 5.0]);

      // Act
      cluster.clear();

      // Assert
      expect(cluster.size).toEqual(0);
      expect(cluster.isEmpty).toBeTrue();
      expect(cluster.getPoints()).toBeEmpty();
    });
  });
});

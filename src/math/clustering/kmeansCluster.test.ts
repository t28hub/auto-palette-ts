import { describe, expect, it } from 'vitest';

import { euclidean } from '../../math';

import { KmeansCluster } from './kmeansCluster';

describe('KmeansCluster', () => {
  describe('constructor', () => {
    it('should create a new cluster', () => {
      // Act
      const actual = new KmeansCluster([1, 2, 3], euclidean());

      // Assert
      expect(actual).toBeDefined();
      expect(actual.size).toEqual(0);
      expect(actual.isEmpty).toBeTrue();
      expect(actual.centroid()).toEqual([1, 2, 3]);
    });

    it('should throw TypeError if the initialCentroid contains infinite number', () => {
      // Assert
      expect(() => {
        // Act
        new KmeansCluster([1, 2, NaN], euclidean());
      }).toThrowError(TypeError);
    });
  });

  describe('centroid', () => {
    it('should return centroid of this cluster', () => {
      // Act
      const cluster = new KmeansCluster([1, 2, 3], euclidean());
      const actual = cluster.centroid();

      // Assert
      expect(actual).toEqual([1, 2, 3]);
    });
  });

  describe('updateCenter', () => {
    it('should update the centroid', () => {
      // Arrange
      const cluster = new KmeansCluster([0, 0, 0], euclidean());
      cluster.append([2, 0, 0]);
      cluster.append([1, 1, 0]);
      cluster.append([0, 5, 0]);

      // Act
      const actual = cluster.updateCenter();

      // Assert
      expect(actual).toEqual(Math.sqrt(5));
      expect(cluster.centroid()).toEqual([1, 2, 0]);
    });

    it('should not update the centroid if cluster is empty', () => {
      // Arrange
      const cluster = new KmeansCluster([0, 0, 0], euclidean());

      // Act
      const actual = cluster.updateCenter();

      // Assert
      expect(actual).toEqual(0.0);
      expect(cluster.centroid()).toEqual([0, 0, 0]);
    });
  });

  describe('append', () => {
    it('should append a point to cluster', () => {
      // Act
      const cluster = new KmeansCluster([0, 0, 0], euclidean());
      cluster.append([1, 2, 3]);
      cluster.append([2, 3, 5]);
      cluster.append([3, 5, 8]);

      // Assert
      expect(cluster.size).toEqual(3);
      expect(cluster.isEmpty).toBeFalse();
      expect(cluster.centroid()).toEqual([0, 0, 0]);
    });
  });

  describe('clear', () => {
    it('should clear all points of cluster', () => {
      // Arrange
      const cluster = new KmeansCluster([0, 0, 0], euclidean());
      cluster.append([1, 2, 3]);
      cluster.append([3, 3, 3]);

      // Act
      cluster.clear();

      // Assert
      expect(cluster.size).toEqual(0);
      expect(cluster.isEmpty).toBeTrue();
      expect(cluster.centroid()).toEqual([0, 0, 0]);
    });
  });

  describe('distanceTo', () => {
    it('should compute euclidean distance', () => {
      // Act
      const cluster = new KmeansCluster([0, 0, 0], euclidean());
      const actual = cluster.distanceTo([1, 2, 3]);

      // Assert
      expect(actual).toEqual(Math.sqrt(1 + 4 + 9));
    });

    it('should throw TypeError if the point contains infinite number', () => {
      const cluster = new KmeansCluster([0, 0, 0], euclidean());

      // Assert
      expect(() => {
        cluster.distanceTo([1, 2, NaN]);
      }).toThrowError(TypeError);
    });
  });
});

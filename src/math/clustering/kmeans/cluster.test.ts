import { describe, expect, it } from 'vitest';

import { euclidean } from '../../index';

import { KmeansCluster } from './cluster';

describe('KmeansCluster', () => {
  describe('constructor', () => {
    it('should create a new cluster', () => {
      // Act
      const actual = new KmeansCluster(0, [1, 2, 3], euclidean());

      // Assert
      expect(actual).toBeDefined();
      expect(actual.size).toEqual(0);
      expect(actual.isEmpty).toBeTrue();
      expect(actual.computeCentroid()).toEqual([1, 2, 3]);
    });

    it('should throw TypeError if the initialCentroid contains infinite number', () => {
      // Act & Assert
      expect(() => {
        new KmeansCluster(0, [1, 2, NaN], euclidean());
      }).toThrowError(TypeError);
    });
  });

  describe('computeCentroid', () => {
    it('should return centroid of this cluster', () => {
      // Act
      const cluster = new KmeansCluster(0, [1, 2, 3], euclidean());
      const actual = cluster.computeCentroid();

      // Assert
      expect(actual).toEqual([1, 2, 3]);
    });
  });

  describe('updateCentroid', () => {
    it('should update the centroid', () => {
      // Arrange
      const cluster = new KmeansCluster(0, [0, 0, 0], euclidean());
      cluster.add([2, 0, 0]);
      cluster.add([1, 1, 0]);
      cluster.add([0, 5, 0]);

      // Act
      const actual = cluster.updateCentroid();

      // Assert
      expect(actual).toEqual(Math.sqrt(5));
      expect(cluster.computeCentroid()).toEqual([1, 2, 0]);
    });

    it('should not update the centroid if cluster is empty', () => {
      // Arrange
      const cluster = new KmeansCluster(0, [0, 0, 0], euclidean());

      // Act
      const actual = cluster.updateCentroid();

      // Assert
      expect(actual).toEqual(0.0);
      expect(cluster.computeCentroid()).toEqual([0, 0, 0]);
    });
  });

  describe('distanceTo', () => {
    it('should compute euclidean distance', () => {
      // Act
      const cluster = new KmeansCluster(0, [0, 0, 0], euclidean());
      const actual = cluster.distanceTo([1, 2, 3]);

      // Assert
      expect(actual).toEqual(Math.sqrt(1 + 4 + 9));
    });

    it('should throw TypeError if the point contains infinite number', () => {
      const cluster = new KmeansCluster(0, [0, 0, 0], euclidean());

      // Act & Assert
      expect(() => {
        cluster.distanceTo([1, 2, NaN]);
      }).toThrowError(TypeError);
    });
  });
});

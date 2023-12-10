import { Cluster, Point2, Vector } from '@internal/math';
import { AssertionError } from '@internal/utils';
import { describe, expect, it } from 'vitest';

describe('Cluster', () => {
  describe('constructor', () => {
    it('should create a new Cluster instance with a point', () => {
      // Act
      const initialCentroid: Point2 = [0.0, 1.0];
      const actual = new Cluster(initialCentroid);

      // Assert
      expect(actual.size).toEqual(0);
      expect(actual.isEmpty).toBeTrue();
      expect(actual.getCentroid()).toStrictEqual([0.0, 1.0]);
      expect(actual.getMemberships()).toBeEmpty();
    });

    it('should create a new Cluster instance with a vector', () => {
      // Act
      const initialCentroid = new Vector([0.0, 1.0]);
      const actual = new Cluster(initialCentroid);

      // Assert
      expect(actual.size).toEqual(0);
      expect(actual.isEmpty).toBeTrue();
      expect(actual.getCentroid()).toStrictEqual([0.0, 1.0]);
      expect(actual.getMemberships()).toBeEmpty();
    });
  });

  describe('getCentroid', () => {
    it('should return the centroid of the cluster', () => {
      // Act
      const cluster = new Cluster([2.0, 3.0]);
      const actual = cluster.getCentroid();

      // Assert
      expect(actual).toEqual([2.0, 3.0]);
    });
  });

  describe('getMemberships', () => {
    it('should return the set of indices of points in the cluster', () => {
      // Arrange
      const cluster = new Cluster([0.0, 0.0]);
      cluster.addMember(1, [1.0, 2.0]);
      cluster.addMember(2, [2.0, 3.0]);

      // Act
      const actual = cluster.getMemberships();

      // Assert
      expect(actual).toEqual(new Set([1, 2]));
    });
  });

  describe('addMember', () => {
    it('should add a point to the cluster and update the centroid', () => {
      // Act
      const cluster = new Cluster([0.0, 0.0]);
      cluster.addMember(1, [1.0, 2.0]);
      cluster.addMember(2, [2.0, 3.0]);

      // Assert
      expect(cluster.size).toEqual(2);
      expect(cluster.isEmpty).toBeFalse();
      expect(cluster.getCentroid()).toStrictEqual([1.5, 2.5]);
      expect(cluster.getMemberships()).toEqual(new Set([1, 2]));
    });

    it('should not add a point to the cluster if the point already exists', () => {
      // Arrange
      const cluster = new Cluster([0.0, 0.0]);
      cluster.addMember(1, [1.0, 2.0]);

      // Act
      cluster.addMember(1, [1.0, 2.0]);

      // Assert
      expect(cluster.size).toEqual(1);
      expect(cluster.getCentroid()).toStrictEqual([1.0, 2.0]);
      expect(cluster.getMemberships()).toEqual(new Set([1]));
    });

    it('should throw an AssertionError when index is less than 0', () => {
      // Arrange
      const cluster = new Cluster([0.0, 0.0]);

      // Act & Assert
      expect(() => {
        cluster.addMember(-1, [1.0, 2.0]);
      }).toThrow(AssertionError);
    });
  });

  describe('clear', () => {
    it('should clear all points from the cluster', () => {
      // Arrange
      const cluster = new Cluster([0.0, 0.0]);
      cluster.addMember(1, [1.0, 2.0]);
      cluster.addMember(2, [2.0, 3.0]);
      cluster.addMember(3, [3.0, 5.0]);

      // Act
      cluster.clear();

      // Assert
      expect(cluster.size).toEqual(0);
      expect(cluster.isEmpty).toBeTrue();
      expect(cluster.getCentroid()).toStrictEqual([0.0, 0.0]);
    });
  });
});

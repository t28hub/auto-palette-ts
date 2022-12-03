import { Cluster } from './cluster';

describe('cluster', () => {
  describe('constructor', () => {
    it('should create a new cluster', () => {
      // Act
      const actual = new Cluster([1, 2, 3]);

      // Assert
      expect(actual.size).toEqual(0);
      expect(actual.isEmpty).toEqual(true);
      expect(actual.getCentroid()).toEqual([1, 2, 3]);
    });

    it('should throw TypeError if the initialCentroid contains infinite number', () => {
      // Assert
      expect(() => {
        // Act
        new Cluster([1, 2, NaN]);
      }).toThrowError(TypeError);
    });
  });

  describe('getCentroid', () => {
    it('should return centroid of this cluster', () => {
      // Act
      const cluster = new Cluster([1, 2, 3]);
      const actual = cluster.getCentroid();

      // Assert
      expect(actual).toEqual([1, 2, 3]);
    });
  });

  describe('updateCenter', () => {
    it('should update the centroid', () => {
      // Arrange
      const cluster = new Cluster([0, 0, 0]);
      cluster.insert([2, 0, 0]);
      cluster.insert([1, 1, 0]);
      cluster.insert([0, 5, 0]);

      // Act
      const actual = cluster.updateCentroid();

      // Assert
      expect(actual).toEqual(Math.sqrt(5));
      expect(cluster.getCentroid()).toEqual([1, 2, 0]);
    });

    it('should not update the centroid if cluster is empty', () => {
      // Arrange
      const cluster = new Cluster([0, 0, 0]);

      // Act
      const actual = cluster.updateCentroid();

      // Assert
      expect(actual).toEqual(0.0);
      expect(cluster.getCentroid()).toEqual([0, 0, 0]);
    });
  });

  describe('insert', () => {
    it('should insert a point to cluster', () => {
      // Act
      const cluster = new Cluster([0, 0, 0]);
      cluster.insert([1, 2, 3]);

      // Assert
      expect(cluster.size).toEqual(1);
      expect(cluster.isEmpty).toEqual(false);
    });
  });

  describe('clear', () => {
    it('should clear all points of cluster', () => {
      // Arrange
      const cluster = new Cluster([0, 0, 0]);
      cluster.insert([1, 2, 3]);
      cluster.insert([3, 3, 3]);

      // Act
      cluster.clear();

      // Assert
      expect(cluster.size).toEqual(0);
      expect(cluster.isEmpty).toEqual(true);
    });
  });

  describe('distanceTo', () => {
    it('should compute euclidean distance', () => {
      // Act
      const cluster = new Cluster([0, 0, 0]);
      const actual = cluster.distanceTo([1, 2, 3]);

      // Assert
      expect(actual).toEqual(Math.sqrt(1 + 4 + 9));
    });

    it('should throw TypeError if the point contains infinite number', () => {
      const cluster = new Cluster([0, 0, 0]);

      // Assert
      expect(() => {
        cluster.distanceTo([1, 2, NaN]);
      }).toThrowError(TypeError);
    });
  });
});

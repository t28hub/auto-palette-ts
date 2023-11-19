import { beforeEach, describe, expect, test } from 'vitest';

import { Distance } from '../../distance';

import { HierarchicalClustering } from './algorithm';

describe('HierarchicalClustering', () => {
  describe('constructor', () => {
    test('should create an instance with a distance function', () => {
      // Act
      const actual = new HierarchicalClustering((a: number, b: number): Distance => {
        return Math.abs(b - a) as Distance;
      });

      // Assert
      expect(actual).toBeInstanceOf(HierarchicalClustering);
    });
  });

  describe('fit', () => {
    let clustering: HierarchicalClustering<number>;
    beforeEach(() => {
      clustering = new HierarchicalClustering((a: number, b: number): Distance => {
        return Math.abs(b - a) as Distance;
      });
    });

    test('should return a dendrogram for valid data', () => {
      // Act
      const dendrogram = clustering.fit([1.1, 0.9, 10.0, 1.0, 11.0]);

      // Assert
      expect(dendrogram).toBeDefined();
      expect(dendrogram.length).toBe(5);
      expect(dendrogram.partition(2)).toStrictEqual([0, 0, 1, 0, 1]);
    });

    test('should throw error if data size is less than 2', () => {
      // Assert
      expect(() => {
        // Act
        clustering.fit([1]);
      }).toThrow('The size of the data(1) is less than 2.');
    });
  });
});

import { describe, expect, it } from 'vitest';

import { Point2, squaredEuclidean } from '../../../math';

import { LinearSearch } from './index';

const points: Point2[] = [
  [0, 0],
  [0, 1],
  [1, 0],
  [2, 2],
  [3, 4],
  [4, 4],
  [4, 3],
  [5, 4],
  [4, 5],
  [8, 4],
  [8, 8],
];

describe('LinearSearch', () => {
  describe('constructor', () => {
    it('should create a new LinearSearch instance', () => {
      // Act
      const actual = new LinearSearch(points, squaredEuclidean);

      // Assert
      expect(actual).toBeDefined();
    });

    it('should throw TypeError if the provided points array is empty', () => {
      // Assert
      expect(() => {
        new LinearSearch([], squaredEuclidean);
      }).toThrowError(TypeError);
    });
  });

  describe('search', () => {
    it('should return the k nearest neighbors to the specified point', () => {
      // Act
      const linearSearch = new LinearSearch(points, squaredEuclidean);
      const actual = linearSearch.search([4, 4], 3);

      // Assert
      expect(actual).toHaveLength(3);
      expect(actual[0]).toMatchObject({
        index: 5,
        distance: 0,
      });
      expect(actual[1]).toMatchObject({
        index: 6,
        distance: 1,
      });
      expect(actual[2]).toMatchObject({
        index: 4,
        distance: 1,
      });
    });

    it('should return all points if the specified k is greater than the number of points', () => {
      // Act
      const linearSearch = new LinearSearch(points, squaredEuclidean);
      const actual = linearSearch.search([3, 5], points.length + 1);

      // Assert
      expect(actual).toHaveLength(points.length);
      expect(actual[0]).toMatchObject({
        index: 8,
        distance: 1,
      });
    });

    it('should throw RangeError if the specified k is not a positive integer', () => {
      // Arrange
      const linearSearch = new LinearSearch(points, squaredEuclidean);

      // Assert
      expect(() => {
        // Act
        linearSearch.search([0, 3], 0);
      }).toThrowError(RangeError);
    });
  });

  describe('searchNearest', () => {
    it('should return the nearest neighbor to the specified point', () => {
      // Act
      const linearSearch = new LinearSearch(points, squaredEuclidean);
      const actual = linearSearch.searchNearest([1, 2]);

      // Assert
      expect(actual).toMatchObject({
        index: 3,
        distance: 1.0,
      });
    });

    it('should return the nearest neighbor if the specified point exists in the points array', () => {
      // Act
      const linearSearch = new LinearSearch(points, squaredEuclidean);
      const actual = linearSearch.searchNearest([4, 4]);

      // Assert
      expect(actual).toMatchObject({
        index: 5,
        distance: 0.0,
      });
    });
  });

  describe('searchRadius', () => {
    it('should return the neighbors within the specified radius from the given point', () => {
      // Act
      const linearSearch = new LinearSearch(points, squaredEuclidean);
      const actual = linearSearch.searchRadius([3, 5], 1);

      // Assert
      expect(actual).toHaveLength(2);
      expect(actual[0]).toMatchObject({
        index: 4,
        distance: 1,
      });
      expect(actual[1]).toMatchObject({
        index: 8,
        distance: 1,
      });
    });

    it('should return an empty array if no neighbors within the specified radius', () => {
      // Act
      const linearSearch = new LinearSearch(points, squaredEuclidean);
      const actual = linearSearch.searchRadius([-1, -4], 1);

      // Assert
      expect(actual).toBeEmpty();
    });

    it('should throw RangeError if the given radius is negative', () => {
      // Arrange
      const linearSearch = new LinearSearch(points, squaredEuclidean);

      // Assert
      expect(() => {
        // Act
        linearSearch.searchRadius([2, 2], -1);
      }).toThrowError(RangeError);
    });
  });
});

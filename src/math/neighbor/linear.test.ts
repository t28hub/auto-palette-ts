import { beforeEach, describe, it } from 'vitest';

import { Point2, squaredEuclidean } from '../../math';

import { LinearSearch } from './linear';

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
    it('should create a new LinearSearch', () => {
      // Act
      const actual = new LinearSearch(points, squaredEuclidean());

      // Assert
      expect(actual).toBeDefined();
    });

    it('should throw TypeError if the given points is empty', () => {
      // Assert
      expect(() => {
        new LinearSearch([], squaredEuclidean());
      }).toThrowError(TypeError);
    });
  });

  describe('nearest', () => {
    let linearSearch: LinearSearch<Point2>;
    beforeEach(() => {
      linearSearch = new LinearSearch(points, squaredEuclidean());
    });

    it('should return the nearest neighbor to the given point', () => {
      // Act
      const actual = linearSearch.nearest([1, 2]);

      // Assert
      expect(actual).toMatchObject({
        index: 3,
        point: [2, 2],
        distance: 1.0,
      });
    });

    it('should return the nearest neighbor if the given point exists', () => {
      // Act
      const actual = linearSearch.nearest([4, 4]);

      // Assert
      expect(actual).toMatchObject({
        index: 5,
        point: [4, 4],
        distance: 0.0,
      });
    });
  });

  describe('search', () => {
    let linearSearch: LinearSearch<Point2>;
    beforeEach(() => {
      linearSearch = new LinearSearch(points, squaredEuclidean());
    });

    it('should return the k nearest neighbors to the given point', () => {
      // Act
      const actual = linearSearch.search([4, 4], 3);

      // Assert
      expect(actual).toHaveLength(3);
      expect(actual[0]).toMatchObject({
        index: 5,
        point: [4, 4],
        distance: 0,
      });
      expect(actual[1]).toMatchObject({
        index: 4,
        point: [3, 4],
        distance: 1,
      });
      expect(actual[2]).toMatchObject({
        index: 6,
        point: [4, 3],
        distance: 1,
      });
    });

    it('should return all points if the given k >= points.length', () => {
      // Act
      const actual = linearSearch.search([3, 5], points.length);

      // Assert
      expect(actual).toHaveLength(points.length);
      expect(actual[0]).toMatchObject({
        index: 8,
        point: [4, 5],
        distance: 1,
      });
    });

    it('should throw RangeError if the given k is invalid', () => {
      // Assert
      expect(() => {
        // Act
        linearSearch.search([0, 3], 0);
      }).toThrowError(RangeError);
    });
  });

  describe('range', () => {
    let linearSearch: LinearSearch<Point2>;
    beforeEach(() => {
      linearSearch = new LinearSearch(points, squaredEuclidean());
    });

    it('should return the neighbors in the given radius to the given point', () => {
      // Act
      const actual = linearSearch.range([3, 5], 1);

      // Assert
      expect(actual).toHaveLength(2);
      expect(actual[0]).toMatchObject({
        index: 4,
        point: [3, 4],
        distance: 1,
      });
      expect(actual[1]).toMatchObject({
        index: 8,
        point: [4, 5],
        distance: 1,
      });
    });

    it('should return an empty array if no neighbors in the given radius', () => {
      // Act
      const actual = linearSearch.range([-1, -4], 1);

      // Assert
      expect(actual).toBeEmpty();
    });

    it('should throw RangeError if the given radius is negative', () => {
      // Assert
      expect(() => {
        // Act
        linearSearch.range([2, 2], -1);
      }).toThrowError(RangeError);
    });
  });
});

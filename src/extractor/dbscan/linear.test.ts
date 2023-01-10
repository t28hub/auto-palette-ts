import { beforeEach, describe } from 'vitest';

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
  });

  describe('search', () => {
    let linearSearch: LinearSearch<Point2>;
    beforeEach(() => {
      linearSearch = new LinearSearch(points, squaredEuclidean());
    });

    it('should return an array of neighbors', () => {
      // Act
      const actual = linearSearch.search([3, 5], 1);

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

    it('should return an empty array if no neighbors', () => {
      // Act
      const actual = linearSearch.search([-1, -4], 1);

      // Assert
      expect(actual).toBeEmpty();
    });

    it('should throw RangeError if the given radius is negative', () => {
      // Assert
      expect(() => {
        // Act
        linearSearch.search([2, 2], -1);
      }).toThrowError(RangeError);
    });
  });
});

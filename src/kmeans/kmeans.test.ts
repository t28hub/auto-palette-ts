import { Point3, SquaredEuclideanDistance } from '../math';

import { Kmeans } from './kmeans';

describe('kmeans', () => {
  describe('constructor', () => {
    it('should create a new Kmeans', () => {
      // Act
      const actual = new Kmeans();

      // Assert
      expect(actual).toBeDefined();
    });

    it('should create a new Kmeans with optional parameters', () => {
      // Act
      const actual = new Kmeans('random', SquaredEuclideanDistance, 15, Number.EPSILON);

      // Assert
      expect(actual).toBeDefined();
    });

    it.each([
      { maxIterations: NaN, minDifference: 0.01 },
      { maxIterations: 0, minDifference: 0.01 },
      { maxIterations: 10, minDifference: NaN },
      { maxIterations: 10, minDifference: -1.0 },
    ])('should throw TypeError if parameters are invalid %p', ({ maxIterations, minDifference }) => {
      // Assert
      expect(() => {
        new Kmeans('random', SquaredEuclideanDistance, maxIterations, minDifference);
      }).toThrowError(TypeError);
    });
  });

  describe('classify', () => {
    const points: Point3[] = [
      [0, 0, 0],
      [0, 0, 1],
      [1, 0, 0],
      [2, 2, 2],
      [2, 1, 2],
      [4, 4, 4],
      [4, 4, 5],
      [3, 4, 5],
    ];
    const kmeans = new Kmeans('kmeans++', SquaredEuclideanDistance);

    it.each([
      { count: 1, expected: 1 },
      { count: 3, expected: 3 },
      { count: 10, expected: 8 },
    ])('should predict $count clusters', ({ count, expected }) => {
      // Act
      const actual = kmeans.classify(points, count);

      // Assert
      expect(actual).toBeArrayOfSize(expected);
    });

    it.each([{ count: 0 }, { count: -1 }, { count: NaN }])(
      'should throw TypeError if count($count) is not positive integer',
      ({ count }) => {
        // Assert
        expect(() => {
          // Act
          kmeans.classify(points, count);
        }).toThrowError(TypeError);
      },
    );
  });
});

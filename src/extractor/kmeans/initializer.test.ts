import { beforeEach, describe, expect, it } from 'vitest';

import { euclidean, Point2, squaredEuclidean } from '../../math';

import { Initializer, kmeansPlusPlus, KmeansPlusPlusInitializer, random, RandomInitializer } from './initializer';

describe('initializer', () => {
  const points: Point2[] = [
    [0, 0],
    [1, 0],
    [2, 1],
    [4, 2],
    [4, 8],
    [8, 8],
  ];

  describe('KmeansPlusPlusInitializer', () => {
    let initializer: Initializer<Point2>;
    beforeEach(() => {
      initializer = new KmeansPlusPlusInitializer(euclidean());
    });

    it.each([
      { count: 1, expected: 1 },
      { count: 2, expected: 2 },
      { count: 4, expected: 4 },
      { count: 6, expected: 6 },
      { count: 8, expected: 6 },
    ])('should return initial $count point(s)', ({ count, expected }) => {
      // Act
      const actual = initializer.initialize(points, count);

      // Assert
      expect(actual).toBeArrayOfSize(expected);
      expect(actual).toIncludeAnyMembers(points);
    });

    it.each([{ count: -1 }, { count: 0 }, { count: NaN }])(
      'should throw TypeError if count($count) is invalid',
      ({ count }) => {
        // Assert
        expect(() => {
          // Act
          initializer.initialize(points, count);
        }).toThrowError(TypeError);
      },
    );
  });

  describe('RandomInitializer', () => {
    let initializer: Initializer<Point2>;
    beforeEach(() => {
      initializer = new RandomInitializer();
    });

    it.each([
      { count: 1, expected: 1 },
      { count: 2, expected: 2 },
      { count: 4, expected: 4 },
      { count: 6, expected: 6 },
      { count: 8, expected: 6 },
    ])('should return initial $count point(s)', ({ count, expected }) => {
      // Act
      const actual = initializer.initialize(points, count);

      // Assert
      expect(actual).toBeArrayOfSize(expected);
      expect(actual).toIncludeAnyMembers(points);
    });

    it.each([{ count: -1 }, { count: 0 }, { count: NaN }])(
      'should throw TypeError if count($count) is invalid',
      ({ count }) => {
        // Assert
        expect(() => {
          // Act
          initializer.initialize(points, count);
        }).toThrowError(TypeError);
      },
    );
  });

  describe('kmeansPlusPlus', () => {
    it('should create the KmeansPlusPlusInitializer', () => {
      // Act
      const actual = kmeansPlusPlus(squaredEuclidean());

      // Assert
      expect(actual).toBeInstanceOf(KmeansPlusPlusInitializer);
    });
  });

  describe('random', () => {
    it('should create the RandomInitializer', () => {
      // Act
      const actual = random();

      // Assert
      expect(actual).toBeInstanceOf(RandomInitializer);
    });
  });
});

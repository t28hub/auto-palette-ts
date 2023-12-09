import { KmeansPlusPlusInitializer, Point2, euclidean } from '@internal/math';
import { describe, expect, it } from 'vitest';

const points: Point2[] = [
  [0, 0],
  [1, 0],
  [2, 1],
  [4, 2],
  [4, 8],
  [8, 8],
];

describe('KmeansPlusPlusInitializer', () => {
  it.each([
    { count: 1, expected: 1 },
    { count: 2, expected: 2 },
    { count: 4, expected: 4 },
    { count: 6, expected: 6 },
    { count: 8, expected: 6 },
  ])('should choose initial $count point(s)', ({ count, expected }) => {
    // Act
    const initializer = new KmeansPlusPlusInitializer(euclidean);
    const actual = initializer.initialize(points, count);

    // Assert
    expect(actual).toBeArrayOfSize(expected);
    expect(actual).toIncludeAnyMembers(points);
  });

  it.each([{ k: -1 }, { k: 0 }, { k: NaN }])('should throw a TypeError if k($k) is invalid', ({ k }) => {
    // Arrange
    const initializer = new KmeansPlusPlusInitializer(euclidean);

    // Assert
    expect(() => {
      // Act
      initializer.initialize(points, k);
    }).toThrowError(TypeError);
  });
});

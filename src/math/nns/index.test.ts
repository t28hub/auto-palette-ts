import { describe, expect, it } from 'vitest';

import { squaredEuclidean } from '../distance';
import { Point2 } from '../point';

import { KDTree } from './kdtree';
import { LinearSearch } from './linear';

import { kdtree, linear } from './index';

const points: Point2[] = [
  [0, 2],
  [0, 1],
  [1, 3],
  [1, 1],
  [2, 4],
  [2, 1],
];

describe('nns', () => {
  it('kdtree should return a new KDTree', () => {
    // Act
    const actual = kdtree(points, squaredEuclidean);

    // Assert
    expect(actual).toBeInstanceOf(KDTree);
  });

  it('linear should return a new LinearSearch', () => {
    // Act
    const actual = linear(points, squaredEuclidean);

    // Assert
    expect(actual).toBeInstanceOf(LinearSearch);
  });
});

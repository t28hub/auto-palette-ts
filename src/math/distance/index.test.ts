import { describe, expect, it } from 'vitest';

import { EuclideanDistance } from './euclidean';
import { SquaredEuclideanDistance } from './squaredEuclidean';

import { euclidean, squaredEuclidean } from './index';

describe('distance', () => {
  it('euclidean should return the instance of EuclideanDistance', () => {
    // Act
    const actual = euclidean();

    // Assert
    expect(actual).toBeInstanceOf(EuclideanDistance);
  });

  it('squaredEuclidean should return the instance of SquaredEuclideanDistance', () => {
    // Act
    const actual = squaredEuclidean();

    // Assert
    expect(actual).toBeInstanceOf(SquaredEuclideanDistance);
  });
});

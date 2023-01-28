import { describe, it, expect } from 'vitest';

import { euclidean } from '../../distance';
import { Point2 } from '../../types';

import { CoreDistance } from './coreDistance';
import { MutualReachabilityDistance } from './mutualReachabilityDistance';

// Arrange
const points: Point2[] = [
  [0.0, 0.0], // 0
  [0.1, 0.1], // 1
  [0.2, 0.1], // 2
  [1.9, 1.1], // 3
  [2.0, 1.0], // 4
  [2.1, 0.9], // 5
  [3.0, 2.0], // 6
  [3.1, 2.1], // 7
];

describe('MutualReachabilityDistance', () => {
  describe('constructor', () => {
    it('should create a new MutualReachabilityDistance', () => {
      // Act
      const coreDistance = CoreDistance.from(points, 2, euclidean());
      const actual = new MutualReachabilityDistance(points, coreDistance, euclidean());

      // Assert
      expect(actual).toBeDefined();
    });
  });

  describe('compute', () => {
    let coreDistance: CoreDistance;
    let mutualReachabilityDistance: MutualReachabilityDistance<Point2>;
    beforeEach(() => {
      coreDistance = CoreDistance.from(points, 2, euclidean());
      mutualReachabilityDistance = new MutualReachabilityDistance(points, coreDistance, euclidean());
    });

    it('should return core distance of u', () => {
      // Act
      const actual = mutualReachabilityDistance.compute(0, 1);

      // Assert
      const expected = coreDistance.at(0);
      expect(actual).toBeCloseTo(expected);
    });

    it('should return core distance of v', () => {
      // Act
      const actual = mutualReachabilityDistance.compute(6, 7);

      // Assert
      const expected = coreDistance.at(7);
      expect(actual).toBeCloseTo(expected);
    });

    it('should return distance between u and v', () => {
      // Act
      const actual = mutualReachabilityDistance.compute(0, 7);

      // Assert
      const expected = euclidean().measure(points[0], points[7]);
      expect(actual).toBeCloseTo(expected);
    });

    it.each([
      { u: -1, v: 0 },
      { u: 0, v: -1 },
      { u: 0, v: 8 },
      { u: 8, v: 0 },
      { u: -1, v: -1 },
      { u: 8, v: 8 },
    ])('should throw RangeError if either or both indices u($u) and v($v) are invalid', ({ u, v }) => {
      // Assert
      expect(() => {
        // Act
        mutualReachabilityDistance.compute(u, v);
      }).toThrowError(RangeError);
    });
  });
});

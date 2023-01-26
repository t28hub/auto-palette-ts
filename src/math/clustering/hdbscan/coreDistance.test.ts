import { beforeEach, describe, expect, it } from 'vitest';

import { euclidean, squaredEuclidean } from '../../distance';
import { Point2 } from '../../types';

import { CoreDistance } from './coreDistance';

const points: Point2[] = [
  [0.0, 0.0],
  [1.0, 2.0],
  [0.9, 1.9],
  [1.1, 2.1],
  [2.0, 3.0],
  [2.5, 3.5],
];

describe('CoreDistance', () => {
  describe('at', () => {
    let coreDistance: CoreDistance;
    beforeEach(() => {
      coreDistance = CoreDistance.from(points, 2, squaredEuclidean());
    });

    it('should return the core distance corresponding to the given index', () => {
      // Act & Assert
      expect(coreDistance.at(0)).toBeCloseTo(1.0 + 4.0);
      expect(coreDistance.at(5)).toBeCloseTo(1.96 + 1.96);
    });

    it.each([{ index: -1 }, { index: 6 }])(
      'should throw RangeError if the index($index) is out of range',
      ({ index }) => {
        // Assert
        expect(() => {
          coreDistance.at(index);
        }).toThrowError(RangeError);
      },
    );
  });

  describe('from', () => {
    it('should create a new CoreDistanceArray', () => {
      // Act
      const actual = CoreDistance.from<Point2>(points, 2, squaredEuclidean());

      // Assert
      expect(actual).toHaveLength(6);
      expect(actual.at(0)).toBeCloseTo(1.0 + 4.0);
      expect(actual.at(1)).toBeCloseTo(0.01 + 0.01);
      expect(actual.at(2)).toBeCloseTo(0.04 + 0.04);
      expect(actual.at(3)).toBeCloseTo(0.04 + 0.04);
      expect(actual.at(4)).toBeCloseTo(0.81 + 0.81);
      expect(actual.at(5)).toBeCloseTo(1.96 + 1.96);
    });

    it('should create a new CoreDistanceArray from an empty array', () => {
      // Act
      const actual = CoreDistance.from<Point2>([], 2, euclidean());

      // Assert
      expect(actual).toHaveLength(0);
    });
  });
});

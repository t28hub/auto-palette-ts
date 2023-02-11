import { beforeEach, describe, expect, it } from 'vitest';

import { ciede2000 } from '../color';
import { Point3 } from '../math';

import { DeltaEWeightFunction } from './deltaEWeightFunction';

const colors: Point3[] = [
  [50.0, 2.6772, -79.7751],
  [50.0, 0.0, -82.7485],
  [2.0776, 0.0795, -1.135],
  [0.9033, -0.0636, -0.5514],
];

describe('DeltaEWeightFunction', () => {
  describe('constructor', () => {
    it('should create a new DeltaEWeightFunction', () => {
      // Act
      const actual = new DeltaEWeightFunction(colors, ciede2000());

      // Assert
      expect(actual).toBeDefined();
    });
  });

  describe('compute', () => {
    let weightFunction: DeltaEWeightFunction;
    beforeEach(() => {
      weightFunction = new DeltaEWeightFunction(colors, ciede2000());
    });

    it.each([
      { u: 0, v: 1, expected: 2.0425 },
      { u: 2, v: 3, expected: 0.9082 },
    ])('should compute deltaE($expected) between $u and $v', ({ u, v, expected }) => {
      // Act
      const actual = weightFunction.compute(u, v);

      // Assert
      expect(actual).toBeCloseTo(expected);
    });

    it.each([
      { u: -1, v: 0 },
      { u: 0, v: -1 },
      { u: 3, v: 4 },
      { u: 4, v: 3 },
      { u: -1, v: 4 },
    ])('should throw RangeError if either or both u($u) and v($v) are out of range', ({ u, v }) => {
      // Act & Assert
      expect(() => {
        weightFunction.compute(u, v);
      }).toThrowError(RangeError);
    });
  });
});

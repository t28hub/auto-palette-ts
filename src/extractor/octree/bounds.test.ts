import { describe, expect, it } from 'vitest';

import { Point3 } from '../../math';

import { Bounds } from './bounds';

describe('bounds', () => {
  describe('constructor', () => {
    it('should create a new bounds', () => {
      // Act
      const actual = new Bounds([0, 0, 0], [2, 4, 8]);

      // Assert
      expect(actual).toMatchObject({
        extentX: 2,
        extentY: 4,
        extentZ: 8,
      });
    });

    it('should throw TypeError if min point contains invalid value', () => {
      // Assert
      expect(() => {
        // Act
        new Bounds([0, 0, NaN], [2, 4, 8]);
      }).toThrowError(TypeError);
    });

    it('should throw TypeError if max point contains invalid value', () => {
      // Assert
      expect(() => {
        // Act
        new Bounds([0, 0, 0], [2, 4, NaN]);
      });
    });
  });

  describe('getMinPoint', () => {
    it('should return the min point of this bounds', () => {
      // Act
      const bounds = new Bounds([1, 2, 4], [2, 4, 8]);
      const actual = bounds.getMinPoint();

      // Assert
      expect(actual).toEqual([1, 2, 4]);
    });
  });

  describe('getMaxPoint', () => {
    it('should return the max point of this bounds', () => {
      // Act
      const bounds = new Bounds([1, 2, 4], [2, 4, 8]);
      const actual = bounds.getMaxPoint();

      // Assert
      expect(actual).toEqual([2, 4, 8]);
    });
  });

  describe('contains', () => {
    it.each([
      { point: [0, 0, 0], expected: false },
      { point: [1, 1, 1], expected: false },
      { point: [0, 2, 4], expected: false },
      { point: [1, 1, 4], expected: false },
      { point: [1, 2, 3], expected: false },
      { point: [3, 4, 8], expected: false },
      { point: [2, 5, 8], expected: false },
      { point: [2, 4, 9], expected: false },
      { point: [1, 2, 4], expected: true },
      { point: [2, 3, 4], expected: true },
      { point: [2, 4, 8], expected: true },
    ])('should return $expected when point === $point', ({ point, expected }) => {
      // Act
      const bounds = new Bounds([1, 2, 4], [2, 4, 8]);
      const actual = bounds.contains(point as Point3);

      // Assert
      expect(actual).toEqual(expected);
    });
  });
});

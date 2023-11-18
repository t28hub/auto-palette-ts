import { describe, expect, it } from 'vitest';

import { squaredEuclidean } from './distance';
import { Point } from './point';
import { Vector } from './vector';

describe('Vector', () => {
  describe('constructor', () => {
    it('should instantiate with a source point', () => {
      // Act
      const actual = new Vector([1, 2]);

      // Assert
      expect(actual).toMatchObject({
        dimension: 2,
        components: [1, 2],
      });
    });

    it.each([{ point: [NaN, 0] }, { point: [1, NaN] }, { point: [NaN, NaN] }])(
      'should throw TypeError if source === [$point]',
      ({ point }) => {
        // Assert
        expect(() => {
          new Vector(point as Point);
        }).toThrowError(TypeError);
      },
    );
  });

  describe('toString', () => {
    it('should return string representation', () => {
      // Act
      const vector = new Vector([1, 2, 3]);
      const actual = vector.toString();

      // Assert
      expect(actual).toBe('Vector(1, 2, 3)');
    });
  });

  describe('toArray', () => {
    it('should return array representation', () => {
      // Act
      const vector = new Vector([1, 2, 3]);
      const actual = vector.toArray();

      // Assert
      expect(actual).toEqual([1, 2, 3]);
    });
  });

  describe('clone', () => {
    it('should return cloned vector', () => {
      // Act
      const vector = new Vector([2, 3, 5, 7, 11]);
      const actual = vector.clone();

      // Assert
      expect(actual).toEqual(vector);
      expect(actual).not.toBe(vector);
    });
  });

  describe('setZero', () => {
    it('should set vector to zero vector', () => {
      // Act
      const vector = new Vector([1, 2, 3]);
      const actual = vector.setZero();

      // Assert
      expect(actual).toMatchObject({
        dimension: 3,
        components: [0, 0, 0],
      });
    });
  });

  describe('add', () => {
    it('should add the other vector', () => {
      // Act
      const vector = new Vector([1, 2, 3, 4, 5]);
      const other = new Vector([3, 4, 5, 6, 7]);
      const actual = vector.add(other);

      // Assert
      expect(actual).toMatchObject({
        dimension: 5,
        components: [4, 6, 8, 10, 12],
      });
    });

    it('should add the other point', () => {
      // Act
      const vector = new Vector([1, 2, 3]);
      const actual = vector.add([4, 5, 6]);

      // Assert
      expect(actual).toMatchObject({
        dimension: 3,
        components: [5, 7, 9],
      });
    });

    it('should throw TypeError if the given point contains infinite number', () => {
      const vector = new Vector([1, 2, 3]);

      // Assert
      expect(() => {
        // Act
        vector.add([4, 5, NaN]);
      }).toThrowError(TypeError);
    });
  });

  describe('scale', () => {
    it.each([
      { scalar: 0.0, expected: [0, 0, 0] },
      { scalar: 1.0, expected: [1, 2, 3] },
      { scalar: 2.0, expected: [2, 4, 6] },
      { scalar: -1.0, expected: [-1, -2, -3] },
      { scalar: -2.0, expected: [-2, -4, -6] },
      { scalar: 0.5, expected: [1 / 2, 2 / 2, 3 / 2] },
      { scalar: 0.25, expected: [1 / 4, 2 / 4, 3 / 4] },
    ])('should scale by the scalar(%d)', ({ scalar, expected }) => {
      // Act
      const vector = new Vector([1, 2, 3]);
      const actual = vector.scale(scalar);

      // Assert
      expect(actual).toMatchObject({
        dimension: 3,
        components: expected,
      });
    });

    it.each([{ scalar: NaN }, { scalar: Number.POSITIVE_INFINITY }, { scalar: Number.NEGATIVE_INFINITY }])(
      'should throw TypeError if the given scalar(%d) is not finite number',
      ({ scalar }) => {
        const vector = new Vector([1, 2, 3]);

        // Assert
        expect(() => {
          vector.scale(scalar);
        }).toThrowError(TypeError);
      },
    );
  });

  describe('distanceTo', () => {
    it('should compute distance to the other vector', () => {
      // Act
      const vector1 = new Vector([1, 2, 3]);
      const vector2 = new Vector([4, 5, 6]);
      const actual = vector1.distanceTo(vector2);

      // Assert
      expect(actual).toEqual(Math.sqrt(27));
    });

    it('should compute distance to the other point', () => {
      // Act
      const vector = new Vector([1, 2, 3]);
      const actual = vector.distanceTo([3, 4, 5]);

      // Assert
      expect(actual).toEqual(Math.sqrt(12));
    });

    it('should compute distance with the distance function to the other point', () => {
      // Act
      const vector = new Vector([1, 2, 3]);
      const actual = vector.distanceTo([3, 4, 5], squaredEuclidean);

      // Assert
      expect(actual).toEqual(12);
    });
  });
});

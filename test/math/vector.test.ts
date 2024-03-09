import { type Point, Vector, squaredEuclidean } from '@internal/math';
import { AssertionError } from '@internal/utils';
import { describe, expect, it } from 'vitest';

describe('Vector', () => {
  describe('constructor', () => {
    it('should create a Vector instance with given point', () => {
      // Act
      const actual = new Vector([1, 2]);

      // Assert
      expect(actual).toMatchObject({
        dimension: 2,
        components: [1, 2],
      });
    });

    it.each([
      { point: [Number.NaN, 0] },
      { point: [1, Number.POSITIVE_INFINITY] },
      { point: [Number.NaN, Number.POSITIVE_INFINITY] },
    ])('should throw an AssertionError if the source point($point) contains infinite number', ({ point }) => {
      // Assert
      expect(() => {
        new Vector(point as Point);
      }).toThrowError(AssertionError);
    });
  });

  describe('toString', () => {
    it('should return a string representation of the Vector', () => {
      // Act
      const vector = new Vector([1, 2, 3]);
      const actual = vector.toString();

      // Assert
      expect(actual).toBe('Vector(1, 2, 3)');
    });
  });

  describe('toArray', () => {
    it('should return an array representation of the Vector', () => {
      // Act
      const vector = new Vector([1, 2, 3]);
      const actual = vector.toArray();

      // Assert
      expect(actual).toEqual([1, 2, 3]);
    });
  });

  describe('clone', () => {
    it('should return a clone of the Vector', () => {
      // Act
      const vector = new Vector([2, 3, 5, 7, 11]);
      const actual = vector.clone();

      // Assert
      expect(actual).toEqual(vector);
      expect(actual).not.toBe(vector);
    });
  });

  describe('setZero', () => {
    it('should set all components of the Vector to zero', () => {
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
    it('should add the components of another Vector', () => {
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

    it('should add the components of a given point', () => {
      // Act
      const vector = new Vector([1, 2, 3]);
      const actual = vector.add([4, 5, 6]);

      // Assert
      expect(actual).toMatchObject({
        dimension: 3,
        components: [5, 7, 9],
      });
    });

    it('should throw an AssertionError if the given point contains an infinite number', () => {
      const vector = new Vector([1, 2, 3]);

      // Assert
      expect(() => {
        // Act
        vector.add([4, 5, Number.NaN]);
      }).toThrowError(AssertionError);
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
    ])('should scale the Vector by a given scalar($scalar)', ({ scalar, expected }) => {
      // Act
      const vector = new Vector([1, 2, 3]);
      const actual = vector.scale(scalar);

      // Assert
      expect(actual).toMatchObject({
        dimension: 3,
        components: expected,
      });
    });

    it.each([{ scalar: Number.NaN }, { scalar: Number.POSITIVE_INFINITY }])(
      'should throw an AssertionError if the given scalar($scalar) is not a finite number',
      ({ scalar }) => {
        const vector = new Vector([1, 2, 3]);

        // Assert
        expect(() => {
          vector.scale(scalar);
        }).toThrowError(AssertionError);
      },
    );
  });

  describe('distanceTo', () => {
    it('should compute the distance to another Vector', () => {
      // Act
      const vector1 = new Vector([1, 2, 3]);
      const vector2 = new Vector([4, 5, 6]);
      const actual = vector1.distanceTo(vector2);

      // Assert
      expect(actual).toEqual(Math.sqrt(27));
    });

    it('should compute the distance to a given point', () => {
      // Act
      const vector = new Vector([1, 2, 3]);
      const actual = vector.distanceTo([3, 4, 5]);

      // Assert
      expect(actual).toEqual(Math.sqrt(12));
    });

    it('should compute the distance to the given point using a specified distance function', () => {
      // Act
      const vector = new Vector([1, 2, 3]);
      const actual = vector.distanceTo([3, 4, 5], squaredEuclidean);

      // Assert
      expect(actual).toEqual(12);
    });
  });
});

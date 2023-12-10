import { euclidean, squaredEuclidean } from '@internal/math';
import { AssertionError } from '@internal/utils';
import { describe, expect, it } from 'vitest';

describe('euclidean', () => {
  describe('euclidean', () => {
    describe('measure', () => {
      it('should compute euclidean distance between 2 points', () => {
        // Act
        const actual = euclidean([0, 0], [1, 2]);

        // Assert
        expect(actual).toEqual(Math.sqrt(5));
      });

      it('should throw an AssertionError if any component contain infinite number', () => {
        // Assert
        expect(() => {
          // Act
          euclidean([0, 0], [1, NaN]);
        }).toThrowError(AssertionError);
      });
    });
  });

  describe('squaredEuclidean', () => {
    describe('measure', () => {
      it('should compute squared euclidean distance between 2 points', () => {
        // Act
        const actual = squaredEuclidean([0, 0], [1, 2]);

        // Assert
        expect(actual).toEqual(5);
      });

      it('should throw an AssertionError if any component contain infinite number', () => {
        // Assert
        expect(() => {
          // Act
          squaredEuclidean([NaN, 0], [1, 2]);
        }).toThrowError(AssertionError);
      });
    });
  });
});

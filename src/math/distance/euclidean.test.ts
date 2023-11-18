import { describe, expect, it } from 'vitest';

import { euclidean, squaredEuclidean } from './euclidean';

describe('euclidean', () => {
  describe('euclidean', () => {
    describe('measure', () => {
      it('should compute euclidean distance between 2 points', () => {
        // Act
        const actual = euclidean([0, 0], [1, 2]);

        // Assert
        expect(actual).toEqual(Math.sqrt(5));
      });

      it('should throw TypeError if any component contain infinite number', () => {
        // Assert
        expect(() => {
          // Act
          euclidean([0, 0], [1, NaN]);
        }).toThrowError(TypeError);
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

      it('should throw TypeError if any component contain infinite number', () => {
        // Assert
        expect(() => {
          // Act
          squaredEuclidean([NaN, 0], [1, 2]);
        }).toThrowError(TypeError);
      });
    });
  });
});

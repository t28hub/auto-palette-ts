import { describe, expect, test } from 'vitest';

import { DistanceMatrix } from './matrix';

describe('DistanceMatrix', () => {
  describe('constructor', () => {
    test('should create a new matrix', () => {
      // Act
      const actual = new DistanceMatrix(5);

      // Assert
      expect(actual.size).toBe(25);
      expect(actual.dimensions).toStrictEqual([5, 5]);
      expect(actual.get(0, 0)).toBe(Number.POSITIVE_INFINITY);
    });

    test('should create a new matrix with an initial value', () => {
      // Act
      const actual = new DistanceMatrix(3, 0.0);

      // Assert
      expect(actual.size).toBe(9);
      expect(actual.dimensions).toStrictEqual([3, 3]);
      expect(actual.get(0, 0)).toBe(0.0);
    });

    test.each([0, -1, NaN])('should throw an error if the n(%d) is not a positive integer', (value) => {
      // Assert
      expect(() => {
        // Act
        new DistanceMatrix(value);
      }).toThrow(`The n(${value}) must be a positive integer.`);
    });
  });

  describe('get', () => {
    test('should get a value', () => {
      // Arrange
      const matrix = new DistanceMatrix(2);
      matrix.set(0, 0, 0.0);
      matrix.set(0, 1, 0.5);
      matrix.set(1, 1, 2.5);

      // Act
      const actual = matrix.get(0, 1);

      // Assert
      expect(actual).toBe(0.5);
    });

    test.each([
      [NaN, 0],
      [-1, 0],
      [2, 0],
    ])('should throw an error if the row(%d) is out of range', (row, column) => {
      // Arrange
      const matrix = new DistanceMatrix(2);

      // Assert
      expect(() => {
        // Act
        matrix.get(row, column);
      }).toThrow(`The row(${row}) must be an integer in [0, 2).`);
    });

    test.each([
      [0, NaN],
      [0, -1],
      [0, 2],
    ])('should throw an error if the column(%d) is out of range', (row, column) => {
      // Arrange
      const matrix = new DistanceMatrix(2);

      // Assert
      expect(() => {
        // Act
        matrix.get(row, column);
      }).toThrow(`The column(${column}) must be an integer in [0, 2).`);
    });
  });

  describe('set', () => {
    test('should set a value', () => {
      // Act
      const matrix = new DistanceMatrix(2);
      matrix.set(0, 1, 0.5);

      // Assert
      expect(matrix.get(0, 1)).toBe(0.5);
      expect(matrix.get(1, 0)).toBe(0.5);
      expect(matrix.get(0, 0)).toBe(Number.POSITIVE_INFINITY);
      expect(matrix.get(1, 1)).toBe(Number.POSITIVE_INFINITY);
    });

    test.each([
      [NaN, 0],
      [-1, 0],
      [2, 0],
    ])('should throw an error if the row(%d) is out of range', (row, column) => {
      // Arrange
      const matrix = new DistanceMatrix(2);

      // Assert
      expect(() => {
        // Act
        matrix.set(row, column, 0.5);
      }).toThrow(`The row(${row}) must be an integer in [0, 2).`);
    });

    test.each([
      [0, NaN],
      [0, -1],
      [0, 2],
    ])('should throw an error if the column(%d) is out of range', (row, column) => {
      // Arrange
      const matrix = new DistanceMatrix(2);

      // Assert
      expect(() => {
        // Act
        matrix.set(row, column, 0.5);
      }).toThrow(`The column(${column}) must be an integer in [0, 2).`);
    });
  });
});

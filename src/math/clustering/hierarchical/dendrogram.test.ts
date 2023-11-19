import { describe, expect, test, vi } from 'vitest';

import { Dendrogram } from './dendrogram';

describe('Dendrogram', () => {
  describe('constructor', () => {
    test.each([
      { size: 1, length: 1 },
      { size: 2, length: 1 },
      {
        size: 32,
        length: 16,
      },
    ])('should create empty dendrogram with size(%d)', ({ size, length }) => {
      const dendrogram = new Dendrogram(size);
      expect(dendrogram.isEmpty).toBe(true);
      expect(dendrogram.length).toBe(length);
    });

    test.each([0, -1, 1.5, NaN])('should throw error if size(%d) is invalid', (size: number) => {
      expect(() => new Dendrogram(size)).toThrow(`The size(${size}) is less than 1.`);
    });
  });

  describe('push', () => {
    test('should push a step to dendrogram', () => {
      // Act
      const dendrogram = new Dendrogram(3);
      dendrogram.push({ label: 0, childIndex1: -1, childIndex2: -1, distance: 0, size: 1 });
      dendrogram.push({ label: 1, childIndex1: -1, childIndex2: -1, distance: 0, size: 1 });
      dendrogram.push({ label: 2, childIndex1: 0, childIndex2: 1, distance: 2.0, size: 2 });

      // Assert
      expect(dendrogram.isEmpty).toBe(false);
      expect(dendrogram.length).toBe(2);
    });

    test('should throw error when dendrogram size is exceeded', () => {
      // Arrange
      const dendrogram = new Dendrogram(1);
      dendrogram.push({ label: 0, childIndex1: 0, childIndex2: 0, distance: 0, size: 1 });

      // Act & Assert
      expect(() => {
        dendrogram.push({ label: 1, childIndex1: -1, childIndex2: -1, distance: 0, size: 1 });
      }).toThrow('The dendrogram size(1) is exceeded.');
    });
  });

  describe('stepAt', () => {
    test('should return step for valid index', () => {
      // Arrange
      const dendrogram = new Dendrogram(3);
      dendrogram.push({ label: 0, childIndex1: -1, childIndex2: -1, distance: 0, size: 1 });
      dendrogram.push({ label: 1, childIndex1: -1, childIndex2: -1, distance: 0, size: 1 });
      dendrogram.push({ label: 2, childIndex1: 0, childIndex2: 1, distance: 2.0, size: 2 });

      expect(dendrogram.stepAt(0)).toEqual({ label: 0, childIndex1: -1, childIndex2: -1, distance: 0, size: 1 });
      expect(dendrogram.stepAt(1)).toEqual({ label: 1, childIndex1: -1, childIndex2: -1, distance: 0, size: 1 });
      expect(dendrogram.stepAt(2)).toEqual({ label: 2, childIndex1: 0, childIndex2: 1, distance: 2.0, size: 2 });
    });

    test.each([-1, 0, NaN])('should return undefined for invalid index(%d)', (index: number) => {
      // Act
      const dendrogram = new Dendrogram(1);
      const actual = dendrogram.stepAt(index);

      // Assert
      expect(actual).toBeUndefined();
    });
  });

  describe('forEach', () => {
    test('should iterate over steps', () => {
      // Arrange
      const dendrogram = new Dendrogram(3);
      dendrogram.push({ label: 0, childIndex1: -1, childIndex2: -1, distance: 0, size: 1 });
      dendrogram.push({ label: 1, childIndex1: -1, childIndex2: -1, distance: 0, size: 1 });
      dendrogram.push({ label: 2, childIndex1: 0, childIndex2: 1, distance: 2.0, size: 2 });

      // Act
      const callback = vi.fn();
      dendrogram.forEach(callback);

      // Assert
      expect(callback).toHaveBeenCalledTimes(3);
      expect(callback).toHaveBeenNthCalledWith(
        1,
        { label: 0, childIndex1: -1, childIndex2: -1, distance: 0, size: 1 },
        0,
      );
      expect(callback).toHaveBeenNthCalledWith(
        2,
        { label: 1, childIndex1: -1, childIndex2: -1, distance: 0, size: 1 },
        1,
      );
      expect(callback).toHaveBeenNthCalledWith(
        3,
        { label: 2, childIndex1: 0, childIndex2: 1, distance: 2.0, size: 2 },
        2,
      );
    });

    test('should not iterate over steps for empty dendrogram', () => {
      // Arrange
      const dendrogram = new Dendrogram(1);

      // Act
      const callback = vi.fn();
      dendrogram.forEach(callback);

      // Assert
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('partition', () => {
    test('should return labels for non-empty dendrogram', () => {
      // Arrange
      const dendrogram = new Dendrogram(5);
      dendrogram.push({ label: 0, childIndex1: -1, childIndex2: -1, distance: 0, size: 1 });
      dendrogram.push({ label: 1, childIndex1: -1, childIndex2: -1, distance: 0, size: 1 });
      dendrogram.push({ label: 2, childIndex1: -1, childIndex2: -1, distance: 0, size: 1 });
      dendrogram.push({ label: 3, childIndex1: 0, childIndex2: 1, distance: 2.0, size: 2 });
      dendrogram.push({ label: 4, childIndex1: 2, childIndex2: 3, distance: 4.0, size: 3 });

      // Act & Assert
      expect(dendrogram.partition(1)).toEqual([0, 0, 0]);
      expect(dendrogram.partition(2)).toEqual([1, 1, 0]);
      expect(dendrogram.partition(3)).toEqual([1, 2, 0]);
    });

    test('should return empty array for empty dendrogram', () => {
      // Arrange
      const dendrogram = new Dendrogram(1);

      // Act & Assert
      expect(dendrogram.partition(1)).toEqual([]);
    });

    test('should throw error when number of clusters exceeds dendrogram size', () => {
      // Arrange
      const dendrogram = new Dendrogram(3);
      dendrogram.push({ label: 0, childIndex1: -1, childIndex2: -1, distance: 0, size: 1 });
      dendrogram.push({ label: 1, childIndex1: -1, childIndex2: -1, distance: 0, size: 1 });
      dendrogram.push({ label: 2, childIndex1: 0, childIndex2: 1, distance: 2.0, size: 2 });

      // Act & Assert
      expect(() => dendrogram.partition(3)).toThrow(RangeError);
    });
  });
});

import { AssertionError, LFUCache } from '@internal/utils';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';

describe('LFUCache', () => {
  describe('constructor', () => {
    it('should create a new LFUCache instance', () => {
      // Act
      const cache = new LFUCache(16);

      // Assert
      expect(cache).toBeDefined();
      expect(cache.capacity).toBe(16);
      expect(cache.size).toBe(0);
    });

    it('should throw an AssertionError if the capacity is not a positive integer', () => {
      // Assert
      expect(() => {
        // Act
        new LFUCache(0);
      }).toThrowError(AssertionError);
    });
  });

  describe('get', () => {
    let cache: LFUCache<string, number>;
    beforeAll(() => {
      cache = new LFUCache<string, number>(16);
      cache.put('Alice', 5);
      cache.put('Bob', 3);
      cache.put('Charlie', 7);
      cache.put('Dave', 4);
    });

    it.each([
      { key: 'Alice', expected: 5 },
      { key: 'Bob', expected: 3 },
      { key: 'Charlie', expected: 7 },
      { key: 'Dave', expected: 4 },
    ])('should get the value from the cache by the key($key)', ({ key, expected }) => {
      // Act
      const actual = cache.get(key);

      // Assert
      expect(actual).toBeDefined();
      expect(actual).toBe(expected);
    });

    it.each([{ key: 'Eve' }, { key: 'Frank' }, { key: 'Grace' }, { key: 'Hank' }])(
      'should return undefined if the key($key) is not in the cache',
      ({ key }) => {
        // Act
        const actual = cache.get(key);

        // Assert
        expect(actual).toBeUndefined();
      },
    );
  });

  describe('put', () => {
    it('should put the value in the cache', () => {
      // Arrange
      const cache = new LFUCache<string, number>(4);

      // Act
      const actual = cache.put('Alice', 5);

      // Assert
      expect(actual).toBeUndefined();
      expect(cache.size).toBe(1);
    });

    it('should update the value in the cache', () => {
      // Arrange
      const cache = new LFUCache<string, number>(4);
      cache.put('Alice', 5);

      // Act
      const actual = cache.put('Alice', 7);

      // Assert
      expect(actual).toBe(5);
      expect(cache.size).toBe(1);
      expect(cache.get('Alice')).toBe(7);
    });

    it('should remove the least frequently used entry if the cache is full', () => {
      // Arrange
      const cache = new LFUCache<string, number>(4);
      cache.put('Alice', 5);
      cache.put('Bob', 3);
      cache.put('Charlie', 7);
      cache.put('Dave', 4);

      cache.get('Alice');
      cache.get('Bob');

      // Act
      cache.put('Eve', 6);

      // Assert
      expect(cache.size).toBe(4);
      expect(cache.get('Charlie')).toBeUndefined();
    });
  });

  describe('remove', () => {
    let cache: LFUCache<string, number>;
    beforeEach(() => {
      cache = new LFUCache<string, number>(4);
      cache.put('Alice', 5);
      cache.put('Bob', 3);
      cache.put('Charlie', 7);
      cache.put('Dave', 4);
    });

    it('should remove the value from the cache', () => {
      // Act
      const actual = cache.remove('Charlie');

      // Assert
      expect(actual).toBeTruthy();
      expect(cache.size).toBe(3);
      expect(cache.get('Charlie')).toBeUndefined();
    });

    it('should return false if the value was not removed', () => {
      // Act
      const actual = cache.remove('Eve');

      // Assert
      expect(actual).toBeFalsy();
      expect(cache.size).toBe(4);
    });
  });

  describe('clear', () => {
    it('should clear the cache', () => {
      // Arrange
      const cache = new LFUCache<string, number>(4);
      cache.put('Alice', 5);
      cache.put('Bob', 3);

      // Act
      cache.clear();

      // Assert
      expect(cache.size).toBe(0);
      expect(cache.get('Alice')).toBeUndefined();
      expect(cache.get('Bob')).toBeUndefined();
    });

    it('should clear the cache if it is empty', () => {
      // Arrange
      const cache = new LFUCache<string, number>(4);

      // Act
      cache.clear();

      // Assert
      expect(cache.size).toBe(0);
    });
  });
});

import { describe, expect, it } from 'vitest';

import { ArrayQueue } from './arrayQueue';

describe('ArrayQueue', () => {
  describe('constructor', () => {
    it('should create a new ArrayQueue', () => {
      // Act
      const actual = new ArrayQueue<string>();

      // Assert
      expect(actual).toMatchObject({
        size: 0,
        isEmpty: true,
      });
      expect(actual.toArray()).toBeEmpty();
    });

    it('should create a new ArrayQueue with initial elements', () => {
      // Act
      const actual = new ArrayQueue<string>('Alice', 'Bob', 'Charlie');

      // Assert
      expect(actual).toMatchObject({
        size: 3,
        isEmpty: false,
      });
      expect(actual.toArray()).toEqual(['Alice', 'Bob', 'Charlie']);
    });
  });

  describe('enqueue', () => {
    it('should enqueue the given elements', () => {
      // Act
      const queue = new ArrayQueue<string>();
      const actual = queue.enqueue('Alice', 'Bob', 'Charlie', 'Dave');

      // Assert
      expect(actual).toEqual(true);
      expect(queue).toMatchObject({
        size: 4,
        isEmpty: false,
      });
      expect(queue.toArray()).toEqual(['Alice', 'Bob', 'Charlie', 'Dave']);
    });
  });

  describe('dequeue', () => {
    it('should return the first element', () => {
      // Act
      const queue = new ArrayQueue<string>();
      queue.enqueue('Alice', 'Bob', 'Charlie');
      const actual = queue.dequeue();

      // Assert
      expect(actual).toBe('Alice');
      expect(queue).toMatchObject({
        size: 2,
        isEmpty: false,
      });
      expect(queue.toArray()).toEqual(['Bob', 'Charlie']);
    });

    it('should return undefined if the queue is empty', () => {
      // Act
      const queue = new ArrayQueue();
      const actual = queue.dequeue();

      // Assert
      expect(actual).toBeUndefined();
      expect(queue).toMatchObject({
        size: 0,
        isEmpty: true,
      });
      expect(queue.toArray()).toBeEmpty();
    });
  });

  describe('toArray', () => {
    it('should return an array of all elements', () => {
      // Arrange
      const queue = new ArrayQueue();
      queue.enqueue('Alice', 'Bob');

      // Act
      const actual = queue.toArray();

      // Assert
      expect(actual).toEqual(['Alice', 'Bob']);
    });
  });
});

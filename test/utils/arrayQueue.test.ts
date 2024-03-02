import { ArrayQueue } from '@internal/utils';
import { describe, expect, it } from 'vitest';

describe('ArrayQueue', () => {
  describe('constructor', () => {
    it('should create a new ArrayQueue', () => {
      // Act
      const actual = new ArrayQueue<string>();

      // Assert
      expect(actual.size).toEqual(0);
      expect(actual.isEmpty()).toBeTruthy();
      expect(actual.toArray()).toBeEmpty();
    });

    it('should create a new ArrayQueue with initial elements', () => {
      // Act
      const actual = new ArrayQueue<string>('Alice', 'Bob', 'Charlie');

      // Assert
      expect(actual.size).toEqual(3);
      expect(actual.isEmpty()).toBeFalsy();
      expect(actual.toArray()).toEqual(['Alice', 'Bob', 'Charlie']);
    });
  });

  describe('push', () => {
    it('should push the given elements', () => {
      // Act
      const queue = new ArrayQueue<string>();
      queue.push('Alice');
      queue.push('Bob');
      queue.push('Charlie');
      queue.push('Dave');

      // Assert
      expect(queue.size).toEqual(4);
      expect(queue.isEmpty()).toBeFalsy();
      expect(queue.toArray()).toEqual(['Alice', 'Bob', 'Charlie', 'Dave']);
    });
  });

  describe('pop', () => {
    it('should return the first element', () => {
      // Act
      const queue = new ArrayQueue<string>();
      queue.push('Alice');
      queue.push('Bob');
      queue.push('Charlie');
      const actual = queue.pop();

      // Assert
      expect(actual).toBe('Alice');
      expect(queue.size).toEqual(2);
      expect(queue.isEmpty()).toBeFalsy();
      expect(queue.toArray()).toEqual(['Bob', 'Charlie']);
    });

    it('should return undefined if the queue is empty', () => {
      // Act
      const queue = new ArrayQueue();
      const actual = queue.pop();

      // Assert
      expect(actual).toBeUndefined();
      expect(queue.size).toEqual(0);
      expect(queue.isEmpty()).toBeTruthy();
      expect(queue.toArray()).toBeEmpty();
    });
  });

  describe('peek', () => {
    it('should return the first element', () => {
      // Arrange
      const queue = new ArrayQueue<string>();
      queue.push('Alice');
      queue.push('Bob');
      queue.push('Charlie');

      // Act
      const actual = queue.peek();

      // Assert
      expect(actual).toBe('Alice');
      expect(queue.toArray()).toEqual(['Alice', 'Bob', 'Charlie']);
    });

    it('should return undefined if the queue is empty', () => {
      // Act
      const queue = new ArrayQueue();
      const actual = queue.peek();

      // Assert
      expect(actual).toBeUndefined();
      expect(queue.toArray()).toBeEmpty();
    });
  });

  describe('toArray', () => {
    it('should return an array of all elements', () => {
      // Arrange
      const queue = new ArrayQueue();
      queue.push('Alice');
      queue.push('Bob');

      // Act
      const actual = queue.toArray();

      // Assert
      expect(actual).toEqual(['Alice', 'Bob']);
    });
  });
});

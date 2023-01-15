import { describe, expect, it } from 'vitest';

import { PriorityQueue } from './priorityQueue';

describe('PriorityQueue', () => {
  describe('constructor', () => {
    it('should create a new PriorityQueue with the score function', () => {
      // Act
      const actual = new PriorityQueue<number>((value: number): number => value);

      // Assert
      expect(actual).toMatchObject({
        size: 0,
        isEmpty: true,
      });
      expect(actual.toArray()).toBeEmpty();
    });
  });

  describe('enqueue', () => {
    it('should enqueue the given elements', () => {
      // Act
      const queue = new PriorityQueue<string>((string: string): number => {
        return string.length;
      });
      queue.enqueue('Alice', 'Bob', 'Charlie', 'Dave', 'Ellen', 'Frank');

      // Assert
      expect(queue.size).toEqual(6);
      expect(queue.isEmpty).toBeFalse();
      expect(queue.toArray()).toEqual(['Charlie', 'Frank', 'Ellen', 'Dave', 'Bob', 'Alice']);
    });
  });

  describe('dequeue', () => {
    it('should dequeue the highest priority element', () => {
      // Arrange
      const queue = new PriorityQueue<string>((string: string): number => {
        return string.length;
      });
      queue.enqueue('Alice', 'Bob', 'Charlie', 'Dave', 'Ellen', 'Frank');

      // Act & Assert
      expect(queue.dequeue()).toEqual('Charlie');
      expect(queue.dequeue()).toEqual('Alice');
      expect(queue.dequeue()).toEqual('Ellen');
      expect(queue.dequeue()).toEqual('Frank');
      expect(queue.dequeue()).toEqual('Dave');
      expect(queue.dequeue()).toEqual('Bob');
      expect(queue.dequeue()).toBeUndefined();

      expect(queue.size).toEqual(0);
      expect(queue.isEmpty).toBeTrue();
      expect(queue.toArray()).toBeEmpty();
    });
  });

  describe('toArray', () => {
    it('should return an array of all elements', () => {
      // Arrange
      const queue = new PriorityQueue<string>((string: string): number => {
        return string.length;
      });
      queue.enqueue('Alice', 'Bob', 'Charlie', 'Dave', 'Ellen');

      // Act
      const actual = queue.toArray();

      // Assert
      expect(actual).toEqual(['Charlie', 'Ellen', 'Alice', 'Dave', 'Bob']);
    });
  });
});

import { describe, expect, it } from 'vitest';

import { Comparator, Ordering } from './comparator';
import { PriorityQueue } from './priorityQueue';

const elements = ['Alice', 'Bob', 'Charlie', 'Dave', 'Ellen', 'Frank'];

const stringComparator: Comparator<string> = (value1: string, value2: string): Ordering => {
  if (value1.length < value2.length) {
    return 1;
  }
  if (value1.length > value2.length) {
    return -1;
  }
  return 0;
};

describe('PriorityQueue', () => {
  describe('constructor', () => {
    it('should create a new PriorityQueue with comparator function', () => {
      // Act
      const actual = new PriorityQueue<string>(stringComparator);

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
      const queue = new PriorityQueue<string>(stringComparator);
      elements.forEach((name) => queue.enqueue(name));

      // Assert
      expect(queue.size).toEqual(6);
      expect(queue.isEmpty).toBeFalse();
      expect(queue.toArray()).toEqual(['Charlie', 'Ellen', 'Alice', 'Bob', 'Dave', 'Frank']);
    });
  });

  describe('dequeue', () => {
    it('should dequeue the highest priority element', () => {
      // Arrange
      const queue = new PriorityQueue<string>(stringComparator);
      elements.forEach((name) => queue.enqueue(name));

      // Act & Assert
      expect(queue.dequeue()).toEqual('Charlie');
      expect(queue.dequeue()).toEqual('Alice');
      expect(queue.dequeue()).toEqual('Frank');
      expect(queue.dequeue()).toEqual('Ellen');
      expect(queue.dequeue()).toEqual('Dave');
      expect(queue.dequeue()).toEqual('Bob');
      expect(queue.dequeue()).toBeUndefined();

      expect(queue.size).toEqual(0);
      expect(queue.isEmpty).toBeTrue();
      expect(queue.toArray()).toBeEmpty();
    });
  });

  describe('toArray', () => {
    it('should return an empty array', () => {
      // Arrange
      const queue = new PriorityQueue<string>(stringComparator);

      // Act
      const actual = queue.toArray();

      // Assert
      expect(actual).toHaveLength(0);
    });

    it('should return an array of all elements', () => {
      // Arrange
      const queue = new PriorityQueue<string>(stringComparator);
      elements.forEach((name) => queue.enqueue(name));

      // Act
      const actual = queue.toArray();

      // Assert
      expect(actual).toHaveLength(6);
      expect(actual).toEqual(['Charlie', 'Ellen', 'Alice', 'Bob', 'Dave', 'Frank']);
    });
  });
});

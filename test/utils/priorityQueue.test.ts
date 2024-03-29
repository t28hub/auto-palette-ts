import { type Comparator, PriorityQueue } from '@internal/utils';
import { describe, expect, it } from 'vitest';

const names = ['Alice', 'Bob', 'Charlie', 'Dave', 'Ellen', 'Frank'];

const stringComparator: Comparator<string> = (value1: string, value2: string): number => {
  return value2.length - value1.length;
};

describe('PriorityQueue', () => {
  describe('constructor', () => {
    it('should create a new PriorityQueue with comparator function', () => {
      // Act
      const actual = new PriorityQueue<string>(stringComparator);

      // Assert
      expect(actual.size).toEqual(0);
      expect(actual.isEmpty()).toBeTruthy();
      expect(actual.toArray()).toBeEmpty();
    });
  });

  describe('push', () => {
    it('should push the given elements', () => {
      // Act
      const queue = new PriorityQueue<string>(stringComparator);
      for (const name of names) {
        queue.push(name);
      }

      // Assert
      expect(queue.size).toEqual(6);
      expect(queue.isEmpty()).toBeFalsy();
      expect(queue.toArray()).toEqual(['Charlie', 'Ellen', 'Alice', 'Bob', 'Dave', 'Frank']);
    });
  });

  describe('pop', () => {
    it('should pop the highest priority element', () => {
      // Arrange
      const queue = new PriorityQueue<string>(stringComparator);
      for (const name of names) {
        queue.push(name);
      }

      // Act & Assert
      expect(queue.pop()).toEqual('Charlie');
      expect(queue.pop()).toEqual('Alice');
      expect(queue.pop()).toEqual('Frank');
      expect(queue.pop()).toEqual('Ellen');
      expect(queue.pop()).toEqual('Dave');
      expect(queue.pop()).toEqual('Bob');
      expect(queue.pop()).toBeUndefined();

      expect(queue.size).toEqual(0);
      expect(queue.isEmpty()).toBeTruthy();
      expect(queue.toArray()).toBeEmpty();
    });
  });

  describe('peek', () => {
    it('should return the highest priority element', () => {
      // Arrange
      const queue = new PriorityQueue<string>(stringComparator);
      for (const name of names) {
        queue.push(name);
      }

      // Act & Assert
      expect(queue.peek()).toEqual('Charlie');
      expect(queue.toArray()).toEqual(['Charlie', 'Ellen', 'Alice', 'Bob', 'Dave', 'Frank']);
    });

    it('should return undefined if the queue is empty', () => {
      // Arrange
      const queue = new PriorityQueue<string>(stringComparator);

      // Act & Assert
      expect(queue.peek()).toBeUndefined();
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
      for (const name of names) {
        queue.push(name);
      }

      // Act
      const actual = queue.toArray();

      // Assert
      expect(actual).toHaveLength(6);
      expect(actual).toEqual(['Charlie', 'Ellen', 'Alice', 'Bob', 'Dave', 'Frank']);
    });
  });
});

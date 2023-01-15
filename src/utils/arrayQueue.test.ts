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
    });

    it('should create a new ArrayQueue with initial elements', () => {
      // Act
      const actual = new ArrayQueue<string>('foo', 'bar', 'baz');

      // Assert
      expect(actual).toMatchObject({
        size: 3,
        isEmpty: false,
      });
    });
  });

  describe('enqueue', () => {
    it('should enqueue the given elements', () => {
      // Act
      const queue = new ArrayQueue<string>();
      const actual = queue.enqueue('foo', 'bar', 'baz');

      // Assert
      expect(actual).toEqual(true);
      expect(queue).toMatchObject({
        size: 3,
        isEmpty: false,
      });
    });
  });

  describe('dequeue', () => {
    it('should return the first element', () => {
      // Act
      const queue = new ArrayQueue<string>();
      queue.enqueue('foo', 'bar', 'baz');
      const actual = queue.dequeue();

      // Assert
      expect(actual).toBe('foo');
      expect(queue).toMatchObject({
        size: 2,
        isEmpty: false,
      });
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
    });
  });
});

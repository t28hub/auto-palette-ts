import { Node } from '@internal/math/neighbor/kdtree/node';
import { AssertionError } from '@internal/utils';
import { describe, expect, it } from 'vitest';

describe('Node', () => {
  describe('constructor', () => {
    it('should create a Node instance with specified index and axis', () => {
      // Act
      const actual = new Node(3, 0, undefined, undefined);

      // Assert
      expect(actual).toMatchObject({
        index: 3,
        axis: 0,
        left: undefined,
        right: undefined,
      });
    });

    it('should create a Node instance with specified left and right child nodes', () => {
      // Act
      const left = new Node(4, 1, undefined, undefined);
      const right = new Node(5, 1, undefined, undefined);
      const actual = new Node(3, 0, left, right);

      // Assert
      expect(actual).toMatchObject({
        index: 3,
        axis: 0,
        left: {
          index: 4,
          axis: 1,
          left: undefined,
          right: undefined,
        },
        right: {
          index: 5,
          axis: 1,
          left: undefined,
          right: undefined,
        },
      });
    });

    it('should throw an AssertionError if the specified index is negative', () => {
      // Assert
      expect(() => {
        // Act
        new Node(-1, 0, undefined, undefined);
      }).toThrowError(AssertionError);
    });

    it('should throw an AssertionError if the specified axis is negative', () => {
      // Assert
      expect(() => {
        // Act
        new Node(0, -1, undefined, undefined);
      }).toThrowError(AssertionError);
    });
  });

  describe('isLeaf', () => {
    it('should return true if both child nodes are undefined', () => {
      // Act
      const node = new Node(0, 0, undefined, undefined);
      const actual = node.isLeaf;

      // Assert
      expect(actual).toBeTrue();
    });

    it('should return true if either child node is defined', () => {
      // Act
      const left = new Node(1, 1, undefined, undefined);
      const node = new Node(0, 0, left, undefined);
      const actual = node.isLeaf;

      // Assert
      expect(actual).toBeFalse();
    });

    it('should return false if both child nodes are defined', () => {
      // Act
      const left = new Node(1, 1, undefined, undefined);
      const right = new Node(2, 1, undefined, undefined);
      const node = new Node(0, 0, left, right);
      const actual = node.isLeaf;

      // Assert
      expect(actual).toBeFalse();
    });
  });
});

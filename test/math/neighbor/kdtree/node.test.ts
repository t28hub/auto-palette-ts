import { Node } from '@internal/math/neighbor/kdtree/node';
import { AssertionError } from '@internal/utils';
import { describe, expect, it } from 'vitest';

describe('Node', () => {
  describe('isLeaf', () => {
    it('should return true if both child nodes are undefined', () => {
      // Act
      const node = Node.createLeaf(0, Uint32Array.of(0));
      const actual = node.isLeaf();

      // Assert
      expect(actual).toBeTrue();
    });

    it('should return true if either child node is defined', () => {
      // Act
      const left = Node.createLeaf(1, Uint32Array.of(1));
      const node = Node.createNode(0, 0, left, undefined);
      const actual = node.isLeaf();

      // Assert
      expect(actual).toBeFalse();
    });

    it('should return false if both child nodes are defined', () => {
      // Act
      const left = Node.createLeaf(1, Uint32Array.of(1));
      const right = Node.createLeaf(1, Uint32Array.of(2));
      const node = Node.createNode(0, 0, left, right);
      const actual = node.isLeaf();

      // Assert
      expect(actual).toBeFalse();
    });
  });

  describe('createNode', () => {
    it('should create a Node instance with specified index and axis', () => {
      // Act
      const actual = Node.createNode(0, 3, undefined, undefined);

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
      const left = Node.createLeaf(1, Uint32Array.of(2, 4));
      const right = Node.createLeaf(1, Uint32Array.of(1, 3, 5));
      const actual = Node.createNode(0, 3, left, right);

      // Assert
      expect(actual).toMatchObject({
        axis: 0,
        indices: Uint32Array.of(3),
        left: {
          axis: 1,
          indices: Uint32Array.of(2, 4),
          left: undefined,
          right: undefined,
        },
        right: {
          axis: 1,
          indices: Uint32Array.of(1, 3, 5),
          left: undefined,
          right: undefined,
        },
      });
    });

    it('should throw an AssertionError if the specified axis is negative', () => {
      // Assert
      expect(() => {
        // Act
        Node.createNode(-1, 3, undefined, undefined);
      }).toThrowError(AssertionError);
    });
  });

  describe('createLeaf', () => {
    it('should create a Node instance with the specified indices', () => {
      // Act
      const actual = Node.createLeaf(0, Uint32Array.of(0, 1, 2));

      // Assert
      expect(actual).toMatchObject({
        axis: 0,
        indices: Uint32Array.of(0, 1, 2),
        left: undefined,
        right: undefined,
      });
    });

    it('should throw an AssertionError if the specified indices is empty', () => {
      // Assert
      expect(() => {
        // Act
        Node.createLeaf(0, new Uint32Array());
      }).toThrowError(AssertionError);
    });
  });
});

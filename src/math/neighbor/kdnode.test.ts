import { describe, expect, it } from 'vitest';

import { KDNode } from './kdnode';

describe('KDNode', () => {
  describe('constructor', () => {
    it('should create a new KDNode', () => {
      // Act
      const actual = new KDNode(3, 0, undefined, undefined);

      // Assert
      expect(actual).toMatchObject({
        index: 3,
        axis: 0,
        left: undefined,
        right: undefined,
      });
    });

    it('should create a new KDNode with left and right child node', () => {
      // Act
      const left = new KDNode(4, 1, undefined, undefined);
      const right = new KDNode(5, 1, undefined, undefined);
      const actual = new KDNode(3, 0, left, right);

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
  });

  describe('isLeaf', () => {
    it('should return true if both the left and right child are undefined', () => {
      // Act
      const node = new KDNode(0, 0, undefined, undefined);
      const actual = node.isLeaf;

      // Assert
      expect(actual).toBeTrue();
    });

    it('should return true if either the left or right child is defined', () => {
      // Act
      const left = new KDNode(1, 1, undefined, undefined);
      const node = new KDNode(0, 0, left, undefined);
      const actual = node.isLeaf;

      // Assert
      expect(actual).toBeFalse();
    });

    it('should return true if both the left and right child is defined', () => {
      // Act
      const left = new KDNode(1, 1, undefined, undefined);
      const right = new KDNode(2, 1, undefined, undefined);
      const node = new KDNode(0, 0, left, right);
      const actual = node.isLeaf;

      // Assert
      expect(actual).toBeFalse();
    });
  });
});

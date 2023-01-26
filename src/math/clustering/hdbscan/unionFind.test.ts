import { beforeEach, describe, expect, it } from 'vitest';

import { UnionFind } from './unionFind';

describe('UnionFind', () => {
  describe('constructor', () => {
    it('should create a new UnionFind', () => {
      // Act
      const actual = new UnionFind(4);

      // Assert
      expect(actual).toBeDefined();
    });

    it.each([{ size: 0 }, { size: -1 }])('should throw RangeError if the n($value) < 1', ({ size }) => {
      expect(() => {
        // Act
        new UnionFind(size);
      }).toThrowError(RangeError);
    });
  });

  describe('find', () => {
    let unionFind: UnionFind;
    beforeEach(() => {
      unionFind = new UnionFind(4);

      // Arrange
      unionFind.union(1, 2);
      const root = unionFind.find(2);
      unionFind.union(root, 0);
    });

    it('should return the root node of the given node', () => {
      // Act & Assert
      expect(unionFind.find(0)).toEqual(5);
      expect(unionFind.find(1)).toEqual(5);
      expect(unionFind.find(2)).toEqual(5);
      expect(unionFind.find(5)).toEqual(5);
    });

    it('should return the given node if the node is root', () => {
      // Act
      const actual = unionFind.find(3);

      // Assert
      expect(actual).toEqual(3);
    });

    it('should throw RangeError if the given node is < 0', () => {
      // Assert
      expect(() => {
        // Act
        unionFind.find(-1);
      }).toThrowError(RangeError);
    });
  });

  describe('union', () => {
    let unionFind: UnionFind;
    beforeEach(() => {
      unionFind = new UnionFind(4);
    });

    it('should merge the given nodes', () => {
      // Act
      const actual = unionFind.union(0, 1);

      // Assert
      expect(actual).toEqual(2);
      expect(unionFind.find(0)).toEqual(4);
      expect(unionFind.find(1)).toEqual(4);
    });

    it('should merge the merged nodes', () => {
      // Act
      unionFind.union(0, 1);
      unionFind.union(2, 3);

      const rootA = unionFind.find(0);
      const rootB = unionFind.find(3);
      const actual = unionFind.union(rootA, rootB);

      // Assert
      expect(actual).toEqual(4);
      expect(unionFind.find(0)).toEqual(6);
      expect(unionFind.find(1)).toEqual(6);
      expect(unionFind.find(2)).toEqual(6);
      expect(unionFind.find(3)).toEqual(6);
    });

    it.each([
      { nodeA: -1, nodeB: 1 },
      { nodeA: 1, nodeB: -1 },
      { nodeA: -1, nodeB: -1 },
    ])('should throw RangeError if the given nodes($nodeA, $nodeB) are invalid', ({ nodeA, nodeB }) => {
      // Assert
      expect(() => {
        // Act
        unionFind.union(nodeA, nodeB);
      }).toThrowError(RangeError);
    });
  });
});

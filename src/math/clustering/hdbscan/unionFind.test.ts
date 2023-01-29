import { beforeEach, describe, expect, it } from 'vitest';

import { UnionFind } from './unionFind';

describe('UnionFind', () => {
  describe('constructor', () => {
    it('should create a new UnionFind', () => {
      // Act
      const actual = new UnionFind(5);

      // Assert
      expect(actual).toBeDefined();
    });

    it.each([{ n: 0 }, { n: -1 }, { n: -Number.EPSILON }])(
      'should throw RangeError if the n($n) is invalid',
      ({ n }) => {
        // Assert
        expect(() => {
          new UnionFind(n);
        }).toThrowError(RangeError);
      },
    );
  });

  describe('find', () => {
    let unionFind: UnionFind;
    beforeEach(() => {
      unionFind = new UnionFind(4);
    });

    it('should return root node of the given node', () => {
      // Arrange
      unionFind.union(3, 0);
      unionFind.union(0, 2);

      // Act & Assert
      expect(unionFind.find(0)).toEqual(3);
      expect(unionFind.find(1)).toEqual(1);
      expect(unionFind.find(2)).toEqual(3);
      expect(unionFind.find(3)).toEqual(3);
    });

    it('should return self node if the given node is root', () => {
      // Arrange
      unionFind.union(2, 0);

      // Act & Assert
      expect(unionFind.find(0)).not.toEqual(0);
      expect(unionFind.find(1)).toEqual(1);
      expect(unionFind.find(2)).toEqual(2);
      expect(unionFind.find(3)).toEqual(3);
    });

    it('should throw RangeError if the given node is invalid', () => {
      // Act & Assert
      expect(() => {
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
      unionFind.union(3, 2);
      unionFind.union(2, 1);
      unionFind.union(0, 1);

      // Assert
      expect(unionFind.find(0)).toEqual(3);
      expect(unionFind.find(1)).toEqual(3);
      expect(unionFind.find(2)).toEqual(3);
      expect(unionFind.find(3)).toEqual(3);
    });

    it('should not merge the given nodes if the nodes have same root', () => {
      // Act
      unionFind.union(0, 2);
      unionFind.union(2, 0);

      // Assert
      expect(unionFind.find(0)).toEqual(0);
      expect(unionFind.find(1)).toEqual(1);
      expect(unionFind.find(2)).toEqual(0);
      expect(unionFind.find(3)).toEqual(3);
    });

    it.each([
      { x: 0, y: -1 },
      { x: -1, y: 0 },
      { x: -1, y: -1 },
    ])('should throw RangeError if both or either nodes($x, $y) are invalid', ({ x, y }) => {
      // Act & Assert
      expect(() => {
        unionFind.union(x, y);
      }).toThrowError(RangeError);
    });
  });
});

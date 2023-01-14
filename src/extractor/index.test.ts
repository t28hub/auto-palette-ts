import { describe, expect, it } from 'vitest';

import { Method } from '../types';

import { KmeansExtractor } from './kmeans';
import { OctreeExtractor } from './octree';

import { createExtractor, kmeans, octree } from './index';

describe('extractor/index', () => {
  describe('kmeans', () => {
    it('should create a KmeansExtractor', () => {
      // Act
      const actual = kmeans();

      // Assert
      expect(actual).toBeInstanceOf(KmeansExtractor);
    });

    it('should create a KmeansExtractor with options', () => {
      // Act
      const actual = kmeans({
        maxIterations: 5,
        tolerance: 0.01,
        colorFilters: [],
      });

      // Assert
      expect(actual).toBeInstanceOf(KmeansExtractor);
    });
  });

  describe('octree', () => {
    it('should create a OctreeExtractor', () => {
      // Act
      const actual = octree();

      // Assert
      expect(actual).toBeInstanceOf(OctreeExtractor);
    });

    it('should create a OctreeExtractor with options', () => {
      // Act
      const actual = octree({
        maxDepth: 6,
        colorFilters: [],
      });

      // Assert
      expect(actual).toBeInstanceOf(OctreeExtractor);
    });
  });

  describe('createExtractor', () => {
    it.each([
      { method: 'kmeans', expected: KmeansExtractor },
      { method: 'octree', expected: OctreeExtractor },
    ])('should create $expected from option($options)', ({ method, expected }) => {
      // Act
      const actual = createExtractor(method as Method);

      // Assert
      expect(actual).toBeInstanceOf(expected);
    });

    it('should throw Error when algorithm is unrecognized', () => {
      // Assert
      expect(() => {
        createExtractor('unrecognized' as Method);
      }).toThrowError(TypeError);
    });
  });
});

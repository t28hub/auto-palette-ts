import { describe, expect, it } from 'vitest';

import { Algorithm } from '../types';

import { KmeansExtractor } from './kmeans';
import { OctreeExtractor } from './octree';

import { createExtractor } from './index';

describe('extractor/index', () => {
  describe('createExtractor', () => {
    it.each([
      { algorithm: 'kmeans', expected: KmeansExtractor },
      { algorithm: 'octree', expected: OctreeExtractor },
    ])('should create $expected from option($options)', ({ algorithm, expected }) => {
      // Act
      const actual = createExtractor(algorithm as Algorithm);

      // Assert
      expect(actual).toBeInstanceOf(expected);
    });

    it('should throw Error when algorithm is unrecognized', () => {
      // Assert
      expect(() => {
        createExtractor('unrecognized' as Algorithm);
      }).toThrowError(TypeError);
    });
  });
});

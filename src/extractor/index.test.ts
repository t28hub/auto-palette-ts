import { KmeansExtractor } from './kmeans';
import { OctreeExtractor } from './octree';

import { createExtractor, Options } from './index';

describe('extractor/index', () => {
  describe('createExtractor', () => {
    it.each([
      { options: {}, expected: KmeansExtractor },
      { options: { kind: 'kmeans' }, expected: KmeansExtractor },
      { options: { kind: 'octree' }, expected: OctreeExtractor },
    ])('should create $expected from option($options)', ({ options, expected }) => {
      // Act
      const actual = createExtractor(options as Options);

      // Assert
      expect(actual).toBeInstanceOf(expected);
    });
  });
});

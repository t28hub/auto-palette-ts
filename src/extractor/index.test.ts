import { describe, expect, it } from 'vitest';

import { Method } from '../types';

import { Extractor } from './extractor';
import { opacity } from './filter';

import { createExtractor, dbscan, kmeans } from './index';

describe('extractor', () => {
  describe('dbscan', () => {
    it('should create a DBSCABExtractor', () => {
      // Act
      const actual = dbscan();

      // Assert
      expect(actual).toBeInstanceOf(Extractor);
    });

    it('should create a DBSCANExtractor with options', () => {
      // Act
      const actual = dbscan({
        minPoints: 36,
        threshold: 0.1,
        colorFilters: [opacity()],
      });

      // Assert
      expect(actual).toBeInstanceOf(Extractor);
    });
  });

  describe('kmeans', () => {
    it('should create a KmeansExtractor', () => {
      // Act
      const actual = kmeans();

      // Assert
      expect(actual).toBeInstanceOf(Extractor);
    });

    it('should create a KmeansExtractor with options', () => {
      // Act
      const actual = kmeans({
        maxIterations: 5,
        tolerance: 0.01,
        colorFilters: [],
      });

      // Assert
      expect(actual).toBeInstanceOf(Extractor);
    });
  });

  describe('createExtractor', () => {
    it.each([{ method: 'dbscan' }, { method: 'kmeans' }])(
      'should create a new Extractor from $method',
      ({ method }) => {
        // Act
        const actual = createExtractor(method as Method);

        // Assert
        expect(actual).toBeInstanceOf(Extractor);
      },
    );

    it('should throw TypeError when the method is unrecognized', () => {
      // Assert
      expect(() => {
        createExtractor('unrecognized' as Method);
      }).toThrowError(TypeError);
    });
  });
});

import { describe, expect, it } from 'vitest';

import { Extractor } from './extractor';

import { dbscanExtractor, kmeansExtractor } from './index';

describe('extractor', () => {
  describe('dbscanExtractor', () => {
    it('should create an Extractor using DBSCAN', () => {
      // Act
      const actual = dbscanExtractor();

      // Assert
      expect(actual).toBeInstanceOf(Extractor);
    });

    it('should create an Extractor using DBSCAN with options', () => {
      // Act
      const actual = dbscanExtractor({
        minPoints: 36,
        threshold: 0.1,
        colorFilters: [],
      });

      // Assert
      expect(actual).toBeInstanceOf(Extractor);
    });
  });

  describe('kmeansExtractor', () => {
    it('should create an Extractor using Kmeans', () => {
      // Act
      const actual = kmeansExtractor();

      // Assert
      expect(actual).toBeInstanceOf(Extractor);
    });

    it('should create an Extractor using Kmeans with options', () => {
      // Act
      const actual = kmeansExtractor({
        maxIterations: 5,
        tolerance: 0.01,
        colorFilters: [],
      });

      // Assert
      expect(actual).toBeInstanceOf(Extractor);
    });
  });
});

import { describe, expect, it } from 'vitest';

import { Extractor } from './extractor';

import { alphaFilter, dbscanExtractor, kmeansExtractor, luminanceFilter } from './index';

describe('extractor', () => {
  describe('dbscanExtractor', () => {
    it('should create an Extractor instance using the DBSCAN algorithm', () => {
      // Act
      const actual = dbscanExtractor();

      // Assert
      expect(actual).toBeInstanceOf(Extractor);
    });

    it('should create an Extractor instance using DBSCAN algorithm with specified options', () => {
      // Act
      const actual = dbscanExtractor({
        minPoints: 36,
        threshold: 0.1,
        filters: [alphaFilter(0.5), luminanceFilter()],
      });

      // Assert
      expect(actual).toBeInstanceOf(Extractor);
    });
  });

  describe('kmeansExtractor', () => {
    it('should create an Extractor instance using the K-means algorithm', () => {
      // Act
      const actual = kmeansExtractor();

      // Assert
      expect(actual).toBeInstanceOf(Extractor);
    });

    it('should create an Extractor instance using the K-means algorithm with the specified options', () => {
      // Act
      const actual = kmeansExtractor({
        maxIterations: 5,
        tolerance: 0.01,
        filters: [alphaFilter(0.5), luminanceFilter()],
      });

      // Assert
      expect(actual).toBeInstanceOf(Extractor);
    });
  });
});

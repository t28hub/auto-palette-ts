import { beforeEach, describe, expect, it } from 'vitest';

import { parse } from '../color';
import { DBSCAN, euclidean, Kmeans, Point5 } from '../math';
import { loadImageData } from '../test';
import { Swatch } from '../types';

import { Extractor } from './extractor';
import { opacity } from './filter';

describe('Extractor', () => {
  describe('constructor', () => {
    it('should create a new Extractor', () => {
      // Act
      const kmeans = new Kmeans<Point5>(10, 20, 0.01, euclidean());
      const actual = new Extractor(kmeans, [opacity()]);

      // Assert
      expect(actual).toBeDefined();
    });
  });

  describe('extract', () => {
    let dbscanExtractor: Extractor;
    let kmeansExtractor: Extractor;
    beforeEach(() => {
      const dbscan = new DBSCAN<Point5>(16, 0.05, euclidean());
      dbscanExtractor = new Extractor(dbscan, [opacity()]);

      const kmeans = new Kmeans<Point5>(10, 20, 0.01, euclidean());
      kmeansExtractor = new Extractor(kmeans, [opacity()]);
    });

    it.each([
      {
        filename: 'flag_gr.png',
        expected: ['#005bae', '#ffffff'],
      },
      {
        filename: 'flag_de.png',
        expected: ['#dd0000', '#ffcc00', '#000000'],
      },
      {
        filename: 'flag_ae.png',
        expected: ['#ef3340', '#009739', '#ffffff', '#000000'],
      },
      {
        filename: 'flag_sc.png',
        expected: ['#d92323', '#003d88', '#007a3a', '#fcd955', '#ffffff'],
      },
    ])('should extract swatches from $filename', async ({ filename, expected }) => {
      // Arrange
      const imageData = await loadImageData(filename);

      // Act
      const actual = dbscanExtractor.extract(imageData).sort((swatch1: Swatch, swatch2: Swatch) => {
        return swatch2.population - swatch1.population;
      });

      // Assert
      expect(actual).not.toBeEmpty();
      expected.forEach((hexColor) => {
        expect(actual).toSatisfyAny((swatch: Swatch): boolean => {
          const expected = parse(hexColor);
          const distance = swatch.color.difference(expected);
          return distance < 10.0;
        });
      });
    });

    it('should ignore filtered colors', () => {
      // Arrange
      const pixels = [0x00, 0x00, 0x00, 0x00, 0xff, 0x00, 0x00, 0x00, 0x00, 0xff, 0x00, 0x00, 0x00, 0x00, 0xff, 0x00];
      const imageData: ImageData = {
        colorSpace: 'srgb',
        width: 2,
        height: 2,
        data: Uint8ClampedArray.from(pixels),
      };

      // Act
      const actual = kmeansExtractor.extract(imageData);

      // Assert
      expect(actual).toBeEmpty();
    });

    it('should return an empty array if the given image data is empty', () => {
      // Arrange
      const imageData: ImageData = {
        colorSpace: 'srgb',
        width: 0,
        height: 0,
        data: new Uint8ClampedArray(0),
      };

      // Act
      const actual = kmeansExtractor.extract(imageData);

      // Assert
      expect(actual).toBeEmpty();
    });
  });
});

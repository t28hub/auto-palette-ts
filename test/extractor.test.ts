import { SwatchExtractor } from '@internal/extractor';
import { DBSCAN, Kmeans, KmeansPlusPlusInitializer, type Point5, euclidean, squaredEuclidean } from '@internal/math';
import { Color, type Swatch, ciede2000, opacityFilter } from 'auto-palette';
import { describe, expect, it } from 'vitest';

import fixtures from './fixtures';
import { loadImageData } from './utils.node';

describe('SwatchExtractor', () => {
  describe('constructor', () => {
    it('should create a new SwatchExtractor instance', () => {
      // Act
      const strategy = new KmeansPlusPlusInitializer<Point5>(euclidean);
      const kmeans = new Kmeans<Point5>(10, 20, 0.01, euclidean, strategy);
      const actual = new SwatchExtractor(kmeans, [opacityFilter()]);

      // Assert
      expect(actual).toBeDefined();
    });
  });

  describe('extract', () => {
    it.each([
      {
        filename: fixtures.flags.gr,
        expected: ['#005BAE', '#FFFFFF'],
      },
      {
        filename: fixtures.flags.de,
        expected: ['#DD0000', '#FFCC00', '#000000'],
      },
      {
        filename: fixtures.flags.ae,
        expected: ['#FF0000', '#00732F', '#FFFFFF', '#000000'],
      },
      {
        filename: fixtures.flags.sc,
        expected: ['#003F87', '#FCD856', '#D62828', '#FFFFFF', '#007A3D'],
      },
      {
        filename: fixtures.flags.za,
        expected: ['#E03C31', '#FFFFFF', '#007749', '#001489', '#FFB81C', '#000000'],
      },
    ])('should extract swatches from $filename using DBSCAN', async ({ filename, expected }) => {
      // Arrange
      const imageData = await loadImageData(filename);

      // Act
      const algorithm = new DBSCAN<Point5>(16, 0.0016, squaredEuclidean);
      const extractor = new SwatchExtractor(algorithm, []);
      const actual = extractor.extract(imageData, 1.0);

      // Assert
      expect(actual).not.toBeEmpty();
      expect(actual).toSatisfyAny((swatch: Swatch): boolean => {
        const matches = expected.filter((hexColor) => {
          const expected = Color.fromString(hexColor);
          const distance = swatch.color.differenceTo(expected, ciede2000);
          return distance < 10.0;
        });
        return matches.length > 0;
      });
    });

    it('should extract swatches when a sampling rate is less than 1.0', async () => {
      // Arrange
      const imageData = await loadImageData(fixtures.flags.za);
      const algorithm = new DBSCAN<Point5>(16, 0.0016, squaredEuclidean);
      const extractor = new SwatchExtractor(algorithm, []);

      // Act
      const actual = extractor.extract(imageData, 0.5);

      // Assert
      expect(actual).not.toBeEmpty();
      expect(actual).toHaveLength(6);
      expect(actual[0].color).toBeSimilarColor('#007749');
      expect(actual[1].color).toBeSimilarColor('#FFFFFF');
      expect(actual[2].color).toBeSimilarColor('#E03C31');
      expect(actual[3].color).toBeSimilarColor('#FFB81C');
      expect(actual[4].color).toBeSimilarColor('#000000');
      expect(actual[5].color).toBeSimilarColor('#001489');
    });

    it(
      'should extract swatches from the given image data using Kmeans',
      async () => {
        // Arrange
        const imageData = await loadImageData(fixtures.flags.za);

        // Act
        const strategy = new KmeansPlusPlusInitializer<Point5>(squaredEuclidean);
        const algorithm = new Kmeans<Point5>(8, 10, 0.0001, squaredEuclidean, strategy);
        const extractor = new SwatchExtractor(algorithm, []);
        const actual = extractor.extract(imageData, 1.0);

        // Assert
        expect(actual).not.toBeEmpty();
        expect(actual.length).toBeGreaterThanOrEqual(6);
      },
      { retry: 3 },
    );

    it('should ignore colors filtered out', () => {
      // Arrange
      const pixels = [0x00, 0x00, 0x00, 0x00, 0xff, 0x00, 0x00, 0x00, 0x00, 0xff, 0x00, 0x00, 0x00, 0x00, 0xff, 0x00];
      const imageData: ImageData = {
        colorSpace: 'srgb',
        width: 2,
        height: 2,
        data: Uint8ClampedArray.from(pixels),
      };

      // Act
      const algorithm = new DBSCAN<Point5>(16, 0.0016, squaredEuclidean);
      const customFilter = (): boolean => {
        return false;
      };
      const extractor = new SwatchExtractor(algorithm, [customFilter]);
      const actual = extractor.extract(imageData, 10);

      // Assert
      expect(actual).toBeEmpty();
    });

    it.each([
      { width: 0, height: 0, data: new Uint8ClampedArray(0) },
      { width: 0, height: 0, data: new Uint8ClampedArray(1) },
      { width: 0, height: 1, data: new Uint8ClampedArray(1) },
      { width: 1, height: 0, data: new Uint8ClampedArray(1) },
    ])('should return an empty array if the given image data is empty: %o', ({ width, height, data }) => {
      // Arrange
      const imageData: ImageData = {
        colorSpace: 'srgb',
        width,
        height,
        data,
      };

      // Act
      const algorithm = new DBSCAN<Point5>(16, 0.0016, squaredEuclidean);
      const extractor = new SwatchExtractor(algorithm, []);
      const actual = extractor.extract(imageData, 1.0);

      // Assert
      expect(actual).toBeEmpty();
    });
  });
});

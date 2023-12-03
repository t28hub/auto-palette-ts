import { describe, expect, it } from 'vitest';

import { ciede2000, Color } from './color';
import { SwatchExtractor } from './extractor';
import { alphaFilter } from './filter';
import { DBSCAN, euclidean, Kmeans, KmeansPlusPlusInitializer, Point5, squaredEuclidean } from './math';
import { Swatch } from './swatch';
import { loadImageDataFromFile } from './test';

describe('SwatchExtractor', () => {
  describe('constructor', () => {
    it('should create a new SwatchExtractor instance', () => {
      // Act
      const strategy = new KmeansPlusPlusInitializer<Point5>(euclidean);
      const kmeans = new Kmeans<Point5>(10, 20, 0.01, euclidean, strategy);
      const actual = new SwatchExtractor(kmeans, [alphaFilter()]);

      // Assert
      expect(actual).toBeDefined();
    });
  });

  describe('extract', () => {
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
        expected: ['#ff0000', '#00732f', '#ffffff', '#000000'],
      },
      {
        filename: 'flag_sc.png',
        expected: ['#003f87', '#fcd856', '#d62828', '#ffffff', '#007a3d'],
      },
      {
        filename: 'flag_za.png',
        expected: ['#e03c31', '#ffffff', '#007749', '#001489', '#ffb81c', '#000000'],
      },
    ])('should extract swatches from $filename using DBSCAN', async ({ filename, expected }) => {
      // Arrange
      const imageData = await loadImageDataFromFile(filename);

      // Act
      const algorithm = new DBSCAN<Point5>(16, 0.0016, squaredEuclidean);
      const extractor = new SwatchExtractor(algorithm, []);
      const actual = extractor.extract(imageData);

      // Assert
      expect(actual).not.toBeEmpty();
      expect(actual).toSatisfyAny((swatch: Swatch): boolean => {
        const matches = expected.filter((hexColor) => {
          const expected = Color.parse(hexColor);
          const distance = swatch.color.differenceTo(expected, ciede2000);
          return distance < 10.0;
        });
        return matches.length > 0;
      });
    });

    it(
      'should extract swatches from the given image data using Kmeans',
      async () => {
        // Arrange
        const imageData = await loadImageDataFromFile('flag_za.png');

        // Act
        const strategy = new KmeansPlusPlusInitializer<Point5>(squaredEuclidean);
        const algorithm = new Kmeans<Point5>(8, 10, 0.0001, squaredEuclidean, strategy);
        const extractor = new SwatchExtractor(algorithm, []);
        const actual = extractor.extract(imageData);

        // Assert
        expect(actual).not.toBeEmpty();
        expect(actual.length).toBeGreaterThan(6);
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
      const actual = extractor.extract(imageData);

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
      const algorithm = new DBSCAN<Point5>(16, 0.0016, squaredEuclidean);
      const extractor = new SwatchExtractor(algorithm, []);
      const actual = extractor.extract(imageData);

      // Assert
      expect(actual).toBeEmpty();
    });
  });
});
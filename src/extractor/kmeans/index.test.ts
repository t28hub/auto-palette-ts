import { describe, expect, it } from 'vitest';

import { parse } from '../../color';
import { loadImageData } from '../../test';
import { Swatch } from '../../types';
import { opacity } from '../filter';

import { KmeansExtractor } from './index';

describe('kmeans/index', () => {
  describe('constructor', () => {
    it('should create a new KmeansExtractor', () => {
      // Act
      const actual = new KmeansExtractor(5, 0.01, [opacity()]);

      // Assert
      expect(actual).toBeDefined();
    });
  });

  describe('extract', () => {
    const extractor = new KmeansExtractor(10, 0.01, [opacity()]);
    it.each([
      {
        filename: 'flag_gr.png',
        maxColors: 2,
        expected: ['#005bae', '#ffffff'],
      },
      {
        filename: 'flag_de.png',
        maxColors: 3,
        expected: ['#dd0000', '#ffcc00', '#000000'],
      },
      {
        filename: 'flag_ae.png',
        maxColors: 4,
        expected: ['#ef3340', '#009739', '#ffffff', '#000000'],
      },
      {
        filename: 'flag_sc.png',
        maxColors: 5,
        expected: ['#d92323', '#003d88', '#007a3a', '#fcd955', '#ffffff'],
      },
    ])(
      'should extract $maxColors colors from $filename',
      async ({ filename, maxColors, expected }) => {
        // Arrange
        const imageData = await loadImageData(filename);

        // Act
        const actual = extractor.extract(imageData, maxColors);

        // Assert
        expect(actual).toBeArrayOfSize(maxColors);
        expected.forEach((hexColor) => {
          expect(actual).toSatisfyAny((swatch: Swatch): boolean => {
            const expected = parse(hexColor);
            const distance = swatch.color.difference(expected);
            return distance < 25.0;
          });
        });
      },
      { retry: 3 },
    );
  });
});

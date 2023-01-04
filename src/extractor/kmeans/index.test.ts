import { describe, expect, it } from 'vitest';

import { loadImageData } from '../../test';

import { KmeansExtractor } from './index';

describe('kmeans/index', () => {
  describe('constructor', () => {
    it('should create a new KmeansExtractor', () => {
      // Act
      const actual = new KmeansExtractor();

      // Assert
      expect(actual).toBeDefined();
    });

    it('should create a new KmeansExtractor with optional parameters', () => {
      // Act
      const actual = new KmeansExtractor(5, 0.01);

      // Assert
      expect(actual).toBeDefined();
    });
  });

  describe('extract', () => {
    const extractor = new KmeansExtractor();
    it(
      'should extract 2 colors from an image consisting of 2 colors',
      async () => {
        // Arrange
        const imageData = await loadImageData('flag_gr.png');

        // Act
        const actual = extractor
          .extract(imageData, 2)
          .sort((swatch1, swatch2): number => {
            const hsl1 = swatch1.color.toHSL();
            const hsl2 = swatch2.color.toHSL();
            return hsl2.h - hsl1.h;
          });

        // Assert
        expect(actual).toBeArrayOfSize(2);
        expect(actual[0].color).toBeSimilarColor('#005baeff');
        expect(actual[1].color).toBeSimilarColor('#ffffffff');
      },
      { retry: 3 },
    );

    it(
      'should extract 3 colors from an image consisting of 3 colors',
      async () => {
        // Arrange
        const imageData = await loadImageData('flag_de.png');

        // Act
        const actual = extractor
          .extract(imageData, 3)
          .sort((swatch1, swatch2): number => {
            const hsl1 = swatch1.color.toHSL();
            const hsl2 = swatch2.color.toHSL();
            return hsl2.h - hsl1.h;
          });

        // Assert
        expect(actual).toBeArrayOfSize(3);
        expect(actual[0].color).toBeSimilarColor('#dd0000ff');
        expect(actual[1].color).toBeSimilarColor('#ffcc00ff');
        expect(actual[2].color).toBeSimilarColor('#000000ff');
      },
      { retry: 3 },
    );

    it(
      'should extract 4 colors from an image consisting of 4 colors',
      async () => {
        // Arrange
        const imageData = await loadImageData('flag_br.png');

        // Act
        const actual = extractor
          .extract(imageData, 4)
          .sort((swatch1, swatch2): number => {
            const hsl1 = swatch1.color.toHSL();
            const hsl2 = swatch2.color.toHSL();
            return hsl2.h - hsl1.h;
          });

        // Assert
        expect(actual).toBeArrayOfSize(4);
        expect(actual[0].color).toBeSimilarColor('#012169ff');
        expect(actual[1].color).toBeSimilarColor('#ffffffff');
        expect(actual[2].color).toBeSimilarColor('#009739ff');
        expect(actual[3].color).toBeSimilarColor('#fedD00ff');
      },
      { retry: 3 },
    );

    it(
      'should extract 5 colors from an image consisting of 5 colors',
      async () => {
        // Arrange
        const imageData = await loadImageData('flag_sc.png');

        // Act
        const actual = extractor
          .extract(imageData, 5)
          .sort((swatch1, swatch2): number => {
            const hsl1 = swatch1.color.toHSL();
            const hsl2 = swatch2.color.toHSL();
            return hsl2.h - hsl1.h;
          });

        // Assert
        expect(actual).toBeArrayOfSize(5);
        expect(actual[0].color).toBeSimilarColor('#d92323ff');
        expect(actual[1].color).toBeSimilarColor('#003d88ff');
        expect(actual[2].color).toBeSimilarColor('#007a3aff');
        expect(actual[3].color).toBeSimilarColor('#fcd955ff');
        expect(actual[4].color).toBeSimilarColor('#ffffffff');
      },
      { retry: 3 },
    );

    it.skip(
      'should extract 6 colors from an image consisting of 6 colors',
      async () => {
        // Arrange
        const imageData = await loadImageData('flag_za.png');

        // Act
        const actual = extractor
          .extract(imageData, 6)
          .sort((swatch1, swatch2): number => {
            const hsl1 = swatch1.color.toHSL();
            const hsl2 = swatch2.color.toHSL();
            return hsl2.h - hsl1.h;
          });

        // Assert
        expect(actual).toBeArrayOfSize(6);
        expect(actual[0].color).toBeSimilarColor('#000c8aff');
        expect(actual[1].color).toBeSimilarColor('#007847ff');
        expect(actual[2].color).toBeSimilarColor('#ffffffff');
        expect(actual[3].color).toBeSimilarColor('#ffb915ff');
        expect(actual[4].color).toBeSimilarColor('#000000ff');
        expect(actual[5].color).toBeSimilarColor('#e1392dff');
      },
      { retry: 3 },
    );
  });
});

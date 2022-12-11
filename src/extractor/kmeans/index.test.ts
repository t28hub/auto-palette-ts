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
  });

  describe('extract', () => {
    beforeAll(() => {
      jest.retryTimes(3, { logErrorsBeforeRetry: true });
    });

    const extractor = new KmeansExtractor();
    it('should extract 2 colors from an image consisting of 2 colors', async () => {
      // Arrange
      const imageData = await loadImageData('flag_gr.png');

      // Act
      const actual = extractor.extract(imageData, 2).sort((color1, color2): number => {
        const hsl1 = color1.color.convertTo('hsl');
        const hsl2 = color2.color.convertTo('hsl');
        return hsl2.h - hsl1.h;
      });

      // Assert
      expect(actual).toBeArrayOfSize(2);
      expect(actual[0].color).toBeSimilarColor('#005baeff');
      expect(actual[1].color).toBeSimilarColor('#ffffffff');
    });

    it('should extract 3 colors from an image consisting of 3 colors', async () => {
      // Arrange
      const imageData = await loadImageData('flag_uk.png');

      // Act
      const actual = extractor.extract(imageData, 3).sort((color1, color2): number => {
        const hsl1 = color1.color.convertTo('hsl');
        const hsl2 = color2.color.convertTo('hsl');
        return hsl2.h - hsl1.h;
      });

      // Assert
      expect(actual).toBeArrayOfSize(3);
      expect(actual[0].color).toBeSimilarColor('#c8102eff');
      expect(actual[1].color).toBeSimilarColor('#ffffffff');
      expect(actual[2].color).toBeSimilarColor('#012169ff');
    });

    it('should extract 4 colors from an image consisting of 4 colors', async () => {
      // Arrange
      const imageData = await loadImageData('flag_br.png');

      // Act
      const actual = extractor.extract(imageData, 4).sort((color1, color2): number => {
        const hsl1 = color1.color.convertTo('hsl');
        const hsl2 = color2.color.convertTo('hsl');
        return hsl2.h - hsl1.h;
      });

      // Assert
      expect(actual).toBeArrayOfSize(4);
      expect(actual[0].color).toBeSimilarColor('#012169ff');
      expect(actual[1].color).toBeSimilarColor('#ffffffff');
      expect(actual[2].color).toBeSimilarColor('#009739ff');
      expect(actual[3].color).toBeSimilarColor('#fedD00ff');
    });

    it('should extract 5 colors from an image consisting of 5 colors', async () => {
      // Arrange
      const imageData = await loadImageData('flag_sc.png');

      // Act
      const actual = extractor.extract(imageData, 5).sort((color1, color2): number => {
        const hsl1 = color1.color.convertTo('hsl');
        const hsl2 = color2.color.convertTo('hsl');
        return hsl2.h - hsl1.h;
      });

      // Assert
      expect(actual).toBeArrayOfSize(5);
      expect(actual[0].color).toBeSimilarColor('#d92323ff');
      expect(actual[1].color).toBeSimilarColor('#003d88ff');
      expect(actual[2].color).toBeSimilarColor('#007a3aff');
      expect(actual[3].color).toBeSimilarColor('#fcd955ff');
      expect(actual[4].color).toBeSimilarColor('#ffffffff');
    });

    it('should extract 6 colors from an image consisting of 6 colors', async () => {
      // Arrange
      const imageData = await loadImageData('flag_za.png');

      // Act
      const actual = extractor.extract(imageData, 6).sort((color1, color2): number => {
        const hsl1 = color1.color.convertTo('hsl');
        const hsl2 = color2.color.convertTo('hsl');
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
    });
  });
});

import { describe, expect, it } from 'vitest';

import { loadImageData } from '../../test';
import { opacity } from '../filter';

import { DBSCANExtractor } from './index';

describe('DBSCANExtractor', () => {
  describe('extract', () => {
    it('should extract colors from image', async () => {
      // Arrange
      const imageData = await loadImageData('flag_za.png');
      const extractor = new DBSCANExtractor(9, 0.06, [opacity()]);

      // Act
      const actual = extractor.extract(imageData).sort((swatch1, swatch2) => {
        return swatch2.population - swatch1.population;
      });

      // Assert
      expect(actual.length).toBeGreaterThan(5);
      expect(actual[0].color).toBeSimilarColor('#007a4d');
      expect(actual[1].color).toBeSimilarColor('#de3831');
      expect(actual[2].color).toBeSimilarColor('#002395');
      expect(actual[3].color).toBeSimilarColor('#000000');
      expect(actual[4].color).toBeSimilarColor('#ffffff');
      expect(actual[5].color).toBeSimilarColor('#ffb612');
    });
  });
});

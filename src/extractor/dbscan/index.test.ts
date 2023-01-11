import { describe, expect, it } from 'vitest';

import { loadImageData } from '../../test';
import { opacity } from '../filter';

import { DBSCANExtractor } from './index';

describe('dbscan/index', () => {
  describe('extract', () => {
    it('should extract colors from image', async () => {
      // Arrange
      const imageData = await loadImageData('flag_za_s.png');
      const extractor = new DBSCANExtractor(9, 0.009, [opacity()]);

      // Act
      const actual = extractor.extract(imageData, 6);

      // Assert
      expect(actual.length).toBeGreaterThan(5);
    });
  });
});

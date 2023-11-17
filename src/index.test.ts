import { describe, expect, it } from 'vitest';

import { Palette } from './index';

describe('index', () => {
  describe('Palette', () => {
    it('should create Palette from ImageData', () => {
      // Act
      const pixels = new Uint8ClampedArray(4 * 4 * 4);
      pixels.fill(255);
      const image = new ImageData(pixels, 4, 4);
      const actual = Palette.extract(image);

      // Assert
      expect(actual).toBeDefined();
    });
  });
});

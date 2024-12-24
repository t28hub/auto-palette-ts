import { ImageData } from '@napi-rs/canvas';
import { type Options, Palette, luminanceFilter, opacityFilter } from 'auto-palette';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import fixtures from './fixtures';
import { loadImageData } from './utils.node';

describe('e2e:node/palette', () => {
  let image: ImageData;
  beforeAll(async () => {
    vi.stubGlobal('ImageData', ImageData);
    image = await loadImageData(fixtures.photos.tulips);
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  describe('extract', () => {
    it('should extract the palette with the default options', () => {
      // Act
      const palette = Palette.extract(image);
      const swatches = palette.findSwatches(5);
      swatches.sort((swatch1, swatch2) => swatch2.population - swatch1.population);

      // Assert
      expect(palette.isEmpty()).toBeFalsy();
      expect(palette.size()).toBeGreaterThan(64);
      expect(swatches).toHaveLength(5);

      expect(swatches[0].color).toBeSimilarColor('#F55C03');
      expect(swatches[0].population).toBeGreaterThan(1_000);

      expect(swatches[1].color).toBeSimilarColor('#74B75C');
      expect(swatches[1].population).toBeGreaterThan(16);

      expect(swatches[2].color).toBeSimilarColor('#D6B8DB');
      expect(swatches[2].population).toBeGreaterThanOrEqual(16);

      expect(swatches[3].color).toBeSimilarColor('#FBA91E');
      expect(swatches[3].population).toBeGreaterThanOrEqual(16);

      expect(swatches[4].color).toBeSimilarColor('#BC64F5');
      expect(swatches[4].population).toBeGreaterThanOrEqual(16);
    });

    it('should extract the palette with the DBSCAN++ algorithm', () => {
      // Act
      const palette = Palette.extract(image, { algorithm: 'dbscan++' });
      const swatches = palette.findSwatches(5);
      swatches.sort((swatch1, swatch2) => swatch2.population - swatch1.population);

      // Assert
      expect(palette.isEmpty()).toBeFalsy();
      expect(palette.size()).toBeGreaterThan(64);
      expect(swatches).toHaveLength(5);

      expect(swatches[0].color).toBeSimilarColor('#1F9027');
      expect(swatches[0].population).toBeGreaterThan(300);

      expect(swatches[1].color).toBeSimilarColor('#F01B01');
      expect(swatches[1].population).toBeGreaterThan(300);

      expect(swatches[2].color).toBeSimilarColor('#AF34E0');
      expect(swatches[2].population).toBeGreaterThan(200);

      expect(swatches[3].color).toBeSimilarColor('#85DDC5');
      expect(swatches[3].population).toBeGreaterThan(150);

      expect(swatches[4].color).toBeSimilarColor('#FDB51E');
      expect(swatches[4].population).toBeGreaterThan(100);
    });

    it('should extract the palette with the custom options', () => {
      // Act
      const options: Options = {
        algorithm: 'kmeans',
        samplingRate: 0.8,
        maxSwatches: 32,
        filters: [opacityFilter(), luminanceFilter()],
      };
      const palette = Palette.extract(image, options);
      const swatches = palette.findSwatches(3);
      swatches.sort((swatch1, swatch2) => swatch2.population - swatch1.population);

      // Assert
      expect(palette.isEmpty()).toBeFalsy();
      expect(palette.size()).toBeGreaterThan(5);
      expect(swatches).toHaveLength(3);
    });
  });
});

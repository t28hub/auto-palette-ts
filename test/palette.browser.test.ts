import { type Options, Palette, luminanceFilter, opacityFilter } from 'auto-palette';
import { beforeAll, describe, expect, it } from 'vitest';
import { loadImage } from './utils.browser';

describe('e2e/browser:palette', () => {
  let image: HTMLImageElement;
  beforeAll(async () => {
    image = await loadImage('https://picsum.photos/id/10/480/270');
  });

  describe('extract', () => {
    it('should extract the palette with the default options', async () => {
      // Act
      const palette = Palette.extract(image);
      const swatches = palette.findSwatches(3);
      swatches.sort((swatch1, swatch2) => swatch2.population - swatch1.population);

      // Assert
      expect(palette.isEmpty()).toBeFalsy();
      expect(palette.size()).toBeGreaterThan(64);
      expect(swatches.length).toBe(3);
    });

    it('should extract the palette with the custom options', async () => {
      // Act
      const options: Options = {
        algorithm: 'kmeans',
        samplingRate: 0.5,
        maxSwatches: 16,
        filters: [opacityFilter(), luminanceFilter()],
      };
      const palette = Palette.extract(image, options);
      const swatches = palette.findSwatches(3);
      swatches.sort((swatch1, swatch2) => swatch2.population - swatch1.population);

      // Assert
      expect(palette.isEmpty()).toBeFalsy();
      expect(palette.size()).toBeGreaterThan(5);
      expect(swatches.length).toBe(3);
    });

    it('should extract the palette from the HTMLImageElement with width and height', async () => {
      // Arrange
      const image = await loadImage('https://picsum.photos/id/10/480/270');
      image.width = 320;
      image.height = 180;

      // Act
      const palette = Palette.extract(image);
      const swatches = palette.findSwatches(3);
      swatches.sort((swatch1, swatch2) => swatch2.population - swatch1.population);

      // Assert
      expect(palette.isEmpty()).toBeFalsy();
      expect(palette.size()).toBeGreaterThan(48);
      expect(swatches.length).toBe(3);
    });

    it('should extract the palette from the HTMLCanvasElement', async () => {
      // Arrange
      const image = await loadImage('https://picsum.photos/id/10/480/270');
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const context = canvas.getContext('2d');
      if (!context) {
        throw new Error('The 2D context is not supported');
      }
      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      // Act
      const palette = Palette.extract(canvas);
      const swatches = palette.findSwatches(3);
      swatches.sort((swatch1, swatch2) => swatch2.population - swatch1.population);

      // Assert
      expect(palette.isEmpty()).toBeFalsy();
      expect(palette.size()).toBeGreaterThan(64);
      expect(swatches.length).toBe(3);
    });
  });
});

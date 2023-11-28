import { beforeEach, describe, expect, it } from 'vitest';

import { ciede2000, Color } from './color';
import { alphaFilter, luminanceFilter } from './extractor';
import { Palette } from './palette';
import { Swatch } from './swatch';
import { loadImageDataFromFile, loadImageDataFromURL } from './test';

const swatches: Swatch[] = [
  {
    color: Color.parse('#ff0000'),
    population: 64,
    position: { x: 45, y: 30 },
  },
  {
    color: Color.parse('#fafafa'),
    population: 128,
    position: { x: 18, y: 72 },
  },
  {
    color: Color.parse('#ff0050'),
    population: 48,
    position: { x: 9, y: 54 },
  },
];

describe('Palette', () => {
  describe('constructor', () => {
    it('should create a new Palette instance with given swatches and difference formula', () => {
      // Act
      const actual = new Palette(swatches, ciede2000);

      // Assert
      expect(actual).toBeDefined();
    });
  });

  describe('getDominantSwatch', () => {
    it('should return the dominant swatch', () => {
      // Act
      const palette = new Palette(swatches, ciede2000);
      const actual = palette.getDominantSwatch();

      // Assert
      expect(actual.color.toRGB()).toMatchObject({ r: 250, g: 250, b: 250 });
      expect(actual.population).toEqual(128);
      expect(actual.position).toMatchObject({ x: 18, y: 72 });
    });
  });

  describe('findSwatches', () => {
    let palette: Palette;
    beforeEach(async () => {
      const image = await loadImageDataFromFile('flag_za.png');
      palette = Palette.extract(image);
    }, 10000);

    it('should return swatches', async () => {
      // Act
      const actual = palette.findSwatch(3);

      // Assert
      expect(actual).toBeArrayOfSize(3);
      expect(actual[0].color).toBeSimilarColor('#007749');
      expect(actual[1].color).toBeSimilarColor('#E03C31');
      expect(actual[2].color).toBeSimilarColor('#001489');
    });

    it('should return all swatches if limit exceeds the number of swatches', () => {
      // Act
      const actual = palette.findSwatch(1024);

      // Assert
      expect(actual).toBeArrayOfSize(6);
    });

    it('should throw a TypeError if limit is less than or equal to 0', () => {
      // Assert
      expect(() => {
        // Act
        palette.findSwatch(0);
      }).toThrowError(TypeError);
    });
  });

  describe('extract', () => {
    let image: ImageData;
    beforeEach(async () => {
      image = await loadImageDataFromURL('https://picsum.photos/id/376/320/180');
    }, 10000);

    it('should extract a new Palette from given image', async () => {
      // Act
      const actual = Palette.extract(image);

      // Assert
      expect(actual.isEmpty()).toBeFalsy();
      expect(actual.size()).toBeGreaterThan(16);
    });

    it('should extract a new Palette from given image and filers', async () => {
      // Act
      const actual = Palette.extract(image, [alphaFilter(), luminanceFilter()]);

      // Assert
      expect(actual.isEmpty()).toBeFalsy();
      expect(actual.size()).toBeGreaterThan(16);
      actual.findSwatch(6).forEach((swatch) => {
        console.info({
          color: swatch.color.toHexString(),
          population: swatch.population,
          coordinate: swatch.position,
        });
      });
    }, 10000);
  });
});

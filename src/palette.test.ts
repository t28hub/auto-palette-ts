import { beforeEach, describe, expect, it } from 'vitest';

import { ciede2000, Color } from './color';
import { Palette } from './palette';
import { Swatch } from './swatch';
import { loadImageDataFromURL } from './test';

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
    it('should create a new Palette instance', () => {
      // Act
      const actual = new Palette(swatches, ciede2000);

      // Assert
      expect(actual).toBeDefined();
    });
  });

  describe('getDominantSwatch', () => {
    it('should return the swatch of the max population', () => {
      // Act
      const palette = new Palette(swatches, ciede2000);
      const actual = palette.getDominantSwatch();

      // Assert
      expect(actual.color.toRGB()).toMatchObject({ r: 250, g: 250, b: 250 });
      expect(actual.population).toEqual(128);
      expect(actual.position).toMatchObject({ x: 18, y: 72 });
    });
  });

  describe('getSwatches', () => {
    let palette: Palette;
    beforeEach(() => {
      palette = new Palette(swatches, ciede2000);
    });

    it('should return the all swatches', () => {
      // Act
      const actual = palette.getSwatches();

      // Assert
      expect(actual).toBeArrayOfSize(3);
      expect(actual[0]).toMatchObject(swatches[1]);
      expect(actual[1]).toMatchObject(swatches[0]);
      expect(actual[2]).toMatchObject(swatches[2]);
    });

    it('should return the given number of swatches', () => {
      // Act
      const actual = palette.getSwatches(2);

      // Assert
      expect(actual).toBeArrayOfSize(2);
    });
  });

  describe('extract', () => {
    it('should extract a new Palette from image', async () => {
      // Act
      const image = await loadImageDataFromURL('https://picsum.photos/id/376/320/180');
      const actual = Palette.extract(image);

      // Assert
      expect(actual.isEmpty()).toBeFalsy();
      expect(actual.size()).toBeGreaterThan(16);
      actual.getSwatches(6).forEach((swatch) => {
        console.info({
          color: swatch.color.toHexString(),
          population: swatch.population,
          coordinate: swatch.position,
        });
      });

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

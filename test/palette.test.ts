import { alphaFilter, Color, luminanceFilter, Options, Palette, Swatch } from 'auto-palette';
import { beforeEach, describe, expect, it } from 'vitest';

import fixtures from './fixtures';
import { loadImageDataFromFile } from './utils';

const swatches: Swatch[] = [
  {
    color: Color.parse('#FF0000'),
    population: 64,
    position: { x: 45, y: 30 },
  },
  {
    color: Color.parse('#FAFAFA'),
    population: 128,
    position: { x: 18, y: 72 },
  },
  {
    color: Color.parse('#FF0050'),
    population: 48,
    position: { x: 9, y: 54 },
  },
];

describe('Palette', () => {
  describe('constructor', () => {
    it('should create a new Palette instance with the provided swatches and difference formula', () => {
      // Act
      const actual = new Palette(swatches);

      // Assert
      expect(actual).toBeDefined();
    });
  });

  describe('getDominantSwatch', () => {
    it('should return the dominant swatch from the palette', () => {
      // Act
      const palette = new Palette(swatches);
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
      const image = await loadImageDataFromFile(fixtures.flags.za);
      palette = Palette.extract(image, { filters: [] });
    }, 10000);

    it('should find the default number of swatches from the palette by default', () => {
      // Act
      const actual = palette.findSwatches();

      // Assert
      expect(actual).toBeArrayOfSize(6);
    });

    it('should find the specified number of swatches from the palette', () => {
      // Act
      const actual = palette.findSwatches(3);

      // Assert
      expect(actual).toBeArrayOfSize(3);
    });

    it('should return all swatches if the specified limit exceeds the number of swatches in the palette', () => {
      // Act
      const actual = palette.findSwatches(1024);

      // Assert
      expect(actual).toBeArrayOfSize(6);
    });

    it('should throw a TypeError if the specified limit is less than or equal to 0', () => {
      // Assert
      expect(() => {
        // Act
        palette.findSwatches(0);
      }).toThrowError(TypeError);
    });
  });

  describe('extract', () => {
    let image: ImageData;
    beforeEach(async () => {
      image = await loadImageDataFromFile(fixtures.photos.tulips);
    }, 10000);

    it('should extract a new Palette from the provided image using default options', () => {
      // Act
      const actual = Palette.extract(image);

      // Assert
      expect(actual.isEmpty()).toBeFalsy();
      expect(actual.size()).toBeGreaterThan(16);

      const swatches = actual.findSwatches();
      expect(swatches).toBeArrayOfSize(6);
      swatches.forEach((swatch) => {
        console.info({
          color: swatch.color.toHex(),
          population: swatch.population,
          coordinate: swatch.position,
        });
      });
    });

    it(
      'should extract a new Palette from the provided image using custom options',
      () => {
        // Act
        const options: Options = {
          algorithm: 'kmeans',
          filters: [alphaFilter(), luminanceFilter()],
        };
        const actual = Palette.extract(image, options);

        // Assert
        expect(actual.isEmpty()).toBeFalsy();
        expect(actual.size()).toBeGreaterThan(6);

        const swatches = actual.findSwatches();
        expect(swatches).toBeArrayOfSize(6);
        swatches.forEach((swatch) => {
          console.info({
            color: swatch.color.toHex(),
            population: swatch.population,
            coordinate: swatch.position,
          });
        });
      },
      { retry: 3 },
    );
  });
});

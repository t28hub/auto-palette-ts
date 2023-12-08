import { alphaFilter, Color, luminanceFilter, Options, Palette, Swatch } from 'auto-palette';
import { beforeEach, describe, expect, it } from 'vitest';

import fixtures from './fixtures';
import { loadImageDataFromFile } from './utils';

const swatches: Swatch[] = [
  {
    color: Color.parse('#F42222'),
    population: 3529,
    position: { x: 107, y: 15 },
  },
  {
    color: Color.parse('#FFFFFF'),
    population: 1781,
    position: { x: 89, y: 29 },
  },
  {
    color: Color.parse('#007944'),
    population: 5147,
    position: { x: 65, y: 53 },
  },
  {
    color: Color.parse('#00158F'),
    population: 3528,
    position: { x: 107, y: 90 },
  },
  {
    color: Color.parse('#FFB400'),
    population: 799,
    position: { x: 27, y: 53 },
  },
  {
    color: Color.parse('#000000'),
    population: 1481,
    position: { x: 15, y: 52 },
  },
];

describe('Palette', () => {
  describe('constructor', () => {
    it('should create a new Palette instance with the provided swatches', () => {
      // Act
      const actual = new Palette(swatches);

      // Assert
      expect(actual).toBeDefined();
      expect(actual.size()).toBe(6);
      expect(actual.isEmpty()).toBeFalsy();
    });

    it('should create a new Palette instance with no swatches', () => {
      // Act
      const actual = new Palette([]);

      // Assert
      expect(actual).toBeDefined();
      expect(actual.size()).toBe(0);
      expect(actual.isEmpty()).toBeTruthy();
    });
  });

  describe('getDominantSwatch', () => {
    it('should return the dominant swatch from the palette', () => {
      // Act
      const palette = new Palette(swatches);
      const actual = palette.getDominantSwatch();

      // Assert
      expect(actual?.color.toHex()).toEqual('#007944');
      expect(actual?.population).toEqual(5147);
      expect(actual?.position).toMatchObject({ x: 65, y: 53 });
    });

    it('should return undefined if the palette is empty', () => {
      // Act
      const palette = new Palette([]);
      const actual = palette.getDominantSwatch();

      // Assert
      expect(actual).toBeUndefined();
    });
  });

  describe('findSwatches', () => {
    it('should find the default number of swatches from the palette', () => {
      // Act
      const palette = new Palette(swatches);
      const actual = palette.findSwatches();

      // Assert
      expect(actual).toBeArrayOfSize(6);
      expect(actual).toContainAllValues(swatches);
    });

    it('should find the specified number of swatches from the palette', () => {
      // Act
      const palette = new Palette(swatches);
      const actual = palette.findSwatches(3);

      // Assert
      expect(actual).toBeArrayOfSize(3);
    });

    it('should return all swatches if the specified number exceeds the number of swatches in the palette', () => {
      // Act
      const palette = new Palette(swatches);
      const actual = palette.findSwatches(palette.size() + 1);

      // Assert
      expect(actual).toBeArrayOfSize(6);
    });

    it.each([Infinity, NaN, -1, 0])(
      'should throw a TypeError if the specified number(%d) is not an integer or less than 0',
      (n) => {
        // Arrange
        const palette = new Palette(swatches);

        // Assert
        expect(() => {
          // Act
          palette.findSwatches(n);
        }).toThrowError(TypeError);
      },
    );
  });

  describe('extract', () => {
    let image: ImageData;
    beforeEach(async () => {
      image = await loadImageDataFromFile(fixtures.photos.tulips);
    }, 10000);

    it('should extract a Palette from the provided image using default options', () => {
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
      'should extract a Palette from the provided image using custom options',
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
  }, 3000);
});

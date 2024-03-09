import { Color, type Options, Palette, type Theme, luminanceFilter, opacityFilter } from 'auto-palette';
import { beforeAll, describe, expect, it } from 'vitest';

import type { NamedSwatch } from '@internal/swatch';
import { AssertionError } from '@internal/utils';
import fixtures from './fixtures';
import { loadImageData } from './utils';

const swatches: NamedSwatch[] = [
  {
    name: 'red',
    color: Color.fromString('#F42222'),
    population: 3529,
    position: { x: 107, y: 15 },
  },
  {
    name: 'white',
    color: Color.fromString('#FFFFFF'),
    population: 1781,
    position: { x: 89, y: 29 },
  },
  {
    name: 'seagreen',
    color: Color.fromString('#007944'),
    population: 5147,
    position: { x: 65, y: 53 },
  },
  {
    name: 'navy',
    color: Color.fromString('#00158F'),
    population: 3528,
    position: { x: 107, y: 90 },
  },
  {
    name: 'orange',
    color: Color.fromString('#FFB400'),
    population: 799,
    position: { x: 27, y: 53 },
  },
  {
    name: 'black',
    color: Color.fromString('#000000'),
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

  describe('findSwatches', () => {
    it('should find the specified number of swatches from the palette', () => {
      // Act
      const palette = new Palette(swatches);
      const actual = palette.findSwatches(6);

      // Assert
      expect(actual).toBeArrayOfSize(6);
      expect(actual).toContainAllValues(swatches);
    });

    it.each([
      { theme: 'basic', expected: ['#F42222', '#007944', '#FFB400'] },
      { theme: 'vivid', expected: ['#F42222', '#00158F', '#FFB400'] },
      { theme: 'muted', expected: ['#FFFFFF', '#00158F', '#000000'] },
      { theme: 'light', expected: ['#F42222', '#FFFFFF', '#FFB400'] },
      { theme: 'dark', expected: ['#007944', '#00158F', '#000000'] },
    ])('should find the swatches based on the specified theme($theme)', ({ theme, expected }) => {
      // Act
      const palette = new Palette(swatches);
      const actual = palette.findSwatches(3, theme as Theme);

      // Assert
      expect(actual).toBeArrayOfSize(3);
      expect(actual.map((swatch) => swatch.color.toString())).toEqual(expected);
    });

    it('should return all swatches if the specified number exceeds the number of swatches in the palette', () => {
      // Act
      const palette = new Palette(swatches);
      const actual = palette.findSwatches(palette.size() + 1);

      // Assert
      expect(actual).toBeArrayOfSize(6);
      expect(actual).toContainAllValues(swatches);
    });

    it.each([Number.POSITIVE_INFINITY, Number.NaN, -1, 0])(
      'should throw an AssertionError if the specified number(%d) is not an integer or less than 0',
      (n) => {
        // Arrange
        const palette = new Palette(swatches);

        // Assert
        expect(() => {
          // Act
          palette.findSwatches(n);
        }).toThrowError(AssertionError);
      },
    );
  });

  describe('extract', () => {
    let image: ImageData;
    beforeAll(async () => {
      image = await loadImageData(fixtures.photos.tulips);
    }, 1000);

    it('should extract a Palette from the provided image using default options', () => {
      // Act
      const actual = Palette.extract(image);

      // Assert
      expect(actual.isEmpty()).toBeFalsy();
      expect(actual.size()).toBeGreaterThan(16);

      const swatches = actual.findSwatches(8);
      expect(swatches).toBeArrayOfSize(8);

      for (const swatch of swatches) {
        console.info({
          name: swatch.name,
          color: swatch.color.toString(),
          population: swatch.population,
          coordinate: swatch.position,
        });
      }
    }, 20000);

    it(
      'should extract a Palette from the provided image using custom options',
      () => {
        // Act
        const options: Required<Options> = {
          algorithm: 'kmeans',
          samplingRate: 0.5,
          maxSwatches: 16,
          filters: [opacityFilter(), luminanceFilter()],
        };
        const actual = Palette.extract(image, options);

        // Assert
        expect(actual.isEmpty()).toBeFalsy();
        expect(actual.size()).toBeLessThanOrEqual(options.maxSwatches);

        const swatches = actual.findSwatches(6);
        expect(swatches).toBeArrayOfSize(6);

        for (const swatch of swatches) {
          console.info({
            name: swatch.name,
            color: swatch.color.toString(),
            population: swatch.population,
            coordinate: swatch.position,
          });
        }
      },
      { retry: 3, timeout: 20000 },
    );

    it.each([
      { samplingRate: 0.0 },
      { samplingRate: 1.1 },
      { samplingRate: Number.NaN },
      { samplingRate: Number.POSITIVE_INFINITY },
      { maxSwatches: -1 },
      { maxSwatches: 0 },
      { maxSwatches: Number.NaN },
      { maxSwatches: Number.POSITIVE_INFINITY },
    ])('should throw an AssertionError if the options(%o) are invalid', (options) => {
      // Assert
      expect(() => {
        // Act
        Palette.extract(image, options);
      }).toThrowError(AssertionError);
    });
  }, 3000);
});

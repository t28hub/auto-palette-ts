import { describe, expect, it } from 'vitest';

import { HSLColor } from './color/hsl';
import { Palette } from './palette';
import { Swatch } from './types';

describe('palette', () => {
  const results: Swatch[] = [
    {
      color: new HSLColor(120, 0.8, 0.5, 1.0),
      population: 64,
      coordinate: { x: 45, y: 30 },
    },
    {
      color: new HSLColor(90, 0.6, 0.3, 1.0),
      population: 128,
      coordinate: { x: 18, y: 72 },
    },
    {
      color: new HSLColor(60, 0.4, 0.3, 1.0),
      population: 48,
      coordinate: { x: 9, y: 54 },
    },
  ];

  describe('constructor', () => {
    it('should create a new Palette', () => {
      // Act
      const actual = new Palette(results);

      // Assert
      expect(actual).toBeDefined();
    });

    it('should throw TypeError if results is empty', () => {
      // Assert
      expect(() => {
        // Act
        new Palette([]);
      }).toThrowError(TypeError);
    });
  });

  describe('getDominantSwatch', () => {
    it('should return the swatch of the max population', () => {
      // Act
      const palette = new Palette(results);
      const actual = palette.getDominantSwatch();

      // Assert
      expect(actual).toMatchObject({
        color: {
          h: 90,
          s: 0.6,
          l: 0.3,
          opacity: 1.0,
        },
        population: 128,
        coordinate: { x: 18, y: 72 },
      });
    });
  });

  describe('getSwatches', () => {
    it('should return the all swatches', () => {
      // Act
      const palette = new Palette(results);
      const actual = palette.getSwatches();

      // Assert
      expect(actual).toBeArrayOfSize(3);
      expect(actual[0]).toMatchObject({
        color: {
          h: 90,
          s: 0.6,
          l: 0.3,
          opacity: 1.0,
        },
        population: 128,
        coordinate: { x: 18, y: 72 },
      });
      expect(actual[1]).toMatchObject({
        color: {
          h: 120,
          s: 0.8,
          l: 0.5,
          opacity: 1.0,
        },
        population: 64,
        coordinate: { x: 45, y: 30 },
      });
      expect(actual[2]).toMatchObject({
        color: {
          h: 60,
          s: 0.4,
          l: 0.3,
          opacity: 1.0,
        },
        population: 48,
        coordinate: { x: 9, y: 54 },
      });
    });
  });
});

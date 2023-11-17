import { beforeEach, describe, expect, it } from 'vitest';

import { ciede2000 } from './color';
import { HSLColor } from './color/hsl';
import { Palette } from './palette';
import { Swatch } from './types';

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

describe('Palette', () => {
  describe('constructor', () => {
    it('should create a new Palette', () => {
      // Act
      const actual = new Palette(results, ciede2000());

      // Assert
      expect(actual).toBeDefined();
    });
  });

  describe('getDominantSwatch', () => {
    it('should return the swatch of the max population', () => {
      // Act
      const palette = new Palette(results, ciede2000());
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
    let palette: Palette;
    beforeEach(() => {
      palette = new Palette(results, ciede2000());
    });

    it('should return the all swatches', () => {
      // Act
      const actual = palette.getSwatches();

      // Assert
      expect(actual).toBeArrayOfSize(3);
      expect(actual[0]).toMatchObject(results[1]);
      expect(actual[1]).toMatchObject(results[0]);
      expect(actual[2]).toMatchObject(results[2]);
    });

    it('should return the given number of swatches', () => {
      // Act
      const actual = palette.getSwatches(2);

      // Assert
      expect(actual).toBeArrayOfSize(2);
      expect(actual[0]).toMatchObject(results[1]);
      expect(actual[1]).toMatchObject(results[0]);
    });
  });
});

import { Color } from '../color';
import { ExtractionResult } from '../extractor';

import { Palette } from './palette';

describe('palette', () => {
  const results: ExtractionResult<Color>[] = [
    {
      color: new Color(120, 0.8, 0.5, 1.0),
      population: 64,
    },
    {
      color: new Color(90, 0.6, 0.3, 1.0),
      population: 128,
    },
    {
      color: new Color(60, 0.4, 0.3, 1.0),
      population: 48,
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

  describe('getDominantColor', () => {
    it('should return the color of the max population', () => {
      // Act
      const palette = new Palette(results);
      const actual = palette.getDominantColor();

      // Assert
      expect(actual).toMatchObject({
        h: 90,
        s: 0.6,
        l: 0.3,
        opacity: 1.0,
      });
    });
  });

  describe('getColors', () => {
    it('should return the all colors', () => {
      // Act
      const palette = new Palette(results);
      const actual = palette.getColors();

      // Assert
      expect(actual).toBeArrayOfSize(3);
      expect(actual[0]).toMatchObject({
        h: 90,
        s: 0.6,
        l: 0.3,
        opacity: 1.0,
      });
      expect(actual[1]).toMatchObject({
        h: 120,
        s: 0.8,
        l: 0.5,
        opacity: 1.0,
      });
      expect(actual[2]).toMatchObject({
        h: 60,
        s: 0.4,
        l: 0.3,
        opacity: 1.0,
      });
    });
  });
});

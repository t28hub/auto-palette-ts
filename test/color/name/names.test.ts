import { COLORS } from '@internal/color/name/colors';
import { ColorNames } from '@internal/color/name/names';
import { LFUCache } from '@internal/utils';
import { Color } from 'auto-palette';
import { beforeAll, describe, expect, it } from 'vitest';

describe('ColorNames', () => {
  describe('constructor', () => {
    it('should create a new ColorNames instance', () => {
      // Arrange
      const colors = [
        { name: 'Black', color: { l: 0, a: 0, b: 0 } },
        { name: 'White', color: { l: 100, a: -0.002, b: 0.011 } },
        { name: 'Red', color: { l: 53.24, a: 80.09, b: 67.2 } },
        { name: 'Green', color: { l: 46.228, a: -51.699, b: 49.897 } },
        { name: 'Blue', color: { l: 32.303, a: 79.196, b: -107.864 } },
        { name: 'Yellow', color: { l: 97.139, a: -21.562, b: 94.477 } },
        { name: 'Cyan', color: { l: 91.115, a: -48.081, b: -14.143 } },
        { name: 'Magenta', color: { l: 60.323, a: 98.236, b: -60.842 } },
      ];

      // Act
      const actual = new ColorNames(colors, new LFUCache(16));

      // Assert
      expect(actual).toBeDefined();
    });
  });

  describe('find', () => {
    let colorNames: ColorNames;
    beforeAll(() => {
      colorNames = new ColorNames(COLORS, new LFUCache(16));
    });

    it.each([
      { color: '#000000', expected: 'Black' },
      { color: '#fafafa', expected: 'White' },
      { color: '#ff0000', expected: 'Red' },
      { color: '#00ffff', expected: 'Cyan' },
      { color: '#4648fd', expected: 'BlueViolet' },
      { color: '#fd8d46', expected: 'Coral' },
      { color: '#46fd68', expected: 'SpringGreen' },
      { color: '#fd467f', expected: 'DeepPink' },
    ])('should find the most similar color name $expected from $color', ({ color, expected }) => {
      // Act
      const parsed = Color.fromString(color);
      const actual = colorNames.find(parsed.toLAB());

      // Assert
      expect(actual).toBe(expected);
    });
  });
});

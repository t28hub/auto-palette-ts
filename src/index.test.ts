import { describe, expect, it } from 'vitest';

import { AutoPalette } from './index';

describe('AutoPalette', () => {
  describe('create', () => {
    it('should create AutoPalette with options', () => {
      // Act
      const actual = AutoPalette.create({
        quality: 'high',
        maxImageSize: 64 * 64,
      });

      // Assert
      expect(actual).toBeInstanceOf(AutoPalette);
    });

    it('should create AutoPalette without options', () => {
      // Act
      const actual = AutoPalette.create();

      // Assert
      expect(actual).toBeInstanceOf(AutoPalette);
    });
  });
});

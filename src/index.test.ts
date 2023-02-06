import { describe, expect, it } from 'vitest';

import { PaletteExtractor } from './paletteExtractor';

import { create } from './index';

describe('auto-palette', () => {
  it('should create AutoPalette with options', () => {
    // Act
    const actual = create({
      quality: 'high',
      maxImageSize: 64 * 64,
    });

    // Assert
    expect(actual).toBeInstanceOf(PaletteExtractor);
  });

  it('should create AutoPalette without options', () => {
    // Act
    const actual = create();

    // Assert
    expect(actual).toBeInstanceOf(PaletteExtractor);
  });
});

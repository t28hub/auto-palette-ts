import { describe, expect, it } from 'vitest';

import { PaletteBuilder } from './builder';
import { ensureContext2D } from './image/utils';

import { palette } from './index';

describe('index', () => {
  it('should create a Builder from an HTMLCanvasElement', () => {
    // Act
    const canvasElement = document.createElement('canvas');
    const actual = palette(canvasElement);

    // Assert
    expect(actual).toBeInstanceOf(PaletteBuilder);
  });

  it('should create a Builder from an HTMLImageElement', () => {
    // Act
    const imageElement = document.createElement('img');
    const actual = palette(imageElement);

    // Assert
    expect(actual).toBeInstanceOf(PaletteBuilder);
  });

  it('should create a Builder from an ImageData', () => {
    // Act
    const canvasElement = document.createElement('canvas');
    const { width, height } = canvasElement;
    const imageData = ensureContext2D(canvasElement).getImageData(
      0,
      0,
      width,
      height,
    );
    const actual = palette(imageData);

    // Assert
    expect(actual).toBeInstanceOf(PaletteBuilder);
  });
});

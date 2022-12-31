import { beforeEach, describe, expect, it, vi } from 'vitest';

import { PaletteBuilder } from './builder';

import { palette } from './index';

const StubImageData = vi.fn((sw: number, sh: number, settings?: ImageDataSettings) => ({
  colorSpace: settings?.colorSpace,
  width: sw,
  height: sh,
  data: new Uint8ClampedArray(sw * sh),
}));
vi.stubGlobal('ImageData', StubImageData);

const StubCanvasRenderingContext2D = vi.fn(() => ({
  putImageData: vi.fn(),
}));
vi.stubGlobal('CanvasRenderingContext2D', StubCanvasRenderingContext2D);

describe('index', () => {
  beforeEach(() => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(() => {
      return new CanvasRenderingContext2D();
    });
  });

  it('should create a Builder from an HTMLCanvasElement', () => {
    // Act
    const canvasElement = window.document.createElement('canvas');
    const actual = palette(canvasElement);

    // Assert
    expect(actual).toBeInstanceOf(PaletteBuilder);
  });

  it('should create a Builder from an HTMLImageElement', () => {
    // Act
    const imageElement = window.document.createElement('img');
    const actual = palette(imageElement);

    // Assert
    expect(actual).toBeInstanceOf(PaletteBuilder);
  });

  it('should create a Builder from an ImageData', () => {
    // Act
    const imageData = new ImageData(10, 10, { colorSpace: 'srgb' });
    const actual = palette(imageData);

    // Assert
    expect(actual).toBeInstanceOf(PaletteBuilder);
  });
});

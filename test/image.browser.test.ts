import { type ImageSource, createImageData, isCanvasElement, isImageData, isImageElement } from '@internal/image';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { loadImage } from './utils.browser';

describe('e2e:browser/image', () => {
  describe('isCanvasElement', () => {
    it('should return true if the value is a canvas element', () => {
      // Act
      const actual = isCanvasElement(document.createElement('canvas'));

      // Assert
      expect(actual).toBeTruthy();
    });

    it('should return false if the value is not a canvas element', () => {
      // Act
      const actual = isCanvasElement(document.createElement('img'));

      // Assert
      expect(actual).toBeFalsy();
    });
  });

  describe('isImageElement', () => {
    it('should return true if the value is a image element', () => {
      // Act
      const actual = isImageElement(document.createElement('img'));

      // Assert
      expect(actual).toBeTruthy();
    });

    it('should return false if the value is not a image element', () => {
      // Act
      const actual = isImageElement(document.createElement('canvas'));

      // Assert
      expect(actual).toBeFalsy();
    });
  });

  describe('isImageData', () => {
    it.each([
      new ImageData(new Uint8ClampedArray(4 * 10 * 10), 10, 10),
      { width: 10, height: 10, data: new Uint8ClampedArray(4 * 10 * 10) },
    ])('should return true if the value is an ImageData', (imageData) => {
      // Act
      const actual = isImageData(imageData as ImageSource);

      // Assert
      expect(actual).toBeTruthy();
    });

    it.each([
      {},
      { width: 10, height: 10 },
      { width: 10, data: new Uint8ClampedArray(4 * 10 * 10) },
      { height: 10, data: new Uint8ClampedArray(4 * 10 * 10) },
    ])('should return false if the value is not an ImageData', (imageData) => {
      // Act
      const actual = isImageData(imageData as ImageSource);

      // Assert
      expect(actual).toBeFalsy();
    });
  });

  describe('createImageData', () => {
    afterEach(() => {
      vi.clearAllMocks();
    });

    it('should create a image from HTMLCanvasElement', () => {
      // Arrange
      const canvasElement = document.createElement('canvas');
      canvasElement.width = 160;
      canvasElement.height = 90;

      // Act
      const actual = createImageData(canvasElement);

      // Assert
      expect(actual).toBeInstanceOf(ImageData);
    });

    it('should create a image from HTMLImageElement', async () => {
      // Arrange
      const imageElement = await loadImage('https://picsum.photos/320/180');

      // Act
      const actual = createImageData(imageElement);

      // Assert
      expect(actual).toBeInstanceOf(ImageData);
      expect(actual.width).toBe(320);
      expect(actual.height).toBe(180);
    });

    it('should create a image from ImageData', () => {
      // Act
      const imageData = new ImageData(new Uint8ClampedArray(4 * 4 * 4), 4, 4);
      const actual = createImageData(imageData);

      // Assert
      expect(actual).toBeInstanceOf(ImageData);
      expect(actual).toBe(imageData);
      expect(actual.width).toBe(4);
      expect(actual.height).toBe(4);
    });

    it('should throw an Error if the 2D context is not supported', () => {
      // Arrange
      const canvasElement = document.createElement('canvas');
      vi.spyOn(canvasElement, 'getContext').mockReturnValueOnce(null);

      // Assert
      expect(() => {
        // Act
        createImageData(canvasElement);
      }).toThrow(Error);
    });

    it('should throw an Error if the image element has not loaded', () => {
      // Arrange
      const imageElement = document.createElement('img');
      vi.spyOn(imageElement, 'complete', 'get').mockImplementationOnce(() => false);

      // Assert
      expect(() => {
        // Act
        createImageData(imageElement);
      }).toThrowError(Error);
    });

    it('should throw a TypeError if the source is not supported', () => {
      // Assert
      expect(() => {
        // Act
        createImageData({} as ImageSource);
      }).toThrowError(TypeError);
    });
  });
});

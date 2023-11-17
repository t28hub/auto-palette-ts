import { describe, expect, it } from 'vitest';

import { createImageData } from './image';

describe('image', () => {
  describe('createImageData', () => {
    it('should create a image from HTMLCanvasElement', () => {
      // Act
      const canvasElement = document.createElement('canvas');
      const actual = createImageData(canvasElement);

      // Assert
      expect(actual).toBeInstanceOf(ImageData);
    });

    it('should create a image from HTMLImageElement', () =>
      new Promise<void>((done, reject) => {
        // Arrange
        const imageElement = document.createElement('img');
        imageElement.src = 'https://picsum.photos/64/64';
        imageElement.crossOrigin = 'Anonymous';

        imageElement.onload = () => {
          // Act
          const actual = createImageData(imageElement);
          // Assert
          expect(actual).toBeInstanceOf(ImageData);
          done();
        };

        imageElement.onerror = () => {
          reject(new Error('Failed to load image'));
        };
      }));

    it('should create a image from ImageData', () => {
      // Act
      const imageData = new ImageData(new Uint8ClampedArray(4 * 4 * 4), 4, 4);
      const actual = createImageData(imageData);

      // Assert
      expect(actual).toBeInstanceOf(ImageData);
      expect(actual).not.toBe(imageData);
    });
  });
});

import { type ImageSource, createImageData, isCanvasElement, isImageData, isImageElement } from '@internal/image';
import { ImageData } from 'canvas';
import { describe, expect, it } from 'vitest';

describe('e2e:node/image', () => {
  describe('isCanvasElement', () => {
    it('should return false in a node environment', () => {
      // Act
      const imageData = new ImageData(160, 90);
      const actual = isCanvasElement(imageData);

      // Assert
      expect(actual).toBeFalsy();
    });
  });

  describe('isImageElement', () => {
    it('should return false in a node environment', () => {
      // Act
      const imageData = new ImageData(160, 90);
      const actual = isImageElement(imageData);

      // Assert
      expect(actual).toBeFalsy();
    });
  });

  describe('isImageData', () => {
    it('should return true if the value satisfies the ImageData interface', () => {
      // Act
      const imageData = new ImageData(160, 90);
      const actual = isImageData(imageData);

      // Assert
      expect(actual).toBeTruthy();
    });

    it.each([
      {},
      { width: 160, height: 90 },
      { width: 160, data: new Uint8ClampedArray(4 * 160 * 90) },
      { height: 90, data: new Uint8ClampedArray(4 * 160 * 90) },
    ])('should return false if the value does not satisfy the ImageData interface', (imageData) => {
      // Act
      const actual = isImageData(imageData as ImageSource);

      // Assert
      expect(actual).toBeFalsy();
    });
  });

  describe('createImageData', () => {
    it('should create a image from ImageData', () => {
      // Act
      const imageData = new ImageData(160, 90);
      const actual = createImageData(imageData);

      // Assert
      expect(actual).toBeInstanceOf(ImageData);
      expect(actual).toBe(imageData);
      expect(actual.width).toBe(160);
      expect(actual.height).toBe(90);
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

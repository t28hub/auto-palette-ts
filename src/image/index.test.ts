import { describe, expect, it } from 'vitest';

import { CanvasElementImage, ImageElementImage } from './image';
import { ensureContext2D } from './utils';

import { fromCanvasElement, fromImageData, fromImageElement } from './index';

describe('index', () => {
  describe('fromCanvasElement', () => {
    it('should create a image from HTMLCanvasElement', () => {
      // Act
      const canvasElement = document.createElement('canvas');
      const actual = fromCanvasElement(canvasElement);

      // Assert
      expect(actual).toBeInstanceOf(CanvasElementImage);
    });
  });

  describe('fromImageElement', () => {
    it('should create a image from HTMLImageElement', () => {
      // Act
      const imageElement = document.createElement('img');
      imageElement.src = 'https://example.com/image.png';
      imageElement.crossOrigin = 'Anonymous';
      const actual = fromImageElement(imageElement);

      // Assert
      expect(actual).toBeInstanceOf(ImageElementImage);
    });
  });

  describe('fromImageData', () => {
    it('should create a image from ImageData', () => {
      // Act
      const canvasElement = document.createElement('canvas');
      const { width, height } = canvasElement;
      const imageData = ensureContext2D(canvasElement).getImageData(
        0,
        0,
        width,
        height,
      );
      const actual = fromImageData(imageData);

      // Assert
      expect(actual).toBeInstanceOf(CanvasElementImage);
    });
  });
});

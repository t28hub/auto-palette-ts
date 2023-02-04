import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CanvasElementImage, ImageElementImage } from './image';

describe('image', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('CanvasElementImage', () => {
    let image: CanvasElementImage;
    beforeEach(() => {
      const element = document.createElement('canvas');
      image = new CanvasElementImage(element);
    });

    it('should return width of canvas', () => {
      // Act
      const actual = image.width;

      // Assert
      expect(actual).toEqual(300);
    });

    it('should return height of canvas', () => {
      // Act
      const actual = image.height;

      // Assert
      expect(actual).toEqual(150);
    });

    it('should return image data of canvas', async () => {
      // Act
      const actual = await image.getImageData();

      // Assert
      expect(actual).toBeDefined();
    });

    it('should return resized image of canvas', async () => {
      // Act
      const actual = await image.resize(196);

      // Assert
      expect(actual).not.toBe(image);
      expect(actual.width).toBe(19);
      expect(actual.height).toBe(9);
    });
  });

  describe('ImageElementImage', () => {
    let element: HTMLImageElement;
    let image: ImageElementImage;
    beforeEach(() => {
      element = document.createElement('img');
      image = new ImageElementImage(element);
    });

    it('should return whether the image is loaded', () => {
      // Act
      const actual = image.isLoaded;

      // Assert
      expect(actual).toEqual(true);
    });

    it('should return width of image', () => {
      // Arrange
      vi.spyOn(element, 'naturalWidth', 'get').mockReturnValue(300);

      // Act
      const actual = image.width;

      // Assert
      expect(actual).toEqual(300);
    });

    it('should return height of image', () => {
      // Arrange
      vi.spyOn(element, 'naturalHeight', 'get').mockReturnValue(150);

      // Act
      const actual = image.height;

      // Assert
      expect(actual).toEqual(150);
    });

    it.skip('should return image data of image', async () => {
      // Act
      const actual = await image.getImageData();

      // Assert
      expect(actual).toBeDefined();
    });

    it.skip('should return resized image of image', async () => {
      // Arrange
      element.width = 10;
      element.height = 10;

      // Act
      const actual = await image.resize(196);

      // Assert
      expect(actual).not.toBe(image);
      expect(actual.width).toBe(19);
      expect(actual.height).toBe(9);
    });
  });
});

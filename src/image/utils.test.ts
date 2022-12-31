import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ensureContext2D, resizeCanvas } from './utils';

describe('utils', () => {
  describe('ensureContext2D', () => {
    it('should return 2d context', () => {
      // Arrange
      const canvas = document.createElement('canvas');

      // Act
      const actual = ensureContext2D(canvas);

      // Assert
      expect(actual).toBeDefined();
    });

    it('should throw Error if 2d context is not supported', () => {
      // Arrange
      const canvas = document.createElement('canvas');
      vi.spyOn(canvas, 'getContext').mockReturnValue(null);

      // Assert
      expect(() => {
        // Act
        ensureContext2D(canvas);
      }).toThrowError(Error);
    });
  });

  describe('resizeCanvasElement', () => {
    let canvas: HTMLCanvasElement;
    beforeEach(() => {
      canvas = document.createElement('canvas');
    });

    it('should resize canvas to the given size', () => {
      // Act
      const actual = resizeCanvas(canvas, 144);

      // Assert
      expect(actual.width).toEqual(16);
      expect(actual.height).toEqual(8);
    });

    it('should throw TypeError if size is not integer', () => {
      // Assert
      expect(() => {
        // Act
        resizeCanvas(canvas, 0.1);
      }).toThrowError(TypeError);
    });

    it('should throw TypeError if size is not positive integer', () => {
      // Assert
      expect(() => {
        // Act
        resizeCanvas(canvas, -20);
      }).toThrowError(TypeError);
    });

    it('should throw Error if the canvas size is 0', () => {
      // Arrange
      canvas.width = 0;
      canvas.height = 0;

      // Assert
      expect(() => {
        // Act
        resizeCanvas(canvas, 144);
      }).toThrowError(Error);
    });
  });
});

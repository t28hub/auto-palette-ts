import { Color } from './color';

/**
 * Swatch interface represents a color swatch.
 */
export interface Swatch {
  /**
   * The color of the swatch.
   */
  readonly color: Color;

  /**
   * The population of the swatch.
   */
  readonly population: number;

  /**
   * The position of the swatch in the image.
   */
  readonly position: {
    /**
     * The x-coordinate of the swatch.
     */
    readonly x: number;

    /**
     * The y-coordinate of the swatch.
     */
    readonly y: number;
  };
}

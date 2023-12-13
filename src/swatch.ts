import { Color } from './color';

/**
 * Position interface represents the position of a swatch in the image.
 */
export interface Position {
  /**
   * The x-coordinate of the swatch.
   */
  readonly x: number;

  /**
   * The y-coordinate of the swatch.
   */
  readonly y: number;
}

/**
 * Swatch interface represents a color swatch.
 */
export interface Swatch {
  /**
   * The color of the swatch.
   */
  readonly color: Color;

  /**
   * The position of the swatch in the image.
   */
  readonly position: Position;

  /**
   * The population of the swatch.
   */
  readonly population: number;
}

import type { ColorType } from '../types';

declare const validDifference: unique symbol;

/**
 * ColorDelta type represents a color difference.
 */
export type ColorDelta = number & {
  readonly [validDifference]: true;
};

/**
 * ColorDeltaMeasure calculates the color difference between two colors.
 *
 * @typeParam T - The color type.
 * @param color1 - The 1st color.
 * @param color2 - The 2nd color.
 * @returns The color difference between the two colors.
 */
export type ColorDeltaMeasure<T extends ColorType> = (color1: T, color2: T) => ColorDelta;

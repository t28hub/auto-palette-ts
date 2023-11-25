import { ColorType } from '../types';

declare const validDifference: unique symbol;

/**
 * Color difference type represents a color difference.
 */
export type ColorDifference = number & {
  readonly [validDifference]: true;
};

/**
 * Difference function calculates the color difference between two colors.
 *
 * @param T - The color type.
 * @param color1 - The 1st color.
 * @param color2 - The 2nd color.
 * @returns The color difference between the two colors.
 */
export type DifferenceFunction<T extends ColorType> = (color1: T, color2: T) => ColorDifference;

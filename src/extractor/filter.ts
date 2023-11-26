import { RGBA } from '../color';

/**
 * Color filter function that filters colors.
 *
 * @param color - The color to test.
 * @returns True if the color passes the filter, false otherwise.
 */
export type ColorFilterFunction = (color: RGBA) => boolean;

/**
 * Create a new color filter function that checks the alpha value of the color.
 *
 * @param threshold - The minimum alpha value to pass the filter. The value must be in [0.0, 1.0].
 * @returns The color filter function.
 * @throws {TypeError} If the threshold is not a finite number.
 * @throws {TypeError} If the threshold is not within the range [0.0, 1.0].
 */
export function alphaFilter(threshold = 1.0): ColorFilterFunction {
  if (!Number.isFinite(threshold)) {
    throw new TypeError(`The threshold(${threshold}) must be a finite number`);
  }
  if (threshold < 0.0 || threshold > 1.0) {
    throw new TypeError(`The threshold(${threshold}) must be in [0.0, 1.0]`);
  }

  return (color: RGBA) => {
    const alpha = color.a / 255;
    return alpha >= threshold;
  };
}

// The values are derived from the following paper:
// "Colorgorical: Creating discriminable and preferable color palettes for information visualization"
// The paper can be found at the following URL:
// http://vrl.cs.brown.edu/color/pdf/colorgorical.pdf?v=5dd92af6d1e6c5584236275adc769e82
const DEFAULT_MIN_LUMINANCE = 0.25;
const DEFAULT_MAX_LUMINANCE = 0.85;

/**
 * Create a new color filter function that checks the luminance of the color.
 *
 * @param minThreshold - The minimum luminance value to pass the filter. The value must be in [0.0, 1.0].
 * @param maxThreshold - The maximum luminance value to pass the filter. The value must be in [0.0, 1.0].
 * @returns The color filter function.
 * @throws {TypeError} If the minThreshold or maxThreshold is not a finite number.
 * @throws {TypeError} If the minThreshold or maxThreshold is not within the range [0.0, 1.0].
 * @throws {RangeError} If the minThreshold is greater than the maxThreshold.
 */
export function luminanceFilter(
  minThreshold: number = DEFAULT_MIN_LUMINANCE,
  maxThreshold: number = DEFAULT_MAX_LUMINANCE,
): ColorFilterFunction {
  if (!Number.isFinite(minThreshold)) {
    throw new TypeError(`The minThreshold(${minThreshold}) must be a finite number`);
  }
  if (minThreshold < 0.0 || minThreshold > 1.0) {
    throw new TypeError(`The minThreshold(${minThreshold}) must be in [0.0, 1.0]`);
  }

  if (!Number.isFinite(maxThreshold)) {
    throw new TypeError(`The maxThreshold(${maxThreshold}) must be a finite number`);
  }
  if (maxThreshold < 0.0 || maxThreshold > 1.0) {
    throw new TypeError(`The maxThreshold(${maxThreshold}) must be in [0.0, 1.0]`);
  }

  if (minThreshold > maxThreshold) {
    throw new RangeError(
      `The minThreshold(${minThreshold}) must be less than or equal to maxThreshold(${maxThreshold})`,
    );
  }

  return (color: RGBA) => {
    // The luminance calculation is based on the WCAG 2.0 definition:
    // https://www.w3.org/TR/WCAG20-TECHS/G17.html#G17-tests
    const luminance = (0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b) / 255;
    return luminance >= minThreshold && luminance <= maxThreshold;
  };
}

/**
 * Composite multiple color filter functions into a single color filter function.
 *
 * @param filters - The color filter functions to be composed.
 * @returns The composite color filter function.
 */
export function composeFilters(...filters: ColorFilterFunction[]): ColorFilterFunction {
  return (color: RGBA) => {
    return filters.every((filter) => filter(color));
  };
}

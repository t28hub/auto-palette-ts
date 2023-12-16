import { RGBA, RGBSpace } from './color';
import { assertFiniteNumber } from './utils';

/**
 * Color filter function that filters colors.
 *
 * @param color - The color to test.
 * @returns True if the color passes the filter, false otherwise.
 */
export type ColorFilter = (color: RGBA) => boolean;

/**
 * Create a new color filter function that checks the opacity of the color.
 *
 * @param threshold - The minimum alpha value to pass the filter. The value must be in [0.0, 1.0].
 * @returns The color filter function.
 * @throws {RangeError} If the threshold is not within the range [0.0, 1.0].
 */
export function opacityFilter(threshold = 1.0): ColorFilter {
  assertFiniteNumber(threshold, `The threshold(${threshold}) must be a finite number`);
  if (threshold < 0.0 || threshold > 1.0) {
    throw new RangeError(`The threshold(${threshold}) must be in [0.0, 1.0]`);
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
 * @throws {RangeError} If the minThreshold or maxThreshold is not within the range [0.0, 1.0].
 * @throws {RangeError} If the minThreshold is greater than the maxThreshold.
 */
export function luminanceFilter(
  minThreshold: number = DEFAULT_MIN_LUMINANCE,
  maxThreshold: number = DEFAULT_MAX_LUMINANCE,
): ColorFilter {
  assertFiniteNumber(minThreshold, `The minThreshold(${minThreshold}) must be a finite number`);
  assertFiniteNumber(maxThreshold, `The maxThreshold(${maxThreshold}) must be a finite number`);

  if (minThreshold < 0.0 || minThreshold > 1.0) {
    throw new RangeError(`The minThreshold(${minThreshold}) must be in [0.0, 1.0]`);
  }
  if (maxThreshold < 0.0 || maxThreshold > 1.0) {
    throw new RangeError(`The maxThreshold(${maxThreshold}) must be in [0.0, 1.0]`);
  }

  if (minThreshold > maxThreshold) {
    throw new RangeError(
      `The minThreshold(${minThreshold}) must be less than or equal to maxThreshold(${maxThreshold})`,
    );
  }

  // The relative luminance calculation is based on the WCAG 2.0 definition:
  // https://www.w3.org/TR/WCAG20-TECHS/G17.html#G17-tests
  return (color: RGBA) => {
    const normalized = [color.r / RGBSpace.MAX_RGB, color.g / RGBSpace.MAX_RGB, color.b / RGBSpace.MAX_RGB];

    const r = normalized[0] <= 0.03928 ? normalized[0] / 12.92 : ((normalized[0] + 0.055) / 1.055) ** 2.4;
    const g = normalized[1] <= 0.03928 ? normalized[1] / 12.92 : ((normalized[1] + 0.055) / 1.055) ** 2.4;
    const b = normalized[2] <= 0.03928 ? normalized[2] / 12.92 : ((normalized[2] + 0.055) / 1.055) ** 2.4;
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luminance >= minThreshold && luminance <= maxThreshold;
  };
}

/**
 * Composite multiple color filter functions into a single color filter function.
 *
 * @param filters - The color filter functions to be composed.
 * @returns The composite color filter function.
 */
export function composeFilters(...filters: ColorFilter[]): ColorFilter {
  return (color: RGBA) => {
    return filters.every((filter) => filter(color));
  };
}

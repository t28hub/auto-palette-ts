import { DeltaE } from '../../types';

/**
 * Check whether the given number is valid color difference.
 *
 * @param value The value to be checked.
 * @return true if the given number is valid color difference.
 */
export function isColorDifference(value: number): value is DeltaE {
  return Number.isFinite(value) && value >= 0;
}

/**
 * Convert the given number to valid color difference.
 *
 * @param value The value to be converted.
 * @return The valid color difference.
 * @throws {TypeError} if the given number is invalid.
 */
export function asColorDifference(value: number): DeltaE {
  if (!isColorDifference(value)) {
    throw new TypeError(`The value(${value}) is not valid DeltaE`);
  }
  return value;
}

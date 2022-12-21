import { DeltaE } from '../../types';

/**
 * Check whether the given number is valid DeltaE.
 *
 * @param value The value to be checked.
 * @return true if the given number is valid DeltaE.
 */
export function isDeltaE(value: number): value is DeltaE {
  return Number.isFinite(value) && value >= 0;
}

/**
 * Convert the given number to DeltaE.
 *
 * @param value The value to be converted.
 * @return The valid DeltaE.
 * @throws {TypeError} if the given number is invalid.
 */
export function asDeltaE(value: number): DeltaE {
  if (!isDeltaE(value)) {
    throw new TypeError(`The value(${value}) is not valid DeltaE`);
  }
  return value;
}

import { Distance } from './function';

/**
 * Check whether the given value is valid distance.
 *
 * @param value The value to be checked.
 * @return true if the given value is valid distance.
 */
export function isDistance(value: unknown): value is Distance {
  if (typeof value !== 'number') {
    return false;
  }
  return Number.isFinite(value) && value >= 0.0;
}

/**
 * Convert the given value to valid distance.
 *
 * @param value The value to be converted.
 * @return The distance representation.
 * @throws {TypeError} if the given value is not valid distance.
 */
export function toDistance(value: number): Distance {
  if (!isDistance(value)) {
    throw new TypeError(`The given value(${value}) is not valid distance`);
  }
  return value;
}

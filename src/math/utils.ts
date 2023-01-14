import { Distance } from './types';

/**
 * Clamp the given value.
 *
 * @param value The value to be clamped.
 * @param min The minimum value.
 * @param max The maximum value.
 * @return The clamped value.
 * @throws {TypeError} if the value, min or max is not finite number.
 */
export function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) {
    throw new TypeError(`The value(${value}) is not finite number`);
  }
  if (!Number.isFinite(min)) {
    throw new TypeError(`The minimum value(${min}) is not finite number`);
  }
  if (!Number.isFinite(max)) {
    throw new TypeError(`The maximum value(${max}) is not finite number`);
  }
  return Math.max(Math.min(value, max), min);
}

/**
 * Convert the given value from degrees to radians.
 *
 * @param degree The value in degrees.
 * @return The converted value in radians.
 */
export function degreeToRadian(degree: number): number {
  return degree * (Math.PI / 180.0);
}

/**
 * Convert the given value from radians to degrees.
 *
 * @param radian The value in radians.
 * @return The converted value in degrees.
 */
export function radianToDegree(radian: number): number {
  return radian * (180.0 / Math.PI);
}

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

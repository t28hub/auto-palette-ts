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
 * Normalize the given value.
 *
 * @param value - The value to be normalized.
 * @param min - The minimum value in the range.
 * @param max - The maximum value in the range.
 * @returns The normalized value.
 * @throws {TypeError} if the value, min or max is not finite number.
 * @throws {RangeError} if the min is greater than the max.
 * @see {@link denormalize}
 */
export function normalize(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) {
    throw new TypeError(`The value(${value}) is not finite number`);
  }
  if (!Number.isFinite(min)) {
    throw new TypeError(`The minimum value(${min}) is not a finite number`);
  }
  if (!Number.isFinite(max)) {
    throw new TypeError(`The maximum value(${max}) is not a finite number`);
  }

  if (min >= max) {
    throw new RangeError(`The minimum value(${min}) is greater than the maximum value(${max})`);
  }
  return (value - min) / (max - min);
}

/**
 * Denormalize the given value.
 *
 * @param value - The normalized value to be denormalized.
 * @param min - The minimum value in the range.
 * @param max - The maximum value in the range.
 * @returns The denormalized value.
 * @throws {TypeError} if the value, min or max is not finite number.
 * @throws {RangeError} if the min is greater than the max.
 * @see {@link normalize}
 */
export function denormalize(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) {
    throw new TypeError(`The value(${value}) is not a finite number`);
  }
  if (!Number.isFinite(min)) {
    throw new TypeError(`The minimum value(${min}) is not a finite number`);
  }
  if (!Number.isFinite(max)) {
    throw new TypeError(`The maximum value(${max}) is not a finite number`);
  }

  if (min >= max) {
    throw new RangeError(`The minimum value(${min}) is greater than the maximum value(${max})`);
  }
  return value * (max - min) + min;
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

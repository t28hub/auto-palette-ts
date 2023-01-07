import { Point } from './point';

declare const validDistance: unique symbol;

/**
 * Type representing distance.
 */
export type Distance = number & {
  readonly [validDistance]: true;
};

/**
 * Interface to compute the distance between 2 points.
 */
export interface DistanceMeasure {
  /**
   * Compute the distance between 2 points.
   *
   * @param point1 The 1st point.
   * @param point2 The 2nd point.
   * @return The distance between 2 points.
   */ <P extends Point>(point1: P, point2: P): Distance;
}

/**
 * Convert the given value to valid distance.
 *
 * @param value The value to be converted.
 * @return The distance representation.
 */
export function toDistance(value: number): Distance {
  if (!Number.isFinite(value)) {
    throw new TypeError(`The given value(${value}) is not valid distance`);
  }
  return value as Distance;
}

/**
 * DistanceMeasure implementation to compute squared euclidean distance.
 *
 * @param point1 The 1st point.
 * @param point2 The 2nd point.
 * @return The squared euclidean distance.
 */
export const SquaredEuclideanDistance: DistanceMeasure = <P extends Point>(point1: P, point2: P): Distance => {
  const squared = point1.reduce((total: number, value: number, index: number): number => {
    const delta = point2[index] - value;
    return total + delta * delta;
  }, 0.0);
  return toDistance(squared);
};

/**
 * DistanceMeasure implementation to compute euclidean distance.
 *
 * @param point1 The 1st point.
 * @param point2 The 2nd point.
 * @return The euclidean distance.
 */
export const EuclideanDistance: DistanceMeasure = <P extends Point>(point1: P, point2: P): Distance => {
  const squared = SquaredEuclideanDistance<P>(point1, point2);
  return toDistance(Math.sqrt(squared));
};

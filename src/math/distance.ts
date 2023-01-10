import { Point } from './point';

declare const validDistance: unique symbol;

/**
 * Type representing distance.
 */
export type Distance = number & {
  readonly [validDistance]: true;
};

/**
 * Interface to compute the distance between the given 2 points.
 */
export interface DistanceFunction {
  /**
   * Compute the distance between the given 2 points.
   *
   * @param point1 The 1st point.
   * @param point2 The 2nd point.
   * @return The distance between 2 points.
   */ <P extends Point>(point1: P, point2: P): Distance;
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
 */
export function toDistance(value: number): Distance {
  if (!isDistance(value)) {
    throw new TypeError(`The given value(${value}) is not valid distance`);
  }
  return value;
}

/**
 * Return the squared euclidean distance formula.
 *
 * @return The squared euclidean distance formula.
 */
export function squaredEuclidean(): DistanceFunction {
  return <P extends Point>(point1: P, point2: P): Distance => {
    const distance = point1.reduce((total: number, value: number, index: number): number => {
      const delta = point2[index] - value;
      return total + delta * delta;
    }, 0.0);
    return toDistance(distance);
  };
}

/**
 * Return the euclidean distance formula.
 *
 * @return The euclidean distance formula.
 */
export function euclidean(): DistanceFunction {
  const squaredEuclideanFunction = squaredEuclidean();
  return <P extends Point>(point1: P, point2: P): Distance => {
    const squaredDistance = squaredEuclideanFunction(point1, point2);
    return toDistance(Math.sqrt(squaredDistance));
  };
}

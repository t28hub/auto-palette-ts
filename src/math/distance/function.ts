import { Point } from '../point';

declare const validDistance: unique symbol;

/**
 * Type representing a distance.
 */
export type Distance = number & {
  readonly [validDistance]: true;
};

/**
 * Type of function that calculates distance between two points.
 */
export type DistanceFunction = <P extends Point>(point1: P, point2: P) => Distance;

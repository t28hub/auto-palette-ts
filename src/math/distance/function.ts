import { Point } from '../point';

declare const validDistance: unique symbol;

/**
 * Distance type represents a valid distance.
 */
export type Distance = number & {
  readonly [validDistance]: true;
};

/**
 * DistanceMeasure type represents a function that calculates distance between two points.
 *
 * @typeParam P - The type of the point.
 * @param point1 - The first point.
 * @param point2 - The second point.
 * @return The distance between two points.
 * @throws {TypeError} If either point1 or point2 contains infinite number.
 */
export type DistanceMeasure = <P extends Point>(point1: P, point2: P) => Distance;

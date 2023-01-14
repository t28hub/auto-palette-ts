/**
 * Type representing 2d point.
 */
export type Point2 = [number, number];

/**
 * Type representing 3d point.
 */
export type Point3 = [number, number, number];

/**
 * Type representing 5d point.
 */
export type Point5 = [number, number, number, number, number];

/**
 * Type representing point.
 */
export type Point = Point2 | Point3 | Point5;

declare const validDistance: unique symbol;

/**
 * Type representing distance.
 */
export type Distance = number & {
  readonly [validDistance]: true;
};

/**
 * Interface to compute the distance between the given 2 points.
 *
 * @param P The type of point.
 */
export interface DistanceFunction<P extends Point> {
  /**
   * Compute the distance between the given 2 points.
   *
   * @param point1 The 1st point.
   * @param point2 The 2nd point.
   * @return The distance between 2 points.
   */
  compute(point1: P, point2: P): Distance;
}

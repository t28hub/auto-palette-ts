/**
 * Type representing a 2-dimensional point.
 */
export type Point2 = [number, number];

/**
 * Type representing a 3-dimensional point.
 */
export type Point3 = [number, number, number];

/**
 * Type representing a 5-dimensional point.
 */
export type Point5 = [number, number, number, number, number];

/**
 * Type representing a point in any dimension.
 */
export type Point = Point2 | Point3 | Point5;

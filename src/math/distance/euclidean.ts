import { Point } from '../point';

import { assertFiniteNumber } from '../../utils';
import { Distance, DistanceFunction } from './function';

/**
 * Calculate the Euclidean distance between two points.
 *
 * @param point1  The first point.
 * @param point2 The second point.
 * @return The Euclidean distance between two points.
 */
export const euclidean: DistanceFunction = <P extends Point>(point1: P, point2: P): Distance => {
  const distance = point1.reduce((total: number, value: number, index: number): number => {
    const delta = point2[index] - value;
    return total + delta * delta;
  }, 0.0);
  assertFiniteNumber(distance, 'Either point1 or point2 contains infinite number');
  return Math.sqrt(distance) as Distance;
};

/**
 * Calculate the squared Euclidean distance between two points.
 *
 * @param point1 The first point.
 * @param point2 The second point.
 * @return The squared Euclidean distance between two points.
 */
export const squaredEuclidean: DistanceFunction = <P extends Point>(point1: P, point2: P): Distance => {
  const distance = point1.reduce((total: number, value: number, index: number): number => {
    const delta = point2[index] - value;
    return total + delta * delta;
  }, 0.0);
  assertFiniteNumber(distance, 'Either point1 or point2 contains infinite number');
  return distance as Distance;
};

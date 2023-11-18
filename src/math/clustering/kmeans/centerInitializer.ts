import { Distance, DistanceFunction, Point, toDistance } from '../../index';

/**
 * Interface to initialize center points.
 *
 * @param P The type of point.
 */
export interface CenterInitializer<P extends Point> {
  /**
   * Initialize center points.
   *
   * @param points The candidate points.
   * @param k The number of center points.
   * @return The initial center points.
   */
  initialize(points: P[], k: number): P[];
}

const NO_INDEX = -1;

/**
 * Kmeans++ center points initializer.
 *
 * @param P The type of point.
 */
export class KmeansPlusPlusInitializer<P extends Point> implements CenterInitializer<P> {
  /**
   * Create a new Kmeans++ center initializer
   *
   * @param distanceFunction The distance function.
   */
  constructor(private readonly distanceFunction: DistanceFunction) {}

  /**
   * Initialize center points.
   *
   * @param points The candidate points.
   * @param k The number of center points.
   * @return The initial center points.
   */
  initialize(points: P[], k: number): P[] {
    if (!Number.isInteger(k) || k <= 0) {
      throw new TypeError(`The k is not positive integer: ${k}`);
    }

    if (points.length <= k) {
      return [...points];
    }

    const selected = new Map<number, P>();
    this.selectRecursively(points, k, selected);
    return Array.from(selected.values());
  }

  private selectRecursively(data: P[], k: number, selected: Map<number, P>) {
    if (selected.size === k) {
      return;
    }

    if (selected.size === 0) {
      KmeansPlusPlusInitializer.selectRandomly(data, selected);
    } else {
      this.selectBest(data, selected);
    }
    this.selectRecursively(data, k, selected);
  }

  private selectBest(data: P[], selected: Map<number, P>) {
    const dataSize = data.length;
    const totalDistanceCache = new Float32Array(dataSize);
    let totalDistance = 0.0;
    for (let i = 0; i < dataSize; i++) {
      if (selected.has(i)) {
        continue;
      }

      const point = data[i];
      const nearestDistance = this.computeNearestDistance(point, selected);
      totalDistance += nearestDistance;
      totalDistanceCache[i] = totalDistance;
    }

    const targetDistance = Math.random() * totalDistance;
    const targetIndex = data.findIndex((_: P, index: number): boolean => {
      if (selected.has(index)) {
        return false;
      }

      const distance = totalDistanceCache[index];
      if (!distance) {
        return false;
      }
      return distance > targetDistance;
    });

    if (targetIndex === NO_INDEX) {
      KmeansPlusPlusInitializer.selectRandomly(data, selected);
      return;
    }
    selected.set(targetIndex, data[targetIndex]);
  }

  private computeNearestDistance(point: P, selected: Map<number, P>): Distance {
    let minDistance: Distance = toDistance(Number.MAX_VALUE);
    for (const selectedPoint of selected.values()) {
      const distance = this.distanceFunction(point, selectedPoint);
      if (distance < minDistance) {
        minDistance = distance;
      }
    }
    return minDistance;
  }

  private static selectRandomly<P extends Point>(data: P[], selected: Map<number, P>) {
    let index = NO_INDEX;
    do {
      index = Math.floor(Math.random() * data.length);
    } while (selected.has(index));
    selected.set(index, data[index]);
  }
}

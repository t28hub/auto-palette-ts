import { toDistance, Distance, DistanceMeasure, Point, SquaredEuclideanDistance } from '../math';

/**
 * Interface to initialize center points.
 */
export interface Initializer {
  /**
   * Choose initial center points.
   *
   * @param points The all points.
   * @param count The number of center points.
   * @return The initial center points.
   */
  initialize<P extends Point>(points: P[], count: number): P[];
}

/**
 * Random center points initializer.
 */
export class RandomInitializer implements Initializer {
  initialize<P extends Point>(points: P[], count: number): P[] {
    if (points.length <= count) {
      return [...points];
    }

    const centers = new Map<number, P>();
    while (centers.size < count) {
      const index = Math.floor(Math.random() * points.length);
      if (centers.has(index)) {
        continue;
      }

      const point = points.at(index);
      if (!point) {
        continue;
      }
      centers.set(index, [...point]);
    }
    return Array.from(centers.values());
  }
}

const NO_INDEX = -1;

export class KmeansPlusPlusInitializer implements Initializer {
  constructor(private readonly distanceMeasure: DistanceMeasure = SquaredEuclideanDistance) {}

  initialize<P extends Point>(points: P[], count: number): P[] {
    if (points.length <= count) {
      return [...points];
    }

    const selected = new Map<number, P>();
    this.selectRecursively(points, count, selected);
    return Array.from(selected.values());
  }

  private selectRecursively<P extends Point>(data: P[], k: number, selected: Map<number, P>) {
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

  private selectBest<P extends Point>(data: P[], selected: Map<number, P>) {
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

  private computeNearestDistance<P extends Point>(point: P, selected: Map<number, P>): Distance {
    let minDistance: Distance = toDistance(Number.MAX_VALUE);
    for (const selectedPoint of selected.values()) {
      const distance = this.distanceMeasure<P>(point, selectedPoint);
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

/**
 * Map of initialize method name.
 */
interface MethodNameMap {
  'kmeans++': KmeansPlusPlusInitializer;
  random: RandomInitializer;
}

export type MethodName = keyof MethodNameMap;

/**
 * Create an {@link Initializer} from method name.
 *
 * @param name The name of method.
 * @return The instance of {@link Initializer} corresponding to the method name.
 * @throws {TypeError} if the method name is unrecognized.
 */
export function createInitializer<T extends MethodName>(name: T): MethodNameMap[T];
export function createInitializer<T extends MethodName>(name: T): Initializer {
  switch (name) {
    case 'kmeans++': {
      return new KmeansPlusPlusInitializer();
    }
    case 'random': {
      return new RandomInitializer();
    }
    default: {
      throw new TypeError(`Unrecognized method name: ${name}`);
    }
  }
}

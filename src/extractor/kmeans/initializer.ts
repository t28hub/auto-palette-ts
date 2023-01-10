import { toDistance, Distance, DistanceFunction, Point, squaredEuclidean } from '../../math';

/**
 * Interface to choose initial centroids.
 */
export interface Initializer {
  /**
   * Choose initial centroids.
   *
   * @param points The all points.
   * @param count The number of center points.
   * @return The initial centroids.
   */
  initialize<P extends Point>(points: P[], count: number): P[];
}

/**
 * Random centroid initializer.
 */
export class RandomInitializer implements Initializer {
  initialize<P extends Point>(points: P[], count: number): P[] {
    if (!Number.isInteger(count) || count <= 0) {
      throw new TypeError(`Count(${count}) is not positive integer`);
    }

    if (points.length <= count) {
      return [...points];
    }

    const centroids = new Map<number, P>();
    while (centroids.size < count) {
      const index = Math.floor(Math.random() * points.length);
      if (centroids.has(index)) {
        continue;
      }

      const point = points.at(index);
      if (!point) {
        continue;
      }
      centroids.set(index, [...point]);
    }
    return Array.from(centroids.values());
  }
}

const NO_INDEX = -1;

/**
 * Kmeans++ centroid initializer.
 */
export class KmeansPlusPlusInitializer implements Initializer {
  constructor(private readonly distanceMeasure: DistanceFunction) {}

  initialize<P extends Point>(points: P[], count: number): P[] {
    if (!Number.isInteger(count) || count <= 0) {
      throw new TypeError(`Count(${count}) is not positive integer`);
    }

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
export interface InitializerMap {
  'kmeans++': KmeansPlusPlusInitializer;
  random: RandomInitializer;
}

/**
 * The name of initializers.
 */
export type InitializerName = keyof InitializerMap;

/**
 * Create an {@link Initializer} from method name.
 *
 * @param name The name of method.
 * @return The instance of initializer corresponding to the method name.
 * @throws {TypeError} if the method name is unrecognized.
 */
export function createInitializer<T extends InitializerName>(name: T): InitializerMap[T];
export function createInitializer<T extends InitializerName>(name: T): Initializer {
  switch (name) {
    case 'kmeans++': {
      return new KmeansPlusPlusInitializer(squaredEuclidean());
    }
    case 'random': {
      return new RandomInitializer();
    }
    default: {
      throw new TypeError(`Unrecognized method name: ${name}`);
    }
  }
}

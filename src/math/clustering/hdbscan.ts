import { PriorityQueue } from '../../utils';
import { kdtree } from '../neighbor';
import { Cluster, Clustering, DistanceFunction, Point } from '../types';

interface Edge {
  readonly from: number;
  readonly to: number;
  readonly weight: number;
}

/**
 * Hierarchical density-based spatial clustering of applications with noise implementation.
 *
 * @param P The type of point.
 * @see [How HDBSCAN Works](https://hdbscan.readthedocs.io/en/latest/how_hdbscan_works.html)
 */
export class HDBSCAN<P extends Point> implements Clustering<P> {
  /**
   * Create a new HDBSCAN.
   *
   * @param minPoints The number of min points to compute core distance.
   * @param distanceFunction The distance function.
   */
  constructor(private readonly minPoints: number, private readonly distanceFunction: DistanceFunction<P>) {
    if (minPoints < 1) {
      throw new RangeError(`The number of min points is less than 1: ${minPoints}`);
    }
  }

  /**
   * {@inheritDoc Clustering.fit}
   */
  fit(points: P[]): Cluster<P>[] {
    if (points.length === 0) {
      return [];
    }

    const coreDistances = this.createCoreDistances(points);
    const minimumSpanningTree = this.buildMinimumSpanningTree(points, coreDistances);
    console.table(minimumSpanningTree);
    return [];
  }

  private createCoreDistances(points: P[]): Float64Array {
    const k = Math.min(points.length, this.minPoints);
    const neighborSearch = kdtree(points, this.distanceFunction);
    return points.reduce((distances: Float64Array, point: P, index: number): Float64Array => {
      const neighbors = neighborSearch.search(point, k);
      const coreNeighbor = neighbors.pop();
      if (!coreNeighbor) {
        throw new Error(`No neighbor point corresponding at ${index} was found`);
      }
      distances[index] = coreNeighbor.distance;
      return distances;
    }, new Float64Array(points.length));
  }

  private buildMinimumSpanningTree(points: P[], coreDistance: Float64Array): Edge[] {
    const edges = new Array<Edge>();
    const attached = new Set<number>();
    const candidates = new PriorityQueue((edge: Edge): number => -edge.weight);
    let currentIndex = points.length - 1;
    attached.add(currentIndex);
    while (attached.size < points.length) {
      points.forEach((point: P, index: number) => {
        if (currentIndex == index || attached.has(index)) {
          return;
        }

        const distance = this.distanceFunction.measure(point, points[currentIndex]);
        const mutualReachabilityDistance = Math.max(distance, coreDistance[index], coreDistance[currentIndex]);
        candidates.enqueue({ from: currentIndex, to: index, weight: mutualReachabilityDistance });
      });

      while (!candidates.isEmpty) {
        const shortest = candidates.dequeue();
        if (!shortest) {
          throw new Error(`No shortest edge at ${currentIndex} was found`);
        }

        if (!attached.has(shortest.to)) {
          edges.push(shortest);
          attached.add(shortest.to);
          currentIndex = shortest.to;
          break;
        }
      }
    }
    return edges;
  }
}

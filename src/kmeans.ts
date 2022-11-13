import { Cluster } from './cluster';
import { Pixel } from './pixel';

export class Kmeans {
  constructor(
    private readonly maxIterations: number = 10,
    private readonly minDifferences: number = 0.001,
  ) {
  }

  predict(pixels: Pixel[], count: number): Pixel[] {
    if (pixels.length <= count) {
      return [...pixels];
    }

    const centers = this.initialize(pixels, count);
    const clusters = centers.map((initialCenter: Pixel): Cluster => new Cluster(initialCenter));
    for (let i = 0; i < this.maxIterations; i++) {
      const oldCenters = clusters.map((cluster: Cluster): Pixel => cluster.getCenter());
      clusters.forEach((cluster: Cluster) => cluster.clear());

      for (const pixel of pixels) {
        const nearest = this.findNearestCluster(clusters, pixel);
        nearest.insert(pixel);
      }

      clusters.forEach((cluster: Cluster) => cluster.updateCenter());

      const newCenters = clusters.map((cluster: Cluster): Pixel => cluster.getCenter());
      const difference = this.difference(oldCenters, newCenters);
      if (difference < this.minDifferences) {
        break;
      }
    }
    return clusters.map((cluster: Cluster): Pixel => cluster.getCenter());
  }

  private initialize(pixels: Pixel[], count: number): Pixel[] {
    const centroids = new Map<number, Pixel>();
    while (centroids.size < count) {
      const index = Math.floor(Math.random() * pixels.length);
      if (centroids.has(index)) {
        continue;
      }

      const pixel = pixels.at(index);
      if (!pixel) {
        continue;
      }
      centroids.set(index, [...pixel]);
    }
    return Array.from(centroids.values());
  }

  private findNearestCluster(clusters: Cluster[], pixel: Pixel): Cluster {
    let nearest: Cluster | undefined;
    let minDistance = Number.MAX_VALUE;
    for (const cluster of clusters) {
      const distance = cluster.distanceTo(pixel);
      if (distance >= minDistance) {
        continue;
      }
      nearest = cluster;
      minDistance = distance;
    }
    return nearest || clusters[0];
  }

  private difference(centers1: Pixel[], centers2: Pixel[]): number {
    let difference = 0.0;
    for (let i = 0; i < centers1.length; i++) {
      const center1 = centers1[i];
      const center2 = centers2[i];
      const squared = center1.reduce((totalDistance, component, index): number => {
        const delta = center2[index] - component;
        return totalDistance + delta * delta;
      }, 0);
      difference += Math.sqrt(squared);
    }
    return difference;
  }
}
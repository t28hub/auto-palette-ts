import { Vector3 } from './math';
import { Pixel } from './pixel';

export class Cluster {
  private readonly center: Vector3;
  private readonly pixels: Pixel[];

  constructor(initialCenter: Pixel) {
    this.center = new Vector3(...initialCenter);
    this.pixels = [];
  }

  get size(): number {
    return this.pixels.length;
  }

  get isEmpty(): boolean {
    return this.pixels.length === 0;
  }

  getCenter(): Pixel {
    return this.center.toArray() as Pixel;
  }

  updateCenter() {
    this.center.setZero();
    if (this.isEmpty) {
      return;
    }

    for (const pixel of this.pixels) {
      this.center.add(pixel);
    }
    this.center.scale(1 / this.size);
  }

  insert(pixel: Pixel) {
    this.pixels.push(pixel);
  }

  clear() {
    this.pixels.length = 0;
  }

  distanceTo(pixel: Pixel): number {
    return this.center.distanceTo(pixel);
  }
}

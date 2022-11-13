import { Pixel } from './pixel';

export class Cluster {
  private readonly center: Pixel;
  private readonly pixels: Pixel[];

  constructor(initialCenter: Pixel) {
    this.center = [...initialCenter];
    this.pixels = [];
  }

  get size(): number {
    return this.pixels.length;
  }

  get isEmpty(): boolean {
    return this.pixels.length === 0;
  }

  getCenter(): Pixel {
    return [...this.center];
  }

  updateCenter() {
    this.center.fill(0.0);
    for (const pixel of this.pixels) {
      this.center[0] += pixel[0];
      this.center[1] += pixel[1];
      this.center[2] += pixel[2];
    }

    if (this.isEmpty) {
      return;
    }

    this.center[0] /= this.size;
    this.center[1] /= this.size;
    this.center[2] /= this.size;
  }

  insert(pixel: Pixel) {
    this.pixels.push(pixel);
  }

  clear() {
    this.pixels.length = 0;
  }

  distanceTo(pixel: Pixel): number {
    const squared = this.center.reduce((totalDistance, component, index): number => {
      const delta = pixel[index] - component;
      return totalDistance + delta * delta;
    }, 0);
    return Math.sqrt(squared);
  }
}

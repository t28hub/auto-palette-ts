import { Point3 } from '../../math';

const INDEX_X = 0;
const INDEX_Y = 1;
const INDEX_Z = 2;

export class Bounds {
  private readonly min: Point3;
  private readonly max: Point3;

  constructor(min: Point3, max: Point3) {
    this.min = [...min];
    this.max = [...max];
  }

  get extentX(): number {
    return this.max[INDEX_X] - this.min[INDEX_X];
  }

  get extentY(): number {
    return this.max[INDEX_Y] - this.min[INDEX_Y];
  }

  get extentZ(): number {
    return this.max[INDEX_Z] - this.min[INDEX_Z];
  }

  getMinPoint(): Point3 {
    return [...this.min];
  }

  getMaxPoint(): Point3 {
    return [...this.max];
  }

  contains(point: Point3): boolean {
    for (let i = 0; i < point.length; i++) {
      const min = this.min[i];
      const max = this.max[i];
      const value = point[i];
      if (value < min || value > max) {
        return false;
      }
    }
    return true;
  }
}

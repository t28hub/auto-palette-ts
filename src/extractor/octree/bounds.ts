import { Point3 } from '../../math';

const INDEX_X = 0;
const INDEX_Y = 1;
const INDEX_Z = 2;

/**
 * Class representing 3d bounds.
 */
export class Bounds {
  private readonly min: Point3;
  private readonly max: Point3;

  /**
   * Create a new bounds.
   *
   * @param min The min point.
   * @param max The max point.
   * @throws {TypeError} if either min point or max point contains invalid value.
   */
  constructor(min: Point3, max: Point3) {
    this.min = min.map((value: number, index: number): number => {
      if (!Number.isFinite(value)) {
        throw new TypeError(`The min point contains invalid value(${value}) at ${index}`);
      }
      return value;
    }) as Point3;

    this.max = max.map((value: number, index: number): number => {
      if (!Number.isFinite(value)) {
        throw new TypeError(`The max point contains invalid value(${value}) at ${index}`);
      }
      return value;
    }) as Point3;
  }

  /**
   * Return the extent of x.
   */
  get extentX(): number {
    return this.max[INDEX_X] - this.min[INDEX_X];
  }

  /**
   * Return the extent of y.
   */
  get extentY(): number {
    return this.max[INDEX_Y] - this.min[INDEX_Y];
  }

  /**
   * Return the extent of z.
   */
  get extentZ(): number {
    return this.max[INDEX_Z] - this.min[INDEX_Z];
  }

  /**
   * Return the min point.
   *
   * @return The min point.
   */
  getMinPoint(): Point3 {
    return [...this.min];
  }

  /**
   * Return the max point.
   *
   * @return The max point.
   */
  getMaxPoint(): Point3 {
    return [...this.max];
  }

  /**
   * Check whether the given point is contained this bounds.
   *
   * @param point The point to be checked.
   * @return true if the point is contained this bounds.
   */
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

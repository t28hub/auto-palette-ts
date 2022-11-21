import { Distance, DistanceMeasure, EuclideanDistance } from './distance';
import { Point } from './point';

const NO_INDEX = -1;

export class Vector<P extends Point> {
  private readonly components: P;

  /**
   * Create a new Vector.
   *
   * @param source The source point.
   * @throws {TypeError} if source contain invalid component.
   */
  constructor(source: P) {
    const invalidIndex = source.findIndex((value: number): boolean => !Number.isFinite(value));
    if (invalidIndex !== NO_INDEX) {
      throw new TypeError(`The source contain infinite number at ${invalidIndex}`);
    }
    this.components = [...source];
  }

  /**
   * Return the dimension of this vector.
   */
  get dimension(): number {
    return this.components.length;
  }

  /**
   * Return a string representation of this vector.
   *
   * @return The string representation.
   */
  toString(): string {
    return `Vector(${this.components.join(', ')})`;
  }

  /**
   * Return an array representation of this vector.
   *
   * @return The array representation.
   */
  toArray(): P {
    return [...this.components];
  }

  /**
   * Set this vector to zero vector.
   *
   * @return The current vector.
   */
  setZero(): this {
    for (let i = 0; i < this.dimension; i++) {
      this.components[i] = 0.0;
    }
    return this;
  }

  /**
   * Add the vector or point to this vector.
   *
   * @param other The other vector or point.
   * @return The current vector.
   */
  add(other: Vector<P> | P): this {
    const components = other instanceof Vector ? other.components : other;
    for (let i = 0; i < this.dimension; i++) {
      if (!Number.isFinite(components[i])) {
        throw new TypeError(`Component(${components[i]}) at ${i} is not finite number`);
      }
      this.components[i] += components[i];
    }
    return this;
  }

  /**
   * Scale this vector by the scalar.
   *
   * @param scalar The scalar.
   * @return The current vector.
   * @throws {TypeError} if the scalar is not finite number.
   */
  scale(scalar: number): this {
    if (!Number.isFinite(scalar)) {
      throw new TypeError(`Scalar(${scalar}) is not finite number`);
    }

    for (let i = 0; i < this.dimension; i++) {
      this.components[i] *= scalar;
    }
    return this;
  }

  /**
   * Compute the distance to the other vector or point.
   *
   * @param other The other vector or point.
   * @param distanceMeasure The distance measure to be used.
   * @return The distance to the other vector or point.
   */
  distanceTo(other: Vector<P> | P, distanceMeasure: DistanceMeasure = EuclideanDistance): Distance {
    const components = other instanceof Vector ? other.components : other;
    return distanceMeasure<P>(this.components, components);
  }
}

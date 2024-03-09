import { assert, assertFiniteNumber } from '../utils';
import { type Distance, type DistanceMeasure, euclidean } from './distance';
import type { Point } from './point';

const NO_INDEX = -1;

export class Vector<P extends Point> {
  private readonly components: P;

  /**
   * Create a new Vector instance
   *
   * @param source The source point.
   */
  constructor(source: P) {
    const invalidIndex = source.findIndex((value: number): boolean => !Number.isFinite(value));
    assert(invalidIndex === NO_INDEX, `The source point contain infinite number at ${invalidIndex}`);
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
   * Clone this vector.
   *
   * @return The cloned vector.
   */
  clone(): Vector<P> {
    return new Vector<P>(this.components);
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
      assertFiniteNumber(components[i], `The component(${components[i]}) at ${i} is not finite number`);
      this.components[i] += components[i];
    }
    return this;
  }

  /**
   * Scale this vector by the scalar.
   *
   * @param scalar The scalar.
   * @return The current vector.
   */
  scale(scalar: number): this {
    assertFiniteNumber(scalar, `The scalar(${scalar}) must be a finite number`);
    for (let i = 0; i < this.dimension; i++) {
      this.components[i] *= scalar;
    }
    return this;
  }

  /**
   * Compute the distance to the other vector or point.
   *
   * @param other - The other vector or point.
   * @param distanceMeasure - The distance measure.
   * @return The distance to the other vector or point.
   */
  distanceTo(other: Vector<P> | P, distanceMeasure: DistanceMeasure = euclidean): Distance {
    const components = other instanceof Vector ? other.components : other;
    return distanceMeasure(this.components, components);
  }
}

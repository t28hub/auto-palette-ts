import { Distance, DistanceMeasure, EuclideanDistance } from './distance';
import { Point3 } from './point';

/**
 * Class representing 3D vector.
 */
export class Vector3 {
  private readonly components: Point3;

  /**
   * Instantiate a new {@link Vector3} with initial components.
   *
   * @param component1 The 1st component.
   * @param component2 The 2nd component.
   * @param component3 The 3rd component.
   */
  constructor(component1: number, component2: number, component3: number) {
    this.components = [component1, component2, component3];
  }

  /**
   * The number of dimensions of this vector.
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
  toArray(): Point3 {
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
  add(other: Vector3 | Point3): this {
    const components = other instanceof Vector3 ? other.components : other;
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
   * @param distanceMeasure The {@link DistanceMeasure} to be used.
   * @return The distance to the other vector or point.
   */
  distanceTo(other: Vector3 | Point3, distanceMeasure: DistanceMeasure = EuclideanDistance): Distance {
    const components = other instanceof Vector3 ? other.components : other;
    return distanceMeasure<Point3>(this.components, components);
  }
}

import { Point3, WeightFunction } from '../math';
import { DeltaEFunction } from '../types';

/**
 * WeightFunction implementation to compute DeltaE on CIE L*a*b* color space.
 */
export class DeltaEWeightFunction implements WeightFunction {
  /**
   * Create a new LabWeightFunction.
   *
   * @param colors The array containing CIE L*a*b* representation.
   * @param deltaEFunction The DeltaE function.
   */
  constructor(
    private readonly colors: Point3[],
    private readonly deltaEFunction: DeltaEFunction,
  ) {}

  /**
   * {@inheritDoc WeightFunction.compute}
   */
  compute(u: number, v: number): number {
    this.checkIndex(u);
    this.checkIndex(v);

    const [l1, a1, b1] = this.colors[u];
    const [l2, a2, b2] = this.colors[v];
    return this.deltaEFunction.compute({ l: l1, a: a1, b: b1, opacity: 1.0 }, { l: l2, a: a2, b: b2, opacity: 1.0 });
  }

  private checkIndex(index: number) {
    if (index < 0 || index >= this.colors.length) {
      throw new RangeError(`The index(${index}) is out of range [0, ${this.colors.length}).`);
    }
  }
}

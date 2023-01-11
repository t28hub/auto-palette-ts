import { Point, Vector } from '../../math';

export class Cluster<P extends Point> {
  private readonly children: P[];

  constructor(points: Iterable<P> | ArrayLike<P>) {
    this.children = Array.from(points);
  }

  get size(): number {
    return this.children.length;
  }

  get isEmpty(): boolean {
    return this.children.length === 0;
  }

  average(): P {
    if (this.size === 0) {
      throw new Error('This cluster does not have children');
    }

    const total = this.children.reduce((previousVector: Vector<P>, point: P, index: number): Vector<P> => {
      if (index === 0) {
        return previousVector;
      }
      return previousVector.add(point);
    }, new Vector<P>(this.children[0]));
    return total.scale(1 / this.size).toArray();
  }

  insert(point: P) {
    this.children.push(point);
  }
}

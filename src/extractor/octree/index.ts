import { Color, colorModel } from '../../color';
import { Point3 } from '../../math';
import { ImageData } from '../../types';
import { FeatureColor, Extractor } from '../extractor';

import { Bounds } from './bounds';
import { Node } from './node';
import { Octree } from './octree';

const MAX_DEPTH = 8;

/**
 * The options of {@link OctreeExtractor}.
 */
export type Options = {
  readonly kind: 'octree';
  readonly maxDepth: number;
};

const defaultOptions: Options = {
  kind: 'octree',
  maxDepth: 5,
};

export class OctreeExtractor implements Extractor {
  private readonly bounds: Bounds;
  private readonly maxDepth: number;

  constructor(options: Partial<Options> = {}) {
    const merged: Options = { ...options, ...defaultOptions };
    const maxDepth = merged.maxDepth;
    if (!Number.isInteger(maxDepth) || maxDepth < 1 || maxDepth > MAX_DEPTH) {
      throw new TypeError(`The maxDepth(${maxDepth}) is not from 1 to ${MAX_DEPTH}`);
    }

    const max = 1 << maxDepth;
    const minPixel: Point3 = [0, 0, 0];
    const maxPixel: Point3 = [max, max, max];
    this.bounds = new Bounds(minPixel, maxPixel);
    this.maxDepth = maxDepth;
  }

  extract(imageData: ImageData<Uint8ClampedArray>, maxColors: number): FeatureColor<Color>[] {
    const data = imageData.data;
    if (data.length === 0) {
      return [];
    }

    const octree = new Octree(this.bounds, this.maxDepth);
    const colorShift = MAX_DEPTH - this.maxDepth;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      octree.insert([r >> colorShift, g >> colorShift, b >> colorShift]);
    }

    let leafCount = octree.countLeafNodes();
    for (let depth = this.maxDepth - 1; depth > 0; depth--) {
      if (leafCount <= maxColors) {
        break;
      }

      octree.forEachNodes(depth, (found: Node) => {
        if (found.isLeafNode) {
          return;
        }

        if (leafCount - found.childrenSize < maxColors) {
          return;
        }

        // Sub the number of the deleted leaf nodes.
        leafCount -= found.deleteChildNodes();

        // Add the found node as a leaf node.
        leafCount += 1;
      });
    }

    const leafNodes = octree.findLeafNodes().filter((node: Node): boolean => {
      return !node.isEmpty;
    });

    const rgbModel = colorModel('rgb');
    return leafNodes.map((leaf: Node): FeatureColor<Color> => {
      const center = leaf.getCenter();
      const r = center[0] << colorShift;
      const g = center[1] << colorShift;
      const b = center[2] << colorShift;
      const packed = rgbModel.pack({ r, g, b, opacity: 1.0 });
      return {
        color: Color.fromPackedColor(packed),
        population: leaf.size,
      };
    });
  }
}

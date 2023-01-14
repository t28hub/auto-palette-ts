import { parse, rgb } from '../../color';
import { Point3 } from '../../math';
import { ImageObject, RGB, Swatch } from '../../types';
import { composite } from '../filter';
import { ColorFilter, Extractor } from '../types';

import { Bounds } from './bounds';
import { Node } from './node';
import { Octree } from './octree';

const MAX_DEPTH = 8;
const MAX_COLORS = 25;

export class OctreeExtractor implements Extractor {
  private readonly bounds: Bounds;
  private readonly filter: ColorFilter<RGB>;

  constructor(private readonly maxDepth: number, colorFilters: ColorFilter<RGB>[]) {
    if (!Number.isInteger(maxDepth) || maxDepth < 1 || maxDepth > MAX_DEPTH) {
      throw new TypeError(`The maxDepth(${maxDepth}) is not from 1 to ${MAX_DEPTH}`);
    }

    const max = 1 << maxDepth;
    const minPixel: Point3 = [0, 0, 0];
    const maxPixel: Point3 = [max, max, max];
    this.bounds = new Bounds(minPixel, maxPixel);
    this.filter = composite(...colorFilters);
  }

  extract(imageData: ImageObject<Uint8ClampedArray>): Swatch[] {
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
      const opacity = data[i + 3] / 0xff;
      if (!this.filter.test({ r, g, b, opacity })) {
        continue;
      }
      octree.insert([r >> colorShift, g >> colorShift, b >> colorShift]);
    }

    let leafCount = octree.countLeafNodes();
    for (let depth = this.maxDepth - 1; depth > 0; depth--) {
      if (leafCount <= MAX_COLORS) {
        break;
      }

      octree.forEachNodes(depth, (found: Node) => {
        if (found.isLeafNode) {
          return;
        }

        if (leafCount - found.childrenSize < MAX_COLORS) {
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

    return leafNodes.map((leaf: Node): Swatch => {
      const center = leaf.getCenter();
      const r = center[0] << colorShift;
      const g = center[1] << colorShift;
      const b = center[2] << colorShift;
      const packed = rgb().encode({ r, g, b, opacity: 1.0 });
      return {
        color: parse(packed),
        population: leaf.size,
        coordinate: { x: 0, y: 0 }, // OctreeExtractor does not support the coordinate property.
      };
    });
  }
}

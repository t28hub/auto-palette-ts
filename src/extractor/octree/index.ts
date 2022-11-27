import { Color, colorModel } from '../../color';
import { Point3 } from '../../math';
import { ExtractionResult, Extractor } from '../extractor';

import { Bounds } from './bounds';
import { Node } from './node';
import { Octree } from './octree';

const DEFAULT_DEPTH = 5;
const MAX_DEPTH = 8;

export class OctreeExtractor implements Extractor {
  private readonly bounds: Bounds;

  constructor(private readonly maxDepth: number = DEFAULT_DEPTH) {
    if (!Number.isInteger(maxDepth) || maxDepth < 1 || maxDepth > MAX_DEPTH) {
      throw new TypeError(`The maxDepth(${maxDepth}) is not from 1 to ${MAX_DEPTH}`);
    }

    const max = 1 << maxDepth;
    const minPixel: Point3 = [0, 0, 0];
    const maxPixel: Point3 = [max, max, max];
    this.bounds = new Bounds(minPixel, maxPixel);
  }

  extract(imageData: ImageData, maxColors: number): ExtractionResult<Color>[] {
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

        if (leafCount - found.childNodesSize < maxColors) {
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
    return leafNodes.map((leaf: Node): ExtractionResult<Color> => {
      const center = leaf.getCenter();
      const packed = rgbModel.pack({
        r: center[0] << colorShift,
        g: center[1] << colorShift,
        b: center[2] << colorShift,
        opacity: 1.0,
      });
      return {
        color: Color.fromPackedColor(packed),
        population: leaf.size,
      };
    });
  }
}

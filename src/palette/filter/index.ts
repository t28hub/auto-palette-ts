import { Color, Swatch } from '../../types';

import { Node } from './node';

export function filter(swatches: Swatch<Color>[], count: number): Swatch<Color>[] {
  const nodes = swatches.map((swatch: Swatch<Color>): Node => {
    return new Node(swatch.color, swatch.population);
  });
  return merge(nodes, count);
}

function merge(nodes: Node[], count: number): Node[] {
  if (nodes.length <= count) {
    return nodes;
  }

  let nearestNode1: Node | undefined;
  let nearestNode2: Node | undefined;
  let minDistance = Number.MAX_VALUE;
  // Find pair of nearest nodes
  for (let i = 0; i < nodes.length; i++) {
    const node1 = nodes[i];
    for (let j = i + 1; j < nodes.length; j++) {
      const node2 = nodes[j];
      const distance = node1.distanceTo(node2);
      if (distance < minDistance) {
        nearestNode1 = node1;
        nearestNode2 = node2;
        minDistance = distance;
      }
    }
  }

  if (!nearestNode1 || !nearestNode2) {
    throw new Error('Cannot find pair of nearest nodes');
  }

  // Merge nodes
  const filtered = nodes.filter((node: Node): boolean => {
    return node !== nearestNode1 && node !== nearestNode2;
  });
  filtered.push(nearestNode1.merge(nearestNode2));
  return merge(filtered, count);
}

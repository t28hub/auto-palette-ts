import { type Extractor } from './extractor';
import { KmeansExtractor, Options as KmeansOptions } from './kmeans';
import { OctreeExtractor, Options as OctreeOptions } from './octree';

export type Options = KmeansOptions | OctreeOptions;
export { type Extractor } from './extractor';

/**
 * Create a new {@link Extractor} with options.
 *
 * @param options The options for the extractor.
 * @return The created extractor.
 */
export function createExtractor(options: Partial<Options> = {}): Extractor {
  switch (options.kind) {
    case 'kmeans':
      return new KmeansExtractor(options);
    case 'octree':
      return new OctreeExtractor(options);
    default:
      return new KmeansExtractor();
  }
}

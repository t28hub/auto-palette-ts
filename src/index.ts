import { PaletteExtractor } from './paletteExtractor';
import { Quality } from './types';
import { defaultWorker } from './worker';

export { PaletteExtractor } from './paletteExtractor';
export type { Palette } from './palette';
export type { Color, ImageSource, Quality, Swatch } from './types';

/**
 * Type representing options for Auto Palette.
 */
export type Options = {
  readonly quality: Quality;
  readonly maxImageSize: number;
};

const DEFAULT_OPTIONS: Options = {
  quality: 'middle',
  maxImageSize: 128 * 128,
};

export function create(options: Partial<Options> = {}): PaletteExtractor {
  const { quality, maxImageSize } = { ...DEFAULT_OPTIONS, ...options };
  return new PaletteExtractor(quality, maxImageSize, defaultWorker());
}

import { Color } from '../color';
import { normalize } from '../math';
import { Swatch } from '../swatch';
import { assertRange } from '../utils';
import { ThemeStrategy } from './strategy';

const DEFAULT_MAX_CHROMA = 80;

/**
 * The ThemeStrategy implementation for the muted theme.
 */
export class MutedThemeStrategy implements ThemeStrategy {
  /**
   * Create a new MutedThemeStrategy instance.
   *
   * @param maxChroma - The maximum chroma of the palette. The default value is 80.
   * @throws {AssertionError} If the maxChroma is not in the range [0, 180].
   */
  constructor(private readonly maxChroma: number = DEFAULT_MAX_CHROMA) {
    assertRange(
      maxChroma,
      Color.MIN_CHROMA,
      Color.MAX_CHROMA,
      `The maximum chroma must be in the range [${Color.MIN_CHROMA}, ${Color.MAX_CHROMA}]: ${maxChroma}`,
    );
  }

  /**
   * {@inheritDoc ThemeStrategy.filter}
   */
  filter(swatch: Swatch): boolean {
    const chroma = swatch.color.chroma();
    return chroma <= this.maxChroma;
  }

  /**
   * {@inheritDoc ThemeStrategy.score}
   */
  score(swatch: Swatch): number {
    const chroma = swatch.color.chroma();
    return 1.0 - normalize(chroma, Color.MIN_CHROMA, Color.MAX_CHROMA);
  }
}

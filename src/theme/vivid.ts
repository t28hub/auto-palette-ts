import { Color } from '../color';
import { normalize } from '../math';
import type { Swatch } from '../swatch';
import { assertRange } from '../utils';
import type { ThemeStrategy } from './strategy';

const DEFAULT_MIN_CHROMA = 60;

/**
 * The ThemeStrategy implementation for the vivid theme.
 */
export class VividThemeStrategy implements ThemeStrategy {
  /**
   * Create a new VividThemeStrategy instance.
   *
   * @param minChroma - The minimum chroma of the theme. The default value is 60.
   * @throws {AssertionError} If the minChroma is not in the range [0, 180].
   */
  constructor(private readonly minChroma: number = DEFAULT_MIN_CHROMA) {
    assertRange(
      minChroma,
      Color.MIN_CHROMA,
      Color.MAX_CHROMA,
      `The minimum chroma must be in the range [${Color.MIN_CHROMA}, ${Color.MAX_CHROMA}]: ${minChroma}`,
    );
  }

  /**
   * {@inheritDoc ThemeStrategy.filter}
   */
  filter(swatch: Swatch): boolean {
    const chroma = swatch.color.chroma();
    return chroma >= this.minChroma;
  }

  /**
   * {@inheritDoc ThemeStrategy.score}
   */
  score(swatch: Swatch): number {
    const chroma = swatch.color.chroma();
    return normalize(chroma, Color.MIN_CHROMA, Color.MAX_CHROMA);
  }
}

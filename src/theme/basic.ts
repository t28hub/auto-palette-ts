import { Color } from '../color';
import { normalize } from '../math';
import { Swatch } from '../swatch';
import { assertPositiveInteger } from '../utils';
import { ThemeStrategy } from './strategy';

// The `MIN_LIGHTNESS` and `MAX_LIGHTNESS` values are derived from the following paper:
// "Colorgorical: Creating discriminable and preferable color palettes for information visualization"
// The paper can be found at the following URL:
// http://vrl.cs.brown.edu/color/pdf/colorgorical.pdf?v=5dd92af6d1e6c5584236275adc769e82
const MIN_LIGHTNESS = 25;
const MAX_LIGHTNESS = 85;

const WEIGHT_CHROMA = 0.25;
const WEIGHT_LIGHTNESS = 0.25;
const WEIGHT_POPULATION = 0.5;

/**
 * The ThemeStrategy implementation for the basic theme.
 */
export class BasicThemeStrategy implements ThemeStrategy {
  /**
   * Create a new DefaultThemeStrategy instance.
   *
   * @param maxPopulation - The maximum population of the palette.
   * @throws {AssertionError} If the maxPopulation is not a positive integer.
   */
  constructor(private readonly maxPopulation: number) {
    assertPositiveInteger(maxPopulation, `The maximum population must be a positive integer: ${maxPopulation}`);
  }

  /**
   * {@inheritDoc ThemeStrategy.filter}
   */
  filter(swatch: Swatch): boolean {
    const lightness = swatch.color.lightness();
    return lightness >= MIN_LIGHTNESS && lightness <= MAX_LIGHTNESS;
  }

  /**
   * {@inheritDoc ThemeStrategy.score}
   */
  score(swatch: Swatch): number {
    const chroma = normalize(swatch.color.chroma(), Color.MIN_CHROMA, Color.MAX_CHROMA);
    const lightness = normalize(swatch.color.lightness(), Color.MIN_LIGHTNESS, Color.MAX_LIGHTNESS);
    const population = normalize(swatch.population, 0, this.maxPopulation);
    return WEIGHT_CHROMA * chroma + WEIGHT_LIGHTNESS * lightness + WEIGHT_POPULATION * population;
  }
}

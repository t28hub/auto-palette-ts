import { Color } from '../color';
import { normalize } from '../math';
import { Swatch } from '../swatch';
import { assertPositiveInteger } from '../utils';
import { ThemeStrategy } from './strategy';

const WEIGHT_CHROMA = 0.25;
const WEIGHT_LIGHTNESS = 0.25;
const WEIGHT_POPULATION = 0.5;

/**
 * The default theme strategy.
 */
export class DefaultThemeStrategy implements ThemeStrategy {
  /**
   * Create a new DefaultThemeStrategy instance.
   *
   * @param maxPopulation - The maximum population of the palette.
   * @throws {TypeError} If the maximum population is not a positive integer.
   */
  constructor(private readonly maxPopulation: number) {
    assertPositiveInteger(maxPopulation, `The maximum population must be a positive integer: ${maxPopulation}`);
  }

  /**
   * {@inheritDoc ThemeStrategy.filter}
   */
  filter(_swatch: Swatch): boolean {
    return true;
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

/**
 * ThemeVisitor is a visitor to visit a theme.
 *
 * @typeParam P - The type of the parameter.
 * @typeParam R - The type of the return value.
 */
export interface ThemeVisitor<P, R> {
  /**
   * Visit the basic theme.
   *
   * @param parameter - The parameter.
   * @returns The return value.
   */
  visitBasic(parameter: P): R;

  /**
   * Visit the vivid theme.
   *
   * @param parameter - The parameter.
   * @returns The return value.
   */
  visitVivid(parameter: P): R;

  /**
   * Visit the muted theme.
   *
   * @param parameter - The parameter.
   * @returns The return value.
   */
  visitMuted(parameter: P): R;

  /**
   * Visit the light theme.
   *
   * @param parameter - The parameter.
   * @returns The return value.
   */
  visitLight(parameter: P): R;

  /**
   * Visit the dark theme.
   *
   * @param parameter - The parameter.
   * @returns The return value.
   */
  visitDark(parameter: P): R;
}

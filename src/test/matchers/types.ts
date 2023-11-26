/**
 * MatcherResult interface representing the result of a matcher.
 */
export interface MatcherResult {
  /**
   * Whether the matcher passed or failed.
   */
  pass: boolean;

  /**
   * A function returning the error message for the matcher.
   */
  message: () => string;

  /**
   * The actual value received by the matcher.
   */
  actual?: unknown;

  /**
   * The expected value for the matcher.
   */
  expected?: unknown;
}

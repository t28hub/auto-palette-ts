/**
 * Check if the current environment is a browser.
 *
 * @return True if the current environment is a browser, false otherwise.
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Check if value is a number
 *
 * @param value - The value to check.
 * @returns True if the value is a number, false otherwise.
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

/**
 * Check if value is a string
 *
 * @param value - The value to check.
 * @returns True if the value is a string, false otherwise.
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

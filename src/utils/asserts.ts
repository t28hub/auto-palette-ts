import { isNumber } from './guards';

/**
 * AssertionError is thrown when an assertion fails.
 */
export class AssertionError extends Error {
  /**
   * Create an AssertionError instance.
   *
   * @param message - The error message.
   */
  constructor(message: string) {
    super(message);
    this.name = 'AssertionError';
  }
}

/**
 * Assert the given condition is true.
 *
 * @param condition - The condition to check.
 * @param message - The error message.
 * @throws {AssertionError} if the condition is false.
 */
export function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new AssertionError(message);
  }
}

/**
 * Assert the given value is not null or undefined.
 *
 * @param value - The value to check.
 * @param message - The error message.
 */
export function assertDefined<T>(value: T, message: string): asserts value is NonNullable<T> {
  assert(value !== undefined && value !== null, message);
}

/**
 * Assert the given value is a finite number.
 *
 * @param value - The value to check.
 * @param message - The error message.
 * @throws {AssertionError} if the value is not a finite number.
 */
export function assertFiniteNumber(value: unknown, message: string): asserts value is number {
  assert(isNumber(value) && Number.isFinite(value), message);
}

/**
 * Assert the given value is an integer.
 *
 * @param value - The value to check.
 * @param message - The error message.
 * @throws {AssertionError} if the value is not an integer.
 */
export function assertInteger(value: unknown, message: string): asserts value is number {
  assert(isNumber(value) && Number.isSafeInteger(value), message);
}

/**
 * Assert the given value is a positive integer.
 *
 * @param value - The value to check.
 * @param message - The error message.
 * @throws {AssertionError} if the value is not a positive integer.
 */
export function assertPositiveInteger(value: unknown, message: string): asserts value is number {
  assertInteger(value, message);
  assert(value > 0, message);
}

declare const validID: unique symbol;

/**
 * Type representing an unique ID.
 */
export type ID = string & {
  readonly [validID]: true;
};

/**
 * Check whether the given value is valid ID.
 *
 * @param value The value to be checked.
 * @return true if the given value is valid ID.
 */
export function isID(value: unknown): value is ID {
  if (typeof value !== 'string') {
    return false;
  }
  return /^[0-9a-f]{8}$/.test(value);
}

/**
 * Convert the given string as the valid ID.
 *
 * @param value The value to be converted.
 * @return The valid ID.
 * @throws {TypeError} if the given string is not valid ID.
 */
export function asID(value: string): ID {
  if (!isID(value)) {
    throw new TypeError(`The value(${value}) does not match the pattern of ID`);
  }
  return value;
}

/**
 * Generate a new ID.
 *
 * @return The generated ID.
 */
export function id(): ID {
  const generated = Array.from({ length: 8 }).reduce((previous: string): string => {
    const value = Math.round(Math.random() * 0xf);
    return `${previous}${value.toString(16)}`;
  }, '');
  return asID(generated);
}

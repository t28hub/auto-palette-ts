declare const validUUID: unique symbol;

/**
 * Type representing an unique ID.
 */
export type UUID = string & {
  readonly [validUUID]: true;
};

/**
 * Generate a new UUID v4.
 *
 * @return The generated ID.
 */
export function uuid(): UUID {
  return crypto.randomUUID() as UUID;
}

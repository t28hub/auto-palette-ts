/**
 * Construct a type will all properties of T set to mutable.
 *
 * @param T The type of value.
 */
export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

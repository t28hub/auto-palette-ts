/**
 * Mutable type represents a type with all its properties being mutable.
 */
export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

/**
 * Named type represents a value with a name.
 *
 * @param T The type of the value.
 */
export type Named<T> = T & {
  readonly name: string;
};

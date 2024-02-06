/**
 * Result of a comparison between two values.
 */
export type Ordering =
  | -1 // Less than
  | 0 // Equal
  | 1; // Greater than

/**
 * Type of function that compares two values.
 */
export type Comparator<T> = (value1: T, value2: T) => Ordering;

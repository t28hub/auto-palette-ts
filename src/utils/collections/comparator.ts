/**
 * Type of function that compares two values.
 *
 * @typeParam T - The type of the value.
 * @param value1 - The first value.
 * @param value2 - The second value.
 * @returns A negative number if the first value is less than the second value, a positive number if the first value is greater than the second value, or zero if the first value is equal to the second value.
 */
export type Comparator<T> = (value1: T, value2: T) => number;

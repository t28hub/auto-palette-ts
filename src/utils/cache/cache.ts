/**
 * Cache interface for caching key-value pairs.
 *
 * @typeParam K - The type of the keys in the cache.
 * @typeParam V - The type of the values in the cache.
 */
export interface Cache<K, V> {
  /**
   * The size of the cache.
   */
  readonly size: number;

  /**
   * Get the value from the cache.
   *
   * @param key - The key of the value to get.
   * @returns The value if found, undefined otherwise.
   */
  get(key: K): V | undefined;

  /**
   * Set the value in the cache.
   *
   * @param key - The key of the value to set.
   * @param value - The value to set.
   * @returns The previous value if found, undefined otherwise.
   */
  put(key: K, value: V): V | undefined;

  /**
   * Remove the value from the cache.
   *
   * @param key - The key of the value to remove.
   * @returns True if the value was removed, false otherwise.
   */
  remove(key: K): boolean;

  /**
   * Clear the cache.
   */
  clear(): void;
}

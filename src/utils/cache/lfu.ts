import { assertDefined, assertPositiveInteger } from '../asserts';
import { DoubleLinkedList, DoubleLinkedListNode } from '../collections';
import { Cache } from './cache';

/**
 * Entry interface for LFU cache.
 *
 * @typeParam K - The type of the keys in the cache.
 * @typeParam V - The type of the values in the cache.
 */
interface Entry<K, V> {
  /**
   * The key of the entry.
   */
  readonly key: K;

  /**
   * The value of the entry.
   */
  readonly value: V;

  /**
   * The frequency of the entry.
   */
  frequency: number;
}

/**
 * LFU(Least Frequently Used) cache implementation.
 *
 * @typeParam K - The type of the keys in the cache.
 * @typeParam V - The type of the values in the cache.
 */
export class LFUCache<K, V> implements Cache<K, V> {
  private readonly cache: Map<K, DoubleLinkedListNode<Entry<K, V>>>;
  private readonly frequencyMap: Map<number, DoubleLinkedList<Entry<K, V>>>;
  private minFrequency: number;

  /**
   * Create a new LFUCache instance.
   *
   * @param capacity - The capacity of the cache.
   * @returns The LFUCache instance.
   * @throws {AssertionError} If the capacity is not a positive integer.
   */
  constructor(readonly capacity: number) {
    assertPositiveInteger(capacity, `The capacity(${capacity}) must be a positive integer`);
    this.cache = new Map();
    this.frequencyMap = new Map();
    this.minFrequency = 0;
  }

  /**
   * {@inheritDoc Cache.size}
   */
  get size() {
    return this.cache.size;
  }

  /**
   * {@inheritDoc Cache.get}
   */
  get(key: K): V | undefined {
    const cached = this.cache.get(key);
    if (!cached) {
      return undefined;
    }

    this.updateFrequency(cached);
    return cached.value.value;
  }

  /**
   * {@inheritDoc Cache.put}
   */
  put(key: K, value: V): V | undefined {
    const cached = this.cache.get(key);
    // If the entry exists, update the value and increase the frequency.
    if (cached) {
      const previousValue = cached.value.value;
      cached.value = { ...cached.value, value };
      this.updateFrequency(cached);
      return previousValue;
    }

    // If the cache is full, remove the least frequently used entry.
    if (this.cache.size >= this.capacity) {
      const frequencyList = this.retrieveFrequencyList(this.minFrequency);
      const lastNode = frequencyList.removeLast();
      assertDefined(lastNode, `The last node for frequency(${this.minFrequency}) must be defined`);
      this.cache.delete(lastNode.value.key);
    }

    const entry: Entry<K, V> = { key, value, frequency: 1 };
    this.minFrequency = entry.frequency;

    const newNode: DoubleLinkedListNode<Entry<K, V>> = { value: entry, prev: undefined, next: undefined };
    const frequencyList = this.retrieveFrequencyList(entry.frequency);
    frequencyList.addFirst(newNode);
    this.cache.set(key, newNode);
    return undefined;
  }

  /**
   * {@inheritDoc Cache.remove}
   */
  remove(key: K): boolean {
    const node = this.cache.get(key);
    if (!node) {
      return false;
    }

    const frequencyList = this.retrieveFrequencyList(node.value.frequency);
    frequencyList.remove(node);
    this.cache.delete(key);
    return true;
  }

  /**
   * {@inheritDoc Cache.clear}
   */
  clear(): void {
    this.cache.clear();
    this.frequencyMap.clear();
    this.minFrequency = 0;
  }

  private updateFrequency(node: DoubleLinkedListNode<Entry<K, V>>) {
    const entry = node.value;
    const oldFrequencyList = this.retrieveFrequencyList(entry.frequency);
    oldFrequencyList.remove(node);

    if (entry.frequency === this.minFrequency && oldFrequencyList.length === 0) {
      this.minFrequency++;
    }
    entry.frequency++;

    const newFrequencyList = this.retrieveFrequencyList(entry.frequency);
    const newNode: DoubleLinkedListNode<Entry<K, V>> = { value: entry, prev: undefined, next: undefined };
    newFrequencyList.addFirst(newNode);
  }

  private retrieveFrequencyList(frequency: number): DoubleLinkedList<Entry<K, V>> {
    let frequencyList = this.frequencyMap.get(frequency);
    if (!frequencyList) {
      frequencyList = new DoubleLinkedList<Entry<K, V>>();
      this.frequencyMap.set(frequency, frequencyList);
    }
    return frequencyList;
  }
}

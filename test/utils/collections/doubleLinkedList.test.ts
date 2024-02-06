import { DoubleLinkedList } from '@internal/utils/collections';
import { describe, expect, it } from 'vitest';

describe('DoubleLinkedList', () => {
  describe('constructor', () => {
    it('should create a new DoubleLinkedList instance', () => {
      // Act
      const list = new DoubleLinkedList<string>();

      // Assert
      expect(list).toBeDefined();
      expect(list.length).toBe(0);
    });
  });

  describe('addFirst', () => {
    it('should add a node to the first of the list', () => {
      // Arrange
      const list = new DoubleLinkedList<string>();
      const node = { value: 'Alice', prev: undefined, next: undefined };

      // Act
      list.addFirst(node);

      // Assert
      expect(list.length).toBe(1);
      expect(list.getFirst()).toBe(node);
      expect(list.getLast()).toBe(node);
    });

    it('should add a node to the first of the list with existing nodes', () => {
      // Arrange
      const list = new DoubleLinkedList<string>();

      // Act
      const node1 = { value: 'Alice', prev: undefined, next: undefined };
      list.addFirst(node1);
      const node2 = { value: 'Bob', prev: undefined, next: undefined };
      list.addFirst(node2);
      const node3 = { value: 'Charlie', prev: undefined, next: undefined };
      list.addFirst(node3);

      // Assert
      expect(list.length).toBe(3);
      expect(list.getFirst()).toBe(node3);
      expect(list.getLast()).toBe(node1);
    });
  });

  describe('remove', () => {
    it('should remove a node from the list', () => {
      // Arrange
      const list = new DoubleLinkedList<string>();
      const node1 = { value: 'Alice', prev: undefined, next: undefined };
      list.addFirst(node1);
      const node2 = { value: 'Bob', prev: undefined, next: undefined };
      list.addFirst(node2);
      const node3 = { value: 'Charlie', prev: undefined, next: undefined };
      list.addFirst(node3);

      // Act
      list.remove(node2);

      // Assert
      expect(list.length).toBe(2);
      expect(list.getFirst()).toBe(node3);
      expect(list.getLast()).toBe(node1);
    });

    it('should remove the only node from the list', () => {
      // Arrange
      const list = new DoubleLinkedList<string>();
      const node = { value: 'Alice', prev: undefined, next: undefined };
      list.addFirst(node);

      // Act
      list.remove(node);

      // Assert
      expect(list.length).toBe(0);
      expect(list.getFirst()).toBeUndefined();
      expect(list.getLast()).toBeUndefined();
    });

    it('should remove the first node from the list', () => {
      // Arrange
      const list = new DoubleLinkedList<string>();
      const node1 = { value: 'Alice', prev: undefined, next: undefined };
      list.addFirst(node1);
      const node2 = { value: 'Bob', prev: undefined, next: undefined };
      list.addFirst(node2);

      // Act
      list.remove(node1);

      // Assert
      expect(list.length).toBe(1);
      expect(list.getFirst()).toBe(node2);
      expect(list.getLast()).toBe(node2);
    });

    it('should remove the last node from the list', () => {
      // Arrange
      const list = new DoubleLinkedList<string>();
      const node1 = { value: 'Alice', prev: undefined, next: undefined };
      list.addFirst(node1);
      const node2 = { value: 'Bob', prev: undefined, next: undefined };
      list.addFirst(node2);

      // Act
      list.remove(node2);

      // Assert
      expect(list.length).toBe(1);
      expect(list.getFirst()).toBe(node1);
      expect(list.getLast()).toBe(node1);
    });

    it('should not remove a node that is not in the list', () => {
      // Arrange
      const list = new DoubleLinkedList<string>();
      const node1 = { value: 'Alice', prev: undefined, next: undefined };
      list.addFirst(node1);

      // Act
      const node2 = { value: 'Bob', prev: undefined, next: undefined };
      list.remove(node2);

      // Assert
      expect(list.length).toBe(1);
      expect(list.getFirst()).toBe(node1);
      expect(list.getLast()).toBe(node1);
    });
  });

  describe('removeLast', () => {
    it('should remove the last node from the list', () => {
      // Arrange
      const list = new DoubleLinkedList<string>();
      const node1 = { value: 'Alice', prev: undefined, next: undefined };
      list.addFirst(node1);
      const node2 = { value: 'Bob', prev: undefined, next: undefined };
      list.addFirst(node2);

      // Act
      const actual = list.removeLast();

      // Assert
      expect(actual).toBe(node1);
      expect(list.length).toBe(1);
      expect(list.getFirst()).toBe(node2);
      expect(list.getLast()).toBe(node2);
    });

    it('should remove the only node from the list', () => {
      // Arrange
      const list = new DoubleLinkedList<string>();
      const node = { value: 'Alice', prev: undefined, next: undefined };
      list.addFirst(node);

      // Act
      const actual = list.removeLast();

      // Assert
      expect(actual).toBe(node);
      expect(list.length).toBe(0);
      expect(list.getFirst()).toBeUndefined();
      expect(list.getLast()).toBeUndefined();
    });

    it('should return undefined if the list is empty', () => {
      // Arrange
      const list = new DoubleLinkedList<string>();

      // Act
      const actual = list.removeLast();

      // Assert
      expect(actual).toBeUndefined();
      expect(list.length).toBe(0);
      expect(list.getFirst()).toBeUndefined();
      expect(list.getLast()).toBeUndefined();
    });
  });
});

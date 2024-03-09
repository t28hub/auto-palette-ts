import type { Mutable } from '@internal/utils';
import { describe, expect, it } from 'vitest';

describe('types', () => {
  describe('Mutable', () => {
    it('should make the properties of the given type mutable', () => {
      // Act
      const mutable: Mutable<{
        readonly name: string;
      }> = { name: 'Alice' };
      mutable.name = 'Bob';

      // Assert
      expect(mutable).toMatchObject({ name: 'Bob' });
    });
  });
});

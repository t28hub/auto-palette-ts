import { describe, expect, it } from 'vitest';

import { Mutable } from './types';

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

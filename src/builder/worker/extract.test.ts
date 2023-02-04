import { describe, expect, it } from 'vitest';

import { loadImageData } from '../../test';

import { extract } from './extract';

describe('extract', () => {
  it('should extract colors from image', async () => {
    // Arrange
    const imageData = await loadImageData('flag_za.png');

    // Act
    const actual = extract(imageData, 'dbscan');

    // Assert
    expect(actual).toBeArrayOfSize(8);
  });
});

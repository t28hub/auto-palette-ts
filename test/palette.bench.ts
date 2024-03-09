import { type Options, Palette, luminanceFilter } from 'auto-palette';
import { bench, describe } from 'vitest';

import fixtures from './fixtures';
import { loadImageData } from './utils';

describe('Palette', () => {
  bench('extract colors from image using DBSCAN', async () => {
    // Arrange
    const image = await loadImageData(fixtures.photos.tulips);

    // Act
    const options: Options = {
      algorithm: 'dbscan',
      filters: [luminanceFilter()],
    };
    Palette.extract(image, options);
  });

  bench('extract colors from image using K-means', async () => {
    // Arrange
    const image = await loadImageData(fixtures.photos.tulips);

    // Act
    const options: Options = {
      algorithm: 'kmeans',
      filters: [luminanceFilter()],
    };
    Palette.extract(image, options);
  });
});

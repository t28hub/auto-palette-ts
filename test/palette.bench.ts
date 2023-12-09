import { Options, Palette, luminanceFilter } from 'auto-palette';
import { bench, describe } from 'vitest';

import fixtures from './fixtures';
import { loadImageDataFromFile } from './utils';

describe('Palette', () => {
  bench('extract colors from image using DBSCAN', async () => {
    // Arrange
    const image = await loadImageDataFromFile(fixtures.photos.kingfisher);

    // Act
    const options: Options = {
      algorithm: 'dbscan',
      filters: [luminanceFilter()],
    };
    Palette.extract(image, options);
  });

  bench('extract colors from image using K-means', async () => {
    // Arrange
    const image = await loadImageDataFromFile(fixtures.photos.kingfisher);

    // Act
    const options: Options = {
      algorithm: 'kmeans',
      filters: [luminanceFilter()],
    };
    Palette.extract(image, options);
  });
});

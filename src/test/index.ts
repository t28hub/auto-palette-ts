import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { createCanvas, Image } from '@napi-rs/canvas';

import { ImageData } from '../types';

/**
 * Load the image from the given filename.
 *
 * @param filename The image filename.
 * @return The loaded image.
 */
export async function loadImage(filename: string): Promise<Image> {
  const filepath = join(__dirname, 'fixtures', filename);
  const contents = await readFile(filepath, { flag: 'r' });

  const image = new Image();
  image.src = contents;
  return image;
}

/**
 * Load the image data from the given filename.
 *
 * @param filename The image filename.
 * @return The loaded image data.
 */
export async function loadImageData(filename: string): Promise<ImageData<Uint8ClampedArray>> {
  const image = await loadImage(filename);
  const { width, height } = image;
  const canvas = createCanvas(width, height);
  const context = canvas.getContext('2d');
  context.drawImage(image, 0, 0, width, height);
  return context.getImageData(0, 0, width, height);
}

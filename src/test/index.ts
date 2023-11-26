import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { createCanvas, Image } from '@napi-rs/canvas';

/**
 * Load the image from a given file.
 *
 * @param filename - The name of the image file.
 * @return A Promise that resolves to the loaded image.
 * @see {@link loadImageData}
 */
export async function loadImage(filename: string): Promise<Image> {
  const filepath = join(__dirname, 'fixtures', filename);
  const contents = await readFile(filepath, { flag: 'r' });

  const image = new Image();
  image.src = contents;
  return image;
}

/**
 * Load the image from a given file as ImageData object.
 *
 * @param filename - The name of the image file.
 * @return A Promise that resolves to the loaded image as ImageData object.
 * @see {@link loadImage}
 */
export async function loadImageData(filename: string): Promise<ImageData> {
  const image = await loadImage(filename);
  const { width, height } = image;
  const canvas = createCanvas(width, height);
  const context = canvas.getContext('2d');
  context.drawImage(image, 0, 0, width, height);
  return context.getImageData(0, 0, width, height);
}

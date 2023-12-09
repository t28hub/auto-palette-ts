import { readFile } from 'node:fs/promises';

import { Image, createCanvas } from '@napi-rs/canvas';

/**
 * Load the image from a given file as ImageData object.
 *
 * @param filepath - The path to the image file.
 * @return A Promise that resolves to the loaded image as ImageData object.
 * @see {@link loadImageDataFromUrl}
 */
export async function loadImageDataFromFile(filepath: string): Promise<ImageData> {
  const contents = await readFile(filepath, { flag: 'r' });
  const image = new Image();
  image.src = contents;
  return toImageData(image);
}

/**
 * Convert an Image object to an ImageData object.
 *
 * @param image - The Image object to be converted.
 * @returns The converted ImageData object.
 */
function toImageData(image: Image): ImageData {
  const { width, height } = image;
  const canvas = createCanvas(width, height);
  const context = canvas.getContext('2d', { alpha: true, colorSpace: 'srgb' });
  context.drawImage(image, 0, 0, width, height);
  return context.getImageData(0, 0, width, height);
}

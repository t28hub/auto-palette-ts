import { createCanvas, loadImage } from '@napi-rs/canvas';

/**
 * Load the image from a given file as ImageData object.
 *
 * @param path - The path to the image file.
 * @return A Promise that resolves to the loaded image as ImageData object.
 */
export async function loadImageData(path: string): Promise<ImageData> {
  const image = await loadImage(path);
  const canvas = createCanvas(image.width, image.height);
  const context = canvas.getContext('2d', { alpha: true, colorSpace: 'srgb' });
  context.drawImage(image, 0, 0);
  return context.getImageData(0, 0, image.width, image.height);
}

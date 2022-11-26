import { Palette, PaletteGenerator } from './palette';
import { timed } from './utils';

const MAX_IMAGE_SIZE = 192 * 192;

export function fromImage(image: HTMLImageElement): Promise<Palette> {
  if (!image.complete) {
    throw new TypeError(`Image(src=${image.src}) is not loaded`);
  }

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Failed to retrieve 2d context from canvas');
  }

  const imageWidth = image.naturalWidth;
  const imageHeight = image.naturalHeight;
  if (imageWidth === 0 || imageHeight === 0) {
    throw new TypeError(`The image(src=${image.src}) is empty: width=${imageWidth}, height=${imageHeight}`);
  }

  // Resize the image on main thread since OffscreenCanvas is not supported by some browsers.
  // [OffscreenCanvas | Can I use...](https://caniuse.com/offscreencanvas)
  const imageSize = imageWidth * imageHeight;
  const scale = Math.sqrt(MAX_IMAGE_SIZE / imageSize);
  const width = Math.floor(imageWidth * scale);
  const height = Math.floor(imageHeight * scale);

  canvas.width = width;
  canvas.height = height;
  context.drawImage(image, 0, 0, width, height);

  try {
    const imageData = context.getImageData(0, 0, width, height, { colorSpace: 'srgb' });
    const generator = new PaletteGenerator();
    return timed('palette', () => generator.generate(imageData, 8));
  } catch (e) {
    throw new Error('Failed to get ImageData from an image');
  }
}

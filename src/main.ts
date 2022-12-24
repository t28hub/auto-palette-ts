import { load } from './image';
import { Palette, PaletteBuilder } from './palette';

const MAX_IMAGE_SIZE = 192 * 192;

export async function fromImage(imageElement: HTMLImageElement, maxColors = 5): Promise<Palette> {
  const image = await load(imageElement);
  const resized = image.resize(MAX_IMAGE_SIZE);
  const imageData = resized.getImageData();
  const builder = new PaletteBuilder();
  return await builder.builder(imageData, maxColors);
}

import { load } from './image';
import { Palette, PaletteGenerator } from './palette';

const MAX_IMAGE_SIZE = 192 * 192;

export async function fromImage(imageElement: HTMLImageElement): Promise<Palette> {
  const image = await load(imageElement);
  const resized = image.resize(MAX_IMAGE_SIZE);
  const imageData = resized.getImageData();
  const generator = new PaletteGenerator();
  return await generator.generate(imageData, 8);
}

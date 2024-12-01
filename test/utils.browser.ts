/**
 * Load the image from a given source URL.
 *
 * @param src - The source URL of the image.
 * @returns A Promise that resolves to the loaded image.
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.src = src;
    image.crossOrigin = 'Anonymous';
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.onabort = reject;
  });
}

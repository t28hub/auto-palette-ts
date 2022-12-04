/**
 * The image class.
 */
export interface Image {
  /**
   * The width of this image.
   */
  readonly width: number;

  /**
   * The height of this image.
   */
  readonly height: number;

  /**
   * Return the image data of this image
   *
   * @return The image data of this image.
   */
  getImageData(): ImageData;

  /**
   * Resize this image.
   *
   * @param area The area of resized image.
   * @return The resized image.
   */
  resize(area: number): Image;
}

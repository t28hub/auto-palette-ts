export interface ImageData<T extends Uint8ClampedArray | ArrayBuffer> {
  /**
   * The height of this image.
   */
  readonly height: number;

  /**
   * The width of this image.
   */
  readonly width: number;

  /**
   * The pixels of this image in the RGBA order.
   */
  readonly data: T;
}

import { ID } from '../../utils';

/**
 * Type representing extract message.
 */
export type ExtractMessage = {
  /**
   * The type of this message.
   */
  readonly type: 'extract';

  /**
   * The payload of this message.
   */
  readonly payload: {
    /**
     * The ID of caller.
     */
    readonly id: ID;

    /**
     * The image to extract.
     */
    readonly image: {
      /**
       * The width of the image.
       */
      readonly width: number;

      /**
       * The height of the image.
       */
      readonly height: number;

      /**
       * The pixels of the image.
       */
      readonly pixels: ArrayBuffer;
    };

    /**
     * The maximum colors to be extracted.
     */
    readonly maxColors: number;
  };
};

import { Algorithm, ImageData } from '../../types';
import { ID } from '../../utils';

/**
 * Type representing request message.
 */
export type RequestMessage = {
  /**
   * The type of this message.
   */
  readonly type: 'request';

  /**
   * The payload of this message.
   */
  readonly payload: {
    /**
     * The ID of caller.
     */
    readonly id: ID;

    /**
     * The algorithm to be used.
     */
    readonly algorithm: Algorithm;

    /**
     * The image to extract.
     */
    readonly imageData: ImageData<ArrayBuffer>;

    /**
     * The maximum colors to be extracted.
     */
    readonly maxColors: number;
  };
};

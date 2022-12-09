import { PackedColor } from '../../color';
import { ID } from '../../utils';

/**
 * Type representing response message.
 */
export type ResponseMessage = {
  /**
   * Type of this event.
   */
  readonly type: 'response';
  /**
   * Payload of this event.
   */
  readonly payload: {
    /**
     * The ID of caller.
     */
    readonly id: ID;

    /**
     * The extraction results.
     */
    readonly results: {
      /**
       * The packed feature color.
       */
      readonly color: PackedColor;

      /**
       * The population of feature color.
       */
      readonly population: number;
    }[];
  };
};

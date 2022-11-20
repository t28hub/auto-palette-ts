import { PackedColor } from '../../color';
import { ID } from '../../utils';

/**
 * Type representing complete message.
 */
export type CompleteMessage = {
  /**
   * Type of this event.
   */
  readonly type: 'complete';
  /**
   * Payload of this event.
   */
  readonly payload: {
    /**
     * The ID of caller.
     */
    readonly id: ID;

    /**
     * The extracted packed colors.
     */
    readonly result: ReadonlyArray<PackedColor>;
  };
};

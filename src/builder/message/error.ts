import { ID } from '../../utils';

/**
 * Type representing error response message.
 */
export type ErrorResponseMessage = {
  /**
   * The type of this event.
   */
  readonly type: 'error';

  /**
   * The payload of this event.
   */
  readonly payload: {
    /**
     * The ID of caller.
     */
    readonly id: ID;

    /**
     * The error message.
     */
    readonly message: string;
  };
};

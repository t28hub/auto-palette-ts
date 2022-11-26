import { PackedColor } from '../../color';
import { ExtractionResult } from '../../extractor';
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
     * The extraction results.
     */
    readonly results: ExtractionResult<PackedColor>[];
  };
};

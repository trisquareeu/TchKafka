import type { Int16 } from '../../int16';

/**
 * bit 5: isControlBatch (0 means not a control batch)
 *
 * A control batch contains a single record called the control record. Control records should not be passed on
 * to applications. Instead, they are used by consumers to filter out aborted transactional messages.
 *
 * @see: https://kafka.apache.org/documentation/#messageformat
 */
export class IsControlBatch {
  public static readonly No = 0b00000000_00000000;
  public static readonly Yes = 0b00000000_00100000;

  public static fromInt16({ value }: Int16): IsControlBatchValue {
    return (value & IsControlBatch.Yes) as IsControlBatchValue;
  }
}

export type IsControlBatchValue = typeof IsControlBatch.No | typeof IsControlBatch.Yes;
